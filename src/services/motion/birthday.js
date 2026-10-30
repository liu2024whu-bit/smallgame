import {ease} from './shared.js';

export const birthdayMotion={
 capture(root){const stage=root.querySelector('[data-parcel-open]');return stage?{open:stage.dataset.parcelOpen==='true'}:null;},
 play(root,before){
  const stage=root.querySelector('[data-parcel-open]');if(!stage||!before||before.open||stage.dataset.parcelOpen!=='true')return;
  const middle=stage.querySelector('.parcel-opening'),final=stage.querySelector('.parcel-revealed');
  const options={duration:900,easing:'linear'},animations=[middle.animate([{opacity:0,easing:ease},{opacity:1,offset:.3},{opacity:1,offset:.55,easing:ease},{opacity:0}],options),final.animate([{opacity:0},{opacity:0,offset:.55,easing:ease},{opacity:1}],options)];
  const settle=()=>animations.forEach(a=>a.cancel());window.addEventListener('resize',settle,{once:true});
  Promise.allSettled(animations.map(a=>a.finished)).then(()=>window.removeEventListener('resize',settle));
 },
};
