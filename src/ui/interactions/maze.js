import { mazeTrial, MAZE_STARS } from '../../puzzles/maze.js';
import { mazeWalk } from '../puzzles/maze.js';
import { pointerSession } from './pointer.js';
import { playMazeRoute } from '../../services/motion/maze.js';

export function bindMaze(root,progress,move){
  const field=root.querySelector('.ring-maze');if(!field)return ()=>{};
  const abort=new AbortController(),rotors=[...field.querySelectorAll('[data-maze-rotor]')],ball=field.querySelector('[data-maze-ball]');let stopJourney=()=>{};
  const resetBall=()=>{stopJourney();ball.setAttribute('transform','translate(44 210)');field.querySelector('.maze-trial-path').replaceChildren();field.querySelectorAll('.maze-star').forEach(star=>star.classList.remove('star-touched'));};
  const trial=()=>{
    resetBall();const path=mazeTrial(progress.turns),points=mazeWalk(path);
    const report=root.querySelector('[data-maze-report]');report.textContent='小球出发了。';
    stopJourney=playMazeRoute(root,points,()=>{report.textContent=`小球走过${path.filter(node=>MAZE_STARS.includes(node)).length}颗星，还没到出口。`;});
  };
  root.addEventListener('click',event=>{if(Date.now()<Number(root.dataset.suppressUntil??0))return;if(event.target.closest('[data-maze-ball]'))trial();const ring=event.target.closest('[data-maze-ring]');if(ring)move({type:'turn',index:Number(ring.dataset.mazeRing),direction:1});},{signal:abort.signal});
  root.addEventListener('keydown',event=>{
    const ring=event.target.closest('[data-maze-ring]'),target=event.target.closest('[data-maze-ball]');
    if(target&&['Enter',' '].includes(event.key)){event.preventDefault();trial();}
    if(ring&&['ArrowLeft','ArrowRight','Enter',' '].includes(event.key)){event.preventDefault();event.stopPropagation();move({type:'turn',index:Number(ring.dataset.mazeRing),direction:event.key==='ArrowLeft'?-1:1});}
  },{signal:abort.signal});
  const stop=pointerSession(root,{
    pick(event){const source=event.target.closest('[data-maze-ring]');if(!source)return null;const box=field.getBoundingClientRect(),x=box.x+box.width/2,y=box.y+box.height/2;return {source,index:Number(source.dataset.mazeRing),center:[x,y],angle:Math.atan2(event.clientY-y,event.clientX-x),rotation:0};},
    start(){resetBall();},
    move(gesture,event){const angle=Math.atan2(event.clientY-gesture.center[1],event.clientX-gesture.center[0]);gesture.rotation+=Math.atan2(Math.sin(angle-gesture.angle),Math.cos(angle-gesture.angle));gesture.angle=angle;gesture.value=(progress.turns[gesture.index]+Math.round(gesture.rotation/(Math.PI/3))+12)%6;rotors[gesture.index].setAttribute('transform',`rotate(${progress.turns[gesture.index]*60+gesture.rotation*180/Math.PI} 210 210)`);},
    end(gesture,_,cancelled){if(!cancelled&&gesture.value!==undefined)move({type:'set-turn',index:gesture.index,value:gesture.value});},
    clear(){rotors.forEach((rotor,i)=>rotor.setAttribute('transform',`rotate(${progress.turns[i]*60} 210 210)`));},
  });
  return ()=>{stopJourney();stop();abort.abort();};
}
