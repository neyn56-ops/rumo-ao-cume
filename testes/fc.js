const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:380}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`startLevel(0);beginPlay();P.fire=true;var e=enemies.find(function(q){return q.alive&&q.type==='beetle'})||enemies[0];P.x=e.x-4;P.y=floorBelow(P.x,e.y+3);e.speed=0;P.face=1;P.inv=1e9;var c0=bank,x0=extraCoins;
for(var k=0;k<5;k++)step(STEP);P.fcd=0;shoot();var ok=false;for(k=0;k<90;k++){step(STEP);animate(STEP);if(!e.alive){ok=true;break}}
for(k=0;k<120;k++){step(STEP);animate(STEP)}render();var d=dropCoins[0];var r={type:e.type,morto:!e.alive,moedasAntes:bank-c0,extra:extraCoins-x0,vis:e.vis&&e.vis.g.visible,noChao:d&&d.rest,y:d&&d.y.toFixed(2),chao:d&&floorBelow(d.x,d.y).toFixed(2)};window.__r=r;JSON.stringify(r)`));
await pg.screenshot({path:__dirname+'/fotos/fc.png'});console.log(await E(`var d=dropCoins[0];P.x=d.x;P.y=floorBelow(d.x,d.y+1);for(var k=0;k<10;k++){step(STEP);animate(STEP)}JSON.stringify({pegou:!d.on,moedas:bank})`));
await b.close()})();
