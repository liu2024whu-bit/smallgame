import {ease,motionAllowed} from './shared.js';
import {stitchPoint} from '../../data/stitch.js';
const fields=root=>[...root.querySelectorAll('[data-stitch-state]')];
function capture(field){const turn=field.querySelector('.stitch-turntable'),needle=field.querySelector('[data-stitch-needle]'),world=field.closest('.word-lock-world');return {p:JSON.parse(field.dataset.stitchState),back:field.dataset.stitchBack==='true',camera:world.dataset.sourceCamera,box:world.getBoundingClientRect(),sample:getComputedStyle(field.querySelector('.stitch-swatch-turn')).transform,turn:getComputedStyle(turn).transform,needle:needle?{node:needle.cloneNode(true),left:needle.style.left,top:needle.style.top}:null};}
function holdMovingControls(field,world){
 const animations=world.getAnimations({subtree:true}).filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity);if(!animations.length)return;
 const buttons=[...field.querySelectorAll('button:not(:disabled)')];field.dataset.stitchMoving='true';buttons.forEach(b=>b.disabled=true);
 Promise.allSettled(animations.map(a=>a.finished)).then(()=>{if(!field.isConnected)return;buttons.forEach(b=>b.disabled=false);delete field.dataset.stitchMoving;field.dispatchEvent(new Event('stitch-settled'));});
}
export const stitchMotion={
 capture:root=>fields(root).map(capture),
 play(root,before){fields(root).forEach((field,i)=>{
  const old=before[i];if(!old||!motionAllowed())return;const p=JSON.parse(field.dataset.stitchState),turn=field.querySelector('.stitch-turntable'),passed=p.path.length===old.p.path.length+1,world=field.closest('.word-lock-world');
  const currentBox=world.getBoundingClientRect();if(old.camera!==world.dataset.sourceCamera||Math.abs(old.box.width-currentBox.width)>1||Math.abs(old.box.left-currentBox.left)+Math.abs(old.box.top-currentBox.top)>1){const box=world.parentElement.getBoundingClientRect();world.animate([{transform:`translate(${old.box.left-box.left}px,${old.box.top-box.top}px) scale(${old.box.width/1672})`},{transform:world.style.transform}],{duration:360,easing:ease}).finished.catch(()=>{});}
  if(old.turn!==getComputedStyle(turn).transform)turn.animate([{transform:old.turn},{transform:turn.style.transform}],{duration:380,delay:passed?120:0,easing:ease,fill:'backwards'}).finished.catch(()=>{});
  const sample=field.querySelector('.stitch-swatch-turn');if(old.sample!==getComputedStyle(sample).transform)sample.animate([{transform:old.sample},{transform:sample.style.transform}],{duration:380,delay:passed?120:0,easing:ease,fill:'backwards'}).finished.catch(()=>{});
  if(passed&&old.needle){
   const ghost=old.needle.node,[x,y]=stitchPoint(p.path.at(-1),old.back);ghost.removeAttribute('data-stitch-needle');ghost.removeAttribute('data-focus');ghost.setAttribute('aria-hidden','true');ghost.inert=true;field.append(ghost);
   const timer=setTimeout(()=>ghost.remove(),240);ghost.animate([{left:old.needle.left,top:old.needle.top,opacity:1},{left:x+'px',top:y+65+'px',opacity:0}],{duration:180,easing:ease,fill:'forwards'}).finished.catch(()=>{}).finally(()=>{clearTimeout(timer);ghost.remove();});
   field.querySelector('[data-stitch-needle]')?.animate([{opacity:0},{opacity:1}],{duration:180,delay:320,fill:'backwards',easing:ease}).finished.catch(()=>{});
  }
  if(p.pulls>old.p.pulls&&!p.tied)field.querySelector('.stitch-loop')?.animate([{scale:'.75',translate:'16px 0'},{scale:'1',translate:'0 0'}],{duration:350,easing:ease}).finished.catch(()=>{});
  if(p.tied&&!old.p.tied)field.querySelector('.stitch-knot')?.animate([{scale:'1.5'},{scale:'1'}],{duration:300,easing:ease}).finished.catch(()=>{});
  if(p.finished&&!old.p.finished)field.querySelector('.assembly-snips')?.animate([{rotate:'-12deg',translate:'-8px -8px'},{rotate:'0deg',translate:'0 0'}],{duration:280,easing:ease}).finished.catch(()=>{});
  holdMovingControls(field,world);
 });},
};
