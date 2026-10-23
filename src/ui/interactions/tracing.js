import { pointerSession } from './pointer.js';
import { RULES } from '../../puzzles/index.js';
import { sweptTargets } from './sweep.js';

export function bindTracing(root,id,progress,move) {
  const config = {belt:{field:'.belt-diagram',selector:'.pulley-node button',key:'route',step:'node'},stitch:{field:'.stitch-workbench',selector:'.binding-hole button',key:'path',step:'hole'}}[id];
  if(!config)return ()=>{};
  const field=root.querySelector(config.field),buttons=[...root.querySelectorAll(config.selector)];
  let preview;
  const center = index => {const box=buttons[index].getBoundingClientRect(),outer=field.getBoundingClientRect();return [(box.left+box.width/2-outer.left)/outer.width*100,(box.top+box.height/2-outer.top)/outer.height*100];};
  function visit(gesture,index) {
    if(gesture.state[config.key].at(-1)===index)return;
    if(gesture.nodes.length && gesture.state[config.key].at(-2)===index){
      gesture.nodes.pop();
      gesture.state=gesture.nodes.reduce((state,node)=>RULES[id].move(state,{type:config.step,index:node}),progress);
      return;
    }
    const next=RULES[id].move(gesture.state,{type:config.step,index});
    if(next!==gesture.state){gesture.nodes.push(index);gesture.state=next;}
  }
  return pointerSession(root,{
    pick(event){const source=event.target.closest(config.selector);return source?{source,index:buttons.indexOf(source),nodes:[],state:progress}:null;},
    start(gesture){
      gesture.last={x:gesture.x,y:gesture.y};
      visit(gesture,gesture.index);
      preview=document.createElementNS('http://www.w3.org/2000/svg','svg');preview.setAttribute('viewBox','0 0 100 100');preview.setAttribute('preserveAspectRatio','none');preview.classList.add('gesture-thread');preview.innerHTML='<polyline fill="none"/>';field.append(preview);
    },
    move(gesture,event){
      const pointer={x:event.clientX,y:event.clientY};
      for(const index of sweptTargets(gesture.last,pointer,buttons.map(button=>button.getBoundingClientRect()),2))visit(gesture,index);
      gesture.last=pointer;
      const box=field.getBoundingClientRect(),point=[(event.clientX-box.left)/box.width*100,(event.clientY-box.top)/box.height*100];
      preview.querySelector('polyline').setAttribute('points',[...gesture.state[config.key].map(center),point].map(p=>p.join(',')).join(' '));
      buttons.forEach((button,i)=>button.classList.toggle('trace-touched',gesture.state[config.key].includes(i)));
    },
    end(gesture,_,cancelled){if(!cancelled&&gesture.nodes.length)move({type:'trace',nodes:gesture.nodes});},
    clear(){preview?.remove();buttons.forEach(button=>button.classList.remove('trace-touched'));},
  });
}
