/* foto das peças ninja novas (para aprovação): node testes/fotoninja.js saida.png */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:1280,height:640}});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2,lang:'pt'}))});
await pg.goto('file://'+__dirname+'/teste_nj.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2500);
const r=await pg.evaluate(c=>window.__ev(c),`(function(){leaveMap();startLevel(0);beginPlay();card.hidden=true;state='play';P.inv=1e9;
 enemies.forEach(function(e){e.alive=false;if(e.vis&&e.vis.g)e.vis.g.visible=false});
 P.x=-13.5;P.y=0;for(var k=0;k<60;k++){step(1/60);animate(1/60);updateCamera(1/60)}
 var X0=-11,cr=mesh(new T.BoxGeometry(1,1,1.15),brickM);var items=[[cr,1,1.9],[njSnake(),4.5,1.6],[njStarMesh(new T.MeshStandardMaterial({color:0xffb040,emissive:0xff5a00,emissiveIntensity:2.4})),7.5,1.2],[njLanternBlock(false),9.5,1.9]];
 items.forEach(function(q){var m=q[0];m.position.set(X0+q[1],q[2]+.35,1.0);add(m)});
 /* tira o que atrapalha a foto: blocos, moedas e itens do Mundo 1 perto */
 blocks.forEach(function(bk){if(bk.x<8)bk.mesh.visible=false});coins.forEach(function(cn){if(cn.x<8&&cn.mesh)cn.mesh.visible=false});
 rig.root.visible=true;
 for(k=0;k<5;k++){animate(1/60)}camera.position.set(X0+5.5,2.8,8.5);camera.lookAt(X0+5.5,1.8,0);render();return 'ok'})()`);
await pg.waitForTimeout(500);await pg.screenshot({path:process.argv[2]});console.log(r);await b.close()})();
