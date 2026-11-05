const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:440}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`(function(){var o={},k;function go(x){startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;P.big=false;P.x=x;P.y=floorBelow(x,40);P.vy=0}
 /* tatu: sai rolando, pulo machuca, fogo mata */
 go(209);var A=enemies.find(function(e){return e.type==='armad'}),st=[];for(k=0;k<160;k++){step(STEP);if(st.indexOf(A.st2)<0)st.push(A.st2)}o.armSt=st.join('>');
 go(209);A=enemies.find(function(e){return e.type==='armad'});A.st2='roll';A.x=212;var h0=hearts;P.y=A.base+2;P.x=212;P.vy=-3;P.sj=true;for(k=0;k<20;k++)step(STEP);o.armSpinHurt=hearts<h0;o.armAliveAfterSj=A.alive;
 o.armFire=killE(A,'fire')&&!A.alive;
 /* broto: não sai com o Kuro em cima; sai e machuca */
 go(191);var S=enemies.find(function(e){return e.type==='sprout'});var mx=0;for(k=0;k<400;k++){P.x=191;step(STEP);mx=Math.max(mx,S.len)}o.sprOver=mx;
 go(188);S=enemies.find(function(e){return e.type==='sprout'});P.inv=1e9;mx=0;for(k=0;k<400;k++){step(STEP);mx=Math.max(mx,S.len)}o.sprUp=mx;
 /* peixe: sai da água e passa da altura do chão */
 go(225);P.inv=1e9;var F=enemies.find(function(e){return e.type==='jfish'});mx=-99;for(k=0;k<400;k++){step(STEP);mx=Math.max(mx,F.y)}o.fishTop=mx.toFixed(2);
 /* tronco: machuca de pé ao lado do eixo quando passa; dá para passar */
 go(244);var hit=0;h0=hearts;for(k=0;k<400;k++){P.x=246;P.y=3.2;P.vy=0;step(STEP);if(hearts<h0){hit=1;break}}o.logHit=hit;
 /* abelha não entra no bloco */
 go(240);P.inv=1e9;var B=enemies.filter(function(e){return e.type==='bee'})[2],bad=0;for(k=0;k<900;k++){P.x=241+Math.sin(k/60)*3;P.y=3.2;step(STEP);if(beeBlk(B.x,B.y))bad++}o.beeInBlock=bad;
 return JSON.stringify(o)})()`));
const S=[['f',224.5,`var F=enemies.find(function(e){return e.type==='jfish'});F.mt=F.wait+F.air*.4`],['g',209,`var A=enemies.find(function(e){return e.type==='armad'});A.st2='roll';A.at=0;A.x=213;A.y=A.base;A.dir=-1`],['h',193.5,`var S=enemies.find(function(e){return e.type==='sprout'});S.pr=2.3;S.len=1`],['i',243,`flLogs[0].a=0.3`]];
for(const [n,x,c] of S){await E(`startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=${x};P.y=floorBelow(${x},40)+.05;for(var i=0;i<20;i++)step(1/60);${c};step(1/60);P.inv=0;for(var k=0;k<60;k++){animate(1/60);updateCamera(1/60)}render();1`);await pg.screenshot({path:__dirname+'/fotos/m16/s'+n+'.png'})}
console.log('erros',er.slice(0,3));await b.close()})();
