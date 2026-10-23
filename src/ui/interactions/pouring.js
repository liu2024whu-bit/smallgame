import { pointerSession } from './pointer.js';
import { pourAmount } from '../../puzzles/cocoa.js';

export function bindPouring(root,progress,move) {
  const vessels=[...root.querySelectorAll('[data-vessel]')];
  if(!vessels.length)return ()=>{};
  const status=root.querySelector('.pour-status');
  let selected=null;
  const choose=index=>{selected=index;vessels.forEach((v,i)=>v.classList.toggle('vessel-picked',i===index));status.textContent=index===null?'　':`${['大','中','小'][index]}壶 · ${progress.levels[index]}格`;};
  const pour=(from,to)=>{if(!pourAmount(progress.levels,from,to)){status.textContent=progress.levels[from]===0?'这只壶已经空啦。':'这只壶已经满啦。';return;}root.dataset.pourFrom=from;root.dataset.pourTo=to;move({type:'pour',from,to});};
  const controller=new AbortController();
  root.addEventListener('click',event=>{const button=event.target.closest('[data-vessel]');if(!button||Date.now()<Number(root.dataset.suppressUntil??0))return;const index=Number(button.dataset.vessel);if(selected===index)choose(null);else if(selected===null)choose(index);else pour(selected,index);},{signal:controller.signal});
  const stop=pointerSession(root,{
    pick(event){const source=event.target.closest('[data-vessel]');return source?{source,from:Number(source.dataset.vessel)}:null;},
    start(gesture){gesture.previous=selected;choose(gesture.from);},
    move(gesture,event){const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-vessel]');gesture.to=target?Number(target.dataset.vessel):null;vessels.forEach((v,i)=>v.classList.toggle('pour-destination',i===gesture.to&&!!pourAmount(progress.levels,gesture.from,i)));},
    end(gesture,_,cancelled){if(!cancelled&&gesture.to!==null&&gesture.to!==undefined&&gesture.to!==gesture.from)pour(gesture.from,gesture.to);else choose(gesture.previous);},
    clear(){vessels.forEach(v=>{if(v.isConnected)v.classList.remove('pour-destination');});},
  });
  return ()=>{stop();controller.abort();};
}
