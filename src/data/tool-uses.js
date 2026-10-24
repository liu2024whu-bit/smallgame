import { BIRTHDAY_INPUTS } from './birthday-workshop.js';

export const PERSISTENT_TOOL_USES = Object.freeze({ 'birthday-door':{item:'crank',requires:['stitch']} });
export const PUZZLE_TOOL_INPUTS = Object.freeze({birthdayLock:BIRTHDAY_INPUTS});
export const ROOM_TOOL_TARGETS = Object.freeze({
  'entry:ring-lamp':'birthday-door',
  'rain:rain-postcards':'postcard-mirror',
  'window:postcards':'postcard-mirror',
  'birthday:p-chocolate':'chocolate-cover',
  'desk:p-paper':{bookmark:{target:'paper-latch',until:'flowers'}},
  'party:p-ribbons':Object.fromEntries(BIRTHDAY_INPUTS.map((item,index)=>[item,`birthday-fit:${index}`])),
});
export function roomToolTarget(state,spot,item) {
  const mapping=ROOM_TOOL_TARGETS[`${state.scene}:${spot}`];
  const target=typeof mapping==='string'?mapping:mapping?.[item]??(item===undefined&&Object.keys(mapping??{}).length===1?Object.values(mapping)[0]:null);
  return typeof target==='string'?target:target&&!state.solved.includes(target.until)?target.target:undefined;
}
export function toolFor(target) {
  if(target?.startsWith('flower-pin:'))return 'bookmark';
  if(target?.startsWith('birthday-fit:'))return BIRTHDAY_INPUTS[Number(target.split(':')[1])];
  return {'birthday-door':'crank','postcard-mirror':'mirror','chocolate-cover':'transparency','paper-latch':'bookmark'}[target];
}
export function puzzleToolUse(target) {
  if(target==='paper-latch')return {id:'paper',move:{type:'open'}};
  if(target==='chocolate-cover')return {id:'chocolate',move:{type:'cover'}};
  if(target?.startsWith('flower-pin:'))return {id:'flowers',move:{type:'set-pin',index:Number(target.split(':')[1])}};
  if(target?.startsWith('birthday-fit:')&&toolFor(target))return {id:'birthdayLock',move:{type:'fit',index:Number(target.split(':')[1])}};
  return null;
}
