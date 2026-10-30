import {animateMusicCrank} from './music-crank.js';

// A single finite owner for sound, winding and the six note highlights.
export function createMelodyPlayback(audio){
 let generation=0,field,turn;const timers=new Set();
 const later=(fn,ms)=>{const timer=setTimeout(()=>{timers.delete(timer);fn();},ms);timers.add(timer);};
 function stop(){
  generation++;audio.stopMelody();for(const timer of timers)clearTimeout(timer);timers.clear();turn?.cancel();turn=null;
  if(field){delete field.dataset.musicPlaying;field.querySelectorAll('.playing').forEach(el=>el.classList.remove('playing'));}field=null;
 }
 function play(root,notes){
  stop();field=root.querySelector('.music-apparatus');if(!field)return;
  const current=field,ticket=generation;current.dataset.musicPlaying='true';
  turn=animateMusicCrank(current.querySelector('.music-crank-paint'));
  audio.melody(notes,index=>{
   if(ticket!==generation||!current.isConnected)return;
   current.querySelectorAll('[data-music-column]').forEach(el=>el.classList.toggle('playing',Number(el.dataset.musicColumn)===index));
   later(()=>{if(ticket===generation)current.querySelector(`[data-music-column="${index}"]`)?.classList.remove('playing');},350);
  });
  later(()=>{if(ticket===generation){delete current.dataset.musicPlaying;turn=null;field=null;}},3200);
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 return {play,stop};
}
