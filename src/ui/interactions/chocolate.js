import { pointerSession } from './pointer.js';

export function bindChocolate(root,progress,move) {
  const cells=[...root.querySelectorAll('[data-chocolate-cell]')];
  if(!cells.length||progress.covered)return ()=>{};
  const paint=(element,value)=>{element.classList.toggle('has-chocolate',!!value);element.classList.toggle('cup-empty',!value);};
  return pointerSession(root,{
    pick(event){const source=event.target.closest('[data-chocolate-cell]');return source?{source,indexes:new Set([Number(source.dataset.chocolateCell)]),value:progress.tool}:null;},
    move(gesture,event){const cell=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-chocolate-cell]');if(cell){gesture.indexes.add(Number(cell.dataset.chocolateCell));paint(cell,gesture.value);}},
    start(gesture){paint(gesture.source,gesture.value);},
    end(gesture,_,cancelled){if(!cancelled)move({type:'paint',indexes:[...gesture.indexes],value:gesture.value});},
    clear(){cells.forEach((cell,i)=>{if(cell.isConnected)paint(cell,progress.cells[i]);});},
  });
}
