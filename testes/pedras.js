const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:400,height:200}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
console.log(await pg.evaluate(()=>window.__ev(`(function(){startLevel(10);beginPlay();hearts=99;P.x=300;P.y=34.8;for(var k=0;k<30;k++)step(STEP);P.x=309;for(k=0;k<20;k++)step(STEP);resetKids();var res=[];
 for(var tr=0;tr<6;tr++){boss.state='dive';boss.dt=0;boss.yy=0;boss.rockT=.3;P.inv=0;var h0=hearts,n=0,dir=1,src=[];var oh=hurt;hurt=function(x){src.push(boss.rocks.some(function(r){return Math.abs(r.x-x)<.01})?'pedra':(boss.state==='dive'||Math.abs(x-boss.x)<.01?'chefe':'onda'));oh(x)};P.x=312+tr;
  for(k=0;k<90*2.4;k++){var danger=boss.rocks.some(function(r){return r.t>.3&&Math.abs(r.x-P.x)<1.4});if(danger){var r0=boss.rocks.filter(function(r){return Math.abs(r.x-P.x)<1.4})[0];dir=P.x<r0.x?-1:1;if(P.x+dir*3<boss.aL+1)dir=1;if(P.x+dir*3>boss.aR-1)dir=-1;keys.left=dir<0;keys.right=dir>0}else{keys.left=keys.right=false}
   step(STEP);n=Math.max(n,boss.rocks.length)}keys.left=keys.right=false;hurt=oh;res.push('max '+n+' dano: '+src.join(','))}
 return res.join(' | ')})()`)));await b.close()})();
