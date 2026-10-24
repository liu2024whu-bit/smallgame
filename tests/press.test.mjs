import test from 'node:test';
import assert from 'node:assert/strict';
import {paper} from '../src/puzzles/paper.js';
import {createState,reduce,normalizeState,inventory} from '../src/core/state.js';
import {enumeratePermutations} from '../src/puzzles/common.js';
import {puzzlePanel} from '../src/ui/workbench.js';

const begun=()=>reduce(reduce(createState(),{type:'start'}),{type:'pickup',id:'bookmark'});
const move=(s,action)=>reduce(s,{type:'move',id:'paper',move:action});
test('an uncollected tool does not replace the physical catch with an answer sheet or grant a tool',()=>{
 const state=reduce(createState(),{type:'start'}),view=puzzlePanel('paper',{state});
 assert.match(view.html,/press-case/);assert.doesNotMatch(view.html,/missing-tools|data-inventory-drag/);
 assert.match(view.html,/夹扣，边上有道窄缝/);assert.equal(move(state,{type:'open'}),state);
 assert.deepEqual(inventory(state),[]);
});
test('the plate cannot move through a closed lid, and a correct setup still needs a real print',()=>{
 const seed=paper.create(),order=[0,1,2];
 assert.deepEqual(paper.move(seed,{type:'reorder',from:1,to:0}),seed);
 assert.deepEqual(paper.move(seed,{type:'print'}),seed);
 let state=paper.move(seed,{type:'open'});state=paper.move(state,{type:'reorder',from:0,to:2});
 assert.deepEqual(state.order,order);assert.equal(paper.solved(state),false);
 const printed=paper.move(state,{type:'print'});assert.equal(paper.solved(printed),true);
 assert.equal(state.proof,null);assert.notEqual(printed.order,printed.proof);
});
test('a wrong proof is the actual last print, even after the plates move; one undo restores one impression',()=>{
 let state=move(begun(),{type:'open'});state=move(state,{type:'print'});const proof=[...state.progress.paper.proof];
 state=move(state,{type:'reorder',from:0,to:2});assert.deepEqual(state.progress.paper.order,[0,1,2]);
 assert.deepEqual(state.progress.paper.proof,proof);assert.equal(state.solved.includes('paper'),false);
 const history=state.history.paper.length;state=move(state,{type:'print'});
 assert.equal(state.history.paper.length,history+1);assert.equal(state.solved.includes('paper'),true);
 let wrong=move(move(begun(),{type:'open'}),{type:'print'});wrong=reduce(wrong,{type:'undo',id:'paper'});
 assert.equal(wrong.progress.paper.proof,null);assert.equal(wrong.progress.paper.opened,true);
});
test('every configuration and wrong proof can be corrected, without inventing or consuming a bookmark',()=>{
 for(const order of enumeratePermutations([0,1,2]))for(const proof of [null,...enumeratePermutations([0,1,2])]){
  let state={order,proof,opened:true,presses:65535};assert.equal(paper.valid(state),true);
  for(let i=0;i<3;i++)state=paper.move(state,{type:'reorder',from:state.order.indexOf(i),to:i});
  state=paper.move(state,{type:'print'});assert.equal(state.presses,0);assert.equal(paper.solved(state),true);
 }
 const locked=reduce(createState(),{type:'start'});assert.equal(move(locked,{type:'open'}),locked);
 let ready=move(begun(),{type:'open'});ready=move(ready,{type:'reorder',from:0,to:2});ready=move(ready,{type:'print'});
 assert.ok(inventory(ready).includes('bookmark'));assert.ok(inventory(ready).includes('transparency'));
});
test('legacy real prints survive, partial setups stay partial, and new saves cannot skip an impression with old fields',()=>{
 const raw={...begun(),revision:6,progress:{...createState().progress,paper:{order:[0,1,2]}},solved:['paper']};
 const restored=normalizeState(raw);assert.equal(restored.solved.includes('paper'),true);assert.deepEqual(restored.progress.paper.proof,[0,1,2]);
 assert.deepEqual(normalizeState(restored),restored);
 const partial=normalizeState({...raw,solved:[],progress:{...raw.progress,paper:{order:[2,1,0]}}});
 assert.deepEqual(partial.progress.paper.order,[2,1,0]);assert.equal(partial.progress.paper.proof,null);assert.equal(partial.solved.includes('paper'),false);
 const forged=normalizeState({...raw,revision:7});assert.equal(forged.solved.includes('paper'),false);
 assert.equal(inventory(forged).includes('transparency'),false);
 const fakeOld=normalizeState({...raw,progress:{...raw.progress,paper:{order:[2,0,1]}}});assert.equal(fakeOld.solved.includes('paper'),false);
 const untouched=normalizeState({...raw,collected:[],solved:[],progress:{...raw.progress,paper:{order:[2,0,1]}}});assert.equal(untouched.progress.paper.opened,false);assert.deepEqual(inventory(untouched),[]);
});
