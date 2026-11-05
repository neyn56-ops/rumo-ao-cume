const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const S=[['j',`P.x=314.8;var L=flWl.filter(function(l){return l.d.x===315}).sort(function(a,b){return Math.abs(a.y-11)-Math.abs(b.y-11)})[0];P.y=L.so.t`],['k',`P.x=325;var L=flWl.filter(function(l){return l.d.x===325}).sort(function(a,b){return Math.abs(a.y-5)-Math.abs(b.y-5)})[0];P.y=L.so.t`],['l',`var T=enemies.filter(function(e){return e.type==='turtle'});P.x=T[1].x;P.y=T[1].y+3;P.vy=2`]];
for(const [n,c] of S){await E(`startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;${c};step(1/60);for(var k=0;k<200;k++){animate(1/60);updateCamera(1/60)}P.inv=0;render();1`);await pg.screenshot({path:__dirname+'/fotos/m16/s'+n+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
