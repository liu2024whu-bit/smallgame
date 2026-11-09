import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,reduce,normalizeState,serializable} from '../src/core/state.js';
import {MAIN_IDS,PUZZLE_BY_ID} from '../src/data/puzzles.js';
import {WITNESSES} from './solutions.mjs';

function beforeBirthdayLock(){
 let state=reduce(createState(),{type:'start'});
 for(const id of ['bookmark','thread'])state=reduce(state,{type:'pickup',id});
 for(const id of MAIN_IDS){
  if(id==='birthdayLock')break;
  if(id==='stitch')for(const index of [0,3])state=reduce(state,{type:'move',id:'belt',move:{type:'unfit',index}});
  if(id==='chocolate')state=reduce(state,{type:'use-tool',item:'crank',target:'birthday-door'});
  for(const move of WITNESSES[id])state=reduce(state,{type:'move',id,move});
  for(const item of PUZZLE_BY_ID[id].rewards)state=reduce(state,{type:'pickup',id:item});
 }
 return state;
}
const move=(state,id,type,index)=>reduce(state,{type:'move',id,move:{type,index}});

test('undo can restore a mirror fitting while the mirror is still free',()=>{
 let state=beforeBirthdayLock();
 state=move(state,'birthdayLock','fit',2);state=move(state,'birthdayLock','unfit',2);
 state=reduce(state,{type:'undo',id:'birthdayLock'});
 assert.equal(state.progress.birthdayLock.fitted[2],true);
 assert.equal(state.progress.paperBack.fitted[0],false);
});

test('undo cannot duplicate or recall a mirror now fitted in another room',()=>{
 let state=beforeBirthdayLock();
 state=move(state,'birthdayLock','fit',2);state=move(state,'birthdayLock','unfit',2);
 state=move(state,'paperBack','fit',0);const other=state.progress.paperBack;
 state=reduce(state,{type:'undo',id:'birthdayLock'});
 assert.equal(state.progress.birthdayLock.fitted[2],false);
 assert.equal(state.progress.paperBack,other);
 const restored=normalizeState(serializable(state));
 assert.deepEqual(restored.progress.birthdayLock,state.progress.birthdayLock);
 assert.deepEqual(restored.progress.paperBack,state.progress.paperBack);
 state=move(state,'paperBack','unfit',0);
 for(const action of WITNESSES.birthdayLock)state=reduce(state,{type:'move',id:'birthdayLock',move:action});
 assert.ok(state.solved.includes('birthdayLock'));
});
