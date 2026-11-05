/* robô da Escalada (cubos que crescem): para cada par (A -> B) espera vários momentos e tenta pular de A até B */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const R=[['p0',0],[0,1],[1,2],[2,3],[3,4],[4,5],[5,'p1'],['p1',6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,'p2'],['p2',12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,'p3'],
 ['p3',18],[18,19],[19,20],[20,21],[21,22],[22,'p4'],['p4',23],[23,24],[24,25],[25,26],[26,27],[27,28],[28,'p5'],['p5',29],[29,30],[30,31],[31,32],[32,33],[33,'p6']];
const BOT=`(function(A,B){
  var SOL={p0:[-3,27,0],p1:[16,22,22],p2:[12,18,46],p3:[.5,5,68],p4:[10,17,91],p5:[17.5,23,114],p6:[13.5,23,137]};
  function isl(n){var q=SOL[n];for(var i=0;i<solids.length;i++){var s=solids[i];if(Math.abs(s.l-q[0])<.01&&Math.abs(s.r-q[1])<.01&&Math.abs(s.t-q[2])<.01)return s}}
  function cen(n){if(typeof n==='number'){var G=skG[n],a=G.cs.filter(function(c){return !c.so.dead});if(!a.length)a=G.cs;var l=1e9,r=-1e9;G.cs.forEach(function(c){l=Math.min(l,c.so.l);r=Math.max(r,c.so.r)});return (l+r)/2}var s=isl(n);return (s.l+s.r)/2}
  function stand(n,tx){/* onde ficar em A: o cubo vivo mais perto de B (ponta da ponte / topo da coluna) */
    if(typeof n==='number'){var G=skG[n],best=null,bd=1e9;G.cs.forEach(function(c){if(c.so.dead||c.on===false)return;var d=Math.abs(c.cx-tx)-c.so.t*.001*(G.mode==="v"?1000:0);if(d<bd){bd=d;best=c}});if(G.q.k==='f')G.st=0;return best?{x:Math.max(best.so.l+.3,Math.min(best.so.r-.3,best.cx)),t:G.q.k==='gv'?best.so.t:best.so.t,so:best.so}:null}
    var s=isl(n);return {x:Math.max(s.l+.4,Math.min(s.r-.4,tx+(tx>(s.l+s.r)/2?-2.4:2.4))),t:s.t,so:s}}
  function inB(so){if(typeof B==='number')return skG[B].cs.some(function(c){return c.so===so});return so===isl(B)}
  startLevel(12);beginPlay();save.carryFor=-1;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;P.jbuf=0;for(var kk in keys){if(typeof keys[kk]==='boolean')keys[kk]=false}keys.jx=0;keys.jy=0;
  for(var w=0;w<2600;w+=13){
   var bx=cen(B),st,k,launched=false;
   for(k=0;k<w+2;k++){st=stand(A,bx);if(!st)break;P.x=st.x;P.y=st.t;P.prevY=st.t;P.vy=0;P.vx=0;P.grounded=true;P.onPlat=st.so;step(STEP);if(P.vy>15){launched=true;break}}
   if(!st)continue;
   var j=false,t0=0,ok=false;
   for(k=0;k<420;k++){bx=cen(B);var tgt=null;if(typeof B==='number'){var G=skG[B];/* alvo: cubo vivo mais perto */var bd=1e9;G.cs.forEach(function(c){if(c.so.dead||c.on===false)return;var d=Math.abs(c.cx-P.x)+Math.max(0,c.so.t-P.y-3)*2;if(d<bd){bd=d;tgt=c}});if(tgt)bx=tgt.cx}
    var over=tgt?Math.abs(P.x-bx)<.25:(function(){var s=isl(B);return P.x>s.l+.35&&P.x<s.r-.35})();keys.left=keys.right=false;keys.run=true;
    if(!j&&!launched){keys.jump=true;P.jbuf=.13;j=true;t0=k}else keys.jump=k-t0<45;
    if(!over){if(bx>P.x)keys.right=true;else keys.left=true}
    step(STEP);if(P.grounded&&P.onPlat&&inB(P.onPlat)){ok=true;break}if(typeof B==='number'&&skG[B].q.k==='b'&&P.vy>15&&k>3){ok=true;break}
    if(k>12&&P.grounded&&P.onPlat&&!inB(P.onPlat))break;if(P.y<-50)break}
   for(var kk2 in keys){if(typeof keys[kk2]==='boolean')keys[kk2]=false}
   if(ok)return 'ok w='+w}
  return 'FALHOU'})`;
module.exports={R,BOT};
if(require.main===module)(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const only=process.argv[2]?JSON.parse(process.argv[2]):null;const fails=[];
for(const [A,B] of R){if(only&&!only.some(o=>o[0]===A&&o[1]===B))continue;
 const r=await E(BOT+'('+JSON.stringify(A)+','+JSON.stringify(B)+')');if(!r.startsWith('ok'))fails.push(A+'->'+B);console.log(A+'->'+B,r)}
console.log('FALHAS',JSON.stringify(fails));await b.close()})();

