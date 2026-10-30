import { bounded, indexIn, same } from './common.js';

export const DRAWER_TARGET = [0, 0, 1, 1];
// Each pair is one physical stop: the drawer driving it and its clear position.
export const DRAWER_LOCKS = [[[3,0]],[[0,1]],[[1,1],[0,0]],[[2,1],[1,0]]];
export const drawerStops=(open,index)=>(DRAWER_LOCKS[index]??[]).filter(([driver,clear])=>open[driver]!==clear);
export function drawerEnabled(open, index) {
  return indexIn(index,4)&&drawerStops(open,index).length===0;
}
export const drawers = {
  create: () => ({ open: [0, 0, 0, 0] }),
  valid: state => bounded(state?.open, 4, 2),
  move: (state, action) => action.type === 'drawer' && indexIn(action.index, 4) && drawerEnabled(state.open, action.index) ? { open: state.open.map((v, i) => i === action.index ? 1 - v : v) } : state,
  solved: state => same(state.open, DRAWER_TARGET),
};
