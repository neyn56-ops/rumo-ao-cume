const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:380}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`var o=[],k;startLevel(0);beginPlay();P.mountT=0;var b=enemies[0];enemies.forEach(function(q){if(q!==b)q.alive=false});var bx=5;for(var xx=5;xx<60;xx+=.5){if(floorBelow(xx,9)===floorBelow(xx,1)&&floorBelow(xx,1)>-1){bx=xx;break}}b.type='bat';b.x=bx;b.x0=bx-1;b.x1=bx+1;b.base=b.y=floorBelow(bx,1)+4;b.speed=0;b.st='patrol';var y0=b.y;
P.inv=1e9;P.x=b.x;P.y=b.y+2.5;P.vy=-1;P.sj=false;for(k=0;k<30;k++){P.x=b.x;step(STEP)}for(k=0;k<120;k++){P.x=b.x-8;step(STEP)}
for(k=0;k<700;k++){P.x=b.x-15;P.y=floorBelow(P.x,30);step(STEP);if(k%100==0)o.push([k,b.y.toFixed(2),(b.slp||0).toFixed(2),b.wake,b.st,b.x.toFixed(1)].join(' '))}o.push('y0 '+y0+' alive '+b.alive);o.join(' | ')`));
await b.close()})();
