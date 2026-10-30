import {pointerSession} from './pointer.js';
import {drawerEnabled} from '../../puzzles/drawers.js';
import {DRAWER_TRAVEL,REAR_TRAVEL} from '../../data/drawer-apparatus.js';
import {paintDrawerPose} from '../drawer-props.js';
import {motionAllowed,ease,settleAnimations} from '../../services/motion/shared.js';

export function bindDrawers(root,p,{move,changeView,feedback=()=>{},solved=false}){
 const abort=new AbortController(),{signal}=abort,model=root.querySelector('.drawer-placement [data-drawer-model]');
 const busy=()=>model?.dataset.drawerTurning==='true';
 const blocked=index=>{
  feedback('stop');const stops=model.querySelectorAll(`[data-drawer-stop="${index}"][data-stop-clear="false"]`),front=model.querySelector(`[data-drawer-grip="${index}"]`);
  if(motionAllowed())for(const el of stops.length?stops:[front])if(el){const transform=getComputedStyle(el).transform;el.animate([{transform,translate:'0 0'},{transform,translate:'1px 0'},{transform,translate:'0 0'}],{duration:200,easing:ease});}
 };
 const toggle=index=>{if(solved||busy())return false;if(move({type:'drawer',index}))return true;blocked(index);return false;};
 root.addEventListener('click',e=>{
  if(Date.now()<Number(root.dataset.suppressUntil??0))return;
  const nav=e.target.closest('[data-drawer-view]');if(nav){changeView({drawerView:nav.dataset.drawerView,back:nav.dataset.drawerView==='back'});feedback('turn');return;}
  const grip=e.target.closest('button[data-drawer-grip]');if(!grip||!model?.contains(grip))return;
  e.preventDefault();e.stopPropagation();toggle(Number(grip.dataset.drawerGrip));
 },{signal});
 if(!model)return ()=>abort.abort();
 const back=model.dataset.drawerSide==='back';let preview=false,committing=false;
 const restore=()=>{
  if(!preview||!model.isConnected)return;const elements=[...model.querySelectorAll('[data-drawer-motion],button[data-drawer-grip]')],before=elements.map(e=>getComputedStyle(e).transform);paintDrawerPose(model,p.open);
  if(motionAllowed())elements.forEach((el,i)=>{const next=el.style.transform;if(before[i]!==getComputedStyle(el).transform)el.animate([{transform:before[i]},{transform:next}],{duration:180,easing:ease});});preview=false;
 };
 const stop=pointerSession(root,{
  pick(e){const source=e.target.closest('button[data-drawer-grip]');return !solved&&!busy()&&source&&model.contains(source)?{source,index:Number(source.dataset.drawerGrip)}:null;},
  start(g){settleAnimations(model);g.scale=model.getBoundingClientRect().width/512;preview=true;committing=false;},
  move(g,e){
   const delta=(back?e.clientX-g.x:e.clientY-g.y)/g.scale/(back?REAR_TRAVEL:DRAWER_TRAVEL),free=drawerEnabled(p.open,g.index);
   g.amount=Math.max(0,Math.min(1,p.open[g.index]+delta));const visible=free?g.amount:Math.max(0,Math.min(1,p.open[g.index]+Math.max(-.045,Math.min(.045,delta))));
   const open=[...p.open];open[g.index]=visible;paintDrawerPose(model,open);
  },
  end(g,e,cancelled){
   const b=model.closest('.drawer-viewport').getBoundingClientRect(),inside=e&&e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom;
   if(cancelled||!inside||g.amount===undefined||Math.abs(g.amount-p.open[g.index])<.5)return;
   committing=toggle(g.index);if(committing)preview=false;
  },
  clear(){if(!committing)restore();},
 });
 root.addEventListener('keydown',e=>{
  const grip=e.target.closest('button[data-drawer-grip]');if(!grip||!model.contains(grip)||e.altKey||e.ctrlKey||e.metaKey||busy()||solved)return;
  const index=Number(grip.dataset.drawerGrip),want=e.key==='Home'?0:e.key==='End'?1:back?e.key==='ArrowLeft'?0:e.key==='ArrowRight'?1:null:e.key==='ArrowUp'?0:e.key==='ArrowDown'?1:null;
  if(want===null)return;e.preventDefault();e.stopPropagation();if(p.open[index]!==want)toggle(index);
 },{signal});
 return ()=>{stop();restore();abort.abort();};
}
