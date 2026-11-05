const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const pg=await b.newPage();pg.on('pageerror',e=>console.log('ERRO',e.message));await pg.route(/fonts/,r=>r.abort());
await pg.addInitScript(()=>{window.requestAnimationFrame=()=>1});
await pg.goto('file://'+__dirname+'/teste.html',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(1500);
const r=await pg.evaluate(async()=>{return await window.__ev(`(async function(){var oc=new OfflineAudioContext(1,44100*0.8,44100);var nb=oc.createBuffer(1,44100,44100),d=nb.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 var sa=actx,sb=sfxBus,sn=noiseBuf,so=soundOn;actx=oc;sfxBus=oc.destination;noiseBuf=nb;soundOn=true;var err='';try{whirlSfx()}catch(e){err=e.message}
 actx=sa;sfxBus=sb;noiseBuf=sn;soundOn=so;var buf=await oc.startRendering(),x=buf.getChannelData(0),s=0,pk=0;for(var i=0;i<x.length;i++){s+=x[i]*x[i];pk=Math.max(pk,Math.abs(x[i]))}
 var seg=[];for(var k=0;k<8;k++){var a=0;for(var j=k*4410;j<(k+1)*4410;j++)a+=x[j]*x[j];seg.push(Math.sqrt(a/4410).toFixed(3))}
 return 'rms '+Math.sqrt(s/x.length).toFixed(4)+' pico '+pk.toFixed(3)+' por 0,1s: '+seg.join(' ')+' '+err})()`)});
console.log(r);await b.close()})();
