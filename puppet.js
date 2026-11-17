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

export function puppetInfluences(u,v,pins){
  const weights=pins.map(pin=>1/Math.max(1e-6,Math.hypot(u-pin.u,v-pin.v))**4);
  const total=weights.reduce((sum,value)=>sum+value,.01);
  return weights.map((weight,index)=>pins[index].kind==='motion'?weight/total:0);
}

export function puppetPinOffset(pin,settings,elapsed,width,height){
  if(pin.kind!=='motion')return [0,0];
  const {axis,amount,speed,delay=0}= {...settings,...pin};
  const progress=puppetProgress(elapsed-delay,speed,settings.pingpong);
  const distance=amount/100*progress;
  return axis==='y'?[0,height*distance]:[width*distance,0];
}
