/*@@parte:21_torre_verde.js*/
/* ===================== Mundo 9: Floresta das Alturas (fase vertical) ===================== */
var leafTexC=null,fallTexC=null,lakeTexC=null;
function folTex(){
  if(leafTexC)return leafTexC;
  /* folhas desenhadas (tons de cinza: a cor de cada copa tinge por cima) */
  var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d');x.fillStyle='#6e6e6e';x.fillRect(0,0,256,256);
  var sd=11;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  for(var i=0;i<520;i++){var px=r()*256,py=r()*256,a=r()*6.283,l=7+r()*9,v=Math.round(150+r()*105);
    for(var ox=-256;ox<=256;ox+=256)for(var oy=-256;oy<=256;oy+=256){x.save();x.translate(px+ox,py+oy);x.rotate(a);
      x.fillStyle='rgb('+(v-50)+','+(v-50)+','+(v-50)+')';x.beginPath();x.ellipse(1,1,l,l*.42,0,0,6.283);x.fill();
      x.fillStyle='rgb('+v+','+v+','+v+')';x.beginPath();x.ellipse(0,0,l,l*.42,0,0,6.283);x.fill();
      x.strokeStyle='rgba(60,60,60,.5)';x.lineWidth=1;x.beginPath();x.moveTo(-l*.9,0);x.lineTo(l*.9,0);x.stroke();x.restore()}}
  leafTexC=new T.CanvasTexture(c);leafTexC.wrapS=leafTexC.wrapT=T.RepeatWrapping;leafTexC.repeat.set(2,2);leafTexC.encoding=T.sRGBEncoding;leafTexC.anisotropy=4;return leafTexC;
}
function fallTex(seed){
  /* cachoeira: listras de água correndo, bordas mais transparentes, espuma */
  var c=document.createElement('canvas');c.width=128;c.height=512;var x=c.getContext('2d'),sd=seed||5;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  var g=x.createLinearGradient(0,0,128,0);g.addColorStop(0,'rgba(170,220,240,0)');g.addColorStop(.15,'rgba(180,228,246,.55)');g.addColorStop(.5,'rgba(200,236,250,.7)');g.addColorStop(.85,'rgba(180,228,246,.55)');g.addColorStop(1,'rgba(170,220,240,0)');
  x.fillStyle=g;x.fillRect(0,0,128,512);
  for(var i=0;i<260;i++){var px=8+r()*112,py=r()*512,l=20+r()*70,w=1+r()*3.5,a=.25+r()*.6;
    for(var oy=-512;oy<=512;oy+=512){x.fillStyle='rgba(255,255,255,'+a+')';x.fillRect(px,py+oy,w,l);x.fillStyle='rgba(120,190,220,'+(a*.5)+')';x.fillRect(px+w,py+oy+3,1,l*.7)}}
  for(i=0;i<40;i++){var fx=10+r()*108,fy=r()*512;x.fillStyle='rgba(255,255,255,.8)';x.beginPath();x.arc(fx,fy,2+r()*4,0,6.283);x.fill()}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;return t;
}
function lakeTex(){
  if(lakeTexC)return lakeTexC;
  /* água do lago: ondinhas de luz (cinza claro; a cor turquesa vem do material) */
  var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d');x.fillStyle='#c8c8c8';x.fillRect(0,0,256,256);
  var sd=21;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  for(var i=0;i<170;i++){var px=r()*256,py=r()*256,l=10+r()*30;x.strokeStyle='rgba(255,255,255,'+(.35+r()*.5)+')';x.lineWidth=1+r()*2;
    for(var ox=-256;ox<=256;ox+=256)for(var oy=-256;oy<=256;oy+=256){x.beginPath();x.moveTo(px+ox,py+oy);x.quadraticCurveTo(px+ox+l*.5,py+oy-3-r()*3,px+ox+l,py+oy);x.stroke()}}
  for(i=0;i<90;i++){x.fillStyle='rgba(90,120,130,'+(.12+r()*.18)+')';x.beginPath();x.ellipse(r()*256,r()*256,8+r()*20,3+r()*6,0,0,6.283);x.fill()}
  lakeTexC=new T.CanvasTexture(c);lakeTexC.wrapS=lakeTexC.wrapT=T.RepeatWrapping;lakeTexC.repeat.set(26,10);lakeTexC.encoding=T.sRGBEncoding;lakeTexC.anisotropy=4;return lakeTexC;
}
var hFall2=null,hLifts=[],hDrafts=[],hFall=null,hSkyC=null,hBirds=[],hSwans=[];
function buildDecorHeights(th){
  var r=rnd(9191),d=new T.Object3D(),i,k,top=(LV.goal&&LV.goal.top)||130,lq=+effCfg().lush||0,lite=coarse&&lq<.6;
  /* árvore gigante atrás da fase inteira */
  var tr=new T.CylinderGeometry(8.5,10,top+40,24,1,true);scaleUV(tr,14,(top+40)/3);
  var trunk=mesh(tr,barkM,false,true);trunk.position.set(11,(top+40)/2-22,-15.5);add(trunk);
  /* galhos que seguram cada bloco flutuante (todos num lote) */
  var BR=[],LF=[];
  LV.solids.forEach(function(s){var bot=s[3]!==undefined?s[3]:-14;if(bot<=.5||s[1]-s[0]>14)return;var cx=(s[0]+s[1])/2,y=bot-.25;
    var g=new T.CylinderGeometry(.28,.5,6,7,1);g.rotateX(Math.PI/2);BR.push({g:xf(g,[cx,y,-7.5],[.12,0,0])});
    for(k=0;k<2;k++)LF.push([s[0]+(k?s[1]-s[0]:0)+(k?.2:-.2),s[2]-.2,-4.6+r()*.6,.7+r()*.4])});
  (LV.crumbles||[]).forEach(function(c){var g=new T.CylinderGeometry(.18,.32,5,6,1);g.rotateX(Math.PI/2);BR.push({g:xf(g,[(c[0]+c[1])/2,c[2]-.4,-6.8],[.1,0,0])})});
  if(BR.length)add(mesh(mergeG(BR),barkDarkM,true,false));
  /* folhagem: tufos nas pontas dos blocos e na beira do tronco; copa enorme no topo */
  for(var y=4;y<top+10;y+=3+r()*3){LF.push([1+r()*3,y,-9-r()*3,1.4+r()*1.2]);LF.push([18+r()*3,y,-9-r()*3,1.4+r()*1.2])}
  for(i=0;i<(lite?26:44);i++){var a=r()*6.283,rr=4+r()*12;LF.push([11+Math.cos(a)*rr,top+3+r()*7,-12+Math.sin(a)*rr*.6,2+r()*1.8])}
  var lm=inst(new T.SphereGeometry(1,12,9),M(0xffffff,.85,0,{map:folTex(),emissive:new T.Color(0x1e4a16),emissiveMap:folTex()}),LF.length,false),gp=['#3f9a32','#4cae3c','#33882c','#58b844'];
  LF.forEach(function(p,j){d.position.set(p[0],p[1],p[2]);d.rotation.set(r()*3,r()*3,r()*3);d.scale.set(p[3]*1.3,p[3]*.8,p[3]);d.updateMatrix();lm.setMatrixAt(j,d.matrix);lm.setColorAt(j,new T.Color(gp[j%4]))});
  if(lm.instanceColor)lm.instanceColor.needsUpdate=true;lm.receiveShadow=false;add(lm);
  /* cipós pendurados no tronco */
  var VN=[];for(i=0;i<(lite?10:18);i++){var vx=2+r()*18,vy=8+r()*(top-10),vl=3+r()*5;VN.push({g:xf(new T.CylinderGeometry(.04,.04,vl,4),[vx,vy-vl/2,-6.6-r()*1.5])})}
  add(mesh(mergeG(VN),M(0x2f7a22,.8),false,false));
  /* cachoeira descendo pela esquerda (textura que corre) */
  var wt=fallTex(5);wt.repeat.set(1,6);var wc=document.createElement('canvas');wc.width=2;wc.height=2;var wx=wc.getContext('2d');wx.fillStyle='rgba(190,230,255,.55)';wx.fillRect(0,0,64,256);
  for(i=0;i<70;i++){wx.fillStyle='rgba(255,255,255,'+(.3+r()*.5)+')';wx.fillRect(r()*64,r()*256,1+r()*3,10+r()*30)}
  var wf=mesh(new T.PlaneGeometry(2.2,62),new T.MeshBasicMaterial({map:wt,transparent:true,depthWrite:false}),false,false);wf.position.set(-1.2,31,-6);add(wf);
  /* a cachoeira desce por um paredão de pedra com musgo e nasce de uma fonte numa laje lá no alto (antes caía do nada) */
  var CL=[],cm=[0x9aa88a,0x8a9a7a,0xa4b294];
  CL.push({g:xf(new T.BoxGeometry(4.6,64,2.4),[-1.2,31,-7.5]),c:0x9aa88a});
  for(var cy=2;cy<62;cy+=4.5+r()*3){var sx=(r()<.5?-1:1);CL.push({g:xf(new T.DodecahedronGeometry(.9+r()*.7,0),[-1.2+sx*(2.2+r()*.4),cy,-6.6],[r()*3,r()*3,0],[1,1.4,.8]),c:cm[(cy|0)%3]});CL.push({g:xf(new T.BoxGeometry(1.2+r(),.35,.9),[-1.2+sx*2.1,cy+1.2,-6.3]),c:0x4f9a3a})}
  CL.push({g:xf(new T.BoxGeometry(6.4,1.6,4),[-1.2,62.6,-6.6]),c:0x9aa88a});CL.push({g:xf(new T.BoxGeometry(6.8,.5,4.3),[-1.2,63.5,-6.6]),c:0x58b040});
  [[-3.4,63.8],[1.2,64],[-1.8,64.4]].forEach(function(q){CL.push({g:xf(new T.DodecahedronGeometry(1+r()*.5,0),[q[0],q[1],-5.2],[r()*3,r()*3,0],[1.2,.9,.9]),c:0x7a8a6a})});
  add(mesh(mergeG(CL,true),M(0xffffff,.92,0,{vertexColors:true,map:texStone.map,emissive:new T.Color(0x1a2416)}),false,true));
  var src=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,opacity:.55,depthWrite:false}));src.scale.set(4,1.6,1);src.position.set(-1.2,62.2,-5.6);add(src);/* espuma onde a água sai da pedra */
  var mist=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,opacity:.5,depthWrite:false}));mist.scale.set(6,2.5,1);mist.position.set(-1,.6,-5.5);add(mist);
  hFall=wt;
  /* fundo: lago azul-turquesa, penhascos de pedra com musgo em degraus e várias cachoeiras caindo de um nível para o outro */
  var lake=mesh(new T.PlaneGeometry(220,90),new T.MeshStandardMaterial({color:0x34d0d4,roughness:.1,metalness:.25,map:lakeTex()}),false,true);lake.rotation.x=-Math.PI/2;lake.position.set(11,.04,-51);add(lake);
  var RK=[],WF=[],TOPS=[],tiers=[[6,-34],[14,-40],[24,-46],[36,-53],[50,-60],[66,-68],[84,-76]];
  tiers.forEach(function(t,ti){var h=t[0],z=t[1];
    for(var sx=-70;sx<95;sx+=16+r()*10){var w=12+r()*10,hh=h+(r()-.5)*3,rc=[0x5f8a46,0x6a9450,0x557c40][Math.abs(ti+Math.round(sx))%3];
      RK.push({g:xf(new T.BoxGeometry(w,hh,10),[sx,hh/2,z]),c:rc});RK.push({g:xf(new T.BoxGeometry(w+.6,.8,10.4),[sx,hh-.1,z]),c:0x58b040});
      for(var bo=0;bo<4;bo++)RK.push({g:xf(new T.DodecahedronGeometry(1.4+r()*1.6,0),[sx-w/2+r()*w,r()<.5?hh-.4:r()*hh,z+4.6],[r()*3,r()*3,0],[1.2,.9,.7]),c:[0x7a8a6a,0x6a7a5a,0x8a9478][bo%3]});
      for(var f=0;f<3;f++)TOPS.push([sx-w/2+r()*w,hh+.6,z+(r()-.5)*7,1.6+r()*1.6]);
      for(f=0;f<3;f++)TOPS.push([sx-w/2+r()*w,hh-.6-r()*2,z+5.2,.9+r()*.8]);
      if(r()<.8){var fw=3+r()*3.5,fx=sx+(r()-.5)*(w-fw-1),below=ti?Math.max(0,tiers[ti-1][0]-2):0,fh=hh-below,pg=new T.PlaneGeometry(fw,fh);var uv=pg.attributes.uv;for(var q=0;q<uv.count;q++)uv.setXY(q,uv.getX(q),uv.getY(q)*fh/10);
        WF.push({g:xf(pg,[fx,below+fh/2,z+5.05])});if(!lite||ti<3)vilLanMist(fx,below+.6,z+5.5,fw)}
    }});
  add(mesh(mergeG(RK,true),M(0xffffff,.92,0,{vertexColors:true,map:texStone.map}),false,true));
  var wfG=mergeG(WF),wt2=fallTex(17);hFall2=wt2;add(mesh(wfG,new T.MeshBasicMaterial({map:wt,transparent:true,depthWrite:false,color:0xf4fcff}),false,false));
  var wf2=mesh(wfG.clone(),new T.MeshBasicMaterial({map:wt2,transparent:true,depthWrite:false,opacity:.7}),false,false);wf2.position.z=.12;add(wf2);
  var tm2=inst(new T.SphereGeometry(1,10,8),M(0xffffff,.85,0,{map:folTex(),emissive:new T.Color(0x1e4a16),emissiveMap:folTex()}),TOPS.length,false);
  TOPS.forEach(function(p,j){d.position.set(p[0],p[1],p[2]);d.rotation.set(r()*3,r()*3,r()*3);d.scale.set(p[3]*1.4,p[3]*.8,p[3]);d.updateMatrix();tm2.setMatrixAt(j,d.matrix);tm2.setColorAt(j,new T.Color(['#3f9632','#4ca83c','#348a2c','#56b444'][j%4]))});
  if(tm2.instanceColor)tm2.instanceColor.needsUpdate=true;tm2.receiveShadow=false;add(tm2);
  /* flores na beira do lago */
  var FB=[];for(i=0;i<(lite?24:44);i++){var bx=i%2?-14+r()*12:23+r()*12;FB.push([bx,.2,-6.5-r()*4,.5+r()*.6])}
  var fbm=inst(new T.IcosahedronGeometry(1,1),M(0xffffff,.8),FB.length,false),fpal=['#ff6a9a','#ffb0c8','#ff4a7a','#ffffff','#f4a0ff'];
  FB.forEach(function(p,j){d.position.set(p[0],p[1],p[2]);d.rotation.set(0,r()*3,0);d.scale.set(p[3],p[3]*.7,p[3]);d.updateMatrix();fbm.setMatrixAt(j,d.matrix);fbm.setColorAt(j,new T.Color(j%3?fpal[j%5]:'#3f8a3a'))});
  if(fbm.instanceColor)fbm.instanceColor.needsUpdate=true;add(fbm);
  /* cisnes no lago e pombas brancas voando em volta da árvore */
  hSwans=[];[[-6,-11],[28,-13]].forEach(function(q,j){var g=new T.Group(),wm=M(0xffffff,.6),bm=M(0xff9a2a,.5);
    var b=mesh(new T.SphereGeometry(.45,12,8),wm);b.scale.set(1,.55,1.5);g.add(b);var nk=mesh(new T.CylinderGeometry(.07,.09,.8,6),wm);nk.position.set(0,.45,.45);nk.rotation.x=-.3;g.add(nk);
    var hd=mesh(new T.SphereGeometry(.12,8,6),wm);hd.position.set(0,.85,.55);g.add(hd);var bk=mesh(new T.ConeGeometry(.04,.16,5),bm);bk.rotation.x=Math.PI/2;bk.position.set(0,.84,.7);g.add(bk);
    g.position.set(q[0],.25,q[1]);add(g);hSwans.push({g:g,x:q[0],z:q[1],ph:j*2})});
  hBirds=[];for(i=0;i<(lite?5:9);i++){var g2=new T.Group(),wm2=M(0xffffff,.6,0,{side:T.DoubleSide}),bd=mesh(new T.SphereGeometry(.18,8,6),wm2);bd.scale.set(.8,.7,1.5);g2.add(bd);
    var wl=[];[-1,1].forEach(function(sd){var p=new T.Group();p.position.x=sd*.1;g2.add(p);var w=mesh(new T.PlaneGeometry(.7,.32),wm2,false,false);w.rotation.x=-Math.PI/2;w.position.x=sd*.35;p.add(w);wl.push({p:p,sd:sd})});
    add(g2);hBirds.push({g:g2,w:wl,r:16+r()*14,y:6+r()*110,z:-14-r()*14,sp:.12+r()*.1,ph:r()*6.283})}
  /* nuvens: um mar de nuvens no meio da subida e fiapos que passam na frente */
  var nc=lite?26:46;
  for(i=0;i<nc;i++){var cy=i<nc*.55?44+r()*12:(i<nc*.8?92+r()*10:r()*top),cs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,opacity:.55+r()*.3,depthWrite:false}));
    var sz=8+r()*14;cs.scale.set(sz,sz*.45,1);cs.position.set(-14+r()*50,cy,-14-r()*40);add(cs)}
  for(i=0;i<8;i++){var fc=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,opacity:.22,depthWrite:false}));fc.scale.set(14,3,1);fc.position.set(-4+r()*30,30+i*13+r()*5,3.2);add(fc)}
  /* flores coloridas nas beiradas */
  var FL=[];LV.solids.forEach(function(s){if(s[1]-s[0]>14)return;for(k=0;k<3;k++)FL.push([s[0]+.3+r()*(s[1]-s[0]-.6),s[2],1.6+r()*.2])});
  var fm=inst(new T.IcosahedronGeometry(.12,0),M(0xffffff,.6),FL.length,false),fp=['#ff6a8a','#ffd23a','#ffffff','#b48aff'];
  FL.forEach(function(p,j){d.position.set(p[0],p[1]+.15,p[2]);d.rotation.set(0,0,0);d.scale.setScalar(1);d.updateMatrix();fm.setMatrixAt(j,d.matrix);fm.setColorAt(j,new T.Color(fp[j%4]))});
  if(fm.instanceColor)fm.instanceColor.needsUpdate=true;add(fm);
}
function vilLanMist(x,y,z,w){var m=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,opacity:.55,depthWrite:false}));m.scale.set(w*2.2,2.2,1);m.position.set(x,y,z);add(m)}
function buildFarHeights(th,r){
  /* céu que muda com a altura: manhã embaixo, céu azul no meio, fim de tarde dourado no topo */
  var c=document.createElement('canvas');c.width=8;c.height=512;var x=c.getContext('2d'),g=x.createLinearGradient(0,512,0,0);
  g.addColorStop(0,'#d8eef6');g.addColorStop(.15,'#9fd0f0');g.addColorStop(.35,'#5aa6e6');g.addColorStop(.55,'#86bce8');g.addColorStop(.68,'#f6d08a');g.addColorStop(.85,'#f4a060');g.addColorStop(1,'#e87a50');
  x.fillStyle=g;x.fillRect(0,0,8,512);var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;
  var sk=new T.Mesh(new T.PlaneGeometry(900,300),new T.MeshBasicMaterial({map:t,fog:false,depthWrite:false}));sk.position.set(0,90,-260);farG.add(sk);hSkyC=sk;
  var sun=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xfff0c0,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));sun.scale.set(70,70,1);sun.position.set(60,170,-240);farG.add(sun);
  var i,hm=new T.MeshBasicMaterial({color:0x6a9a7a,fog:false}),hm2=new T.MeshBasicMaterial({color:0x4a7a62,fog:false});
  for(i=0;i<14;i++){var h=18+r()*22,hl=new T.Mesh(new T.ConeGeometry(22+r()*16,h,6),i%2?hm:hm2);hl.position.set(-150+i*24+r()*8,h/2-14,-170-r()*30);farG.add(hl)}
  for(i=0;i<12;i++){var cs=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,depthWrite:false,fog:false,opacity:.7}));var sz=40+r()*50;cs.scale.set(sz,sz*.3,1);cs.position.set(-160+r()*340,20+r()*150,-200);farG.add(cs)}
}
/* plataformas que sobem e descem; colunas de vento para cima */
function buildHeightsMech(){
  hLifts=[];hDrafts=[];
  (LV.lifts||[]).forEach(function(q){
    var m=new T.Group(),pl=mesh(boxGeo(q.w,.4,2.6,1.2),barkM);m.add(pl);
    var lf=mesh(new T.SphereGeometry(1,12,6),mossM);lf.scale.set(q.w/2,.12,1.3);lf.position.y=.18;m.add(lf);
    [-1,1].forEach(function(sd){var v=mesh(new T.CylinderGeometry(.05,.05,30,5),M(0x2f7a22,.8),false,false);v.position.set(sd*(q.w/2-.2),15,-.6);m.add(v)});
    add(m);var so={l:q.x-q.w/2,r:q.x+q.w/2,t:q.y0,b:q.y0-.4,oneway:false,flt:true,lift:true};solids.push(so);
    hLifts.push({q:q,so:so,m:m,ph:q.ph||0});
  });
  var leafG=new T.PlaneGeometry(.22,.14),leafM=new T.MeshStandardMaterial({color:0x6ac44a,side:T.DoubleSide,roughness:.8});
  (LV.updrafts||[]).forEach(function(u){
    var n=coarse?26:44,im=inst(leafG,leafM,n,false),ps=[];for(var i=0;i<n;i++)ps.push({h:Math.random(),a:Math.random()*6.283,r:.3+Math.random()*(u.x1-u.x0)*.45,s:.6+Math.random()*.6});
    add(im);
    var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xe8fff0,transparent:true,opacity:.18,depthWrite:false}));gl.scale.set(u.x1-u.x0+1,u.y1-u.y0+2,1);gl.position.set((u.x0+u.x1)/2,(u.y0+u.y1)/2,-.4);add(gl);
    hDrafts.push({u:u,im:im,ps:ps});
  });
}
function updHeights(dt){
  /* elevadores */
  hLifts.forEach(function(L){
    var q=L.q;L.ph+=dt*(q.sp||.5);var k=.5-.5*Math.cos(L.ph),ny=q.y0+(q.y1-q.y0)*k,dy=ny-L.so.t;
    var on=P.onPlat===L.so&&P.grounded;L.so.t=ny;L.so.b=ny-.4;L.m.position.set(q.x,ny-.2,0);if(on)P.y+=dy;
  });
  /* vento para cima */
  var dm=new T.Object3D();
  hDrafts.forEach(function(D){
    var u=D.u;
    if(!P.climb&&P.x>u.x0&&P.x<u.x1&&P.y>u.y0-1.5&&P.y<u.y1){
      var near=clamp((u.y1-P.y)/2.5,0,1),tv=11*near-2*(1-near);P.vy+=(tv-P.vy)*Math.min(1,dt*8);P.noCut=.15;P.grounded=false;P.onPlat=null;P.coyote=0;
      if(!P.draftToast){P.draftToast=true;toast('Vento para cima! Ande para o lado para sair')}
    }
    D.ps.forEach(function(p,i){p.h+=dt*p.s*.25;if(p.h>1)p.h-=1;p.a+=dt*3*p.s;
      dm.position.set((u.x0+u.x1)/2+Math.cos(p.a)*p.r,u.y0+(u.y1-u.y0)*p.h,Math.sin(p.a)*p.r*.6);dm.rotation.set(p.a,p.a*1.3,0);dm.scale.setScalar(1);dm.updateMatrix();D.im.setMatrixAt(i,dm.matrix)});
    D.im.instanceMatrix.needsUpdate=true;
  });
  if(hFall)hFall.offset.y=(hFall.offset.y+dt*.9)%1;
  if(hFall2)hFall2.offset.y=(hFall2.offset.y+dt*1.35)%1;
  if(lakeTexC){lakeTexC.offset.x=(lakeTexC.offset.x+dt*.012)%1;lakeTexC.offset.y=(lakeTexC.offset.y+dt*.006)%1}
  hBirds.forEach(function(b){b.ph+=dt*b.sp;b.g.position.set(11+Math.cos(b.ph)*b.r,b.y+Math.sin(b.ph*3)*1.2,b.z+Math.sin(b.ph)*6);b.g.rotation.y=-b.ph;var fl=Math.sin(tm*9+b.ph*20)*.7;b.w.forEach(function(w){w.p.rotation.z=w.sd*fl})});
  hSwans.forEach(function(s2){s2.ph+=dt*.15;s2.g.position.set(s2.x+Math.sin(s2.ph)*3,.25+Math.sin(tm*1.5+s2.ph)*.03,s2.z+Math.cos(s2.ph)*1.2);s2.g.rotation.y=s2.ph+Math.PI/2})
  /* a névoa muda de cor conforme sobe (manhã -> dia -> fim de tarde) */
  var k2=clamp(cam.y/((LV.goal&&LV.goal.top)||130),0,1),c1=new T.Color(0xd2e8f2),c2=new T.Color(0xa8d4f0),c3=new T.Color(0xf2c896);
  if(k2<.6)scene.fog.color.copy(c1).lerp(c2,k2/.6);else scene.fog.color.copy(c2).lerp(c3,(k2-.6)/.4);
}
/* bloco de terremoto: derruba todos os inimigos que estão perto, na tela */
function quake(b){
  shake=Math.max(shake,.7);sfx.boom();emit(dustPool,b.x,b.y+.5,20,4,.8,.8,1.3,-.2);
  var n=0;enemies.forEach(function(e){if(!e.alive||e.dorm)return;if(Math.abs(e.y-P.y)<11&&Math.abs(e.x-P.x)<16){e.alive=false;e.deadT=0;n++;emit(sparkPool,e.x,e.y+.5,10,3,.6,.35,.2,3)}});
  toast(n?'Terremoto! '+n+(n>1?' inimigos caíram':' inimigo caiu'):'Terremoto!');
}
/* flor-espinho: fica parada e cospe sementes devagar quando o Kuro está perto */
function spitAI(e,dt){
  e.cur=0;e.dir=P.x>e.x?1:-1;if(e.thT>0)e.thT-=dt;
  e.thCd=(e.thCd===undefined?1.4:e.thCd)-dt;
  if(e.thCd<=0&&state==='play'&&Math.abs(P.x-e.x)<10&&Math.abs((P.y+.6)-(e.y+.6))<3.4){fireShot(e.x+e.dir*.5,e.y+1.1,'d');e.thT=.35;e.thCd=2.6+Math.random()*.6}
}
function makeSpitter(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var st=M(0x3f8a2a,.8),pet=M(0xff7a3a,.6),ctr=M(0x5a2a10,.7),sp=M(0xfff0c8,.5),eyeM=new T.MeshStandardMaterial({color:0x220a00,emissive:0xffd23a,emissiveIntensity:1.3});
  var stem=mesh(new T.CylinderGeometry(.07,.1,.6,6),st);stem.position.y=.3;inner.add(stem);
  [-1,1].forEach(function(sd){var lf=mesh(new T.SphereGeometry(1,10,6),st);lf.scale.set(.35,.05,.15);lf.position.set(sd*.3,.12,0);lf.rotation.z=-sd*.4;inner.add(lf)});
  var head=new T.Group();head.position.y=.78;inner.add(head);
  var c=mesh(new T.SphereGeometry(.22,14,10),ctr);c.scale.set(1,1,.7);head.add(c);
  for(var i=0;i<8;i++){var a=i/8*6.283,p=mesh(new T.SphereGeometry(.16,8,6),pet);p.scale.set(1,.55,.4);p.position.set(Math.cos(a)*.3,Math.sin(a)*.3,-.04);p.rotation.z=a;head.add(p)}
  for(i=0;i<6;i++){var a2=i/6*6.283,s=mesh(new T.ConeGeometry(.04,.18,4),sp);s.position.set(Math.cos(a2)*.16,Math.sin(a2)*.16,.12);s.rotation.x=Math.PI/2;head.add(s)}
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.045,8,6),eyeM,false,false);e.position.set(sd*.08,.05,.16);head.add(e)});
  inner.scale.setScalar(1.45);add(g);return {g:g,inner:inner,head:head};
}
function makeBird(){
  var g=new T.Group(),inner=new T.Group();g.add(inner);
  var bm=M(0x3a7ad0,.6),wh=M(0xf4f4f0,.6),wm=M(0x2a5aa8,.7,0,{side:T.DoubleSide}),bk=M(0xf0a020,.5),em=M(0x101010,.4);
  var body=mesh(new T.SphereGeometry(.24,14,10),bm);body.scale.set(.85,.8,1.25);inner.add(body);
  var bel=mesh(new T.SphereGeometry(.2,12,8),wh);bel.scale.set(.8,.7,1);bel.position.set(0,-.06,.05);inner.add(bel);
  var hd=mesh(new T.SphereGeometry(.15,12,10),bm);hd.position.set(0,.12,.3);inner.add(hd);
  var b=mesh(new T.ConeGeometry(.055,.18,6),bk);b.rotation.x=Math.PI/2;b.position.set(0,.1,.48);inner.add(b);
  [-1,1].forEach(function(sd){var e=mesh(new T.SphereGeometry(.03,6,5),em,false,false);e.position.set(sd*.08,.16,.4);inner.add(e)});
  var tl=mesh(new T.ConeGeometry(.12,.3,4),bm);tl.rotation.x=-Math.PI/2;tl.scale.set(1,1,.3);tl.position.set(0,0,-.36);inner.add(tl);
  var wings=[];[-1,1].forEach(function(sd){var p=new T.Group();p.position.set(sd*.16,.06,0);inner.add(p);var w=mesh(new T.BoxGeometry(.7,.03,.4),wm);w.position.x=sd*.35;p.add(w);wings.push({p:p,sd:sd})});
  add(g);return {g:g,inner:inner,wings:wings};
}
