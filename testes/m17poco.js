const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:540}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`startLevel(16);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=23.5;P.y=4.2;P.vy=0;P.sj=true;P.drill=true;for(var k=0;k<240;k++){P.x=23.5;step(1/60);animate(1/60);updateCamera(1/60)}P.inv=0;for(k=0;k<30;k++){P.x=23.5;step(1/60);animate(1/60);updateCamera(1/60)}render();'y '+P.y`).then(console.log);
await pg.screenshot({path:__dirname+'/fotos/m17poco.png'});console.log('erros',er.slice(0,3));await b.close()})();
