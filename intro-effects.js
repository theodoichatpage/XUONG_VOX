export const introEffects={
  fastArrow:{name:'Mũi tên vụt',duration:.2,color:'#ecd7a0'},
  speed:{name:'Vệt tốc độ',duration:.45,color:'#e5edf5'},
  fire:{name:'Lửa',duration:1.2,color:'#ff8e26'},
  blood:{name:'Máu bắn',duration:.65,color:'#9d202b'},
  water:{name:'Nước vỡ',duration:.8,color:'#80cbef'},
};

export function introParticles(seed){
  let state=seed>>>0;
  const random=()=>{
    state=(Math.imul(1664525,state)+1013904223)>>>0;
    return state/4294967296;
  };
  return Array.from({length:96},()=>Array.from({length:6},random));
}

export function paintIntroEffect(ctx,effect,particles,elapsed,duration){
  const size=ctx.canvas.width;
  const progress=Math.min(1,Math.max(0,elapsed/Math.max(duration,1/30)));
  const strength=effect.strength/100;
  const count=Math.round(12+64*strength);
  ctx.clearRect(0,0,size,size);
  if(!strength)return;
  ctx.fillStyle=ctx.strokeStyle=effect.color;
  ctx.lineCap='round';
  for(let index=0;index<count;index++){
    const [a,b,c,d,e,f]=particles[index];
    let x,y,radius;
    if(effect.type==='speed'){
      const radial=effect.direction==='radial';
      const phase=(a+elapsed*(2.5+strength*2+c))%1;
      const angle=b*Math.PI*2;
      const dx=radial?Math.cos(angle):effect.direction==='left'?-1:1;
      const dy=radial?Math.sin(angle):0;
      const distance=.19+phase*.58;
      x=radial?.5+dx*distance:effect.direction==='left'?1.15-phase*1.3:-.15+phase*1.3;
      y=radial?.5+dy*distance:b;
      const length=(.045+d*.16)*(.55+strength*.8);
      ctx.globalAlpha=Math.min(1,progress*20,(1-progress)*12)*(.21+e*.63);
      ctx.lineWidth=.6+f*2.3;
      ctx.beginPath();
      ctx.moveTo((x-dx*length)*size,(y-dy*length)*size);
      ctx.lineTo(x*size,y*size);
      ctx.stroke();
      continue;
    }
    if(effect.type==='fire'){
      const age=(elapsed*(1.35+c*1.2)+a)%1;
      x=.5+(b-.5)*(.17+.12*age)+Math.sin(age*8+d*6)*.045;
      y=.52-age*(.29+e*.2);
      radius=(.015+f*.046)*(1-age*.7);
      ctx.globalAlpha=(1-age)*(.35+.55*e)*Math.min(1,progress*12,(1-progress)*10);
      const glow=ctx.createRadialGradient(x*size,y*size,0,x*size,y*size,radius*size);
      glow.addColorStop(0,f>.36?'#fff1a1':effect.color);
      glow.addColorStop(.48,e>.4?effect.color:'#ff441f');
      glow.addColorStop(1,'#ff2b0000');
      ctx.fillStyle=glow;
    }else{
      const launch=index%5===0?0:a*.085;
      const age=Math.max(0,(progress-launch)/(1-launch));
      if(progress<=launch)continue;
      const angle=-Math.PI*(.08+b*.84)+(effect.direction==='left'?-.42:effect.direction==='right'?.42:0);
      const distance=(.16+c*.4)*(.65+strength*.65)*age;
      x=.5+Math.cos(angle)*distance;
      y=.52+Math.sin(angle)*distance+(.11+d*.32)*age*age;
      radius=(.002+e*.012)*(1-age*.48);
      ctx.globalAlpha=(1-age)*(.46+f*.54);
      ctx.fillStyle=effect.color;
      if(effect.type==='water'&&f>.7)ctx.fillStyle='#dff7ff';
    }
    ctx.beginPath();
    ctx.ellipse(x*size,y*size,radius*size,radius*size*(effect.type==='blood'?1.5:1),0,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha=1;
}
