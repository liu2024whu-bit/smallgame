import {pointerSession} from './pointer.js';
import {animatePressHandle,readPressStroke,setPressStroke} from '../../services/press-handle.js';
import {announce} from '../dom.js';

export function bindPress(root,progress,move){
 const field=root.querySelector('.press-case');if(!field||!progress.opened)return ()=>{};
 const controller=new AbortController();
 const keyboard=event=>{
  const plate=event.target.closest('[data-plate]');if(!plate||plate.getAttribute('aria-disabled')==='true')return;
  const from=progress.order.indexOf(Number(plate.dataset.plate));
  const change={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[event.key];
  const to=event.key==='Home'?0:event.key==='End'?2:change===undefined?null:Math.max(0,Math.min(2,from+change));
  if(to===null)return;event.preventDefault();
  if(move({type:'reorder',from,to}))announce(PRESS_POSITION(to));
 };
 root.addEventListener('keydown',keyboard,{signal:controller.signal});
 const arm=field.querySelector('.press-arm');
 const dispose=pointerSession(root,{
  pick(event){const handle=event.target.closest('[data-press-handle]');return handle&&!handle.disabled?{source:handle}:null;},
  start(g){g.distance=Math.max(40,field.getBoundingClientRect().height*.18);setPressStroke(arm,readPressStroke(arm));},
  move(g,event){g.stroke=Math.max(0,Math.min(1,(event.clientY-g.y)/g.distance));setPressStroke(arm,g.stroke);},
  end(g,_,cancelled){
   if(!cancelled&&g.stroke>=.55)move({type:'print'});
  },
  clear(){
   if(arm?.isConnected){const stroke=readPressStroke(arm);if(stroke)animatePressHandle(arm,[[0,stroke],[1,0]],210);}
  }
 });
 return ()=>{dispose();controller.abort();};
}
const PRESS_POSITION=to=>'版片移到了第'+(to+1)+'格。';
