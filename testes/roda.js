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
  await E(`(function(){for(var i=0;i<600;i++)animate(1/60);frame(__T0+16);return 1})()`);/* a cena final sem desenhar cada quadro (mais rápido) */
  const c=await E(`[!document.getElementById('card').hidden,document.getElementById('cardKicker').textContent]`);
  marca('Cume: vitória abre o pico e mostra o final da ilha',r[0]&&r[1]==='win'&&r[2]&&c[0]&&c[1]==='Fim da primeira ilha','parede aberta='+r[0]+', estado='+r[1]+', cena final='+r[2]+', cartão='+c[1])}
 /* 18: golpes novos da arena (shuriken, golpe carregado, corte para cima) */
 {const r=await E(`(function(){startLevel(LEVELS_CUME_I);beginPlay();P.inv=1e9;hearts=99;P.x=300;P.y=34.8;for(var k=0;k<30;k++)step(STEP);P.x=309;for(k=0;k<20;k++)step(STEP);resetKids();var o=[];
   boss.state='idle';boss.t=99;P.x=boss.x-4;P.face=1;for(k=0;k<10;k++)step(STEP);throwStar();for(k=0;k<40;k++)step(STEP);o.push(boss.hp===6);
   boss.state='stun';boss.t=3;throwStar();for(k=0;k<40;k++)step(STEP);o.push(boss.hp===5);
   boss.state='idle';boss.t=99;P.x=boss.x-2.5;for(k=0;k<5;k++)step(STEP);act();for(k=0;k<60;k++)step(STEP);actUp();for(k=0;k<30;k++)step(STEP);o.push(boss.state==='stun');
   boss.state='idle';boss.t=99;P.x=boss.x-6;P.slashT=0;for(k=0;k<90;k++)step(STEP);var y0=P.y;keys.up=true;act();keys.up=false;actUp();var my=0;for(k=0;k<60;k++){step(STEP);my=Math.max(my,P.y-y0)}o.push(my>2);
   return o})()`.replace('LEVELS_CUME_I',LEVELS_CUME));
  marca('arena: shuriken, golpe carregado e corte para cima',r.every(Boolean),'shuriken só acerta tonto, carregado quebra a guarda, corte para cima sobe: '+r.join(','))}
 /* 19 e 20: Mundo 12 (Terra Nova) — abertura do barquinho, caminho da Trilha Verde e mapa da segunda ilha */
 {const W12=11;const r=await E(`(function(){startLevel(${W12});beginPlay();var a=!!(trIntro&&trIntro.on);for(var k=0;k<120*5;k++)step(STEP);return [a,!!(trIntro&&trIntro.on),P.x>-2.7&&P.grounded,!!fox]})()`);
  const rotas=require('./rotas.js');const X='if(trIntro)trIntro.on=false;';
  const P12=[[[-3,19,0],[19,64,0]],[[19,64,0],[68,80,1.2]],[[68,80,1.2],[80,92,2.6]],[[80,92,2.6],[97,140,0]],[[97,140,0],[145,158,1.2]],[[170,186,1.2],[186,206,2.6]],[[97,111.4,0],[111.5,115.5,2.8]],[[111.5,115.5,2.8],[117,121,5.3]],[[19,46.8,0],[47,54,3.0]],
   [[186,206,2.6],[206,212,1.4]],[[206,212,1.4],[213.6,215.4,1.2]],[[213.6,215.4,1.2],[217.2,219,1.5]],[[217.2,219,1.5],[220.8,222.6,1.3]],[[220.8,222.6,1.3],[224.4,226.2,1.6]],[[224.4,226.2,1.6],[228,233,1.4]],
   [[252,258,1.2],[258,261,2.2]],[[258,261,2.2],[261,277,2.2]],[[277,280,2.2],[282,283.8,1.6]],[[282,283.8,1.6],[285.6,287.4,1.3]],[[285.6,287.4,1.3],[289.2,291,1.5]],[[289.2,291,1.5],[292.8,318,1.2]],[[292.8,318,1.2],[318,334,1.2]],[[350.5,356.5,7.6],[358,382,1.2]]];
  const f=await rotas(E,W12,P12.map(p=>[p[0],p[1],X]));
  const tr=await E(`(function(){startLevel(${W12});beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;P.x=232.4;P.y=1.4;for(var k=0;k<10;k++)step(STEP);
    var st=0,ok=false;for(k=0;k<120*40;k++){var lg=null;trRiv.logs.forEach(function(o){if(o.so.l>233.0&&o.so.l<233.5&&!o.so.dead)lg=o});keys.right=false;keys.jump=false;
     if(st===0&&P.grounded&&lg){keys.jump=true;P.jbuf=.13;keys.right=true;st=1}else if(st===1){keys.right=!P.grounded||P.x<P.onPlat.x-.3;if(P.grounded&&P.onPlat&&P.onPlat.log)st=2}
     else if(st===2){if(P.onPlat&&P.onPlat.log&&P.onPlat.r>250.6){keys.jump=true;P.jbuf=.13;keys.right=true;st=3}}else if(st===3){keys.right=true;if(P.grounded&&P.x>252.2&&P.y>1.1){ok=true;break}}
     step(STEP);if(hearts<99&&st<3)break}keys.right=keys.jump=false;
    hearts=3;P.inv=0;P.x=216.3;P.y=.4;P.vx=P.vy=0;trRiv.safe=null;for(k=0;k<60;k++)step(STEP);var riv=hearts===2&&P.y>1;
    /* cogumelos: cada um leva até a pedra alta certa */
    var CG=[[323,1.2,330.2,[334.5,340,6.4]],[338.5,6.4,345,[350.5,356.5,7.6]],[366,1.2,369.5,[374,380.5,10.6]],[379.5,1.2,385,[388,404,1.6]]],cg=[];
    CG.forEach(function(c){startLevel(${W12});beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;P.x=c[0];P.y=c[1];for(var k=0;k<20;k++)step(STEP);var T=c[3],st=0,ok2=false;
      for(k=0;k<120*8;k++){keys.left=keys.right=keys.jump=false;
       if(st===0){keys.right=P.x<c[2]-1.6;if(c[1]<2&&P.grounded&&P.x>=c[2]-1.7){keys.jump=true;P.jbuf=.13;st=1}else if(c[1]>=2&&P.x>=c[2]-1.7){keys.right=true;st=1}}
       else if(st===1){keys.right=P.x<c[2]-.2;keys.left=P.x>c[2]+.3;if(P.vy>15)st=2}else{keys.right=P.x<(T[0]+T[1])/2;if(P.grounded&&P.y>=T[2]-.2&&P.x>T[0]&&P.x<T[1]){ok2=true;break}}
       step(STEP);if(P.y<-8)break}keys.left=keys.right=keys.jump=false;cg.push(ok2)});
    return [ok,riv,cg.every(Boolean),cg.join('')]})()`);
  marca('Mundo 12: barquinho, Trilha Verde, Rio Cristalino e Jardim dos Cogumelos dão para passar',r[0]&&!r[1]&&r[2]&&r[3]&&!f.length&&tr[0]&&tr[1]&&tr[2],'abertura='+r.slice(0,3).join(',')+' raposa='+r[3]+' troncos='+tr[0]+' correnteza devolve='+tr[1]+' cogumelos='+tr[3]+(f.length?' falhas: '+f.join(', '):''));
  const m=await E(`(function(){state='play';openMap({from:10});var n=mapNodes.length,barco=false,t=0;mapGo(${W12});for(var k=0;k<60*40&&mapAt!==${W12};k++){mapUpdate(1/60);if(mapBoat.g.visible)barco=true}var chegou=mapAt===${W12};
    mapGo(3);for(k=0;k<60*60&&mapAt!==3;k++)mapUpdate(1/60);var volta=mapAt===3;leaveMap();return [n,barco,chegou,volta,mapBoat.g.visible]})()`);
  marca('mapa com as duas ilhas: Kuro vai de barco até a Terra Nova e volta',m[0]>=22&&m[1]&&m[2]&&m[3]&&!m[4],'nós='+m[0]+' barco='+m[1]+' chegou no 12='+m[2]+' voltou ao 4='+m[3])}
 /* 21: Mundo 12, Caminho das Copas — cipó, tábuas, plataforma que anda, elevador, cipó e pendurado no cipó */
 {const rotas=require('./rotas.js');const X='if(trIntro)trIntro.on=false;';
  const f=await rotas(E,11,[[[388,404,1.6],[404,500,1.6]],[[459,464,19.8],[466.2,467.6,20.6]],[[466.2,467.6,20.6],[469.6,471,21.4]],[[469.6,471,21.4],[473,474.4,22.2]],[[473,474.4,22.2],[476.5,500,23]]].map(p=>[p[0],p[1],X]));
  const r=await E(`(function(){startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;P.x=411.9;P.y=1.6;for(var k=0;k<20;k++)step(STEP);
 var log=[],st='vine1',T=0;function K(){keys.left=keys.right=keys.jump=keys.up=keys.down=false}
 for(k=0;k<120*60;k++){K();T+=STEP;
  if(st==='vine1'){if(!P.climb){keys.jump=true;if(P.grounded)P.jbuf=.13}else{keys.up=true;if(P.y>=6.9){st='top1'}}}
  else if(st==='top1'){keys.up=true;if(!P.climb&&P.grounded&&P.y>7.4)st='p1'}
  else if(st==='p1'){var m=movers[movers.length-1];keys.right=P.x<417.3;if(P.x>=417.2&&m.l<419.5){keys.jump=true;P.jbuf=.13;keys.right=true;st='m1'}}
  else if(st==='m1'){keys.right=!P.grounded||(P.onPlat&&P.onPlat.mover&&P.x<P.onPlat.x);if(P.grounded&&P.onPlat&&P.onPlat.mover)st='m2'}
  else if(st==='m2'){keys.right=P.x<P.onPlat.x+.5;if(P.onPlat&&P.onPlat.mover&&P.onPlat.r>425.7){keys.jump=true;P.jbuf=.13;keys.right=true;st='p2'}}
  else if(st==='p2'){keys.right=!P.grounded||P.x<430.8;if(P.grounded&&P.y>8.6&&P.x>430.6){var L=trRiv.lifts[0];if(L.so.t<9.1){keys.right=true;keys.jump=true;P.jbuf=.13;st='lift'}}}
  else if(st==='lift'){keys.right=!P.grounded||P.x<434;if(P.grounded&&P.onPlat&&P.onPlat.lift&&P.onPlat.t>14.3){keys.right=true;keys.jump=true;P.jbuf=.13;st='p3'}}
  else if(st==='p3'){keys.right=!P.grounded||P.x<441;if(P.grounded&&P.y>14.4&&P.x>440.8){keys.jump=true;P.jbuf=.13;keys.right=true;st='v2'}}
  else if(st==='v2'){keys.jump=true;keys.right=!P.climb&&P.x<442.6;if(P.climb){st='v2c'}}
  else if(st==='v2c'){keys.up=true;if(!P.climb&&P.grounded&&P.y>19.2)st='p4'}
  else if(st==='p4'){keys.right=true;if(P.x>=447.9){keys.jump=true;P.jbuf=.13;st='rope'}}
  else if(st==='rope'){keys.jump=!P.climb;if(P.climb&&P.climb.rope){st='ropem'}}
  else if(st==='ropem'){keys.right=true;if(!P.climb&&P.grounded&&P.y>19.6)st='done'}
  if(st==='done')break;
  step(STEP);if(k%240===0)log.push(st+'@'+P.x.toFixed(1)+','+P.y.toFixed(1))}
 K();return st+' | '+log.join(' ')})()`);
  marca('Mundo 12: Caminho das Copas dá para subir',!f.length&&r.startsWith('done'),r.split(' | ')[0]+(f.length?' falhas: '+f.join(', '):''))}
 /* 22: Mundo 12, Cachoeira Secreta — a água empurra, parada deixa passar, a gruta tem o cristal e a água volta jogando o Kuro para fora */
 {const rotas=require('./rotas.js');const X='if(trIntro)trIntro.on=false;';
  const f=await rotas(E,11,[[[476.5,500,23],[502,506,20.2]],[[502,506,20.2],[508,512,17.2]],[[508,512,17.2],[514,518,14.2]],[[514,518,14.2],[520,568,10]]].map(p=>[p[0],p[1],X]));
  const r=JSON.parse(await E(`(function(){startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;P.x=535;P.y=10;for(var k=0;k<10;k++)step(STEP);
   trWF.st='on';trWF.t=0;var pushed=false;for(k=0;k<240;k++){keys.right=true;step(STEP);if(P.x>542.5)break;if(P.vx<-5)pushed=true}var passOn=P.x>542.5;keys.right=false;
   P.x=536.5;P.y=10;P.vx=0;for(k=0;k<20;k++)step(STEP);trWF.st='off';trWF.t=0;var gem=false,g0=gemsGot;
   for(k=0;k<120*3;k++){keys.right=P.x<538.8;if(P.grounded&&P.x>=538.4&&P.y<11){keys.jump=true;P.jbuf=.13}else keys.jump=P.vy>0;step(STEP);if(gemsGot>g0){gem=true;break}}
   keys.right=keys.jump=false;P.x=540;P.y=13.3;P.vx=P.vy=0;trWF.st='off';trWF.t=0;for(k=0;k<30;k++)step(STEP);trWF.st='on';trWF.t=.7;for(k=0;k<60;k++)step(STEP);var thrown=P.y<11.5&&P.x<538.2;
   trWF.st='off';trWF.t=0;P.x=536;P.y=10;P.vx=0;for(k=0;k<10;k++)step(STEP);for(k=0;k<200;k++){keys.right=true;step(STEP);if(P.x>543)break}keys.right=false;
   return JSON.stringify([pushed&&!passOn,gem,thrown,P.x>543])})()`));
  marca('Mundo 12: Cachoeira Secreta (água empurra, parada passa, cristal na gruta)',!f.length&&r.every(Boolean),'empurra='+r[0]+' cristal='+r[1]+' joga fora='+r[2]+' passa parada='+r[3]+(f.length?' falhas: '+f.join(', '):''))}
 /* 23: Mundo 12, Mirante da Floresta — ponte, casinhas em zigue-zague, ilha flutuante e o Cristal Ancestral termina a fase */
 {const rotas=require('./rotas.js');const X='if(trIntro)trIntro.on=false;windZones.forEach(function(w){w.per=1e9});';
  const f=await rotas(E,11,[[[520,568,10],[568,575,11.2]],[[568,575,11.2],[577,597,12.6]],[[577,597,12.6],[597,606,12.6]],[[597,598.8,12.6],[599,604,15.4]],[[599,604,15.4],[606.5,611.5,18.2]],[[600,605,21],[607,612,23.8]],[[607,612,23.8],[615,621,25.6]],[[615,621,25.6],[622.5,642,27.6]]].map(p=>[p[0],p[1],X]));
  const r=JSON.parse(await E(`(function(){var res=[];[.5,2].forEach(function(run){startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;P.x=607+run;P.y=18.2;P.face=-1;for(var k=0;k<10;k++)step(STEP);var j=false,ok=false;for(k=0;k<360;k++){keys.left=!(j&&P.x<604.4);keys.right=j&&P.x<602&&P.vx<-1.5;if(!j&&P.x<606.9){keys.jump=true;P.jbuf=.13;j=true}step(STEP);if(j&&P.grounded&&P.y>20.8){ok=true;break}if(j&&P.grounded&&k>20&&P.y<20)break}keys.left=keys.right=keys.jump=false;res.push(ok)});
    startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;P.x=630;P.y=27.6;for(var k=0;k<10;k++)step(STEP);for(k=0;k<120*5&&state==='play';k++){keys.right=P.x<635;step(STEP)}keys.right=false;res.push(state==='win');return JSON.stringify(res)})()`));
  marca('Mundo 12: Mirante da Floresta e o Cristal Ancestral terminam a fase',!f.length&&r.every(Boolean),'zigue-zague='+r[0]+','+r[1]+' cristal termina='+r[2]+(f.length?' falhas: '+f.join(', '):''))}
 /* 25: Mundo 13 inteiro — robô pula de cubo em cubo (cubos que crescem, somem e lançam) do chão até a torre */
 {const {R,BOT}=require('./rota13.js');const fails=[];
  for(const [A,B] of R){const r=await E(BOT+'('+JSON.stringify(A)+','+JSON.stringify(B)+')');if(!r.startsWith('ok'))fails.push(A+'->'+B)}
  marca('Mundo 13: robô sobe os 6 andares até a torre',!fails.length,fails.length?'falhas: '+fails.join(', '):R.length+' pulos ok')}
 /* 24: Mundo 13, Blocos Celestes — pulos entre os blocos que se mexem, tartarugas e queda sem perder coração */
 {const r=JSON.parse(await E(`(function(){var out=[];
  save.carryFor=-1;carryNow=null;for(var kk in keys){if(typeof keys[kk]==='boolean')keys[kk]=false;else if(typeof keys[kk]==='number')keys[kk]=0}
  /* coluna que cresce levanta o Kuro; ponte cresce, encolhe e volta a crescer */
  startLevel(12);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;var G=skG[0],k;P.x=G.q.x;P.y=G.q.y;P.prevY=P.y;P.vy=0;for(k=0;k<20;k++)step(STEP);
  var maxY=0;for(k=0;k<600;k++){step(STEP);maxY=Math.max(maxY,P.y)}out.push(maxY>=G.q.y+G.cs.length-1-.05);
  var H=skG[1],mn=99,mx=0;for(k=0;k<900;k++){step(STEP);mn=Math.min(mn,H.len);mx=Math.max(mx,H.len)}out.push(mn<1.05&&mx>H.cs.length-.05);
  /* ninguém fica preso: Kuro e tartaruga parados no caminho da ponte são empurrados para fora */
  startLevel(12);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;var H2=skG[1],stuck=0,est=0,tt=enemies[0];tt.alive=true;tt.x=12.2;tt.base=tt.y=H2.q.y-.9;tt.x0=11;tt.x1=13;tt.speed=0;tt.amp=0;
  P.x=12;for(k=0;k<900;k++){P.y=H2.q.y-.8;P.vy=0;tt.y=tt.base;step(STEP);var so=H2.so;if(P.x+P.w/2>so.l+.05&&P.x-P.w/2<so.r-.05&&P.y<so.t-.05&&P.y+P.h>so.b+.05)stuck++;if(tt.x+tt.w*.8>so.l+.05&&tt.x-tt.w*.8<so.r-.05&&tt.y<so.t-.05&&tt.y+tt.h>so.b+.05)est++}
  out.push(stuck<3&&est<3);
  /* tartarugas: pulo normal derruba (ou encolhe a de casco), o giratório derrota */
  ['turtle','tchase','tshell'].forEach(function(tp){startLevel(12);beginPlay();hearts=3;var e=enemies[0];e.type=tp;e.vis.g.visible=false;e.vis=makeTurtle(tp);e.x=22.6;e.x0=22.4;e.x1=22.8;e.hx=22.6;e.base=2;e.y=2;e.speed=0;e.amp=0;e.st='patrol';P.x=22.6;P.y=6;P.vy=0;P.inv=0;var a1=null;for(k=0;k<60;k++){step(STEP);if(a1===null&&(e.shellT>0||e.slp>0)){a1=e.alive}}for(k=0;k<30;k++)step(STEP);P.x=e.x;P.y=e.y+2.5;P.vy=-1;P.sj=true;for(k=0;k<90;k++){if(e.alive)P.x=e.x;step(STEP);P.sj=e.alive?true:P.sj}out.push(!!a1&&!e.alive&&hearts===3)});/* pulo normal: derruba/encolhe; giratório: derrota */
  /* queda: volta para a bandeirinha sem perder coração */
  startLevel(12);beginPlay();enemies.forEach(function(e){e.alive=false});hearts=3;respawn={x:19,y:22};P.x=1;P.y=24.5;P.vx=0;for(k=0;k<300;k++)step(STEP);out.push(hearts===3&&P.y>21);
  return JSON.stringify(out)})()`));
  marca('Mundo 13: blocos celestes, tartarugas e queda sem perder coração',r.every(Boolean),r.map(x=>x?'ok':'X').join(' '))}
 /* 26: Mundo 13 — nenhum apoio tem teto baixo em cima (espaço para pular com segurança) */
 {const r=JSON.parse(await E(`(function(){startLevel(12);beginPlay();var out=[],SUP=[];
  /* apoios: cada grupo de cubos no tamanho cheio, ilhas, blocos */
  skG.forEach(function(G,i){var q=G.q,n=G.cs.length,l,r,t;if(q.k==='gh'){var d=q.d||1;l=d>0?q.x-.5:q.x+.5-n;r=d>0?q.x-.5+n:q.x+.5;t=q.y}else if(q.k==='gv'){l=q.x-.5;r=q.x+.5;t=q.y-1+n}else if(q.k==='f'){l=q.x-.5;r=q.x-.5+n;t=q.y}else{l=q.x-.5;r=q.x+.5;t=q.y}SUP.push({n:'cubo'+i+q.k,l:l,r:r,t:t,b:(q.k==='gv'?q.y-1:t-1),own:G});if(G.alt){var B=skBox(G,G.alt.mode,G.alt.dh,G.alt.n);SUP.push({n:'cubo'+i+'alt',l:B.l,r:B.r,t:B.t,b:B.b,own:G})}});
  LV.solids.forEach(function(s){SUP.push({n:'ilha@'+s[2],l:s[0],r:s[1],t:s[2],b:s[2]>.5?s[2]-2.7:s[2]-.5})});
  (LV.blocks||[]).forEach(function(bk){SUP.push({n:'bloco'+bk.t+'@'+bk.x+','+bk.y,l:bk.x-.5,r:bk.x+.5,t:bk.y+1,b:bk.y})});
  SUP.forEach(function(a){SUP.forEach(function(c){if(a===c)return;var ov=Math.min(a.r,c.r)-Math.max(a.l,c.l);if(ov<=.05)return;var gap=c.b-a.t;if(gap>0&&gap<2.8&&c.n.indexOf('bloco')!==0)out.push(a.n+' -> teto '+c.n+' folga='+gap.toFixed(2)+' sobrepoe='+ov.toFixed(2))})});
  return JSON.stringify(out)})()`));marca('Mundo 13: espaço para pular em cima de cada apoio',!r.length,r.slice(0,4).join('; '))}
 /* 27: corações sem limite, passam de fase e voltam a 3 quando perde tudo; a tela mostra 5 + N */
 {const r=JSON.parse(await E(`(function(){var o=[];save.hearts=3;startLevel(0);beginPlay();hearts=7;setHearts();var h=document.getElementById('hearts');o.push(h.querySelectorAll('svg').length===5&&h.textContent.indexOf('+2')>=0);
   recordLevel();startLevel(1);beginPlay();o.push(hearts===7);hearts++;setHearts();o.push(hearts===8);
   lose();startLevel(1);beginPlay();o.push(hearts===3);save.hearts=3;return JSON.stringify(o)})()`));
  marca('corações: sem limite, passam de fase, 5 na tela + N, voltam a 3',r.every(Boolean),r.join(','))}
 /* 28: regra da peninha — bloco verde sempre dá pena (mesmo pequeno) e tem tartaruga guerreira: 1º pulo tira as asas, 2º derrota */
 {const r=JSON.parse(await E(`(function(){var o=[];var tot=0,blk=0;for(var L=0;L<LEVELS.length;L++){startLevel(L);var nb=blocks.filter(function(b){return b.c==='feather'&&b.t==='q'}).length,ng=enemies.filter(function(e){return e.type==='tguard'}).length;blk+=nb;if(nb!==ng)o.push(false)}o.push(blk>5);
   startLevel(0);beginPlay();save.carryFor=-1;P.big=false;var B=blocks.find(function(b){return b.c==='feather'});o.push(B.mesh.material===featherBlkM);hitBlock(B);o.push(items[items.length-1].type==='feather');
   save.carryFor=-1;carryNow=null;save.hearts=3;for(var kk in keys){if(typeof keys[kk]==='boolean')keys[kk]=false}keys.jx=0;keys.jy=0;startLevel(0);beginPlay();P.big=false;setCape(false);setFire(false);P.h=1.35;var h0=hearts;var G=enemies.find(function(e){return e.type==='tguard'});P.inv=0;P.x=G.x;P.y=G.y+3;P.vy=-1;for(var k=0;k<40;k++){P.x=G.x;step(STEP)}o.push(!G.wings&&G.alive);
   for(k=0;k<90;k++){P.x=G.x;P.y=G.y+4;P.vy=0;step(STEP)}o.push(!!G.gr);P.vy=-1;P.sj=true;for(k=0;k<60;k++){P.x=G.x;if(G.alive)P.sj=true;step(STEP)}o.push(!G.alive&&hearts===h0);
   startLevel(12);beginPlay();enemies.forEach(function(e){if(e.type!=='tguard')e.alive=false});var G2=enemies.find(function(e){return e.type==='tguard'});var mx=0;for(k=0;k<400;k++){P.inv=1e9;P.x=G2.x-4;P.y=0;P.vy=0;step(STEP);mx=Math.max(mx,gSpears.length)}o.push(mx>0);
   return JSON.stringify(o)})()`));
  marca('peninha: bloco verde, sempre dá pena, guerreira de guarda (2 pulos, arremessa lança)',r.every(Boolean),r.join(','))}
 /* 29: espaço livre em volta de cada bloco da pena, para a guerreira voar sem bater em blocos/plataformas */
 {const r=JSON.parse(await E(`(function(){var out=[];for(var L=0;L<LEVELS.length;L++){startLevel(L);
  if(typeof skUpd==='function'&&LV.cubes){skG.forEach(function(G){G.t=1e-3+((G.q.n||1)-1)*(G.q.g||.42);});skUpd(0)}
  blocks.forEach(function(B){if(B.c!=='feather'||B.t!=='q')return;var Z={l:B.x-3.2,r:B.x+3.2,b:B.y+1.4,t:B.y+3.6};
   solids.forEach(function(q){if(q===B.solid||q.hid)return;var ql=q.l,qr=q.r;if(q.mover){ql=q.cx-q.range-q.w/2;qr=q.cx+q.range+q.w/2}
     if(qr>Z.l&&ql<Z.r&&q.t>Z.b&&q.b<Z.t)out.push('M'+(L+1)+' pena@'+B.x+' x'+ql.toFixed(1)+'..'+qr.toFixed(1))})})}
  return JSON.stringify(out)})()`));marca('peninha: espaço livre para a guerreira voar',!r.length,r.slice(0,4).join('; '))}
 /* 30: nenhum bloco enterrado/encostado em terra ou outro sólido (tem que dar para bater nele) */
 {const r=JSON.parse(await E(`(function(){var out=[];for(var L=0;L<LEVELS.length;L++){startLevel(L);
  if(typeof skUpd==='function'&&LV.cubes){skG.forEach(function(G){G.t=1e-3;});skUpd(0)}
  blocks.forEach(function(B){var q0=B.solid;if(!q0)return;solids.forEach(function(q){if(q===q0||q.block||q.mover||q.hid||q.sky)return;
   var ov=Math.min(q.r,q0.r)-Math.max(q.l,q0.l);if(ov>.1&&q.b<q0.t+.3&&q.t>q0.b+.05)out.push('M'+(L+1)+' '+(B.c||B.t)+'@'+B.x+','+B.y)})})}
  return JSON.stringify(out)})()`));marca('blocos livres (nenhum enterrado na terra)',!r.length,r.slice(0,5).join('; '))}
 /* 31: Mundo 13 — 3 voltas por bandeirinha; a 4ª queda é de verdade (sem perder coração); voltar à bandeirinha devolve as chances */
 {const r=JSON.parse(await E(`(function(){var o=[],k,n;startLevel(12);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});hearts=3;respawn={x:19,y:22};
   for(n=0;n<3;n++){P.x=1;P.y=24.5;P.vx=0;P.vy=0;for(k=0;k<300;k++)step(STEP);o.push(P.y>21&&Math.abs(P.x-19)<2)}
   P.x=1;P.y=24.5;P.vx=0;P.vy=0;for(k=0;k<600;k++)step(STEP);o.push(P.y<20&&P.grounded&&hearts===3);
   P.x=19;P.y=22.2;P.vx=0;P.vy=0;for(k=0;k<20;k++)step(STEP);o.push(skFx.fallN===0);
   P.x=1;P.y=24.5;P.vx=0;P.vy=0;for(k=0;k<300;k++)step(STEP);o.push(P.y>21);return JSON.stringify(o)})()`));
  marca('Mundo 13: 3 voltas por bandeirinha, 4ª queda de verdade, sem perder coração',r.every(Boolean),r.join(','))}
 /* 32: Mundo 14, Torre dos Vaga-lumes — o Kuro anda na tábua da engrenagem uma volta inteira sem cair; robô sobe até o sino */
 {const r=JSON.parse(await E(`(function(){startLevel(13);beginPlay();P.inv=1e9;var G=twG[0],so=G.pl[0].so;P.x=(so.l+so.r)/2;P.y=so.t;P.vy=0;P.grounded=true;P.onPlat=so;var off=0;for(var k=0;k<1000;k++){step(STEP);if(P.onPlat!==so)off++}var o=[off===0,G.a>6.28];startLevel(13);beginPlay();P.inv=1e9;enemies.forEach(function(e){if(e.type!=='frog')return;var b0=e.base,mn=1e9;for(k=0;k<1200;k++){P.x=e.sx+(k%600<300?3:-3);P.y=b0;P.vy=0;step(STEP);mn=Math.min(mn,e.y)}o.push(mn>b0-.2)});
   /* tábua firme: pulando por baixo bate a cabeça; tábua descendo em cima do Kuro no chão empurra para fora (nunca fica dentro) */
   startLevel(13);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;var G0=twG[0];G0.q.w=0;var lo=G0.pl.reduce(function(a,b){return b.y<a.y?b:a});for(k=0;k<20;k++){P.x=lo.x;P.y=0;P.vy=0;step(STEP)}var thr=false;keys.jump=true;P.jbuf=.13;for(k=0;k<120;k++){step(STEP);if(k>40)keys.jump=false;if(P.y>lo.so.t-.05)thr=true}keys.jump=false;o.push(!thr);
   startLevel(13);beginPlay();enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;G0=twG[0];var st=0;for(k=0;k<1200;k++){if(k%200===0){P.x=8;P.y=0;P.vx=0}step(STEP);G0.pl.forEach(function(p){var so=p.so;if(P.x+P.w/2>so.l+.05&&P.x-P.w/2<so.r-.05&&P.y<so.t-.05&&P.y+P.h>so.b+.05)st++})}o.push(st===0);
   /* rodas separadas: em nenhum ângulo uma tábua (com o Kuro em cima) encosta em outra roda ou numa viga */
   var Gs=LV.gears,S=LV.solids.concat(LV.lights||[]),Hh=1.9,Mm=.25,N=36,bad=0;function pk(g,a){var r=[];for(var i=0;i<(g.n||4);i++){var b=a+i*6.2832/(g.n||4);r.push([g.x+Math.cos(b)*g.r,g.y+Math.sin(b)*g.r])}return r}
   function pb(p){return [p[0]-.9,p[0]+.9,p[1]-.15,p[1]+.15]}function rb(p){return [p[0]-.9-Mm,p[0]+.9+Mm,p[1]+.15,p[1]+.15+Hh]}function ov(a,b){return a[0]<b[1]&&b[0]<a[1]&&a[2]<b[3]&&b[2]<a[3]}
   var sb=S.map(function(q){return [q[0],q[1],q[2]-(q[2]<.5?1.2:(q[3]==='terra'?3.5:.6)),q[2]]}),sr=S.map(function(q){return [q[0]-Mm,q[1]+Mm,q[2],q[2]+Hh]});
   Gs.forEach(function(g,i){for(var a=0;a<N;a++)pk(g,a/N*6.2832).forEach(function(p){sb.forEach(function(q){if(ov(rb(p),q)||ov(pb(p),q))bad++});sr.forEach(function(q){if(ov(pb(p),q))bad++})});
     Gs.forEach(function(g2,i2){if(i2<=i||Math.hypot(g.x-g2.x,g.y-g2.y)>g.r+g2.r+6)return;for(var a=0;a<N;a++)for(var a2=0;a2<N;a2++)pk(g,a/N*6.2832).forEach(function(p){pk(g2,a2/N*6.2832).forEach(function(q){if(ov(rb(p),pb(q))||ov(rb(q),pb(p))||ov(pb(p),pb(q)))bad++})})})});
   o.push(bad===0);
   /* plataformas de luz: acendem e apagam conforme o vaga-lume passa */
   startLevel(13);beginPlay();P.inv=1e9;var seen=twL.map(function(){return [0,0]});for(k=0;k<1800;k++){P.x=1;P.y=0;step(STEP);twL.forEach(function(L,i){seen[i][L.so.dead?1:0]=1})}o.push(seen.every(function(q){return q[0]&&q[1]}));
   /* alavanca vira as rodas do andar (sem mexer nos dados da fase); mariposa apaga a roda e, derrotada, a luz volta */
   startLevel(13);beginPlay();P.inv=1e9;var w0=twG[10].q.w;P.x=2.5;P.y=77.5;P.vy=-3;P.grounded=false;for(k=0;k<30;k++)step(STEP);o.push(twG[10].q.w===-w0&&LV.gears[10].w===w0);
   var mo=enemies.find(function(e){return e.type==='moth'}),dk=0;for(k=0;k<900;k++){P.x=1;P.y=0;step(STEP);if(twG[10].dark>0||twG[11].dark>0)dk++}o.push(dk>60);var GG=twG[mo.route[mo.ri]];mo.sit=2;GG.dark=3;GG.mothE=mo;killE(mo,'stomp');step(STEP);o.push(!(GG.dark>0));
   /* lá fora: vitória-régia afunda e volta, tronco leva o Kuro, ponte afunda, pedras rolam e caem, robô de corda precisa de 2 pulos, cair na água é queda de verdade */
   startLevel(13);beginPlay();enemies.forEach(function(e){if(e.type!=='wrob')e.alive=false});P.inv=1e9;var pd=twOut.pads[0];P.x=pd.q[0];P.y=pd.so.t;P.grounded=true;P.onPlat=pd.so;for(k=0;k<400;k++){step(STEP);if(pd.so.dead)break}o.push(pd.so.dead);for(k=0;k<500;k++){P.x=27;P.y=102;step(STEP)}o.push(!pd.so.dead);
   var Lg=twOut.logs[0];P.x=Lg.x;P.y=Lg.so.t;P.grounded=true;P.onPlat=Lg.so;for(k=0;k<200;k++)step(STEP);o.push(P.onPlat===Lg.so);
   var nr=0,minY=999;for(k=0;k<1500;k++){P.x=133;P.y=104.5;step(STEP);nr=Math.max(nr,twOut.rocks.length);twOut.rocks.forEach(function(q){minY=Math.min(minY,q.y)})}o.push(nr>0&&minY<100);
   var wr=enemies.find(function(e){return e.type==='wrob'});P.inv=0;P.x=wr.x;P.y=wr.y+1.4;P.vy=-3;P.grounded=false;for(k=0;k<5;k++)step(STEP);var a1=wr.alive&&wr.off>0;P.x=wr.x;P.y=wr.y+1.4;P.vy=-3;P.sj=true;for(k=0;k<5;k++)step(STEP);o.push(a1&&!wr.alive);
   startLevel(13);beginPlay();dyn=null;for(k=0;k<120;k++)step(STEP);P.inv=0;P.x=31.5;P.y=101;for(k=0;k<200;k++)step(STEP);o.push(state!=='play');
   return JSON.stringify(o)})()`));
  const {R,BOT}=require('./rota14.js');const fails=[];
  for(const [A,B] of R){const q=await E(BOT+'('+JSON.stringify(A)+','+JSON.stringify(B)+')');if(!q.startsWith('ok'))fails.push(A+'->'+B)}
  marca('Mundo 14: rodas separadas, tábuas e vigas firmes, sapos, luz, alavancas, mariposas, lado de fora e o robô chega até o sino',r.every(Boolean)&&!fails.length,r.join(',')+(fails.length?' falhas: '+fails.join(', '):''))}
 /* 33: Mundo 13 — nenhum bloco (tijolo, "?") encostado ou em cima/embaixo colado num cubo (normal, alternado ou fileira roxa) */
 {const r=JSON.parse(await E(`(function(){startLevel(12);var out=[],SUP=[];skG.forEach(function(G,i){var q=G.q;if(q.k==='gh'||q.k==='gv'){var B=skBox(G,G.mode,G.dh,G.n);SUP.push({n:'cubo'+i,l:B.l,r:B.r,b:B.b,t:B.t});if(G.alt){B=skBox(G,G.alt.mode,G.alt.dh,G.alt.n);SUP.push({n:'cubo'+i+'alt',l:B.l,r:B.r,b:B.b,t:B.t})}}else G.cs.forEach(function(c,j){SUP.push({n:'cubo'+i+q.k,l:c.cx-.5,r:c.cx+.5,t:c.top,b:c.top-1})})});
  LV.blocks.forEach(function(bk){var a={l:bk.x-.5,r:bk.x+.5,b:bk.y,t:bk.y+1};SUP.forEach(function(c){var ov=Math.min(a.r,c.r)-Math.max(a.l,c.l);if(ov<=-.3)return;var up=c.b-a.t,dn=a.b-c.t;
   if((ov>.05&&((up>-.01&&up<2)||(dn>-.01&&dn<2)||(up<0&&dn<0)))||(ov>-.3&&ov<=.05&&up<0&&dn<0))out.push((bk.c||bk.t)+'@'+bk.x+','+bk.y+' x '+c.n)})});return JSON.stringify(out)})()`));
  marca('Mundo 13: blocos com espaço, sem encostar nos cubos',!r.length,r.slice(0,4).join('; '))}
 /* 34: clipe de abertura — passa na 1ª vez do Mundo 1, termina no cartão do Mundo 1, marca como visto; pular funciona; da 2ª vez não passa */
 {const r=JSON.parse(await E(`(function(){var o=[];window.__noOpen=false;save.seenOpen=0;startLevel(0);o.push(state==='cine'&&!!opn);var n=0;while(opn&&n<2400){animate(1/60);n++}o.push(!opn&&state==='intro'&&!card.hidden&&save.seenOpen===1&&n>1100);
   startLevel(0);o.push(state==='intro'&&!opn);
   playOpening(function(){startLevel(0)});for(n=0;n<120;n++)animate(1/60);endOpening();o.push(!opn&&state==='intro'&&!document.getElementById('opnOv'));
   window.__noOpen=true;card.hidden=true;return JSON.stringify(o)})()`));
  marca('abertura: o Rei Besouro rouba o cristal (passa 1 vez, pular funciona)',r.every(Boolean),r.join(','))}
 /* 35: roupa nova do Kuro — troca no final do Cume (luz descendo), usa do Mundo 12 em diante, roupa antiga do 1 ao 11 */
 {const r=JSON.parse(await E(`(function(){startLevel(10);beginPlay();var o=[rig.outfit===0];var fv0=fox&&fox.vis;cumeEnding();for(var k=0;k<200;k++)animate(1/60);o.push(rig.outfit===1);o.push(!!(fox&&fox.vis&&fox.vis!==fv0&&fox.vis.g.parent));sumEnd=null;card.hidden=true;
   startLevel(11);o.push(rig.outfit===1);startLevel(0);o.push(rig.outfit===0);startLevel(13);o.push(rig.outfit===1);startLevel(5);o.push(rig.outfit===0);card.hidden=true;return JSON.stringify(o)})()`));
  marca('roupa nova do Kuro na Terra Nova (troca no final do Cume)',r.every(Boolean),r.join(','))}
 /* 36: raposinha na Terra Nova — Impulso prende o inimigo numa bolha que sobe, vira degrau, estoura e o inimigo volta; na 1ª ilha continua derrubando */
 {const r=JSON.parse(await E(`(function(){var o=[];function prep(L){startLevel(L);beginPlay();if(typeof trIntro!=='undefined')trIntro=null;var x0=L===0?6:30;P.x=x0;P.y=floorBelow(x0,20);P.vy=0;for(var k=0;k<20;k++)step(STEP);spawnFox(P.x,P.y);fox.state='ride';mountFox();for(k=0;k<120;k++)step(STEP);
     var e=enemies.find(function(q){return q.type==='beetle'})||enemies[0];e.x=P.x+4;e.y=floorBelow(e.x,P.y+2);e.base=e.y;e.by=e.y;e.sx=e.x;e.speed=0;e.cur=0;P.face=1;P.inv=1e9;var x0b=P.x;foxBoost();for(k=0;k<40;k++)step(STEP);o.push(L===11?Math.abs(P.x-x0b)<1:true);return e}
   var e=prep(11),k;o.push(!!e.bub&&e.alive);var y0=e.bub.y0;for(k=0;k<70;k++)step(STEP);o.push(e.y-y0>.9);dismountFox('off');P.x=e.x;P.y=e.bub.so.t+1;P.vy=0;for(k=0;k<40;k++)step(STEP);o.push(P.onPlat===e.bub.so&&P.grounded);
   P.x=20;P.y=floorBelow(20,5);for(k=0;k<600;k++){P.x=20;step(STEP)}o.push(!e.bub&&e.alive&&Math.abs(e.y-y0)<.05&&!solids.some(function(s){return s.bub}));
   var e2=prep(0);o.push(!e2.alive&&!e2.bub);card.hidden=true;return JSON.stringify(o)})()`));
  marca('raposinha na Terra Nova: cospe a Bolha de Ponte (inimigo vira degrau)',r.every(Boolean),r.join(','))}
 /* 37: Automático e resolução dinâmica — sobe só depois de folgado, volta se não aguentar (e não tenta de novo naquele mundo), lembra por mundo; resolução desce e volta */
 {const r=JSON.parse(await E(`(function(){var o=[],sp=cfg.preset,sc=JSON.stringify(cfg);cfg.preset='auto';cfg.autoW={};cfg.autoLvl=0;failW={};startLevel(0);beginPlay();autoSkip=0;o.push(autoLvl===0);
   for(var i=0;i<300;i++)perfTick(1/60);o.push(autoLvl===0);for(i=0;i<400;i++)perfTick(1/60);o.push(autoLvl===1);
   autoSkip=0;for(i=0;i<130;i++)perfTick(1/40);o.push(autoLvl===0&&failW[0]===1);for(i=0;i<1200;i++)perfTick(1/60);o.push(autoLvl===0&&dynK===1);
   autoSkip=0;for(i=0;i<160;i++)perfTick(1/40);o.push(dynK<1);for(i=0;i<900;i++)perfTick(1/60);o.push(dynK===1);
   cfg.autoW[3]=1;startLevel(3);o.push(autoLvl===1);startLevel(0);o.push(autoLvl===0);
   cfg=JSON.parse(sc);cfg.preset=sp;failW={};dynK=1;applyGfx();card.hidden=true;return JSON.stringify(o)})()`));
  marca('Automático esperto e resolução dinâmica',r.every(Boolean),r.join(','))}
 /* 38: navegação por teclado/controle — menu, configurações (barra muda com ←/→), mapa (← → escolhe, Enter joga), pausa */
 {await E('showMenu();navClear();navIdx=-1;1');const o=[];const K=async k=>{await pg.keyboard.press(k);await pg.waitForTimeout(40)};
  await K('ArrowDown');o.push(await E('navEl&&navEl.id==="playBtn"'));await K('ArrowRight');o.push(await E('navEl&&navEl.id==="mapBtn"'));
  await E('window.__openCfg();1');for(let i=0;i<10&&!(await E('!!navEl&&navEl.type==="range"'));i++)await K('ArrowDown');o.push(await E('navEl&&navEl.type==="range"'));
  const v=await E('+navEl.value');await K('ArrowRight');o.push(await E('+navEl.value>'+v));await K('ArrowLeft');await K('Escape');o.push(await E('$("cfg").hidden'));
  await E('navClear();navIdx=-1;openMap({from:3});1');await K('ArrowRight');await E('for(var i=0;i<300;i++)mapUpdate(1/60);1');o.push(await E('mapAt===4'));
  await K('ArrowLeft');await K('ArrowLeft');await E('for(var i=0;i<400;i++)mapUpdate(1/60);1');o.push(await E('mapAt===2'));
  await K('Enter');o.push(await E('state!=="map"&&levelIdx===2'));
  await E('card.hidden=true;state="play";1');await K('KeyP');await K('ArrowDown');o.push(await E('paused&&navEl&&navEl.id==="cfgClose"'));await K('Enter');o.push(await E('!paused'));
  await E('card.hidden=true;1');
  marca('teclado/controle nos menus, configurações e mapa',o.every(Boolean),o.join(','))}
 /* 39: fogo vira moeda — o inimigo some, a moeda cai no chão e fica até o Kuro pegar */
 {const r=JSON.parse(await E(`(function(){startLevel(0);beginPlay();P.fire=true;var e=enemies.find(function(q){return q.alive&&q.type==='beetle'})||enemies[0];P.x=e.x-4;P.y=floorBelow(P.x,e.y+3);e.speed=0;P.face=1;P.inv=1e9;var c0=bank,k,o=[];
   for(k=0;k<5;k++)step(STEP);P.fcd=0;shoot();for(k=0;k<90;k++){step(STEP);animate(STEP);if(!e.alive)break}o.push(!e.alive);for(k=0;k<120;k++){step(STEP);animate(STEP)}
   var d=dropCoins[0];o.push(!!d&&d.on&&d.rest&&Math.abs(d.y-floorBelow(d.x,d.y)-.38)<.05&&bank===c0);P.x=d.x;P.y=floorBelow(d.x,d.y+1);for(k=0;k<10;k++){step(STEP);animate(STEP)}o.push(!d.on&&bank===c0+1);
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('fogo vira moeda que fica no chão',r.every(Boolean),r.join(','))}
 /* 40: pulo giratório (K) — sem poder gira; capa gira acertando; flor solta fogo pros dois lados; montado salta da raposinha; no ar logo após o pulo vira giratório (celular) */
 {const r=JSON.parse(await E(`(function(){var o=[],k;function prep(){startLevel(0);beginPlay();if(typeof trIntro!=='undefined')trIntro=null;P.x=6;P.y=floorBelow(6,20);P.vy=0;P.inv=1e9;P.mountT=0;P.growT=0;enemies.forEach(function(e){e.alive=false});for(k=0;k<20;k++)step(STEP)}
   prep();spinJump();step(STEP);o.push(P.sj&&P.vy>8&&!P.grounded);for(k=0;k<120;k++)step(STEP);o.push(P.grounded&&!P.sj);
   prep();setCape(true);spinJump();step(STEP);o.push(P.sj&&P.spinT>0);setCape(false);
   prep();P.fire=true;fbClear();spinJump();step(STEP);var fs=fbs.filter(function(f){return f.on});o.push(fs.length===2&&fs.some(function(f){return f.vx>0})&&fs.some(function(f){return f.vx<0}));P.fire=false;
   prep();spawnFox(P.x,P.y);fox.state='ride';mountFox();for(k=0;k<110;k++)step(STEP);o.push(!!P.mount);spinJump();step(STEP);o.push(!P.mount&&P.sj&&P.vy>8);
   prep();P.jbuf=.13;keys.jump=true;step(STEP);step(STEP);spinJump();step(STEP);keys.jump=false;o.push(P.sj&&!P.grounded);
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('pulo giratório (K / arrastar o Pular)',r.every(Boolean),r.join(','))}
 /* 41: pulo normal faz o inimigo de chão dormir (não machuca, acorda depois); voador cai e depois volta a voar; giratório derrota */
 {const r=JSON.parse(await E(`(function(){var o=[],k;startLevel(0);beginPlay();if(typeof trIntro!=='undefined')trIntro=null;hearts=3;P.mountT=0;
   var e=enemies.find(function(q){return q.alive&&q.type==='beetle'});enemies.forEach(function(q){if(q!==e)q.alive=false});e.speed=0;e.cur=0;
   P.inv=0;P.x=e.x;P.y=e.y+2.5;P.vy=-1;P.sj=false;for(k=0;k<40;k++){P.x=e.x;step(STEP)}o.push(e.alive&&e.slp>0&&hearts===3);
   var nb=0;P.x=e.x;P.y=e.y+2.5;P.vy=-1;for(k=0;k<120;k++){P.x=e.x;var vy0=P.vy;step(STEP);if(vy0<0&&P.vy>5)nb++}o.push(nb===0&&P.grounded&&P.y>e.y+.3);/* dormindo: não quica, fica em pé em cima dele */
   P.inv=1e9;P.x=e.x-2;P.y=floorBelow(P.x,e.y+1);P.vy=0;keys.right=true;var up=false;for(k=0;k<60&&!up;k++){step(STEP);if(Math.abs(P.x-e.x)<.2&&P.y>e.y+.3)up=true}keys.right=false;o.push(up);hearts=3;
   spawnFox(e.x-2.5,e.y);fox.state='ride';mountFox();P.mountT=0;P.x=e.x-2.5;P.y=floorBelow(P.x,e.y+1);P.vy=0;sleepE(e);for(k=0;k<20;k++)step(STEP);keys.right=true;var upF=false;for(k=0;k<80&&!upF;k++){step(STEP);if(Math.abs(P.x-e.x)<.25&&P.y>e.y+.3&&e.alive)upF=true}keys.right=false;o.push(upF&&!!P.mount);dismountFox('off');fox=null;P.mount=false;/* montado: sobe por cima também */o.push(up);/* andando: sobe por cima */
   P.x=e.x;P.y=e.y;P.vy=0;P.inv=0;for(k=0;k<30;k++){P.x=e.x;P.y=e.y;step(STEP)}o.push(hearts===3);/* encostar dormindo não machuca */
   P.x=e.x-8;for(k=0;k<500;k++){P.x=e.x-8;step(STEP)}o.push(e.alive&&!(e.slp>0)&&!e.safe);/* acordou */
   P.x=e.x;P.y=e.y+2.5;P.vy=-1;P.sj=true;for(k=0;k<40;k++){P.x=e.x;if(e.alive)P.sj=true;step(STEP)}o.push(!e.alive);
   startLevel(0);beginPlay();P.mountT=0;var b=enemies.find(function(q){return q.type==='bat'});
   if(!b){b=enemies[0];}enemies.forEach(function(q){if(q!==b)q.alive=false});var bx=5;for(var xx=5;xx<60;xx+=.5){if(floorBelow(xx,9)===floorBelow(xx,1)&&floorBelow(xx,1)>-1){bx=xx;break}}b.type='bat';b.x=bx;b.x0=bx-1;b.x1=bx+1;b.base=b.y=floorBelow(bx,1)+4;b.speed=0;b.st='patrol';var y0=b.y;
   P.inv=1e9;P.x=b.x;P.y=b.y+2.5;P.vy=-1;P.sj=false;for(k=0;k<30;k++){P.x=b.x;step(STEP)}o.push(b.alive&&b.slp>0);for(k=0;k<120;k++){P.x=b.x-8;step(STEP)}o.push(b.y<y0-2&&b.landed);
   var back=false;for(k=0;k<700;k++){P.x=b.x-15;P.y=floorBelow(P.x,30);step(STEP);if(b.alive&&!(b.slp>0)&&!b.wake&&Math.abs(b.y-y0)<.3)back=true}o.push(back);/* voltou a voar na altura de antes */
   startLevel(0);beginPlay();P.mountT=0;var f=enemies.find(function(q){return q.type==='beetle'})||enemies[0];enemies.forEach(function(q){if(q!==f)q.alive=false});var fx=bx;f.type='frog';f.x=fx;f.x0=fx-1;f.x1=fx+1;var gy=floorBelow(fx,1);f.y=gy+2.2;f.fg=false;f.vy=4;f.vx=0;f.st='patrol';
   P.inv=1e9;P.x=f.x;P.y=f.y+2;P.vy=-2;P.sj=false;for(k=0;k<40;k++){P.x=f.x;step(STEP);if(f.slp>0)break}var stomped=f.slp>0;for(k=0;k<120;k++){P.x=f.x-6;step(STEP)}o.push(stomped&&f.landed&&Math.abs(f.y-gy)<.05);/* sapo pisado no ar cai até o chão */
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('pulo normal: dorme/derruba; giratório: derrota',r.every(Boolean),r.join(','))}
 /* 42: montado na raposinha, pisar derrota na hora */
 {const r=JSON.parse(await E(`(function(){var o=[],k;startLevel(0);beginPlay();P.mountT=0;var e=enemies.find(function(q){return q.alive&&q.type==='beetle'});enemies.forEach(function(q){if(q!==e)q.alive=false});e.speed=0;
   P.x=e.x-3;P.y=floorBelow(P.x,e.y+3);spawnFox(P.x,P.y);fox.state='ride';mountFox();P.mountT=0;for(k=0;k<110;k++)step(STEP);o.push(!!P.mount);
   P.inv=1e9;P.x=e.x;P.y=e.y+2.5;P.vy=-1;P.sj=false;for(k=0;k<40;k++){if(e.alive)P.x=e.x;step(STEP)}o.push(!e.alive);card.hidden=true;return JSON.stringify(o)})()`));
  marca('montado na raposinha: pisão derrota na hora',r.every(Boolean),r.join(','))}
 /* 43: controle (gamepad) — A pula, B giratório, Start pausa, direcional no menu e no mapa */
 {const r=JSON.parse(await E(`(function(){var o=[],k,pad={connected:true,mapping:'standard',buttons:[],axes:[0,0]};for(k=0;k<17;k++)pad.buttons.push({pressed:false,value:0});navigator.getGamepads=function(){return [pad]};
   function set(n,v){pad.buttons[n].pressed=v;pad.buttons[n].value=v?1:0;gpPoll()}
   startLevel(0);beginPlay();if(typeof trIntro!=='undefined')trIntro=null;P.mountT=0;enemies.forEach(function(e){e.alive=false});P.x=6;P.y=floorBelow(6,20);for(k=0;k<20;k++)step(STEP);
   gpPoll();set(0,true);step(STEP);step(STEP);o.push(P.vy>5);set(0,false);for(k=0;k<150;k++)step(STEP);
   set(1,true);step(STEP);o.push(!!P.sj);set(1,false);for(k=0;k<150;k++)step(STEP);
   pad.axes[0]=1;gpPoll();o.push(keys.right===true);pad.axes[0]=0;gpPoll();o.push(keys.right===false);
   set(9,true);o.push(paused);set(9,false);set(9,true);o.push(!paused);set(9,false);
   showMenu();navClear();navIdx=-1;set(13,true);set(13,false);o.push(!!navEl);
   openMap({from:3});set(15,true);set(15,false);for(k=0;k<300;k++)mapUpdate(1/60);o.push(mapAt===4);set(1,true);set(1,false);o.push(state!=='map');
   /* controle genérico (modo antigo): A=0, X=3, Start=11, direcional pelo eixo 9 */
   var gp={connected:true,mapping:'',buttons:[],axes:[0,0,0,0,0,0,0,0,0,3.29]};for(k=0;k<16;k++)gp.buttons.push({pressed:false,value:0});navigator.getGamepads=function(){return [gp]};gpPoll();
   startLevel(0);beginPlay();card.hidden=true;state='play';paused=false;gpPoll();gp.buttons[11].pressed=true;gpPoll();o.push(paused);gp.buttons[11].pressed=false;gpPoll();gp.buttons[11].pressed=true;gpPoll();gp.buttons[11].pressed=false;gpPoll();
   gp.axes[9]=-1+4/7;gpPoll();o.push(keys.right===true);gp.axes[9]=3.29;gpPoll();o.push(keys.right===false);
   pad.connected=false;navigator.getGamepads=function(){return []};gpPoll();card.hidden=true;return JSON.stringify(o)})()`));
  marca('controle: pular, giratório, pausa, menus e mapa',r.every(Boolean),r.join(','))}
 /* 44: Mina — cair numa bandeirinha continua na mina; perder todos os corações volta para a superfície (começo da fase) */
 {const r=JSON.parse(await E(`(function(){var o=[];startLevel(14);beginPlay();o.push(!!LV.minePre);mineFall();o.push(!!LV.mine);retry();o.push(!!LV.mine);lose();retry();o.push(!!LV.minePre);card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mina: perdeu tudo volta para a superfície',r.every(Boolean),r.join(','))}
 /* 45: Mundo 16 — Pedrão-totem esmaga quem está embaixo e dá carona; Minhocão sai, dorme no pulo e volta à toca; abelhas não saem do seu pedaço */
 {const r=JSON.parse(await E(`(function(){var o=[],k;startLevel(15);beginPlay();card.hidden=true;state='play';enemies.forEach(function(e){e.alive=false});hearts=3;P.inv=0;P.big=false;
   var T0=flTot[0],h0=hearts;P.x=T0.d.x;P.y=0;for(k=0;k<120;k++)step(STEP);o.push(hearts<h0&&Math.abs(P.x-T0.d.x)>1);
   P.inv=1e9;for(k=0;k<30;k++)step(STEP);P.x=T0.d.x;P.y=T0.so.t+.5;P.vy=0;for(k=0;k<30;k++)step(STEP);var y1=P.y;for(k=0;k<150;k++)step(STEP);o.push(P.y-y1>2);
   startLevel(15);beginPlay();card.hidden=true;state='play';P.x=20;P.y=0;P.inv=1e9;var W=enemies.find(function(e){return e.type==='worm'}),mx=0;for(k=0;k<400;k++){step(STEP);mx=Math.max(mx,W.y-W.base)}o.push(mx>1.8);
   W.mt=W.wait+W.air*.5;step(STEP);killE(W,'stomp');o.push(W.slp>0);for(k=0;k<620;k++)step(STEP);o.push(W.alive&&!(W.slp>0)&&W.mt<3);
   var B=enemies.find(function(e){return e.type==='bee'});P.x=30;P.y=0;for(k=0;k<400;k++)step(STEP);o.push(B.x>=B.x0-1.6&&B.x<=B.x1+1.6);killE(B,'stomp');o.push(!!B.fly);killE(B,'sjump');o.push(!B.alive);
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 16: Pedrão-totem, Minhocão e abelhas',r.every(Boolean),r.join(','))}
 /* 46: Mundo 16 parte 2 — tatu sai rolando, pulo machuca e fogo derrota; broto não sai com o Kuro em cima; peixe pula do rio; tronco machuca; abelha não entra em bloco */
 {const r=JSON.parse(await E(`(function(){var o=[],k,h0,mx;function go(x){startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;P.big=false;P.x=x;P.y=floorBelow(x,40);P.vy=0}
   go(209);var A=enemies.find(function(e){return e.type==='armad'}),st=[];for(k=0;k<160;k++){step(STEP);if(st.indexOf(A.st2)<0)st.push(A.st2)}o.push(st.indexOf('roll')>=0);
   go(212);A=enemies.find(function(e){return e.type==='armad'});A.st2='roll';A.at=0;A.x=212.3;A.y=A.base;h0=hearts;P.y=A.base+.6;P.vy=-2;P.sj=true;P.grounded=false;for(k=0;k<3;k++)step(STEP);o.push(hearts<h0&&A.alive);o.push(killE(A,'fire')&&!A.alive);
   go(191);var S=enemies.find(function(e){return e.type==='sprout'});mx=0;for(k=0;k<400;k++){P.x=191;step(STEP);mx=Math.max(mx,S.len)}o.push(mx===0);
   go(188);S=enemies.find(function(e){return e.type==='sprout'});P.inv=1e9;mx=0;for(k=0;k<400;k++){step(STEP);mx=Math.max(mx,S.len)}o.push(mx===1);
   go(225);P.inv=1e9;var F=enemies.find(function(e){return e.type==='jfish'});mx=-99;for(k=0;k<400;k++){step(STEP);mx=Math.max(mx,F.y)}o.push(mx>2.5);
   go(244);var hit=0;h0=hearts;for(k=0;k<400;k++){P.x=246;P.y=3.2;P.vy=0;step(STEP);if(hearts<h0){hit=1;break}}o.push(!!hit);
   go(240);P.inv=1e9;var B=enemies.filter(function(e){return e.type==='bee'})[2],bad=0;for(k=0;k<900;k++){P.x=241+Math.sin(k/60)*3;P.y=3.2;step(STEP);if(beeBlk(B.x,B.y))bad++}o.push(bad===0);
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 16: tatu, broto, peixe-voador, tronco e abelhas fora dos blocos',r.every(Boolean),r.join(','))}
 /* 47: Mundo 16 parte 3 — tronco da cachoeira leva o Kuro para baixo; ilha afunda só um pouco; coruja mira, mergulha e volta ao poleiro */
 {const r=JSON.parse(await E(`(function(){var o=[],k;function go(x,y){startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;P.x=x;P.y=y;P.vy=0}
   go(310.5,0);var L=flWl[0];L.y=8;P.y=8.3;for(k=0;k<20;k++)step(STEP);var y1=P.y;o.push(P.onPlat===L.so);for(k=0;k<60;k++)step(STEP);o.push(y1-P.y>.8);
   go(373.3,3.4);for(k=0;k<30;k++)step(STEP);var S=flSk[0];o.push(P.onPlat===S.so);for(k=0;k<300;k++)step(STEP);o.push(S.d>2&&P.y>.8&&state==='play');
   go(360,3.6);var W=enemies.find(function(e){return e.type==='owl'}),st=[];for(k=0;k<300;k++){step(STEP);if(st.indexOf(W.st2)<0)st.push(W.st2)}o.push(st.indexOf('dive')>=0);
   killE(W,'stomp');o.push(W.slp>0);for(k=0;k<900;k++){P.x=357;P.y=3.6;step(STEP)}o.push(W.st2==='perch'&&Math.abs(W.y-W.hy)<.2);
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 16: troncos da cachoeira, ilhas que afundam e coruja',r.every(Boolean),r.join(','))}
 /* 48: Mundo 16 — fila de 5 tartarugas: segurando o pulo dá para atravessar quicando nelas; 6 tartarugas-cachoeira nas colunas */
 {const r=JSON.parse(await E(`(function(){startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;var T=enemies.filter(function(e){return e.type==='turtle'});P.x=T[0].x-.3;P.y=T[0].y+2.5;P.vy=0;var bounces=0,k,log=[],g=30,pv=0;
for(k=0;k<900;k++){keys.jump=true;var t=null;for(var i=0;i<T.length;i++){if(T[i].alive&&!(T[i].slp>0)&&T[i].x>P.x-.3){t=T[i];break}}
 var nx=t?t.x:358,top=t?t.y+t.h:3.6,dy=P.y-top,disc=P.vy*P.vy+2*g*Math.max(dy,-P.vy*P.vy/(2*g)+.001),tl=(P.vy+Math.sqrt(Math.max(0,disc)))/g;tl=Math.max(tl,.08);
 var want=(nx-P.x)/tl;keys.run=Math.abs(want)>5;keys.right=P.vx<want-.4;keys.left=P.vx>want+.4;
 var a=P.vy;step(STEP);if(k>0&&k<4)g=(pv-P.vy)/STEP||g;pv=P.vy;if(P.vy>8&&a<=0){bounces++;log.push(P.x.toFixed(1))}if(P.grounded&&P.x>356.5)break;if(P.y<-3)break}
keys.right=keys.left=keys.jump=keys.run=false;return JSON.stringify([bounces>=5,P.grounded&&P.x>356.5,enemies.filter(function(e){return e.type==='tchase'&&e.vis&&e.vis.drop}).length===6])})()`));
  marca('Mundo 16: fila de tartarugas e tartarugas das colunas',r.every(Boolean),r.join(','))}
 /* 49: Mundo 16 — os troncos da cachoeira não passam por dentro das tartarugas-cachoeira, mesmo com elas atacando */
 {const r=await E(`(function(){startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=99;var bad=0,k,TT=enemies.filter(function(e){return e.type==='tchase'});for(k=0;k<1800;k++){var L=flWl[(k/300|0)%6];P.x=L.d.x;P.y=8;P.vy=0;step(STEP);TT.forEach(function(e){if(!e.alive||e.slp>0)return;flWl.forEach(function(W){var so=W.so;if(e.x+e.w*.8>so.l&&e.x-e.w*.8<so.r&&e.y+.7>so.b&&e.y+.1<so.t)bad++})})}card.hidden=true;return bad})()`);
  marca('Mundo 16: troncos não atravessam as tartarugas',r===0,'sobreposições: '+r)}
 /* 50: Mundo 16 — colunas alternadas (sobe/desce), Kuro não fica esmagado na pedra, paredão não cresce a cada recomeço, Kuro molhado na cachoeira e seca depois */
 {const r=JSON.parse(await E(`(function(){var o=[],k;startLevel(15);beginPlay();var oy=flFx.oy;startLevel(15);beginPlay();o.push(flFx.oy===oy);o.push(LV.wlogs[0].dir<0&&LV.wlogs[1].dir>0);
   card.hidden=true;state='play';P.inv=1e9;var D=LV.wlogs[1],L=D.LS[0];L.y=9;P.x=D.x;P.y=9.3;P.vy=0;var mx=0;for(k=0;k<300;k++){step(STEP);mx=Math.max(mx,P.y)}o.push(mx<flFx.oy-1);
   startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=310;P.y=8;for(k=0;k<30;k++){P.x=310;step(STEP)}o.push(kWet.w===1);for(k=0;k<90*6;k++){P.x=300;P.y=6.8;P.vy=0;step(STEP)}o.push(kWet.w===0&&kWet.mats===null);
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 16: escada de troncos e Kuro molhado',r.every(Boolean),r.join(','))}
 /* 51: Mundo 16 — riachos das cachoeiras atravessam o caminho; peixinhos pulam para o seco e voltam */
 {const r=JSON.parse(await E(`(function(){var o=[],k;startLevel(15);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=14;P.y=0;o.push(flSt.length>=6);var S=flSt[0],seen={};for(k=0;k<90*12;k++){P.x=14;P.y=0;step(STEP);S.fish.forEach(function(F){seen[F.st]=1})}o.push(!!(seen.out&&seen.flop&&seen.back&&seen.in));card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 16: riachos e peixinhos',r.every(Boolean),r.join(','))}
 /* 52: Mundo 17 — giratório quebra o tijolo de baixo (pulo normal não); cabeçada quebra o de cima; mola sobe quebrando; bandeira falsa volta ao começo; porta trancada sem chave; chave na fechadura abre a saída */
 {const r=JSON.parse(await E(`(function(){var o=[],k,y0;function go(x,y){startLevel(16);beginPlay();mazeEnter();P.warp=null;card.hidden=true;state='play';P.inv=1e9;hearts=9;P.big=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.x=x;P.y=y;P.vy=0;P.vx=0;for(k=0;k<20;k++)step(STEP)}
   go(6.5,49);y0=P.y;P.sjbuf=.13;keys.jump=true;for(k=0;k<150;k++){step(STEP);if(k>3)keys.jump=false}o.push(y0-P.y>.9);
   function dead(){return MZ.bricks.filter(function(c){return c.dead}).length}
   go(3.5,49);P.sjbuf=.13;keys.jump=true;for(k=0;k<90*10;k++){step(STEP);if(k>3)keys.jump=false;if(P.grounded&&!P.drill&&k>30)break}o.push(dead()>=6);/* giro automático: vai quebrando sozinho */
   go(3.5,49);P.sjbuf=.13;keys.jump=true;for(k=0;k<20;k++)step(STEP);keys.jump=false;var pj=0;for(k=0;k<90*4;k++){if(dead()>=2&&pj===0){pj=1;keys.jump=true}else if(pj===1){keys.jump=false;pj=2}step(STEP)}o.push(dead()<=3);/* pulo normal para */
   go(15.5,49);y0=P.y;keys.jump=true;P.jbuf=.13;for(k=0;k<150;k++){step(STEP);if(k>3)keys.jump=false}o.push(Math.abs(y0-P.y)<.01);
   go(5.5,43);var n0=MZ.bricks.filter(function(c){return c.dead}).length;keys.jump=true;P.jbuf=.13;for(k=0;k<100;k++){step(STEP);if(k>20)keys.jump=false}o.push(MZ.bricks.filter(function(c){return c.dead}).length-n0===1);
   go(15.5,7);var ok=false;for(k=0;k<90*12;k++){if(P.y>11.8&&P.vy<0)keys.right=true;step(STEP);if(P.grounded&&Math.abs(P.y-13)<.05){ok=true;break}}keys.right=false;o.push(ok);
   go(6.5,2.4);var PP=pipes.find(function(q){return q.to&&q.x<10});P.x=PP.x;P.y=PP.top;P.vy=0;keys.down=true;for(k=0;k<300;k++)step(STEP);keys.down=false;for(k=0;k<120;k++)step(STEP);o.push(P.y>48);/* cano no fundo volta para a entrada */
   go(53.5,1);keys.right=true;for(k=0;k<200;k++)step(STEP);keys.right=false;o.push(P.x<55);
   go(41.5,8);P.x=MZ.key.x;P.y=MZ.key.y-.6;step(STEP);o.push(!!P.key);P.x=MZ.lock.x;P.y=MZ.lock.y-.8;for(k=0;k<90;k++){P.x=MZ.lock.x;step(STEP)}o.push(MZ.used);for(k=0;k<200;k++)step(STEP);
   P.x=53.5;P.y=1;keys.right=true;for(k=0;k<300&&state==='play';k++)step(STEP);keys.right=false;o.push(state==='win');
   go(50,49);P.feather=20;keys.right=true;keys.run=true;var mx=0;for(k=0;k<90*8;k++){keys.jump=(k%20)<12;if(P.grounded)P.jbuf=.13;step(STEP);mx=Math.max(mx,P.x)}keys.right=keys.jump=keys.run=false;o.push(mx<55);/* não passa por cima do telhado */
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 17: labirinto (tijolos, mola, bandeira falsa, chave, fechadura e porta)',r.every(Boolean),r.join(','))}
 /* 53: Mundo 17 — o Kuro nunca fica preso: toda sala do labirinto tem mola embaixo de tijolo que leva para a sala de cima (até o telhado) */
 {const r=JSON.parse(await E(`(function(){var M0=LEVELS[16].maze,R=M0.rows,H=R.length,L=[],out=[];
   for(var r=0;r<H;r++)for(var c=0;c<R[r].length;c++)if(R[r][c]==='S'){var rr=r-1;while(rr>=0&&'#BDL'.indexOf(R[rr][c])<0)rr--;var top=rr;while(top>=0&&R[top][c]==='B')top--;L.push([c+.5,H-r-1,H-(top+1)])}
   /* toda sala (pedaço vazio de cada poço) precisa de uma mola que suba */
   [[2,10],[13,21],[24,32],[35,43],[46,54]].forEach(function(w){var r=0;while(r<H){var open=false;for(var c=w[0];c<=w[1];c++)if('#BDL'.indexOf(R[r][c])<0)open=true;if(!open){r++;continue}var r0=r;while(r<H){open=false;for(c=w[0];c<=w[1];c++)if('#BDL'.indexOf(R[r][c])<0)open=true;if(!open)break;r++}var r1=r-1,has=false;for(c=w[0];c<=w[1];c++)if(R[r1][c]==='S'&&R[r0-1][c]==='B')has=true;if(!has)out.push('sala sem mola x'+w[0]+' linha '+r0)}});
   for(var r2=0;r2<H-1;r2++)for(var c2=0;c2<R[r2].length;c2++)if(R[r2][c2]==='S'&&R[r2+1][c2]!=='#')out.push('mola fora do concreto x'+c2+' linha '+r2);
   L.forEach(function(q){var ok=false;[1,-1].forEach(function(side){if(ok)return;startLevel(16);beginPlay();mazeEnter();P.warp=null;card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999});P.x=q[0];P.y=q[1];P.vy=0;P.vx=0;for(var k=0;k<90*14;k++){keys.right=keys.left=false;if(P.y>q[2]-.3&&P.vy<4){if(side>0)keys.right=true;else keys.left=true}step(STEP);if(P.grounded&&Math.abs(P.y-q[2])<.06){ok=true;break}}keys.right=keys.left=false});if(!ok)out.push('mola '+q[0]+','+q[1]+' não sobe')});
   card.hidden=true;return JSON.stringify(out)})()`));
  marca('Mundo 17: o Kuro nunca fica preso (toda sala sobe pela mola)',!r.length,r.slice(0,4).join('; '))}
 /* 54: em todos os mundos, o item que sai do bloco (cogumelo, flor, fruta, coração) não fica preso dentro de tijolo/plataforma */
 {const r=JSON.parse(await E(`(function(){var out=[];function inn(L,ins){startLevel(L);if(ins){if(LV.minePre)mineFall();else if(LV.mzPre)mazeEnter();else if(LV.auPre)auEnter();P.warp=null}}
 for(var L=0;L<LEVELS.length;L++){for(var ins=0;ins<2;ins++){if(ins&&!LEVELS[L].pre)continue;inn(L,ins);
  var qs=blocks.filter(function(b){return b.t==='q'&&['mushroom','flower','fruit','heart'].indexOf(b.c)>=0}).map(function(b){return [b.x,b.y,b.c]});
  qs.forEach(function(q){inn(L,ins);beginPlay();card.hidden=true;state='play';P.inv=1e9;enemies.forEach(function(e){e.alive=false;e.x=-999});var B=blocks.find(function(b){return b.x===q[0]&&b.y===q[1]});var n0=items.length;hitBlock(B);for(var k=0;k<120;k++){P.x=-999;P.y=-999;step(STEP)}
   items.slice(n0).forEach(function(it){if(it.got)return;var bad=solids.find(function(s){if(s.dead||s.hid||s===B.solid)return false;return it.x+.3>s.l&&it.x-.3<s.r&&it.y+.3>s.b&&it.y-.3<s.t});if(bad)out.push('M'+(L+1)+(ins?' dentro':'')+' '+q[2]+' '+q[0]+','+q[1]+' item em '+it.x.toFixed(1)+','+it.y.toFixed(1))})})}}
 card.hidden=true;return JSON.stringify(out)})()`));
  marca('itens dos blocos não ficam presos',!r.length,r.slice(0,4).join('; '))}
 /* 55: Mundo 17 — área de fora (Ruínas de Tijolos): chave na caixinha, fechadura no pilar abre a porta do muro; o cano do fim leva para dentro do labirinto; perder tudo lá dentro volta para fora */
 {const r=JSON.parse(await E(`(function(){var o=[],k;startLevel(16);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999});o.push(!!LV.mzPre);
   P.x=61.5;P.y=6;P.vy=0;P.sjbuf=.13;keys.jump=true;for(k=0;k<90*3;k++){step(STEP);if(k>3)keys.jump=false}o.push(!!P.key);
   P.x=MZ.lock.x;P.y=4;for(k=0;k<90;k++){P.x=MZ.lock.x;step(STEP)}o.push(MZ.used);for(k=0;k<200;k++)step(STEP);P.x=70;P.y=4;keys.right=true;for(k=0;k<150;k++)step(STEP);keys.right=false;o.push(P.x>74);
   P.x=122;P.y=5.6;P.vy=0;keys.down=true;for(k=0;k<200;k++)step(STEP);keys.down=false;for(k=0;k<120;k++)step(STEP);o.push(!LV.mzPre&&!!LV.maze&&P.y>48);
   lose();retry();o.push(!!LV.mzPre);card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 17: área de fora (chave, fechadura, porta, cano para o labirinto)',r.every(Boolean),r.join(','))}
 /* 56: bolha da raposinha — os bichos dos Mundos 16 e 17 ficam dentro da bolha (minhocão, peixe, broto, tatu, abelhas, coruja, besouro, sapo, toupeira, morcego, tartaruga) */
 {const r=JSON.parse(await E(`(function(){var out=[],v3=new T.Vector3(),bb=new T.Box3();
 [[15,['worm','jfish','sprout','armad','bee','owl']],[16,['beetle','frog','mole','bat','tchase']]].forEach(function(L){L[1].forEach(function(t){
  startLevel(L[0]);beginPlay();if(L[0]===16){mazeEnter();P.warp=null}card.hidden=true;state='play';P.inv=1e9;var e=enemies.find(function(q){return q.type===t});if(!e){out.push(t+' não achou');return}
  /* deixa o bicho aparecer (minhocão/peixe no meio do pulo, broto em cima, tatu rolando) */
  if(t==='worm'||t==='jfish'){e.mt=e.wait+e.air*.5}if(t==='sprout'){e.pr=2.3}if(t==='armad'){e.st2='roll';e.at=0}
  var px=e.x-6;P.x=px;P.y=e.y+40;for(var k=0;k<3;k++){P.x=px;P.y=e.y+40;P.vy=0;step(STEP)}updEnemy(e,0);foxBubble(e);for(k=0;k<40;k++){P.x=px;P.y=e.y+40;P.vy=0;step(STEP);visEnemy(e,STEP)}
  var c=e.bub.m.position;bb.setFromObject(e.vis.g);var cen=bb.getCenter(v3);var d=Math.hypot(cen.x-c.x,cen.y-c.y);out.push(t+' '+d.toFixed(2)+(d<.6?' ok':' FORA'))})});
 card.hidden=true;return JSON.stringify(out)})()`));
  marca('bolha da raposinha prende os bichos por dentro',r.every(function(x){return / ok$/.test(x)}),r.filter(function(x){return !/ ok$/.test(x)}).join('; '))}
 /* 57: Mundo 18 (Lago da Aurora) — patinação mais rápida no gelo, gelo que trinca (1ª racha, 2ª quebra, volta ao morrer), foca joga bola de neve, pinguim desliza, todos os buracos dá para pular correndo */
 {const r=JSON.parse(await E(`(function(){var o=[],k;function go(){startLevel(17);auEnter();P.warp=null;AU.sin=null;$('fade').style.opacity=0;beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999})}
   go();P.x=44.5;P.y=0;P.vx=0;keys.right=true;keys.run=true;for(k=0;k<110;k++)step(STEP);var vi=Math.abs(P.vx);go();P.x=-10;P.y=0;P.vx=0;for(k=0;k<110;k++)step(STEP);var vn=Math.abs(P.vx);keys.right=false;keys.run=false;o.push('patina '+vi.toFixed(1)+'>'+vn.toFixed(1)+(vi>vn*1.2?' ok':' NÃO'));
   go();var c=AU.cracks[3];function land(){P.x=132.7;P.y=1.2;P.vy=0;P.grounded=false;for(var q=0;q<30;q++){P.x=132.7;step(STEP)}}land();var n1=c.n;P.y=3;P.grounded=false;for(k=0;k<5;k++)step(STEP);land();for(k=0;k<60;k++)step(STEP);o.push('trinca '+n1+'/'+c.so.dead+(n1===1&&c.so.dead?' ok':' NÃO'));
   aurReset();o.push('volta '+(!c.so.dead&&c.n===0?'ok':'NÃO'));
   startLevel(17);auEnter();P.warp=null;AU.sin=null;$('fade').style.opacity=0;beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;var s=enemies.find(function(e){return e.type==='seal'&&e.x>0});enemies.forEach(function(e){if(e!==s){e.alive=false;e.x=-999}});P.x=s.x-5;P.y=0;s.mt=2.2-s.ph;updateCamera(0,true);for(k=0;k<20;k++){P.x=s.x-5;P.vx=0;step(STEP);updateCamera(STEP)}var nb=AU.balls.length;for(k=0;k<150;k++){P.x=s.x-5;P.vx=0;step(STEP)}o.push('foca '+nb+' '+hearts+(nb>0&&hearts<9?' ok':' NÃO'));
   go();var pg=enemies.find(function(e){return e.type==='peng'&&e.x0>0});pg.alive=true;pg.x=40;pg.mt=2.5;P.x=0;updEnemy(pg,STEP);o.push('pinguim '+pg.cur+(pg.cur>4?' ok':' NÃO'));
   [[58,61,0,7,1],[112,115,0,7,1],[128,131,2.6,4,0,134.5],[134.5,136.5,0,1.5,0,140],[140,142,0,1.5,0,145],[160,163,0,7,1],[182,185.5,0,7,1]].forEach(function(g){go();P.x=g[0]-g[3];P.y=g[2];P.vx=0;keys.right=true;keys.run=!!g[4];var j=false,ok=false,end=g[5]||999;for(k=0;k<400;k++){if(!j&&P.x>g[0]-.45){keys.jump=true;P.jbuf=.12;j=true}else if(j&&P.vy<0)keys.jump=false;if(j&&P.x>g[1]+.8&&!g[4])keys.right=false;step(STEP);if(j&&P.grounded&&P.x>g[1]&&P.x<end&&(g[4]||Math.abs(P.vx)<.5)){ok=true;break}if(P.y<-3)break}keys.right=false;keys.run=false;keys.jump=false;o.push('buraco '+g[0]+(ok?' ok':' NÃO'))});
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 18: patinação, gelo que trinca, foca, pinguim e buracos pulando',r.every(function(x){return / ok$/.test(x)}),r.filter(function(x){return !/ ok$/.test(x)}).join('; '))}
 /* 58: Mundo 18 — Vila dos Pescadores: escada (sobe e pula para a plataforma), cesto-elevador leva para cima, tobogã leva ao lago; pássaro-da-neve dá rasante */
 {const r=JSON.parse(await E(`(function(){var o=[],k;function go(){startLevel(17);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999})}
   go();o.push('vila '+(LV.vila?'ok':'NÃO'));
   P.x=27.6-138;P.y=.3;P.vy=0;keys.jump=true;for(k=0;k<500;k++){step(STEP);if(P.grounded&&P.y>6)break}keys.jump=false;o.push('escada '+P.x.toFixed(1)+','+P.y.toFixed(1)+(P.y>6.3&&P.x>28-138?' ok':' NÃO'));
   go();var L=AU.lifts[0];L.t=0;for(k=0;k<3;k++)step(STEP);P.x=L.q.x;P.y=L.so.t+.05;P.vy=0;for(k=0;k<90*5;k++){step(STEP);if(P.y>9.5)break}o.push('cesto '+P.y.toFixed(1)+(P.y>9.5?' ok':' NÃO'));
   go();P.x=112.4-138;P.y=13;P.vy=0;keys.right=true;for(k=0;k<90*4;k++){step(STEP)}keys.right=false;o.push('tobogã sem corte '+P.x.toFixed(1)+','+P.y.toFixed(1)+(P.grounded&&P.x>2&&P.x<14&&P.y<.1&&!AU.sl?' ok':' NÃO'));
   go();P.x=8;P.y=0;keys.left=true;var sl=0,mx=99;for(k=0;k<90*20;k++){var vx0=P.vx;step(STEP);if(P.stun>0&&vx0<0&&P.vx>0)sl++;if(P.x<-25.5&&P.grounded)break}keys.left=false;o.push('volta subindo '+P.x.toFixed(1)+','+P.y.toFixed(1)+' escorregões '+sl+(P.x<-25&&P.y>12.5&&sl>0&&!AU.sl?' ok':' NÃO'));
   go();var b=enemies.find(function(e){return e.type==='sbird'});b.alive=true;b.x=20-138;b.y=b.hy;b.cool=0;b.st2='fly';P.x=20.5-138;P.y=4;var dv=false;for(k=0;k<90;k++){P.x=20.5-138;step(STEP);if(b.st2==='dive')dv=true}o.push('pássaro '+(dv?'ok':'NÃO'));
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 18: vila (escada, cesto, tobogã, pássaro-da-neve)',r.every(function(x){return / ok$/.test(x)}),r.filter(function(x){return !/ ok$/.test(x)}).join('; '))}
 /* 59: Mundo 18 parte 2 — pingente treme, cai e machuca; bloco de gelo que anda afunda com o Kuro; buracos da parte 2 dá para pular */
 {const r=JSON.parse(await E(`(function(){var o=[],k;function go(){startLevel(17);auEnter();P.warp=null;AU.sin=null;$('fade').style.opacity=0;beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999})}
   go();P.inv=0;var c=AU.ics[2];for(k=0;k<200;k++){P.x=c.x;P.y=0;P.vy=0;step(STEP)}o.push('pingente '+c.st+' '+hearts+(c.st>=2&&hearts<9?' ok':' NÃO'));
   go();var m=movers[0];for(k=0;k<5;k++)step(STEP);P.x=m.x;P.y=m.t+.05;P.vy=0;for(k=0;k<90;k++){step(STEP)}o.push('boia '+(m.top0-m.t).toFixed(2)+(P.onPlat===m&&m.top0-m.t>.1?' ok':' NÃO'));
   [[300,304,0,6,1],[318,320,1.2,5,0,323],[341,345,4,1.5,0,360],[256,262,2.4,6,1]].forEach(function(g){go();movers.forEach(function(q){q.cx=-999});P.x=g[0]-g[3];P.y=g[2];P.vx=0;keys.right=true;keys.run=!!g[4];var j=false,ok=false,end=g[5]||999;for(k=0;k<400;k++){if(!j&&P.x>g[0]-.45){keys.jump=true;P.jbuf=.12;j=true}else if(j&&P.vy<0)keys.jump=false;if(j&&P.x>g[1]+.8&&!g[4])keys.right=false;step(STEP);if(j&&P.grounded&&P.x>g[1]&&P.x<end){ok=true;break}if(P.y<-3)break}keys.right=false;keys.run=false;keys.jump=false;o.push('vão '+g[0]+(ok?' ok':' NÃO'))});
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 18 parte 2: pingentes, blocos boiando e vãos',r.every(function(x){return / ok$/.test(x)}),r.filter(function(x){return !/ ok$/.test(x)}).join('; '))}
 /* 60: Mundo 18 parte 3 — chegada pela calha do tobogã, pontes de aurora somem e voltam, subida do farol pulando, acende a luz e termina */
 {const r=JSON.parse(await E(`(function(){var o=[],k;function go(){startLevel(17);auEnter();P.warp=null;AU.sin=null;$('fade').style.opacity=0;beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999})}
   o.push('chegada ok');
   go();var B=AU.br[0],seen={};for(k=0;k<90*5;k++){step(STEP);seen[auBridgeState(B.b,AU.t)]=1;if(auBridgeState(B.b,AU.t)==='off'&&!B.pl[0].so.dead){seen.bug=1}}o.push('ponte '+Object.keys(seen).join(',')+(seen.on&&seen.off&&!seen.bug?' ok':' NÃO'));
   go();AU.t=-(AU.br[0].b.ph||0);P.x=391;P.y=3.2;keys.right=true;keys.run=true;for(k=0;k<90*3;k++){step(STEP);if(P.x>406&&P.grounded)break}keys.right=false;keys.run=false;o.push('atravessa '+P.x.toFixed(1)+(P.x>405&&P.y>3?' ok':' NÃO'));
   go();P.x=446.5;P.y=8;var seq=[[1,452],[1,457.5],[1,463],[1,467],[-1,455]];var okc=true;seq.forEach(function(q,i){if(!okc)return;keys.jump=true;P.jbuf=.12;keys.right=q[0]>0;keys.left=q[0]<0;var landed=false;for(k=0;k<300;k++){if(P.vy<-2)keys.jump=false;step(STEP);if((q[0]>0&&P.x>=q[1])||(q[0]<0&&P.x<=q[1])){keys.right=keys.left=false}if(k>15&&P.grounded){landed=true;break}}keys.right=keys.left=keys.jump=false;for(k=0;k<20;k++)step(STEP);if(!landed||P.y<7.9)okc=false;o.push('d'+i+':'+P.x.toFixed(1)+','+P.y.toFixed(1))});
   o.push('farol '+(state==='win'||state==='clear'||AU.lh.lit?'ok':'NÃO')+' '+state);
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 18 parte 3: chegada do tobogã, pontes de aurora, farol',r.filter(function(x){return / (ok|NÃO)( |$)/.test(x)}).every(function(x){return / ok( |$)/.test(x)}),r.join('; '))}
 /* 61: Mundo 19 parte 2 — todos os pulos entre os destroços dão certo; raio com aviso machuca quem fica parado; ventania empurra; onda gigante levanta os destroços */
 {const g=await E(`(function(){function go(){startLevel(18);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999});WK.gust.t=1e9;WK.strike.t=1e9;WK.big.t=1e9}
function list(){return solids.filter(function(s){return s.t>-.5&&s.t<3&&s.r>93&&s.l<241&&!s.dead&&(s.mover||s.b<-5)}).sort(function(a,b){return (a.l+a.r)-(b.l+b.r)})}
go();var N=list().length,res=[];
for(var i=0;i<N-1;i++){var ok=false,info='';for(var tr=0;tr<3&&!ok;tr++){go();for(var k=0;k<tr*70+5;k++)step(STEP);var A=list(),a=A[i],b=A[i+1];
 P.x=a.r-.45;P.y=a.t;P.vy=0;P.grounded=true;P.onPlat=a;for(k=0;k<2;k++)step(STEP);keys.right=true;keys.jump=true;P.jbuf=.12;var land=null;
 for(k=0;k<200;k++){if(P.vy<-1)keys.jump=false;if(k>3){var tx=b.l+Math.min(1.2,(b.r-b.l)/2);keys.right=P.x<tx-.25;keys.left=P.x>tx+.25}step(STEP);if(k>10&&P.grounded){land=P.onPlat;break}if(P.y<-3)break}
 keys.right=false;keys.left=false;keys.jump=false;if(land===b)ok=true;info=a.l.toFixed(1)+'→'+b.l.toFixed(1)+' gap '+(b.l-a.r).toFixed(1)+' dy '+(b.t-a.t).toFixed(1)}
 res.push((ok?'ok ':'NÃO ')+info)}
return res.filter(function(x){return x.indexOf('NÃO')==0}).join(' | ')+' || total '+res.length})()`);const r=JSON.parse(await E(`(function(){var o=[],k;function go(){startLevel(18);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999});WK.gust.t=1e9;WK.strike.t=1e9;WK.big.t=1e9}
   go();var m=movers[3];for(k=0;k<3;k++)step(STEP);P.x=m.x;P.y=m.t;P.grounded=true;P.onPlat=m;WK.strike.t=0;for(k=0;k<90*2;k++){if(WK.strike.st===1){var mm=WK.strike.m;P.x=mm.x;P.y=mm.t;P.grounded=true;P.onPlat=mm}step(STEP)}o.push('raio '+hearts+(hearts<9?' ok':' NÃO'));
   go();P.x=126;P.y=2;WK.gust={t:0,on:0,warn:1};for(k=0;k<20;k++)step(STEP);var x0=P.x;for(k=0;k<90;k++)step(STEP);o.push('vento '+(P.x-x0).toFixed(1)+(P.x<x0-1?' ok':' NÃO'));
   go();var mm=movers[4];P.x=mm.x-1;P.y=3;updateCamera(0,true);var mn=99,mx=-99;WK.big.t=0;for(k=0;k<90*6;k++){step(STEP);updateCamera(STEP);mn=Math.min(mn,mm.t);mx=Math.max(mx,mm.t)}o.push('onda '+(mx-mn).toFixed(1)+(mx-mn>1.2?' ok':' NÃO'));
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 19 parte 2: pulos nos destroços, raio, vento e onda gigante',/^ \|\|/.test(g)&&r.every(function(x){return / ok$/.test(x)}),g+' '+r.join('; '))}
 /* 62: Mundo 19 parte 3 — pulos até a popa e até a ilha, escada do porão, luta com o Capitão (chutando barris), sair do navio, chegar ao fim na ilha */
 {const g=await E(`(function(){function go(){startLevel(18);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999});WK.gust.t=1e9;WK.strike.t=1e9;WK.big.t=1e9;WK.cap.st='dead';WK.cap.w1.dead=true}
function list(){return solids.filter(function(s){return s.t>-.5&&s.t<3&&s.r>236&&s.l<362&&!s.dead&&(s.mover||s.b<-5)&&!(s.l>263&&s.r<328)}).sort(function(a,b){return (a.l+a.r)-(b.l+b.r)})}
go();var N=list().length,res=[];
for(var i=0;i<N-1;i++){var ok=false,info='';for(var tr=0;tr<3&&!ok;tr++){go();for(var k=0;k<tr*70+5;k++)step(STEP);var A=list(),a=A[i],b=A[i+1];if(b.l-a.r>6){ok=true;info='(trecho do navio)';continue}
 P.x=a.r-.45;P.y=a.t;P.vy=0;P.grounded=true;P.onPlat=a;for(k=0;k<2;k++)step(STEP);keys.right=true;keys.jump=true;P.jbuf=.12;var land=null;
 for(k=0;k<200;k++){if(P.vy<-1)keys.jump=false;if(k>3){var tx=b.l+Math.min(1.2,(b.r-b.l)/2);keys.right=P.x<tx-.25;keys.left=P.x>tx+.25}step(STEP);if(k>10&&P.grounded){land=P.onPlat;break}if(P.y<-3)break}
 keys.right=false;keys.left=false;keys.jump=false;if(land===b)ok=true;info=a.l.toFixed(1)+'→'+b.l.toFixed(1)+' gap '+(b.l-a.r).toFixed(1)+' dy '+(b.t-a.t).toFixed(1)}
 res.push((ok?'ok ':'NÃO ')+info)}
return res.join(' | ')})()`);const r=JSON.parse(await E(`(function(){var o=[],k;function go(){startLevel(18);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999});WK.gust.t=1e9;WK.strike.t=1e9;WK.big.t=1e9}
   go();P.x=292.4;P.y=.5;for(k=0;k<20;k++)step(STEP);keys.up=true;for(k=0;k<90*4;k++){step(STEP);if(P.grounded&&P.y>4.9)break}keys.up=false;o.push('alçapão '+P.y.toFixed(1)+(P.y>4.9?' ok':' NÃO'));
   go();P.x=300;P.y=5;var kicks=0;for(k=0;k<90*480&&WK.cap.st!=='dead';k++){var b=WK.cap.bar.find(function(q){return !q.air&&!q.kick});if(b&&P.grounded&&b.x-P.x<2.3&&b.x>P.x){keys.jump=true;P.jbuf=.12}else if(P.vy<0)keys.jump=false;
    if(!b&&P.grounded){keys.right=P.x<302;keys.left=P.x>304}else{keys.right=keys.left=false}step(STEP)}keys.right=keys.left=keys.jump=false;o.push('capitão '+WK.cap.st+(WK.cap.st==='dead'?' ok':' NÃO'));
   for(k=0;k<90*2;k++)step(STEP);P.x=322;P.y=7.6;for(k=0;k<5;k++)step(STEP);keys.right=true;for(k=0;k<90*3;k++){step(STEP);if(P.grounded&&P.x>329)break}keys.right=false;o.push('sai '+P.x.toFixed(1)+(P.x>329&&P.y>1?' ok':' NÃO'));
   P.inv=0;P.x=345;P.y=-5;for(k=0;k<400;k++){step(STEP);if(state!=='play')break}for(k=0;k<90*3;k++)step(STEP);P.inv=1e9;P.x=294;P.y=5;P.vy=0;keys.right=true;for(k=0;k<90*10;k++){if(P.grounded&&k%30==0){keys.jump=true;P.jbuf=.12}else if(P.vy<0)keys.jump=false;step(STEP);if(P.x>329)break}keys.right=false;keys.jump=false;o.push('morre depois e passa '+P.x.toFixed(1)+(P.x>329?' ok':' NÃO'));
   go();P.x=303;P.y=5;var mx=0,rc=new T.Raycaster();rc.camera=camera;for(k=0;k<90*12;k++){step(STEP);if(k%45==0){animate(1/60);WK.sternG.updateMatrixWorld(true);[300,306,312,323].forEach(function(x){rc.set(new T.Vector3(x,30,0),new T.Vector3(0,-1,0));var h=rc.intersectObject(WK.sternG,true)[0];var want=x>=319?7.6:5;if(h)mx=Math.max(mx,Math.abs(h.point.y-want))})}}o.push('convés desenhado no lugar '+mx.toFixed(2)+(mx<.3?' ok':' NÃO'));
   go();P.x=361;P.y=.8;keys.right=true;for(k=0;k<90*15;k++){if(P.grounded&&k%40==0){keys.jump=true;P.jbuf=.12}else if(P.vy<0)keys.jump=false;step(STEP);if(state!=='play')break}keys.right=false;keys.jump=false;o.push('ilha '+state+(state==='win'?' ok':' NÃO'));
   card.hidden=true;return JSON.stringify(o)})()`));
  marca('Mundo 19 parte 3: popa, Capitão Corvo-Pirata e a ilha',!/NÃO/.test(g)&&r.every(function(x){return / ok$/.test(x)}),g.split(' | ').filter(function(x){return /NÃO/.test(x)}).join('; ')+' '+r.join('; '))}
 /* 63: Mundo 20 — Cânion do Sol: robô passa as partes 1 e 2 andando e correndo; pedra rolando, barranco, gêiser, pilões, tronco, pilão que leva à mesa */
 {const g=await E(`(function(){var out=[];[0,1].forEach(function(run){startLevel(19);beginPlay();card.hidden=true;state='play';hearts=99;enemies.forEach(function(e){e.alive=false;e.x=-999});
var hits=0,h0=hurt;hurt=function(){if(P.inv<=0)hits++;return h0.apply(this,arguments)};
function gnd(x){return solids.some(function(s){return !s.dead&&x>=s.l&&x<=s.r&&Math.abs(s.t-P.y)<.3})||crumbles.some(function(c){return !c.dead&&x>=c.l&&x<=c.r})}
keys.right=true;keys.run=!!run;var k,maxx=0;
for(k=0;k<90*90&&state==="play"&&P.x<158;k++){var near=CN.bld.some(function(b){return b.on&&b.z>-1&&b.x>P.x&&b.x-P.x<(run?3.4:2.6)});
 var edge=P.grounded&&!gnd(P.x+(run?1.6:1.1));var up=P.grounded&&solids.some(function(s){return s.t>P.y+.5&&s.t<P.y+2.5&&s.l>P.x&&s.l-P.x<1.4});
 if((near||edge||up)&&P.grounded){keys.jump=true;P.jbuf=.12}else if(P.vy<0||P.grounded)keys.jump=false;
 step(STEP);if(P.x>maxx)maxx=P.x}
hurt=h0;keys.right=false;keys.run=false;keys.jump=false;out.push((run?"correndo":"andando")+": estado="+(P.x>=158?"win":state)+' x='+P.x.toFixed(1)+' max='+maxx.toFixed(1)+' batidas='+hits+' t='+(k/90).toFixed(1)+'s')});return out.join(' | ')})()`);const r=await E(`(function(){var o=[];startLevel(19);beginPlay();card.hidden=true;state='play';hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999});
 /* pedra rolando machuca quem fica parado */P.x=40;P.y=0;P.vy=0;P.inv=0;var b=CN.bld[0],h0=hearts,k;b.on=0;b.t=b.per-.01;for(k=0;k<90*6&&hearts===h0;k++){P.x=40;step(STEP)}o.push('pedra '+(hearts<h0?'ok':'NÃO'));
 /* barranco desmorona */startLevel(19);beginPlay();card.hidden=true;state='play';P.inv=1e9;var c=crumbles[1];P.x=91.3;P.y=.05;P.vy=0;for(k=0;k<90*1.2;k++){step(STEP)}o.push('barranco '+(c.dead||c.state>=2?'ok':'NÃO'));
 /* gêiser joga para cima */startLevel(19);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=112;P.y=1.5;P.vy=-2;var my=0;for(k=0;k<90*2;k++){step(STEP);my=Math.max(my,P.y)}o.push('gêiser '+my.toFixed(1)+(my>6?' ok':' NÃO'));
 return o.join(' | ')})()`);
 const g2=await E(`(function(){var out=[];[0,1].forEach(function(run){startLevel(19);beginPlay();card.hidden=true;state='play';hearts=99;enemies.forEach(function(e){e.alive=false;e.x=-999});
P.x=163;P.y=0;P.vy=0;var hits=[],h0=hurt;hurt=function(){if(P.inv<=0)hits.push(P.x.toFixed(0));return h0.apply(this,arguments)};
function gnd(x){return solids.some(function(s){return !s.dead&&!s.crush&&x>=s.l&&x<=s.r&&Math.abs(s.t-P.y)<.3})||crumbles.some(function(c){return !c.dead&&x>=c.l&&x<=c.r})}
var sp=run?7.5:4.6,k,ride=0;
for(k=0;k<90*80&&state==="play"&&P.x<265.5;k++){var go=true;keys.run=!!run;
 CN.crs.forEach(function(c){if(c.x===271.5)return;var d=c.so.l-P.x;if(d>0&&d<1.3&&P.grounded){var need=(c.w+2)/sp+.15;var ok=(c.st==='rise'&&c.so.b>1.9)||(c.st==='up'&&c.up-c.t>need);if(!ok)go=false}});
 CN.logs.forEach(function(l){var d=l.px-P.x;if(d>0&&d<3.2&&P.grounded){var ph=(CN.t*l.sp+l.ph)%(Math.PI*2);var a=l.amp*Math.sin(CN.t*l.sp+l.ph),av=Math.cos(CN.t*l.sp+l.ph);if(!(a>.45&&av>0))go=false}});
 var rc=CN.crs.filter(function(c){return c.x===271.5})[0];
 var ctl=0;if(P.onPlat===rc.so)ride=1;
 if(ride){ctl=1;keys.right=false;if(rc.so.t>5.9){keys.right=true;keys.jump=true;P.jbuf=.12}if(P.y>5.3&&P.x>273.5)ride=0}
 else if(P.x>265.5&&P.x<274&&P.y<1){ctl=1;var ok=rc.st==='down'||(rc.st==='rise'&&rc.so.t<2.4);if(!P.grounded){keys.right=P.x<271.2;keys.left=P.x>272}else{keys.right=P.x<269.5;keys.left=false;if(ok&&P.x>=269.3){keys.jump=true;P.jbuf=.12;keys.right=true}else keys.jump=false}}
 if(!ctl){keys.left=false;keys.right=go}
 var edge=!ctl&&P.grounded&&!gnd(P.x+(run?1.6:1.1));
 if(go&&edge){keys.jump=true;P.jbuf=.12}else if(!ctl&&(P.vy<0||P.grounded))keys.jump=false;
 step(STEP)}
hurt=h0;keys.right=keys.run=keys.jump=false;out.push((run?'correndo':'andando')+': estado='+state+' x='+P.x.toFixed(1)+' y='+P.y.toFixed(1)+' batidas='+hits.join(',')+' t='+(k/90).toFixed(1)+'s')});return out.join(' | ')})()`);const r2=await E(`(function(){var o=[];startLevel(19);beginPlay();card.hidden=true;state='play';P.inv=1e9;var rc=CN.crs[5],k;rc.st='down';rc.t=.7;rc.so.b=0;rc.so.t=rc.h;P.x=271.5;P.y=rc.h;P.vy=0;for(k=0;k<90;k++)step(STEP);for(k=0;k<90*4&&rc.so.t<5.9;k++)step(STEP);keys.right=true;keys.jump=true;P.jbuf=.12;for(k=0;k<135;k++){step(STEP);if(P.vy<0)keys.jump=false}keys.right=false;o.push('pilão leva até a mesa '+(P.y>5.3&&document.getElementById('gemN').textContent==='1'?'ok':'NÃO'));
 startLevel(19);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;var c=CN.crs[0],h0=hearts;P.x=170;P.y=0;P.vy=0;c.st='warn';c.t=.05;for(k=0;k<90;k++)step(STEP);o.push('pilão esmaga e empurra para fora '+(hearts<h0&&(P.x<c.so.l||P.x>c.so.r)?'ok':'NÃO'));
 startLevel(19);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;h0=hearts;var l=CN.logs[1];P.x=246;P.y=0;P.vy=0;for(k=0;k<90*5&&hearts===h0;k++){P.x=246;step(STEP)}o.push('tronco bate '+(hearts<h0?'ok':'NÃO'));
 startLevel(19);beginPlay();card.hidden=true;state='play';hearts=99;P.inv=0;P.x=283;P.y=0;keys.right=true;for(k=0;k<90*10&&state==='play'&&P.x<301;k++)step(STEP);keys.right=false;o.push('chega na parte 3 '+(P.x>=301?'ok':'NÃO'));return o.join(' | ')})()`);
 const g3=await E(`(function(){var out=[];[0,1].forEach(function(run){startLevel(19);beginPlay();card.hidden=true;state='play';hearts=99;enemies.forEach(function(e){e.alive=false;e.x=-999});
P.x=301;P.y=0;P.vy=0;var hits=[],h0=hurt;hurt=function(){if(P.inv<=0)hits.push(P.x.toFixed(0));return h0.apply(this,arguments)};
function sol(x,y){return solids.some(function(s){return !s.dead&&x>=s.l&&x<=s.r&&Math.abs(s.t-y)<.3})}
keys.right=true;keys.run=!!run;var k,maxx=0;
for(k=0;k<90*60&&state==='play';k++){var ahead=P.x+(run?1.5:1.0);var edge=P.grounded&&!sol(ahead,P.y);var up=P.grounded&&solids.some(function(s){return !s.dead&&s.t>P.y+.4&&s.t<P.y+2.6&&s.l>P.x&&s.l-P.x<1.3});
 if((edge||up)&&P.grounded){keys.jump=true;P.jbuf=.12}else if(P.grounded||P.vy<0)keys.jump=false;
 step(STEP);if(P.x>maxx)maxx=P.x}
hurt=h0;keys.right=keys.run=keys.jump=false;out.push((run?'correndo':'andando')+': estado='+state+' x='+P.x.toFixed(1)+' y='+P.y.toFixed(1)+' max='+maxx.toFixed(1)+' batidas='+hits.join(',')+' t='+(k/90).toFixed(1)+'s')});return out.join(' | ')})()`);const r3=await E(`(function(){startLevel(19);beginPlay();card.hidden=true;state='play';P.inv=1e9;P.x=331;P.y=6.6;P.vy=0;keys.right=true;for(var k=0;k<90*1.2;k++)step(STEP);keys.right=false;var c=crumbles.filter(function(q){return q.l>330&&q.l<331})[0];return 'tábua cai '+(c&&c.state>=2?'ok':'NÃO')})()`);
  marca('Mundo 20: Cânion do Sol — pedras rolando, barrancos, gêiser, pilões, teto que desce, troncos, subida, ponte, Semente',/andando: estado=win.*correndo: estado=win/.test(g3)&&!/NÃO/.test(r3)&&/estado=win.*estado=win/.test(g)&&!/NÃO/.test(r)&&/andando: estado=play x=265.*correndo: estado=play x=265/.test(g2)&&!/NÃO/.test(r2),g+' || '+r+' || '+g2+' || '+r2+' || '+g3+' || '+r3)}
 /* 64: Mundo 21 — Raízes da Árvore Mãe (parte 1): robô desce andando e correndo; semente faz a raiz virar ponte e ela murcha; esporo acende os fungos */
 {const g=await E(`(function(){var out=[];[0,1].forEach(function(run){startLevel(20);beginPlay();card.hidden=true;state='play';hearts=99;enemies.forEach(function(e){e.alive=false;e.x=-999});
P.x=0;P.y=6;P.vy=0;var hits=[],h0=hurt;hurt=function(){if(P.inv<=0)hits.push(P.x.toFixed(0));return h0.apply(this,arguments)};
function sol(x,y){return solids.some(function(s){return !s.dead&&x>=s.l&&x<=s.r&&Math.abs(s.t-y)<.3})}
keys.right=true;keys.run=!!run;var k,maxx=0;
for(k=0;k<90*60&&state==='play'&&P.x<158;k++){var ahead=P.x+(run?1.5:1.0);var edge=P.grounded&&!sol(ahead,P.y);var up=P.grounded&&solids.some(function(s){return !s.dead&&s.t>P.y+.4&&s.t<P.y+2.6&&s.l>P.x&&s.l-P.x<1.3});
 if((edge||up)&&P.grounded){keys.jump=true;P.jbuf=.12}else if(P.grounded||P.vy<0)keys.jump=false;
 step(STEP);if(P.x>maxx)maxx=P.x}
dyn=null;hurt=h0;keys.right=keys.run=keys.jump=false;out.push((run?'correndo':'andando')+': estado='+(P.x>=158?'win':state)+' x='+P.x.toFixed(1)+' y='+P.y.toFixed(1)+' max='+maxx.toFixed(1)+' batidas='+hits.join(',')+' t='+(k/90).toFixed(1)+'s')});return out.join(' | ')})()`);const r=await E(`(function(){var o=[],k;startLevel(20);beginPlay();card.hidden=true;state='play';P.inv=1e9;var q=RT.grow[0];P.x=24;P.y=4.2;P.vy=0;for(k=0;k<90*1.2;k++)step(STEP);o.push('semente faz ponte '+(!q.so.dead&&q.so.r>=35.9?'ok':'NÃO'));
 for(k=0;k<90*12;k++){P.x=20;P.y=4.2;step(STEP)}o.push('ponte murcha '+(q.so.dead?'ok':'NÃO'));
 startLevel(20);beginPlay();card.hidden=true;state='play';P.inv=1e9;var sp=RT.spores[0];P.x=72.5;P.y=2.4;P.vy=0;for(k=0;k<20;k++)step(STEP);o.push('esporo acende fungos '+(sp.sh.every(function(h){return !h.so.dead})?'ok':'NÃO'));
 return o.join(' | ')})()`);
 const g2=await E(`(function(){var o=[];[[0,165,0,183.5,171.8],[1,250,4.2,270.5,255.8]].forEach(function(c){startLevel(20);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=99;enemies.forEach(function(e){e.alive=false;e.x=-999});RT.spiders.forEach(function(s){s.alive=false});
 var v=RT.vines[c[0]],k,edge=c[4],att=0,maxA=0;P.x=c[1];P.y=c[2];P.vy=0;keys.right=true;
 for(k=0;k<90*30&&state==='play';k++){
  if(!RT.sw&&!att){if(P.x>=edge-.2&&P.grounded){keys.right=false;var tx=v.px+Math.sin(v.a)*v.L;if(Math.abs(v.a)<.06&&v.w<0){keys.right=true;keys.jump=true;P.jbuf=.12}}else if(P.grounded)keys.right=true}
  if(RT.sw){att=1;keys.jump=false;keys.run=false;keys.right=v.w>0;keys.left=v.w<0;maxA=Math.max(maxA,v.a);if(v.a>.75&&v.w>0){keys.left=false;keys.right=true;keys.jump=true}}
  else if(att){keys.left=false;keys.right=true;if(P.grounded)keys.jump=false}
  if(!RT.sw&&P.vy<0&&!att)keys.jump=false;
  step(STEP);if(att&&P.grounded&&P.x>c[3])break}
 keys.right=keys.left=keys.jump=keys.run=false;o.push('cipó '+(c[0]+1)+': segurou='+att+' x='+P.x.toFixed(1)+' y='+P.y.toFixed(1)+' estado='+state+' maxA='+maxA.toFixed(2)+(P.x>c[3]&&P.y>=c[2]-.1?' ok':' NÃO'))});return o.join(' | ')})()`);const g3=await E(`(function(){var out=[];[[0,184,0,256],[1,184,0,256],[0,271,4.2,298],[1,271,4.2,298]].forEach(function(c){var run=c[0];startLevel(20);beginPlay();card.hidden=true;state='play';hearts=99;enemies.forEach(function(e){e.alive=false;e.x=-999});
P.x=c[1];P.y=c[2];P.vy=0;var hits=[],h0=hurt;hurt=function(){if(P.inv<=0)hits.push(P.x.toFixed(0));return h0.apply(this,arguments)};
function sol(x,y){return solids.some(function(s){return !s.dead&&x>=s.l&&x<=s.r&&Math.abs(s.t-y)<.3})}
var L=RT.lifts[0],k;keys.run=!!run;
for(k=0;k<90*60&&state==='play'&&P.x<c[3];k++){var go=true,ctl=0;
 RT.thorns.forEach(function(q){var d=q.x-q.w/2-P.x;if(d>0&&d<1.2&&P.grounded&&Math.abs(P.y-q.y)<.2){var cc=(RT.t+q.off)%q.per;if(!(cc<q.per*.45-(q.w+2)/(run?7:4.6)-.1))go=false}});
 if(P.x>197&&P.x<203.2&&P.y<4){ctl=1;if(P.onPlat===L.so){keys.right=L.so.t>4.35;keys.jump=false}else{var ok=L.so.t<.3;keys.right=ok||P.x<199.4;if(!ok&&P.x>199.2)keys.right=false;if(P.grounded&&P.x>200&&ok){keys.jump=false}}}
 if(!ctl){keys.right=go;var edge=P.grounded&&!sol(P.x+(run?1.5:1.0),P.y);var up=P.grounded&&solids.some(function(s){return !s.dead&&s.t>P.y+.4&&s.t<P.y+2.6&&s.l>P.x&&s.l-P.x<1.3});
  if(P.x>219&&P.x<238.5&&P.grounded&&Math.abs(P.y-4.2)<.2){var me=solids.filter(function(s){return !s.dead&&P.x>=s.l-.05&&P.x<=s.r+.05&&Math.abs(s.t-P.y)<.2}).sort(function(a,b){return b.r-a.r})[0];
  var nx=solids.filter(function(s){return !s.dead&&me&&s!==me&&s.l>me.l&&Math.abs(s.t-4.2)<.2&&s.r>me.r}).sort(function(a,b){return a.l-b.l})[0];
  if(me&&nx&&nx.l-me.r<.5){keys.right=true}else if(me){keys.right=P.x<me.r-.9}edge=false}
if(go&&(edge||up)&&P.grounded){keys.jump=true;P.jbuf=.12}else if(P.grounded||P.vy<0)keys.jump=false}
 step(STEP)}
dyn=null;hurt=h0;keys.right=keys.run=keys.jump=false;out.push((run?'correndo':'andando')+' '+c[1]+': x='+P.x.toFixed(1)+' y='+P.y.toFixed(1)+' estado='+state+' batidas='+hits.join(',')+((P.x>=c[3]||state==='win')&&state!=='dying'?' ok':' NÃO'))});return out.join(' | ')})()`);const r2=await E(`(function(){var o=[],k;startLevel(20);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;var h0=hearts,q=RT.thorns[0];for(k=0;k<90*4&&hearts===h0;k++){P.x=q.x;P.y=0;step(STEP)}o.push('espinho machuca '+(hearts<h0?'ok':'NÃO'));
 startLevel(20);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;h0=hearts;var s=RT.spiders[0];for(k=0;k<90*3&&hearts===h0;k++){P.x=s.x;P.y=0;step(STEP)}o.push('aranha desce e machuca '+(hearts<h0?'ok':'NÃO'));
 startLevel(20);beginPlay();card.hidden=true;state='play';P.inv=1e9;s=RT.spiders[0];s.st='wait';s.t=5;s.y=s.low;P.x=s.x;P.y=s.low+1.2;P.vy=-3;for(k=0;k<30;k++)step(STEP);o.push('pisar na aranha '+(!s.alive?'ok':'NÃO'));
 startLevel(20);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;P.x=177;P.y=-2;P.vy=0;for(k=0;k<90*3;k++)step(STEP);o.push('cair no buraco do cipó é queda '+(state!=='play'?'ok':'NÃO'));
 return o.join(' | ')})()`);
 const g4=await E(`(function(){startLevel(20);beginPlay();card.hidden=true;state='play';hearts=99;P.inv=0;enemies.forEach(function(e){e.alive=false;e.x=-999});
var b=RT.boss,k,hits=0,h0=hurt,log=[];hurt=function(){if(P.inv<=0)hits++;return h0.apply(this,arguments)};P.x=310;P.y=4.2;P.vy=0;
function go(tx){keys.right=P.x<tx-.15;keys.left=P.x>tx+.15}
for(k=0;k<90*120&&state==='play'&&!b.won;k++){keys.jump=false;
 if(b.st==='wait'||b.st==='intro'){go(320)}
 else if(b.st==='stun'){if(Math.abs(P.x-b.x)>2.4)go(b.x+(P.x<b.x?-2:2));else{go(b.x);if(P.grounded){keys.jump=true;P.jbuf=.12}}}
 else if(b.st==='warn'||b.st==='drop'||b.st==='bite'){go(b.x+(P.x<b.x?-3.2:3.2))}
 else{var s=b.seeds.filter(function(q){return q.st==='ready'}).sort(function(a,c){return Math.abs(a.x-P.x)-Math.abs(c.x-P.x)})[0];
  if(s){var stand=s.x-1.4;if(Math.abs(b.x-stand)<.7&&Math.abs(P.x-stand)<.4)go(s.x);else go(stand)}else go(331)}
 if(P.grounded&&b.webs.some(function(w){return Math.abs(P.x-w.x)<1.3})&&(keys.left||keys.right)){keys.jump=true;P.jbuf=.12}
 step(STEP);if(k%90==0)log.push(b.st[0]+b.hp)}
hurt=h0;dyn=null;keys.left=keys.right=keys.jump=false;
var won=b.won;for(k=0;k<90*3;k++){keys.right=true;step(STEP)}keys.right=false;
return 'venceu='+won+' hp='+b.hp+' batidas='+hits+' t='+(k/90).toFixed(0)+' x='+P.x.toFixed(1)+' w1aberta='+b.w1.dead+' '+log.join('')})()`);const r4=await E(`(function(){var o=[],k;startLevel(20);beginPlay();card.hidden=true;state='play';P.inv=1e9;var b=RT.boss;P.x=320;P.y=4.2;for(k=0;k<30;k++)step(STEP);var ok1=!b.w0.dead;resetState();var ok2=b.w0.dead&&!b.w1.dead&&b.st==='wait';b.won=true;resetState();var ok3=b.w0.dead&&b.w1.dead;return 'arena fecha '+(ok1?'ok':'NÃO')+' | morreu na luta: abre a entrada '+(ok2?'ok':'NÃO')+' | vencida e morreu: tudo aberto '+(ok3?'ok':'NÃO')})()`);
  marca('Mundo 21: Raízes — semente-ponte, esporos, cogumelos, cipós, raiz que sobe, raízes que andam, espinhos, aranhas, Aranha das Raízes',/venceu=true.*w1aberta=true/.test(g4)&&/x=3(4[89]|[5-6]\d)/.test(g4)&&!/NÃO/.test(r4)&&/andando: estado=win.*correndo: estado=win/.test(g)&&!/NÃO/.test(r)&&!/NÃO/.test(g2+g3+r2),g+' || '+r+' || '+g2+' || '+g3+' || '+r2+' || '+g4+' || '+r4)}
 /* 65: Mundo 22 — Copa da Árvore Mãe (parte 1): robô sobe andando e correndo (folhas, semente-ponte, vento, cipó, flor); Bruxa aparece e a poção machuca; folha dobra e volta */
 {const g=await E(`(function(){var out=[];[0,1].forEach(function(run){startLevel(21);beginPlay();card.hidden=true;state='play';hearts=99;P.inv=1e9;enemies.forEach(function(e){e.alive=false;e.x=-999});
function sol(x,y){return solids.some(function(s){return !s.dead&&x>=s.l&&x<=s.r&&Math.abs(s.t-y)<.6})}
var k,att=0,v=RT.vines[0];keys.run=!!run;
for(k=0;k<90*70&&state==='play'&&P.x<148;k++){var ctl=0;
 if(!att&&P.x>90&&P.x<93&&P.y>6&&P.y<7){ctl=1;keys.run=false;if(P.grounded){if(P.x<91.4){keys.right=true}else{keys.right=false;if(Math.abs(v.a)<.06&&v.w<0){keys.right=true;keys.jump=true;P.jbuf=.12}else keys.jump=false}}}
 if(RT.sw){att=1;ctl=1;keys.jump=false;keys.right=v.w>0;keys.left=v.w<0;if(v.a>.75&&v.w>0){keys.left=false;keys.right=true;keys.jump=true}}
 else if(att&&P.x<104&&!P.grounded){ctl=1;keys.left=false;keys.right=true}
 if(!ctl){keys.left=false;keys.right=true;keys.run=!!run;var ahead=P.x+(run?1.5:1.0);var edge=P.grounded&&!sol(ahead,P.y);var up=P.grounded&&solids.some(function(s){return !s.dead&&s.t>P.y+.4&&s.t<P.y+2.6&&s.l>P.x&&s.l-P.x<1.4});
  if((edge||up)&&P.grounded){keys.jump=true;P.jbuf=.12}else if(P.grounded||P.vy<0)keys.jump=false}
 step(STEP)}
dyn=null;keys.right=keys.left=keys.run=keys.jump=false;out.push((run?'correndo':'andando')+': x='+P.x.toFixed(1)+' y='+P.y.toFixed(1)+' estado='+state+' cipó='+att+(P.x>=148||state==='win'?' ok':' NÃO'))});return out.join(' | ')})()`);const r=await E(`(function(){var o=[],k;startLevel(21);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;enemies.forEach(function(e){e.alive=false});var h0=hearts,seen=0;for(k=0;k<90*14;k++){P.x=58;P.y=2.5;step(STEP);if(CP.w.st==='show')seen=1}o.push('bruxa aparece '+(seen?'ok':'NÃO'));o.push('poção machuca '+(hearts<h0?'ok':'NÃO'));
 startLevel(21);beginPlay();card.hidden=true;state='play';P.inv=1e9;var q=CP.leaves[0];P.x=22.5;P.y=1.2;P.vy=0;for(k=0;k<90*2;k++)step(STEP);o.push('folha dobra '+(q.d>.8?'ok':'NÃO'));P.x=10;P.y=0;for(k=0;k<90*3;k++)step(STEP);o.push('folha volta '+(q.d<.05?'ok':'NÃO'));return o.join(' | ')})()`);
 const g2=await E(`(function(){var out=[];[0,1].forEach(function(run){startLevel(21);beginPlay();card.hidden=true;state='play';hearts=99;P.inv=1e9;P.x=146;P.y=8.5;enemies.forEach(function(e){e.alive=false;e.x=-999});
function sol(x,y){return solids.some(function(s){return !s.dead&&x>=s.l&&x<=s.r&&Math.abs(s.t-y)<.6})}
var k,att=0,v=RT.vines[0];keys.run=!!run;
for(k=0;k<90*70&&state==='play'&&P.x<316;k++){var ctl=0;
 if(!att&&P.x>90&&P.x<93&&P.y>6&&P.y<7){ctl=1;keys.run=false;if(P.grounded){if(P.x<91.4){keys.right=true}else{keys.right=false;if(Math.abs(v.a)<.06&&v.w<0){keys.right=true;keys.jump=true;P.jbuf=.12}else keys.jump=false}}}
 if(RT.sw){att=1;ctl=1;keys.jump=false;keys.right=v.w>0;keys.left=v.w<0;if(v.a>.75&&v.w>0){keys.left=false;keys.right=true;keys.jump=true}}
 else if(att&&P.x<104&&!P.grounded){ctl=1;keys.left=false;keys.right=true}
 if(!ctl){keys.left=false;keys.right=true;keys.run=!!run;var ahead=P.x+(run?1.5:1.0);var edge=P.grounded&&!sol(ahead,P.y);var up=P.grounded&&solids.some(function(s){return !s.dead&&s.t>P.y+.4&&s.t<P.y+2.6&&s.l>P.x&&s.l-P.x<1.4});
  if((edge||up)&&P.grounded){keys.jump=true;P.jbuf=.12}else if(P.grounded||P.vy<0)keys.jump=false}
 step(STEP)}
dyn=null;keys.right=keys.left=keys.run=keys.jump=false;out.push((run?'correndo':'andando')+': x='+P.x.toFixed(1)+' y='+P.y.toFixed(1)+' estado='+state+' cipó='+att+(P.x>=148||state==='win'?' ok':' NÃO'))});return out.join(' | ')})()`);const r2=await E(`(function(){var k;startLevel(21);beginPlay();card.hidden=true;state='play';P.inv=0;hearts=9;enemies.forEach(function(e){e.alive=false});CP.w.t=999;var b=CP.cones[0],h0=hearts;b.on=0;b.t=b.per-.01;for(k=0;k<90*6&&hearts===h0;k++){P.x=176;P.y=9;step(STEP)}return 'pinha machuca '+(hearts<h0?'ok':'NÃO')})()`);
 const g4=await E(`(function(){startLevel(21);beginPlay();card.hidden=true;state='play';hearts=99;P.inv=0;enemies.forEach(function(e){e.alive=false;e.x=-999});CP.w.t=9999;
var b=CP.boss,B=b.B,k,hits=0,h0=hurt,log='',lastSt='';hurt=function(){if(P.inv<=0)hits++;return h0.apply(this,arguments)};P.x=326;P.y=18;P.vy=0;
function go(tx){keys.right=P.x<tx-.2;keys.left=P.x>tx+.2}
var hold=0;for(k=0;k<90*150&&state==="play"&&!b.won;k++){keys.jump=hold>0&&P.vy>0;if(hold>0)hold--;
 if(b.st!==lastSt){log+=b.st.slice(0,3)+b.hp+" ";lastSt=b.st}
 if(b.st==='wait'||b.st==='intro')go(336);
 else if(b.st==='down'||b.st==='stir'){go(b.x-.2);if(b.st==="stir"&&Math.abs(P.x-b.x)<.5&&P.grounded){keys.jump=true;P.jbuf=.12;hold=40}}
 else if(b.st==='flee'){go(B.cx)}
 else if(b.st==='flee2'){if(!P.grounded&&P.y>B.floor+3){go(b.x)}else go(B.cx)}
 else{var tgt=B.cx-6;b.bolts.forEach(function(q){if(q.t>0&&Math.abs(q.x-tgt)<2)tgt=q.x+(q.x<B.cx?3.5:-3.5)});go(tgt);
  var near=b.orbs.some(function(o){return Math.abs(o.x-P.x)<2.4&&o.y<B.floor+1.5&&Math.sign(o.vx)===Math.sign(P.x-o.x)});if(near&&P.grounded){keys.jump=true;P.jbuf=.12;hold=40}}
 if(!keys.jump&&P.vy<0)keys.jump=false;
 step(STEP)}
var won=b.won;for(k=0;k<90*5&&state==='play';k++)step(STEP);
hurt=h0;dyn=null;keys.left=keys.right=keys.jump=false;
return 'venceu='+won+' estado='+state+' batidas='+hits+' '+log})()`);const r4=await E(`(function(){var o=[],k;startLevel(21);beginPlay();card.hidden=true;state='play';P.inv=1e9;CP.w.t=9999;var b=CP.boss;P.x=334;P.y=18;for(k=0;k<30;k++)step(STEP);var ok1=!b.w0.dead;resetState();var ok2=b.w0.dead&&b.st==='wait';return 'arena fecha '+(ok1?'ok':'NÃO')+' | morreu na luta: reabre e reinicia '+(ok2?'ok':'NÃO')})()`);
  marca('Mundo 22: Copa — folhas, Bruxa que aparece, cipó, galhos podres, pinhas, flores, pena, luta final e Fim da aventura',/venceu=true estado=win/.test(g4)&&!/NÃO/.test(r4)&&/andando: .*ok.*correndo: .*ok/.test(g)&&/andando: x=31[6-9].*correndo: x=31[6-9]/.test(g2)&&!/NÃO/.test(g+r+r2),g+' || '+r+' || '+g2+' || '+r2+' || '+g4+' || '+r4)}
 /* 66: Robô gerador de fases — Mundos 23 a 72: cada mundo gerado é passado pelo robô de teste andando e correndo (tem que chegar ao fim) */
 {const BOT=require('fs').readFileSync(__dirname+'/robo_bot.js','utf8');const g=await E(BOT+`(function(){var bad=[],ok=0,names={};for(var n=23;n<=72;n++){[0,1].forEach(function(run){var r=rbBot(n,run,180);if(/: win/.test(r))ok++;else bad.push(r)});names[LV.name]=1}
  return ok+' de 100 ok, '+Object.keys(names).length+' nomes'+(bad.length?' | '+bad.join(' | '):'')})()`);
  marca('Robô gerador: mundos 23 a 72 dá para passar andando e correndo',/^100 de 100/.test(g),g)}
 {const m=await E(`(function(){var u=save.unlocked;save.unlocked=23;rbGarante(26);openMap({from:21});var a=mapNodes.length===LEVELS.length&&mapNodes[22].state!=='lock'&&mapNodes[23].state==='lock';
  levelIdx=22;LV=LEVELS[22];recordLevel();openMap({from:22,walkTo:23});for(var k=0;k<400;k++)mapUpdate(1/60);var b=mapAt===23&&mapNodes.length===LEVELS.length&&save.unlocked===24;leaveMap();state='menu';save.unlocked=u;return (a?'ilha 23 aberta ok':'ilha 23 NÃO')+' | '+(b?'barco/trilha até a 24 ok':'24 NÃO')+' | ilhas '+mapNodes.length})()`);
  marca('Ilhas do Robô no mapa: ilha nova aparece e o Kuro anda até ela',!/NÃO/.test(m),m)}
 marca('sem erros de JavaScript durante os testes',!erros.length,erros.slice(0,3).join('; '));await pg.close();
 await b.close();const f=res.filter(r=>!r[1]).length;console.log('\n'+(f?'❌ '+f+' teste(s) falharam':'✅ todos os '+res.length+' testes passaram'));process.exit(f?1:0)})();
