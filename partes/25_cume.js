/*@@parte:25_cume.js*/
var sumIsleQ=[],sumRootQ=[];
/* ===================== Mundo 11: O Cume ===================== */
/* parte 1: encosta do vento — céu do amanhecer, mar de nuvens, bandeirinhas que avisam as rajadas, pedras de abrigo, cabritos e corvos da neve */
var sumU={time:{value:0},wind:{value:0},agit:{value:.25},day:{value:0}},sumFx=null;
function sumRockMat(){if(!sumFx)sumFx={};if(!sumFx.rock)sumFx.rock=M(0xffffff,.92,0,{vertexColors:true,flatShading:true});return sumFx.rock}
/* pinta a pedra: neve nas faces de cima, rocha nas laterais */
function snowCap(g,rockC,snowC,lim){
  var n=g.attributes.normal,p=g.attributes.position,c=new Float32Array(n.count*3),a=new T.Color(rockC),b=new T.Color(snowC),t=new T.Color();
  for(var i=0;i<n.count;i++){var ny=n.getY(i),k=clamp((ny-(lim||.45))/.25,0,1),v=.9+.2*Math.sin(p.getX(i)*3.1+p.getZ(i)*2.3);t.copy(a).multiplyScalar(v).lerp(b,k);c[i*3]=t.r;c[i*3+1]=t.g;c[i*3+2]=t.b}
  g.setAttribute('color',new T.BufferAttribute(c,3));return g;
}
function buildPlatformsSummit(m3){
  var RK=[],r=rnd(1111),lite=coarse&&(+effCfg().lush||0)<.6;sumStoneQ={gr:[],ms:[],sn:[],pl:[],lf:[]};sumIsleQ=[];sumRootQ=[];
  LV.solids.forEach(function(s){
    var x0=s[0],x1=s[1],top=s[2],bot=s[3]!==undefined?s[3]:-14,w=x1-x0,cx=(x0+x1)/2;
    solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,slip:!!s[4]});
    if(s[5]==='isle'){/* ilha flutuante: topo de neve, corpo de pedra e a ponta de baixo afinando, com pingentes de gelo */
      var hh=top-bot;if(!sumFx.side){var stx0=strataTex();sumFx.side=M(0xd8d6e0,.92,0,{map:stx0,bumpMap:stx0,bumpScale:.05})}
      var bd=mesh(boxGeo(w,hh-.75,3.4,4.4),sumFx.side);bd.position.set(cx,bot+(hh-.75)/2,-.6);add(bd);
      if(!sumFx.soil)sumFx.soil=pbr(texDirt,.97,1.2,{color:new T.Color(0x9a7a5a)});var so2=mesh(boxGeo(w+.08,.5,3.46,1.4),sumFx.soil);so2.position.set(cx,top-.62,-.6);add(so2);
      /* base: rochas quebradas afinando para baixo */
      var lay=lite?3:5;for(var q=0;q<lay;q++){var f=1-q/lay,ny=Math.max(2,Math.round(w*f/1.6));for(var j=0;j<ny;j++){var rg=chipRock(r,lite?1:2),sc=(.9+r()*.6)*(.55+f*.6);
        xf(rg,[cx+(j-(ny-1)/2)*w*f/ny*.95+(r()-.5)*.4,bot-.2-q*1.05,-.6+(r()-.5)*.8],[r()*3,r()*3,r()*3],[sc*1.2,sc*.9,sc*.85]);rg.computeVertexNormals();sumIsleQ.push({g:rg})}}
      var tip=chipRock(r,1);xf(tip,[cx,bot-.2-lay*1.05,-.6],[r(),r()*3,r()],[.7,1.3,.6]);tip.computeVertexNormals();sumIsleQ.push({g:tip});
      /* raízes e cipós pendurados na frente */
      for(q=0;q<Math.floor(w*(lite?.5:.9));q++){var rx=x0+.3+r()*(w-.6),len=.5+r()*1.6,vine=r()<.45,y0=top-.45-r()*.3;
        for(var sgm=0;sgm<3;sgm++){var l3=len/3,yy=y0-sgm*l3,wob=Math.sin(sgm*1.7+rx)*.12;sumRootQ.push({g:xf(new T.CylinderGeometry(vine?.025:.035,vine?.02:.03,l3,4),[rx+wob,yy-l3/2,1.12],[0,0,wob*.6]),c:vine?(sgm%2?0x5e8a3a:0x4e7a30):(sgm%2?0x7a5a3e:0x6a4c34)})}
        if(vine)sumRootQ.push({g:xf(new T.IcosahedronGeometry(.1,0),[rx,y0-len,1.12],[r(),r(),r()],[1,1.4,.6]),c:0x5a8a36})}
      var lp=mesh(boxGeo(w+.2,.4,3.6,2),grassM);lp.position.set(cx,top-.2,-.6);add(lp);
      for(q=0;q<Math.floor(w*1.6);q++)sumStoneQ.ms.push({g:xf(new T.IcosahedronGeometry(1,1),[x0+r()*w,top-.42-r()*.12,1.12],[r(),r()*6,0],[.2+r()*.16,.14+r()*.1,.14]),c:[0x4e7a30,0x5e8a3a,0x3e6a2a][q%3]});
      return}
    if(s[5]==='rock'){/* pedra de abrigo: duas rochas grandes com neve em cima */
      var h=top-bot;mossRock(cx,bot,-.2,w*1.25,h*1.12,r,{big:true,lite:lite});
      return}
    var vb=bot;LV.solids.forEach(function(o){if(o!==s&&o[5]!=='rock'&&o[0]<=x0+.01&&o[1]>=x1-.01&&o[2]<top-.3&&o[2]-.32>vb)vb=o[2]-.32});
    if(!sumFx)sumFx={};if(!sumFx.side){var stx=strataTex();sumFx.side=M(0xd8d6e0,.92,0,{map:stx,bumpMap:stx,bumpScale:.05})}
    var body=mesh(boxGeo(w,top-.3-vb,6.8,4.4),sumFx.side);body.position.set(cx,(top-.3+vb)/2,-1.6);add(body);
    if(!sumFx.top){var snx=snowTopTex();sumFx.top=M(0xffffff,.82,0,{map:snx,bumpMap:snx,bumpScale:.02})}
    if(!sumFx.stone)sumFx.stone=pbr(texStone,.85,.4,{color:new T.Color(0xc8c4cc)});
    var lip=mesh(boxGeo(w+.14,.34,6.94,2.2),(s[5]==='shrine'||s[5]==='step')?sumFx.stone:sumFx.top);lip.position.set(cx,top-.17,-1.6);add(lip);
    /* beirada de neve arredondada na frente, pingentes de gelo e a trilha pisada no meio */
    if(s[5]!=='shrine'&&s[5]!=='step'){
      var cg=new T.CylinderGeometry(.2,.2,w+.1,10,Math.max(4,Math.round(w*2)),false);cg.rotateZ(Math.PI/2);var cp=cg.attributes.position;
      for(var k=0;k<cp.count;k++){var vx=cp.getX(k),f=1+.28*Math.sin(vx*2.3+x0)+.18*Math.sin(vx*5.1+top);cp.setY(k,cp.getY(k)*f*.75);cp.setZ(k,cp.getZ(k)*f)}cg.computeVertexNormals();
      sumStoneQ.sn.push({g:xf(cg,[cx,top-.1,1.86])});
      if(!sumFx.ice)sumFx.ice=M(0xbfe6ff,.15,0,{transparent:true,opacity:.85});
      for(k=0;k<Math.floor(w/2.5);k++){var ic=mesh(new T.ConeGeometry(.06+r()*.05,.3+r()*.5,5),sumFx.ice,false,false);ic.rotation.x=Math.PI;ic.position.set(x0+.4+r()*(w-.8),top-.48,2.02);add(ic)}
      if(!sumFx.trM)sumFx.trM=new T.MeshStandardMaterial({map:trailTex(),transparent:true,depthWrite:false,roughness:.95,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
      var tg=new T.PlaneGeometry(w,1.7);tg.rotateX(-Math.PI/2);var tuv=tg.attributes.uv;for(var u=0;u<tuv.count;u++)tuv.setX(u,tuv.getX(u)*w/4);var tr=new T.Mesh(tg,sumFx.trM);tr.position.set(cx,top+.004,-.1);tr.receiveShadow=true;add(tr)}
  });
  if(RK.length){var g=snowCap(mergeG(RK),0x6a6470,0xf4f6fb,.4);add(mesh(g,sumRockMat(),true,true))}
  if(sumIsleQ.length){var ig=mergeVC(sumIsleQ);boxUV(ig,.6);var gtx=graniteTex();add(mesh(ig,M(0xb4b8b6,.92,0,{map:gtx,bumpMap:gtx,bumpScale:.04,vertexColors:true}),true,true))}
  if(sumRootQ.length)add(mesh(mergeG(sumRootQ,true),M(0xffffff,.9,0,{vertexColors:true}),false,false));
  LV.floats.forEach(function(f){
    var w=f[1]-f[0],cx=(f[0]+f[1])/2;
    if(f[3]==='b'){/* ponte de corda: tábuas, cordas de corrimão e postes */
      var PL=[],RP=[];for(var x=f[0]+.1;x<f[1]-.1;x+=.42)PL.push({g:xf(new T.BoxGeometry(.34,.1,1.5),[x+.17,f[2]-.06,0],[0,0,(r()-.5)*.05])});
      [-.72,.72].forEach(function(z){RP.push({g:xf(new T.CylinderGeometry(.03,.03,w,5),[cx,f[2]+.75,z],[0,0,Math.PI/2])});RP.push({g:xf(new T.CylinderGeometry(.06,.06,1.3,5),[f[0]+.1,f[2]+.45,z])},{g:xf(new T.CylinderGeometry(.06,.06,1.3,5),[f[1]-.1,f[2]+.45,z])})});
      add(mesh(mergeG(PL),woodM,true,true));add(mesh(mergeG(RP),M(0x6a4a2a,.9),false,false));
      solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.12,oneway:false,flt:true});return}
    var m=mesh(boxGeo(w,.62,3,2),sumFx.side||m3.slab);m.position.set(cx,f[2]-.34,0);add(m);var tp=mesh(boxGeo(w+.1,.12,3.1,2),sumFx.top||m3.slab);tp.position.set(cx,f[2]-.06,0);add(tp);
    var cg2=new T.CylinderGeometry(.13,.13,w,8);cg2.rotateZ(Math.PI/2);sumStoneQ&&sumStoneQ.sn.push({g:xf(cg2,[cx,f[2]-.06,1.5],0,[1,.8,1])});
    solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.5,oneway:false,flt:true});
  });
}
/* mar de nuvens: ruído que corre devagar, iluminado pelo amanhecer */
function cloudSeaMat(holes){
  var lite=coarse&&(+effCfg().lush||0)<.6;
  return new T.ShaderMaterial({transparent:!!holes,depthWrite:!holes,uniforms:T.UniformsUtils.merge([T.UniformsLib.fog,{time:{value:0},day:{value:0}}]),
    vertexShader:['varying vec2 vP;','#include <fog_pars_vertex>','void main(){vec4 wp=modelMatrix*vec4(position,1.);vP=wp.xz;vec4 mvPosition=viewMatrix*wp;gl_Position=projectionMatrix*mvPosition;','#include <fog_vertex>','}'].join('\n'),
    fragmentShader:['uniform float time,day;varying vec2 vP;','#include <common>','#include <fog_pars_fragment>','#define OCT '+(lite?3:5),
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}','float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<OCT;i++){v+=a*vnoise(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}',
      'void main(){vec2 p=vP*vec2(.035,.05)+vec2(time*.13,time*.012);float n=fbm(p),m=fbm(p*2.3+n*1.6-vec2(time*.22,0.));',
      'float h=smoothstep(.25,.85,n*.6+m*.55);vec3 sh=vec3(.62,.58,.82),lit=vec3(1.,.9,.86),gold=vec3(1.,.78,.55);',
      'vec3 c=mix(sh,lit,h);c=mix(c,gold,smoothstep(.55,1.,m)*.35);',
      'vec3 cd=mix(vec3(.70,.77,.86),vec3(1.,1.,1.),smoothstep(.2,.8,n*.6+m*.55));cd=mix(cd,vec3(.86,.9,.96),smoothstep(.6,1.,m)*.4);c=mix(c,'+(sumLin()?'pow(cd,vec3(1.8))*1.05':'cd')+',day);',
      (holes?'float hv=fbm(vP*vec2(.05,.07)+vec2(time*.12,3.+time*.01))+(1.-n)*.2;float hole=1.-smoothstep(.5,.72,hv)*.9;gl_FragColor=vec4(c,mix(1.,hole,day));':'gl_FragColor=vec4(c,1.);'),'#include <fog_fragment>','}'].join('\n'),fog:true});
}
/* bandeirinhas de oração: balançam com o vento e se esticam antes da rajada (o aviso) */
function flagMat(){
  var m=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide});
  m.onBeforeCompile=function(sh){sh.uniforms.uT=sumU.time;sh.uniforms.uW=sumU.wind;sh.uniforms.uA=sumU.agit;
    sh.vertexShader='attribute float fw;attribute float fph;uniform float uT,uW,uA;\n'+sh.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nfloat sw=sin(uT*9.+fph+position.x*1.7);transformed.x+=uW*fw*.42+sw*fw*.04*uA;transformed.y+=abs(uW)*fw*.2-fw*.02;transformed.z+=sw*fw*(.04+.16*uA);')};
  return m;
}
function buildDecorSummit(th){
  var r=rnd(4711),i,k,d=new T.Object3D(),lite=coarse&&(+effCfg().lush||0)<.6,xe=sceneEnd();
  sumFx=Object.assign(sumFx||{},{base:null,dayM:[],dawn:[],sea:null,sun:null,glow:null,rays:[],sparks:[],windWas:0,told:false,snd:0});
  /* mar de nuvens lá embaixo */
  var sm=cloudSeaMat();sm.uniforms.time=sumU.time;sm.uniforms.day=sumU.day;var sea=new T.Mesh(new T.PlaneGeometry(xe+260,420,1,1),sm);sea.rotation.x=-Math.PI/2;sea.position.set(xe/2,-9,-170);sea.frustumCulled=false;add(sea);
  /* acima das nuvens: uma segunda camada logo abaixo das ilhas */
  if(LV.fall){var x0=LV.fall.x,sm2=cloudSeaMat(true);sm2.uniforms.time=sumU.time;sm2.uniforms.day=sumU.day;var sea2=new T.Mesh(new T.PlaneGeometry(xe-x0+200,300,1,1),sm2);sea2.renderOrder=2;
    buildCloudForest(r,lite);sea2.rotation.x=-Math.PI/2;sea2.position.set((x0+xe+200)/2-20,LV.fall.y-1.2,-120);sea2.frustumCulled=false;add(sea2);
    for(i=0;i<(lite?8:16);i++){var c2=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:i%2?0xfff0ea:0xe8dcf4,transparent:true,opacity:.75,depthWrite:false}));var s3=8+r()*12;c2.scale.set(s3,s3*.35,1);c2.position.set(x0+r()*(xe-x0),LV.fall.y-.6+r()*1.5,-4-r()*30);add(c2);sumFx.sparks.push({s:c2,x0:c2.position.x,sp:.2+r()*.4})}}
  /* nuvens soltas na frente e atrás */
  for(i=0;i<(lite?8:16);i++){var cs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:i%3?0xffe8e0:0xd8d0f0,transparent:true,opacity:.55,depthWrite:false}));var sz=14+r()*16;cs.scale.set(sz,sz*.32,1);cs.position.set(-20+r()*(xe+40),-6+r()*3,-14-r()*40);add(cs);sumFx.sparks.push({s:cs,x0:cs.position.x,sp:.3+r()*.5})}
  /* paredão da montanha atrás da trilha: rochas grandes com neve */
  var MT=[];LV.solids.forEach(function(s){if(s[5]==='rock'||s[3]!==undefined)return;var w=s[1]-s[0];
    for(var x=s[0]+1;x<s[1]-1;x+=5+r()*4){var hh=1.6+r()*2.2,mz=-6.5-r()*2.5;mossRock(x,sumSlopeY(x,mz)-.15,mz,2+r()*1.6,hh,r,{lite:lite,noPlant:r()<.4})}});
  sumGrass(r,lite);
  buildDolomites(r,lite);
  for(i=0;i<(lite?6:12);i++){var bx=-30+r()*(xe+40),bh=10+r()*14;if(bx<170||LV.fall)continue;MT.push({g:xf(new T.ConeGeometry(7+r()*6,bh,6),[bx,-9+bh/2,-55-r()*30],[0,r()*3,0])})}
  if(MT.length)add(mesh(snowCap(mergeG(MT),0x5c5868,0xf2f0f6,.35),sumRockMat(),false,true));
  flushStones();
  /* pinheirinhos tortos com neve, montinhos de pedra (marcos) */
  var PN=[],CN=[];LV.solids.forEach(function(s,si){if(s[5]==='rock'||s[1]-s[0]<8)return;
    var px=s[0]+2+r()*(s[1]-s[0]-4),h=1.6+r()*1.2;PN.push({g:xf(new T.CylinderGeometry(.06,.1,h*.5,5),[px,s[2]+h*.25,-3.6]),c:0x3a2a20});
    for(k=0;k<3;k++)PN.push({g:xf(new T.ConeGeometry(.75-k*.18,h*.45,7),[px,s[2]+h*(.38+k*.2),-3.6]),c:k===2?0xf2f4f8:0x2a4a3a});
    if(si%2===0){var cx2=s[0]+1.5+r()*(s[1]-s[0]-3);for(k=0;k<4;k++)CN.push({g:xf(new T.DodecahedronGeometry(.32-k*.06,0),[cx2,s[2]+.2+k*.42,-3.2],[r(),r(),r()],[1.3,.7,1.1])})}});
  if(PN.length)add(mesh(mergeG(PN,true),M(0xffffff,.85,0,{vertexColors:true,flatShading:true}),true,false));
  if(CN.length)add(mesh(snowCap(mergeG(CN),0x7a7480,0xf4f6fb,.7),sumRockMat(),true,false));
  /* cordas de bandeirinhas entre postes, atrás da trilha */
  var FL=[],POS=[],COL=[],FW=[],FPH=[],cols=[0x2f6fd8,0xf4f4f0,0xd8382a,0x2fa85a,0xf2c230];
  function quad(ax,ay,az,w2,h2,c,ph){var o=POS.length/3;
    var v=[[ax,ay,az,0],[ax+w2,ay,az,0],[ax+w2,ay-h2,az,1],[ax,ay-h2,az,1]];v.forEach(function(q){POS.push(q[0],q[1],q[2]);COL.push(c.r,c.g,c.b);FW.push(q[3]);FPH.push(ph)});FL.push(o,o+1,o+2,o,o+2,o+3)}
  var poles=[],ropeG=[];LV.solids.forEach(function(s){if(s[5]==='rock'||s[1]-s[0]<7)return;
    var a=s[0]+.8,b=s[1]-.8,y0=s[2]+3.4,z=-2.7,n=Math.floor((b-a)/.62),cc=new T.Color();
    poles.push({g:xf(new T.CylinderGeometry(.06,.07,3.6,5),[a,s[2]+1.8,z])},{g:xf(new T.CylinderGeometry(.06,.07,3.6,5),[b,s[2]+1.8,z])});
    for(k=0;k<n;k++){var u=k/n,x=a+(b-a)*u,sag=Math.sin(u*Math.PI)*.7;cc.setHex(cols[k%5]);quad(x+.05,y0-sag,z,.42,.5,cc,k*.7+s[0])}
    for(k=0;k<16;k++){var u0=k/16,u1=(k+1)/16,xa=a+(b-a)*u0,xb2=a+(b-a)*u1,ya=y0-Math.sin(u0*Math.PI)*.7,yb=y0-Math.sin(u1*Math.PI)*.7,ln=Math.hypot(xb2-xa,yb-ya);
      ropeG.push({g:xf(new T.CylinderGeometry(.018,.018,ln,4),[(xa+xb2)/2,(ya+yb)/2+.02,z],[0,0,Math.atan2(yb-ya,xb2-xa)-Math.PI/2])})}});
  if(FL.length){var fg=new T.BufferGeometry();fg.setAttribute('position',new T.Float32BufferAttribute(POS,3));fg.setAttribute('color',new T.Float32BufferAttribute(COL,3));fg.setAttribute('fw',new T.Float32BufferAttribute(FW,1));fg.setAttribute('fph',new T.Float32BufferAttribute(FPH,1));fg.setIndex(FL);fg.computeVertexNormals();
    var fm=new T.Mesh(fg,flagMat());fm.frustumCulled=false;add(fm)}
  if(poles.length)add(mesh(mergeG(poles.concat(ropeG)),M(0x4a3a2a,.9),true,false));
  if(LV.fall)buildGreenPeaks(r,lite);
  (function(){var bl=[],d=new T.Object3D(),q=(coarse?.5:1)*((+effCfg().lush||0)>=.6?1:.45);
    LV.solids.forEach(function(s){if(s[5]!=='isle')return;var n=Math.round((s[1]-s[0])*14*q);for(var k=0;k<n;k++){var x=s[0]+.1+r()*(s[1]-s[0]-.2),z=r()<.7?.75+r()*.45:-2.2-r()*.2;bl.push([x,s[2],z,.25+r()*.4,.1+r()*.05])}});
    if(!bl.length)return;var bg=bladeGeo(),gm=grassMat({base:'#1e3a12',mid:'#3e7a26',tip:'#9ccc5a',sway:1});gm.uniforms.time=lushU.time;
    var im=new T.InstancedMesh(bg,gm,bl.length),ar=new Float32Array(bl.length*3);bl.forEach(function(b,j){d.position.set(b[0],b[1]-.02,b[2]);d.rotation.set(0,r()*6.283,0);d.scale.set(b[4],b[3],b[4]);d.updateMatrix();im.setMatrixAt(j,d.matrix);ar[j*3]=r();ar[j*3+1]=r();ar[j*3+2]=.6+r()*.6});
    bg.setAttribute('aR',new T.InstancedBufferAttribute(ar,3));im.frustumCulled=false;add(im)})();
  /* portais vermelhos nas ilhas */
  var TO=[],TB=[];LV.solids.forEach(function(s){if(s[5]!=='isle')return;var x=s[0]+1.6,y=s[2],z=-1.9;
    [-1,1].forEach(function(sd){TO.push({g:xf(new T.CylinderGeometry(.16,.19,4,10),[x+sd*1.3,y+2,z])})});
    TO.push({g:xf(new T.BoxGeometry(3.3,.28,.36),[x,y+3.4,z])});TB.push({g:xf(new T.BoxGeometry(3.9,.3,.5),[x,y+4.05,z],[0,0,0])});TB.push({g:xf(new T.BoxGeometry(4.3,.14,.6),[x,y+4.25,z])})});
  if(TO.length){add(mesh(mergeG(TO),M(0xd8402a,.6),true,false));add(mesh(mergeG(TB),M(0x221a1a,.6),true,false))}
  /* o santuário do topo: colunas vermelhas, telhado curvo, lanternas de pedra e o sol nascendo atrás */
  if(LV.boss){var B=LV.boss,ax=B.arena[0],bx2=B.arena[1],ty=B.top,mx=(ax+bx2)/2,SP=[],SR=[],SL=[];
    for(var px=ax+1;px<=bx2-1;px+=4.6){SP.push({g:xf(new T.CylinderGeometry(.32,.36,7.5,12),[px,ty+3.75,-4.2])})}
    SR.push({g:xf(new T.BoxGeometry(bx2-ax+3,.6,2.4),[mx,ty+7.7,-4.2])});
    var rf=new T.CylinderGeometry(1,1,bx2-ax+6,24,1,false,Math.PI*.15,Math.PI*.7);rf.rotateZ(Math.PI/2);SR.push({g:xf(rf,[mx,ty+7.3,-4.2],0,[1,1.6,3.2])});
    SR.push({g:xf(new T.BoxGeometry(bx2-ax+4,1.3,.4),[mx,ty+.65,-5.6])});
    [ax+2.5,bx2-2.5].forEach(function(lx){SL.push({g:xf(new T.CylinderGeometry(.18,.24,1.1,8),[lx,ty+.55,-3.2])},{g:xf(new T.BoxGeometry(.7,.55,.7),[lx,ty+1.35,-3.2])},{g:xf(new T.ConeGeometry(.6,.5,4),[lx,ty+1.85,-3.2],[0,Math.PI/4,0])});
      var lg=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffb050,transparent:true,opacity:.75,depthWrite:false,blending:T.AdditiveBlending,fog:false}));lg.scale.set(1.6,1.6,1);lg.position.set(lx,ty+1.35,-2.8);add(lg)});
    add(mesh(mergeG(SP),M(0xc8382a,.55),true,true));add(mesh(mergeG(SR.slice(0,2)),M(0x2a2228,.6),true,false));add(mesh(SR[2].g,M(0xe6dccb,.9),false,true));add(mesh(mergeG(SL),M(0x9a96a0,.9),true,false));
    var sc=document.createElement('canvas');sc.width=sc.height=128;var sx=sc.getContext('2d'),sg=sx.createRadialGradient(64,64,4,64,64,64);sg.addColorStop(0,'rgba(255,255,230,1)');sg.addColorStop(.3,'rgba(255,230,170,.9)');sg.addColorStop(.45,'rgba(255,170,110,.35)');sg.addColorStop(1,'rgba(255,140,90,0)');sx.fillStyle=sg;sx.fillRect(0,0,128,128);
    var st2=new T.CanvasTexture(sc);st2.encoding=T.sRGBEncoding;var sun2=new T.Sprite(new T.SpriteMaterial({map:st2,transparent:true,depthWrite:false,fog:false}));sun2.scale.set(46,46,1);sun2.position.set(mx+6,ty+10,-110);add(sun2);sumFx.sun2=sun2}
  /* (os montinhos de neve soltos na frente saíram: pareciam flutuar; a beirada de neve arredondada faz esse papel) */
}
function sumGroundAt(x){var t=-99;LV.solids.forEach(function(s){if(s[5]==='rock')return;if(x>=s[0]&&x<=s[1]&&s[2]>t)t=s[2]});return t}
function buildFarSummit(th,r){
  /* o sol nascendo atrás dos picos, com raios */
  var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),g=x.createRadialGradient(128,128,10,128,128,128);
  g.addColorStop(0,'rgba(255,255,235,1)');g.addColorStop(.22,'rgba(255,240,200,1)');g.addColorStop(.3,'rgba(255,200,140,.55)');g.addColorStop(1,'rgba(255,150,100,0)');x.fillStyle=g;x.fillRect(0,0,256,256);
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;
  var sun=new T.Sprite(new T.SpriteMaterial({map:t,transparent:true,depthWrite:false,fog:false}));sun.scale.set(70,70,1);sun.position.set(60,4,-280);farG.add(sun);
  var rm=new T.MeshBasicMaterial({map:softSprite(),color:0xffd2a0,transparent:true,opacity:.16,depthWrite:false,fog:false,blending:T.AdditiveBlending,side:T.DoubleSide}),rays=new T.Group();rays.position.set(60,4,-279);
  for(var i=0;i<9;i++){var p=new T.Mesh(new T.PlaneGeometry(14,170),rm);p.position.y=0;p.rotation.z=i/9*Math.PI;p.geometry.translate(0,0,0);rays.add(p)}farG.add(rays);if(sumFx)sumFx.rays=rays;
  /* picos distantes saindo das nuvens: lado do sol rosado e dourado, lado da sombra lilás */
  for(i=0;i<14;i++){var h=40+r()*70,rad=24+r()*30,px=-200+i*36+r()*16,pz=-170-r()*70,cg=new T.ConeGeometry(rad,h,9,4,true),pos=cg.attributes.position,col=[];
    for(var k=0;k<pos.count;k++){var vx=pos.getX(k),vy=pos.getY(k),vz=pos.getZ(k)+(k%3)*0,u=(vy+h/2)/h,side=vx>0?1:0,cc=new T.Color(side?0xc89aa8:0x5a5a8a);
      if(u>.55)cc.lerp(new T.Color(side?0xffe2cc:0xb8b8e0),Math.min(1,(u-.55)/.2));pos.setX(k,vx*(1+.12*Math.sin(k*1.7)));col.push(cc.r,cc.g,cc.b)}
    cg.setAttribute('color',new T.Float32BufferAttribute(col,3));var pk=new T.Mesh(cg,new T.MeshBasicMaterial({vertexColors:true,fog:false}));pk.position.set(px,h/2-22,pz);farG.add(pk)}
  sumFx.dawn=[sun.material,rm];farG.children.forEach(function(o){if(o.material&&o.material.vertexColors){o.material.transparent=true;sumFx.dawn.push(o.material)}});
  buildFarDay(r);
  for(i=0;i<10;i++){var cs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:i%2?0xffd8c8:0xe0c8e8,transparent:true,opacity:.7,depthWrite:false,fog:false}));sumFx.dawn.push(cs.material);var sz=60+r()*60;cs.scale.set(sz,sz*.25,1);cs.position.set(-200+r()*500,10+r()*40,-200);farG.add(cs)}
}
/* ---------- nuvens que somem e pipas gigantes ---------- */
var sumClouds=[],sumKites=[];
function buildSummitMech(){
  sumClouds=[];sumKites=[];var r=rnd(777);
  (LV.clouds||[]).forEach(function(q){var w=q[1]-q[0],cx=(q[0]+q[1])/2,g=new T.Group(),m=M(0xfff2ee,.95,0,{emissive:new T.Color(0xffc49a),emissiveIntensity:.32,transparent:true,opacity:1});
    for(var k=0;k<7;k++){var b=mesh(new T.SphereGeometry(1,12,8),m,false,true);var s2=.55+r()*.45;b.scale.set(s2*1.2,s2*.6,s2);b.position.set(-w/2+.35+k/6*(w-.7),-.3+r()*.15,(r()-.5)*.8);g.add(b)}
    g.position.set(cx,q[2],0);add(g);var so={l:q[0],r:q[1],t:q[2],b:q[2]-.4,oneway:false,flt:true,cloud:true};solids.push(so);sumClouds.push({so:so,g:g,m:m,t:0,gone:0})});
  (LV.kites||[]).forEach(function(k,i){
    var g=new T.Group(),sail=new T.Shape();sail.moveTo(0,1.6);sail.lineTo(1.1,0);sail.lineTo(0,-1.9);sail.lineTo(-1.1,0);sail.lineTo(0,1.6);
    var sm=new T.MeshStandardMaterial({color:i?0x2a6fd0:0xd8382a,roughness:.7,side:T.DoubleSide}),sg=new T.ShapeGeometry(sail);
    var body=new T.Mesh(sg,sm);g.add(body);
    var em=new T.Mesh(new T.CircleGeometry(.5,20),new T.MeshStandardMaterial({color:0xf2c230,roughness:.5,side:T.DoubleSide}));em.position.z=.02;g.add(em);
    var sp=mesh(new T.BoxGeometry(.05,3.5,.05),woodM,false,false);sp.position.y=-.15;g.add(sp);var sp2=mesh(new T.BoxGeometry(2.2,.05,.05),woodM,false,false);g.add(sp2);
    var tails=[];for(var t=0;t<5;t++){var tl=mesh(new T.PlaneGeometry(.35,.22),new T.MeshBasicMaterial({color:t%2?0xf2c230:0xffffff,side:T.DoubleSide}),false,false);g.add(tl);tails.push(tl)}
    add(g);
    /* linha da pipa: 8 pedacinhos que fazem uma curva leve (barriga do fio) */
    var lm=new T.MeshBasicMaterial({color:0xf4efe4}),lg=new T.CylinderGeometry(.018,.018,1,4,1,true),line=[];for(var q=0;q<8;q++){var lsg=new T.Mesh(lg,lm);add(lsg);line.push(lsg)}
    var bar=mesh(new T.CylinderGeometry(.05,.05,1.6,6),woodM,false,false);bar.rotation.z=Math.PI/2;add(bar);
    var rope={rope:true,kite:true,x0:k.x0-.8,x1:k.x0+.8,y:k.y0};ropes.push(rope);
    sumKites.push({K:k,g:g,tails:tails,line:line,bar:bar,rope:rope,st:'wait',t:0,x:k.x0,y:k.y0,wait:0})});
}
function sumMechReset(){
  sumKites.forEach(function(k){k.st='wait';k.t=0;k.x=k.K.x0;k.y=k.K.y0});
  sumClouds.forEach(function(c){c.t=0;c.gone=0;c.so.dead=false;c.g.visible=true;c.g.scale.setScalar(1);c.m.opacity=1});
}
function updSummitMech(dt){
  /* nuvens: com o Kuro em cima por 1 segundo elas tremem e somem; voltam depois */
  sumClouds.forEach(function(c,i){
    if(c.gone>0){c.gone-=dt;var u=clamp(c.gone/2.6,0,1);c.g.scale.setScalar(Math.max(.01,1-u));c.m.opacity=1-u;
      if(c.gone<=0){var inside=P.x>c.so.l-.3&&P.x<c.so.r+.3&&P.y<c.so.t+.2&&P.y+P.h>c.so.b;if(inside)c.gone=.3;else{c.so.dead=false;c.t=0;c.g.scale.setScalar(1);c.m.opacity=1}}
      return}
    var on=P.onPlat===c.so&&P.grounded;c.t=on?c.t+dt:Math.max(0,c.t-dt*.5);
    var wob=c.t>.45?Math.sin(tm*40)*.08*(c.t-.45)*2:0;c.g.position.x=(c.so.l+c.so.r)/2+wob;c.g.position.y=c.so.t+Math.sin(tm*1.6+i)*.04;
    if(c.t>=1.0){c.so.dead=true;c.gone=2.6;c.m.opacity=.4;emit(dustPool,(c.so.l+c.so.r)/2,c.so.t-.2,10,2.6,.6,.7,1.3,-.2);try{noise(.4,.04,1200,'bandpass')}catch(e){}if(P.onPlat===c.so){P.grounded=false;P.onPlat=null}}
  });
  /* pipas: esperam na beira da ilha; com o Kuro pendurado voam até a próxima e voltam sozinhas */
  sumKites.forEach(function(k){var K=k.K,hold=P.climb===k.rope,px=k.x,py=k.y;
    if(k.st==='wait'){k.x=K.x0;k.y=K.y0+Math.sin(tm*2.1)*.12;if(hold){k.st='fly';k.t=0;try{swoosh()}catch(e){}if(!sumFx.kTold){sumFx.kTold=true;toast('Segure firme! A pipa leva o Kuro até a próxima ilha. Baixo ou pular para soltar')}}}
    else if(k.st==='fly'){var D=Math.hypot(K.x1-K.x0,K.y1-K.y0),dur=D/5.2;k.t+=dt/dur;var u=Math.min(1,k.t),e=u*u*(3-2*u);
      k.x=K.x0+(K.x1-K.x0)*e;k.y=K.y0+(K.y1-K.y0)*e+Math.sin(u*Math.PI)*2.2+Math.sin(tm*3)*.15*Math.sin(u*Math.PI)+sumU.wind.value*.25*Math.sin(u*Math.PI);
      if(u>=1){k.st='arrive';k.wait=0}if(!hold&&u<1&&u>.05){k.st='back';k.t=1-u}}
    else if(k.st==='arrive'){k.x=K.x1;k.y=K.y1+Math.sin(tm*2.1)*.12;if(!hold){k.wait+=dt;if(k.wait>1.6){k.st='back';k.t=0}}}
    else if(k.st==='back'){var D2=Math.hypot(K.x1-K.x0,K.y1-K.y0);k.t+=dt/(D2/7);var u2=Math.min(1,k.t),e2=u2*u2*(3-2*u2);k.x=K.x1+(K.x0-K.x1)*e2;k.y=K.y1+(K.y0-K.y1)*e2+Math.sin(u2*Math.PI)*2.5;if(u2>=1)k.st='wait';
      if(hold){k.st='fly';k.t=1-u2}}
    var dx=k.x-px;if(hold&&k.st!=='wait'){P.x+=dx;P.face=dx>=0?1:P.face}
    k.rope.x0=k.x-.8;k.rope.x1=k.x+.8;k.rope.y=k.y;
    /* desenho: pipa lá no alto, linha até a barra */
    var kx=k.x+.6+Math.sin(tm*1.3)*.25,ky=k.y+3.7+Math.sin(tm*1.9)*.2;k.g.position.set(kx,ky,-.4);k.g.rotation.z=-.25+Math.sin(tm*1.7)*.08-sumU.wind.value*.15;
    /* rabiola sai da ponta de baixo e voa para o lado do vento, longe da linha */
    k.tails.forEach(function(tl,j){tl.position.set(.12+.42*j+Math.sin(tm*5+j)*.06*j,-2.05-j*.3,0);tl.rotation.z=Math.sin(tm*6+j)*.5});
    /* a linha sai do centro da barra e amarra no meio da pipa (ponto do cabresto, girando junto) */
    var rz=k.g.rotation.z,ay=-.35,tx=kx-Math.sin(rz)*ay,ty=ky+Math.cos(rz)*ay;
    k.bar.position.set(k.x,k.y,0);var bx=k.x,by=k.y+.03,sag=.22+.1*Math.sin(tm*1.4),N=k.line.length,ppx=bx,ppy=by;
    for(var q=1;q<=N;q++){var f=q/N,cx=bx+(tx-bx)*f+sag*Math.sin(f*Math.PI)*.6,cy=by+(ty-by)*f-sag*Math.sin(f*Math.PI),sgm=k.line[q-1],dxs=cx-ppx,dys=cy-ppy;
      sgm.position.set((cx+ppx)/2,(cy+ppy)/2,-.38*(q-.5)/N);sgm.scale.y=Math.hypot(dxs,dys)+.01;sgm.rotation.z=-Math.atan2(dxs,dys);ppx=cx;ppy=cy}
  });
}
/* inimigos da montanha */
function makeGoat(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var fur=M(0xeeeae2,.95),sh=M(0xc8c0b4,.9),face=M(0x3a3430,.7),horn=M(0x6a5848,.5),eyeM=new T.MeshStandardMaterial({color:0x201000,emissive:0xffa030,emissiveIntensity:1.4}),legM=M(0x5a5048,.8);
  var body=mesh(new T.SphereGeometry(.5,18,12),fur);body.scale.set(.66,.62,1.25);body.position.set(0,.66,0);inner.add(body);
  var shag=mesh(new T.SphereGeometry(.5,14,8),sh);shag.scale.set(.7,.4,1.15);shag.position.set(0,.5,0);inner.add(shag);
  var head=mesh(new T.SphereGeometry(.24,16,12),fur);head.scale.set(.9,1,1.15);head.position.set(0,.95,.66);inner.add(head);
  var muz=mesh(new T.SphereGeometry(.15,12,8),face);muz.scale.set(.8,.8,1.2);muz.position.set(0,.86,.86);inner.add(muz);
  var beard=mesh(new T.ConeGeometry(.08,.26,6),sh);beard.rotation.x=Math.PI;beard.position.set(0,.66,.84);inner.add(beard);
  [-1,1].forEach(function(sd){
    var e=mesh(new T.SphereGeometry(.045,8,6),eyeM,false,false);e.position.set(sd*.12,1.0,.84);inner.add(e);
    var hg=new T.TorusGeometry(.16,.045,6,12,Math.PI*1.2);var hn=mesh(hg,horn);hn.position.set(sd*.1,1.12,.56);hn.rotation.set(0,Math.PI/2,-.4);inner.add(hn);
    var ear=mesh(new T.SphereGeometry(.07,8,6),fur);ear.scale.set(1.6,.5,.8);ear.position.set(sd*.24,1.0,.58);inner.add(ear);
  });
  var tail=mesh(new T.SphereGeometry(.09,8,6),fur);tail.position.set(0,.9,-.66);inner.add(tail);
  var legs=[],legG=new T.CylinderGeometry(.065,.05,.5,6);legG.translate(0,-.25,0);
  [.42,-.4].forEach(function(z0){[-1,1].forEach(function(sd){var q=new T.Group();q.position.set(sd*.18,.48,z0);q.add(mesh(legG,legM));inner.add(q);legs.push({p:q,sd:sd,z:z0,base:0})})});
  add(g);return {g:g,inner:inner,legs:legs,shellM:fur,legM:legM};
}
function makeSnowCrow(){
  var v=makeCrow();v.g.traverse(function(o){var m=o.material;if(!m||!m.color||(m.emissive&&m.emissiveIntensity>1))return;var c=m.color;if(c.r+c.g+c.b<.5){o.material=m.clone();o.material.color.setHex(c.r+c.g+c.b<.2?0xdfe6ee:0xc6d2de)}});
  return v;
}
/* abrigo do vento: uma pedra ou parede mais alta que o Kuro, do lado de onde o vento vem */
function windSheltered(dir){
  for(var i=0;i<solids.length;i++){var q=solids[i];if(q.dead||q.hid||q.flt)continue;
    if(q.t<P.y+1.0||q.b>P.y+.3)continue;
    if(dir<0&&q.l>=P.x-.1&&q.l-P.x<2.6)return true;
    if(dir>0&&q.r<=P.x+.1&&P.x-q.r<2.6)return true}
  return false;
}
function updSummit(dt){
  sumU.time.value=tm;if(!sumFx)return;updSummitMech(dt);sumDay(dt);sumDrift(dt);
  /* bandeirinhas: calmas, esticando no aviso, fortes na rajada */
  var tw=Math.sin(tm*.7)*.12,ta=.25,warnNow=0,actNow=0;
  for(var i=0;i<windZones.length;i++){var w=windZones[i];if(P.x>w.x0-12&&P.x<w.x1+12){if(w.act){tw=w.dir;ta=1;actNow=w.dir}else if(w.wn){tw=w.dir*.65;ta=.75;warnNow=w.dir}}}
  sumU.wind.value+=(tw-sumU.wind.value)*(1-Math.exp(-dt*4));sumU.agit.value+=(ta-sumU.agit.value)*(1-Math.exp(-dt*5));
  if(warnNow&&!sumFx.windWas){try{noise(1.6,.05,380,'lowpass');noise(1.2,.025,900,'bandpass',.3)}catch(e){}
    if(!sumFx.told){sumFx.told=true;toast(warnNow<0?'As bandeirinhas avisam: vem rajada! Esconda-se atrás de uma pedra':'Vento a favor chegando: pule junto com a rajada para ir mais longe!')}}
  if(actNow&&sumFx.windWas!==2){try{noise(2.4,.09,520,'lowpass');noise(2,.04,1400,'bandpass',.1)}catch(e){}}
  sumFx.windWas=actNow?2:(warnNow?1:0);
  if(actNow&&state==='play'&&LV.windShelter&&windSheltered(actNow)&&Math.random()<dt*20)emit(dustPool,P.x+actNow*.3,P.y+.9+Math.random()*.6,1,1.2,.4,.4,1.2,0);/* a neve bate na pedra: o Kuro está protegido */
  if(sumFx.rays)sumFx.rays.rotation.z=tm*.01;
  sumFx.sparks.forEach(function(c){c.s.position.x=c.x0+Math.sin(tm*.05*c.sp)*6+tm*c.sp*.3%40})
}
/* ---------- revanche do Rei Besouro: maior, de armadura nova; 3 fases (investidas, ondas de choque, voo e mergulho com o santuário desmoronando) ---------- */
function bossV2Build(b){
  b.v2=true;b.w=2.2;b.h=2.1;var v=b.vis;v.g.scale.set(2.6,2.6,2.6);
  var steel=M(0x4a5468,.35,.8),trim=M(0xffc43a,.3,.9,{emissive:new T.Color(0x6a4300),emissiveIntensity:.5});b.steelM=steel;
  var arm=new T.Group();v.inner.add(arm);b.armor=[];
  for(var k=0;k<6;k++){var sg=new T.SphereGeometry(.5,10,8,k*Math.PI/3+.03,Math.PI/3-.06,0,Math.PI*.46),pl=mesh(sg,steel);pl.scale.set(.95,.78,1.32);pl.position.y=.43;arm.add(pl);b.armor.push(pl)}
  var rim=mesh(new T.TorusGeometry(.47,.025,6,32),trim);rim.rotation.x=Math.PI/2;rim.scale.set(1,1.38,1);rim.position.y=.5;arm.add(rim);b.armor.push(rim);
  var horn=new T.Group();horn.position.set(0,.5,.78);v.inner.add(horn);
  var h1=mesh(new T.ConeGeometry(.09,.55,8),steel);h1.position.set(0,.22,.08);h1.rotation.x=.55;horn.add(h1);
  var h2=mesh(new T.ConeGeometry(.05,.16,6),trim);h2.position.set(0,.47,.22);h2.rotation.x=.55;horn.add(h2);b.horn=horn;
  [-1,1].forEach(function(sd){var sp=mesh(new T.ConeGeometry(.06,.22,6),steel);sp.position.set(sd*.42,.62,.2);sp.rotation.z=-sd*.9;arm.add(sp);b.armor.push(sp)});
  var wm=new T.MeshStandardMaterial({color:0xffd8a0,roughness:.3,transparent:true,opacity:.55,side:T.DoubleSide,emissive:0xff8a30,emissiveIntensity:.5,depthWrite:false});
  b.wings=[];[-1,1].forEach(function(sd){var p=new T.Group();p.position.set(sd*.2,.82,-.05);v.inner.add(p);var w=mesh(new T.SphereGeometry(.5,14,8),wm,false,false);w.scale.set(.9,.06,1.4);w.position.set(sd*.42,0,-.25);p.add(w);p.visible=false;b.wings.push({p:p,sd:sd})});
  b.waves=[];b.rocks=[];b.rockT=2;
}
function bossV2Reset(b){
  b.vis.g.scale.set(2.6,2.6,2.6);b.armor.forEach(function(m){m.visible=true});b.wings.forEach(function(w){w.p.visible=false});b.horn.visible=true;
  b.waves.forEach(function(w){w.g.visible=false});b.waves.length=0;b.rocks.forEach(function(r){r.m.visible=false;r.sh.visible=false});b.rocks.length=0;b.rockT=2;b.quake=false;
}
function bossV2Phase(b){return b.hp>4?1:(b.hp>2?2:3)}
function bossV2Seq(b){var ph=bossV2Phase(b);return ph===1?['charge','spit','charge','jump']:(ph===2?['quake','charge','spit','quake','charge']:['dive','charge','quake','dive','spit'])}
function bossV2Hurt(b){/* cada golpe arranca pedaços da armadura */
  var lost=b.max-b.hp,n=b.armor.length,show=Math.max(0,Math.round(n*(1-lost/4)));
  b.armor.forEach(function(m,i){if(i>=show&&m.visible){m.visible=false;spawnPieces(b.x+(Math.random()-.5)*2,b.top+b.h*.9,3,b.steelM,1.8)}});
  if(lost>=4&&b.horn.visible){b.horn.visible=false;spawnPieces(b.x+b.dir*1.6,b.top+b.h,4,b.steelM,1.5)}
  if(b.hp<=2)b.wings.forEach(function(w){w.p.visible=b.hp>0});
}
/* mergulho: sobe, segue o Kuro pela sombra e despenca */
function bossDive(b,dt){
  b.dt+=dt;var lo=b.aL+b.w+.3,hi=b.aR-b.w-.3;
  if(b.dt<.7){b.yy=5.6*Math.sin(b.dt/.7*Math.PI/2)}
  else if(b.dt<1.45){b.yy=5.6+Math.sin(tm*6)*.3;var tx=clamp(P.x,lo,hi);b.x+=clamp(tx-b.x,-7*dt,7*dt);b.dir=P.x>b.x?1:-1}
  else if(b.dt<1.9){b.yy=5.6+Math.sin(tm*40)*.12}/* parou em cima: tremendo, vai cair — hora de correr */
  else{var u=Math.min(1,(b.dt-1.9)/.28);b.yy=5.6*(1-u*u);
    if(u>=1){b.yy=0;b.state='stun';b.t=2.6;shake=.9;try{sfx.boom()}catch(e){}emit(dustPool,b.x,b.top+.4,18,4.5,.8,.9,1.3,-.2);bossWaves(b,7);
      if(state==='play'&&Math.abs(P.x-b.x)<b.w+.3&&P.y<b.top+1)hurt(b.x)}}
}
function bossWaves(b,sp){
  if(!sumFx)sumFx={};if(!sumFx.waveM)sumFx.waveM=new T.MeshBasicMaterial({color:0xffa040,transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide});
  [-1,1].forEach(function(d){var g=new T.Mesh(new T.RingGeometry(.35,.75,20,1,0,Math.PI),sumFx.waveM);g.scale.set(1,1.4,1);add(g);b.waves.push({g:g,x:b.x+d*(b.w*.8),dir:d,sp:sp,t:0})});
}
function bossV2Upd(b,dt){
  /* ondas de choque: pule por cima */
  for(var i=b.waves.length-1;i>=0;i--){var w=b.waves[i];w.t+=dt;w.x+=w.dir*w.sp*dt;w.g.position.set(w.x,b.top,.3);var s=1+Math.sin(w.t*20)*.08;w.g.scale.set(s,1.4*s,1);
    if(Math.random()<dt*40)emit(dustPool,w.x,b.top+.15,1,1.6,.4,.5,1.2,-.3);
    if(state==='play'&&Math.abs(P.x-w.x)<.55&&P.y<b.top+.85)hurt(w.x);
    if(w.x<b.aL+.3||w.x>b.aR-.3||w.t>4){w.g.visible=false;if(w.g.parent)w.g.parent.remove(w.g);b.waves.splice(i,1)}}
  /* asas batendo na fase 3 */
  b.wings.forEach(function(w){if(w.p.visible)w.p.rotation.z=w.sd*(.3+Math.sin(tm*(b.state==='dive'?30:8))*.4)});
  /* fase 3: o teto do santuário desmorona (pedras com sombra de aviso) */
  var flying=b.state==='dive'&&b.dt<1.9;if((bossV2Phase(b)===3||flying)&&b.state!=='dead'&&b.state!=='wait'&&state==='play'){b.rockT-=dt*(flying?3.2:1);if(b.rockT<=0){b.rockT=1.4+Math.random()*.6;/* voando: o santuário treme e chovem pedras */
    var rx=Math.random()<.6?clamp(P.x+(Math.random()-.5)*3,b.aL+1,b.aR-1):b.aL+1+Math.random()*(b.aR-b.aL-2);
    if(!sumFx.rockG){sumFx.rockG=new T.DodecahedronGeometry(.55,0);sumFx.rockM=M(0x8a8494,.85,0,{flatShading:true})}
    var m=mesh(sumFx.rockG,sumFx.rockM,true,false);m.position.set(rx,b.top+13,0);add(m);var sh=new T.Mesh(new T.RingGeometry(.4,.75,20),new T.MeshBasicMaterial({color:0xff3a20,transparent:true,opacity:.6,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.set(rx,b.top+.05,0);add(sh);
    b.rocks.push({m:m,sh:sh,x:rx,y:b.top+13,vy:0,t:0})}}
  for(i=b.rocks.length-1;i>=0;i--){var r=b.rocks[i];r.t+=dt;if(r.t<.9){r.sh.material.opacity=.3+.4*Math.sin(r.t*20)*.5+.2;continue}
    r.vy-=30*dt;r.y+=r.vy*dt;r.m.position.y=r.y;r.m.rotation.x+=dt*5;
    if(state==='play'&&Math.abs(P.x-r.x)<.8&&r.y<P.y+P.h&&r.y>P.y-.3)hurt(r.x);
    if(r.y<=b.top+.4){emit(dustPool,r.x,b.top+.3,8,2.6,.5,.6,1.2,-.3);spawnPieces(r.x,b.top+.5,3,sumFx.rockM,1.2);r.m.visible=false;r.sh.visible=false;if(r.m.parent)r.m.parent.remove(r.m);if(r.sh.parent)r.sh.parent.remove(r.sh);b.rocks.splice(i,1)}}
}
function bossV2Open(b){/* o Rei caiu: a parede da direita desmorona e abre o caminho até o pico */
  var w=null;for(var i=0;i<solids.length;i++){var q=solids[i];if(q.wall&&Math.abs(q.l-b.aR)<.01){w=q;break}}
  if(w){w.dead=true;if(w.mesh){spawnPieces((w.l+w.r)/2,b.top+2,10,w.mesh.material,2.4);w.mesh.visible=false}b.wallR=w}
  shake=.6;try{sfx.boom();sfx.flower()}catch(e){}toast('O caminho para o topo está aberto! Finque a bandeira no pico');
}
var _bv2r=bossV2Reset;bossV2Reset=function(b){_bv2r(b);if(b.wallR){b.wallR.dead=false;if(b.wallR.mesh)b.wallR.mesh.visible=true;b.wallR=null}};
/* ---------- final da primeira ilha: bandeira do Kuro, nascer do sol, a raposinha e a terra nova no horizonte ---------- */
var sumEnd=null;
function kuroFlagTex(){var c=document.createElement('canvas');c.width=256;c.height=160;var x=c.getContext('2d');
  x.fillStyle='#1d2238';x.fillRect(0,0,256,160);x.strokeStyle='#f2c230';x.lineWidth=10;x.strokeRect(5,5,246,150);
  x.save();x.translate(128,80);x.fillStyle='#f4f6fb';for(var i=0;i<4;i++){x.rotate(Math.PI/2);x.beginPath();x.moveTo(0,-56);x.lineTo(13,-13);x.lineTo(-13,-13);x.closePath();x.fill()}
  x.beginPath();x.arc(0,0,14,0,6.283);x.fillStyle='#1d2238';x.fill();x.beginPath();x.arc(0,0,7,0,6.283);x.fillStyle='#f2c230';x.fill();x.restore();
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t}
function cumeEnding(){
  state='win';sfx.win();P.cheer=0;P.vx=0;P.vy=0;recordLevel();
  (flag.parts||[]).forEach(function(o){o.visible=false});/* a bandeira vermelha da chegada sai: fica só a do Kuro */
  var fy=floorBelow(P.x,P.y+.5);if(fy>-50&&P.y>fy){P.y=fy;P.grounded=true}/* pegou a bandeira pulando: o Kuro desce até o chão do pico */
  var e=sumEnd={t:0,zoom:1,cx:cam.x,cy:cam.y,x0:P.x,y0:P.y,card:false};
  /* mastro que sobe do chão com a bandeira do Kuro */
  var g=new T.Group(),gx2=P.x+1.1;g.position.set(gx2,Math.max(-50,floorBelow(gx2,P.y+.5)),0);add(g);var pole=mesh(new T.CylinderGeometry(.06,.08,4.4,8),M(0xd8d8e0,.3,.8));pole.geometry.translate(0,2.2,0);g.add(pole);
  var top=mesh(new T.SphereGeometry(.13,10,8),M(0xf2c230,.3,.9));top.position.y=4.45;g.add(top);
  var fg=new T.PlaneGeometry(2.2,1.4,14,1);fg.translate(1.1,0,0);var cloth=new T.Mesh(fg,new T.MeshStandardMaterial({map:kuroFlagTex(),side:T.DoubleSide,roughness:.8}));cloth.position.y=.8;g.add(cloth);
  g.scale.set(1,.01,1);e.flag={g:g,cloth:cloth,base:fg.attributes.position.array.slice(0)};
  /* a terra nova lá longe: ilha verde com montanhas, uma árvore gigante e um feixe de luz (surge devagar) */
  var land=new T.Group(),lm=[];function bm(c){var m=new T.MeshBasicMaterial({color:c,fog:false,transparent:true,opacity:0});lm.push(m);return m}
  var base=new T.Mesh(new T.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2),bm(0x4a8a78));base.scale.set(70,7,22);land.add(base);
  [[-38,22,18],[-12,34,22],[14,26,16],[40,18,14]].forEach(function(h){var m=new T.Mesh(new T.ConeGeometry(h[2],h[1],8),bm(0x4a8a78));m.position.set(h[0],h[1]/2+4,0);land.add(m);var s=new T.Mesh(new T.ConeGeometry(h[2]*.35,h[1]*.3,8),bm(0xf4f2f0));s.position.set(h[0],h[1]+4-h[1]*.15,1);land.add(s)});
  var tr=new T.Mesh(new T.CylinderGeometry(2,3.5,30,8),bm(0x5a4a3a));tr.position.set(26,19,6);land.add(tr);var cr=new T.Mesh(new T.SphereGeometry(13,14,10),bm(0x6ab86a));cr.scale.set(1.3,.8,1);cr.position.set(26,36,6);land.add(cr);
  var beam=new T.Mesh(new T.CylinderGeometry(1.4,4,120,12,1,true),new T.MeshBasicMaterial({color:0xfff0b0,transparent:true,opacity:0,fog:false,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));beam.position.set(-12,80,0);land.add(beam);
  var mist=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffe8f0,transparent:true,opacity:0,fog:false,depthWrite:false}));mist.scale.set(190,26,1);mist.position.set(0,2,20);land.add(mist);
  land.position.set(P.x+70,P.y-6,-200);add(land);e.land={g:land,mats:lm,beam:beam,mist:mist};
  /* a raposinha vem correndo comemorar */
  if(fox&&fox.vis){fox.state='roam';fox.t=1;fox.x=P.x-14;fox.y=floorBelow(P.x-2,P.y+1)}else{var v=makeFoxVis();add(v.g);fox={vis:v,state:'roam',x:P.x-14,y:P.y,vx:0,vy:0,face:1,t:1,cd:99,ph:0,yaw:-.35}}
  fox.face=1;fox.cd=99;fox.state='end';fox.endSp=7;fox.z=0;fox.sit=0;e.foxSt='run';e.foxT=0;
  hemi.userData.i0=hemi.intensity;e.fog0=scene.fog.color.clone();
}
function updEnding(dt){
  var e=sumEnd;e.t+=dt;var t=e.t;
  /* mastro sobe, bandeira tremula */
  var fu=clamp((t-.44)/.35,0,1);
  if(t>.44&&!e.slam){e.slam=1;shake=Math.max(shake,.35);emit(dustPool,P.x+1.1,P.y+.1,14,3,.6,.7,1.3,-.3);emit(sparkPool,P.x+1.1,P.y+.3,8,3,.5,.35,.2,2);try{sfx.stomp()}catch(er){}}
  e.kat=t>1&&t<3.9;if(katana)katana.visible=e.kat;if(t>1.25&&!e.glint){e.glint=1;try{beep(1760,.25,'sine',.05,0,0);beep(2350,.3,'sine',.04,0,.06)}catch(er){}}
  if(e.kat&&t>1.2&&Math.random()<dt*14&&katana){var kp=new T.Vector3();katana.getWorldPosition(kp);emit(sparkPool,kp.x+(Math.random()-.5)*.3,kp.y+.6+Math.random()*.6,1,1,.5,.3,.15,-1)}e.flag.g.scale.y=Math.max(.01,fu*fu*(3-2*fu));var cy=.8+clamp((t-.9)/1.4,0,1)*2.95;e.flag.cloth.position.y=cy;
  var pa=e.flag.cloth.geometry.attributes.position,b=e.flag.base;for(var i=0;i<pa.count;i++){var x=b[i*3];pa.setZ(i,Math.sin(tm*7-x*2.4)*.16*(x/2.2));pa.setY(i,b[i*3+1]+Math.sin(tm*5-x*2)*.04*(x/2.2))}pa.needsUpdate=true;
  /* a roupa nova: com a katana erguida, uma luz desce no Kuro e ele ganha a roupa da Terra Nova (pedido do dono) */
  if(t>1.9&&!e.ofit){e.ofit={t:0};var bm=new T.Mesh(new T.CylinderGeometry(.9,1.4,16,16,1,true),new T.MeshBasicMaterial({color:0xfff2c0,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false}));bm.position.set(P.x,P.y+8,0);add(bm);e.ofit.m=bm;try{[784,988,1175,1568].forEach(function(f,k){beep(f,.35,'sine',.05,0,k*.07)})}catch(er){}}
  if(e.ofit){e.ofit.t+=dt;var ot=e.ofit.t;e.ofit.m.material.opacity=ot<.35?ot/.35*.85:Math.max(0,.85-(ot-.35)*.9);e.ofit.m.scale.x=e.ofit.m.scale.z=1+Math.sin(ot*6)*.06;
    if(ot>.35&&!e.ofit.sw){e.ofit.sw=1;if(rig.setOutfit)rig.setOutfit(1);if(fox&&fox.vis){var ov=fox.vis,nv=makeFoxVis(1);nv.g.position.copy(ov.g.position);nv.g.rotation.copy(ov.g.rotation);nv.g.scale.copy(ov.g.scale);if(ov.g.parent)ov.g.parent.remove(ov.g);add(nv.g);fox.vis=nv;emit(sparkPool,fox.x,fox.y+.6,16,3,.7,.35,.3,1)}/* a raposinha ganha o visual novo junto */shake=Math.max(shake,.25);emit(sparkPool,P.x,P.y+1,30,4.5,.9,.4,.3,1);emit(sparkPool,P.x,P.y+2,14,2.5,1.2,.3,.2,-1)}}
  if(t>.9&&t<1&&!e.snd){e.snd=1;try{[523,659,784,1047,1319].forEach(function(f,k){beep(f,.22,'triangle',.06,0,k*.11)})}catch(er){}}
  if(Math.random()<dt*12)emit(sparkPool,P.x+(Math.random()-.5)*6,P.y+Math.random()*4,1,1.2,.9,.3,.2,-1.5);
  /* nascer do sol: tudo vai clareando e esquentando */
  var su=clamp((t-1)/4,0,1);hemi.intensity=hemi.userData.i0*(1+.5*su);scene.fog.color.copy(e.fog0).lerp(new T.Color(0xffe6c8),su*.7);
  if(sumFx&&sumFx.sun2){sumFx.sun2.position.y+=dt*1.6*(su<1?1:0);var ss=46+su*24;sumFx.sun2.scale.set(ss,ss,1)}
  /* raposinha corre até o Kuro e pula de alegria */
  /* raposinha: chega correndo, dá uma volta em torno do Kuro e senta do lado dele olhando o horizonte */
  if(fox&&fox.vis){fox.state='end';e.foxT+=dt;var R=1.5,fy=floorBelow(P.x,P.y+1);
    if(e.foxSt==='run'){fox.endSp=7;fox.x=Math.min(P.x-R,fox.x+dt*7);fox.z=0;fox.endYaw=0;if(fox.x>=P.x-R-.01){e.foxSt='circle';e.foxT=0}}
    else if(e.foxSt==='circle'){var a=Math.min(1,e.foxT/1.7)*Math.PI*2;fox.x=P.x-R*Math.cos(a);fox.z=-R*.85*Math.sin(a);fox.y=fy;
      var dxv=Math.sin(a),dzv=-.85*Math.cos(a);fox.endYaw=Math.atan2(-dzv,dxv);fox.endSp=6;if(e.foxT>=1.7){e.foxSt='sit';e.foxT=0;try{beep(880,.12,'triangle',.05,0,0);beep(1175,.14,'triangle',.05,0,.1)}catch(er){}}}
    else{fox.endSp=0;fox.x+=(P.x-1.25-fox.x)*Math.min(1,dt*4);fox.z+=(-.35-fox.z)*Math.min(1,dt*4);fox.y=fy;var sy2=1.05;fox.endYaw+=(sy2-fox.endYaw)*Math.min(1,dt*3);fox.sit=Math.min(1,fox.sit+dt*2.5)}}
  /* câmera: abre devagar e mostra a terra nova no horizonte */
  var cu=clamp((t-3)/4,0,1),ce=cu*cu*(3-2*cu);e.cx=e.x0+ce*5;e.cy=e.y0+2+ce*2.5;e.zoom=1+ce*.75;
  var lu=clamp((t-3.5)/3,0,1);e.land.mats.forEach(function(m){m.opacity=lu});e.land.mist.material.opacity=lu*.7;e.land.beam.material.opacity=lu*(.25+.1*Math.sin(tm*3));
  if(t>8.8&&!e.card){e.card=true;
    showCard({kicker:'Fim da primeira ilha',title:'Kuro chegou ao Cume!',text:STORY.worlds[levelIdx].end,stats:stats(scoreLis()),
      primary:{label:LEVELS.length>levelIdx+1?'Ir para a Terra Nova':'Ver o mapa',fn:function(){sumEnd=null;openMap(LEVELS.length>levelIdx+1?{from:levelIdx,walkTo:levelIdx+1}:{from:levelIdx})}},secondary:{label:'Jogar de novo',fn:function(){sumEnd=null;startLevel(0)}}})}
}
/* ---------- pedras do Cume: granito com veios e líquen, musgo nos vãos, plantinhas e neve por cima (inspiradas na referência, do nosso jeito) ---------- */
var sumStoneQ=null;
function graniteTex(){
  if(sumFx&&sumFx.granT)return sumFx.granT;
  var S=256,c=document.createElement('canvas');c.width=c.height=S;var x=c.getContext('2d'),sd=913;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  x.fillStyle='#7c8482';x.fillRect(0,0,S,S);
  for(var i=0;i<2600;i++){var v=Math.round(90+r()*80),px=r()*S,py=r()*S,sz=.6+r()*2.2;x.fillStyle='rgba('+v+','+(v+4)+','+(v+2)+','+(.25+r()*.5)+')';x.fillRect(px,py,sz,sz)}
  for(i=0;i<500;i++){x.fillStyle='rgba(30,34,34,'+(.2+r()*.4)+')';x.fillRect(r()*S,r()*S,1+r()*2,1+r()*2)}
  for(i=0;i<7;i++){var a=r()*6.283,qx=r()*S,qy=r()*S;x.strokeStyle='rgba(235,238,236,'+(.25+r()*.3)+')';x.lineWidth=.8+r()*1.4;x.beginPath();x.moveTo(qx,qy);for(var k=0;k<8;k++){a+=(r()-.5)*.8;qx+=Math.cos(a)*14;qy+=Math.sin(a)*14;x.lineTo(qx,qy)}x.stroke()}
  for(i=0;i<34;i++){var lx=r()*S,ly=r()*S,lr=3+r()*9,cl=r()<.6?'rgba(186,196,140,':'rgba(220,226,210,';x.fillStyle=cl+(.35+r()*.35)+')';x.beginPath();for(k=0;k<9;k++){var aa=k/9*6.283,rr=lr*(.6+r()*.6);x.lineTo(lx+Math.cos(aa)*rr,ly+Math.sin(aa)*rr)}x.closePath();x.fill()}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;t.anisotropy=4;if(!sumFx)sumFx={};sumFx.granT=t;return t;
}
/* rocha lascada: icosaedro com ruído e alguns cortes planos (faces de pedra quebrada) */
function chipRock(rr,det){
  var g=new T.IcosahedronGeometry(1,det===undefined?2:det),v=new T.Vector3(),cuts=[];g=T.BufferGeometryUtils?g:g;
  var o1=rr()*9,o2=rr()*9;for(var c=0;c<5;c++){var n=new T.Vector3(rr()-.5,rr()*.9-.25,rr()-.5).normalize();cuts.push({n:n,d:.5+rr()*.32})}
  var p=g.attributes.position;
  for(var i=0;i<p.count;i++){v.fromBufferAttribute(p,i);
    var s=1+.13*Math.sin(v.x*3.7+v.y*2.1+o1)+.09*Math.sin(v.z*5.1-v.x*2.9+o2)+.045*Math.sin(v.x*11.3+v.z*9.1)+.03*Math.sin(v.y*17+v.z*13);v.multiplyScalar(s);
    cuts.forEach(function(q){var d=v.dot(q.n);if(d>q.d)v.addScaledVector(q.n,(q.d-d)*.92)});p.setXYZ(i,v.x,v.y,v.z)}
  g=g.toNonIndexed();g.computeVertexNormals();
  /* sombra de contato na base e nas reentrâncias */
  var pp=g.attributes.position,col=new Float32Array(pp.count*3);for(i=0;i<pp.count;i++){var yy=pp.getY(i),k=clamp(.55+yy*.5,.45,1)*(.92+.1*Math.sin(pp.getX(i)*7+pp.getZ(i)*5));col[i*3]=k;col[i*3+1]=k;col[i*3+2]=k*1.02}
  g.setAttribute('color',new T.BufferAttribute(col,3));return g;
}
/* UV por projeção de caixa (a textura não estica nas faces) */
function boxUV(g,sc){var p=g.attributes.position,n=g.attributes.normal,uv=new Float32Array(p.count*2);
  for(var i=0;i<p.count;i++){var ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i)),u,w;
    if(ax>=ay&&ax>=az){u=p.getZ(i);w=p.getY(i)}else if(ay>=az){u=p.getX(i);w=p.getZ(i)}else{u=p.getX(i);w=p.getY(i)}uv[i*2]=u*sc;uv[i*2+1]=w*sc}
  g.setAttribute('uv',new T.BufferAttribute(uv,2));return g}
function mossRock(x,y,z,w,h,rr,o){
  o=o||{};var Q=sumStoneQ;if(!Q)return;
  function stone(px,py,pz,sx,sy,sz,rz){var g=chipRock(rr);xf(g,[px,py,pz],[rr()*.5,rr()*6.283,rz||0],[sx,sy,sz]);g.computeVertexNormals();Q.gr.push({g:g});return {x:px,y:py,top:py+sy*.9,sx:sx}}
  var main=stone(x+w*.08,y+h*.46,z,w*.42,h*.55,.9+rr()*.3,(rr()-.5)*.25);
  var side=stone(x-w*.28,y+h*.28,z+.25,w*.3,h*.34,.75,.35+rr()*.2);
  if(w>1.6||o.big)stone(x+w*.42,y+h*.2,z+.35,w*.2,h*.24,.6,-.3);
  /* musgo: almofadas verdes na base e entre as pedras */
  var cols=[0x5a8a2a,0x6e9a32,0x4a7424,0x82aa3e],nm=o.lite?5:10;
  for(var k=0;k<nm;k++){var mx=x-w*.48+rr()*w*.96,mr=.16+rr()*.26*Math.min(1.6,w/1.4),up=k%3===0?rr()*h*.35:0;Q.ms.push({g:xf(new T.IcosahedronGeometry(1,2),[mx,y+mr*.3+up,z+.15+rr()*.5],[rr(),rr()*6,rr()*.3],[mr*1.25,mr*.62,mr*1.05]),c:cols[k%4]})}
  Q.ms.push({g:xf(new T.IcosahedronGeometry(1,1),[side.x+.05,side.top-.05,z+.3],[0,0,0],[side.sx*.7,.12,.4]),c:cols[1]});
  /* neve por cima da pedra maior */
  /* plantinhas: raminhos com folhas pequenas saindo do musgo */
  if(!o.noPlant)for(var pk=0;pk<(o.lite?1:2);pk++){var bx=side.x+(rr()-.5)*.5,by=side.top-.05,bz=z+.35+rr()*.2;
    for(var st=0;st<5;st++){var a=(rr()-.5)*1.1,len=.35+rr()*.35,ex=bx+Math.sin(a)*len,ey=by+Math.cos(a)*len;Q.pl.push({x0:bx,y0:by,x1:ex,y1:ey,z:bz,c:0x6a8a4a});
      for(var lf=0;lf<3;lf++){var u=.45+lf*.25,lx=bx+(ex-bx)*u,ly=by+(ey-by)*u;Q.lf.push({x:lx,y:ly,z:bz,s:.07+rr()*.05,rot:rr()*6.283,c:lf%2?0x86a85a:0x5e8a4a})}}}
}
function flushStones(){
  var Q=sumStoneQ;if(!Q)return;sumStoneQ=null;
  if(Q.gr.length){var g=mergeVC(Q.gr);boxUV(g,.55);if(!sumFx.granM)sumFx.granM=snowyRockMat(graniteTex());add(mesh(g,sumFx.granM,true,true))}
  if(Q.ms.length)add(mesh(mergeG(Q.ms,true),M(0xffffff,1,0,{vertexColors:true}),false,true));
  if(Q.sn.length)add(mesh(mergeG(Q.sn),M(0xf6f8fc,.8),false,true));
  /* raminhos e folhas balançam de leve com o vento */
  if(Q.pl.length){var pos=[],col=[],sw=[],c=new T.Color();
    function quad(ax,ay,bx,by,z,wd,cc,w0,w1){var dx=by-ay,dy=-(bx-ax),L=Math.hypot(dx,dy)||1;dx*=wd/L;dy*=wd/L;
      [[ax-dx,ay-dy,w0],[ax+dx,ay+dy,w0],[bx+dx,by+dy,w1],[ax-dx,ay-dy,w0],[bx+dx,by+dy,w1],[bx-dx,by-dy,w1]].forEach(function(q){pos.push(q[0],q[1],z);c.setHex(cc);col.push(c.r,c.g,c.b);sw.push(q[2])})}
    Q.pl.forEach(function(s){quad(s.x0,s.y0,s.x1,s.y1,s.z,.012,s.c,0,1)});
    Q.lf.forEach(function(l){var ex=l.x+Math.cos(l.rot)*l.s*1.8,ey=l.y+Math.sin(l.rot)*l.s*1.8;quad(l.x,l.y,ex,ey,l.z,l.s*.5,l.c,.6,1)});
    var g2=new T.BufferGeometry();g2.setAttribute('position',new T.Float32BufferAttribute(pos,3));g2.setAttribute('color',new T.Float32BufferAttribute(col,3));g2.setAttribute('sw',new T.Float32BufferAttribute(sw,1));g2.computeVertexNormals();
    var pm=new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide});
    pm.onBeforeCompile=function(sh){sh.uniforms.uT=sumU.time;sh.uniforms.uW=sumU.wind;sh.vertexShader='attribute float sw;uniform float uT,uW;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.x+=sw*(sin(uT*2.4+position.x*3.1)*.03+uW*.06);')};
    var pl=new T.Mesh(g2,pm);pl.frustumCulled=false;add(pl)}
}

/* ---------- paisagem de fundo da encosta: paredões de pedra em agulhas (rocha clara listrada), encosta de cascalho com capim seco e neve ---------- */
function spireTex(){
  if(sumFx.spT)return sumFx.spT;var W=128,H=256,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d'),sd=4242;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  x.fillStyle='#b8ab98';x.fillRect(0,0,W,H);
  for(var i=0;i<90;i++){var px=r()*W,w=1+r()*5,v=r()<.5?'rgba(70,62,58,':'rgba(230,222,206,';x.fillStyle=v+(.15+r()*.35)+')';x.fillRect(px,0,w,H)}/* listras verticais */
  for(i=0;i<300;i++){x.fillStyle='rgba(40,36,34,'+(r()*.3)+')';x.fillRect(r()*W,r()*H,1+r()*3,2+r()*8)}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;sumFx.spT=t;return t;
}
function buildDolomites(r,lite){
  var X0=-30,X1=170,G=[],c=new T.Color();
  /* agulhas de pedra: prismas altos e irregulares, pontas quebradas, neve nas saliências */
  function spire(x,z,h,rad,seg){
    var g=new T.CylinderGeometry(rad*.12,rad,h,seg,10,false),p=g.attributes.position,v=new T.Vector3();
    for(var k=0;k<p.count;k++){v.fromBufferAttribute(p,k);var u=(v.y+h/2)/h,a=Math.atan2(v.z,v.x);
      var f=1+.18*Math.sin(a*seg*.5+u*9)+.12*Math.sin(u*23+a*3)*(1-u*.5);/* sulcos verticais e degraus */
      var step=Math.floor(u*6)/6;f*=1-.12*(u-step)*6;
      v.x*=f;v.z*=f*.75;if(u>.85)v.y+=Math.sin(a*5+x)*rad*.25;p.setXYZ(k,v.x,v.y,v.z)}
    g=g.toNonIndexed();g.computeVertexNormals();
    var n=g.attributes.normal,pp=g.attributes.position,col=[],sunC=new T.Color(0xf2dcc0),shC=new T.Color(0x7a7e98);for(k=0;k<n.count;k++){var ny=n.getY(k),u2=(pp.getY(k)+h/2)/h,lit=clamp(.5-n.getX(k)*.55+n.getZ(k)*.25,0,1);c.copy(shC).lerp(sunC,lit);c.multiplyScalar(.75+.3*u2);
      if(ny>.55&&u2>.2)c.lerp(new T.Color(0xf6f4f2),Math.min(1,(ny-.55)*3));col.push(c.r,c.g,c.b)}
    g.setAttribute('color',new T.Float32BufferAttribute(col,3));xf(g,[x,h/2-13+Math.max(0,sumGroundAt(Math.min(150,Math.max(0,x))))*.8,z],[0,r()*6,0]);
    var uv=g.attributes.uv;for(k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*rad*.35,uv.getY(k)*h/18);
    G.push({g:g});
  }
  for(var x=X0;x<X1-28;x+=11+r()*10){var h=20+r()*14,rad=6+r()*4;spire(x,-54-r()*10,h,rad,6+Math.floor(r()*3));
    spire(x+(r()-.5)*8,-50-r()*6,h*(.5+r()*.3),rad*(.6+r()*.25),5+Math.floor(r()*2));
    spire(x+5,-58,h*.42,rad*2.1,7)}/* base larga que liga as agulhas num paredão só */
  /* o maciço principal mais alto, como na foto */
  spire(60,-64,38,8,9);spire(52,-60,30,6,8);spire(70,-58,28,6,8);spire(112,-66,36,8,9);spire(18,-62,30,7,8);
  if(G.length){var sm=M(0xffffff,.95,0,{map:spireTex(),vertexColors:true,flatShading:true});add(mesh(mergeVC(G),sm,false,true))}
  /* encosta de cascalho subindo até o pé das agulhas: cinza, com capim seco embaixo e manchas de neve */
  var nx=Math.round((X1-X0)/3),nz=12,pos=[],col2=[],idx=[];
  nz=16;
  for(var iz=0;iz<=nz;iz++){var zz=-5-iz*(46/nz),t=iz/nz;
    for(var ix=0;ix<=nx;ix++){var xx=X0+ix*(X1-X0)/nx;
      var yy=sumSlopeY(xx,zz);pos.push(xx,yy,zz);
      var n=Math.sin(xx*.37+zz*.53)*.5+Math.sin(xx*.11-zz*.29)*.5,cc=new T.Color(0x8e8780);
      if(t<.4&&n>-.2)cc.lerp(new T.Color(0x8a7c50),.7);/* capim seco */
      if(t<.25&&n>.3)cc.lerp(new T.Color(0x6e7a44),.55);
      if(n>.72&&t>.35)cc.set(0xe8eaee);/* neve */
      cc.multiplyScalar(.9+.15*Math.sin(xx*2.3+zz*1.7));col2.push(cc.r,cc.g,cc.b)}}
  for(iz=0;iz<nz;iz++)for(ix=0;ix<nx;ix++){var a=iz*(nx+1)+ix;idx.push(a,a+1,a+nx+1,a+1,a+nx+2,a+nx+1)}
  var sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(pos,3));sg.setAttribute('color',new T.Float32BufferAttribute(col2,3));
  var suv=[];for(var q2=0;q2<pos.length;q2+=3)suv.push(pos[q2]*.28,pos[q2+2]*.28);sg.setAttribute('uv',new T.Float32BufferAttribute(suv,2));sg.setIndex(idx);sg.computeVertexNormals();
  var SK=[],sku=[],skx=[];for(ix=0;ix<=nx;ix++){var xs=X0+ix*(X1-X0)/nx,ys=sumSlopeY(xs,-5);SK.push(xs,ys,-5.05,xs,-16,-5.05);sku.push(xs/4,ys/4,xs/4,-16/4)}
  for(ix=0;ix<nx;ix++){var a2=ix*2;skx.push(a2,a2+1,a2+2,a2+1,a2+3,a2+2)}
  var skg=new T.BufferGeometry();skg.setAttribute('position',new T.Float32BufferAttribute(SK,3));skg.setAttribute('uv',new T.Float32BufferAttribute(sku,2));skg.setIndex(skx);skg.computeVertexNormals();
  add(mesh(skg,sumFx.side||M(0x8c8a9c,.95),false,true));/* paredão de rocha atrás dos vãos: o fundo não aparece mais por baixo */
  var gt=graniteTex();add(mesh(sg,M(0xffffff,1,0,{vertexColors:true,map:gt,bumpMap:gt,bumpScale:.03,emissive:new T.Color(0x3a3430),emissiveIntensity:.35}),false,true));/* cascalho: a textura de pedra dá o detalhe miúdo */
  /* pedregulhos espalhados na encosta (granito) */
  if(sumStoneQ)for(var b=0;b<(lite?14:34);b++){var bx=X0+10+r()*(X1-X0-20),bz=-12-r()*28,by=sumSlopeY(bx,bz);
    var pg=chipRock(r,lite?1:2),s3=.4+r()*1.1;xf(pg,[bx,by+s3*.22,bz],[r()*3,r()*3,r()*3],[s3*1.3,s3*.8,s3]);pg.computeVertexNormals();sumStoneQ.gr.push({g:pg})}
}
function mergeVC(list){/* junta geometrias guardando a cor por vértice */
  var n=0;list.forEach(function(q){n+=q.g.attributes.position.count});var P=new Float32Array(n*3),N=new Float32Array(n*3),U=new Float32Array(n*2),C=new Float32Array(n*3),o=0;
  list.forEach(function(q){var g=q.g,cn=g.attributes.position.count;P.set(g.attributes.position.array,o*3);N.set(g.attributes.normal.array,o*3);if(g.attributes.uv)U.set(g.attributes.uv.array,o*2);if(g.attributes.color)C.set(g.attributes.color.array,o*3);else C.fill(1,o*3,(o+cn)*3);o+=cn});
  var b=new T.BufferGeometry();b.setAttribute('position',new T.BufferAttribute(P,3));b.setAttribute('normal',new T.BufferAttribute(N,3));b.setAttribute('uv',new T.BufferAttribute(U,2));b.setAttribute('color',new T.BufferAttribute(C,3));return b}

/* altura da encosta atrás da trilha: começa colada no fundo da plataforma (z=-5) e sobe até o pé das agulhas */
function sumBaseAt(x){var b=sumGroundAt(x);if(b<-50){for(var d=1;d<8;d++){var l=sumGroundAt(x-d),r2=sumGroundAt(x+d);if(l>-50||r2>-50){b=Math.min(l>-50?l:99,r2>-50?r2:99);break}}}if(b<-50||b>90)b=0;return Math.max(-2,b)}
function sumSlopeY(x,z){var t=clamp((-5-z)/46,0,1),dr=x>153?Math.pow(x-153,1.3)*1.4:0;return sumBaseAt(x)-.18+t*t*8.5+Math.sin(x*.21+z*.3)*.5*t+Math.sin(x*.07)*1.0*t-dr}
/* textura do paredão: camadas de rocha com rachaduras (cor e relevo) */
function strataTex(){
  if(sumFx.strT)return sumFx.strT;var S=256,c=document.createElement('canvas');c.width=c.height=S;var x=c.getContext('2d'),sd=5151;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  var y=0;while(y<S){var h=6+r()*22,v=Math.round(96+r()*46),tint=r();x.fillStyle='rgb('+(v+(tint>.5?6:-2))+','+(v+2)+','+(v+(tint>.5?0:10))+')';x.fillRect(0,y,S,h);
    for(var i=0;i<60;i++){x.fillStyle='rgba(255,255,255,'+(r()*.12)+')';x.fillRect(r()*S,y+r()*h,2+r()*12,1+r()*2)}
    x.fillStyle='rgba(30,28,32,.55)';x.fillRect(0,y+h-1.5,S,1.5);y+=h}
  for(i=0;i<14;i++){var qx=r()*S,qy=r()*S,a=Math.PI/2+(r()-.5)*.9;x.strokeStyle='rgba(25,22,26,'+(.25+r()*.35)+')';x.lineWidth=.6+r()*1.1;x.beginPath();x.moveTo(qx,qy);for(var k=0;k<5;k++){a+=(r()-.5)*.6;qx+=Math.cos(a)*9;qy+=Math.sin(a)*9;x.lineTo(qx,qy)}x.stroke()}
  for(i=0;i<1600;i++){x.fillStyle='rgba(20,18,22,'+(r()*.25)+')';x.fillRect(r()*S,r()*S,1+r()*2,1+r()*2)}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;t.anisotropy=4;sumFx.strT=t;return t;
}
/* neve do chão: ondulações do vento e brilhinhos */
function snowTopTex(){
  if(sumFx.snT)return sumFx.snT;var S=256,c=document.createElement('canvas');c.width=c.height=S;var x=c.getContext('2d'),sd=8181;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  x.fillStyle='#f3f5f9';x.fillRect(0,0,S,S);
  for(var i=0;i<46;i++){var yy=r()*S,amp=2+r()*4,ph=r()*6;x.strokeStyle='rgba(160,175,205,'+(.12+r()*.16)+')';x.lineWidth=2+r()*4;x.beginPath();for(var xx=-10;xx<=S+10;xx+=8)x.lineTo(xx,yy+Math.sin(xx*.05+ph)*amp);x.stroke()}
  for(i=0;i<900;i++){x.fillStyle='rgba(255,255,255,'+(.5+r()*.5)+')';x.fillRect(r()*S,r()*S,1,1)}
  for(i=0;i<500;i++){x.fillStyle='rgba(150,165,195,'+(r()*.18)+')';x.fillRect(r()*S,r()*S,1+r()*3,1+r()*2)}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;t.anisotropy=4;sumFx.snT=t;return t;
}
/* trilha pisada no meio da neve: neve suja, cascalho aparecendo e pegadas (bordas somem aos poucos) */
function trailTex(){
  if(sumFx.trT)return sumFx.trT;var W=256,H=128,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d'),sd=2727;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(200,198,196,0)');g.addColorStop(.28,'rgba(176,172,170,.9)');g.addColorStop(.72,'rgba(176,172,170,.9)');g.addColorStop(1,'rgba(200,198,196,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  for(var i=0;i<700;i++){var py=H*.3+r()*H*.4,v=Math.round(70+r()*80);x.fillStyle='rgba('+v+','+(v-2)+','+(v-6)+','+(.35+r()*.5)+')';x.fillRect(r()*W,py,1+r()*3,1+r()*2.5)}
  for(i=0;i<16;i++){var fx=i*16+r()*4,fy=H*(i%2?.42:.58);x.fillStyle='rgba(120,128,150,.35)';x.beginPath();x.ellipse(fx,fy,4,2.4,0,0,6.283);x.fill()}
  var t=new T.CanvasTexture(c);t.wrapS=T.RepeatWrapping;t.encoding=T.sRGBEncoding;t.anisotropy=4;sumFx.trT=t;return t;
}
/* granito com neve só nas faces de cima (calculado na placa de vídeo) e sombra na base */
function snowyRockMat(map){
  var m=M(0xffffff,.9,0,{map:map,bumpMap:map,bumpScale:.035,vertexColors:true});
  m.onBeforeCompile=function(sh){sh.vertexShader='varying float vSnowN;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSnowN=normalize(mat3(modelMatrix)*objectNormal).y;');
    sh.fragmentShader='varying float vSnowN;\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.rgb=mix(diffuseColor.rgb,vec3(.95,.96,.99),smoothstep(.6,.82,vSnowN)*.92);')};
  return m;
}
/* grama da montanha com falhas: a mesma grama do jogo, em tufos secos e espalhados */
function sumGrass(r,lite){
  var lq=+effCfg().lush||0,q=(coarse?.5:1)*(lq>=.75?1:(lq>=.6?.6:.35)),bl=[],fc=[],d=new T.Object3D();
  function gap(x,z){return Math.sin(x*.31+z*.47)*.55+Math.sin(x*.093-z*.21+1.3)*.45+Math.sin(x*.71-z*.9)*.15}
  /* encosta do fundo: touceiras do pé da trilha até o alto, mais esparsas e maiores ao longe; as falhas vêm do ruído */
  var nc=Math.round(5200*q);for(var ci=0;ci<nc;ci++){var t=Math.pow(r(),1.25),cx=-26+r()*178,cz=-5.3-t*38;if(cx>150&&r()<.7)continue;
    var n=gap(cx,cz);if(n<-.4||sumGroundAt(Math.min(150,Math.max(-5,cx)))<-50)continue;
    var far=1+t*2.2,nb=Math.max(5,Math.floor((10+r()*18*(n+.4))/(1+t*.6))),cr=(.2+r()*.35)*far;
    for(var k=0;k<nb;k++){var a=r()*6.283,rr2=Math.sqrt(r())*cr,bx=cx+Math.cos(a)*rr2,bz=cz+Math.sin(a)*rr2*.7;bl.push([bx,sumSlopeY(bx,bz),bz,(.32+r()*.5)*(1-rr2/cr*.45)*(1+t*.9),(.09+r()*.05)*(1+t*.8)])}}
  /* ribanceira da frente: tufos brotando das rachaduras e das camadas do paredão das plataformas, com falhas */
  LV.solids.forEach(function(s){if(s[5]||s[3]!==undefined||s[2]>40)return;var x0=s[0],x1=s[1],top=s[2];
    var nf=Math.round((x1-x0)*(lite?12:28)*Math.max(q,.5));for(var i=0;i<nf;i++){var fx=x0+.3+r()*(x1-x0-.6),fy=top-.6-Math.pow(r(),1.3)*Math.min(6,top+13);
      if(gap(fx*.9,fy*1.7+s[0])<-.72)continue;var nb2=6+Math.floor(r()*10);
      for(var k=0;k<nb2;k++)fc.push([fx+(r()-.5)*.9,fy+(r()-.5)*.08,1.84+r()*.06,.22+r()*.36,.09+r()*.04])}});
  var bg=bladeGeo(),gm=grassMat({base:'#2e3a16',mid:'#6a7a32',tip:'#c6bc72',sway:.8});gm.uniforms.time=lushU.time;
  [bl,fc].forEach(function(L,li){if(!L.length)return;var g=li?bladeGeo():bg,im=new T.InstancedMesh(g,gm,L.length),ar=new Float32Array(L.length*3);
    L.forEach(function(b,j){d.position.set(b[0],b[1]-.02,b[2]);d.rotation.set(li?(.3+r()*.45):0,li?(r()-.5)*1.2:r()*6.283,0);d.scale.set(b[4],b[3],b[4]);d.updateMatrix();im.setMatrixAt(j,d.matrix);ar[j*3]=r();ar[j*3+1]=r();ar[j*3+2]=.6+r()*.6});
    g.setAttribute('aR',new T.InstancedBufferAttribute(ar,3));im.frustumCulled=false;add(im)});
}
/* ---------- parte 2 de dia: céu azul com nuvens grandes, serras azuis ao longe e montanhas verdes saindo do mar de nuvens ---------- */
function cumulusTex(seed){
  var W=256,H=160,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d'),sd=seed;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  var B=[];for(var i=0;i<16;i++){var bx=40+r()*176,s=Math.sin((bx-40)/176*Math.PI),by=86+r()*30-s*40,br=16+r()*26*(s+.3);B.push([bx,by,br])}
  B.forEach(function(b){var g=x.createRadialGradient(b[0],b[1]+b[2]*.5,b[2]*.2,b[0],b[1],b[2]);g.addColorStop(0,'rgba(196,208,224,1)');g.addColorStop(1,'rgba(196,208,224,0)');x.fillStyle=g;x.beginPath();x.arc(b[0],b[1],b[2],0,6.283);x.fill()});
  B.forEach(function(b){var g=x.createRadialGradient(b[0]-b[2]*.25,b[1]-b[2]*.35,b[2]*.1,b[0],b[1],b[2]*.95);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.6,'rgba(250,252,255,.9)');g.addColorStop(1,'rgba(240,245,252,0)');x.fillStyle=g;x.beginPath();x.arc(b[0],b[1]-b[2]*.12,b[2]*.9,0,6.283);x.fill()});
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
}
function ridgeStrip(x0,x1,z,yBase,hMin,hMax,cTop,cBot,rr,seg){/* serra recortada: silhueta de picos e vales */
  var pos=[],col=[],a=new T.Color(cTop),b=new T.Color(cBot),pts=[],n=seg||60;
  for(var i=0;i<=n;i++){var u=i/n,x=x0+(x1-x0)*u,h=hMin+(hMax-hMin)*(.5+.3*Math.sin(u*17)+.2*Math.sin(u*41)+(rr()-.5)*.4);pts.push([x,yBase+Math.max(hMin*.6,h)])}
  for(i=0;i<n;i++){var p=pts[i],q=pts[i+1];pos.push(p[0],yBase-40,z,q[0],yBase-40,z,q[0],q[1],z,p[0],yBase-40,z,q[0],q[1],z,p[0],p[1],z);[b,b,a,b,a,a].forEach(function(c){col.push(c.r,c.g,c.b)})}
  var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));return linCols(g);
}
function buildFarDay(r){
  var lite=coarse&&(+effCfg().lush||0)<.6,D=sumFx.dayM||(sumFx.dayM=[]);
  function fm(m){m.transparent=true;m.opacity=0;m.depthWrite=false;D.push(m);return m}
  var sky=new T.Mesh(new T.PlaneGeometry(1600,520),new T.ShaderMaterial({uniforms:{day:sumU.day},transparent:true,depthWrite:false,fog:false,
    vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform float day;varying vec2 vU;void main(){float y=vU.y;vec3 c=mix(vec3(.78,.88,.97),vec3(.30,.58,.90),smoothstep(.33,.5,y));c=mix(c,vec3(.90,.94,.98),smoothstep(.34,.3,y));'+(sumLin()?'c=pow(c,vec3(2.2))*1.15;':'')+'gl_FragColor=vec4(c,day);}'}));
  sky.position.set(0,90,-340);sky.renderOrder=-20;farG.add(sky);
  for(var i=0;i<(lite?6:9);i++){var t=cumulusTex(100+i*37),s=new T.Sprite(fm(new T.SpriteMaterial({map:t,fog:false})));s.material.userData.big=1;var sz=50+r()*55;s.scale.set(sz,sz*.62,1);s.position.set(-260+i*70+r()*30,62+r()*40,-300);s.renderOrder=-15;farG.add(s)}
  var r1=new T.Mesh(ridgeStrip(-500,700,-280,-14,28,62,0x8aa6cc,0xc8d8ea,r,70),fm(new T.MeshBasicMaterial({vertexColors:true,fog:false})));r1.renderOrder=-12;farG.add(r1);
  var r2=new T.Mesh(ridgeStrip(-500,700,-240,-14,20,46,0x5f82b0,0xb6cce4,r,80),fm(new T.MeshBasicMaterial({vertexColors:true,fog:false})));r2.renderOrder=-11;farG.add(r2);
  for(i=0;i<(lite?6:12);i++){var nv=new T.Sprite(fm(new T.SpriteMaterial({map:softSprite(),color:0xffffff,fog:false})));nv.scale.set(140+r()*80,26,1);nv.position.set(-400+i*80,-4+r()*6,-200);nv.renderOrder=-10;farG.add(nv)}
}
function buildGreenPeaks(r,lite){
  var G=[],x0=LV.fall.x,xe=sceneEnd(),c=new T.Color(),olive=new T.Color(0xa8b45a),outc=[],RO=[],lit=new T.Color(0x96c868),shd=new T.Color(0x2a4e48),rock=new T.Color(0x8a98b0),haze=new T.Color(0xb8cce4);
  function peak(px,pz,h,rad){
    var g=new T.ConeGeometry(rad,h,lite?9:14,lite?5:9,true),p=g.attributes.position,v=new T.Vector3(),o=r()*9;
    for(var k=0;k<p.count;k++){v.fromBufferAttribute(p,k);var u=(v.y+h/2)/h,a=Math.atan2(v.z,v.x),f=1+.22*Math.sin(a*3+o)*(1-u)+.14*Math.sin(a*7+u*6+o)+.06*Math.sin(a*15+u*20);v.x*=f;v.z*=f*.8;v.y+=Math.sin(a*2+o)*.08*h*(1-u);p.setXYZ(k,v.x,v.y,v.z)}
    g=g.toNonIndexed();g.computeVertexNormals();var n=g.attributes.normal,pp=g.attributes.position,col=[];
    for(k=0;k<n.count;k++){var ny=n.getY(k),u2=(pp.getY(k)+h/2)/h,X=pp.getX(k),Y=pp.getY(k),Z=pp.getZ(k),l=clamp(.42-n.getX(k)*.75+ny*.35+.08*Math.sin(Y*.9+X*.4),0,1);c.copy(shd).lerp(lit,l*l*(3-2*l));
      var bn=Math.sin(X*.23+Y*.31)*.5+Math.sin(Z*.27-Y*.17+o)*.5;if(bn>.35)c.lerp(olive,(bn-.35)*1.2);/* faixas de capim mais seco */
      var ridge=Math.abs(Math.sin(Math.atan2(Z,X)*7+o+u2*6));if(u2>.4&&ridge>.9)c.lerp(rock,(ridge-.9)*8*Math.min(1,(u2-.4)*3));/* pedra aparecendo nas cristas */
      if(u2>.72)c.lerp(rock,Math.min(1,(u2-.72)*3.5)*.85);
      if(u2>.2&&u2<.8&&r()<.012)outc.push(k);c.lerp(haze,(clamp((-pz-150)/150,0,.45)+(1-u2)*.25)*(sumLin()?1:.45));col.push(c.r,c.g,c.b)}
    g.setAttribute('color',new T.Float32BufferAttribute(col,3));var ry=r()*6,yy=LV.fall.y-16+h/2;xf(g,[px,yy,pz],[0,ry,0]);boxUV(g,.09);G.push({g:g});
    /* afloramentos de pedra saindo da grama */
    var gp=g.attributes.position,gn=g.attributes.normal,nmax=lite?4:9;outc.sort(function(){return r()-.5}).slice(0,nmax).forEach(function(k2){var sc=h*(.05+r()*.05);
      var rg=chipRock(r,1);xf(rg,[gp.getX(k2)-gn.getX(k2)*sc*.35,gp.getY(k2)-sc*.3,gp.getZ(k2)-gn.getZ(k2)*sc*.35],[r()*3,r()*3,r()*3],[sc*1.4,sc,sc*1.1]);rg.computeVertexNormals();
      var nn=rg.attributes.normal,col2=new Float32Array(nn.count*3),cc=new T.Color();for(var t=0;t<nn.count;t++){var l2=clamp(.45-nn.getX(t)*.6+nn.getY(t)*.35,0,1);cc.set(0x8a92a0).lerp(new T.Color(0xeef0f2),l2).lerp(haze,clamp((-pz-150)/150,0,.4)*(sumLin()?1:.45));col2[t*3]=cc.r;col2[t*3+1]=cc.g;col2[t*3+2]=cc.b}
      rg.setAttribute('color',new T.BufferAttribute(col2,3));RO.push({g:rg})});outc.length=0;
  }
  for(var x=x0-30;x<xe+60;x+=30+r()*26){var pz=-160-r()*60,h=34+r()*22;peak(x,pz,h,h*(1.1+r()*.4));if(r()<.6)peak(x+20+r()*10,pz-25-r()*25,h*(.75+r()*.25),h*1.1)}
  peak(x0+70,-175,56,58);peak(x0+150,-190,52,54);
  if(G.length){var m=new T.MeshBasicMaterial({vertexColors:true,fog:false,transparent:true,opacity:0,map:peakGrassTex()});m.userData.solid=1;sumFx.dayM.push(m);add(mesh(linCols(mergeVC(G)),m,false,true))}
  if(RO.length){var rg2=mergeVC(RO);boxUV(rg2,.35);var m2=new T.MeshBasicMaterial({vertexColors:true,fog:false,transparent:true,opacity:0,map:peakGrassTex()});m2.userData.solid=1;sumFx.dayM.push(m2);add(mesh(linCols(rg2),m2,false,false))}
  for(var i=0;i<(lite?6:10);i++){var s=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,opacity:0,depthWrite:false,fog:false}));s.material.userData.wisp=1;sumFx.dayM.push(s.material);var w=40+r()*50;s.scale.set(w,w*.16,1);s.position.set(x0-10+r()*(xe-x0+20),LV.fall.y+r()*5,-120-r()*60);add(s)}
}
function sumDay(dt){
  var k=clamp((cam.x-138)/30,0,1);k=k*k*(3-2*k);sumU.day.value=k;var B=sumFx.base;
  if(!B){B=sumFx.base={fog:scene.fog.color.clone(),fd:scene.fog.density,hc:hemi.color.clone(),hg:hemi.groundColor.clone(),hi:hemi.intensity,sc:sun.color.clone(),si:sun.intensity}}
  (sumFx.dayM||[]).forEach(function(m){m.opacity=m.userData.wisp?k*.55:k;m.visible=k>.01;if(m.userData.solid){m.transparent=k<.99;m.depthWrite=k>.99}});
  (sumFx.dawn||[]).forEach(function(m){if(m.userData.o0===undefined)m.userData.o0=m.opacity;m.opacity=m.userData.o0*(1-k);m.visible=k<.99});
  sumClouds.forEach(function(c){c.m.emissive.setHex(k>.5?0xdde8f6:0xffc49a)});
  if(typeof lushSky!=='undefined'&&lushSky)lushSky.visible=k<.5;/* névoa dourada do amanhecer some de dia */
  if(sumEnd)return;
  scene.fog.color.copy(B.fog).lerp(new T.Color(0xc6dcf0),k);scene.fog.density=B.fd*(1-k*.55);
  hemi.color.copy(B.hc).lerp(new T.Color(0xe6f0ff),k);hemi.groundColor.copy(B.hg).lerp(new T.Color(0x6a7a5a),k);hemi.intensity=B.hi+k*.15;
  sun.color.copy(B.sc).lerp(new T.Color(0xfffaf0),k);sun.intensity=B.si*(1+k*.1);
}
function sumLin(){return quality==='high'&&!!composer}/* visual completo: a imagem passa pelo ajuste de cor (gamma), então as cores 'cruas' precisam ser convertidas */
function linCols(g){if(!sumLin())return g;var a=g.attributes.color.array;for(var i=0;i<a.length;i++)a[i]=Math.pow(a[i],1.7);return g}

/* textura de grama vista de longe: tufos, manchas e riscos (clara: a cor vem da montanha) */
function peakGrassTex(){
  if(sumFx.pgT)return sumFx.pgT;var S=256,c=document.createElement('canvas');c.width=c.height=S;var x=c.getContext('2d'),sd=6161;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  x.fillStyle='#e8e8e8';x.fillRect(0,0,S,S);
  for(var i=0;i<60;i++){var px=r()*S,py=r()*S,rr=10+r()*30,v=Math.round(200+r()*55);x.fillStyle='rgba('+v+','+v+','+v+',.5)';x.beginPath();x.ellipse(px,py,rr,rr*.6,r()*3,0,6.283);x.fill()}
  for(i=0;i<2600;i++){var bx=r()*S,by=r()*S,l=3+r()*7,v2=Math.round(150+r()*105);x.strokeStyle='rgba('+v2+','+v2+','+v2+','+(.4+r()*.5)+')';x.lineWidth=1;x.beginPath();x.moveTo(bx,by);x.lineTo(bx+(r()-.5)*3,by-l);x.stroke()}
  for(i=0;i<500;i++){x.fillStyle='rgba(90,90,90,'+(r()*.3)+')';x.fillRect(r()*S,r()*S,1+r()*2,1+r()*2)}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;t.anisotropy=4;sumFx.pgT=t;return t;
}

/* ---------- floresta de pinheiros lá embaixo, aparecendo pelos buracos das nuvens, em camadas com névoa ---------- */
function pineGeo(){
  var G=[],trunk=new T.CylinderGeometry(.05,.08,.8,5);trunk.translate(0,.4,0);G.push({g:trunk,c:0x2a2420});
  /* galhos em camadas: cada andar com a borda recortada e caída, mais escuro por baixo */
  for(var k=0;k<5;k++){var rad=.7-k*.12,hh=.95-k*.1,c=new T.ConeGeometry(rad,hh,10,2,false),cp=c.attributes.position;
    for(var j=0;j<cp.count;j++){var y0=cp.getY(j);if(y0<-hh/2+.01){var a=Math.atan2(cp.getZ(j),cp.getX(j)),f=1+.18*Math.sin(a*5+k)+.1*Math.sin(a*11+k*2);cp.setX(j,cp.getX(j)*f);cp.setZ(j,cp.getZ(j)*f);}}
    c.translate(0,.8+k*.5,0);G.push({g:c,c:0xffffff})}
  var g=mergeG(G,true),p=g.attributes.position,col=g.attributes.color,n=g.attributes.normal;
  for(var i=0;i<p.count;i++){var y=p.getY(i),f=.72+.28*clamp(y/3.2,0,1),ln=.75+.35*clamp(n.getY(i)+.3,0,1)-.25*clamp(n.getX(i),0,1);/* luz: cima e lado do sol mais claros; a base com névoa */
    col.setXYZ(i,(col.getX(i)*ln)*f+(1-f)*.9,(col.getY(i)*ln)*f+(1-f)*.95,(col.getZ(i)*ln)*f+(1-f)*.95)}
  return g;
}
function buildCloudForest(r,lite){
  var x0=LV.fall.x-30,xe=sceneEnd()+40,rows=lite?6:11,list=[],dark=new T.Color(0x23463e),mist=new T.Color(0xcfe0de),c=new T.Color(),d=new T.Object3D();
  for(var ri=0;ri<rows;ri++){var t=ri/(rows-1),z=-10-t*110,step=(lite?1.8:1.1)*(1+t*1.2),hill=Math.sin(ri*1.7)*3;
    for(var x=x0;x<xe;x+=step*(.6+r()*.8)){var sc=(1.3+r()*1.2)*(1+t*.6),by=LV.fall.y-2.6-sc*3.3-(1.2+r()*3+Math.max(0,hill));/* a copa fica logo abaixo do mar de nuvens: a floresta aparece pelos buracos */
      c.copy(dark).lerp(mist,Math.min(.8,t*.7+r()*.1));list.push([x,by,z+(r()-.5)*4,sc,c.clone()])}}
  if(!list.length)return;
  var m=new T.MeshBasicMaterial({vertexColors:true,fog:false,transparent:true,opacity:0,map:needleTex()});m.userData.solid=1;sumFx.dayM.push(m);
  var im=new T.InstancedMesh(pineGeo(),m,list.length);
  list.forEach(function(q,j){d.position.set(q[0],q[1],q[2]);d.rotation.set(0,r()*6,0);d.scale.set(q[3]*(.85+r()*.3),q[3],q[3]*(.85+r()*.3));d.updateMatrix();im.setMatrixAt(j,d.matrix);
    if(sumLin())q[4].setRGB(Math.pow(q[4].r,1.7),Math.pow(q[4].g,1.7),Math.pow(q[4].b,1.7));im.setColorAt(j,q[4])});
  im.frustumCulled=false;im.renderOrder=1;add(im);
  /* chão da mata (escuro, com névoa): não deixa ver o fundo entre as árvores */
  var fl=new T.Mesh(new T.PlaneGeometry(xe-x0+40,150),new T.MeshBasicMaterial({color:sumLin()?0x0e2620:0x23443a,fog:false,transparent:true,opacity:0}));fl.material.userData.solid=1;sumFx.dayM.push(fl.material);
  fl.rotation.x=-Math.PI/2;fl.position.set((x0+xe)/2,LV.fall.y-12.5,-65);fl.renderOrder=1;add(fl);
  /* faixas de névoa entre as camadas de árvores */
  for(var i=0;i<(lite?12:26);i++){var t2=r(),s=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xeef4f4,transparent:true,opacity:0,depthWrite:false,fog:false}));s.material.userData.wisp=1;sumFx.dayM.push(s.material);
    var w=50+r()*60;s.scale.set(w,7+r()*5,1);s.position.set(x0+r()*(xe-x0),LV.fall.y-12+t2*9,-15-t2*100);add(s)}
}

/* textura das agulhas do pinheiro: galhos inclinados claros e escuros, com sombra entre eles */
function needleTex(){
  if(sumFx.ndT)return sumFx.ndT;var S=128,c=document.createElement('canvas');c.width=c.height=S;var x=c.getContext('2d'),sd=3131;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  x.fillStyle='#b8c4bc';x.fillRect(0,0,S,S);
  for(var i=0;i<900;i++){var px=r()*S,py=r()*S,l=4+r()*9,v=Math.round(120+r()*135),a=Math.PI*.5+(r()<.5?-1:1)*(.5+r()*.5);x.strokeStyle='rgba('+v+','+Math.min(255,v+10)+','+v+','+(.5+r()*.5)+')';x.lineWidth=1+r();x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke()}
  for(i=0;i<8;i++){var yy=i*S/8+r()*4;x.fillStyle='rgba(30,40,36,.28)';x.fillRect(0,yy,S,3+r()*3)}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(3,2);t.encoding=T.sRGBEncoding;sumFx.ndT=t;return t;
}

/* nuvens e névoa da parte 2 levadas pelo vento (deslizam e voltam do outro lado) */
function sumDrift(dt){
  if(!sumFx||!sumFx.dayM||sumU.day.value<.01)return;var sp=4.5+Math.max(0,sumU.wind.value)*4;
  W.children.forEach(function(o){if(!o.isSprite||!o.material.userData.wisp)return;if(o.userData.x0===undefined){o.userData.x0=o.position.x;o.userData.span=260}
    o.position.x+=dt*sp*(.6+(o.position.z%7+7)%7*.08);if(o.position.x>cam.x+90)o.position.x-=180;if(o.position.x<cam.x-90)o.position.x+=180});
}
