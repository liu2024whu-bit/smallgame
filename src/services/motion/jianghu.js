import {ease} from './shared.js';
import {animateDrawerPose} from '../jianghu-poses.js';
export const jianghuMotion={
 capture(root){const desk=root.querySelector('[data-jianghu-state]');return desk?{opened:desk.dataset.jianghuState==='open',pull:Number(desk.querySelector('.jianghu-world').dataset.jianghuPull??0),page:desk.dataset.jianghuPage,picture:desk.querySelector('.jianghu-paper-paint')?.getAttribute('src')}:null;},
 play(root,before){
  const desk=root.querySelector('[data-jianghu-state]');if(!desk||!before)return;
  if(!before.opened&&desk.dataset.jianghuState==='open'){
   animateDrawerPose(desk.querySelector('.jianghu-world'),{from:before.pull,to:1,duration:Math.max(180,640*(1-before.pull))});
  }
  const current=desk.querySelector('.jianghu-paper-paint');
  if(current&&before.picture&&before.picture!==current.getAttribute('src')){
   const old=current.cloneNode();old.src=before.picture;old.alt='';old.classList.add('jianghu-old-paper');old.inert=true;current.after(old);
   const a=old.animate([{opacity:1},{opacity:0}],{duration:300,easing:ease,fill:'forwards'});a.finished.catch(()=>{}).finally(()=>old.remove());
  }

 },
};
