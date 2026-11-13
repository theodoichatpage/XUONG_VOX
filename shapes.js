export const shapeNames={
  line:'Đường kẻ',circle:'Hình tròn',rectangle:'Hình chữ nhật',arrow:'Mũi tên',
};

export function shapeCanvas(shape){
  const canvas=document.createElement('canvas');
  const stroke=shape.type==='line'||shape.type==='arrow';
  canvas.width=stroke?512:256;
  canvas.height=stroke?128:256;
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
