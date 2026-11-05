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
