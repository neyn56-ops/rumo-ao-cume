const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});pg.on('console',m=>console.log('C',m.text().slice(0,200)));pg.on('pageerror',e=>console.log('E',e.message.slice(0,300)));await pg.route(/fonts/,r=>r.abort());
await pg.goto('file://'+__dirname+'/ld.html',{waitUntil:'domcontentloaded'});await pg.waitForSelector('#ld.on3d',{timeout:120000});
for(let i=0;i<2;i++){await pg.waitForTimeout(5000);console.log(await pg.evaluate(()=>{var s=document.getElementById('ldPct');return (s?s.textContent:'sem ld')+' '+document.getElementById('ldFill')?.style.width}))}
await pg.screenshot({path:__dirname+'/fotos/ld.png'});await b.close()})();
