import {MUSIC,MUSIC_BY_ID,isBuiltIn,formatTime} from '../data/music.js';
import {TURNTABLE} from '../data/turntable.js';
import {atlas,escape,icon} from './dom.js';

function row(track){
  return `<li class="music-track" data-track-row="${track.id}"><div class="music-track-line"><button class="track-pick" data-action="music-choose" data-id="${track.id}"><span class="track-mark" data-track-mark>${icon('play')}</span><span class="track-copy"><b>${escape(track.title)}</b><small data-track-credit>${escape(track.by)}</small></span><em data-track-kind></em></button>${track.link?`<a class="track-source" href="${escape(track.link)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(track.title)}的当前版本来源">${icon('right')}</a>`:''}</div>${!isBuiltIn(track.id)?`<details class="track-options" data-fold="track-${track.id}"><summary data-track-options-label>另一份录音</summary><div>${track.originalLink?`<a class="track-source original-recording" href="${escape(track.originalLink)}" target="_blank" rel="noopener noreferrer">原唱 · ${escape(track.originalBy)}</a>`:''}<button class="text-button" data-action="music-import" data-id="${track.id}">选一份音频</button><button class="text-button" data-action="music-remove" data-id="${track.id}" data-remove-recording hidden>移除这份音频</button></div></details>`:''}${track.note?`<p class="track-note">${escape(track.note)}</p>`:''}</li>`;
}
function turntable(){
  const {record:r,arm:a}=TURNTABLE;
  return `<div class="turntable-stage">${atlas('turntable',0,{label:'木质唱片机',className:'turntable-body'})}<button class="record-grip" data-record-grip data-action="music-toggle" style="left:${r.left}%;top:${r.top}%;width:${r.width}%;" aria-label="唱片：点按播放或暂停，拖转听前后，也可用左右方向键"><span class="record-spin" aria-hidden="true">${atlas('turntable',1,{className:'vinyl-art'})}<span class="record-date">20</span></span></button><span class="turntable-arm" aria-hidden="true" style="left:${a.left}%;top:${a.top}%;width:${a.width}%;--pivot-x:${a.pivotX}%;--pivot-y:${a.pivotY}%;--arm-angle:${a.rest}deg;">${atlas('turntable',2,{className:'tonearm-art'})}</span></div><p class="record-guide">唱片也能轻轻转动。</p>`;
}
export function musicPanel(context){
  const s=context.music,shelf=context.view?.musicShelf??(isBuiltIn(s.id)?'included':'songs');
  return {title:'唱片架',className:'music-dialog',html:`<div class="music-room" data-shelf="${shelf}"><section class="music-player-pane">${turntable()}<div class="music-caption"><span class="music-label">给今天留一首</span><h3 data-now-title>${escape(MUSIC_BY_ID[s.id]?.title)}</h3><p class="music-by" data-now-by></p><p class="music-status" data-now-status role="status"></p></div><div class="music-transport"><button class="music-play" data-action="music-toggle" aria-label="播放音乐">${icon('play')}</button><div class="music-timeline"><span data-music-elapsed>${formatTime(s.time)}</span><input type="range" aria-label="播放进度" data-music-seek min="0" max="${s.duration||1}" step=".1" value="${s.time}"><span data-music-duration>${formatTime(s.duration)}</span></div><button class="icon-button music-next" data-action="music-next" aria-label="下一首">${icon('next')}</button></div><div class="music-order"><button class="text-button" data-action="music-order">${icon('repeat')}<span data-order-label></span></button><button class="text-button" data-action="settings">音量${icon('settings')}</button></div></section><aside class="music-records-pane"><nav class="music-shelves" role="tablist" aria-label="唱片分组">${[['included','小屋的琴声'],['songs','想一起听的']].map(([id,name])=>`<button role="tab" id="shelf-tab-${id}" data-music-group="${id}" aria-controls="shelf-${id}" aria-selected="${shelf===id}">${name}<i aria-hidden="true"></i></button>`).join('')}</nav>${['included','songs'].map(group=>`<section class="music-shelf" id="shelf-${group}" role="tabpanel" aria-labelledby="shelf-tab-${group}" data-music-shelf="${group}" ${shelf===group?'':'hidden'}><ul class="music-tracks">${MUSIC.filter(t=>isBuiltIn(t.id)===(group==='included')).map(t=>row(t)).join('')}</ul></section>`).join('')}<p class="music-local-note">琴声和生日歌，收在小屋里。<br>其余唱片要联网。</p></aside><span class="sr-only" data-record-preview role="status"></span></div>`};
}
function statusLine(s,settings){
  if(!settings.sound)return '声音先歇一会儿。';
  if(!settings.music)return '唱针，先停在这里。';
  if(s.status==='loading')return '正在换一张唱片。';
  return s.error||s.notice||(s.playing?'这首，陪你。':'唱针，先停在这里。');
}
const text=(root,selector,value)=>{const el=root.querySelector(selector);if(el&&el.textContent!==value)el.textContent=value;};
export function updateMusicView(root,{music:s,state}){
  const room=root.querySelector('.music-room');if(!room)return;
  const track=MUSIC_BY_ID[s.id]??MUSIC[0],playing=s.playing||s.status==='loading';
  text(room,'[data-now-title]',track.title);text(room,'[data-now-by]',s.source?.kind==='local'?s.source.name:track.by);
  text(room,'[data-now-status]',statusLine(s,state.settings));text(room,'[data-order-label]',state.settings.musicOrder==='repeat'?'单曲循环':'顺着听');
  const play=room.querySelector('.music-play');
  if(play.dataset.state!==String(playing)){play.dataset.state=playing;play.innerHTML=icon(playing?'pause':'play');}
  play.setAttribute('aria-label',playing?'暂停音乐':'播放音乐');room.classList.toggle('record-loading',s.status==='loading');
  const slider=room.querySelector('[data-music-seek]');if(slider.max!==String(s.duration||1))slider.max=String(s.duration||1);
  const disabled=!s.duration||s.status==='loading';if(slider.disabled!==disabled)slider.disabled=disabled;
  if(!slider.dataset.held&&document.activeElement!==slider)slider.value=String(s.time);
  text(room,'[data-music-elapsed]',formatTime(slider.dataset.held?Number(slider.value):s.time));text(room,'[data-music-duration]',formatTime(s.duration));
  const arm=room.querySelector('.turntable-arm'),a=TURNTABLE.arm;
  const progress=s.heardDuration?Math.min(1,s.heardTime/s.heardDuration):s.duration?Math.min(1,s.time/s.duration):0;
  arm.style.setProperty('--arm-angle',((s.audible||s.status==='loading')?a.outer+a.travel*progress:a.rest)+'deg');
  for(const t of MUSIC){
    const entry=room.querySelector('[data-track-row="'+t.id+'"]'),button=entry.querySelector('.track-pick');
    const ready=s.available.includes(t.id),local=s.imported.includes(t.id),active=t.id===s.id,busy=s.importing===t.id;
    entry.classList.toggle('current-track',active);entry.classList.toggle('track-waiting',busy||active&&s.status==='loading');
    if(button.disabled!==(!ready||busy))button.disabled=!ready||busy;button.setAttribute('aria-current',String(active));button.setAttribute('aria-label',(active&&s.playing?'暂停':'播放')+t.title);
    const mark=active&&s.playing?'pause':'play',holder=entry.querySelector('[data-track-mark]');
    if(holder.dataset.mark!==mark){holder.dataset.mark=mark;holder.innerHTML=icon(mark);}
    text(entry,'[data-track-credit]',local?'这台设备的音频':t.by);
    text(entry,'[data-track-kind]',busy?'收着呢':s.unavailable?.includes(t.id)?'稍后':local?'本地':t.file?'随游戏':'在线');
    text(entry,'[data-track-options-label]',local?'这份音频':'另一份录音');
    const remove=entry.querySelector('[data-remove-recording]');if(remove&&remove.hidden!==!local)remove.hidden=!local;
    const importButton=entry.querySelector('[data-action="music-import"]');if(importButton&&importButton.disabled!==Boolean(s.importing))importButton.disabled=Boolean(s.importing);
  }
  room.querySelectorAll('[data-music-group]').forEach(button=>{
    const selected=room.dataset.shelf===button.dataset.musicGroup;button.setAttribute('aria-selected',selected);button.tabIndex=selected?0:-1;
    button.classList.toggle('shelf-has-current',(isBuiltIn(s.id)?'included':'songs')===button.dataset.musicGroup);
  });
  room.querySelectorAll('[data-music-shelf]').forEach(shelf=>{const hidden=shelf.dataset.musicShelf!==room.dataset.shelf;if(shelf.hidden!==hidden)shelf.hidden=hidden;});
}
