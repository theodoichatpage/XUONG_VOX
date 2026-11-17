import {test} from 'node:test';import assert from 'node:assert/strict';import {layerColor} from '../layer-colors.js';
test('uses type colors while preserving custom colors',()=>{assert.equal(layerColor({kind:'text'}),'#e1bb42');assert.equal(layerColor({kind:'video'}),'#5ca978');assert.equal(layerColor({}),'#6089cf');assert.equal(layerColor({color:'#abcdef'}),'#abcdef')});
