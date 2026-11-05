/* compara fotos com e sem a divisão dos blocos grandes (tem que ficar igual) */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pre=process.env.PRE||'med';
const pg=await b.newPage({viewport:{width:480,height:216}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;Math.random=(function(){var s=7;return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}})();localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},pre);
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const POS=JSON.parse(process.argv[2]);let worst=0;
for(const [L,x,y] of POS){const shots=[];
 for(const ns of (process.env.SAME?[true,true]:[true,false])){await E(`window.__noSplit=${ns};startLevel(${L});beginPlay();if(typeof trIntro!=='undefined')trIntro=null;enemies.forEach(function(e){e.alive=false;if(e.vis)e.vis.g.visible=false});P.inv=0;tm=0;P.x=${x};P.y=${y};P.vx=0;P.vy=0;dyn=null;fadeIn=0;document.getElementById('fade').style.opacity=0;card.hidden=true;document.getElementById('hud').style.display='none';cfgView={x:${x},y:${y}+1};updateCamera(0,true);window.__ft=performance.now();for(var i=0;i<3;i++){window.__ft+=16;frame(window.__ft)}1`);
   shots.push(await pg.screenshot({path:__dirname+'/fotos/sd_'+L+'_'+x+'_'+(shots.length?'b':'a')+'.png'}))}
}
await E('window.__noSplit=false;1');await b.close()})();
