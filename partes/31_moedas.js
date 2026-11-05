/*@@parte:31_moedas.js*/
/* ===== 100 moedas por fase, nos pontos que valem a pena (buracos, perigos, lugares altos) ===== */
function fitCoins(tgt){
  if(coins.length===tgt||!coins.length)return;
  var gs={};
  coins.forEach(function(c){var o=gs[c.g]||(gs[c.g]={id:c.g,cs:[],add:0,kind:c.k});o.cs.push(c)});
  var groups=Object.keys(gs).map(function(k){return gs[k]});
  var en=LV.enemies||[],gm=LV.gems||[];
  function overGap(c){
    for(var k=0;k<solids.length;k++){var so=solids[k];if(so.oneway||so.wall||so.dead)continue;
      if(c.x>so.l-.2&&c.x<so.r+.2&&so.t<=c.y+.3&&so.t>=c.y-4.5)return false}
    return true;
  }
  groups.forEach(function(g){
    var gx=0,gy=0,gap=0;g.cs.forEach(function(c){gx+=c.x;gy+=c.y;if(overGap(c))gap++});
    gx/=g.cs.length;gy/=g.cs.length;
    var sc=4*gap/g.cs.length+(g.kind?1.5:0)+(gy>3.5?1.5:0);
    hazards.forEach(function(h){if(gx>h.l-3&&gx<h.r+3&&gy<h.t+4)sc=Math.max(sc,sc+3)});
    for(var i=0;i<en.length;i++){var e=en[i],a=e.x0,b=e.x1!==undefined?e.x1:e.x0;if(gx>a-2.5&&gx<b+2.5){sc+=2.5;break}}
    for(var j=0;j<gm.length;j++)if(Math.abs(gm[j][0]-gx)<4){sc+=2;break}
    g.sc=sc;
  });
  var total=coins.length,drop=[];
  while(total>tgt){
    var best=null,bv=-1;
    groups.forEach(function(g){if(!g.cs.length)return;var v=g.cs.length/(1+g.sc);if(v>bv){bv=v;best=g}});
    var cs=best.cs.sort(function(a,b){return a.x-b.x}),k=cs.length-1;
    if(cs.length>=3){var md=1e9;for(var i=1;i<cs.length-1;i++){var d=Math.abs(cs[i].x-cs[i-1].x)+Math.abs(cs[i+1].x-cs[i].x);if(d<md){md=d;k=i}}}
    drop.push(cs[k]);cs.splice(k,1);total--;
  }
  var add=[];
  while(total<tgt){
    var bg=null,bs=-1;
    groups.forEach(function(g){var v=g.sc/(1+g.add);if(g.cs.length&&v>bs&&(!LV.coinGap||g.full!==1)){
      if(LV.coinGap&&g.cs.length>1){var gg=0,ss=g.cs.slice().sort(function(a,b){return a.x-b.x});for(var q=0;q<ss.length-1;q++)gg=Math.max(gg,ss[q+1].x-ss[q].x);if(gg<LV.coinGap*2){g.full=1;return}}/* fase com moedas espaçadas: não enche o vão */
      bs=v;bg=g}});
    if(!bg)break;
    var c2=bg.cs.sort(function(a,b){return a.x-b.x}),nc;
    if(c2.length===1)nc={x:c2[0].x+.9,y:c2[0].y,got:false,pop:0,g:c2[0].g,k:c2[0].k};
    else{var gi=0,gmx=-1;for(var q=0;q<c2.length-1;q++){var dd=Math.abs(c2[q+1].x-c2[q].x);if(dd>gmx){gmx=dd;gi=q}}
      nc={x:(c2[gi].x+c2[gi+1].x)/2,y:(c2[gi].y+c2[gi+1].y)/2,got:false,pop:0,g:c2[gi].g,k:c2[gi].k}}
    c2.push(nc);bg.add++;add.push(nc);total++;
  }
  coins=coins.filter(function(c){return drop.indexOf(c)<0}).concat(add);
}
/* corações em blocos: 2 por fase, em pontos estratégicos (uma vez por fase) */
function fitHearts(){
  if(LV._hf||LV.noHeartFit)return;LV._hf=1;
  var L=(LV.goal&&LV.goal.x)||(LV.door&&LV.door.x)||LV.camMax||300;
  var orig=(LV.hearts||[]).slice();LV.hearts=[];
  LV.blocks=(LV.blocks||[]).slice();
  var targets=[L*.35,L*.85],used=[];
  function support(hx,hy){
    if(vines.some(function(v){return Math.abs(v.x-hx)<1.4}))return null;/* longe de escada/cipó (o Kuro subindo bateria a cabeça) */
    /* chão firme e plano embaixo de todo o bloco, sem degrau encostado */
    var cand=[];
    for(var k=0;k<solids.length;k++){var so=solids[k];if(so.oneway||so.wall||so.dead||so.mover||so.crumble||so.lift||so.crk)continue;/* nem cesto-elevador nem gelo que trinca */
      if(so.l<hx+.5&&so.r>hx-.5&&so.t<=hy+.5)cand.push(so)}
    var bestT=null;
    cand.forEach(function(so){if(so.l<=hx-.5+.05&&so.r>=hx+.5-.05&&(bestT===null||so.t>bestT))bestT=so.t});
    if(bestT===null)return null;
    for(var k2=0;k2<solids.length;k2++){var q=solids[k2];if(q.oneway||q.wall||q.dead||q.mover||q.crumble)continue;
      if(q.l<hx+.9&&q.r>hx-.9&&q.t>bestT+.05&&q.b<bestT+4.6)return null}
    for(var k3=0;k3<cand.length;k3++)if(cand[k3].t>bestT+.05)return null;
    return bestT;
  }
  var minGap=4;
  function okAt(x,t){
    if(LV.xMax!==undefined&&(x<(LV.xMin||0)+.8||x>LV.xMax-.8))return false;/* fase estreita: o bloco não pode ficar fora da área onde o Kuro anda */
    for(var i=0;i<hazards.length;i++){var h=hazards[i];if(x>h.l-.8&&x<h.r+.8)return false}
    for(var j=0;j<LV.blocks.length;j++){var b=LV.blocks[j];if(Math.abs(b.x-x)<minGap)return false}
    for(var pc=0;pc<(LV.pipes||[]).length;pc++)if(Math.abs(LV.pipes[pc].x-x)<2.6)return false;
    for(var cc=0;cc<(LV.checkpoints||[]).length;cc++)if(Math.abs(LV.checkpoints[cc][0]-x)<2.2)return false;
    for(var q=0;q<used.length;q++)if(Math.abs(used[q]-x)<8)return false;
    return true;
  }
  targets.forEach(function(tx){
    var pick=null,bd=1e9;
    orig.forEach(function(h){if(used.indexOf(h[0])>=0)return;var d=Math.abs(h[0]-tx);if(d<bd){bd=d;pick=h}});
    var hx,hy;
    if(pick&&bd<L*.2){hx=pick[0];hy=pick[1]}
    else{var cp=null,cd=1e9;(LV.checkpoints||[]).forEach(function(c){var d=Math.abs(c[0]-tx);if(d<cd){cd=d;cp=c}});
      if(cp){hx=cp[0]+2.5;hy=cp[1]-1.5}else{hx=tx;hy=0}}
    var placed=false;
    [4,2.6,2].forEach(function(mg){
      if(placed)return;minGap=mg;
      for(var off=0;off<=30&&!placed;off+=.5){
        [0,1,-1].forEach(function(sg){if(placed)return;var x=hx+off*sg,t=support(x,hy+1.5);
          if(t!==null&&okAt(x,t)){LV.blocks.push({x:Math.round(x*2)/2,y:t+2.4,t:'q',c:'heart'}/* mesma altura dos outros blocos (dono, 31/10) */);used.push(x);placed=true}});
      }
    });
  });
}
function buildCollectibles(){
  var gid=0,gkind=0;
  function row(x0,x1,y,n){for(var i=0;i<n;i++)coins.push({x:n===1?x0:lerp(x0,x1,i/(n-1)),y:y,got:false,pop:0,g:gid,k:gkind})}
  function arc(cx,by,hw,h,n){for(var i=0;i<n;i++){var u=n===1?.5:i/(n-1);coins.push({x:cx-hw+2*hw*u,y:by+Math.sin(u*Math.PI)*h,got:false,pop:0,g:gid,k:gkind})}}
  fitHearts();
  LV.coins.forEach(function(c){gid++;if(c[0]==='r'){gkind=0;row(c[1],c[2],c[3],c[4])}else{gkind=1;arc(c[1],c[2],c[3],c[4],c[5])}});
  /* plataformas que desmoronam: não dá tempo de pegar várias moedas; fica só a mais alta, no meio da plataforma */
  crumbles.forEach(function(cr){
    var mid=(cr.l+cr.r)/2,on=[];
    coins.forEach(function(c){if(c.x>=cr.l-.6&&c.x<=cr.r+.6&&c.y>=cr.t-.3&&c.y<=cr.t+3.5)on.push(c)});
    if(!on.length)return;
    var best=on[0];
    on.forEach(function(c){if(c.y>best.y+.01||(Math.abs(c.y-best.y)<=.01&&Math.abs(c.x-mid)<Math.abs(best.x-mid)))best=c});
    best.x=mid;
    coins=coins.filter(function(c){return on.indexOf(c)<0||c===best});
  });
  /* nada de moeda depois da linha de chegada (exceto salas bônus alcançadas por cano) */
  var endX=(LV.goal&&LV.goal.x)||(LV.door&&LV.door.x)||1e9;
  function pastEnd(c){
    if(c.x<=endX+.3)return false;
    var pp=LV.pipes||[];for(var q=0;q<pp.length;q++)if(pp[q].to&&pp[q].to.x!==undefined&&c.x>pp[q].to.x-6)return false;
    return true;
  }
  coins=coins.filter(function(c){return !pastEnd(c)});
  fitCoins(LV.coinN||50);
  coins.forEach(function(c){if(pastEnd(c)){c.x=endX-.6-Math.random()*.01}});
  var cg=new T.CylinderGeometry(.32,.32,.07,24);cg.rotateX(Math.PI/2);
  coinMesh=inst(cg,M(0xffc43a,.22,.95,{emissive:new T.Color(0x6a4300),emissiveIntensity:.6}),Math.max(1,coins.length),true);
  coinMesh.count=coins.length;add(coinMesh);
  (LV.gems||[]).forEach(function(p){items.push(mkItem('gem',p[0],p[1]))});
  (LV.hearts||[]).forEach(function(p){items.push(mkItem('heart',p[0],p[1]))});
  (LV.feathers||[]).forEach(function(p){items.push(mkItem('feather',p[0],p[1]))});
}
var heartGeo=(function(){
  var s=new T.Shape();s.moveTo(0,-.35);s.bezierCurveTo(-.55,.05,-.35,.5,0,.22);s.bezierCurveTo(.35,.5,.55,.05,0,-.35);
  var g=new T.ExtrudeGeometry(s,{depth:.14,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:2,curveSegments:10});
  g.center();return g;
})();
var dark0=new T.MeshStandardMaterial({color:0x151010,roughness:.3});
/* pena dourada detalhada: lâmina desenhada (fios, rachas, brilho) num plano curvado, haste afinando e brilho em volta */
var featherTexC=null,featherGeoC=null;
function featherTex(){
  if(featherTexC)return featherTexC;
  var W=128,H=384,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
  var sd=19;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  function vane(sd2){/* contorno de um lado da pena */
    x.beginPath();x.moveTo(64,H-40);
    for(var i=0;i<=40;i++){var t=i/40,y=H-40-t*(H-60),w=54*Math.pow(Math.sin(Math.min(t,.999)*Math.PI),.55)*(.5+.5*t);
      var cut=(Math.floor(t*7)%2===0&&t>.12&&t<.92)?Math.max(0,1-Math.abs(((t*7)%1)-.5)*6)*14:0;x.lineTo(64+sd2*(w-cut),y)}
    x.lineTo(64,18);x.closePath()}
  [-1,1].forEach(function(sd2){
    vane(sd2);var g=x.createLinearGradient(64,0,64+sd2*60,0);g.addColorStop(0,'#ffe680');g.addColorStop(.3,'#ffb820');g.addColorStop(.7,'#e88a08');g.addColorStop(1,'#b05a00');x.fillStyle=g;x.fill();
    x.save();vane(sd2);x.clip();
    /* fios da pena (barbas) saindo da haste em diagonal */
    for(var y=28;y<H-40;y+=2.2){var a=-.95+(r()-.5)*.08,len=70;x.strokeStyle='rgba(255,'+Math.round(200+r()*55)+','+Math.round(90+r()*90)+','+(.25+r()*.35)+')';x.lineWidth=.8;
      x.beginPath();x.moveTo(64,y);x.lineTo(64+sd2*Math.cos(a)*len,y+Math.sin(a)*len*-1*-1-len*.55);x.stroke();
      if(r()<.35){x.strokeStyle='rgba(150,80,0,.25)';x.beginPath();x.moveTo(64+sd2*2,y+1);x.lineTo(64+sd2*Math.cos(a)*len,y+1-len*.55);x.stroke()}}
    /* brilho de luz numa faixa */
    var hl=x.createLinearGradient(0,0,0,H);hl.addColorStop(.15,'rgba(255,255,220,0)');hl.addColorStop(.38,'rgba(255,255,220,.45)');hl.addColorStop(.55,'rgba(255,255,220,0)');x.fillStyle=hl;x.fillRect(sd2<0?0:64,0,64,H);
    /* rachas mais escuras entre os tufos */
    for(var k=0;k<6;k++){var yy=60+k*42+r()*14;x.strokeStyle='rgba(120,60,0,.55)';x.lineWidth=1.6;x.beginPath();x.moveTo(64+sd2*6,yy);x.quadraticCurveTo(64+sd2*30,yy-22,64+sd2*58,yy-30);x.stroke()}
    x.restore()});
  /* penugem na base */
  for(var i=0;i<40;i++){x.strokeStyle='rgba(255,'+Math.round(190+r()*50)+',80,'+(.4+r()*.4)+')';x.lineWidth=1;var bx=64+(r()-.5)*10,by=H-44-r()*30;x.beginPath();x.moveTo(bx,by);x.lineTo(bx+(r()-.5)*40,by-10-r()*30);x.stroke()}
  featherTexC=new T.CanvasTexture(c);featherTexC.encoding=T.sRGBEncoding;featherTexC.anisotropy=4;return featherTexC;
}
/* cogumelo caprichado: chapéu redondo vermelho com borda grossa, bolinhas brancas achatadas, lamelas por baixo e pé rosado */
var mushGeoC=null;
function mushroomModel(){
  if(!mushGeoC){
    var pts=[];for(var i=0;i<=24;i++){var t=i/24,a=t*Math.PI*.5;pts.push(new T.Vector2(Math.sin(a)*.44*(1+.06*Math.sin(t*Math.PI)),Math.cos(a)*.42))}
    pts.push(new T.Vector2(.47,-.02),new T.Vector2(.44,-.07),new T.Vector2(.36,-.06));pts.reverse();
    var cap=new T.LatheGeometry(pts,32);
    var sp=[],r=rnd(77);
    var dirs=[[.1,1,.1,.075],[.55,.55,.55,.085],[-.6,.6,.35,.075],[.1,.35,.95,.1],[-.85,.3,-.1,.07],[.9,.3,-.15,.08],[-.25,.45,-.85,.08],[.55,.45,-.65,.07],[-.55,.15,.8,.065],[.75,.1,.6,.06]];
    dirs.forEach(function(d){var v=new T.Vector3(d[0],d[1],d[2]).normalize(),k=1/Math.sqrt(Math.pow(v.x/.44,2)+Math.pow(v.y/.42,2)+Math.pow(v.z/.44,2)),px=v.x*k,py=v.y*k,pz=v.z*k,n=new T.Vector3(px/.1936,py/.1764,pz/.1936).normalize();
      var g=new T.CylinderGeometry(d[3],d[3]*1.02,.03,20);var q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),n);
      var o=new T.Object3D();var bl=1+.06*Math.sin(Math.acos(Math.max(-1,Math.min(1,v.y)))*2/Math.PI*Math.PI);o.position.set(px*bl+n.x*.006,py+n.y*.006,pz*bl+n.z*.006);o.quaternion.copy(q);o.updateMatrix();g.applyMatrix4(o.matrix);sp.push({g:g})});
    var gl=new T.CylinderGeometry(.36,.2,.05,28,1,true);gl.translate(0,-.06,0);
    var stP=[new T.Vector2(0,-.04),new T.Vector2(.16,-.04),new T.Vector2(.17,-.12),new T.Vector2(.2,-.26),new T.Vector2(.22,-.34),new T.Vector2(.19,-.38),new T.Vector2(0,-.38)];
    mushGeoC={cap:cap,spots:mergeG(sp),gills:gl,stem:new T.LatheGeometry(stP,24)};
  }
  var m=new T.Group(),G=mushGeoC;
  var cm=new T.MeshStandardMaterial({color:0xd81a0c,roughness:.36,emissive:0x3a0400,emissiveIntensity:.3});
  var c=mesh(G.cap,cm,true,false);m.add(c);
  m.add(mesh(G.spots,new T.MeshStandardMaterial({color:0xf2f0ee,roughness:.55}),false,false));
  m.add(mesh(G.gills,new T.MeshStandardMaterial({color:0x8a3a2a,roughness:.8,side:T.DoubleSide}),false,false));
  m.add(mesh(G.stem,new T.MeshStandardMaterial({color:0xeec4b6,roughness:.6}),true,false));
  var inner=new T.Group();inner.add.apply(inner,m.children.slice());inner.position.y=.38;m.add(inner);
  m.scale.setScalar(.95);return m;
}
function featherModel(){
  var m=new T.Group(),tex=featherTex();
  if(!featherGeoC){var g=new T.PlaneGeometry(.5,1.5,6,16),ps=g.attributes.position;
    for(var i=0;i<ps.count;i++){var x=ps.getX(i),y=ps.getY(i),t=(y+.75)/1.5;ps.setZ(i,-Math.abs(x)*.18+Math.sin(t*Math.PI)*.1-t*t*.12);ps.setX(i,x+t*t*.08)}
    g.computeVertexNormals();featherGeoC=g}
  var vm=new T.MeshStandardMaterial({map:tex,color:0xffd890,transparent:true,alphaTest:.25,side:T.DoubleSide,roughness:.42,metalness:.12,emissive:0xff8a00,emissiveMap:tex,emissiveIntensity:.28});
  var vane=mesh(featherGeoC,vm,false,false);vane.position.y=.08;m.add(vane);
  /* haste dourada afinando, com ponta e brilho na ponta */
  var qm=new T.MeshStandardMaterial({color:0xffc84a,roughness:.2,metalness:.85,emissive:0xb06000,emissiveIntensity:.5});
  var q1=mesh(new T.CylinderGeometry(.008,.026,1.15,8),qm,false,false);q1.position.set(.03,.02,.03);q1.rotation.z=-.05;m.add(q1);
  var q2=mesh(new T.ConeGeometry(.03,.18,8),qm,false,false);q2.rotation.z=Math.PI;q2.position.set(-.005,-.66,-.04);m.add(q2);
  var tip=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xfff0b0,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));tip.scale.set(.18,.18,1);tip.position.set(-.01,-.72,0);m.add(tip);
  var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffb020,transparent:true,opacity:.3,blending:T.AdditiveBlending,depthWrite:false}));gl.scale.set(1.5,1.9,1);m.add(gl);
  m.rotation.z=-.65;m.scale.setScalar(.85);return m;
}
function mkItem(type,x,y){
  var m;
  if(type==='gem'){
    var g=new T.OctahedronGeometry(.36);g.scale(1,1.45,1);
    m=mesh(g,new T.MeshStandardMaterial({color:0x6fe4ff,roughness:.15,metalness:.3,emissive:0x1aa6d8,emissiveIntensity:1.1}),false,false);
  }else if(type==='heart'){
    m=mesh(heartGeo,new T.MeshStandardMaterial({color:0xff4a5e,roughness:.3,emissive:0xb0102a,emissiveIntensity:.8}),false,false);
  }else if(type==='feather'){
    m=featherModel();
  }else if(type==='mushroom'){
    m=mushroomModel();
  }else if(type==='flower'){
    m=new T.Group();
    var fst=mesh(new T.CylinderGeometry(.04,.05,.42,8),new T.MeshStandardMaterial({color:0x3f9a2e,roughness:.6}),false,false);fst.position.y=.21;m.add(fst);
    var lfm=new T.MeshStandardMaterial({color:0x4fbf3a,roughness:.6});
    [-1,1].forEach(function(sd){var l2=mesh(new T.SphereGeometry(.1,10,8),lfm,false,false);l2.scale.set(1.7,.3,1);l2.position.set(sd*.13,.14,0);l2.rotation.z=sd*.5;m.add(l2)});
    var ptm=new T.MeshStandardMaterial({color:0xff6a1f,roughness:.35,emissive:0xff3a00,emissiveIntensity:.9});
    for(var pi=0;pi<7;pi++){var a=pi/7*6.283,pt2=mesh(new T.SphereGeometry(.13,10,8),ptm,false,false);pt2.scale.set(1,1,.45);pt2.position.set(Math.cos(a)*.2,.56+Math.sin(a)*.2,0);m.add(pt2)}
    var ctm=mesh(new T.SphereGeometry(.12,12,10),new T.MeshStandardMaterial({color:0xfff2a0,roughness:.3,emissive:0xffd23a,emissiveIntensity:1.2}),false,false);ctm.position.set(0,.56,.05);m.add(ctm);
  }else if(type==='fruit'){
    m=new T.Group();
    var shO=new T.Shape();shO.moveTo(-.34,.4);shO.lineTo(.34,.4);shO.lineTo(.34,.06);shO.bezierCurveTo(.34,-.2,.16,-.4,0,-.5);shO.bezierCurveTo(-.16,-.4,-.34,-.2,-.34,.06);shO.lineTo(-.34,.4);
    var shI=new T.Shape();shI.moveTo(-.25,.31);shI.lineTo(.25,.31);shI.lineTo(.25,.07);shI.bezierCurveTo(.25,-.14,.12,-.3,0,-.38);shI.bezierCurveTo(-.12,-.3,-.25,-.14,-.25,.07);shI.lineTo(-.25,.31);
    var sgo=new T.ExtrudeGeometry(shO,{depth:.1,bevelEnabled:true,bevelThickness:.03,bevelSize:.03,bevelSegments:2,curveSegments:12});sgo.translate(0,0,-.05);
    var sgi=new T.ExtrudeGeometry(shI,{depth:.06,bevelEnabled:true,bevelThickness:.02,bevelSize:.015,bevelSegments:2,curveSegments:12});sgi.translate(0,0,.04);
    m.add(mesh(sgo,new T.MeshStandardMaterial({color:0xffd54a,roughness:.3,metalness:.5,emissive:0xb07a00,emissiveIntensity:.6}),false,false));
    m.add(mesh(sgi,new T.MeshStandardMaterial({color:0x2f9bff,roughness:.25,metalness:.2,emissive:0x1068d8,emissiveIntensity:.9}),false,false));
    var crs=new T.MeshStandardMaterial({color:0xfff2c0,roughness:.3,emissive:0xffe08a,emissiveIntensity:.8});
    var dm=mesh(new T.BoxGeometry(.2,.2,.05),crs,false,false);dm.position.set(0,.04,.12);dm.rotation.z=Math.PI/4;m.add(dm);
    m.scale.setScalar(1.15);
  }else{
    var cgm=new T.OctahedronGeometry(.8);cgm.scale(1,1.4,1);
    m=mesh(cgm,new T.MeshStandardMaterial({color:0xbff3ff,roughness:.1,metalness:.3,emissive:0x3ac8ff,emissiveIntensity:1.6}),false,false);
  }
  m.position.set(x,y,0);add(m);
  return {type:type,x:x,y:y,got:false,mesh:m};
}
function buildMarks(){
  var postM=M(0x59606a,.5,.7);
  LV.checkpoints.forEach(function(c){
    var g=new T.Group(),post=mesh(new T.CylinderGeometry(.06,.08,2.2,8),postM);post.position.y=1.1;g.add(post);
    var lampMat=new T.MeshStandardMaterial({color:0x3b4148,roughness:.4,emissive:0xffb347,emissiveIntensity:0});
    var lamp=mesh(new T.SphereGeometry(.2,16,12),lampMat);lamp.position.y=2.35;g.add(lamp);
    g.position.set(c[0],c[1],-.6);add(g);
    checkpoints.push({x:c[0],y:c[1],lit:false,mat:lampMat});
  });
  if(LV.goal&&(!LV.crystalGoal||LV.goalFlag)){/* goalFlag: bandeira só de enfeite (a fase termina de outro jeito) */
    var gx=LV.goal.x,gt=LV.goal.top,gz=LV.goal.z!==undefined?LV.goal.z:-.4;
    var pole=mesh(new T.CylinderGeometry(.07,.09,6,10),M(0xc9d1d8,.3,.9));pole.position.set(gx,gt+3,gz);add(pole);
    var fin=mesh(new T.SphereGeometry(.18,16,12),M(0xffc43a,.25,.9,{emissive:new T.Color(0x6a4300),emissiveIntensity:.5}));fin.position.set(gx,gt+6.1,gz);add(fin);
    var fg=new T.PlaneGeometry(2.1,1.3,16,8);
    flag.geo=fg;flag.base=fg.attributes.position.array.slice();
    var fm=mesh(fg,M(0xe0482a,.8,0,{side:T.DoubleSide}));fm.position.set(gx+1.05,gt+5.2,gz);add(fm);
    flag.mesh=fm;flag.parts=[pole,fin,fm];
  }
}
var alertTex=null;
function makeAlertSprite(){
  if(!alertTex){
    var c=document.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d');
    x.fillStyle='#ff4a3a';x.beginPath();x.arc(32,32,28,0,6.283);x.fill();x.lineWidth=4;x.strokeStyle='#fff';x.stroke();
    x.fillStyle='#fff';x.font='bold 44px Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('!',32,35);
    alertTex=new T.CanvasTexture(c);alertTex.encoding=T.sRGBEncoding;
  }
  var sp=new T.Sprite(new T.SpriteMaterial({map:alertTex,transparent:true,depthTest:false,fog:false}));
  sp.visible=false;sp.scale.set(.55,.55,1);sp.renderOrder=10;add(sp);return sp;
}
function buildEnemies(){
  gSpears=[];
  /* regra: todo bloco da peninha tem uma tartaruga guerreira voadora de guarda (território em volta do bloco) */
  var EN=LV.enemies.slice();(LV.blocks||[]).forEach(function(b){if(b.c==='feather'&&b.t==='q')EN.push({t:'tguard',x0:b.x-5,x1:b.x+5,y:b.y+2.6,s:1.2,amp:.35,bx:b.x,by:b.y})});
  EN.forEach(function(e,i){
    var t=e.t||'beetle',nin=t==='ninja',vil=curTheme.name==='village';if(nin)t='frog';
    (LV.pipes||[]).forEach(function(q){if(!q.entry)return;
      if(e.y<=q.base+.5&&e.x0>q.x-2.6&&e.x0<q.x+2.6){var nx=q.x+2.6;e.x0=nx;if(e.x1<nx+2)e.x1=nx+2}
      /* voadores baixos não passam por cima do cano de chegada */
      else if(e.y>q.base+.5&&e.y<q.top+3.5&&e.x0<q.x+2.6&&e.x1>q.x-2.6){if((e.x0+e.x1)/2>=q.x){e.x0=q.x+2.6;if(e.x1<e.x0+3)e.x1=e.x0+3}else{e.x1=q.x-2.6;if(e.x0>e.x1-3)e.x0=e.x1-3}}
    });
    var o={type:t,x0:e.x0,x1:e.x1,y:e.y,base:e.y,by:e.y,hx:(e.x0+e.x1)/2,sz:false,fg:true,speed:(e.s||1.6)*(LV.es||1),x:e.x0,dir:1,alive:true,deadT:0,ph:i*1.7,w:.5,h:.85,stomp:true,vy:0,vx:0,hop:1+i*.2,land:0,vis:null,st:'patrol',alertT:0,loseT:0,cur:(e.s||1.6)*(LV.es||1),bvx:0,bvy:0};
    var ice6=curTheme.name==='peaks',des7=curTheme.name==='ruins';
    var vol=curTheme.name==='volcano';
    var sum11=curTheme.name==='summit';
    if(t==='beetle'&&sum11)o.vis=makeGoat();
    else if(t==='bat'&&sum11){o.vis=makeSnowCrow();o.w=.4;o.h=.55}
    else if(t==='beetle'&&curTheme.wreck)o.vis=makeCrab();
    else if(t==='bat'&&curTheme.wreck){o.vis=makeGull();o.w=.45;o.h=.5}
    else if(t==='beetle')o.vis=vol?makeSalamander():vil?makeCat():(ice6?makeWolf():(des7?makeScorpion():makeBeetle()));
    else if(t==='guard'){o.vis=makeGuard();o.w=.4;o.h=1.55}
    else if(t==='golem'){o.vis=makeGolem();o.stomp=false;o.w=.6;o.h=1.9;o.speed*=.7;o.cur=o.speed}
    else if(t==='lavab'){o.vis=makeLavaBall();o.stomp=false;o.w=.4;o.h=.7;o.speed=0;o.x=e.x0;o.tmr=0;o.ph=e.ph||0;o.jv=e.jv;o.cyc=e.cyc;o.noHit=true;o.vis.g.visible=false}
    else if(t==='urchin'){o.vis=ice6?makeSnowman():(des7?makeTumble():makeUrchin());o.stomp=false;o.h=ice6?1.3:(des7?.95:.9);o.speed*=.75;o.cur=o.speed}
    else if(t==='frog'){o.vis=nin?makeNinja():makeFrog();o.w=.45;o.h=nin?1.25:.75;o.speed=0;o.x=(e.x0+e.x1)/2;if(nin){o.ninja=true;o.w=.4}}
    else if(t==='spit'){o.vis=makeSpitter();o.stomp=false;o.w=.45;o.h=1.4;o.speed=0;o.x=(e.x0+e.x1)/2}
    else if(t==='bat'){o.vis=vil?makeCrow():(curTheme.name==='heights'?makeBird():makeBat(ice6?'ice':(des7?'vult':(curTheme.name==='volcano'?'ash':false))));o.w=des7?.5:.4;o.h=.55}
    else if(t==='turtle'||t==='tchase'||t==='tshell'||t==='tguard'){o.vis=makeTurtle(t,e.moss);o.w=.55;o.h=.8;o.amp=e.amp||.4;if(t==='tchase'){o.speed=0;o.x=(e.x0+e.x1)/2}if(t==='tguard'){o.x=e.bx;o.hx=e.bx;o.by0=e.y;o.terr=[e.x0-1,e.x1+1,e.by-3,e.by+6];o.wings=true}}
    else if(t==='dfly'){o.vis=makeDfly();o.w=.5;o.h=.45;o.speed=(e.s||1.6)}
    else if(t==='wrob'){o.vis=makeWrob();o.w=.42;o.h=1.25;o.speed=(e.s||1.2);o.off=0}
    else if(t==='worm'){o.vis=makeWorm();o.w=.4;o.h=.7;o.speed=0;o.mt=-(e.ph||0);o.ph0=e.ph||0;o.dir=1;o.out=0;o.hgt=e.hgt||3.2;o.wait=e.wait||1.7;o.air=e.air||1.35;o.noHit=true}
    else if(t==='armad'){o.vis=makeArmad();o.stomp=false;o.w=.45;o.h=.75;o.st2='bur';o.at=0;o.x=e.x!==undefined?e.x:(e.x0+e.x1)/2;o.hx0=o.x;o.speed=0}
    else if(t==='sprout'){o.vis=makeSprout();o.stomp=false;o.w=.38;o.h=1.75;o.x=e.x0;o.ph=e.ph||0;o.pr=o.ph;o.len=0;o.speed=0;o.noHit=true}
    else if(t==='jfish'){o.vis=makeJFish();o.water=1;o.base=LV.riverY!==undefined?LV.riverY:-2.4;o.w=.42;o.h=.6;o.speed=0;o.mt=-(e.ph||0);o.ph0=e.ph||0;o.dir=1;o.out=0;o.hgt=e.hgt||6;o.wait=e.wait||1.6;o.air=e.air||1.5;o.noHit=true}
    else if(t==='owl'){o.vis=makeOwl(!!curTheme.aurora);o.w=.42;o.h=.75;o.hx=e.x!==undefined?e.x:(e.x0+e.x1)/2;o.hy=e.y;o.x=o.hx;o.st2='perch';o.speed=0;o.cool=0}
    else if(t==='bee'){o.vis=makeBees();o.w=.5;o.h=.6;o.speed=(e.s||1.4);o.mt=e.ph||0;o.by=e.y;o.cy=e.y;o.px=(e.x0+e.x1)/2;o.x=o.px}
    else if(t==='mole'){o.vis=makeMole();o.w=.45;o.h=.95;o.speed=.9;o.pop=0;o.mt=0}
    else if(t==='sbird'){o.vis=makeSBird();o.w=.4;o.h=.55;o.speed=(e.s||1.5);o.hy=e.y;o.st2='fly';o.cool=1+(e.ph||0);o.x=(e.x0+e.x1)/2;o.dir=1}
    else if(t==='peng'){o.vis=makePeng();o.w=.42;o.h=.95;o.speed=1.1;o.slide=0;o.mt=e.ph||0;o.x=(e.x0+e.x1)/2}
    else if(t==='seal'){o.vis=makeSeal();o.w=.42;o.h=.95;o.speed=0;o.x=e.x0;o.hx=e.x0;o.pop=0;o.mt=0;o.ph=e.ph||0;o.noHit=true;o.safe=true}
    else if(t==='moth'){o.vis=makeMoth();o.w=.5;o.h=.5;o.route=e.route;o.ri=0;o.sit=0;o.speed=(e.s||1.5)}
    else if(t==='wbeetle'){o.vis=makeWBeetle();o.w=.5;o.h=.85;o.amp=e.amp||.55}
    else if(t==='jelly'){o.vis=makeJelly();o.stomp=false;o.w=.5;o.h=.95;o.amp=e.amp||1.4}
    else if(t==='puffer'){o.vis=makePuffer();o.stomp=false;o.w=.5;o.h=.7;o.amp=e.amp||.4;o.infl=0}
    else if(t==='fish'){o.vis=makeFish();o.w=.45;o.h=.5;o.amp=e.amp||.3}
    else if(t==='eel'){o.vis=makeEel();o.stomp=false;o.w=.45;o.h=.5;o.speed=0;o.edir=e.dir||1;o.reach=e.reach||2.6;o.cyc=e.cyc||3.6;o.len=.3;o.tmr=0;if(e.ph!==undefined)o.ph=e.ph}
    else if(t==='skel'){o.vis=makeSkel();o.w=.38;o.h=1.35;o.bones=false;o.bt=0;o.rise=0;o.bAge=0}
    else if(t==='witch'){o.vis=makeWitch();o.w=.45;o.h=1.0;o.amp=e.amp||.5;o.fireT=1.4;o.charging=false;o.chT=0;o.n=0}
    if(e.trig!==undefined){o.trig=e.trig;o.dorm=true;o.noHit=true;o.vis.g.visible=false}
    o.t0=t;if(t==='beetle'||t==='urchin'||t==='skel'||t==='frog'||t==='guard'||t==='golem'){terrExtent(o);if(LV.gears){o.tl=e.x0;o.tr=e.x1;o.tw=[e.x0,e.x1]}/* torre: o sapo fica na sua viga (as tábuas das rodas se mexem) */}else{o.tl=e.x0-3;o.tr=e.x1+3}o.sx=(t==='frog'||t==='spit'||t==='lavab'||t==='tchase'||t==='tguard')?o.hx:e.x0;o.sx0=o.sx;o.x=o.sx;
    o.alertS=makeAlertSprite();
    enemies.push(o);
  });
}
function buildBlades(){
  var metal=M(0xc9d1d8,.25,.9),dark=M(0x59606a,.4,.7);
  (LV.saws||[]).forEach(function(s){
    var rail=mesh(new T.BoxGeometry(.1,s.range*2+.6,.1),dark,false,false);rail.position.set(s.x,s.y0,-.3);add(rail);
    var g=new T.Group(),disc=mesh(new T.CylinderGeometry(.55,.55,.1,24),metal);disc.rotation.x=Math.PI/2;g.add(disc);
    var th=new T.ConeGeometry(.09,.2,4);th.translate(0,.1,0);
    for(var i=0;i<12;i++){var t=mesh(th,metal);var a=i/12*Math.PI*2;t.position.set(Math.cos(a)*.55,Math.sin(a)*.55,0);t.rotation.z=a-Math.PI/2;g.add(t)}
    var hub=mesh(new T.CylinderGeometry(.14,.14,.14,10),M(0xe0482a,.4,.5));hub.rotation.x=Math.PI/2;g.add(hub);
    g.position.set(s.x,s.y0,0);add(g);
    blades.push({kind:'saw',x:s.x,y0:s.y0,range:s.range,speed:s.speed,r:.62,g:g,cx:s.x,cy:s.y0,ang:0});
  });
  (LV.pends||[]).forEach(function(p){
    var g=new T.Group();
    var fst=curTheme.name==='forest';
    var rod=mesh(new T.CylinderGeometry(.05,.05,p.L,6),fst?M(0x3f8a2a,.8):dark);rod.position.y=-p.L/2;g.add(rod);
    var head=new T.Group();head.position.y=-p.L;g.add(head);
    if(fst){
      var ball=mesh(new T.SphereGeometry(.5,14,10),M(0x6b4a2c,.9));head.add(ball);
      var thf=new T.ConeGeometry(.1,.3,5);thf.translate(0,.15,0);var thm=M(0xb6c43a,.6);
      for(var i=0;i<16;i++){var u=1-2*(i+.5)/16,rr=Math.sqrt(1-u*u),ph2=i*2.399963,dv=new T.Vector3(Math.cos(ph2)*rr,u,Math.sin(ph2)*rr*.35).normalize();
        var t=mesh(thf,thm);t.position.copy(dv).multiplyScalar(.5);t.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dv);head.add(t)}
    }else{
    var disc=mesh(new T.CylinderGeometry(.7,.7,.14,24),metal);disc.rotation.x=Math.PI/2;head.add(disc);
    var th=new T.ConeGeometry(.1,.26,4);th.translate(0,.13,0);
    for(var i=0;i<14;i++){var t=mesh(th,metal);var a=i/14*Math.PI*2;t.position.set(Math.cos(a)*.7,Math.sin(a)*.7,0);t.rotation.z=a-Math.PI/2;head.add(t)}
    }
    var pivot=mesh(new T.SphereGeometry(.15,10,8),dark);g.add(pivot);
    g.position.set(p.x,p.y,0);add(g);
    blades.push({kind:'pend',x:p.x,y:p.y,L:p.L,amp:p.amp,speed:p.speed,r:p.r||.75,g:g,head:head,cx:p.x,cy:p.y-p.L,ang:0});
  });
}
function buildBoss(){
  if(LV.boss.mine){mnBossBuild();return}
  var bn0=$('bossBar').querySelector('span');if(bn0)bn0.textContent='Rei Besouro';
  var B=LV.boss,ar=B.arena;
  var vis=makeBeetle({shell:0x7a3fb0,ring:0xffc43a});
  vis.g.scale.set(2,2,2);
  var gold=M(0xffc43a,.3,.9,{emissive:new T.Color(0x6a4300),emissiveIntensity:.4});
  var crown=new T.Group();crown.position.set(0,.66,.62);vis.inner.add(crown);
  for(var i=0;i<5;i++){var a=i/5*Math.PI*2,cn=mesh(new T.ConeGeometry(.06,.2,5),gold);cn.position.set(Math.cos(a)*.14,.08,Math.sin(a)*.14);crown.add(cn)}
  var band=mesh(new T.TorusGeometry(.14,.025,6,16),gold);band.rotation.x=Math.PI/2;crown.add(band);
  var crackM=new T.MeshStandardMaterial({color:0x14070d,roughness:.9}),cracks=[[],[],[]];
  function surfY(x,z){return .42+.35*Math.sqrt(Math.max(0,1-Math.pow(x/.45,2)-Math.pow(z/.625,2)))}
  [[0,[[0,-.05,.28,.4],[.08,.12,.2,-.6],[-.07,.2,.18,.9]]],
   [1,[[-.15,-.2,.26,-.5],[.18,-.15,.22,.7],[.02,-.3,.2,.1],[-.12,.36,.16,-.9]]],
   [2,[[.22,.1,.2,-.2],[-.22,.0,.24,.8],[.1,.3,.18,.5],[-.05,-.42,.2,-.3],[.0,.05,.3,-.9]]]].forEach(function(gr){
    gr[1].forEach(function(c){
      var m=mesh(new T.BoxGeometry(.04,.03,c[2]),crackM,false,false);
      m.position.set(c[0],surfY(c[0],c[1])+.012,c[1]);m.rotation.y=c[3];m.visible=false;vis.inner.add(m);cracks[gr[0]].push(m);
    });
  });
  var stars=new T.Group();stars.position.set(0,1.05,.62);stars.visible=false;vis.inner.add(stars);
  var sm=new T.MeshStandardMaterial({color:0xffe066,emissive:0xffc200,emissiveIntensity:1.6});
  for(var j=0;j<3;j++){var s=mesh(new T.OctahedronGeometry(.1),sm,false,false);var aa=j/3*Math.PI*2;s.position.set(Math.cos(aa)*.28,0,Math.sin(aa)*.28);stars.add(s)}
  var wallM=curTheme.name==='castle'?castleSideM:regBump(M(0x6a7088,.9,.2,{map:texStone.map,bumpMap:texStone.bump,bumpScale:.4}),texStone.bump);
  function wall(x0,x1,dead){
    var w=x1-x0,m=mesh(boxGeo(w,24,6.8,2.6),wallM);m.position.set((x0+x1)/2,B.top+10,-1.6);add(m);
    var o={l:x0,r:x1,t:B.top+22,b:-14,oneway:false,wall:true,dead:dead,mesh:m};
    m.visible=!dead;solids.push(o);return o;
  }
  wall(ar[1],ar[1]+2,false);
  var wl=wall(ar[0]-2,ar[0],true);
  boss={x:B.x,y:B.top,x0:B.x,top:B.top,dir:-1,hp:B.hp,max:B.hp,state:'wait',t:0,vx:0,w:1.7,h:1.6,ph:0,deadT:0,core:false,aL:ar[0],aR:ar[1],trig:B.trigger,wallL:wl,vis:vis,stars:stars,n:0,yy:0,jt:0,crown:crown,cracks:cracks,goldM:gold,flash:0,recoil:0,drip:0};
  if(B.v2)bossV2Build(boss);
  buildKids();
}
function resetBoss(){
  pStars.forEach(function(s){s.on=false;s.m.visible=false});P.chgOn=false;P.chg=0;
  if(P.arena){P.arena=false;setAct()}
  P.slashT=0;P.comboT=0;P.slashQ=0;
  resetKids();
  if(!boss)return;
  if(boss.mine){mnBossReset();$('bossBar').hidden=true;return}
  boss.state='wait';boss.n=0;boss.yy=0;boss.warned=false;boss.toldKids=false;boss.hp=boss.max;boss.x=boss.x0;boss.dir=-1;boss.t=0;boss.vx=0;boss.deadT=0;
  boss.wallL.dead=true;boss.wallL.mesh.visible=false;boss.stars.visible=false;
  boss.flash=0;boss.recoil=0;boss.crown.visible=true;boss.cracks.forEach(function(g){g.forEach(function(m){m.visible=false})});boss.vis.shellM.color.setHex(0x7a3fb0);boss.vis.shellM.emissive.setHex(0x000000);boss.vis.shellM.emissiveIntensity=0;boss.vis.legM.emissive.setHex(0x000000);boss.vis.legM.emissiveIntensity=0;hitStop=0;
  boss.vis.g.visible=true;boss.vis.inner.scale.set(1,1,1);
  if(boss.v2)bossV2Reset(boss);
  $('bossBar').hidden=true;
}
function setBossBar(){$('bossFill').style.width=(boss?boss.hp/boss.max*100:0)+'%'}
