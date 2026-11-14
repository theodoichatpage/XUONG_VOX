export const effectDefaults={
  mask:'none',width:80,height:80,x:0,y:0,invert:false,
  shadow:false,color:'#000000',opacity:60,blur:12,distance:12,angle:45,
};

export function paintLayerEffects(image,effects){
  const width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
  const canvas=document.createElement('canvas');
  canvas.width=width;
  canvas.height=height;
  const ctx=canvas.getContext('2d');
  ctx.drawImage(image,0,0);
  if(effects.mask!=='none'){
    const x=width*(.5+effects.x/100),y=height*(.5+effects.y/100);
    const w=width*effects.width/100,h=height*effects.height/100;
    ctx.globalCompositeOperation=effects.invert?'destination-out':'destination-in';
    const mask=document.createElement('canvas');
    mask.width=width;
    mask.height=height;
    const path=mask.getContext('2d');
    path.beginPath();
    if(effects.mask==='ellipse')path.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);
    else path.rect(x-w/2,y-h/2,w,h);
    path.fill();
    ctx.drawImage(mask,0,0);
    ctx.globalCompositeOperation='source-over';
  }
  return canvas;
}

export function paintLayerShadow(image,effects,maxTextureSize){
  const scale=Math.min(1,Math.floor(maxTextureSize/2)/Math.max(image.width,image.height));
  const width=Math.max(1,Math.round(image.width*scale)),height=Math.max(1,Math.round(image.height*scale));
  const unit=Math.max(width,height)/512;
  const distance=effects.distance*unit,blur=effects.blur*unit;
  const padding=Math.ceil(distance+blur*3)+2;
  const canvas=document.createElement('canvas');
  canvas.width=width+2*padding;
  canvas.height=height+2*padding;
  const ctx=canvas.getContext('2d');
  const angle=effects.angle*Math.PI/180;
  // Draw the source off-canvas so only its shadow lands inside the texture.
  ctx.shadowColor=effects.color+Math.round(effects.opacity*255/100).toString(16).padStart(2,'0');
  ctx.shadowBlur=blur;
  ctx.shadowOffsetX=canvas.width+distance*Math.cos(angle);
  ctx.shadowOffsetY=distance*Math.sin(angle);
  ctx.drawImage(image,padding-canvas.width,padding,width,height);
  return {canvas,scaleX:canvas.width/width,scaleY:canvas.height/height};
}
