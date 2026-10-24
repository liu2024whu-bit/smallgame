import {icon} from './dom.js';

export function introContent(step=0){
  const heading=['给你的一封邀请。','风，比我们先到了。','蛋糕说，它可以等。'][step];
  const art=step===0?`<button class="invitation-envelope" data-action="intro-unfold" aria-label="拆开给 LXY 的邀请"><span class="envelope-flap"></span><span class="invitation-seal">${icon('star')}</span><b>给 LXY</b></button>`:`<div class="intro-pages" aria-hidden="true"><span>${icon('moon')}</span><span>${icon('star')}</span><span>${icon('feather')}</span></div>`;
  const copy=step===0?'好像写着，今天不用着急。':step===1?'桌上的画册，和第一本速写本有一点像。<br>只是风先翻过，几页跑到了屋子别处。':'想起了好多小事，还没想好怎么说。<br>先把这个生日，放在一间小屋里。';
  return `<div class="invitation intro-step-${step}"><p class="welcome-date">2026年10月29日 · 给 LXY</p><h1 id="welcome-heading" tabindex="-1">${heading}</h1>${art}<div class="invitation-copy"><p>${copy}</p></div><div class="intro-choices">${step===0?'':step===1?`<button class="primary-button" data-action="intro-next">还有呢${icon('right')}</button>`:`<button class="primary-button" data-action="welcome-enter">进去看看${icon('right')}</button>`}${step<2?'<button class="text-button intro-skip" data-action="welcome-enter">直接进屋</button>':''}</div><button class="welcome-back text-button" data-action="welcome-back">先在门口待会儿</button></div>`;
}
