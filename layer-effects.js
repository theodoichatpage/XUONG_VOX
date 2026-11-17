export const effectDefaults={
  mask:'none',width:80,height:80,x:0,y:0,invert:false,feather:0,
  shadow:false,color:'#000000',opacity:60,blur:12,distance:12,angle:45,
};

export function maskOutline(effects){
  const {mask,width,height,x,y}=effects;
  const cx=.5+x/100,cy=.5+y/100;
  const rx=width/200,ry=height/200;
  if(mask==='pen')return (effects.points||[]).map(([u,v])=>[u+x/100,v+y/100]);
  if(mask==='ellipse')return Array.from({length:96},(_,index)=>{
    const angle=index*Math.PI*2/96;
    return [cx+rx*Math.cos(angle),cy+ry*Math.sin(angle)];
  });
  if(mask==='rectangle')return [[cx-rx,cy-ry],[cx+rx,cy-ry],[cx+rx,cy+ry],[cx-rx,cy+ry]];
  return [];
}

export function paintLayerEffects(image,effects){
  const width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
  const canvas=document.createElement('canvas');
  canvas.width=width;
  canvas.height=height;
  const ctx=canvas.getContext('2d');
  ctx.drawImage(image,0,0);
  if(effects.mask==='none'||(effects.mask==='pen'&&(effects.points?.length??0)<3))return canvas;

  const settings={...effectDefaults,...effects};
  const mask=document.createElement('canvas');
  mask.width=width;
  mask.height=height;
  const path=mask.getContext('2d');
  const radius=Math.min(width,height)*settings.feather/200;
  if(radius>0)path.filter='blur('+radius+'px)';
  path.beginPath();
  if(settings.mask==='ellipse'){
    const x=width*(.5+settings.x/100),y=height*(.5+settings.y/100);
    path.ellipse(x,y,width*settings.width/200,height*settings.height/200,0,0,Math.PI*2);
  }else{
    for(const [u,v] of maskOutline(settings))path.lineTo(u*width,v*height);
    path.closePath();
  }
  path.fill('evenodd');
  ctx.globalCompositeOperation=settings.invert?'destination-out':'destination-in';
  ctx.drawImage(mask,0,0);
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
