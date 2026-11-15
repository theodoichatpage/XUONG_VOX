export const puppetDefaults={enabled:false,pingpong:true,amount:4,speed:1,axis:'x',pins:[]};

export function puppetProgress(elapsed,speed,pingpong){
  const phase=Math.max(0,elapsed)*speed;
  return pingpong?(1-Math.cos(phase*Math.PI*2))/2:Math.min(1,phase);
}

export function puppetWeight(u,v,pins){
  let movement=0,total=.01;
  for(const pin of pins){
    const distance=Math.hypot(u-pin.u,v-pin.v);
    if(distance<1e-6)return pin.kind==='motion'?1:0;
    const weight=1/(distance**4);
    total+=weight;
    if(pin.kind==='motion')movement+=weight;
  }
  return movement/total;
}
