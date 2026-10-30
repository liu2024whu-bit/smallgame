import {DRAWER_LOCKS,DRAWER_TARGET} from '../puzzles/drawers.js';
import {DRAWER_SIZE,DRAWER_RECTS,drawerRect as at,drawerFrontPose,drawerRearPose,drawerCamPose} from '../data/drawer-apparatus.js';
import {atlas,character,escape} from './dom.js';
import {matrixStyle} from './raster-plane.js';

const letter=i=>String.fromCharCode(65+i);
function front(p,{passive,done}){
 return atlas('drawerFront',0,{className:'drawer-cabinet-paint'})+DRAWER_RECTS.map((r,i)=>{
  const [x,y,w,h]=r,tag=passive||done?'span':'button';
  const face=`<span class="drawer-moving-face" data-drawer-motion="face-${i}" style="${at(r)}transform:${drawerFrontPose(p.open[i])};z-index:${p.open[i]?40-i:5+i}">${atlas('drawerFront',i+1)}</span>`;
  const reward=done&&i===2?`<span class="drawer-sweet-packet" style="${at([x+w*.3,y+3,w*.4,w*.4*.96])}">${character('drawerSnacks',0,1,1,'包着的小零食')}</span>`:'';
  const inspect=done&&!passive&&i===2?`<button class="drawer-grip drawer-done-inspect" data-action="keepsake" data-id="snacks" aria-label="看看屉里的小零食" style="${at([x,y,w,h+30])};z-index:70"></button>`:'';
  return `<span class="drawer-recess" style="${at(r)}">${atlas('drawerBodyParts',1)}</span>${reward}${face}${inspect}<${tag} class="drawer-grip" data-drawer-grip="${i}" data-focus="drawer-${i}" style="${at(r)}transform:${drawerFrontPose(p.open[i])};z-index:${70-i}" ${tag==='button'?`aria-label="${letter(i)}抽屉，${p.open[i]?'已拉开':'合着'}" aria-keyshortcuts="ArrowUp ArrowDown Home End Enter Space"`:''}></${tag}>`;
 }).join('');
}
function rear(p,{passive,done}){
 const rows=DRAWER_RECTS.map((r,i)=>{
  const [x,y,w,h]=r,locks=DRAWER_LOCKS[i],segment=locks.length===1?276:145,start=locks.length===1?77:78,gap=locks.length===1?0:28;
  const tongues=locks.map(([driver,clear],j)=>{
   const left=start+j*(segment+gap),edge=left+segment,satisfied=p.open[driver]===clear;
   return `<span class="drawer-rear-tongue" data-drawer-motion="tongue-${i}-${j}" style="${at([left,y+37,segment,segment*114/475])}transform:${drawerRearPose(p.open[i])}">${atlas('drawerHardware',0)}</span><span class="drawer-lock-cam" data-drawer-stop="${i}" data-stop-clear="${satisfied}" data-driver="${driver}" data-drawer-motion="cam-${i}-${j}" style="${at([edge-16,y-10,36,36*335/151])}transform:${drawerCamPose(satisfied)}">${atlas('drawerHardware',1)}</span><span class="drawer-driver" style="left:${edge-35}px;top:${y-1}px" aria-hidden="true">${letter(driver)}<i data-drawer-preview-driver="${driver}" data-drawer-motion="driver-${i}-${j}" style="transform:translateX(${p.open[driver]*7}px)">${atlas('drawerFront',driver+1)}</i></span>`;
  }).join('');
  const tag=passive||done?'span':'button';
  return tongues+`<${tag} class="drawer-grip drawer-rear-grip" data-drawer-grip="${i}" data-focus="drawer-${i}" style="${at([x,y,w,h])}" ${tag==='button'?`aria-label="${letter(i)}抽屉的后舌，${p.open[i]?'已拉开':'合着'}" aria-keyshortcuts="ArrowLeft ArrowRight Home End Enter Space"`:''}></${tag}>`;
 });
 return atlas('drawerBodyParts',0,{className:'drawer-cabinet-paint'})+rows.join('');
}
export function drawerModel(p,{back=false,passive=false,done=false,goal=false}={}){
 const labels=DRAWER_RECTS.map(([x,y,w,h],i)=>`<span class="drawer-row-letter" style="left:${x-31}px;top:${y+h*.42}px">${letter(i)}</span>`).join('');
 return `<div class="drawer-cabinet ${goal?'drawer-sample-cabinet':''}" data-drawer-model data-drawer-side="${back?'back':'front'}" data-drawer-pose="${escape(JSON.stringify(p))}" style="width:${DRAWER_SIZE[0]}px;height:${DRAWER_SIZE[1]}px" ${passive?'inert aria-hidden="true"':''}>${back?rear(p,{passive,done}):front(p,{passive,done})}${labels}</div>`;
}
export function drawerGoal(quad){
 return `<span class="drawer-sample-plane" style="transform:${matrixStyle(quad,45,51)}"><span class="drawer-sample" aria-label="柜侧的小样：A与B合着，C与D拉开"><span class="drawer-sample-paper">${atlas('pressParts',3)}</span><span class="drawer-sample-title">小样</span><span class="drawer-sample-model">${drawerModel({open:DRAWER_TARGET},{passive:true,goal:true})}</span>${DRAWER_RECTS.map(([,y,,h],i)=>`<small class="drawer-sample-state" style="top:${12+(y+h*.42)*.05273}px">${DRAWER_TARGET[i]?'开':'合'}</small>`).join('')}</span></span>`;
}
export function paintDrawerPose(model,open){
 for(let i=0;i<4;i++){
  const face=model.querySelector(`[data-drawer-motion="face-${i}"]`);if(face)face.style.transform=drawerFrontPose(open[i]);
  const hit=model.querySelector(`[data-drawer-grip="${i}"]`);if(hit&&model.dataset.drawerSide==='front')hit.style.transform=drawerFrontPose(open[i]);
  for(const el of model.querySelectorAll(`[data-drawer-motion^="tongue-${i}-"]`))el.style.transform=drawerRearPose(open[i]);
 }
 for(const el of model.querySelectorAll('[data-drawer-stop]')){
  const i=Number(el.dataset.drawerStop),j=Number(el.dataset.drawerMotion.split('-').at(-1)),[driver,clear]=DRAWER_LOCKS[i][j];el.style.transform=drawerCamPose(clear?open[driver]:1-open[driver]);
 }
 for(const el of model.querySelectorAll('[data-drawer-preview-driver]'))el.style.transform=`translateX(${open[Number(el.dataset.drawerPreviewDriver)]*7}px)`;
}
