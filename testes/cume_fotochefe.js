const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
for(const pre of ['high','vlow']){const pg=await b.newPage({viewport:{width:900,height:405}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},pre);
await pg.goto('file://'+__dirname+'/teste.html'+(pre==='vlow'?'?lite=1':''),{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`(function(){startLevel(10);beginPlay();P.inv=0;hearts=99;P.x=300;P.y=34.8;for(var k=0;k<30;k++)step(STEP);P.x=309;for(k=0;k<120;k++){step(STEP);P.inv=0}return 1})()`);
for(const [tag,code] of [['a',''],['b','boss.hp=2;bossV2Hurt(boss);boss.state="dive";boss.dt=1.2;boss.yy=7.5;']]){
 await E(`(function(){${code}for(var j=0;j<12;j++){if(boss.state==='dive')boss.dt=Math.min(boss.dt,1.5);P.inv=0;step(STEP);updateCamera(0,true);frame(performance.now()+16*j)}return 1})()`);
 await pg.screenshot({path:__dirname+'/fotos/arena_'+pre+'_'+tag+'.png'})}
await pg.close()}
await b.close()})();
