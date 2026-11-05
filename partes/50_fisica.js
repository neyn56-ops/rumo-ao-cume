/*@@parte:50_fisica.js*/
/* ===================== física ===================== */
var STEP=1/90;
function moveMovers(dt){
  mt+=dt;
  for(var i=0;i<movers.length;i++){
    var m=movers[i];
    m.px=m.x;m.x=m.cx+Math.sin(mt*m.speed)*m.range;m.l=m.x-m.w/2;m.r=m.x+m.w/2;m.vxm=(m.x-m.px)/Math.max(dt,.0001);
    m.mesh.position.x=m.x;
  }
  if(volMovers.length)volChains();
}
var crysM=null,crysCapM=null;
function buildDrops(){
  if(!crysM){
    crysM=new T.MeshStandardMaterial({color:0x8fe8ff,roughness:.15,metalness:.2,emissive:0x2aa8e0,emissiveIntensity:.95});
    crysCapM=new T.MeshStandardMaterial({color:0x4a4658,roughness:.9});
  }
  (LV.drops||[]).forEach(function(d){
    if(curTheme.name==='castle'){
      var stn=M(0x6c667c,.8),dkS=M(0x403c4e,.9),teeM=M(0xe8e0cc,.6),eyeC=new T.MeshStandardMaterial({color:0x200000,emissive:0xff3a2a,emissiveIntensity:2.2});
      var chn=mesh(new T.CylinderGeometry(.04,.04,1,5),M(0x3a3640,.5,.8),false,false);add(chn);
      var g2=new T.Group();
      var hd3=mesh(new T.SphereGeometry(.5,14,10),stn);hd3.scale.set(1,1.1,1);g2.add(hd3);
      var jw=mesh(new T.BoxGeometry(.52,.2,.36),stn);jw.position.set(0,-.45,.1);g2.add(jw);
      for(var tq=0;tq<4;tq++){var th=mesh(new T.BoxGeometry(.07,.12,.05),teeM,false,false);th.position.set(-.15+tq*.1,-.34,.3);g2.add(th)}
      [-1,1].forEach(function(sd){
        var hn=mesh(new T.ConeGeometry(.11,.35,6),stn);hn.position.set(sd*.34,.5,0);hn.rotation.z=-sd*.5;g2.add(hn);
        var br=mesh(new T.BoxGeometry(.34,.09,.16),dkS);br.position.set(sd*.19,.22,.42);br.rotation.z=sd*.35;g2.add(br);
      });
      var eo=new T.Group(),ec=new T.Group();
      [-1,1].forEach(function(sd){
        var e2=mesh(new T.SphereGeometry(.09,8,6),eyeC,false,false);e2.position.set(sd*.19,.08,.42);eo.add(e2);
        var lid=mesh(new T.BoxGeometry(.22,.035,.05),dkS,false,false);lid.position.set(sd*.19,.08,.46);ec.add(lid);
      });
      eo.visible=false;g2.add(eo);g2.add(ec);g2.scale.setScalar(1.3);
      g2.position.set(d.x,d.y,0);add(g2);
      drops.push({x:d.x,y0:d.y,y:d.y,g:g2,st:0,t:0,vy:0,floor:-30,castle:true,eo:eo,ec:ec,chain:chn,top:d.y+8,cd:0});
      updChain(drops[drops.length-1]);
      return;
    }
    var pk=curTheme.name==='peaks',rn=curTheme.name==='ruins',cm=pk?snowFltM:(rn?sandBlkM:crysCapM),im=pk?iceSpkM:crysM;
    var cap=mesh(new T.DodecahedronGeometry(.55,0),cm);cap.scale.set(1.1,.7,.8);cap.position.set(d.x,d.y+.25,-.1);add(cap);
    var g=new T.Group();
    if(rn){
      var blk=mesh(new T.BoxGeometry(1.05,1.05,1.05),sandBlkM);blk.position.y=-.15;g.add(blk);
      var gl=mesh(new T.BoxGeometry(.5,.12,1.1),M(0x7a5226,.8));gl.position.y=-.1;g.add(gl);
    }else{
    var main=mesh(new T.ConeGeometry(.3,1.5,6),im,false,false);main.rotation.z=Math.PI;main.position.y=-.1;g.add(main);
    [[-.22,.5,.32,-.12],[.24,.4,.28,.15]].forEach(function(c){var m2=mesh(new T.ConeGeometry(c[2],1,6),im,false,false);m2.rotation.z=Math.PI+c[3];m2.position.set(c[0],c[1]-.35,.05);g.add(m2)});
    }
    g.position.set(d.x,d.y,0);add(g);
    drops.push({x:d.x,y0:d.y,y:d.y,g:g,st:0,t:0,vy:0,floor:-30});
  });
}