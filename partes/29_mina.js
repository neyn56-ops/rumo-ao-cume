/*@@parte:29_mina.js*/
/* ===================== Mundo 15: Mina dos Trilhos =====================
   Uma mina antiga debaixo da Terra Nova: túneis com escoras de madeira, lampiões, cristais nas paredes e trilhos por cima dos abismos.
   Vagonetes: o Kuro pula dentro, o vagonete anda sozinho; na rampa ele voa por cima do abismo; no trilho quebrado ele cai (pule para outro antes!).
   Elevador de mina (gaiola que sobe e desce no poço), vigas baixas sobre o trilho (abaixe-se) e as toupeiras mineiras.
   Chefe: o Toupeirão — cava por baixo da terra e aparece debaixo do Kuro, avança com as garras de broca e derruba pedras do teto. */
var mnM=null,mnFx=null,mnCarts=[],mnLifts=[],mnBeams=[],mnRails=[],mnRocks=[];
function mnMats(){if(mnM)return;
  var cv=document.createElement('canvas');cv.width=64;cv.height=16;var x=cv.getContext('2d');x.fillStyle='#1a1a1a';x.fillRect(0,0,64,16);x.fillStyle='#f2c230';for(var i=-2;i<9;i++){x.beginPath();x.moveTo(i*8,16);x.lineTo(i*8+8,0);x.lineTo(i*8+12,0);x.lineTo(i*8+4,16);x.fill()}
  var stT=new T.CanvasTexture(cv);stT.encoding=T.sRGBEncoding;stT.wrapS=T.RepeatWrapping;
  mnM={rock:pbr(texStone,.95,1.1,{color:new T.Color(0x75604f)}),rockD:pbr(texStone,.97,1.1,{color:new T.Color(0x45362c)}),
    dirt:pbr(texDirt,.97,1.2,{color:new T.Color(0x9a7e60)}),wood:pbr(texWood,.9,1.3,{color:new T.Color(0x9a7048)}),woodD:pbr(texWood,.95,1.3,{color:new T.Color(0x5e4229)}),
    iron:M(0x5e6268,.45,.75),steel:M(0xc4c8ce,.28,.9),rust:M(0x9a4e2c,.62,.55),
    lamp:new T.MeshStandardMaterial({color:0xffe6b0,emissive:new T.Color(0xffb440),emissiveIntensity:2.4}),
    glow:new T.SpriteMaterial({map:softSprite(),color:0xffc060,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false,opacity:.55}),
    cA:new T.MeshStandardMaterial({color:0x6ff0ff,emissive:new T.Color(0x20b8d8),emissiveIntensity:1.1,roughness:.15,metalness:.1,flatShading:true}),
    cB:new T.MeshStandardMaterial({color:0xd890ff,emissive:new T.Color(0x9a40e0),emissiveIntensity:1.1,roughness:.15,metalness:.1,flatShading:true}),
    ore:M(0xffc63a,.35,.8,{flatShading:true,emissive:new T.Color(0x6a4a00),emissiveIntensity:.35}),
    stripe:new T.MeshStandardMaterial({map:stT,roughness:.6}),red:M(0xd83a2a,.5,.1),white:M(0xf0ece0,.6)};
  mnM.stT=stT}
/* ---------- trechos da mina com cor própria (dono pediu variar): 0 rocha quente, 1 veio de carvão, 2 galeria de cristais, 3 arena do Toupeirão ---------- */
var MN_T=[0xffffff,0xb0b0b8,0xb4c4ff,0xe2b6a8];
function mnZone(x){var xe=(typeof sceneEnd==='function'?sceneEnd():330)-30,b0=LV.boss?LV.boss.arena[0]-4:xe;if(x>=b0)return 3;return x<b0*.33?0:(x<b0*.66?1:2)}
function mnTint(g,x){g.__c=MN_T[mnZone(x)];return g}
function mgC(L){return mergeG(L.map(function(g){return {g:g,c:g.__c||0xffffff}}),true)}/* junta guardando a cor de cada pedaço */
function mnVC(m){var k=m.clone();k.vertexColors=true;return k}
/* ---------- trilhos: ponto na curva pelo comprimento (s) ---------- */
function mnRailPrep(R){var L=0,seg=[];for(var i=1;i<R.pts.length;i++){var a=R.pts[i-1],b=R.pts[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);seg.push({a:a,b:b,d:d,s0:L,ang:Math.atan2(b[1]-a[1],b[0]-a[0])});L+=d}return {q:R,seg:seg,L:L,x0:R.pts[0][0],x1:R.pts[R.pts.length-1][0]}}
function mnAt(R,s){s=clamp(s,0,R.L);for(var i=0;i<R.seg.length;i++){var g=R.seg[i];if(s<=g.s0+g.d||i===R.seg.length-1){var u=g.d?(s-g.s0)/g.d:0;return {x:g.a[0]+(g.b[0]-g.a[0])*u,y:g.a[1]+(g.b[1]-g.a[1])*u,ang:g.ang}}}}
function mnYat(R,x){if(x<R.x0||x>R.x1)return null;for(var i=0;i<R.seg.length;i++){var g=R.seg[i];if(x<=g.b[0]){var u=(x-g.a[0])/((g.b[0]-g.a[0])||1);return g.a[1]+(g.b[1]-g.a[1])*u}}return null}
function mnSat(R,x){for(var i=0;i<R.seg.length;i++){var g=R.seg[i];if(x<=g.b[0]||i===R.seg.length-1){var u=clamp((x-g.a[0])/((g.b[0]-g.a[0])||1),0,1);return g.s0+g.d*u}}return 0}
function mnGround(x,y){var b=null;(LV.solids||[]).forEach(function(s){if(s[5]==='tres')return;if(x>=s[0]-.05&&x<=s[1]+.05&&s[2]<=y+.25&&(b===null||s[2]>b))b=s[2]});return b}
/* ---------- chão, pontes de madeira e trilhos ---------- */
function buildPlatformsMine(){mnMats();mnRails=[];mnCarts=[];mnLifts=[];mnBeams=[];mnRocks=[];
  var GR=[],GD=[],GW=[],GWD=[],r=rnd(1515);
  LV.solids.forEach(function(s){var x0=s[0],x1=s[1],top=s[2],w=x1-x0,cx=(x0+x1)/2,i;
    if(s[5]==='tres'){/* ponte de madeira (cavalete): tábuas por cima e pernas até lá embaixo */
      for(var px=x0+.2;px<x1;px+=.5)GW.push(xf(new T.BoxGeometry(.44,.16,2.2),[px+.03,top-.08,-.2],[0,Math.sin(px*5)*.03,0]));
      GWD.push(xf(new T.BoxGeometry(w,.22,.18),[cx,top-.27,.85]));GWD.push(xf(new T.BoxGeometry(w,.22,.18),[cx,top-.27,-1.25]));
      for(px=x0+.4;px<=x1-.3;px+=3.1){[.8,-1.2].forEach(function(z){GWD.push(xf(new T.BoxGeometry(.3,top+14,.3),[px,(top-14)/2-.2,z]))});
        for(var yy=top-1.6;yy>-12;yy-=3.2)GWD.push(xf(new T.BoxGeometry(.16,.16,2.2),[px,yy,-.2]));
        if(px+3.1<=x1)for(yy=top-.6;yy>-10;yy-=3.2){var dx=3.1,dy=-3.2,L=Math.hypot(dx,dy);GWD.push(xf(new T.BoxGeometry(.12,L,.12),[px+1.55,yy-1.6,.85],[0,0,Math.atan2(dx,-dy)]))}}
      solids.push({l:x0,r:x1,t:top,b:top-.4,oneway:false});return}
    /* rocha: corpo de pedra com terra batida e cascalho por cima */
    var bot=s[3]!==undefined?s[3]:-14;
    GR.push(mnTint(xf(boxGeo(w,top-bot-.3,6.6,2.4),[cx,(top-.3+bot)/2,-1.7]),cx));
    GD.push(mnTint(xf(boxGeo(w+.12,.34,6.84,2.2),[cx,top-.17,-1.7]),cx));/* a terra fica bem à frente da pedra (frentes coladas piscavam) */
    for(i=0;i<w*.9;i++){var gx=x0+.2+r()*(w-.4);GD.push(mnTint(xf(new T.DodecahedronGeometry(.08+r()*.12,0),[gx,top+.02,-.4-r()*3.6],[r()*3,r()*3,0]),gx))}
    solids.push({l:x0,r:x1,t:top,b:bot,oneway:false})});
  if(GR.length)add(mesh(mgC(GR),mnVC(mnM.rock),true,true));if(GD.length)add(mesh(mgC(GD),mnVC(mnM.dirt),false,true));
  if(GW.length)add(mesh(mgL(GW),mnM.wood,true,true));if(GWD.length)add(mesh(mgL(GWD),mnM.woodD,true,false));
  (LV.floats||[]).forEach(function(f){var w=f[1]-f[0],cx=(f[0]+f[1])/2,G=[];/* andaime de tábuas pendurado por correntes */
    for(var px=f[0]+.22;px<f[1];px+=.46)G.push(xf(new T.BoxGeometry(.42,.18,1.8),[px,f[2]-.09,0]));
    G.push(xf(new T.BoxGeometry(w,.2,.2),[cx,f[2]-.25,.75]));G.push(xf(new T.BoxGeometry(w,.2,.2),[cx,f[2]-.25,-.75]));
    add(mesh(mgL(G),mnM.wood,true,true));
    [f[0]+.3,f[1]-.3].forEach(function(x){var ch=mesh(new T.CylinderGeometry(.035,.035,6,5),mnM.iron,false,false);ch.position.set(x,f[2]+3,-.2);add(ch)});
    solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.3,oneway:false,flt:true})});
  /* trilhos: dormentes de madeira e dois trilhos de aço; batente no fim (stop), rampa listrada (jump) ou trilho quebrado torto (drop) */
  var RS=[],RW=[],RX=[];
  (LV.rails||[]).forEach(function(q,ri){var R=mnRailPrep(q);mnRails.push(R);
    R.seg.forEach(function(g,si){var cx=(g.a[0]+g.b[0])/2,cy=(g.a[1]+g.b[1])/2,brk=q.end==='drop'&&si===R.seg.length-1;
      var len=brk?g.d-1.4:g.d,ox=brk?-.7*Math.cos(g.ang):0,oy=brk?-.7*Math.sin(g.ang):0;
      [-.5,.5].forEach(function(z){RS.push(xf(new T.BoxGeometry(len,.12,.1),[cx+ox,cy+oy+.16,z],[0,0,g.ang]))});
      for(var u=.25;u<g.d;u+=.62){var px=g.a[0]+Math.cos(g.ang)*u,py=g.a[1]+Math.sin(g.ang)*u;RW.push(xf(new T.BoxGeometry(.28,.1,1.5),[px,py+.05,0],[0,0,g.ang]))}
      /* pernas debaixo dos trilhos que passam por cima do vazio */
      for(u=.6;u<g.d;u+=2.6){var lx=g.a[0]+Math.cos(g.ang)*u,ly=g.a[1]+Math.sin(g.ang)*u,gr=mnGround(lx,ly+.3);if(gr!==null&&ly-gr<.6)continue;
        var onT=false;LV.solids.forEach(function(s){if(s[5]==='tres'&&lx>=s[0]&&lx<=s[1])onT=true});if(onT)continue;
        [.62,-.62].forEach(function(z){RX.push(xf(new T.BoxGeometry(.26,ly+14,.26),[lx,(ly-14)/2-.1,z]))});RX.push(xf(new T.BoxGeometry(.22,.22,1.6),[lx,ly-.12,0]))}});
    var e=R.seg[R.seg.length-1],ex=e.b[0],ey=e.b[1];
    if(q.end==='stop'){/* batente vermelho e branco — firme (o Kuro não atravessa), logo depois de onde o vagonete para */var bs=new T.Group();bs.position.set(ex+.9,ey,0);add(bs);solids.push({l:ex+.9,r:ex+1.4,t:ey+.9,b:ey,oneway:false});
      var bk=mesh(new T.BoxGeometry(.5,.8,1.6),mnM.woodD,true,false);bk.position.set(.25,.5,0);bs.add(bk);
      [-1,1].forEach(function(sd){var bp=mesh(new T.CylinderGeometry(.16,.16,.3,10),sd>0?mnM.red:mnM.white,false,false);bp.rotation.z=Math.PI/2;bp.position.set(-.1,.6,sd*.45);bs.add(bp)});
      var lp=mesh(new T.SphereGeometry(.12,8,6),mnM.lamp,false,false);lp.position.set(.25,1.05,0);bs.add(lp)}
    else if(q.end==='jump'){/* rampa: faixa listrada e placa com seta */var st=mesh(new T.BoxGeometry(.5,.1,1.5),mnM.stripe,false,false);st.position.set(ex-.3*Math.cos(e.ang),ey-.3*Math.sin(e.ang)+.12,0);st.rotation.z=e.ang;add(st)}
    else if(q.end==='drop'){/* trilho quebrado: as pontas entortam para baixo; placa de perigo antes */
      [-.5,.5].forEach(function(z,k){var bt=mesh(new T.BoxGeometry(1.3,.1,.1),mnM.steel,false,false);bt.position.set(ex-.75+.1*k,ey-.12-.1*k,z);bt.rotation.z=-.5-.3*k;add(bt)});
      mnSign(ex-6,ey,'!')}
  });
  if(RS.length)add(mesh(mgL(RS),mnM.steel,false,false));if(RW.length)add(mesh(mgL(RW),mnM.woodD,false,true));if(RX.length)add(mesh(mgL(RX),mnM.woodD,true,false));
  /* vagonetes */
  (LV.carts||[]).forEach(function(c){mnCarts.push(mnMakeCart(c))});
  /* elevador de mina: gaiola com cabos até a roldana lá em cima */
  (LV.mlifts||[]).forEach(function(q){var g=new T.Group();add(g);var w=q.w;
    var fl=mesh(boxGeo(w,.24,2,1),mnM.wood,true,true);fl.position.y=-.12;g.add(fl);
    var F=[];[[-w/2+.08,-.85],[w/2-.08,-.85],[-w/2+.08,.85],[w/2-.08,.85]].forEach(function(p){F.push(xf(new T.BoxGeometry(.1,2.6,.1),[p[0],1.3,p[1]]))});
    F.push(xf(new T.BoxGeometry(w,.12,.12),[0,2.6,-.85]));F.push(xf(new T.BoxGeometry(w,.12,.12),[0,2.6,.85]));F.push(xf(new T.BoxGeometry(.12,.12,1.8),[-w/2+.08,2.6,0]));F.push(xf(new T.BoxGeometry(.12,.12,1.8),[w/2-.08,2.6,0]));
    F.push(xf(new T.BoxGeometry(w,.08,.08),[0,1.1,-.85]));g.add(mesh(mgL(F),mnM.iron,true,false));
    var cab=mesh(new T.CylinderGeometry(.03,.03,1,5),mnM.steel,false,false);add(cab);
    var top=q.y1+7.5,pl=new T.Group();pl.position.set(q.x,top,-.3);add(pl);var wh=mesh(new T.TorusGeometry(.6,.1,6,16),mnM.iron,false,false);pl.add(wh);
    var hb=mesh(new T.BoxGeometry(5,.35,.35),mnM.woodD,true,false);hb.position.set(q.x,top+.7,-.3);add(hb);
    var so={l:q.x-w/2,r:q.x+w/2,t:q.y0,b:q.y0-.3,oneway:false};solids.push(so);mnLifts.push({q:q,g:g,so:so,cab:cab,wh:wh,top:top,t:0,y:q.y0})});
  /* vigas baixas por cima do trilho (listradas, com lampião) */
  (LV.beams||[]).forEach(function(q){var R=mnRails[q.rail],ry=mnYat(R,q.x),by=ry+1.95;
    var g=new T.Group();g.position.set(q.x,by,0);add(g);
    var bm=mesh(new T.BoxGeometry(.6,.7,3.6),mnM.woodD,true,false);bm.position.y=.35;g.add(bm);
    var sp=mesh(new T.BoxGeometry(.62,.22,3.62),mnM.stripe,false,false);sp.position.y=.1;g.add(sp);
    [-1.7,1.7].forEach(function(z){var po=mesh(new T.BoxGeometry(.4,by+14,.4),mnM.woodD,true,false);po.position.set(0,(-by-14)/2+.7,z-.2);if(z>0)po.visible=false;g.add(po)});
    mnBeams.push({x:q.x,y:by,warn:false})});
}
function mnSign(x,y,txt){var c=document.createElement('canvas');c.width=c.height=64;var k=c.getContext('2d');
  k.fillStyle='#f2c230';k.beginPath();k.moveTo(32,4);k.lineTo(60,58);k.lineTo(4,58);k.closePath();k.fill();k.lineWidth=4;k.strokeStyle='#1a1a1a';k.stroke();
  k.fillStyle='#1a1a1a';k.font='bold 34px Arial';k.textAlign='center';k.textBaseline='middle';k.fillText(txt,32,40);
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;var g=new T.Group();g.position.set(x,y,-1.3);add(g);
  var po=mesh(new T.CylinderGeometry(.05,.05,1.8,6),mnM.woodD,false,false);po.position.y=.9;g.add(po);
  var pl=new T.Mesh(new T.PlaneGeometry(.9,.9),new T.MeshStandardMaterial({map:t,transparent:true,alphaTest:.3,side:T.DoubleSide,roughness:.6}));pl.position.y=2;g.add(pl)}
function mnMakeCart(c){var g=new T.Group(),body=new T.Group();g.add(body);add(g);
  var B=[];B.push(xf(new T.BoxGeometry(2.0,.1,1.3),[0,.7,0]));/* fundo */
  B.push(xf(new T.BoxGeometry(2.1,.8,.08),[0,1.12,.66]));B.push(xf(new T.BoxGeometry(2.1,.8,.08),[0,1.12,-.66]));
  B.push(xf(new T.BoxGeometry(.08,.8,1.36),[1.02,1.12,0]));B.push(xf(new T.BoxGeometry(.08,.8,1.36),[-1.02,1.12,0]));
  body.add(mesh(mgL(B),mnM.rust,true,false));
  var R=[];[[.7,.68],[1.5,.68],[.7,-.68],[1.5,-.68]].forEach(function(p){R.push(xf(new T.BoxGeometry(2.2,.08,.1),[0,p[0]+.02,p[1]]))});[-1.06,1.06].forEach(function(x){R.push(xf(new T.BoxGeometry(.1,.08,1.46),[x,1.52,0]))});
  for(var i=-2;i<=2;i++)[.7,-.7].forEach(function(z){R.push(xf(new T.SphereGeometry(.04,5,4),[i*.42,1.3,z]))});
  body.add(mesh(mgL(R),mnM.iron,false,false));
  var lp=mesh(new T.SphereGeometry(.13,10,8),mnM.lamp,false,false);lp.position.set(1.12,1.25,0);body.add(lp);
  var gl=new T.Sprite(mnM.glow.clone());gl.scale.set(1.6,1.6,1);gl.position.set(1.25,1.25,.2);body.add(gl);
  var wh=[];[[-.62,.6],[.62,.6],[-.62,-.6],[.62,-.6]].forEach(function(p){var w=new T.Group();w.position.set(p[0],.3,p[1]);body.add(w);
    var d=mesh(new T.CylinderGeometry(.3,.3,.12,14),mnM.iron,true,false);d.rotation.x=Math.PI/2;w.add(d);var sp=mesh(new T.BoxGeometry(.5,.06,.13),mnM.steel,false,false);w.add(sp);wh.push(w)});
  var R0=mnRails[c.rail],s0=mnSat(R0,c.x);
  var so={l:0,r:0,t:0,b:0,oneway:false,mover:true,x:c.x,px:c.x,vxm:0,cart:1};solids.push(so);
  var K={q:c,g:g,body:body,wh:wh,gl:gl,so:so,rail0:c.rail,s0:s0,ri:c.rail,s:s0,v:0,st:'idle',x:c.x,y:0,ang:0,vx:0,vy:0,gone:0,rk:0};mnCartPlace(K,0);return K}
function mnCartPlace(K,dt){var so=K.so;if(K.st!=='air'&&K.st!=='gone'){var p=mnAt(mnRails[K.ri],K.s);K.x=p.x;K.y=p.y;K.ang+=(p.ang-K.ang)*Math.min(1,dt*12+(dt?0:1))}
  so.px=so.x;so.x=K.x;so.vxm=0;K.vxw=dt>0?(so.x-so.px)/dt:0;/* o pulo de dentro do vagonete leva a velocidade dele inteira (ver updMine) */so.l=K.x-1.0;so.r=K.x+1.0;so.t=K.y+.75;so.b=K.y+.15;
  K.g.position.set(K.x,K.y,0);K.g.rotation.z=K.ang;K.g.visible=K.st!=='gone';so.dead=K.st==='gone'}
function mnCartReset(K){K.ri=K.rail0;K.s=K.s0;K.v=0;K.st='idle';K.ang=0;K.gone=0;mnCartPlace(K,0);K.so.px=K.so.x;emit(dustPool,K.x,K.y+.6,10,2.4,.6,.6,1.2,-.3)}
function mnCartUpd(K,dt){var on=P.onPlat===K.so&&P.grounded&&state==='play',R=mnRails[K.ri],q=R.q,i;
  if(K.st==='gone'){K.gone-=dt;if(K.gone<=0)mnCartReset(K);return}
  /* o Kuro voltou para trás (renasceu numa bandeirinha antes): o vagonete volta para o começo */
  if(!on&&(K.st!=='idle'||K.ri!==K.rail0||Math.abs(K.s-K.s0)>.05)&&K.st!=='roll'&&K.st!=='air'&&P.x<K.q.x-1.2){mnCartReset(K);return}
  if(K.st==='idle'&&on){K.st='roll';try{beep(180,.25,'square',.04,60);noise(.3,.05,500,'lowpass')}catch(e){}if(!mnFx.told){mnFx.told=1;toast('Vagonete! Fique dentro: ele anda sozinho')}}
  if(K.st==='roll'){var p=mnAt(R,K.s),sp=(q.sp||10)+Math.max(0,-Math.sin(p.ang))*5,left=R.L-K.s;
    var tgt=q.end==='stop'?Math.min(sp,Math.sqrt(Math.max(0,2*7*(left-.9)))):sp;
    K.v=K.v<tgt?Math.min(tgt,K.v+9*dt):Math.max(tgt,K.v-14*dt);K.s+=K.v*dt;
    if(K.s>=R.L-(q.end==='stop'?.9:0)){
      if(q.end==='stop'){K.s=R.L-.9;K.v=0;K.st='stop';shake=Math.max(shake,.12);try{beep(120,.15,'square',.05)}catch(e){}emit(dustPool,K.x+1,K.y+.5,6,2,.5,.5,1.2,-.3)}
      else{var e=R.seg[R.seg.length-1];K.s=R.L;var pe=mnAt(R,K.s);K.x=pe.x;K.y=pe.y;K.st='air';K.vx=K.v*Math.cos(e.ang);K.vy=K.v*Math.sin(e.ang);K.from=K.ri;
        if(q.end==='jump'){try{beep(330,.2,'triangle',.05,300)}catch(er){}emit(sparkPool,K.x,K.y+.2,10,3,.4,.3,.2,2)}else{try{noise(.35,.06,400,'lowpass')}catch(er){}}}}
    K.rk+=K.v*dt}
  if(K.st==='air'){var px=K.x,py=K.y;K.vy-=24*dt;K.x+=K.vx*dt;K.y+=K.vy*dt;K.ang+=(Math.atan2(K.vy,K.vx)*.5-K.ang)*Math.min(1,dt*3);
    if(K.vy<0)for(i=0;i<mnRails.length;i++){if(i===K.from)continue;var R2=mnRails[i],yr=mnYat(R2,K.x);if(yr!==null&&py>=yr-.05&&K.y<=yr){K.ri=i;K.s=mnSat(R2,K.x);K.v=Math.abs(K.vx);K.st='roll';K.y=yr;shake=Math.max(shake,.3);
      try{beep(90,.2,'square',.06);noise(.25,.06,300,'lowpass')}catch(e){}emit(sparkPool,K.x-.6,yr+.2,14,4,.5,.3,.2,3);emit(dustPool,K.x,yr+.3,8,2.5,.6,.6,1.2,-.3);break}}
    K.rk+=K.vx*dt;if(K.y<-14){K.st='gone';K.gone=2}}
  var ox=K.x,oy=K.y;mnCartPlace(K,dt);
  K.wh.forEach(function(w){w.rotation.z=-K.rk/.3});
  if(on&&K.st!=='gone'){P.y=K.so.t;P.vy=Math.max(P.vy,0)}
  if(K.st==='roll'&&K.v>3&&((tm*20)|0)%2===0&&Math.random()<.5)emit(sparkPool,K.x+(Math.random()<.5?-.6:.6),K.y+.18,1,1.4,.25,.18,.15,2)}
/* ---------- elevador e vigas ---------- */
function mnLiftUpd(L,dt){var q=L.q,per=q.per||6.5;L.t+=dt;var u=((L.t+(q.ph||0))%per)/per,k;
  /* parado embaixo, sobe, parado em cima, desce */
  if(u<.18)k=0;else if(u<.5)k=(1-Math.cos((u-.18)/.32*Math.PI))/2;else if(u<.68)k=1;else k=(1+Math.cos((u-.68)/.32*Math.PI))/2;
  var ny=q.y0+(q.y1-q.y0)*k,so=L.so,on=P.onPlat===so&&P.grounded;L.y=ny;so.t=ny;so.b=ny-.3;if(on)P.y=ny;
  L.g.position.set(q.x,ny,-.2);L.cab.position.set(q.x,(ny+2.6+L.top)/2,-.3);L.cab.scale.y=Math.max(.1,L.top-(ny+2.6));L.wh.rotation.z=-ny*1.6}
function mnBeamUpd(dt){mnBeams.forEach(function(B){
  var near=false;mnCarts.forEach(function(K){if(P.onPlat===K.so&&K.st==='roll'&&B.x-K.x>0&&B.x-K.x<9)near=true});
  if(near&&!mnFx.beamTold){mnFx.beamTold=1;toast('Viga baixa! Segure para baixo para se abaixar')}
  if(state==='play'&&P.x+P.w/2>B.x-.3&&P.x-P.w/2<B.x+.3&&P.y+P.h>B.y+.03&&P.y<B.y+.7){var cart=null;mnCarts.forEach(function(K){if(P.onPlat===K.so)cart=K});
    var had=P.inv>0;hurt(B.x);if(!had&&cart&&state==='play'){/* bateu a cabeça, mas continua dentro do vagonete */P.vx=0;P.vy=0;P.y=cart.so.t;P.grounded=true;P.onPlat=cart.so;P.stun=0;P.crouch=true}}})}
function updMine(dt){if(!mnFx)return;var i;
  /* pulou de dentro do vagonete: o Kuro continua indo junto com ele no ar (senão ficava para trás e caía) */
  var onc=null;mnCarts.forEach(function(K){if(P.onPlat===K.so)onc=K});
  if(mnFx.lx!==undefined&&Math.abs(P.x-mnFx.lx)>3)mnFx.cvOn=0;
  if(onc){mnFx.cv=onc.vxw||0;mnFx.cvOn=1}else if(P.grounded||P.climb||state!=='play')mnFx.cvOn=0;
  else if(mnFx.cvOn&&!P.grounded){P.x+=mnFx.cv*dt}
  mnCarts.forEach(function(K){mnCartUpd(K,dt)});mnLifts.forEach(function(L){mnLiftUpd(L,dt)});mnBeamUpd(dt);
  if(!mnFx.rampTold&&mnRails[0]&&P.x>mnRails[0].x1-9&&P.x<mnRails[0].x1&&P.grounded){var onc=false;mnCarts.forEach(function(K){if(P.onPlat===K.so)onc=true});if(!onc){mnFx.rampTold=1;toast('O abismo é largo demais! Volte e suba no vagonete')}}
  if(!mnFx.dropTold&&mnRails[2]){mnCarts.forEach(function(K){if(K.ri===2&&P.onPlat===K.so&&mnRails[2].x1-K.x<12){mnFx.dropTold=1;toast('O trilho acabou! Pule para o outro vagonete')}})}
  /* lampiões piscando, poeira caindo */
  mnFx.lamps.forEach(function(l,k){var f=.85+.15*Math.sin(tm*9+k*2.3)*Math.sin(tm*3.1+k);l.material.opacity=.5*f});mnFx.lx=P.x}
/* ---------- Mundo 15, parte 1: a superfície. O cano do fim leva o Kuro para dentro da mina ---------- */
var mpFx=null;
function buildMinePre(){mnMats();var pp=null;(LV.pipes||[]).forEach(function(d){if(d.to&&d.to.mine)pp=d});mpFx={pp:pp,told:0,puff:0,cart:null};mpFx.train=mpTrain();
  var C=LV.crack;if(C){/* fenda: túnel escuro lá embaixo, com trilho e lampiões; de tempos em tempos um vagonete passa correndo */
    var cw=C.x1-C.x0,ccx=(C.x0+C.x1)/2,y=C.y;
    var bw=mesh(boxGeo(cw+.4,y+11,1,2),mnM.rockD,false,false);bw.position.set(ccx,(y+2.2-9)/2,-5);add(bw);
    var fl=mesh(boxGeo(cw+.4,.6,3.4,2),mnM.rockD,false,true);fl.position.set(ccx,y-.3,-3);add(fl);
    var TW=[];for(var tx=C.x0;tx<C.x1;tx+=.62)TW.push(xf(new T.BoxGeometry(.28,.1,1.5),[tx+.3,y+.05,-3]));add(mesh(mgL(TW),mnM.woodD,false,true));
    [-.5,.5].forEach(function(z){var rl=mesh(new T.BoxGeometry(cw+.4,.12,.1),mnM.steel,false,false);rl.position.set(ccx,y+.16,-3+z);add(rl)});
    [C.x0+2.5,C.x1-2.5].forEach(function(lx){var lp=mesh(new T.SphereGeometry(.16,8,6),mnM.lamp,false,false);lp.position.set(lx,y+2,-4.4);add(lp);
      var gl=new T.Sprite(mnM.glow.clone());gl.scale.set(3,3,1);gl.position.set(lx,y+2,-4.3);add(gl)});
    var cg=new T.Group();add(cg);var cb=mesh(boxGeo(2,.8,1.3,1),mnM.rust,false,false);cb.position.y=.7;cg.add(cb);
    for(var oi=0;oi<5;oi++){var on2=mesh(new T.DodecahedronGeometry(.2,0),mnM.ore,false,false);on2.position.set(-.6+oi*.3,1.15,(oi%2-.5)*.4);cg.add(on2)}
    var cl=mesh(new T.SphereGeometry(.13,8,6),mnM.lamp,false,false);cl.position.set(1.05,1,.0);cg.add(cl);
    var cgl=new T.Sprite(mnM.glow.clone());cgl.scale.set(2.2,2.2,1);cgl.position.set(1.3,1,.3);cg.add(cgl);
    cg.position.set(C.x0-6,y,-3);cg.visible=false;mpFx.cart={g:cg,t:2.5,x:C.x0-6}}
  if(!pp)return;
  var top=pp.base,r=rnd(1599);
  /* placa "MINA" com seta para baixo, ao lado do cano */
  var c=document.createElement('canvas');c.width=128;c.height=96;var k=c.getContext('2d');k.fillStyle='#6a4a2a';k.fillRect(0,0,128,96);k.strokeStyle='#3a2414';k.lineWidth=6;k.strokeRect(3,3,122,90);
  k.fillStyle='#ffe6a8';k.font='bold 30px Arial';k.textAlign='center';k.textBaseline='middle';k.fillText('MINA',64,30);
  k.beginPath();k.moveTo(64,86);k.lineTo(46,58);k.lineTo(56,58);k.lineTo(56,46);k.lineTo(72,46);k.lineTo(72,58);k.lineTo(82,58);k.closePath();k.fill();
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;var sg=new T.Group();sg.position.set(pp.x-2.6,top,-1.4);add(sg);
  var po=mesh(new T.CylinderGeometry(.07,.08,2.4,6),mnM.woodD,true,false);po.position.y=1.2;sg.add(po);
  var pl=new T.Mesh(new T.PlaneGeometry(1.3,1,1,1),new T.MeshStandardMaterial({map:t,roughness:.7}));pl.position.y=2.5;sg.add(pl);
  /* restos de mineração no fim do caminho: vagonete velho com ouro, caixotes, barril e trilho quebrado */
  var oc=new T.Group();oc.position.set(pp.x-6.5,top,-3.2);oc.rotation.y=.25;add(oc);var ob=mesh(boxGeo(1.8,.8,1.1,1),mnM.rust,true,false);ob.position.y=.7;oc.add(ob);
  for(var i=0;i<6;i++){var on=mesh(new T.DodecahedronGeometry(.2+r()*.1,0),mnM.ore,false,false);on.position.set(-.6+r()*1.2,1.15+r()*.12,-.3+r()*.6);oc.add(on)}
  [-.55,.55].forEach(function(x){var wh=mesh(new T.CylinderGeometry(.26,.26,.1,12),mnM.iron,false,false);wh.rotation.x=Math.PI/2;wh.position.set(x,.26,.58);oc.add(wh)});
  var CR=[];CR.push(xf(boxGeo(1,1,1,1),[pp.x+1.8,top+.5,-3.4],[0,.3,0]));CR.push(xf(boxGeo(.8,.8,.8,1),[pp.x+2,top+1.4,-3.4],[0,-.2,0]));CR.push(xf(boxGeo(.9,.9,.9,1),[pp.x-9.6,top+.45,-2.6],[0,.5,0]));
  add(mesh(mgL(CR),mnM.wood,true,false));
  var ba=mesh(new T.CylinderGeometry(.45,.45,1.1,12),mnM.woodD,true,false);ba.position.set(pp.x+3.2,top+.55,-2.2);add(ba);
  var RL=[];for(var u=0;u<7;u+=.62)RL.push(xf(new T.BoxGeometry(.28,.1,1.5),[pp.x-13+u,top+.05,-2.6]));add(mesh(mgL(RL),mnM.woodD,false,true));
  [-.5,.5].forEach(function(z){var rl=mesh(new T.BoxGeometry(6.4,.12,.1),mnM.steel,false,false);rl.position.set(pp.x-9.6,top+.16,-2.6+z);add(rl)});
  var bt=mesh(new T.BoxGeometry(1.2,.1,.1),mnM.steel,false,false);bt.position.set(pp.x-6.1,top+.28,-2.1);bt.rotation.z=.45;add(bt)}
/* trem de minério a vapor lá no fundo da paisagem seca (pedido do dono): passa de tempos em tempos, com fumaça e apito ao longe. Só cenário. */
function mpTrain(){var Z=-19,Y=1.6,xe=(LV.camMax||114)+40,G=[],B=[],R=[],K=[],O=[],W=[],tr=new T.Group();
  /* aterro com trilho ao longo de toda a paisagem */
  var bank=new T.Shape();bank.moveTo(-60,-6);bank.lineTo(-60,Y-.25);bank.lineTo(xe+60,Y-.25);bank.lineTo(xe+60,-6);
  var bg=mesh(boxGeo(xe+120,8,3.2,3),pbr(texDirt,.97,1.2,{color:new T.Color(0xa88462)}),false,true);bg.position.set(xe/2,Y-.25-4,Z);add(bg);
  var RL=[];[-.38,.38].forEach(function(dz){RL.push(xf(new T.BoxGeometry(xe+120,.08,.08),[xe/2,Y+.02,Z+dz]))});for(var x=-60;x<xe+60;x+=.9)RL.push(xf(new T.BoxGeometry(.18,.08,1.2),[x,Y-.07,Z]));
  add(mesh(mgL(RL),mnM.woodD,false,false));
  /* locomotiva (vai para a direita) */
  var bodyM=M(0x23302c,.55,.4),trimM=M(0xb8322a,.5,.2),brass=M(0xd8a640,.35,.85);
  B.push(xf(new T.CylinderGeometry(.55,.55,2.8,14),[0,Y+1.05,0],[0,0,Math.PI/2]));B.push(xf(new T.BoxGeometry(1.4,1.5,1.3),[-1.9,Y+1.25,0]));B.push(xf(new T.BoxGeometry(1.7,.16,1.5),[-1.9,Y+2.05,0]));
  B.push(xf(new T.BoxGeometry(4.6,.3,1.25),[-.6,Y+.42,0]));B.push(xf(new T.BoxGeometry(2.2,.9,1.25),[-4.2,Y+.85,0]));
  R.push(xf(new T.CylinderGeometry(.6,.6,.12,14),[1.35,Y+1.05,0],[0,0,Math.PI/2]));R.push(xf(new T.BoxGeometry(4.7,.12,1.3),[-.6,Y+.6,0]));R.push(xf(new T.ConeGeometry(.55,.6,4),[1.75,Y+.45,0],[0,0,-Math.PI/2],[1,1,1.6]));
  K.push(xf(new T.CylinderGeometry(.2,.16,.8,10),[.85,Y+1.9,0]));K.push(xf(new T.CylinderGeometry(.34,.2,.32,10),[.85,Y+2.4,0]));K.push(xf(new T.SphereGeometry(.2,10,8),[-.1,Y+1.62,0]));
  [[.9,.42],[0,.42],[-.9,.42],[-1.8,.36],[-3.6,.32],[-4.8,.32]].forEach(function(w){[-.62,.62].forEach(function(dz){W.push(xf(new T.CylinderGeometry(w[1],w[1],.12,12),[w[0],Y+w[1],dz],[Math.PI/2,0,0]))})});
  /* vagões de minério */
  for(var i=0;i<5;i++){var cx=-7.6-i*3.3;G.push(xf(new T.BoxGeometry(2.8,1,1.3),[cx,Y+1,0]));G.push(xf(new T.BoxGeometry(3,.14,1.4),[cx,Y+1.5,0]));
    [-.9,.9].forEach(function(dx){[-.62,.62].forEach(function(dz){W.push(xf(new T.CylinderGeometry(.3,.3,.12,10),[cx+dx,Y+.3,dz],[Math.PI/2,0,0]))})});
    for(var k=0;k<6;k++)O.push(xf(new T.DodecahedronGeometry(.32,0),[cx-1+k*.4,Y+1.62+(k%2)*.12,(k%3-1)*.3],[k,k*2,0]));}
  tr.add(mesh(mgL(B),bodyM,false,false));tr.add(mesh(mgL(R),trimM,false,false));tr.add(mesh(mgL(K),brass,false,false));tr.add(mesh(mgL(W),mnM.iron,false,false));
  tr.add(mesh(mgL(G),mnM.rust,false,false));tr.add(mesh(mgL(O),mnM.ore,false,false));
  tr.position.set(-40,0,Z);add(tr);
  var puffs=[];for(i=0;i<(LITE?6:12);i++){var sp=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xe8e2da,transparent:true,depthWrite:false,opacity:0}));sp.visible=false;add(sp);puffs.push({s:sp,t:9})}
  return {g:tr,x:-40,y:Y,z:Z,sp:6.5,wait:2,x1:xe+30,puffs:puffs,pi:0,pt:0,toot:0}}
function mpTrainUpd(dt){var t=mpFx&&mpFx.train;if(!t)return;
  if(t.wait>0){t.wait-=dt;t.g.visible=false;if(t.wait<=0){t.x=-40;t.toot=1}}
  else{t.x+=t.sp*dt;t.g.visible=true;t.g.position.x=t.x;
    if(t.toot&&t.x>-25){t.toot=0;if(state==='play'){try{beep(392,.5,'triangle',.018,0,0);beep(330,.6,'triangle',.016,0,.12)}catch(e){}}}/* apito ao longe */
    t.pt-=dt;if(t.pt<=0){t.pt=.22;var q=t.puffs[t.pi++%t.puffs.length];q.t=0;q.x=t.x+.85;q.y=t.y+2.6;q.s.visible=true}
    if(t.x>t.x1){t.wait=14+Math.random()*10}}
  t.puffs.forEach(function(q){if(q.t>3)return;q.t+=dt;var u=q.t/3;q.s.position.set(q.x-u*1.5,q.y+u*3,t.z+.2);var sc=1+u*3.8;q.s.scale.set(sc,sc,1);q.s.material.opacity=.75*(1-u);if(u>=1)q.s.visible=false})}
function updMinePre(dt){if(!mpFx)return;mpTrainUpd(dt);var K=mpFx.cart,C=LV.crack;
  if(K&&C){K.t-=dt;if(K.t<=0){K.x+=11*dt;if(K.x>C.x1+6){K.x=C.x0-6;K.t=4+Math.random()*2}
      if(!K.snd&&K.x>C.x0-3){K.snd=1;if(Math.abs(P.x-(C.x0+C.x1)/2)<22){try{noise(.9,.05,300,'lowpass');beep(150,.3,'square',.025,90)}catch(e){}}}
      if(K.x>C.x1+5)K.snd=0;
      if(K.x>C.x0&&K.x<C.x1&&Math.random()<.4)emit(sparkPool,K.x+(Math.random()<.5?-.7:.7),C.y+.2,1,1.2,.25,.18,.15,2)}
    K.g.position.x=K.x;K.g.visible=K.t<=0&&K.x>C.x0-1.2&&K.x<C.x1+1.2}
  if(!mpFx.pp)return;var pp=mpFx.pp;
  /* fumacinha saindo do cano, para chamar a atenção */
  mpFx.puff-=dt;if(mpFx.puff<=0){mpFx.puff=.35+Math.random()*.3;emit(dustPool,pp.x+(Math.random()-.5)*.6,pp.top+.2,2,1.2,.5,.6,1.4,-.6)}
  if(!mpFx.told&&state==='play'&&P.x>pp.x-9){mpFx.told=1;toast('O caminho acabou! Entre no cano: suba nele e segure para baixo')}}
/* o Kuro desceu pelo cano: monta a mina e ele cai lá dentro pelo cano do teto (moedas, tempo, corações e poderes continuam) */
function mineFall(){
  var keep={coins:coinsGot,gems:gemsGot,t:timeT,hearts:hearts,bank:bank,big:!!P.big,fire:!!P.fire,cape:!!P.cape,shield:!!P.shield,tot:coins.length+extraCoins};
  $('fade').style.opacity=1;
  prePast[levelIdx]=true;var cn=carryNow;carryNow=null;
  buildLevel(levelIdx);resetState();carryNow=cn;
  coinsGot=keep.coins;gemsGot=keep.gems;timeT=keep.t;hearts=keep.hearts;bank=keep.bank;extraCoins+=keep.tot;
  P.big=keep.big;if(keep.cape)setCape(true);else if(keep.fire)setFire(true);P.shield=keep.shield;
  setHearts();$('coinN').textContent=bank;$('gemN').textContent=String(gemsGot);
  var sx=LV.pipeIn||4.6;P.x=sx;P.y=mnCeil(sx)-3.5-(P.big?1.8:1.35);P.vx=0;P.vy=0;P.grounded=false;P.onPlat=null;P.face=1;
  P.warp={t:.4,pp:{x:sx,top:P.y},tg:{x:sx,y:P.y},moved:true,exit:null};
  updateCamera(0,true);sfx.pop();toast('Kuro caiu na Mina dos Trilhos!')}
/* ---------- cenário de dentro da mina ---------- */
function mnCeil(x){var c=null;(LV.solids||[]).forEach(function(s){if(x>=s[0]-6&&x<=s[1]+6){var v=s[2]+(s[5]==='tres'?11:9.5);if(c===null||v>c)c=v}});return c===null?14:c}
function buildDecorMine(th){mnMats();var r=rnd(1503),lite=LITE,i,x,xe=sceneEnd()-30;
  mnFx={lamps:[],told:0};
  /* parede do fundo e teto de rocha */
  var WB=[],CE=[],ST=[];
  /* parede do fundo: uma peça só (pedaços sobrepostos faziam a parede tremer/piscar) */
  var wx0=-12,wx1=Math.ceil((xe+12)/6)*6-12,b0=LV.boss?LV.boss.arena[0]-4:xe,cut=[wx0,b0*.33,b0*.66,b0,wx1].filter(function(v,k,a){return k===0||v>a[k-1]});
  /* em pedaços encostados (sem sobrepor), um por trecho, cada um com a sua cor */
  for(i=0;i<cut.length-1;i++){var a0=cut[i],a1=Math.min(cut[i+1],wx1);if(a1<=a0)continue;WB.push(mnTint(xf(boxGeo(a1-a0,52,1.2,4),[(a0+a1)/2,10,-6.2]),(a0+a1)/2))}
  for(x=wx0;x<wx1;x+=6){var cy=mnCeil(x+3);
    /* teto: pedaços de 6 encostados, sem sobrepor; a frente fica um pouco atrás da parede do chefe */
    CE.push(mnTint(xf(boxGeo(6,4,8.1,3),[x+3,cy+2,-2.45]),x+3));
    for(i=0;i<(lite?1:3);i++){var sx=x+r()*6,sl=.8+r()*2.2,sg=new T.ConeGeometry(.25+r()*.4,sl,6);sg.rotateX(Math.PI);ST.push(xf(sg,[sx,cy-sl/2+.05,-5+r()*5.5]))}}
  add(mesh(mgC(WB),mnVC(mnM.rockD),false,true));add(mesh(mgC(CE),mnVC(mnM.rockD),false,false));if(ST.length)add(mesh(mgL(ST),mnM.rock,false,false));
  /* escoras de madeira: duas colunas no fundo e uma viga no teto; lampião pendurado */
  var FR=[],LA=[],gs=[];
  for(x=4;x<xe;x+=7.5+r()*2){var c=mnCeil(x),g=mnGround(x,c);if(g===null){var gg=null;(LV.solids||[]).forEach(function(s){if(x>=s[0]&&x<=s[1])gg=s[2]});if(gg===null)continue;g=gg}
    if(LV.boss&&x>LV.boss.arena[0]-3&&x<LV.boss.arena[1]+3)continue;
    FR.push(xf(new T.BoxGeometry(.5,c-g,.5),[x,(c+g)/2,-4.6]));FR.push(xf(new T.BoxGeometry(.45,.5,6.8),[x,c-.3,-1.6]));FR.push(xf(new T.BoxGeometry(.4,.4,2),[x,c-1,-3.8],[Math.PI/4,0,0]));
    var ly=c-1.6;LA.push(xf(new T.CylinderGeometry(.015,.015,1.1,4),[x+.6,c-.85,.4]));gs.push([x+.6,ly,.4])}
  add(mesh(mgL(FR),mnM.wood,true,false));if(LA.length)add(mesh(mgL(LA),mnM.iron,false,false));
  var LM=[];gs.forEach(function(p){LM.push(xf(new T.SphereGeometry(.17,8,6),p));LM.push(xf(new T.CylinderGeometry(.12,.2,.14,8),[p[0],p[1]+.18,p[2]]))});if(LM.length)add(mesh(mgL(LM),mnM.lamp,false,false));
  gs.forEach(function(p){var s=new T.Sprite(mnM.glow.clone());s.scale.set(2.6,2.6,1);s.position.set(p[0],p[1],p[2]+.1);add(s);mnFx.lamps.push(s)});
  /* cristais nas paredes (azuis e roxos), ouro e pedras soltas */
  var CA=[],CB=[],OR=[],RK=[];
  function crys(L,cx,cy,cz,sz,dn){for(var k=0;k<4;k++){var h=sz*(k?(.45+r()*.5):1),cg=new T.OctahedronGeometry(.5,0);cg.scale(.45,1.6,.45);var a=r()*6.28,tl=k?.35+r()*.5:.1;
    L.push(xf(cg,[cx+Math.cos(a)*sz*.3*(k?1:0),cy+h*.6*(dn?-1:1),cz+Math.sin(a)*sz*.2*(k?1:0)],[Math.sin(a)*tl+(dn?Math.PI:0),r()*6,-Math.cos(a)*tl],[h,h,h]))}}
  var nc=lite?26:60;for(i=0;i<nc;i++){x=-8+r()*(xe+6);var c2=mnCeil(x),g2=mnGround(x,c2)||0,L=r()<.55?CA:CB,pos=r();
    if(pos<.55)crys(L,x,g2+r()*(c2-g2)*.8,-5.4,.5+r()*.8,false);else if(pos<.8)crys(L,x,c2-.2,-3-r()*3,.4+r()*.6,true);else crys(L,x,g2-.1,-4.4+r()*1.2,.4+r()*.5,false)}
  /* galeria de cristais: bem mais cristais azuis no trecho 2; veios de carvão (manchas pretas) na parede do trecho 1 */
  var z1=b0*.33,z2=b0*.66;for(i=0;i<(lite?12:30);i++){x=z2+r()*(z2-z1);var c3=mnCeil(x),g4=mnGround(x,c3)||0;crys(r()<.8?CA:CB,x,g4+r()*(c3-g4)*.85,-5.4,.6+r()*.9,r()<.3)}
  var CO=[];for(i=0;i<(lite?12:28);i++){x=z1+r()*(z2-z1);var c4=mnCeil(x),g5=mnGround(x,c4)||0;CO.push(xf(new T.DodecahedronGeometry(.6+r()*.9,0),[x,g5+.6+r()*(c4-g5)*.8,-5.55],[r()*3,r()*3,r()*3],[1.6,.5+r()*.5,.25]))}
  if(CO.length)add(mesh(mgL(CO),M(0x141416,.5,.2,{flatShading:true}),false,false));
  add(mesh(mgL(CA),mnM.cA,false,false));add(mesh(mgL(CB),mnM.cB,false,false));
  for(i=0;i<(lite?14:34);i++){x=-6+r()*(xe+4);var g3=mnGround(x,30);if(g3===null)continue;OR.push(xf(new T.DodecahedronGeometry(.18+r()*.2,0),[x,g3+.12,-3.6-r()*1.4],[r()*3,r()*3,0]));RK.push(xf(new T.DodecahedronGeometry(.3+r()*.5,0),[x+r()*2,g3+.1,-4-r()*1.5],[r()*3,r()*3,0],[1,.6,1]))}
  add(mesh(mgL(OR),mnM.ore,false,false));add(mesh(mgL(RK),mnM.rock,true,false));
  /* barris, caixotes e picaretas encostados na parede */
  var BA=[],CR=[];[[8,0],[33,0],[109,0],[142,6],[170,6],[270,3.6],[296,3.6]].forEach(function(q,k){var bx=q[0];
    if(k%2){BA.push(xf(new T.CylinderGeometry(.45,.45,1.1,12),[bx,q[1]+.55,-3.7]));BA.push(xf(new T.CylinderGeometry(.45,.45,1.1,12),[bx+1,q[1]+.55,-3.9]))}
    else{CR.push(xf(boxGeo(1,1,1,1),[bx,q[1]+.5,-3.8],[0,.3,0]));CR.push(xf(boxGeo(.8,.8,.8,1),[bx+.2,q[1]+1.4,-3.8],[0,-.2,0]))}});
  add(mesh(mgL(BA),mnM.woodD,true,false));add(mesh(mgL(CR),mnM.wood,true,false));
  /* entrada da mina, atrás do começo: escuro (o Kuro chega pelo cano do teto) e a placa */
  /* cano pendurado no teto: por ele o Kuro cai da superfície (parte 1 do Mundo 15) */
  var px0=LV.pipeIn||4.6,pcy=mnCeil(px0),pb=pcy-3.5;
  var pbd=mesh(new T.CylinderGeometry(.62,.62,pcy+1-pb,22),pipeM,true,false);pbd.position.set(px0,(pcy+1+pb)/2,0);add(pbd);
  var prm=mesh(new T.CylinderGeometry(.76,.76,.42,22),pipeRimM,false,false);prm.position.set(px0,pb+.21,0);add(prm);
  var phole=mesh(new T.CircleGeometry(.6,20),new T.MeshBasicMaterial({color:0x050302}),false,false);phole.rotation.x=Math.PI/2;phole.position.set(px0,pb-.005,0);add(phole);
  var EA=[];EA.push(xf(new T.BoxGeometry(.7,9,.7),[-3.4,4.5,-1.4]));EA.push(xf(new T.BoxGeometry(.7,9,.7),[-3.4,4.5,-5.6]));EA.push(xf(new T.BoxGeometry(.8,.8,5.2),[-3.4,9,-3.5]));add(mesh(mgL(EA),mnM.wood,true,false));
  var pc=document.createElement('canvas');pc.width=256;pc.height=64;var k2=pc.getContext('2d');k2.fillStyle='#6a4a2a';k2.fillRect(0,0,256,64);k2.strokeStyle='#3a2414';k2.lineWidth=6;k2.strokeRect(3,3,250,58);
  k2.fillStyle='#ffe6a8';k2.font='bold 30px Arial';k2.textAlign='center';k2.textBaseline='middle';k2.fillText('MINA DOS TRILHOS',128,34);
  var pt=new T.CanvasTexture(pc);pt.encoding=T.sRGBEncoding;var pm=new T.Mesh(new T.PlaneGeometry(4,1),new T.MeshStandardMaterial({map:pt,roughness:.7}));pm.position.set(1.5,7.6,-3.9);add(pm);
  var hk=mesh(new T.BoxGeometry(4.4,.2,.2),mnM.woodD,false,false);hk.position.set(1.5,8.3,-4);add(hk);
  /* um vagonete velho cheio de ouro, parado no começo */
  var oc=new T.Group();oc.position.set(-1.2,0,-3.4);add(oc);var ob=mesh(boxGeo(1.8,.8,1.1,1),mnM.rust,true,false);ob.position.y=.75;oc.add(ob);
  for(i=0;i<7;i++){var on=mesh(new T.DodecahedronGeometry(.2+r()*.1,0),mnM.ore,false,false);on.position.set(-.6+r()*1.2,1.2+r()*.15,-.3+r()*.6);oc.add(on)}
  /* poeira no ar */
  var n=lite?60:140,pos=new Float32Array(n*3);for(i=0;i<n;i++){pos[i*3]=-6+r()*(xe+6);pos[i*3+1]=r()*14;pos[i*3+2]=-4+r()*6}
  var pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));add(new T.Points(pg,new T.PointsMaterial({color:0xffd8a0,size:.07,transparent:true,opacity:.5,depthWrite:false})));
}
function buildFarMine(th,r){/* fundo: escuridão quente com brilhos de cristal bem longe */
  for(var i=0;i<14;i++){var s=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:i%2?0x40c8e0:0xa060e0,transparent:true,opacity:.18,blending:T.AdditiveBlending,depthWrite:false,fog:false}));
    var sz=20+r()*30;s.scale.set(sz,sz,1);s.position.set(-150+i*24+r()*10,-5+r()*30,-140);farG.add(s)}}
/* ---------- toupeira mineira: sai do buraco, anda um pouco e volta para baixo da terra ---------- */
function makeMole(){var g=new T.Group(),inner=new T.Group();g.add(inner);
  var fur=M(0x6a4a34,.95),pink=M(0xf08aa0,.5),hel=M(0xf2c230,.35,.3),dk=M(0x2a1a10,.6);
  var bd=mesh(new T.SphereGeometry(.42,14,10),fur,true,false);bd.scale.set(1,1,1.15);bd.position.y=.42;inner.add(bd);
  var be=mesh(new T.SphereGeometry(.3,12,8),M(0xb08a6a,.95),false,false);be.scale.set(1,1,.6);be.position.set(0,.36,.25);inner.add(be);
  var hd=mesh(new T.SphereGeometry(.3,12,10),fur,true,false);hd.position.set(0,.66,.3);inner.add(hd);
  var no=mesh(new T.SphereGeometry(.1,10,8),pink,false,false);no.scale.set(1.2,.9,1);no.position.set(0,.6,.6);inner.add(no);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.05,8,6),dk,false,false);ey.position.set(sd*.11,.73,.53);inner.add(ey)});
  var hm=mesh(new T.SphereGeometry(.31,14,8,0,6.283,0,1.5),hel,true,false);hm.position.set(0,.74,.28);inner.add(hm);
  var br=mesh(new T.TorusGeometry(.3,.03,6,16),hel,false,false);br.rotation.x=Math.PI/2;br.position.set(0,.75,.28);inner.add(br);
  var lm=mesh(new T.CylinderGeometry(.07,.08,.08,10),mnM?mnM.lamp:M(0xffe0a0),false,false);lm.rotation.x=Math.PI/2;lm.position.set(0,.92,.56);inner.add(lm);
  var arms=[];[-1,1].forEach(function(sd){var a=new T.Group();a.position.set(sd*.36,.4,.28);inner.add(a);var pw=mesh(new T.SphereGeometry(.13,8,6),pink,false,false);pw.scale.set(1,.5,1.2);pw.position.set(sd*.06,-.06,.06);a.add(pw);
    for(var k=0;k<3;k++){var cl=mesh(new T.ConeGeometry(.025,.12,4),M(0xf0e8d8,.4),false,false);cl.rotation.x=Math.PI/2;cl.position.set(sd*.06+(k-1)*.05,-.08,.2);a.add(cl)}arms.push(a)});
  var mound=mesh(new T.SphereGeometry(.6,12,6,0,6.283,0,1.4),mnM?mnM.dirt:M(0x8a6a4a,.95),false,true);mound.scale.set(1,.35,.8);g.add(mound);
  add(g);return {g:g,inner:inner,arms:arms,mound:mound,lamp:lm}}
function moleAI(e,dt){e.mt=(e.mt||0)+dt;var cyc=4.4,u=((e.mt+(e.ph||0))%cyc+cyc)%cyc,pop;
  if(u<1.3)pop=0;else if(u<1.6)pop=(u-1.3)/.3;else if(u<3.8)pop=1;else if(u<4.1)pop=1-(u-3.8)/.3;else pop=0;
  if(pop===0&&!e.moved){/* debaixo da terra: vai para perto do Kuro (dentro do seu trecho) */e.moved=true;var tx=clamp(P.x,e.x0,e.x1);if(Math.abs(P.x-e.x)<9)e.x=tx;e.dir=P.x>e.x?1:-1}
  if(pop>0)e.moved=false;
  if(pop>=1){var nx=e.x+e.dir*.9*dt;if(nx<e.x0||nx>e.x1)e.dir=-e.dir;else e.x=nx}
  if(e.pop0<.5&&pop>=.5){emit(dustPool,e.x,e.y+.3,8,2.2,.5,.55,1.2,-.3);try{noise(.18,.03,700,'lowpass')}catch(er){}}
  e.pop0=pop;e.pop=pop;e.noHit=pop<.55;e.safe=pop<.55;e.h=.95*Math.max(.2,pop)}
function moleVis(e,dt){var v=e.vis,pop=e.slp>0||e.wake?1:(e.pop||0);v.g.rotation.y=0;v.inner.rotation.y=e.dir>0?.5:-.5;
  v.inner.position.y=-.95*(1-pop);v.inner.visible=pop>.02;var sw=pop>=1?Math.sin(tm*8+e.ph)*.5:0;v.arms.forEach(function(a,i){a.rotation.x=(i?sw:-sw)-(pop<1?1:0)});
  v.mound.scale.set(1+.15*Math.sin(tm*20)*(pop>0&&pop<1?1:0),.35,.8)}
/* =================== chefe: o Toupeirão =================== */
function mnBossBuild(){mnMats();var B=LV.boss,ar=B.arena;
  var g=new T.Group(),inner=new T.Group();g.add(inner);add(g);
  var fur=M(0x5a3a28,.92),furL=M(0xa07a5a,.95),pink=M(0xf28aa2,.45),hel=M(0xf2c230,.3,.35),dk=M(0x1a1008,.5),gl=new T.MeshStandardMaterial({color:0x9ad8ff,roughness:.05,metalness:.3,transparent:true,opacity:.75});
  var bd=mesh(new T.SphereGeometry(1,20,14),fur,true,false);bd.scale.set(1.15,1.05,1);bd.position.y=1.15;inner.add(bd);
  var be=mesh(new T.SphereGeometry(.8,16,12),furL,false,false);be.scale.set(1,1.05,.55);be.position.set(0,1.05,.62);inner.add(be);
  var head=new T.Group();head.position.set(0,2.15,.35);inner.add(head);
  var hd=mesh(new T.SphereGeometry(.68,18,12),fur,true,false);head.add(hd);
  var no=mesh(new T.SphereGeometry(.22,12,10),pink,false,false);no.scale.set(1.3,1,1);no.position.set(0,-.12,.66);head.add(no);
  for(var k=0;k<8;k++){var a=k/8*6.283,t=mesh(new T.ConeGeometry(.05,.18,5),pink,false,false);t.rotation.x=Math.PI/2;t.position.set(Math.cos(a)*.22,-.12+Math.sin(a)*.17,.8);head.add(t)}/* nariz-estrela */
  [-1,1].forEach(function(sd){var gg=mesh(new T.TorusGeometry(.17,.05,8,16),dk,false,false);gg.position.set(sd*.24,.14,.58);gg.rotation.y=sd*.25;head.add(gg);var gs=mesh(new T.CircleGeometry(.15,14),gl,false,false);gs.position.set(sd*.24,.14,.6);gs.rotation.y=sd*.25;head.add(gs);
    var ey=mesh(new T.SphereGeometry(.06,8,6),M(0xff4a2a,.3,0,{emissive:new T.Color(0xc02010),emissiveIntensity:1}),false,false);ey.position.set(sd*.24,.14,.55);head.add(ey)});
  var hm=mesh(new T.SphereGeometry(.72,18,10,0,6.283,0,1.45),hel,true,false);hm.position.y=.12;head.add(hm);
  var brim=mesh(new T.TorusGeometry(.7,.06,6,20),hel,false,false);brim.rotation.x=Math.PI/2;brim.position.y=.18;head.add(brim);
  var lp=mesh(new T.CylinderGeometry(.16,.19,.16,12),mnM.lamp,false,false);lp.rotation.x=Math.PI/2;lp.position.set(0,.52,.6);head.add(lp);
  var beam=new T.Sprite(mnM.glow.clone());beam.scale.set(3,3,1);beam.position.set(0,.55,.9);head.add(beam);
  var drills=[],arms=[];[-1,1].forEach(function(sd){var a=new T.Group();a.position.set(sd*1.05,1.35,.3);inner.add(a);
    var up=mesh(new T.SphereGeometry(.34,12,8),fur,true,false);up.scale.set(1,1.3,1);a.add(up);
    var dr=new T.Group();dr.position.set(sd*.15,-.25,.55);dr.rotation.x=Math.PI/2*.85;a.add(dr);
    var cn=mesh(new T.ConeGeometry(.32,1.2,12),mnM.steel,true,false);cn.position.y=.6;dr.add(cn);
    for(var k=0;k<4;k++){var rg=mesh(new T.TorusGeometry(.26-k*.06,.035,5,12),mnM.iron,false,false);rg.rotation.x=Math.PI/2;rg.position.y=.2+k*.27;dr.add(rg)}
    var col=mesh(new T.CylinderGeometry(.3,.3,.2,12),hel,false,false);dr.add(col);drills.push(dr);arms.push(a)});
  var feet=[];[-1,1].forEach(function(sd){var f=mesh(new T.SphereGeometry(.3,10,8),pink,false,false);f.scale.set(1,.5,1.4);f.position.set(sd*.55,.12,.25);inner.add(f);feet.push(f)});
  var stars=new T.Group();stars.position.set(0,3.25,.3);stars.visible=false;inner.add(stars);
  var sm=new T.MeshStandardMaterial({color:0xffe066,emissive:0xffc200,emissiveIntensity:1.6});for(var j=0;j<3;j++){var s=mesh(new T.OctahedronGeometry(.16),sm,false,false);var aa=j/3*6.283;s.position.set(Math.cos(aa)*.5,0,Math.sin(aa)*.5);stars.add(s)}
  var mound=mesh(new T.SphereGeometry(1.1,14,7,0,6.283,0,1.4),mnM.dirt,false,true);mound.scale.set(1,.4,.8);mound.visible=false;add(mound);
  var crk=mesh(new T.RingGeometry(.4,1.3,14,1),new T.MeshBasicMaterial({color:0x1a0c04,transparent:true,opacity:.7,depthWrite:false}),false,false);crk.rotation.x=-Math.PI/2;crk.visible=false;add(crk);
  var wallM=mnM.rock;function wall(x0,x1,dead){var m=mesh(boxGeo(x1-x0,24,6.8,2.6),wallM);m.position.set((x0+x1)/2,B.top+10,-1.6);add(m);var o={l:x0,r:x1,t:B.top+22,b:-14,oneway:false,wall:true,dead:dead,mesh:m};m.visible=!dead;solids.push(o);return o}
  wall(ar[1],ar[1]+2,false);var wl=wall(ar[0]-2,ar[0],true);
  boss={mine:1,x:B.x,x0:B.x,y:B.top,top:B.top,dir:-1,hp:B.hp,max:B.hp,state:'wait',t:0,vx:0,w:1.5,h:2.7,ph:0,deadT:0,core:false,aL:ar[0],aR:ar[1],trig:B.trigger,wallL:wl,n:0,yy:-3.2,flash:0,
    vis:{g:g,inner:inner,head:head,drills:drills,arms:arms,feet:feet,fur:fur,beam:beam},stars:stars,mound:mound,crk:crk,tx:B.x,told:{}};
  g.visible=false;mnRocks=[];
  var bn=$('bossBar').querySelector('span');if(bn)bn.textContent='Toupeirão'}
function mnBossReset(){var b=boss;b.state='wait';b.hp=b.max;b.x=b.x0;b.dir=-1;b.t=0;b.vx=0;b.deadT=0;b.core=false;b.n=0;b.yy=-3.2;b.flash=0;
  b.wallL.dead=true;b.wallL.mesh.visible=false;b.vis.g.visible=false;b.mound.visible=false;b.crk.visible=false;b.stars.visible=false;b.vis.inner.scale.set(1,1,1);b.vis.inner.rotation.set(0,0,0);
  mnRocks.forEach(function(k){if(k.m.parent)k.m.parent.remove(k.m);if(k.sh.parent)k.sh.parent.remove(k.sh)});mnRocks=[]}
function mnBossHit(how){var b=boss;if(!b||b.state==='dead'||b.state==='wait'||b.state==='intro')return;
  if(b.state==='down'||b.state==='under'||b.state==='warn'||b.state==='up')return;
  if(b.state!=='stun'){if(how==='pogo'){P.vy=11;P.grounded=false;P.onPlat=null}
    sfx.check();emit(sparkPool,b.x+(P.x<b.x?-1:1)*b.w*.8,b.top+1.4,8,3.5,.4,.3,.2,2);
    if(!b.told.guard){b.told.guard=1;toast('As brocas protegem ele! Espere ele ficar tonto')}return}
  b.hp--;if(how==='heavy'&&b.hp>1)b.hp--;setBossBar();sfx.stomp();try{sfx.crunch()}catch(e){}shake=.4;b.flash=.16;hitStop=.08;
  emit(sparkPool,b.x,b.top+b.h,14,4,.6,.4,.3,5);emit(dustPool,b.x,b.top+1.5,10,3,.6,.7,1.2,-.2);
  if(how==='stomp'||how==='pogo'){P.vy=13;P.grounded=false;P.onPlat=null}
  if(b.hp<=0){b.state='dead';b.deadT=0;sfx.win();emit(sparkPool,b.x,b.top+1.5,40,7,1.2,.6,.5,4);$('bossBar').hidden=true;mnRocks.forEach(function(k){k.dead=1})}
  else{b.state='hurt';b.t=1.0;toast(b.hp===1?'Falta só um golpe!':(b.hp===3?'Ele ficou bravo! Cuidado com as pedras do teto':'Mais '+b.hp+' golpes!'))}}
function mnBossSeq(b){return b.hp>3?['charge','dig','charge','dig','dig']:['dig','rocks','charge','dig','rocks','charge']}
function mnRockDrop(x,delay){var m=mesh(new T.DodecahedronGeometry(.55,0),mnM.rock,true,false);m.visible=false;add(m);
  var sh=mesh(new T.CircleGeometry(.6,16),new T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0,depthWrite:false}),false,false);sh.rotation.x=-Math.PI/2;sh.position.set(x,boss.top+.03,0);add(sh);
  mnRocks.push({x:x,y:boss.top+10,vy:0,d:delay,m:m,sh:sh,dead:0})}
function mnRocksUpd(dt){for(var i=mnRocks.length-1;i>=0;i--){var k=mnRocks[i];
  if(k.dead){if(k.m.parent)k.m.parent.remove(k.m);if(k.sh.parent)k.sh.parent.remove(k.sh);mnRocks.splice(i,1);continue}
  if(k.d>0){k.d-=dt;k.sh.material.opacity=.15+.3*(1-Math.max(0,k.d)/1.2);k.sh.scale.setScalar(.6+.4*(1-Math.max(0,k.d)/1.2));if(k.d<=0)k.m.visible=true;continue}
  k.vy-=30*dt;k.y+=k.vy*dt;k.m.position.set(k.x,k.y+.5,0);k.m.rotation.x+=dt*4;k.sh.material.opacity=.5;
  if(state==='play'&&Math.abs(P.x-k.x)<.55+P.w/2&&P.y<k.y+1&&P.y+P.h>k.y)hurt(k.x);
  if(k.y<=boss.top){shake=Math.max(shake,.25);emit(dustPool,k.x,boss.top+.3,8,2.5,.6,.6,1.2,-.3);spawnPieces(k.x,boss.top+.4,5,mnM.rock,1.6);try{noise(.2,.05,400,'lowpass')}catch(e){}k.dead=1}}}
function mnBossUpd(dt){var b=boss,lo=b.aL+b.w+.3,hi=b.aR-b.w-.3;mnRocksUpd(dt);
  if(b.state==='wait'){if(P.x>b.trig&&state==='play'){b.state='intro';b.t=1.6;b.yy=-3.2;b.vis.g.visible=true;b.wallL.dead=false;b.wallL.mesh.visible=true;enterArena();
      $('bossBar').hidden=false;setBossBar();shake=.6;sfx.boss();toast('O Toupeirão saiu da terra! Katana: toque para cortar. Shuriken: atire de longe');emit(dustPool,b.x,b.top+.5,22,4,.9,.9,1.3,-.2)}return}
  if(b.state==='dead'){b.deadT+=dt;if(!b.core&&b.deadT>1.2){b.core=true;b.vis.g.visible=false;items.push(mkItem('core',b.x,b.top+1.6));emit(sparkPool,b.x,b.top+1.6,30,6,1.4,.6,.5,2);emit(dustPool,b.x,b.top+.4,16,3,.8,.8,1.3,-.2)}return}
  b.t-=dt;
  if(b.state==='intro'){b.yy=Math.min(0,b.yy+dt*4);if(b.t<=0){b.state='idle';b.t=1}}
  else if(b.state==='idle'){b.dir=P.x>b.x?1:-1;if(b.t<=0){var seq=mnBossSeq(b),mv=seq[b.n%seq.length];b.n++;
      if(mv==='charge'){b.state='rev';b.t=.6;sfx.boss()}
      else if(mv==='dig'){b.state='down';b.t=.55;sfx.boss();try{noise(.5,.06,300,'lowpass')}catch(e){}}
      else{b.state='roar';b.t=1.3;b.dropped=false;sfx.boss()}}}
  else if(b.state==='rev'){b.dir=P.x>b.x?1:-1;if(((tm*30)|0)%2===0)emit(dustPool,b.x-b.dir*.8,b.top+.2,1,1.6,.4,.5,1.2,-.3);if(b.t<=0){b.state='charge';b.vx=b.dir*(7.5+(b.max-b.hp)*.7)}}
  else if(b.state==='charge'){b.x+=b.vx*dt;if(((tm*30)|0)%2===0)emit(sparkPool,b.x+b.dir*1.6,b.top+1.2,2,2.5,.3,.25,.2,2);
    if(b.x<=lo||b.x>=hi){b.x=clamp(b.x,lo,hi);b.state='stun';b.t=2.6;b.vx=0;shake=.6;sfx.boom();emit(dustPool,b.x+b.dir*b.w,b.top+1.2,14,3.5,.7,.9,1.3,-.2);mnRockDrop(clamp(b.x-b.dir*3,lo,hi),.5);
      if(!b.told.stun){b.told.stun=1;toast('As brocas ficaram presas na parede! Agora: ataque!')}}}
  else if(b.state==='down'){b.yy=-3.2*clamp(1-b.t/.55,0,1);if(((tm*30)|0)%2===0)emit(dustPool,b.x+(Math.random()-.5)*2,b.top+.3,2,2,.5,.6,1.2,-.3);if(b.t<=0){b.state='under';b.t=b.hp>3?1.6:1.2;b.yy=-3.2}}
  else if(b.state==='under'){var tx=clamp(P.x,lo,hi),dx=tx-b.x,sp=b.hp>3?6.5:8.5;b.x+=Math.sign(dx)*Math.min(Math.abs(dx),sp*dt);b.dir=dx>0?1:-1;
    if(((tm*30)|0)%2===0)emit(dustPool,b.x,b.top+.2,1,1.8,.5,.5,1.2,-.3);if(b.t<=0||Math.abs(dx)<.15){b.state='warn';b.t=b.hp>3?.8:.62;try{noise(.6,.05,200,'lowpass')}catch(e){}}}
  else if(b.state==='warn'){shake=Math.max(shake,.12);if(((tm*30)|0)%2===0)emit(dustPool,b.x+(Math.random()-.5)*2.2,b.top+.2,2,2.4,.4,.5,1.2,-.4);if(b.t<=0){b.state='up';b.t=.28;sfx.boom();shake=.7;emit(dustPool,b.x,b.top+.5,24,5,.9,.9,1.3,-.2);spawnPieces(b.x,b.top+.4,8,mnM.dirt,1.8);
      if(state==='play'&&Math.abs(P.x-b.x)<b.w+.5&&P.y<b.top+2.4)hurt(b.x)}}
  else if(b.state==='up'){b.yy=-3.2*clamp(b.t/.28,0,1);if(b.t<=0){b.yy=0;b.state='stun';b.t=b.hp>3?2.4:2;if(!b.told.up){b.told.up=1;toast('Ele saiu tonto do buraco! Ataque agora!')}}}
  else if(b.state==='roar'){if(!b.dropped&&b.t<=.9){b.dropped=true;shake=.8;var xs=[clamp(P.x,lo-1,hi+1)],tries=0;while(xs.length<4&&tries<40){tries++;var rx=b.aL+1+Math.random()*(b.aR-b.aL-2);if(xs.every(function(v){return Math.abs(v-rx)>2.6})&&Math.abs(rx-b.x)>1.6)xs.push(rx)}
      xs.forEach(function(x,i){mnRockDrop(x,.9+i*.25)});if(!b.told.rock){b.told.rock=1;toast('Pedras do teto! Fuja das sombras no chão')}}
    if(b.t<=0){b.state='idle';b.t=.7}}
  else if(b.state==='stun'){if(b.t<=0){b.state='idle';b.t=.8}}
  else if(b.state==='hurt'){if(b.t<=0){b.state='idle';b.t=.6}}
  /* encostar no Toupeirão machuca (menos quando ele está tonto: aí o Kuro pode pular em cima) */
  var hid=b.state==='down'||b.state==='under'||b.state==='warn'||(b.state==='up'&&b.yy<-1.5)||(b.state==='intro'&&b.yy<-1.5);
  if(!hid&&state==='play'&&Math.abs(P.x-b.x)<P.w/2+b.w&&P.y<b.top+b.h&&P.y+P.h>b.top){
    if(P.vy<=.5&&P.y>b.top+b.h*.55){if(b.state==='stun')bossHit('stomp');else{P.vy=11;P.grounded=false;P.onPlat=null;sfx.stomp()}}
    else if(b.state!=='stun'&&b.state!=='hurt')hurt(b.x)}}
function mnBossVis(dt){var b=boss,v=b.vis,st=b.state;if(st==='wait')return;
  var hid=st==='down'||st==='under'||st==='warn';
  v.g.visible=!b.core&&st!=='under'&&st!=='warn';v.g.position.set(b.x,b.top+b.yy,0);v.g.rotation.y=b.dir>0?Math.PI/2*.7:-Math.PI/2*.7;
  b.mound.visible=hid||st==='up';b.mound.position.set(b.x,b.top,0);b.mound.scale.set(1+(st==='warn'?Math.sin(tm*40)*.12:0),.4+(st==='warn'?.15:0),.8);
  b.crk.visible=st==='warn';b.crk.position.set(b.x,b.top+.03,.1);
  b.ph+=dt*(st==='charge'?14:4);var spin=st==='charge'||st==='rev'||st==='down'||st==='up'?30:(st==='stun'?0:6);v.drills.forEach(function(d){d.rotation.y+=dt*spin});
  v.arms.forEach(function(a,i){var sd=i?1:-1;a.rotation.x=st==='charge'||st==='rev'?-1.1:(st==='roar'?-2.2+Math.sin(tm*20)*.2:Math.sin(b.ph+i*Math.PI)*.25);a.rotation.z=st==='stun'?sd*.6:0});
  v.feet.forEach(function(f,i){f.position.z=.25+(st==='charge'?Math.sin(b.ph+i*Math.PI)*.3:0)});
  b.stars.visible=st==='stun';if(st==='stun')b.stars.rotation.y+=dt*4;
  v.inner.rotation.z=st==='stun'?Math.sin(tm*5)*.12:0;v.head.rotation.x=st==='roar'?-.4:0;
  if(b.flash>0){b.flash=Math.max(0,b.flash-dt);v.fur.emissive.setHex(0xffffff);v.fur.emissiveIntensity=b.flash/.16}else v.fur.emissiveIntensity=0;
  if(st==='dead'){var k=b.deadT;v.inner.scale.set(1+k*.3,Math.max(.05,1-k*.8),1+k*.3)}else{var pu=st==='hurt'?1+Math.sin(tm*40)*.05:1;v.inner.scale.set(pu,pu,pu)}
  v.beam.material.opacity=hid?0:.45+.1*Math.sin(tm*7)}
/* paredes do vagonete: dentro dele o Kuro não sai andando pelos lados; só sai pulando por cima da borda */
function mnWallX(){mnCarts.forEach(function(K){
  if(P.onPlat===K.so&&K.st!=='gone')K.inside=true;
  if(!K.inside)return;
  var rim=K.so.t+.77;
  if(K.st==='gone'||P.y>=rim||P.y<K.so.t-.6||Math.abs(P.x-K.x)>2.5||P.warp||P.climb||state!=='play'){K.inside=false;return}
  var lo=K.x-.98+P.w/2,hi=K.x+.98-P.w/2;
  if(P.x<lo){P.x=lo;if(P.vx<0)P.vx=0}else if(P.x>hi){P.x=hi;if(P.vx>0)P.vx=0}})}
