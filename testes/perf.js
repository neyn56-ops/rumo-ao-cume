const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pre=process.env.PRE||'low';
const pg=await b.newPage({viewport:{width:640,height:300}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},pre);
await pg.goto('file://'+__dirname+'/teste.html'+(pre==='low'?'?lite=1':''),{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const r=await pg.evaluate(c=>window.__ev(c),process.argv[2]);console.log(r);await b.close()})();
