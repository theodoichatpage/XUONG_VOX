export function historyLineLayout(count,layout,start,duration){
  const span=8;
  const drawTime=Math.min(2,Math.max(0,duration-start)*.7);
  const gap=span/(count-1);
  return {
    span,
    drawTime,
    marks:Array.from({length:count},(_,index)=>({
      x:-span/2+gap*index,
      side:layout==='alternate'&&index%2?-1:1,
      time:start+drawTime*gap*index/(span+.5),
      textWidth:Math.min(2.6,gap*(layout==='alternate'?1.65:.92)),
    })),
  };
}
