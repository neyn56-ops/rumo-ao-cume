const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=12;P.y=0;for(var i=0;i<30;i++)step(1/60);var S=flSt[0];S.fish[0].st='flop';S.fish[0].t=.3;S.fish[0].tx=S.x-1.9;S.fish[1].st='out';S.fish[1].t=.28;S.fish[1].tx=S.x+1.9;streamsUpd(0);P.inv=0;P.x=8;for(var k=0;k<120;k++){animate(1/60);updateCamera(1/60)}streamsUpd(0);render();1`);
await pg.screenshot({path:__dirname+'/fotos/m16/peixes.png',clip:{x:240,y:120,width:480,height:300}});
console.log('erros',er.slice(0,3));await b.close()})();
