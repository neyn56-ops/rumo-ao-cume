/* verifica se há blocos/plataformas no espaço onde a tartaruga guerreira voa em volta do bloco da pena */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const r=await pg.evaluate(()=>window.__ev(`(function(){var out=[];for(var L=0;L<LEVELS.length;L++){startLevel(L);
  if(typeof skUpd==='function'&&LV.cubes){/* cubos que esticam: tamanho cheio */skG.forEach(function(G){G.t=1e-3+((G.q.n||1)-1)*(G.q.g||.42);});skUpd(0)}
  blocks.forEach(function(B){if(B.c!=='feather'||B.t!=='q')return;var Z={l:B.x-3.2,r:B.x+3.2,b:B.y+1.4,t:B.y+3.6},hit=[];
   solids.forEach(function(q){if(q===B.solid||q.hid)return;var ql=q.l,qr=q.r;if(q.mover){ql=q.cx-q.range-q.w/2;qr=q.cx+q.range+q.w/2}
     if(qr>Z.l&&ql<Z.r&&q.t>Z.b&&q.b<Z.t)hit.push((q.block?'bloco':q.sky?('cubo'+q.sky):'plat')+'['+ql.toFixed(1)+'..'+qr.toFixed(1)+' y'+q.b.toFixed(1)+'..'+q.t.toFixed(1)+']')});
   if(hit.length)out.push('M'+(L+1)+' pena@'+B.x+','+B.y+': '+hit.join(' '))})}
  return JSON.stringify(out)})()`));
console.log(JSON.parse(r).join('\n')||'tudo livre');await b.close()})();
