const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:1600,height:720}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`(function(){startLevel(10);beginPlay();P.inv=0;hearts=99;P.x=300;P.y=34.8;for(var k=0;k<30;k++)step(STEP);P.x=309;for(k=0;k<20;k++)step(STEP);resetKids();boss.state='stun';boss.t=99;boss.x=323;P.x=316;P.face=1;for(k=0;k<90;k++){step(STEP);animate(STEP)}return 1})()`);
const shots=[['postura',''],['carregando','act();for(var k=0;k<40;k++){step(STEP);animate(STEP)}'],['golpe_forte','actUp();for(var k=0;k<14;k++){step(STEP);animate(STEP)}'],['corte_cima','P.slashT=0;for(var k=0;k<60;k++){step(STEP);animate(STEP)}keys.up=true;act();keys.up=false;actUp();for(k=0;k<14;k++){step(STEP);animate(STEP)}'],['shuriken','for(var k=0;k<60;k++){step(STEP);animate(STEP)}throwStar();for(k=0;k<9;k++){step(STEP);animate(STEP)}']];
for(const [n,c] of shots){const pp=JSON.parse(await E(`(function(){${c};P.inv=0;boss.state='stun';boss.t=99;updateCamera(0,true);frame(performance.now());var v=new T.Vector3(P.x+2,P.y+1.2,0).project(camera);return JSON.stringify([(v.x+1)/2*innerWidth,(1-v.y)/2*innerHeight])})()`));
 await pg.screenshot({path:'fotos/l_'+n+'.png',clip:{x:300,y:250,width:800,height:400}})}
await b.close()})();
