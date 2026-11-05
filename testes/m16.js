const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const xs=(process.argv[2]||'4,34,60,86,110,130,156').split(',').map(Number);const st=+(process.argv[3]||0);
for(const x of xs){const r=await E(`try{startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=${x};P.y=Math.max(floorBelow(${x},40),0)+.1;for(var i=0;i<${60+st};i++)step(1/60);P.inv=0;for(var k=0;k<300;k++){animate(1/60);updateCamera(1/60)}render();'ok'}catch(e){e.message+' '+e.stack.split('\\n')[1]}`);
 if(r!=='ok')console.log(x,r);await pg.screenshot({path:__dirname+'/fotos/m16/x'+x+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
