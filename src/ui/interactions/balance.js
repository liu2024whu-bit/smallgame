import {balanceMaterial} from '../../services/balance-material.js';
import {weightRect,BALANCE_CROWDED} from '../../data/balance-apparatus.js';
import {balanceWeight} from '../balance-props.js';
import {pointerSession,dragGhost} from './pointer.js';

export function bindBalance(root,p,{move,view={},changeView,feedback=()=>{}}){
 const model=root.querySelector('[data-balance-model]'),world=model?.closest('.balance-world');if(!world)return ()=>{};
 const controller=new AbortController(),{signal}=controller;let hand=null,committing=false;
 const material=()=>balanceMaterial(model),busy=()=>model.dataset.balanceBusy==='true';
 const point=e=>{const b=world.getBoundingClientRect(),s=b.width/1536;return [(e.clientX-b.left)/s,(e.clientY-b.top)/s];};
 const inside=e=>{const b=world.parentElement.getBoundingClientRect();return e&&e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom;};
 const message=text=>{const el=root.querySelector('.balance-status');if(el)el.textContent=text;};
 function drawGhost(foot){
  if(!hand)return;hand.foot=foot;const b=world.getBoundingClientRect(),s=b.width/1536,r=weightRect(hand.index,foot);
  Object.assign(hand.ghost.style,{left:b.left+r[0]*s+'px',top:b.top+r[1]*s+'px',width:r[2]*s+'px',height:r[3]*s+'px'});
 }
 function begin(index,e){
  if(hand||busy())return false;const pose=material()?.snapshot();if(!pose)return false;
  const foot=pose.points[index],at=e?point(e):foot,ghost=dragGhost(balanceWeight(index),'balance-drag-ghost');
  hand={index,foot,grab:at.map((v,i)=>v-foot[i]),ghost,source:model.querySelector(`[data-balance-weight="${index}"]`)};
  view.balanceCrowded=false;material().hold(index);drawGhost(foot);message('');feedback('wedge-out');return true;
 }
 function clearHand({returning=true,blocking=true}={}){
  if(!hand)return;const old=hand;hand=null;
  old.ghost.remove();model.querySelectorAll('.balance-drop-ready').forEach(el=>el.classList.remove('balance-drop-ready'));
  const c=material();if(!c)return;
  if(returning)c.arrival(old.index,old.foot);
  c.animate(c.snapshot(),p,{held:-1,duration:260,blocking,focus:'balance-weight-'+old.index});
 }
 function target(foot){
  const points=material()?.slots();if(!points)return -1;
  const candidates=points.map((pt,slot)=>({slot,dx:Math.abs(pt[0]-foot[0]),dy:Math.abs(pt[1]-foot[1])})).filter(v=>v.dx<105&&v.dy<62).sort((a,b)=>Math.hypot(a.dx,a.dy)-Math.hypot(b.dx,b.dy));
  return candidates[0]?.slot??-1;
 }
 function place(slot){
  if(!hand)return;const occupied=p.places.indexOf(slot);
  if(slot<0||occupied>=0&&occupied!==hand.index){message(slot<0?'':BALANCE_CROWDED);feedback('stop');return false;}
  const index=hand.index;if(slot===p.places[index]){clearHand();return true;}
  material()?.arrival(index,hand.foot);hand.source.classList.remove('balance-held');hand.source.focus({preventScroll:true});committing=true;
  const changed=move({type:'place',index,slot});
  if(!changed){committing=false;clearHand();}return changed;
 }
 const stop=pointerSession(root,{
  pick(e){const source=e.target.closest('button[data-balance-weight]');return !hand&&!busy()&&source?{source,index:Number(source.dataset.balanceWeight)}:null;},
  start(g){begin(g.index,{clientX:g.x,clientY:g.y});},
  move(g,e){if(!hand)return;const at=point(e),foot=at.map((v,i)=>v-hand.grab[i]);drawGhost(foot);const slot=target(foot),occupied=p.places.indexOf(slot);
   model.querySelectorAll('[data-balance-slot]').forEach(el=>el.classList.toggle('balance-drop-ready',Number(el.dataset.balanceSlot)===slot&&(occupied<0||occupied===hand.index)));
  },
  end(g,e,cancelled){if(cancelled||!inside(e))return;place(target(hand?.foot??point(e)));},
  clear(){if(!committing)clearHand();},
 });
 root.addEventListener('click',e=>{
  if(busy()||Date.now()<Number(root.dataset.suppressUntil??0))return;
  if(e.target.closest('[data-action]')){clearHand({blocking:false});return;}
  const nav=e.target.closest('[data-balance-view]');if(nav){e.preventDefault();e.stopPropagation();clearHand();changeView({balanceView:nav.dataset.balanceView,balanceCrowded:false});return;}
  const token=e.target.closest('button[data-balance-weight]'),slot=e.target.closest('[data-balance-slot]');
  if(!hand&&token){e.preventDefault();e.stopPropagation();const i=Number(token.dataset.balanceWeight);if(begin(i,e.detail?e:null)&&!e.detail)model.querySelector(`[data-balance-slot="${p.places[i]}"]`)?.focus();return;}
  if(hand){e.preventDefault();e.stopPropagation();place(!e.detail&&slot?Number(slot.dataset.balanceSlot):target(hand.foot));}
 },{signal});
 root.addEventListener('focusin',e=>{const slot=e.target.closest('[data-balance-slot]');if(hand&&slot)drawGhost(material().slots()[Number(slot.dataset.balanceSlot)]);},{signal});
 window.addEventListener('pointermove',e=>{if(hand&&!root.classList.contains('is-dragging')){const at=point(e);drawGhost(at.map((v,i)=>v-hand.grab[i]));}},{signal});
 root.addEventListener('keydown',e=>{
  if(!hand||busy())return;
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();clearHand();return;}
  const slot=e.target.closest('[data-balance-slot]');if(!slot||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();e.stopPropagation();const value=Number(slot.dataset.balanceSlot),points=material().slots(),origin=points[value],axis=['ArrowLeft','ArrowRight'].includes(e.key)?0:1,sign=['ArrowLeft','ArrowUp'].includes(e.key)?-1:1;
  const candidates=points.map((pt,n)=>({n,along:(pt[axis]-origin[axis])*sign,across:Math.abs(pt[1-axis]-origin[1-axis]),el:model.querySelector(`[data-balance-slot="${n}"]`)})).filter(v=>v.along>5&&v.el&&!v.el.disabled).sort((a,b)=>a.along+a.across*2-b.along-b.across*2);
  const next=candidates[0];if(next){next.el.focus();drawGhost(points[next.n]);}
 },{signal});
 window.addEventListener('blur',()=>clearHand(),{signal});window.addEventListener('resize',()=>clearHand(),{signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearHand();},{signal});
 return ()=>{stop();if(!committing)clearHand();else{hand?.ghost.remove();hand=null;}controller.abort();};
}
