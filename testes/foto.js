/* fotos de tela: node testes/foto.js <fase 1-11> <preset> x,y[,nome] x,y ...   (salva em testes/fotos/) */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
const [,,fase,preset,...pts]=process.argv;fs.mkdirSync(__dirname+'/fotos',{recursive:true});
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:+(process.env.VW||900),height:+(process.env.VH||405)}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},preset||'high');
await pg.goto('file://'+__dirname+'/teste.html'+(preset==='vlow'||preset==='low'?'?lite=1':''),{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);await E(`startLevel(${(+fase)-1});beginPlay();1`);
for(const p of pts){const [x,y,nome,extra]=p.split(',');await E(`(function(){P.x=${x};P.y=${y};P.vx=P.vy=0;for(var k=0;k<40;k++){P.x=${x};P.y=Math.max(P.y,${y});${extra?decodeURIComponent(extra):''};step(STEP)}updateCamera(0,true);frame(performance.now()+16);frame(performance.now()+32);return 1})()`);
 const f=__dirname+'/fotos/'+(nome||('f'+fase+'_'+x))+'.png';await pg.screenshot({path:f});console.log(f)}
await b.close()})();
