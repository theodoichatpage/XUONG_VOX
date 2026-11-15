import {test} from 'node:test';
import assert from 'node:assert/strict';
import {puppetWeight,puppetProgress} from '../puppet.js';

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
