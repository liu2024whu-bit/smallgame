import {pointerSession,dragGhost} from './pointer.js';
import {paintLight} from '../puzzles/light.js';
import {stopLight,settleLight} from '../../services/motion/light.js';
import {lightLayout} from '../../data/light.js';
import {announce,atlas} from '../dom.js';
const clamp=value=>Math.max(0,Math.min(3,value));
export function bindLight(root,progress,move,feedback=()=>{},changeView=()=>{}){
 const field=root.querySelector('[data-light-case]');if(!field)return ()=>{};
 const controller=new AbortController(),signal=controller.signal,tall=field.dataset.lightTall==='true',layout=lightLayout(tall);
 matchMedia('(max-width:700px)').addEventListener('change',event=>{if(event.matches!==tall)changeView({lightPortrait:event.matches});},{signal});
 root.addEventListener('click',event=>{const grip=event.target.closest('[data-light-adjust]');if(grip&&progress.values[Number(grip.dataset.lightAdjust)]===3){event.preventDefault();event.stopPropagation();feedback('stop');announce('到头啦。');}},{signal});
 root.addEventListener('keydown',event=>{
  const grip=event.target.closest('[data-light-adjust]');if(!grip||grip.disabled||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
  event.preventDefault();event.stopPropagation();const index=Number(grip.dataset.lightAdjust);
  const step=['ArrowRight','ArrowUp'].includes(event.key)?1:-1,value=event.key==='Home'?0:event.key==='End'?3:clamp(progress.values[index]+step);
  if(!move({type:'set-turn',index,value}))announce('到头啦。');
 },{signal});
 const sliding=pointerSession(root,{
  pick(event){const source=event.target.closest('[data-light-adjust]');return source&&!source.disabled?{source,index:Number(source.dataset.lightAdjust)}:null;},
  start(g){g.pose=stopLight(field);g.base=g.pose.values[g.index];g.scale=layout.view[2]/field.getBoundingClientRect().width;g.notch=Math.round(g.base);field.dataset.lightPreview=g.index;},
  move(g,event){
   const dx=(event.clientX-g.x)*g.scale,dy=(event.clientY-g.y)*g.scale;
   const ax=layout.camera.xx*60,ay=layout.camera.yx*60;
   const physical=g.index===0?Math.hypot(ax,ay):g.index===1?24:70,fine=Math.min(1,physical/g.scale/18);
   const distance=(g.index===0?(dx*ax+dy*ay)/(ax*ax+ay*ay):g.index===1?-dy/24:dx/70)*fine;
   const value=clamp(g.base+distance),values=[...g.pose.values];values[g.index]=value;
   paintLight(field,{...g.pose,values});g.value=Math.round(value);
   if(g.value!==g.notch){g.notch=g.value;feedback('detent');}
  },
  end(g,_,cancelled){if(!cancelled&&g.value!==undefined)move({type:'set-turn',index:g.index,value:g.value});},
  clear(){
   if(!field.isConnected||!field.hasAttribute('data-light-preview'))return;
   const from=stopLight(field);delete field.dataset.lightPreview;
   settleLight(field,from,progress,{duration:220});
  }
 });
 const drawing=pointerSession(root,{
  pick(event){const source=event.target.closest('[data-light-pencil]');return source&&!source.disabled?{source}:null;},
  start(g){g.ghost=dragGhost(atlas('lightFixtures',4,{className:'light-pencil-ghost'}),'drawing-pencil');feedback('return');},
  move(g,event){
   g.ghost.style.left=event.clientX+'px';g.ghost.style.top=event.clientY+'px';
   const over=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-light-paper]');
   g.onPaper=!!over;field.classList.toggle('light-ready-to-trace',g.onPaper);
  },
  end(g,_,cancelled){if(!cancelled&&g.onPaper){if(!move({type:'trace'})){feedback('stop');announce('影子还没有和那几笔淡线合上。');}}else g.returnToSource=true;},
  clear(){field.classList.remove('light-ready-to-trace');}
 });
 return ()=>{sliding();drawing();stopLight(field);controller.abort();};
}
