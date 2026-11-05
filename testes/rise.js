const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:400,height:200}});await pg.route(/fonts/,r=>r.abort());await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
console.log(await pg.evaluate(()=>window.__ev(`(function(){startLevel(10);beginPlay();P.inv=1e9;P.x=300;P.y=34.8;for(var k=0;k<30;k++)step(STEP);P.x=309;for(k=0;k<20;k++)step(STEP);resetKids();boss.state='idle';boss.t=99;P.x=boss.x-6;for(k=0;k<60;k++)step(STEP);
 var y0=P.y;keys.up=true;act();var a=P.atk+' vy='+P.vy+' g='+P.grounded;keys.up=false;actUp();var log=[];for(k=0;k<30;k++){step(STEP);if(k%5==0)log.push((P.y-y0).toFixed(2)+'/'+P.vy.toFixed(1))}return a+' | '+log.join(' ')})()`)));await b.close()})();
