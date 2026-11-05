const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`leaveMap();startLevel(17);beginPlay();card.hidden=true;state='play';P.inv=0;P.x=-25.1;P.y=13;window.__fd=[];1`);
for(let i=0;i<6;i++){await E(`for(var k=0;k<25;k++){step(1/60);animate(1/60);updateCamera(1/60);window.__fd.push(+document.getElementById('fade').style.opacity||0)}render();1`);await pg.screenshot({path:__dirname+'/fotos/tf_'+i+'.png'})}
console.log('fade max',await E('Math.max.apply(null,window.__fd)'));await b.close()})();
