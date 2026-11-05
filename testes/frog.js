const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage();pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
console.log(await pg.evaluate(()=>window.__ev(`var o=[],k;startLevel(0);beginPlay();P.mountT=0;var bx=5;for(var xx=5;xx<60;xx+=.5){if(floorBelow(xx,9)===floorBelow(xx,1)&&floorBelow(xx,1)>-1){bx=xx;break}}var f=enemies.find(function(q){return q.type==='beetle'})||enemies[0];enemies.forEach(function(q){if(q!==f)q.alive=false});var fx=bx;f.type='frog';f.x=fx;f.x0=fx-1;f.x1=fx+1;var gy=floorBelow(fx,1);f.y=gy+2.2;f.fg=false;f.vy=4;f.vx=0;f.st='patrol';
P.inv=1e9;P.x=f.x;P.y=f.y+2;P.vy=-2;P.sj=false;for(k=0;k<20;k++){P.x=f.x;step(STEP);o.push(f.y.toFixed(2)+'/'+P.y.toFixed(2)+'/'+(f.slp>0?'S':'-'))}JSON.stringify([gy,o.join(' ')])`)));await b.close()})();
