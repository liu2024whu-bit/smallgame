import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,normalizeState,reduce,serializable} from '../src/core/state.js';
import {createStore} from '../src/core/store.js';
import {SAVE_KEY,BACKUP_KEY,writeSave,parseSave} from '../src/core/storage.js';
import {storyPosition} from '../src/core/story.js';
import {nextTrack} from '../src/data/music.js';
import {createMusicLibrary,validateAudio} from '../src/services/music-library.js';
import {createMusicPlayer} from '../src/services/music-player.js';
import {audioOnlyUpdate} from '../src/core/presentation-updates.js';
import {settleAnimations} from '../src/services/motion/shared.js';

test('old saves gain independent audio defaults, reject forged music preferences, and preserve all progress',()=>{
  const old={...createState(),begun:true,settings:{sound:false,volume:.2,motion:false}};
  const restored=normalizeState(old);
  assert.equal(restored.settings.sound,false);assert.equal(restored.settings.volume,.2);
  assert.equal(restored.settings.musicTrack,'window');assert.equal(restored.settings.musicVolume,.65);
  const forged=normalizeState({...old,settings:{musicTrack:'javascript:bad',musicOrder:'unknown',musicVolume:9,effectsVolume:-1,music:'yes'}});
  assert.equal(forged.settings.musicTrack,'window');assert.equal(forged.settings.musicOrder,'cycle');assert.equal(forged.settings.music,true);
  assert.equal(forged.settings.musicVolume,1);assert.equal(forged.settings.effectsVolume,0);
  assert.equal(reduce(restored,{type:'setting',key:'musicTrack',value:'unknown'}).settings.musicTrack,'unknown');
  assert.equal(reduce(restored,{type:'setting',key:'musicVolume',value:NaN}),restored);
  assert.deepEqual(restored.progress,old.progress);
});

test('a confirmed new game removes the old backup, preserves preferences and unrelated storage, and cannot restore test progress',()=>{
  const map=new Map([['other-app','keep'],['smallgame:v1','keep']]);
  const storage={getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};
  const store=createStore(storage);
  store.dispatch({type:'start'});store.dispatch({type:'pickup',id:'bookmark'});
  store.dispatch({type:'setting',key:'musicTrack',value:'starlight'});
  assert.ok(map.has(BACKUP_KEY));store.restart();
  assert.equal(map.has(BACKUP_KEY),false);assert.equal(map.get('other-app'),'keep');assert.equal(map.get('smallgame:v1'),'keep');
  const saved=parseSave(map.get(SAVE_KEY));assert.equal(saved.begun,false);assert.deepEqual(saved.collected,[]);
  assert.equal(saved.settings.musicTrack,'starlight');assert.deepEqual(saved.progress,createState().progress);
  assert.equal(JSON.stringify(serializable(saved)).includes('blob:'),false);
});

test('failed fresh-save writes leave the previous readable progress and backup available',()=>{
  const map=new Map(),storage={getItem:key=>map.get(key),setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};
  const begun=reduce(createState(),{type:'start'});writeSave(storage,createState());writeSave(storage,begun);
  const previous=map.get(SAVE_KEY),backup=map.get(BACKUP_KEY);
  const blocked={...storage,setItem(){throw Error('Disk full');}};
  assert.equal(writeSave(blocked,createState(),{fresh:true}),false);
  assert.equal(map.get(SAVE_KEY),previous);assert.equal(map.get(BACKUP_KEY),backup);
});

test('story labels derive from real completion and never add a second progression system',()=>{
  const state=createState();assert.equal(storyPosition(state).chapter,'散着的几页');
  assert.equal(storyPosition({...state,solved:['stitch']}).chapter,'合上的画册');
  assert.equal(storyPosition({...state,usedTools:['birthday-door']}).chapter,'门后的生日');
  assert.equal(storyPosition({...state,ending:true}).chapter,'愿望收好啦');
});

test('playlist order skips absent recordings, repeats on request, and never invents an available song',()=>{
  assert.equal(nextTrack('window',['window','pages','encounter']),'pages');
  assert.equal(nextTrack('encounter',['window','pages','encounter']),'window');
  assert.equal(nextTrack('birds',['window','starlight']),'window');
  assert.equal(nextTrack('pages',['window','pages'],'repeat'),'pages');
  assert.equal(nextTrack('window',[]),null);
});

test('background audio preferences do not replace an active puzzle while real puzzle and visual changes still render',()=>{
  const state=reduce(createState(),{type:'start'});
  assert.equal(audioOnlyUpdate(state,reduce(state,{type:'setting',key:'musicTrack',value:'pages'})),true);
  assert.equal(audioOnlyUpdate(state,reduce(state,{type:'setting',key:'motion',value:false})),false);
  assert.equal(audioOnlyUpdate(state,reduce(state,{type:'pickup',id:'bookmark'})),false);
  assert.equal(audioOnlyUpdate(state,state),false);
});

test('reducing motion completes an active finite transition and cancels an infinite ornament without reversing the transition',()=>{
  const calls=[];
  const animation=iterations=>({playState:'running',effect:{getComputedTiming:()=>({iterations})},finish:()=>calls.push('finish'),cancel:()=>calls.push('cancel')});
  settleAnimations({getAnimations:()=>[animation(1),animation(Infinity),{playState:'finished'}]});
  assert.deepEqual(calls,['finish','cancel']);
});

test('audio imports reject non-audio and oversized data; blocked storage supports only this session',async()=>{
  const file=new File([new Uint8Array([1,2])],'local.wav',{type:'audio/wav'});
  assert.throws(()=>validateAudio({size:3,type:'text/html',name:'page.html'},'encounter'));
  assert.throws(()=>validateAudio({size:100*1024*1024,type:'audio/wav'},'encounter'));
  assert.throws(()=>validateAudio(file,'window'));
  const library=createMusicLibrary(null);
  assert.equal(await library.put('encounter',file),false);
  assert.deepEqual(await library.list(),['encounter']);assert.equal(await library.get('encounter'),file);
  await library.remove('encounter');assert.deepEqual(await library.list(),[]);await library.close();
});

function playerHarness(overrides={}){
  const doc=new EventTarget();doc.hidden=false;
  const voices=[],context={state:'running',currentTime:0,createGain:()=>({gain:{value:0,setTargetAtTime(){},cancelScheduledValues(){}},connect(){},disconnect(){}})};
  const library={list:async()=>[],get:async()=>new Blob([1]),put:async()=>true,remove:async()=>{},close:async()=>{}};
  const media=async(source,offset,ended,onError,options)=>{
    if(overrides.media&&!(typeof source==='string'&&source.startsWith('assets/')))return overrides.media(source,offset,ended,onError,options);
    const deck={source,time:offset,duration:60,stopped:false,ended,volume:0,stop(){this.stopped=true;}};voices.push(deck);return deck;
  };
  let player,settings={...createState().settings};
  const {media:custom,...rest}=overrides;
  player=createMusicPlayer({context:()=>context,library,document:doc,advance:id=>{if(id!==settings.musicTrack)set({musicTrack:id});},...rest,media});
  const set=patch=>{settings={...settings,...patch};player.configure(settings);};
  set({});return {player,voices,doc,set};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('music waits for a gesture, stops in background, resumes at the actual position, and respects pause',async()=>{
  const {player,voices,doc,set}=playerHarness();await player.ready;assert.equal(voices.length,0);
  await player.engage();assert.equal(player.snapshot().playing,true);voices[0].time=18;
  doc.hidden=true;doc.dispatchEvent(new Event('visibilitychange'));assert.equal(voices[0].stopped,true);assert.equal(player.snapshot().time,18);
  doc.hidden=false;doc.dispatchEvent(new Event('visibilitychange'));await settle();assert.equal(voices[1].time,18);
  set({music:false});assert.equal(player.snapshot().playing,false);await player.engage();assert.equal(voices.length,2);
  await player.dispose();assert.ok(voices.every(deck=>deck.stopped));
});

test('paused music retains its duration, permits seeking, and resumes from the chosen position',async()=>{
  const h=playerHarness();await h.player.engage();h.voices[0].time=23;h.set({music:false});
  assert.equal(h.player.snapshot().duration,60);assert.equal(h.player.snapshot().time,23);
  await h.player.seek(42);assert.equal(h.player.snapshot().playing,false);assert.equal(h.player.snapshot().time,42);
  h.set({music:true});await settle();assert.equal(h.voices.at(-1).time,42);await h.player.dispose();
});

test('switching back during a pending local recording cancels it without replacing the current song',async()=>{
  let release,waiting;
  const pending=new Promise(resolve=>{release=resolve;});
  const h=playerHarness({media:async()=>{waiting=true;return pending;}});await h.player.engage();h.set({musicTrack:'encounter'});await settle();assert.ok(waiting);
  h.set({musicTrack:'window'});
  const late={time:0,duration:20,stopped:false,stop(){this.stopped=true;}};
  release(late);await settle();assert.equal(late.stopped,true);assert.equal(h.player.snapshot().id,'window');assert.equal(h.player.snapshot().playing,true);
  assert.equal(h.voices[0].stopped,false);await h.player.dispose();
});

test('pause while a different recording is loading never borrows the previous song position',async()=>{
  let release;const pending=new Promise(resolve=>{release=resolve;});
  const h=playerHarness({media:async()=>pending});await h.player.engage();h.voices[0].time=37;
  h.set({musicTrack:'encounter'});await settle();h.set({music:false});
  assert.equal(h.player.snapshot().time,0);assert.equal(h.player.snapshot().duration,0);
  const late={time:0,duration:10,stop(){this.stopped=true;}};release(late);await settle();assert.equal(late.stopped,true);assert.equal(h.player.snapshot().playing,false);await h.player.dispose();
});

test('a failed switch preserves the previous recording, and rejected imports are not retained',async()=>{
  let put=0;
  const h=playerHarness({media:async()=>{throw new Error('Unreadable media');},probe:async()=>{throw new Error('Invalid audio');},library:{list:async()=>[],get:async()=>new Blob([1]),put:async()=>{put++;},close:async()=>{}}});
  await h.player.engage();h.set({musicTrack:'encounter'});await settle();assert.equal(h.player.snapshot().status,'playing');assert.equal(h.player.snapshot().id,'window');assert.equal(h.voices[0].stopped,false);assert.ok(h.player.snapshot().notice);
  await assert.rejects(h.player.add('encounter',new File([1],'broken.wav',{type:'audio/wav'})));assert.equal(put,0);
  assert.equal(h.player.snapshot().imported.includes('encounter'),false);await h.player.dispose();
});

test('birthday music plays once and restores the previous song position without changing its preference',async()=>{
  const h=playerHarness();await h.player.engage();h.voices[0].time=24;
  await h.player.playOnce('birthday');assert.equal(h.player.snapshot().id,'birthday');
  const birthday=h.voices.at(-1);birthday.ended();await settle();
  assert.equal(h.player.snapshot().id,'window');assert.equal(h.voices.at(-1).time,24);assert.equal(h.player.snapshot().playing,true);
  await h.player.dispose();
});
test('muting before the wish never starts an interlude, and switching songs cancels its return point',async()=>{
  const h=playerHarness();await h.player.engage();h.set({music:false});
  await h.player.playOnce('birthday');assert.equal(h.voices.length,1);assert.equal(h.player.snapshot().id,'window');
  h.set({music:true});await settle();await h.player.playOnce('birthday');
  const birthday=h.voices.at(-1);h.set({musicTrack:'pages'});await settle();birthday.ended();await settle();
  assert.equal(h.player.snapshot().id,'pages');assert.equal(h.voices.at(-1).time,0);
  await h.player.dispose();
});
test('new readability preference has a safe default and survives normal save validation',()=>{
  const raw=serializable(createState());delete raw.settings.clearText;
  assert.equal(normalizeState(raw).settings.clearText,false);
  assert.equal(normalizeState({...raw,settings:{...raw.settings,clearText:true}}).settings.clearText,true);
  assert.equal(normalizeState({...raw,settings:{...raw.settings,clearText:'true'}}).settings.clearText,false);
});
