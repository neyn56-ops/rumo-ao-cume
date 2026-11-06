/* foto de 4 mundos gerados pelo robô: node testes/fotorb.js 23:40 26:120 28:60 31:150 saida.png */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const a=process.argv.slice(2),out=a.pop();const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:480,height:270}});const er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'mid',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);const shots=[];
for(const q of a){const [n,x]=q.split(':').map(Number);await pg.evaluate(c=>window.__ev(c),`(function(){rbMundo(${n});leaveMap();startLevel(${n}-1);beginPlay();card.hidden=true;state='play';P.inv=1e9;var X=${x};var t=-99;solids.forEach(function(s){if(X>=s.l&&X<=s.r&&s.t>t)t=s.t});for(var k=0;k<120;k++){P.x=X;P.y=t>-50?t:0;P.vy=0;P.grounded=true;step(1/60);animate(1/60);updateCamera(1/60)}render()})()`);
 shots.push(await pg.screenshot());}
const tile=shots.map(s=>'data:image/png;base64,'+s.toString('base64'));
const p2=await b.newPage({viewport:{width:960,height:540}});await p2.setContent('<body style="margin:0;display:grid;grid-template-columns:480px 480px">'+tile.map(t=>'<img src="'+t+'">').join('')+'</body>');
await p2.screenshot({path:out});if(er.length)console.log('erros',er.slice(0,3));await b.close()})();
