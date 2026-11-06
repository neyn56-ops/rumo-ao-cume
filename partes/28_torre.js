/*@@parte:28_torre.js*/
/* ===================== Mundo 14: A Torre dos Vaga-lumes =====================
   Subida por dentro de uma torre de relógio velha, no meio do pântano, à noite.
   Engrenagens (rodas-gigantes de bronze) com tábuas que ficam sempre retas: só giram quando um vaga-lume pousa no eixo.
   LV.gears: {x,y,r,n,w,on,off,ph}  (on/off = segundos com luz / sem luz; on=0 => sempre acesa)
   LV.bell: {x,y}  o sino (tocar = fim da fase)  · vigas de madeira firmes */
var twG=[],twFx=null,twM=null;
function twMats(){if(twM)return;
  var bz=pbr(texStone,.5,.5,{color:new T.Color(0x9a7440)});bz.metalness=.55;
  var bzD=pbr(texStone,.5,.5,{color:new T.Color(0x8a6430)});bzD.metalness=.7;
  twM={bronze:bz,bronzeD:bzD,plank:pbr(texWood,.85,1.4,{color:new T.Color(0xb08a5e)}),beam:pbr(texWood,.95,1.5,{color:new T.Color(0x7a5a3c)}),
    wall:M(0x464e62,.95,0,{map:texStone.map}),wallD:pbr(texWood,1,1.2,{color:new T.Color(0x3e3024)}),moss:M(0x3e6e2e,.9,0,{map:texGrass.map}),gold:M(0xd8a840,.32,.85,{side:T.DoubleSide}),
    glow:new T.SpriteMaterial({map:softSprite(),color:0xffd860,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false})}}
function twGearGeo(R){/* roda de bronze com dentes, aro e raios */
  var g=[],k,n=Math.max(10,Math.round(R*6));
  var disk=new T.CylinderGeometry(R*.82,R*.82,.28,28);disk.rotateX(Math.PI/2);g.push(disk);
  for(k=0;k<n;k++){var a=k/n*6.283,t=new T.BoxGeometry(.42,.5,.3);t.rotateZ(a);t.translate(Math.cos(a)*R*.9,Math.sin(a)*R*.9,0);g.push(t)}
  var rim=new T.TorusGeometry(R*.62,.1,5,24);rim.translate(0,0,.16);g.push(rim);
  for(k=0;k<5;k++){var sp=new T.BoxGeometry(R*.62,.16,.1);sp.translate(R*.31,0,.18);sp.rotateZ(k/5*6.283);g.push(sp)}
  return mgL(g)}
function buildPlatformsTower(){
  twMats();twG=[];
  /* chão de tábuas com musgo e as vigas */
  LV.solids.forEach(function(s){var x0=s[0],x1=s[1],top=s[2],w=x1-x0,cx=(x0+x1)/2,ground=top<.5;
    if(s[3]==='terra'){twTerra(x0,x1,top);solids.push({l:x0,r:x1,t:top,b:top-3.5,oneway:false});return}/* lá fora: ilha / colina de terra com grama */
    if(s[3]==='tabua'){twDeck(x0,x1,top);solids.push({l:x0,r:x1,t:top,b:top-.4,oneway:false});return}/* lá fora: passarela de madeira sobre a água */
    var th=ground?1.2:.6,b=mesh(boxGeo(w,th,ground?4:2.2,2),twM.beam,true,true);b.position.set(cx,top-th/2,ground?-.6:-.3);add(b);
    var mo=mesh(boxGeo(w,.12,ground?4:2.2,2),twM.moss,false,true);mo.position.set(cx,top-.04,ground?-.6:-.3);add(mo);
    if(!ground){/* mão-francesa presa na parede */for(var e=0;e<2;e++){var ex=e?x1-.4:x0+.4;if(ex<1.2||ex>22.8){var br=mesh(new T.BoxGeometry(.25,1.6,.25),twM.beam,true,false);br.position.set(ex+(ex<12?-.3:.3),top-1.2,-.3);br.rotation.z=ex<12?.6:-.6;add(br)}}}
    solids.push({l:x0,r:x1,t:top,b:top-th,oneway:false})});/* vigas firmes, como no jogo inteiro (pedido do dono) */
  /* engrenagens */
  (LV.gears||[]).forEach(function(q0,i){var q=Object.assign({},q0);/* cópia: alavanca e sino mudam a roda sem mexer nos dados da fase */var R=q.r||2.6,n=q.n||4,grp=new T.Group();grp.position.set(q.x,q.y,-.9);add(grp);
    var gm=twM.bronze.clone();gm.emissive=new T.Color(0xffb030);gm.emissiveIntensity=0;var wheel=mesh(twGearGeo(R),gm,true,false);grp.add(wheel);var s;
    var hub=mesh(new T.CylinderGeometry(.42,.42,.6,14),twM.bronzeD,false,false);hub.rotation.x=Math.PI/2;hub.position.z=.25;grp.add(hub);
    var hg=new T.Sprite(twM.glow.clone());hg.scale.set(2.2,2.2,1);hg.position.z=.5;hg.material.opacity=0;grp.add(hg);
    var P0=[];for(s=0;s<n;s++){var pg=new T.Group();add(pg);
      var pk=mesh(boxGeo(1.8,.3,1.5,1),twM.plank,true,true);pk.position.y=-.15;pg.add(pk);
      var arm=mesh(new T.CylinderGeometry(.06,.06,1,6),twM.bronzeD,false,false);arm.position.set(0,.2,-.6);pg.add(arm);
      var so={l:0,r:0,t:0,b:0,oneway:false,twr:1};/* tábua firme: o Kuro bate a cabeça embaixo e não atravessa pelos lados */solids.push(so);P0.push({g:pg,arm:arm,so:so,x:0,y:0})}
    /* o vaga-lume dono desta roda */
    var fl=new T.Sprite(twM.glow.clone());fl.scale.set(.9,.9,1);add(fl);var fc=mesh(new T.SphereGeometry(.09,8,6),new T.MeshBasicMaterial({color:0xfff2a0}),false,false);fl.add(fc);
    if(q.mill||q.nofly){/* lá fora, de dia: roda d'água de madeira / engrenagem enterrada, sempre girando, sem vaga-lume */fl.visible=false;hg.visible=false;q.on=0;if(q.mill){wheel.material=twM.beam}}
    var G={q:q,R:R,n:n,a:(q.a0||0),v:0,lit:0,wheel:wheel,gm:gm,hg:hg,pl:P0,fly:fl,t:(q.ph||0)};twG.push(G);twPlace(G,0)});
  /* plataformas de luz: só ficam firmes quando um vaga-lume passa perto (LV.lights [x0,x1,y]; LV.lflies {pts:[[x,y],..],sp}) */
  twL=[];twLF=[];
  (LV.lights||[]).forEach(function(q){var w=q[1]-q[0],cx=(q[0]+q[1])/2;
    var m=new T.MeshStandardMaterial({color:0xffd870,emissive:new T.Color(0xffa820),emissiveIntensity:.9,transparent:true,opacity:.9,roughness:.4,metalness:0,depthWrite:false});
    var pm=new T.Mesh(new T.BoxGeometry(w,.3,1.4),m);pm.position.set(cx,q[2]-.15,0);add(pm);
    var ed=new T.LineSegments(new T.EdgesGeometry(pm.geometry),new T.LineBasicMaterial({color:0xffe9a0,transparent:true,opacity:.5}));pm.add(ed);
    var so={l:q[0],r:q[1],t:q[2],b:q[2]-.3,oneway:false,light:1};solids.push(so);twL.push({q:q,m:pm,mat:m,ed:ed,so:so,k:1,g:0})});
  (LV.lflies||[]).forEach(function(f){var sp=new T.Sprite(twM.glow.clone());sp.scale.set(1.6,1.6,1);add(sp);var c=mesh(new T.SphereGeometry(.12,8,6),new T.MeshBasicMaterial({color:0xfff2a0}),false,false);sp.add(c);
    var L=0,seg=[];for(var i=1;i<f.pts.length;i++){var d=Math.hypot(f.pts[i][0]-f.pts[i-1][0],f.pts[i][1]-f.pts[i-1][1]);seg.push(d);L+=d}
    twLF.push({f:f,s:sp,L:L,seg:seg,t:(f.ph||0)*L,x:f.pts[0][0],y:f.pts[0][1]})});
  twLight(0);buildLevers();buildOutside();
}
var twL=[],twLF=[];
function twLight(dt){
  twLF.forEach(function(F){F.t+=dt*(F.f.sp||1.6);var u=F.t%(2*F.L);if(u>F.L)u=2*F.L-u;/* vai e volta pelo caminho */
    var i=0,pts=F.f.pts;while(i<F.seg.length-1&&u>F.seg[i]){u-=F.seg[i];i++}var k=F.seg[i]?Math.min(1,u/F.seg[i]):0;
    F.x=pts[i][0]+(pts[i+1][0]-pts[i][0])*k;F.y=pts[i][1]+(pts[i+1][1]-pts[i][1])*k+Math.sin(tm*3+i)*.15;
    F.s.position.set(F.x,F.y,.5);var tw=.85+.15*Math.sin(tm*12);F.s.scale.set(1.6*tw,1.6*tw,1)});
  twL.forEach(function(L){var q=L.q,so=L.so,near=false;
    twLF.forEach(function(F){var cx=Math.max(q[0],Math.min(F.x,q[1]));if(Math.hypot(F.x-cx,F.y-q[2])<2.8)near=true});
    if(near)L.g=.45;else L.g=Math.max(0,L.g-dt);/* um tiquinho de tempo depois que o vaga-lume sai: pisca e some */
    var on=near||L.g>0,blink=!near&&L.g>0&&Math.sin(tm*30)>0;
    if(!on&&!so.dead){/* apagou: some (se o Kuro estava em cima, cai) */so.dead=true;if(P.onPlat===so){P.grounded=false;P.onPlat=null}}
    else if(on&&so.dead){/* acendeu: só volta firme se não tiver ninguém dentro */var inside=P.x+P.w/2>so.l&&P.x-P.w/2<so.r&&P.y<so.t&&P.y+P.h>so.b;if(!inside)so.dead=false}
    var tk=so.dead?0:1;L.k+=(tk-L.k)*Math.min(1,dt*10+(dt?0:1));
    L.mat.opacity=.12+.78*L.k*(blink?.5:1);L.mat.emissiveIntensity=.1+.6*L.k;L.ed.material.opacity=.25+.35*L.k});
}
function twCycle(G){var q=G.q,on=q.on||0,off=q.off||0;if(!on||!off)return {lit:1,u:0};var T0=on+off,t=((G.t%T0)+T0)%T0;
  if(t<on)return {lit:1,u:0};return {lit:0,u:(t-on)/off}}
function twPlace(G,dt){var q=G.q,R=G.R;
  G.t+=dt;var c=twCycle(G),tgt=c.lit;
  if(G.dark>0){if(G.mothE&&(!G.mothE.alive||G.mothE.slp>0)){G.dark=0;G.mothE=null}else{G.dark-=dt;tgt=0;c={lit:0,u:.5}}}/* mariposa apagou a luz */G.lit+=(tgt-G.lit)*Math.min(1,dt*(tgt?4:1.6));
  G.v=(q.w||.5)*G.lit;G.a+=G.v*dt;G.wheel.rotation.z=G.a;
  G.gm.emissiveIntensity=.07*G.lit;G.hg.material.opacity=.35*G.lit;
  /* vaga-lume: com luz fica rodando no eixo; sem luz sai voando em volta da roda e volta */
  var fx,fy;if(c.lit){var s=tm*3+G.q.x;fx=q.x+Math.cos(s)*.55;fy=q.y+Math.sin(s*1.3)*.4}
  else{var u=c.u,ang=u*6.283+(q.w>0?0:Math.PI),rr=R+1.6+Math.sin(u*3.14)*1.4,k=Math.sin(u*3.14);fx=q.x+Math.cos(ang)*rr*k+Math.cos(tm*3)*.5*(1-k);fy=q.y+Math.sin(ang)*rr*k+.6*k}
  G.fly.position.set(fx,fy,.6);var tw=.75+.25*Math.sin(tm*14+q.x);G.fly.scale.set(.9*tw,.9*tw,1);
  for(var i=0;i<G.n;i++){var p=G.pl[i],a=G.a+i/G.n*6.283,nx=q.x+Math.cos(a)*R,ny=q.y+Math.sin(a)*R,so=p.so,dx=nx-p.x,dy=ny-p.y;
    var on=P.onPlat===so&&P.grounded&&dt>0,ot=so.t,ob=so.b;
    p.x=nx;p.y=ny;so.l=nx-.9;so.r=nx+.9;so.t=ny+.15;so.b=ny-.15;
    if(on){P.x+=dx;P.y=so.t}
    else if(dt>0&&(state==='play'||state==='intro')&&P.x+P.w/2>so.l+.01&&P.x-P.w/2<so.r-.01&&P.y<so.t-.01&&P.y+P.h>so.b+.01){
      /* a tábua se mexeu e encostou no Kuro: nunca deixa ele ficar dentro */
      if(P.y>=ot-.35&&P.vy<=1){P.y=so.t;P.vy=Math.max(P.vy,0);P.grounded=true;P.onPlat=so}/* estava em cima: sobe junto */
      else if(P.y+P.h<=ob+.3&&!P.grounded){P.y=so.b-P.h;P.vy=Math.min(P.vy,0)}/* estava embaixo, no ar: bate a cabeça */
      else{P.x=P.x<nx?so.l-P.w/2-.03:so.r+P.w/2+.03;P.vx=0}/* de lado (ou a tábua desceu em cima dele no chão): empurra para fora */}
    p.g.position.set(nx,ny,0);
    /* braço da tábua até o aro */
    var ax=q.x+Math.cos(a)*R*.86-nx,ay=q.y+Math.sin(a)*R*.86-ny;p.arm.position.set(ax/2,ay/2+.05,-.6);p.arm.scale.y=Math.max(.05,Math.hypot(ax,ay));p.arm.rotation.z=Math.atan2(ay,ax)-Math.PI/2}
}
/* ---------- cenário de dentro da torre ---------- */
function buildDecorTower(th){twMats();var r=rnd(1414),lite=LITE,top=LV.towerTop||((LV.bell&&LV.bell.y+8)||40),i,k;
  twFx={fl:null,bg:[],pend:[],bell:null,ring:0,cpRef:null,fallN:0};
  /* parede do fundo de pedra com janelas em arco, e colunas de madeira */
  var WZ=-3.4,rows=Math.ceil((top+6)/8),GW=[],GD=[];/* tudo junto em 2 malhas (leve no celular) */
  for(i=0;i<rows;i++){var y0=-2+i*8;
    if(i===0){GW.push(xf(boxGeo(32,8,.6,4),[12,y0+4,WZ]));continue}
    /* faixa com duas janelas: pedaços de parede em volta */
    [[-4,3.5],[7.5,16.5],[20.5,28]].forEach(function(p){GW.push(xf(boxGeo(p[1]-p[0],8,.6,2),[(p[0]+p[1])/2,y0+4,WZ]))});
    [[3.5,7.5],[16.5,20.5]].forEach(function(p){var cx=(p[0]+p[1])/2;
      GW.push(xf(boxGeo(4,2,.6,1),[cx,y0+1,WZ]));GW.push(xf(boxGeo(4,1.4,.6,1),[cx,y0+7.3,WZ]));
      GD.push(xf(new T.TorusGeometry(2,.22,6,14,Math.PI),[cx,y0+5.4,WZ+.35]));GD.push(xf(new T.BoxGeometry(4.4,.25,.9),[cx,y0+2,WZ+.3]));GD.push(xf(new T.BoxGeometry(.12,4.6,.12),[cx,y0+4.3,WZ+.35]))})}
  for(i=0;i<2;i++)GD.push(xf(boxGeo(1.4,top+12,1.4,3),[i?24.3:-.3,(top+12)/2-3,-1.2]));
  add(mesh(mgL(GW),twM.wall,false,true));add(mesh(mgL(GD),twM.wallD,true,true));
  /* engrenagens grandes do mecanismo, no fundo, girando devagar */
  var nb=lite?4:8;for(i=0;i<nb;i++){var R=2.2+r()*2.6,bw=mesh(twGearGeo(R),twM.bronzeD,false,false);
    bw.position.set(r()<.5?2+r()*5:17+r()*5,4+i*(top/nb)+r()*3,-2.9);add(bw);twFx.bg.push({m:bw,w:(r()<.5?-1:1)*(.08+r()*.12)})}
  /* pêndulos do relógio no fundo */
  for(i=0;i<(lite?1:2);i++){var pg=new T.Group();pg.position.set(i?18:6,top*.55+i*9,-2.6);add(pg);
    var rod=mesh(new T.BoxGeometry(.12,7,.12),twM.bronzeD,false,false);rod.position.y=-3.5;pg.add(rod);
    var bob=mesh(new T.CylinderGeometry(.9,.9,.25,20),twM.bronze,false,false);bob.rotation.x=Math.PI/2;bob.position.y=-7;pg.add(bob);twFx.pend.push({g:pg,ph:i*1.7})}
  /* pântano na frente: água escura, vitórias-régias e juncos */
  var wm=new T.MeshStandardMaterial({color:0x14302a,roughness:.15,metalness:.2,transparent:true,opacity:.92});
  var wa=mesh(new T.PlaneGeometry(60,16),wm,false,true);wa.rotation.x=-Math.PI/2;wa.position.set(12,-.35,8);add(wa);
  var GL=[],GR=[];for(i=0;i<(lite?6:14);i++)GL.push(xf(new T.CylinderGeometry(.35+r()*.35,.35,.04,10,1,false,.3,5.9),[-6+r()*36,-.3,3+r()*7]));
  for(i=0;i<(lite?10:26);i++)GR.push(xf(new T.CylinderGeometry(.03,.05,1.2+r()*1.4,4),[-8+r()*40,.3,2.4+r()*6],[0,0,(r()-.5)*.3]));
  add(mesh(mgL(GL),M(0x3a8a3a,.8),false,false));add(mesh(mgL(GR),M(0x4a6a2a,.9),false,false));
  /* vaga-lumes soltos pela torre (pontinhos piscando) */
  var n=lite?40:110,pos=new Float32Array(n*3),ph=new Float32Array(n);for(i=0;i<n;i++){pos[i*3]=r()*24;pos[i*3+1]=r()*top;pos[i*3+2]=-2.5+r()*4.5;ph[i]=r()*6.283}
  var fg=new T.BufferGeometry();fg.setAttribute('position',new T.BufferAttribute(pos,3));
  var fm=new T.PointsMaterial({color:0xffe070,size:lite?.22:.18,map:softSprite(),transparent:true,depthWrite:false,blending:T.AdditiveBlending,fog:false});
  twFx.fl={p:new T.Points(fg,fm),pos:pos,ph:ph,n:n,b:pos.slice()};add(twFx.fl.p);
  /* o sino (fim da fase) */
  if(LV.bell){var B=LV.bell,bg=new T.Group();bg.position.set(B.x,B.y,-.4);add(bg);
    var fr=mesh(new T.BoxGeometry(3.4,.3,.5),twM.beam,true,false);fr.position.y=3.6;bg.add(fr);
    [-1.5,1.5].forEach(function(x){var pst=mesh(new T.BoxGeometry(.3,3.6,.4),twM.beam,true,false);pst.position.set(x,1.8,0);bg.add(pst)});
    var bp=new T.Group();bp.position.y=3.4;bg.add(bp);
    var pts=[];for(k=16;k>=0;k--){var u=k/16;pts.push(new T.Vector2(.32+Math.pow(u,2.2)*.8+Math.max(0,u-.88)*1.2,-u*1.5))}pts.push(new T.Vector2(0,0));
    var bl=mesh(new T.LatheGeometry(pts,24),twM.gold,true,false);bp.add(bl);var lip=mesh(new T.TorusGeometry(1.16,.07,6,24),twM.gold,false,false);lip.rotation.x=Math.PI/2;lip.position.y=-1.5;bp.add(lip);
    var cl=mesh(new T.SphereGeometry(.18,8,6),twM.bronzeD,false,false);cl.position.y=-1.55;bp.add(cl);
    var bgl=new T.Sprite(twM.glow.clone());bgl.scale.set(2,2,1);bgl.position.set(0,-.9,.4);bgl.material.opacity=.1;bp.add(bgl);
    twFx.bell={g:bp,gl:bgl}}
  if(LV.outside)twOutDecor(r,lite);
}
function buildFarTower(th,r){/* noite (vista pelas janelas): lua, estrelas e árvores do pântano; dia (lá fora): sol, nuvens e morros. Os dois trocam devagar quando o Kuro sai da torre */
  var NI=[],DA=[];function reg(L,m){m.transparent=true;m.userData.o0=m.opacity;L.push(m);return m}
  var mc=document.createElement('canvas');mc.width=mc.height=128;var x=mc.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,250,225,1)');g.addColorStop(.32,'rgba(240,240,210,1)');g.addColorStop(.36,'rgba(180,200,255,.35)');g.addColorStop(1,'rgba(120,150,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);
  var moon=new T.Sprite(reg(NI,new T.SpriteMaterial({map:new T.CanvasTexture(mc),transparent:true,depthWrite:false,fog:false})));moon.scale.set(40,40,1);moon.position.set(30,40,-150);farG.add(moon);
  var n=260,pos=new Float32Array(n*3);for(var i=0;i<n;i++){pos[i*3]=-150+r()*300;pos[i*3+1]=-10+r()*160;pos[i*3+2]=-160}
  var sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(pos,3));farG.add(new T.Points(sg,reg(NI,new T.PointsMaterial({color:0xffffff,size:.7,transparent:true,opacity:.8,fog:false}))));
  var tm2=reg(NI,new T.MeshBasicMaterial({color:0x0a1420,fog:false}));for(i=0;i<16;i++){var h=14+r()*18,t=new T.Mesh(new T.ConeGeometry(4+r()*3,h,6),tm2);t.position.set(-120+i*16+r()*6,-14+h/2,-130);farG.add(t)}
  /* dia */
  var sc=document.createElement('canvas');sc.width=sc.height=128;var sx=sc.getContext('2d'),sgr=sx.createRadialGradient(64,64,0,64,64,64);
  sgr.addColorStop(0,'rgba(255,255,240,1)');sgr.addColorStop(.18,'rgba(255,248,210,1)');sgr.addColorStop(.4,'rgba(255,220,150,.45)');sgr.addColorStop(1,'rgba(255,200,120,0)');sx.fillStyle=sgr;sx.fillRect(0,0,128,128);
  var su=new T.Sprite(reg(DA,new T.SpriteMaterial({map:new T.CanvasTexture(sc),transparent:true,depthWrite:false,fog:false,blending:T.AdditiveBlending})));su.scale.set(70,70,1);su.position.set(70,38,-150);farG.add(su);
  for(i=0;i<9;i++){var cs=new T.Sprite(reg(DA,new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,opacity:.85,depthWrite:false,fog:false})));var sz=40+r()*50;cs.scale.set(sz,sz*.3,1);cs.position.set(-180+i*48+r()*20,20+r()*30,-145);farG.add(cs)}
  var hm=[0x6a9a5a,0x7aae62,0x5a8a56];for(i=0;i<12;i++){var hl=new T.Mesh(new T.SphereGeometry(1,16,10,0,6.283,0,1.6),reg(DA,new T.MeshBasicMaterial({color:hm[i%3],fog:false,opacity:1})));var rr=30+r()*30;hl.scale.set(rr,10+r()*14,8);hl.position.set(-200+i*40+r()*20,-16,-128-r()*8);farG.add(hl)}
  twFar={night:NI,day:DA};DA.forEach(function(m){m.opacity=0})
}
var twFar=null;
function updTower(dt){
  twG.forEach(function(G){twPlace(G,dt)});twLight(dt);updLevers(dt);twOutUpd(dt);
  /* lá fora (depois da porta do alto da torre): a câmera segue o Kuro para a direita e o dia chega */
  if(LV.outside){var O=LV.outside,top=P.y>O.y-1.5,out=P.x>O.x;LV.camMax=(out||(top&&P.x>O.x-8))?O.camMax:15;LV.xMax=(out||top)?O.xMax:23.6;LV.fall=out?{x:O.x,x2:9999,y:O.y-3}:null;
    var kd=(out||top)?clamp((P.x-(O.x-6))/10,0,1):0;if(kd>0||(twFx&&twFx.dk>0))twDay(kd)}
  /* andar escuro: a luz da torre diminui (LV.dark=[y0,y1]) */
  if(LV.dark&&twFx){if(twFx.hi===undefined){twFx.hi=hemi.intensity;twFx.fog0=scene.fog.color.clone()}var cy=cam.y,d0=LV.dark[0],d1=LV.dark[1],k=clamp(Math.min((cy-d0+3)/5,(d1+3-cy)/5),0,1);
    hemi.intensity=twFx.hi*(1-.5*k);scene.fog.color.copy(twFx.fog0).multiplyScalar(1-.45*k)}
  if(twFx){twFx.bg.forEach(function(b){b.m.rotation.z+=b.w*dt});if(twFx.mills)twFx.mills.forEach(function(h,i){h.rotation.z+=dt*(1.2+i*.3)});twFx.pend.forEach(function(p){p.g.rotation.z=Math.sin(tm*1.2+p.ph)*.35});
    var F=twFx.fl;twFx.par=!twFx.par;if(F&&!LITE&&twFx.par){for(var i=0;i<F.n;i+=2){F.pos[i*3]=F.b[i*3]+Math.sin(tm*.6+F.ph[i])*.6;F.pos[i*3+1]=F.b[i*3+1]+Math.sin(tm*.8+F.ph[i]*2)*.5}F.p.geometry.attributes.position.needsUpdate=true}
    if(F)F.p.material.opacity=.6+.4*Math.sin(tm*2.3);
    /* o sino: tocar no sino termina a fase */
    var B=LV.bell;if(B&&twFx.bell){var bb=twFx.bell;
      if(twFx.ring>0){twFx.ring+=dt;bb.g.rotation.z=Math.sin(twFx.ring*9)*.45*Math.max(0,1-twFx.ring/2.2);bb.gl.material.opacity=.1+.6*Math.max(0,1-twFx.ring/2);
        if(twFx.ring>1.6&&state==='play'){twFx.ring=-1;if(levelIdx===TOTAL_W-1)winGame();else winLevel()}}
      else if(twFx.ring===0&&state==='play'&&Math.abs(P.x-B.x)<1.6&&P.y>B.y-.3&&P.y<B.y+3.6){twFx.ring=.001;try{beep(784,.9,'sine',.18,1.2);beep(1175,1.2,'triangle',.08,1)}catch(e){}emit(sparkPool,B.x,B.y+2.4,30,4,1,.4,.4,4);
        twG.forEach(function(G){G.q.on=0});toast('Dooong! A torre acordou!')}}}
  /* quedas (regra do dono, igual ao Mundo 13): 3 voltas por bandeirinha; na 4ª cai de verdade; queda nunca tira coração */
  if(!twFx)return;
  if(twFx.cpRef!==respawn){twFx.cpRef=respawn;twFx.fallN=0}
  if(state==='play'&&respawn&&P.x<24.5&&P.y<respawn.y-7&&P.vy<0&&twFx.fallN<4){twFx.fallN++;
    if(twFx.fallN<=3){emit(sparkPool,P.x,P.y+.6,10,2.5,.5,.3,.2,2);spawn(respawn);P.inv=1;var ch=3-twFx.fallN;toast(ch>0?'Caiu! Volta para a bandeirinha — chances: '+ch:'Última volta! A próxima queda é de verdade')}
    else toast('Sem chances! O Kuro cai até achar onde pisar')}
  if(twFx.fallN>=4&&P.grounded&&Math.abs(P.x-respawn.x)<2.5&&Math.abs(P.y-respawn.y)<1.2){twFx.fallN=0;toast('Chances de volta: 3');sfx.check()}
}
/* ---------- alavancas (4º andar): pular em cima vira as rodas do andar para o outro lado ---------- */
var twLv=[];
function buildLevers(){twLv=[];(LV.levers||[]).forEach(function(q){var g=new T.Group();g.position.set(q.x,q.y,-.1);add(g);
  var base=mesh(new T.BoxGeometry(.8,.3,.6),twM.bronzeD,true,false);base.position.y=.15;g.add(base);
  var pv=new T.Group();pv.position.y=.3;g.add(pv);
  var st=mesh(new T.CylinderGeometry(.06,.07,1.1,8),twM.bronze,true,false);st.position.y=.55;pv.add(st);
  var kn=mesh(new T.SphereGeometry(.17,12,8),M(0xd8402a,.4,.1),true,false);kn.position.y=1.1;pv.add(kn);
  twLv.push({q:q,pv:pv,s:1,a:.55,cd:0})})}
function updLevers(dt){twLv.forEach(function(L){var q=L.q;if(L.cd>0)L.cd-=dt;
  L.a+=(L.s*.55-L.a)*Math.min(1,dt*12);L.pv.rotation.z=-L.a;
  if(state==='play'&&L.cd<=0&&Math.abs(P.x-q.x)<.65&&P.y>q.y+.2&&P.y<q.y+1.5&&P.vy<-.5){
    L.s=-L.s;L.cd=.7;P.vy=8.5;P.grounded=false;P.onPlat=null;
    (q.g||[]).forEach(function(i){var G=twG[i];if(G)G.q.w=-G.q.w});
    try{beep(330,.12,'square',.05);beep(220,.18,'square',.05,0,.08)}catch(e){}emit(sparkPool,q.x,q.y+1.2,10,2.5,.5,.3,.2,2);
    if(!twFx.lvTold){twFx.lvTold=true;toast('Alavanca! As rodas deste andar viraram para o outro lado')}}})}
/* ---------- mariposas: voam de roda em roda e apagam a luz da roda onde pousam ---------- */
var mothTex=null;
function makeMoth(){
  if(!mothTex){var c=document.createElement('canvas');c.width=128;c.height=96;var x=c.getContext('2d');
    var g=x.createLinearGradient(0,0,128,0);g.addColorStop(0,'#a8916a');g.addColorStop(1,'#7a6444');x.fillStyle=g;
    x.beginPath();x.moveTo(0,48);x.quadraticCurveTo(30,0,128,8);x.quadraticCurveTo(110,60,128,92);x.quadraticCurveTo(40,96,0,48);x.fill();
    x.strokeStyle='rgba(90,70,40,.6)';x.lineWidth=3;for(var i=0;i<4;i++){x.beginPath();x.moveTo(4,48);x.lineTo(124,12+i*24);x.stroke()}
    x.fillStyle='#5a3a20';x.beginPath();x.arc(80,46,15,0,6.3);x.fill();x.fillStyle='#f0e0b0';x.beginPath();x.arc(80,46,8,0,6.3);x.fill();x.fillStyle='#2a1a10';x.beginPath();x.arc(80,46,4,0,6.3);x.fill();
    mothTex=new T.CanvasTexture(c);mothTex.encoding=T.sRGBEncoding}
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var fur=M(0xd8c8a4,.95),dk=M(0x3a2a1a,.6);
  var body=mesh(new T.SphereGeometry(.17,12,8),fur,true,false);body.scale.set(.9,.9,1.7);inner.add(body);
  var head=mesh(new T.SphereGeometry(.13,10,8),fur,false,false);head.position.set(0,.04,.3);inner.add(head);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.045,8,6),M(0xd83a2a,.3,0,{emissive:new T.Color(0x801010),emissiveIntensity:.6}),false,false);ey.position.set(sd*.08,.08,.4);inner.add(ey);
    var an=mesh(new T.CylinderGeometry(.012,.012,.35,4),dk,false,false);an.position.set(sd*.07,.24,.42);an.rotation.set(.7,0,sd*.4);inner.add(an)});
  var wm=new T.MeshStandardMaterial({map:mothTex,side:T.DoubleSide,transparent:true,alphaTest:.3,roughness:.9}),wings=[];
  [-1,1].forEach(function(sd){[[.75,.55,.06],[.55,.42,-.18]].forEach(function(w){var pv=new T.Group();pv.position.set(0,.05,w[2]);inner.add(pv);
    var pl=new T.Mesh(new T.PlaneGeometry(w[0],w[1]),wm);pl.rotation.x=-Math.PI/2;pl.position.x=sd*w[0]/2;if(sd<0)pl.scale.x=-1;pv.add(pl);wings.push({p:pv,sd:sd})})});
  g.scale.setScalar(1.25);add(g);return {g:g,inner:inner,wings:wings}}
function mothAI(e,dt){var R=e.route;if(!R||!R.length||!twG.length)return;
  var G=twG[R[e.ri%R.length]];if(!G)return;var tx=G.q.x,ty=G.q.y-.3;
  if(e.sit>0){e.sit-=dt;G.dark=Math.max(G.dark||0,1.4);G.mothE=e;e.x+=(tx-e.x)*Math.min(1,dt*4);e.y=ty+Math.sin(tm*3+e.ph)*.08;if(e.sit<=0){e.ri=(e.ri+1)%R.length}return}
  var dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy);
  if(d<.3){e.sit=2.2;G.dark=3.5;G.mothE=e;emit(dustPool,tx,ty+.3,8,1.6,.5,.5,1.2,-.2);try{noise(.25,.04,600,'lowpass')}catch(er){}if(!twFx.mTold){twFx.mTold=true;toast('Mariposa! Ela apaga a luz das rodas. Pule nela para a luz voltar')}return}
  var sp=e.speed||1.5;e.x+=dx/d*sp*dt;e.y+=dy/d*sp*dt+Math.sin(tm*4+e.ph)*.6*dt;if(Math.abs(dx)>.05)e.dir=dx>0?1:-1}
function mothVis(e,dt){var v=e.vis;/* de frente para a câmera (asas abertas aparecem bem), só vira um pouco para o lado em que voa */v.g.rotation.y+=((e.dir>0?.55:-.55)-v.g.rotation.y)*Math.min(1,dt*6);v.g.rotation.x=.35;var f=e.sit>0?.35+Math.sin(tm*5+e.ph)*.25:.3+Math.sin(tm*11+e.ph)*.75;v.wings.forEach(function(w){w.p.rotation.z=-w.sd*f})}
/* =================== lá fora (andares 5 e 6): o Pântano ao Sol e a Colina do Relógio =================== */
var twOut={pads:[],logs:[],brs:[],rocks:[],spw:[]};
function twTerra(x0,x1,top){var w=x1-x0,cx=(x0+x1)/2;
  var dm=twM.dirt||(twM.dirt=pbr(texDirt,.97,1.4,{color:new T.Color(0xa88a68)}));
  var b=mesh(boxGeo(w,4.2,3.4,2),dm,true,true);b.position.set(cx,top-2.1-.25,-.5);add(b);
  var g=mesh(boxGeo(w+.3,.5,3.6,2),grassM,true,true);g.position.set(cx,top-.25,-.5);add(g)}
function twDeck(x0,x1,top){var w=x1-x0,cx=(x0+x1)/2,G=[];
  for(var x=x0+.2;x<x1;x+=.45)G.push(xf(new T.BoxGeometry(.42,.14,1.8),[x+.02,top-.07,-.3],[0,(Math.sin(x*7)*.04),0]));
  for(x=x0+.4;x<x1;x+=2.2){G.push(xf(new T.CylinderGeometry(.11,.13,2.4,6),[x,top-1.25,.5]));G.push(xf(new T.CylinderGeometry(.11,.13,2.4,6),[x,top-1.25,-1.1]))}
  add(mesh(mgL(G),twM.plank,true,true))}
function buildOutside(){twOut={pads:[],logs:[],brs:[],rocks:[],spw:[]};if(!LV.outside)return;
  var padM=M(0x4fa83a,.7,0,{side:T.DoubleSide}),flM=M(0xff8ac8,.6),logM=pbr(texWood,.9,1.2,{color:new T.Color(0x9a7450)});
  (LV.pads||[]).forEach(function(q){var g=new T.Group();add(g);var pd=mesh(new T.CylinderGeometry(q[1]/2,q[1]/2,.14,20,1,false,.25,5.9),padM,true,true);pd.position.y=-.07;g.add(pd);
    var fl=mesh(new T.SphereGeometry(.22,8,6),flM,false,false);fl.position.set(q[1]*.25,.12,.2);fl.scale.y=.7;g.add(fl);
    var so={l:q[0]-q[1]/2,r:q[0]+q[1]/2,t:q[2],b:q[2]-.3,oneway:false};solids.push(so);twOut.pads.push({q:q,g:g,so:so,y:q[2],gone:0})});
  (LV.logs||[]).forEach(function(q){var g=new T.Group();add(g);var lg=mesh(new T.CylinderGeometry(.55,.55,q[3],14),logM,true,true);lg.rotation.z=Math.PI/2;g.add(lg);
    [-1,1].forEach(function(sd){var ring=mesh(new T.CircleGeometry(.5,14),M(0xd8b88a,.9),false,false);ring.position.x=sd*q[3]/2+sd*.01;ring.rotation.y=sd*Math.PI/2;g.add(ring)});
    var so={l:0,r:0,t:q[2],b:q[2]-.5,oneway:false};solids.push(so);twOut.logs.push({q:q,g:g,lg:lg,so:so,x:(q[0]+q[1])/2,ph:q[5]||0})});
  (LV.bridges||[]).forEach(function(q){var n=Math.round((q[1]-q[0])/.8),segs=[],w=(q[1]-q[0])/n;
    for(var i=0;i<n;i++){var pk=mesh(new T.BoxGeometry(w-.06,.14,1.5),twM.plank,true,true);add(pk);var so={l:q[0]+i*w,r:q[0]+(i+1)*w,t:q[2],b:q[2]-.3,oneway:false};solids.push(so);segs.push({m:pk,so:so,u:(i+.5)/n})}
    var rp=[];[-.75,.75].forEach(function(z){var ln=new T.Line(new T.BufferGeometry().setFromPoints(segs.map(function(){return new T.Vector3()})),new T.LineBasicMaterial({color:0x6a5030}));add(ln);rp.push({l:ln,z:z})});
    twOut.brs.push({q:q,segs:segs,rp:rp,dip:0})});
  var rkM=pbr(texStone,.9,.6,{color:new T.Color(0x9a8e80)});twOut.rkGeo=new T.DodecahedronGeometry(.55,1);twOut.rkM=rkM;
  (LV.rocks||[]).forEach(function(q){twOut.spw.push({q:q,t:q.ph||0})});
  twOutUpd(0)}
function twGroundAt(x,y){var best=null;for(var i=0;i<solids.length;i++){var s=solids[i];if(s.dead||s.hid||s.twr||s.light)continue;if(x>=s.l&&x<=s.r&&s.t<=y+.25&&(best===null||s.t>best))best=s.t}return best}
function twOutUpd(dt){var i;
  /* vitórias-régias: afundam com o Kuro em cima; se afundar demais, somem e voltam depois */
  twOut.pads.forEach(function(p){var so=p.so,on=P.onPlat===so&&P.grounded;
    if(p.gone>0){p.gone-=dt;if(p.gone<=0){so.dead=false;p.y=p.q[2]-.6}}
    else if(on){p.y-=dt*.45;if(p.y<p.q[2]-.75){so.dead=true;p.gone=2.2;P.grounded=false;P.onPlat=null;emit(dustPool,p.q[0],p.q[2],8,2,.5,.6,1.2,-.2)}}
    else p.y=Math.min(p.q[2],p.y+dt*.5);
    var dy=p.y-so.t;so.t=p.y;so.b=p.y-.3;if(on&&!so.dead)P.y=so.t;
    p.g.position.set(p.q[0],p.y,-.2);p.g.visible=!so.dead;p.g.rotation.z=on?Math.sin(tm*6)*.03:0});
  /* troncos boiando: vão e voltam rolando e levam o Kuro */
  twOut.logs.forEach(function(L){L.t=(L.t||0)+dt;var q=L.q,nx=(q[0]+q[1])/2+(q[1]-q[0])/2*Math.sin(L.t*(q[4]||.8)+L.ph),/* relógio próprio (não depende do quadro desenhado) */dx=nx-L.x,so=L.so,on=P.onPlat===so&&P.grounded;
    L.x=nx;so.l=nx-q[3]/2;so.r=nx+q[3]/2;if(on&&dt>0)P.x+=dx;
    L.g.position.set(nx,q[2]-.5+Math.sin(tm*2+L.ph)*.04,-.2);L.lg.rotation.x-=dx/.55});
  /* pontes de corda: afundam no meio e mais ainda onde o Kuro pisa, balançando de leve */
  twOut.brs.forEach(function(B){var q=B.q,on=B.segs.some(function(s){return P.onPlat===s.so&&P.grounded}),pu=on?clamp((P.x-q[0])/(q[1]-q[0]),0,1):.5;B.dip+=((on?.45:0)-B.dip)*Math.min(1,dt*4);
    var y1=q[4]!==undefined?q[4]:q[2];
    B.segs.forEach(function(sg){var u=sg.u,base=q[2]+(y1-q[2])*u-(q[3]||.6)*Math.sin(Math.PI*u)-B.dip*Math.max(0,1-Math.abs(u-pu)*2.2)*Math.sin(Math.PI*u)+Math.sin(tm*1.6+u*3)*.04;
      var so=sg.so,mine=P.onPlat===so&&P.grounded;so.t=base;so.b=base-.3;if(mine)P.y=base;sg.m.position.set((so.l+so.r)/2,base-.07,0)});
    B.rp.forEach(function(r){var pa=r.l.geometry.attributes.position;B.segs.forEach(function(sg,k){pa.setXYZ(k,(sg.so.l+sg.so.r)/2,sg.so.t+.75,r.z)});pa.needsUpdate=true})});
  /* pedras rolando morro abaixo */
  twOut.spw.forEach(function(S){S.t+=dt;if(S.t>=(S.q.every||4.5)&&state==='play'&&Math.abs(P.x-S.q.x)<40){S.t=0;var m=mesh(twOut.rkGeo,twOut.rkM,true,false);add(m);twOut.rocks.push({x:S.q.x,y:S.q.y,vy:0,m:m,sp:S.q.sp||3.4})}});
  for(i=twOut.rocks.length-1;i>=0;i--){var r=twOut.rocks[i],gt=twGroundAt(r.x,r.y);
    r.x-=r.sp*dt;if(gt!==null&&r.y<=gt+.02&&r.vy<=0){r.y=gt;r.vy=0}else{r.vy-=28*dt;r.y+=r.vy*dt;var g2=twGroundAt(r.x,r.y-r.vy*dt);if(g2!==null&&r.y<g2&&r.y-r.vy*dt>=g2-.3){r.y=g2;r.vy=0;shake=Math.max(shake,.05)}}
    r.m.position.set(r.x,r.y+.5,0);r.m.rotation.z+=r.sp*dt/.55;
    if(state==='play'&&Math.abs(P.x-r.x)<.45+P.w/2&&P.y<r.y+1&&P.y+P.h>r.y+.05)hurt(r.x,0);
    if(r.y<96){scene.remove(r.m);if(r.m.parent)r.m.parent.remove(r.m);twOut.rocks.splice(i,1)}}
}
/* a manhã chegando quando o Kuro sai da torre: céu, luz, névoa e brilho vão da noite para o dia */
var twDayP={sky:['#2f86e6','#78bdf2','#d8eefa','#f6e8c4'],fog:'#cfe4f0',fd:.0032,sun:0xfff2d8,si:2.3,hemi:[0xd8f0ff,0x6a7a3a,.5],exp:.86};
function twDay(k){if(!twFx)return;if(twFx.dk!==undefined&&Math.abs(k-twFx.dk)<.008)return;twFx.dk=k;var N=THEMES[13],D=twDayP,c1=new T.Color(),c2=new T.Color();
  function lc(a,b){c1.set(a);c2.set(b);return c1.lerp(c2,k).getStyle()}
  if(!twFx.skyC){twFx.skyC=document.createElement('canvas');twFx.skyC.width=4;twFx.skyC.height=256;twFx.skyT=new T.CanvasTexture(twFx.skyC);twFx.skyT.encoding=T.sRGBEncoding}
  var x=twFx.skyC.getContext('2d'),g=x.createLinearGradient(0,0,0,256);[0,.35,.62,1].forEach(function(st,i){g.addColorStop(st,lc(N.sky[i],D.sky[i]))});x.fillStyle=g;x.fillRect(0,0,4,256);twFx.skyT.needsUpdate=true;
  if(scene.background!==twFx.skyT){if(scene.background&&scene.background.dispose)scene.background.dispose();scene.background=twFx.skyT}
  scene.fog.color.set(lc(N.fog,D.fog));scene.fog.density=N.fd+(D.fd-N.fd)*k;
  sun.color.set(lc('#'+N.sun.toString(16).padStart(6,'0'),'#'+D.sun.toString(16).padStart(6,'0')));sun.intensity=(N.si+(D.si-N.si)*k)*(LITE?.8:1);
  hemi.color.set(lc('#'+N.hemi[0].toString(16).padStart(6,'0'),'#'+D.hemi[0].toString(16).padStart(6,'0')));hemi.groundColor.set(lc('#'+N.hemi[1].toString(16).padStart(6,'0'),'#'+D.hemi[1].toString(16).padStart(6,'0')));
  hemi.intensity=N.hemi[2]+(D.hemi[2]-N.hemi[2])*k+(LITE?.75:0);
  var ex=N.exp+(D.exp-N.exp)*k;if(gradePass)gradePass.uniforms.exposure.value=ex;renderer.toneMappingExposure=ex/.82*expU();
  scene.environment=ENVS[k>.5?0:N.env];
  if(twFar){twFar.night.forEach(function(m){m.opacity=m.userData.o0*(1-k)});twFar.day.forEach(function(m){m.opacity=m.userData.o0*k})}
  if(twFx.fl)twFx.fl.p.visible=k<.6}
function twOutDecor(r,lite){var O=LV.outside,Y=O.y,top=LV.towerTop||112,i,G=[],GW=[];
  /* parede de fora da torre, com a porta por onde o Kuro sai, e o telhado */
  var stM=pbr(texStone,.95,1,{color:new T.Color(0x8a8678)});
  GW.push(xf(boxGeo(2.2,Y+2,6.6,3),[25.7,(Y-2)/2,-.7]));GW.push(xf(boxGeo(2.2,top+2-(Y+4.2),6.6,2),[25.7,(top+2+Y+4.2)/2,-.7]));
  add(mesh(mgL(GW),stM,true,true));
  var arc=mesh(new T.TorusGeometry(1.15,.25,6,14,Math.PI),twM.wallD,false,false);arc.rotation.y=Math.PI/2;arc.position.set(26.85,Y+3.05,-.7);add(arc);
  var roof=mesh(new T.ConeGeometry(15.5,11,10),M(0x3a4a6a,.7,.1),true,false);roof.position.set(12,top+7.5,-1);add(roof);
  var band=mesh(new T.CylinderGeometry(15,15,1.2,10,1,true),stM,false,false);band.position.set(12,top+1.6,-1);add(band);
  /* água do pântano brilhando ao sol */
  var wm=new T.MeshStandardMaterial({color:0x3a8a84,roughness:.08,metalness:.35,transparent:true,opacity:.9});
  var wa=mesh(new T.PlaneGeometry(200,22),wm,false,true);wa.rotation.x=-Math.PI/2;wa.position.set(125,Y-.8,0);add(wa);twFx.wOut=wm;
  /* vitórias-régias, juncos e taboas */
  var GL=[],GR=[],GC=[];for(i=0;i<(lite?20:44);i++){var lx=27+r()*150;GL.push(xf(new T.CylinderGeometry(.35+r()*.5,.35,.04,10,1,false,.3,5.9),[lx,Y-.76,(r()<.5?1.5+r()*6:-2-r()*5)]))}
  for(i=0;i<(lite?24:60);i++){var rx=27+r()*160,rz=r()<.6?1.8+r()*5:-1.8-r()*4,h=1+r()*1.6;GR.push(xf(new T.CylinderGeometry(.03,.05,h,4),[rx,Y-.8+h/2,rz],[0,0,(r()-.5)*.3]));if(r()<.35)GC.push(xf(new T.CylinderGeometry(.09,.09,.45,6),[rx,Y-.8+h-.1,rz]))}
  add(mesh(mgL(GL),M(0x4ea03a,.7),false,false));add(mesh(mgL(GR),M(0x5a8a2a,.9),false,false));if(GC.length)add(mesh(mgL(GC),M(0x6a3a1a,.9),false,false));
  /* ciprestes do pântano ao fundo */
  var TT=[],TF=[];for(i=0;i<(lite?10:22);i++){var tx=28+i*8+r()*5,tz=-7-r()*9,th=6+r()*5;TT.push(xf(new T.CylinderGeometry(.25,.6,th,6),[tx,Y-1+th/2,tz]));TF.push(xf(new T.ConeGeometry(1.6+r()*.8,th*.75,7),[tx,Y-1+th*.75,tz]));TF.push(xf(new T.SphereGeometry(1.4+r()*.6,7,5),[tx+(r()-.5),Y-1+th*.45,tz]))}
  add(mesh(mgL(TT),twM.beam,false,false));add(mesh(mgL(TF),M(0x3f7a3a,.85),false,false));
  /* flores na colina */
  var FL=[[],[],[]],fc=[0xffd040,0xff7aa8,0xffffff];(LV.solids||[]).forEach(function(s){if(s[3]!=='terra'||s[0]<108)return;for(var k=0;k<(lite?3:8)*(s[1]-s[0])/8;k++){var c=(k%3);FL[c].push(xf(new T.SphereGeometry(.1,5,4),[s[0]+r()*(s[1]-s[0]),s[2]+.12,-1.8+r()*2.4]))}});
  FL.forEach(function(L,c){if(L.length)add(mesh(mgL(L),M(fc[c],.6),false,false))});
  /* cata-ventos de madeira girando na colina */
  twFx.mills=[];[[138,-4.5],[166,-5],[188,-6]].forEach(function(q){var gy=twGroundY(q[0])||Y;var g=new T.Group();g.position.set(q[0],gy,q[1]);add(g);
    var tw=mesh(new T.CylinderGeometry(.35,.6,5,6),twM.plank,true,false);tw.position.y=2.5;g.add(tw);var hb=new T.Group();hb.position.set(0,5,.5);g.add(hb);
    for(var b=0;b<4;b++){var bl=mesh(new T.BoxGeometry(.5,2.6,.06),M(0xf2ead8,.8),false,false);bl.geometry.translate(0,1.4,0);bl.rotation.z=b*Math.PI/2;hb.add(bl)}twFx.mills.push(hb)});
  /* torre pequena do sino no alto da colina */
  if(LV.bell){var B=LV.bell,bt=new T.Group();bt.position.set(B.x,B.y,-2.4);add(bt);
    var bb=mesh(boxGeo(5.5,8.5,2.4,2),stM,true,true);bb.position.y=2.6;bt.add(bb);
    var rf=mesh(new T.ConeGeometry(4,3.6,4),M(0xb04a3a,.7),true,false);rf.rotation.y=Math.PI/4;rf.position.y=8.6;bt.add(rf)}
}
function twGroundY(x){var b=null;(LV.solids||[]).forEach(function(s){if(x>=s[0]&&x<=s[1]&&(b===null||s[2]>b))b=s[2]});return b}
/* ---------- libélula: voa rápido em zigue-zague ---------- */
function makeDfly(){var g=new T.Group(),inner=new T.Group();g.add(inner);
  var bm=M(0x1aa8b0,.25,.6,{emissive:new T.Color(0x0a4a50),emissiveIntensity:.4}),wm=new T.MeshStandardMaterial({color:0xd8f4ff,transparent:true,opacity:.45,side:T.DoubleSide,roughness:.2,metalness:.1,depthWrite:false});
  var th=mesh(new T.SphereGeometry(.16,10,8),bm,true,false);th.scale.set(1,1,1.3);inner.add(th);
  var tl=mesh(new T.CylinderGeometry(.05,.08,1.1,8),bm,true,false);tl.rotation.x=Math.PI/2;tl.position.z=-.68;inner.add(tl);
  var hd=mesh(new T.SphereGeometry(.13,10,8),bm,false,false);hd.position.z=.24;inner.add(hd);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.09,8,6),M(0x6a1a6a,.2,.3),false,false);ey.position.set(sd*.09,.05,.3);inner.add(ey)});
  var wings=[];[[.06,1],[-.12,.85]].forEach(function(w){[-1,1].forEach(function(sd){var pv=new T.Group();pv.position.set(0,.12,w[0]);inner.add(pv);var pl=new T.Mesh(new T.PlaneGeometry(.9*w[1],.22),wm);pl.position.x=sd*.45*w[1];pl.rotation.x=-Math.PI/2+.35;pv.add(pl);wings.push({p:pv,sd:sd})})});
  g.scale.setScalar(1.2);add(g);return {g:g,inner:inner,wings:wings}}
function dflyAI(e,dt){e.ph+=dt;var sp=e.speed*1.6;e.x+=e.dir*sp*dt;if(e.x>e.x1){e.x=e.x1;e.dir=-1}else if(e.x<e.x0){e.x=e.x0;e.dir=1}
  var z=(e.ph*1.4)%2,tri=z<1?z:2-z;e.y=e.base-.9+tri*1.8}/* zigue-zague: sobe e desce em linha reta */
function dflyVis(e,dt){var v=e.vis;v.g.rotation.y=e.dir>0?Math.PI/2:-Math.PI/2;v.wings.forEach(function(w,i){w.p.rotation.z=w.sd*Math.sin(tm*55+i)*.5})}
/* ---------- robô de corda: anda na sua viga/chão; 1º pulo desliga a corda, 2º derrota ---------- */
function makeWrob(){var g=new T.Group(),inner=new T.Group();g.add(inner);
  var tin=M(0xc8ccd4,.3,.85),red=M(0xd83a2a,.45,.3),dk=M(0x3a3e48,.5,.6);
  var bd=mesh(new T.CylinderGeometry(.34,.38,.62,14),tin,true,false);bd.position.y=.62;inner.add(bd);
  var bl=mesh(new T.TorusGeometry(.36,.05,6,16),red,false,false);bl.rotation.x=Math.PI/2;bl.position.y=.62;inner.add(bl);
  var hd=mesh(new T.SphereGeometry(.28,12,8,0,6.283,0,1.6),tin,true,false);hd.position.y=.95;inner.add(hd);
  [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.07,8,6),M(0xfff0a0,.3,0,{emissive:new T.Color(0xffd040),emissiveIntensity:.8}),false,false);ey.position.set(sd*.12,1.02,.24);inner.add(ey)});
  var an=mesh(new T.CylinderGeometry(.02,.02,.3,4),dk,false,false);an.position.y=1.32;inner.add(an);var ab=mesh(new T.SphereGeometry(.06,6,5),red,false,false);ab.position.y=1.48;inner.add(ab);
  var legs=[];[-1,1].forEach(function(sd){var lg=mesh(new T.BoxGeometry(.13,.32,.18),dk,true,false);lg.geometry.translate(0,-.16,0);lg.position.set(sd*.16,.32,0);inner.add(lg);legs.push(lg)});
  var key=new T.Group();key.position.set(0,.66,-.42);inner.add(key);var ks=mesh(new T.CylinderGeometry(.04,.04,.2,6),dk,false,false);ks.rotation.x=Math.PI/2;key.add(ks);
  [-1,1].forEach(function(sd){var kw=mesh(new T.TorusGeometry(.12,.035,6,10),M(0xe8b440,.35,.75),false,false);kw.position.set(sd*.13,0,-.1);key.add(kw)});
  add(g);return {g:g,inner:inner,legs:legs,key:key}}
function wrobAI(e,dt){if(e.off>0){e.off-=dt;if(e.off<=0){e.safe=false;emit(sparkPool,e.x,e.y+1,6,2,.4,.3,.2,2)}return}
  var nx=e.x+e.dir*e.speed*dt;if(nx>e.x1){nx=e.x1;e.dir=-1}else if(nx<e.x0){nx=e.x0;e.dir=1}e.x=nx;e.ph+=dt*e.speed*5}
function wrobVis(e,dt){var v=e.vis,off=e.off>0;v.g.rotation.y=e.dir>0?Math.PI/2:-Math.PI/2;
  v.legs.forEach(function(l,i){l.rotation.x=off?0:Math.sin(e.ph+i*Math.PI)*.6});v.key.rotation.z+=off?0:dt*6;
  v.inner.position.x=off?Math.sin(tm*60)*.03:0;v.inner.rotation.z=off?-.12:Math.sin(e.ph*2)*.04}
