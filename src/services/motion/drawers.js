import {motionAllowed,ease} from './shared.js';

const modelAt=root=>root.querySelector('.drawer-placement [data-drawer-model]');
const poses=model=>new Map([...model.querySelectorAll('[data-drawer-motion]')].map(el=>[el.dataset.drawerMotion,getComputedStyle(el).transform]));
export const drawersMotion={
 capture(root){const model=modelAt(root);if(!model)return null;const world=model.closest('.drawer-world');return {back:model.dataset.drawerSide,html:model.outerHTML,poses:poses(model),box:world.getBoundingClientRect()};},
 play(root,before){
  const model=modelAt(root);if(!model||!before||!motionAllowed())return;
  if(before.back!==model.dataset.drawerSide){
   const holder=document.createElement('span');holder.className='drawer-old-side';holder.inert=true;holder.innerHTML=before.html;model.parentElement.append(holder);model.dataset.drawerTurning='true';
   const controls=[...model.querySelectorAll('button')].map(el=>[el,el.disabled]);controls.forEach(([el])=>el.disabled=true);
   const old=holder.animate([{transform:'perspective(850px) rotateY(0deg)'},{transform:'perspective(850px) rotateY(-90deg)'}],{duration:160,easing:ease,fill:'forwards'});
   const next=model.animate([{transform:'perspective(850px) rotateY(90deg)'},{transform:'perspective(850px) rotateY(0deg)'}],{duration:200,delay:160,easing:ease,fill:'backwards'});
   Promise.allSettled([old.finished,next.finished]).then(()=>{holder.remove();if(model.isConnected){delete model.dataset.drawerTurning;controls.forEach(([el,disabled])=>el.disabled=disabled);}});
  }else for(const el of model.querySelectorAll('[data-drawer-motion]')){const from=before.poses.get(el.dataset.drawerMotion),to=getComputedStyle(el).transform;if(from&&from!==to)el.animate([{transform:from},{transform:to}],{duration:300,easing:ease});}
  const world=model.closest('.drawer-world'),after=world.getBoundingClientRect();
  if(Math.abs(after.width-before.box.width)>.5){const r=world.parentElement.getBoundingClientRect();world.animate([{transform:`translate(${before.box.left-r.left}px,${before.box.top-r.top}px) scale(${before.box.width/220})`},{transform:world.style.transform}],{duration:340,easing:ease});}
 },
};
