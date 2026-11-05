const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;var e=enemies.find(function(q){return q.type==='worm'});e.mt=e.wait+e.air*.5;P.x=29.5;P.y=0;for(var k=0;k<3;k++)step(STEP);updEnemy(e,0);foxBubble(e);for(k=0;k<60;k++){P.x=29.5;P.y=0;step(STEP)}P.inv=0;for(k=0;k<120;k++){animate(1/60);updateCamera(1/60)}render();1`);
await pg.screenshot({path:__dirname+'/fotos/bolha_minhocao.png',clip:{x:240,y:60,width:560,height:340}});
console.log('erros',er.slice(0,3));await b.close()})();
