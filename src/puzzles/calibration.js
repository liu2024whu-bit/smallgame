import {bounded,indexIn} from './common.js';
import {LIGHT_LANDMARKS} from '../data/light.js';
import {visibleLightError} from './light-geometry.js';
const flags=list=>Array.isArray(list)&&list.length===3&&list.every(v=>typeof v==='boolean');
const configuration=state=>bounded(state?.values,3,4)&&typeof state?.flipped==='boolean';
export const lightAligned=state=>configuration(state)&&visibleLightError(state.values,state.flipped,LIGHT_LANDMARKS)<.75;
export const canTraceLight=state=>flags(state?.fitted)&&state.fitted.every(Boolean)&&state.lit&&lightAligned(state);
const proofValid=proof=>proof===null||configuration(proof)&&lightAligned(proof);
export const calibration={
 create:()=>({values:[0,0,0],fitted:[false,false,false],flipped:false,lit:false,proof:null}),
 valid:state=>configuration(state)&&flags(state.fitted)&&typeof state.lit==='boolean'&&proofValid(state.proof)&&(state.proof===null||!state.lit&&state.fitted.every(v=>!v)),
 move(state,action){
  if(state.proof)return state;
  if(action.type==='fit'||action.type==='unfit'){
   if(!indexIn(action.index,3))return state;
   const fitted=action.type==='fit';if(state.fitted[action.index]===fitted)return state;
   return {...state,fitted:state.fitted.map((v,i)=>i===action.index?fitted:v)};
  }
  if(action.type==='power')return {...state,lit:!state.lit};
  if(action.type==='flip')return state.fitted[0]?{...state,flipped:!state.flipped}:state;
  if(action.type==='trace'){
   if(!canTraceLight(state))return state;
   return {...state,fitted:[false,false,false],lit:false,proof:{values:[...state.values],flipped:state.flipped}};
  }
  let {index,value}=action;
  if(!indexIn(index,3))return state;
  if(action.type==='turn'&&[-1,1].includes(action.direction))value=Math.min(3,Math.max(0,state.values[index]+action.direction));
  else if(action.type!=='set-turn'||!indexIn(value,4))return state;
  if(value===state.values[index])return state;
  return {...state,values:state.values.map((v,i)=>i===index?value:v)};
 },
 solved:state=>calibration.valid(state)&&state.proof!==null
};
