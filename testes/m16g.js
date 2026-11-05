const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const S=[['m',`var D=LV.wlogs[2],L=D.LS.slice().sort(function(a,b){return Math.abs(a.y-7)-Math.abs(b.y-7)})[0];P.x=D.x;P.y=L.so.t;for(var i=0;i<60;i++)step(1/60)`],
 ['n',`P.x=310;P.y=8;for(var i=0;i<40;i++){P.x=310;step(1/60)}P.x=303.5;P.y=6.8;P.vy=0;for(i=0;i<50;i++){P.x=303.5;P.y=6.8;P.vy=0;step(1/60)}`]];
for(const [n,c] of S){await E(`startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;${c};P.inv=0;for(var k=0;k<200;k++){animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/m16/s'+n+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
