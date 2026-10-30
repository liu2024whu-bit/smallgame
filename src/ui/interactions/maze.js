import {mazeHome} from '../../puzzles/maze.js';
import {MAZE_SIZE,MAZE_CENTER,MAZE_RADII,MAZE_BRAKE_PIVOT} from '../../data/maze-apparatus.js';
import {advanceMazeBall,mazeKeyBall,mazeJourney} from '../../data/maze-travel.js';
import {mazeMaterial,mazeBallPoint} from '../../services/maze-material.js';
import {routeMeasure} from '../../services/motion/maze.js';
import {bindMazeAutoRoll} from '../../services/maze-auto-roll.js';
import {pointerSession} from './pointer.js';
import {mod} from '../../puzzles/common.js';

export function bindMaze(root,p,{move,changeView,feedback=()=>{}}){
 const model=root.querySelector('[data-maze-model]'),world=model?.closest('.maze-world');if(!world)return ()=>{};
 const material=()=>mazeMaterial(model),busy=()=>model.dataset.mazeBusy==='true'||model.dataset.mazeReady!=='true',controller=new AbortController(),{signal}=controller;
 const point=e=>{const b=world.getBoundingClientRect(),s=b.width/MAZE_SIZE;return [(e.clientX-b.left)/s,(e.clientY-b.top)/s];};
 const inside=e=>{const b=world.parentElement.getBoundingClientRect();return e&&e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom;};
 const blocked=()=>{feedback('stop');changeView({mazeBlocked:true});};
 const roll=q=>move({type:'roll',path:q.path,next:q.next,amount:q.amount});
 const stopAuto=bindMazeAutoRoll(root,model,p,{roll,feedback});
 const stop=pointerSession(root,{
  pick(e){
   if(busy())return null;const ball=e.target.closest('button[data-maze-ball]'),handle=e.target.closest('[data-maze-return]');if(ball)return {source:ball,kind:'ball'};if(handle)return {source:handle,kind:'handle'};
   if(!model.querySelector('button[data-maze-ring]')||!mazeHome(p))return null;
   const at=point(e),radius=Math.hypot(at[0]-MAZE_CENTER[0],at[1]-MAZE_CENTER[1]),scale=world.getBoundingClientRect().width/MAZE_SIZE;
   const i=MAZE_RADII.findIndex(r=>Math.abs(radius-r)<=Math.max(60,22/scale));if(i<0)return null;
   return {source:model.querySelector(`button[data-maze-ring="${i}"]`),kind:'ring',index:i,angle:Math.atan2(at[1]-MAZE_CENTER[1],at[0]-MAZE_CENTER[0]),rotation:0};
  },
  start(g){
   const state=material()?.snapshot();if(!state)return;g.base=state.turns;g.pose=structuredClone(p);g.scale=world.getBoundingClientRect().width/MAZE_SIZE;
   if(g.kind==='ball'){const at=point({clientX:g.x,clientY:g.y}),ball=mazeBallPoint(p);g.grab=at.map((v,i)=>v-ball[i]);g.previous=ball;g.rollSound=0;}
   if(g.kind==='ring')g.value=p.turns[g.index];
   if(g.kind==='handle'){const at=point({clientX:g.x,clientY:g.y});g.angle=Math.atan2(at[1]-MAZE_BRAKE_PIVOT[1],at[0]-MAZE_BRAKE_PIVOT[0]);g.leverGrip=Math.hypot(at[0]-MAZE_BRAKE_PIVOT[0],at[1]-MAZE_BRAKE_PIVOT[1])>30;g.brake=state.brake;}
  },
  move(g,e){
   const at=point(e);
   if(g.kind==='ring'){
    const angle=Math.atan2(at[1]-MAZE_CENTER[1],at[0]-MAZE_CENTER[0]);g.rotation+=Math.atan2(Math.sin(angle-g.angle),Math.cos(angle-g.angle));g.angle=angle;
    const turns=[...g.base];turns[g.index]+=g.rotation/(Math.PI/3);const value=mod(Math.round(turns[g.index]),6);if(value!==g.value)feedback('detent');g.value=value;material()?.preview(p,{turns});
   }
   if(g.kind==='ball'){
    const desired=at.map((v,i)=>v-g.grab[i]),d=desired.map((v,i)=>v-g.previous[i]),count=Math.max(1,Math.ceil(Math.hypot(...d)/6));
    const before=mazeBallPoint(g.pose);
    for(let i=1;i<=count;i++)g.pose=advanceMazeBall(g.pose,g.previous.map((v,k)=>v+d[k]*i/count),9,30);
    const after=mazeBallPoint(g.pose);g.rollSound+=Math.hypot(after[0]-before[0],after[1]-before[1]);if(g.rollSound>=70){feedback('roll');g.rollSound%=70;}
    g.previous=desired;material()?.preview(g.pose);
   }
   if(g.kind==='handle'){
    const angle=Math.atan2(at[1]-MAZE_BRAKE_PIVOT[1],at[0]-MAZE_BRAKE_PIVOT[0]),delta=Math.atan2(Math.sin(g.angle-angle),Math.cos(g.angle-angle));
    const amount=g.leverGrip?delta/(Math.PI*42/180):((e.clientX-g.x)-(e.clientY-g.y)*.5)/(30*g.scale);
    g.amount=Math.max(0,Math.min(1,amount));material()?.preview(p,{brake:g.brake*(1-g.amount)});
   }
  },
  end(g,e,cancelled){
   if(cancelled||!inside(e))return;
   if(g.kind==='ring'&&g.value!==undefined)move({type:'set-turn',index:g.index,value:g.value});
   if(g.kind==='ball'&&g.pose)roll(g.pose);
   if(g.kind==='handle'&&g.amount>=.6){move({type:'return'});feedback('return');}
  },
  clear(){if(model.isConnected){const before=material()?.snapshot();if(before){const route=mazeJourney(before.p,p,before.ball),duration=Math.min(1500,Math.max(190,routeMeasure(route).total*.75));material()?.animate(before,p,route,{duration,blocking:true});}}},
 });
 root.addEventListener('click',e=>{
  if(busy()||Date.now()<Number(root.dataset.suppressUntil??0))return;
  const button=e.target.closest('[data-maze-view],button[data-maze-ring],[data-maze-return],button[data-maze-ball]');if(!button)return;e.preventDefault();e.stopPropagation();
  if(button.dataset.mazeView){changeView({mazeView:button.dataset.mazeView,mazeBlocked:false});feedback('turn');return;}
  if(button.hasAttribute('data-maze-return')){move({type:'return'});feedback('return');return;}
  if(button.hasAttribute('data-maze-ring')){if(!mazeHome(p)){blocked();return;}move({type:'turn',index:Number(button.dataset.mazeRing),direction:1});feedback('detent');}
 },{signal});
 root.addEventListener('keydown',e=>{
  if(busy()||root.classList.contains('is-dragging')||e.altKey||e.ctrlKey||e.metaKey)return;
  const ring=e.target.closest('button[data-maze-ring]'),ball=e.target.closest('button[data-maze-ball]');if(!ring&&!ball)return;
  if(ring&&['ArrowLeft','ArrowRight','Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();if(!mazeHome(p)){blocked();return;}move({type:'turn',index:Number(ring.dataset.mazeRing),direction:e.key==='ArrowLeft'?-1:1});feedback('detent');}
  const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
  if(ball&&direction){e.preventDefault();e.stopPropagation();const next=mazeKeyBall(p,direction);if(next===p)feedback('stop');else{roll(next);feedback('roll');}}
 },{signal});
 return ()=>{stopAuto();stop();controller.abort();};
}
