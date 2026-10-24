import {pointerSession,dragGhost} from './pointer.js';
import {turnFlowers,FLOWER_LINKS} from '../../puzzles/flowers.js';
import {GARDEN} from '../../data/garden.js';
import {motionAllowed} from '../../services/motion.js';

const levelTop=height=>GARDEN.levels[0]+(GARDEN.levels[1]-GARDEN.levels[0])*height;
export function bindGarden(root,progress,move,feedback=()=>{}){
  const garden=root.querySelector('.garden-lift');if(!garden)return ()=>{};
  const abort=new AbortController(),columns=[...garden.querySelectorAll('.flower-column')],pots=[...garden.querySelectorAll('.flower-pot')],zones=[...garden.querySelectorAll('.flower-column-foot')];
  let committing=false,knockTimer;
  garden.addEventListener('dragstart',event=>event.preventDefault(),{signal:abort.signal});
  garden.addEventListener('pointerdown',event=>{const button=event.target.closest('[data-garden-crank],[data-bookmark-grab]');if(button&&!button.disabled&&event.button===0){event.preventDefault();button.focus({preventScroll:true});}},{signal:abort.signal});
  function knock(button){
    feedback('stop');
    const note=garden.querySelector('.garden-knock');if(note)note.textContent='到头啦。';
    clearTimeout(knockTimer);knockTimer=setTimeout(()=>{if(note)note.textContent='';},1300);
    if(motionAllowed())button.querySelector('.garden-handle')?.animate([{translate:'0 0'},{translate:'-2px 0'},{translate:'1px 0'},{translate:'0 0'}],{duration:210});
  }
  function highlight(index=-1){
    const linked=FLOWER_LINKS[index]??[];
    columns.forEach((column,i)=>column.classList.toggle('flower-will-move',linked.includes(i)&&i!==progress.pin));
  }
  function show(event){const button=event.target.closest('[data-garden-crank]');if(button)highlight(Number(button.dataset.gardenCrank));}
  for(const type of ['pointerover','focusin'])root.addEventListener(type,show,{signal:abort.signal});
  for(const type of ['pointerout','focusout'])root.addEventListener(type,()=>highlight(),{signal:abort.signal});
  root.addEventListener('keydown',event=>{
    const button=event.target.closest('[data-garden-crank]');
    if(!button||button.disabled||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();event.stopPropagation();
    const index=Number(button.dataset.gardenCrank),steps=['ArrowLeft','ArrowDown'].includes(event.key)?-1:1;
    committing=true;const changed=move({type:'crank',index,steps});if(!changed){committing=false;knock(button);}
  },{signal:abort.signal});
  function restore(source){
    for(const [i,pot] of pots.entries()){
      const from=pot.style.top,to=levelTop(progress.heights[i])+'%';pot.style.top=to;
      if(motionAllowed()&&from!==to&&pot.isConnected)pot.animate([{top:from},{top:to}],{duration:220,easing:'ease-out'});
    }
    if(source?.isConnected){
      const handle=source.querySelector('.garden-handle'),from=parseFloat(source.style.getPropertyValue('--garden-turn')),to=(progress.turns?.[Number(source.dataset.gardenCrank)]??0)*90;
      source.style.setProperty('--garden-turn',to+'deg');
      if(handle&&from!==to&&motionAllowed())handle.animate([{rotate:from+'deg'},{rotate:to+'deg'}],{duration:220,easing:'ease-out'});
    }
  }
  const stopTurn=pointerSession(root,{
    pick(event){
      const source=event.target.closest('[data-garden-crank]');if(!source||source.disabled)return null;
      const box=source.getBoundingClientRect(),cx=box.left+box.width*.5,cy=box.top+box.height*.5;
      return {source,index:Number(source.dataset.gardenCrank),cx,cy,angle:Math.atan2(event.clientY-cy,event.clientX-cx),rotation:0,vertical:Math.hypot(event.clientX-cx,event.clientY-cy)<box.width*.15,unit:Math.max(24,box.width*.45)};
    },
    start(gesture){committing=false;highlight(gesture.index);feedback('return');pots.forEach(pot=>pot.getAnimations().forEach(a=>a.cancel()));},
    move(gesture,event){
      if(gesture.vertical)gesture.rotation=(gesture.y-event.clientY)/gesture.unit*Math.PI/2;
      else{const angle=Math.atan2(event.clientY-gesture.cy,event.clientX-gesture.cx);gesture.rotation+=Math.atan2(Math.sin(angle-gesture.angle),Math.cos(angle-gesture.angle));gesture.angle=angle;}
      const fraction=Math.max(-3,Math.min(3,gesture.rotation/(Math.PI/2))),whole=Math.trunc(fraction),part=Math.abs(fraction-whole);
      const low=turnFlowers(progress,gesture.index,whole),high=turnFlowers(progress,gesture.index,whole+Math.sign(fraction-whole));
      const heights=low.heights.map((h,i)=>h+(high.heights[i]-h)*part);
      pots.forEach((pot,i)=>pot.style.top=levelTop(heights[i])+'%');
      const linked=FLOWER_LINKS[gesture.index].filter(i=>i!==progress.pin),actual=linked.reduce((sum,i)=>sum+heights[i]-progress.heights[i],0)/linked.length;
      const resistance=Math.max(-7,Math.min(7,(fraction-actual)*6));
      gesture.source.style.setProperty('--garden-turn',((progress.turns?.[gesture.index]??0)*90+actual*90+resistance)+'deg');
      const detent=Math.round(actual);if(detent!==gesture.detent){if(gesture.detent!==undefined||detent)feedback('detent');gesture.detent=detent;}
      gesture.steps=Math.max(-3,Math.min(3,Math.round(fraction)));
    },
    end(gesture,_,cancelled){
      committing=!cancelled&&Boolean(gesture.steps);
      if(committing&&move({type:'crank',index:gesture.index,steps:gesture.steps}))return;
      committing=false;restore(gesture.source);if(cancelled)feedback('return');if(!cancelled&&gesture.steps)knock(gesture.source);
    },
    clear(){highlight();},
  });
  const stopBook=pointerSession(root,{
    pick(event){const source=event.target.closest('[data-bookmark-grab]');return source&&!source.disabled?{source,index:-1}:null;},
    start(gesture){gesture.ghost=dragGhost(gesture.source,'garden-bookmark-ghost');gesture.ghost.style.width=gesture.source.getBoundingClientRect().width+'px';},
    move(gesture,event){
      const box=gesture.ghost.getBoundingClientRect();gesture.ghost.style.left=event.clientX-box.width*.72+'px';gesture.ghost.style.top=event.clientY-box.height*.44+'px';
      gesture.index=zones.findIndex(zone=>{const b=zone.getBoundingClientRect();return event.clientX>=b.left-15&&event.clientX<=b.right+15&&event.clientY>=b.top-18&&event.clientY<=b.bottom+18;});
      zones.forEach((zone,i)=>zone.classList.toggle('drop-target',i===gesture.index));
    },
    end(gesture,_,cancelled){if(cancelled)return;committing=true;if(!move({type:'set-pin',index:gesture.index})){committing=false;gesture.returnToSource=true;}},
    clear(){zones.forEach(zone=>zone.classList.remove('drop-target'));},
  });
  return ()=>{stopTurn();stopBook();if(!committing)restore();highlight();clearTimeout(knockTimer);abort.abort();};
}
