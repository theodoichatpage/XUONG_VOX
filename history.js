// Reuse large media strings across undo snapshots instead of copying them on every edit.
export class ProjectHistory {
  constructor(initial, limit = 30) { this.assets=new Map();this.assetValues=[];this.states=[this.snapshot(initial)];this.index=0;this.limit=limit;this.group=false;this.groupChanged=false; }
  snapshot(project){return JSON.stringify(project,(_key,value)=>{if(typeof value!=='string'||!value.startsWith('data:')||value.length<1024)return value;let id=this.assets.get(value);if(id===undefined){id=this.assetValues.length;this.assets.set(value,id);this.assetValues.push(value)}return '\u0001voxasset:'+id})}
  restore(snapshot){return JSON.parse(snapshot,(_key,value)=>{if(typeof value==='string'&&/^\u0001voxasset:\d+$/.test(value)){let id=Number(value.slice(10));if(this.assetValues[id]!==undefined)return this.assetValues[id]}return value})}
  begin() { this.group = true; this.groupChanged = false; }
  end() { this.group = false; this.groupChanged = false; }
  record(project) {const snapshot=this.snapshot(project);if(snapshot===this.states[this.index])return;if(this.group&&this.groupChanged)this.states[this.index]=snapshot;else{this.states.splice(this.index+1);this.states.push(snapshot);if(this.states.length>this.limit)this.states.shift();this.index=this.states.length-1;if(this.group)this.groupChanged=true}}
  undo() { if (this.index === 0) return null; this.end(); return this.restore(this.states[--this.index]); }
  redo() { if (this.index >= this.states.length - 1) return null; this.end(); return this.restore(this.states[++this.index]); }
}
