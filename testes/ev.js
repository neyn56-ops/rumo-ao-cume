/* uso: node testes/ev.js arquivo.js  — roda o código do arquivo na página de teste e mostra o resultado */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:360}});const er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'vlow',pMig:1,aaMig:2,lang:'pt'}))});
await pg.goto('file://'+__dirname+'/teste.html?lite=1',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
for(const f of process.argv.slice(2)){const c=fs.readFileSync(f,'utf8');try{console.log(await pg.evaluate(c=>window.__ev(c),c))}catch(e){console.log('ERRO',e.message.slice(0,300))}}
if(er.length)console.log('erros:',er.slice(0,3));await b.close()})();
