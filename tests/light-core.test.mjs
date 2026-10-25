import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,reduce,normalizeState,serializable,inventory,access} from '../src/core/state.js';
import {finish} from './witnesses.mjs';
import {puzzleToolUse,toolFor} from '../src/data/tool-uses.js';
function ready(){
 let s=reduce(createState(),{type:'start'});
 for(const id of ['bookmark','thread'])s=reduce(s,{type:'pickup',id});
 for(const id of ['paper','cloud'])s=finish(s,id);
 return s;
}
test('light joins two independently earned branches and every installed prop is owned',()=>{
 let s=reduce(createState(),{type:'start'});s=reduce(s,{type:'pickup',id:'bookmark'});s=finish(s,'paper');
 assert.equal(access(s,'calibration').ready,false);
 assert.equal(reduce(s,{type:'move',id:'calibration',move:{type:'fit',index:1}}),s);
 const raw=serializable(s);raw.progress.calibration.fitted=[false,true,false];
 const restored=normalizeState(raw);assert.deepEqual(restored.progress.calibration.fitted,[false,false,false]);assert.ok(!Object.hasOwn(restored.progress.calibration,'opened'));
 s=ready();assert.ok(access(s,'calibration').ready);
 for(const [index,item]of ['transparency','mirror','bookmark'].entries()){
  const target='light-fit:'+index;assert.equal(toolFor(target),item);
  const use=puzzleToolUse(target);s=reduce(s,{type:'move',...use});
  assert.equal(s.progress.calibration.fitted[index],true);
 }
 for(const target of ['light-fit:-1','light-fit:3','light-fit:01','light-fit:1:extra']){assert.equal(toolFor(target),undefined);assert.equal(puzzleToolUse(target),null);}
});
test('tracing leaves an independent verified drawing, returns tools and opens both downstream branches',()=>{
 let s=ready();const owned=inventory(s);s=finish(s,'calibration');
 assert.ok(s.solved.includes('calibration'));assert.deepEqual(s.progress.calibration.fitted,[false,false,false]);assert.equal(s.progress.calibration.lit,false);
 assert.deepEqual(inventory(s),owned);assert.ok(access(s,'postbox').ready);assert.ok(access(s,'screen').ready);
 const restored=normalizeState(JSON.parse(JSON.stringify(serializable(s))));
 assert.deepEqual(restored.solved,s.solved);assert.deepEqual(restored.progress.calibration,s.progress.calibration);
 assert.equal(reduce(s,{type:'move',id:'calibration',move:{type:'power'}}),s);
});
test('revision 8 keeps genuine old completion and partial stops without granting a claimed drawing',()=>{
 const s=ready();
 const old={...serializable(s),revision:8,solved:[...s.solved,'calibration'],progress:{...s.progress,calibration:{values:[2,1,3],back:false}}};
 const restored=normalizeState(old);assert.ok(restored.solved.includes('calibration'));assert.deepEqual(restored.progress.calibration.proof,{values:[2,1,3],flipped:true});
 assert.deepEqual(normalizeState(serializable(restored)).progress.calibration,restored.progress.calibration);
 const partial=normalizeState({...old,solved:s.solved,progress:{...old.progress,calibration:{values:[1,3,2],back:true}}});
 assert.deepEqual(partial.progress.calibration,{values:[1,3,2],fitted:[false,false,false],flipped:false,lit:false,proof:null});
 const unearned=normalizeState({...old,progress:{...old.progress,paper:createState().progress.paper}});
 assert.ok(!unearned.solved.includes('calibration'));assert.ok(!unearned.solved.includes('screen'));
 for(const candidate of [{values:[2,1,3],lit:true},{values:[2,1,3],back:'false'}]){
  const bad=normalizeState({...old,progress:{...old.progress,calibration:candidate}});
  assert.ok(!bad.solved.includes('calibration'));
 }
 assert.ok(!normalizeState({...old,revision:9}).solved.includes('calibration'));
});
test('fitting, power, flip and physical moves remain separately undoable without changing inventory',()=>{
 let s=ready();const initial=s.progress.calibration,owned=inventory(s);
 for(const move of [{type:'fit',index:0},{type:'power'},{type:'flip'},{type:'set-turn',index:0,value:2}])s=reduce(s,{type:'move',id:'calibration',move});
 assert.equal(s.history.calibration.length,4);
 for(let i=0;i<4;i++)s=reduce(s,{type:'undo',id:'calibration'});
 assert.deepEqual(s.progress.calibration,initial);assert.deepEqual(inventory(s),owned);
});
