import {paintWordDrawer} from '../../ui/wordlock-apparatus.js';
import {WORD_INPUT_CAMERA} from '../../data/wordlock.js';
import {motionAllowed,ease} from './shared.js';

const runs=new WeakMap();
export function finishWordDrawer(root){
 const run=runs.get(root);if(!run)return;
 cancelAnimationFrame(run.frame);paintWordDrawer(root,run.camera,run.to);runs.delete(root);delete root.dataset.wordAnimating;
}
export function settleWordDrawer(root,camera,from,to,duration=340){
 finishWordDrawer(root);
 if(!motionAllowed()||Math.abs(from-to)<.0001){paintWordDrawer(root,camera,to);return;}
 let start;const run={to,camera,frame:0};runs.set(root,run);root.dataset.wordAnimating='true';paintWordDrawer(root,camera,from);
 const tick=now=>{
  if(!root.isConnected||!root.querySelector('.word-apparatus')){runs.delete(root);delete root.dataset.wordAnimating;return;}
  // A callback's frame timestamp can precede an event handler's performance.now.
  // Start on the first painted frame, so a busy initial frame cannot reverse
  // the drawer or give its papers a negative physical travel.
  start??=now;
  const t=Math.max(0,Math.min(1,(now-start)/duration)),amount=1-(1-t)**3;
  paintWordDrawer(root,camera,!motionAllowed()?to:from+(to-from)*amount);
  if(t<1&&motionAllowed())run.frame=requestAnimationFrame(tick);else{paintWordDrawer(root,camera,to);runs.delete(root);delete root.dataset.wordAnimating;}
 };
 run.frame=requestAnimationFrame(tick);
}

const reading=mode=>['papers','alphabet','columns','rows'].includes(mode);
const family=mode=>mode==='room'?'source':reading(mode)?'paper':'case';
function paintedClone(source){
 const clone=source.cloneNode(true);clone.inert=true;clone.setAttribute('aria-hidden','true');
 clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
 const originals=source.querySelectorAll('canvas');
 clone.querySelectorAll('canvas').forEach((canvas,i)=>canvas.getContext('2d').drawImage(originals[i],0,0));
 return clone;
}
function turnPaper(next,previous){
 if(!next||!previous)return;
 const base=getComputedStyle(next).transform;
 // The two painted sides meet edge-on; a mirrored rear is never crossfaded
 // over a front. Neither temporary side can take focus or puzzle input.
 previous.classList.add('word-paper-departure');next.parentElement.append(previous);
 if(next.matches('.word-strip'))Object.assign(previous.style,{position:'absolute',inset:'0'});
 const oldBase=getComputedStyle(previous).transform;
 const out=previous.animate([{transform:`${oldBase==='none'?'':oldBase} perspective(1500px) rotateY(0deg)`},{transform:`${oldBase==='none'?'':oldBase} perspective(1500px) rotateY(90deg)`}],{duration:150,easing:'ease-in',fill:'forwards'});
 next.animate([{transform:`${base==='none'?'':base} perspective(1500px) rotateY(-90deg)`,opacity:.5},{transform:base,opacity:1}],{delay:140,duration:190,easing:'ease-out',fill:'backwards'});
 out.finished.catch(()=>{}).finally(()=>previous.remove());
}
export const wordlockMotion={
 capture(root){
  const model=root.querySelector('.word-lock-workbench');if(!model)return null;
  const mode=model.dataset.wordMode,next=model.dataset.wordNextView,world=model.querySelector('.word-lock-world'),flip=model.dataset.wordFlip;
  const viewport=model.querySelector('.word-viewport');
  return {mode,amount:Number(world?.querySelector('.word-apparatus')?.dataset.wordAmount??0),box:world?.getBoundingClientRect(),pressed:model.dataset.wordPressed,
   flip,paper:flip?paintedClone(model.querySelector(flip==='rows'?'.word-paper-corner .word-strip':'.word-reading-board')):null,
   departure:next&&family(next)!==family(mode)?{element:paintedClone(viewport),box:viewport.getBoundingClientRect()}:null};
 },
 play(root,before){
  const model=root.querySelector('.word-lock-workbench');if(!model||!before)return;
  const mode=model.dataset.wordMode,world=model.querySelector('.word-lock-world');
  if(before.departure){
   const {element,box}=before.departure;element.classList.add('word-view-departure');
   Object.assign(element.style,{position:'fixed',left:box.left+'px',top:box.top+'px',width:box.width+'px',height:box.height+'px',margin:'0',zIndex:'3',pointerEvents:'none'});
   root.append(element);
   const out=element.animate([{opacity:1},{opacity:0}],{duration:170,easing:'ease-out',fill:'forwards'});
   out.finished.catch(()=>{}).finally(()=>element.remove());
   model.querySelector('.word-viewport').animate([{opacity:0},{opacity:1}],{duration:230,easing:'ease-out'});
  }else if(world&&before.box&&mode!==before.mode){
   const box=world.parentElement.getBoundingClientRect();
   world.animate([{transform:`translate(${before.box.left-box.left}px,${before.box.top-box.top}px) scale(${before.box.width/1672})`},{transform:world.style.transform}],{duration:330,easing:ease});
  }
  if(world&&family(mode)==='case'){
   const to=Number(world.querySelector('.word-apparatus')?.dataset.wordAmount??0);
   settleWordDrawer(world,WORD_INPUT_CAMERA,before.amount,to);
   if(before.pressed){
    const key=[...world.querySelectorAll('[data-mechanical-key]')].find(el=>el.dataset.mechanicalKey===before.pressed);
    key?.querySelectorAll('.mechanical-key-art,.mechanical-key-legend').forEach(el=>el.animate([{translate:'0 4px'},{translate:'0 0'}],{duration:120,easing:'ease-out'}));
   }
  }
  if(before.flip&&before.mode===mode)turnPaper(model.querySelector(before.flip==='rows'?'.word-paper-corner .word-strip':'.word-reading-board'),before.paper);
 },
};
