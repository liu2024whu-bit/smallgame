import {formatTime} from '../data/music.js';
import {motionAllowed} from '../services/motion.js';
import {updateMusicView} from './music.js';
import {bindRecord} from './interactions/record.js';

// Keep the physical player and held controls mounted across every audio state change.
export function bindMusicView(root,player,{getContext,feedback=()=>{}}){
  const room=root.querySelector('.music-room');if(!room)return ()=>{};
  const abort=new AbortController(),slider=room.querySelector('[data-music-seek]'),disc=room.querySelector('.record-spin');
  let rotation=0,held=false,frame=0,last=0,previous=false;
  const paint=value=>{rotation=value;disc.style.rotate=value+'deg';};
  function spin(now){
    frame=0;if(!room.isConnected)return;
    if(!held&&player.snapshot().audible&&motionAllowed()){
      paint(rotation+(now-last)*.04);last=now;frame=requestAnimationFrame(spin);
    }else last=0;
  }
  function sync(){
    if(!room.isConnected)return;const context=getContext(),s=context.music;
    updateMusicView(root,context);
    if(s.playing&&!previous)feedback();previous=s.playing;
    if(s.audible&&!held&&motionAllowed()){if(!frame){last=performance.now();frame=requestAnimationFrame(spin);}}
    else{cancelAnimationFrame(frame);frame=0;last=0;}
  }
  const record=bindRecord(root,player,{
    angle:()=>rotation,paint,hold:value=>{held=value;room.classList.toggle('record-held',value);sync();},
    preview:seconds=>{
      if(seconds===null){sync();return;}
      room.querySelector('[data-music-elapsed]').textContent=formatTime(seconds);
      room.querySelector('[data-record-preview]').textContent='听到 '+formatTime(seconds);
    },
  });
  const signal={signal:abort.signal};
  slider.addEventListener('pointerdown',()=>{slider.dataset.held='true';},signal);
  const release=()=>{delete slider.dataset.held;sync();};
  const seekKeys=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown']);
  slider.addEventListener('keydown',event=>{if(seekKeys.has(event.key))slider.dataset.held='true';else if(event.key==='Escape')release();},signal);
  slider.addEventListener('keyup',event=>{if(seekKeys.has(event.key))release();},signal);
  window.addEventListener('pointerup',release,signal);window.addEventListener('pointercancel',release,signal);
  window.addEventListener('blur',release,signal);window.addEventListener('resize',release,signal);slider.addEventListener('blur',release,signal);
  slider.addEventListener('input',()=>{room.querySelector('[data-music-elapsed]').textContent=formatTime(Number(slider.value));},signal);
  slider.addEventListener('change',()=>{delete slider.dataset.held;player.seek(Number(slider.value));},signal);
  function shelf(id){room.dataset.shelf=id;sync();}
  room.querySelectorAll('[data-music-group]').forEach(button=>button.addEventListener('click',()=>shelf(button.dataset.musicGroup),signal));
  room.querySelector('.music-shelves').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const id=event.key==='Home'?'included':event.key==='End'?'songs':room.dataset.shelf==='included'?'songs':'included';
    shelf(id);room.querySelector('[data-music-group="'+id+'"]').focus();
  },signal);
  const media=matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',sync,signal);
  const unsubscribe=player.subscribe(sync),timer=setInterval(sync,400);sync();
  return ()=>{record();abort.abort();unsubscribe();clearInterval(timer);cancelAnimationFrame(frame);};
}
