// Timeline-driven annotation paths drawn in the same canvas as each text layer.
const clamp01=n=>Math.max(0,Math.min(1,n));
export function annotationProgress(settings,time,start){if(!settings?.annotation||settings.annotation==='none')return 0;const delay=Math.max(0,Number(settings.annotationDelay)||0),duration=Math.max(.05,Number(settings.annotationDuration)||.8);return clamp01((time-start-delay)/duration)}
export function selectedTextRange(content,start,end){const n=content.length;if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<=start||start>=n)return [0,n];return [start,Math.min(end,n)]}
function path(ctx,points,progress){if(progress<=0||points.length<2)return;let lengths=[],total=0;for(let i=1;i<points.length;i++){const len=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);lengths.push(len);total+=len}let remain=total*clamp01(progress);ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length&&remain>0;i++){const len=lengths[i-1],p=Math.min(1,remain/(len||1));ctx.lineTo(points[i-1][0]+(points[i][0]-points[i-1][0])*p,points[i-1][1]+(points[i][1]-points[i-1][1])*p);remain-=len}ctx.stroke()}
function line(x1,y1,x2,y2){let p=[];for(let i=0;i<=12;i++){let t=i/12,wave=Math.sin(i*2.17)*1.15;p.push([x1+(x2-x1)*t,y1+(y2-y1)*t+wave])}return p}
export function drawAnnotation(ctx,type,rect,progress,color,thickness=6,background=false){if(progress<=0||(type==='highlight')!==background)return;const {left,top,width,height}=rect;if(width<=0||height<=0)return;ctx.save();ctx.strokeStyle=color;ctx.lineWidth=Math.max(1,Math.min(30,Number(thickness)||6));ctx.lineCap='round';ctx.lineJoin='round';let l=left-6,r=left+width+6,t=top-3,b=top+height+3,mid=(t+b)/2;
 if(type==='highlight'){ctx.globalAlpha=.6;ctx.lineWidth=height*.68;path(ctx,line(l,mid,r,mid),progress)}
 else if(type==='underline')path(ctx,line(l,b,r,b),progress);
 else if(type==='strike')path(ctx,line(l,mid,r,mid),progress);
 else if(type==='cross'){path(ctx,line(l,t,r,b),Math.min(1,progress*2));path(ctx,line(l,b,r,t),Math.max(0,progress*2-1))}
 else if(type==='box')path(ctx,[[l,t],[r,t+2],[r+1,b],[l,b+1],[l,t]],progress);
 else if(type==='bracket')path(ctx,[[l+12,t],[l,t],[l,b],[l+12,b],[l,b],[r,b],[r,b-12],[r,t],[r-12,t]],progress);
 else if(type==='circle'){let points=[];for(let i=0;i<=72;i++){let a=-Math.PI/2+i*Math.PI*2/72,rough=1+0.012*Math.sin(i*1.7);points.push([(l+r)/2+Math.cos(a)*(r-l)/2*rough,mid+Math.sin(a)*(b-t)*.67*rough])}path(ctx,points,progress)}ctx.restore()}
