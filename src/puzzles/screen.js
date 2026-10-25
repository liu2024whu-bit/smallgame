import { bounded, indexIn, same, mod } from './common.js';

export const HASHIRA = ['富冈义勇', '胡蝶忍', '炼狱杏寿郎', '宇髄天元', '时透无一郎', '甘露寺蜜璃', '伊黑小芭内', '不死川实弥', '悲鸣屿行冥'];
export const SCREEN_FACES=Object.freeze([1,0,1,1,0,0,1,0,1]);
// The front painting forms apertures; the actual ink is on the sheet behind it.
export const SCREEN_CODE = Object.freeze([6, 4, 2]);
export const SCREEN_BACKING = Object.freeze({x:-80,y:55,turned:true});
export const backingValid=p=>p&&Number.isInteger(p.x)&&Math.abs(p.x)<=100&&Number.isInteger(p.y)&&Math.abs(p.y)<=100&&typeof p.turned==='boolean';
export function screenAligned(flips) {
  return bounded(flips,9,2)&&same(flips,SCREEN_FACES);
}
export const screen = {
  create:()=>({flips:Array(9).fill(0),backing:{...SCREEN_BACKING},values:[0,0,0],opened:false,attempts:0}),
  valid:s=>bounded(s?.flips,9,2)&&backingValid(s.backing)&&bounded(s.values,3,10)&&typeof s.opened==='boolean'&&Number.isInteger(s.attempts)&&s.attempts>=0&&s.attempts<=999&&(!s.opened||s.attempts>0&&same(s.values,SCREEN_CODE)),
  move(state, action) {
    if(state.opened)return state;
    if(action.type==='flip'&&indexIn(action.index,9))return {...state,flips:state.flips.map((v,i)=>i===action.index?1-v:v)};
    if(action.type==='slide'&&Number.isInteger(action.x)&&Math.abs(action.x)<=100&&Number.isInteger(action.y)&&Math.abs(action.y)<=100)return {...state,backing:{...state.backing,x:action.x,y:action.y}};
    if(action.type==='turn-backing')return {...state,backing:{...state.backing,turned:!state.backing.turned}};
    if(action.type==='turn'&&indexIn(action.index,3)&&[-1,1].includes(action.direction))return {...state,values:state.values.map((v,i)=>i===action.index?mod(v+action.direction,10):v)};
    if(action.type==='set'&&indexIn(action.index,3)&&indexIn(action.value,10))return {...state,values:state.values.map((v,i)=>i===action.index?action.value:v)};
    if(action.type==='submit')return {...state,opened:same(state.values,SCREEN_CODE),attempts:Math.min(999,state.attempts+1)};
    return state;
  },
  // A deduced code works without a hidden "looked at every leaf" gate.
  solved:state=>state.opened&&same(state.values,SCREEN_CODE),
};
