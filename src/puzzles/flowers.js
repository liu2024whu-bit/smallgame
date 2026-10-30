import { bounded,indexIn,mod,same } from './common.js';
import { FILM_ORDER,filmHeights } from './film.js';

export const FLOWER_LINKS=Object.freeze([[0,1],[1,2],[0,2]]);
export const FLOWER_TARGET=Object.freeze(filmHeights(FILM_ORDER));
export const FLOWER_SEED=Object.freeze([0,1,2]);

// One quarter turn advances a linked carriage by one detent. A braked carriage stays.
// A real end stop blocks the pair together; no pot wraps from the top to the bottom.
export function turnFlowers(state,index,steps=1){
  if(!indexIn(index,3)||!Number.isInteger(steps)||!steps||Math.abs(steps)>3)return state;
  if(state.opened)return state;
  let heights=[...state.heights],moved=0;
  const direction=Math.sign(steps),linked=FLOWER_LINKS[index].filter(i=>i!==state.pin);
  for(let step=0;step<Math.abs(steps);step++){
    if(linked.some(i=>heights[i]+direction<0||heights[i]+direction>3))break;
    heights=heights.map((height,i)=>linked.includes(i)?height+direction:height);
    moved+=direction;
  }
  if(!moved)return state;
  const turns=[...(state.turns??[0,0,0])];turns[index]=mod(turns[index]+moved,4);
  return {...state,heights,turns};
}
export const flowersReady=state=>same(state.heights,FLOWER_TARGET);
export const flowers={
  create:()=>({heights:[...FLOWER_SEED],pin:-1,turns:[0,0,0],opened:false,attempts:0}),
  valid:state=>bounded(state?.heights,3,4)&&Number.isInteger(state.pin)&&state.pin>=-1&&state.pin<3&&bounded(state.turns,3,4)&&typeof state.opened==='boolean'&&Number.isInteger(state.attempts)&&state.attempts>=0&&state.attempts<=999&&(!state.opened||state.attempts>0&&flowersReady(state)),
  move(state,action){
    if(action.type==='unfit'&&action.index===0)return state.pin<0?state:{...state,pin:-1};
    if(action.type==='fit'&&action.index===0&&indexIn(action.port,3))return state.pin===action.port?state:{...state,pin:action.port};
    if(state.opened)return state;
    if(action.type==='submit')return {...state,attempts:Math.min(999,state.attempts+1),opened:flowersReady(state)};
    return action.type==='crank'?turnFlowers(state,action.index,action.steps??action.direction??1):state;
  },
  solved:state=>state.opened&&flowersReady(state),
};
