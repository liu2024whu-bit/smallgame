import { ASSETS } from '../data/assets.js';
import { welcomeContent } from '../ui/welcome.js';
import { motionAllowed } from './motion.js';

export function createWelcome(host,{getState,onEnter,onReveal=()=>{}}) {
  let phase='title',signature='',busy=false,transition;
  host.innerHTML=`<img class="welcome-painting" src="${ASSETS.welcome}" alt="门半掩着，阳光照进书房。小猫睡在门边。" draggable="false"><div class="welcome-content"></div>`;
  const content=host.querySelector('.welcome-content');
  function render(state=getState()){
    if(host.hidden)return;
    const key=JSON.stringify([phase,state.begun,state.scene,state.solved.includes('stitch'),state.usedTools,state.ending]);
    if(signature===key)return;signature=key;
    const replacing=content.childElementCount>0;
    content.innerHTML=welcomeContent(state,phase);host.dataset.phase=phase;
    if(replacing){content.querySelector('h1')?.focus({preventScroll:true});if(motionAllowed())content.animate([{opacity:0,translate:'0 7px'},{opacity:1,translate:'0 0'}],{duration:320,easing:'cubic-bezier(.2,.7,.2,1)'});}
  }
  function show(next='title'){
    transition?.cancel();busy=false;phase=next;signature='';host.hidden=false;host.inert=false;host.style.opacity='';render();
  }
  async function enter(){
    if(busy||host.hidden)return;busy=true;host.inert=true;
    onReveal();
    if(motionAllowed()){
      transition=host.animate([{opacity:1},{opacity:0}],{duration:420,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
      try{await transition.finished;}catch{return;}
    }
    host.hidden=true;transition?.cancel();busy=false;onEnter();
  }
  render();
  return {render,show,enter,begin:()=>getState().begun?enter():show('intro'),get phase(){return phase;}};
}
