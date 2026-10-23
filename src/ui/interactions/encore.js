import { pointerSession } from './pointer.js';
import { motionAllowed } from '../../services/motion.js';
import { ENCORE_HANDLE } from '../../data/mechanism-layouts.js';

export function bindEncore(root, changeView) {
  const handle=root.querySelector('[data-encore-handle]');
  if(!handle)return ()=>{};
  const art=handle.querySelector('.item-art'),initial=Number(root.querySelector('[data-encore-wind]').dataset.encoreWind);
  const angle=(event,box)=>Math.atan2(event.clientY-box.y,event.clientX-box.x)*180/Math.PI;
  const stop=pointerSession(root,{
    pick(event){if(!event.target.closest('[data-encore-handle]'))return null;const b=handle.getBoundingClientRect(),pivot={x:b.x+art.offsetWidth*ENCORE_HANDLE.pivotX,y:b.y+art.offsetHeight*ENCORE_HANDLE.pivotY};return {source:handle,pivot,last:angle(event,pivot),wind:initial};},
    move(gesture,event){const next=angle(event,gesture.pivot),delta=((next-gesture.last+540)%360)-180;gesture.last=next;gesture.wind=Math.max(0,Math.min(720,gesture.wind+delta));art.style.rotate=`${gesture.wind}deg`;},
    end(gesture,_,cancelled){if(!cancelled)changeView({wind:Math.round(gesture.wind)});},
    clear(){art.style.removeProperty('rotate');},
  });
  const key=event=>{if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;event.preventDefault();changeView({wind:Math.max(0,Math.min(720,initial+(event.key==='ArrowRight'?60:-60)))});};
  handle.addEventListener('keydown',key);
  const cat=root.querySelector('.theatre-cat');
  const greet=()=>{if(motionAllowed())cat.animate([{translate:'0 0'},{translate:'0 -5px',offset:.4},{translate:'0 0'}],{duration:500});};
  cat?.addEventListener('click',greet);
  return ()=>{stop();handle.removeEventListener('keydown',key);cat?.removeEventListener('click',greet);};
}
