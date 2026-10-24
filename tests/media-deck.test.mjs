import test from 'node:test';
import assert from 'node:assert/strict';
import {createMediaDeck,probeAudio} from '../src/services/media-deck.js';

const deadlines={metadata:25,play:25,seek:25,stall:25};
class TestMedia extends EventTarget{
  constructor(mode={}){super();this.mode=mode;this.src='';this.duration=NaN;this.readyState=0;this.paused=true;this.ended=false;this.seeking=false;this._time=0;this.playCalls=0;}
  load(){
    if(!this.src)return;
    if(this.mode.metadata==='hang')return;
    queueMicrotask(()=>{this.duration=60;this.readyState=3;this.dispatchEvent(new Event('loadedmetadata'));});
  }
  play(){
    this.playCalls++;
    if(this.mode.play==='deny')return Promise.reject(new DOMException('User action required','NotAllowedError'));
    if(this.mode.play==='hang')return new Promise(()=>{});
    this.paused=false;queueMicrotask(()=>{this.readyState=4;this.dispatchEvent(new Event('playing'));});return Promise.resolve();
  }
  pause(){this.paused=true;this.dispatchEvent(new Event('pause'));}
  removeAttribute(name){if(name==='src')this.src='';}
  get currentTime(){return this._time;}
  set currentTime(value){this._time=value;this.seeking=true;if(this.mode.seek!=='hang')queueMicrotask(()=>{this.seeking=false;this.dispatchEvent(new Event('seeked'));});}
}
const open=(element,options={})=>createMediaDeck('song.mp3',options.offset??0,()=>{},options.onError??(()=>{}),{makeAudio:()=>element,deadlines,signal:options.signal});
test('native playback starts while metadata loads, then waits for the actual resume position',async()=>{
  const element=new TestMedia(),deck=await open(element,{offset:24});
  assert.equal(element.playCalls,1);assert.equal(deck.time,24);assert.equal(deck.duration,60);assert.equal(element.paused,false);
  deck.volume=.4;assert.equal(element.volume,.4);deck.stop();assert.equal(element.paused,true);assert.equal(element.src,'');
});
test('a never-starting play promise has a deadline and releases its media element',async()=>{
  const element=new TestMedia({play:'hang'});
  await assert.rejects(open(element),/唱针/);assert.equal(element.paused,true);assert.equal(element.src,'');
});
test('metadata and resume-seek deadlines also release the resource',async()=>{
  for(const mode of [{metadata:'hang'},{seek:'hang'}]){
    const element=new TestMedia(mode);await assert.rejects(open(element,{offset:15}));assert.equal(element.src,'');assert.equal(element.paused,true);
  }
});
test('browser permission denial keeps its error type, and abort cancels a pending load',async()=>{
  const denied=new TestMedia({play:'deny'});await assert.rejects(open(denied),error=>error.name==='NotAllowedError');assert.equal(denied.src,'');
  const element=new TestMedia({metadata:'hang',play:'hang'}),abort=new AbortController(),pending=open(element,{signal:abort.signal});
  abort.abort();await assert.rejects(pending,error=>error.name==='AbortError');assert.equal(element.src,'');
});
test('an active stalled deck reports once, while a paused or progressing deck does not',async()=>{
  let failures=0;const element=new TestMedia(),deck=await open(element,{onError:()=>failures++});
  element.dispatchEvent(new Event('waiting'));await new Promise(r=>setTimeout(r,45));assert.equal(failures,1);
  element.dispatchEvent(new Event('waiting'));await new Promise(r=>setTimeout(r,45));assert.equal(failures,1);deck.stop();
  const next=new TestMedia(),healthy=await open(next,{onError:()=>failures++});next.dispatchEvent(new Event('waiting'));
  next._time=1;next.dispatchEvent(new Event('timeupdate'));await new Promise(r=>setTimeout(r,45));assert.equal(failures,1);
  next.dispatchEvent(new Event('waiting'));healthy.stop();await new Promise(r=>setTimeout(r,45));assert.equal(failures,1);
});
test('local recording inspection reads duration without starting audio',async()=>{
  const element=new TestMedia(),duration=await probeAudio(new Blob([1]),{makeAudio:()=>element,deadlines});
  assert.equal(duration,60);assert.equal(element.playCalls,0);assert.equal(element.src,'');
});

test('direct seeking keeps the same native element and a newer seek cancels the pending one',async()=>{
  const element=new TestMedia(),deck=await open(element);await deck.seek(12);
  assert.equal(deck.time,12);assert.equal(element.playCalls,1);assert.equal(element.paused,false);
  element.mode.seek='hang';const first=deck.seek(18);element.mode.seek='normal';const second=deck.seek(24);
  await assert.rejects(first,error=>error.name==='AbortError');await second;assert.equal(deck.time,24);assert.equal(element.playCalls,1);deck.stop();
});
