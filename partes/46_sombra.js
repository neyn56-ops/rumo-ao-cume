/* ===== Dash de sombra: o golpe "marca" do Kuro (aprovado pelo dono, 12/11; no jogo oficial desde 13/11) =====
   Tecla L (ou botão "Sombra" no celular): o Kuro some numa fumaça escura, dispara ~4 passos para a frente e reaparece.
   Regras: atravessa inimigos e tiros sem dano; NÃO atravessa parede nem chão (a física normal resolve as colisões);
   no ar só 1 vez por pulo (recarrega ao pisar no chão); recarga de 0,75 s. Rastro: 3 sombras do Kuro que somem. */
var DASH={t:0,cd:0,air:0,dir:1,told:0,gT:0,gi:0,ghosts:null};
var DASH_T=.16,DASH_V=25;
function dashOk(){return NJ&&state==='play'&&!P.climb&&!P.warp&&!(P.growT>0)&&!(P.stun>0)&&!P.mount&&!P.inW&&!dyn&&!(RT&&RT.sw)}
function dashTry(){
  if(!dashOk()||DASH.cd>0||DASH.t>0)return;
  if(!P.grounded&&DASH.air)return;/* no ar, só uma vez por pulo */
  DASH.dir=P.face||1;DASH.t=DASH_T;DASH.cd=.75;if(!P.grounded)DASH.air=1;
  P.vy=0;P.vx=DASH.dir*DASH_V;DASH.gT=0;
  dashPuff(P.x,P.y+.7,10);try{sfx.spin()}catch(e){}
  if(!DASH.told){DASH.told=1;toast(coarse?'Dash de sombra! Toque em Sombra para sumir e reaparecer à frente':'Dash de sombra! Aperte L para sumir e reaparecer à frente')}}
function dashGhosts(){/* sombras = cópias do próprio Kuro (mesmo corpo e mesma pose), num roxo transparente; feitas uma vez por fase */
  if(DASH.ghosts&&DASH.gW===W)return DASH.ghosts;
  DASH.gW=W;DASH.ghosts=[];for(var i=0;i<3;i++){var m=new T.MeshBasicMaterial({color:0x7a5ad0,transparent:true,opacity:0,depthWrite:false});
    var g=rig.root.clone(true);g.traverse(function(o){if(o.isMesh||o.isSprite){o.material=m;o.castShadow=false;o.receiveShadow=false}});
    g.visible=false;add(g);DASH.ghosts.push({g:g,m:m,a:0})}
  return DASH.ghosts}
function dashPose(src,dst){/* copia a pose do Kuro para a sombra (posição, giro e tamanho de cada parte) */
  dst.position.copy(src.position);dst.quaternion.copy(src.quaternion);dst.scale.copy(src.scale);
  var n=Math.min(src.children.length,dst.children.length);for(var i=0;i<n;i++){dashPose(src.children[i],dst.children[i]);dst.children[i].visible=src.children[i].visible}}
function dashPuff(x,y,n){emit(dustPool,x,y,n,2.6,.45,.5,1.6,-.4)}
function dashUpd(dt){/* chamado no passo do Kuro, antes do movimento */
  if(DASH.cd>0)DASH.cd-=dt;
  if(P.grounded&&DASH.t<=0)DASH.air=0;
  var G=NJ&&W?dashGhosts():null;
  if(DASH.t>0){
    if(!dashOk()){DASH.t=0}else{
      DASH.t-=dt;DASH.gT-=dt;
      if(G&&DASH.gT<=0){DASH.gT=.05;var q=G[DASH.gi++%3];dashPose(rig.root,q.g);q.g.position.z-=.05;q.a=.42;q.g.visible=true}
      if(DASH.t<=0){P.vx=DASH.dir*8.5;dashPuff(P.x+DASH.dir*.3,P.y+.7,10)}}}
  if(G)G.forEach(function(q){if(q.a>0){q.a=Math.max(0,q.a-dt*1.5);q.m.opacity=q.a;if(q.a<=0)q.g.visible=false}});
  var b=document.getElementById('bDash');if(b)b.classList.toggle('cd',DASH.cd>0||(!P.grounded&&!!DASH.air))}
function dashMove(){if(DASH.t>0){P.vx=DASH.dir*DASH_V;P.vy=0}}/* depois da gravidade: anda reto, sem cair */
function dashReset(){DASH.t=0;DASH.cd=0;DASH.air=0;if(DASH.ghosts)DASH.ghosts.forEach(function(q){q.a=0;q.g.visible=false})}
(function(){var b=document.getElementById('bDash');if(!b)return;if(!NJ){b.remove();return}b.hidden=false;
  b.addEventListener('pointerdown',function(e){e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}initAudio();dashTry();b.classList.add('on')});
  ['pointerup','pointercancel','lostpointercapture'].forEach(function(ev){b.addEventListener(ev,function(){b.classList.remove('on')})})})();
