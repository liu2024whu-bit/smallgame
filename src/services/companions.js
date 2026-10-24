import {greetCharacter} from './character-motion.js';
import { bindPetting } from '../ui/interactions/pets.js';
import { motionAllowed } from './motion.js';

// Touch reactions live in the current panel; only the first completed pet is collected.
export function createCompanions({panel,activity,audio,toast}){
  let lastSound=0;
  function touch(commit=true){
    const current=panel();if(current?.type!=='pet')return;
    current.view={...current.view,petAwake:true};
    const root=document.querySelector('[data-pet-corner]');
    root?.classList.add('is-awake');
    const note=root?.parentElement.querySelector('.pet-murmur');
    if(note)note.textContent=current.id==='cat'?'嗯——再伸个懒腰。':'尾巴已经替它答应了。';
    if(performance.now()-lastSound>1200){lastSound=performance.now();audio.material('pet');}
    if(commit)activity('pet:'+current.id);
  }
  function greet(button){
    const mark=button.querySelector('.companion-reply');
    mark?.getAnimations().forEach(animation=>animation.cancel());
    if(mark&&motionAllowed())mark.animate([{opacity:0,translate:'0 3px'},{opacity:1,translate:'0 -7px',offset:.4},{opacity:0,translate:'0 -18px'}],{duration:1500,easing:'ease-out'});
    audio.material('glass');toast('星星借你一会儿。');
  }
  return {bind:root=>bindPetting(root,{touch:()=>touch(false),complete:()=>touch()}),actions:{'hei-greet':button=>{greetCharacter(button);audio.material('pet');},'pet-touch':()=>touch(),'prince-greet':greet}};
}
