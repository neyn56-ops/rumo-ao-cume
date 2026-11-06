/* vídeo de prévia para os portais (sem som, 18 s, Mundo 1): node testes/video.js 1920 1080 saida.mp4 [capa.png] */
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs'),cp=require('child_process');
const [W,H,OUT,CAPA]=[+process.argv[2],+process.argv[3],process.argv[4],process.argv[5]];const K=+(process.env.K||2),RW=Math.round(W/K),RH=Math.round(H/K);
const D=__dirname+'/fotos/vid_'+W+'x'+H;fs.rmSync(D,{recursive:true,force:true});fs.mkdirSync(D,{recursive:true});
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage({viewport:{width:RW,height:RH},deviceScaleFactor:1});await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1;localStorage.setItem('rumo-ao-cume-cfg',JSON.stringify({preset:'high',pMig:1,aaMig:2,lang:'en'}))});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(2500);
const E=c=>pg.evaluate(c=>window.__ev(c),c);
await E(`leaveMap();startLevel(0);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=3;setHearts();
 document.getElementById('hud').style.visibility='hidden';document.querySelectorAll('#pad,.pad,#touch,#tch,#stick,#padL,#padR').forEach(function(e){e.style.display='none'});
 window.__bot=function(){function gnd(x){return solids.some(function(s){return !s.dead&&x>=s.l&&x<=s.r&&Math.abs(s.t-P.y)<.3})||crumbles.some(function(c){return !c.dead&&x>=c.l&&x<=c.r})}
  keys.right=true;keys.run=true;var wall=solids.some(function(s){return !s.dead&&s.l>P.x&&s.l-P.x<1.6&&s.t>P.y+.3&&s.t<P.y+3});
  var foe=enemies.some(function(e){return e.alive&&e.x>P.x&&e.x-P.x<2.6&&Math.abs(e.y-P.y)<1.5});
  if(P.grounded&&(!gnd(P.x+1.6)||wall||foe)){keys.jump=true;P.jbuf=.12}else if(P.vy<0)keys.jump=false};
 for(var k=0;k<60;k++){step(STEP);animate(STEP)}updateCamera(1/30,true);1`);
const N=+(process.env.N||30*18);for(let f=0;f<N;f++){await E(`for(var k=0;k<3;k++){__bot();step(STEP);animate(STEP)}updateCamera(1/30);render();1`);await pg.screenshot({path:D+'/f'+String(f).padStart(4,'0')+'.png'})}
await b.close();
let inp=`-framerate 30 -i ${D}/f%04d.png`,flt=`-vf scale=${W}:${H}:flags=lanczos`;
if(CAPA){inp=`-loop 1 -t 1 -framerate 30 -i ${CAPA} `+inp;flt=`-filter_complex "[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1[c];[1:v]scale=${W}:${H}:flags=lanczos,setsar=1[g];[c][g]concat=n=2:v=1[v]" -map "[v]"`}
cp.execSync(`ffmpeg -y -loglevel error ${inp} ${flt} -c:v libx264 -preset veryfast -crf 22 -pix_fmt yuv420p -an -t 20 ${OUT}`);
console.log('ok',OUT,(fs.statSync(OUT).size/1048576).toFixed(1)+'MB')})();
