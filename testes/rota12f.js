const {chromium}=require('/opt/npm-tools/node_modules/playwright');const rotas=require('./rotas.js');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);const X='if(trIntro)trIntro.on=false;windZones.forEach(function(w){w.per=1e9});';
const f=await rotas(E,11,[[[520,568,10],[568,575,11.2]],[[568,575,11.2],[577,597,12.6]],[[577,597,12.6],[597,606,12.6]],[[597,598.8,12.6],[599,604,15.4]],[[599,604,15.4],[606.5,611.5,18.2]],[[606.5,606.6,18.2],[600,605,21],'volta'],[[600,605,21],[607,612,23.8]],[[607,612,23.8],[615,621,25.6]],[[615,621,25.6],[622.5,642,27.6]]].map(p=>[p[0],p[1],X]));console.log('falhas',JSON.stringify(f));
console.log(await E(`(function(){startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;P.x=630;P.y=27.6;for(var k=0;k<10;k++)step(STEP);for(k=0;k<120*5&&state==='play';k++){keys.right=P.x<635;step(STEP)}keys.right=false;return 'estado='+state})()`));
await b.close()})();
