const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:400,height:200}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);const E=c=>pg.evaluate(c=>window.__ev(c),c);
for(const x of [35,38.6,50,51.5])console.log('x='+x,await E(`(function(){startLevel(10);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;windZones.forEach(function(w){w.per=1;w.on=1;w.ph=0});P.x=${x};P.y=4;for(var k=0;k<90*2;k++)step(STEP);return 'depois de 2s de rajada: x='+P.x.toFixed(2)+' estado='+state})()`));
await b.close()})();
