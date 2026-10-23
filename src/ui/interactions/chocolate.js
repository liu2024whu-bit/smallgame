import { pointerSession } from './pointer.js';
import { sweptTargets } from './sweep.js';

export function bindChocolate(root,progress,move) {
  const cells=[...root.querySelectorAll('[data-chocolate-cell]')];
  if(!cells.length||progress.covered)return ()=>{};
  const paint=(element,value)=>{element.classList.toggle('has-chocolate',!!value);element.classList.toggle('cup-empty',!value);};
  return pointerSession(root,{
    pick(event){const source=event.target.closest('[data-chocolate-cell]');return source?{source,indexes:new Set([Number(source.dataset.chocolateCell)]),value:progress.tool}:null;},
    move(gesture,event){
      const point={x:event.clientX,y:event.clientY};
      for(const index of sweptTargets(gesture.last,point,cells.map(cell=>cell.getBoundingClientRect()))){gesture.indexes.add(index);paint(cells[index],gesture.value);}
      gesture.last=point;
    },
    start(gesture){gesture.last={x:gesture.x,y:gesture.y};paint(gesture.source,gesture.value);},
    end(gesture,_,cancelled){if(!cancelled)move({type:'paint',indexes:[...gesture.indexes],value:gesture.value});},
    clear(){cells.forEach((cell,i)=>{if(cell.isConnected)paint(cell,progress.cells[i]);});},
  });
}
