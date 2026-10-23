import { MUSIC, MUSIC_BY_ID, isBuiltIn, formatTime } from '../data/music.js';
import { escape,icon } from './dom.js';

export function musicPanel(context){
  const {music:s,state}=context,track=MUSIC_BY_ID[s.id]??MUSIC[0];
  const available=id=>s.available.includes(id);
  const status=s.error||(!state.settings.sound?'声音先歇一会儿。':!state.settings.music?'唱片歇一会儿。':s.status==='loading'?'唱针快落下了。':s.playing?'陪你慢慢玩。':'点一下，让唱片转起来。');
  const row=t=>`<li class="music-track ${t.id===s.id?'current-track':''}"><button class="track-pick" data-action="music-choose" data-id="${t.id}" aria-label="${available(t.id)?t.id===s.id&&s.playing?'暂停':'播放':'为'}${escape(t.title)}${available(t.id)?'':'选择音频'}" ${t.id===s.id?'aria-current="true"':''}><span class="track-mark">${icon(t.id===s.id&&s.playing?'pause':available(t.id)?'play':'music')}</span><span><b>${escape(t.title)}</b><small>${escape(t.by)}</small></span><em>${available(t.id)?t.id===s.id?'已选':'': '选音频'}</em></button>${!isBuiltIn(t.id)&&available(t.id)?`<button class="icon-button track-remove" data-action="music-remove" data-id="${t.id}" aria-label="移除${escape(t.title)}的本地音源">${icon('close')}</button>`:''}</li>`;
  return {title:'唱片架',className:'music-dialog',html:`<div class="music-room"><div class="music-now"><button class="music-platter ${s.playing?'spinning':''}" data-action="music-toggle" aria-label="${s.playing?'暂停':'播放'}音乐">${icon('moon')}<span>${icon(s.playing?'pause':'play')}</span></button><div class="music-caption"><p class="eyebrow">NOW PLAYING</p><h3>${escape(track.title)}</h3><p class="music-by">${escape(track.by)}</p><p class="music-status" role="status">${escape(status)}</p></div></div><div class="music-timeline"><span data-music-elapsed>${formatTime(s.time)}</span><input type="range" aria-label="播放进度" data-music-seek min="0" max="${s.duration||1}" step=".1" value="${s.time}" ${!s.duration?'disabled':''}><span data-music-duration>${formatTime(s.duration)}</span><button class="icon-button" data-action="music-next" aria-label="下一首">${icon('next')}</button></div><div class="music-order"><button class="text-button" data-action="music-order">${icon('repeat')}${state.settings.musicOrder==='repeat'?'这一首，循环听':'按顺序，慢慢听'}</button><button class="text-button" data-action="settings">音量${icon('settings')}</button></div><h4 class="music-section-title">小屋的琴声</h4><ul class="music-tracks">${MUSIC.filter(t=>isBuiltIn(t.id)).map(row).join('')}</ul><h4 class="music-section-title">想听的几首</h4><ul class="music-tracks">${MUSIC.filter(t=>!isBuiltIn(t.id)).map(row).join('')}</ul><p class="music-local-note">这些位置留给你选的音源。选一次，留在这台设备上；换个设备，还要再选一次。</p></div>`};
}

// Playback position updates without rebuilding controls or interrupting a drag.
export function bindMusicProgress(root,player){
  const slider=root.querySelector('[data-music-seek]');if(!slider)return ()=>{};
  let touching=false;
  const down=()=>{touching=true;},up=()=>{touching=false;},seek=()=>{player.seek(Number(slider.value));touching=false;};
  slider.addEventListener('pointerdown',down);slider.addEventListener('pointerup',up);slider.addEventListener('pointercancel',up);slider.addEventListener('change',seek);
  const tick=()=>{if(!root.isConnected)return;const s=player.snapshot();if(!touching&&document.activeElement!==slider)slider.value=String(s.time);root.querySelector('[data-music-elapsed]').textContent=formatTime(touching?Number(slider.value):s.time);};
  const timer=setInterval(tick,400);
  return ()=>{clearInterval(timer);slider.removeEventListener('pointerdown',down);slider.removeEventListener('pointerup',up);slider.removeEventListener('pointercancel',up);slider.removeEventListener('change',seek);};
}
