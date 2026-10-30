import {pointerSession,dragGhost} from './pointer.js';
import {motionAllowed} from '../../services/motion.js';
import {bindPianoSong} from '../../services/piano-playback.js';
import {PIANO_KEY_CODES} from '../../data/piano.js';

export function bindPiano(root,{move,solved,play=()=>{},feedback=()=>{},activity,changeView,view={}}){
 const model=root.querySelector('[data-piano-model]');if(!model)return ()=>{};
 const abort=new AbortController(),options={signal:abort.signal};
 const illuminate=note=>{const key=root.querySelector(`[data-piano-note="${note}"] .piano-key-paint`);if(key&&motionAllowed())key.animate([{transform:'scaleY(.98)',filter:'brightness(.9)'},{transform:'scaleY(1)',filter:'none'}],{duration:190,easing:'ease-out'});};
 const sound=note=>{if(solved)play(note);else move({type:'play',note});illuminate(note);};
 const song=bindPianoSong(root,play,illuminate);
 const stop=pointerSession(root,{
  pick(e){const source=e.target.closest('[data-piano-fragment]');return source&&!source.disabled?{source,from:Number(source.dataset.pianoSlot)}:null;},
  start(g){const b=g.source.getBoundingClientRect();g.scale=b.width/164;g.ghost=dragGhost(g.source,'piano-leaf-ghost');g.source.classList.add('piano-leaf-held');},
  move(g,e){Object.assign(g.ghost.style,{left:e.clientX+'px',top:e.clientY+'px',transform:`translate(-50%,-50%) scale(${g.scale})`});},
  end(g,e,cancelled){if(cancelled||!e)return;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-piano-fragment]');if(target)move({type:'reorder',from:g.from,to:Number(target.dataset.pianoSlot)});else g.returnToSource=true;},
  clear(){root.querySelectorAll('.piano-leaf-held').forEach(el=>el.classList.remove('piano-leaf-held'));},
 });
 root.addEventListener('pointerdown',e=>{const key=e.target.closest('[data-piano-note]');if(!key||e.button!==0||!e.isPrimary)return;e.preventDefault();key.focus({preventScroll:true});sound(Number(key.dataset.pianoNote));},options);
 root.addEventListener('click',e=>{
  if(Date.now()<Number(root.dataset.suppressUntil||0))return;
  const camera=e.target.closest('[data-piano-camera]');if(camera){changeView({pianoCamera:camera.dataset.pianoCamera});return;}
  const fragment=e.target.closest('[data-piano-fragment]');if(fragment&&!fragment.disabled){move({type:'flip',index:Number(fragment.dataset.pianoFragment)});return;}
  if(e.target.closest('[data-piano-pedal]'))move({type:'submit'});
  if(e.target.closest('[data-piano-clear]'))move({type:'clear'});
  const key=e.target.closest('[data-piano-note]');if(key&&e.detail===0)sound(Number(key.dataset.pianoNote));
  if(e.target.closest('[data-piano-letter]')){changeView({pianoLetter:!view.pianoLetter},'piano:letter');feedback('turn');}
 },options);
 root.addEventListener('keydown',e=>{
  const note=PIANO_KEY_CODES.indexOf(e.code);
  if(note>=0&&!e.isComposing&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.target.closest('input,textarea,select,[contenteditable=true]')){e.preventDefault();if(!e.repeat){song.stop();sound(note);}return;}
  const fragment=e.target.closest('[data-piano-fragment]'),key=e.target.closest('[data-piano-note]');
  if(fragment&&!fragment.disabled&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const from=Number(fragment.dataset.pianoSlot),to=e.key==='Home'?0:e.key==='End'?3:Math.max(0,Math.min(3,from+(e.key==='ArrowRight'?1:-1)));move({type:'reorder',from,to});return;}
  if(key&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const n=Number(key.dataset.pianoNote),to=e.key==='Home'?0:e.key==='End'?24:Math.max(0,Math.min(24,n+(e.key==='ArrowRight'?1:-1)));root.querySelector(`[data-piano-note="${to}"]`)?.focus();}
 },options);
 return ()=>{song.dispose();stop();abort.abort();};
}
