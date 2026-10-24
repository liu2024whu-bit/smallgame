import {atlas,icon} from './dom.js';

const STEPS=[
 {heading:'今天，有封信。',copy:'给二十岁的你，留了一间小屋。'},
 {heading:'风先替你翻了几页。',copy:'第一本速写本，我还记得。<br>这次，换我留几页给你。'},
 {heading:'门后，还有一盏灯。',copy:'蛋糕还等着。<br>慢慢来，今天都留给你。'},
];
const choices=step=>`${step===0?'':step===1?`<button class="primary-button" data-action="intro-next">还有呢${icon('right')}</button>`:`<button class="primary-button" data-action="welcome-enter">进去看看${icon('right')}</button>`}${step<2?'<button class="text-button intro-skip" data-action="welcome-enter">直接进屋</button>':''}`;
function envelope(step){
 return `<div class="invitation-art" aria-label="奶油色信封和一张画着小叶子的邀请"><div class="envelope-body">${atlas('invitation',0,{className:'envelope-back'})}<span class="invitation-card"><span class="invitation-card-turner"><span class="invitation-card-face card-front" ${step===2?'inert':''}>${atlas('invitation',3,{className:'invitation-paper'})}<span class="invitation-ink">${icon('star')}<b>20</b></span></span><span class="invitation-card-face card-reverse" ${step!==2?'inert':''}>${atlas('invitation',3,{className:'invitation-paper'})}<span class="invitation-ink invitation-greeting">生日快乐<small>LXY</small></span></span></span><button class="invitation-turn" data-action="intro-next" aria-label="看看邀请的背面" ${step===1?'':'hidden'}></button></span>${atlas('invitation',1,{className:'envelope-pocket'})}<span class="envelope-lid">${atlas('invitation',2,{className:'envelope-flap-art'})}<span class="invitation-seal">${icon('star')}</span></span><span class="envelope-name">给 LXY</span></div><button class="invitation-open" data-action="intro-unfold" aria-label="拆开给 LXY 的邀请" ${step?'hidden':''}></button></div>`;
}
export function introContent(step=0){
 const s=STEPS[step]??STEPS[0];
 return `<div class="invitation" data-step="${step}"><p class="welcome-date">2026年10月29日 · 给 LXY</p><h1 id="welcome-heading" tabindex="-1">${s.heading}</h1>${envelope(step)}<div class="invitation-copy"><p>${s.copy}</p></div><div class="intro-choices">${choices(step)}</div><button class="welcome-back text-button" data-action="welcome-back">先在门口待会儿</button></div>`;
}
export function updateIntro(host,step){
 const root=host.querySelector('.invitation'),s=STEPS[step];if(!root||!s)return false;
 root.dataset.step=step;root.querySelector('h1').textContent=s.heading;
 root.querySelector('.invitation-copy p').innerHTML=s.copy;root.querySelector('.intro-choices').innerHTML=choices(step);
 root.querySelector('.invitation-open').hidden=step!==0;root.querySelector('.invitation-turn').hidden=step!==1;root.querySelector('.card-front').inert=step===2;root.querySelector('.card-reverse').inert=step!==2;root.querySelector('h1').focus({preventScroll:true});return true;
}
