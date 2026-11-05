const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:640,height:300}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`(function(){var o={};startLevel(15);beginPlay();card.hidden=true;state='play';
 /* totem: Kuro parado embaixo leva dano; depois sobe na carona */
 enemies.forEach(function(e){e.alive=false});hearts=3;P.inv=0;P.big=false;var T0=flTot[0];P.x=T0.d.x;P.y=0;var h0=hearts,k,hit=0,st=[];
 for(k=0;k<120;k++){step(STEP);if(st.indexOf(T0.st)<0)st.push(T0.st);if(hearts<h0||P.inv>0)hit=1}o.totHit=hit;o.totSt=st.join('>');o.pushed=Math.abs(P.x-T0.d.x).toFixed(2);
 /* ficar ao lado esperando, subir quando estiver embaixo e pegar carona */
 P.inv=1e9;for(k=0;k<30;k++)step(STEP);o.st2=T0.st;P.x=T0.d.x;P.y=T0.so.t+.5;P.vy=0;for(k=0;k<30;k++)step(STEP);o.onTop=P.onPlat===T0.so;var y1=P.y;for(k=0;k<150;k++)step(STEP);o.ride=(P.y-y1).toFixed(2)+' '+T0.st;
 /* minhocão: sai, faz o arco, volta; pisar faz dormir */
 startLevel(15);beginPlay();card.hidden=true;state='play';P.x=20;P.y=0;P.inv=1e9;var W=enemies.find(function(e){return e.type==='worm'}),mx=0,xs=[];
 for(k=0;k<400;k++){step(STEP);mx=Math.max(mx,W.y-W.base);if(k%40===0)xs.push(W.x.toFixed(1)+(W.noHit?'h':'o'))}o.worm='altura '+mx.toFixed(2)+' '+xs.join(',');
 W.mt=W.wait+W.air*0.5-0;step(STEP);killE(W,'stomp');o.wormSleep=W.slp>0;for(k=0;k<500;k++)step(STEP);o.wormBack=W.alive&&!(W.slp>0)&&W.mt<3;
 /* abelhas: perseguem perto, derrubadas pelo pulo, morrem com o giratório */
 var B=enemies.find(function(e){return e.type==='bee'});P.x=58;P.y=2.4;var bx0=B.x,minD=99;for(k=0;k<240;k++){step(STEP);minD=Math.min(minD,Math.hypot(B.x-P.x,B.y-P.y))}o.beeNear=minD.toFixed(2);
 P.x=30;P.y=0;for(k=0;k<400;k++)step(STEP);o.beeHome=(B.x>=B.x0-1.6&&B.x<=B.x1+1.6);killE(B,'stomp');o.beeFly=B.fly;killE(B,'sjump');o.beeDead=!B.alive;
 return JSON.stringify(o)})()`));
console.log('erros',er.slice(0,3));await b.close()})();
