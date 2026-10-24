import {acceptsReviewPin,REVIEW_SESSION_KEY} from './services/review-access.js';
import {icon} from './ui/dom.js';

const host=document.querySelector('#review-app');
let dispose=()=>{};
const remembered=()=>{try{return sessionStorage.getItem(REVIEW_SESSION_KEY)==='yes';}catch{return false;}};
function lock(){
  dispose();try{sessionStorage.removeItem(REVIEW_SESSION_KEY);}catch{}
  host.innerHTML=`<section class="review-gate"><p class="eyebrow">BEHIND THE LITTLE ROOM</p><span class="gate-mark">${icon('moon')}</span><h1>小屋工作间</h1><p>翻关卡，看看画面，改改文字。</p><form id="review-login"><label for="review-pin">进入密码</label><input id="review-pin" type="password" inputmode="numeric" pattern="[0-9]{8}" maxlength="8" required autocomplete="off" aria-describedby="review-login-reply"><button class="primary-button" type="submit">开门${icon('right')}</button><p id="review-login-reply" role="status"></p></form><a href="index.html">回到游戏</a><small>这是静态维护入口，用于防误入。演示进度与正式游戏分开。</small></section>`;
  const form=host.querySelector('form'),input=host.querySelector('input'),button=form.querySelector('button'),reply=form.querySelector('[role="status"]');
  form.addEventListener('submit',async event=>{
    event.preventDefault();button.disabled=true;reply.textContent='';
    try{
      if(await acceptsReviewPin(input.value)){input.value='';try{sessionStorage.setItem(REVIEW_SESSION_KEY,'yes');}catch{}await open();}
      else{input.value='';reply.textContent='密码没对上，再看看。';input.focus();}
    }catch{reply.textContent='通过 HTTPS 或本地预览打开，就能核对密码。';}
    finally{button.disabled=false;}
  });
}
async function open(){
  const {mountReview}=await import('./demo.js');dispose=mountReview({onLock:lock});
}
if(remembered())open();else lock();
