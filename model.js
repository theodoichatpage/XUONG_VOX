export const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
// Adapted from My Motion Studio src/lib/animation.ts, MIT, Copyright (c) 2026 rodolphe37. See THIRD-PARTY-LICENSES.txt.
export function easing(t,type){switch(type){case 'linear': return t;case 'easeIn': return t*t;case 'easeOut': return 1-(1-t)*(1-t);case 'easeInOut': return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;default:return t}}
export function interpolate(a,b,t){if(typeof a==='number')return a+(b-a)*t;if(a&&typeof a==='object'){const out=Array.isArray(a)?[]:{};for(const k of Object.keys(a))out[k]=interpolate(a[k],b[k],t);return out}return a}
export function evaluate(base,keys,time){if(!keys.length)return structuredClone(base);const sorted=[...keys].sort((a,b)=>a.time-b.time);if(time<=sorted[0].time)return structuredClone(sorted[0].value);if(time>=sorted.at(-1).time)return structuredClone(sorted.at(-1).value);let i=sorted.findIndex(k=>k.time>time);let a=sorted[i-1],b=sorted[i];return interpolate(a.value,b.value,easing((time-a.time)/(b.time-a.time),b.easing))}
export const initialCamera=()=>({position:[0,0,10],rotation:[0,0,0],target:[0,0,0],fov:45});
export const newProject=()=>({version:1,duration:10,layers:[],camera:{value:initialCamera(),keys:[]}});

// Raycaster intersections are nearest-first; transparent pixels and hidden layers do not block selection.
export function firstVisibleHit(hits, isOpaque){return hits.find(hit=>hit.object.visible&&hit.object.material.opacity>0&&isOpaque(hit))||null}

export function clipBounds(layer,duration){const start=clamp(Number.isFinite(layer.clipStart)?layer.clipStart:0,0,duration);const end=clamp(Number.isFinite(layer.clipEnd)?layer.clipEnd:duration,start,duration);return {start,end}}
export function layerVisibleAt(layer,time,duration){const {start,end}=clipBounds(layer,duration);return layer.visible!==false&&time>=start&&(time<end||(end===duration&&time===duration&&start<end))}

// The third scale field is a uniform multiplier for the visible X/Y plane.
export function setScaleComponent(scale,index,value){const next=[...scale];if(index===2){const previous=Number.isFinite(next[2])&&next[2]!==0?next[2]:1;const factor=value/previous;next[0]*=factor;next[1]*=factor;next[2]=value}else next[index]=value;return next}
