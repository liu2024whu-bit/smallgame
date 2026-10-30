import {ease} from './shared.js';
import {captureSweetsCords,sweetsCordNodes,sweetsPositionStyle as position} from '../../ui/sweets-props.js';

const field=root=>root.querySelector('[data-sweets-model]');
export const sweetsMotion={
 capture(root){
  const m=field(root);if(!m)return null;
  const world=m.closest('.sweets-world');
  return {p:JSON.parse(m.dataset.sweetsPose),points:new Map([...m.querySelectorAll('[data-sweet-piece]')].map(el=>[el.dataset.sweetPiece,position(el)])),plate:position(m.querySelector('[data-sweet-plate="0"]')),cords:captureSweetsCords(m),camera:world.dataset.sourceCamera,box:world.getBoundingClientRect()};
 },
 play(root,old){
  const m=field(root);if(!m||!old)return;
  const p=JSON.parse(m.dataset.sweetsPose),animations=[],world=m.closest('.sweets-world');
  if(p.served!==old.p.served){
   const plate=m.querySelector('[data-sweet-plate="0"]');
   animations.push(plate.animate([old.plate,position(plate)],{duration:400,easing:ease}));
   for(const el of m.querySelectorAll('[data-sweet-piece]')){
    const before=old.points.get(el.dataset.sweetPiece),after=position(el);
    if(!before)continue;
    const middle={left:(parseFloat(before.left)+parseFloat(after.left))/2+'px',top:(parseFloat(before.top)+parseFloat(after.top))/2-45+'px',offset:.5};
    el.style.zIndex=10;
    const a=el.animate([before,middle,after],{duration:600,delay:220+Number(el.dataset.sweetPiece)*12,fill:'backwards',easing:ease});
    animations.push(a);a.finished.catch(()=>{}).finally(()=>el.style.removeProperty('z-index'));
   }
  }else{
   [...m.querySelectorAll('[data-sweet-cord]')].forEach((el,i)=>{
    const targets=sweetsCordNodes(m,i);
    targets.forEach((target,j)=>{const before=old.cords[i]?.[j],after=position(target);if(before&&JSON.stringify(before)!==JSON.stringify(after))animations.push(target.animate([before,after],{duration:200,easing:ease}));});
   });
  }
  const nextBox=world.getBoundingClientRect();
  if(old.camera!==world.dataset.sourceCamera||Math.abs(old.box.width-nextBox.width)>1){
   const box=world.parentElement.getBoundingClientRect();
   animations.push(world.animate([{transform:`translate(${old.box.left-box.left}px,${old.box.top-box.top}px) scale(${old.box.width/1536})`},{transform:world.style.transform}],{duration:360,easing:ease}));
  }
  if(!animations.length)return;
  m.dataset.sweetsBusy='true';const controls=[...m.querySelectorAll('button')].map(el=>[el,el.disabled]);controls.forEach(([el])=>el.disabled=true);
  const finish=root.querySelector('.completion-note');if(finish)finish.style.visibility='hidden';
  Promise.allSettled(animations.map(a=>a.finished)).then(()=>{if(!m.isConnected)return;delete m.dataset.sweetsBusy;controls.forEach(([el,disabled])=>el.disabled=disabled);if(finish)finish.style.removeProperty('visibility');m.dispatchEvent(new Event('sweets-settled'));});
 },
};
