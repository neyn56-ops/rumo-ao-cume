const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:640,height:300}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`(function(){var o={},k;function go(x,y){startLevel(16);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;P.big=false;P.x=x;P.y=y;P.vy=0;P.vx=0;for(k=0;k<20;k++)step(STEP)}
 /* 1) giratório em cima do tijolo quebra e desce */
 go(6.5,49);var y0=P.y;P.sjbuf=.13;keys.jump=true;for(k=0;k<150;k++){step(STEP);if(k>3)keys.jump=false}o.spinDown=(y0-P.y).toFixed(2);
 /* pulo normal não quebra */go(15.5,49);y0=P.y;keys.jump=true;P.jbuf=.13;for(k=0;k<150;k++){step(STEP);if(k>3)keys.jump=false}o.jumpNoBreak=(y0-P.y).toFixed(2);
 /* 2) cabeçada por baixo quebra (Kuro pequeno) */go(5.5,43);var n0=MZ.bricks.filter(function(c){return c.dead}).length;keys.jump=true;P.jbuf=.13;for(k=0;k<100;k++){step(STEP);if(k>20)keys.jump=false}o.headBreak=MZ.bricks.filter(function(c){return c.dead}).length-n0;
 /* 3) bandeira falsa leva para o começo */go(5.2,1);for(k=0;k<30;k++){P.x+=.03;step(STEP)}o.fake=P.x.toFixed(1)+','+P.y.toFixed(1);
 /* 4) porta trancada sem chave */go(53.5,1);keys.right=true;for(k=0;k<200;k++)step(STEP);keys.right=false;o.doorBlock=P.x.toFixed(2);
 /* 5) pega a chave, morre, perde a chave */go(41.5,8);P.x=MZ.key.x;P.y=MZ.key.y-.6;step(STEP);o.gotKey=!!(MZ.key.got&&P.key);P.inv=0;hearts=3;P.big=false;hurt(P.x+1,1);for(k=0;k<400&&state!=='play';k++)step(STEP);o.afterHurtKey=MZ.key.got;
 lose&&0;
 /* 6) chave na fechadura abre a porta; porta deixa passar */go(41.5,8);P.x=MZ.key.x;P.y=MZ.key.y-.6;step(STEP);P.x=MZ.lock.x+1;P.y=MZ.lock.y-.8;for(k=0;k<10;k++)step(STEP);o.used=MZ.used;for(k=0;k<200;k++)step(STEP);
 P.x=53.5;P.y=1;keys.right=true;for(k=0;k<300&&state==='play';k++)step(STEP);keys.right=false;o.exit=state+' x '+P.x.toFixed(1);card.hidden=true;
 return JSON.stringify(o)})()`));
console.log('erros',er.slice(0,3));await b.close()})();
