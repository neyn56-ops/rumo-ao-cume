const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
for(const pre of (process.env.PRES||'low,med,high,ultra,max').split(',')){
const ctx=await b.newContext({viewport:{width:800,height:370},isMobile:true,hasTouch:true,deviceScaleFactor:2});
const pg=await ctx.newPage();pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},pre);
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
let o=pre+' pr='+await E('renderer.getPixelRatio().toFixed(2)+" sh="+sun.shadow.mapSize.x')+' |';
for(const l of [0,11]){o+=' L'+l+':'+await E(`startLevel(${l});card.hidden=true;state='play';for(var i=0;i<30;i++)step(1/60);animate(.016);for(var k=0;k<50;k++)splitInstTick();renderer.info.autoReset=false;renderer.info.reset();render();Math.round(renderer.info.render.triangles/1000)+'k'`)}
console.log(o);await ctx.close()}
await b.close()})();
