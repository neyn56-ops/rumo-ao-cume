const {chromium}=require('/opt/npm-tools/node_modules/playwright');const rotas=require('./rotas.js');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);const X='if(trIntro)trIntro.on=false;';
const f=await rotas(E,11,[[[388,404,1.6],[404,500,1.6]],[[427.5,431.5,8.8],[431.5,436.4,8.8]],[[459,464,19.8],[466.2,467.6,20.6]],[[466.2,467.6,20.6],[469.6,471,21.4]],[[469.6,471,21.4],[473,474.4,22.2]],[[473,474.4,22.2],[476.5,500,23]]].map(p=>[p[0],p[1],X]));console.log('falhas',JSON.stringify(f));
/* bot completo da subida: cipó, tábua, plataforma que anda, elevador, cipó, pendurado */
console.log(await E(`(function(){startLevel(11);beginPlay();trIntro.on=false;enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;hearts=99;P.x=411.9;P.y=1.6;for(var k=0;k<20;k++)step(STEP);
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
 K();return st+' | '+log.join(' ')})()`));
await b.close()})();
