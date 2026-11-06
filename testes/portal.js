/* testa a versão do portal (portal/index.html): node testes/portal.js [en|pt] [foto.png] — sem __noLoad, como um jogador novo */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const lang=process.argv[2]||'en',foto=process.argv[3];const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:960,height:540},locale:lang==='en'?'en-US':'pt-BR'});const er=[];pg.on('pageerror',e=>er.push(e.message));
const fs=require('fs');let h=fs.readFileSync(__dirname+'/../portal/index.html','utf8');const i=h.indexOf('})();\n</script>');h=h.slice(0,i)+'\nwindow.__ev=function(c){return eval(c)};\n'+h.slice(i);fs.writeFileSync(__dirname+'/../portal/teste.html',h);
await pg.route(/fonts/,r=>r.abort());await pg.goto('file://'+__dirname+'/../portal/teste.html',{waitUntil:'domcontentloaded'});const E=c=>pg.evaluate(c=>window.__ev?window.__ev(c):null,c);
const t0=Date.now();for(let k=0;k<80;k++){if(await E("state==='play'"))break;await pg.waitForTimeout(500)}
const r=await E("({state:state,level:levelIdx,lang:LANG,unl:save.unlocked,toast:(document.getElementById('toast')||{}).textContent})");
console.log('jogando em',((Date.now()-t0)/1000).toFixed(1)+'s',JSON.stringify(r));
if(foto){await pg.waitForTimeout(800);await pg.screenshot({path:foto})}
/* passa pelas telas para achar texto sem tradução */
const f=await E(`(function(){try{showMenu();openMap();mapShowPanel(0);leaveMap();startLevel(1);hearts=0;try{lose&&lose()}catch(e){}winLevel();winGame();if(window.__openCfg)window.__openCfg()}catch(e){return 'ERRO '+e.message}return 1})()`);await pg.waitForTimeout(400);const f2=await E(`(function(){
 var bad=[];var w=document.createTreeWalker(document.body,4);while(w.nextNode()){if(/^(SCRIPT|STYLE)$/.test(w.currentNode.parentNode.nodeName))continue;var v=w.currentNode.nodeValue.trim();if(v&&/[ãõçáéíóúâêôà]|\b(de|do|da|que|para|com|não|fase|mundo)\b/i.test(v))bad.push(v.slice(0,70))}
 return JSON.stringify({faltando:idiomaFaltando().slice(0,40),naTela:bad.slice(0,40)})})()`);
console.log(f2);if(er.length)console.log('erros',er.slice(0,3));await b.close()})();
