/*@@parte:01_motor.js*/
(function(){
'use strict';
var $=function(id){return document.getElementById(id)};
var stage=$('stage'),card=$('card');
function fail(msg){$('cardText').textContent=msg;$('playBtn').hidden=true;$('worlds').hidden=true}
if(!window.THREE){fail('Não foi possível carregar o motor 3D. Confira a conexão e abra de novo.');return}
var T=THREE;
try{T.ColorManagement.legacyMode=false}catch(e){}
var coarse=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
if(coarse)document.documentElement.classList.add('touch');
/* modo leve: em celular troca o material PBR (pesado no GPU) por Lambert (difuso, bem mais barato). ?lite=0/1 força. */
var LITE=coarse;try{var _sc=JSON.parse(localStorage.getItem('rumo-ao-cume-cfg')),_p=_sc&&_sc.preset;if(_sc&&_sc.pMig!==1)_p=_p==='med'?'low':_p;if(_p==='vlow')_p='low';
  if(_sc&&(_p==='custom'?_sc.full:(_p==='high'||_p==='ultra'||_p==='max')))LITE=false;
  if(!coarse&&_p==='low')LITE=true}catch(e){}/* PC no Baixo: mesmo modo leve do celular (iluminação simples, bem mais rápido em vídeo integrado) *//* Alto, Ultra e Máximo no celular = visual completo; Baixo, Médio e Automático usam o modo leve */
try{var _lq=/[?&]lite=(\d)/.exec(location.search);if(_lq)LITE=_lq[1]==='1'}catch(e){}
if(LITE){(function(){
  /* Lambert: luz calculada nos cantos dos objetos — o mais leve para celular (o Phong por pixel pesou demais) */
  var LM=T.MeshLambertMaterial,skip={roughness:1,metalness:1,envMapIntensity:1,bumpMap:1,bumpScale:1,normalMap:1,normalScale:1,roughnessMap:1,metalnessMap:1,flatShading:1};
  T.MeshStandardMaterial=function(o){var p={};if(o)for(var k in o){if(!skip[k])p[k]=o[k]}return new LM(p)};
})()}
var shLite=false,shFrame=0;
function shLiteApply(){if(!W)return;W.traverse(function(o){if(!o.isMesh)return;if(o.userData.cs0===undefined)o.userData.cs0=o.castShadow;
  o.castShadow=o.userData.cs0&&!(shLite&&o.isInstancedMesh)})}/* no Médio, árvores, rochas e cristais do fundo não fazem sombra */
var bench=null,benchOv=null,cfgView=null,cmpBase=null,needReload=false;
var CFGKEY='rumo-ao-cume-cfg',gPart=1,gFx=1,bumpOn=null,shadowOn=null,bumpReg=[],matReg=[];
/* placa de vídeo fraca no PC (vídeo integrado Intel/AMD): Ultra e Máximo não passam da resolução da tela */
var gpuName='',weakG=false;try{var _gc=document.createElement('canvas').getContext('webgl'),_gi=_gc&&_gc.getExtension('WEBGL_debug_renderer_info');gpuName=_gi?String(_gc.getParameter(_gi.UNMASKED_RENDERER_WEBGL)):'';
  weakG=!coarse&&/intel|swiftshader|llvmpipe|radeon\(tm\) (r\d |vega|graphics)|microsoft basic|mali|powervr|adreno|videocore/i.test(gpuName)/* mali/powervr/adreno sem tela de toque = TV/TV box (Fire TV etc.) */&&!/arc\(tm\) a\d|arc a\d/i.test(gpuName);/* Intel Arc dedicada fica de fora */
  try{if(/[?&]weakg=(\d)/.test(location.search))weakG=RegExp.$1==='1'}catch(e){}
  var _lx=_gc&&_gc.getExtension('WEBGL_lose_context');if(_lx)_lx.loseContext()}catch(e){}
var lowG=coarse||weakG;
var PRESETS={
  low:{res:coarse?.9:.8,cap:1.35,shadows:false,bloom:false,bump:true,part:1,fx:1,shMap:1024,lush:.5,css:1,lawn:1},/* Baixo: o mais leve — cenário leve, luz por pixel com relevo, sem pós-processo */
  med:{res:coarse?.85:.8,cap:1.4,shadows:true,shLite:1,bloom:false,bump:true,part:2,fx:1,shMap:coarse?768:1024,aniso:8,sat:coarse?1:1.15,css:coarse?1:0,lush:coarse?.62:.55,lawn:1},/* no celular: sem pós-processo (brilho/cor por filtro leve), materiais leves *//* Médio: perto do Alto — materiais completos, sombras, brilho e cor viva, com menos resolução e cenário um pouco menos cheio */
  high:{res:1,cap:coarse?1.5:2,shadows:true,bloom:true,bump:true,part:2,fx:2,shMap:coarse?1024:2048,sharp:0,aniso:8,sat:1.22,lush:.75},/* Alto: visual completo e cor viva, um degrau abaixo do Ultra (sem filtro de nitidez, cenário um pouco menos denso) */
  max:{res:lowG?1:2,cap:coarse?1.75:2,maxPR:3,px:coarse?5e6:13e6,shadows:true,bloom:true,bump:true,part:2,fx:2,shMap:lowG?2048:8192,sharp:1,aniso:16,sat:1.22,lush:1},
  ultra:{res:lowG?1:1.5,cap:coarse?1.6:2,maxPR:lowG?2:3,shadows:true,bloom:true,bump:true,part:2,fx:2,shMap:coarse?1536:(weakG?2048:4096),sharp:1,aniso:16,sat:1.22,lush:1}
};
var AUTO=['low','med','high','ultra'],PARTM=[.5,.75,1];
var cfg={preset:'auto',c:null,fps:false,cap:60,aa:!coarse,snd:true,mus:true};
try{var _cs=JSON.parse(localStorage.getItem(CFGKEY));if(_cs&&typeof _cs==='object')for(var _k in _cs)cfg[_k]=_cs[_k]}catch(e){}
if(!cfg.c)cfg.c=JSON.parse(JSON.stringify(PRESETS.high));
/* suavização de bordas: no celular liga em tudo menos no Baixo (em GPU de celular ela custa pouco) */
if(cfg.pMig!==1){cfg.pMig=1;if(cfg.preset==='med')cfg.preset='low'}if(cfg.preset==='vlow')cfg.preset='low';if(cfg.aaMig!==2){cfg.aaMig=2;if(coarse)cfg.aa=true;try{localStorage.setItem(CFGKEY,JSON.stringify(cfg))}catch(e){}}
function saveCfg(){try{localStorage.setItem(CFGKEY,JSON.stringify(cfg))}catch(e){}}

function lerp(a,b,t){return a+(b-a)*t}
function clamp(v,a,b){return v<a?a:v>b?b:v}
function approach(v,t,d){return v<t?Math.min(t,v+d):Math.max(t,v-d)}
function rnd(seed){var s=seed>>>0;return function(){s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
var HY=.85;

/* ===================== renderer, cena, câmera ===================== */
/* cor do modo leve: a mesma correção de cor do Alto (saturação, contraste e tom quente/frio) feita dentro do próprio desenho,
   sem filtro CSS por cima da tela (o filtro custa uma passada extra no celular) */
var GRADE=LITE?{sat:1,con:.06,exp:1.22}:null;try{if(window.__grade!==undefined)GRADE=window.__grade}catch(e){}
if(GRADE)T.ShaderChunk.tonemapping_fragment=['#if defined( TONE_MAPPING )','gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );',
  '{vec3 c=gl_FragColor.rgb;float l0=dot(c,vec3(.2126,.7152,.0722));c=clamp(mix(vec3(l0),c,'+GRADE.sat.toFixed(3)+'),0.,1.);',
  'c=mix(c,c*c*(3.-2.*c),'+GRADE.con.toFixed(3)+');float l=dot(c,vec3(.299,.587,.114));',
  'c=mix(c,c*vec3(1.05,1.0,.93),smoothstep(.4,1.,l));c=mix(c,c*vec3(.93,.98,1.06),1.-smoothstep(0.,.5,l));gl_FragColor.rgb=c;}','#endif'].join('\n');
var renderer;
try{renderer=new T.WebGLRenderer({antialias:!!cfg.aa,powerPreference:'high-performance'})}
catch(err){fail('Seu navegador não conseguiu iniciar o gráfico 3D (WebGL).');return}
renderer.outputEncoding=T.sRGBEncoding;
renderer.toneMapping=T.ACESFilmicToneMapping;
renderer.toneMappingExposure=1;
renderer.shadowMap.enabled=false;
renderer.shadowMap.type=coarse?T.PCFShadowMap:T.PCFSoftShadowMap;/* celular: sombra com metade das leituras por pixel */
stage.appendChild(renderer.domElement);
var maxAniso=Math.min(8,renderer.capabilities.getMaxAnisotropy()),hwAniso=renderer.capabilities.getMaxAnisotropy(),curAniso=maxAniso,texList=[];

var scene=new T.Scene();
var camera=new T.PerspectiveCamera(38,1,.1,400);
scene.fog=new T.FogExp2(new T.Color('#cddfea'),.0105);
var hemi=new T.HemisphereLight(0xcfe6ff,0x5b4b3a,.18);scene.add(hemi);
var sun=new T.DirectionalLight(0xfff0d6,2.3);
sun.castShadow=true;
sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=16;sun.shadow.camera.bottom=-16;
sun.shadow.camera.near=1;sun.shadow.camera.far=80;sun.shadow.bias=-.0004;sun.shadow.normalBias=.03;
scene.add(sun);scene.add(sun.target);
var lantern=new T.PointLight(0xffd9a0,0,18,1.6);scene.add(lantern);

function skyTex(st){
  var c=document.createElement('canvas');c.width=4;c.height=512;
  var x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,512);
  g.addColorStop(0,st[0]);g.addColorStop(.35,st[1]);g.addColorStop(.62,st[2]);g.addColorStop(1,st[3]);
  x.fillStyle=g;x.fillRect(0,0,4,512);
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
}
function makeEnv(top,hor,bot,blob,k){
  var s=new T.Scene(),g=new T.SphereGeometry(50,32,16),pos=g.attributes.position,cols=[];
  var ct=new T.Color(top).multiplyScalar(k),ch=new T.Color(hor).multiplyScalar(k),cb=new T.Color(bot).multiplyScalar(k),c=new T.Color();
  for(var i=0;i<pos.count;i++){
    var y=pos.getY(i)/50;
    if(y>0)c.copy(ch).lerp(ct,Math.pow(y,.6));else c.copy(ch).lerp(cb,Math.min(1,-y*1.6));
    cols.push(c.r,c.g,c.b);
  }
  g.setAttribute('color',new T.Float32BufferAttribute(cols,3));
  s.add(new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide})));
  var bl=new T.Mesh(new T.SphereGeometry(4,16,8),new T.MeshBasicMaterial({color:new T.Color(blob[0],blob[1],blob[2])}));
  bl.position.set(-20,28,22);s.add(bl);
  var pm=new T.PMREMGenerator(renderer),tex=pm.fromScene(s,.02).texture;pm.dispose();
  return tex;
}
var ENVS=[
  makeEnv('#6fa6e0','#fff1da','#3b3a35',[6,5,3.8],1),
  makeEnv('#1b1f60','#3a2f78','#08080f',[.5,.7,2],.55),
  makeEnv('#7fa6e0','#ffd9c0','#8a93b0',[6,4,2.5],1),
  makeEnv('#3fa6d0','#bff5ea','#0b3a52',[3,6,6],1),
  makeEnv('#1a1040','#4a3070','#0a0612',[.8,1,2.4],.7),
  makeEnv('#6a5440','#c49a6e','#2a1c10',[.8,1.4,3],.75)
];
var THEMES=[
  {name:'valley',sky:['#2f6db4','#6fa8dc','#cfe2ee','#bccbd0'],fog:'#cddfea',fd:.0105,sun:0xfff0d6,si:2.3,sunOff:[-14,24,16],hemi:[0xcfe6ff,0x5b4b3a,.18],exp:.82,env:0,lantern:0,snow:false,mz:-45,valley:0x34401f},
  {name:'cave',sky:['#22160e','#3e2a1a','#5e4228','#2e2014'],fog:'#5a4230',fd:.011,sun:0xffe6c4,si:1.9,sunOff:[-10,26,14],hemi:[0xbcd6ff,0x6a4628,.85],exp:1.08,env:5,lantern:3.5,snow:false,mz:-26,valley:0x3a2818},
  {name:'forest',sky:['#2f8c86','#76cc9c','#d6f2a8','#bfe4ac'],fog:'#a4d49a',fd:.0125,sun:0xfff0c0,si:2.1,sunOff:[-16,26,16],hemi:[0xd8f5c8,0x2f4a2a,.32],exp:.86,env:0,lantern:0,snow:false,mz:-45,valley:0x1d3a22},
  {name:'reef',sky:['#0e4f86','#1a86b0','#2fb4c0','#1f9aa8'],fog:'#2a9cae',fd:.02,sun:0xe8fcff,si:2.1,sunOff:[-10,28,14],hemi:[0x9ff0ff,0x0f4a5a,.6],exp:.9,env:3,lantern:0,snow:false,mz:-42,valley:0x0f4a62},
  {name:'castle',sky:['#0a0a1c','#1b1038','#3a1f4a','#161226'],fog:'#1a1228',fd:.016,sun:0x8a9cff,si:1.25,sunOff:[-12,26,14],hemi:[0x7a7ad0,0x2a1a3a,.85],exp:1.15,env:4,lantern:5,snow:false,mz:-30,valley:0x120c20},
  {name:'peaks',sky:['#4a7cc4','#7eaee0','#c8dcee','#e2ebf4'],fog:'#d4e0ec',fd:.011,sun:0xfff4e4,si:1.7,sunOff:[-12,26,14],hemi:[0xb4c8e4,0x4a5c78,.5],exp:.78,env:0,lantern:0,snow:true,mz:-45,valley:0x8ea2ba},
  {name:'ruins',sky:['#b8582a','#e8873c','#f8c27a','#efd29a'],fog:'#e8b678',fd:.0115,sun:0xffd6a0,si:2.25,sunOff:[-14,22,16],hemi:[0xffe0b8,0x84502c,.42],exp:.84,env:2,lantern:0,snow:true,sandFx:true,mz:-45,valley:0xb8864a},
  {name:'village',sky:['#050a1c','#0d1838','#1f2c58','#2a2a48'],fog:'#121a34',fd:.012,sun:0xc4ccf0,si:1.15,sunOff:[-14,26,12],hemi:[0x9aa4d0,0x2a2430,.7],exp:1.08,env:4,lantern:3.2,snow:true,petal:true,mz:-40,valley:0x0e1426},
  {name:'heights',sky:['#4a9ae0','#86c4ee','#d6eef6','#e6f2f4'],fog:'#d2e8f2',fd:.0042,sun:0xfff0d6,si:2.2,sunOff:[-14,30,16],hemi:[0xcfe6ff,0x6a7a4a,.5],exp:.84,env:0,lantern:0,snow:false,mz:-45,valley:0x34401f},
  {name:'volcano',sky:['#1a0814','#3a0e18','#7a1a1a','#c8301a'],fog:'#2a0c0c',fd:.014,sun:0xffb080,si:1.5,sunOff:[-12,26,14],hemi:[0xc87a6a,0x2a0a0a,.45],exp:.95,env:5,lantern:1.6,snow:true,ash:true,mz:-40,valley:0x2a0a08},
  {name:'summit',sky:['#1c2766','#6e58a6','#f0997c','#ffdca6'],fog:'#e6bdb0',fd:.0062,sun:0xffd6a8,si:2.1,sunOff:[-18,18,14],hemi:[0xffdcd0,0x5a6488,.55],exp:.86,env:0,lantern:0,snow:true,mz:-45,valley:0x8a92b4},
  {name:'trail',sky:['#1f78d0','#5cb4ee','#c4e8f8','#cfeee6'],fog:'#bfe2ee',fd:.0062,sun:0xfff2d6,si:2.35,sunOff:[-14,26,16],hemi:[0xd6f0ff,0x5a4a2a,.26],exp:.84,env:0,lantern:0,snow:false,petal:false,mz:-45,valley:0x2e5a1e},
  {name:'sky',sky:['#3a5ab8','#7a8ae0','#f2b0a0','#ffd8a8'],fog:'#e8c8c8',fd:.0045,sun:0xffe2c0,si:2.2,sunOff:[-16,24,16],hemi:[0xffe8e0,0x6a6a9a,.5],exp:.86,env:0,lantern:0,snow:false,mz:-45,valley:0x5a6a9a},
  {name:'tower',sky:['#04081a','#0a1434','#16244a','#1c2a46'],fog:'#101a30',fd:.009,sun:0xaab8f0,si:1.1,sunOff:[-10,26,14],hemi:[0x8a9ad0,0x1e2418,.85],exp:1.22,env:4,lantern:0,snow:false,mz:-40,valley:0x0a1222},
  {name:'mine',sky:['#120a06','#1e120a','#2a1a10','#1a100a'],fog:'#2c1c12',fd:.0095,sun:0xffd8a8,si:1.7,sunOff:[-10,24,14],hemi:[0xffd8b0,0x4a3424,1.3],exp:1.5,env:5,lantern:3.6,snow:false,mz:-30,valley:0x1a100a},
  /* 15: região mineradora seca em cima da mina (Mundo 15, parte 1) — monta como o Vale, mas sem grama: terra, pedra e poeira */
  {name:'valley',dry:1,sky:['#4a7cb4','#8cb2d2','#e8d4b2','#dcc29e'],fog:'#dcc6a2',fd:.0105,sun:0xffe2b4,si:2.3,sunOff:[-14,24,16],hemi:[0xffe6c4,0x6a4a30,.24],exp:.84,env:0,lantern:0,snow:false,mz:-45,valley:0x9a7650},
  /* 16: Vale das Cachoeiras (Mundo 16) — meio-dia, céu bem azul, água por todo lado; monta como o Vale (grama, árvores) e ganha cachoeiras, rio e o castelo lá longe */
  {name:'valley',falls:1,sky:['#2a7fd8','#5cb0ee','#c6ecfa','#d4f0ea'],fog:'#cdeaf2',fd:.0085,sun:0xfff4dc,si:2.4,sunOff:[-12,30,16],hemi:[0xd6f0ff,0x4a5a3a,.26],exp:.84,env:0,lantern:0,snow:false,mz:-45,valley:0x3a6a24},
  /* 17: Labirinto de Tijolos (Mundo 17) — subterrâneo de tijolos e concreto, luz quente de tochas */
  {name:'maze',sky:['#1a120c','#2a1c12','#3a2618','#24170e'],fog:'#2a1c12',fd:.006,sun:0xffe2b8,si:1.7,sunOff:[-10,26,16],hemi:[0xffe4c8,0x5a4030,1.25],exp:1.35,env:5,lantern:0,snow:false,mz:-30,valley:0x2a1c12},
  /* 18: Ruínas de Tijolos (área de fora do Mundo 17) — fim de tarde virando noite */
  {name:'valley',dusk:1,sky:['#1e1640','#5a2e66','#e0785a','#ffb070'],fog:'#c88070',fd:.0095,sun:0xffa860,si:1.7,sunOff:[-22,10,12],hemi:[0xffc8a8,0x3a2a48,.42],exp:.92,env:0,lantern:0,snow:false,mz:-45,valley:0x3a3a28},
  /* 19: Lago da Aurora (Mundo 18) — fim de tarde de inverno (dono, 31/10): sol baixo alaranjado, aurora começando a aparecer; monta como a Montanha Gelada (neve, pinheiros) */
  {name:'peaks',aurora:1,dusk:1,sky:['#1a2352','#5a4a8c','#e8907a','#ffc890'],fog:'#b88a9a',fd:.0058,sun:0xffa860,si:2.0,sunOff:[-24,9,14],hemi:[0xffd4bc,0x3a3a62,.38],exp:.78,env:0,lantern:0,snow:true,mz:-45,valley:0x1a2a40},
  /* 20: O Naufrágio (Mundo 19) — praia e mar aberto debaixo de tempestade */
  {name:'wreck',wreck:1,sky:['#2a3442','#45525f','#6a7682','#8a949c'],fog:'#5e6a74',fd:.0105,sun:0xc8d2dc,si:1.05,sunOff:[-12,26,14],hemi:[0xa8b8c8,0x30302c,.95],exp:.95,env:0,lantern:0,snow:false,mz:-45,valley:0x2a3440}
];
var curTheme=THEMES[0];

/* ===================== texturas procedurais (PBR) ===================== */
function noiseGrid(size,cells,r){
  var g=new Float32Array(cells*cells),i;
  for(i=0;i<g.length;i++)g[i]=r();
  var out=new Float32Array(size*size);
  for(var y=0;y<size;y++){
    var fy=y/size*cells,y0=Math.floor(fy),ty=fy-y0;ty=ty*ty*(3-2*ty);
    var ya=(y0%cells)*cells,yb=((y0+1)%cells)*cells;
    for(var x=0;x<size;x++){
      var fx=x/size*cells,x0=Math.floor(fx),tx=fx-x0;tx=tx*tx*(3-2*tx);
      var xa=x0%cells,xb=(x0+1)%cells;
      out[y*size+x]=lerp(lerp(g[ya+xa],g[ya+xb],tx),lerp(g[yb+xa],g[yb+xb],tx),ty);
    }
  }
  return out;
}
function fbm(size,r){
  var o=[noiseGrid(size,4,r),noiseGrid(size,8,r),noiseGrid(size,16,r),noiseGrid(size,32,r)],w=[.45,.28,.17,.1];
  var out=new Float32Array(size*size);
  for(var i=0;i<out.length;i++){
    var v=o[0][i]*w[0]+o[1][i]*w[1]+o[2][i]*w[2]+o[3][i]*w[3];
    out[i]=clamp((v-.25)/.5,0,1);
  }
  return out;
}
function makeTex(size,seed,fn){
  var r=rnd(seed),h=fbm(size,r);
  var c1=document.createElement('canvas'),c2=document.createElement('canvas');
  c1.width=c1.height=c2.width=c2.height=size;
  var x1=c1.getContext('2d'),x2=c2.getContext('2d'),i1=x1.createImageData(size,size),i2=x2.createImageData(size,size),d1=i1.data,d2=i2.data;
  for(var y=0;y<size;y++)for(var x=0;x<size;x++){
    var i=y*size+x,c=fn(h[i],x,y,r),k=i*4;
    d1[k]=clamp(c[0],0,255);d1[k+1]=clamp(c[1],0,255);d1[k+2]=clamp(c[2],0,255);d1[k+3]=255;
    var v=clamp(h[i]*255+(c[3]||0),0,255);
    d2[k]=d2[k+1]=d2[k+2]=v;d2[k+3]=255;
  }
  x1.putImageData(i1,0,0);x2.putImageData(i2,0,0);
  var m=new T.CanvasTexture(c1),b=new T.CanvasTexture(c2);
  [m,b].forEach(function(t){t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=maxAniso;texList.push(t)});
  m.encoding=T.sRGBEncoding;
  return {map:m,bump:b};
}
var TEX_SIZE=coarse?192:256;
var texGrass=makeTex(TEX_SIZE,11,function(h,x,y,r){var s=(r()-.5)*28;return [lerp(58,140,h)+s*.6,lerp(98,178,h)+s,lerp(36,68,h)+s*.4,(r()-.5)*40]});
var texDirt=makeTex(TEX_SIZE,23,function(h,x,y,r){var s=(r()-.5)*22;if(r()<.004)return [152,146,138,40];return [lerp(84,150,h)+s,lerp(60,108,h)+s*.8,lerp(40,76,h)+s*.6]});
var texStone=makeTex(TEX_SIZE,37,function(h,x,y,r){var s=(r()-.5)*9,k=h<.28?.82:1;return [lerp(128,176,h)*k+s,lerp(124,170,h)*k+s,lerp(116,156,h)*k+s]});
var texBrick=makeTex(TEX_SIZE,59,function(h,x,y,r){
  var u=TEX_SIZE/4,v=TEX_SIZE/8,row=Math.floor(y/v),xx=x+(row%2?u/2:0),col=Math.floor(xx/u),fx=xx%u,fy=y%v;
  var bh=Math.sin(col*12.9898+row*78.233)*43758.5453;bh=bh-Math.floor(bh);
  var mortar=fy<2.5||fx<2.5||fy>v-1||false;
  var s=(r()-.5)*10;
  if(mortar)return [62+s*.5,62+s*.5,66+s*.5,-110];
  var k=.82+bh*.3,edge=(fy<5||fx<5)?1.08:1;
  return [(lerp(132,168,h)*k*edge)+s,(lerp(131,166,h)*k*edge)+s,(lerp(138,174,h)*k*edge)+s,8];
});
var texWood=makeTex(TEX_SIZE,41,function(h,x,y,r){
  var band=Math.floor(y/32),gx=Math.sin(x*.09+h*10+band*3.1)*.5+.5,t=.5*gx+.5*h,k=(y%32)<2?.5:1;
  return [lerp(120,198,t)*k,lerp(78,140,t)*k,lerp(44,88,t)*k,(y%32)<2?-90:0];
});
var texSnow=makeTex(TEX_SIZE,53,function(h,x,y,r){var s=(r()-.5)*8;return [lerp(205,244,h)+s,lerp(222,250,h)+s,lerp(238,255,h)+s,(r()-.5)*20]});
function regBump(m,b){bumpReg.push([m,b]);if(bumpOn===false)m.bumpMap=null;return m}
function pbr(t,rough,bump,extra){
  var o={map:t.map,bumpMap:t.bump,bumpScale:bump,roughness:rough,metalness:0},k;
  for(k in extra)o[k]=extra[k];
  var m=new T.MeshStandardMaterial(o);matReg.push(m);return regBump(m,t.bump);
}
function M(c,rough,metal,extra){
  var o={color:c,roughness:rough===undefined?.7:rough,metalness:metal||0},k;
  for(k in extra)o[k]=extra[k];
  var m=new T.MeshStandardMaterial(o);matReg.push(m);return m;
}
var grassM=pbr(texGrass,.92,1.4),dirtM=pbr(texDirt,.97,1.6),stoneM=pbr(texStone,.9,.12),woodM=pbr(texWood,.7,.8);
var meadowM=pbr(texGrass,.95,1,{color:new T.Color(0xd2e2c2)});
/* gramado fino (visto de cima), usado no Baixo: muitos fiozinhos em tons de verde, sem manchas fortes; costura sem emenda */
var lawnTex=null;
function makeLawn(){
  if(lawnTex)return lawnTex;
  var N=512,c=document.createElement('canvas');c.width=c.height=N;var x=c.getContext('2d'),r=rnd(2024),i,k;
  x.fillStyle='#4a7c22';x.fillRect(0,0,N,N);
  function wrap(fn){for(var ox=-N;ox<=N;ox+=N)for(var oy=-N;oy<=N;oy+=N)fn(ox,oy)}
  for(i=0;i<70;i++){var px=r()*N,py=r()*N,rad=30+r()*90,lt=r()<.5;
    wrap(function(ox,oy){var g=x.createRadialGradient(px+ox,py+oy,0,px+ox,py+oy,rad);g.addColorStop(0,lt?'rgba(140,175,60,.22)':'rgba(30,64,14,.24)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(px+ox-rad,py+oy-rad,rad*2,rad*2)})}
  var pal=[[40,76,18],[58,100,26],[76,120,32],[96,140,42],[118,156,52],[142,172,66],[52,88,22]];
  x.lineCap='round';
  for(i=0;i<16000;i++){
    var p2=pal[Math.floor(r()*pal.length)],ax=r()*N,ay=r()*N,a=r()*6.283,l=4+r()*9;
    x.strokeStyle='rgba('+p2[0]+','+p2[1]+','+p2[2]+','+(.45+r()*.4).toFixed(2)+')';x.lineWidth=r()<.3?1.6:1;
    var bx=Math.cos(a)*l,by=Math.sin(a)*l,cx2=Math.cos(a+.6)*l*.4,cy2=Math.sin(a+.6)*l*.4;
    for(k=0;k<4;k++){var ox2=(k&1)?(ax<N/2?N:-N):0,oy2=(k&2)?(ay<N/2?N:-N):0;
      if(k&&!((k&1)&&(ax<12||ax>N-12))&&!((k&2)&&(ay<12||ay>N-12)))continue;
      x.beginPath();x.moveTo(ax+ox2,ay+oy2);x.quadraticCurveTo(ax+ox2+cx2,ay+oy2+cy2,ax+ox2+bx,ay+oy2+by);x.stroke()}
  }
  lawnTex=new T.CanvasTexture(c);lawnTex.encoding=T.sRGBEncoding;lawnTex.wrapS=lawnTex.wrapT=T.RepeatWrapping;lawnTex.anisotropy=4;
  return lawnTex;
}
var grassMap0=grassM.map,meadowMap0=meadowM.map,meadowCol0=meadowM.color.clone(),grassCol0=grassM.color.clone(),lawnOn=null;
function applyLawn(on){
  if(on===lawnOn)return;lawnOn=on;
  if(on){var t=makeLawn();grassM.map=t;meadowM.map=t;grassM.color.setScalar(.66);meadowM.color.setScalar(.6)}/* tom de gramado: verde médio, sem lavar com o sol */
  else{grassM.map=grassMap0;meadowM.map=meadowMap0;meadowM.color.copy(meadowCol0);grassM.color.copy(grassCol0)}
  grassM.needsUpdate=true;meadowM.needsUpdate=true;
}
/* montanha: neve com manchas de cascalho marrom e pedrinhas (como encosta de verdade) */
function makeSnowGravel(seed,amt){return makeTex(TEX_SIZE,seed,function(h,x,y,r){
  var s=(r()-.5)*10;
  if(h<amt){var g=(r()-.5)*36,dk=r()<.08?-40:0;return [118+g+dk+h*60,92+g*.8+dk+h*50,72+g*.6+dk+h*40,(r()-.5)*60]}/* cascalho */
  if(h<amt+.05)return [196+s,186+s,176+s,(r()-.5)*20];/* borda úmida */
  return [lerp(222,248,h)+s,lerp(230,252,h)+s,lerp(238,255,h)+s,(r()-.5)*14]})}
var texSnowTop=makeSnowGravel(61,.24),texSnowField=makeSnowGravel(67,.36);
var snowM=pbr(texSnowTop,.8,.6),snowSideM=pbr(texStone,.92,.7,{color:new T.Color(0x8a7462)}),snowMeadowM=pbr(texSnowField,.85,.5,{color:new T.Color(0xf4f6fa)});
/* caverna de cristal: caminho de lajotas de pedra bege (com rachaduras) e rocha marrom */
function makeFlag(size){
  var N=size,c1=document.createElement('canvas'),c2=document.createElement('canvas');c1.width=c1.height=c2.width=c2.height=N;
  var x1=c1.getContext('2d'),x2=c2.getContext('2d'),i1=x1.createImageData(N,N),i2=x2.createImageData(N,N),d1=i1.data,d2=i2.data,r=rnd(707);
  var G=4,cell=N/G,pts=[],tone=[];
  for(var gy=0;gy<G;gy++)for(var gx=0;gx<G;gx++){pts.push([(gx+.15+r()*.7)*cell,(gy+.15+r()*.7)*cell]);tone.push([r(),r()])}
  var h=fbm(N,r);
  for(var y=0;y<N;y++)for(var x=0;x<N;x++){
    var cx=Math.floor(x/cell),cy=Math.floor(y/cell),b1=1e9,b2=1e9,bi=0;
    for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){
      var gx2=(cx+ox+G)%G,gy2=(cy+oy+G)%G,pp=pts[gy2*G+gx2],px=pp[0]+(cx+ox-gx2)*cell,py=pp[1]+(cy+oy-gy2)*cell;
      var dd=Math.hypot(x-px,y-py);if(dd<b1){b2=b1;b1=dd;bi=gy2*G+gx2}else if(dd<b2)b2=dd}
    var sc0=N/256,edge=(b2-b1)/sc0,gr=edge<3?1:(edge<6?(6-edge)/3:0),tn=tone[bi],hv=h[y*N+x];
    var base=188+tn[0]*36-26,R0=base+8,G0=base*.84,B0=base*.62;
    var sh=(hv-.5)*34+(r()-.5)*10,rim=Math.min(1,edge/7);
    var k=1-gr*.7-(1-rim)*.18;
    var i=(y*N+x)*4;
    d1[i]=clamp((R0+sh)*k,0,255);d1[i+1]=clamp((G0+sh*.9)*k,0,255);d1[i+2]=clamp((B0+sh*.7)*k,0,255);d1[i+3]=255;
    var bv=clamp(150+hv*60-gr*140+rim*30,0,255);d2[i]=d2[i+1]=d2[i+2]=bv;d2[i+3]=255;
  }
  x1.putImageData(i1,0,0);x2.putImageData(i2,0,0);
  x1.strokeStyle='rgba(70,50,30,.55)';x1.lineWidth=1;x2.strokeStyle='rgba(30,30,30,.9)';x2.lineWidth=1.2;
  for(var j=0;j<9;j++){var sx=r()*N,sy=r()*N,a=r()*6.28;[x1,x2].forEach(function(cx2){cx2.beginPath();cx2.moveTo(sx,sy);var px2=sx,py2=sy,aa=a;for(var k2=0;k2<5;k2++){aa+=(r()-.5)*1.1;px2+=Math.cos(aa)*7;py2+=Math.sin(aa)*7;cx2.lineTo(px2,py2)}cx2.stroke()})}/* rachaduras */
  var m=new T.CanvasTexture(c1),b=new T.CanvasTexture(c2);
  [m,b].forEach(function(t){t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=maxAniso;texList.push(t)});m.encoding=T.sRGBEncoding;
  m.repeat.set(.26,.26);b.repeat.set(.26,.26);
  return {map:m,bump:b};
}
var texFlag=makeFlag(coarse?256:384);
var caveTopM=pbr(texFlag,.86,1.6,{color:new T.Color(0xd6c4ae)}),caveSideM=pbr(texStone,.95,.25,{color:new T.Color(0x6e5038)});
var caveFloorM=pbr(texStone,.95,.4,{color:new T.Color(0x8a6646)}),caveWallM=pbr(texStone,1,.4,{color:new T.Color(0x6e5038)});
var crumbM=pbr(texStone,.9,.3,{color:new T.Color(0xc9a77c)});
function blockTex(kind){
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');
  if(kind==='q'){
    var g=x.createLinearGradient(0,0,0,128);g.addColorStop(0,'#ffd35a');g.addColorStop(1,'#e69a1a');x.fillStyle=g;x.fillRect(0,0,128,128);
    x.strokeStyle='#8a4f08';x.lineWidth=8;x.strokeRect(4,4,120,120);
    x.fillStyle='#fff3b8';[[16,16],[112,16],[16,112],[112,112]].forEach(function(p){x.beginPath();x.arc(p[0],p[1],5,0,6.283);x.fill()});
    x.font='bold 84px Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#8a4f08';x.fillText('?',67,71);x.fillStyle='#fffbe6';x.fillText('?',63,67);
  }else if(kind==='feather'){/* bloco da peninha: verde com a pena dourada desenhada */
    var gf=x.createLinearGradient(0,0,0,128);gf.addColorStop(0,'#6ee07a');gf.addColorStop(1,'#1f9a3a');x.fillStyle=gf;x.fillRect(0,0,128,128);
    x.strokeStyle='#0e5a22';x.lineWidth=8;x.strokeRect(4,4,120,120);
    x.fillStyle='#d8ffd8';[[16,16],[112,16],[16,112],[112,112]].forEach(function(p){x.beginPath();x.arc(p[0],p[1],5,0,6.283);x.fill()});
    x.save();x.translate(64,66);x.rotate(-.6);
    function pena(col,ox,oy){x.fillStyle=col;x.beginPath();x.moveTo(ox,oy-44);x.bezierCurveTo(ox+24,oy-22,ox+20,oy+18,ox,oy+34);x.bezierCurveTo(ox-20,oy+18,ox-24,oy-22,ox,oy-44);x.fill()}
    pena('#0e5a22',3,3);pena('#ffd23a',0,0);
    x.strokeStyle='#b07a10';x.lineWidth=3;x.beginPath();x.moveTo(0,-40);x.lineTo(0,46);x.stroke();
    x.lineWidth=2;for(var k=-30;k<26;k+=8){x.beginPath();x.moveTo(0,k);x.lineTo(14,k-8);x.moveTo(0,k);x.lineTo(-14,k-8);x.stroke()}
    x.restore();
  }else if(kind==='brick'){
    x.fillStyle='#b8532c';x.fillRect(0,0,128,128);
    x.fillStyle='rgba(255,200,150,.18)';for(var r0=0;r0<4;r0++)x.fillRect(0,r0*32+2,128,6);
    x.strokeStyle='#4a200f';x.lineWidth=5;
    for(var r=0;r<4;r++){var y=r*32;x.beginPath();x.moveTo(0,y);x.lineTo(128,y);x.stroke();for(var xx=(r%2?0:32);xx<=128;xx+=64){x.beginPath();x.moveTo(xx,y);x.lineTo(xx,y+32);x.stroke()}}
    x.lineWidth=8;x.strokeRect(0,0,128,128);
  }else{
    x.fillStyle='#8a7a6a';x.fillRect(0,0,128,128);x.strokeStyle='#463a30';x.lineWidth=8;x.strokeRect(4,4,120,120);
    x.fillStyle='#463a30';[[16,16],[112,16],[16,112],[112,112]].forEach(function(p){x.beginPath();x.arc(p[0],p[1],5,0,6.283);x.fill()});
  }
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=maxAniso;return t;
}
var qTex=blockTex('q'),qM=new T.MeshStandardMaterial({map:qTex,roughness:.45,metalness:.2,emissive:0xffa000,emissiveMap:qTex,emissiveIntensity:.3});
var fTexB=blockTex('feather'),featherBlkM=new T.MeshStandardMaterial({map:fTexB,roughness:.45,metalness:.15,emissive:0x3aff6a,emissiveMap:fTexB,emissiveIntensity:.25});
var brickM=new T.MeshStandardMaterial({map:blockTex('brick'),roughness:.85}),emptyM=new T.MeshStandardMaterial({map:blockTex('empty'),roughness:.9});
var pipeM=new T.MeshStandardMaterial({color:0x2fae45,roughness:.35,metalness:.25}),pipeRimM=new T.MeshStandardMaterial({color:0x48d062,roughness:.3,metalness:.25});
var vineGeo=new T.CylinderGeometry(.07,.1,1,8);vineGeo.translate(0,.5,0);
var leafGeo=new T.SphereGeometry(.2,10,8);leafGeo.scale(1.9,.3,1);
var vineM=new T.MeshStandardMaterial({color:0x3f9a2f,roughness:.7}),leafM2=new T.MeshStandardMaterial({color:0x62c43c,roughness:.6,side:T.DoubleSide});
var barkM=pbr(texWood,.95,1.5,{color:new T.Color(0x8a6a4c)}),barkDarkM=pbr(texWood,1,1.2,{color:new T.Color(0x4f3d2d)}),mossM=pbr(texGrass,.9,1.3,{color:new T.Color(0xa6f27a)});
/* fundo do mar: areia clara com ondulações suaves e rocha azul-petróleo */
function seaSandTex(){
  var N=256,c=document.createElement('canvas');c.width=c.height=N;var x=c.getContext('2d'),im=x.createImageData(N,N),d=im.data,r=rnd(5151),T2=6.2832,p1=r()*T2,p2=r()*T2;
  for(var py=0;py<N;py++)for(var px=0;px<N;px++){var u=px/N,v=py/N;
    var w=.5*Math.sin(u*T2*2+p1)+.2*Math.sin(u*T2*3+v*T2+p2);var f=(v*10+w*.8)%1;if(f<0)f+=1;var sh=f<.7?f/.7:(1-f)/.3;sh=sh*sh*(3-2*sh);
    var g=(r()-.5)*14,k=.82+sh*.18,i=(py*N+px)*4;d[i]=226*k+g;d[i+1]=232*k+g;d[i+2]=214*k+g*.8;d[i+3]=255}
  x.putImageData(im,0,0);
  var m=new T.CanvasTexture(c);m.encoding=T.sRGBEncoding;m.wrapS=m.wrapT=T.RepeatWrapping;m.anisotropy=maxAniso;texList.push(m);return m;
}
var seaSandMap=seaSandTex();
var sandM=pbr(texStone,.95,.25,{color:new T.Color(0x4a8a88)}),reefRockM=pbr(texStone,.9,.5,{color:new T.Color(0x3e6e7c)}),reefSlabM=pbr(texStone,.9,.4,{color:new T.Color(0x6a9aa2)});
sandM.map=seaSandMap;
var seaFloorM=pbr(texStone,.97,.15,{color:new T.Color(0x3a7a7c)}),seaWallM=pbr(texStone,1,.1,{color:new T.Color(0x2a7a8c)});
seaFloorM.map=seaSandMap;
/* cáusticas: manchas de luz dançando no fundo (Médio para cima) */
var causU={time:{value:0},amt:{value:0}};
function addCaustics(m){
  m.onBeforeCompile=function(sh){
    sh.uniforms.cTime=causU.time;sh.uniforms.cAmt=causU.amt;
    sh.vertexShader='varying vec3 vCW;varying float vCUp;\n'+sh.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvCW=(modelMatrix*vec4(transformed,1.0)).xyz;vCUp=normalize(mat3(modelMatrix)*objectNormal).y;');
    sh.fragmentShader='uniform float cTime;uniform float cAmt;varying vec3 vCW;varying float vCUp;\n'+
      'float caus(vec2 p,float t){vec2 i=p;float c=1.;for(int n=0;n<4;n++){float tt=t*(1.-(3.5/float(n+1)));i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));c+=1./length(vec2(p.x/(sin(i.x+tt)/.005),p.y/(cos(i.y+tt)/.005)));}c/=4.;c=1.17-pow(c,1.4);return clamp(pow(abs(c),8.),0.,1.2);}\n'+
      sh.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\nif(cAmt>0.){vec2 cp=mod(vCW.xz*.9+vec2(vCW.y*.3,0.),6.2832)-250.;float cv=caus(cp,cTime*.5+23.);totalEmissiveRadiance+=vec3(.6,1.,.95)*cv*cAmt*smoothstep(.3,.9,vCUp);}');
  };
  m.customProgramCacheKey=function(){return 'caus'};m.needsUpdate=true;
}
addCaustics(sandM);addCaustics(seaFloorM);
var castleTopM=pbr(texBrick,.9,.14,{color:new T.Color(0x8c8c98)}),castleSideM=pbr(texBrick,.95,.14,{color:new T.Color(0x6c6c78)}),castleSlabM=pbr(texBrick,.85,.14,{color:new T.Color(0x84848e)}),castleCrumbM=pbr(texBrick,.95,.14,{color:new T.Color(0x7c706c)}),castleFloorM=pbr(texBrick,.95,.1,{color:new T.Color(0x34343e)}),castleWallM=pbr(texBrick,1,.3,{color:new T.Color(0x4a4a58)});
var iceSpkM=new T.MeshStandardMaterial({color:0xd6f2ff,roughness:.1,metalness:.1,emissive:0x5ab4e6,emissiveIntensity:.3});
var iceSlabM=pbr(texSnow,.22,.3,{color:new T.Color(0xb4e4fa)}),iceTopM=pbr(texSnow,.1,.35,{color:new T.Color(0x93d6f4)}),iceCrumbM=pbr(texSnow,.3,.25,{color:new T.Color(0x9ccbe6)}),snowFltM=pbr(texSnow,.8,.2,{color:new T.Color(0xe6eef8)});
var ruinTopM=pbr(texBrick,.92,.2,{color:new T.Color(0xe6c88e)}),ruinSideM=pbr(texBrick,.95,.25,{color:new T.Color(0xc79a58)}),ruinSlabM=pbr(texBrick,.9,.2,{color:new T.Color(0xdcb878)}),ruinGroundM=pbr(texSnow,.97,.15,{color:new T.Color(0xe4b870)}),ruinCliffM=pbr(texBrick,1,.3,{color:new T.Color(0xa87c44)}),ruinCrumbM=pbr(texStone,.9,.3,{color:new T.Color(0xb98a56)}),ruinWallM=pbr(texBrick,1,.35,{color:new T.Color(0x9a7140)}),sandBlkM=pbr(texBrick,.9,.3,{color:new T.Color(0xd2a868)});
var vilStreetM=pbr(texStone,.95,.25,{color:new T.Color(0x9a8e7c)}),vilWallM=pbr(texBrick,.95,.2,{color:new T.Color(0x5e5a62)}),vilPlankM=M(0x5a4636,.9),vilGroundM=pbr(texGrass,.97,.6,{color:new T.Color(0x56664a)});
var MATS=[
  {top:grassM,side:dirtM,slab:stoneM,meadow:meadowM,cliff:dirtM},
  {top:caveTopM,side:caveSideM,slab:caveTopM,meadow:caveFloorM,cliff:caveWallM},
  {top:mossM,side:barkM,slab:barkM,meadow:barkDarkM,cliff:barkDarkM},
  {top:sandM,side:reefRockM,slab:reefSlabM,meadow:seaFloorM,cliff:seaWallM},
  {top:castleTopM,side:castleSideM,slab:castleSlabM,meadow:castleFloorM,cliff:castleWallM},
  {top:snowM,side:snowSideM,slab:snowFltM,meadow:snowMeadowM,cliff:snowSideM},
  {top:ruinTopM,side:ruinSideM,slab:ruinSlabM,meadow:ruinGroundM,cliff:ruinCliffM},
  {top:vilStreetM,side:vilWallM,slab:vilPlankM,meadow:vilGroundM,cliff:vilWallM},
  {top:grassM,side:pbr(texDirt,.95,.45,{color:new T.Color(0xffd8a8)}),slab:barkM,meadow:meadowM,cliff:dirtM},
  {top:stoneM,side:stoneM,slab:stoneM,meadow:stoneM,cliff:stoneM},
  {top:snowM,side:snowSideM,slab:snowFltM,meadow:snowMeadowM,cliff:snowSideM},
  {top:grassM,side:dirtM,slab:barkM,meadow:meadowM,cliff:dirtM},
  {top:grassM,side:dirtM,slab:stoneM,meadow:meadowM,cliff:dirtM},
  {top:mossM,side:barkM,slab:barkM,meadow:barkDarkM,cliff:barkDarkM},
  {top:caveTopM,side:caveSideM,slab:caveTopM,meadow:caveFloorM,cliff:caveWallM},
  {top:pbr(texDirt,.97,1.2,{color:new T.Color(0xc89a6a)}),side:pbr(texStone,.95,.3,{color:new T.Color(0xa07a58)}),slab:pbr(texStone,.9,.2,{color:new T.Color(0xb08a66)}),meadow:pbr(texDirt,.97,1,{color:new T.Color(0xd4ae80)}),cliff:pbr(texStone,.95,.3,{color:new T.Color(0x8a6848)})},
  {top:grassM,side:dirtM,slab:grassM,meadow:meadowM,cliff:dirtM}
];
MATS.push(MATS[4]);/* 17: Labirinto — pedra do castelo na entrada e na saída */
MATS.push(MATS[0]);/* 18: Ruínas de Tijolos — grama e terra */
MATS.push(MATS[5]);/* 19: Lago da Aurora — neve e gelo */
var wkSandM=pbr(texStone,.96,.6,{color:new T.Color(0xcdb488)}),wkSandSideM=pbr(texDirt,.97,.8,{color:new T.Color(0xa88a62)});
MATS.push({top:wkSandM,side:wkSandSideM,slab:woodM,meadow:wkSandM,cliff:wkSandSideM});/* 20: O Naufrágio — areia molhada */

function boxGeo(w,h,d,tile){
  var g=new T.BoxGeometry(w,h,d),uv=g.attributes.uv;
  var dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
  for(var f=0;f<6;f++)for(var v=0;v<4;v++){
    var i=f*4+v;
    uv.setXY(i,uv.getX(i)*dims[f][0]/tile,uv.getY(i)*dims[f][1]/tile);
  }
  return g;
}
function mesh(g,m,cast,recv){
  var o=new T.Mesh(g,m);
  o.castShadow=cast!==false;o.receiveShadow=recv!==false;
  return o;
}
function hsl(c,h,s,l){c.setHSL(h,s,l);c.convertSRGBToLinear();return c}
function inst(geo,mat,n,cast){
  var im=new T.InstancedMesh(geo,mat,n);
  im.frustumCulled=false;im.castShadow=!!cast;im.receiveShadow=true;
  return im;
}

/* ===================== Kuro, o ninja articulado ===================== */
var rig=(function(){
  var root=new T.Group(),rg={root:root};
  var skin=M(0xefb48a,.55),cloth=M(0x383849,.85),clothL=M(0x4b4b64,.8),clothD=M(0x2b2b3a,.9),slate=M(0x5d6888,.7),purple=M(0x6f52a0,.55),sash=M(0x1d1d27,.8),metal=M(0xbac4d4,.3,.85),dark=M(0x120e10,.2),white=M(0xffffff,.3),sole=M(0x1c1620,.85),browM=M(0x2a170f,.8),gold=M(0xcaa34a,.35,.8);
  var hips=new T.Group();hips.position.y=HY;root.add(hips);rg.hips=hips;
  var pelvis=mesh(new T.CapsuleGeometry(.15,.14,6,12),clothD);pelvis.rotation.z=Math.PI/2;hips.add(pelvis);
  var sa=mesh(new T.TorusGeometry(.205,.036,8,28),sash);sa.rotation.x=Math.PI/2;sa.position.y=.07;sa.scale.y=.88;hips.add(sa);
  var knot=mesh(new T.SphereGeometry(.058,10,8),sash);knot.scale.set(1,.8,.8);knot.position.set(.1,.07,.19);hips.add(knot);
  [-1,1].forEach(function(sd){var tl=mesh(new T.BoxGeometry(.05,.24,.014),sash);tl.position.set(.1+sd*.035,-.07,.2);tl.rotation.z=sd*.14;hips.add(tl)});
  var torso=new T.Group();hips.add(torso);rg.torso=torso;
  var chest=mesh(new T.CapsuleGeometry(.2,.2,8,14),cloth);chest.position.y=.24;chest.scale.z=.86;torso.add(chest);
  var kat=new T.Group();kat.position.set(0,.3,-.25);kat.rotation.x=-.75;torso.add(kat);
  var shth=mesh(new T.CylinderGeometry(.03,.03,.78,8),clothL);shth.position.y=-.06;kat.add(shth);
  var tsu=mesh(new T.CylinderGeometry(.05,.05,.014,12),gold);tsu.position.y=.33;kat.add(tsu);
  var hlt=mesh(new T.CylinderGeometry(.027,.027,.2,8),purple);hlt.position.y=.44;kat.add(hlt);
  var pom=mesh(new T.SphereGeometry(.03,8,6),gold);pom.position.y=.55;kat.add(pom);
  var ring=mesh(new T.TorusGeometry(.15,.065,10,22),clothL);ring.rotation.x=Math.PI/2;ring.position.set(0,.47,0);ring.scale.y=.9;torso.add(ring);
  var head=new T.Group();head.position.y=.47;head.scale.setScalar(1.18);torso.add(head);rg.head=head;
  var skull=mesh(new T.SphereGeometry(.21,30,22),clothL);skull.scale.set(1.08,1,1.04);skull.position.y=.22;head.add(skull);
  var win=mesh(new T.SphereGeometry(.2,24,16),skin);win.scale.set(.97,.52,.64);win.position.set(0,.25,.1);head.add(win);
  var mask=mesh(new T.SphereGeometry(.2145,28,16,0,Math.PI*2,1.83,1.31),cloth);mask.scale.set(1.08,1,1.04);mask.position.y=.22;head.add(mask);
  var band=mesh(new T.TorusGeometry(.172,.034,8,34),slate);band.rotation.x=Math.PI/2;band.scale.set(1.08,1.04,1);band.position.set(0,.345,.004);head.add(band);
  var plate=mesh(new T.BoxGeometry(.11,.055,.018),metal);plate.position.set(0,.345,.186);head.add(plate);
  rg.eyes=[];rg.brows=[];
  [-1,1].forEach(function(sd){
    var eg=new T.Group();eg.position.set(sd*.09,.24,.212);head.add(eg);rg.eyes.push(eg);
    var pu=mesh(new T.SphereGeometry(.062,18,14),dark);pu.scale.set(1,1.12,.5);eg.add(pu);
    var h1=mesh(new T.SphereGeometry(.017,8,6),white,false,false);h1.position.set(.022,.026,.03);eg.add(h1);
    var h2=mesh(new T.SphereGeometry(.008,8,6),white,false,false);h2.position.set(-.02,-.022,.03);eg.add(h2);
    var bg=new T.CapsuleGeometry(.014,.085,4,6);bg.rotateZ(Math.PI/2);
    var br=mesh(bg,browM,false,false);br.position.set(sd*.088,.3,.205);br.rotation.x=-.2;head.add(br);rg.brows.push(br);
  });
  rg.smile=new T.Group();rg.open=new T.Group();head.add(rg.smile);head.add(rg.open);
  var sp=new T.Group();sp.position.set(0,.34,-.19);head.add(sp);rg.sprout=sp;
  sp.add(mesh(new T.SphereGeometry(.05,10,8),slate));
  var tg0=new T.ConeGeometry(.055,.36,3);tg0.rotateX(Math.PI);tg0.translate(0,-.18,0);
  [-1,1].forEach(function(sd){var tl=mesh(tg0,slate);tl.scale.z=.3;tl.rotation.set(.55,0,sd*.28);sp.add(tl)});
  rg.scarf=[];rg.scarfP=[];
  var parent=new T.Group();parent.position.set(0,.5,-.14);torso.add(parent);
  for(var si=0;si<4;si++){
    var seg=new T.Group();if(si>0)seg.position.y=-.16;parent.add(seg);
    var piece=mesh(new T.BoxGeometry(.13,.17,.025),si%2?slate:clothL);piece.position.y=-.08;seg.add(piece);rg.scarfP.push(piece);
    rg.scarf.push(seg);parent=seg;
  }
  rg.cape={g:null,s:[]};
  var cg=new T.Group();cg.position.set(0,.5,-.17);cg.visible=false;torso.add(cg);rg.cape.g=cg;
  var capeM=M(0xc9382a,.7,0,{side:T.DoubleSide}),capeT=M(0xe8b830,.5,.2,{side:T.DoubleSide}),cpar=cg;
  for(var ci=0;ci<3;ci++){
    var csg=new T.Group();if(ci>0)csg.position.y=-.24;cpar.add(csg);
    var cpc=mesh(new T.BoxGeometry(.5+ci*.1,.25,.02),ci===2?capeT:capeM);cpc.position.y=-.12;csg.add(cpc);
    rg.cape.s.push(csg);cpar=csg;
  }
  var armM=cloth.clone(),cuffM=slate.clone(),handM=skin;rg.hands=[];
  function arm(sd){
    var shG=new T.Group();shG.position.set(sd*.26,.41,0);torso.add(shG);
    shG.add(mesh(new T.SphereGeometry(.085,14,12),armM));
    var up=mesh(new T.CapsuleGeometry(.068,.13,6,10),armM);up.position.y=-.13;shG.add(up);
    var el=new T.Group();el.position.y=-.26;shG.add(el);
    var fo=mesh(new T.CapsuleGeometry(.058,.12,6,10),armM);fo.position.y=-.12;el.add(fo);
    var bc=mesh(new T.CylinderGeometry(.075,.07,.16,12),cuffM);bc.position.y=-.15;el.add(bc);
    var bd=mesh(new T.TorusGeometry(.074,.012,6,14),purple);bd.rotation.x=Math.PI/2;bd.position.y=-.09;el.add(bd);
    var hd=mesh(new T.SphereGeometry(.07,14,12),skin);hd.scale.set(1,.95,1.05);hd.position.y=-.275;el.add(hd);rg.hands.push(hd);
    /* roupa nova: ombreira de pano vermelho e as duas faixas no braço */
    var pad=mesh(new T.SphereGeometry(.105,14,10,0,Math.PI*2,0,1.7),rg.redM||(rg.redM=M(0xa81818,.72)));pad.position.y=.01;pad.scale.set(1,.85,1.05);pad.visible=false;shG.add(pad);
    var b1=mesh(new T.TorusGeometry(.072,.02,6,14),rg.redD||(rg.redD=M(0x8a1612,.7)));b1.rotation.x=Math.PI/2;b1.position.y=-.1;b1.visible=false;shG.add(b1);
    var b2=b1.clone();b2.position.y=-.17;shG.add(b2);rg.ofit=(rg.ofit||[]).concat([pad,b1,b2]);
    return {sh:shG,el:el};
  }
  function leg(sd){
    var hp=new T.Group();hp.position.set(sd*.1,-.02,0);hips.add(hp);
    var th=mesh(new T.CapsuleGeometry(.105,.18,6,10),clothD);th.position.y=-.19;th.scale.z=1.05;hp.add(th);
    var kn=new T.Group();kn.position.y=-.37;hp.add(kn);
    var sn=mesh(new T.CapsuleGeometry(.082,.18,6,10),clothD);sn.position.y=-.17;kn.add(sn);
    [-.25,-.3].forEach(function(yy){var wb=mesh(new T.TorusGeometry(.084,.013,6,16),purple);wb.rotation.x=Math.PI/2;wb.position.y=yy;kn.add(wb)});
    var an=new T.Group();an.position.y=-.37;kn.add(an);
    var ft=mesh(new T.SphereGeometry(.08,14,10),clothD);ft.scale.set(1.05,.8,1.6);ft.position.set(0,-.03,.07);an.add(ft);
    var sl=mesh(new T.BoxGeometry(.16,.035,.32),sole);sl.position.set(0,-.07,.07);an.add(sl);
    return {hip:hp,knee:kn,ankle:an};
  }
  var aL=arm(1),aR=arm(-1),lL=leg(1),lR=leg(-1);
  /* ===== roupa nova da Terra Nova (do Mundo 12 em diante): capuz vermelho, cachecol grosso, roupa preta, mangas vermelhas, cinto com fivela, abas, luvas e botas com tiras =====
     o rosto do Kuro continua aparecendo dentro do capuz (pedido do dono) */
  var red=rg.redM,redD=rg.redD,silver=M(0xc8ced8,.3,.85),glove=M(0x26262c,.6);
  var hood=new T.Group();head.add(hood);
  var hg=new T.SphereGeometry(.262,30,20,Math.PI/2+.95,Math.PI*2-1.9,0,2.25);var hd1=mesh(hg,M(0xa81818,.75,0,{side:T.DoubleSide}));hd1.scale.set(1.08,1.04,1.06);hd1.position.y=.21;hood.add(hd1);
  var pk=mesh(new T.ConeGeometry(.12,.3,10),red);pk.scale.z=.6;pk.position.set(0,.3,-.27);pk.rotation.x=-2.65;hood.add(pk);/* ponta do capuz caindo para trás */
  var rim=mesh(new T.TorusGeometry(.2,.03,8,26,Math.PI*1.25),redD);rim.position.set(0,.2,.16);rim.rotation.set(0,0,-Math.PI*.125+Math.PI/2*0);rim.rotation.z=Math.PI*.875;rim.scale.set(1.05,1.15,1);hood.add(rim);
  var cowl=mesh(new T.TorusGeometry(.17,.085,10,24),red);cowl.rotation.x=Math.PI/2;cowl.position.set(0,.46,.01);cowl.scale.set(1.1,1.15,1);torso.add(cowl);
  var cowl2=mesh(new T.TorusGeometry(.15,.07,10,22),redD);cowl2.rotation.x=Math.PI/2+.25;cowl2.position.set(0,.52,.03);torso.add(cowl2);
  var buckle=mesh(new T.BoxGeometry(.09,.07,.025),silver);buckle.position.set(0,.07,.215);hips.add(buckle);
  var bk2=mesh(new T.BoxGeometry(.05,.045,.03),M(0x8a929e,.4,.8));bk2.position.set(0,.07,.225);hips.add(bk2);
  var flaps=[];[[-.1,.19,.12],[.1,.19,-.12],[0,-.2,0]].forEach(function(f,i){var w=i===2?.32:.15,fl=mesh(new T.BoxGeometry(w,.34,.02),red);fl.geometry.translate(0,-.17,0);fl.position.set(f[0],.03,f[1]);fl.rotation.z=f[2]*.4;if(i===2)fl.rotation.x=.12;else fl.rotation.x=-.08;hips.add(fl);flaps.push(fl)});
  var straps=[];[lL,lR].forEach(function(L){[-.27,-.33].forEach(function(yy){var st=mesh(new T.TorusGeometry(.088,.014,6,16),silver);st.rotation.x=Math.PI/2;st.position.y=yy;L.knee.add(st);straps.push(st)})});
  rg.flaps=flaps;rg.ofit=rg.ofit.concat([hood,cowl,cowl2,buckle,bk2],flaps,straps);rg.ofit.forEach(function(o){o.visible=false});
  rg.ofitMats={cloth:cloth,clothL:clothL,clothD:clothD,sash:sash,armM:armM,cuffM:cuffM,purple:purple};
  rg.ofitCols={};['cloth','clothL','clothD','sash','armM','cuffM','purple'].forEach(function(k){rg.ofitCols[k]=rg.ofitMats[k].color.getHex()});
  rg.outfit=0;
  rg.setOutfit=function(k){if(rg.outfit===k)return;rg.outfit=k;var on=k===1,m=rg.ofitMats,c=rg.ofitCols;
    rg.ofit.forEach(function(o){o.visible=on});
    band.visible=plate.visible=sp.visible=ring.visible=!on;/* faixa da cabeça e os rabinhos ficam escondidos pelo capuz */
    m.cloth.color.setHex(on?0x1d1d24:c.cloth);m.clothD.color.setHex(on?0x17171c:c.clothD);m.clothL.color.setHex(on?0x2a2a32:c.clothL);
    m.sash.color.setHex(on?0xc8302a:c.sash);m.armM.color.setHex(on?0xa81818:c.armM);m.cuffM.color.setHex(on?0x26262c:c.cuffM);m.purple.color.setHex(on?0xc8ced8:c.purple);
    rg.hands.forEach(function(h){h.material=on?glove:skin});
    rg.scarfP.forEach(function(pc,i){pc.material=on?(i%2?redD:red):(i%2?slate:clothL)});
  };
  rg.shL=aL.sh;rg.elL=aL.el;rg.shR=aR.sh;rg.elR=aR.el;
  rg.hipL=lL.hip;rg.kneeL=lL.knee;rg.ankL=lL.ankle;rg.hipR=lR.hip;rg.kneeR=lR.knee;rg.ankR=lR.ankle;
  root.rotation.y=Math.PI/2;
  scene.add(root);
  return rg;
})();
var bubble=mesh(new T.SphereGeometry(1.15,24,16),new T.MeshStandardMaterial({color:0x9fe8ff,roughness:.1,transparent:true,opacity:.2,emissive:0x3ab8ff,emissiveIntensity:.5,depthWrite:false}),false,false);bubble.visible=false;scene.add(bubble);
/* ===================== partículas ===================== */
var sprTex=(function(){
  var c=document.createElement('canvas');c.width=c.height=64;
  var x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.4,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g;x.fillRect(0,0,64,64);
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
})();
function mkPool(n,add,color,tex){
  var arr=[];
  for(var i=0;i<n;i++){
    var m=new T.SpriteMaterial({map:tex||sprTex,transparent:true,depthWrite:false,blending:add?T.AdditiveBlending:T.NormalBlending,color:color,opacity:0});
    var s=new T.Sprite(m);s.visible=false;scene.add(s);
    arr.push({s:s,vx:0,vy:0,life:0,max:1,size:.3,grow:0,grav:0});
  }
  return arr;
}
var dustPool=mkPool(36,false,0xcbb99c),sparkPool=mkPool(80,true,0xffcf5a),leafPool=mkPool(40,false,0x74d23c),bloodPool=mkPool(40,false,0xb3121c);
/* gotinhas de água (respingo): bolinha azul-clara com brilho */
var dropTex=(function(){var c=document.createElement('canvas');c.width=c.height=32;var g=c.getContext('2d'),gr=g.createRadialGradient(13,12,1,16,16,14);
  gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(200,240,255,.95)');gr.addColorStop(.8,'rgba(90,185,240,.85)');gr.addColorStop(1,'rgba(60,150,220,0)');
  g.fillStyle=gr;g.beginPath();g.arc(16,16,14,0,6.283);g.fill();var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t})();
var dropPool=mkPool(60,false,0xffffff,dropTex);
function emit(pool,x,y,n,spd,life,size,grow,grav){
  if(pool===dustPool&&LV&&LV.water&&inWater(x,y+.1)){emitBub(x,y+.1,Math.max(1,Math.ceil(n*.7)));return}/* dentro da água: bolhas em vez de poeira */
  if(n>1)n=Math.max(1,Math.round(n*gPart));
  for(var i=0,k=0;i<pool.length&&k<n;i++){
    var p=pool[i];if(p.life>0)continue;
    var a=Math.random()*6.283,sp=spd*(.4+Math.random()*.7);
    p.vx=Math.cos(a)*sp;p.vy=Math.abs(Math.sin(a))*sp*.9+spd*.2;p.life=p.max=life*(.7+Math.random()*.5);
    p.size=size;p.grow=grow;p.grav=grav;p.s.position.set(x+(Math.random()-.5)*.2,y,.2+Math.random()*.4);p.s.visible=true;k++;
  }
}
function updFx(dt){
  [dustPool,sparkPool,leafPool,bloodPool,dropPool].forEach(function(pool){
    pool.forEach(function(p){
      if(p.life<=0)return;
      p.life-=dt;
      if(p.life<=0){p.s.visible=false;p.s.material.opacity=0;return}
      p.vy-=p.grav*dt;
      p.s.position.x+=p.vx*dt;p.s.position.y+=p.vy*dt;
      var u=1-p.life/p.max,sc=p.size*(1+p.grow*u);
      p.s.scale.set(sc,sc,1);p.s.material.opacity=(1-u)*(p.grow>0?.55:1);
    });
  });
}
var snowPts=(function(){
  var n=260,pos=new Float32Array(n*3);
  for(var i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*44;pos[i*3+1]=Math.random()*20-6;pos[i*3+2]=(Math.random()-.5)*16}
  var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));
  var p=new T.Points(g,new T.PointsMaterial({size:.17,map:sprTex,transparent:true,opacity:.85,depthWrite:false,color:0xffffff}));
  p.frustumCulled=false;p.visible=false;scene.add(p);return p;
})();

/* ===================== som e música ===================== */
var lastSwim=0,lastSplash=0,lastBlub=0,subG=null;
var paused=false,hitStop=0;
function volSfx(){try{return cfg.vSfx===undefined?1:+cfg.vSfx}catch(e){return 1}}function volMus(){try{return cfg.vMus===undefined?1:+cfg.vMus}catch(e){return 1}}
var actx=null,soundOn=true,musicOn=true,master=null,sfxBus=null,musBus=null,leadBus=null,noiseBuf=null,musTimer=null,MUS=null,lastAlert=0;
function initAudio(){
  if(!actx){
    try{
      actx=new (window.AudioContext||window.webkitAudioContext)();
      var comp=actx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;
      master=actx.createGain();master.gain.value=.9;master.connect(comp);
      /* ganho depois do compressor (som mais alto) e um limitador no fim para não estourar */
      var mk=actx.createGain();mk.gain.value=1.7;var lim=actx.createDynamicsCompressor();lim.threshold.value=-2;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.002;lim.release.value=.12;comp.connect(mk);mk.connect(lim);lim.connect(actx.destination);
      sfxBus=actx.createGain();sfxBus.gain.value=volSfx();sfxBus.connect(master);
      musBus=actx.createGain();musBus.gain.value=.0001;musBus.connect(master);
      var lf=actx.createBiquadFilter();lf.type='lowpass';lf.frequency.value=2800;lf.connect(musBus);leadBus=lf;
      var n=actx.sampleRate,b=actx.createBuffer(1,n,actx.sampleRate),d=b.getChannelData(0);
      for(var i=0;i<n;i++)d[i]=Math.random()*2-1;
      noiseBuf=b;
      var ns=actx.createBufferSource();ns.buffer=b;ns.loop=true;var nf=actx.createBiquadFilter();nf.type='lowpass';nf.frequency.value=260;subG=actx.createGain();subG.gain.value=0;ns.connect(nf);nf.connect(subG);subG.connect(master);ns.start();
    }catch(e){actx=null}
  }
  if(actx&&actx.state==='suspended'){try{actx.resume()}catch(e){}}
  if(actx&&!musTimer){MUS={step:0,next:actx.currentTime+.15,theme:-1};musTimer=setInterval(musicTick,30)}
}
/* qualquer primeiro toque/tecla liga o áudio (o mapa e o menu também têm música) */
['pointerdown','touchstart','keydown','click'].forEach(function(ev){window.addEventListener(ev,function(){try{initAudio()}catch(e){}},{passive:true})});
document.addEventListener('visibilitychange',function(){
  if(!actx)return;
  try{if(document.hidden){actx.suspend();if(state==='play'&&window.__pause)window.__pause()}else if(!paused)actx.resume()}catch(e){}
});
function tone(bus,f,t,d,type,vol,endF){
  var o=actx.createOscillator(),g=actx.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);
  if(endF)o.frequency.exponentialRampToValueAtTime(Math.max(30,endF),t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(bus);o.start(t);o.stop(t+d+.03);
}
function noiseTo(bus,t,d,vol,freq,ftype){
  var s=actx.createBufferSource(),f=actx.createBiquadFilter(),g=actx.createGain();
  s.buffer=noiseBuf;f.type=ftype||'lowpass';f.frequency.value=freq||1200;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(f);f.connect(g);g.connect(bus);s.start(t,Math.random()*.5);s.stop(t+d+.03);
}
/* som de pulo do Kuro: um "up" suave (sobe de tom, ataque macio, filtrado para não ficar estridente) */
var upN=0;
function upSfx(k){
  if(!actx||!soundOn)return;
  try{var t=actx.currentTime,v=(upN++%2)?1.06:1,f0=300*v*k,d=.16;
    var o=actx.createOscillator(),o2=actx.createOscillator(),g=actx.createGain(),lp=actx.createBiquadFilter();
    o.type='sine';o2.type='triangle';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f0*1.9,t+d*.7);
    o2.frequency.setValueAtTime(f0*2,t);o2.frequency.exponentialRampToValueAtTime(f0*3.6,t+d*.7);
    lp.type='lowpass';lp.frequency.value=1800;lp.Q.value=.7;
    var g2=actx.createGain();g2.gain.value=.18;
    g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.075,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);o2.connect(g2);g2.connect(g);g.connect(lp);lp.connect(sfxBus);o.start(t);o2.start(t);o.stop(t+d+.03);o2.stop(t+d+.03)}catch(e){}
}
function beep(f,d,type,vol,slide,delay){
  if(!actx||!soundOn)return;
  try{tone(sfxBus,f,actx.currentTime+(delay||0),d,type||'sine',vol||.06,slide?f+slide:0)}catch(e){}
}
function noise(d,vol,freq,ftype,delay){
  if(!actx||!soundOn||!noiseBuf)return;
  try{noiseTo(sfxBus,actx.currentTime+(delay||0),d,vol,freq,ftype)}catch(e){}
}
/* pulo giratório: "brrriiiu" de pião de brinquedo — sobe de tom com tremido (dono escolheu a opção 3) */
function whirlSfx(){
  if(!actx||!soundOn)return;
  try{
  var t=actx.currentTime,d=.5,o=actx.createOscillator(),lfo=actx.createOscillator(),ld=actx.createGain(),am=actx.createGain(),ad=actx.createGain(),lp=actx.createBiquadFilter(),g=actx.createGain();
  o.type='square';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(880,t+.38);o.frequency.exponentialRampToValueAtTime(760,t+d);
  lfo.type='sine';lfo.frequency.setValueAtTime(18,t);lfo.frequency.linearRampToValueAtTime(30,t+d);ld.gain.value=40;lfo.connect(ld);ld.connect(o.frequency);
  am.gain.value=.6;ad.gain.value=.4;lfo.connect(ad);ad.connect(am.gain);
  lp.type='lowpass';lp.frequency.setValueAtTime(900,t);lp.frequency.exponentialRampToValueAtTime(2600,t+.35);lp.Q.value=4;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06,t+.03);g.gain.linearRampToValueAtTime(.05,t+.35);g.gain.linearRampToValueAtTime(0,t+d);
  o.connect(lp);lp.connect(am);am.connect(g);g.connect(sfxBus);o.start(t);lfo.start(t);o.stop(t+d+.05);lfo.stop(t+d+.05);
}catch(e){}
}
/* giro da capa: "vuuush" de vento que sobe e desce (entra e sai suave, sem estalo) */
function swoosh(){
  if(!actx||!soundOn||!noiseBuf)return;
  try{var t=actx.currentTime,d=.5,src=actx.createBufferSource(),f=actx.createBiquadFilter(),g=actx.createGain();
    src.buffer=noiseBuf;f.type='bandpass';f.Q.value=1.6;
    f.frequency.setValueAtTime(380,t);f.frequency.exponentialRampToValueAtTime(1500,t+.2);f.frequency.exponentialRampToValueAtTime(520,t+d);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.1);g.gain.linearRampToValueAtTime(.07,t+.22);g.gain.linearRampToValueAtTime(.12,t+.32);g.gain.linearRampToValueAtTime(0,t+d);
    src.connect(f);f.connect(g);g.connect(sfxBus);src.start(t,Math.random()*.5);src.stop(t+d+.05);
    var o=actx.createOscillator(),og=actx.createGain();o.type='sine';o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(560,t+.25);o.frequency.exponentialRampToValueAtTime(380,t+d);
    og.gain.setValueAtTime(0,t);og.gain.linearRampToValueAtTime(.022,t+.08);og.gain.linearRampToValueAtTime(0,t+d);o.connect(og);og.connect(sfxBus);o.start(t);o.stop(t+d+.05)}catch(e){}
}
var sfx={
  coin:function(){beep(988,.08,'square',.04);beep(1319,.12,'square',.04,0,.07)},
  jump:function(){upSfx(1)},
  dbl:function(){beep(520,.13,'sine',.07,560);beep(780,.1,'triangle',.05,300,.04)},
  land:function(){noise(.09,.07,320,'lowpass');beep(120,.12,'sine',.1,-60)},
  step:function(){noise(.035,.011,2200,'highpass')},
  bump:function(){beep(190,.1,'square',.06,-80);noise(.06,.05,500,'lowpass')},
  brick:function(){noise(.25,.14,900,'bandpass');beep(140,.16,'sawtooth',.05,-80);noise(.12,.06,3200,'highpass',.05)},
  item:function(){[523,659,784,1047].forEach(function(f,i){beep(f,.12,'triangle',.06,0,i*.06)})},
  vine:function(){beep(180,.5,'sine',.05,700);beep(260,.5,'triangle',.03,700,.1)},
  pop:function(){beep(300,.14,'sine',.09,620);beep(520,.1,'triangle',.05,300,.05);noise(.1,.05,1400,'bandpass')},
  pipe:function(){beep(320,.35,'sine',.09,-210);noise(.3,.04,600,'lowpass')},
  alert:function(){var n=actx?actx.currentTime:0;if(n-lastAlert<.4)return;lastAlert=n;beep(880,.07,'square',.045);beep(1175,.1,'square',.045,0,.08)},
  stomp:function(){beep(190,.14,'sawtooth',.06,-110);noise(.07,.05,700,'lowpass')},
  hurt:function(){beep(220,.3,'sawtooth',.08,-150)},
  check:function(){beep(660,.1,'triangle',.07);beep(880,.16,'triangle',.07,0,.09)},
  win:function(){[523,659,784,1047].forEach(function(f,i){beep(f,.2,'triangle',.08,0,i*.13)})},
  lose:function(){beep(300,.5,'sawtooth',.08,-220)},
  spring:function(){beep(320,.22,'sine',.09,520)},
  gem:function(){[1047,1319,1568].forEach(function(f,i){beep(f,.14,'triangle',.07,0,i*.08)})},
  heart:function(){beep(520,.12,'triangle',.07);beep(780,.2,'triangle',.07,0,.1)},
  boom:function(){beep(90,.35,'sawtooth',.1,-40);noise(.3,.1,300,'lowpass')},
  boss:function(){beep(140,.5,'sawtooth',.09,60)},
  grow:function(){[392,523,659,784,1047].forEach(function(f,i){beep(f,.11,'square',.05,0,i*.06)})},
  shrink:function(){beep(720,.35,'sawtooth',.07,-540)},
  shoot:function(){beep(520,.12,'sawtooth',.05,520);noise(.08,.04,1800,'bandpass')},
  fireHit:function(){beep(260,.14,'square',.05,-120);noise(.14,.07,1400,'bandpass')},
  spin:function(){swoosh()},
  sjump:function(){whirlSfx()},
  foxOn:function(){/* galope: "ta-ca-tum, ta-ca-tum" de cascos + pouso na sela */
    function clop(t,v){noise(.05,.1*v,1100+Math.random()*300,'bandpass',t);beep(230,.07,'sine',.08*v,-120,t);beep(640+Math.random()*80,.03,'triangle',.035*v,-220,t)}
    [0,.08,.15,.33,.41,.48].forEach(function(t,i){clop(t,i%3===2?1.25:.85)});
    beep(150,.18,'sine',.11,-80,.66);noise(.12,.08,500,'lowpass',.66);beep(1050,.08,'sine',.035,350,.7)},
  fireOn:function(){noise(.5,.1,500,'lowpass');noise(.35,.06,1400,'bandpass',.1);[392,494,587,740,880,1175].forEach(function(f,i){beep(f,.15,'triangle',.05,0,.1+i*.06)});beep(1568,.35,'sine',.035,0,.5)},
  capeOn:function(){swoosh();[523,659,784,1047,1319,1568].forEach(function(f,i){beep(f,.16,'triangle',.05,0,.12+i*.065)});beep(2093,.3,'sine',.03,0,.55)},
  spinHit:function(){/* pancada do giro: soco grave + estalo de impacto + brilho rápido */
    beep(190,.16,'sine',.13,-130);noise(.09,.12,1300,'bandpass');noise(.16,.07,380,'lowpass');
    beep(880,.09,'triangle',.05,0,.03);beep(1320,.12,'triangle',.04,0,.07)},
  fly:function(){beep(300,.18,'sine',.06,620);noise(.1,.04,900,'bandpass')},
  blub:function(){var n=actx?actx.currentTime:0;if(n-lastBlub<.25)return;lastBlub=n;beep(260+Math.random()*120,.1,'sine',.03,380)},
  swimStroke:function(out){var n=actx?actx.currentTime:0;if(n-lastSwim<.12)return;lastSwim=n;
    noise(.24,out?.05:.03,out?1100:520,'bandpass');noise(.4,out?.035:.02,out?500:260,'lowpass',.04);if(out)beep(520,.08,'sine',.012,-260)},
  swim:function(){var n=actx?actx.currentTime:0;if(n-lastSwim<.15)return;lastSwim=n;/* bolhinhas, como o som da bolha de ar, mais suave e variado */
    var b=480+Math.random()*220;beep(b,.06,'sine',.04,360);beep(b*1.45,.07,'sine',.03,420,.05)},
  splash:function(){var n=actx?actx.currentTime:0;if(n-lastSplash<.4)return;lastSplash=n;/* entrar/sair da água: um punhado de bolhas (o mesmo estilo do som da bolha de ar) */
    for(var i=0;i<4;i++){var f=520+Math.random()*420;beep(f,.07,'sine',.05,f*.7,i*.055)}},
  bubble:function(){beep(700,.07,'sine',.06,500);beep(1050,.1,'sine',.05,600,.06)},
  crunch:function(){noise(.12,.14,2000,'bandpass');noise(.22,.12,320,'lowpass');beep(120,.16,'sawtooth',.07,-70);beep(520,.06,'square',.03,-300)},
  flower:function(){[392,587,784,988,1175].forEach(function(f,i){beep(f,.12,'triangle',.06,0,i*.05)})}
};
function mf(m){return 440*Math.pow(2,(m-69)/12)}
var MUSIC=[
 {bpm:132,lead:'square',lv:.026,drums:2,bassT:0,
  mel:[76,0,79,0,76,72,0,74, 71,0,74,0,79,0,74,71, 69,0,72,0,76,0,72,69, 65,69,72,0,77,0,76,72],
  roots:[36,43,45,41],ch:[[60,64,67],[59,62,67],[60,64,69],[60,65,69]]},
 {bpm:92,lead:'triangle',lv:.05,drums:1,bassT:1,
  mel:[81,0,0,76,0,0,72,0, 77,0,0,72,0,0,69,0, 79,0,0,76,0,0,72,0, 76,0,79,0,83,0,79,0],
  roots:[45,41,48,40],ch:[[57,60,64],[57,60,65],[55,60,64],[55,59,64]]},
 {bpm:118,lead:'square',lv:.024,drums:2,bassT:2,
  mel:[78,0,81,0,78,74,0,76, 74,0,78,0,83,0,81,78, 79,0,83,0,86,0,83,79, 81,0,85,0,81,0,78,76],
  roots:[38,47,43,45],ch:[[62,66,69],[62,66,71],[62,67,71],[61,64,69]]},
 {bpm:78,lead:'sine',lv:.055,drums:1,bassT:1,
  mel:[76,0,0,79,0,0,76,0, 72,0,0,76,0,0,81,0, 77,0,0,81,0,0,77,0, 74,0,0,79,0,76,0,0],
  roots:[36,45,41,43],ch:[[60,64,67],[57,60,64],[60,65,69],[59,62,67]]},
 {bpm:84,lead:'triangle',lv:.045,drums:1,bassT:1,
  mel:[69,0,0,72,0,0,76,0, 74,0,0,72,0,0,69,0, 65,0,0,69,0,0,72,0, 76,0,75,0,74,0,72,0],
  roots:[33,29,31,28],ch:[[57,60,64],[53,57,60],[55,59,62],[56,59,64]]},
 /* 5: Montanha Gelada (cristalina, fria e tensa) */
 {bpm:100,lead:'triangle',lv:.05,drums:2,bassT:1,
  mel:[76,0,0,79,0,83,0,79, 74,0,0,77,0,81,0,77, 72,0,0,76,0,79,0,76, 71,0,74,0,79,0,83,0],
  roots:[40,38,36,35],ch:[[64,67,71],[62,65,69],[60,64,67],[59,63,66]]},
 /* 6: Ruínas do deserto (misteriosa, escala frígia) */
 {bpm:96,lead:'triangle',lv:.05,drums:2,bassT:1,
  mel:[69,0,70,0,73,0,70,69, 67,0,69,0,70,0,69,67, 65,0,67,0,69,0,67,65, 64,0,65,0,69,0,73,0],
  roots:[33,34,31,33],ch:[[57,61,64],[58,62,65],[55,59,62],[57,61,64]]},
 /* 7: Vila Ninja (noite, escala japonesa, calma e misteriosa) */
 {bpm:88,lead:'triangle',lv:.05,drums:1,bassT:1,
  mel:[74,0,75,0,79,0,81,0, 82,0,81,79,0,0,75,0, 74,0,0,79,0,81,0,0, 86,0,82,0,81,0,79,0],
  roots:[38,39,36,38],ch:[[62,67,69],[63,67,70],[60,63,67],[62,65,69]]},
 /* 8: Floresta das Alturas (leve, aérea, subindo) */
 {bpm:112,lead:'triangle',lv:.05,drums:1,bassT:0,
  mel:[72,0,74,76,0,79,0,76, 77,0,76,74,0,72,0,74, 76,0,79,81,0,84,0,81, 79,0,77,76,0,74,0,0],
  roots:[36,41,43,36],ch:[[60,64,67],[60,65,69],[59,62,67],[60,64,67]]},
 /* 9: Vulcão (tensa, rápida, escala menor) */
 {bpm:138,lead:'sawtooth',lv:.03,drums:2,bassT:2,
  mel:[69,0,72,0,76,0,75,72, 69,0,72,76,0,79,0,76, 77,0,76,74,0,72,0,71, 69,0,64,0,68,0,71,0],
  roots:[33,29,31,28],ch:[[57,60,64],[53,57,60],[55,59,62],[52,56,59]]},
 /* 10: O Cume (majestosa, heroica, subindo) */
 {bpm:108,lead:'triangle',lv:.05,drums:2,bassT:0,
  mel:[74,0,78,0,81,0,86,0, 85,0,81,0,78,0,81,0, 79,0,83,0,86,0,83,79, 81,0,78,0,76,0,74,0],
  roots:[38,43,47,45],ch:[[62,66,69],[62,67,71],[59,62,66],[61,64,69]]},
 /* 11: Floresta Ancestral (aventura alegre na mata) */
 {bpm:116,lead:'triangle',lv:.05,drums:1,bassT:0,
  mel:[79,0,76,0,72,0,76,79, 81,0,79,76,0,74,0,72, 74,0,77,0,81,0,79,77, 76,0,72,0,74,0,76,0],
  roots:[36,41,45,43],ch:[[60,64,67],[60,65,69],[57,60,64],[59,62,67]]},
 /* 12: Blocos Celestes (aérea, brilhante, subindo) */
 {bpm:124,lead:'square',lv:.024,drums:2,bassT:0,
  mel:[76,0,79,0,84,0,83,79, 81,0,84,0,88,0,86,84, 83,0,79,0,76,0,79,83, 84,0,0,88,0,86,0,0],
  roots:[36,40,41,43],ch:[[60,64,67],[59,64,67],[60,65,69],[59,62,67]]},
 /* 13: Torre dos Vaga-lumes (noite, misteriosa, tique-taque de relógio) */
 {bpm:100,lead:'triangle',lv:.05,drums:1,bassT:1,
  mel:[81,0,76,0,72,0,76,0, 79,0,74,0,71,0,74,0, 77,0,72,0,69,0,72,77, 76,0,0,79,0,0,83,0],
  roots:[33,31,29,28],ch:[[57,60,64],[55,59,62],[53,57,60],[52,56,59]]},
 /* 14: Mina dos Trilhos (ritmo de trem, aventura) */
 {bpm:136,lead:'square',lv:.026,drums:2,bassT:2,
  mel:[69,0,72,74,0,76,0,74, 72,0,69,0,72,0,74,0, 77,0,76,74,0,72,0,74, 76,0,0,79,0,76,0,0],
  roots:[33,38,36,40],ch:[[57,60,64],[57,62,65],[55,60,64],[56,59,64]]},
 /* 15: Lago da Aurora (noite gelada, calma e brilhante, como um sino de vidro) */
 {bpm:88,lead:'sine',lv:.05,drums:1,bassT:1,
  mel:[79,0,83,0,86,0,83,0, 81,0,0,79,0,76,0,0, 78,0,81,0,85,0,81,0, 83,0,0,0,79,0,76,0],
  roots:[43,40,38,45],ch:[[67,71,74],[64,67,71],[62,66,69],[64,69,73]]},
 /* 16: O Naufrágio (tempestade: menor, tensa, como ondas batendo) */
 {bpm:104,lead:'triangle',lv:.05,drums:2,bassT:1,
  mel:[69,0,72,0,76,0,74,72, 71,0,74,0,77,0,76,74, 72,0,76,0,79,0,77,76, 74,0,71,0,68,0,69,0],
  roots:[33,29,31,28],ch:[[57,60,64],[53,57,60],[55,59,62],[52,56,59]]},
 /* tema do mapa (viagem alegre, tranquila) */
 {bpm:104,lead:'triangle',lv:.05,drums:1,bassT:0,
  mel:[72,0,76,0,79,0,76,79, 81,0,79,0,76,0,72,76, 77,0,81,0,84,0,81,77, 79,0,74,0,71,0,74,79],
  roots:[36,33,29,31],ch:[[60,64,67],[57,60,64],[53,57,60],[55,59,62]]}
];
function playStep(Mu,i,t,sd){
  var bar=i>>3,k=i&7,bus=musBus,root=Mu.roots[bar],ch=Mu.ch[bar];
  if(Mu.drums>0&&(k===0||k===4)){
    var o=actx.createOscillator(),g=actx.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.13);
    g.gain.setValueAtTime(Mu.drums===2?.14:.09,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.2);
  }
  if(Mu.drums===2){
    noiseTo(bus,t,.04,(k&1)?.016:.01,7000,'highpass');
    if(k===2||k===6)noiseTo(bus,t,.1,.05,1800,'bandpass');
  }
  if(Mu.bassT===0){
    if(k===0)tone(bus,mf(root),t,sd*1.6,'triangle',.07);
    else if(k===2)tone(bus,mf(root+12),t,sd*.8,'triangle',.05);
    else if(k===4)tone(bus,mf(root+7),t,sd*1.6,'triangle',.07);
    else if(k===6)tone(bus,mf(root+12),t,sd*.8,'triangle',.05);
  }else if(Mu.bassT===1){
    if(k===0)tone(bus,mf(root),t,sd*3.6,'triangle',.08);
    else if(k===4)tone(bus,mf(root+7),t,sd*3,'sine',.06);
  }else{
    tone(bus,mf(root),t,sd*.85,'sawtooth',k===0?.034:.024);
  }
  if(Mu.bassT!==1||k===2||k===6){
    var an=ch[((k>>1)+bar)%3]+12;
    if(k&1)tone(bus,mf(an),t,sd*.9,'triangle',.016);
  }
  if(Mu.bassT===1&&(k===3||k===7))tone(bus,mf(ch[(k>>2)%3]+24),t,sd*2.4,'sine',.02);
  var m=Mu.mel[i];
  if(m)tone(leadBus,mf(m),t,sd*(Mu.bassT===1?3.2:1.7),Mu.lead,Mu.lv);
}
function musicTick(){
  if(!actx||!MUS||actx.state!=='running')return;
  var now=actx.currentTime;
  var th=state==='map'?MUSIC.length-1:(state==='menu'?0:(LV?(LV.music!==undefined?LV.music:LV.theme):0));
  var vol=(!musicOn||state==='dead')?0:((state==='menu'||state==='map')?.45:((state==='win'||state==='intro')?.25:.6));
  musBus.gain.setTargetAtTime(Math.max(.0001,vol*volMus()),now,.25);if(sfxBus)sfxBus.gain.setTargetAtTime(volSfx(),now,.05);
  if(subG)subG.gain.setTargetAtTime(0,now,.2);
  if(leadBus)leadBus.frequency.setTargetAtTime((state==='play'&&P.hd)?650:2800,now,.12);
  if(MUS.theme!==th){MUS.theme=th;MUS.step=0;MUS.next=Math.max(MUS.next,now+.05)}
  if(MUS.next<now-.3)MUS.next=now+.05;
  var Mu=MUSIC[th],sd=60/Mu.bpm/2*((state==='play'&&timeLeft<=60)?.82:1);
  while(MUS.next<now+.22){
    if(vol>.001){try{playStep(Mu,MUS.step,MUS.next,sd)}catch(e){}}
    MUS.step=(MUS.step+1)%32;MUS.next+=sd;
  }
}

/* ===================== pós-processamento ===================== */
var composer=null,bloom=null,gradePass=null,quality='high';
function expU(){return briU()*(GRADE&&quality!=='high'?GRADE.exp:1)}/* exposição da tela: brilho do jogador + ajuste do modo leve */
function briU(){try{return cfg.briU===undefined?1:+cfg.briU}catch(e){return 1}}/* brilho pessoal (1 = padrão) */
var GradeShader={
  uniforms:{tDiffuse:{value:null},exposure:{value:.82},vig:{value:.3},sat:{value:1},bri:{value:1}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:[
    'uniform sampler2D tDiffuse;uniform float exposure;uniform float vig;uniform float sat;uniform float bri;varying vec2 vUv;',
    'vec3 aces(vec3 x){x*=exposure;const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0);}',
    'void main(){vec4 t=texture2D(tDiffuse,vUv);vec3 c=aces(t.rgb*bri);',
    'float l0=dot(c,vec3(.2126,.7152,.0722));c=clamp(mix(vec3(l0),c,sat),0.,1.);',/* cor mais viva (Alto para cima) */
    'c=clamp(mix(c,c*c*(3.-2.*c),(sat-1.)*.6),0.,1.);',/* um pouco mais de contraste junto */
    'float l=dot(c,vec3(.299,.587,.114));',
    'c=mix(c,c*vec3(1.05,1.0,.93),smoothstep(.4,1.,l));',
    'c=mix(c,c*vec3(.93,.98,1.06),1.-smoothstep(0.,.5,l));',
    'vec2 q=vUv-.5;c*=clamp(1.-dot(q,q)*vig*2.2,0.,1.);',
    'c=pow(c,vec3(1./2.2));gl_FragColor=vec4(c,1.);}'
  ].join('\n')
};
var SharpShader={
  uniforms:{tDiffuse:{value:null},texel:{value:new T.Vector2(1/1280,1/720)},amount:{value:.5}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:[
    'uniform sampler2D tDiffuse;uniform vec2 texel;uniform float amount;varying vec2 vUv;',
    'void main(){vec4 c=texture2D(tDiffuse,vUv);',
    'vec3 n=texture2D(tDiffuse,vUv+vec2(0.,texel.y)).rgb+texture2D(tDiffuse,vUv-vec2(0.,texel.y)).rgb+texture2D(tDiffuse,vUv+vec2(texel.x,0.)).rgb+texture2D(tDiffuse,vUv-vec2(texel.x,0.)).rgb;',
    'vec3 d=c.rgb-n*.25;d=clamp(d,vec3(-.12),vec3(.12));',
    'gl_FragColor=vec4(clamp(c.rgb+d*amount,0.,1.),1.);}'
  ].join('\n')
};
var sharpPass=null;
function buildComposer(){
  if(!T.EffectComposer||!T.RenderPass||!T.ShaderPass||!T.UnrealBloomPass)return false;
  try{
    var w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight),pr=renderer.getPixelRatio(),rt=null;
    try{
      var half=renderer.capabilities.isWebGL2&&(renderer.extensions.has('EXT_color_buffer_float')||renderer.extensions.has('EXT_color_buffer_half_float'));
      rt=new T.WebGLRenderTarget(w*pr,h*pr,{type:half?T.HalfFloatType:T.UnsignedByteType,format:T.RGBAFormat,samples:(renderer.capabilities.isWebGL2&&!coarse)?4:0});
    }catch(e){rt=null}
    composer=rt?new T.EffectComposer(renderer,rt):new T.EffectComposer(renderer);
    composer.addPass(new T.RenderPass(scene,camera));
    bloom=new T.UnrealBloomPass(new T.Vector2(w,h),.42,.55,.92);
    composer.addPass(bloom);
    gradePass=new T.ShaderPass(GradeShader);
    gradePass.uniforms.exposure.value=curTheme.exp;
    composer.addPass(gradePass);
    sharpPass=new T.ShaderPass(SharpShader);sharpPass.enabled=false;composer.addPass(sharpPass);
    return true;
  }catch(err){composer=null;return false}
}
var cam={x:6,y:3,dist:20};
function layout(){
  var w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);
  camera.aspect=w/h;
  var t=Math.tan(T.MathUtils.degToRad(camera.fov/2));
  cam.dist=clamp(8.8/(t*camera.aspect),11.5,34);
  camera.updateProjectionMatrix();
  if(mapCam){mapCam.aspect=w/h;mapCam.updateProjectionMatrix()}
  renderer.setSize(w,h);
  if(composer){composer.setPixelRatio(renderer.getPixelRatio());composer.setSize(w,h)}
  if(sharpPass){var spr=renderer.getPixelRatio();sharpPass.uniforms.texel.value.set(1/(w*spr),1/(h*spr))}
}
var dynK=1,dynFor=null,RESK=[1,.9,.8,.7,.6],pfW={t:0,n:0,bad:0,good:0,cool:0,probe:0};
/* resolução dinâmica: se o FPS cai, baixa um degrau (até 60%); quando fica folgado por uns segundos, volta a subir. Só mexe no tamanho da imagem. */
function resStep(d){var i=RESK.indexOf(dynK);if(i<0)i=0;i=clamp(i+d,0,RESK.length-1);if(RESK[i]===dynK)return false;dynK=RESK[i];pfW.cool=2;prApply();return true}
function calcPR(e){var nat=Math.min(window.devicePixelRatio||1,e.cap||2),pr0=nat*e.res;
  if(e.res>1){var sw=Math.max(1,stage.clientWidth),sh=Math.max(1,stage.clientHeight);pr0=Math.max(nat,Math.min(pr0,Math.sqrt((e.px||(coarse?3.4e6:6.5e6))/(sw*sh))))}
  return clamp(pr0*dynK,.4,e.maxPR||2)}
function prApply(){var pr=calcPR(effCfg());if(Math.abs(renderer.getPixelRatio()-pr)>.001){renderer.setPixelRatio(pr);layout()}}
/* Automático: 1) mede o FPS de verdade a cada segundo; 2) primeiro ajusta a resolução; 3) se não bastar, desce a qualidade;
   4) só sobe a qualidade depois de ~8 s folgado, e testa: se cair, volta e não tenta de novo aquela qualidade;
   5) lembra a qualidade que deu certo em cada mundo e no aparelho (começa nela da próxima vez) */
function autoMax(){return Math.min(coarse?2:3,failedLvl-1,(failW[levelIdx]||99)-1)}/* teto: o do aparelho, o do teste de desempenho e o que já falhou neste mundo */
function autoSet(l,why){if(l===autoLvl)return;autoLvl=l;dynK=1;pfW.good=0;pfW.bad=0;applyGfx();cfg.autoLvl=l;if(!cfg.autoW)cfg.autoW={};cfg.autoW[levelIdx]=l;saveCfg()}
function autoPick(idx){if(cfg.preset!=='auto'||bench)return;var w=cfg.autoW&&cfg.autoW[idx];var l=w!=null?w:(cfg.autoLvl!=null?cfg.autoLvl:autoLvl);autoLvl=clamp(l,0,Math.max(0,autoMax()));dynK=1}
function perfTick(raw){
  if(bench||raw>.25)return;
  if(autoSkip>0){autoSkip--;return}
  pfW.t+=raw;pfW.n++;if(pfW.t<1)return;
  var f=pfW.n/pfW.t;pfW.t=0;pfW.n=0;window.__lastFps=f;
  var cap=cfg.cap&&cfg.cap<60?cfg.cap:60,tgt=cap*.95,low=cap*.8,au=cfg.preset==='auto';
  if(pfW.cool>0)pfW.cool--;
  if(au&&pfW.probe>0){pfW.probe--;if(f<low){failW[levelIdx]=autoLvl;pfW.probe=0;autoSet(autoLvl-1);return}}/* subiu e não aguentou: volta */
  if(f<low){pfW.good=0;pfW.bad++;
    if(au&&autoLvl>0&&(f<cap*.55||(dynK<=.8&&pfW.bad>=2))){autoSet(autoLvl-1);return}/* muito pesado: desce a qualidade */
    if(pfW.cool===0)resStep(1);
  }else if(f>=tgt){pfW.bad=0;pfW.good++;
    if(dynK<1){if(pfW.good>=3&&pfW.cool===0){resStep(-1);pfW.good=0}}
    else if(au&&pfW.good>=8&&autoLvl<autoMax()){autoSet(autoLvl+1);pfW.probe=5}
  }else{pfW.bad=0;pfW.good=0}
}
var autoLvl=(coarse||weakG)?0:2,failedLvl=99,failW={},autoGood=0,autoSkip=15,capMs=0,fpsBoxT=0,fpsBoxN=0;
function effCfg(){
  if(benchOv)return PRESETS[benchOv];
  if(cfg.preset==='auto')return PRESETS[AUTO[autoLvl]];
  if(PRESETS[cfg.preset])return PRESETS[cfg.preset];
  var c=cfg.c,LU=c.lush!==undefined?(c.lush===true?1:+c.lush||0):(c.res>=1?1:0);return {res:c.res,cap:coarse?1.5:2,maxPR:c.res>1?3:2,shadows:c.shadows,bloom:c.bloom,bump:c.bump,part:c.part,fx:c.fx,shMap:coarse?1024:2048,lush:LU,sharp:LU>=1?1:0,aniso:LU>=1?16:8,sat:LU>=1?1.22:1,css:LU>0&&LU<1?1:0};
}
function applyGfx(){
  var e=effCfg(),refresh=false;
  gPart=PARTM[e.part];gFx=e.fx;
  if(cfg.preset!==dynFor){dynFor=cfg.preset;dynK=1}
  renderer.setPixelRatio(calcPR(e));
  if(e.shadows!==shadowOn){shadowOn=e.shadows;renderer.shadowMap.enabled=shadowOn;sun.castShadow=shadowOn;refresh=true}
  /* sombras leves (Médio): área menor em volta do Kuro, sem sombra do cenário do fundo, e o mapa de sombra é refeito a cada 2 quadros */
  shLite=!!e.shLite;var sc=sun.shadow.camera,ex=shLite?[13,10]:[22,16];
  if(sc.right!==ex[0]){sc.left=-ex[0];sc.right=ex[0];sc.top=ex[1];sc.bottom=-ex[1];sc.updateProjectionMatrix()}
  renderer.shadowMap.autoUpdate=!shLite;renderer.shadowMap.needsUpdate=true;
  shLiteApply();
  var ms=Math.min(e.shMap||1024,renderer.capabilities.maxTextureSize||2048);
  if(sun.shadow.mapSize.x!==ms){sun.shadow.mapSize.set(ms,ms);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}
  var wb=!!(e.bloom||e.sharp||(e.sat||1)>1);if(wb&&!composer&&!buildComposer())wb=false;/* o pós-processo (nitidez e cor) não depende mais do brilho */
  if(bloom)bloom.enabled=!!e.bloom;
  quality=wb?'high':'low';
  lushVis();
  if(sharpPass){sharpPass.enabled=wb&&!!e.sharp;sharpPass.uniforms.amount.value=.65}
  var su=cfg.satU===undefined?1:+cfg.satU;/* saturação escolhida pelo jogador (vale em todas as qualidades) */
  if(gradePass)gradePass.uniforms.sat.value=(e.sat||1)*su;
  if(gradePass)gradePass.uniforms.bri.value=briU();if(typeof curTheme!=='undefined'&&curTheme)renderer.toneMappingExposure=curTheme.exp/.82*expU();/* brilho escolhido pelo jogador */
  applyLawn(!!e.lawn);
  var fl='';if(!wb){var bs=e.css&&!GRADE?.94:1,sat=bs*su;if(e.css&&!GRADE)fl='contrast(1.05) brightness(1.02)';if(Math.abs(sat-1)>.005)fl='saturate('+sat.toFixed(2)+') '+fl}/* modo leve: cor feita no shader (GRADE); filtro CSS só se o jogador mexeu na saturação */
  renderer.domElement.style.filter=fl.trim();
  var an=Math.min(e.aniso||8,hwAniso);
  if(an!==curAniso){curAniso=an;texList.forEach(function(t){t.anisotropy=an;t.needsUpdate=true})}
  if(e.bump!==bumpOn){bumpOn=e.bump;bumpReg.forEach(function(q){q[0].bumpMap=bumpOn?q[1]:null});refresh=true}
  if(refresh){
    matReg.forEach(function(m){m.needsUpdate=true});bumpReg.forEach(function(q){q[0].needsUpdate=true});
    scene.traverse(function(o){if(o.material){[].concat(o.material).forEach(function(m){m.needsUpdate=true})}});
  }
  capMs=cfg.cap?1000/cfg.cap:0;
  var fb=$('fpsBox');if(fb)fb.hidden=!cfg.fps;
  fpsAcc=0;fpsN=0;autoSkip=15;pfW.t=0;pfW.n=0;
  layout();
  if(window.__cfgRefresh)window.__cfgRefresh();
}
