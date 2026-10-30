import {DRAWER_WORLD,DRAWER_LOCAL,DRAWER_SIZE,DRAWER_SAMPLE_NEAR} from '../../data/drawer-apparatus.js';
import {ASSETS} from '../../data/assets.js';
import {drawerModel,drawerGoal} from '../drawer-props.js';
import {renderScenePicture} from '../room.js';
import {viewControl} from '../view-control.js';

export function renderDrawers(p,{state,view={},sourcePicture}){
 const mode=view.drawerView==='room'?'room':view.back?'back':'front',done=state.solved.includes('drawers'),[w,h]=DRAWER_WORLD,[x,y,width]=DRAWER_LOCAL;
 const source=sourcePicture??((exclude=[])=>renderScenePicture({...state,scene:'entry'},{exclude}));
 const object=`<div class="drawer-placement" style="left:${x}px;top:${y}px;width:${width}px;height:${width*DRAWER_SIZE[1]/512}px"><div class="drawer-placed-scale" style="transform:scale(${width/512})">${drawerModel(p,{back:mode==='back',done})}</div></div>`;
 const field=mode==='room'?`<div class="drawer-room-view">${source([],'entry')}</div>`:`<div class="drawer-viewport"><div class="drawer-world" data-source-camera="0,0,${w},${h}"><img class="drawer-shelf-paint" src="${ASSETS.drawerShelf}" alt="" draggable="false">${object}${drawerGoal(DRAWER_SAMPLE_NEAR)}</div></div>`;
 return `<div class="drawers-workbench" data-drawer-mode="${mode}">${field}<nav class="drawer-navigation" aria-label="小柜取景">${[['front','正面','zoom-in'],['back','背板','undo'],['room','原处','zoom-out']].map(([id,title,mark])=>viewControl(title,`data-drawer-view="${id}" data-focus="drawer-view-${id}" aria-current="${mode===id}"`,mark)).join('')}</nav><span class="sr-only">四格抽屉可以轻拉或推回，也能轻点或按回车。正面上下方向键开合，背面左右方向键移动后舌。后面的挡销旁记着它来自哪一格；木销让开，后舌才有空位。小样是上两格合着、下两格打开。每一步都能撤回。</span></div>`;
}
