/*@@parte:42_blocos.js*/
/* ---------- blocos, cipó e canos ---------- */
var quakeMC=null;function quakeM(){
  if(quakeMC)return quakeMC;
  /* bloco de terremoto: mesmo formato do bloco "?", em verde-musgo, com moldura e o desenho de uma rachadura */
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,0,128);g.addColorStop(0,'#7ad84a');g.addColorStop(1,'#3e9a2a');x.fillStyle=g;x.fillRect(0,0,128,128);
  x.strokeStyle='#245a18';x.lineWidth=8;x.strokeRect(4,4,120,120);x.fillStyle='#d8ffb0';[[14,14],[114,14],[14,114],[114,114]].forEach(function(q){x.beginPath();x.arc(q[0],q[1],5,0,6.283);x.fill()});
  x.strokeStyle='#1a3a10';x.lineWidth=11;x.lineJoin='round';x.beginPath();x.moveTo(66,20);x.lineTo(50,52);x.lineTo(74,62);x.lineTo(52,104);x.stroke();
  x.strokeStyle='#fff6a0';x.lineWidth=5;x.beginPath();x.moveTo(66,20);x.lineTo(50,52);x.lineTo(74,62);x.lineTo(52,104);x.stroke();
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;
  quakeMC=M(0xffffff,.6,0,{map:t,emissive:new T.Color(0x2a6a1a),emissiveIntensity:.35});return quakeMC}
function buildBlocks(){
  (LV.blocks||[]).forEach(function(d){
    var m=mesh(new T.BoxGeometry(1,1,1.15),d.t==='brick'?brickM:(d.c==='feather'&&d.t==='q'?featherBlkM:qM));
    m.position.set(d.x,d.y+.5,0);add(m);
    var b={x:d.x,y:d.y,t:d.t,c:d.c||null,n:d.n||1,state:d.t==='hid'?'hid':'ready',bump:0,mesh:m};
    if(d.t==='hid')m.visible=false;
    if(b.c==='coin')extraCoins+=1;else if(b.c==='multi')extraCoins+=b.n;
    var sd={l:d.x-.5,r:d.x+.5,t:d.y+1,b:d.y,oneway:false,block:b,hid:d.t==='hid',dead:false};
    b.solid=sd;solids.push(sd);blocks.push(b);
  });
}
/* broto espinhoso: planta que sobe e desce de um cano (desenho original) */
function buildPlants(){
  (LV.plants||[]).forEach(function(d){
    var pp=null;(LV.pipes||[]).forEach(function(q,qi){if(Math.abs(q.x-d.x)<.3)pp=q;});
    /* nunca em cano de passagem: nem de entrada, nem de saída */
    var isTarget=false;(LV.pipes||[]).forEach(function(q){if(q.to&&q.to.pipe!==undefined&&LV.pipes[q.to.pipe]===pp)isTarget=true});
    if(!pp||pp.to||isTarget)return;
    var g=new T.Group();
    var stM=M(0x3f8a2a,.8),buM=M(0xe0482a,.45,.1,{emissive:new T.Color(0x5a0a00),emissiveIntensity:.35}),spM=M(0xfff0c8,.5),lfM=M(0x2f7a22,.8);
    var st=mesh(new T.CylinderGeometry(.1,.13,2.2,8),stM);st.position.y=-.9;g.add(st);
    var bu=mesh(new T.SphereGeometry(.44,16,12),buM);bu.scale.set(1,1.1,1);g.add(bu);
    for(var i=0;i<12;i++){
      var a=i/12*Math.PI*2,r=.5,cn=mesh(new T.ConeGeometry(.07,.3,5),spM);
      cn.position.set(Math.cos(a)*r*.82,Math.sin(a*1.0+.4)*.1+(i%2?.18:-.1),Math.sin(a)*r*.82);
      cn.lookAt(cn.position.x*2,cn.position.y,cn.position.z*2);cn.rotateX(Math.PI/2);g.add(cn);
    }
    var top=mesh(new T.ConeGeometry(.08,.34,5),spM);top.position.y=.55;g.add(top);
    [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.07,8,6),new T.MeshStandardMaterial({color:0x220a00,emissive:0xffd23a,emissiveIntensity:1.2}),false,false);e.position.set(sd*.16,.1,.4);g.add(e)});
    var lf=mesh(new T.SphereGeometry(1,10,6),lfM);lf.scale.set(.5,.05,.2);lf.position.set(-.5,-.55,0);lf.rotation.z=.5;g.add(lf);
    var lf2=lf.clone();lf2.position.x=.5;lf2.rotation.z=-.5;g.add(lf2);
    g.position.set(pp.x,pp.top-.7,0);add(g);
    plants.push({x:pp.x,top:pp.top,g:g,t:d.ph||0,len:0,dead:false,hold:false});
  });
}
function updPlants(dt){
  for(var i=0;i<plants.length;i++){
    var p=plants[i];if(p.dead)continue;
    var per=3.8,pr=p.t%per,near=state==='play'&&(P.warp||(Math.abs(P.x-p.x)<1.5&&P.y>=p.top-.5&&P.y<p.top+1.2));
    if(!(near&&pr>=1.0&&pr<1.6))p.t+=dt;/* não sobe enquanto o Kuro está em cima do cano */
    pr=p.t%per;
    var len=0;
    if(pr<1.6)len=0;
    else if(pr<1.95)len=1.7*(1-Math.pow(1-(pr-1.6)/.35,2));
    else if(pr<3.15)len=1.7;
    else if(pr<3.5)len=1.7*Math.pow(1-(pr-3.15)/.35,1.5);
    if(pr>1.25&&pr<1.6&&((tm*30)|0)%3===0)emit(dustPool,p.x,p.top+.1,1,1.1,.4,.3,1,-.2);/* aviso: poeira no cano */
    p.len=len;
    p.g.position.y=p.top-.7+len;p.g.visible=len>.2;
    p.g.rotation.y=Math.sin(tm*3+i)*.25;
    if(len>.5&&state==='play'&&!P.warp&&Math.abs(P.x-p.x)<.5+P.w/2&&P.y<p.top-.7+len+.45&&P.y+P.h>p.top)hurt(p.x);
  }
}
function buildPipes(){
  if(LV.pipes){var ex=[];LV.pipes.forEach(function(d){if(d.to&&d.to.pipe===undefined&&!d.to.mine&&!d.to.maze&&!LV.pipes.some(function(q){return q.entry&&q.x===d.to.x}))ex.push({x:d.to.x,base:d.to.y||0,top:(d.to.y||0)+1.3,entry:1})});ex.forEach(function(q){LV.pipes.push(q)})}
  (LV.pipes||[]).forEach(function(d){
    var g=new T.Group(),h=d.top-d.base,pM=pipeM,rM=pipeRimM;
    if(curTheme.name==='cave'){pM=M(0x3a78c8,.2,.2,{emissive:0x1a4aa0,emissiveIntensity:.55});rM=M(0x9fd8ff,.15,.2,{emissive:0x3a8ae0,emissiveIntensity:.8})}
    else if(curTheme.name==='forest'){pM=M(0x7a5532,.85,.05);rM=M(0x58a63a,.8,.05)}
    else if(curTheme.name==='peaks'){pM=M(0x7ec4e8,.15,.3);rM=M(0xeaf7ff,.2,.2)}
    else if(curTheme.name==='ruins'){pM=M(0xc99a58,.7,.1);rM=M(0xf2d98c,.4,.5)}
    var body=mesh(new T.CylinderGeometry(.62,.62,h-.3,22),pM);body.position.y=(h-.3)/2;g.add(body);
    var rim=mesh(new T.CylinderGeometry(.76,.76,.42,22),rM);rim.position.y=h-.21;g.add(rim);
    g.position.set(d.x,d.base,0);add(g);d.rim=rim;d.pulse=0;
    d.arrow=null;
    if(d.to){
      var ar=mesh(new T.ConeGeometry(.22,.42,4),M(0xfff3b0,.4,0,{emissive:0xffd23a,emissiveIntensity:.9}),false,false);
      ar.rotation.x=Math.PI;ar.position.set(d.x,d.top+1,0);ar.visible=false;add(ar);d.arrow=ar;
    }
    var sd={l:d.x-.75,r:d.x+.75,t:d.top,b:d.base-1,oneway:false,pipe:d,dead:false};
    solids.push(sd);pipes.push(d);
  });
}
function setEmpty(b){b.state='empty';b.mesh.material=emptyM}
var popCoins=[],popGeo=null,popMat=null;
function popCoin(b){
  /* a moeda sai do bloco girando, sobe e cai (antes só saía uma faísca) */
  if(!popGeo){popGeo=new T.CylinderGeometry(.32,.32,.07,24);popGeo.rotateX(Math.PI/2);popMat=M(0xffc43a,.22,.95,{emissive:new T.Color(0x6a4300),emissiveIntensity:.6})}
  var p=null;
  for(var i=0;i<popCoins.length;i++)if(!popCoins[i].on){p=popCoins[i];break}
  if(!p){p={m:mesh(popGeo,popMat,false,false),on:false,y:0,y0:0,vy:0};add(p.m);popCoins.push(p)}
  p.on=true;p.y0=b.y+.8;p.y=p.y0;p.vy=11;p.x=b.x;p.m.position.set(b.x,p.y,.1);p.m.scale.setScalar(1.25);p.m.rotation.set(0,0,0);p.m.visible=true;
}
var dropCoins=[];
function dropCoin(x,y){
  if(!popGeo){popGeo=new T.CylinderGeometry(.32,.32,.07,24);popGeo.rotateX(Math.PI/2);popMat=M(0xffc43a,.22,.95,{emissive:new T.Color(0x6a4300),emissiveIntensity:.6})}
  var p=null;for(var i=0;i<dropCoins.length;i++)if(!dropCoins[i].on){p=dropCoins[i];break}
  if(!p){p={m:mesh(popGeo,popMat,false,false)};add(p.m);dropCoins.push(p)}
  p.on=true;p.x=x;p.y=y;p.vy=8;p.rest=false;p.t=0;p.m.position.set(x,y,0);p.m.scale.setScalar(1.15);p.m.visible=true;
}
function updDropCoins(dt){
  for(var i=0;i<dropCoins.length;i++){var p=dropCoins[i];if(!p.on)continue;p.t+=dt;
    if(!p.rest){var g=floorBelow(p.x,p.y+.1);p.vy-=30*dt;p.y+=p.vy*dt;
      if(p.vy<0&&g>-90&&p.y-.35<=g){p.y=g+.38;if(p.vy<-4){p.vy=-p.vy*.35}else{p.vy=0;p.rest=true}}
      if(p.y<-9){p.on=false;p.m.visible=false;continue}}
    else{var g2=floorBelow(p.x,p.y+.1);if(g2<p.y-.4)p.rest=false}/* o chão saiu (bloco quebrou, plataforma andou): cai de novo */
    p.m.rotation.y+=4*dt;p.m.position.set(p.x,p.y+(p.rest?Math.sin(p.t*3)*.06:0),0);
    if(state==='play'&&Math.abs(p.x-P.x)<.6+P.w/2&&p.y>P.y-.3&&p.y<P.y+P.h+.3&&p.t>.25){
      p.on=false;p.m.visible=false;addCoin();try{sfx.coin()}catch(er){}emit(sparkPool,p.x,p.y,7,3,.45,.28,.2,5)}
  }
}
function updPopCoins(dt){
  for(var i=0;i<popCoins.length;i++){
    var p=popCoins[i];if(!p.on)continue;
    p.vy-=36*dt;p.y+=p.vy*dt;p.m.rotation.y+=15*dt;p.m.position.y=p.y;
    if(p.vy<0&&p.y<=p.y0+.55){p.on=false;p.m.visible=false;emit(sparkPool,p.x,p.y,7,3,.45,.28,.2,5)}
  }
}
function hitBlock(b){
  if(b.bump>0||b.state==='gone')return;
  if(b.state==='empty'){b.bump=.001;sfx.bump();return}
  if(b.state==='hid'){b.state='ready';b.solid.hid=false;b.mesh.visible=true}
  b.bump=.001;shake=Math.max(shake,.08);sfx.bump();
  if(b.t==='brick'&&!b.c){
    if(!P.big)return;
    b.state='gone';b.solid.dead=true;b.mesh.visible=false;sfx.brick();
    emit(dustPool,b.x,b.y+.5,10,3.4,.7,.45,1,3);emit(sparkPool,b.x,b.y+.5,6,3,.5,.25,.2,6);spawnDebris(b.x,b.y+.5);return;
  }
  var c=b.c;
  if(c==='coin'||c==='multi'){
    addCoin();sfx.coin();popCoin(b);emit(sparkPool,b.x,b.y+1.0,5,3.2,.45,.26,.2,6);
    b.n--;if(c==='coin'||b.n<=0)setEmpty(b);
  }else if(c==='bean'){
    spawnVine(b);setEmpty(b);
  }else if(c==='fox'){
    spawnFox(b.x,b.y+1);setEmpty(b);
  }else if(c==='quake'){
    quake(b);setEmpty(b);
  }else if(c){
    if(c==='flower'&&!P.big)c='mushroom';/* a pena sempre sai: Kuro pequeno que pega a pena fica grande e com capa */
    var it=mkItem(c,b.x,b.y+1.6);it.wide=true;it.pop=.001;if(c==='feather'){it.drift=true;it.x0=b.x;it.t=0;it.y=b.y+1.5}items.push(it);setEmpty(b);sfx.item();
    emit(sparkPool,b.x,b.y+1.3,8,2.5,.5,.3,.2,3);
  }else{setEmpty(b)}
}
function spawnVine(b){
  var g=new T.Group(),y0=b.y+1,top=LV.vineTop||(y0+6),max=top-y0;
  var stem=mesh(vineGeo,vineM,true,false);stem.scale.y=.01;g.add(stem);
  var leaves=[],n=Math.floor(max/.55);
  for(var k=0;k<n;k++){var lf=mesh(leafGeo,leafM2,true,false);lf.visible=false;g.add(lf);leaves.push({m:lf,h:.6+k*.55,side:k%2?1:-1})}
  g.position.set(b.x,y0,-.2);add(g);
  vines.push({x:b.x,y0:y0,top:top,len:0,max:max,g:g,stem:stem,leaves:leaves});
  sfx.vine();toast('O pé de feijão está crescendo! Segure pular ao lado dele.');
}
function tryGrab(){
  /* escada: em pé perto dela, apertar para baixo agarra e desce (dono, 31/10) */
  if(P.vineCd<=0&&P.grounded&&(keys.down||keys.jy<-.55)&&P.stun<=0)for(var j=0;j<vines.length;j++){var w=vines[j];if(!w.ladder)continue;
    if(Math.abs(P.x-w.x)<.75&&P.y>w.y0+.3&&P.y<=w.y0+w.len+.15){P.climb=w;P.x=w.x;P.y=Math.min(P.y,w.y0+w.len)-.25;P.vx=0;P.vy=0;P.grounded=false;P.onPlat=null;P.crouch=false;P.climbDn=1;return}}
  if(P.vineCd<=0&&P.grounded&&(keys.up||keys.jy>.55)&&P.stun<=0)for(var j2=0;j2<vines.length;j2++){var w2=vines[j2];if(!w2.ladder)continue;
    if(Math.abs(P.x-w2.x)<.75&&P.y>=w2.y0-.3&&P.y<w2.y0+w2.len-.5){P.climb=w2;P.x=w2.x;P.y=Math.max(P.y,w2.y0)+.05;P.vx=0;P.vy=0;P.grounded=false;P.onPlat=null;return}}/* embaixo da escada: para cima sobe */
  if(P.vineCd>0||!(keys.jump||keys.up)||P.grounded||P.stun>0)return;
  for(var i=0;i<vines.length;i++){
    var v=vines[i];
    if(v.len<1.5)continue;
    if(Math.abs(P.x-v.x)<1.25&&P.y+P.h>v.y0+.5&&P.y<v.y0+v.len-.4){
      P.climb=v;P.vx=0;P.vy=0;P.jbuf=0;P.dj=false;sfx.coin();return;
    }
  }
  for(var ri=0;ri<ropes.length;ri++){
    var rp=ropes[ri],hy=P.y+P.h;
    if(P.x>rp.x0+.25&&P.x<rp.x1-.25&&hy>rp.y-(rp.kite?1.3:.8)&&hy<rp.y+(rp.kite?1.6:.5)){/* a barra da pipa é mais fácil de agarrar */
      if(P.mount)dismountFox('climb');
      P.climb=rp;P.vx=0;P.vy=0;P.jbuf=0;P.dj=false;P.ropeRel=!keys.jump;P.cph=0;beep(660,.06,'triangle',.03,120);
      if(!P.ropeToast){P.ropeToast=true;toast('Pendurado! Ande para os lados, pule para soltar para cima, baixo para soltar')}return;
    }
  }
}
function ropeMove(dt,ax){
  var r=P.climb;P.y=r.y-P.h+.08;if(!keys.jump)P.ropeRel=true;
  if(Math.abs(ax)>.2){P.x+=ax*3.6*dt;P.face=ax>0?1:-1;P.cph+=dt*9*Math.abs(ax)}
  if(P.x<r.x0+.1||P.x>r.x1-.1||keys.down||keys.jy<-.55){P.climb=null;P.vineCd=.45;P.vy=0;return}
  if(keys.jump&&P.ropeRel){P.climb=null;P.vineCd=.5;P.vy=11;P.vx=ax*5;sfx.jump()}
}
function climbMove(dt,ax){
  var v=P.climb;P.vx=0;P.vy=0;P.grounded=false;P.onPlat=null;P.coyote=0;
  if(v.rope){ropeMove(dt,ax);return}
  var topY=v.y0+v.len;
  if(Math.abs(ax)>.6&&!(v.ladder&&(Math.abs(keys.jy||0)>Math.abs(ax)*.7||keys.down||keys.up)&&!keys.jump)){var sg=ax>0?1:-1;P.climb=null;/* escada: o joystick inclinado para baixo/cima não solta */P.vx=sg*5;P.vy=6;P.vineCd=.35;P.face=sg;return}
  if(P.y<v.y0-.1){P.y+=6*dt;P.cph+=dt*6;return}
  P.x+=(v.x-P.x)*(1-Math.exp(-dt*16));
  var up=keys.jump||keys.up||(keys.jy||0)>.55,dn=(keys.down||(keys.jy||0)<-.55)&&!up;/* joystick também sobe/desce */
  P.cph+=(up?1:(dn?-1:0))*dt*9;
  P.y+=(up?3.6:(dn?-3.4:0))*dt;
  if(dn&&P.y<=v.y0){P.y=v.y0;P.climb=null;P.vineCd=.4;return}
  if(P.y<v.y0)P.y=v.y0;
  if(P.y>=topY-.02){
    P.y=topY;
    if(v.len>=v.max-.01&&up){P.climb=null;P.vineCd=.6;P.vx=v.ladder?6:4;P.vy=9.5;P.face=1;sfx.jump()}
  }
}
function inRoom(x){var R=LV&&LV.rooms;if(R)for(var i=0;i<R.length;i++)if(x>R[i].a)return true;return false}
function tryWarp(dt){
  if(P.warp)return;
  var pl=P.onPlat;
  if(!P.grounded||!pl||!pl.pipe||!pl.pipe.to||Math.abs(P.x-pl.pipe.x)>.55){P.pipeT=0;return}
  var still=Math.abs(P.vx)<.3&&!keys.left&&!keys.right;
  if(keys.down)P.pipeT=1;else if(still)P.pipeT+=dt;else P.pipeT=0;
  if(P.pipeT>=.7){P.pipeT=0;P.warp={t:0,pp:pl.pipe,tg:pl.pipe.to,moved:false,exit:null};sfx.pipe();P.vx=0}
}
function warpStep(dt){
  var w=P.warp;w.t+=dt;P.vx=0;P.vy=0;
  if(w.t<.4){P.x=w.pp.x;P.y=w.pp.top-1.95*(w.t/.4)}
  else{
    if(w.tg.mine&&!w.moved){mineFall();return}
    if(w.tg.maze&&!w.moved){mazeEnter();return}
    if(!w.moved){
      w.moved=true;
      if(w.tg.pipe!==undefined){w.exit=pipes[w.tg.pipe];P.x=w.exit.x;P.y=w.exit.top-1.95}
      else{var en=null;for(var ei=0;ei<pipes.length;ei++)if(pipes[ei].entry&&pipes[ei].x===w.tg.x){en=pipes[ei];break}if(en){w.exit=en;P.x=en.x;P.y=en.top-1.95}else{P.x=w.tg.x;P.y=w.tg.y}}
      P.face=1;updateCamera(0,true);
    }
    var u=w.t-.4;
    if(w.exit){
      /* saída do cano: sobe com um estouro, faz um pulinho e pousa na boca do cano */
      var tp=w.exit.top,RS=.2,H=.95,FL=.3;
      P.x=w.exit.x;
      if(u<RS){var k=u/RS;k=1-(1-k)*(1-k);P.y=tp-1.95+(1.95+H)*k;P.grounded=false;P.vy=14}
      else if(u<RS+FL){var k2=(u-RS)/FL;P.y=tp+H*(1-k2*k2);P.grounded=false;P.vy=-9}
      else P.y=tp;
      if(!w.pop&&u>=.04){w.pop=true;w.exit.pulse=.3;emit(dustPool,w.exit.x,tp+.15,12,2.8,.6,.5,1.2,-.1);emit(sparkPool,w.exit.x,tp+.2,12,4,.6,.3,.25,2);sfx.pop()}
      if(!w.land&&u>=RS+FL){w.land=true;P.land=.2;emit(dustPool,w.exit.x,tp+.05,7,2.2,.5,.45,1.1,-.2);sfx.land();w.exit.pulse=.15}
      if(u>=RS+FL+.05){P.warp=null;P.y=tp;P.vy=0;P.inv=1.2;$('fade').style.opacity=0;return}
    }else{
      /* sem cano de saída (sala): cai de leve do alto com uma nuvenzinha */
      if(!w.pop){w.pop=true;emit(dustPool,P.x,P.y+.3,10,2.4,.6,.5,1.2,-.1);emit(sparkPool,P.x,P.y+.8,10,3.5,.6,.3,.25,2);sfx.pop()}
      if(w.t>=.8){P.warp=null;P.vy=0;P.inv=1.2;$('fade').style.opacity=0;return}
    }
  }
  $('fade').style.opacity=clamp(1-Math.abs(w.t-.4)/.25,0,1);
}

/* montado: no máximo a altura do Kuro grande, para passar pelos mesmos lugares; agachado passa nos túneis */
function mountH(){return Math.min(1.8,stdH()+FOXH)}
function stdH(){return P.big?1.8:1.35}
function crH(){return P.big?1.1:.85}
function blockedAbove(h){
  for(var i=0;i<solids.length;i++){
    var q=solids[i];if(q.dead||q.hid||q.oneway)continue;
    if(P.x+P.w/2>q.l+.02&&P.x-P.w/2<q.r-.02&&q.b>=P.y+crH()-.02&&q.b<P.y+h-.02)return true;
  }
  return false;
}
function updCrouch(){
  if(P.climb||P.warp)P.crouch=false;
  else{
    var want=keys.down&&P.grounded;
    if(want)P.crouch=true;
    else if(P.crouch&&!blockedAbove(P.mount?mountH():stdH()))P.crouch=false;
  }
  P.h=P.mount?(P.crouch?crH()+.3:mountH()):(P.crouch?crH():stdH());
}