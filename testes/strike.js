const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`leaveMap();startLevel(18);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;WK.gust.t=1e9;WK.big.t=1e9;WK.strike.t=1e9;P.x=134;P.y=1;for(var k=0;k<300;k++){P.x=134;P.y=1;P.vy=0;P.grounded=true;kWet.w=1;step(1/60);animate(1/60);updateCamera(1/60)}var m=movers.find(function(q){return q.x>136});WK.strike={st:1,t:.02,m:m};1`);
let i=0;for(const n of [3,20,60]){await E(`for(var k=0;k<${n};k++){P.x=134;P.y=1;P.vy=0;P.grounded=true;kWet.w=1;step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/st_'+(i++)+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
