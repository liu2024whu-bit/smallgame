import {MUSIC_LANES,MUSIC_LABELS,MUSIC_PAPER_LINES,MUSIC_CRANK,MUSIC_CRANK_FRAMES,musicPinStyle,musicCrankStyle} from '../data/melody-apparatus.js';
import {atlas} from './dom.js';

export function musicPapers({paint=false}={}){
 return MUSIC_PAPER_LINES.map((lines,i)=>`<span class="music-lid-note music-lid-note-${i}">${paint?atlas('melodyBody',i+1,{className:'music-note-paint'}):''}<span class="music-note-ink">${lines.map(line=>`<span>${line}</span>`).join('')}</span></span>`).join('');
}
export function musicPins(p,{passive=false,done=false}={}){
 return p.notes.map((note,index)=>{
  const [a,y,b,end]=MUSIC_LANES[index],x=(a+b)/2;
  const pin=`<span class="music-pin" data-music-pin="${index}" style="${musicPinStyle(index,note)}">${atlas('melodyParts',1)}</span>`;
  const track=passive?'':`<button class="music-pin-track" data-music-track="${index}" data-focus="music-track-${index}" role="slider" aria-label="${MUSIC_LABELS[index]}音钉" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${note}" aria-valuetext="从下往上第${note+1}格" aria-keyshortcuts="ArrowUp ArrowDown Home End" ${done?'disabled':''} style="left:${x}px;top:${y-12}px;width:84px;height:${end-y+24}px"></button>`;
  return `<span class="music-pin-column" data-music-column="${index}"><span class="music-slot-index" style="left:${x}px;top:415px">${MUSIC_LABELS[index]}</span>${pin}${track}</span>`;
 }).join('');
}
export function musicCrank({passive=false}={}){
 const [x,y,w,h]=MUSIC_CRANK.rect,tag=passive?'span':'button';
 return `<${tag} class="music-crank" ${passive?'':`data-music-play data-focus="music-crank" aria-label="摇一摇，听听这支曲子" aria-keyshortcuts="Enter Space"`} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><span class="music-crank-paint">${MUSIC_CRANK_FRAMES.frames.map((_,i)=>atlas('melodyCrank',i,{className:'music-crank-pose',style:musicCrankStyle(i)}).replace('<span ','<span data-music-crank-pose ')).join('')}</span></${tag}>`;
}
export function musicModel(p,{done=false}={}){
 return `${atlas(done?'melodyDone':'melodyBody',0,{className:'music-body-paint'})}${musicPapers()}${musicPins(p,{done})}${musicCrank()}${done?`<button class="music-windbell" data-action="keepsake" data-id="windbell" aria-label="看看盒边的风铃"></button>`:''}`;
}
