const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const ctx=await b.newContext({viewport:{width:800,height:370},isMobile:true,hasTouch:true,deviceScaleFactor:2});
const pg=await ctx.newPage();pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'auto',pMig:1,aaMig:2,cap:60}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const st='JSON.stringify({lvl:autoLvl,k:dynK,pr:renderer.getPixelRatio().toFixed(2),fail:failW,W:cfg.autoW,sh:renderer.shadowMap.type})';
console.log('inicio',await E('startLevel(0);autoSkip=0;'+st));
// 10 s a 60 fps: deve subir para Médio
console.log('60fps 10s',await E('for(var i=0;i<600;i++)perfTick(1/60);'+st));
// no Médio cai para 42 fps: deve voltar (teste) e marcar falha
console.log('42fps',await E('autoSkip=0;for(var i=0;i<130;i++)perfTick(1/42);'+st));
// fica 30 fps no Baixo: resolução baixa
console.log('35fps',await E('autoSkip=0;for(var i=0;i<200;i++)perfTick(1/35);'+st));
console.log('60fps volta res',await E('for(var i=0;i<900;i++)perfTick(1/60);'+st));
console.log('outro mundo',await E('startLevel(3);'+st));
console.log('volta mundo1',await E('startLevel(0);'+st));
await b.close()})();
