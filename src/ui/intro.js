import {atlas,icon} from './dom.js';

const STEPS=[
 {heading:'今天，给你准备了一份礼物。',copy:'生日快乐，二十岁的你。'},
 {heading:'屋里，散着几张画。',copy:'它们还在等一本画册。<br>也许，正好可以装在一起。'},
 {heading:'画还散在屋里。',copy:'画册装好，就去吃蛋糕。<br>要不要先进去看看？'},
];
const choices=step=>`${step===0?'':step===1?`<button class="primary-button" data-action="intro-next">还有呢${icon('right')}</button>`:`<button class="primary-button" data-action="welcome-enter">进去看看${icon('right')}</button>`}${step<2?'<button class="text-button intro-skip" data-action="welcome-enter">直接进屋</button>':''}`;
function envelope(step){
 return `<div class="invitation-art" aria-label="奶油色信封和一张画着小叶子的邀请"><div class="envelope-body">${atlas('invitation',0,{className:'envelope-back'})}<span class="invitation-card"><span class="invitation-card-turner"><span class="invitation-card-face card-front" ${step===2?'inert':''}>${atlas('invitation',3,{className:'invitation-paper'})}<span class="invitation-ink">${icon('star')}<b>20</b></span></span><span class="invitation-card-face card-reverse" ${step!==2?'inert':''}>${atlas('invitation',3,{className:'invitation-paper'})}<span class="invitation-ink invitation-greeting">生日快乐<small>你</small></span></span></span><button class="invitation-turn" data-action="intro-next" aria-label="看看邀请的背面" ${step===1?'':'hidden'}></button></span>${atlas('invitation',1,{className:'envelope-pocket'})}<span class="envelope-lid">${atlas('invitation',2,{className:'envelope-flap-art'})}<span class="invitation-seal">${icon('star')}</span></span><span class="envelope-name">给你</span></div><button class="invitation-open" data-action="intro-unfold" aria-label="拆开给你 的邀请" ${step?'hidden':''}></button></div>`;
}
export function introContent(step=0){
 const s=STEPS[step]??STEPS[0];
  return `<div class="invitation" data-step="${step}"><p class="welcome-date">一间晴天的小屋 · 给你</p><h1 id="welcome-heading" tabindex="-1">${s.heading}</h1>${envelope(step)}<div class="invitation-copy"><p>${s.copy}</p></div><div class="intro-choices">${choices(step)}</div><button class="welcome-back text-button" data-action="welcome-back">回到门口</button></div>`;
}
export function updateIntro(host,step){
 const root=host.querySelector('.invitation'),s=STEPS[step];if(!root||!s)return false;
 root.dataset.step=step;root.querySelector('h1').textContent=s.heading;
 root.querySelector('.invitation-copy p').innerHTML=s.copy;root.querySelector('.intro-choices').innerHTML=choices(step);
 root.querySelector('.invitation-open').hidden=step!==0;root.querySelector('.invitation-turn').hidden=step!==1;root.querySelector('.card-front').inert=step===2;root.querySelector('.card-reverse').inert=step!==2;root.querySelector('h1').focus({preventScroll:true});return true;
}
