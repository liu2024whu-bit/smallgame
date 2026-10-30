import { pointerSession } from './pointer.js';
import {MUSIC_CRANK,musicNoteAt,musicPoint,musicPinStyle} from '../../data/melody-apparatus.js';
import {setMusicCrank} from '../../services/music-crank.js';

export function bindMusic(root,progress,{move,solved,play=()=>{},stopPlayback=()=>{},feedback=()=>{}}) {
  const field=root.querySelector('.music-apparatus'),tracks=[...root.querySelectorAll('[data-music-track]')],crank=field?.querySelector('.music-crank-paint');
  if(!field)return ()=>{};
  const abort=new AbortController();
  const point=event=>{const b=field.getBoundingClientRect(),scale=b.width/1536;return [(event.clientX-b.left)/scale,(event.clientY-b.top)/scale];};
  const update=(index,note)=>{field.querySelector(`[data-music-pin="${index}"]`).style.cssText=musicPinStyle(index,note);tracks[index]?.setAttribute('aria-valuenow',Math.round(note));tracks[index]?.setAttribute('aria-valuetext',`从下往上第${Math.round(note)+1}格`);};
  const angle=event=>{const [x,y]=point(event);return Math.atan2(y-MUSIC_CRANK.pivot[1],(x-MUSIC_CRANK.pivot[0])*.4)*180/Math.PI;};
  const inside=event=>{const b=field.parentElement.getBoundingClientRect();return event&&event.clientX>=b.left-8&&event.clientX<=b.right+8&&event.clientY>=b.top-8&&event.clientY<=b.bottom+8;};
  let releasing=false;
  root.addEventListener('click',event=>{
    if(Date.now()<Number(root.dataset.suppressUntil??0))return;
    if(event.target.closest('[data-music-play]')){play();return;}
    const track=event.target.closest('[data-music-track]');
    if(!track||solved)return;
    const index=Number(track.dataset.musicTrack);
    move({type:'set-note',index,note:event.detail?Math.round(musicNoteAt(index,point(event)[1])):(progress.notes[index]+1)%5});
  },{signal:abort.signal});
  root.addEventListener('keydown',event=>{
    const track=event.target.closest('[data-music-track]');
    if(!track||solved||!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    event.preventDefault();event.stopPropagation();const index=Number(track.dataset.musicTrack);
    const note=event.key==='Home'?0:event.key==='End'?4:Math.max(0,Math.min(4,progress.notes[index]+(event.key==='ArrowUp'?1:-1)));
    move({type:'set-note',index,note});
  },{signal:abort.signal});
  const stop=pointerSession(root,{
    pick(event){
      releasing=false;
      const handle=event.target.closest('[data-music-play]');if(handle){stopPlayback();return {source:handle,kind:'crank',last:angle(event),wind:0};}
      const source=event.target.closest('[data-music-track]');if(!source||solved)return null;
      const index=Number(source.dataset.musicTrack),[x,y]=point(event),[px,py]=musicPoint(index,progress.notes[index]);
      return {source,index,kind:'pin',offset:Math.abs(x-px)<38&&Math.abs(y-py)<40?y-py:0,tick:progress.notes[index]};
    },
    move(g,event){
      if(g.kind==='crank'){const a=angle(event);g.wind+=((a-g.last+540)%360)-180;g.last=a;setMusicCrank(crank,g.wind);return;}
      g.note=musicNoteAt(g.index,point(event)[1]-g.offset);update(g.index,g.note);
      const tick=Math.round(g.note);if(g.tick!==tick){g.tick=tick;feedback('detent',.25);}
    },
    end(g,event,cancelled){
      if(cancelled||!inside(event))return;
      if(g.kind==='crank'){if(Math.abs(g.wind)>=45)play();return;}
      if(g.note!==undefined){releasing=true;if(!move({type:'set-note',index:g.index,note:Math.round(g.note)})){releasing=false;update(g.index,progress.notes[g.index]);}}
    },
    clear(){if(!releasing&&field.isConnected)progress.notes.forEach((note,index)=>update(index,note));if(crank?.isConnected&&!field.dataset.musicPlaying)setMusicCrank(crank);},
  });
  return ()=>{stop();abort.abort();};
}
