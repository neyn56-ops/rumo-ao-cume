/*@@parte:37_raizes.js*/
/* ===================== Mundo 21 — Raízes da Árvore Mãe =====================
   Plano aprovado pelo dono (05/11): embaixo da Árvore Mãe, escuro mas legível — a luz vem de cogumelos, musgo e esporos
   (cores que brilham, quase sem luz de verdade, leve no celular). Monta como a caverna (name 'cave', roots:1).
   Parte 1: a descida — raiz que cresce e vira ponte (tocar a semente), cogumelos que pulam, esporos que acendem
   prateleiras de fungo escondidas. Partes 2 e 3 (galerias, coração das raízes e a Aranha) vêm depois. */
var RT=null,rtM=null;
THEMES.push({name:'cave',roots:1,sky:['#0a1830','#14284a','#1e3c5a','#0c1c30'],fog:'#16304a',fd:.012,sun:0xc8dcff,si:1.25,sunOff:[-14,26,14],hemi:[0xa8c8ff,0x1c2a2a,.62],exp:1.0,env:5,lantern:3.4,snow:false,mz:-26,valley:0x0a2018});/* 22 */
function rtMats(){if(rtM)return rtM;
  rtM={bark:pbr(texWood,.95,1.2,{color:new T.Color(0x6a4a34)}),barkD:pbr(texWood,.95,1.2,{color:new T.Color(0x4a3426)}),
    stem:M(0xe8e0c8,.7),capG:new T.MeshStandardMaterial({color:0x10a060,emissive:0x00d070,emissiveIntensity:.55,roughness:.5}),
    capB:new T.MeshStandardMaterial({color:0x1060c0,emissive:0x0080ff,emissiveIntensity:.55,roughness:.5}),
    capP:new T.MeshStandardMaterial({color:0x8030b0,emissive:0xa020e0,emissiveIntensity:.5,roughness:.5}),
    glow:new T.MeshStandardMaterial({color:0xb8ffd0,emissive:0x60ffa8,emissiveIntensity:1.2,roughness:.4}),
    seed:new T.MeshStandardMaterial({color:0xfff0a0,emissive:0xffc040,emissiveIntensity:1.2,roughness:.3}),
    shelfOff:new T.MeshStandardMaterial({color:0x2a4038,emissive:0x0a3020,emissiveIntensity:.5,roughness:.8,transparent:true,opacity:.35,depthWrite:false}),
    shelfOn:new T.MeshStandardMaterial({color:0x30a080,emissive:0x10c890,emissiveIntensity:.6,roughness:.6}),
    spore:new T.MeshStandardMaterial({color:0xc0ffe0,emissive:0x40ffb0,emissiveIntensity:1.4,roughness:.4,transparent:true,opacity:.9}),
    moss:pbr(texGrass,.95,.6,{color:new T.Color(0x5a9a5a)})};
  return rtM}
MATS.push({top:pbr(texGrass,.95,.7,{color:new T.Color(0x2a5a34)}),side:pbr(texDirt,.97,1,{color:new T.Color(0x3a2a20)}),slab:pbr(texWood,.95,1,{color:new T.Color(0x6a4a34)}),meadow:pbr(texGrass,.95,.7,{color:new T.Color(0x1e4428)}),cliff:pbr(texDirt,.97,1,{color:new T.Color(0x4a3426)})});/* 22: musgo e terra escura */
/* música das raízes: lenta, misteriosa, com eco (entra antes da música do mapa, que é sempre a última) */
MUSIC.splice(MUSIC.length-1,0,{bpm:84,lead:'sine',lv:.05,drums:1,bassT:0,
  mel:[64,0,67,0,71,0,69,67, 64,0,0,62,0,64,0,0, 60,0,64,0,67,0,66,64, 62,0,59,0,62,0,0,0],
  roots:[28,24,26,23],ch:[[52,55,59],[48,52,55],[50,54,57],[47,50,54]]});/* 18 */
/* cenário: raízes enormes que descem do teto, cogumelos que brilham, fios de luz pendurados */
function rtDecor(th,r,dummy){var A=rtMats(),xe=sceneEnd(),L=[],i,k;
  for(i=0;i<Math.round(xe/7);i++){var x=-10+r()*(xe+10),z=-7-r()*14,pts=[],y=17,xx=x,zz=z;
    for(k=0;k<6;k++){pts.push(new T.Vector3(xx,y,zz));y-=3+r()*1.5;xx+=(r()-.5)*4;zz+=(r()-.5)*1.5}pts.push(new T.Vector3(xx+(r()-.5)*3,mY(xx,zz)-.6,zz));
    var rad=.35+r()*1.1;L.push({g:new T.TubeGeometry(new T.CatmullRomCurve3(pts),28,rad,7,false)});
    if(r()<.6){var p2=[pts[2].clone(),pts[3].clone().add(new T.Vector3((r()-.5)*5,-1,(r()-.5)*2)),new T.Vector3(pts[3].x+(r()-.5)*7,mY(pts[3].x,pts[3].z)-.4,pts[3].z+(r()-.5)*2)];L.push({g:new T.TubeGeometry(new T.CatmullRomCurve3(p2),14,rad*.5,6,false)})}}
  add(new T.Mesh(mergeG(L),A.barkD));
  /* cogumelos que brilham: atrás do caminho, na beira das plataformas e no fundo */
  var sg=new T.CylinderGeometry(.06,.09,1,6);sg.translate(0,.5,0);var cg=new T.SphereGeometry(.5,10,6,0,Math.PI*2,0,Math.PI/2);
  var spots=[];(LV.solids||[]).forEach(function(s){if(s[5])return;for(var xx=s[0]+.8;xx<s[1]-.8;xx+=1.4+r()*2.6)spots.push([xx,s[2],-2.6-r()*1.4])});
  for(i=0;i<70;i++){var bx=-10+r()*(xe+10),bz=-8-r()*12;spots.push([bx,mY(bx,bz),bz])}
  var caps=[A.capG,A.capB,A.capP],n=spots.length,ST=inst(sg,A.stem,n,false),CP=caps.map(function(m){return inst(cg,m,n,false)}),cn=[0,0,0];
  spots.forEach(function(p,j){var h=.25+r()*.7,w=.18+r()*.35,ci=r()<.55?0:(r()<.6?1:2);
    dummy.position.set(p[0],p[1],p[2]);dummy.rotation.set((r()-.5)*.3,0,(r()-.5)*.3);dummy.scale.set(w*2,h,w*2);dummy.updateMatrix();ST.setMatrixAt(j,dummy.matrix);
    dummy.position.set(p[0],p[1]+h,p[2]);dummy.scale.set(w*2,w*1.3,w*2);dummy.updateMatrix();CP[ci].setMatrixAt(cn[ci]++,dummy.matrix)});
  ST.count=n;add(ST);CP.forEach(function(m,ci){m.count=cn[ci];add(m)});
  /* fios de luz pendurados no teto (com bolinhas que brilham) */
  L=[];var B=[];for(i=0;i<Math.round(xe/3);i++){var fx=-10+r()*(xe+10),fz=-3-r()*14,fl=2+r()*6;L.push({g:xf(new T.CylinderGeometry(.015,.015,fl,3),[fx,17-fl/2,fz])});
    for(k=0;k<3;k++)B.push({g:xf(new T.SphereGeometry(.07+r()*.05,6,4),[fx,17-fl*(.4+k*.3),fz])})}
  add(new T.Mesh(mergeG(L),M(0x6a8a70,.8)));add(new T.Mesh(mergeG(B),A.glow))}
/* bloco com 6º valor 'root': raiz grossa deitada (plataforma de madeira viva) */
function rtSolid(s,m3){var A=rtMats(),x0=s[0],x1=s[1],top=s[2],w=x1-x0,cx=(x0+x1)/2,R=.55;
  var g=new T.CylinderGeometry(R,R*.9,w+.6,12,Math.max(2,w|0));g.rotateZ(Math.PI/2);var m=mesh(ldRough(g,.08,2.2),A.bark);m.position.set(cx,top-R,-.2);add(m);
  var ms=mesh(boxGeo(w-.2,.08,.8,2),A.moss);ms.position.set(cx,top-.02,-.2);add(ms);
  [x0+.4,x1-.4].forEach(function(px){var dg=new T.CylinderGeometry(.18,.3,4,6);var d=mesh(dg,A.barkD);d.position.set(px,top-R-2,-1.2);d.rotation.z=(px<cx?.3:-.3);add(d)});/* raízes finas que seguram (descem para trás) */
  solids.push({l:x0,r:x1,t:top,b:top-R*2,oneway:false,slip:false})}
/* ---- montagem: sementes que fazem a raiz crescer, esporos que acendem prateleiras de fungo ---- */
function rtBuild(th){RT={t:0,grow:[],spores:[]};var A=rtMats(),C=LV.roots||{};
  (C.bridges||[]).forEach(function(b){/* b = {seed:[x,y], l, r, t, dur} */
    var so={l:b.l,r:b.l,t:b.t,b:b.t-.9,oneway:false,slip:false,dead:true,rtb:1};solids.push(so);
    var sd=new T.Group(),core=mesh(new T.IcosahedronGeometry(.28,1),A.seed,false,false);core.scale.y=1.3;sd.add(core);
    var husk=mesh(new T.SphereGeometry(.42,10,6,0,Math.PI*2,Math.PI*.45,Math.PI*.55),A.barkD,false,false);husk.position.y=-.1;sd.add(husk);
    var bm=new T.Mesh(new T.CylinderGeometry(.5,.5,7,12,1,true),new T.MeshBasicMaterial({color:0xffe080,transparent:true,opacity:.12,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide}));bm.position.y=3.5;sd.add(bm);/* coluna de luz: mostra onde a semente pega */
    sd.position.set(b.seed[0],b.seed[1],0);add(sd);
    var w=b.r-b.l,g=new T.CylinderGeometry(.5,.42,w,12,Math.max(2,w|0));g.rotateZ(-Math.PI/2);g.translate(w/2,0,0);
    var rm=mesh(ldRough(g,.07,2.4),A.bark);rm.position.set(b.l,b.t-.5,0);rm.scale.x=.001;add(rm);
    var lf=[];for(var x=.6;x<w-.4;x+=1.1)lf.push({g:xf(new T.SphereGeometry(.16,6,4),[x,.42,(x*7%1)-.5],0,[1.6,.5,1])});
    var lm=new T.Mesh(mergeG(lf),new T.MeshStandardMaterial({color:0x6ad070,emissive:0x1a6a20,emissiveIntensity:.5,roughness:.7}));rm.add(lm);
    RT.grow.push({b:b,so:so,sd:sd,core:core,m:rm,st:'idle',t:0,k:0,dur:b.dur||9})});
  (C.spores||[]).forEach(function(s){/* s = {at:[x,y], shelves:[[l,r,t],...], dur} */
    var g=new T.Group(),bl=[];for(var i=0;i<7;i++){var b=mesh(new T.SphereGeometry(.12+Math.random()*.1,8,6),A.spore,false,false);b.position.set((Math.random()-.5)*.9,(Math.random()-.5)*.9,(Math.random()-.5)*.5);g.add(b);bl.push(b)}
    g.position.set(s.at[0],s.at[1],0);add(g);
    var sh=s.shelves.map(function(q){var w=q[1]-q[0],cg=new T.CylinderGeometry(w/2+.2,w/2-.1,.35,14,1,false,0,Math.PI);cg.rotateY(-Math.PI/2);
      var m=mesh(cg,A.shelfOff,false,false);m.scale.z=1.2;m.position.set((q[0]+q[1])/2,q[2]-.18,-1);add(m);
      var so={l:q[0],r:q[1],t:q[2],b:q[2]-.35,oneway:false,slip:false,dead:true};solids.push(so);return {m:m,so:so}});
    RT.spores.push({s:s,g:g,bl:bl,sh:sh,st:'idle',t:0,dur:s.dur||8})});
  rtBuild2();rtBossBuild();rtReset()}
function rtReset(){if(!RT)return;rtReset2();rtBossReset();RT.grow.forEach(function(q){q.st='idle';q.t=0;q.k=0;q.so.dead=true;q.so.r=q.so.l;q.m.scale.x=.001;q.sd.visible=true});
  RT.spores.forEach(function(q){q.st='idle';q.t=0;q.g.visible=true;q.sh.forEach(function(h){h.so.dead=true;h.m.material=rtM.shelfOff})})}
function rtNear(x,y,d){return Math.abs(P.x-x)<d&&y>P.y-.4&&y<P.y+P.h+.4}
function rtUpd(dt){if(!RT)return;RT.t+=dt;rtUpd2(dt);rtBossUpd(dt);
  RT.grow.forEach(function(q){var b=q.b,w=b.r-b.l;
    if(q.st==='idle'){q.core.rotation.y+=dt*1.5;q.core.material.emissiveIntensity=1+Math.sin(RT.t*4)*.3;
      if(state==='play'&&Math.abs(P.x-b.seed[0])<.9&&P.y<b.seed[1]+6.5&&P.y+P.h>b.seed[1]-.5){/* a coluna de luz inteira acende a semente (não dá para pular por cima sem pegar) */q.st='grow';q.t=0;sfxMagic();emit(sparkPool,b.seed[0],b.seed[1],16,3,.9,.8,.3,0);if(!RT.told){RT.told=1;toast('A raiz cresce e vira ponte! Ela murcha depois de um tempo')}}}
    else if(q.st==='grow'){q.k=Math.min(1,q.k+dt/.9);q.so.dead=false;q.so.r=b.l+w*q.k;if(q.k>=1){q.st='on';q.t=q.dur}}
    else if(q.st==='on'){q.t-=dt;if(q.t<=0){q.st='wither';beep(200,.4,'sine',.02,-120)}}
    else if(q.st==='wither'){q.k=Math.max(0,q.k-dt/1.2);q.so.l=b.l+w*(1-q.k)*0;q.so.r=b.l+w*q.k;if(q.k<=.02){q.so.dead=true;q.so.r=b.l;q.st='rest';q.t=1.2}}
    else if(q.st==='rest'){q.t-=dt;if(q.t<=0)q.st='idle'}
    var blink=q.st==='on'&&q.t<1.6&&Math.floor(q.t*8)%2===0;
    q.m.scale.x=Math.max(.001,q.k);q.m.visible=!blink;q.m.position.y=b.t-.5;q.sd.visible=q.st==='idle'||q.st==='rest'});
  RT.spores.forEach(function(q){var s=q.s;
    if(q.st==='idle'){q.g.rotation.y+=dt*.6;q.g.position.y=s.at[1]+Math.sin(RT.t*1.5)*.15;
      if(state==='play'&&rtNear(s.at[0],s.at[1],1)){q.st='on';q.t=q.dur;q.g.visible=false;emit(sparkPool,s.at[0],s.at[1],24,4,1,.6,.2,0);beep(880,.25,'triangle',.03,400);
        q.sh.forEach(function(h){h.so.dead=false;h.m.material=rtM.shelfOn});if(!RT.toldS){RT.toldS=1;toast('Os esporos acenderam os fungos! Dá para subir neles por um tempo')}}}
    else if(q.st==='on'){q.t-=dt;var bl=q.t<1.6&&Math.floor(q.t*8)%2===0;q.sh.forEach(function(h){h.m.visible=!bl});
      if(q.t<=0){q.st='rest';q.t=2;q.sh.forEach(function(h){h.so.dead=true;h.m.material=rtM.shelfOff;h.m.visible=true})}}
    else if(q.st==='rest'){q.t-=dt;if(q.t<=0){q.st='idle';q.g.visible=true}}})}
/* ===== Parte 2: as galerias — cipós que balançam, raízes que sobem e descem, raízes de espinho, aranhinhas no fio ===== */
/* cipó: o Kuro agarra a ponta no ar, balança (seta empurra o balanço) e solta com o pulo, levando o embalo */
function rtVineMesh(L){var A=rtMats(),g=new T.Group(),seg=[],lv=[],n=Math.ceil(L/.5);
  for(var i=0;i<n;i++){var y=-i*.5-.25,w=Math.sin(i*1.7)*.05;seg.push({g:xf(new T.CylinderGeometry(.06,.07,.52,5),[w,y,0],[0,0,w])});if(i%2)lv.push({g:xf(new T.SphereGeometry(.13,6,4),[(i%4?.12:-.12),y,0],0,[1.6,.5,1])})}
  g.add(new T.Mesh(mergeG(seg),M(0x3a6a2a,.8)));g.add(new T.Mesh(mergeG(lv),new T.MeshStandardMaterial({color:0x4aa050,emissive:0x0a4a18,emissiveIntensity:.4,roughness:.7})));
  var tip=mesh(new T.SphereGeometry(.2,10,8),A.glow,false,false);tip.position.y=-L;g.add(tip);return g}
function rtLiftMesh(w){var A=rtMats(),g=new T.Group(),R=.5,c=new T.CylinderGeometry(R,R*.9,w,12,2);c.rotateZ(Math.PI/2);var m=mesh(ldRough(c,.06,2.4),A.bark);m.position.y=-R;g.add(m);
  var ms=mesh(boxGeo(w-.2,.08,.8,2),A.moss);ms.position.y=-.02;g.add(ms);return g}
function rtColMesh(w){var g=rtLiftMesh(w),tr=mesh(ldRough(new T.CylinderGeometry(w*.42,w*.5,14,10,6),.1,1.6),rtMats().barkD);tr.position.set(0,-7.4,-.2);g.add(tr);return g}/* raiz que sobe: tronco grosso que vem do fundo */
function rtMoverMesh(w){var g=rtLiftMesh(w),A=rtMats();[-1,1].forEach(function(sd){var v=mesh(new T.CylinderGeometry(.04,.04,12,4),M(0x3a6a2a,.8),false,false);v.position.set(sd*(w/2-.3),6,0);g.add(v)});return g}/* raiz que anda: pendurada em cipós */
function rtThornMesh(w){var A=rtMats(),g=new T.Group(),L=[];for(var x=-w/2+.25;x<w/2;x+=.45)L.push({g:xf(new T.ConeGeometry(.16,1.5,5),[x,.75,(x*3%1)*.4-.2],[0,0,(x%1-.5)*.25])});
  g.add(new T.Mesh(mergeG(L),M(0x6a3a5a,.6,0,{emissive:new T.Color(0x3a0a3a),emissiveIntensity:.6})));var b=mesh(boxGeo(w,.25,1,1),A.barkD);b.position.y=.1;g.add(b);return g}
function rtSpiderMesh(){var g=new T.Group(),bd=M(0x1a1420,.5),ey=new T.MeshBasicMaterial({color:0x60ff90});
  var ab=mesh(new T.SphereGeometry(.32,10,8),bd);ab.scale.set(1,.85,1.1);ab.position.y=.15;g.add(ab);var hd=mesh(new T.SphereGeometry(.2,8,6),bd);hd.position.y=-.2;g.add(hd);
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.05,6,4),ey,false,false);e.position.set(sd*.08,-.26,.15);g.add(e);
    for(var k=0;k<4;k++){var lg=mesh(new T.CylinderGeometry(.025,.02,.6,4),bd,false,false);lg.position.set(sd*.3,0,(k-1.5)*.13);lg.rotation.z=sd*(1.1-k*.08);g.add(lg)}});
  var th=mesh(new T.CylinderGeometry(.01,.01,1,3),new T.MeshBasicMaterial({color:0xd8f0e0,transparent:true,opacity:.6}),false,false);g.add(th);g.userData.th=th;return g}
function rtBuild2(){var C=LV.roots||{};RT.vines=[];RT.lifts=[];RT.thorns=[];RT.spiders=[];RT.sw=null;RT.swCd=0;
  (C.vines||[]).forEach(function(v){var m=rtVineMesh(v[2]);m.position.set(v[0],v[1],0);add(m);
    var bm=mesh(new T.CylinderGeometry(.35,.35,6,8),rtM.barkD);bm.rotation.x=Math.PI/2;bm.position.set(v[0],v[1]+.2,-2);add(bm);
    RT.vines.push({px:v[0],py:v[1],L:v[2],a:0,w:0,m:m,ph:v[0]})});
  (C.lifts||[]).forEach(function(q){var so={l:q[0]-q[1]/2,r:q[0]+q[1]/2,t:q[2],b:-14,oneway:false,slip:false};solids.push(so);var m=rtColMesh(q[1]);add(m);
    RT.lifts.push({x:q[0],y0:q[2],y1:q[3],sp:q[4]||.8,so:so,m:m})});
  (C.thorns||[]).forEach(function(q){var m=rtThornMesh(q[1]);add(m);RT.thorns.push({x:q[0],w:q[1],y:q[2],per:q[3]||2.4,off:q[4]||0,m:m,h:0})});
  (C.spiders||[]).forEach(function(q){var m=rtSpiderMesh();add(m);RT.spiders.push({x:q[0],top:q[1],low:q[2],y:q[1]-.5,st:'up',t:0,m:m,alive:true,cd:0})})}
function rtReset2(){if(!RT||!RT.vines)return;RT.sw=null;RT.swCd=0;RT.spiders.forEach(function(s){s.alive=true;s.st='up';s.y=s.top-.5;s.m.visible=true})}
function rtUpd2(dt){if(!RT.vines)return;var t=RT.t;if(RT.swCd>0)RT.swCd-=dt;
  RT.vines.forEach(function(v){if(RT.sw!==v){v.a=.22*Math.sin(t*1.3+v.ph);v.w=.22*1.3*Math.cos(t*1.3+v.ph)}v.m.rotation.z=v.a;
    if(!RT.sw&&RT.swCd<=0&&state==='play'&&!P.grounded&&!P.mount){var tx=v.px+Math.sin(v.a)*v.L,ty=v.py-Math.cos(v.a)*v.L;
      if(Math.abs(P.x-tx)<1&&ty>P.y-.3&&ty<P.y+P.h+.9){RT.sw=v;RT.jHeld=true;v.w=clamp(P.vx*Math.cos(v.a)/v.L,-2.6,2.6);sfx.check&&beep(300,.12,'triangle',.03,120);if(!RT.toldV){RT.toldV=1;toast('Segurou o cipó! Use a seta para balançar e pule para soltar')}}}});
  RT.lifts.forEach(function(q){var k=(1-Math.cos(t*q.sp))/2,ny=q.y0+(q.y1-q.y0)*k,dy=ny-q.so.t,carry=P.onPlat===q.so&&P.grounded;q.so.t=ny;q.so.b=-14;if(carry)P.y=ny;q.m.position.set(q.x,ny,0);
    if(dy>0&&state==='play'&&!carry&&P.x+P.w/2>q.so.l&&P.x-P.w/2<q.so.r&&P.y<ny&&P.y+P.h>ny-1){P.y=ny;P.vy=Math.max(P.vy,0)}});
  RT.thorns.forEach(function(q){var c=(t+q.off)%q.per,f=q.per;var tgt=c<f*.45?0:(c<f*.45+.45?.12+Math.sin(t*60)*.05:1);q.h+=(tgt-q.h)*Math.min(1,dt*(tgt>.5?14:6));
    q.m.position.set(q.x,q.y-1.5*(1-q.h),0);
    if(q.h>.6&&state==='play'&&Math.abs(P.x-q.x)<q.w/2+P.w/2-.1&&P.y<q.y+1.3*q.h&&P.y+P.h>q.y)hurt(q.x,1)});
  RT.spiders.forEach(function(s){if(!s.alive){return}var near=Math.abs(P.x-s.x)<3.2&&P.y<s.top;
    if(s.st==='up'&&near&&s.cd<=0){s.st='down';beep(140,.2,'sawtooth',.02,-60)}
    if(s.st==='down'){s.y=Math.max(s.low,s.y-dt*6);if(s.y<=s.low){s.st='wait';s.t=1.1}}
    else if(s.st==='wait'){s.t-=dt;s.y=s.low+Math.sin(t*3)*.1;if(s.t<=0)s.st='back'}
    else if(s.st==='back'){s.y=Math.min(s.top-.5,s.y+dt*2.2);if(s.y>=s.top-.5){s.st='up';s.cd=1.4}}
    if(s.cd>0)s.cd-=dt;s.m.position.set(s.x,s.y,0);var th=s.m.userData.th,len=s.top-s.y;th.scale.y=len;th.position.y=len/2+.3;
    if(state==='play'&&Math.abs(P.x-s.x)<.55+P.w/2&&P.y<s.y+.4&&P.y+P.h>s.y-.4){
      if(P.vy<0&&P.y>s.y-.1){s.alive=false;s.m.visible=false;emit(dustPool,s.x,s.y,10,2.4,.5,.5,1.2,-.2);sfx.stomp();P.vy=keys.jump?13:10}else hurt(s.x,1)}})}
/* depois da física do Kuro: se está no cipó, a posição é a da ponta do cipó (chamado em step, logo após o movimento) */
function rtSwingAfter(dt){var v=RT.sw;if(!v)return;var ax=keys.jx!==0?keys.jx:((keys.right?1:0)-(keys.left?1:0));
  v.w+=(-(26/v.L)*Math.sin(v.a)+ax*2.4/v.L*Math.cos(v.a)*1.6)*dt;v.w*=1-dt*.12;v.a=clamp(v.a+v.w*dt,-1.35,1.35);if(Math.abs(v.a)>=1.35)v.w*=-.3;
  var tx=v.px+Math.sin(v.a)*v.L,ty=v.py-Math.cos(v.a)*v.L;P.x=tx;P.y=ty-P.h*.92;P.vx=0;P.vy=0;P.grounded=false;P.onPlat=null;P.coyote=0;P.face=v.w>=0?1:-1;
  if(keys.jump&&!RT.jHeld){var sp=v.w*v.L;RT.sw=null;RT.swCd=.45;P.vx=clamp(sp*Math.cos(v.a),-11,11);P.vy=Math.max(7,9+sp*Math.sin(v.a)*.6);P.jbuf=0;P.dj=false;beep(520,.12,'triangle',.03,300)}
  RT.jHeld=keys.jump}
/* ===== Parte 3: o coração das raízes — luta com a Aranha das Raízes =====
   Ela fica pendurada no teto da arena e segue o Kuro: cospe bolas de teia (deixam uma teia no chão que prende os pés),
   desce de repente para morder e, a partir da 2ª fase, chama aranhinhas. Para vencer: quando ela estiver em cima de uma
   semente, o Kuro passa pela coluna de luz da semente → a raiz sobe com força e derruba a Aranha → ela fica tonta no chão
   com o abdômen brilhando → pular em cima. 3 vezes. Ao vencer, a parede de raízes da saída abre e fica aberta (mesmo se morrer). */
function rtBossMesh(){var g=new T.Group(),bd=M(0x1c1424,.45),ln=new T.MeshStandardMaterial({color:0x30ff90,emissive:0x10ff70,emissiveIntensity:.8,roughness:.4}),ey=new T.MeshBasicMaterial({color:0x7dff9a});
  var ab=mesh(new T.SphereGeometry(1.1,18,14),bd);ab.scale.set(1.15,.95,1.3);ab.position.set(0,.45,-.2);g.add(ab);
  var mk=[];for(var i=0;i<6;i++){var a=i/6*Math.PI*2;mk.push({g:xf(new T.SphereGeometry(.14,8,6),[Math.cos(a)*.55,1.25,-.2+Math.sin(a)*.65],0,[1,.4,1])})}mk.push({g:xf(new T.SphereGeometry(.3,10,6),[0,1.33,-.2],0,[1,.35,1.4])});
  var mm=new T.Mesh(mergeG(mk),ln);g.add(mm);
  var hd=mesh(new T.SphereGeometry(.55,14,10),bd);hd.position.set(0,.05,.95);g.add(hd);
  for(var e=0;e<6;e++){var em=mesh(new T.SphereGeometry(.08+(e<2?.04:0),6,4),ey,false,false);em.position.set((e%3-1)*.2,.22+(e<3?0:-.15),1.42);g.add(em)}
  [-1,1].forEach(function(sd){var fg=mesh(new T.ConeGeometry(.09,.4,5),M(0xd8d0c0,.4),false,false);fg.position.set(sd*.18,-.3,1.35);fg.rotation.x=Math.PI;g.add(fg)});
  var legs=[];[-1,1].forEach(function(sd){for(var k=0;k<4;k++){var hip=new T.Group();hip.position.set(sd*.6,.2,.7-k*.45);hip.rotation.y=sd*(-.5+k*.35);g.add(hip);
    var u=mesh(new T.CylinderGeometry(.08,.07,1.4,6),bd,false,false);u.rotation.z=sd*-1;u.position.set(sd*.6,.45,0);hip.add(u);
    var kn=new T.Group();kn.position.set(sd*1.2,.85,0);hip.add(kn);var l2=mesh(new T.CylinderGeometry(.065,.03,1.6,6),bd,false,false);l2.rotation.z=sd*-.35;l2.position.set(sd*.28,-.75,0);kn.add(l2);
    legs.push({hip:hip,kn:kn,sd:sd,k:k})}});
  var th=mesh(new T.CylinderGeometry(.03,.03,1,4),new T.MeshBasicMaterial({color:0xe8f4ec,transparent:true,opacity:.7}),false,false);g.add(th);
  var stars=new T.Group();for(var s=0;s<4;s++){var st=mesh(new T.OctahedronGeometry(.16),new T.MeshBasicMaterial({color:0xffe060}),false,false);st.position.set(Math.cos(s*1.57)*.9,2.1,Math.sin(s*1.57)*.9);stars.add(st)}stars.visible=false;g.add(stars);
  return {g:g,legs:legs,mark:ln,th:th,stars:stars}}
function rtWallMesh(x,y0,y1){var A=rtMats(),L=[];for(var i=0;i<4;i++){var g=new T.CylinderGeometry(.22,.3,y1-y0,7,4);L.push({g:xf(ldRough(g,.05,3),[x+(i%2?.25:-.25),(y0+y1)/2,-1+i*.7],[0,0,(i%2?.05:-.05)])})}
  var m=new T.Mesh(mergeG(L),A.bark);m.castShadow=true;add(m);return m}
function rtBossBuild(){var B=LV.roots&&LV.roots.boss;if(!B)return;var A=rtMats(),fl=B.floor;
  var w0={l:B.w0,r:B.w0+1.2,t:B.top,b:fl-.1,oneway:false,slip:false,dead:true},w1={l:B.w1,r:B.w1+1.2,t:B.top,b:fl-.1,oneway:false,slip:false,dead:false};solids.push(w0,w1);
  var m0=rtWallMesh(B.w0+.6,fl,B.top),m1=rtWallMesh(B.w1+.6,fl,B.top);
  /* teto de teia e raízes */var web=[],cx=(B.x0+B.x1)/2;for(var i=0;i<16;i++){var a=i/16*Math.PI,len=16;web.push({g:xf(new T.CylinderGeometry(.02,.02,len,3),[cx,B.top,-3],[0,0,a])})}
  for(var r=2;r<8;r+=1.6){var tg=new T.TorusGeometry(r,.02,3,40,Math.PI);tg.rotateZ(Math.PI);web.push({g:xf(tg,[cx,B.top,-3])})}
  add(new T.Mesh(mergeG(web),new T.MeshBasicMaterial({color:0xcfe8dc,transparent:true,opacity:.35})));
  var sp=rtBossMesh();add(sp.g);
  var seeds=B.seeds.map(function(x){var sd=new T.Group(),core=mesh(new T.IcosahedronGeometry(.3,1),A.seed,false,false);core.scale.y=1.3;sd.add(core);
    var bm=new T.Mesh(new T.CylinderGeometry(.32,.32,6,12,1,true),new T.MeshBasicMaterial({color:0xffe080,transparent:true,opacity:.07,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide}));bm.position.y=3;sd.add(bm);
    sd.position.set(x,fl+.6,0);add(sd);var rg=new T.CylinderGeometry(.35,.7,1,9,6);rg.translate(0,.5,0);var rm=mesh(ldRough(rg,.05,4),A.bark);rm.position.set(x,fl,0);rm.scale.y=.001;add(rm);
    return {x:x,g:sd,core:core,root:rm,st:'ready',t:0,h:0}});
  RT.boss={B:B,w0:w0,w1:w1,m0:m0,m1:m1,v:sp,seeds:seeds,webs:[],balls:[],kids:[],st:'wait',hp:3,max:3,x:cx,y:B.top-2.4,t:0,att:2,won:false};rtBossReset()}
function rtBossReset(){var b=RT&&RT.boss;if(!b)return;
  b.balls.forEach(function(q){q.m.parent&&q.m.parent.remove(q.m)});b.webs.forEach(function(q){q.m.parent&&q.m.parent.remove(q.m)});b.kids.forEach(function(q){q.m.parent&&q.m.parent.remove(q.m)});b.balls=[];b.webs=[];b.kids=[];RT.camLock=null;
  b.seeds.forEach(function(s){s.st='ready';s.t=0;s.h=0;s.root.scale.y=.001;s.g.visible=true});
  if(b.won){b.w0.dead=true;b.w1.dead=true;b.m0.visible=false;b.m1.visible=false;b.v.g.visible=false;$('bossBar').hidden=true;return}
  b.st='wait';b.hp=b.max;b.x=(b.B.x0+b.B.x1)/2;b.y=b.B.top-2.4;b.att=2.2;b.w0.dead=true;b.w1.dead=false;b.m0.visible=false;b.m1.visible=true;b.v.g.visible=true;$('bossBar').hidden=true}
function rtBossBar(){var b=RT.boss;$('bossFill').style.width=(b.hp/b.max*100)+'%'}
function rtBossUpd(dt){var b=RT.boss;if(!b)return;var B=b.B,fl=B.floor,t=RT.t,v=b.v,ph=b.max-b.hp+1;
  /* visual: pernas, fio, marcas */
  v.legs.forEach(function(l){var w=b.st==='stun'?Math.sin(t*20+l.k)*.15:Math.sin(t*(b.st==='hang'?6:3)+l.k*1.3+(l.sd>0?1:0))*.18;l.hip.rotation.z=l.sd*(.1+w);l.kn.rotation.z=l.sd*(-.2+w*.6)});
  v.mark.emissiveIntensity=b.st==='stun'?1.6+Math.sin(t*12)*.6:.7;v.stars.visible=b.st==='stun';v.stars.rotation.y+=dt*5;
  var thl=Math.max(.01,B.top-(b.y+1.3));v.th.scale.y=thl;v.th.position.set(0,1.3+thl/2,-.2);v.th.visible=b.st!=='stun'&&b.st!=='dead';
  v.g.position.set(b.x+(b.st==='warn'?Math.sin(t*50)*.08:0),b.y,0);v.g.rotation.y=b.st==='stun'?0:clamp((P.x-b.x)*.15,-.6,.6);
  /* sementes e raízes que sobem */
  b.seeds.forEach(function(s){s.core.rotation.y+=dt*1.5;
    if(s.st==='ready'&&b.st!=='wait'&&b.st!=='dead'&&state==='play'&&Math.abs(P.x-s.x)<.9&&P.y<fl+6){s.st='up';s.t=0;sfxMagic();emit(sparkPool,s.x,fl+.5,14,3,.8,.8,.3,0);s.g.visible=false}
    if(s.st==='up'){s.t+=dt;s.h=Math.min(1,s.t/.22);var hh=(B.top-fl-.4)*s.h;s.root.scale.y=Math.max(.001,hh);
      if((b.st==='hang'||b.st==='warn')&&Math.abs(b.x-s.x)<1.9&&fl+hh>b.y-.2){b.st='fall';b.vy=0;shake=Math.max(shake,.4);beep(90,.4,'square',.05,-40);emit(dustPool,b.x,b.y,16,3,.8,.8,1.3,-.2);if(!RT.toldB2){RT.toldB2=1;toast('Acertou! Agora pule no abdômen brilhante da Aranha!')}}
      if(s.t>.9){s.st='down';s.t=0}}
    else if(s.st==='down'){s.t+=dt;s.root.scale.y=Math.max(.001,(B.top-fl-.4)*(1-s.t/.5));if(s.t>.5){s.st='rest';s.t=0;s.root.scale.y=.001}}
    else if(s.st==='rest'){s.t+=dt;if(s.t>2.4){s.st='ready';s.g.visible=true}}});
  /* teias no chão: prendem os pés */
  b.webs=b.webs.filter(function(w){w.t-=dt;w.m.material.opacity=Math.min(.55,w.t*.4);if(state==='play'&&P.grounded&&Math.abs(P.x-w.x)<1.3&&Math.abs(P.y-fl)<.2){P.vx*=.55;P.webT=.2}if(w.t<=0){w.m.parent&&w.m.parent.remove(w.m);return false}return true});
  /* bolas de teia */
  b.balls=b.balls.filter(function(q){q.vy-=18*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.m.position.set(q.x,q.y,0);
    if(state==='play'&&Math.abs(P.x-q.x)<.6+P.w/2&&q.y>P.y&&q.y<P.y+P.h){hurt(q.x,1);q.y=fl-1}
    if(q.y<=fl+.1){q.m.parent&&q.m.parent.remove(q.m);var wm=new T.Mesh(new T.CircleGeometry(1.3,20),new T.MeshBasicMaterial({color:0xe8f4ec,transparent:true,opacity:.55,depthWrite:false}));wm.rotation.x=-Math.PI/2;wm.position.set(q.x,fl+.03,0);add(wm);b.webs.push({x:q.x,t:4,m:wm});return false}return true});
  /* aranhinhas que ela chama */
  b.kids=b.kids.filter(function(k){k.t+=dt;if(k.st==='down'){k.y=Math.max(fl+1.2,k.y-dt*7);if(k.y<=fl+1.2)k.st='walk'}else if(k.st==='walk'){k.x+=Math.sign(P.x-k.x)*dt*(2+ph*.4);if(k.t>7)k.st='up'}else{k.y+=dt*4}
    k.m.position.set(k.x,k.y,0);var th=k.m.userData.th,len=B.top-k.y;th.scale.y=Math.max(.01,len);th.position.y=len/2+.3;
    if(k.alive&&state==='play'&&Math.abs(P.x-k.x)<.55+P.w/2&&P.y<k.y+.4&&P.y+P.h>k.y-.4){if(P.vy<0&&P.y>k.y-.1){k.alive=false;emit(dustPool,k.x,k.y,8,2,.5,.5,1.2,-.2);sfx.stomp();P.vy=keys.jump?13:10}else hurt(k.x,1)}
    if(!k.alive||k.y>B.top){k.m.parent&&k.m.parent.remove(k.m);return false}return true});
  if(b.st==='wait'){if(state==='play'&&P.x>B.x0+2&&P.y>=fl-.2){b.st='intro';b.t=1.6;b.w0.dead=false;b.m0.visible=true;$('bossBar').hidden=false;var bn=$('bossBar').querySelector('span');if(bn)bn.textContent='Aranha das Raízes';rtBossBar();
      RT.camLock={x:(B.x0+B.x1)/2,y:fl+5,z:1.65};sfx.boss();toast('A Aranha das Raízes desceu do teto!')}return}
  if(b.st==='intro'){b.t-=dt;b.y=B.top-2.4-Math.sin(Math.min(1,(1.6-b.t)/1.6)*Math.PI)*1.2;if(b.t<=0){b.st='hang';b.att=1.4;if(!RT.toldB){RT.toldB=1;toast('Quando ela estiver em cima de uma semente, passe pela luz da semente!')}}return}
  if(b.st==='dead'){b.t+=dt;b.y-=dt*(1+b.t*4);v.g.rotation.z+=dt*2;if(b.t>1.6)v.g.visible=false;return}
  if(b.st==='hang'){var hy=B.top-2.4;b.y+=(hy-b.y)*Math.min(1,dt*3);var tx=clamp(P.x,B.x0+1.5,B.x1-1.5);b.x+=clamp(tx-b.x,-1,1)*dt*(1.6+ph*.6);
    b.att-=dt;if(b.att<=0){var dx=Math.abs(P.x-b.x);
      if(dx<1.6){b.st='warn';b.t=.65-ph*.08;beep(160,.3,'sawtooth',.03,-80)}
      else{var n=ph>=3?2:1;for(var i=0;i<n;i++){var tg=P.x+(i?(P.x<b.x?2:-2):0),T0=.95,bm=mesh(new T.SphereGeometry(.32,10,8),M(0xf0f8f0,.6),false,false);add(bm);b.balls.push({x:b.x,y:b.y-.2,vx:(tg-b.x)/T0,vy:(fl-(b.y-.2)+.5*18*T0*T0)/T0,m:bm})}beep(260,.15,'triangle',.03,-120)}
      if(ph>=2&&Math.random()<.35&&b.kids.length<2){[-1,1].forEach(function(sd){var km=rtSpiderMesh();add(km);b.kids.push({x:clamp(P.x+sd*4,B.x0+1,B.x1-1),y:B.top-.5,st:'down',t:0,m:km,alive:true})})}
      b.att=2.5-ph*.45}}
  else if(b.st==='warn'){b.t-=dt;if(b.t<=0){b.st='drop';b.vy=0}}
  else if(b.st==='drop'){b.vy+=40*dt;b.y=Math.max(fl+.5,b.y-b.vy*dt);if(b.y<=fl+.5){b.st='bite';b.t=.8;shake=Math.max(shake,.25);emit(dustPool,b.x,fl,10,2.5,.6,.6,1.2,-.2)}}
  else if(b.st==='bite'){b.t-=dt;if(b.t<=0)b.st='hang'}
  else if(b.st==='fall'){b.vy+=30*dt;b.y=Math.max(fl+.35,b.y-b.vy*dt);if(b.y<=fl+.35){b.st='stun';b.t=3.2-ph*.4;emit(dustPool,b.x,fl,16,3,.7,.7,1.3,-.2)}}
  else if(b.st==='stun'){b.t-=dt;
    if(state==='play'&&P.vy<0&&Math.abs(P.x-b.x)<1.5&&P.y>b.y+.9&&P.y<b.y+2.1){b.hp--;rtBossBar();P.vy=keys.jump?14:11;P.grounded=false;sfx.stomp();emit(sparkPool,b.x,b.y+1.6,24,5,.9,.5,.3,2);shake=.35;
      if(b.hp<=0){b.st='dead';b.t=0;b.won=true;sfx.win();$('bossBar').hidden=true;b.w0.dead=true;b.w1.dead=true;b.m0.visible=false;b.m1.visible=false;RT.camLock=null;emit(sparkPool,b.x,b.y+1,40,7,1.2,.6,.5,4);toast('A Aranha das Raízes foi vencida! O caminho abriu');
        b.kids.forEach(function(k){k.alive=false});return}
      b.st='climb';toast(b.hp===1?'Mais uma vez!':'Isso! Ela ficou mais rápida...')}
    else if(b.t<=0)b.st='climb'}
  else if(b.st==='climb'){b.y+=dt*4;if(b.y>=B.top-2.4){b.y=B.top-2.4;b.st='hang';b.att=1.6}}
  /* encostar machuca (menos quando está tonta no chão) */
  if(state==='play'&&b.st!=='stun'&&b.st!=='dead'&&Math.abs(P.x-b.x)<1.4+P.w/2&&P.y<b.y+1.6&&P.y+P.h>b.y-.4)hurt(b.x,1)}
