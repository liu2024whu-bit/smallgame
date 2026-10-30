import {pointerSession} from './pointer.js';
import {CALENDAR_WORLD} from '../../data/calendar-apparatus.js';
import {mod} from '../../puzzles/common.js';
import {motionAllowed} from '../../services/motion.js';
import {bindTouchEntry} from './touch-entry.js';

export function bindCalendar(root,p,{move,changeView,feedback=()=>{}}){
 const model=root.querySelector('[data-calendar-model]'),world=model?.closest('.calendar-world');if(!world)return ()=>{};
 const controller=new AbortController(),{signal}=controller;
 const stopEntry=p.opened?()=>{}:bindTouchEntry(root,{kind:'number',length:6,submit:values=>{values.forEach((value,index)=>move({type:'set',index,value:Number(value)}));move({type:'submit'});}});
 const busy=()=>model.dataset.calendarBusy==='true';
 const held=model.dataset.calendarHeld==='true';
 const paint=(i,n)=>model.querySelector(`[data-calendar-wheel="${i}"] [data-calendar-number]`)?.style.setProperty('--digit',mod(n,10));
 const restore=()=>{p.values.forEach((n,i)=>paint(i,n));model.querySelector('.calendar-pull')?.style.removeProperty('translate');};
 const inside=e=>{const r=world.parentElement.getBoundingClientRect();return e&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;};
 const pull=()=>{move({type:p.opened?'drawer':'submit'});feedback('press');};
 const stop=pointerSession(root,{
  pick(e){if(busy()||held)return null;const source=e.target.closest('button[data-calendar-wheel],[data-calendar-pull]');return source&&!source.disabled?{source,kind:source.hasAttribute('data-calendar-pull')?'pull':'wheel',index:Number(source.dataset.calendarWheel)}:null;},
  start(g){g.scale=world.getBoundingClientRect().width/CALENDAR_WORLD[0];g.step=Math.max(16,g.source.getBoundingClientRect().height/3);g.last=p.values[g.index];},
  move(g,e){
   if(g.kind==='wheel'){const value=p.values[g.index]+(g.y-e.clientY)/g.step;g.value=mod(Math.round(value),10);paint(g.index,value);if(g.last!==g.value){g.last=g.value;feedback('detent');}}
   else{const direction=p.opened&&!p.shut?-1:1;g.amount=Math.max(0,Math.min(1,direction*(e.clientY-g.y)/(45*g.scale)));g.source.style.translate=`0 ${direction*g.amount*5}px`;}
  },
  end(g,e,cancelled){if(cancelled||!inside(e))return;if(g.kind==='wheel'&&g.value!==undefined)move({type:'set',index:g.index,value:g.value});if(g.kind==='pull'&&g.amount>=.6)pull();},
  clear:restore,
 });
 root.addEventListener('click',e=>{
  if(busy()||Date.now()<Number(root.dataset.suppressUntil??0))return;
  const el=e.target.closest('[data-calendar-view],[data-calendar-note],[data-calendar-pull],[data-calendar-pick],[data-calendar-return],[data-calendar-stamp],button[data-calendar-wheel]');if(!el||!root.contains(el))return;
  e.preventDefault();e.stopPropagation();
  if(el.hasAttribute('data-calendar-stamp')){move({type:'stamp'});feedback('stamp',motionAllowed()?.28:0);return;}
  if(el.hasAttribute('data-calendar-pick')){changeView({calendarStamp:true,calendarView:model.dataset.calendarMode==='whole'?'whole':'paper',dateNote:-1});root.querySelector('[data-calendar-stamp]')?.focus({preventScroll:true});feedback('return');return;}
  if(el.hasAttribute('data-calendar-return')){changeView({calendarStamp:false});feedback('return');return;}
  if(el.dataset.calendarView){changeView({calendarView:el.dataset.calendarView,calendarStamp:false});feedback('turn');return;}
  if(el.hasAttribute('data-calendar-note')){changeView({dateNote:Number(el.dataset.calendarNote),calendarStamp:false});feedback('turn');return;}
  if(el.hasAttribute('data-calendar-pull')){pull();return;}
  move({type:'turn',index:Number(el.dataset.calendarWheel),direction:1});
 },{signal});
 root.ownerDocument.defaultView.addEventListener('blur',()=>{if(held&&model.isConnected)changeView({calendarStamp:false});},{signal});
 root.addEventListener('pointermove',e=>{
  if(!held||busy())return;const r=world.getBoundingClientRect(),scale=r.width/CALENDAR_WORLD[0],stamp=model.querySelector('[data-calendar-held-stamp]');
  if(stamp){stamp.style.left=(e.clientX-r.left)/scale-24+'px';stamp.style.top=(e.clientY-r.top)/scale-92+'px';}
 },{signal});
 root.addEventListener('keydown',e=>{
  if(held&&e.key==='Escape'){e.preventDefault();e.stopPropagation();changeView({calendarStamp:false});return;}
  if(busy()||e.altKey||e.ctrlKey||e.metaKey)return;
  const wheel=e.target.closest('button[data-calendar-wheel]');if(!wheel)return;
  const index=Number(wheel.dataset.calendarWheel);let a;
  if(/^\d$/.test(e.key))a={type:'set',index,value:Number(e.key)};
  if(['ArrowUp','ArrowDown'].includes(e.key))a={type:'turn',index,direction:e.key==='ArrowUp'?1:-1};
  if(['Home','End'].includes(e.key))a={type:'set',index,value:e.key==='Home'?0:9};
  if(e.key==='Enter')a={type:'submit'};
  if(a||['ArrowLeft','ArrowRight'].includes(e.key)){
   e.preventDefault();e.stopPropagation();if(a)move(a);
   const next=a?.type==='set'?Math.min(5,index+1):Math.max(0,Math.min(5,index+(e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0)));
   root.querySelector(`[data-focus="calendar-number-${next}"]`)?.focus({preventScroll:true});
  }
 },{signal});
 return ()=>{stopEntry();stop();controller.abort();};
}
