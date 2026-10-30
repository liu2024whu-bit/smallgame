import {pointerSession} from './pointer.js';
import {SWEETS_GRID} from '../../data/sweets.js';
import {sweetsFit} from '../../puzzles/sweets.js';
import {paintSweetsCords,captureSweetsCords,sweetsCordNodes,sweetsPositionStyle} from '../sweets-props.js';
import {motionAllowed,ease} from '../../services/motion/shared.js';

export function bindSweets(root,p,{move,changeView,solved=false}){
 const model=root.querySelector('[data-sweets-model]'),world=model?.closest('.sweets-world');if(!world)return ()=>{};
 const abort=new AbortController(),{signal}=abort,status=root.querySelector('.sweets-status');
 const fitHitAreas=()=>{const scale=world.style.transform?Math.abs(new DOMMatrix(world.style.transform).a):world.getBoundingClientRect().width/1536;if(scale>0)model.style.setProperty('--sweets-scale',scale);};
 const observer=new ResizeObserver(fitHitAreas);observer.observe(world.parentElement);fitHitAreas();
 model.addEventListener('sweets-settled',fitHitAreas,{signal});
 const busy=()=>!!(model.dataset.sweetsBusy||model.dataset.sweetsReturning),canMove=()=>!busy()&&!solved&&!p.served;
 const putBack=()=>{
  const before=captureSweetsCords(model);paintSweetsCords(model,p.cuts);
  if(!motionAllowed())return;
  const animations=[];
  for(let i=0;i<3;i++)sweetsCordNodes(model,i).forEach((el,j)=>{const next=sweetsPositionStyle(el);if(JSON.stringify(before[i][j])!==JSON.stringify(next))animations.push(el.animate([before[i][j],next],{duration:200,easing:ease}));});
  if(!animations.length)return;
  model.dataset.sweetsReturning='true';
  Promise.allSettled(animations.map(a=>a.finished)).then(()=>delete model.dataset.sweetsReturning);
 };
 root.addEventListener('click',event=>{
  const control=event.target.closest('[data-sweet-view],[data-sweet-serve]');if(!control||!root.contains(control)||busy()||Date.now()<Number(root.dataset.suppressUntil??0))return;
  event.preventDefault();event.stopPropagation();
  if(control.hasAttribute('data-sweet-view')){changeView({sweetsView:control.dataset.sweetView});return;}
  if(!canMove())return;
  if(!sweetsFit(p.cuts)){status.textContent='还有一份，少了一样呢。';return;}
  move({type:'serve'});
 },{signal});
 root.addEventListener('keydown',event=>{
  const grip=event.target.closest('[data-sweet-cut]');if(!grip||!canMove()||event.ctrlKey||event.metaKey||event.altKey)return;
  const index=Number(grip.dataset.sweetCut),value=p.cuts[index],next={ArrowLeft:value-1,ArrowUp:value-1,ArrowRight:value+1,ArrowDown:value+1,Home:1,End:7}[event.key];
  if(next===undefined)return;event.preventDefault();event.stopPropagation();
  move({type:'cut',index,value:Math.max(1,Math.min(7,next))});
 },{signal});
 const local=(x,y)=>{const b=world.getBoundingClientRect(),scale=b.width/1536;return [(x-b.left)/scale,(y-b.top)/scale];};
 const stop=pointerSession(root,{
  pick(event){const source=event.target.closest('[data-sweet-cut]');if(!source||!model.contains(source)||!canMove())return null;return {source,index:Number(source.dataset.sweetCut)};},
  start(g){g.start=local(g.x,g.y);g.origin=p.cuts[g.index];g.preview=[...p.cuts];},
  move(g,event){const pt=local(event.clientX,event.clientY),axis=g.index?0:1,step=SWEETS_GRID[g.index?2:3]/8;g.preview[g.index]=Math.max(1,Math.min(7,g.origin+(pt[axis]-g.start[axis])/step));g.value=Math.round(g.preview[g.index]);paintSweetsCords(model,g.preview);},
  end(g,event,cancelled){
   const b=world.parentElement.getBoundingClientRect(),inside=event?.clientX>=b.left&&event.clientX<=b.right&&event.clientY>=b.top&&event.clientY<=b.bottom;
   if(!cancelled&&inside&&g.value!==undefined&&g.value!==p.cuts[g.index]){move({type:'cut',index:g.index,value:g.value});return;}
   putBack();
  },
  clear(){if(model.isConnected)paintSweetsCords(model,p.cuts);},
 });
 return ()=>{stop();observer.disconnect();abort.abort();};
}
