const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:380}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`startLevel(0);beginPlay();P.mountT=0;var e=enemies.find(function(q){return q.alive&&q.type==='beetle'});e.speed=0;P.inv=1e9;P.x=e.x;P.y=e.y+2.5;P.vy=-1;for(var k=0;k<40;k++){P.x=e.x;step(STEP);animate(STEP)}P.x=e.x-2.5;P.y=floorBelow(P.x,5);for(k=0;k<30;k++){step(STEP);animate(STEP)}P.inv=0;render();1`);
await pg.screenshot({path:__dirname+'/fotos/slp.png'});await b.close()})();
