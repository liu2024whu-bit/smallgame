import test from 'node:test';
import assert from 'node:assert/strict';
import { RULES } from '../src/puzzles/index.js';
import { SUGARS, RIBBON_PATHS, RIBBON_LAYERS, RIBBON_TAIL_SIDES, crossing, ribbonBlockers, BIRTHDAY_CODE, BIRTHDAY_GRID, ribbonHoles } from '../src/data/birthday-workshop.js';
import { createState, reduce, inventory, normalizeState, serializable, access } from '../src/core/state.js';
import { birthdayReady, sceneOpen } from '../src/core/exploration.js';
import { MAIN_IDS } from '../src/data/puzzles.js';
import { WITNESSES, solvedProgress } from './witnesses.mjs';

const finish=(state,id)=>WITNESSES[id].reduce((s,move)=>reduce(s,{type:'move',id,move}),state);
function workshop() {
  let s=reduce(createState(),{type:'start'});
  for(const id of ['bookmark','thread'])s=reduce(s,{type:'pickup',id});
  for(const id of MAIN_IDS.slice(0,MAIN_IDS.indexOf('chocolate')))s=finish(s,id);
  return reduce(s,{type:'use-tool',item:'crank',target:'birthday-door'});
}
test('the twenty printed sugars have one fair two-cut partition, with five distinct tastes in every share',()=>{
  assert.equal(SUGARS.length,20);assert.equal(new Set(SUGARS.map(s=>`${s.row},${s.column}`)).size,20);
  const wins=[];for(let r=1;r<8;r++)for(let c=1;c<8;c++)if(RULES.sweets.solved({cuts:[r,c]}))wins.push([r,c]);
  assert.deepEqual(wins,[[3,5]]);
  const s=RULES.sweets.create();for(const move of [{type:'cut',index:0,value:0},{type:'cut',index:0,value:8},{type:'cut',index:2,value:4},{type:'cut',index:1,value:3.5}])assert.equal(RULES.sweets.move(s,move),s);
});
test('ribbon blockers come from visible crossings on both faces, and every legal partial removal can finish',()=>{
  assert.deepEqual(Array.from({length:6},(_,i)=>ribbonBlockers(i)),[[1,3,5],[4,2],[3,5],[],[3,5],[]]);
  for(const face of RIBBON_PATHS)for(let a=0;a<6;a++)for(let b=0;b<6;b++)assert.deepEqual(crossing(face[a],face[b]),crossing(face[b],face[a]));
  let branches=0;const visit=state=>{
    assert.ok(RULES.ribbons.valid(state));if(RULES.ribbons.solved(state)){branches++;return;}
    const choices=[];
    for(let index=0;index<6;index++){
      const oriented={...state,back:!!RIBBON_TAIL_SIDES[index]};
      const next=RULES.ribbons.move(oriented,{type:'pull',index});if(next!==oriented)choices.push(next);
    }
    assert.ok(choices.length,'a legal removal must never strand the player');choices.forEach(visit);
  };
  visit(RULES.ribbons.create());assert.equal(branches,4);
  assert.equal(RIBBON_LAYERS.length,6);const initial=RULES.ribbons.create();assert.equal(RULES.ribbons.move(initial,{type:'pull',index:0}),initial);
  assert.equal(RULES.ribbons.valid({back:false,removed:[0]}),false);
});
test('the actual holes reveal the birth year, and knowing the code never requires a hidden presentation action',()=>{
  assert.deepEqual(BIRTHDAY_CODE,[2,0,0,6]);
  assert.deepEqual(ribbonHoles(false).map((row,col)=>BIRTHDAY_GRID[row][col]),BIRTHDAY_CODE);
  assert.notDeepEqual(ribbonHoles(true).map((row,col)=>BIRTHDAY_GRID[row][col]),BIRTHDAY_CODE);
  const solved=solvedProgress('birthdayLock');assert.ok(RULES.birthdayLock.solved(solved));
  for(const patch of [{back:false},{turned:true},...[0,1,2].map(i=>({fitted:[0,1,2].map(j=>j!==i)}))]){
    const partial={...solved,opened:false,...patch},next=RULES.birthdayLock.move(partial,{type:'submit'});
    assert.equal(next.opened,true);assert.deepEqual(next.values,BIRTHDAY_CODE);
  }
  assert.equal(RULES.birthdayLock.valid({...solved,values:[0,0,0,0]}),false);
});
test('the birthday has two independent branches which converge only at the candles',()=>{
  for(const order of [['sweets','ribbons','birthdayLock','chocolate','cocoa'],['chocolate','cocoa','ribbons','sweets','birthdayLock']]){
    let s=workshop();assert.ok(sceneOpen(s,'party'));assert.ok(access(s,'sweets').ready);assert.ok(access(s,'ribbons').ready);
    for(const [index,id] of order.entries()){assert.ok(access(s,id).ready,id);s=finish(s,id);assert.ok(s.solved.includes(id));assert.equal(birthdayReady(s),index===order.length-1);}
    assert.ok(reduce(s,{type:'ending'}).ending);
  }
});
test('fitting checks real ownership, supports undo and reload, and does not consume any of the three tools',()=>{
  let s=finish(workshop(),'ribbons');assert.ok(access(s,'birthdayLock').ready);
  const fit=index=>({type:'move',id:'birthdayLock',move:{type:'fit',index}});
  assert.equal(reduce(s,fit(0)),s);
  s=reduce(s,fit(1));assert.deepEqual(s.progress.birthdayLock.fitted,[false,true,false]);
  assert.deepEqual(normalizeState(serializable(s)).progress.birthdayLock.fitted,[false,true,false]);
  s=reduce(s,{type:'undo',id:'birthdayLock'});assert.deepEqual(s.progress.birthdayLock.fitted,[false,false,false]);
  s=finish(s,'sweets');const owned=inventory(s);s=finish(s,'birthdayLock');assert.deepEqual(inventory(s),owned);
  const forged=serializable(finish(workshop(),'ribbons'));forged.solved.push('birthdayLock');forged.progress.birthdayLock=solvedProgress('birthdayLock');
  const restored=normalizeState(forged);assert.equal(restored.solved.includes('birthdayLock'),false);assert.deepEqual(restored.progress.birthdayLock.fitted,[false,true,true]);assert.equal(restored.progress.birthdayLock.opened,false);
});
test('V2.5 saves keep their completed old puzzles and birthday, without invented new completions',()=>{
  let old=workshop();old=finish(finish(old,'chocolate'),'cocoa');old={...serializable(old),revision:4,ending:true};
  for(const id of ['sweets','ribbons','birthdayLock'])delete old.progress[id];
  const restored=normalizeState(old);assert.deepEqual(restored.solved,old.solved);assert.ok(restored.ending);assert.ok(restored.solved.includes('cocoa'));
  const partial=normalizeState({...old,ending:false});assert.equal(birthdayReady(partial),false);assert.ok(partial.solved.includes('cocoa'));assert.ok(access(partial,'sweets').ready);
});
