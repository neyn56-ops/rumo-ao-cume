const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`leaveMap();startLevel(17);beginPlay();card.hidden=true;state='play';P.inv=0;enemies.forEach(function(e){e.alive=false;e.x=-999});P.x=8;P.y=0;keys.left=true;for(var k=0;k<90*4.2;k++){step(1/90);if(k%2)animate(1/45);updateCamera(1/90)}render();1`);
await pg.screenshot({path:__dirname+'/fotos/climb.png'});await b.close()})();
