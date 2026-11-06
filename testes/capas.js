/* capas para os portais (só o título escrito): node testes/capas.js → testes/fotos/capa_1920x1080.png, capa_800x1200.png, capa_800x800.png */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
fs.writeFileSync(__dirname+'/ld.html',fs.readFileSync(__dirname+'/teste.html','utf8').replace('window.__noLoad=true','window.__ldHold=1'));
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
for(const [w,h,cam] of [[1920,1080,[3.4,1.6,5.2,.2,1.5,-3]],[800,1200,[3.6,1.5,6.4,.5,1.7,-1]],[800,800,[3.3,1.5,5.4,.4,1.6,-2]]]){
 const pg=await b.newPage({viewport:{width:w,height:h}});
 await pg.addInitScript(()=>{localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2,lang:'pt'}))});
 await pg.goto('file://'+__dirname+'/ld.html',{waitUntil:'domcontentloaded'});await pg.waitForFunction(()=>window.__LD,null,{timeout:120000});
 await pg.evaluate(c=>{var LD=window.__LD;LD.t=1.2;document.getElementById('ldBox').style.display='none';document.getElementById('ldSlo').style.display='none';
   var t=document.getElementById('ldTip');if(t)t.style.display='none';var lg=document.getElementById('ldLogo');lg.querySelectorAll('i').forEach(function(e){e.style.display='none'});lg.style.cssText+=';position:absolute;left:50%;top:5%;transform:translateX(-50%) scale('+(innerWidth>1000?2.1:1.6)+');transform-origin:top center;margin:0';LD.cam.position.set(c[0],c[1],c[2]);LD.look.set(c[3],c[4],c[5]);LD.camFix=c},cam);
 await pg.waitForTimeout(2500);await pg.screenshot({path:__dirname+'/fotos/capa_'+w+'x'+h+'.png'});await pg.close()}
await b.close()})();
