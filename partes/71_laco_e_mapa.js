/*@@parte:71_laco_e_mapa.js*/
/* ===================== laço principal ===================== */
var last=performance.now(),acc=0,fpsAcc=0,fpsN=0,pauseDrawn=0,menuSkip=false,shCX=0,shCY=0;
function render(){lushTick();splitInstTick();if(shLite&&renderer.shadowMap.enabled){shFrame++;if(shFrame%3===0)renderer.shadowMap.needsUpdate=true}/* modo leve: sombra refeita a cada 3 quadros (o cenário não muda; só quem anda espera 2 quadros) */if(state==='map'&&mapScene){renderer.render(mapScene,mapCam);return}if(quality==='high'&&composer)composer.render();else renderer.render(scene,camera)}
/* ===================== mapa da ilha ===================== */
var mapScene=null,mapCam=new T.PerspectiveCamera(38,2,.5,300);
var MAPN=22;
var MP=[ // biomas: x,z,raio,topo,cores
 {n:'meadow', x:-10,z:19, r:8.6,y:0,   top:'#86d44f',side:'#7b5e3e'},
 {n:'cave',   x:6,  z:18, r:8.6,y:.25, top:'#a08a6a',side:'#5a4636'},
 {n:'forest', x:14, z:8,  r:7.6,y:.45, top:'#35b08a',side:'#2b6556'},
 {n:'reef',   x:2.5,z:5.5,r:7.8,y:.1,  top:'#efd9a5',side:'#a8905c'},
 {n:'dead',   x:-11,z:6,  r:7.8,y:.5,  top:'#56505e',side:'#2e2a34'},
 {n:'snow',   x:-14,z:-7.5,r:7.6,y:.9, top:'#eef4fa',side:'#9fb0c4'},
 {n:'desert', x:-2.5,z:-6,r:7.8,y:.35, top:'#e8a24a',side:'#9c6130'},
 {n:'village',x:10, z:-6.5,r:7.6,y:.8, top:'#8a9a6a',side:'#5a4a36'},
 {n:'heights',x:8,  z:-19, r:7.8,y:1.1,top:'#6cc24a',side:'#c8823a'},
 {n:'volcano',x:-6, z:-19, r:8.2,y:1.4,top:'#3a2a2a',side:'#1e1416'},
 {n:'summit', x:-19,z:-25, r:8.2,y:1.8,top:'#dfe9f2',side:'#66788c'}
];
var MWP=[ // trilha: [x,z,noIndex?]
 [-12.5,21.5,0],[-8,22.8],[-3.5,20],[1.5,20.5],[5,20.5,1],[10.5,16.5],[14,12.5],[14.8,6.8,2],[11.5,2.5],[7,1.5],[2.5,4.5,3],
 [-2,3.8],[-6.5,8.5],[-11,5.5,4],[-14.5,0],[-12.5,-4.2],[-14,-8,5],[-10,-12.5],[-6,-10.5],[-1,-5.5,6],[4,-2.8],[8,-3],[10.8,-7,7],
 [11.2,-12],[9.5,-16],[7.5,-19.5,8],[2.5,-22.5],[-1.5,-20.5],[-5.5,-17.5,9],[-10,-22],[-15,-25.5,10]
];
/* segunda ilha: a Terra Nova (mundos 12 a 22) */
var MP2=[
 {n:'trail',  x:-12,z:17, r:9.4,y:0,   top:'#7ccf4a',side:'#7b5e3e'},
 {n:'w13',    x:4,  z:19.5,r:7.4,y:.25,top:'#d07ab8',side:'#6a4a5e'},
 {n:'w14',    x:15, z:10, r:7.4,y:.15, top:'#3a6a4a',side:'#2a3a2e'},
 {n:'w15',    x:7,  z:1.5,r:7.2,y:.4,  top:'#8a6a4a',side:'#4a3a2a'},
 {n:'w16',    x:-6, z:4,  r:7.4,y:.6,  top:'#b8a070',side:'#6a5a40'},
 {n:'w17',    x:-16,z:-5, r:7.4,y:.8,  top:'#b8603a',side:'#6a3a28'},
 {n:'w18',    x:-4, z:-9, r:7.2,y:.9,  top:'#e8f2fa',side:'#6a7e98'},/* Lago da Aurora: neve e gelo */
 {n:'w19',    x:10, z:-10,r:7.4,y:1.1, top:'#d8c08a',side:'#6a5a40'},/* Naufrágio: praia */
 {n:'w20',    x:15, z:-22,r:7.4,y:1.3, top:'#e89a5a',side:'#9a5a30'},
 {n:'w21',    x:2,  z:-24,r:7.4,y:1.5, top:'#2e5a3a',side:'#1e3424'},
 {n:'w22',    x:-12,z:-25,r:8.4,y:1.9, top:'#7ad05a',side:'#6a4a2e'}
];
/* a Terra Nova fica ao norte da primeira ilha, do outro lado de um braço de mar (o Kuro atravessa de barco) */
var OX2=-2,OZ2=-74;MP2.forEach(function(p){p.x+=OX2;p.z+=OZ2});
var MWP2=(function(){var o=[[-17+OX2,22.5+OZ2],[-14.5+OX2,20.2+OZ2]],k;for(k=0;k<MP2.length;k++){var p=MP2[k];o.push([p.x+(k%2?.6:-.6),p.z+(k===0?1.2:.4),11+k]);if(k<MP2.length-1){var q=MP2[k+1];o.push([(p.x+q.x)/2+((k%2)?1:-1),(p.z+q.z)/2])}}return o})();
MP=MP.concat(MP2);MWP=MWP.concat([[-14.6,-31.6],[-15.3,-37.5],[-17.2,-44.5]],MWP2);/* do Cume até o cais, mar e a praia da Terra Nova */
function onSea(x,z){return mapHeight(x,z)<-1}
var mapBoat=null,mapFx=[],mapPath=null,mapNodes=[],mapSel=0,mapAt=-1,mapWalk=null,mapPan={x:0,z:0},mapClouds=[],fogShown=0,mapFace=0,mapPh=0,mapT=0,mapPend=null;
function mapHeight(x,z){
  var h=-9;
  for(var i=0;i<MP.length;i++){var p=MP[i],dx=x-p.x,dz=z-p.z,d=Math.sqrt(dx*dx+dz*dz),a=Math.atan2(dz,dx);
    var rr=p.r*(1+.06*Math.sin(a*3+i)+.04*Math.sin(a*5+i*2))*.97;
    if(d<rr)h=Math.max(h,p.y)}
  for(i=0;i<MP.length-1;i++){if(i===10)continue;var a1=MP[i],b1=MP[i+1],mx=(a1.x+b1.x)/2,mz=(a1.z+b1.z)/2,d2=Math.hypot(x-mx,z-mz);if(d2<3.8)h=Math.max(h,Math.min(a1.y,b1.y)*.5+Math.max(a1.y,b1.y)*.5)}
  return h;
}
function mapPathDist(x,z){var m=1e9;for(var i=0;i<mapPath.pts.length;i+=2){var q=mapPath.pts[i],d=Math.hypot(q.x-x,q.z-z);if(d<m)m=d}return m}
function mapMat(c,r,extra){var o={color:c,roughness:r===undefined?.92:r,metalness:0,flatShading:true},k;for(k in extra)o[k]=extra[k];return new T.MeshStandardMaterial(o)}
function mapLabel(n,state){
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');
  var bg=state==='done'?'#3fb86a':state==='open'?'#ffc233':'#7b8794';
  x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.arc(64,68,52,0,7);x.fill();
  x.fillStyle=bg;x.beginPath();x.arc(64,64,52,0,7);x.fill();
  x.lineWidth=7;x.strokeStyle='#fff';x.stroke();
  x.fillStyle=state==='open'?'#12171b':'#fff';x.font='italic 700 66px Arial';x.textAlign='center';x.textBaseline='middle';
  x.fillText(state==='lock'?'🔒':state==='soon'?'?':String(n),64,68);
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
}
function buildMap(){
  var IS={off:0,n:MAPN,bg:'#3aa6d8'};
  mapScene=new T.Scene();mapScene.background=new T.Color(IS.bg);mapScene.fog=new T.Fog(IS.bg,70,170);
  mapScene.add(new T.HemisphereLight(0xdff1ff,0x4a6a58,.55));
  var dl=new T.DirectionalLight(0xfff1d8,1.35);dl.position.set(-14,30,18);mapScene.add(dl);
  var r=rnd(4242),i,j;
  // oceano
  var oc=new T.Mesh(new T.PlaneGeometry(400,400),mapMat(0x2f9bd2,.5,{flatShading:false}));oc.rotation.x=-Math.PI/2;oc.position.y=-.9;mapScene.add(oc);
  var sh=new T.Mesh(new T.CircleGeometry(30,40),new T.MeshBasicMaterial({color:0x1f78ae,transparent:true,opacity:.35,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.set(0,-.85,0);sh.scale.set(1.15,1.5,1);mapScene.add(sh);
  // ilhas
  function slab(x,z,rad,top,topC,sideC,seed){
    var g=new T.CylinderGeometry(rad*.97,rad*.8,2.6,12,1,false),pos=g.attributes.position;
    for(var k=0;k<pos.count;k++){var px=pos.getX(k),pz=pos.getZ(k),a=Math.atan2(pz,px),f=1+.06*Math.sin(a*3+seed)+.04*Math.sin(a*5+seed*2);pos.setX(k,px*f);pos.setZ(k,pz*f)}
    g.computeVertexNormals();
    var m=new T.Mesh(g,[mapMat(sideC),mapMat(topC),mapMat(sideC)]);m.position.set(x,top-1.3,z);mapScene.add(m);return m;
  }
  MP.forEach(function(p,k){slab(p.x,p.z,p.r,p.y,p.top,p.side,k)});
  for(i=0;i<MP.length-1;i++){if(i===10)continue;var a=MP[i],b=MP[i+1];slab((a.x+b.x)/2,(a.z+b.z)/2,3.4,(a.y+b.y)/2,a.top,a.side,20+i)}
  // trilha
  var wp=MWP.map(function(w){return new T.Vector3(w[0],0,w[1])});
  var curve=new T.CatmullRomCurve3(wp,false,'catmullrom',.4),N=700,pts=[],len=[0];
  for(i=0;i<=N;i++){var q=curve.getPoint(i/N);pts.push({x:q.x,z:q.z,y:0})}
  for(i=1;i<=N;i++)len.push(len[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].z-pts[i-1].z));
  pts.forEach(function(q){q.y=Math.max(-.82,mapHeight(q.x,q.z))});
  for(var pass=0;pass<14;pass++)for(i=1;i<N;i++)pts[i].y=(pts[i-1].y+pts[i].y*2+pts[i+1].y)/4;
  mapPath={pts:pts,len:len,total:len[N],nodeS:[]};
  MWP.forEach(function(w){if(w.length>2){var best=0,bd=1e9;for(var k=0;k<=N;k++){var d=Math.hypot(pts[k].x-w[0],pts[k].z-w[1]);if(d<bd){bd=d;best=k}}mapPath.nodeS[w[2]]=len[best]}});
  function ribbon(wd,yo,color){
    var pos=[],idx=[];
    for(var k=0;k<=N;k++){
      var p0=pts[Math.max(0,k-1)],p1=pts[Math.min(N,k+1)],tx=p1.x-p0.x,tz=p1.z-p0.z,tl=Math.hypot(tx,tz)||1,nx=-tz/tl,nz=tx/tl;
      pos.push(pts[k].x+nx*wd,pts[k].y+yo,pts[k].z+nz*wd,pts[k].x-nx*wd,pts[k].y+yo,pts[k].z-nz*wd);
      if(k<N&&pts[k].y>-.45&&pts[k+1].y>-.45){var o=k*2;idx.push(o,o+1,o+2,o+1,o+3,o+2)}/* no mar não tem trilha */
    }
    var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    var m=new T.Mesh(g,mapMat(color,.95,{side:T.DoubleSide,flatShading:false}));mapScene.add(m);
  }
  ribbon(.78,.07,0xb58a4e);ribbon(.58,.1,0xf6e6b8);
  // decoração
  var seedR=rnd(909);
  function spot(pi,minF,maxF,tries){
    var p=MP[pi];
    for(var t=0;t<(tries||40);t++){
      var a=seedR()*6.283,d=p.r*(minF+(maxF-minF)*Math.sqrt(seedR())),x=p.x+Math.cos(a)*d,z=p.z+Math.sin(a)*d;
      if(Math.abs(mapHeight(x,z)-p.y)>.01)continue;
      if(mapPathDist(x,z)<1.7)continue;
      return {x:x,y:p.y,z:z,s:.75+seedR()*.7,ry:seedR()*6.28,k:(seedR()*100)|0};
    }
    return null;
  }
  function many(pi,n,minF,maxF){var o=[];for(var k=0;k<n;k++){var s=spot(pi,minF||.1,maxF||.86);if(s)o.push(s)}return o}
  var D=new T.Object3D(),col=new T.Color();
  function parts(list,defs){
    if(!list.length)return;
    defs.forEach(function(df){
      var im=new T.InstancedMesh(df.g,mapMat(0xffffff,.9),list.length);im.frustumCulled=false;
      list.forEach(function(it,k){
        var sc=it.s*(df.sc||1),sx=df.s?df.s[0]:1,sy=df.s?df.s[1]:1,sz=df.s?df.s[2]:1;
        var ox=df.o[0]*it.s,oz=df.o[2]*it.s,c=Math.cos(it.ry),sn=Math.sin(it.ry);
        D.position.set(it.x+ox*c+oz*sn,it.y+df.o[1]*it.s,it.z-ox*sn+oz*c);D.rotation.set(0,it.ry,0);D.scale.set(sc*sx,sc*sy,sc*sz);D.updateMatrix();im.setMatrixAt(k,D.matrix);
        col.set(df.pal[(it.k+(df.shift||0))%df.pal.length]);im.setColorAt(k,col);
      });
      im.instanceColor.needsUpdate=true;mapScene.add(im);
    });
  }
  var gCyl=new T.CylinderGeometry(.12,.18,1,6),gIco=new T.IcosahedronGeometry(.8,0),gCone=new T.ConeGeometry(.8,1.4,7),gCone2=new T.ConeGeometry(.6,1.1,7);
  var gOct=new T.OctahedronGeometry(.5,0),gDode=new T.DodecahedronGeometry(.5,0),gCap=new T.SphereGeometry(.55,9,6,0,6.283,0,1.6),gStem=new T.CylinderGeometry(.14,.18,.7,6);
  var gCact=new T.CylinderGeometry(.22,.26,1.5,7),gArm=new T.CylinderGeometry(.12,.12,.6,6),gMesa=new T.CylinderGeometry(.9,1.15,1.3,7),gCoral=new T.ConeGeometry(.2,1,5),gKelp=new T.CylinderGeometry(.05,.07,1.8,5);
  var gDead=new T.CylinderGeometry(.06,.17,1.7,5),gBr=new T.CylinderGeometry(.03,.07,.9,4);gBr.rotateZ(.9);
  var woodC=['#6b4a2e'],greens=['#58c23c','#6ed24a','#4cb034'],tealG=['#1f9a74','#27b085','#188a68'],bark=['#6b4a2e'];
  /* ===== maquetes de cada mundo (peças estáticas juntas num lote só, com cor por vértice) ===== */
  mapFx=[];
  var LM=[],TMP=new T.Object3D();
  function lm(geo,c,x,y,z,rot,sc){LM.push({g:xf(geo,[x,y,z],rot,sc),c:c})}
  function best(pi,rad,maxF){/* lugar dentro da ilha mais longe da trilha (para a peça grande não cobrir o caminho) */
    var p=MP[pi],bx=p.x,bz=p.z,bd=-1,rr=rnd(77+pi);
    for(var t=0;t<160;t++){var a=rr()*6.283,d=p.r*(maxF||.62)*Math.sqrt(rr()),x=p.x+Math.cos(a)*d,z=p.z+Math.sin(a)*d,ok=true;
      for(var k=0;k<6&&ok;k++){var aa=k/6*6.283;if(Math.abs(mapHeight(x+Math.cos(aa)*rad,z+Math.sin(aa)*rad)-p.y)>.01)ok=false}
      if(!ok)continue;var dd=mapPathDist(x,z);if(dd>bd){bd=dd;bx=x;bz=z}}
    return {x:bx,y:p.y,z:bz};
  }
  function faceTo(c){var m=1e9,q=null;for(var i=0;i<mapPath.pts.length;i+=4){var pt=mapPath.pts[i],d=Math.hypot(pt.x-c.x,pt.z-c.z);if(d<m){m=d;q=pt}}return Math.atan2(q.x-c.x,q.z-c.z)}
  var gCyl=new T.CylinderGeometry(.12,.18,1,6),gIco=new T.IcosahedronGeometry(.8,0),gCone=new T.ConeGeometry(.8,1.4,7),gCone2=new T.ConeGeometry(.6,1.1,7);
  var gOct=new T.OctahedronGeometry(.5,0),gDode=new T.DodecahedronGeometry(.5,0),gCap=new T.SphereGeometry(.55,9,6,0,6.283,0,1.6),gStem=new T.CylinderGeometry(.14,.18,.7,6);
  var gCact=new T.CylinderGeometry(.22,.26,1.5,7),gArm=new T.CylinderGeometry(.12,.12,.6,6),gCoral=new T.ConeGeometry(.2,1,5),gKelp=new T.CylinderGeometry(.05,.07,1.8,5);
  var gDead=new T.CylinderGeometry(.06,.17,1.7,5),gBr=new T.CylinderGeometry(.03,.07,.9,4);gBr.rotateZ(.9);
  var bark=['#6b4a2e'],greens=['#58c23c','#6ed24a','#4cb034'],tealG=['#1f9a74','#27b085','#188a68'];
  var L,c,i,k,a;
  buildMapDecor2(lm,parts,many,best,faceTo,LM,TMP);{
  /* 1 Vale Verde: colinas, árvores redondas, flores, bloco "?" flutuando e um besourinho */
  c=best(0,1.6);[[0,0,1.8],[1.6,-.8,1.2],[-1.4,.9,1.1]].forEach(function(h){lm(new T.SphereGeometry(1,10,6),0x7ad04a,c.x+h[0],c.y-.2,c.z+h[1],0,[h[2]*1.4,h[2]*.55,h[2]*1.4])});
  L=many(0,9,.15,.85);parts(L,[{g:gCyl,o:[0,.5,0],pal:bark},{g:gIco,o:[0,1.55,0],pal:greens}]);
  parts(many(0,12,.1,.9),[{g:gIco,o:[0,.2,0],sc:.45,pal:['#4cb034','#7bd85a','#f2a6c8','#ffe066','#ffffff']}]);
  (function(){var q=new T.Mesh(new T.BoxGeometry(.7,.7,.7),mapMat(0xffc233,.5,{emissive:new T.Color(0x6a4a00),emissiveIntensity:.4}));q.position.set(c.x,c.y+2.6,c.z);mapScene.add(q);
    var bt=new T.Mesh(new T.SphereGeometry(.28,8,6),mapMat(0x55606b,.5));bt.scale.set(1,.7,1.3);mapScene.add(bt);var cc=best(0,.6,.8);
    mapFx.push(function(dt,t){q.rotation.y=t*1.2;q.position.y=c.y+2.6+Math.sin(t*2)*.15;bt.position.set(cc.x+Math.cos(t*.6)*1.1,cc.y+.2,cc.z+Math.sin(t*.6)*1.1);bt.rotation.y=-t*.6})})();
  /* 2 Caverna de Cristal: morro de pedra marrom com a boca escura e cristais brilhando */
  c=best(1,2.4);
  for(k=0;k<9;k++){a=k/9*6.283;lm(new T.DodecahedronGeometry(1,0),k%2?0x7a5a40:0x6a4c36,c.x+Math.cos(a)*1.4,c.y+.6+(k%3)*.3,c.z+Math.sin(a)*1.4,[k,k*2,0],[1.3,1.1+(k%3)*.25,1.3])}
  lm(new T.DodecahedronGeometry(1.6,0),0x5e4430,c.x,c.y+1.6,c.z,0,[1.2,1.25,1.2]);
  a=faceTo(c);lm(new T.CircleGeometry(.9,12,0,Math.PI),0x140c08,c.x+Math.sin(a)*2.05,c.y+.15,c.z+Math.cos(a)*2.05,[0,a,0],[1.1,1.4,1]);
  (function(){var cm=new T.MeshStandardMaterial({color:0x8fd8ff,emissive:0x3a8aff,emissiveIntensity:.8,roughness:.3,flatShading:true}),n=14,im=new T.InstancedMesh(gOct,cm,n),rr=rnd(31);
    for(var j=0;j<n;j++){var aa=rr()*6.283,dd=2.2+rr()*2.4,x=c.x+Math.cos(aa)*dd,z=c.z+Math.sin(aa)*dd;if(mapPathDist(x,z)<1.3){x=c.x+Math.cos(aa)*1.9;z=c.z+Math.sin(aa)*1.9}
      TMP.position.set(x,c.y+.5,z);TMP.rotation.set(rr()*.4,rr()*3,rr()*.4);TMP.scale.set(.5,1.4+rr()*1.2,.5);TMP.updateMatrix();im.setMatrixAt(j,TMP.matrix);im.setColorAt(j,new T.Color(j%3?0x9ad8ff:0xc89aff))}
    mapScene.add(im);mapFx.push(function(dt,t){cm.emissiveIntensity=.6+Math.sin(t*2.2)*.35})})();
  parts(many(1,6,.2,.88),[{g:gDode,o:[0,.2,0],sc:.9,pal:['#7a5a40','#8a6a4a']}]);
  /* 3 Floresta Esmeralda: troncos gigantes com plataformas de galho, copas cheias e cipós */
  [best(2,1.4,.5),best(2,1.4,.75)].forEach(function(t2,j){var h=4.5+j*1.2;
    lm(new T.CylinderGeometry(.55,.8,h,8),0x6b4a2e,t2.x,t2.y+h/2,t2.z);
    lm(new T.CylinderGeometry(1.1,1.1,.18,10),0x3c8a3a,t2.x,t2.y+h*.45,t2.z);lm(new T.CylinderGeometry(.9,.9,.18,10),0x3c8a3a,t2.x+.4,t2.y+h*.75,t2.z-.3);
    [[0,0,2],[1.2,-.4,1.4],[-1.1,.5,1.5],[.3,1,1.3]].forEach(function(q){lm(new T.IcosahedronGeometry(1,1),q[2]>1.6?0x2fa060:0x3cb46c,t2.x+q[0],t2.y+h+.4,t2.z+q[1],0,[q[2],q[2]*.8,q[2]])});
    for(k=0;k<4;k++){a=k*1.7;lm(new T.CylinderGeometry(.04,.04,1.6,4),0x2f7a22,t2.x+Math.cos(a)*1.3,t2.y+h-.6,t2.z+Math.sin(a)*1.3)}});
  L=many(2,10,.1,.88);parts(L,[{g:gCyl,o:[0,.5,0],pal:bark},{g:gCone,o:[0,1.4,0],sc:1.05,pal:tealG},{g:gCone2,o:[0,2.1,0],pal:['#3cc89a','#2fb886']}]);
  (function(){var n=40,pos=new Float32Array(n*3),rr=rnd(55),p=MP[2];for(var j=0;j<n;j++){pos[j*3]=p.x+(rr()-.5)*p.r*1.4;pos[j*3+1]=p.y+.6+rr()*3;pos[j*3+2]=p.z+(rr()-.5)*p.r*1.4}
    var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));var pm=new T.PointsMaterial({color:0xd8ff7a,size:.18,transparent:true,opacity:.9});var pt=new T.Points(g,pm);mapScene.add(pt);
    mapFx.push(function(dt,t){pm.opacity=.55+Math.sin(t*3)*.35})})();
  /* 4 Recife Submerso: lagoa azul com ondinhas, corais, algas e bolhas subindo */
  c=best(3,2.6,.55);
  (function(){var lg=new T.CircleGeometry(2.8,24,0,6.283);lg.rotateX(-Math.PI/2);
    var wm=new T.MeshStandardMaterial({color:0x2ec4d8,roughness:.2,metalness:.1,transparent:true,opacity:.82});var w=new T.Mesh(lg,wm);w.position.set(c.x,c.y+.12,c.z);mapScene.add(w);
    lm(new T.TorusGeometry(2.85,.22,6,24),0xd9c391,c.x,c.y+.05,c.z,[Math.PI/2,0,0],[1,1,.6]);
    var pa=lg.attributes.position,b0=pa.array.slice();
    var bubs=[];for(var j=0;j<5;j++){var b=new T.Mesh(new T.SphereGeometry(.09,6,5),new T.MeshBasicMaterial({color:0xe8fbff,transparent:true,opacity:.8}));mapScene.add(b);bubs.push({m:b,ph:j/5,x:c.x+(j-2)*.6,z:c.z+((j%2)-.5)*.9})}
    mapFx.push(function(dt,t){for(var v=0;v<pa.count;v++){var x=b0[v*3],z=b0[v*3+2];pa.setY(v,Math.sin(t*2+x*1.7+z*1.3)*.05)}pa.needsUpdate=true;
      bubs.forEach(function(q){var u=(t*.35+q.ph)%1;q.m.position.set(q.x+Math.sin(t*3+q.ph*6)*.08,c.y+.1+u*1.6,q.z);q.m.material.opacity=.8*(1-u)})})})();
  for(k=0;k<10;k++){a=k/10*6.283+.3;var rd=.6+(k%3)*.65;lm(gCoral,[0xff6b8a,0xff9a4a,0xc05ae0,0xffd24a][k%4],c.x+Math.cos(a)*rd,c.y+.2,c.z+Math.sin(a)*rd,[.2,0,.15],[1.2,.9,1.2])}
  parts(many(3,10,.15,.88),[{g:gCoral,o:[0,.5,0],s:[1,1.3,1],pal:['#ff6b8a','#ff9a4a','#c05ae0','#ffd24a']}]);
  parts(many(3,7,.1,.9),[{g:gKelp,o:[0,.9,0],pal:['#2fb866','#1f9a50']}]);
  /* 5 Castelo do Medo: castelo, lápides, caveiras, árvores secas, nuvem escura e raio */
  parts(many(4,6,.1,.88),[{g:gDead,o:[0,.85,0],pal:['#2f2a30','#3d363e']},{g:gBr,o:[.3,1.45,0],pal:['#2f2a30']}]);
  L=many(4,10,.15,.9);L.forEach(function(q,j){if(j%3===2){lm(new T.SphereGeometry(.13,7,5),0xe8e0cc,q.x,q.y+.1,q.z)}else{lm(new T.BoxGeometry(.35,.45,.1),0x8a8a92,q.x,q.y+.22,q.z,[0,q.ry,(j%2?.15:-.12)]);lm(new T.CylinderGeometry(.175,.175,.1,10),0x8a8a92,q.x,q.y+.45,q.z,[Math.PI/2,q.ry,0])}});
  (function(){var cx=-14.5,cy=MP[4].y,cz=10.5,cm=mapMat(0x3a3448,.9),cl=new T.Group();cl.position.set(cx,cy+9.5,cz);mapScene.add(cl);
    [[0,0,2],[1.6,.3,1.5],[-1.5,-.2,1.6],[.6,-.9,1.3],[-.5,.9,1.4]].forEach(function(q){var s=new T.Mesh(new T.IcosahedronGeometry(1,1),cm);s.position.set(q[0],q[1]*.4,q[2]===2?0:q[1]);s.scale.set(q[2]*1.2,q[2]*.6,q[2]);cl.add(s)});
    var bm=new T.MeshBasicMaterial({color:0xf4f0ff}),bolt=new T.Group();[[0,0,.6,-.3],[.3,-1,.55,.4],[-.1,-2,.6,-.35],[.25,-3,.5,.3]].forEach(function(q){var s=new T.Mesh(new T.BoxGeometry(.1,1.15,.1),bm);s.position.set(q[0],q[1]-.5,0);s.rotation.z=q[3];bolt.add(s)});
    bolt.position.set(cx+1.2,cy+8.8,cz+1);bolt.visible=false;mapScene.add(bolt);var nx=3,fl=0;
    mapFx.push(function(dt,t){nx-=dt;if(nx<=0){fl=.35;nx=4+Math.random()*4}if(fl>0){fl-=dt;bolt.visible=fl>.18||(fl>.05&&fl<.1);cm.emissive.setHex(bolt.visible?0x8a80c0:0)}else{bolt.visible=false;cm.emissive.setHex(0)}cl.position.x=cx+Math.sin(t*.3)*.4})})();
  /* 6 Montanha Gelada: picos de neve, pinheiros brancos, gelo e boneco de neve; neve caindo só aqui */
  c=best(5,2.2,.55);
  [[0,0,2.2,4.4],[1.7,-.7,1.5,3],[-1.5,.6,1.4,2.6]].forEach(function(q){lm(new T.ConeGeometry(q[2],q[3],7),0x8a96a8,c.x+q[0],c.y+q[3]/2,c.z+q[1]);lm(new T.ConeGeometry(q[2]*.55,q[3]*.42,7),0xffffff,c.x+q[0],c.y+q[3]*.79,c.z+q[1])});
  parts(many(5,11,.1,.9),[{g:gCyl,o:[0,.4,0],sc:.8,pal:bark},{g:gCone,o:[0,1.3,0],pal:['#f4f9ff','#dfeaf5']},{g:gCone2,o:[0,2.0,0],pal:['#ffffff']}]);
  (function(){var s=best(5,.6,.85);lm(new T.SphereGeometry(.4,10,8),0xffffff,s.x,s.y+.38,s.z);lm(new T.SphereGeometry(.28,10,8),0xffffff,s.x,s.y+.95,s.z);lm(new T.ConeGeometry(.06,.25,6),0xff8a30,s.x,s.y+.95,s.z+.32,[Math.PI/2,0,0]);
    lm(new T.CylinderGeometry(.2,.2,.25,8),0x2a2a32,s.x,s.y+1.3,s.z);
    var ic=best(5,.5,.9);lm(new T.BoxGeometry(.8,.6,.8),0x9adcf4,ic.x,ic.y+.3,ic.z,[0,.5,0]);lm(new T.BoxGeometry(.5,.9,.5),0xbfeaf8,ic.x+.5,ic.y+.45,ic.z-.3,[0,.2,.1]);
    var p=MP[5],n=70,pos=new Float32Array(n*3),rr=rnd(99);for(var j=0;j<n;j++){pos[j*3]=p.x+(rr()-.5)*p.r*1.6;pos[j*3+1]=p.y+rr()*7;pos[j*3+2]=p.z+(rr()-.5)*p.r*1.6}
    var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));var pt=new T.Points(g,new T.PointsMaterial({color:0xffffff,size:.16,transparent:true,opacity:.9}));mapScene.add(pt);
    mapFx.push(function(dt,t){for(var v=0;v<n;v++){pos[v*3+1]-=dt*(.8+(v%4)*.2);pos[v*3]+=Math.sin(t+v)*dt*.2;if(pos[v*3+1]<p.y)pos[v*3+1]=p.y+7}g.attributes.position.needsUpdate=true})})();
  /* 7 Deserto das Ruínas: pirâmide, colunas quebradas, dunas, cactos e um oásis com palmeira */
  c=best(6,2.2,.55);
  lm(new T.ConeGeometry(2.6,3.2,4),0xe0b060,c.x,c.y+1.6,c.z,[0,Math.PI/4,0]);lm(new T.BoxGeometry(.6,.7,.1),0x3a2410,c.x,c.y+.35,c.z+1.85,[0,0,0]);
  for(k=0;k<5;k++){a=k*1.25+.4;var cxx=c.x+Math.cos(a)*3.2,czz=c.z+Math.sin(a)*3.2;if(mapPathDist(cxx,czz)<1.3)continue;var hh=.6+(k%3)*.5;lm(new T.CylinderGeometry(.22,.25,hh,8),0xe8c890,cxx,c.y+hh/2,czz)}
  parts(many(6,6,.15,.88),[{g:gCact,o:[0,.75,0],pal:['#3f9a4a','#4fae55']},{g:gArm,o:[.38,1.0,0],pal:['#3f9a4a']}]);
  parts(many(6,5,.2,.9),[{g:new T.SphereGeometry(.9,8,5),o:[0,0,0],s:[1.6,.45,1],pal:['#f0b860','#e8a84e']}]);
  (function(){var o=best(6,.9,.85);var wg=new T.CircleGeometry(.8,16);wg.rotateX(-Math.PI/2);var ws=new T.Mesh(wg,new T.MeshStandardMaterial({color:0x3ab8d8,roughness:.2,transparent:true,opacity:.85}));ws.position.set(o.x,o.y+.06,o.z);mapScene.add(ws);
    [[-.5,.3],[.6,-.2]].forEach(function(q,j){var tx=o.x+q[0],tz=o.z+q[1];for(var s=0;s<4;s++)lm(new T.CylinderGeometry(.07,.09,.5,5),0x8a6a3a,tx+s*.06*(j?-1:1),o.y+.25+s*.46,tz,[0,0,(j?-1:1)*.12]);
      for(var f=0;f<5;f++){var aa=f/5*6.283;lm(new T.ConeGeometry(.12,.9,4),0x3f9a4a,tx+.24*(j?-1:1)+Math.cos(aa)*.4,o.y+2.0,tz+Math.sin(aa)*.4,[Math.cos(aa)*1.3,0,-Math.sin(aa)*1.3])}})})();
  /* 8 Vila Ninja: casinhas, pagode, torii, cerejeiras e lanternas acesas */
  var gHouse=new T.BoxGeometry(1,.8,.9),gRoofV=new T.ConeGeometry(.85,.6,4);gRoofV.rotateY(Math.PI/4);
  parts(many(7,7,.15,.85),[{g:gHouse,o:[0,.4,0],pal:['#e2d6b8','#d8ccae']},{g:gRoofV,o:[0,1.1,0],s:[1.1,1,1],pal:['#3c4660','#46506a']}]);
  parts(many(7,7,.1,.9),[{g:gCyl,o:[0,.4,0],sc:.7,pal:bark},{g:gIco,o:[0,1.15,0],sc:.75,pal:['#ffb7cf','#ff9ec0','#ffc8da']}]);
  (function(){var px=12.5,py=MP[7].y,pz=-9;
    for(var q=0;q<4;q++){lm(new T.BoxGeometry(1.6-q*.25,.7,1.6-q*.25),0xa8322a,px,py+.35+q*.95,pz);lm(new T.ConeGeometry(1.5-q*.25,.45,4),0x3c4660,px,py+.85+q*.95,pz,[0,Math.PI/4,0])}
    lm(new T.CylinderGeometry(.04,.04,1,5),0xd8b040,px,py+4.4,pz);
    var tg=best(7,.8,.6);var ta=faceTo(tg);[-1,1].forEach(function(sd){lm(new T.CylinderGeometry(.1,.12,1.6,6),0xc8302a,tg.x+Math.cos(ta)*sd*.7,tg.y+.8,tg.z-Math.sin(ta)*sd*.7)});
    lm(new T.BoxGeometry(2.1,.14,.2),0xc8302a,tg.x,tg.y+1.45,tg.z,[0,ta+Math.PI/2,0]);lm(new T.BoxGeometry(2.4,.14,.25),0x2a2224,tg.x,tg.y+1.7,tg.z,[0,ta+Math.PI/2,0]);
    var lmM=new T.MeshStandardMaterial({color:0xd8402a,emissive:0xff6a2a,emissiveIntensity:1,flatShading:true}),LL=many(7,9,.1,.95),im=new T.InstancedMesh(new T.SphereGeometry(.14,8,6),lmM,LL.length);
    LL.forEach(function(s,j){lm(new T.CylinderGeometry(.03,.03,.9,4),0x2a2224,s.x,s.y+.45,s.z);TMP.position.set(s.x,s.y+1.0,s.z);TMP.rotation.set(0,0,0);TMP.scale.set(1,1.3,1);TMP.updateMatrix();im.setMatrixAt(j,TMP.matrix)});
    mapScene.add(im);mapFx.push(function(dt,t){lmM.emissiveIntensity=.8+Math.sin(t*4)*.25})})();
  /* 9 Torre Verde: árvore gigante com degraus de grama subindo em volta e nuvens passando */
  (function(){var tx=12.6,ty=MP[8].y,tz=-22.6;
    lm(new T.CylinderGeometry(1.3,1.9,8,10),0x7a5a3c,tx,ty+4,tz);
    [[0,9,0,3.4],[1.8,7.4,1.4,2.2],[-2,7.8,-.8,2]].forEach(function(q,j){lm(new T.IcosahedronGeometry(q[3],1),[0x4fae44,0x5cbc4a,0x3f9a3a][j],tx+q[0],ty+q[1],tz+q[2],0,j?0:[1.3,.8,1.3])});
    for(var s=0;s<7;s++){var aa=s*1.05,rr2=2.05,sx=tx+Math.cos(aa)*rr2,sz=tz+Math.sin(aa)*rr2,sy=ty+.5+s*.9;lm(new T.BoxGeometry(1,.4,.8),0xc8823a,sx,sy,sz,[0,-aa,0]);lm(new T.BoxGeometry(1.02,.12,.82),0x6cc24a,sx,sy+.26,sz,[0,-aa,0])}
    var cg=new T.Group();cg.position.set(tx,ty+4.8,tz);mapScene.add(cg);var wm=mapMat(0xffffff,.9);
    for(var c2=0;c2<5;c2++){var a2=c2/5*6.283,cl=new T.Mesh(new T.IcosahedronGeometry(.6,1),wm);cl.scale.set(1.6,.6,1);cl.position.set(Math.cos(a2)*3.4,(c2%2)*.5,Math.sin(a2)*3.4);cg.add(cl)}
    mapFx.push(function(dt,t){cg.rotation.y=t*.15})})();
  parts(many(8,6,.15,.9),[{g:new T.BoxGeometry(1,.6,1),o:[0,.3,0],pal:['#c8823a']},{g:new T.BoxGeometry(1.02,.15,1.02),o:[0,.65,0],pal:['#6cc24a']}]);
  var gl=new T.Mesh(new T.SphereGeometry(.01,4,3),new T.MeshBasicMaterial({color:0xffffff}));gl.visible=false;mapScene.add(gl);mapPath.glow=gl;
  /* 10 Vulcão: cone escuro com cratera de lava, rios de lava descendo e fumaça */
  (function(){var vx=-6,vz=-21.5,vy=MP[9].y;var V0=best(9,3,.5);vx=V0.x;vz=V0.z;
    lm(new T.CylinderGeometry(1.4,4.2,5.5,10),0x3a2a2a,vx,vy+2.75,vz);lm(new T.CylinderGeometry(1.2,1.45,.3,10),0xff7a1a,vx,vy+5.5,vz);
    for(var s2=0;s2<4;s2++){var aa=s2*1.6+.4;lm(new T.BoxGeometry(.35,4.8,.12),0xff8a20,vx+Math.cos(aa)*2.4,vy+2.6,vz+Math.sin(aa)*2.4,[Math.sin(aa)*.6,-aa+Math.PI/2,0])}
    var lg=new T.CircleGeometry(1.6,16);lg.rotateX(-Math.PI/2);var lake=new T.Mesh(lg,new T.MeshBasicMaterial({color:0xff6a10}));lake.position.set(vx+3.5,vy+.06,vz+2.5);lake.scale.set(1.3,1,.8);mapScene.add(lake);
    var sm=new T.Group();sm.position.set(vx,vy+6.2,vz);mapScene.add(sm);var smM=mapMat(0x4a3a3a,.95);
    for(var q=0;q<4;q++){var b=new T.Mesh(new T.IcosahedronGeometry(.6+q*.25,1),smM);b.position.set(q*.3,q*.9,0);sm.add(b)}
    var gl2=new T.Mesh(new T.SphereGeometry(.9,10,8),new T.MeshBasicMaterial({color:0xff8a30,transparent:true,opacity:.8}));gl2.position.set(vx,vy+5.8,vz);mapScene.add(gl2);
    mapFx.push(function(dt,t){sm.children.forEach(function(b,i){var u=((t*.25+i*.25)%1);b.position.y=u*3.6;b.scale.setScalar(.7+u*1.2);});gl2.scale.setScalar(1+Math.sin(t*3)*.15)})})();
  parts(many(9,8,.15,.9),[{g:new T.ConeGeometry(.3,1.4,5),o:[0,.7,0],pal:['#1a1420','#2a2030']}]);
  parts(many(9,5,.2,.9),[{g:gDode,o:[0,.2,0],sc:1.1,pal:['#2e282d','#3a3338']}]);
  /* 11 Cume: a montanha final */
  parts([{x:-19,y:1.8,z:-27.5,s:1,ry:0,k:0}],[{g:new T.ConeGeometry(6.2,9,8),o:[0,4.5,0],pal:['#5e6e82']},{g:new T.ConeGeometry(2.4,3.4,8),o:[0,8.2,0],pal:['#ffffff']}]);
  parts(many(10,7,.15,.9),[{g:gCyl,o:[0,.4,0],sc:.8,pal:bark},{g:gCone,o:[0,1.3,0],pal:['#f4f9ff','#dfeaf5']},{g:gCone2,o:[0,2.0,0],pal:['#ffffff']}]);
  if(LM.length){var lmm=new T.Mesh(mergeG(LM,true),mapMat(0xffffff,.9,{vertexColors:true}));mapScene.add(lmm)}
  /* castelo do mapa */
  (function(){
    var stn=mapMat(0x827e92),roof=mapMat(0x6a3a9a),dk=mapMat(0x3a3646),glow=new T.MeshBasicMaterial({color:0xffc84a});
    var gC=new T.Group();gC.position.set(-14.5,MP[4].y,10.5);gC.scale.setScalar(1.25);mapScene.add(gC);
    function bx(w,h,d,x,y,z,m){var q=new T.Mesh(new T.BoxGeometry(w,h,d),m||stn);q.position.set(x,y,z);gC.add(q);return q}
    bx(3,3.4,3,0,1.7,0);
    var kr=new T.Mesh(new T.ConeGeometry(2.4,1.8,4),roof);kr.position.set(0,4.3,0);kr.rotation.y=Math.PI/4;gC.add(kr);
    [[-2.5,-2.5],[2.5,-2.5],[-2.5,2.5],[2.5,2.5]].forEach(function(c){
      var tw=new T.Mesh(new T.CylinderGeometry(.75,.85,3.6,8),stn);tw.position.set(c[0],1.8,c[1]);gC.add(tw);
      var tr=new T.Mesh(new T.ConeGeometry(1.05,1.7,8),roof);tr.position.set(c[0],4.4,c[1]);gC.add(tr);
      bx(.22,.4,.05,c[0],2.7,c[1]+(c[1]>0?.8:-.8),glow);
    });
    bx(4.2,1.8,.4,0,.9,2.5);bx(4.2,1.8,.4,0,.9,-2.5);bx(.4,1.8,4.2,2.5,.9,0);bx(.4,1.8,4.2,-2.5,.9,0);
    bx(1.1,1.4,.15,0,.7,2.72,dk);bx(.4,.6,.05,0,2.3,1.55,glow);
    var pl=new T.Mesh(new T.CylinderGeometry(.04,.04,1.2,5),stn);pl.position.set(0,5.7,0);gC.add(pl);
    bx(.7,.4,.05,.4,6.0,0,mapMat(0xd8362a));
  })();
  // bandeira do cume
  var fp=new T.Mesh(new T.CylinderGeometry(.06,.06,2.4,6),mapMat(0xeeeeee));fp.position.set(-19,10.9,-27.5);mapScene.add(fp);
  var ff=new T.Mesh(new T.BoxGeometry(1.2,.7,.05),mapMat(0xd8362a));ff.position.set(-18.4,11.7,-27.5);mapScene.add(ff);
  }
  /* barquinho do mapa: leva o Kuro e a raposinha pelo mar */
  (function(){var g=new T.Group(),h=new T.Mesh(new T.SphereGeometry(1,16,8,0,6.283,Math.PI/2,Math.PI/2),mapMat(0x9a5a2e,.8,{side:T.DoubleSide,flatShading:false}));h.scale.set(1.05,.55,2.3);g.add(h);
    var rim=new T.Mesh(new T.TorusGeometry(1,.07,6,24),mapMat(0xd8a060));rim.rotation.x=Math.PI/2;rim.scale.set(1.05,2.3,1);g.add(rim);
    var fv=makeFoxVis();fv.g.scale.setScalar(1.1);fv.g.position.set(.25,-.05,1.0);fv.g.rotation.z=0;fv.g.rotation.y=-Math.PI/2;g.add(fv.g);
    var wk=new T.Mesh(new T.RingGeometry(.9,1.6,20,1,Math.PI*.15,Math.PI*.7),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55,depthWrite:false,side:T.DoubleSide}));wk.rotation.x=-Math.PI/2;wk.position.set(0,-.5,-3.4);wk.rotation.z=Math.PI;wk.scale.set(.9,1.4,1);g.add(wk);
    g.visible=false;mapScene.add(g);mapBoat={g:g,wk:wk}})();
  // nós das fases
  for(i=IS.off;i<IS.off+IS.n;i++){
    var s0=mapPath.nodeS[i],pp=mapPosAt(s0),g=new T.Group();g.position.set(pp.x,pp.y,pp.z);
    var disc=new T.Mesh(new T.CylinderGeometry(.75,.9,.2,18),mapMat(0xffc233,.6));disc.position.y=.1;g.add(disc);
    var pole=new T.Mesh(new T.CylinderGeometry(.05,.05,1.2,6),mapMat(0xeeeeee));pole.position.y=.8;g.add(pole);
    var lab=new T.Sprite(new T.SpriteMaterial({map:mapLabel(i+1,'open'),transparent:true,depthWrite:false,depthTest:false}));lab.scale.set(1.9,1.9,1);lab.position.y=2.4;lab.renderOrder=5;g.add(lab);
    var gems=[];for(j=0;j<3;j++){var gm=new T.Mesh(new T.OctahedronGeometry(.17,0),mapMat(0x55d8ff,.3,{emissive:0x1a90c0,emissiveIntensity:.6}));gm.position.set((j-1)*.4,1.15+Math.abs(j-1)*-.0,0);gm.visible=false;g.add(gm);gems.push(gm)}
    var hit=new T.Mesh(new T.SphereGeometry(1.5,8,6),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.y=1.1;hit.userData.node=i;g.add(hit);
    mapScene.add(g);mapNodes[i]={g:g,disc:disc,lab:lab,gems:gems,hit:hit,state:''};
  }
  // nuvens (fase bloqueada)
  for(i=IS.off;i<IS.off+IS.n;i++){
    var p=MP[i-IS.off];mapClouds[i]=[];
    for(j=0;j<7;j++){
      var sp=new T.Sprite(new T.SpriteMaterial({map:sprTex,color:0xe9f2f9,transparent:true,opacity:.92,depthWrite:false,fog:false}));
      var a2=r()*6.283,d2=r()*p.r*.7;sp.position.set(p.x+Math.cos(a2)*d2,p.y+3.2+r()*1.4,p.z+Math.sin(a2)*d2);var sc2=8+r()*5;sp.scale.set(sc2,sc2*.75,1);sp.renderOrder=3;mapScene.add(sp);
      mapClouds[i].push({s:sp,a:.92,y0:sp.position.y});
    }
  }
}
/* maquete da Terra Nova: o mundo 12 (praia, trilha, rio, cogumelos e a árvore gigante); os outros ficam na neblina */
function buildMapDecor2(lm,parts,many,best,faceTo,LM,TMP){
  var gCyl=new T.CylinderGeometry(.12,.18,1,6),gIco=new T.IcosahedronGeometry(.8,0),gCap=new T.SphereGeometry(.55,9,6,0,6.283,0,1.6),gStem=new T.CylinderGeometry(.12,.16,.6,6);
  var bark=['#6b4a2e'],greens=['#58c23c','#6ed24a','#4cb034','#7ad85a'],p=MP[11],k,a;
  /* praia: faixa de areia na beira, barquinho e coqueiros */
  var bx=p.x-p.r*.62,bz=p.z+p.r*.55;
  lm(new T.CylinderGeometry(3.2,3.4,.2,16,1,false,0,Math.PI),0xf2deae,bx,p.y+.02,bz,[0,-2.4,0]);
  lm(new T.BoxGeometry(1.3,.32,.55),0x8a5a32,bx-2.2,-.72,bz+2.2,[0,.7,0]);lm(new T.BoxGeometry(1.1,.08,.45),0xc89a5a,bx-2.2,-.54,bz+2.2,[0,.7,0]);
  for(k=0;k<4;k++){var px=bx+Math.cos(k*1.3+.4)*1.6,pz=bz-.6+Math.sin(k*1.3)*1.1;
    for(var sg=0;sg<4;sg++)lm(new T.CylinderGeometry(.07,.09,.42,5),0x9a7448,px+sg*.07,p.y+.21+sg*.4,pz,[0,0,-.18]);
    for(var f=0;f<5;f++){a=f/5*6.283;lm(new T.ConeGeometry(.12,.95,4),0x3fae4a,px+.3+Math.cos(a)*.42,p.y+1.72,pz+Math.sin(a)*.42,[Math.cos(a)*1.25,0,-Math.sin(a)*1.25])}}
  /* árvore gigante com casinhas e balões */
  var t=best(11,2.2,.55),tx=t.x+1.2,tz=t.z-1,ty=p.y;
  lm(new T.CylinderGeometry(1.1,1.8,7,10),0x7a5634,tx,ty+3.5,tz);
  for(k=0;k<5;k++){a=k*1.26;lm(new T.CylinderGeometry(.18,.45,2.4,6),0x6a4a2c,tx+Math.cos(a)*1.6,ty+.5,tz+Math.sin(a)*1.6,[Math.sin(a)*.9,0,-Math.cos(a)*.9])}
  [[0,8.2,0,3.2],[2.1,7,1.1,2.1],[-2.1,7.3,-.6,2.2],[.6,9.6,-1,1.9],[-1,6.8,1.6,1.8]].forEach(function(q,j){lm(new T.IcosahedronGeometry(q[3],1),[0x4fae44,0x5cbc4a,0x3f9a3a,0x6ac850,0x48a640][j],tx+q[0],ty+q[1],tz+q[2],0,[1.15,.82,1.15])});
  [[1.45,2.6,0],[-1.3,4.2,.6],[.4,5.4,1.35]].forEach(function(q,j){var hx=tx+q[0],hz=tz+q[2];lm(new T.BoxGeometry(.8,.62,.7),[0xd8b080,0xc89a68,0xe0c090][j],hx,ty+q[1],hz);lm(new T.ConeGeometry(.66,.5,4),[0xc8402a,0x3a6ab8,0xd88a2a][j],hx,ty+q[1]+.55,hz,[0,Math.PI/4,0]);
    lm(new T.BoxGeometry(1.2,.08,.9),0x8a6038,hx,ty+q[1]-.34,hz)});
  for(k=0;k<6;k++){a=k*1.05;lm(new T.BoxGeometry(.8,.1,.4),0x9a6a3a,tx+Math.cos(a)*1.55,ty+.6+k*.85,tz+Math.sin(a)*1.55,[0,-a,0])}
  (function(){var bs=[];[[0xff5a5a,-2.4,10.5,1],[0xffd23a,2.6,11.4,-.6],[0x5ab0ff,.4,12.6,1.8]].forEach(function(q,j){var g=new T.Group(),b=new T.Mesh(new T.SphereGeometry(.45,12,9),mapMat(q[0],.6));b.scale.set(1,1.15,1);g.add(b);
      var bk=new T.Mesh(new T.BoxGeometry(.22,.18,.22),mapMat(0x8a5a32));bk.position.y=-.8;g.add(bk);g.position.set(tx+q[1],ty+q[2],tz+q[3]);mapScene.add(g);bs.push({g:g,y:ty+q[2],ph:j*2.1})});
    mapFx.push(function(dt,t2){bs.forEach(function(o){o.g.position.y=o.y+Math.sin(t2*.8+o.ph)*.35;o.g.rotation.y=t2*.3+o.ph})})})();
  /* rio com ponte e cachoeira saindo da ilha */
  (function(){var rv=new T.Mesh(new T.PlaneGeometry(1.1,p.r*1.5,1,8),new T.MeshStandardMaterial({color:0x4ac8e8,roughness:.15,transparent:true,opacity:.9}));rv.rotation.x=-Math.PI/2;rv.rotation.z=.9;rv.position.set(p.x+1.4,p.y+.05,p.z+2);mapScene.add(rv);
    var fall=new T.Mesh(new T.PlaneGeometry(1.1,2.6),new T.MeshBasicMaterial({color:0xcff4ff,transparent:true,opacity:.8}));fall.position.set(p.x+1.4+Math.cos(-.9)*p.r*.78,p.y-1.3,p.z+2+Math.sin(.9)*p.r*.62);fall.rotation.y=-.9;mapScene.add(fall);
    mapFx.push(function(dt,t2){fall.material.opacity=.65+Math.sin(t2*6)*.15})})();
  /* cogumelos vermelhos de pintinhas e árvores redondas */
  parts(many(11,9,.15,.88),[{g:gStem,o:[0,.3,0],pal:['#f2ead8']},{g:gCap,o:[0,.58,0],sc:.95,pal:['#e8402a','#d83a3a','#ff6a3a']}]);
  parts(many(11,12,.1,.9),[{g:gCyl,o:[0,.5,0],pal:bark},{g:gIco,o:[0,1.5,0],pal:greens}]);
  parts(many(11,14,.1,.92),[{g:gIco,o:[0,.15,0],sc:.35,pal:['#ff9ad0','#ffe066','#ffffff','#9ad8ff','#ff7a5a']}]);
  /* Mundo 15 (Mina dos Trilhos): morro de pedra com a boca da mina, escoras, trilhos, um vagonete com ouro e cristais */
  (function(){var q=MP[14],t=best(14,2.4,.6),mx=t.x,mz=t.z-.6,my=q.y;
    lm(new T.IcosahedronGeometry(2.4,1),0x7a6452,mx,my+.7,mz,0,[1.35,.8,1.05]);lm(new T.IcosahedronGeometry(1.5,1),0x8f7864,mx+1.9,my+.4,mz+.6,0,[1,.75,1]);lm(new T.IcosahedronGeometry(1.2,1),0x6a5646,mx-1.9,my+.35,mz+.4);
    lm(new T.BoxGeometry(1.05,1.25,.3),0x120a04,mx,my+.62,mz+2.38);
    [-.6,.6].forEach(function(dx){lm(new T.BoxGeometry(.2,1.5,.2),0x8a6038,mx+dx,my+.75,mz+2.5)});lm(new T.BoxGeometry(1.5,.22,.26),0x8a6038,mx,my+1.55,mz+2.5);
    [-.28,.28].forEach(function(dx){lm(new T.BoxGeometry(.06,.06,3.2),0xc8ccd2,mx+dx,my+.1,mz+4.05)});for(var k=0;k<7;k++)lm(new T.BoxGeometry(.8,.05,.14),0x5a3e26,mx,my+.05,mz+2.7+k*.45);
    lm(new T.BoxGeometry(.75,.42,.55),0xa0522d,mx,my+.42,mz+4.4);for(k=0;k<4;k++)lm(new T.DodecahedronGeometry(.13,0),0xffc63a,mx-.2+k*.13,my+.68,mz+4.35+(k%2)*.1);
    [[-.25,.15],[.25,.15],[-.25,-.15],[.25,-.15]].forEach(function(w){lm(new T.CylinderGeometry(.11,.11,.06,8),0x4a4e54,mx+w[0],my+.16,mz+4.4+w[1]*1.6,[0,0,Math.PI/2])});
    [[-2.4,1.6,0x6ff0ff],[2.6,1.2,0xd890ff],[-1.2,-1.6,0xd890ff],[1.4,-1.8,0x6ff0ff],[3,-.4,0x6ff0ff]].forEach(function(c,j){lm(new T.OctahedronGeometry(.32,0),c[2],mx+c[0],my+.45,mz+c[1],[.2*j,j,.3],[.7,1.7,.7]);lm(new T.OctahedronGeometry(.2,0),c[2],mx+c[0]+.3,my+.3,mz+c[1]+.2,[.5,j,-.4],[.7,1.6,.7])})})();
  /* nos outros mundos só colinas e árvores simples (vão ficar escondidos na neblina) */
  for(var w=12;w<MP.length;w++)if(w!==14)parts(many(w,5,.15,.85),[{g:gCyl,o:[0,.5,0],pal:bark},{g:gIco,o:[0,1.45,0],pal:greens}]);
}
function mapPosAt(s){
  var P_=mapPath.pts,L_=mapPath.len;s=Math.max(0,Math.min(mapPath.total,s));
  var lo=0,hi=L_.length-1;while(hi-lo>1){var mid=(lo+hi)>>1;if(L_[mid]<=s)lo=mid;else hi=mid}
  var f=(s-L_[lo])/Math.max(1e-6,L_[hi]-L_[lo]),a=P_[lo],b=P_[hi];
  return {x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,z:a.z+(b.z-a.z)*f,dx:b.x-a.x,dz:b.z-a.z};
}
function mapRefresh(){
  mapNodes.forEach(function(nd,i){
    var st=i>=LEVELS.length?'soon':(i>=save.unlocked?'lock':((save.best[i]>0)?'done':'open'));
    if(i<LEVELS.length&&i>=fogShown&&st!=='soon')st='lock';
    if(nd.state!==st){
      nd.state=st;if(nd.lab.material.map)nd.lab.material.map.dispose();
      nd.lab.material.map=mapLabel(i+1,st);nd.lab.material.needsUpdate=true;
      nd.disc.material.color.set(st==='done'?0x3fb86a:st==='open'?0xffc233:0x8a95a3);
    }
    var gcount=(save.gems&&save.gems[i])||0;
    nd.gems.forEach(function(g,k){g.visible=i<LEVELS.length&&st!=='lock'&&st!=='soon';g.material.color.set(k<gcount?0x55d8ff:0x5a6672);g.material.emissiveIntensity=k<gcount?.6:0})
  });
}
function mapAvatarOn(){
  if(rig.root.parent!==mapScene)mapScene.add(rig.root);
  rig.root.visible=true;
}
function mapAvatarOff(){
  if(rig.root.parent===mapScene){scene.add(rig.root)}
  rig.root.scale.set(1,1,1);rig.hips.rotation.set(0,0,0);rig.root.rotation.set(0,Math.PI/2,0);
  [rig.shL,rig.shR,rig.hipL,rig.hipR,rig.kneeL,rig.kneeR,rig.elL,rig.elR].forEach(function(j){if(j)j.rotation.set(0,0,0)});
  rig.torso.rotation.set(0,0,0);
}
function mapShowPanel(i){
  var pn=$('mapPanel');
  if(i<0||i>=LEVELS.length||i>=save.unlocked){pn.hidden=true;return}
  var g=save.gems[i]||0,bt=save.best[i]>0?fmt(save.best[i]):'—';
  $('mpW').textContent='Mundo '+(i+1);$('mpN').textContent=LEVELS[i].name;
  $('mpG').innerHTML='<span>◆ '+g+'/3</span><span>⏱ '+bt+'</span>';
  pn.hidden=false;mapSel=i;
}
function mapGo(i,instant){
  var tgt=mapPath.nodeS[i];mapSel=i;$('mapPanel').hidden=true;
  var cur=mapWalk?mapWalk.s:mapPath.nodeS[Math.max(0,mapAt)];
  if(instant||Math.abs(tgt-cur)<.05){mapWalk={s:tgt,to:tgt,node:i,moving:false};mapAt=i;mapShowPanel(i);return}
  mapWalk={s:cur,to:tgt,node:i,moving:true};
}
function openMap(opts){
  opts=opts||{};
  var from=opts.from!=null?opts.from:(mapAt>=0?mapAt:Math.max(0,Math.min(save.unlocked,LEVELS.length)-1));
  if(!mapScene)buildMap();
  state='map';card.hidden=true;$('cfg').hidden=true;
  $('hud').style.visibility='hidden';$('mapUI').hidden=false;$('mapPanel').hidden=true;
  fogShown=opts.walkTo!=null?Math.min(save.unlocked,opts.walkTo):save.unlocked;
  mapClouds.forEach(function(cl,w){var vis=(w>=LEVELS.length)||(w>=fogShown);cl.forEach(function(c){c.a=vis?.92:0;c.s.material.opacity=c.a;c.s.visible=vis})});
  if(!coarse)$('mapHint').textContent='← → ou A/D escolhe a fase · Enter/Espaço joga · Q/E zoom · Esc volta · ou clique numa fase';
  mapRefresh();mapAvatarOn();
  mapAt=from;mapWalk={s:mapPath.nodeS[from],to:mapPath.nodeS[from],node:from,moving:false};
  mapPan.x=mapPan.z=0;
  var pp=mapPosAt(mapWalk.s);mapCam.userData.tx=pp.x;mapCam.userData.tz=pp.z;
  layout();
  mapPend=null;
  if(opts.walkTo!=null&&opts.walkTo<LEVELS.length){mapPend={t:.9,to:opts.walkTo,unlock:true}}
  else mapShowPanel(from);
}
function leaveMap(){
  $('mapUI').hidden=true;mapAvatarOff();$('hud').style.visibility='';
}
function mapUpdate(dt){
  mapT+=dt;
  var w=mapWalk,moving=false;
  if(mapPend){mapPend.t-=dt;if(mapPend.t<=0){var pd=mapPend;mapPend=null;mapGo(pd.to);if(pd.unlock)mapWalk.unlock=true}}
  if(w&&w.moving){
    var dist=w.to-w.s,dir=dist>0?1:-1,sp=12*Math.max(.35,Math.min(1,Math.abs(dist)/2.2));var pq=mapPosAt(w.s);if(onSea(pq.x,pq.z))sp*=1.7;/* de barco é mais rápido */
    var st=dir*sp*dt;if(Math.abs(st)>=Math.abs(dist)){w.s=w.to;w.moving=false;mapAt=w.node;mapShowPanel(w.node);
      if(w.unlock){w.unlock=false;fogShown=save.unlocked;mapClouds.forEach(function(cl,wi){if(wi<LEVELS.length&&wi<fogShown)cl.forEach(function(c){c.a=0})});mapRefresh();try{sfx.flower()}catch(e){}}}
    else{w.s+=st;moving=true}
    mapPan.x*=Math.exp(-dt*3);mapPan.z*=Math.exp(-dt*3);
  }
  var pp=mapPosAt(w?w.s:0);
  if(moving){var ang=Math.atan2((w.to>w.s?1:-1)*pp.dx,(w.to>w.s?1:-1)*pp.dz);var da=ang-mapFace;da=Math.atan2(Math.sin(da),Math.cos(da));mapFace+=da*Math.min(1,dt*10)}
  else{var da2=0-mapFace;da2=Math.atan2(Math.sin(da2),Math.cos(da2));mapFace+=da2*Math.min(1,dt*4)}
  var sc=2;
  rig.root.scale.set(sc,sc,sc);rig.root.rotation.set(0,mapFace,0);
  mapPh+=dt*(moving?15:0);var sw=Math.sin(mapPh),ab=Math.abs(sw),cw=Math.cos(mapPh);
  if(moving){
    /* corrida articulada: coxa, joelho dobrando na volta da perna, tornozelo, braços com cotovelo, tronco inclinado, cabeça e quadril balançando */
    var lift=function(v){return Math.max(0,v)};
    rig.hipL.rotation.x=sw*1.0-.15;rig.hipR.rotation.x=-sw*1.0-.15;
    rig.kneeL.rotation.x=.15+lift(-cw)*1.5+lift(-sw)*.4;rig.kneeR.rotation.x=.15+lift(cw)*1.5+lift(sw)*.4;
    if(rig.ankL){rig.ankL.rotation.x=-(rig.hipL.rotation.x+rig.kneeL.rotation.x)*.6;rig.ankR.rotation.x=-(rig.hipR.rotation.x+rig.kneeR.rotation.x)*.6}
    rig.shL.rotation.x=-sw*1.1;rig.shR.rotation.x=sw*1.1;rig.elL.rotation.x=-1.2+sw*.3;rig.elR.rotation.x=-1.2-sw*.3;
    rig.torso.rotation.x=.28+Math.abs(cw)*.04;rig.torso.rotation.y=sw*.18;rig.hips.rotation.y=-sw*.12;
    rig.head.rotation.x=-.2+ab*.05;rig.hips.position.y=HY+ab*.12-.04;
  }else{
    rig.torso.rotation.y*=Math.exp(-dt*10);rig.hips.rotation.y*=Math.exp(-dt*10);rig.head.rotation.x*=Math.exp(-dt*10);
    if(rig.ankL){rig.ankL.rotation.x*=Math.exp(-dt*12);rig.ankR.rotation.x*=Math.exp(-dt*12)}
    var br=Math.sin(mapT*2)*.015;
    [rig.hipL,rig.hipR,rig.kneeL,rig.kneeR,rig.elL,rig.elR].forEach(function(j){j.rotation.x*=Math.exp(-dt*12)});
    rig.shL.rotation.x*=Math.exp(-dt*12);rig.shR.rotation.x*=Math.exp(-dt*12);
    rig.torso.rotation.x=br;rig.hips.position.y=HY+br;
  }
  rig.shL.rotation.z=.14;rig.shR.rotation.z=-.14;
  var sea=onSea(pp.x,pp.z);
  if(mapBoat){mapBoat.g.visible=sea;if(sea){var bob=Math.sin(mapT*2.4)*.06;mapBoat.g.position.set(pp.x,-.4+bob,pp.z);mapBoat.g.rotation.set(Math.sin(mapT*1.7)*.05,mapFace,Math.sin(mapT*2.1)*.06);mapBoat.wk.material.opacity=moving?.55:0;
    if(!mapBoat.was){mapBoat.was=true;try{sfx.splash()}catch(e){}}}else mapBoat.was=false}
  if(sea){/* sentado no barco */rig.hipL.rotation.x=rig.hipR.rotation.x=-1.4;rig.kneeL.rotation.x=rig.kneeR.rotation.x=1.5;rig.shL.rotation.x=-.4+Math.sin(mapT*4)*.5*(moving?1:0);rig.shR.rotation.x=-.4-Math.sin(mapT*4)*.5*(moving?1:0);rig.torso.rotation.x=.1;rig.hips.position.y=HY-.35}
  rig.root.position.set(pp.x,sea?-.42+Math.sin(mapT*2.4)*.06:pp.y+.1,pp.z);
  if(mapPath.glow)mapPath.glow.scale.setScalar(1+Math.sin(mapT*3)*.12);
  for(var fi=0;fi<mapFx.length;fi++)mapFx[fi](dt,mapT);
  var k=1-Math.exp(-dt*5);
  mapCam.userData.tx+=(pp.x-mapCam.userData.tx)*k;mapCam.userData.tz+=(pp.z-mapCam.userData.tz)*k;
  var tx=mapCam.userData.tx+mapPan.x,tz=mapCam.userData.tz+mapPan.z;
  var zm=mapCam.userData.zoom||1;mapCam.position.set(tx,22*zm,tz+19*zm);mapCam.lookAt(tx,0,tz-.5);
  mapNodes.forEach(function(nd,i){
    var pulse=(i===mapSel&&nd.state==='open'||i===mapSel&&nd.state==='done')?1+Math.sin(mapT*5)*.06:1;nd.g.scale.setScalar(pulse);
    nd.gems.forEach(function(g,gi){g.rotation.y=mapT*2+gi});
  });
  mapClouds.forEach(function(cl,wi){cl.forEach(function(c){
    var target=(c.a>0)?c.a:0,o=c.s.material.opacity;o+=(target-o)*Math.min(1,dt*2.5);c.s.material.opacity=o;c.s.visible=o>.02;c.s.position.y=c.y0+Math.sin(mapT*.6+wi+c.s.position.x)*.15;
  })});
}
function mapTap(cx,cy){
  var rc=stage.getBoundingClientRect(),nd=new T.Vector2((cx-rc.left)/rc.width*2-1,-((cy-rc.top)/rc.height*2-1));
  var rcast=new T.Raycaster();rcast.setFromCamera(nd,mapCam);
  var hits=rcast.intersectObjects(mapNodes.map(function(n){return n.hit}),false);
  if(!hits.length)return;
  var i=hits[0].object.userData.node;
  if(i>=LEVELS.length){toast('Novos mundos em breve');return}
  if(i>=save.unlocked){toast('Termine a fase anterior para liberar');return}
  mapPan.x=mapPan.z=0;
  mapGo(i);
}
(function(){
  var down=null,moved=false;
  stage.addEventListener('pointerdown',function(e){if(state!=='map')return;down={x:e.clientX,y:e.clientY};moved=false});
  stage.addEventListener('pointermove',function(e){
    if(state!=='map'||!down)return;var dx=e.clientX-down.x,dy=e.clientY-down.y;
    if(!moved&&Math.hypot(dx,dy)<8)return;moved=true;
    var wpp=2*38*Math.tan(T.MathUtils.degToRad(19))*mapCam.aspect/Math.max(1,stage.clientWidth);
    /* o limite é a ilha inteira (e não a distância do Kuro): dá para olhar todos os mundos de qualquer lugar */
    var bx=mapCam.userData.tx||0,bz=mapCam.userData.tz||0;mapPan.x=Math.max(-22-bx,Math.min(22-bx,mapPan.x-dx*wpp));mapPan.z=Math.max(-100-bz,Math.min(20-bz,mapPan.z-dy*wpp*1.5));down={x:e.clientX,y:e.clientY};
  });
  function up(e){if(state==='map'&&down&&!moved)mapTap(e.clientX,e.clientY);down=null}
  stage.addEventListener('wheel',function(e){if(state!=='map')return;mapCam.userData.zoom=Math.max(.6,Math.min(2.2,(mapCam.userData.zoom||1)*(e.deltaY>0?1.1:.9)))},{passive:true});
  stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',function(){down=null});
  $('mapBack').addEventListener('click',function(){leaveMap();showMenu()});
  $('mpPlay').addEventListener('click',function(){if(mapSel>=0&&mapSel<LEVELS.length){leaveMap();startLevel(mapSel)}});
})();

var BENCH_LV=['low','med','high','ultra'];
function startBench(bt){
  if(bench)return;
  bench={i:0,skip:25,n:0,acc:0,res:{},bt:bt};
  bt.disabled=true;$('cfgClose').disabled=true;
  benchOv=BENCH_LV[0];applyGfx();
  window.__benchTxt('Testando '+({low:'Baixo',med:'Médio',high:'Alto',ultra:'Ultra'})[benchOv]+'…');
}
function benchStep(raw){
  var b=bench;if(!b)return;
  if(b.skip>0){b.skip--;return}
  b.acc+=Math.min(raw,.5);b.n++;
  if(b.n<45&&b.acc<2.2)return;
  var lv=BENCH_LV[b.i],fps=b.n/b.acc;b.res[lv]=fps;
  b.i++;
  if(b.i>=BENCH_LV.length||fps<20){
    benchOv=null;bench=null;
    cfg.bench=b.res;
    var best=0;AUTO.forEach(function(k,i){if(b.res[k]!=null&&b.res[k]>=52&&i<=(coarse?1:3))best=Math.max(best,i)});
    autoLvl=best;cfg.autoLvl=best;cfg.autoW={};
    var firstBad=AUTO.findIndex(function(k){return b.res[k]!=null&&b.res[k]<30});failedLvl=firstBad<0?99:firstBad;
    saveCfg();b.bt.disabled=false;$('cfgClose').disabled=false;
    applyGfx();
    window.__benchTxt();
    return;
  }
  b.skip=25;b.n=0;b.acc=0;benchOv=BENCH_LV[b.i];applyGfx();
  window.__benchTxt('Testando '+({low:'Baixo',med:'Médio',high:'Alto',ultra:'Ultra'})[benchOv]+'…');
}
var lastT=0;
function frame(now){
  requestAnimationFrame(frame);
  gpPoll();/* controle: lido todo quadro, até pausado e no mapa */
  if(!bench&&capMs&&now-lastT<capMs-3)return;
  lastT=(capMs&&now-lastT<capMs*2)?lastT+capMs:now;/* limite de quadros certo também em tela de 90/120 Hz */
  var raw=(now-last)/1000;last=now;
  if(bench)benchStep(raw);
  if(cfg.fps){fpsBoxN++;fpsBoxT+=raw;if(fpsBoxT>=.5){$('fpsBox').textContent=Math.round(fpsBoxN/fpsBoxT)+' FPS';fpsBoxN=0;fpsBoxT=0}}
  var dt=Math.min(.05,raw);
  if(state==='map'){mapUpdate(dt);render();return}
  var pbv=state==='play'&&!paused,pbn=$('pauseBtn');if(pbn.hidden===pbv)pbn.hidden=!pbv;
  if(paused){var cfgOn=$('cfg')&&!$('cfg').hidden;if(pauseDrawn<2||cfgOn){render();pauseDrawn++}return}/* pausado: a tela fica parada, desenha só 2 vezes (menos bateria e calor); com as configurações abertas continua desenhando a prévia */
  pauseDrawn=0;
  if(card&&!card.hidden&&(state==='menu'||state==='intro'||state==='win'||state==='dead')){menuSkip=!menuSkip;if(menuSkip){moveMovers(dt);animate(dt);return}}/* menu e cartões: o fundo anda pela metade dos quadros */
  if(state==='play'){
    if(hitStop>0){hitStop-=dt}/* congela a ação por um instante quando o golpe acerta */
    else{acc+=dt;
    while(acc>=STEP){P.ix=P.x;P.iy=P.y;step(STEP);acc-=STEP;if(state!=='play'){acc=0;break}}}
    var tlc=Math.max(0,Math.ceil(timeLeft));$('timeN').textContent=fmt(tlc);$('timeN').parentNode.classList.toggle('low',tlc<=60);
    if(tlc<=60&&!lowWarn){lowWarn=true;toast('Pouco tempo! Menos de 1 minuto');sfx.alert()}
    if(P.feather>0)$('featherN').textContent=Math.ceil(P.feather);
    var shA=!!LV.water&&(P.hd||P.air<.995),asx=$('airStat');
    if(asx.hidden===shA)asx.hidden=!shA;
    if(shA){$('airFill').style.width=(P.air*100)+'%';$('airBox').classList.toggle('low',P.air<.3)}
    if(P.cape){var pv=P.flyT>0?P.flyT/FLYMAX:P.pm;$('pmFill').style.width=(pv*100)+'%';$('pmBox').classList.toggle('full',pv>=.98||P.flyT>0)}
    perfTick(raw);/* resolução dinâmica e Automático */
  }else moveMovers(dt);
  /* interpolação (dono, 31/10): a física roda a 90 por segundo e a tela a 60/120; desenha o Kuro (e a câmera que o segue)
     no ponto certo entre os dois últimos cálculos, senão ele anda aos trancos (1 passo, 2 passos...) e parece borrado ao correr */
  var ia=state==='play'&&!hitStop&&P.ix!==undefined&&Math.abs(P.x-P.ix)<1.5&&Math.abs(P.y-P.iy)<1.5&&!P.warp,rx=P.x,ry=P.y,qx=0,qy=0;
  if(ia){var al=clamp(acc/STEP,0,1);qx=P.ix+(rx-P.ix)*al;qy=P.iy+(ry-P.iy)*al;P.x=qx;P.y=qy}
  animate(dt);
  if(ia){P.x=rx+(P.x-qx);P.y=ry+(P.y-qy)}/* volta à posição da física (mantém qualquer ajuste feito durante o desenho) */
  render();
}

/*DEBUG_HOOK*/
/* montagem em etapas com a tela de carregamento (65_carregando.js) */
ldBoot([function(){setHearts();applyGfx()},function(){buildLevel(0)},function(){resetState();updateCamera(0,true)},
  function(){openMap()/* o jogo abre direto no mapa (o título fica no botão Início) */},
  function(){try{renderer.compile(mapScene,camera)}catch(e){}}],
 function(){
  /* portal: jogador novo cai direto jogando o Mundo 1, com os controles na tela */
  if(window.PORTAL&&!(save.best&&save.best[0]>0)){leaveMap();startLevel(0);beginPlay();setTimeout(function(){toast(coarse?'Analógico à esquerda anda · botão Pular à direita':'Setas ou A/D andam · Espaço pula · Shift corre')},600)}
  /* depois de recarregar por troca de qualidade: volta direto para as configurações com a prévia */
  try{if(sessionStorage.getItem('rac-reopen')==='cfg'){sessionStorage.removeItem('rac-reopen');setTimeout(function(){if(window.__openCfg){leaveMap();if(window.__cfgFromMap)window.__cfgFromMap();window.__openCfg()}},60)}}catch(e){}
  requestAnimationFrame(frame)});
})();
</script>