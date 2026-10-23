import { motionAllowed } from '../../services/motion.js';

export function bindNeighbors(root) {
  const tiles=[...root.querySelectorAll('.flip-tile')];
  if(!tiles.length)return ()=>{};
  const abort=new AbortController();
  const clear=()=>tiles.forEach(tile=>tile.classList.remove('will-flip'));
  const show=event=>{const target=event.target.closest('[data-neighbors]');if(!target)return;const indexes=target.dataset.neighbors.split(',').map(Number);tiles.forEach((tile,index)=>tile.classList.toggle('will-flip',indexes.includes(index)));};
  for(const type of ['pointerover','focusin'])root.addEventListener(type,show,{signal:abort.signal});
  for(const type of ['pointerleave','focusout'])root.addEventListener(type,clear,{signal:abort.signal});
  return ()=>{clear();abort.abort();};
}

export function blockedMove(button) {
  if(motionAllowed())button.animate([{translate:'0px'},{translate:'-3px'},{translate:'2px'},{translate:'0px'}],{duration:240});
}
