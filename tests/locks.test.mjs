import test from 'node:test';
import assert from 'node:assert/strict';
import { RULES } from '../src/puzzles/index.js';
import { POSTMARKS, POSTAL_ORDER, POSTAL_GRID, POSTAL_CODE, LETTER_GRID, COLUMN_STRIP, ROW_STRIP, LETTER_CODE } from '../src/data/ciphers.js';
import { createState, reduce, normalizeState, serializable, access } from '../src/core/state.js';
import { MAIN_IDS } from '../src/data/puzzles.js';
import { WITNESSES, solvedProgress } from './witnesses.mjs';

const start = () => ['bookmark','thread'].reduce((state,id)=>reduce(state,{type:'pickup',id}),reduce(createState(),{type:'start'}));
const finish = (state,id) => WITNESSES[id].reduce((s,move)=>reduce(s,{type:'move',id,move}),state);

test('both password answers follow the printed coordinates without personal trivia',()=>{
  const numbers=POSTAL_ORDER.map(mark=>{const stamp=POSTMARKS.find(item=>item.mark===mark);return POSTAL_GRID[stamp.row][stamp.column];});
  assert.deepEqual(numbers,[1,0,2,9]);assert.deepEqual(numbers,POSTAL_CODE);
  const letters=COLUMN_STRIP.map((column,i)=>LETTER_GRID[ROW_STRIP[i]-1][column-1]);
  assert.equal(letters.join(''),'LXYXX');assert.deepEqual(letters,LETTER_CODE);
  const reversed=[...ROW_STRIP].reverse();
  assert.notDeepEqual(COLUMN_STRIP.map((column,i)=>LETTER_GRID[reversed[i]-1][column-1]),LETTER_CODE);
  assert.equal(POSTMARKS.filter(mark=>mark.card===0).length,2);
  assert.equal(POSTMARKS.filter(mark=>mark.card===1).length,2);
});

test('the latch must be tried, wrong attempts keep the entered code and allow retry',()=>{
  const rule=RULES.postbox;let state=rule.create();
  state=rule.move(state,{type:'submit'});assert.equal(state.opened,false);assert.deepEqual(state.values,[0,0,0,0]);
  POSTAL_CODE.forEach((value,index)=>{state=rule.move(state,{type:'set',index,value});});
  assert.equal(rule.solved(state),false);
  assert.ok(rule.solved(rule.move(state,{type:'submit'})));
  assert.equal(rule.valid({...rule.create(),opened:true}),false);
  assert.equal(rule.valid({...rule.create(),values:[10,0,0,0]}),false);
  for(const move of [{type:'set',index:4,value:1},{type:'set',index:0,value:-1},{type:'set',index:0,value:1.5},{type:'turn',index:0,direction:10}])assert.equal(rule.move(state,move),state);
});

test('keyboard editing, cursor positioning and backspace survive correction',()=>{
  const rule=RULES.wordlock;let state=rule.create();
  for(const letter of 'LXA')state=rule.move(state,{type:'key',value:letter.charCodeAt(0)-65});
  state=rule.move(state,{type:'erase'});assert.deepEqual(state.values,[11,23,26,26,26]);assert.equal(state.cursor,2);
  for(const letter of 'YXX')state=rule.move(state,{type:'key',value:letter.charCodeAt(0)-65});
  assert.deepEqual(state.values,solvedProgress('wordlock').values);
  state=rule.move(state,{type:'submit'});assert.ok(rule.solved(state));
  assert.equal(rule.move(state,{type:'erase'}),state);
});

test('new main gates are required in a new run and a wrong lock cannot grant downstream rewards',()=>{
  let state=start();for(const id of ['paper','cloud','calibration'])state=finish(state,id);
  assert.equal(access(state,'books').ready,false);assert.ok(access(state,'screen').ready);
  state=finish(state,'postbox');assert.ok(access(state,'books').ready);
  for(const id of ['books','screen','belt','film','flowers','paperBack','cloudGap'])state=finish(state,id);
  assert.equal(access(state,'album').ready,false);assert.ok(access(state,'wordlock').ready);
  state=finish(state,'wordlock');assert.ok(access(state,'album').ready);
});

test('old completed V2 games keep every completion and the ending after the new gates are inserted',()=>{
  const old=start();delete old.revision;
  const oldIds=MAIN_IDS.filter(id=>!['postbox','wordlock'].includes(id));
  old.solved=[...oldIds,'packing','melody'];oldIds.concat('packing','melody').forEach(id=>{old.progress[id]=solvedProgress(id);});old.ending=true;
  const restored=normalizeState(serializable(old));
  assert.ok(restored.ending);
  for(const id of [...old.solved,'postbox','wordlock'])assert.ok(restored.solved.includes(id),id);
  assert.ok(RULES.postbox.solved(restored.progress.postbox));assert.ok(RULES.wordlock.solved(restored.progress.wordlock));
  assert.deepEqual(normalizeState(serializable(restored)).solved,restored.solved);
});

test('old partial runs only receive the gate they had already passed, and forged claims receive none',()=>{
  const old=start();delete old.revision;
  old.solved=['paper','cloud','calibration','books'];old.solved.forEach(id=>{old.progress[id]=solvedProgress(id);});
  const restored=normalizeState(old);assert.ok(restored.solved.includes('postbox'));assert.ok(!restored.solved.includes('wordlock'));
  old.progress.paper=RULES.paper.create();
  const forged=normalizeState(old);assert.ok(!forged.solved.includes('postbox'));assert.ok(!forged.solved.includes('books'));
});

test('a whole traced route is one undo step and malformed traces are atomic',()=>{
  let state=start();for(const id of ['paper','cloud','calibration','postbox','books','screen'])state=finish(state,id);
  const before=state.progress.belt;
  state=reduce(state,{type:'move',id:'belt',move:{type:'trace',nodes:[0,2,1,4,3,5,6]}});
  assert.equal(state.history.belt.length,1);assert.deepEqual(reduce(state,{type:'undo',id:'belt'}).progress.belt,before);
  assert.equal(RULES.belt.move(before,{type:'trace',nodes:[0,6]}),before);
  const needle=RULES.stitch.create();
  assert.equal(RULES.stitch.move(needle,{type:'trace',nodes:[0,4,4]}),needle);
  assert.ok(RULES.stitch.solved(RULES.stitch.move(needle,{type:'trace',nodes:[0,4,1,5,2,6,3,7]})));
});

test('precise dial drops and bookmark relocation validate their complete range',()=>{
  for(const id of ['cloud','calibration','cloudGap','maze']){
    const rule=RULES[id],before=rule.create(),size=id==='maze'?6:4;
    assert.equal(rule.move(before,{type:'set-turn',index:0,value:size}),before);
    assert.ok(rule.valid(rule.move(before,{type:'set-turn',index:2,value:size-1})));
  }
  const flowers=RULES.flowers.create();assert.equal(RULES.flowers.move(flowers,{type:'set-pin',index:9}),flowers);
  assert.equal(RULES.flowers.move(flowers,{type:'set-pin',index:2}).pin,2);
});
