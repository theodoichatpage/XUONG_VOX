import {test} from 'node:test';import assert from 'node:assert/strict';import {splitSelectedLayers,placeOnLane,duplicateTimelineClips} from '../timeline-lanes.js';
test('splits selected clips without losing animation and selects both pieces',()=>{let p={duration:10,layers:[{id:'a',clipStart:0,clipEnd:10,keys:[{time:7,property:'opacity',value:.5}]},{id:'b',keys:[]}],groups:[{id:'g',layerIds:['a']}]};let result=splitSelectedLayers(p,['a'],4,()=> 'right');assert.deepEqual(result,['a','right']);assert.equal(p.layers.length,3);assert.equal(p.layers[0].clipEnd,4);assert.equal(p.layers[1].clipStart,4);assert.deepEqual(p.layers[1].keys,p.layers[0].keys);assert.equal(p.layers[0].laneId,p.layers[1].laneId);assert.deepEqual(p.groups[0].layerIds,['a','right'])});
test('two non-overlapping objects can share a timeline lane',()=>{let p={duration:10,layers:[{id:'a',clipStart:0,clipEnd:3},{id:'b',clipStart:3,clipEnd:6}]};assert.equal(placeOnLane(p,'a','b'),true);assert.equal(p.layers[0].laneId,p.layers[1].laneId)});
test('refuses overlapping objects on a lane without modifying either',()=>{let p={duration:10,layers:[{id:'a',clipStart:0,clipEnd:4},{id:'b',clipStart:3,clipEnd:6}]};assert.throws(()=>placeOnLane(p,'a','b'),/chồng/);assert.equal(p.layers[0].laneId,undefined)});
test('locked layers cannot be split or moved to a different lane',()=>{let p={duration:10,layers:[{id:'a',clipStart:0,clipEnd:4,locked:true,keys:[]},{id:'b',clipStart:4,clipEnd:8,keys:[]}]};assert.deepEqual(splitSelectedLayers(p,['a'],2,()=> 'x'),[]);assert.throws(()=>placeOnLane(p,'a','b'),/khóa/);assert.equal(p.layers.length,2)});

test('duplicates clips with a shared time offset and independent keyframes and lanes',()=>{
  const a={id:'a',name:'A',laneId:'lane',clipStart:1,clipEnd:4,keys:[{time:2,property:'position',value:[1,2,3]}]};
  const b={id:'b',name:'B',clipStart:2,clipEnd:5,keys:[]};
  const locked={id:'locked',name:'Locked',locked:true};
  const project={duration:10,layers:[a,b,locked],groups:[{id:'group',layerIds:['a','b']}]};
  const ids=['a-copy','b-copy'];
  const [first,second]=duplicateTimelineClips(project,['a','b','locked'],2,()=>ids.shift());
  assert.deepEqual(project.layers.map(layer=>layer.id),['a','a-copy','b','b-copy','locked']);
  assert.deepEqual(project.groups[0].layerIds,['a','a-copy','b','b-copy']);
  assert.deepEqual([first.clipStart,first.clipEnd,second.clipStart,second.clipEnd],[3,6,4,7]);
  assert.equal(first.laneId,undefined);
  assert.equal(first.keys[0].time,4);
  first.keys[0].value[0]=99;
  assert.deepEqual(a.keys[0],{time:2,property:'position',value:[1,2,3]});
  assert.equal(a.clipStart,1);
});

test('duplicates a full-length clip on a separate row when there is no room to shift',()=>{
  const original={id:'a',name:'A',keys:[{time:5}]};
  const project={duration:10,layers:[original]};
  const [copy]=duplicateTimelineClips(project,['a'],2,()=> 'copy');
  assert.equal(copy.keys[0].time,5);
  assert.equal(copy.laneId,undefined);
});

test('copied transitions refer to the copied pair and move with its clips',()=>{
  const outgoing={id:'a',name:'A',clipEnd:6,transition:{type:'fade',role:'out',start:3,end:4,partner:'b'}};
  const incoming={id:'b',name:'B',clipStart:2,clipEnd:7,transition:{type:'fade',role:'in',start:3,end:4,partner:'a'}};
  const project={duration:10,layers:[outgoing,incoming]};
  const ids=['copy-a','copy-b'];
  const [a,b]=duplicateTimelineClips(project,['a','b'],2,()=>ids.shift());
  assert.deepEqual(a.transition,{type:'fade',role:'out',start:5,end:6,partner:b.id});
  assert.deepEqual(b.transition,{type:'fade',role:'in',start:5,end:6,partner:a.id});
  const [single]=duplicateTimelineClips(project,['a'],1,()=> 'single');
  assert.equal(single.transition,undefined);
  assert.equal(outgoing.transition.partner,'b');
});
