import { pointerSession } from './pointer.js';
import { motionAllowed } from '../../services/motion.js';
import { ENCORE_HANDLE,encoreCrankPose,encorePageAngle } from '../../data/mechanism-layouts.js';
import {ASSETS} from '../../data/assets.js';

export function bindEncore(root, changeView) {
  const handle=root.querySelector('[data-encore-handle]');
  if(!handle)return ()=>{};
  for(const src of [ASSETS.encoreOpen,ASSETS.encoreMid]){const image=new Image();image.src=src;}
  const art=handle.querySelector('.item-art'),theatre=root.querySelector('[data-encore-wind]'),initial=Number(theatre.dataset.encoreWind);
  let returnMotion,greeting,committed=false;
  const angle=(event,box)=>encorePageAngle(event.clientX-box.x,event.clientY-box.y);
  const stop=pointerSession(root,{
    pick(event){if(!event.target.closest('[data-encore-handle]'))return null;returnMotion?.cancel();const b=handle.getBoundingClientRect(),pivot={x:b.x+art.offsetWidth*ENCORE_HANDLE.pivotX,y:b.y+art.offsetHeight*ENCORE_HANDLE.pivotY};handle.focus({preventScroll:true});return {source:handle,pivot,last:angle(event,pivot),wind:initial};},
    move(gesture,event){const next=angle(event,gesture.pivot),delta=((next-gesture.last+540)%360)-180;gesture.last=next;gesture.wind=Math.max(0,Math.min(720,gesture.wind+delta));art.style.transform=encoreCrankPose(gesture.wind);theatre.dataset.encoreAngle=gesture.wind;theatre.style.setProperty('--warm',Math.min(1,gesture.wind/360));},
    end(gesture,_,cancelled){if(!cancelled){committed=true;changeView({wind:Math.round(gesture.wind)});}},
    clear(){if(committed)return;const from=getComputedStyle(art).transform;art.style.removeProperty('transform');delete theatre.dataset.encoreAngle;theatre.style.setProperty('--warm',Math.min(1,initial/360));if(art.isConnected&&motionAllowed()&&from!==getComputedStyle(art).transform)returnMotion=art.animate([{transform:from},{transform:getComputedStyle(art).transform}],{duration:180,easing:'ease-out'});},
  });
  const key=event=>{if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;event.preventDefault();changeView({wind:Math.max(0,Math.min(720,initial+(event.key==='ArrowRight'?60:-60)))});};
  handle.addEventListener('keydown',key);
  const cat=root.querySelector('.theatre-cat');
  const greet=()=>{if(motionAllowed()){greeting?.cancel();greeting=cat.animate([{translate:'0 0'},{translate:'0 -5px',offset:.4},{translate:'0 0'}],{duration:500});}};
  cat?.addEventListener('click',greet);
  return ()=>{stop();returnMotion?.cancel();greeting?.cancel();handle.removeEventListener('keydown',key);cat?.removeEventListener('click',greet);};
}
