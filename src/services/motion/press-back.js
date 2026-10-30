import {ease} from './shared.js';
const active=root=>root.querySelector('.back-world');
export const pressBackMotion={
 capture(root){
  const world=active(root);if(!world)return null;
  let arrival;try{arrival=JSON.parse(world.dataset.backArrival);}catch{}delete world.dataset.backArrival;
  const ghost=root.querySelector('.reorder-ghost.back-stamp'),source=world.querySelector('.back-stamp.drag-source');
  return {box:world.getBoundingClientRect(),arrival,mirror:world.querySelector('.back-mirror-prop')?.outerHTML,floor:getComputedStyle(world.querySelector('[data-back-floor]')).transform,attempts:Number(world.dataset.backAttempts),fitted:world.dataset.backFitted,
   stamps:new Map([...world.querySelectorAll('[data-back-stamp]')].map(el=>[el.dataset.backStamp,el===source&&ghost?ghost.getBoundingClientRect():el.getBoundingClientRect()]))};
 },
 play(root,before){
  const world=active(root);if(!world||!before)return;
  const now=world.getBoundingClientRect(),viewport=world.parentElement.getBoundingClientRect();
  if(Math.abs(now.width-before.box.width)+Math.abs(now.left-before.box.left)+Math.abs(now.top-before.box.top)>2)world.animate([{transform:`translate(${before.box.left-viewport.left}px,${before.box.top-viewport.top}px) scale(${before.box.width/1536})`},{transform:world.style.transform}],{duration:320,easing:ease});
  const floor=world.querySelector('[data-back-floor]'),to=getComputedStyle(floor).transform;
  if(before.floor!==to)floor.animate([{transform:before.floor},{transform:to}],{duration:460,easing:ease});
  else if(Number(world.dataset.backAttempts)>before.attempts&&world.querySelector('[data-back-open="false"]'))floor.animate([{transform:to},{transform:'translateY(-5%)',offset:.35},{transform:to}],{duration:260,easing:'ease-out'});
  if(now.width===before.box.width)for(const el of world.querySelectorAll('[data-back-stamp]')){
   const from=before.stamps.get(el.dataset.backStamp),to=el.getBoundingClientRect();if(!from)continue;
   const scale=now.width/1536,dx=(from.left-to.left)/scale,dy=(from.top-to.top)/scale;
   if(Math.abs(dx)+Math.abs(dy)>1)el.animate([{translate:`${dx}px ${dy}px`},{translate:'0 0'}],{duration:280,easing:ease});
  }
  if(world.dataset.backFitted!==before.fitted){
   if(world.dataset.backFitted==='true'){
    const mirror=world.querySelector('.back-mirror-prop'),to=mirror.getBoundingClientRect(),s=now.width/1536,from=before.arrival;
    mirror.animate([{translate:from?`${(from.left-to.left)/s}px ${(from.top-to.top)/s}px`:'0 -24px',scale:from?from.width/to.width:1,opacity:from?.width ? .9 : 0},{translate:'0 0',scale:1,opacity:1}],{duration:320,easing:ease});
   }else if(before.mirror){
    const holder=world.querySelector('.back-mirror'),exit=document.createElement('span');exit.className='back-mirror-departure';exit.inert=true;exit.innerHTML=before.mirror;holder.append(exit);
    const job=exit.animate([{translate:'0 0',opacity:1},{translate:'0 -32px',opacity:0}],{duration:240,easing:ease});job.finished.catch(()=>{}).finally(()=>exit.remove());
   }
  }
 },
};
