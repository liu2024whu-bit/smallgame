import { pointerSession } from './pointer.js';
import { MUSIC_LANES, musicPinStyle } from '../../data/mechanism-layouts.js';

export function bindMusic(root,progress,move) {
  const field=root.querySelector('.music-apparatus'),tracks=[...root.querySelectorAll('[data-music-track]')];
  if(!field)return ()=>{};
  const abort=new AbortController();
  const noteAt=(index,event)=>{
    const box=field.getBoundingClientRect(),lane=MUSIC_LANES[index],y=(event.clientY-box.top)/box.height*1024;
    return Math.max(0,Math.min(4,Math.round((lane[3]-y)/(lane[3]-lane[1])*4)));
  };
  const update=(index,note)=>{tracks[index].querySelector('.music-pin').style.cssText=musicPinStyle(index,note);tracks[index].setAttribute('aria-valuenow',note);};
  root.addEventListener('click',event=>{
    const track=event.target.closest('[data-music-track]');
    if(!track||Date.now()<Number(root.dataset.suppressUntil??0))return;
    const index=Number(track.dataset.musicTrack);
    move({type:'set-note',index,note:event.detail?noteAt(index,event):(progress.notes[index]+1)%5});
  },{signal:abort.signal});
  root.addEventListener('keydown',event=>{
    const track=event.target.closest('[data-music-track]');
    if(!track||!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    event.preventDefault();event.stopPropagation();const index=Number(track.dataset.musicTrack);
    const note=event.key==='Home'?0:event.key==='End'?4:Math.max(0,Math.min(4,progress.notes[index]+(event.key==='ArrowUp'?1:-1)));
    move({type:'set-note',index,note});
  },{signal:abort.signal});
  const stop=pointerSession(root,{
    pick(event){const source=event.target.closest('[data-music-track]');return source?{source,index:Number(source.dataset.musicTrack)}:null;},
    move(gesture,event){gesture.note=noteAt(gesture.index,event);update(gesture.index,gesture.note);},
    end(gesture,_,cancelled){if(!cancelled&&gesture.note!==undefined)move({type:'set-note',index:gesture.index,note:gesture.note});},
    clear(){tracks.forEach((track,index)=>{if(track.isConnected)update(index,progress.notes[index]);});},
  });
  return ()=>{stop();abort.abort();};
}
