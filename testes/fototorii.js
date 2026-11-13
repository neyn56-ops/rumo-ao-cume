const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:480}});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2,lang:'pt'}))});
await pg.goto('file://'+__dirname+'/teste_nj.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2500);
await pg.evaluate(c=>window.__ev(c),`(function(){leaveMap();startLevel(0);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=LV.goal.x-1.2;P.y=LV.goal.top;for(var k=0;k<120;k++){P.x=LV.goal.x-1.6;P.y=LV.goal.top;P.vy=0;P.grounded=true;step(1/60);animate(1/60);updateCamera(1/60)}render();1})()`);
await pg.screenshot({path:process.argv[2]});await b.close()})();
