import {ASSETS} from '../data/assets.js';
import {createMazePainting} from './maze-paint.js';
import {MAZE_END,MAZE_MARKS,mazePoint,mazeEdgePoint} from '../data/maze-apparatus.js';
import {mazeStars,mazeHome} from '../puzzles/maze.js';
import {motionAllowed} from './motion/shared.js';

const models=new WeakMap(),images=new Map();
function load(name){if(!images.has(name))images.set(name,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=new URL(ASSETS[name],new URL('../../',import.meta.url)).href;}));return images.get(name);}
export const mazeBallPoint=p=>p.next===null?mazePoint(p.path.at(-1)):mazeEdgePoint(p.path.at(-1),p.next,p.amount);
export const mazeLidAngle=p=>p.path.at(-1)===MAZE_END?78:mazeStars(p.path).length===2?22:0;
export const mazeMaterial=model=>models.get(model);
export function hydrateMazeMaterial(root){
 for(const model of root.querySelectorAll('[data-maze-model]')){
  if(models.has(model))continue;
  const canvas=model.querySelector('[data-maze-surface]');if(!canvas)continue;
  const saved=JSON.parse(model.dataset.mazePose),ctx=canvas.getContext('2d');let painting,paintedKey,frame=0,pose={p:saved,turns:[...saved.turns],ball:mazeBallPoint(saved),lid:mazeLidAngle(saved),brake:mazeHome(saved)?0:42};
  const draw=()=>{
   if(!model.isConnected){cancelAnimationFrame(frame);return;}
   const stars=pose.stars??mazeStars(pose.p.path);
   if(painting){const key=pose.turns.join(',')+'|'+stars.join(',');if(key!==paintedKey){painting.paint(ctx,pose.turns,stars);paintedKey=key;}canvas.style.opacity='1';model.dataset.mazeReady='true';}
   const ball=model.querySelector('[data-maze-ball]'),lid=model.querySelector('[data-maze-lid]');
   if(ball){ball.style.left=pose.ball[0]+'px';ball.style.top=pose.ball[1]+'px';}
   if(lid)lid.style.transform=`perspective(1000px) rotateX(${pose.lid}deg)`;
   model.querySelectorAll('[data-maze-window]').forEach((el,i)=>el.style.opacity=stars.includes(MAZE_MARKS[i])?'1':'0');
   const brake=model.querySelector('[data-maze-brake]');if(brake)brake.style.transform=`rotate(${pose.brake}deg)`;
  };
  const controller={
   snapshot:()=>structuredClone(pose),
   preview(p,{turns=p.turns,ball=mazeBallPoint(p),lid=mazeLidAngle(p),brake=mazeHome(p)?0:42}={}){cancelAnimationFrame(frame);pose={p:structuredClone(p),turns:[...turns],ball:[...ball],lid,brake};draw();},
   animate(from,to,route=[],{duration=360,blocking=false}={}){
    cancelAnimationFrame(frame);const end={p:structuredClone(to),turns:[...to.turns],ball:mazeBallPoint(to),lid:mazeLidAngle(to),brake:mazeHome(to)?0:42},started=performance.now();
    const points=route.length>1?route:[from.ball,end.ball],lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths.at(-1)+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
    const moving=lengths.at(-1)>1,lidTime=moving&&Math.abs(end.lid-from.lid)>1?280:0,totalTime=duration+lidTime;
    const initialStars=from.stars??mazeStars(from.p.path),forward=from.p.path.every((n,i)=>end.p.path[i]===n),visits=MAZE_MARKS.map(n=>{
     const at=mazePoint(n),index=points.findIndex(p=>Math.hypot(p[0]-at[0],p[1]-at[1])<2);
     return [n,index<0?Infinity:lengths[index]/(lengths.at(-1)||1)];
    });
    const walk=t=>{const at=lengths.at(-1)*t;let i=1;while(i<lengths.length-1&&lengths[i]<at)i++;const span=lengths[i]-lengths[i-1],a=span?(at-lengths[i-1])/span:1;return points[i-1].map((v,k)=>v+(points[i][k]-v)*a);};
    const controls=blocking?[...(model.closest('dialog')??model).querySelectorAll('.maze-workbench button,[data-action="undo"],[data-action="reset-puzzle"]')].map(el=>[el,el.disabled]):[];
    const wanted=document.activeElement,keepFocus=controls.some(([el])=>el===wanted);
    const finish=()=>{pose=end;draw();delete model.dataset.mazeBusy;controls.forEach(([el,d])=>el.disabled=d);if(keepFocus&&wanted.isConnected&&[document.body,model.closest('dialog')].includes(document.activeElement))wanted.focus({preventScroll:true});};
    if(!motionAllowed()||!duration){finish();return;}
    if(blocking){model.dataset.mazeBusy='true';controls.forEach(([el])=>el.disabled=true);}
    const tick=now=>{
     if(!model.isConnected)return;
     const elapsed=now-started,t=Math.min(1,elapsed/totalTime),ballT=Math.min(1,elapsed/duration),s=1-(1-t)**3;
     if(!motionAllowed()){finish();return;}
     const stars=forward?MAZE_MARKS.filter(n=>initialStars.includes(n)||visits.some(([node,at])=>node===n&&ballT>=at)):initialStars;
     const lift=lidTime?Math.max(0,Math.min(1,(elapsed-duration)/lidTime)):s,lidS=1-(1-lift)**3;
     pose={p:end.p,stars,turns:end.turns.map((n,i)=>{const delta=((from.turns[i]-n+9)%6+6)%6-3;return n+delta*(1-s);}),ball:walk(ballT),lid:from.lid+(end.lid-from.lid)*lidS,brake:from.brake+(end.brake-from.brake)*s};draw();
     if(t<1)frame=requestAnimationFrame(tick);else finish();
    };pose=from;draw();frame=requestAnimationFrame(tick);
   },
  };
  models.set(model,controller);draw();
  Promise.all([load('mazeBoard'),load('mazeParts'),load('mazeMarkers')]).then(([wood,parts,markers])=>{if(!model.isConnected)return;painting=createMazePainting({wood,parts,markers});draw();}).catch(()=>{if(model.isConnected)model.dataset.mazeReady='false';});
 }
}
