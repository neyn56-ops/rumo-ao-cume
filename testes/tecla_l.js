/* aperta a tecla L de verdade (teclado do navegador) e confere o dash */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:400}});const er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2,lang:'pt'}))});
await pg.goto('file://'+__dirname+'/teste_nj.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(3000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`leaveMap();startLevel(0);beginPlay();card.hidden=true;state='play';P.inv=1e9;window.__x0=P.x;1`);await pg.waitForTimeout(800);
const x0=await E('P.x');await pg.keyboard.press('KeyL');await pg.waitForTimeout(600);
console.log('andou',(await E('P.x'))-x0,'toast',await E("(document.getElementById('toast')||{}).textContent"),'erros',er.slice(0,2));await b.close()})();
