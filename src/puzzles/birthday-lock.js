import {indexIn,same} from './common.js';
import {numberLock} from './locks.js';
import {DECODER_MIRROR_RANGE,DECODER_PAPER_RANGE,BIRTHDAY_CODE,DECODER_PAPER_SEED,DECODER_MIRROR_SEED,boundedPoint,decoderPaperOffset,decoderMirrorPoint} from '../data/birthday-lock.js';
const wheels=numberLock(BIRTHDAY_CODE);
const bools=['back','turned','unfolded','stripBack','lid','revealed'];
export const birthdayLock={
 create:()=>({...wheels.create(),fitted:[false,false,false],back:false,turned:true,unfolded:false,stripBack:false,offset:[...DECODER_PAPER_SEED],mirror:[...DECODER_MIRROR_SEED],lid:false,revealed:false}),
 valid:p=>wheels.valid(p)&&Array.isArray(p.fitted)&&p.fitted.length===3&&p.fitted.every(v=>typeof v==='boolean')&&bools.every(k=>typeof p[k]==='boolean')&&boundedPoint(p.offset,...DECODER_PAPER_RANGE)&&boundedPoint(p.mirror,...DECODER_MIRROR_RANGE)&&(!p.lid||p.opened&&p.revealed&&p.fitted.every(v=>!v)&&!p.unfolded&&!p.back)&&(!p.revealed||p.opened),
 move(p,a){
  if(['fit','unfit'].includes(a.type)&&indexIn(a.index,3)){
   const fit=a.type==='fit';if(p.fitted[a.index]===fit||p.lid)return p;
   return {...p,fitted:p.fitted.map((v,i)=>i===a.index?fit:v),...(a.index===0&&!fit?{unfolded:false,back:false}:{}),...(a.index===1&&fit&&boundedPoint(a.offset,...DECODER_PAPER_RANGE)?{offset:decoderPaperOffset(a.offset)}:{}),...(a.index===2&&fit&&boundedPoint(a.position,...DECODER_MIRROR_RANGE)?{mirror:decoderMirrorPoint(a.position)}:{})};
  }
  if(a.type==='card-unfold'&&p.fitted[0])return {...p,unfolded:!p.unfolded};
  if(a.type==='card-flip'&&p.fitted[0])return {...p,back:!p.back};
  if(a.type==='ribbon-turn'&&p.fitted[1])return {...p,turned:!p.turned};
  if(a.type==='ribbon-flip'&&p.fitted[1])return {...p,stripBack:!p.stripBack};
  if(a.type==='paper-slide'&&p.fitted[1]&&boundedPoint(a.offset,...DECODER_PAPER_RANGE)){const offset=decoderPaperOffset(a.offset);return same(offset,p.offset)?p:{...p,offset};}
  if(a.type==='mirror-slide'&&p.fitted[2]&&boundedPoint(a.position,...DECODER_MIRROR_RANGE)){const mirror=decoderMirrorPoint(a.position);return same(mirror,p.mirror)?p:{...p,mirror};}
  if(a.type==='lid'&&p.opened)return {...p,lid:!p.lid,revealed:true,fitted:[false,false,false],unfolded:false,back:false};
  if(p.opened)return p;
  if(a.type==='set'&&indexIn(a.index,4)&&a.value===p.values[a.index])return p;
  return wheels.move(p,a);
 },
 solved:p=>p.revealed&&wheels.solved(p),
};
