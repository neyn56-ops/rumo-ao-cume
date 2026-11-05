/*@@parte:24_caverna.js*/
/* ===================== caverna de cristal: cachos de cristal, estalactites, rochas e saída iluminada ===================== */
var crysGeoC=null;
function crysGeo(){
  /* cristal de 6 lados com ponta (altura 1, base na origem); faces retas */
  if(crysGeoC)return crysGeoC;
  var body=new T.CylinderGeometry(.17,.19,.74,6,1);body.translate(0,.37,0);
  var tip=new T.ConeGeometry(.17,.26,6,1);tip.translate(0,.74+.13,0);
  var pos=[];[body,tip].forEach(function(g){var n=g.toNonIndexed().attributes.position.array;for(var i=0;i<n.length;i++)pos.push(n[i])});
  var out=new T.BufferGeometry();out.setAttribute('position',new T.Float32BufferAttribute(pos,3));out.computeVertexNormals();
  return crysGeoC=out;
}
var crysMatC=null;
function crysMat(){
  if(crysMatC)return crysMatC;
  crysMatC=M(0xffffff,.1,.05,{emissive:0x1650c8,emissiveIntensity:.38,flatShading:true});return crysMatC;
}

/* boca da caverna: arco de rocha com estalactites, pedras na entrada e o céu claro lá fora */
function buildCaveMouth(oA,oB){
  var r=rnd(4040),d=new T.Object3D(),col=new T.Color(),fy=4.2,i;
  var rockM=M(0xffffff,.95,0,{flatShading:true});
  /* parede da boca (plano com buraco em arco) */
  var W0=oA-22,W1=oA+14,sh=new T.Shape();sh.moveTo(W0,-14);sh.lineTo(W1,-14);sh.lineTo(W1,24);sh.lineTo(W0,24);sh.lineTo(W0,-14);
  var hole=new T.Path(),hx=oA+4.5,hw=6.2,hh=8.6;
  hole.moveTo(hx-hw,fy-1);for(var a=0;a<=24;a++){var t=a/24*Math.PI,jag=(a%2?.35:0)+(r()-.5)*.5;hole.lineTo(hx-Math.cos(t)*(hw+jag),fy-1+Math.sin(t)*(hh+jag))}hole.lineTo(hx-hw,fy-1);
  sh.holes.push(hole);
  var wg=new T.ShapeGeometry(sh,24),wuv=wg.attributes.uv,wp=wg.attributes.position;for(var u0=0;u0<wuv.count;u0++)wuv.setXY(u0,wp.getX(u0)/6,wp.getY(u0)/6);
  var wm=mesh(wg,M(0x6e5468,1,0,{map:texStone.map}),false,true);wm.position.z=-2.2;add(wm);
  var wm2=mesh(wg,new T.MeshStandardMaterial({color:0x3a2840,roughness:1}),false,false);wm2.position.z=-2.6;add(wm2);
  /* espessura do arco: pedras grandes em volta do buraco */
  var rk=[];for(var a2=0;a2<=26;a2++){var t2=a2/26*Math.PI,px=hx-Math.cos(t2)*(hw+.6),py=fy-1+Math.sin(t2)*(hh+.6);rk.push([px,py,-1.6-r()*.6,.9+r()*.8])}
  var rm=inst(new T.DodecahedronGeometry(1,0),rockM,rk.length,false);
  rk.forEach(function(q,k){d.position.set(q[0],q[1],q[2]);d.rotation.set(r()*3,r()*3,r()*3);d.scale.set(q[3],q[3]*1.1,q[3]*.8);d.updateMatrix();rm.setMatrixAt(k,d.matrix);rm.setColorAt(k,hsl(col,.82+r()*.06,.16,.16+r()*.08))});add(rm);
  /* estalactites penduradas no alto do arco */
  var st=[];for(i=0;i<22;i++){var t3=.15+r()*.7,sx=hx-Math.cos(t3*Math.PI)*hw*.95,sy=fy-1+Math.sin(t3*Math.PI)*hh+.4;st.push([sx,sy,-1.7+r()*.4,.25+r()*.4,1+r()*2.6])}
  var cg=new T.ConeGeometry(1,1,6);cg.rotateX(Math.PI);cg.translate(0,-.5,0);
  var sm=inst(cg,rockM,st.length,false);st.forEach(function(q,k){d.position.set(q[0],q[1],q[2]);d.rotation.set(0,r()*6,0);d.scale.set(q[3],q[4],q[3]);d.updateMatrix();sm.setMatrixAt(k,d.matrix);sm.setColorAt(k,hsl(col,.8+r()*.06,.16,.18+r()*.08))});add(sm);
  /* pedras no chão da entrada */
  var fr=[[hx-5.4,.9],[hx-3.6,.5],[hx+5.2,.8],[hx+3.3,.45],[hx+.8,.4]],bm=inst(new T.DodecahedronGeometry(1,0),rockM,fr.length,true);
  fr.forEach(function(q,k){d.position.set(q[0],fy+q[1]*.25,-1.2-r()*.5);d.rotation.set(r(),r()*6,r());d.scale.set(q[1]*1.4,q[1],q[1]*1.1);d.updateMatrix();bm.setMatrixAt(k,d.matrix);bm.setColorAt(k,hsl(col,.82,.14,.14+r()*.06))});add(bm);
  /* lá fora: céu claro com montanhas e campo verde (fica atrás da boca) */
  var c=document.createElement('canvas');c.width=512;c.height=256;var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#5f9ee0');g.addColorStop(.75,'#cfe6f6');g.addColorStop(1,'#eef6fb');x.fillStyle=g;x.fillRect(0,0,512,256);
  x.fillStyle='rgba(255,255,255,.9)';for(i=0;i<7;i++){var cx=r()*512,cy=60+r()*90;x.beginPath();x.ellipse(cx,cy,34+r()*40,10+r()*7,0,0,6.283);x.fill()}
  var pk=[];for(i=0;i<=12;i++)pk.push([i/12*512+(r()-.5)*16,(i%2?222:176)+r()*14]);
  x.fillStyle='#7d93b4';x.beginPath();x.moveTo(0,240);pk.forEach(function(q){x.lineTo(q[0],q[1])});x.lineTo(512,240);x.closePath();x.fill();
  x.fillStyle='#f2f6fb';pk.forEach(function(q,k){if(k%2)return;x.beginPath();x.moveTo(q[0]-16,q[1]+18);x.lineTo(q[0],q[1]);x.lineTo(q[0]+16,q[1]+18);x.lineTo(q[0]+5,q[1]+14);x.lineTo(q[0]-5,q[1]+19);x.fill()});
  x.fillStyle='#7d93b4';x.fillRect(0,236,512,20);
  var tx=new T.CanvasTexture(c);tx.encoding=T.sRGBEncoding;
  /* céu só até antes da sala secreta do cano (senão aparece atrás da parede da sala) */
  var skA=oA-9,skB=Math.min(oB+21,((LV.rooms&&LV.rooms[0])?LV.rooms[0].a:1e9)-.5),skW=skB-skA,skU=skW/(oB-oA+30);
  var skG=new T.PlaneGeometry(skW,34),suv=skG.attributes.uv;for(var si=0;si<suv.count;si++)suv.setX(si,suv.getX(si)*skU);
  var sk=new T.Mesh(skG,new T.MeshBasicMaterial({map:tx,fog:false,toneMapped:false,color:0xd8d8d8}));sk.position.set((skA+skB)/2,fy+15.5,-10.8);add(sk);
  /* luz entrando pela boca */
  var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xfff4d8,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false,opacity:.55}));gl.scale.set(12,11,1);gl.material.opacity=.3;gl.position.set(hx,fy+4,-1.9);add(gl);
  /* grama no chão de fora */
  var gt=mesh(boxGeo(oB-oA-1,.12,3.1,2),grassM,false,true);gt.position.set((oA+oB)/2+.5,fy+.02,0);add(gt);
  /* campo lá fora: mesmo gramado do Vale Verde (chão com textura de grama + folhas 3D balançando) até a montanha do fundo */
  var mw=oB-oA+8,fld=mesh(boxGeo(mw,.3,9,2),grassM,false,true);fld.position.set((oA+oB)/2+2,fy-.13,-6.3);add(fld);
  var lq=+effCfg().lush||0,q=(coarse?.55:1)*(lq>=.75?1:(lq>=.6?.6:.35)),bl=[];
  for(i=0;i<Math.round(mw*9*30*q);i++){var bx=oA+.8+r()*(mw-3),bz=-10.6+r()*8.9;if(Math.abs(bx-hx)<hw+.5&&bz>-2.6)continue;bl.push([bx,fy-.02,bz,.35+r()*.7,.11+r()*.05])}
  if(bl.length){var bg=bladeGeo(),gm=grassMat();gm.uniforms.time=lushU.time;var im=new T.InstancedMesh(bg,gm,bl.length),ar=new Float32Array(bl.length*3);
    bl.forEach(function(b,k){d.position.set(b[0],b[1],b[2]);d.rotation.set(0,r()*6.283,0);d.scale.set(b[4],b[3],b[4]);d.updateMatrix();im.setMatrixAt(k,d.matrix);ar[k*3]=r();ar[k*3+1]=r();ar[k*3+2]=.6+r()*.6});
    bg.setAttribute('aR',new T.InstancedBufferAttribute(ar,3));im.frustumCulled=false;add(im)}
}
function buildCaveDecor(th,r,dummy,col){
  var oA=LV.outA||1e9,oB=LV.outB||-1e9;function outside(x){return x>oA-1.5&&x<oB}
  var lowQ=(+effCfg().lush||0)<.6,K=lowQ?.55:1,i,x;
  var CR=[],q=new T.Quaternion(),e=new T.Euler(),xe=sceneEnd();
  var G=lushGround();
  function cluster(cx,cy,cz,size,n,down){
    for(var k=0;k<n;k++){
      var a=r()*6.283,rad=r()*size*.45,tilt=(k===0?0:.25+r()*.55)*(down?-1:1);
      var px=cx+Math.cos(a)*rad,pz=cz+Math.sin(a)*rad*.7;
      var h=size*(k===0?1:(.4+r()*.6)),w=size*(.75+r()*.5)*(k===0?1.15:.85);
      CR.push({x:px,y:cy,z:pz,h:h,w:w,rx:Math.sin(a)*tilt,rz:-Math.cos(a)*tilt,ry:r()*6.28,down:down,l:.34+r()*.2});
    }
  }
  /* cachos grandes no fundo */
  var nb=Math.round(42*K);
  for(i=0;i<nb;i++){x=-14+r()*(xe+10);var z=-7-r()*16;cluster(x,mY(x,z)-.15,z,1.4+r()*2.6,4+Math.floor(r()*5),false)}
  /* cachos na beira de trás das plataformas (fora do caminho) */
  G.list.forEach(function(sd){var n=Math.max(0,Math.round(sd.w/(lowQ?7:4.2)));
    for(var j=0;j<n;j++){var cx=sd.l+.6+r()*(sd.w-1.2);if(!G.ok(cx))continue;cluster(cx,sd.t-.05,-3.4-r()*1.3,.7+r()*.9,3+Math.floor(r()*4),false)}});
  /* alguns pequenos na frente */
  G.list.forEach(function(sd){if(r()<.5||sd.w<3)return;var cx=sd.l+.5+r()*(sd.w-1);if(!G.ok(cx))return;cluster(cx,sd.t-.05,1.45,.45+r()*.3,3,false)});
  /* estalactites de cristal no teto */
  if(!lowQ){var ns=60;for(i=0;i<ns;i++){x=-14+r()*(xe+10);cluster(x,15.5,-5-r()*18,1.2+r()*2.4,3+Math.floor(r()*4),true)}}
  CR=CR.filter(function(o){return !outside(o.x)});var cg=crysGeo(),cm=inst(cg,crysMat(),Math.max(1,CR.length),false);
  CR=CR.filter(function(o){return !outside(o.x)});
  CR.forEach(function(o,k){
    e.set(o.rx+(o.down?Math.PI:0),o.ry,o.rz);dummy.quaternion.setFromEuler(e);dummy.position.set(o.x,o.y,o.z);dummy.scale.set(o.w,o.h,o.w);dummy.updateMatrix();
    cm.setMatrixAt(k,dummy.matrix);cm.setColorAt(k,hsl(col,.57+r()*.03,.82,o.l));
  });
  add(cm);
  /* rocha: pedras e estalagmites marrons no fundo, estalactites de rocha no teto */
  var coneG=new T.ConeGeometry(1,1,7);coneG.translate(0,.5,0);
  var rm=M(0xffffff,.95,0,{flatShading:true}),nu=Math.round(40*K),up=inst(coneG,rm,nu,true);
  for(i=0;i<nu;i++){x=-20+r()*(xe+20);var z2=-8-r()*16,h2=1.5+r()*4,w2=.7+r()*1.3;
    dummy.position.set(x,mY(x,z2)-.2,z2);dummy.rotation.set(0,r()*6,0);dummy.scale.set(w2,h2,w2);dummy.updateMatrix();up.setMatrixAt(i,dummy.matrix);up.setColorAt(i,hsl(col,.07+r()*.03,.32,.22+r()*.1))}
  add(up);
  if(!lowQ){var nd=40,dn=inst(coneG,rm,nd,false);
    for(i=0;i<nd;i++){x=-20+r()*(xe+20);var z3=-5-r()*20,l3=2+r()*5,w3=.6+r()*1.1;
      dummy.position.set(x,16.5,z3);dummy.rotation.set(Math.PI,r()*6,0);dummy.scale.set(w3,l3,w3);dummy.updateMatrix();dn.setMatrixAt(i,dummy.matrix);dn.setColorAt(i,hsl(col,.07+r()*.03,.3,.18+r()*.08))}
    add(dn)}
  var rocks=inst(new T.IcosahedronGeometry(1,0),rm,Math.round(36*K),true);
  for(i=0;i<rocks.count;i++){x=-12+r()*(xe+10);var z4=-6-r()*18,s4=.4+r()*1.2;
    dummy.position.set(x,mY(x,z4)+s4*.2,z4);dummy.rotation.set(r()*3,r()*6,r()*3);dummy.scale.set(s4*(1+r()*.5),s4*(.6+r()*.3),s4);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);rocks.setColorAt(i,hsl(col,.08,.28,.3+r()*.12))}
  add(rocks);
  /* teto de rocha (aparece no alto da tela) */
  function ceilPart(x0,x1){if(x1<=x0)return;var w=x1-x0,tg=new T.PlaneGeometry(w,40),tuv=tg.attributes.uv;for(var k3=0;k3<tuv.count;k3++)tuv.setXY(k3,tuv.getX(k3)*w/8,tuv.getY(k3)*5);
    tg.rotateX(Math.PI/2);var ceil=mesh(tg,caveWallM,false,false);ceil.position.set((x0+x1)/2,17.2,-10);add(ceil)}
  if(LV.outA){ceilPart(-40,oA);ceilPart(oB,xe+20);buildCaveMouth(oA,oB)}else ceilPart(-40,xe+20);

}
function buildDecorPeaks(th){
  var r=rnd(3517),d=new T.Object3D(),col=new T.Color(),xe=sceneEnd(),i,k;
  var lowQ=(+effCfg().lush||0)<.6,K=lowQ?.6:1;
  var lk=th.aurora&&LV.lake?function(x,z){return x>LV.lake[0]-3&&x<LV.lake[1]+3&&z>-46}:function(){return false};/* Lago da Aurora: nada de pedra em cima do lago congelado */
  /* afloramentos de rocha marrom serrilhada, com neve nos topos */
  var rk=[],cap=[];
  for(i=0;i<Math.round(30*K);i++){
    var x=-16+r()*(xe+10),z=-10-r()*26,base=mY(x,z),n=3+Math.floor(r()*5),sc=1.6+r()*3.4;if(lk(x,z))continue;
    for(k=0;k<n;k++){var px=x+(k-n/2)*sc*.7+(r()-.5)*sc*.5,pz=z+(r()-.5)*sc*.6,h=sc*(.5+r()*.9)*(1-Math.abs(k-n/2)/n*.8),w=sc*(.5+r()*.45);
      rk.push([px,base-.3,pz,w,h,w*(.6+r()*.5),r()*6,(r()-.5)*.5]);}
    cap.push([x,base-.25,z,sc*n*.42,sc*.28,sc*.9]);/* neve acumulada na base */
  }
  var rg=new T.DodecahedronGeometry(.6,0);rg.scale(1,1.4,1);rg.translate(0,.42,0);
  (function(){var p=rg.attributes.position,rr=rnd(77);for(var v=0;v<p.count;v++){if(p.getY(v)>.05&&p.getY(v)<.95){p.setX(v,p.getX(v)*(.75+rr()*.5));p.setZ(v,p.getZ(v)*(.75+rr()*.5))}}rg.computeVertexNormals()})();
  var rm=inst(rg,M(0xffffff,.95,0,{flatShading:true}),rk.length,true);
  rk.forEach(function(q,j){d.position.set(q[0],q[1],q[2]);d.rotation.set(q[7],q[6],q[7]*.6);d.scale.set(q[3],q[4],q[5]);d.updateMatrix();rm.setMatrixAt(j,d.matrix);rm.setColorAt(j,hsl(col,.06+r()*.03,.28+r()*.1,.16+r()*.1))});
  add(rm);
  if(cap.length){var cg=new T.SphereGeometry(1,8,5,0,6.283,0,1.4),cm=inst(cg,M(0xffffff,.8,0,{flatShading:true}),cap.length,false);
    cap.forEach(function(q,j){d.position.set(q[0],q[1],q[2]);d.rotation.set(0,r()*6,0);d.scale.set(q[3],q[4],q[5]);d.updateMatrix();cm.setMatrixAt(j,d.matrix);cm.setColorAt(j,hsl(col,.6,.2,.93))});add(cm)}
  /* pedras soltas: no fundo e na beira de trás das plataformas */
  var st=[],G=lushGround();
  for(i=0;i<Math.round(90*K);i++){var x2=-12+r()*(xe+5),z2=-5.5-r()*22;if(!lk(x2,z2))st.push([x2,mY(x2,z2),z2,.25+r()*.9])}
  G.list.forEach(function(sd){if(lk(sd.l+sd.w/2,-4))return;var n2=Math.round(sd.w*(lowQ?.35:.6));for(var j=0;j<n2;j++){var x3=sd.l+.3+r()*(sd.w-.6);st.push([x3,sd.t,-3.6-r()*1.4,.15+r()*.35])}});
  var sm=inst(new T.DodecahedronGeometry(1,0),M(0xffffff,.92,0,{flatShading:true}),st.length,true);
  st.forEach(function(q,j){d.position.set(q[0],q[1]+q[3]*.2,q[2]);d.rotation.set(r()*3,r()*6,r()*3);d.scale.set(q[3]*(1+r()*.5),q[3]*(.55+r()*.35),q[3]*(1+r()*.4));d.updateMatrix();sm.setMatrixAt(j,d.matrix);sm.setColorAt(j,hsl(col,.06+r()*.04,.28+r()*.14,.24+r()*.16))});
  add(sm);
}
function buildDecor(th){
  if(th.name==='forest')return;
  if(th.name==='sky'){buildDecorSky();return}
  if(th.name==='tower'){buildDecorTower(th);return}
  if(th.name==='mine'){buildDecorMine(th);return}
  if(th.name==='maze'){mzDecor(th);return}
  if(th.name==='wreck'){wkDecor(th);return}
  if(th.name==='castle'){buildDecorCastle(th);return}
  if(th.name==='village'){buildDecorVillage(th);return}
  if(th.name==='heights'){buildDecorHeights(th);return}
  if(th.name==='volcano'){buildDecorVolcano(th);return}
  if(th.name==='summit'){buildDecorSummit(th);return}
  if(th.name==='reef'){buildDecorReef(th);return}
  if(th.name==='ruins'){buildDecorRuins(th);return}
  if(th.name==='peaks'){buildDecorPeaks(th);return}
  var r=rnd(77+LV.theme*13),dummy=new T.Object3D(),col=new T.Color(),i,x;
  if(th.roots){rtDecor(th,r,dummy);return}/* Mundo 21: raízes, cogumelos que brilham */
  if(th.name==='cave'){buildCaveDecor(th,r,dummy,col);return}
  var snow=th.name==='peaks',list=[];
  for(x=(th.name==='trail'?17:-20);x<215;x+=(snow?2.6:3.1)+r()*(snow?2.4:3.2)){
    var zt=-6.5-r()*30;
    list.push({x:x,z:zt,y:mY(x,zt)-.1,s:.8+r()*.9,sp:snow?0:(r(),1),rot:r()*6.28});
  }
  var r2=rnd(311+LV.theme),xe2=sceneEnd()-10;
  for(;x<xe2;x+=(snow?2.6:3.1)+r2()*(snow?2.4:3.2)){
    var zt2=-6.5-r2()*30;
    list.push({x:x,z:zt2,y:mY(x,zt2)-.1,s:.8+r2()*.9,sp:snow?0:(r2(),1),rot:r2()*6.28});
  }
  if(th.dry)list=list.filter(function(t,k){return k%4===0});
  if(th.canyon)list=[];/* Cânion: sem árvores (tem cactos) *//* região seca: só umas árvores soltas */
  var con=list.filter(function(t){return t.sp===0}),bro=list.filter(function(t){return t.sp===1});
  var trunkG=new T.CylinderGeometry(.2,.32,1,6);trunkG.translate(0,.5,0);
  var tr=inst(trunkG,M(0x5a4030,.95),list.length,true);
  list.forEach(function(t,k){
    dummy.position.set(t.x,t.y,t.z);dummy.rotation.set(0,t.rot,0);
    dummy.scale.set(t.s,(t.sp===0?2.4:2.2)*t.s,t.s);dummy.updateMatrix();tr.setMatrixAt(k,dummy.matrix);
  });
  add(tr);
  var coneG2=new T.ConeGeometry(1,1.6,8);coneG2.translate(0,.8,0);
  var coneM=M(0xffffff,.9);
  for(var L=0;L<3;L++){
    var cn=inst(coneG2,coneM,con.length,true);
    con.forEach(function(t,k){
      dummy.position.set(t.x,t.y+(1.3+L*1.15)*t.s,t.z);dummy.rotation.set(0,t.rot,0);
      var rad=(2.1-L*.55)*t.s;dummy.scale.set(rad,1.25*t.s,rad);dummy.updateMatrix();cn.setMatrixAt(k,dummy.matrix);
      cn.setColorAt(k,snow?hsl(col,.56,.14+r()*.1,.8+r()*.12):hsl(col,.36+r()*.04,.42+r()*.1,.17+r()*.07));
    });
    add(cn);
  }
  if(bro.length){
    /* copa em cachos: 5 a 7 bolas facetadas de tamanhos diferentes; mais escura embaixo e clara em cima */
    var rb=rnd(5150+LV.theme),blobs=[];
    bro.forEach(function(t){
      var cx=t.x+.25*t.s,cy=t.y+3.05*t.s,cz=t.z,n=5+Math.floor(rb()*3);t.blobs=[];
      t.blobs.push([cx,cy,cz,1.35*t.s,1.1*t.s,1.3*t.s]);/* miolo */
      for(var j=1;j<n;j++){
        var a=j/(n-1)*6.283+rb()*.8,el=(rb()-.35)*1.1,rad=(.95+rb()*.35)*t.s;
        var bx=cx+Math.cos(a)*Math.cos(el)*rad,by=cy+Math.sin(el)*rad*.8+.15*t.s,bz=cz+Math.sin(a)*Math.cos(el)*rad*.8;
        var sz=(.7+rb()*.45)*t.s;t.blobs.push([bx,by,bz,sz,sz*(.78+rb()*.15),sz*(.9+rb()*.2)]);
      }
      t.blobs.forEach(function(b){blobs.push({b:b,t:t})});
    });
    var icoG=new T.IcosahedronGeometry(1,1),icoM=M(0xffffff,.9,0,{flatShading:true});broMat=icoM;
    var bm2=inst(icoG,icoM,blobs.length,true);
    blobs.forEach(function(o,k){var b=o.b,t=o.t,rel=clamp((b[1]-(t.y+2.2*t.s))/(2*t.s),0,1);
      dummy.position.set(b[0],b[1],b[2]);dummy.rotation.set(rb()*.6,rb()*6.28,rb()*.6);dummy.scale.set(b[3],b[4],b[5]);dummy.updateMatrix();bm2.setMatrixAt(k,dummy.matrix);
      bm2.setColorAt(k,th.dry?hsl(col,.11+rb()*.04,.38+rb()*.12,.22+rel*.14+rb()*.04):hsl(col,.25+rb()*.05,.42+rb()*.1,.17+rel*.17+rb()*.04));
    });
    add(bm2);
  }
  var rocks=[],k2;
  for(k2=0;k2<(th.dry?110:46);k2++){
    var rx=-10+r()*210,rz=-3.5-r()*3,tt2=topAt(rx);
    if(k2%2===0&&tt2>-90){if(!solids.some(function(q){return q.mz&&!q.dead&&rx>q.l-.6&&rx<q.r+.6&&q.t>=tt2-.01}))rocks.push({x:rx,y:tt2,z:rz,s:.25+r()*.5})}/* nada em cima de tijolo que quebra (ficava flutuando) */
    else{var mz=-8-r()*24;rocks.push({x:rx,y:mY(rx,mz),z:mz,s:.5+r()*1.2})}
  }
  var rm=inst(new T.IcosahedronGeometry(1,0),M(0xffffff,.9,0,{flatShading:true}),rocks.length,true);
  rocks.forEach(function(q,k){
    dummy.position.set(q.x,q.y+q.s*.25,q.z);dummy.rotation.set(r()*3,r()*6,r()*3);
    dummy.scale.set(q.s*(1+r()*.5),q.s*(.6+r()*.3),q.s*(1+r()*.4));dummy.updateMatrix();rm.setMatrixAt(k,dummy.matrix);
    rm.setColorAt(k,snow?hsl(col,.6,.1,.5+r()*.15):th.dry?hsl(col,.07+r()*.02,.22+r()*.1,.42+r()*.14):hsl(col,.09,.06+r()*.05,.38+r()*.14));
  });
  add(rm);
  if(!snow){
    var tufts=[];
    solids.forEach(function(s){
      if(s.oneway||s.flt||s.sand)return;
      var w=s.r-s.l;if(w<1)return;
      var n=Math.floor(w*(th.dry?1.6:5)),k3;
      for(k3=0;k3<n;k3++)tufts.push({x:s.l+r()*w,y:s.t,z:.9+r()*.85});
      for(k3=0;k3<Math.floor(w*2);k3++)tufts.push({x:s.l+r()*w,y:s.t,z:-4.6+r()*2.8});
    });
    var tg;if(th.dry){tg=new T.DodecahedronGeometry(.14,0);tg.scale(1.3,.55,1.1);tg.translate(0,.05,0)}else{tg=new T.ConeGeometry(.05,.34,4);tg.translate(0,.17,0)}/* região seca: moitinhas baixas e redondas (os tufos pontudos pareciam espinhos) */
    var tf=inst(tg,M(0xffffff,.9),tufts.length,false);
    tufts.forEach(function(q,k){
      dummy.position.set(q.x,q.y,q.z);dummy.rotation.set((r()-.5)*.4,r()*6,(r()-.5)*.4);
      var sc=.7+r()*.9;dummy.scale.set(sc,sc*(.8+r()*.8),sc);dummy.updateMatrix();tf.setMatrixAt(k,dummy.matrix);
      tf.setColorAt(k,th.dry?hsl(col,.09+r()*.03,.3,.3+r()*.1):hsl(col,.24+r()*.07,.5,.3+r()*.14));
    });
    add(tf);tuftMesh=tf;
  }
  lastBro=bro;
}
