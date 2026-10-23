import { pointerSession } from './pointer.js';
import { RULES } from '../../puzzles/index.js';

export function bindTracing(root,id,progress,move) {
  const config = {belt:{field:'.belt-diagram',selector:'.pulley-node button',key:'route',step:'node'},stitch:{field:'.stitch-workbench',selector:'.binding-hole button',key:'path',step:'hole'}}[id];
  if(!config)return ()=>{};
  const field=root.querySelector(config.field),buttons=[...root.querySelectorAll(config.selector)];
  let preview;
  const center = index => {const box=buttons[index].getBoundingClientRect(),outer=field.getBoundingClientRect();return [(box.left+box.width/2-outer.left)/outer.width*100,(box.top+box.height/2-outer.top)/outer.height*100];};
  function visit(gesture,index) {
    if(gesture.state[config.key].at(-1)===index)return;
    const next=RULES[id].move(gesture.state,{type:config.step,index});
    if(next!==gesture.state){gesture.nodes.push(index);gesture.state=next;}
  }
  return pointerSession(root,{
    pick(event){const source=event.target.closest(config.selector);return source?{source,index:buttons.indexOf(source),nodes:[],state:progress}:null;},
    start(gesture){
      visit(gesture,gesture.index);
      preview=document.createElementNS('http://www.w3.org/2000/svg','svg');preview.setAttribute('viewBox','0 0 100 100');preview.setAttribute('preserveAspectRatio','none');preview.classList.add('gesture-thread');preview.innerHTML='<polyline fill="none"/>';field.append(preview);
    },
    move(gesture,event){
      const nearby=buttons.map((button,i)=>{const b=button.getBoundingClientRect();return {i,inside:event.clientX>=b.left-4&&event.clientX<=b.right+4&&event.clientY>=b.top-4&&event.clientY<=b.bottom+4,distance:Math.hypot(event.clientX-b.x-b.width/2,event.clientY-b.y-b.height/2)};}).filter(p=>p.inside).sort((a,b)=>a.distance-b.distance);
      const index=nearby[0]?.i??-1;
      if(index>=0)visit(gesture,index);
      const box=field.getBoundingClientRect(),point=[(event.clientX-box.left)/box.width*100,(event.clientY-box.top)/box.height*100];
      preview.querySelector('polyline').setAttribute('points',[...gesture.state[config.key].map(center),point].map(p=>p.join(',')).join(' '));
      buttons.forEach((button,i)=>button.classList.toggle('trace-touched',gesture.state[config.key].includes(i)));
    },
    end(gesture,_,cancelled){if(!cancelled&&gesture.nodes.length)move({type:'trace',nodes:gesture.nodes});},
    clear(){preview?.remove();buttons.forEach(button=>button.classList.remove('trace-touched'));},
  });
}
