import { pointerSession } from './pointer.js';
import { shadowWindows } from '../puzzles/negative.js';

export function bindShadows(root,progress,move) {
  const windows=root.querySelector('[data-shadow-windows]');
  if(!windows)return ()=>{};
  const original=windows.innerHTML;
  let handle;
  return pointerSession(root,{
    pick(event){const source=event.target.closest('[data-shadow]');return source?{source,index:Number(source.dataset.shadow),track:source.closest('[data-shadow-track]')}:null;},
    move(gesture,event){
      handle=gesture.source;
      const box=gesture.track.getBoundingClientRect();
      gesture.value=Math.max(0,Math.min(3,Math.round((event.clientX-box.left-18)/(box.width-36)*3)));
      handle.style.setProperty('--slide',gesture.value);
      const values=[...progress.values];values[gesture.index]=gesture.value;windows.innerHTML=shadowWindows(values);
    },
    end(gesture,_,cancelled){if(!cancelled&&gesture.value!==undefined)move({type:'set-turn',index:gesture.index,value:gesture.value});},
    clear(){if(windows.isConnected)windows.innerHTML=original;if(handle?.isConnected)handle.style.setProperty('--slide',progress.values[Number(handle.dataset.shadow)]);},
  });
}
