/*@@parte:29_abertura.js*/
/* ===================== Clipe de abertura: o Rei Besouro rouba o Coração de Cristal da vila =====================
   Passa na primeira vez que o jogador entra no Mundo 1 (e pelo botão "Abertura" do menu). Botão "Pular" ou Espaço/Enter pulam.
   A vila fica à esquerda do começo do Mundo 1 (x -30 a -2), montada só para a cena, leve. */
var opn=null;
function playOpening(after){
  initAudio();buildLevel(0);resetState();state='cine';card.hidden=true;
  var e=opn={t:0,after:after,cx:-9,cy:2.9,zoom:.82,pose:'train',kat:true,yw:undefined,mouth:false,done:false};
  ['hud','pad','stickZone','pauseBtn'].forEach(function(id){var d=$(id);if(d){d.dataset.od=d.style.display||'';d.style.display='none'}});
  e.filt0=renderer.domElement.style.filter||'';if(typeof lushG!=='undefined'&&lushG){e.lush=lushG.visible;lushG.visible=false}if(typeof tuftMesh!=='undefined'&&tuftMesh){e.tuft=tuftMesh.visible;tuftMesh.visible=false}/* capim alto escondia o Kuro na cena */e.hi0=hemi.intensity;e.si0=sun.intensity;e.fog0=scene.fog.color.clone();
  /* o que é da fase (cristais, moedas, inimigos) fica escondido na cena: o cristal da fase parecia o Coração de Cristal no meio do caminho */
  items.forEach(function(it){if(it.mesh)it.mesh.visible=false});if(coinMesh)coinMesh.visible=false;enemies.forEach(function(en){if(en.vis&&en.vis.g)en.vis.g.visible=false});
  /* --- a vila --- */
  var g=new T.Group();add(g);e.g=g;
  var WL=[],WD=[],RF=[],WN=[],TR=[],LF=[];
  function house(x,z,s,ry){var o=[x,0,z];
    WL.push(xf(new T.BoxGeometry(2.8*s,2*s,2.4*s),[x,1*s,z],[0,ry,0]));
    [[-1.4,-1.2],[1.4,-1.2],[-1.4,1.2],[1.4,1.2]].forEach(function(c){var cx=c[0]*s,cz=c[1]*s,rx=x+cx*Math.cos(ry)+cz*Math.sin(ry),rz=z-cx*Math.sin(ry)+cz*Math.cos(ry);WD.push(xf(new T.BoxGeometry(.2*s,2.1*s,.2*s),[rx,1.05*s,rz]))});
    WD.push(xf(new T.BoxGeometry(3*s,.18*s,2.6*s),[x,2.05*s,z],[0,ry,0]));
    RF.push(xf(new T.ConeGeometry(2.5*s,1.7*s,4),[x,2.95*s,z],[0,ry+Math.PI/4,0]));
    var dx=Math.sin(ry)*1.21*s,dz=Math.cos(ry)*1.21*s;WD.push(xf(new T.BoxGeometry(.7*s,1.2*s,.06),[x+dx,.6*s,z+dz],[0,ry,0]));
    WN.push(xf(new T.BoxGeometry(.55*s,.5*s,.06),[x+dx+Math.cos(ry)*.8*s,1.25*s,z+dz-Math.sin(ry)*.8*s],[0,ry,0]))}
  house(-21,-3.6,1,.25);house(-15.6,-6.4,.9,-.1);house(-3.4,-6.6,.95,.15);house(-26.5,-1.8,1.05,.4);house(2.6,-7.5,.85,-.3);
  function tree(x,z,s){TR.push(xf(new T.CylinderGeometry(.18*s,.28*s,2.2*s,7),[x,1.1*s,z]));[[0,2.6,0,1.1],[-.6,2.2,.2,.8],[.65,2.3,-.1,.85],[.1,3.1,-.2,.75]].forEach(function(b){LF.push(xf(new T.IcosahedronGeometry(b[3]*s,1),[x+b[0]*s,b[1]*s,z+b[2]*s]))})}
  tree(-24.5,-6.5,1.2);tree(-8,-8.2,1.1);tree(-18.6,-1.2,.8);tree(5.5,-6,1.15);tree(-29,-5,1);
  g.add(mesh(mgL(WL),M(0xf2e6cc,.85),true,true));g.add(mesh(mgL(WD),M(0x5a3a24,.9),true,false));g.add(mesh(mgL(RF),M(0xb0503a,.7),true,false));
  g.add(mesh(mgL(WN),M(0xffd88a,.5,0,{emissive:new T.Color(0xffb040),emissiveIntensity:.6}),false,false));
  g.add(mesh(mgL(TR),pbr(texWood,.95,1,{color:new T.Color(0x7a5a3c)}),true,false));var lfM=M(0x5fb84a,.85,0,{flatShading:true});g.add(mesh(mgL(LF),lfM,true,false));e.lfM=lfM;
  /* chão da vila (à esquerda do começo do Mundo 1) e a praça de pedra */
  var gr=mesh(boxGeo(30,1.2,10,4),grassM,false,true);gr.position.set(-29,-.6,-3);g.add(gr);
  var pl=mesh(new T.CylinderGeometry(3.4,3.4,.06,28),pbr(texStone,.9,.4,{color:new T.Color(0xd8d0c0)}),false,true);pl.position.set(-11,.03,-.6);g.add(pl);
  /* lanternas de papel */
  [-15,-7].forEach(function(x){var p=mesh(new T.CylinderGeometry(.05,.06,2,6),M(0x3a2a1a,.8),true,false);p.position.set(x,1,1.3);g.add(p);
    var ln=mesh(new T.SphereGeometry(.24,10,8),M(0xe8402a,.6,0,{emissive:new T.Color(0xff5a2a),emissiveIntensity:.7}),false,false);ln.scale.y=1.25;ln.position.set(x,1.95,1.3);g.add(ln)});
  /* o altar com o Coração de Cristal */
  var stn=pbr(texStone,.9,.6,{color:new T.Color(0xe8e0d0)});
  var a1=mesh(new T.BoxGeometry(1.3,.3,1.3),stn,true,true);a1.position.set(-11,.15,-.6);g.add(a1);
  var a2=mesh(new T.CylinderGeometry(.3,.38,1.1,10),stn,true,false);a2.position.set(-11,.85,-.6);g.add(a2);
  var a3=mesh(new T.BoxGeometry(1,.16,1),stn,true,false);a3.position.set(-11,1.48,-.6);g.add(a3);
  var cg=new T.OctahedronGeometry(.42);cg.scale(1,1.4,1);var cry=mesh(cg,new T.MeshStandardMaterial({color:0xbff3ff,roughness:.1,metalness:.3,emissive:0x3ac8ff,emissiveIntensity:1.6}),false,false);g.add(cry);
  var cgl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x9ae8ff,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false}));cgl.scale.set(3,3,1);g.add(cgl);
  e.cry={m:cry,gl:cgl,x:-11,y:2.2,z:-.6};
  /* pétalas caindo */
  var n=LITE?50:120,pos=new Float32Array(n*3),sp=new Float32Array(n);for(var i=0;i<n;i++){pos[i*3]=-30+Math.random()*36;pos[i*3+1]=Math.random()*9;pos[i*3+2]=-4+Math.random()*7;sp[i]=.4+Math.random()*.6}
  var pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));var pt=new T.Points(pg,new T.PointsMaterial({color:0xffb0cc,size:.16,transparent:true,opacity:.9}));g.add(pt);e.pet={p:pt,pos:pos,sp:sp,n:n};
  /* sombra que passa pela vila antes de ele chegar */
  var sh=new T.Mesh(new T.CircleGeometry(1,24),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.scale.set(5,2.4,1);sh.position.set(-40,.05,0);g.add(sh);e.sh=sh;
  /* --- o Rei Besouro (mesmo jeito dos chefes), com asas para voar --- */
  var K=makeBeetle({shell:0x7a3fb0,ring:0xffc43a});K.g.scale.set(2,2,2);add(K.g);
  var gold=M(0xffc43a,.3,.9,{emissive:new T.Color(0x6a4300),emissiveIntensity:.4}),crown=new T.Group();crown.position.set(0,.66,.62);K.inner.add(crown);
  for(i=0;i<5;i++){var an=i/5*Math.PI*2,cn=mesh(new T.ConeGeometry(.06,.2,5),gold);cn.position.set(Math.cos(an)*.14,.08,Math.sin(an)*.14);crown.add(cn)}
  var band=mesh(new T.TorusGeometry(.14,.025,6,16),gold);band.rotation.x=Math.PI/2;crown.add(band);
  var wm=new T.MeshStandardMaterial({color:0xc8a8f0,transparent:true,opacity:.55,side:T.DoubleSide,roughness:.3,depthWrite:false}),wings=[];
  [-1,1].forEach(function(sd){var pv=new T.Group();pv.position.set(sd*.18,.8,-.05);K.inner.add(pv);var w=new T.Mesh(new T.PlaneGeometry(.9,.5),wm);w.rotation.x=-Math.PI/2;w.position.x=sd*.45;pv.add(w);wings.push({p:pv,sd:sd})});
  e.K={v:K,wings:wings,x:-36,y:15,face:1};K.g.position.set(-36,15,0);
  /* --- raposinha sentada vendo o treino --- */
  if(!fox||!fox.vis){var fv=makeFoxVis();add(fv.g);fox={vis:fv,state:'end',x:-4.6,y:0,vx:0,vy:0,face:-1,t:0,cd:99,ph:0,yaw:0}}
  fox.state='end';fox.x=-4.4;fox.y=0;fox.z=.4;fox.endSp=0;fox.endYaw=-1.9;fox.sit=1;fox.cd=99;
  /* Kuro */
  P.x=-6.6;P.y=0;P.vx=0;P.vy=0;P.grounded=true;P.face=-1;P.big=false;
  /* tarjas de cinema, título e botão de pular */
  var ov=document.createElement('div');ov.id='opnOv';ov.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:40;font-family:inherit';
  ov.innerHTML='<div style="position:absolute;left:0;right:0;top:0;height:9vh;background:#000"></div><div style="position:absolute;left:0;right:0;bottom:0;height:9vh;background:#000"></div>'+
    '<div id="opnTitle" style="position:absolute;left:0;right:0;top:20vh;text-align:center;color:#fff;font-weight:900;font-style:italic;font-size:min(12vw,13vh);letter-spacing:.02em;text-shadow:0 .08em 0 #1d2238,0 0 .5em rgba(255,200,80,.6);opacity:0;transition:none">Rumo ao Cume</div>'+
    '<button id="opnSkip" type="button" style="position:absolute;right:3vw;bottom:calc(9vh + 12px);pointer-events:auto;background:rgba(0,0,0,.45);color:#fff;border:2px solid rgba(255,255,255,.7);border-radius:99px;padding:.45em 1.1em;font:700 15px/1 system-ui,sans-serif">Pular ▶</button>';
  document.body.appendChild(ov);e.ov=ov;$('opnSkip').addEventListener('click',function(ev){ev.stopPropagation();endOpening()});
  updateCamera(0,true);
}
function opnLerp(a,b,u){return a+(b-a)*u}
/* correndo no fim do clipe: pula por cima da mola (e de qualquer mola no caminho) em vez de atravessar */
function opnHop(x){var y=0;springs.forEach(function(sp){var d=(x-sp.x)/1.7;if(Math.abs(d)<1)y=Math.max(y,1.7*Math.cos(d*Math.PI/2))});return y}
function opnEase(u){u=clamp(u,0,1);return u*u*(3-2*u)}
function updOpening(dt){var e=opn;if(!e||e.done)return;e.t+=dt;var t=e.t,K=e.K,i;
  if(typeof katana!=='undefined'&&katana)katana.visible=!!e.kat;/* a katana na mão no treino e no final */
  /* pétalas: caem devagar; com o vento forte, voam de lado */
  var wind=t>4&&t<11?1:0,P2=e.pet;for(i=0;i<P2.n;i++){P2.pos[i*3+1]-=P2.sp[i]*dt*(1+wind);P2.pos[i*3]+=(.3+wind*4)*dt*P2.sp[i];if(P2.pos[i*3+1]<0||P2.pos[i*3]>8){P2.pos[i*3+1]=8+Math.random()*2;P2.pos[i*3]=-30+Math.random()*30}}P2.p.geometry.attributes.position.needsUpdate=true;
  /* Coração de Cristal: gira no altar até ser roubado */
  var C=e.cry;C.m.rotation.y+=dt*1.4;
  /* 1) a vila em paz: o Kuro treina katana, a raposinha olha */
  if(t<4){e.pose='train';e.kat=true;e.yw=undefined;P.face=-1;e.cx=opnLerp(-10,-8.6,opnEase(t/4));e.cy=2.7;e.zoom=.82}
  /* 2) o céu escurece, uma sombra passa, o vento sopra */
  if(t>=4&&t<6.6){e.pose='look';e.kat=false;var d=opnEase((t-4)/2);hemi.intensity=e.hi0*(1-.65*d);sun.intensity=e.si0*(1-.75*d);scene.fog.color.copy(e.fog0).lerp(new T.Color(0x3a2a4a),d*.7);
    e.sh.position.x=opnLerp(-40,10,(t-4)/2.6);e.sh.material.opacity=.35*Math.sin(Math.PI*clamp((t-4)/2.6,0,1));
    if(!e.s1){e.s1=1;try{noise(1.6,.06,180,'lowpass');sfx.alert()}catch(er){}}}
  /* 3) o Rei Besouro desce voando e bate no chão */
  var kx=K.x,ky=K.y,fly=false;
  if(t<6.6){kx=-36;ky=15}
  else if(t<8){var u=(t-6.6)/1.4,ue=u*u;kx=opnLerp(-36,-14,opnEase(u));ky=opnLerp(15,0,ue);fly=true}
  else if(t<11.6){kx=-14;ky=0}
  else if(t<15){var v=(t-11.6)/3.4;kx=opnLerp(-14,34,v*v);ky=opnLerp(0,8,Math.sin(v*Math.PI/2))+Math.sin(v*9)*.25;fly=true}
  else{kx=60;ky=20}
  if(t>=8&&!e.slam){e.slam=1;shake=Math.max(shake,.55);emit(dustPool,-14,.2,24,4,.8,.8,1.4,-.3);emit(sparkPool,-14,.4,10,3,.5,.35,.2,2);try{sfx.stomp();noise(.5,.12,120,'lowpass')}catch(er){}}
  K.x=kx;K.y=ky;K.v.g.position.set(kx,ky,0);K.v.g.rotation.y=Math.PI/2;K.v.inner.rotation.z=fly?-.15:0;
  K.wings.forEach(function(w){w.p.visible=fly;w.p.rotation.z=w.sd*(fly?Math.sin(tm*30)*.7:0)});
  if(t>8&&t<11.6){K.v.inner.position.y=t>10&&t<11.4?Math.abs(Math.sin((t-10)*14))*.06:0;K.v.inner.rotation.x=t>9&&t<9.6?.25:0}else{K.v.inner.position.y=0;K.v.inner.rotation.x=0}
  /* o Kuro se assusta e pula para trás */
  if(t>=6.6&&t<11.6){e.pose=t<9.6?'scared':'look';var hb=clamp((t-8)/.45,0,1);P.x=opnLerp(-6.6,-5.4,opnEase(hb));P.y=t>8&&t<8.45?Math.sin(hb*Math.PI)*.55:0;e.cx=opnLerp(-8.6,-10,opnEase((t-6.6)/1.5));e.cy=opnLerp(2.7,3.1,opnEase((t-6.6)/1.5));e.zoom=opnLerp(.82,.9,opnEase((t-6.6)/1.5))}
  /* 4) arranca o cristal do altar, segura no alto e ri; a vila perde a cor */
  var cx=C.x,cy=C.y;
  if(t>=9.4&&t<11.6){var gu=opnEase((t-9.4)/.6);cx=opnLerp(C.x,-13.6,gu);cy=opnLerp(C.y,3.9,gu)}
  if(t>=11.6){var hu=opnEase((t-11.6)/.4);cx=opnLerp(-13.6,K.x+2.2,hu);cy=opnLerp(3.9,K.y+1.1,hu)}/* leva o cristal agarrado na frente, sempre junto com ele */
  C.m.position.set(cx,cy+Math.sin(tm*3)*.06,t<9.4?C.z:.7);C.gl.position.copy(C.m.position);C.m.visible=t<15.5;C.gl.visible=C.m.visible;
  if(t>=9.4&&!e.grab){e.grab=1;try{beep(1320,.2,'sine',.06);beep(990,.25,'sine',.05,0,.08)}catch(er){}}
  if(t>=10&&!e.laugh){e.laugh=1;try{[0,1,2,3].forEach(function(k){beep(330-k*30,.14,'square',.06,-40,k*.2)})}catch(er){}}
  var dr=opnEase((t-10)/1.4);if(t>=10){renderer.domElement.style.filter=e.filt0+' saturate('+(1-.6*dr).toFixed(2)+')';e.lfM.color.setHex(0x5fb84a).lerp(new T.Color(0x7a8a6a),dr)}
  /* 5) foge voando na direção do Vale Verde; o Kuro olha ele passar */
  if(t>=11.6&&t<15){e.pose='look';e.yw=K.x>P.x?Math.PI/2:-Math.PI/2;var fk=opnEase((t-11.6)/1.2);e.cx=opnLerp(-10,(P.x+Math.min(K.x,14))/2,fk);e.cy=opnLerp(3.1,1.6+Math.min(K.y,8)*.5,fk);e.zoom=opnLerp(.9,1.15,fk);if(!e.s2){e.s2=1;try{noise(.8,.05,500,'bandpass')}catch(er){}}}
  /* 6) a decisão: aperta a faixa, ergue a katana, título; e sai correndo atrás do besouro */
  if(t>=15&&t<19.2){if(e.c15===undefined){e.c15=[e.cx,e.cy]}e.cx=opnLerp(e.c15[0],P.x,opnEase((t-15)/.8));e.cy=opnLerp(e.c15[1],2.2,opnEase((t-15)/.8));e.zoom=opnLerp(1.05,.5,opnEase((t-15)/.9));e.yw=.15;
    if(t<16.4){e.pose='band';e.kat=false}else{e.pose='raise';e.kat=true;if(!e.glint){e.glint=1;try{beep(1760,.25,'sine',.05);beep(2350,.3,'sine',.04,0,.06)}catch(er){}}}
    var tt=$('opnTitle');if(tt)tt.style.opacity=clamp((t-16.2)/.6,0,1)*(1-clamp((t-18.8)/.4,0,1))}
  if(t>=19.2){e.pose=null;e.kat=false;e.yw=undefined;P.face=1;P.vx=7.6;P.x+=P.vx*dt;P.y=opnHop(P.x);P.grounded=P.y<.02;P.vy=P.grounded?0:(opnHop(P.x+.05)-P.y)/.05*P.vx;e.cx=P.x+1.5;e.cy=2.6;e.zoom=opnLerp(.5,.9,opnEase((t-19.2)/1));
    fox.endSp=7;fox.sit=0;fox.endYaw=-.35;fox.z=0;fox.x=Math.min(P.x-1.6,fox.x+dt*7.4);fox.y=opnHop(fox.x)*.9;fox.vy=fox.y>.02?1:0}
  if(t>=20.4){var f=$('fade');f.style.opacity=clamp((t-20.4)/.6,0,1)}
  if(t>=21.1)endOpening();
}
function opnPose(tg){var e=opn,p=e.pose,mo=false;tg.twist=0;tg.pel=0;tg.hy=HY;
  if(p==='train'){var k=(tm*1.6)%2,sw=k<1?k:2-k,s2=opnEase(sw);tg.shR=-2.6+s2*2.2;tg.elR=-.3;tg.abdR=.15;tg.shL=.3;tg.elL=-1.3;tg.abdL=.5;tg.hipL=-.5;tg.kneeL=.6;tg.hipR=.35;tg.kneeR=.3;tg.lean=.1+s2*.15;tg.twist=(s2-.5)*.5;tg.head=0;tg.hy=HY-.12}
  else if(p==='look'){tg.shL=.15;tg.shR=.15;tg.elL=-.35;tg.elR=-.35;tg.abdL=.2;tg.abdR=.2;tg.hipL=-.1;tg.kneeL=.12;tg.hipR=.1;tg.kneeR=.12;tg.lean=-.08;tg.head=-.45}
  else if(p==='scared'){tg.shL=-1.3;tg.shR=-1.3;tg.elL=-1.5;tg.elR=-1.5;tg.abdL=.5;tg.abdR=.5;tg.hipL=-.35;tg.kneeL=.5;tg.hipR=.2;tg.kneeR=.45;tg.lean=-.35;tg.head=.1;tg.hy=HY-.08;mo=true}
  else if(p==='band'){var b=Math.sin(tm*14)*.08;tg.shL=-2.4+b;tg.shR=-2.4-b;tg.elL=-2.1;tg.elR=-2.1;tg.abdL=.95;tg.abdR=.95;tg.hipL=-.1;tg.kneeL=.1;tg.hipR=.1;tg.kneeR=.1;tg.lean=0;tg.head=-.1}
  else if(p==='raise'){tg.shR=-3.1;tg.elR=-.05;tg.abdR=.12;tg.shL=.25;tg.elL=-1.5;tg.abdL=.6;tg.hipL=-.3;tg.kneeL=.12;tg.hipR=.3;tg.kneeR=.12;tg.lean=-.1;tg.head=-.25;mo=true}
  return mo}
function endOpening(){var e=opn;if(!e||e.done)return;e.done=true;
  if(e.ov&&e.ov.parentNode)e.ov.parentNode.removeChild(e.ov);
  renderer.domElement.style.filter=e.filt0;if(e.lush!==undefined&&lushG)lushG.visible=e.lush;if(e.tuft!==undefined&&tuftMesh)tuftMesh.visible=e.tuft;
  ['hud','pad','stickZone','pauseBtn'].forEach(function(id){var d=$(id);if(d)d.style.display=d.dataset.od||''});
  save.seenOpen=1;writeSave();
  var after=e.after;opn=null;$('fade').style.opacity=0;fadeIn=.45;
  if(after)after();else showMenu();
}
