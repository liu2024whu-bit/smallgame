import {ease} from './shared.js';
function pieces(root){
 const out=new Map();
 for(const el of root.querySelectorAll('.packing-workbench [data-pack-print],.packing-ghost [data-pack-print]')){
  const box=el.getBoundingClientRect();out.set(el.dataset.packPrint,{box,turn:Number(el.dataset.packTurn)});
 }
 return out;
}
export const packingMotion={
 capture:pieces,
 play(root,before){
  const finished=root.querySelector('.packing-finished-art');if(finished&&before.size)finished.animate([{opacity:.82},{opacity:1}],{duration:190,easing:ease});
  for(const el of root.querySelectorAll('.packing-workbench [data-pack-print]')){
   const old=before.get(el.dataset.packPrint);if(!old)continue;const box=el.getBoundingClientRect(),turn=Number(el.dataset.packTurn),delta=((old.turn-turn+6)%4-2)*90;
   if(Math.abs(box.left-old.box.left)<.5&&Math.abs(box.top-old.box.top)<.5&&Math.abs(box.width-old.box.width)<.5&&!delta)continue;
   el.animate([{transform:`translate(${old.box.left-box.left}px,${old.box.top-box.top}px) scale(${old.box.width/box.width}) rotate(${delta}deg)`},{transform:'none'}],{duration:190,easing:ease});
  }
 },
};
