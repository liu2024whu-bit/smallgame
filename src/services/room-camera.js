import {sceneAspect} from '../data/display.js';
import {icon} from '../ui/dom.js';
import {pointerSession} from '../ui/interactions/pointer.js';

export function roomCameraBounds(width,height,ratio){
  const paintingHeight=Math.max(height,width/ratio);
  return {width:paintingHeight*ratio,height:paintingHeight,x:(paintingHeight*ratio-width)/2,y:(paintingHeight-height)/2};
}
const bound=(n,limit)=>Math.max(-limit,Math.min(limit,n));

// A closer look at the same painting, not a second room or stretched overlay.
// Only the viewing position changes. Prop and hit geometry share the plane.
export function createRoomCamera(root,getState){
  const shell=root.querySelector('.game-shell'),frame=root.querySelector('.game-frame'),stage=root.querySelector('.room-stage');
  const media=matchMedia('(any-pointer:coarse)'),button=document.createElement('button');
  button.className='room-camera-toggle quiet-button';button.type='button';button.dataset.roomCamera='';button.setAttribute('aria-pressed','false');
  button.dataset.buttonTaps='';
  frame.append(button);
  let close=false,scene='',pan=[0,0],bounds;
  const eligible=()=>media.matches&&innerWidth<=1200;
  function draw(){
    if(!bounds)return;pan=[bound(pan[0],bounds.x),bound(pan[1],bounds.y)];stage.style.translate=pan.join('px ')+'px';
  }
  function fit(){
    const next=getState().scene;if(next!==scene){scene=next;pan=[0,0];}
    if(!eligible())close=false;
    button.hidden=!eligible();shell.dataset.roomClose=String(close);
    button.setAttribute('aria-pressed',String(close));button.innerHTML=icon(close?'zoom-out':'zoom-in')+(close?'看全屋':'近看');
    frame.style.touchAction=close?'none':'';frame.tabIndex=close?0:-1;
    if(!close){for(const key of ['width','height','translate'])stage.style.removeProperty(key);bounds=null;return;}
    const {width,height}=frame.getBoundingClientRect();if(!width||!height)return;
    bounds=roomCameraBounds(width,height,sceneAspect(scene));
    stage.style.width=bounds.width+'px';stage.style.height=bounds.height+'px';draw();
  }
  button.addEventListener('click',()=>{close=!close;pan=[0,0];fit();});
  pointerSession(root,{
    pick(event){
      if(!close||!event.target.closest('.game-frame')||event.target.closest('.room-camera-toggle,.scene-arrow,.scene-caption'))return null;
      return {start:[...pan]};
    },
    move(g,event){pan=[g.start[0]+event.clientX-g.x,g.start[1]+event.clientY-g.y];draw();},
    end(g,_,cancelled){if(cancelled){pan=g.start;draw();}},
  });
  root.addEventListener('keydown',event=>{
    if(!close||event.target!==frame||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();event.stopPropagation();const shift={ArrowLeft:[55,0],ArrowRight:[-55,0],ArrowUp:[0,55],ArrowDown:[0,-55]}[event.key];
    pan=pan.map((v,i)=>v+shift[i]);draw();
  });
  const size=new ResizeObserver(fit);size.observe(frame);
  new MutationObserver(fit).observe(stage,{childList:true});media.addEventListener('change',fit);fit();
  return {fit};
}
