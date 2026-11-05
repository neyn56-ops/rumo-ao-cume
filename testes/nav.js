const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:900,height:420}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'low',pMig:1,aaMig:2}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2000);
const E=c=>pg.evaluate(c=>window.__ev(c),c);const K=async k=>{await pg.keyboard.press(k);await pg.waitForTimeout(60)};
const foc=()=>E('navEl?(navEl.id||navEl.textContent.trim().slice(0,20)):"-"');
await K('ArrowDown');console.log('1',await foc());
await K('ArrowRight');console.log('2',await foc());await K('ArrowRight');console.log('3',await foc());
await K('ArrowDown');console.log('4',await foc());
await pg.screenshot({path:__dirname+'/fotos/nav1.png'});
// ir até Configurações e abrir
await K('Enter');console.log('cfg aberto?',await E('!$("cfg").hidden'));
for(let i=0;i<3;i++)await K('ArrowDown');console.log('5',await foc());
await pg.screenshot({path:__dirname+'/fotos/nav2.png'});
for(let i=0;i<4;i++){await K('ArrowDown');console.log('  d',await foc())}
const v0=await E('navEl&&navEl.type==="range"?navEl.value:"x"');await K('ArrowRight');console.log('range',v0,'->',await E('navEl&&navEl.type==="range"?navEl.value:"x"'));
await K('ArrowLeft');
await K('Escape');console.log('cfg fechado?',await E('$("cfg").hidden'));
// mapa
await K('ArrowDown');await K('ArrowUp');console.log('m',await foc());
await E('navClear();navIdx=-1;1');
await K('ArrowDown');await K('ArrowRight');console.log('mapa foco',await foc());await K('Enter');console.log('state',await E('state'));
await E('for(var i=0;i<200;i++)mapUpdate(1/60);1');console.log('no',await E('mapAt+" sel="+mapSel+" panel="+!$("mapPanel").hidden'));
await K('ArrowLeft');await E('for(var i=0;i<300;i++)mapUpdate(1/60);1');console.log('esq',await E('mapAt'));
await K('ArrowLeft');await K('ArrowLeft');await E('for(var i=0;i<400;i++)mapUpdate(1/60);1');console.log('esq2',await E('mapAt'));
await K('ArrowRight');await E('for(var i=0;i<300;i++)mapUpdate(1/60);1');console.log('dir',await E('mapAt'));
await pg.screenshot({path:__dirname+'/fotos/nav3.png'});
await K('Enter');console.log('state',await E('state+" lv="+levelIdx'));
await K('Enter');console.log('state2',await E('state'));
await E('card.hidden=true;state="play";1');
await K('KeyP');console.log('pausado',await E('paused'));await K('ArrowDown');console.log('p foco',await foc());
await pg.screenshot({path:__dirname+'/fotos/nav4.png'});
await K('Enter');console.log('pausado depois',await E('paused'));
await K('KeyP');await K('Escape');console.log('esc',await E('paused'));
await b.close()})();
