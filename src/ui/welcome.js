import { escape,icon } from './dom.js';
import { storyPosition } from '../core/story.js';

export function welcomeContent(state,phase='title') {
  if(phase==='intro')return `<div class="invitation"><p class="welcome-date">10月29日 · 给 LXY</p><h1 id="welcome-heading" tabindex="-1">屋里，留了一个生日。</h1><div class="invitation-copy"><p>给你准备的生日，好像出了点小状况。<br>画册散了几页，隔壁的门还关着。</p><p>蛋糕倒是一直乖乖等着。<br>今天不赶时间，我们慢慢来。</p></div><button class="welcome-enter primary-button" data-action="welcome-enter">${state.begun?'回到刚才':'进去看看'}${icon('right')}</button><button class="welcome-back text-button" data-action="welcome-back">先在门口待会儿</button></div>`;
  const {chapter,place}=storyPosition(state);
  return `<div class="welcome-title"><p class="welcome-date">${icon('moon')}10 / 29<span>2006 — 2026</span></p><p class="welcome-dedication">献给 LXY 的 20 岁生日</p><h1 id="welcome-heading" tabindex="-1">第20圈以前</h1><p class="welcome-subtitle">一间留给你的晴天</p><div class="welcome-start"><button class="primary-button" data-action="start">${icon('rainbow','button-stamp')}${state.begun?'继续':'开始'}${icon('right')}</button>${state.begun?`<p class="welcome-bookmark">${icon('feather')}<span>${escape(chapter)}<small>${escape(place)}</small></span></p>`:''}</div><nav class="welcome-links" aria-label="开始菜单"><button data-action="music">${icon('music')}唱片</button><button data-action="settings">${icon('settings')}设置</button><button data-action="about">${icon('star')}这间小屋</button></nav><p class="welcome-colophon">一份可以慢慢拆开的生日礼物</p></div>`;
}

export function aboutPanel(){
  return {title:'这间小屋',className:'about-dialog',html:`<div class="about-page"><p class="eyebrow">BEFORE THE TWENTIETH ORBIT</p><h3>第20圈以前</h3><p class="about-dedication">献给 LXY 的 20 岁生日</p><p>把散页收好，把门后的灯点亮。<br>剩下的时间，都留给今天。</p><div class="about-chapters" aria-label="故事里的三段时光"><span>${icon('feather')}散着的几页</span><span>${icon('moon')}门后的生日</span><span>${icon('star')}愿望收好啦</span></div><div class="about-links"><button class="quiet-button" data-action="intro">${icon('play')}再读开场</button><button class="quiet-button" data-action="how-to">${icon('book')}怎么玩</button></div><details class="about-credits" data-fold="credits"><summary>页脚的小字</summary><p>角色属于各自的作品。小屋里的画面、机关和三段琴声，为这份生日礼物而作；琴声不改编歌单中的歌曲。选入的音频只存在这台设备，不会随存档导出。</p><p>V2.7 · 2026</p></details></div>`};
}
