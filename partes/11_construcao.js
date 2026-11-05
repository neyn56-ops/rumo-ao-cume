/*@@parte:11_construcao.js*/
/* ---------- contêineres do mundo atual ---------- */
var lushPend=false,broMat=null,tuftMesh=null,lastBro=null,lushG=null,lushSky=null,lushU={time:{value:0},ps:{value:400}},lushAnim=[],lushHideTufts=false;
var W=null,farG=null,LV=null,levelIdx=0,mY=function(){return 0};
var balls=[],plants=[],drops=[],solids=[],movers=[],crumbles=[],springs=[],hazards=[],enemies=[],checkpoints=[],coins=[],items=[],blades=[],blocks=[],vines=[],pipes=[],extraCoins=0;
var boss=null,flag={geo:null,base:null,mesh:null},coinMesh=null;
function add(o){W.add(o);return o}
function topAt(x){var t=-99;for(var i=0;i<solids.length;i++){var s=solids[i];if(!s.oneway&&!s.flt&&!s.wall&&x>s.l+.3&&x<s.r-.3&&s.t>t)t=s.t}return t}

function disposeLevel(){
  sumEnd=null;
  try{disposeSandSys()}catch(e){}
  [W,farG].forEach(function(g){
    if(!g)return;
    scene.remove(g);
    g.traverse(function(o){if(o.geometry&&o.geometry.dispose)o.geometry.dispose()});
  });
  W=null;farG=null;flag={geo:null,base:null,mesh:null};coinMesh=null;
}
function applyTheme(th){
  curTheme=th;
  if(scene.background&&scene.background.dispose)scene.background.dispose();
  scene.background=skyTex(th.sky);
  scene.environment=ENVS[th.env];
  scene.fog.color.set(th.fog);scene.fog.density=th.fd;
  sun.color.set(th.sun);sun.intensity=th.si*(LITE?.8:1);
  hemi.color.set(th.hemi[0]);hemi.groundColor.set(th.hemi[1]);hemi.intensity=th.hemi[2]+(LITE?.75:0);/* modo leve não tem a luz ambiente do céu: compensa com luz suave, para não ficar duro e saturado */
  lantern.intensity=th.lantern;
  if(gradePass)gradePass.uniforms.exposure.value=th.exp;
  renderer.toneMappingExposure=th.exp/.82*expU();
  snowPts.visible=th.snow;snowPts.material.color.set(th.sandFx?0xf0cf90:(th.petal?0xffb0cc:(th.ash?0x8a7a72:0xffffff)));
  if(th.name==='forest'){
    mY=function(x,z){return -26};
  }else if(th.name==='reef'){
    mY=function(x,z){return -.15+Math.sin(x*.11+z*.2)*.3+(-5-z)*.02};
  }else if(th.name==='ruins'){
    mY=function(x,z){return -.3+Math.sin(x*.045+z*.09)*.55+Math.sin(x*.12-z*.05)*.25+(-5-z)*.045};
  }else if(th.name==='trail'){/* campo verde que desce até o mar perto da praia */
    mY=function(x,z){var d=clamp((-z-5)/40,0,1),n=Math.sin(x*.07+z*.11)*.5+Math.sin(x*.13-z*.05+1.7)*.3+Math.sin(x*.031+z*.17+.5)*.2;
      return 3.4*Math.pow(d,1.3)+n*1.2*(.12+d)-clamp((16-x)/9,0,1)*2.4};
  }else if(th.aurora&&LV.lake){/* Lago da Aurora: o terreno fica baixo embaixo do lago congelado e só sobe na margem lá do fundo */
    var LK=LV.lake;mY=function(x,z){var d=clamp((-z-5)/40,0,1),n=Math.sin(x*.07+z*.11)*.5+Math.sin(x*.13-z*.05+1.7)*.3+Math.sin(x*.031+z*.17+.5)*.2,b=3.4*Math.pow(d,1.3)+n*1.2*(.12+d);
      var e=Math.min(clamp((x-LK[0]+3)/5,0,1),clamp((LK[1]+3-x)/5,0,1))*(1-clamp((-z-38)/9,0,1));return b*(1-e)-1.3*e};
  }else if(th.name==='wreck'){/* Naufrágio: areia perto do caminho que desce para o mar lá atrás (e para a direita, depois da praia) */
    mY=function(x,z){var zz=-z-4+Math.sin(x*.13)*2.5+Math.sin(x*.37)*.8,d=clamp(zz/12,0,1),e=LV.shore!==undefined?clamp((x-LV.shore)/8,0,1):0;var base=.03-(d*d*2.4+e*2.4)+Math.sin(x*.5+z*.7)*.03*(1-d),I=LV.island;if(I){var ix=clamp(Math.min(x-I.x0+3,I.x1+3-x)/5,0,1),iz=clamp((-z-11+Math.sin(x*.3)*1.5)/5,0,1),hi=.78-iz*iz*3;base=Math.max(base,base+(hi-base)*ix*(1-iz*.0))}return base};/* a ilha continua para trás (chão firme até o fundo, depois desce no mar) */
  }else if(th.name==='cave'){
    mY=function(x,z){return -.55+(Math.sin(x*.21+z*.13)*.5+Math.sin(x*.07-z*.31)*.5)*.35+(-5-z)*.02};
  }else{
    mY=function(x,z){
      var d=clamp((-z-5)/40,0,1),n=Math.sin(x*.07+z*.11)*.5+Math.sin(x*.13-z*.05+1.7)*.3+Math.sin(x*.031+z*.17+.5)*.2;
      return 3.4*Math.pow(d,1.3)+n*1.2*(.12+d);
    };
  }
}

/* ---------- construtores de inimigos e objetos ---------- */
function makeBeetle(o){
  o=o||{};
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var shellM=M(o.shell||0x55606b,.42,.35),eyeM=new T.MeshStandardMaterial({color:0x220a00,emissive:0xff7a2a,emissiveIntensity:1.5}),legM=M(0x2a2f35,.8);
  var body=mesh(new T.SphereGeometry(.5,24,16),shellM);body.scale.set(.9,.7,1.25);body.position.y=.42;inner.add(body);
  var ringG=new T.TorusGeometry(1,.06,8,28);
  [-.3,0,.3].forEach(function(z0){
    var k=Math.sqrt(1-Math.pow(z0/.625,2)),ring=mesh(ringG,M(o.ring||0x39414a,.5,.5));
    ring.scale.set(.45*k,.35*k,1);ring.position.set(0,.42,z0);inner.add(ring);
  });
  var head=mesh(new T.SphereGeometry(.26,16,12),legM);head.position.set(0,.34,.68);inner.add(head);
  [-1,1].forEach(function(sd){
    var e=mesh(new T.SphereGeometry(.07,10,8),eyeM);e.position.set(sd*.11,.4,.88);inner.add(e);
    var md=mesh(new T.ConeGeometry(.05,.22,6),legM);md.rotation.x=Math.PI/2;md.position.set(sd*.1,.26,.92);inner.add(md);
  });
  var legs=[],legG=new T.CylinderGeometry(.04,.025,.45,6);legG.translate(0,-.22,0);
  [-.3,0,.3].forEach(function(z0){
    [-1,1].forEach(function(sd){
      var p=new T.Group();p.position.set(sd*.38,.34,z0);p.rotation.z=sd*.9;
      p.add(mesh(legG,legM));inner.add(p);legs.push({p:p,sd:sd,z:z0,base:sd*.9});
    });
  });
  add(g);
  return {g:g,inner:inner,legs:legs,shellM:shellM,legM:legM};
}
function makeWBeetle(){
  var v=makeBeetle({shell:0x7a4aa8,ring:0x4a2a78});
  var wm=new T.MeshStandardMaterial({color:0xcfefff,roughness:.2,transparent:true,opacity:.62,side:T.DoubleSide,emissive:0x5ab8ff,emissiveIntensity:.35,depthWrite:false});
  var wg=new T.SphereGeometry(.5,14,8);v.wings=[];
  [-1,1].forEach(function(sd){
    var p=new T.Group();p.position.set(sd*.2,.8,-.05);v.inner.add(p);
    var w=mesh(wg,wm,false,false);w.scale.set(.95,.03,.36);w.position.x=sd*.42;p.add(w);
    v.wings.push({p:p,sd:sd});
  });
  return v;
}
function makeBat(kind){
  var icy=(kind===true||kind==='ice'),vu=kind==='vult';
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var ash=kind==='ash',bm=M(icy?0xaec8e6:(vu?0x4a3426:(ash?0x2e2626:0x3a2c5a)),.6),wm=icy?M(0x8cc8f0,.3,.1,{side:T.DoubleSide}):M(vu?0x7a5636:(ash?0x5a2418:0x6a4c92),.7,0,{side:T.DoubleSide,emissive:new T.Color(ash?0x3a0a00:0)}),em=new T.MeshStandardMaterial({color:0x221100,emissive:icy?0x66ddff:(ash?0xff6a10:0xffd23a),emissiveIntensity:1.6});
  var body=mesh(new T.SphereGeometry(.24,16,12),bm);body.scale.set(.9,1,.9);inner.add(body);
  [-1,1].forEach(function(sd){
    var e=mesh(new T.SphereGeometry(.045,8,6),em);e.position.set(sd*.09,.06,.2);inner.add(e);
    var ear=mesh(new T.ConeGeometry(.06,.16,6),bm);ear.position.set(sd*.1,.26,0);inner.add(ear);
  });
  var wings=[];
  if(vu){var hd2=mesh(new T.SphereGeometry(.13,10,8),M(0xd49a8a,.7));hd2.position.set(0,.1,.28);inner.add(hd2);var bk=mesh(new T.ConeGeometry(.05,.18,6),M(0x2a2018,.5));bk.rotation.x=Math.PI/2;bk.position.set(0,.06,.46);inner.add(bk)}
  [-1,1].forEach(function(sd){
    var p=new T.Group();p.position.set(sd*.2,.05,0);inner.add(p);
    var w=mesh(new T.BoxGeometry(vu?1.05:.7,.02,vu?.55:.4),wm);w.position.x=sd*(vu?.5:.35);p.add(w);
    wings.push({p:p,sd:sd});
  });
  add(g);
  return {g:g,inner:inner,wings:wings};
}
function makeUrchin(){
  var g=new T.Group(),roll=new T.Group();roll.position.y=.5;g.add(roll);
  var bodyM=M(0x4c5a68,.55,.3),spk=M(0xc9d1d8,.3,.8),eyeM=new T.MeshStandardMaterial({color:0x220000,emissive:0xff3a2a,emissiveIntensity:1.8});
  roll.add(mesh(new T.IcosahedronGeometry(.42,1),bodyM));
  var sg=new T.ConeGeometry(.08,.34,6);sg.translate(0,.17,0);
  var up=new T.Vector3(0,1,0);
  for(var i=0;i<18;i++){
    var y=1-2*(i+.5)/18,r=Math.sqrt(1-y*y),th=i*2.399963,dir=new T.Vector3(Math.cos(th)*r,y,Math.sin(th)*r);
    var s=mesh(sg,spk);s.position.copy(dir).multiplyScalar(.4);s.quaternion.setFromUnitVectors(up,dir);roll.add(s);
  }
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.07,10,8),eyeM);e.position.set(sd*.15,.58,.4);g.add(e)});
  add(g);
  return {g:g,roll:roll,inner:g};
}
function makeWolf(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var fur=M(0xe4ebf3,.85),dk=M(0x8a98aa,.8),nose=M(0x1c2430,.5),eyeM=new T.MeshStandardMaterial({color:0x102030,emissive:0x55ccff,emissiveIntensity:1.7}),legM=M(0xc2cedc,.85);
  var body=mesh(new T.SphereGeometry(.5,22,14),fur);body.scale.set(.62,.62,1.3);body.position.set(0,.62,-.02);inner.add(body);
  var back=mesh(new T.SphereGeometry(.5,18,10),dk);back.scale.set(.5,.3,1.2);back.position.set(0,.88,-.02);inner.add(back);
  var head=mesh(new T.SphereGeometry(.27,18,12),fur);head.position.set(0,.8,.74);inner.add(head);
  var snout=mesh(new T.ConeGeometry(.14,.36,8),fur);snout.rotation.x=Math.PI/2;snout.position.set(0,.74,1.02);inner.add(snout);
  var nz=mesh(new T.SphereGeometry(.055,8,6),nose);nz.position.set(0,.76,1.2);inner.add(nz);
  [-1,1].forEach(function(sd){
    var e=mesh(new T.SphereGeometry(.05,8,6),eyeM);e.position.set(sd*.12,.87,.93);inner.add(e);
    var ear=mesh(new T.ConeGeometry(.08,.22,6),dk);ear.position.set(sd*.14,1.08,.68);ear.rotation.z=-sd*.2;inner.add(ear);
    var fg=mesh(new T.ConeGeometry(.025,.1,5),M(0xffffff,.4));fg.rotation.x=Math.PI;fg.position.set(sd*.06,.66,1.06);inner.add(fg);
  });
  var tail=mesh(new T.ConeGeometry(.12,.55,7),fur);tail.rotation.x=-2.0;tail.position.set(0,.85,-.78);inner.add(tail);
  var legs=[],legG=new T.CylinderGeometry(.075,.05,.5,6);legG.translate(0,-.25,0);
  [.45,-.42].forEach(function(z0){
    [-1,1].forEach(function(sd){
      var q=new T.Group();q.position.set(sd*.2,.5,z0);q.add(mesh(legG,legM));inner.add(q);legs.push({p:q,sd:sd,z:z0,base:0});
    });
  });
  add(g);
  return {g:g,inner:inner,legs:legs,shellM:fur,legM:legM};
}
function makeScorpion(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var sh=M(0xa65e24,.5,.2),dk=M(0x5e3010,.6),eyeM=new T.MeshStandardMaterial({color:0x200000,emissive:0xff3a1a,emissiveIntensity:1.7}),legM=M(0x6e3c16,.7);
  var body=mesh(new T.SphereGeometry(.45,20,12),sh);body.scale.set(.8,.4,1.15);body.position.set(0,.34,-.05);inner.add(body);
  var head=mesh(new T.SphereGeometry(.22,14,10),dk);head.position.set(0,.34,.5);inner.add(head);
  [-1,1].forEach(function(sd){
    var e=mesh(new T.SphereGeometry(.05,8,6),eyeM);e.position.set(sd*.1,.43,.66);inner.add(e);
    var arm=mesh(new T.CylinderGeometry(.06,.07,.42,6),sh);arm.rotation.x=Math.PI/2;arm.position.set(sd*.3,.34,.7);inner.add(arm);
    var cl=mesh(new T.SphereGeometry(.17,10,8),sh);cl.scale.set(.9,.55,1.2);cl.position.set(sd*.34,.34,1.02);inner.add(cl);
    var pin=mesh(new T.ConeGeometry(.07,.2,6),dk);pin.rotation.x=Math.PI/2;pin.position.set(sd*.28,.34,1.2);inner.add(pin);
  });
  var tp=[[0,.5,-.62,.16],[0,.74,-.74,.15],[0,.98,-.64,.14],[0,1.1,-.4,.13],[0,1.02,-.16,.12]];
  tp.forEach(function(q){var t=mesh(new T.SphereGeometry(q[3],10,8),sh);t.position.set(q[0],q[1],q[2]);inner.add(t)});
  var st=mesh(new T.ConeGeometry(.07,.28,6),dk);st.rotation.x=2.3;st.position.set(0,.86,-.02);inner.add(st);
  var legs=[],legG=new T.CylinderGeometry(.035,.025,.4,6);legG.translate(0,-.2,0);
  [-.25,.02,.28].forEach(function(z0){
    [-1,1].forEach(function(sd){
      var q=new T.Group();q.position.set(sd*.34,.3,z0);q.rotation.z=sd*.9;q.add(mesh(legG,legM));inner.add(q);legs.push({p:q,sd:sd,z:z0,base:sd*.9});
    });
  });
  g.scale.setScalar(1.12);
  add(g);
  return {g:g,inner:inner,legs:legs,shellM:sh,legM:legM};
}
function makeTumble(){
  var g=new T.Group(),roll=new T.Group();roll.position.y=.48;g.add(roll);
  var tw=M(0x9a7a44,.9),th=M(0xd8b878,.7),eyeM=new T.MeshStandardMaterial({color:0x200000,emissive:0xff3a1a,emissiveIntensity:1.6});
  var rg=new T.TorusGeometry(.4,.035,6,18);
  [[0,0,0],[Math.PI/2,0,0],[0,Math.PI/2,0],[Math.PI/4,Math.PI/4,0]].forEach(function(r){var m=mesh(rg,tw);m.rotation.set(r[0],r[1],r[2]);roll.add(m)});
  var sg=new T.ConeGeometry(.05,.26,5);sg.translate(0,.13,0);var up=new T.Vector3(0,1,0);
  for(var i=0;i<14;i++){var y=1-2*(i+.5)/14,r=Math.sqrt(1-y*y),a=i*2.399963,dir=new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);var sp=mesh(sg,th);sp.position.copy(dir).multiplyScalar(.4);sp.quaternion.setFromUnitVectors(up,dir);roll.add(sp)}
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.06,8,6),eyeM);e.position.set(sd*.14,.58,.4);g.add(e)});
  add(g);
  return {g:g,roll:roll,inner:g};
}
function makeSnowman(){
  var g=new T.Group(),roll=new T.Group();roll.position.y=.5;g.add(roll);
  var snowC=M(0xf2f7fc,.7),iceC=M(0xa8e2fa,.12,.3),eyeM=new T.MeshStandardMaterial({color:0x101010,emissive:0xff3a2a,emissiveIntensity:1.6});
  roll.add(mesh(new T.IcosahedronGeometry(.44,1),snowC));
  var sg=new T.ConeGeometry(.08,.34,6);sg.translate(0,.17,0);
  var up=new T.Vector3(0,1,0);
  for(var i=0;i<16;i++){
    var y=1-2*(i+.5)/16,r=Math.sqrt(1-y*y),th=i*2.399963,dir=new T.Vector3(Math.cos(th)*r,y,Math.sin(th)*r);
    if(dir.y>.78)continue;
    var sp=mesh(sg,iceC);sp.position.copy(dir).multiplyScalar(.42);sp.quaternion.setFromUnitVectors(up,dir);roll.add(sp);
  }
  var head=mesh(new T.SphereGeometry(.28,18,12),snowC);head.position.y=1.2;g.add(head);
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.05,8,6),eyeM);e.position.set(sd*.11,1.27,.24);g.add(e)});
  var nz=mesh(new T.ConeGeometry(.045,.3,6),M(0xff8a22,.5));nz.rotation.x=Math.PI/2;nz.position.set(0,1.2,.42);g.add(nz);
  var hat=mesh(new T.CylinderGeometry(.18,.2,.24,12),M(0x24262e,.6));hat.position.y=1.58;g.add(hat);
  var brim=mesh(new T.CylinderGeometry(.3,.3,.04,14),M(0x24262e,.6));brim.position.y=1.46;g.add(brim);
  var scarf=mesh(new T.TorusGeometry(.24,.06,8,16),M(0xd8352a,.7));scarf.rotation.x=Math.PI/2;scarf.position.y=.98;g.add(scarf);
  add(g);
  return {g:g,roll:roll,inner:g};
}
function makeFrog(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var gm=M(0x57c43a,.55),bm=M(0xcdf0b0,.6),wh=M(0xffffff,.3),dk=M(0x111111,.3),lp=M(0x2a6a1a,.6);
  var body=mesh(new T.SphereGeometry(.4,20,14),gm);body.scale.set(.95,.78,1.15);body.position.y=.34;inner.add(body);
  var belly=mesh(new T.SphereGeometry(.3,14,10),bm);belly.scale.set(.9,.6,1);belly.position.set(0,.25,.1);inner.add(belly);
  [-1,1].forEach(function(sd){
    var eb=mesh(new T.SphereGeometry(.13,12,10),gm);eb.position.set(sd*.2,.62,.3);inner.add(eb);
    var ew=mesh(new T.SphereGeometry(.09,12,10),wh);ew.position.set(sd*.2,.66,.37);inner.add(ew);
    var pu=mesh(new T.SphereGeometry(.05,10,8),dk);pu.position.set(sd*.2,.67,.45);inner.add(pu);
    var lg=mesh(new T.SphereGeometry(.16,12,10),gm);lg.scale.set(.6,1,1.4);lg.position.set(sd*.4,.18,-.2);inner.add(lg);
    var ft=mesh(new T.SphereGeometry(.1,10,8),gm);ft.position.set(sd*.28,.1,.45);inner.add(ft);
  });
  var mo=mesh(new T.TorusGeometry(.18,.02,6,12,Math.PI),lp);mo.rotation.z=Math.PI;mo.position.set(0,.4,.5);inner.add(mo);
  add(g);
  return {g:g,inner:inner};
}

function makeJelly(){
  var g=new T.Group(),inner=new T.Group();inner.position.y=.55;g.add(inner);
  var bm=new T.MeshStandardMaterial({color:0xd778e8,roughness:.25,transparent:true,opacity:.8,emissive:0x9a3ac0,emissiveIntensity:.7,side:T.DoubleSide,depthWrite:false});
  var bell=mesh(new T.SphereGeometry(.42,20,10,0,Math.PI*2,0,Math.PI*.55),bm,false,false);bell.scale.set(1,.85,1);inner.add(bell);
  var core=mesh(new T.SphereGeometry(.16,12,8),new T.MeshStandardMaterial({color:0xffe6ff,emissive:0xffa0ff,emissiveIntensity:1.4}),false,false);core.position.y=.1;inner.add(core);
  var tm2=M(0xf0a8ff,.4,0,{emissive:new T.Color(0x9a3ac0),emissiveIntensity:.6}),tent=[];
  for(var i=0;i<6;i++){
    var a=i/6*6.283,tg=new T.Group();tg.position.set(Math.cos(a)*.26,-.02,Math.sin(a)*.26);inner.add(tg);
    var c=mesh(new T.CylinderGeometry(.025,.012,.7,5),tm2,false,false);c.position.y=-.35;tg.add(c);tent.push(tg);
  }
  add(g);return {g:g,inner:inner,tent:tent};
}
function makePuffer(){
  var g=new T.Group(),inner=new T.Group();inner.position.y=.4;g.add(inner);
  var bm=M(0xf2b038,.45),bel=M(0xfff2c0,.6),dk=M(0x2a1608,.5),wh=M(0xffffff,.3),sp=M(0xc77a1a,.5),fn=M(0xe88a22,.5,0,{side:T.DoubleSide});
  var body=mesh(new T.SphereGeometry(.36,18,14),bm);body.scale.set(.95,.95,1.15);inner.add(body);
  var belly=mesh(new T.SphereGeometry(.3,14,10),bel);belly.scale.set(.9,.6,1.05);belly.position.set(0,-.12,.04);inner.add(belly);
  [-1,1].forEach(function(sd){
    var ew=mesh(new T.SphereGeometry(.09,10,8),wh);ew.position.set(sd*.2,.1,.3);inner.add(ew);
    var pu=mesh(new T.SphereGeometry(.05,8,6),dk);pu.position.set(sd*.22,.1,.37);inner.add(pu);
    var fin=mesh(new T.ConeGeometry(.12,.2,4),fn);fin.position.set(sd*.36,-.02,-.02);fin.rotation.z=sd*-1.2;inner.add(fin);
  });
  var mo=mesh(new T.SphereGeometry(.06,8,6),dk);mo.position.set(0,-.06,.41);inner.add(mo);
  var tail=new T.Group();tail.position.z=-.4;inner.add(tail);
  var tf=mesh(new T.ConeGeometry(.2,.3,4),fn);tf.rotation.x=-Math.PI/2;tf.position.z=-.15;tf.scale.set(.25,1,1);tail.add(tf);
  var spk=new T.Group();inner.add(spk);
  var sg=new T.ConeGeometry(.05,.24,5);sg.translate(0,.12,0);var up=new T.Vector3(0,1,0);
  for(var i=0;i<22;i++){var y=1-2*(i+.5)/22,r=Math.sqrt(1-y*y),th=i*2.399963,dir=new T.Vector3(Math.cos(th)*r,y,Math.sin(th)*r);
    var c=mesh(sg,sp);c.position.copy(dir).multiplyScalar(.34);c.quaternion.setFromUnitVectors(up,dir);spk.add(c)}
  spk.scale.setScalar(.01);
  add(g);return {g:g,inner:inner,tail:tail,spk:spk};
}
function makeFish(){
  var g=new T.Group(),inner=new T.Group();inner.position.y=.25;g.add(inner);
  var bm=M(0x2f9fe0,.35,.2),bel=M(0xffe08a,.5),fm=M(0xff8a2a,.5,0,{side:T.DoubleSide}),wh=M(0xffffff,.3),dk=M(0x111111,.3);
  var body=mesh(new T.SphereGeometry(.3,16,12),bm);body.scale.set(.55,.9,1.5);inner.add(body);
  var belly=mesh(new T.SphereGeometry(.26,12,8),bel);belly.scale.set(.5,.5,1.35);belly.position.y=-.1;inner.add(belly);
  var tail=new T.Group();tail.position.z=-.42;inner.add(tail);
  var tf=mesh(new T.ConeGeometry(.22,.36,4),fm);tf.rotation.x=-Math.PI/2;tf.position.z=-.18;tf.scale.set(.2,1,1);tail.add(tf);
  var df=mesh(new T.ConeGeometry(.12,.3,4),fm);df.position.set(0,.3,-.05);df.scale.set(.2,1,1.4);inner.add(df);
  [-1,1].forEach(function(sd){
    var ew=mesh(new T.SphereGeometry(.07,10,8),wh);ew.position.set(sd*.16,.1,.38);inner.add(ew);
    var pu=mesh(new T.SphereGeometry(.04,8,6),dk);pu.position.set(sd*.18,.1,.43);inner.add(pu);
  });
  add(g);return {g:g,inner:inner,tail:tail};
}
function makeEel(){
  var g=new T.Group();
  var sk=M(0x6b7d2e,.5),sp=M(0xd9c24a,.5),wh=M(0xffffff,.3),eyeM=new T.MeshStandardMaterial({color:0x220000,emissive:0xff3a2a,emissiveIntensity:1.6});
  var hole=mesh(new T.SphereGeometry(.5,14,10),M(0x05060c,1),false,false);hole.scale.set(.25,.8,1.0);hole.position.set(0,0,.05);g.add(hole);
  var body=mesh(new T.CylinderGeometry(.16,.16,1,10),sk);body.rotation.z=Math.PI/2;g.add(body);
  var head=new T.Group();g.add(head);
  var hs=mesh(new T.SphereGeometry(.24,14,10),sk);hs.scale.set(1.5,.85,.95);head.add(hs);
  var jaw=mesh(new T.SphereGeometry(.2,12,8),sp);jaw.scale.set(1.3,.4,.9);jaw.position.set(.05,-.1,0);head.add(jaw);
  for(var i=0;i<4;i++){var tt=mesh(new T.ConeGeometry(.025,.1,4),wh);tt.rotation.z=Math.PI;tt.position.set(.14+i*.05,-.04,(i%2?.07:-.07));head.add(tt)}
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.045,8,6),eyeM);e.position.set(.1,.1,sd*.16);head.add(e)});
  add(g);return {g:g,body:body,head:head};
}

/* ---------- construção do mundo ---------- */
function buildLevel(idx){
  disposeLevel();trIntro=null;
  levelIdx=idx;LV=(LEVELS[idx].pre&&!prePast[idx])?LEVELS[idx].pre:LEVELS[idx];
  if(typeof autoPick==='function')autoPick(idx);/* Automático: começa na qualidade que já deu certo neste mundo */
  if(typeof spitB!=='undefined')spitB=[];
  if(rig.setOutfit)rig.setOutfit(idx>=11?1:0);/* roupa nova do Kuro na Terra Nova (Mundo 12 em diante) */
  var th=THEMES[LV.theme],m3=MATS[LV.theme];
  applyTheme(th);sandS.flames=null;
  W=new T.Group();scene.add(W);fox=null;P.mount=false;tuftMesh=null;broMat=null;lushPend=false;lastBro=null;lushG=null;lushSky=null;
  debris=[];popCoins=[];dropCoins=[];solids=[];movers=[];crumbles=[];springs=[];hazards=[];enemies=[];checkpoints=[];coins=[];items=[];blades=[];blocks=[];vines=[];pipes=[];plants=[];drops=[];balls=[];airBubs=[];extraCoins=0;boss=null;flames=[];eShots=[];doorObj=null;castleFx.torches=[];castleFx.bolt=null;vilLan=[];ropes=[];pulleys=[];vdoors=[];hLifts=[];hDrafts=[];hFall=null;hFall2=null;hSkyC=null;volSinks=[];volMovers=[];volMet=null;volEsc=null;volFallT=null;volPortal=null;volOut=null;hBirds=[];hSwans=[];alarmT=0;if(alarmEl)alarmEl.style.opacity=0;if(hidS)hidS.visible=false;
  buildPlatforms(m3);
  if(LV.maze)mzBuild();/* Mundo 17: tijolos e concreto do labirinto (antes dos inimigos e das moedas) */
  if(LV.mzPre)mzPreDecor();/* Mundo 17: ruínas da área de fora */
  buildBackdrop(th,m3);
  buildDecor(th);
  buildFar(th);
  if(th.name==='trail'){buildTrailDecor(th);buildTrailFar()}
  buildLush(th);
  if(typeof kuroDry==='function')kuroDry();/* Kuro seco ao começar qualquer fase */
  if(th.aurora)auroraBuild(th);
  if(th.wreck)wkBuild(th);/* Mundo 19: navio encalhado, mar com ondas, chuva e raios *//* Mundo 18: aurora, estrelas, lago, gelo que trinca */
  if(th.falls)buildFalls(th);/* Mundo 16: cachoeiras, rio, castelo lá longe e os Pedrões-totem */
  if(th.name==='ruins')buildRuinsExtra();
  buildHazards();
  buildMovers();
  buildCrumbles();
  buildSprings();
  if(th.name==='village')buildVillageMech();
  if(th.name==='heights')buildHeightsMech();
  buildCollectibles();
  buildBlocks();
  buildPipes();buildPlants();
  if(LV.minePre)buildMinePre();
  buildMarks();
  buildEnemies();
  buildBlades();buildDrops();buildBalls();buildSandSys();buildWater();buildCoral();buildFlames();buildDoor();
  if(th.name==='volcano')buildVolcanoMech();
  if(th.name==='summit')buildSummitMech();
  if(th.name==='trail')buildTrailMech();
  if(LV.boss)buildBoss();
  fixCoins();
  $('coinT').textContent=100;
  splitBig();splitInstQueue();shLiteApply();renderer.shadowMap.needsUpdate=true;
  warmShaders();
  if(cfg.preset==='auto'&&!bench)applyGfx();autoSkip=90;pfW.t=0;pfW.n=0;pfW.good=0;pfW.bad=0;pfW.probe=0;/* espera ~1,5 s depois de montar a fase antes de medir */
}
/* desempenho: blocos grandes do cenário (que cobrem a fase inteira) viram pedaços de 24 de largura, para o celular não desenhar o que está fora da tela.
   Os pedaços usam os mesmos dados (nada é copiado) e o visual fica idêntico. A Vila Ninja fica como está. */
function splitBig(){if(window.__noSplit||!W||LV.theme===7)return;var CW=24,v=new T.Vector3(),list=[];
  W.children.forEach(function(o){if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||o.children.length||!o.visible)return;var g=o.geometry;if(!g||!g.attributes||!g.attributes.position||g.groups.length||g.morphAttributes&&Object.keys(g.morphAttributes).length)return;
    if(!g.boundingBox)g.computeBoundingBox();var bb=g.boundingBox;if((bb.max.x-bb.min.x)*Math.abs(o.scale.x)<60||g.attributes.position.count<2000)return;list.push(o)});
  list.forEach(function(o){var g=o.geometry,pa=g.attributes.position,idx=g.index,nt=idx?idx.count/3:pa.count/3,ch={};o.updateMatrixWorld(true);
    for(var t=0;t<nt;t++){var a=idx?idx.getX(t*3):t*3,b=idx?idx.getX(t*3+1):t*3+1,c=idx?idx.getX(t*3+2):t*3+2;
      v.set((pa.getX(a)+pa.getX(b)+pa.getX(c))/3,(pa.getY(a)+pa.getY(b)+pa.getY(c))/3,(pa.getZ(a)+pa.getZ(b)+pa.getZ(c))/3).applyMatrix4(o.matrixWorld);
      var k=Math.floor(v.x/CW);(ch[k]=ch[k]||[]).push(a,b,c)}
    var keys=Object.keys(ch);if(keys.length<2)return;
    keys.forEach(function(k){var arr=ch[k],g2=new T.BufferGeometry();for(var nm in g.attributes)g2.setAttribute(nm,g.attributes[nm]);
      var big=pa.count>65535;g2.setIndex(new T.BufferAttribute(big?new Uint32Array(arr):new Uint16Array(arr),1));
      var bx=new T.Box3();for(var i=0;i<arr.length;i++){v.set(pa.getX(arr[i]),pa.getY(arr[i]),pa.getZ(arr[i]));bx.expandByPoint(v)}g2.boundingBox=bx;g2.boundingSphere=bx.getBoundingSphere(new T.Sphere());
      var m=new T.Mesh(g2,o.material);m.position.copy(o.position);m.quaternion.copy(o.quaternion);m.scale.copy(o.scale);m.castShadow=o.castShadow;m.receiveShadow=o.receiveShadow;m.renderOrder=o.renderOrder;m.frustumCulled=o.frustumCulled;m.userData=o.userData;W.add(m)});
    W.remove(o)})}
function fixCoins(){
  plants.forEach(function(pl){
    coins.forEach(function(c){
      if(Math.abs(c.x-pl.x)<1.1&&c.y>pl.top-.2&&c.y<pl.top+2.7){c.x=pl.x+(c.x<pl.x?-2.1:2.1);c.y=pl.top+.9-(pl.top>1.5?0:0)}
    });
  });
  /* nenhuma moeda fica colada nos espinhos/corais: só vale pegar no alto do pulo (a 1.7 acima da ponta) */
  coins.forEach(function(c){
    for(var pass=0;pass<3;pass++){
      var hz=null;
      for(var k=0;k<hazards.length;k++){var h=hazards[k];
        if(c.x+.3>h.l&&c.x-.3<h.r&&c.y>h.y0-.5&&c.y<h.t+1.5){hz=h;break}}
      if(!hz)break;
      if(hz.spike){/* espinho: a moeda vai para antes ou depois dele, no chão */
        hz.nm=(hz.nm||0)+1;var side=c.x<(hz.l+hz.r)/2?-1:1,sx=side<0?hz.l-1.4-(hz.nm>>1)*.7:hz.r+1.4+(hz.nm>>1)*.7;
        var gt=null;for(var q2=0;q2<solids.length;q2++){var s3=solids[q2];if(s3.oneway||s3.wall||s3.dead||movers.indexOf(s3)>=0)continue;if(sx>s3.l+.2&&sx<s3.r-.2&&s3.t<=hz.t+.5&&(gt===null||s3.t>gt))gt=s3.t}
        c.x=sx;c.y=(gt===null?hz.y0:gt)+.9;
      }else c.y=hz.t+1.7;
    }
  });
  /* nenhuma moeda fica dentro de plataforma/parede: se cair dentro de um sólido fixo, sobe para cima dele */
  coins.forEach(function(c){
    for(var pass=0;pass<4;pass++){
      var hit=null;
      for(var k=0;k<solids.length;k++){var so=solids[k];
        if(so.oneway)continue;
        var sl=so.l,sr=so.r;
        if(movers.indexOf(so)>=0){sl=so.cx-so.range-so.w/2;sr=so.cx+so.range+so.w/2}/* plataforma móvel: todo o caminho dela */
        if(c.x+.3>sl+.02&&c.x-.3<sr-.02&&c.y+.3>so.b+.02&&c.y-.3<so.t-.02){hit=so;break}}
      if(!hit)break;
      c.y=hit.t+.75;
    }
  });
}
function buildPlatforms(m3){
  if(curTheme.name==='forest'){buildPlatformsForest();return}
  if(curTheme.name==='village'){buildPlatformsVillage(m3);return}
  if(curTheme.name==='volcano'){buildPlatformsVolcano(m3);return}
  if(curTheme.name==='summit'){buildPlatformsSummit(m3);return}
  if(curTheme.name==='trail'){buildPlatformsTrail(m3);return}
  if(curTheme.name==='sky'){buildPlatformsSky();return}
  if(curTheme.name==='tower'){buildPlatformsTower();return}
  if(curTheme.name==='mine'){buildPlatformsMine();return}
  LV.solids.forEach(function(s){
    if(curTheme.wreck&&s[5]&&typeof wkSolid==='function'){wkSolid(s);return}/* Naufrágio: casco do navio, caixotes e tábuas */
    if(curTheme.aurora&&!s[4]&&typeof auSolid==='function'){auSolid(s,m3);return}/* Lago da Aurora: bloco de gelo com neve escorrendo */
    var x0=s[0],x1=s[1],top=s[2],bot=s[3]!==undefined?s[3]:-14,w=x1-x0,cx=(x0+x1)/2;
    var out=s[5]==='out';if(out&&!castleOutDirtM)castleOutDirtM=M(0x4e443c,.97,0,{map:texStone.map});
    /* bloco em cima de outro: a parte de baixo fica escondida dentro do de baixo; corta para as frentes não piscarem */
    var vb=bot;LV.solids.forEach(function(o){if(o!==s&&o[0]<=x0+.01&&o[1]>=x1-.01&&o[2]<top-.3&&o[2]-.32>vb)vb=o[2]-.32});
    var lk=s[4]&&curTheme.aurora;/* Lago da Aurora: o chão liso é uma placa de gelo boiando */
    var body=mesh(boxGeo(w,top-.3-vb,6.8,2.6),lk?iceSlabM:(out?castleOutDirtM:m3.side));body.position.set(cx,(top-.3+vb)/2,-1.6);add(body);
    if(out&&!castlePathM)castlePathM=M(0xd6c4a6,.96,0,{map:texStone.map});
    var lip=mesh(boxGeo(w+(out?0:.14),.34,6.94,2.2),lk?iceSlabM:(out?castlePathM:m3.top));lip.position.set(cx,top-.17,-1.6);add(lip);
    if(s[4]&&curTheme.name==='peaks'){var io=mesh(boxGeo(w+.16,.1,6.96,2.2),iceTopM);io.position.set(cx,top-.03,-1.6);add(io)}
    solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,slip:!!s[4]});
  });
  LV.floats.forEach(function(f){
    if(curTheme.aurora&&typeof auFloe==='function'){auFloe(f);return}/* Lago da Aurora: placa de gelo boiando */
    var w=f[1]-f[0],cx=(f[0]+f[1])/2,m=mesh(boxGeo(w,.5,3,1.5),(curTheme.name==='peaks'&&f[3])?iceSlabM:m3.slab);
    m.position.set(cx,f[2]-.25,0);add(m);
    solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.5,oneway:false,flt:true,slip:!!f[3]});
  });
}
function scaleUV(g,su,sv){var uv=g.attributes.uv;for(var i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*su,uv.getY(i)*sv);return g}
function barkCyl(rt,rb,h,seg){var g=new T.CylinderGeometry(rt,rb,h,seg,1);return scaleUV(g,Math.max(1,(rt+rb)*Math.PI/2.2),Math.max(1,h/2.4))}
var softTex=null;
function softSprite(){
  if(softTex)return softTex;
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.5,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g;x.fillRect(0,0,128,128);softTex=new T.CanvasTexture(c);softTex.encoding=T.sRGBEncoding;return softTex;
}
function buildPlatformsForest(){
  var r=rnd(311),leaves=[],vines=[];
  function leafBlob(x,y,z,sz){leaves.push([x,y,z,sz])}
  function hangVine(x,y,z,len){vines.push([x,y,z,len])}
  LV.solids.forEach(function(s){
    var x0=s[0],x1=s[1],top=s[2],bot=s[3]!==undefined?s[3]:-14,w=x1-x0,cx=(x0+x1)/2,k,H;
    solids.push({l:x0,r:x1,t:top,b:bot,oneway:false,slip:!!s[4]});
    if(w<=4.6){
      var rad=w/2;H=top+30-.4;
      var tr=mesh(barkCyl(rad*.8,rad*1.2,H,12),barkM);tr.position.set(cx,-30+H/2,-.2);add(tr);
      var mound=mesh(new T.SphereGeometry(1,20,10),mossM);mound.scale.set(rad*1.18,.46,rad*1.18);mound.position.set(cx,top-.46,-.2);add(mound);
      for(k=0;k<6;k++){var a=k/6*6.283+r();leafBlob(cx+Math.cos(a)*rad*1.1,top-.3-r()*.5,-.2+Math.sin(a)*rad*1.1,.35+r()*.3)}
      hangVine(cx+(r()-.5)*rad,top-.5,rad*1.0,1.2+r()*1.5);
    }else{
      var body=mesh(new T.CylinderGeometry(.85,.8,w,14),barkM);body.rotation.z=Math.PI/2;body.position.set(cx,top-.85,0);
      scaleUV(body.geometry,w/2.4,2);add(body);
      var moss=mesh(boxGeo(w+.1,.2,3.0,2.2),mossM);moss.position.set(cx,top-.1,0);add(moss);
      var sup=[x0+w*.25,x0+w*.75];
      sup.forEach(function(sx){H=top+30-1;var tt=mesh(barkCyl(.7,1.05,H,10),barkDarkM);tt.position.set(sx,-30+H/2,-.3);add(tt)});
      var n=Math.floor(w*1.2);
      for(k=0;k<n;k++){leafBlob(x0+r()*w,top-.15+(r()-.5)*.2,(r()-.5)*2.6,.25+r()*.3)}
      for(k=0;k<n;k++){leafBlob(x0+r()*w,top-1.0-r()*.5,1.2+r()*.5,.3+r()*.3)}
      for(k=0;k<Math.floor(w/3);k++)hangVine(x0+r()*w,top-1.2,.9,1+r()*1.8);
    }
  });
  LV.floats.forEach(function(f){
    var w=f[1]-f[0],cx=(f[0]+f[1])/2;
    solids.push({l:f[0],r:f[1],t:f[2],b:f[2]-.5,oneway:false,flt:true});
    var br=mesh(new T.CylinderGeometry(.2,.34,w,10),barkM);br.rotation.z=Math.PI/2;br.position.set(cx,f[2]-.3,0);scaleUV(br.geometry,w/2.4,1);add(br);
    var mo=mesh(boxGeo(w*.96,.1,.8,1.5),mossM);mo.position.set(cx,f[2]-.05,0);add(mo);
    var n=Math.floor(w*1.4);
    for(var k=0;k<n;k++)leafBlob(f[0]+r()*w,f[2]-.1+(r()-.4)*.25,(r()-.5)*1.2,.2+r()*.3);
    leafBlob(f[0]-.05,f[2]-.3,0,.4);leafBlob(f[1]+.05,f[2]-.35,0,.3);
    for(k=0;k<Math.floor(w/2);k++)hangVine(f[0]+.3+r()*(w-.6),f[2]-.5,(r()-.5)*.8,.7+r()*1.2);
  });
  var lg=new T.IcosahedronGeometry(1,1),lm=M(0xffffff,.85,0,{flatShading:true});
  var li=inst(lg,lm,Math.max(1,leaves.length),true),d=new T.Object3D(),col=new T.Color();
  leaves.forEach(function(q,i){
    d.position.set(q[0],q[1],q[2]);d.rotation.set(r()*3,r()*6,r()*3);d.scale.set(q[3]*1.3,q[3]*.85,q[3]*1.2);d.updateMatrix();li.setMatrixAt(i,d.matrix);
    li.setColorAt(i,hsl(col,.26+r()*.07,.5,.3+r()*.2));
  });
  add(li);
  var vg=new T.CylinderGeometry(.03,.03,1,5);vg.translate(0,-.5,0);
  var vi=inst(vg,M(0x3f8a2a,.8),Math.max(1,vines.length),false);
  vines.forEach(function(q,i){d.position.set(q[0],q[1],q[2]);d.rotation.set(0,0,0);d.scale.set(1,q[3],1);d.updateMatrix();vi.setMatrixAt(i,d.matrix)});
  add(vi);
  var tipG=new T.IcosahedronGeometry(1,0),ti=inst(tipG,M(0x62c43c,.7,0,{flatShading:true}),Math.max(1,vines.length),false);
  vines.forEach(function(q,i){d.position.set(q[0],q[1]-q[3],q[2]);d.rotation.set(r()*3,r()*6,0);d.scale.set(.16,.22,.1);d.updateMatrix();ti.setMatrixAt(i,d.matrix)});
  add(ti);
}
function buildBackdropForest(th){
  var r=rnd(91),d=new T.Object3D(),col=new T.Color(),i;
  var fl=new T.PlaneGeometry(420,160);fl.rotateX(-Math.PI/2);
  var fm=mesh(fl,M(th.valley,1),false,true);fm.position.set(110,-26,-30);add(fm);
  var tg=new T.CylinderGeometry(1,1.25,1,10);tg.translate(0,.5,0);
  var N=40,trk=inst(tg,M(0xffffff,.95),N,false);
  for(i=0;i<N;i++){
    var x=-30+i*(330/N)+r()*6,z=-9-r()*30,rad=.8+r()*2.2,h=95;
    d.position.set(x,-30,z);d.rotation.set(0,r()*6,0);d.scale.set(rad,h,rad);d.updateMatrix();trk.setMatrixAt(i,d.matrix);
    trk.setColorAt(i,hsl(col,.07+r()*.2,.22+r()*.12,.1+r()*.08));
  }
  add(trk);
  var lg=new T.IcosahedronGeometry(1,1),lm=M(0xffffff,.9,0,{flatShading:true});
  var cn=inst(lg,lm,110,false);
  for(i=0;i<110;i++){
    var x2=-30+r()*340,y2=16+r()*18,z2=-10-r()*26,sz=3.5+r()*5;
    d.position.set(x2,y2,z2);d.rotation.set(0,r()*6,0);d.scale.set(sz*1.4,sz*.7,sz);d.updateMatrix();cn.setMatrixAt(i,d.matrix);
    cn.setColorAt(i,hsl(col,.27+r()*.06,.5,.16+r()*.14));
  }
  add(cn);
  var lw=inst(lg,lm,90,false);
  for(i=0;i<90;i++){
    var x3=-30+r()*340,y3=-8+r()*20,z3=-7-r()*12,sz3=1.4+r()*3.2;
    d.position.set(x3,y3,z3);d.rotation.set(r()*3,r()*6,r()*3);d.scale.set(sz3*1.2,sz3*.8,sz3);d.updateMatrix();lw.setMatrixAt(i,d.matrix);
    lw.setColorAt(i,hsl(col,.3+r()*.05,.45,.12+r()*.14));
  }
  add(lw);
  var hv=new T.CylinderGeometry(.05,.05,1,5);hv.translate(0,-.5,0);
  var hvi=inst(hv,M(0x3a7a28,.8),70,false);
  for(i=0;i<70;i++){
    var x4=-20+r()*320,z4=-6-r()*14,len=3+r()*8;
    d.position.set(x4,26+r()*3,z4);d.rotation.set(0,0,0);d.scale.set(1,len,1);d.updateMatrix();hvi.setMatrixAt(i,d.matrix);
  }
  add(hvi);
  var mt0=softSprite();
  for(i=0;i<16;i++){
    var s=new T.Sprite(new T.SpriteMaterial({map:mt0,transparent:true,opacity:.5,depthWrite:false,color:0xd2f0c8,fog:false}));
    var w2=34+r()*26;s.scale.set(w2,10+r()*6,1);s.position.set(-20+i*20+r()*10,-6-r()*6,-10-r()*16);add(s);
  }
  var bc=document.createElement('canvas');bc.width=32;bc.height=256;var bx=bc.getContext('2d'),bg=bx.createLinearGradient(0,0,0,256);
  bg.addColorStop(0,'rgba(255,248,190,0)');bg.addColorStop(.3,'rgba(255,248,190,.9)');bg.addColorStop(1,'rgba(255,248,190,0)');bx.fillStyle=bg;bx.fillRect(0,0,32,256);
  var bt=new T.CanvasTexture(bc);bt.encoding=T.sRGBEncoding;
  for(i=0;i<12;i++){
    var bm=new T.Sprite(new T.SpriteMaterial({map:bt,transparent:true,opacity:.17,depthWrite:false,blending:T.AdditiveBlending,fog:false,rotation:-.28}));
    bm.scale.set(5+r()*5,46,1);bm.position.set(-10+i*26+r()*10,10,-16-r()*8);add(bm);
  }
}
/* desempenho: um "carimbo" (instanced) que cobre a fase inteira vira um por pedaço de 24 de largura, para o celular pular o que está fora da tela.
   Usa a mesma forma e o mesmo material; cada pedaço sabe o seu tamanho para ser escondido certo. */
function splitInst(im){if(!im||!im.isInstancedMesh||!im.parent||im.count<120)return;var n=im.count,m4=new T.Matrix4(),CW=24,ch={},g=im.geometry,i;
  var xs=[];for(i=0;i<n;i++){im.getMatrixAt(i,m4);xs.push(m4.elements[12])}var mn=Math.min.apply(null,xs),mx=Math.max.apply(null,xs);if(mx-mn<60)return;
  for(i=0;i<n;i++){var k=Math.floor(xs[i]/CW);(ch[k]=ch[k]||[]).push(i)}var keys=Object.keys(ch);if(keys.length<2)return;
  if(!g.boundingSphere)g.computeBoundingSphere();var r0=g.boundingSphere?g.boundingSphere.radius+g.boundingSphere.center.length():1;
  var par=im.parent,pos=par.children.indexOf(im),pv=new T.Vector3(),sv=new T.Vector3(),qv=new T.Quaternion();
  keys.forEach(function(k){var ids=ch[k],c=ids.length,g2=new T.BufferGeometry(),nm;
    for(nm in g.attributes){var a=g.attributes[nm];if(a.isInstancedBufferAttribute){var arr=new a.array.constructor(c*a.itemSize);for(var j=0;j<c;j++)for(var e=0;e<a.itemSize;e++)arr[j*a.itemSize+e]=a.array[ids[j]*a.itemSize+e];g2.setAttribute(nm,new T.InstancedBufferAttribute(arr,a.itemSize))}else g2.setAttribute(nm,a)}
    if(g.index)g2.setIndex(g.index);
    var m=new T.InstancedMesh(g2,im.material,c),bx=new T.Box3(),ms=0;
    for(var j=0;j<c;j++){im.getMatrixAt(ids[j],m4);m.setMatrixAt(j,m4);m4.decompose(pv,qv,sv);bx.expandByPoint(pv);ms=Math.max(ms,sv.x,sv.y,sv.z);if(im.instanceColor){var cl=new T.Color();im.getColorAt(ids[j],cl);m.setColorAt(j,cl)}}
    g2.boundingSphere=bx.getBoundingSphere(new T.Sphere());g2.boundingSphere.radius+=r0*ms+(im.material&&im.material.onBeforeCompile&&im.material.onBeforeCompile.toString().length>40?4:1.5);/* com balanço no shader: folga maior */g2.boundingBox=null;
    m.castShadow=im.castShadow;m.receiveShadow=im.receiveShadow;m.renderOrder=im.renderOrder;m.userData=im.userData;m.visible=im.visible;m.frustumCulled=true;
    m.position.copy(im.position);m.quaternion.copy(im.quaternion);m.scale.copy(im.scale);par.add(m)});
  par.remove(im)}
function splitInstIn(G){if(window.__noSplit||!G||LV.theme===7)return;G.children.slice().forEach(function(o){if(o.isInstancedMesh&&o!==coinMesh&&!(o.position.x||o.position.y||o.position.z))splitInst(o)})}
/* os carimbos soltos na fase só são divididos se ficarem parados (alguns se mexem todo quadro: moedas, cubos do Mundo 13...) */
var splitQ=null;
function splitInstQueue(){splitQ=null;if(window.__noSplit||!W||LV.theme===7)return;var L=[];W.children.forEach(function(o){if(o.isInstancedMesh&&o!==coinMesh&&o.count>=120)L.push({o:o,v:o.instanceMatrix.version,c:o.instanceColor?o.instanceColor.version:-1})});splitQ={n:0,L:L}}
function splitInstTick(){if(!splitQ||state!=='play')return;if(++splitQ.n<45)return;var L=splitQ.L;splitQ=null;
  L.forEach(function(q){var o=q.o;if(!o.parent||o.instanceMatrix.version!==q.v||(o.instanceColor?o.instanceColor.version:-1)!==q.c)return;splitInst(o)})}
