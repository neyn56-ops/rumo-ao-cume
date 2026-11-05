/*@@parte:22_vulcao.js*/
/* ===================== Mundo 10: Vulcão ===================== */
var volM=null,lavaU={time:{value:0}},volSinks=[],volMovers=[],volMet=null,volEsc=null,volFallT=null;
function volMats(){
  if(volM)return volM;
  /* basalto: pedras escuras arredondadas (cor) + rachaduras de lava (brilho) */
  var S=256,c=document.createElement('canvas');c.width=c.height=S;var x=c.getContext('2d'),e=document.createElement('canvas');e.width=e.height=S;var y=e.getContext('2d');
  var sd=71;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  x.fillStyle='#1c1a1c';x.fillRect(0,0,S,S);y.fillStyle='#000';y.fillRect(0,0,S,S);
  for(var i=0;i<70;i++){var px=r()*S,py=r()*S,rr=10+r()*22,v=Math.round(30+r()*30);
    for(var ox=-S;ox<=S;ox+=S)for(var oy=-S;oy<=S;oy+=S){x.fillStyle='rgb('+(v+6)+','+v+','+(v-2)+')';x.beginPath();x.ellipse(px+ox,py+oy,rr,rr*.8,r()*3,0,6.283);x.fill();
      x.fillStyle='rgba(255,255,255,.06)';x.beginPath();x.ellipse(px+ox-rr*.25,py+oy-rr*.25,rr*.5,rr*.35,0,0,6.283);x.fill()}}
  /* rachaduras */
  for(i=0;i<9;i++){var cx=r()*S,cy=r()*S,a=r()*6.283,L=24+r()*50;
    for(var ox2=-S;ox2<=S;ox2+=S)for(var oy2=-S;oy2<=S;oy2+=S){y.strokeStyle='#ff6a10';y.lineWidth=1.2+r()*1.4;y.lineJoin='round';y.beginPath();var qx=cx+ox2,qy=cy+oy2;y.moveTo(qx,qy);
      for(var k=0;k<6;k++){a+=(r()-.5)*1.4;qx+=Math.cos(a)*L/6;qy+=Math.sin(a)*L/6;y.lineTo(qx,qy)}y.stroke();
      y.strokeStyle='#ffd27a';y.lineWidth=1;y.stroke();x.strokeStyle='#120c0a';x.lineWidth=4;x.stroke()}}
  var tc=new T.CanvasTexture(c),te=new T.CanvasTexture(e);[tc,te].forEach(function(t){t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;t.anisotropy=4});
  var rock=M(0xb8b0b0,.92,0,{map:tc,emissive:new T.Color(0xff5a10),emissiveMap:te,emissiveIntensity:1.0});
  var rockTop=M(0xa89c98,.9,0,{map:tc,emissive:new T.Color(0xff4a08),emissiveMap:te,emissiveIntensity:.7});
  var rim=new T.MeshBasicMaterial({color:0xffa030});
  var chain=M(0x2a2624,.45,.8);
  volM={rock:rock,top:rockTop,rim:rim,chain:chain,tc:tc,te:te};return volM;
}
function lavaMat(o){
  o=o||{};var lite=coarse&&(+effCfg().lush||0)<.6;
  return new T.ShaderMaterial({
    uniforms:T.UniformsUtils.merge([T.UniformsLib.fog,{time:{value:0},sp:{value:o.sp||1},sc:{value:o.sc||1},sc0:{value:o.vert?0:1}}]),
    vertexShader:['varying vec2 vP;','#include <fog_pars_vertex>','void main(){vec4 wp=modelMatrix*vec4(position,1.);vP=wp.xz;'+(o.vert?'vP=wp.xy;':'')+'vec4 mvPosition=viewMatrix*wp;gl_Position=projectionMatrix*mvPosition;','#include <fog_vertex>','}'].join('\n'),
    fragmentShader:['uniform float time,sp,sc,sc0;varying vec2 vP;','#include <common>','#include <fog_pars_fragment>',
      '#define OCT '+(lite?3:4),'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}','float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}','float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<OCT;i++){v+=a*vnoise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
      'void main(){vec2 p=vP*.16*sc;float t=time*sp;',
      'vec2 q=vec2(fbm(p+vec2(t*.05,t*.03)),fbm(p+vec2(5.2,1.3)-vec2(t*.04,-t*.02)));',
      'float h=fbm(p*1.5+q*2.4+vec2(t*.07,-t*.05));',
      'float v=1.-abs(fbm(p*2.6+q*3.-vec2(t*.09,t*.06))*2.-1.);v=pow(v,7.);',
      'vec3 crust=vec3(.05,.008,.003),mid=vec3(.7,.08,.005),hot=vec3(1.,.4,.02),white=vec3(1.,.78,.3);',
      'float k=smoothstep(.44,.76,h);vec3 c=mix(crust,mid,k);c=mix(c,hot,smoothstep(.64,.86,h));c+=white*v*(.12+.5*k);',
      'c*=.9+.1*sin(t*2.+h*12.);',
      'float dz=clamp((-vP.y-3.)/26.,0.,1.);c=mix(c,c*vec3(.5,.22,.12),dz*sc0);',
      'gl_FragColor=vec4(c,1.);','#include <fog_fragment>','}'].join('\n'),
    fog:true
  });
}
/* chamas: língua de fogo subindo, com ruído que corre para cima (transparente e aditivo) */
function fireMat(h,mode){
  var lite=coarse&&(+effCfg().lush||0)<.6;
  return new T.ShaderMaterial({uniforms:{time:lavaU.time,H:{value:h},Md:{value:mode||0}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
    vertexShader:'varying vec2 vUv;varying float vX,vY;void main(){vUv=uv;vec4 wp=modelMatrix*vec4(position,1.);vX=wp.x+wp.z*.7;vY=wp.y;gl_Position=projectionMatrix*viewMatrix*wp;}',
    fragmentShader:['uniform float time,H,Md;varying vec2 vUv;varying float vX,vY;','#define OCT '+(lite?3:4),'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}','float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}','float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<OCT;i++){v+=a*vnoise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
      'void main(){float y=vUv.y,t=time,X=Md>1.5?vUv.x*9.:vX;',
      'float n=fbm(vec2(X*.55,y*H*.55-t*1.7));float n2=fbm(vec2(X*1.3+4.,y*H*1.1-t*2.6));',
      'float f=n*.85+n2*.5-y*1.2-.16;',
      'if(Md>.5){n=fbm(vec2(X*.8,vY*.5-t*2.4));n2=fbm(vec2(X*1.7+4.,vY*1.05-t*3.4));}',/* jato e paredão: ruído no tamanho do mundo (não estica) */
      'if(Md>.5&&Md<1.5){float cx=abs(vUv.x*2.-1.);f=n*.9+n2*.55-cx*cx*1.25-y*.12-.08;}',/* jato: coluna de fogo com bordas vivas */
      'if(Md>1.5){f=n*.95+n2*.6-.42+(1.-vUv.x)*.42-smoothstep(.6,1.,vUv.x)*.55;}',/* paredão: línguas de fogo, frente rasgada */
      'float a=smoothstep(.0,.16,f)*(1.-smoothstep(Md>.5?.93:.75,1.,y))*(Md>.5&&Md<1.5?smoothstep(0.,.06,y):1.);',
      'vec3 c=mix(vec3(.45,.04,0.),vec3(.95,.3,.02),smoothstep(.02,.22,f));c=mix(c,vec3(1.,.68,.25),smoothstep(.22,.5,f));',
      'gl_FragColor=vec4(c*a*(Md>1.5?.5:.95),a);}'].join('\n')});
}
function buildPlatformsVolcano(m3){
  var V=volMats(),B=[],TP=[],RM=[],LU=[],r=rnd(1010);
  function uvT(g,su,sv){var uv=g.attributes.uv;for(var i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*su,uv.getY(i)*sv);return g}
  LV.solids.forEach(function(s){
    var x0=s[0],x1=s[1],top=s[2],bot=s[3]!==undefined?s[3]:-14,w=x1-x0,cx=(x0+x1)/2;
    solids.push({l:x0,r:x1,t:top,b:bot,oneway:false});if(s[5]==='out')return;/* o chão de fora é feito no cenário de fora */
    B.push({g:xf(uvT(new T.BoxGeometry(w,top-.3-bot,6.8),w/5,(top-bot)/5),[cx,(top-.3+bot)/2,-1.6])});
    TP.push({g:xf(uvT(new T.BoxGeometry(w+.14,.34,6.94),w/5,1.4),[cx,top-.17,-1.6])});
    RM.push({g:xf(new T.BoxGeometry(w+.16,.07,.08),[cx,top-.33,1.86])});
    for(var k=0;k<Math.max(2,w/3);k++)LU.push([x0+r()*w,top-.1,1.5+r()*.3,.25+r()*.25]);
  });
  var LV2=[],IR=[];
  LV.floats.forEach(function(f){
    var w=f[1]-f[0],cx=(f[0]+f[1])/2;
    if(f[3]==='t'){/* plataforma fina com veio de lava por baixo e suportes de ferro */
      TP.push({g:xf(uvT(new T.BoxGeometry(w,.3,2.4),w/4,.4),[cx,f[2]-.15,0])});
      LV2.push({g:xf(new T.BoxGeometry(w-.16,.1,2.2),[cx,f[2]-.34,0])});RM.push({g:xf(new T.BoxGeometry(w+.04,.05,.05),[cx,f[2]-.02,1.23])});
      [-1,1].forEach(function(sd){IR.push({g:xf(new T.BoxGeometry(.12,.7,.12),[cx+sd*(w/2-.3),f[2]-.7,0])});IR.push({g:xf(new T.BoxGeometry(.5,.08,.12),[cx+sd*(w/2-.45),f[2]-.98,0],[0,0,sd*.6])})});
      solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.32,oneway:false,flt:true});return;
    }
    TP.push({g:xf(uvT(new T.BoxGeometry(w,.6,3),w/4,.6),[cx,f[2]-.3,0])});
    RM.push({g:xf(new T.BoxGeometry(w+.04,.06,.06),[cx,f[2]-.03,1.53])});
    for(var k=0;k<Math.max(2,w*.9);k++){var q=.45+r()*.5;B.push({g:xf(new T.DodecahedronGeometry(q,0),[f[0]+.3+r()*(w-.6),f[2]-.55-r()*.35,(r()-.5)*1.8],[r()*3,r()*3,0],[1.2,.8,1])})}
    solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.6,oneway:false,flt:true});
  });
  add(mesh(mergeG(B),V.rock,true,true));add(mesh(mergeG(TP),V.top,true,true));add(mesh(mergeG(RM),V.rim,false,false));
  if(LV2.length){add(mesh(mergeG(LV2),new T.MeshBasicMaterial({color:0xff7a1a}),false,false));add(mesh(mergeG(IR),V.chain,true,false))}
  /* pedrinhas soltas na borda */
  if(LU.length){var im=inst(new T.DodecahedronGeometry(1,0),V.rock,LU.length,true),d=new T.Object3D();LU.forEach(function(p,j){d.position.set(p[0],p[1],p[2]);d.rotation.set(r()*3,r()*3,r()*3);d.scale.set(p[3],p[3]*.6,p[3]);d.updateMatrix();im.setMatrixAt(j,d.matrix)});add(im)}
}
function buildDecorVolcano(th){
  var V=volMats(),r=rnd(3131),d=new T.Object3D(),i,k,xe=sceneEnd(),lite=coarse&&(+effCfg().lush||0)<.6,lY=LV.lavaY||-1;
  /* rio de lava no fundo de toda a fase */
  if(LV.outX!==undefined)buildVolcanoOutside(LV.xMin-1,LV.outX);
  var lm=lavaMat(),lx0=LV.outX!==undefined?LV.outX+.3:-45;lm.uniforms.time=lavaU.time;
  var lp=new T.Mesh(new T.PlaneGeometry(xe+15-lx0,70,1,1),lm);lp.rotation.x=-Math.PI/2;lp.position.set((xe+15+lx0)/2,lY-.1,-30);lp.frustumCulled=false;add(lp);
  /* brilho da lava subindo */
  for(i=0;i<(lite?10:22);i++){if(LV.outX!==undefined&&-10+i*(xe/(lite?10:22))<LV.outX+4)continue;var gs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff5a10,transparent:true,opacity:.35,depthWrite:false,blending:T.AdditiveBlending,fog:false}));gs.scale.set(16,5,1);gs.position.set(-10+i*(xe/(lite?10:22)),lY+1.2,1.5);add(gs)}
  /* labaredas saindo da lava: na frente só nos vãos (não cobre o Kuro), atrás ao longo de toda a fase */
  var cov=function(x){for(var j=0;j<LV.solids.length;j++){var q=LV.solids[j];if(x>q[0]-.3&&x<q[1]+.3)return true}return false},FG=[],run=null;
  for(var fx=-14;fx<=xe;fx+=.5){var c0=cov(fx);if(!c0&&run===null)run=fx;if((c0||fx>=xe)&&run!==null){if(fx-run>1.2)FG.push([run,fx]);run=null}}
  var fm1=fireMat(3.2);FG.forEach(function(g){var w=g[1]-g[0],pl=new T.Mesh(new T.PlaneGeometry(w,3.2),fm1);pl.position.set((g[0]+g[1])/2,lY+1.45,1.2);pl.frustumCulled=false;add(pl);
    var pl2=new T.Mesh(new T.PlaneGeometry(w,2.4),fm1);pl2.position.set((g[0]+g[1])/2,lY+1.05,-1.5);add(pl2)});
  var fm2=fireMat(5);for(var bx2=-20;bx2<xe+20;bx2+=40){var pb=new T.Mesh(new T.PlaneGeometry(40.2,5),fm2);pb.position.set(bx2+20,lY+2.1,-9);add(pb)}
  /* paredões ao fundo com rachaduras, cachoeiras de lava */
  var W2=[],FL=[];
  for(var x=(LV.outX!==undefined?LV.outX+8:-30);x<xe+20;x+=12+r()*10){var h=12+r()*22,z=-24-r()*14,w=10+r()*10;W2.push({g:xf(new T.CylinderGeometry(w*.3,w*.6,h,7,1),[x,h/2-2,z],[0,r()*3,0])});
    for(k=0;k<3;k++)W2.push({g:xf(new T.DodecahedronGeometry(2+r()*2.5,0),[x+(r()-.5)*w,h-1+r()*2,z+2],[r()*3,r()*3,0],[1.3,.8,1])});
    if(r()<.55){var fw=1.6+r()*1.6,fx=x+(r()-.5)*w*.3,fh=h+1,pg=new T.PlaneGeometry(fw,fh);var uv=pg.attributes.uv;for(var q=0;q<uv.count;q++)uv.setXY(q,uv.getX(q),uv.getY(q)*fh/8);FL.push({g:xf(pg,[fx,fh/2-2,z+w*.45+.2])})}}
  var wm=V.rock.clone();wm.color=new T.Color(0x6a5a5a);wm.emissiveIntensity=.6;add(mesh(mergeG(W2),wm,false,true));
  if(FL.length){volFallT=fallTex(41);volFallT.repeat.set(1,4);add(mesh(mergeG(FL),new T.MeshBasicMaterial({map:volFallT,color:0xff8a20,transparent:true,depthWrite:false,blending:T.AdditiveBlending}),false,false))}
  /* pedras pontudas de obsidiana e árvores queimadas no chão */
  var OB=[],TR=[];
  LV.solids.forEach(function(s){if(s[3]!==undefined&&s[3]>-10)return;var w=s[1]-s[0];for(k=0;k<Math.floor(w/7);k++){var ox=s[0]+1+r()*(w-2);
    if(r()<.55)OB.push({g:xf(new T.ConeGeometry(.35+r()*.4,1.2+r()*1.6,5),[ox,s[2]+.5,-3.6-r()*.8],[(r()-.5)*.3,r()*3,(r()-.5)*.3])});
    else{var th=1.6+r()*1.2;TR.push({g:xf(new T.CylinderGeometry(.06,.14,th,5),[ox,s[2]+th/2,-3.8])});for(var b=0;b<3;b++){var bl=.6+r()*.6,an=(r()<.5?-1:1)*(.6+r()*.6);TR.push({g:xf(new T.CylinderGeometry(.03,.06,bl,4),[ox-Math.sin(an)*bl/2,s[2]+th*(.55+r()*.4)+Math.cos(an)*bl/2,-3.8],[0,0,an])})}}}});
  if(OB.length)add(mesh(mergeG(OB),M(0x1a1420,.25,.3),true,false));if(TR.length)add(mesh(mergeG(TR),M(0x1a1210,.95),true,false));
  /* tochas nos checkpoints */
  (LV.checkpoints||[]).forEach(function(c){var fs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff8a30,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.8}));fs.scale.set(1.1,1.5,1);fs.position.set(c[0]+.6,c[1]+2.6,-.5);add(fs);castleFx.torches.push({s:fs,sz:1.1})});
  /* borda da cratera no fim (onde fica a bandeira) */
  var g=LV.goal;if(g){var CR=[];for(k=0;k<9;k++)CR.push({g:xf(new T.DodecahedronGeometry(1.4+r()*1.4,0),[g.x-4+k*1.6,g.top+.2+r()*.6,-3.5-r()*1.5],[r()*3,r()*3,0])});add(mesh(mergeG(CR),V.rock,true,false));
    var cg=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff6a10,transparent:true,opacity:.65,depthWrite:false,blending:T.AdditiveBlending,fog:false}));cg.scale.set(20,9,1);cg.position.set(g.x,g.top+4,-6);add(cg)}
}
/* Mundo 10: lado de fora — campo queimado, árvores secas, fendas soltando fumaça e o vulcão gigante ao fundo; entra pelo arco de pedra */
var volOut=null;
function buildVolcanoOutside(xa,xb){
  var r=rnd(9090),i,k,d=new T.Object3D(),V=volMats(),lq=+effCfg().lush||0,q=(coarse?.55:1)*(lq>=.75?1:(lq>=.6?.6:.35)),lite=coarse&&lq<.6;
  var soilM=M(0x6e5e56,.97,0,{map:texDirt.map}),soilD=M(0x3a302c,.97,0,{map:texDirt.map}),pathM=M(0x6a5e58,.98,0,{map:texStone.map});
  volOut={smk:[],vents:[],tor:[],roarT:5,flash:0,puff:0,xb:xb,big:[]};
  /* chão da caminhada e o campo em volta */
  var w=xb-xa,cx=(xa+xb)/2;
  add(mesh(boxGeo(w,13.7,6.8,3),soilD,false,true)).position.set(cx,-7.15,-1.6);
  add(mesh(boxGeo(w,.32,6.94,2),soilM,false,true)).position.set(cx,-.16,-1.6);
  var fld=mesh(boxGeo(w+46,.3,42,2),soilM,false,true);fld.position.set(cx-23,-.2,-26);add(fld);
  var fr=mesh(boxGeo(w+30,.3,6,2),soilM,false,true);fr.position.set(cx-15,-.22,4.6);add(fr);
  /* estrada de cinza clara por onde o Kuro anda */
  var rd=mesh(boxGeo(w,.04,2.3,2),pathM,false,true);rd.position.set(cx,.02,-.1);add(rd);
  /* trilha que sai da estrada e sobe até o pé do vulcão */
  var pts=[],seg=24,rb=[],ri=[],ax=xa+16;
  for(i=0;i<=seg;i++){var t=i/seg,x=(1-t)*(1-t)*ax+2*(1-t)*t*(ax+10)+t*t*(xb-4),z=(1-t)*(1-t)*(-1.2)+2*(1-t)*t*(-12)+t*t*(-40);pts.push([x,z,1.7-t*1.1])}
  for(i=0;i<=seg;i++){var a=pts[Math.max(0,i-1)],b=pts[Math.min(seg,i+1)],tx=b[0]-a[0],tz=b[1]-a[1],L=Math.hypot(tx,tz)||1,nx=-tz/L,nz=tx/L,hw=pts[i][2]/2;
    rb.push(pts[i][0]+nx*hw,-.03,pts[i][1]+nz*hw,pts[i][0]-nx*hw,-.03,pts[i][1]-nz*hw);ri.push(0,i*.6,1,i*.6)}
  var idx=[];for(i=0;i<seg;i++){var o=i*2;idx.push(o,o+2,o+1,o+1,o+2,o+3)}
  var pg=new T.BufferGeometry();pg.setAttribute('position',new T.Float32BufferAttribute(rb,3));pg.setAttribute('uv',new T.Float32BufferAttribute(ri,2));pg.setIndex(idx);pg.computeVertexNormals();add(mesh(pg,pathM,false,true));
  function onPath(x,z){if(z>-1.35&&z<1.15)return true;for(var j=0;j<pts.length;j++){if(Math.hypot(x-pts[j][0],z-pts[j][1])<pts[j][2]*.6+.3)return true}return false}
  /* poças de lava no campo */
  var pools=[[xa+9,-13,4.5,2.2],[xa+30,-22,6,2.8]],lm=lavaMat(),PR=[];lm.uniforms.time=lavaU.time;
  pools.forEach(function(p){var pl=new T.Mesh(new T.CircleGeometry(1,28),lm);pl.rotation.x=-Math.PI/2;pl.scale.set(p[2],p[3],1);pl.position.set(p[0],-.03,p[1]);add(pl);
    for(k=0;k<14;k++){var an=k/14*6.283+r()*.3;PR.push({g:xf(new T.DodecahedronGeometry(.35+r()*.35,0),[p[0]+Math.cos(an)*p[2]*1.05,0,p[1]+Math.sin(an)*p[3]*1.05],[r()*3,r()*3,0],[1.2,.6,1])})}
    var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff5a10,transparent:true,opacity:.28,depthWrite:false,blending:T.AdditiveBlending,fog:false}));gl.scale.set(p[2]*2.6,2.4,1);gl.position.set(p[0],.8,p[1]);add(gl)});
  if(PR.length)add(mesh(mergeG(PR),V.rock,true,true));
  function inPool(x,z){for(var j=0;j<pools.length;j++){var p=pools[j],u=(x-p[0])/(p[2]+.8),v=(z-p[1])/(p[3]+.8);if(u*u+v*v<1)return true}return false}
  /* o vulcão gigante: cone irregular, cratera brilhando, rios de lava descendo e fumaça */
  var vx=xb-12,vz=-70,vb=-8,VH=23,R0=50,R1=6.5,cg=new T.CylinderGeometry(R1,R0,VH,56,14,true),cp=cg.attributes.position,cols=[],v3=new T.Vector3();
  for(i=0;i<cp.count;i++){v3.fromBufferAttribute(cp,i);var tt=(v3.y+VH/2)/VH,ang=Math.atan2(v3.x,v3.z),n=1+.07*Math.sin(ang*7+tt*5)+.05*Math.sin(ang*17-tt*9)+.03*Math.sin(ang*31);
    if(tt>.97)n*=1+.05*Math.sin(ang*11);cp.setXYZ(i,v3.x*n,v3.y+(tt>.98?Math.sin(ang*5)*1.2:0),v3.z*n);
    var c=new T.Color(0x120808).lerp(new T.Color(0x2a1612),Math.pow(tt,1.2));var rib=Math.max(0,Math.sin(ang*9+tt*3)),lit=.75+.45*Math.max(0,Math.sin(ang+.9));c.multiplyScalar((.8+rib*.4)*lit);if(tt>.88)c.lerp(new T.Color(0xb83a12),(tt-.88)/.12*.85);cols.push(c.r,c.g,c.b)}
  cg.setAttribute('color',new T.Float32BufferAttribute(cols,3));cg.computeVertexNormals();
  var vmM=new T.MeshBasicMaterial({vertexColors:true,fog:false,transparent:true,opacity:1});var vol=new T.Mesh(cg,vmM);vol.position.set(vx,vb+VH/2,vz);add(vol);volOut.big.push(vmM);
  /* encostas menores dos lados */
  [[-52,-84,14,34],[46,-86,12,36],[-26,-58,8,20]].forEach(function(h){var hg=new T.ConeGeometry(h[3],h[2],24,4,true),hc=[],hp=hg.attributes.position;for(var j=0;j<hp.count;j++){var c2=new T.Color(0x0e0606).lerp(new T.Color(0x1e0e0c),(hp.getY(j)+h[2]/2)/h[2]);hc.push(c2.r,c2.g,c2.b)}
    hg.setAttribute('color',new T.Float32BufferAttribute(hc,3));var hm=new T.Mesh(hg,vmM);hm.position.set(vx+h[0],vb+h[2]/2,h[1]);add(hm)});
  /* rios de lava na frente da montanha */
  var sT=lavaStreamTex();sT.repeat.set(1,2);volOut.sT=sT;var SR=[];
  [[-.18,1,.62],[.08,.8,.5],[.3,1.2,.4]].forEach(function(s){var pos=[],uvs=[],ix=[],N=18;
    for(var j=0;j<=N;j++){var tt2=.985-j/N*s[2],yy=-VH/2+tt2*VH,rad=R1+(R0-R1)*(1-tt2),an2=s[0]+Math.sin(j*.7+s[1]*3)*.035,ww=s[1]*(1.2+j/N*1.6);
      var nn=1+.07*Math.sin(an2*7+tt2*5)+.05*Math.sin(an2*17-tt2*9)+.03*Math.sin(an2*31),rr2=rad*nn+.9+tt2*.4,px=Math.sin(an2)*rr2,pz=Math.cos(an2)*rr2,tx2=Math.cos(an2),tz2=-Math.sin(an2);
      pos.push(px-tx2*ww,yy,pz-tz2*ww,px+tx2*ww,yy,pz+tz2*ww);uvs.push(0,j/N*.6,1,j/N*.6)}
    for(j=0;j<N;j++){var o2=j*2;ix.push(o2,o2+1,o2+2,o2+1,o2+3,o2+2)}
    var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setIndex(ix);SR.push({g:g})});
  var stM=new T.MeshBasicMaterial({map:sT,color:0xffffff,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,side:T.DoubleSide});var stm=new T.Mesh(mergeG(SR),stM);stm.position.copy(vol.position);add(stm);volOut.stM=stM;
  var cgl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff5a14,transparent:true,opacity:.85,depthWrite:false,blending:T.AdditiveBlending,fog:false}));cgl.scale.set(34,14,1);cgl.position.set(vx,vb+VH+.5,vz+4);add(cgl);volOut.cgl=cgl;
  var cg2=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffb040,transparent:true,opacity:.7,depthWrite:false,blending:T.AdditiveBlending,fog:false}));cg2.scale.set(13,5,1);cg2.position.set(vx,vb+VH+.2,vz+6);add(cg2);volOut.cg2=cg2;
  for(i=0;i<(lite?5:9);i++){var sm=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x2c1c1c,transparent:true,opacity:.6,depthWrite:false,fog:false}));sm.position.set(vx,vb+VH,vz);add(sm);volOut.smk.push({s:sm,ph:i/(lite?5:9),x0:vx,y0:vb+VH+2,z0:vz})}
  /* paredão de pedra com o arco da entrada (o resto da fase segue por dentro) */
  var RK=[],AR=[];
  function blob(arr,x,y,z,s,sy){arr.push({g:xf(new T.DodecahedronGeometry(s,0),[x,y,z],[r()*3,r()*3,r()*3],[1,sy||1,1])})}
  for(var zz=-5.2;zz>-44;zz-=2.6+r()*1.6){var hh=7+r()*6+Math.max(0,(-zz-6))*.35;for(var yy2=0;yy2<hh;yy2+=2.4)blob(RK,xb+.6+r()*2.5+(-zz-5)*.15,yy2+1,zz,1.8+r()*1.3,1.1)}
  for(yy2=0;yy2<6.6;yy2+=1.5){blob(AR,xb+.1,yy2+.7,-4.5,1.15+r()*.3);blob(AR,xb+.3,yy2+.6,2.75,.8+r()*.2,1.1)}
  for(var zl=-4.6;zl<=3;zl+=1.05)blob(AR,xb+.2,7.2+Math.sin((zl+4.6)/7.6*Math.PI)*.8,zl,1.1+r()*.35,.85);
  add(mesh(mergeG(RK.concat(AR)),V.rock,true,true));
  /* tochas no arco */
  [[-3.4]].forEach(function(p){var px=xb-.85,cup=mesh(new T.CylinderGeometry(.16,.09,.22,8),V.chain,false,false);cup.position.set(px,3.9,p[0]);add(cup);
    var fs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffa23a,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.85}));fs.scale.set(.8,1.05,1);fs.position.set(px,4.3,p[0]+.05);add(fs);volOut.tor.push({s:fs,sz:.8});
    var hs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff7a20,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.12}));hs.scale.set(3.5,3.5,1);hs.position.set(px,4.3,p[0]);add(hs)});
  /* árvores queimadas */
  var TR=[];
  function tree(x,z,h,lean){TR.push({g:xf(new T.CylinderGeometry(h*.04,h*.075,h,6,1),[x+lean*h*.5,h/2-.1,z],[0,0,-lean])});
    var nb=4+Math.floor(r()*3);for(var b=0;b<nb;b++){var by=h*(.4+r()*.5),bl=h*(.25+r()*.35),an=(r()<.5?-1:1)*(.5+r()*.8),bx=x+lean*by;
      TR.push({g:xf(new T.CylinderGeometry(h*.01,h*.028,bl,4,1),[bx-Math.sin(an)*bl/2,by+Math.cos(an)*bl/2,z+(r()-.5)*1],[0,0,an])})}}
  tree(xa+5,-7,5.5,.1);tree(xa+21,-9,4.5,-.15);tree(xa+38,-15,6.5,.06);tree(xa-6,-18,7,-.05);tree(xa+14,-27,6,.12);tree(xa+3,3.4,4,-.2);tree(xa+33,3.2,3.2,.25);
  add(mesh(mergeG(TR),M(0x1a1210,.95),true,false));
  /* pedras com rachaduras de lava e fendas que soltam fumaça */
  var RS=[];for(i=0;i<22;i++){var x=xa-10+r()*(w+8),z=-5.5-r()*26;if(inPool(x,z)||onPath(x,z))continue;blob(RS,x,.2,z,.4+r()*.9,.7)}
  for(i=0;i<7;i++){var x3=xa+2+r()*(w-6),z3=2.2+r()*1.2;blob(RS,x3,.05,z3,.25+r()*.35,.7)}
  add(mesh(mergeG(RS),V.rock,true,true));
  var FS=[];[[xa+12,-6.2],[xa+25,-11],[xa+40,-7.5],[xa+17,2.5],[xa+3,-16]].forEach(function(v){if(inPool(v[0],v[1]))return;var ro=r()*3;FS.push({g:xf(new T.PlaneGeometry(.18,2.2+r()*1.4),[v[0],.03,v[1]],[-Math.PI/2,0,ro])});
    for(k=0;k<(lite?1:2);k++){var vs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x6a5a58,transparent:true,opacity:0,depthWrite:false}));add(vs);volOut.vents.push({s:vs,x:v[0],z:v[1],ph:r()+k*.5})}});
  add(mesh(mergeG(FS),new T.MeshBasicMaterial({color:0xff6a14}),false,false));
  /* capim seco */
  var bl=[];function blades(x0,x1,z0,z1,dens){var n=Math.round((x1-x0)*(z1-z0)*dens*q);for(var j=0;j<n;j++){var bx=x0+r()*(x1-x0),bz=z0+r()*(z1-z0);if(onPath(bx,bz)||inPool(bx,bz)||(bz>-1.6&&bz<1.3))continue;bl.push([bx,bz,.25+r()*.45,.1+r()*.05])}}
  blades(xa-4,xb-1,-5,-1.6,6);blades(xa-4,xb-1,1.3,2.6,7);blades(xa-14,xb-2,-14,-5,2.5);
  if(bl.length){var bg=bladeGeo(),gm=grassMat({base:'#0c0806',mid:'#261c12',tip:'#5a4a32',sway:.6});gm.uniforms.time=lushU.time;var im=new T.InstancedMesh(bg,gm,bl.length),ar=new Float32Array(bl.length*3);
    bl.forEach(function(b,j){d.position.set(b[0],.02,b[1]);d.rotation.set(0,r()*6.283,0);d.scale.set(b[3],b[2],b[3]);d.updateMatrix();im.setMatrixAt(j,d.matrix);ar[j*3]=r();ar[j*3+1]=r();ar[j*3+2]=.6+r()*.6});
    bg.setAttribute('aR',new T.InstancedBufferAttribute(ar,3));im.frustumCulled=false;add(im)}
  /* névoa de cinza baixa */
  for(i=0;i<(lite?4:7);i++){var ms=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x5a3a34,transparent:true,depthWrite:false,opacity:.18}));var mw2=10+r()*8;ms.scale.set(mw2,2.4,1);ms.position.set(xa-10+r()*(w+8),.8,-5-r()*14);add(ms)}
}
function lavaStreamTex(){
  /* rio de lava: miolo claro, bordas escuras e pedaços de crosta correndo */
  var c=document.createElement('canvas');c.width=64;c.height=256;var x=c.getContext('2d'),sd=19;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  var g=x.createLinearGradient(0,0,64,0);g.addColorStop(0,'rgba(255,60,0,0)');g.addColorStop(.25,'rgba(255,90,10,.85)');g.addColorStop(.5,'rgba(255,200,90,1)');g.addColorStop(.75,'rgba(255,90,10,.85)');g.addColorStop(1,'rgba(255,60,0,0)');
  x.fillStyle=g;x.fillRect(0,0,64,256);
  for(var i=0;i<70;i++){var px=8+r()*48,py=r()*256,w=3+r()*9,h=4+r()*14;for(var oy=-256;oy<=256;oy+=256){x.fillStyle='rgba(40,8,0,'+(.35+r()*.4)+')';x.beginPath();x.ellipse(px,py+oy,w/2,h/2,0,0,6.283);x.fill()}}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;return t;
}
function updVolcanoOutside(dt){
  var o=volOut;if(!o)return;var near=P.x<o.xb+30;
  if(o.sT)o.sT.offset.y=(o.sT.offset.y+dt*.12)%1;
  o.tor.forEach(function(t,i){var fl=.78+Math.sin(tm*17+i*2.1)*.12+Math.sin(tm*29+i)*.08;t.s.material.opacity=fl;var sz=t.sz*(.9+Math.sin(tm*13+i)*.1);t.s.scale.set(sz,sz*1.3,1)});
  /* o vulcão some devagar depois que o Kuro entra (lá dentro ele fica atrás dos paredões) */
  var fa=clamp((P.x-o.xb-6)/14,0,1),op=1-fa;o.big.forEach(function(m){m.opacity=op;m.depthWrite=op>.99});
  o.stM.opacity=op;o.cgl.visible=o.cg2.visible=op>.01;
  /* ronco do vulcão: treme a tela, a cratera clareia e sobe uma nuvem de cinza */
  if(state==='play'&&P.x<o.xb+4){o.roarT-=dt;if(o.roarT<=0){o.roarT=9+Math.random()*5;o.flash=1;o.puff=1;shake=Math.max(shake,.45);try{sfx.boom()}catch(e){}}}
  o.flash=Math.max(0,o.flash-dt*.7);o.puff=Math.max(0,o.puff-dt*.35);
  o.cgl.material.opacity=(.75+Math.sin(tm*2.3)*.08+o.flash*.25)*op;o.cg2.material.opacity=(.6+o.flash*.4)*op;o.cg2.scale.set(13+o.flash*8,5+o.flash*3,1);
  o.smk.forEach(function(s){var u=(tm*.06*(1+o.puff*1.5)+s.ph)%1,sz=7+u*26+o.puff*10;s.s.visible=near&&op>.01;s.s.position.set(s.x0+u*22+Math.sin(u*5+s.ph*9)*3,s.y0+u*22,s.z0);s.s.scale.set(sz,sz*.8,1);s.s.material.opacity=Math.sin(u*Math.PI)*.62*op});
  o.vents.forEach(function(v){var u=(tm*.35+v.ph)%1;v.s.visible=near;v.s.position.set(v.x+u*.6,.3+u*2.6,v.z);var sz=.5+u*2;v.s.scale.set(sz,sz,1);v.s.material.opacity=Math.sin(u*Math.PI)*.32});
}
var volPortal=null;
function buildFarVolcano(th,r){
  var c=document.createElement('canvas');c.width=8;c.height=512;var x=c.getContext('2d'),g=x.createLinearGradient(0,512,0,0);
  g.addColorStop(0,'#ff6a1a');g.addColorStop(.18,'#c8301a');g.addColorStop(.45,'#7a1a1a');g.addColorStop(.75,'#3a0e18');g.addColorStop(1,'#1a0814');
  x.fillStyle=g;x.fillRect(0,0,8,512);var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;
  var sk=new T.Mesh(new T.PlaneGeometry(900,260),new T.MeshBasicMaterial({map:t,fog:false,depthWrite:false}));sk.position.set(0,70,-260);farG.add(sk);
  /* vulcões ao fundo com lava escorrendo e brilho no topo */
  var i,vm=new T.MeshBasicMaterial({color:0x3a1214,fog:false}),vm2=new T.MeshBasicMaterial({color:0x521a18,fog:false}),lm=new T.MeshBasicMaterial({color:0xff7a1a,fog:false});
  for(i=0;i<9;i++){var h=40+r()*50,rad=30+r()*20,vx=-160+i*50+r()*20,vz=-150-r()*40,cn=new T.Mesh(new T.CylinderGeometry(rad*.18,rad,h,9,1,true),i%2?vm:vm2);cn.position.set(vx,h/2-10,vz);farG.add(cn);
    for(var k=0;k<3;k++){var st=new T.Mesh(new T.PlaneGeometry(1.4,h*.7),lm);st.position.set(vx+(k-1)*rad*.18,h*.55-10-h*.2,vz+rad*.55);st.rotation.z=(k-1)*.25;farG.add(st)}
    var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff6a10,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false,opacity:.8}));gl.scale.set(rad*1.4,rad*.9,1);gl.position.set(vx,h-10,vz+2);farG.add(gl)}
  for(i=0;i<12;i++){var cs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x2a1418,transparent:true,depthWrite:false,fog:false,opacity:.75}));var sz=50+r()*60;cs.scale.set(sz,sz*.35,1);cs.position.set(-170+r()*360,40+r()*60,-140);farG.add(cs)}
}
/* ---------- mecânicas do vulcão ---------- */
function buildVolcanoMech(){
  var V=volMats();volSinks=[];volMovers=[];volEsc=null;
  /* correntes penduradas: plataformas que balançam (usam os 'movers') */
  movers.forEach(function(m){
    m.mesh.material=V.top;
    /* duas correntes grossas presas em argolas nas pontas da plataforma, penduradas numa viga lá em cima */
    var chs=[];for(var c=0;c<2;c++){var ch=mesh(new T.CylinderGeometry(.08,.08,1,6),V.chain,true,false);add(ch);chs.push(ch);
      var rg=mesh(new T.TorusGeometry(.2,.07,6,12),V.chain,false,false);rg.position.set((c?1:-1)*(m.w/2-.35),.42,0);m.mesh.add(rg);
      var pl=mesh(new T.BoxGeometry(.5,.12,.5),V.chain,false,false);pl.position.set((c?1:-1)*(m.w/2-.35),.26,0);m.mesh.add(pl)}
    var hk=mesh(new T.BoxGeometry(m.range*2+m.w+1,.35,.35),V.chain,false,false);hk.position.set(m.cx,m.t+6.6,0);add(hk);
    volMovers.push({m:m,ch:chs});
  });
  /* pedras que afundam na lava */
  (LV.sinks||[]).forEach(function(q){
    var w=q[1]-q[0],cx=(q[0]+q[1])/2,g=new T.Group(),sl=mesh(new T.BoxGeometry(w,.5,2.4),V.top,true,true);sl.position.y=-.25;g.add(sl);
    for(var k=0;k<3;k++){var b=mesh(new T.DodecahedronGeometry(.5,0),V.rock,false,false);b.position.set((k-1)*w*.3,-.6,0);b.scale.set(1.2,.8,1);g.add(b)}
    g.position.set(cx,q[2],0);add(g);
    var so={l:q[0],r:q[1],t:q[2],b:q[2]-.5,oneway:false,flt:true,sink:true};solids.push(so);
    volSinks.push({so:so,g:g,t0:q[2]});
  });
  /* correntes para se pendurar (mesma mecânica dos varais da Vila Ninja) */
  (LV.ropes||[]).forEach(function(q){
    var x0=q[0],x1=q[1],y=q[2],rm=mesh(new T.CylinderGeometry(.06,.06,x1-x0,6),V.chain,false,false);rm.rotation.z=Math.PI/2;rm.position.set((x0+x1)/2,y,0);add(rm);
    var links=[];for(var lx=x0+.3;lx<x1;lx+=.45)links.push({g:xf(new T.TorusGeometry(.12,.035,5,10),[lx,y,0],[0,(links.length%2)*Math.PI/2,0])});add(mesh(mergeG(links),V.chain,false,false));
    [x0,x1].forEach(function(px){var po=mesh(new T.BoxGeometry(.4,y+2,.4),V.rock,true,false);po.position.set(px,(y-2)/2,-.6);add(po)});
    ropes.push({rope:true,x0:x0,x1:x1,y:y});
  });
  /* chuva de pedras de fogo */
  if(LV.meteors){volMet={z:LV.meteors,t:1.5,list:[]};for(var i=0;i<9;i++){var g2=new T.Group(),rk=mesh(metGeo(),metMat(),true,false);rk.scale.setScalar(1.15);g2.add(rk);
      var fl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff7a20,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));fl.scale.set(1.6,2.4,1);fl.position.y=.75;fl.material.opacity=.75;g2.add(fl);g2.visible=false;add(g2);
      var sh=new T.Mesh(new T.RingGeometry(.5,.75,20),new T.MeshBasicMaterial({color:0xff4010,transparent:true,opacity:.7,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.visible=false;add(sh);
      volMet.list.push({g:g2,sh:sh,on:false})}}
  /* fuga da erupção: parede de lava que vem atrás */
  if(LV.escape){var E=LV.escape,wm=fireMat(14,2),wall=new T.Group();[[3.2,1],[-.6,.9],[-5,.8]].forEach(function(z,k){var pl=new T.Mesh(new T.PlaneGeometry(10,34),wm);pl.position.set(-2-k*.6,0,z[0]);pl.frustumCulled=false;wall.add(pl)});wall.visible=false;add(wall);
    var wgl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff6a10,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false,fog:false}));wgl.scale.set(14,22,1);wgl.visible=false;add(wgl);
    volEsc={E:E,on:false,wx:E.w0,wall:wall,gl:wgl,t:0}}
}
function volChains(){
  volMovers.forEach(function(v){var m=v.m,top=m.t+6.6;v.ch.forEach(function(c,k){var off=(k?1:-1)*(m.w/2-.35),ax=m.cx+off,bx=m.x+off,by=m.t+.38,dx=bx-ax,dy=top-by,L=Math.hypot(dx,dy);c.scale.set(1,L,1);c.position.set((ax+bx)/2,(top+by)/2,0);c.rotation.z=Math.atan2(dx,dy)});
    m.mesh.rotation.z=-(m.x-m.cx)*.05});
}
/* topo da primeira coisa sólida abaixo (bloco, plataforma ou chão): a pedra nunca atravessa */
/* pedra de fogo: rocha arroxeada irregular com veios de lava acesos (mais quentes embaixo) */
var metMatC=null,metGeoC=null,metChunkC=null;
function metMat(){
  if(metMatC)return metMatC;
  var S=256,c=document.createElement('canvas');c.width=c.height=S;var x=c.getContext('2d'),e=document.createElement('canvas');e.width=e.height=S;var y=e.getContext('2d');
  var sd=91;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  x.fillStyle='#3a2a36';x.fillRect(0,0,S,S);y.fillStyle='#000';y.fillRect(0,0,S,S);
  var cells=[];for(var i=0;i<26;i++)cells.push([r()*S,r()*S]);
  /* placas de rocha (cada célula uma cor), com luz no alto */
  var img=x.getImageData(0,0,S,S),d=img.data,ed=y.getImageData(0,0,S,S),dd=ed.data,cols=cells.map(function(){var v=38+r()*30;return [v+16,v,v+14]});
  for(var py=0;py<S;py++)for(var px=0;px<S;px++){var b1=1e9,b2=1e9,bi=0;for(var k=0;k<cells.length;k++){for(var ox=-S;ox<=S;ox+=S){var dx=px-cells[k][0]-ox,dy=py-cells[k][1],dd2=dx*dx+dy*dy;if(dd2<b1){b2=b1;b1=dd2;bi=k}else if(dd2<b2)b2=dd2}}
    var edge=Math.sqrt(b2)-Math.sqrt(b1),o=(py*S+px)*4,cc=cols[bi],sh=1.15-Math.sqrt(b1)/90;
    if(edge<4.5){var hot=1-edge/4.5,low=py/S;d[o]=60+hot*120;d[o+1]=20+hot*40;d[o+2]=10;dd[o]=255*hot;dd[o+1]=(110+90*hot*hot)*hot;dd[o+2]=20*hot;dd[o+3]=255}
    else{d[o]=cc[0]*sh;d[o+1]=cc[1]*sh;d[o+2]=cc[2]*sh;dd[o]=0;dd[o+1]=0;dd[o+2]=0;dd[o+3]=255}d[o+3]=255}
  x.putImageData(img,0,0);y.putImageData(ed,0,0);
  var tc=new T.CanvasTexture(c),te=new T.CanvasTexture(e);[tc,te].forEach(function(t){t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding});
  metMatC=new T.MeshStandardMaterial({map:tc,roughness:.75,metalness:.05,emissive:0xff6a14,emissiveMap:te,emissiveIntensity:2.2});return metMatC;
}
function metGeo(){
  if(metGeoC)return metGeoC;
  var g=new T.IcosahedronGeometry(.5,2),p=g.attributes.position,v=new T.Vector3();
  for(var i=0;i<p.count;i++){v.fromBufferAttribute(p,i);var n=1+.13*Math.sin(v.x*9+v.y*5)*Math.cos(v.z*7-v.y*3)+.07*Math.sin(v.x*17+v.z*13);v.multiplyScalar(n);v.y*=.92;p.setXYZ(i,v.x,v.y,v.z)}
  g.computeVertexNormals();metGeoC=g;metChunkC=new T.DodecahedronGeometry(.17,0);return g;
}
function metBreak(x,y){/* a pedra se parte em pedacinhos que pulam e somem */
  metGeo();var mm=metMat();
  for(var i=0;i<(coarse?4:7);i++){var m=mesh(metChunkC,mm,false,false),sc=.6+Math.random()*.9;m.scale.setScalar(sc);m.position.set(x,y+.2,0);add(m);
    var a=Math.random()*Math.PI,sp=2.5+Math.random()*3.5;
    debris.push({m:m,x:x+(Math.random()-.5)*.3,y:y+.25,z:(Math.random()-.5)*.8,vx:Math.cos(a)*sp,vy:3+Math.random()*5,rx:(Math.random()-.5)*14,rz:(Math.random()-.5)*14,t:2.9,rest:false,sc:sc})}
}
function metTop(x,y){var t=-30;for(var i=0;i<solids.length;i++){var q=solids[i];if(q.dead||q.hid||q.wall)continue;if(x>=q.l-.05&&x<=q.r+.05&&q.t<=y&&q.t>t)t=q.t}return t}
function updVolcano(dt){
  lavaU.time.value=tm;updVolcanoOutside(dt);if(volFallT)volFallT.offset.y=(volFallT.offset.y+dt*.7)%1;
  if(volPortal)volPortal.opacity=.6+Math.sin(tm*3)*.2;
  /* correntes acompanham a plataforma que balança */

  /* pedras que afundam: com o Kuro em cima descem até a lava, sem ele sobem de volta */
  volSinks.forEach(function(s){var on=P.onPlat===s.so&&P.grounded,ty=on?(LV.lavaY||-1)-.8:s.t0,sp=on?.55:1.2,ny=s.so.t+clamp(ty-s.so.t,-sp*dt,sp*dt),dy=ny-s.so.t;
    s.so.t=ny;s.so.b=ny-.5;s.g.position.y=ny+Math.sin(tm*3+s.t0)*.02;if(on)P.y+=dy;if(on&&((tm*20)|0)%3===0)emit(sparkPool,s.g.position.x+(Math.random()-.5)*2,ny-.2,1,1.5,.4,.3,.2,1)});
  /* pedras de fogo */
  if(volMet&&state==='play'){var Z=volMet.z;
    if(P.x>Z.x0-4&&P.x<Z.x1+2){volMet.t-=dt;if(volMet.t<=0){volMet.t=.42+Math.random()*.38;var free=volMet.list.filter(function(q){return !q.on})[0];
      /* metade cai perto do Kuro, metade espalhada pelo trecho; para no primeiro bloco/plataforma que encontrar */
      if(free){var tx=Math.random()<.5?clamp(P.x+(Math.random()-.35)*5+P.vx*.45,Z.x0,Z.x1):Z.x0+Math.random()*(Z.x1-Z.x0),sy=P.y+16,gy=metTop(tx,sy);free.on=true;free.x=tx;free.gy=gy;free.y=sy;free.vy=-9;free.g.visible=true;free.sh.visible=true;free.sh.position.set(tx,gy+.04,0)}}}
    volMet.list.forEach(function(q){if(!q.on)return;q.vy-=22*dt;q.y+=q.vy*dt;q.g.position.set(q.x,q.y,0);q.g.children[0].rotation.x+=dt*4;q.g.children[0].rotation.z+=dt*2.5;var k=clamp(1-(q.y-q.gy)/15,0,1);q.sh.scale.setScalar(.6+k*.8);q.sh.material.opacity=.3+k*.6;
      if(state==='play'&&Math.abs(P.x-q.x)<.68&&q.y-.55<P.y+P.h&&q.y+.55>P.y){q.gy=q.y-.3;hurt(q.x,1)}/* a pedra encostou no Kuro: dano e se parte */
      if(q.y<=q.gy+.3){q.on=false;q.g.visible=false;q.sh.visible=false;metBreak(q.x,q.gy);emit(sparkPool,q.x,q.gy+.4,14,4.5,.6,.35,.25,2);emit(dustPool,q.x,q.gy+.3,8,2.6,.6,.6,1.2,-.2);if(Math.abs(P.x-q.x)<12){sfx.boom();shake=Math.max(shake,.2)}
        if(Math.abs(P.x-q.x)<1.0&&q.gy<=P.y+P.h&&q.gy>P.y-.45)hurt(q.x,1)}})}/* embaixo do bloco: a pedra explode em cima e não pega o Kuro */
  else if(volMet)volMet.list.forEach(function(q){q.on=false;q.g.visible=false;q.sh.visible=false});
  /* fuga da erupção */
  if(volEsc){var e=volEsc,E=e.E;
    if(!e.on&&state==='play'&&P.x>E.x0){e.on=true;e.wx=Math.max(E.w0,P.x-13);e.t=0;shake=Math.max(shake,.8);sfx.boom();toast('ERUPÇÃO! Corra até o topo da cratera!');e.wall.visible=true;e.gl.visible=true}
    if(e.on&&P.x<E.x0-6){e.on=false;e.wall.visible=false;e.gl.visible=false}/* voltou ao checkpoint */
    if(e.on){if(state==='play'){e.t+=dt;e.wx+=E.sp*Math.min(1,.4+e.t*.35)*dt}
      e.wall.position.set(e.wx-3,cam.y+2,0);e.gl.position.set(e.wx+.5,cam.y-1,1.5);e.gl.material.opacity=.35+Math.sin(tm*8)*.1;
      if(((tm*30)|0)%2===0)emit(sparkPool,e.wx,1+Math.random()*7,2,4,.5,.4,.3,3);
      if(state==='play'&&P.x<e.wx+.4)fallDeath('A lava alcançou o Kuro! Voltando ao checkpoint.','fall');
      if(state==='play'&&P.x>=LV.goal.x-1){e.wall.visible=false;e.gl.visible=false}}}
}
/* ---------- inimigos do vulcão ---------- */
function makeSalamander(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var sk=M(0xd8401a,.5,0,{emissive:new T.Color(0x5a1000),emissiveIntensity:.6}),bl=M(0x1a1010,.6),bel=M(0xffb030,.6),eyeM=new T.MeshStandardMaterial({color:0x221100,emissive:0xffe04a,emissiveIntensity:1.8});
  var body=mesh(new T.CapsuleGeometry(.22,.7,6,10),sk);body.rotation.x=Math.PI/2;body.position.y=.3;inner.add(body);
  for(var i=0;i<4;i++){var sp=mesh(new T.SphereGeometry(.08,6,5),bl);sp.position.set(0,.5,-.3+i*.2);inner.add(sp)}
  var bel2=mesh(new T.CapsuleGeometry(.16,.6,4,8),bel);bel2.rotation.x=Math.PI/2;bel2.position.y=.2;inner.add(bel2);
  var hd=mesh(new T.SphereGeometry(.22,12,10),sk);hd.scale.set(1,.75,1.2);hd.position.set(0,.36,.58);inner.add(hd);
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.06,8,6),eyeM,false,false);e.position.set(sd*.13,.48,.66);inner.add(e)});
  var tail=mesh(new T.ConeGeometry(.15,.8,8),sk);tail.rotation.x=-Math.PI/2-.2;tail.position.set(0,.3,-.75);inner.add(tail);
  var legs=[],legG=new T.CylinderGeometry(.05,.04,.28,6);legG.translate(0,-.14,0);
  [.28,-.2].forEach(function(z0){[-1,1].forEach(function(sd){var q=new T.Group();q.position.set(sd*.2,.28,z0);q.rotation.z=sd*.7;q.add(mesh(legG,sk));inner.add(q);legs.push({p:q,sd:sd,z:z0,base:sd*.7})})});
  add(g);return {g:g,inner:inner,legs:legs};
}
function makeGolem(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);var V=volMats();
  var body=mesh(new T.DodecahedronGeometry(.6,1),V.rock);body.scale.set(1,1.1,.9);body.position.y=1.0;inner.add(body);
  var hd=mesh(new T.DodecahedronGeometry(.32,0),V.rock);hd.position.set(0,1.75,.15);inner.add(hd);
  var eyeM=new T.MeshStandardMaterial({color:0x200000,emissive:0xff8a20,emissiveIntensity:2.4});
  [-1,1].forEach(function(sd){var e=mesh(new T.BoxGeometry(.1,.05,.05),eyeM,false,false);e.position.set(sd*.11,1.78,.42);inner.add(e)});
  [-1,1].forEach(function(sd){var a=mesh(new T.DodecahedronGeometry(.28,0),V.rock);a.scale.set(.8,1.4,.8);a.position.set(sd*.72,.95,.05);inner.add(a)});
  var legs=[],legG=new T.BoxGeometry(.3,.5,.34);legG.translate(0,-.25,0);
  [0].forEach(function(z0){[-1,1].forEach(function(sd){var q=new T.Group();q.position.set(sd*.28,.5,z0);q.add(mesh(legG,V.rock));inner.add(q);legs.push({p:q,sd:sd,z:sd*.1,base:0})})});
  add(g);return {g:g,inner:inner,legs:legs};
}
function makeLavaBall(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var c=mesh(new T.SphereGeometry(.34,14,10),new T.MeshBasicMaterial({color:0xffb030}),false,false);inner.add(c);
  var c2=mesh(new T.SphereGeometry(.42,14,10),new T.MeshBasicMaterial({color:0xff5010,transparent:true,opacity:.55,depthWrite:false}),false,false);inner.add(c2);
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.07,8,6),new T.MeshBasicMaterial({color:0x2a0800}),false,false);e.position.set(sd*.12,.06,.3);inner.add(e)});
  var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff7a20,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false,opacity:.9}));gl.scale.set(2,2,1);inner.add(gl);
  add(g);return {g:g,inner:inner};
}
function lavaBallAI(e,dt){
  var lY=LV.lavaY||-1;e.tmr+=dt;var cyc=e.cyc||3.4,u=(e.tmr+e.ph)%cyc;
  if(u<1.3){e.y=lY-1.2;e.vy=0;e.noHit=true;e.vis.g.visible=false;if(u>.9&&((tm*30)|0)%3===0)emit(sparkPool,e.x,lY+.1,1,1.6,.4,.3,.2,2)}
  else{if(!e.vis.g.visible){e.vis.g.visible=true;e.y=lY-.4;e.vy=e.jv||12.5;emit(sparkPool,e.x,lY+.2,8,3,.5,.35,.2,2)}
    e.vy-=24*dt;e.y+=e.vy*dt;e.noHit=e.y<lY+.1;if(e.y<lY-1){e.vis.g.visible=false;emit(sparkPool,e.x,lY+.2,6,2.5,.4,.3,.2,2);e.tmr+=cyc-u}}
}
