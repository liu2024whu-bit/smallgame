import { pointerSession } from './pointer.js';

export function bindSweets(root,progress,move) {
  const grid=root.querySelector('[data-sugar-grid]');if(!grid)return ()=>{};
  const grips=[...root.querySelectorAll('[data-sugar-cut]')],lines=[...root.querySelectorAll('[data-sugar-line]')];
  const paint=(index,value)=>{
    const grip=grips[index],line=lines[index];
    grip.style[index?'left':'top']=`${value/8*100}%`;
    line.setAttribute('d',index?`M${value/8*100} -5V105`:`M-5 ${value/8*100}H105`);
  };
  const abort=new AbortController();
  root.addEventListener('keydown',event=>{
    const grip=event.target.closest('[data-sugar-cut]');if(!grip)return;
    const index=Number(grip.dataset.sugarCut),value=progress.cuts[index];
    const next={ArrowLeft:value-1,ArrowUp:value-1,ArrowRight:value+1,ArrowDown:value+1,Home:1,End:7}[event.key];
    if(next===undefined)return;event.preventDefault();event.stopPropagation();
    move({type:'cut',index,value:Math.max(1,Math.min(7,next))});
  },{signal:abort.signal});
  const stop=pointerSession(root,{
    pick(event){const source=event.target.closest('[data-sugar-cut]');return source?{source,index:Number(source.dataset.sugarCut),bounds:grid.getBoundingClientRect()}:null;},
    move(gesture,event){const {bounds,index}=gesture;gesture.value=Math.max(1,Math.min(7,Math.round((index?(event.clientX-bounds.left)/bounds.width:(event.clientY-bounds.top)/bounds.height)*8)));paint(index,gesture.value);},
    end(gesture,_,cancelled){if(!cancelled&&gesture.value!==undefined)move({type:'cut',index:gesture.index,value:gesture.value});},
    clear(){progress.cuts.forEach((value,index)=>paint(index,value));},
  });
  return ()=>{stop();abort.abort();};
}
