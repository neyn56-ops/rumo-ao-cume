/*@@parte:38_copa.js*/
/* ===================== Mundo 22 — Copa da Árvore Mãe (último mundo) =====================
   Plano aprovado pelo dono (05/11): o alto da Árvore Mãe ao amanhecer dourado, acima das nuvens. Subida final misturando
   tudo (sementes-ponte e cipós do Mundo 21 usam o mesmo código: LV.roots). Detalhe do dono: a Bruxa vai aparecendo ao
   longo da fase — surge, joga uma poção no Kuro e some; não pode ser derrotada; só no final, no topo, tem a luta.
   Parte 1: o tronco e os primeiros galhos — folhas gigantes que dobram, rajadas de vento, semente-ponte, cipó. */
var CP=null,cpM=null;
THEMES.push({name:'valley',copa:1,sky:['#3a56a8','#c8789a','#ffb878','#ffe6b0'],fog:'#f6d6b4',fd:.0055,sun:0xffd8a0,si:2.4,sunOff:[-30,9,12],hemi:[0xffe2c8,0x6a4a5a,.5],exp:.86,env:0,lantern:0,snow:false,mz:-45,valley:0x8a6a5a});/* 23 */
function cpMats(){if(cpM)return cpM;
  cpM={bark:pbr(texWood,.92,1.3,{color:new T.Color(0xa07858)}),barkD:pbr(texWood,.95,1.3,{color:new T.Color(0x6e5040)}),
    leaf:M(0x6ab84a,.75,0,{side:T.DoubleSide}),leafL:M(0x9ad060,.7,0,{side:T.DoubleSide}),leafD:M(0x3f8a3a,.8,0,{side:T.DoubleSide}),
    vein:M(0x4a8a30,.8),petal:M(0xffb0c8,.6,0,{side:T.DoubleSide}),flower:M(0xff7aa8,.55),fcore:M(0xffd860,.5),moss:pbr(texGrass,.95,.6,{color:new T.Color(0x7ab85a)})};
  return cpM}
MATS.push({top:pbr(texGrass,.95,.6,{color:new T.Color(0x7ab85a)}),side:pbr(texWood,.92,1.3,{color:new T.Color(0xa07858)}),slab:pbr(texWood,.92,1.3,{color:new T.Color(0xa07858)}),meadow:pbr(texGrass,.95,.6,{color:new T.Color(0x7ab85a)}),cliff:pbr(texWood,.95,1.3,{color:new T.Color(0x6e5040)})});/* 23: casca e musgo */
/* música da copa: o amanhecer, a subida final (entra antes da música do mapa, que é sempre a última) */
MUSIC.splice(MUSIC.length-1,0,{bpm:112,lead:'triangle',lv:.055,drums:2,bassT:1,
  mel:[72,0,76,79,0,76,74,72, 74,0,77,81,0,79,77,76, 72,0,76,79,0,84,83,81, 79,0,77,76,74,0,72,0],
  roots:[36,41,43,36],ch:[[60,64,67],[53,57,60],[55,59,62],[60,64,67]]});/* 19 */
/* galho: tronco deitado de casca com musgo em cima e um galho de apoio que volta para o tronco lá atrás */
function cpSolid(s,m3){var A=cpMats(),x0=s[0],x1=s[1],top=s[2],w=x1-x0,cx=(x0+x1)/2,R=w>8?.8:.6;
  if(s[5]==='leafp')return;/* folha que dobra: o cpBuild faz o sólido e o desenho */
  var g=new T.CylinderGeometry(R*.85,R,w+.8,14,Math.max(2,w|0));g.rotateZ(Math.PI/2);var m=mesh(ldRough(g,.07,1.8),A.bark);m.position.set(cx,top-R,-.3);add(m);
  var ms=mesh(boxGeo(w,.1,R*1.2,2),A.moss);ms.position.set(cx,top-.03,-.3);add(ms);
  var n=Math.max(1,Math.round(w/9));for(var i=0;i<n;i++){var sx=x0+(i+.5)*w/n,sg=new T.CylinderGeometry(R*.6,R*.8,9,10,3);sg.translate(0,-4.5,0);var sp=mesh(ldRough(sg,.05,2),A.barkD);sp.position.set(sx,top-R*1.4,-.8);sp.rotation.set(-.55,0,(i%2?.2:-.2));add(sp)}
  var L=[],r=rnd(x0*31|0);for(var k=0;k<Math.max(2,w/2.2);k++){var lx=x0+r()*w;L.push({g:xf(new T.SphereGeometry(.5+r()*.5,8,6),[lx,top-R*2+r()*.4,-1.4-r()*1.2],0,[1.6,.6,1.1])})}
  add(new T.Mesh(mergeG(L),A.leafD));
  solids.push({l:x0,r:x1,t:top,b:top-R*2,oneway:false,slip:false})}
/* cenário: o tronco gigante atrás, copas de folhas, flores, pétalas e nuvens lá embaixo */
function cpDecor(th,r,dummy){var A=cpMats(),xe=sceneEnd(),L=[],i;
  for(i=0;i<5;i++){var tx=-10+i*(xe+20)/5+r()*10,tg=new T.CylinderGeometry(4+r()*2,6+r()*2,70,16,8);tg.translate(0,-15,0);var t=mesh(ldRough(tg,.4,.4),A.barkD,false,false);t.position.set(tx,0,-22-r()*10);add(t)}
  for(i=0;i<Math.round(xe/2.2);i++){var cx=-14+r()*(xe+20),cy=-6+r()*24,cz=-20-r()*24,s=1.4+r()*2.6;L.push({g:xf(new T.IcosahedronGeometry(1,1),[cx,cy,cz],[r(),r(),r()],[s*1.3,s*.8,s])})}
  var cm=new T.Mesh(mergeG(L),A.leafC||(A.leafC=M(0x5e9a52,.85)));add(cm);
  var F=[],FC=[];for(i=0;i<Math.round(xe/5);i++){var fx=-10+r()*(xe+10),fy=-2+r()*16,fz=-6-r()*10;for(var p=0;p<5;p++){var a=p/5*Math.PI*2;F.push({g:xf(new T.SphereGeometry(.28,8,6),[fx+Math.cos(a)*.3,fy+Math.sin(a)*.3,fz],0,[1,1,.3])})}FC.push({g:xf(new T.SphereGeometry(.16,8,6),[fx,fy,fz+.05])})}
  add(new T.Mesh(mergeG(F),A.flower));add(new T.Mesh(mergeG(FC),A.fcore));
  var ct=ldCloudTex();for(i=0;i<(LITE?8:14);i++){var c=new T.Sprite(new T.SpriteMaterial({map:ct,color:0xffe8e0,transparent:true,opacity:.9,depthWrite:false}));var w=18+r()*20;c.scale.set(w,w*.45,1);c.position.set(-20+r()*(xe+40),-12-r()*6,-10-r()*30);add(c)}
}
/* ---- folhas gigantes que dobram e a Bruxa que aparece ---- */
function cpLeafMesh(w){var A=cpMats(),g=new T.Group(),sh=new T.Shape();sh.moveTo(-w/2-.3,0);sh.quadraticCurveTo(-w/4,1.3,w/2+.5,0);sh.quadraticCurveTo(-w/4,-1.3,-w/2-.3,0);
  var lg=new T.ExtrudeGeometry(sh,{depth:.14,bevelEnabled:true,bevelSize:.06,bevelThickness:.05,bevelSegments:1,curveSegments:10});lg.rotateX(-Math.PI/2);var l=mesh(lg,A.leafL,true,true);l.position.y=-.2;l.rotation.x=.18;g.add(l);/* folha grossa e um pouco virada para a câmera */
  var v=mesh(new T.CylinderGeometry(.05,.05,w+.6,5),A.vein);v.rotation.z=Math.PI/2;v.position.y=.02;g.add(v);
  var st=mesh(new T.CylinderGeometry(.08,.12,4,6),A.vein);st.position.set(-w/2-.3,-1.8,-.4);st.rotation.z=.5;g.add(st);return g}
function cpWitchVis(){var w=makeWitch();var br=new T.Group();w.g.add(br);w.broom=br;/* a Bruxa do castelo já vem com a vassoura dela (a 2ª saiu) */
  var pot=new T.Group(),pb=mesh(new T.SphereGeometry(.2,10,8),new T.MeshStandardMaterial({color:0x70ff60,emissive:0x30c020,emissiveIntensity:.6,roughness:.3}));pot.add(pb);var nk=mesh(new T.CylinderGeometry(.06,.08,.18,6),M(0x8a6aa0,.5));nk.position.y=.22;pot.add(nk);
  w.pot=pot;return w}
function cpBuild(th){CP={t:0,leaves:[],w:null,pots:[],clouds:[]};var C=LV.copa||{};
  (LV.solids||[]).forEach(function(s,i){if(s[5]!=='leafp')return;var so={l:s[0],r:s[1],t:s[2],b:s[2]-.4,oneway:false,slip:false};solids.push(so);var m=cpLeafMesh(s[1]-s[0]);m.position.set((s[0]+s[1])/2,s[2],0);add(m);CP.leaves.push({so:so,y:s[2],m:m,d:0})});
  var wv=cpWitchVis();wv.g.scale.setScalar(1.5);wv.g.visible=false;add(wv.g);add(wv.pot);wv.pot.visible=false;
  var smk=[];for(var i=0;i<10;i++){var p=mesh(new T.SphereGeometry(.35,8,6),new T.MeshBasicMaterial({color:0x8a50c0,transparent:true,opacity:0,depthWrite:false}),false,false);add(p);smk.push(p)}
  CP.w={v:wv,st:'away',t:C.witchFirst||5,x:0,y:0,smk:smk,smT:0,sx:0,sy:0};cpConesBuild();cpBossBuild();cpReset()}
function cpReset(){if(!CP)return;cpBossReset();(CP.cones||[]).forEach(function(b){b.on=0;b.t=-b.off;b.m.visible=false});CP.leaves.forEach(function(q){q.d=0;q.so.t=q.y;q.so.b=q.y-.4;q.m.position.y=q.y;q.m.rotation.z=0});
  var w=CP.w;if(w){w.st='away';w.t=(LV.copa&&LV.copa.witchFirst)||5;w.v.g.visible=false;w.v.pot.visible=false}CP.pots.forEach(function(p){p.c&&p.c.parent&&p.c.parent.remove(p.c)});CP.pots=[]}
function cpPoof(x,y){var w=CP.w;w.smT=.8;w.sx=x;w.sy=y;w.smk.forEach(function(p,i){p.userData={a:i/10*Math.PI*2,s:.6+Math.random()*.6}});beep(180,.3,'sawtooth',.03,300)}
function cpInZone(x){var Z=(LV.copa&&LV.copa.witchZones)||[];return Z.some(function(z){return x>z[0]&&x<z[1]})}
function cpUpd(dt){if(!CP)return;CP.t+=dt;var t=CP.t;cpConesUpd(dt);cpBossUpd(dt);
  /* folhas: com o Kuro em cima, dobram e descem devagar; sem ninguém, voltam */
  CP.leaves.forEach(function(q){var on=P.onPlat===q.so&&P.grounded;q.d=on?Math.min(1.6,q.d+dt*.65):Math.max(0,q.d-dt*1.6);var ny=q.y-q.d,dy=ny-q.so.t;q.so.t=ny;q.so.b=ny-.4;if(on)P.y=ny;
    q.m.position.y=ny+Math.sin(t*1.5+q.y)*.03;q.m.rotation.z=-q.d*.08});
  /* a Bruxa: aparece num estalo de fumaça perto do Kuro, joga uma poção e some. Não dá para derrotar (só no final) */
  var w=CP.w;if(w){var v=w.v;
    if(w.st==='away'){w.t-=dt;if(w.t<=0&&state==='play'&&cpInZone(P.x)){w.st='show';w.t=1.3;w.x=P.x+(P.face>=0?6.5:-6.5);w.y=P.y+4.6;cpPoof(w.x,w.y);v.g.visible=true;if(!CP.told){CP.told=1;toast('A Bruxa! Cuidado com as poções dela')}}else if(w.t<=0)w.t=1}
    else if(w.st==='show'){w.t-=dt;if(w.t<=0){w.st='throw';w.t=.5;var T0=1.05,tx=P.x+P.vx*.5,ty=P.y;CP.pots.push({x:w.x,y:w.y+.6,vx:(tx-w.x)/T0,vy:(ty-(w.y+.6)+.5*20*T0*T0)/T0,m:null});beep(700,.2,'square',.02,-300)}}
    else if(w.st==='throw'){w.t-=dt;if(w.t<=0){w.st='away';w.t=7+Math.random()*3;cpPoof(w.x,w.y);v.g.visible=false}}
    if(v.g.visible){v.g.position.set(w.x,w.y+Math.sin(t*3)*.2,-.3);v.g.rotation.y=P.x<w.x?-Math.PI/2+.4:Math.PI/2-.4;v.broom.rotation.z=Math.sin(t*3)*.05}
    if(w.smT>0){w.smT-=dt;var k=1-w.smT/.8;w.smk.forEach(function(p){var u=p.userData;p.position.set(w.sx+Math.cos(u.a)*k*1.4*u.s,w.sy+1+Math.sin(u.a)*k*1.2*u.s,-.2);p.scale.setScalar(.6+k*1.2);p.material.opacity=.7*(1-k)})}}
  /* poções: voam em arco; ao bater, nuvem verde que machuca perto */
  CP.pots=CP.pots.filter(function(p){if(!p.m){p.m=w.v.pot.clone();add(p.m);p.m.visible=true}
    if(!p.c){p.vy-=20*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.m.position.set(p.x,p.y,0);p.m.rotation.z+=dt*8;
      var hitK=state==='play'&&Math.abs(P.x-p.x)<.5+P.w/2&&p.y>P.y&&p.y<P.y+P.h,gnd=solids.some(function(s){return !s.dead&&!s.block&&p.x>=s.l&&p.x<=s.r&&p.y<=s.t&&p.y>s.t-1});
      if(hitK||gnd||p.y<-14){p.m.parent&&p.m.parent.remove(p.m);if(p.y<-14)return false;
        p.c=mesh(new T.SphereGeometry(1.2,12,8),new T.MeshBasicMaterial({color:0x70ff60,transparent:true,opacity:.45,depthWrite:false}),false,false);p.c.position.set(p.x,p.y+.3,0);add(p.c);p.ct=.9;beep(220,.3,'sawtooth',.03,-120);
        if(state==='play'&&Math.hypot(P.x-p.x,P.y+P.h/2-p.y)<1.5)hurt(p.x,1)}return true}
    p.ct-=dt;p.c.scale.setScalar(1+(.9-p.ct)*.6);p.c.material.opacity=.45*p.ct/.9;if(p.ct<=0){p.c.parent&&p.c.parent.remove(p.c);return false}return true})}
/* ===== Parte 2: a copa alta — galhos podres (crumbles), pinhas que rolam, flores que jogam para cima (springs), pena com a guardiã ===== */
function cpConeMesh(){var g=new T.Group(),A=cpMats(),sc=M(0x8a5a32,.85),L=[];for(var i=0;i<5;i++){var y=-.4+i*.2,r=.42-Math.abs(i-2)*.08;for(var k=0;k<8;k++){var a=k/8*Math.PI*2+i*.4;L.push({g:xf(new T.ConeGeometry(.12,.28,4),[Math.cos(a)*r,y,Math.sin(a)*r],[0,-a,Math.PI/2+.5])})}}
  g.add(new T.Mesh(mergeG(L),sc));var c=mesh(new T.SphereGeometry(.36,10,8),M(0x6a4024,.9));c.scale.y=1.4;g.add(c);g.rotation.z=Math.PI/2;var w=new T.Group();w.add(g);return w}
function cpConesBuild(){CP.cones=((LV.copa&&LV.copa.cones)||[]).map(function(q){var m=cpConeMesh();m.visible=false;add(m);return {x0:q[0],x1:q[1],per:q[2],off:q[3]||0,y:q[4],t:-(q[3]||0),on:0,x:q[0],m:m}})}
function cpConesUpd(dt){(CP.cones||[]).forEach(function(b){var R=.5;
  if(!b.on){b.t+=dt;if(b.t>=b.per){b.t=0;b.on=1;b.x=b.x0;b.vy=0;b.yy=b.y+3;b.m.visible=true}return}
  if(b.yy>b.y){b.vy-=30*dt;b.yy=Math.max(b.y,b.yy+b.vy*dt);if(b.yy<=b.y&&Math.abs(P.x-b.x)<22)beep(140,.12,'triangle',.03,-60)}else b.x-=dt*5;/* cai da copa de cima e rola */
  b.m.position.set(b.x,b.yy+R,0);b.m.rotation.z+=dt*5/R;
  if(state==='play'&&Math.abs(P.x-b.x)<R*.9+P.w/2&&P.y<b.yy+R*1.7&&P.y+P.h>b.yy+.05)hurt(b.x,1);
  if(b.x<=b.x1){b.on=0;b.m.visible=false;emit(dustPool,b.x,b.y+.3,8,2,.5,.5,1.1,-.2)}})}
/* ===== Parte 3: o topo da Árvore Mãe — luta final com a Bruxa =====
   Ela voa sobre a arena e ataca: bolas de magia que quicam, raios que caem (marca no chão antes) e, da 2ª fase, corvos.
   De tempos em tempos desce para mexer o caldeirão e fica parada: pular no chapéu dela. Depois do 2º acerto ela foge voando
   para o sol: o caldeirão ronca, brilha e explode — quem estiver no círculo do caldeirão é jogado bem alto: pular em cima dela no ar.
   Ao vencer, a Árvore Mãe acorda e brilha, e vem o cartão de Fim da aventura (winGame). */
function cpCauldron(x,y){var g=new T.Group(),ir=M(0x1c1a22,.4,.5);var p=mesh(new T.SphereGeometry(1.1,18,12,0,Math.PI*2,Math.PI*.25,Math.PI*.75),ir);p.position.y=1.15;g.add(p);
  var rim=mesh(new T.TorusGeometry(.8,.12,8,24),ir);rim.rotation.x=Math.PI/2;rim.position.y=1.9;g.add(rim);
  var liq=new T.Mesh(new T.CircleGeometry(.8,20),new T.MeshStandardMaterial({color:0x60ff50,emissive:0x30e020,emissiveIntensity:.8,roughness:.3}));liq.rotation.x=-Math.PI/2;liq.position.y=1.82;g.add(liq);
  [0,2.1,4.2].forEach(function(a){var l=mesh(new T.CylinderGeometry(.08,.06,.6,5),ir);l.position.set(Math.cos(a)*.6,.25,Math.sin(a)*.6);g.add(l)});
  var ring=new T.Mesh(new T.RingGeometry(1.2,1.5,32),new T.MeshBasicMaterial({color:0xffd060,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;g.add(ring);
  g.position.set(x,y,-.2);add(g);return {g:g,liq:liq,ring:ring}}
function cpBossBuild(){var B=LV.copa&&LV.copa.boss;if(!B)return;var fl=B.floor;
  var w0={l:B.x0-1.2,r:B.x0,t:fl+12,b:fl-.1,oneway:false,slip:false,dead:true};solids.push(w0);var m0=rtWallMesh(B.x0-.6,fl,fl+12);m0.material=cpMats().bark;solids.push({l:B.x1+.2,r:B.x1+1.6,t:fl+14,b:fl-.1,oneway:false,slip:false});var mE=rtWallMesh(B.x1+.9,fl,fl+14);mE.material=cpMats().bark;/* fundo da arena: galhos fechando o fim do galho (não dá para cair) */
  var wv=cpWitchVis();wv.g.scale.setScalar(2.1);wv.g.visible=false;add(wv.g);var cd=cpCauldron(B.cx,fl);solids.push({l:B.cx-.95,r:B.cx+.95,t:fl+1.95,b:fl,oneway:false,slip:false});/* caldeirão sólido: não dá para atravessar, dá para subir */
  var stars=new T.Group();for(var s=0;s<4;s++){var st=mesh(new T.OctahedronGeometry(.18),new T.MeshBasicMaterial({color:0xffe060}),false,false);st.position.set(Math.cos(s*1.57)*1,2.6,Math.sin(s*1.57)*1);stars.add(st)}stars.visible=false;wv.g.add(stars);
  CP.boss={B:B,w0:w0,m0:m0,v:wv,cd:cd,stars:stars,orbs:[],bolts:[],crows:[],st:'wait',hp:3,max:3,x:B.cx,y:fl+7,t:0,att:2,n:0,won:false};cpBossReset()}
function cpBossReset(){var b=CP&&CP.boss;if(!b)return;b.orbs.concat(b.bolts,b.crows).forEach(function(q){q.m&&q.m.parent&&q.m.parent.remove(q.m)});b.orbs=[];b.bolts=[];b.crows=[];
  if(b.won)return;b.st='wait';b.hp=b.max;b.x=b.B.cx;b.y=b.B.floor+7;b.w0.dead=true;b.m0.visible=false;b.v.g.visible=false;b.n=0;RT&&(RT.camLock=null);$('bossBar').hidden=true;b.cd.ring.material.opacity=0}
function cpBossBar(){var b=CP.boss;$('bossFill').style.width=(b.hp/b.max*100)+'%'}
function cpBossUpd(dt){var b=CP.boss;if(!b)return;var B=b.B,fl=B.floor,t=CP.t,v=b.v,ph=b.max-b.hp+1;
  v.g.position.set(b.x,b.y+(b.st==='stir'?0:Math.sin(t*3)*.2),-.3);v.g.rotation.y=b.st==='stir'?0:(P.x<b.x?-Math.PI/2+.4:Math.PI/2-.4);v.broom.visible=b.st!=='stir';b.stars.visible=b.st==='stir';b.stars.rotation.y+=dt*4;
  b.cd.liq.material.emissiveIntensity=.8+Math.sin(t*6)*.3+(b.st==='flee'?b.t*0:0);
  /* bolas de magia que quicam */
  b.orbs=b.orbs.filter(function(o){o.vy-=22*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.y<fl+.35){o.y=fl+.35;o.vy=Math.abs(o.vy)*.8;o.n++}o.m.position.set(o.x,o.y,0);o.m.rotation.y+=dt*6;
    if(state==='play'&&Math.abs(P.x-o.x)<.45+P.w/2&&o.y>P.y-.3&&o.y<P.y+P.h+.3)hurt(o.x,1);if(o.n>3||o.x<B.x0||o.x>B.x1){o.m.parent&&o.m.parent.remove(o.m);return false}return true});
  /* raios: marca no chão, depois cai */
  b.bolts=b.bolts.filter(function(q){q.t-=dt;if(q.t>0){q.m.material.opacity=.3+Math.sin(t*30)*.2;return true}
    if(!q.hit){q.hit=1;q.m.scale.set(1,1,1);q.m.position.y=fl+6;q.m.geometry=new T.CylinderGeometry(.35,.35,12,8);q.m.material.opacity=.85;q.m.material.color.setHex(0xd8b0ff);beep(90,.3,'square',.05,-40);shake=Math.max(shake,.2);
      if(state==='play'&&Math.abs(P.x-q.x)<.9+P.w/2)hurt(q.x,1)}
    if(q.t<-.25){q.m.parent&&q.m.parent.remove(q.m);return false}q.m.material.opacity=.85*(1+q.t/.25);return true});
  /* corvos da Bruxa */
  b.crows=b.crows.filter(function(c){c.t+=dt;var dx=P.x-c.x,dy=P.y+.8-c.y,d=Math.hypot(dx,dy)||1,sp=c.t<5?4.2:7;if(c.t<5){c.x+=dx/d*sp*dt;c.y+=dy/d*sp*dt}else{c.y+=sp*dt}c.m.position.set(c.x,c.y,0);c.m.rotation.y=dx<0?Math.PI:0;
    if(state==='play'&&Math.abs(P.x-c.x)<.5+P.w/2&&c.y>P.y-.2&&c.y<P.y+P.h+.2){if(P.vy<0&&P.y>c.y-.2){c.dead=1;sfx.stomp();emit(dustPool,c.x,c.y,8,2,.5,.5,1.2,-.2);P.vy=keys.jump?13:10}else hurt(c.x,1)}
    if(c.dead||c.y>fl+16){c.m.parent&&c.m.parent.remove(c.m);return false}return true});
  if(b.st==='wait'){if(state==='play'&&P.x>B.x0+2&&P.y>=fl-.2){b.st='intro';b.t=1.6;b.w0.dead=false;b.m0.visible=true;v.g.visible=true;cpPoof(b.x,b.y);$('bossBar').hidden=false;var bn=$('bossBar').querySelector('span');if(bn)bn.textContent='A Bruxa';cpBossBar();
      RT.camLock={x:(B.x0+B.x1)/2,y:fl+5.4,z:1.7};sfx.boss();toast('A Bruxa: "Hi hi hi! A Árvore Mãe é minha!"')}return}
  if(b.st==='intro'){b.t-=dt;if(b.t<=0){b.st='fly';b.att=1.5;if(!CP.toldB){CP.toldB=1;toast('Quando ela descer para mexer o caldeirão, pule no chapéu dela!')}}return}
  if(b.st==='dead'){b.t+=dt;b.y+=dt*(1+b.t*3);b.x+=dt*4;v.g.rotation.z+=dt*4;if(b.t>1.2&&v.g.visible){v.g.visible=false;cpPoof(b.x,b.y)}
    if(b.t>1.2&&b.t<4){if(Math.random()<dt*20)emit(sparkPool,B.cx+(Math.random()-.5)*30,fl+Math.random()*12,4,3,.9,.8,.3,2)}
    if(b.t>3.4&&!b.end){b.end=1;if(state==='play')winGame()}return}
  if(b.st==='fly'){var tx=B.cx+Math.sin(t*.7)*(B.x1-B.x0)*.38,ty=fl+6.5+Math.sin(t*1.4)*1.2;b.x+=(tx-b.x)*Math.min(1,dt*1.6);b.y+=(ty-b.y)*Math.min(1,dt*1.6);
    b.att-=dt;if(b.att<=0){b.n++;
      if(b.n%4===0){b.st='down';beep(300,.3,'sine',.03,-200)}
      else if(b.n%2===1){var k=ph>=2?3:2;for(var i=0;i<k;i++){var om=mesh(new T.SphereGeometry(.32,10,8),new T.MeshStandardMaterial({color:0xc070ff,emissive:0x8030e0,emissiveIntensity:1,roughness:.3}),false,false);add(om);b.orbs.push({x:b.x,y:b.y,vx:(P.x-b.x)/1.4+(i-1)*1.6,vy:2,n:0,m:om})}beep(500,.15,'square',.03,-200)}
      else{var xs=[P.x];if(ph>=2)xs.push(P.x+(P.x<B.cx?3:-3));if(ph>=3)xs.push(P.x+(P.x<B.cx?-3:3));xs.forEach(function(x){x=clamp(x,B.x0+.5,B.x1-.5);var bm=new T.Mesh(new T.CircleGeometry(.9,20),new T.MeshBasicMaterial({color:0xb070ff,transparent:true,opacity:.4,depthWrite:false}));bm.rotation.x=-Math.PI/2;bm.position.set(x,fl+.04,0);add(bm);b.bolts.push({x:x,t:.8,m:bm})})}
      if(ph>=2&&b.crows.length<2&&Math.random()<.4)[0,1].forEach(function(i){var cm=makeCrow();var cg=cm.g||cm;add(cg);b.crows.push({x:B.x0+(i?B.x1-B.x0:0),y:fl+9,t:0,m:cg})});
      b.att=2.2-ph*.35}}
  else if(b.st==='down'){if(b.sd===undefined||b.t2!==b.n){b.sd=P.x<B.cx?-1:1;b.t2=b.n}b.x+=(B.cx+1.55*b.sd-b.x)*Math.min(1,dt*2.5);b.y+=(fl+.2-b.y)*Math.min(1,dt*2.5);if(Math.abs(b.y-fl-.2)<.15){b.st='stir';b.t=3.2-ph*.5}}
  else if(b.st==='stir'){b.t-=dt;v.g.rotation.z=Math.sin(t*6)*.08;
    if(state==='play'&&P.vy<0&&Math.abs(P.x-b.x)<1.3&&P.y>b.y+2&&P.y<b.y+3.6){if(b.hp>1)b.hp--;cpBossBar();P.vy=keys.jump?15:12;P.grounded=false;sfx.stomp();emit(sparkPool,b.x,b.y+3,24,5,.9,.5,.3,2);shake=.35;v.g.rotation.z=0;
      if(b.hp<=1){b.st='flee';b.t=0;toast('Ela está fugindo para o sol! Fique no círculo do caldeirão!')}else{b.st='fly';b.att=1.4;toast('Isso! Ela ficou furiosa...')}}
    else if(b.t<=0){b.st='fly';b.att=1;v.g.rotation.z=0}}
  else if(b.st==='flee'){b.t+=dt;b.x+=(B.cx-b.x)*Math.min(1,dt*.8);b.y+=(fl+9-b.y)*Math.min(1,dt*.8);var rg=b.cd.ring.material;rg.opacity=.35+Math.sin(t*14)*.25;b.cd.g.position.x=B.cx+(b.t>1.5?Math.sin(t*60)*.05:0);
    if(b.t>3){rg.opacity=0;b.cd.g.position.x=B.cx;emit(sparkPool,B.cx,fl+2,40,7,1.2,.6,.5,3);emit(dustPool,B.cx,fl+1.5,20,4,.8,.8,1.3,-.2);shake=.5;beep(70,.6,'square',.06,-30);
      if(state==='play'&&Math.abs(P.x-B.cx)<1.6&&P.y<fl+2.5){P.vy=30;P.noCut=1.4;P.y=Math.max(P.y,fl+.1);P.grounded=false;P.onPlat=null;P.dj=false;toast('Agora! Caia em cima dela!')}
      b.st='flee2';b.t=0}}
  else if(b.st==='flee2'){b.t+=dt;b.x=B.cx+Math.sin(b.t*1.5)*.6;/* fica em cima do caldeirão: quem é jogado pela explosão cai em cima dela */
    if(state==="play"&&P.vy<0&&Math.abs(P.x-b.x)<1.9&&P.y>b.y+1&&P.y<b.y+4.4){b.hp=0;cpBossBar();P.vy=12;sfx.win();$('bossBar').hidden=true;b.st='dead';b.t=0;b.won=true;RT.camLock=null;emit(sparkPool,b.x,b.y+2,50,8,1.4,.6,.5,4);toast('A Bruxa foi vencida! A Árvore Mãe acordou!');
      b.orbs.concat(b.bolts,b.crows).forEach(function(q){q.m&&q.m.parent&&q.m.parent.remove(q.m)});b.orbs=[];b.bolts=[];b.crows=[];return}
    if(b.t>6){b.st="fly";b.att=1.2;b.n=1;toast('Ela voltou! Espere ela descer de novo')}}
  /* encostar nela machuca (menos quando está mexendo o caldeirão) */
  if(state==='play'&&b.st!=='stir'&&b.st!=='dead'&&b.st!=='wait'&&b.st!=='flee'&&b.st!=='flee2'&&Math.abs(P.x-b.x)<1+P.w/2&&P.y<b.y+2.6&&P.y+P.h>b.y+.4&&!(P.vy<0&&P.y>b.y+1.4))hurt(b.x,1)}
