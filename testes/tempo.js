const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:800,height:360}});await pg.route(/fonts/,r=>r.abort());
await pg.goto('file://'+__dirname+'/tempo.html',{waitUntil:'load'});await pg.waitForTimeout(3000);
const t=await pg.evaluate(()=>window.__T);let p=t[0][1];const nav=await pg.evaluate(()=>performance.timing.responseEnd-performance.timing.navigationStart);
console.log('rede',nav);t.forEach(x=>{console.log(x[0],(x[1]-p).toFixed(0));p=x[1]});
const fr=await pg.evaluate(()=>new Promise(r=>{let n=0,t0=performance.now();(function f(){n++;if(performance.now()-t0<1000)requestAnimationFrame(f);else r(n)})()}));console.log('fps',fr);
await b.close()})();
