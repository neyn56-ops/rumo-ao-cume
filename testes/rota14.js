/* robô da Torre dos Vaga-lumes: pula de apoio em apoio (ilhas = 'iN' índice em LV.solids, engrenagens = número) até o sino */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const R=[['i0',0],[0,1],[1,'i1'],['i1',2],[2,3],[3,'i2'],['i2',4],[4,5],[5,'i3'],['i3',6],[6,7],[7,'i4'],['i4','l0'],['l0','l1'],['l1',8],[8,'i5'],['i5','l2'],['l2','l3'],['l3','l4'],['l4',9],[9,'i6'],['i6',10],[10,'i7'],['i7',11],[11,12],[12,'i8'],['i8',13],[13,14],[14,'i9'],['i9','i10'],['i10','p0'],['p0','p1'],['p1','i11'],['i11','g0'],['g0','i12'],['i12',15],[15,'p2'],['p2','p3'],['p3','i13'],['i13','g1'],['g1','i14'],['i14','i15'],['i15',16],[16,'i16'],['i16','b0'],['b0','i17'],['i17','i18'],['i18',17],[17,'i19'],['i19','sino']];
const BOT=`(function(A,B){
  function isl(n){var q=LV.solids[+n.slice(1)];for(var i=0;i<solids.length;i++){var s=solids[i];if(Math.abs(s.l-q[0])<.01&&Math.abs(s.r-q[1])<.01&&Math.abs(s.t-q[2])<.01)return s}}
  function sups(n){if(typeof n==='number')return twG[n].pl.map(function(p){return p.so});if(n==='sino')return [];if(n[0]==='l')return [twL[+n.slice(1)].so];if(n[0]==='p')return [twOut.pads[+n.slice(1)].so];if(n[0]==='g')return [twOut.logs[+n.slice(1)].so];if(n[0]==='b')return twOut.brs[+n.slice(1)].segs.map(function(q){return q.so});return [isl(n)]}
  function inB(so){return sups(B).indexOf(so)>=0}
  function tgtX(){if(B==='sino')return LV.bell.x;var ss=sups(B),bx=0,bd=1e9;ss.forEach(function(s){var c=(s.l+s.r)/2,d=Math.abs(c-P.x)+Math.max(0,s.t-P.y-2.5)*1.5;if(d<bd){bd=d;bx=c}});return bx}
  startLevel(13);beginPlay();save.carryFor=-1;P.inv=1e9;hearts=99;for(var kk in keys){if(typeof keys[kk]==='boolean')keys[kk]=false}keys.jx=0;keys.jy=0;
  var SA=sups(A);
  for(var w=0;w<1400;w+=17)for(var si=0;si<SA.length;si++){
   startLevel(13);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;var so=sups(A)[si],k;
   var lost=false,LA=typeof A==='string'&&A[0]==='l';for(k=0;k<w+2;k++){if(LA&&k<w){P.x=1;P.y=0;P.vy=0;P.vx=0;step(STEP);continue}if(so.dead){lost=true;break}P.x=(typeof A==='number'||(typeof A==='string'&&'pgb'.indexOf(A[0])>=0))?(so.l+so.r)/2:Math.max(so.l+.4,Math.min(so.r-.4,tgtX()+(tgtX()>(so.l+so.r)/2?-1.6:1.6)));P.y=so.t;P.prevY=so.t;P.vy=0;P.vx=0;P.grounded=true;P.onPlat=so;step(STEP)}
   if(lost)continue;   var j=false,t0=0,ok=false;
   for(k=0;k<300;k++){var bx=tgtX();keys.left=keys.right=false;keys.run=true;
    if(!j){keys.jump=true;P.jbuf=.13;j=true;t0=k}else keys.jump=k-t0<45;
    if(Math.abs(P.x-bx)>.25){if(bx>P.x)keys.right=true;else keys.left=true}
    step(STEP);
    if(B==='sino'){if(twFx.ring!==0){ok=true;break}}
    else if(P.grounded&&P.onPlat&&inB(P.onPlat)){ok=true;break}
    if(k>12&&P.grounded&&P.onPlat&&!inB(P.onPlat)&&P.onPlat!==so)break;if(P.y<-5||state!=='play')break}
   for(var kk2 in keys){if(typeof keys[kk2]==='boolean')keys[kk2]=false}
   if(ok)return 'ok w='+w+' tábua='+si}
  return 'FALHOU'})`;
module.exports={R,BOT};
if(require.main===module)(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const f=[];for(const [A,B] of R){const r=await pg.evaluate(c=>window.__ev(c),BOT+'('+JSON.stringify(A)+','+JSON.stringify(B)+')');console.log(A+'->'+B,r);if(!r.startsWith('ok'))f.push(A+'->'+B)}
console.log('FALHAS',JSON.stringify(f));await b.close()})();
