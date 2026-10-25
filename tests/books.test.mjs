import test from 'node:test';
import assert from 'node:assert/strict';
import {books,booksFit} from '../src/puzzles/books.js';
import {enumeratePermutations} from '../src/puzzles/common.js';
import {createState,reduce,normalizeState,serializable,access} from '../src/core/state.js';
import {PUZZLE_BY_ID} from '../src/data/puzzles.js';
import {WITNESSES} from './witnesses.mjs';

const target=[3,0,4,1,2];
function beforeBooks(){
 let s=reduce(createState(),{type:'start'});
 for(const id of ['bookmark','thread'])s=reduce(s,{type:'pickup',id});
 for(const id of ['paper','cloud','calibration','postbox']){
  for(const move of WITNESSES[id])s=reduce(s,{type:'move',id,move});
  for(const item of PUZZLE_BY_ID[id].rewards)s=reduce(s,{type:'pickup',id:item});
 }
 return s;
}
test('library ordering has one physical solution, requiring the slip and an actual drawer pull',()=>{
 const seed=books.create();assert.equal(books.move(seed,{type:'reorder',from:0,to:2}),seed);
 assert.equal(books.move({...seed,order:target},{type:'submit'}).opened,false);
 const fixed=books.move(seed,{type:'fit',index:0});
 const winners=[];
 for(const order of enumeratePermutations(seed.order)){
  const current={...fixed,order};assert.equal(books.solved(current),false);
  const result=books.move(current,{type:'submit'});assert.ok(books.valid(result));
  assert.equal(books.solved(result),booksFit(order));if(result.opened)winners.push(order);
 }
 assert.deepEqual(winners,[target]);
 const opened=books.move({...fixed,order:target},{type:'submit'});
 assert.deepEqual(opened.fitted,[false]);assert.equal(books.move(opened,{type:'shift',index:0,direction:1}),opened);
 const loose=books.move(fixed,{type:'unfit',index:0});assert.equal(books.move(loose,{type:'shift',index:0,direction:1}),loose);
});
test('the library slip is a real owned input and rewards remain in the drawer until each pickup',()=>{
 let s=beforeBooks();const raw=serializable(s);raw.collected=raw.collected.filter(id=>id!=='borrowSlip');
 const unclaimed=normalizeState(raw);assert.deepEqual(access(unclaimed,'books').missing,['borrowSlip']);
 assert.equal(reduce(unclaimed,{type:'move',id:'books',move:{type:'fit',index:0}}),unclaimed);
 for(const move of WITNESSES.books)s=reduce(s,{type:'move',id:'books',move});
 assert.ok(s.solved.includes('books'));assert.ok(!s.collected.includes('pageA')&&!s.collected.includes('needle'));
 s=reduce(s,{type:'pickup',id:'pageA'});const restored=normalizeState(serializable(s));
 assert.ok(restored.solved.includes('books'));assert.ok(restored.collected.includes('pageA')&&!restored.collected.includes('needle'));
 const last=reduce(restored,{type:'pickup',id:'needle'});assert.equal(last.collected.filter(id=>id==='needle').length,1);
});
test('old library permutations and genuine completions migrate without inventing new pickups',()=>{
 const s=beforeBooks(),raw=serializable(s);raw.revision=11;raw.progress.books={order:[1,2,0,3,4]};
 let restored=normalizeState(raw);assert.deepEqual(restored.progress.books.order,[1,2,0,3,4]);assert.equal(restored.progress.books.opened,false);
 raw.progress.books={order:target};raw.solved.push('books');restored=normalizeState(raw);
 assert.ok(restored.solved.includes('books'));assert.deepEqual(restored.progress.books.fitted,[false]);
 assert.ok(!restored.collected.includes('pageA')&&!restored.collected.includes('needle'));
 assert.deepEqual(normalizeState(serializable(restored)),restored);
 raw.progress.calibration=createState().progress.calibration;
 assert.ok(!normalizeState(raw).solved.includes('books'));
});
