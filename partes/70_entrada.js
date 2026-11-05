/*@@parte:70_entrada.js*/
/* ===================== entrada ===================== */
var dblT={'-1':{u:-9,d:-9},'1':{u:-9,d:-9}};
function dblTap(dir,down){
  var now=performance.now(),q=dblT[dir];
  if(down){
    if(now-q.u<280&&q.u-q.d<450)keys.dbl=dir;
    else if(keys.dbl&&keys.dbl!==dir)keys.dbl=0;
    q.d=now;
  }else{
    q.u=now;if(keys.dbl===dir)keys.dbl=0;
  }
}
function press(code,down){
  if(code==='ArrowUp'||code==='KeyW')keys.up=down;
  switch(code){
    case 'ArrowLeft':case 'KeyA':keys.left=down;dblTap(-1,down);break;
    case 'ArrowRight':case 'KeyD':keys.right=down;dblTap(1,down);break;
    case 'Space':
      if(down&&!keys.jump)P.jbuf=.13;
      keys.jump=down;break;
    case 'ShiftLeft':case 'ShiftRight':keys.run=down;break;
    case 'KeyJ':case 'KeyX':case 'KeyZ':if(down)act();else actUp();break;
    case 'KeyK':keys.sjHold=down;if(P.arena){if(down)act();else actUp()}else if(down)spinJump();break;/* segurar o K = segurar o pulo (mesma altura do celular) *//* K: pulo giratório (na luta de katana continua sendo golpe) */
    case 'KeyL':case 'KeyC':if(down&&P.arena)throwStar();break;
    case 'ArrowDown':case 'KeyS':keys.down=down;break;
  }
}
/* ===== navegação por teclado (e controle mapeado no teclado) nos menus e no mapa =====
   setas/WASD movem o destaque, Enter/Espaço/J aperta, ←/→ mexem nas barras, Esc volta */
var NAV_DIR={ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d',ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r'};
var NAV_OK={Enter:1,Space:1,KeyJ:1,KeyX:1,KeyZ:1,KeyK:1,NumpadEnter:1};
var navEl=null,navIdx=-1;
function navBox(){var c=$('cfg');if(c&&!c.hidden)return $('cfgBox');if(card&&!card.hidden)return card;return null}
function navList(box){return [].slice.call(box.querySelectorAll('button,input[type=range]')).filter(function(el){if(el.disabled||el.hidden)return false;var r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;var st=getComputedStyle(el);return st.visibility!=='hidden'&&st.display!=='none'})}
function navSet(el){if(navEl&&navEl!==el)navEl.classList.remove('kfocus');navEl=el;if(!el)return;el.classList.add('kfocus');try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur()}catch(e){}/* só o destaque visual: sem foco do navegador, para o Enter não apertar duas vezes */try{el.scrollIntoView({block:'nearest'})}catch(e){}}
function navClear(){if(navEl)navEl.classList.remove('kfocus');navEl=null}
function navStart(L){/* primeiro destaque: o botão principal (amarelo) ou o primeiro da lista */
  if(!$('cfg').hidden){return $('cfg').classList.contains('pausing')?$('cfgClose'):L[0]}/* configurações: começa no topo; pausado: no Continuar */
  var p=L.filter(function(el){return el.classList.contains('btn')&&!el.classList.contains('ghost')});return p[0]||L[0]}
function navMove(box,dir){
  var L=navList(box);if(!L.length)return;
  if(!navEl||L.indexOf(navEl)<0){var r0=navIdx>=0&&navIdx<L.length?L[navIdx]:navStart(L);navSet(r0);navIdx=L.indexOf(r0);return}
  if(navEl.type==='range'&&(dir==='l'||dir==='r')){var mn=+navEl.min||0,mx=+navEl.max||100,st=(mx-mn)/20;navEl.value=Math.max(mn,Math.min(mx,+navEl.value+(dir==='r'?st:-st)));
    navEl.dispatchEvent(new Event('input',{bubbles:true}));navEl.dispatchEvent(new Event('change',{bubbles:true}));return}
  /* linhas = cada item das configurações (ou a fileira de botões); ↑/↓ andam de linha (ou de fileira dentro dela), ←/→ dentro da linha */
  var rowOf=function(el){return el.closest('.crow,.actions,.seg')||el.parentNode},rows=[],ri=-1;
  L.forEach(function(el){var r=rowOf(el);var rr=el.closest('.crow')||r;if(!rows.length||rows[rows.length-1].k!==rr)rows.push({k:rr,L:[]});rows[rows.length-1].L.push(el)});
  rows.forEach(function(R,k){if(R.L.indexOf(navEl)>=0)ri=k});
  var R=rows[ri],a=navEl.getBoundingClientRect(),ax=a.left+a.width/2,best=null;
  function near(list,f){var bs=1e9,bb=null;list.forEach(function(el){if(el===navEl)return;var b=el.getBoundingClientRect();if(!f(b))return;var sc=Math.abs(b.top-a.top)*3+Math.abs(b.left+b.width/2-ax);if(sc<bs){bs=sc;bb=el}});return bb}
  if(dir==='l'||dir==='r'){var k2=R.L.indexOf(navEl)+(dir==='r'?1:-1);best=R.L[k2]||null}
  else if(dir==='d'){best=near(R.L,function(b){return b.top>=a.bottom-2})||(rows[ri+1]?near(rows[ri+1].L,function(){return true})||rows[ri+1].L[0]:null)}
  else{best=near(R.L,function(b){return b.bottom<=a.top+2})||(rows[ri-1]?near(rows[ri-1].L,function(){return true})||rows[ri-1].L[0]:null)}
  if(best){navSet(best);navIdx=L.indexOf(best)}
}
function navPress(box){
  var L=navList(box);if(!navEl||L.indexOf(navEl)<0)return false;
  if(navEl.type==='range')return true;
  var i=L.indexOf(navEl);navEl.click();
  setTimeout(function(){var b2=navBox();if(!b2){navClear();navIdx=-1;return}var L2=navList(b2);/* a linha pode ter sido refeita: destaca o mesmo lugar */
    if(!navEl||L2.indexOf(navEl)<0){var sel=L2[Math.min(i,L2.length-1)];if(sel&&b2===box)navSet(sel);else{navClear();navIdx=-1}}},30);
  return true;
}
function mapKey(e){
  var d=NAV_DIR[e.code];
  if(d){var top=Math.min(save.unlocked,LEVELS.length)-1,cur=mapWalk?mapWalk.node:mapSel,n=cur+((d==='r'||d==='u')?1:-1);
    if(n<0||n>top){if(n>top&&!e.repeat)toast(n>=LEVELS.length?'Novos mundos em breve':'Termine a fase anterior para liberar');return}
    mapPan.x=mapPan.z=0;mapGo(n);return}
  if(NAV_OK[e.code]&&!e.repeat){if(!$('mapPanel').hidden)$('mpPlay').click();return}
  if((e.code==='Escape'||e.code==='Backspace')&&!e.repeat){$('mapBack').click();return}
  if((e.code==='KeyQ'||e.code==='Minus'||e.code==='NumpadSubtract'))mapCam.userData.zoom=Math.min(2.2,(mapCam.userData.zoom||1)*1.1);
  if((e.code==='KeyE'||e.code==='Equal'||e.code==='NumpadAdd'))mapCam.userData.zoom=Math.max(.6,(mapCam.userData.zoom||1)*.9);
}
window.addEventListener('pointerdown',function(){navClear()},true);
/* ===== controle (gamepad) direto no jogo: vira teclas por dentro, então vale em tudo (jogo, menus, mapa, pausa) =====
   analógico/setas = setas · A = pular/confirmar · B = giratório (nos menus: voltar) · X = ação · Y = estrela · RB/RT = correr · Start = pausa · Back = voltar */
var gpPrev={},gpOn=false;
function gpKey(code,down){try{window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code:code,key:code,bubbles:true,cancelable:true}))}catch(e){}}
function gpPoll(){
  if(!navigator.getGamepads)return;var gs=navigator.getGamepads(),g=null;for(var i=0;i<gs.length;i++)if(gs[i]&&gs[i].connected){g=gs[i];break}
  if(!g){if(gpOn){gpOn=false;for(var k in gpPrev)if(gpPrev[k])gpKey(k,false);gpPrev={}}return}
  if(!gpOn){gpOn=true;try{toast('Controle conectado! A pula · B giratório · X ação · Start pausa')}catch(e){}}
  /* controles genéricos no modo antigo (sem mapeamento padrão), ex. o do dono "Vendor: 1949 Product: 0402": botões na ordem do Android
     (0 A, 1 B, 3 X, 4 Y, 6 LB, 7 RB, 8 LT, 9 RT, 10 Select, 11 Start) e direcional como eixo 9 (chapéu) */
  var M=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  if(g.mapping!=='standard'&&g.buttons.length>=12)M=[0,1,3,4,6,7,8,9,10,11,13,14,-1,-1,-1,-1];
  var b=function(n){var i=M[n];var q=i>=0&&g.buttons[i];return !!(q&&(q.pressed||q.value>.5))},ax=g.axes[0]||0,ay=g.axes[1]||0;
  if(g.mapping!=='standard'&&g.axes.length>9){var h=g.axes[9];if(h>=-1.05&&h<=1.05){var d=Math.round((h+1)/(2/7));/* 0 cima,1 cima-dir,2 dir,3 baixo-dir,4 baixo,5 baixo-esq,6 esq,7 cima-esq */
    if(d===7||d===0||d===1)ay=-1;if(d>=3&&d<=5)ay=1;if(d>=1&&d<=3)ax=1;if(d>=5&&d<=7)ax=-1}}
  var menu=(state!=='play')||paused||(typeof navBox==='function'&&!!navBox());
  var want={ArrowLeft:b(14)||ax<-.5,ArrowRight:b(15)||ax>.5,ArrowUp:b(12)||ay<-.5,ArrowDown:b(13)||ay>.5,
    Space:b(0),KeyJ:b(2),KeyL:b(3),ShiftLeft:b(5)||b(7)||Math.abs(ax)>.93,KeyP:b(9)};
  want[menu?'Escape':'KeyK']=b(1);if(!menu)want.Escape=b(8);else want.Escape=want.Escape||b(8);
  if(menu&&!card.hidden&&b(9))want.Enter=true,want.KeyP=false;/* nos cartões o Start confirma */
  for(var c in want){var v=!!want[c];if(v!==!!gpPrev[c]){gpKey(c,v);gpPrev[c]=v}}
  for(var c2 in gpPrev)if(!(c2 in want)&&gpPrev[c2]){gpKey(c2,false);gpPrev[c2]=false}
}
window.addEventListener('gamepadconnected',function(){gpPoll()});
/* setinha do mouse some sozinha depois de 2,5 s parada (volta ao mexer o mouse) */
(function(){var t=null,de=document.documentElement;function hide(){de.classList.add('nocur')}function show(){de.classList.remove('nocur');clearTimeout(t);t=setTimeout(hide,2500)}
  window.addEventListener('mousemove',show,{passive:true});window.addEventListener('keydown',hide);t=setTimeout(hide,2500)})();/* usou mouse/toque: some o destaque */
window.addEventListener('keydown',function(e){
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].indexOf(e.code)>=0)e.preventDefault();
  if(state==='map'){mapKey(e);return}
  var nb=state!=='cine'&&navBox();
  if(nb){
    if(NAV_DIR[e.code]){navMove(nb,NAV_DIR[e.code]);return}
    if(NAV_OK[e.code]&&navEl){e.preventDefault();if(!e.repeat)navPress(nb);return}
    if(e.code==='Escape'&&!e.repeat&&!paused&&!$('cfg').hidden){$('cfgClose').click();navClear();navIdx=-1;return}
  }else if(navEl){navClear();navIdx=-1}
  if(e.repeat)return;
  if(state==='cine'){if(e.code==='Space'||e.code==='Enter'||e.code==='Escape'){e.preventDefault();endOpening()}return}/* clipe de abertura: pular */
  if(paused){if((e.code==='KeyP'||e.code==='Escape')&&window.__resume)window.__resume();return}
  if((e.code==='KeyP'||e.code==='Escape')&&state==='play'&&window.__pause){window.__pause();return}
  if(e.code==='KeyR'&&(state==='play'||state==='dead')){retry();return}
  if((e.code==='Enter'||e.code==='Space')&&!card.hidden&&primaryFn){primaryFn();return}
  press(e.code,true);
});
window.addEventListener('keyup',function(e){press(e.code,false)});
window.addEventListener('blur',function(){keys.left=keys.right=keys.jump=keys.run=keys.down=keys.up=keys.sjHold=false;keys.dbl=0;keys.jx=0;keys.jy=0});
(function touch(){
  var zone=$('stickZone'),base=$('stickBase'),knob=$('stickKnob'),jb=$('bJump'),pid=null,ox=0,oy=0,R=58;
  function home(){
    pid=null;base.style.left='';base.style.top='';base.style.bottom='';base.classList.remove('on');
    knob.style.transform='translate(0,0)';
    keys.jx=0;keys.jy=0;keys.up=false;keys.down=false;base.classList.remove('run');
  }
  function drive(e){
    var dx=e.clientX-ox,dy=e.clientY-oy,d=Math.hypot(dx,dy);
    if(d>R){dx*=R/d;dy*=R/d}
    knob.style.transform='translate('+dx+'px,'+dy+'px)';
    var x=dx/R,y=-dy/R,ax=Math.abs(x);
    keys.jx=ax<.08?0:(x>0?1:-1)*Math.min(1,(ax-.08)/.72);base.classList.toggle('run',Math.abs(keys.jx)>.9);
    keys.jy=y;keys.up=y>.55;keys.down=y<-.55;
  }
  zone.addEventListener('pointerdown',function(e){
    if(pid!==null)return;
    e.preventDefault();pid=e.pointerId;try{zone.setPointerCapture(pid)}catch(_){}
    initAudio();
    var r=zone.getBoundingClientRect();R=base.offsetWidth/2;
    ox=e.clientX;oy=e.clientY;
    base.style.left=(ox-r.left-R)+'px';base.style.top=(oy-r.top-R)+'px';base.style.bottom='auto';
    base.classList.add('on');drive(e);
  });
  zone.addEventListener('pointermove',function(e){if(e.pointerId===pid)drive(e)});
  zone.addEventListener('pointerup',function(e){if(e.pointerId===pid)home()});
  zone.addEventListener('pointercancel',function(e){if(e.pointerId===pid)home()});
  zone.addEventListener('lostpointercapture',function(e){if(e.pointerId===pid)home()});
  var jy0=0,jsj=false;
  jb.addEventListener('pointerdown',function(e){e.preventDefault();try{jb.setPointerCapture(e.pointerId)}catch(_){}initAudio();P.jbuf=.13;keys.jump=true;jb.classList.add('on');jy0=e.clientY;jsj=false});
  jb.addEventListener('pointermove',function(e){if(!keys.jump||jsj)return;if(jy0-e.clientY>28){jsj=true;spinJump();jb.classList.add('sj')}});/* arrastar o Pular para cima = pulo giratório */
  function jup(){keys.jump=false;jb.classList.remove('on');jb.classList.remove('sj')}
  jb.addEventListener('pointerup',jup);jb.addEventListener('pointercancel',jup);jb.addEventListener('lostpointercapture',jup);
  var fb=$('bFire');
  fb.addEventListener('pointerdown',function(e){e.preventDefault();try{fb.setPointerCapture(e.pointerId)}catch(_){}initAudio();act();fb.classList.add('on')});
  function fup(){fb.classList.remove('on');actUp()}
  var sb=$('bStar');sb.addEventListener('pointerdown',function(e){e.preventDefault();try{sb.setPointerCapture(e.pointerId)}catch(_){}initAudio();throwStar();sb.classList.add('on')});
  function sup(){sb.classList.remove('on')}sb.addEventListener('pointerup',sup);sb.addEventListener('pointercancel',sup);sb.addEventListener('lostpointercapture',sup);
  fb.addEventListener('pointerup',fup);fb.addEventListener('pointercancel',fup);fb.addEventListener('lostpointercapture',fup);
  document.addEventListener('contextmenu',function(e){e.preventDefault()});
})();
$('playBtn').addEventListener('click',function(){initAudio();if(primaryFn)primaryFn()});
$('mapBtn').addEventListener('click',function(){if(secondaryFn)secondaryFn()});
$('openBtn').addEventListener('click',function(){playOpening(function(){buildLevel(0);resetState();updateCamera(0,true);showMenu()})});
soundOn=cfg.snd!==false;musicOn=cfg.mus!==false;
(function(){
  var rows=$('cfgRows'),upd=[];
  var PN={auto:'Automático',low:'Baixo',med:'Médio',high:'Alto',ultra:'Ultra',max:'Máximo',custom:'Personalizado'};
  function edit(k,v){
    if(cfg.preset!=='custom'){var e=effCfg();cfg.c={res:e.res,shadows:e.shadows,bloom:e.bloom,bump:e.bump,part:e.part,fx:e.fx,lush:e.lush||0};cfg.preset='custom'}
    cfg.c[k]=v;saveCfg();applyGfx();
  }
  function row(label,opts,get,set,o){
    o=o||{};var d=document.createElement('div');d.className='crow'+(o.full?' full':'');
    var l=document.createElement('label');l.innerHTML=label+(o.note?' <em>'+o.note+'</em>':'');d.appendChild(l);
    var sg=document.createElement('div');sg.className='seg';var bs=[];
    opts.forEach(function(op){var b=document.createElement('button');b.type='button';b.textContent=op[1];b.addEventListener('click',function(){set(op[0])});sg.appendChild(b);bs.push([b,op[0]])});
    d.appendChild(sg);rows.appendChild(d);
    upd.push(function(){var v=get();bs.forEach(function(q){q[0].classList.toggle('on',q[1]===v);if(q[1]==='custom'){q[0].disabled=true;q[0].style.display=v==='custom'?'':'none'}})});
  }
  var onoff=[[true,'Ligado'],[false,'Desligado']];
  row('Predefinição',[['auto','Automático'],['low','Baixo'],['med','Médio'],['high','Alto'],['ultra','Ultra'],['max','Máximo'],['custom','Personalizado']],
    function(){return cfg.preset},
    function(v){if(v==='custom')return;cfg.preset=v;cfg.full=(v==='high'||v==='ultra'||v==='max');if(PRESETS[v]){var p=PRESETS[v];cfg.c={res:p.res,shadows:p.shadows,bloom:p.bloom,bump:p.bump,part:p.part,fx:p.fx,lush:p.lush||0}}saveCfg();
      var aaW=coarse?true:cfg.aa,aaCh=aaW!==!!cfg.aa;cfg.aa=aaW;saveCfg();
      if((coarse&&(!cfg.full)!==LITE)||(!coarse&&(v==='low')!==LITE)||aaCh){
        if(paused){needReload=true;applyGfx();toast('A troca completa vale ao voltar ao menu');return}/* não perde a fase em andamento */
        toast('Aplicando a qualidade…');try{sessionStorage.setItem('rac-reopen','cfg')}catch(e){}setTimeout(function(){location.reload()},450);return}/* os materiais mudam, então recarrega */
      applyGfx()},{full:true});
  // resolução
  (function(){
    var d=document.createElement('div');d.className='crow full';
    var l=document.createElement('label');d.appendChild(l);
    var r=document.createElement('input');r.type='range';r.min=40;r.max=150;r.step=5;d.appendChild(r);rows.appendChild(d);
    r.addEventListener('input',function(){edit('res',r.value/100)});
    upd.push(function(){var e=effCfg();l.innerHTML='Resolução <em>'+Math.round(e.res*100)+'%</em>';r.value=Math.round(e.res*100)});
  })();
  // saturação (ajuste pessoal: não muda a predefinição)
  (function(){
    var d=document.createElement('div');d.className='crow full';
    var l=document.createElement('label');d.appendChild(l);
    var r=document.createElement('input');r.type='range';r.min=0;r.max=200;r.step=5;d.appendChild(r);rows.appendChild(d);
    function cur(){return Math.round((cfg.satU===undefined?1:+cfg.satU)*100)}
    r.addEventListener('input',function(){cfg.satU=r.value/100;saveCfg();applyGfx()});
    r.addEventListener('dblclick',function(){cfg.satU=1;saveCfg();applyGfx()});
    upd.push(function(){var v=cur();l.innerHTML='Saturação <em>'+v+'%'+(v===100?' (padrão)':'')+'</em>';r.value=v});
  })();
  // brilho (ajuste pessoal, igual à saturação)
  (function(){
    var d=document.createElement('div');d.className='crow full';
    var l=document.createElement('label');d.appendChild(l);
    var r=document.createElement('input');r.type='range';r.min=50;r.max=150;r.step=5;d.appendChild(r);rows.appendChild(d);
    function cur(){return Math.round(briU()*100)}
    r.addEventListener('input',function(){cfg.briU=r.value/100;saveCfg();applyGfx()});
    r.addEventListener('dblclick',function(){cfg.briU=1;saveCfg();applyGfx()});
    upd.push(function(){var v=cur();l.innerHTML='Brilho <em>'+v+'%'+(v===100?' (padrão)':'')+'</em>';r.value=v});
  })();
  row('Sombras',onoff,function(){return effCfg().shadows},function(v){edit('shadows',v)});
  row('Bloom (luz)',onoff,function(){return effCfg().bloom},function(v){edit('bloom',v)});
  row('Cenário detalhado',[[0,'Desligado'],[.5,'Leve'],[.62,'Médio'],[.75,'Alto'],[1,'Completo']],function(){return +effCfg().lush||0},function(v){edit('lush',v)},{note:'(grama, partículas e cor)'});
  row('Relevo das texturas',onoff,function(){return effCfg().bump},function(v){edit('bump',v)});
  row('Partículas',[[0,'Baixas'],[1,'Médias'],[2,'Altas']],function(){return effCfg().part},function(v){edit('part',v)});
  row('Efeitos de água e luz',[[0,'Baixo'],[1,'Médio'],[2,'Alto']],function(){return effCfg().fx},function(v){edit('fx',v)},{note:'(ao entrar na fase)'});
  row('Suavização de bordas',onoff,function(){return !!cfg.aa},function(v){cfg.aa=v;saveCfg();toast('Vale ao reabrir o jogo')},{note:'(ao reabrir)'});
  row('Limite de quadros',[[30,'30'],[60,'60'],[0,'Sem limite']],function(){return cfg.cap},function(v){cfg.cap=v;saveCfg();applyGfx()});
  row('Câmera',[['clas','Clássica'],['cine','Cinemática']],function(){return cfg.cam||'clas'},function(v){cfg.cam=v;saveCfg()});/* cinemática: leve rotação, mais baixa, respira e recua ao correr */
  row('Contador de FPS',onoff,function(){return !!cfg.fps},function(v){cfg.fps=v;saveCfg();applyGfx()});
  row('Música',onoff,function(){return musicOn},function(v){musicOn=v;cfg.mus=v;saveCfg();refreshCfg()});
  row('Efeitos sonoros',onoff,function(){return soundOn},function(v){soundOn=v;cfg.snd=v;saveCfg();refreshCfg()});
  /* volumes (100% = o novo padrão, já mais alto que antes) */
  [['vMus','Volume da música'],['vSfx','Volume dos efeitos']].forEach(function(q){
    var d=document.createElement('div');d.className='crow full';var l=document.createElement('label');d.appendChild(l);
    var r=document.createElement('input');r.type='range';r.min=0;r.max=200;r.step=10;d.appendChild(r);rows.appendChild(d);
    function cur(){return Math.round((cfg[q[0]]===undefined?1:+cfg[q[0]])*100)}
    r.addEventListener('input',function(){cfg[q[0]]=r.value/100;saveCfg();initAudio();if(q[0]==='vSfx')try{sfx.coin()}catch(e){}upd.forEach(function(f){})});
    r.addEventListener('dblclick',function(){cfg[q[0]]=1;saveCfg()});
    upd.push(function(){var v=cur();l.innerHTML=q[1]+' <em>'+v+'%'+(v===100?' (padrão)':'')+'</em>';r.value=v});
    r.addEventListener('input',function(){var v=cur();l.innerHTML=q[1]+' <em>'+v+'%'+(v===100?' (padrão)':'')+'</em>'});
  });
  function refreshCfg(){upd.forEach(function(f){f()});}
  window.__cfgRefresh=function(){
    refreshCfg();
    var nm=cfg.preset==='auto'?'Automático (agora: '+PN[AUTO[autoLvl]]+')':PN[cfg.preset];
    var first=rows.querySelector('.crow label');if(first)first.innerHTML='Predefinição <em>'+nm+'</em>';
  };
  // teste de desempenho
  (function(){
    var d=document.createElement('div');d.className='crow full benchrow';
    var bt=document.createElement('button');bt.type='button';bt.textContent='Testar neste aparelho';
    var tx=document.createElement('p');d.appendChild(bt);d.appendChild(tx);rows.insertBefore(d,rows.children[1]);
    var LN={low:'Baixo',med:'Médio',high:'Alto',ultra:'Ultra'};
    window.__benchTxt=function(msg){
      if(msg){tx.textContent=msg;return}
      var r=cfg.bench;if(!r){tx.textContent='Mede os quadros por segundo de cada nível e mostra um selo: fluido, dá para jogar ou pesado.';return}
      tx.textContent=AUTO.map(function(k){return LN[k]+': '+(r[k]==null?'não testado':Math.round(r[k])+' FPS '+verdict(r[k]))}).join('  ·  ');
    };
    bt.addEventListener('click',function(){startBench(bt)});
    window.__benchBtn=bt;
  })();
  function verdict(f){return f>=52?'🟢':(f>=30?'🟡':'🔴')}
  window.__verdict=verdict;
  // comparação
  var cmp=$('cmp'),bar=$('cmpBar'),dragging=false;
  function setCx(px){
    var W=cmp.clientWidth,pw=Math.min(440,W*.54);var lo=W*.06,hi=W-pw-W*.04;
    px=Math.max(lo,Math.min(hi,px));cmp.style.setProperty('--cx',px+'px');
  }
  bar.addEventListener('pointerdown',function(e){dragging=true;try{bar.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()});
  bar.addEventListener('pointermove',function(e){if(dragging)setCx(e.clientX-cmp.getBoundingClientRect().left)});
  bar.addEventListener('pointerup',function(){dragging=false});bar.addEventListener('pointercancel',function(){dragging=false});
  function snapBase(){
    cmpBase=null;
    try{
      benchOv='low';applyGfx();animate(.001);render();
      cmpBase=renderer.domElement.toDataURL('image/jpeg',.85);
    }catch(e){cmpBase=null}
    benchOv=null;applyGfx();
  }
  function showcase(){
    buildLevel(0);resetState();
    P.x=5.2;P.y=0;P.vx=P.vy=0;P.face=1;
    cam.dist=10.2;
    var W=2*cam.dist*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.aspect;
    cfgView={x:P.x+W*.2,y:2.5};
    updateCamera(0,true);
  }
  function openCfg(){
    card.hidden=true;$('hud').style.visibility='hidden';
    showcase();animate(.016);render();
    snapBase();
    $('cmpImg').src=cmpBase||'';
    $('cfg').hidden=false;
    cmp.hidden=!cmpBase;
    setCx(cmp.clientWidth*.3);
    window.__cfgRefresh();
  }
  function clearKeys(){keys.left=keys.right=keys.jump=keys.run=keys.down=keys.up=keys.sjHold=false;keys.dbl=0;keys.jx=0;keys.jy=0}
  function pauseUI(on){
    $('cfgClose').textContent=on?'Continuar':'Voltar';$('cfg').classList.toggle('pausing',on);$('cfgBox').querySelector('h2').textContent=on?'Pausado':'Configurações';
    $('pauseRestart').hidden=!on;$('pauseMenu').hidden=!on;
  }
  function pauseGame(){
    if(state!=='play'||paused||bench)return;
    paused=true;clearKeys();
    $('hud').style.visibility='hidden';
    try{if(actx)actx.suspend()}catch(e){}
    pauseUI(true);cmp.hidden=true;$('cfg').hidden=false;
    window.__cfgRefresh();
  }
  function leavePause(){
    paused=false;$('cfg').hidden=true;$('hud').style.visibility='';pauseUI(false);
    try{if(actx)actx.resume()}catch(e){}
    acc=0;last=performance.now();
  }
  function resumeGame(){if(bench)return;leavePause()}
  window.__pause=pauseGame;window.__resume=resumeGame;
  $('pauseBtn').addEventListener('click',function(e){e.preventDefault();pauseGame()});
  $('pauseRestart').addEventListener('click',function(){if(bench)return;var i=levelIdx;leavePause();startLevel(i)});
  $('pauseMenu').addEventListener('click',function(){if(bench)return;if(needReload){location.reload();return}leavePause();buildLevel(0);resetState();layout();updateCamera(0,true);openMap()});/* pausa → mapa */
  function closeCfg(){
    if(paused){resumeGame();return}
    if(bench)return;
    $('cfg').hidden=true;cmp.hidden=true;cfgView=null;cmpBase=null;$('cmpImg').removeAttribute('src');
    $('hud').style.visibility='';
    buildLevel(0);resetState();layout();updateCamera(0,true);
    if(cfgFromMap){cfgFromMap=false;openMap()}else card.hidden=false;
  }
  var cfgFromMap=false;
  $('mapCfg').addEventListener('click',function(){leaveMap();cfgFromMap=true;openCfg()});/* engrenagem do mapa: configurações e volta para o mapa */
  window.__cfgFromMap=function(){cfgFromMap=true};
  $('cfgBtn').addEventListener('click',openCfg);window.__openCfg=openCfg;
  $('cfgClose').addEventListener('click',closeCfg);
  var _rf=window.__cfgRefresh;
  window.__cfgRefresh=function(){
    _rf();
    var r=$('cmpR');if(r){var nm=cfg.preset==='auto'?'Auto · '+PN[AUTO[autoLvl]]:PN[cfg.preset];r.textContent=nm}
    cmp.hidden=!($('cfg').hidden===false&&cmpBase&&cfg.preset!=='low');
    var b0=rows.querySelectorAll('.seg')[0];
    if(b0&&cfg.bench){var ks=['auto','low','med','high','ultra','max','custom'];[].forEach.call(b0.children,function(bn,i){var k=ks[i],base=bn.textContent.replace(/ (🟢|🟡|🔴)$/,'');if(cfg.bench[k]!=null)bn.textContent=base+' '+verdict(cfg.bench[k]);else bn.textContent=base})}
    if(window.__benchTxt&&!bench)window.__benchTxt();
  };
  window.__cfgRefresh();
})();
window.addEventListener('resize',layout);
if(window.ResizeObserver)new ResizeObserver(layout).observe(stage);
