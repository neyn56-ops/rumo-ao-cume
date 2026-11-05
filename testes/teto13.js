/* procura lugares no Mundo 13 onde o Kuro fica sem espaço para pular (teto baixo em cima de um apoio) */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const r=await pg.evaluate(()=>window.__ev(`(function(){startLevel(12);beginPlay();var out=[],SUP=[];
  /* apoios: cada grupo de cubos no tamanho cheio, ilhas, blocos */
  skG.forEach(function(G,i){var q=G.q,n=G.cs.length,l,r,t;if(q.k==='gh'){var d=q.d||1;l=d>0?q.x-.5:q.x+.5-n;r=d>0?q.x-.5+n:q.x+.5;t=q.y}else if(q.k==='gv'){l=q.x-.5;r=q.x+.5;t=q.y-1+n}else if(q.k==='f'){l=q.x-.5;r=q.x-.5+n;t=q.y}else{l=q.x-.5;r=q.x+.5;t=q.y}SUP.push({n:'cubo'+i+q.k,l:l,r:r,t:t,b:(q.k==='gv'?q.y-1:t-1),own:G})});
  LV.solids.forEach(function(s){SUP.push({n:'ilha@'+s[2],l:s[0],r:s[1],t:s[2],b:s[2]>.5?s[2]-2.7:s[2]-.5})});
  (LV.blocks||[]).forEach(function(bk){SUP.push({n:'bloco'+bk.t+'@'+bk.x+','+bk.y,l:bk.x-.5,r:bk.x+.5,t:bk.y+1,b:bk.y})});
  SUP.forEach(function(a){SUP.forEach(function(c){if(a===c)return;var ov=Math.min(a.r,c.r)-Math.max(a.l,c.l);if(ov<=.05)return;var gap=c.b-a.t;if(gap>0&&gap<3.6)out.push(a.n+' -> teto '+c.n+' folga='+gap.toFixed(2)+' sobrepoe='+ov.toFixed(2))})});
  return JSON.stringify(out)})()`));
console.log(JSON.parse(r).join('\n'));await b.close()})();
