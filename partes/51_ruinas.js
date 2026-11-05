/*@@parte:51_ruinas.js*/
/* ---------- Ruínas: maré de areia, areia movediça e ventania ---------- */
var sandS={on:false,y:-99,mesh:null,warn:0},qsZones=[],windZones=[],windFxL=[],qsMeshes=[];
function sandReset(){
  P.sink=0;
  if(LV&&LV.sand){var S0=LV.sand;sandS.on=false;sandS.y=Math.max(S0.y0,Math.min(sandS.y,(respawn.y||0)-6));
    if(respawn.x>S0.x0)sandS.on=true;
    else sandS.y=S0.y0;
    if(sandS.mesh)sandS.mesh.position.y=sandS.y}
}
var sandSndT=0,dyn=null,fadeIn=0;
function sandTex(){
  /* areia de duna: ondulações suaves (lado claro comprido, lado escuro curto), grão fino e tom terroso; costura sem emenda */
  var N=512,c=document.createElement('canvas');c.width=c.height=N;var x=c.getContext('2d'),im=x.createImageData(N,N),d=im.data,r=rnd(919);
  var RIP=16,T2=6.2832,ph1=r()*T2,ph2=r()*T2,ph3=r()*T2;
  var dark=[150,98,60],mid=[180,126,80],lite=[208,158,108];
  for(var py=0;py<N;py++)for(var px=0;px<N;px++){
    var u=px/N,v=py/N;
    var w=.5*Math.sin(u*T2*2+ph1)+.22*Math.sin(u*T2*3+v*T2*1+ph2)+.06*Math.sin(u*T2*7-v*T2*2+ph3);
    var f=(v*RIP+w*.9)%1;if(f<0)f+=1;
    var sh=f<.78?f/.78:(1-f)/.22;/* rampa comprida e queda curta */
    sh=sh*sh*(3-2*sh);
    var big=.5+.5*Math.sin(u*T2+v*T2*2+ph2)*.6;/* manchas grandes suaves */
    var g=(r()-.5)*16;
    var k=sh*.85+big*.15,cc=k<.5?[dark,mid,k*2]:[mid,lite,(k-.5)*2],t=cc[2];
    var i=(py*N+px)*4;
    d[i]=cc[0][0]+(cc[1][0]-cc[0][0])*t+g;d[i+1]=cc[0][1]+(cc[1][1]-cc[0][1])*t+g*.8;d[i+2]=cc[0][2]+(cc[1][2]-cc[0][2])*t+g*.6;d[i+3]=255;
  }
  x.putImageData(im,0,0);
  for(var j=0;j<260;j++){x.fillStyle='rgba(255,236,200,'+(.15+r()*.3).toFixed(2)+')';x.fillRect(r()*N,r()*N,1,1)}/* brilhinho de grão */
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;
}
/* areia movediça: areia úmida em torrões pequenos, com poças escuras e um leve brilho molhado */
var qsTexC=null,qsTexL=[];
function qsTex(){
  if(qsTexC)return qsTexC;
  var N=256,c=document.createElement('canvas');c.width=c.height=N;var x=c.getContext('2d'),r=rnd(3131),i;
  x.fillStyle='#6a4e30';x.fillRect(0,0,N,N);
  function wrap(fn){for(var ox=-N;ox<=N;ox+=N)for(var oy=-N;oy<=N;oy+=N)fn(ox,oy)}
  for(i=0;i<26;i++){var px=r()*N,py=r()*N,rr=18+r()*40;wrap(function(ox,oy){var g=x.createRadialGradient(px+ox,py+oy,0,px+ox,py+oy,rr);g.addColorStop(0,'rgba(58,40,22,.45)');g.addColorStop(1,'rgba(58,40,22,0)');x.fillStyle=g;x.fillRect(px+ox-rr,py+oy-rr,rr*2,rr*2)})}
  for(i=0;i<620;i++){
    var bx=r()*N,by=r()*N,br=4+r()*7,l=104+r()*56|0;
    wrap(function(ox,oy){if(bx+ox<-8||bx+ox>N+8||by+oy<-8||by+oy>N+8)return;
      var cx=bx+ox,cy=by+oy;
      x.fillStyle='rgba(40,28,14,.35)';x.beginPath();x.ellipse(cx+1.2,cy+1.4,br,br*.8,0,0,6.283);x.fill();/* sombra do torrão */
      var g=x.createRadialGradient(cx-br*.35,cy-br*.4,0,cx,cy,br);g.addColorStop(0,'rgb('+(l+46)+','+(l+30)+','+(l+4)+')');g.addColorStop(1,'rgb('+(l-14)+','+(l-34)+','+(l-58)+')');
      x.fillStyle=g;x.beginPath();x.ellipse(cx,cy,br,br*.8,0,0,6.283);x.fill()})}
  for(i=0;i<900;i++){x.fillStyle='rgba(30,20,10,'+(.2+r()*.3).toFixed(2)+')';x.fillRect(r()*N,r()*N,1,1)}
  qsTexC=new T.CanvasTexture(c);qsTexC.encoding=T.sRGBEncoding;qsTexC.wrapS=qsTexC.wrapT=T.RepeatWrapping;qsTexC.anisotropy=4;return qsTexC;
}
function sandWaveF(x,t,amp){return amp*(.16*Math.sin(x*1.3+t*1.7)+.1*Math.sin(x*2.9-t*2.4)+.05*Math.sin(x*6.1+t*3.3))}
function updSandWave(){
  var q=sandS.parts;if(!q||!sandS.mesh)return;
  if(Math.abs(sandS.y-cam.y)>16){return}
  var S0=LV.sand,amp=1,gap=P.y-sandS.y,warn=sandS.on&&P.x>S0.x0&&P.x<S0.x1&&gap<4&&gap>-1;
  if(warn)amp=1.5+Math.sin(tm*22)*.2;
  var cx=sandS.mesh.position.x,nx=q.nx,SW=q.SW,fp=q.front.geometry.attributes.position,tp=q.top.geometry.attributes.position,i,wx;
  for(i=0;i<=nx;i++){wx=cx-SW/2+SW*i/nx;fp.setY(i,sandWaveF(wx,tm,amp))}
  fp.needsUpdate=true;
  for(i=0;i<tp.count;i++){wx=cx+tp.getX(i);tp.setY(i,sandWaveF(wx,tm,amp))}
  tp.needsUpdate=true;
  var pu=warn?.35+Math.sin(tm*18)*.25:0;
  q.topM.emissiveIntensity=.2+pu;q.bodyM.emissiveIntensity=.22+pu*.6;
}
/* ---- animação de morte do Kuro ---- */
var shards=null;
function buildShards(){
  if(shards)return;
  shards=[];
  var skin=M(0xefb48a,.55),cloth=M(0x383849,.85),clothL=M(0x4b4b64,.8),clothD=M(0x2b2b3a,.9),slate=M(0x5d6888,.7),sole=M(0x15151b,.8),metal=M(0xbac4d4,.3,.85);
  function mk(g,rad,rel){g.visible=false;scene.add(g);shards.push({m:g,rad:rad,rel:rel,x:0,y:0,vx:0,vy:0,wx:0,wy:0,wz:0,rest:false})}
  var h=new T.Group();h.add(mesh(new T.SphereGeometry(.25,18,14),clothL));var w=mesh(new T.SphereGeometry(.24,14,10),skin);w.scale.set(.95,.5,.6);w.position.set(0,.03,.14);h.add(w);mk(h,.24,1.3);
  var t=mesh(new T.CapsuleGeometry(.2,.2,6,12),cloth);t.scale.z=.86;mk(t,.3,.9);
  for(var i=0;i<2;i++){mk(mesh(new T.CapsuleGeometry(.065,.3,5,10),cloth),.1,.95)}
  for(i=0;i<2;i++){mk(mesh(new T.CapsuleGeometry(.085,.3,5,10),clothD),.12,.45)}
  for(i=0;i<2;i++){mk(mesh(new T.BoxGeometry(.18,.09,.28),sole),.06,.08)}
  var k=mesh(new T.CylinderGeometry(.03,.03,.78,8),slate);k.rotation.z=Math.PI/2;var kg=new T.Group();kg.add(k);mk(kg,.05,.9);
  var bd=mesh(new T.TorusGeometry(.2,.04,8,22),slate);bd.rotation.x=Math.PI/2;var bg=new T.Group();bg.add(bd);mk(bg,.06,1.4);
}
function floorBelow(x,y){var f=-99;for(var i=0;i<solids.length;i++){var s=solids[i];if(s.dead||s.hid||s.wall||s.pipe)continue;if(x>s.l&&x<s.r&&s.t<=y&&s.t>f)f=s.t}return f}
function burstShards(d){
  var sc=P.big?1:.78,away=-d.face,by=d.nf?Math.max(d.y,cam.y-3.2):d.y;
  shards.forEach(function(p,i){
    p.rest=false;p.m.visible=true;
    p.x=d.x+(Math.random()-.5)*.3;p.y=by+p.rel*sc;
    p.vx=away*(.5+Math.random()*3.5)+(Math.random()-.5)*6;
    p.vy=(p.rel>.6?3.5:2)+Math.random()*7;
    p.wx=(Math.random()-.5)*16;p.wy=(Math.random()-.5)*10;p.wz=(Math.random()-.5)*20;
    p.z=(Math.random()-.5)*.5;p.m.scale.setScalar(sc*1.45);p.m.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);
    p.m.position.set(p.x,p.y,p.z);
  });
  emit(dustPool,d.x,by+.7,14,3.2,.7,.7,1.3,-.2);emit(sparkPool,d.x,by+.8,16,5.5,.7,.4,.3,2);
  sfx.brick();shake=Math.max(shake,.35);
}
function updShards(dt,t){
  var snd=false;
  for(var i=0;i<shards.length;i++){
    var p=shards[i];if(p.rest)continue;
    p.vy-=32*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
    p.m.rotation.x+=p.wx*dt;p.m.rotation.y+=p.wy*dt;p.m.rotation.z+=p.wz*dt;
    var fl=floorBelow(p.x,p.y+p.rad+.35);
    if(fl>-50&&p.y<fl+p.rad){
      p.y=fl+p.rad;
      if(p.vy<-2){p.vy=-p.vy*.36;p.vx*=.72;p.wx*=.5;p.wy*=.5;p.wz*=.5;snd=true}
      else{p.vy=0;var f=Math.exp(-dt*9);p.vx*=f;p.wx*=f;p.wy*=f;p.wz*=f;if(Math.abs(p.vx)<.15&&Math.abs(p.wz)<.6){p.rest=true;p.vx=0}}
    }
    p.m.position.set(p.x,p.y,p.z);
  }
  if(snd&&Math.random()<.5)sfx.bump();
}
function startDeath(kind,after,msg){
  if(dyn||state!=='play')return;
  if(kind!=='sand')kind='shatter';
  var sy=(kind==='sand'&&sandS.on&&sandS.mesh)?sandS.y:P.y;
  dyn={kind:kind,t:0,x:P.x,y:P.y,face:P.face,sy:sy,after:after,poof:false,star:0,
       dur:kind==='fall'?1.0:(kind==='sand'?1.15:(kind==='shatter'?1.75:1.2)),qs:!!P.sink,burst:false};
  state='dying';P.vx=0;P.vy=0;P.climb=null;P.warp=null;
  if(kind==='sand')P.cheer=1;
  if(kind==='shatter'){buildShards();dyn.nf=floorBelow(P.x,P.y+.6)<-50;if(dyn.nf)dyn.dur=1.35}
  shake=Math.max(shake,kind==='fall'?0:.2);
}
function finishDeath(){
  if(!dyn)return;var a=dyn.after;dyn=null;
  rig.root.rotation.z=0;rig.root.rotation.x=0;rig.root.visible=true;
  P.cheer=0;P.sink=0;
  if(shards)shards.forEach(function(q){q.m.visible=false});
  if(rig.eyes)rig.eyes.forEach(function(e){e.scale.set(1,1,1)});
  state='play';fadeIn=.45;$('fade').style.opacity=1;
  if(a)a();
}
function updDeath(dt){
  var d=dyn,R=rig.root;d.t+=dt;var t=d.t,tt,k;
  if(d.kind==='sand'){
    P.cheer=1;k=Math.min(1,t/.95);
    R.position.set(d.x+Math.sin(t*42)*.05*(1-k),d.y-(d.qs?.8:0)-1.5*k*k,0);
    R.rotation.z=Math.sin(t*14)*.14*(1-k);
    if(t<.9&&Math.random()<dt*40)emit(dustPool,d.x+(Math.random()-.5)*.7,d.sy+.05,1,1.6,.6,.45,1.1,-.3);
    if(!d.poof&&t>.7){d.poof=true;emit(dustPool,d.x,d.sy+.1,10,2.4,.8,.6,1.2,-.4);sfx.shrink()}
    if(t>.8)R.visible=false;
  }else if(d.kind==='shatter'){
    var h2=d.nf?0:.14;
    if(t<h2){R.position.set(d.x,d.y,0);R.rotation.z=Math.sin(t*110)*.07}
    else{
      if(!d.burst){d.burst=true;burstShards(d)}
      R.visible=false;
      updShards(dt,t);
    }
  }else{
    var h=.14;
    if(t<h){R.position.set(d.x,d.y,0);R.rotation.z=Math.sin(t*90)*.06}
    else{
      tt=t-h;
      if(d.kind==='fall'){R.position.set(d.x+d.face*-.6*tt,d.y+3.2*tt-24*tt*tt,0);R.rotation.z=-d.face*tt*10}
      else{
        var up=9.2;R.position.set(d.x-d.face*1.3*tt,d.y+up*tt-11*tt*tt,0);R.rotation.z=-d.face*tt*8;R.rotation.y+=tt*5;
        if(rig.eyes)rig.eyes.forEach(function(e){e.scale.set(1.15,.2,1)});
        d.star-=dt;if(d.star<=0&&t<.9){d.star=.08;emit(sparkPool,R.position.x+(Math.random()-.5)*.5,R.position.y+1.5,1,2,.5,.3,.2,1)}
        if(!d.poof&&tt>.8){d.poof=true;emit(dustPool,R.position.x,R.position.y+.7,12,3,.7,.7,1.3,-.3);emit(sparkPool,R.position.x,R.position.y+.8,14,5,.7,.4,.3,2);sfx.shrink()}
        if(d.poof)R.visible=false;
      }
    }
  }
  var fo=clamp((t-(d.dur-.4))/.32,0,1);$('fade').style.opacity=fo;
  if(t>=d.dur)finishDeath();
}
function buildSandSys(){
  var fl0=sandS.flames;sandS={on:false,y:-99,mesh:null,warn:0,flames:fl0};qsZones=[];windZones=[];windFxL=[];qsMeshes=[];
  var S0=LV.sand;
  if(S0){
    sandS.y=S0.y0;
    var SW=S0.x1-S0.x0,grp=new T.Group(),tx=sandTex(),tf=tx.clone();tx.repeat.set(SW/9,80/9);tf.repeat.set(SW/9,.27);tf.needsUpdate=true;
    var sTone=LITE?0xf2e0cc:0x9c8c80;/* o sol do deserto é forte: escurece a areia no visual completo */
    var bodyM=new T.MeshStandardMaterial({map:tx,color:sTone,roughness:.97,emissive:0x3a1e08,emissiveIntensity:.12});
    var body=new T.Mesh(new T.BoxGeometry(SW,80,3.4),bodyM);body.position.set(0,-40.35,0);grp.add(body);
    var nx=Math.max(8,Math.round(SW*2));
    var fg=new T.PlaneGeometry(SW,2.4,nx,1);fg.translate(0,-1.2,0);
    var front=new T.Mesh(fg,new T.MeshStandardMaterial({map:tf,color:sTone,roughness:.95,emissive:0x4a2a0e,emissiveIntensity:.15}));front.position.set(0,0,1.72);grp.add(front);
    var tg=new T.PlaneGeometry(SW,3.4,nx,4);tg.rotateX(-Math.PI/2);
    var tt2=tx.clone();tt2.repeat.set(SW/9,.4);tt2.needsUpdate=true;var topM=new T.MeshStandardMaterial({map:tt2,color:LITE?0xe2ccb4:0x8c7c70,roughness:1,metalness:0,emissive:0x4a2a0a,emissiveIntensity:.2,side:T.DoubleSide});
    var top=new T.Mesh(tg,topM);top.position.set(0,0,0);grp.add(top);
    grp.position.set((S0.x0+S0.x1)/2,sandS.y,-.5);add(grp);sandS.mesh=grp;
    sandS.parts={front:front,top:top,body:body,bodyM:bodyM,topM:topM,SW:SW,nx:nx,fz:0};
  }
  qsTexL=[];
  (LV.qsand||[]).forEach(function(q){
    qsZones.push({x0:q[0],x1:q[1],y:q[2]||0});
    var qw=q[1]-q[0],qt=qsTex().clone();qt.repeat.set(qw/3.6,2.6/3.6);qt.needsUpdate=true;qsTexL.push(qt);
    var m=new T.Mesh(new T.BoxGeometry(qw,.18,2.6),new T.MeshStandardMaterial({map:qt,color:LITE?0xa8988a:0x8e7e70,roughness:.55,metalness:0}));
    m.position.set((q[0]+q[1])/2,(q[2]||0)-.06,-.1);add(m);qsMeshes.push(m);
  });
  (LV.wind||[]).forEach(function(w){windZones.push({x0:w.x0,x1:w.x1,dir:w.dir,per:w.per||7,on:w.on||2.6,warn:1,ph:w.ph||0,str:w.str||4.4,act:0,wn:0})});
  if(windZones.length){
    var gm=new T.PlaneGeometry(2.2,.05),mm=new T.MeshBasicMaterial({color:curTheme.name==='summit'?0xf2f6ff:0xf3d9a0,transparent:true,opacity:0,depthWrite:false});
    for(var i=0;i<46;i++){var st=new T.Mesh(gm,mm.clone());st.userData={u:Math.random(),y:Math.random(),z:Math.random(),sp:.7+Math.random()*.7};st.visible=false;scene.add(st);windFxL.push(st)}
  }
}
function disposeSandSys(){windFxL.forEach(function(s){scene.remove(s);s.material.dispose()});windFxL=[]}
function inQSand(x,y){for(var i=0;i<qsZones.length;i++){var q=qsZones[i];if(x>q.x0+.15&&x<q.x1-.15&&Math.abs(y-q.y)<.35)return true}return false}
function updSandSys(dt){
  P.qs=false;P.wpush=0;
  for(var qi=0;qi<qsTexL.length;qi++){var qt0=qsTexL[qi];qt0.offset.x=Math.sin(tm*.35+qi)*.06;qt0.offset.y=(tm*.035)%1}/* a areia movediça escorre devagar */
  if(state!=='play'||P.warp)return;
  /* areia movediça */
  if(qsZones.length){
    P.qs=P.grounded&&inQSand(P.x,P.y);
    if(P.qs){
      P.sink=Math.min(1.2,(P.sink||0)+dt*.55);
      if(Math.random()<dt*14)emit(dustPool,P.x+(Math.random()-.5)*.6,P.y+.05,1,1.2,.45,.4,1.3,-.3);
      if(P.sink>=1){P.sink=0;fallDeath('A areia movediça engoliu o Kuro. Voltando ao checkpoint.','sand');return}
    }else P.sink=Math.max(0,(P.sink||0)-dt*2.4);
  }else if(P.sink)P.sink=Math.max(0,P.sink-dt*2.4);
  /* ventania */
  for(var i=0;i<windZones.length;i++){
    var w=windZones[i],t=(timeT+w.ph)%w.per,gs=w.per-w.on;
    w.act=t>=gs?1:0;w.wn=(!w.act&&t>=gs-w.warn)?1:0;
    if(P.x>w.x0&&P.x<w.x1&&w.act&&!(LV.windShelter&&windSheltered(w.dir)))P.wpush+=w.dir*w.str;
  }
  /* maré de areia */
  var S0=LV.sand;
  if(S0){
    if(!sandS.on&&P.x>S0.x0+1.5&&P.x<S0.x1&&P.y<S0.top)sandS.on=true;
    if(sandS.on&&P.growT<=0){
      var rate=S0.speed*(1+(S0.accel||0)*Math.max(0,sandS.y-S0.y0)/40);
      if(P.x>S0.x1||P.y>=S0.top)rate=0;
      sandS.y=Math.min(S0.cap||S0.top-1,sandS.y+rate*dt);
    }
    if(sandS.mesh)sandS.mesh.position.y=sandS.y;
    var gap=P.y-sandS.y;
    if(sandS.on&&rate>0&&P.x>S0.x0-4&&P.x<S0.x1+4&&gap<20){
      sandSndT-=dt;
      if(sandSndT<=0){var pr=clamp(1-gap/20,0,1);sandSndT=.13+Math.random()*.06;noise(.16,.006+.03*pr*pr,1500+pr*1200,'bandpass')}
    }
    if(sandS.on&&P.x>S0.x0&&P.x<S0.x1){
      if(gap<4&&gap>0){shake=Math.max(shake,.06+(4-gap)*.03)}
      if(P.y+.5<sandS.y){fallDeath('A areia engoliu o Kuro. Voltando ao checkpoint.','sand');return}
    }
  }
}
function updSandFx(dt){
  if(sandS.on&&sandS.mesh&&LV.sand&&Math.abs(sandS.y-P.y)<12){
    var S0=LV.sand,ex=clamp(P.x+(Math.random()-.5)*16,S0.x0+.5,S0.x1-.5),ey=sandS.y+sandWaveF(ex,tm,1);
    if(Math.random()<dt*50)emit(dustPool,ex,ey,1,1.3,1.0,.5,.9,-.5);
    if(Math.random()<dt*14)emit(sparkPool,ex,ey,1,2.2,.55,.22,.2,2.2);
  }
  if(sandS.flames)sandS.flames.forEach(function(q){var k=1+Math.sin(tm*13+q.ph)*.12+Math.sin(tm*29+q.ph)*.06;q.f.scale.set(.8*k,1.5*k,.8*k);q.g.material.opacity=.6+Math.sin(tm*9+q.ph)*.12});
  if(!windFxL.length)return;
  var any=0,wn=0;
  for(var i=0;i<windZones.length;i++){var w=windZones[i];if(P.x>w.x0-8&&P.x<w.x1+8){if(w.act)any=w.dir;else if(w.wn)wn=w.dir}}
  var dir=any||wn,amp=any?1:(wn?.35:0);
  for(var k=0;k<windFxL.length;k++){
    var st=windFxL[k],d=st.userData;
    if(amp<=0){st.visible=false;continue}
    d.u+=dt*(any?1.4:.5)*d.sp;if(d.u>1){d.u-=1;d.y=Math.random();d.z=Math.random()}
    st.visible=k<windFxL.length*(any?1:.35);
    st.position.set(cam.x+(dir>0?-14+28*d.u:14-28*d.u),cam.y-3+d.y*8,1.5+d.z*3);
    st.scale.x=any?1+d.sp:.6;st.material.opacity=Math.sin(d.u*Math.PI)*(any?.55:.25);
  }
}
function buildBalls(){
  balls=[];
  var hg=curTheme.name==='heights',sm=hg?M(0x8a5a2e,.8):M(0xf4f8ff,.8,.02),bm=hg?M(0x5a3818,.8):M(0xbfe2f6,.35,.2);
  (LV.balls||[]).forEach(function(b){
    var len=b.x1-b.x0,sp=b.s||5,per=b.per||3,n=Math.max(1,Math.ceil(len/(sp*per))+1);
    var e={x0:b.x0,x1:b.x1,y:b.y,sp:sp,per:per,n:n,ph:b.ph||0,t:0,list:[]};
    for(var k=0;k<n;k++){
      var g=new T.Group();
      var bd=mesh(new T.IcosahedronGeometry(.56,1),sm);g.add(bd);
      for(var q=0;q<5;q++){var bb=mesh(new T.SphereGeometry(.16,8,6),bm);var a=q*1.26;bb.position.set(Math.cos(a)*.5,Math.sin(a)*.5,.28*(q%2?1:-1));g.add(bb)}
      g.visible=false;add(g);e.list.push({g:g,on:false,u:0});
    }
    balls.push(e);
  });
}
function updBalls(dt){
  for(var i=0;i<balls.length;i++){
    var e=balls[i],mid=(e.x0+e.x1)/2,near=Math.abs(P.x-mid)<(e.x1-e.x0)/2+24;
    if(state==='play'&&near)e.t+=dt;
    var T0=e.t+e.ph*e.per,cyc=e.n*e.per;
    for(var k=0;k<e.list.length;k++){
      var q=e.list[k],u=(((T0-k*e.per)%cyc)+cyc)%cyc,x=e.x1-e.sp*u;
      if(!near||x<e.x0){if(q.on){q.on=false;q.g.visible=false;if(near)emit(dustPool,x<e.x0?e.x0:x,e.y+.3,6,2.4,.5,.6,1.2,-.2)}continue}
      if(!q.on){q.on=true;emit(dustPool,x,e.y+.4,6,2.4,.5,.6,1.2,-.2)}
      var sc=Math.min(1,.3+u*e.sp/1.4);
      q.g.visible=true;q.g.scale.setScalar(sc);q.g.position.set(x,e.y+.56*sc,0);q.g.rotation.z=u*e.sp/.56;
      q.x=x;
      if(state==='play'&&sc>.9&&Math.abs(P.x-x)<P.w/2+.46&&P.y<e.y+1.05&&P.y+P.h>e.y+.05)hurt(x);
    }
  }
}
function dropFloor(d){
  var f=-30;
  for(var i=0;i<solids.length;i++){var q=solids[i];if(q.dead||q.hid||(q.flt&&!LV.dropFlt))continue;if(d.x>=q.l&&d.x<=q.r&&q.t<=d.y0-.8&&q.t>f)f=q.t}
  return f;
}
function crystalBurst(x,y){
  if(!eGeo)eGeo={s:new T.SphereGeometry(.13,10,8),b:new T.BoxGeometry(.22,.15,.22),l:new T.BoxGeometry(.05,.05,.28)};
  if(!eGeo.c)eGeo.c=new T.OctahedronGeometry(.14,0);
  for(var i=0;i<9;i++){
    var m=mesh(eGeo.c,crysM,true,false),sc=.8+Math.random()*1.1;
    m.scale.set(sc,sc*1.4,sc);m.position.set(x+(Math.random()-.5)*.5,y+(Math.random()-.5)*.3,(Math.random()-.5)*.3);add(m);
    var sd=i%2?1:-1;
    debris.push({m:m,x:m.position.x,y:m.position.y,z:m.position.z,vx:sd*(.8+Math.random()*3.4),vy:3+Math.random()*5,rx:(Math.random()-.5)*16,rz:(Math.random()-.5)*16,t:0,rest:false,sc:sc});
  }
  emit(sparkPool,x,y,14,3.6,.6,.35,.2,2);emit(dustPool,x,y,8,2.4,.5,.5,1.2,-.2);
}
function updChain(d){
  var bot=d.y+.7,len=Math.max(.2,d.top-bot);
  d.chain.scale.set(1,len,1);d.chain.position.set(d.x,(d.top+bot)/2,-.1);
}
function updDrops(dt){
  for(var i=0;i<drops.length;i++){
    var d=drops[i];
    if(d.castle){
      if(d.cd>0)d.cd-=dt;
      if(d.st===0){
        if(d.cd<=0&&Math.abs(P.x-d.x)<2.4&&P.y<d.y0-1&&P.y>d.y0-9&&state==='play'){d.st=1;d.t=.6;d.floor=dropFloor(d);d.eo.visible=true;d.ec.visible=false;sfx.bump()}
      }else if(d.st===1){
        d.t-=dt;d.g.position.x=d.x+Math.sin(mt*70)*.05;
        if(((mt*30)|0)%4===0)emit(dustPool,d.x,d.y0-.4,1,1,.3,.3,1.2,-.4);
        if(d.t<=0){d.st=2;d.vy=0;d.g.position.x=d.x}
      }else if(d.st===2){
        d.vy-=34*dt;d.y+=d.vy*dt;
        var land=d.floor+.82;
        if(d.y<=land){
          d.y=land;d.st=3;d.t=.9;
          if(d.floor>-20){emit(dustPool,d.x,d.floor+.2,14,3.2,.7,.8,1.3,-.2);emit(sparkPool,d.x,d.floor+.3,10,3.2,.5,.3,.2,2);sfx.boom();shake=Math.max(shake,.3)}
        }
        d.g.position.y=d.y;updChain(d);
        if(Math.abs(P.x-d.x)<P.w/2+.4&&P.y<d.y+.9&&P.y+P.h>d.y-.85)hurt(d.x,1);
      }else if(d.st===3){
        d.t-=dt;if(d.t<=0){d.st=4;d.eo.visible=false;d.ec.visible=true}
      }else if(d.st===4){
        d.y+=2.3*dt;
        if(d.y>=d.y0){d.y=d.y0;d.st=0;d.cd=.7}
        d.g.position.y=d.y;updChain(d);
      }
      continue;
    }
    if(d.st===0){
      if(Math.abs(P.x-d.x)<2.3&&P.y<d.y0-1&&P.y>d.y0-9){d.st=1;d.t=.5;d.floor=dropFloor(d);sfx.bump()}
    }else if(d.st===1){
      d.t-=dt;d.g.position.x=d.x+Math.sin(mt*70)*.06;
      if(((mt*30)|0)%4===0)emit(dustPool,d.x,d.y0-.4,1,1,.3,.3,1.2,-.4);
      if(d.t<=0){d.st=2;d.vy=0;d.g.position.x=d.x}
    }else if(d.st===2){
      d.vy-=34*dt;d.y+=d.vy*dt;d.g.position.y=d.y;
      if(Math.abs(P.x-d.x)<P.w/2+.3&&P.y<d.y+.75&&P.y+P.h>d.y-.9)hurt(d.x);
      if(d.y-.9<=d.floor){d.st=3;d.g.visible=false;if(d.floor>-20){crystalBurst(d.x,d.floor+.3);sfx.brick();shake=Math.max(shake,.12)}}
    }
  }
}
function resetDrops(){drops.forEach(function(d){d.st=0;d.y=d.y0;d.vy=0;d.cd=0;d.g.position.set(d.x,d.y0,0);d.g.visible=true;if(d.castle){d.eo.visible=false;d.ec.visible=true;updChain(d)}})}
function updBlades(){
  for(var i=0;i<blades.length;i++){
    var b=blades[i];
    if(b.kind==='saw'){b.cx=b.x;b.cy=b.y0+Math.sin(mt*b.speed)*b.range}
    else{b.ang=Math.sin(mt*b.speed)*b.amp;b.cx=b.x+Math.sin(b.ang)*b.L;b.cy=b.y-Math.cos(b.ang)*b.L}
  }
}
function updCrumbles(dt){
  for(var i=0;i<crumbles.length;i++){
    var c=crumbles[i];
    if(c.state===0){if(P.onPlat===c){c.state=1;c.tm=.5}}
    else if(c.state===1){
      c.tm-=dt;c.mesh.position.x=c.cx+Math.sin(mt*70)*.05;
      if(c.tm<=0){if(P.onPlat===c||(P.x>c.l-.15&&P.x<c.r+.15&&Math.abs(P.y-c.t)<.4&&P.vy<=.5))P.cfall=.6;c.state=2;c.tm=0;c.vy=0;c.dead=true;c.mesh.position.x=c.cx;emit(dustPool,c.cx,c.t,6,2,.6,.6,1.3,-.3)}
    }else if(c.state===2){
      c.vy-=30*dt;c.mesh.position.y+=c.vy*dt;c.tm+=dt;
      if(c.tm>3.2){c.state=3;c.tm=0;c.dead=false;c.mesh.position.set(c.cx,c.baseY,0);c.mesh.scale.set(.01,.01,.01)}
    }else if(c.state===3){
      c.tm+=dt;var k=Math.min(1,c.tm/.4);c.mesh.scale.set(k,k,k);
      if(c.tm>.4){c.state=0;c.mesh.scale.set(1,1,1)}
    }
  }
}
function groundOK(e,x){
  for(var i=0;i<solids.length;i++){
    var q=solids[i];if(q.dead||q.hid)continue;
    if(x>q.l&&x<q.r&&Math.abs(q.t-e.y)<.3)return true;
  }
  return false;
}
function hazNear(x,t){
  for(var i=0;i<hazards.length;i++){var h=hazards[i];if(x>h.l-.5&&x<h.r+.5&&Math.abs(h.y0-t)<1.1)return true}
  return false;
}
function landTop(e,x,lo,hi){
  /* topo de chão seguro em x entre e.y+lo e e.y+hi (sem bloco, cano, plataforma que cai/anda, espinho) */
  var best=null;
  for(var i=0;i<solids.length;i++){
    var q=solids[i];if(q.dead||q.hid||q.block||q.pipe||q.mover||q.crumble)continue;
    if(x>q.l+.05&&x<q.r-.05&&q.t>=e.y+lo&&q.t<=e.y+hi&&(best===null||q.t>best))best=q.t;
  }
  if(best!==null&&hazNear(x,best))return null;
  return best;
}
function dropOK(e,x){
  var d=x>e.x?1:-1;
  return landTop(e,x,-3.2,-.3)!==null&&landTop(e,x+d*.9,-3.4,-.3)!==null;
}
/* território: raio em volta do ponto de origem, e zona livre em volta do início e dos checkpoints */
var TERR=12,ZONE=3;
function inZone(x){
  if(Math.abs(x-LV.start.x)<ZONE)return true;
  var c=LV.checkpoints||[];for(var i=0;i<c.length;i++)if(Math.abs(c[i][0]-x)<ZONE)return true;
  return false;
}
function terrOK(e,nx){
  if(e.tw&&(nx<e.tw[0]||nx>e.tw[1])&&Math.abs(nx-e.hx)>Math.abs(e.x-e.hx))return false;/* torre: não sai da viga */
  if(Math.abs(nx-e.hx)>TERR&&Math.abs(nx-e.hx)>Math.abs(e.x-e.hx))return false;
  /* zona livre em volta do cano de chegada: o inimigo não chega encostado em quem acabou de sair do cano */
  for(var i=0;i<pipes.length;i++){var q=pipes[i];if(!q.entry||Math.abs(e.y-q.base)>2.5)continue;
    var d1=Math.abs(nx-q.x);if(d1<2.4&&d1<Math.abs(e.x-q.x))return false}
  return true;
}
/* bloco (tijolo/?) e cano são parede: o inimigo nunca sobe neles */
function eBlockWall(e,nx,air){
  var hw=e.w*.8;
  for(var i=0;i<solids.length;i++){
    var q=solids[i];if(q.dead||q.hid||!(q.block||q.pipe||q.mover||q.crumble))continue;
    var mg=q.pipe?.28:0,qc=(q.l+q.r)/2;if(Math.abs(nx-qc)>=Math.abs(e.x-qc))mg=0;/* folga só ao se aproximar: nunca prende quem já está perto */
    if(!(nx+hw+mg>q.l&&nx-hw-mg<q.r))continue;
    if(e.y<q.t-.1&&e.y+e.h>q.b+.05)return true;
    if(air&&e.y>=q.t-.1&&e.y<q.t+2.5&&!(e.x+hw>q.l&&e.x-hw<q.r))return true;
  }
  return false;
}
function eHit(e,x,y){
  var hw=e.w*.8;
  for(var i=0;i<solids.length;i++){
    var q=solids[i];if(q.dead||q.hid)continue;
    if(x+hw>q.l&&x-hw<q.r&&y<q.t&&y+e.h>q.b)return true;
  }
  return false;
}
function eObstacle(e,nx){
  var hw=e.w*.8,h=0;
  for(var i=0;i<solids.length;i++){
    var q=solids[i];if(q.dead||q.hid)continue;
    if(nx+hw>q.l&&nx-hw<q.r&&e.y<q.t-.1&&e.y+e.h>q.b+.05)h=Math.max(h,q.t-e.y);
  }
  return h;
}
function eHeadFree(e,nx,ob){
  var hw=e.w*.8+.3;
  for(var i=0;i<solids.length;i++){
    var q=solids[i];if(q.dead||q.hid)continue;
    if(nx+hw>q.l&&nx-hw<q.r&&q.b>=e.y+ob-.05&&q.b<e.y+ob+e.h)return false;
  }
  return true;
}
var WALKERS=['beetle','urchin','skel'];
function eBlocker(e,nx){
  /* outro inimigo no caminho: não deixa um atravessar o outro */
  for(var i=0;i<enemies.length;i++){var o=enemies[i];
    if(o===e||!o.alive||o.dorm||o.bones||WALKERS.indexOf(o.type)<0||Math.abs(o.y-e.y)>.8)continue;
    var gap=(e.w+o.w)*.8,cur=Math.abs(o.x-e.x),nxt=Math.abs(o.x-nx);
    if(nxt<gap&&nxt<cur-.0001)return o;
  }
  return null;
}
function walkMove(e,dt,vx,chase){
  e.py=e.y;e.tblk=false;
  if(vx!==0){
    var nx=e.x+vx*dt,dv=vx>0?1:-1,ob=eObstacle(e,nx),bk=eBlocker(e,nx)||eBlockWall(e,nx,!e.grounded);
    if(!bk&&!terrOK(e,nx)){bk=true;e.tblk=true}
    if(bk){if(!chase)e.dir=-e.dir}
    else if(ob>0){
      if(e.grounded&&ob<=2.05&&eHeadFree(e,nx,ob)){e.vy=12.2;e.grounded=false}
      else if(!chase&&e.grounded)e.dir=-e.dir;
    }else if(e.grounded&&!groundOK(e,nx+dv*.45)){
      if(!chase){if(dropOK(e,nx+dv*.45))e.x=nx;else e.dir=-e.dir}
      else if(P.y<e.y-.5&&dropOK(e,nx+dv*.45))e.x=nx;
    }else e.x=nx;
  }
  e.vy-=34*dt;e.y+=e.vy*dt;
  var sup=-99,i,q;
  for(i=0;i<solids.length;i++){
    q=solids[i];if(q.dead||q.hid)continue;
    if(!q.block&&!q.pipe&&e.x>q.l-.02&&e.x<q.r+.02&&q.t<=e.py+.15&&q.t>sup)sup=q.t;
    if(e.vy>0&&e.x>q.l&&e.x<q.r&&q.b>=e.py+e.h-.1&&q.b<e.y+e.h){e.y=q.b-e.h;e.vy=0}
  }
  if(e.vy<=0&&e.y<=sup+.001){e.y=sup;e.vy=0;e.grounded=true}else e.grounded=false;
  /* se sobrou um pedacinho dentro de parede/cano (pulo de raspão), empurra para fora */
  var hw=e.w*.8;
  for(i=0;i<solids.length;i++){
    q=solids[i];if(q.dead||q.hid)continue;
    if(e.x+hw>q.l&&e.x-hw<q.r&&e.y<q.t-.08&&e.y+e.h>q.b+.05){
      var pl=e.x+hw-q.l,pr=q.r-(e.x-hw);
      if(pl<pr){if(pl<.45)e.x-=pl}else if(pr<.45)e.x+=pr;
    }
  }
  /* dois inimigos que acabaram sobrepostos se afastam devagar */
  for(i=0;i<enemies.length;i++){
    var o=enemies[i];
    if(o===e||!o.alive||o.dorm||o.bones||WALKERS.indexOf(o.type)<0||Math.abs(o.y-e.y)>.8)continue;
    var gp=(e.w+o.w)*.8,dd=e.x-o.x;
    if(Math.abs(dd)<gp*.7){
      var push=(gp*.7-Math.abs(dd))*Math.min(1,dt*5)*.5*(dd>=0?1:-1);
      if(dd===0)push=(i%2?1:-1)*.01;
      if(eObstacle(e,e.x+push)===0)e.x+=push;
    }
  }
  if(e.y<-9){e.alive=false;e.deadT=1;if(e.alertS)e.alertS.visible=false}
}
/* inimigo que não consegue pegar o Kuro (ele subiu alto ou o caminho travou) desiste e volta a patrulhar */
function chaseStuck(e,dt,reachH,win,lim){
  if(e.wX===undefined){e.wX=e.x;e.wT=0;e.stillT=0;e.highT=0}
  e.wT+=dt;if(e.wT>=win){var mv=Math.abs(e.x-e.wX);e.wX=e.x;e.wT=0;if(mv<.4)e.stillT+=win;else e.stillT=0}
  var ey=(e.type==='frog'&&e.base!==undefined)?Math.min(e.y,e.base):e.y;/* sapo: mede do chão, não do meio do pulo */
  if(P.y>ey+reachH&&!P.inW)e.highT+=dt;else e.highT=Math.max(0,e.highT-dt*.5);
  return e.stillT>=lim||e.highT>1.2;
}
function giveUp(e){
  e.ignT=4;e.wX=undefined;e.loseT=0;e.qT=.9;
  if(!e.qS){if(!qTex){var c=document.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d');
      x.fillStyle='#6a7a90';x.beginPath();x.arc(32,32,28,0,6.283);x.fill();x.lineWidth=4;x.strokeStyle='#fff';x.stroke();
      x.fillStyle='#fff';x.font='bold 42px Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('?',32,35);
      qTex=new T.CanvasTexture(c);qTex.encoding=T.sRGBEncoding}
    e.qS=new T.Sprite(new T.SpriteMaterial({map:qTex,transparent:true,depthTest:false,fog:false}));e.qS.renderOrder=10;e.qS.scale.set(.5,.5,1);add(e.qS)}
}
var qTex=null;
/* depois de desistir: só volta a perseguir se o Kuro descer para a altura dele e chegar perto */
function canRealert(e){var ey=(e.type==='frog'&&e.base!==undefined)?e.base:e.y;if(P.y>ey+(e.type==='frog'?2.4:2.1)&&P.grounded)return false;/* Kuro parado num lugar alto: não adianta perseguir */
  if(!(e.ignT>0))return true;return Math.abs(P.y-e.y)<1&&Math.abs(P.x-e.x)<3.2}
function sees(e,rx,ry){return state==='play'&&!P.warp&&Math.abs(P.x-e.x)<rx&&Math.abs((P.y+.9)-(e.y+.5))<ry}
function witchAI(e,dt){
  e.fireT-=dt;
  if(!e.charging){if(e.fireT<=0&&sees(e,hd(15,17),hd(9,10))){e.charging=true;e.chT=hd(.85,.7)}}
  else{e.chT-=dt;if(e.chT<=0){e.charging=false;e.n++;e.fireT=hd(2.7,2.2)+Math.random()*.4;fireShot(e.x+(P.x>e.x?.35:-.35),e.y+.9,(e.n%3===0)?'g':'p')}}
}
function batSep(e,dt){
  /* morcegos não se empilham no mesmo ponto quando perseguem o Kuro */
  for(var i=0;i<enemies.length;i++){
    var o=enemies[i];if(o===e||!o.alive||o.dorm||o.type!=='bat')continue;
    var dx=e.x-o.x,dy=e.y-o.y,d=Math.hypot(dx,dy);
    if(d<.95){
      if(d<.001){dx=(i%2?1:-1);dy=.3;d=1}
      var f=(.95-Math.hypot(e.x-o.x,e.y-o.y))*Math.min(1,dt*5)*.5,px=e.x+dx/d*f,py=e.y+dy/d*f;
      if(!eHit(e,px,e.y))e.x=px;if(!eHit(e,e.x,py))e.y=py;
    }
  }
}
/* ao renascer, os inimigos da região ficam na ponta oposta do território (longe do Kuro) e depois percorrem tudo */
/* território real: a plataforma onde o inimigo vive e as vizinhas que ele alcança pulando/descendo (raio TERR) */
function terrExtent(o){
  var hx=o.hx,lo=hx-TERR,hi=hx+TERR,P0=[],i,q;
  for(i=0;i<solids.length;i++){q=solids[i];
    if(q.dead||q.hid||q.block||q.pipe||q.mover||q.crumble||q.wall)continue;
    if(q.r<lo||q.l>hi)continue;P0.push(q)}
  var cur=null;
  for(i=0;i<P0.length;i++){q=P0[i];if(hx>=q.l-.05&&hx<=q.r+.05&&Math.abs(q.t-o.by)<.4){cur=q;break}}
  if(!cur){o.tl=o.x0-2;o.tr=o.x1+2;return}
  var set=[cur],ch=true;
  while(ch){ch=false;
    for(i=0;i<P0.length;i++){q=P0[i];if(set.indexOf(q)>=0)continue;
      for(var k=0;k<set.length;k++){var a=set[k],dt=q.t-a.t;
        if(dt<=2.05&&dt>=-3.2&&q.l-a.r<1.6&&a.l-q.r<1.6){set.push(q);ch=true;break}}}}
  var tl=1e9,tr=-1e9;
  set.forEach(function(a){tl=Math.min(tl,Math.max(a.l,lo));tr=Math.max(tr,Math.min(a.r,hi))});
  o.tl=Math.min(tl,o.x0);o.tr=Math.max(tr,o.x1);
}
function inTerr(e){return P.x>e.tl-1.2&&P.x<e.tr+1.2}
function placeEnemies(rx){
  enemies.forEach(function(e){
    if(e.dorm||e.sx0===undefined)return;
    var T=e.t0;
    if(T!=='beetle'&&T!=='urchin'&&T!=='skel'&&T!=='frog'&&T!=='wbeetle'&&T!=='guard')return;
    var sx=e.sx0;
    if(Math.abs(e.hx-rx)<18)sx=Math.abs(e.x0-rx)>=Math.abs(e.x1-rx)?e.x0:e.x1;
    e.sx=sx;e.x=sx;e.dir=sx>=e.hx?-1:1;
  });
}
function frogLedge(e,d){
  /* plataforma à frente cujo topo está acima do chão do sapo (até ~2.3), mesmo acima da cabeça */
  var best=null,x1=e.x+d*.3,x2=e.x+d*1.7;
  for(var i=0;i<solids.length;i++){
    var q=solids[i];if(q.dead||q.hid||q.block||q.pipe||q.mover||q.crumble)continue;
    if(q.r<Math.min(x1,x2)||q.l>Math.max(x1,x2))continue;
    var dy=q.t-e.y;if(dy<.15||dy>2.3)continue;
    var free=true;
    for(var k=0;k<solids.length;k++){var o=solids[k];if(o===q||o.dead||o.hid)continue;
      if(o.r>q.l+.2&&o.l<q.r-.2&&o.b>=q.t-.05&&o.b<q.t+e.h+.1){free=false;break}}
    if(free&&(best===null||q.t<best))best=q.t;
  }
  return best;
}
function frogHop(e){
  var chase=e.st==='chase',d;
  if(chase)e.dir=P.x>e.x?1:-1;
  else if(Math.random()<.25)e.dir=-e.dir;
  d=e.dir;
  var vy=chase?10:6.5,vx=d*(chase?hd(4.3,5):hd(2.3,2.7)),dly=chase?hd(.55,.45)+Math.random()*.2:1.1+Math.random()*.6;
  var ob=eObstacle(e,e.x+d*1.1),up=false,lg=frogLedge(e,d);
  if(chase&&lg!==null&&lg>P.y+.9)lg=null;
  if(eBlockWall(e,e.x+d*1.1,false)){vx=0;if(!chase)e.dir=-d}
  else if(lg!==null){vy=Math.sqrt(60*(lg-e.y+.45));vx=d*hd(4.3,5);up=true}
  else if(ob>0){
    if(ob<=2.05&&eHeadFree(e,e.x+d*1.1,ob)){vy=12.4;vx=d*hd(4.3,5);up=true}
    else{vx=0;if(!chase)e.dir=-d}
  }
  if(!up){
    /* teto baixo (plataforma suspensa): pula mais baixo para passar por baixo sem bater a cabeça */
    var cl=99;
    for(var ci=0;ci<solids.length;ci++){var cq=solids[ci];if(cq.dead||cq.hid)continue;
      if(cq.r>Math.min(e.x,e.x+d*3.2)-.3&&cq.l<Math.max(e.x,e.x+d*3.2)+.3&&cq.b>=e.y+e.h-.02)cl=Math.min(cl,cq.b-(e.y+e.h)-.06)}
    if(cl<vy*vy/60)vy=Math.max(4.2,Math.sqrt(60*Math.max(cl,0)));
    if(vy<6&&vx!==0)vx=d*Math.max(Math.abs(vx),3.6);
  }
  if(vx!==0){
    var air=2*vy/30,ok=false,k;
    for(k=0;k<3&&!ok;k++){
      var lx=e.x+vx*(up?air-.3:air);
      var lt=landTop(e,lx,-3.2,2.5);
      var tt=terrOK(e,lx);
      if(lt!==null&&tt&&!eBlockWall(e,lx,true))ok=true;else vx*=.55;
    }
    if(!ok){vx=0;if(!chase)e.dir=-d}
  }
  e.vy=vy;e.vx=vx;e.hop=dly;e.fg=false;
}
function frogMove(e,dt){
  if(e.fg===undefined)e.fg=true;
  if(!(e.st==='alert'&&e.fg))e.hop-=dt;
  if(e.fg){
    e.vx=0;e.vy=0;
    if(e.hop<=0&&e.st!=='alert')frogHop(e);
  }
  if(!e.fg){
    e.py=e.y;e.vy-=30*dt;e.y+=e.vy*dt;
    if(e.vx!==0){
      var fnx=e.x+e.vx*dt;
      if(eBlockWall(e,fnx,true)||!terrOK(e,fnx))e.vx=0;
      else{var ob=eObstacle(e,fnx);if(ob>0){if(e.vy<=0)e.vx=0}else e.x=fnx}
    }
    var sup=-99,i,q;
    for(i=0;i<solids.length;i++){
      q=solids[i];if(q.dead||q.hid)continue;
      if(!q.block&&!q.pipe&&e.x>q.l-.02&&e.x<q.r+.02&&q.t<=e.py+.15&&q.t>sup)sup=q.t;
      if(e.vy>0&&e.x>q.l&&e.x<q.r&&q.b>=e.py+e.h-.1&&q.b<e.y+e.h){e.y=q.b-e.h;e.vy=0}
    }
    if(e.vy<=0&&e.y<=sup+.001){e.y=sup;e.vy=0;e.vx=0;e.land=.2;e.fg=true;e.base=sup}
    var hw=e.w*.8;
    for(i=0;i<solids.length;i++){
      q=solids[i];if(q.dead||q.hid)continue;
      if(e.x+hw>q.l&&e.x-hw<q.r&&e.y<q.t-.08&&e.y+e.h>q.b+.05){
        var pl=e.x+hw-q.l,pr=q.r-(e.x-hw);
        if(pl<pr){if(pl<.45)e.x-=pl}else if(pr<.45)e.x+=pr;
      }
    }
    if(e.y<-9){e.alive=false;e.deadT=1;if(e.alertS)e.alertS.visible=false}
  }
}
function updEnemy(e,dt){
  if(!e.alive)return;
  if(e.bub){bubUpd(e,dt);return}/* presa na bolha da raposinha */
  if((e.slp>0||e.wake)&&sleepUpd(e,dt))return;/* dormindo ou derrubado */
  var t=e.type;
  if(e.dorm){
    if(state==='play'&&P.x>=e.trig){e.dorm=false;e.appT=.9;e.noHit=true;e.vis.g.visible=true;e.fireT=1.3;emit(dustPool,e.x,e.y+.5,14,3,.8,.8,1.2,-.2);emit(sparkPool,e.x,e.y+.6,14,3.5,.7,.35,.2,1);sfxMagic()}
    else return;
  }
  if(e.appT>0){e.appT-=dt;if(e.appT<=0)e.noHit=false;else return}
  if(t==='turtle'||t==='tchase'||t==='tshell'||t==='tguard'){turtleAI(e,dt);return}
  if(t==='moth'){mothAI(e,dt);return}
  if(t==='mole'){moleAI(e,dt);return}
  if(t==='peng'){pengAI(e,dt);return}
  if(t==='sbird'){sbirdAI(e,dt);return}
  if(t==='seal'){sealAI(e,dt);return}
  if(t==='worm'||t==='jfish'){wormAI(e,dt);return}
  if(t==='armad'){armadAI(e,dt);return}
  if(t==='owl'){owlAI(e,dt);return}
  if(t==='sprout'){sproutAI(e,dt);return}
  if(t==='bee'){beeAI(e,dt);return}
  if(t==='dfly'){dflyAI(e,dt);return}
  if(t==='wrob'){wrobAI(e,dt);return}
  if(t==='skel'){
    if(e.bones){e.bt-=dt;e.bAge+=dt;if(e.bt<=0){e.bones=false;e.rise=.55;emit(dustPool,e.x,e.y+.5,8,2,.5,.6,1.2,-.3)}return}
    if(e.rise>0){e.rise-=dt;if(e.rise<=.2)e.noHit=false;else return}
  }
  if(t==='frog'){
    if(e.ignT>0)e.ignT-=dt;
    if(e.st==='patrol'&&sees(e,9,3.4)&&inTerr(e)&&canRealert(e)){e.wX=undefined;e.st='alert';e.alertT=.4;e.dir=P.x>e.x?1:-1;sfx.alert()}
    else if(e.st==='alert'){e.alertT-=dt;e.dir=P.x>e.x?1:-1;if(e.alertT<=0){e.st='chase';e.loseT=0;e.hop=0}}
    else if(e.st==='chase'){if(chaseStuck(e,dt,2.4,1.2,2.4)){e.st='patrol';e.hop=1;giveUp(e)}else if(sees(e,13,4.8)&&inTerr(e))e.loseT=0;else{e.loseT+=dt;if(e.loseT>2.2){e.st='patrol';e.hop=1}}}
    frogMove(e,dt);
    if(e.ninja)ninjaAI(e,dt);
  }else if(t==='bat'){
    batSep(e,dt);
    if(e.st==='hang'){e.x=e.hx;e.y=e.hy;e.cur=0;e.bvx=e.bvy=0;/* Cânion: morcego pendurado no teto, dormindo de cabeça para baixo; acorda com o Kuro perto */
      if(state==='play'&&Math.abs(P.x-e.x)<5&&Math.abs(P.y+P.h/2-e.y)<9.6){e.st='alert';e.alertT=.35;sfx.alert()}}
    else if(e.st==='patrol'){
      var bnx=e.x+e.dir*e.speed*dt;if(eHit(e,bnx,e.y))e.dir=-e.dir;else e.x=bnx;
      if(e.x<e.x0){e.x=e.x0;e.dir=1}else if(e.x>e.x1){e.x=e.x1;e.dir=-1}
      var bny=e.base+Math.sin(mt*2.4+e.ph)*.8;if(!eHit(e,e.x,bny))e.y=bny;e.cur=e.speed;e.bvx=e.dir*e.speed;e.bvy=0;
      if(sees(e,hd(9,11),hd(6.5,7))){e.st='alert';e.alertT=hd(.4,.3);e.cur=0;sfx.alert()}
    }else if(e.st==='alert'){
      e.alertT-=dt;e.dir=P.x>e.x?1:-1;e.cur=0;
      if(e.alertT<=0){e.st='chase';e.loseT=0}
    }else if(e.st==='chase'){
      var dx=P.x-e.x,dy=P.y+((curTheme.canyon&&CN&&CN.flip)?P.h-1.5:1.5)-e.y,/* Cânion: com o Kuro no teto, o morcego vem por baixo dele */d=Math.hypot(dx,dy)||1,sp=hd(4.3,5.0)*(alarmT>0?1.25:1),kk=1-Math.exp(-dt*hd(3.2,3.4));
      e.bvx+=(dx/d*sp-e.bvx)*kk;e.bvy+=(dy/d*sp-e.bvy)*kk;
      var cbx=clamp(e.x+e.bvx*dt,e.x0-9,e.x1+9),cby=clamp(e.y+e.bvy*dt,e.base-3.2,e.base+4.2);
      if(!eHit(e,cbx,e.y))e.x=cbx;else e.bvx=0;
      if(!eHit(e,e.x,cby))e.y=cby;else e.bvy=0;
      if(Math.abs(e.bvx)>.4)e.dir=e.bvx>0?1:-1;
      e.cur=sp;
      if(sees(e,13,10))e.loseT=0;else{e.loseT+=dt;if(e.loseT>2)e.st='return'}
    }else{
      var hx=(e.x0+e.x1)/2,rx=hx-e.x,ry=e.base-e.y,rd=Math.hypot(rx,ry)||1;
      var rbx=e.x+rx/rd*3*dt,rby=e.y+ry/rd*3*dt;if(!eHit(e,rbx,e.y))e.x=rbx;if(!eHit(e,e.x,rby))e.y=rby;e.dir=rx>0?1:-1;e.cur=3;
      if(rd<.7){e.st='patrol';e.dir=1}
      else if(sees(e,9,6.5)){e.st='alert';e.alertT=.3;sfx.alert()}
    }
  }else if(t==='lavab'){
    lavaBallAI(e,dt);
  }else if(t==='spit'){
    spitAI(e,dt);
  }else if(t==='eel'){
    e.tmr+=dt;
    var ecy=e.cyc,eph=(e.tmr+e.ph)%ecy,ehide=ecy-1.9,elen=.3,erc=e.reach;
    e.warn=false;
    if(eph<ehide)elen=.3;
    else if(eph<ehide+.7){elen=.55;e.warn=true}
    else if(eph<ehide+.9)elen=lerp(.55,erc,(eph-ehide-.7)/.2);
    else if(eph<ehide+1.3)elen=erc;
    else elen=lerp(erc,.3,(eph-ehide-1.3)/.6);
    e.len=elen;e.x=e.x0+e.edir*elen;e.bx=e.x0+e.edir*elen/2;e.bhw=elen/2+.12;e.noHit=elen<.8;
  }else if(t==='wbeetle'||t==='jelly'||t==='fish'||t==='puffer'||t==='witch'){
    var wnx=e.x+e.dir*e.speed*dt;if(eHit(e,wnx,e.y))e.dir=-e.dir;else e.x=wnx;
    if(e.x<e.x0){e.x=e.x0;e.dir=1}else if(e.x>e.x1){e.x=e.x1;e.dir=-1}
    var wny=e.base+Math.sin(mt*(t==='jelly'?1.4:(t==='fish'?1.8:2.2))+e.ph)*e.amp;if(!eHit(e,e.x,wny))e.y=wny;
    e.cur=e.speed;
    if(t==='witch')witchAI(e,dt);
    if(t==='puffer'){
      var pnear=state==='play'&&Math.hypot(P.x-e.x,(P.y+.7)-(e.y+.4))<3.6;
      e.infl+=((pnear?1:0)-e.infl)*Math.min(1,dt*5);
      e.w=.5+.35*e.infl;e.h=.7+.45*e.infl;
    }
  }else{
    var R=t==='urchin'?hd(6.5,8):hd(7.5,9),wvx=0,wch=false;if(e.ignT>0)e.ignT-=dt;
    if(e.st==='patrol'){
      e.cur=e.speed;
      wvx=e.dir*e.speed;
      if((t==='guard'?guardSuspect(e,dt):sees(e,R,3.1))&&inTerr(e)&&canRealert(e)){e.st='alert';e.alertT=.45;e.dir=P.x>e.x?1:-1;e.cur=0;e.wX=undefined;sfx.alert();if(t==='guard')raiseAlarm(e)}
    }else if(e.st==='alert'){
      e.cur=0;e.alertT-=dt;e.dir=P.x>e.x?1:-1;
      if(e.alertT<=0){e.st='chase';e.loseT=0}
    }else if(e.st==='chase'){
      e.dir=P.x>e.x?1:-1;
      var spd=t==='urchin'?Math.min(hd(3.2,3.7),e.speed*1.8+.5):Math.min(hd(4.6,5.4),e.speed*hd(2.1,2.2)+hd(.8,1.0));
      wvx=e.dir*spd;wch=true;e.cur=spd;
      if(e.tblk){e.cur=0;e.loseT+=dt*3}
      if(chaseStuck(e,dt,2.1,.5,1.5)){e.st='return';e.alertT=3;giveUp(e)}
      else if(sees(e,R*1.5,3.6)&&inTerr(e))e.loseT=0;else{e.loseT+=dt;if(e.loseT>2){e.st='return';e.alertT=3}}
    }else{
      e.alertT-=dt;
      if(Math.abs(e.x-e.hx)<2||e.alertT<=0)e.st='patrol';else e.dir=e.hx>e.x?1:-1;
      e.cur=e.speed;wvx=e.dir*e.speed;
      if((t==='guard'?guardSuspect(e,dt):sees(e,R,3.1))&&inTerr(e)&&canRealert(e)){e.st='alert';e.alertT=.3;e.wX=undefined;sfx.alert();if(t==='guard')raiseAlarm(e)}
    }
    walkMove(e,dt,wvx*(alarmT>0&&wch?1.3:1),wch);
  }
}