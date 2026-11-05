const {chromium}=require('/opt/npm-tools/node_modules/playwright');const rotas=require('./rotas.js');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:400,height:200}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);const E=c=>pg.evaluate(c=>window.__ev(c),c);
const calm='windZones.forEach(function(w){w.per=1e9});';
const P=[[[-6,18,0],[21,32,2]],[[21,32,2],[32,39.5,4]],[[32,39.5,4],[41,44,4],'','sobre a pedra'],[[41,44,4],[47,52,4]],[[47,52,4],[53.4,58,4]],[[53.4,58,4],[58,66,6.2]],[[58,66,6.2],[68.5,71.5,8.2]],[[68.5,71.5,8.2],[74,77,10.2]],[[74,77,10.2],[79,92,10.5]],
 [[101,104,11],[105.4,112,11]],[[105.4,112,11],[115,119.5,13]],[[115,119.5,13],[121,126,13]],[[121,126,13],[129,150,15]]].map(p=>[p[0],p[1],calm,p[3]]);
console.log('caminho sem vento:',JSON.stringify(await rotas(E,10,P)));
const semVento=await rotas(E,10,[[[79,92,10.5],[101,112,11],calm,'vão longo sem vento']]);
const comVento=await rotas(E,10,[[[79,92,10.5],[101,112,11],'windZones.forEach(function(w){w.per=1;w.on=1;w.ph=0});','vão longo com vento a favor']]);
console.log('vão longo sem vento (deve falhar):',semVento.length?'falhou ok':'PASSOU (fácil demais)','| com vento:',comVento.length?'FALHOU':'ok');
const mola=await E(`(function(){startLevel(10);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;windZones.forEach(function(w){w.per=1e9});P.x=96;P.y=5;for(var k=0;k<10;k++)step(STEP);keys.right=true;var mx=0,ok=false;for(k=0;k<90*4;k++){step(STEP);mx=Math.max(mx,P.y);if(P.grounded&&P.y>10.9&&P.x>101){ok=true;break}}keys.right=false;return 'mola da saliência: '+(ok?'volta para cima':'NÃO volta')+' (altura '+mx.toFixed(1)+')'})()`);console.log(mola);
const mola2=await E(`(function(){startLevel(10);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;P.x=137;P.y=15;for(var k=0;k<10;k++)step(STEP);var mx=0;P.x=138;for(k=0;k<90*3;k++){P.x=138;step(STEP);mx=Math.max(mx,P.y)}return 'mola do cristal alcança altura '+mx.toFixed(1)+' (cristal em 21.5)'})()`);console.log(mola2);
await b.close()})();
