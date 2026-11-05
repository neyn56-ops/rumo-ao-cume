const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`leaveMap();startLevel(18);beginPlay();card.hidden=true;state='play';hearts=99;P.x=301;P.y=5;for(var k=0;k<60;k++){P.x=301;step(1/60);animate(1/60);updateCamera(1/60)}1`);
for(const n of [10,200,200]){await E(`for(var k=0;k<${n};k++){P.inv=0;hearts=99;step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/boss_'+n+'.png'})}
await E(`WK.cap.hp=2;wkBossFish();for(var k=0;k<55;k++){P.inv=0;hearts=99;step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/boss_fish.png'});
await b.close()})();
