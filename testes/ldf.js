/* fotos da tela de carregamento parada: node testes/ldf.js '[código JS por foto]' (LD = estado da cena) */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
fs.writeFileSync(__dirname+'/ld.html',fs.readFileSync(__dirname+'/teste.html','utf8').replace('window.__noLoad=true','window.__ldHold=1'));
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.goto('file://'+__dirname+'/ld.html',{waitUntil:'domcontentloaded'});await pg.waitForFunction(()=>window.__LD,null,{timeout:120000});
const L=JSON.parse(process.argv[2]||'[""]');for(let i=0;i<L.length;i++){await pg.evaluate(c=>{var LD=window.__LD;eval(c)},L[i]);await pg.waitForTimeout(1200);await pg.screenshot({path:__dirname+'/fotos/ldf'+i+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
