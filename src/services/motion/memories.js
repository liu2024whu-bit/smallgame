import {ease} from './shared.js';
const selectors=['.artist-table>.artist-paint','.cinema-wide>img','.prince-cover','.prince-page','.fan-leaf','.campus-painting>img'];
const paint=el=>{const s=getComputedStyle(el);return{transform:s.transform,transformOrigin:s.transformOrigin,scale:s.scale,opacity:s.opacity,filter:s.filter};};
function animate(el,keyframes,duration){
 const animation=el.animate(keyframes,{duration,easing:ease}),resize=()=>animation.cancel();
 window.addEventListener('resize',resize,{once:true});
 animation.finished.catch(()=>{}).finally(()=>window.removeEventListener('resize',resize));
}
function frames(root){
 const out=new Map();
 for(const selector of selectors)root.querySelectorAll(selector).forEach((el,i)=>out.set(selector+':'+i,{paint:paint(el),src:el.getAttribute('src')}));
 return out;
}
export const memoriesMotion={
 capture:root=>({frames:frames(root),unprinted:!!root.querySelector('.campus-stamp .stamp-place')}),
 play(root,before){
  for(const selector of selectors)root.querySelectorAll(selector).forEach((el,i)=>{
   const old=before.frames.get(selector+':'+i);if(!old||selector.includes('campus')&&old.src!==el.getAttribute('src'))return;const to=paint(el);
   if(Object.keys(to).every(k=>to[k]===old.paint[k]))return;
   animate(el,[old.paint,to],selector.includes('cinema')?720:420);
  });
  const ink=root.querySelector('.campus-stamp .campus-ink');if(before.unprinted&&ink)animate(ink,[{scale:'1.18',opacity:.3},{scale:'1',opacity:1}],320);
 },
};
