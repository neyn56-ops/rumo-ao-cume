/*@@parte:53_agua.js*/
/* ---------- água ---------- */
var airBubs=[];
function wTop(x){var L=LV.wlev;if(L)for(var i=0;i<L.length;i++)if(x>=L[i][0]&&x<=L[i][1])return L[i][2];return LV.water.top}
/* altura da onda da superfície (a mesma da faixa da frente): o Kuro boia junto com ela */
function surfWave(x,ph,k){ph=ph||0;k=k===undefined?1:k;return (Math.sin(x*.55+tm*1.5+ph)*.16+Math.sin(x*1.3-tm*2.1+ph*1.7)*.07+Math.sin(x*.21+tm*.6)*.1)*k}
function inWater(x,y){var w=LV&&LV.water;return !!w&&x>=w.x0&&x<=w.x1&&y>=w.y0&&y<=wTop(x)}
function currentAt(x,y){var c=LV&&LV.currents;if(c)for(var i=0;i<c.length;i++){var q=c[i];if(x>=q[0]&&x<=q[1]&&y>=q[2]&&y<=q[3])return q}return null}
var bubFx=null,bubTex=null;
function emitBub(x,y,n){
  if(!bubFx){
    var c=document.createElement('canvas');c.width=c.height=32;var g=c.getContext('2d');
    g.beginPath();g.arc(16,16,13,0,6.283);g.fillStyle='rgba(220,250,255,.25)';g.fill();g.lineWidth=2.5;g.strokeStyle='rgba(255,255,255,.9)';g.stroke();
    g.beginPath();g.arc(11,11,3,0,6.283);g.fillStyle='rgba(255,255,255,.95)';g.fill();
    bubTex=new T.CanvasTexture(c);bubFx=[];
    for(var q=0;q<48;q++){var sp=new T.Sprite(new T.SpriteMaterial({map:bubTex,transparent:true,depthWrite:false,fog:false}));sp.visible=false;sp.renderOrder=38;scene.add(sp);bubFx.push({s:sp,life:0,vx:0,vy:0,sz:.1})}
  }
  for(var i=0,k=0;i<bubFx.length&&k<n;i++){
    var b=bubFx[i];if(b.life>0)continue;
    b.life=b.max=.9+Math.random()*.8;b.vx=(Math.random()-.5)*.5;b.vy=.9+Math.random()*.9;b.sz=.1+Math.random()*.14;
    b.s.position.set(x+(Math.random()-.5)*.15,y,.5+Math.random()*.5);b.s.scale.set(b.sz,b.sz,1);b.s.material.opacity=.9;b.s.visible=true;k++;
  }
}
function updBubFx(dt){
  if(!bubFx)return;
  for(var i=0;i<bubFx.length;i++){
    var b=bubFx[i];if(b.life<=0)continue;
    b.life-=dt;var top=LV&&LV.water?capTop(b.s.position.x,wTop(b.s.position.x)):99;
    if(b.life<=0||b.s.position.y>top){b.life=0;b.s.visible=false;continue}
    b.s.position.x+=(b.vx+Math.sin(tm*6+i)*.25)*dt;b.s.position.y+=b.vy*dt;
    b.s.material.opacity=Math.min(.9,b.life/b.max*1.6);
  }
}
function crawlArm(u){
  u=((u%1)+1)%1;
  if(u<.55){var k=u/.55,e=k*k*(3-2*k);return [-3.0+e*2.75,-(.35+1.05*Math.sin(Math.PI*Math.min(1,k*1.1))),.12+.1*k]}
  var k2=(u-.55)/.45,e2=k2*k2*(3-2*k2);return [-.25-e2*2.75,-(.5+1.15*Math.sin(Math.PI*k2)),.15+.6*Math.sin(Math.PI*k2)];
}
function splashFx(x,y,n){emit(dropPool,x,y+.05,Math.round(n*1.4),5.2,.65,.17,-.1,14);emitBub(x,y-.35,Math.ceil(n/2))}/* respingo: gotinhas que sobem e caem + bolhas embaixo */
function strokeSwim(manual){
  var near=wTop(P.x)-(P.y+P.h*.45)<.7;
  if(near){P.vy=12.5;P.noCut=.6;splashFx(P.x,wTop(P.x),10);sfx.splash()}
  else{P.vy=Math.min(manual?7.6:6.6,Math.max(P.vy,0)+(manual?7.2:6.4));sfx.swim();emitBub(P.x-P.face*.8,P.y+.6,3);emitBub(P.x+P.face*.8,P.y+.65,3)}
  P.stk=0;P.grounded=false;P.onPlat=null;P.coyote=0;P.jbuf=0;P.swimCd=.45;if(manual)P.tapCd=.2;
}
function swimJump(dt){
  P.swimCd-=dt;P.tapCd-=dt;
  if(P.jbuf>0&&P.tapCd<=0)strokeSwim(true);
  else if(keys.jump&&P.swimCd<=0&&P.stun<=0)strokeSwim(false);
}
function waterVy(dt){
  var down=keys.down||keys.jy<-.55;
  P.vy-=(down?18:9)*dt;
  P.vy*=Math.exp(-2.8*dt);
  var top0=wTop(P.x),top=top0+surfWave(P.x),ctr=P.y+P.h*.45;
  var dzs=(top+.12)-ctr;
  if(!down&&dzs<1.3&&dzs>-.6&&top0-capTop(P.x,top0)<.01){
    /* boiando: segue a onda (sobe e desce com ela) */
    var wvy=(surfWave(P.x+.02)-surfWave(P.x))*0+((surfWave(P.x)-(P.lastWv===undefined?surfWave(P.x):P.lastWv))/Math.max(dt,.001));
    P.vy+=dzs*30*dt;P.vy=lerp(P.vy,wvy+dzs*3,Math.min(1,dt*5));
  }
  P.lastWv=surfWave(P.x);
}
function drown(){
  hearts--;setHearts();sfx.hurt();
  emit(dustPool,P.x,P.y+P.h,6,2,.6,.3,.5,-2);toast('Sem ar! Procure uma bolha');
  if(hearts<=0)startDeath('hit',function(){lose('Sem ar','O Kuro ficou sem fôlego. Procure as bolhas de ar e os bolsões!')});
}
function updAir(dt){
  if(!LV.water){P.hd=false;return}
  var hu=inWater(P.x,P.y+P.h-.12);P.hd=hu;
  var AT=LV.airT||13;
  if(hu){
    P.air=Math.max(0,P.air-dt/AT);
    if(P.air<=0){P.drownT-=dt;if(P.drownT<=0){P.drownT=1;drown()}}
  }else{P.air=Math.min(1,P.air+dt/1.4);P.drownT=.4}
  for(var i=0;i<airBubs.length;i++){
    var b=airBubs[i];
    if(!b.on){b.cd-=dt;if(b.cd<=0){b.on=true;b.mesh.visible=true}continue}
    if(Math.abs(P.x-b.x)<.9&&Math.abs(P.y+P.h*.55-b.y)<1.1){
      b.on=false;b.cd=9;b.mesh.visible=false;
      if(P.air<.9)toast('Fôlego renovado');
      P.air=1;sfx.bubble();emit(sparkPool,b.x,b.y,12,3,.6,.3,.3,-1);
    }
  }
}
function step(dt){
  if(trIntro&&trIntro.on&&state==='play'&&curTheme.name==='trail'){updTrailIntro(dt);return}/* abertura do Mundo 12: o barquinho chegando */
  if(state==='play'){if(LV&&LV.clockIn&&!clkIn&&P.x>LV.outX)clkIn=true;if(!(LV&&LV.clockIn)||clkIn)timeLeft-=dt;if(timeLeft<=0){timeUp();return}}
  moveMovers(dt);timeT+=dt;updBlades();updCrumbles(dt);updDrops(dt);updBalls(dt);updSandFx(dt);
  for(var vi=0;vi<vines.length;vi++){var vn=vines[vi];if(vn.len<vn.max)vn.len=Math.min(vn.max,vn.len+3.2*dt)}
  if(P.warp){warpStep(dt);return}
  if(P.growT>0){P.growT-=dt;P.vx=0;P.vy=0;if(P.capeT>0)capeFx(dt);if(P.fireT>0)fireFx(dt);return}
  if(P.capeT>0){capeFx(dt);P.vx=0;P.vy=0;return}
  if(P.fireT>0){fireFx(dt);P.vx=0;P.vy=0;return}
  if(P.mountT>0){mountFx(dt);P.vx=0;P.vy=0;return}/* montaria: Kuro dá um mortal e cai na sela *//* transformação da flor: chamas sobem em volta do Kuro *//* transformação da capa: Kuro gira e a capa se abre */
  if(curTheme.name==='village')updVillage(dt);
  else if(curTheme.name==='heights')updHeights(dt);
  else if(curTheme.name==='volcano')updVolcano(dt);
  else if(curTheme.name==='summit')updSummit(dt);
  else if(curTheme.name==='trail')updTrail(dt);
  else if(curTheme.name==='sky')updSky(dt);
  else if(curTheme.name==='tower')updTower(dt);
  else if(curTheme.name==='mine')updMine(dt);
  else if(LV&&LV.minePre)updMinePre(dt);
  else if(LV&&LV.maze)mzUpd(dt);
  else if(curTheme.falls)updFalls(dt);
  else if(curTheme.aurora)auUpd(dt);
  else if(curTheme.wreck)wkUpd(dt);
  else if(curTheme.canyon)cnUpd(dt);
  else if(curTheme.roots)rtUpd(dt);
  else if(curTheme.copa){rtUpd(dt);cpUpd(dt)}
  if(P.onPlat&&P.onPlat.mover)P.x+=P.onPlat.x-P.onPlat.px;
  var CNF=curTheme.canyon?cnIn():0;/* Mundo 20: gravidade virada — o passo do Kuro roda no mundo espelhado (ver 36_canion.js) */
  var ax=keys.jx!==0?keys.jx:((keys.right?1:0)-(keys.left?1:0));
  if(P.stun>0){P.stun-=dt;ax=0}
  if(P.inv>0)P.inv-=dt;
  if(P.feather>0){P.feather-=dt;if(P.feather<=0)$('featherStat').hidden=true}
  if(P.noCut>0)P.noCut-=dt;
  if(P.vineCd>0)P.vineCd-=dt;
  if(!P.climb)tryGrab();
  updCrouch();
  updSandSys(dt);
  if(curTheme.wreck&&WK&&WK.push)P.wpush+=WK.push;/* Mundo 19: ventania do mar */
  var wasW=P.inW;P.inW=!!LV.water&&!P.climb&&inWater(P.x,P.y+P.h*.45);
  if(P.inW!==wasW){
    if(P.inW){P.flyT=0;P.pm=0;P.swimCd=0;P.tapCd=0;P.vy*=.45;splashFx(P.x,wTop(P.x)+surfWave(P.x),12);sfx.splash();if(!P.swimToast){P.swimToast=true;toast('Toque em Pular para nadar. Segure para subir devagar')}}
    else{splashFx(P.x,wTop(P.x)+surfWave(P.x),6)}
  }
  if(P.climb){climbMove(dt,ax)}else{
  var mag=Math.abs(ax),tgt;
  var WALK=P.arena?7.3:6.5,RUN=P.arena?8.8:7.8;/* na arena o Kuro é mais ágil *//* montado: mesma velocidade do Kuro a pé */
  if(keys.jx!==0){var spd=mag<.6?Math.max(1.8,WALK*mag/.6):WALK+(mag-.6)/.4*(RUN-WALK);tgt=(ax>0?1:-1)*spd}else tgt=ax*((keys.run||(keys.dbl&&ax*keys.dbl>0))?RUN:WALK);
  if(P.crouch&&P.grounded)tgt=clamp(tgt,-2.4,2.4);
  if(P.inW)tgt*=.62;
  if(P.cape&&P.flyT>0&&!P.grounded&&ax!==0)tgt=(ax>0?1:-1)*Math.max(Math.abs(tgt),8);
  else if(P.cape&&!P.inW&&!P.grounded&&keys.jump&&P.vy<0&&ax!==0)tgt=(ax>0?1:-1)*Math.max(Math.abs(tgt),7);
  if(P.qs)tgt*=.55;
  if(P.wpush)tgt+=P.wpush*(P.grounded?.55:1);
  var slip=P.grounded&&P.onPlat&&P.onPlat.slip;
  if(slip&&LV.skate&&ax!==0&&!P.crouch)tgt*=1.3;/* patinação: no gelo do lago o Kuro desliza mais rápido */
  var turning=ax!==0&&P.vx*ax<-.5;
  var acc=ax===0?(P.grounded?(slip?7:70):7):(P.grounded?(slip?16:(turning?140:(Math.abs(P.vx)>WALK+.2&&!turning?30:95))):(turning?50:38));
  if(P.inW)acc=P.grounded?45:16;
  if(P.grounded&&Math.abs(P.vx)>7.1&&((tm*30)|0)%3===0)emit(dustPool,P.x-P.face*.3,P.y+.05,1,1.6,.4,.4,1.3,-.2);
  if(turning&&P.grounded&&Math.abs(P.vx)>3.5){P.skid=.18;if(((tm*20)|0)%3===0)emit(dustPool,P.x,P.y+.05,1,1.4,.4,.45,1.3,-.3)}
  if(P.stun<=0||P.grounded)P.vx=approach(P.vx,tgt,acc*dt);
  if(ax!==0)P.face=ax>0?1:-1;
  if(P.jbuf>0)P.jbuf-=dt;
  P.coyote=P.grounded?.1:P.coyote-dt;P.cfall=Math.max(0,(P.cfall||0)-dt);
  if(P.grounded)P.dj=false;
  if(P.sjbuf>0)P.sjbuf-=dt;P.jT=(P.jT||0)+dt;
  if(P.sj){P.sjA=(P.sjA||0)+dt*21;if(P.grounded&&P.vy<=0||P.inW||P.climb)P.sj=false}
  if(P.sjbuf>0&&!P.inW&&!P.climb&&!P.warp&&!(P.stun>0)){
    if(P.grounded||P.coyote>0){P.sjbuf=0;if(P.mount){dismountFox('off');if(fox)fox.away=true;P.crouch=false;P.h=stdH()}
      P.vy=(P.mount?14.8:14.2)*(LV.jk||1);P.grounded=false;P.onPlat=null;P.coyote=0;P.jbuf=0;sjGo()}
    else if(P.jT<.25&&P.vy>0&&!P.sj){P.sjbuf=0;if(P.mount){dismountFox('off');if(fox)fox.away=true;P.crouch=false;P.h=stdH()}sjGo()}/* celular: o Pular já saiu e o dedo subiu logo depois — vira giratório no ar */
    else if(P.mount){P.sjbuf=0;dismountFox('off');if(fox)fox.away=true;P.crouch=false;P.h=stdH();P.vy=Math.max(P.vy,9);sjGo()}/* montado no ar: salta de cima dela */
  }
  /* descer da raposinha: para baixo + pular (antes do pulo normal, senão o pulo gastava o comando) */
  if(P.mount&&P.jbuf>0&&(P.grounded||P.coyote>0)&&(keys.down||keys.jy<-.55)){P.jbuf=0;dismountFox('off');if(fox)fox.away=true;P.crouch=false;P.h=stdH();P.vy=10;P.vx=-P.face*3.2;P.grounded=false;P.onPlat=null;P.coyote=0;sfx.jump();emit(dustPool,P.x,P.y+.05,5,1.6,.45,.45,1.2,-.4)}
  if(P.inW)swimJump(dt);
  else if(P.jbuf>0){
    if(P.coyote>0||P.cfall>0){
      P.cfall=0;
      if(P.onPlat&&P.onPlat.mover)P.vx+=P.onPlat.vxm*.7;
      P.vy=(P.qs?11.8:14.5+clamp((Math.abs(P.vx)-6)*.3,0,.9))*(LV.jk||1);/* montado: mesmo pulo do Kuro (o pulo duplo continua) */if(P.qs){P.sink=Math.max(0,(P.sink||0)-.5);emit(dustPool,P.x,P.y+.1,8,2.4,.5,.5,1.2,-.4)}P.jbuf=0;P.coyote=0;P.grounded=false;P.onPlat=null;sfx.jump();P.jsq=.17;P.jsnap=true;P.jT=0;
      if(P.cape&&P.pm>=.98){P.flyT=FLYMAX;P.noCut=.5;sfx.fly();toast('Voando! Toque em pular para bater a capa')}
      emit(dustPool,P.x,P.y+.05,4,1.4,.5,.5,1.2,-.5);
    }else if(P.mount&&!P.dj){
      P.vy=13;P.dj=true;P.jbuf=0;sfx.dbl();emit(sparkPool,P.x,P.y+.2,8,2.5,.45,.3,.2,3);
    }else if(P.feather>0&&!P.dj){
      P.vy=12.4;P.dj=true;P.jbuf=0;sfx.dbl();emit(sparkPool,P.x,P.y+.2,8,2.5,.45,.3,.2,3);
    }
  }
  if(!P.inW&&!keys.jump&&!(keys.sjHold&&P.sj)&&P.vy>5&&P.noCut<=0)P.vy-=60*dt;
  var gr=P.vy<0?43:34;
  if(P.cape&&P.flyT>0&&!P.grounded)gr*=.55;
  if((keys.jump||(keys.sjHold&&P.sj))&&!P.grounded&&Math.abs(P.vy)<2.2)gr*=.62;
  if(P.inW)waterVy(dt);else P.vy-=gr*dt;
  if(P.cape&&P.inW){P.flyT=0;P.pm=0;P.glide=0}
  else if(P.cape){
    if(P.grounded){
      P.flyT=0;
      if(Math.abs(P.vx)>=7.4&&ax*P.vx>0)P.pm=Math.min(1,P.pm+dt/.85);else P.pm=Math.max(0,P.pm-dt/.9);
    }else{
      if(P.flyT>0){
        P.flyT-=dt;
        if(P.flapA>0)P.flapA=Math.max(0,P.flapA-dt*3);
        if(P.jbuf>0){
          var af=clamp((12.5-P.y)/3.5,0,1);
          P.vy=Math.min(10,Math.max(P.vy,0)+9*af);P.jbuf=0;P.flapA=1;sfx.fly();
          emit(sparkPool,P.x-P.face*.3,P.y+P.h*.6,4,2.4,.35,.25,.1,0);
        }
        if(P.vy<-2.4)P.vy=-2.4;
        if(P.flyT<=0){P.pm=0;toast('Fim do voo: segure pular para planar')}
      }else P.pm=Math.max(0,P.pm-dt/1.5);
      if(keys.jump&&P.vy<0&&P.flyT<=0||(keys.jump&&P.flyT>0&&P.vy<0)){
        if(keys.down||keys.jy<-.55){P.vy=Math.max(-16,P.vy-24*dt);P.vx+=P.face*18*dt;P.vx=clamp(P.vx,-13,13)}
        else if(P.vy<-3.2)P.vy=Math.max(-3.2,P.vy);
      }
    }
  }
  if(P.vy<-26)P.vy=-26;
  var cq=P.inW?currentAt(P.x,P.y+P.h*.5):null,cvx=cq?cq[4]:0,cvy=cq?cq[5]:0;
  /* eixo X */
  P.x+=(P.vx+cvx)*dt;
  var xmn=Math.max((LV&&LV.xMin!==undefined)?LV.xMin:-12,viewLeft()+.45);/* não deixa o Kuro sair da tela pela esquerda */if(P.x<xmn){P.x=xmn;P.vx=0}
  if(LV&&LV.xMax!==undefined&&P.x>LV.xMax){P.x=LV.xMax;P.vx=0}
  var hl=P.x-P.w/2,hr=P.x+P.w/2,pt=P.y+P.h,i,s;
  for(i=0;i<solids.length;i++){
    s=solids[i];if(s.oneway||s.dead||s.hid)continue;
    if(hr>s.l&&hl<s.r&&P.y<s.t-.06&&pt>s.b+.06){
      var rise=s.t-P.y;
      if(rise<=.6&&P.vy<=5&&!P.grounded&&!s.hid&&(ax*(s.l+s.r-2*P.x)>0||P.vx*(s.l+s.r-2*P.x)>0)){
        var free=true,q2;
        for(var qi=0;qi<solids.length;qi++){q2=solids[qi];if(q2===s||q2.dead||q2.hid||q2.oneway)continue;
          if(q2.l<hr&&q2.r>hl&&q2.b>=s.t-.02&&q2.b<s.t+P.h-.02){free=false;break}}
        if(free){P.y=s.t;P.vy=-.5;if(s.r-s.l>.5){var cxm=(s.l+s.r)/2;P.x=P.x<cxm?Math.max(P.x,s.l+.24):Math.min(P.x,s.r-.24)}hl=P.x-P.w/2;hr=P.x+P.w/2;continue}
      }
      if(P.x<(s.l+s.r)/2)P.x=s.l-P.w/2;else P.x=s.r+P.w/2;
      P.vx=0;hl=P.x-P.w/2;hr=P.x+P.w/2;
    }
  }
  if(curTheme.name==='mine')mnWallX();/* Mina: as paredes do vagonete seguram o Kuro dentro */
  /* eixo Y */
  P.prevY=P.y;P.y+=(P.vy+cvy)*dt;
  var wasG=P.grounded;P.grounded=false;P.onPlat=null;
  var pl=P.x-P.w/2+.02,pr=P.x+P.w/2-.02,evy=P.vy+cvy;
  for(i=0;i<solids.length;i++){
    s=solids[i];if(s.dead)continue;
    if(evy<=0?(P.x+.16<=s.l||P.x-.16>=s.r):(pr<=s.l||pl>=s.r))continue;
    if(evy<=0){
      if(!s.hid&&P.prevY>=s.t-.12&&P.y<s.t&&s.mz&&P.sj&&mzDown(s))continue;/* Labirinto: o pulo giratório quebra o tijolo embaixo */
      if(!s.hid&&P.prevY>=s.t-.12&&P.y<s.t){P.y=s.t;P.vy=0;P.grounded=true;P.onPlat=s}
    }else if(!s.oneway){
      if(P.prevY+P.h<=s.b+.12&&P.y+P.h>s.b){
        var ov=Math.min(pr,s.r)-Math.max(pl,s.l);
        if(ov<.2&&!s.block&&!s.hid&&!s.mz){P.x+=(P.x<(s.l+s.r)/2?-1:1)*(ov+.02)}
        else{P.y=s.b-P.h;P.vy=0;if(s.block)hitBlock(s.block);else if(s.mz)mzHit(s.mz)}
      }
    }
  }
  if(!P.grounded&&P.vy<P.airVy)P.airVy=P.vy;
  if(P.grounded){
    if(!wasG){
      if(P.airVy<-6){P.land=.22;if(P.airVy<-9)sfx.land();emit(dustPool,P.x,P.y+.05,6,2,.55,.6,1.4,-.4)}
      P.airVy=0;
    }
  }
  /* molas */
  for(i=0;i<springs.length;i++){
    var sp=springs[i];
    if(sp.cd>0){sp.cd-=dt;continue}
    if(Math.abs(P.x-sp.x)<.65&&P.y<sp.t&&P.y>sp.base-.35&&P.vy<=1){
      P.vy=21;P.grounded=false;P.onPlat=null;P.noCut=.6;P.coyote=-1;sp.cd=.3;sp.sq=.35;sfx.spring();
      emit(dustPool,sp.x,sp.base+.2,5,2,.45,.45,1.2,-.3);
    }
  }
  }
  if(CNF)cnOut();
  if((curTheme.roots||curTheme.copa)&&RT&&RT.sw)rtSwingAfter(dt);/* Mundo 21: pendurado no cipó */
  tryWarp(dt);
  if(LV.lavaY!==undefined&&P.y<LV.lavaY-.15&&state==='play'){emit(sparkPool,P.x,LV.lavaY+.2,24,5,.8,.4,.3,3);fallDeath('O Kuro caiu na lava! Voltando ao último checkpoint.');return}
  if(P.y<-9||(LV.fall&&P.x>LV.fall.x&&P.x<LV.fall.x2&&P.y<LV.fall.y)){fallDeath();return}
  updAir(dt);if(state!=='play')return;
  updPlants(dt);
  /* espinhos */
  for(i=0;i<hazards.length;i++){
    var hz=hazards[i];
    if(P.x+P.w/2>hz.l&&P.x-P.w/2<hz.r&&P.y<hz.t-.1&&P.y+P.h>hz.y0)hurt((hz.l+hz.r)/2,1);
  }
  /* lâminas */
  for(i=0;i<blades.length;i++){
    var bl=blades[i],qx=clamp(bl.cx,P.x-P.w/2,P.x+P.w/2),qy=clamp(bl.cy,P.y,P.y+P.h),dx=bl.cx-qx,dy=bl.cy-qy;
    if(dx*dx+dy*dy<bl.r*bl.r*.8)hurt(bl.cx,1);
  }
  updSpears(dt);updSpin(dt);updSlash(dt);updCharge(dt);updStars(dt);updKids(dt);
  /* inimigos */
  for(i=0;i<enemies.length;i++){
    var e=enemies[i];if(!e.alive)continue;
    updEnemy(e,dt);
    if((e.type==='guard'||(e.type==='beetle'&&curTheme.name==='village'))&&pHidden())continue;/* atrás do biombo: o guarda e o gato passam sem encostar */
    if(!e.noHit&&Math.abs(P.x-(e.bx!==undefined?e.bx:e.x))<P.w/2+(e.bhw!==undefined?e.bhw:e.w)&&P.y<e.y+e.h&&P.y+P.h>e.y){
      if((e.slp>0||e.wake)&&!P.sj&&!(P.mount&&P.vy<-1&&P.y>e.y+e.h*.45)){/* montado: caindo de verdade por cima derrota; andando sobe e passa por cima igual *//* dormindo: vira um degrau baixinho — o Kuro sobe e anda por cima (não quica, não atravessa) */
        var stp=e.y+e.h*.55;if(!CNF&&e.slp>0&&e.landed&&P.vy<=.5&&P.y>stp-.6&&P.y<stp+.3){P.y=stp;P.vy=0;P.grounded=true;P.onPlat=null;P.dj=false}continue}
      if(e.stomp&&(CNF?(P.vy>=-.5&&P.y+P.h<e.y+e.h*.55):(P.vy<=.5&&P.y>e.y+e.h*.45))&&(!(e.slp>0||e.wake)||P.sj||P.mount)){/* dormindo: o pulo normal não quica de novo (o Kuro passa e pisa no chão); giratório/raposinha derrotam */
        killE(e,(P.sj||P.mount)?'sjump':'stomp')/* giratório ou montado na raposinha: derrota na hora */;P.vy=(CNF?-1:1)*(P.inW?(keys.jump?8.5:6.5):(keys.jump?14.5:10.5));P.grounded=false;P.onPlat=null;P.dj=false;
        sfx.stomp();emit(dustPool,e.x,e.y+.4,7,2.4,.55,.55,1.2,-.3);
      }else if(P.spinT<=0&&!e.safe)hurt(e.x,(e.type==='urchin'&&curTheme.name!=='peaks'&&curTheme.name!=='ruins')?1:0);
    }
  }
  updFire(dt);updFeathers(dt);updShots(dt);updFlames(dt);updDoor(dt);
  updBoss(dt);
  if(state!=='play')return;
  /* moedas */
  for(i=0;i<coins.length;i++){
    var c=coins[i];if(c.got)continue;
    if(Math.abs(P.x-c.x)<.6&&c.y>P.y-.2&&c.y<P.y+P.h+.1){
      c.got=true;c.pop=.001;addCoin();sfx.coin();
      emit(sparkPool,c.x,c.y,8,3.4,.5,.3,.2,6);
    }
  }
  for(i=0;i<items.length;i++){
    var it=items[i];if(it.got)continue;
    var rr=it.type==='core'?1.1:(it.wide?1.25:.65);
    if(Math.abs(P.x-it.x)<rr&&it.y>P.y-.3&&it.y<P.y+P.h+.3){collectItem(it);if(state!=='play')return}
  }
  for(i=0;i<checkpoints.length;i++){
    var cp=checkpoints[i];
    if(!cp.lit&&!inRoom(P.x)&&(LV.cpStrict?(P.grounded&&Math.abs(P.y-cp.y)<.35&&Math.abs(P.x-cp.x)<2):(P.x>cp.x&&(!LV.tall||(Math.abs(P.y-cp.y)<3.2&&P.x<cp.x+6))))){/* Torre dos Vaga-lumes: só acende quando o Kuro pisa na viga da bandeirinha, perto dela */
      cp.lit=true;cp.mat.emissiveIntensity=2.2;respawn={x:cp.x,y:cp.y};cpSave[levelIdx]={x:cp.x,y:cp.y};sfx.check();
      emit(sparkPool,cp.x,cp.y+2.3,16,3,.8,.35,.3,3);toast('Checkpoint');
    }
  }
  updFox(dt);
  if(LV.goal&&!LV.crystalGoal&&P.x>=LV.goal.x-.2&&P.y>=LV.goal.top-.2&&!inRoom(P.x)){if(levelIdx>=TOTAL_W-1||(LV.boss&&LV.boss.v2))winGame();else winLevel()}
}
