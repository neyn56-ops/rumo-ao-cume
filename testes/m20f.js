const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
for(const s of JSON.parse(process.argv[2])){const [x,y,n,f]=s;await E(`leaveMap();startLevel(19);beginPlay();card.hidden=true;state='play';P.inv=0;for(var k=0;k<${n||120};k++){CN.flip=${f||0};CN.cd=9;P.x=${x};P.y=${y};P.vy=0;P.grounded=true;step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/m20_'+x+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
