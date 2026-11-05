/*@@parte:34_aurora.js*/
/* ===================== Mundo 18 — Lago da Aurora =====================
   Noite de inverno: aurora boreal ondulando no céu, estrelas, lago congelado.
   Parte 1: margem + patinação (gelo liso, gelo que trinca, pinguim-tobogã, foca que joga bola de neve).
   O tema monta como a Montanha Gelada (name 'peaks', pinheiros e neve) e ganha a aurora por cima. */
var AU=null;
function auroraBuild(th){A0=auMats();
  AU={t:0,cracks:[],balls:[],g:null,mats:[],py:0,holes:[],floes:auFl,lifts:[],smoke:[],ropes:[]};auFl=[];
  var lite=LITE;
  /* ---- céu: estrelas e faixas da aurora (seguem a câmera, bem lá no fundo) ---- */
  var g=new T.Group();add(g);AU.g=g;/* preso à fase (sai junto quando troca de mundo) */
  var sp=[],r=rnd(1818);
  for(var i=0;i<(lite?220:420);i++){var a=r()*Math.PI*2,e=.12+r()*1.2,R=300;sp.push(Math.cos(a)*Math.cos(e)*R*1.4,Math.sin(e)*R*.55+10,-Math.abs(Math.sin(a))*R*.7-60)}
  var sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(sp,3));
  var st=new T.Points(sg,new T.PointsMaterial({color:0xeaf2ff,size:1.6,sizeAttenuation:false,transparent:true,opacity:.4,fog:false,depthWrite:false}));g.add(st);/* fim de tarde: só as primeiras estrelas */
  var vs='uniform float uT;varying vec2 vU;void main(){vU=uv;vec3 p=position;p.z+=sin(p.x*.022+uT*.18)*14.+sin(p.x*.061-uT*.31)*5.;p.y+=sin(p.x*.035+uT*.22)*3.;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}';
  var fs='uniform float uT,uI;uniform vec3 cA,cB;varying vec2 vU;void main(){float x=vU.x*7.;'+
    'float w=sin(x*1.3+uT*.25)*.5+sin(x*3.1-uT*.4)*.25+sin(x*6.7+uT*.6)*.12;'+
    'float rays=.45+.55*pow(.5+.5*sin(x*26.+sin(x*2.3+uT*.35)*5.+uT*.6),2.);'+
    'float b=.12+w*.08;float y=vU.y;float a=smoothstep(b,b+.06,y)*(1.-smoothstep(b+.04,1.,y));'+
    'a*=rays*(.75+.25*sin(x*.9-uT*.5));a*=smoothstep(0.,.12,vU.x)*smoothstep(1.,.88,vU.x);'+
    'vec3 c=mix(cA,cB,smoothstep(b+.05,.95,y));gl_FragColor=vec4(c*a*uI,1.);}';
  [[-120,40,0x3dffa0,0x7a3cff,.55],[-150,48,0x40ffd8,0xff4ab8,.38],[-100,34,0x8affb0,0x3a7aff,.28]].forEach(function(q,k){
    var m=new T.ShaderMaterial({vertexShader:vs,fragmentShader:fs,uniforms:{uT:{value:k*7},uI:{value:q[4]},cA:{value:new T.Color(q[2])},cB:{value:new T.Color(q[3])}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,fog:false});
    var pl=new T.Mesh(new T.PlaneGeometry(520,58,lite?60:120,1),m);pl.position.set(k*40-40,q[1],q[0]);pl.renderOrder=-5;g.add(pl);AU.mats.push(m)});
  /* lua fininha */
  var mo=new T.Mesh(new T.CircleGeometry(9,32),new T.MeshBasicMaterial({color:0xffe0a0,fog:false}));mo.position.set(-70,24,-230);g.add(mo);/* o sol se pondo */
  var mh=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffa050,transparent:true,depthWrite:false,fog:false,opacity:.85,blending:T.AdditiveBlending}));mh.scale.set(80,80,1);mh.position.set(-70,24,-231);g.add(mh);
  /* ---- o lago: água escura embaixo do gelo, com o brilho da aurora refletido ---- */
  if(LV.lake){var L=LV.lake;
    /* água com ondas (dono, 31/10): mapa de relevo de ondas feito no canvas (repete sem emenda), em duas camadas que andam em direções diferentes */
    var wn=auWaveTex(),wm=new T.MeshStandardMaterial({color:0x5878a0,roughness:.3,metalness:.2,normalMap:wn[0],normalScale:new T.Vector2(.38,.38),emissive:new T.Color(0x0c2236),emissiveIntensity:.3});
    wm.side=T.DoubleSide;var wm2=wm.clone();wm2.normalMap=wn[1];wm2.transparent=true;wm2.opacity=.35;wm2.depthWrite=false;
    var W=L[1]-L[0]+200,cx=(L[0]+L[1])/2;
    var wp=new T.Mesh(new T.PlaneGeometry(W,130),wm);wp.rotation.x=-Math.PI/2;wp.position.set(cx,-.3,-21);/* vai até a margem lá do fundo e passa da câmera (tela alta no PC mostrava o fundo escuro) *//* vai até a margem lá do fundo */wp.receiveShadow=true;add(wp);
    var wp2=new T.Mesh(new T.PlaneGeometry(W,130),wm2);wp2.rotation.x=-Math.PI/2;wp2.position.set(cx,-.28,-21);add(wp2);
    [wn[0],wn[1]].forEach(function(t,k){t.repeat.set(W/(k?4.5:3.2),130/(k?4.5:3.2))});AU.water=wm;AU.wave=wn;
    /* o lago congelado (patinação) só no trecho da parte 1; no resto a água fica aberta, com ondas */
    var fz=LV.frozen||[24,200];
    var itx=iceTopM.map?iceTopM.map.clone():null;if(itx){itx.wrapS=itx.wrapT=T.RepeatWrapping;itx.repeat.set((fz[1]-fz[0])/3,40/3);itx.needsUpdate=true}
    var im=new T.MeshStandardMaterial({color:0x5a8cb4,roughness:.12,metalness:.3,emissive:new T.Color(0x0e3a40),emissiveIntensity:.45,map:itx});
    var ip=new T.Mesh(new T.ShapeGeometry(auIceShape(fz[0],fz[1],40)),im);ip.rotation.x=-Math.PI/2;ip.position.set(0,-.04,-6.2);ip.receiveShadow=true;add(ip);AU.ice=im;
    var wf=new T.Mesh(new T.PlaneGeometry(W,14),new T.MeshBasicMaterial({color:0x0c2a44,fog:false}));wf.position.set(cx,-7.3,6);add(wf);
    /* debaixo d'água (caindo no buraco): fundo azul-escuro, sem chão de terra */
    var ub=new T.Mesh(new T.PlaneGeometry(W,14),new T.MeshBasicMaterial({color:0x0a2238,fog:false}));ub.position.set(cx,-7.3,-8);add(ub);
    var uf=new T.Mesh(new T.PlaneGeometry(W,60),new T.MeshBasicMaterial({color:0x0a2238,fog:false}));uf.rotation.x=-Math.PI/2;uf.position.set(cx,-14,-26);add(uf)}
  /* ---- pinheiros com neve: nas margens, na ilha e uma fileira do outro lado do lago ---- */
  var PT=[],xe=sceneEnd();function pine(x,y,z,s){PT.push([x,y,z,s])}
  for(var px=-14;px<xe+20;px+=1.6+r()*2.2){var inL=LV.lake&&px>LV.lake[0]-101&&px<LV.lake[1]+101;/* a água do lago vai 100 além de cada ponta: ali também não tem chão */
    if(!inL){var zz=-6-r()*16;pine(px,mY(px,zz),zz,.8+r()*.8)}
    var zb=-44.6-r()*4;pine(px+r(),mY(px,zb),zb,1.1+r()*1)}/* fileira na costa, em cima da areia vermelha */
  (LV.solids||[]).forEach(function(q){if(q[4]||q[1]-q[0]>40||q[0]<0)return;var vl4=!!LV.vila&&q[1]<=LV.vila.end;if(vl4)return;for(var k2=0;k2<4;k2++){var x4=q[0]+1+r()*(q[1]-q[0]-2);pine(x4,q[2],-3.1-r()*1.2,.55+r()*.35)}/* em cima do bloco de gelo (antes ficavam atrás dele, em cima da água) */});
  if(PT.length){var tr=new T.CylinderGeometry(.12,.16,.8,6);tr.translate(0,.4,0);var cg=[];for(var t=0;t<3;t++){var c=new T.ConeGeometry(1.05-t*.27,1.3,8);c.translate(0,1.1+t*.78,0);cg.push(c)}
    var sn=[];for(t=0;t<3;t++){var c2=new T.ConeGeometry(.62-t*.17,.5,8);c2.translate(0,1.62+t*.78,0);sn.push(c2)}
    var tm1=inst(tr,M(0x3a2618,.9),PT.length,true),tm2=inst(mgL(cg),M(0x1c4a3a,.85,0,{flatShading:true}),PT.length,true),tm3=inst(mgL(sn),M(0xe8f2ff,.7,0,{flatShading:true}),PT.length,false),dd=new T.Object3D();
    PT.forEach(function(q,j){dd.position.set(q[0],q[1]-.05,q[2]);dd.rotation.set(0,r()*6,0);dd.scale.set(q[3],q[3]*(1+r()*.2),q[3]);dd.updateMatrix();tm1.setMatrixAt(j,dd.matrix);tm2.setMatrixAt(j,dd.matrix);tm3.setMatrixAt(j,dd.matrix)});
    add(tm1);add(tm2);add(tm3)}
  auBack();auVila();
  if(LV.slideIn){var SI=LV.slideIn,pi=[];for(var k=0;k<=16;k++){var u=k/16,su=u*u*(3-2*u);pi.push(new T.Vector3(SI[0]+u*(SI[2]-SI[0]),SI[1]-su*(SI[1]-.75),0))}AU.slideIn=new T.CatmullRomCurve3(pi);auChute(AU.slideIn)}
  (LV.houses||[]).forEach(function(h){auHouse(h,r)});
  auBridgeBuild();auLightBuild();
  /* ---- pingentes no teto das grutas: tremem quando o Kuro passa embaixo e caem ---- */
  AU.ics=[];var icM=M(0x9ad8ff,.08,.1,{emissive:new T.Color(0x2a8ad8),emissiveIntensity:.6});
  (LV.icicles||[]).forEach(function(q){var g=new T.Group(),cn=mesh(new T.ConeGeometry(.24,1.3,7),icM,true,false);cn.rotation.x=Math.PI;cn.position.y=-.65;g.add(cn);
    for(var k=0;k<2;k++){var s2=mesh(new T.ConeGeometry(.1,.55,5),icM,false,false);s2.rotation.x=Math.PI;s2.position.set((k?.2:-.2),-.28,.05);g.add(s2)}
    g.position.set(q[0],q[1],0);add(g);AU.ics.push({x:q[0],y0:q[1],g:g,st:0,t:0,y:q[1],vy:0})});
  /* ---- cristais de gelo (enfeite, brilham um pouco) ---- */
  var crM=new T.MeshStandardMaterial({color:0xbfeaff,roughness:.05,metalness:.2,emissive:new T.Color(0x3aa0e0),emissiveIntensity:.55,transparent:true,opacity:.9}),CR=[];
  (LV.crystals||[]).forEach(function(q){var s=q[2]||1;for(var k=0;k<5;k++){var h=(.7+r()*1.1)*s*(k===0?1.6:1),cg=new T.ConeGeometry(.22*s*(k===0?1.5:1),h,5);cg.translate(0,h/2,0);cg.rotateZ((r()-.5)*.7);cg.rotateX((r()-.5)*.5);cg.translate(q[0]+(k-2)*.28*s,q[1],-.9-r()*.4);CR.push(cg)}});
  if(CR.length)add(mesh(mgL(CR),crM,false,false));
  /* ---- placa de seta (madeira com neve) ---- */
  (LV.signs||[]).forEach(function(q){var g=new T.Group(),po=mesh(new T.CylinderGeometry(.07,.08,1.3,6),A0.woodD,false,false);po.position.y=.65;g.add(po);
    var bd=mesh(new T.BoxGeometry(1.2,.55,.1),A0.wood,false,false);bd.position.y=1.15;g.add(bd);var sn=mesh(new T.BoxGeometry(1.25,.1,.16),A0.snow,false,false);sn.position.y=1.47;g.add(sn);
    var ar=new T.Shape();ar.moveTo(-.4,-.07);ar.lineTo(.12,-.07);ar.lineTo(.12,-.18);ar.lineTo(.4,0);ar.lineTo(.12,.18);ar.lineTo(.12,.07);ar.lineTo(-.4,.07);
    var am=mesh(new T.ShapeGeometry(ar),M(0xe0302a,.6),false,false);am.position.set(0,1.15,.06);g.add(am);g.position.set(q[0],q[1],-.8);add(g)});
  /* ---- gelo que trinca: 1ª pisada racha, 2ª quebra ---- */
  var cc=document.createElement('canvas');cc.width=256;cc.height=64;var cx=cc.getContext('2d');cx.strokeStyle='rgba(255,255,255,.95)';cx.lineWidth=2.2;
  for(var k=0;k<7;k++){var x0=20+k*34+r()*10,y0=32;cx.beginPath();cx.moveTo(x0,y0);for(var s=0;s<5;s++){x0+=(r()-.5)*30;y0+=(r()-.5)*26;cx.lineTo(x0,Math.max(2,Math.min(62,y0)))}cx.stroke()}
  var ctex=new T.CanvasTexture(cc);
  var cIce=M(0xbfe8ff,.08,.1,{transparent:true,opacity:.82,emissive:new T.Color(0x2a6a8a),emissiveIntensity:.25});
  (LV.cracks||[]).forEach(function(c){var w=c[1]-c[0],gg=new T.Group();
    var sl=mesh(boxGeo(w-.05,.38,2.6,1),cIce,false,true);sl.position.y=-.19;gg.add(sl);
    var ov=new T.Mesh(new T.PlaneGeometry(w-.1,2.5),new T.MeshBasicMaterial({map:ctex,transparent:true,opacity:0,depthWrite:false}));ov.rotation.x=-Math.PI/2;ov.position.y=.012;gg.add(ov);
    var fr=new T.Mesh(new T.PlaneGeometry(w-.1,.36),new T.MeshBasicMaterial({map:ctex,transparent:true,opacity:0,depthWrite:false}));fr.position.set(0,-.19,1.31);gg.add(fr);
    gg.position.set((c[0]+c[1])/2,c[2],0);add(gg);
    var so={l:c[0],r:c[1],t:c[2],b:c[2]-.38,oneway:false,flt:true,slip:false,crk:1};/* gelo novo e áspero: não escorrega */solids.push(so);
    AU.cracks.push({c:c,g:gg,ov:ov,fr:fr,so:so,n:0,brk:0,fall:0,t0:c[2]})});
  /* ---- buracos no gelo (onde a foca mora) ---- */
  enemies.forEach(function(e){if(e.type!=='seal')return;var h=new T.Group();
    var hl=new T.Mesh(new T.CircleGeometry(.62,20),new T.MeshBasicMaterial({color:0x061a2c}));hl.rotation.x=-Math.PI/2;hl.scale.set(1.25,.8,1);hl.position.y=.02;h.add(hl);
    for(var q=0;q<9;q++){var a=q/9*Math.PI*2,ch=mesh(new T.DodecahedronGeometry(.13+r()*.08,0),iceSlabM,false,false);ch.position.set(Math.cos(a)*.8,.05,Math.sin(a)*.52);ch.rotation.set(r()*3,r()*3,0);h.add(ch)}
    h.position.set(e.hx,e.y,0);add(h)});
}
/* ---- bichos: Pinguim-tobogã ---- */
function makePeng(){var g=new T.Group(),inner=new T.Group(),tilt=new T.Group();g.add(inner);inner.add(tilt);
  var bk=M(0x1c2230,.55),wh=M(0xf4f6fa,.6),or=M(0xffa42a,.45);
  var bd=mesh(new T.SphereGeometry(.36,16,12),bk,true,false);bd.scale.set(1,1.35,.95);bd.position.y=.5;tilt.add(bd);
  var be=mesh(new T.SphereGeometry(.3,14,10),wh,false,false);be.scale.set(.95,1.25,.7);be.position.set(0,.47,.14);tilt.add(be);
  var hd=mesh(new T.SphereGeometry(.24,14,10),bk,true,false);hd.position.set(0,1.0,.02);tilt.add(hd);
  [-1,1].forEach(function(sd){var f=mesh(new T.SphereGeometry(.09,10,8),wh,false,false);f.scale.set(1,1.1,.6);f.position.set(sd*.09,1.02,.17);tilt.add(f);
    var ey=mesh(new T.SphereGeometry(.035,8,6),M(0x101010,.3),false,false);ey.position.set(sd*.09,1.03,.22);tilt.add(ey)});
  var bkk=mesh(new T.ConeGeometry(.06,.2,8),or,false,false);bkk.rotation.x=Math.PI/2;bkk.position.set(0,.96,.3);tilt.add(bkk);
  var fl=[];[-1,1].forEach(function(sd){var p=new T.Group();p.position.set(sd*.33,.7,0);tilt.add(p);var w=mesh(new T.SphereGeometry(.14,10,8),bk,false,false);w.scale.set(.35,1.3,.75);w.position.y=-.16;p.add(w);fl.push(p)});
  var ft=[];[-1,1].forEach(function(sd){var f=mesh(new T.SphereGeometry(.1,10,6),or,false,false);f.scale.set(1,.35,1.5);f.position.set(sd*.13,.03,.08);tilt.add(f);ft.push(f)});
  var sc=mesh(new T.TorusGeometry(.25,.05,6,16),M(0xe0402a,.7),false,false);sc.rotation.x=Math.PI/2;sc.position.y=.82;tilt.add(sc);/* cachecol */
  add(g);return {g:g,inner:inner,tilt:tilt,fl:fl,ft:ft}}
function pengAI(e,dt){e.mt=(e.mt||0)+dt;var cyc=4.2,u=e.mt%cyc;
  var sl=u>2.4;if(sl&&!e.sl0){/* começa a deslizar: vira para o Kuro se ele estiver perto (dentro do trecho) */
    if(Math.abs(P.x-e.x)<8&&Math.abs(P.y-e.y)<2&&P.x>e.x0-1&&P.x<e.x1+1)e.dir=P.x>e.x?1:-1;
    emit(dustPool,e.x,e.y+.1,5,2,.4,.4,1.2,-.3)}
  e.sl0=sl;e.slide+=((sl?1:0)-(e.slide||0))*Math.min(1,dt*8);
  e.cur=sl?4.6:1.1;var nx=e.x+e.dir*e.cur*dt;if(nx<e.x0||nx>e.x1){e.dir=-e.dir}else e.x=nx;
  e.h=.95-.45*e.slide;if(sl&&((tm*30)|0)%4===0)emit(dustPool,e.x-e.dir*.4,e.y+.05,1,1.2,.3,.35,1.2,-.2)}
function pengVis(e,dt){var v=e.vis,s=e.slide||0;v.g.rotation.y=0;
  v.inner.rotation.y=e.dir>0?Math.PI/2-.45:-(Math.PI/2-.45);
  v.tilt.rotation.x=s*1.35;v.tilt.position.y=s*.36;
  var wd=(1-s)*Math.sin(tm*12+e.ph);v.tilt.rotation.z=wd*.12;
  v.fl.forEach(function(f,i){f.rotation.z=(i?-1:1)*(.15+(1-s)*Math.abs(wd)*.4+s*.9)});
  v.ft.forEach(function(f,i){f.position.y=.03+Math.max(0,(i?1:-1)*wd)*.06})}
/* ---- bichos: Foca (sai do buraco e joga bola de neve em arco) ---- */
function makeSeal(){var g=new T.Group(),inner=new T.Group();g.add(inner);
  var gr=M(0x8a9cb0,.5),lt=M(0xc8d4e0,.6),dk=M(0x141a22,.3);
  var bd=mesh(new T.SphereGeometry(.38,16,12),gr,true,false);bd.scale.set(1,1.5,.9);bd.position.y=.3;inner.add(bd);
  var be=mesh(new T.SphereGeometry(.3,12,10),lt,false,false);be.scale.set(.9,1.3,.6);be.position.set(0,.32,.16);inner.add(be);
  var hd=mesh(new T.SphereGeometry(.27,14,10),gr,true,false);hd.position.set(0,.86,.06);inner.add(hd);
  var mz=mesh(new T.SphereGeometry(.13,10,8),lt,false,false);mz.scale.set(1.3,.85,1);mz.position.set(0,.8,.28);inner.add(mz);
  var ns=mesh(new T.SphereGeometry(.05,8,6),dk,false,false);ns.position.set(0,.85,.4);inner.add(ns);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.05,8,6),dk,false,false);ey.position.set(sd*.11,.93,.26);inner.add(ey);
    for(var q=0;q<2;q++){var wk=mesh(new T.CylinderGeometry(.006,.006,.22,3),lt,false,false);wk.rotation.z=Math.PI/2+sd*(q?.15:-.1);wk.position.set(sd*.2,.79+q*.03,.33);inner.add(wk)}});
  var fl=[];[-1,1].forEach(function(sd){var p=new T.Group();p.position.set(sd*.34,.45,.05);inner.add(p);var f=mesh(new T.SphereGeometry(.13,10,8),gr,false,false);f.scale.set(.4,1.2,.8);f.position.y=-.12;p.add(f);fl.push(p)});
  var ball=mesh(new T.IcosahedronGeometry(.17,1),M(0xffffff,.8),false,false);ball.position.set(.32,.6,.12);inner.add(ball);
  add(g);return {g:g,inner:inner,fl:fl,ball:ball}}
function sealAI(e,dt){var u0=((e.mt+(e.ph||0))%4.6+4.6)%4.6,over=Math.abs(P.x-e.x)<1.3&&Math.abs(P.y-e.y)<1.5;
  if(!(over&&u0<1.5&&u0>1.2))e.mt=(e.mt||0)+dt;/* o Kuro em cima do buraco: a foca espera embaixo (não sai debaixo dele) */
  var cyc=4.6,u=((e.mt+(e.ph||0))%cyc+cyc)%cyc,pop;
  if(u<1.5)pop=0;else if(u<1.8)pop=(u-1.5)/.3;else if(u<4.0)pop=1;else if(u<4.3)pop=1-(u-4.0)/.3;else pop=0;
  e.dir=P.x>e.x?1:-1;
  if(pop>=1&&u>2.35&&!e.thr){e.thr=1;var dx=P.x-e.x;if(Math.abs(dx)<8.5&&Math.abs(dx)>1.2&&Math.abs(P.y-e.y)<2.2&&Math.abs(e.x-camera.position.x)<11&&state==='play')auThrow(e)}/* só joga se estiver na tela e no mesmo andar */
  if(u<1.5)e.thr=0;
  if(e.pop0<.5&&pop>=.5){splashFx(e.x,e.y+.1,6);try{sfx.splash()}catch(er){}}
  e.pop0=pop;e.pop=pop;e.noHit=pop<.55;e.safe=pop<.55;e.h=.95*Math.max(.2,pop)}
function sealVis(e,dt){var v=e.vis,pop=e.slp>0||e.wake?1:(e.pop||0);v.g.rotation.y=0;v.inner.rotation.y=e.dir>0?.55:-.55;
  v.inner.position.y=-1.05*(1-pop);v.inner.visible=pop>.02;
  var u=((e.mt+(e.ph||0))%4.6+4.6)%4.6,wind=u>1.9&&u<2.35?(u-1.9)/.45:0;
  v.fl.forEach(function(f,i){f.rotation.z=(i?-1:1)*(.3+Math.sin(tm*6+e.ph)*.12)-(i?0:wind*2.2)});
  v.ball.visible=pop>.6&&!e.thr&&!(e.slp>0);}
function auThrow(e){var x=e.x+e.dir*.35,y=e.y+.95,T0=1.05,g=14,tx=P.x+P.vx*.35,vx=clamp((tx-x)/T0,-7.5,7.5),vy=(P.y+.6-y+.5*g*T0*T0)/T0;
  var m=mesh(new T.IcosahedronGeometry(.2,1),M(0xffffff,.75,0,{emissive:new T.Color(0x334455),emissiveIntensity:.3}),true,false);m.position.set(x,y,0);add(m);
  AU.balls.push({m:m,x:x,y:y,vx:vx,vy:Math.min(vy,13),t:0});try{beep(420,.08,'triangle',.04,200)}catch(er){}}
function auBallUpd(dt){for(var i=AU.balls.length-1;i>=0;i--){var b=AU.balls[i],py=b.y;b.t+=dt;b.vy-=14*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.m.position.set(b.x,b.y,0);b.m.rotation.x+=dt*8;b.m.rotation.z+=dt*6;
  var hit=false;
  if(state==='play'&&Math.abs(P.x-b.x)<P.w/2+.2&&b.y>P.y-.1&&b.y<P.y+P.h+.1){if(P.spinT>0){hit=true}else{hurt(b.x);hit=true}}
  if(!hit)for(var k=0;k<solids.length;k++){var q=solids[k];if(q.dead||q.hid)continue;if(b.x>q.l&&b.x<q.r&&b.y<q.t&&py>=q.t-.05){hit=true;break}}
  if(!hit&&LV.lake&&b.y<LV.lake[2]){splashFx(b.x,LV.lake[2],4);hit=true}
  if(hit||b.t>4){emit(dustPool,b.x,b.y,8,2.4,.45,.4,1.2,-.3);emit(sparkPool,b.x,b.y,5,2,.3,.25,.2,2);if(b.m.parent)b.m.parent.remove(b.m);AU.balls.splice(i,1);try{noise(.09,.03,1800,'highpass')}catch(er){}}}}
/* ---- atualização ---- */
function auUpd(dt){if(!AU)return;AU.t+=dt;auVilaUpd(dt);auIcUpd(dt);auBridgeUpd(dt);auLightUpd(dt);
  if(false)(AU.smoke||[]).forEach(function(s){s.t+=dt;var u=(s.t%3.6)/3.6;s.s.position.set(s.x+u*.8,s.y+u*2.4,s.z);var sc=.4+u*1.4;s.s.scale.set(sc,sc,1);s.s.material.opacity=Math.sin(u*Math.PI)*.35});
  /* chegada do tobogã: a tela clareia enquanto o Kuro ainda desce a calha e entra na cena */
  if(AU.sin){var si=AU.sin;si.t+=dt;var u=Math.min(1,si.t/1.3),p=AU.slideIn.getPointAt(u*u*.3+u*.7);P.x=p.x;P.y=p.y-.45;P.vx=6;P.vy=0;P.grounded=false;P.crouch=true;P.face=1;
    if(!si.cut)$('fade').style.opacity=Math.max(0,1-si.t/.35);if(((tm*30)|0)%2===0)emit(sparkPool,p.x,p.y,1,1.5,.3,.25,.2,2);
    if(u>=1){AU.sin=null;P.crouch=false;P.vx=7;emit(dustPool,P.x,P.y+.1,10,2.4,.5,.5,1.2,-.3)}}
  /* blocos de gelo que andam na água: afundam um pouco quando o Kuro pisa */
  movers.forEach(function(m,i){if(m.top0===undefined){m.top0=m.t;m.sk=0}var on=P.grounded&&P.onPlat===m;m.sk+=((on?.2:0)-m.sk)*Math.min(1,dt*5);var bob=Math.sin(AU.t*1.5+i)*.04;
    m.t=m.top0-m.sk+bob;m.b=m.t-.45;m.mesh.position.y=m.t-.225;m.mesh.rotation.z=Math.sin(AU.t*1.1+i)*.02;if(on)P.y=m.t});
  AU.g.position.x=camera.position.x*.92;AU.g.position.y=camera.position.y*.5;
  AU.mats.forEach(function(m){m.uniforms.uT.value+=dt});
  if(AU.wave){AU.wave[0].offset.set(AU.t*.018,AU.t*.03);AU.wave[1].offset.set(-AU.t*.025,AU.t*.012)}/* as ondas andam */
  auBallUpd(dt);
  /* gelo que trinca */
  var on=P.grounded?P.onPlat:null;
  AU.cracks.forEach(function(c){
    if(on===c.so&&AU.py!==c.so&&!c.brk&&!c.so.dead){c.n++;
      if(c.n===1){c.ov.material.opacity=.9;c.fr.material.opacity=.9;try{noise(.12,.06,2600,'highpass');beep(1400,.05,'square',.02)}catch(er){}emit(sparkPool,P.x,c.so.t+.05,6,2,.3,.25,.2,2);if(!AU.toldC){AU.toldC=1;toast('O gelo trincou! Na próxima pisada ele quebra')}}
      else{c.brk=.32;try{noise(.2,.08,1500,'highpass')}catch(er){}}}
    if(c.brk>0){c.brk-=dt;c.g.position.x=(c.c[0]+c.c[1])/2+Math.sin(AU.t*80)*.05;
      if(c.brk<=0){c.brk=-1;c.so.dead=true;c.fall=.01;if(P.onPlat===c.so){P.grounded=false;P.onPlat=null}
        for(var k=0;k<6;k++)emit(sparkPool,c.so.l+Math.random()*(c.so.r-c.so.l),c.so.t,3,2.5,.4,.3,.2,2);splashFx((c.so.l+c.so.r)/2,c.so.t-.4,10);try{sfx.splash()}catch(er){}}}
    if(c.fall>0){c.fall+=dt;c.g.position.y=c.t0-c.fall*c.fall*3;c.g.rotation.z=c.fall*.4;if(c.fall>1.2)c.g.visible=false}});
  AU.py=on;
  /* caiu na água do lago */
  if(LV.lake&&P.x>LV.lake[0]&&P.x<LV.lake[1]&&P.y<LV.lake[2]&&(AU.pky===undefined||AU.pky>=LV.lake[2])&&state==='play'){splashFx(P.x,LV.lake[2],16);try{sfx.splash()}catch(er){}}
  AU.pky=P.y}
function aurReset(){if(!AU)return;if(AU.lh&&!AU.lh.won){AU.lh.lit=false;AU.lh.beam.material.opacity=0;AU.lh.halo.material.opacity=.15;AU.lh.halo.scale.setScalar(5)}AU.sin=null;AU.climb=0;(AU.ics||[]).forEach(function(c){c.st=0;c.y=c.y0;c.g.visible=true;c.g.position.set(c.x,c.y0,0);c.g.scale.set(1,1,1)});
  AU.balls.forEach(function(b){if(b.m.parent)b.m.parent.remove(b.m)});AU.balls=[];AU.py=null;
  AU.cracks.forEach(function(c){c.n=0;c.brk=0;c.fall=0;c.so.dead=false;c.g.visible=true;c.g.position.set((c.c[0]+c.c[1])/2,c.t0,0);c.g.rotation.z=0;c.ov.material.opacity=0;c.fr.material.opacity=0})}
/* ===================== estilo "bloco de gelo com neve escorrendo" (Mundo 18 todo) ===================== */
var auMat=null,auFl=[];
function auMats(){if(auMat)return auMat;
  var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),r=rnd(4242);
  var gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#bfeaff');gr.addColorStop(1,'#5aa8dc');x.fillStyle=gr;x.fillRect(0,0,256,256);
  for(var i=0;i<26;i++){x.fillStyle='rgba(255,255,255,'+(.05+r()*.12)+')';x.beginPath();var px=r()*256,py=r()*256;x.moveTo(px,py);for(var k=0;k<5;k++)x.lineTo(px+(r()-.5)*90,py+(r()-.5)*90);x.fill()}
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=1.6;for(i=0;i<14;i++){x.beginPath();var ax=r()*256,ay=r()*256;x.moveTo(ax,ay);for(k=0;k<4;k++){ax+=(r()-.5)*70;ay+=(r()-.5)*70;x.lineTo(ax,ay)}x.stroke()}
  x.strokeStyle='rgba(30,90,140,.35)';x.lineWidth=1.2;for(i=0;i<10;i++){x.beginPath();ax=r()*256;ay=r()*256;x.moveTo(ax,ay);for(k=0;k<4;k++){ax+=(r()-.5)*60;ay+=(r()-.5)*60;x.lineTo(ax,ay)}x.stroke()}
  var tx=new T.CanvasTexture(c);tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(.35,.35);tx.encoding=T.sRGBEncoding;
  auMat={ice:new T.MeshStandardMaterial({map:tx,color:0xd8f2ff,roughness:.18,metalness:.12,emissive:new T.Color(0x1a5a8a),emissiveIntensity:.18}),
    snow:M(0xf4f8ff,.75,0,{emissive:new T.Color(0x203048),emissiveIntensity:.25}),
    wood:M(0x7a5232,.85),woodD:M(0x4e321e,.9),rope:M(0xc8a46a,.9),win:new T.MeshStandardMaterial({color:0xffd890,emissive:new T.Color(0xffa040),emissiveIntensity:2.2}),
    roofR:M(0x8a3a2a,.8),roofB:M(0x2e4a6a,.8),wall:M(0xa07048,.85)};
  return auMat}
/* bloco/pilar de gelo com tampa de neve e "gotas" de neve escorrendo pela frente */
var A0=null;
function auSolid(s,m3){var A=auMats(),x0=s[0],x1=s[1],top=s[2],bot=s[3]!==undefined?s[3]:-14,w=x1-x0,cx=(x0+x1)/2,vl=!!LV.vila&&x1<=LV.vila.end,D=vl?3.2:6.8,Z=vl?-.5:-1.6,r=rnd((x0*73+top*31)|0);
  var vb=bot;LV.solids.forEach(function(o){if(o!==s&&o[0]<=x0+.01&&o[1]>=x1-.01&&o[2]<top-.3&&o[2]-.32>vb)vb=o[2]-.32});
  var body=mesh(boxGeo(w,top-.32-vb,D,1),A.ice,true,true);body.position.set(cx,(top-.32+vb)/2,Z);add(body);
  var cap=mesh(boxGeo(w+.2,.4,D+.2,1),A.snow,true,true);cap.position.set(cx,top-.2,Z);add(cap);
  var G=[],n=Math.max(2,Math.round(w*1.5));
  for(var i=0;i<n;i++){var dx=x0+.1+(i+.5)/n*(w-.2),rr=.16+r()*.14,h=.25+r()*.45;
    var g=new T.SphereGeometry(rr,8,6,0,Math.PI*2,0,Math.PI);g.scale(1,h/rr,.7);g.translate(dx,top-.4,Z+D/2+.08);G.push(g)}
  [x0-.1,x1+.1].forEach(function(ex){for(var j=0;j<3;j++){var g2=new T.SphereGeometry(.15+r()*.1,8,6);g2.scale(.7,1.4+r(),1);g2.translate(ex,top-.35-r()*.2,Z+D/2-j*D/3-.3);G.push(g2)}});
  add(mesh(mgL(G),A.snow,false,false));
  solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,slip:false})}
/* placa de gelo boiando (flutua um pouquinho, só no visual) */
function auFloeMesh(w){var A=auMats(),g=new T.Group();var b=mesh(boxGeo(w,.5,2.4,1),A.ice,true,true);b.position.y=-.03;g.add(b);
  var sn=mesh(boxGeo(w*.85,.14,1.9,1),A.snow,false,true);sn.position.set(0,.27,-.1);g.add(sn);return g}
/* bloco de gelo flutuando no ar (com neve e gotas), como plataforma */
function auAirBlock(f){var A=auMats(),w=f[1]-f[0],cx=(f[0]+f[1])/2,g=new T.Group(),r=rnd((cx*37)|0);
  var b=mesh(boxGeo(w-.1,.8,2.2,1),A.ice,true,true);b.position.y=-.55;g.add(b);
  var c=mesh(boxGeo(w+.1,.32,2.4,1),A.snow,true,true);c.position.y=-.14;g.add(c);
  var G=[];for(var i=0;i<Math.round(w*1.6);i++){var sg=new T.SphereGeometry(.13+r()*.1,8,6,0,Math.PI*2,0,Math.PI);sg.scale(1,1.6+r(),.7);sg.translate(-w/2+.15+(i+.5)/Math.round(w*1.6)*(w-.3),-.32,1.2);G.push(sg)}
  g.add(mesh(mgL(G),A.snow,false,false));g.position.set(cx,f[2],0);add(g);solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.95,oneway:false,flt:true})}
function auFloe(f){if(f[2]>.9){auAirBlock(f);return}var A=auMats(),w=f[1]-f[0],cx=(f[0]+f[1])/2,g=new T.Group();
  var b=mesh(boxGeo(w,.55,2.4,1),A.ice,true,true);b.position.y=-.27;g.add(b);
  var sn=mesh(boxGeo(w*.8,.12,1.8,1),A.snow,false,true);sn.position.set((Math.random()-.5)*w*.1,.04,-.1);g.add(sn);
  g.position.set(cx,f[2],0);add(g);auFl.push(g);
  solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.5,oneway:false,flt:true});}
/* ---- pássaro-da-neve: voa em onda; quando o Kuro passa embaixo, dá um rasante e volta (desiste depois de um mergulho) ---- */
function makeSBird(){var g=new T.Group(),inner=new T.Group();g.add(inner);
  var wh=M(0xf6f8ff,.6),gy=M(0x9aaac0,.6),or=M(0xff9a2a,.4),dk=M(0x101418,.3);
  var bd=mesh(new T.SphereGeometry(.3,14,10),wh,true,false);bd.scale.set(1.15,.95,1);inner.add(bd);
  var hd=mesh(new T.SphereGeometry(.2,12,10),wh,true,false);hd.position.set(.26,.16,0);inner.add(hd);
  var cap=mesh(new T.SphereGeometry(.205,12,8,0,Math.PI*2,0,1.1),gy,false,false);cap.position.copy(hd.position);inner.add(cap);
  var bk=mesh(new T.ConeGeometry(.05,.15,6),or,false,false);bk.rotation.z=-Math.PI/2;bk.position.set(.48,.13,0);inner.add(bk);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.035,8,6),dk,false,false);ey.position.set(.36,.2,sd*.12);inner.add(ey)});
  var tl=mesh(new T.ConeGeometry(.12,.3,6),gy,false,false);tl.rotation.z=Math.PI/2+.3;tl.position.set(-.38,.06,0);inner.add(tl);
  var wg=[];[-1,1].forEach(function(sd){var p=new T.Group();p.position.set(0,.08,sd*.18);inner.add(p);var w=mesh(new T.SphereGeometry(.2,10,6),gy,false,false);w.scale.set(1,.2,1.6);w.position.z=sd*.2;p.add(w);wg.push({p:p,sd:sd})});
  add(g);return {g:g,inner:inner,wg:wg}}
function sbirdAI(e,dt){e.mt=(e.mt||0)+dt;e.cool-=dt;
  if(e.st2==='fly'){var nx=e.x+e.dir*e.speed*dt;if(nx<e.x0||nx>e.x1)e.dir=-e.dir;else e.x=nx;e.y=e.hy+Math.sin(e.mt*2.2+e.ph)*.5;
    if(e.cool<=0&&state==='play'&&Math.abs(P.x-e.x)<5&&P.y<e.y-1.2&&P.y>e.y-9&&P.x>e.x0-2&&P.x<e.x1+2){e.st2='dive';e.tx=P.x;e.ty=P.y+.4;e.dir=P.x>e.x?1:-1;try{beep(1300,.12,'sine',.03,-500)}catch(er){}}}
  else if(e.st2==='dive'){var dx=e.tx-e.x,dy=e.ty-e.y,d=Math.hypot(dx,dy);if(d<.3||e.y<e.ty+.05){e.st2='up'}else{var sp=8.5*dt;e.x+=dx/d*Math.min(sp,d);e.y+=dy/d*Math.min(sp,d)}}
  else{e.y+=4*dt;e.x+=e.dir*2.2*dt;e.x=clamp(e.x,e.x0,e.x1);if(e.y>=e.hy){e.y=e.hy;e.st2='fly';e.cool=2.4}}}
function sbirdVis(e,dt){var v=e.vis,dv=e.st2==='dive';v.g.rotation.y=0;v.inner.rotation.y=e.dir>0?-.35:Math.PI+.35;v.inner.rotation.z=dv?-.7:(e.st2==='up'?.4:0);
  var f=dv?.2:Math.sin(tm*(e.st2==='up'?22:14)+e.ph)*.8;v.wg.forEach(function(w){w.p.rotation.x=w.sd*f})}
/* ===================== Vila dos Pescadores (área de fora do Mundo 18) ===================== */
function auVila(){if(!LV.vila)return;var A=auMats(),r=rnd(2626),V=LV.vila;AU.lifts=[];AU.smoke=[];AU.ropes=[];AU.floes=AU.floes||[];
  /* passarelas de tábua (com estacas até a água) e pontes de corda (curvam e balançam) */
  (V.planks||[]).forEach(function(p){var x0=p[0],x1=p[1],y=p[2],rope=!!p[3],w=x1-x0,g=new T.Group(),n=Math.round(w/.42),PL=[];
    for(var i=0;i<n;i++){var px=x0+(i+.5)*w/n,sag=rope?-Math.sin((i+.5)/n*Math.PI)*.18:0,pg=new T.BoxGeometry(w/n-.05,.14,1.5);pg.rotateZ((r()-.5)*.04);pg.translate(px,y-.07+sag,0);PL.push(pg)}
    g.add(mesh(mgL(PL),(rope?A.wood:A.woodD),true,true));
    if(rope){[-.78,.78].forEach(function(z){var pts=[];for(var k=0;k<=12;k++){var u=k/12;pts.push(new T.Vector3(x0+u*w,y+.75-Math.sin(u*Math.PI)*.3,z))}g.add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.03,5),A.rope,false,false))});
      [x0,x1].forEach(function(px){[-.78,.78].forEach(function(z){var ph=y+.95+1.5,po=mesh(new T.CylinderGeometry(.07,.09,ph,6),A.woodD,false,false);po.position.set(px,y+.95-ph/2,z);g.add(po)})});/* postes das pontes de corda descem até a água (antes ficavam soltos no ar) */AU.ropes.push({g:g,ph:r()*6})}
    else{for(var sx=x0+.4;sx<x1;sx+=2.2)[-.6,.6].forEach(function(z){var st=mesh(new T.CylinderGeometry(.09,.11,y+1.5,6),A.woodD,false,false);st.position.set(sx,(y-1.5)/2,z);g.add(st)});
      var rl=mesh(new T.BoxGeometry(w,.07,.07),A.wood,false,false);rl.position.set((x0+x1)/2,y+.7,-.7);g.add(rl);for(sx=x0+.2;sx<x1;sx+=1.5){var rp=mesh(new T.BoxGeometry(.07,.75,.07),A.wood,false,false);rp.position.set(sx,y+.35,-.7);g.add(rp)}}
    add(g);solids.push({l:x0,r:x1,t:y,b:y-.16,oneway:false,flt:true})});
  /* escadas (o Kuro sobe como no cipó; lá em cima pula para a direita) */
  (V.ladders||[]).forEach(function(l){var x=l[0],y0=l[1],len=l[2],g=new T.Group(),L=[];
    [-.28,.28].forEach(function(dx){var s=new T.BoxGeometry(.08,len+.4,.08);s.translate(dx,len/2,0);L.push(s)});
    for(var k=.35;k<len;k+=.42){var d=new T.BoxGeometry(.56,.06,.07);d.translate(0,k,0);L.push(d)}
    g.add(mesh(mgL(L),A.wood,true,false));g.position.set(x,y0,-.35);add(g);/* atrás do Kuro (ele sobe de costas, virado para a escada) */
    vines.push({x:x,y0:y0,top:y0+len,len:len,max:len,g:g,stem:new T.Object3D(),leaves:[],ladder:1,dir:l[3]||1})});
  /* cestos de pesca no guincho: sobem e descem (elevador) */
  (V.lifts||[]).forEach(function(q){var A2=A,g=new T.Group(),bw=q.w;
    var bk=mesh(boxGeo(bw,.5,1.4,1),A2.wood,true,true);bk.position.y=-.25;g.add(bk);
    for(var k=0;k<5;k++){var sl=mesh(new T.BoxGeometry(bw+.04,.05,1.44),A2.woodD,false,false);sl.position.y=-.06-k*.1;g.add(sl)}
    var rp=mesh(new T.CylinderGeometry(.025,.025,1,4),A2.rope,false,false);g.add(rp);
    add(g);var so={l:q.x-bw/2,r:q.x+bw/2,t:q.y0,b:q.y0-.5,oneway:false,flt:true,lift:true};solids.push(so);
    var ax=mesh(new T.BoxGeometry(.18,.18,3.2),A2.woodD,true,false);ax.position.set(q.x,q.y1+3.2,-.6);add(ax);
    var pole=mesh(new T.CylinderGeometry(.14,.18,q.y1+3.2+2,8),A2.woodD,true,false);pole.position.set(q.x,(q.y1+3.2-2)/2,-2.2);add(pole);
    var wh=mesh(new T.TorusGeometry(.3,.07,6,14),A2.wood,false,false);wh.position.set(q.x,q.y1+3.2,-.6);add(wh);
    AU.lifts.push({q:q,g:g,so:so,rp:rp,wh:wh,top:q.y1+3.2,t:q.ph||0})});
  /* casinhas dos pescadores: em cima dos pilares, atrás do caminho (janela acesa, telhado com neve, chaminé com fumaça, rede e peixes) */
  (V.houses||[]).forEach(function(h){auHouse(h,r)});
  /* lanternas nas passarelas */
  (V.lamps||[]).forEach(function(q){var po=mesh(new T.CylinderGeometry(.05,.06,1.4,6),A.woodD,false,false);po.position.set(q[0],q[1]+.7,-.75);add(po);
    var lb=mesh(new T.SphereGeometry(.14,10,8),A.win,false,false);lb.position.set(q[0],q[1]+1.45,-.75);add(lb);
    var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffa040,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.6}));gl.scale.set(2,2,1);gl.position.set(q[0],q[1]+1.45,-.7);add(gl)});
  /* o tobogã de gelo: sai da última torre e desce até o lago */
  if(V.slide){var S=V.slide,pts=[];for(var k=0;k<=20;k++){var u=k/20;var su=u*u*(3-2*u);pts.push(new T.Vector3(S.x+u*28,S.y+.75-su*(S.y-.2),0))}/* desce para a direita, na frente da cena (o Kuro aparece dentro) */
    var cv=new T.CatmullRomCurve3(pts);AU.slideC=cv;auChute(cv);
    var ar=mesh(new T.TorusGeometry(1.1,.18,8,20,Math.PI),A.snow,false,false);ar.position.set(S.x,S.y,0);add(ar);
  }}
function auVilaUpd(dt){if(!LV.vila)return;var V=LV.vila;
  AU.lifts.forEach(function(L){L.t+=dt;var q=L.q,u=.5-.5*Math.cos(L.t*(q.sp||.55)),y=q.y0+(q.y1-q.y0)*u,on=P.grounded&&P.onPlat===L.so;
    L.so.t=y;L.so.b=y-.5;L.g.position.set(q.x,y,0);L.rp.scale.y=L.top-y;L.rp.position.y=(L.top-y)/2;L.wh.rotation.z=y*1.6;
    if(on)P.y=y});
  AU.ropes.forEach(function(R){var on=P.grounded&&P.onPlat&&Math.abs(P.y-R.g.position.y)<99;R.g.rotation.x=Math.sin(tm*1.6+R.ph)*.015});
  AU.smoke.forEach(function(s){s.t+=dt;var u=(s.t%3.6)/3.6;s.s.position.set(s.x+u*.8,s.y+u*2.4,s.z);var sc=.4+u*1.4;s.s.scale.set(sc,sc,1);s.s.material.opacity=Math.sin(u*Math.PI)*.35});
  AU.floes.forEach(function(f,i){f.position.y+=Math.sin(tm*1.4+i)*.0008});
  /* tobogã */
  if(V.slide){var S=V.slide;
    /* voltar subindo o tobogã: dá, mas o gelo escorrega — a calha puxa o Kuro de volta para baixo */
    var cu=(P.x-S.x)/28;AU.chOn=false;
    if(!AU.sl&&state==='play'&&cu>.03&&cu<1.02){var cc=clamp(cu,0,1),ys=S.y+.5-cc*cc*(3-2*cc)*(S.y-.2),sl2=(S.y-.2)*6*cc*(1-cc)/28;
      if(!AU.chSo){AU.chSo={l:0,r:0,t:0,b:0,oneway:false,flt:true,slip:true,chute:true};solids.push(AU.chSo)}
      if(P.y>ys-.75&&P.y<ys+2.5){AU.chSo.l=P.x-.45;AU.chSo.r=P.x+.45;AU.chSo.t=ys;AU.chSo.b=ys-.3;AU.chSo.dead=false;
        if(P.grounded&&P.y<ys&&ys-P.y<.75){P.y=ys;P.onPlat=AU.chSo}
        if(P.grounded&&P.onPlat===AU.chSo){AU.chOn=true;P.y=ys;P.vx+=15*sl2*dt;/* a ladeira empurra para baixo (direita) */
          if(P.vx<-.5&&sl2>.15){AU.slipT=(AU.slipT||0)+dt;if(AU.slipT>1.1+Math.random()*.8){AU.slipT=0;P.stun=.3;P.vx=1.6+sl2*1.5;emit(sparkPool,P.x,P.y+.1,6,2,.3,.25,.2,2);try{beep(300,.12,'sine',.03,-120)}catch(er){}if(!AU.toldS){AU.toldS=1;toast('A calha é escorregadia! Continue subindo')}}}/* escorregões no meio da subida */
          if(P.vx>.5&&((tm*20)|0)%3===0)emit(dustPool,P.x,P.y+.05,1,1.2,.3,.35,1.2,-.2)}}else AU.chSo.dead=true}
    else if(AU.chSo)AU.chSo.dead=true;
    if(AU.chOn&&P.vx<0)AU.climb=1;if(P.x>S.x+28)AU.climb=0;
    if(!AU.sl&&state==='play'&&P.x>S.x-.4&&P.x<S.x+1.5&&Math.abs(P.y-S.y)<1.6&&!(AU.climb&&P.vx<=.5)){AU.climb=0;AU.sl={t:0};P.vx=0;P.vy=0;try{beep(600,.5,'sine',.04,-300)}catch(er){}toast('Tobogã de gelo!')}
    if(AU.sl){var sl=AU.sl;sl.t+=dt;var u=Math.min(1,sl.t/1.9),p=AU.slideC.getPointAt(u*u*.3+u*.7);P.x=p.x;P.y=p.y-.45;P.vx=6;P.vy=0;P.grounded=false;P.crouch=true;P.face=1;sl.z=p.z;/* sentado no fundo do tubo */
      if(((tm*30)|0)%2===0)emit(sparkPool,p.x,p.y,1,1.5,.3,.25,.2,2);
      if(u>=1){AU.sl=null;P.crouch=false;P.vx=7;P.y=Math.max(P.y,floorBelow(P.x,P.y+1));emit(dustPool,P.x,P.y+.1,10,2.4,.5,.5,1.2,-.3);if(!AU.toldL){AU.toldL=1;toast('Kuro chegou ao Lago da Aurora!')}}}}}/* sem corte: a calha termina na margem do lago (mesma fase) */
/* (testes e fotos) leva o Kuro direto ao começo do lago */
function auEnter(){P.x=4;P.y=0;P.vx=0;P.vy=0;P.grounded=false;P.onPlat=null;P.face=1;P.warp=null;AU.sl=null;updateCamera(0,true)}
/* gelo e pilares de gelo lá no fundo (com neve em cima e pinheirinhos), e uma cachoeira congelada */
function auBack(){var A=auMats(),r=rnd(909),xe=sceneEnd(),G=[],S=[],PN=[];
  for(var x=-20;x<xe+30;x+=3+r()*5){var z=-14-r()*22,w=2.5+r()*4,h=2+r()*(LV.vila&&x<LV.vila.end?16:9),y0=Math.min(mY(x,z),-.3)-.6;/* pilar nasce dentro d'água (antes podia ficar acima dela, flutuando) */
    var g=new T.BoxGeometry(w,h,w*.8);g.rotateY((r()-.5)*.4);g.translate(x,y0+h/2,z);G.push(g);
    var c=new T.BoxGeometry(w+.25,.45,w*.8+.25);c.rotateY((r()-.5)*.2);c.translate(x,y0+h+.1,z);S.push(c);
    for(var k=0;k<4;k++){var d=new T.SphereGeometry(.2+r()*.15,6,5);d.scale(1,1.6,.8);d.translate(x-w/2+r()*w,y0+h-.25,z+w*.4);S.push(d)}
    if(r()<.45)r();}/* pinheirinho em cima do pilar saiu: atrás de outro pilar parecia flutuar */
  if(G.length){add(mesh(mgL(G),A.ice,false,true));add(mesh(mgL(S),A.snow,false,false))}
  if(PN.length){var cg=[];for(var t=0;t<3;t++){var c2=new T.ConeGeometry(1.05-t*.27,1.3,8);c2.translate(0,1.1+t*.78,0);cg.push(c2)}var im=inst(mgL(cg),M(0x1c4a3a,.85,0,{flatShading:true}),PN.length,false),dd=new T.Object3D();
    PN.forEach(function(q,j){dd.position.set(q[0],q[1],q[2]);dd.scale.setScalar(q[3]);dd.updateMatrix();im.setMatrixAt(j,dd.matrix)});add(im)}
  /* cachoeira congelada */
  [[100,-22,12],[LV.vila?LV.vila.end-60:-90,-22,12]].forEach(function(f){var fx=f[0],fz=f[1],fh=f[2],fy=mY(fx,fz);var wf=mesh(new T.PlaneGeometry(2.6,fh,1,1),new T.MeshStandardMaterial({color:0xe0f6ff,roughness:.1,emissive:new T.Color(0x5ab0e0),emissiveIntensity:.5,transparent:true,opacity:.85}),false,false);wf.position.set(fx,fy+fh/2,fz+2.1);add(wf)})}

function auIcUpd(dt){(AU.ics||[]).forEach(function(c){
  if(c.st===0){if(state==='play'&&Math.abs(P.x-c.x)<1.7&&P.y<c.y0&&P.y>c.y0-7){c.st=1;c.t=0;try{noise(.25,.03,3000,'highpass')}catch(er){}}}
  else if(c.st===1){c.t+=dt;c.g.position.x=c.x+Math.sin(c.t*70)*.05;if(c.t>.55){c.st=2;c.vy=0;c.g.position.x=c.x}}
  else if(c.st===2){c.vy-=26*dt;c.y+=c.vy*dt;c.g.position.y=c.y;var tip=c.y-1.3;
    if(state==='play'&&Math.abs(P.x-c.x)<P.w/2+.2&&tip<P.y+P.h&&c.y>P.y)hurt(c.x);
    var fl=floorBelow(c.x,c.y0-.5);if(tip<=fl||c.y<-6){c.st=3;c.t=0;c.g.visible=false;emit(sparkPool,c.x,Math.max(fl,-.7)+.2,12,3,.4,.3,.2,2);try{noise(.12,.06,2400,'highpass');beep(1600,.06,'triangle',.02)}catch(er){}}}
  else if(c.st===3){c.t+=dt;if(c.t>4){c.st=0;c.y=c.y0;c.g.visible=true;c.g.position.set(c.x,c.y0,0);c.g.scale.set(1,.01,1)}}
  if(c.st===0&&c.g.scale.y<1)c.g.scale.y=Math.min(1,c.g.scale.y+dt*.8)})}

/* calha de gelo aberta (tobogã) ao longo da curva cv */
function auChute(cv){var A=auMats();
    /* calha aberta em cima (U de gelo), bordas com neve e estacas de madeira até a água */
    var NS=90,NA=14,R=.8,pos=[],idx=[],up=new T.Vector3(0,1,0);
    for(var i=0;i<=NS;i++){var u2=i/NS,c=cv.getPointAt(u2),t=cv.getTangentAt(u2),nn=new T.Vector3(-t.y,t.x,0).normalize();if(nn.y<0)nn.negate();
      for(var a=0;a<=NA;a++){var an=Math.PI*a/NA,cz=Math.cos(an),sy=Math.sin(an);pos.push(c.x-nn.x*sy*R,c.y-nn.y*sy*R+.25,c.z+cz*R)}}
    for(i=0;i<NS;i++)for(a=0;a<NA;a++){var p0=i*(NA+1)+a,p1=p0+NA+1;idx.push(p0,p1,p0+1,p1,p1+1,p0+1)}
    var hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(pos,3));hg.setIndex(idx);hg.computeVertexNormals();
    add(mesh(hg,new T.MeshStandardMaterial({color:0xcfefff,roughness:.12,metalness:.12,emissive:new T.Color(0x2a6a9a),emissiveIntensity:.3,transparent:true,opacity:.88,side:T.DoubleSide}),false,true));
    [-1,1].forEach(function(sd){var rp=[];for(var k=0;k<=30;k++){var q=cv.getPointAt(k/30);rp.push(new T.Vector3(q.x,q.y+.27,q.z+sd*R))}add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(rp),60,.12,6,false),A.snow,false,false))});
    for(var k2=1;k2<10;k2++){var q2=cv.getPointAt(k2/10),hh2=q2.y+.6+1.5;if(q2.y<1)continue;[-.7,.7].forEach(function(z){var st=mesh(new T.CylinderGeometry(.09,.11,hh2,6),A.woodD,false,false);st.position.set(q2.x,q2.y-.55-hh2/2+.2,z);add(st)})}
}
function auHouse(h,r){var A=auMats();var x=h[0],y=h[1],w=h[2]||3,hh=h[3]||2.4,g=new T.Group(),z=-1.9;
    var wl=mesh(boxGeo(w,hh,2,1),A.wall,true,true);wl.position.set(0,hh/2,0);g.add(wl);
    for(var k=0;k<5;k++){var tb=mesh(new T.BoxGeometry(w+.02,.05,2.02),A.woodD,false,false);tb.position.y=.3+k*hh/5;g.add(tb)}
    var rf=new T.ConeGeometry(w*.82,1.3,4);rf.rotateY(Math.PI/4);rf.scale(1,1,.75);var rm=mesh(rf,r()<.5?A.roofR:A.roofB,true,false);rm.position.y=hh+.62;g.add(rm);
    var sr=new T.ConeGeometry(w*.84,.5,4);sr.rotateY(Math.PI/4);sr.scale(1,1,.77);var sm=mesh(sr,A.snow,false,false);sm.position.y=hh+1.08;g.add(sm);
    var wn=mesh(new T.PlaneGeometry(.55,.55),A.win,false,false);wn.position.set(-w*.22,hh*.55,1.04);g.add(wn);
    var wn2=wn.clone();wn2.position.x=w*.25;g.add(wn2);
    var dr=mesh(new T.PlaneGeometry(.6,1.1),A.woodD,false,false);dr.position.set(w*.02,.55,1.04);g.add(dr);
    var ch=mesh(new T.BoxGeometry(.3,.8,.3),M(0x5a4a44,.9),false,false);ch.position.set(w*.28,hh+1.1,-.2);g.add(ch);
    var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffb050,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.55}));gl.scale.set(2.4,2.4,1);gl.position.set(0,hh*.55,1.3);g.add(gl);
    if(r()<.7){for(k=0;k<3;k++){var fs=mesh(new T.SphereGeometry(.11,8,6),M(0x8ab0c8,.4,.3),false,false);fs.scale.set(1.8,.7,.5);fs.position.set(-w/2-.25,hh*.7-k*.35,.6);g.add(fs)}
      var ln=mesh(new T.CylinderGeometry(.01,.01,1.2,3),A.rope,false,false);ln.position.set(-w/2-.25,hh*.7-.3,.6);g.add(ln)}
    g.position.set(x,y,z);add(g);
    for(k=0;k<4;k++){var sp=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xb8c4d4,transparent:true,depthWrite:false,opacity:0}));add(sp);AU.smoke.push({s:sp,x:x+w*.28,y:y+hh+1.5,z:z-.2,t:k*.9})}}

/* ===================== parte 3: pontes de aurora e o farol ===================== */
/* ponte de corda com tábuas de luz da aurora: ficam firmes, piscam e somem por um tempo (ritmo da aurora) */
function auBridgeBuild(){AU.br=[];var A=auMats();
  (LV.abridges||[]).forEach(function(b){var n=Math.round(b.x1-b.x0),w=(b.x1-b.x0)/n,pl=[];
    var cols=[0x3dffa0,0x40ffd8,0x5aa0ff,0x9a6aff,0xff6ad8];
    for(var i=0;i<n;i++){var x=b.x0+(i+.5)*w,c=cols[i%cols.length];
      var m=mesh(new T.BoxGeometry(w-.08,.16,1.5),new T.MeshBasicMaterial({color:c,transparent:true,opacity:.9,fog:false,toneMapped:false}),false,false);m.position.set(x,b.y-.08,0);add(m);
      var so={l:x-w/2,r:x+w/2,t:b.y,b:b.y-.16,oneway:false,flt:true};solids.push(so);pl.push({m:m,so:so})}
    [-.78,.78].forEach(function(z){var pts=[];for(var k=0;k<=12;k++){var u=k/12;pts.push(new T.Vector3(b.x0+u*(b.x1-b.x0),b.y+.85-Math.sin(u*Math.PI)*.25,z))}add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.035,5),A.rope,false,false));
      for(var px=b.x0;px<=b.x1+.01;px+=(b.x1-b.x0)/4){var po=mesh(new T.CylinderGeometry(.07,.08,1.1,6),A.woodD,false,false);po.position.set(px,b.y+.35,z);add(po);var cp=mesh(new T.SphereGeometry(.1,8,6),A.snow,false,false);cp.position.set(px,b.y+.92,z);add(cp)}});
    AU.br.push({b:b,pl:pl,on:true})})}
function auBridgeState(b,t){var per=b.per||4.2,u=(((t+(b.ph||0))%per)+per)%per;return u<2.6?'on':(u<3.2?'blink':'off')}
function auBridgeUpd(dt){(AU.br||[]).forEach(function(B){var st=auBridgeState(B.b,AU.t),on=st!=='off';
  if(on!==B.on){B.on=on;if(!on&&P.grounded&&B.pl.some(function(p){return P.onPlat===p.so})){P.grounded=false;P.onPlat=null}
    try{if(on)beep(880,.12,'sine',.02);else beep(440,.12,'sine',.02)}catch(er){}if(!AU.toldB&&!on&&P.x>B.b.x0-12&&P.x<B.b.x1+4){AU.toldB=1;toast('As pontes de aurora somem e voltam no ritmo da luz! Espere ela acender')}}
  B.pl.forEach(function(p,i){p.so.dead=!on;p.m.visible=on&&!(st==='blink'&&((AU.t*10+i*.0)|0)%2===0);p.m.material.opacity=.7+Math.sin(AU.t*4+i*.6)*.25})})}
/* o farol: torre listrada vermelha e branca no alto do penhasco, com degraus em volta; lá em cima o Kuro acende a Luz da Aurora */
function auLightBuild(){var F=LV.lighthouse;if(!F)return;var A=auMats(),g=new T.Group(),H=F.top-F.y,R0=2.4,R1=1.8,red=M(0xc8302a,.6),wh=M(0xf4f2ee,.6);
  var bands=6;for(var k=0;k<bands;k++){var h=H/bands,r0=R0+(R1-R0)*k/bands,r1=R0+(R1-R0)*(k+1)/bands,c=mesh(new T.CylinderGeometry(r1,r0,h,24),k%2?red:wh,true,true);c.position.y=h*(k+.5);g.add(c)}
  var gal=mesh(new T.CylinderGeometry(R1+1.3,R1+1.3,.25,24),M(0x3a3a44,.5,.5),true,true);gal.position.y=H;g.add(gal);
  for(var a=0;a<16;a++){var an=a/16*Math.PI*2,rl=mesh(new T.CylinderGeometry(.04,.04,.8,4),M(0x2a2a30,.5,.5),false,false);rl.position.set(Math.cos(an)*(R1+1.2),H+.5,Math.sin(an)*(R1+1.2));g.add(rl)}
  var rail=mesh(new T.TorusGeometry(R1+1.2,.04,4,32),M(0x2a2a30,.5,.5),false,false);rail.rotation.x=Math.PI/2;rail.position.y=H+.9;g.add(rail);
  var gl=mesh(new T.CylinderGeometry(1.1,1.1,1.5,12),new T.MeshStandardMaterial({color:0xfff4d0,emissive:new T.Color(0x806020),emissiveIntensity:.4,transparent:true,opacity:.8}),false,false);gl.position.y=H+1;g.add(gl);
  var roof=mesh(new T.ConeGeometry(1.5,1.2,16),red,true,false);roof.position.y=H+2.35;g.add(roof);var sn=mesh(new T.ConeGeometry(1.55,.5,16),A.snow,false,false);sn.position.y=H+2.6;g.add(sn);
  var bl=mesh(new T.SphereGeometry(.18,8,6),red,false,false);bl.position.y=H+3.05;g.add(bl);
  for(k=0;k<4;k++){var wn=mesh(new T.PlaneGeometry(.45,.65),A.win,false,false);var yy=H*(k+.6)/4.6,rr=R0+(R1-R0)*yy/H+.02;wn.position.set(0,yy,rr);g.add(wn)}
  var beam=new T.Mesh(new T.ConeGeometry(3.2,26,24,1,true),new T.MeshBasicMaterial({color:0xfff0b0,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,fog:false}));beam.geometry.translate(0,-13,0);beam.rotation.z=Math.PI/2;
  var piv=new T.Group();piv.position.y=H+1;piv.add(beam);g.add(piv);
  var halo=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffd880,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.15}));halo.scale.set(5,5,1);halo.position.y=H+1;g.add(halo);
  g.position.set(F.x,F.y,-3.2);add(g);
  /* degraus de pedra com neve em volta do farol (o caminho em espiral) */
  (F.steps||[]).forEach(function(q){var w=q[1]-q[0],st=mesh(boxGeo(w,.4,1.6,1),M(0x8a8e9a,.85),true,true);st.position.set((q[0]+q[1])/2,q[2]-.2,-.6);add(st);
    var sc=mesh(boxGeo(w+.1,.14,1.7,1),A.snow,false,false);sc.position.set((q[0]+q[1])/2,q[2]+.02,-.6);add(sc);solids.push({l:q[0],r:q[1],t:q[2],b:q[2]-.4,oneway:false,flt:true})});
  /* plataforma da galeria (onde o Kuro chega) */
  solids.push({l:F.x-2.5,r:F.x+2.5,t:F.top,b:F.top-.25,oneway:false,flt:true});
  AU.lh={g:g,gl:gl,beam:beam,piv:piv,halo:halo,lit:false,F:F}}
function auLightUpd(dt){var L=AU.lh;if(!L)return;
  if(!L.lit&&state==='play'&&P.grounded&&P.y>L.F.top-.3&&Math.abs(P.x-L.F.x)<3.5){/* em pé na galeria do farol */L.lit=true;L.t=0;toast('Você acendeu a Luz da Aurora!');try{beep(523,.2,'triangle',.05);beep(659,.2,'triangle',.05,0,.15);beep(784,.4,'triangle',.05,0,.3)}catch(er){}emit(sparkPool,L.F.x,L.F.top+1.5,30,5,1,.4,.2,3)}
  if(L.lit){L.t+=dt;var k=Math.min(1,L.t/.8);L.beam.material.opacity=.22*k;L.halo.material.opacity=.15+.75*k;L.halo.scale.setScalar(5+9*k);L.gl.material.emissiveIntensity=.4+2.6*k;L.piv.rotation.y+=dt*.9;if(L.t>2.2&&!L.won&&state==='play'){L.won=1;winLevel()}}}/* o feixe acende e gira um pouco; aí a fase termina */

/* mapa de relevo das ondas (normal map), 2 variações, repetem sem emenda */
function auWaveTex(){var out=[];[[3,5,7,11],[4,6,9,13]].forEach(function(fq,k){var N=256,c=document.createElement('canvas');c.width=c.height=N;var x=c.getContext('2d'),im=x.createImageData(N,N),r=rnd(77+k),W=[];
  for(var i=0;i<9;i++){var a=r()*Math.PI*2,f=fq[i%4]+(i>3?fq[(i+1)%4]:0);W.push([Math.round(Math.cos(a)*f),Math.round(Math.sin(a)*f*.6)||1,r()*6.28,1/(1+i*.45)])}
  function h(u,v){var s=0;for(var i=0;i<W.length;i++){var w=W[i];s+=Math.sin((u*w[0]+v*w[1])*2*Math.PI/N+w[2])*w[3]}return s}
  for(var v=0;v<N;v++)for(var u=0;u<N;u++){var dx=h(u+1,v)-h(u-1,v),dy=h(u,v+1)-h(u,v-1),nx=-dx*3,ny=-dy*3,nz=1,l=Math.hypot(nx,ny,nz),o=(v*N+u)*4;
    im.data[o]=(nx/l*.5+.5)*255;im.data[o+1]=(ny/l*.5+.5)*255;im.data[o+2]=(nz/l*.5+.5)*255;im.data[o+3]=255}
  x.putImageData(im,0,0);var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;out.push(t)});return out}
/* placa do lago congelado com a borda irregular (gelo quebrado), de x0 a x1 */
function auIceShape(x0,x1,d){var s=new T.Shape(),r=rnd(55);s.moveTo(x0,0);s.lineTo(x1,0);for(var z=0;z<=d;z+=2)s.lineTo(x1+(r()-.5)*3+Math.sin(z*.4)*2,z);for(var x=x1;x>=x0;x-=3)s.lineTo(x,d+(r()-.5)*2);for(z=d;z>=0;z-=2)s.lineTo(x0+(r()-.5)*3,z);return s}
