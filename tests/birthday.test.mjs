import test from 'node:test';
import assert from 'node:assert/strict';
import { RULES } from '../src/puzzles/index.js';
import { CHOCOLATE_PATTERN, CHOCOLATE_ROWS, CHOCOLATE_COLUMNS, runs } from '../src/data/birthday.js';
import { createState, reduce, normalizeState, serializable, access, inventory } from '../src/core/state.js';
import { sceneOpen, openScenes, neighborScene } from '../src/core/exploration.js';
import { MAIN_IDS } from '../src/data/puzzles.js';
import { finish } from './witnesses.mjs';

const start=()=>['bookmark','thread'].reduce((s,id)=>reduce(s,{type:'pickup',id}),reduce(createState(),{type:'start'}));
const beforeBirthday=()=>MAIN_IDS.slice(0,MAIN_IDS.indexOf('chocolate')).reduce(finish,start());
const handle=s=>reduce(s,{type:'use-tool',item:'crank',target:'birthday-door'});

test('the printed runs determine one negative-space star; the old sheet is still needed',()=>{
  const lines=Array.from({length:32},(_,n)=>Array.from({length:5},(_,i)=>(n>>i)&1));
  const choices=CHOCOLATE_ROWS.map(clue=>lines.filter(line=>JSON.stringify(runs(line))===JSON.stringify(clue)));
  const winners=[];
  function visit(rows){
    if(rows.length===5){if(CHOCOLATE_COLUMNS.every((clue,c)=>JSON.stringify(runs(rows.map(row=>row[c])))===JSON.stringify(clue)))winners.push(rows.flat());return;}
    for(const line of choices[rows.length])visit([...rows,line]);
  }
  visit([]);assert.deepEqual(winners,[CHOCOLATE_PATTERN]);
  let s=RULES.chocolate.create();
  s=RULES.chocolate.move(s,{type:'paint',indexes:CHOCOLATE_PATTERN.flatMap((v,i)=>v?[i]:[]),value:0});
  assert.equal(RULES.chocolate.solved(s),false);
  s=RULES.chocolate.move(s,{type:'cover'});assert.ok(RULES.chocolate.solved(s));
  assert.equal(RULES.chocolate.move(s,{type:'mark',index:0}),s);
});

test('painting empty cups is atomic, undoable and rejects invalid cells',()=>{
  let s=handle(beforeBirthday()),before=s.progress.chocolate;
  s=reduce(s,{type:'move',id:'chocolate',move:{type:'paint',indexes:[2,5,6,7,8,9],value:0}});
  assert.equal(s.history.chocolate.length,1);
  assert.deepEqual(reduce(s,{type:'undo',id:'chocolate'}).progress.chocolate,before);
  for(const indexes of [[25],[-1],[1,2.2],[],[0,'1']])assert.equal(RULES.chocolate.move(before,{type:'paint',indexes,value:0}),before);
  const covered=RULES.chocolate.move(before,{type:'cover'});
  assert.equal(RULES.chocolate.solved(covered),false);
  assert.deepEqual(RULES.chocolate.move(covered,{type:'cover'}),before);
});

test('all reachable cocoa pours conserve eight units and four/four is seven pours away',()=>{
  const queue=[{state:RULES.cocoa.create(),depth:0}],seen=new Set(['8,0,0']);let shortest;
  for(let i=0;i<queue.length;i++){
    const {state,depth}=queue[i];
    assert.ok(RULES.cocoa.valid(state));
    if(RULES.cocoa.solved(state)&&shortest===undefined)shortest=depth;
    for(let from=0;from<3;from++)for(let to=0;to<3;to++){
      const next=RULES.cocoa.move(state,{type:'pour',from,to});assert.ok(RULES.cocoa.valid(next));
      const key=next.levels.join();if(!seen.has(key)){seen.add(key);queue.push({state:next,depth:depth+1});}
    }
  }
  assert.equal(shortest,7);assert.ok(seen.size>10);
  const initial=RULES.cocoa.create();
  for(const [from,to] of [[0,0],[-1,1],[0,3],[1,0],[0,1.5]])assert.equal(RULES.cocoa.move(initial,{type:'pour',from,to}),initial);
  assert.equal(RULES.cocoa.valid({levels:[4,0,0]}),false);
});

test('scene thresholds open in order, and the birthday needs the actual reusable handle',()=>{
  let s=start();assert.equal(openScenes(s).length,4);
  assert.equal(neighborScene({...s,scene:'entry'},1),'desk');
  assert.equal(reduce(s,{type:'scene',id:'rain'}),s);
  for(const id of ['paper','cloud','calibration'])s=finish(s,id);
  assert.ok(sceneOpen(s,'rain'));assert.equal(sceneOpen(s,'atelier'),false);
  s=beforeBirthday();assert.ok(inventory(s).includes('crank'));assert.ok(sceneOpen(s,'atelier'));
  assert.equal(sceneOpen(s,'birthday'),false);assert.equal(access(s,'chocolate').ready,false);
  assert.equal(reduce(s,{type:'use-tool',item:'mirror',target:'birthday-door'}),s);
  s=handle(s);assert.ok(sceneOpen(s,'birthday'));assert.ok(access(s,'chocolate').ready);
  assert.equal(handle(s),s);assert.ok(inventory(s).includes('crank'));
  assert.ok(sceneOpen(normalizeState(serializable(s)),'birthday'));
});

test('locked-scene imports and malformed placed tools cannot bypass the chain',()=>{
  for(const usedTools of [null,4,{},'birthday-door',['birthday-door']]){
    const s=normalizeState({...createState(),begun:true,scene:'birthday',usedTools,ending:true});
    assert.equal(s.scene,'desk');assert.deepEqual(s.usedTools,[]);assert.equal(s.ending,false);
  }
  const s=beforeBirthday();assert.equal(handle(start()).usedTools.length,0);
  assert.equal(reduce(s,{type:'ending'}),s);
  assert.equal(reduce(s,{type:'activity',id:'birthday:unwrap'}),s);
});

test('a completed V2.2 birthday survives two reloads while its new puzzles remain untouched',()=>{
  const old={...serializable(beforeBirthday()),revision:3,ending:true,scene:'entry'};delete old.usedTools;
  const restored=normalizeState(old),again=normalizeState(serializable(restored));
  for(const s of [restored,again]){
    assert.ok(s.ending);assert.ok(sceneOpen(s,'birthday'));
    assert.equal(s.solved.includes('chocolate'),false);assert.equal(s.solved.includes('cocoa'),false);
  }
  const partial=normalizeState({...old,ending:false,scene:'birthday'});
  assert.equal(sceneOpen(partial,'birthday'),false);assert.equal(partial.scene,'desk');
});
