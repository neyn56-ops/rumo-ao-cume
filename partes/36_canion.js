/*@@parte:36_canion.js*/
/* ===================== Mundo 20 — Cânion Invertido =====================
   Plano aprovado pelo dono (05/11): de manhã, câmera no padrão do jogo (a tela não gira, só o Kuro vira de cabeça para baixo).
   Mecânica: setas de gravidade. Passou por uma seta, a gravidade vira: o Kuro cai para o teto de pedra e anda por ele.
   Truque da física: com a gravidade virada, a física do Kuro roda num "espelho" (o mundo de cabeça para baixo em volta
   da linha do meio LV.canyon.A), então pulo, pulo duplo, capa, quinas e blocos funcionam igual sem reescrever nada.
   Parte 1: o fundo do cânion — setas, teto com buracos para o céu e morcegos pendurados que acordam. */
var CN=null,cnM=null;
THEMES.push({name:'valley',dry:1,canyon:1,sky:['#3f8fe0','#7ec0f0','#ffe2b4','#fff0d2'],fog:'#f2d8b8',fd:.0075,sun:0xfff0d8,si:2.3,sunOff:[-22,14,16],hemi:[0xffe6cc,0x8a4a2a,.34],exp:.84,env:0,lantern:0,snow:true,sandFx:true,mz:-45,valley:0xb0603a});/* 21 */
function cnStrata(seed,sat){var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),r=rnd(seed),y=0;
  var pal=[[12,52,40],[16,54,45],[20,50,50],[9,50,36],[24,44,56],[14,52,42]];
  while(y<256){var h=6+r()*22,p=pal[(r()*pal.length)|0];x.fillStyle='hsl('+p[0]+','+(p[1]*sat)+'%,'+p[2]+'%)';x.fillRect(0,y,256,h+1);
    x.fillStyle='rgba(60,20,10,.25)';x.fillRect(0,y+h-1.5,256,1.5);y+=h}
  for(var i=0;i<900;i++){x.fillStyle='rgba('+(r()<.5?'40,14,6':'255,236,210')+','+(.04+r()*.08)+')';x.fillRect(r()*256,r()*256,1+r()*6,1+r()*2)}
  for(i=0;i<18;i++){x.strokeStyle='rgba(50,18,8,.35)';x.lineWidth=1;x.beginPath();var cx=r()*256,cy=r()*256;x.moveTo(cx,cy);for(var k=0;k<5;k++){cx+=(r()-.5)*14;cy+=4+r()*10;x.lineTo(cx,cy)}x.stroke()}/* rachaduras */
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;return t}
function cnMats(){if(cnM)return cnM;
  var st=cnStrata(201,1),st2=cnStrata(202,.85);
  cnM={rock:new T.MeshStandardMaterial({map:st,color:0xd8c0b0,roughness:.93,bumpMap:texStone.bump,bumpScale:.25}),
    far:new T.MeshStandardMaterial({map:st2,color:0xe8c8b8,roughness:.97}),wallM:new T.MeshStandardMaterial({map:st2,color:0xc8a898,roughness:.95}),
    col:M(0xffffff,.95,0,{vertexColors:true}),
    crust:pbr(texDirt,.97,.9,{color:new T.Color(0xc8784a)}),
    cactus:M(0x5f8a46,.8),cactusD:M(0x46703a,.85),flower:M(0xff8ab0,.6),
    upM:new T.MeshStandardMaterial({color:0x2ac8ff,emissive:0x0aa8ff,emissiveIntensity:1,roughness:.4,transparent:true,opacity:.92}),
    dnM:new T.MeshStandardMaterial({color:0xff9a3a,emissive:0xff7a10,emissiveIntensity:1,roughness:.4,transparent:true,opacity:.92}),
    ringM:new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,depthWrite:false}),
    swM:new T.MeshBasicMaterial({color:0xffe060,transparent:true,opacity:.75,depthWrite:false,side:T.DoubleSide}),
    rockC:pbr(texStone,.92,.5,{color:new T.Color(0xb85a38),flatShading:true}),
    stoneM:pbr(texStone,.9,.3,{color:new T.Color(0xb07a5a)}),discM:M(0x4a2a1e,.8)};
  return cnM}
MATS.push({top:pbr(texDirt,.97,1.1,{color:new T.Color(0xe0a070)}),side:pbr(texStone,.95,.3,{color:new T.Color(0xb8643c)}),slab:pbr(texStone,.9,.2,{color:new T.Color(0xc07a52)}),meadow:pbr(texDirt,.97,1,{color:new T.Color(0xd89a6a)}),cliff:pbr(texStone,.95,.3,{color:new T.Color(0xa85a36)})});/* 21: Cânion Invertido — terra e pedra vermelhas */
/* música do cânion: manhã aberta, um pouco de faroeste (entra antes da música do mapa, que é sempre a última) */
MUSIC.splice(MUSIC.length-1,0,{bpm:104,lead:'triangle',lv:.05,drums:2,bassT:1,
  mel:[69,0,72,0,76,0,74,72, 69,0,0,67,0,69,0,0, 72,0,76,0,79,0,77,76, 74,0,72,0,69,0,0,0],
  roots:[33,41,36,40],ch:[[57,60,64],[53,57,60],[55,60,64],[56,59,64]]});/* 17 */
/* chão e teto do cânion: chão com terra vermelha por cima; teto (5º valor 'roof') com a crosta embaixo — é por onde o Kuro anda quando a gravidade vira */
function cnSolid(s,m3){var A=cnMats(),x0=s[0],x1=s[1],top=s[2],bot=s[3]!==undefined?s[3]:-14,w=x1-x0,cx=(x0+x1)/2;
  if(s[5]==='roof'){var b=mesh(boxGeo(w,top-bot-.3,6.8,4.2),A.rock);b.position.set(cx,(top+bot+.3)/2,-1.6);add(b);
    var lip=mesh(boxGeo(w+.14,.34,6.94,2.2),A.crust);lip.position.set(cx,bot+.17,-1.6);add(lip)}
  else{var vb=bot;var body=mesh(boxGeo(w,top-.3-vb,6.8,4.2),A.rock);body.position.set(cx,(top-.3+vb)/2,-1.6);add(body);
    var lp=mesh(boxGeo(w+.14,.34,6.94,2.2),m3.top);lp.position.set(cx,top-.17,-1.6);add(lp)}
  solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,slip:false,roof:s[5]==='roof'})}
/* ---- cenário: paredão do fundo em camadas, mesas lá longe, pedras flutuando no céu, cactos ---- */
function cnScenery(){var A=cnMats(),C=LV.canyon,r=rnd(2020),list=[],x,k;
  var x0=-30,x1=(LV.camMax||150)+40;
  /* paredão do fundo: colunas de rocha de alturas diferentes (deixam o céu aparecer entre elas) */
  for(x=x0;x<x1;x+=7+r()*7){var h=8+r()*13,wd=3+r()*3.5,z=-13-r()*4;
    list.push({g:xf(boxGeo(wd,h,3,5),[x,h/2-1.5,z],[0,(r()-.5)*.4,0])});
    if(r()<.45){var hc=1.4+r()*1.6;list.push({g:xf(boxGeo(wd*.6,hc,2.4,5),[x+(r()-.5)*1.4,h-1.5+hc/2,z+.2])})}}
  var wall=new T.Mesh(mergeG(list),A.wallM);wall.receiveShadow=true;add(wall);
  /* mesas lá longe e pedras de cabeça para baixo penduradas no céu (o "cânion invertido") */
  list=[];for(x=x0-20;x<x1+20;x+=12+r()*10){var mh=8+r()*14,mw=8+r()*10;list.push({g:xf(new T.CylinderGeometry(mw*.42,mw*.55,mh,7,1),[x,mh/2-2,-46-r()*20],[0,r()*3,0])})}
  for(x=x0;x<x1;x+=14+r()*12){var ph=3+r()*4,pw=2.5+r()*2.5,py=C.A*2+9+r()*8;list.push({g:xf(new T.ConeGeometry(pw,ph,6,1),[x,py-ph/2,-26-r()*14],[Math.PI,r()*3,0])});
    list.push({g:xf(new T.CylinderGeometry(pw*1.05,pw*.95,1.2,6,1),[x,py+.5,-26-r()*0],[0,r()*3,0])})}
  var far=new T.Mesh(mergeG(list),A.far);add(far);
  /* pedras flutuando devagar no céu (só enfeite) */
  CN.floaters=[];var fg=new T.DodecahedronGeometry(1,0);
  for(k=0;k<(LITE?6:12);k++){var fm=mesh(fg,A.stoneM,false,false),s2=.5+r()*1.2;fm.scale.set(s2*1.3,s2,s2);fm.position.set(x0+r()*(x1-x0),C.A*2+5+r()*7,-14-r()*10);add(fm);CN.floaters.push({o:fm,y:fm.position.y,ph:r()*6,sp:.3+r()*.4})}
  /* cactos e pedrinhas atrás do caminho, só onde tem chão */
  list=[];var lc=[];LV.solids.forEach(function(s){if(s[5]==='roof'||s[2]!==0)return;for(var xx=Math.max(s[0],x0)+1.5;xx<s[1]-1;xx+=3+r()*5){var z2=-3.2-r()*2.2;
    if(r()<.55){var ch=1+r()*1.4;lc.push({g:xf(new T.CylinderGeometry(.18,.22,ch,7),[xx,ch/2,z2])},{g:xf(new T.SphereGeometry(.18,7,5),[xx,ch,z2])});
      if(r()<.7){var ah=.5+r()*.5,sd=r()<.5?-1:1;lc.push({g:xf(new T.CylinderGeometry(.11,.12,.5,6),[xx+sd*.28,ch*.5,z2],[0,0,sd*Math.PI/2])},{g:xf(new T.CylinderGeometry(.11,.12,ah,6),[xx+sd*.5,ch*.5+ah/2,z2])})}}
    else list.push({g:xf(new T.DodecahedronGeometry(.3+r()*.4,0),[xx,.1,z2],[r(),r(),r()],[1.3,.7,1])})}});
  if(lc.length)add(new T.Mesh(mergeG(lc),A.cactus));if(list.length){var pd=new T.Mesh(mergeG(list),A.stoneM);pd.castShadow=false;add(pd)}
  /* pontinhas de pedra embaixo do teto, lá atrás (não ficam no caminho do Kuro) */
  list=[];LV.solids.forEach(function(s){if(s[5]!=='roof')return;for(var xx=s[0]+.6;xx<s[1]-.4;xx+=1.2+r()*1.6){var th=.4+r()*1.1;list.push({g:xf(new T.ConeGeometry(.22+r()*.2,th,5),[xx,s[3]-th/2,-3.6-r()*1.2],[Math.PI,r()*3,0])})}});
  if(list.length)add(new T.Mesh(mergeG(list),A.crust))}
/* ---- setas de gravidade: placa de pedra com runa brilhando; azul = gravidade para cima (teto), laranja = para baixo (chão) ---- */
function cnArrowMesh(up){var A=cnMats(),g=new T.Group(),sh=new T.Shape();
  sh.moveTo(0,.5);sh.lineTo(.42,.02);sh.lineTo(.16,.02);sh.lineTo(.16,-.48);sh.lineTo(-.16,-.48);sh.lineTo(-.16,.02);sh.lineTo(-.42,.02);sh.lineTo(0,.5);
  var ar=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.08,bevelEnabled:false}),up?A.upM:A.dnM);ar.position.z=.04;if(!up)ar.rotation.z=Math.PI;g.add(ar);
  var disc=mesh(new T.CylinderGeometry(.62,.62,.1,20),A.discM,false,false);disc.rotation.x=Math.PI/2;disc.position.z=-.05;g.add(disc);
  var ring=new T.Mesh(new T.RingGeometry(.66,.78,28),A.ringM);ring.position.z=.02;g.add(ring);
  return {g:g,ar:ar,ring:ring}}
function cnBuild(th){CN={flip:0,rot:0,A:LV.canyon.A,arrows:[],cd:0,t:0,mir:null,real:null,emit0:null,told:0};cnMats();cnScenery();
  (LV.canyon.arrows||[]).forEach(function(a){var v=cnArrowMesh(a[2]==='up');v.g.position.set(a[0],a[1],.3);add(v.g);
    if(a[3]){v.ring.material=cnM.swM;var r2=new T.Mesh(new T.RingGeometry(.86,.92,28,1,0,Math.PI*1.5),cnM.swM);r2.position.z=.03;v.g.add(r2);v.r2=r2}/* seta que troca sozinha: anel amarelo e um arco que gira */
    CN.arrows.push({x:a[0],y:a[1],up:a[2]==='up',up0:a[2]==='up',per:a[3]||0,off:a[4]||0,v:v,ph:a[0]*.7,fl:0,rz:a[2]==='up'?0:Math.PI})});
  CN.rocks=[];(LV.canyon.rocks||[]).forEach(function(q){var w=q[1]||1.6,h=1.2,so={l:q[0]-w/2,r:q[0]+w/2,t:h,b:0,oneway:false,slip:false,crock:1};solids.push(so);
    CN.rocks.push({x:q[0],w:w,h:h,so:so,m:cnRockMesh(w,h,q[0]),st:'rest',t:0,v:0,cd:0})});
  cnReset()}
/* pedra que cai para cima: pedra vermelha com rachaduras azuis brilhando (a mesma cor da seta que leva para o teto) */
function cnRockMesh(w,h,seed){var A=cnMats(),g=new T.Group(),r=rnd(seed*7|0);
  var b=mesh(new T.DodecahedronGeometry(.5,1),A.rockC);b.scale.set(w*.98,h*.95,1.3);g.add(b);
  for(var i=0;i<5;i++){var c=new T.Mesh(new T.BoxGeometry(.05,.3+r()*.4,.04),A.upM);c.position.set((r()-.5)*w*.7,(r()-.5)*h*.5,.62);c.rotation.z=(r()-.5)*1.4;g.add(c)}
  g.position.set(seed,h/2,0);add(g);return g}
function cnReset(){if(!CN)return;CN.flip=0;CN.rot=0;CN.cd=0;CN.t=0;
  (CN.rocks||[]).forEach(function(k){k.st='rest';k.t=0;k.v=0;k.cd=0;k.so.b=0;k.so.t=k.h;k.m.position.set(k.x,k.h/2,0)});
  enemies.forEach(function(e){if(e.hang){e.st='hang';e.x=e.hx;e.y=e.hy;e.cur=0;e.bvx=e.bvy=0}})}
/* vira a gravidade (chamado quando o Kuro passa por uma seta) */
function cnSetFlip(f,ax,ay){if(!CN||CN.flip===f)return;CN.flip=f;CN.cd=.35;
  if(P.mount){dismountFox('off');if(fox)fox.away=true;P.crouch=false;P.h=stdH()}
  P.grounded=false;P.onPlat=null;P.coyote=0;P.jbuf=0;P.dj=false;P.flyT=0;P.vy=f?Math.max(P.vy,1.5):Math.min(P.vy,-1.5);
  beep(f?300:700,.28,'sine',.04,f?500:-420);beep(f?450:520,.18,'triangle',.02,f?300:-260,.05);
  emit(sparkPool,ax,ay,14,3.2,.6,.35,.2,0);
  if(!CN.told){CN.told=1;toast(f?'A gravidade virou! O Kuro anda no teto. A seta laranja traz de volta':'Gravidade normal de novo')}
  /* morcegos pendurados por perto acordam com o tranco */
  enemies.forEach(function(e){if(e.hang&&e.alive&&e.st==='hang'&&Math.abs(e.x-P.x)<9){e.st='alert';e.alertT=.35+Math.random()*.25}})}
function cnUpd(dt){if(!CN)return;CN.t+=dt;if(CN.cd>0)CN.cd-=dt;
  /* setas que trocam sozinhas: ficam per segundos de um jeito e per do outro */
  for(var j=0;j<CN.arrows.length;j++){var sa=CN.arrows[j];if(!sa.per)continue;var ph=(CN.t+sa.off)%(sa.per*2);sa.up=ph<sa.per?sa.up0:!sa.up0;sa.warn=(ph%sa.per)>sa.per-.5}
  cnRocks(dt);
  if(state==='play'&&CN.cd<=0){for(var i=0;i<CN.arrows.length;i++){var a=CN.arrows[i];
    if(a.up!==!!CN.flip&&Math.abs(P.x-a.x)<.75&&P.y<a.y+.75&&P.y+P.h>a.y-.75){a.fl=1;cnSetFlip(a.up?1:0,a.x,a.y);break}}}
  /* caiu para o céu por um buraco do teto */
  if(CN.flip&&state==='play'&&P.y>CN.A*2+9){fallDeath('O Kuro caiu para o céu! Voltando ao último checkpoint.')}
  if(CN.lastTm===tm)return;CN.lastTm=tm;/* daqui para baixo é só visual */
  CN.arrows.forEach(function(a){var on=a.up!==!!CN.flip;a.v.g.position.y=a.y+Math.sin(CN.t*2+a.ph)*.08;a.v.ar.material=a.up?cnM.upM:cnM.dnM;
    a.rz+=((a.up?0:Math.PI)-a.rz)*.3;a.v.ar.rotation.z=a.rz;if(a.v.r2){a.v.r2.rotation.z=-CN.t*3;a.v.r2.visible=!a.warn||Math.floor(CN.t*10)%2===0}
    a.v.g.scale.setScalar((on?1:.82)+a.fl*.35);a.fl=Math.max(0,a.fl-.05);a.v.ring.rotation.z=CN.t*(a.up?1.4:-1.4);a.v.ar.position.y=Math.sin(CN.t*3+a.ph)*.05*(a.up?1:-1)});
  (CN.rocks||[]).forEach(function(k){var sk=k.st==='warn'?Math.sin(CN.t*70)*.06:0;k.m.position.set(k.x+sk,(k.so.b+k.so.t)/2,0);k.m.rotation.z=k.st==='stuck'||k.st==='back'?Math.PI:0});
  cnM.upM.emissiveIntensity=.8+Math.sin(CN.t*4)*.3;cnM.dnM.emissiveIntensity=.8+Math.sin(CN.t*4+1.5)*.3;
  (CN.floaters||[]).forEach(function(f){f.o.position.y=f.y+Math.sin(CN.t*f.sp+f.ph)*.6;f.o.rotation.y+=.002;f.o.rotation.x+=.001})}
/* pedras que caem para cima: o Kuro chega perto → tremem 0,45 s → sobem rápido até o teto (batem e grudam 1,6 s) → descem devagar.
   Em cima dela com a gravidade normal o Kuro sobe junto (e é espremido se chegar no teto); no caminho dela, machuca e empurra para o lado. */
function cnRocks(dt){var top=CN.A*2;(CN.rocks||[]).forEach(function(k){var so=k.so,dy=0;if(k.cd>0)k.cd-=dt;
  if(k.st==='rest'){if(state==='play'&&k.cd<=0&&Math.abs(P.x-k.x)<k.w/2+1.8){k.st='warn';k.t=.45;beep(70,.4,'sawtooth',.03,30)}}
  else if(k.st==='warn'){k.t-=dt;if(k.t<=0){k.st='rise';k.v=2;emit(dustPool,k.x,.2,10,2.6,.6,.6,1.3,-.2)}}
  else if(k.st==='rise'){k.v=Math.min(16,k.v+40*dt);dy=k.v*dt;if(so.t+dy>=top){dy=top-so.t;k.st='stuck';k.t=1.6;shake=Math.max(shake,.22);beep(60,.3,'square',.05,-30);emit(dustPool,k.x,top-.1,12,3,.6,.6,1.3,-.2)}}
  else if(k.st==='stuck'){k.t-=dt;if(k.t<=0)k.st='back'}
  else if(k.st==='back'){dy=-Math.min(3.2*dt,so.b);if(so.b+dy<=1e-4){dy=-so.b;k.st='rest';k.cd=1.2}}
  if(!dy)return;var carry=!CN.flip&&P.onPlat===so&&dy>0&&P.grounded;so.t+=dy;so.b+=dy;if(carry)P.y=so.t;
  if(state!=='play')return;
  var over=P.x+P.w/2>so.l+.05&&P.x-P.w/2<so.r-.05&&P.y<so.t-.02&&P.y+P.h>so.b+.02,crush=carry&&P.y+P.h>top-.02;
  if(over||crush){hurt(k.x,1);P.x=P.x<k.x?so.l-P.w/2-.06:so.r+P.w/2+.06;P.vx=0;if(crush){P.onPlat=null;P.grounded=false}}})}
/* ---- o espelho da física: com a gravidade virada, o passo do Kuro roda no mundo de cabeça para baixo ---- */
function cnIn(){if(!CN||!CN.flip)return 0;var A2=CN.A*2,i,s,m;
  if(!CN.mir||CN.mirN!==solids.length||CN.mirS!==solids){CN.mir=solids.map(function(q){var o=Object.create(q);q.__cm=o;return o});CN.mirN=solids.length;CN.mirS=solids}
  for(i=0;i<solids.length;i++){s=solids[i];m=CN.mir[i];m.t=A2-s.b;m.b=A2-s.t}
  CN.real=solids;solids=CN.mir;
  P.y=A2-P.y-P.h;P.vy=-P.vy;if(P.prevY!==undefined)P.prevY=A2-P.prevY-P.h;P.airVy=-(P.airVy||0);
  if(P.onPlat&&P.onPlat.__cm)P.onPlat=P.onPlat.__cm;
  CN.emit0=emit;emit=function(pool,x,y){var a=Array.prototype.slice.call(arguments);a[2]=A2-y;return CN.emit0.apply(null,a)};
  return 1}
function cnOut(){var A2=CN.A*2;solids=CN.real;emit=CN.emit0;
  P.y=A2-P.y-P.h;P.vy=-P.vy;if(P.prevY!==undefined)P.prevY=A2-P.prevY-P.h;P.airVy=-(P.airVy||0);
  if(P.onPlat&&CN.mir.indexOf(P.onPlat)>=0)P.onPlat=Object.getPrototypeOf(P.onPlat)}
/* com a gravidade virada, o empurrão de quando o Kuro se machuca vai para longe do teto */
var cnHurt0=hurt;hurt=function(){var vy=P.vy,r=cnHurt0.apply(this,arguments);if(CN&&CN.flip&&LV&&LV.canyon&&P.vy!==vy&&P.vy>0)P.vy=-P.vy;return r};
/* desenho: o Kuro gira de cabeça para baixo em volta dos pés (a câmera não gira) */
function cnPose(dt){if(!CN||!LV||!LV.canyon)return;CN.rot+=((CN.flip?1:0)-CN.rot)*(1-Math.exp(-dt*12));var u=CN.rot*CN.rot*(3-2*CN.rot);
  rig.root.rotation.x=u*Math.PI;rig.root.position.y+=u*P.h*.98}
