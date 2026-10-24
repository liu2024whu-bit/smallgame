import {pointerSession} from './pointer.js';
import {motionAllowed} from '../../services/motion.js';
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
 let angle=0;
 const dispose=pointerSession(root,{
  pick(event){const handle=event.target.closest('[data-press-handle]');return handle&&!handle.disabled?{source:handle}:null;},
  start(g){g.distance=Math.max(40,field.getBoundingClientRect().height*.18);},
  move(g,event){g.stroke=Math.max(0,Math.min(1,(event.clientY-g.y)/g.distance));angle=g.stroke*28;g.source.querySelector('.press-arm').style.rotate=angle+'deg';},
  end(g,_,cancelled){
   if(!cancelled&&g.stroke>=.55){g.source.dataset.pressRelease=angle;move({type:'print'});}
  },
  clear(){
   const handle=root.querySelector('.press-arm');
   if(handle?.isConnected&&handle.style.rotate){
    handle.style.removeProperty('rotate');
    if(motionAllowed()&&angle)handle.animate([{rotate:angle+'deg'},{rotate:'0deg'}],{duration:210,easing:'ease-out'});
   }angle=0;
  }
 });
 return ()=>{dispose();controller.abort();};
}
const PRESS_POSITION=to=>'版片移到了第'+(to+1)+'格。';
