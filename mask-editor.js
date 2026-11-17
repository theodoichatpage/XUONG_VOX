import {Matrix4,Plane,Ray,Raycaster,Vector2,Vector3} from 'three';
import {effectDefaults,maskOutline} from './layer-effects.js';

export function createMaskEditor({getLayer,getMesh,redraw,commit,refresh}){
  const raycaster=new Raycaster();
  const plane=new Plane(new Vector3(0,0,1),0);
  const inverse=new Matrix4();
  const ray=new Ray();
  const point=new Vector3();
  const views=[];
  let draft=null,drag=null;

  function currentDraft(){
    return draft?.layer===getLayer()?draft:null;
  }

  function begin(layer){
    draft={layer,points:[]};
    refresh();
    redraw();
  }

  function cancel(){
    draft=null;
    refresh();
    redraw();
  }

  function finish(){
    const pending=currentDraft();
    if(!pending||pending.points.length<3)return;
    const {layer,points}=pending;
    draft=null;
    commit(layer,{...effectDefaults,...layer.effects,mask:'pen',points,x:0,y:0});
  }

  function maskHit(event,canvas,camera,mesh){
    const rect=canvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return null;
    const pointer=new Vector2((event.clientX-rect.left)/rect.width*2-1,1-(event.clientY-rect.top)/rect.height*2);
    mesh.updateWorldMatrix(true,false);
    camera.updateWorldMatrix(true,false);
    raycaster.setFromCamera(pointer,camera);
    inverse.copy(mesh.matrixWorld).invert();
    ray.copy(raycaster.ray).applyMatrix4(inverse);
    if(!ray.intersectPlane(plane,point))return null;
    const {width,height}=mesh.geometry.parameters;
    const {repeat,offset}=mesh.material.map;
    return [(.5+point.x/width)*repeat.x+offset.x,1-((.5+point.y/height)*repeat.y+offset.y)];
  }

  function attach(canvas,getCamera){
    const overlay=document.createElement('canvas');
    overlay.className='mask-editor-overlay';
    overlay.setAttribute('aria-hidden','true');
    overlay.hidden=true;
    const context=overlay.getContext('2d');
    views.push({canvas,overlay,context,getCamera});

    function consume(event){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    canvas.addEventListener('pointerdown',event=>{
      if(event.button!==0||!event.isPrimary||drag)return;
      const layer=getLayer(),mesh=layer&&getMesh(layer);
      if(!mesh?.visible||layer.locked)return;
      const pending=currentDraft();
      const effects={...effectDefaults,...layer.effects};
      if(!pending&&effects.mask==='none')return;
      const uv=maskHit(event,canvas,getCamera(),mesh);
      if(!uv)return;
      if(pending){
        if(uv.every(value=>value>=0&&value<=1)){
          const last=pending.points.at(-1);
          if(!last||Math.hypot(last[0]-uv[0],last[1]-uv[1])>.001){
            pending.points.push(uv);
            refresh();
            redraw();
          }
        }
        consume(event);
        return;
      }

      const outline=maskOutline(effects);
      if(!outline.length)return;
      const path=new Path2D();
      outline.forEach(([u,v],index)=>index?path.lineTo(u,v):path.moveTo(u,v));
      path.closePath();
      context.save();
      context.resetTransform();
      context.lineWidth=.025;
      const inside=context.isPointInPath(path,...uv,'evenodd')||context.isPointInStroke(path,...uv);
      context.restore();
      if(!inside)return;
      drag={id:event.pointerId,canvas,layer,mesh,uv,effects,original:layer.effects};
      canvas.setPointerCapture(event.pointerId);
      consume(event);
    },true);

    canvas.addEventListener('pointermove',event=>{
      if(drag?.canvas!==canvas||drag.id!==event.pointerId)return;
      consume(event);
      const uv=maskHit(event,canvas,getCamera(),drag.mesh);
      if(!uv)return;
      const shift=axis=>Math.max(-100,Math.min(100,Math.round((drag.effects[axis?'y':'x']+(uv[axis]-drag.uv[axis])*100)*10)/10));
      const x=shift(0),y=shift(1);
      if(x===drag.layer.effects.x&&y===drag.layer.effects.y)return;
      drag.layer.effects={...drag.effects,x,y};
      redraw(true);
    },true);

    function end(event){
      if(drag?.canvas!==canvas||drag.id!==event.pointerId)return;
      consume(event);
      const {layer,original}=drag;
      drag=null;
      if(layer.effects===original)return;
      if(event.type==='pointerup')commit(layer,layer.effects);
      else{
        layer.effects=original;
        redraw(true);
      }
    }
    for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,end,true);
  }

  function render(){
    const layer=getLayer(),mesh=layer&&getMesh(layer);
    if(draft&&!currentDraft())draft=null;
    const pending=currentDraft();
    const points=pending?.points??(layer?maskOutline({...effectDefaults,...layer.effects}):[]);
    for(const {canvas,overlay,context,getCamera} of views){
      canvas.classList.toggle('mask-pen-active',!!pending);
      overlay.hidden=!mesh?.visible||!points.length;
      if(overlay.hidden)continue;
      if(overlay.parentNode!==canvas.parentNode)canvas.after(overlay);
      const width=canvas.clientWidth,height=canvas.clientHeight;
      if(!width||!height)continue;
      if(overlay.width!==width||overlay.height!==height){
        overlay.width=width;
        overlay.height=height;
      }
      context.clearRect(0,0,width,height);
      const camera=getCamera();
      const geometry=mesh.geometry.parameters;
      const {repeat,offset}=mesh.material.map;
      if(!repeat.x||!repeat.y)continue;
      const pixels=points.map(([u,v])=>{
        point.set(((u-offset.x)/repeat.x-.5)*geometry.width,((1-v-offset.y)/repeat.y-.5)*geometry.height,0);
        point.applyMatrix4(mesh.matrixWorld).project(camera);
        return [(point.x+1)*width/2,(1-point.y)*height/2];
      });
      context.strokeStyle='#38a7ff';
      context.fillStyle='#38a7ff';
      context.lineWidth=2;
      context.setLineDash([6,4]);
      context.beginPath();
      pixels.forEach(([x,y],index)=>index?context.lineTo(x,y):context.moveTo(x,y));
      if(!pending)context.closePath();
      context.stroke();
      if(pending){
        context.setLineDash([]);
        for(const [x,y] of pixels){
          context.beginPath();
          context.arc(x,y,4,0,Math.PI*2);
          context.fill();
        }
      }
    }
  }

  return {attach,render,begin,cancel,finish,currentDraft};
}
