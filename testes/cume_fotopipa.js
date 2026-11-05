const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
for(const pre of ['high','vlow']){const pg=await b.newPage({viewport:{width:900,height:405}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},pre);
await pg.goto('file://'+__dirname+'/teste.html'+(pre==='vlow'?'?lite=1':''),{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`(function(){startLevel(10);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=0;windZones.forEach(function(w){w.per=1e9});P.x=182;P.y=19.5;for(var k=0;k<20;k++)step(STEP);keys.right=true;for(k=0;k<60;k++){if(P.x>sumKites[0].rope.x0-.6){keys.jump=true;P.jbuf=.13}step(STEP);if(P.climb)break}keys.right=false;keys.jump=false;for(k=0;k<170;k++)step(STEP);updateCamera(0,true);frame(performance.now()+16);frame(performance.now()+32);return 1})()`);
await pg.screenshot({path:__dirname+'/fotos/pipa_'+pre+'.png'});await pg.close()}
await b.close()})();
