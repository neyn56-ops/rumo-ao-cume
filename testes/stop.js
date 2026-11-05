const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:640,height:300}});let er=[];pg.on('pageerror',e=>er.push(e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
console.log(await E(`startLevel(14);beginPlay();mineFall();enemies.forEach(function(e){e.alive=false});P.inv=1e9;var k;for(k=0;k<200;k++)step(1/60);var o={pousou:P.grounded,x:P.x.toFixed(2),noCarro:!!(P.onPlat&&mnCarts.some(function(K){return K.so===P.onPlat}))};
 P.x=17;P.y=0;P.vx=0;keys.right=true;for(k=0;k<200;k++)step(1/60);keys.right=false;o.barrado=P.x<21.4;o.xb=P.x.toFixed(2);
 /* andar de vagonete até o batente e sair pulando */
 var K=mnCarts.find(function(c){return c.ri===5||c.rail0===5});o.carro=!!K;JSON.stringify(o)`));
console.log('erros',er);await b.close()})();
