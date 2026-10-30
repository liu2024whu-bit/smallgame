import {pointerSession} from './pointer.js';
import {announce} from '../dom.js';
import {motionAllowed,ease} from '../../services/motion/shared.js';
import {coverRubbing,rubbingFinished} from '../../services/rubbing-coverage.js';
import {RUBBING_PENCIL as rest,RUBBING_SHEET as paper,RUBBING_KEY_ROWS} from '../../data/campus-rubbing.js';

export function bindRubbing(root,{activity,view,feedback}){
 const desk=root.querySelector('[data-rubbing]'),field=desk?.querySelector('.rubbing-sheet'),pencil=desk?.querySelector('[data-rubbing-pencil]');
 if(!field)return ()=>{};
 const data=view.rubbing??={strokes:[],covered:[],rows:0},key=root.querySelector('[data-rubbing-key]');
 let covered=new Set(data.covered),returning=[],active=false;
 const cancelReturn=()=>{returning.forEach(a=>a.cancel());returning=[];};
 function park(from){
  cancelReturn();desk.classList.remove('is-rubbing');pencil.dataset.pose='0';
  pencil.style.left=rest.x+'%';pencil.style.top=rest.y+'%';pencil.style.setProperty('--pen-angle',rest.angle+'deg');
  if(!from||!motionAllowed())return;
  const timing={duration:240,easing:ease};
  returning=[pencil.animate([{left:from.x+'%',top:from.y+'%'},{left:rest.x+'%',top:rest.y+'%'}],timing),...Array.from(pencil.querySelectorAll('.pencil-pose'),pose=>pose.animate([{rotate:rest.writingAngle+'deg'},{rotate:rest.angle+'deg'}],timing))];
 }
 function movePencil(x,y){
  cancelReturn();if(!desk.classList.contains('is-rubbing'))desk.classList.add('is-rubbing');
  const point={x:paper.left+x/100*paper.width,y:paper.top+y/60*paper.height};
  pencil.style.left=point.x+'%';pencil.style.top=point.y+'%';pencil.style.setProperty('--pen-angle',rest.writingAngle+'deg');
  pencil.dataset.pose=String(motionAllowed()?Math.floor(performance.now()/150)%4:0);
  return point;
 }
 const resize=()=>cancelReturn(),disposePen=()=>{cancelReturn();window.removeEventListener('resize',resize);};
 window.addEventListener('resize',resize);
 if(data.returnFrom){const from=data.returnFrom;delete data.returnFrom;park(from);}
 if(desk.dataset.rubbing==='true')return disposePen;
 const group=field.querySelector('[data-rubbing-strokes]'),tones=field.querySelector('[data-rubbing-tones]');
 const preventNative=event=>event.preventDefault();field.addEventListener('pointerdown',preventNative);field.addEventListener('dragstart',preventNative);
 function mark(gesture,x,y){
  if(x<0||y<0||x>100||y>60){gesture.last=null;return;}
  coverRubbing(gesture.covered,gesture.last,[x,y]);
  gesture.d+=`${gesture.last?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)} `;gesture.last=[x,y];
  gesture.path.setAttribute('d',gesture.d);gesture.tone.setAttribute('d',gesture.d);
  gesture.pen=movePencil(x,y);
 }
 function start(){
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');group.append(path);const tone=path.cloneNode();tones.append(tone);
  return {path,tone,d:'',covered:new Set(covered)};
 }
 function commit(gesture){
  covered=gesture.covered;data.covered=[...covered];if(gesture.d)data.strokes.push(gesture.d);
  if(rubbingFinished(covered)){data.returnFrom=gesture.pen;announce('拓好了。');activity('campus:desk');}
  else park(gesture.pen);
 }
 const stop=pointerSession(root,{
  pick:event=>!active&&event.target.closest('.rubbing-sheet')?{source:field}:null,
  start(gesture){active=true;Object.assign(gesture,start(),{fieldRect:field.getBoundingClientRect()});const b=gesture.fieldRect;mark(gesture,(gesture.x-b.x)/b.width*100,(gesture.y-b.y)/b.height*60);feedback('roll');},
  move(gesture,event){const b=gesture.fieldRect;mark(gesture,(event.clientX-b.x)/b.width*100,(event.clientY-b.y)/b.height*60);},
  end(gesture,_,cancelled){active=false;if(cancelled){gesture.path.remove();gesture.tone.remove();park(gesture.pen);}else commit(gesture);},
 });
 function keyboardRub(){if(active)return;const gesture=start(),y=RUBBING_KEY_ROWS[data.rows++%RUBBING_KEY_ROWS.length];mark(gesture,10,y);mark(gesture,90,y);feedback('roll');commit(gesture);}
 key?.addEventListener('click',keyboardRub);
 return ()=>{stop();disposePen();key?.removeEventListener('click',keyboardRub);field.removeEventListener('pointerdown',preventNative);field.removeEventListener('dragstart',preventNative);};
}
