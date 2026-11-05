const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pre=process.env.PRE||'high',mob=!!process.env.MOB;
const ctx=await b.newContext({viewport:{width:480,height:216},isMobile:mob,hasTouch:mob});
const pg=await ctx.newPage();pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},pre);
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const POS=JSON.parse(process.argv[2]);
for(const [L,x,y] of POS){let k=0;
 for(const ns of (process.env.SAME?[true,true]:[true,false])){
  const r=await E(`window.__noSplit=${ns};var _s=7;Math.random=function(){_s=(_s*16807)%2147483647;return (_s-1)/2147483646};startLevel(${L});beginPlay();if(typeof trIntro!=='undefined')trIntro=null;enemies.forEach(function(e){e.alive=false;if(e.vis)e.vis.g.visible=false});P.inv=0;tm=0;P.x=${x};P.y=${y};P.vx=0;P.vy=0;dyn=null;fadeIn=0;document.getElementById('fade').style.opacity=0;card.hidden=true;document.getElementById('hud').style.display='none';cfgView={x:${x},y:${y}+1};updateCamera(0,true);
   if(splitQ){splitQ.n=99;splitInstTick()}lushU.time.value=1;var _n=0;W.traverse(function(o){if(o.isInstancedMesh)_n++});animate(0);render();render();_n`);
  await pg.screenshot({path:__dirname+'/fotos/sd2_'+L+'_'+x+'_'+(k++?'b':'a')+'.png'});console.log(L,x,ns,'inst',r)}
}
await b.close()})();
