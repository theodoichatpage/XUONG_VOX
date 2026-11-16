export const shapeNames={
  line:'Đường kẻ',circle:'Hình tròn',rectangle:'Hình chữ nhật',arrow:'Mũi tên',
};

export function shapeCanvas(shape){
  const canvas=document.createElement('canvas');
  const stroke=shape.type==='line'||shape.type==='arrow';
  const brush=shape.type==='brush';
  canvas.width=stroke?512:256;
  canvas.height=brush?512:stroke?128:256;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=ctx.strokeStyle=shape.color;
  if(stroke){
    const tip=shape.type==='arrow';
    ctx.lineWidth=shape.thickness;
    if(shape.dashed)ctx.setLineDash([24,14]);
    ctx.beginPath();
    ctx.moveTo(0,64);
    ctx.lineTo(tip?472:512,64);
    ctx.stroke();
    if(tip){
      ctx.beginPath();
      ctx.moveTo(512,64);
      ctx.lineTo(458,64-shape.thickness);
      ctx.lineTo(458,64+shape.thickness);
      ctx.closePath();
      ctx.fill();
    }
  }else if(brush){
    paintBrush(ctx);
  }else if(shape.type==='circle'){
    ctx.beginPath();
    ctx.arc(128,128,127,0,Math.PI*2);
    ctx.fill();
  }else ctx.fillRect(0,0,256,256);
  return canvas;
}

export function popScale(elapsed,duration){
  const progress=Math.max(0,Math.min(1,elapsed/duration));
  return progress<.65?.85+.2*progress/.65:1.05-.05*(progress-.65)/.35;
}

// A fixed seed keeps the bristle pattern in place when changing the paint color.
function paintBrush(ctx){
  let seed=29;
  const random=()=>{
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    return seed/4294967296;
  };
  ctx.beginPath();
  ctx.moveTo(28,92);
  ctx.bezierCurveTo(41,78,52,62,69,66);
  ctx.bezierCurveTo(104,55,105,37,129,43);
  ctx.bezierCurveTo(161,53,178,69,221,81);
  ctx.lineTo(231,427);
  ctx.bezierCurveTo(179,453,163,474,123,468);
  ctx.bezierCurveTo(77,461,59,442,25,431);
  ctx.closePath();
  ctx.fill();

  for(let i=0;i<800;i++){
    const x=15+random()*224;
    const edge=Math.abs(x-126)/112;
    const top=12+74*edge+random()*64;
    const bottom=500-51*edge-random()*65;
    ctx.globalAlpha=.15+random()*.55;
    ctx.lineWidth=.5+random()*2.6;
    ctx.beginPath();
    ctx.moveTo(x,top);
    ctx.bezierCurveTo(x+random()*15-7,182,x+random()*17-8,335,x-3,bottom);
    ctx.stroke();
  }

  ctx.globalCompositeOperation='destination-out';
  for(let i=0;i<360;i++){
    const y=26+random()*464;
    const nearEdge=y<100||y>424;
    const x=nearEdge?15+random()*226:random()<.5?15+random()*31:210+random()*31;
    ctx.globalAlpha=.2+random()*.55;
    ctx.fillRect(x,y,1+random()*7,.5+random()*3);
  }
  ctx.globalCompositeOperation='source-over';
  ctx.globalAlpha=1;
}
