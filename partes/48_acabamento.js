/* ===== Acabamento (pacote para o CrazyGames, aprovado pelo dono 15/11) =====
   Moeda: brilho + "+1" subindo. Pisar inimigo: tremidinha + estrelinhas + "★". Dano: borda vermelha piscando.
   Poder novo (onigiri, asa, pergaminho): flash branco e o nome grande no meio da tela.
   Vitória: números contando um por um com som, selo ("Ninja Mestre!" com os 3 cristais) e botão "Próximo mundo".
   Transição: escurece rápido ao entrar numa fase e ao abrir o mapa (no lugar do corte seco). */
var FX={pops:[],tex:{},cnt:0};
function fxTex(str,col){var k=str+col;if(FX.tex[k])return FX.tex[k];
  var c=document.createElement('canvas');c.width=128;c.height=64;var x=c.getContext('2d');x.font='900 44px system-ui,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';
  x.lineWidth=8;x.strokeStyle='rgba(30,20,10,.85)';x.strokeText(str,64,34);x.fillStyle=col;x.fillText(str,64,34);
  var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;FX.tex[k]=t;return t}
function fxPop(x,y,str,col){/* texto que sobe e some (sprite reusado) */
  if(!W)return;var p=null;for(var i=0;i<FX.pops.length;i++)if(FX.pops[i].t<=0&&FX.pops[i].sp.parent===W){p=FX.pops[i];break}
  if(!p){if(FX.pops.length>40)FX.pops=FX.pops.filter(function(q){return q.sp.parent===W});var sp=new T.Sprite(new T.SpriteMaterial({transparent:true,depthTest:false,depthWrite:false}));sp.renderOrder=20;add(sp);p={sp:sp,t:0};FX.pops.push(p)}
  p.sp.material.map=fxTex(str,col||'#ffd84a');p.sp.material.needsUpdate=true;p.sp.scale.set(1.1,.55,1);p.sp.position.set(x,y,.6);p.t=.85;p.y=y;p.sp.visible=true}
function fxUpd(dt){for(var i=0;i<FX.pops.length;i++){var p=FX.pops[i];if(p.t>0){p.t-=dt;var u=1-p.t/.85;p.sp.position.y=p.y+u*1.3;p.sp.material.opacity=p.t<.3?p.t/.3:1;if(p.t<=0)p.sp.visible=false}}}
function fxEl(id,css){var e=document.getElementById(id);if(!e){e=document.createElement('div');e.id=id;e.style.cssText=css;document.getElementById('stage').appendChild(e)}return e}
function fxHurt(){var e=fxEl('fxHurt','position:absolute;inset:0;z-index:4;pointer-events:none;opacity:0;transition:opacity .35s;box-shadow:inset 0 0 90px 28px rgba(255,30,30,.8)');
  e.style.transition='none';e.style.opacity=1;void e.offsetWidth;e.style.transition='opacity .45s';e.style.opacity=0}
function fxPower(name){/* flash branco + nome do poder no meio da tela */
  var f=fxEl('fxFlash','position:absolute;inset:0;z-index:4;pointer-events:none;background:#fff;opacity:0');f.style.transition='none';f.style.opacity=.55;void f.offsetWidth;f.style.transition='opacity .4s';f.style.opacity=0;
  var t=fxEl('fxPower','position:absolute;left:0;right:0;top:32%;z-index:6;text-align:center;pointer-events:none;color:#ffe680;font:italic 900 min(9vw,10vh)/1 system-ui,sans-serif;letter-spacing:.03em;-webkit-text-stroke:3px #3a1a00;text-shadow:0 4px 14px rgba(0,0,0,.5);opacity:0');
  t.textContent=name;t.style.transition='none';t.style.opacity=1;t.style.transform='scale(.6)';void t.offsetWidth;t.style.transition='transform .35s cubic-bezier(.2,1.6,.4,1),opacity .5s .9s';t.style.transform='scale(1)';t.style.opacity=0}
function fxFadeIn(){if(dyn||window.__noOpen)return;fadeIn=.35;$('fade').style.opacity=1}/* o animate clareia sozinho (mesmo fadeIn das ruínas) */
function fxFadeMap(){/* o mapa tem laço próprio (sem animate): clareia por CSS e devolve o controle */
  if(window.__noOpen)return;fadeIn=0;var f=$('fade');f.style.transition='none';f.style.opacity=1;void f.offsetWidth;f.style.transition='opacity .35s';f.style.opacity=0;
  setTimeout(function(){f.style.transition=''},450)}
/* ganchos nas funções do jogo (sem mexer nelas por dentro) */
(function(){
  var ac=addCoin;addCoin=function(){ac.apply(this,arguments);if(state==='play'){fxPop(P.x,P.y+P.h+.5,'+1','#ffd84a');emit(sparkPool,P.x,P.y+P.h*.6,3,1.6,.35,.18,.1,1)}};
  var hu=hurt;hurt=function(){var h=hearts,b=P.big,c=P.cape,f=P.fire;var r=hu.apply(this,arguments);if(hearts<h||(b&&!P.big)||(c&&!P.cape)||(f&&!P.fire))fxHurt();return r};
  var ci=collectItem;collectItem=function(it){var t=it&&it.type;ci.apply(this,arguments);
    var nm={mushroom:NJ?'ONIGIRI!':'COGUMELO!',feather:NJ?'ASA NINJA!':'CAPA!',flower:NJ?'PERGAMINHO DE FOGO!':'FLOR DE FOGO!',fruit:'ESCUDO!'}[t];if(nm)fxPower(nm)};
  var sl=startLevel;startLevel=function(){fxFadeIn();return sl.apply(this,arguments)};
  var om=openMap;openMap=function(){var r=om.apply(this,arguments);fxFadeMap();return r};
  var sc=showCard;showCard=function(){var o=document.getElementById('fxBadge');if(o)o.remove();FX.cnt++;return sc.apply(this,arguments)};
  var wl=winLevel;winLevel=function(){wl.apply(this,arguments);fxWinCard()};
})();
function fxStomp(x,y){shake=Math.max(shake,.12);emit(sparkPool,x,y+.6,10,3.4,.5,.28,.2,2);fxPop(x,y+1.6,'★','#fff2a0')}
function fxWinCard(){/* números da vitória contando, selo e botão "Próximo mundo" */
  var pb=$('playBtn');if(pb&&pb.textContent==='Continuar')pb.textContent='Próximo mundo';
  var s=$('cardStats');if(!s)return;var old=document.getElementById('fxBadge');if(old)old.remove();
  var bd=document.createElement('div');bd.id='fxBadge';bd.style.cssText='margin:6px auto 2px;display:inline-block;padding:6px 16px;border-radius:999px;font:italic 900 20px/1.2 system-ui,sans-serif;color:#2a1600;background:linear-gradient(#ffe680,#f0a830);box-shadow:0 3px 10px rgba(0,0,0,.35);transform:scale(0);transition:transform .4s cubic-bezier(.2,1.6,.4,1)';
  bd.textContent=gemsGot>=3?'Ninja Mestre! ★★★':(gemsGot>0?'Muito bem! '+'★'.repeat(gemsGot):'Missão cumprida!');
  s.parentNode.insertBefore(bd,s);
  var my=FX.cnt;
  var L=[].slice.call(s.querySelectorAll('li')),i=0;
  L.forEach(function(li){var sm=li.querySelector('small');if(!sm)return;var tn=li.lastChild;if(!tn||tn===sm)return;li._final=tn.textContent;li.style.opacity=0;li.style.transition='opacity .25s'});
  function next(){if(my!==FX.cnt)return;if(i>=L.length){bd.style.transform='scale(1)';try{sfx.gem()}catch(e){}return}var li=L[i++];if(li._final===undefined){next();return}li.style.opacity=1;
    var tn=li.lastChild,fin=li._final,m=fin.match(/^(\+?)(\d+)( \/ \d+)?$/),n=m?+m[2]:0;
    if(!m||n<=0||my!==FX.cnt){try{sfx.coin()}catch(e){}setTimeout(next,120);return}
    var k=0,steps=Math.min(10,n),iv=setInterval(function(){k++;var v=Math.round(n*k/steps);if(my!==FX.cnt){clearInterval(iv);return}tn.textContent=m[1]+v+(m[3]||'');if(k%2)try{sfx.coin()}catch(e){};if(k>=steps){clearInterval(iv);tn.textContent=fin;setTimeout(next,90)}},32)}
  setTimeout(next,250)}
