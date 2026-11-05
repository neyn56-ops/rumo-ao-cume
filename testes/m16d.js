const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const S=[['a',28.5,`var W=enemies.find(function(e){return e.type==='worm'});W.mt=W.wait+W.air*.45`],['b',40.2,`flTot[0].st='up';flTot[0].t=-9`],['c',57,``],['d',83,`flTot[1].st='up';flTot[1].t=-9`]];
for(const [n,x,c] of S){await E(`startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=${x};P.y=floorBelow(${x},40)+.05;for(var i=0;i<40;i++)step(1/60);${c};step(1/60);P.inv=0;for(var k=0;k<60;k++){animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/m16/s'+n+'.png'})}
await b.close()})();
