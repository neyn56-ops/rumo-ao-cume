/*@@parte:35_naufragio.js*/
/* ===================== Mundo 19 — O Naufrágio =====================
   Ideia do dono (31/10): navio partido ao meio — a proa encalhada na praia, a popa boiando no mar, destroços levados pelas ondas,
   tempestade forte ao longo da fase. Parte 1: a praia e a metade encalhada. */
var WK=null,wkM=null;
function wkMats(){if(wkM)return wkM;
  function planks(base,dark,seed){var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),r=rnd(seed);
    for(var i=0;i<8;i++){var y=i*32,l=48+r()*18;x.fillStyle='hsl('+base+','+(18+r()*8)+'%,'+(l*.5)+'%)';x.fillRect(0,y,256,32);
      x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,y,256,2);var cx=r()*256;x.fillRect(cx,y,2,32);x.fillRect((cx+128)%256,y,2,32);
      for(var k=0;k<14;k++){x.fillStyle='rgba('+(dark?'20,30,20':'255,255,240')+','+(.05+r()*.08)+')';x.fillRect(r()*256,y+2+r()*28,20+r()*60,1+r()*2)}
      x.fillStyle='rgba(40,40,40,.6)';x.fillRect((cx+6)%256,y+8,3,3);x.fillRect((cx+6)%256,y+22,3,3)}
    for(i=0;i<30;i++){x.fillStyle='rgba(70,110,80,'+(.08+r()*.12)+')';x.beginPath();x.arc(r()*256,r()*256,4+r()*16,0,6.3);x.fill()}/* limo verde */
    var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(1/3.4,1/3.4);t.encoding=T.sRGBEncoding;return t}
  var sail=document.createElement('canvas');sail.width=sail.height=128;var sx=sail.getContext('2d'),r=rnd(919);sx.fillStyle='#d8ccb0';sx.fillRect(0,0,128,128);
  for(var i=0;i<40;i++){sx.fillStyle='rgba(120,100,70,'+(r()*.25)+')';sx.fillRect(r()*128,r()*128,r()*30,r()*6)}
  sx.globalCompositeOperation='destination-out';for(i=0;i<9;i++){sx.beginPath();var hx=r()*128,hy=40+r()*88;sx.moveTo(hx,hy);for(var k=0;k<6;k++)sx.lineTo(hx+(r()-.5)*40,hy+(r()-.5)*40);sx.fill()}
  var st=new T.CanvasTexture(sail);st.encoding=T.sRGBEncoding;
  wkM={hull:new T.MeshStandardMaterial({map:planks(30,1,71),color:0xb8c0a8,roughness:.9}),deck:new T.MeshStandardMaterial({map:planks(34,0,72),color:0xc8c0a8,roughness:.88}),
    dark:M(0x3a3226,.9),wood:M(0x6a5a44,.85),rope:M(0xb89a6a,.9),iron:M(0x2e3236,.5,.6),rust:M(0x6a3a22,.8,.3),
    sail:new T.MeshStandardMaterial({map:st,color:0xffffff,roughness:.95,side:T.DoubleSide,transparent:true,alphaTest:.5}),
    crate:new T.MeshStandardMaterial({map:planks(32,1,73),color:0xa89878,roughness:.9}),wet:M(0x8a7454,.6)};
  return wkM}
/* casco do navio, caixotes e tábuas: os blocos de LV.solids com 6º valor ('ship' fica invisível, o casco desenha; 'crate'; 'plank') */
function wkSolid(s){var A=wkMats(),x0=s[0],x1=s[1],top=s[2],w=x1-x0,cx=(x0+x1)/2;
  if(s[5]==='crate'){var h=top-(s[3]!==undefined&&s[3]>-1?s[3]:0),bot=top-h,n=Math.max(1,Math.round(h/1.4));
    for(var i=0;i<n;i++){var hh=h/n,cb=mesh(boxGeo(w-.04,hh-.04,1.8,1.4),A.crate,true,true);cb.position.set(cx,bot+hh*(i+.5),-.2);cb.rotation.y=(i%2?.05:-.04);add(cb);
      [-1,1].forEach(function(sd){var st=mesh(new T.BoxGeometry(.1,hh-.04,.06),A.dark,false,false);st.position.set(cx+sd*(w/2-.12),bot+hh*(i+.5),.72);add(st)});
      var dg=mesh(new T.BoxGeometry(Math.hypot(w,hh)*.9,.09,.06),A.dark,false,false);dg.rotation.z=Math.atan2(hh,w);dg.position.set(cx,bot+hh*(i+.5),.72);add(dg)}}
  else if(s[5]==='plank'){var pb=mesh(boxGeo(w,.35,2.2,1),A.deck,true,true);pb.position.set(cx,top-.17,-.4);pb.rotation.z=(s[6]||0);add(pb);
    for(var k=0;k<3;k++){var po=mesh(new T.CylinderGeometry(.09,.11,top+.4,6),A.dark,false,false);po.position.set(x0+.3+k*(w-.6)/2,(top-.4)/2,-.4+(k-1)*.6);add(po)}}
  solids.push({l:x0,r:x1,t:top,b:s[3]!==undefined?s[3]:-14,oneway:s[6]==='up'})}/* 'up': dá para passar por baixo (subindo a escada pelo buraco do cesto) e pisar em cima */
/* ---- a metade do navio encalhada na areia ---- */
function wkShip(S){var A=wkMats(),g=new T.Group(),r=rnd(4141),D=4.4,Z0=-3.0;
  /* perfil do casco (de lado): proa à esquerda subindo, convés, ponta quebrada à direita */
  var p=new T.Shape(),j=S.br,pts=[[S.x0-.4,S.fc+.9],[S.x0+.6,S.fc],[S.fx,S.fc],[S.fx,S.deck],[j,S.deck],
    [j+.6,S.deck-.6],[j+.2,S.deck-1.1],[j+1.1,S.deck-1.5],[j+.7,S.deck-2.1],[j+1.6,S.deck-2.6],[j+1.2,S.deck-3.2],[j+2.1,S.deck-3.8],[j+2.1,-.8],
    [S.x0+18,-1],[S.x0+6,-.9],[S.x0+1.2,-.8],[S.x0+.2,1.2],[S.x0-.4,3.6]];/* a proa encosta na areia (não fica suspensa) */
  p.moveTo(pts[0][0],pts[0][1]);for(var i=1;i<pts.length;i++)p.lineTo(pts[i][0],pts[i][1]);p.closePath();
  var hg=new T.ExtrudeGeometry(p,{depth:D,bevelEnabled:false,steps:1});hg.translate(0,0,Z0);
  var hull=mesh(hg,A.hull,true,true);g.add(hull);
  /* tábuas do convés por cima (outra textura, um pouco mais clara) e a borda (amurada) lá atrás */
  [[S.x0+.6,S.fx,S.fc],[S.fx,j,S.deck]].forEach(function(q){var w=q[1]-q[0],dk=mesh(boxGeo(w,.08,D-.1,1),A.deck,false,true);dk.position.set((q[0]+q[1])/2,q[2]+.03,Z0+D/2);g.add(dk);
    var bw=mesh(boxGeo(w,.9,.18,1),A.hull,true,false);bw.position.set((q[0]+q[1])/2,q[2]+.45,Z0+.1);g.add(bw);
    var cap=mesh(new T.BoxGeometry(w,.1,.3),A.dark,false,false);cap.position.set((q[0]+q[1])/2,q[2]+.92,Z0+.1);g.add(cap);
    for(var x=q[0]+.4;x<q[1];x+=2.2){var pst=mesh(new T.BoxGeometry(.14,.55,.14),A.dark,false,false);pst.position.set(x,q[2]+.27,Z0+D-.15);g.add(pst)}});/* só os postinhos na frente (não escondem o Kuro) */
  /* faixa escura no casco (linha d'água) e as costelas aparecendo na ponta quebrada */
  var wl=mesh(new T.BoxGeometry(j-S.x0,.18,.04),A.dark,false,false);wl.position.set((S.x0+j)/2,1.3,Z0+D+.01);g.add(wl);
  for(i=0;i<5;i++){var rb=mesh(new T.BoxGeometry(.16,S.deck+1.2-i*.4,.16),A.dark,true,false);rb.position.set(j+.4+i*.35,(S.deck-i*.4)/2-.2,Z0+D*(.15+i*.17));rb.rotation.z=(r()-.5)*.3;g.add(rb)}
  for(i=0;i<9;i++){var sp=mesh(new T.BoxGeometry(.9+r()*1.2,.12,.35),A.deck,false,false);sp.position.set(j+.5+r()*1.4,S.deck-.2-r()*3.4,Z0+D*r());sp.rotation.set(r(),r(),(r()-.5)*1.6);g.add(sp)}/* lascas */
  /* gurupés (o mastro da ponta) */
  /* gurupés: sai de dentro da proa (preso no castelo) e tem cordas segurando a ponta */
  var bz=Z0+D/2,bb=new T.Vector3(S.x0+1.5,S.fc+.3,bz),bt=new T.Vector3(S.x0+1.5-5.9,S.fc+.3+2.75,bz);
  var bs=mesh(new T.CylinderGeometry(.1,.19,6.5,8),A.wood,true,false);bs.position.copy(bb).add(bt).multiplyScalar(.5);bs.rotation.z=1.135;g.add(bs);
  var bnd=mesh(new T.TorusGeometry(.22,.06,5,12),A.iron,false,false);bnd.position.set(S.x0-.2,S.fc+.85,bz);bnd.rotation.y=Math.PI/2;bnd.rotation.x=.45;g.add(bnd);
  function rope(a,b){var c=new T.CylinderGeometry(.025,.025,a.distanceTo(b),4),m2=mesh(c,A.rope,false,false);m2.position.copy(a).add(b).multiplyScalar(.5);m2.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());g.add(m2)}
  rope(bt,new T.Vector3(S.x0-.1,1.4,bz));rope(bt,new T.Vector3(S.mast.x,S.mast.top+3.6,-1.1));
  /* mastro principal com o cesto da gávea (plataforma) e a escada de corda */
  var mx=S.mast.x,mz=-1.1,mt=S.mast.top+4;
  var ms=mesh(new T.CylinderGeometry(.17,.24,mt-S.deck,10),A.wood,true,false);ms.position.set(mx,(mt+S.deck)/2,mz);g.add(ms);
  var yd=mesh(new T.CylinderGeometry(.09,.09,4.4,8),A.wood,true,false);yd.rotation.z=Math.PI/2;yd.position.set(mx+.6,mt-.35,mz+.25);g.add(yd);
  var sl=new T.Mesh(new T.PlaneGeometry(3.6,2.5,8,4),A.sail);var sa=sl.geometry.attributes.position;for(i=0;i<sa.count;i++)sa.setZ(i,Math.sin(sa.getX(i)*.8)*.12+(sa.getY(i)<0?(.15-sa.getY(i)*.08):0));/* vela menor, na frente do mastro: longe da escada e das cordas (ficam atrás) */sl.geometry.computeVertexNormals();
  sl.position.set(mx+.6,mt-.35-1.3,mz+.3);/* pendurada na verga, no topo do mastro (acaba acima do cesto) */g.add(sl);WK.sail=sl;
  var nt=S.mast.top,nr=1.35;var nb=mesh(new T.CylinderGeometry(nr,nr*.85,.2,18),A.dark,true,true);nb.position.set(mx,nt-.1,mz);g.add(nb);
  for(i=0;i<14;i++){var an=i/14*Math.PI*2;if(Math.sin(an)>.55)continue;var sl2=mesh(new T.BoxGeometry(.1,.75,.1),A.wood,false,false);sl2.position.set(mx+Math.cos(an)*nr,nt+.37,mz+Math.sin(an)*nr);g.add(sl2)}/* ripas do cesto (a frente aberta) */
  var rg=mesh(new T.TorusGeometry(nr,.05,4,24,Math.PI*1.3),A.wood,false,false);rg.rotation.x=Math.PI/2;rg.rotation.z=Math.PI*.85;rg.position.set(mx,nt+.75,mz);g.add(rg);
  /* escada: sobe reta do convés até o fundo do cesto (passa pelo buraco do cesto) e fica presa nele por duas braçadeiras de ferro */
  var lx=S.ladder,L=[],ltop=nt-.18;[-.28,.28].forEach(function(dx){var c=new T.CylinderGeometry(.035,.035,ltop-S.deck,4);c.translate(lx+dx,(ltop+S.deck)/2,-.35);L.push(c)});
  for(var y=S.deck+.4;y<ltop;y+=.45){var d=new T.CylinderGeometry(.03,.03,.6,4);d.rotateZ(Math.PI/2);d.translate(lx,y,-.35);L.push(d)}
  g.add(mesh(mgL(L),A.rope,false,false));
  [-.28,.28].forEach(function(dx){var ri=mesh(new T.TorusGeometry(.09,.03,5,10),A.iron,false,false);ri.rotation.x=Math.PI/2;ri.position.set(lx+dx,S.deck+.03,-.35);g.add(ri);
    var br=mesh(new T.BoxGeometry(.12,.3,.5),A.iron,false,false);br.position.set(lx+dx,nt-.25,-.6);g.add(br)});
  vines.push({x:lx,y0:S.deck,top:nt,len:nt-S.deck,max:nt-S.deck,g:new T.Object3D(),stem:new T.Object3D(),leaves:[],ladder:1});
  var bl=mesh(new T.SphereGeometry(.16,8,6),A.wood,false,false);bl.position.set(mx,mt+.05,mz);g.add(bl);/* pomo no topo do mastro */
  /* cordame: cordas do topo do mastro até as bordas */
  [[S.x0+2,S.fc+.9],[S.fx+4,S.deck+.9],[j-1,S.deck+.9],[j-6,S.deck+.9]].forEach(function(q){var a=new T.Vector3(mx,mt-.4,mz),b=new T.Vector3(q[0],q[1],Z0+.2),c=new T.CylinderGeometry(.025,.025,a.distanceTo(b),4),m2=mesh(c,A.rope,false,false);m2.position.copy(a).add(b).multiplyScalar(.5);m2.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());g.add(m2)});
  /* toco do segundo mastro, quebrado, com a vela rasgada pendurada */
  var sx=S.stump,stp=mesh(new T.CylinderGeometry(.16,.22,4.2,10),A.wood,true,false);stp.position.set(sx,S.deck+2.1,-1.6);g.add(stp);
  var tp=mesh(new T.ConeGeometry(.17,.6,6),A.wood,false,false);tp.position.set(sx+.05,S.deck+4.4,-1.6);tp.rotation.z=.4;g.add(tp);
  var s2=new T.Mesh(new T.PlaneGeometry(2.6,3,6,6),A.sail);var s2a=s2.geometry.attributes.position;for(i=0;i<s2a.count;i++)s2a.setZ(i,Math.sin(s2a.getY(i)*1.3)*.3);s2.geometry.computeVertexNormals();s2.position.set(sx+1.1,S.deck+2.4,-1.9);s2.rotation.z=-.15;g.add(s2);
  /* canhões, barris e cordas enroladas no convés (atrás do caminho) */
  [[S.fx+3,S.deck],[j-4,S.deck]].forEach(function(q){var cn=new T.Group(),tb=mesh(new T.CylinderGeometry(.18,.26,1.7,10),A.iron,true,false);tb.rotation.z=Math.PI/2;tb.position.y=.5;cn.add(tb);
    var cr=mesh(new T.BoxGeometry(1,.35,.7),A.wood,true,false);cr.position.y=.2;cn.add(cr);[-1,1].forEach(function(sd){var wh=mesh(new T.CylinderGeometry(.18,.18,.08,10),A.dark,false,false);wh.rotation.x=Math.PI/2;wh.position.set(sd*.35,.18,.38);cn.add(wh)});
    cn.position.set(q[0],q[1],-2.2);cn.rotation.y=-.3;g.add(cn)});
  [[S.fx+8,S.deck],[S.x0+3,S.fc]].forEach(function(q){wkBarrel(g,q[0],q[1],-2.3)});
  var co=mesh(new T.TorusGeometry(.35,.1,6,14),A.rope,false,false);co.rotation.x=Math.PI/2;co.position.set(j-8,S.deck+.1,-2.3);g.add(co);
  add(g);WK.ship=g;
  /* âncora caída na areia e a corrente até a proa */
  var an=new T.Group(),sh=mesh(new T.CylinderGeometry(.09,.09,1.9,8),A.rust,true,false);sh.position.y=.95;an.add(sh);
  var ar=mesh(new T.TorusGeometry(.75,.1,6,16,Math.PI),A.rust,true,false);ar.rotation.z=Math.PI;ar.position.y=.65;an.add(ar);
  [-1,1].forEach(function(sd){var fl=mesh(new T.ConeGeometry(.16,.4,4),A.rust,false,false);fl.position.set(sd*.75,.75,0);fl.rotation.z=sd*.6;an.add(fl)});
  var ri=mesh(new T.TorusGeometry(.2,.06,6,12),A.rust,false,false);ri.position.y=2;an.add(ri);var st2=mesh(new T.CylinderGeometry(.06,.06,1.1,6),A.rust,false,false);st2.rotation.z=Math.PI/2;st2.position.y=1.7;an.add(st2);
  an.position.set(S.anchor,.02,1.0);an.rotation.set(-1.35,.2,.3);add(an);
  /* corrente: sai da argola da âncora, fica deitada na areia e sobe até o buraco na frente da proa */
  an.position.z=.2;an.updateMatrixWorld(true);var abx=new T.Box3().setFromObject(an);solids.push({l:abx.min.x+.2,r:abx.max.x-.2,t:.45,b:0,oneway:true,anchor:1});/* a âncora é um degrau baixinho (como um bicho dormindo): o Kuro sobe andando */
  var ra=new T.Vector3(0,2,0).applyMatrix4(an.matrixWorld),hp=new T.Vector3(S.x0+.7,2.5,Z0+D+.05),ch=[],P0=[];
  var hw=mesh(new T.TorusGeometry(.22,.08,6,12),A.iron,false,false);hw.position.copy(hp);g.add(hw);var hh=mesh(new T.CircleGeometry(.16,10),M(0x050505,.9),false,false);hh.position.set(hp.x,hp.y,hp.z+.01);g.add(hh);
  var gx=hp.x-1.6;/* até aqui a corrente fica no chão; depois sobe */
  function cp(u){var x=ra.x+(hp.x-ra.x)*u,z=ra.z+(hp.z-ra.z)*u,y;if(x<gx)y=.07+Math.max(0,ra.y-.07)*Math.max(0,1-(x-ra.x)/.8);else{var k=(x-gx)/(hp.x-gx);y=.07+(hp.y-.07)*k*k}return new T.Vector3(x,y,z)}
  var L2=0,prev=cp(0);for(var q=1;q<=200;q++){var c2=cp(q/200);L2+=c2.distanceTo(prev);prev=c2}var N=Math.round(L2/.2);
  var pts=[cp(0)];for(q=1;q<=N;q++){var tgt=q*L2/N,acc=0,pv=cp(0),u=0;for(var z2=1;z2<=200;z2++){var cc=cp(z2/200);acc+=cc.distanceTo(pv);pv=cc;if(acc>=tgt){u=z2/200;break}}pts.push(cp(u||1))}
  for(i=0;i<pts.length-1;i++){var a2=pts[i],b2=pts[i+1],lk=new T.TorusGeometry(.11,.032,4,8);lk.scale(1.45,1,1);if(i%2)lk.rotateX(Math.PI/2);
    var m4=new T.Mesh(lk),dv=b2.clone().sub(a2);m4.position.copy(a2).add(b2).multiplyScalar(.5);m4.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),dv.normalize());m4.updateMatrix();lk.applyMatrix4(m4.matrix);ch.push(lk)}
  add(mesh(mgL(ch),A.iron,true,false))}
function wkBarrel(g,x,y,z,s){var A=wkMats(),b=new T.Group();s=s||1;var bd=mesh(new T.CylinderGeometry(.38*s,.38*s,.95*s,12),A.wood,true,true);bd.position.y=.48*s;b.add(bd);
  [.15,.8].forEach(function(h){var hp=mesh(new T.TorusGeometry(.39*s,.035,4,16),A.iron,false,false);hp.rotation.x=Math.PI/2;hp.position.y=h*s;b.add(hp)});b.position.set(x,y,z);(g||W).add(b);return b}
/* ---- praia: pedras, algas, conchas, madeira trazida pelo mar, poças ---- */
function wkDecor(th){var A=wkMats(),r=rnd(1919),xe=sceneEnd(),RK=[],SW=[],SH=[],DW=[];
  for(var x=-14;x<(LV.shore||xe);x+=1.4+r()*3){var z=-3.4-r()*5.5;if(LV.ship&&x>LV.ship.x0-2&&x<LV.ship.br+3&&z>-6)z-=4;var y=mY(x,z);
    if(r()<.45)RK.push(xf(new T.DodecahedronGeometry(.25+r()*.5,0),[x,y+.05,z],[r()*3,r()*3,r()*3],[1.2,.6,1]));
    if(r()<.5){for(var k=0;k<4;k++){var sg=new T.ConeGeometry(.05,.5+r()*.5,3);sg.translate(0,.25,0);sg.rotateZ((r()-.5)*1.2);sg.translate(x+r()*.4,y,z+r()*.4);SW.push(sg)}}
    if(r()<.35){var sh=new T.SphereGeometry(.09,6,4,0,Math.PI*2,0,Math.PI/2);sh.scale(1.3,.5,1);sh.translate(x+r(),y+.01,z+2+r());SH.push(sh)}
    if(r()<.12){var dw=new T.CylinderGeometry(.12,.16,1.6+r()*1.6,6);dw.rotateZ(Math.PI/2);dw.rotateY(r()*3);dw.translate(x,y+.12,z);DW.push(dw)}}
  if(RK.length)add(mesh(mgL(RK),M(0x5a5a58,.9,0,{flatShading:true}),true,true));
  if(SW.length)add(mesh(mgL(SW),M(0x3a5a2a,.8),false,false));
  if(SH.length)add(mesh(mgL(SH),M(0xf0dccc,.5),false,false));
  if(DW.length)add(mesh(mgL(DW),A.wood,true,false));
  /* caixotes e barris soltos na areia (enfeite, atrás do caminho) */
  for(var i=0;i<8;i++){var bx=-8+r()*((LV.shore||90)+4);if(LV.ship&&bx>LV.ship.x0-1&&bx<LV.ship.br+3)continue;if(r()<.5)wkBarrel(null,bx,mY(bx,-4.5)-.05,-4.5-r()*2,.9+r()*.3);else{var cb=mesh(boxGeo(1,1,1,1),A.crate,true,true);cb.position.set(bx,mY(bx,-5)+.45,-5-r()*2);cb.rotation.set(0,r()*3,(r()-.5)*.3);add(cb)}}}
/* ---- mar com ondas grandes (mais agitado que o lago) + destroços boiando ao longe ---- */
/* altura do mar: 4 ondas cruzadas (swell + marolas) + a onda gigante que passa; o mesmo cálculo move a água e os destroços */
function wkSeaH(x,z,t){var A=WK.amp||.7,sh=LV.shore||1e9,f=x<sh?clamp((-z-9)/10,.15,1):clamp((x-sh)/6,.35,1)*1;
  var h=(.30*Math.sin(x*.21+z*.05+t*1.5)+.20*Math.sin(x*.11-z*.17-t*1.0)+.12*Math.sin(x*.37+z*.29+t*2.1)+.07*Math.sin(x*.63-z*.41+t*2.8))*A*f;
  var B=WK.big;if(B&&B.on){var d=(x-B.c)/7;h+=B.h*Math.exp(-d*d)*clamp(1-(-z-2)/30,0,1)}return h}
function wkSea(){var wn=auWaveTex(),xe=sceneEnd(),W=xe+260,cx=xe/2,lt=LITE;
  var wm=new T.MeshStandardMaterial({color:0xffffff,roughness:.42,metalness:.05,normalMap:wn[0],normalScale:new T.Vector2(.22,.22),transparent:true,opacity:.95,side:T.DoubleSide});
  /* as ondas são calculadas na placa de vídeo (antes era no processador, ponto por ponto, e o FPS caía) */
  var U={uT:{value:0},uA:{value:.7},uSh:{value:LV.shore||1e9},uBc:{value:0},uBh:{value:0},
    cD:{value:new T.Color(0x0c2c48).convertSRGBToLinear()},cM:{value:new T.Color(0x1a5a86).convertSRGBToLinear()},cTp:{value:new T.Color(0x3d8cae).convertSRGBToLinear()},cF:{value:new T.Color(0xd8e8ee).convertSRGBToLinear()}};WK.U=U;
  wm.onBeforeCompile=function(sh){for(var k in U)sh.uniforms[k]=U[k];
    var fn='uniform float uT,uA,uSh,uBc,uBh;varying float vH;varying float vS;\n'+
      'float seaH(float x,float z){float f=x<uSh?clamp((-z-9.)/10.,.15,1.):clamp((x-uSh)/6.,.35,1.);'+
      'float h=(.30*sin(x*.21+z*.05+uT*1.5)+.20*sin(x*.11-z*.17-uT*1.0)+.12*sin(x*.37+z*.29+uT*2.1)+.07*sin(x*.63-z*.41+uT*2.8))*uA*f;'+
      'float d=(x-uBc)/7.;h+=uBh*exp(-d*d)*clamp(1.-(-z-2.)/30.,0.,1.);return h;}\n';
    sh.vertexShader=fn+sh.vertexShader.replace('#include <beginnormal_vertex>','float sx=position.x,sz=position.z;float h0=seaH(sx,sz),hx=(seaH(sx+.3,sz)-h0)/.3,hz=(seaH(sx,sz+.3)-h0)/.3;vec3 objectNormal=normalize(vec3(-hx,1.,-hz));vH=h0/(uA*.7);vS=length(vec2(hx,hz));')
      .replace('#include <begin_vertex>','vec3 transformed=vec3(position.x,h0,position.z);');
    sh.fragmentShader='uniform vec3 cD,cM,cTp,cF;varying float vH;varying float vS;\n'+sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat u=clamp(vH*.5+.5,0.,1.);vec3 wc=u<.55?mix(cD,cM,u/.55):mix(cM,cTp,(u-.55)/.45);if(u>.82&&vS>.25)wc=mix(wc,cF,clamp((u-.82)*4.,0.,.75));diffuseColor.rgb*=wc;')};
  /* mar lá atrás (atrás da praia) e, depois da praia, também na frente (mais detalhado perto do caminho) */
  var g=new T.PlaneGeometry(W,120,Math.round(W/(lt?3:2)),lt?20:30);g.rotateX(-Math.PI/2);g.translate(cx,0,-68);
  var sh=LV.shore||xe;if(sh<xe){var g2=new T.PlaneGeometry(xe+60-sh,18,Math.round((xe+60-sh)/(lt?1.5:1)),lt?8:12);g2.rotateX(-Math.PI/2);g2.translate(sh+(xe+60-sh)/2,0,1);g=mgL([g,g2])}
  var sea=new T.Mesh(g,wm);sea.position.y=-.35;sea.receiveShadow=true;sea.frustumCulled=false;add(sea);
  wn[0].repeat.set(1/9,1/9);WK.sea={m:sea,base:g.attributes.position.array.slice(),wave:wn};
  (function(){var uv=g.attributes.uv,pp=g.attributes.position;for(var i=0;i<uv.count;i++)uv.setXY(i,pp.getX(i),pp.getZ(i))})();/* textura pelas coordenadas do mundo */
  WK.cDeep=new T.Color(0x0c2c48).convertSRGBToLinear();WK.cMid=new T.Color(0x1a5a86).convertSRGBToLinear();WK.cTop=new T.Color(0x3d8cae).convertSRGBToLinear();WK.cFoam=new T.Color(0xd8e8ee).convertSRGBToLinear();/* cores da água em linear (vertex color) */
  /* espuma na beira da praia */
  var fm=new T.Mesh(new T.PlaneGeometry((LV.shore||xe)+30,1.6),new T.MeshBasicMaterial({color:0xe8f0f4,transparent:true,opacity:.45,depthWrite:false}));fm.rotation.x=-Math.PI/2;fm.position.set(((LV.shore||xe)-30)/2+8,-.2,-11);add(fm);WK.foam=fm;
  /* destroços ao longe, boiando */
  var A=wkMats(),r=rnd(3131);WK.far=[];for(var i=0;i<26;i++){var x=-30+r()*(xe+80),z=-18-r()*50,o;
    if(r()<.4)o=wkBarrel(null,x,-.5,z,1.3);else{o=mesh(boxGeo(1.4+r()*2.6,.25,.5+r(),1),A.deck,false,false);add(o)}
    o.position.set(x,-.35,z);o.rotation.y=r()*3;WK.far.push({o:o,x:x,z:z,ph:r()*6})}
  /* a outra metade do navio, lá longe no mar (a popa) */
  var pp=new T.Group(),hb=mesh(boxGeo(9,6,5,1),A.hull,false,false);hb.position.y=1.5;pp.add(hb);var tw=mesh(boxGeo(5,3,5,1),A.hull,false,false);tw.position.set(2,6,0);pp.add(tw);
  var m2=mesh(new T.CylinderGeometry(.2,.26,12,8),A.wood,false,false);m2.position.set(-1.5,9,0);pp.add(m2);pp.position.set((LV.shore||100)+60,-1.2,-48);pp.rotation.set(.05,.4,.12);add(pp);WK.stern=pp}
/* ---- chuva e raios ---- */
function wkStorm(){var n=LITE?260:520,pos=new Float32Array(n*6);WK.rainN=n;
  for(var i=0;i<n;i++){var x=(Math.random()-.5)*50,y=Math.random()*26-6,z=(Math.random()-.5)*20;pos.set([x,y,z,x-.25,y-1.1,z],i*6)}
  var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));
  var rn=new T.LineSegments(g,new T.LineBasicMaterial({color:0xc8d8e8,/* preso à fase */transparent:true,opacity:.45,depthWrite:false}));rn.frustumCulled=false;add(rn);WK.rain=rn;
  /* raio (zigue-zague) lá no fundo e o clarão */
  var bm=new T.MeshBasicMaterial({color:0xeef4ff,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending,fog:false});WK.boltM=bm;WK.bolt=new T.Group();add(WK.bolt);
  WK.flash=0;WK.next=3+Math.random()*4;WK.hemi0=hemi.intensity;WK.sun0=null}
function wkBolt(){var g=WK.bolt;while(g.children.length){var c=g.children.pop();c.geometry.dispose()}
  var x=cam.x+(Math.random()-.5)*60,z=-70-Math.random()*40,y=50,pts=[];while(y>-1){pts.push(new T.Vector3(x,y,z));x+=(Math.random()-.5)*7;y-=3+Math.random()*4}pts.push(new T.Vector3(x,-.4,z));
  for(var i=0;i<pts.length-1;i++){var a=pts[i],b=pts[i+1],c2=new T.CylinderGeometry(.35,.35,a.distanceTo(b),4),m=new T.Mesh(c2,WK.boltM);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());g.add(m)}}
function wkBuild(th){WK={t:0,hulls:[],push:0,tilt:0};wkMats();if(LV.ship)wkShip(LV.ship);wkSea();wkStorm();wkPart2Build();wkPart3Build()}
function wkUpd(dt){if(!WK)return;WK.t+=dt;var t=WK.t;wkPart2Upd(dt);wkPart3Upd(dt);
  /* intensidade da tempestade: vai e volta ao longo da fase */
  var I=.55+.45*Math.sin(t*.09)*Math.sin(t*.031+1);WK.I=I;
  /* ondas: o mar sobe e desce (vértices) e a textura anda */
  WK.amp=(.55+I*.35)*(1-(WK.calm||0)*.6);
  if(WK.U){var U=WK.U,B=WK.big;U.uT.value=t;U.uA.value=WK.amp;U.uBc.value=B&&B.on?B.c:-1e4;U.uBh.value=B&&B.on?B.h:0}
  if(WK.lastTm===tm)return;WK.lastTm=tm;var i;dt=WK.vT===undefined?dt:Math.min(.1,t-WK.vT);WK.vT=t;/* tempo desde o último quadro desenhado *//* daqui para baixo é só visual: uma vez por quadro (a física roda 90 vezes por segundo) */
  if(WK.sea)WK.sea.wave[0].offset.set(t*.04,t*.06);
  if(WK.foam){WK.foam.material.opacity=.3+Math.sin(t*1.1)*.15;WK.foam.position.z=-11+Math.sin(t*1.1)*.6}
  (WK.far||[]).forEach(function(f){f.o.position.y=-.45+wkSeaH(f.x,f.z,t);f.o.rotation.z=Math.sin(t+f.ph)*.15;f.o.rotation.x=Math.cos(t*.8+f.ph)*.1});
  if(WK.stern)WK.stern.rotation.z=.12+Math.sin(t*.7)*.04;
  if(WK.jolly){var J=WK.jolly,pa=J.m.geometry.attributes.position,bs=J.base;for(var q=0;q<pa.count;q++){var xx=bs[q*3];pa.array[q*3+2]=Math.sin(xx*2.6-t*7)*.16*xx/1.8;pa.array[q*3+1]=bs[q*3+1]-xx*xx*.04}pa.needsUpdate=true;J.m.rotation.y=-.3+Math.sin(t*.8)*.15}
  if(WK.sail){WK.sail.rotation.x=-(.03+(.5+.5*Math.sin(t*2.2))*.07*I)}/* a vela estufa com o vento (sem girar para dentro das cordas) */
  /* chuva inclinada pelo vento, segue a câmera */
  var rn=WK.rain;if(rn){var p=rn.geometry.attributes.position.array,sp=26*dt,wx=-(5+I*5)*dt;for(i=0;i<p.length;i+=6){p[i+1]-=sp;p[i+4]-=sp;p[i]+=wx;p[i+3]+=wx;if(p[i+1]<-7){var nx=(Math.random()-.5)*50,ny=19+Math.random()*4;p[i]=nx;p[i+1]=ny;p[i+3]=nx-.25-I*.3;p[i+4]=ny-1.1}}
    rn.geometry.attributes.position.needsUpdate=true;rn.position.set(cam.x,cam.y,2);rn.material.opacity=(.2+I*.35)*(1-(WK.calm||0)*.95)}
  /* raios: mais frequentes quando a tempestade aperta */
  WK.next-=dt;if(WK.next<=0){WK.next=(4+Math.random()*7)*(1.6-I);WK.flash=1;wkBolt();var dly=.25+Math.random()*1.2;setTimeout(function(){try{noise(1.4,.09*(.5+I*.5),180,'lowpass');noise(.4,.06,500,'lowpass')}catch(er){}},dly*1000)}
  if(WK.flash>0){WK.flash=Math.max(0,WK.flash-dt*2.6);var f=WK.flash,fl=f>.6?1:(f>.4?.3:(f>.25?.9:f));hemi.intensity=WK.hemi0*(1+fl*1.8);WK.boltM.opacity=fl}else{hemi.intensity=WK.hemi0;WK.boltM.opacity=0}}
function wkReset(){if(!WK)return;movers.forEach(function(m){if(m.brk>0||m.dead){m.brk=0;m.dead=false;m.mesh.visible=true;m.mesh.scale.setScalar(1);m.grow=0}});if(WK.sbM)WK.sbM.opacity=0;wkBossReset();WK.push=0;if(WK.strike){WK.strike.st=0;WK.strike.t=4}if(WK.gust){WK.gust.on=0;WK.gust.warn=0;WK.gust.t=6}}
/* ---- bichos: caranguejo e gaivota ---- */
function makeCrab(){var g=new T.Group(),inner=new T.Group();g.add(inner);var sh=M(0xd0502a,.5,.1),dk=M(0x8a2a14,.6),wh=M(0xffffff,.3),bl=M(0x111111,.3);
  var bd=mesh(new T.SphereGeometry(.42,16,10),sh,true,false);bd.scale.set(1.25,.6,.9);bd.position.y=.42;inner.add(bd);
  [-1,1].forEach(function(sd){var st=mesh(new T.CylinderGeometry(.03,.03,.25,5),dk,false,false);st.position.set(sd*.14,.7,.25);inner.add(st);
    var ey=mesh(new T.SphereGeometry(.075,8,6),wh,false,false);ey.position.set(sd*.14,.84,.27);inner.add(ey);var pu=mesh(new T.SphereGeometry(.04,6,5),bl,false,false);pu.position.set(sd*.14,.85,.33);inner.add(pu);
    var ar=new T.Group();ar.position.set(sd*.42,.45,.25);inner.add(ar);var a1=mesh(new T.CylinderGeometry(.06,.06,.3,6),sh,false,false);a1.rotation.z=sd*1.1;a1.position.set(sd*.1,0,0);ar.add(a1);
    var cl=mesh(new T.SphereGeometry(.16,10,8),sh,true,false);cl.scale.set(1,1.3,.8);cl.position.set(sd*.25,.12,.05);ar.add(cl);var cl2=mesh(new T.ConeGeometry(.06,.2,5),dk,false,false);cl2.position.set(sd*.27,.32,.05);ar.add(cl2)});
  var legs=[],lg=new T.CylinderGeometry(.035,.025,.45,5);lg.translate(0,-.22,0);
  [-.15,0,.15].forEach(function(z0){[-1,1].forEach(function(sd){var q=new T.Group();q.position.set(sd*.42,.4,z0-.05);q.rotation.z=sd*.9;q.add(mesh(lg,dk,false,false));inner.add(q);legs.push({p:q,sd:sd,z:z0,base:sd*.9})})});
  add(g);return {g:g,inner:inner,legs:legs,shellM:sh,legM:dk,crab:1}}
function makeGull(){var g=new T.Group(),inner=new T.Group();g.add(inner);var wh=M(0xf4f6f8,.6),gy=M(0x8a96a4,.6),yl=M(0xf0b030,.4),bl=M(0x111111,.3);
  var bd=mesh(new T.SphereGeometry(.24,12,8),wh,true,false);bd.scale.set(.8,.75,1.5);inner.add(bd);
  var hd=mesh(new T.SphereGeometry(.15,10,8),wh,true,false);hd.position.set(0,.12,.36);inner.add(hd);
  var bk=mesh(new T.ConeGeometry(.04,.18,6),yl,false,false);bk.rotation.x=Math.PI/2;bk.position.set(0,.09,.54);inner.add(bk);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.025,6,5),bl,false,false);ey.position.set(sd*.08,.16,.45);inner.add(ey)});
  var tl=mesh(new T.ConeGeometry(.1,.25,4),gy,false,false);tl.rotation.x=-Math.PI/2;tl.position.z=-.42;inner.add(tl);
  var wings=[];[-1,1].forEach(function(sd){var p=new T.Group();p.position.set(sd*.15,.08,0);inner.add(p);var w=mesh(new T.BoxGeometry(.8,.04,.34),gy,false,false);w.position.x=sd*.4;p.add(w);var tp=mesh(new T.BoxGeometry(.3,.045,.3),bl,false,false);tp.position.x=sd*.78;p.add(tp);wings.push({p:p,sd:sd})});
  add(g);return {g:g,inner:inner,wings:wings}}
/* ===================== parte 2: mar aberto — destroços levados pelas ondas, barris que rolam, vento, raios com aviso, onda gigante ===================== */
/* desenho de cada destroço (as plataformas que boiam são movers; as grandes, do casco, ficam paradas) */
function wkDebrisMesh(w,kind){var A=wkMats(),g=new T.Group();
  if(kind==='barrel'){var b=new T.Group();g.add(b);var bd=mesh(new T.CylinderGeometry(.62,.62,1.5,14),A.wood,true,true);bd.rotation.x=Math.PI/2;b.add(bd);
    [-.5,.5].forEach(function(z){var hp=mesh(new T.TorusGeometry(.63,.045,4,18),A.iron,false,false);hp.position.z=z;b.add(hp)});
    b.position.y=-.62;g.userData.roll=b;return g}
  if(kind==='crate'){var c=mesh(boxGeo(w,w*.85,1.7,1.4),A.crate,true,true);c.position.y=-w*.42;g.add(c);
    var st=mesh(new T.BoxGeometry(w-.1,.1,.06),A.dark,false,false);st.position.set(0,-.1,.86);g.add(st);var dg=mesh(new T.BoxGeometry(Math.hypot(w,w*.85)*.9,.09,.06),A.dark,false,false);dg.rotation.z=Math.atan2(w*.85,w);dg.position.set(0,-w*.42,.86);g.add(dg);return g}
  if(kind==='door'){var d=mesh(boxGeo(w,.22,1.6,1),A.hull,true,true);d.position.y=-.11;g.add(d);[-1,1].forEach(function(sd){var hg=mesh(new T.BoxGeometry(.5,.05,.12),A.iron,false,false);hg.position.set(sd*(w/2-.4),.01,.55);g.add(hg)});
    var rg=mesh(new T.TorusGeometry(.12,.03,5,10),A.iron,false,false);rg.rotation.x=Math.PI/2;rg.position.set(0,.03,-.2);g.add(rg);return g}
  /* tábuas amarradas */
  var n=Math.max(2,Math.round(w/.55));for(var i=0;i<n;i++){var pl=mesh(boxGeo(w/n-.05,.2,1.9-((i*7)%3)*.2,1),A.deck,true,true);pl.position.set(-w/2+(i+.5)*w/n,-.1,((i*5)%3-1)*.06);g.add(pl)}
  [-.55,.55].forEach(function(z){var tr=mesh(new T.BoxGeometry(w+.1,.1,.18),A.dark,false,false);tr.position.set(0,-.24,z);g.add(tr)});return g}
/* pedaço grande do casco saindo da água (parado: dá para ficar em pé com calma) */
function wkHullPiece(s){var A=wkMats(),x0=s[0],x1=s[1],top=s[2],w=x1-x0,cx=(x0+x1)/2,g=new T.Group(),r=rnd((x0*13)|0);
  var h=top+2.2,b=mesh(boxGeo(w,h,3.2,1),A.hull,true,true);b.position.set(0,top-h/2,-.6);g.add(b);
  var dk=mesh(boxGeo(w-.1,.1,3.1,1),A.deck,false,true);dk.position.set(0,top+.02,-.6);g.add(dk);
  for(var i=0;i<4;i++){var lc=mesh(new T.BoxGeometry(.4+r()*.6,.1,.3),A.deck,false,false);lc.position.set(-w/2+r()*w,top-.2-r()*1.2,1.05);lc.rotation.z=(r()-.5)*1.4;g.add(lc)}
  var rb=mesh(new T.BoxGeometry(.18,1.6,.18),A.dark,true,false);rb.position.set(w/2-.3,top+.5,-1.8);rb.rotation.z=-.3;g.add(rb);
  for(var x=-w/2+.4;x<w/2;x+=2.4){var pst=mesh(new T.BoxGeometry(.14,.5,.14),A.dark,false,false);pst.position.set(x,top+.25,.95);g.add(pst)}
  if(w>5)wkBarrel(g,-w/2+1.2,top,-1.6,.9);
  g.position.set(cx,0,0);add(g);WK.hulls.push({g:g,ph:r()*6});solids.push({l:x0,r:x1,t:top,b:-14,oneway:false})}
function wkPart2Build(){WK.hulls=[];WK.warn=[];
  (LV.hullp||[]).forEach(wkHullPiece);
  movers.forEach(function(m,i){m.top0=m.t;m.lift=0;m.k=m.kind||'plank';if(m.k==='barrel')m.slip=true});
  /* marca do raio (círculo brilhando onde vai cair) */
  var rm=new T.Mesh(new T.RingGeometry(.5,.95,24),new T.MeshBasicMaterial({color:0xfff2a0,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));rm.rotation.x=-Math.PI/2;add(rm);WK.mark=rm;
  var mk=new T.Mesh(new T.CylinderGeometry(.06,.06,14,6),new T.MeshBasicMaterial({color:0xfff6c0,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending}));mk.geometry.translate(0,7,0);add(mk);WK.mbeam=mk;
  /* setas de vento (aviso) */
  var wc=document.createElement('canvas');wc.width=128;wc.height=64;var x=wc.getContext('2d');x.strokeStyle='#fff';x.lineWidth=7;x.lineCap='round';
  [[16,20,100],[30,44,112],[10,8+60,70]].forEach(function(q,k){x.beginPath();x.moveTo(q[2],q[1]-(k===2?52:0));x.quadraticCurveTo(q[0]+40,q[1]-12-(k===2?52:0),q[0],q[1]-(k===2?52:0));x.stroke()});
  var wt=new T.CanvasTexture(wc);WK.wind=[];for(var i=0;i<6;i++){var sp=new T.Sprite(new T.SpriteMaterial({map:wt,transparent:true,opacity:0,depthWrite:false}));sp.scale.set(2.4,1.2,1);add(sp);WK.wind.push({s:sp,o:Math.random()*30,y:Math.random()*6})}
  WK.gust={t:6,on:0,warn:0};WK.strike={t:5,st:0};WK.big={t:20,a:0};WK.chips=[];
  WK.sbM=new T.MeshBasicMaterial({color:0xf2f6ff,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending,fog:false});WK.sbG=new T.SpriteMaterial({map:softSprite(),color:0xbcd0ff,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:1});
  WK.sbolt=new T.Group();add(WK.sbolt);Object.defineProperty(WK.sbG,'opacity',{get:function(){return WK.sbM.opacity},set:function(){}})}
var WK_FB={plank:.1,door:.08,crate:.42,barrel:.3};/* quanto de cada destroço fica acima da água */
function wkWaveY(x,t){return (Math.sin(x*.16+t*1.3)*.35+Math.sin(x*.07-t*.8)*.25)*(.6+(WK.I||.5)*.6)}
function wkPart2Upd(dt){var t=WK.t,P2=LV.part2||1e9,inP2=P.x>P2-4&&P.x<(LV.stern?LV.stern.x0-2:1e9);
  if(state==='play'&&P.x>(LV.shore||1e9)&&P.y<-.45&&(WK.py===undefined||WK.py>=-.45)){splashFx(P.x,-.35,16);try{sfx.splash()}catch(er){}}WK.py=P.y;/* caiu no mar */
  /* onda gigante: de vez em quando todos os destroços sobem juntos (aviso antes) */
  var B=WK.big;B.t-=dt;if(B.t<=0&&!B.on){B.on=1;B.u=0;B.c0=cam.x+26;if(inP2){toast('Onda gigante! Ela vem levantando os destroços');try{noise(1.6,.08,250,'lowpass')}catch(er){}}}
  if(B.on){B.u+=dt/6;B.c=B.c0-B.u*52;B.h=1.6*Math.min(1,Math.sin(Math.min(1,B.u)*Math.PI)*2.2);if(B.u>=1){B.on=0;B.t=22+Math.random()*10}}/* a onda gigante atravessa a tela da direita para a esquerda */
  /* destroços: sobem e descem com as ondas, a corrente leva (movers), afundam um pouco com o peso do Kuro */
  movers.forEach(function(m,i){if(m.top0===undefined){m.top0=m.t;m.k=m.kind||'plank';if(m.k==='barrel')m.slip=true}var on=P.grounded&&P.onPlat===m;m.sk=(m.sk||0)+((on?.15:0)-(m.sk||0))*Math.min(1,dt*5);
    var fb=WK_FB[m.k]||.12,y=-.35+wkSeaH(m.x,0,t)+fb-m.sk,sl=(wkSeaH(m.x+.5,0,t)-wkSeaH(m.x-.5,0,t));m.t=y;m.b=y-.45;m.mesh.position.y=y;m.mesh.rotation.z=Math.atan(sl)*.8;/* boia na água: só um pouco fica de fora, inclina com a onda */
    if(m.k==='barrel'){var r=m.mesh.userData.roll;if(r){if(on){P.x+=Math.sin(t*2.3+i)*1.4*dt;r.rotation.z-=Math.cos(t*2.3+i)*1.4*dt/.62}else r.rotation.z+=dt*.3}}
    if(on)P.y=y});
  WK.hulls.forEach(function(h){h.g.rotation.z=Math.sin(t*.6+h.ph)*.006});
  /* rajadas de vento (empurram o Kuro para trás) */
  var G=WK.gust;G.t-=dt;WK.push=0;
  if(G.t<=0){if(G.on){G.on=0;G.warn=0;G.t=7+Math.random()*4}else if(G.warn){G.on=1;G.t=2.6}else{G.warn=1;G.t=1.3;if(inP2&&!WK.toldW){WK.toldW=1;toast('Ventania! Quando as setas aparecerem, segure firme')}}}
  if(G.on&&inP2&&state==='play')WK.push=-3.2;
  WK.wind.forEach(function(w,k){var vis=inP2&&(G.warn||G.on);w.o-=dt*(G.on?18:6);if(w.o<-14)w.o+=28;w.s.position.set(cam.x+w.o,cam.y-2+w.y,1.5);w.s.material.opacity+=((vis?(G.on?.7:.45):0)-w.s.material.opacity)*Math.min(1,dt*6)});
  /* raio com aviso: um círculo brilha no destroço onde vai cair; 1 s depois cai */
  var S=WK.strike;S.t-=dt;
  if(S.st===0&&S.t<=0&&inP2&&state==='play'){var c=null,bd=1e9;movers.forEach(function(m){var d=m.x-P.x;if(d>-1&&d<9&&Math.abs(d-3)<bd){bd=Math.abs(d-3);c=m}});if(c){S.st=1;S.t=1.1;S.m=c}else S.t=1}
  if(S.st===1){var m=S.m;WK.mark.position.set(m.x,m.t+.05,0);WK.mark.material.opacity=.4+.5*Math.abs(Math.sin(t*14));WK.mbeam.material.opacity=0;
    if(S.t<=0){S.st=2;S.t=.45;WK.flash=1;wkStrikeBolt(m.x,m.t);try{noise(1.1,.16,260,'lowpass');noise(.25,.1,3000,'highpass');beep(70,.4,'sawtooth',.06)}catch(er){}shake=Math.max(shake,.35);
      emit(sparkPool,m.x,m.t+.3,30,6,.8,.35,.2,3);if(state==='play'&&Math.abs(P.x-m.x)<1.3&&Math.abs(P.y-m.t)<1.6)hurt(m.x);wkShatter(m)}}
  if(S.st===2){var k=S.t/.45;WK.sbM.opacity=k>.7?1:(k>.5?.25:(k>.35?.9:k*1.5));WK.mark.material.opacity=0;if(S.t<=0){S.st=0;S.t=4+Math.random()*4;WK.sbM.opacity=0}}
  else if(S.st===0){WK.mark.material.opacity=0;WK.mbeam.material.opacity=0}
  /* destroço despedaçado: lascas voando; volta a boiar depois */
  movers.forEach(function(m){if(m.brk>0){m.brk-=dt;if(m.brk<=0){m.dead=false;m.mesh.visible=true;m.mesh.scale.setScalar(.05);m.grow=1}}else if(m.grow){var sc=Math.min(1,m.mesh.scale.x+dt*1.6);m.mesh.scale.setScalar(sc);if(sc>=1)m.grow=0}});
  for(var i=WK.chips.length-1;i>=0;i--){var c=WK.chips[i];c.t+=dt;c.vy-=16*dt;c.m.position.x+=c.vx*dt;c.m.position.y+=c.vy*dt;c.m.position.z+=c.vz*dt;c.m.rotation.x+=c.rx*dt;c.m.rotation.z+=c.rz*dt;
    if(c.m.position.y<-.4&&!c.s){c.s=1;splashFx(c.m.position.x,-.35,3);c.vy*=.1;c.vx*=.3}if(c.t>2.2){if(c.m.parent)c.m.parent.remove(c.m);WK.chips.splice(i,1)}}
  /* Kuro molhado na chuva (seca no porão coberto e perto da ilha, quando a chuva para) */
  var cov=LV.stern&&P.x>LV.stern.x0&&P.x<LV.stern.wall&&P.y<LV.stern.deck-.5;var rn=state==='play'&&!cov&&(1-(WK.calm||0))>.3?(.6+(WK.I||.5)*.6):-1;if(typeof kuroWetUpd==='function')kuroWetUpd(dt,rn)}
/* raio de verdade (zigue-zague com galhos) do céu até o destroço */
function wkStrikeBolt(x,y){var g=WK.sbolt;while(g.children.length){var c=g.children.pop();c.geometry.dispose()}
  function seg(a,b,w){var c2=new T.CylinderGeometry(w,w,a.distanceTo(b),4),m=new T.Mesh(c2,WK.sbM);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());g.add(m)}
  var px=x+(Math.random()-.5)*4,py=y+22,pts=[new T.Vector3(px,py,-1)];while(py>y+.3){py-=1+Math.random()*1.6;px+=(Math.random()-.5)*1.6;px+=(x-px)*.18;pts.push(new T.Vector3(px,Math.max(y,py),-.2))}pts[pts.length-1].set(x,y,0);
  for(var i=0;i<pts.length-1;i++){seg(pts[i],pts[i+1],.09);if(Math.random()<.35&&i>1){var a=pts[i],bx=a.x+(Math.random()-.5)*5,b=new T.Vector3(bx,a.y-2-Math.random()*2,-.4);seg(a,b,.045)}}
  var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xdfe8ff,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));gl.material=WK.sbG;gl.scale.set(6,6,1);gl.position.set(x,y+.3,.2);g.add(gl)}
/* o destroço quebra em lascas */
function wkShatter(m){var A=wkMats();m.dead=true;m.mesh.visible=false;m.brk=4.5;if(P.onPlat===m){P.grounded=false;P.onPlat=null}
  for(var i=0;i<10;i++){var w=.25+Math.random()*.5,ch=mesh(new T.BoxGeometry(w,.1,.18),m.k==='barrel'||m.k==='crate'?A.wood:A.deck,false,false);ch.position.set(m.x+(Math.random()-.5)*m.w,m.t,(Math.random()-.5)*.8);add(ch);
    WK.chips.push({m:ch,t:0,vx:(Math.random()-.5)*7,vy:4+Math.random()*6,vz:(Math.random()-.5)*3,rx:(Math.random()-.5)*14,rz:(Math.random()-.5)*14})}
  emit(dustPool,m.x,m.t+.2,14,3,.8,.8,1.2,-.4)}
/* ===================== parte 3: a popa boiando (porão alagado + luta com o Capitão Corvo-Pirata) e a ilha ===================== */
function wkStern(S){var A=wkMats(),g=new T.Group(),x0=S.x0,x1=S.x1,w=x1-x0,cx=(x0+x1)/2,r=rnd(5151),D=5.2,Zc=-.25;
  /* casco de baixo (sai da água) e parede do fundo; a frente do porão fica aberta (dá para ver lá dentro) */
  var lo=mesh(boxGeo(w,2.6,D,1),A.hull,true,true);lo.position.set(cx,S.floor-1.3,Zc);g.add(lo);
  var bk=mesh(boxGeo(w,S.deck-S.floor,.3,1),A.hull,true,true);bk.position.set(cx,(S.deck+S.floor)/2,Zc-D/2+.15);g.add(bk);
  var fl=mesh(boxGeo(S.wall-x0,.12,D-.4,1),A.deck,false,true);fl.position.set((x0+S.wall)/2,S.floor+.06,Zc);g.add(fl);
  var wtr=new T.Mesh(new T.PlaneGeometry(S.wall-x0,D-.5),new T.MeshStandardMaterial({color:0x1a4a66,roughness:.2,transparent:true,opacity:.55,depthWrite:false}));wtr.rotation.x=-Math.PI/2;wtr.position.set((x0+S.wall)/2,S.floor+.16,Zc);g.add(wtr);WK.bilge=wtr;/* água dentro do porão */
  var low=mesh(boxGeo(S.wall-x0,.55,.25,1),A.hull,true,false);low.position.set((x0+S.wall)/2,S.floor+.27,Zc+D/2-.12);g.add(low);/* murinho da frente (baixo) */
  for(var x=x0+2;x<S.wall;x+=3.4){var po=mesh(new T.BoxGeometry(.25,S.deck-S.floor,.25),A.dark,true,false);po.position.set(x,(S.deck+S.floor)/2,Zc+D/2-.12);g.add(po)}/* colunas da frente */
  /* convés (tampa) e a parede de baixo do lado direito (parte da luta) */
  /* convés com o buraco do alçapão aberto de verdade (dá para ver o porão lá embaixo) */
  [[x0,S.hatch[0]],[S.hatch[1],x1]].forEach(function(q){var dk=mesh(boxGeo(q[1]-q[0],.4,D,1),A.deck,true,true);dk.position.set((q[0]+q[1])/2,S.deck-.2,Zc);g.add(dk)});
  [-1,1].forEach(function(sd){var sdk=mesh(boxGeo(S.hatch[1]-S.hatch[0],.4,.9,1),A.deck,true,true);sdk.position.set((S.hatch[0]+S.hatch[1])/2,S.deck-.2,Zc+sd*(D/2-.45));g.add(sdk)});
  [S.hatch[0],S.hatch[1]].forEach(function(hx){var fr=mesh(new T.BoxGeometry(.18,.16,D-1.6),A.dark,false,false);fr.position.set(hx,S.deck+.05,Zc);g.add(fr)});/* moldura do alçapão */
  var rw=mesh(boxGeo(x1-S.wall,S.deck-S.floor,D,1),A.hull,true,true);rw.position.set((S.wall+x1)/2,(S.deck+S.floor)/2,Zc);g.add(rw);

  /* amurada de trás e postinhos na frente do convés */
  var bw=mesh(boxGeo(w,.9,.2,1),A.hull,true,false);bw.position.set(cx,S.deck+.45,Zc-D/2+.1);g.add(bw);
  for(x=x0+.5;x<x1;x+=2.2){var ps=mesh(new T.BoxGeometry(.14,.5,.14),A.dark,false,false);ps.position.set(x,S.deck+.25,Zc+D/2-.1);g.add(ps)}
  /* tombadilho (onde fica o capitão), escada para ele e janelas da popa */
  var pp=mesh(boxGeo(x1-S.poop,S.ptop-S.deck,D,1),A.hull,true,true);pp.position.set((S.poop+x1)/2,(S.ptop+S.deck)/2,Zc);g.add(pp);
  var pt=mesh(boxGeo(x1-S.poop,.12,D,1),A.deck,false,true);pt.position.set((S.poop+x1)/2,S.ptop+.06,Zc);g.add(pt);
  for(var k=0;k<3;k++){var wn=mesh(new T.PlaneGeometry(.8,1),new T.MeshStandardMaterial({color:0xffd890,emissive:new T.Color(0xff9a30),emissiveIntensity:1.6}),false,false);wn.position.set(S.poop+1.3+k*2.2,S.deck+1.2,Zc+D/2+.01);g.add(wn)}
  var rl=mesh(boxGeo(x1-S.poop,.7,.15,1),A.hull,false,false);rl.position.set((S.poop+x1)/2,S.ptop+.35,Zc-D/2+.1);g.add(rl);
  (S.steps||[]).forEach(function(q){var st=mesh(boxGeo(q[1]-q[0],q[2]-S.deck,D-.8,1),A.deck,true,true);st.position.set((q[0]+q[1])/2,(q[2]+S.deck)/2,Zc-.3);g.add(st)});
  /* mastro quebrado com vela rasgada (atrás do caminho), lanterna do topo e o canhão do capitão */
  var ms=mesh(new T.CylinderGeometry(.2,.26,9,10),A.wood,true,false);ms.position.set(S.mast,S.deck+4.5,Zc-1.8);g.add(ms);var tp=mesh(new T.ConeGeometry(.2,.7,6),A.wood,false,false);tp.position.set(S.mast+.1,S.deck+9.2,Zc-1.8);tp.rotation.z=.5;g.add(tp);
  var sl=new T.Mesh(new T.PlaneGeometry(4,4.2,6,6),A.sail);var sa=sl.geometry.attributes.position;for(k=0;k<sa.count;k++)sa.setZ(k,Math.sin(sa.getY(k)*1.2)*.25);sl.geometry.computeVertexNormals();sl.position.set(S.mast+2.1,S.deck+5.6,Zc-2.05);g.add(sl);
  var ln=mesh(new T.CylinderGeometry(.22,.28,.6,8),new T.MeshStandardMaterial({color:0xffe0a0,emissive:new T.Color(0xffa040),emissiveIntensity:2}),false,false);ln.position.set(x1-.5,S.ptop+1.6,Zc-D/2+.4);g.add(ln);
  var lp=mesh(new T.CylinderGeometry(.06,.06,1.3,6),A.dark,false,false);lp.position.set(x1-.5,S.ptop+.65,Zc-D/2+.4);g.add(lp);
  var cn=new T.Group(),tb=mesh(new T.CylinderGeometry(.22,.3,1.9,10),A.iron,true,false);tb.rotation.z=Math.PI/2;tb.position.y=.55;cn.add(tb);var cr=mesh(new T.BoxGeometry(1.1,.4,.8),A.wood,true,false);cr.position.y=.2;cn.add(cr);
  cn.position.set(S.poop+1.2,S.ptop,Zc-1.4);g.add(cn);WK.cannon=cn;
  /* dentro do porão: lanternas, caixas e barris, buracos com água entrando */
  for(x=x0+3;x<S.wall-1;x+=5.5){var lt=mesh(new T.SphereGeometry(.18,8,6),new T.MeshStandardMaterial({color:0xffe0a0,emissive:new T.Color(0xffa040),emissiveIntensity:2.2}),false,false);lt.position.set(x,S.deck-1.2,Zc-D/2+.5);g.add(lt);
    var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffa040,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.55}));gl.scale.set(3.2,3.2,1);gl.position.copy(lt.position);g.add(gl)}
  for(k=0;k<6;k++){var bx=x0+2+r()*(S.wall-x0-4);if(r()<.5)wkBarrel(g,bx,S.floor,Zc-1.6-r()*.4,.85);else{var cb=mesh(boxGeo(1,1,1,1),A.crate,true,true);cb.position.set(bx,S.floor+.5,Zc-1.7);cb.rotation.y=r();g.add(cb)}}
  WK.leaks=[];for(k=0;k<3;k++){var hx=x0+5+k*8.5,hl=mesh(new T.CircleGeometry(.35,10),M(0x060504,.9),false,false);hl.position.set(hx,S.floor+2.2,Zc-D/2+.32);g.add(hl);WK.leaks.push({x:hx,y:S.floor+2.2,z:Zc-D/2+.4})}
  add(g);WK.sternG=g}
/* o Capitão Corvo-Pirata (criação própria): corvo de casaca vermelha, chapéu de três pontas, tapa-olho e sabre */
function makeCaptain(){var g=new T.Group(),inner=new T.Group();g.add(inner);var bl=M(0x1c1e26,.6),coat=M(0xa8282a,.6),gold=M(0xe8b030,.3,.6),bk=M(0xf0b030,.4),wh=M(0xf4f4f4,.4),dk=M(0x0c0c10,.4);
  var bd=mesh(new T.SphereGeometry(.55,16,12),coat,true,false);bd.scale.set(1,1.25,.85);bd.position.y=1.05;inner.add(bd);
  var bl2=mesh(new T.SphereGeometry(.42,14,10),bl,false,false);bl2.scale.set(.8,1,.5);bl2.position.set(0,1.1,.3);inner.add(bl2);
  for(var k=0;k<3;k++){var bt=mesh(new T.SphereGeometry(.05,6,5),gold,false,false);bt.position.set(.2,.85+k*.25,.42);inner.add(bt)}
  var belt=mesh(new T.TorusGeometry(.5,.07,6,18),dk,false,false);belt.rotation.x=Math.PI/2;belt.scale.set(1,.85,1);belt.position.y=.72;inner.add(belt);
  var hd=new T.Group();hd.position.y=1.95;inner.add(hd);var hs=mesh(new T.SphereGeometry(.38,14,10),bl,true,false);hd.add(hs);
  var bkk=mesh(new T.ConeGeometry(.14,.55,8),bk,false,false);bkk.rotation.x=Math.PI/2;bkk.position.set(0,-.05,.5);hd.add(bkk);
  var ey=mesh(new T.SphereGeometry(.08,8,6),wh,false,false);ey.position.set(.17,.08,.3);hd.add(ey);var pu=mesh(new T.SphereGeometry(.04,6,5),dk,false,false);pu.position.set(.19,.08,.37);hd.add(pu);
  var pat=mesh(new T.CircleGeometry(.1,10),dk,false,false);pat.position.set(-.17,.08,.35);hd.add(pat);var st=mesh(new T.TorusGeometry(.38,.015,4,20),dk,false,false);st.rotation.set(.2,0,.5);hd.add(st);
  var hat=new T.Group();hat.position.y=.32;hd.add(hat);var brim=new T.CylinderGeometry(.62,.62,.08,3);var bm=mesh(brim,dk,true,false);bm.rotation.y=Math.PI/2;hat.add(bm);
  var crown=mesh(new T.CylinderGeometry(.3,.36,.4,12),dk,true,false);crown.position.y=.22;hat.add(crown);var tr=mesh(new T.TorusGeometry(.33,.03,4,16),gold,false,false);tr.rotation.x=Math.PI/2;tr.position.y=.07;hat.add(tr);
  var fe=mesh(new T.ConeGeometry(.07,.7,5),coat,false,false);fe.position.set(-.2,.45,-.1);fe.rotation.z=.6;hat.add(fe);
  var arms=[];[-1,1].forEach(function(sd){var p=new T.Group();p.position.set(sd*.55,1.4,0);inner.add(p);var a=mesh(new T.CylinderGeometry(.11,.13,.75,8),coat,true,false);a.position.y=-.35;p.add(a);var cf=mesh(new T.CylinderGeometry(.15,.15,.12,8),gold,false,false);cf.position.y=-.68;p.add(cf);var wg=mesh(new T.SphereGeometry(.13,8,6),bl,false,false);wg.scale.set(1,1.5,.6);wg.position.y=-.82;p.add(wg);arms.push(p)});
  var sw=new T.Group();sw.position.y=-.85;arms[1].add(sw);var bl3=mesh(new T.BoxGeometry(.06,1.1,.12),M(0xd8dde4,.25,.9),false,false);bl3.position.y=-.55;sw.add(bl3);var gd=mesh(new T.TorusGeometry(.12,.03,4,10,Math.PI),gold,false,false);sw.add(gd);
  [-1,1].forEach(function(sd){var lg=mesh(new T.CylinderGeometry(.08,.06,.5,6),bk,false,false);lg.position.set(sd*.2,.25,0);inner.add(lg);var ft=mesh(new T.BoxGeometry(.3,.06,.35),bk,false,false);ft.position.set(sd*.2,.03,.1);inner.add(ft)});
  var tl=mesh(new T.ConeGeometry(.3,.7,5),bl,false,false);tl.rotation.x=-2.2;tl.position.set(0,.65,-.45);inner.add(tl);
  var stars=new T.Group();stars.position.y=2.8;inner.add(stars);for(k=0;k<3;k++){var s1=mesh(new T.OctahedronGeometry(.12,0),gold,false,false);s1.position.set(Math.cos(k*2.1)*.5,0,Math.sin(k*2.1)*.5);stars.add(s1)}stars.visible=false;
  add(g);return {g:g,inner:inner,arms:arms,hd:hd,hat:hat,stars:stars}}
function wkBossBuild(){var C=LV.captain;if(!C)return;var v=makeCaptain();v.g.position.set(C.x,C.y,-.4);
  WK.cap={v:v,x:C.x,y:C.y,hp:3,max:3,st:'wait',t:0,nx:2,seq:0,bar:[],ball:null,fish:[],face:-1};
  var wl={l:C.wall0,r:C.wall0+.5,t:C.deck+11,b:C.deck-.4,oneway:false,dead:true,wall:true};var we={l:C.wall1,r:C.wall1+.5,t:C.deck+11,b:C.deck-.4,oneway:false,wall:true};solids.push(wl,we);WK.cap.w0=wl;WK.cap.w1=we;
  var A=wkMats();WK.cap.barM=A.wood}
function wkBossBar(){var c=WK.cap;$('bossFill').style.width=(c.hp/c.max*100)+'%'}
function wkBossThrowBarrel(){var c=WK.cap,A=wkMats(),b=new T.Group(),bd=mesh(new T.CylinderGeometry(.42,.42,.95,12),A.wood,true,false);bd.rotation.x=Math.PI/2;b.add(bd);
  [-.32,.32].forEach(function(z){var hp=mesh(new T.TorusGeometry(.43,.035,4,14),A.iron,false,false);hp.position.z=z;b.add(hp)});add(b);
  var tx=LV.captain.wall0+8+Math.random()*6,T0=.9,x0=c.x-.6,y0=c.y+1.6,gy=LV.captain.deck+.42;
  c.bar.push({m:b,x:x0,y:y0,vx:(tx-x0)/T0,vy:(gy-y0+.5*20*T0*T0)/T0,air:1,kick:0,dead:0,spin:0});try{beep(300,.12,'square',.04,-80)}catch(er){}}
function wkBossCannon(){var c=WK.cap;c.ball={st:'aim',t:1.2,tx:P.x,m:null};try{beep(520,.1,'square',.03)}catch(er){}}
function wkBossUpd(dt){var c=WK.cap;if(!c)return;var C=LV.captain,v=c.v,t=WK.t;
  /* movimento do capitão (bamboleia, olha para o Kuro) */
  v.g.position.set(c.x,c.y+(c.st==='dead'?0:Math.abs(Math.sin(t*3))*.05),-.4);v.g.rotation.y=c.st==='dead'?v.g.rotation.y:(P.x<c.x?-Math.PI/2+.35:Math.PI/2-.35);
  if(c.st==='wait'){v.arms[0].rotation.z=.3;v.arms[1].rotation.z=-.3+Math.sin(t*2)*.1;
    if(state==='play'&&P.x>C.wall0+3&&P.y>C.deck-.5){c.st='intro';c.t=1.6;c.w0.dead=false;$('bossBar').hidden=false;var bn=$('bossBar').querySelector('span');if(bn)bn.textContent='Capitão Corvo-Pirata';wkBossBar();
      WK.camLock=C.cam;sfx.boss();toast('Capitão Corvo-Pirata: "Arrr! Este navio é meu!"')}return}
  if(c.st==='intro'){c.t-=dt;v.arms[1].rotation.z=-1.8;if(c.t<=0){c.st='fight';c.nx=1;if(!WK.toldB){WK.toldB=1;toast('Pule em cima dos barris rolando para chutá-los de volta no capitão!')}}return}
  if(c.st==='dead'){c.t+=dt;c.y-=dt*(2+c.t*6);c.x+=dt*2;v.g.rotation.z+=dt*3;if(c.y<-3&&!c.spl){c.spl=1;splashFx(c.x,-.35,20);try{sfx.splash()}catch(er){}v.g.visible=false}return}
  var ph=c.hp>=3?1:(c.hp===2?2:3);
  /* o navio balança: o convés inclina e empurra o Kuro e os barris */
  WK.tilt=Math.sin(t*.55)*(.5+ph*.25);if(P.grounded&&P.x>C.wall0&&P.x<C.wall1&&state==='play')WK.push+=WK.tilt*-1.4;
  if(c.st==='stun'){c.t-=dt;v.stars.visible=true;v.stars.rotation.y+=dt*6;v.inner.rotation.z=Math.sin(t*5)*.15;v.arms[0].rotation.z=v.arms[1].rotation.z=1.2;
    /* tonto: dá para pular na cabeça dele também */
    if(state==='play'&&P.vy<0&&Math.abs(P.x-c.x)<.9&&P.y>c.y+1.6&&P.y<c.y+2.8){wkBossHit();P.vy=12;P.grounded=false}
    if(c.t<=0){c.st='fight';v.stars.visible=false;v.inner.rotation.z=0;c.nx=1.2}}
  else{v.stars.visible=false;c.nx-=dt;v.arms[0].rotation.z=.4;v.arms[1].rotation.z=-.5+Math.sin(t*4)*.2;
    if(c.nx<=0){c.seq++;var k=c.seq%(ph>=2?3:3);if(k===0)wkBossCannon();else wkBossThrowBarrel();if(ph>=2&&c.seq%2===0)wkBossFish();c.nx=(ph===1?2.2:(ph===2?1.9:1.6));v.arms[1].rotation.z=-2.2}
    /* encostar no capitão machuca */
    if(state==='play'&&Math.abs(P.x-c.x)<.7&&P.y<c.y+2.2&&P.y+P.h>c.y)hurt(c.x)}
  /* barris */
  for(var i=c.bar.length-1;i>=0;i--){var b=c.bar[i];if(!b)continue;/* a lista pode esvaziar no meio (o Kuro caiu e a luta recomeçou) */
    if(b.air){b.vy-=20*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;var gy=C.deck+.42;
      if(!b.kick&&b.y<=gy&&b.vy<0){b.y=gy;b.air=0;b.vx=-(2.6+ph*.8);b.vy=0;emit(dustPool,b.x,C.deck+.1,5,2,.4,.4,1.2,-.3)}
      if(b.kick){if(Math.abs(b.x-c.x)<.9&&b.y>c.y+.2&&b.y<c.y+2.4&&c.st!=='stun'){wkBossHit();b.dead=1}if(b.y<-2||b.x>C.wall1+2)b.dead=1}}
    else{b.vx+=WK.tilt*-.9*dt;b.x+=b.vx*dt;b.m.rotation.z-=b.vx*dt/.42;
      if(state==='play'&&Math.abs(P.x-b.x)<P.w/2+.42&&P.y<b.y+.45&&P.y+P.h>b.y-.4){
        if(P.vy<0&&P.y>b.y+.05){b.kick=1;b.air=1;var tx=c.x,ty=c.y+1.1,dx=tx-b.x,vx=Math.max(7,Math.min(12,Math.abs(dx)*1.1)),T1=Math.abs(dx)/vx;b.vx=vx*Math.sign(dx||1);b.vy=(ty-b.y+.5*20*T1*T1)/T1;P.vy=11;P.grounded=false;sfx.stomp();emit(sparkPool,b.x,b.y+.4,8,3,.4,.3,.2,2)}
        else if(P.inv<=0)hurt(b.x)}
      if(b.x<C.wall0+.6||b.x>C.wall1-.3){b.dead=1;emit(dustPool,b.x,b.y,10,3,.6,.5,1.2,-.3);try{noise(.15,.05,600,'lowpass')}catch(er){}}}
    b.m.position.set(b.x,b.y,0);if(b.dead){if(b.m.parent)b.m.parent.remove(b.m);c.bar.splice(i,1)}}
  /* tiro de canhão: marca no convés onde vai cair */
  var bl=c.ball;if(bl){bl.t-=dt;
    if(bl.st==='aim'){WK.mark.position.set(bl.tx,C.deck+.05,0);WK.mark.material.color.set(0xff6040);WK.mark.material.opacity=.4+.5*Math.abs(Math.sin(t*12));
      if(bl.t<=0){bl.st='fly';bl.t=.7;var A=wkMats();bl.m=mesh(new T.SphereGeometry(.28,10,8),A.iron,true,false);add(bl.m);bl.x0=C.poop+1.2;bl.y0=c.y+.9;try{noise(.35,.1,350,'lowpass')}catch(er){}emit(dustPool,bl.x0-1,bl.y0,10,3,.6,.6,1.2,-.2)}}
    else{var u=1-bl.t/.7;bl.m.position.set(bl.x0+(bl.tx-bl.x0)*u,bl.y0+(C.deck-bl.y0)*u+Math.sin(u*Math.PI)*3.5,0);
      if(bl.t<=0){WK.mark.material.opacity=0;WK.mark.material.color.set(0xfff2a0);emit(sparkPool,bl.tx,C.deck+.3,24,5,.7,.35,.2,3);emit(dustPool,bl.tx,C.deck+.3,12,4,.8,.7,1.3,-.2);shake=Math.max(shake,.25);try{noise(.4,.12,250,'lowpass')}catch(er){}
        if(state==='play'&&Math.abs(P.x-bl.tx)<1.4&&P.y<C.deck+1.5)hurt(bl.tx);if(bl.m.parent)bl.m.parent.remove(bl.m);c.ball=null}}}
  /* peixes que saltam por cima do navio (fase 2 em diante) */
  for(i=c.fish.length-1;i>=0;i--){var f=c.fish[i];f.t+=dt;if(f.t<0){continue}var u2=f.t/1.3;f.m.visible=true;f.m.position.set(f.x+Math.sin(u2*3)*.2,C.deck-1+Math.sin(u2*Math.PI)*(f.h),3.2-u2*7.5);f.m.rotation.x=-1.2+u2*2.4;
    if(state==='play'&&Math.abs(f.m.position.z)<.6&&Math.abs(P.x-f.x)<.8&&Math.abs(P.y+.7-f.m.position.y)<1)hurt(f.x);
    if(u2>=1){splashFx(f.x,-.35,6);if(f.m.parent)f.m.parent.remove(f.m);c.fish.splice(i,1)}}}
function wkBossFish(){var c=WK.cap,n=c.hp===1?3:2;for(var k=0;k<n;k++){var x=clamp(P.x+(k-(n-1)/2)*2.2+(Math.random()-.5),LV.captain.wall0+1,LV.captain.wall1-2);var m=makeJFish().g;m.visible=false;m.scale.setScalar(1.2);
  c.fish.push({m:m,x:x,t:-.7-k*.15,h:3.6+Math.random()*1.4});splashFx(x,-.35,8)}if(!WK.toldF){WK.toldF=1;toast('Cuidado: os peixes estão saltando por cima do navio!')}}
function wkBossHit(){var c=WK.cap;c.hp--;wkBossBar();c.st='stun';c.t=2.4;sfx.stomp();try{sfx.crunch()}catch(e){}shake=Math.max(shake,.35);emit(sparkPool,c.x,c.y+2,18,4,.6,.35,.2,3);
  c.bar.forEach(function(b){b.dead=1;if(b.m.parent)b.m.parent.remove(b.m)});c.bar=[];
  if(c.hp<=0){c.st='dead';c.t=0;sfx.win();$('bossBar').hidden=true;c.w1.dead=true;c.w0.dead=true;/* as duas paredes abrem: dá para ir e voltar */emit(sparkPool,c.x,c.y+2,40,7,1.2,.6,.5,4);WK.camLock=null;WK.tilt=0;
    if(c.ball&&c.ball.m&&c.ball.m.parent)c.ball.m.parent.remove(c.ball.m);c.ball=null;WK.mark.material.opacity=0;
    for(var k=0;k<8;k++)dropCoins&&dropCoins.push&&0;toast('Você venceu o Capitão Corvo-Pirata! Siga até a ilha')}
  else toast(c.hp===2?'Acertou! O navio balança mais — e vêm peixes!':'Mais uma! Ele está quase caindo!')}
function wkBossReset(){var c=WK&&WK.cap;if(!c)return;if(c.st==='dead'){c.w0.dead=true;c.w1.dead=true;WK.camLock=null;$('bossBar').hidden=true;return}/* já vencido: continua aberto depois de morrer */c.st='wait';c.hp=c.max;c.x=LV.captain.x;c.y=LV.captain.y;c.w0.dead=true;c.v.g.visible=true;c.v.stars.visible=false;
  c.bar.forEach(function(b){if(b.m.parent)b.m.parent.remove(b.m)});c.bar=[];if(c.ball&&c.ball.m&&c.ball.m.parent)c.ball.m.parent.remove(c.ball.m);c.ball=null;
  c.fish.forEach(function(f){if(f.m.parent)f.m.parent.remove(f.m)});c.fish=[];WK.camLock=null;WK.tilt=0;if(WK.mark)WK.mark.material.opacity=0}
/* ilha: palmeiras, poças, árvores caídas, pedras na água */
function wkIsland(){var I=LV.island;if(!I)return;var A=wkMats(),r=rnd(6161),PL=[],LF=[],CO=[];
  function palm(x,y,z,s){var h=(3.4+r()*1.6)*s,lean=(r()-.5)*.6,seg=6,px=x,py=y;for(var k=0;k<seg;k++){var u=k/seg,nx=x+Math.sin(lean)*h*(u+1/seg)*1+lean*u*u*1.5,ny=y+h*(k+1)/seg;
      var c=new T.CylinderGeometry(.13*s*(1-u*.3),.17*s*(1-u*.3),Math.hypot(nx-px,ny-py)+.05,7),m3=new T.Mesh(c);m3.position.set((px+nx)/2,(py+ny)/2,z);m3.rotation.z=-Math.atan2(nx-px,ny-py);m3.updateMatrix();c.applyMatrix4(m3.matrix);PL.push(c);px=nx;py=ny}
    for(k=0;k<7;k++){var an=k/7*Math.PI*2+r()*.4,lf=new T.ConeGeometry(.28*s,2.4*s,4,1);lf.translate(0,1.2*s,0);lf.scale(1,1,.25);lf.rotateZ(-Math.PI/2+.5+r()*.3);lf.rotateY(an);lf.translate(px,py,z);LF.push(lf)}
    for(k=0;k<3;k++){var co=new T.SphereGeometry(.16*s,8,6);co.translate(px+(r()-.5)*.3,py-.2,z+(r()-.5)*.3);CO.push(co)}}
  for(var x=I.x0+2;x<I.x1;x+=3+r()*4){var pz=-3.2-r()*4;palm(x,Math.max(I.top,mY(x,pz))-.05,pz,.8+r()*.5)}/* em cima do chão da ilha */
  palm(I.x1-4,I.top,-1.9,1.15);/* (nenhuma palmeira na frente do caminho: tapava o Kuro) */
  add(mesh(mgL(PL),M(0x8a6a44,.85),true,false));add(mesh(mgL(LF),M(0x3a8a3a,.7,0,{side:T.DoubleSide,flatShading:true}),true,false));add(mesh(mgL(CO),M(0x5a3a1a,.7),false,false));
  /* poças (chão alagado) */
  var pm=new T.MeshStandardMaterial({color:0x4a7a90,roughness:.08,metalness:.3,transparent:true,opacity:.75});WK.pud=[];
  for(var k=0;k<14;k++){var px=I.x0+2+r()*(I.x1-I.x0-4),pz=-3.5+r()*4.5,p=new T.Mesh(new T.CircleGeometry(.8+r()*1.6,16),pm);p.rotation.x=-Math.PI/2;p.scale.set(1.6,1,1);p.position.set(px,I.top+.02,pz);add(p);WK.pud.push({x:px,z:pz})}
  /* árvores caídas (as do caminho são sólidas: LV.logs; outras são só enfeite) */
  (I.logs||[]).concat(I.deco||[]).forEach(function(q,j){var w=q[1]-q[0],lg=mesh(new T.CylinderGeometry(.42,.5,w,10),M(0x6a5034,.9),true,true);lg.rotation.z=Math.PI/2;lg.rotation.y=q[3]||0;lg.position.set((q[0]+q[1])/2,I.top+.42,q[4]||0);add(lg);
    var rt=mesh(new T.DodecahedronGeometry(.9,0),M(0x4a3824,.9),true,false);rt.scale.set(.5,1,1);rt.position.set(q[0]-.2,I.top+.7,q[4]||0);add(rt);
    for(var k2=0;k2<3;k2++){var br=mesh(new T.CylinderGeometry(.06,.1,1.4,5),M(0x6a5034,.9),false,false);br.position.set(q[0]+1+k2*w/3,I.top+1,(q[4]||0)-.2);br.rotation.set(.6,0,(k2-1)*.6);add(br)}
    if(j<(I.logs||[]).length)solids.push({l:q[0],r:q[1],t:I.top+.84,b:I.top,oneway:false})});
  /* pedras e mato */
  var RK=[];for(k=0;k<20;k++){x=I.x0+r()*(I.x1-I.x0);var rz=-4-r()*4;RK.push(xf(new T.DodecahedronGeometry(.3+r()*.6,0),[x,Math.max(I.top,mY(x,rz)),rz],[r()*3,r()*3,r()*3],[1.3,.7,1]))}add(mesh(mgL(RK),M(0x6a6660,.9,0,{flatShading:true}),true,true))}
function wkRock(s){var x0=s[0],x1=s[1],top=s[2],w=x1-x0,g=new T.Group(),r=rnd((x0*7)|0);
  var b=mesh(new T.DodecahedronGeometry(1,1),M(0x5a5e66,.9,0,{flatShading:true}),true,true);b.scale.set(w*.6,top+2,1.6);b.position.set(0,top-(top+2)+.05,-.3);g.add(b);
  var tp=mesh(boxGeo(w,.3,2,1),M(0x6a6e76,.9,0,{flatShading:true}),true,true);tp.position.set(0,top-.15,-.3);g.add(tp);
  var al=mesh(new T.TorusGeometry(w*.45,.08,4,14),M(0x2a5a3a,.8),false,false);al.rotation.x=Math.PI/2;al.position.set(0,-.25,-.3);al.scale.set(1,.6,1);g.add(al);
  g.position.set((x0+x1)/2,0,0);add(g);solids.push({l:x0,r:x1,t:top,b:-14,oneway:false})}
function wkPart3Build(){if(LV.stern)wkStern(LV.stern);wkBossBuild();wkIsland();(LV.rocks||[]).forEach(wkRock);
  var A=wkMats();(LV.ladders||[]).forEach(function(l){var x=l[0],y0=l[1],len=l[2],L=[];[-.28,.28].forEach(function(dx){var c=new T.BoxGeometry(.09,len+.3,.09);c.translate(x+dx,y0+len/2,-.6);L.push(c)});
    for(var y=y0+.4;y<y0+len;y+=.42){var d=new T.BoxGeometry(.56,.06,.08);d.translate(x,y,-.6);L.push(d)}add(mesh(mgL(L),A.wood,true,false));
    vines.push({x:x,y0:y0,top:y0+len,len:len,max:len,g:new T.Object3D(),stem:new T.Object3D(),leaves:[],ladder:1})})}
function wkPart3Upd(dt){var t=WK.t;
  /* caranguejos não atravessam a âncora: batem nela e voltam */
  if(!WK.anc)WK.anc=solids.find(function(q){return q.anchor})||0;var an=WK.anc;
  if(an&&state==='play'&&P.grounded&&P.onPlat!==an&&P.x>an.l&&P.x<an.r&&P.y<an.t&&P.y>an.t-.6){P.y=an.t;P.onPlat=an}/* andando, sobe no degrau */
  if(an)enemies.forEach(function(e){if(!e.alive||e.type!=='beetle'||e.y>an.t)return;var h=.45;if(e.x+h>an.l&&e.x-h<an.r){if(e.x<(an.l+an.r)/2){e.x=an.l-h;e.tr=Math.min(e.tr,an.l-h)}else{e.x=an.r+h;e.tl=Math.max(e.tl,an.r+h)}e.dir=-e.dir}});
  if(WK.sternG){WK.sternG.position.y=Math.sin(t*.9)*.02;WK.sternG.rotation.z=0}/* o desenho da popa fica alinhado ao chão de verdade (girar em volta do x=0 do mundo deslocava o navio metros para baixo) */
  if(WK.cap)wkBossUpd(dt);
  /* a tempestade passa perto da ilha */
  var I=LV.island;if(I){var k=clamp((P.x-(I.x0-40))/40,0,1);WK.calm=k;if(k>.5)WK.next=Math.max(WK.next,2)}}
