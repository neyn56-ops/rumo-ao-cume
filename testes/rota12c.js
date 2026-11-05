const {chromium}=require('/opt/npm-tools/node_modules/playwright');const rotas=require('./rotas.js');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
/* bot do cogumelo: parte de (x0,y0), pula no cogumelo de centro mx, depois vai para o alvo [l,r,t] */
const tests=[[323,1.2,330.2,[334.5,340,6.4]],[338.5,6.4,345,[350.5,356.5,7.6]],[366,1.2,369.5,[374,380.5,10.6]],[379.5,1.2,385,[388,404,1.6]]];
for(const [x0,y0,mx,T] of tests){
 const r=await E(`(function(){startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;P.x=${x0};P.y=${y0};for(var k=0;k<20;k++)step(STEP);
  var T=${JSON.stringify(T)},st=0,bounced=false,ok=false,maxy=0;
  for(k=0;k<120*8;k++){keys.left=false;keys.right=false;keys.jump=false;
   if(st===0){keys.right=P.x<${mx}-1.6;if(P.grounded&&P.x>=${mx}-1.7&&${y0}<${mx===345?99:2}){keys.jump=true;P.jbuf=.13;st=1}else if(P.x>=${mx}-1.7&&${y0}>=2){keys.right=true;st=1}}
   else if(st===1){keys.right=P.x<${mx}-.2;keys.left=P.x>${mx}+.3;if(P.vy>15)st=2}
   else if(st===2){keys.right=P.x<(T[0]+T[1])/2;if(P.grounded&&P.y>=T[2]-.2&&P.x>T[0]&&P.x<T[1]){ok=true;break}}
   if(P.vy>15)bounced=true;maxy=Math.max(maxy,P.y);step(STEP);if(P.y<-8)break}
  keys.left=keys.right=keys.jump=false;return [${mx},bounced,ok,maxy.toFixed(1)]})()`);
 console.log(JSON.stringify(r))}
const f=await rotas(E,11,[[[292.8,318,1.2],[318,334,1.2],'if(trIntro)trIntro.on=false;'],[[350.5,356.5,7.6],[358,382,1.2],'if(trIntro)trIntro.on=false;']]);console.log('falhas',JSON.stringify(f));
await b.close()})();
