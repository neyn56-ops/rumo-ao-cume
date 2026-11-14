/* ===== Prólogo "Ladrão nos Telhados" (plano aprovado pelo dono, 13/11) — o novo começo do jogo, ~1,5 min =====
   Amanhecer na Vila das Folhas: um besouro ladrão passa voando com o Coração de Cristal e o Kuro corre atrás pelos telhados.
   Ensina jogando, com dicas de tecla/botão na tela: correr, pular, lanterna (onigiri), pisar nos besouros, dash de sombra
   pela viga em chamas, asa ninja (solta no telhado, sem bloco e sem tartaruga de guarda) para planar do precipício até o torii do morro. Não dá para perder: caiu na rua ou no
   vale, volta na hora para o último telhado. É a "parte de fora" (LEVELS[0].pre) do Mundo 1: abre na primeira vez
   (save.seenPro), no lugar do clipe antigo; o botão Abertura do menu joga de novo. No fim: título e começa o Mundo 1. */
var PRO_LOOK={sky:['#3a4a8a','#d07a8a','#ffb070','#ffe0b0'],fog:'#e8b8a0',fd:.006,sun:0xffc890,si:1.9,hemi:[0xffd8c0,0x4a3a4a,.62],exp:.95,lantern:1.0,snow:true,petal:true};
var PRO={name:'Ladrão nos Telhados',theme:7,prologue:1,look:PRO_LOOK,camMax:118,limit:999,es:1,noLift:1,jk:1.1,noHeartFit:1,coinN:24,
  solids:[[-14,80,0],[-8,8,3,0,0,'house'],[10.4,19,3.6,0,0,'house'],[21.4,29,4.2,0,0,'house'],[31.2,46,4.2,0,0,'house'],[48.2,66,4.2,0,0,'house'],[68.4,80,5,0,0,'house'],[86.5,124,-1.5]],
  floats:[],crumbles:[],movers:[],spikes:[],ropes:[[70,78,8.6]],pulleys:[],doors:[],hides:[],springs:[],feathers:[[74,6.4]],hearts:[],gems:[],
  enemies:[{t:'beetle',x0:33,x1:38,y:4.2,s:1.1},{t:'beetle',x0:40,x1:45,y:4.2,s:1.2}],
  blocks:[{x:14,y:6,t:'q',c:'mushroom'}],
  coins:[['r',-3,6,3.9,4],['r',22.5,28,5.1,3],['a',30.1,4.2,2.6,1.2,3],['r',49,53,5.1,3],['r',58,64,5.1,3],['a',84,2.5,3,2.5,5]],
  checkpoints:[],goal:{x:106,top:-1.5},start:{x:-4,y:3},
  fire:{x:55,w:1.6,top:7.6}};/* viga em chamas: só passa com o dash de sombra */
LEVELS[0].pre=PRO;
var PRO_TIPS=[[-99,4,'→ correr','Analógico → corre'],[4.5,11,'Espaço pula','Pular'],[11.5,17,'Bata na lanterna por baixo','Bata na lanterna por baixo'],
  [30.5,45,'Pule em cima dos besouros','Pule em cima dos besouros'],[49.5,56,'L  dash de sombra','Sombra: dash de sombra'],[68.5,80,'Pegue a asa, pule e segure Espaço para planar','Pegue a asa, pule e segure Pular para planar']];
var PR=null;
function proStart(){/* começa o prólogo (no lugar do Mundo 1) */
  initAudio();cpSave[0]=null;prePast[0]=false;carryNow=null;
  buildLevel(0);resetState();hearts=3;setHearts();beginPlay();
  PR={t:0,safe:{x:PRO.start.x,y:PRO.start.y},tipI:-1,end:0,thief:null,fireM:null};
  proBuild();updateCamera(0,true)}
function proBuild(){/* ladrão voando com o coração de cristal, viga em chamas, caixa das dicas */
  var v=makeBeetle({shell:0x34303e,ring:0xffc43a});v.g.scale.setScalar(.8);
  var ht=mesh(heartGeo,new T.MeshStandardMaterial({color:0xff4a7e,roughness:.2,emissive:0xd0104a,emissiveIntensity:1.4}),false,false);ht.scale.setScalar(.9);ht.position.set(0,-.55,.2);v.g.add(ht);
  var gl=new T.Sprite(new T.SpriteMaterial({map:softSprite(),color:0xff70a0,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false}));gl.scale.set(1.8,1.8,1);gl.position.set(0,-.55,.2);v.g.add(gl);
  add(v.g);PR.thief={v:v,x:PRO.start.x+7,y:9,away:0};
  var F=PRO.fire,wd=new T.MeshStandardMaterial({color:0x3a2416,roughness:.9,emissive:0x6a2008,emissiveIntensity:.6}),g=new T.Group();
  [-1,1].forEach(function(s){var b=mesh(new T.BoxGeometry(.35,4.4,.35),wd);b.rotation.z=s*.5;b.position.y=2;g.add(b)});
  g.position.set(F.x,4.2,0);add(g);PR.fireM=g;
  var el=document.getElementById('proTip');if(!el){el=document.createElement('div');el.id='proTip';
    el.style.cssText='position:absolute;left:50%;top:15%;transform:translateX(-50%);z-index:6;padding:8px 16px;border-radius:999px;background:rgba(16,20,28,.72);color:#fff;font:700 18px/1.2 system-ui,sans-serif;letter-spacing:.02em;pointer-events:none;transition:opacity .3s;opacity:0;white-space:nowrap';
    document.getElementById('stage').appendChild(el)}
  PR.tipEl=el;el.style.opacity=0}
function proUpd(dt){/* chamado no passo do Kuro quando LV.prologue */
  if(!PR||state!=='play')return;PR.t+=dt;hearts=Math.max(hearts,3);
  /* lugar seguro: o último telhado em que pisou */
  if(P.grounded&&P.y>2.5)PR.safe={x:P.x,y:P.y};
  /* caiu na rua entre as casas ou no vale: volta na hora para o último telhado */
  if((P.grounded&&P.y<1&&P.x<80)||P.y<-6){P.x=PR.safe.x-P.face*.6;P.y=PR.safe.y+.05;P.vx=0;P.vy=0;P.grounded=false;P.onPlat=null;P.inv=Math.max(P.inv,1);dashPuff(P.x,P.y+.8,8);updateCamera(0,true)}
  /* viga em chamas: queima (empurra) quem passa sem o dash */
  var F=PRO.fire;if(Math.random()<dt*30)emit(sparkPool,F.x+(Math.random()-.5)*1.2,4.4+Math.random()*3.2,1,1.2,.5,.35,.2,3);
  if(DASH.t<=0&&Math.abs(P.x-F.x)<F.w/2+P.w/2&&P.y<F.top&&P.y+P.h>4.2)hurt(F.x);
  /* ladrão sempre à frente; no morro ele foge pelo céu */
  var T_=PR.thief;if(T_){if(P.x>96)T_.away=1;var tx=T_.away?T_.x+dt*9:Math.max(T_.x,P.x+8),ty=T_.away?T_.y+dt*3:7.5+Math.sin(PR.t*2.4)*.5;
    T_.x+=(tx-T_.x)*Math.min(1,dt*3);T_.y+=(ty-T_.y)*Math.min(1,dt*3);T_.v.g.position.set(T_.x,T_.y,-.4);T_.v.g.rotation.y=Math.PI/2;T_.v.g.rotation.z=Math.sin(PR.t*9)*.08}
  /* dicas na tela (PC: teclas; celular: botões) */
  var ti=-1;for(var i=0;i<PRO_TIPS.length;i++)if(P.x>=PRO_TIPS[i][0]&&P.x<PRO_TIPS[i][1])ti=i;
  if(ti!==PR.tipI){PR.tipI=ti;if(ti<0)PR.tipEl.style.opacity=0;else{PR.tipEl.textContent=PRO_TIPS[ti][coarse?3:2];PR.tipEl.style.opacity=1}}}
function proEnd(){/* chegou no torii: o sino toca, título e começa o Mundo 1 */
  if(!PR||PR.end)return;PR.end=1;state='win';P.vx=0;P.cheer=3;if(flag.bell)flag.ring=1.6;try{sfx.win()}catch(e){}
  save.seenPro=1;save.seenOpen=1;writeSave();if(PR.tipEl)PR.tipEl.style.opacity=0;
  var t=document.createElement('div');t.style.cssText='position:absolute;inset:0;z-index:7;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;opacity:0;transition:opacity .6s;color:#fff;text-shadow:0 3px 12px rgba(0,0,0,.6)';
  t.innerHTML='<div style="font:italic 900 min(11vw,12vh)/1 system-ui,sans-serif;letter-spacing:.02em">Rumo ao Cume</div><div style="font:700 min(4vw,4.5vh)/1.4 system-ui,sans-serif;margin-top:10px">O ladrão fugiu com o Coração de Cristal!</div>';
  document.getElementById('stage').appendChild(t);requestAnimationFrame(function(){t.style.opacity=1});
  setTimeout(function(){t.style.opacity=0;setTimeout(function(){t.remove()},700);PR=null;startLevel(0);if(window.PORTAL)beginPlay()},3200)}
