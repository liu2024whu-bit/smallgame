import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,reduce,inventory,normalizeState,serializable,access} from '../src/core/state.js';
import {WITNESSES,finish} from './witnesses.mjs';
import {pendingRewards} from '../src/data/rewards.js';

function start(){let s=reduce(createState(),{type:'start'});for(const id of ['bookmark','thread'])s=reduce(s,{type:'pickup',id});return s;}
const unlock=(s,id)=>WITNESSES[id].reduce((state,move)=>reduce(state,{type:'move',id,move}),s);

test('a genuine unlocked drawer keeps its reward until picked up, including after reload',()=>{
 let s=unlock(start(),'paper');assert.ok(s.solved.includes('paper'));
 assert.deepEqual(inventory(s),['bookmark','thread']);assert.deepEqual(pendingRewards(s,'paper'),['transparency']);
 s=normalizeState(serializable(s));assert.ok(s.solved.includes('paper'));assert.deepEqual(pendingRewards(s,'paper'),['transparency']);
 const taken=reduce(s,{type:'pickup',id:'transparency'});assert.ok(inventory(taken).includes('transparency'));assert.deepEqual(pendingRewards(taken,'paper'),[]);
 assert.equal(reduce(taken,{type:'pickup',id:'transparency'}),taken);assert.deepEqual(normalizeState(serializable(taken)).collected,taken.collected);
});
test('two exposed tools can be picked up separately; unlocking alone cannot power a later mechanism',()=>{
 let s=finish(start(),'paper');s=unlock(s,'cloud');assert.equal(access(s,'calibration').ready,false);
 assert.deepEqual(pendingRewards(s,'cloud'),['mirror','crank']);s=reduce(s,{type:'pickup',id:'crank'});
 s=normalizeState(serializable(s));assert.deepEqual(pendingRewards(s,'cloud'),['mirror']);assert.equal(access(s,'calibration').ready,false);
 s=reduce(s,{type:'pickup',id:'mirror'});assert.ok(access(s,'calibration').ready);assert.deepEqual(pendingRewards(s,'cloud'),[]);
});
test('claiming a reward before its real source opens grants nothing, and malformed saved ownership is rejected',()=>{
 const initial=start();for(const id of ['transparency','mirror','board','no-such-object'])assert.equal(reduce(initial,{type:'pickup',id}),initial);
 const forged=normalizeState({...serializable(initial),collected:['bookmark','thread','mirror','transparency','board'],solved:['paper','cloud']});
 assert.deepEqual(forged.collected,['bookmark','thread']);assert.deepEqual(forged.solved,[]);
 for(const collected of [null,'bookmark thread mirror',{includes:'mirror'},[null,1,{},'mirror']])assert.deepEqual(normalizeState({...serializable(initial),collected}).collected,[]);
 let missing=unlock(unlock(start(),'paper'),'cloud');missing.progress.calibration={values:[2,1,3],fitted:[false,false,false],flipped:true,lit:false,proof:{values:[2,1,3],flipped:true}};missing.solved.push('calibration');
 assert.ok(!normalizeState(serializable(missing)).solved.includes('calibration'));
});
test('revision 9 genuinely received automatic tools and keeps them; new saves never manufacture unclaimed tools',()=>{
 const s=unlock(unlock(start(),'paper'),'cloud');const old={...serializable(s),revision:9};
 const restored=normalizeState(old);assert.ok(['transparency','mirror','crank'].every(id=>inventory(restored).includes(id)));
 assert.deepEqual(normalizeState(serializable(restored)),restored);
 const current=normalizeState(serializable(s));assert.deepEqual(inventory(current),['bookmark','thread']);
});
