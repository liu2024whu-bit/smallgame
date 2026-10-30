import {pointerSession,dragGhost} from './pointer.js';
import {CHOCOLATE_SPOTS,CHOCOLATE_DRAWER,CHOCOLATE_DRAWER_TRAVEL,chocolatePresentation} from '../../data/chocolate.js';
import {chocolateFits} from '../../puzzles/chocolate.js';
import {motionAllowed,ease} from '../../services/motion/shared.js';

export function bindChocolate(root,p,{move,changeView,view={},solved}){
 const world=root.querySelector('.choc-world'),model=world?.querySelector('[data-choc-model]');if(!model)return ()=>{};
 const slots=[...model.querySelectorAll('[data-choc-slot]')],abort=new AbortController(),{signal}=abort;
 const pose=chocolatePresentation(p,view,solved),busy=()=>!!model.dataset.chocBusy;
 let held=-1;
 const canPull=()=>!busy()&&!solved&&pose.opened;
 const canPlace=()=>canPull()&&view.chocolateView!=='paper';
 const clear=()=>{held=-1;slots.forEach(s=>{s.classList.remove('choc-picked','choc-drop-ready');s.removeAttribute('aria-pressed');});};
 const select=piece=>{clear();held=piece;const source=slots.find(s=>Number(s.dataset.chocPiece)===piece);source?.classList.add('choc-picked');source?.setAttribute('aria-pressed','true');};
 const focus=slot=>{for(const s of slots)s.tabIndex=Number(s.dataset.chocSlot)===slot?0:-1;slots[slot]?.focus({preventScroll:true});};
 const place=(piece,to)=>{clear();move({type:'place',piece,to});queueMicrotask(()=>{const field=root.querySelector('[data-choc-model]'),target=field?.querySelector(`[data-choc-slot="${to}"]`);if(!target)return;field.querySelectorAll('[data-choc-slot]').forEach(s=>s.tabIndex=s===target?0:-1);if(field.dataset.chocBusy)field.addEventListener('choc-settled',()=>target.isConnected&&target.focus({preventScroll:true}),{once:true});else target.focus({preventScroll:true});});};
 const activate=slot=>{if(!canPlace())return;const piece=p.places.indexOf(slot);if(piece===held)clear();else if(piece>=0)select(piece);else if(held>=0)place(held,slot);};
 const drawerBody=model.querySelector('.choc-drawer-body'),drawerGrip=model.querySelector('[data-choc-drawer]'),status=root.querySelector('.choc-quiet-status');
 const returnDrawer=()=>{
  const transform=getComputedStyle(drawerBody).transform,top=getComputedStyle(drawerGrip).top;
  drawerBody.style.transform=`translateY(${-CHOCOLATE_DRAWER_TRAVEL}px)`;
  drawerGrip.style.top=CHOCOLATE_DRAWER[1]+23+'px';
  if(motionAllowed()){
   drawerBody.animate([{transform},{transform:drawerBody.style.transform}],{duration:200,easing:ease});
   drawerGrip.animate([{top},{top:drawerGrip.style.top}],{duration:200,easing:ease});
  }
 };
 const pullDrawer=()=>{clear();if(!canPull())return false;if(!chocolateFits(p.places)){status.textContent='还扣着。';if(motionAllowed())drawerBody.animate([{transform:`translateY(${-CHOCOLATE_DRAWER_TRAVEL}px)`},{transform:`translateY(${-CHOCOLATE_DRAWER_TRAVEL+4}px)`},{transform:`translateY(${-CHOCOLATE_DRAWER_TRAVEL}px)`}],{duration:230,easing:ease});return false;}move({type:'drawer'});return true;};
 root.addEventListener('click',event=>{
  if(Date.now()<Number(root.dataset.suppressUntil??0))return;
  const control=event.target.closest('[data-choc-view],[data-choc-lid],[data-choc-drawer],[data-choc-slot]');if(!control||!root.contains(control)||busy())return;
  event.preventDefault();event.stopPropagation();
  if(control.hasAttribute('data-choc-view')){clear();changeView({chocolateView:control.dataset.chocView});}
  else if(control.hasAttribute('data-choc-lid')){clear();if(solved)changeView({chocolateClosed:pose.opened});else move({type:'lid'});}
  else if(control.hasAttribute('data-choc-drawer'))pullDrawer();
  else activate(Number(control.dataset.chocSlot));
 },{signal});
 root.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&held>=0){event.preventDefault();event.stopImmediatePropagation();clear();return;}
  const source=event.target.closest('[data-choc-slot]');if(!source||!canPlace()||event.ctrlKey||event.metaKey||event.altKey)return;
  const slot=Number(source.dataset.chocSlot),[x,y]=CHOCOLATE_SPOTS[slot],vector={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
  if(!vector)return;event.preventDefault();event.stopPropagation();
  const choices=CHOCOLATE_SPOTS.map(([px,py],i)=>({i,along:(px-x)*vector[0]+(py-y)*vector[1],across:Math.abs((px-x)*vector[1]-(py-y)*vector[0])})).filter(c=>c.along>5).toSorted((a,b)=>(a.along+a.across*5)-(b.along+b.across*5));
  if(choices.length)focus(choices[0].i);
 },{signal,capture:true});
 const local=(x,y)=>{const box=world.getBoundingClientRect(),scale=box.width/1536;return [(x-box.left)/scale,(y-box.top)/scale];};
 function target(point,piece){
  const distances=CHOCOLATE_SPOTS.map(([x,y],i)=>({i,d:Math.hypot(x-point[0],y-point[1])})).toSorted((a,b)=>a.d-b.d),closest=distances[0];
  if(closest.d<53&&closest.i<25)return p.places.includes(closest.i)?null:closest.i;
  if(Math.hypot(point[0]-400,point[1]-575)>275)return null;
  if(closest.i>=25&&closest.d<37&&p.places.includes(closest.i)&&p.places[piece]!==closest.i)return null;
  return distances.find(c=>c.i>=25&&!p.places.includes(c.i))?.i??null;
 }
 const stop=pointerSession(root,{
  pick(event){if(!canPull())return null;const grip=event.target.closest('[data-choc-drawer]');if(grip&&model.contains(grip))return {source:grip,drawer:true};if(!canPlace())return null;const source=event.target.closest('[data-choc-slot]');if(!source||!model.contains(source)||Number(source.dataset.chocPiece)<0)return null;return {source,piece:Number(source.dataset.chocPiece)};},
  start(g){clear();g.start=local(g.x,g.y);if(g.drawer){g.offset=0;return;}const box=g.source.getBoundingClientRect();g.grab=[g.x-box.left,g.y-box.top];g.origin=CHOCOLATE_SPOTS[Number(g.source.dataset.chocSlot)];g.ghost=dragGhost(g.source,'choc-drag-ghost '+(Number(g.source.dataset.chocSlot)>=25?'choc-from-plate':''));Object.assign(g.ghost.style,{width:box.width+'px',height:box.height+'px'});g.source.classList.add('choc-drag-source');},
  move(g,event){const point=local(event.clientX,event.clientY);if(g.drawer){g.offset=Math.max(0,Math.min(chocolateFits(p.places)?CHOCOLATE_DRAWER_TRAVEL:4,point[1]-g.start[1]));drawerBody.style.transform=`translateY(${-CHOCOLATE_DRAWER_TRAVEL+g.offset}px)`;drawerGrip.style.top=CHOCOLATE_DRAWER[1]+23+g.offset+'px';return;}Object.assign(g.ghost.style,{left:event.clientX-g.grab[0]+'px',top:event.clientY-g.grab[1]+'px'});g.to=target(point,g.piece);g.source.style.setProperty('--choc-drag-x',g.origin[0]+point[0]-g.start[0]);g.source.style.setProperty('--choc-drag-y',g.origin[1]+point[1]-g.start[1]);slots.forEach(s=>s.classList.toggle('choc-drop-ready',Number(s.dataset.chocSlot)===g.to));},
  end(g,event,cancelled){
   if(g.drawer){
    const box=world.parentElement.getBoundingClientRect(),inside=event?.clientX>=box.left&&event.clientX<=box.right&&event.clientY>=box.top&&event.clientY<=box.bottom;
    if(!cancelled&&inside&&g.offset>CHOCOLATE_DRAWER_TRAVEL/2&&pullDrawer())return;
    returnDrawer();if(!cancelled&&!chocolateFits(p.places))status.textContent='还扣着。';return;
   }
   if(!cancelled&&g.to!==null&&g.to!==undefined)place(g.piece,g.to);else g.returnToSource=true;
  },
  clear(){clear();slots.forEach(s=>{s.classList.remove('choc-drag-source');s.style.removeProperty('--choc-drag-x');s.style.removeProperty('--choc-drag-y');});},
 });
 const blur=()=>clear();window.addEventListener('blur',blur,{signal});window.addEventListener('resize',blur,{signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();},{signal});
 return ()=>{stop();clear();abort.abort();};
}
