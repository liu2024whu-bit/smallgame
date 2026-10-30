import {ease} from './shared.js';
import {CHOCOLATE_SPOTS} from '../../data/chocolate.js';

const model=root=>root.querySelector('[data-choc-model]');
function capture(root){
 const field=model(root);if(!field)return null;
 const world=field.closest('.choc-world'),points=new Map();
 for(const slot of field.querySelectorAll('[data-choc-slot]')){
  const piece=Number(slot.dataset.chocPiece),paint=slot.querySelector('.bonbon-paint');if(piece<0||!paint)continue;
  const original=CHOCOLATE_SPOTS[Number(slot.dataset.chocSlot)],translation=getComputedStyle(paint).translate.split(' ').map(parseFloat),drag=slot.classList.contains('choc-drag-source');
  points.set(piece,drag?[Number(slot.style.getPropertyValue('--choc-drag-x')),Number(slot.style.getPropertyValue('--choc-drag-y'))]:original.map((v,i)=>v+(translation[i]||0)));
 }
 const lid=field.querySelector('.choc-lid'),drawer=field.querySelector('.choc-drawer-body');
 return {p:JSON.parse(field.dataset.chocPose),points,lid:getComputedStyle(lid).transform,drawer:getComputedStyle(drawer).transform,grip:field.querySelector('[data-choc-drawer]')?.style.top,camera:world.dataset.sourceCamera,box:world.getBoundingClientRect()};
}
export const chocolateMotion={capture,play(root,old){
 const field=model(root);if(!field||!old)return;
 const p=JSON.parse(field.dataset.chocPose),animations=[],world=field.closest('.choc-world'),lid=field.querySelector('.choc-lid');
 if(p.opened!==old.p.opened){lid.style.zIndex=6;const a=lid.animate([{transform:old.lid},{transform:lid.style.transform}],{duration:620,easing:ease});animations.push(a);a.finished.catch(()=>{}).finally(()=>lid.style.removeProperty('z-index'));}
 if(p.drawer!==old.p.drawer){const body=field.querySelector('.choc-drawer-body'),grip=field.querySelector('[data-choc-drawer]');animations.push(body.animate([{transform:old.drawer},{transform:body.style.transform}],{duration:380,easing:ease}));if(grip&&old.grip)animations.push(grip.animate([{top:old.grip},{top:grip.style.top}],{duration:380,easing:ease}));}
 for(const slot of field.querySelectorAll('[data-choc-slot]')){
  const piece=Number(slot.dataset.chocPiece),paint=slot.querySelector('.bonbon-paint'),before=old.points.get(piece);if(!paint||!before)continue;
  const to=CHOCOLATE_SPOTS[Number(slot.dataset.chocSlot)],[dx,dy]=before.map((v,i)=>v-to[i]);
  if(Math.abs(dx)+Math.abs(dy)>1)animations.push(paint.animate([{translate:`${dx}px ${dy}px`},{translate:'0 0'}],{duration:220,easing:ease}));
 }
 const currentBox=world.getBoundingClientRect();
 if(old.camera!==world.dataset.sourceCamera||Math.abs(old.box.width-currentBox.width)>1||Math.abs(old.box.left-currentBox.left)+Math.abs(old.box.top-currentBox.top)>1){const box=world.parentElement.getBoundingClientRect();animations.push(world.animate([{transform:`translate(${old.box.left-box.left}px,${old.box.top-box.top}px) scale(${old.box.width/1536})`},{transform:world.style.transform}],{duration:360,easing:ease}));}
 if(!animations.length)return;
 field.dataset.chocBusy='true';const controls=[...field.querySelectorAll('button')].map(b=>[b,b.disabled]);controls.forEach(([b])=>b.disabled=true);
 Promise.allSettled(animations.map(a=>a.finished)).then(()=>{delete field.dataset.chocBusy;controls.forEach(([b,disabled])=>b.disabled=disabled);field.dispatchEvent(new Event('choc-settled'));});
}};
