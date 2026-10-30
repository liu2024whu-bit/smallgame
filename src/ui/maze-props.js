import {MAZE_LID,MAZE_WELL,MAZE_END,mazeRingClip,mazeRect as at} from '../data/maze-apparatus.js';
import {mazeStars,mazeHome} from '../puzzles/maze.js';
import {mazeBallPoint,mazeLidAngle} from '../services/maze-material.js';
import {atlas,escape} from './dom.js';

export function mazeModel(p,{mode='whole',passive=false}={}){
 const done=p.path.at(-1)===MAZE_END,play=mode!=='moon',tag=play&&!done&&!passive?'button':'span',ball=mazeBallPoint(p);
 const rings=[0,1,2].map(i=>`<${tag} class="maze-ring" data-maze-ring="${i}" style="clip-path:${mazeRingClip(i)}" ${tag==='button'?`data-focus="maze-ring-${i}" aria-label="${['外圈','中圈','内圈'][i]}" aria-disabled="${!mazeHome(p)}"`:''}></${tag}>`).join('');
 const ballHtml=`<${tag} class="maze-ball" data-maze-ball data-focus="maze-ball" style="left:${ball[0]}px;top:${ball[1]}px" ${tag==='button'?'aria-label="沿沟槽推小球，方向键也可用"':''}>${atlas('mazeParts',1)}</${tag}>`;
 const lid=`<span class="maze-well" style="${at(MAZE_WELL)}">${atlas('mazeParts',0)}</span><span class="maze-lid" data-maze-lid style="${at(MAZE_LID)}transform:perspective(1000px) rotateX(${mazeLidAngle(p)}deg)">${atlas('mazeMarkers',0)}${[0,1].map(i=>`<span class="maze-window-light" data-maze-window="${i}" style="left:${i?99:74}px;opacity:${mazeStars(p.path).includes([8,17][i])?1:0}">${atlas('mazeMarkers',2)}</span>`).join('')}</span>`;
 const brake=`<span class="maze-brake" style="${at([552.34,1026.77,150,98.86])}">${atlas('mazeLatchParts',0)}</span><span class="maze-brake maze-brake-arm" data-maze-brake style="${at([605.72,1056.48,114.57,42.37])}transform:rotate(${mazeHome(p)?0:42}deg)">${atlas('mazeLatchParts',1)}</span>`;
 const region='';
 const controls=!passive&&play&&!done?`<button class="maze-return" data-maze-return data-focus="maze-return" style="${at([550,1020,175,135])}" aria-label="让小球沿原路回来"></button>`:'';
 return `<div class="maze-model" data-maze-model data-maze-pose='${escape(JSON.stringify(p))}' data-maze-ready="false">${passive?'':atlas('mazeBoard',0,{columns:1,rows:1,className:'maze-painting'})}<canvas data-maze-surface width="1254" height="1254" aria-hidden="true"></canvas>${rings}${lid}${ballHtml}${brake}${region}${controls}</div>`;
}
