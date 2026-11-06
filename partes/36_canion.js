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
    far:new T.MeshStandardMaterial({map:st2,color:0xe8c8b8,roughness:.97}),wallM:new T.MeshStandardMaterial({map:st2,color:0xf0d4c4,roughness:.95}),
    col:M(0xffffff,.95,0,{vertexColors:true}),
    crust:pbr(texDirt,.97,.9,{color:new T.Color(0xc8784a)}),
    cactus:M(0x5f8a46,.8),cactusD:M(0x46703a,.85),flower:M(0xff8ab0,.6),
    upM:new T.MeshStandardMaterial({color:0x1a90e0,emissive:0x0070ff,emissiveIntensity:1,roughness:.4,transparent:true,opacity:.92}),
    dnM:new T.MeshStandardMaterial({color:0xff8020,emissive:0xff5000,emissiveIntensity:1,roughness:.4,transparent:true,opacity:.92}),
    ringM:new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,depthWrite:false}),
    swM:new T.MeshBasicMaterial({color:0xffe060,transparent:true,opacity:.75,depthWrite:false,side:T.DoubleSide}),
    rockC:pbr(texStone,.92,.5,{color:new T.Color(0xb85a38),flatShading:true}),
    stoneM:pbr(texStone,.9,.3,{color:new T.Color(0xb07a5a)}),
    archM:new T.MeshStandardMaterial({map:st,color:0xf0d0b8,roughness:.9,bumpMap:texStone.bump,bumpScale:.3}),
    glowM:new T.MeshStandardMaterial({color:0xffd060,emissive:0xffb020,emissiveIntensity:1.2,roughness:.4}),
    tabM:pbr(texStone,.9,.35,{color:new T.Color(0x9a5a3c)}),
    beamU:new T.MeshBasicMaterial({color:0x60d8ff,transparent:true,opacity:.13,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide}),
    beamD:new T.MeshBasicMaterial({color:0xffa040,transparent:true,opacity:.13,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide})};
  return cnM}
MATS.push({top:pbr(texDirt,.97,1.1,{color:new T.Color(0xe0a070)}),side:pbr(texStone,.95,.3,{color:new T.Color(0xb8643c)}),slab:pbr(texStone,.9,.2,{color:new T.Color(0xc07a52)}),meadow:pbr(texDirt,.97,1,{color:new T.Color(0xd89a6a)}),cliff:pbr(texStone,.95,.3,{color:new T.Color(0xa85a36)})});/* 21: Cânion Invertido — terra e pedra vermelhas */
/* música do cânion: manhã aberta, um pouco de faroeste (entra antes da música do mapa, que é sempre a última) */
MUSIC.splice(MUSIC.length-1,0,{bpm:104,lead:'triangle',lv:.05,drums:2,bassT:1,
  mel:[69,0,72,0,76,0,74,72, 69,0,0,67,0,69,0,0, 72,0,76,0,79,0,77,76, 74,0,72,0,69,0,0,0],
  roots:[33,41,36,40],ch:[[57,60,64],[53,57,60],[55,60,64],[56,59,64]]});/* 17 */
/* chão e teto do cânion: chão com terra vermelha por cima; teto (5º valor 'roof') com a crosta embaixo — é por onde o Kuro anda quando a gravidade vira */
function cnSolid(s,m3){var A=cnMats(),x0=s[0],x1=s[1],top=s[2],bot=s[3]!==undefined?s[3]:-14,w=x1-x0,cx=(x0+x1)/2;
  if(s[5]==='slab'||s[5]==='arch'){/* parte 3: pedra solta no ar (dá para andar em cima e embaixo) e o arco de pedra do final */
    var th=top-bot,sb=mesh(boxGeo(w,th,s[5]==='arch'?6.8:2.6,3),A.rock);sb.position.set(cx,bot+th/2,s[5]==='arch'?-1.6:-.3);add(sb);
    var cu=mesh(boxGeo(w+.1,.16,s[5]==='arch'?6.9:2.7,2),A.crust);cu.position.set(cx,bot+.08,sb.position.z);add(cu);
    var ct=mesh(boxGeo(w+.1,.16,2.7,2),m3.top);ct.position.set(cx,top-.08,-.3);if(s[5]==='slab')add(ct);
    if(s[5]==='slab'){var r=rnd(x0*13|0),pt=[];for(var i=0;i<3;i++){var ph=.5+r()*1.2;pt.push({g:xf(new T.ConeGeometry(.25+r()*.25,ph,5),[x0+.6+r()*(w-1.2),bot-ph/2+.05,-.3+(r()-.5)*1.2],[Math.PI,r()*3,0])})}add(new T.Mesh(mergeG(pt),A.crust))}
    else cnArch(x0,x1,bot,top);/* arco de pedra curvo atrás do caminho */
    solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,slip:false,roof:true,slab:1});return}
  if(s[5]==='ledge'){/* parte 3: saliência presa no paredão (a rocha entra até o fundo, z −7) com a parte de baixo afinando */
    var lb=mesh(ldRough(new T.BoxGeometry(w,top-bot,8,Math.max(2,w|0),2,6),.08,2.2),A.rock);lb.position.set(cx,(top+bot)/2,-3);add(lb);
    var lt=mesh(boxGeo(w+.1,.22,8.1,2),m3.top);lt.position.set(cx,top-.1,-3);add(lt);
    var un=mesh(new T.ConeGeometry(w*.45,2.2,6),A.rock);un.rotation.x=Math.PI;un.scale.z=2.2;un.position.set(cx,bot-1.05,-4);add(un);
    solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,slip:false});return}
  if(s[5]==='roof'){var b=mesh(boxGeo(w,top-bot-.3,6.8,4.2),A.rock,false);/* sem sombra: o chão embaixo fica claro */b.position.set(cx,(top+bot+.3)/2,-1.6);add(b);
    var lip=mesh(boxGeo(w+.14,.34,6.94,2.2),A.crust);lip.position.set(cx,bot+.17,-1.6);add(lip)}
  else{var vb=bot;var body=mesh(boxGeo(w,top-.3-vb,6.8,4.2),A.rock);body.position.set(cx,(top-.3+vb)/2,-1.6);add(body);
    var lp=mesh(boxGeo(w+.14,.34,6.94,2.2),m3.top);lp.position.set(cx,top-.17,-1.6);add(lp)}
  solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,slip:false,roof:s[5]==='roof'})}
/* arco de pedra do final: a passarela reta fica na frente (é onde o Kuro anda por baixo); atrás dela sobe um arco curvo
   de verdade, com as pernas entrando no abismo, e pedrinhas de luz dourada pela curva de dentro (a luz da Semente) */
function cnArch(x0,x1,bot,top){var A=cnMats(),cx=(x0+x1)/2,hw=(x1-x0)/2+1,lw=4.2,yb=bot-20,yt=top+1.6,sh=new T.Shape();
  sh.moveTo(cx-hw-lw,yb);sh.lineTo(cx-hw-lw,yt-1);sh.quadraticCurveTo(cx-hw-lw,yt,cx-hw-lw+1,yt);sh.lineTo(cx+hw+lw-1,yt);sh.quadraticCurveTo(cx+hw+lw,yt,cx+hw+lw,yt-1);
  sh.lineTo(cx+hw+lw,yb);sh.lineTo(cx+hw,yb);sh.absellipse(cx,yb,hw,bot-yb,0,Math.PI,false);sh.lineTo(cx-hw-lw,yb);
  var g=new T.ExtrudeGeometry(sh,{depth:4.4,bevelEnabled:true,bevelThickness:.25,bevelSize:.3,bevelSegments:2,curveSegments:28}),uv=g.attributes.uv;
  for(var i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/9,uv.getY(i)/9);
  var m=mesh(g,cnM.archM);m.position.z=-6.3;add(m);
  var dots=[],r=rnd(371);for(var k=1;k<16;k++){var a=Math.PI*k/16,px=cx+Math.cos(a)*(hw-.15),py=yb+Math.sin(a)*(bot-yb-.15);if(py<bot-12)continue;
    dots.push({g:xf(new T.IcosahedronGeometry(.12+r()*.08,0),[px,py,-1.55])})}
  if(dots.length){var dm=new T.Mesh(mergeG(dots),cnM.glowM);add(dm)}}
/* ---- cenário: paredão do fundo em camadas, mesas lá longe, pedras flutuando no céu, cactos ---- */
function cnScenery(){var A=cnMats(),C=LV.canyon,r=rnd(2020),list=[],x,k;
  var x0=-30,x1=(LV.camMax||150)+40;
  /* paredão do fundo: colunas de rocha de alturas diferentes (deixam o céu aparecer entre elas) */
  for(x=x0;x<x1;x+=8+r()*8){var h=10+r()*14,wd=4+r()*4,z=-26-r()*8;/* longe do caminho (antes ficava perto e parecia estar no caminho) */
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
function cnArrowMesh(up,x,y){var A=cnMats(),g=new T.Group(),pv=new T.Group(),sh=new T.Shape();
  sh.moveTo(0,.5);sh.lineTo(.42,.02);sh.lineTo(.16,.02);sh.lineTo(.16,-.48);sh.lineTo(-.16,-.48);sh.lineTo(-.16,.02);sh.lineTo(-.42,.02);sh.lineTo(0,.5);
  var ar=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.08,bevelEnabled:false}),up?A.upM:A.dnM);ar.position.z=.2;pv.add(ar);
  /* placa de pedra: apoiada no chão, pendurada no teto ou (se não tem nenhum perto) uma pedra solta no ar */
  var lo=y-.8,hi=y+.8,dn=null,upS=null;LV.solids.forEach(function(q){var s={l:q[0],r:q[1],t:q[2],b:q[3]!==undefined?q[3]:-14};if(x<s.l+.3||x>s.r-.3)return;if(s.t<=y&&y-s.t<1.6&&(!dn||s.t>dn.t))dn=s;if(s.b>=y&&s.b-y<1.6&&(!upS||s.b<upS.b))upS=s});
  if(dn)lo=dn.t-.1;else if(upS)hi=upS.b+.1;
  var tb=mesh(boxGeo(1.25,hi-lo,.36,3),A.tabM);tb.position.set(0,(lo+hi)/2-y,0);g.add(tb);
  var cap=mesh(boxGeo(1.45,.18,.46,2),A.crust);cap.position.set(0,(dn?hi:lo)-y,0);g.add(cap);
  if(!dn&&!upS){var pts=[];[-1,1].forEach(function(sd){pts.push({g:xf(new T.ConeGeometry(.3,.6,5),[0,sd*((hi-lo)/2+.3),0],[sd<0?Math.PI:0,0,0])})});g.add(mesh(mergeG(pts),A.tabM))}
  var bm=new T.Mesh(new T.CylinderGeometry(.42,.18,2.6,12,1,true),up?A.beamU:A.beamD);bm.position.y=2.0;pv.add(bm);/* facho de luz para onde a seta manda */
  var ring=new T.Group();if(!up)pv.rotation.z=Math.PI;g.add(pv);
  return {g:g,pv:pv,ar:ar,bm:bm,ring:ring}}
function cnBuild(th){CN={flip:0,rot:0,A:LV.canyon.A,arrows:[],cd:0,t:0,mir:null,real:null,emit0:null,told:0};cnMats();if(curTheme.canyon)cnScenery();
  (LV.canyon.arrows||[]).forEach(function(a){var v=cnArrowMesh(a[2]==='up',a[0],a[1]);v.g.position.set(a[0],a[1],-.6);add(v.g);
    if(a[3]){v.ring.material=cnM.swM;var r2=new T.Mesh(new T.RingGeometry(.86,.92,28,1,0,Math.PI*1.5),cnM.swM);r2.position.z=.22;v.g.add(r2);v.r2=r2}/* seta que troca sozinha: anel amarelo e um arco que gira */
    CN.arrows.push({x:a[0],y:a[1],up:a[2]==='up',up0:a[2]==='up',per:a[3]||0,off:a[4]||0,go:a[5]||null,v:v,ph:a[0]*.7,fl:0,rz:a[2]==='up'?0:Math.PI})});
  CN.rocks=[];(LV.canyon.rocks||[]).forEach(function(q){var w=q[1]||1.6,h=1.2,so={l:q[0]-w/2,r:q[0]+w/2,t:h,b:0,oneway:false,slip:false,crock:1};solids.push(so);
    CN.rocks.push({x:q[0],w:w,h:h,so:so,m:cnRockMesh(w,h,q[0]),st:'rest',t:0,v:0,cd:0})});
  CN.bld=(LV.canyon.boulders||[]).map(function(b){var m=mesh(ldRough(new T.IcosahedronGeometry(.68,2),.14,2.4),cnM.boulM||(cnM.boulM=pbr(texStone,.92,.7,{color:new T.Color(0x7a3c26)})));m.visible=false;add(m);return {x0:b[0],x1:b[1],per:b[2],off:b[3]||0,t:0,on:0,x:b[0],m:m}});
  /* parte 2: pilões de pedra (sólidos que caem e sobem) e troncos balançando */
  CN.crs=(LV.canyon.crushers||[]).map(function(q){var w=q[1],h=w>5?1.4:1.3,rest=q[2],so={l:q[0]-w/2,r:q[0]+w/2,t:rest+h,b:rest,oneway:false,slip:false,crush:1};solids.push(so);
    return {x:q[0],w:w,h:h,rest:rest,up:q[3],off:q[4]||0,warn:q[5]||.45,so:so,m:cnCrushMesh(q[0],w,h,rest),st:'up',t:0,v:0}});
  CN.logs=(LV.canyon.logs||[]).map(function(q){return {px:q[0],py:q[1],L:q[2],amp:q[3],sp:q[4],ph:q[5]||0,m:cnLogMesh(q[0],q[1],q[2]),a:0,lx:0,ly:0}});
  if(LV.canyon.crushers&&!LV.gen)cnGorge(160,306);
  if(LV.canyon.crushers&&!LV.gen)cnGorge(306,400);
  if(LV.canyon.bridge){var B=LV.canyon.bridge,rpM=M(0xc8a46a,.9),wd=pbr(texWood,.85,.5,{color:new T.Color(0xb88a5a)});/* cordas e postes da ponte (as tábuas são as que caem) */
    [-1,1].forEach(function(sd){var rl=B[1]-B[0],rp=mesh(new T.CylinderGeometry(.035,.035,rl,5),rpM,false,false);rp.rotation.z=Math.PI/2;rp.position.set((B[0]+B[1])/2,B[2]+.85,sd*.85);add(rp);
      [B[0],B[1]].forEach(function(px){var po=mesh(new T.CylinderGeometry(.07,.08,1.1,6),wd);po.position.set(px,B[2]+.45,sd*.85);add(po)})})}
  if(LV.canyon.seed)cnSeedBuild(LV.canyon.seed);
  cnReset()}
/* a Semente de Luz, pendurada embaixo do arco: tocar nela termina a fase (luz sobe pelo arco) */
function cnSeedBuild(S){var g=new T.Group(),A=cnMats();
  var core=new T.Mesh(new T.IcosahedronGeometry(.32,1),new T.MeshStandardMaterial({color:0xffb820,emissive:0xff9a10,emissiveIntensity:1.1,roughness:.3}));core.scale.set(.8,1.25,.8);g.add(core);
  var stem=mesh(new T.CylinderGeometry(.03,.05,.7,6),A.crust,false,false);stem.position.y=.55;g.add(stem);
  var halo=new T.Mesh(new T.RingGeometry(.45,.62,32),new T.MeshBasicMaterial({color:0xffe080,transparent:true,opacity:.5,depthWrite:false,side:T.DoubleSide}));g.add(halo);
  var lt=new T.PointLight(0xffd070,1.6,9,1.6);g.add(lt);
  g.position.set(S[0],S[1],0);add(g);CN.seed={x:S[0],y:S[1],g:g,core:core,halo:halo,lt:lt,got:0,t:0}}
function cnSeedUpd(dt){var s=CN.seed;if(!s)return;
  if(!s.got&&state==='play'&&Math.abs(P.x-s.x)<.9&&s.y>P.y-.5&&s.y<P.y+P.h+.5){s.got=1;s.t=0;sfxMagic();emit(sparkPool,s.x,s.y,30,4,.9,.4,.2,0);toast('A Semente de Luz!');P.vx=0}
  if(s.got){s.t+=dt;P.vx=0;keys.right=keys.left=false;if(s.t>1.6&&state==='play'){s.got=2;winLevel()}}}
/* pedra que cai para cima: pedra vermelha com rachaduras azuis brilhando (a mesma cor da seta que leva para o teto) */
function cnRockMesh(w,h,seed){var A=cnMats(),g=new T.Group(),r=rnd(seed*7|0);
  var b=mesh(new T.DodecahedronGeometry(.5,1),A.rockC);b.scale.set(w*.98,h*.95,1.3);g.add(b);
  for(var i=0;i<5;i++){var c=new T.Mesh(new T.BoxGeometry(.05,.3+r()*.4,.04),A.upM);c.position.set((r()-.5)*w*.7,(r()-.5)*h*.5,.62);c.rotation.z=(r()-.5)*1.4;g.add(c)}
  g.position.set(seed,h/2,0);add(g);return g}
function cnReset(){if(!CN)return;(CN.crs||[]).forEach(function(c){c.st='up';c.t=-c.off;c.v=0;c.so.b=c.rest;c.so.t=c.rest+c.h});(CN.bld||[]).forEach(function(b){b.t=-b.off;b.on=0;b.m.visible=false});CN.flip=0;CN.rot=0;CN.cd=0;CN.t=0;if(CN.seed&&CN.seed.got<2){CN.seed.got=0;CN.seed.t=0}
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
  cnRocks(dt);cnBoulders(dt);cnCrush(dt);cnLogs(dt);cnSeedUpd(dt);
  if(state==='play'&&CN.cd<=0){for(var i=0;i<CN.arrows.length;i++){var a=CN.arrows[i];
    if(a.up!==!!CN.flip&&Math.abs(P.x-a.x)<.75&&P.y<a.y+.75&&P.y+P.h>a.y-.75){a.fl=1;cnSetFlip(a.up?1:0,a.x,a.y);break}}}
  /* caiu para o céu por um buraco do teto */
  if(CN.flip&&state==='play'&&P.y>CN.A*2+9){fallDeath('O Kuro caiu para o céu! Voltando ao último checkpoint.')}
  if(CN.lastTm===tm)return;CN.lastTm=tm;/* daqui para baixo é só visual */
  CN.arrows.forEach(function(a){var on=a.up!==!!CN.flip;a.v.ar.material=a.up?cnM.upM:cnM.dnM;a.v.bm.material=a.up?cnM.beamU:cnM.beamD;a.v.bm.visible=on;
    a.rz+=((a.up?0:Math.PI)-a.rz)*.3;a.v.pv.rotation.z=a.rz;if(a.v.r2){a.v.r2.rotation.z=-CN.t*3;a.v.r2.visible=!a.warn||Math.floor(CN.t*10)%2===0}
    a.v.pv.scale.setScalar((on?1:.75)+a.fl*.35);a.fl=Math.max(0,a.fl-.05);a.v.ar.position.y=Math.sin(CN.t*3+a.ph)*.06;a.v.bm.scale.y=1+Math.sin(CN.t*4+a.ph)*.12});
  if(CN.seed){var sd=CN.seed,gl=sd.got?1+sd.t*2:1;sd.g.position.y=sd.y+Math.sin(CN.t*2)*.06;sd.core.rotation.y=CN.t*1.5;sd.halo.scale.setScalar(gl+Math.sin(CN.t*3)*.08);sd.halo.material.opacity=sd.got?Math.max(0,.6-sd.t*.3):.5;sd.lt.intensity=1.6*gl}
  (CN.rocks||[]).forEach(function(k){var sk=k.st==='warn'?Math.sin(CN.t*70)*.06:0;k.m.position.set(k.x+sk,(k.so.b+k.so.t)/2,0);k.m.rotation.z=k.st==='stuck'||k.st==='back'?Math.PI:0});
  cnM.upM.emissiveIntensity=.38+Math.sin(CN.t*4)*.12;cnM.dnM.emissiveIntensity=.38+Math.sin(CN.t*4+1.5)*.12;
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
/* Cânion do Sol: pedras que rolam ladeira abaixo (de x0 até x1, para a esquerda, contra o Kuro). Saem de uma fenda do paredão,
   rolam e se despedaçam no fim; voltam a cada 'per' segundos. Pular por cima (1,4 de altura). */
function cnBoulders(dt){(CN.bld||[]).forEach(function(b){var R=.68;
  if(!b.on){b.t+=dt;if(b.t>=b.per){b.t=0;b.on=1;b.x=b.x0;b.z=-2.6;b.m.visible=true;if(Math.abs(P.x-b.x0)<26)beep(55,.5,'sawtooth',.03,-20)}return}
  b.z=Math.min(0,b.z+dt*7);if(b.z>=0)b.x-=dt*5.4;b.m.position.set(b.x,R+Math.abs(Math.sin(b.x*2.1))*.04,b.z);b.m.rotation.z+=dt*5.4/R;
  if(Math.abs(P.x-b.x)<26&&Math.random()<dt*8)emit(dustPool,b.x+.4,.1,2,1.4,.4,.4,1.1,-.1);
  if(b.z>-.4&&state==='play'&&Math.abs(P.x-b.x)<R*.85+P.w/2&&P.y<R*1.8&&P.y+P.h>.05)hurt(b.x,1);
  if(b.x<=b.x1){b.on=0;b.m.visible=false;emit(dustPool,b.x,.4,14,3,.7,.7,1.3,-.2);if(Math.abs(P.x-b.x)<20){beep(80,.25,'square',.04,-40);shake=Math.max(shake,.12)}}})}
/* pilão de pedra: bloco de rocha pendurado em correntes. Parado em cima → treme e solta poeira (aviso) → cai rápido e esmaga
   → fica no chão um pouco → sobe devagar. É sólido: dá para subir nele (sobe junto, devagar). Quem fica embaixo leva dano e é
   empurrado para fora (nunca fica preso). Os largos (teto que desce) caem mais devagar e avisam mais cedo. */
function cnCrushMesh(x,w,h,rest){var A=cnMats(),g=new T.Group(),wide=w>5;
  var b=mesh(ldRough(new T.BoxGeometry(w,h,wide?3.4:2.2,Math.max(2,w*2|0),3,4),.06,3),cnM.boulM||(cnM.boulM=pbr(texStone,.92,.7,{color:new T.Color(0x7a3c26)})));b.position.y=h/2;g.add(b);
  var cr=mesh(boxGeo(w+.08,.18,wide?3.5:2.3,2),A.crust);cr.position.y=.09;g.add(cr);
  var ir=M(0x3a3438,.5,.6);[-1,1].forEach(function(sd){var ch=mesh(new T.CylinderGeometry(.05,.05,14,5),ir,false,false);ch.position.set(sd*(w/2-.3),h+7,0);g.add(ch)});
  if(wide)for(var i=0;i<Math.floor(w/1.4);i++){var sp=mesh(new T.ConeGeometry(.16,.4,5),A.rockC,false,false);sp.rotation.x=Math.PI;sp.position.set(-w/2+.7+i*1.4,-.15,0);g.add(sp)}
  g.position.set(x,rest,0);add(g);return g}
function cnCrush(dt){(CN.crs||[]).forEach(function(c){var so=c.so,dy=0,fl=0;
  for(var i=0;i<solids.length;i++){var q=solids[i];if(q===so||q.crush||q.dead||q.crumble)continue;if(c.x>=q.l&&c.x<=q.r&&q.t<=c.rest+.01&&q.t>fl-1e-4)fl=q.t}/* chão embaixo do pilão */
  if(c.st==='up'){c.t+=dt;if(c.t>=c.up){c.st='warn';c.t=c.warn;if(Math.abs(P.x-c.x)<16)beep(90,.3,'sawtooth',.025,-30)}}
  else if(c.st==='warn'){c.t-=dt;if(Math.random()<dt*14)emit(dustPool,c.x+(Math.random()-.5)*c.w,so.b,1,.6,.5,.5,1.2,.6);if(c.t<=0){c.st='fall';c.v=0}}
  else if(c.st==='fall'){c.v=Math.min(c.w>5?10:24,c.v+(c.w>5?30:70)*dt);dy=-c.v*dt;if(so.b+dy<=fl){dy=fl-so.b;c.st='down';c.t=c.w>5?1.1:.7;emit(dustPool,c.x,fl+.1,c.w>5?20:10,3,.7,.7,1.3,-.2);if(Math.abs(P.x-c.x)<14){beep(55,.35,'square',.05,-25);shake=Math.max(shake,.3)}}}
  else if(c.st==='down'){c.t-=dt;if(c.t<=0)c.st='rise'}
  else if(c.st==='rise'){dy=Math.min(2.2*dt,c.rest-so.b);if(so.b+dy>=c.rest-1e-4){dy=c.rest-so.b;c.st='up';c.t=0}}
  if(dy){var carry=P.onPlat===so&&P.grounded&&dy>0;so.b+=dy;so.t+=dy;if(carry)P.y=so.t}
  c.m.position.set(c.x+(c.st==='warn'?Math.sin(CN.t*80)*.04:0),so.b,0);
  if(state!=='play')return;
  if(P.x+P.w/2>so.l+.05&&P.x-P.w/2<so.r-.05&&P.y<so.b-.02&&P.y+P.h>so.b+.02&&P.y<so.t){/* embaixo do pilão que desce: dano e empurra para fora */
    hurt(c.x,1);var gl=so.l-P.w/2-.08,gr=so.r+P.w/2+.08;P.x=(P.x<c.x)?gl:gr;P.vx=0;P.onPlat=null}})}
/* tronco balançando em duas cordas, preso numa viga entre as paredes do cânion */
function cnLogMesh(px,py,L){var A=cnMats(),g=new T.Group(),wd=pbr(texWood,.85,.5,{color:new T.Color(0xc89a70)});
  var beam=mesh(new T.CylinderGeometry(.2,.2,9,8),wd);beam.rotation.x=Math.PI/2;beam.position.set(px,py+.2,-2.6);add(beam);
  var arm=new T.Group();arm.position.set(px,py,0);add(arm);
  var lg=mesh(new T.CylinderGeometry(.38,.38,2.6,12),wd);lg.rotation.x=Math.PI/2;lg.position.y=-L;arm.add(lg);
  var rpM=M(0xc8a46a,.9);[-1,1].forEach(function(sd){var rp=mesh(new T.CylinderGeometry(.035,.035,L,5),rpM,false,false);rp.position.set(0,-L/2,sd*.9);arm.add(rp)});
  return arm}
function cnLogs(dt){(CN.logs||[]).forEach(function(l){var a=l.amp*Math.sin(CN.t*l.sp+l.ph),av=l.amp*l.sp*Math.cos(CN.t*l.sp+l.ph);l.m.rotation.z=a;
  l.lx=l.px+Math.sin(a)*l.L;l.ly=l.py-Math.cos(a)*l.L;
  if(state!=='play')return;var cx=clamp(l.lx,P.x-P.w/2,P.x+P.w/2),cy=clamp(l.ly,P.y,P.y+P.h);
  if(Math.hypot(cx-l.lx,cy-l.ly)<.42){var vx=Math.cos(a)*av*l.L;hurt(l.lx,1);P.vx=clamp(vx,-9,9)}})}
/* garganta: paredões altos bem perto, atrás do caminho (dá a sensação de corredor apertado) */
function cnGorge(x0,x1){var A=cnMats(),L=[],r=rnd(x0|0);for(var x=x0;x<x1;x+=3+r()*3){var h=12+r()*6,w=3.4+r()*2;L.push({g:xf(new T.BoxGeometry(w,h,2.4,2,4,1),[x,h/2-2,-6.2-r()*.8],[0,(r()-.5)*.3,0])})}
  var m=new T.Mesh(mergeG(L),A.wallM);add(m)}
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
