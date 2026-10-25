import test from 'node:test';
import assert from 'node:assert/strict';
import {screen,screenAligned,SCREEN_CODE} from '../src/puzzles/screen.js';
import {createState,reduce,normalizeState,serializable,access,inventory} from '../src/core/state.js';
import {finish,WITNESSES} from './witnesses.mjs';

function upstream(){let s=reduce(createState(),{type:'start'});for(const id of ['bookmark','thread'])s=reduce(s,{type:'pickup',id});for(const id of ['paper','cloud','calibration'])s=finish(s,id);return s;}
const move=(s,action)=>reduce(s,{type:'move',id:'screen',move:action});

test('a connected painting supplies evidence without automatically opening the real lock',()=>{
 let s=screen.create();for(const index of [0,2,3,6,8])s=screen.move(s,{type:'flip',index});
 assert.ok(screenAligned(s.flips));assert.equal(screen.solved(s),false);
 s=screen.move(s,{type:'submit'});assert.equal(s.opened,false);assert.equal(s.attempts,1);
 for(const [index,value] of SCREEN_CODE.entries())s=screen.move(s,{type:'set',index,value});
 assert.equal(s.opened,false);s=screen.move(s,{type:'submit'});assert.ok(screen.solved(s));
});
test('all thousand drum combinations accept exactly the visible code, without a reading flag',()=>{
 const winners=[];for(let n=0;n<1000;n++){let s={...screen.create(),values:[Math.floor(n/100),Math.floor(n/10)%10,n%10]};s=screen.move(s,{type:'submit'});if(screen.solved(s))winners.push(n);}
 assert.deepEqual(winners,[642]);
 const s={...screen.create(),values:[...SCREEN_CODE]},opened=screen.move(s,{type:'submit'});
 assert.ok(screen.solved(opened));assert.equal(screenAligned(opened.flips),false);
 assert.equal(screen.move(opened,{type:'flip',index:0}),opened);
});
test('paper backing has physical position, orientation and reversible independent progress',()=>{
 const initial=screen.create();let s=screen.move(initial,{type:'turn-backing'});s=screen.move(s,{type:'slide',x:17,y:-35});
 assert.deepEqual(s.backing,{x:17,y:-35,turned:false});assert.deepEqual(initial.backing,{x:-80,y:55,turned:true});
 for(const action of [{type:'slide',x:101,y:0},{type:'slide',x:1.5,y:0},{type:'slide',x:NaN,y:0}])assert.equal(screen.move(s,action),s);
 assert.equal(screen.valid({...s,backing:{x:0,y:0,turned:1}}),false);
 let state=upstream();state=move(state,{type:'slide',x:17,y:-35});state=move(state,{type:'turn-backing'});assert.deepEqual(normalizeState(serializable(state)).progress.screen.backing,s.backing);
 state=reduce(state,{type:'undo',id:'screen'});assert.equal(state.progress.screen.backing.turned,true);
 // The tempting 908 is the cut paper, not the ink behind it.
 const front=screen.move({...initial,values:[9,0,8]},{type:'submit'});assert.equal(front.opened,false);
});
test('the real screen source keeps each item until it is taken, including one-item saves',()=>{
 let s=upstream();assert.ok(access(s,'screen').ready);
 // The screen uses its own latch; the reusable crank belongs at the projector.
 const noCrank={...s,collected:s.collected.filter(id=>id!=='crank')};assert.ok(access(noCrank,'screen').ready);
 for(const action of WITNESSES.screen)s=move(s,action);
 assert.ok(s.solved.includes('screen'));assert.ok(!inventory(s).includes('pageB')&&!inventory(s).includes('pulley'));
 s=reduce(s,{type:'pickup',id:'pageB'});s=normalizeState(serializable(s));
 assert.ok(s.solved.includes('screen'));assert.ok(inventory(s).includes('pageB'));assert.ok(!inventory(s).includes('pulley'));
 s=reduce(s,{type:'pickup',id:'pulley'});assert.equal(reduce(s,{type:'pickup',id:'pulley'}),s);
 assert.deepEqual(normalizeState(serializable(s)).collected,s.collected);
});
test('old legitimate screen states migrate while false claims and malformed locks cannot earn rewards',()=>{
 const s=upstream(),partial={...serializable(s),revision:12,progress:{...s.progress,screen:{flips:[1,0,0,0,0,0,0,0,0]}}};
 assert.deepEqual(normalizeState(partial).progress.screen.flips,partial.progress.screen.flips);
 const legacy={...partial,solved:[...s.solved,'screen'],progress:{...partial.progress,screen:{flips:[1,0,1,1,0,0,1,0,1]}},collected:[...s.collected,'pageB']};
 const restored=normalizeState(legacy);assert.ok(restored.solved.includes('screen'));assert.ok(restored.progress.screen.opened);assert.deepEqual(restored.progress.screen.values,SCREEN_CODE);assert.ok(restored.collected.includes('pageB'));assert.ok(!restored.collected.includes('pulley'));
 assert.ok(!normalizeState({...legacy,progress:{...legacy.progress,screen:{flips:Array(9).fill(0)}}}).solved.includes('screen'));
 const unclaimed=normalizeState({...legacy,collected:s.collected});assert.ok(unclaimed.solved.includes('screen'));assert.ok(!unclaimed.collected.includes('pageB'));
 for(const bad of [{...screen.create(),opened:true},{...screen.create(),attempts:-1},{...screen.create(),values:[9,0,NaN]}])assert.equal(screen.valid(bad),false);
});
test('local revision-13 lock previews preserve real completion and partial input across the new layer',()=>{
 const s=upstream(),raw={...serializable(s),revision:13,solved:[...s.solved,'screen'],progress:{...s.progress,screen:{flips:Array(9).fill(0),values:[9,0,8],attempts:1,opened:true}}};
 const old=normalizeState(raw);assert.ok(old.solved.includes('screen'));assert.deepEqual(old.progress.screen.values,SCREEN_CODE);assert.deepEqual(old.progress.screen.backing,{x:0,y:0,turned:false});
 const partial=normalizeState({...raw,solved:s.solved,progress:{...raw.progress,screen:{...raw.progress.screen,opened:false,values:[9,0,3]}}});assert.deepEqual(partial.progress.screen.values,[9,0,3]);assert.ok(!partial.solved.includes('screen'));
 const forged=normalizeState({...raw,progress:{...raw.progress,screen:{...raw.progress.screen,values:[1,2,3]}}});assert.ok(!forged.solved.includes('screen'));
});
