import test from 'node:test';
import assert from 'node:assert/strict';
import { sweptTargets } from '../src/ui/interactions/sweep.js';

const row = [0,1,2,3,4].map(i=>({left:i*20,right:i*20+14,top:10,bottom:24}));

test('a fast stroke crosses every chocolate cup in physical order',()=>{
  assert.deepEqual(sweptTargets({x:-5,y:17},{x:105,y:17},row),[0,1,2,3,4]);
  assert.deepEqual(sweptTargets({x:105,y:17},{x:-5,y:17},row),[4,3,2,1,0]);
});

test('a trace cannot pick holes beyond either end or beside its segment',()=>{
  assert.deepEqual(sweptTargets({x:21,y:17},{x:53,y:17},row),[1,2]);
  assert.deepEqual(sweptTargets({x:-5,y:8},{x:105,y:8},row),[]);
  assert.deepEqual(sweptTargets({x:-5,y:8},{x:105,y:8},row,2),[0,1,2,3,4]);
});

test('vertical and diagonal crossings exclude rectangles outside the actual path',()=>{
  const boxes=[{left:0,right:10,top:0,bottom:10},{left:20,right:30,top:20,bottom:30},{left:20,right:30,top:0,bottom:10}];
  assert.deepEqual(sweptTargets({x:-5,y:-5},{x:35,y:35},boxes),[0,1]);
  assert.deepEqual(sweptTargets({x:25,y:-5},{x:25,y:35},boxes),[2,1]);
});

test('a stationary pointer can hold a hole without picking a distant one',()=>{
  assert.deepEqual(sweptTargets({x:25,y:17},{x:25,y:17},row),[1]);
  assert.deepEqual(sweptTargets({x:17,y:17},{x:17,y:17},row),[]);
});
