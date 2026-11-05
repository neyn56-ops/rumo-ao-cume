const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pre=process.env.PRE||'high';
const pg=await b.newPage({viewport:{width:900,height:405}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},pre);
await pg.goto('file://'+__dirname+'/teste.html'+(pre==='low'?'?lite=1':''),{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const shots=JSON.parse(process.argv[2]);
for(const s of shots){await E(s.c);await pg.screenshot({path:__dirname+'/fotos/'+s.n+'.png'});console.log(s.n)}
await b.close()})();
