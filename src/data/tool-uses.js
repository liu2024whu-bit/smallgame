import { BIRTHDAY_INPUTS } from './birthday-lock.js';

export const PERSISTENT_TOOL_USES = Object.freeze({ 'birthday-door':{item:'crank',requires:['stitch']} });
export const PUZZLE_TOOL_INPUTS = Object.freeze({birthdayLock:BIRTHDAY_INPUTS,calibration:['transparency','mirror','bookmark'],books:['borrowSlip'],belt:['thread','pulley','crank','needle'],film:['filmStrip'],flowers:['bookmark'],paperBack:['mirror'],stitch:['thread','needle']});
export const TOOL_RETURN_NAMES=Object.freeze({calibration:'台灯边',books:'夹座',belt:'放映机',film:'片匣',flowers:'窄槽',paperBack:'纸边的镜座',stitch:'纸边',birthdayLock:'匣盖'});
export const PUZZLE_DIRECT_TARGETS=Object.freeze({calibration:['light-fit:0','light-fit:1','light-fit:2'],books:['library-slip'],belt:[0,1,2,3].map(i=>`belt-fit:${i}`),film:['film-load'],paperBack:['press-back-mirror'],stitch:[0,1].map(i=>`stitch-fit:${i}`),birthdayLock:[0,1,2].map(i=>`birthday-fit:${i}`)});
export const MIRROR_SITES=[['birthdayLock',2],['paperBack',0],['calibration',1]];
// Needle and cotton are borrowed from the projector, then used at the folio.
// Ownership alone does not duplicate a prop still mounted in the other place.
export function toolElsewhere(state,id,index){
 if(PUZZLE_TOOL_INPUTS[id]?.[index]==='mirror')return MIRROR_SITES.find(([other,slot])=>other!==id&&state.progress[other].fitted[slot])?.[0]??null;
 const other=id==='stitch'?'belt':id==='belt'?'stitch':null,item=PUZZLE_TOOL_INPUTS[id]?.[index];
 if(!other||!['needle','thread'].includes(item))return null;
 const oi=PUZZLE_TOOL_INPUTS[other].indexOf(item);
 return state.progress[other].fitted[oi]?other:null;
}
export const toolMounts=(id,progress)=>id==='flowers'?[progress.pin>=0]:(progress.fitted??[]);
export function toolMounted(state,id,index){return index>=0&&!!TOOL_RETURN_NAMES[id]&&!!toolMounts(id,state.progress[id])[index];}
export const ROOM_TOOL_TARGETS = Object.freeze({
  'entry:ring-lamp':'birthday-door',
  'rain:rain-postcards':'postcard-mirror',
  'window:postcards':'postcard-mirror',
  'desk:p-paper':{bookmark:{target:'paper-latch',until:'flowers'}},
  'desk:p-film':'film-load',
  'party:p-ribbons':Object.fromEntries(BIRTHDAY_INPUTS.map((item,index)=>[item,`birthday-fit:${index}`])),
});
export function roomToolTarget(state,spot,item) {
  const mapping=ROOM_TOOL_TARGETS[`${state.scene}:${spot}`];
  const target=typeof mapping==='string'?mapping:mapping?.[item]??(item===undefined&&Object.keys(mapping??{}).length===1?Object.values(mapping)[0]:null);
  return typeof target==='string'?target:target&&!state.solved.includes(target.until)?target.target:undefined;
}
export function toolFor(target) {
  if(/^birthday-wick:[0-1]$/.test(target))return 'matches';
  if(/^stitch-fit:[0-1]$/.test(target))return PUZZLE_TOOL_INPUTS.stitch[Number(target.split(':')[1])];
  if(/^belt-fit:[0-3]$/.test(target))return PUZZLE_TOOL_INPUTS.belt[Number(target.split(':')[1])];
  if(/^light-fit:[0-2]$/.test(target))return PUZZLE_TOOL_INPUTS.calibration[Number(target.split(':')[1])];
  if(/^cloud-wind:[0-2]:-?1$/.test(target))return 'thread';
  if(/^flower-pin:[0-2]$/.test(target))return 'bookmark';
  if(target?.startsWith('birthday-fit:'))return BIRTHDAY_INPUTS[Number(target.split(':')[1])];
  if(target==='library-slip')return 'borrowSlip';
  if(target==='film-load')return 'filmStrip';
  if(target==='press-back-mirror')return 'mirror';
  return {'birthday-door':'crank','postcard-mirror':'mirror','paper-latch':'bookmark'}[target];
}
export function puzzleToolUse(target) {
  if(/^stitch-fit:[0-1]$/.test(target))return {id:'stitch',move:{type:'fit',index:Number(target.split(':')[1])}};
  if(/^belt-fit:[0-3]$/.test(target))return {id:'belt',move:{type:'fit',index:Number(target.split(':')[1])}};
  if(target==='library-slip')return {id:'books',move:{type:'fit',index:0}};
  if(target==='film-load')return {id:'film',move:{type:'fit',index:0}};
  if(target==='press-back-mirror')return {id:'paperBack',move:{type:'fit',index:0}};
  if(/^light-fit:[0-2]$/.test(target))return {id:'calibration',move:{type:'fit',index:Number(target.split(':')[1])}};
  if(/^cloud-wind:[0-2]:-?1$/.test(target)){const [,index,direction]=target.split(':').map(Number);return {id:'cloud',move:{type:'turn',index,direction}};}
  if(target==='paper-latch')return {id:'paper',move:{type:'open'}};
  if(/^flower-pin:[0-2]$/.test(target))return {id:'flowers',move:{type:'fit',index:0,port:Number(target.split(':')[1])}};
  if(target?.startsWith('birthday-fit:')&&toolFor(target))return {id:'birthdayLock',move:{type:'fit',index:Number(target.split(':')[1])}};
  return null;
}
