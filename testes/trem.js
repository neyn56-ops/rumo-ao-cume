const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:370}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
for(const x of [30,70]){await E(`startLevel(14);beginPlay();if(typeof trIntro!=='undefined')trIntro=null;card.hidden=true;state='play';P.inv=1e9;P.x=${x};P.y=floorBelow(${x},40);for(var i=0;i<20;i++)step(1/60);mpFx.train.wait=0;mpFx.train.x=${x}-14;mpFx.train.toot=0;for(var k=0;k<90;k++){updMinePre(1/60);animate(1/60);updateCamera(1/60)}render();1`);
 await pg.screenshot({path:__dirname+'/fotos/trem_'+x+'.png'})}
console.log('erros',er);await b.close()})();
