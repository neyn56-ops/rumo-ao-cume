const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:900,height:405}});pg.on('pageerror',e=>console.log('ERRO',e.message,(e.stack||'').split('\n')[1]));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`(function(){startLevel(10);beginPlay();P.inv=1e9;hearts=99;P.x=300;P.y=34.8;for(var k=0;k<30;k++)step(STEP);P.x=309;for(k=0;k<20;k++)step(STEP);
 boss.hp=1;boss.state='stun';boss.t=2;bossHit('katana');for(k=0;k<200;k++)step(STEP);var open=boss.wallR&&boss.wallR.dead;
 keys.right=true;for(k=0;k<90*8&&state==='play';k++){if(P.grounded&&P.x>330&&P.x<337){keys.jump=true;P.jbuf=.13}else keys.jump=false;step(STEP)}keys.right=false;keys.jump=false;
 window.__T0=performance.now();return 'parede aberta='+open+' estado='+state+' P='+P.x.toFixed(1)+','+P.y.toFixed(1)+' final='+!!sumEnd})()`));
let shot=0;for(let i=1;i<=600;i++){await E(`frame(__T0+${i*16});1`);if([60,180,330,520,600].includes(i)){await pg.screenshot({path:__dirname+'/fotos/fim_'+(shot++)+'.png'})}}
console.log(await E(`'cartão='+!document.getElementById('card').hidden+' titulo='+document.getElementById('cardTitle').textContent+' t='+(sumEnd?sumEnd.t.toFixed(1):'-')`));
await b.close()})();
