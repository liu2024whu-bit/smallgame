import {ease} from './shared.js';

export const skyMotion={
 capture:root=>root.querySelector('.sky-diorama')?.dataset.skyPair??null,
 play(root,before){
  const stage=root.querySelector('.sky-diorama');
  if(before===null||!stage||stage.dataset.skyPair===before)return;
  stage.querySelectorAll('.sky-person').forEach((person,index)=>person.animate(
   [{opacity:0,translate:'-50% 7px'},{opacity:1,translate:'-50% 0'}],
   {duration:320,delay:index*45,fill:'backwards',easing:ease}
  ));
 }
};
