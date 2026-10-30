import {viewControl} from '../view-control.js';
import {MAZE_CAMERAS,MAZE_END} from '../../data/maze-apparatus.js';
import {mazeModel} from '../maze-props.js';
export function renderMaze(p,{view={}}={}){
 const done=p.path.at(-1)===MAZE_END,mode=['play','moon'].includes(view.mazeView)&&!(view.mazeView==='moon'&&!done)?view.mazeView:'whole',camera=MAZE_CAMERAS[mode];
 return `<div class="maze-workbench"><div class="maze-viewport" style="--maze-aspect:${camera[2]/camera[3]}"><div class="maze-world" data-source-camera="${camera}">${mazeModel(p,{mode})}</div></div><div class="maze-controls">${done?`<nav class="maze-navigation" aria-label="木盘取景">${[['whole','木盘'],['moon','月亮']].map(([id,label])=>viewControl(label,`data-maze-view="${id}" data-focus="maze-view-${id}" aria-current="${mode===id}"`)).join('')}</nav>`:''}<p class="maze-status" role="status">${view.mazeBlocked?'小球还在里面，边上的小闩可以让它回来。':''}</p></div><span class="sr-only">星星嵌在底板上，透过木环的槽口能看见。圆环可拖动或用左右方向键转动。槽道接通后，小球会自己滚过两颗星、进入中央。也可沿实际沟槽拖动或用方向键移动小球。小球在里面时，木环会停住；小闩能让它沿原路回来。</span></div>`;
}
