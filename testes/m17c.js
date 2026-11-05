const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const xs=[4,34];
for(const x of xs){await E(`startLevel(16);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=${x};P.y=Math.max(floorBelow(${x},30),4);P.vy=0;for(var i=0;i<20;i++)step(1/60);P.inv=0;for(var k=0;k<200;k++){animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/pre_'+x+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
