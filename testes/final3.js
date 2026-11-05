const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:1400,height:630}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.__CLOSE=1;window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`startLevel(10);beginPlay();P.x=341;P.y=37.6;for(var k=0;k<30;k++)step(STEP);window.__ft=performance.now();cumeEnding();if(window.__CLOSE){var _u=updEnding;updEnding=function(dt){_u(dt);sumEnd.cx=P.x-.6;sumEnd.cy=P.y+.6;sumEnd.zoom=.32}}1`);
for(const T of (process.env.TS||'.7,2,4.4,6').split(',')){await E(`(function(){if(sumEnd.t<${T}-.25){var d=${T}-.25-sumEnd.t;var f=Math.ceil(d/.05);for(var i=0;i<f;i++)animate(.05)}for(var i=0;i<12;i++){window.__ft+=16.7;frame(window.__ft)}return 1})()`);
 await pg.screenshot({path:__dirname+'/fotos/fc_'+T+'.png'});console.log('foto',T)}
await b.close();console.log('FIM')})();
