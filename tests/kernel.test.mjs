import test from 'node:test';
import assert from 'node:assert/strict';
import {cloud,drawers,flips,packing,melody,pieceCells} from '../src/index.js';

function search(rule,actions){
 const start=rule.create(),queue=[{state:start,path:[]}],seen=new Set([JSON.stringify(start)]);
 for(let i=0;i<queue.length;i++){
  const {state,path}=queue[i];assert.ok(rule.valid(state));
  if(rule.solved(state))return path;
  for(const action of actions){
   const before=JSON.stringify(state),next=rule.move(state,action);assert.equal(JSON.stringify(state),before);assert.ok(rule.valid(next));
   const key=JSON.stringify(next);if(!seen.has(key)){seen.add(key);queue.push({state:next,path:[...path,action]});}
  }
 }
 return null;
}

for(const [name,rule,actions] of [
 ['coupled rotors',cloud,Array.from({length:3},(_,index)=>({type:'turn',index,direction:1}))],
 ['interlocking drawers',drawers,Array.from({length:4},(_,index)=>({type:'drawer',index}))],
 ['neighbor flips',flips,Array.from({length:9},(_,index)=>({type:'flip',index}))],
])test(name+' has a valid reachable solution without mutating previous states',()=>{
 const route=search(rule,actions);assert.ok(route?.length>0);assert.ok(rule.solved(route.reduce((state,action)=>rule.move(state,action),rule.create())));
});

test('packing preserves a complete print, refuses overlap, and retains the removed turn',()=>{
 let state=packing.create();const start=structuredClone(state);
 const layout=[{row:0,column:0,turn:0},{row:0,column:3,turn:1},{row:2,column:0,turn:2},{row:1,column:0,turn:1},{row:2,column:2,turn:0}];
 for(const [id,position] of layout.entries()){state=packing.move(state,{type:'drop',id,...position});assert.ok(packing.valid(state));}
 assert.ok(packing.solved(state));assert.deepEqual(start,packing.create());
 const cells=layout.flatMap((p,id)=>pieceCells(id,p.turn).map(([r,c])=>(p.row+r)*5+p.column+c));
 assert.equal(new Set(cells).size,20);
 assert.equal(packing.move(state,{type:'drop',id:1,row:0,column:0,turn:1}),state);
 const removed=packing.move(state,{type:'unplace',id:1});assert.equal(removed.turn,1);assert.equal(removed.placed[1],null);assert.equal(state.placed[1].turn,1);
});

test('notes accept five detents, wrap at the edge and validate the relative solution',()=>{
 const initial=melody.create();let state=initial;
 for(const [index,note] of [0,2,1,3,2,0].entries())state=melody.move(state,{type:'set-note',index,note});
 assert.ok(melody.solved(state));assert.deepEqual(initial.notes,[2,2,2,2,2,2]);
 assert.equal(melody.move(state,{type:'set-note',index:0,note:5}),state);
 assert.equal(melody.move(state,{type:'note',index:0,direction:-1}).notes[0],4);
});
