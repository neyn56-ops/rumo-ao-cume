const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const xs=JSON.parse(process.argv[2]||'[2,22,48,62,70,90,116]');
await E(`startLevel(16);beginPlay();card.hidden=true;state="play";P.inv=1e9;enemies.forEach(function(e){e.alive=false;if(e.g)e.g.visible=false});P.x=61.5;P.y=4.2;step(1/60);P.inv=0;P.x=63;P.y=4;P.face=1;for(var k=0;k<40;k++){P.x=63;step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+"/fotos/chave1.png"});await E(`P.x=MZ.lock.x;for(var k=0;k<12;k++){P.x=MZ.lock.x;step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+"/fotos/chave2.png"});await E(`for(var k=0;k<60;k++){P.x=MZ.lock.x;step(1/60);animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+"/fotos/chave3.png"});
console.log('erros',er.slice(0,3));await b.close()})();
