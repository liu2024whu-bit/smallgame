import {DRAWER_PLACEMENT,DRAWER_SIZE,DRAWER_SAMPLE_ROOM} from '../data/drawer-apparatus.js';
import {drawerModel,drawerGoal} from './drawer-props.js';
import {rasterStage} from './raster-stage.js';
export function drawerRoom(state){
 const p=DRAWER_PLACEMENT;
 const goal=`<span class="world-drawer-goal" inert aria-hidden="true">${rasterStage(drawerGoal(DRAWER_SAMPLE_ROOM.quad),1672,941)}</span>`;
 return `<span class="world-drawer-cabinet" ${state.solved.includes('drawers')?'data-world-change="drawers"':''} style="left:${p.left}%;top:${p.top}%;width:${p.width}%;aspect-ratio:${DRAWER_SIZE[0]}/${DRAWER_SIZE[1]}" inert aria-hidden="true"><span class="drawer-room-fallback">${rasterStage(drawerModel(state.progress.drawers,{passive:true,done:state.solved.includes('drawers')}),...DRAWER_SIZE)}</span><canvas width="256" height="264" data-drawer-room="${state.progress.drawers.open.join(',')}"></canvas></span>`+goal;
}
