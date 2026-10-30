import {indexIn,bounded} from './common.js';
import {CHOCOLATE_PATTERN} from '../data/birthday.js';

// A piece keeps its identity. Locations 0–24 are paper cups; 25–49 are the
// serving plate. No chocolate is created, destroyed or silently swapped.
export const chocolateEmpty=places=>Array.from({length:25},(_,i)=>Number(!places.includes(i)));
export const chocolateFits=places=>chocolateEmpty(places).every((v,i)=>v===CHOCOLATE_PATTERN[i]);
export const chocolate={
 create:()=>({places:Array.from({length:25},(_,i)=>i),opened:false,drawer:false}),
 valid:p=>bounded(p?.places,25,50)&&new Set(p.places).size===25&&typeof p.opened==='boolean'&&typeof p.drawer==='boolean'&&(!p.drawer||p.opened&&chocolateFits(p.places)),
 move(p,a){
  if(a.type==='lid')return p.drawer?p:{...p,opened:!p.opened};
  if(!p.opened)return p;
  if(a.type==='drawer')return !p.drawer&&chocolateFits(p.places)?{...p,drawer:true}:p;
  if(a.type!=='place'||p.drawer||!indexIn(a.piece,25)||!indexIn(a.to,50)||p.places.includes(a.to))return p;
  return {...p,places:p.places.map((v,i)=>i===a.piece?a.to:v)};
 },
 solved:p=>p.drawer&&chocolateFits(p.places),
};
