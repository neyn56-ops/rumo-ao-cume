const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:380}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`var o=[],k;function prep(){startLevel(0);beginPlay();if(typeof trIntro!=='undefined')trIntro=null;P.x=6;P.y=floorBelow(6,20);P.vy=0;P.inv=1e9;enemies.forEach(function(e){e.alive=false});for(k=0;k<20;k++)step(STEP)}
prep();spawnFox(P.x,P.y);fox.state='ride';mountFox();o.push('m0',P.mount);for(k=0;k<30;k++){step(STEP);if(!P.mount){o.push('perdeu em',k,P.inW,P.climb,LV.foxStop);break}}
prep();P.jbuf=.13;keys.jump=true;step(STEP);o.push('vy1',P.vy.toFixed(1),P.grounded,P.jT);step(STEP);spinJump();step(STEP);o.push('sj',P.sj,P.vy.toFixed(1),P.jT,'mT',P.mountT,'gT',P.growT,'st',state,P.stun,P.warp);JSON.stringify(o)`));
await b.close()})();
