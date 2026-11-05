/* foto da tela de carregamento: node testes/ld.js  (usa teste.html sem o __noLoad) */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
fs.writeFileSync(__dirname+'/ld.html',fs.readFileSync(__dirname+'/teste.html','utf8').replace('window.__noLoad=true',''));
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));pg.on('console',m=>{if(m.type()==='warning'||m.type()==='error')er.push(m.text())});await pg.route(/fonts/,r=>r.abort());
await pg.goto('file://'+__dirname+'/ld.html',{waitUntil:'domcontentloaded'});
await pg.waitForSelector('#ld.on3d',{timeout:120000});await pg.waitForTimeout(+(process.argv[2]||2500));await pg.screenshot({path:__dirname+'/fotos/ld.png'});console.log('erros0',er.slice(0,4));
const t0=Date.now();await pg.waitForFunction(()=>!document.getElementById('ld'),null,{timeout:+(process.argv[3]||180000)});
console.log('saiu em',Date.now()-t0,'ms; erros',er.slice(0,4));await pg.waitForTimeout(1500);await pg.screenshot({path:__dirname+'/fotos/ld2.png'});await b.close()})();
