import {normalizeEntity} from './model.js';
export function groupLayers(project,ids,id){const selected=new Set(ids),valid=project.layers.filter(l=>selected.has(l.id)).map(l=>l.id);if(valid.length<2)return null;const groups=Array.isArray(project.groups)?project.groups:[];for(const g of groups)g.layerIds=(g.layerIds||[]).filter(layerId=>!selected.has(layerId));project.groups=groups.filter(g=>g.layerIds.length);let i=1;while(project.groups.some(g=>g.name==='Nhóm '+i))i++;const group={id,name:'Nhóm '+i,layerIds:valid,collapsed:false};project.groups.push(group);return group}
export function ungroupLayers(project,id){project.groups=(project.groups||[]).filter(g=>g.id!==id)}
export function addSplitToGroup(project,sourceId,newId){for(const group of project.groups||[]){let index=group.layerIds.indexOf(sourceId);if(index>=0)group.layerIds.splice(index+1,0,newId)}}
export function removeMissingGroupMembers(project){const ids=new Set(project.layers.map(l=>l.id));for(const layer of project.layers)if(layer.transition?.partner&&!ids.has(layer.transition.partner))delete layer.transition;for(const group of project.groups||[])group.layerIds=group.layerIds.filter(id=>ids.has(id));project.groups=(project.groups||[]).filter(group=>group.layerIds.length)}
export function reorderLayer(project,sourceId,targetId,after=false){if(sourceId===targetId)return false;let from=project.layers.findIndex(x=>x.id===sourceId),target=project.layers.find(x=>x.id===targetId);if(from<0||!target)return false;const source=project.layers.splice(from,1)[0],to=project.layers.findIndex(x=>x.id===targetId);project.layers.splice(to+(after?1:0),0,source);const targetGroup=(project.groups||[]).find(g=>g.layerIds.includes(targetId));for(const group of project.groups||[])group.layerIds=group.layerIds.filter(id=>id!==sourceId);if(targetGroup){let index=targetGroup.layerIds.indexOf(targetId);targetGroup.layerIds.splice(index+(after?1:0),0,sourceId)}removeMissingGroupMembers(project);return true}

export function isGraphicTemplate(group){
  return group.historyLine||group.brushTitle||group.name==='Dòng lịch sử';
}

export function scaleGraphicTemplate(group,layers,percent){
  const previous=group.scalePercent??100;
  if(!Number.isFinite(percent)||percent<1||percent>1000||percent===previous||
    !layers.length||layers.some(layer=>layer.locked))return false;
  for(const layer of layers)normalizeEntity(layer);
  const anchor=layers.find(layer=>group.brushTitle?layer.shape?.type==='brush':layer.shape?.type==='arrow')||layers[0];
  const pivot=[...anchor.value.position];
  const ratio=percent/previous;
  const transform=(property,value)=>property==='position'
    ?value.map((coordinate,index)=>pivot[index]+(coordinate-pivot[index])*ratio)
    :value.map((coordinate,index)=>index===2?coordinate:coordinate*ratio);
  for(const layer of layers){
    for(const property of ['position','scale'])layer.value[property]=transform(property,layer.value[property]);
    for(const key of layer.keys){
      if(key.property==='position'||key.property==='scale')key.value=transform(key.property,key.value);
    }
  }
  group.scalePercent=percent;
  return true;
}
