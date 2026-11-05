/*@@parte:27_ceu.js*/
/* ===================== Mundo 13: A Escalada dos Blocos Celestes (Terra Nova) =====================
   fase vertical: blocos de pedra celeste com runas (cada cor um movimento) e tartarugas voadoras */
var skB=[],skFx=null,skStoneM=null,skGoldM=null,skRuneTex={};
var SK_COL={s:'#e8d8a0',h:'#3a9aff',v:'#3ad87a',f:'#b06aff',o:'#ff8a2a',b:'#ffd23a'};
function skMats(){if(skStoneM)return;skStoneM=pbr(texStone,.75,.12,{color:new T.Color(0xfffaf0)});skGoldM=M(0xe8b440,.35,.75)}
function skRune(k){/* faixa da frente do bloco: runas brilhando na cor do tipo de bloco */
  if(skRuneTex[k])return skRuneTex[k];var c=document.createElement('canvas');c.width=256;c.height=48;var x=c.getContext('2d'),col=SK_COL[k];
  x.fillStyle='#1a2030';x.fillRect(0,0,256,48);x.strokeStyle=col;x.fillStyle=col;x.lineWidth=4;x.shadowColor=col;x.shadowBlur=10;
  if(k==='h'){for(var i=0;i<4;i++){var cx=32+i*64;x.beginPath();x.moveTo(cx-18,24);x.lineTo(cx+18,24);x.moveTo(cx+8,14);x.lineTo(cx+18,24);x.lineTo(cx+8,34);x.moveTo(cx-8,14);x.lineTo(cx-18,24);x.lineTo(cx-8,34);x.stroke()}}
  else if(k==='v'){for(i=0;i<4;i++){cx=32+i*64;x.beginPath();x.moveTo(cx,8);x.lineTo(cx,40);x.moveTo(cx-9,17);x.lineTo(cx,8);x.lineTo(cx+9,17);x.moveTo(cx-9,31);x.lineTo(cx,40);x.lineTo(cx+9,31);x.stroke()}}
  else if(k==='f'){for(i=0;i<5;i++){cx=26+i*51;x.beginPath();x.arc(cx,24,11,0,6.283);x.stroke();x.beginPath();x.arc(cx,24,3,0,6.283);x.fill()}}
  else if(k==='o'){for(i=0;i<4;i++){cx=32+i*64;x.beginPath();x.arc(cx,24,13,.4,5.6);x.stroke();x.beginPath();x.moveTo(cx+13,14);x.lineTo(cx+12,26);x.lineTo(cx+22,20);x.fill()}}
  else if(k==='b'){for(i=0;i<5;i++){cx=26+i*51;x.beginPath();x.moveTo(cx-12,36);x.lineTo(cx,22);x.lineTo(cx+12,36);x.moveTo(cx-12,24);x.lineTo(cx,10);x.lineTo(cx+12,24);x.stroke()}}
  else{for(i=0;i<6;i++){cx=22+i*43;x.beginPath();x.moveTo(cx,10);x.lineTo(cx+8,24);x.lineTo(cx,38);x.lineTo(cx-8,24);x.closePath();x.stroke()}}
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;skRuneTex[k]=t;return t}
function skBlockMesh(w,k){/* bloco: pedra clara, moldura dourada, faixa de runas na frente e pingente de cristal embaixo */
  skMats();var g=new T.Group(),H=.7,D=2.2;
  var body=mesh(boxGeo(w,H,D,1.4),skStoneM,true,true);body.position.y=-H/2;g.add(body);
  var tp=mesh(boxGeo(w-.1,.04,D-.1,1.2),pbr(texStone,.6,.3,{color:new T.Color(0xfff8ea)}),false,true);tp.position.y=.0;g.add(tp);
  var F=[];[-.03,-H+.04].forEach(function(y){[-1,1].forEach(function(sz){F.push(xf(new T.BoxGeometry(w+.1,.1,.12),[0,y,sz*D/2]))});[-1,1].forEach(function(sx){F.push(xf(new T.BoxGeometry(.12,.1,D+.1),[sx*w/2,y,0]))})});
  [-1,1].forEach(function(sx){[-1,1].forEach(function(sz){F.push(xf(new T.BoxGeometry(.1,H,.1),[sx*w/2,-H/2,sz*D/2]))})});
  g.add(mesh(mgL(F),skGoldM,false,false));
  var rm=new T.MeshStandardMaterial({map:skRune(k),emissive:new T.Color(1,1,1),emissiveMap:skRune(k),emissiveIntensity:k==='s'?.6:1.1,roughness:.5});
  var rs=mesh(new T.PlaneGeometry(w-.3,.32),rm,false,false);rs.position.set(0,-H/2,D/2+.012);g.add(rs);
  var cr=mesh(new T.ConeGeometry(.16,.55,5),new T.MeshStandardMaterial({color:new T.Color(SK_COL[k]),emissive:new T.Color(SK_COL[k]),emissiveIntensity:.6,roughness:.2,flatShading:true}),false,false);cr.rotation.x=Math.PI;cr.position.y=-H-.25;g.add(cr);
  if(k==='b'){/* acelerador: setas douradas em cima */for(var i=0;i<2;i++){var ar=mesh(new T.ConeGeometry(.42,.32,3),new T.MeshStandardMaterial({color:0xffd23a,emissive:0xffb020,emissiveIntensity:.9}),false,false);ar.rotation.set(-Math.PI/2,0,0);ar.position.set(0,.03,-.3+i*.6);ar.rotation.z=0;ar.scale.set(1,.3,1);g.add(ar);g.userData.arrows=(g.userData.arrows||[]).concat(ar)}}
  return {g:g,rm:rm,body:body};
}
/* ---------- cubos que crescem (multiplicam), somem e lançam ---------- */
var skG=[],skCubeIM={},skCubeTex={};
function skCubeFace(k){/* face do cubo: cor do tipo, borda, rebites nos cantos e o símbolo */
  if(skCubeTex[k])return skCubeTex[k];var C={gh:['#2f7ae0','#1a4a9a'],gv:['#2fb85a','#1a6a34'],ga:['#16b4ac','#0a625e'],f:['#9a5ae8','#5a2a9a'],b:['#f2b420','#a8700a']}[k];
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');
  x.fillStyle=C[1];x.fillRect(0,0,128,128);var g=x.createLinearGradient(0,0,128,128);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(0,0,0,.1)');
  x.fillStyle=C[0];x.fillRect(8,8,112,112);x.fillStyle=g;x.fillRect(8,8,112,112);
  x.fillStyle='rgba(255,255,255,.35)';x.fillRect(8,8,112,6);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(8,114,112,6);
  [[20,20],[108,20],[20,108],[108,108]].forEach(function(q){x.fillStyle=C[1];x.beginPath();x.arc(q[0],q[1],7,0,6.283);x.fill();x.fillStyle='rgba(255,255,255,.6)';x.beginPath();x.arc(q[0]-2,q[1]-2,2.5,0,6.283);x.fill()});
  x.strokeStyle='#ffffff';x.fillStyle='#ffffff';x.lineWidth=11;x.lineCap='round';x.lineJoin='round';x.shadowColor='rgba(0,0,0,.35)';x.shadowOffsetY=4;x.shadowBlur=2;
  if(k==='gh'){x.beginPath();x.moveTo(30,64);x.lineTo(98,64);x.moveTo(46,46);x.lineTo(28,64);x.lineTo(46,82);x.moveTo(82,46);x.lineTo(100,64);x.lineTo(82,82);x.stroke()}
  else if(k==='ga'){/* alterna: setas para cima e para os lados */x.beginPath();x.moveTo(64,26);x.lineTo(64,102);x.moveTo(26,64);x.lineTo(102,64);x.moveTo(50,40);x.lineTo(64,26);x.lineTo(78,40);x.moveTo(50,88);x.lineTo(64,102);x.lineTo(78,88);x.moveTo(40,50);x.lineTo(26,64);x.lineTo(40,78);x.moveTo(88,50);x.lineTo(102,64);x.lineTo(88,78);x.stroke()}
  else if(k==='gv'){x.beginPath();x.moveTo(64,30);x.lineTo(64,98);x.moveTo(46,46);x.lineTo(64,28);x.lineTo(82,46);x.moveTo(46,82);x.lineTo(64,100);x.lineTo(82,82);x.stroke()}
  else if(k==='f'){x.beginPath();x.moveTo(64,28);x.lineTo(74,54);x.lineTo(100,64);x.lineTo(74,74);x.lineTo(64,100);x.lineTo(54,74);x.lineTo(28,64);x.lineTo(54,54);x.closePath();x.fill()}
  else{x.beginPath();x.moveTo(64,24);x.lineTo(96,58);x.lineTo(76,58);x.lineTo(76,100);x.lineTo(52,100);x.lineTo(52,58);x.lineTo(32,58);x.closePath();x.fill()}
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;skCubeTex[k]=t;return t}
function buildPlatformsSky(){
  skMats();skG=[];skCubeIM={};var r=rnd(1313);
  LV.solids.forEach(function(s){/* ilhas de grama flutuantes (chão e patamares) */
    var x0=s[0],x1=s[1],top=s[2],w=x1-x0,cx=(x0+x1)/2;
    var gtop=mesh(boxGeo(w,.5,3,2),grassM,true,true);gtop.position.set(cx,top-.25,-.4);add(gtop);
    if(top>.5){/* ilha flutuante: o bloco de pedra é sólido (o Kuro bate a cabeça e as tartarugas batem e viram) */
      var rk=mesh(boxGeo(w,2.2,2.6,2),pbr(texStone,.9,.8,{color:new T.Color(0x9a8a78)}),true,true);rk.position.set(cx,top-1.6,-.4);add(rk);
      var tip=mesh(new T.ConeGeometry(Math.min(w*.4,2.2),1.6,7),pbr(texStone,.9,.8,{color:new T.Color(0x8a7a68)}),true,false);tip.rotation.x=Math.PI;tip.position.set(cx,top-3.5,-.4);tip.scale.z=.6;add(tip)}
    else{var rk0=mesh(new T.DodecahedronGeometry(1,1),pbr(texStone,.9,.8,{color:new T.Color(0x9a8a78)}),true,true);rk0.scale.set(w*.55,2.4,1.9);rk0.position.set(cx,top-2.4,-.4);add(rk0)}
    solids.push({l:x0,r:x1,t:top,b:top>.5?top-2.7:top-.5,oneway:false});
  });
  var cnt={gh:0,gv:0,ga:0,f:0,b:0};
  (LV.cubes||[]).forEach(function(q,i){var n=q.k==='b'?1:(q.n||1),cs=[],grow=q.k==='gh'||q.k==='gv',gso=null;
    if(grow){gso={l:q.x-.5,r:q.x+.5,t:q.y,b:q.y-1,oneway:false,sky:q.k,dead:false};solids.push(gso)}/* ponte/coluna: um só sólido que estica */
    for(var c=0;c<n;c++){var cx=q.k==='gv'||q.k==='b'?q.x:(q.k==='f'?q.x+c:q.x+c*(q.d||1)),top=q.k==='gv'?q.y+c:q.y,so;
      if(grow)so=gso;else{so={l:cx-.5,r:cx+.5,t:top,b:top-1,oneway:false,sky:q.k,dead:false};solids.push(so)}
      cs.push({so:so,cx:cx,top:top,sc:1,on:c===0||!grow,id:grow?-1:cnt[q.k]++})}
    skG.push({q:q,cs:cs,so:gso,len:1,c:q.k==='f'||q.k==='b'?n:1,t:(q.ph||0),st:0,gone:0,bt:0,mode:q.k==='gh'?'h':'v',dh:q.d||1,n:n})});
  skAltPlan();skG.forEach(function(G){var q=G.q;if(!(q.k==='gh'||q.k==='gv'))return;G.ik=G.alt?'ga':q.k;G.cs.forEach(function(cu){cu.id=cnt[G.ik]++})});
  var geo=new T.BoxGeometry(1,1,1.15);
  ['gh','gv','ga','f','b'].forEach(function(k){if(!cnt[k])return;var m=new T.MeshStandardMaterial({map:skCubeFace(k),roughness:.45,metalness:.05,emissive:new T.Color(1,1,1),emissiveMap:skCubeFace(k),emissiveIntensity:.12});
    var im=new T.InstancedMesh(geo,m,cnt[k]);if(k==='ga'){for(var ii=0;ii<cnt[k];ii++)im.setColorAt(ii,_skN)}im.castShadow=true;im.receiveShadow=true;add(im);skCubeIM[k]={im:im,m:m}});
  skUpd(0);
}
/* pedido do dono: os blocos grandes que esticam alternam — uma vez para cima, outra para o lado (os ajudantes lentos não mudam).
   Para cada grupo procura o lado livre (sem ilha, bloco ou outro cubo perto, com folga para pular em cima e passar embaixo) */
function skBox(G,mode,dh,n){var q=G.q;if(mode==='v')return {l:q.x-.5,r:q.x+.5,b:q.y-1,t:q.y-1+n};return dh>0?{l:q.x-.5,r:q.x-.5+n,b:q.y-1,t:q.y}:{l:q.x+.5-n,r:q.x+.5,b:q.y-1,t:q.y}}
function skAltPlan(){var obs=[],GAP=2.9;
  LV.solids.forEach(function(s){obs.push({l:s[0],r:s[1],t:s[2],b:s[2]>.5?s[2]-2.7:s[2]-.5,g:null})});
  (LV.blocks||[]).forEach(function(b){obs.push({l:b.x-.5,r:b.x+.5,b:b.y,t:b.y+1,g:null});if(b.c==='feather')obs.push({l:b.x-3.2,r:b.x+3.2,b:b.y+1.4,t:b.y+3.6,g:null,z:1})});
  skG.forEach(function(G){var q=G.q;if(q.k==='gh'||q.k==='gv')obs.push(Object.assign(skBox(G,G.mode,G.dh,G.n),{g:G}));else G.cs.forEach(function(c){obs.push({l:c.cx-.5,r:c.cx+.5,t:c.top,b:c.top-1,g:G})})});
  function free(G,B){if(B.l<(LV.xMin||0)+.1||B.r>(LV.xMax||24)-.1)return false;
    return obs.every(function(o){if(o.g===G)return true;var ov=Math.min(o.r,B.r)-Math.max(o.l,B.l);if(ov<=-.05)return true;
      if(ov<=.05)return !(o.t>B.b+.05&&o.b<B.t-.05);/* encostado do lado: só não pode estar na mesma altura */
      return o.b>=B.t+GAP||o.t<=B.b-GAP})}
  skG.forEach(function(G){var q=G.q;G.alt=null;if(!(q.k==='gh'||q.k==='gv')||(q.hold||0)>=2.5||q.noAlt)return;
    var cand=[];if(G.mode==='h')cand.push(['v',G.dh]);else{var c0=q.x<12?1:-1;cand.push(['h',c0],['h',-c0])}
    /* tenta o mesmo tamanho; se não couber, um pouco menor (mínimo 3 cubos) */
    for(var nn=G.n;nn>=Math.min(3,G.n)&&!G.alt;nn--)for(var i=0;i<cand.length&&!G.alt;i++){var B=skBox(G,cand[i][0],cand[i][1],nn);if(free(G,B)){G.alt={mode:cand[i][0],dh:cand[i][1],n:nn};obs.push(Object.assign(B,{g:G}))}}});
}
function skAltOn(G){/* troca de direção no fim de cada volta (só quando está pequena, no descanso) */
  if(!G.alt)return;var m=G.mode,d=G.dh,nc=G.nc||G.n;G.mode=G.alt.mode;G.dh=G.alt.dh;G.nc=G.alt.n||G.n;G.alt={mode:m,dh:d,n:nc}}
var _skD=new T.Object3D(),_skW=new T.Color(2.2,2.2,2.2),_skN=new T.Color(1,1,1);
function skUpd(dt){
  skG.forEach(function(G){var q=G.q,n=G.cs.length;
    if(q.k==='gh'||q.k==='gv'){n=G.nc||n;/* estica de forma contínua, segura cheia, encolhe suave, descansa pequena e repete */
      var g=q.g||.42,hold=q.hold||1.6,sh=q.sh||.28,rest=q.rest||.9,T1=(n-1)*g,T2=T1+hold,T3=T2+(n-1)*sh,T4=T3+rest;G.t+=dt;if(G.t>=T4){G.t%=T4;skAltOn(G)}var t=G.t,f;
      G.warn=G.alt&&t>T3+rest*.25;/* pisca antes de trocar */
      if(t<T1)f=t/T1;else if(t<T2)f=1;else if(t<T3)f=1-(t-T2)/(T3-T2);else f=0;f=f*f*(3-2*f);
      var L=1+(n-1)*f,so=G.so,pl=so.l,pr=so.r,pt=so.t,d=G.dh,H=G.mode==='h',carry=P.onPlat===so&&P.grounded;G.len=L;
      if(H){if(d>0){so.l=q.x-.5;so.r=q.x-.5+L}else{so.r=q.x+.5;so.l=q.x+.5-L}so.t=q.y;so.b=q.y-1}
      else{so.l=q.x-.5;so.r=q.x+.5;so.b=q.y-1;so.t=q.y-1+L}
      /* empurra o Kuro: nunca fica preso dentro */
      if(state==='play'||state==='intro'){
        if(carry&&!H){P.y=so.t}
        else if(P.x+P.w/2>so.l+.01&&P.x-P.w/2<so.r-.01&&P.y<so.t-.01&&P.y+P.h>so.b+.01){
          if(P.y>=Math.min(pt,so.t)-.4){P.y=so.t;P.vy=Math.max(P.vy,0);P.grounded=true;P.onPlat=so}
          else if(H){P.x=d>0?so.r+P.w/2+.03:so.l-P.w/2-.03;P.vx=0}
          else{P.x=P.x<q.x?so.l-P.w/2-.03:so.r+P.w/2+.03;P.vx=0}}}
      /* empurra as tartarugas também: elas viram e seguem voando */
      enemies.forEach(function(e){if(!e.alive)return;var hw=e.w*.8;if(e.x+hw>so.l&&e.x-hw<so.r&&e.y<so.t&&e.y+e.h>so.b){
        if(H&&e.y+e.h*.5<so.t){e.x=d>0?so.r+hw+.05:so.l-hw-.05;e.dir=d}else if(!H&&e.y>so.t-.5){e.y=so.t+.02}else{e.x=e.x<q.x?so.l-hw-.05:so.r+hw+.05;e.dir=e.x<q.x?-1:1}}});
      G.cs.forEach(function(cu,i){cu.on=i<Math.ceil(L-.001);cu.part=Math.max(0,Math.min(1,L-i));cu.cx=H?q.x+i*d:q.x;cu.top=H?q.y:q.y+i});
    }else if(q.k==='f'){/* fileira roxa: treme e some depois de pisar, volta depois */
      var onF=G.cs.some(function(cu){return P.onPlat===cu.so&&P.grounded});
      if(G.gone>0){G.gone-=dt;if(G.gone<=0){var inside=G.cs.some(function(cu){var so=cu.so;return P.x+P.w/2>so.l&&P.x-P.w/2<so.r&&P.y<so.t&&P.y+P.h>so.b});if(inside)G.gone=.3;else{G.st=0;G.cs.forEach(function(cu){cu.so.dead=false})}}}
      else{G.st=onF?G.st+dt:Math.max(0,G.st-dt*.5);if(G.st>=.6){G.gone=2.4;G.cs.forEach(function(cu){cu.so.dead=true;if(P.onPlat===cu.so){P.grounded=false;P.onPlat=null}emit(sparkPool,cu.cx,cu.top-.5,6,2.4,.5,.3,.2,1)});try{noise(.3,.05,1500,'bandpass')}catch(e){}}}
      G.cs.forEach(function(cu){cu.sc+=((cu.so.dead?0:1)-cu.sc)*Math.min(1,dt*10)});
    }else if(q.k==='b'){var cu=G.cs[0];if(P.onPlat===cu.so&&P.grounded&&state==='play'){P.vy=q.v||22;P.grounded=false;P.onPlat=null;P.noCut=.8;P.coyote=0;P.dj=false;G.bt=1;try{beep(392,.25,'sine',.12,2.2)}catch(e){}emit(sparkPool,cu.cx,cu.top+.2,16,4,.6,.35,.2,4);
        if(!skFx.bTold){skFx.bTold=true;toast('Cubo acelerador! Ele lança o Kuro lá para cima')}}G.bt=Math.max(0,G.bt-dt*3)}
    var IM=skCubeIM[G.ik||q.k];if(!IM)return;
    G.cs.forEach(function(cu,i){
      if(q.k==='gh'||q.k==='gv'){var fr=Math.max(.001,cu.part),d2=G.dh;
        if(G.mode==='h'){var x0=d2>0?q.x-.5+i:q.x+.5-i;_skD.position.set(x0+d2*fr/2,q.y-.5,0);_skD.scale.set(fr,1,1)}
        else{_skD.position.set(q.x,q.y-1+i+fr/2,0);_skD.scale.set(1,fr,1)}
        if(cu.part<=.002)_skD.scale.set(.0001,.0001,.0001);/* cubo ainda não esticado: some de vez (antes ficava uma placa fina no ar) */
        if(i===0&&G.alt){var wk=G.warn&&Math.sin(tm*26)>0,cc=wk?_skW:_skN;if(G.cw!==wk){G.cw=wk;IM.im.setColorAt(cu.id,cc);if(IM.im.instanceColor)IM.im.instanceColor.needsUpdate=true}if(G.warn){var pz=1+.08*Math.abs(Math.sin(tm*13));_skD.scale.multiplyScalar(pz)}}
        _skD.rotation.set(0,0,0);_skD.updateMatrix();IM.im.setMatrixAt(cu.id,_skD.matrix);return}
      var s2=Math.max(.001,cu.sc),wob=q.k==='f'&&G.st>.25&&!G.gone?Math.sin(tm*40)*.05*G.st:0,by=q.k==='b'?G.bt*.15:0;
      _skD.position.set(cu.cx+wob,cu.top-.5+by,0);_skD.rotation.set(0,0,0);_skD.scale.set(s2,s2,s2);_skD.updateMatrix();IM.im.setMatrixAt(cu.id,_skD.matrix)});
    IM.im.instanceMatrix.needsUpdate=true});
  if(skCubeIM.f)skCubeIM.f.m.emissiveIntensity=.15+.1*Math.sin(tm*4);if(skCubeIM.b)skCubeIM.b.m.emissiveIntensity=.25+.15*Math.sin(tm*5);
}
function updSky(dt){
  skUpd(dt);
  /* caiu muito abaixo da última bandeirinha: volta para ela sem perder coração */
  /* regra do dono: só 3 voltas por bandeirinha; na 4ª queda o Kuro cai de verdade até achar onde pisar (nunca perde coração por queda) */
  if(skFx.cpRef!==respawn){skFx.cpRef=respawn;skFx.fallN=0}
  if(state==='play'&&!dyn&&respawn&&P.y<respawn.y-7&&P.vy<0&&skFx.fallN<4){skFx.fallN++;
    if(skFx.fallN<=3){emit(sparkPool,P.x,P.y+.6,10,2.5,.5,.3,.2,2);spawn(respawn);P.inv=1;var ch=3-skFx.fallN;toast(ch>0?'Caiu! Volta para a bandeirinha — chances: '+ch:'Última volta! A próxima queda é de verdade')}
    else toast('Sem chances! O Kuro cai até achar onde pisar')}
  /* sem chances: se subir de novo até a bandeirinha, ganha as 3 chances de volta */
  if(skFx.fallN>=4&&P.grounded&&Math.abs(P.x-respawn.x)<2.5&&Math.abs(P.y-respawn.y)<1.2){skFx.fallN=0;toast('Chances de volta: 3');sfx.check()}
  if(skFx){skFx.par=!skFx.par}if(skFx&&skFx.isl&&skFx.par)skFx.isl.forEach(function(o){o.g.position.y=o.y+Math.sin(tm*.4+o.ph)*.6});/* ilhas do fundo: a cada 2 quadros */
  if(skFx&&skFx.fall)skFx.fall.forEach(function(m){m.material.map.offset.y-=dt*.9});
  /* o céu vai escurecendo conforme o Kuro sobe */
  if(skFx&&skFx.top){var k=clamp(P.y/skFx.top,0,1);scene.fog.color.copy(skFx.fog0).lerp(new T.Color(0x6a5a9a),k*.7);hemi.intensity=skFx.hi*(1-k*.3);if(skFx.stars)skFx.stars.material.opacity=k*k*.9}
}
function buildDecorSky(){
  skFx={isl:[],fall:[],fog0:scene.fog.color.clone(),hi:hemi.intensity,top:(LV.goal&&LV.goal.top)||60};var r=rnd(4343),lite=LITE;
  /* ilhas flutuantes com cachoeira, longe, em volta da subida */
  var wt=document.createElement('canvas');wt.width=32;wt.height=128;var wx=wt.getContext('2d');for(var i=0;i<40;i++){wx.fillStyle='rgba(255,255,255,'+(.4+r()*.6)+')';wx.fillRect(r()*32,r()*128,1+r()*3,8+r()*24)}
  var IS=lite?7:14;for(i=0;i<IS;i++){var g=new T.Group(),sd=i%2?1:-1,x=12+sd*(16+r()*14),y=-2+i*(skFx.top+10)/IS+r()*4,z=-14-r()*22,s=1.5+r()*2.2;g.position.set(x,y,z);add(g);
    var tp=mesh(new T.CylinderGeometry(2.2*s,1.8*s,.6*s,10),grassM,false,true);g.add(tp);var rk=mesh(new T.ConeGeometry(1.9*s,3.6*s,8),pbr(texStone,.9,.8,{color:new T.Color(0x8a7a6a)}),false,true);rk.rotation.x=Math.PI;rk.position.y=-2.1*s;g.add(rk);
    for(var t=0;t<3;t++){var tr=mesh(new T.IcosahedronGeometry(.6*s,1),M([0x4fae3a,0x5cbc44,0x3f9a32][t],.85,0,{flatShading:true}),false,false);tr.position.set((r()-.5)*2.4*s,.7*s,(r()-.5)*1.5*s);g.add(tr)}
    if(r()<.6){var wtx=new T.CanvasTexture(wt);wtx.wrapT=T.RepeatWrapping;var wm=new T.MeshBasicMaterial({map:wtx,color:0xd8f4ff,transparent:true,opacity:.75,depthWrite:false});var fall=new T.Mesh(new T.PlaneGeometry(.5*s,7*s),wm);fall.position.set(1.2*s,-3.6*s,1.85*s*.9);g.add(fall);skFx.fall.push(fall)}
    skFx.isl.push({g:g,y:y,ph:r()*6})}
  /* estrelas que aparecem lá no alto */
  var n=lite?120:300,pos=new Float32Array(n*3);for(i=0;i<n;i++){pos[i*3]=12+(r()-.5)*160;pos[i*3+1]=skFx.top*.5+r()*80;pos[i*3+2]=-60-r()*20}
  var sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(pos,3));skFx.stars=new T.Points(sg,new T.PointsMaterial({color:0xffffff,size:.35,transparent:true,opacity:0,fog:false}));add(skFx.stars);
  /* nuvens passando embaixo e no meio */
  for(i=0;i<(lite?8:16);i++){var cs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,opacity:.6,depthWrite:false}));var sz=8+r()*10;cs.scale.set(sz*1.8,sz*.5,1);cs.position.set(12+(r()-.5)*70,-4+r()*skFx.top,-8-r()*20);add(cs)}
  /* a torre do topo */
  if(LV.goal){var G=LV.goal,tw=new T.Group();tw.position.set(G.x+3.2,G.top,-3.5);add(tw);
    var tb=mesh(new T.CylinderGeometry(2.2,2.6,8,10),skStoneM,true,true);tb.position.y=4;tw.add(tb);
    for(var b2=0;b2<10;b2++){var mr=mesh(new T.BoxGeometry(.7,.8,.7),skStoneM,true,false);var a=b2/10*6.283;mr.position.set(Math.cos(a)*2.3,8.4,Math.sin(a)*2.3);tw.add(mr)}
    var gr=mesh(new T.TorusGeometry(2.45,.12,6,24),skGoldM,false,false);gr.rotation.x=Math.PI/2;gr.position.y=7.9;tw.add(gr);
    var rf=mesh(new T.ConeGeometry(2.4,3,10),M(0x3a6ab8,.6),true,false);rf.position.y=10.4;tw.add(rf);
    var bell=mesh(new T.SphereGeometry(.55,12,8,0,6.283,0,1.7),skGoldM,false,false);bell.position.set(0,9,0);tw.add(bell);
    var dr=mesh(new T.PlaneGeometry(1.2,2),new T.MeshBasicMaterial({color:0x1a1420}),false,false);dr.position.set(0,1,2.62);tw.add(dr);}
}
function buildFarSky(th,r){
  var gc=document.createElement('canvas');gc.width=gc.height=128;var gx=gc.getContext('2d'),gg=gx.createRadialGradient(64,64,0,64,64,64);
  gg.addColorStop(0,'rgba(255,240,200,1)');gg.addColorStop(.3,'rgba(255,200,140,.55)');gg.addColorStop(1,'rgba(255,180,120,0)');gx.fillStyle=gg;gx.fillRect(0,0,128,128);
  var gl=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(gc),transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));gl.scale.set(90,90,1);gl.position.set(-30,30,-120);farG.add(gl);
  for(var i=0;i<10;i++){var cs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffe8e0,transparent:true,opacity:.8,depthWrite:false,fog:false}));var sz=50+r()*60;cs.scale.set(sz,sz*.28,1);cs.position.set(-200+i*44,-10+r()*20,-140);farG.add(cs)}
}
/* ---------- tartarugas voadoras ---------- */
function shellTex(base,line){var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,128,128);x.strokeStyle=line;x.lineWidth=4;
  for(var r=0;r<4;r++)for(var q=0;q<5;q++){var cx=q*30+(r%2)*15,cy=r*34+10;x.beginPath();for(var k=0;k<6;k++){var a=k/6*6.283+Math.PI/6;var px=cx+Math.cos(a)*14,py=cy+Math.sin(a)*14;if(k)x.lineTo(px,py);else x.moveTo(px,py)}x.closePath();x.stroke()}
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t}
function makeTurtle(kind,moss){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var C=moss?['#4f9a5e','#24583a',0x7ad8c8]:{turtle:['#3aa86a','#1f6a40',0x9ad87a],tchase:['#d8402a','#7a1a10',0x9ad87a],tshell:['#8a92a0','#3a4250',0x9ad87a],tguard:['#7a4ad0','#3a1a70',0x9ad87a]}[kind];
  var skin=M(C[2],.7),shell=new T.MeshStandardMaterial({map:shellTex(C[0],C[1]),roughness:kind==='tshell'?.35:.6,metalness:kind==='tshell'?.6:0});
  var dome=mesh(new T.SphereGeometry(.42,18,10,0,6.283,0,1.6),shell);dome.scale.set(1.15,.85,1);dome.position.y=.42;inner.add(dome);
  var rim=mesh(new T.TorusGeometry(.45,.06,6,22),M(0xf2e6c0,.7));rim.rotation.x=Math.PI/2;rim.scale.set(1.15,1,1);rim.position.y=.4;inner.add(rim);
  var belly=mesh(new T.SphereGeometry(.42,14,6,0,6.283,1.6,1.1),M(0xf4e8b8,.8));belly.scale.set(1.12,.5,.98);belly.position.y=.42;inner.add(belly);
  var head=new T.Group();head.position.set(.5,.48,0);inner.add(head);
  var hs=mesh(new T.SphereGeometry(.2,14,10),skin);hs.scale.set(1.15,1,1);head.add(hs);
  var eyeW=M(0xffffff,.3),eyeB=M(0x101010,.2);[-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.075,10,8),eyeW,false,false);e.position.set(.12,.07,sd*.09);head.add(e);var p=mesh(new T.SphereGeometry(.04,8,6),eyeB,false,false);p.position.set(.17,.07,sd*.095);head.add(p);
    if(kind==='tchase'){var br=mesh(new T.BoxGeometry(.13,.03,.04),eyeB,false,false);br.position.set(.13,.16,sd*.09);br.rotation.x=sd*.0;br.rotation.z=-.5;br.rotation.y=sd*.3;head.add(br)}});
  var flip=[];[[.25,1],[.25,-1],[-.28,1],[-.28,-1]].forEach(function(q){var p=new T.Group();p.position.set(q[0],.3,q[1]*.32);var f=mesh(new T.SphereGeometry(.13,8,6),skin,false,false);f.scale.set(1.4,.35,.8);f.position.z=q[1]*.1;p.add(f);inner.add(p);flip.push({p:p,sd:q[1],fr:q[0]>0})});
  var tail=mesh(new T.ConeGeometry(.06,.18,6),skin,false,false);tail.rotation.z=Math.PI/2;tail.position.set(-.55,.36,0);inner.add(tail);
  /* asinhas de penas em cima do casco */
  var wingM=moss?new T.MeshStandardMaterial({color:0x9ae6ff,roughness:.2,side:T.DoubleSide,transparent:true,opacity:.75,emissive:0x2a8ad0,emissiveIntensity:.35}):new T.MeshStandardMaterial({color:0xffffff,roughness:.7,side:T.DoubleSide,emissive:0xffffff,emissiveIntensity:.25}),wings=[];
  if(moss){/* Tartaruga-cachoeira (Mundo 16): musgo e folhinhas em cima do casco, gotas pingando */
    var mm=M(0x6ac04a,.85),ms=mesh(new T.SphereGeometry(.36,12,6,0,6.283,0,1.1),mm,false,false);ms.scale.set(1.15,.55,1);ms.position.y=.7;inner.add(ms);
    for(var lf=0;lf<3;lf++){var l2=mesh(new T.SphereGeometry(.1,8,5),M(0x8ae05a,.6),false,false);l2.scale.set(1,.3,2);l2.position.set(-.1+lf*.1,.86,(lf-1)*.12);l2.rotation.y=lf;inner.add(l2)}
    var dr=mesh(new T.SphereGeometry(.05,8,6),new T.MeshStandardMaterial({color:0xbff0ff,roughness:.1,transparent:true,opacity:.8}),false,false);dr.position.set(-.3,.12,.1);inner.add(dr);g.userData.drop=dr}
  var ws=new T.Shape();ws.moveTo(0,0);ws.quadraticCurveTo(.1,.45,.5,.55);ws.lineTo(.42,.4);ws.lineTo(.55,.38);ws.lineTo(.42,.24);ws.lineTo(.5,.18);ws.quadraticCurveTo(.25,.05,0,0);
  [-1,1].forEach(function(sd){var p=new T.Group();p.position.set(-.05,.72,sd*.2);var w=mesh(new T.ShapeGeometry(ws,6),wingM,false,false);w.rotation.y=sd>0?-Math.PI/2:Math.PI/2;w.rotation.x=0;w.scale.set(1.5,1.5,1.5);p.add(w);inner.add(p);wings.push({p:p,sd:sd})});
  var spikes=null;if(kind==='tshell'){spikes=new T.Group();inner.add(spikes);var sm=M(0xd8dce4,.25,.8);for(var i=0;i<7;i++){var a=i/7*6.283,sp=mesh(new T.ConeGeometry(.09,.32,6),sm,false,false);sp.position.set(Math.cos(a)*.34,.66+(i%2)*.06,Math.sin(a)*.3);sp.lookAt(Math.cos(a)*2,1.6,Math.sin(a)*2);sp.rotateX(Math.PI/2);spikes.add(sp)}}
  if(kind==='tguard'){/* guerreira: elmo dourado com crista vermelha e lança */
    var hm=M(0xe8b440,.3,.7),hl=mesh(new T.SphereGeometry(.22,14,8,0,6.283,0,1.4),hm,false,false);hl.position.set(.02,.06,0);hl.scale.set(1.18,1,1.08);head.add(hl);
    var cr=mesh(new T.BoxGeometry(.3,.12,.05),M(0xd8302a,.6),false,false);cr.position.set(-.02,.26,0);head.add(cr);
    var sp=new T.Group();sp.position.set(.25,.42,.36);g.userData.spear=sp;var sh2=mesh(new T.CylinderGeometry(.025,.025,1.1,6),M(0x7a5434,.7),false,false);sh2.rotation.z=-1.2;sp.add(sh2);
    var tip=mesh(new T.ConeGeometry(.06,.2,6),M(0xd8dce4,.25,.8),false,false);tip.rotation.z=-1.2-Math.PI/2+Math.PI;tip.position.set(.55*Math.sin(1.2),.55*Math.cos(1.2)*-1+.0,0);tip.position.set(.51,.2,0);tip.rotation.z=-Math.PI/2+.37;sp.add(tip);inner.add(sp)}
  add(g);return {g:g,inner:inner,head:head,flip:flip,wings:wings,spikes:spikes,dome:dome,spear:g.userData.spear,drop:g.userData.drop};
}
var gSpears=[];
function guardThrow(e,dt,inT){/* arremessa a lança no Kuro: avisa erguendo a lança, joga, e pega outra depois */
  e.thCd=(e.thCd===undefined?1.6:e.thCd)-dt;e.aim=0;
  if(!inT||e.thCd>0)return;
  e.aimT=(e.aimT||0)+dt;e.aim=Math.min(1,e.aimT/.55);
  if(e.aimT<.55)return;
  e.aimT=0;e.thCd=2.6;
  var sx=e.x+(e.dir||1)*.4,sy=e.y+.7,tx=P.x,ty=P.y+P.h*.55,d=Math.hypot(tx-sx,ty-sy)||1,sp=9;
  var m=new T.Group(),sh=mesh(new T.CylinderGeometry(.03,.03,1.05,6),M(0x7a5434,.7),false,false);sh.rotation.z=Math.PI/2;m.add(sh);
  var tp=mesh(new T.ConeGeometry(.07,.22,6),M(0xd8dce4,.25,.8),false,false);tp.rotation.z=-Math.PI/2;tp.position.x=.6;m.add(tp);
  m.position.set(sx,sy,.1);m.rotation.z=Math.atan2(ty-sy,tx-sx);add(m);
  gSpears.push({m:m,x:sx,y:sy,vx:(tx-sx)/d*sp,vy:(ty-sy)/d*sp,t:0});e.noSpear=1;try{swoosh()}catch(er){}
  if(!gSpears.told){gSpears.told=true;toast('A guerreira arremessa a lança! Desvie')}
}
function updSpears(dt){
  for(var i=gSpears.length-1;i>=0;i--){var s2=gSpears[i];s2.t+=dt;s2.x+=s2.vx*dt;s2.y+=s2.vy*dt;s2.m.position.set(s2.x,s2.y,.1);
    var dead=s2.t>2.2;
    for(var k=0;k<solids.length&&!dead;k++){var q=solids[k];if(q.dead||q.hid||q.oneway)continue;if(s2.x>q.l&&s2.x<q.r&&s2.y>q.b&&s2.y<q.t){dead=true;emit(dustPool,s2.x,s2.y,4,1.5,.4,.4,1.2,-.2)}}
    if(!dead&&state==='play'&&Math.abs(s2.x-P.x)<.45&&s2.y>P.y&&s2.y<P.y+P.h){if(P.spinT>0){emit(sparkPool,s2.x,s2.y,8,3,.4,.3,.2,1)}else hurt(s2.x-s2.vx);dead=true}
    if(dead){if(s2.m.parent)s2.m.parent.remove(s2.m);gSpears.splice(i,1)}}
}
function guardAI(e,dt){/* tartaruga guerreira: guarda o bloco da pena; só ataca dentro do território */
  var T0=e.terr,inT=P.x>T0[0]&&P.x<T0[1]&&P.y>T0[2]&&P.y<T0[3]&&state==='play',dx=P.x-e.x;
  if(e.noSpear){e.noSpear+=dt;if(e.noSpear>1.1)e.noSpear=0}
  guardThrow(e,dt,inT);
  if(e.wings){
    if(inT&&Math.abs(dx)<7){if(e.st!=='chase'){e.st='alert';e.alertT=(e.alertT||0)}
      if(e.st==='alert'){e.alertT-=dt;if(e.alertT<=-.4){e.st='chase'}}
      if(e.st==='chase'){var dy=(P.y+.5)-(e.y+.4),d=Math.hypot(dx,dy),sp=2.6,nx=e.x+dx/Math.max(d,.01)*sp*dt,ny=e.y+dy/Math.max(d,.01)*sp*dt;
        nx=Math.max(T0[0],Math.min(T0[1],nx));ny=Math.max(T0[2]+.5,Math.min(T0[3],ny));if(!eHit(e,nx,e.y))e.x=nx;if(!eHit(e,e.x,ny))e.y=ny;e.dir=dx>0?1:-1;e.cur=sp}}
    else{e.st='patrol';e.alertT=.5;/* volta para o posto e voa em volta do bloco */
      var hx=e.hx+Math.sin(mt*.9+e.ph)*2.4,hy=e.by0+Math.sin(mt*1.6+e.ph)*e.amp,ddx=hx-e.x,ddy=hy-e.y,dd=Math.hypot(ddx,ddy),st=Math.min(dd,2.4*dt);
      var nx2=e.x+ddx/Math.max(dd,.01)*st,ny2=e.y+ddy/Math.max(dd,.01)*st;if(!eHit(e,nx2,e.y))e.x=nx2;if(!eHit(e,e.x,ny2))e.y=ny2;if(Math.abs(ddx)>.02)e.dir=ddx>0?1:-1;e.cur=1}
    return}
  /* sem asas: cai e anda no chão, ainda guardando o território */
  e.vy=(e.vy||0)-30*dt;var ny3=e.y+e.vy*dt,fl=floorBelow(e.x,e.y+.3);if(e.vy<=0&&ny3<=fl&&fl>-50){e.y=fl;e.vy=0;e.gr=true}else{e.y=ny3;e.gr=false}
  if(e.y<-9){e.alive=false;return}
  if(e.gr){var want=inT?(dx>0?1:-1):e.dir;var sp2=inT?2.4:1.2,nx3=e.x+want*sp2*dt,edge=floorBelow(nx3+want*.4,e.y+.3);
    if(eHit(e,nx3,e.y)||edge<e.y-.6||nx3<T0[0]||nx3>T0[1]){e.dir=-want}else{e.x=nx3;e.dir=want}e.cur=sp2;e.st=inT?'chase':'patrol'}
}
function turtleAI(e,dt){
  var t=e.type;e.safe=false;
  if(t==='tguard'){guardAI(e,dt);return}
  if(t==='tshell'&&e.shellT>0){e.shellT-=dt;e.safe=true;e.cur=0;e.y=Math.max(e.base-.6,e.y-dt*.3);if(e.shellT<=0){e.y=e.y;emit(dustPool,e.x,e.y+.4,6,2,.5,.5,1.2,-.3)}return}
  if(t==='tchase'){
    var dx=P.x-e.x,dy=(P.y+.5)-(e.y+.4),d=Math.hypot(dx,dy);
    if(e.st==='patrol'){e.y=e.base+Math.sin(mt*2+e.ph)*.25;e.x+=(e.hx-e.x)*Math.min(1,dt*2);e.cur=0;if(d<5.5&&state==='play'){e.st='alert';e.alertT=.5;e.dir=dx>0?1:-1;try{sfx.alert()}catch(er){}}}
    else if(e.st==='alert'){e.alertT-=dt;e.dir=dx>0?1:-1;if(e.alertT<=0){e.st='chase';e.loseT=0;e.cs=0}}
    else if(e.st==='chase'){e.cs=Math.min(3.4,(e.cs||0)+dt*1.6);var cx2=e.x+dx/Math.max(d,.01)*e.cs*dt,cy2=e.y+dy/Math.max(d,.01)*e.cs*dt;if(!eHit(e,cx2,e.y))e.x=cx2;if(!eHit(e,e.x,cy2))e.y=cy2;e.dir=dx>0?1:-1;e.cur=e.cs;e.loseT+=dt;
      if(d>9||e.loseT>6||Math.hypot(e.x-e.hx,e.y-e.base)>8){e.st='return'}}/* longe demais ou cansou: desiste */
    else{var hx=e.hx-e.x,hy=e.base-e.y,hd2=Math.hypot(hx,hy);e.x+=hx/Math.max(hd2,.01)*Math.min(hd2,2.4*dt);e.y+=hy/Math.max(hd2,.01)*Math.min(hd2,2.4*dt);e.dir=hx>0?1:-1;if(hd2<.2){e.st='patrol'}}
    return}
  var sp=e.speed*(t==='tshell'?.7:1),nx=e.x+e.dir*sp*dt;if(eHit(e,nx,e.y)){e.dir=-e.dir}else e.x=nx;/* bate nos cubos e vira */
  if(e.x<e.x0){if(!eHit(e,e.x0,e.y))e.x=e.x0;e.dir=1}else if(e.x>e.x1){if(!eHit(e,e.x1,e.y))e.x=e.x1;e.dir=-1}/* empurrada para fora da rota: volta só se o caminho estiver livre */
  var ny=e.base+Math.sin(mt*1.6+e.ph)*(e.amp||.4);if(!eHit(e,e.x,ny))e.y=ny;e.cur=sp;
}
function turtleVis(e,dt){
  var v=e.vis,shell=e.type==='tshell'&&e.shellT>0;
  v.g.rotation.y=e.dir>0?0:Math.PI;
  var fl=Math.sin(tm*(shell?0:16)+e.ph),nw=e.type==='tguard'&&!e.wings;v.wings.forEach(function(w){w.p.rotation.x=w.sd*(.35+fl*.55);w.p.visible=!shell&&!nw});
  if(nw){v.flip.forEach(function(f,i){f.p.rotation.z=Math.sin(tm*8+i*Math.PI)*.4})}
  if(v.spear){v.spear.visible=!e.noSpear;v.spear.rotation.z=(e.aim||0)*.9;v.spear.position.y=.42+(e.aim||0)*.25}
  v.flip.forEach(function(f,i){f.p.rotation.y=(shell?0:Math.sin(tm*6+i*1.6+e.ph)*.5);f.p.visible=!shell});
  if(v.drop){var du=(tm*.8+e.ph)%1;v.drop.position.y=.12-du*.5;v.drop.visible=du<.8}
  v.head.visible=!shell;v.inner.rotation.z=shell?0:Math.sin(tm*2+e.ph)*.06;
  if(shell){v.inner.rotation.y+=dt*6;if(v.spikes)v.spikes.scale.setScalar(.3)}else{v.inner.rotation.y*=.8;if(v.spikes)v.spikes.scale.setScalar(1)}
}
