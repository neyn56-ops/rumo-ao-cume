const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`leaveMap();startLevel(17);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999});P.x=59.5;P.y=0;P.vx=0;for(var k=0;k<40;k++){step(1/60);animate(1/60);updateCamera(1/60)}1`);
let i=0;for(const n of [20,14,14]){await E(`for(var k=0;k<${n};k++){step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/fall_'+(i++)+'.png'})}
await E(`P.x=-112;P.y=.3;for(var k=0;k<60;k++){step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/seal.png'});
await b.close()})();
