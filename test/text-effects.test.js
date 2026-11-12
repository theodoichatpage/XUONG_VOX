import {test} from 'node:test';import assert from 'node:assert/strict';import {textAnimation,TEXT_DEFAULTS} from '../text-effects.js';
test('text effects follow the clip start and return stable final values',()=>{let t={...TEXT_DEFAULTS,effect:'typewriter',content:'Việt Nam',duration:2};assert.equal(textAnimation(t,3,3,8).reveal,0);assert.equal(textAnimation(t,5,3,8).reveal,8);assert.equal(textAnimation({...t,effect:'fade'},3,3,8).alpha,0);assert.equal(textAnimation({...t,effect:'fade'},5,3,8).alpha,1);assert.equal(textAnimation({...t,effect:'highlight'},5,3,8).highlight,1)});

test('fade out reaches zero at clip end',()=>{let t={...TEXT_DEFAULTS,outEffect:'fade',duration:1};assert.equal(textAnimation(t,4,0,5).alpha,1);assert.equal(textAnimation(t,5,0,5).alpha,0)});
