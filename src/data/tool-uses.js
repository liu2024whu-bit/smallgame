import { BIRTHDAY_INPUTS } from './birthday-workshop.js';

export const PERSISTENT_TOOL_USES = Object.freeze({ 'birthday-door':{item:'crank',requires:['stitch']} });
export const PUZZLE_TOOL_INPUTS = Object.freeze({birthdayLock:BIRTHDAY_INPUTS});
export const ROOM_TOOL_TARGETS = Object.freeze({
  'entry:ring-lamp':'birthday-door',
  'rain:rain-postcards':'postcard-mirror',
  'window:postcards':'postcard-mirror',
  'birthday:p-chocolate':'chocolate-cover',
  'party:p-ribbons':Object.fromEntries(BIRTHDAY_INPUTS.map((item,index)=>[item,`birthday-fit:${index}`])),
});
export function roomToolTarget(scene,spot,item) {
  const target=ROOM_TOOL_TARGETS[`${scene}:${spot}`];
  return typeof target==='string'?target:target?.[item];
}
export function toolFor(target) {
  if(target?.startsWith('flower-pin:'))return 'bookmark';
  if(target?.startsWith('birthday-fit:'))return BIRTHDAY_INPUTS[Number(target.split(':')[1])];
  return {'birthday-door':'crank','postcard-mirror':'mirror','chocolate-cover':'transparency'}[target];
}
export function puzzleToolUse(target) {
  if(target==='chocolate-cover')return {id:'chocolate',move:{type:'cover'}};
  if(target?.startsWith('flower-pin:'))return {id:'flowers',move:{type:'set-pin',index:Number(target.split(':')[1])}};
  if(target?.startsWith('birthday-fit:')&&toolFor(target))return {id:'birthdayLock',move:{type:'fit',index:Number(target.split(':')[1])}};
  return null;
}
