import { pointerSession } from './pointer.js';
import { announce } from '../dom.js';

export function bindRubbing(root,activity) {
  const desk=root.querySelector('[data-rubbing]'),field=desk?.querySelector('.rubbing-sheet');
  if(!field||desk.dataset.rubbing==='true')return ()=>{};
  const group=field.querySelector('[data-rubbing-strokes]'),key=root.querySelector('[data-rubbing-key]');
  const preventNative=event=>event.preventDefault();
  field.addEventListener('pointerdown',preventNative);
  field.addEventListener('dragstart',preventNative);
  let covered=new Set(),rows=0;
  function mark(gesture,x,y) {
    if(x<0||y<0||x>100||y>100)return;
    const old=gesture.last??[x,y],steps=Math.max(1,Math.ceil(Math.hypot(x-old[0],y-old[1])/3));
    for(let i=1;i<=steps;i++) {
      const px=old[0]+(x-old[0])*i/steps,py=old[1]+(y-old[1])*i/steps;
      gesture.covered.add(Math.min(7,Math.floor(py/12.5))*8+Math.min(7,Math.floor(px/12.5)));
    }
    gesture.last=[x,y];gesture.d+=`${gesture.d?'L':'M'}${x.toFixed(1)} ${(y*.6).toFixed(1)} `;
    gesture.path.setAttribute('d',gesture.d);
    gesture.tone.setAttribute('d',gesture.d);
  }
  function start() {
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');group.append(path);
    const tone=path.cloneNode();field.querySelector('[data-rubbing-tones]').append(tone);
    return {path,tone,d:'',covered:new Set(covered)};
  }
  function commit(gesture) {
    covered=gesture.covered;
    if(covered.size>=42){announce('拓好了。');activity('campus:desk');}
  }
  const stop=pointerSession(root,{
    pick(event){return event.target.closest('.rubbing-sheet')?{source:field}:null;},
    start(gesture){Object.assign(gesture,start());const b=field.getBoundingClientRect();mark(gesture,(gesture.x-b.x)/b.width*100,(gesture.y-b.y)/b.height*100);},
    move(gesture,event){const b=field.getBoundingClientRect();mark(gesture,(event.clientX-b.x)/b.width*100,(event.clientY-b.y)/b.height*100);},
    end(gesture,_,cancelled){if(cancelled){gesture.path.remove();gesture.tone.remove();}else commit(gesture);},
  });
  function keyboardRub(){
    const gesture=start(),y=6.25+(rows++%8)*12.5;
    mark(gesture,1,y);mark(gesture,99,y);commit(gesture);
  }
  key?.addEventListener('click',keyboardRub);
  return ()=>{stop();key?.removeEventListener('click',keyboardRub);field.removeEventListener('pointerdown',preventNative);field.removeEventListener('dragstart',preventNative);};
}
