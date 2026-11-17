// Presets with the same name in the same project represent one saved state.
const identity=p=>JSON.stringify([(p.projectName||'Dự án chưa đặt tên').trim().toLocaleLowerCase('vi'),(p.name||'').trim().toLocaleLowerCase('vi')]);
export function mergePresets(items){const seen=new Set(),result=[];for(let i=items.length-1;i>=0;i--){const key=identity(items[i]);if(!seen.has(key)){seen.add(key);result.push(items[i])}}return result.reverse()}
export function savePreset(items,preset){return mergePresets([...items,preset])}

export function textPresetState(preset,currentText,duration,defaults){const text={...defaults,...structuredClone(preset.text),content:currentText,annotationStart:null,annotationEnd:null};const animated=structuredClone(preset.animated||{}),keys=structuredClone(preset.keys||[]).map(k=>({...k,time:Math.max(0,Math.min(duration,k.time*duration/(preset.duration||duration)))}));return {text,animated,keys}}
