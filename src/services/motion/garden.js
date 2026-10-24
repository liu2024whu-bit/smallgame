import {ease,turnDelta} from './shared.js';
const bookmark=root=>root.querySelector('.garden-wedge');
const turns=root=>[...root.querySelectorAll('[data-garden-crank]')].map(el=>parseFloat(el.style.getPropertyValue('--garden-turn'))||0);
export const gardenMotion={
  capture:root=>{
    const garden=root.querySelector('.garden-lift');if(!garden)return null;
    return {pin:Number(garden.dataset.flowerPin),book:bookmark(root)?.getBoundingClientRect(),heights:[...garden.querySelectorAll('.flower-pot')].map(el=>el.style.top),turns:turns(root),awake:garden.classList.contains('garden-awake')};
  },
  play(root,before){
    const garden=root.querySelector('.garden-lift');if(!garden||!before)return;
    garden.querySelectorAll('.flower-pot').forEach((pot,i)=>{
      if(!before.heights[i]||before.heights[i]===pot.style.top)return;
      pot.animate([{top:before.heights[i]},{top:pot.style.top}],{duration:460,easing:ease});
      pot.querySelector('.motif')?.animate([{rotate:'0deg'},{rotate:'1.1deg',offset:.4},{rotate:'-.5deg',offset:.72},{rotate:'0deg'}],{duration:620,easing:'ease-out'});
    });
    const nextTurns=turns(root);
    garden.querySelectorAll('.garden-handle').forEach((handle,i)=>{
      const next=nextTurns[i],old=before.turns[i];if(old===undefined||old===next)return;
      handle.animate([{rotate:(next+turnDelta(old,next))+'deg'},{rotate:next+'deg'}],{duration:460,easing:ease});
    });
    const pin=Number(garden.dataset.flowerPin),book=bookmark(root);
    if(book&&before.book&&pin!==before.pin){
      const next=book.getBoundingClientRect(),dx=before.book.left-next.left,dy=before.book.top-next.top;
      const start=before.pin>=0?'inset(0 14% 0 0)':'inset(0 0 0 0)',end=pin>=0?'inset(0 14% 0 0)':'inset(0 0 0 0)';
      book.animate([{translate:dx+'px '+dy+'px',clipPath:start},{translate:(pin>=0?-13:dx-13)+'px '+(pin>=0?-1:dy-1)+'px',clipPath:'inset(0 0 0 0)',offset:.72},{translate:'0 0',clipPath:end}],{duration:520,easing:ease,composite:'add'});
    }
    if(!before.awake&&garden.classList.contains('garden-awake'))garden.querySelector('.garden-windowlight')?.animate([{opacity:0},{opacity:.65}],{duration:1100,easing:'ease-out'});
  },
};
