/* fotos de uma fase: node testes/fase.js NIVEL '[[x,y,quadros,"js antes"],...]'  → testes/fotos/f_x.png */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:+(process.env.W||960),height:+(process.env.H||440)}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html?lite=1',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);const L=+process.argv[2];
for(const s of JSON.parse(process.argv[3])){const [x,y,n,js]=s;await E(`leaveMap();startLevel(${L});beginPlay();card.hidden=true;state='play';P.inv=1e9;${js||''};for(var k=0;k<${n||120};k++){P.x=${x};P.y=${y};P.vy=0;P.grounded=true;step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/f_'+x+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
