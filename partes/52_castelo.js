/*@@parte:52_castelo.js*/
/* ===================== castelo: inimigos, magias, fogo, porta ===================== */
var flames=[],eShots=[],doorObj=null,cpSave={},castleFx={torches:[],flash:0,next:6,glow:null};
function sfxMagic(){beep(520,.2,'sawtooth',.03,-320);beep(780,.12,'triangle',.02,-200,.04)}
function loseWings(e){
  /* besouro voador pisado: perde as asas, cai e passa a andar no chão */
  e.type='beetle';e.nw=true;
  if(e.vis.wings)e.vis.wings.forEach(function(w){w.p.visible=false});
  e.vy=0;e.grounded=false;e.st='patrol';e.alertT=0;e.loseT=0;e.speed=1.6*(LV.es||1);e.cur=e.speed;e.dir=P.x>e.x?-1:1;
  /* sai de cima de bloco/cano para cair no chão */
  var hw=e.w*.8+.1,best=null,bo=99,offs=[0,.3,-.3,.6,-.6,.9,-.9,1.2,-1.2,1.6,-1.6,2,-2,2.5,-2.5,3,-3];
  for(var i=0;i<offs.length;i++){
    var nx=e.x+offs[i],bad=false;
    for(var k=0;k<solids.length;k++){var q=solids[k];if(q.dead||q.hid||!(q.block||q.pipe))continue;
      if(nx+hw>q.l&&nx-hw<q.r&&q.t<=e.y+.5){bad=true;break}}
    if(bad||!terrOK(e,nx)||landTop(e,nx,-9,-.3)===null)continue;
    best=nx;break;
  }
  if(best!==null)e.x=best;
  emit(sparkPool,e.x,e.y+.8,12,3.2,.6,.35,.2,3);emit(dustPool,e.x,e.y+.6,8,2.4,.5,.5,1.1,-.2);
}
/* pulo normal: inimigo de chão dorme um tempo; voador é derrubado (cai e dorme, depois volta a voar). Pulo giratório (sjump) derrota. */
function sjTxt(){return 'pulo giratório ('+(coarse?'arraste o Pular para cima':'K')+')'}
var FLYERS={bat:1,dfly:1,moth:1,turtle:1,tchase:1,witch:1,bee:1,owl:1,sbird:1};
function sleepE(e){var fl=!!FLYERS[e.type];if(!(e.slp>0))e.slpY=e.y;e.slp=fl?4:5;e.fly=fl;var g0=floorBelow(e.x,e.y+.1);e.landed=!fl&&g0>-90&&e.y-g0<.06;e.svy=0;e.vx=0;/* todos caem até o que tiver embaixo (sapo no meio do pulo também) */e.wake=0;e.safe=true;e.cur=0;e.st='patrol';e.alertT=0;if(e.type==='moth')e.sit=0;/* mariposa derrubada: a luz da roda volta */
  emit(sparkPool,e.x,e.y+e.h,8,2.2,.4,.3,.2,2);if(!sleepE.told){sleepE.told=true;toast((fl?'Derrubado!':'Dormindo!')+' Use o '+sjTxt()+' para derrotar')}}
function sleepUpd(e,dt){/* true = está dormindo/voltando (a IA espera) */
  if(e.slp>0){e.slp-=dt;e.cur=0;e.safe=true;
    if(!e.landed){e.svy-=22*dt;var ny=e.y+e.svy*dt,g=floorBelow(e.x,e.y+.1);if(g>-90&&ny<=g){ny=g;e.landed=true;e.svy=0;emit(dustPool,e.x,g+.1,6,2,.5,.5,1.2,-.3);if(!e.fly){e.vy=0;e.fg=true;e.grounded=true}}e.y=ny;if(e.y<-9){e.alive=false;e.deadT=9;if(e.vis)e.vis.g.visible=false;return true}}
    else{var g3=floorBelow(e.x,e.y+.1);if(g3<e.y-.3){e.landed=false;e.svy=0}else if(g3>e.y)e.y=g3}/* o apoio andou ou sumiu: cai de novo */
    if(((tm*3+e.ph)|0)%3===0&&Math.random()<.04)emit(sparkPool,e.x+.2,e.y+e.h*.6+.4,1,.5,.9,.3,.25,-.6);/* zzz */
    if(e.slp<=0){if(e.fly)e.wake=1;else{e.safe=false;e.vy=0;e.vx=0;e.fg=true;e.hop=Math.max(e.hop||0,.8)}emit(dustPool,e.x,e.y+.3,5,1.8,.4,.5,1.2,-.3)}
    return true}
  if(e.wake){var dy=(e.slpY||e.y)-e.y;if(Math.abs(dy)<.08){e.y=e.slpY;e.wake=0;e.safe=false;return false}e.y+=Math.sign(dy)*Math.min(Math.abs(dy),4*dt);e.safe=true;return true}
  return false}
function killE(e,how){
  if(e.type==='worm'||e.type==='jfish'||e.type==='owl')e.zz=1;/* Minhocão: quando acordar, cava de volta para a toca */
  if(how==='stomp'&&e.slp>0){sleepE(e);return true}/* pisou de novo: dorme mais */
  if(e.type==='tguard'&&e.wings&&how!=='spin'&&how!=='sjump'){/* 1º golpe: perde as asas e cai; 2º golpe derrota */
    e.wings=false;e.vy=0;e.st='patrol';emit(sparkPool,e.x,e.y+.8,10,3,.5,.3,.2,2);emit(dustPool,e.x,e.y+.8,6,2,.5,.6,1.2,-.3);if(!e.told){e.told=true;toast('A guardiã perdeu as asas! Use o '+sjTxt()+' para derrotar')}return true}
  if(e.type==='tshell'){if(how==='fire'){try{beep(1200,.08,'square',.05)}catch(er){}return false}/* o fogo ricocheteia no casco */
    if(how==='stomp'){e.shellT=2.2;e.st='patrol';emit(sparkPool,e.x,e.y+.6,8,2.5,.4,.3,.2,2);if(!e.told){e.told=true;toast('Casco duro! Use o '+sjTxt()+' para derrotar')}return true}}
  if(e.type==='wbeetle'&&how==='stomp'){loseWings(e);return true}
  if(e.type==='wrob'&&how==='stomp'){e.off=3.5;e.safe=true;emit(sparkPool,e.x,e.y+1.2,8,2.5,.4,.3,.2,2);try{beep(520,.1,'square',.05);beep(260,.25,'square',.05,0,.08)}catch(er){}if(!e.told){e.told=true;toast('A corda do robô parou! Use o '+sjTxt()+' para derrotar')}return true}
  if(e.type==='skel'&&how!=='fire'&&how!=='sjump'){
    if(e.bones)return false;
    e.bones=true;e.bt=4.8;e.bAge=0;e.noHit=true;e.st='patrol';e.cur=0;
    emit(dustPool,e.x,e.y+.5,9,2.4,.6,.6,1.3,-.3);
    return true;
  }
  if(how==='stomp'){sleepE(e);return true}
  e.alive=false;e.deadT=0;if(how==='spin')e.fling={vx:(e.x>=P.x?1:-1)*(9+Math.random()*2.5),vy:7+Math.random()*1.5,t:0,sp:(e.x>=P.x?-1:1)*(13+Math.random()*4)};return true;
}
function makeSkel(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var bone=M(0xece6d2,.75),shade=M(0xcfc8b0,.8),eye=new T.MeshStandardMaterial({color:0x0c1a0c,emissive:0x58ff7a,emissiveIntensity:2.2}),rust=M(0x8a7766,.45,.6),cloth=M(0x4a2a3a,.9);
  var body=new T.Group();inner.add(body);
  var pel=mesh(new T.BoxGeometry(.32,.12,.17),bone);pel.position.y=.62;body.add(pel);
  var sp=mesh(new T.CylinderGeometry(.04,.04,.42,6),bone);sp.position.y=.85;body.add(sp);
  for(var i=0;i<4;i++){var rb=mesh(new T.TorusGeometry(.16-i*.012,.016,5,14),bone);rb.rotation.x=Math.PI/2;rb.scale.set(1,.7,1);rb.position.y=.74+i*.09;body.add(rb)}
  var sash=mesh(new T.BoxGeometry(.4,.1,.22),cloth);sash.position.y=.6;body.add(sash);
  var head=new T.Group();head.position.y=1.12;body.add(head);
  var sk=mesh(new T.SphereGeometry(.17,14,10),bone);sk.scale.set(1,1.05,1.02);sk.position.y=.1;head.add(sk);
  var jaw=mesh(new T.BoxGeometry(.18,.06,.14),shade);jaw.position.set(0,-.05,.04);head.add(jaw);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.04,8,6),eye,false,false);ey.position.set(sd*.07,.13,.14);head.add(ey)});
  function arm(sd){
    var sh=new T.Group();sh.position.set(sd*.22,1.02,0);body.add(sh);
    var up=mesh(new T.CylinderGeometry(.03,.03,.3,6),bone);up.position.y=-.15;sh.add(up);
    var el=new T.Group();el.position.y=-.3;sh.add(el);
    var lo=mesh(new T.CylinderGeometry(.028,.028,.28,6),bone);lo.position.y=-.14;el.add(lo);
    var hd2=mesh(new T.SphereGeometry(.05,8,6),shade);hd2.position.y=-.3;el.add(hd2);
    return {sh:sh,el:el};
  }
  function leg(sd){
    var hp=new T.Group();hp.position.set(sd*.1,.6,0);body.add(hp);
    var th=mesh(new T.CylinderGeometry(.04,.04,.3,6),bone);th.position.y=-.15;hp.add(th);
    var kn=new T.Group();kn.position.y=-.3;hp.add(kn);
    var sn=mesh(new T.CylinderGeometry(.035,.035,.3,6),bone);sn.position.y=-.15;kn.add(sn);
    var ft=mesh(new T.BoxGeometry(.1,.05,.22),shade);ft.position.set(0,-.3,.05);kn.add(ft);
    return {hp:hp,kn:kn};
  }
  var aL=arm(1),aR=arm(-1),lL=leg(1),lR=leg(-1);
  var sw=new T.Group();sw.position.set(0,-.3,.04);aR.el.add(sw);sw.rotation.x=1.2;
  sw.add(mesh(new T.BoxGeometry(.035,.5,.012),rust)).position.y=.28;
  sw.add(mesh(new T.BoxGeometry(.12,.025,.03),rust)).position.y=.03;
  var pile=new T.Group();inner.add(pile);pile.visible=false;
  var psk=mesh(new T.SphereGeometry(.16,10,8),bone);psk.position.set(.05,.2,0);pile.add(psk);
  var pe=mesh(new T.SphereGeometry(.035,6,5),eye,false,false);pe.position.set(.05,.24,.14);pile.add(pe);
  var bg=new T.CylinderGeometry(.03,.03,.34,5);
  for(var k=0;k<7;k++){var bn=mesh(bg,k%2?bone:shade);bn.position.set((k-3)*.09,.05+(k%3)*.03,(k%2?.08:-.08));bn.rotation.set(Math.random()*.5,Math.random()*3,Math.PI/2+(Math.random()-.5)*.6);pile.add(bn)}
  var rbp=mesh(new T.TorusGeometry(.14,.016,5,12,Math.PI),bone);rbp.position.set(-.1,.1,.05);rbp.rotation.x=1.2;pile.add(rbp);
  add(g);
  return {g:g,inner:inner,body:body,head:head,aL:aL,aR:aR,lL:lL,lR:lR,pile:pile};
}
function makeWitch(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var robe=M(0x3a1f5a,.8),robe2=M(0x5a2f86,.7),skin=M(0x8fd05a,.6),hatM=M(0x241238,.8),wood=M(0x6b4a2e,.8),hairM=M(0xd9d3e8,.8);
  var eye=new T.MeshStandardMaterial({color:0x201000,emissive:0xffd23a,emissiveIntensity:2});
  var br=mesh(new T.CylinderGeometry(.035,.035,1.5,6),wood);br.rotation.x=Math.PI/2;br.position.set(0,.2,0);inner.add(br);
  var bris=mesh(new T.ConeGeometry(.16,.6,8),M(0xb8892f,.9));bris.rotation.x=-Math.PI/2;bris.position.set(0,.2,-.95);inner.add(bris);
  var cloak=new T.Group();cloak.position.y=.3;inner.add(cloak);
  var cone=mesh(new T.ConeGeometry(.34,.95,10),robe);cone.position.y=.5;cloak.add(cone);
  var trim=mesh(new T.TorusGeometry(.33,.03,6,16),robe2);trim.rotation.x=Math.PI/2;trim.position.y=.05;cloak.add(trim);
  var head=new T.Group();head.position.y=1.12;inner.add(head);
  var face=mesh(new T.SphereGeometry(.19,14,10),skin);head.add(face);
  var nose=mesh(new T.ConeGeometry(.045,.16,6),skin);nose.rotation.x=Math.PI/2;nose.position.set(0,-.02,.2);head.add(nose);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.035,8,6),eye,false,false);ey.position.set(sd*.08,.04,.16);head.add(ey)});
  var brim=mesh(new T.CylinderGeometry(.34,.34,.03,16),hatM);brim.position.y=.15;head.add(brim);
  var hat=mesh(new T.ConeGeometry(.2,.62,10),hatM);hat.position.set(0,.47,0);hat.rotation.z=-.15;head.add(hat);
  var band=mesh(new T.TorusGeometry(.19,.025,6,14),M(0xffc233,.4,.7));band.rotation.x=Math.PI/2;band.position.y=.2;head.add(band);
  var hair=mesh(new T.SphereGeometry(.15,10,8),hairM);hair.position.set(0,0,-.12);head.add(hair);
  var staff=new T.Group();staff.position.set(.34,.35,.1);inner.add(staff);
  var rod=mesh(new T.CylinderGeometry(.025,.025,1.1,6),wood);rod.position.y=.45;staff.add(rod);
  var orbM=new T.MeshStandardMaterial({color:0x2a0a4a,emissive:0xb04cff,emissiveIntensity:1.6});
  var orb=mesh(new T.SphereGeometry(.11,12,10),orbM,false,false);orb.position.y=1.04;staff.add(orb);
  var arm=mesh(new T.CapsuleGeometry(.04,.3,4,6),robe2);arm.position.set(.2,.75,.12);arm.rotation.z=-.9;inner.add(arm);
  add(g);
  return {g:g,inner:inner,head:head,cloak:cloak,orb:orb,orbM:orbM,staff:staff};
}
function shurikenGeo(){var sh=new T.Shape();for(var i=0;i<8;i++){var a=i/8*Math.PI*2,rr=i%2?.08:.3;if(i)sh.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else sh.moveTo(rr,0)}var g=new T.ExtrudeGeometry(sh,{depth:.04,bevelEnabled:false});g.translate(0,0,-.02);return g}
function shotsEnsure(){
  if(eShots.length)return;
  for(var i=0;i<12;i++){
    var gr=new T.Group();
    var core=new T.Mesh(new T.SphereGeometry(.2,10,8),new T.MeshBasicMaterial({color:0xd08cff}));gr.add(core);
    var gl=new T.Sprite(new T.SpriteMaterial({map:sprTex,color:0xb04cff,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false}));gl.scale.set(1.3,1.3,1);gr.add(gl);
    var star=mesh(shurikenGeo(),M(0xd8dde4,.25,.85),false,false);star.visible=false;gr.add(star);
    gr.visible=false;add(gr);
    eShots.push({on:false,g:gr,core:core,gl:gl,star:star,x:0,y:0,vx:0,vy:0,kind:'p',life:0});
  }
}
function fireShot(x,y,kind){
  shotsEnsure();
  var s=null;for(var i=0;i<eShots.length;i++)if(!eShots[i].on){s=eShots[i];break}
  if(!s)return;
  var tx=P.x,ty=P.y+.85,dx=tx-x,dy=ty-y,d=Math.hypot(dx,dy)||1,sp=kind==='g'?4.3:(kind==='s'?5.4:(kind==='d'?4.8:hd(6.6,7.4)));
  s.on=true;s.kind=kind;s.x=x;s.y=y;s.vx=dx/d*sp;s.vy=dy/d*sp;s.life=kind==='g'?5:3.6;s.sp=sp;
  var col=kind==='g'?0x5aff7a:(kind==='d'?0x8ad84a:0xd08cff);s.core.material.color.set(col);s.gl.material.color.set(kind==='g'?0x3aff6a:(kind==='s'?0x8a96b0:(kind==='d'?0x6ac43a:0xb04cff)));s.core.scale.setScalar(kind==='d'?.6:1);
  var sh=kind==='s';s.core.visible=!sh;if(s.star)s.star.visible=sh;s.gl.material.opacity=sh?.35:1;
  s.g.visible=true;s.g.position.set(x,y,0);if(sh)beep(1500,.07,'triangle',.025,-700);else if(kind==='d')beep(420,.08,'square',.02,220);else sfxMagic();
}
function shotKill(s,boom){
  s.on=false;s.g.visible=false;
  if(boom){emit(sparkPool,s.x,s.y,10,3.4,.5,.3,.2,1);}
}
function updShots(dt){
  if(!eShots.length)return;
  for(var i=0;i<eShots.length;i++){
    var s=eShots[i];if(!s.on)continue;
    s.life-=dt;if(s.life<=0||state!=='play'){shotKill(s,s.life<=0);continue}
    if(s.kind==='g'){
      var dx=P.x-s.x,dy=P.y+.85-s.y,d=Math.hypot(dx,dy)||1,tvx=dx/d*s.sp,tvy=dy/d*s.sp,k=1-Math.exp(-dt*1.9);
      s.vx+=(tvx-s.vx)*k;s.vy+=(tvy-s.vy)*k;
    }
    s.x+=s.vx*dt;s.y+=s.vy*dt;
    s.g.position.set(s.x,s.y,0);
    var pu=1+Math.sin(tm*18+i)*.12;s.gl.scale.set(1.3*pu,1.3*pu,1);
    if(s.kind==='s'){if(s.star)s.star.rotation.z-=dt*18*(s.vx>0?1:-1)}
    else if(((tm*40)|0)%3===0)emit(sparkPool,s.x,s.y,1,.6,.3,.2,0,0);
    var hit=false,k2;
    for(k2=0;k2<solids.length;k2++){
      var q=solids[k2];if(q.dead||q.hid||q.oneway||q.flt)continue;
      if(s.x+.18>q.l&&s.x-.18<q.r&&s.y+.18>q.b&&s.y-.18<q.t){hit=true;break}
    }
    if(hit){shotKill(s,true);continue}
    for(k2=0;k2<fbs.length;k2++){
      var f=fbs[k2];if(!f.on)continue;
      if(Math.hypot(f.x-s.x,f.y-s.y)<.55){fbBoom(f);shotKill(s,true);hit=true;break}
    }
    if(hit)continue;
    var qx=clamp(s.x,P.x-P.w/2,P.x+P.w/2),qy=clamp(s.y,P.y,P.y+P.h);
    if(Math.hypot(s.x-qx,s.y-qy)<.32){shotKill(s,true);hurt(s.x-s.vx*.2);}
  }
}
function resetShots(){eShots.forEach(function(s){s.on=false;s.g.visible=false})}
/* ---------- fogo ---------- */
function buildFlames(){
  var fm=new T.MeshBasicMaterial({color:0xff7a22,transparent:true,opacity:.92,depthWrite:false}),fm2=new T.MeshBasicMaterial({color:0xffd23a,transparent:true,opacity:.95,depthWrite:false});
  var vm=M(0x2a2630,.5,.7,{emissive:new T.Color(0x601800),emissiveIntensity:.3});
  (LV.flames||[]).forEach(function(f){
    var g=new T.Group();g.position.set(f.x,f.y,-.2);add(g);
    var vent=mesh(new T.BoxGeometry(.9,.14,.7),vm);vent.position.y=(f.dir||1)*.04;g.add(vent);
    var fl=new T.Group();g.add(fl);
    if(curTheme.name==='volcano'){/* no vulcão o jato usa o mesmo fogo das labaredas */
      var fj=fireMat(Math.max(3,(f.len||2.8)*.8),1);for(var pk=0;pk<2;pk++){var jp=new T.Mesh(new T.PlaneGeometry(1.5,1).translate(0,.5,0),fj);jp.rotation.y=pk*Math.PI/2;jp.frustumCulled=false;fl.add(jp)}
    }else{
    var c1=mesh(new T.ConeGeometry(.42,1,9),fm,false,false);c1.position.y=.5;fl.add(c1);
    var c2=mesh(new T.ConeGeometry(.24,.8,8),fm2,false,false);c2.position.y=.4;fl.add(c2);}
    var gl=new T.Sprite(new T.SpriteMaterial({map:sprTex,color:0xff8a30,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false}));gl.scale.set(2,2,1);g.add(gl);
    if(f.dir===-1)fl.rotation.z=Math.PI;
    flames.push({x:f.x,y:f.y,dir:f.dir||1,len:f.len||2.8,per:f.per||3.6,ph:f.ph||0,g:g,fl:fl,gl:gl,on:false});
  });
}
function updFlames(dt){
  for(var i=0;i<flames.length;i++){
    var f=flames[i],u=(mt+f.ph)%f.per,warnS=f.per-1.9,blastS=f.per-1.0,sc,on=false;
    if(u>=blastS){sc=f.len*(.9+Math.sin(tm*30+i)*.08);on=true}
    else if(u>=warnS){sc=.35+.25*Math.sin(tm*40)+(u-warnS)/(blastS-warnS)*.5;}
    else sc=.18+Math.sin(tm*9+i)*.04;
    var wd=on?1:.55;
    f.fl.scale.set(wd,Math.max(.05,sc),wd);
    f.gl.position.set(0,f.dir*sc*.5,0);var gs=on?3.2:1.2;f.gl.scale.set(gs,gs,1);f.gl.material.opacity=on?1:.55;
    if(on&&!f.on){f.on=true;if(Math.abs(P.x-f.x)<14)try{noise(.5,.05,500,'lowpass')}catch(e){}}
    if(!on)f.on=false;
    if(on&&state==='play'){
      var y0=f.dir>0?f.y:f.y-f.len,y1=f.dir>0?f.y+f.len:f.y;
      if(P.x+P.w/2>f.x-.45&&P.x-P.w/2<f.x+.45&&P.y<y1&&P.y+P.h>y0)hurt(f.x);
    }
  }
}
/* ---------- porta do salão do trono ---------- */
function buildDoor(){
  var D=LV.door;if(!D)return;
  var wood=M(0x5a3a22,.8),iron=M(0x2c2a33,.4,.8),stone=M(0x6a647f,.9),gold=M(0xffc233,.35,.8);
  /* porta de verdade: virada de lado, com uma coluna na frente e outra atrás do caminho; o Kuro passa por dentro do vão */
  var g=new T.Group();g.position.set(D.x,D.top,-.8);g.rotation.y=Math.PI/2;add(g);
  [-1,1].forEach(function(sd){
    var leaf=mesh(new T.BoxGeometry(2.1,7,.5),wood);leaf.position.set(sd*1.1,3.5,0);g.add(leaf);
    [1.2,3.5,5.8].forEach(function(yy){var b=mesh(new T.BoxGeometry(2.1,.22,.58),iron);b.position.set(sd*1.1,yy,0);g.add(b)});
    var rg=mesh(new T.TorusGeometry(.2,.04,6,14),gold);rg.position.set(sd*.4,3.4,.34);g.add(rg);
  });
  // moldura fixa (não sobe)
  var fr=new T.Group();fr.position.set(D.x,D.top,-.8);fr.rotation.y=Math.PI/2;add(fr);
  /* coluna da frente fica transparente quando o Kuro passa, para não esconder ele */
  var frontM=M(0x6a647f,.9,0,{transparent:true,opacity:1});
  /* só a coluna de trás (a da frente escondia o Kuro); a da frente vira um batente baixo na beira do chão */
  var p=mesh(new T.BoxGeometry(1.2,9,1.1),stone);p.position.set(2.7,4.5,0);fr.add(p);
  var fb=mesh(new T.BoxGeometry(1.2,.5,1.1),stone);fb.position.set(-2.7,.25,0);fr.add(fb);
  var lin=mesh(new T.BoxGeometry(6.6,1.6,1.1),stone);lin.position.set(0,8.2,0);fr.add(lin);
  /* paredes do castelo dos dois lados da porta, para ela parecer uma passagem */
  var wl=mesh(new T.BoxGeometry(1.4,10,1.2),stone);wl.position.set(4,5,0);fr.add(wl);
  var sk=mesh(new T.SphereGeometry(.45,10,8),M(0xece6d2,.7));sk.position.set(0,8.2,.6);fr.add(sk);
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.08,6,5),new T.MeshStandardMaterial({color:0x200000,emissive:0xff3a2a,emissiveIntensity:2.2}),false,false);e.position.set(sd*.17,8.25,1)});
  var wall={l:D.x-.6,r:D.x+.6,t:D.top+8,b:D.top-8,oneway:false,wall:true,dead:false,door:true};
  solids.push(wall);
  doorObj={x:D.x,top:D.top,g:g,wall:wall,st:0,t:0,fm:frontM};
}
function resetDoor(){if(!doorObj)return;doorObj.st=0;doorObj.t=0;doorObj.g.position.y=doorObj.top;doorObj.wall.dead=false}
function updDoor(dt){
  var d=doorObj;if(!d)return;
  if(d.st===0){
    if(state==='play'&&P.x>d.x-8){d.st=1;d.t=0;sfx.boss();shake=.45;toast('A porta do trono se abre...')}
  }else if(d.st===1){
    d.t+=dt;var u=Math.min(1,d.t/1.8),e=u*u*(3-2*u);d.g.position.y=d.top+e*7.4;
    if(((mt*30)|0)%3===0)emit(dustPool,d.x+(Math.random()-.5)*4,d.top+.3,1,1.5,.6,.5,1.2,-.3);
    if(d.t>1.4)d.wall.dead=true;
    if(u>=1)d.st=2;
  }
}
/* ---------- efeitos do castelo: tochas e relâmpago ---------- */
function updCastleFx(dt){
  var cf=castleFx;
  cf.torches.forEach(function(t,i){
    var fl=.78+Math.sin(tm*17+i*2.1)*.12+Math.sin(tm*29+i)*.08;
    t.s.material.opacity=fl;var sz=t.sz*(.9+Math.sin(tm*13+i)*.1);t.s.scale.set(sz,sz*1.3,1);
  });
  cf.next-=dt;
  if(cf.next<=0){cf.flash=1;cf.nb=1;cf.next=7+Math.random()*9;try{if(!cf.mute)noise(1.2,.035,160,'lowpass')}catch(e){}}
  if(cf.flash>0){cf.flash=Math.max(0,cf.flash-dt*2.6)}
  if(cf.bolt){if(cf.nb){cf.nb=0;var bp=[],bx=clamp(cam.x+(Math.random()-.5)*26,cf.boltX[0],cf.boltX[1]),by=22,bz=-15-Math.random()*3;var pts=[[bx,by]];
      while(by>.5){by-=1.5+Math.random()*2.2;bx+=(Math.random()-.5)*3.6;pts.push([bx,by])}
      function seg(a,b2,w){bp.push(a[0]-w,a[1],bz,a[0]+w,a[1],bz,b2[0]+w,b2[1],bz,a[0]-w,a[1],bz,b2[0]+w,b2[1],bz,b2[0]-w,b2[1],bz)}
      for(var bi=0;bi<pts.length-1;bi++){seg(pts[bi],pts[bi+1],.18);if(Math.random()<.3){var e=[pts[bi+1][0]+(Math.random()-.5)*6,pts[bi+1][1]-2-Math.random()*3];seg(pts[bi+1],e,.09)}}
      cf.bolt.geometry.dispose();cf.bolt.geometry=new T.BufferGeometry();cf.bolt.geometry.setAttribute('position',new T.Float32BufferAttribute(bp,3));cf.bolt.visible=cam.x<cf.boltX[1]+14}
    cf.bolt.material.opacity=cf.flash>.3?(cf.flash>.7||cf.flash<.5?1:.25):0}
  var f=cf.flash,fv=f>0?(f>.7?1:(f>.5?.2:(f>.3?.9:f*1.5))):0;
  hemi.intensity=curTheme.hemi[2]+fv*1.6;
  if(cf.glow)cf.glow.material.opacity=Math.min(1,fv*.9);
}

/* ---------- luta final: katana + filhotes do Rei Besouro ---------- */
var kids=[],bossShadow=null,slashArc=null,katana=null;
(function(){
  var g=new T.Group();
  var steel=new T.MeshStandardMaterial({color:0xe8eef5,roughness:.2,metalness:.9,emissive:0x4a5a7a,emissiveIntensity:.35});
  var dk=new T.MeshStandardMaterial({color:0x1c1a22,roughness:.6}),gd=new T.MeshStandardMaterial({color:0xffc233,roughness:.3,metalness:.8});
  var gr=mesh(new T.BoxGeometry(.05,.3,.05),dk,false,false);gr.position.y=-.26;g.add(gr);
  var ts=mesh(new T.CylinderGeometry(.095,.095,.02,14),gd,false,false);ts.position.y=-.43;g.add(ts);
  var bl=mesh(new T.BoxGeometry(.035,.95,.012),steel,false,false);bl.position.y=-.91;g.add(bl);
  g.visible=false;rig.elR.add(g);katana=g;
  var arc=new T.Mesh(new T.RingGeometry(.9,1.35,28,1,-1.15,2.3),new T.MeshBasicMaterial({color:0xcfeaff,transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));
  arc.visible=false;arc.renderOrder=40;scene.add(arc);slashArc=arc;
})();
function buildKids(){
  kids=[];
  for(var i=0;i<4;i++){
    var v=makeBeetle({shell:0x9a5ad0,ring:0xffd45a});v.g.scale.setScalar(.55);v.g.visible=false;add(v.g);
    kids.push({on:false,v:v,x:0,y:0,vx:0,vy:0,life:0,ph:0,dead:0,dir:1});
  }
  var sh=new T.Mesh(new T.CircleGeometry(1,24),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0,depthWrite:false}));
  sh.rotation.x=-Math.PI/2;sh.visible=false;sh.renderOrder=3;add(sh);bossShadow=sh;
}
function liveKids(){var n=0;for(var i=0;i<kids.length;i++)if(kids[i].on&&k_alive(kids[i]))n++;return n}
function k_alive(k){return k.dead<=0}
function killKid(k){if(!k.on||k.dead>0)return;k.dead=.25;sfx.stomp();emit(sparkPool,k.x,k.y+.3,10,3.5,.5,.3,.2,3);emit(dustPool,k.x,k.y+.2,4,2,.5,.5,1.2,-.3)}
function resetKids(){kids.forEach(function(k){k.on=false;k.dead=0;k.v.g.visible=false});if(bossShadow)bossShadow.visible=false}
function spawnKid(dir,i){
  for(var q=0;q<kids.length;q++){var k=kids[q];if(k.on)continue;
    k.on=true;k.dead=0;k.dir=dir;k.x=boss.x+dir*(1.4+i*.35);k.y=boss.top+1.1;k.vy=6+i*1.4;k.vx=dir*(2.4+i*.8);k.life=11;k.ph=Math.random()*6;
    k.v.g.visible=true;emit(dustPool,k.x,k.y,5,2,.5,.5,1.2,-.3);return}
}
function updKids(dt){
  if(!boss||!kids.length)return;
  for(var i=0;i<kids.length;i++){
    var k=kids[i];if(!k.on)continue;
    if(k.dead>0){k.dead-=dt;if(k.dead<=0){k.on=false;k.v.g.visible=false}continue}
    k.life-=dt;if(k.life<=0||boss.state==='dead'){killKid(k);continue}
    k.vy-=26*dt;k.y+=k.vy*dt;
    var gr=false;if(k.y<=boss.top){k.y=boss.top;k.vy=0;gr=true}
    if(gr){var sp=hd(2.6,3.2);k.dir=P.x>k.x?1:-1;k.vx+=(k.dir*sp-k.vx)*Math.min(1,dt*6)}
    k.x=clamp(k.x+k.vx*dt,boss.aL+.5,boss.aR-.5);
    if(state==='play'&&Math.abs(P.x-k.x)<P.w/2+.36&&P.y<k.y+.55&&P.y+P.h>k.y){
      if(P.vy<-1&&P.y>k.y+.25){killKid(k);P.vy=9;P.grounded=false;P.onPlat=null}
      else hurt(k.x);
    }
  }
}
function bossHit(how){
  if(boss&&boss.mine){mnBossHit(how);return}
  var b=boss;if(!b||b.state==='dead'||b.state==='wait')return;
  if(how==='heavy'&&b.state==='hurt'&&!b.hvy&&b.hp>1){b.hvy=true;b.hp--;setBossBar();bossHurtFx('heavy');sfx.crunch();shake=.6;toast('Golpe carregado! Dano dobrado');return}
  if(b.state!=='stun'&&how==='heavy'&&b.state!=='hurt'&&!(b.state==='dive')){b.state='stun';b.t=1.6;b.vx=0;sfx.boom();shake=.5;emit(sparkPool,b.x,b.top+b.h*.8,22,5,.6,.4,.3,2);toast('Golpe carregado! A guarda dele quebrou');return}
  if(b.state!=='stun'){
    if(how==='pogo'){P.vy=11;P.grounded=false;P.onPlat=null}
    sfx.check();emit(sparkPool,b.x+(P.x<b.x?-1:1)*b.w*.8,b.top+1,8,3.5,.4,.3,.2,2);
    if(!b.warned){b.warned=true;toast('Ele está de guarda! Ataque quando ficar tonto')}
    return;
  }
  b.hp--;if(how==='heavy'&&b.hp>1)b.hp--;setBossBar();sfx.stomp();sfx.crunch();shake=.4;emit(sparkPool,b.x,b.top+b.h,14,4,.6,.4,.3,5);
  bossHurtFx(how);
  if(how==='stomp'||how==='pogo'){P.vy=13;P.grounded=false;P.onPlat=null}
  if(b.hp<=0){b.state='dead';b.deadT=0;sfx.win();emit(sparkPool,b.x,b.top+1,40,7,1.2,.6,.5,4);$('bossBar').hidden=true;kids.forEach(function(k){killKid(k)})}
  else{b.state='hurt';b.t=1.3;b.hvy=how==='heavy';toast(b.hp===1?'Falta só um golpe!':(b.v2&&(b.hp===4||b.hp===2)?(b.hp===4?'A armadura quebrou! Ele ficou furioso: cuidado com as ondas de choque':'Ele abriu as asas! O santuário está desmoronando'):'Mais '+b.hp+' golpes!'))}
}
var plateM=null;
function spawnPieces(x,y,n,mat,sc0){
  if(!debrisG)debrisG=new T.BoxGeometry(.24,.17,.24);
  for(var i=0;i<n;i++){
    var m=mesh(debrisG,mat,true,false),sc=sc0*(.7+Math.random()*.7);
    m.scale.set(sc,sc,sc);m.position.set(x+(Math.random()-.5)*.8,y+(Math.random()-.5)*.5,(Math.random()-.5)*.4);add(m);
    var sd=i%2?1:-1;
    debris.push({m:m,x:m.position.x,y:m.position.y,z:m.position.z,vx:sd*(1+Math.random()*3.4),vy:5+Math.random()*5,rx:(Math.random()-.5)*14,rz:(Math.random()-.5)*14,t:0,rest:false,sc:sc});
  }
}
var SHELLC=[0x7a3fb0,0x6c3699,0x5a2c80,0x4a2466];
function bossHurtFx(how){
  var b=boss,v=b.vis,st=Math.max(0,Math.min(3,b.max-b.hp)),away=P.x<b.x?1:-1;
  hitStop=how==='pogo'?.06:.09;b.flash=.16;b.recoil=.28;b.rdir=away;
  /* sangue vermelho, esguicha para longe do Kuro */
  emit(bloodPool,b.x+(-away)*b.w*.5,b.top+b.h*.8,b.hp<=0?30:14,5.5,.9,.36,0,16);
  if(!plateM)plateM=new T.MeshStandardMaterial({color:0x7a3fb0,roughness:.4,metalness:.3});
  /* o dano aparece no corpo */
  if(b.v2)bossV2Hurt(b);
  for(var i=0;i<3;i++)b.cracks[i].forEach(function(m){m.visible=(b.max-b.hp)>=(b.v2?(i+1)*2:i+1)||b.hp<=0});
  v.shellM.color.setHex(SHELLC[st]);
  if(st>=2&&b.hp>0)spawnPieces(b.x,b.top+b.h*.9,4,plateM,2.1);
  if(st>=3&&b.hp>0&&b.crown.visible){b.crown.visible=false;spawnPieces(b.x,b.top+b.h+.4,6,b.goldM,1.4)}
  if(b.hp<=0){plateM.color.setHex(0x7a3fb0);spawnPieces(b.x,b.top+b.h*.8,10,plateM,2.2);if(b.crown.visible){b.crown.visible=false;spawnPieces(b.x,b.top+b.h+.4,6,b.goldM,1.4)}}
}
function enterArena(){
  P.arena=true;if(P.mount)dismountFox('off');
  if(P.cape)setCape(false);
  if(P.fire)setFire(false);
  P.shield=false;P.feather=0;P.big=false;
  setAct();toast(LV.boss&&LV.boss.v2?'Revanche! Katana: toque para cortar, segure e solte para o golpe forte. Cima + Katana: corte para cima. Shuriken: atire de longe':'Sala do Rei Besouro! Sem poderes. Só a katana!');P.starCd=0;
}
var ATK={rise:{d:.42,h:.12,r:1.8},heavy:{d:.55,h:.2,r:3.3},c1:{d:.30,h:.18,r:2.0},c2:{d:.30,h:.18,r:2.1},c3:{d:.44,h:.24,r:2.5},thrust:{d:.32,h:.18,r:2.7},low:{d:.34,h:.18,r:2.2},air:{d:.32,h:.18,r:2.0},pogo:{d:.8,h:0,r:0}};/* golpe acerta mais cedo: resposta imediata ao botão */
var ATKI=['c1','c2','c3','thrust','low','air','pogo','rise','heavy'];
sfx.cut=function(k){var f=[2200,1500,900,2800,1100,1900,700][k]||1800;noise(.16+k*.02,.08,f,'bandpass');beep(f/6,.12,'triangle',.03,300)};
var slashArc2=null;
(function(){
  slashArc2=new T.Mesh(new T.RingGeometry(.9,1.35,28,1,-1.15,2.3),new T.MeshBasicMaterial({color:0xcfeaff,transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));
  slashArc2.visible=false;slashArc2.renderOrder=40;scene.add(slashArc2);
})();
function slash(){
  if(!P.arena||state!=='play'||P.climb||P.warp||P.growT>0||P.stun>0)return;
  if(P.slashT>0&&P.slashT>(P.atkDur||0)*.4){P.slashQ=.25;return}
  var f=P.face,dn=keys.down||keys.jy<-.55,t,ax=keys.jx!==0?keys.jx:((keys.right?1:0)-(keys.left?1:0));
  var upk=keys.up||keys.jy>.55;
  if(P.grounded&&upk){t='rise';P.comboT=0}
  else if(!P.grounded){t=dn?'pogo':'air';P.comboT=0}
  else if(P.crouch||dn){t='low';P.comboT=0}
  else{
    var n=P.comboT>0?((P.comboN||0)+1)%3:0;
    if(n===0&&ax*f>.5)t='thrust';else t=['c1','c2','c3'][n];
    P.comboN=t==='thrust'?0:n;
  }
  var A=ATK[t];P.atk=t;P.atkDur=A.d;P.slashT=A.d;P.slashHit=false;P.slashQ=0;P.comboT=A.d+.45;
  sfx.cut(ATKI.indexOf(t));
  if(P.grounded){
    if(t==='thrust')P.vx=f*10.5;else if(t==='c3')P.vx=f*7;else if(t==='low')P.vx*=.3;else P.vx*=.5;
  }
  if(t==='pogo'){P.vy=Math.min(P.vy,-9)}
  if(t==='rise'){P.vy=13.5;P.noCut=.6;P.grounded=false;P.onPlat=null;P.vx*=.4;emit(dustPool,P.x,P.y+.1,8,2.4,.5,.5,1.2,-.3)}/* corte para cima: o Kuro sobe junto */
}
function atkHit(x0,x1,y0,y1,how){
  var any=false,i;
  for(i=0;i<kids.length;i++){var k=kids[i];if(k.on&&k.dead<=0&&k.x>x0-.2&&k.x<x1+.2&&k.y<y1&&k.y+.5>y0){killKid(k);any=true}}
  var b=boss;
  if(b&&b.state!=='wait'&&b.state!=='dead'&&b.x+b.w>x0&&b.x-b.w<x1&&b.top<y1&&b.top+b.h>y0&&!(b.state==='jump'&&(b.yy||0)>.3)){bossHit(how);any=true}
  return any;
}
function updSlash(dt){
  if(katana)katana.visible=(!!P.arena||!!(sumEnd&&sumEnd.kat)||!!(opn&&opn.kat))&&state!=='menu';
  if(P.stun>0&&P.slashT>0)P.slashT=0;
  if(P.comboT>0&&!(P.slashT>0))P.comboT-=dt;
  if(P.slashQ>0){P.slashQ-=dt;if(!(P.slashT>0)||P.slashT<=(P.atkDur||0)*.4){P.slashQ=0;slash()}}
  var A1=slashArc,A2=slashArc2;
  if(!(P.slashT>0)){if(A1)A1.visible=false;if(A2)A2.visible=false;return}
  var A=ATK[P.atk];P.slashT-=dt;var u=1-P.slashT/A.d,f=P.face;
  var al=u>.04&&u<.9?Math.sin((u-.04)/.86*Math.PI):0,px=P.x+f*.45,py=P.y+P.h*.55,sx=1,sy=1,rz=0,two=false;
  switch(P.atk){
    case 'c1':sx=1.1;sy=1.1;rz=.5;break;
    case 'c2':sx=1.1;sy=-1.1;rz=-.5;break;
    case 'c3':sx=1.5;sy=1.5;px=P.x+f*.2;two=true;break;
    case 'thrust':sx=1.7;sy=.3;break;
    case 'low':sx=1.25;sy=.35;py=P.y+.3;break;
    case 'air':sx=1.15;sy=1.15;rz=-.45;break;
    case 'pogo':al=.7;px=P.x;py=P.y-.1;sx=.9;sy=.9;break;
    case 'rise':sx=1.2;sy=1.4;rz=Math.PI/2*.9;py=P.y+P.h*.9;break;
    case 'heavy':sx=2.1;sy=2.1;px=P.x;two=true;break;
  }
  if(A1){
    A1.visible=al>.02;A1.material.opacity=al*.6;A1.position.set(px,py,.3);
    if(P.atk==='pogo'){A1.scale.set(sx,sy,1);A1.rotation.z=-Math.PI/2}
    else{A1.scale.set(f*sx*(1+u*.3),sy*(1+u*.3),1);A1.rotation.z=rz*f}
  }
  if(A2){
    A2.visible=two&&al>.02;
    if(two){A2.material.opacity=al*.6;A2.position.set(px,py,.3);A2.scale.set(-f*sx,sy,1);A2.rotation.z=0}
  }
  if(P.atk==='pogo'){
    if(P.grounded){P.slashT=0;emit(dustPool,P.x,P.y+.1,6,2.5,.5,.5,1.2,-.3);return}
    if(atkHit(P.x-.9,P.x+.9,P.y-1.7,P.y+.2,'pogo')){P.vy=12.5;P.grounded=false;P.onPlat=null;P.slashT=0;sfx.stomp()}
    return;
  }
  if(!P.slashHit&&u>=A.h){
    P.slashHit=true;
    var xa=P.atk==='c3'?P.x-f*1.1:P.x-f*.2,xb=P.x+f*A.r,x0=Math.min(xa,xb),x1=Math.max(xa,xb);
    var y0=P.atk==='low'?P.y-.1:(P.atk==='air'?P.y-.6:P.y-.2),y1=P.atk==='low'?P.y+.7:(P.atk==='rise'?P.y+P.h+2.6:P.y+P.h+.35);
    if(P.atk==='heavy'){x0=P.x-A.r;x1=P.x+A.r;y1=P.y+P.h+1}
    var hit=atkHit(x0,x1,y0,y1,P.atk==='heavy'?'heavy':'katana');if(hit&&(P.atk==='c3'||P.atk==='heavy'))shake=Math.max(shake,P.atk==='heavy'?.6:.35);if(hit){emit(sparkPool,P.x+f*1.3,P.y+P.h*.6,10,4,.4,.3,.2,1);hitStop=Math.max(hitStop||0,.05)}
  }
}
function updBoss(dt){
  var b=boss;if(!b)return;
  if(b.mine){mnBossUpd(dt);return}
  if(b.state==='wait'){
    if(P.x>b.trig){
      b.state='idle';b.t=1.4;b.n=0;b.yy=0;b.wallL.dead=false;b.wallL.mesh.visible=true;enterArena();
      $('bossBar').hidden=false;setBossBar();toast('O Rei Besouro apareceu!');shake=.5;sfx.boss();
      emit(dustPool,b.aL,b.top+1,10,3,.7,.9,1.3,-.2);
    }
    return;
  }
  if(b.state==='dead'){
    b.deadT+=dt;
    if(!b.core&&b.deadT>1.1){b.core=true;b.vis.g.visible=false;if(b.v2){bossV2Open(b)}else items.push(mkItem('core',b.x,b.top+1.6));emit(sparkPool,b.x,b.top+1.6,30,6,1.4,.6,.5,2)}
    return;
  }
  if(b.state==='idle'){
    b.dir=P.x>b.x?1:-1;b.t-=dt;
    if(b.t<=0){
      var seq=b.v2?bossV2Seq(b):['spit','charge','jump','spit','jump','charge'],mv=seq[(b.n||0)%seq.length];b.n=(b.n||0)+1;
      if(mv==='spit'&&liveKids()>=3)mv='jump';
      if(mv==='charge'){b.state='charge';b.vx=b.dir*Math.min(10.4,6.5+(b.max-b.hp)*2.2);sfx.boss()}
      else if(mv==='jump'){b.state='jump';b.jt=-.4;b.jset=false;b.jd=1.15-(b.max-b.hp)*.08;b.quake=false;sfx.boss()}
      else if(mv==='quake'){b.state='jump';b.jt=-.5;b.jset=false;b.jd=1.25;b.quake=true;sfx.boss()}
      else if(mv==='dive'){b.state='dive';b.dt=0;sfx.boss();toast('Ele levantou voo! Fique de olho na sombra')}
      else{b.state='spit';b.t=1.0;b.spat=false;sfx.boss()}
    }
  }else if(b.state==='charge'){
    b.x+=b.vx*dt;
    var lo=b.aL+b.w+.3,hi=b.aR-b.w-.3;
    if(b.x<=lo||b.x>=hi){
      b.x=clamp(b.x,lo,hi);b.state='stun';b.t=3;b.vx=0;shake=.5;sfx.boom();
      emit(dustPool,b.x+b.dir*b.w,b.top+.8,10,3,.7,.9,1.3,-.2);
    }
  }else if(b.state==='stun'){
    b.t-=dt;if(b.t<=0){b.state='idle';b.t=.9}
  }else if(b.state==='hurt'){
    b.t-=dt;if(b.t<=0){b.state='idle';b.t=.8}
  }else if(b.state==='spit'){
    b.dir=P.x>b.x?1:-1;b.t-=dt;
    if(!b.spat&&b.t<=.45){b.spat=true;sfx.boom();if(!b.toldKids){b.toldKids=true;toast('O Rei Besouro chamou os filhotes!')}var nk=(b.hp<=2)?3:2;for(var q=0;q<nk;q++)spawnKid(b.dir,q)}
    if(b.t<=0){b.state='idle';b.t=.9}
  }else if(b.state==='jump'){
    b.jt+=dt;
    if(b.jt>=0&&!b.jset){b.jset=true;b.jx0=b.x;b.jx1=clamp(P.x+P.vx*.25,b.aL+b.w+.3,b.aR-b.w-.3);b.dir=b.jx1>b.x?1:-1}
    if(b.jt>=0){
      var ju=Math.min(1,b.jt/b.jd);b.x=b.jx0+(b.jx1-b.jx0)*ju;b.yy=(b.quake?6.2:4.4)*4*ju*(1-ju);
      if(ju>=1){
        b.x=b.jx1;b.yy=0;b.state='stun';b.t=2.4;shake=.7;sfx.boom();
        emit(dustPool,b.x,b.top+.4,16,4,.8,.9,1.3,-.2);
        if(state==='play'&&Math.abs(P.x-b.x)<b.w+1.3&&P.y<b.top+.9)hurt(b.x);
        if(b.quake){b.quake=false;bossWaves(b,9);shake=.9}
      }
    }
  }
  if(b.state==='dive')bossDive(b,dt);
  if(b.v2)bossV2Upd(b,dt);
  var bAir=(b.state==='jump'&&b.jt>=0)||(b.state==='dive'&&(b.yy||0)>.6);
  if(!bAir&&state==='play'&&Math.abs(P.x-b.x)<P.w/2+b.w&&P.y<b.top+b.h&&P.y+P.h>b.top){
    if(P.vy<=.5&&P.y>b.top+b.h*.55){
      if(b.state==='stun')bossHit('stomp');
      else{P.vy=11;P.grounded=false;P.onPlat=null;sfx.stomp()}
    }else if(b.state==='charge'||b.state==='idle'||b.state==='spit'||(b.state==='jump'&&b.jt<0)||b.state==='dive'){hurt(b.x)}
  }
}
/* ---------- golpe carregado (segurar Katana e soltar) e shurikens ---------- */
var CHG_T=.55,pStars=[];
function heavyRelease(){
  if(!P.arena||state!=='play')return;var ok=(P.chg||0)>=CHG_T;P.chg=0;if(!ok)return;
  P.slashT=0;var A=ATK.heavy;P.atk='heavy';P.atkDur=A.d;P.slashT=A.d;P.slashHit=false;P.slashQ=0;P.comboT=0;
  sfx.cut(8);try{beep(140,.3,'sawtooth',.06,-60);noise(.3,.08,900,'bandpass')}catch(e){}
  if(P.grounded)P.vx=P.face*6;emit(sparkPool,P.x,P.y+P.h*.6,16,5,.5,.35,.2,1);
}
function updCharge(dt){
  if(!P.arena||!P.chgOn)return;var held=P.chg||0;P.chg=held+dt;
  if(P.chg>=CHG_T&&held<CHG_T){try{beep(880,.12,'triangle',.05,440);beep(1320,.15,'sine',.04,0,.06)}catch(e){}}
  if(P.chg>.18&&Math.random()<dt*(P.chg>=CHG_T?40:14)){var kp=new T.Vector3();if(katana)katana.getWorldPosition(kp);else kp.set(P.x,P.y+1,0);emit(sparkPool,kp.x+(Math.random()-.5)*.4,kp.y-.4+(Math.random()-.5)*.6,1,1,.4,P.chg>=CHG_T?.3:.2,.1,-1)}
}
function starMesh(){var m=new T.Mesh(shurikenGeo(),new T.MeshStandardMaterial({color:0xd0d8e4,metalness:.8,roughness:.25,emissive:0x3a4a6a,emissiveIntensity:.4}));m.scale.setScalar(.9);add(m);return m}
function throwStar(){
  if(!P.arena||state!=='play'||P.stun>0||(P.starCd||0)>0)return;P.starCd=.4;
  var s=null;for(var i=0;i<pStars.length;i++)if(!pStars[i].on){s=pStars[i];break}
  if(!s){s={m:starMesh()};pStars.push(s)}
  s.on=true;s.x=P.x+P.face*.5;s.y=P.y+P.h*.62;s.vx=P.face*17;s.t=0;s.m.visible=true;P.shootT=.22;
  try{noise(.12,.05,2600,'highpass');beep(1500,.06,'triangle',.03,-500)}catch(e){}
}
function updStars(dt){
  if(P.starCd>0)P.starCd-=dt;
  for(var i=0;i<pStars.length;i++){var s=pStars[i];if(!s.on)continue;s.t+=dt;s.x+=s.vx*dt;s.m.position.set(s.x,s.y,.3);s.m.rotation.z-=dt*24;
    var done=s.t>1.2||!boss||s.x<boss.aL||s.x>boss.aR;
    for(var k=0;k<kids.length&&!done;k++){var kd=kids[k];if(kd.on&&kd.dead<=0&&Math.abs(kd.x-s.x)<.5&&Math.abs(kd.y+.3-s.y)<.6){killKid(kd);done=true}}
    var b=boss;if(!done&&b&&b.state!=='wait'&&b.state!=='dead'&&Math.abs(b.x-s.x)<b.w&&s.y>b.top+(b.yy||0)-.2&&s.y<b.top+(b.yy||0)+b.h){done=true;
      if(b.state==='stun')bossHit('star');else{emit(sparkPool,s.x,s.y,8,3,.3,.25,.2,2);try{beep(2200,.05,'square',.02)}catch(e){}}}
    if(done){s.on=false;s.m.visible=false;emit(sparkPool,s.x,s.y,4,2,.25,.2,.2,1)}}
}
