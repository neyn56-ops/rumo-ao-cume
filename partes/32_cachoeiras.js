/*@@parte:32_cachoeiras.js*/
/* ===================== Mundo 16: Vale das Cachoeiras =====================
   Meio-dia num vale cheio de água: paredões com cachoeiras atrás da fase, um rio lá embaixo (aparece nos buracos)
   e, bem longe, o castelo no alto do morro (só cenário, é para onde o Kuro vai).
   Bichos novos (todos originais):
   - Minhocão: mora debaixo da terra; pula de um buraco, faz um arco no ar e mergulha no outro buraco.
   - Enxame de abelhas: três abelhinhas voando juntas em zigue-zague; chegam perto do Kuro, mas não saem do seu pedaço.
   Obstáculo: o Pedrão-totem, pedra com cara de coruja pendurada num cipó; quando o Kuro passa embaixo ela despenca, depois sobe devagar
   (dá para subir em cima dela e pegar carona). */
var flM=null,flFx=null,flTot=[];
function flMats(){if(flM)return;
  var cv=document.createElement('canvas');cv.width=64;cv.height=64;var x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,64,64);
  for(var i=0;i<26;i++){x.strokeStyle='rgba(180,230,255,'+(.25+Math.random()*.4)+')';x.lineWidth=1+Math.random()*2;var yy=Math.random()*64;x.beginPath();x.moveTo(0,yy);x.bezierCurveTo(20,yy-3,44,yy+3,64,yy);x.stroke()}
  var rt=new T.CanvasTexture(cv);rt.wrapS=rt.wrapT=T.RepeatWrapping;rt.encoding=T.sRGBEncoding;
  flM={rock:pbr(texStone,.95,.9,{color:new T.Color(0xb0ab96)}),
    tot:pbr(texStone,.9,.35,{color:new T.Color(0x9a9a88)}),totL:M(0xd8d2b8,.8),dk:M(0x1e1a14,.5),
    beak:M(0xe0a840,.5),vine:M(0x3f7a2a,.85),
    river:new T.MeshStandardMaterial({color:0x36b4dc,map:rt,roughness:.25,metalness:0,transparent:true,opacity:.86,depthWrite:false}),
    pool:new T.MeshStandardMaterial({color:0x5ccbe8,roughness:.2,transparent:true,opacity:.8}),
    foam:new T.SpriteMaterial({map:softSprite(),color:0xf2faff,transparent:true,opacity:.55,depthWrite:false}),
    wm:new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:lushU.time},
      vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'uniform float time;varying vec2 vU;float h(vec2 p){return fract(sin(dot(p,vec2(12.9,78.2)))*43758.5);}void main(){float st=0.;for(int i=0;i<3;i++){float fi=float(i);float x=floor(vU.x*(8.+fi*6.));float sp=1.6+h(vec2(x,fi))*1.5;st+=smoothstep(.5,1.,fract(vU.y*(2.+fi)+time*sp+h(vec2(x,fi+3.))))*.45;}float edge=smoothstep(0.,.14,vU.x)*smoothstep(1.,.86,vU.x);vec3 c=mix(vec3(.32,.66,.9),vec3(.96,.99,1.),clamp(st,0.,1.));gl_FragColor=vec4(c,(.72+st*.28)*edge);}'})};
  flM.rt=rt}
/* ---------- cenário ---------- */
function buildFalls(th){flMats();flTot=[];var lite=LITE,r=rnd(1616),xe=sceneEnd(),i;
  flFx={foam:[],ry:LV.riverY!==undefined?LV.riverY:-2.4,py:0};
  /* o rio lá embaixo, correndo para a direita (aparece nos buracos entre as plataformas) */
  var rg=new T.PlaneGeometry(xe+60,14,1,1);rg.rotateX(-Math.PI/2);flM.rt.repeat.set((xe+60)/6,2.4);
  var rv=mesh(rg,flM.river,false,false);rv.position.set((xe-60)/2+30,flFx.ry,1.5);rv.renderOrder=2;add(rv);
  var bed=mesh(new T.PlaneGeometry(xe+60,14),M(0x4a8a8a,.95),false,false);bed.rotation.x=-Math.PI/2;bed.position.set((xe-60)/2+30,flFx.ry-1.2,1.5);add(bed);
  /* paredões de pedra (uma rocha só, ondulada) com grama em cima e a cachoeira na frente, atrás da fase */
  var RK=[],GR=[],WF=[];
  (LV.falls||[]).forEach(function(F){var cx=F.x,top=F.top||15,z=F.z||-11,base=mY(cx,z)-1,w=F.w||2.8,cw=F.cw||11,ch=top-base,cd=3.2;
    var g=new T.BoxGeometry(cw,ch,cd,lite?8:14,lite?8:14,2),pa=g.attributes.position,uv=g.attributes.uv,k;
    for(k=0;k<pa.count;k++){var vx=pa.getX(k),vy=pa.getY(k),vz=pa.getZ(k),ed=Math.abs(vx)/(cw/2),n=Math.sin(vy*.9+cx)*.35+Math.sin(vy*2.3+vx*.7)*.18;
      pa.setX(k,vx*(1-.1*Math.max(0,vy/ch+.5))+(ed>.95?n*.5:0));var ch2=Math.abs(vx)<w/2+.6;pa.setZ(k,vz+(vz>0?(ch2?-.45:n*.8)+(ed>.8?-(ed-.8)*3:0):0));/* canal liso onde a água desce: a pedra não passa na frente da água */uv.setXY(k,uv.getX(k)*cw/3.5,uv.getY(k)*ch/3.5)}
    g.computeVertexNormals();g.translate(0,ch/2,0);RK.push(xf(g,[cx,base,z-cd/2-.2],0,0));
    GR.push(xf(new T.SphereGeometry(1,14,5,0,6.283,0,1.25),[cx,top-.15,z-cd/2-.2],0,[cw*.52,.75,cd*.62]));
    var wg=new T.PlaneGeometry(w,ch,1,1);wg.translate(0,ch/2,0);WF.push({g:xf(wg,[cx,base,z+.3],0,0)});
    for(var k2=0;k2<(lite?3:6);k2++){var s=new T.Sprite(flM.foam);s.scale.set(2,1.5,1);add(s);flFx.foam.push({s:s,x:cx,y:mY(cx,z+1),z:z+.9,w:w,ph:k2/(lite?3:6)})}});
  if(RK.length)add(mesh(mgL(RK),flM.rock,false,true));if(GR.length)add(mesh(mgL(GR),mossM,false,true));
  if(WF.length){var wfm=new T.Mesh(mergeG(WF),flM.wm);wfm.renderOrder=3;add(wfm)}
  buildStreams();
  /* lá longe: morros com fiozinhos de cachoeira e o castelo no alto do morro */
  if(farG){var hm=new T.MeshStandardMaterial({color:0x5a9a4a,roughness:1,flatShading:true}),H=[],FW=[];
    [[-60,-120,34],[10,-130,40],[85,-118,30],[150,-128,44]].forEach(function(q,k){H.push(xf(new T.SphereGeometry(q[2],14,7,0,6.283,0,1.57),[q[0],-10,q[1]],0,[1.2,.55,.6]));
      var fg=new T.PlaneGeometry(1.6,q[2]*.5);fg.translate(0,q[2]*.25,0);FW.push({g:xf(fg,[q[0]+q[2]*.3*(k%2?1:-1),-10+q[2]*.05,q[1]+q[2]*.6*.6],0,0)})});
    farG.add(new T.Mesh(mergeG(H.map(function(g){return {g:g}})),hm));var fwm=new T.Mesh(mergeG(FW),flM.wm);farG.add(fwm);
    farCastle(hm)}
  buildTotems();buildLogs();buildWLogs();buildSinks();buildGate()}
/* ---------- Pedrão-totem ---------- */
function buildTotems(){(LV.totems||[]).forEach(function(d){var w=d.w||1.7,h=d.h||1.9,up=d.up||3.4,g=new T.Group(),inner=new T.Group();g.add(inner);
  var bd=mesh(boxGeo(w,h,1.5,1),flM.tot,true,true);bd.position.y=h/2;inner.add(bd);
  var ms=mesh(new T.SphereGeometry(1,12,5,0,6.283,0,1.3),mossM,false,false);ms.scale.set(w*.56,.3,.85);ms.position.y=h;inner.add(ms);
  /* cara de coruja entalhada: olhos redondos, bico, tufinhos — calma, não brava */
  [-1,1].forEach(function(sd){var ring=mesh(new T.TorusGeometry(.27,.07,6,16),flM.totL,false,false);ring.position.set(sd*w*.24,h*.62,.76);inner.add(ring);
    var ey=mesh(new T.CircleGeometry(.2,14),flM.dk,false,false);ey.position.set(sd*w*.24,h*.62,.761);inner.add(ey);
    var sh=mesh(new T.CircleGeometry(.06,8),flM.totL,false,false);sh.position.set(sd*w*.24+.06,h*.62+.07,.765);inner.add(sh);
    var tf=mesh(new T.ConeGeometry(.16,.5,4),flM.tot,false,false);tf.position.set(sd*w*.38,h+.12,0);tf.rotation.z=-sd*.35;inner.add(tf)});
  var bk=mesh(new T.ConeGeometry(.13,.36,4),flM.beak,false,false);bk.rotation.x=Math.PI;bk.position.set(0,h*.42,.8);inner.add(bk);
  for(var k=0;k<3;k++){var ln=mesh(new T.BoxGeometry(w*.7,.05,.04),flM.totL,false,false);ln.position.set(0,h*(.16+k*.07),.76);ln.scale.x=1-k*.2;inner.add(ln)}
  var vn=mesh(new T.CylinderGeometry(.07,.07,1,5),flM.vine,false,false);vn.position.y=h;g.add(vn);
  add(g);var y0=d.y+up,so={l:d.x-w/2,r:d.x+w/2,t:y0+h,b:y0,oneway:false,totem:1};solids.push(so);
  flTot.push({d:d,g:g,inner:inner,vn:vn,so:so,w:w,h:h,y0:y0,y:y0,vy:0,st:'up',t:0})})}
function totemSet(T0,y){var so=T0.so,on=P.onPlat===so&&P.grounded;T0.y=y;so.b=y;so.t=y+T0.h;if(on)P.y=so.t;
  T0.g.position.set(T0.d.x,y,-.05);var top=T0.d.vTop||(T0.y0+14);T0.vn.scale.y=Math.max(.1,top-(y+T0.h));T0.vn.position.y=T0.h+T0.vn.scale.y/2}
function totemUpd(T0,dt){var d=T0.d,so=T0.so,l=so.l,r=so.r;T0.t+=dt;T0.inner.position.x=0;
  if(T0.st==='up'){totemSet(T0,T0.y);if(T0.t>0&&state==='play'&&!P.warp&&P.x+P.w/2>l-1&&P.x-P.w/2<r+1&&P.y<T0.y-.2&&P.y>d.y-1.5){T0.st='shake';T0.t=0;try{noise(.25,.03,400,'lowpass')}catch(e){}}}
  else if(T0.st==='shake'){T0.inner.position.x=Math.sin(T0.t*70)*.06;if(T0.t>.38){T0.st='fall';T0.vy=0}}
  else if(T0.st==='fall'){T0.vy=Math.max(T0.vy-46*dt,-24);var ny=Math.max(d.y,T0.y+T0.vy*dt),ob=T0.y;
    /* esmagou? empurra o Kuro para o lado mais perto e machuca */
    if(state==='play'&&P.x+P.w/2>l+.04&&P.x-P.w/2<r-.04&&P.y<ob&&P.y+P.h>ny){var side=P.x<d.x?-1:1;hurt(d.x,1);P.x=side<0?l-P.w/2-.06:r+P.w/2+.06;P.vx=side*5;if(P.onPlat===so)P.onPlat=null}
    totemSet(T0,ny);
    if(ny<=d.y){T0.st='down';T0.t=0;emit(dustPool,d.x,d.y+.2,16,3.4,.7,.7,1.3,-.3);emit(dustPool,d.x,d.y+.2,10,2.2,.6,.5,1.1,-.2);
      if(Math.abs(P.x-d.x)<14)shake=Math.max(shake,.3);try{noise(.35,.07,260,'lowpass');beep(70,.25,'sine',.08,-30)}catch(e){}}}
  else if(T0.st==='down'){if(T0.t>1.1){T0.st='rise';T0.t=0}}
  else if(T0.st==='rise'){var ry=Math.min(T0.y0,T0.y+1.7*dt);totemSet(T0,ry);if(ry>=T0.y0){T0.st='up';T0.t=-.5}}
}
function fallsReset(){flTot.forEach(function(T0){T0.st='up';T0.t=0;T0.vy=0;totemSet(T0,T0.y0)});flSk.forEach(function(S){S.d=0})}
function updFalls(dt){if(!flFx)return;
  flM.rt.offset.x-=dt*.12;
  flFx.foam.forEach(function(o){var u=(tm*.45+o.ph)%1;o.s.position.set(o.x+(o.ph-.5)*o.w*1.1,o.y+.3+u*1.6,o.z);o.s.material.opacity=.5;o.s.scale.set(1.4+u*1.6,1+u,1)});
  flTot.forEach(function(T0){totemUpd(T0,dt)});logsUpd(dt);wlogsUpd(dt);kuroWetUpd(dt);flDropUpd(dt);streamsUpd(dt);sinksUpd(dt);seedUpd();
  if(LV.tTip&&!flFx.tTold&&state==='play'&&P.x>LV.tTip&&P.x<LV.tTip+3){flFx.tTold=1;toast('Pule de tartaruga em tartaruga! Segure o pulo para quicar mais alto')}
  /* respingo ao cair no rio */
  if(P.y<=flFx.ry&&flFx.py>flFx.ry){splashFx(P.x,flFx.ry,8);try{noise(.3,.05,900,'lowpass')}catch(e){}}flFx.py=P.y}
/* ---------- Minhocão ---------- */
var wormG=null;
function makeWorm(){if(!wormG)wormG={s:new T.SphereGeometry(.3,12,9),e:new T.SphereGeometry(.11,10,8),p:new T.SphereGeometry(.055,8,6),m:new T.SphereGeometry(.42,10,5,0,6.283,0,1.3),lf:new T.SphereGeometry(.14,8,5)};
  var g=new T.Group(),skin=M(0xc8704a,.75),band=M(0xf2c25a,.7),wh=M(0xfafaf2,.4),dk=M(0x1a1410,.4),dirt=pbr(texDirt,.97,1.2,{color:new T.Color(0x8a6440)});
  var segs=[];for(var i=0;i<7;i++){var sm=mesh(wormG.s,i%2?band:skin,i<3,false);var sc=i===0?1.2:1-i*.085;sm.scale.setScalar(sc);g.add(sm);segs.push(sm)}
  var hd=segs[0];[-1,1].forEach(function(sd){var ey=mesh(wormG.e,wh,false,false);ey.position.set(sd*.13,.12,.22);hd.add(ey);var pu=mesh(wormG.p,dk,false,false);pu.position.set(sd*.13,.12,.31);hd.add(pu)});
  var lf=mesh(wormG.lf,M(0x6ad04a,.6),false,false);lf.scale.set(.5,.25,1.2);lf.position.set(0,.36,0);lf.rotation.x=-.6;hd.add(lf);/* folhinha na cabeça */
  var hole=[0,1].map(function(){var m=mesh(wormG.m,dirt,false,true);m.scale.set(1.2,.3,.9);add(m);return m});
  add(g);return {g:g,segs:segs,hole:hole}}
function wormPath(e,u){/* u: 0..1 no arco; da toca A para a toca B */var a=e.dir>0?e.x0:e.x1,b=e.dir>0?e.x1:e.x0,H=e.hgt||3.2;return {x:a+(b-a)*u,y:e.base+(4*u*(1-u))*H-.35+(u<.08||u>.92?-.3:0)}}
function wormAI(e,dt){if(e.water)e.base=(curTheme.falls&&flFx)?flFx.ry:(LV.riverY!==undefined?LV.riverY:-2.4);/* peixe: a "toca" é o rio */if(e.zz){e.zz=0;e.mt=0;e.out=0;var dA=Math.abs(e.x-e.x0),dB=Math.abs(e.x-e.x1);e.dir=dA<dB?1:-1;if(!e.water)emit(dustPool,e.x,e.y+.2,8,2,.5,.55,1.2,-.3)}/* acordou: cava de volta */
  e.mt+=dt;var wait=e.wait||1.7,air=e.air||1.35,cyc=wait+air;if(e.mt>=cyc){e.mt-=cyc;e.dir=-e.dir}
  var hole=e.dir>0?e.x0:e.x1;
  if(e.mt<wait){e.out=0;e.noHit=true;e.safe=true;e.x=hole;e.y=e.base-1.2;
    if(e.mt>wait-.5&&((e.mt*20)|0)%3===0){if(e.water)emitBub(hole,e.base-.2,1);else emit(dustPool,hole,e.base+.1,1,1.2,.4,.4,1.1,-.3)}/* a terra tremendo: vai sair! */
    if(e.mt>wait-.5&&!e.rum&&!e.water){e.rum=1;try{noise(.2,.03,500,'lowpass')}catch(er){}}}
  else{var u=(e.mt-wait)/air,p=wormPath(e,u);if(!e.out){e.out=1;e.rum=0;if(e.water){if(Math.abs(P.x-hole)<16){splashFx(hole,e.base,7);try{noise(.18,.03,1200,'lowpass')}catch(er){}}}else emit(dustPool,hole,e.base+.2,10,2.8,.6,.6,1.2,-.3)}
    e.u=u;e.x=p.x;e.y=p.y-.35;e.noHit=u<.06||u>.94;e.safe=e.noHit;
    if(u>.9&&!e.dive){e.dive=1;if(e.water){if(Math.abs(P.x-e.x)<16)splashFx(e.dir>0?e.x1:e.x0,e.base,7)}else emit(dustPool,e.dir>0?e.x1:e.x0,e.base+.2,10,2.8,.6,.6,1.2,-.3)}if(u<.5)e.dive=0}}
function wormVis(e,dt){var v=e.vis,i;v.hole[0].position.set(e.x0,e.base,0);v.hole[1].position.set(e.x1,e.base,0);
  if(e.bub){v.g.visible=true;v.g.position.set(e.x,e.y+e.h*.5,0);v.g.rotation.set(0,0,tm*1.5);for(i=0;i<v.segs.length;i++){var a=i/v.segs.length*5.2;v.segs[i].visible=true;v.segs[i].position.set(Math.cos(a)*.38*(1-i*.06),Math.sin(a)*.38*(1-i*.06),0)}return}/* presa na bolha da raposinha: enrolada no meio */
  if(e.slp>0||e.wake){v.g.position.set(e.x,e.y+.3,0);v.g.rotation.set(0,0,0);for(i=0;i<v.segs.length;i++){v.segs[i].visible=true;v.segs[i].position.set((i*.4-1.2)*(e.dir||1)*-1,-.05,0)}return}
  if(!e.out){v.g.visible=true;v.segs.forEach(function(s){s.visible=false});return}
  var hp=wormPath(e,e.u);v.g.position.set(hp.x,hp.y,0);v.g.rotation.set(0,0,0);
  for(i=0;i<v.segs.length;i++){var uu=e.u-i*.045,s=v.segs[i];if(uu<0){s.visible=false;continue}var p=wormPath(e,uu);s.visible=p.y>e.base-.45;s.position.set(p.x-hp.x,p.y-hp.y,0)}
  var p2=wormPath(e,Math.min(1,e.u+.02));v.segs[0].rotation.set(0,e.dir>0?.6:-.6,-Math.atan2(p2.y-hp.y,(p2.x-hp.x)||.001)*.3)}
/* ---------- enxame de abelhas ---------- */
var beeG=null;
function makeBees(){if(!beeG)beeG={b:new T.SphereGeometry(.13,10,8),r:new T.TorusGeometry(.125,.028,5,12),w:new T.PlaneGeometry(.2,.12),e:new T.SphereGeometry(.035,6,5),s:new T.ConeGeometry(.03,.09,5)};
  var g=new T.Group(),yel=M(0xf4c430,.55),blk=M(0x241c10,.6),wing=new T.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.6,roughness:.2,side:T.DoubleSide,depthWrite:false}),bees=[];
  for(var i=0;i<3;i++){var b=new T.Group(),bd=mesh(beeG.b,yel,true,false);bd.scale.set(1,1,1.35);b.add(bd);
    [-.05,.06].forEach(function(z){var rg=mesh(beeG.r,blk,false,false);rg.position.z=z;rg.scale.set(1,1,.6);b.add(rg)});
    [-1,1].forEach(function(sd){var ey=mesh(beeG.e,blk,false,false);ey.position.set(sd*.06,.04,.16);b.add(ey)});
    var st=mesh(beeG.s,blk,false,false);st.rotation.x=-Math.PI/2;st.position.z=-.2;b.add(st);
    var ws=[-1,1].map(function(sd){var w=mesh(beeG.w,wing,false,false);w.position.set(sd*.12,.12,0);w.rotation.x=-Math.PI/2;b.add(w);return {p:w,sd:sd}});
    b.scale.setScalar(1.3);g.add(b);bees.push({b:b,ws:ws,ph:i*2.1})}
  add(g);return {g:g,bees:bees}}
function beeAI(e,dt){e.mt=(e.mt||0)+dt;
  var near=sees(e,7.5,4.5)&&P.x>e.x0-1.5&&P.x<e.x1+1.5;e.ch=clamp((e.ch||0)+(near?dt*1.2:-dt*.6),0,1);
  e.px=(e.px===undefined?e.x:e.px)+e.dir*e.speed*.8*dt;if(e.px>e.x1){e.px=e.x1;e.dir=-1}else if(e.px<e.x0){e.px=e.x0;e.dir=1}
  var tx=e.px+(P.x-e.px)*e.ch*.85,ty=e.by+((P.y+.6)-e.by)*e.ch*.6;tx=clamp(tx,e.x0-1.5,e.x1+1.5);ty=clamp(ty,e.by-2.2,e.by+1.5);
  var sp=2.3*(LV.es||1),dx=tx-e.x,nx=e.x+clamp(dx,-sp*dt,sp*dt);
  if(!beeBlk(nx,e.y))e.x=nx;else{e.dir=dx>0?-1:1;e.px=e.x}/* bloco/chão na frente: não atravessa, vira */
  e.cy=(e.cy===undefined?e.by:e.cy)+clamp(ty-e.cy,-sp*dt,sp*dt);
  var z=(e.mt*1.6)%2,tri=z<1?z:2-z,zz=(tri-.5)*.7,ny=e.cy-.3+zz;
  if(beeBlk(e.x,ny)){var f=null;for(var k=1;k<=16&&f===null;k++){if(!beeBlk(e.x,ny+k*.1))f=ny+k*.1;else if(!beeBlk(e.x,ny-k*.1))f=ny-k*.1}if(f!==null){ny=f;e.cy=ny+.3-zz}else ny=e.y}
  e.y=ny;e.fdir=dx>.05?1:(dx<-.05?-1:(e.fdir||1))}
function beeBlk(x,y){for(var i=0;i<solids.length;i++){var q=solids[i];if(q.dead||q.hid)continue;var b=q.b===undefined?q.t-40:q.b;if(x+.55>q.l&&x-.55<q.r&&y+.85>b&&y-.05<q.t)return true}return false}
function beeVis(e,dt){var v=e.vis,sl=e.slp>0;v.bees.forEach(function(o,i){var a=tm*(sl?1.5:4.2)+o.ph,rx=sl?.32:.38;
  o.b.position.set(Math.cos(a)*rx,.3+Math.sin(a*1.7)*.16+(sl?-.15:0),Math.sin(a)*.28);o.b.rotation.y=(e.fdir||1)>0?Math.PI/2:-Math.PI/2;
  o.ws.forEach(function(w){w.p.rotation.z=w.sd*Math.sin(tm*60+i)*(sl?.1:.6)})})}

/* ===================== Mundo 16 — parte 2 =====================
   Tatu-espinho: enterrado com os espinhos para fora; quando o Kuro chega perto ele sai rolando. Pular nele machuca: só fogo, capa (giro) derrotam.
   Broto-armadilha: planta de boca de pétalas que brota do chão (não de cano); não sai se o Kuro estiver em cima do buraco.
   Peixe-voador: pula do rio fazendo um arco (mesma lógica do Minhocão, mas a "toca" é a água).
   Tronco giratório com espinhos (LV.logs) e a ponte de madeira que cai (crumbles com tábuas). */
var armG=null;
function makeArmad(){if(!armG)armG={sh:new T.SphereGeometry(.42,14,10),rg:new T.TorusGeometry(.42,.04,5,18),sp:new T.ConeGeometry(.06,.26,5),e:new T.SphereGeometry(.07,8,6),p:new T.SphereGeometry(.035,6,5),m:new T.SphereGeometry(.55,10,5,0,6.283,0,1.3)};
  var g=new T.Group(),ball=new T.Group(),shM=M(0x8a6a58,.6),rgM=M(0x5e4434,.7),spM=M(0xf0e6cc,.45),wh=M(0xfafaf2,.4),dk=M(0x1a1410,.4);g.add(ball);
  var sh=mesh(armG.sh,shM,true,false);ball.add(sh);
  for(var i=-2;i<=2;i++){var r=mesh(armG.rg,rgM,false,false);r.rotation.y=Math.PI/2;r.position.x=i*.13;r.scale.setScalar(Math.sqrt(1-(i*.13/.44)*(i*.13/.44)));ball.add(r)}
  for(var k=0;k<18;k++){var u=1-2*(k+.5)/18,rr=Math.sqrt(1-u*u),ph=k*2.399963,dv=new T.Vector3(Math.cos(ph)*rr,u,Math.sin(ph)*rr).normalize();var c=mesh(armG.sp,spM,false,false);c.position.copy(dv).multiplyScalar(.44);c.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dv);ball.add(c)}
  var face=new T.Group();g.add(face);[-1,1].forEach(function(sd){var ey=mesh(armG.e,wh,false,false);ey.position.set(sd*.12,.06,.42);face.add(ey);var pu=mesh(armG.p,dk,false,false);pu.position.set(sd*.12,.06,.48);face.add(pu)});
  var nose=mesh(armG.p,M(0xd88a8a,.5),false,false);nose.scale.setScalar(1.6);nose.position.set(0,-.02,.5);face.add(nose);
  var mound=mesh(armG.m,pbr(texDirt,.97,1.2,{color:new T.Color(0x8a6440)}),false,true);mound.scale.set(1.15,.3,.9);g.add(mound);
  add(g);return {g:g,ball:ball,face:face,mound:mound}}
function armadAI(e,dt){e.at=(e.at||0)+dt;
  if(e.st2==='bur'){e.y=e.base-.45;e.h=.75;e.cur=0;e.safe=false;e.noHit=false;
    if(e.at>1.2&&state==='play'&&!P.warp&&Math.abs(P.x-e.x)<4.6&&Math.abs(P.y-e.base)<2.4&&P.x>e.x0-1&&P.x<e.x1+1){e.st2='pop';e.at=0;e.dir=P.x>e.x?1:-1;emit(dustPool,e.x,e.base+.2,12,3,.6,.6,1.2,-.3);try{noise(.2,.04,600,'lowpass')}catch(er){}
      if(!armadAI.told){armadAI.told=1;toast('Tatu-espinho! Pular nele machuca: use o fogo ou a capa')}}}
  else if(e.st2==='pop'){var u=Math.min(1,e.at/.35);e.y=e.base-.45+Math.sin(u*Math.PI)*1.1+u*.45;e.h=.85;if(u>=1){e.st2='roll';e.at=0;e.y=e.base}}
  else if(e.st2==='roll'){e.y=e.base;var sp=5*(LV.es||1),nx=e.x+e.dir*sp*dt;if(nx<e.x0||nx>e.x1){e.dir=-e.dir;nx=clamp(nx,e.x0,e.x1);emit(dustPool,nx,e.base+.2,5,2,.4,.5,1.2,-.3)}e.x=nx;e.cur=sp;
    if(((e.at*12)|0)%2===0&&Math.random()<.3)emit(dustPool,e.x-e.dir*.3,e.base+.1,1,1,.4,.4,1.1,-.3);if(e.at>3.4){e.st2='dig';e.at=0}}
  else if(e.st2==='dig'){var d=Math.min(1,e.at/.6);e.y=e.base-.45*d;if(((e.at*20)|0)%2===0)emit(dustPool,e.x,e.base+.1,1,1.4,.4,.45,1.1,-.3);if(d>=1){e.st2='bur';e.at=0}}}
function armadVis(e,dt){var v=e.vis,st=e.st2;v.g.position.set(e.x,e.y,0);if(e.bub){v.mound.visible=false;v.face.visible=false;v.ball.position.y=.42;v.ball.rotation.z+=dt*2;return}v.mound.visible=st==='bur'||st==='dig';v.mound.position.y=e.base-e.y+.02;
  v.ball.position.y=.42;if(st==='roll')v.ball.rotation.z-=e.dir*dt*5/.42;else if(st==='bur')v.ball.rotation.z*=.9;
  v.face.visible=st!=='roll';v.face.position.y=st==='bur'?.2+Math.max(0,Math.sin(tm*1.3+e.ph))*.12:.42;v.face.rotation.y=st==='bur'?Math.sin(tm*.9+e.ph)*.5:(e.dir>0?.5:-.5)}
/* ---------- Broto-armadilha ---------- */
var spG=null;
function makeSprout(){if(!spG)spG={st:new T.CylinderGeometry(.07,.1,1.3,7),j:new T.SphereGeometry(.34,14,8,0,6.283,0,1.5),t:new T.ConeGeometry(.05,.14,4),pt:new T.SphereGeometry(.24,10,6),lf:new T.SphereGeometry(1,10,5),e:new T.SphereGeometry(.07,8,6),p:new T.SphereGeometry(.035,6,5)};
  var g=new T.Group(),plant=new T.Group();g.add(plant);var gr=M(0x5ab83a,.7),jw=M(0x8ad04a,.6),pk=M(0xf27ab0,.6),wh=M(0xfaf6e8,.4),dk=M(0x1a1410,.4);
  var st=mesh(spG.st,M(0x3f8a2a,.8),false,false);st.position.y=.65;plant.add(st);
  [-1,1].forEach(function(sd){var lf=mesh(spG.lf,gr,false,false);lf.scale.set(.42,.05,.16);lf.position.set(sd*.34,.35,0);lf.rotation.z=sd*-.45;plant.add(lf)});
  var head=new T.Group();head.position.y=1.42;plant.add(head);
  for(var i=0;i<6;i++){var a=i/6*Math.PI*2,pe=mesh(spG.pt,pk,false,false);pe.scale.set(.55,.22,1);pe.position.set(Math.cos(a)*.36,Math.sin(a)*.36,-.12);pe.rotation.z=a+Math.PI/2;pe.rotation.x=Math.PI/2;head.add(pe)}
  var up=new T.Group(),lo=new T.Group();head.add(up);head.add(lo);
  var uj=mesh(spG.j,jw,true,false);up.add(uj);var lj=mesh(spG.j,jw,true,false);lj.rotation.x=Math.PI;lo.add(lj);
  for(var k=0;k<5;k++){var x=(k-2)*.11,t1=mesh(spG.t,wh,false,false);t1.rotation.x=Math.PI;t1.position.set(x,-.02,.26-Math.abs(k-2)*.04);up.add(t1);var t2=mesh(spG.t,wh,false,false);t2.position.set(x,.02,.26-Math.abs(k-2)*.04);lo.add(t2)}
  [-1,1].forEach(function(sd){var ey=mesh(spG.e,wh,false,false);ey.position.set(sd*.13,.24,.2);up.add(ey);var pu=mesh(spG.p,dk,false,false);pu.position.set(sd*.13,.25,.26);up.add(pu)});
  var hole=mesh(armG?armG.m:new T.SphereGeometry(.55,10,5,0,6.283,0,1.3),pbr(texDirt,.97,1.2,{color:new T.Color(0x6a4a30)}),false,true);hole.scale.set(.9,.18,.7);g.add(hole);
  add(g);return {g:g,plant:plant,up:up,lo:lo,head:head,hole:hole}}
function sproutAI(e,dt){var per=3.6,pr;var over=state==='play'&&Math.abs(P.x-e.x)<.9&&Math.abs(P.y-e.base)<.4;
  e.pr=(e.pr===undefined?(e.ph||0):e.pr);if(!(over&&(e.pr%per)>=1.1&&(e.pr%per)<1.5))e.pr+=dt;pr=e.pr%per;
  var len;if(pr<1.5)len=0;else if(pr<1.8)len=(pr-1.5)/.3;else if(pr<3.1)len=1;else if(pr<3.4)len=1-(pr-3.1)/.3;else len=0;
  if(pr>1.1&&pr<1.5&&((tm*30)|0)%3===0)emit(dustPool,e.x,e.base+.1,1,1.1,.4,.35,1,-.2);/* aviso: terra mexendo */
  e.len=len;e.y=e.base-1.7*(1-len);e.h=1.75;e.noHit=len<.35;e.safe=e.noHit;e.cur=0}
function sproutVis(e,dt){var v=e.vis,l=e.len||0;v.hole.visible=!e.bub;if(e.bub){v.g.position.set(e.x,e.y+.3,0);v.plant.position.y=0;v.plant.visible=true;v.plant.scale.setScalar(.55);return}v.g.position.set(e.x,e.base,0);v.plant.position.y=-1.75*(1-l);v.plant.visible=l>.03;v.plant.scale.setScalar(.6+.4*l);
  var o=(Math.sin(tm*7+e.ph)*.5+.5)*.55*l;v.up.rotation.x=-o;v.lo.rotation.x=o*.6;v.head.rotation.y=Math.sin(tm*2+e.ph)*.4;v.head.rotation.z=Math.sin(tm*3.1)*.12}
/* ---------- Peixe-voador ---------- */
var jfG=null;
function makeJFish(){if(!jfG)jfG={b:new T.SphereGeometry(.3,14,10),f:new T.PlaneGeometry(.55,.3),t:new T.ConeGeometry(.2,.32,4),e:new T.SphereGeometry(.08,8,6),p:new T.SphereGeometry(.04,6,5)};
  var g=new T.Group(),inner=new T.Group();g.add(inner);var bm=M(0x4aa8e0,.3,.35),bel=M(0xe8f4ff,.4),fm=new T.MeshStandardMaterial({color:0x9ae6ff,roughness:.3,transparent:true,opacity:.8,side:T.DoubleSide}),wh=M(0xffffff,.3),dk=M(0x111111,.3);
  var bd=mesh(jfG.b,bm,true,false);bd.scale.set(.75,.8,1.5);inner.add(bd);var be=mesh(jfG.b,bel,false,false);be.scale.set(.6,.5,1.3);be.position.y=-.1;inner.add(be);
  var wings=[-1,1].map(function(sd){var w=mesh(jfG.f,fm,false,false);w.position.set(sd*.4,.06,.05);w.rotation.x=-Math.PI/2;inner.add(w);return {p:w,sd:sd}});/* barbatanas grandes como asas */
  var tl=mesh(jfG.t,M(0xffa040,.5),false,false);tl.rotation.x=-Math.PI/2;tl.scale.set(.25,1,1);tl.position.z=-.55;inner.add(tl);
  [-1,1].forEach(function(sd){var ey=mesh(jfG.e,wh,false,false);ey.position.set(sd*.15,.1,.32);inner.add(ey);var pu=mesh(jfG.p,dk,false,false);pu.position.set(sd*.17,.1,.38);inner.add(pu)});
  add(g);return {g:g,inner:inner,wings:wings}}
function jfishVis(e,dt){var v=e.vis;if(e.bub){v.g.visible=true;v.g.position.set(e.x,e.y+.3,0);v.inner.rotation.set(0,Math.PI/2+Math.sin(tm*3)*.4,0);return}if(e.slp>0||e.wake){v.g.visible=true;v.inner.rotation.set(0,0,Math.PI/2);v.g.position.set(e.x,e.y+.3,0);return}
  v.g.visible=!!e.out;if(!e.out)return;var hp=wormPath(e,e.u),p2=wormPath(e,Math.min(1,e.u+.02));v.g.position.set(hp.x,hp.y,0);
  v.inner.rotation.set(-Math.atan2(p2.y-hp.y,Math.abs(p2.x-hp.x)||.001),e.dir>0?Math.PI/2:-Math.PI/2,0);v.wings.forEach(function(w){w.p.rotation.y=w.sd*Math.sin(tm*30)*.35})}
/* ---------- tronco giratório com espinhos ---------- */
function buildLogs(){flLogs=[];(LV.logs||[]).forEach(function(d){var L=d.L||4.4,g=new T.Group(),bark=barkM,spM=M(0xe8e0c8,.45);
  var lg=mesh(new T.CylinderGeometry(.3,.3,L,10),bark,true,false);lg.rotation.z=Math.PI/2;g.add(lg);
  [-1,1].forEach(function(sd){var cap=mesh(new T.CircleGeometry(.3,10),M(0xc8a070,.8),false,false);cap.position.x=sd*L/2;cap.rotation.y=sd*Math.PI/2;g.add(cap)});
  var tg=new T.ConeGeometry(.08,.32,5),S=[];for(var x=-L/2+.35;x<L/2-.2;x+=.45)for(var a=0;a<4;a++){var an=a*Math.PI/2+(x*3)%1,c=new T.Mesh(tg);c.position.set(x,Math.cos(an)*.38,Math.sin(an)*.38);c.rotation.x=an;c.updateMatrix();var gg=tg.clone();gg.applyMatrix4(c.matrix);S.push(gg)}
  g.add(mesh(mgL(S),spM,false,false));
  var hub=mesh(new T.CylinderGeometry(.18,.18,.8,10),M(0x5e4229,.8),false,false);hub.rotation.x=Math.PI/2;g.add(hub);
  var post=mesh(new T.CylinderGeometry(.16,.2,d.y-d.gy+.2,8),M(0x6a4a2c,.9),true,false);post.position.set(d.x,(d.y+d.gy)/2,-.55);add(post);
  g.position.set(d.x,d.y,0);add(g);flLogs.push({d:d,g:g,L:L,a:d.a0||0})})}
var flLogs=[];
function logsUpd(dt){flLogs.forEach(function(o){o.a+=dt*(o.d.speed||1.4)*(o.d.dir||1);o.g.rotation.z=o.a;
  if(state!=='play'||P.inv>0)return;var cx=o.d.x,cy=o.d.y,dx=Math.cos(o.a),dy=Math.sin(o.a),hl=o.L/2;
  for(var k=0;k<3;k++){var px=P.x,py=P.y+.2+k*(P.h-.4)/2,t=clamp((px-cx)*dx+(py-cy)*dy,-hl,hl),qx=cx+dx*t,qy=cy+dy*t;if((px-qx)*(px-qx)+(py-qy)*(py-qy)<.38){hurt(qx,1);break}}})}

/* ===================== Mundo 16 — parte 3 =====================
   Coruja-mergulhadora: pousada lá no alto; quando o Kuro passa embaixo ela mira e mergulha em linha reta, depois volta para o poleiro.
   Troncos descendo a cachoeira (LV.wlogs): plataformas que descem sem parar e voltam lá de cima.
   Ilhas que afundam (LV.sinks): com o Kuro em cima vão afundando um pouco; sem ninguém sobem de volta.
   Fim: subida até o portão do castelo e a Semente de Luz no pedestal ao lado da bandeira. */
var owlG=null,flWl=[],flSk=[];
function makeOwl(snow){if(!owlG)owlG={b:new T.SphereGeometry(.34,14,10),e:new T.SphereGeometry(.1,10,8),p:new T.SphereGeometry(.05,8,6),w:new T.SphereGeometry(.3,10,6),t:new T.ConeGeometry(.08,.22,4),k:new T.ConeGeometry(.05,.14,4)};
  var g=new T.Group(),inner=new T.Group();g.add(inner);var br=snow?M(0xeef2f8,.8):M(0x8a6a4a,.85),cr=snow?M(0xffffff,.8):M(0xf0e2c4,.8),/* Mundo 18: coruja-das-neves (branca) */wh=M(0xffffff,.3),og=M(0xffa830,.35),dk=M(0x111111,.3);
  var bd=mesh(owlG.b,br,true,false);bd.scale.set(1,1.15,.9);bd.position.y=.35;inner.add(bd);
  var be=mesh(owlG.b,cr,false,false);be.scale.set(.7,.85,.5);be.position.set(0,.3,.18);inner.add(be);
  [-1,1].forEach(function(sd){var ey=mesh(owlG.e,wh,false,false);ey.position.set(sd*.13,.5,.27);inner.add(ey);var ir=mesh(owlG.p,og,false,false);ir.scale.setScalar(1.3);ir.position.set(sd*.13,.5,.34);inner.add(ir);var pu=mesh(owlG.p,dk,false,false);pu.scale.setScalar(.6);pu.position.set(sd*.13,.5,.38);inner.add(pu);
    var tf=mesh(owlG.t,br,false,false);tf.position.set(sd*.2,.78,0);tf.rotation.z=-sd*.4;inner.add(tf)});
  var bk=mesh(owlG.k,og,false,false);bk.rotation.x=Math.PI*.9;bk.position.set(0,.4,.33);inner.add(bk);
  var wings=[-1,1].map(function(sd){var p=new T.Group();p.position.set(sd*.28,.45,-.02);inner.add(p);var w=mesh(owlG.w,br,false,false);w.scale.set(.35,1,.25);w.position.set(sd*.08,-.18,0);p.add(w);return {p:p,sd:sd}});
  add(g);return {g:g,inner:inner,wings:wings}}
function owlAI(e,dt){if(e.zz){e.zz=0;e.st2='rise'}e.cool=(e.cool||0)-dt;e.at=(e.at||0)+dt;var sp;
  if(e.st2==='perch'){e.x=e.hx;e.y=e.hy+Math.sin(tm*2+e.ph)*.05;e.safe=false;
    if(e.cool<=0&&state==='play'&&!P.warp&&Math.abs(P.x-e.hx)<5.5&&P.y<e.hy-1.2&&P.x>e.x0-1&&P.x<e.x1+1){e.st2='aim';e.at=0;e.tx=P.x;e.ty=P.y+.3;try{sfx.alert()}catch(er){}}}
  else if(e.st2==='aim'){e.tx+=(P.x-e.tx)*Math.min(1,dt*6);e.ty+=(P.y+.3-e.ty)*Math.min(1,dt*6);e.y=e.hy+Math.sin(e.at*40)*.04;if(e.at>.5){e.st2='dive';e.at=0;var dx=e.tx-e.x,dy=e.ty-e.y,d=Math.hypot(dx,dy)||1;e.vx=dx/d;e.vy=dy/d;try{beep(900,.25,'sine',.04,-500)}catch(er){}}}
  else if(e.st2==='dive'){sp=9.5*(LV.es||1);var nx=e.x+e.vx*sp*dt,ny=e.y+e.vy*sp*dt,fl=floorBelow(nx,e.y+.2);
    if(ny<=fl+.02||e.at>1.4||nx<e.x0-2||nx>e.x1+2||(e.vy<0&&ny<e.ty-.3)){if(ny<=fl+.02){ny=fl;emit(dustPool,nx,fl+.1,6,2,.5,.5,1.2,-.3)}e.st2='rise';e.at=0}e.x=nx;e.y=ny}
  else if(e.st2==='rise'){sp=3.6;var ddx=e.hx-e.x,ddy=e.hy-e.y,dd=Math.hypot(ddx,ddy);if(dd<.1){e.st2='perch';e.cool=1.4}else{e.x+=ddx/dd*Math.min(dd,sp*dt);e.y+=ddy/dd*Math.min(dd,sp*dt)}}
  e.dir=(e.st2==='dive'?e.vx:P.x-e.x)>0?1:-1}
function owlVis(e,dt){var v=e.vis,st=e.st2,sl=e.slp>0;v.inner.rotation.y=sl?0:(e.dir>0?.35:-.35);
  var fl=st==='rise'||st==='dive'||e.wake;v.wings.forEach(function(w){w.p.rotation.z=w.sd*(st==='dive'?1.25:(fl?.6+Math.sin(tm*18)*.6:.08))});
  v.inner.rotation.x=st==='dive'?.5:0;v.inner.position.y=sl?-.15:0}
/* ---------- troncos descendo a cachoeira ---------- */
function buildWLogs(){flWl=[];var WL=LV.wlogs||[];if(!WL.length)return;
  /* paredão de pedra por cima das colunas: a água e os troncos saem de dentro dele (antes nasciam do nada) */
  var xa=1e9,xb=-1e9,ty=0;WL.forEach(function(d){if(d.top0===undefined)d.top0=d.top;xa=Math.min(xa,d.x-(d.w||2.4)/2);xb=Math.max(xb,d.x+(d.w||2.4)/2);ty=Math.max(ty,d.top0)});/* top0: a altura original (não cresce a cada recomeço) */
  var oy=ty+4.6;/* dono pediu a pedra mais alta (era +0,6) */WL.forEach(function(d){d.top=Math.max(d.top0,oy+2.2)});/* o tronco reaparece escondido dentro da pedra */
  var ow=xb-xa+5,oh=7,og=new T.BoxGeometry(ow,oh,4.2,Math.round(ow/1.2),8,3),pa=og.attributes.position,uv=og.attributes.uv;
  for(var k=0;k<pa.count;k++){var vx=pa.getX(k),vy=pa.getY(k),vz=pa.getZ(k),n=Math.sin(vx*1.3)*.22+Math.sin(vx*3.1+vy)*.12;
    if(vy<-oh/2+.01){var notch=0;WL.forEach(function(d){var dd=Math.abs(vx-(d.x-(xa+xb)/2));if(dd<(d.w||2.4)/2+.6)notch=Math.max(notch,.55*(1-dd/((d.w||2.4)/2+.6)))});pa.setY(k,vy+notch+Math.abs(n)*.8)}
    if(vz>0)pa.setZ(k,vz+n);if(Math.abs(vx)>ow/2-.01)pa.setX(k,vx+n*2);uv.setXY(k,uv.getX(k)*ow/3.5,uv.getY(k)*oh/3.5)}
  og.computeVertexNormals();solids.push({l:(xa+xb)/2-ow/2,r:(xa+xb)/2+ow/2,t:oy+oh,b:oy+.3,oneway:false,rockTop:1});var ov=mesh(og,flM.rock,true,true);ov.position.set((xa+xb)/2,oy+oh/2,-.5);add(ov);
  var ms=mesh(new T.BoxGeometry(ow+.4,.5,4.6),mossM,false,true);ms.position.set((xa+xb)/2,oy+oh+.1,-.5);add(ms);
  var VN=[];for(var v=0;v<Math.round(ow/1.4);v++){var vx2=xa-2+v*1.4+.3,skip=false;WL.forEach(function(d){if(Math.abs(vx2-d.x)<(d.w||2.4)/2+.7)skip=true});if(skip)continue;var ln=.8+((v*7)%5)*.35;VN.push(xf(new T.CylinderGeometry(.04,.03,ln,4),[vx2,oy-ln/2+.3,1.6]))}
  if(VN.length)add(mesh(mgL(VN),flM.vine,false,false));
  flFx.oy=oy+.3;
  var wetBark=barkM.clone();wetBark.color=barkM.color.clone().multiplyScalar(.68);wetBark.roughness=.28;wetBark.metalness=.05;/* tronco molhado: mais escuro e brilhante */
  WL.forEach(function(d,ci){var w=d.w||2.4,span=d.top-d.bot,n=Math.max(1,Math.round(span/(d.gap||4.5))),gap=span/n;d.dir=d.dir||(ci%2?1:-1);
  /* cortina de água desta coluna: embaixo de cada tronco a água falha (o tronco segura a água) */
  var LY=[];for(var q=0;q<8;q++)LY.push(-99);
  var cm=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:lushU.time,ly:{value:LY},cx:{value:d.x},hw:{value:w/2}},
    vertexShader:'varying vec2 vU;varying vec2 vW;void main(){vU=uv;vec4 wp=modelMatrix*vec4(position,1.);vW=wp.xy;gl_Position=projectionMatrix*viewMatrix*wp;}',
    fragmentShader:'uniform float time,cx,hw;uniform float ly[8];varying vec2 vU;varying vec2 vW;float h(vec2 p){return fract(sin(dot(p,vec2(12.9,78.2)))*43758.5);}void main(){float st=0.;for(int i=0;i<3;i++){float fi=float(i);float x=floor(vU.x*(8.+fi*6.));float sp=1.6+h(vec2(x,fi))*1.5;st+=smoothstep(.5,1.,fract(vU.y*(2.+fi)+time*sp+h(vec2(x,fi+3.))))*.45;}float edge=smoothstep(0.,.14,vU.x)*smoothstep(1.,.86,vU.x);float occ=1.;float ax=abs(vW.x-cx);for(int i=0;i<8;i++){float d=ly[i]-vW.y;if(d>0.&&d<3.&&ax<hw-.1){occ=min(occ,mix(.04,1.,smoothstep(.9,3.,d)));}}vec3 c=mix(vec3(.32,.66,.9),vec3(.96,.99,1.),clamp(st,0.,1.));gl_FragColor=vec4(c,(.72+st*.28)*edge*occ);}'});
  var cg=new T.PlaneGeometry(w+1.6,span+2,1,1);cg.translate(0,(span+2)/2,0);var cur=new T.Mesh(cg,cm);cur.position.set(d.x,d.bot-1,-1.1);cur.renderOrder=3;add(cur);
  for(var k=0;k<(LITE?2:4);k++){var s=new T.Sprite(flM.foam);s.scale.set(2.4,1.6,1);add(s);flFx.foam.push({s:s,x:d.x,y:flFx.ry,z:-.6,w:w,ph:k/4})}
  var LS=[];
  for(var i=0;i<n;i++){var g=new T.Group(),lg=mesh(new T.CylinderGeometry(.32,.32,w,10),wetBark,true,false);lg.rotation.z=Math.PI/2;lg.position.y=-.32;g.add(lg);
    [-1,1].forEach(function(sd){var cap=mesh(new T.CircleGeometry(.32,10),M(0xa88a5e,.5),false,false);cap.position.set(sd*w/2,-.32,0);cap.rotation.y=sd*Math.PI/2;g.add(cap);
      /* fiozinho de água escorrendo pela ponta do tronco */
      var sg=new T.PlaneGeometry(.36,2.2);sg.translate(0,-1.1,0);var sm=new T.Mesh(sg,flM.wm);sm.position.set(sd*(w/2-.08),-.5,.05);sm.renderOrder=3;g.add(sm)});
    var ms=mesh(new T.SphereGeometry(1,8,4,0,6.283,0,1.2),mossM,false,false);ms.scale.set(w*.3,.12,.25);ms.position.set(-.2,-.02,0);g.add(ms);
    var fo=[];
    add(g);var y=d.top-((i+(d.off||0))%n)*gap,so={l:d.x-w/2,r:d.x+w/2,t:y,b:y-.64,oneway:false,wlog:1};solids.push(so);var L={d:d,g:g,so:so,y:y,span:span,fo:fo,cm:cm,k:i};flWl.push(L);LS.push(L)}
  d.LS=LS})}
function wlogsUpd(dt){/* tartaruga encostada num tronco: é empurrada para o lado (o tronco não passa por dentro dela) */
  if(flWl.length)for(var i=0;i<enemies.length;i++){var e=enemies[i];if(!e.alive||e.type!=='tchase'||e.slp>0)continue;
    for(var j=0;j<flWl.length;j++){var so=flWl[j].so,hw=e.w+.05;if(e.x+hw>so.l&&e.x-hw<so.r&&e.y+.85>so.b-.05&&e.y<so.t+.05){var gl=e.x+hw-so.l,gr=so.r-(e.x-hw);if(gl<gr)e.x-=gl;else e.x+=gr}}}
  flWl.forEach(function(L){var d=L.d,so=L.so,on=P.onPlat===so&&P.grounded,ny=L.y+d.dir*(d.sp||1.5)*dt;
  /* coluna que desce: some no rio e volta de dentro da pedra; coluna que sobe: sai do rio e entra na pedra */
  if(d.dir<0&&ny<d.bot){ny+=L.span;if(on){P.onPlat=null;on=false}if(Math.abs(P.x-d.x)<12)splashFx(d.x,flFx.ry,5)}
  if(d.dir>0&&ny>d.top){ny-=L.span;if(on){P.onPlat=null;on=false}}
  if(d.dir>0&&L.y<flFx.ry&&ny>=flFx.ry&&Math.abs(P.x-d.x)<12)splashFx(d.x,flFx.ry,5);
  /* subindo com o Kuro em cima e chegando na pedra: o Kuro é empurrado para fora (não fica esmagado) */
  if(on&&d.dir>0&&ny+P.h*(P.big?1:.78)+.15>flFx.oy){var sd=P.x<d.x?-1:1;P.onPlat=null;P.grounded=false;P.x=sd<0?so.l-P.w/2-.08:so.r+P.w/2+.08;P.vy=0;on=false;
    if(!wlogsUpd.told){wlogsUpd.told=1;toast('O tronco entra na pedra! Pule antes de chegar lá em cima')}}
  L.y=ny;so.t=ny;so.b=ny-.64;if(on)P.y=ny;L.g.position.set(d.x,ny,0);L.g.rotation.z=Math.sin(tm*1.3+L.span+ny)*.04;
  /* água batendo em cima do tronco: respingos */
  if(ny>flFx.ry+.1&&ny<flFx.oy-.2&&Math.abs(P.x-d.x)<14&&Math.random()<.3)flDrop(d.x+(Math.random()-.5)*(d.w||2.4)*.8,ny+.05,(Math.random()-.5)*2.2,1.2+Math.random()*1.4)});
  (LV.wlogs||[]).forEach(function(d){var a=d.LS[0].cm.uniforms.ly.value;for(var q=0;q<8;q++)a[q]=q<d.LS.length?d.LS[q].y-.64:-99})}
/* ---------- Kuro molhado: entra na cachoeira, fica escuro e brilhante; ao sair pinga e vai secando (só visual) ---------- */
var kWet={w:0,mats:null};
function kuroMats(){var L=[],seen={};rig.root.traverse(function(o){if(!o.isMesh&&!o.isSkinnedMesh)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){if(!m||seen[m.uuid]||!m.color)return;seen[m.uuid]=1;L.push({m:m,c:m.color.clone(),r:m.roughness})})});return L}
var WETC=new T.Color(.42,.5,.68),_wc=new T.Color();
function kuroWetApply(w){if(!kWet.mats)return;kWet.mats.forEach(function(o){_wc.copy(o.c).multiply(WETC);o.m.color.copy(o.c).lerp(_wc,w);if(o.r!==undefined)o.m.roughness=o.r+(.18-o.r)*w})}
function kuroDry(){if(kWet.mats){kuroWetApply(0);kWet.mats=null}kWet.w=0;flDr=null}/* fase nova: as gotas são recriadas dentro dela */
function kuroWetUpd(dt,rain){var inF=false;if(rain){/* chuva (Mundo 19): molha aos poucos e pinga */var w1=kWet.w;if(!kWet.mats)kWet.mats=kuroMats();kWet.w=clamp(kWet.w+(rain>0?dt*rain*.5:-dt/6),0,1);if(kWet.w!==w1){kuroWetApply(kWet.w);if(kWet.w===0)kWet.mats=null}var sc0=P.big?1:.78;if(kWet.w>.15&&Math.random()<kWet.w*.1)flDrop(P.x+(Math.random()-.5)*.45,P.y+(.25+Math.random()*.9)*sc0,(Math.random()-.5)*.3,-.2);flDropUpd(dt);return}
  if(state==='play')(LV.wlogs||[]).forEach(function(d){var hw=((d.w||2.4)+1.6)/2;if(Math.abs(P.x-d.x)<hw&&P.y<flFx.oy&&P.y+1>flFx.ry)inF=true});
  var w0=kWet.w;if(inF){if(!kWet.mats)kWet.mats=kuroMats();kWet.w=Math.min(1,kWet.w+dt*4)}else kWet.w=Math.max(0,kWet.w-dt/5);
  if(kWet.w!==w0){kuroWetApply(kWet.w);if(kWet.w===0)kWet.mats=null}
  var sc=P.big?1:.78;
  if(inF&&Math.random()<.35)flDrop(P.x+(Math.random()-.5)*.5,P.y+1.45*sc,(Math.random()-.5)*2.4,1+Math.random()*1.2);/* água batendo na cabeça */
  else if(!inF&&kWet.w>0&&Math.random()<kWet.w*.2)flDrop(P.x+(Math.random()-.5)*.45,P.y+(.25+Math.random()*.9)*sc,(Math.random()-.5)*.3,-.2)}/* pingando */
/* ---------- ilhas que afundam ---------- */
function buildSinks(){flSk=[];(LV.sinks||[]).forEach(function(q){var w=q[1]-q[0],cx=(q[0]+q[1])/2,g=new T.Group();
  var top=mesh(boxGeo(w,.36,1.8,1),grassM,true,true);top.position.y=-.18;g.add(top);
  var bt=mesh(new T.SphereGeometry(1,12,6,0,6.283,Math.PI/2,Math.PI/2),dirtM,false,false);bt.scale.set(w*.5,1.1,.9);bt.position.y=-.34;g.add(bt);
  var rp=mesh(new T.RingGeometry(w*.55,w*.7,20),new T.MeshBasicMaterial({color:0xeaf8ff,transparent:true,opacity:0,depthWrite:false}),false,false);rp.rotation.x=-Math.PI/2;add(rp);
  add(g);var so={l:q[0],r:q[1],t:q[2],b:q[2]-.5,oneway:false,flt:true,sink:1};solids.push(so);flSk.push({q:q,g:g,so:so,d:0,rp:rp,cx:cx,max:q[3]||2.2})})}
function sinksUpd(dt){flSk.forEach(function(S){var so=S.so,on=P.onPlat===so&&P.grounded;
  S.d=on?Math.min(S.max,S.d+1.1*dt):Math.max(0,S.d-.8*dt);var y=S.q[2]-S.d+Math.sin(tm*1.6+S.cx)*.04;so.t=y;so.b=y-.5;if(on)P.y=y;
  S.g.position.set(S.cx,y,0);S.g.rotation.z=on?Math.sin(tm*5)*.02:0;S.rp.position.set(S.cx,flFx.ry+.05,0);S.rp.material.opacity=on?.35+Math.sin(tm*8)*.1:0;
  if(on&&!S.told&&!sinksUpd.told){sinksUpd.told=1;S.told=1;toast('Essa ilha afunda! Não fique parado')}})}
/* ---------- portão do castelo e a Semente de Luz ---------- */
function buildGate(){var G=LV.gate;if(!G)return;var st=pbr(texStone,.9,.3,{color:new T.Color(0xe2dccc)}),rf=M(0x3a6ad8,.6),C=[],R=[];
  [-1,1].forEach(function(sd){C.push(xf(new T.CylinderGeometry(1.1,1.25,7,12),[G.x+sd*3.2,G.y+3.5,-3]));R.push(xf(new T.ConeGeometry(1.5,2.6,12),[G.x+sd*3.2,G.y+8.3,-3]))});
  C.push(xf(new T.BoxGeometry(5.4,1.6,1.6),[G.x,G.y+5.4,-3]));for(var k=0;k<4;k++)C.push(xf(new T.BoxGeometry(.7,.6,1.6),[G.x-2.1+k*1.4,G.y+6.5,-3]));
  add(mesh(mgL(C),st,true,true));add(mesh(mgL(R),rf,false,false));
  var door=mesh(new T.PlaneGeometry(3.6,4.4),M(0x3e2a18,.9),false,false);door.position.set(G.x,G.y+2.3,-2.3);add(door);
  /* a Semente de Luz no pedestal */
  var pd=mesh(new T.CylinderGeometry(.45,.6,1,10),st,true,true);pd.position.set(G.sx,G.y+.5,-.6);add(pd);
  var sd2=mesh(new T.SphereGeometry(.28,14,10),new T.MeshStandardMaterial({color:0xfff2b0,emissive:new T.Color(0xffc840),emissiveIntensity:2.2,roughness:.3}),false,false);sd2.scale.set(.8,1.15,.8);sd2.position.set(G.sx,G.y+1.5,-.6);add(sd2);
  var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffd870,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.75}));gl.scale.set(3,3,1);gl.position.copy(sd2.position);add(gl);
  flFx.seed={m:sd2,gl:gl,y:G.y+1.5}}
function seedUpd(){var S=flFx.seed;if(!S)return;S.m.position.y=S.y+Math.sin(tm*2)*.12;S.m.rotation.y+=.02;S.gl.position.y=S.m.position.y;var p=.7+Math.sin(tm*3)*.15;S.gl.scale.set(3*p,3*p,1);
  if(Math.random()<.05)emit(sparkPool,S.m.position.x,S.m.position.y,1,.8,.8,.25,.2,-.5)}

/* ---------- castelo lá longe, bem assentado no alto do morro (dono: estava flutuando) ---------- */
function farCastle(hm){var X=LV.castleX!==undefined?LV.castleX:22,Z=-58;
  /* morro largo, verde mais escuro (a névoa clareia), com paredão de pedra no topo onde o castelo fica */
  var hill=new T.Mesh(new T.SphereGeometry(26,20,10,0,6.283,0,1.57),new T.MeshStandardMaterial({color:0x3f7a34,roughness:1,flatShading:true}));hill.scale.set(1.35,.42,.75);hill.position.set(X,-3,Z+2);farG.add(hill);
  var top=-3+26*.42;/* 7,9 */
  var rockM=new T.MeshStandardMaterial({color:0x9a958a,roughness:1,flatShading:true}),base=new T.Mesh(new T.CylinderGeometry(9.5,11.5,4,10,1),rockM);base.position.set(X,top+.4,Z);farG.add(base);
  var cap=new T.Mesh(new T.CylinderGeometry(9.6,9.6,.35,10),new T.MeshStandardMaterial({color:0x5a9a44,roughness:1,flatShading:true}));cap.position.set(X,top+2.5,Z);farG.add(cap);
  var g0=top+2.6,cs=new T.Group();cs.position.set(X,g0,Z);farG.add(cs);
  var wall=new T.MeshStandardMaterial({color:0xf2ead8,roughness:.9}),wallD=new T.MeshStandardMaterial({color:0xd8cdb4,roughness:.95}),roofA=new T.MeshStandardMaterial({color:0x3a6ad8,roughness:.55}),roofB=new T.MeshStandardMaterial({color:0xd84a3a,roughness:.55}),dk=new T.MeshBasicMaterial({color:0x2a2a38}),gold=new T.MeshStandardMaterial({color:0xf2c230,roughness:.4,metalness:.5,emissive:0x6a4a00,emissiveIntensity:.4});
  var C=[],CD=[],RA=[],RB=[],DK=[],FL=[];
  /* muralha com ameias */
  C.push(xf(new T.BoxGeometry(14,3.4,.9),[0,1.7,3.4]));C.push(xf(new T.BoxGeometry(.9,3.4,7),[-6.6,1.7,0]));C.push(xf(new T.BoxGeometry(.9,3.4,7),[6.6,1.7,0]));
  for(var k=0;k<9;k++)CD.push(xf(new T.BoxGeometry(.8,.6,1),[-6.4+k*1.6,3.7,3.4]));
  DK.push(xf(new T.CircleGeometry(1.2,12,0,Math.PI),[0,1.4,3.86]));DK.push(xf(new T.PlaneGeometry(2.4,1.4),[0,.7,3.86]));/* portão */
  /* torres dos cantos */
  [[-6.6,3.4],[6.6,3.4],[-6.6,-3.2],[6.6,-3.2]].forEach(function(q,k){var h=5+(k>1?1.2:0);C.push(xf(new T.CylinderGeometry(1.25,1.35,h,12),[q[0],h/2,q[1]]));
    for(var a=0;a<8;a++){var an=a/8*6.283;CD.push(xf(new T.BoxGeometry(.5,.5,.5),[q[0]+Math.cos(an)*1.2,h+.2,q[1]+Math.sin(an)*1.2]))}
    (k%2?RB:RA).push(xf(new T.ConeGeometry(1.6,2.8,12),[q[0],h+1.8,q[1]]));DK.push(xf(new T.PlaneGeometry(.35,.7),[q[0],h*.6,q[1]+1.37]));
    FL.push(xf(new T.PlaneGeometry(.9,.5),[q[0]+.45,h+3.6,q[1]]));C.push(xf(new T.CylinderGeometry(.04,.04,1.2,4),[q[0],h+3.4,q[1]]))});
  /* castelo do meio e torre alta com a ponta dourada */
  C.push(xf(new T.BoxGeometry(7,6,4.4),[0,3,-.6]));RB.push(xf(new T.ConeGeometry(4.6,3,4),[0,7.5,-.6],[0,Math.PI/4,0]));
  for(var w=0;w<3;w++)DK.push(xf(new T.PlaneGeometry(.6,1),[-2.2+w*2.2,4,1.62]));
  C.push(xf(new T.CylinderGeometry(1.5,1.6,11,12),[0,5.5,-1.6]));RA.push(xf(new T.ConeGeometry(2,4.2,12),[0,13.1,-1.6]));
  DK.push(xf(new T.PlaneGeometry(.5,.9),[0,8.6,-.05]));
  cs.add(new T.Mesh(mgL(C),wall));cs.add(new T.Mesh(mgL(CD),wallD));cs.add(new T.Mesh(mgL(RA),roofA));cs.add(new T.Mesh(mgL(RB),roofB));cs.add(new T.Mesh(mgL(DK),dk));
  var fl=new T.Mesh(mgL(FL),new T.MeshStandardMaterial({color:0xf2c230,side:T.DoubleSide,roughness:.6}));cs.add(fl);
  var sp=new T.Mesh(new T.SphereGeometry(.45,10,8),gold);sp.position.set(0,15.5,-1.6);cs.add(sp);
  /* caminho subindo o morro e umas árvores em volta, para o castelo ficar "plantado" */
  var tr=[],tc=new T.MeshStandardMaterial({color:0x2f6a2c,roughness:1,flatShading:true});for(var t=0;t<14;t++){var a2=t/14*6.283,rr=11+(t%3)*2.5,tx=Math.cos(a2)*rr*1.3,tz=Math.sin(a2)*rr*.6;var ty=-3+26*.42*Math.sqrt(Math.max(0,1-(tx/35)*(tx/35)-(tz/19.5)*(tz/19.5)))-.3;tr.push(xf(new T.ConeGeometry(1.1,3.2,7),[X+tx,ty+1.4,Z+2+tz]))}
  farG.add(new T.Mesh(mgL(tr),tc));
  cs.scale.setScalar(1.05)}

/* gotinhas d'água (respingo nos troncos e o Kuro pingando): bolinhas azul-claras pequenas, poucas e reaproveitadas */
var flDr=null;
/* gotinha em forma de lágrima, transparente e brilhante: primeiro escorre um pouco pelo corpo do Kuro, depois cai, estica com a velocidade e some */
function flDrop(x,y,vx,vy){if(!flDr){var top=new T.ConeGeometry(.026,.07,8,1,true);top.translate(0,.035,0);var bot=new T.SphereGeometry(.026,8,6,0,Math.PI*2,Math.PI/2,Math.PI/2);var g=mgL([top,bot]);
    var m=new T.MeshPhysicalMaterial({color:0xe8f6ff,roughness:.05,metalness:0,transmission:0,transparent:true,opacity:.7,clearcoat:1,clearcoatRoughness:.05,emissive:0x2a5a7a,emissiveIntensity:.25});
    flDr={L:[],i:0};for(var k=0;k<40;k++){var o=new T.Mesh(g,m.clone());o.visible=false;add(o);flDr.L.push({m:o,t:0})}}
  var d=flDr.L[flDr.i++%flDr.L.length];d.x=x;d.y=y;d.vx=vx;d.vy=vy;d.t=.8;d.sl=vy<0?.22+Math.random()*.2:0;d.ox=x-P.x;d.oy=y-P.y;d.m.visible=true;d.m.scale.setScalar(.7+Math.random()*.5);d.m.position.set(x,y,.38);d.m.material.opacity=.75}
function flDropUpd(dt){if(!flDr)return;flDr.L.forEach(function(d){if(d.t<=0)return;d.t-=dt;
  if(d.sl>0){d.sl-=dt;d.oy-=dt*.6;d.x=P.x+d.ox;d.y=P.y+d.oy;d.vx=P.vx*.3;d.vy=-.5;d.m.scale.y=d.m.scale.x*1.1}/* escorrendo grudada no Kuro */
  else{d.vy-=14*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.m.scale.y=d.m.scale.x*(1+Math.min(1.6,Math.abs(d.vy)*.12))}/* caindo: estica */
  d.m.position.set(d.x,d.y,.38);d.m.material.opacity=Math.min(.75,d.t*2.2);if(d.t<=0||d.y<P.y-1.2&&d.sl<=0&&d.t<.5)d.m.visible=false})}
function flDropClear(){if(flDr)flDr.L.forEach(function(d){d.t=0;d.m.visible=false})}

/* ---------- riacho: a água da cachoeira do fundo atravessa o caminho e cai pela beirada da frente; peixinhos pulam para o seco e voltam ---------- */
var flSt=[];
function buildStreams(){flSt=[];var lite=LITE,SM=null,FM=null,R=[];
  (LV.falls||[]).forEach(function(F){var cx=F.x,z=F.z||-11,sw=1.7,top=null;
    (LV.solids||[]).forEach(function(q){if(q[0]<cx-2.2&&q[1]>cx+2.2&&(q[3]===undefined||q[3]<q[2]-2))top=top===null?q[2]:Math.max(top,q[2])});
    if(!SM){SM=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:lushU.time},
      vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'uniform float time;varying vec2 vU;float h(vec2 p){return fract(sin(dot(p,vec2(12.9,78.2)))*43758.5);}void main(){float st=0.;for(int i=0;i<3;i++){float fi=float(i);float x=floor(vU.x*(5.+fi*4.));st+=smoothstep(.6,1.,fract(vU.y*(3.+fi)-time*(1.4+h(vec2(x,fi))*.8)+h(vec2(x,fi+2.))))*.4;}float edge=smoothstep(0.,.18,vU.x)*smoothstep(1.,.82,vU.x);vec3 c=mix(vec3(.25,.62,.86),vec3(.92,.98,1.),clamp(st,0.,1.));gl_FragColor=vec4(c,(.78+st*.2)*edge);}'})}
    if(top===null){streamPit(F,cx,z,sw,SM);return}/* sem chão inteiro na frente: a água corre até o buraco e cai nele */
    /* caminho da água: do pé da cachoeira até a frente do chão (z 1,9) */
    var zs=z+.5,zb=-5,zf=1.92,N=lite?10:18,pos=[],uvs=[],idx=[],k,yb=mY(cx,zb),high=top>yb+.5;
    function yAt(zz){if(zz>=zb)return top+.04;return high?top+.04:Math.max(mY(cx,zz),top-.6)+.05}
    for(k=0;k<=N;k++){var zz=zs+(zf-zs)*k/N,yy=yAt(zz),wv=sw*(1+.25*Math.sin(k*1.7+cx));pos.push(cx-wv/2,yy,zz,cx+wv/2,yy,zz);uvs.push(0,k/N*(zf-zs)/2,1,k/N*(zf-zs)/2);if(k<N){var a=k*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}}
    var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setIndex(idx);
    var rib=new T.Mesh(g,SM);rib.renderOrder=3;add(rib);
    /* chão alto: a água vem por uma calha de pedra saindo do paredão */
    if(high){var tg=new T.BoxGeometry(sw+.8,top-yb+1,zb-zs+.4);var tr=mesh(tg,flM.rock,true,true);tr.position.set(cx,(top+yb-1)/2,(zs+zb)/2);add(tr);
      R.push(xf(new T.BoxGeometry(.35,.3,zb-zs),[cx-sw/2-.2,top+.12,(zs+zb)/2]));R.push(xf(new T.BoxGeometry(.35,.3,zb-zs),[cx+sw/2+.2,top+.12,(zs+zb)/2]))}
    /* a água caindo pela beirada da frente */
    var fh=top+.04-flFx.ry,fg=new T.PlaneGeometry(sw,fh,1,1);fg.translate(0,-fh/2,0);var fc=new T.Mesh(fg,flM.wm);fc.position.set(cx,top+.04,zf+.03);/* desce até o rio */fc.renderOrder=3;add(fc);
    var fo=[];for(k=0;k<(lite?1:2);k++){var sp=new T.Sprite(flM.foam);sp.scale.set(1.4,.7,1);add(sp);fo.push(sp)}
    /* peixinhos (só enfeite: não machucam) */
    var fish=[];if(!FM)FM={b:new T.SphereGeometry(.12,10,8),t:new T.ConeGeometry(.08,.14,4),m:[M(0xff8a3a,.35,.2),M(0xc8d4e0,.25,.5)],e:M(0x111111,.3)};
    for(k=0;k<2;k++){var fg2=new T.Group(),bd=mesh(FM.b,FM.m[k],false,false);bd.scale.set(.6,.8,1.5);fg2.add(bd);var tl=mesh(FM.t,FM.m[k],false,false);tl.rotation.x=-Math.PI/2;tl.scale.set(.3,1,1);tl.position.z=-.22;fg2.add(tl);
      [-1,1].forEach(function(sd){var ey=mesh(new T.SphereGeometry(.025,6,4),FM.e,false,false);ey.position.set(sd*.06,.03,.12);fg2.add(ey)});fg2.visible=false;fg2.scale.setScalar(1.7);add(fg2);
      fish.push({g:fg2,tl:tl,st:'in',t:-(k*1.7+Math.random()*2),side:k?1:-1})}
    flSt.push({x:cx,top:top,w:sw,zf:zf,fo:fo,fish:fish,fx:cx,fy:flFx.ry,fz:zf+.35})});
  if(R.length)add(mesh(mgL(R),mossM,false,true))}
function streamsUpd(dt){flSt.forEach(function(S){var near=Math.abs(P.x-S.x)<24;
  S.fo.forEach(function(f,k){var u=(tm*.8+k*.5)%1;f.position.set(S.fx+(k-.5)*.6,S.fy+.15+u*.35,S.fz);f.material.opacity=.5});/* espuma onde a água bate no rio */
  if(Math.abs(P.x-S.fx)<14&&Math.random()<.25)flDrop(S.fx+(Math.random()-.5)*S.w,S.fy+.05,(Math.random()-.5)*2,1+Math.random()*1.3);
  if(S.pit)return;
  /* o Kuro pisando no riacho: respingos nos pés */
  if(state==='play'&&P.grounded&&Math.abs(P.x-S.x)<S.w/2+.1&&Math.abs(P.y-S.top)<.15){if(!S.on){S.on=1;for(var q=0;q<5;q++)flDrop(P.x+(Math.random()-.5)*.4,P.y+.05,(Math.random()-.5)*2.4,1.2+Math.random()*1.2)}else if(Math.abs(P.vx)>1&&Math.random()<.35)flDrop(P.x+(Math.random()-.5)*.3,P.y+.05,(Math.random()-.5)*1.6-P.vx*.1,1+Math.random())}else S.on=0;
  if(!near)return;
  S.fish.forEach(function(F){F.t+=dt;var g=F.g,lx=S.x+F.side*(S.w/2+.9),lz=1.45;
    if(F.st==='in'){g.visible=false;if(F.t>2.2+Math.random()*.02){F.st='out';F.t=0;F.tx=lx+F.side*Math.random()*.6;flDrop(S.x,S.top+.05,0,1.5)}}
    else if(F.st==='out'||F.st==='back'){var u=Math.min(1,F.t/.55),fx=F.st==='out'?S.x:F.tx,tx=F.st==='out'?F.tx:S.x,x=fx+(tx-fx)*u,y=S.top+.2+Math.sin(u*Math.PI)*1.3;
      g.visible=true;g.position.set(x,y,lz);g.rotation.set(0,(tx>fx?1:-1)*Math.PI/2,0);g.rotation.z=-(u-.5)*1.6*(tx>fx?1:-1);
      if(u>=1){if(F.st==='out'){F.st='flop';F.t=0}else{F.st='in';F.t=-Math.random()*2.5;flDrop(S.x,S.top+.05,0,1.4);flDrop(S.x,S.top+.05,.6,1.1)}}}
    else if(F.st==='flop'){/* no seco: deitado, se debatendo e dando pulinhos */var hop=.12+Math.abs(Math.sin(F.t*6))*.4;g.visible=true;g.position.set(F.tx,S.top+.15+hop,lz);g.rotation.set(0,Math.PI/2,Math.PI/2+Math.sin(F.t*14)*.45);/* deitado de lado, se debatendo */F.tl.rotation.y=Math.sin(F.t*20)*.6;
      if(F.t>1.6){F.st='back';F.t=0}}})})}

/* cachoeira com buraco na frente: o riacho corre pelo gramado até o buraco e despenca lá dentro até o rio */
function streamPit(F,cx,z,sw,SM){
  function cov(x){return (LV.solids||[]).some(function(q){return q[0]<=x&&q[1]>=x&&(q[3]===undefined||q[3]<q[2]-2)})}
  var px=null;for(var d=0;d<=4.6&&px===null;d+=.1)[1,-1].forEach(function(sg){var x=cx+sg*d;if(px===null&&!cov(x-sw/2-.15)&&!cov(x)&&!cov(x+sw/2+.15))px=x});
  if(px===null)return;
  var zs=z+.5,zb=-4.95,N=LITE?8:14,pos=[],uvs=[],idx=[],k;
  for(k=0;k<=N;k++){var u=k/N,zz=zs+(zb-zs)*u,xx=cx+(px-cx)*u*u,yy=mY(xx,zz)+.05,wv=sw*(1+.2*Math.sin(k*1.9+cx));pos.push(xx-wv/2,yy,zz,xx+wv/2,yy,zz);uvs.push(0,u*(zb-zs)/2,1,u*(zb-zs)/2);if(k<N){var a=k*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}}
  var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setIndex(idx);
  var rib=new T.Mesh(g,SM);rib.renderOrder=3;add(rib);
  var y0=mY(px,zb)+.05,fh=y0-flFx.ry,fg=new T.PlaneGeometry(sw,fh,1,1);fg.translate(0,-fh/2,0);var fc=new T.Mesh(fg,flM.wm);fc.position.set(px,y0,zb+.02);fc.renderOrder=3;add(fc);
  var fo=[];for(k=0;k<(LITE?1:2);k++){var sp=new T.Sprite(flM.foam);sp.scale.set(1.6,.8,1);add(sp);fo.push(sp)}
  flSt.push({x:px,top:-99,w:sw,zf:zb,fo:fo,fish:[],fx:px,fy:flFx.ry,fz:zb+.6,pit:1})}
