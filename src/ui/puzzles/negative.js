import {viewControl} from '../view-control.js';
import {GAP_CAMERAS,GAP_COLORS,GAP_PORTS} from '../../data/cloud-gap.js';
import {GAP_STEP} from '../../puzzles/cloud-gap.js';
import {CLOUD_GEOMETRY} from '../../data/cloud.js';
import {ASSETS} from '../../data/assets.js';
import {inventory} from '../../core/state.js';
import {atlas,motif} from '../dom.js';
import {rasterStage} from '../raster-stage.js';
import {cloudFrontFace} from './cloud.js';

function evidence(done){return `<div class="gap-evidence" ${done?'':'data-copy-hidden aria-hidden="true"'} aria-label="云与玫瑰之间隔一页，星紧接在云之后">${atlas('gapPaperParts',6,{className:'gap-note-paper'})}<div class="gap-evidence-ink"><div>${motif('cloud')}<small>隔一页</small>${motif('rose')}</div><div>${motif('cloud')}${motif('star')}<small>挨着</small></div></div></div>`;}
function rear(p,{passive,done,painted=false}){
 return `<div class="gap-rear"><div class="gap-window-stack">${evidence(done)}<canvas width="512" height="512" data-gap-paper aria-label="三张剪纸的重叠缺口"></canvas></div>${painted?'':`<img class="gap-chassis" src="${ASSETS.cloudBack}" alt="同一只云景的纸夹背板" draggable="false">`}<img class="gap-cat-mark" alt="木边有一只蜷睡的小猫" draggable="false">${GAP_PORTS.map((x,i)=>`<span class="gap-strip" style="left:${x-9}px;height:${42+p.values[i]*GAP_STEP}px">${atlas('gapPaperParts',i+3)}</span><${passive?'span':'button'} class="gap-pull" ${passive?'':`data-gap-tab="${i}" data-focus="gap-tab-${i}" role="slider" aria-label="${GAP_COLORS[i]}纸带" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${p.values[i]}" aria-valuetext="第${p.values[i]+1}道折痕" aria-keyshortcuts="ArrowUp ArrowDown Home End" ${done?'disabled':''}`} style="left:${x}px;top:${770+p.values[i]*GAP_STEP}px">${atlas('gapPaperParts',i)}</${passive?'span':'button'}>`).join('')}${passive?'':'<button class="gap-window-look" data-action="gap-view" data-id="window" aria-label="看看纸窗后面的铅笔记号"></button><button class="gap-loading" data-action="gap-view" data-id="papers" hidden>纸片还在展开……</button>'}</div>`;
}
export function gapModel(state,{back=false,passive=false,room=false}={}){
 const p=state.progress.cloudGap,done=state.solved.includes('cloudGap');
 return `<div class="gap-model" data-gap-model data-gap-pose="${p.values.join(',')}" data-gap-state="${p.values.join(',')}" data-gap-back="${back}"><div class="gap-turntable" style="rotate:y ${back?180:0}deg"><div class="gap-face" ${back?'inert aria-hidden="true"':''}>${cloudFrontFace(state.progress.cloud,inventory(state),{painted:room})}</div><div class="gap-face gap-face-back" ${back?'':'inert aria-hidden="true"'}>${rear(p,{passive,done,painted:room})}</div></div></div>`;
}
export function renderNegative(p,{state,view={}}){
 const mode=Object.hasOwn(GAP_CAMERAS,view.gapView)?view.gapView:state.solved.includes('cloudGap')?'back':'front',camera=GAP_CAMERAS[mode],back=mode!=='front';
 return `<div class="gap-workbench"><div class="gap-viewport" style="--gap-aspect:${camera[2]/camera[3]}"><div class="gap-world" data-source-camera="${camera}"><img class="gap-environment" src="${ASSETS.cloudLedge}" alt="" draggable="false">${gapModel(state,{back,passive:mode==='window'})}</div></div><nav class="gap-navigation" aria-label="云景取景">${[['front','正面'],['back','背面'],['papers','纸带'],['window','纸窗']].map(([id,title])=>`${viewControl(`${title}`,`data-action="gap-view" data-id="${id}" aria-current="${mode===id}"`)}`).join('')}</nav><span class="sr-only">米白、浅蓝、浅绿三条纸带可以上下拖动，方向键逐道移动，Home与End到两端。缺口由纸层重叠形成，和木边的小猫是一套轮廓。纸窗可以拿近看。</span></div>`;
}
export function gapMiniature(state){
 const g=CLOUD_GEOMETRY.world,content=gapModel(state,{back:state.solved.includes('cloudGap'),passive:true,room:true});
 return `<div class="world-cloud-gap" style="left:${g.left}%;top:${g.top}%;width:${g.width}%" inert aria-hidden="true">${rasterStage(content,1536,1024)}</div>`;
}
