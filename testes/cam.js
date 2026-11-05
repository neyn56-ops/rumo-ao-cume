const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:370}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
for(const [l,x] of [[0,40],[3,60],[11,40],[13,60]]){for(const m of ['clas','cine']){
 await E(`cfg.cam='${m}';startLevel(${l});beginPlay();if(typeof trIntro!=='undefined')trIntro=null;card.hidden=true;P.x=${x};P.y=floorBelow(${x},40);P.face=1;P.vx=0;P.vy=0;P.inv=0;for(var i=0;i<20;i++)step(1/60);for(var k=0;k<200;k++){animate(1/60);updateCamera(1/60)}render();1`);
 await pg.screenshot({path:__dirname+`/fotos/cam_${l}_${m}.png`})}}
await b.close()})();
