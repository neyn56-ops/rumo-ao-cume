const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`leaveMap();startLevel(17);auEnter();beginPlay();card.hidden=true;state='play';P.inv=0;1`);
for(const n of [12,40,80]){await E(`for(var k=0;k<${n===12?12:(n===40?28:40)};k++){step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/sin_'+n+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
