import { mazeEdges, mazePath, MAZE_STARS } from '../../puzzles/maze.js';
import { character, icon, moveButton } from '../dom.js';

export const MAZE_RADII=[166,112,58];
export function mazePoint(node){
  const angle=Math.PI+(node%6)*Math.PI/3,radius=MAZE_RADII[Math.floor(node/6)];
  return [210+Math.cos(angle)*radius,210+Math.sin(angle)*radius];
}
export function mazeSegment(a,b){
  const from=mazePoint(a),to=mazePoint(b);
  if(Math.floor(a/6)!==Math.floor(b/6))return `M${from} L${to}`;
  const radius=MAZE_RADII[Math.floor(a/6)],clockwise=(b-a+6)%6===1?1:0;
  return `M${from} A${radius} ${radius} 0 0 ${clockwise} ${to}`;
}
export function mazeWalk(path){
  const points=[];
  for(let i=0;i<path.length;i++){
    const a=path[i-1],b=path[i];
    if(i&&Math.floor(a/6)===Math.floor(b/6)){
      const direction=(b-a+6)%6===1?1:-1,radius=MAZE_RADII[Math.floor(b/6)];
      for(let k=1;k<=6;k++){const angle=Math.PI+(a%6+direction*k/6)*Math.PI/3;points.push([210+Math.cos(angle)*radius,210+Math.sin(angle)*radius]);}
    }else points.push(mazePoint(b));
  }
  return points;
}

export function renderMaze(progress){
  const edges=mazeEdges([0,0,0]),path=mazePath(progress.turns),names=['外圈','中圈','内圈'];
  return `<div class="maze-workbench"><div class="maze-goal" aria-label="小球从入口出发，经过两颗星，到达出口"><i></i><span>→</span><b>✦</b><b>✦</b><span>→</span><em></em></div><div class="maze-apparatus">${character('mazeBoard',0,1,1,'三道可以转动的圆木盘')}<svg class="ring-maze" viewBox="0 0 420 420" preserveAspectRatio="none" aria-label="转动木环接路，轻推入口的小球试路"><defs><radialGradient id="maze-ball-brass"><stop offset="0" stop-color="#fff7cb"/><stop offset=".6" stop-color="#d5b777"/><stop offset="1" stop-color="#9b7c48"/></radialGradient></defs>${[190,139,85,31].map(r=>`<circle class="maze-seam" cx="210" cy="210" r="${r}"/>`).join('')}${MAZE_RADII.map((radius,index)=>`<g class="maze-rotor" data-maze-rotor="${index}" transform="rotate(${progress.turns[index]*60} 210 210)">${edges.filter(([a])=>Math.floor(a/6)===index).map(([a,b])=>`<path class="maze-track" d="${mazeSegment(a,b)}"/>`).join('')}<path class="maze-grip" d="M${207} ${210-radius-12}v7m6-7v7m6-7v7"/></g><circle class="maze-ring-touch" data-maze-ring="${index}" data-focus="maze-ring-${index}" tabindex="0" role="button" aria-label="转动${names[index]}" cx="210" cy="210" r="${radius}"/>`).join('')}${MAZE_STARS.map(node=>{const [x,y]=mazePoint(node);return `<text class="maze-star ${path?'star-touched':''}" data-maze-star="${node}" x="${x}" y="${y+7}" text-anchor="middle">✦</text>`;}).join('')}<path class="maze-entry-arrow" d="M10 210h21m-7-6 7 6-7 6"/><circle class="maze-end" cx="268" cy="210" r="10"/><path class="maze-end-mark" d="m264 210 3 3 6-6"/><g class="maze-trial-path"></g><g class="maze-ball ${path?'maze-arrived':''}" data-maze-ball data-focus="maze-ball" data-walk='${JSON.stringify(path?mazeWalk(path):[])}' tabindex="0" role="button" aria-label="轻推小球试路" transform="translate(${path?'268 210':'44 210'})"><circle class="ball-hit" r="18"/><circle r="8" fill="url(#maze-ball-brass)"/><circle cx="-2" cy="-3" r="2" fill="#fff9db"/></g></svg></div><div class="maze-ring-controls">${names.map((name,index)=>`<div><span>${name}</span>${moveButton(icon('left'),{type:'turn',index,direction:-1},{key:`maze-left-${index}`}).replace('<button ',`<button aria-label="${name}往左一格" `)}<i class="ring-turn-mark" aria-hidden="true">↻</i>${moveButton(icon('right'),{type:'turn',index,direction:1},{key:`maze-right-${index}`}).replace('<button ',`<button aria-label="${name}往右一格" `)}</div>`).join('')}</div><span class="sr-only" data-maze-report>${path?'小球穿过两颗星，到达出口。':'圆环可以沿着边缘拖动，也可以选中后用左右方向键转动。'}</span></div>`;
}
