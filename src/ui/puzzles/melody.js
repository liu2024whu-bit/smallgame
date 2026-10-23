import { character } from '../dom.js';
import { MUSIC_LANES, musicRect, musicPinStyle } from '../../data/mechanism-layouts.js';

export function renderMelody(progress) {
  return `<div class="melody-workbench"><div class="melody-clue">${character('gifts',3,3,2,'风铃')}<div class="music-strip"><p>Ⅰ在最低格　·　Ⅵ与Ⅰ同高</p><p>Ⅱ比Ⅰ高两格　·　Ⅲ比Ⅱ低一格</p><p>Ⅳ比Ⅱ高一格　·　Ⅴ比Ⅳ低一格</p></div></div><div class="music-apparatus">${character('musicbox',0,1,1,'六道空滑槽的音乐盒')}${progress.notes.map((note,index)=>{
    const [x,y,w,h]=musicRect(index),lane=MUSIC_LANES[index];
    return `<div class="music-pin-column"><span class="music-slot-index" style="left:${(lane[0]+lane[2])/2/1536*100}%;">${['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ'][index]}</span><button class="music-pin-track" data-music-track="${index}" data-focus="music-track-${index}" role="slider" aria-label="第${index+1}个音钉" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${note}" style="left:${x/1536*100}%;top:${y/1024*100}%;width:${w/1536*100}%;height:${h/1024*100}%"><span class="music-pin" style="${musicPinStyle(index,note)}"><i class="music-brass-pin"></i></span></button></div>`;
  }).join('')}</div><button class="quiet-button" data-action="play-melody">听听</button><span class="sr-only">音钉可以拖动，也可以点滑槽；选中后用上下方向键挪一格。</span></div>`;
}
