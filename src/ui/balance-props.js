import {BALANCE_NAMES,BALANCE_RECORDS,BALANCE_POST,BALANCE_BEAM_RECT,BALANCE_BEAM_ORIGIN,BALANCE_PAN_SIZE,BALANCE_PAN_ORIGIN,BALANCE_NOTE,balanceRect as at,balanceLean,balanceSlotPoint,balanceSuspension,weightRect} from '../data/balance-apparatus.js';
import {ASSETS} from '../data/assets.js';
import {atlas,escape} from './dom.js';
import {matrixStyle} from './raster-plane.js';
const counterURL=new URL(ASSETS.balanceCounter,new URL('../../',import.meta.url)).href;

export const balanceWeight=(i,className='')=>atlas('balanceWeights',i,{className:'balance-weight-paint '+className});
export function balanceNote(quad=BALANCE_NOTE){
 const side=(items,x,y)=>items.map((item,i)=>`<span class="balance-note-weight" style="${at(weightRect(item,[x+(items.length===1?0:(i-.5)*40),y],30))}">${balanceWeight(item)}</span>`).join('');
 const label=BALANCE_RECORDS.map(r=>r.left.map(i=>BALANCE_NAMES[i]).join('与')+'，和'+r.right.map(i=>BALANCE_NAMES[i]).join('与')+'一样重').join('；');
 return `<span class="balance-note-ink" role="img" aria-label="${label}。两盘各三件。" style="transform:${matrixStyle(quad,210,200)}">${BALANCE_RECORDS.map((r,i)=>`${side(r.left,45,40+i*53)}<b style="top:${21+i*53}px">＝</b>${side(r.right,157,40+i*53)}`).join('')}<small>各三件</small></span>`;
}
export function balanceModel(p,{passive=false,done=false,reading=false,table}={}){
 const lean=balanceLean(p.places),tag=passive||done||reading?'span':'button';
 const pans=[0,1].map(pan=>{const end=balanceSuspension(pan,lean),rect=[end[0]-BALANCE_PAN_ORIGIN[0],end[1]-BALANCE_PAN_ORIGIN[1],...BALANCE_PAN_SIZE];return `<span class="balance-hanger" data-balance-pan="${pan}" style="${at(rect)};transform-origin:${BALANCE_PAN_ORIGIN.join('px ')}px">${atlas('balanceParts',1)}</span>`;}).join('');
 const lips=[0,1].map(pan=>{const end=balanceSuspension(pan,lean);return `<span class="balance-pan-front" data-balance-front="${pan}" style="${at([end[0]-BALANCE_PAN_ORIGIN[0],end[1]-BALANCE_PAN_ORIGIN[1],...BALANCE_PAN_SIZE])};transform-origin:${BALANCE_PAN_ORIGIN.join('px ')}px">${atlas('balanceParts',1)}</span>`;}).join('');
 const weights=p.places.map((slot,i)=>`<${tag} class="balance-weight" data-balance-weight="${i}" data-focus="balance-weight-${i}" style="${at(weightRect(i,slot<6&&table?table[slot]:balanceSlotPoint(slot,lean)))}" ${tag==='button'?`aria-label="${BALANCE_NAMES[i]}，${slot<6?'在木托里':slot<9?'在左盘':'在右盘'}"`:''}>${balanceWeight(i)}</${tag}>`).join('');
 const slots=passive||done||reading?'':Array.from({length:12},(_,slot)=>{const[x,y]=balanceSlotPoint(slot,lean);return `<button class="balance-slot" data-balance-slot="${slot}" data-focus="balance-slot-${slot}" style="left:${x}px;top:${y}px" tabindex="-1" aria-label="${slot<6?'木托':slot<9?'左盘':'右盘'}第${slot<6?slot+1:slot%3+1}处空位" ${p.places.includes(slot)?'disabled':''}></button>`;}).join('');
 const look=passive||reading?'':`<button class="balance-note-look" data-balance-view="paper" data-focus="balance-note" aria-label="近看称量纸" style="${at([94,468,286,232])}"></button>`;
 return `<div class="balance-model" data-balance-model data-balance-pose='${escape(JSON.stringify(p))}' ${table?`data-balance-table='${escape(JSON.stringify(table))}'`:''}>${passive?'':`<img class="balance-counter" src="${counterURL}" alt="猫形小天平仍在两本书上，旁边立着一张称量纸" draggable="false">`}${atlas('balanceParts',0,{className:'balance-post',style:at(BALANCE_POST)})}<span class="balance-beam" data-balance-beam style="${at(BALANCE_BEAM_RECT)}transform-origin:${BALANCE_BEAM_ORIGIN.join('px ')}px;transform:rotate(${lean}deg)">${atlas('balanceBeam',0)}</span>${pans}${weights}${lips}${passive?'':balanceNote()}${slots}${look}</div>`;
}
