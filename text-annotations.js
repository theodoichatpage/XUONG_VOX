import rough from 'roughjs';
const clamp01=n=>Math.max(0,Math.min(1,n));
export function annotationProgress(settings,time,start){if(!settings?.annotation||settings.annotation==='none')return 0;const delay=Math.max(0,Number(settings.annotationDelay)||0),duration=Math.max(.05,Number(settings.annotationDuration)||.8);return clamp01((time-start-delay)/duration)}
export function selectedTextRange(content,start,end){const n=content.length;if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<=start||start>=n)return [0,n];return [start,Math.min(end,n)]}
export function easeCircle(p){p=clamp01(p);let lo=0,hi=1;for(let i=0;i<20;i++){let t=(lo+hi)/2,x=3*(1-t)*(1-t)*t*.42+3*(1-t)*t*t*.58+t*t*t;if(x<p)lo=t;else hi=t}let t=(lo+hi)/2;return 3*(1-t)*t*t+t*t*t}
// Normalized critically damped-style spring using the reference's overdamped values.
export function easeHighlight(p){p=clamp01(p);const r1=(-200+Math.sqrt(200*200-400))/2,r2=(-200-Math.sqrt(200*200-400))/2;const value=t=>1-(r2*Math.exp(r1*t)-r1*Math.exp(r2*t))/(r2-r1);return clamp01(value(p*7.82)/value(7.82))}
const generator=rough.generator();
// Convert Rough.js cubic curves to points so that the same deterministic geometry
// can be revealed partially on the canvas at any timeline time, including export.
export function roughPoints(ops){let paths=[],points=[],current=null;for(const op of ops){let d=op.data;if(op.op==='move'){if(points.length>1)paths.push(points);points=[[d[0],d[1]]];current=[d[0],d[1]]}else if(op.op==='lineTo'&&current){current=[d[0],d[1]];points.push(current)}else if(op.op==='bcurveTo'&&current){const [x0,y0]=current;for(let i=1;i<=24;i++){let t=i/24,u=1-t;points.push([u*u*u*x0+3*u*u*t*d[0]+3*u*t*t*d[2]+t*t*t*d[4],u*u*u*y0+3*u*u*t*d[1]+3*u*t*t*d[3]+t*t*t*d[5]])}current=[d[4],d[5]]}}if(points.length>1)paths.push(points);return paths}
function drawPath(ctx,points,progress){if(progress<=0||points.length<2)return;let lengths=[],total=0;for(let i=1;i<points.length;i++){let n=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);lengths.push(n);total+=n}let remain=total*clamp01(progress);ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length&&remain>0;i++){let n=lengths[i-1],p=Math.min(1,remain/(n||1));ctx.lineTo(points[i-1][0]+(points[i][0]-points[i-1][0])*p,points[i-1][1]+(points[i][1]-points[i-1][1])*p);remain-=n}ctx.stroke()}
function roughOptions(type,seed){return {seed,maxRandomnessOffset:type==='highlight'?10:5,roughness:type==='highlight'?2.3:type==='circle'?1.8:type==='cross'?2:1.5,bowing:type==='highlight'?0:1,stroke:'#000',strokeWidth:1.5,curveTightness:0,curveFitting:.95,curveStepCount:9,disableMultiStroke:true}}
export function annotationPaths(type,rect){const {left,top,width,height}=rect,l=left,r=left+width,t=top,b=top+height,mid=top+height/2,paths=[];function add(shape){for(const set of shape.sets)if(set.type==='path')paths.push(...roughPoints(set.ops))}function addLine(x1,y1,x2,y2,i){add(generator.line(x1,y1,x2,y2,roughOptions(type,42+i)))}
 if(type==='highlight')addLine(l-20,mid,r+20,mid,0);
 else if(type==='circle'){for(let i=0;i<2;i++)add(generator.ellipse((l+r)/2,mid,width+20,height+20,roughOptions(type,42+i)))}
 else if(type==='underline'){for(let i=0;i<3;i++)i%2?addLine(r,b,l,b,i):addLine(l,b,r,b,i)}
 else if(type==='cross'){for(let i=0;i<10;i++)i%2?addLine(r,b,l,t,i):addLine(l,t,r,b,i);for(let i=0;i<10;i++)i%2?addLine(r,t,l,b,i+10):addLine(l,b,r,t,i+10)}
 else if(type==='strike')addLine(l,mid,r,mid,0);
 else if(type==='box')add(generator.rectangle(l,t,width,height,roughOptions(type,42)));
 else if(type==='bracket'){addLine(l,t,l,b,0);addLine(r,t,r,b,1)}return paths}
export function drawAnnotation(ctx,type,rect,progress,color,thickness=6,background=false,opacity=1){if(progress<=0||(type==='highlight')!==background||rect.width<=0||rect.height<=0)return;let paths=annotationPaths(type,rect),p=type==='circle'?easeCircle(progress):type==='highlight'?easeHighlight(progress):clamp01(progress);ctx.save();ctx.globalAlpha=Number.isFinite(Number(opacity))?Math.max(0,Math.min(1,Number(opacity))):1;if(type==='highlight')ctx.globalAlpha*=.62;ctx.strokeStyle=color;ctx.lineWidth=type==='highlight'?rect.height:Math.max(1,Math.min(30,Number(thickness)||6));ctx.lineCap='butt';ctx.lineJoin='round';paths.forEach((points,i)=>drawPath(ctx,points,clamp01(p*paths.length-i)));ctx.restore()}
