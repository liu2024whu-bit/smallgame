import { MUSIC, MUSIC_BY_ID, isBuiltIn, formatTime } from '../data/music.js';
import { escape,icon } from './dom.js';

export function musicPanel(context){
  const {music:s,state}=context,track=MUSIC_BY_ID[s.id]??MUSIC[0];
  const available=id=>s.available.includes(id),imported=id=>(s.imported??[]).includes(id);
  const status=s.error||(!state.settings.sound?'声音先歇一会儿。':!state.settings.music?'唱片歇一会儿。':s.status==='loading'?'唱针快落下了。':s.playing?'陪你慢慢玩。':'点一下，让唱片转起来。');
  const row=t=>{
    const ready=available(t.id);
    return `<li class="music-track ${t.id===s.id?'current-track':''}"><div class="music-track-line"><button class="track-pick" data-action="music-choose" data-id="${t.id}" aria-label="${ready?(t.id===s.id&&s.playing?'暂停':'播放'):'查看'}${escape(t.title)}" ${t.id===s.id?'aria-current="true"':''} ${!ready?'disabled':''}><span class="track-mark">${icon(t.id===s.id&&s.playing?'pause':ready?'play':'music')}</span><span><b>${escape(t.title)}</b><small>${escape(t.by)}</small></span><em>${imported(t.id)?'本地':t.file?'随游戏':t.stream?'在线':'平台原声'}</em></button>${t.link?`<a class="track-source" href="${escape(t.link)}" target="_blank" rel="noopener noreferrer" aria-label="打开${escape(t.title)}的官方播放页">${icon('right')}</a>`:''}</div>${!ready?'<p class="track-note">这张原声留在平台里，播放情况随平台账号而定。</p>':''}${t.note?`<p class="track-note">${escape(t.note)}</p>`:''}${!isBuiltIn(t.id)?`<details class="track-options" data-fold="track-${t.id}"><summary>${imported(t.id)?'这台设备的音源':'换一份音源'}</summary><button class="text-button" data-action="music-import" data-id="${t.id}">选择本地音频</button>${imported(t.id)?`<button class="text-button" data-action="music-remove" data-id="${t.id}">移除本地音源</button>`:''}</details>`:''}</li>`;
  };
  return {title:'唱片架',className:'music-dialog',html:`<div class="music-room"><div class="music-now"><button class="music-platter ${s.playing?'spinning':''}" data-action="music-toggle" aria-label="${s.playing?'暂停':'播放'}音乐">${icon('moon')}<span>${icon(s.playing?'pause':'play')}</span></button><div class="music-caption"><p class="eyebrow">NOW PLAYING</p><h3>${escape(track.title)}</h3><p class="music-by">${escape(track.by)}</p><p class="music-status" role="status">${escape(status)}</p>${s.status==='error'?'<button class="text-button" data-action="music-choose" data-id="window">先听窗边</button>':''}</div></div><div class="music-timeline"><span data-music-elapsed>${formatTime(s.time)}</span><input type="range" aria-label="播放进度" data-music-seek min="0" max="${s.duration||1}" step=".1" value="${s.time}" ${!s.duration?'disabled':''}><span data-music-duration>${formatTime(s.duration)}</span><button class="icon-button" data-action="music-next" aria-label="下一首">${icon('next')}</button></div><div class="music-order"><button class="text-button" data-action="music-order">${icon('repeat')}${state.settings.musicOrder==='repeat'?'这一首，循环听':'按顺序，慢慢听'}</button><button class="text-button" data-action="settings">音量${icon('settings')}</button></div><h4 class="music-section-title">小屋里备好的</h4><ul class="music-tracks">${MUSIC.filter(t=>isBuiltIn(t.id)).map(row).join('')}</ul><h4 class="music-section-title">想一起听的</h4><ul class="music-tracks">${MUSIC.filter(t=>!isBuiltIn(t.id)).map(row).join('')}</ul><p class="music-local-note">在线唱片从官方播放页接来，需要联网。小屋的琴声和生日歌，已经备在这里了。</p></div>`};
}

// Position updates never rebuild the slider under a held pointer.
export function bindMusicProgress(root,player){
  const slider=root.querySelector('[data-music-seek]');if(!slider)return ()=>{};
  let touching=false;
  const down=()=>{touching=true;},up=()=>{touching=false;},seek=()=>{player.seek(Number(slider.value));touching=false;};
  slider.addEventListener('pointerdown',down);slider.addEventListener('pointerup',up);slider.addEventListener('pointercancel',up);slider.addEventListener('change',seek);
  const tick=()=>{if(!root.isConnected)return;const s=player.snapshot();if(!touching&&document.activeElement!==slider)slider.value=String(s.time);root.querySelector('[data-music-elapsed]').textContent=formatTime(touching?Number(slider.value):s.time);};
  const timer=setInterval(tick,400);
  return ()=>{clearInterval(timer);slider.removeEventListener('pointerdown',down);slider.removeEventListener('pointerup',up);slider.removeEventListener('pointercancel',up);slider.removeEventListener('change',seek);};
}
