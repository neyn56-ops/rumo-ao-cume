const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`leaveMap();startLevel(18);beginPlay();card.hidden=true;state='play';P.inv=0;enemies.forEach(function(e){e.alive=false;e.x=-999});P.x=8;P.y=0;for(var k=0;k<400;k++){P.x=8;P.y=0;step(1/60);animate(1/60);updateCamera(1/60)}cam.dist=7;for(k=0;k<40;k++){P.x=8;P.y=0;step(1/60);animate(1/60);updateCamera(1/60,true)}render();1`);
await pg.screenshot({path:__dirname+'/fotos/gota.png'});console.log('wet',await E('kWet.w.toFixed(2)'),er.slice(0,2));await b.close()})();
