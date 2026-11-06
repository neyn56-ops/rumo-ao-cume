/* foto do mapa num mundo: node testes/fotomapa.js 23 saida.png [zoom] */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const [n,out,zm]=process.argv.slice(2);const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:450}});const er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'mid',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
await pg.evaluate(c=>window.__ev(c),`(function(){openMap({from:${n}-1});mapCam.userData.zoom=${zm||1};for(var k=0;k<200;k++)mapUpdate(1/60);render()})()`);
await pg.screenshot({path:out});if(er.length)console.log('erros',er.slice(0,3));await b.close()})();
