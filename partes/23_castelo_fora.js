/*@@parte:23_castelo_fora.js*/
/* ---------- Castelo do Medo: chegada pelo lado de fora (trilha de terra, grama, caveiras, lápides e o castelo ao fundo) ---------- */
var castlePathM=null,boneMatC=null,castleOutStoneM=null,castleOutDirtM=null;
/* junta várias geometrias já posicionadas numa só (1 desenho); cor por vértice opcional */
function mergeG(list,withCol){
  var n=0,i;list=list.map(function(q){var g=q.g.index?q.g.toNonIndexed():q.g;return {g:g,c:q.c}});list.forEach(function(q){n+=q.g.attributes.position.count});
  var pos=new Float32Array(n*3),nor=new Float32Array(n*3),uv=new Float32Array(n*2),cl=withCol?new Float32Array(n*3):null,o=0,c=new T.Color();
  list.forEach(function(q){var g=q.g,cn=g.attributes.position.count;if(!g.attributes.normal)g.computeVertexNormals();pos.set(g.attributes.position.array,o*3);nor.set(g.attributes.normal.array,o*3);
    if(g.attributes.uv)uv.set(g.attributes.uv.array,o*2);if(cl){c.setHex(q.c||0xffffff);c.convertSRGBToLinear();for(i=0;i<cn;i++){cl[(o+i)*3]=c.r;cl[(o+i)*3+1]=c.g;cl[(o+i)*3+2]=c.b}}o+=cn});
  var bg=new T.BufferGeometry();bg.setAttribute('position',new T.BufferAttribute(pos,3));bg.setAttribute('normal',new T.BufferAttribute(nor,3));bg.setAttribute('uv',new T.BufferAttribute(uv,2));
  if(cl)bg.setAttribute('color',new T.BufferAttribute(cl,3));return bg;
}
var _xo=new T.Object3D();
function xf(g,p,r,s){_xo.position.set(p[0],p[1],p[2]);_xo.rotation.set(r?r[0]:0,r?r[1]:0,r?r[2]:0);_xo.scale.set(s?s[0]:1,s?s[1]:1,s?s[2]:1);_xo.updateMatrix();g.applyMatrix4(_xo.matrix);return g}
/* caveira, osso, lápide: peças pequenas com cor por vértice, desenhadas em lote */
function skullGeo(){var B=0xe4d8bc,D=0x1a1410,L=[];
  L.push({g:xf(new T.SphereGeometry(.2,12,10),[0,.21,0],0,[1,.92,1.08]),c:B});
  L.push({g:xf(new T.BoxGeometry(.2,.1,.16),[0,.07,.07]),c:B});
  L.push({g:xf(new T.SphereGeometry(.058,8,6),[-.075,.2,.165],0,[1,1.15,.6]),c:D});
  L.push({g:xf(new T.SphereGeometry(.058,8,6),[.075,.2,.165],0,[1,1.15,.6]),c:D});
  L.push({g:xf(new T.ConeGeometry(.03,.06,3),[0,.125,.19],[0,0,Math.PI]),c:D});
  L.push({g:xf(new T.BoxGeometry(.16,.014,.02),[0,.085,.152]),c:D});
  return mergeG(L,true)}
function boneGeo(){var B=0xddd0b2,L=[];
  L.push({g:xf(new T.CylinderGeometry(.03,.03,.36,6),[0,.045,0],[0,0,Math.PI/2]),c:B});
  [-1,1].forEach(function(s){L.push({g:xf(new T.SphereGeometry(.045,6,5),[s*.19,.045,.03]),c:B});L.push({g:xf(new T.SphereGeometry(.045,6,5),[s*.19,.045,-.03]),c:B})});
  return mergeG(L,true)}
function boneMat(){return boneMatC||(boneMatC=M(0xffffff,.8,0,{vertexColors:true}))}
function scatterSkulls(list){/* list: [x,y,z,rotY,tipo(0 caveira,1 osso),escala] */
  var d=new T.Object3D(),sk=list.filter(function(q){return !q[4]}),bn=list.filter(function(q){return q[4]});
  [[sk,skullGeo()],[bn,boneGeo()]].forEach(function(p){if(!p[0].length)return;var im=inst(p[1],boneMat(),p[0].length,false);
    p[0].forEach(function(q,k){d.position.set(q[0],q[1],q[2]);d.rotation.set(q[6]||0,q[3],q[7]||0);d.scale.setScalar(q[5]||1);d.updateMatrix();im.setMatrixAt(k,d.matrix)});add(im)})}
function buildCastleOutside(xa,xb){
  var r=rnd(4040),i,k,d=new T.Object3D(),lq=+effCfg().lush||0,q=(coarse?.55:1)*(lq>=.75?1:(lq>=.6?.6:.35)),few=q<.3;
  if(!castlePathM)castlePathM=M(0xd6c4a6,.96,0,{map:texStone.map});
  if(!castleOutStoneM)castleOutStoneM=pbr(texBrick,.92,.14,{color:new T.Color(0xffe6c0)});
  var stoneB=castleOutStoneM,roofM=M(0x6e6258,.75,.1),darkM=new T.MeshBasicMaterial({color:0x0b0a10}),woodM2=M(0x3a281a,.9),ironM=M(0x1c1b22,.5,.7);
  /* chão: campo de grama atrás e na frente da trilha */
  var gx0=xa-26,gx1=xb+.4,fw=gx1-gx0;
  var fld=mesh(boxGeo(fw,.3,26,2),grassM,false,true);fld.position.set((gx0+gx1)/2,-.15,-18.2);add(fld);
  var bk=mesh(boxGeo(xb-xa,.06,3.6,2),grassM,false,true);bk.position.set((xa+xb)/2,.03,-3.1);add(bk);
  var fr=mesh(boxGeo(xb-xa,.06,.75,2),grassM,false,true);fr.position.set((xa+xb)/2,.03,1.45);add(fr);
  /* trilha que sai da estrada e vai até o portão do castelo, como na foto */
  var gate=xa+24,pz=-19.6,pts=[],seg=26,rb=[],ri=[];
  for(i=0;i<=seg;i++){var t=i/seg,x=(1-t)*(1-t)*(gate-9)+2*(1-t)*t*(gate-2)+t*t*gate,z=(1-t)*(1-t)*(-1.2)+2*(1-t)*t*(-7)+t*t*(pz+1.2);pts.push([x,z,1.5-t*.65])}
  for(i=0;i<=seg;i++){var a=pts[Math.max(0,i-1)],b=pts[Math.min(seg,i+1)],tx=b[0]-a[0],tz=b[1]-a[1],L=Math.hypot(tx,tz)||1,nx=-tz/L,nz=tx/L,w=pts[i][2]/2;
    rb.push(pts[i][0]+nx*w,.05,pts[i][1]+nz*w,pts[i][0]-nx*w,.05,pts[i][1]-nz*w);ri.push(0,i*.6,1,i*.6)}
  var idx=[];for(i=0;i<seg;i++){var o=i*2;idx.push(o,o+2,o+1,o+1,o+2,o+3)}
  var pg=new T.BufferGeometry();pg.setAttribute('position',new T.Float32BufferAttribute(rb,3));pg.setAttribute('uv',new T.Float32BufferAttribute(ri,2));pg.setIndex(idx);pg.computeVertexNormals();
  add(mesh(pg,castlePathM,false,true));
  function onPath(x,z){for(var j=0;j<pts.length;j++){if(Math.hypot(x-pts[j][0],z-pts[j][1])<pts[j][2]*.55+.15)return true}return false}
  /* laguinho escuro à esquerda */
  var pondX=xa+3,pondZ=-11,pondM=M(0x0e1a22,.12,.4);var pond=mesh(new T.CircleGeometry(1,28),pondM,false,true);pond.rotation.x=-Math.PI/2;pond.scale.set(7,4,1);pond.position.set(pondX,.04,pondZ);add(pond);
  function inPond(x,z){var a=(x-pondX)/7.4,b=(z-pondZ)/4.4;return a*a+b*b<1}
  /* castelo ao fundo: muralha, 6 torres (as de fora quadradas), telhados pontudos, ameias e janelinhas */
  var W=[],R=[],Wn=[],Gl=[],cz=-22;
  W.push({g:xf(boxGeo(19,6.4,1.6,3),[gate,3.2,cz])});
  W.push({g:xf(boxGeo(5.2,8.6,1.8,3),[gate,4.3,cz+.6])});
  for(i=0;i<24;i++){var mx=gate-9.3+i*.81;W.push({g:xf(boxGeo(.45,.55,1.7,3),[mx,6.65,cz])})}
  for(i=0;i<6;i++){W.push({g:xf(boxGeo(.5,.6,1.9,3),[gate-2.3+i*.92,8.9,cz+.6])})}
  var TW=[[-10.5,0,1.7,8.6],[-7.3,1,1.25,11.6],[-3.9,1,1.35,10],[3.9,1,1.35,10],[7.3,1,1.25,11.6],[10.5,0,1.7,8.6]];
  TW.forEach(function(t){var tx=gate+t[0],rr=t[2],h=t[3];
    if(t[1]){var cy=new T.CylinderGeometry(rr,rr,h,18,1);scaleUV(cy,rr*2.4,h/2.6);W.push({g:xf(cy,[tx,h/2,cz+.3])});
      var ring=new T.CylinderGeometry(rr*1.16,rr*1.05,.7,18,1);scaleUV(ring,rr*2.6,.35);W.push({g:xf(ring,[tx,h-.15,cz+.3])});
      R.push({g:xf(new T.ConeGeometry(rr*1.22,rr*2.6,18),[tx,h+.2+rr*1.3,cz+.3])});
      for(k=0;k<3;k++)Wn.push({g:xf(new T.PlaneGeometry(.22,.42),[tx+(k-1)*rr*.45,h*(.35+k*.18),cz+.3+rr*.97])});
    }else{W.push({g:xf(boxGeo(rr*2,h,rr*2,3),[tx,h/2,cz+.3])});W.push({g:xf(boxGeo(rr*2.3,1.1,rr*2.3,3),[tx,h-.3,cz+.3])});
      R.push({g:xf(new T.ConeGeometry(rr*1.75,rr*2.2,4),[tx,h+.25+rr*1.1,cz+.3],[0,Math.PI/4,0])});
      for(k=0;k<4;k++)Wn.push({g:xf(new T.PlaneGeometry(.24,.4),[tx+(k%2-.5)*rr*.9,h*(.4+Math.floor(k/2)*.3),cz+.3+rr*1.01])})}
  });
  for(i=0;i<3;i++)Wn.push({g:xf(new T.PlaneGeometry(.32,.6),[gate+(i-1)*.9,6.6,cz+1.52])});
  Gl.push({g:xf(new T.PlaneGeometry(.22,.42),[gate-7.3,7.5,cz+.3+1.25*.97])});Gl.push({g:xf(new T.PlaneGeometry(.32,.6),[gate,6.6,cz+1.53])});
  /* portão: arco escuro com a porta de madeira */
  Wn.push({g:xf(new T.PlaneGeometry(2.2,2.4),[gate,1.2,cz+1.52])});Wn.push({g:xf(new T.CircleGeometry(1.1,16,0,Math.PI),[gate,2.4,cz+1.52])});
  var dr=mesh(new T.BoxGeometry(1.8,2.9,.1),woodM2,false,false);dr.position.set(gate,1.45,cz+1.56);add(dr);
  add(mesh(mergeG(W),stoneB,false,true));add(mesh(mergeG(R),roofM,false,false));add(mesh(mergeG(Wn),darkM,false,false));
  add(mesh(mergeG(Gl),new T.MeshBasicMaterial({color:0xffb04a})));
  /* entrada do Kuro: torre grande e arco de pedra com a grade levantada (a fase segue por dentro) */
  var E=[],ex=xb;
  var bt=new T.CylinderGeometry(2.3,2.5,18,20,1);scaleUV(bt,5.5,7);E.push({g:xf(bt,[ex+1.6,9,-7.6])});
  var btr=new T.CylinderGeometry(2.7,2.5,.9,20,1);scaleUV(btr,6,.4);E.push({g:xf(btr,[ex+1.6,17.6,-7.6])});
  E.push({g:xf(boxGeo(1.3,7.2,1.3,3),[ex-.5,3.6,-4.5])});E.push({g:xf(boxGeo(1.3,7.2,1.1,3),[ex-.5,3.6,2.9])});
  E.push({g:xf(boxGeo(1.6,1.5,8.8,3),[ex-.5,6.55,-.8])});
  add(mesh(mergeG(E),stoneB,true,true));
  var rf=mesh(new T.ConeGeometry(3,6.2,20),roofM,false,false);rf.position.set(ex+1.6,21.1,-7.6);add(rf);
  var PC=[];for(i=0;i<12;i++){PC.push({g:xf(new T.ConeGeometry(.06,.35,4),[ex-.5,5.65,-3.6+i*.55],[Math.PI,0,0])})}
  PC.push({g:xf(new T.BoxGeometry(.12,.12,7.4),[ex-.5,5.85,-.85])});
  add(mesh(mergeG(PC),ironM,false,false));
  [[-4.5,-1.2],[2.9,1.2]].forEach(function(p){var px=ex-1.2,cup=mesh(new T.CylinderGeometry(.16,.09,.22,8),ironM,false,false);cup.position.set(px,4.1,p[0]);add(cup);
    var fs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffa23a,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.85}));fs.scale.set(1.2,1.6,1);fs.position.set(px,4.55,p[0]+.05);add(fs);castleFx.torches.push({s:fs,sz:1.2});
    var hs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff8a30,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.2}));hs.scale.set(5,5,1);hs.position.set(px,4.5,p[0]);add(hs)});
  /* árvores secas no campo e a árvore grande que cobre o alto da tela, com folhas escuras */
  var TR=[],LF=[];
  function tree(x,z,h,lean,sp,leafy){var tg=new T.CylinderGeometry(h*.045,h*.075,h,7,1);TR.push({g:xf(tg,[x+lean*h*.5,h/2-.1,z],[0,0,-lean])});
    var nb=5+Math.floor(r()*3);for(var b=0;b<nb;b++){var by=h*(.45+r()*.5),bl=h*(.3+r()*.4)*sp,ang=(r()<.5?-1:1)*(.6+r()*.7),bx=x+lean*by;
      TR.push({g:xf(new T.CylinderGeometry(h*.012,h*.03,bl,5,1),[bx-Math.sin(ang)*bl/2,by+Math.cos(ang)*bl/2,z+(r()-.5)*1.2],[0,0,ang])});
      if(leafy)for(var lf=0;lf<5;lf++){var t2=.4+r()*.7;LF.push([bx-Math.sin(ang)*bl*t2,by+Math.cos(ang)*bl*t2-.3,z+(r()-.5)*1.4,.6+r()*.7])}}}
  tree(xa+12,-13,6.5,.12,1,false);tree(xb-6,-12,5.5,-.15,1,false);tree(xa-6,-24,7,.05,1,false);tree(xa+19,-26,6,-.1,1,false);
  tree(xa-1,3.2,11,.5,1.5,true);
  var trM=M(0x231d1a,.95);add(mesh(mergeG(TR),trM,true,false));
  for(i=0;i<22;i++)LF.push([xa+4+r()*20,7.6+r()*1.8,1.5+(r()-.5)*2,.6+r()*.7]);
  if(LF.length){var lm=inst(new T.IcosahedronGeometry(1,0),M(0x1b2c1c,.9),LF.length,false);
    LF.forEach(function(p,j){d.position.set(p[0],p[1],p[2]);d.rotation.set(r()*3,r()*3,r()*3);d.scale.set(p[3]*1.3,p[3]*.7,p[3]);d.updateMatrix();lm.setMatrixAt(j,d.matrix);lm.setColorAt(j,new T.Color().setHSL(.33,.25,.1+r()*.07))});add(lm)}
  /* arbustos escuros na frente */
  var bu=[];for(i=0;i<7;i++)bu.push([xa+1+r()*(xb-xa-6),-.25,2.4+r()*.6,.3+r()*.3]);
  var bm=inst(new T.IcosahedronGeometry(1,1),M(0x121c13,.95),bu.length,false);bu.forEach(function(p,j){d.position.set(p[0],p[1],p[2]);d.rotation.set(0,r()*3,0);d.scale.set(p[3]*1.4,p[3]*.8,p[3]);d.updateMatrix();bm.setMatrixAt(j,d.matrix)});add(bm);
  /* lápides tortas e cerca de ferro velha */
  var TS=[],cr=[];
  for(i=0;i<10;i++){var lx=xa+8+r()*16,lz=-6-r()*6;if(inPond(lx,lz)||onPath(lx,lz))continue;var tl=(r()-.5)*.35,ty2=r()*.6-.3,sc=.8+r()*.4;
    if(r()<.3){cr.push({g:xf(new T.BoxGeometry(.16,1.2*sc,.14),[lx,.55*sc,lz],[0,ty2,tl])});cr.push({g:xf(new T.BoxGeometry(.7*sc,.15,.14),[lx-Math.sin(tl)*.35,.85*sc,lz],[0,ty2,tl])})}
    else{TS.push({g:xf(new T.BoxGeometry(.7*sc,.8*sc,.16),[lx,.38*sc,lz],[0,ty2,tl])});TS.push({g:xf(new T.CylinderGeometry(.35*sc,.35*sc,.16,14,1),[lx-Math.sin(tl)*.4*sc,.78*sc,lz],[Math.PI/2,ty2,tl])})}}
  add(mesh(mergeG(TS.concat(cr)),M(0x6c6c74,.95),true,true));
  var FN=[];for(i=0;i<30;i++){var fx=xa+9+i*.42;if(r()<.12)continue;var ft=(r()-.5)*.25;FN.push({g:xf(new T.BoxGeometry(.05,1.1,.05),[fx,.5,-4.9],[0,0,ft])});FN.push({g:xf(new T.ConeGeometry(.06,.16,4),[fx-Math.sin(ft)*.55,1.1,-4.9],[0,0,ft])})}
  FN.push({g:xf(new T.BoxGeometry(12.4,.05,.05),[xa+15.2,.85,-4.9],[0,0,.03])});FN.push({g:xf(new T.BoxGeometry(12.4,.05,.05),[xa+15.2,.25,-4.9])});
  add(mesh(mergeG(FN),ironM,false,false));
  /* abóboras e velas acesas: um pouco de luz laranja no meio do cinza */
  var pk=[[xa+6,1.6],[gate-4,-5.4],[xb-4,-4.6],[xa+15,-6.5]],PK=[],ST=[];
  pk.forEach(function(p){PK.push({g:xf(new T.SphereGeometry(.32,14,10),[p[0],.22,p[1]],0,[1,.72,1])});ST.push({g:xf(new T.CylinderGeometry(.03,.05,.16,5),[p[0],.5,p[1]],[0,0,.3])});
    var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff9a30,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.5}));gl.scale.set(1.4,1.1,1);gl.position.set(p[0],.3,p[1]+.35);add(gl);castleFx.torches.push({s:gl,sz:1.2})});
  add(mesh(mergeG(PK),M(0xd8681a,.6,0,{emissive:new T.Color(0x5a1a00)}),true,false));add(mesh(mergeG(ST),M(0x3a4a1a,.8),false,false));
  /* névoa baixa sobre a grama */
  for(i=0;i<9;i++){var ms=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x8a8ea0,transparent:true,depthWrite:false,opacity:.16}));var mw2=10+r()*8;ms.scale.set(mw2,2.2,1);ms.position.set(xa-14+r()*(xb-xa+14),.7,-4-r()*12);add(ms)}
  /* grama 3D (a mesma do jogo, num verde escuro e acinzentado da noite) */
  var bl=[];
  function blades(x0,x1,z0,z1,dens){var n=Math.round((x1-x0)*(z1-z0)*dens*q);for(var j=0;j<n;j++){var bx=x0+r()*(x1-x0),bz=z0+r()*(z1-z0);if(onPath(bx,bz)||inPond(bx,bz)||(bz>-1.25&&bz<1.05))continue;var far=bz<-5;bl.push([bx,bz,far?.25+r()*.4:.35+r()*.6,.11+r()*.05])}}
  blades(xa-6,xb-.6,-5,-1.25,30);blades(xa-6,xb-.8,1.05,1.85,30);blades(xa-20,xb-1,-12,-5,16);blades(xa-24,xb-1,-19.5,-12,7);
  if(bl.length){var bg=bladeGeo(),gm=grassMat({base:'#050a06',mid:'#152117',tip:'#46553f'});gm.uniforms.time=lushU.time;var im=new T.InstancedMesh(bg,gm,bl.length),ar=new Float32Array(bl.length*3);
    bl.forEach(function(b,j){d.position.set(b[0],.02,b[1]);d.rotation.set(0,r()*6.283,0);d.scale.set(b[3],b[2],b[3]);d.updateMatrix();im.setMatrixAt(j,d.matrix);ar[j*3]=r();ar[j*3+1]=r();ar[j*3+2]=.6+r()*.6});
    bg.setAttribute('aR',new T.InstancedBufferAttribute(ar,3));im.frustumCulled=false;add(im)}
  /* caveiras e ossos jogados no chão (fora) */
  var SK=[];function sk(x,z,t,s){SK.push([x,.0,z,r()*6.283-(t?0:Math.PI*.5)*0,t,s||1,t?0:(r()<.3?(r()-.5)*1.2:0),t?0:(r()<.35?(r()<.5?1:-1)*1.3:0)])}
  for(i=0;i<(few?8:14);i++){var x=xa+1+r()*(xb-xa-3),z=r()<.5?-1.5-r()*3:1.15+r()*.6;if(onPath(x,z))continue;sk(x,z,0,.9+r()*.4);sk(x+(r()-.5)*.8,z+(r()-.5)*.4,1,1);if(r()<.5)sk(x+(r()-.5)*1,z+(r()-.5)*.4,1,.9)}
  for(i=0;i<6;i++){var x2=xa+8+r()*16,z2=-6-r()*6;if(!inPond(x2,z2))sk(x2,z2,r()<.4?0:1,1)}
  /* clarão do raio: risco no céu durante o relâmpago */
  var bm2=new T.MeshBasicMaterial({color:0xeef0ff,transparent:true,opacity:0,fog:false,depthWrite:false,side:T.DoubleSide});var bolt=new T.Mesh(new T.BufferGeometry(),bm2);bolt.frustumCulled=false;add(bolt);castleFx.bolt=bolt;castleFx.boltX=[xa-30,xb+6];
  return SK;
}
function buildDecorCastle(th){
  var SK=LV.outX!==undefined?buildCastleOutside(LV.xMin-1,LV.outX):[];
  var r=rnd(555),i,x0=LV.outX!==undefined?LV.outX:-14,x1=(LV.camMax||300)+75,wl=x1-x0,D=new T.Object3D();
  var wm=mesh(boxGeo(wl,44,1.2,6),castleWallM,false,true);wm.position.set((x0+x1)/2,12,-7.6);add(wm);
  var cor=mesh(boxGeo(wl,2.2,2,6),castleSlabM,false,true);cor.position.set((x0+x1)/2,19.5,-6.6);add(cor);
  var nP=Math.ceil(wl/11),pil=inst(new T.BoxGeometry(1.5,34,1.5),M(0x4d4766,.9),nP,false);
  for(i=0;i<nP;i++){D.position.set(x0+i*11+r()*1.2,9,-6.4);D.rotation.set(0,0,0);D.scale.set(1,1,1);D.updateMatrix();pil.setMatrixAt(i,D.matrix)}
  add(pil);
  var nW=Math.floor(wl/11),frame=inst(new T.BoxGeometry(2.3,4.6,.4),M(0x5d5778,.85),nW,false);
  var glass=inst(new T.PlaneGeometry(1.55,3.8),new T.MeshBasicMaterial({color:0x5f6fd0}),nW,false);
  var arch=inst(new T.ConeGeometry(1.35,1.5,4),M(0x5d5778,.85),nW,false);
  for(i=0;i<nW;i++){
    var wx=x0+5.5+i*11,wy=7.2;
    D.position.set(wx,wy,-6.75);D.rotation.set(0,0,0);D.scale.set(1,1,1);D.updateMatrix();frame.setMatrixAt(i,D.matrix);
    D.position.set(wx,wy,-6.5);D.updateMatrix();glass.setMatrixAt(i,D.matrix);
    D.position.set(wx,wy+3.0,-6.75);D.rotation.set(0,Math.PI/4,0);D.scale.set(1,1,.35);D.updateMatrix();arch.setMatrixAt(i,D.matrix);
  }
  add(frame);add(glass);add(arch);
  var tx=0,tbr=M(0x2a2630,.5,.7);
  for(i=0;i<Math.floor(wl/14);i++){
    var px=x0+7+i*14+(r()-.5)*2;
    var br=mesh(new T.CylinderGeometry(.05,.07,.55,6),tbr,false,false);br.position.set(px,3.6,-6.9);add(br);
    var cup=mesh(new T.CylinderGeometry(.16,.09,.2,8),tbr,false,false);cup.position.set(px,3.95,-6.9);add(cup);
    var fs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffa23a,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.85}));
    fs.scale.set(1.3,1.7,1);fs.position.set(px,4.45,-6.7);add(fs);castleFx.torches.push({s:fs,sz:1.3});
    var hs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff8a30,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.22}));
    hs.scale.set(6,6,1);hs.position.set(px,4.5,-6.2);add(hs);
  }
  var ban=M(0x6a2a8a,.8),trm=M(0xffc233,.4,.6);
  for(i=0;i<Math.floor(wl/30);i++){
    var bx=x0+15+i*30+(r()-.5)*4,b1=mesh(new T.BoxGeometry(1.5,4.4,.1),ban,false,false);b1.position.set(bx,13.2,-6.9);add(b1);
    var b2=mesh(new T.BoxGeometry(1.5,.18,.12),trm,false,false);b2.position.set(bx,11.1,-6.88);add(b2);
    var b3=mesh(new T.ConeGeometry(.75,.7,3),ban,false,false);b3.rotation.z=Math.PI;b3.position.set(bx,10.7,-6.9);add(b3);
  }
  var nC=Math.floor(wl/9),chn=inst(new T.CylinderGeometry(.05,.05,1,5),M(0x3a3640,.5,.8),nC,false);
  for(i=0;i<nC;i++){var cl=3+r()*7;D.position.set(x0+r()*wl,18-cl/2,-3.2-r()*1.5);D.rotation.set(0,0,0);D.scale.set(1,cl,1);D.updateMatrix();chn.setMatrixAt(i,D.matrix)}
  add(chn);
  // lustres
  for(i=0;i<Math.floor(wl/46);i++){
    var lx=x0+20+i*46+(r()-.5)*6,ring=mesh(new T.TorusGeometry(1.1,.07,6,18),M(0x3a3640,.4,.8),false,false);ring.rotation.x=Math.PI/2;ring.position.set(lx,14,-3.2);add(ring);
    var chain=mesh(new T.CylinderGeometry(.04,.04,6,5),M(0x3a3640,.5,.8),false,false);chain.position.set(lx,17,-3.2);add(chain);
    for(var q=0;q<5;q++){var qa=q/5*6.283,qs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffb04a,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.85}));
      qs.scale.set(.7,.95,1);qs.position.set(lx+Math.cos(qa)*1.1,14.45,-3.2+Math.sin(qa)*1.1);add(qs);castleFx.torches.push({s:qs,sz:.7})}
  }
  /* caveiras e ossos nos cantos do chão do castelo (fundo e beirada da frente) */
  if(LV.outX!==undefined){var lim=+effCfg().lush||0,stp=(coarse||lim<.6)?11:7;
    LV.solids.forEach(function(sd){if(sd[5]==='out'||sd[2]>=9.9||sd[3]>.5)return;
      for(var x=sd[0]+1.5+r()*3;x<sd[1]-1;x+=stp*(.7+r()*.6)){if(LV.door&&Math.abs(x-LV.door.x)<2.5)continue;var z=r()<.65?-3.7-r()*1:1.2+r()*.45,y=sd[2];
        SK.push([x,y,z,r()*6.283,0,.9+r()*.3,0,r()<.3?1.3:0]);SK.push([x+.4+r()*.5,y,z+(r()-.5)*.3,r()*6.283,1,1]);if(r()<.5)SK.push([x-.5-r()*.4,y,z+(r()-.5)*.3,r()*6.283,1,.9])}});
  }
  SK.forEach(function(s){if(!s[4]&&s[7])s[1]=(s[1]>.1?s[1]:0)+(s[8]?0:.16),s[8]=1});
  if(SK.length)scatterSkulls(SK);
}
function buildFarCastle(th,r){
  function moonTex(){
    var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),g=x.createRadialGradient(128,128,20,128,128,128);
    g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.38,'rgba(235,240,255,1)');g.addColorStop(.42,'rgba(180,195,255,.35)');g.addColorStop(1,'rgba(120,140,255,0)');
    x.fillStyle=g;x.fillRect(0,0,256,256);var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
  }
  var mo=new T.Sprite(new T.SpriteMaterial({map:moonTex(),transparent:true,depthWrite:false,fog:false}));mo.scale.set(46,46,1);mo.position.set(40,34,-130);farG.add(mo);
  var tm0=new T.MeshBasicMaterial({color:0x0e0a1c,fog:false}),i;
  for(i=0;i<22;i++){
    var tw=5+r()*7,th2=18+r()*34,tx2=-120+i*24+r()*10,tz=-90-r()*30;
    var tb=new T.Mesh(new T.BoxGeometry(tw,th2,6),tm0);tb.position.set(tx2,th2/2-4,tz);farG.add(tb);
    var rf=new T.Mesh(new T.ConeGeometry(tw*.75,tw*1.3,4),tm0);rf.position.set(tx2,th2-4+tw*.65,tz);rf.rotation.y=Math.PI/4;farG.add(rf);
    if(r()<.5){var wn=new T.Mesh(new T.PlaneGeometry(.9,1.6),new T.MeshBasicMaterial({color:0xffb04a,fog:false}));wn.position.set(tx2,th2*.6,tz+3.1);farG.add(wn)}
  }
  for(i=0;i<14;i++){
    var cs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x3a2a58,transparent:true,depthWrite:false,fog:false,opacity:.5}));
    var sz=40+r()*50;cs.scale.set(sz,sz*.35,1);cs.position.set(-150+r()*420,18+r()*28,-100-r()*20);farG.add(cs);
  }
}

/* fim do cenário: cobre a fase e as salas de cano que ficam além dela */
function sceneEnd(){var e=240;(LV.solids||[]).forEach(function(q){if(q[1]+40>e)e=q[1]+40});return e}
function buildBackdrop(th,m3){
  if(th.name==='forest'){buildBackdropForest(th);return}
  if(th.copa)return;/* Copa: no alto, sem chão */
  if(th.name==='volcano'||th.name==='summit'||th.name==='sky'||th.name==='tower'||th.name==='mine'||th.name==='maze')return;/* o cume tem o mar de nuvens; o vulcão tem o rio de lava no lugar do chão de fundo */
  var depth=-5-th.mz;
  var xl=(th.name==='castle'&&LV.outX!==undefined)?LV.outX:(th.name==='trail'?4:(th.aurora&&LV.lake?Math.min(-40,LV.lake[0]-60):-40)),/* Mundo 18: o terreno vai até antes da vila */xe=sceneEnd(),bw=xe-xl,bc=(xe+xl)/2;
  var g=new T.PlaneGeometry(bw,depth,Math.round(bw/2),Math.max(4,Math.round(depth)));
  g.rotateX(-Math.PI/2);g.translate(bc,0,(-5+th.mz)/2);
  var p=g.attributes.position,uv=g.attributes.uv;
  for(var i=0;i<p.count;i++){var x=p.getX(i),z=p.getZ(i);p.setY(i,mY(x,z));uv.setXY(i,x/7,z/7)}
  g.computeVertexNormals();
  add(mesh(g,m3.meadow,false,true));
  var cw=bw+20,cg=new T.PlaneGeometry(cw,14),cuv=cg.attributes.uv;
  for(var j=0;j<cuv.count;j++)cuv.setXY(j,cuv.getX(j)*cw/3,cuv.getY(j)*4.7);
  var cl=mesh(cg,m3.cliff,false,true);cl.position.set(bc,-6.9,-5);if(!th.aurora&&!th.wreck)add(cl);/* Mundo 18: é tudo água, sem paredão de terra */
  var vg=new T.PlaneGeometry(cw,60);vg.rotateX(-Math.PI/2);
  var vl=mesh(vg,M(th.valley,1),false,true);vl.position.set(bc,-11,-3);if(!th.aurora&&!th.wreck)add(vl);
  if(th.name==='cave'){
    var ww=Math.max(320,cw+20),wg=new T.PlaneGeometry(ww,64),wuv=wg.attributes.uv;
    for(var k=0;k<wuv.count;k++)wuv.setXY(k,wuv.getX(k)*ww/8,wuv.getY(k)*8);
    var wl=mesh(wg,caveWallM,false,true);wl.position.set(Math.max(100,bc),20,th.mz-1);add(wl);
  }
}