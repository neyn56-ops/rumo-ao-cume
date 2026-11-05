/*@@parte:40_estado.js*/
/* ===================== estado do jogo ===================== */
var P={look:0,flapA:0,cape:false,pm:0,flyT:0,glide:0,spinT:0,spinCd:0,jsq:0,jsnap:false,fire:false,fcd:0,shootT:0,runT:0,x:0,y:0,vx:0,vy:0,w:.6,h:1.35,face:1,grounded:false,onPlat:null,coyote:0,jbuf:0,inv:0,stun:0,prevY:0,phase:0,land:0,airVy:0,yaw:Math.PI/2,stepIdx:0,feather:0,dj:false,noCut:0,cheer:0,nextBlink:2,blink:0,cph:0,climb:null,warp:null,vineCd:0,shield:false,idleT:0,pipeT:0,skid:0,big:false,crouch:false,sz:.78,csq:1,growT:0,sc:[0,0,0,0],inW:false,hd:false,air:1,swimCd:0,tapCd:0,drownT:.4};
var TLIM=300,timeLeft=300,lowWarn=false,clkIn=false;
function hd(a,b){return (LV&&LV.hard)?b:a}
var state='menu',hearts=3,coinsGot=0,gemsGot=0,bank=0,timeT=0,mt=0,tm=0,shake=0,respawn={x:2,y:0};
var keys={left:false,right:false,jump:false,run:false,down:false,up:false,jx:0,jy:0};
var save={unlocked:1,gems:[0,0,0,0],best:[0,0,0,0],coins:[0,0,0,0]};
try{var sv=JSON.parse(localStorage.getItem('rumo-ao-cume-v2'));if(sv&&sv.unlocked)save=sv}catch(e){}
['gems','best','coins'].forEach(function(k){if(!Array.isArray(save[k]))save[k]=[];while(save[k].length<LEVELS.length)save[k].push(0)});
if(save.best[2]>0&&save.unlocked<4)save.unlocked=4;
if(save.best[3]>0&&save.unlocked<5)save.unlocked=5;
if(save.best[4]>0&&save.unlocked<6&&LEVELS.length>5)save.unlocked=6;
if(save.best[5]>0&&save.unlocked<7&&LEVELS.length>6)save.unlocked=7;
if(save.best[6]>0&&save.unlocked<8&&LEVELS.length>7)save.unlocked=8;
if(save.best[7]>0&&save.unlocked<9&&LEVELS.length>8)save.unlocked=9;
if(save.best[8]>0&&save.unlocked<10&&LEVELS.length>9)save.unlocked=10;
/* TESTE: todas as fases liberadas enquanto o jogo está em construção (trocar para false quando o jogo estiver pronto) */
var TESTE_LIBERADO=true;if(TESTE_LIBERADO)save.unlocked=Math.max(save.unlocked,LEVELS.length);
function writeSave(){try{localStorage.setItem('rumo-ao-cume-v2',JSON.stringify(save))}catch(e){}}

function fmt(t){var m=Math.floor(t/60),s=Math.floor(t%60);return m+':'+(s<10?'0':'')+s}
function setHearts(){
  var n=Math.max(3,Math.min(5,hearts)),h='';/* na tela: no máximo 5 corações; o que passar aparece como +N */
  for(var i=0;i<n;i++)h+='<svg class="heart'+(i<hearts?'':' off')+'" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 2.8 4.5 6.4 4.5c2 0 3.6 1.1 5.6 3.3 2-2.2 3.6-3.3 5.6-3.3 3.6 0 5.5 3.8 4 7.3C19.5 16.4 12 21 12 21z"/></svg>';
  if(hearts>5)h+='<b class="hplus">+'+(hearts-5)+'</b>';
  $('hearts').innerHTML=h;
}
function giveLife(msg){
  /* vida de prêmio (moedas/cristais): até 5 normalmente; se já estiver cheio, sobe para 6 só neste caso */
  hearts++;/* sem limite: passa de 5 e continua somando */
  setHearts();sfx.heart();toast(msg);
  try{emit(sparkPool,P.x,P.y+1,14,3.4,.8,.4,.3,3)}catch(e){}
}
function addCoin(){
  coinsGot++;bank++;
  if(bank>=100){bank-=100;giveLife('100 moedas! +1 vida')}
  $('coinN').textContent=bank;
}
function toast(msg){
  var t=$('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toast.k);toast.k=setTimeout(function(){t.classList.remove('show')},2300);
}
function spawn(pt){
  if(LV&&LV.kites)sumMechReset();
  if(volEsc&&volEsc.on){volEsc.on=false;volEsc.wall.visible=false;volEsc.gl.visible=false}/* renasceu: a parede recomeça um pouco atrás dele */
  if(fox&&fox.state==='ride'&&fox.vis){if(W)W.remove(fox.vis.g);fox=null}P.mount=false;P.boostT=0;P.lastDryX=undefined;
  P.x=pt.x;P.y=pt.y;P.vx=P.vy=0;P.crouch=false;P.sz=P.big?1:.78;P.h=P.big?1.8:1.35;P.growT=0;P.grounded=false;P.onPlat=null;P.inv=2;P.stun=0;P.face=1;P.land=0;P.dj=false;P.air=1;P.drownT=.4;P.inW=false;P.hd=false;P.swimCd=0;P.tapCd=0;
  updateCamera(0,true);
}
function resetState(){
  hearts=Math.max(3,(save.hearts|0)||3);coinsGot=0;gemsGot=0;bank=(save.bank|0)%100;timeT=0;TLIM=(LV&&LV.limit)||300;timeLeft=TLIM;clkIn=false;lowWarn=false;mt=0;P.feather=0;P.cheer=0;P.shield=false;P.big=false;setFire(false);setCape(false);
  /* poderes que o Kuro trouxe da fase anterior */
  if(carryNow){if(carryNow.big||carryNow.cape||carryNow.fire)P.big=true;if(carryNow.cape)setCape(true);else if(carryNow.fire)setFire(true);if(carryNow.shield)P.shield=true}
  fbClear();P.climb=null;P.warp=null;P.vineCd=0;P.pipeT=0;$('fade').style.opacity=0;
  $('featherStat').hidden=true;$('bossBar').hidden=true;
  coins.forEach(function(c){c.got=false;c.pop=0});
  items.forEach(function(it){it.got=false;it.mesh.visible=true});
  enemies.forEach(function(e){if(e.bub)bubPop(e,false);if(e.type==='moth'){e.ri=0;e.sit=0}if(e.type==='peng'||e.type==='seal'){e.mt=0;e.pop=0;e.slide=0;e.thr=0}if(e.type==='sbird'){e.st2='fly';e.y=e.hy;e.x=(e.x0+e.x1)/2;e.cool=1}if(e.type==='mole'){e.mt=0;e.pop=0;e.pop0=0;e.moved=false;e.h=.95}if(e.type==='owl'){e.st2='perch';e.x=e.hx;e.y=e.hy;e.cool=0;e.zz=0}if(e.type==='armad'){e.st2='bur';e.at=0;e.x=e.hx0}if(e.type==='sprout'){e.pr=e.ph;e.len=0}if(e.type==='worm'||e.type==='jfish'){e.mt=-(e.ph0||0);e.out=0;e.zz=0;e.dir=1;e.x=e.x0}if(e.type==='bee'){e.ch=0;e.cy=e.by;e.px=(e.x0+e.x1)/2;e.x=e.px}if(e.type==='wrob'){e.off=0;e.safe=false}if(e.type==='tguard'){e.wings=true;e.vy=0;e.st='patrol';e.shellT=0}if(e.t0&&e.type!==e.t0){e.type=e.t0;e.nw=false;if(e.vis.wings)e.vis.wings.forEach(function(w){w.p.visible=true})}e.alive=true;e.shat=false;e.fling=null;e.deadT=0;e.ignT=0;e.qT=0;e.wX=undefined;e.x=e.sx;e.base=e.by;e.y=e.base;e.fg=true;e.grounded=false;e.dir=1;e.vy=0;e.vx=0;e.vis.g.visible=true;e.vis.g.rotation.z=0;if(e.vis.inner)e.vis.inner.scale.set(1,1,1);e.st='patrol';e.tmr=0;e.infl=0;e.alertT=0;e.loseT=0;e.cur=e.speed;if(e.alertS)e.alertS.visible=false;e.bones=false;e.rise=0;e.appT=0;e.noHit=false;if(e.trig!==undefined){e.dorm=true;e.noHit=true;e.vis.g.visible=false;e.fireT=1.2;e.charging=false}if(e.type==='skel'&&e.vis.body){e.vis.body.visible=true;e.vis.pile.visible=false;e.vis.body.scale.set(1,1,1)}if(e.type==='witch'){e.vis.g.scale.setScalar(1)}});
  checkpoints.forEach(function(c){c.lit=false;c.mat.emissiveIntensity=0});
  crumbles.forEach(function(c){c.state=0;c.dead=false;c.mesh.position.set(c.cx,c.baseY,0);c.mesh.scale.set(1,1,1)});
  if(typeof fallsReset==='function'&&curTheme.falls)fallsReset();
  if(LV&&LV.maze&&typeof mzReset==='function')mzReset();
  if(curTheme.aurora&&typeof aurReset==='function')aurReset();
  if(curTheme.wreck&&typeof wkReset==='function')wkReset();
  resetBoss();resetDrops();P.swimToast=false;$('airStat').hidden=true;airBubs.forEach(function(b){b.on=true;b.cd=0;b.mesh.visible=true});
  respawn={x:LV.start.x,y:LV.start.y};placeEnemies(respawn.x);
  setHearts();$('coinN').textContent=bank;$('gemN').textContent='0';$('timeN').textContent='0:00';
  movers.forEach(function(m){m.x=m.px=m.cx;m.l=m.x-m.w/2;m.r=m.x+m.w/2;m.mesh.position.x=m.x});
  resetShots();resetDoor();
  spawn(respawn);P.sink=0;sandS.on=false;if(LV.sand){sandS.y=LV.sand.y0;if(sandS.mesh)sandS.mesh.position.y=sandS.y}
}
var primaryFn=null,secondaryFn=null;
function showCard(c){
  card.hidden=false;
  $('cardKicker').textContent=c.kicker||'';
  $('cardTitle').textContent=c.title;
  $('cardText').textContent=c.text||'';
  var s=$('cardStats');if(c.stats){s.innerHTML=c.stats;s.hidden=false}else s.hidden=true;
  var w=$('worlds');if(c.worlds){buildWorlds();w.hidden=false}else w.hidden=true;
  var pb=$('playBtn');pb.textContent=c.primary.label;primaryFn=c.primary.fn;pb.hidden=false;
  var mb=$('mapBtn');if(c.secondary){mb.textContent=c.secondary.label;secondaryFn=c.secondary.fn;mb.hidden=false}else mb.hidden=true;
  $('hint').hidden=!c.hint;
  $('cfgBtn').hidden=!c.menu;var ob=$('openBtn');if(ob)ob.hidden=!c.menu;
}
function buildWorlds(){
  var w=$('worlds');w.innerHTML='';
  LEVELS.forEach(function(L,i){
    var b=document.createElement('button');b.type='button';b.className='wbtn';
    var open=i<save.unlocked;b.disabled=!open;
    b.innerHTML='<small>Mundo '+(i+1)+'</small><b>'+L.name+'</b><span>'+(open?'Cristais '+(save.gems[i]||0)+'/3':'Bloqueado')+'</span>';
    b.addEventListener('click',function(){startLevel(i)});
    w.appendChild(b);
  });
}
function showMenu(){
  state='menu';
  showCard({kicker:'Aventura em '+LEVELS.length+' mundos',title:'Rumo ao Cume',text:STORY.intro,worlds:false,menu:true,hint:true,
    secondary:{label:'Mapa',fn:function(){openMap()}},
    primary:{label:save.unlocked>1?'Continuar':'Jogar',fn:function(){startLevel(Math.min(save.unlocked,LEVELS.length)-1)}}});
}
var carryNow=null;
function startLevel(i){
  if(i===0&&!save.seenOpen&&!opn&&!window.__noOpen){playOpening(function(){startLevel(0)});return}/* primeira vez no Mundo 1: o clipe do roubo do Coração de Cristal */
  initAudio();cpSave[i]=null;trIntroDone=false;prePast[i]=false;
  carryNow=(i>0&&save.carryFor===i&&save.carry)?save.carry:null;
  buildLevel(i);resetState();
  state='intro';
  var s=STORY.worlds[i];
  showCard({kicker:s.kicker,title:s.title,text:s.text,hint:i===0,primary:{label:'Começar',fn:beginPlay},secondary:{label:'Mapa',fn:function(){openMap({from:i})}}});
}
function beginPlay(){card.hidden=true;state='play';fpsAcc=0;fpsN=0;if(carryNow&&(carryNow.big||carryNow.cape||carryNow.fire||carryNow.shield))toast('Poderes mantidos da fase anterior')}
function retry(){
  carryNow=null;
  buildLevel(levelIdx);resetState();
  var cs=cpSave[levelIdx];
  if(LV.keepCp&&cs){respawn={x:cs.x,y:cs.y};spawn(respawn);checkpoints.forEach(function(c){if(c.x<=cs.x+.1){c.lit=true;c.mat.emissiveIntensity=2.2}});placeEnemies(cs.x)}
  card.hidden=true;state='play';fpsAcc=0;fpsN=0;
}
function stats(extra){
  return '<li><small>Moedas</small>'+coinsGot+' / '+(coins.length+extraCoins)+'</li><li><small>Cristais</small>'+gemsGot+' / 3</li><li><small>Tempo</small>'+fmt(timeT)+'</li>'+(extra||'');
}
function lose(ttl,txt){
  state='dead';sfx.lose();
  /* morreu: perde os poderes trazidos da fase anterior */
  carryNow=null;save.carry=null;save.carryFor=-1;save.hearts=3;/* perdeu tudo: volta para 3 corações */writeSave();
  if(typeof prePast!=='undefined')prePast[levelIdx]=false;/* mundo com superfície (Mina): perdeu tudo = recomeça lá em cima, no começo da fase */
  showCard({kicker:'Quase lá!',title:ttl||'Kuro caiu',text:txt||'Os inimigos levaram a melhor, mas o Kuro nunca desiste. Vamos de novo?',stats:stats(),primary:{label:'Tentar de novo',fn:retry},secondary:{label:'Mapa',fn:function(){openMap({from:levelIdx})}}});
}
function recordLevel(){
  var i=levelIdx;
  save.gems[i]=Math.max(save.gems[i]||0,gemsGot);
  save.coins[i]=Math.max(save.coins[i]||0,coinsGot);
  save.bank=bank;save.hearts=Math.max(1,hearts);/* os corações passam para a próxima fase */
  if(!save.best[i]||timeT<save.best[i])save.best[i]=timeT;
  save.unlocked=Math.max(save.unlocked,Math.min(LEVELS.length,i+2));
  writeSave();
}
function scoreLis(){
  var tl=Math.max(0,Math.floor(timeLeft)),bn=tl*10,pts=coinsGot*100+gemsGot*500+bn;
  return '<li><small>Tempo restante</small>'+fmt(tl)+'</li><li><small>Bônus de tempo</small>+'+bn+'</li><li><small>Pontos</small>'+pts+'</li>';
}
function winLevel(){
  state='win';sfx.win();P.cheer=3;
  save.carry={big:!!P.big,fire:!!P.fire,cape:!!P.cape,shield:!!P.shield};save.carryFor=levelIdx+1;
  recordLevel();
  /* fases com chefe não têm bandeira: festa em volta do Kuro (antes isso travava o jogo ao vencer o Rei) */
  if(LV.goal)emit(sparkPool,LV.goal.x,LV.goal.top+3,40,6,1.4,.5,.5,5);else emit(sparkPool,P.x,P.y+2,40,6,1.4,.5,.5,5);
  var s=STORY.worlds[levelIdx];
  showCard({kicker:'Mundo concluído',title:s.title,text:s.end,stats:stats(scoreLis()+(save.best[levelIdx]?'<li><small>Melhor tempo</small>'+fmt(save.best[levelIdx])+'</li>':'')),
    primary:{label:'Continuar',fn:function(){openMap({from:levelIdx,walkTo:levelIdx+1})}},secondary:{label:'Menu',fn:showMenu}});
}
function winGame(){
  if(LV&&LV.boss&&LV.boss.v2&&!sumEnd){cumeEnding();return}/* Cume: cena final antes do cartão */
  state='win';sfx.win();P.cheer=6;recordLevel();
  emit(sparkPool,P.x,P.y+2,60,7,1.6,.6,.5,4);
  showCard({kicker:'Fim da aventura',title:'Kuro salvou a vila',text:STORY.worlds[levelIdx].end,stats:stats(scoreLis()),
    primary:{label:'Jogar de novo',fn:function(){startLevel(0)}},secondary:{label:'Mapa',fn:function(){openMap({from:levelIdx})}}});
}
var debris=[],debrisG=null;
function spawnDebris(x,y){
  if(!debrisG)debrisG=new T.BoxGeometry(.24,.17,.24);
  for(var i=0;i<7;i++){
    var m=mesh(debrisG,brickM,true,false),sc=.7+Math.random()*.7;
    m.scale.set(sc,sc,sc);m.position.set(x+(Math.random()-.5)*.6,y+(Math.random()-.5)*.5,(Math.random()-.5)*.3);add(m);
    var sd=i%2?1:-1;
    debris.push({m:m,x:m.position.x,y:m.position.y,z:m.position.z,vx:sd*(1+Math.random()*3.2),vy:5+Math.random()*5,rx:(Math.random()-.5)*14,rz:(Math.random()-.5)*14,t:0,rest:false,sc:sc});
  }
}
var eMats={},eGeo=null;
function shatterEnemy(e){
  if(!eGeo)eGeo={s:new T.SphereGeometry(.13,10,8),b:new T.BoxGeometry(.22,.15,.22),l:new T.BoxGeometry(.05,.05,.28)};
  var cf={beetle:[0x55606b,0x2a2f35,0xff7a2a],frog:[0x4fb23a,0x2f7a2a,0xffe08a],bat:[0x4a3a72,0x2a2144,0xff5a5a],urchin:[0x3c424c,0x1f2329,0xffa040],wbeetle:[0x7a4aa8,0x2a2144,0xaee8ff],jelly:[0xd778e8,0x6a2a8a,0xffd0ff],puffer:[0xf2b038,0x8a5a1a,0xfff0a0],fish:[0x2f9fe0,0x1a4a7a,0xffb040],eel:[0x6b7d2e,0x2a3510,0xff5a3a]}[e.type]||[0x666666,0x333333,0xffaa33];
  var mm=eMats[e.type];
  if(!mm)mm=eMats[e.type]=[new T.MeshStandardMaterial({color:cf[0],roughness:.5,metalness:.2}),new T.MeshStandardMaterial({color:cf[1],roughness:.7}),new T.MeshStandardMaterial({color:cf[2],roughness:.4,emissive:cf[2],emissiveIntensity:1.2})];
  var defs=[['s',0,1.5],['s',0,1.2],['s',0,1.0],['b',0,1.3],['b',0,1.0],['l',1,1.2],['l',1,1],['l',1,.9],['s',2,.55]];
  var cy=e.y+e.h*.5;
  for(var i=0;i<defs.length;i++){
    var df=defs[i],m=mesh(eGeo[df[0]],mm[df[1]],true,false),sc=df[2]*1.45*(e.type==='urchin'?1.1:1);
    m.scale.set(sc,sc,sc);m.position.set(e.x+(Math.random()-.5)*.5,cy+(Math.random()-.5)*.3,(Math.random()-.5)*.3);add(m);
    var sd=i%2?1:-1;
    debris.push({m:m,x:m.position.x,y:m.position.y,z:m.position.z,vx:sd*(.8+Math.random()*3),vy:3.5+Math.random()*5,rx:(Math.random()-.5)*16,rz:(Math.random()-.5)*16,t:0,rest:false,sc:sc});
  }
  emit(dustPool,e.x,cy,6,2.2,.5,.5,1.2,-.3);
}
function updDebris(dt){
  for(var i=debris.length-1;i>=0;i--){
    var d=debris[i];d.t+=dt;
    if(d.rest&&d.on&&(d.on.dead||d.on.hid))d.rest=false;/* o apoio quebrou (tijolo): o pedaço volta a cair */
    if(!d.rest){
      d.vy-=32*dt;var py=d.y;d.x+=d.vx*dt;d.y+=d.vy*dt;
      for(var k=0;k<solids.length;k++){
        var q=solids[k];if(q.dead||q.hid||q.wall)continue;
        if(d.x>q.l&&d.x<q.r&&d.vy<=0&&py>=q.t+.05&&d.y<q.t+.09){
          d.y=q.t+.09;
          if(d.vy<-2.5){d.vy=-d.vy*.32;d.vx*=.6;d.rx*=.6;d.rz*=.6}else{d.vy=0;d.vx=0;d.rest=true;d.on=q;d.rz=0;d.rx=0}
          break;
        }
      }
      d.m.rotation.x+=d.rx*dt;d.m.rotation.z+=d.rz*dt;
    }
    d.m.position.set(d.x,d.y,d.z);
    var life=d.rest?4:5,sh=d.t>life-.7?Math.max(0,(life-d.t)/.7):1;
    d.m.scale.setScalar(d.sc*sh);
    if(d.t>=life||d.y<-9){d.m.visible=false;if(d.m.parent)d.m.parent.remove(d.m);debris.splice(i,1)}
  }
}
var fbs=[],fbM=null;
function setAct(){var on=P.fire||P.cape||P.arena||P.mount;$('bFire').hidden=!on;$('bStar').hidden=!P.arena;$('bFire').textContent=P.arena?'Katana':(P.mount?'Impulso':(P.cape?'Giro':'Fogo'))}
function setFire(v){P.fire=v;if(!v)P.fireT=0;if(v&&P.cape)setCape(false);$('fireStat').hidden=!v;setAct()}
var FLYMAX=7;
function setCape(v){P.cape=v;if(v&&P.fire){P.fire=false;$('fireStat').hidden=true}$('capeStat').hidden=!v;if(!v){P.pm=0;P.flyT=0;P.glide=0;P.spinT=0;P.capeT=0}setAct()}
/* pulo giratório (K ou arrastar o Pular para cima): sem poder só gira; com capa gira com a capa (acerta em volta); com a flor solta fogo para os dois lados; montado, salta de cima da raposinha */
function spinJump(){if(state!=='play'||P.arena)return;P.sjbuf=.13}
function sjGo(){P.sj=true;P.sjA=0;try{sfx.sjump()}catch(e){}emit(dustPool,P.x,P.y+.05,6,1.8,.5,.5,1.2,-.5);
  if(P.cape){P.spinCd=0;spin()}
  if(P.fire){var fc=P.face;P.fcd=0;P.face=1;shoot();P.fcd=0;P.face=-1;shoot();P.face=fc;P.fcd=.3}}
function actUp(){if(P.arena&&P.chgOn)heavyRelease();P.chgOn=false}
function act(){if(P.arena){P.chgOn=true;P.chg=0}if(P.arena)slash();else if(P.mount)foxBoost();else if(P.cape)spin();else shoot()}
function spin(){
  if(!P.cape||state!=='play'||P.climb||P.warp||P.growT>0||P.stun>0||P.spinCd>0)return;
  P.spinT=.42;P.spinCd=.5;P.spinHit=[];sfx.spin();
  if(!P.grounded&&P.vy<2.2)P.vy=2.2;
  emit(sparkPool,P.x,P.y+P.h*.6,10,4.5,.35,.3,.1,0);
}
var windG=new T.Group(),windRings=[];
scene.add(windG);
for(var wi=0;wi<3;wi++){
  var wm=new T.Mesh(new T.TorusGeometry(1,.035,6,44),new T.MeshBasicMaterial({color:0xcfeeff,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending}));
  wm.rotation.x=Math.PI/2;windG.add(wm);windRings.push(wm);
}
windG.visible=false;
function updWind(dt){
  var on=P.cape&&P.spinT>0&&state!=='menu';
  P.wind=(P.wind||0)+((on?1:0)-(P.wind||0))*(1-Math.exp(-dt*14));
  windG.visible=P.wind>.03;
  if(!windG.visible)return;
  windG.position.set(P.x,P.y,0);
  for(var i=0;i<windRings.length;i++){
    var u=(tm*2.3+i/3)%1,r=(.55+u*1.0)*(.7+.3*P.sz),m=windRings[i];
    m.scale.set(r,r,r);m.position.y=(.15+u*1.7)*P.sz;
    m.rotation.x=Math.PI/2+Math.sin(tm*10+i*2)*.16;m.rotation.y=Math.cos(tm*8+i)*.16;
    m.material.opacity=Math.sin(u*Math.PI)*.6*P.wind;
  }
  if(on){
    if(Math.random()<dt*70){var a=Math.random()*6.283,rr=.6+Math.random()*.6;emit(leafPool,P.x+Math.cos(a)*rr,P.y+.15+Math.random()*1.5*P.sz,1,.7,.8,.26,.3,-2)}
    if(P.grounded&&Math.random()<dt*45){var a2=Math.random()*6.283;emit(dustPool,P.x+Math.cos(a2)*.7,P.y+.05,1,1.7,.5,.45,1.3,-.5)}
  }
}
function mountFx(dt){
  var k0=1-P.mountT/.8;P.mountT-=dt;var k=1-Math.max(0,P.mountT)/.8;
  if(k>.15&&k<.8&&Math.random()<dt*40)emit(sparkPool,P.x+(Math.random()-.5)*.6,P.y+1.2+Math.sin(k*Math.PI)*1.4,1,.8,.4,.25,.2,0);
  if(k0<.82&&k>=.82){if(fox)fox.land=1;emit(sparkPool,P.x,P.y+.9,20,4.5,.6,.35,.25,3);emit(dustPool,P.x,P.y+.1,10,2.8,.5,.5,1.2,-.3);shake=Math.max(shake,.12)}
  if(P.mountT<=0)P.mountT=0;
}
function fireFx(dt){
  P.fireT-=dt;var k=1-Math.max(0,P.fireT)/.9;
  for(var j=0;j<3;j++){var a=tm*13+j*2.09,r=.75+.2*Math.sin(tm*7+j);emit(sparkPool,P.x+Math.cos(a)*r,P.y+.1+Math.random()*.4,1,.8,.55,.3,.1,-3)}
  if(P.fireT<=0){P.fireT=0;emit(sparkPool,P.x,P.y+1,26,5.5,.7,.4,.25,1);emit(dustPool,P.x,P.y+.1,8,2.4,.5,.5,1.2,-.3)}
}
/* brilho do Kuro com a flor de fogo: luz quente pulsando no corpo + aura + coluna de chamas na transformação */
var kGlow={mats:null,aura:null,col:null,on:0};
function kuroGlow(dt){
  var tr=P.fireT>0,want=(P.fire&&state!=='menu')||tr?1:0;kGlow.on+=(want-kGlow.on)*(1-Math.exp(-dt*6));
  if(!kGlow.mats||kGlow.n!==kGlow.cnt){kGlow.mats=[];var seen={};rig.root.traverse(function(o){var m=o.material;if(m&&m.emissive&&!seen[m.uuid]&&o!==kGlow.col){seen[m.uuid]=1;if(!m.userData.e0)m.userData.e0=m.emissive.clone();kGlow.mats.push(m)}})}
  if(!kGlow.aura){kGlow.aura=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff7a20,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:0}));scene.add(kGlow.aura)}
  if(!kGlow.col){var g=new T.Group(),fm=fireMat(3.5,1);for(var i=0;i<2;i++){var pl=new T.Mesh(new T.PlaneGeometry(1.7,1).translate(0,.5,0),fm);pl.rotation.y=i*Math.PI/2+.4;pl.frustumCulled=false;g.add(pl)}g.visible=false;scene.add(g);kGlow.col=g}
  var k=tr?1-P.fireT/.9:1,fl=tr?(Math.sin(tm*40)>0?.65:.25):(.08+.06*Math.sin(tm*6)),inten=kGlow.on*fl,c=new T.Color(tr&&Math.sin(tm*40)>0?0xffe0a0:0xff8c2a);
  kGlow.mats.forEach(function(m){m.emissive.copy(m.userData.e0).lerp(c,Math.min(1,inten))});
  var a=kGlow.aura;a.visible=kGlow.on>.02&&state!=='menu';if(a.visible){var sz=(2.4+.25*Math.sin(tm*5))*(P.sz||1)*(tr?1+k*.6:1);a.scale.set(sz,sz*1.25,1);a.position.set(P.x,P.y+P.h*.55,-.3);a.material.opacity=(tr?.7:.3+.1*Math.sin(tm*6))*kGlow.on}
  var cl=kGlow.col;cl.visible=tr;if(tr){lavaU.time.value=tm;var h=Math.sin(Math.min(1,k*1.15)*Math.PI);cl.position.set(P.x,P.y-.1,0);cl.scale.set(.9+h*.4,Math.max(.05,h*3.2*(P.sz||1)),.9+h*.4);cl.rotation.y+=dt*6}
  if(P.fire&&!tr&&state==='play'&&Math.random()<dt*14){var an=Math.random()*6.283;emit(sparkPool,P.x+Math.cos(an)*.35,P.y+.2+Math.random()*P.h*.8,1,.5,.6,.22,.1,-2)}
}
function capeFx(dt){
  P.capeT-=dt;var k=1-Math.max(0,P.capeT)/.85;
  /* redemoinho de faíscas douradas subindo em volta do Kuro */
  for(var j=0;j<2;j++){var a=tm*16+j*Math.PI,r=.9-k*.3;emit(sparkPool,P.x+Math.cos(a)*r,P.y+.2+k*1.8*P.sz,1,.6,.45,.28,.2,-1)}
  if(P.capeT<=0){P.capeT=0;emit(sparkPool,P.x,P.y+1,22,5,.7,.35,.25,2);emit(dustPool,P.x,P.y+.1,8,2.4,.5,.5,1.2,-.3)}
}
function updSpin(dt){
  if(P.spinCd>0)P.spinCd-=dt;
  if(P.spinT<=0)return;
  P.spinT-=dt;
  var i,e;
  for(i=0;i<enemies.length;i++){
    e=enemies[i];if(!e.alive||e.dorm||e.appT>0)continue;
    if(Math.abs(e.x-P.x)<1.6+e.w*.5&&e.y<P.y+P.h+.3&&e.y+e.h>P.y-.25){
      killE(e,'spin');sfx.spinHit();emit(sparkPool,e.x,e.y+.4,12,4,.6,.35,.2,3);emit(dustPool,e.x,e.y+.4,6,2.2,.5,.5,1.2,-.3);
    }
  }
  for(i=0;i<blocks.length;i++){
    var b=blocks[i];
    if((b.state==='ready'||b.state==='hid')&&Math.abs(b.x-P.x)<1.5&&b.y<P.y+P.h+.85&&b.y+1>P.y-.1&&(!P.spinHit||P.spinHit.indexOf(b)<0)){
      (P.spinHit=P.spinHit||[]).push(b);b.bump=0;hitBlock(b);
    }
  }
  if(boss&&boss.state!=='dead'&&boss.state!=='wait'&&Math.abs(boss.x-P.x)<1.6+boss.w&&boss.top<P.y+P.h&&boss.top+boss.h>P.y&&((tm*30)|0)%4===0)emit(sparkPool,boss.x,P.y+P.h*.6,3,3,.3,.25,.1,0);
}
function updFeathers(dt){
  for(var i=0;i<items.length;i++){
    var it=items[i];if(!it.drift||it.got)continue;
    it.t+=dt;if(it.t>.45)it.y-=1.7*dt;
    it.x=it.x0+Math.sin(it.t*2.3)*1.5;
    var lost=it.y<-4;
    if(!lost&&it.t>.5)for(var k=0;k<solids.length;k++){var q=solids[k];if(q.dead||q.hid||q.wall)continue;if(it.x>q.l&&it.x<q.r&&it.y<=q.t+.25&&it.y>q.t-.8){lost=true;break}}
    if(lost){it.got=true;it.mesh.visible=false;emit(sparkPool,it.x,it.y,8,2.5,.5,.3,.2,1);toast('A pena escapou!')}
  }
}
function fbClear(){fbs.forEach(function(f){f.on=false;f.mesh.visible=false})}
function shoot(){
  if(!P.fire||state!=='play'||P.climb||P.warp||P.growT>0||P.stun>0||P.fcd>0)return;
  var n=0,f=null,i;
  for(i=0;i<fbs.length;i++){if(fbs[i].on)n++;else if(!f)f=fbs[i]}
  if(n>=3)return;
  if(!f){
    if(!fbM)fbM=new T.MeshStandardMaterial({color:0xffb040,emissive:0xff5a00,emissiveIntensity:2.4,roughness:.3});
    var m=mesh(new T.SphereGeometry(.2,14,10),fbM,false,false);m.visible=false;add(m);
    f={on:false,mesh:m,x:0,y:0,vx:0,vy:0,life:0,py:0};fbs.push(f);
  }
  f.on=true;f.x=P.x+P.face*.55;f.y=P.y+P.h*.55;f.vx=P.face*15+P.vx*.25;f.vy=3;f.life=2.2;f.py=f.y;f.mesh.visible=true;
  P.fcd=.22;P.shootT=.2;sfx.shoot();emit(sparkPool,f.x,f.y,4,2.5,.3,.25,.1,0);
}
function fbBoom(f){f.on=false;f.mesh.visible=false;emit(sparkPool,f.x,f.y,8,3.5,.4,.3,.2,2);sfx.fireHit()}
/* fogo derrota o inimigo e ele vira uma moeda: pula, cai no chão e fica lá até o Kuro pegar */
function fireCoin(e){extraCoins++;dropCoin(e.x,e.y+.5);e.deadT=9;if(e.vis&&e.vis.g)e.vis.g.visible=false}
function updFire(dt){
  if(P.fcd>0)P.fcd-=dt;
  for(var i=0;i<fbs.length;i++){
    var f=fbs[i];if(!f.on)continue;
    f.life-=dt;f.vy-=30*dt;if(f.vy<-14)f.vy=-14;
    f.py=f.y;f.x+=f.vx*dt;f.y+=f.vy*dt;
    if(f.life<=0||f.y<-9||Math.abs(f.x-P.x)>26){f.on=false;f.mesh.visible=false;continue}
    var k,s2,dead=false;
    for(k=0;k<solids.length;k++){
      s2=solids[k];if(s2.dead||s2.hid)continue;
      if(f.x+.18<=s2.l||f.x-.18>=s2.r)continue;
      if(f.vy<=0&&f.py-.18>=s2.t-.15&&f.y-.18<s2.t){f.y=s2.t+.18;f.vy=8.5}
      else if(!s2.oneway&&f.y+.15>s2.b+.05&&f.y-.15<s2.t-.05&&f.py-.15<s2.t-.05){dead=true;break}
    }
    if(dead){fbBoom(f);continue}
    for(k=0;k<enemies.length;k++){
      var e=enemies[k];if(!e.alive||e.dorm||e.appT>0)continue;
      if(Math.abs(f.x-e.x)<e.w+.2&&f.y>e.y-.15&&f.y<e.y+e.h+.15){
        if(killE(e,'fire')&&!e.alive)fireCoin(e);fbBoom(f);emit(sparkPool,e.x,e.y+.4,12,4,.6,.35,.2,3);emit(dustPool,e.x,e.y+.4,5,2,.5,.5,1.2,-.3);dead=true;break;
      }
    }
    for(k=0;k<plants.length;k++){
      var pl=plants[k];if(pl.dead||pl.len<.3)continue;
      if(Math.abs(f.x-pl.x)<.65&&f.y>pl.top-.1&&f.y<pl.top+pl.len+.5){pl.dead=true;pl.g.visible=false;fbBoom(f);emit(sparkPool,pl.x,pl.top+1,14,4,.6,.35,.2,3);emit(dustPool,pl.x,pl.top+1,6,2.2,.5,.5,1.2,-.3);sfx.stomp();dead=true;break}
    }
    if(dead)continue;
    if(boss&&boss.state!=='dead'&&boss.state!=='wait'&&Math.abs(f.x-boss.x)<boss.w&&f.y>boss.top&&f.y<boss.top+boss.h){fbBoom(f);toast('O Rei Besouro é forte demais para fogo. Pise nele!');continue}
    f.mesh.position.set(f.x,f.y,0);
    if(((tm*40)|0)%2===0)emit(sparkPool,f.x,f.y,1,.8,.25,.22,0,0);
  }
}
function hurt(fromX,sharp){
  if(P.inv>0||state!=='play')return;
  if(P.mount){dismountFox('hit',fromX);P.inv=1.6;P.climb=null;P.vx=(P.x>=fromX?1:-1)*4;P.vy=8;P.grounded=false;P.onPlat=null;emit(sparkPool,P.x,P.y+.8,14,3.5,.7,.4,.3,3);return}
  if(P.shield){P.shield=false;P.inv=1.4;sfx.check();emit(sparkPool,P.x,P.y+1,16,4,.7,.4,.3,2);toast('O escudo protegeu o Kuro!');return}
  if(P.cape){
    setCape(false);P.inv=2;P.climb=null;P.vineCd=.3;P.vx=(P.x>=fromX?1:-1)*3.5;P.vy=6;P.grounded=false;P.onPlat=null;
    sfx.shrink();emit(sparkPool,P.x,P.y+.8,14,3.5,.7,.4,.3,3);toast('Kuro perdeu a capa');return;
  }
  if(P.fire){
    setFire(false);P.inv=2;P.climb=null;P.vineCd=.3;P.vx=(P.x>=fromX?1:-1)*3.5;P.vy=6;P.grounded=false;P.onPlat=null;
    sfx.shrink();emit(sparkPool,P.x,P.y+.8,14,3.5,.7,.4,.3,3);toast('Kuro perdeu o poder de fogo');return;
  }
  if(P.big){
    P.big=false;P.inv=2;P.climb=null;P.vineCd=.3;P.vx=(P.x>=fromX?1:-1)*3.5;P.vy=6;P.grounded=false;P.onPlat=null;
    sfx.shrink();emit(sparkPool,P.x,P.y+.8,14,3.5,.7,.4,.3,3);emit(dustPool,P.x,P.y+.6,6,2,.5,.6,1.3,-.2);
    toast('Kuro perdeu o cogumelo e voltou ao tamanho normal');return;
  }
  P.climb=null;P.vineCd=.3;
  hearts--;setHearts();sfx.hurt();
  P.inv=hd(1.8,1.4);P.stun=.3;P.vx=(P.x>=fromX?1:-1)*6;P.vy=9;P.grounded=false;P.onPlat=null;
  if(P.inW){P.vx*=.5;P.vy=4}
  if(hearts<=0)startDeath(sharp?'shatter':'hit',function(){lose()});
}
function timeUp(){
  if(dyn||state!=='play')return;
  timeLeft=0;hearts--;setHearts();sfx.hurt();P.big=false;setFire(false);setCape(false);
  startDeath('hit',function(){
    if(hearts<=0){lose('Acabou o tempo','O tempo da fase esgotou. Corra mais rápido e tente de novo!');return}
    resetBoss();spawn(respawn);timeLeft=Math.min(TLIM,hd(90,60));lowWarn=false;toast('Tempo esgotado! Voltando ao checkpoint com mais '+hd('1:30','1:00'));
  });
}
function fallDeath(msg,kind){
  if(dyn||state!=='play')return;
  hearts--;setHearts();sfx.hurt();P.big=false;setFire(false);setCape(false);
  startDeath(kind||'fall',function(){
    if(hearts<=0){lose();return}
    timeLeft=Math.min(TLIM,timeLeft+hd(60,40));if(timeLeft>60)lowWarn=false;
    resetBoss();spawn(respawn);sandReset();toast(msg||'Você caiu. Voltando ao último checkpoint.');
  });
}