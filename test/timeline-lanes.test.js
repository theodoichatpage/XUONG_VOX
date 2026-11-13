import {test} from 'node:test';import assert from 'node:assert/strict';import {splitSelectedLayers,placeOnLane,duplicateTimelineClips,clipPlacement,fitClipOffset} from '../timeline-lanes.js';
test('splits selected clips without losing animation and selects both pieces',()=>{let p={duration:10,layers:[{id:'a',clipStart:0,clipEnd:10,keys:[{time:7,property:'opacity',value:.5}]},{id:'b',keys:[]}],groups:[{id:'g',layerIds:['a']}]};let result=splitSelectedLayers(p,['a'],4,()=> 'right');assert.deepEqual(result,['a','right']);assert.equal(p.layers.length,3);assert.equal(p.layers[0].clipEnd,4);assert.equal(p.layers[1].clipStart,4);assert.deepEqual(p.layers[1].keys,p.layers[0].keys);assert.equal(p.layers[0].laneId,p.layers[1].laneId);assert.deepEqual(p.groups[0].layerIds,['a','right'])});
test('two non-overlapping objects can share a timeline lane',()=>{let p={duration:10,layers:[{id:'a',clipStart:0,clipEnd:3},{id:'b',clipStart:3,clipEnd:6}]};assert.equal(placeOnLane(p,'a','b'),true);assert.equal(p.layers[0].laneId,p.layers[1].laneId)});
test('refuses overlapping objects on a lane without modifying either',()=>{let p={duration:10,layers:[{id:'a',clipStart:0,clipEnd:4},{id:'b',clipStart:3,clipEnd:6}]};assert.throws(()=>placeOnLane(p,'a','b'),/chồng/);assert.equal(p.layers[0].laneId,undefined)});
test('locked layers cannot be split or moved to a different lane',()=>{let p={duration:10,layers:[{id:'a',clipStart:0,clipEnd:4,locked:true,keys:[]},{id:'b',clipStart:4,clipEnd:8,keys:[]}]};assert.deepEqual(splitSelectedLayers(p,['a'],2,()=> 'x'),[]);assert.throws(()=>placeOnLane(p,'a','b'),/khóa/);assert.equal(p.layers.length,2)});

test('duplicates clips with a shared time offset and independent keyframes on the same rows',()=>{
  const a={id:'a',name:'A',laneId:'lane',clipStart:1,clipEnd:4,keys:[{time:2,property:'position',value:[1,2,3]}]};
  const b={id:'b',name:'B',clipStart:2,clipEnd:5,keys:[]};
  const locked={id:'locked',name:'Locked',locked:true};
  const project={duration:10,layers:[a,b,locked],groups:[{id:'group',layerIds:['a','b']}]};
  const ids=['a-copy','b-copy'];
  const [first,second]=duplicateTimelineClips(project,['a','b','locked'],2,()=>ids.shift());
  assert.deepEqual(project.layers.map(layer=>layer.id),['a','a-copy','b','b-copy','locked']);
  assert.deepEqual(project.groups[0].layerIds,['a','a-copy','b','b-copy']);
  assert.deepEqual([first.clipStart,first.clipEnd,second.clipStart,second.clipEnd],[4,7,5,8]);
  assert.equal(first.laneId,'lane');
  assert.equal(second.laneId,'b');
  assert.equal(first.keys[0].time,5);
  first.keys[0].value[0]=99;
  assert.deepEqual(a.keys[0],{time:2,property:'position',value:[1,2,3]});
  assert.equal(a.clipStart,1);
});

test('rejects duplicating a full-length clip when there is no room on its row',()=>{
  const original={id:'a',name:'A',keys:[{time:5}]};
  const project={duration:10,layers:[original]};
  assert.deepEqual(duplicateTimelineClips(project,['a'],2,()=> 'copy'),[]);
  assert.deepEqual(project.layers,[original]);
});

test('copied transitions refer to the copied pair and move with its clips',()=>{
  const outgoing={id:'a',name:'A',clipEnd:6,transition:{type:'fade',role:'out',start:3,end:4,partner:'b'}};
  const incoming={id:'b',name:'B',clipStart:2,clipEnd:7,transition:{type:'fade',role:'in',start:3,end:4,partner:'a'}};
  const project={duration:14,layers:[outgoing,incoming]};
  const ids=['copy-a','copy-b'];
  const [a,b]=duplicateTimelineClips(project,['a','b'],2,()=>ids.shift());
  assert.deepEqual(a.transition,{type:'fade',role:'out',start:9,end:10,partner:b.id});
  assert.deepEqual(b.transition,{type:'fade',role:'in',start:9,end:10,partner:a.id});
  const [single]=duplicateTimelineClips({duration:14,layers:[outgoing,incoming]},['a'],1,()=> 'single');
  assert.equal(single.transition,undefined);
  assert.equal(outgoing.transition.partner,'b');
});


test('magnet snaps an exact edge and disabled magnet permits a one-frame gap',()=>{
  const moving={id:'a',laneId:'lane',clipStart:0,clipEnd:2};
  const neighbor={id:'b',laneId:'lane',clipStart:4,clipEnd:6};
  const placement=clipPlacement({duration:10,layers:[moving,neighbor]},[moving],false);
  const near=2-1/30;
  assert.equal(fitClipOffset(placement,near,0.06),2);
  assert.equal(fitClipOffset(placement,near),near);
  assert.equal(fitClipOffset(placement,2+1/30),2);
});

test('separates legacy overlapping clips without shifting time or changing stack order',async()=>{
  const {separateOverlappingLanes}=await import('../timeline-lanes.js');
  const a={id:'a',clipStart:0,clipEnd:4};
  const b={id:'b',laneId:'a',clipStart:2,clipEnd:5,keys:[{time:3}]};
  const c={id:'c',laneId:'a',clipStart:4,clipEnd:6};
  const project={duration:10,layers:[a,b,c],groups:[{layerIds:['a','b','c']}]};
  separateOverlappingLanes(project);
  assert.deepEqual(project.layers,[a,b,c]);
  assert.notEqual(b.laneId,'a');
  assert.equal(c.laneId,'a');
  assert.deepEqual([b.clipStart,b.clipEnd,b.keys[0].time],[2,5,3]);
  assert.deepEqual(project.groups[0].layerIds,['a','b','c']);
  const repairedLane=b.laneId;
  separateOverlappingLanes(project);
  assert.equal(b.laneId,repairedLane);
});

test('a direct row drop uses its requested time and only snaps nearby edges',async()=>{
  const {fitClipOnLane}=await import('../timeline-lanes.js');
  const source={id:'source',clipStart:0,clipEnd:2};
  const target={id:'target',clipStart:4,clipEnd:7};
  const project={duration:10,layers:[source,target]};
  assert.equal(fitClipOnLane(project,source,target,0,0),0);
  assert.equal(fitClipOnLane(project,source,target,3,0.1),null);
  assert.equal(fitClipOnLane(project,source,target,2+1/30,0.06),2);
  assert.equal(fitClipOnLane(project,source,target,2+1/30,0),null);
  target.locked=true;
  assert.equal(fitClipOnLane(project,source,target,0,0.06),null);
});

test('detaches the original clip from a shared row without moving its siblings',async()=>{
  const {detachClipFromLane}=await import('../timeline-lanes.js');
  const original={id:'a',clipEnd:2,keys:[{time:1}]};
  const sibling={id:'b',laneId:'a',clipStart:2,clipEnd:4};
  const project={duration:10,layers:[original,sibling],groups:[{layerIds:['a','b']}]};
  assert.equal(detachClipFromLane(project,original,'new-row'),true);
  assert.equal(original.laneId,'new-row');
  assert.equal(sibling.laneId,'a');
  assert.deepEqual(original.keys,[{time:1}]);
  assert.deepEqual(project.groups[0].layerIds,['a','b']);
  assert.equal(detachClipFromLane(project,original,'another-row'),false);
});
