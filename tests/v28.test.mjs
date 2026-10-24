import {acceptsReviewPin} from '../src/services/review-access.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {GAME_DATE,DATE_NOTES,DATE_CODE,calendarCells} from '../src/data/calendar.js';
import {RULES} from '../src/puzzles/index.js';
import {createState,reduce,normalizeState,serializable,access} from '../src/core/state.js';
import {previewState,REVIEW_CASES} from '../src/demo/fixtures.js';
import {WITNESSES} from './witnesses.mjs';

test('story day and weekday are real; an undated first meeting and lunar birthday never get a fabricated year',()=>{
  assert.equal(GAME_DATE.iso,'2026-10-29');
  const cells=calendarCells();assert.equal(cells.filter(Boolean).length,31);assert.equal(cells.indexOf(29)%7,4);
  assert.equal(DATE_NOTES[0].year,null);assert.equal(DATE_NOTES[1].year,2020);assert.equal(DATE_NOTES[2].year,null);
  assert.equal(calendarCells(2020,9).indexOf(12)%7,6);
});
test('the three printed dates produce six ordered digits, and a correct code still needs the real latch',()=>{
  assert.deepEqual(DATE_CODE,[0,1,1,2,0,8]);
  let progress=RULES.calendar.create();
  for(const move of WITNESSES.calendar.slice(0,-1))progress=RULES.calendar.move(progress,move);
  assert.equal(RULES.calendar.solved(progress),false);
  assert.equal(RULES.calendar.solved(RULES.calendar.move(progress,{type:'submit'})),true);
  const wrong=RULES.calendar.move(RULES.calendar.create(),{type:'submit'});assert.equal(wrong.opened,false);assert.equal(wrong.attempts,1);
});
test('the new calendar is independent, reversible before opening and does not invalidate V2.7 progress',()=>{
  let state=reduce(createState(),{type:'start'});state=reduce(state,{type:'move',id:'calendar',move:{type:'set',index:5,value:8}});
  state=reduce(state,{type:'undo',id:'calendar'});assert.deepEqual(state.progress.calendar,RULES.calendar.create());
  const old=serializable(previewState({full:true}));old.revision=5;delete old.progress.calendar;old.solved=old.solved.filter(id=>id!=='calendar');
  const restored=normalizeState(old);assert.equal(restored.ending,true);assert.equal(restored.solved.length,25);assert.equal(restored.progress.calendar.opened,false);
});
test('every preview fixture is validated by the actual core and keeps its selected puzzle reachable',()=>{
  for(const spec of REVIEW_CASES){
    const state=normalizeState(serializable(previewState(spec)));
    if(spec.puzzle){assert.ok(access(state,spec.puzzle).ready,spec.id);assert.equal(state.solved.includes(spec.puzzle),Boolean(spec.completed),spec.id);}
    if(spec.full)assert.equal(state.ending,true,spec.id);
  }
});
test('a key or erase follows actual focused letter slot, rejecting malformed explicit slots',()=>{
  let progress=RULES.wordlock.create();
  progress=RULES.wordlock.move(progress,{type:'key',index:2,value:23});
  assert.equal(progress.values[2],23);assert.equal(progress.cursor,3);assert.equal(progress.values[0],26);
  progress=RULES.wordlock.move(progress,{type:'erase',index:2});assert.equal(progress.values[2],26);assert.equal(progress.cursor,2);
  assert.equal(RULES.wordlock.move(progress,{type:'key',index:99,value:1}),progress);
});

test('maintenance gate accepts only the chosen PIN and the complete review catalog has unique locations',async()=>{
  assert.equal(await acceptsReviewPin('20261029'),true);
  for(const pin of ['20261028','', ' 20261029','202610290','abcdefgh'])assert.equal(await acceptsReviewPin(pin),false);
  assert.equal(new Set(REVIEW_CASES.map(s=>s.id)).size,REVIEW_CASES.length);
  assert.ok(REVIEW_CASES.some(s=>s.id==='rooms'));
  assert.equal(REVIEW_CASES.filter(s=>s.id.startsWith('keepsake-')).length,14);
});
