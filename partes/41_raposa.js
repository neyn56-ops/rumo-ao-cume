/*@@parte:41_raposa.js*/
/* ===================== Raposinha Foguete (montaria) ===================== */
var fox=null,FOXH=.62,foxGeoCache={};
function makeFoxVis(skin,semSela){
  /* cada parte animada vira 1 malha só (cores por vértice): ~7 desenhos por quadro, leve no celular */
  var C={org:0xec741f,crm:0xf8e4c4,brn:0x5a3020,paw:0x9a5426,blk:0x1a1210,blu:0x2f62b8,lea:0x7a4a2a,gld:0xf0b030,wht:0xffffff,iri:0x7a3a12,mth:0x6a1a22,tng:0xe86a78,rol:0x2f62b8,acc:0xec741f};
  /* visual novo da Terra Nova (Mundo 12 em diante, pedido do dono): pelo preto, topete e faixas laranja, ponta do rabo branca, patas pretas, olhos verdes, lenço laranja e rolinho laranja */
  if(skin===undefined)skin=(typeof rig!=='undefined'&&rig.outfit===1)?1:0;
  if(skin===1){C.org=0x2a2a30;C.brn=0x121216;C.paw=0x111114;C.blu=0xf07a1a;C.rol=0xc8641c;C.iri=0x4ea52c;C.acc=0xf27f1c}/* pelo preto (o verde sumia na floresta), detalhes laranja e olhos verdes */
  var groups={},o3=new T.Object3D(),col=new T.Color();
  function part(key,geo,c,p,r,s){
    if(semSela&&(c==='lea'||c==='rol'||(c==='gld'&&p[0]<0)))return;/* sem sela, bolsas e rolinho (tela de carregamento) */
    o3.position.set(p[0],p[1],p[2]);o3.rotation.set(r?r[0]:0,r?r[1]:0,r?r[2]:0);o3.scale.set(s?s[0]:1,s?s[1]:1,s?s[2]:1);o3.updateMatrix();
    var g=(geo.index?geo.toNonIndexed():geo.clone());g.applyMatrix4(o3.matrix);if(!g.attributes.normal)g.computeVertexNormals();
    (groups[key]=groups[key]||[]).push({g:g,c:C[c]});
  }
  /* tufo de pelo: cone achatado que nasce na superfície; 'flex' (0 na raiz, 1 na ponta) faz a ponta balançar no shader.
     A normal do tufo é a da pele (sombreado macio, sem cara de espinho) e a ponta fica mais clara (pelo dourado na luz). */
  var up=new T.Vector3(0,1,0),qd=new T.Quaternion(),dv=new T.Vector3(),nv=new T.Vector3(),TIP=new T.Color(0xfff0d8).convertSRGBToLinear();
  function tuft(key,p,d,len,rad,c,nrm){
    var g=new T.ConeGeometry(rad,len,5,1,true);g.translate(0,len/2,0);/* tufo mais leve: 1 segmento e sem tampa (a base fica dentro do corpo) */g.rotateY(rr()*6.28);g.scale(1,1,.55);g=g.toNonIndexed();
    var pa=g.attributes.position,f=new Float32Array(pa.count);for(var i=0;i<pa.count;i++)f[i]=Math.max(0,pa.getY(i)/len);
    dv.set(d[0],d[1],d[2]).normalize();qd.setFromUnitVectors(up,dv);o3.position.set(p[0],p[1],p[2]);o3.quaternion.copy(qd);o3.scale.set(1,1,1);o3.updateMatrix();
    g.applyMatrix4(o3.matrix);nv.set(nrm?nrm[0]:d[0],nrm?nrm[1]:d[1],nrm?nrm[2]:d[2]).normalize().lerp(dv,.25).normalize();
    var na=g.attributes.normal;for(i=0;i<na.count;i++)na.setXYZ(i,nv.x,nv.y,nv.z);
    (groups[key]=groups[key]||[]).push({g:g,c:C[c],f:f,v:.92+rr()*.16});
  }
  var rr=(function(sd){return function(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}})(4242);
  /* espalha tufos num elipsoide (centro c, raios e); varre para trás (-x) */
  function shag(key,cn,e,num,len,rad,ok,colf,sweep){
    for(var i=0;i<num;i++){var u=rr()*2-1,a=rr()*Math.PI*2,q=Math.sqrt(1-u*u),dx=q*Math.cos(a),dy=u,dz=q*Math.sin(a);
      if(ok&&!ok(dx,dy,dz))continue;var L=len*(.7+rr()*.6);
      tuft(key,[cn[0]+dx*e[0]*.92,cn[1]+dy*e[1]*.92,cn[2]+dz*e[2]*.92],[dx+sweep[0],dy+sweep[1],dz+sweep[2]],L,rad*(.8+rr()*.4),colf(dx,dy,dz),[dx/e[0],dy/e[1],dz/e[2]])}
  }
  function build(key){
    var L=groups[key],n=0;L.forEach(function(q){n+=q.g.attributes.position.count});
    var pos=new Float32Array(n*3),nor=new Float32Array(n*3),cl=new Float32Array(n*3),uv=new Float32Array(n*2),fx=new Float32Array(n),o=0,c2=new T.Color();
    L.forEach(function(q){var a=q.g.attributes.position.array,b=q.g.attributes.normal.array,cn=q.g.attributes.position.count;pos.set(a,o*3);nor.set(b,o*3);col.setHex(q.c);col.convertSRGBToLinear();
      if(q.g.attributes.uv)uv.set(q.g.attributes.uv.array,o*2);if(q.f)fx.set(q.f,o);
      for(var i=0;i<cn;i++){c2.copy(col);if(q.f){c2.multiplyScalar(q.v*(.82+.18*q.f[i]));c2.lerp(TIP,q.f[i]*q.f[i]*.38)}cl[(o+i)*3]=c2.r;cl[(o+i)*3+1]=c2.g;cl[(o+i)*3+2]=c2.b}o+=cn});
    var bg=new T.BufferGeometry();bg.setAttribute('position',new T.BufferAttribute(pos,3));bg.setAttribute('normal',new T.BufferAttribute(nor,3));bg.setAttribute('color',new T.BufferAttribute(cl,3));
    bg.setAttribute('uv',new T.BufferAttribute(uv,2));bg.setAttribute('flex',new T.BufferAttribute(fx,1));
    return mesh(bg,foxMat());
  }
  var GB=foxGeoCache[skin];
  if(!GB){/* a raposinha é montada uma vez só por visual; nas próximas vezes reaproveita (antes travava ao aparecer) */
  var lf=LITE?.68:1,Cap=function(r,l){return new T.CapsuleGeometry(r,l,LITE?4:6,LITE?9:12)},Sph=function(r,w,h){return new T.SphereGeometry(r,Math.max(6,Math.round((w||14)*lf)),Math.max(5,Math.round((h||10)*lf)))};/* modo leve: esferas com menos faces (do tamanho dela no jogo não se nota) */
  /* corpo */
  part('b',Cap(.26,.46),'org',[0,.6,0],[0,0,Math.PI/2],[1,1,.92]);
  part('b',Sph(.22),'crm',[.12,.48,0],0,[1.3,.75,.85]);
  part('b',Sph(.2),'crm',[.33,.66,0],0,[.9,1.05,.95]);
  part('b',new T.TorusGeometry(.17,.05,8,20),'blu',[.34,.8,0],[Math.PI/2,0,.5]);
  part('b',new T.ConeGeometry(.13,.24,3),'blu',[.45,.66,0],[0,0,Math.PI+.4],[1,1,.5]);
  part('b',new T.CylinderGeometry(.045,.045,.02,14),'gld',[.5,.7,0],[0,0,Math.PI/2+.4]);
  part('b',new T.BoxGeometry(.42,.1,.5),'lea',[-.06,.86,0]);
  [-1,1].forEach(function(sd){part('b',new T.BoxGeometry(.3,.28,.04),'lea',[-.06,.72,sd*.25]);part('b',new T.TorusGeometry(.05,.015,6,12),'gld',[-.06,.72,sd*.275])});
  part('b',new T.CylinderGeometry(.1,.1,.52,14),'rol',[-.32,.9,0],[Math.PI/2,0,0]);[-1,1].forEach(function(sd){part('b',new T.TorusGeometry(.1,.015,6,14),'lea',[-.32,.9,sd*.17])});
  /* cabeça fofa: olhos grandes com brilho, sobrancelhas, focinho redondo e sorriso */
  part('h',Sph(.27,20,16),'org',[0,0,0],0,[1,.94,1]);
  part('h',Sph(.125,14,10),'crm',[.26,-.085,0],0,[1.15,.78,.95]);
  part('h',Sph(.048,10,8),'blk',[.395,-.04,0],0,[.9,.75,1.2]);
  part('h',Sph(.013,6,5),'wht',[.425,-.02,.018]);
  part('h',Sph(.042,10,8),'mth',[.325,-.15,0],0,[.7,.5,1.3]);
  part('h',Sph(.026,8,6),'tng',[.338,-.165,0],0,[.7,.45,1.2]);
  [-1,1].forEach(function(sd){
    part('h',Sph(.14),'crm',[.1,-.09,sd*.15],0,[1,.82,.92]);
    part('h',Sph(.088,14,12),'wht',[.17,.05,sd*.135],0,[.7,1.15,1]);
    part('h',Sph(.064,12,10),'iri',[.215,.04,sd*.142],0,[.6,1.1,.92]);
    part('h',Sph(.037,10,8),'blk',[.245,.04,sd*.146],0,[.5,1,.85]);
    part('h',Sph(.019,6,5),'wht',[.262,.08,sd*.13]);
    part('h',Sph(.009,5,4),'wht',[.258,.01,sd*.156]);
    part('h',Cap(.011,.075),'blk',[.2,.175,sd*.135],[Math.PI/2+sd*.35,0,-.25]);
    [0,1].forEach(function(k){part('h',new T.ConeGeometry(.008,.05,4),'blk',[.17+k*.02,.135,sd*(.2+k*.012)],[sd*.9,0,-.5-k*.3])});
    var er=[sd*-.28,0,.12];
    /* orelha grande com miolo claro e pelinho dentro */
    part('h',new T.ConeGeometry(.15,.44,8),'org',[-.015,.42,sd*(.2)],er,[1,1,.55]);
    part('h',new T.ConeGeometry(.095,.32,8),'crm',[.012,.38,sd*.19],er,[1,1,.4]);
    part('h',new T.ConeGeometry(.075,.15,8),'brn',[-.04,.585,sd*.26],er,[1,1,.6]);
    for(var i=0;i<4;i++)tuft('h',[.03,.27+i*.035,sd*(.18+i*.012)],[.25,1,sd*(.5+rr()*.3)],.1+rr()*.04,.035,'wht',[1,.3,sd*.3]);
  });
  /* cauda */
  part('t',Sph(.2),'org',[-.15,.1,0],0,[1.3,.9,.9]);
  part('t',Sph(.25),'org',[-.42,.3,0],0,[1.2,1,1]);
  part('t',Sph(.18),'crm',[-.67,.47,0],0,[1.2,1,1]);
  /* pelagem: tufos em camadas no corpo (sem passar pela sela), peito branco cheio, bochechas, topete, cauda bem felpuda */
  shag('b',[0,.6,0],[.49,.26,.24],95,.1,.06,function(x,y,z){return !(y>.35&&x>-.55&&x<.35)&&!(x>.55&&y>-.2)},function(x,y){return y<-.4?'crm':'org'},[-2.2,.2,0]);
  shag('b',[.36,.62,0],[.15,.18,.18],46,.11,.06,function(x,y,z){return x>-.1&&y<.6},function(){return 'crm'},[.2,-1.4,0]);
  shag('h',[0,0,0],[.27,.25,.27],50,.09,.055,function(x,y,z){return x<.05&&y>-.55},function(){return 'org'},[-2,.4,0]);
  [-1,1].forEach(function(sd){for(var i=0;i<8;i++)tuft('h',[.06-i*.025,-.06-i*.018+rr()*.02,sd*(.2+rr()*.03)],[-.7,-.5-rr()*.4,sd*(.8+rr()*.4)],.11+rr()*.05,.055,i<6?'crm':'org',[0,-.2,sd])});
  for(var i=0;i<7;i++)tuft('h',[.02-i*.03+rr()*.02,.21+rr()*.02,(rr()-.5)*.14],[-.2-i*.15,1,(rr()-.5)*.6],.13+rr()*.05,.05,'acc',[0,1,0]);/* topete (laranja no visual novo) */
  shag('t',[-.15,.1,0],[.26,.18,.18],22,.1,.06,null,function(){return 'org'},[-2,.6,0]);
  shag('t',[-.42,.3,0],[.3,.25,.25],62,.12,.065,null,function(x){return x<-.55?'crm':(x<-.1?'acc':'org')},[-2,.7,0]);
  shag('t',[-.67,.47,0],[.22,.18,.18],40,.12,.065,null,function(){return 'crm'},[-2,1.1,0]);
  /* uma pata (reaproveitada nas 4), com joelho: coxa + canela/pé redondo */
  part('l',Cap(.08,.16),'org',[0,-.12,0]);
  part('k',Cap(.066,.13),'org',[0,-.085,0]);
  part('k',Sph(.085,12,8),'paw',[.035,-.2,0],0,[1.35,.62,1.1]);part('k',new T.TorusGeometry(.068,.022,6,14),'acc',[0,-.1,0],[Math.PI/2,0,0]);/* faixa na pata */
  [-1,0,1].forEach(function(z){part('k',new T.BoxGeometry(.004,.035,.006),'brn',[.135,-.2,z*.03])});
  for(var i=0;i<6;i++)tuft('l',[(rr()-.5)*.1,-.04-rr()*.14,(rr()-.5)*.12],[-1.5,-.4,(rr()-.5)],.08,.045,'org');
  GB=foxGeoCache[skin]={b:build('b').geometry,h:build('h').geometry,t:build('t').geometry,l:build('l').geometry,k:build('k').geometry};}
  function mk(k){return mesh(GB[k],foxMat())}
  var g=new T.Group(),b=new T.Group();g.add(b);
  b.add(mk('b'));
  var head=new T.Group();head.position.set(.46,.95,0);head.add(mk('h'));b.add(head);
  var tail=new T.Group();tail.position.set(-.48,.7,0);tail.add(mk('t'));b.add(tail);
  var legM=mk('l'),knM=mk('k'),legs=[];
  [[.3,1],[.3,-1],[-.28,1],[-.28,-1]].forEach(function(q,i){var lg=new T.Group();lg.position.set(q[0],.5,q[1]*.15);lg.add(i?new T.Mesh(legM.geometry,legM.material):legM);lg.children[0].castShadow=true;
    var kn=new T.Group();kn.position.set(0,-.25,0);var km=i?new T.Mesh(knM.geometry,knM.material):knM;km.castShadow=true;kn.add(km);lg.add(kn);lg.knee=kn;lg.hip=0;lg.kb=0;b.add(lg);legs.push(lg)});
  var fl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff9a2a,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:0}));fl.scale.set(1.6,.9,1);fl.position.set(-1.1,.7,0);b.add(fl);
  var fl2=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xfff0a0,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:0}));fl2.scale.set(.8,.5,1);fl2.position.set(-.85,.7,0);b.add(fl2);
  return {g:g,b:b,head:head,tail:tail,legs:legs,ears:[],flame:fl,flame2:fl2};
}
var foxMatC=null,foxFurU={t:{value:0},v:{value:new T.Vector3()}};
function furTex(){/* fios de pelo desenhados: listras curtas claras/escuras (cor) e relevo (bump) */
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');x.fillStyle='rgb(240,240,240)';x.fillRect(0,0,128,128);
  var sd=77;function r(){sd=(sd*16807)%2147483647;return (sd-1)/2147483646}
  for(var i=0;i<2200;i++){var px=r()*128,py=r()*128,l=3+r()*7,lt=r()<.5,w=.6+r()*.8,dx=(r()-.5)*2;
    x.strokeStyle=lt?'rgba(255,255,255,.32)':'rgba(205,205,205,.26)';x.lineWidth=w;
    for(var ox=-128;ox<=128;ox+=128)for(var oy=-128;oy<=128;oy+=128){x.beginPath();x.moveTo(px+ox,py+oy);x.quadraticCurveTo(px+ox+dx,py+oy+l*.5,px+ox+dx*1.6,py+oy+l);x.stroke()}}
  var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(6,4);t.encoding=T.sRGBEncoding;t.anisotropy=4;return t}
function foxMat(){if(foxMatC)return foxMatC;var ft=furTex();
  foxMatC=M(new T.Color(1.08,1.08,1.08),.85,0,{vertexColors:true,map:ft});regBump(foxMatC,ft);foxMatC.bumpMap=bumpOn===false?null:ft;foxMatC.bumpScale=.35;
  foxMatC.onBeforeCompile=function(sh){sh.uniforms.furT=foxFurU.t;sh.uniforms.furV=foxFurU.v;
    sh.vertexShader='attribute float flex;uniform float furT;uniform vec3 furV;\n'+sh.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nfloat fk=flex*flex;vec3 fp=position*9.;\ntransformed+=fk*(furV*.07+vec3(sin(furT*7.+fp.x+fp.z*1.7),cos(furT*6.3+fp.y*1.3+fp.z),sin(furT*5.1+fp.x*1.1+fp.y))*(.007+.014*length(furV)));')};
  foxMatC.customProgramCacheKey=function(){return 'foxfur'};return foxMatC}
function spawnFox(x,y){
  if(fox&&fox.vis)W.remove(fox.vis.g);
  var v=makeFoxVis();add(v.g);
  fox={vis:v,state:'idle',x:x,y:y,vx:P.x<=x?2.6:-2.6,vy:6,face:P.x<=x?1:-1,t:0,cd:.5,ph:0,yaw:-.35};/* pula para fora do bloco */
  sfx.item();emit(sparkPool,x,y+.8,16,3.5,.6,.35,.3,3);toast('Raposinha Foguete! Encoste nela para montar');
}
function foxGround(x,y){var f=floorBelow(x,y+.6);return f}
function mountFox(){
  if(!fox||P.climb||P.inW)return;
  fox.state='ride';P.mount=true;P.dj=false;P.boostCd=0;P.boostT=0;if(!fox.met){fox.met=true;P.mountT=.8;sfx.foxOn();emit(dustPool,P.x,P.y+.1,8,2.4,.5,.5,1.2,-.3)}else{sfx.grow();emit(sparkPool,P.x,P.y+1,12,3,.5,.3,.3,2)}
  if(!P.mountToast){P.mountToast=true;toast('Montado! Aperte Impulso para disparar. Para baixo + pular desce')}
  setAct();
}
function dismountFox(kind,fromX){
  if(!fox)return;P.mount=false;P.boostT=0;setAct();
  fox.x=P.x;fox.y=P.y;fox.vx=0;fox.vy=0;fox.cd=.7;
  if(kind==='hit'){fox.state='roam';fox.t=1.2;fox.face=P.x>=fromX?1:-1;fox.vy=6;sfx.shrink();toast('A raposinha fugiu assustada! Alcance ela para montar de novo')}
  else if(kind==='off'){fox.state='roam';fox.t=0;fox.face=P.face}
  else{fox.state='idle';if(kind==='water'&&P.lastDryX!==undefined){fox.x=P.lastDryX;fox.y=P.lastDryY}}
}
function foxBoost(){
  if(!P.mount||P.boostCd>0||state!=='play'||P.inW)return;
  if(levelIdx>=11){foxSpit();return}/* Terra Nova: em vez da cabeçada, ela cospe a bolha no inimigo (pedido do dono) */
  P.boostT=.38;P.boostCd=1.1;P.vx=P.face*17;if(!P.grounded&&P.vy<1.5)P.vy=1.5;sfx.fly();
  emit(sparkPool,P.x-P.face*.9,P.y+.7,10,3.5,.4,.35,.2,0);
}
function updFox(dt){
  if(P.boostCd>0)P.boostCd-=dt;
  updSpit(dt);
  if(!fox)return;
  if(fox.state==='ride'){
    if(!P.mount){fox.state='idle'}
    else{
      fox.x=P.x;fox.y=P.y;fox.face=P.face;
      if(LV.foxStop!==undefined&&P.x>LV.foxStop){dismountFox('stay');fox.x=LV.foxStop-.3;fox.face=-1;fox.away=true;if(!fox.told){fox.told=true;toast(LV.foxMsg||'A raposinha fica esperando aqui fora — lá dentro é quente demais!')}return}
      if(P.grounded&&!P.inW){P.lastDryX=P.x;P.lastDryY=P.y}
      if(P.inW){dismountFox('water');P.vy=Math.max(P.vy,2);return}
      if(P.climb){dismountFox('climb');return}
      if(P.boostT>0){
        P.boostT-=dt;P.vx=P.face*17;if(P.vy<-2&&P.boostT>.1)P.vy=-2;
        if(((tm*40)|0)%2===0)emit(sparkPool,P.x-P.face*1,P.y+.7,1,1.5,.25,.35,.2,0);
        enemies.forEach(function(e){if(!e.alive||e.dorm||e.noHit)return;var eh=e.h||.85;
          if(Math.abs(e.x-P.x)<1.1&&e.y<P.y+P.h&&e.y+eh>P.y-.1){if(levelIdx>=11){foxBubble(e);return}/* Terra Nova: Bolha de Ponte */if(killE(e,'fire')){sfx.stomp();emit(sparkPool,e.x,e.y+.5,10,4,.5,.3,.2,3)}}});
      }
    }
    return;
  }
  /* parada ou fugindo: anda sozinha com gravidade */
  if(fox.cd>0)fox.cd-=dt;
  if(fox.away&&(Math.abs(P.x-fox.x)>1.3||P.y>fox.y+2.2))fox.away=false;/* depois de descer, só monta de novo se sair de perto e voltar */
  fox.vy-=30*dt;var ny=fox.y+fox.vy*dt;
  if(fox.state==='idle'&&fox.vx){fox.x+=fox.vx*dt}
  if(fox.state==='roam'){
    /* anda sozinha: segue em frente, cai das beiradas, vira ao bater em parede/bloco/cano ou na beira da água; não some com o tempo */
    if(fox.t>0)fox.t-=dt;
    var spd=fox.t>0?4.5:2.7,nx=fox.x+fox.face*spd*dt,fe=nx+fox.face*.5,wall=false;
    for(var i=0;i<solids.length;i++){var q=solids[i];if(q.dead||q.hid)continue;
      if(fe>q.l&&fe<q.r&&q.t>fox.y+.15&&q.b<fox.y+1){wall=true;break}}
    if(!wall&&LV.water&&inWater(fe,fox.y+.3))wall=true;
    if(fe<(LV.outX!==undefined?LV.xMin+.5:-13))wall=true;if(LV.foxStop!==undefined&&fe>LV.foxStop)wall=true;/* no Vulcão a raposinha não passa da entrada */
    if(wall||nx<viewLeft()+.6)fox.face=-fox.face;else fox.x=nx;/* a raposinha também não sai da tela pela esquerda */
  }
  var fg=foxGround(fox.x,Math.max(fox.y,ny));
  if(fox.vy<=0&&ny<=fg+.001&&fg>-50){fox.y=fg;fox.vy=0;if(fox.state==='idle')fox.vx=0}else fox.y=ny;
  if(fox.y<-14){emit(sparkPool,fox.x,-6,10,3,.5,.35,.3,2);W.remove(fox.vis.g);fox=null;toast('A raposinha caiu no buraco');return}
  /* montar encostando */
  if(fox.cd<=0&&!fox.away&&!P.mount&&!P.inW&&!P.climb&&state==='play'&&!(LV.foxStop!==undefined&&P.x>LV.foxStop-.5)&&P.stun<=0&&Math.abs(P.x-fox.x)<.9&&P.y<fox.y+1.3&&P.y+P.h>fox.y+.2){
    P.y=Math.max(P.y,fox.y);fox.state='ride';mountFox();
  }
}
/* altura da sela: o quadril do Kuro encosta na sela (a raposa abaixa quando ele agacha) */
function seatY(){var fs=P.big?1.12:.95,sq=fox&&fox.sq!==undefined?fox.sq:1;return .92*fs*sq-(HY-.05)*P.sz*P.csq}
function foxVisUpd(dt){
  if(!fox||!fox.vis)return;
  if(fox.spitT>0){fox.spitT-=dt;fox.vis.head.rotation.z=Math.sin((.25-fox.spitT)/.25*Math.PI)*.35}else if(fox.vis.head)fox.vis.head.rotation.z*=.8;
  var v=fox.vis,ride=fox.state==='ride',x=ride?P.x:fox.x,y=ride?P.y-(P.sink||0)*.8:fox.y;
  var sp=ride?Math.abs(P.vx):(fox.state==='end'?(fox.endSp||0):(fox.state==='roam'?(fox.t>0?4.5:2.7):0)),air=ride?!P.grounded:Math.abs(fox.vy)>.5,face=ride?P.face:fox.face;
  var sc=ride?(P.big?1.12:.95):.95;
  fox.sq=(fox.sq===undefined?1:fox.sq);fox.sq+=(((ride&&P.crouch)?.72:1)-fox.sq)*(1-Math.exp(-dt*16));
  v.g.position.set(x,y,fox.state==='end'?(fox.z||0):0);v.b.scale.set(sc,sc*fox.sq,sc);
  var ty=fox.state==='end'&&fox.endYaw!==undefined?fox.endYaw:(face>0?-.35:Math.PI+.35);fox.yaw+=(ty-fox.yaw)*(1-Math.exp(-dt*14));v.g.rotation.y=fox.yaw;
  /* passada articulada: quadril + joelho; trote devagar, galope correndo; pose de salto e de pouso */
  var mv=clamp(sp/1.2,0,1),run=clamp(sp/6,0,1),vy=ride?P.vy:fox.vy,k=1-Math.exp(-dt*18);
  fox.ph+=dt*(5+sp*1.25)*(mv>.05?1:0);var ph=fox.ph;
  if(fox.wasAir&&!air)fox.land=1;fox.wasAir=air;fox.land=Math.max(0,(fox.land||0)-dt*4.5);var ld=fox.land*fox.land;
  var gal=clamp((sp-6.9)/.8,0,1);/* andando (velocidade normal do Kuro) = trote; só galopa correndo (botão de correr / analógico no máximo) */
  v.legs.forEach(function(lg,i){
    var fr=i<2,off=fr?(i%2?Math.PI*(1-gal)+.55*gal:0):(i%2?Math.PI*gal+.55*gal:Math.PI*(1-gal)+Math.PI*gal),p=ph+off;
    var sw=Math.sin(p),lift=Math.max(0,Math.cos(p)),th,kn;
    if(air){var up=vy>0;th=fr?(up?1.0:.45):(up?-1.0:-.15);kn=fr?(up?-.15:-.5):(up?.35:-.7)}
    else{th=sw*(.55+.3*run)*mv+(fr?0:.12);kn=-lift*(fr?1.2:.9)*mv+(fr?0:-.22)-ld*(fr?.5:.6)-(1-(fox.sq||1))*2.2;th+=ld*(fr?.25:-.1)+(1-(fox.sq||1))*(fr?.6:-.4)}
    lg.hip+=(th-lg.hip)*k;lg.kb+=(kn-lg.kb)*k;lg.rotation.z=lg.hip;lg.knee.rotation.z=lg.kb;});
  var bob=air?0:(Math.abs(Math.sin(ph))*.05*mv*(1-gal)+Math.max(0,Math.sin(ph*1+.4))*.08*gal),br=Math.sin(tm*2.2)*.012*(1-mv);
  v.b.position.y=bob-ld*.07+br;
  var pit=air?clamp(vy*.035,-.3,.3):Math.sin(ph-.8)*.13*gal+Math.sin(ph*2)*.025*mv*(1-gal);
  fox.pit=(fox.pit||0)+(pit-(fox.pit||0))*k;v.b.rotation.z=fox.pit;
  /* pelo: mola que fica para trás ao correr, sobe ao cair e afunda no pouso, com balanço solto */
  var fv=fox.fv||(fox.fv=new T.Vector3()),fw=fox.fw||(fox.fw=new T.Vector3()),tx=-(mv*.5+run*.7),tyv=clamp(-vy*.06,-.8,.8)-ld*1.2+(mv>.1?Math.sin(ph*2)*.25*mv:0);
  fw.x+=((tx-fv.x)*70-fw.x*7)*dt;fw.y+=((tyv-fv.y)*70-fw.y*7)*dt;fv.x+=fw.x*dt;fv.y+=fw.y*dt;foxFurU.v.value.set(fv.x,fv.y,0);foxFurU.t.value=tm;
  v.tail.rotation.z=.25+(air?-vy*.03:0)+Math.sin(ph-1.3)*.22*mv+Math.sin(tm*(mv>.1?7:2.6))*(.1-.05*mv)+ld*.3;v.tail.rotation.y=Math.sin(tm*2.3)*(.25-.15*mv);
  v.head.rotation.z=-fox.pit*.75+(mv>.1?-.06+Math.sin(ph*2+.6)*.05*mv:Math.sin(tm*1.3)*.05)-ld*.12;
  v.head.rotation.y=mv>.1?0:Math.sin(tm*.7)*.18;
  v.ears.forEach(function(e,k){e.rotation.x=(k?1:-1)*-.28+Math.sin(tm*2+k)*.05});
  var bo=ride&&P.boostT>0?1:0,fo=v.flame.material.opacity;fo+=(bo*.95-fo)*(1-Math.exp(-dt*20));
  v.flame.material.opacity=fo;v.flame2.material.opacity=fo;v.flame.scale.set(1.6+Math.sin(tm*40)*.3,.9,1);
  var blink=(fox.state==='roam'&&fox.t>0&&Math.floor(tm*10)%2===0)||(ride&&P.inv>0&&Math.floor(P.inv*14)%2===0&&state==='play');
  v.g.visible=!blink;
  /* sentada (cena final do Cume): traseiras dobradas, peito alto, rabo enrolado no chão */
  if(fox.state==='end'&&fox.sit>0){var st=fox.sit*fox.sit*(3-2*fox.sit);v.b.rotation.z=.5*st;v.b.position.y-=.22*st;
    v.legs.forEach(function(lg,i){if(i<2){lg.rotation.z=lg.rotation.z*(1-st)-.5*st;lg.knee.rotation.z*=1-st}else{lg.rotation.z=lg.rotation.z*(1-st)+1.1*st;lg.knee.rotation.z=lg.knee.rotation.z*(1-st)-1.9*st}});
    v.tail.rotation.z=v.tail.rotation.z*(1-st)-.6*st+Math.sin(tm*1.6)*.08;v.head.rotation.z=v.head.rotation.z*(1-st)-.35*st}
}
function collectItem(it){
  it.got=true;it.mesh.visible=false;
  if(it.type==='gem'){gemsGot++;$('gemN').textContent=gemsGot;sfx.gem();P.cheer=.9;emit(sparkPool,it.x,it.y,16,4,.8,.35,.3,3);if(gemsGot%3===0)giveLife('Cristal '+gemsGot+' de 3! +1 vida');else toast('Cristal '+gemsGot+' de 3')}
  else if(it.type==='heart'){hearts++;setHearts();sfx.heart();emit(sparkPool,it.x,it.y,10,3,.7,.35,.3,3);toast('+1 vida')}
  else if(it.type==='feather'){
    if(!P.big){P.big=true;P.growT=.65;if(blockedAbove(1.8))P.crouch=true}
    var had=P.cape;setCape(true);if(!had){P.capeT=.85;sfx.capeOn()}else sfx.flower();emit(sparkPool,it.x,it.y,24,4.5,.9,.4,.3,3);toast('Capa! Corra, pule e segure pular para voar. Giro derrota inimigos')
  }
  else if(it.type==='mushroom'){
    if(!P.big){
      P.big=true;P.growT=.65;sfx.grow();emit(sparkPool,it.x,it.y,18,4,.9,.4,.3,2);toast('Cogumelo! Kuro ficou grande');
      if(blockedAbove(1.8))P.crouch=true;
    }else{hearts++;setHearts();sfx.heart();toast('+1 vida')}
  }
  else if(it.type==='flower'){
    if(!P.big){P.big=true;P.growT=.65;if(blockedAbove(1.8))P.crouch=true}
    var newF=!P.fire;if(newF){P.fireT=.9;sfx.fireOn()}else sfx.flower();emit(sparkPool,it.x,it.y,22,4.5,.9,.4,.3,3);
    if(!P.fire){setFire(true);toast('Flor de fogo! Aperte Fogo (ou J) para atirar')}else{hearts++;setHearts();toast('+1 vida')}
  }
  else if(it.type==='fruit'){P.shield=true;sfx.heart();emit(sparkPool,it.x,it.y,14,3.5,.8,.35,.3,3);toast('Escudo mágico! Protege de um golpe')}
  else if(it.type==='core'){if(levelIdx>=TOTAL_W-1||(LV.boss&&LV.boss.v2))winGame();else winLevel()}
}
/* ===== poder novo da raposinha na Terra Nova (pedido do dono): Bolha de Ponte =====
   no Impulso, o inimigo atingido fica preso numa bolha laranja que sobe um pouco e flutua parada ~5 s; o Kuro pode pisar nela como degrau. Depois estoura e o inimigo volta. */
var bubGeo=null,bubMat=null;
function foxBubble(e){if(e.bub)return;
  if(!bubGeo){bubGeo=new T.SphereGeometry(.85,20,14);bubMat=new T.MeshStandardMaterial({color:0xffa040,emissive:new T.Color(0xff7a1a),emissiveIntensity:.35,transparent:true,opacity:.38,roughness:.1,metalness:.1,depthWrite:false})}
  var m=new T.Mesh(bubGeo,bubMat.clone());add(m);var hl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xffffff,transparent:true,opacity:.7,depthWrite:false}));hl.scale.set(.45,.3,1);hl.position.set(-.3,.42,.6);m.add(hl);
  var y0=e.y,eh=e.h||.85,so={l:e.x-.8,r:e.x+.8,t:0,b:0,oneway:false,dead:true,bub:1};solids.push(so);
  e.bub={t:5,y0:y0,x:e.x,cy:e.y+eh*.5,up:0,m:m,so:so,eh:eh};e.noHit=true;
  try{beep(660,.12,'sine',.06);beep(990,.16,'sine',.05,0,.06)}catch(er){}emit(sparkPool,e.x,e.y+eh*.5,12,3,.5,.3,.25,1);
  if(!P.bubToast){P.bubToast=true;toast('Bolha de Ponte! O inimigo fica preso: pule em cima da bolha para subir')}}
function bubUpd(e,dt){var B=e.bub;B.t-=dt;B.up=Math.min(1,B.up+dt*2.2);var lift=1.1*B.up*B.up*(3-2*B.up),cy=B.cy+lift+Math.sin(tm*2.4+e.ph)*.06;
  e.x=B.x;e.y=cy-B.eh*.5;var so=B.so,on=P.onPlat===so&&P.grounded;
  var sq=on?.9:1;B.m.scale.set(1/Math.sqrt(sq),sq,1/Math.sqrt(sq));B.m.position.set(B.x,cy,0);
  var top=cy+.85*sq-.05;if(on&&!so.dead)P.y=top;so.t=top;so.b=cy-.6;
  if(so.dead){var ins=P.x+P.w/2>so.l&&P.x-P.w/2<so.r&&P.y<so.t&&P.y+P.h>so.b;if(!ins&&B.up>.6)so.dead=false}/* só fica firme quando o Kuro já saiu de dentro */
  B.m.material.opacity=B.t<1.2&&Math.sin(tm*22)>0?.18:.38;
  if(B.t<=0)bubPop(e,true)}
function bubPop(e,fx){var B=e.bub;if(!B)return;if(B.m.parent)B.m.parent.remove(B.m);B.so.dead=true;var i=solids.indexOf(B.so);if(i>=0)solids.splice(i,1);
  if(P.onPlat===B.so){P.onPlat=null;P.grounded=false}
  e.y=B.y0;e.x=B.x;e.bub=null;e.noHit=false;e.ignT=Math.max(e.ignT||0,.6);
  if(fx){emit(sparkPool,B.x,B.cy+1,14,3.5,.5,.3,.2,1);try{noise(.12,.06,2400,'highpass');beep(1320,.08,'sine',.04)}catch(er){}}}
/* a bolha cuspida: sai da boca da raposinha, voa reto para frente e prende o primeiro inimigo que encostar; bate em parede ou some no fim e estoura */
var spitB=[];
function foxSpit(){P.boostCd=.75;var x=P.x+P.face*1.05,y=P.y+.95;
  if(!bubGeo){bubGeo=new T.SphereGeometry(.85,20,14);bubMat=new T.MeshStandardMaterial({color:0xffa040,emissive:new T.Color(0xff7a1a),emissiveIntensity:.35,transparent:true,opacity:.38,roughness:.1,metalness:.1,depthWrite:false})}
  var m=new T.Mesh(bubGeo,bubMat.clone());m.scale.setScalar(.2);m.position.set(x,y,0);add(m);
  spitB.push({x:x,y:y,vx:P.face*11,t:0,m:m});if(fox)fox.spitT=.25;
  try{beep(520,.08,'sine',.06,260);beep(880,.1,'sine',.04,0,.05)}catch(er){}emit(sparkPool,x,y,5,2,.3,.25,.2,0);
  if(!P.spitToast){P.spitToast=true;toast('A raposinha cospe bolhas! O inimigo preso vira degrau')}}
function updSpit(dt){for(var i=spitB.length-1;i>=0;i--){var b=spitB[i],hit=null,end=false;b.t+=dt;b.x+=b.vx*dt;b.y+=Math.sin(b.t*12)*.01;
  var sc=Math.min(.42,.2+b.t*1.4);b.m.scale.setScalar(sc);b.m.position.set(b.x,b.y,0);
  for(var j=0;j<enemies.length;j++){var e=enemies[j];if(!e.alive||e.dorm||e.noHit||e.bub)continue;var eh=e.h||.85;
    if(Math.abs(e.x-b.x)<(e.w||.5)+.35&&b.y>e.y-.3&&b.y<e.y+eh+.4){hit=e;break}}
  if(!hit)for(j=0;j<solids.length;j++){var q=solids[j];if(q.dead||q.hid||q.oneway||q.bub)continue;if(b.x>q.l&&b.x<q.r&&b.y>q.b&&b.y<q.t){end=true;break}}
  if(hit){foxBubble(hit);end=true}
  if(b.t>.85||state!=='play')end=true;
  if(end){if(b.m.parent)b.m.parent.remove(b.m);if(!hit)emit(sparkPool,b.x,b.y,8,2.5,.35,.25,.2,1);spitB.splice(i,1)}}}
/* aquecimento: na hora de montar a fase, prepara (compila) os materiais que aparecem depois — raposinha, pena, cogumelo, flor, fruta, cristal, bolha.
   Antes, na 1ª vez que cada um aparecia, o celular travava um instante preparando o desenho dele. */
function warmShaders(){var tmp=[];try{
  var v=makeFoxVis();add(v.g);v.g.position.set(P.x,P.y-60,0);tmp.push(v.g);
  ['feather','mushroom','flower','fruit','gem','heart','core'].forEach(function(t){try{var it=mkItem(t,P.x,P.y-60);if(it&&it.mesh)tmp.push(it.mesh)}catch(e){}});
  if(!bubGeo){bubGeo=new T.SphereGeometry(.85,20,14);bubMat=new T.MeshStandardMaterial({color:0xffa040,emissive:new T.Color(0xff7a1a),emissiveIntensity:.35,transparent:true,opacity:.38,roughness:.1,metalness:.1,depthWrite:false})}
  if(levelIdx>=11){var bm=new T.Mesh(bubGeo,bubMat);bm.position.set(P.x,P.y-60,0);add(bm);tmp.push(bm)}
  renderer.compile(scene,camera);
}catch(e){}tmp.forEach(function(o){if(o.parent)o.parent.remove(o)})}
