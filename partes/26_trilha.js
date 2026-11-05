/*@@parte:26_trilha.js*/
/* ===================== Mundo 12: Trilha da Árvore Gigante (Terra Nova) =====================
   parte 0: praia da chegada (mar, coqueiros, barquinho)  ·  parte 1: Trilha Verde (raízes, flores, tronco oco, torre de vigia) */
function mgL(list){return mergeG(list.map(function(g){return {g:g}}))}
var trIntro=null,trIntroDone=false,trFx=null;
var trSandM=null,trSandSideM=null,trBarkM=null,trPlankM=null,trRockM=null,trRiv=null;
function trMats(){
  if(trSandM)return;
  trSandM=pbr(texStone,.96,.35,{color:new T.Color(0xf6e2b6)});
  trSandSideM=pbr(texStone,.97,.5,{color:new T.Color(0xdcc08c)});
  trBarkM=pbr(texWood,.95,1.4,{color:new T.Color(0x8a6444)});
  trPlankM=pbr(texWood,.8,.9,{color:new T.Color(0xc8935a)});
  trRockM=pbr(texStone,.82,.9,{color:new T.Color(0x8e9488)});
}
/* ---------- plataformas: chão de terra com grama, areia da praia, tronco oco e tábuas da torre ---------- */
function buildPlatformsTrail(m3){
  trMats();var r=rnd(1212),ROOT=[],STONE=[];trRiv={wob:[],logs:[],planks:null,safe:null};
  LV.solids.forEach(function(s){
    var x0=s[0],x1=s[1],top=s[2],bot=s[3]!==undefined?s[3]:-14,w=x1-x0,cx=(x0+x1)/2,sand=s[5]==='sand';
    if(s[5]==='stone'){buildRiverStone(s,r);return}
    if(s[5]==='isle'){/* ilhota de pedra com grama em cima, saindo da água */
      var rb=mesh(boxGeo(w,top-.3-bot,6.8,2.2),trRockM,true,true);rb.position.set(cx,(top-.3+bot)/2,-1.6);add(rb);
      var il=mesh(boxGeo(w+.14,.34,6.94,2.2),m3.top);il.position.set(cx,top-.17,-1.6);add(il);
      for(var q=0;q<Math.ceil(w*1.4);q++){var bs=mesh(new T.DodecahedronGeometry(.35+r()*.45,1),trRockM,false,true);bs.position.set(x0+r()*w,LV.river.y+(r()-.3)*.4,1.9+r()*.3);bs.scale.set(1.3,.7,.8);add(bs)}
      solids.push({l:x0,r:x1,t:top,b:bot,oneway:false});return}
    var body=mesh(boxGeo(w,top-.3-bot,6.8,2.6),sand?trSandSideM:m3.side);body.position.set(cx,(top-.3+bot)/2,-1.6);add(body);
    var lip=mesh(boxGeo(w+(sand?0:.14),.34,6.94,2.2),sand?trSandM:m3.top);lip.position.set(cx,top-.17,-1.6);add(lip);
    solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,sand:sand});
    if(sand)return;
    /* raízes penduradas na frente do barranco e pedras encravadas na terra */
    for(var x=x0+.4;x<x1-.3;x+=.9+r()*1.6){
      var len=.5+r()*1.4,pts=[],sw=(r()-.5)*.5;
      for(var k=0;k<=5;k++){var u=k/5;pts.push(new T.Vector3(x+sw*u*u+Math.sin(u*3+x)*.08,top-.28-u*len,1.86+u*.05))}
      ROOT.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),6,.035+r()*.03,4,false));
      if(r()<.45){var sg=new T.DodecahedronGeometry(.18+r()*.22,0);STONE.push(xf(sg,[x+.4+r()*.5,top-.9-r()*1.6,1.78],[r()*3,r()*3,r()*3],[1.2,.8,.5]))}
    }
  });
  if(ROOT.length)add(mesh(mergeG(ROOT.map(function(g){return {g:g,c:0x5a3e26}}),true),M(0xffffff,.95,0,{vertexColors:true}),false,false));
  if(STONE.length)add(mesh(mergeG(STONE.map(function(g){return {g:g,c:0x8a8478}}),true),M(0xffffff,.9,0,{vertexColors:true,flatShading:true}),false,true));
  LV.floats.forEach(function(f){
    var w=f[1]-f[0],cx=(f[0]+f[1])/2,kind=f[3];
    if(kind==='log')buildHollowLog(f[0],f[1],f[2]);
    else if(kind==='bridge')buildRopeBridge(f[0],f[1],f[2]);
    else if(kind==='ledge')buildGrassLedge(f[0],f[1],f[2],r);
    else if(kind==='branch')buildBranchPlat(f[0],f[1],f[2],r);
    else if(kind==='canopy')buildCanopyPlat(f[0],f[1],f[2],r);
    else if(kind==='cave')buildCaveLedge(f[0],f[1],f[2]);
    else if(kind==='summit12')buildSummitDeck(f[0],f[1],f[2],r);
    else{/* tábuas pregadas em duas vigas (plank e porch) */
      var g=new T.Group();g.position.set(cx,f[2],0);add(g);
      for(var px=-w/2+.2;px<w/2-.1;px+=.42){var pl=mesh(new T.BoxGeometry(.38,.12,2.1),trPlankM,true,true);pl.position.set(px+.19,-.06,0);pl.rotation.y=(r()-.5)*.04;g.add(pl)}
      [-.75,.75].forEach(function(z){var bm=mesh(new T.BoxGeometry(w,.16,.16),trBarkM,true,false);bm.position.set(0,-.2,z);g.add(bm)});
    }
    solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.5,oneway:kind==='ledge'||kind==='cave',flt:true});/* pedras do jardim: dá para atravessar por baixo e cair em cima */
  });
}
/* ---------- Rio Cristalino ---------- */
function trInRiver(x,m){var R=LV.river;return !!R&&x>R.x0-(m||0)&&x<R.x1+(m||0)}
function buildRiverStone(s,r){/* pedra redonda e molhada, com musgo em cima; algumas balançam quando o Kuro pisa */
  var x0=s[0],x1=s[1],top=s[2],w=x1-x0,cx=(x0+x1)/2,h=top+2.2,g=new T.Group();g.position.set(cx,0,-.1);add(g);
  var cg=new T.CylinderGeometry(w*.5,w*.62+.25,h,10,4),pa=cg.attributes.position;
  for(var i=0;i<pa.count;i++){var y=pa.getY(i),a=Math.atan2(pa.getZ(i),pa.getX(i)),k=1+Math.sin(a*3+cx)*.08+Math.sin(a*5+y*2)*.05;pa.setX(i,pa.getX(i)*k);pa.setZ(i,pa.getZ(i)*k*1.25)}
  cg.translate(0,top-h/2-.02,0);cg.computeVertexNormals();g.add(mesh(cg,trRockM,true,true));
  var cap=mesh(new T.SphereGeometry(w*.5,14,6,0,6.283,0,1.25),mossM,false,true);cap.scale.set(1,.22,1.25);cap.position.y=top-.12;g.add(cap);
  var so={l:x0,r:x1,t:top,b:-2.2,oneway:false,flt:true,stone:true};solids.push(so);
  if(s[6]==='wob')trRiv.wob.push({so:so,g:g,t0:top,d:0,ph:r()*6});
}
function buildRopeBridge(x0,x1,top){/* ponte suspensa: tábuas que afundam um pouco embaixo do Kuro, cordas de corrimão */
  var n=Math.round((x1-x0)/.5),pg=new T.BoxGeometry(.42,.1,1.7),im=new T.InstancedMesh(pg,trPlankM,n);im.castShadow=true;im.receiveShadow=true;add(im);
  var BP={im:im,n:n,x0:x0,x1:x1,top:top,d:[]};for(var i=0;i<n;i++)BP.d.push(0);(trRiv.planksL=trRiv.planksL||[]).push(BP);trPlankPose(true);
  var R=[],P=[];[x0,x1].forEach(function(x,ei){[-.95,.95].forEach(function(z){P.push(xf(new T.CylinderGeometry(.11,.13,3.6,7),[x,top-.6,z]))});
    /* pé da ponte: se não tem chão embaixo da ponta, um pilar de toras desce até o chão */
    var g=-99;LV.solids.forEach(function(sd){if(x>=sd[0]-.05&&x<=sd[1]+.05&&sd[2]<=top+.05&&sd[2]>g)g=sd[2]});
    if(g<top-.4){var bot=g<-50?-14:g,hh=top-bot,px=x+(ei?.35:-.35);
      [-1,1].forEach(function(sd){P.push(xf(new T.CylinderGeometry(.22,.28,hh,8),[px,bot+hh/2,sd*.85]))});
      for(var yb=top-1.2;yb>bot+.6;yb-=1.8){P.push(xf(new T.BoxGeometry(.14,.14,1.9),[px,yb,0]));P.push(xf(new T.BoxGeometry(.12,.12,Math.hypot(1.7,1.6)),[px,yb-.8,0],[Math.atan2(1.6,1.7)*(((yb*10)|0)%2?1:-1),0,0]))}
      P.push(xf(new T.BoxGeometry(1.1,.18,2.2),[px,top-.2,0]))}});
  [-.95,.95].forEach(function(z){var pts=[];for(var k=0;k<=12;k++){var u=k/12;pts.push(new T.Vector3(x0+(x1-x0)*u,top+1.1-Math.sin(u*Math.PI)*.45,z))}R.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.045,5,false));
    var pb=[];for(k=0;k<=12;k++){u=k/12;pb.push(new T.Vector3(x0+(x1-x0)*u,top-.08-Math.sin(u*Math.PI)*.06,z*.9))}R.push(new T.TubeGeometry(new T.CatmullRomCurve3(pb),24,.035,4,false));
    for(var x=x0+1;x<x1-.5;x+=1.2){var hy=top+1.1-Math.sin((x-x0)/(x1-x0)*Math.PI)*.45;R.push(xf(new T.CylinderGeometry(.02,.02,hy-top,4),[x,(hy+top)/2,z]))}});
  add(mesh(mgL(P),trBarkM,true,false));add(mesh(mgL(R),M(0xd8c08a,.9),false,false));
}
function trPlankPose(all){(trRiv&&trRiv.planksL||[]).forEach(function(B){var D=trPlankPose.D||(trPlankPose.D=new T.Object3D()),on=P.grounded&&P.y>B.top-.3&&P.y<B.top+.3&&P.x>B.x0&&P.x<B.x1,ch=all,wv=(P.wpush&&Math.abs(P.x-(B.x0+B.x1)/2)<(B.x1-B.x0))?P.wpush*.04:0;
  for(var i=0;i<B.n;i++){var x=B.x0+(i+.5)*(B.x1-B.x0)/B.n,u=(x-B.x0)/(B.x1-B.x0),want=on?.16*Math.exp(-Math.pow((x-P.x)/1.6,2)):0,d=B.d[i];B.d[i]=d+(want-d)*.25;
    D.position.set(x,B.top-.06-B.d[i]+Math.sin(tm*1.5+i*.4)*.012,Math.sin(u*Math.PI)*(Math.sin(tm*1.3)*.06+wv*3));D.rotation.set(Math.sin(u*Math.PI)*(Math.sin(tm*1.3)*.03+wv),0,(i%3-1)*.02);D.updateMatrix();B.im.setMatrixAt(i,D.matrix)}
  B.im.instanceMatrix.needsUpdate=true})}
function pebbleTex(){var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),r=rnd(919);x.fillStyle='#b8a888';x.fillRect(0,0,256,256);
  for(var i=0;i<420;i++){var px=r()*256,py=r()*256,rr=3+r()*9,cs=['#8a8270','#c8bca0','#6e6a60','#a89a7a','#d8cfb8','#7a8a7a'][(r()*6)|0];x.fillStyle=cs;x.beginPath();x.ellipse(px,py,rr,rr*(.6+r()*.4),r()*3,0,6.283);x.fill()}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;return t}
function buildRiverDecor(){
  var R=LV.river;if(!R)return;var r=rnd(3131),lite=LITE,w=R.x1-R.x0+2,cx=(R.x0+R.x1)/2;
  /* fundo de pedrinhas (dá para ver pela água limpa) */
  var bt=pebbleTex();bt.repeat.set(w/3,4);var bed=mesh(new T.PlaneGeometry(w,13,1,1),new T.MeshStandardMaterial({map:bt,color:0x8ad0c4,roughness:.9}),false,true);bed.rotation.x=-Math.PI/2;bed.position.set(cx,R.y-1.3,1);add(bed);
  /* água transparente correndo para a direita, com espuma em volta das pedras */
  var foam=[];solids.forEach(function(q){if(q.stone||(q.t<3&&q.l>R.x0-1&&q.r<R.x1+1&&q.b<-2))foam.push(q)});
  var wg=new T.PlaneGeometry(w,13,lite?40:110,lite?6:14);wg.rotateX(-Math.PI/2);
  var wm=new T.MeshStandardMaterial({color:0x28b4d8,roughness:.35,metalness:0,envMapIntensity:.15,transparent:true,opacity:.42,depthWrite:false});matReg.push(wm);
  var SX=foam.map(function(q){return (q.l+q.r)/2}),SW=foam.map(function(q){return (q.r-q.l)/2});while(SX.length<24){SX.push(-999);SW.push(0)}SX=SX.slice(0,24);SW=SW.slice(0,24);
  wm.onBeforeCompile=function(sh){sh.uniforms.time=lushU.time;sh.uniforms.sx={value:SX};sh.uniforms.sw={value:SW};
    sh.vertexShader='uniform float time;varying vec3 vWp;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec4 wq=modelMatrix*vec4(position,1.);transformed.y+=sin(time*2.+wq.x*.9-wq.z*.6)*.035+sin(time*1.3-wq.x*.5+wq.z)*.03;vWp=wq.xyz;');
    sh.fragmentShader='uniform float time;uniform float sx[24];uniform float sw[24];varying vec3 vWp;\n'+sh.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\nfloat st=pow(.5+.5*sin(vWp.x*2.2-time*4.+sin(vWp.z*1.7)*1.5),10.)*.18+pow(.5+.5*sin(vWp.x*3.1-time*5.5+vWp.z*2.3),16.)*.2;float fm=0.;for(int i=0;i<24;i++){float d=abs(vWp.x-sx[i])-sw[i];fm=max(fm,(1.-smoothstep(0.,.55,d))*step(-1.7,vWp.z)*step(vWp.z,1.6));}fm*=.6+.4*sin(time*6.+vWp.z*5.+vWp.x*3.);gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.95,1.,1.),clamp(st+fm*.7,0.,1.));gl_FragColor.a=clamp(gl_FragColor.a+st*.35+fm*.45,0.,1.);')};
  var wa=mesh(wg,wm,false,false);wa.position.set(cx,R.y,1);wa.renderOrder=2;add(wa);
  /* juncos e taboas na beira do fundo, vitórias-régias, pedrinhas no fundo e peixinhos que pulam */
  var RD=[],LP=[];for(var x=R.x0;x<R.x1;x+=.35+r()*.8){var z=-4.8+r()*.9;for(var k=0;k<3;k++){var hh=.9+r()*1.1;RD.push({g:xf(new T.CylinderGeometry(.02,.03,hh,4),[x+(r()-.5)*.3,R.y+hh/2,z+(r()-.5)*.3],[(r()-.5)*.2,0,(r()-.5)*.25]),c:0x5a8a3a});
      if(r()<.25)RD.push({g:xf(new T.CylinderGeometry(.06,.06,.3,6),[x,R.y+hh-.1,z]),c:0x6a4020})}}
  for(x=R.x0+1;x<R.x1-1;x+=1.4+r()*2.6){var zz=-3.8+r()*1.6;var lg=new T.CircleGeometry(.35+r()*.25,12,.3,5.9);lg.rotateX(-Math.PI/2);LP.push({g:xf(lg,[x,R.y+.03,zz]),c:0x4a9a3a});if(r()<.35)LP.push({g:xf(new T.SphereGeometry(.12,8,5),[x+.1,R.y+.1,zz],0,[1,.6,1]),c:0xffb0d0})}
  add(mesh(mergeG(RD,true),M(0xffffff,.8,0,{vertexColors:true}),false,false));add(mesh(mergeG(LP,true),M(0xffffff,.7,0,{vertexColors:true,side:T.DoubleSide}),false,false));
  trRiv.fish=[];if(!lite)for(var f=0;f<4;f++){var fg=new T.Group(),bd=mesh(new T.SphereGeometry(.18,10,7),M(0xff8a3a,.5),false,false);bd.scale.set(1.6,.8,.55);fg.add(bd);var tl=mesh(new T.ConeGeometry(.12,.22,4),M(0xff6a2a,.5),false,false);tl.rotation.z=Math.PI/2;tl.position.x=-.32;fg.add(tl);fg.visible=false;add(fg);trRiv.fish.push({g:fg,x:R.x0+8+f*18,t:r()*4,z:-1.5-r()*2})}
}
/* troncos que descem o rio (sempre para a direita): aparecem lá atrás e afundam no fim */
function buildRiverLogs(){
  var L=LV.rlogs;if(!L)return;var D=L.x1-L.x0;
  for(var i=0;i<L.n;i++){var g=new T.Group();add(g);var lg=mesh(barkCyl(.42,.44,L.len,12),trBarkM,true,true);lg.rotation.z=Math.PI/2;g.add(lg);
    [-1,1].forEach(function(sd){var c=mesh(new T.CircleGeometry(.42,12),M(0xd8a870,.85),false,false);c.rotation.y=sd*Math.PI/2;c.position.x=sd*L.len/2;g.add(c)});
    var so={l:0,r:0,t:L.y,b:L.y-.6,oneway:false,flt:true,mover:true,log:true,x:0,px:0,vxm:0};solids.push(so);trRiv.logs.push({g:g,so:so,lg:lg,ph:i*D/L.n})}
  trRiverLogs(0);
}
function trRiverLogs(dt){
  var L=LV.rlogs;if(!L||!trRiv)return;var D=L.x1-L.x0,tt=timeT;
  trRiv.logs.forEach(function(o){var u=((tt*L.spd+o.ph)%D+D)%D,x=L.x0+u,e=Math.min(1,u/1.4,(D-u)/1.4),so=o.so;
    if(Math.abs(x-so.x)>D*.5&&P.onPlat===so){P.onPlat=null;P.grounded=false}
    so.px=Math.abs(x-so.x)>D*.5?x:so.x;so.x=x;so.vxm=L.spd;so.l=x-L.len/2;so.r=x+L.len/2;so.t=L.y-(1-e)*1.1;so.b=so.t-.6;so.dead=e<.25;
    o.g.position.set(x,so.t-.42+Math.sin(tm*2+o.ph)*.03,.1);o.lg.rotation.x+=dt*L.spd/.42*.3})}
function trRiverFall(){
  var R=LV.river;if(!R||state!=='play'||dyn)return;
  if(P.grounded&&P.onPlat&&!P.onPlat.log&&trInRiver(P.x,3))trRiv.safe={x:Math.min(Math.max(P.x,P.onPlat.l+.4),P.onPlat.r-.4),y:P.onPlat.t};
  if(!trInRiver(P.x)||P.y>R.y-.35)return;
  var sf=trRiv.safe||{x:R.x0-1.5,y:1.4};splashFx(P.x,R.y,14);try{sfx.splash()}catch(e){}
  hearts--;setHearts();try{sfx.hurt()}catch(e){}
  if(hearts<=0){startDeath('fall',function(){lose()});return}
  P.x=sf.x;P.y=sf.y+.05;P.vx=P.vy=0;P.inv=1.6;P.onPlat=null;P.grounded=false;emit(sparkPool,P.x,P.y+.8,10,2.5,.5,.3,.2,2);
  if(!trRiv.told){trRiv.told=true;toast('A correnteza levou o Kuro de volta! Pule de pedra em pedra')}
}
function updRiver(dt){
  if(!trRiv)return;
  trRiv.wob.forEach(function(o){var on=P.onPlat===o.so&&P.grounded,want=on?.24:0;o.d+=(want-o.d)*Math.min(1,dt*(on?5:2.5));o.so.t=o.t0-o.d;o.g.position.y=-o.d;o.g.rotation.z=Math.sin(tm*7+o.ph)*o.d*.35;o.g.rotation.x=Math.cos(tm*6+o.ph)*o.d*.25});
  trRiverLogs(dt);trPlankPose(false);trRiverFall();
  (trRiv.fish||[]).forEach(function(f){f.t-=dt;if(f.t<0){f.g.visible=true;var u=-f.t/1.1;if(u>1){f.g.visible=false;f.t=3+Math.random()*4;f.x=LV.river.x0+4+Math.random()*(LV.river.x1-LV.river.x0-8);splashFx(f.x+1.2,LV.river.y,5);return}
    f.g.position.set(f.x+u*2.4,LV.river.y+Math.sin(u*Math.PI)*1.4,f.z);f.g.rotation.z=Math.cos(u*Math.PI)*.9;if(u<.05&&!f.sp){f.sp=1;splashFx(f.x,LV.river.y,5)}}else f.sp=0});
}
/* ---------- Jardim dos Cogumelos ---------- */
var TR_BOUNCE={r:19.5,b:25,y:26.2},TR_SHC={r:['#bf0702','#f4f0ea'],b:['#072cbf','#dfeaf6'],y:['#c85a00','#ffd860']};/* cores já compensadas (a textura não passa pelo ajuste de cor do Alto) */
function buildGrassLedge(x0,x1,top,r){/* pedra redonda flutuante coberta de grama */
  var w=x1-x0,cx=(x0+x1)/2,g=new T.Group();g.position.set(cx,top,-.3);add(g);
  var rk=mesh(new T.DodecahedronGeometry(1,1),trRockM,true,true);rk.scale.set(w*.55,1.5,1.5);rk.position.y=-1.25;g.add(rk);
  var gc=mesh(new T.SphereGeometry(1,18,8,0,6.283,0,1.2),mossM,true,true);gc.scale.set(w*.56,.5,1.55);gc.position.y=-.42;g.add(gc);
  var TF=[];for(var i=0;i<w*9;i++){var a=r()*6.283,rr=Math.sqrt(r());TF.push(xf(new T.ConeGeometry(.05,.3+r()*.25,4),[Math.cos(a)*rr*w*.5,.02,Math.sin(a)*rr*1.3],[(r()-.5)*.4,0,(r()-.5)*.4]))}
  g.add(mesh(mgL(TF),M(0x6ac83a,.85),false,false));
  for(var k=0;k<3;k++){var v=mesh(new T.CylinderGeometry(.03,.03,1.2+r()*1.4,4),M(0x3f8a2a,.8),false,false);v.position.set((r()-.5)*w*.8,-2.2-r()*.6,.6+r()*.5);g.add(v)}
}
function shroomCapTex(c){var cv=document.createElement('canvas');cv.width=256;cv.height=128;var x=cv.getContext('2d');x.fillStyle=c[0];x.fillRect(0,0,256,128);
  if(c[0]==='#bf0702'){x.strokeStyle=c[1];[30,62,92].forEach(function(y,i){x.lineWidth=9-i*2;x.beginPath();x.moveTo(0,y);x.lineTo(256,y);x.stroke()})}/* vermelho com anéis brancos */
  else{x.fillStyle=c[1];var rr=rnd(c[0].length*7+c[0].charCodeAt(2));for(var i=0;i<22;i++){x.beginPath();x.arc(rr()*256,10+rr()*96,5+rr()*9,0,6.283);x.fill()}}
  var t=new T.CanvasTexture(cv);t.encoding=T.sRGBEncoding;return t}
function buildShrooms(){
  trRiv=trRiv||{};trRiv.shr=[];(LV.shrooms||[]).forEach(function(m,i){
    var g=new T.Group();g.position.set(m.x,0,-.1);add(g);var base=trGroundAt(m.x);if(base<-50||base>m.top)base=-6;
    var sh=m.top-.5-base,stem=mesh(new T.CylinderGeometry(.32,.45,sh,12),M(0xf4ead8,.8),true,true);stem.position.y=base+sh/2;g.add(stem);
    var ring=mesh(new T.TorusGeometry(.42,.07,6,16),M(0xe8dcc4,.8),false,false);ring.rotation.x=Math.PI/2;ring.position.y=m.top-1.1;g.add(ring);
    var cap=new T.Group();cap.position.y=m.top-.55;g.add(cap);
    var cm=new T.MeshStandardMaterial({map:shroomCapTex(TR_SHC[m.c]),roughness:.45,emissive:m.c==='y'?0x5a3a00:0x000000,emissiveIntensity:.3});
    var cg=mesh(new T.SphereGeometry(1,24,12,0,6.283,0,1.45),cm,true,true);cg.scale.set(m.w*.62,.85,m.w*.62);cap.add(cg);
    var gill=mesh(new T.CircleGeometry(1,24),M(0xd8c8b0,.9,0,{side:T.DoubleSide}),false,false);gill.rotation.x=Math.PI/2;gill.scale.set(m.w*.58,m.w*.58,1);gill.position.y=.08;cap.add(gill);
    var so={l:m.x-m.w/2,r:m.x+m.w/2,t:m.top,b:m.top-.6,oneway:false,flt:true,shroom:m.c};solids.push(so);
    trRiv.shr.push({so:so,cap:cap,sq:0,c:m.c,g:g})});
}
function updShrooms(dt){
  if(!trRiv||!trRiv.shr)return;
  trRiv.shr.forEach(function(o){
    if(P.onPlat===o.so&&P.grounded&&state==='play'){var v=TR_BOUNCE[o.c]*(keys.jump?1.06:1);P.vy=v;P.grounded=false;P.onPlat=null;P.noCut=.7;P.coyote=0;P.dj=false;o.sq=1;
      try{beep(o.c==='r'?330:o.c==='b'?262:220,.22,'sine',.12,1.8);noise(.08,.05,900,'lowpass')}catch(e){}emit(sparkPool,P.x,o.so.t+.1,10,3,.5,.3,.2,2);
      if(!trRiv.shTold){trRiv.shTold=true;toast('Cogumelo gigante! Vermelho joga alto, azul mais alto e o dourado lá em cima')}}
    o.sq=Math.max(0,o.sq-dt*2.6);var s2=Math.sin(o.sq*Math.PI*2.5)*o.sq;o.cap.scale.set(1+s2*.18,1-s2*.3,1+s2*.18)});
}
function buildGardenDecor(){
  if(!LV.shrooms)return;var r=rnd(5151),x0=316,x1=406,lite=LITE,SP=[],RK=[],SM=[];
  /* plantas gigantes enroladas (espiral) roxas e vermelhas, no fundo e algumas na frente */
  for(var x=x0;x<x1;x+=3+r()*4){var gt=trGroundAt(x);if(gt<-50)continue;var fr=r()<.25,z=fr?1.6:-2.6-r()*2.6,h=(fr?1.3:2.4)+r()*2,col=[0x9a3ac8,0xc83a6a,0x7a2ab8,0xd85a2a][(r()*4)|0],pts=[];
    var R0=h*.22;for(var k=0;k<=10;k++){var u=k/10;pts.push(new T.Vector3(x+Math.sin(u*2.6)*.18,gt+u*h,z))}
    var cx2=x+Math.sin(2.6)*.18+R0,cy2=gt+h;for(k=1;k<=26;k++){var t=k/26,th=Math.PI-t*Math.PI*2*1.55,rr2=R0*(1-t*.8);pts.push(new T.Vector3(cx2+Math.cos(th)*rr2,cy2+Math.sin(th)*rr2,z))}
    var tg=new T.TubeGeometry(new T.CatmullRomCurve3(pts),60,.07+(fr?0:.05),6,false);
    SP.push({g:tg,c:col});
    for(var lf=0;lf<6;lf++){var q=pts[2+lf];SP.push({g:xf(new T.SphereGeometry(.22,6,4),[q.x+(lf%2?.2:-.2),q.y,q.z],0,[1.6,.35,.8]),c:0x5aa83a})}}
  if(SP.length)add(mesh(mergeG(SP,true),M(0xffffff,.65,0,{vertexColors:true}),true,false));
  /* pedras redondas cobertas de grama e cogumelinhos espalhados */
  for(x=x0;x<x1;x+=2.2+r()*3){var gt2=trGroundAt(x);if(gt2<-50)continue;var z2=r()<.3?1.5:-2.4-r()*2.4,sz=.4+r()*.7;RK.push({g:xf(new T.SphereGeometry(1,12,8),[x,gt2+sz*.35,z2],0,[sz*1.3,sz*.8,sz]),c:0x5cae3a});
    for(var m=0;m<3;m++){var sx=x+(r()-.5)*1.4,sz2=.08+r()*.12,cc=[0xe8402a,0x3a7ae8,0xf2b81a,0xffffff][(r()*4)|0];SM.push({g:xf(new T.CylinderGeometry(sz2*.35,sz2*.45,sz2*2.2,6),[sx,gt2+sz2*1.1,z2+.8],0),c:0xf4ead8});SM.push({g:xf(new T.SphereGeometry(sz2,8,5,0,6.283,0,1.5),[sx,gt2+sz2*2.1,z2+.8],0,[1.4,.9,1.4]),c:cc})}}
  add(mesh(mergeG(RK,true),M(0xffffff,.9,0,{vertexColors:true}),true,true));add(mesh(mergeG(SM,true),M(0xffffff,.6,0,{vertexColors:true}),false,false));
}
/* ---------- Caminho das Copas ---------- */
function buildBranchPlat(x0,x1,top,r){/* galho grosso saindo do fundo, com folhas; o Kuro pisa na ponta */
  var cx=(x0+x1)/2,g=new T.Group();g.position.set(cx,top-.28,0);add(g);
  /* o galho sai do tronco da árvore de trás e vem até a plataforma */
  var tx=(LV.branchTree||cx)-cx,pts=[new T.Vector3(0,0,.3),new T.Vector3(tx*.35,.25,-1.4),new T.Vector3(tx*.8,.7,-2.9),new T.Vector3(tx,.9,-3.6)];
  g.add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),12,.3,8,false),trBarkM,true,true));
  var tip=mesh(new T.SphereGeometry(.3,8,6),trBarkM,false,false);tip.position.z=.35;g.add(tip);
  var pad=mesh(new T.CylinderGeometry((x1-x0)*.55,(x1-x0)*.5,.18,10),mossM,false,true);pad.position.y=.2;pad.scale.z=1.5;g.add(pad);
  for(var k=0;k<4;k++){var lf=mesh(new T.IcosahedronGeometry(.45+r()*.3,1),M(0x4fae3a,.85,0,{flatShading:true}),true,false);lf.position.set((r()-.5)*1.4,.2+r()*.4,-1.2-r()*2.2);g.add(lf)}
}
function buildCanopyPlat(x0,x1,top,r){/* topo das copas: chão de folhas e galhos, bem largo */
  var w=x1-x0,cx=(x0+x1)/2,L=[];
  var body=mesh(boxGeo(w,.5,6.6,2),mossM,true,true);body.position.set(cx,top-.25,-1.5);add(body);
  for(var x=x0;x<x1;x+=.9+r()*.8){var s2=.8+r()*.9;L.push({g:xf(new T.IcosahedronGeometry(1,1),[x,top-.75-r()*.3,1.5+r()*.3],[r(),r(),r()],[s2*.8,s2*.5,s2*.6]),c:[0x3f9a32,0x4fae3a,0x5cbc44][(r()*3)|0]});
    if(r()<.7)L.push({g:xf(new T.IcosahedronGeometry(1,1),[x,top-1.4-r()*.8,-1+r()*1.6],[r(),r(),r()],[s2*1.4,s2*.9,s2*1.2]),c:0x357a2c})}
  add(mesh(mergeG(L,true),M(0xffffff,.85,0,{vertexColors:true,flatShading:true}),true,true));
}
function trVine(x,y0,top){/* cipó de subir (igual ao pé de feijão, já crescido) */
  var g=new T.Group(),max=top-y0,stem=mesh(vineGeo,vineM,true,false);stem.scale.y=max;g.add(stem);var leaves=[],n=Math.floor(max/.55);
  for(var k=0;k<n;k++){var lf=mesh(leafGeo,leafM2,true,false);g.add(lf);leaves.push({m:lf,h:.6+k*.55,side:k%2?1:-1})}
  g.position.set(x,y0,-.2);add(g);vines.push({x:x,y0:y0,top:top,len:max,max:max,g:g,stem:stem,leaves:leaves});
  /* o pé de feijão nasce do chão: a parte de baixo é só enfeite (dá para agarrar só a partir de y0) */
  var gnd=trGroundAt(x);if(gnd>-50&&gnd<y0-.3){var lo=mesh(new T.CylinderGeometry(.1,.14,y0-gnd,8),vineM,true,false);lo.position.set(x,(y0+gnd)/2,-.2);add(lo);
    for(var hh=gnd+.6;hh<y0;hh+=.55){var lf=mesh(leafGeo,leafM2,false,false);var sd=((hh*10)|0)%2?1:-1;lf.position.set(x+sd*.2,hh,-.2);lf.rotation.z=sd*.5;add(lf)}}
}
function buildCanopyMech(){
  trRiv=trRiv||{};trRiv.lifts=[];
  (LV.cvines||[]).forEach(function(v){trVine(v.x,v.y0,v.top)});
  (LV.hvines||[]).forEach(function(h){/* cipó de pendurar entre dois galhos (segure pular para agarrar, ande para os lados) */
    ropes.push({rope:true,x0:h.x0,x1:h.x1,y:h.y});var pts=[];for(var k=0;k<=12;k++){var u=k/12;pts.push(new T.Vector3(h.x0-.4+(h.x1-h.x0+.8)*u,h.y+.15-Math.sin(u*Math.PI)*.12,0))}
    add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),30,.07,6,false),vineM,true,false));
    var LF=[];for(var x=h.x0;x<h.x1;x+=.45)LF.push(xf(leafGeo.clone(),[x,h.y+.05,(x*7%2)>1?.15:-.15],[0,0,(x*3%2)-1]));add(mesh(mgL(LF),leafM2,false,false));
    [h.x0-.5,h.x1+.5].forEach(function(x){
      /* o galho sai de um tronco de verdade: se não tem árvore perto, nasce uma atrás da ponta do cipó */
      var tz=-3.4,near=(LV.trunks||[]).some(function(tx){return Math.abs(tx-x)<2.4});
      if(!near){var th=h.y+8,tr=mesh(barkCyl(.75,1.0,th,12),trBarkM,true,true);tr.position.set(x,th/2-1,tz);add(tr);
        for(var k=0;k<4;k++){var a=k/4*6.283+.4,sa=Math.sin(a)>0?Math.sin(a)*.25:Math.sin(a),pts=[new T.Vector3(x+Math.cos(a)*.5,2.2,tz+sa*.5),new T.Vector3(x+Math.cos(a)*1.3,.6,tz+sa*1.2),new T.Vector3(x+Math.cos(a)*1.9,-.2,tz+sa*1.7)];add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),6,.28,6,false),trBarkM,true,true))}}
      var len=-tz+.3,b=mesh(barkCyl(.2,.34,len,8),trBarkM,true,false);b.rotation.x=Math.PI/2;b.position.set(x,h.y+.2,tz+len/2-.1);add(b);
      var kn=mesh(new T.SphereGeometry(.24,8,6),trBarkM,false,false);kn.position.set(x,h.y+.2,.25);add(kn)})});
  (LV.lifts12||[]).forEach(function(q){var m=new T.Group(),pl=mesh(boxGeo(q.w,.36,2.4,1.2),trPlankM,true,true);m.add(pl);
    var lf=mesh(new T.SphereGeometry(1,12,6),mossM);lf.scale.set(q.w/2,.1,1.2);lf.position.y=.17;m.add(lf);
    [-1,1].forEach(function(sd){var v=mesh(new T.CylinderGeometry(.04,.04,30,5),vineM,false,false);v.position.set(sd*(q.w/2-.2),15,-.6);m.add(v)});add(m);
    var so={l:q.x-q.w/2,r:q.x+q.w/2,t:q.y0,b:q.y0-.36,oneway:false,flt:true,lift:true};m.position.set(q.x,q.y0-.18,0);/* já nasce no lugar (antes ficava na praia até a abertura acabar) */solids.push(so);trRiv.lifts.push({q:q,so:so,m:m,ph:0})});
}
function updCanopy(dt){
  if(!trRiv||!trRiv.lifts)return;
  trRiv.lifts.forEach(function(L){var q=L.q;L.ph+=dt*q.sp;var k=.5-.5*Math.cos(L.ph),ny=q.y0+(q.y1-q.y0)*k,dy=ny-L.so.t,on=P.onPlat===L.so&&P.grounded;L.so.t=ny;L.so.b=ny-.36;L.m.position.set(q.x,ny-.18,0);if(on)P.y+=dy});
  if(LV.canopy){var inC=P.x>LV.canopy.x0-2&&P.x<LV.canopy.x1+4;LV.tall=inC?1:0}/* na subida a câmera acompanha o Kuro para cima */
}
function buildCanopyDecor(){
  var C=LV.canopy;if(!C)return;var r=rnd(8181),TR=[],LV2=[],P2=[];
  (LV.trunks||[]).forEach(function(x){var rad=1.6+r()*.5,h=40,z=-3.4;TR.push(xf(barkCyl(rad*.85,rad*1.1,h,14),[x,h/2-1,z]));
    for(var k=0;k<5;k++){var a=k/5*6.283,sa=Math.sin(a)>0?Math.sin(a)*.25:Math.sin(a);/* raízes só para os lados e para trás: não entram no caminho do Kuro */var pts=[new T.Vector3(x+Math.cos(a)*rad*.7,3,z+sa*rad*.7),new T.Vector3(x+Math.cos(a)*rad*1.7,1.8,z+sa*rad*1.7),new T.Vector3(x+Math.cos(a)*rad*2.6,1.2,z+sa*rad*2.4)];TR.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),8,rad*.3,6,false))}});
  add(mesh(mgL(TR),trBarkM,true,true));
  /* copas por cima e no fundo, com buracos de luz */
  for(var x=C.x0-6;x<C.x1+8;x+=2.6+r()*2.4){var y=31+r()*6,s2=3+r()*3,zc=-4-r()*6;if(LV.crystal&&Math.abs(x-LV.crystal.x)<9){zc-=8;y+=4}/* no mirante as copas ficam mais para trás e mais altas: não escondem o Cristal Ancestral */LV2.push({g:xf(new T.IcosahedronGeometry(1,1),[x,y,zc],[r(),r(),r()],[s2*1.3,s2*.7,s2]),c:[0x3a8a30,0x4a9e38,0x2f7a2a][(r()*3)|0]})}
  add(mesh(mergeG(LV2,true),M(0xffffff,.85,0,{vertexColors:true,flatShading:true}),true,false));
  /* arvorezinhas em vasos de musgo nas tábuas, como nas casas de árvore */
  LV.floats.forEach(function(f){if(f[3]!=='plank'||f[0]<400)return;if(r()<.35)return;var x=f[1]-.7,y=f[2];P2.push({g:xf(new T.CylinderGeometry(.07,.1,.9,6),[x,y+.45,-.6]),c:0x6a4a2c});P2.push({g:xf(new T.IcosahedronGeometry(.55,1),[x,y+1.15,-.6]),c:0x5cbc44})});
  if(P2.length)add(mesh(mergeG(P2,true),M(0xffffff,.8,0,{vertexColors:true,flatShading:true}),true,false));
}
/* ---------- Cachoeira Secreta ---------- */
var trWF=null,trMist0=null;
function buildCaveLedge(x0,x1,top){var cx=(x0+x1)/2,g=new T.Group();g.position.set(cx,top,-.4);add(g);
  var rk=mesh(new T.BoxGeometry(x1-x0+.4,.5,2.4),trRockM,true,true);rk.position.y=-.25;g.add(rk);
  var ms=mesh(new T.BoxGeometry(x1-x0+.2,.08,2.2),mossM,false,true);ms.position.y=.02;g.add(ms)}
function buildWaterfall(){
  var W=LV.wfall;if(!W)return;var w=W.x1-W.x0+.8,h=W.top-W.y,cx=(W.x0+W.x1)/2,lite=LITE;
  /* paredão de pedras grandes e irregulares atrás, com musgo e a boca escura da gruta */
  var rr=rnd(4141),B=[],MS=[],FN=[];function boulder(x,y,z,sx,sy,sz){var g=new T.IcosahedronGeometry(1,lite?1:2),pa=g.attributes.position;
      for(var k=0;k<pa.count;k++){var vx=pa.getX(k),vy=pa.getY(k),vz=pa.getZ(k),n=1+Math.sin(vx*3.1+x)*.09+Math.sin(vy*4.3+z)*.07+Math.sin(vz*5.7+y)*.05;pa.setXYZ(k,vx*n,vy*n,vz*n)}
      g.computeVertexNormals();B.push(xf(g,[x,y,z],[rr()*3,rr()*3,0],[sx,sy,sz]));if(rr()<.7)MS.push(xf(new T.SphereGeometry(1,10,5,0,6.283,0,1.1),[x,y+sy*.72,z],0,[sx*.82,sy*.42,sz*.82]))}
  for(var yy=W.y-1;yy<W.top+3;yy+=3.2)for(var xx=cx-13;xx<cx+14;xx+=3.4+rr()*1.2){var nearCave=Math.abs(xx-cx)<3.6&&yy<W.y+6.5;if(nearCave)continue;boulder(xx+rr()-.5,yy+rr(),-4.2-rr()*1.4,2.2+rr()*.9,1.9+rr()*.7,1.8)}
  boulder(cx-3.9,W.y+2.5,-3.4,1.4,3.2,1.4);boulder(cx+3.9,W.y+2.5,-3.4,1.4,3.2,1.4);boulder(cx,W.y+7.4,-3.4,4.6,1.5,1.5);/* moldura da gruta */
  add(mesh(mgL(B),trRockM,true,true));add(mesh(mgL(MS),mossM,false,true));
  for(var f2=0;f2<(lite?10:24);f2++){var fx=cx-12+rr()*24,fy=W.y+2+rr()*(W.top-W.y-2);if(Math.abs(fx-cx)<2.6)continue;var ln=1+rr()*2.4;FN.push(xf(new T.CylinderGeometry(.03,.03,ln,4),[fx,fy-ln/2,-2.6],[0,0,(rr()-.5)*.2]))}
  if(FN.length)add(mesh(mgL(FN),vineM,false,false));
  var sh=new T.Shape();sh.moveTo(-2.6,0);sh.lineTo(-2.6,3.6);sh.quadraticCurveTo(-2.4,6.4,0,6.6);sh.quadraticCurveTo(2.4,6.4,2.6,3.6);sh.lineTo(2.6,0);sh.lineTo(-2.6,0);
  var cave=mesh(new T.ShapeGeometry(sh,14),new T.MeshBasicMaterial({color:0x08121a}),false,false);cave.position.set(cx,W.y,-2.5);add(cave);
  var cm=new T.MeshStandardMaterial({color:0x8fd8ff,emissive:0x3a8aff,emissiveIntensity:1.1,roughness:.25,flatShading:true}),C=[];
  [[-2,0,.9],[-1.5,0,.6],[1.8,0,1.1],[2.2,0,.7],[-.7,5.9,.45],[.8,6.1,.55]].forEach(function(q,i){var cg=new T.ConeGeometry(.22*q[2]+.1,1.4*q[2]+.4,5);C.push(xf(cg,[cx+q[0],W.y+q[1]+(q[1]?-.4:.6*q[2]),-2.3],[0,i,q[1]?Math.PI:(i%2?.2:-.2)]))});
  add(mesh(mgL(C),cm,false,false));
  var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x6ac8ff,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending}));gl.scale.set(6,6,1);gl.position.set(cx,W.y+3.5,-2);add(gl);
  /* a água caindo: cortina com listras que descem */
  var wg=new T.PlaneGeometry(w,h,1,lite?12:30);wg.translate(0,h/2,0);
  var wm=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:lushU.time,amt:{value:1},cut:{value:0}},
    vertexShader:'varying vec2 vU;void main(){vU=uv;vec3 p=position;p.z+=sin(uv.y*9.+uv.x*4.)*.05;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
    fragmentShader:'uniform float time,amt,cut;varying vec2 vU;float h(vec2 p){return fract(sin(dot(p,vec2(12.9,78.2)))*43758.5);}void main(){if(vU.y<cut)discard;float st=0.;for(int i=0;i<3;i++){float fi=float(i);float x=floor(vU.x*(9.+fi*7.));float sp=1.8+h(vec2(x,fi))*1.6;st+=smoothstep(.55,1.,fract(vU.y*(2.+fi)+time*sp+h(vec2(x,fi+3.))))*.45;}float edge=smoothstep(0.,.12,vU.x)*smoothstep(1.,.88,vU.x);vec3 c=mix(vec3(.55,.8,.92),vec3(1.),clamp(st,0.,1.));float a=(.38+st*.5)*edge*amt;gl_FragColor=vec4(c,a);}'});
  var cur=new T.Mesh(wg,wm);cur.position.set(cx,W.y,-.2);cur.renderOrder=3;add(cur);
  var cur2=new T.Mesh(wg,wm);cur2.position.set(cx,W.y,1.3);cur2.renderOrder=3;add(cur2);
  /* poço e espuma embaixo */
  var pg=new T.CircleGeometry(4.2,24);pg.rotateX(-Math.PI/2);var pool=mesh(pg,new T.MeshStandardMaterial({color:0x3aa8c8,roughness:.2,transparent:true,opacity:.75}),false,false);pool.scale.set(1.3,1,.8);pool.position.set(cx,W.y+.03,1.6);add(pool);
  var sp=[];for(var i=0;i<(lite?5:10);i++){var s2=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xeaf6ff,transparent:true,opacity:.5,depthWrite:false}));s2.scale.set(2.2,1.6,1);s2.position.set(cx,W.y+.5,1.4);add(s2);sp.push({s:s2,ph:i/10})}
  trWF={W:W,wm:wm,sp:sp,t:0,st:'on',gl:gl,cm:cm,cx:cx};
}
function updWaterfall(dt){
  var F=trWF;if(!F)return;var W=F.W;F.t+=dt;var amt;
  if(F.st==='on'){amt=1;if(F.t>W.on-.9)amt=1-(F.t-(W.on-.9))/.9*.55;if(F.t>W.on){F.st='off';F.t=0;try{noise(.5,.04,500,'lowpass')}catch(e){}}}
  else{amt=0;if(F.t>W.off){F.st='on';F.t=0;try{noise(.6,.06,700,'lowpass')}catch(e){}}}
  /* a água some caindo de cima para baixo e volta descendo de cima */
  var cut=F.st==='off'?Math.min(1,F.t/.5):0,rev=F.st==='on'&&F.t<.6?F.t/.6:1;
  F.wm.uniforms.amt.value=F.st==='on'?Math.max(.3,amt):Math.max(0,1-F.t/.5)*.4;F.wm.uniforms.cut.value=F.st==='on'?1-rev:cut;
  F.sp.forEach(function(o){var u=(tm*.5+o.ph)%1;o.s.position.set(F.cx+(o.ph-.5)*4.2,W.y+.4+u*2.2,1.4+Math.sin(o.ph*9)*.6);o.s.material.opacity=(F.st==='on'?.45:.08)*(1-u)});
  F.cm.emissiveIntensity=F.st==='off'?1.6+Math.sin(tm*6)*.3:.6;F.gl.material.opacity=F.st==='off'?.75:.25;
  /* com a água caindo: quem estiver embaixo é empurrado para fora (não dá para passar nem ficar na gruta) */
  var water=F.st==='on'&&rev>.5;
  if(water&&state==='play'&&P.x>W.x0-.2&&P.x<W.x1+.2&&P.y<W.top){var side=P.x<(W.x0+W.x1)/2?-1:1;if(P.onPlat&&P.onPlat.t>W.y+1){side=-1}
    P.vx=side*8;P.vy=Math.min(P.vy,-4);P.x=side<0?Math.min(P.x,W.x0-.25):Math.max(P.x,W.x1+.25);P.grounded=false;P.onPlat=null;
    if(Math.random()<.5)splashFx(P.x,P.y+1,4);if(!trRiv.wfTold){trRiv.wfTold=true;toast('A cachoeira é forte demais! Espere a água parar para passar... e olhe a gruta lá dentro')}}
}
function updMist(){/* na mata da cachoeira: luz mais fria e névoa */
  var M2=LV.mist;if(!M2)return;if(!trMist0)trMist0={fog:scene.fog.color.clone(),fd:scene.fog.density,hi:hemi.intensity,si:sun.intensity};
  var k=clamp((P.x-M2.x0)/14,0,1)*(1-clamp((P.x-M2.x1)/10,0,1));k=k*k*(3-2*k);
  scene.fog.color.copy(trMist0.fog).lerp(new T.Color(0x6a8aa6),k*.8);scene.fog.density=trMist0.fd+k*.016;hemi.intensity=trMist0.hi*(1-k*.25);sun.intensity=trMist0.si*(1-k*.45);
}
function buildMistDecor(){
  var M2=LV.mist;if(!M2)return;var r=rnd(9393),lite=LITE,RY=[];
  var c=document.createElement('canvas');c.width=64;c.height=128;var x=c.getContext('2d'),gx=x.createLinearGradient(0,0,64,0);gx.addColorStop(0,'rgba(255,255,255,0)');gx.addColorStop(.5,'rgba(255,255,255,1)');gx.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gx;x.fillRect(0,0,64,128);
  x.globalCompositeOperation='destination-in';var gy=x.createLinearGradient(0,0,0,128);gy.addColorStop(0,'rgba(255,255,255,1)');gy.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gy;x.fillRect(0,0,64,128);
  var tex=new T.CanvasTexture(c);trRiv.rays=[];
  for(var X=M2.x0+4;X<M2.x1;X+=5+r()*5){var mat=new T.MeshBasicMaterial({map:tex,color:0xd8f0ff,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.2,side:T.DoubleSide});
    var pl=new T.Mesh(new T.PlaneGeometry(1.8+r()*2.6,26),mat);pl.position.set(X,22,-3-r()*4);pl.rotation.z=-.32;add(pl);trRiv.rays.push({m:mat,ph:r()*6})}
  for(var i=0;i<(lite?8:18);i++){var ms=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xdde8f0,transparent:true,opacity:.28,depthWrite:false}));var sz=5+r()*6;ms.scale.set(sz*1.8,sz*.6,1);ms.position.set(M2.x0+r()*(M2.x1-M2.x0),10.6+r()*1.5,-1-r()*5);add(ms)}
  /* samambaias e árvores escuras e altas no fundo azulado */
  var TR=[];for(X=M2.x0;X<M2.x1;X+=4+r()*4){var z=-7-r()*8,h=40;TR.push({g:xf(barkCyl(.6,.9,h,8),[X,h/2-2,z]),c:0x3a3a40})}add(mesh(mergeG(TR,true),M(0xffffff,.95,0,{vertexColors:true}),false,false));
}
/* ---------- Mirante da Floresta ---------- */
var trCr=null;
function buildSummitDeck(x0,x1,top,r){/* mirante: deque de madeira largo com corrimão, flores e copa embaixo */
  var w=x1-x0,cx=(x0+x1)/2,g=new T.Group();g.position.set(cx,top,0);add(g);
  for(var px=-w/2+.22;px<w/2;px+=.44){var pl=mesh(new T.BoxGeometry(.4,.16,3.2),trPlankM,true,true);pl.position.set(px,-.08,-.3);g.add(pl)}
  var R=[];for(var x=-w/2;x<=w/2+.01;x+=1.6)R.push(xf(new T.BoxGeometry(.12,1,.12),[x,.5,-1.8]));R.push(xf(new T.BoxGeometry(w,.1,.1),[0,.95,-1.8]));R.push(xf(new T.BoxGeometry(w,.08,.08),[0,.55,-1.8]));
  g.add(mesh(mgL(R),trBarkM,true,false));
  var L=[];for(x=x0-1;x<x1+1;x+=1.3){var s2=.7+r()*.8;L.push({g:xf(new T.IcosahedronGeometry(1,1),[x,top-1.0-r()*.5,-1.2-r()*1.4],[r(),r(),r()],[s2*1.3,s2*.7,s2*1.1]),c:[0x3f9a32,0x4fae3a,0x5cbc44][(r()*3)|0]})}
  add(mesh(mergeG(L,true),M(0xffffff,.85,0,{vertexColors:true,flatShading:true}),true,true));
}
function buildMirante(){
  var T0=LV.mtree;if(!T0)return;var r=rnd(6262),lite=LITE,x=T0.x+8.5,z=-6.2,rad=5.2,TR=[],RT=[];
  /* a árvore gigante: tronco enorme, raízes abertas e copa lá no alto */
  TR.push(xf(barkCyl(rad*.82,rad*1.05,52,18),[x,26-1,z]));
  for(var k=0;k<8;k++){var a=k/8*6.283,sa=Math.sin(a)>0?Math.sin(a)*.25:Math.sin(a),pts=[new T.Vector3(x+Math.cos(a)*rad*.7,16,z+sa*rad*.7),new T.Vector3(x+Math.cos(a)*rad*1.6,13,z+sa*rad*1.5),new T.Vector3(x+Math.cos(a)*rad*2.4,11.6,z+sa*rad*2.2)];RT.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),8,rad*.32,7,false))}
  for(k=0;k<6;k++){var a2=k*1.1+.3,y=30+k*2.6,pts2=[new T.Vector3(x,y,z),new T.Vector3(x+Math.cos(a2)*8,y+3,z+Math.sin(a2)*4-2),new T.Vector3(x+Math.cos(a2)*13,y+6,z+Math.sin(a2)*6-3)];RT.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts2),8,.8,6,false))}
  add(mesh(mgL(TR),trBarkM,true,true));add(mesh(mgL(RT),trBarkM,true,true));
  var CP=[];for(k=0;k<(lite?14:26);k++){var a3=r()*6.283,d=4+r()*12,s2=4+r()*5;CP.push({g:xf(new T.IcosahedronGeometry(1,1),[x+Math.cos(a3)*d,40+r()*12,z-2+Math.sin(a3)*d*.5-4],[r(),r(),r()],[s2*1.2,s2*.75,s2]),c:[0x3a9a34,0x4cae3c,0x5cc048,0x2f8a2e][(r()*4)|0]})}
  add(mesh(mergeG(CP,true),M(0xffffff,.85,0,{vertexColors:true,flatShading:true}),true,false));
  /* casinhas de madeira com telhado de grama, nas tábuas da árvore */
  trCr=trCr||{};trCr.lan=[];var WL=[],RF=[],CL=[],GL=[],TF=[];
  LV.floats.forEach(function(f,i){if(f[3]!=='porch')return;var hy=f[2],W2=2.5,H2=1.75,D2=1.7,z=-2.0,hx=i%2?f[0]+W2/2+.25:f[1]-W2/2-.25;
    /* paredes de tábuas e base */
    WL.push(xf(new T.BoxGeometry(W2,H2,D2),[hx,hy+H2/2,z]));
    var tri=new T.Shape();tri.moveTo(-W2/2,0);tri.lineTo(W2/2,0);tri.lineTo(0,1.05);tri.lineTo(-W2/2,0);
    [D2/2+.001,-D2/2-.001].forEach(function(dz){WL.push(xf(new T.ShapeGeometry(tri),[hx,hy+H2,z+dz],[0,dz<0?Math.PI:0,0]))});
    CL.push({g:xf(new T.BoxGeometry(W2+.2,.18,D2+.2),[hx,hy+.09,z]),c:0x6a4a2c});
    [-1,1].forEach(function(sx){[-1,1].forEach(function(sz){CL.push({g:xf(new T.CylinderGeometry(.11,.12,H2,7),[hx+sx*W2/2,hy+H2/2,z+sz*D2/2]),c:0x7a5434})})});
    /* telhado de duas águas, reto, coberto de grama */
    var ang=Math.atan2(1.05,W2/2),sl=Math.hypot(W2/2,1.05)+.35;
    [-1,1].forEach(function(sd){RF.push(xf(new T.BoxGeometry(sl,.22,D2+.7),[hx+sd*(sl/2-.35)*Math.cos(ang)*1.0-sd*.0,hy+H2+.12+(1.05/2),z],[0,0,-sd*ang]))});
    RF.push(xf(new T.CylinderGeometry(.16,.16,D2+.75,8),[hx,hy+H2+1.2,z],[Math.PI/2,0,0]));
    /* franja de grama caindo dos beirais e tufos no telhado */
    [-1,1].forEach(function(sd){var ex=hx+sd*(W2/2+.32),ey=hy+H2-.1;for(var zz=-D2/2-.3;zz<=D2/2+.3;zz+=.16){var ln=.18+r()*.22;TF.push({g:xf(new T.ConeGeometry(.07,ln,4),[ex+(r()-.5)*.08,ey-ln/2+.05,z+zz],[Math.PI,0,sd*.25]),c:[0x4a9a2a,0x5aae36,0x3f8a24][(r()*3)|0]})}
      for(var k=0;k<9;k++){var u=r(),tx=hx+sd*u*(W2/2+.2),ty=hy+H2+.25+(1-u)*1.05,ln2=.2+r()*.25;TF.push({g:xf(new T.ConeGeometry(.05,ln2,4),[tx,ty+ln2/2,z+(r()-.5)*(D2+.4)],[(r()-.5)*.4,0,-sd*ang*.6]),c:0x6ac83a})}});
    [0xff7ac0,0xffe04a,0xffffff].forEach(function(fc,k){CL.push({g:xf(new T.SphereGeometry(.08,6,4),[hx+(k-1)*.5,hy+H2+.95-Math.abs(k-1)*.25,z+D2/2+.1]),c:fc})});
    /* porta com moldura, janelas com moldura e cruz, floreira */
    CL.push({g:xf(new T.BoxGeometry(.72,1.15,.06),[hx,hy+.65,z+D2/2+.03]),c:0x5a321a});CL.push({g:xf(new T.BoxGeometry(.9,.1,.1),[hx,hy+1.28,z+D2/2+.05]),c:0x3a2414});
    CL.push({g:xf(new T.SphereGeometry(.05,6,4),[hx+.22,hy+.65,z+D2/2+.08]),c:0xd8b040});
    [-1,1].forEach(function(sd){var wx=hx+sd*.85,wy=hy+1.05;GL.push(xf(new T.PlaneGeometry(.46,.46),[wx,wy,z+D2/2+.02]));
      CL.push({g:xf(new T.BoxGeometry(.58,.07,.08),[wx,wy+.26,z+D2/2+.05]),c:0x3a2414});CL.push({g:xf(new T.BoxGeometry(.58,.07,.08),[wx,wy-.26,z+D2/2+.05]),c:0x3a2414});
      CL.push({g:xf(new T.BoxGeometry(.05,.5,.05),[wx,wy,z+D2/2+.05]),c:0x3a2414});CL.push({g:xf(new T.BoxGeometry(.5,.05,.05),[wx,wy,z+D2/2+.05]),c:0x3a2414});
      CL.push({g:xf(new T.BoxGeometry(.6,.14,.2),[wx,wy-.36,z+D2/2+.12]),c:0x7a5434});
      for(var k=0;k<4;k++)CL.push({g:xf(new T.SphereGeometry(.07,6,4),[wx-.22+k*.15,wy-.25,z+D2/2+.14]),c:[0xff5a7a,0xffd23a,0xff9ad8,0xffffff][(k+i)%4]})});
    /* chaminé de pedra com fumacinha */
    CL.push({g:xf(new T.BoxGeometry(.36,.8,.36),[hx+(i%2?.6:-.6),hy+H2+.9,z-.3]),c:0x8a8478});
    var lg=new T.Group();lg.position.set(i%2?f[1]-.3:f[0]+.3,hy+1.9,.9);add(lg);var lb=mesh(new T.CylinderGeometry(.14,.11,.3,8),new T.MeshStandardMaterial({color:0xffc45a,emissive:0xffa030,emissiveIntensity:1.5}),false,false);lg.add(lb);
    var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffb050,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.7}));gl.scale.set(1.4,1.4,1);lg.add(gl);trFx.lan.push({g:lg,gl:gl,ph:i})});
  if(WL.length){var wm2=pbr(texWood,.85,1,{color:new T.Color(0xe8c08a)});add(mesh(mgL(WL),wm2,true,true));
    add(mesh(mgL(RF),mossM,true,true));add(mesh(mergeG(CL,true),M(0xffffff,.8,0,{vertexColors:true}),true,false));add(mesh(mergeG(TF,true),M(0xffffff,.85,0,{vertexColors:true}),false,false));
    add(mesh(mgL(GL),new T.MeshBasicMaterial({color:0xffd27a}),false,false))}
  /* balões coloridos voando em volta */
  trCr.bal=[];var cols=[0xff5a5a,0xffd23a,0x5ab0ff,0x7ad85a,0xff8ad0,0xffa040];
  for(k=0;k<(lite?4:7);k++){var g=new T.Group(),bm=mesh(new T.SphereGeometry(1.2,16,12),M(cols[k%6],.55),true,false);bm.scale.set(1,1.18,1);g.add(bm);
    var st=mesh(new T.SphereGeometry(1.21,16,12,0,6.283,0,1.1),M(0xffffff,.6,0,{transparent:true,opacity:.0}),false,false);g.add(st);
    var bk=mesh(new T.BoxGeometry(.6,.45,.6),trPlankM,false,false);bk.position.y=-1.9;g.add(bk);for(var q=0;q<4;q++){var rp=mesh(new T.CylinderGeometry(.015,.015,.9,3),M(0x6a5030,.9),false,false);rp.position.set((q%2?.25:-.25),-1.4,(q<2?.25:-.25));g.add(rp)}
    var bx=575+k*11+r()*6,by=20+r()*16,bz=-5-r()*10;g.position.set(bx,by,bz);add(g);trCr.bal.push({g:g,x:bx,y:by,ph:r()*6})}
  /* o Cristal Ancestral no pedestal */
  var C=LV.crystal,cg=new T.Group();cg.position.set(C.x,C.y,-1.3);add(cg);
  var ped=mesh(new T.CylinderGeometry(.7,.95,.9,10),trRockM,true,true);ped.position.y=.45;cg.add(ped);var pt=mesh(new T.CylinderGeometry(.85,.85,.12,10),mossM,false,true);pt.position.y=.92;cg.add(pt);
  var crm=new T.MeshStandardMaterial({color:0x1a7af0,emissive:0x0a50c8,emissiveIntensity:.55,roughness:.3,metalness:.1,flatShading:true,envMapIntensity:.3});/* azul forte: o claro sumia no céu claro do mirante */
  var cry=mesh(new T.OctahedronGeometry(.9,0),crm,false,false);cry.scale.set(.9,1.6,.9);cry.position.y=2.5;cg.add(cry);
  var core=mesh(new T.OctahedronGeometry(.42,0),new T.MeshBasicMaterial({color:0xeaffff}),false,false);core.scale.set(1,1.6,1);cry.add(core);core.scale.set(.5,.5,.5);var ol=mesh(new T.OctahedronGeometry(.9,0),new T.MeshBasicMaterial({color:0x0a1e4a,side:T.BackSide}),false,false);ol.scale.setScalar(1.09);cry.add(ol);/* contorno escuro: o cristal aparece mesmo com o céu claro atrás */
  var rg2=mesh(new T.TorusGeometry(1.15,.07,8,28),M(0xf2c230,.3,.85,{emissive:new T.Color(0x6a4a00),emissiveIntensity:.5}),false,false);rg2.rotation.x=Math.PI/2.4;rg2.position.y=2.5;cg.add(rg2);
  var halo=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x8ae8ff,transparent:true,opacity:.75,depthWrite:false,blending:T.AdditiveBlending}));halo.scale.set(5,5,1);halo.position.y=2.5;halo.material.color.setHex(0x3ab8ff);cg.add(halo);
  var beam=mesh(new T.CylinderGeometry(.5,1.6,40,12,1,true),new T.MeshBasicMaterial({color:0xbff4ff,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}),false,false);beam.position.y=22;cg.add(beam);
  trCr.c={g:cg,cry:cry,halo:halo,beam:beam,crm:crm,got:0};
}
function updMirante(dt){
  if(!trCr)return;
  (trCr.bal||[]).forEach(function(b){b.g.position.y=b.y+Math.sin(tm*.5+b.ph)*.8;b.g.position.x=b.x+Math.sin(tm*.2+b.ph)*1.5;b.g.rotation.y=tm*.2+b.ph});
  var c=trCr.c;if(!c)return;var C=LV.crystal;
  c.cry.rotation.y+=dt*(c.got?6:1.2);c.cry.position.y=2.5+Math.sin(tm*2)*.15+(c.got?Math.min(2,c.got*1.4):0);c.halo.material.opacity=.6+Math.sin(tm*3)*.15+(c.got?.3:0);
  if(Math.random()<dt*8)emit(sparkPool,C.x+(Math.random()-.5)*1.4,C.y+1.5+Math.random()*2,1,1,.6,.25,.2,-1);
  if(!c.got&&state==='play'&&Math.abs(P.x-C.x)<1.3&&P.y>C.y-.3&&P.y<C.y+3){c.got=.001;P.cheer=3;try{sfx.win()}catch(e){}emit(sparkPool,C.x,C.y+2.5,40,6,1.4,.5,.4,4);toast('O Cristal Ancestral!')}
  if(c.got){c.got+=dt;P.stun=Math.max(P.stun,.1);P.vx=0;c.beam.material.opacity=Math.min(.55,c.got*.5);c.crm.emissiveIntensity=1.4+c.got*1.5;
    if(c.got>2.2&&state==='play'){c.got=99;winLevel()}}
}
/* tronco caído e oco: o Kuro passa por dentro (a frente é aberta) ou sobe por cima */
function buildHollowLog(x0,x1,top){
  var len=x1-x0+1.2,cx=(x0+x1)/2,R=1.5,cy=top-R,g=new T.Group();g.position.set(cx,cy,-.2);add(g);
  var th0=Math.PI*.36,thL=Math.PI*1.28;/* tira a parte da frente para ver o Kuro lá dentro */
  var outer=new T.CylinderGeometry(R,R,len,22,1,true,th0,thL);outer.rotateZ(Math.PI/2);scaleUV(outer,4,2);
  var o=mesh(outer,trBarkM,true,true);g.add(o);
  var inner=new T.CylinderGeometry(R*.86,R*.86,len,22,1,true,th0,thL);inner.rotateZ(Math.PI/2);
  g.add(mesh(inner,M(0x3a2616,.95,0,{side:T.BackSide}),false,true));
  /* bordas cortadas do tronco (anel claro de madeira nas pontas e na abertura) */
  var EG=[];[-1,1].forEach(function(sd){for(var k=0;k<=16;k++){var a=th0+thL*k/16,y=Math.cos(a-Math.PI/2)*R*.93,z=Math.cos(a)*R*.93;y=Math.sin(a)*R*.93;EG.push(xf(new T.BoxGeometry(.06,.32,.32),[sd*len/2,y,z],[a,0,0]))}});
  g.add(mesh(mgL(EG),M(0xd8a870,.85),false,false));
  /* musgo e cogumelinhos em cima */
  var mg=new T.SphereGeometry(1,10,6,0,6.283,0,1.3),mm=mossM;
  for(var k=0;k<7;k++){var m=mesh(mg,mm,false,true);var a=Math.PI/2+(k%3-1)*.35;m.position.set(-len/2+.6+k*(len-1.2)/6,Math.sin(a)*R*.97,Math.cos(a)*R*.5-.2);m.scale.set(.7,.25,.55);g.add(m)}
  var sc=M(0xe8402a,.6),st=M(0xf2ead8,.8);
  [[-1.8,.3],[1.2,-.5],[2.4,.4]].forEach(function(q){var s=mesh(new T.CylinderGeometry(.06,.08,.3,6),st,false,false);s.position.set(q[0],R+.1,q[1]);g.add(s);var c=mesh(new T.SphereGeometry(.2,10,6,0,6.283,0,1.5),sc,false,false);c.position.set(q[0],R+.26,q[1]);c.scale.y=.7;g.add(c)});
}
/* ---------- decoração ---------- */
function frondTex(){
  var c=document.createElement('canvas');c.width=64;c.height=256;var x=c.getContext('2d');
  x.strokeStyle='#e8f0d0';x.lineWidth=3;x.beginPath();x.moveTo(32,0);x.lineTo(32,256);x.stroke();
  for(var i=0;i<34;i++){var y=6+i*7.2,l=30*Math.sin(Math.min(1,(256-y)/256*1.25)*Math.PI*.55)+4;
    [-1,1].forEach(function(sd){x.fillStyle='rgb('+(200+((i*13)%40))+','+(230+((i*7)%25))+','+(150+((i*11)%40))+')';x.beginPath();x.moveTo(32,y);x.quadraticCurveTo(32+sd*l*.6,y+2,32+sd*l,y+9);x.quadraticCurveTo(32+sd*l*.5,y+7,32,y+5);x.fill()})}
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
}
function bigLeafTex(){
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,128,0);g.addColorStop(0,'#cfeaa0');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#cfeaa0');
  x.fillStyle=g;x.beginPath();x.moveTo(64,124);x.bezierCurveTo(4,96,8,26,64,4);x.bezierCurveTo(120,26,124,96,64,124);x.fill();
  x.strokeStyle='rgba(120,150,80,.8)';x.lineWidth=2.5;x.beginPath();x.moveTo(64,124);x.lineTo(64,8);x.stroke();
  x.lineWidth=1.4;for(var i=0;i<7;i++){var y=110-i*14;x.beginPath();x.moveTo(64,y);x.quadraticCurveTo(44,y-8,22+i*2,y-16);x.moveTo(64,y);x.quadraticCurveTo(84,y-8,106-i*2,y-16);x.stroke()}
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
}
function trGroundAt(x){var t=-99;LV.solids.forEach(function(s){if(x>=s[0]&&x<=s[1]&&s[2]>t)t=s[2]});return t}
function trSand(x){var s=LV.solids[0];return x<s[1]}
function buildTrailDecor(th){
  trMats();var r=rnd(4747),D=new T.Object3D(),col=new T.Color(),lite=LITE,L=[],xe=LV.goal.x+14;
  trFx={flowers:[],boat:null,sea:null,lan:[],bfly:[]};trCr=null;
  /* mar: ondas leves e espuma na beira */
  (function(){
    var g=new T.PlaneGeometry(260,120,lite?40:90,lite?20:40);g.rotateX(-Math.PI/2);
    var m=new T.MeshStandardMaterial({color:0x1594c8,roughness:.32,metalness:0,envMapIntensity:.35,transparent:true,opacity:.94});matReg.push(m);
    m.onBeforeCompile=function(sh){sh.uniforms.time=lushU.time;
      sh.vertexShader='uniform float time;varying vec3 vWp;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec4 wq=modelMatrix*vec4(position,1.);transformed.y+=sin(time*1.3+wq.x*.35+wq.z*.2)*.08+sin(time*.9-wq.z*.5)*.06;vWp=wq.xyz;');
      sh.fragmentShader='uniform float time;varying vec3 vWp;\n'+sh.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\nfloat sh=1.-smoothstep(0.,2.6,abs(vWp.x+3.2)+max(0.,vWp.z-1.8)*0.);float foam=sh*(.55+.45*sin(time*2.2+vWp.z*1.7));float sp=pow(max(0.,sin(vWp.x*2.1+time*1.8)*sin(vWp.z*2.7-time*1.3)),12.);gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.92,.98,1.),clamp(foam*.75+sp*.5,0.,1.));gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.55,.9,.85),.25*smoothstep(-20.,-1.,vWp.x));')};
    var sea=mesh(g,m,false,true);sea.position.set(-128,-.42,-20);add(sea);trFx.sea=sea;
  })();
  /* areia da praia no fundo: desce até o mar e some embaixo do campo verde depois da mata */
  (function(){var g=new T.PlaneGeometry(44,42,lite?22:44,lite?14:28);g.rotateX(-Math.PI/2);g.translate(3,0,-26);var pa=g.attributes.position,uv=g.attributes.uv;
    for(var i=0;i<pa.count;i++){var x=pa.getX(i),z=pa.getZ(i);pa.setY(i,.02+(-5-z)*.014+Math.sin(x*.4+z*.3)*.06-clamp((-x-1)/8,0,1)*1.4-clamp((x-13)/5,0,1)*1.6);uv.setXY(i,x/5,z/5)}
    g.computeVertexNormals();add(mesh(g,trSandM,false,true))})();
  /* coqueiros na praia */
  (function(){
    var ft=frondTex(),fm=new T.MeshStandardMaterial({map:ft,color:0x4fa83a,alphaTest:.45,side:T.DoubleSide,roughness:.8});matReg.push(fm);
    fm.onBeforeCompile=function(sh){sh.uniforms.time=lushU.time;sh.vertexShader='uniform float time;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat wv=sin(time*1.4+position.x*.3)*.12*uv.y;transformed.y+=wv;')};
    var segs=[],fronds=[],nuts=[],P0=[[-1.2,-3.4,.8],[3.2,-6.5,.95],[8.6,-3.9,.75],[12.2,-9,.9],[-.8,-12,.9],[6,-15,1],[15.2,-4.6,.7],[-6,-8,.85],[-9,-17,1]];
    P0.forEach(function(p,i){var hgt=(4.2+r()*1.2)*p[2],lean=(i%2?-.22:.22)+(r()-.5)*.12,x=p[0],z=p[1],n=9,px=x,py=0,pz=z;
      for(var k=0;k<n;k++){var u=k/n,dx=Math.sin(lean)*hgt/n*u*2,dy=hgt/n,nx=px+dx,ny=py+dy;
        var sg=new T.CylinderGeometry(.13*p[2]*(1-u*.35),.17*p[2]*(1-u*.35),Math.hypot(dx,dy)+.02,7);segs.push({g:xf(sg,[(px+nx)/2,(py+ny)/2,pz],[0,0,-Math.atan2(dx,dy)]),c:k%2?0x9a7650:0x86643f});px=nx;py=ny}
      for(var f=0;f<8;f++){var a=f/8*6.283+r()*.3,ln=(2.2+r()*.6)*p[2],fg=new T.PlaneGeometry(1.0*p[2],ln,1,6);fg.translate(0,ln/2,0);
        var pa=fg.attributes.position;for(var v=0;v<pa.count;v++){var yy=pa.getY(v),u2=yy/ln;pa.setZ(v,-u2*u2*ln*.55)}
        fg.rotateX(-Math.PI/2+.62+r()*.3);fg.rotateY(a);fg.translate(px,py,pz);fronds.push(fg)}
      for(var c=0;c<3;c++)nuts.push({g:xf(new T.SphereGeometry(.17*p[2],8,6),[px+Math.cos(c*2.1)*.22,py-.25,pz+Math.sin(c*2.1)*.22]),c:0x5a3a1e});
    });
    add(mesh(mergeG(segs,true),M(0xffffff,.9,0,{vertexColors:true}),true,false));
    var fr=mesh(mgL(fronds),fm,true,false);add(fr);add(mesh(mergeG(nuts,true),M(0xffffff,.6,0,{vertexColors:true}),false,false));
  })();
  /* conchas, estrelas-do-mar e pedrinhas na areia */
  (function(){
    var st=new T.Shape();for(var k=0;k<10;k++){var a=k/10*6.283+Math.PI/2,rr=k%2?.07:.18;if(k===0)st.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);else st.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}
    var sg=new T.ExtrudeGeometry(st,{depth:.04,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:1});sg.rotateX(-Math.PI/2);
    var shellG=new T.SphereGeometry(.12,10,6,0,Math.PI);shellG.rotateX(-Math.PI/2);var peb=new T.DodecahedronGeometry(.1,0),A=[];
    for(var k2=0;k2<(lite?16:30);k2++){var x=-2.4+r()*20,z=r()<.6?.4+r()*1.3:-4.6+r()*3,kd=k2%3,cc=[[0xff8a4a,0xf06a3a],[0xffd8d0,0xf8e8c8,0xffb0b8],[0xa89888,0xd8d0c0]][kd];
      A.push({g:xf((kd===0?sg:kd===1?shellG:peb).clone(),[x,.01,z],[0,r()*6,0],[1+r()*.6,1,1+r()*.6]),c:cc[k2%cc.length]})}
    add(mesh(mergeG(A,true),M(0xffffff,.7,0,{vertexColors:true}),false,true));
  })();
  /* placa de madeira: TERRA NOVA */
  (function(){var c=document.createElement('canvas');c.width=256;c.height=96;var x=c.getContext('2d');x.fillStyle='#b8834a';x.fillRect(0,0,256,96);
    for(var i=0;i<6;i++){x.strokeStyle='rgba(90,50,20,.35)';x.beginPath();x.moveTo(0,10+i*16);x.bezierCurveTo(80,6+i*16,170,16+i*16,256,9+i*16);x.stroke()}
    x.fillStyle='#3a2210';x.font='bold 40px Arial';x.textAlign='center';x.fillText('TERRA NOVA',128,46);x.font='bold 30px Arial';x.fillText('→',128,84);
    var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;
    var g=new T.Group();g.position.set(4.5,0,-2.3);g.rotation.y=.12;add(g);
    var p1=mesh(new T.BoxGeometry(.14,1.7,.14),trBarkM,true,false);p1.position.y=.85;g.add(p1);
    var bd=mesh(new T.BoxGeometry(1.5,.58,.08),[trPlankM,trPlankM,trPlankM,trPlankM,new T.MeshStandardMaterial({map:t,roughness:.85}),trPlankM],true,false);bd.position.y=1.35;bd.rotation.z=-.05;g.add(bd)})();
  /* barquinho (chega na abertura e fica na beira) */
  (function(){
    var g=new T.Group(),hull=new T.SphereGeometry(1,20,10,0,6.283,Math.PI/2,Math.PI/2);var h=mesh(hull,M(0x9a5a2e,.75,0,{side:T.DoubleSide}),true,false);h.scale.set(2,.78,.8);g.add(h);
    var rim=mesh(new T.TorusGeometry(1,.06,6,28),M(0xd8a060,.7),false,false);rim.rotation.x=Math.PI/2;rim.scale.set(1.9,.78,1);g.add(rim);
    var stripe=mesh(new T.TorusGeometry(1,.035,5,28),M(0xf2f2e8,.6),false,false);stripe.rotation.x=Math.PI/2;stripe.scale.set(1.86,.76,1);stripe.position.y=-.2;g.add(stripe);
    [-.6,.5].forEach(function(x){var s=mesh(new T.BoxGeometry(.26,.06,1.3),trPlankM,false,false);s.position.set(x,-.12,0);g.add(s)});
    var oar=new T.Group(),sh=mesh(new T.CylinderGeometry(.03,.03,2.1,5),trPlankM,false,false);sh.rotation.z=1.25;oar.add(sh);var bl=mesh(new T.BoxGeometry(.4,.04,.16),trPlankM,false,false);bl.position.set(.95,-.32,0);bl.rotation.z=1.25;oar.add(bl);oar.position.set(.1,.05,.55);g.add(oar);
    g.position.set(-5.3,.12,.4);add(g);trFx.boat=g;
  })();
  /* árvores gigantes no fundo da trilha (troncos grossos com raízes abertas) e raízes que fazem arcos atrás do caminho */
  (function(){
    var TR=[],RT=[],x;
    for(x=26;x<xe;x+=16+r()*10){var z=-9-r()*6,rad=1.4+r()*.8,h=48,tg=barkCyl(rad*.8,rad,h,12);TR.push(xf(tg,[x,h/2-1,z]));
      for(var k=0;k<6;k++){var a=k/6*6.283+r()*.4,pts=[new T.Vector3(x+Math.cos(a)*rad*.6,3+r(),z+Math.sin(a)*rad*.6),new T.Vector3(x+Math.cos(a)*rad*1.6,1.1,z+Math.sin(a)*rad*1.6),new T.Vector3(x+Math.cos(a)*rad*2.6,-.2,z+Math.sin(a)*rad*2.6)];
        RT.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),8,rad*.32,6,false))}}
    for(x=24;x<xe;x+=11+r()*9){var gt=trGroundAt(x+2.5);if(gt<-50||trInRiver(x,1)||trInRiver(x+5.5,1)||trGroundAt(x)!==gt||trGroundAt(x+5)!==gt)continue;var z2=-3.2-r()*1.2,hh=1.6+r()*1.8,pts2=[];
      for(var k2=0;k2<=6;k2++){var u=k2/6;pts2.push(new T.Vector3(x+u*5.5,gt-.25+Math.sin(u*Math.PI)*hh,z2+Math.sin(u*Math.PI*2)*.3))}
      RT.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts2),16,.28+r()*.14,7,false))}
    var tm2=mesh(mgL(TR),trBarkM,true,true);add(tm2);add(mesh(mgL(RT),trBarkM,true,true));
  })();
  /* tronco caído deitado no fundo e cercas de madeira */
  (function(){var F=[];[[97.5,111],[124,139.5],[171,185]].forEach(function(q){var gt=trGroundAt((q[0]+q[1])/2);
      for(var x=q[0];x<=q[1]+.01;x+=1.9){F.push(xf(new T.BoxGeometry(.13,1.05,.13),[x,gt+.5,-2.75],[0,0,(r()-.5)*.08]))}
      [.42,.8].forEach(function(y){F.push(xf(new T.BoxGeometry(q[1]-q[0]+.3,.09,.07),[(q[0]+q[1])/2,gt+y,-2.68]))})});
    add(mesh(mgL(F),trPlankM,true,false));
    [[58,-5.5,.4],[150,-6,-.3],[192,-5.2,.25]].forEach(function(q){var gt=trGroundAt(q[0]);var lg=mesh(barkCyl(.55,.6,7,10),trBarkM,true,true);lg.rotation.set(0,q[2],Math.PI/2);lg.position.set(q[0],gt+.5,q[1]);add(lg)});
  })();
  /* torre de vigia de madeira com lanternas */
  (function(){var fl=LV.floats.filter(function(f){return f[3]==='plank'&&f[0]<130});if(!fl.length)return;
    var x0=110.9,x1=121.6,top=fl.reduce(function(m,f){return Math.max(m,f[2])},0),H=top+2.6,P2=[],cx=(x0+x1)/2;
    [[x0,1.05,.14],[x1,1.05,.14],[x0,-1.3,.24],[x1,-1.3,.24],[cx,-1.3,.2]].forEach(function(q){P2.push(xf(new T.BoxGeometry(q[2],H,q[2]),[q[0],H/2,q[1]]))});
    fl.forEach(function(f){P2.push(xf(new T.BoxGeometry(f[1]-f[0]+.3,.14,.14),[(f[0]+f[1])/2,f[2]+.75,1.02]));P2.push(xf(new T.BoxGeometry(f[1]-f[0]+.3,.14,.14),[(f[0]+f[1])/2,f[2]+.75,-1.15]));
      for(var x=f[0];x<=f[1]+.01;x+=(f[1]-f[0])/4)P2.push(xf(new T.BoxGeometry(.08,.75,.08),[x,f[2]+.38,-1.15]))});
    for(var y=1.4;y<H-.5;y+=2.5)P2.push(xf(new T.BoxGeometry(x1-x0,.12,.12),[cx,y,-1.42]));
    for(var y2=.6;y2<H-.8;y2+=.62)P2.push(xf(new T.BoxGeometry(.7,.07,.07),[x0+.45,y2,-1.42]));/* escadinha nas costas da torre */
    add(mesh(mgL(P2),trBarkM,true,true));
    /* telhado baixo e firme: dá para subir nele (pula por baixo e cai em cima) */
    var rw=x1-x0+2.2,rm=M(0xc8502a,.75),rim=mesh(new T.BoxGeometry(rw,.3,3.4),trPlankM,true,true);rim.position.set(cx,H+.05,-.1);add(rim);
    var rt=mesh(new T.BoxGeometry(rw-.2,.16,3.2),rm,true,true);rt.position.set(cx,H+.28,-.1);add(rt);
    [-1,1].forEach(function(sd){var ev=mesh(new T.BoxGeometry(rw+.4,.12,.9),rm,true,false);ev.position.set(cx,H+.05,-.1+sd*1.95);ev.rotation.x=sd*.35;add(ev)});
    var cup=mesh(new T.ConeGeometry(1.1,1.1,4),rm,true,false);cup.rotation.y=Math.PI/4;cup.position.set(cx,H+.9,-1.25);cup.scale.z=.5;add(cup);
    solids.push({l:cx-rw/2+.1,r:cx+rw/2-.1,t:H+.36,b:H-.1,oneway:true,flt:true});
    var lm=new T.MeshStandardMaterial({color:0xffc45a,emissive:0xffa030,emissiveIntensity:1.6,roughness:.4});
    [[x0+.3,3.4],[x1-.3,5.9],[x0+.3,8.4],[x1-.3,H-.4],[cx,H-.6]].forEach(function(q,i){var g=new T.Group();g.position.set(q[0],q[1],1.25);add(g);
      var cord=mesh(new T.CylinderGeometry(.015,.015,.4,4),M(0x2a2018,.9),false,false);cord.position.y=.2;g.add(cord);
      var bd=mesh(new T.CylinderGeometry(.16,.13,.36,8),lm,false,false);g.add(bd);var cap=mesh(new T.ConeGeometry(.2,.14,8),M(0x3a2a1a,.6),false,false);cap.position.y=.25;g.add(cap);
      var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffb050,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.75}));gl.scale.set(1.7,1.7,1);g.add(gl);trFx.lan.push({g:g,gl:gl,ph:i*1.3})});
  })();
  /* flores grandes (abrem quando o Kuro chega perto) e folhagens de folha larga */
  (function(){
    var FL=[],x;
    for(x=20;x<xe;x+=1.4+r()*2.6){var gt=trGroundAt(x);if(gt<-50||trSand(x)||trInRiver(x,.8))continue;
      var front=r()<.3,z=front?1.3+r()*.4:-2.2-r()*2.4,s=front?.45+r()*.25:.7+r()*.9;if(!front&&z>-2.9&&r()<.4)continue;
      FL.push({x:x,y:gt,z:z,s:s,hue:[.92,.13,.58,.0,.78][(r()*5)|0],o:front?0:1,ph:r()*6})}
    var n=FL.length,PET=6;
    var stG=new T.CylinderGeometry(.03,.045,1,5);stG.translate(0,.5,0);
    var petG=new T.SphereGeometry(.5,10,6);petG.scale(.6,.12,1);petG.translate(0,0,.48);
    var cenG=new T.SphereGeometry(.17,10,8);
    var stem=new T.InstancedMesh(stG,M(0x3a8a2a,.8),n),pet=new T.InstancedMesh(petG,M(0xffffff,.6,0,{side:T.DoubleSide}),n*PET),cen=new T.InstancedMesh(cenG,M(0xffd23a,.5,0,{emissive:0x5a3a00,emissiveIntensity:.4}),n);
    FL.forEach(function(f,i){D.position.set(f.x,f.y,f.z);D.rotation.set(0,0,(Math.sin(f.ph)*.12));D.scale.set(f.s,f.s*1.5,f.s);D.updateMatrix();stem.setMatrixAt(i,D.matrix);
      for(var k=0;k<PET;k++)pet.setColorAt(i*PET+k,hsl(col,f.hue,.75,f.hue===0?.92:.62+(k%2)*.06))});
    stem.castShadow=true;pet.castShadow=true;add(stem);add(pet);add(cen);
    trFx.flowers={list:FL,pet:pet,cen:cen,PET:PET};trFlowerPose(true);
    /* folhas largas (como costela-de-adão) no chão, no fundo e algumas na frente */
    var lt=bigLeafTex(),lm=new T.MeshStandardMaterial({map:lt,color:0x5cae3a,alphaTest:.5,side:T.DoubleSide,roughness:.75});matReg.push(lm);
    lm.onBeforeCompile=function(sh){sh.uniforms.time=lushU.time;sh.vertexShader='uniform float time;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nvec3 ip=instanceMatrix[3].xyz;transformed.x+=sin(time*1.3+ip.x*.6)*.05*position.y;\n#endif')};
    var LF=[];for(x=16;x<xe;x+=.9+r()*1.8){var gt2=trGroundAt(x);if(gt2<-50||trInRiver(x,.6))continue;if(trSand(x)&&x<15)continue;var fr=r()<.22,zz=fr?1.5+r()*.3:-2.6-r()*2.2,cnt=4+((r()*3)|0),sz=fr?.55+r()*.3:.8+r()*.7;
      for(var k3=0;k3<cnt;k3++)LF.push({x:x+(r()-.5)*.4,y:gt2,z:zz+(r()-.5)*.4,a:k3/cnt*6.283+r(),t:.55+r()*.5,s:sz*(.8+r()*.4)})}
    var lg=new T.PlaneGeometry(1,1.3);lg.translate(0,.65,0);var lf=new T.InstancedMesh(lg,lm,LF.length);
    LF.forEach(function(q,i){D.position.set(q.x,q.y,q.z);D.rotation.set(0,q.a,0);D.rotateX(q.t);D.scale.set(q.s,q.s,q.s);D.updateMatrix();lf.setMatrixAt(i,D.matrix);lf.setColorAt(i,hsl(col,.27+r()*.05,.55,.32+r()*.12))});
    lf.castShadow=true;add(lf);
  })();
  buildRiverDecor();buildGardenDecor();buildCanopyDecor();buildWaterfall();buildMistDecor();buildMirante();
  /* borboletas: asa de cima grande e asa de baixo menor, borda escura com pintinhas, corpo com anteninhas */
  (function(){var SCH=[['#ff8a1a','#ffd04a','#1a1208'],['#3a8aff','#9ae0ff','#0a1630'],['#ff6ab0','#ffd0ea','#3a0a22'],['#ffe23a','#fff8c0','#2a2008'],['#8a5aff','#e0c8ff','#1a0a30']];
    function wingTex(c){var cv=document.createElement('canvas');cv.width=cv.height=128;var x=cv.getContext('2d');
      function shape(){x.beginPath();x.moveTo(64,124);x.bezierCurveTo(70,70,96,10,122,22);x.bezierCurveTo(128,48,110,70,78,84);x.bezierCurveTo(100,92,104,118,82,124);x.closePath();
        x.moveTo(64,124);x.bezierCurveTo(54,100,40,92,30,104);x.bezierCurveTo(24,118,44,128,64,124)}
      x.fillStyle=c[2];shape();x.fill();
      x.save();x.translate(64,124);x.scale(.84,.84);x.translate(-64,-120);var g=x.createLinearGradient(64,124,120,20);g.addColorStop(0,c[1]);g.addColorStop(.5,c[0]);g.addColorStop(1,c[0]);x.fillStyle=g;shape();x.fill();x.restore();
      x.strokeStyle=c[2];x.lineWidth=2;[[100,30],[110,52],[90,70],[84,108],[40,108]].forEach(function(q){x.beginPath();x.moveTo(64,122);x.quadraticCurveTo((64+q[0])/2+6,(122+q[1])/2,q[0],q[1]);x.stroke()});
      x.fillStyle='#ffffff';[[114,30,4],[118,40,3],[106,24,3],[86,118,3],[94,112,2.5]].forEach(function(q){x.beginPath();x.arc(q[0],q[1],q[2],0,6.283);x.fill()});
      x.fillStyle=c[2];x.beginPath();x.arc(92,56,6,0,6.283);x.fill();x.fillStyle=c[1];x.beginPath();x.arc(92,56,3,0,6.283);x.fill();
      var t=new T.CanvasTexture(cv);t.encoding=T.sRGBEncoding;return t}
    var wg=new T.PlaneGeometry(.62,.62);wg.translate(-.04,.31,0);/* a asa sai do corpo (y=0) para fora */
    var bodyM=M(0x2a2018,.6),bg=new T.SphereGeometry(.05,8,6),ag=new T.CylinderGeometry(.006,.006,.2,3);ag.translate(0,.1,0);
    var n=lite?5:10;
    for(var i=0;i<n;i++){var sc=SCH[i%SCH.length],wm=new T.MeshStandardMaterial({map:wingTex(sc),alphaTest:.5,side:T.DoubleSide,roughness:.6,emissive:new T.Color(sc[0]),emissiveIntensity:.12});
      var g=new T.Group(),wings=[];
      [-1,1].forEach(function(sd){var w=new T.Mesh(wg,wm);w.scale.set(1,1,1);var piv=new T.Group();piv.add(w);if(sd<0)w.rotation.y=Math.PI;g.add(piv);wings.push({p:piv,sd:sd})});
      var bd=new T.Mesh(bg,bodyM);bd.scale.set(2.3,.75,.75);g.add(bd);var hd=new T.Mesh(bg,bodyM);hd.scale.setScalar(.65);hd.position.x=.13;g.add(hd);
      [-1,1].forEach(function(sd){var an=new T.Mesh(ag,bodyM);an.position.set(.15,.02,sd*.02);an.rotation.set(sd*.35,0,-.9);g.add(an);var tp=new T.Mesh(bg,bodyM);tp.scale.setScalar(.35);tp.position.set(.15+Math.sin(.9)*.2,.02+Math.cos(.9)*.2,sd*.02+sd*.07);g.add(tp)});
      g.scale.setScalar(.9+r()*.4);add(g);trFx.bfly.push({g:g,w:wings,x:24+i*(lite?34:17)+r()*8,y:1.3+r()*1.5,z:-1.2-r()*2,ph:r()*6,px:0})}trBfly()})();
}
/* abre/fecha as pétalas: flores perto do Kuro abrem e balançam */
function trFlowerPose(all){
  var F=trFx&&trFx.flowers;if(!F||!F.list)return;var D=trFlowerPose.D||(trFlowerPose.D=new T.Object3D()),q=new T.Quaternion(),e=new T.Euler(),i,k,ch=false;
  for(i=0;i<F.list.length;i++){var f=F.list[i],near=Math.abs(f.x-P.x)<3.2?1:0,want=Math.max(near,f.z<0?.85:.25);
    if(!all&&Math.abs(want-f.o)<.004&&!(near&&Math.abs(f.x-P.x)<3.2))continue;
    f.o+=(want-f.o)*(all?1:.12);ch=true;var top=f.y+f.s*1.5,sway=Math.sin(tm*1.6+f.ph)*.05;
    D.position.set(f.x+sway*f.s,top,f.z+.03*f.s);D.rotation.set(.75,0,0);D.scale.set(f.s,f.s*.6,f.s);D.updateMatrix();F.cen.setMatrixAt(i,D.matrix);
    for(k=0;k<F.PET;k++){var a=k/F.PET*6.283+f.ph;D.position.set(f.x+sway*f.s,top,f.z);e.set(.75,0,0);D.quaternion.setFromEuler(e);D.rotateY(a);D.rotateX(-(1.3-f.o*.95));D.scale.setScalar(f.s*(.55+f.o*.45));D.updateMatrix();F.pet.setMatrixAt(i*F.PET+k,D.matrix)}
  }
  if(ch){F.pet.instanceMatrix.needsUpdate=true;F.cen.instanceMatrix.needsUpdate=true}
}
/* ---------- fundo: a Árvore Mãe brilhando no horizonte e camadas de floresta na névoa ---------- */
function buildTrailFar(){
  if(!farG)return;var r=rnd(6161);
  var g=new T.Group();g.position.set(70,-6,-170);farG.add(g);
  function bm(c,o){return new T.MeshBasicMaterial({color:c,fog:false,transparent:o!==undefined,opacity:o===undefined?1:o})}
  var tr=new T.Mesh(new T.CylinderGeometry(5,9,70,10),bm(0x7a8a8a));tr.position.y=35;g.add(tr);
  [[0,78,0,30],[-24,66,6,20],[24,68,4,22],[-12,90,-4,18],[14,92,2,17]].forEach(function(q,i){var s=new T.Mesh(new T.IcosahedronGeometry(q[3],1),bm([0x8ab8a0,0x96c4a8,0x7eae96,0xa0ccb0,0x90bea4][i]));s.position.set(q[0],q[1],q[2]);s.scale.set(1.2,.75,1);g.add(s)});
  var beam=new T.Mesh(new T.CylinderGeometry(4,12,180,14,1,true),new T.MeshBasicMaterial({color:0xfff0b0,transparent:true,opacity:.18,fog:false,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));beam.position.y=150;g.add(beam);trFx.beam=beam;
  var halo=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xfff2c0,transparent:true,opacity:.6,fog:false,depthWrite:false,blending:T.AdditiveBlending}));halo.scale.set(90,90,1);halo.position.y=84;g.add(halo);
  /* camadas de copas na névoa */
  [[-80,0x5c9a7a,.95],[-120,0x84b8a0,.9]].forEach(function(L,li){var bl=[];for(var x=-220;x<220;x+=7+r()*8){var s=5+r()*7;bl.push({g:xf(new T.IcosahedronGeometry(1,1),[x,-2+s*.4+r()*3,L[0]-r()*10],0,[s*1.1,s*.8,s]),c:L[1]})}
    var m=new T.Mesh(mergeG(bl,true),new T.MeshBasicMaterial({vertexColors:true,fog:false,transparent:true,opacity:L[2]}));farG.add(m)});
}
/* ---------- abertura: o barquinho chega, Kuro e a raposinha pulam na areia ---------- */
function buildTrailMech(){
  trIntro=null;LV.tall=0;trMist0=null;buildRiverLogs();buildShrooms();buildCanopyMech();
  LV.xMin=-2.6;
  if(!trIntroDone&&LV.trail){trIntro={on:true,t:0,hop:false};LV.xMin=-9;
    var v=makeFoxVis();add(v.g);fox={vis:v,state:'end',x:-28,y:0,vx:0,vy:0,face:1,t:0,cd:99,ph:0,yaw:-.35,z:-.1,endYaw:0,endSp:0,sit:0};
    P.x=-28;P.y=.3;P.face=1;}
}
function updTrailIntro(dt){
  trBfly();
  var I=trIntro;I.t+=dt;var t=I.t,b=trFx&&trFx.boat;
  var u=Math.min(1,t/3.2),e=1-Math.pow(1-u,3),bx=-30+(-5.3+30)*e,by=.12+Math.sin(tm*2.2)*.05;
  if(b){b.position.set(bx,by,.4);b.rotation.z=Math.sin(tm*1.8)*.04;b.rotation.y=(1-u)*.15}
  if(t<3.5){P.x=bx+.55;P.y=by-.12;P.inv=0;P.vx=0;P.vy=0;P.grounded=true;P.face=1;
    if(fox){fox.x=bx-.9;fox.y=by-.2;fox.vy=0;fox.endSp=0;fox.endYaw=0;fox.z=.35}
    if(((tm*20)|0)%4===0&&u<1)emit(dustPool,bx-1.8,-.3,1,1,.5,.5,1.2,-.2);
    if(keys.jump&&t>.4)I.t=t=3.5;}
  if(t>=3.5&&!I.hop){I.hop=true;P.vy=11;P.vx=8.5;P.grounded=false;P.onPlat=null;try{sfx.jump()}catch(er){}
    if(fox){fox.state='idle';fox.vx=7.5;fox.vy=9;fox.cd=.8;fox.z=0}toast('Terra Nova! A trilha começa na mata');}
  if(I.hop){I.on=false;trIntroDone=true;I.land=true}
}
function updTrail(dt){
  if(!trFx)return;
  if(trIntro&&trIntro.land&&P.grounded){trIntro.land=false;LV.xMin=-2.6}
  if(trFx.boat&&!(trIntro&&trIntro.on)){trFx.boat.position.y=.12+Math.sin(tm*2.2)*.05;trFx.boat.rotation.z=Math.sin(tm*1.8)*.04}
  trFlowerPose(false);updRiver(dt);updShrooms(dt);updCanopy(dt);updWaterfall(dt);updMist();updMirante(dt);if(trRiv&&trRiv.rays)trRiv.rays.forEach(function(o){o.m.opacity=.14+.08*Math.sin(tm*.4+o.ph)});
  trFx.lan.forEach(function(l){l.gl.material.opacity=.6+Math.sin(tm*3+l.ph)*.12;l.g.rotation.z=Math.sin(tm*1.4+l.ph)*.08});
  trBfly();if(trFx.beam)trFx.beam.material.opacity=.15+Math.sin(tm*.8)*.04;
}
function trBfly(){/* borboletas voando (também durante a chegada do barco, para nenhuma ficar parada no chão) */
  if(!trFx)return;trFx.bfly.forEach(function(b){var t=tm*.45+b.ph,fl=Math.sin(tm*13+b.ph);/* voo em zigue-zague, sobe a cada batida de asa */
    var x=b.x+Math.sin(t)*2.4+Math.sin(t*3.1)*.4,y=b.y+Math.sin(t*2.3)*.35+fl*.06,z=b.z+Math.cos(t*.7)*.7;b.g.position.set(x,y,z);
    var dx=x-(b.px||x);b.px=x;if(Math.abs(dx)>1e-4)b.dir=dx>0?1:-1;b.g.rotation.y=(b.dir||1)>0?0:Math.PI;b.g.rotation.z=.15+fl*.05;
    var open=.25+(fl*.5+.5)*1.15;b.w.forEach(function(w){w.p.rotation.x=w.sd*open})});
}
