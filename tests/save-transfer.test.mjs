import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,reduce,serializable} from '../src/core/state.js';
import {parseSave} from '../src/core/storage.js';
import {createStore} from '../src/core/store.js';
import {saveFilename,encodeSave,deliverSave} from '../src/services/save-file.js';
import {bindSaveTransfer} from '../src/services/save-transfer.js';

const progress=()=>{
  let state=reduce(createState(),{type:'start'});
  state=reduce(state,{type:'pickup',id:'bookmark'});
  return reduce(state,{type:'setting',key:'clearText',value:true});
};
function downloadHarness(){
  const calls=[],links=[],blobs=[],timers=[];
  return {calls,links,blobs,timers,
    document:{body:{append:link=>calls.push(['append',link])},createElement:()=>{const link={click:()=>calls.push(['click']),remove:()=>calls.push(['remove'])};links.push(link);return link;}},
    urls:{createObjectURL:blob=>{blobs.push(blob);return 'blob:save';},revokeObjectURL:url=>calls.push(['revoke',url])},
    delay:(callback,ms)=>timers.push({callback,ms}),
  };
}
test('save filenames are recognizable and UTF-8 exports reopen with the same inventory and preferences',()=>{
  assert.equal(saveFilename(new Date(2026,9,24,8,3,5)),'第20圈以前-存档-20261024-080305-000.json');
  const state=progress(),text=encodeSave(state);
  assert.ok(text.endsWith('\n'));assert.ok(text.includes('\n  "version":'));
  assert.deepEqual(serializable(parseSave(text)),serializable(state));
  assert.deepEqual(serializable(parseSave('\uFEFF'+text)),serializable(state));
  assert.throws(()=>parseSave('{"version":1}'));
});
test('native save reports success only after the chosen file has closed',async()=>{
  const events=[],state=progress(),name=saveFilename(new Date(2026,9,24));
  let written;
  const picker=async options=>{
    events.push('choose');assert.equal(options.suggestedName,name);assert.equal(options.startIn,'downloads');
    return {name:'给小屋留的一页.json',createWritable:async()=>({
      write:async blob=>{written=await blob.text();events.push('write');},
      close:async()=>events.push('close'),
    })};
  };
  const result=await deliverSave({text:encodeSave(state),name,picker});
  assert.deepEqual(events,['choose','write','close']);
  assert.deepEqual(result,{status:'saved',method:'picker',name:'给小屋留的一页.json'});
  assert.deepEqual(serializable(parseSave(written)),serializable(state));
});
test('cancelling the native dialog never starts a browser download',async()=>{
  const h=downloadHarness();
  const result=await deliverSave({...h,text:encodeSave(progress()),name:'save.json',picker:async()=>{throw new DOMException('Cancelled','AbortError');}});
  assert.deepEqual(result,{status:'cancelled'});assert.equal(h.links.length,0);
});
test('a failed native write aborts its stream and does not claim a saved file',async()=>{
  const h=downloadHarness();let aborted=false;
  const result=await deliverSave({...h,text:encodeSave(progress()),name:'save.json',picker:async()=>({createWritable:async()=>({
    write:async()=>{throw Error('Disk full');},close:async()=>assert.fail('must not close after a failed write'),abort:async()=>{aborted=true;},
  })})});
  assert.deepEqual(result,{status:'failed'});assert.equal(aborted,true);assert.equal(h.links.length,0);
});
test('unavailable native saving falls back to a named readable download and keeps its URL alive during handoff',async()=>{
  const h=downloadHarness(),state=progress();
  const result=await deliverSave({...h,text:encodeSave(state),name:'小屋存档.json',picker:async()=>{throw new DOMException('Unavailable','SecurityError');}});
  assert.deepEqual(result,{status:'saved',method:'download',name:'小屋存档.json'});
  assert.equal(h.links[0].download,'小屋存档.json');assert.equal(h.links[0].href,'blob:save');
  assert.equal(h.blobs[0].type,'application/json;charset=utf-8');
  assert.deepEqual(serializable(parseSave(await h.blobs[0].text())),serializable(state));
  assert.deepEqual(h.calls.map(call=>call[0]),['append','click','remove']);
  assert.equal(h.timers[0].ms,15000);h.timers[0].callback();
  assert.deepEqual(h.calls.at(-1),['revoke','blob:save']);
});
test('invalid and oversized imports preserve current progress; a valid file can be read again',async()=>{
  let change,loaded=0;const notices=[],store=createStore(null);
  store.replace(progress());
  const before=serializable(store.get()),input={files:[],value:'',addEventListener:(_,fn)=>{change=fn;}};
  bindSaveTransfer(input,{store,loaded:()=>loaded++,toast:text=>notices.push(text)});
  input.files=[new File(['broken'],'bad.json')];await change();
  assert.deepEqual(serializable(store.get()),before);assert.equal(loaded,0);
  input.files=[{size:200001,text:async()=>assert.fail('oversized data must not be read')}];await change();
  assert.deepEqual(serializable(store.get()),before);assert.equal(loaded,0);
  const replacement=reduce(progress(),{type:'setting',key:'volume',value:.2});
  input.files=[new File([encodeSave(replacement)],'小屋存档.json')];await change();await change();
  assert.deepEqual(serializable(store.get()),serializable(replacement));assert.equal(loaded,2);assert.equal(input.value,'');
  assert.ok(notices.slice(0,2).every(text=>text.includes('原来的进度还在')));
});
