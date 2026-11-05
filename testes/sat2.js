const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const vs=JSON.parse(process.argv[2]),lvs=[0,3,11];
for(const [nm,g] of vs){
const ctx=await b.newContext({viewport:{width:800,height:370},isMobile:true,hasTouch:true,deviceScaleFactor:1});
const pg=await ctx.newPage();pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(g=>{window.requestAnimationFrame=()=>1;if(g!=='def')window.__grade=g;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))},g);
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
for(const l of lvs){await E(`startLevel(${l});card.hidden=true;state='play';for(var i=0;i<40;i++)step(1/60);P.inv=0;animate(.016);for(var k=0;k<3;k++){renderer.shadowMap.needsUpdate=true;render()}`);
await pg.screenshot({path:__dirname+`/fotos/sat_${nm}_${l}.png`})}
await ctx.close()}
await b.close()})();
