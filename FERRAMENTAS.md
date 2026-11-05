# Ferramentas e testes — Rumo ao Cume

Arquivos para recriar a área de trabalho (ver seção 6 do Livro do Jogo). Estrutura: ferramentas/, testes/, testa.sh.

## ferramentas/separar.py

```python
#!/usr/bin/env python3
"""Separa o jogo (um HTML só) nas partes marcadas com /*@@parte:nome*/ ou <!--@@parte:nome-->.
Uso: python3 ferramentas/separar.py jogo.html partes/"""
import sys,os,re
src,dst=sys.argv[1],sys.argv[2]
os.makedirs(dst,exist_ok=True)
for f in os.listdir(dst):
    if re.match(r'^\d\d_',f):os.remove(os.path.join(dst,f))
pat=re.compile(r'^(?:/\*@@parte:(\S+?)\*/|<!--@@parte:(\S+?)-->)$')
name='00_inicio.html';buf=[];parts=[]
for l in open(src,encoding='utf8').read().split('\n'):
    m=pat.match(l)
    if m:
        parts.append((name,buf));name=m.group(1) or m.group(2);buf=[]
    buf.append(l)
parts.append((name,buf))
names=[p[0] for p in parts];assert len(names)==len(set(names)),'parte repetida'
for n,b in parts:
    open(os.path.join(dst,n),'w',encoding='utf8').write('\n'.join(b))
print(len(parts),'partes em',dst)

```

## ferramentas/montar.py

```python
#!/usr/bin/env python3
"""Junta as partes (em ordem de nome) de volta num HTML só.
Uso: python3 ferramentas/montar.py partes/ saida.html"""
import sys,os,re
src,dst=sys.argv[1],sys.argv[2]
fs=sorted(f for f in os.listdir(src) if re.match(r'^\d\d_',f))
txt='\n'.join(open(os.path.join(src,f),encoding='utf8').read() for f in fs)
open(dst,'w',encoding='utf8').write(txt)
print(len(fs),'partes ->',dst,len(txt.encode()),'bytes')

```

## ferramentas/copia_teste.py

```python
#!/usr/bin/env python3
"""Cria a cópia de teste: three.js local e um gancho __ev para os testes lerem o estado do jogo."""
import sys
s=open(sys.argv[1],encoding='utf8').read()
s=s.replace('https://cdn.jsdelivr.net/npm/three@0.147.0/','node_modules/three/')
i=s.index('})();\n</script>')
s=s[:i]+'\nwindow.__ev=function(c){return eval(c)};\n'+s[i:]
open(sys.argv[2],'w',encoding='utf8').write(s)

```

## testa.sh

```bash
#!/bin/bash
# Teste completo: monta o jogo a partir das partes, confere a montagem e roda todos os testes.
cd "$(dirname "$0")"
python3 ferramentas/montar.py partes/ jogo.html >/dev/null || exit 1
python3 ferramentas/copia_teste.py jogo.html testes/teste.html || exit 1
timeout 900 node testes/roda.js 2>&1 | tee testes/ultimo.log; exit ${PIPESTATUS[0]}

```

## testes/roda.js

```javascript
/* Teste completo do Rumo ao Cume: node testes/roda.js  (usa testes/teste.html montado pelo testa.sh) */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const ARQ='file://'+__dirname+'/teste.html';
const res=[];function marca(nome,ok,det){res.push([nome,ok,det]);console.log((ok?'  OK     ':'  FALHOU ')+nome+(det?'  — '+det:''))}
async function pagina(b,preset,lite){const pg=await b.newPage({viewport:{width:800,height:360}});const erros=[];pg.on('pageerror',e=>erros.push(e.message));await pg.route(/fonts/,r=>r.abort());
  await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},preset);
  await pg.goto(ARQ+(lite?'?lite=1':''),{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
  const E=c=>pg.evaluate(c=>window.__ev(c),c);return {pg,E,erros}}
const LEVELS_CUME=10;
const PRE=`enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;`;
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
 const N=await (async()=>{const {pg,E}=await pagina(b,'high');const n=await E('LEVELS.length');await pg.close();return n})();
 /* 1 e 2: todas as fases abrem e rodam, no celular (leve) e no PC */
 for(const [nome,preset,lite] of [['fases abrem no celular (Baixo)','vlow',1],['fases abrem no PC (Alto)','high',0]]){
  const {pg,E,erros}=await pagina(b,preset,lite);const ruins=[];const calls=[];
  for(let i=0;i<N;i++){const r=await E(`try{startLevel(${i});beginPlay();applyGfx();for(var k=0;k<200;k++)step(STEP);frame(performance.now()+16);'ok '+renderer.info.render.calls}catch(e){'X '+e.message}`);if(!r.startsWith('ok'))ruins.push('fase '+(i+1)+': '+r);else calls.push(r.split(' ')[1])}
  marca(nome,!ruins.length&&!erros.length,ruins.concat(erros).join('; ')||('desenhos por quadro: '+calls.join(',')));await pg.close()}
 const {pg,E,erros}=await pagina(b,'high');
 /* 3: raposinha sai do bloco e dá para montar, em todas as fases que têm bloco de raposa */
 {const r=await E(`var out=[],bad=0;for(var LI=0;LI<LEVELS.length;LI++){startLevel(LI);beginPlay();${PRE}var B=blocks.find(function(b){return b.c==='fox'});if(!B)continue;
   var t=-99;solids.forEach(function(q){if(q.dead||q.hid||q.block)return;if(B.x>q.l&&B.x<q.r&&q.t<=B.y-.5&&q.t>t)t=q.t});P.x=B.x-.3;P.y=t;P.vy=0;for(var k=0;k<4;k++)step(STEP);P.jbuf=.13;keys.jump=true;for(k=0;k<40;k++)step(STEP);keys.jump=false;P.x=B.x-4;for(k=0;k<150;k++)step(STEP);
   if(!fox){out.push('M'+(LI+1)+' raposa não saiu');bad++;continue}P.x=fox.x;P.y=fox.y;for(k=0;k<4;k++)step(STEP);for(k=0;k<90;k++)step(STEP);if(!P.mount){bad++;out.push('M'+(LI+1)+' não montou')}else out.push('M'+(LI+1)+' ok')}JSON.stringify([bad,out.join(' ')])`);const [bad,txt]=JSON.parse(r);marca('raposinha sai do bloco e monta',bad===0,txt)}
 /* 4: Vulcão — pulos do trecho das pedras de fogo */
 {const R=[[[166.5,180,3],[183,192,4]],[[183,192,4],[195,206,3]],[[195,206,3],[210,213,3]]];const falhas=[];
  for(const [A,B2] of R){let ok=false;for(const run of [.9,.5,1.6]){const r=await E(`startLevel(9);beginPlay();${PRE}flames.length=0;if(volEsc){window.__x0=window.__x0||volEsc.E.x0;volEsc.E.x0=1e9}
   var A=${JSON.stringify(A)},B=${JSON.stringify(B2)},ex=A[1];P.x=ex-${run*3};P.y=A[2];P.vy=0;P.vx=0;for(var k=0;k<6;k++)step(STEP);keys.right=true;keys.run=true;var j=false,ok=false;
   for(k=0;k<90*3;k++){if(!j&&P.x>ex-.35){keys.jump=true;P.jbuf=.13;j=true}var over=P.x>B[0]+.6&&P.x<B[1]-.6;if(j&&over){keys.right=false;keys.run=false;keys.left=P.vx>1.5&&P.x>(B[0]+B[1])/2-.3}
    step(STEP);if(state!=='play')break;if(j&&P.grounded&&P.y>=B[2]-.3&&P.x>B[0]-.3){ok=true;break}if(j&&P.grounded&&k>20&&Math.abs(P.y-B[2])>.3)break}keys.right=keys.left=keys.jump=keys.run=false;ok`);if(r){ok=true;break}}
   if(!ok)falhas.push(A[1]+'→'+B2[0])}
  await E(`if(window.__x0)LEVELS[9].escape.x0=window.__x0;1`);/* devolve o início da fuga */
  marca('Vulcão: pulos do trecho das pedras',!falhas.length,falhas.join(', '))}
 /* 5: Vulcão — fuga da parede de fogo */
 {const BOT=`for(k=0;k<90*40&&state==='play';k++){if(P.grounded){var ahead=P.x+1.0,fl=floorBelow(P.x+1.3,P.y+.2),fl2=floorBelow(P.x+.8,P.y+.2),wall=false;for(var i=0;i<solids.length;i++){var q=solids[i];if(q.dead)continue;if(ahead>q.l&&P.x<q.r&&q.t>P.y+.1&&q.b<P.y+P.h)wall=true}
   if(wall||fl<P.y-1.5||fl2<P.y-1.5){P.jbuf=.13;keys.jump=true}}if(!P.grounded&&P.vy<-2)keys.jump=false;step(STEP);if(P.grounded)keys.jump=false}keys.right=false;keys.run=false;`;
  const parado=await E(`startLevel(9);beginPlay();${PRE}P.x=342;P.y=23.5;var t=-1;for(var k=0;k<90*20;k++){step(STEP);if(state!=='play'){t=k/90;break}}t`);
  const andando=await E(`startLevel(9);beginPlay();enemies.forEach(function(e){if(e.t0!=='lavab'){e.alive=false;e.x=-999}});P.inv=1e9;hearts=99;P.x=332;P.y=26;for(var k=0;k<5;k++)step(STEP);keys.right=true;${BOT}state`);
  const correndo=await E(`startLevel(9);beginPlay();enemies.forEach(function(e){if(e.t0!=='lavab'){e.alive=false;e.x=-999}});P.inv=1e9;hearts=99;P.x=332;P.y=26;for(var k=0;k<5;k++)step(STEP);keys.right=true;keys.run=true;${BOT}state`);
  marca('Vulcão: fuga da parede de fogo',parado>0&&parado<5&&andando==='win'&&correndo==='win','parado morre em '+parado.toFixed(1)+'s, andando='+andando+', correndo='+correndo)}
 /* 6: Vulcão — pedras de fogo não pegam embaixo dos abrigos e pegam no aberto */
 {const r=await E(`var o=[];[[201,3],[184.3,4],[197.6,3],[203.5,3]].forEach(function(p){startLevel(9);beginPlay();${PRE}P.inv=0;var h0=hearts,n=0;for(var k=0;k<90*(p[0]===201?24:12);k++){P.x=p[0];P.y=p[1];P.vx=0;P.vy=0;step(STEP);if(hearts<h0){n++;h0=hearts;P.inv=0}}o.push(n)});JSON.stringify(o)`);const o=JSON.parse(r);
  marca('Vulcão: pedras de fogo e abrigos',o[0]>0&&o[1]===0&&o[2]===0&&o[3]===0,'aberto='+o[0]+' acertos, abrigos='+o.slice(1).join('/'))}
 /* 7: transformações (capa, flor, raposa) terminam e liberam o Kuro */
 {const r=await E(`var o=[];startLevel(0);beginPlay();${PRE}P.x=20;P.y=0;for(var k=0;k<30;k++)step(STEP);P.big=true;collectItem(mkItem('feather',P.x,P.y+1));var a=P.capeT>0;for(k=0;k<120;k++)step(STEP);o.push('capa:'+(a&&P.capeT===0&&P.cape));
   setCape(false);collectItem(mkItem('flower',P.x,P.y+1));a=P.fireT>0;for(k=0;k<120;k++)step(STEP);o.push('flor:'+(a&&P.fireT===0&&P.fire));
   setFire(false);spawnFox(P.x+1,0);for(k=0;k<80;k++)step(STEP);fox.x=P.x+.4;fox.cd=0;step(STEP);a=P.mountT>0;for(k=0;k<120;k++)step(STEP);o.push('raposa:'+(a&&P.mountT===0&&P.mount));
   keys.right=true;var x0=P.x;for(k=0;k<60;k++)step(STEP);keys.right=false;o.push('anda:'+(P.x>x0+1));o.join(' ')`);marca('transformações (capa, flor, raposa)',!/false/.test(r),r)}
 /* 8: giro da capa arremessa o inimigo e ele vira pedaços */
 {const r=await E(`startLevel(0);beginPlay();setCape(true);P.big=true;var e=enemies.filter(function(q){return q.alive&&q.t0==='beetle'})[0];e.speed=0;e.cur=0;P.x=e.x-1.1;P.y=e.y;P.face=1;P.inv=1e9;for(var k=0;k<5;k++)step(STEP);P.spinCd=0;spin();for(k=0;k<8;k++)step(STEP);var x0=e.x,d0=debris.length;for(k=0;k<60;k++){visEnemy(e,1/60);updDebris(1/60)}'morto='+!e.alive+' voou='+(e.x-x0).toFixed(1)+' pedaços='+(debris.length-d0)`);
  const m=/morto=true voou=([\d.]+) pedaços=(\d+)/.exec(r);marca('giro da capa arremessa e quebra o inimigo',!!m&&+m[1]>1&&+m[2]>0,r)}
 /* 9: chefe do castelo pode ser derrotado e a fase termina */
 {const r=await E(`try{var L=LEVELS.findIndex(function(l){return l.boss});startLevel(L);beginPlay();P.inv=999;P.x=boss.x-4;P.y=boss.top;P.vy=0;for(var k=0;k<400;k++)step(STEP);boss.state='stun';boss.hp=1;bossHit('stomp');for(k=0;k<300;k++)step(STEP);
   var c=items.filter(function(i){return i.type==='core'})[0];if(c){P.x=c.x;P.y=c.y-.8;P.vy=0;for(k=0;k<60;k++){step(STEP);if(state!=='play')break}}'chefe='+boss.state+' jogo='+state}catch(e){'ERRO '+e.message}`);
  marca('chefe do castelo é derrotado',/chefe=dead/.test(r)&&!/jogo=play/.test(r),r)}
 /* 10: Vulcão — raposa entra, relógio só corre lá dentro */
 {const r=await E(`startLevel(9);beginPlay();${PRE}var t0=timeLeft;for(var k=0;k<200;k++)step(STEP);var fora=timeLeft;P.x=5;P.y=0;for(k=0;k<90;k++)step(STEP);'fora='+(t0-fora).toFixed(2)+' dentro='+(fora-timeLeft).toFixed(2)`);
  const m=/fora=([\d.]+) dentro=([\d.]+)/.exec(r);marca('Vulcão: relógio só corre dentro',m&&+m[1]===0&&+m[2]>.5,r)}
 /* 12 e 13: O Cume — caminho da encosta, abrigo do vento e o vão que só se passa com vento a favor */
 {const rotas=require('./rotas.js');const calm='windZones.forEach(function(w){w.per=1e9});';const CI=LEVELS_CUME;
  const P=[[[-6,18,0],[21,32,2]],[[21,32,2],[32,39.5,4]],[[32,39.5,4],[41,44,4]],[[41,44,4],[47,52,4]],[[47,52,4],[53.4,58,4]],[[53.4,58,4],[58,66,6.2]],[[58,66,6.2],[68.5,71.5,8.2]],[[68.5,71.5,8.2],[74,77,10.2]],[[74,77,10.2],[79,92,10.5]],
   [[101,104,11],[105.4,112,11]],[[105.4,112,11],[115,119.5,13]],[[115,119.5,13],[121,126,13]],[[121,126,13],[129,150,15]]].map(p=>[p[0],p[1],calm]);
  const f=await rotas(E,CI,P);marca('Cume: caminho da encosta dá para passar',!f.length,f.join(', '));
  const sem=await rotas(E,CI,[[[79,92,10.5],[101,112,11],calm]]),com=await rotas(E,CI,[[[79,92,10.5],[101,112,11],'windZones.forEach(function(w){w.per=1;w.on=1;w.ph=0});']]);
  const ab=await E(`(function(){startLevel(${CI});beginPlay();${PRE}windZones.forEach(function(w){w.per=1;w.on=1;w.ph=0});P.x=38.6;P.y=4;for(var k=0;k<180;k++)step(STEP);var a=P.x;P.x=35;P.y=4;for(k=0;k<180;k++)step(STEP);return [a,P.x]})()`);
  marca('Cume: pedra protege da rajada e o vão longo pede vento a favor',sem.length>0&&!com.length&&Math.abs(ab[0]-38.6)<.05&&ab[1]<34,'atrás da pedra parado='+(Math.abs(ab[0]-38.6)<.05)+', fora empurrado='+(ab[1]<34)+', vão sem vento '+(sem.length?'impossível':'POSSÍVEL')+', com vento '+(com.length?'IMPOSSÍVEL':'possível'))}
 /* 14 e 15: O Cume — acima das nuvens: ilhas e nuvens dão para passar; as pipas levam o Kuro e ele cai na ilha certa; a nuvem some e volta */
 {const rotas=require('./rotas.js');const calm='windZones.forEach(function(w){w.per=1e9});';const CI=LEVELS_CUME;
  const P=[[[150,156,15],[159.5,162.5,16.5]],[[159.5,162.5,16.5],[165.5,168.5,18]],[[165.5,168.5,18],[171,184,19.5]],[[199,208,21],[211,214,22.5]],[[211,214,22.5],[217,220,24]],[[217,220,24],[223,226,25.2]],[[223,226,25.2],[229,240,26]]].map(p=>[p[0],p[1],calm]);
  const f=await rotas(E,CI,P);marca('Cume: ilhas e nuvens dão para passar',!f.length,f.join(', '));
  const res=[];for(const [ki,ax,ay,I] of [[0,182,19.5,[199,208,21]],[1,258,26,[279,294,30]]])res.push(await E(`(function(){startLevel(${CI});beginPlay();${PRE}windZones.forEach(function(w){w.per=1e9});P.x=${ax};P.y=${ay};for(var k=0;k<20;k++)step(STEP);
   keys.right=true;var grab=false;for(k=0;k<60;k++){if(!grab&&P.x>sumKites[${ki}].rope.x0-.6){keys.jump=true;P.jbuf=.13}step(STEP);if(P.climb===sumKites[${ki}].rope){grab=true;break}}keys.right=false;keys.jump=false;if(!grab)return 'pipa ${ki+1}: não agarrou';
   for(k=0;k<90*10;k++){step(STEP);if(sumKites[${ki}].st==='arrive')break}keys.down=true;step(STEP);keys.down=false;for(k=0;k<90*2;k++)step(STEP);var I=${JSON.stringify(I)};
   return (P.grounded&&P.x>I[0]&&P.x<I[1]&&Math.abs(P.y-I[2])<.2&&state==='play')?'ok':'pipa ${ki+1}: caiu fora ('+P.x.toFixed(1)+','+P.y.toFixed(1)+')'})()`));
  const nv=await E(`(function(){startLevel(${CI});beginPlay();${PRE}P.x=161;P.y=16.6;var c=sumClouds[0],t=0;for(var k=0;k<90*3;k++){step(STEP);t+=STEP;if(c.so.dead)break}var a=t;state='play';P.x=150;P.y=15;for(k=0;k<90*4;k++)step(STEP);return [a,!c.so.dead]})()`);
  marca('Cume: pipas levam o Kuro e nuvens somem e voltam',res.every(r=>r==='ok')&&nv[0]>.8&&nv[0]<1.4&&nv[1],res.join(' / ')+'; nuvem some em '+nv[0].toFixed(2)+'s, volta='+nv[1])}
 /* 16: O Cume — revanche do Rei Besouro: entra na arena, passa pelas 3 fases (investida, ondas de choque, mergulho e pedras) e a vitória termina o jogo */
 {const CI=LEVELS_CUME;await E(`(function(){startLevel(${CI});beginPlay();P.inv=1e9;hearts=99;P.x=300;P.y=34.8;for(var k=0;k<30;k++)step(STEP);P.x=309;for(k=0;k<20;k++)step(STEP);return 1})()`);
  const viu={};let ok=await E('P.arena&&boss.v2&&boss.state!=="wait"');
  for(let h=6;h>=1;h--){const r=await E(`(function(){var seen={};for(var k=0;k<90*14;k++){P.inv=1e9;step(STEP);seen[boss.state]=1;if(boss.waves.length)seen.ondas=1;if(boss.rocks.length)seen.pedras=1}boss.state='stun';boss.t=2;bossHit('katana');return Object.keys(seen).join(',')})()`);r.split(',').forEach(k=>viu[k]=1)}
  const fim=await E(`(function(){for(var k=0;k<200;k++)step(STEP);return boss.state==='dead'&&boss.wallR&&boss.wallR.dead?'derrotado':'chefe='+boss.state})()`);
  const need=['charge','spit','jump','dive','ondas','pedras','stun'];const falta=need.filter(k=>!viu[k]);
  marca('Cume: revanche do Rei Besouro (3 fases e vitória)',ok&&!falta.length&&fim==='derrotado','golpes vistos: '+Object.keys(viu).join(',')+(falta.length?' | FALTOU: '+falta.join(','):'')+' | final='+fim)}
 /* 17: O Cume — vencer o Rei abre o caminho até o pico; a bandeira do pico mostra a cena final e o cartão "Fim da primeira ilha" */
 {const CI=LEVELS_CUME;const r=await E(`(function(){startLevel(${CI});beginPlay();P.inv=1e9;hearts=99;P.x=300;P.y=34.8;for(var k=0;k<30;k++)step(STEP);P.x=309;for(k=0;k<20;k++)step(STEP);
   boss.hp=1;boss.state='stun';boss.t=2;bossHit('katana');for(k=0;k<200;k++)step(STEP);var open=!!(boss.wallR&&boss.wallR.dead);
   keys.right=true;for(k=0;k<90*8&&state==='play';k++){if(P.grounded&&P.x>330&&P.x<337){keys.jump=true;P.jbuf=.13}else keys.jump=false;step(STEP)}keys.right=false;keys.jump=false;window.__T0=performance.now();return [open,state,!!sumEnd]})()`);
  for(let i=1;i<=600;i+=1)await E(`frame(__T0+${i*16});1`);
  const c=await E(`[!document.getElementById('card').hidden,document.getElementById('cardKicker').textContent]`);
  marca('Cume: vitória abre o pico e mostra o final da ilha',r[0]&&r[1]==='win'&&r[2]&&c[0]&&c[1]==='Fim da primeira ilha','parede aberta='+r[0]+', estado='+r[1]+', cena final='+r[2]+', cartão='+c[1])}
 marca('sem erros de JavaScript durante os testes',!erros.length,erros.slice(0,3).join('; '));await pg.close();
 await b.close();const f=res.filter(r=>!r[1]).length;console.log('\n'+(f?'❌ '+f+' teste(s) falharam':'✅ todos os '+res.length+' testes passaram'));process.exit(f?1:0)})();

```

## testes/rotas.js

```javascript
/* testador de pulos: tenta ir de A até B correndo e pulando (vários impulsos). Uso: require('./rotas.js')(E,fase0,pares,opts) */
module.exports=async function(E,fase,pares,o){o=o||{};const falhas=[];
 for(const par of pares){const [A,B,ex]=par;let ok=false;
  for(const run of [.9,.5,1.6,2.4]){for(const lateJ of [.35,.7,.1]){
   const r=await E(`(function(){startLevel(${fase});beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});flames.length=0;if(typeof volEsc!=='undefined'&&volEsc){volEsc.E.x0=1e9}P.inv=1e9;hearts=99;${ex||''}
   var A=${JSON.stringify(A)},B=${JSON.stringify(B)},ex=A[1];P.x=ex-${run*3};P.y=A[2];P.vy=0;P.vx=0;for(var k=0;k<6;k++)step(STEP);keys.right=true;keys.run=true;var j=false,ok=false,hold=0;
   for(k=0;k<90*4;k++){if(!j&&P.x>ex-${lateJ}){keys.jump=true;P.jbuf=.13;j=true;hold=0}if(j)hold++;if(hold>40)keys.jump=false;var over=P.x>B[0]+.6&&P.x<B[1]-.6;if(j&&over){keys.right=false;keys.run=false;keys.left=P.vx>1.5&&P.x>(B[0]+B[1])/2-.3}
    step(STEP);if(state!=='play')break;if(j&&P.grounded&&P.y>=B[2]-.3&&P.x>B[0]-.3&&P.x<B[1]+.3){ok=true;break}if(j&&P.grounded&&k>20&&Math.abs(P.y-B[2])>.3)break}
   keys.right=keys.left=keys.jump=keys.run=false;return ok})()`);if(r){ok=true;break}}if(ok)break}
  if(!ok)falhas.push(A[1]+'→'+B[0]+'@'+B[2]+(par[3]?' ('+par[3]+')':''))}
 return falhas};

```

## testes/foto.js

```javascript
/* fotos de tela: node testes/foto.js <fase 1-11> <preset> x,y[,nome] x,y ...   (salva em testes/fotos/) */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
const [,,fase,preset,...pts]=process.argv;fs.mkdirSync(__dirname+'/fotos',{recursive:true});
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:900,height:405}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(p=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:p,pMig:1,aaMig:2}))},preset||'high');
await pg.goto('file://'+__dirname+'/teste.html'+(preset==='vlow'||preset==='low'?'?lite=1':''),{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);await E(`startLevel(${(+fase)-1});beginPlay();1`);
for(const p of pts){const [x,y,nome,extra]=p.split(',');await E(`(function(){P.x=${x};P.y=${y};P.vx=P.vy=0;for(var k=0;k<40;k++){P.x=${x};P.y=Math.max(P.y,${y});${extra?decodeURIComponent(extra):''};step(STEP)}updateCamera(0,true);frame(performance.now()+16);frame(performance.now()+32);return 1})()`);
 const f=__dirname+'/fotos/'+(nome||('f'+fase+'_'+x))+'.png';await pg.screenshot({path:f});console.log(f)}
await b.close()})();

```

## .gitignore

```text
testes/node_modules
testes/teste.html
testes/dbg.js
*.png
testes/ultimo.log

```
