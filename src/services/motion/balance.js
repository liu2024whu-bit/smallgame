import {balanceMaterial} from '../balance-material.js';
import {balanceLean} from '../../data/balance-apparatus.js';
export const balanceMotion={
 capture(root){
  const model=root.querySelector('[data-balance-model]'),world=model?.closest('.balance-world');if(!world)return null;
  return {pose:balanceMaterial(model)?.snapshot(),camera:world.dataset.sourceCamera,box:world.getBoundingClientRect(),focus:document.activeElement?.dataset.focus};
 },
 play(root,old){
  const model=root.querySelector('[data-balance-model]'),world=model?.closest('.balance-world'),controller=balanceMaterial(model);if(!old?.pose||!world||!controller)return;
  const p=JSON.parse(model.dataset.balancePose),b=world.getBoundingClientRect(),camera=old.camera!==world.dataset.sourceCamera||Math.abs(old.box.width-b.width)>1;
  const changed=old.pose.p.places.join()!==p.places.join()||old.pose.held>=0||Object.keys(old.pose.floating??{}).length>0||Math.abs(old.pose.lean-balanceLean(p.places))>.01;
  if(camera){const v=world.parentElement.getBoundingClientRect();world.animate([{transform:`translate(${old.box.left-v.left}px,${old.box.top-v.top}px) scale(${old.box.width/1536})`},{transform:world.style.transform}],{duration:390,easing:'cubic-bezier(.22,.75,.3,1)'}).finished.catch(()=>{});}
  controller.animate(old.pose,p,{duration:changed?460:camera?390:0,blocking:changed||camera,focus:old.focus});
 },
};
