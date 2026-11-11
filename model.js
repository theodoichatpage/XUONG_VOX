export const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
// Adapted from My Motion Studio src/lib/animation.ts, MIT, Copyright (c) 2026 rodolphe37. See THIRD-PARTY-LICENSES.txt.
export function easing(t,type){switch(type){case 'linear': return t;case 'easeIn': return t*t;case 'easeOut': return 1-(1-t)*(1-t);case 'easeInOut': return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;default:return t}}
export function interpolate(a,b,t){if(typeof a==='number')return a+(b-a)*t;if(a&&typeof a==='object'){const out=Array.isArray(a)?[]:{};for(const k of Object.keys(a))out[k]=interpolate(a[k],b[k],t);return out}return a}
export function evaluate(base,keys,time){if(!keys.length)return structuredClone(base);const sorted=[...keys].sort((a,b)=>a.time-b.time);if(time<=sorted[0].time)return structuredClone(sorted[0].value);if(time>=sorted.at(-1).time)return structuredClone(sorted.at(-1).value);let i=sorted.findIndex(k=>k.time>time);let a=sorted[i-1],b=sorted[i];return interpolate(a.value,b.value,easing((time-a.time)/(b.time-a.time),b.easing))}
export const initialCamera=()=>({position:[0,0,10],rotation:[0,0,0],target:[0,0,0],fov:45});
export const newProject=()=>({version:1,name:'Dự án chưa đặt tên',duration:10,layers:[],camera:{value:initialCamera(),keys:[]}});

// Raycaster intersections are nearest-first; transparent pixels and hidden layers do not block selection.
export function firstVisibleHit(hits, isOpaque){return hits.find(hit=>hit.object.visible&&hit.object.material.opacity>0&&isOpaque(hit))||null}

export function clipBounds(layer,duration){const start=clamp(Number.isFinite(layer.clipStart)?layer.clipStart:0,0,duration);const end=clamp(Number.isFinite(layer.clipEnd)?layer.clipEnd:duration,start,duration);return {start,end}}
export function layerVisibleAt(layer,time,duration){const {start,end}=clipBounds(layer,duration);return layer.visible!==false&&time>=start&&(time<end||(end===duration&&time===duration&&start<end))}

// The third scale field is a uniform multiplier for the visible X/Y plane.
export function setScaleComponent(scale,index,value){const next=[...scale];if(index===2){const previous=Number.isFinite(next[2])&&next[2]!==0?next[2]:1;const factor=value/previous;next[0]*=factor;next[1]*=factor;next[2]=value}else next[index]=value;return next}

export function trimLayerEndAt(layer,time,duration){const {start,end}=clipBounds(layer,duration);if(!Number.isFinite(time)||time<=start||time>=end)return false;layer.clipEnd=time;return true}

export function splitLayerAt(layer,time,duration,newId){const {start,end}=clipBounds(layer,duration);if(time<=start||time>=end)return null;const left=structuredClone(layer),right=structuredClone(layer);left.clipStart=start;left.clipEnd=time;right.id=newId;right.clipStart=time;right.clipEnd=end;return [left,right]}

// Upgrade legacy whole-object keyframes to separate property tracks.
export function normalizeEntity(entity){
  entity.keys=Array.isArray(entity.keys)?entity.keys:[];entity.animated=entity.animated||{};
  const legacy=entity.keys.filter(k=>!k.property&&k.value&&typeof k.value==='object'&&!Array.isArray(k.value));
  if(!legacy.length)return entity;
  const converted=entity.keys.filter(k=>!legacy.includes(k));
  for(const prop of Object.keys(entity.value)){
    const present=legacy.filter(k=>Object.prototype.hasOwnProperty.call(k.value,prop));if(!present.length)continue;
    const values=present.map(k=>k.value[prop]),varying=values.some(v=>JSON.stringify(v)!==JSON.stringify(values[0]));
    if(varying){entity.animated[prop]=true;for(const k of present)converted.push({time:k.time,property:prop,value:structuredClone(k.value[prop]),easing:k.easing||'linear'})}
    else if(!converted.some(k=>k.property===prop)){entity.value[prop]=structuredClone(values[0]);if(entity.animated[prop]===undefined)entity.animated[prop]=false}
  }
  entity.keys=converted;return entity;
}
export function evaluateEntity(entity,time){normalizeEntity(entity);let value=structuredClone(entity.value);for(const prop of Object.keys(value)){if(entity.animated[prop]){let keys=entity.keys.filter(k=>k.property===prop);if(keys.length)value[prop]=evaluate(value[prop],keys,time)}}return value}
export function putPropertyKey(entity,prop,time,value,ease='linear'){normalizeEntity(entity);let key=entity.keys.find(k=>k.property===prop&&Math.abs(k.time-time)<.017);if(key){key.value=structuredClone(value);return key}key={property:prop,time,value:structuredClone(value),easing:ease};entity.keys.push(key);return key}
export function editEntity(entity,time,update,ease='linear'){normalizeEntity(entity);const before=evaluateEntity(entity,time),after=structuredClone(before);update(after);const keys=[];for(const prop of Object.keys(after)){if(JSON.stringify(after[prop])===JSON.stringify(before[prop]))continue;if(entity.animated[prop])keys.push(putPropertyKey(entity,prop,time,after[prop],ease));else entity.value[prop]=structuredClone(after[prop])}return keys}
export function toggleProperty(entity,prop,time,ease='linear'){normalizeEntity(entity);const value=evaluateEntity(entity,time)[prop];if(entity.animated[prop]){entity.value[prop]=structuredClone(value);entity.animated[prop]=false;return false}entity.animated[prop]=true;putPropertyKey(entity,prop,time,value,ease);return true}

// Duplicate without altering originals or silently overwriting a key at the destination.
export function duplicatePropertyKeys(entries,delta,duration){
  if(!entries.length||Math.abs(delta)<1/60)return {copies:[],error:'no-movement'};
  const copies=[];
  for(const {entity,key} of entries){const time=key.time+delta;if(time<0||time>duration)return {copies:[],error:'out-of-range'};if(entity.keys.some(k=>k.property===key.property&&Math.abs(k.time-time)<.017))return {copies:[],error:'collision'};copies.push({entity,key:{...structuredClone(key),time}})}
  for(const entry of copies)entry.entity.keys.push(entry.key);return {copies:copies.map(entry=>entry.key),error:null};
}

export function isEasedKey(key){return ['easeIn','easeOut','easeInOut'].includes(key?.easing)}

// Resize selected end edges by one common delta, preserving their relative timing.
export function resizeClipEnds(entries,delta,duration){if(!entries.length||!Number.isFinite(delta))return 0;const lower=Math.max(...entries.map(e=>e.start+1/30-e.end));const upper=Math.min(...entries.map(e=>(Number.isFinite(e.maxEnd)?Math.min(duration,e.maxEnd):duration)-e.end));delta=clamp(delta,lower,upper);for(const e of entries)e.item.clipEnd=e.end+delta;return delta}
export function moveClipIntervals(layers,delta,duration){if(!layers.length||!Number.isFinite(delta))return 0;const bounds=layers.map(l=>clipBounds(l,duration));delta=clamp(delta,-Math.min(...bounds.map(b=>b.start)),duration-Math.max(...bounds.map(b=>b.end)));if(Math.abs(delta)<1e-9)return 0;layers.forEach((layer,i)=>{layer.clipStart=bounds[i].start+delta;layer.clipEnd=bounds[i].end+delta;for(const key of layer.keys||[])key.time+=delta});return delta}
export function moveLayerPositions(entries,delta,time,ease='linear'){for(const {layer,position} of entries)editEntity(layer,time,value=>{value.position=position.map((v,i)=>v+delta[i])},ease)}
