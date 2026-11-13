/* ===== Identidade ninja (proposta 12/11, para o jogo deixar de parecer o Mario) =====
   Aprovado e ligado no jogo oficial em 13/11 (window.NINJA=0 desliga). Peças:
   lanterna de papel (no lugar do bloco "?"), onigiri (no lugar do cogumelo), pergaminho de fogo (no lugar da flor),
   asa ninja (no lugar da pena/capa), portal de bambu (no lugar do cano), portão torii com sino (no lugar da bandeira),
   moeda com furo quadrado (no lugar da moeda redonda). */
var NJ=window.NINJA!==0;/* aprovado pelo dono (13/11): ligado no jogo oficial; window.NINJA=0 volta o visual antigo */
function njLanternTex(empty,green){/* face do bloco: papel de arroz com treliça de madeira e um shuriken vermelho no meio */
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');
  var g=x.createRadialGradient(64,64,10,64,64,90);g.addColorStop(0,empty?'#b8a98a':(green?'#e8ffd8':'#fff6d8'));g.addColorStop(1,empty?'#7d6f58':(green?'#6ec85a':'#f2c46a'));x.fillStyle=g;x.fillRect(0,0,128,128);
  x.strokeStyle=empty?'#3a2a1c':'#5a3418';x.lineWidth=10;x.strokeRect(5,5,118,118);/* moldura de madeira */
  x.lineWidth=3;[44,84].forEach(function(p){x.beginPath();x.moveTo(p,10);x.lineTo(p,118);x.stroke();x.beginPath();x.moveTo(10,p);x.lineTo(118,p);x.stroke()});/* treliça do shoji */
  if(!empty){x.save();x.translate(64,64);x.rotate(.3);x.fillStyle='#c8281e';
    for(var i=0;i<4;i++){x.rotate(Math.PI/2);x.beginPath();x.moveTo(0,-6);x.lineTo(30,-2);x.lineTo(8,8);x.closePath();x.fill()}/* shuriken */
    x.fillStyle='#fff6d8';x.beginPath();x.arc(0,0,5,0,6.283);x.fill();x.restore()}
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;return t}
function njLanternBlock(empty){/* cubo do mesmo tamanho do bloco (1×1), com cantos de madeira e brilho por dentro */
  var g=new T.Group(),tx=njLanternTex(empty);
  var body=mesh(new T.BoxGeometry(1,1,1.15),new T.MeshStandardMaterial({map:tx,emissive:empty?0x000000:0xffa040,emissiveMap:tx,emissiveIntensity:empty?0:.55,roughness:.7}));g.add(body);
  var wd=new T.MeshStandardMaterial({color:0x4a2a14,roughness:.8});
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){var p=mesh(new T.BoxGeometry(.1,1.06,.1),wd);p.position.set(q[0]*.5,0,q[1]*.575);g.add(p)});
  [-1,1].forEach(function(s){var b=mesh(new T.BoxGeometry(1.08,.09,1.23),wd);b.position.y=s*.52;g.add(b)});
  return g}
function njOnigiri(){/* bolinho de arroz: triângulo redondinho branco com a faixa de alga (nori) embaixo */
  var g=new T.Group(),sh=new T.Shape(),R=.42;
  for(var i=0;i<=60;i++){var a=i/60*6.283,k=1+.13*Math.cos(3*(a-Math.PI/2));sh[i?'lineTo':'moveTo'](Math.cos(a)*R*k,Math.sin(a)*R*k*.95+.02)}
  var rice=new T.ExtrudeGeometry(sh,{depth:.3,bevelEnabled:true,bevelThickness:.1,bevelSize:.08,bevelSegments:4,curveSegments:24});rice.translate(0,0,-.15);
  g.add(mesh(rice,new T.MeshStandardMaterial({color:0xfbfaf2,roughness:.85,emissive:0x302a20,emissiveIntensity:.2})));
  var nori=mesh(new T.BoxGeometry(.36,.44,.64),new T.MeshStandardMaterial({color:0x1d2a1a,roughness:.6}));nori.position.y=-.24;g.add(nori);
  [-.08,.02,.12].forEach(function(px,i){var gr=mesh(new T.SphereGeometry(.035,6,4),new T.MeshStandardMaterial({color:0xffffff,roughness:.6}));gr.position.set(px,.15-i*.06,.27);g.add(gr)});/* grãos */
  g.position.y=.5;var o=new T.Group();o.add(g);return o}
function njScroll(){/* pergaminho de fogo: rolo de papel aberto com a chama desenhada, pontas de madeira vermelha */
  var g=new T.Group(),c=document.createElement('canvas');c.width=128;c.height=192;var x=c.getContext('2d');
  x.fillStyle='#f4e6c4';x.fillRect(0,0,128,192);x.strokeStyle='#b08850';x.lineWidth=4;x.strokeRect(8,6,112,180);
  var fg=x.createLinearGradient(0,40,0,160);fg.addColorStop(0,'#ffd23a');fg.addColorStop(1,'#e8380e');x.fillStyle=fg;
  x.beginPath();x.moveTo(64,34);x.bezierCurveTo(100,80,96,120,64,158);x.bezierCurveTo(32,120,28,80,64,34);x.fill();
  x.fillStyle='#fff3b0';x.beginPath();x.moveTo(64,88);x.bezierCurveTo(80,110,76,130,64,148);x.bezierCurveTo(52,130,48,110,64,88);x.fill();
  var tx=new T.CanvasTexture(c);tx.encoding=T.sRGBEncoding;
  var pg=new T.PlaneGeometry(.62,.9,6,1),ps=pg.attributes.position;for(var i=0;i<ps.count;i++)ps.setZ(i,Math.sin((ps.getX(i)/.62+.5)*Math.PI)*.04);pg.computeVertexNormals();
  var paper=mesh(pg,new T.MeshStandardMaterial({map:tx,side:T.DoubleSide,roughness:.8,emissive:0xff6a1f,emissiveMap:tx,emissiveIntensity:.35}),false,false);g.add(paper);
  var rm=new T.MeshStandardMaterial({color:0xf0dcb0,roughness:.8}),wm=new T.MeshStandardMaterial({color:0x9a1e14,roughness:.4,metalness:.2});
  [-1,1].forEach(function(s){var r=mesh(new T.CylinderGeometry(.07,.07,.72,14),rm);r.rotation.z=Math.PI/2;r.position.y=s*.47;g.add(r);
    [-1,1].forEach(function(e){var cp=mesh(new T.CylinderGeometry(.085,.085,.06,12),wm);cp.rotation.z=Math.PI/2;cp.position.set(e*.38,s*.47,0);g.add(cp)})});
  var o=new T.Group();g.position.y=.6;o.add(g);return o}
function njWings(){/* asa ninja: duas asas de pano escuro esticadas em varetas de bambu, com faixa vermelha, presas num nó no meio */
  var g=new T.Group(),cl=new T.MeshStandardMaterial({color:0x2a2440,roughness:.7,side:T.DoubleSide}),rd=new T.MeshStandardMaterial({color:0xc8281e,roughness:.5,side:T.DoubleSide}),bm=new T.MeshStandardMaterial({color:0xc8a860,roughness:.6});
  [-1,1].forEach(function(s){var w=new T.Shape();w.moveTo(0,0);w.quadraticCurveTo(s*.5,.55,s*1.05,.42);w.lineTo(s*.92,.18);w.lineTo(s*.8,.26);w.lineTo(s*.66,.02);w.lineTo(s*.52,.12);w.lineTo(s*.36,-.12);w.quadraticCurveTo(s*.15,-.05,0,0);
    var wg=new T.ShapeGeometry(w,16);g.add(mesh(wg,cl,false,false));
    var tr=new T.Shape();tr.moveTo(s*.06,.06);tr.quadraticCurveTo(s*.5,.5,s*1.0,.38);tr.lineTo(s*.98,.32);tr.quadraticCurveTo(s*.5,.42,s*.06,0);
    var tm2=mesh(new T.ShapeGeometry(tr,12),rd,false,false);tm2.position.z=.01;g.add(tm2);
    var rib=mesh(new T.CylinderGeometry(.018,.018,1.1,6),bm);rib.rotation.z=s*-1.2;rib.position.set(s*.5,.27,.02);g.add(rib)});
  var knot=mesh(new T.SphereGeometry(.09,10,8),rd);knot.position.z=.03;g.add(knot);
  var o=new T.Group();g.position.y=.55;o.add(g);return o}
function njBamboo(h){/* portal de bambu (no lugar do cano): três gomos grossos, corte em diagonal no alto, nós salientes e folhinhas — nada de borda larga de cano */
  var g=new T.Group(),bm=new T.MeshStandardMaterial({color:0x7ab846,roughness:.5}),nm=new T.MeshStandardMaterial({color:0x557f2a,roughness:.6}),cut=new T.MeshStandardMaterial({color:0xe8dca0,roughness:.7}),lf=new T.MeshStandardMaterial({color:0x3f9a2e,roughness:.6,side:T.DoubleSide});
  var body=mesh(new T.CylinderGeometry(.66,.7,h,24),bm);body.position.y=h/2;g.add(body);
  for(var y=.55;y<h-.2;y+=.75){var n=mesh(new T.TorusGeometry(.69,.06,6,24),nm);n.rotation.x=Math.PI/2;n.position.y=y;g.add(n)}
  var lip=mesh(new T.TorusGeometry(.62,.07,8,24),cut);lip.rotation.x=Math.PI/2;lip.position.y=h;g.add(lip);/* a madeira clara do corte */
  var hole=mesh(new T.CircleGeometry(.58,24),new T.MeshBasicMaterial({color:0x14180c}));hole.rotation.x=-Math.PI/2;hole.position.y=h+.01;g.add(hole);
  [[-1,.4],[1,.9]].forEach(function(q){var br=new T.Group();for(var i=0;i<3;i++){var l=mesh(new T.PlaneGeometry(.5,.12),lf,false,false);l.position.set(q[0]*(.25+i*.06),i*.08,0);l.rotation.z=q[0]*(.4+i*.25);br.add(l)}
    br.position.set(q[0]*.7,h*q[1],.1);g.add(br)});
  var rope=mesh(new T.TorusGeometry(.72,.05,6,24),new T.MeshStandardMaterial({color:0xc8281e,roughness:.6}));rope.rotation.x=Math.PI/2;rope.position.y=h-.35;g.add(rope);
  return g}
function njTorii(){/* portão torii vermelho com um sino pendurado (no lugar da bandeira do fim) */
  var g=new T.Group(),red=new T.MeshStandardMaterial({color:0xd2281c,roughness:.45}),blk=new T.MeshStandardMaterial({color:0x221a18,roughness:.6}),gold=new T.MeshStandardMaterial({color:0xffc43a,roughness:.25,metalness:.85,emissive:0x6a4300,emissiveIntensity:.5});
  [-1,1].forEach(function(s){var p=mesh(new T.CylinderGeometry(.16,.2,4.6,14),red);p.position.set(s*1.4,2.3,0);g.add(p);var ft=mesh(new T.CylinderGeometry(.24,.24,.3,14),blk);ft.position.set(s*1.4,.15,0);g.add(ft)});
  var nuki=mesh(new T.BoxGeometry(3.6,.22,.24),red);nuki.position.y=3.7;g.add(nuki);
  var kg=new T.BoxGeometry(4.4,.3,.36,12,1,1),kp=kg.attributes.position;for(var i=0;i<kp.count;i++){var xx=kp.getX(i);kp.setY(i,kp.getY(i)+Math.pow(Math.abs(xx)/2.2,2.2)*.35)}kg.computeVertexNormals();
  var kasa=mesh(kg,blk);kasa.position.y=4.75;g.add(kasa);var sh=mesh(new T.BoxGeometry(4.0,.24,.3),red);sh.position.y=4.45;g.add(sh);
  var tab=mesh(new T.BoxGeometry(.5,.6,.1),blk);tab.position.set(0,4.1,.14);g.add(tab);
  var bell=new T.Group(),bp=[];for(var j=0;j<=10;j++){var t=j/10;bp.push(new T.Vector2(.08+.28*Math.pow(t,1.6),-t*.62))}
  bell.add(mesh(new T.LatheGeometry(bp,20),gold));var cl=mesh(new T.SphereGeometry(.07,8,6),gold);cl.position.y=-.62;bell.add(cl);
  var rp=mesh(new T.CylinderGeometry(.02,.02,.5,6),new T.MeshStandardMaterial({color:0xc8281e}));rp.position.y=.25;bell.add(rp);bell.position.y=3.45;g.add(bell);
  return g}
function njMon(){/* moeda japonesa: dourada, com furo quadrado no meio e bordinha */
  var s=new T.Shape();s.absarc(0,0,.3,0,6.283,false);var h=new T.Path();h.moveTo(-.08,-.08);h.lineTo(-.08,.08);h.lineTo(.08,.08);h.lineTo(.08,-.08);h.lineTo(-.08,-.08);s.holes.push(h);
  var gm=new T.ExtrudeGeometry(s,{depth:.05,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:2,curveSegments:28});gm.translate(0,0,-.025);
  return mesh(gm,new T.MeshStandardMaterial({color:0xffcf3a,roughness:.25,metalness:.85,emissive:0x7a5200,emissiveIntensity:.45}),false,false)}
/* ----- ligação com o jogo (só com NJ) ----- */
var njM=null;
function njMats(){if(njM)return njM;var a=njLanternTex(false),b=njLanternTex(false,true),e=njLanternTex(true);
  njM={lan:new T.MeshStandardMaterial({map:a,emissive:0xffa040,emissiveMap:a,emissiveIntensity:.55,roughness:.7}),lanF:new T.MeshStandardMaterial({map:b,emissive:0x60ff60,emissiveMap:b,emissiveIntensity:.4,roughness:.7}),
    lanE:new T.MeshStandardMaterial({map:e,roughness:.85}),wood:new T.MeshStandardMaterial({color:0x4a2a14,roughness:.8})};return njM}
function njFrame(m){/* cantos e faixas de madeira presos no bloco (filhos do mesmo mesh, sobem e descem junto) */
  var W=njMats().wood;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){var p=mesh(new T.BoxGeometry(.1,1.06,.1),W,false,false);p.position.set(q[0]*.5,0,q[1]*.575);m.add(p)});
  [-1,1].forEach(function(s){var b=mesh(new T.BoxGeometry(1.08,.09,1.23),W,false,false);b.position.y=s*.52;m.add(b)})}
var njMonGeo=null;function njMonG(){if(njMonGeo)return njMonGeo;var g=njMon().geometry;njMonGeo=g;return g}
function njRig(){/* a capa do Kuro vira asa ninja: pano escuro com a ponta vermelha */
  if(!NJ||!rig||!rig.cape||!rig.cape.s)return;rig.cape.s.forEach(function(sg,i){sg.children.forEach(function(c){if(c.material){c.material=c.material.clone();c.material.color.set(i===2?0xc8281e:0x2a2440)}})})}
function njCrateTex(){/* caixote de madeira com tábuas, pregos e corda (no lugar do tijolo) */
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d'),r=rnd(31);
  x.fillStyle='#a8743c';x.fillRect(0,0,128,128);
  for(var i=0;i<4;i++){var y=i*32;x.fillStyle=i%2?'#b07c42':'#9c6a34';x.fillRect(0,y,128,32);x.strokeStyle='rgba(60,30,10,.6)';x.lineWidth=2;x.strokeRect(0,y,128,32);
    for(var k=0;k<5;k++){x.strokeStyle='rgba(70,40,15,'+(.15+r()*.2)+')';x.lineWidth=1;x.beginPath();x.moveTo(0,y+4+r()*24);x.bezierCurveTo(40,y+r()*32,80,y+r()*32,128,y+4+r()*24);x.stroke()}}
  x.strokeStyle='#5a3418';x.lineWidth=9;x.strokeRect(4,4,120,120);
  x.beginPath();x.moveTo(8,8);x.lineTo(120,120);x.stroke();/* travessa em diagonal */
  x.fillStyle='#3a3a3a';[[12,12],[116,12],[12,116],[116,116],[64,64]].forEach(function(p){x.beginPath();x.arc(p[0],p[1],3.5,0,6.283);x.fill()});
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;return t}
function njSnake(){/* cobra que sai do bambu (no lugar da planta do cano): corpo listrado, cabeça larga, olhos amarelos, língua vermelha */
  var g=new T.Group(),bm=new T.MeshStandardMaterial({color:0x3e8a3a,roughness:.5}),bl=new T.MeshStandardMaterial({color:0xd8c050,roughness:.5});
  var pts=[];for(var i=0;i<=10;i++){var t=i/10;pts.push(new T.Vector3(Math.sin(t*5)*.18*(1-t),-2.2+t*2.2,Math.cos(t*4)*.08))}
  var body=mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.2,10,false),bm);g.add(body);
  for(var j=0;j<6;j++){var p=pts[2+j],rg=mesh(new T.TorusGeometry(.205,.03,6,14),new T.MeshStandardMaterial({color:0x234a20,roughness:.6}));rg.position.copy(p);rg.rotation.x=Math.PI/2;g.add(rg)}
  var head=new T.Group();head.position.y=.12;g.add(head);
  var hd=mesh(new T.SphereGeometry(.3,16,12),bm);hd.scale.set(1.25,.75,1.3);head.add(hd);
  var jaw=mesh(new T.SphereGeometry(.24,12,8),bl);jaw.scale.set(1.1,.45,1.2);jaw.position.set(0,-.12,.06);head.add(jaw);
  [-1,1].forEach(function(s){var e=mesh(new T.SphereGeometry(.075,10,8),new T.MeshStandardMaterial({color:0x221100,emissive:0xffd23a,emissiveIntensity:1.3}),false,false);e.position.set(s*.17,.1,.27);head.add(e);
    var f=mesh(new T.ConeGeometry(.03,.12,5),new T.MeshStandardMaterial({color:0xfff6e0}));f.rotation.x=Math.PI;f.position.set(s*.09,-.14,.33);head.add(f)});
  var tg=mesh(new T.BoxGeometry(.04,.015,.3),new T.MeshStandardMaterial({color:0xe02a2a}));tg.position.set(0,-.08,.48);head.add(tg);
  return g}
var njStarGeo=null;
function njStarMesh(mat){/* shuriken de fogo (no lugar da bola de fogo) */
  if(!njStarGeo){var s=new T.Shape();for(var i=0;i<8;i++){var a=i/8*6.283,r=i%2?.08:.24;s[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r)}
    var h=new T.Path();h.absarc(0,0,.035,0,6.283,true);s.holes.push(h);
    njStarGeo=new T.ExtrudeGeometry(s,{depth:.03,bevelEnabled:true,bevelThickness:.01,bevelSize:.01,bevelSegments:1});njStarGeo.translate(0,0,-.015)}
  return mesh(njStarGeo,mat,false,false)}
if(NJ)brickM.map=njCrateTex();
njRig();
