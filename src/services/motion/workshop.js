import { ease } from './shared.js';
import { RIBBON_PATHS } from '../../data/birthday-workshop.js';

export const workshopMotion = {
  capture(root) {
    const box=root.querySelector('[data-ribbon-field]'),decoder=root.querySelector('.birthday-decoder');
    return {side:root.querySelector('[data-ribbon-side]')?.dataset.ribbonSide,box:box?.getBoundingClientRect(),ribbons:[...root.querySelectorAll('[data-ribbon-line]')].map(el=>({id:el.dataset.ribbonLine,html:el.outerHTML})),decoder:decoder?{fitted:decoder.dataset.fitted,back:decoder.dataset.cardBack,turned:decoder.dataset.stripTurned,open:decoder.classList.contains('decoder-open')}:null};
  },
  play(root,before) {
    const side=root.querySelector('[data-ribbon-side]')?.dataset.ribbonSide;
    if(side!==undefined&&before.side!==undefined&&side!==before.side)root.querySelector('.ribbon-box')?.animate([{transform:'perspective(900px) rotateY(-16deg)',opacity:.55},{transform:'perspective(900px) rotateY(0deg)',opacity:1}],{duration:280,easing:ease});
    if(before.box&&side===before.side)for(const old of before.ribbons){
      if(root.querySelector(`[data-ribbon-line="${old.id}"]`))continue;
      const ghost=document.createElement('div'),[a,b]=RIBBON_PATHS[Number(side)][Number(old.id)],dx=Math.sign(b[0]-a[0])*140,dy=Math.sign(b[1]-a[1])*140;
      ghost.className='ribbon-exit';Object.assign(ghost.style,{left:`${before.box.left}px`,top:`${before.box.top}px`,width:`${before.box.width}px`,height:`${before.box.height}px`});
      ghost.innerHTML=`<svg class="ribbon-connections" viewBox="0 0 100 100" preserveAspectRatio="none">${old.html}</svg>`;root.append(ghost);
      const remove=()=>{window.clearTimeout(timer);ghost.remove();},timer=window.setTimeout(remove,450);
      ghost.animate([{translate:'0 0',opacity:1},{translate:`${dx}px ${dy}px`,opacity:0}],{duration:320,easing:ease,fill:'forwards'}).finished.catch(()=>{}).finally(remove);
    }
    const decoder=root.querySelector('.birthday-decoder'),old=before.decoder;if(!decoder||!old)return;
    if(!old.open&&decoder.classList.contains('decoder-open')){decoder.querySelector('.workshop-painting')?.animate([{opacity:.4,translate:'0 5px'},{opacity:1,translate:'0 0'}],{duration:360,easing:ease});return;}
    if(!decoder.dataset.fitted||!old.fitted)return;
    const targets=['.decoder-card','.decoder-strip','.decoder-mirror'];
    for(let i=0;i<3;i++)if(old.fitted[i]==='0'&&decoder.dataset.fitted[i]==='1')decoder.querySelector(targets[i])?.animate([{translate:'0 12px',scale:'.94',opacity:.35},{translate:'0 0',scale:'1',opacity:1}],{duration:240,easing:ease});
    if(old.back!==decoder.dataset.cardBack)decoder.querySelector('.decoder-card')?.animate([{scale:'0 1',opacity:.6},{scale:'1 1',opacity:1}],{duration:220,easing:ease});
    if(old.turned!==decoder.dataset.stripTurned)decoder.querySelector('.decoder-strip')?.animate([{rotate:'180deg',opacity:.7},{rotate:'0deg',opacity:1}],{duration:300,easing:ease});
  },
};
