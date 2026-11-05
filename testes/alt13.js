const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const r=await pg.evaluate(()=>window.__ev(`(function(){startLevel(12);return skG.map(function(G,i){return i+':'+G.q.k+'@'+G.q.x+','+G.q.y+' n'+G.n+' '+(G.alt?('ALT->'+G.alt.mode+(G.alt.mode==='h'?G.alt.dh:'')):(G.q.k==='gh'||G.q.k==='gv'?((G.q.hold||0)>=2.5?'ajudante':'SEM ESPAÇO'):''))}).filter(function(s){return !/ (f|b)@/.test(s)}).join('\\n')})()`));
console.log(r);await b.close()})();
