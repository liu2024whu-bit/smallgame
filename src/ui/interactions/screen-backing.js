import {pointerSession} from './pointer.js';
import {settleScreenBacking,settleScreenGrip} from '../../services/motion/screen.js';
import {screenGripClip} from '../../data/screen.js';
const clamp=value=>Math.max(-100,Math.min(100,Math.round(value)));
export function bindScreenBacking(root,progress,move,holeAt){
 const abort=new AbortController();let active;
 const stop=pointerSession(root,{
  pick(event){const source=event.target.closest('[data-screen-carrier]')??holeAt(event);return source&&!source.disabled?{source}:null;},
  start(g){
   active=g;g.paper=root.querySelector('.screen-viewport .screen-backing');g.grips=[...root.querySelectorAll('.screen-viewport [data-screen-carrier]')];
   const before=getComputedStyle(g.paper).transform,matrix=new DOMMatrixReadOnly(before),rect=g.paper.parentElement.getBoundingClientRect();
   g.paper.getAnimations().forEach(a=>a.cancel());g.scaleX=1320/rect.width;g.scaleY=400/rect.height;
   g.startX=matrix.m41/g.paper.clientWidth*1320;g.startY=matrix.m42/g.paper.clientHeight*400;g.angle=Math.atan2(matrix.m12,matrix.m11)*180/Math.PI;
   g.paper.style.transform=before;
  },
  move(g,e){g.nextX=clamp(g.startX+(e.clientX-g.x)*g.scaleX);g.nextY=clamp(g.startY+(e.clientY-g.y)*g.scaleY);g.paper.style.transform=`translate(${g.nextX/1320*100}%,${g.nextY/400*100}%) rotate(${g.angle}deg)`;for(const grip of g.grips){grip.style.translate=`${(g.nextX-progress.backing.x)/g.scaleX}px ${(g.nextY-progress.backing.y)/g.scaleY}px`;grip.style.clipPath=`inset(${screenGripClip(670+g.nextY,46)}% 0 0)`;}},
  end(g,e,cancelled){
   if(cancelled||!Number.isFinite(e?.clientX)||!Number.isFinite(e?.clientY))return;
   const at=document.elementFromPoint(e.clientX,e.clientY);if(at&&root.querySelector('.screen-viewport')?.contains(at))move({type:'slide',x:g.nextX,y:g.nextY});
  },
  clear(){if(active){settleScreenBacking(active.paper);for(const grip of active.grips)settleScreenGrip(grip,`inset(${screenGripClip(670+progress.backing.y,46)}% 0 0)`);active=null;}}
 });
 root.addEventListener('keydown',event=>{
  if(!event.target.closest('[data-screen-carrier]')||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
  event.preventDefault();event.stopImmediatePropagation();
  const delta=event.shiftKey?20:5,p=progress.backing;
  move({type:'slide',x:event.key==='Home'?-80:clamp(p.x+(event.key==='ArrowRight'?delta:event.key==='ArrowLeft'?-delta:0)),y:event.key==='Home'?55:clamp(p.y+(event.key==='ArrowDown'?delta:event.key==='ArrowUp'?-delta:0))});
 },{signal:abort.signal});
 return ()=>{stop();abort.abort();};
}
