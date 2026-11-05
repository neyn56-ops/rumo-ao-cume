(function(){function go(){startLevel(18);beginPlay();card.hidden=true;state='play';P.inv=1e9;hearts=9;enemies.forEach(function(e){e.alive=false;e.x=-999});WK.gust.t=1e9;WK.strike.t=1e9;WK.big.t=1e9}
function list(){return solids.filter(function(s){return s.t>-.5&&s.t<3&&s.r>93&&s.l<241&&!s.dead&&(s.mover||s.b<-5)}).sort(function(a,b){return (a.cx||a.l)-(b.cx||b.l)})}
go();var N=list().length,res=[];
for(var i=0;i<N-1;i++){var ok=false,info='';for(var tr=0;tr<3&&!ok;tr++){go();for(var k=0;k<tr*70+5;k++)step(STEP);var A=list(),a=A[i],b=A[i+1];
 P.x=a.r-.45;P.y=a.t;P.vy=0;P.grounded=true;P.onPlat=a;for(k=0;k<2;k++)step(STEP);keys.right=true;keys.jump=true;P.jbuf=.12;var land=null;
 for(k=0;k<200;k++){if(P.vy<-1)keys.jump=false;if(P.x>b.l+.7)keys.right=false;step(STEP);if(k>10&&P.grounded){land=P.onPlat;break}if(P.y<-3)break}
 keys.right=false;keys.jump=false;if(land===b)ok=true;info=a.l.toFixed(1)+'→'+b.l.toFixed(1)+' gap '+(b.l-a.r).toFixed(1)+' dy '+(b.t-a.t).toFixed(1)}
 res.push((ok?'ok ':'NÃO ')+info)}
return res.filter(function(x){return x.indexOf('NÃO')==0}).join(' | ')+' || total '+res.length})()
