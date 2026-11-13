import {test} from 'node:test';import assert from 'node:assert/strict';import {createTransition,transitionAt} from '../transitions.js';
test('fade affects only two layers and leaves their existing values intact',()=>{let a={id:'a',clipStart:0,clipEnd:4,value:{opacity:.7}},b={id:'b',clipStart:1,clipEnd:5,value:{opacity:.5}},c={id:'c'};createTransition(a,b,2,1,'fade',5);assert.equal(transitionAt(a,1.5).alpha,1);assert.equal(transitionAt(a,2).alpha,.5);assert.equal(transitionAt(b,2).alpha,.5);assert.equal(transitionAt(a,2.5).alpha,0);assert.deepEqual(a.value,{opacity:.7});assert.deepEqual(c,{id:'c'})});
test('slide moves outgoing left and incoming from right',()=>{let a={id:'a',clipStart:0,clipEnd:5},b={id:'b',clipStart:0,clipEnd:5};createTransition(a,b,2,1,'slide',5);assert.equal(transitionAt(a,2.5).x,-4);assert.equal(transitionAt(b,1.5).x,4);assert.equal(transitionAt(b,2.5).x,0)});
test('rejects non-overlapping clips without mutation',()=>{let a={id:'a',clipStart:0,clipEnd:1},b={id:'b',clipStart:2,clipEnd:3};assert.throws(()=>createTransition(a,b,1,1,'fade',5),/chồng/);assert.equal(a.transition,undefined)});

test('new slide directions translate both layers on the selected axis without changing opacity',()=>{
  for(const [type,x,y] of [['slide-right',4,0],['slide-up',0,4],['slide-down',0,-4]]){
    const outgoing={id:'a'},incoming={id:'b'};
    createTransition(outgoing,incoming,2,1,type,5);
    assert.deepEqual(transitionAt(outgoing,2.5),{alpha:1,x,y});
    assert.deepEqual(transitionAt(incoming,1.5),{alpha:1,x:-x||0,y:-y||0});
    assert.deepEqual(transitionAt(incoming,2.5),{alpha:1,x:0,y:0});
  }
});
