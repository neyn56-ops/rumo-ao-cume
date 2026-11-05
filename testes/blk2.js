const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:640,height:300}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`startLevel(${process.env.L||14});beginPlay();if(${process.env.L?0:1})mineFall();enemies.forEach(function(e){e.alive=false});P.inv=1e9;var out=[],k;
 blocks.filter(function(b){return b.t==='q'}).forEach(function(B){var it0=items.length,h0=hearts;P.x=B.x;P.y=Math.max(0,floorBelow(B.x,B.y-.1));P.vx=0;P.vy=0;P.grounded=true;P.onPlat=null;for(k=0;k<10;k++)step(1/60);
   P.jbuf=.13;keys.jump=true;for(k=0;k<40;k++){P.x=B.x;step(1/60)}keys.jump=false;var hit=B.state!=='ready';
   var got=false;for(k=0;k<240;k++){var it=items[items.length-1];if(it&&!it.got){P.x+=(it.x-P.x)*.2}step(1/60);if(items.length>it0&&items.slice(it0).every(function(q){return q.got}))got=true}
   var it=items[items.length-1];out.push(B.x+' '+B.c+' bateu:'+hit+' pegou:'+got+' itens:'+(items.length-it0)+' '+(it?JSON.stringify({t:it.type,got:it.got,x:+it.x.toFixed(1),y:+it.y.toFixed(1)}):''))});JSON.stringify(out)`));
console.log('erros',er);await b.close()})();
