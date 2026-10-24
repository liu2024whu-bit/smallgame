import { bounded,indexIn,mod,same } from './common.js';
import { FILM_ORDER,filmHeights } from './film.js';

export const FLOWER_LINKS=Object.freeze([[0,1],[1,2],[0,2]]);
export const FLOWER_TARGET=Object.freeze(filmHeights(FILM_ORDER));
export const FLOWER_SEED=Object.freeze([0,1,2]);

// One quarter turn advances a linked carriage by one detent. A braked carriage stays.
// A real end stop blocks the pair together; no pot wraps from the top to the bottom.
export function turnFlowers(state,index,steps=1){
  if(!indexIn(index,3)||!Number.isInteger(steps)||!steps||Math.abs(steps)>3)return state;
  let heights=[...state.heights],moved=0;
  const direction=Math.sign(steps),linked=FLOWER_LINKS[index].filter(i=>i!==state.pin);
  for(let step=0;step<Math.abs(steps);step++){
    if(linked.some(i=>heights[i]+direction<0||heights[i]+direction>3))break;
    heights=heights.map((height,i)=>linked.includes(i)?height+direction:height);
    moved+=direction;
    if(same(heights,FLOWER_TARGET))break;
  }
  if(!moved)return state;
  const turns=[...(state.turns??[0,0,0])];turns[index]=mod(turns[index]+moved,4);
  return {heights,pin:same(heights,FLOWER_TARGET)?-1:state.pin,turns};
}
export const flowers={
  create:()=>({heights:[...FLOWER_SEED],pin:-1,turns:[0,0,0]}),
  valid:state=>bounded(state?.heights,3,4)&&Number.isInteger(state.pin)&&state.pin>=-1&&state.pin<3&&(state.turns===undefined||bounded(state.turns,3,4)),
  move(state,action){
    if(action.type==='set-pin'&&Number.isInteger(action.index)&&action.index>=-1&&action.index<3)return state.pin===action.index?state:{...state,pin:action.index};
    if(action.type==='pin'&&indexIn(action.index,3))return {...state,pin:state.pin===action.index?-1:action.index};
    return action.type==='crank'?turnFlowers(state,action.index,action.steps??action.direction??1):state;
  },
  solved:state=>same(state.heights,FLOWER_TARGET),
};
