import {pointerSession} from './pointer.js';
import {settleScreenLeaf} from '../../services/motion/screen.js';
import {bindScreenBacking} from './screen-backing.js';
import {screenApertures} from './screen-apertures.js';
export function bindScreen(root,progress,{move,changeView}){
 const abort=new AbortController(),signal=abort.signal,holeAt=screenApertures(root,progress);let active;
 const handlers={
  pick(event){const source=event.target.closest('[data-screen-leaf]');return source&&!source.disabled&&!holeAt(event)?{source,index:Number(source.dataset.screenLeaf)}:null;},
  start(g){active=g;g.leaf=g.source.firstElementChild;const current=getComputedStyle(g.leaf).transform,matrix=new DOMMatrixReadOnly(current);g.startAngle=Math.atan2(matrix.m31,matrix.m11)*180/Math.PI;g.leaf.getAnimations().forEach(a=>a.cancel());g.leaf.style.transform=current;g.rest=progress.flips[g.index]*180;g.leaf.dataset.restTransform=`rotateY(${g.rest}deg)`;g.span=Math.max(44,g.source.getBoundingClientRect().width);},
  move(g,e){g.delta=Math.max(-175,Math.min(175,(e.clientX-g.x)/g.span*180));g.angle=g.startAngle+g.delta;g.leaf.style.transform=`rotateY(${g.angle}deg)`;},
  end(g,e,cancelled){if(cancelled||!Number.isFinite(e?.clientX)||!Number.isFinite(e?.clientY))return;const at=document.elementFromPoint(e.clientX,e.clientY),inside=at&&root.querySelector('.screen-viewport')?.contains(at),distance=(a,b)=>Math.abs(((a-b+180)%360+360)%360-180);if(inside&&distance(g.angle,g.rest+180)<distance(g.angle,g.rest))move({type:'flip',index:g.index});},
  clear(){if(active){settleScreenLeaf(active.leaf);active=null;}},
 };
 const stop=pointerSession(root,handlers),stopBacking=bindScreenBacking(root,progress,move,holeAt);
 root.addEventListener('click',event=>{
  if(!holeAt(event))return;
  event.preventDefault();event.stopImmediatePropagation();
  if(Number(root.dataset.suppressUntil??0)<=Date.now())move({type:'turn-backing'});
 },{signal,capture:true});
 root.addEventListener('keydown',event=>{
  const button=event.target.closest('[data-screen-leaf]');if(!button||button.disabled)return;
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();event.stopImmediatePropagation();
  const index=Number(button.dataset.screenLeaf),at=event.key==='Home'?0:event.key==='End'?8:Math.max(0,Math.min(8,index+(event.key==='ArrowRight'?1:-1)));
  if(Math.floor(at/3)!==Math.floor(index/3))changeView({screenView:'paper',screenGroup:Math.floor(at/3)});
  root.querySelector(`[data-screen-leaf="${at}"]`)?.focus({preventScroll:true});
 },{signal});
 return ()=>{stop();stopBacking();abort.abort();};
}
