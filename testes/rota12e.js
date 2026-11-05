const {chromium}=require('/opt/npm-tools/node_modules/playwright');const rotas=require('./rotas.js');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);const X='if(trIntro)trIntro.on=false;';
const f=await rotas(E,11,[[[476.5,500,23],[502,506,20.2]],[[502,506,20.2],[508,512,17.2]],[[508,512,17.2],[514,518,14.2]],[[514,518,14.2],[520,568,10]]].map(p=>[p[0],p[1],X]));console.log('falhas',JSON.stringify(f));
console.log(await E(`(function(){startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;P.x=535;P.y=10;for(var k=0;k<10;k++)step(STEP);
 trWF.st='on';trWF.t=0;var pushed=false;for(k=0;k<240;k++){keys.right=true;step(STEP);if(P.x>542.5)break;if(P.vx<-5)pushed=true}var passOn=P.x>542.5;keys.right=false;
 P.x=536.5;P.y=10;P.vx=0;for(k=0;k<20;k++)step(STEP);trWF.st='off';trWF.t=0;var gem=false,g0=gemsGot;
 for(k=0;k<120*3;k++){keys.right=P.x<538.8;if(P.grounded&&P.x>=538.4&&P.y<11){keys.jump=true;P.jbuf=.13}else keys.jump=P.vy>0;step(STEP);if(gemsGot>g0){gem=true;break}}
 keys.right=keys.jump=false;var onLedge=P.y>13;trWF.st='on';trWF.t=.7;for(k=0;k<60;k++)step(STEP);var thrown=P.y<11.5&&P.x<538.2;
 trWF.st='off';trWF.t=0;P.x=536;P.y=10;P.vx=0;for(k=0;k<10;k++)step(STEP);for(k=0;k<200;k++){keys.right=true;step(STEP);if(P.x>543)break}keys.right=false;
 return JSON.stringify({empurra:pushed,passouComAgua:passOn,cristal:gem,naGruta:onLedge,jogadoFora:thrown,passaParada:P.x>543})})()`));
await b.close()})();
