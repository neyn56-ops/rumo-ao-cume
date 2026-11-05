const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:900,height:405}});pg.on('pageerror',e=>console.log('ERRO',e.message,(e.stack||'').split('\n')[1]));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`(function(){startLevel(10);beginPlay();P.inv=1e9;hearts=99;P.x=300;P.y=34.8;for(var k=0;k<30;k++)step(STEP);P.x=309;for(k=0;k<20;k++)step(STEP);return 'arena='+P.arena+' chefe='+boss.state+' v2='+boss.v2})()`));
const moves=[];for(let h=6;h>=1;h--){const r=await E(`(function(){var seen={};for(var k=0;k<90*14;k++){P.inv=1e9;step(STEP);seen[boss.state+(boss.quake?'q':'')]=1;if(boss.waves.length)seen.ondas=1;if(boss.rocks.length)seen.pedras=1}
  boss.state='stun';boss.t=2;bossHit('katana');return 'hp='+boss.hp+' fase='+bossV2Phase(boss)+' viu='+Object.keys(seen).join(',')+' armadura='+boss.armor.filter(function(m){return m.visible}).length+' asas='+boss.wings[0].p.visible})()`);moves.push(r);console.log(r);
  if(h===5||h===3||h===1){await E(`updateCamera(0,true);frame(performance.now()+16);1`);await pg.screenshot({path:__dirname+'/fotos/chefe_'+h+'.png'})}}
console.log(await E(`(function(){for(var k=0;k<200;k++)step(STEP);var c=items.filter(function(i){return i.type==='core'})[0];if(!c)return 'sem núcleo, chefe='+boss.state;P.x=c.x;P.y=c.y-.8;P.vy=0;for(k=0;k<90;k++){step(STEP);if(state!=='play')break}return 'final: jogo='+state+' titulo='+document.getElementById('cardTitle').textContent})()`));
await b.close()})();
