/*@@parte:65_carregando.js*/
/* ===================== Tela de carregamento (pedido do dono, 05/11) =====================
   Cena 3D pequena enquanto o jogo se monta: o Kuro agachado na beira de um penhasco com a raposinha, olhando o Cume
   (estrela na ponta), ilhas flutuantes com cachoeiras e castelinhos, ponte de corda, nuvens. Textos e barra ficam no HTML (#ld).
   O jogo se monta em etapas (ldBoot) e a cena anda entre elas; no fim os dois pulam e a tela abre para o mapa.
   Leve: cenário parado em 1 malha só (cores por vértice), sem sombras. Nos testes (window.__noLoad) monta direto. */
var LD=null;
var LD_TIPS=['Pule em cima dos inimigos para derrotá-los','Toque duas vezes na seta e segure para correr','Saia de um bloco com a raposinha e monte nela para ir mais rápido',
  'Com a capa, corra até o medidor encher e pule para voar','A flor deixa o Kuro atirar: botão J ou X','As bandeirinhas guardam o caminho: se cair, volta nelas',
  'Procure os 3 cristais escondidos de cada fase','No Cânion Invertido, as setas viram a gravidade','Com a raposinha, o pulo giratório (K) derrota de uma vez'];
function ldSkyTex(){var c=document.createElement('canvas');c.width=4;c.height=256;var x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);
  g.addColorStop(0,'#1d63d8');g.addColorStop(.45,'#4f9cf0');g.addColorStop(.72,'#a8d6ff');g.addColorStop(.88,'#ffe9c4');g.addColorStop(1,'#fff6e2');x.fillStyle=g;x.fillRect(0,0,4,256);
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t}
function ldGlowTex(r,g,b){var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d'),gr=x.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,'rgba('+r+','+g+','+b+',1)');gr.addColorStop(.25,'rgba('+r+','+g+','+b+',.55)');gr.addColorStop(1,'rgba('+r+','+g+','+b+',0)');x.fillStyle=gr;x.fillRect(0,0,128,128);return new T.CanvasTexture(c)}
function ldFallTex(){var c=document.createElement('canvas');c.width=64;c.height=128;var x=c.getContext('2d'),r=rnd(77);x.fillStyle='rgba(220,240,255,.55)';x.fillRect(0,0,64,128);
  for(var i=0;i<60;i++){x.fillStyle='rgba(255,255,255,'+(.4+r()*.5)+')';x.fillRect(r()*64,r()*128,1+r()*3,10+r()*30)}var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t}
/* cenário parado: tudo numa malha só, cada peça com sua cor */
/* ruído simples por posição (mesma posição = mesmo valor: a malha não abre fendas) */
function ldN(x,y,z){return Math.sin(x*1.7+z*.9)*Math.sin(y*2.3+x*.6)*.5+Math.sin(x*4.1+y*3.7+z*2.9)*.3+Math.sin(z*5.3-x*4.7)*.2}
/* deixa a pedra irregular: empurra cada ponto para fora/dentro conforme o ruído */
function ldRough(g,amt,fq){g=g.index?g:g;var p=g.attributes.position,v=new T.Vector3();for(var i=0;i<p.count;i++){v.fromBufferAttribute(p,i);var l=v.length()||1,n=ldN(v.x*fq,v.y*fq,v.z*fq);v.multiplyScalar(1+n*amt/l);p.setXYZ(i,v.x,v.y,v.z)}g.computeVertexNormals();return g}
/* montanha com encostas, sulcos e neve que desce pelas ranhuras (cores por ponto) */
function ldMountain(sc,R,H,x,y,z,ry,mat){var g=new T.ConeGeometry(R,H,44,22),p=g.attributes.position,v=new T.Vector3(),col=new Float32Array(p.count*3),c=new T.Color(),rk=new T.Color(0x5e5468),rk2=new T.Color(0x84766e),sn=new T.Color(0xf6f9ff);
  for(var i=0;i<p.count;i++){v.fromBufferAttribute(p,i);var h=(v.y+H/2)/H,a=Math.atan2(v.z,v.x),rr=Math.hypot(v.x,v.z),rid=Math.abs(Math.sin(a*7+h*3))*.12+ldN(v.x*.25,v.y*.25,v.z*.25)*.1;
    if(rr>.01){var k=1+rid*(1-h*.6);v.x*=k;v.z*=k}v.y+=ldN(v.x*.15,1,v.z*.15)*H*.03*(1-h);p.setXYZ(i,v.x,v.y,v.z);
    var sw=clamp((h-.74+Math.sin(a*7+h*3)*.08+ldN(v.x*.4,v.y*.4,v.z*.4)*.1)/.08,0,1);c.copy(rk).lerp(rk2,clamp(.5+ldN(v.x*.5,v.y*.5,v.z*.5),0,1)).lerp(sn,sw);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b}
  g.setAttribute('color',new T.BufferAttribute(col,3));g.computeVertexNormals();var m=new T.Mesh(g,mat);m.position.set(x,y,z);m.rotation.y=ry;sc.add(m)}
function ldCloudTex(){var c=document.createElement('canvas');c.width=256;c.height=128;var x=c.getContext('2d'),r=rnd(909);
  for(var i=0;i<26;i++){var px=40+r()*176,py=50+r()*40-Math.sin((px-40)/176*Math.PI)*28,rr=18+r()*26,g=x.createRadialGradient(px,py,0,px,py,rr),sh=py>78?.82:1;
    g.addColorStop(0,'rgba('+(255*sh|0)+','+(255*sh|0)+','+(255*sh+3|0)+',.9)');g.addColorStop(.6,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,256,128)}
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t}
function ldScenery(sc){var G={},r=rnd(2611);
  var KEY={},tint=new T.Color();function P(g,c,p,ro,s){var k=KEY[c]||'plain';
    if(k==='rock'&&(g.type==='DodecahedronGeometry'||g.type==='IcosahedronGeometry'))g=ldRough(new T.IcosahedronGeometry(g.parameters.radius,3),g.parameters.radius*.28,1.6/g.parameters.radius);
    else if(k==='rock'&&g.type==='ConeGeometry'){var pr=g.parameters;g=ldRough(new T.ConeGeometry(pr.radius,pr.height,20,10),pr.radius*.16,2.2/pr.radius)}
    else if(k==='leaf'&&g.type==='IcosahedronGeometry')g=ldRough(new T.IcosahedronGeometry(g.parameters.radius,2),g.parameters.radius*.25,3/g.parameters.radius);
    (G[k]=G[k]||[]).push({g:xf(g,p,ro,s),c:c})}
  var ROCK=0xc89878,ROCKD=0xa07a62,GRASS=0x98bf7c,GRASSD=0x7aa862,SNOW=0xf4f8ff,STONE=0xf0e4cc,ROOF=0xc0503a,WOOD=0xd8b090,LEAF=0x8ac070,LEAFD=0x6aa058;
  [ROCK,ROCKD].forEach(function(c){KEY[c]='rock'});[GRASS,GRASSD].forEach(function(c){KEY[c]='grass'});[LEAF,LEAFD].forEach(function(c){KEY[c]='leaf'});
  [WOOD,0xa8703e,0x6a4424,0xc8a070,0xe8d0a0].forEach(function(c){KEY[c]='wood'});[STONE,0xf2e2c0].forEach(function(c){KEY[c]='stone'});
  /* penhasco da frente */
  P(new T.CylinderGeometry(4.2,3.4,1.2,24,2),GRASS,[-1.2,-.62,.2],[0,.3,0],[1.25,1,.8]);
  for(var e2=0;e2<16;e2++){var ea=e2/16*Math.PI*2;P(new T.IcosahedronGeometry(.45+r()*.3,1),GRASSD,[-1.2+Math.cos(ea)*5,-.35,.2+Math.sin(ea)*3.2],[r(),r(),r()],[1.4,.5,1])}/* musgo caindo pela beirada */
  for(var i=0;i<7;i++)P(new T.DodecahedronGeometry(1.5+r()*.6,0),i%2?ROCK:ROCKD,[-4.5+i*1.25,-2.9-r()*1.2,-.2+r()*1.2],[r(),r(),r()],[1,1.2,.9]);
  for(i=0;i<14;i++)P(new T.IcosahedronGeometry(.18+r()*.22,0),GRASSD,[-5+r()*7.4,-.08,-1.4+r()*3],[0,r()*3,0],[1.4,.6,1.4]);/* tufos */
  /* placa de madeira com a montanha e o cogumelo */
  P(new T.BoxGeometry(.16,1.9,.16),WOOD,[-3.1,.75,-.6]);P(new T.BoxGeometry(1.5,.85,.1),0xa8703e,[-3.05,1.45,-.52],[0,.25,-.06]);
  P(new T.ConeGeometry(.36,.42,3),0xe8d0a0,[-3.05,1.43,-.45],[0,.25,0],[1,1,.2]);
  P(new T.CylinderGeometry(.16,.2,.55,8),0xf6ead8,[-3.95,.27,.9]);P(new T.SphereGeometry(.48,12,8,0,Math.PI*2,0,Math.PI/2),0xd8302a,[-3.95,.5,.9],[0,0,0],[1,.75,1]);
  [[0,.82,0],[.28,.68,.15],[-.25,.7,.2],[.1,.66,-.32]].forEach(function(d){P(new T.SphereGeometry(.07,6,4),0xffffff,[-3.95+d[0],.5+d[1]*.42,.9+d[2]])});
  /* folhas na frente, nos cantos */
  for(i=0;i<7;i++){var bs=.22+r()*.2;P(new T.IcosahedronGeometry(bs,1),i%2?LEAF:LEAFD,[i<4?-5.4+i*.55:-2.2+i*.3,bs*.55,-2.2+r()*.5],[r(),r(),r()],[1.3,.85,1])}/* moitas em cima do penhasco */
  /* o Cume: montanha com neve e encostas */
  var mm=pbr(texStone,.9,.6,{vertexColors:true});
  ldMountain(sc,26,62,20,-14,-80,.4,mm);ldMountain(sc,10,18,3,-10,-62,1,mm);ldMountain(sc,11,19,30,-11,-60,.2,mm);
  /* ilhas flutuantes */
  var IS=[[8.5,-1.3,-9,3,1],[14,1.5,-24,4.2,2],[4,5,-34,2.6,0],[-7,4,-28,3,3],[24,4,-30,3.4,2],[-14,1,-22,2.4,3],[20,-2.5,-14,2.2,0]];
  IS.forEach(function(s,k){var x=s[0],y=s[1],z=s[2],R=s[3];
    P(new T.ConeGeometry(R*.95,R*2.2,7,1),k%2?ROCK:ROCKD,[x,y-R*1.1,z],[Math.PI,r()*3,0]);P(new T.CylinderGeometry(R,R*.95,.45,8),GRASS,[x,y-.2,z],[0,r()*3,0]);
    for(var j=0;j<5;j++){var tx=x+(r()-.5)*R*1.5,tz=z+(r()-.5)*R*1.1,th=.8+r()*1.1;P(new T.CylinderGeometry(.07,.11,th*.7,5),WOOD,[tx,y+th*.35,tz]);
      for(var q=0;q<3;q++)P(new T.IcosahedronGeometry(.32+r()*.22,1),q%2?LEAF:LEAFD,[tx+(r()-.5)*.4,y+th*.7+q*.22,tz+(r()-.5)*.4])}
    for(j=0;j<6;j++)P(new T.IcosahedronGeometry(.2+r()*.2,1),LEAFD,[x+(r()-.5)*R*1.8,y+.05,z+(r()-.5)*R*1.4]);/* moitas */
    for(j=0;j<4;j++)P(new T.CylinderGeometry(.05,.02,R*1.6+r()*R,4),0x4a7a3a,[x+(r()-.5)*R*1.4,y-R*.8-r()*R*.6,z+R*.7],[0,0,(r()-.5)*.2]);/* cipós pendurados */
    if(s[4]===2){/* castelinho */var cx=x-.3,cz=z-.4;P(new T.BoxGeometry(1.8,1.1,1.2),STONE,[cx,y+.55,cz]);
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(d){P(new T.CylinderGeometry(.28,.3,1.7,8),STONE,[cx+d[0]*.95,y+.85,cz+d[1]*.6]);P(new T.ConeGeometry(.38,.6,8),ROOF,[cx+d[0]*.95,y+2,cz+d[1]*.6])});
      P(new T.CylinderGeometry(.42,.45,2.4,8),STONE,[cx,y+1.2,cz]);P(new T.ConeGeometry(.55,.9,8),ROOF,[cx,y+2.85,cz]);
      P(new T.CylinderGeometry(.02,.02,.7,3),0x6a4424,[cx,y+3.55,cz]);P(new T.BoxGeometry(.4,.22,.02),ROOF,[cx+.2,y+3.75,cz]);
      for(var wi=0;wi<4;wi++)P(new T.BoxGeometry(.12,.22,.05),0x3a2a20,[cx-.6+wi*.4,y+.7,cz+.62]);
      for(wi=0;wi<6;wi++)P(new T.BoxGeometry(.2,.18,.2),STONE,[cx-.8+wi*.32,y+1.2,cz+.5])}
    if(s[4]===1){P(new T.BoxGeometry(1,.8,.9),0xf2e2c0,[x+.6,y+.4,z-.3]);P(new T.ConeGeometry(.85,.6,4),ROOF,[x+.6,y+1.1,z-.3],[0,Math.PI/4,0])}/* casinha */
  });
  /* ponte de corda do penhasco até a ilha mais perto */
  var a=new T.Vector3(2.6,-.12,-.6),b=new T.Vector3(6.4,-1.1,-7.2),n=16;
  for(i=0;i<=n;i++){var u=i/n,pp=a.clone().lerp(b,u);pp.y-=Math.sin(u*Math.PI)*.55;P(new T.BoxGeometry(.9,.06,.3),WOOD,[pp.x,pp.y,pp.z],[0,-.52,0]);
    if(i%4===0)[-1,1].forEach(function(sd){P(new T.CylinderGeometry(.04,.05,.7,5),0x6a4424,[pp.x+sd*.42*Math.cos(.52),pp.y+.35,pp.z+sd*.42*Math.sin(.52)])})}
  for(i=0;i<n;i++){var u0=i/n,u1=(i+1)/n,p0=a.clone().lerp(b,u0),p1=a.clone().lerp(b,u1);p0.y+=.55-Math.sin(u0*Math.PI)*.45;p1.y+=.55-Math.sin(u1*Math.PI)*.45;
    [-1,1].forEach(function(sd){var ox=sd*.42*Math.cos(.52),oz=sd*.42*Math.sin(.52),q0=new T.Vector3(p0.x+ox,p0.y,p0.z+oz),q1=new T.Vector3(p1.x+ox,p1.y,p1.z+oz),d=q1.clone().sub(q0),g=new T.CylinderGeometry(.018,.018,d.length(),4);
      g.rotateX(Math.PI/2);g.lookAt(d);g.translate((q0.x+q1.x)/2,(q0.y+q1.y)/2,(q0.z+q1.z)/2);(G.wood=G.wood||[]).push({g:g,c:0xc8a070})})}
  var MT={rock:pbr(texStone,.95,1.4,{vertexColors:true}),grass:pbr(texGrass,.95,.8,{vertexColors:true}),leaf:pbr(texGrass,.85,.9,{vertexColors:true}),
    wood:pbr(texWood,.85,.7,{vertexColors:true}),stone:pbr(texBrick,.9,.7,{vertexColors:true}),plain:M(0xffffff,.6,0,{vertexColors:true})};
  Object.keys(G).forEach(function(k){sc.add(new T.Mesh(mergeG(G[k],true),MT[k]))});return IS}
/* detalhes que deixam a cena mais rica: capim no penhasco, folhas grandes na frente, raios de sol, névoa das cachoeiras */
function ldExtra(sc,IS){var r=rnd(77),dummy=new T.Object3D(),i;
  var bg=new T.ConeGeometry(.035,1,3);bg.translate(0,.5,0);var gm=new T.MeshStandardMaterial({color:0x6aa848,roughness:.8,side:T.DoubleSide});var N=LITE?500:1100,gi=new T.InstancedMesh(bg,gm,N),c=new T.Color();
  for(i=0;i<N;i++){var a=r()*Math.PI*2,d=Math.sqrt(r()),gx=-1.2+Math.cos(a)*d*5.1,gz=.2+Math.sin(a)*d*3.3;if(Math.hypot(gx-.2,gz-.4)<.9){i--;continue}
    dummy.position.set(gx,-.03,gz);dummy.rotation.set((r()-.5)*.5,r()*3,(r()-.5)*.5);dummy.scale.set(1,.1+r()*.18,1);dummy.updateMatrix();gi.setMatrixAt(i,dummy.matrix);gi.setColorAt(i,c.setHSL(.24+r()*.06,.5,.28+r()*.2))}
  sc.add(gi);LD.grass=gi;
  /* folhas grandes na frente, nos cantos (mais perto da câmera) */
  var lf=new T.Shape();lf.moveTo(0,0);lf.quadraticCurveTo(.55,.9,0,2.2);lf.quadraticCurveTo(-.55,.9,0,0);var lg=new T.ShapeGeometry(lf,10),lm=new T.MeshStandardMaterial({color:0x3e8a34,roughness:.6,side:T.DoubleSide}),lm2=new T.MeshStandardMaterial({color:0x5aa840,roughness:.6,side:T.DoubleSide});
  LD.leaves=[];[[-4.6,-.4,3.6,-.7],[-4.2,-.2,3.9,-.3],[-3.6,-.5,4.2,-1.1],[4.2,-.6,3.4,.6],[4.8,-.3,3.0,.25],[3.8,-.8,3.9,1]].forEach(function(q,k){var m=new T.Mesh(lg,k%2?lm:lm2);m.position.set(q[0],q[1],q[2]);m.rotation.set(-.3,(r()-.5)*.8,q[3]);m.scale.setScalar(.7+r()*.3);sc.add(m);LD.leaves.push({m:m,rz:q[3],ph:r()*6})});
  /* raios de sol entrando pela esquerda */
  var rc=document.createElement('canvas');rc.width=16;rc.height=128;var rx=rc.getContext('2d'),rgr=rx.createLinearGradient(0,0,0,128);rgr.addColorStop(0,'rgba(255,240,200,.0)');rgr.addColorStop(.3,'rgba(255,236,190,.55)');rgr.addColorStop(1,'rgba(255,236,190,0)');rx.fillStyle=rgr;rx.fillRect(0,0,16,128);
  var rt=new T.CanvasTexture(rc);LD.rays=[];for(i=0;i<5;i++){var rm=new T.Mesh(new T.PlaneGeometry(2+r()*3,40),new T.MeshBasicMaterial({map:rt,transparent:true,opacity:.22,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,fog:false}));
    rm.position.set(-14+i*5,10,-30-r()*10);rm.rotation.z=-.55;sc.add(rm);LD.rays.push(rm)}
  /* névoa no pé das cachoeiras */
  var mt=ldGlowTex(255,255,255);[[0],[1],[3]].forEach(function(q){var s2=IS[q[0]];for(var k=0;k<3;k++){var sp=new T.Sprite(new T.SpriteMaterial({map:mt,transparent:true,opacity:.35,depthWrite:false}));sp.position.set(s2[0]+s2[3]*.55+(k-1)*.6,s2[1]-s2[3]*2.4-.3,s2[2]+s2[3]*.8);sp.scale.setScalar(2.2+k*.4);sc.add(sp)}});
  /* passarinhos voando lá longe */
  LD.birds=[];var bm=new T.MeshBasicMaterial({color:0x2a2a3a,side:T.DoubleSide});for(i=0;i<5;i++){var bgm=new T.BufferGeometry();bgm.setAttribute('position',new T.Float32BufferAttribute([-.5,0,0,0,-.08,0,.5,0,0,0,-.08,0,0,0,.15,0,.04,-.1],3));var bd=new T.Mesh(bgm,bm);bd.position.set(5+i*2.5,9+r()*3,-26-r()*6);sc.add(bd);LD.birds.push({m:bd,ph:r()*6,sp:1+r()*.6,x0:bd.position.x})}}
function ldStart(){var c=renderer.domElement,sc=new T.Scene(),cam=new T.PerspectiveCamera(48,(c.clientWidth||innerWidth)/(c.clientHeight||innerHeight),.1,400);
  LD={sc:sc,cam:cam,t:0,p:0,shown:0,end:-1,tip:0,tipT:0,home:null,last:performance.now(),fogC:new T.Color(0xcfe4f7)};
  sc.background=ldSkyTex();sc.fog=new T.Fog(0xd6e8f8,40,230);
  sc.add(new T.HemisphereLight(0xdcecff,0x7a5a3a,.95));var sun=new T.DirectionalLight(0xfff0d8,2.1);sun.position.set(-8,14,10);sc.add(sun);
  var IS=ldScenery(sc);
  /* cachoeiras (água descendo das ilhas) e névoa embaixo */
  var ft=ldFallTex(),fm=new T.MeshBasicMaterial({map:ft,transparent:true,opacity:.85,depthWrite:false,fog:true});LD.ft=ft;
  [[0,1.7],[1,2.4],[3,1.8]].forEach(function(q){var s=IS[q[0]],h=s[3]*2.4,w=new T.Mesh(new T.PlaneGeometry(q[1]*.8,h),fm);w.position.set(s[0]+s[3]*.55,s[1]-h/2-.1,s[2]+s[3]*.75);sc.add(w)});
  /* mar de nuvens e nuvens que passam */
  var ct=ldCloudTex();LD.clouds=[];/* nuvens macias (imagem com bolhas suaves), não mais bolas de polígono */
  var r=rnd(5150);for(var i=0;i<(LITE?14:22);i++){var low=i<10,cx=-34+r()*76;if(!low&&cx>8&&cx<42)cx-=40;/* nuvens do alto longe do Cume */
    var g=new T.Sprite(new T.SpriteMaterial({map:ct,transparent:true,depthWrite:false,opacity:low?.95:.85,color:low?0xf4f8ff:0xffffff}));
    g.position.set(cx,low?-6-r()*3:8+r()*10,low?-10-r()*34:-30-r()*30);var w=low?16+r()*14:8+r()*8;g.scale.set(w,w*.5,1);sc.add(g);LD.clouds.push({g:g,sp:.25+r()*.4})}
  /* estrela na ponta do Cume */
  var sh=new T.Shape();for(i=0;i<10;i++){var an=Math.PI/2+i*Math.PI/5,rr=i%2?.42:1;if(i)sh.lineTo(Math.cos(an)*rr,Math.sin(an)*rr);else sh.moveTo(Math.cos(an)*rr,Math.sin(an)*rr)}
  var st=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.3,bevelEnabled:true,bevelSize:.12,bevelThickness:.12,bevelSegments:1}),new T.MeshStandardMaterial({color:0xffd23a,emissive:0xffaa00,emissiveIntensity:.9,roughness:.35,metalness:.3}));
  st.position.set(20,19.6,-79);st.scale.setScalar(2.4);sc.add(st);LD.star=st;
  var gl=new T.Sprite(new T.SpriteMaterial({map:ldGlowTex(255,230,140),transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false}));gl.position.copy(st.position);gl.scale.setScalar(11);sc.add(gl);LD.glow=gl;
  var sg=new T.Sprite(new T.SpriteMaterial({map:ldGlowTex(255,240,200),transparent:true,opacity:.8,depthWrite:false,blending:T.AdditiveBlending,fog:false}));sg.position.set(-40,26,-90);sg.scale.setScalar(60);sc.add(sg);/* sol */
  ldExtra(sc,IS);
  /* o Kuro (o mesmo do jogo) e a raposinha */
  LD.home=rig.root.parent;sc.add(rig.root);
  try{LD.fox=makeFoxVis(undefined,true);LD.fox.g.position.set(1.5,0,.95);LD.fox.g.scale.setScalar(.95);sc.add(LD.fox.g)}catch(e){LD.fox=null}
  cam.position.set(-1.9,1.25,6.4);LD.look=new T.Vector3(2.4,3.4,-12);cam.lookAt(LD.look);
  var el=document.getElementById('ld');if(el)el.classList.add('on3d');ldTip()}
function ldTip(){var e=document.getElementById('ldTip');if(e&&LD){e.textContent=LD_TIPS[LD.tip%LD_TIPS.length];LD.tip++}}
function ldPose(dt){var t=LD.t,R=rig,j=LD.end>=0?clamp((t-LD.end)/.8,0,1):0,air=j>0&&j<1?Math.sin(j*Math.PI):0,pre=LD.end>=0?clamp((t-LD.end)/.15,0,1)*(1-j):0;
  var br=Math.sin(t*2.1)*.03;
  R.root.position.set(.05+j*1.5,air*1.6,.3-j*.8);R.root.rotation.set(0,1.05-j*.25,0);R.root.scale.setScalar(1);
  R.hips.position.y=HY-.24+br*.5-pre*.12+air*.1;R.hips.rotation.set(0,0,0);
  R.torso.rotation.x=.32+br-air*.25;R.torso.rotation.y=-.15;
  R.head.rotation.x=-.2+Math.sin(t*.9)*.05;R.head.rotation.y=Math.sin(t*.45)*.35-.2;
  /* agachado: perna da frente dobrada, a de trás com o joelho quase no chão */
  R.hipL.rotation.x=-1.25+air*.6;R.kneeL.rotation.x=1.55-air*.9;R.ankL.rotation.x=-.25;
  R.hipR.rotation.x=.15-air*.4;R.kneeR.rotation.x=1.35-air*.6;R.ankR.rotation.x=-.65;
  R.shL.rotation.x=-.75-air*1.6;R.shL.rotation.z=.25;R.elL.rotation.x=-1.05;
  R.shR.rotation.x=.25-air*1.6;R.shR.rotation.z=-.3;R.elR.rotation.x=-.6;
  if(R.scarf&&R.scarf.rotation)R.scarf.rotation.z=Math.sin(t*3.2)*.15;
  var F=LD.fox;if(F){var fj=LD.end>=0?clamp((t-LD.end-.08)/.75,0,1):0,fa=fj>0&&fj<1?Math.sin(fj*Math.PI):0;
    F.g.position.set(1.5+fj*1.6,fa*1.3,.95-fj*.7);F.g.rotation.y=-.75;F.b.position.y=Math.sin(t*2.2)*.012;F.b.rotation.z=fa*.3;
    F.legs.forEach(function(lg,i){lg.rotation.z=fa?(i<2?.9:-.9):(i<2?0:.12);if(lg.knee)lg.knee.rotation.z=fa?(i<2?-.3:.4):(i<2?0:-.22)});
    if(F.tail)F.tail.rotation.z=.35+Math.sin(t*5)*.18;if(F.tail)F.tail.rotation.y=Math.sin(t*2.6)*.35;
    if(F.head){F.head.rotation.z=Math.sin(t*1.3)*.06+.08;F.head.rotation.y=Math.sin(t*.8+1)*.25}
    (F.ears||[]).forEach(function(e,k){e.rotation.x=(k?1:-1)*-.28+(Math.sin(t*.9+k*2)>.92?.25:0)})}}
function ldFrame(){if(!LD)return;var now=performance.now(),dt=Math.min(.05,(now-LD.last)/1000);LD.last=now;LD.t+=dt;
  var c=renderer.domElement,w=c.clientWidth||innerWidth,h=c.clientHeight||innerHeight;if(Math.abs(LD.cam.aspect-w/h)>.001){LD.cam.aspect=w/h;LD.cam.updateProjectionMatrix()}
  if(LD.camFix)LD.cam.lookAt(LD.look);else{var z=Math.min(1,LD.t/9);LD.cam.position.set(-1.9+z*.4,1.25+z*.08,6.4-z*.8);LD.cam.lookAt(LD.look)}/* camFix: fotos do ícone do app *//* câmera chega perto bem devagar */
  LD.ft.offset.y=(LD.ft.offset.y+dt*1.4)%1;
  (LD.leaves||[]).forEach(function(l){l.m.rotation.z=l.rz+Math.sin(LD.t*1.3+l.ph)*.05});
  (LD.rays||[]).forEach(function(m,i){m.material.opacity=.16+Math.sin(LD.t*.6+i*1.7)*.07});
  (LD.birds||[]).forEach(function(b){b.m.position.x=b.x0+((LD.t*b.sp)%30);b.m.scale.y=Math.sin(LD.t*9+b.ph)*.8+.2});
  LD.clouds.forEach(function(k){k.g.position.x+=k.sp*dt;if(k.g.position.x>45)k.g.position.x=-40});
  LD.star.rotation.y=Math.sin(LD.t*.9)*.5;var pu=1+Math.sin(LD.t*3)*.08;LD.glow.scale.setScalar(11*pu);
  ldPose(dt);
  LD.tipT+=dt;if(LD.tipT>3.2){LD.tipT=0;ldTip()}
  LD.shown+=(LD.p-LD.shown)*(1-Math.exp(-dt*6));var b=document.getElementById('ldFill'),n=document.getElementById('ldPct');
  if(b)b.style.width=(LD.shown*100).toFixed(1)+'%';if(n)n.textContent=Math.round(LD.shown*100)+'%';
  renderer.setRenderTarget(null);renderer.render(LD.sc,LD.cam)}
/* monta o jogo em etapas; entre uma e outra a cena anda. fim(): começa o laço do jogo */
function ldBoot(steps,fim){var el=document.getElementById('ld');
  if(window.__noLoad||!el){steps.forEach(function(f){f()});if(el)el.remove();fim();return}
  document.body.classList.add('ldg');steps[0]();var i=1,t0=performance.now(),done=false;
  try{ldStart()}catch(e){console.warn(e);LD=null}
  function next(){if(LD)try{ldFrame()}catch(e){console.warn('ld',e);LD=null;el.classList.remove('on3d')}
    if(i<steps.length){var home=rig.root.parent;steps[i++]();if(LD){if(rig.root.parent!==LD.sc){LD.home=rig.root.parent;LD.sc.add(rig.root)}else if(home!==LD.sc)LD.home=home}
      if(LD)LD.p=i/steps.length;requestAnimationFrame(next);return}
    if(LD&&window.__ldHold){window.__LD=LD;LD.p=1;requestAnimationFrame(next);return}/* fotos da tela (testes/ld.js) */
    if(LD&&!done&&(performance.now()-t0<6000||LD.shown<.97)){LD.p=1;requestAnimationFrame(next);return}
    if(!done){done=true;if(!LD){finish();return}LD.end=LD.t;el.classList.add('pulo');setTimeout(function(){el.classList.add('flash')},650);setTimeout(finish,1050)}
    if(LD)requestAnimationFrame(next)}
  function finish(){window.__ldMs=performance.now()-t0;var L=LD;LD=null;if(L){if(L.home)L.home.add(rig.root);if(L.fox)L.sc.remove(L.fox.g)}
    document.body.classList.remove('ldg');fim();el.classList.add('sai');setTimeout(function(){el.remove()},700)}
  requestAnimationFrame(next)}
