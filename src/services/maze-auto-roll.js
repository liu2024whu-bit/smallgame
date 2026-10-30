import {mazeAutoWalk} from '../puzzles/maze.js';
import {mazeJourney} from '../data/maze-travel.js';
import {mazeMaterial} from './maze-material.js';
import {routeMeasure} from './motion/maze.js';

// Presentation first; commit the proven journey only after the ball arrives.
// Closing or replacing the panel cancels the preview without claiming a win.
export function bindMazeAutoRoll(root,model,p,{roll,feedback}){
 const destination=mazeAutoWalk(p);if(!destination)return ()=>{};
 let frame=0,active=true,running=false,committed=false;
 const start=()=>{
  frame=0;if(!active||!model.isConnected||!root.open)return;
  const material=mazeMaterial(model),pose=material?.snapshot();
  const aligned=pose?.turns.every((n,i)=>Math.abs(((n-p.turns[i]+9)%6+6)%6-3)<.001);
  if(model.dataset.mazeReady!=='true'||model.dataset.mazeBusy==='true'||root.classList.contains('is-dragging')||!aligned){frame=requestAnimationFrame(start);return;}
  running=true;const route=mazeJourney(p,destination,pose.ball),duration=Math.min(8000,Math.max(600,routeMeasure(route).total*1.5));
  feedback('roll');
  material.animate(pose,destination,route,{duration,blocking:true,onFinish:()=>{
   if(!active||!model.isConnected||!root.open)return;
   committed=true;roll(destination);
  }});
 };
 frame=requestAnimationFrame(start);
 return ()=>{active=false;cancelAnimationFrame(frame);if(running&&!committed&&model.isConnected)mazeMaterial(model)?.preview(p);};
}
