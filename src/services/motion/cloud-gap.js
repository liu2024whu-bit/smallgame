import {paintGapPose} from '../gap-paper.js';
import {ease,motionAllowed} from './shared.js';

const runs=new WeakMap();
export function finishGapPose(world){const run=runs.get(world);if(run){cancelAnimationFrame(run.frame);paintGapPose(world,run.to);runs.delete(world);delete world.dataset.gapAnimating;}}
export function settleGapPose(world,from,to,duration=230){
 finishGapPose(world);
 if(!motionAllowed()||from.every((v,i)=>Math.abs(v-to[i])<.001)){paintGapPose(world,to);return;}
 const start=performance.now(),run={to,frame:0};runs.set(world,run);world.dataset.gapAnimating='true';paintGapPose(world,from);
 const tick=now=>{
  if(!world.isConnected){runs.delete(world);return;}
  const t=Math.min(1,(now-start)/duration),q=1-(1-t)**3;
  paintGapPose(world,!motionAllowed()?to:from.map((v,i)=>v+(to[i]-v)*q));
  if(t<1&&motionAllowed())run.frame=requestAnimationFrame(tick);else{paintGapPose(world,to);runs.delete(world);delete world.dataset.gapAnimating;}
 };
 run.frame=requestAnimationFrame(tick);
}
export const cloudGapMotion={
 capture(root){
  const world=root.querySelector('.gap-world'),model=world?.querySelector('[data-gap-model]');if(!world||!model)return null;
  return {box:world.getBoundingClientRect(),pose:model.dataset.gapPose.split(',').map(Number),back:model.dataset.gapBack,angle:getComputedStyle(model.querySelector('.gap-turntable')).rotate};
 },
 play(root,before){
  const world=root.querySelector('.gap-world'),model=world?.querySelector('[data-gap-model]');if(!world||!model||!before)return;
  const to=model.dataset.gapState.split(',').map(Number),now=world.getBoundingClientRect(),viewport=world.parentElement.getBoundingClientRect();
  settleGapPose(model,before.pose,to);
  if(Math.abs(now.width-before.box.width)+Math.abs(now.left-before.box.left)+Math.abs(now.top-before.box.top)>2)world.animate([{transform:`translate(${before.box.left-viewport.left}px,${before.box.top-viewport.top}px) scale(${before.box.width/1536})`},{transform:world.style.transform}],{duration:320,easing:ease});
  if(model.dataset.gapBack!==before.back){const table=model.querySelector('.gap-turntable');table.animate([{rotate:before.angle},{rotate:table.style.rotate}],{duration:460,easing:ease});}
 },
};
