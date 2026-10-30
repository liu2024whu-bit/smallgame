import {ease} from './shared.js';
import {encoreCrankPose,encoreCrankAngle} from '../../data/mechanism-layouts.js';

function animate(el,frames,options={}){
 const a=el.animate(frames,{duration:340,easing:ease,...options});
 const cancel=()=>a.cancel();window.addEventListener('resize',cancel,{once:true});
 a.finished.catch(()=>{}).finally(()=>window.removeEventListener('resize',cancel));
}
const paint=el=>el?{transform:getComputedStyle(el).transform,opacity:getComputedStyle(el).opacity}:null;
export const recordsMotion={
 capture(root){const detail=root.querySelector('[data-record-detail]'),theatre=root.querySelector('.paper-theatre');return {detail:detail?.dataset.recordDetail,wind:paint(root.querySelector('.encore-handle .item-art')),angle:Number(theatre?.dataset.encoreAngle??theatre?.dataset.encoreWind??0),light:paint(root.querySelector('.theatre-light')),theatre:theatre?.getBoundingClientRect(),letter:!!root.querySelector('.encore-letter'),unsealed:!!root.querySelector('.theatre-open-envelope'),read:new Set([...root.querySelectorAll('.reading-book.book-opened')].map(el=>el.dataset.index))};},
 play(root,before){
  const detail=root.querySelector('[data-record-detail]');if(detail&&before.detail!==undefined&&detail.dataset.recordDetail!==before.detail)animate(detail,[{opacity:.3,translate:'0 5px'},{opacity:1,translate:'0 0'}]);
  const handle=root.querySelector('.encore-handle .item-art');if(handle&&before.wind){const from=encoreCrankAngle(before.wind.transform,before.angle),to=Number(root.querySelector('[data-encore-wind]').dataset.encoreWind),steps=Math.max(1,Math.ceil(Math.abs(to-from)/12));if(Math.abs(to-from)>.1)animate(handle,Array.from({length:steps+1},(_,i)=>({transform:encoreCrankPose(from+(to-from)*i/steps)})),{duration:380});}
  const light=root.querySelector('.theatre-light');if(light&&before.light&&getComputedStyle(light).opacity!==before.light.opacity)animate(light,[{opacity:before.light.opacity},{opacity:getComputedStyle(light).opacity}],{duration:650});
  const theatre=root.querySelector('.paper-theatre');if(theatre&&before.theatre){const box=theatre.getBoundingClientRect(),old=before.theatre;if(Math.abs(old.width-box.width)>1)animate(theatre,[{transformOrigin:'0 0',transform:`translate(${old.left-box.left}px,${old.top-box.top}px) scale(${old.width/box.width})`},{transformOrigin:'0 0',transform:'none'}],{duration:420});}
  const note=root.querySelector('.encore-letter');if(note&&!before.letter)animate(note,[{opacity:0,translate:'-12px 6px',rotate:'-2deg'},{opacity:1,translate:'0 0',rotate:'0deg'}],{delay:120,duration:420});
  const opened=root.querySelector('.theatre-open-envelope:not(.theatre-mid-envelope)'),middle=root.querySelector('.theatre-mid-envelope');if(opened&&middle&&!before.unsealed){animate(middle,[{opacity:0},{opacity:1,offset:.4},{opacity:0}],{duration:460});animate(opened,[{opacity:0},{opacity:0,offset:.35},{opacity:1}],{duration:460});}
  root.querySelectorAll('.reading-book.book-opened').forEach(el=>{if(!before.read.has(el.dataset.index))animate(el.querySelector('.reading-bookmark'),[{opacity:0,translate:'0 -6px'},{opacity:1,translate:'0 0'}]);});
 },
};
