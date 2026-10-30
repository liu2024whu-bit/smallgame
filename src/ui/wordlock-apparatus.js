import {WORD_CASE_PARTS,WORD_KEY_PARTS,WORD_WINDOWS,WORD_CABLE} from '../data/wordlock.js';
import {worldQuad,keyboardBed,boxFront,boxTop,boxFloor,drawerFront,drawerFloor,drawerSide} from '../puzzles/word-geometry.js';
import {atlas} from './dom.js';
import {mappedPlaneStyle,mappedPlaneMatrix,matrixStyle,planeMatrix,projectedPoint,polygon} from './raster-plane.js';
import {mechanicalKeyboard} from './mechanical-keyboard.js';
import {paintWordAssembly} from './word-assembly.js';

const FRONT=[[0,87],[1455,87],[1455,502],[0,502]],TOP=[[94,0],[1360,0],[1455,87],[0,87]];
const DRAWER_FRONT=[[0,120],[1135,120],[1135,206],[0,206]],FLOOR=[[90,58],[1045,58],[1090,117],[47,117]],SIDE=[[18,130],[268,130],[268,199],[18,199]];
const OPENING=[[43,332],[1405,332],[1405,450],[43,450]];
function gripPosition(amount,camera){
 const matrix=mappedPlaneMatrix(DRAWER_FRONT,worldQuad(drawerFront(amount),camera));
 const left=projectedPoint(matrix,[405,164.5]),right=projectedPoint(matrix,[730,164.5]);
 return `left:${(left[0]+right[0])/2}px;top:${(left[1]+right[1])/2}px;width:${right[0]-left[0]}px;`;
}
function mask(outer,hole){
 if(!hole)return polygon(outer);
 return 'polygon(evenodd,'+[...outer,outer[0],...hole,hole[0]].map(p=>p.map(n=>n.toFixed(3)+'px').join(' ')).join(',')+')';
}
function face(name,index,source,target,{children='',hole=null,clip=source,hidden=false,paint=true}={}){
 const [,,w,h]=WORD_CASE_PARTS.frames[index];
 return `<div class="word-face" data-word-face="${name}" ${hidden?'hidden':''} style="width:${w}px;height:${h}px;transform:${mappedPlaneStyle(source,target)};clip-path:${mask(clip,hole)}">${paint?atlas('wordlockCaseParts',index,{className:'word-face-paint'}):''}${children}</div>`;
}
function floorSource(from,to){const m=planeMatrix(FLOOR,1,1);return [[0,1-to],[1,1-to],[1,1-from],[0,1-from]].map(p=>projectedPoint(m,p));}
function sideSource(from,to){const m=planeMatrix(SIDE,1,1);return [[1-to,0],[1-from,0],[1-from,1],[1-to,1]].map(p=>projectedPoint(m,p));}
function drawerFaces(amount,camera,outside){
 const split=Math.max(0,Math.min(1,amount)),from=outside?0:split,to=outside?split:1;
 const suffix=outside?'out':'in',hidden=to-from<.00001;
 return [
  [`floor-${suffix}`,FLOOR,worldQuad(drawerFloor(amount),camera),floorSource(from,to),hidden],
  ...[-1,1].map(side=>[`side-${side}-${suffix}`,SIDE,worldQuad(drawerSide(amount,side),camera),sideSource(from,to),hidden]),
 ];
}
const drawerParts=(amount,camera,outside)=>drawerFaces(amount,camera,outside).map(([name,source,target,clip,hidden])=>face(name,1,source,target,{clip,hidden})).join('');
function letterWindows(progress,{passive=false,controls='whole'}={}){
 return WORD_WINDOWS.map(([x,y,w,h],i)=>{const letter=progress.values[i]<26?String.fromCharCode(65+progress.values[i]):'',tag=passive||progress.opened||controls==='keyboard'?'span':'button';return `<${tag} class="word-window ${!progress.opened&&!passive&&progress.cursor===i?'active':''}" ${tag==='button'?`data-cursor="${i}" data-lock-digit="${i}" data-focus="letter-${i}" aria-label="第${i+1}格${letter||'空白'}"`:''} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${letter||'·'}</${tag}>`;}).join('');
}
export const wordRoomFascia=(progress,camera)=>face('front',0,FRONT,worldQuad(boxFront(),camera),{children:letterWindows(progress,{passive:true}),paint:false});
export function wordApparatus(progress,camera,{amount=progress.opened?1:0,passive=false,controls='whole',contents=''}={}){
 const windows=letterWindows(progress,{passive,controls});
 const grip=passive||controls==='keyboard'?'':`<button class="word-physical-grip" style="${gripPosition(amount,camera)}" data-grip data-focus="word-grip" aria-label="${progress.opened?'抽屉已经打开':'拉开小抽屉'}" ${progress.opened?'disabled':''}></button>`;
 const [,,cw,ch]=WORD_KEY_PARTS.frames[9],cable=`<div class="word-cable" style="width:${cw}px;height:${ch}px;transform:${matrixStyle(worldQuad(WORD_CABLE,camera),cw,ch)}">${atlas('wordlockKeyParts',9,{className:'word-face-paint'})}</div>`;
 return `<div class="word-apparatus" data-word-amount="${amount}">${cable}${face('inner-floor',1,FLOOR,worldQuad(boxFloor(),camera))}${drawerParts(amount,camera,false)}${face('top',0,TOP,worldQuad(boxTop(),camera))}${face('front',0,FRONT,worldQuad(boxFront(),camera),{children:windows,hole:OPENING})}<div class="word-outside-tray">${drawerParts(amount,camera,true)}${contents}${face('drawer-front',1,DRAWER_FRONT,worldQuad(drawerFront(amount),camera))}${grip}</div>${mechanicalKeyboard(progress,worldQuad(keyboardBed(),camera),{passive:passive||controls==='case'})}</div>`;
}
export function paintWordDrawer(root,camera,amount){
 const apparatus=root.querySelector('.word-apparatus');if(!apparatus)return;
 // The letter fascia and keyboard stay mounted while only released/previewed
 // drawer faces change. Pointer capture and the native focus never move.
 for(const [name,source,target,clip,hidden]of [...drawerFaces(amount,camera,false),...drawerFaces(amount,camera,true)]){
  const el=apparatus.querySelector(`[data-word-face="${name}"]`);el.hidden=hidden;el.style.transform=mappedPlaneStyle(source,target);el.style.clipPath=polygon(clip);
 }
 const front=apparatus.querySelector('[data-word-face="drawer-front"]');
 front.style.transform=mappedPlaneStyle(DRAWER_FRONT,worldQuad(drawerFront(amount),camera));
 const grip=apparatus.querySelector('[data-grip]');if(grip)grip.style.cssText=gripPosition(amount,camera);
 apparatus.dataset.wordAmount=amount;
 paintWordAssembly(apparatus,camera,amount);
}
