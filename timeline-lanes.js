import {clipBounds,moveClipIntervals,splitLayerAt} from './model.js';
import {addSplitToGroup,removeMissingGroupMembers} from './groups.js';
export function splitSelectedLayers(project,ids,time,makeId){let out=[];for(const id of ids){let index=project.layers.findIndex(l=>l.id===id);if(index<0||project.layers[index].locked)continue;let original=project.layers[index],split=splitLayerAt(original,time,project.duration,makeId());if(!split)continue;let [left,right]=split;left.laneId=right.laneId=original.laneId||original.id;project.layers.splice(index,1,left,right);addSplitToGroup(project,id,right.id);out.push(left.id,right.id)}return out}
export function placeOnLane(project,sourceId,targetId){if(sourceId===targetId)return false;let source=project.layers.find(l=>l.id===sourceId),target=project.layers.find(l=>l.id===targetId);if(!source||!target)throw Error('Không tìm thấy layer');if(source.locked||target.locked)throw Error('Hãy mở khóa layer trước');let lane=target.laneId||target.id,members=project.layers.filter(l=>(l.laneId||l.id)===lane&&l.id!==source.id),a=clipBounds(source,project.duration);if(members.some(l=>{let b=clipBounds(l,project.duration);return a.start<b.end&&b.start<a.end}))throw Error('Các đoạn trên cùng hàng không được chồng thời gian');source.laneId=lane;target.laneId=lane;let targetGroup=(project.groups||[]).find(g=>g.layerIds.includes(target.id));for(const group of project.groups||[])group.layerIds=group.layerIds.filter(id=>id!==source.id);if(targetGroup){let index=targetGroup.layerIds.indexOf(target.id);targetGroup.layerIds.splice(index+1,0,source.id)}removeMissingGroupMembers(project);return true}

export function duplicateTimelineClips(project,ids,delta,makeId){
  const selected=new Set(ids);
  const copiesBySource=new Map();
  for(const layer of project.layers){
    if(!selected.has(layer.id)||layer.locked)continue;
    const copy=structuredClone(layer);
    copy.id=makeId();
    copy.name=copy.name.replace(/( \(bản sao\))?$/, ' (bản sao)');
    // A separate row keeps overlapping copies accessible, even for full-length clips.
    delete copy.laneId;
    copiesBySource.set(layer.id,copy);
  }
  const copies=[...copiesBySource.values()];
  if(!copies.length)return copies;
  const offset=moveClipIntervals(copies,delta,project.duration);
  for(const copy of copies){
    if(!copy.transition)continue;
    const partner=copiesBySource.get(copy.transition.partner);
    if(!partner){
      delete copy.transition;
      continue;
    }
    copy.transition.partner=partner.id;
    copy.transition.start+=offset;
    copy.transition.end+=offset;
  }
  project.layers=project.layers.flatMap(layer=>{
    const copy=copiesBySource.get(layer.id);
    if(!copy)return [layer];
    addSplitToGroup(project,layer.id,copy.id);
    return [layer,copy];
  });
  return copies;
}
