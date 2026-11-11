export const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
// Adapted from My Motion Studio src/lib/animation.ts, MIT, Copyright (c) 2026 rodolphe37. See THIRD-PARTY-LICENSES.txt.
export function easing(t,type){switch(type){case 'linear': return t;case 'easeIn': return t*t;case 'easeOut': return 1-(1-t)*(1-t);case 'easeInOut': return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;default:return t}}
export function interpolate(a,b,t){if(typeof a==='number')return a+(b-a)*t;if(a&&typeof a==='object'){const out=Array.isArray(a)?[]:{};for(const k of Object.keys(a))out[k]=interpolate(a[k],b[k],t);return out}return a}
export function evaluate(base,keys,time){if(!keys.length)return structuredClone(base);const sorted=[...keys].sort((a,b)=>a.time-b.time);if(time<=sorted[0].time)return structuredClone(sorted[0].value);if(time>=sorted.at(-1).time)return structuredClone(sorted.at(-1).value);let i=sorted.findIndex(k=>k.time>time);let a=sorted[i-1],b=sorted[i];return interpolate(a.value,b.value,easing((time-a.time)/(b.time-a.time),b.easing))}
export const initialCamera=()=>({position:[0,0,10],rotation:[0,0,0],target:[0,0,0],fov:45});
export const newProject=()=>({version:1,duration:10,layers:[],camera:{value:initialCamera(),keys:[]}});
