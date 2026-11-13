// Copy pixels at their native size. Only the overlap uses an alpha gradient.
export function createImageStrip(first,second,{tiles,edgePercent,mode,overlap,offset,maxSize}){
  const a={width:first.naturalWidth,height:first.naturalHeight};
  const b=second?{width:second.naturalWidth,height:second.naturalHeight}:null;
  const bridge=mode==='bridge'&&b?a.width:0;
  const blend=b?Math.min(overlap,a.width-1,b.width-1):0;
  const top=b?Math.min(0,offset):0;
  const width=b?a.width+bridge+b.width-blend:a.width*(tiles+1);
  const height=b?Math.max(a.height,offset+b.height)-top:a.height;
  if(width>maxSize||height>maxSize||width*height>32_000_000){
    throw Error('Dải ảnh vượt giới hạn kích thước. Hãy giảm số ô hoặc chọn ảnh nhỏ hơn.');
  }

  const canvas=document.createElement('canvas');
  canvas.width=width;
  canvas.height=height;
  const context=canvas.getContext('2d');
  if(!context)throw Error('Không tạo được dải ảnh.');
  context.drawImage(first,0,-top);

  function extend(start,length){
    const sample=Math.max(1,Math.round(a.width*edgePercent/100));
    for(let x=0;x<length;x+=sample){
      const size=Math.min(sample,length-x);
      const flip=(x/sample)%2===0;
      context.save();
      context.translate(start+x+(flip?size:0),-top);
      if(flip)context.scale(-1,1);
      const sourceX=flip?a.width-size:a.width-sample;
      context.drawImage(first,sourceX,0,size,a.height,0,0,size,a.height);
      context.restore();
    }
  }

  if(!b){
    extend(a.width,width-a.width);
  }else{
    if(bridge)extend(a.width,bridge);
    const x=a.width+bridge-blend;
    context.drawImage(second,blend,0,b.width-blend,b.height,x+blend,offset-top,b.width-blend,b.height);
    if(blend){
      const seam=document.createElement('canvas');
      seam.width=blend;
      seam.height=b.height;
      const mix=seam.getContext('2d');
      mix.drawImage(second,0,0);
      mix.globalCompositeOperation='destination-in';
      const gradient=mix.createLinearGradient(0,0,blend,0);
      gradient.addColorStop(0,'transparent');
      gradient.addColorStop(1,'black');
      mix.fillStyle=gradient;
      mix.fillRect(0,0,blend,b.height);
      context.drawImage(seam,x,offset-top);
    }
  }
  return {canvas,top};
}
