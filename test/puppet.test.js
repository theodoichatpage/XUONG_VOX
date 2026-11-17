import {test} from 'node:test';
import assert from 'node:assert/strict';
import {puppetWeight,puppetProgress,puppetInfluences,puppetPinOffset,puppetDefaults} from '../puppet.js';

test('Puppet pins anchor one point and move another with a weighted falloff',()=>{
  const pins=[{kind:'anchor',u:0,v:0},{kind:'motion',u:1,v:1}];
  assert.equal(puppetWeight(0,0,pins),0);
  assert.equal(puppetWeight(1,1,pins),1);
  assert.ok(puppetWeight(.25,.25,pins)<puppetWeight(.75,.75,pins));
});
test('Pingpong returns to the original pose and repeats, while one-way motion holds',()=>{
  assert.deepEqual([0,.5,1,1.5].map(time=>puppetProgress(time,1,true)),[0,1,0,1]);
  assert.equal(puppetProgress(2,1,false),1);
});

test('motion pins can use separate timing and axes while anchors stay fixed',()=>{
  const anchor={kind:'anchor',u:0,v:0};
  const a={kind:'motion',u:.5,v:.5};
  const b={kind:'motion',u:1,v:1,axis:'y',delay:.25,amount:10,speed:1};
  assert.deepEqual(puppetPinOffset(anchor,puppetDefaults,.5,100,100),[0,0]);
  assert.deepEqual(puppetPinOffset(a,puppetDefaults,.5,100,100),[4,0]);
  assert.deepEqual(puppetPinOffset(b,puppetDefaults,.25,100,100),[0,0]);
  assert.deepEqual(puppetPinOffset(b,puppetDefaults,.75,100,100),[0,10]);
  assert.ok(puppetInfluences(0,0,[anchor,a,b])[1]<1e-10);
  assert.ok(puppetInfluences(1,1,[anchor,a,b])[2]>.999);
});
