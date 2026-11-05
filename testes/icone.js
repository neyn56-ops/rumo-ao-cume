/* foto do Kuro e da raposinha para o ícone e o banner do app: node testes/icone.js */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
fs.writeFileSync(__dirname+'/ld.html',fs.readFileSync(__dirname+'/teste.html','utf8').replace('window.__noLoad=true','window.__ldHold=1'));
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
for(const [w,h,nome,cam] of [[1024,1024,'icone',[3.1,1.3,3.0,.7,.86,.35]],[1280,720,'banner',[3.4,1.6,5.2,.2,1.5,-3]]]){
 const pg=await b.newPage({viewport:{width:w,height:h}});await pg.route(/fonts/,r=>r.abort());
 await pg.goto('file://'+__dirname+'/ld.html',{waitUntil:'domcontentloaded'});await pg.waitForFunction(()=>window.__LD,null,{timeout:120000});
 await pg.evaluate(c=>{var LD=window.__LD;LD.t=1.2;document.getElementById('ldBox').style.display='none';document.getElementById('ldSlo').style.display='none';if(c[0]==='icone')document.getElementById('ldLogo').style.display='none';
   LD.cam.position.set(c[1][0],c[1][1],c[1][2]);LD.look.set(c[1][3],c[1][4],c[1][5]);LD.camFix=c[1]},[nome,cam]);
 await pg.waitForTimeout(1500);await pg.screenshot({path:__dirname+'/fotos/'+nome+'.png'});await pg.close()}
await b.close()})();
