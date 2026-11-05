/*@@parte:33_labirinto.js*/
/* ===================== Mundo 17: Labirinto de Tijolos =====================
   Ideia do dono: uma montanha de tijolos para descer quebrando com o pulo giratório; vários caminhos separados por paredes de concreto
   (com passagens); a chave abre a fechadura (em outro lugar) e a fechadura destranca a porta da saída. Os caminhos errados terminam numa
   bandeira falsa que leva o Kuro de volta ao começo (a chave e os tijolos quebrados continuam). Morreu: perde a chave (volta ao lugar dela).
   O mapa é desenhado com letras (LV.maze.rows), uma letra por quadradinho de 1x1:
     # concreto (nada quebra)   B tijolo   . vazio   K chave   L fechadura   D porta da saída   F cano que volta para a entrada   C bandeirinha
     S mola   ^ espinhos (não usados mais)   o moeda   g cristal   h coração   P/M/W blocos (pena, cogumelo, flor)
     e besouro   v morcego   f sapo   u ouriço   m toupeira   t tartaruga perseguidora
   Tijolos: o giratório caindo em cima quebra; a cabeçada por baixo quebra (mesmo pequeno). Assim dá para descer e cavar degraus para voltar. */
var MZ=null;
function mzPrep(L){var M0=L.maze,R=M0.rows,H=R.length,X0=M0.x0||0;M0.H=H;
  function ch(c,r){return r<0||r>=H||c<0||c>=R[r].length?'#':R[r][c]}
  function solidC(v){return v==='#'||v==='B'||v==='D'||v==='L'}
  function cx(c){return X0+c}function cy(r){return H-r-1}/* canto de baixo à esquerda do quadradinho */
  function floorY(c,r){for(var k=r+1;k<H;k++)if(solidC(ch(c,k)))return cy(k-1)/* topo do sólido de baixo */;return 0}
  function span(c,r,air){var a=c,b=c;while(!solidC(ch(a-1,r))&&(air||solidC(ch(a-1,r+1)))&&ch(a-1,r)!=='^')a--;while(!solidC(ch(b+1,r))&&(air||solidC(ch(b+1,r+1)))&&ch(b+1,r)!=='^')b++;return [cx(a)+.6,cx(b)+.4]}
  L.enemies=L.enemies||[];L.coins=L.coins||[];L.gems=L.gems||[];L.hearts=L.hearts||[];L.springs=L.springs||[];L.spikes=L.spikes||[];L.checkpoints=L.checkpoints||[];L.blocks=L.blocks||[];L.pipes=L.pipes||[];M0.pipeTo=M0.pipeTo||[-3,49];if(M0.entryPipe&&!L.pipes.some(function(q){return q.entry}))L.pipes.push({x:M0.pipeTo[0],base:M0.pipeTo[1],top:M0.pipeTo[1]+1.3,entry:1});/* cano de saída na entrada do labirinto (de onde o Kuro chega da área de fora e onde saem os canos do fundo) */
  M0.flags=[];M0.key=null;M0.lock=null;var ph=0;
  for(var r=0;r<H;r++){var run=-1;for(var c=0;c<=R[r].length;c++){var v=ch(c,r),x=cx(c),y=cy(r);
    if(v==='^'){if(run<0)run=c}else if(run>=0){L.spikes.push([cx(run)+.05,cx(c)-.05,floorY(run,r)]);run=-1}
    if(c>=R[r].length)break;
    if(v==='o')L.coins.push(['r',x+.5,x+.5,y+.5,1]);
    else if(v==='g')L.gems.push([x+.5,y+.5]);
    else if(v==='h')L.hearts.push([x+.5,y+.5]);
    else if(v==='S')L.springs.push([x+.5,floorY(c,r)]);
    else if(v==='C')L.checkpoints.push([x+.5,floorY(c,r)]);
    else if(v==='P'||v==='M'||v==='W')L.blocks.push({x:x+.5,y:+(floorY(c,r)+2.4).toFixed(2),t:'q',c:v==='P'?'feather':(v==='M'?'mushroom':'flower')});
    else if(v==='K')M0.key=[x+.5,y+.5];
    else if(v==='L')M0.lock=[c,r];
    else if(v==='F'){var fy2=floorY(c,r);L.pipes.push({x:x+.5,base:fy2,top:fy2+1.3,to:{x:M0.pipeTo[0],y:M0.pipeTo[1]}})}/* dono: cano no lugar da bandeira falsa — leva de volta para a entrada */
    else if(v==='e'||v==='f'||v==='u'||v==='m'){var sp=span(c,r,false),fy=floorY(c,r);
      if(v==='e')L.enemies.push({t:'beetle',x0:sp[0],x1:sp[1],y:fy,s:1.4});
      else if(v==='f')L.enemies.push({t:'frog',x0:sp[0],x1:sp[1],y:fy});
      else if(v==='u')L.enemies.push({t:'urchin',x0:sp[0],x1:sp[1],y:fy,s:1.5});
      else L.enemies.push({t:'mole',x0:Math.max(sp[0],x-2),x1:Math.min(sp[1],x+2),y:fy,ph:(ph+=.9)})}
    else if(v==='v'){var sp2=span(c,r,true);L.enemies.push({t:'bat',x0:sp2[0],x1:sp2[1],y:y,s:1.5})}
    else if(v==='t')L.enemies.push({t:'tchase',x0:x+.5,x1:x+.5,y:y})}}
}
function mzMats(){if(MZ&&MZ.M)return MZ.M;
  return {con:pbr(texStone,.92,.25,{color:new T.Color(0x8a9098)}),conD:pbr(texStone,.95,.2,{color:new T.Color(0x6e6c66)}),
    wood:pbr(texWood,.85,1,{color:new T.Color(0x6a4224)}),iron:M(0x4a4e56,.4,.8),gold:M(0xffc63a,.25,.9,{emissive:new T.Color(0x6a4300),emissiveIntensity:.6}),
    dark:new T.MeshBasicMaterial({color:0x120a06}),back:pbr(texStone,.97,.15,{color:new T.Color(0x4a3a30)})}}
function mzBuild(){var M0=LV.maze,R=M0.rows,H=M0.H,X0=M0.x0||0,mats=mzMats();mzTorches=[];MZ={M:mats,cells:{},bricks:[],key:null,used:false,door:null,flags:[],lock:null,t:0,told:{}};
  function ch(c,r){return r<0||r>=H||c<0||c>=R[r].length?'':R[r][c]}/* fora do mapa: nada (senão o concreto crescia sem fim) */
  /* tijolos: todos desenhados de uma vez (um desenho só no celular) */
  var list=[];for(var r=0;r<H;r++)for(var c=0;c<R[r].length;c++)if(R[r][c]==='B')list.push([c,r]);
  var bg=new T.BoxGeometry(1,1,1.6),im=new T.InstancedMesh(bg,brickM,list.length),d=new T.Object3D();im.castShadow=false;im.receiveShadow=true;
  list.forEach(function(q,i){var x=X0+q[0],y=H-q[1]-1;d.position.set(x+.5,y+.5,0);d.updateMatrix();im.setMatrixAt(i,d.matrix);
    var so={l:x,r:x+1,t:y+1,b:y,oneway:false,mz:null};var cell={c:q[0],r:q[1],i:i,so:so,x:x+.5,y:y+.5,brick:1};so.mz=cell;solids.push(so);MZ.bricks.push(cell);MZ.cells[q[0]+','+q[1]]=cell});
  im.instanceMatrix.needsUpdate=true;add(im);MZ.im=im;
  /* concreto: junta os quadradinhos em retângulos grandes (menos peças) */
  var done={},G=[];for(r=0;r<H;r++)for(c=0;c<R[r].length;c++){var v=ch(c,r);if((v!=='#'&&v!=='L')||done[c+','+r])continue;
    var w=1;while((ch(c+w,r)==='#'||ch(c+w,r)==='L')&&!done[(c+w)+','+r])w++;var h=1,ok=true;
    while(ok){for(var k=0;k<w;k++){var v2=ch(c+k,r+h);if((v2!=='#'&&v2!=='L')||done[(c+k)+','+(r+h)]){ok=false;break}}if(ok)h++}
    for(var a=0;a<w;a++)for(var b=0;b<h;b++)done[(c+a)+','+(r+b)]=1;
    var x0=X0+c,y1=H-r,y0=y1-h;solids.push({l:x0,r:x0+w,t:y1,b:y0,oneway:false,conc:1});var gg=boxGeo(w,h,2.2,1.6);gg.translate(x0+w/2,y0+h/2,-.3);G.push(gg)}
  /* paredões extras de concreto (LV.maze.walls: [x0,x1,y0,y1]) — o da direita sobe bem alto: não dá para passar a fase por cima do telhado */
  (M0.walls||[]).forEach(function(w){solids.push({l:w[0],r:w[1],t:w[3],b:w[2],oneway:false,conc:1});var gw=boxGeo(w[1]-w[0],w[3]-w[2],2.2,1.6);gw.translate((w[0]+w[1])/2,(w[2]+w[3])/2,-.3);G.push(gw)});
  add(mesh(mgL(G),mats.con,true,true));
  /* juntas escuras no concreto (de 3 em 3), só no rosto da frente */
  /* chave */
  if(M0.key){var kg=new T.Group();var ring=mesh(new T.TorusGeometry(.18,.06,8,18),mats.gold,false,false);ring.position.x=-.28;kg.add(ring);
    var sh=mesh(new T.BoxGeometry(.5,.08,.08),mats.gold,false,false);sh.position.x=.08;kg.add(sh);
    [[.22,-.1],[.32,-.12]].forEach(function(t){var tt=mesh(new T.BoxGeometry(.07,.16,.08),mats.gold,false,false);tt.position.set(t[0],t[1]+.02,0);kg.add(tt)});
    var kgl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffd860,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.7}));kgl.scale.set(1.8,1.8,1);kg.add(kgl);
    kg.position.set(M0.key[0],M0.key[1],.3);add(kg);MZ.key={g:kg,x:M0.key[0],y:M0.key[1],got:false}}
  /* fechadura (dono pediu design melhor): espelho dourado trabalhado com o buraco da chave vazado, numa moldura de ferro com rebites,
     pedrinha vermelha (trancada) que fica verde, e a chave aparece encaixada e girando quando usada */
  if(M0.lock){var lc=M0.lock[0],lr=M0.lock[1],lx=X0+lc+.5,lyy=H-lr-.5,lg=new T.Group();
    var ir=M(0x2e3036,.45,.85),gm=M(0xffc63a,.22,.95,{emissive:new T.Color(0x6a4300),emissiveIntensity:.5});
    function rshape(w,h,r){var s=new T.Shape();s.moveTo(-w/2,-h/2);s.lineTo(w/2,-h/2);s.lineTo(w/2,h/2-r);s.absarc(0,h/2-r,w/2,0,Math.PI,false);s.lineTo(-w/2,-h/2);return s}
    var back=mesh(new T.ExtrudeGeometry(rshape(1.05,1.45,.52),{depth:.08,bevelEnabled:true,bevelThickness:.03,bevelSize:.03,bevelSegments:2}),ir,false,false);back.position.z=-.04;lg.add(back);
    var es=rshape(.72,1.08,.36),kh=new T.Path();kh.absarc(0,.1,.11,0,Math.PI*2,true);es.holes.push(kh);var kt=new T.Path();kt.moveTo(-.05,.02);kt.lineTo(-.09,-.26);kt.lineTo(.09,-.26);kt.lineTo(.05,.02);kt.lineTo(-.05,.02);es.holes.push(kt);
    var esc=mesh(new T.ExtrudeGeometry(es,{depth:.06,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:2}),gm,false,false);esc.position.z=.07;lg.add(esc);
    var hole=mesh(new T.PlaneGeometry(.3,.45),mats.dark,false,false);hole.position.set(0,-.03,.06);lg.add(hole);
    [[-.4,-.58],[.4,-.58],[-.42,.3],[.42,.3]].forEach(function(q){var rv=mesh(new T.SphereGeometry(.05,8,6),gm,false,false);rv.position.set(q[0],q[1],.08);lg.add(rv)});
    var gem=mesh(new T.OctahedronGeometry(.08,0),new T.MeshStandardMaterial({color:0xff4040,emissive:new T.Color(0xc01010),emissiveIntensity:1.4,roughness:.2}),false,false);gem.position.set(0,.47,.16);lg.add(gem);
    /* chave encaixada (aparece ao usar) */
    var kin=new T.Group(),kr=mesh(new T.TorusGeometry(.14,.045,8,16),gm,false,false);kr.position.y=-.02;kin.add(kr);var ks0=mesh(new T.BoxGeometry(.06,.06,.32),gm,false,false);ks0.position.z=-.18;kin.add(ks0);kin.position.set(0,.1,.32);kin.visible=false;lg.add(kin);
    var lgl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffc040,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.45}));lgl.scale.set(2.6,2.6,1);lgl.position.z=.1;lg.add(lgl);
    function op(v){return v!==''&&'#BDL'.indexOf(v)<0}
    var sd=op(ch(lc-1,lr))?-1:(op(ch(lc+1,lr))?1:-1),fx=X0+lc+(sd<0?0:1)+sd*.02;/* virada de lado, para onde o Kuro chega */
    lg.rotation.y=sd*Math.PI/2;lg.position.set(fx,lyy,-.3);add(lg);
    MZ.lock={g:lg,x:fx+sd*.7,y:lyy,gl:lgl,hole:hole,gem:gem,kin:kin,t:0,sd:sd,fx:fx}}
  /* porta da saída (dono pediu design melhor): arco de pedra, tábuas de madeira com frisos, ferragens com cravos, dobradiças,
     espelho dourado com fechadura, pedrinha vermelha (trancada) que fica verde, e a placa SAÍDA em cima */
  var dc=[];for(r=0;r<H;r++)for(c=0;c<R[r].length;c++)if(R[r][c]==='D')dc.push([c,r]);
  if(dc.length){var c0=1e9,c1=-1e9,r0=1e9,r1=-1e9;dc.forEach(function(q){c0=Math.min(c0,q[0]);c1=Math.max(c1,q[0]);r0=Math.min(r0,q[1]);r1=Math.max(r1,q[1])});
    var dx0=X0+c0,dx1=X0+c1+1,dy1=H-r0,dy0=H-r1-1,dw=dx1-dx0,dh=dy1-dy0,dg=new T.Group(),wood=M(0x4a2a16,.85),woodD=M(0x24140a,.9),ir2=M(0x2e3036,.45,.85),gm2=M(0xffc63a,.22,.95,{emissive:new T.Color(0x6a4300),emissiveIntensity:.5});
    var back2=mesh(boxGeo(dw,dh,2,1.2),woodD,true,true);dg.add(back2);
    for(var pk=0;pk<3;pk++){var pw=dw/3-.05,pl2=mesh(boxGeo(pw,dh-.06,.12,1),wood,false,false);pl2.position.set(-dw/2+dw/6+pk*dw/3,0,.68);dg.add(pl2);for(var gv=0;gv<2;gv++){var gr2=mesh(new T.BoxGeometry(.025,dh-.2,.02),woodD,false,false);gr2.position.set(-dw/2+dw/6+pk*dw/3+(gv-.5)*pw*.45,0,.75);dg.add(gr2)}}
    [-.34,0,.34].forEach(function(f){var bd=mesh(new T.BoxGeometry(dw-.08,.16,.08),ir2,false,false);bd.position.set(0,f*dh,.77);dg.add(bd);
      for(var sx=0;sx<5;sx++){var st=mesh(new T.SphereGeometry(.045,6,4),ir2,false,false);st.position.set(-dw/2+.2+sx*(dw-.4)/4,f*dh,.82);dg.add(st)}});
    [-.3,.3].forEach(function(f){var hg=mesh(new T.BoxGeometry(.5,.12,.08),ir2,false,false);hg.position.set(-dw/2+.25,f*dh,.8);dg.add(hg);var hk=mesh(new T.CylinderGeometry(.06,.06,.2,8),ir2,false,false);hk.position.set(-dw/2+.02,f*dh,.78);dg.add(hk)});
    var de=new T.Shape();de.moveTo(-.22,-.42);de.lineTo(.22,-.42);de.lineTo(.22,.2);de.absarc(0,.2,.22,0,Math.PI,false);de.lineTo(-.22,-.42);var dkh=new T.Path();dkh.absarc(0,.08,.07,0,Math.PI*2,true);de.holes.push(dkh);var dkt=new T.Path();dkt.moveTo(-.03,.02);dkt.lineTo(-.06,-.18);dkt.lineTo(.06,-.18);dkt.lineTo(.03,.02);dkt.lineTo(-.03,.02);de.holes.push(dkt);
    var dem=mesh(new T.ExtrudeGeometry(de,{depth:.05,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:2}),gm2,false,false);dem.position.set(dw*.3,-.05*dh,.8);dg.add(dem);
    var dho=mesh(new T.PlaneGeometry(.18,.3),mats.dark,false,false);dho.position.set(dw*.3,-.05*dh-.03,.81);dg.add(dho);
    var dgem=mesh(new T.OctahedronGeometry(.09,0),new T.MeshStandardMaterial({color:0xff4040,emissive:new T.Color(0xc01010),emissiveIntensity:1.4,roughness:.2}),false,false);dgem.position.set(dw*.3,-.05*dh+.38,.86);dg.add(dgem);
    dg.children.forEach(function(o){if(o!==back2)o.position.z+=.35});/* porta ocupa a parede toda (sem buraco escuro atrás) */
    dg.rotation.y=-Math.PI/2;dg.position.set(dx0+dw/2,dy0+dh/2,-.3);add(dg);/* virada para a sala (de frente para o Kuro), não para a câmera */var dso={l:dx0,r:dx1,t:dy1,b:dy0,oneway:false,door:1};solids.push(dso);
    /* arco de pedra em volta (fica parado; a porta sobe por dentro) */
    var stn=pbr(texStone,.9,.25,{color:new T.Color(0xc8bca4)}),AR=[],cx2=dx0+dw/2;
    [-1,1].forEach(function(sd){for(var k=0;k<4;k++)AR.push(xf(new T.BoxGeometry(.36,dh/4-.04,.4),[sd*(dw/2+.16),-dh/2+(k+.5)*dh/4,1.15]))});
    for(var a=0;a<=8;a++){var an=Math.PI*a/8,rx=(dw/2+.16)*Math.cos(an),ry=(dw/2+.16)*Math.sin(an)*.8;AR.push(xf(new T.BoxGeometry(.4,.34,.4),[rx,dh/2+ry,1.15],[0,0,an-Math.PI/2]))}
    var arc=mesh(mgL(AR),stn,true,true);arc.rotation.y=-Math.PI/2;arc.position.set(cx2,dy0+dh/2,-.3);add(arc);
    /* placa SAÍDA (só na porta da saída de verdade) */
    if(!M0.noSign){
    var cv=document.createElement('canvas');cv.width=256;cv.height=96;var x2=cv.getContext('2d');x2.fillStyle='#3a2414';x2.fillRect(0,0,256,96);x2.strokeStyle='#ffc63a';x2.lineWidth=8;x2.strokeRect(6,6,244,84);
    x2.fillStyle='#ffe08a';x2.font='bold 52px Arial,sans-serif';x2.textAlign='center';x2.textBaseline='middle';x2.fillText('SAÍDA',128,50);var stx=new T.CanvasTexture(cv);stx.encoding=T.sRGBEncoding;
    var sg=mesh(new T.PlaneGeometry(1.7,.64),new T.MeshStandardMaterial({map:stx,roughness:.7,emissive:new T.Color(0x3a2a10),emissiveIntensity:.4}),false,false);sg.position.set(cx2-.6,dy1+1.55,.95);add(sg)}
    MZ.door={g:dg,so:dso,y0:dy0+dh/2,h:dh,open:0,x:dx0+dw/2,yb:dy0,gem:dgem}}
  /* bandeiras falsas: iguais às de verdade, só menores (cabem nas salas) */
  (M0.flags||[]).forEach(function(f){var g=new T.Group(),pole=mesh(new T.CylinderGeometry(.05,.06,3,8),M(0xc9d1d8,.3,.9),false,false);pole.position.y=1.5;g.add(pole);
    var fin=mesh(new T.SphereGeometry(.12,10,8),M(0xffc43a,.25,.9,{emissive:new T.Color(0x6a4300),emissiveIntensity:.5}),false,false);fin.position.y=3.05;g.add(fin);
    var fl=mesh(new T.PlaneGeometry(1.1,.7,6,3),M(0xe0482a,.8,0,{side:T.DoubleSide}),false,false);fl.position.set(.56,2.55,0);g.add(fl);
    g.position.set(f[0],f[1],-.3);add(g);MZ.flags.push({g:g,fl:fl,x:f[0],y:f[1],cd:0})});
  if(!mzBuild.hud){mzBuild.hud=1}var ks=$('keyStat');if(ks)ks.hidden=true;
}
/* parede do fundo e tochas */
function mzDecor(th){var M0=LV.maze;if(!M0)return;var mats=mzMats(),H=M0.H,X0=M0.x0||0,Wd=M0.rows[0].length;
  var bg=boxGeo(Wd+40,H+30,.4,3);var bk=mesh(bg,mats.back,false,true);bk.position.set(X0+Wd/2,H/2-6,-1.9);add(bk);
  var tm0=new T.MeshStandardMaterial({color:0xffd8a0,emissive:new T.Color(0xff9a30),emissiveIntensity:2.2}),T0=[],S=[];
  for(var r=3;r<H;r+=6)for(var c=2;c<Wd;c+=11){var x=X0+c+4.5,y=H-r-1.2;T0.push(xf(new T.CylinderGeometry(.05,.07,.5,6),[x,y,-1.6]));mzTorch(x,y+.35,-1.55,2.6)}
  add(mesh(mgL(T0),M(0x4a3020,.9),false,false))}
/* tocha: chama e brilho próprios para tremular (mzTorchUpd) */
var mzTorches=[],mzFlameG=null,mzFlameM=null;
function mzTorch(x,y,z,gs){if(!mzFlameG){mzFlameG=new T.ConeGeometry(.13,.42,7);mzFlameG.translate(0,.21,0);mzFlameM=new T.MeshStandardMaterial({color:0xffe0a0,emissive:new T.Color(0xff8a20),emissiveIntensity:2.6,transparent:true,opacity:.95})}
  var f=new T.Mesh(mzFlameG,mzFlameM);f.position.set(x,y,z);add(f);var f2=new T.Mesh(mzFlameG,mzFlameM);f2.scale.set(.55,.7,.55);f2.position.set(x,y+.02,z+.06);add(f2);
  var s=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffa040,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.55}));s.scale.set(gs,gs,1);s.position.set(x,y+.3,z+.2);add(s);
  mzTorches.push({f:f,f2:f2,s:s,gs:gs,ph:Math.random()*6.28,x:x})}
function mzTorchUpd(){var t=tm;mzTorches.forEach(function(T0){if(Math.abs(T0.x-P.x)>26)return;var a=Math.sin(t*13+T0.ph)*.5+Math.sin(t*21+T0.ph*2)*.3;
  T0.f.scale.set(1+a*.12,1+a*.28,1+a*.12);T0.f.rotation.z=Math.sin(t*9+T0.ph)*.12;T0.f2.scale.set(.55-a*.06,.7+a*.2,.55-a*.06);T0.f2.rotation.z=-Math.sin(t*11+T0.ph)*.15;
  var g=T0.gs*(1+a*.08);T0.s.scale.set(g,g,1);T0.s.material.opacity=.5+a*.1})}
/* quebrar tijolo */
function mzBreak(cell){if(!cell||cell.dead)return;cell.dead=1;cell.so.dead=true;var z=new T.Matrix4().makeScale(0,0,0);MZ.im.setMatrixAt(cell.i,z);MZ.im.instanceMatrix.needsUpdate=true;
  sfx.brick();emit(dustPool,cell.x,cell.y,8,3,.6,.45,1,3);spawnDebris(cell.x,cell.y);shake=Math.max(shake,.06)}
function mzHit(cell){if(cell&&cell.brick)mzBreak(cell)}/* cabeçada por baixo: quebra (mesmo pequeno) */
function mzDown(s){/* giratório caindo em cima: quebra o(s) tijolo(s) embaixo dos pés */
  var y=s.t,hit=false;for(var i=0;i<MZ.bricks.length;i++){var c=MZ.bricks[i];if(c.dead||c.so.t!==y)continue;if(c.so.r>P.x-.28&&c.so.l<P.x+.28){mzBreak(c);hit=true}}
  if(!hit)return false;
  /* giro automático (dono): depois de quebrar, o Kuro continua girando sozinho — pulinho, cai, quebra o próximo — até apertar o pulo normal
     ou cair em algo que não é tijolo. Dá para ir para os lados enquanto gira. */
  P.sj=true;P.drill=true;P.vy=5.4;P.grounded=false;P.onPlat=null;try{beep(420,.06,'triangle',.03,180)}catch(e){}
  if(!MZ.told.dig){MZ.told.dig=1;toast('Girando e quebrando! Aperte o pulo para parar')}return true}
function mzReset(){if(!MZ)return;P.drill=false;if(MZ.key&&!MZ.used){var K=MZ.key;K.got=false;mzFreeKey(K);K.g.visible=true;K.g.position.set(K.x,K.y,.3);K.g.rotation.set(0,0,0);K.g.scale.setScalar(1);MZ.ins=null;P.key=false;var ks=$('keyStat');if(ks)ks.hidden=true}}/* morreu: perde a chave (volta para o lugar dela) */
function mzUpd(dt){if(!MZ)return;MZ.t+=dt;mzTorchUpd();var K=MZ.key,D=MZ.door,L0=MZ.lock;
  /* giro automático: para com o pulo normal (apertar de novo), ao pisar em algo que não é tijolo, ou ao ser lançado pela mola */
  var jp=keys.jump&&!MZ.jPrev;MZ.jPrev=keys.jump;
  if(P.drill){if(jp||P.grounded||!P.sj||P.vy>18||state!=='play'){P.drill=false;if(jp||P.vy>18)P.sj=false}}
  if(K&&!K.got){K.g.rotation.y+=dt*2;K.g.position.y=K.y+Math.sin(MZ.t*2.5)*.12;
    if(state==='play'&&Math.abs(P.x-K.x)<.7&&K.y>P.y-.3&&K.y<P.y+P.h+.3){K.got=true;P.key=true;var ks=$('keyStat');if(ks)ks.hidden=false;
      try{sfx.coin();beep(880,.12,'triangle',.05);beep(1320,.2,'triangle',.05,0,.1)}catch(e){}emit(sparkPool,K.x,K.y,16,4,.7,.35,.2,3);toast('Pegou a chave! Agora encontre a fechadura')}}
  /* o Kuro carrega a chave na mão */
  if(K&&K.got&&!MZ.used&&!MZ.ins)mzHoldKey(K);
  /* colocando a chave no buraco: voa até a fechadura, entra, e lá dentro gira (clac) */
  if(MZ.ins&&L0){var I=MZ.ins;I.t+=dt;var hole=L0.g.localToWorld(new T.Vector3(0,.1,.45)),inn=L0.g.localToWorld(new T.Vector3(0,.1,.2));
    K.g.rotation.set(0,L0.sd<0?0:Math.PI,0);K.g.scale.setScalar(.8);
    if(I.t<.45){var u=I.t/.45;u=u*u*(3-2*u);K.g.position.lerpVectors(I.from,hole,u);K.g.position.y+=Math.sin(u*Math.PI)*.5}
    else if(I.t<.7){K.g.position.lerpVectors(hole,inn,(I.t-.45)/.25)}
    else{K.g.visible=false;MZ.ins=null;mzUnlock()}}
  if(L0){L0.gl.material.opacity=MZ.used?.15:.35+Math.sin(MZ.t*3)*.15;L0.gem.rotation.y+=dt*2;if(L0.turn&&L0.turn<2){L0.turn=Math.min(2,L0.turn+dt*1.6);L0.kin.rotation.z=-(L0.turn-1)*Math.PI/2}
    var nearL=state==='play'&&Math.abs(P.x-L0.x)<1.6&&Math.abs((P.y+.7)-L0.y)<1.6;
    if(nearL&&!MZ.used){if(K&&K.got){if(!MZ.ins){mzFreeKey(K);MZ.ins={t:0,from:K.g.position.clone()};try{beep(700,.08,'triangle',.04)}catch(e){}}}
      else if(!MZ.told.lock){MZ.told.lock=1;toast('Uma fechadura... falta a chave')}}
    if(!nearL)MZ.told.lock=0}
  if(D){if(D.opening&&D.open<1){D.open=Math.min(1,D.open+dt/1.4);D.g.position.y=D.y0+D.h*D.open;if(Math.random()<.3)emit(dustPool,D.x,D.yb+.2,2,1.4,.5,.5,1.2,-.3)}
    if(!MZ.used&&state==='play'&&Math.abs(P.x-(D.so.l-.3))<.5&&P.y<D.so.t&&P.y>=D.so.b-.2){if(!MZ.told.door){MZ.told.door=1;try{sfx.bump()}catch(e){}toast('Trancada! Encontre a chave e a fechadura')}}else if(Math.abs(P.x-D.so.l)>3)MZ.told.door=0}
  MZ.flags.forEach(function(F){var pa=F.fl.geometry.attributes.position;for(var i=0;i<pa.count;i++){var x=pa.getX(i)+.55;pa.setZ(i,Math.sin(MZ.t*5-x*3)*.08*x)}pa.needsUpdate=true;
    if(F.cd>0){F.cd-=dt;F.g.visible=F.cd<.2;return}
    if(state==='play'&&Math.abs(P.x-F.x)<.6&&P.y<F.y+3&&P.y>F.y-.4){F.cd=1.5;F.g.visible=false;emit(dustPool,F.x,F.y+1.5,22,3,.9,.8,1.4,-.2);emit(sparkPool,F.x,F.y+2,10,3,.6,.3,.2,2);
      try{beep(500,.15,'sawtooth',.04,-300);beep(260,.3,'sawtooth',.04,-120,.12)}catch(e){}
      toast('Bandeira falsa! Sem a chave não tem saída...');P.x=LV.start.x;P.y=LV.start.y;P.vx=0;P.vy=0;P.sj=false;P.drill=false;P.onPlat=null;P.inv=Math.max(P.inv,1);updateCamera(0,true)}})}
LEVELS.forEach(function(L){if(L.maze)mzPrep(L);if(L.pre&&L.pre.maze)mzPrep(L.pre)});
/* ===================== área de fora do labirinto: Ruínas de Tijolos =====================
   Fim de tarde virando noite. Treina o que o labirinto pede: poço de tijolos (giro automático), ressalto de tijolos com mola (subir quebrando),
   pilar de concreto, caixinha de tijolos com a chave, fechadura no pilarzinho e a porta no muro; ponte de tijolos sobre um buraco (girando nela, cai!).
   No fim, o cano grande leva para dentro do labirinto (sai pelo cano da entrada, lá em cima). Perdeu tudo lá dentro: volta para cá (como na Mina). */
function mazeEnter(){
  var keep={coins:coinsGot,gems:gemsGot,t:timeT,hearts:hearts,bank:bank,big:!!P.big,fire:!!P.fire,cape:!!P.cape,shield:!!P.shield,tot:coins.length+extraCoins};
  $('fade').style.opacity=1;prePast[levelIdx]=true;var cn=carryNow;carryNow=null;
  buildLevel(levelIdx);resetState();carryNow=cn;
  coinsGot=keep.coins;gemsGot=keep.gems;timeT=keep.t;hearts=keep.hearts;bank=keep.bank;extraCoins+=keep.tot;
  P.big=keep.big;if(keep.cape)setCape(true);else if(keep.fire)setFire(true);P.shield=keep.shield;
  setHearts();$('coinN').textContent=bank;$('gemN').textContent=String(gemsGot);
  var e=null;pipes.forEach(function(q){if(q.entry)e=q});
  if(e){P.x=e.x;P.y=e.top-1.95;P.warp={t:.4,pp:{x:e.x,top:e.top},tg:{x:e.x,y:e.top},moved:true,exit:e}}else{P.x=LV.start.x;P.y=LV.start.y}
  P.vx=0;P.vy=0;P.grounded=false;P.onPlat=null;P.face=1;updateCamera(0,true);try{sfx.pipe()}catch(er){}toast('Kuro entrou no Labirinto de Tijolos!')}
function mzPreDecor(){var r=rnd(1717),lite=LITE,mats=mzMats(),d=new T.Object3D(),i,k;
  /* muros de tijolo em ruínas lá atrás (topo quebrado) */
  var B=[];[[4,8],[30,7],[56,6],[80,9],[100,7]].forEach(function(q){var x0=q[0],w=q[1],z=-3.6-r()*2;for(var c=0;c<w;c++){var h=2+Math.floor(r()*4+(c>0&&c<w-1?2:0));for(k=0;k<h;k++)B.push([x0+c+.5+(k%2)*.25,4+.25+k*.5,z])}});
  var bi=new T.InstancedMesh(new T.BoxGeometry(1,.5,.7),brickM,B.length);B.forEach(function(p,j){d.position.set(p[0],p[1],p[2]);d.rotation.set(0,(r()-.5)*.08,0);d.updateMatrix();bi.setMatrixAt(j,d.matrix)});bi.receiveShadow=true;add(bi);
  /* pilares de concreto quebrados */
  var C=[];[[16,3.5],[42,5],[68,2.8],[92,4.2],[112,6]].forEach(function(q){C.push(xf(new T.BoxGeometry(1.2,q[1],1.2),[q[0],4+q[1]/2,-4.8]))});add(mesh(mgL(C),mats.con,true,true));
  /* a montanha de tijolos lá no fundo, no fim do caminho (é o labirinto) */
  var M=[];for(k=0;k<12;k++){var hw=30-k*2.4,cx=150;for(var x=cx-hw;x<=cx+hw;x+=2)M.push([x+(k%2),2+k*2,-16-k*.3])}
  var mi=new T.InstancedMesh(new T.BoxGeometry(2,2,2),brickM,M.length);M.forEach(function(p,j){d.position.set(p[0],p[1],p[2]);d.rotation.set(0,0,0);d.updateMatrix();mi.setMatrixAt(j,d.matrix)});add(mi);
  /* tochas acesas */
  var tm0=new T.MeshStandardMaterial({color:0xffd8a0,emissive:new T.Color(0xff9a30),emissiveIntensity:2.4}),TT=[];
  [10,17,36,52,64,84,98,108,118].forEach(function(x){TT.push(xf(new T.CylinderGeometry(.06,.08,1.4,6),[x,4.7,-2.6]));mzTorch(x,5.55,-2.6,2.4)});/* nenhuma em cima dos tijolos (o poço é em 20–27) */
  add(mesh(mgL(TT),new T.MeshStandardMaterial({color:0x4a3020,roughness:.9}),false,false));/* (M aqui é a lista da montanha) */
  /* lua nascendo */
  if(farG){var mo=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xfff4d8,transparent:true,depthWrite:false,fog:false,opacity:.95}));mo.scale.set(9,9,1);mo.position.set(30,34,-120);farG.add(mo);
    var md=new T.Mesh(new T.CircleGeometry(2.2,24),new T.MeshBasicMaterial({color:0xfff6e0,fog:false}));md.position.set(30,34,-119);farG.add(md)}}

/* a chave entrou e girou: destranca a porta */
function mzUnlock(){var L0=MZ.lock,D=MZ.door;MZ.used=true;P.key=false;var ks2=$('keyStat');if(ks2)ks2.hidden=true;L0.kin.visible=true;L0.turn=1;
  [L0.gem,D&&D.gem].forEach(function(g){if(g){g.material.color.set(0x40ff70);g.material.emissive.set(0x10a030)}});
  try{beep(300,.08,'square',.05);beep(500,.1,'square',.05,0,.08);beep(900,.25,'triangle',.05,0,.18)}catch(e){}emit(sparkPool,L0.fx,L0.y,20,4,.8,.35,.2,3);
  if(D){D.so.dead=true;D.opening=1}toast(LV.maze&&LV.maze.noSign?'Clac! A porta destrancou!':'Clac! A porta da saída destrancou!')}

/* a chave presa na mão do Kuro (a mão do lado da câmera), pela argola, com a haste para baixo */
function mzHoldKey(K){var hs=rig.hands,h=hs[0],w=new T.Vector3(),w2=new T.Vector3();
  if(hs[1]){hs[0].getWorldPosition(w);hs[1].getWorldPosition(w2);if(w2.z>w.z)h=hs[1]}
  if(K.g.parent!==h){K.home=K.home||K.g.parent;h.add(K.g)}
  var ws=new T.Vector3();h.getWorldScale(ws);var s=.55/(ws.x||1);
  K.g.visible=true;K.g.scale.setScalar(s);K.g.rotation.set(0,0,-Math.PI/2+Math.sin(MZ.t*5)*.12);K.g.position.set(0,-.28*s*(ws.x||1)/(ws.x||1),0);
  var gl=K.g.children[K.g.children.length-1];if(gl&&gl.isSprite)gl.visible=false}
function mzFreeKey(K){if(K.home&&K.g.parent!==K.home){K.home.attach(K.g)}var gl=K.g.children[K.g.children.length-1];if(gl&&gl.isSprite)gl.visible=true}
