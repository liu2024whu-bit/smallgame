import {viewControl} from '../view-control.js';
import {BACK_TARGET,BACK_OPERATIONS} from '../../puzzles/paper-back.js';
import {PAPER_SEED,STAMPS,operate} from '../../puzzles/paper.js';
import {BACK_CASE as CASE,BACK_CAMERAS as CAMERAS,BACK_RECORD as RECORD,BACK_MIRROR as MIRROR} from '../../data/press-back.js';
import {PRESS_MARKS,PRESS_WORLD} from '../../data/press.js';
import {ASSETS} from '../../data/assets.js';
import {inventory} from '../../core/state.js';
import {atlas,itemSprite} from '../dom.js';
import {rasterStage} from '../raster-stage.js';
import {pressCase,inkRow,pressInk} from './press.js';

export function backLiner(p,{taken=false,passive=false}={}){
 const piece=(stamp,index)=>`<div class="back-stamp" data-back-stamp="${stamp}" data-back-index="${index}" ${passive?'':`role="slider" tabindex="${p.opened?-1:0}" aria-disabled="${p.opened}" aria-label="${STAMPS[stamp]}印的位置" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${index+1}" aria-keyshortcuts="ArrowLeft ArrowRight Home End" data-focus="back-stamp-${stamp}"`} style="left:${5.8+index*17.6}%">${atlas('pressBackParts',stamp+2,{className:'back-stamp-wood'})}${pressInk(stamp)}</div>`;
 const tag=passive?'span':'button';
 const page=taken?'':`<${tag} class="back-hidden-page" ${passive?'':`data-action="collect-item" data-id="pageD" data-focus="back-page" aria-label="拿起夹层里的星星画页" ${p.opened?'':'disabled'}`}>${itemSprite(10)}</${tag}>`;
 return `<div class="back-liner" data-back-open="${p.opened}" ${passive?'inert':''}>${page}<div class="back-floor-track"><div class="back-floor" data-back-floor style="transform:translateY(${p.opened?-100:0}%)">${atlas('pressBackParts',1,{className:'back-floor-art'})}<span class="back-original-label">原稿</span>${p.order.map(piece).join('')}${passive?'':`<button class="back-floor-grip" data-back-slide data-pmove='{"type":"submit"}' data-focus="back-slide" aria-label="向里推开夹层薄板" ${p.opened?'disabled':''}></button>`}</div></div></div>`;
}
const print=()=>`<small>印样</small>${inkRow(BACK_TARGET)}<span class="back-operation-sequence" aria-label="方框版，三角版，圆圈版">${BACK_OPERATIONS.map(op=>`<b>${PRESS_MARKS[op]}</b>`).join('')}</span>`;
function mirror(p,passive,origin=[0,0]){
 const tool=p.fitted[0],tag=passive?'span':'button';
 return `<div class="back-mirror" style="left:${MIRROR.x-origin[0]}px;top:${MIRROR.y-origin[1]}px;width:${MIRROR.width}px">${atlas('pressBackParts',7,{className:'back-mirror-rest'})}${tool?`<span class="back-mirror-prop">${itemSprite(2)}<span class="back-mirror-glass">${print()}</span></span>`:''}${passive?'':`<${tag} class="back-mirror-hit" ${tool?`data-pmove='{"type":"unfit","index":0}' data-return-fitting aria-label="取回纸边的小圆镜"`:'data-tool-target="press-back-mirror" data-action="use-direct" data-id="mirror" aria-label="把小圆镜放进纸边托座"'} data-focus="back-mirror"></${tag}>`}</div>`;
}
function record(passive,origin=[0,0]){return `<div class="back-record" style="left:${RECORD.x-origin[0]}px;top:${RECORD.y-origin[1]}px;width:${RECORD.width}px">${atlas('pressParts',3,{className:'press-slip-art'})}<span class="back-record-ink">${print()}</span>${passive?'':'<button class="back-paper-hit" data-action="back-view" data-id="mirror" aria-label="拿近看纸背的反印"></button>'}</div>`;}
export function pressBackMiniature(state){
 const owned=inventory(state),p=state.progress.paperBack,origin=[CASE.x,CASE.y];
 const content=`<div class="back-case-shell" style="left:0;top:0;width:${CASE.width}px">${pressCase(state.progress.paper,{done:true,miniature:true,painted:true,rewardTaken:true,drawerContents:backLiner(p,{taken:owned.includes('pageD'),passive:true})})}${record(true,origin)}${mirror(p,true,origin)}</div>`;
 return `<div class="world-press-back" style="left:${PRESS_WORLD.left}%;top:${PRESS_WORLD.top}%;width:${PRESS_WORLD.width}%" inert aria-hidden="true">${rasterStage(content,CASE.width,CASE.width*638/941)}</div>`;
}
export function backExamples(passive=false){return `<div class="back-examples">${[0,1,2].map(operation=>`<div class="back-test">${atlas('pressParts',3,{className:'press-slip-art'})}<span class="back-test-mark">${PRESS_MARKS[operation]}</span><span class="back-test-input">${inkRow(PAPER_SEED)}</span><span class="back-test-output">${inkRow(operate(PAPER_SEED,operation))}</span><span class="back-test-arrow" aria-hidden="true">↓</span></div>`).join('')}${passive?'':'<button data-action="back-view" data-id="samples" aria-label="拿近看三张旧试纸"></button>'}</div>`;}
export function backInspection(_,context){
 if(context.view?.backView!=='samples')return null;
 return {title:'旧试纸',className:'inspect-dialog back-reading-dialog',html:`<div class="back-samples-close">${backExamples(true)}</div><button class="text-button" data-action="back-view" data-id="whole">放回去</button>`};
}
export function renderPaperBack(p,{state,view={}}){
 const mode=Object.hasOwn(CAMERAS,view.backView)?view.backView:'whole',camera=CAMERAS[mode],owned=inventory(state);
 return `<div class="back-workbench" data-back-mode="${mode}" style="--back-aspect:${camera[2]/camera[3]}"><div class="back-viewport" style="aspect-ratio:${camera[2]}/${camera[3]}"><div class="back-world" data-source-camera="${camera}" data-back-attempts="${p.attempts}" data-back-fitted="${p.fitted[0]}"><img class="back-environment" src="${ASSETS.pressDesk}" alt="" draggable="false"><div class="back-case-shell" style="left:${CASE.x}px;top:${CASE.y}px;width:${CASE.width}px">${pressCase(state.progress.paper,{done:true,miniature:true,rewardTaken:true,drawerContents:backLiner(p,{taken:owned.includes('pageD'),passive:mode!=='tray'})})}${mode==='whole'?'<button class="back-drawer-look" data-action="back-view" data-id="tray" aria-label="拿近看看抽屉里的夹层"></button>':''}</div>${backExamples(mode!=='whole')}${record(mode!=='whole')}${mirror(p,!['whole','mirror'].includes(mode))}</div></div><nav class="back-navigation" aria-label="纸盒取景">${[['whole','纸盒'],['tray','夹层'],['mirror','纸背'],['samples','试纸']].map(([id,title])=>`${viewControl(`${title}`,`data-action="back-view" data-id="${id}" aria-current="${mode===id}"`)}`).join('')}</nav><output class="back-reply" role="status">${p.opened?(owned.includes('pageD')?'夹层空了。':'星星那页，还在里面。'):p.attempts?'还咬着一点。':''}</output><span class="sr-only">五枚木印可以拖动换位，或聚焦后用左右方向键、Home及End移动。纸背的印样为反印，圆镜可放进托座照正；试纸上方为原稿，下方为单次印后。薄板可向里推，或聚焦拉手后按回车尝试。</span></div>`;
}
