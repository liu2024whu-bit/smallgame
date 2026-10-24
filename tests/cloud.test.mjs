import test from 'node:test';
import assert from 'node:assert/strict';
import {cloud,cloudAngles,CLOUD_TARGET} from '../src/puzzles/rotors.js';
import {createState,reduce,normalizeState,inventory} from '../src/core/state.js';
import {toolFor,puzzleToolUse} from '../src/data/tool-uses.js';
import {sceneSignature,renderScenePicture} from '../src/ui/room.js';
const states=Array.from({length:64},(_,n)=>[n%4,Math.floor(n/4)%4,Math.floor(n/16)]);
const mod=n=>(n%4+4)%4;
test('visible halves express the three intended relations for all 64 configurations',()=>{
 assert.deepEqual(CLOUD_TARGET,[1,0,3]);
 for(const values of states){
  const [a,b,c]=values,pairs=cloudAngles(values);
  assert.equal(pairs[0][0]===pairs[0][1],mod(a+b)===1);
  assert.equal(pairs[1][0]===pairs[1][1],mod(b+c)===0);
  assert.equal(pairs[2][0]===pairs[2][1],mod(a+2*c)===3);
  assert.equal(pairs.every(([one,two])=>one===two),cloud.solved({values}));
 }
 assert.equal(states.filter(values=>cloudAngles(values).slice(0,2).every(([a,b])=>a===b)).length,4);
 assert.deepEqual(states.filter(values=>cloud.solved({values})),[[3,2,2]]);
});
test('each spindle drives exactly two halves; the back reduction is twice the angle',()=>{
 const start=cloudAngles([0,0,0]);
 for(let spindle=0;spindle<3;spindle++){
  const values=[0,0,0];values[spindle]=1;const after=cloudAngles(values);
  const changed=after.flatMap((pair,i)=>pair.map((angle,j)=>mod(angle-start[i][j]))).filter(Boolean);
  assert.equal(changed.length,2);
  assert.deepEqual([...changed].sort(),spindle===2?[2,3]:spindle===1?[1,3]:[1,1]);
 }
});
test('every legal configuration can reach the joined scene; viewing is not a rule move',()=>{
 for(const values of states){
  let current={values:[...values]};
  for(const [index,value]of [3,2,2].entries())current=cloud.move(current,{type:'set-turn',index,value});
  assert.ok(cloud.valid(current));assert.ok(cloud.solved(current));
 }
 const seed=cloud.create();assert.equal(cloud.move(seed,{type:'view'}),seed);
});
test('old front/back progress keeps its four-step values and genuine rewards without keeping a second camera',()=>{
 let state=reduce(createState(),{type:'start'});state=reduce(state,{type:'pickup',id:'thread'});
 for(const [index,value]of [3,2,2].entries())state=reduce(state,{type:'move',id:'cloud',move:{type:'set-turn',index,value}});
 const old={...state,revision:7,progress:{...state.progress,cloud:{values:[3,2,2],back:true}}};
 const restored=normalizeState(old);assert.deepEqual(restored.progress.cloud,{values:[3,2,2]});
 assert.ok(restored.solved.includes('cloud'));assert.ok(inventory(restored).includes('mirror'));assert.ok(inventory(restored).includes('crank'));
 assert.deepEqual(normalizeState(restored),restored);
 const partial=normalizeState({...old,solved:[],progress:{...old.progress,cloud:{values:[2,1,3],back:true}}});
 assert.deepEqual(partial.progress.cloud,{values:[2,1,3]});assert.ok(!partial.solved.includes('cloud'));
 const forged=normalizeState({...old,collected:[]});assert.ok(!forged.solved.includes('cloud'));assert.ok(!inventory(forged).includes('mirror'));
});
test('cotton winding has bounded physical destinations and updates the same room object',()=>{
 let state=reduce(reduce(createState(),{type:'start'}),{type:'scene',id:'window'});
 const untouched=state;
 for(let index=0;index<3;index++)for(const direction of [-1,1]){
  const target=`cloud-wind:${index}:${direction}`,effect=puzzleToolUse(target);
  assert.equal(toolFor(target),'thread');
  assert.equal(reduce(untouched,{type:'move',...effect}),untouched);
 }
 for(const target of [null,'cloud-wind:3:1','cloud-wind:0:2','cloud-wind:-1:1','cloud-wind:0:1:extra'])assert.equal(puzzleToolUse(target),null);
 state=reduce(state,{type:'pickup',id:'thread'});const before=sceneSignature(state);
 state=reduce(state,{type:'move',...puzzleToolUse('cloud-wind:0:1')});
 assert.notEqual(sceneSignature(state),before);assert.deepEqual(state.progress.cloud.values,[1,0,0]);assert.ok(inventory(state).includes('thread'));
 assert.match(renderScenePicture(state),/world-cloud/);assert.match(renderScenePicture(state),/data-cloud-values="1,0,0"/);
});
