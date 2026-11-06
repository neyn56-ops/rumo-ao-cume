/* Robô de teste das fases geradas (Mundo 23+): joga sozinho só olhando o que tem na frente — chão, buraco, parede, espinho,
   plataforma que anda, pilão, tronco, espinho de raiz, cipó. Usado pelo bloco 66 de roda.js. rbBot(n,run) -> texto do resultado */
function rbBot(n,run,maxS){rbMundo(n);dyn=null;startLevel(n-1);beginPlay();card.hidden=true;state='play';hearts=99;P.inv=0;P.big=false;setFire(false);setCape(false);enemies.forEach(function(e){e.alive=false;e.x=-999});
 var hits=[],h0=hurt;hurt=function(){if(P.inv<=0)hits.push(P.x.toFixed(0));return h0.apply(this,arguments)};
 var run0=run,tg=null,dl=[],sp=run?7.8:6.5,look=run?1.5:1.05,att=0,stuck=0,lastX=-99,k,maxx=-99,deaths=0,st0=state;
 function spike(x,y){return hazards.some(function(h){return h.spike&&x>=h.l-.3&&x<=h.r+.3&&Math.abs(h.y0-y)<.4})}
 function top(x,y){var t=-99;solids.forEach(function(s){if(!s.dead&&!s.crush&&x>=s.l&&x<=s.r&&s.t<=y+2.3&&s.t>t)t=s.t});crumbles.forEach(function(c){if(!c.dead&&x>=c.l&&x<=c.r&&c.t<=y+2.3&&c.t>t)t=c.t});return t}
 function surf(x0,x1,y){/* algum lugar para pousar entre x0 e x1 (não mais alto que y+2.3, sem espinho, com 1 de largura) */
  for(var x=x0;x<=x1;x+=.25){var t=top(x,y);if(t>y-14&&!spike(x,t)&&Math.abs(top(x+.8,y)-t)<.05&&!spike(x+.8,t)){var e=x;while(e<x+30&&Math.abs(top(e+.25,y)-t)<.05&&!spike(e+.25,t))e+=.25;return {x:x,e:e,t:t}}}return null}
 function gnd(x,y){return solids.some(function(s){return !s.dead&&!s.crush&&x>=s.l&&x<=s.r&&Math.abs(s.t-y)<.3})||crumbles.some(function(c){return !c.dead&&x>=c.l&&x<=c.r&&Math.abs(c.t-y)<.3})}
 for(k=0;k<90*(maxS||200)&&(state==='play'||state==='dying'||state==='respawn');k++){
  if(state!=='play'){if(st0==='play'){deaths++;dl.push(P.x.toFixed(0)+'/'+P.y.toFixed(0));run=0;sp=6.5;look=1.05}/* caiu: volta andando, com cuidado */st0=state;keys.right=keys.jump=false;if(state==='dying')updDeath(STEP);else step(STEP);continue}st0=state;
  if(P.grounded&&P.vy<=0)tg=null;
  keys.run=!!run&&!(P.grounded&&(!gnd(P.x+2.6,P.y)||!gnd(P.x+3.6,P.y)));/* correndo: perto de buraco, anda (como um jogador) */var go=true,jump=false,ctl=0;
  /* cipó: pula para pegar quando ele está voltando, solta lá na frente */
  var v=LV.roots&&RT&&RT.vines&&RT.vines.filter(function(v){return v.px>P.x-1&&v.px-P.x<5.5})[0];
  if(LV.roots&&RT.sw){ctl=1;att=1;var vv=RT.sw;keys.jump=false;keys.run=false;keys.right=vv.w>0;keys.left=vv.w<0;if(vv.w>0&&(vv.a>.75||(vv.a>.45&&top(P.x+3,P.y+1)>P.y-8))){keys.left=false;keys.right=true;keys.jump=true}}
  else if(v&&P.grounded&&!gnd(P.x+look,P.y)){ctl=1;keys.left=false;keys.right=false;if(Math.abs(v.a)<.06&&v.w<0){keys.right=true;keys.jump=true;P.jbuf=.12;att=0}}
  if(!ctl){
   if(P.grounded){
    var ahead=P.x+look,edge=!gnd(ahead,P.y)||spike(ahead,P.y),wall=solids.filter(function(s){return !s.dead&&!s.crush&&s.l>P.x&&s.l-P.x<1.3&&s.t>P.y+.3&&s.b<P.y+1.5})[0];
    var spr=springs.some(function(s){return s.x>P.x&&s.x-P.x<2.5&&Math.abs(s.base-P.y)<.4});
    if(wall&&!spr){if(wall.t<=P.y+2.3){jump=true;tg=surf(wall.l,wall.l+1.5,P.y)}else go=false}
    else if(spike(ahead,P.y)){jump=true;tg=surf(P.x+.8,P.x+(run?6:5),P.y)}
    else if(edge&&!spr&&!spike(ahead,P.y)&&(function(){var t=top(ahead+.3,P.y-.5);return t>P.y-4&&!spike(ahead+.3,t)&&Math.abs(top(ahead+1.3,P.y-.5)-t)<.05})()){/* degrau para baixo logo à frente: só desce andando */}
    else if(edge&&!spr){var t2=surf(P.x+.8,P.x+(run?6:5),P.y);if(t2){jump=true;tg=t2}else go=false}
    /* pilões e troncos do cânion, espinhos de raiz: espera a hora */
    if(CN&&LV.canyon){(CN.crs||[]).forEach(function(c){var d=c.so.l-P.x;if(d>0&&d<1.3){var need=(c.w+2)/sp+.15;if(!((c.st==='rise'&&c.so.b>P.y+1.9)||(c.st==='up'&&c.up-c.t>need)))go=false}});
     (CN.logs||[]).forEach(function(l){var d=l.px-P.x;if(d>0&&d<3.2){var a=l.amp*Math.sin(CN.t*l.sp+l.ph),av=Math.cos(CN.t*l.sp+l.ph);if(!(a>.45&&av>0))go=false}})}
    if(LV.roots&&RT.thorns)RT.thorns.forEach(function(q){var d=q.x-q.w/2-P.x;if(d>0&&d<1.2&&Math.abs(P.y-q.y)<.3){var cc=(RT.t+q.off)%q.per;if(!(cc<q.per*.45-(q.w+2)/sp-.1))go=false}});
    if(!go)jump=false;
    if(P.onPlat&&P.onPlat.mover&&!jump)go=go&&gnd(ahead,P.y);
   }
   keys.left=false;keys.right=go;if(jump){keys.jump=true;P.jbuf=.12}else if(P.grounded||P.vy<0)keys.jump=false}
  else if(!RT.sw&&P.vy<0&&!att)keys.jump=false;
  if(!ctl&&tg&&!P.grounded&&tg.x+1.2-P.x<2.4&&tg.t<=P.y+.5)keys.jump=false;/* perto: pulo curto */
  if(!ctl&&!P.grounded&&tg&&P.vy<0&&P.x>=tg.x+.5&&P.x<=tg.e-.3){var tt=top(P.x,P.y-.1);if(Math.abs(tt-tg.t)<.05&&P.y>tt){keys.right=false;keys.left=P.x>tg.x+1.2}}/* no ar: já está em cima do lugar escolhido, para de ir para a frente */
  step(STEP);if(P.x>maxx)maxx=P.x;
  if(k%(90*20)===0){if(Math.abs(P.x-lastX)<1)stuck++;lastX=P.x}if(stuck>2)break;if(P.x>LV.goal.x+6){dl.push('passou do fim em y='+P.y.toFixed(1));break}}
 hurt=h0;keys.right=keys.left=keys.run=keys.jump=false;
 return 'M'+n+(run0?' correndo':' andando')+': '+state+' x='+P.x.toFixed(0)+'/'+LV.goal.x.toFixed(0)+' mortes='+deaths+(dl.length?'['+dl.join(' ')+']':'')+' batidas='+hits.length+' t='+(k/90|0)+'s'}
