const {chromium}=require('/opt/npm-tools/node_modules/playwright');const rotas=require('./rotas.js');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:320,height:180}});pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());pg.setDefaultTimeout(0);
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2200);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
const X='if(trIntro)trIntro.on=false;';
const pares=[[[-3,19,0],[19,64,0]],[[19,64,0],[68,80,1.2]],[[68,80,1.2],[80,92,2.6]],[[80,92,2.6],[97,140,0]],[[97,140,0],[145,158,1.2]],[[170,186,1.2],[186,206,2.6]],
 [[97,111.4,0],[111.5,115.5,2.8]],[[111.5,115.5,2.8],[117,121,5.3]],[[19,46.8,0],[47,54,3.0],'tronco']];
const f=await rotas(E,11,pares.map(p=>[p[0],p[1],X,p[2]]));console.log('falhas:',JSON.stringify(f));
/* plataforma móvel: do 158 até 170 */
console.log(await E(`(function(){startLevel(11);beginPlay();trIntro&&(trIntro.on=false);enemies.forEach(function(e){e.alive=false;e.x=-999});P.inv=1e9;P.x=156;P.y=1.2;var ok=false;keys.right=true;for(var k=0;k<120*14;k++){var m=movers[0];var near=P.grounded&&P.onPlat!==m&&P.x>157&&P.x<158&&m.x<161&&m.x>159.8;var onM=P.onPlat===m&&m.x>166.5;keys.right=(P.x<157.5)||onM||(P.onPlat===m&&P.x<m.x)||!P.grounded;if(near||(onM&&P.grounded)){keys.jump=true;P.jbuf=.13}else keys.jump=false;step(STEP);if(P.x>171&&P.grounded&&P.y>1.1){ok=true;break}if(P.y<-5)break}keys.right=keys.jump=false;return 'mover:'+ok+' x='+P.x.toFixed(1)})()`));
await b.close()})();
