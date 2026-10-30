import {ease} from './shared.js';
const key=el=>el.hasAttribute('data-film-sample')?'sample:'+el.dataset.filmSample:el.dataset.filmClip;
const parts=root=>new Map([...root.querySelectorAll('[data-film-clip],[data-film-sample]')].map(el=>[key(el),{box:el.getBoundingClientRect(),feed:el.querySelector('.film-feed')?.style.left}]));
export const filmMotion={
 capture(root){return {camera:root.querySelector('.film-case')?.getBoundingClientRect(),mode:root.querySelector('[data-film-mode]')?.dataset.filmMode,parts:parts(root),papers:[...root.querySelectorAll('.film-leaf .film-paper-turn')].map(el=>getComputedStyle(el).transform),opened:!!root.querySelector('.film-pocket-open')};},
 play(root,before){
  const field=root.querySelector('.film-workbench');if(!field)return;
  const mode=field.dataset.filmMode,camera=field.querySelector('.film-case'),next=camera.getBoundingClientRect();
  if(before.camera&&(before.mode!==mode||Math.abs(before.camera.width-next.width)>1)){
   const old=before.camera;
   camera.animate([{transform:`translate(${old.left-next.left}px,${old.top-next.top}px) scale(${old.width/next.width},${old.height/next.height})`},{transform:'none'}],{duration:320,easing:ease});
  }else if(!before.camera){field.animate([{opacity:.55},{opacity:1}],{duration:280,easing:ease});}
  if(before.mode===mode)field.querySelectorAll('[data-film-clip],[data-film-sample]').forEach(el=>{
   const old=before.parts.get(key(el));if(!old)return;
   const box=el.getBoundingClientRect(),dx=old.box.left-box.left;
   if(Math.abs(dx)>1)el.animate([{translate:`${dx}px 0`},{translate:'0 0'}],{duration:300,easing:ease});
   const feed=el.querySelector('.film-feed');if(feed&&old.feed!==feed.style.left)feed.animate([{left:old.feed},{left:feed.style.left}],{duration:300,easing:ease});
  });
  field.querySelectorAll('.film-leaf .film-paper-turn').forEach((el,i)=>{const end=getComputedStyle(el).transform;if(before.papers[i]&&before.papers[i]!==end)el.animate([{transform:before.papers[i]},{transform:end}],{duration:380,easing:ease});});
  if(!before.opened&&field.querySelector('.film-pocket-open')){
   field.querySelector('.film-pocket-open').animate([{opacity:0},{opacity:1}],{duration:360,easing:ease});
   field.querySelector('.film-reward')?.animate([{translate:'0 8px',opacity:0},{translate:'0 0',opacity:1}],{duration:320,delay:100,fill:'backwards',easing:ease});
  }
 }
};
