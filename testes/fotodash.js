const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:480}});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2,lang:'pt'}))});
await pg.goto('file://'+__dirname+'/teste_nj.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2500);
await pg.evaluate(c=>window.__ev(c),`(function(){leaveMap();startLevel(0);beginPlay();card.hidden=true;state='play';P.inv=1e9;enemies.forEach(function(e){e.alive=false;if(e.vis&&e.vis.g)e.vis.g.visible=false});P.x=8;P.y=0;for(var k=0;k<60;k++){step(STEP);animate(STEP);updateCamera(STEP)}P.face=1;dashTry();for(k=0;k<13;k++){step(STEP);animate(STEP);updateCamera(STEP)}camera.position.z-=4;camera.position.y-=.6;render();1})()`);
await pg.screenshot({path:process.argv[2]});await b.close()})();
