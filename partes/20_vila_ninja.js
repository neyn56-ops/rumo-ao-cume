/*@@parte:20_vila_ninja.js*/
/* ===================== decoração e fundo do castelo ===================== */
/* ===================== Mundo 8: Vila Ninja (noite) ===================== */
var vilMats=null,vilLan=[],ropes=[],pulleys=[],vdoors=[],alarmT=0,alarmEl=null,vilHidToast=false;
var kawaraT=null;
function kawaraTex(){
  if(kawaraT)return kawaraT;
  /* telhas japonesas (kawara): colunas arredondadas e fileiras com sombra */
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');x.fillStyle='#8a90a0';x.fillRect(0,0,128,128);
  for(var i=0;i<8;i++){var g=x.createLinearGradient(i*16,0,i*16+16,0);g.addColorStop(0,'#5a606c');g.addColorStop(.45,'#c4c8d0');g.addColorStop(.7,'#a4a8b4');g.addColorStop(1,'#4a4e5a');x.fillStyle=g;x.fillRect(i*16,0,16,128)}
  for(var j=0;j<4;j++){x.fillStyle='rgba(20,22,30,.75)';x.fillRect(0,j*32+28,128,4);x.fillStyle='rgba(255,255,255,.25)';x.fillRect(0,j*32,128,2)}
  kawaraT=new T.CanvasTexture(c);kawaraT.wrapS=kawaraT.wrapT=T.RepeatWrapping;kawaraT.encoding=T.sRGBEncoding;kawaraT.anisotropy=4;return kawaraT;
}
function vilM(){
  if(vilMats)return vilMats;
  vilMats={
    wall:M(0xc9bc9e,.95),
    beam:M(0x3a2a20,.85),
    roof:M(0x4c5468,.7,.1,{map:kawaraTex()}),
    roofP:M(0x4a6e66,.7,.1,{map:kawaraTex()}),
    red:M(0xa8322a,.7),
    win:new T.MeshBasicMaterial({color:0xffc27a}),
    dark:M(0x24202a,.9),
    paper:M(0xf2ead8,.9),
    rope:M(0x8a6a44,.9)
  };
  return vilMats;
}
/* lanternas de papel (todas num lote só) + brilho em pontos */
function vilLantern(x,y,z,s,warm){vilLan.push([x,y,z,s||1,warm?1:0])}
function buildVilLanterns(){
  if(!vilLan.length)return;
  var lite=coarse&&(+effCfg().lush||0)<.6,L=lite?vilLan.filter(function(q,i){return i%2===0}):vilLan;
  var g=new T.SphereGeometry(.3,12,10),cap=new T.CylinderGeometry(.17,.17,.08,10);
  var lm=new T.MeshStandardMaterial({color:0xd8402a,roughness:.6,emissive:0xff5a2a,emissiveIntensity:1.1}),cm=M(0x1c1612,.6);
  var im=inst(g,lm,L.length,false),ic=inst(cap,cm,L.length*2,false),d=new T.Object3D();
  L.forEach(function(q,k){d.position.set(q[0],q[1],q[2]);d.rotation.set(0,0,0);d.scale.set(q[3],q[3]*1.25,q[3]);d.updateMatrix();im.setMatrixAt(k,d.matrix);
    if(q[4])im.setColorAt(k,new T.Color(0xffd890));
    [1,-1].forEach(function(sd,j){d.position.set(q[0],q[1]+sd*.36*q[3],q[2]);d.scale.setScalar(q[3]);d.updateMatrix();ic.setMatrixAt(k*2+j,d.matrix)})});
  if(im.instanceColor)im.instanceColor.needsUpdate=true;
  add(im);add(ic);
  var pos=new Float32Array(L.length*3);L.forEach(function(q,k){pos[k*3]=q[0];pos[k*3+1]=q[1];pos[k*3+2]=q[2]+.05});
  var pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));
  var pts=new T.Points(pg,new T.PointsMaterial({map:softSprite(),color:0xff9a50,size:2.6,transparent:true,opacity:.75,blending:T.AdditiveBlending,depthWrite:false,fog:false}));
  pts.frustumCulled=false;add(pts);
}
/* corte do telhado (z,y) relativo ao topo; walk = faixa plana em cima (onde o Kuro anda) */
function roofShape(front,back,drop){
  var s=new T.Shape();
  s.moveTo(front,-drop-.15);s.lineTo(front+.08,-drop);s.lineTo(1.0,0);s.lineTo(-1.4,0);s.lineTo(back,-drop*1.4);s.lineTo(back,-drop*1.4-.16);s.lineTo(-1.4,-.2);s.lineTo(1.0,-.2);s.lineTo(front,-drop-.15);
  return s;
}
function roofGeo(x0,x1,top,front,back,drop){
  var g=new T.ExtrudeGeometry(roofShape(front,back,drop),{depth:x1-x0,bevelEnabled:false,steps:1});
  /* shape no plano (x=z do mundo, y), extrusão em z -> gira para a extrusão virar o eixo x */
  g.rotateY(-Math.PI/2);g.translate(x1,top,0);
  var uv=g.attributes.uv;for(var i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*.6,uv.getY(i)*.6);
  return g;
}
function buildPlatformsVillage(m3){
  var V=vilM(),r=rnd(808),Wl=[],Bm=[],Rf=[],RfP=[],Wn=[],Dk=[],Rd=[],i;
  LV.solids.forEach(function(s){
    var x0=s[0],x1=s[1],top=s[2],bot=s[3]!==undefined?s[3]:-14,w=x1-x0,cx=(x0+x1)/2,kind=s[5];
    solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,slip:!!s[4]});
    if(kind!=='house'&&kind!=='pag'){
      var body=mesh(boxGeo(w,top-.3-bot,6.8,2.6),m3.side);body.position.set(cx,(top-.3+bot)/2,-1.6);add(body);
      var lip=mesh(boxGeo(w+.14,.34,6.94,2.2),m3.top);lip.position.set(cx,top-.17,-1.6);add(lip);
      return;
    }
    var pag=kind==='pag',wt=top-1.0,wb=Math.max(bot,0),zf=pag?1.2:1.5,zb=-4.8;
    /* parede (com passagem por baixo quando a base é alta) */
    if(wt>wb)Wl.push({g:xf(boxGeo(w-.2,wt-wb,zf-zb,2.4),[cx,(wt+wb)/2,(zf+zb)/2])});
    Wl.push({g:xf(boxGeo(w-.4,1.0,2.4,2.4),[cx,top-.55,-.2])});/* sótão (fecha o vão sob a cumeeira) */
    if(bot>0){
      /* passagem: fundo escuro de madeira com janela acesa, pilares na frente */
      Bm.push({g:xf(new T.BoxGeometry(w,bot,.3),[cx,bot/2,-4.7])});
      for(var wx=x0+2;wx<x1-1.5;wx+=4)Wn.push({g:xf(new T.PlaneGeometry(1.4,1.0),[wx,1.5,-4.53])});
      [x0+.25,x1-.25].forEach(function(px){Bm.push({g:xf(new T.BoxGeometry(.3,bot,.3),[px,bot/2,1.4])});Bm.push({g:xf(new T.BoxGeometry(.3,bot,.3),[px,bot/2,-4.4])})});
    }
    /* vigas e janelas de papel na fachada */
    var n=Math.max(2,Math.round(w/2.4)),st=(w-.4)/n;
    if(wt>wb+.3){
      for(i=0;i<=n;i++)(pag?Rd:Bm).push({g:xf(new T.BoxGeometry(.2,wt-wb,.16),[x0+.2+i*st,(wt+wb)/2,zf+.06])});
      Bm.push({g:xf(new T.BoxGeometry(w-.2,.16,.18),[cx,wt-.1,zf+.07])});Bm.push({g:xf(new T.BoxGeometry(w-.2,.14,.18),[cx,wb+.3,zf+.07])});
      var wh=Math.min(1.0,(wt-wb)*.45),wy=(wt+wb)/2+.05;
      for(i=0;i<n;i++){var px2=x0+.2+(i+.5)*st,lit=r()<(pag?.85:.7);
        (lit?Wn:Dk).push({g:xf(new T.PlaneGeometry(st*.62,wh),[px2,wy,zf+.02])});
        if(lit){Bm.push({g:xf(new T.BoxGeometry(st*.62,.04,.04),[px2,wy,zf+.05])});Bm.push({g:xf(new T.BoxGeometry(.04,wh,.04),[px2,wy,zf+.05])})}}
    }
    /* telhado de telhas com beiral, pontas viradas para cima e lanternas nos cantos */
    var fr=pag?3.0:2.4,bk=pag?-6:-5.4,dr=pag?1.05:.85,RR=pag?RfP:Rf,ww=w+1.1;
    RR.push({g:xf(boxGeo(ww,.2,2.4,2.5),[cx,top-.1,-.2])});
    var Lf=Math.hypot(fr-1.0,dr),af=Math.atan2(dr,fr-1.0);RR.push({g:xf(boxGeo(ww,.14,Lf,2.5),[cx,top-.1-dr/2,(1.0+fr)/2],[af,0,0])});
    var Lb=Math.hypot(-1.4-bk,dr*1.4),ab=Math.atan2(dr*1.4,-1.4-bk);RR.push({g:xf(boxGeo(ww,.14,Lb,2.5),[cx,top-.1-dr*.7,(-1.4+bk)/2],[-ab,0,0])});
    Bm.push({g:xf(new T.BoxGeometry(ww+.05,.16,.12),[cx,top-dr-.12,fr+.02])});
    [x0-.55,x1+.55].forEach(function(ex,j){var sd=j?1:-1;(pag?RfP:Rf).push({g:xf(new T.ConeGeometry(.13,.6,6),[ex,top-dr+.12,fr-.05],[.5,0,-sd*.9])})});
    Bm.push({g:xf(new T.BoxGeometry(w+1.1,.14,.22),[cx,top+.02,-1.55])});/* cumeeira atrás da faixa de andar */
    vilLantern(x0-.25,top-dr-.7,fr-.25,.85);vilLantern(x1+.25,top-dr-.7,fr-.25,.85);
  });
  if(Wl.length)add(mesh(mergeG(Wl),V.wall,true,true));
  if(Bm.length)add(mesh(mergeG(Bm),V.beam,true,false));
  if(Rd.length)add(mesh(mergeG(Rd),V.red,true,false));
  if(Rf.length)add(mesh(mergeG(Rf),V.roof,true,true));
  if(RfP.length)add(mesh(mergeG(RfP),V.roofP,true,true));
  if(Wn.length)add(mesh(mergeG(Wn),V.win,false,false));
  if(Dk.length)add(mesh(mergeG(Dk),V.dark,false,false));
  LV.floats.forEach(function(f){
    var w=f[1]-f[0],cx=(f[0]+f[1])/2,m=mesh(boxGeo(w,.5,3,1.5),m3.slab);m.position.set(cx,f[2]-.25,0);add(m);
    solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.5,oneway:false,flt:true});
  });
}
/* ---------- cenário: casas ao fundo, cerejeiras, lanternas de pedra, cerca de bambu, torii, rio e biombos ---------- */
function buildDecorVillage(th){
  var V=vilM(),r=rnd(4242),d=new T.Object3D(),i,k,xe=sceneEnd(),lq=+effCfg().lush||0,lite=coarse&&lq<.6;
  /* duas fileiras de casas no fundo (lotes instanciados: parede, telhado, janelas) */
  var BH=[];for(var row=0;row<2;row++){for(var x=-30;x<xe+20;x+=5.5+r()*4){var z=row?-24-r()*6:-11-r()*3.5;BH.push({x:x,z:z,w:3.6+r()*2.6,h:2.2+r()*2.4+(row?1.5:0),row:row})}}
  var prism=new T.CylinderGeometry(.01,1,1,4,1);prism.rotateY(Math.PI/4);
  var bw=inst(new T.BoxGeometry(1,1,1),M(0xa89c84,.95),BH.length,false),br=inst(prism,M(0x2c2c32,.85),BH.length,false);
  var lit=[];BH.forEach(function(b,j){
    d.position.set(b.x,b.h/2,b.z);d.rotation.set(0,0,0);d.scale.set(b.w,b.h,3.2);d.updateMatrix();bw.setMatrixAt(j,d.matrix);
    if(b.row)bw.setColorAt(j,new T.Color(0x6a6474));
    d.position.set(b.x,b.h+.7,b.z);d.scale.set(b.w*.95,1.4,3.4);d.updateMatrix();br.setMatrixAt(j,d.matrix);
    for(var q=0;q<Math.floor(b.w/1.4);q++)if(r()<.6)lit.push([b.x-b.w/2+.7+q*1.4,b.h*.5,b.z+1.62,b.row])});
  if(bw.instanceColor)bw.instanceColor.needsUpdate=true;add(bw);add(br);
  var wn=inst(new T.PlaneGeometry(.7,.8),new T.MeshBasicMaterial({color:0xffc27a}),lit.length,false);
  lit.forEach(function(p,j){d.position.set(p[0],p[1],p[2]);d.rotation.set(0,0,0);d.scale.setScalar(p[3]?.8:1);d.updateMatrix();wn.setMatrixAt(j,d.matrix)});add(wn);
  /* varais com lanternas entre as casas do fundo */
  var RL=[];for(i=0;i<BH.length-1;i++){var a=BH[i],b2=BH[i+1];if(a.row||b2.row||r()<.45)continue;var y=Math.min(a.h,b2.h)+.4,x0=a.x+a.w/2,x1=b2.x-b2.w/2;if(x1-x0<1.5)continue;
    RL.push({g:xf(new T.CylinderGeometry(.025,.025,x1-x0,4),[(x0+x1)/2,y,(a.z+b2.z)/2+1.5],[0,0,Math.PI/2])});
    for(var lx=x0+.8;lx<x1-.5;lx+=1.6)vilLantern(lx,y-.45,(a.z+b2.z)/2+1.5,.6)}
  if(RL.length)add(mesh(mergeG(RL),V.rope,false,false));
  /* cerejeiras: tronco + nuvens de flor rosa */
  var CT=[],CB=[];for(x=-12;x<xe;x+=9+r()*10){var cz=-6.2-r()*3.5,h=2.6+r()*1.6;CT.push([x,cz,h]);for(k=0;k<7;k++)CB.push([x+(r()-.5)*2.8,h+(r()-.2)*1.4,cz+(r()-.5)*1.8,.7+r()*.6])}
  var tg=new T.CylinderGeometry(.12,.22,1,6);tg.translate(0,.5,0);var ti=inst(tg,M(0x3a2620,.9),CT.length,true);
  CT.forEach(function(t,j){d.position.set(t[0],0,t[1]);d.rotation.set(0,0,(r()-.5)*.25);d.scale.set(1,t[2],1);d.updateMatrix();ti.setMatrixAt(j,d.matrix)});add(ti);
  var bi=inst(new T.IcosahedronGeometry(1,1),M(0xffffff,.85),CB.length,false),pk=['#ffb7cf','#ff9ec0','#ffc8da','#f7a6c4'];
  CB.forEach(function(c,j){d.position.set(c[0],c[1],c[2]);d.rotation.set(r()*3,r()*3,r()*3);d.scale.set(c[3]*1.2,c[3]*.8,c[3]);d.updateMatrix();bi.setMatrixAt(j,d.matrix);bi.setColorAt(j,new T.Color(pk[j%4]))});
  if(bi.instanceColor)bi.instanceColor.needsUpdate=true;add(bi);
  /* lanternas de pedra (tōrō) e cerca de bambu atrás da rua, onde não tem casa */
  function covered(x){for(var j=0;j<LV.solids.length;j++){var q=LV.solids[j];if((q[5]==='house'||q[5]==='pag')&&x>q[0]-.6&&x<q[1]+.6)return true}return x>202.5&&x<213.5}
  var TO=[],FB=[];
  for(x=-10;x<xe-30;x+=11+r()*6){if(covered(x))continue;var bz=-3.9;
    TO.push({g:xf(new T.CylinderGeometry(.32,.38,.2,8),[x,.1,bz])},{g:xf(new T.CylinderGeometry(.11,.13,.9,8),[x,.65,bz])},{g:xf(new T.BoxGeometry(.5,.36,.5),[x,1.28,bz])},{g:xf(new T.ConeGeometry(.5,.36,4),[x,1.64,bz],[0,Math.PI/4,0])});
    vilLantern(x,1.28,bz+.2,.35,true)}
  add(mesh(mergeG(TO),M(0x8a8a86,.95,0,{map:texStone.map}),true,false));
  for(x=-14;x<xe-30;x+=.32){if(covered(x))continue;FB.push({g:xf(new T.CylinderGeometry(.06,.06,1.5+((x*7)%1)*.4,5),[x,.75,-4.75])})}
  for(x=-14;x<xe-30;x+=6){if(covered(x+3))continue;FB.push({g:xf(new T.CylinderGeometry(.04,.04,6,4),[x+3,.5,-4.65],[0,0,Math.PI/2])},{g:xf(new T.CylinderGeometry(.04,.04,6,4),[x+3,1.2,-4.65],[0,0,Math.PI/2])})}
  if(FB.length)add(mesh(mergeG(FB),M(0x9a8a54,.8),false,false));
  /* torii vermelho na entrada */
  var TG=[];[-1,1].forEach(function(sd){TG.push({g:xf(new T.CylinderGeometry(.22,.26,4.6,10),[-5+sd*1.8,2.3,-2.2])})});
  TG.push({g:xf(new T.BoxGeometry(5.2,.3,.4),[-5,3.7,-2.2])});
  add(mesh(mergeG(TG),V.red,true,false));
  var tt=mesh(new T.BoxGeometry(6.2,.35,.6),V.dark,true,false);tt.position.set(-5,4.6,-2.2);add(tt);
  /* rio debaixo da ponte, com o reflexo da lua */
  var wm=mesh(new T.PlaneGeometry(11,60),M(0x0c1a34,.12,.4),false,true);wm.rotation.x=-Math.PI/2;wm.position.set(208,-1.1,-26);add(wm);
  var bank=mesh(boxGeo(11,6,2,2),m3wall(),false,true);bank.position.set(208,-4.2,1.6);add(bank);
  var rf=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xbfd4ff,transparent:true,opacity:.35,depthWrite:false,blending:T.AdditiveBlending}));rf.scale.set(3,8,1);rf.position.set(208,-1,-14);add(rf);
  /* ponte em arco (corrimão vermelho por cima da tábua) */
  var BR=[];for(i=0;i<=12;i++){var bx2=202.2+i;BR.push({g:xf(new T.BoxGeometry(.12,.8,.12),[bx2,1.8,1.25])},{g:xf(new T.BoxGeometry(.12,.8,.12),[bx2,1.8,-1.25])})}
  BR.push({g:xf(new T.BoxGeometry(12.2,.12,.14),[208,2.2,1.25])},{g:xf(new T.BoxGeometry(12.2,.12,.14),[208,2.2,-1.25])});
  add(mesh(mergeG(BR),V.red,false,false));
  /* lanternas nos varais do jogo */
  (LV.ropes||[]).forEach(function(q){for(var lx=q[0]+1.2;lx<q[1]-.8;lx+=2.4)vilLantern(lx,q[2]-.55,-.45,.55)});
  /* biombos (esconderijos): ficam na frente do Kuro */
  var bt=(function(){var c=document.createElement('canvas');c.width=128;c.height=128;var x2=c.getContext('2d');x2.fillStyle='#efe4cc';x2.fillRect(0,0,128,128);
    x2.strokeStyle='#5a3a2a';x2.lineWidth=4;x2.beginPath();x2.moveTo(10,120);x2.bezierCurveTo(40,80,70,70,118,30);x2.stroke();
    for(var q=0;q<14;q++){x2.fillStyle=q%2?'#f49ab8':'#ffc0d4';x2.beginPath();x2.arc(30+q*6+(q%3)*4,96-q*5-(q%2)*6,5,0,6.283);x2.fill()}
    var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t})();
  var pm=M(0xffffff,.9,0,{map:bt}),SF=[],SP=[];
  (LV.hides||[]).forEach(function(h){var w=h[1]-h[0],pw=w/3;for(var j=0;j<3;j++){var px=h[0]+pw*(j+.5),ang=(j%2?-.25:.25);
    SP.push({g:xf(new T.PlaneGeometry(pw*.92,1.5),[px,.95,1.05],[0,ang,0])});
    SF.push({g:xf(new T.BoxGeometry(pw,.08,.06),[px,1.72,1.05],[0,ang,0])},{g:xf(new T.BoxGeometry(pw,.08,.06),[px,.18,1.05],[0,ang,0])},{g:xf(new T.BoxGeometry(.06,1.6,.06),[px-pw/2,.95,1.05])})}
    SF.push({g:xf(new T.BoxGeometry(.06,1.6,.06),[h[1],.95,1.05])})});
  if(SP.length){add(mesh(mergeG(SP),pm,false,false));add(mesh(mergeG(SF),V.beam,false,false))}
  buildVilLanterns();
}
function m3wall(){return MATS[LV.theme].side}
function buildFarVillage(th,r){
  /* lua cheia grande, montanhas azuladas, pagode distante e estrelas */
  var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),g=x.createRadialGradient(128,128,10,128,128,128);
  g.addColorStop(0,'rgba(255,252,236,1)');g.addColorStop(.36,'rgba(250,244,220,1)');g.addColorStop(.4,'rgba(200,210,255,.4)');g.addColorStop(1,'rgba(120,140,255,0)');
  x.fillStyle=g;x.fillRect(0,0,256,256);x.fillStyle='rgba(200,190,170,.35)';[[110,100,14],[150,140,10],[120,150,8],[160,105,7]].forEach(function(q){x.beginPath();x.arc(q[0],q[1],q[2],0,6.283);x.fill()});
  var mt=new T.CanvasTexture(c);mt.encoding=T.sRGBEncoding;
  var mo=new T.Sprite(new T.SpriteMaterial({map:mt,transparent:true,depthWrite:false,fog:false}));mo.scale.set(40,40,1);mo.position.set(-28,44,-130);farG.add(mo);
  var i,mm=new T.MeshBasicMaterial({color:0x182448,fog:false}),mm2=new T.MeshBasicMaterial({color:0x0e1630,fog:false});
  for(i=0;i<16;i++){var h=26+r()*30,cn=new T.Mesh(new T.ConeGeometry(18+r()*14,h,5),i%2?mm:mm2);cn.position.set(-160+i*30+r()*12,h/2-6,-110-r()*25);farG.add(cn)}
  var pd=new T.MeshBasicMaterial({color:0x0a0f22,fog:false});
  for(i=0;i<5;i++){var pb=new T.Mesh(new T.BoxGeometry(4-i*.6,3.2,4-i*.6),pd);pb.position.set(-40,2+i*3.6,-95);farG.add(pb);var pr=new T.Mesh(new T.ConeGeometry(4.6-i*.6,1.6,4),pd);pr.rotation.y=Math.PI/4;pr.position.set(-40,4.2+i*3.6,-95);farG.add(pr)}
  var sp=new T.Mesh(new T.CylinderGeometry(.15,.15,6,5),pd);sp.position.set(-40,22,-95);farG.add(sp);
  var n=coarse?140:320,pos=new Float32Array(n*3);for(i=0;i<n;i++){pos[i*3]=-200+r()*420;pos[i*3+1]=20+r()*70;pos[i*3+2]=-140}
  var sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(pos,3));
  farG.add(new T.Points(sg,new T.PointsMaterial({color:0xffffff,size:.9,sizeAttenuation:true,fog:false,transparent:true,opacity:.85})));
  for(i=0;i<6;i++){var cs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0x3a4a7a,transparent:true,depthWrite:false,fog:false,opacity:.35}));var sz=40+r()*40;cs.scale.set(sz,sz*.18,1);cs.position.set(-120+r()*300,30+r()*20,-120);farG.add(cs)}
}
/* ---------- mecânicas: varais (pendurar), polias, portas de correr, esconderijos e alarme ---------- */
function buildVillageMech(){
  var V=vilM();ropes=[];pulleys=[];vdoors=[];
  (LV.ropes||[]).forEach(function(q){
    var x0=q[0],x1=q[1],y=q[2],rm=mesh(new T.CylinderGeometry(.045,.045,x1-x0,6),V.rope,false,false);rm.rotation.z=Math.PI/2;rm.position.set((x0+x1)/2,y,0);add(rm);
    [x0,x1].forEach(function(px){var po=mesh(new T.CylinderGeometry(.08,.08,2.8,6),V.beam,true,false);po.position.set(px,y-1.3,-.6);add(po)});
    ropes.push({rope:true,x0:x0,x1:x1,y:y});
  });
  (LV.pulleys||[]).forEach(function(p){
    var o={y:p.y,d:p.d,s:0,v:0,A:null,B:null,ma:null,mb:null,ra:null,rb:null,top:p.y+6.5,xa:p.xa,xb:p.xb};
    [p.xa,p.xb].forEach(function(px,j){
      var m=mesh(boxGeo(p.w,.4,2.6,1.2),vilPlankM);m.position.set(px,p.y-.2,0);add(m);
      var so={l:px-p.w/2,r:px+p.w/2,t:p.y,b:p.y-.4,oneway:false,flt:true,lift:true,mesh:m};solids.push(so);
      var rp=mesh(new T.CylinderGeometry(.04,.04,1,5),V.rope,false,false);add(rp);
      if(j){o.B=so;o.mb=m;o.rb=rp}else{o.A=so;o.ma=m;o.ra=rp}
    });
    var wh=mesh(new T.TorusGeometry(.5,.1,8,18),V.beam,false,false);wh.position.set((p.xa+p.xb)/2,o.top,-.2);add(wh);o.wh=wh;
    var bar=mesh(new T.CylinderGeometry(.03,.03,p.xb-p.xa,5),V.rope,false,false);bar.rotation.z=Math.PI/2;bar.position.set((p.xa+p.xb)/2,o.top+.5,-.2);add(bar);
    pulleys.push(o);pulleySet(o);
  });
  (LV.doors||[]).forEach(function(q){
    var g=new T.Group(),fr=mesh(new T.BoxGeometry(.16,q.h,.9),V.beam,true,false);fr.position.y=q.h/2;g.add(fr);
    var pa=mesh(new T.PlaneGeometry(.8,q.h-.3),V.paper,false,false);pa.rotation.y=Math.PI/2;pa.position.set(.09,q.h/2,0);g.add(pa);
    for(var k=1;k<4;k++){var lt=mesh(new T.BoxGeometry(.04,.04,.82),V.beam,false,false);lt.position.set(.1,k*q.h/4,0);g.add(lt)}
    g.position.set(q.x,0,0);add(g);
    var so={l:q.x-.2,r:q.x+.2,t:q.h,b:0,oneway:false,wall:true,dead:true};solids.push(so);
    vdoors.push({x:q.x,h:q.h,per:q.per,ph:q.ph||0,g:g,so:so,z:-3,warn:0});
  });
  if(!alarmEl){alarmEl=document.createElement('div');alarmEl.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:3;box-shadow:inset 0 0 120px 30px rgba(255,40,30,.75);opacity:0;transition:opacity .15s';document.body.appendChild(alarmEl)}
  alarmT=0;alarmEl.style.opacity=0;
}
function pulleySet(o){
  o.A.t=o.y-o.s;o.A.b=o.A.t-.4;o.B.t=o.y+o.s;o.B.b=o.B.t-.4;
  o.ma.position.y=o.A.t-.2;o.mb.position.y=o.B.t-.2;
  [[o.ra,o.xa,o.A.t],[o.rb,o.xb,o.B.t]].forEach(function(q){var L=o.top-q[2];q[0].scale.set(1,L,1);q[0].position.set(q[1],q[2]+L/2,-.2)});
  o.wh.rotation.z=-o.s*1.2;
}
function updVillage(dt){
  if(!LV||!LV.pulleys&&!LV.doors&&!LV.hides)return;
  /* polias: o peso do Kuro desce a tábua dele e sobe a outra */
  pulleys.forEach(function(o){
    var onA=P.onPlat===o.A&&P.grounded,onB=P.onPlat===o.B&&P.grounded,tg=onA?o.d:(onB?-o.d:0),sp=(onA||onB)?1.7:.7;
    var ns=o.s+clamp(tg-o.s,-sp*dt,sp*dt),dA=-(ns-o.s),dB=ns-o.s;o.s=ns;pulleySet(o);
    if(onA)P.y+=dA;else if(onB)P.y+=dB;
  });
  /* portas de correr: abrem e fecham no ritmo; não fecham em cima do Kuro */
  vdoors.forEach(function(d){
    var u=((mt+d.ph)%d.per+d.per)%d.per,shut=u<d.per*.42,inside=Math.abs(P.x-d.x)<.55&&P.y<d.h;
    if(shut&&inside&&d.so.dead)shut=false;
    d.so.dead=!shut;var tz=shut?0:-3.2;d.z+=(tz-d.z)*(1-Math.exp(-dt*9));
    var warn=!shut&&u>d.per*.86;d.g.position.set(d.x+(warn?Math.sin(tm*60)*.04:0),0,d.z);
    if(shut&&!d.was&&Math.abs(P.x-d.x)<14)beep(240,.12,'square',.02,-60);d.was=shut;
  });
  if(alarmT>0){alarmT-=dt;if(alarmEl)alarmEl.style.opacity=(alarmT>0?(.35+.25*Math.sin(tm*10))*Math.min(1,alarmT):0)}
  else if(alarmEl&&alarmEl.style.opacity!=='0')alarmEl.style.opacity=0;
  if(!vilHidToast&&pHidden()&&state==='play'){vilHidToast=true;toast('Escondido! Atrás do biombo o guarda passa sem ver o Kuro')}
  hidMark();
}
function pHidden(){var H=LV&&LV.hides;if(!H||P.climb)return false;for(var i=0;i<H.length;i++)if(P.x>H[i][0]-.1&&P.x<H[i][1]+.1&&P.y<1.6)return true;return false}
/* o guarda precisa ver o Kuro por um instante (a luz fica laranja) antes do alarme */
function guardSuspect(e,dt){var s=guardSees(e);e.sus=s?(e.sus||0)+dt:Math.max(0,(e.sus||0)-dt*1.5);return e.sus>=.4}
var hidS=null;
function hidMark(){
  if(!hidS){var c=document.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d');x.fillStyle='rgba(20,30,60,.85)';x.beginPath();x.arc(32,32,28,0,6.283);x.fill();
    x.strokeStyle='#bcd2ff';x.lineWidth=5;x.beginPath();x.arc(32,26,16,.35,Math.PI-.35);x.stroke();for(var i=-1;i<=1;i++){x.beginPath();x.moveTo(32+i*10,40);x.lineTo(32+i*13,48);x.stroke()}
    var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;hidS=new T.Sprite(new T.SpriteMaterial({map:t,transparent:true,depthWrite:false,fog:false}));hidS.scale.set(.6,.6,1);scene.add(hidS)}
  var h=curTheme.name==='village'&&state==='play'&&pHidden();hidS.visible=h;if(h)hidS.position.set(P.x,P.y+P.h+.75,1.4);
}
/* guarda: cone de luz da lanterna (para onde ele olha), bloqueado por paredes */
function guardSees(e){
  if(state!=='play'||P.warp||pHidden())return false;
  var ax=e.x+e.dir*.55,ay=e.y+1.05,px=P.x,py=P.y+P.h*.55,dx=(px-ax)*e.dir,dy=py-ay,dist=Math.hypot(dx,dy);
  if(dx<.1||dist>6.4)return false;
  var ang=Math.atan2(dy,dx)+.12;if(Math.abs(ang)>.5)return false;
  for(var k=1;k<6;k++){var sx=ax+(px-ax)*k/6,sy=ay+(py-ay)*k/6;
    for(var i=0;i<solids.length;i++){var q=solids[i];if(q.dead||q.hid||q.oneway)continue;if(sx>q.l&&sx<q.r&&sy>q.b&&sy<q.t)return false}}
  return true;
}
function raiseAlarm(e){
  var fresh=alarmT<=0;alarmT=6;
  if(fresh){toast('Alarme! O guarda viu o Kuro: os inimigos ficaram mais rápidos');beep(1320,.25,'triangle',.05,-120);beep(990,.3,'triangle',.05,-80,.2);beep(1320,.25,'triangle',.04,-120,.45);shake=Math.max(shake,.15)}
  enemies.forEach(function(o){if(o===e||!o.alive||o.dorm)return;if(Math.abs(o.x-e.x)<20&&o.st==='patrol'){o.st='alert';o.alertT=.35+Math.random()*.2;o.dir=P.x>o.x?1:-1}});
}
function ninjaAI(e,dt){
  if(e.thT>0)e.thT-=dt;
  e.thCd=(e.thCd===undefined?1.2:e.thCd)-dt;
  if(e.thCd<=0&&e.fg&&state==='play'&&sees(e,11,3.6)&&Math.abs(P.x-e.x)>1.6){
    e.dir=P.x>e.x?1:-1;fireShot(e.x+e.dir*.45,e.y+.95,'s');e.thT=.3;e.thCd=(alarmT>0?1.6:2.7)+Math.random()*.6;
  }
}
/* ---------- inimigos da vila ---------- */
function makeGuard(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var robe=M(0x2a3a6a,.85),robe2=M(0x1c2850,.85),skin=M(0xe8c4a0,.7),hatM=M(0xc8a860,.85),dk=M(0x1a1612,.8),wood=M(0x6b4a2e,.8);
  var body=mesh(new T.CylinderGeometry(.24,.36,.85,12),robe);body.position.y=.82;inner.add(body);
  var belt=mesh(new T.CylinderGeometry(.27,.27,.1,12),dk);belt.position.y=.86;inner.add(belt);
  var head=mesh(new T.SphereGeometry(.17,14,10),skin);head.position.y=1.38;inner.add(head);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.025,6,5),dk,false,false);ey.position.set(sd*.06,1.4,.15);inner.add(ey)});
  var hat=mesh(new T.ConeGeometry(.46,.24,18),hatM);hat.position.y=1.58;inner.add(hat);
  var legs=[];[-1,1].forEach(function(sd){var hp=new T.Group();hp.position.set(sd*.12,.45,0);inner.add(hp);var lg=mesh(new T.CapsuleGeometry(.08,.3,4,8),robe2);lg.position.y=-.2;hp.add(lg);
    var ft=mesh(new T.BoxGeometry(.12,.06,.22),dk);ft.position.set(0,-.42,.04);hp.add(ft);legs.push(hp)});
  var arm=new T.Group();arm.position.set(.26,1.1,0);inner.add(arm);
  var ua=mesh(new T.CapsuleGeometry(.06,.3,4,6),robe);ua.rotation.x=-1.1;ua.position.set(0,-.05,.16);arm.add(ua);
  var pole=mesh(new T.CylinderGeometry(.02,.02,.7,5),wood);pole.rotation.x=-1.25;pole.position.set(0,.02,.5);arm.add(pole);
  var lm=new T.MeshStandardMaterial({color:0xffe0a0,emissive:0xffa040,emissiveIntensity:1.6});
  var lamp=mesh(new T.SphereGeometry(.13,10,8),lm,false,false);lamp.scale.set(1,1.3,1);lamp.position.set(-.26,1.05,.55);inner.add(lamp);
  var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffb050,transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false,opacity:.8}));gl.scale.set(1.2,1.2,1);gl.position.copy(lamp.position);inner.add(gl);
  /* cone de luz no plano do caminho (vira junto com o guarda) */
  var N=10,pos=[],col=[],th=.42,tilt=-.12,L=6.2;
  for(var i=0;i<N;i++){var a0=tilt-th+2*th*i/N,a1=tilt-th+2*th*(i+1)/N;
    pos.push(0,1.05,.55, 0,1.05+Math.sin(a0)*L,.55+Math.cos(a0)*L, 0,1.05+Math.sin(a1)*L,.55+Math.cos(a1)*L);col.push(.55,.45,.25, 0,0,0, 0,0,0)}
  var cg=new T.BufferGeometry();cg.setAttribute('position',new T.Float32BufferAttribute(pos,3));cg.setAttribute('color',new T.Float32BufferAttribute(col,3));
  var cm=new T.MeshBasicMaterial({vertexColors:true,transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false});
  var cone=new T.Mesh(cg,cm);cone.position.x=-.26;cone.frustumCulled=false;inner.add(cone);
  add(g);return {g:g,inner:inner,legs:legs,arm:arm,cone:cone,coneM:cm,lampM:lm,glow:gl};
}
function makeNinja(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var suit=M(0x2a1e2e,.8),suit2=M(0x3e2a44,.8),skin=M(0xe8c4a0,.7),band=M(0xc8302a,.7),wh=M(0xffffff,.4),steel=M(0xc9d1d8,.3,.8);
  var body=mesh(new T.CapsuleGeometry(.2,.32,4,10),suit);body.position.y=.62;inner.add(body);
  var head=new T.Group();head.position.y=1.08;inner.add(head);
  head.add(mesh(new T.SphereGeometry(.2,14,10),suit2));
  var slit=mesh(new T.BoxGeometry(.3,.07,.1),skin);slit.position.set(0,.02,.15);head.add(slit);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.03,6,5),wh,false,false);ey.position.set(sd*.07,.02,.2);head.add(ey)});
  var hb=mesh(new T.TorusGeometry(.2,.035,6,16),band);hb.rotation.x=Math.PI/2;hb.position.y=.08;head.add(hb);
  var tails=new T.Group();tails.position.set(0,.08,-.2);head.add(tails);
  [-1,1].forEach(function(sd){var tl=mesh(new T.BoxGeometry(.06,.03,.32),band);tl.position.set(sd*.05,0,-.15);tl.rotation.y=sd*.3;tails.add(tl)});
  var sw=mesh(new T.BoxGeometry(.05,.7,.04),steel);sw.position.set(.08,.75,-.22);sw.rotation.z=.7;inner.add(sw);
  [-1,1].forEach(function(sd){var lg=mesh(new T.CapsuleGeometry(.07,.22,4,6),suit2);lg.position.set(sd*.1,.25,0);inner.add(lg)});
  var arm=new T.Group();arm.position.set(.22,.82,0);inner.add(arm);var ua=mesh(new T.CapsuleGeometry(.055,.26,4,6),suit);ua.position.y=-.16;arm.add(ua);
  var arm2=mesh(new T.CapsuleGeometry(.055,.26,4,6),suit);arm2.position.set(-.22,.66,0);inner.add(arm2);
  add(g);return {g:g,inner:inner,arm:arm,tails:tails};
}
function makeCat(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var fur=M(0x16141c,.7),eyeM=new T.MeshStandardMaterial({color:0x202000,emissive:0xffd23a,emissiveIntensity:2}),pink=M(0xd88a9a,.6);
  var body=mesh(new T.SphereGeometry(.4,16,12),fur);body.scale.set(.6,.62,1.15);body.position.set(0,.45,0);inner.add(body);
  var head=mesh(new T.SphereGeometry(.24,14,10),fur);head.position.set(0,.7,.48);inner.add(head);
  [-1,1].forEach(function(sd){var ear=mesh(new T.ConeGeometry(.08,.18,4),fur);ear.position.set(sd*.12,.92,.46);ear.rotation.z=-sd*.25;inner.add(ear);
    var e=mesh(new T.SphereGeometry(.05,8,6),eyeM,false,false);e.scale.set(1,1.3,.6);e.position.set(sd*.09,.73,.68);inner.add(e)});
  var nz=mesh(new T.SphereGeometry(.025,6,5),pink,false,false);nz.position.set(0,.66,.72);inner.add(nz);
  var tail=new T.Group();tail.position.set(0,.55,-.42);inner.add(tail);
  for(var i=0;i<5;i++){var sg=mesh(new T.SphereGeometry(.06,8,6),fur);sg.position.set(0,i*.12,-Math.sin(i*.5)*.12);tail.add(sg)}
  var legs=[],legG=new T.CylinderGeometry(.06,.05,.36,6);legG.translate(0,-.18,0);
  [.3,-.3].forEach(function(z0){[-1,1].forEach(function(sd){var q=new T.Group();q.position.set(sd*.14,.36,z0);q.add(mesh(legG,fur));inner.add(q);legs.push({p:q,sd:sd,z:z0,base:0})})});
  add(g);return {g:g,inner:inner,legs:legs,tail:tail};
}
function makeCrow(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var bm=M(0x14121c,.6),wm=M(0x1e1a2a,.7,0,{side:T.DoubleSide}),beak=M(0xe0a030,.5),em=new T.MeshStandardMaterial({color:0x200000,emissive:0xff3a2a,emissiveIntensity:1.8});
  var body=mesh(new T.SphereGeometry(.24,14,10),bm);body.scale.set(.8,.8,1.3);inner.add(body);
  var hd=mesh(new T.SphereGeometry(.15,12,10),bm);hd.position.set(0,.1,.3);inner.add(hd);
  var bk=mesh(new T.ConeGeometry(.06,.2,6),beak);bk.rotation.x=Math.PI/2;bk.position.set(0,.08,.48);inner.add(bk);
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.03,6,5),em,false,false);e.position.set(sd*.08,.14,.4);inner.add(e)});
  var tl=mesh(new T.ConeGeometry(.12,.3,4),bm);tl.rotation.x=-Math.PI/2;tl.scale.set(1,1,.3);tl.position.set(0,0,-.38);inner.add(tl);
  var wings=[];[-1,1].forEach(function(sd){var p=new T.Group();p.position.set(sd*.16,.06,0);inner.add(p);var w=mesh(new T.BoxGeometry(.75,.03,.42),wm);w.position.x=sd*.37;p.add(w);wings.push({p:p,sd:sd})});
  add(g);return {g:g,inner:inner,wings:wings};
}
