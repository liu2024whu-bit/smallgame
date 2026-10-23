import { indexIn } from './common.js';
import { numberLock } from './locks.js';
import { BIRTHDAY_CODE } from '../data/birthday-workshop.js';

const wheels=numberLock(BIRTHDAY_CODE);
export const birthdayLock = {
  create:()=>({...wheels.create(),fitted:[false,false,false],back:false,turned:true}),
  valid:state=>wheels.valid(state)&&Array.isArray(state.fitted)&&state.fitted.length===3&&state.fitted.every(value=>typeof value==='boolean')&&typeof state.back==='boolean'&&typeof state.turned==='boolean',
  move(state,action) {
    if(state.opened)return state;
    if(action.type==='fit'&&indexIn(action.index,3))return {...state,fitted:state.fitted.map((value,index)=>index===action.index?!value:value),attempts:0};
    if(action.type==='card-flip'&&state.fitted[0])return {...state,back:!state.back,attempts:0};
    if(action.type==='ribbon-turn'&&state.fitted[1])return {...state,turned:!state.turned,attempts:0};
    return wheels.move(state,action);
  },
  solved:state=>wheels.solved(state),
};
