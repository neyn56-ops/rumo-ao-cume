/* ===== Robô gerador de fases — Mundo 23 em diante (plano aprovado pelo dono, 06/11) =====
   rbMundo(n) gera o Mundo n (e os que faltam antes dele) e põe em LEVELS/STORY.worlds. O número do mundo é a semente:
   o Mundo 23 sai sempre igual, para todo mundo. A fase é costurada com trechos curtos (rbC*), sempre dentro dos limites
   de pulo do Kuro (RB_PULO), e o robô de teste (rbBot) passa por ela nos testes (bloco 66 de testes/roda.js).
   Mistura: em qualquer cenário podem entrar os perigos do cânion (pedras, pilões, troncos) e as coisas das raízes
   (semente-ponte, cipó, raiz que sobe, espinhos) — os portões estão em 11_construcao, 40_estado, 53_agua e 60_animacao (LV.gen). */
var RB_PULO={gap:3.3,up:2.2,gapUp:2.3};/* buraco máximo no mesmo nível, subida máxima, buraco máximo numa subida (andando, pulo segurado) */
/* cenários que o robô usa: t = tema, m = música, nome (para o título), fem = feminino, frio = pode nevar */
var RB_BASES=[{t:0,nome:'Vale'},{t:1,nome:'Caverna',fem:1},{t:2,nome:'Floresta',fem:1},{t:4,nome:'Castelo'},{t:5,nome:'Montanha',fem:1,frio:1},
  {t:6,nome:'Deserto'},{t:7,nome:'Vila',fem:1},{t:8,nome:'Encosta',fem:1,frio:1},{t:9,nome:'Vulcão'},{t:21,m:17,nome:'Cânion'},{t:22,m:18,nome:'Raízes',pl:1,fem:1},{t:23,m:19,nome:'Copa',fem:1}];
/* hora do dia e clima (por cima do tema da base) */
var RB_LOOK={
  noite:{sky:['#0a1830','#14284a','#1e3c5a','#0c1c30'],fog:'#16304a',sun:0xb8ccff,si:1.0,hemi:[0x98b8f0,0x1c2a2a,.5],exp:.8},
  tarde:{sky:['#3a56a8','#c8789a','#ffb878','#ffe6b0'],fog:'#f6d6b4',sun:0xffd8a0,si:2.2,hemi:[0xffe2c8,0x6a4a5a,.5],exp:.88},
  neblina:{fog:'#c8d0d8',fdK:2.4},
  neve:{snow:true}};
function rbRng(n){var s=n>>>0;s=Math.imul(s^s>>>16,0x85ebca6b);s=Math.imul(s^s>>>13,0xc2b2ae35);s=(s^s>>>16)>>>0;return function(){s=(s+0x6D2B79F5)>>>0;var t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function rbMundo(n){while(LEVELS.length<n){var g=rbGera(LEVELS.length+1);LEVELS.push(g.L);STORY.worlds.push(g.s)}return LEVELS[n-1]}
function rbGera(n){var r=rbRng(n*977+13);for(var w=0;w<7;w++)r();var k=n-23,rest=k>0&&k%5===4;/* a cada 5 mundos, um mais calmo */
  var d=Math.min(1,k/40)*(rest?.45:1);
  function rr(a,b){return a+(b-a)*r()}function pick(a){return a[Math.floor(r()*a.length)]}
  var B=RB_BASES[(n*7+Math.floor(r()*RB_BASES.length))%RB_BASES.length];
  var fmt=pick(['direita','direita','direita','subida','descida']);
  var hora=pick(['dia','dia','dia','tarde','noite','neblina']);if(B.t===22)hora='dia';/* Raízes já é noite */
  var neve=B.frio&&r()<.5;
  var look=null;if(hora!=='dia'){var lk=RB_LOOK[hora];look={};for(var q in lk)look[q]=lk[q];if(lk.fdK)look.fd=(THEMES[B.t].fd||.008)*lk.fdK}
  if(neve){look=look||{};look.snow=true}
  /* mistura de mecânicas: cada mundo ganha 1 ou 2 famílias especiais além do básico */
  var fam=[];var all=['cnPedra','cnPilao','cnTronco','rtPonte','rtCipo','rtSobe','rtEspinho'];
  while(fam.length<(d>.3?2:1)){var f=pick(all);if(fam.indexOf(f)<0)fam.push(f)}
  var y0=fmt==='descida'?34:0;
  var L={name:'',theme:B.t,music:B.m,gen:{n:n,fmt:fmt,hora:hora,fam:fam,log:[]},camMax:0,limit:900,es:1.05,noLift:1,jk:1.1,noHeartFit:1,coinN:100,look:look,
    solids:[],floats:[],movers:[],crumbles:[],feathers:[],spikes:[],springs:[],enemies:[],blocks:[],coins:[],gems:[],checkpoints:[],wind:[],
    goal:null,start:{x:0,y:y0}};
  if(fmt!=='direita')L.tall=1;
  if(THEMES[B.t].canyon)L.canyon={A:4,free:-20,camUp:2.1,arrows:[],rocks:[],boulders:[],crushers:[],logs:[]};/* o tema do cânion precisa disto */
  var G={L:L,r:r,rr:rr,pick:pick,d:d,x:10,y:y0,fmt:fmt,lastCp:0,used:{}};
  L.solids.push([-14,10,y0]);
  L.blocks.push({x:5,y:y0+2.4,t:'q',c:'mushroom'});
  L.coins.push(['r',1,9,y0+.9,4]);
  var LEN=rr(250,320)+d*60,cps=[],gems=0,hz=0,items=['flower','fox','coin','fruit'];
  var C=[rbChao,rbBuraco,rbBuraco,rbDegraus,rbIlhas,rbPonte,rbMover,rbMola,rbEspinhos,rbChao];
  var esp={cnPedra:rbPedras,cnPilao:rbPiloes,cnTronco:rbTroncos,rtPonte:rbSemente,rtCipo:rbCipo,rtSobe:rbRaizSobe,rtEspinho:rbEspinhoRaiz};
  var prev=null;
  while(G.x<LEN){
    if(G.x-G.lastCp>45){var cx0=G.x;rbChao(G,1);cps.push([G.x-3,G.y]);G.lastCp=G.x;
      var bx=Math.round((cx0+G.x)/2)-1;if(items.length&&r()<.5){var it=items.shift();L.blocks.push({x:bx,y:G.y+2.4,t:'q',c:it})}
      else if(hz<2&&G.x>LEN*(.3+hz*.4)){hz++;L.blocks.push({x:bx,y:G.y+2.4,t:'q',c:'heart'})}continue}/* corações à vista (sem os escondidos: longe da beira) */
    var c=r()<.3?esp[pick(fam)]:pick(C);if(c===prev&&c!==rbChao)c=rbChao;prev=c;var x0=G.x;c(G);L.gen.log.push((x0|0)+':'+c.name.slice(2));
    if(gems<3&&G.gem){L.gems.push(G.gem);gems++}G.gem=null}
  if(gems<3){/* joias que faltaram: no alto, em cima do caminho */for(;gems<3;gems++)L.gems.push([G.x-40*gems-20,rbTopo(L,G.x-40*gems-20)+3.4])}
  if(r()<.6)L.blocks.push({x:cps[1]?Math.round(cps[1][0]-3):30,y:(cps[1]?cps[1][1]:y0)+2.4,t:'q',c:'feather'});
  rbChao(G,1,16);L.goal={x:G.x-6,top:G.y};L.camMax=G.x-2;L.checkpoints=cps;
  if(!L.wind.length)delete L.wind;
  /* nome e história */
  var Q={noite:['da Lua','das Estrelas','da Meia-Noite'],tarde:['do Pôr do Sol','do Crepúsculo'],neblina:['da Neblina','das Brumas'],
    cnPedra:['das Pedras Rolantes'],cnPilao:['dos Pilões'],cnTronco:['dos Troncos'],rtPonte:['das Sementes'],rtCipo:['dos Cipós'],rtSobe:['das Raízes'],rtEspinho:['dos Espinhos']};
  var qs=(Q[hora]||[]).concat(Q[fam[0]]);if(neve)qs=qs.concat(['da Neve','do Inverno']);
  var q2=pick(qs);if(B.t===22&&q2==='das Raízes')q2='dos Espinhos';
  var pre=fmt==='subida'?(B.fem?'Alta ':'Alto '):'';if(fmt==='descida')q2=q2+(B.fem?' Profunda':' Profundo');
  if(B.pl&&pre)pre='Altas ';if(B.pl&&fmt==='descida')q2=q2.replace(' Profunda',' Profundas');
  L.name=pre+B.nome+' '+q2;
  var txt={direita:'Corra até o fim',subida:'Suba até o alto',descida:'Desça até o fundo'}[fmt];
  return {L:L,s:{kicker:'Mundo '+n+' · Ilhas do Robô',title:L.name,text:txt+' — este mundo foi montado pelo robô, com pedaços de todos os mundos do Kuro. Boa sorte!',end:'O robô já está montando a próxima ilha. Siga em frente!'}}}
/* topo do chão em x (para pôr joias e moedas) */
function rbTopo(L,x){var t=-99;L.solids.forEach(function(s){if(x>=s[0]&&x<=s[1]&&s[2]>t)t=s[2]});return t<-50?0:t}
function rbChao0(G,len){G.L.solids.push([G.x,G.x+len,G.y]);G.x+=len}
/* direção da altura conforme o formato (subida sobe, descida desce, direita oscila entre 0 e 6) */
function rbDy(G,a,b){var v=G.rr(a,b);if(G.fmt==='subida')return Math.abs(v);if(G.fmt==='descida')return -Math.abs(v);
  if(G.y+v>6||G.y+v<0)v=-v;return Math.max(-G.y,v)}
function rbChao(G,cp,len){var L=G.L,r=G.r,x=G.x,y=G.y;len=len||G.rr(8,14);rbChao0(G,len);if(cp)return;
  if(len>9&&r()<.55+G.d*.35)L.enemies.push({t:'beetle',x0:x+1.5,x1:x+len-1.5,y:y,s:1.1+G.d*.4});
  if(r()<.35){var bx=Math.round(x+len/2);L.blocks.push({x:bx-1,y:y+2.4,t:'brick'},{x:bx,y:y+2.4,t:'q',c:'coin'},{x:bx+1,y:y+2.4,t:'brick'})}
  else L.coins.push(['r',x+1,x+len-1,y+.9,Math.max(2,len/2.6|0)]);
  if(r()<.25+G.d*.3)L.enemies.push({t:'bat',x0:x+1,x1:x+len-1,y:y+4.4,s:1.2+G.d*.3})}
function rbBuraco(G){var dy=rbDy(G,0,1.8),gap=dy>.3?G.rr(1.6,RB_PULO.gapUp-(dy/RB_PULO.up)*.6):G.rr(1.6,2.2+1.1*G.d);
  if(dy>RB_PULO.up)dy=RB_PULO.up;G.L.coins.push(['a',G.x+gap/2,G.y+Math.max(dy,0)+2.6]);G.x+=gap;G.y=+(G.y+dy).toFixed(2);rbChao0(G,G.rr(4,7))}
function rbDegraus(G){var k=2+Math.floor(G.r()*3);for(var i=0;i<k;i++){var dy=rbDy(G,.9,1.6);G.y=+(G.y+dy).toFixed(2);rbChao0(G,G.rr(2.6,4));
  G.L.coins.push(['a',G.x-1.3,G.y+.9])}}
function rbIlhas(G){var L=G.L,k=2+Math.floor(G.r()*(2+G.d*2)),y=G.y;
  for(var i=0;i<k;i++){var gap=G.rr(1.4,2.2+G.d*.7),w=G.rr(3.6,2.4)-G.d*.4,dy=rbDy(G,0,1.2);if(dy>1.2)dy=1.2;y=Math.max(G.fmt==='descida'?-50:.6,+(y+dy).toFixed(2));
    G.x+=gap;L.floats.push([G.x,G.x+w,y]);if(i===1&&G.r()<.5)G.gem=[G.x+w/2,y+3.2];else L.coins.push(['r',G.x+.5,G.x+w-.5,y+.9,2]);G.x+=w}
  G.x+=G.rr(1.4,2.2);G.y=G.fmt==='direita'?Math.max(0,Math.min(6,y)):y;rbChao0(G,G.rr(4,6))}
function rbPonte(G){var n=3+Math.floor(G.r()*3);G.L.coins.push(['r',G.x+.5,G.x+n*2.2-.5,G.y+.9,n*2]);for(var i=0;i<n;i++){G.L.crumbles.push([G.x,G.x+2.2,G.y]);G.x+=2.2}rbChao0(G,G.rr(4,6))}
function rbMover(G){var w=3.2,rg=G.rr(1.6,2.2),gap=w+2*rg+.6;G.L.movers.push({cx:+(G.x+gap/2).toFixed(2),range:+rg.toFixed(2),speed:+G.rr(.7,.9+G.d*.4).toFixed(2),top:G.y,w:w});
  G.L.coins.push(['r',G.x+1,G.x+gap-1,G.y+1.6,3]);G.x+=gap;rbChao0(G,G.rr(4,6))}
function rbMola(G){if(G.fmt==='descida'){rbDegraus(G);return}rbChao0(G,3);G.L.springs.push([G.x-1.4,G.y]);var h=G.rr(3.4,4.6);G.gem=[G.x-1.4,G.y+h+3.4];
  G.y=+(G.y+h).toFixed(2);rbChao0(G,G.rr(5,8));if(G.fmt==='direita'){/* e desce de novo em degraus */var k=0;while(G.y>2&&k++<4){G.y=+Math.max(0,G.y-G.rr(1.2,1.8)).toFixed(2);rbChao0(G,G.rr(2.6,3.6))}}}
function rbEspinhos(G){var w=G.rr(1.3,2+G.d*.5),len=3+w+G.rr(6,8),s=G.x+3;/* depois do espinho sobra chão para pousar */rbChao0(G,len);G.L.spikes.push([+s.toFixed(2),+(s+w).toFixed(2),G.y]);G.L.coins.push(['a',s+w/2,G.y+3.2])}
/* ----- famílias especiais (misturadas de outros mundos) ----- */
function rbCn(G){var L=G.L;if(!L.canyon)L.canyon={A:4,free:-20,camUp:2.1,arrows:[],rocks:[],boulders:[],crushers:[],logs:[]};return L.canyon}
function rbPedras(G){/* Cânion: pedra que rola vindo contra o Kuro, no chão reto */var C=rbCn(G),len=G.rr(18,26),x=G.x;rbChao0(G,len);
  C.boulders.push([+(x+len-1).toFixed(1),+(x+1).toFixed(1),+G.rr(3.4,4.2-G.d*.6).toFixed(1),+G.rr(0,1.5).toFixed(1)]);G.L.coins.push(['r',x+2,x+len-2,G.y+.9,6])}
function rbPiloes(G){var C=rbCn(G),k=1+Math.floor(G.r()*(2+G.d*2)),x=G.x;rbChao0(G,3);for(var i=0;i<k;i++){C.crushers.push([+(G.x+1.1).toFixed(2),2.2,+(G.y+4.6).toFixed(2),+G.rr(1.3,1.6).toFixed(2),+(i*.7).toFixed(2),.45]);rbChao0(G,4)}
  rbChao0(G,3);G.L.coins.push(['r',x+3,G.x-3,G.y+.9,k*2])}
function rbTroncos(G){var C=rbCn(G),k=1+Math.floor(G.r()*2),x=G.x;rbChao0(G,4);for(var i=0;i<k;i++){C.logs.push([+(G.x+2).toFixed(2),+(G.y+9.2).toFixed(2),7.4,.8,+G.rr(1.4,1.7).toFixed(2),+(i*1.2).toFixed(2)]);rbChao0(G,8)}
  rbChao0(G,2);G.L.coins.push(['r',x+3,G.x-3,G.y+.9,k*3])}
function rbRt(G){var L=G.L;if(!L.roots)L.roots={bridges:[],vines:[],lifts:[],thorns:[],spiders:[]};return L.roots}
function rbSemente(G){/* Raízes: semente que faz a raiz virar ponte sobre um buraco largo */var R=rbRt(G);rbChao0(G,5);var gap=G.rr(9,11);
  R.bridges.push({seed:[+(G.x-1.5).toFixed(2),+(G.y+.9).toFixed(2)],l:+G.x.toFixed(2),r:+(G.x+gap).toFixed(2),t:G.y,dur:9});G.L.coins.push(['r',G.x+1,G.x+gap-1,G.y+1.4,5]);G.x+=gap;rbChao0(G,G.rr(5,7))}
function rbCipo(G){/* cipó sobre um buraco largo */if(G.fmt==='descida'){rbBuraco(G);return}var R=rbRt(G);rbChao0(G,4);var gap=G.rr(7.4,8.4);
  R.vines.push([+(G.x+gap*.42).toFixed(2),+(G.y+9.6).toFixed(2),6.8]);G.L.coins.push(['a',G.x+gap*.42,G.y+1.8]);G.x+=gap;rbChao0(G,G.rr(5,7))}
function rbRaizSobe(G){/* raiz que sobe (elevador) até um degrau alto */if(G.fmt==='descida'){rbDegraus(G);return}var R=rbRt(G);rbChao0(G,3);var h=G.rr(4.2,5);
  R.lifts.push([+(G.x+1.2).toFixed(2),2.4,G.y,+(G.y+h).toFixed(2),+G.rr(.8,1).toFixed(2)]);G.x+=2.4;G.y=+(G.y+h-.4).toFixed(2);rbChao0(G,G.rr(5,7));G.gem=[G.x-3,G.y+3.2];
  if(G.fmt==='direita'){var k=0;while(G.y>2&&k++<4){G.y=+Math.max(0,G.y-G.rr(1.2,1.8)).toFixed(2);rbChao0(G,G.rr(2.6,3.6))}}}
function rbEspinhoRaiz(G){/* raízes de espinho que saem do chão de tempos em tempos */var R=rbRt(G),k=1+Math.floor(G.r()*(1+G.d*2));rbChao0(G,3);
  for(var i=0;i<k;i++){R.thorns.push([+(G.x+1.5).toFixed(2),1.4,G.y,+G.rr(2.4,2.8).toFixed(2),+(i*1.3).toFixed(2)]);rbChao0(G,5)}rbChao0(G,2)}
/* ===== parte 2: as Ilhas do Robô no mapa (terceiro mapa, depois da Terra Nova, do outro lado do mar) =====
   O mapa mostra os mundos gerados até o liberado + 3 (os da frente ficam na nuvem). rbGarante gera os que faltam. */
function rbGarante(k){rbMundo(Math.max(k,TOTAL_W+3))}
var RB_MP0=-1,RB_MWP0=-1;
var RB_COR={0:['#86d44f','#7b5e3e'],1:['#a08a6a','#5a4636'],2:['#35b08a','#2b6556'],4:['#56505e','#2e2a34'],5:['#eef4fa','#9fb0c4'],6:['#e8a24a','#9c6130'],
  7:['#8a9a6a','#5a4a36'],8:['#6cc24a','#c8823a'],9:['#3a2a2a','#1e1416'],21:['#e89a5a','#9a5a30'],22:['#2e5a3a','#1e3424'],23:['#7ad05a','#6a4a2e']};
function rbIlhasMapa(){/* põe as ilhas 23… em MP e a trilha (com a travessia de barco) em MWP; refaz do zero a cada chamada */
  if(RB_MP0<0){RB_MP0=MP.length;RB_MWP0=MWP.length}MP.length=RB_MP0;MWP.length=RB_MWP0;
  var w22=MP[RB_MP0-1],prev=null;
  for(var n=TOTAL_W+1;n<=LEVELS.length;n++){var k=n-TOTAL_W-1,L=LEVELS[n-1],c=RB_COR[L.theme]||['#7ccf4a','#7b5e3e'];
    var p={n:'rb'+n,x:w22.x+4+Math.sin(k*1.1)*9,z:w22.z-36-k*10.5,r:5.4,y:.3+(k%3)*.15,top:c[0],side:c[1]};MP.push(p);
    if(!prev)MWP.push([w22.x-1,w22.z-6.5],[w22.x+1,w22.z-14],[p.x-1,p.z+12],[p.x,p.z+5]);/* sai da Copa, atravessa o mar de barco */
    else MWP.push([(prev.x+p.x)/2+(k%2?1:-1),(prev.z+p.z)/2]);
    MWP.push([p.x+(k%2?.6:-.6),p.z+.4,n-1]);prev=p}}
