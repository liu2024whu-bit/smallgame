import {greetCharacter,greetPrince} from './character-motion.js';
import { bindPetting } from '../ui/interactions/pets.js';
import {wakePet} from './motion/pets.js';

// Touch reactions live in the current panel; only the first completed pet is collected.
export function createCompanions({panel,activity,audio,toast}){
  let lastSound=0;
  function touch(commit=true){
    const current=panel();if(current?.type!=='pet')return;
    current.view={...current.view,petAwake:true};
    const root=document.querySelector('[data-pet-corner]');
    wakePet(root);
    const note=root?.parentElement.querySelector('.pet-murmur');
    if(note)note.textContent=current.id==='cat'?'嗯——再伸个懒腰。':'尾巴摇起来了。';
    if(performance.now()-lastSound>1200){lastSound=performance.now();audio.material('pet');}
    if(commit)activity('pet:'+current.id);
  }
  function greet(button){
    greetPrince(button);audio.material('glass');toast('这点星光，借你一会儿。');
  }
  return {bind:root=>bindPetting(root,{touch:()=>touch(false),complete:()=>touch()}),actions:{'hei-greet':button=>{greetCharacter(button);audio.material('pet');},'pet-touch':()=>touch(),'prince-greet':greet}};
}
