const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));pg.on('console',m=>{if(m.type()==='error')er.push(m.text())});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const LVI=+(process.argv[4]||17);const xs=JSON.parse(process.argv[2]||'[4,40,70,84,120,137,170,200]');
for(const x of xs){await E(`leaveMap();startLevel(${LVI});${process.argv[5]==='lago'?'auEnter();P.warp=null;':''}beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=${x};P.y=Math.max(floorBelow(${x},30),0);P.vy=0;for(var i=0;i<30;i++){P.x=${x};step(1/60)}P.inv=0;for(var k=0;k<${process.argv[3]||150};k++){P.x=${x};step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/m18'+(process.argv[5]||'')+'_'+x+'.png'})}
console.log('erros',er.slice(0,5));await b.close()})();
