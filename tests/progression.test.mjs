import test from 'node:test';
import assert from 'node:assert/strict';
import {WITNESSES} from './solutions.mjs';
import {createState,reduce} from '../src/core/state.js';
import {PUZZLES,MAIN_IDS} from '../src/data/puzzles.js';
import {RULES} from '../src/puzzles/index.js';
for(const p of PUZZLES)test(p.id+' rules remain solvable',()=>{const done=WITNESSES[p.id].reduce((state,move)=>RULES[p.id].move(state,move),RULES[p.id].create());assert.ok(RULES[p.id].solved(done));});
test('all linked puzzles, pickups and optional endings are reachable',()=>{
 let s=reduce(createState(),{type:'start'});for(const id of ['bookmark','thread'])s=reduce(s,{type:'pickup',id});
 for(const id of [...MAIN_IDS,...PUZZLES.filter(p=>p.optional).map(p=>p.id)]){
  if(id==='stitch')for(const index of [0,3])s=reduce(s,{type:'move',id:'belt',move:{type:'unfit',index}});
  if(id==='chocolate')s=reduce(s,{type:'use-tool',item:'crank',target:'birthday-door'});
  for(const move of WITNESSES[id])s=reduce(s,{type:'move',id,move});
  assert.ok(s.solved.includes(id),id);for(const item of PUZZLES.find(p=>p.id===id).rewards)s=reduce(s,{type:'pickup',id:item});
 }
 assert.equal(s.solved.length,27);assert.ok(reduce(s,{type:'ending'}).ending);
});
