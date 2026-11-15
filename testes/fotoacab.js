/* uso: node testes/fotoacab.js pasta — fotos do acabamento: "+1"/estrelas, nome do poder, cartão de vitória contando */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const d=process.argv[2]||'.';
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:480}});const er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2,lang:'pt'}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2500);
const ev=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await ev(`(function(){leaveMap();startLevel(0);beginPlay();card.hidden=true;state='play';P.x=8;P.y=0;for(var k=0;k<40;k++){step(STEP);animate(STEP);updateCamera(STEP)}addCoin();addCoin();fxStomp(P.x+2,P.y);for(k=0;k<12;k++){step(STEP);animate(STEP);updateCamera(STEP)}render();return FX.pops.length+' pops '+FX.pops.filter(function(p){return p.sp.visible}).length})()`));
await pg.screenshot({path:d+'/acab_pop.png'});
console.log(await ev(`(function(){collectItem({type:'feather',x:P.x,y:P.y+1,mesh:new THREE.Object3D()});render();return document.getElementById('fxPower').textContent})()`).catch(e=>'ERR '+e.message));
await pg.waitForTimeout(300);await pg.screenshot({path:d+'/acab_poder.png'});
await ev(`(function(){hurt(P.x+1);render();1})()`);await pg.waitForTimeout(60);await pg.screenshot({path:d+'/acab_dano.png'});
await pg.waitForTimeout(1500);
console.log(await ev(`(function(){gemsGot=3;coinsGot=27;P.inv=0;winLevel();return $('playBtn').textContent+' | '+$('fxBadge').textContent})()`));
await pg.waitForTimeout(500);await pg.screenshot({path:d+'/acab_vit1.png'});
await pg.waitForTimeout(3500);await pg.screenshot({path:d+'/acab_vit2.png'});
console.log(await ev(`$('cardStats').textContent`));
if(er.length)console.log('erros:',er.slice(0,3));await b.close()})();
