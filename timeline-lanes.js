import {clipBounds,moveClipIntervals,splitLayerAt} from './model.js';
import {addSplitToGroup,removeMissingGroupMembers} from './groups.js';
export function splitSelectedLayers(project,ids,time,makeId){let out=[];for(const id of ids){let index=project.layers.findIndex(l=>l.id===id);if(index<0||project.layers[index].locked)continue;let original=project.layers[index],split=splitLayerAt(original,time,project.duration,makeId());if(!split)continue;let [left,right]=split;left.laneId=right.laneId=original.laneId||original.id;project.layers.splice(index,1,left,right);addSplitToGroup(project,id,right.id);out.push(left.id,right.id)}return out}
export function placeOnLane(project,sourceId,targetId){if(sourceId===targetId)return false;let source=project.layers.find(l=>l.id===sourceId),target=project.layers.find(l=>l.id===targetId);if(!source||!target)throw Error('Không tìm thấy layer');if(source.locked||target.locked)throw Error('Hãy mở khóa layer trước');let lane=target.laneId||target.id,members=project.layers.filter(l=>(l.laneId||l.id)===lane&&l.id!==source.id),a=clipBounds(source,project.duration);if(members.some(l=>{let b=clipBounds(l,project.duration);return a.start<b.end&&b.start<a.end}))throw Error('Các đoạn trên cùng hàng không được chồng thời gian');source.laneId=lane;target.laneId=lane;let targetGroup=(project.groups||[]).find(g=>g.layerIds.includes(target.id));for(const group of project.groups||[])group.layerIds=group.layerIds.filter(id=>id!==source.id);if(targetGroup){let index=targetGroup.layerIds.indexOf(target.id);targetGroup.layerIds.splice(index+1,0,source.id)}removeMissingGroupMembers(project);return true}

const EDGE_EPSILON=1e-8;

export function laneNeighbors(project,item,excluded=new Set()){
  if(item===project.audio)return [];
  const lane=item.laneId||item.id;
  return project.layers
    .filter(other=>other!==item&&!excluded.has(other)&&(other.laneId||other.id)===lane)
    .map(other=>clipBounds(other,project.duration));
}

export function clipPlacement(project,items,duplicate){
  const moving=new Set(items);
  const entries=items.map(item=>({item,...clipBounds(item,project.duration)}));
  const limits={min:-Math.min(...entries.map(e=>e.start)),max:project.duration-Math.max(...entries.map(e=>e.end))};
  const obstacles=[];
  for(const entry of entries){
    const neighbors=laneNeighbors(project,entry.item,duplicate?undefined:moving);
    if(duplicate)neighbors.push({start:entry.start,end:entry.end});
    for(const neighbor of neighbors){
      if(neighbor.end>neighbor.start&&entry.end>entry.start){
        obstacles.push({min:neighbor.start-entry.end,max:neighbor.end-entry.start});
      }
    }
  }
  return {...limits,obstacles};
}

export function fitClipOffset({min,max,obstacles},requested,snapDistance=0){
  const legal=delta=>delta>=min-EDGE_EPSILON&&delta<=max+EDGE_EPSILON&&
    obstacles.every(block=>delta<=block.min+EDGE_EPSILON||delta>=block.max-EDGE_EPSILON);
  const target=Math.max(min,Math.min(max,requested));
  const edges=obstacles.flatMap(block=>[block.min,block.max]);
  const candidates=legal(target)?edges.filter(edge=>Math.abs(edge-target)<=snapDistance):[...edges,min,max];
  const closest=candidates.reduce((best,edge)=>legal(edge)&&(best===null||Math.abs(edge-target)<Math.abs(best-target))?edge:best,null);
  return closest??(legal(target)?target:null);
}

export function exactClipEdge(value,neighbors,edge){
  return neighbors.find(bounds=>Math.abs(bounds[edge]-value)<EDGE_EPSILON)?.[edge]??value;
}

export function duplicateTimelineClips(project,ids,delta,makeId){
  const selected=new Set(ids);
  const sources=project.layers.filter(layer=>selected.has(layer.id)&&!layer.locked);
  if(!sources.length)return [];
  const offset=fitClipOffset(clipPlacement(project,sources,true),delta);
  if(offset===null)return [];
  const copiesBySource=new Map();
  for(const layer of sources){
    const copy=structuredClone(layer);
    copy.id=makeId();
    copy.name=copy.name.replace(/( \(bản sao\))?$/, ' (bản sao)');
    copy.laneId=layer.laneId||layer.id;
    copiesBySource.set(layer.id,copy);
  }
  const copies=[...copiesBySource.values()];
  moveClipIntervals(copies,offset,project.duration);
  for(const source of sources){
    const copy=copiesBySource.get(source.id);
    const neighbors=[clipBounds(source,project.duration),...laneNeighbors(project,source)];
    copy.clipStart=exactClipEdge(copy.clipStart,neighbors,'end');
    copy.clipEnd=exactClipEdge(copy.clipEnd,neighbors,'start');
  }
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
