const {chromium}=require('/opt/npm-tools/node_modules/playwright');const rotas=require('./rotas.js');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);const X='if(trIntro)trIntro.on=false;';
const pares=[[[186,206,2.6],[206,212,1.4]],[[206,212,1.4],[213.6,215.4,1.2]],[[213.6,215.4,1.2],[217.2,219,1.5]],[[217.2,219,1.5],[220.8,222.6,1.3]],[[220.8,222.6,1.3],[224.4,226.2,1.6]],[[224.4,226.2,1.6],[228,233,1.4]],
 [[252,258,1.2],[258,261,2.2]],[[258,261,2.2],[261,277,2.2]],[[277,280,2.2],[282,283.8,1.6]],[[282,283.8,1.6],[285.6,287.4,1.3]],[[285.6,287.4,1.3],[289.2,291,1.5]],[[289.2,291,1.5],[292.8,318,1.2]]];
const f=await rotas(E,11,pares.map(p=>[p[0],p[1],X]));console.log('falhas:',JSON.stringify(f));
console.log(await E(`(function(){startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;P.x=232.4;P.y=1.4;for(var k=0;k<10;k++)step(STEP);
  var st=0,ok=false;for(k=0;k<120*40;k++){var lg=null;trRiv.logs.forEach(function(o){if(o.so.l>233.0&&o.so.l<233.5&&!o.so.dead)lg=o});
   keys.right=false;keys.jump=false;
   if(st===0&&P.grounded&&lg){keys.jump=true;P.jbuf=.13;keys.right=true;st=1}
   else if(st===1){keys.right=!P.grounded||P.x<P.onPlat.x-.3;if(P.grounded&&P.onPlat&&P.onPlat.log)st=2}
   else if(st===2){if(P.onPlat&&P.onPlat.log&&P.onPlat.r>250.6){keys.jump=true;P.jbuf=.13;keys.right=true;st=3}}
   else if(st===3){keys.right=true;if(P.grounded&&P.x>252.2&&P.y>1.1){ok=true;break}}
   step(STEP);if(hearts<99&&st<3){return 'caiu no rio st='+st+' x='+P.x.toFixed(1)}}
  return 'troncos:'+ok+' st='+st})()`));
console.log(await E(`(function(){startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});hearts=3;P.x=214.2;P.y=.8;for(var k=0;k<30;k++)step(STEP);P.x=216;P.y=.2;P.vy=0;for(k=0;k<90;k++)step(STEP);return 'queda: coracoes='+hearts+' x='+P.x.toFixed(1)+' y='+P.y.toFixed(1)})()`));
await b.close()})();
