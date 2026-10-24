import test from 'node:test';
import assert from 'node:assert/strict';
import {flowers,turnFlowers,FLOWER_TARGET} from '../src/puzzles/flowers.js';
import {previewState} from '../src/demo/fixtures.js';
import {reduce,normalizeState,serializable} from '../src/core/state.js';
const key=s=>s.heights.join('')+':'+s.pin;

test('flower end stops block the pair together; reverse turns undo motion and detent pose',()=>{
  const seed=flowers.create(),one=turnFlowers(seed,0,1);
  assert.deepEqual(one.heights,[1,2,2]);assert.deepEqual(turnFlowers(one,0,-1),seed);
  const edge={heights:[3,1,1],pin:-1,turns:[0,0,0]};
  assert.equal(turnFlowers(edge,0,1),edge);
  const braked={...edge,pin:0};assert.deepEqual(turnFlowers(braked,0,1).heights,[3,2,1]);
  assert.deepEqual(turnFlowers(seed,1,3).heights,[0,2,3]);
  for(const steps of [0,4,-4,1.5,NaN])assert.equal(turnFlowers(seed,0,steps),seed);
});

test('a bookmark is still logically necessary even with reverse motion',()=>{
  const queue=[flowers.create()],seen=new Set([key(queue[0])]);
  for(let head=0;head<queue.length;head++)for(let index=0;index<3;index++)for(const steps of [-1,1]){
    const next=turnFlowers(queue[head],index,steps);assert.equal(flowers.solved(next),false);
    if(!seen.has(key(next))){seen.add(key(next));queue.push(next);}
  }
  assert.ok(queue.length>10);
});

test('all 256 height and brake combinations have a route to the target; no intermediate arrangement traps the player',()=>{
  const states=[];
  for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++)for(let pin=-1;pin<3;pin++)states.push({heights:[a,b,c],pin,turns:[0,0,0]});
  const predecessors=new Map(states.map(s=>[key(s),[]]));
  for(const state of states){
    const moves=[...Array.from({length:4},(_,i)=>({type:'set-pin',index:i-1})),...[0,1,2].flatMap(index=>[-1,1].map(steps=>({type:'crank',index,steps})))];
    for(const move of moves){const next=flowers.move(state,move);assert.ok(flowers.valid(next));predecessors.get(key(next)).push(key(state));}
  }
  const queue=states.filter(flowers.solved).map(key),seen=new Set(queue);
  for(let i=0;i<queue.length;i++)for(const previous of predecessors.get(queue[i]))if(!seen.has(previous)){seen.add(previous);queue.push(previous);}
  assert.equal(seen.size,256);assert.deepEqual(FLOWER_TARGET,[3,2,1]);
});

test('legacy partial flower positions survive and one continuous turn remains one undo',()=>{
  const state=previewState({puzzle:'flowers'});state.progress.flowers={heights:[2,1,0],pin:2};
  const old=normalizeState(serializable(state));assert.deepEqual(old.progress.flowers,state.progress.flowers);
  const seed=previewState({puzzle:'flowers'}),turned=reduce(seed,{type:'move',id:'flowers',move:{type:'crank',index:0,steps:2}});
  assert.deepEqual(turned.progress.flowers.heights,[2,3,2]);assert.equal(turned.history.flowers.length,1);
  assert.deepEqual(reduce(turned,{type:'undo',id:'flowers'}).progress.flowers,seed.progress.flowers);
});
