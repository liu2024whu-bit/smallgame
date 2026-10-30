import {pointerSession} from './pointer.js';
import {pourAmount} from '../../puzzles/cocoa.js';
import {COCOA_VESSELS} from '../../data/cocoa.js';
import {paintCocoaVessel} from '../cocoa-props.js';
import {motionAllowed,ease} from '../../services/motion/shared.js';

export function bindPouring(root,p,move){
 const model=root.querySelector('[data-cocoa-model]'),world=model?.closest('.cocoa-world');if(!world)return ()=>{};
 const vessels=[...model.querySelectorAll('[data-cocoa-vessel]')],status=root.querySelector('.cocoa-status'),abort=new AbortController(),{signal}=abort;
 let selected=null,activeDrag=false;
 const busy=()=>!!model.dataset.cocoaBusy;
 const home=i=>{const {x,y}=COCOA_VESSELS[i];return {x,y,angle:0};};
 const pose=(i,position)=>paintCocoaVessel(vessels[i],i,p.levels[i],position);
 function clear(){selected=null;const repaint=!busy();vessels.forEach((el,i)=>{el.classList.remove('cocoa-picked','cocoa-drop-ready');el.setAttribute('aria-pressed','false');if(repaint&&!el.classList.contains('cocoa-dragging'))pose(i,home(i));});}
 function choose(i){clear();if(i===null)return;if(!p.levels[i]){status.textContent='这一只还是空的。';return;}selected=i;vessels[i].classList.add('cocoa-picked');vessels[i].setAttribute('aria-pressed','true');pose(i,{...home(i),y:home(i).y-12});status.textContent='';}
 function pour(from,to){
  if(!pourAmount(p.levels,from,to)){status.textContent=p.levels[from]?'这一只已经满了。':'这一只还是空的。';return false;}
  model.dataset.cocoaPour=from+','+to;
  move({type:'pour',from,to});
  queueMicrotask(()=>{const field=root.querySelector('[data-cocoa-model]'),el=field?.querySelector(`[data-cocoa-vessel="${to}"]`);if(!el)return;const focus=()=>el.isConnected&&!el.disabled&&el.focus({preventScroll:true});if(field.dataset.cocoaBusy)field.addEventListener('cocoa-settled',focus,{once:true});else focus();});
  return true;
 }
 const activate=i=>{if(busy())return;if(selected===i)choose(null);else if(selected===null)choose(i);else if(!pour(selected,i)){const message=status.textContent;choose(selected);status.textContent=message;}};
 root.addEventListener('click',event=>{const el=event.target.closest('[data-cocoa-vessel]');if(!el||!model.contains(el)||Date.now()<Number(root.dataset.suppressUntil??0))return;event.preventDefault();event.stopPropagation();activate(Number(el.dataset.cocoaVessel));},{signal});
 root.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&selected!==null){event.preventDefault();event.stopImmediatePropagation();clear();return;}
  const el=event.target.closest('[data-cocoa-vessel]'),vector={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!el||!vector||busy())return;
  event.preventDefault();event.stopPropagation();const current=COCOA_VESSELS[Number(el.dataset.cocoaVessel)],x=current.x+current.mouth[0]*current.scale,y=current.y+current.mouth[1]*current.scale;
  const choices=COCOA_VESSELS.map((v,i)=>({i,along:(v.x+v.mouth[0]*v.scale-x)*vector[0]+(v.y+v.mouth[1]*v.scale-y)*vector[1],across:Math.abs((v.x+v.mouth[0]*v.scale-x)*vector[1]-(v.y+v.mouth[1]*v.scale-y)*vector[0])})).filter(c=>c.along>5).toSorted((a,b)=>a.along+a.across*3-b.along-b.across*3);
  if(choices.length)vessels[choices[0].i].focus({preventScroll:true});
 },{signal,capture:true});
 const local=(x,y)=>{const box=world.getBoundingClientRect(),s=box.width/1536;return [(x-box.left)/s,(y-box.top)/s];};
 const target=event=>{const el=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-cocoa-vessel]');return el&&model.contains(el)?Number(el.dataset.cocoaVessel):null;};
 function returnHome(g){
  const old=g.source.style.transform;g.source.classList.remove('cocoa-dragging');pose(g.from,home(g.from));
  if(!motionAllowed()||!g.source.isConnected)return;
  model.dataset.cocoaBusy='true';const a=g.source.animate([{transform:old},{transform:g.source.style.transform}],{duration:220,easing:ease});
  a.finished.catch(()=>{}).finally(()=>{delete model.dataset.cocoaBusy;});
 }
 const stop=pointerSession(root,{
  pick(event){const el=event.target.closest('[data-cocoa-vessel]');if(!el||!model.contains(el)||busy())return null;const from=Number(el.dataset.cocoaVessel);return p.levels[from]?{source:el,from}:null;},
  start(g){activeDrag=true;clear();g.origin=home(g.from);g.start=local(g.x,g.y);g.source.classList.add('cocoa-dragging');},
  move(g,event){const point=local(event.clientX,event.clientY);pose(g.from,{...g.origin,x:g.origin.x+point[0]-g.start[0],y:g.origin.y+point[1]-g.start[1]});g.to=target(event);vessels.forEach((el,i)=>el.classList.toggle('cocoa-drop-ready',i===g.to&&!!pourAmount(p.levels,g.from,i)));},
  end(g,event,cancelled){g.to=event?.clientX!==undefined?target(event):null;if(cancelled||g.to===null||!pour(g.from,g.to))returnHome(g);},
  clear(){if(!activeDrag)return;activeDrag=false;selected=null;vessels.forEach(el=>{el.classList.remove('cocoa-dragging','cocoa-drop-ready','cocoa-picked');el.setAttribute('aria-pressed','false');});},
 });
 window.addEventListener('blur',clear,{signal});window.addEventListener('resize',clear,{signal});document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();},{signal});
 return ()=>{stop();abort.abort();};
}
