const {chromium}=require('/opt/npm-tools/node_modules/playwright');const rotas=require('./rotas.js');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:400,height:200}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);const E=c=>pg.evaluate(c=>window.__ev(c),c);
const calm='windZones.forEach(function(w){w.per=1e9});';
const P=[[[150,156,15],[159.5,162.5,16.5]],[[159.5,162.5,16.5],[165.5,168.5,18]],[[165.5,168.5,18],[171,184,19.5]],[[199,208,21],[211,214,22.5]],[[211,214,22.5],[217,220,24]],[[217,220,24],[223,226,25.2]],[[223,226,25.2],[229,240,26]]].map(p=>[p[0],p[1],calm]);
console.log('ilhas e nuvens:',JSON.stringify(await rotas(E,10,P)));
await b.close()})();
