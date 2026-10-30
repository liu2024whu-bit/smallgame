import {ribbonGeometry,RIBBON_WORLD} from '../../data/ribbons.js';
import {ribbonFree} from '../../puzzles/ribbons.js';
import {paintRibbonPull} from '../ribbon-props.js';
import {pointerSession} from './pointer.js';
import {motionAllowed,ease} from '../../services/motion/shared.js';

export function bindRibbons(root,progress,{move,changeView,solved=false,feedback=()=>{}}){
 const model=root.querySelector('[data-ribbon-model]'),world=model?.closest('.ribbons-world');if(!world)return ()=>{};
 const p=progress,abort=new AbortController(),{signal}=abort,status=root.querySelector('.ribbons-status');
 const busy=()=>!!(model.dataset.ribbonBusy||model.dataset.ribbonReturning);
 const restore=index=>{
  const strap=model.querySelector(`[data-ribbon-strap="${index}"]`),grip=model.querySelector(`[data-ribbon-tail="${index}"]`);if(!strap||!grip)return;
  const elements=[strap,strap.querySelector('.ribbon-material'),strap.querySelector('.ribbon-end-paint'),grip],style=el=>Object.fromEntries(['left','top','width'].filter(k=>el.style[k]).map(k=>[k,el.style[k]])),before=elements.map(style);
  paintRibbonPull(model,p,index,0);
  if(!motionAllowed())return;
  const animations=elements.map((el,i)=>el.animate([before[i],style(el)],{duration:200,easing:ease}));
  model.dataset.ribbonReturning='true';Promise.allSettled(animations.map(a=>a.finished)).then(()=>delete model.dataset.ribbonReturning);
 };
 const blocked=index=>{status.textContent='折边还压着呢。';feedback('stop');paintRibbonPull(model,p,index,8);restore(index);};
 const pull=index=>{if(!ribbonFree(p,index)){blocked(index);return;}move({type:'pull',index});};
 root.addEventListener('click',event=>{
  const el=event.target.closest('[data-ribbon-view],[data-ribbon-flip],button[data-ribbon-tail]');if(!el||!root.contains(el)||busy()||Date.now()<Number(root.dataset.suppressUntil??0))return;
  event.preventDefault();event.stopPropagation();
  if(el.hasAttribute('data-ribbon-view')){changeView({ribbonView:el.dataset.ribbonView,ribbonDoneInspect:solved});return;}
  if(el.hasAttribute('data-ribbon-flip')){move({type:'flip'});return;}
  if(!solved)pull(Number(el.dataset.ribbonTail));
 },{signal});
 const stop=pointerSession(root,{
  pick(event){const source=event.target.closest('button[data-ribbon-tail]');if(!source||!model.contains(source)||busy()||solved)return null;const index=Number(source.dataset.ribbonTail);return {source,index,direction:ribbonGeometry(p.back,index).direction,free:ribbonFree(p,index)};},
  start(g){g.scale=world.getBoundingClientRect().width/RIBBON_WORLD[0];},
  move(g,event){g.distance=((event.clientX-g.x)*g.direction[0]+(event.clientY-g.y)*g.direction[1])/g.scale;paintRibbonPull(model,p,g.index,Math.max(-5,Math.min(g.free?140:8,g.distance)));},
  end(g,event,cancelled){
   const b=world.parentElement.getBoundingClientRect(),inside=event?.clientX>=b.left&&event.clientX<=b.right&&event.clientY>=b.top&&event.clientY<=b.bottom;
   if(cancelled||!inside||g.distance<24){restore(g.index);return;}
   if(g.free){move({type:'pull',index:g.index});return;}
   status.textContent='折边还压着呢。';feedback('stop');restore(g.index);
  },
  clear(){if(model.isConnected)for(let i=0;i<6;i++)if(!p.removed.includes(i))paintRibbonPull(model,p,i,0);},
 });
 return ()=>{stop();abort.abort();};
}
