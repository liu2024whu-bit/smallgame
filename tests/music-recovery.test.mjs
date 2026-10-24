import test from 'node:test';
import assert from 'node:assert/strict';
import {createMusicPlayer} from '../src/services/music-player.js';
import {createState} from '../src/core/state.js';

const settle=()=>new Promise(resolve=>setImmediate(resolve));
function harness(reject=()=>false,libraryOverrides={}){
  const doc=new EventTarget();doc.hidden=false;const online=new EventTarget(),voices=[],attempts=[];
  let settings={...createState().settings},player;
  const set=patch=>{settings={...settings,...patch};return player.configure(settings);};
  const media=async(source,offset,ended,failed)=>{
    attempts.push(source);if(reject(source))throw Error('Network unavailable');
    const deck={source,time:offset,duration:60,ended,failed,stopped:false,stop(){this.stopped=true;}};voices.push(deck);return deck;
  };
  player=createMusicPlayer({context:()=>({state:'running'}),document:doc,connectivity:online,media,
    probe:async()=>60,library:{list:async()=>[],get:async()=>null,put:async()=>true,close:async()=>{},...libraryOverrides},
    advance:id=>{if(id!==settings.musicTrack)set({musicTrack:id});}});
  set({});return {player,voices,attempts,set,online};
}
test('a repeated song starts again even when the core preference does not change',async()=>{
  const h=harness();try{
    h.set({musicOrder:'repeat'});await h.player.engage();h.voices[0].time=60;h.voices[0].ended();await settle();
    assert.equal(h.voices.length,2);assert.equal(h.voices[1].time,0);assert.equal(h.player.snapshot().playing,true);assert.equal(h.player.snapshot().id,'window');
  }finally{await h.player.dispose();}
});
test('a failed requested recording leaves the previous native deck playing at its actual position',async()=>{
  const h=harness(source=>String(source).includes('outer'));try{
    await h.player.engage();const original=h.voices[0];original.time=23;
    await h.set({musicTrack:'encounter'});await settle();
    assert.equal(h.player.snapshot().id,'window');assert.equal(h.player.snapshot().time,23);assert.equal(original.stopped,false);
    assert.equal(h.player.snapshot().playing,true);assert.ok(h.player.snapshot().notice.includes('遇见'));
    assert.ok(h.player.snapshot().unavailable.includes('encounter'));
  }finally{await h.player.dispose();}
});
test('a failed cold start can fall back once to the included score',async()=>{
  const h=harness(source=>String(source).includes('outer'));try{
    h.set({musicTrack:'encounter'});await h.player.engage();await settle();
    assert.equal(h.player.snapshot().id,'window');assert.equal(h.player.snapshot().playing,true);
    assert.equal(h.attempts.length,2);
  }finally{await h.player.dispose();}
});
test('ordinary game gestures do not repeatedly retry a dead source; explicit retry and connectivity can',async()=>{
  const h=harness(()=>true);try{
    await h.player.engage();assert.equal(h.player.snapshot().status,'error');
    for(let i=0;i<5;i++)await h.player.engage();assert.equal(h.attempts.length,1);
    await h.player.retry();assert.equal(h.attempts.length,2);
    h.online.dispatchEvent(new Event('online'));await settle();assert.equal(h.attempts.length,3);
    assert.equal(h.player.snapshot().playing,false);
  }finally{await h.player.dispose();}
});
test('a deck that fails during the short cross-fade can restore the retiring recording',async()=>{
  const h=harness();try{
    await h.player.engage();const original=h.voices[0];original.time=18;
    await h.set({musicTrack:'encounter'});await settle();h.voices[1].failed('Connection lost');await settle();
    assert.equal(h.player.snapshot().id,'window');assert.equal(h.player.snapshot().time,18);assert.equal(original.stopped,false);
  }finally{await h.player.dispose();}
});
test('automatic order skips a recording that already failed in this playback session',async()=>{
  const h=harness(source=>String(source).includes('/pages.mp3'));try{
    await h.player.engage();await h.set({musicTrack:'pages'});await settle();h.voices[0].ended();await settle();
    assert.equal(h.player.snapshot().id,'starlight');assert.equal(h.player.snapshot().playing,true);
  }finally{await h.player.dispose();}
});
test('a failed birthday interlude restores the original time and leaves the selected song intact',async()=>{
  const h=harness(source=>String(source).endsWith('/birthday.mp3'));try{
    await h.player.engage();h.voices[0].time=24;await h.player.playOnce('birthday');await settle();
    assert.equal(h.player.snapshot().id,'window');assert.equal(h.player.snapshot().time,24);assert.equal(h.player.snapshot().playing,true);
  }finally{await h.player.dispose();}
});

test('a playable native deck seeks directly instead of opening another recording',async()=>{
  const h=harness();try{
    await h.player.engage();const original=h.voices[0];original.seek=async value=>{original.time=value;};
    await h.player.seek(29);assert.equal(h.voices.length,1);assert.equal(original.stopped,false);
    assert.equal(h.player.snapshot().time,29);assert.equal(h.player.snapshot().playing,true);
  }finally{await h.player.dispose();}
});

test('an imported replacement for the current title actually changes the playing recording',async()=>{
  const files=new Map(),h=harness(()=>false,{get:async id=>files.get(id)??null,put:async(id,file)=>{files.set(id,file);return true;}});
  try{
    await h.player.engage();await h.set({musicTrack:'encounter'});await settle();
    const file=new File([1],'birthday-listen.wav',{type:'audio/wav'});await h.player.add('encounter',file);await h.player.retry();
    assert.equal(h.voices.at(-1).source,file);assert.equal(h.player.snapshot().source.kind,'local');assert.equal(h.player.snapshot().source.name,file.name);
    assert.equal(h.player.snapshot().playing,true);
  }finally{await h.player.dispose();}
});

test('a broken replacement is not retried on every ordinary gesture while the old edition continues',async()=>{
  const files=new Map(),h=harness(source=>typeof source!=='string',{get:async id=>files.get(id)??null,put:async(id,file)=>{files.set(id,file);return true;}});
  try{
    await h.player.engage();await h.set({musicTrack:'encounter'});await settle();
    await h.player.add('encounter',new File([1],'replacement.wav',{type:'audio/wav'}));await h.player.retry();
    assert.equal(h.player.snapshot().playing,true);assert.match(h.player.snapshot().notice,/原来这一版/);
    const count=h.attempts.length;for(let n=0;n<4;n++)await h.player.engage();assert.equal(h.attempts.length,count);
    await h.player.retry();assert.equal(h.attempts.length,count+1);
  }finally{await h.player.dispose();}
});
