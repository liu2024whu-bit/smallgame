import {ease} from './shared.js';

const pages=root=>[...root.querySelectorAll('.album-layout [data-album-page]')];
function pose(page){
 const moving=page.classList.contains('drag-source'),translation=getComputedStyle(page).translate.split(' ').map(parseFloat),turn=page.querySelector('.album-paper-turn');
 return {x:page.offsetLeft+(moving?Number(page.style.getPropertyValue('--album-arrival-x')):translation[0]||0),y:page.offsetTop+(moving?Number(page.style.getPropertyValue('--album-arrival-y')):translation[1]||0),face:page.dataset.albumFace,turn:getComputedStyle(turn).transform};
}
export const albumMotion={
 capture:root=>new Map(pages(root).map(page=>[page.dataset.albumPage,pose(page)])),
 play(root,before){
  for(const page of pages(root)){
   const old=before.get(page.dataset.albumPage);if(!old)continue;
   const dx=old.x-page.offsetLeft,dy=old.y-page.offsetTop;
   if(Math.abs(dx)+Math.abs(dy)>1)page.animate([{translate:`${dx}px ${dy}px`},{translate:'0 0'}],{duration:310,easing:ease});
   if(old.face!==page.dataset.albumFace){const turn=page.querySelector('.album-paper-turn');turn.animate([{transform:old.turn},{transform:turn.style.transform}],{duration:380,easing:ease});}
  }
 },
};
