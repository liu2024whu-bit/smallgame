import { ASSETS } from '../data/assets.js';
import {ASSET_LAYOUTS} from '../data/asset-layouts.js';
import {RUBBING_PENCIL,RUBBING_SHEET} from '../data/campus-rubbing.js';
import {atlas,escape} from './dom.js';

function pencil(){
 const p=RUBBING_PENCIL;
 return `<span class="rubbing-pencil" data-rubbing-pencil data-pose="0" aria-hidden="true" style="left:${p.x}%;top:${p.y}%;--pen-width:${p.width}cqw;--pen-angle:${p.angle}deg">${ASSET_LAYOUTS.campusPencil.anchors.map(([x,y],i)=>atlas('campusPencil',i,{className:'pencil-pose pose-'+i,style:`--tip-x:${x*100}%;--tip-y:${y*100}%;`})).join('')}</span>`;
}

export function studyDesk(context) {
  const complete=context.state.activities.includes('campus:desk');
  const sheet=Object.entries(RUBBING_SHEET).map(([key,value])=>`${key}:${value}%`).join(';');
  const paths=(context.view.rubbing?.strokes??[]).map(d=>`<path d="${escape(d)}"></path>`).join('');
 return `<div class="campus-study-desk" data-rubbing="${complete}"><img src="${ASSETS.campusDesk}" alt="窗边的书桌，铅笔搁在拓纸旁，书和仙林明信片放在一边" draggable="false"><span class="study-book-label">读书札记</span><div class="rubbing-sheet" style="${sheet}" aria-label="铅笔拓纸" role="group"><svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="rubbing-fiber" filterUnits="userSpaceOnUse" x="-1" y="-1" width="102" height="62"><feGaussianBlur stdDeviation=".25"/></filter><mask id="rubbing-mask" maskUnits="userSpaceOnUse"><rect width="100" height="60" fill="${complete?'white':'black'}"/><g data-rubbing-strokes filter="url(#rubbing-fiber)" fill="none" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${paths}</g></mask></defs><image href="${ASSETS.campusRubbing}" width="100" height="60" preserveAspectRatio="xMidYMid meet" mask="url(#rubbing-mask)"/><g data-rubbing-tones fill="none" stroke="#737164" stroke-width="7" opacity=".07" stroke-linecap="round">${paths}</g></svg>${complete?'<span class="rubbing-signature">仙林</span>':''}</div>${pencil()}</div><div class="rubbing-tools"><span>${complete?'图书馆的轮廓拓出来了。':'铅笔就在旁边。'}</span>${complete?'':'<button class="text-button" data-rubbing-key aria-label="用键盘拓一行纸，重复几次可拓完整">拓一拓</button>'}</div>`;
}
