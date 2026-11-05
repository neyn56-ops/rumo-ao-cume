/*@@parte:30_cenario.js*/
/* ===================== cenário caprichado (Alto, Ultra e Máximo) — grama, copas, céu e detalhes de cada mundo ===================== */
function lushOn(){return +(effCfg().lush||0)}
var LQ=1;
function lushVis(){
  var want=lushOn();
  if(lushG&&want&&lushG.userData.lv!==want){/* trocou entre Médio e Alto: monta de novo no nível certo */
    W.remove(lushG);lushG.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material&&o.material.dispose)o.material.dispose()});
    if(lushSky&&lushSky.parent)lushSky.parent.remove(lushSky);lushG=null;lushSky=null;lushPend=true;
  }
  if(!lushG&&lushPend&&W&&want){lushPend=false;buildLush(curTheme,true)}/* só monta quando o Alto é ligado: Baixo e Médio não pagam nada */
  var on=!!lushG&&!!lushOn();
  if(lushG)lushG.visible=on;if(lushSky)lushSky.visible=on;
  if(tuftMesh&&lushHideTufts)tuftMesh.visible=!on;
  if(broMat&&lushG){broMat.color.setScalar(on&&LQ>=.7?.62:1)}/* com folhas: o miolo da copa vira sombra */
}
function lushTick(){
  lushU.time.value=performance.now()/1000;causU.time.value=lushU.time.value;
  var lq0=+effCfg().lush||0;causU.amt.value=(curTheme.name==='reef'&&(lq0>=.75||(lq0>=.6&&!coarse)))?1.8:0;
  lushU.ps.value=renderer.domElement.height*.5/Math.tan(T.MathUtils.degToRad(camera.fov/2));
  if(lushG&&lushG.visible)for(var i=0;i<lushAnim.length;i++)lushAnim[i](lushU.time.value);
}
function bladeGeo(){
  /* folha curvada e afinando até a ponta; uv.y = altura (0 na base, 1 na ponta) */
  var hs=[0,.28,.55,.8,1],ws=[1,.86,.62,.34,0],pos=[],uv=[],idx=[],i;
  for(i=0;i<hs.length;i++){var h=hs[i],w=.5*ws[i],bz=h*h*.32;
    if(i<hs.length-1){pos.push(-w,h,bz, w,h,bz);uv.push(0,h,1,h)}else{pos.push(0,h,bz);uv.push(.5,h)}}
  for(i=0;i<hs.length-2;i++){var a=i*2;idx.push(a,a+1,a+2, a+1,a+3,a+2)}
  var a2=(hs.length-2)*2;idx.push(a2,a2+1,a2+2);
  var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);
  return g;
}
function grassMat(o){
  o=o||{};
  return new T.ShaderMaterial({
    uniforms:T.UniformsUtils.merge([T.UniformsLib.fog,{cBase:{value:new T.Color(o.base||'#10300a')},cMid:{value:new T.Color(o.mid||'#2e6a14')},cTip:{value:new T.Color(o.tip||'#86c03a')},
      sway:{value:o.sway||1},spd:{value:o.spd||1},glow:{value:o.glow||0},time:{value:0}}]),
    vertexShader:[
      'attribute vec3 aR;uniform float time,sway,spd;varying float vH;varying vec3 vR;',
      '#include <fog_pars_vertex>',
      'void main(){vH=uv.y;vR=aR;',
      'vec4 wp=modelMatrix*instanceMatrix*vec4(position,1.);',
      'float h=uv.y*uv.y,ph=aR.x*6.283,t=time*spd;',
      'float gust=.55+.45*sin(t*.45+wp.x*.045);',
      'wp.x+=(sin(t*1.7+wp.x*.38+wp.z*.21+ph)*.16+.09)*h*gust*aR.z*sway;',
      'wp.z+=cos(t*1.3+wp.x*.27+ph)*.06*h*aR.z*sway;',
      'vec4 mvPosition=viewMatrix*wp;gl_Position=projectionMatrix*mvPosition;',
      '#include <fog_vertex>',
      '}'].join('\n'),
    fragmentShader:[
      'uniform vec3 cBase,cMid,cTip;uniform float glow;varying float vH;varying vec3 vR;',
      '#include <common>',
      '#include <fog_pars_fragment>',
      'void main(){',
      'vec3 c=mix(cBase,cMid,smoothstep(0.,.55,vH));c=mix(c,cTip,smoothstep(.5,1.,vH));',
      'c*=.78+vR.y*.42;c=mix(c,c*vec3(1.18,1.08,.7),step(.86,vR.x)*.6);',
      'c*=.42+.78*vH;',
      'c+=vec3(.05,.07,.0)*smoothstep(.75,1.,vH)+cTip*glow*smoothstep(.6,1.,vH);',
      'gl_FragColor=vec4(c,1.);',
      '#include <tonemapping_fragment>',
      '#include <encodings_fragment>',
      '#include <fog_fragment>',
      '}'].join('\n'),
    side:T.DoubleSide,fog:true
  });
}
/* faixas de chão de cada plataforma (pula paredes das salas, canos e espinhos) */
function lushGround(){
  var out=[],bad=(LV.spikes||[]).map(function(sp){return [sp[0]-.35,sp[1]+.35]});
  (LV.pipes||[]).forEach(function(pp){bad.push([pp.x-.8,pp.x+.8])});
  if(LV.door)bad.push([LV.door.x-1.5,LV.door.x+1.5]);
  LV.solids.forEach(function(sd){var w=sd[1]-sd[0];if(w<.8||sd[5]==='sand'||sd[5]==='stone')return;if(sd[2]>=9.9&&w<4.6&&curTheme.name!=='forest')return;out.push({l:sd[0],r:sd[1],t:sd[2],w:w})});
  return {list:out,ok:function(x){for(var j=0;j<bad.length;j++)if(x>bad[j][0]&&x<bad[j][1])return false;return true}};
}
function grassField(o){
  var r=rnd(o.seed||9091),d=new T.Object3D(),q=(coarse?.55:1)*(LQ<.6?.45:(LQ<.7?.52:(LQ<1?.6:1))),bl=[],G=lushGround();
  G.list.forEach(function(sd){
    var bands=o.bands;
    if(o.forest&&sd.w<=4.6){/* tronco-pilar da floresta: grama em volta do topo */
      var rad=sd.w/2,n=Math.round(rad*rad*3.14*(o.pDens||22)*q);
      for(var j=0;j<n;j++){var a=r()*6.283,rr=Math.sqrt(r())*rad*1.05,x=(sd.l+sd.r)/2+Math.cos(a)*rr,z=-.2+Math.sin(a)*rr;
        var nearPath=Math.abs(z)<.7;bl.push([x,sd.t-.06,z,nearPath?.12+r()*.12:.25+r()*.35,o.wid[0]+r()*(o.wid[1]-o.wid[0])])}
      return;
    }
    bands.forEach(function(bd){var n=Math.round(sd.w*(bd[1]-bd[0])*bd[2]*q);
      for(var j=0;j<n;j++){var x=sd.l+.08+r()*(sd.w-.16);if(!G.ok(x))continue;bl.push([x,sd.t-.02,bd[0]+r()*(bd[1]-bd[0]),bd[3]+r()*(bd[4]-bd[3]),o.wid[0]+r()*(o.wid[1]-o.wid[0])])}});
  });
  if(o.back){var B=o.back,xe=sceneEnd()-15,bq=LQ<.6?.4:(LQ<1?.5:1),zEnd=LQ<.6?Math.max(B.z1,-11):(LQ<.7?Math.max(B.z1,-16):B.z1);/* no Médio: só o campo mais perto */
    for(var z=-5.2;z>zEnd;z-=.5){
      var far=coarse&&z<-8,fw=far?1.35:1,dens=(z>-12?B.dens:B.dens*.6)*q*bq*(far?.55:1),stp=1/Math.max(.2,dens*.5);/* celular: capim do fundo mais ralo e um pouco mais largo (de longe parece igual) */
      for(var x=-24;x<xe;x+=stp*(.5+r())){var zz=z-r()*.5;if(o.noSand&&mY(x,zz)<-.25)continue;bl.push([x,mY(x,zz)-.04,zz,B.h0+r()*(B.h1-B.h0),(B.w0+r()*(B.w1-B.w0))*fw])}
    }
  }
  if(!bl.length)return null;
  var bg=bladeGeo(),gm=grassMat(o.mat);gm.uniforms.time=lushU.time;
  var im=new T.InstancedMesh(bg,gm,bl.length),ar=new Float32Array(bl.length*3);
  for(var i=0;i<bl.length;i++){var b=bl[i];
    d.position.set(b[0],b[1],b[2]);d.rotation.set(0,r()*6.283,0);d.scale.set(b[4],b[3],b[4]);d.updateMatrix();im.setMatrixAt(i,d.matrix);
    ar[i*3]=r();ar[i*3+1]=r();ar[i*3+2]=.6+r()*.6;
  }
  bg.setAttribute('aR',new T.InstancedBufferAttribute(ar,3));
  im.frustumCulled=false;lushG.add(im);return im;
}
/* partículas que brilham: vaga-lumes, poeira, brasas, cintilar da neve */
function motes(o){
  var r=rnd(o.seed||71),n=Math.round(o.n*(coarse?.6:1)*(LQ<.6?.55:(LQ<1?.7:1))),pos=new Float32Array(n*3),ar=new Float32Array(n*3),i,G=o.ground?lushGround():null;
  for(i=0;i<n;i++){
    var x,y,z;
    if(G){var sd=G.list[Math.floor(r()*G.list.length)];x=sd.l+r()*sd.w;y=sd.t+o.y0+r()*(o.y1-o.y0);z=o.z0+r()*(o.z1-o.z0)}
    else{x=o.x0+r()*(o.x1-o.x0);y=o.y0+r()*(o.y1-o.y0);z=o.z0+r()*(o.z1-o.z0)}
    pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;ar[i*3]=r();ar[i*3+1]=r();ar[i*3+2]=r();
  }
  var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('aR',new T.BufferAttribute(ar,3));
  var m=new T.ShaderMaterial({
    uniforms:{time:lushU.time,ps:lushU.ps,col:{value:new T.Color(o.color)},size:{value:o.size||.12},drift:{value:o.drift||0},rise:{value:o.rise||0},span:{value:(o.y1-o.y0)||1},tw:{value:o.tw||0},op:{value:o.op||1}},
    vertexShader:[
      'attribute vec3 aR;uniform float time,ps,size,drift,rise,span,tw;varying float vA;',
      'void main(){vec3 p=position;float ph=aR.x*6.283;',
      'p.x+=sin(time*(.3+aR.y*.4)+ph)*drift;p.z+=cos(time*(.25+aR.z*.3)+ph*1.3)*drift*.6;p.y+=sin(time*(.5+aR.z*.5)+ph*2.)*drift*.5;',
      'if(rise>0.){p.y=position.y-span*.5+mod(position.y+time*rise*(.6+aR.y*.8),span);vA=sin(3.1416*clamp((p.y-position.y+span*.5)/span,0.,1.));}else vA=1.;',
      'vA*=mix(1.,pow(.5+.5*sin(time*(1.5+aR.y*3.)+ph*3.),3.),tw);',
      'vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;',
      'gl_PointSize=2.6*size*(.6+aR.z*.8)*ps/max(.5,-mv.z);}'].join('\n'),
    fragmentShader:[
      'uniform vec3 col;uniform float op;varying float vA;',
      'void main(){vec2 q=gl_PointCoord-.5;float d=dot(q,q)*4.;float a=exp(-d*3.5)*vA*op;if(a<.01)discard;gl_FragColor=vec4(col*a,a);}'].join('\n'),
    transparent:true,depthWrite:false,blending:T.AdditiveBlending
  });
  var pts=new T.Points(g,m);pts.frustumCulled=false;lushG.add(pts);return pts;
}
/* raios de luz inclinados (floresta e recife) */
function lightRays(o){
  var r=rnd(o.seed||5),c=document.createElement('canvas');c.width=64;c.height=128;var x=c.getContext('2d');
  var gx=x.createLinearGradient(0,0,64,0);gx.addColorStop(0,'rgba(255,255,255,0)');gx.addColorStop(.5,'rgba(255,255,255,1)');gx.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=gx;x.fillRect(0,0,64,128);x.globalCompositeOperation='destination-in';
  var gy=x.createLinearGradient(0,0,0,128);gy.addColorStop(0,'rgba(255,255,255,1)');gy.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gy;x.fillRect(0,0,64,128);
  var tex=new T.CanvasTexture(c),xe=sceneEnd()-20;
  for(var X=o.x0||-10;X<xe;X+=o.gap*(.7+r()*.6)){
    var mat=new T.MeshBasicMaterial({map:tex,color:o.color,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:0,side:T.DoubleSide});
    var w=o.w0+r()*(o.w1-o.w0),pl=new T.Mesh(new T.PlaneGeometry(w,o.h),mat);
    pl.position.set(X,o.y,o.z0+r()*(o.z1-o.z0));pl.rotation.z=o.tilt;lushG.add(pl);
    (function(m,ph,base){lushAnim.push(function(t){m.opacity=base*(.55+.45*Math.sin(t*.35+ph))})})(mat,r()*6.28,o.op*(.6+r()*.4));
  }
}
function skyGlow(col,op,x,y){
  if(!farG)return;
  lushSky=lushSky||new T.Group();
  var gs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:col,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:op}));
  gs.scale.set(70,70,1);gs.position.set(x,y,-120);lushSky.add(gs);
  var gs2=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:op}));
  gs2.scale.set(14,14,1);gs2.position.set(x,y,-119);lushSky.add(gs2);
  if(!lushSky.parent)farG.add(lushSky);
}
function horizonHaze(rgb,op){
  if(!farG)return;lushSky=lushSky||new T.Group();
  var hc=document.createElement('canvas');hc.width=8;hc.height=128;var hx=hc.getContext('2d'),hg=hx.createLinearGradient(0,0,0,128);
  hg.addColorStop(0,'rgba('+rgb+',0)');hg.addColorStop(.6,'rgba('+rgb+','+op+')');hg.addColorStop(1,'rgba('+rgb+',0)');hx.fillStyle=hg;hx.fillRect(0,0,8,128);
  var hz=new T.Mesh(new T.PlaneGeometry(600,26),new T.MeshBasicMaterial({map:new T.CanvasTexture(hc),transparent:true,depthWrite:false,fog:false}));
  hz.position.set(0,6,-100);lushSky.add(hz);if(!lushSky.parent)farG.add(lushSky);
}
function leafTex(){
  /* tufo de folhas em leque (branco-esverdeado, a cor vem de cada cartão) */
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d'),r=rnd(4242);
  for(var i=0;i<26;i++){
    var a=-Math.PI/2+(r()-.5)*2.6,dist=8+r()*34,px=64+Math.cos(a)*dist*.9,py=78+Math.sin(a)*dist,l=24+r()*14,w=l*.4,g=Math.round(150+r()*105);
    x.save();x.translate(px,py);x.rotate(a+Math.PI/2+(r()-.5)*.5);
    var gr=x.createLinearGradient(0,-l/2,0,l/2);gr.addColorStop(0,'rgb('+g+','+g+','+Math.round(g*.8)+')');gr.addColorStop(1,'rgb('+Math.round(g*.6)+','+Math.round(g*.66)+','+Math.round(g*.5)+')');
    x.fillStyle=gr;x.beginPath();x.moveTo(0,-l/2);x.quadraticCurveTo(w,0,0,l/2);x.quadraticCurveTo(-w,0,0,-l/2);x.fill();
    x.restore();
  }
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=8;return t;
}
function leafCanopies(){
  /* folhas deitadas sobre os cachos, apontando para fora, sobrepostas como escamas e balançando com o vento */
  if(!lastBro||!lastBro.length)return;
  var r=rnd(77),d=new T.Object3D(),col=new T.Color(),k,nrm=new T.Vector3(),up=new T.Vector3(0,0,1),q1=new T.Quaternion(),q2=new T.Quaternion();
  var lm=new T.MeshStandardMaterial({map:leafTex(),alphaTest:.5,side:T.DoubleSide,roughness:.8,metalness:0});matReg.push(lm);
  lm.onBeforeCompile=function(sh){sh.uniforms.time=lushU.time;
    sh.vertexShader='uniform float time;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nvec3 ip=instanceMatrix[3].xyz;float wv=sin(time*1.6+ip.x*.7+ip.y*1.3)*.06+sin(time*2.7+ip.z*2.1)*.03;transformed.x+=wv*(position.y+.5);transformed.z+=wv*.5;\n#endif')};
  var dens=(coarse?28:46)*(LQ<1?.75:1),tot=0;
  lastBro.forEach(function(t){(t.blobs||[]).forEach(function(b){tot+=Math.round(dens*b[3]*b[3])})});
  var cards=new T.InstancedMesh(new T.PlaneGeometry(1,1),lm,Math.max(1,tot)),n=0;
  lastBro.forEach(function(t){
    (t.blobs||[]).forEach(function(b,bi){
      var np=Math.round(dens*b[3]*b[3]);
      for(k=0;k<np&&n<cards.count;k++){
        var u=r()*2-1,a=r()*6.283,rr=Math.sqrt(1-u*u);
        if(bi===0&&Math.abs(u)<.5&&r()<.6)continue;/* miolo: quase tudo escondido pelos cachos */
        nrm.set(Math.cos(a)*rr,u,Math.sin(a)*rr);
        d.position.set(b[0]+nrm.x*b[3]*.98,b[1]+nrm.y*b[4]*.98,b[2]+nrm.z*b[5]*.98);
        nrm.y+=.35;nrm.normalize();/* folhas apontam para fora e um pouco para cima */
        q1.setFromUnitVectors(up,nrm);q2.setFromAxisAngle(nrm,r()*6.283);d.quaternion.copy(q2.multiply(q1));
        var sc=(.75+r()*.5)*t.s;d.scale.set(sc,sc,sc);d.updateMatrix();cards.setMatrixAt(n,d.matrix);
        var hgt=clamp((d.position.y-(t.y+2.2*t.s))/(2.4*t.s),0,1);
        cards.setColorAt(n,hsl(col,.24+r()*.06,.5+r()*.15,.2+hgt*.22+r()*.08));n++;
      }
    });
  });
  cards.count=n;cards.castShadow=true;lushG.add(cards);
}
/* cogumelos que brilham (caverna) */
function glowShrooms(){
  var r=rnd(808),G=lushGround(),list=[],d=new T.Object3D(),col=new T.Color();
  G.list.forEach(function(sd){var n=Math.round(sd.w*(coarse?.35:.6));
    for(var j=0;j<n;j++){var cx=sd.l+.3+r()*(sd.w-.6);if(!G.ok(cx))continue;var cz=r()<.7?-4.4+r()*3:1.05+r()*.65,k=2+Math.floor(r()*4),hue=r()<.5?.52+r()*.06:.78+r()*.08;
      for(var m=0;m<k;m++)list.push({x:cx+(r()-.5)*.7,y:sd.t,z:cz+(r()-.5)*.5,s:.12+r()*.22,hue:hue})}});
  if(!list.length)return;
  var stemG=new T.CylinderGeometry(.14,.2,1,6);stemG.translate(0,.5,0);
  var capG=new T.SphereGeometry(1,12,6,0,6.283,0,1.6);
  var st=new T.InstancedMesh(stemG,M(0xd8d0e8,.7),list.length),cp=new T.InstancedMesh(capG,new T.MeshBasicMaterial({color:0xffffff}),list.length);
  list.forEach(function(q,i){
    d.position.set(q.x,q.y,q.z);d.rotation.set((r()-.5)*.3,0,(r()-.5)*.3);d.scale.set(q.s,q.s*2.4,q.s);d.updateMatrix();st.setMatrixAt(i,d.matrix);
    d.position.set(q.x,q.y+q.s*2.3,q.z);d.scale.set(q.s*1.9,q.s*1.1,q.s*1.9);d.updateMatrix();cp.setMatrixAt(i,d.matrix);
    cp.setColorAt(i,hsl(col,q.hue,.9,.55+r()*.15));
  });
  lushG.add(st);lushG.add(cp);
}
/* pingentes de gelo na borda das plataformas (montanha) */
function icicles(){
  var r=rnd(919),d=new T.Object3D(),list=[];
  LV.solids.forEach(function(sd){var w=sd[1]-sd[0];if(w<1||(sd[2]>=9.9&&w<4.6))return;
    for(var x=sd[0]+.2;x<sd[1]-.2;x+=.3+r()*.7)list.push([x,sd[2]-.32,1.82+r()*.04,.25+r()*.7*(r()<.3?1.6:1)])});
  (LV.floats||[]).forEach(function(f){for(var x=f[0]+.15;x<f[1]-.15;x+=.25+r()*.5)list.push([x,f[2]-.5,(r()-.5)*2.6,.2+r()*.55])});
  if(!list.length)return;
  var g=new T.ConeGeometry(.07,1,6);g.rotateX(Math.PI);g.translate(0,-.5,0);
  var m=new T.MeshStandardMaterial({color:0xd8f2ff,roughness:.12,metalness:0,emissive:0x4a7aa8,emissiveIntensity:.35,transparent:true,opacity:.92});matReg.push(m);
  var im=new T.InstancedMesh(g,m,list.length);
  list.forEach(function(q,i){d.position.set(q[0],q[1],q[2]);d.rotation.set(0,r()*6,0);var w=.7+r()*.8;d.scale.set(w,q[3],w);d.updateMatrix();im.setMatrixAt(i,d.matrix)});
  lushG.add(im);
}
function buildLush(th,now){
  var LIST=['valley','forest','cave','reef','castle','peaks','ruins','heights','volcano','trail'];
  if(LIST.indexOf(th.name)<0||th.dry)return;/* região seca da mina: sem grama */
  if(!now&&!lushOn()){lushPend=true;return}
  lushG=new T.Group();add(lushG);lushAnim=[];lushHideTufts=false;LQ=lushOn()||1;lushG.userData.lv=LQ;var lite=LQ<.7;
  var xe=sceneEnd();
  if(th.name==='volcano'){
    motes({n:lite?300:700,x0:-10,x1:xe,y0:-1,y1:30,z0:-9,z1:2.5,color:0xff9a3a,size:.08,drift:1.6,tw:1});
    motes({n:lite?80:200,x0:-10,x1:xe,y0:-1,y1:6,z0:-6,z1:2,color:0xffe08a,size:.05,drift:2.2,tw:1,seed:7});
    return;
  }
  if(th.name==='heights'){
    lushHideTufts=true;
    grassField({bands:[[-4.9,-.95,26,.36,.8],[-.95,.75,4,.12,.22],[.75,1.85,26,.22,.4]],wid:[.11,.16],mat:{base:'#1a4a10',mid:'#3c9a24',tip:'#a6e050'}});
    motes({n:200,x0:-2,x1:24,y0:0,y1:135,z0:-6,z1:2,color:0xfff6d0,size:.06,drift:.6,op:.55});
    lushVis();splitInstIn(lushG);return;
  }
  if(th.name==='trail'){
    lushHideTufts=true;
    grassField({bands:[[-4.95,-.95,30,.42,.95],[-.95,.75,5,.14,.26],[.75,1.85,28,.24,.42]],wid:[.11,.16],back:{z1:-24,dens:6,h0:.7,h1:1.25,w0:.2,w1:.3},mat:{base:'#14400c',mid:'#3c962a',tip:'#b4ea5a'},seed:1212,noSand:true});
    if(LQ>=.7)leafCanopies();
    skyGlow(0xfff1c8,.85,-8,30);horizonHaze('255,248,232',.5);
    motes({n:220,x0:14,x1:xe,y0:.4,y1:6,z0:-6,z1:1.5,color:0xfff6c0,size:.06,drift:.7,op:.6});
    if(!lite)lightRays({x0:20,gap:11,w0:2,w1:4.5,h:30,y:10,z0:-9,z1:-4,tilt:-.36,color:0xfff2c0,op:.22});
    lushVis();splitInstIn(lushG);return;
  }
  if(th.name==='valley'){
    lushHideTufts=true;
    grassField({bands:[[-4.95,-.95,32,.42,.95],[-.95,.75,5,.14,.26],[.75,1.85,30,.24,.42]],wid:[.11,.16],back:{z1:-24,dens:7,h0:.7,h1:1.2,w0:.2,w1:.3}});
    if(LQ>=.7)leafCanopies();
    skyGlow(0xfff1c8,.85,-8,30);horizonHaze('255,244,225',.55);
    motes({n:160,x0:-10,x1:xe,y0:.4,y1:5,z0:-6,z1:1.5,color:0xfff6d0,size:.05,drift:.6,op:.55});/* polen no ar */
  }else if(th.name==='forest'){
    grassField({forest:true,bands:[[-1.45,-.6,34,.35,.7],[-.6,.6,4,.1,.2],[.6,1.45,30,.2,.38]],wid:[.1,.15],pDens:26,
      mat:{base:'#0b3010',mid:'#24802a',tip:'#9ee05a'}});
    motes({n:1000,x0:-20,x1:xe,y0:-1,y1:11,z0:-6,z1:2,color:0xd8ff7a,size:.14,drift:.9,tw:1});/* vaga-lumes */
    if(!lite)lightRays({gap:9,w0:2,w1:5,h:34,y:10,z0:-10,z1:-4,tilt:-.38,color:0xfff2b8,op:.3});
  }else if(th.name==='cave'){
    grassField({bands:[[-4.8,-3.2,5,.25,.6]],wid:[.22,.34],mat:{base:'#0e2a0a',mid:'#24601a',tip:'#5ea040',sway:.5,spd:.6},seed:41});/* plantinhas verdes */
    motes({n:380,x0:-10,x1:xe,y0:0,y1:13,z0:-12,z1:2,color:0x8fd0ff,size:.08,drift:.7,tw:.7});/* poeira de cristal */
    motes({n:160,x0:-10,x1:xe,y0:0,y1:8,z0:-6,z1:2,color:0xffd8a8,size:.05,drift:.9,op:.45,seed:12});/* poeira quente no ar */
  }else if(th.name==='reef'){
    grassField({bands:[[-4.9,-2.6,3.2,1.2,2.9],[1.2,1.85,1.2,.3,.6]],wid:[.3,.48],back:{z1:-18,dens:.9,h0:1.6,h1:3.6,w0:.4,w1:.6},
      mat:{base:'#0c2a24',mid:'#1f6a5a',tip:'#5fb4a0',sway:2.4,spd:.45},seed:31});/* algas que ondulam */
    if(!lite)lightRays({gap:5,w0:2,w1:6.5,h:32,y:4,z0:-10,z1:-2,tilt:-.16,color:0xd8fbff,op:.34});
    motes({n:380,x0:-10,x1:xe,y0:-2,y1:9,z0:-10,z1:2,color:0xe8fbff,size:.05,drift:.7,op:.6});/* partículas na água */
    if(LV.water){var wt=LV.water.top;motes({n:lite?120:260,x0:LV.water.x0,x1:LV.water.x1,y0:wt-2.4,y1:wt-.15,z0:-6,z1:2.2,color:0xffffff,size:.11,drift:.35,op:.7,seed:77})}/* bolhas logo abaixo da superfície */
  }else if(th.name==='castle'){
    motes({n:900,x0:-10,x1:xe,y0:0,y1:12,z0:-6,z1:2,color:0xffd8a0,size:.06,drift:.7,op:.55});/* poeira dourada */
    motes({n:320,x0:-10,x1:xe,y0:0,y1:9,z0:-6.4,z1:-3,color:0xff8a3a,size:.09,rise:.55,drift:.25,seed:44});/* brasas subindo */
  }else if(th.name==='peaks'){
    icicles();
    motes({n:900,ground:true,y0:.02,y1:.08,z0:-4.8,z1:1.8,color:0xffffff,size:.07,tw:1,seed:23});/* neve cintilando */
    skyGlow(0xe8f2ff,.55,-14,32);horizonHaze('235,242,255',.45);
  }else if(th.name==='ruins'){
    lushHideTufts=true;
    grassField({bands:[],wid:[.08,.12],back:{z1:-20,dens:1.4,h0:.35,h1:.8,w0:.12,w1:.18},
      mat:{base:'#5a4418',mid:'#b08a3a',tip:'#f2dc94',sway:1.3},seed:57});/* capim seco só nas dunas do fundo, nada em cima das pedras */
    skyGlow(0xffd6a0,.8,-10,26);horizonHaze('255,214,160',.5);
    motes({n:260,x0:-10,x1:xe,y0:0,y1:7,z0:-7,z1:2,color:0xffe0a8,size:.05,drift:1.1,op:.55});
  }
  lushVis();splitInstIn(lushG);/* capim por pedaços: o celular só desenha o que está perto da câmera */
}
function buildDecorRuins(th){
  var r=rnd(4177),dummy=new T.Object3D(),col=new T.Color(),i,x;
  /* cactos de verdade: tronco com gomos, topo arredondado e braços que sobem (3 modelos) */
  function cacGeo(arms){
    var parts=[],m4=new T.Matrix4();
    function rib(g){var p=g.attributes.position;for(var i=0;i<p.count;i++){var x=p.getX(i),z=p.getZ(i),a=Math.atan2(z,x),f=1+.13*Math.cos(a*8);p.setX(i,x*f);p.setZ(i,z*f)}return g}
    function cyl(rad,h,x,y,rz){var g=rib(new T.CylinderGeometry(rad,rad,h,16,3,true));if(rz){g.rotateZ(rz)}g.translate(x,y,0);parts.push(g)}
    function cap(rad,x,y){var g=rib(new T.SphereGeometry(rad,16,6,0,6.283,0,Math.PI/2));g.translate(x,y,0);parts.push(g)}
    function knee(rad,x,y){var g=new T.SphereGeometry(rad*1.08,12,8);g.translate(x,y,0);parts.push(g)}
    cyl(.32,2.3,0,1.15);cap(.32,0,2.3);
    arms.forEach(function(A){var sd=A[0],y=A[1],h=A[2],ex=.72*sd;
      cyl(.2,.5,ex*.62,y,Math.PI/2);knee(.2,ex,y);cyl(.2,h,ex,y+h/2);cap(.2,ex,y+h)});
    var pos=[];parts.forEach(function(g){var n=g.index?g.toNonIndexed():g;var a=n.attributes.position.array;for(var i=0;i<a.length;i++)pos.push(a[i])});
    var out=new T.BufferGeometry();out.setAttribute('position',new T.Float32BufferAttribute(pos,3));out.computeVertexNormals();return out;
  }
  var CV=[cacGeo([]),cacGeo([[1,.95,.85]]),cacGeo([[1,1.05,.8],[-1,1.35,.6]])],cacL=[[],[],[]];
  for(x=-20;x<230;x+=3.4+r()*4.2){
    var zt=-7-r()*26,s2=.75+r()*.8,y=mY(x,zt)-.1,v=r()<.25?0:(r()<.5?1:2);
    cacL[v].push({x:x,y:y,z:zt,s:s2,rot:(r()-.5)*1.2});
  }
  var cacM=M(0xffffff,.82,0,{flatShading:true});
  CV.forEach(function(g,vi){var L=cacL[vi];if(!L.length)return;var cm=inst(g,cacM,L.length,true);
    L.forEach(function(q,k){dummy.position.set(q.x,q.y,q.z);dummy.rotation.set(0,q.rot,0);dummy.scale.set(q.s,q.s,q.s);dummy.updateMatrix();cm.setMatrixAt(k,dummy.matrix);cm.setColorAt(k,hsl(col,.3+r()*.05,.38+r()*.12,.24+r()*.07))});
    add(cm)});
  var cols=[];
  for(x=-12;x<80;x+=6+r()*7){var tt=topAt(x);if(tt<-90)continue;cols.push({x:x,y:tt,z:-3.3-r()*2.2,h:1.2+r()*2.6,tilt:(r()-.5)*.25})}
  cols=[];/* sem colunas-toco no deserto (pareciam troncos de árvore) */
  if(cols.length){
    var pg=new T.CylinderGeometry(.42,.5,1,10);pg.translate(0,.5,0);
    var pc=inst(pg,sandBlkM,cols.length,true);
    cols.forEach(function(q,k){dummy.position.set(q.x,q.y,q.z);dummy.rotation.set(0,0,q.tilt);dummy.scale.set(1,q.h,1);dummy.updateMatrix();pc.setMatrixAt(k,dummy.matrix);pc.setColorAt(k,hsl(col,.1,.5,.66))});
    add(pc);
    var cp2=inst(new T.BoxGeometry(1.1,.3,1.1),sandBlkM,cols.length,true);
    cols.forEach(function(q,k){dummy.position.set(q.x,q.y+q.h+.1,q.z);dummy.rotation.set(0,r()*3,q.tilt);dummy.scale.set(1,1,1);dummy.updateMatrix();cp2.setMatrixAt(k,dummy.matrix);cp2.setColorAt(k,hsl(col,.1,.5,.68))});
    add(cp2);
  }
  var rocks=[];
  for(i=0;i<40;i++){var rx=-10+r()*220,rz=-3.5-r()*30;rocks.push({x:rx,y:mY(rx,rz),z:rz,s:.5+r()*1.3})}
  var rm=inst(new T.IcosahedronGeometry(1,0),M(0xffffff,.9,0,{flatShading:true}),rocks.length,true);
  rocks.forEach(function(q,k){dummy.position.set(q.x,q.y+q.s*.25,q.z);dummy.rotation.set(r()*3,r()*6,r()*3);dummy.scale.set(q.s*(1+r()*.5),q.s*(.6+r()*.3),q.s*(1+r()*.4));dummy.updateMatrix();rm.setMatrixAt(k,dummy.matrix);rm.setColorAt(k,hsl(col,.09+r()*.03,.4,.5+r()*.1))});
  add(rm);
}
function buildFarRuins(th,r){
  var i;
  for(i=-6;i<=6;i++){
    var dg=new T.SphereGeometry(40,16,8,0,6.283,0,1.57);
    var dm=new T.Mesh(dg,new T.MeshStandardMaterial({color:new T.Color().setHSL(.09+r()*.02,.5,.52+r()*.1),roughness:1,flatShading:true}));
    dm.scale.set(1+r()*.6,.3+r()*.25,.5);dm.position.set(i*38+(r()-.5)*12,-9,-96-r()*18);farG.add(dm);
  }
  [[-70,-118,30],[40,-130,38],[150,-112,26],[-190,-128,34]].forEach(function(q){
    var pg=new T.ConeGeometry(q[2],q[2]*1.1,4,1);pg.rotateY(Math.PI/4);
    var pm=new T.Mesh(pg,new T.MeshStandardMaterial({color:0xcc9a5e,roughness:1,flatShading:true}));pm.position.set(q[0],-8+q[2]*.55,q[1]);farG.add(pm);
  });
  var cc=document.createElement('canvas');cc.width=256;cc.height=128;var cx=cc.getContext('2d');
  for(i=0;i<12;i++){var bx=40+r()*176,by=44+r()*40,br=22+r()*26,gr=cx.createRadialGradient(bx,by,0,bx,by,br);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=gr;cx.fillRect(0,0,256,128)}
  var ct=new T.CanvasTexture(cc);ct.encoding=T.sRGBEncoding;
  for(i=0;i<22;i++){
    var cs=new T.Sprite(new T.SpriteMaterial({map:ct,transparent:true,opacity:.6,depthWrite:false,color:0xffd9a8}));
    cs.scale.set(46+r()*30,20+r()*10,1);cs.position.set(-200+r()*420,8+r()*80,-90-r()*30);cs.userData.drift=.3+r()*.5;farG.add(cs);
  }
  var gc=document.createElement('canvas');gc.width=gc.height=128;var gx=gc.getContext('2d'),gg=gx.createRadialGradient(64,64,0,64,64,64);
  gg.addColorStop(0,'rgba(255,240,200,1)');gg.addColorStop(.3,'rgba(255,190,100,.6)');gg.addColorStop(1,'rgba(255,150,60,0)');gx.fillStyle=gg;gx.fillRect(0,0,128,128);
  var glow=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(gc),transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));
  glow.scale.set(130,130,1);glow.position.set(-40,26,-125);farG.add(glow);
}
function buildRuinsExtra(){
  var S0=LV.sand;if(!S0)return;
  var w=S0.x1-S0.x0,cx=(S0.x0+S0.x1)/2,h=S0.top+18;
  var bg=new T.PlaneGeometry(w+40,h,1,1),uv=bg.attributes.uv;for(var i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*(w+40)/4,uv.getY(i)*h/4);
  var bw=mesh(bg,ruinWallM,false,true);bw.position.set(cx,h/2-2,-4.4);add(bw);
  var bandG=new T.BoxGeometry(w+40,.34,.16),bandM=M(0x5a3a1a,.8),gold=M(0xe0b050,.4,.6);
  for(var y=2;y<h-3;y+=4.4){var b=mesh(bandG,bandM,false,false);b.position.set(cx,y,-4.3);add(b);
    for(var gx=S0.x0+2;gx<S0.x1-1;gx+=4.4){var g2=mesh(new T.BoxGeometry(.5,.5,.18),gold,false,false);g2.position.set(gx+((y*7)%2),y+.7,-4.3);add(g2)}}
  sandS.flames=[];
  var glT=softSprite();
  for(var ty=5;ty<S0.top+10;ty+=9){
    [S0.x0+.8,S0.x1-.8].forEach(function(tx){
      var br=mesh(new T.BoxGeometry(.18,.5,.3),M(0x3a2a1a,.8),false,false);br.position.set(tx,ty,-1.2);add(br);
      var fl=mesh(new T.SphereGeometry(.2,8,6),new T.MeshBasicMaterial({color:0xffa030}),false,false);fl.scale.set(.8,1.5,.8);fl.position.set(tx,ty+.55,-1.2);add(fl);
      var gs=new T.Sprite(new T.SpriteMaterial({map:glT,color:0xff8a30,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.7}));gs.scale.set(3.2,3.2,1);gs.position.set(tx,ty+.6,-.9);add(gs);
      sandS.flames.push({f:fl,g:gs,ph:Math.random()*6});
    });
  }
}
function buildFar(th){
  farG=new T.Group();scene.add(farG);
  var r=rnd(5+LV.theme),i;
  if(th.name==='maze'||th.name==='wreck')return;/* Labirinto: fundo escuro, sem montanhas; Naufrágio: horizonte de mar */
  if(th.name==='castle'){buildFarCastle(th,r);return}
  if(th.name==='village'){buildFarVillage(th,r);return}
  if(th.name==='heights'){buildFarHeights(th,r);return}
  if(th.name==='volcano'){buildFarVolcano(th,r);return}
  if(th.name==='summit'){buildFarSummit(th,r);return}
  if(th.name==='sky'){buildFarSky(th,r);return}
  if(th.name==='tower'){buildFarTower(th,r);return}
  if(th.name==='mine'){buildFarMine(th,r);return}
  if(th.name==='ruins'){buildFarRuins(th,r);return}
  if(th.name==='forest'){
    var gc3=document.createElement('canvas');gc3.width=gc3.height=128;
    var gx3=gc3.getContext('2d'),gg3=gx3.createRadialGradient(64,64,0,64,64,64);
    gg3.addColorStop(0,'rgba(255,248,220,1)');gg3.addColorStop(.25,'rgba(255,240,180,.5)');gg3.addColorStop(1,'rgba(255,230,160,0)');
    gx3.fillStyle=gg3;gx3.fillRect(0,0,128,128);
    var gl3=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(gc3),transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));
    gl3.scale.set(80,80,1);gl3.position.set(-20,44,-110);farG.add(gl3);
    return;
  }
  if(th.name==='reef'){
    var rc=document.createElement('canvas');rc.width=32;rc.height=128;var rx=rc.getContext('2d');
    var rgx=rx.createLinearGradient(0,0,32,0);rgx.addColorStop(0,'rgba(255,255,255,0)');rgx.addColorStop(.5,'rgba(255,255,255,1)');rgx.addColorStop(1,'rgba(255,255,255,0)');
    rx.fillStyle=rgx;rx.fillRect(0,0,32,128);
    rx.globalCompositeOperation='destination-in';var rgy=rx.createLinearGradient(0,0,0,128);rgy.addColorStop(0,'rgba(255,255,255,1)');rgy.addColorStop(1,'rgba(255,255,255,0)');
    rx.fillStyle=rgy;rx.fillRect(0,0,32,128);
    var rtx=new T.CanvasTexture(rc);
    for(i=0;i<[4,9,14][gFx];i++){
      var rm=new T.Mesh(new T.PlaneGeometry(4+r()*6,50),new T.MeshBasicMaterial({map:rtx,transparent:true,opacity:.08+r()*.08,blending:T.AdditiveBlending,depthWrite:false,fog:false,color:0xd8ffff}));
      rm.position.set(-45+i*7.5+r()*4,12+r()*4,-26-r()*28);rm.rotation.z=-.3;farG.add(rm);
    }
    return;
  }
  if(th.name==='cave'){
    var gc=document.createElement('canvas');gc.width=gc.height=64;
    var gx=gc.getContext('2d'),gg=gx.createRadialGradient(32,32,0,32,32,32);
    gg.addColorStop(0,'rgba(255,255,255,1)');gg.addColorStop(1,'rgba(255,255,255,0)');
    gx.fillStyle=gg;gx.fillRect(0,0,64,64);
    var gt=new T.CanvasTexture(gc);gt.encoding=T.sRGBEncoding;
    var cols=[0x58b8ff,0x7ac8ff,0x3a8aff,0xffc28a];
    for(i=0;i<30;i++){
      var s=new T.Sprite(new T.SpriteMaterial({map:gt,transparent:true,blending:T.AdditiveBlending,depthWrite:false,color:cols[i%4],opacity:.45,fog:false}));
      var sz=4+r()*8;s.scale.set(sz,sz,1);s.position.set(-230+r()*460,r()*18,-34-r()*26);farG.add(s);
    }
    return;
  }
  var peaks=th.name==='peaks';
  for(i=-5;i<=5;i++){
    var g=new T.ConeGeometry(26+r()*10,34+r()*16,peaks?11:7,peaks?7:4);
    var p=g.attributes.position,cols2=[],c=new T.Color(),h=g.parameters.height;
    for(var v=0;v<p.count;v++){
      var y=p.getY(v);
      if(y<h/2-.01){var jj=peaks?7:4;p.setX(v,p.getX(v)+(r()-.5)*jj);p.setZ(v,p.getZ(v)+(r()-.5)*jj);if(peaks)p.setY(v,y+(r()-.5)*3)}
      var u=(y+h/2)/h;
      if(peaks){var rock=(u<.92&&Math.sin(p.getX(v)*.45+i*1.7+y*.12)*Math.cos(p.getZ(v)*.37+y*.22)>.05)||(u>.2&&u<.5&&r()<.45);
        c.set(rock?(th.aurora?(r()<.5?'#7ab4e4':'#5a96d0'):(r()<.5?'#5a4232':'#463428')):(u<.15?(th.aurora?'#b8d8f0':'#c8ccd4'):'#f4f7fb'))}/* Mundo 18: montanhas de gelo azul */
      else if(th.canyon)c.set('#a8583a').lerp(new T.Color('#e8a878'),u);/* Cânion: mesas de pedra vermelha, sem neve */
      else if(th.name==='trail'||th.falls)c.set('#3f7a4e').lerp(new T.Color('#9cc48a'),u*u);/* Terra Nova: morros verdes, sem neve */
      else if(u>.72)c.set('#eef3f7');
      else c.set('#6b7f95').lerp(new T.Color('#8fa3b6'),u);
      cols2.push(c.r,c.g,c.b);
    }
    g.setAttribute('color',new T.Float32BufferAttribute(cols2,3));
    var m=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true}));
    m.position.set(i*42+(r()-.5)*14,-8+h/2,-78-r()*14);farG.add(m);
  }
  var cc=document.createElement('canvas');cc.width=256;cc.height=128;
  var cx=cc.getContext('2d');
  for(i=0;i<14;i++){
    var bx=40+r()*176,by=44+r()*40,br=22+r()*26,gr=cx.createRadialGradient(bx,by,0,bx,by,br);
    gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');
    cx.fillStyle=gr;cx.fillRect(0,0,256,128);
  }
  var ct=new T.CanvasTexture(cc);ct.encoding=T.sRGBEncoding;
  for(i=0;i<9;i++){
    var cs=new T.Sprite(new T.SpriteMaterial({map:ct,transparent:true,opacity:.8,depthWrite:false,color:peaks?0xdde6f2:0xffffff}));
    cs.scale.set(46+r()*22,22+r()*8,1);cs.position.set(-170+i*42+r()*20,24+r()*18,-96-r()*16);cs.userData.drift=.3+r()*.5;
    farG.add(cs);
  }
  var gc2=document.createElement('canvas');gc2.width=gc2.height=128;
  var gx2=gc2.getContext('2d'),gg2=gx2.createRadialGradient(64,64,0,64,64,64);
  gg2.addColorStop(0,'rgba(255,248,220,1)');gg2.addColorStop(.25,'rgba(255,236,170,.55)');gg2.addColorStop(1,'rgba(255,230,160,0)');
  gx2.fillStyle=gg2;gx2.fillRect(0,0,128,128);
  var glow=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(gc2),transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));
  glow.scale.set(70,70,1);glow.position.set(peaks?-30:-52,peaks?22:40,-110);if(peaks)glow.material.opacity=.22;farG.add(glow);
}
function buildHazards(){
  var forest=curTheme.name==='forest'||curTheme.name==='trail',ruins=curTheme.name==='ruins';
  var g=forest?new T.ConeGeometry(.17,.62,5):(ruins?new T.ConeGeometry(.15,.66,5):new T.ConeGeometry(.13,.58,6));g.translate(0,.29,0);
  var m=forest?M(0x8f9f2c,.7,0,{flatShading:true}):(ruins?M(0xb5703a,.75,0,{flatShading:true}):M(0x8d98a3,.35,.85));
  LV.spikes.forEach(function(s){
    hazards.push({l:s[0],r:s[1],t:s[2]+.55,y0:s[2],spike:true});
    var n=Math.max(2,Math.round((s[1]-s[0])/.3));
    for(var i=0;i<n;i++)for(var row=0;row<2;row++){
      var o=mesh(g,m);o.position.set(s[0]+(i+.5)*(s[1]-s[0])/n,s[2],-.5+row*.9);add(o);
    }
  });
}
var surfStrip=null,ambB=null,curS=null;
function capTop(x,top){for(var i=0;i<solids.length;i++){var q=solids[i];if(q.b>2&&q.t-q.b>2&&x>=q.l&&x<=q.r&&q.b<top)top=q.b}return top}
function buildWater(){
  airBubs=[];surfStrip=null;ambB=null;curS=null;
  var w=LV.water;if(!w)return;
  var xs=[w.x0,w.x1],i;(LV.wlev||[]).forEach(function(l){xs.push(l[0],l[1])});
  solids.forEach(function(q){if(q.b>2&&q.t-q.b>2){xs.push(Math.max(w.x0,q.l),Math.min(w.x1,q.r))}});
  xs.sort(function(a,b){return a-b});
  var pos=[],col=[],idx=[],n=0;
  function rgba(y,top){var u=clamp((top-y)/Math.max(1,top-w.y0),0,1);return [lerp(.36,.03,u),lerp(.82,.33,u),lerp(.9,.56,u),lerp(.07,.40,u)]}
  for(i=0;i<xs.length-1;i++){
    var a=xs[i],b=xs[i+1];if(b-a<.01)continue;
    var mid=(a+b)/2,base=wTop(mid),top=capTop(mid,base);
    if(top<=w.y0+.1)continue;
    var ct=rgba(top,base),cb=rgba(w.y0,base);
    pos.push(a,top,0,b,top,0,b,w.y0,0,a,w.y0,0);
    col.push(ct[0],ct[1],ct[2],ct[3],ct[0],ct[1],ct[2],ct[3],cb[0],cb[1],cb[2],cb[3],cb[0],cb[1],cb[2],cb[3]);
    idx.push(n,n+1,n+2,n,n+2,n+3);n+=4;
  }
  var g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,4));g.setIndex(idx);
  var ov=new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,fog:false}));
  ov.position.z=3.4;ov.renderOrder=40;ov.frustumCulled=false;add(ov);
  var N=Math.ceil((w.x1-w.x0)/.5),sp=new Float32Array(N*4*3),si=[],stops=new Float32Array(N);
  for(i=0;i<N;i++){
    var x0s=w.x0+i*.5,x1s=Math.min(w.x1,x0s+.5),xm=(x0s+x1s)/2,t0=wTop(xm);
    stops[i]=(capTop(xm,t0)<t0-.05)||Math.abs(wTop(x0s+.01)-wTop(x1s-.01))>.3?-999:t0;
    sp[i*12]=x0s;sp[i*12+3]=x1s;sp[i*12+6]=x0s;sp[i*12+9]=x1s;
    var q=i*4;si.push(q,q+1,q+2,q+1,q+3,q+2);
  }
  /* superfície ondulada: faixa azul com crista clara em cima, sumindo para baixo (e uma segunda onda atrás, mais clara) */
  var su=new Float32Array(N*4*2);for(i=0;i<N;i++){su.set([0,1,1,1,0,0,1,0],i*8)}
  var wc=document.createElement('canvas');wc.width=4;wc.height=128;var wx=wc.getContext('2d'),wg=wx.createLinearGradient(0,0,0,128);
  wg.addColorStop(0,'rgba(235,252,255,0)');wg.addColorStop(.04,'rgba(235,252,255,.95)');wg.addColorStop(.1,'rgba(110,205,255,.85)');wg.addColorStop(.3,'rgba(35,140,225,.6)');wg.addColorStop(.65,'rgba(25,110,200,.25)');wg.addColorStop(1,'rgba(20,100,190,0)');
  wx.fillStyle=wg;wx.fillRect(0,0,4,128);var wtx=new T.CanvasTexture(wc);wtx.encoding=T.sRGBEncoding;
  function strip(z,op,ro){var sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(sp.slice(),3));sg.setAttribute('uv',new T.BufferAttribute(su,2));sg.setIndex(si);
    var sm=new T.Mesh(sg,new T.MeshBasicMaterial({map:wtx,transparent:true,opacity:op,depthWrite:false,fog:false,side:T.DoubleSide}));sm.position.z=z;sm.renderOrder=ro;sm.frustumCulled=false;add(sm);return sm}
  var smB=strip(3.25,.55,40.5),sm=strip(3.3,1,41);
  surfStrip={m:sm,b:smB,N:N,tops:stops};
  var bg=new T.SphereGeometry(.07,6,5),bmat=new T.MeshBasicMaterial({color:0xe8ffff,transparent:true,opacity:.5,depthWrite:false,fog:false});
  if(gFx>0){var im=new T.InstancedMesh(bg,bmat,gFx===1?20:46);im.frustumCulled=false;im.renderOrder=39;add(im);ambB=im}
  var cl=LV.currents||[];
  if(cl.length){
    var list=[],rr=rnd(515);
    cl.forEach(function(c){var cnt=Math.max(4,Math.round((c[1]-c[0])*(c[3]-c[2])/[12,8,5][gFx]));for(var k=0;k<cnt;k++)list.push({c:c,r1:rr(),r2:rr(),z:rr()*1.2-.6})});
    /* correnteza: faixas suaves de água clara (cauda que some) ondulando + bolhinhas levadas pela corrente */
    var stc=document.createElement('canvas');stc.width=128;stc.height=16;var sx=stc.getContext('2d');
    var hg=sx.createLinearGradient(0,0,128,0);hg.addColorStop(0,'rgba(255,255,255,0)');hg.addColorStop(.7,'rgba(255,255,255,.75)');hg.addColorStop(.9,'rgba(255,255,255,.95)');hg.addColorStop(1,'rgba(255,255,255,0)');
    sx.fillStyle=hg;sx.fillRect(0,0,128,16);sx.globalCompositeOperation='destination-in';var vg=sx.createLinearGradient(0,0,0,16);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(.5,'rgba(0,0,0,1)');vg.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=vg;sx.fillRect(0,0,128,16);
    var stx=new T.CanvasTexture(stc);
    var sgm=new T.InstancedMesh(new T.PlaneGeometry(1,.16),new T.MeshBasicMaterial({map:stx,color:0xc8f6ff,transparent:true,opacity:.5,blending:T.AdditiveBlending,depthWrite:false,fog:false,side:T.DoubleSide}),list.length);
    sgm.frustumCulled=false;add(sgm);
    var bl2=[];list.forEach(function(q,k){if(k%2===0)bl2.push({c:q.c,r1:rr(),r2:rr(),z:q.z,s:.06+rr()*.07})});
    var btc=document.createElement('canvas');btc.width=btc.height=32;var bx2=btc.getContext('2d');bx2.beginPath();bx2.arc(16,16,12,0,6.283);bx2.fillStyle='rgba(220,250,255,.25)';bx2.fill();bx2.lineWidth=2.5;bx2.strokeStyle='rgba(255,255,255,.9)';bx2.stroke();bx2.beginPath();bx2.arc(11,11,3,0,6.283);bx2.fillStyle='#fff';bx2.fill();
    var bim=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:new T.CanvasTexture(btc),transparent:true,depthWrite:false,fog:false}),Math.max(1,bl2.length));bim.frustumCulled=false;add(bim);
    curS={im:sgm,list:list,bim:bim,bl:bl2};
  }
  (LV.bubbles||[]).forEach(function(b){
    var gp=new T.Group();
    var sph=mesh(new T.SphereGeometry(.42,18,14),new T.MeshStandardMaterial({color:0xcff6ff,roughness:.05,transparent:true,opacity:.42,emissive:0x5ad0ff,emissiveIntensity:.55,depthWrite:false}),false,false);gp.add(sph);
    var hl=mesh(new T.SphereGeometry(.09,8,6),new T.MeshBasicMaterial({color:0xffffff}),false,false);hl.position.set(-.16,.17,.3);gp.add(hl);
    gp.position.set(b[0],b[1],0);add(gp);
    airBubs.push({x:b[0],y:b[1],on:true,cd:0,mesh:gp});
  });
}
function buildCoral(){
  var list=LV.coral||[];if(!list.length)return;
  var r=rnd(909),dummy=new T.Object3D(),col=new T.Color(),cones=[],i;
  list.forEach(function(q){
    hazards.push({l:q[0],r:q[1],t:q[3],y0:q[2]});
    var w=q[1]-q[0],h=q[3]-q[2],n=Math.max(6,Math.round(w*h*7));
    for(i=0;i<n;i++)cones.push([q[0]+r()*w,q[2]+r()*h,-.5+r()*1.2,.5+r()*.55]);
  });
  var cg=new T.ConeGeometry(.11,.7,5);cg.translate(0,.35,0);
  var im=inst(cg,M(0xffffff,.55,0,{flatShading:true}),cones.length,true);
  var pal=[[.95,.3,.45],[1,.5,.25],[.85,.25,.7],[1,.7,.3]];
  cones.forEach(function(c,k){
    var pc=pal[k%4];
    dummy.position.set(c[0],c[1],c[2]);dummy.rotation.set((r()-.5)*1.6,r()*6,(r()-.5)*1.6);dummy.scale.set(c[3],c[3]*(.8+r()*.8),c[3]);dummy.updateMatrix();
    im.setMatrixAt(k,dummy.matrix);col.setRGB(pc[0],pc[1],pc[2]);im.setColorAt(k,col);
  });
  add(im);
}
function updWaterFx(dt){
  var w=LV&&LV.water;if(!w)return;
  var i,x;
  if(surfStrip){
    [[surfStrip.m,0,1],[surfStrip.b,2.2,.8]].forEach(function(S){
      var pa=S[0].geometry.attributes.position,arr=pa.array,ph=S[1],k=S[2];
      function wv(x){return surfWave(x,ph,k)}
      for(i=0;i<surfStrip.N;i++){
        var bt=surfStrip.tops[i],o=i*12;
        if(bt<-900){arr[o+1]=arr[o+4]=arr[o+7]=arr[o+10]=-200;continue}
        var xa=arr[o],xb=arr[o+3],ta=bt+wv(xa)+(ph?.06:0),tb=bt+wv(xb)+(ph?.06:0);
        arr[o+1]=ta+.05;arr[o+4]=tb+.05;arr[o+7]=ta-1;arr[o+10]=tb-1;
      }
      pa.needsUpdate=true;
    });
  }
  if(ambB){
    for(i=0;i<ambB.count;i++){
      var u=((i*.731+tm*(.35+(i%7)*.05))%1),bx=cam.x+((i*5.17)%26)-13+Math.sin(tm*.8+i)*.3,by=cam.y-6+u*14;
      var inside=bx>w.x0&&bx<w.x1&&by<capTop(bx,wTop(bx))-.1&&by>w.y0,bs=inside?(.5+(i%4)*.25):0;
      dummyO.position.set(bx,by,-3+((i*3.3)%5));dummyO.rotation.set(0,0,0);dummyO.scale.set(bs,bs,bs);dummyO.updateMatrix();ambB.setMatrixAt(i,dummyO.matrix);
    }
    ambB.instanceMatrix.needsUpdate=true;
  }
  if(curS){
    function flow(sq,spd,k){
      var c=sq.c,W2=c[1]-c[0],H=c[3]-c[2],hz=Math.abs(c[4])>=Math.abs(c[5]);
      var fx=(((sq.r1*W2+c[4]*tm*spd)%W2)+W2)%W2,fy=(((sq.r2*H+c[5]*tm*spd)%H)+H)%H;
      var u=hz?fx/W2:fy/H,fe=clamp(Math.min(u,1-u)*5,0,1);/* some nas pontas da zona */
      var px=c[0]+fx,py=c[2]+fy,ph=sq.r1*6.283+k;
      if(hz)py+=Math.sin(px*1.1+ph+tm*1.2)*.18;else px+=Math.sin(py*1.1+ph+tm*1.2)*.18;
      return [px,py,fe,hz?Math.cos(px*1.1+ph+tm*1.2)*.18*1.1:0];
    }
    curS.list.forEach(function(sq,k){
      var c=sq.c,f=flow(sq,.9,0),ang=Math.atan2(c[5],c[4])+Math.atan(f[3])*(c[4]<0?-1:1);
      dummyO.position.set(f[0],f[1],sq.z);dummyO.rotation.set(0,0,ang);
      var len=(1.1+Math.abs(c[4]+c[5])*.22)*(.4+.6*f[2]);dummyO.scale.set(len,.6+.4*f[2],1);dummyO.updateMatrix();curS.im.setMatrixAt(k,dummyO.matrix);
    });
    curS.im.instanceMatrix.needsUpdate=true;
    curS.bl.forEach(function(sq,k){
      var f=flow(sq,1.05,k*.37),sc=sq.s*(.3+.7*f[2]);
      dummyO.position.set(f[0],f[1]+Math.sin(tm*3+k)*.05,sq.z+.05);dummyO.rotation.set(0,0,0);dummyO.scale.set(sc,sc,1);dummyO.updateMatrix();curS.bim.setMatrixAt(k,dummyO.matrix);
    });
    curS.bim.instanceMatrix.needsUpdate=true;
  }
  airBubs.forEach(function(b){if(b.on){b.mesh.position.y=b.y+Math.sin(tm*2.1+b.x)*.14;var q=1+Math.sin(tm*3+b.x)*.05;b.mesh.scale.set(q,q,q)}});
}
function floorTopAt(x){if(x<17)return -99;var t=-99;for(var i=0;i<solids.length;i++){var s=solids[i];if(s.oneway||s.flt||s.wall||s.mover||s.crumble||s.block)continue;if(s.b>2)continue;if(x>s.l+.3&&x<s.r-.3&&s.t>t)t=s.t}return t}
function buildDecorReef(th){
  var r=rnd(444),d=new T.Object3D(),col=new T.Color(),i,x,tt,zc,yc;
  var kg=new T.CylinderGeometry(.045,.1,1,5);kg.translate(0,.5,0);
  var KN=100,km=inst(kg,M(0xffffff,.7),KN,false);
  for(i=0;i<KN;i++){
    x=-10+r()*300;tt=floorTopAt(x);zc=-2.4-r()*2.5;
    if(tt>-90&&r()<.8)yc=tt;else{zc=-6-r()*14;yc=mY(x,zc)}
    var h=1.5+r()*4.5;d.position.set(x,yc-.05,zc);d.rotation.set(0,0,(r()-.5)*.25);d.scale.set(1,h,1);d.updateMatrix();
    km.setMatrixAt(i,d.matrix);km.setColorAt(i,hsl(col,.36+r()*.08,.4,.2+r()*.12));
  }
  add(km);
  var cg=new T.ConeGeometry(.2,1,6);cg.translate(0,.5,0);
  var CN=150,cm=inst(cg,M(0xffffff,.6,0,{flatShading:true}),CN,true);
  var hues=[.53,.56,.5,.6,.58];
  for(i=0;i<CN;i++){
    x=-10+r()*300;tt=floorTopAt(x);zc=-2.5-r()*2;
    if(tt>-90&&r()<.75)yc=tt;else{zc=-5-r()*16;yc=mY(x,zc)}
    var sc=.5+r()*1.0;d.position.set(x,yc-.05,zc);d.rotation.set((r()-.5)*.5,r()*6,(r()-.5)*.6);d.scale.set(sc*.8,sc*(.8+r()*1.0),sc*.8);d.updateMatrix();
    cm.setMatrixAt(i,d.matrix);cm.setColorAt(i,hsl(col,hues[i%5],.45+r()*.2,.42+r()*.16));
  }
  add(cm);
  var sg=new T.SphereGeometry(1,12,8,0,Math.PI*2,0,Math.PI/2);
  var SN=48,sm2=inst(sg,M(0xffffff,.85,0,{map:texStone.map,bumpMap:texStone.bump,bumpScale:1.4}),SN,true);/* coral-cérebro com textura */
  for(i=0;i<SN;i++){
    x=-10+r()*300;tt=floorTopAt(x);zc=-2.4-r()*2.2;
    if(tt>-90&&r()<.8)yc=tt;else{zc=-5-r()*14;yc=mY(x,zc)}
    var sc2=.35+r()*.7;d.position.set(x,yc-.04,zc);d.rotation.set(0,r()*6,0);d.scale.set(sc2,sc2*.7,sc2);d.updateMatrix();
    sm2.setMatrixAt(i,d.matrix);sm2.setColorAt(i,hsl(col,[.55,.5,.58,.52][i%4],.35+r()*.2,.45+r()*.15));
  }
  add(sm2);
  var pg=new T.CylinderGeometry(.7,1.2,1,7);pg.translate(0,.5,0);
  var PN=40,pm=inst(pg,M(0xffffff,1),PN,false);
  for(i=0;i<PN;i++){
    x=-30+r()*340;zc=-14-r()*24;var hh=6+r()*12;
    d.position.set(x,mY(x,zc)-.5,zc);d.rotation.set(0,r()*6,0);d.scale.set(1+r()*1.6,hh,1+r()*1.6);d.updateMatrix();
    pm.setMatrixAt(i,d.matrix);pm.setColorAt(i,hsl(col,.53+r()*.04,.4,.16+r()*.08));
  }
  add(pm);
}
function buildMovers(){
  (LV.movers||[]).forEach(function(d){
    var m;
    if(curTheme.name==='forest'){
      m=new T.Group();
      var lf=mesh(new T.SphereGeometry(1,18,8),mossM);lf.scale.set(d.w/2,.13,1.5);lf.position.y=.095;m.add(lf);
      var vn=mesh(boxGeo(d.w*.92,.05,.1,1),M(0x2f7a22,.7));vn.position.y=.225;m.add(vn);
      var stm=mesh(new T.CylinderGeometry(.05,.05,.9,6),M(0x3f8a2a,.8));stm.position.set(0,.6,0);m.add(stm);
      add(m);
    }else if(curTheme.name==='trail'){/* Terra Nova: plataforma de tábuas pendurada por cipós */
      trMats();m=new T.Group();for(var px=-d.w/2+.21;px<d.w/2;px+=.42){var pl=mesh(new T.BoxGeometry(.38,.14,2.1),trPlankM,true,true);pl.position.set(px,.12,0);m.add(pl)}
      [-.8,.8].forEach(function(z){var bm=mesh(new T.BoxGeometry(d.w,.14,.14),trBarkM,true,false);bm.position.set(0,-.02,z);m.add(bm);[-1,1].forEach(function(sd){var v=mesh(new T.CylinderGeometry(.03,.03,14,4),vineM,false,false);v.position.set(sd*(d.w/2-.15),7,z);m.add(v)})});add(m);
    }else if(curTheme.aurora&&typeof auFloeMesh==='function'){m=auFloeMesh(d.w);add(m)}
    else if(curTheme.wreck&&typeof wkDebrisMesh==='function'){m=wkDebrisMesh(d.w,d.kind);add(m)}/* Mundo 19: destroços boiando *//* Mundo 18: bloco de gelo boiando que anda */
    else{m=mesh(boxGeo(d.w,.45,3.2,1.2),woodM);add(m)}
    var o={kind:d.kind,cx:d.cx,range:d.range,speed:d.speed,w:d.w,t:d.top,b:d.top-.45,oneway:false,flt:true,mover:true,x:d.cx,px:d.cx,l:d.cx-d.w/2,r:d.cx+d.w/2,mesh:m};
    m.position.set(d.cx,d.top-.225,0);
    solids.push(o);movers.push(o);
  });
}
function buildCrumbles(){
  (LV.crumbles||[]).forEach(function(c){
    var w=c[1]-c[0],cx=(c[0]+c[1])/2,m;
    if(curTheme.name==='forest'){
      m=new T.Group();
      var dw=M(0x7b6a58,.95,0,{flatShading:true});
      var lg2=mesh(new T.CylinderGeometry(.27,.3,w,8),dw);lg2.rotation.z=Math.PI/2;m.add(lg2);
      for(var q=0;q<3;q++){var tw=mesh(new T.ConeGeometry(.06,.5,5),dw);tw.position.set(-w/2+(q+.6)*w/3.2,.3,(q-1)*.15);tw.rotation.z=(q-1)*.5;m.add(tw)}
      var gap=mesh(boxGeo(w*.9,.06,.5,1),M(0x8a7a50,.9));gap.position.y=.28;m.add(gap);
    }else if(curTheme.falls){/* Vale das Cachoeiras: tábua da ponte de madeira, com cordas */
      m=new T.Group();var pl=mesh(boxGeo(w-.07,.2,1.8,1),woodM,true,true);pl.position.y=.15;m.add(pl);
      [-1,1].forEach(function(sd){var rp=mesh(new T.CylinderGeometry(.03,.03,w,5),M(0xc8a46a,.9),false,false);rp.rotation.z=Math.PI/2;rp.position.set(0,.55,sd*.85);m.add(rp);var po=mesh(new T.CylinderGeometry(.05,.05,.55,5),barkM,false,false);po.position.set(-w/2+.08,.4,sd*.85);m.add(po)});
    }else if(curTheme.canyon&&c[3]==='plank'){/* Cânion do Sol: tábua da ponte de corda que arrebenta */
      m=new T.Group();var cM=cnMats();var pk=mesh(boxGeo(w-.08,.16,1.8,1),cM.plankM||(cM.plankM=pbr(texWood,.85,.5,{color:new T.Color(0xc8986a)})),true,true);pk.position.y=.17;m.add(pk);
    }else if(curTheme.canyon){/* Cânion do Sol: barranco de pedra vermelha rachado (fica igual ao chão, mas com rachaduras) */
      m=new T.Group();var cA=cnMats(),ch=c[2]+14,cb=mesh(boxGeo(w-.06,ch,6.6,2),cA.rock);cb.position.set(0,-.05-ch/2,-1.6);m.add(cb);/* coluna de pedra até o fundo (cai inteira) */
      var ct=mesh(boxGeo(w-.02,.3,6.9,2),MATS[21].top);ct.position.set(0,.1,-1.6);m.add(ct);
    }else m=mesh(boxGeo(w,.5,2.8,curTheme.name==='village'?2.5:1.2),curTheme.name==='heights'?barkM:curTheme.name==='village'?vilM().roof:curTheme.name==='castle'?castleCrumbM:(curTheme.name==='peaks'?iceCrumbM:(curTheme.name==='ruins'?ruinCrumbM:crumbM)));
    m.position.set(cx,c[2]-.25,0);add(m);
    var o={l:c[0],r:c[1],t:c[2],b:c[2]-.5,oneway:false,flt:true,crumble:true,state:0,tm:0,vy:0,mesh:m,cx:cx,baseY:c[2]-.25,dead:false};
    solids.push(o);crumbles.push(o);
  });
}
function buildSprings(){
  var padM=M(0xe0482a,.5,.1),coilM=M(0xc9d1d8,.3,.9),baseM=M(0x59606a,.5,.6);
  (LV.springs||[]).forEach(function(s){
    var g=new T.Group();
    var base=mesh(new T.CylinderGeometry(.5,.55,.08,16),baseM);base.position.y=.04;g.add(base);
    var coil=new T.Group();g.add(coil);
    for(var i=0;i<4;i++){var t=mesh(new T.TorusGeometry(.2,.04,6,14),coilM);t.rotation.x=Math.PI/2;t.position.y=.12+i*.07;coil.add(t)}
    var pad=mesh(new T.CylinderGeometry(.5,.5,.1,16),padM);pad.position.y=.42;g.add(pad);
    var plume=null;if(curTheme.canyon){/* Cânion do Sol: gêiser de areia — cratera de pedra, sem mola; a areia esguicha ao pular */
      coil.visible=false;base.material=cnMats().crust;pad.material=M(0xe0a070,.95);var cr=mesh(new T.TorusGeometry(.55,.16,6,14),cnMats().rockC);cr.rotation.x=Math.PI/2;cr.position.y=.12;g.add(cr);
      plume=new T.Mesh(new T.ConeGeometry(.5,3,10,1,true),new T.MeshBasicMaterial({color:0xf0c890,transparent:true,opacity:.5,depthWrite:false}));plume.rotation.x=Math.PI;plume.position.y=1.9;plume.visible=false;g.add(plume)}
    g.position.set(s[0],s[1],0);add(g);
    springs.push({x:s[0],base:s[1],t:s[1]+.45,pad:pad,coil:coil,cd:0,sq:0,plume:plume});
  });
}