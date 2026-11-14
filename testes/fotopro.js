/* fotos do prólogo: node testes/fotopro.js saida.png */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:640,height:340}});await pg.route(/fonts/,r=>r.abort());const er=[];pg.on('pageerror',e=>er.push(e.message));
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2,lang:'pt'}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2500);const shots=[];
for(const [x,y,pre] of [[-2,3,''],[51.5,4.2,''],[76,5,''],[101,-1.5,'']]){
 await pg.evaluate(c=>window.__ev(c),`(function(){leaveMap();if(!PR||!LV.prologue)proStart();P.inv=1e9;for(var k=0;k<150;k++){P.x=${x};P.y=${y};P.vy=0;P.grounded=true;step(1/60);animate(1/60);updateCamera(1/60)}render();1})()`);
 shots.push((await pg.screenshot()).toString('base64'))}
const p2=await b.newPage({viewport:{width:1280,height:680}});await p2.setContent('<body style="margin:0;display:grid;grid-template-columns:640px 640px">'+shots.map(s=>'<img src="data:image/png;base64,'+s+'">').join('')+'</body>');
await p2.screenshot({path:process.argv[2]});if(er.length)console.log(er.slice(0,3));await b.close()})();
