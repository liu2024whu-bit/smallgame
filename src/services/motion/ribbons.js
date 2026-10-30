import {ease} from './shared.js';
import {ribbonGeometry,RIBBON_ROLLS,RIBBON_WORLD} from '../../data/ribbons.js';

export const ribbonsMotion={
 capture(root){
  const model=root.querySelector('[data-ribbon-model]');if(!model)return null;
  const world=model.closest('.ribbons-world');if(!world)return null;
  return {back:model.dataset.ribbonSide,removed:model.dataset.ribbonRemoved,solid:model.querySelector('[data-ribbon-solid]')?.outerHTML,straps:[...model.querySelectorAll('[data-ribbon-strap]')].map(el=>({index:Number(el.dataset.ribbonStrap),html:el.outerHTML})),camera:world.dataset.sourceCamera,box:world.getBoundingClientRect()};
 },
 play(root,old){
  const m=root.querySelector('[data-ribbon-model]');if(!m||!old)return;
  const world=m.closest('.ribbons-world'),animations=[],ghosts=[],hidden=[],turn=m.dataset.ribbonSide!==old.back;
  if(turn&&old.solid){
   const ghost=document.createElement('div');ghost.className='ribbon-old-face';ghost.innerHTML=old.solid;ghost.inert=true;ghosts.push(ghost);m.append(ghost);
   animations.push(ghost.animate([{transform:'perspective(1400px) rotateY(0deg)'},{transform:'perspective(1400px) rotateY(-90deg)'}],{duration:190,easing:'ease-in',fill:'forwards'}));
   animations.push(m.querySelector('[data-ribbon-solid]').animate([{transform:'perspective(1400px) rotateY(90deg)'},{transform:'perspective(1400px) rotateY(0deg)'}],{duration:220,delay:190,easing:'ease-out',fill:'backwards'}));
  }else{
   for(const oldStrap of old.straps){
    if(m.querySelector(`[data-ribbon-strap="${oldStrap.index}"]`))continue;
    const ghost=document.createElement('div');ghost.className='ribbon-removal';ghost.innerHTML=oldStrap.html;ghost.inert=true;m.append(ghost);ghosts.push(ghost);
    const target=ghost.firstElementChild,[x,y]=RIBBON_ROLLS[oldStrap.index],c=ribbonGeometry(Number(old.back),oldStrap.index),roll=m.querySelector(`[data-ribbon-saved="${oldStrap.index}"]`);
    if(roll){roll.style.visibility='hidden';hidden.push(roll);}
    animations.push(target.animate([{left:target.style.left,top:target.style.top,opacity:1,scale:'1',rotate:target.style.rotate},{left:c.a[0]+c.direction[0]*110+'px',top:c.a[1]+c.direction[1]*110-14+'px',opacity:1,scale:'.95',offset:.4},{left:x+'px',top:y+'px',opacity:0,scale:'.2',rotate:'0deg'}],{duration:580,easing:ease,fill:'forwards'}));
   }
   if(old.removed.split(',').filter(Boolean).length<6&&m.dataset.ribbonRemoved.split(',').filter(Boolean).length===6){
    const paper=m.querySelector('.ribbon-reward'),sleeve=m.querySelector('.ribbon-sleeve');
    for(const el of [paper,sleeve].filter(Boolean))animations.push(el.animate([{translate:'0 -40px',opacity:0},{translate:'0 0',opacity:1}],{duration:340,delay:450,easing:ease,fill:'backwards'}));
   }
  }
  const box=world.getBoundingClientRect();if(old.camera!==world.dataset.sourceCamera||Math.abs(box.width-old.box.width)>1){const parent=world.parentElement.getBoundingClientRect();animations.push(world.animate([{transform:`translate(${old.box.left-parent.left}px,${old.box.top-parent.top}px) scale(${old.box.width/RIBBON_WORLD[0]})`},{transform:world.style.transform}],{duration:360,easing:ease}));}
  if(!animations.length)return;
  m.dataset.ribbonBusy='true';const controls=[...root.querySelectorAll('.ribbons-workbench button')].map(el=>[el,el.disabled]);controls.forEach(([el])=>el.disabled=true);
  Promise.allSettled(animations.map(a=>a.finished)).then(()=>{ghosts.forEach(g=>g.remove());hidden.forEach(el=>el.style.removeProperty('visibility'));if(!m.isConnected)return;delete m.dataset.ribbonBusy;controls.forEach(([el,disabled])=>el.disabled=disabled);});
 },
};
