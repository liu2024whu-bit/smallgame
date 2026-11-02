import {mazeAutoTravel,maze} from '../puzzles/maze.js';
import {mazeJourney} from '../data/maze-travel.js';
import {mazeMaterial} from './maze-material.js';
import {routeMeasure} from './motion/maze.js';

// Presentation first; commit the proven journey only after the ball arrives.
// Closing or replacing the panel cancels the preview without claiming a win.
export function createMazeAutoRoll(root,model,p,{roll,feedback}){
 const destination=mazeAutoTravel(p);if(!destination)return {start(){},dispose(){}};
 let frame=0,active=true,running=false,committed=false;
 const start=()=>{
  frame=0;if(!active||!model.isConnected||!root.open)return;
  const material=mazeMaterial(model),pose=material?.snapshot();
  const aligned=pose?.turns.every((n,i)=>Math.abs(((n-p.turns[i]+9)%6+6)%6-3)<.001);
  if(model.dataset.mazeReady!=='true'||model.dataset.mazeBusy==='true'||model.dataset.mazeHeld==='true'||root.classList.contains('is-dragging')||!aligned){frame=requestAnimationFrame(start);return;}
  running=true;const route=mazeJourney(p,destination,pose.ball),finished=maze.solved(destination),duration=finished?Math.min(8000,Math.max(600,routeMeasure(route).total*1.5)):Math.min(4000,Math.max(500,routeMeasure(route).total*.9));
  feedback('roll');
  material.animate(pose,destination,route,{duration,blocking:true,onFinish:()=>{
   if(!active||!model.isConnected||!root.open)return;
   running=false;committed=true;const changed=roll(destination);
   if(!changed&&model.isConnected)material.preview(p);
  }});
 };
 return {
  start(){if(active&&!running&&!frame){committed=false;frame=requestAnimationFrame(start);}},
  dispose(){active=false;cancelAnimationFrame(frame);if(running&&!committed&&model.isConnected)mazeMaterial(model)?.preview(p);},
 };
}
