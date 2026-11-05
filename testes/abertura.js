/* fotos do clipe de abertura em vários momentos */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pre=process.env.PRE||'high';
const pg=await b.newPage({viewport:{width:900,height:405}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},pre);
await pg.goto('file://'+__dirname+'/teste.html'+(pre==='low'?'?lite=1':''),{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E("window.__ft=performance.now();window.__noOpen=false;save.seenOpen=0;startLevel(0);1");
const T=(process.env.TT||"1.5,5.5,7.6,8.4,10.6,13,16.9,19.8").split(",").map(Number);let t=0;
for(const tt of T){await E("(function(){var n=Math.round(("+tt+"-opn.t)/(1/60));for(var i=0;i<n-1;i++){animate(1/60);updateCamera(1/60)}window.__ft+=1000/60;frame(window.__ft);return opn?opn.t:-1})()");await pg.screenshot({path:__dirname+'/fotos/ab'+tt+'.png'});console.log('t',tt)}
const st=await E("(function(){var n=0;while(opn&&n<2000){animate(1/60);n++}return state+' visto='+save.seenOpen+' card='+!card.hidden})()");console.log(st);
await b.close()})();
