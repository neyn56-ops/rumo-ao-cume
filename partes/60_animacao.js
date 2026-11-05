/*@@parte:60_animacao.js*/
/* ===================== animação ===================== */
var J={hipL:0,kneeL:0,hipR:0,kneeR:0,shL:0,elL:0,shR:0,elR:0,abdL:0,abdR:0,lean:0,twist:0,pel:0,head:0,hy:HY};
var TG={hipL:0,kneeL:0,hipR:0,kneeR:0,shL:0,elL:0,shR:0,elR:0,abdL:.1,abdR:.1,lean:0,twist:0,pel:0,head:0,hy:HY};
var BR={r:0,t:0};
function pose(dt){
  var sp=Math.abs(P.vx),air=!P.grounded,run=clamp((sp-6.4)/1.4,0,1),moving=!air&&sp>.4,tg=TG,mouthOpen=false;
  if(air||moving||P.stun>0||P.cheer>0||P.climb||P.crouch)P.idleT=0;
  if(moving)P.phase+=dt*(5.5+sp*1.05+run*.6);
  var ph=P.phase,s=Math.sin(ph),c=Math.cos(ph);
  if(P.cheer>0)P.cheer-=dt;
  if(P.skid>0)P.skid-=dt;
  var lw=(keys.up&&!P.climb&&!air&&Math.abs(P.vx)<.6&&!P.crouch&&state==='play'&&P.stun<=0&&!P.warp)?1:0;
  P.look+=(lw-P.look)*(1-Math.exp(-dt*9));
  if(opn&&opn.pose){mouthOpen=opnPose(tg)}/* clipe de abertura */
  else if(sumEnd){/* cena final do Cume: crava o mastro, ergue a katana e depois olha a terra nova */
    var et=sumEnd.t;mouthOpen=false;tg.twist=0;tg.pel=0;
    if(et<.44){var lu=clamp(et/.3,0,1);tg.shL=-2.9*lu;tg.shR=-2.9*lu;tg.elL=-.3;tg.elR=-.3;tg.abdL=.15;tg.abdR=.15;tg.hipL=-.1;tg.kneeL=.15;tg.hipR=.1;tg.kneeR=.15;tg.lean=-.12*lu;tg.head=-.3*lu;tg.hy=HY+.03*lu}
    else if(et<1){tg.shL=-1.2;tg.shR=-1.2;tg.elL=-.2;tg.elR=-.2;tg.abdL=-.15;tg.abdR=-.15;tg.hipL=-.75;tg.kneeL=1.2;tg.hipR=-.2;tg.kneeR=.9;tg.lean=.5;tg.head=.05;tg.hy=HY-.2;mouthOpen=et<.7}
    else if(et<3.9){var pu=clamp((et-1)/.25,0,1);tg.shR=-3.1*pu;tg.elR=-.05;tg.abdR=.12;tg.shL=.25;tg.elL=-1.5;tg.abdL=.6;tg.hipL=-.3;tg.kneeL=.12;tg.hipR=.3;tg.kneeR=.12;tg.lean=-.1;tg.head=-.3;tg.hy=HY;mouthOpen=et<2.2}
    else{var br2=Math.sin(tm*2.1)*.5+.5;tg.shL=.05;tg.shR=.05;tg.elL=-.25;tg.elR=-.25;tg.abdL=.12;tg.abdR=.12;tg.hipL=-.08;tg.kneeL=.05;tg.hipR=.08;tg.kneeR=.05;tg.lean=br2*.02;tg.head=-.12;tg.hy=HY-br2*.012}
  }else if(P.stun>0){
    tg.hipL=-.3;tg.kneeL=.5;tg.hipR=.25;tg.kneeR=.4;tg.shL=-.6;tg.shR=-.4;tg.elL=-.3;tg.elR=-.3;
    tg.abdL=1.1;tg.abdR=1.1;tg.lean=-.3;tg.head=.25;tg.twist=0;tg.pel=0;tg.hy=HY;mouthOpen=true;
  }else if(P.cheer>0&&!air){
    tg.hipL=-.2;tg.kneeL=.3;tg.hipR=.2;tg.kneeR=.3;tg.shL=-2.7;tg.shR=-2.7;tg.elL=-.25;tg.elR=-.25;
    tg.abdL=.55;tg.abdR=.55;tg.lean=-.05;tg.head=-.15;tg.twist=Math.sin(tm*9)*.15;tg.pel=0;
    tg.hy=HY-.02+Math.abs(Math.sin(tm*9))*.07;mouthOpen=true;
  }else if(P.climb&&P.climb.rope){
    var rs=Math.sin(P.cph);
    tg.shL=-3.0+rs*.35;tg.shR=-3.0-rs*.35;tg.elL=-.12;tg.elR=-.12;tg.abdL=.12;tg.abdR=.12;
    tg.hipL=-.25+Math.sin(tm*2.6)*.22;tg.kneeL=.45;tg.hipR=-.1-Math.sin(tm*2.6)*.22;tg.kneeR=.55;tg.lean=0;tg.head=-.12;tg.twist=0;tg.pel=0;tg.hy=HY;mouthOpen=false;
  }else if(P.climb){
    var cs=Math.sin(P.cph),cc=Math.cos(P.cph);
    var cl=Math.max(0,cs),cr=Math.max(0,-cs);
    tg.shL=-2.2-cs*.8;tg.shR=-2.2+cs*.8;tg.elL=-(.75-cs*.45);tg.elR=-(.75+cs*.45);tg.abdL=-.12;tg.abdR=-.12;
    tg.hipL=-.45-cr*1.0;tg.kneeL=.5+cr*1.35;tg.hipR=-.45-cl*1.0;tg.kneeR=.5+cl*1.35;
    tg.lean=.06;tg.head=-.22;tg.twist=cs*.16;tg.pel=-cs*.1;tg.hy=HY-.02+Math.abs(cc)*.03;mouthOpen=keys.jump;
  }else if(P.crouch&&!air){
    var cw=moving?s*.28:0;
    tg.hipL=-1.2+cw;tg.kneeL=2.0;tg.hipR=-1.0-cw;tg.kneeR=1.85;
    tg.shL=-.5-cw*.5;tg.shR=-.3+cw*.5;tg.elL=-1.3;tg.elR=-1.3;tg.abdL=.3;tg.abdR=.3;
    tg.lean=.62;tg.head=-.5;tg.twist=moving?s*.1:0;tg.pel=0;tg.hy=.52;
  }else if(air&&P.inW){
    var t=P.stk===undefined?9:P.stk;P.stk=t+dt;t=P.stk;
    var shv,elv,abv,env=Math.max(0,1-t/.55);
    if(t<.09){var k=t/.09;shv=-.2-k*2.3;elv=-.3-k*.4;abv=.15+k*.25}
    else if(t<.4){var k=(t-.09)/.31,e=1-(1-k)*(1-k);shv=-2.5+e*2.75;elv=-(.7-.45*e);abv=.4-.3*e}
    else{var k=clamp((t-.4)/.35,0,1);shv=.25-k*.4;elv=-.25-k*.1;abv=.1}
    var kp=t*20,ks=Math.sin(kp)*env;
    tg.lean=.1;tg.head=-.62;
    tg.shL=shv;tg.shR=shv;tg.elL=elv;tg.elR=elv;tg.abdL=abv;tg.abdR=abv;
    tg.pel=0;tg.twist=0;
    tg.hipL=.12+ks*.4;tg.hipR=.12-ks*.4;
    tg.kneeL=.15+Math.max(0,Math.sin(kp+1.3))*.5*env;tg.kneeR=.15+Math.max(0,-Math.sin(kp+1.3))*.5*env;
    tg.hy=HY-.03;mouthOpen=false;P.breath=0;
  }else if(air){
    if(P.vy>1){
      if(P.jsq>.1){var hq=1-clamp((sp-3)/6,0,1)*.4;tg.hipL=-1.05*hq;tg.kneeL=1.8*hq;tg.hipR=-.95*hq;tg.kneeR=1.7*hq;tg.shL=.5;tg.shR=.4;tg.elL=-.5;tg.elR=-.5;tg.abdL=.25;tg.abdR=.25;tg.lean=.3*hq+.1;tg.head=-.2;tg.hy=HY-.14*hq;mouthOpen=false}else{
      tg.hipL=-.95;tg.kneeL=1.25;tg.hipR=.4;tg.kneeR=.95;tg.shL=-2.3;tg.shR=-1.5;tg.elL=-.35;tg.elR=-.5;
      tg.abdL=.25;tg.abdR=.35;tg.lean=.12;tg.head=-.1;tg.hy=HY;mouthOpen=true}
    }else{
      tg.hipL=-.55;tg.kneeL=.55;tg.hipR=.25;tg.kneeR=.7;tg.shL=-.9;tg.shR=-.6;tg.elL=-.3;tg.elR=-.3;
      tg.abdL=.85;tg.abdR=.85;tg.lean=.05;tg.head=.05;tg.hy=HY+.02;mouthOpen=P.vy<-8;
    }
    tg.twist=0;tg.pel=0;
  }else if(P.skid>0){
    tg.hipL=.55;tg.kneeL=.35;tg.hipR=-.35;tg.kneeR=.55;tg.shL=-.7;tg.shR=.5;tg.elL=-.5;tg.elR=-.5;
    tg.abdL=.45;tg.abdR=.45;tg.lean=-.28;tg.head=.12;tg.twist=0;tg.pel=0;tg.hy=HY-.05;
  }else if(moving){
    var A=lerp(.5,1.12,run),K=lerp(.55,1.55,run),AA=lerp(.5,1.35,run);
    tg.hipL=-s*A;tg.hipR=s*A;
    tg.kneeL=Math.max(0,c)*K+.08;tg.kneeR=Math.max(0,-c)*K+.08;
    tg.shL=s*AA+run*.15;tg.shR=-s*AA+run*.15;
    tg.elL=-(.45+.85*run+.3*Math.max(0,-s));tg.elR=-(.45+.85*run+.3*Math.max(0,s));
    tg.abdL=.08;tg.abdR=.08;tg.lean=.05+run*.42;tg.head=-tg.lean*.6;tg.twist=s*(.2+run*.12);tg.pel=-s*.12;
    tg.hy=HY-.03*A+Math.abs(c)*.045*(1+run);
    var si=Math.floor(ph/Math.PI);
    if(si!==P.stepIdx){P.stepIdx=si;if(sp>1.5)sfx.step();if(sp>5)emit(dustPool,P.x-P.face*.2,P.y+.05,1,1.1,.45,.4,1.2,-.3)}
  }else{
    var br=Math.sin(tm*2.1)*.5+.5;
    tg.hipL=0;tg.hipR=0;tg.kneeL=.03;tg.kneeR=.03;
    tg.shL=.04+br*.03;tg.shR=.04+br*.03;tg.elL=-.2;tg.elR=-.2;tg.abdL=.1;tg.abdR=.1;
    tg.lean=.02+br*.015;tg.head=Math.sin(tm*.9)*.05-P.look*.6;tg.twist=0;tg.pel=0;tg.hy=HY-br*.012-Math.abs(Math.sin(tm*4.2))*.0;
    P.idleT+=dt;if(P.idleT>8)P.idleT=0;
    if(P.idleT>5){tg.shL=-1.2;tg.shR=-1.0;tg.elL=-1.6;tg.elR=-1.6;tg.abdL=.4;tg.abdR=.4;tg.kneeL=.5;tg.kneeR=.5;tg.hipL=-.2;tg.hipR=.2;tg.hy=HY-.07;tg.lean=.1;tg.head=-.05+Math.sin(tm*3)*.03}
  }
  if(P.land>0){
    P.land-=dt;
    var q=Math.sin(clamp(P.land,0,.22)/.22*Math.PI);
    tg.hy-=.12*q;tg.kneeL+=.55*q;tg.kneeR+=.55*q;tg.hipL-=.35*q;tg.hipR-=.35*q;tg.lean+=.18*q;
  }
  var gwant=(P.cape&&!P.inW&&!P.grounded&&(P.flyT>0||(keys.jump&&P.vy<.5)))||P.spinT>0?1:0;
  P.glide+=(gwant-P.glide)*(1-Math.exp(-dt*10));
  var rwant=(P.cape&&!air&&moving&&sp>7.2&&!P.crouch&&P.spinT<=0)?1:0;P.csp=(P.csp||0)+(rwant-(P.csp||0))*(1-Math.exp(-dt*9));
  if(P.cape&&P.spinT>0){tg.abdL=1.45;tg.abdR=1.45;tg.shL=-.25;tg.shR=-.25;tg.lean=.08;tg.elL=-.2;tg.elR=-.2}
  else if(P.cape&&!air&&moving&&sp>7.2&&!P.crouch&&P.stun<=0){
    tg.abdL=1.3;tg.abdR=1.3;tg.shL=-.25;tg.shR=-.25;tg.elL=-.12;tg.elR=-.12;tg.lean=.55;tg.head=-.35;tg.twist=0;
  }
  else if(P.cape&&air&&P.glide>.5&&!P.climb){
    var fl=P.flyT>0?(1.28-.55*P.flapA):1.2;
    tg.lean=P.flyT>0?1.5:.95;tg.head=P.flyT>0?-1.2:-.7;tg.abdL=fl;tg.abdR=fl;tg.shL=-.35;tg.shR=-.35;tg.elL=-.05;tg.elR=-.05;
    tg.hipL=.85;tg.hipR=.7;tg.kneeL=.15;tg.kneeR=.3;tg.hy=HY-.02;tg.twist=0;mouthOpen=false;
  }
  if(P.arena&&!P.climb&&P.stun<=0&&!sumEnd){
    if(P.slashT>0){
      var A9=ATK[P.atk],su=1-P.slashT/A9.d,w9=su<.3?su/.3:1,s9=su<.3?0:(su-.3)/.7,ty=P.atk;
      if(ty==='c1'){tg.shR=su<.3?lerp(-.9,-2.9,w9):lerp(-2.9,-.2,s9);tg.elR=-.15;tg.abdR=.1;tg.twist=.35;tg.lean+=.15}
      else if(ty==='c2'){tg.shR=su<.3?lerp(-.2,.3,w9):lerp(.3,-2.6,s9);tg.elR=-.15;tg.abdR=.1;tg.twist=-.3;tg.lean+=.1}
      else if(ty==='c3'){tg.shR=-1.6;tg.elR=-.1;tg.abdR=.35;tg.twist=0;tg.lean+=.1}
      else if(ty==='thrust'){tg.shR=su<.3?-1.1:-1.55;tg.elR=su<.3?-1.6:-.05;tg.abdR=.2;tg.twist=.2;tg.lean+=.28}
      else if(ty==='low'){tg.shR=su<.3?lerp(-.3,-.4,w9):lerp(-.4,-1.55,s9);tg.elR=-.1;tg.abdR=.15;tg.twist=.25}
      else if(ty==='air'){tg.shR=su<.3?lerp(-.9,-2.8,w9):lerp(-2.8,-.3,s9);tg.elR=-.15;tg.abdR=.1;tg.twist=.3}
      else if(ty==='pogo'){tg.shR=-.05;tg.elR=-.05;tg.abdR=0;tg.shL=-.4;tg.lean+=.05}
    }
    else if(P.grounded){/* postura de luta: joelhos dobrados, corpo inclinado, katana à frente com as duas mãos */
      var bob=Math.sin(tm*4.5)*.03,ch=P.chgOn&&P.chg>.18?1:0;
      tg.shR=ch?-2.6:-1.05;tg.elR=ch?-.4:-1.1;tg.abdR=ch?.5:.35;tg.shL=ch?-2.3:-.95;tg.elL=ch?-.6:-1.25;tg.abdL=-.25;tg.twist=ch?-.35:-.2;
      if(Math.abs(P.vx)<.6){tg.hy=HY-.17+bob;tg.hipL=-.8;tg.kneeL=1.3;tg.hipR=.05;tg.kneeR=.85;tg.lean=.36;tg.head=-.2}}
    else{tg.shR=-.7;tg.elR=-.8;tg.abdR=.2}
    if(P.atk==='rise'&&P.slashT>0){var ru=1-P.slashT/ATK.rise.d;tg.shR=lerp(-.3,-3.0,Math.min(1,ru*2.5));tg.elR=-.1;tg.abdR=.15;tg.lean-=.1}
    if(P.atk==='heavy'&&P.slashT>0){tg.shR=-1.6;tg.shL=-1.4;tg.elR=-.1;tg.elL=-.2;tg.abdR=.4;tg.abdL=-.3}
  }
  if(P.shootT>0){P.shootT-=dt;if(!P.climb&&!P.crouch){tg.shR=-1.45;tg.elR=-.15;tg.abdR=.15;tg.twist=.25}}
  if(P.fire&&state==='play'&&((tm*12)|0)%4===0&&Math.random()<.5)emit(sparkPool,P.x+P.face*.1,P.y+P.h*.9,1,.7,.5,.2,0,1.5);
  if(P.jsnap){
    P.jsnap=false;var rr=clamp((sp-3)/6,0,1),cq=1-rr*.4;
    J.hy=HY-.2*cq;J.kneeL=1.9*cq;J.kneeR=1.8*cq;J.hipL=-1.1*cq;J.hipR=-1.0*cq;J.lean=.15+.3*cq+rr*.15;J.head=-.25;
    J.shL=.7;J.shR=.5;J.elL=-.5;J.elR=-.5;
  }
  if(P.mount&&!P.climb){tg.hipL=-1.05;tg.kneeL=1.25;tg.hipR=-.95;tg.kneeR=1.2;tg.hy=HY-.05;tg.lean=P.boostT>0?.55:(P.crouch?.6:.15);if(!(P.shootT>0)&&!(P.slashT>0)){tg.shL=-.5;tg.shR=-.5;tg.elL=-.9;tg.elR=-.9;tg.abdL=.2;tg.abdR=.2}}
  var kk=1-Math.exp(-dt*(air?(P.jsq>0?18:14):20)),key;
  for(key in tg)J[key]+=(tg[key]-J[key])*kk;
  var ptg=(air&&P.inW&&!P.climb&&P.stun<=0)?clamp(1.3-clamp(P.vy,-3,6)*.1,.55,1.5):0;
  P.pitch=(P.pitch||0)+(ptg-(P.pitch||0))*(1-Math.exp(-dt*7));
  rig.hips.rotation.x=P.pitch;
  if(P.mountT>0){var mk=1-P.mountT/.8,fk=clamp((mk-.12)/.66,0,1);rig.hips.rotation.x-=(fk*fk*(3-2*fk))*Math.PI*2}/* mortal para a frente */
  rig.hips.position.y=J.hy;rig.hips.rotation.y=J.pel;
  rig.torso.rotation.x=J.lean;rig.torso.rotation.y=J.twist;
  rig.head.rotation.x=J.head;
  var idle=!air&&!moving&&P.stun<=0&&P.cheer<=0&&P.look<.15;
  rig.head.rotation.y=sumEnd?0:idle?Math.sin(tm*.7)*.35:((air&&P.inW)?(P.breath||0)*1.2:0);
  rig.hipL.rotation.x=J.hipL;rig.kneeL.rotation.x=J.kneeL;rig.ankL.rotation.x=-(J.hipL+J.kneeL)*.75;
  rig.hipR.rotation.x=J.hipR;rig.kneeR.rotation.x=J.kneeR;rig.ankR.rotation.x=-(J.hipR+J.kneeR)*.75;
  rig.shL.rotation.x=J.shL;rig.shL.rotation.z=J.abdL;rig.elL.rotation.x=J.elL;
  rig.shR.rotation.x=J.shR;rig.shR.rotation.z=-J.abdR;rig.elR.rotation.x=J.elR;
  /* rosto */
  if(tm>P.nextBlink){P.blink=.13;P.nextBlink=tm+2.2+Math.random()*3}
  var by=1;if(P.blink>0){P.blink-=dt;by=.12}
  if(P.stun>0)by=.5;
  rig.eyes[0].scale.y=by;rig.eyes[1].scale.y=by;
  var wR=P.stun>0?-.01:(((air&&P.vy>1)||P.cheer>0)?.04:0),wT=P.stun>0?.62:(P.cheer>0?.42:((air&&P.vy>1)?.18:0)),kb2=1-Math.exp(-dt*16);
  BR.r+=(wR-BR.r)*kb2;BR.t+=(wT-BR.t)*kb2;
  rig.brows.forEach(function(b,k){var sd=k?1:-1;b.position.y=.3+BR.r;b.rotation.z=sd*(.3-BR.t)});
  rig.open.visible=mouthOpen;rig.smile.visible=!mouthOpen;
  /* broto e cachecol */
  rig.sprout.rotation.z=Math.sin(tm*3.2)*.06;
  rig.sprout.rotation.x=clamp(sp*.07,0,.6)+clamp(-P.vy*.025,-.3,.3)+Math.sin(tm*5)*.05;
  var tgt=clamp(sp*.075-P.vy*.03,-.4,1.3)+(sumEnd&&sumEnd.t>3.9?.85+Math.sin(tm*2.7)*.18:0),prev=0;/* no final o vento balança o cachecol */
  for(var si2=0;si2<4;si2++){
    var want=tgt*(1+.1*si2)+Math.sin(tm*8+si2)*.07*Math.min(1,sp*.2);
    P.sc[si2]+=(want-P.sc[si2])*(1-Math.exp(-dt*(16-3*si2)));
    rig.scarf[si2].rotation.x=P.sc[si2]-prev;prev=P.sc[si2];
  }
  kuroGlow(dt);
  if(rig.cape){
    rig.cape.g.visible=!!P.cape&&state!=='menu';
    if(P.cape){
      P.cspin=(P.cspin||0)+((P.spinT>0?1:0)-(P.cspin||0))*(1-Math.exp(-dt*18));
      var fly=P.flyT>0&&!P.grounded?1:0,cb=clamp(sp*.07,0,.6)+clamp(-P.vy*.04,-.3,.6)+P.glide*.1+fly*.05+P.flapA*.25+(P.csp||0)*.2+P.cspin*.95;
      for(var cs2=0;cs2<3;cs2++)rig.cape.s[cs2].rotation.x=cb*(cs2?.5:1)+Math.sin(tm*9+cs2*1.3)*(.05+.07*P.glide);
      rig.cape.g.scale.x=1+P.glide*(fly?(1.3-.3*P.flapA):.8)+(P.csp||0)*.9+P.cspin*2.0;
      if(P.capeT>0){var ck=1-P.capeT/.85,un=ck<.35?0:Math.min(1,(ck-.35)/.45),ob=un<1?1-Math.pow(1-un,3)+Math.sin(un*Math.PI)*.18:1;/* a capa surge e se desenrola */
        rig.cape.g.scale.y=Math.max(.02,ob);rig.cape.g.scale.x=Math.max(.05,ob)*(1+(1-un)*.25);for(var cs3=0;cs3<3;cs3++)rig.cape.s[cs3].rotation.x+=Math.sin(ck*24+cs3)*.35*(1-un)+(1-un)*.35}
      else rig.cape.g.scale.y=1;
    }
  }
  var yw=P.cape&&P.flyT>0&&!P.grounded?.95:(P.arena?.18:.5);/* na luta o Kuro fica de lado, encarando o Rei */
  var ty=(P.climb&&!P.climb.rope)?Math.PI:(P.face>0?Math.PI/2-yw:-Math.PI/2+yw);
  P.yaw+=(ty-P.yaw)*(1-Math.exp(-dt*14));
  if(P.cheer>0&&state==='win')P.yaw=Math.sin(tm*3)*.5;
  if(sumEnd){var et2=sumEnd.t,eyw=et2<1?Math.PI/2:(et2<3.9?.35:2.55);sumEnd.yw=sumEnd.yw===undefined?P.yaw:sumEnd.yw;sumEnd.yw+=(eyw-sumEnd.yw)*(1-Math.exp(-dt*(et2<3.9?10:3)));P.yaw=sumEnd.yw}
  if(opn&&opn.yw!==undefined){P.yaw+=(opn.yw-P.yaw)*(1-Math.exp(-dt*8))}
  rig.root.rotation.y=P.yaw;
  if(P.spinT>0)rig.root.rotation.y+=(1-P.spinT/.42)*Math.PI*4;
  else if(P.sj)rig.root.rotation.y+=P.sjA||0;/* pulo giratório */
  if(P.capeT>0){var ck2=1-P.capeT/.85;rig.root.rotation.y+=(ck2*ck2*(3-2*ck2))*Math.PI*4}
  if(P.atk==='c3'&&P.slashT>0)rig.root.rotation.y+=(1-P.slashT/ATK.c3.d)*Math.PI*2;
  if(P.atk==='heavy'&&P.slashT>0){var hu=1-P.slashT/ATK.heavy.d;rig.root.rotation.y+=(hu*hu*(3-2*hu))*Math.PI*2}
  var sy=1+(air?clamp(P.vy*.011,-.1,.16):0);
  if(P.jsq>0){P.jsq-=dt;sy-=Math.max(0,P.jsq/.17)*.12}
  if(P.land>0)sy-=Math.sin(clamp(P.land,0,.22)/.22*Math.PI)*.14;
  var sxz=1/Math.sqrt(sy);
  P.csq+=((P.crouch?.86:1)-P.csq)*(1-Math.exp(-dt*18));
  var tsz=P.big?1:.78;P.sz+=(tsz-P.sz)*(1-Math.exp(-dt*(P.growT>0?30:10)));
  var zs=P.sz+(P.growT>0?Math.sin(tm*45)*.12:0)+(P.fireT>0?Math.sin(tm*38)*.06:0);
  P.fat=P.fat||0;P.fat+=((P.big?1:0)-P.fat)*(1-Math.exp(-dt*(P.growT>0?9:6)));
  var fw=1+.14*P.fat+(P.growT>0?Math.sin(tm*30)*.05:0),tw=1+.3*P.fat;
  rig.root.scale.set(sxz*zs*fw,sy*P.csq*zs,sxz*zs*fw);
  rig.torso.scale.set(tw,1,tw);rig.head.scale.setScalar(1.18);rig.head.scale.x=1.18/tw;rig.head.scale.z=1.18/tw;
  rig.root.position.set(P.x-(P.mount?P.face*.08:0),P.y-(P.sink||0)*.8+(P.mount?seatY():0),0);
  if(typeof AU!=='undefined'&&AU&&AU.sl){rig.root.position.z=0}
  if(typeof AU!=='undefined'&&AU&&AU.lh){var F2=AU.lh.F,dxg=P.x-F2.x,onG=P.y>F2.top-.4&&Math.abs(dxg)<2.8;P.gz=(P.gz||0)+((onG?-3.2+Math.sqrt(Math.max(1,7.3-dxg*dxg)):0)-(P.gz||0))*(1-Math.exp(-dt*8));/* anda em volta da lanterna, dentro da grade */rig.root.position.z=P.gz}/* na galeria do farol o Kuro anda mais para dentro (não fica na beirada) *//* tobogã: o Kuro vai sentado dentro do tubo */
  if(P.mountT>0){var mk2=1-P.mountT/.8,ak=clamp((mk2-.1)/.72,0,1);rig.root.position.y+=Math.sin(ak*Math.PI)*1.7-(mk2<.1?(1-mk2/.1)*seatY()*0:0);rig.root.position.x-=P.face*(1-ak)*.8}/* salto até a sela */
  foxVisUpd(dt);
  if(curTheme.canyon&&!dyn)cnPose(dt);/* Mundo 20: Kuro de cabeça para baixo no teto */
  if(typeof AU!=='undefined'&&AU&&(AU.sl||AU.sin)){rig.hipL.rotation.x=rig.hipR.rotation.x=-1.45;rig.kneeL.rotation.x=rig.kneeR.rotation.x=.25;rig.root.position.y-=.05}/* tobogã: sentado, pernas para a frente */
  rig.root.visible=!(P.inv>0&&Math.floor(P.inv*14)%2===0&&state==='play');
}
var dummyO=new T.Object3D();
function visEnemy(e,dt){
  var v=e.vis;if(e.alertS&&!e.alive)e.alertS.visible=false;
  if(!v||!v.g.visible)return;
  var t=e.type;
  if(e.qS){if(e.qT>0)e.qT-=1/60;var qv=e.alive&&e.qT>0;e.qS.visible=qv;if(qv)e.qS.position.set(e.x,e.y+(t==='frog'?1.25:1.45)+Math.sin(tm*6)*.05,.4)}
  if(e.alertS){var sh=e.alive&&e.st==='alert';e.alertS.visible=sh;if(sh){var pu=.55+Math.sin(tm*25)*.06;e.alertS.scale.set(pu,pu,1);e.alertS.position.set(e.x,e.y+(t==='bat'?1.0:(t==='frog'&&!e.ninja?1.25:(t==='guard'?1.95:1.45))),.4)}}
  v.g.position.set(e.x,e.y+(t==='bat'?.27:0),0);
  if(e.alive){
    if(t==='turtle'||t==='tchase'||t==='tshell'||t==='tguard'){turtleVis(e,dt)}
    else if(t==='moth'){mothVis(e,dt)}
    else if(t==='mole'){moleVis(e,dt)}
    else if(t==='peng'){pengVis(e,dt)}
    else if(t==='sbird'){sbirdVis(e,dt)}
    else if(t==='seal'){sealVis(e,dt)}
    else if(t==='worm'){wormVis(e,dt)}
    else if(t==='jfish'){jfishVis(e,dt)}
    else if(t==='armad'){armadVis(e,dt)}
    else if(t==='owl'){owlVis(e,dt)}
    else if(t==='sprout'){sproutVis(e,dt)}
    else if(t==='bee'){beeVis(e,dt)}
    else if(t==='dfly'){dflyVis(e,dt)}
    else if(t==='wrob'){wrobVis(e,dt)}
    else if(t==='beetle'||t==='golem'){
      v.g.rotation.y=v.crab?0:(e.dir>0?Math.PI/2:-Math.PI/2);/* caranguejo anda de lado, de frente para a câmera */e.ph+=dt*(e.cur!==undefined?e.cur:e.speed)*5;
      v.legs.forEach(function(l,idx){
        var o=(idx%2)?Math.PI:0;
        l.p.rotation.x=Math.sin(e.ph+o+l.z*6)*.45;
        l.p.rotation.z=l.base+Math.max(0,Math.sin(e.ph+o+l.z*6))*.12*l.sd;
      });
      v.inner.position.y=Math.abs(Math.sin(e.ph))*.03;
    }else if(t==='urchin'){
      v.roll.rotation.z-=e.dir*dt*(e.cur!==undefined?e.cur:e.speed)/.42;
    }else if(t==='lavab'){
      var sq=e.vy>0?1.15:.9;v.inner.scale.set(1/Math.sqrt(sq),sq,1/Math.sqrt(sq));
    }else if(t==='spit'){
      v.head.rotation.y=e.dir>0?.6:-.6;var sq=e.thT>0?1.25:1+Math.sin(tm*3+e.ph)*.04;v.head.scale.set(sq,sq,sq);v.inner.rotation.z=Math.sin(tm*1.6+e.ph)*.06;
    }else if(t==='guard'){
      v.g.rotation.y=e.dir>0?Math.PI/2:-Math.PI/2;e.ph+=dt*(e.cur!==undefined?e.cur:e.speed)*3.2;
      var gs=Math.sin(e.ph);v.legs[0].rotation.x=gs*.6;v.legs[1].rotation.x=-gs*.6;v.inner.position.y=Math.abs(gs)*.04;
      v.arm.rotation.x=Math.sin(e.ph*.5)*.08;
      var red=alarmT>0||e.st!=='patrol',sus=!red&&e.sus>0;v.coneM.color.setRGB(red?1.6:(sus?1.6:1),red?.35:(sus?.8:1),red?.3:(sus?.25:1));v.lampM.emissive.setHex(red?0xff3020:0xffa040);v.glow.material.color.setHex(red?0xff4030:0xffb050);
    }else if(t==='frog'){
      v.g.rotation.y=e.dir>0?Math.PI/2:-Math.PI/2;
      if(e.ninja){v.arm.rotation.x=e.thT>0?-2.4:-.25;v.tails.rotation.y=Math.sin(tm*8+e.ph)*.4}
      var air=e.y>e.base+.02,sy=air?(e.vy>0?1.18:1.05):1-Math.max(0,e.land)*1.2;
      if(e.land>0)e.land-=dt;
      v.inner.scale.set(1/Math.sqrt(sy),sy,1/Math.sqrt(sy));
    }else if(t==='bat'){
      v.g.rotation.y=e.dir>0?Math.PI/2:-Math.PI/2;
      var hng=e.st==='hang';v.g.children[0].rotation.z=hng?Math.PI:0;if(hng)v.g.position.y=e.y+.3;/* pendurado de cabeça para baixo, asas fechadas */
      v.wings.forEach(function(w){w.p.rotation.z=hng?w.sd*-1.2:w.sd*Math.sin(tm*14+e.ph)*.8});
    }else if(t==='wbeetle'){
      v.g.rotation.y=e.dir>0?Math.PI/2:-Math.PI/2;
      v.wings.forEach(function(w){w.p.rotation.z=w.sd*(.15+Math.sin(tm*38+e.ph)*.6)});
      v.legs.forEach(function(l,idx){l.p.rotation.x=.25+Math.sin(tm*5+idx)*.12;l.p.rotation.z=l.base*1.15});
      v.inner.rotation.x=Math.sin(tm*2.2+e.ph+1.2)*.06;
    }else if(t==='jelly'){
      var jp=Math.sin(tm*3+e.ph);
      v.inner.scale.set(1+jp*.08,1-jp*.1,1+jp*.08);
      v.tent.forEach(function(q,qi){q.rotation.z=Math.sin(tm*3+qi+e.ph)*.25;q.rotation.x=Math.cos(tm*2.6+qi*1.3)*.25});
    }else if(t==='puffer'){
      v.g.rotation.y=e.dir>0?Math.PI/2:-Math.PI/2;
      var pk=1+.6*e.infl;v.inner.scale.set(pk,pk,pk);v.inner.position.y=.4*pk;
      v.spk.scale.setScalar(Math.max(.01,e.infl*e.infl));
      v.tail.rotation.y=Math.sin(tm*9+e.ph)*(.5-.35*e.infl);
    }else if(t==='fish'){
      v.g.rotation.y=e.dir>0?Math.PI/2:-Math.PI/2;
      v.tail.rotation.y=Math.sin(tm*10+e.ph)*.55;
      v.inner.rotation.z=Math.sin(tm*5+e.ph)*.05;
    }else if(t==='skel'){
      v.g.rotation.y=e.dir>0?Math.PI/2:-Math.PI/2;
      if(e.bones){
        v.body.visible=false;v.pile.visible=true;var pa=Math.min(1,(e.bAge||0)*6);v.pile.scale.set(pa,pa,pa);v.pile.position.x=e.bt<1.3?Math.sin(tm*70)*.05:0;
      }else{
        v.pile.visible=false;v.body.visible=true;var rs=e.rise>0?Math.max(.1,1-e.rise/.55):1;v.body.scale.set(1,rs,1);
        var mv=(e.cur!==undefined?e.cur:e.speed)>.2&&e.rise<=0;e.ph+=dt*(e.cur!==undefined?e.cur:e.speed)*4.4;
        var sw2=mv?Math.sin(e.ph)*.75:0;
        v.lL.hp.rotation.x=sw2;v.lR.hp.rotation.x=-sw2;v.lL.kn.rotation.x=Math.max(0,-sw2)*1.0;v.lR.kn.rotation.x=Math.max(0,sw2)*1.0;
        v.aL.sh.rotation.x=-sw2*.8;v.aR.sh.rotation.x=sw2*.5-.8;v.aR.el.rotation.x=-.7;
        v.head.rotation.z=Math.sin(tm*6+e.ph)*.04;
        v.body.position.y=mv?Math.abs(Math.sin(e.ph))*.04:0;
      }
    }else if(t==='witch'){
      var wf=state==='play'?(P.x>e.x?1:-1):e.dir;v.g.rotation.y=wf>0?Math.PI/2:-Math.PI/2;
      v.inner.position.y=Math.sin(tm*3+e.ph)*.06;v.inner.rotation.z=Math.sin(tm*2+e.ph)*.05;v.cloak.rotation.z=Math.sin(tm*4+e.ph)*.08;
      var chg=e.charging?1:0;v.orb.scale.setScalar(1+chg*(1.1+Math.sin(tm*30)*.3));v.orbM.emissiveIntensity=1.6+chg*2.6;
      if(e.appT>0){var ap=1-Math.max(0,e.appT)/.9;v.g.scale.setScalar(.2+.8*ap)}else v.g.scale.setScalar(1);
    }else if(t==='eel'){
      v.g.position.set(e.x0,e.y+.3+(e.warn?Math.sin(tm*50)*.03:0),0);
      var el=Math.max(.01,e.len);
      v.body.scale.set(1,el,1);v.body.position.x=e.edir*el/2;
      v.head.position.x=e.edir*el;v.head.scale.x=e.edir;v.head.rotation.z=Math.sin(tm*8+e.ph)*.08*e.edir;
    }
    if(e.slp>0){var wb=e.slp<1?Math.sin(tm*30)*.06:0;v.g.scale.set(1.18,.55,1.18);v.g.rotation.z=wb;e.slpV=1}else if(e.slpV){v.g.scale.set(1,1,1);v.g.rotation.z=0;e.slpV=0}/* dormindo: achatado; treme antes de acordar */
  }else{
    e.deadT+=dt;
    if(e.fling&&!e.shat){/* golpe do giro: o inimigo sai rodando para trás e só depois se parte em pedaços */
      var fg=e.fling;fg.t+=dt;fg.vy-=26*dt;var nx=e.x+fg.vx*dt,ny=e.y+fg.vy*dt,bump=false;
      for(var qi=0;qi<solids.length;qi++){var sq=solids[qi];if(sq.dead||sq.hid)continue;if(nx>sq.l&&nx<sq.r&&ny<sq.t&&ny+.6>sq.b){bump=true;break}}
      if(!bump){e.x=nx;e.y=ny}
      v.g.visible=true;v.g.position.set(e.x,e.y,0);v.g.rotation.z+=fg.sp*dt;
      if(((tm*40)|0)%2===0)emit(sparkPool,e.x,e.y+.4,1,1.2,.3,.25,.2,0);
      if(!(bump||fg.t>.55||e.y<-8))return;
      e.fling=null;v.g.rotation.z=0;try{noise(.12,.09,1500,'bandpass');noise(.2,.06,300,'lowpass')}catch(er){}
    }
    if(!e.shat){e.shat=true;shatterEnemy(e)}
    v.g.visible=false;
  }
}
function visKids(dt){
  for(var i=0;i<kids.length;i++){
    var k=kids[i],v=k.v;if(!k.on){continue}
    v.g.visible=true;v.g.position.set(k.x,k.y,0);v.g.rotation.y=k.dir>0?Math.PI/2:-Math.PI/2;
    var sc=.55*(k.dead>0?Math.max(.05,k.dead/.25):1);v.g.scale.setScalar(sc);
    k.ph+=dt*14;v.legs.forEach(function(l,idx){var o=(idx%2)?Math.PI:0;l.p.rotation.x=Math.sin(k.ph+o+l.z*6)*.5});
  }
}
function visBoss(dt){
  var b=boss;if(!b)return;visKids(dt);
  if(b.mine){mnBossVis(dt);return}
  var v=b.vis,st=b.state;
  if(st==='wait'){v.g.position.set(b.x,b.top,0);v.g.rotation.y=-Math.PI/2;return}
  if(!v.g.visible)return;
  var rcx=0;
  if(b.recoil>0){b.recoil=Math.max(0,b.recoil-dt);var ru=b.recoil/.28;rcx=(b.rdir||1)*.5*Math.sin(ru*Math.PI)}
  if(b.flash>0){b.flash=Math.max(0,b.flash-dt);var fi=b.flash/.16*.95;v.shellM.emissive.setHex(0xffffff);v.shellM.emissiveIntensity=fi;v.legM.emissive.setHex(0xffffff);v.legM.emissiveIntensity=fi}
  else if(v.shellM.emissiveIntensity>0){v.shellM.emissiveIntensity=0;v.legM.emissiveIntensity=0}
  if(st!=='dead'&&b.max-b.hp>=2){b.drip-=dt;if(b.drip<=0){b.drip=.3+Math.random()*.25;emit(bloodPool,b.x+(Math.random()-.5)*.9,b.top+b.h*.55,1,.8,.7,.26,0,16)}}
  v.g.position.set(b.x+rcx,b.top,0);v.g.rotation.y=b.dir>0?Math.PI/2:-Math.PI/2;
  b.stars.visible=(st==='stun');if(st==='stun')b.stars.rotation.y+=dt*4;
  b.ph+=dt*(st==='charge'?16:(st==='idle'?5:0));
  v.legs.forEach(function(l,idx){var o=(idx%2)?Math.PI:0;l.p.rotation.x=Math.sin(b.ph+o+l.z*6)*.5});
  v.inner.position.x=st==='idle'?Math.sin(tm*45)*.03:0;
  if(st==='dead'){v.inner.scale.set(1+b.deadT*.4,Math.max(.02,1-b.deadT*.9),1+b.deadT*.4)}
  else{var pulse=st==='hurt'?1+Math.sin(tm*40)*.06:1;v.inner.scale.set(pulse,pulse,pulse);v.inner.rotation.z=st==='stun'?Math.sin(tm*6)*.08:0}
  if(st!=='dead'){
    v.g.position.y=b.top+(b.yy||0);
    if(b.recoil>0){var sq=Math.sin(b.recoil/.28*Math.PI)*.16;v.inner.scale.set(1+sq,1-sq*1.2,1+sq)}
    var rear=0;if(st==='spit')rear=Math.min(1,(1.0-b.t)/.35)*(b.t>.3?1:Math.max(0,b.t/.3));
    v.inner.rotation.x=-.5*rear;
    if(st==='jump'){
      if(b.jt<0){var q=clamp(1+b.jt/.4,0,1);v.inner.scale.set(1+.1*q,1-.28*q,1+.1*q)}
      else v.inner.scale.set(.95,1.1,.95);
    }
  }
  if(bossShadow){
    if(st==='jump'&&b.jt>=0){var ju2=Math.min(1,b.jt/b.jd);bossShadow.visible=true;bossShadow.position.set(b.jx1,b.top+.04,0);var r=1.1+ju2*.9;bossShadow.scale.set(r*1.3,r,r);bossShadow.material.opacity=.2+ju2*.45}
    else if(st==='dive'&&(b.yy||0)>.3){bossShadow.visible=true;bossShadow.position.set(b.x,b.top+.04,0);var r2=1.2+(b.yy/5.6)*1.2;bossShadow.scale.set(r2*1.3,r2,r2);bossShadow.material.opacity=.55-(b.yy/5.6)*.25}
    else bossShadow.visible=false;
  }
}
function animate(dt){
  tm+=dt;if(sumEnd)updEnding(dt);if(opn)updOpening(dt);
  updDebris(dt);updPopCoins(dt);updDropCoins(dt);updWind(dt);updWaterFx(dt);updBubFx(dt);if(curTheme.name==='castle')updCastleFx(dt);
  pose(dt);
  if(dyn)updDeath(dt);else if(fadeIn>0){fadeIn-=dt;$('fade').style.opacity=clamp(fadeIn/.45,0,1)}
  updSandWave();
  bubble.visible=!!P.shield&&state!=='menu';bubble.position.set(P.x,P.y+.95*P.sz,0);var bs=(1+Math.sin(tm*5)*.03)*(.55+.45*P.sz);bubble.scale.set(bs,bs*1.1,bs);
  if(coinMesh){
    for(var i=0;i<coins.length;i++){
      var c=coins[i],sc=1;
      if(c.got){
        if(c.pop>0){c.pop+=dt;sc=c.pop<.2?1+c.pop*4:Math.max(0,1-(c.pop-.2)*6);if(c.pop>.37){c.pop=-1;sc=0}}
        else sc=0;
      }
      dummyO.position.set(c.x,c.y+Math.sin(tm*2+i)*.06+(c.got&&c.pop>0?c.pop*2:0),0);
      dummyO.rotation.set(0,tm*2.6+i*.6,0);
      dummyO.scale.set(sc,sc,sc);dummyO.updateMatrix();coinMesh.setMatrixAt(i,dummyO.matrix);
    }
    coinMesh.instanceMatrix.needsUpdate=true;
  }
  items.forEach(function(it){
    if(it.got)return;
    if(it.drift){it.mesh.position.x=it.x;it.mesh.rotation.z=Math.cos(it.t*2.3)*.7}
    var off=0,sc=1;
    if(it.pop!==undefined&&it.pop<.4){it.pop+=dt;var kk=Math.min(1,it.pop/.4);off=-(1-kk)*1.0;sc=.2+.8*kk}
    it.mesh.position.y=it.y+Math.sin(tm*2.6+it.x)*.1+off;it.mesh.scale.set(sc,sc,sc);
    it.mesh.rotation.y=tm*(it.type==='core'?1.4:2.4);
  });
  blocks.forEach(function(b){if(b.bump>0){b.bump+=dt;var kb=b.bump/.2;if(kb>=1){b.bump=0;b.mesh.position.y=b.y+.5}else b.mesh.position.y=b.y+.5+Math.sin(kb*Math.PI)*.22}});
  vines.forEach(function(v){
    v.stem.scale.y=Math.max(.01,v.len);v.stem.rotation.z=Math.sin(tm*1.4)*.015;
    v.leaves.forEach(function(l){
      var vis=v.len>l.h;l.m.visible=vis;
      if(vis){var q=Math.min(1,(v.len-l.h)*2);l.m.scale.set(q,q,q);l.m.position.set(l.side*.2,l.h,0);l.m.rotation.z=l.side*(.5+Math.sin(tm*2+l.h)*.12)}
    });
  });
  pipes.forEach(function(p){if(p.pulse>0&&p.rim){p.pulse=Math.max(0,p.pulse-dt);var pk=Math.sin(p.pulse/.3*Math.PI)*.3;p.rim.scale.set(1+pk,1-pk*.5,1+pk)}else if(p.rim&&p.rim.scale.x!==1)p.rim.scale.set(1,1,1);if(p.arrow){p.arrow.visible=Math.abs(P.x-p.x)<3&&state==='play'&&!P.warp;p.arrow.position.y=p.top+1+Math.sin(tm*4)*.1}});
  enemies.forEach(function(e){visEnemy(e,dt)});
  visBoss(dt);
  blades.forEach(function(b){
    if(b.kind==='saw'){b.g.position.set(b.cx,b.cy,0);b.g.rotation.z-=dt*10}
    else{b.g.rotation.z=b.ang;b.head.rotation.z=-b.ang+tm*6}
  });
  springs.forEach(function(s){
    if(s.sq>0)s.sq-=dt;
    var q=Math.max(0,s.sq)/.35;
    s.pad.position.y=.42-.2*q+(s.sq>0?Math.sin((1-q)*Math.PI)*.12:0);
    s.coil.scale.y=1-.45*q;
  });
  if(flag.geo){
    var p=flag.geo.attributes.position,b=flag.base;
    for(var j=0;j<p.count;j++){
      var bx=b[j*3]+1.05;
      p.setZ(j,Math.sin(bx*3.2-tm*5)*.09*bx+Math.sin(b[j*3+1]*4-tm*3)*.02*bx);
    }
    p.needsUpdate=true;
  }
  if(farG)farG.children.forEach(function(o){if(o.userData.drift)o.position.x+=o.userData.drift*dt});
  if(snowPts.visible){
    var sp2=snowPts.geometry.attributes.position,a=sp2.array;
    for(var k=0;k<a.length;k+=3){
      if(curTheme.sandFx){a[k+1]-=(.2+(k%5)*.05)*dt;a[k]+=(3.2+Math.sin(tm+k)*.8)*dt}else if(curTheme.ash){a[k+1]-=(.25+(k%5)*.08)*dt;a[k]+=(Math.sin(tm*.8+k)*.5+.3)*dt}else if(curTheme.petal){a[k+1]-=(.45+(k%5)*.12)*dt;a[k]+=(Math.sin(tm*1.3+k)*.9+.5)*dt}else{a[k+1]-=(1.4+(k%5)*.3)*dt;a[k]+=(Math.sin(tm+k)*.3+.7)*dt}
      if(a[k+1]<-6)a[k+1]=14;if(a[k]>22)a[k]=-22;
    }
    sp2.needsUpdate=true;
  }
  updFx(dt);
  updateCamera(dt,false);
}
/* borda esquerda que a câmera mostra quando está no começo da fase (na altura do chão) */
function viewLeft(){var cm=(LV&&LV.camMin!==undefined)?LV.camMin:7,hw=cam.dist*((LV&&LV.zoom)||1)*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.aspect;return cm-hw}
function updateCamera(dt,snap){
  var tx=clamp(P.x+P.face*.8+clamp(P.vx*.36,-3.6,3.6),(LV&&LV.camMin!==undefined)?LV.camMin:7,LV?LV.camMax:186),ty=((LV&&LV.tall)?Math.max(2.4,P.y+1.7):Math.max(2.4,2.6+P.y*.66))+P.look*1.0;
  if(LV&&LV.canyon){var Ac=LV.canyon.A;ty=Ac+(P.y+P.h/2-Ac)*.25+.4+P.look}/* Cânion Invertido: a câmera mostra o chão e o teto juntos (não gira) */
  if(LV&&LV.rooms){for(var ri=0;ri<LV.rooms.length;ri++){var rm=LV.rooms[ri];if(P.x>rm.a){var hw=cam.dist*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.aspect,lo=rm.l+hw,hi=rm.r-hw;if(lo>hi)lo=hi=(rm.l+rm.r)/2;tx=clamp(P.x,lo,hi);ty=2.6;break}}}
  if(volEsc&&volEsc.on){var ehw=cam.dist*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.aspect;tx=Math.min(LV.camMax,Math.max(tx,volEsc.wx+ehw-3))}
  if(LV&&LV.boss&&!(boss&&boss.v2&&boss.state==='dead')){var bhw=cam.dist*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.aspect;tx=Math.min(tx,LV.boss.arena[1]+.4-bhw)}
  var zArena=(LV&&LV.boss&&LV.boss.v2&&P.arena&&boss&&boss.state!=='dead')?1.2:(sumEnd?sumEnd.zoom:(opn?opn.zoom:1));var wkL=typeof WK!=='undefined'&&WK&&WK.camLock!=null&&curTheme.wreck;if(wkL)zArena=1.55;/* luta do Mundo 19: câmera afasta para mostrar o convés inteiro */cam.zk=(cam.zk||1)+(zArena-(cam.zk||1))*(snap?1:1-Math.exp(-dt*2));
  if(wkL){tx=WK.camLock;ty=LV.captain.deck+2.6}
  else if(zArena>1&&!opn){var hw2=cam.dist*cam.zk*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.aspect;tx=clamp((P.x+boss.x)/2,P.x-hw2+2.5,P.x+hw2-2.5);tx=clamp(tx,LV.boss.arena[0]-.4+hw2,LV.boss.arena[1]+.4-hw2);ty=LV.boss.top+3.2}/* luta no Cume: a câmera abre e mostra o Kuro e o Rei juntos */
  if(cfgView){tx=cfgView.x;ty=cfgView.y}
  if(sumEnd){tx=sumEnd.cx;ty=sumEnd.cy}
  if(opn){tx=opn.cx;ty=opn.cy}
  var kx=snap?1:1-Math.exp(-dt*4.6),ky=snap?1:1-Math.exp(-dt*((LV&&LV.tall)?5:2.6));
  cam.x+=(tx-cam.x)*kx;cam.y+=(ty-cam.y)*ky;
  var sx=0,sy=0;
  if(shake>0){shake-=dt;sx=(Math.random()-.5)*shake*.5;sy=(Math.random()-.5)*shake*.5}
  /* câmera cinemática (escolha nas configurações): gira ~6° para o lado em que o Kuro vai, fica mais baixa e perto, respira parada e recua ao correr/cair */
  var cine=cfg.cam==='cine'&&!opn&&!sumEnd&&!cfgView&&!(zArena>1)&&!(LV&&LV.theme===7),ck=snap?1:1-Math.exp(-dt*1.3);
  cam.ck=(cam.ck||0)+((cine?1:0)-(cam.ck||0))*(snap?1:1-Math.exp(-dt*2.5));
  var spd=Math.min(1,Math.abs(P.vx)/9+Math.max(0,-P.vy)/22);cam.rk=(cam.rk||0)+(spd-(cam.rk||0))*(snap?1:1-Math.exp(-dt*1.6));
  cam.yw=(cam.yw||0)+((P.face||1)*.11-(cam.yw||0))*ck;/* ~6° (dono pediu menos) */
  var cw=cam.ck,br=Math.sin(tm*.55)*(1-cam.rk),yaw=cw*(cam.yw+br*.018),D=cam.dist*((LV&&LV.zoom)||1)*(cam.zk||1)*(1-cw*.12+cw*.14*cam.rk),hY=1.3-cw*.55+cw*br*.06;
  camera.position.set(cam.x+sx+Math.sin(yaw)*D,cam.y+hY+sy,Math.cos(yaw)*D);
  camera.lookAt(cam.x,cam.y-.2+cw*.15,0);
  var so=curTheme.sunOff;
  sun.position.set(cam.x+so[0],so[1],so[2]);sun.target.position.set(cam.x,0,0);sun.target.updateMatrixWorld();
  lantern.position.set(P.x,P.y+1.8,2.6);
  if(farG)farG.position.x=cam.x*.92;
  snowPts.position.set(cam.x,cam.y,4);
}
