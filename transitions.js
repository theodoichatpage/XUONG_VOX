import {clipBounds} from './model.js';

const slideDirections=new Map([
  ['slide',[-4,0]],
  ['slide-right',[4,0]],
  ['slide-up',[0,4]],
  ['slide-down',[0,-4]],
]);

export const transitionOptions=[
  ['fade','Mờ dần'],
  ['slide','Trượt trái'],
  ['slide-right','Trượt phải'],
  ['slide-up','Trượt lên'],
  ['slide-down','Trượt xuống'],
];
export function createTransition(outgoing,incoming,time,duration,type,total){if(!outgoing||!incoming||outgoing.id===incoming.id)throw Error('Chọn hai layer khác nhau');if((type!=='fade'&&!slideDirections.has(type))||!Number.isFinite(duration)||duration<=0)throw Error('Chọn hiệu ứng và thời lượng hợp lệ');let start=time-duration/2,end=time+duration/2,a=clipBounds(outgoing,total),b=clipBounds(incoming,total);if(start<Math.max(a.start,b.start)||end>Math.min(a.end,b.end))throw Error('Hai layer cần chồng thời gian đủ rộng quanh vạch thời gian');outgoing.transition={role:'out',type,start,end,partner:incoming.id};incoming.transition={role:'in',type,start,end,partner:outgoing.id}}
export function transitionAt(layer,time,transition=layer.transition){
  if(!transition||!(transition.end>transition.start))return {alpha:1,x:0,y:0};
  const progress=Math.max(0,Math.min(1,(time-transition.start)/(transition.end-transition.start)));
  const eased=progress*progress*(3-2*progress);
  const outgoing=transition.role==='out';
  if(transition.type==='fade')return {alpha:outgoing?1-eased:eased,x:0,y:0};
  const [x,y]=slideDirections.get(transition.type)||slideDirections.get('slide');
  const offset=outgoing?eased:eased-1;
  return {alpha:1,x:x*offset||0,y:y*offset||0};
}

export function clipJoin(outgoing,incoming,total){
  if(!outgoing||!incoming||outgoing===incoming)return null;
  const a=clipBounds(outgoing,total),b=clipBounds(incoming,total);
  return a.end>a.start&&b.end>b.start&&Math.abs(a.end-b.start)<1e-7?b.start:null;
}

export function createJoinTransition(outgoing,incoming,duration,type,total){
  const cut=clipJoin(outgoing,incoming,total);
  if(cut===null)throw Error('Hai clip cần đặt sát nhau');
  if(!transitionOptions.some(([id])=>id===type)||!Number.isFinite(duration)||duration<=0)throw Error('Chọn kiểu và thời lượng chuyển cảnh hợp lệ');
  const half=Math.min(duration/2,cut-clipBounds(outgoing,total).start,clipBounds(incoming,total).end-cut);
  const timing={type,start:cut-half,end:cut+half,atJoin:true};
  outgoing.transition={...timing,role:'out',partner:incoming.id};
  incoming.transition={...timing,role:'in',partner:outgoing.id};
  return 2*half;
}
