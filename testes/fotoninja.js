/* foto das peças ninja novas (para aprovação): node testes/fotoninja.js saida.png */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:1280,height:640}});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2,lang:'pt'}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2500);
const r=await pg.evaluate(c=>window.__ev(c),`(function(){leaveMap();startLevel(0);beginPlay();card.hidden=true;state='play';P.inv=1e9;
 enemies.forEach(function(e){e.alive=false;if(e.vis&&e.vis.g)e.vis.g.visible=false});
 P.x=-13.5;P.y=0;for(var k=0;k<60;k++){step(1/60);animate(1/60);updateCamera(1/60)}
 var X0=-11,items=[[njLanternBlock(false),0,1.9],[njLanternBlock(true),1.3,1.9],[njOnigiri(),3.2,0],[njScroll(),4.8,0],[njWings(),6.8,.2],[njMon(),8.6,1.0],[njBamboo(2.2),10.6,0],[njTorii(),14.6,0]];
 items.forEach(function(q){var m=q[0];m.position.set(X0+q[1],q[2]+.35,1.0);add(m)});
 /* tira o que atrapalha a foto: blocos, moedas e itens do Mundo 1 perto */
 blocks.forEach(function(bk){if(bk.x<8)bk.mesh.visible=false});coins.forEach(function(cn){if(cn.x<8&&cn.mesh)cn.mesh.visible=false});
 rig.root.visible=true;
 for(k=0;k<5;k++){animate(1/60)}camera.position.set(X0+7.4,4.2,15.5);camera.lookAt(X0+7.4,2.0,0);render();return 'ok'})()`);
await pg.waitForTimeout(500);await pg.screenshot({path:process.argv[2]});console.log(r);await b.close()})();
