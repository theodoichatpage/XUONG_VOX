export const motionDefaults={type:'none',strength:35,speed:1};

export function layerMotionAt(motion,elapsed){
  const {type,strength,speed}={...motionDefaults,...motion};
  const amount=strength/100;
  const t=Math.max(0,elapsed)*speed*2*Math.PI;
  if(type==='pendulum'){
    const swing=Math.sin(t*.7)*amount;
    return {x:swing*.035,y:0,rotation:swing*10};
  }
  if(type==='shake'){
    return {
      x:amount*(Math.sin(t*2.7)*.018+Math.sin(t*4.13)*.009),
      y:amount*(Math.sin(t*3.29)*.014+Math.sin(t*5.17)*.007),
      rotation:amount*(Math.sin(t*2.1)*2+Math.sin(t*3.83)),
    };
  }
  return {x:0,y:0,rotation:0};
}
