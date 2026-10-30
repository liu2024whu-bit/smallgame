import { introContent } from './intro.js';
import { escape,icon } from './dom.js';
import { storyPosition } from '../core/story.js';

export function welcomeContent(state,phase='title',step=0,saves=null) {
  if(phase==='intro')return introContent(step);
  const {chapter,place}=storyPosition(state);
  const active=saves?.slots?.find(s=>s.id===saves.active);
  return `<div class="welcome-title"><p class="welcome-date">${icon('moon')}06 / 15<span>A LITTLE ROOM</span></p><p class="welcome-dedication">一份可以慢慢拆开的生日礼物</p><h1 id="welcome-heading" tabindex="-1">第20圈以前</h1><p class="welcome-subtitle">一间留给你的晴天</p><div class="welcome-start"><button class="primary-button" data-action="start">${icon('rainbow','button-stamp')}${state.begun?'继续':'开始'}${icon('right')}</button>${state.begun?`<p class="welcome-bookmark">${icon('feather')}<span>${escape(active?.name??chapter)}<small>${escape(place)}</small></span></p>`:''}</div><nav class="welcome-links" aria-label="开始菜单">${saves?`<button data-action="saves">${icon('book')}选择进度</button>`:''}<button data-action="music">${icon('music')}唱片</button><button data-action="settings">${icon('settings')}设置</button><button data-action="about">${icon('star')}这间小屋</button></nav><p class="welcome-colophon">一份可以慢慢拆开的生日礼物</p></div>`;
}

export function aboutPanel(){
  return {title:'这间小屋',className:'about-dialog',html:`<div class="about-page"><p class="eyebrow">BEFORE THE TWENTIETH ORBIT</p><h3>第20圈以前</h3><p class="about-dedication">一份可以慢慢拆开的生日礼物</p><p>几张散落的画，一间有蛋糕的小屋。<br>这是给你的二十岁生日。</p><div class="about-chapters" aria-label="故事里的三段时光"><span>${icon('feather')}散着的几页</span><span>${icon('moon')}门后的生日</span><span>${icon('star')}生日之后</span></div><div class="about-links"><button class="quiet-button" data-action="intro">${icon('play')}再读开场</button><button class="quiet-button" data-action="how-to">${icon('book')}怎么玩</button></div><details class="about-credits" data-fold="credits"><summary>页脚的小字</summary><p>角色属于各自的作品。小屋里的画面、机关和琴声，为这份生日礼物而作；琴声不改编歌单中的歌曲。生日口哨由 Joseph SARDIN 以 CC0 分享。在线歌曲来自官方平台，实际版本已标明；本地选入的音频只存在这台设备，不会随存档导出。</p><p>2026</p></details></div>`};
}
