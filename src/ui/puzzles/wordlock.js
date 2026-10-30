import {viewControl} from '../view-control.js';
import {WORD_VIEWS,WORD_INPUT_CAMERA,WORD_SOURCE} from '../../data/wordlock.js';
import {access} from '../../core/state.js';
import {worldQuad,drawerFloor} from '../../puzzles/word-geometry.js';
import {wordDesk,wordDeskBackdrop,wordAssemblyReady} from '../word-desk.js';
import {wordAssemblyContents} from '../word-assembly.js';
import {wordReadingTable} from '../wordlock-papers.js';
import {matrixStyle} from '../raster-plane.js';
import {sceneSource} from '../scene-source.js';
import {escape} from '../dom.js';

export const wordReadingMode=mode=>['papers','alphabet','columns','rows'].includes(mode);
export function wordLockField(state,view={},readonly=false){
 const mode=Object.hasOwn(WORD_VIEWS,view.wordView)?view.wordView:'whole',camera=WORD_VIEWS[mode],reading=wordReadingMode(mode),p=state.progress.wordlock,hasBoard=state.collected.includes('board');
 const ready=access(state,'wordlock').ready&&!readonly,source=mode==='room';
 const assembly=wordAssemblyReady(state)?wordAssemblyContents(state,WORD_INPUT_CAMERA):'';
 const target=state.solved.includes('album')?'stitch':'album';
 const tray=p.opened&&['whole','case'].includes(mode)?`<button class="word-tray-open" data-action="puzzle" data-id="${target}" data-focus="word-tray-open" aria-label="看看抽屉里的${target==='album'?'画页':'装订纸边'}" style="transform:${matrixStyle(worldQuad(drawerFloor(1),WORD_INPUT_CAMERA),1600,1000)}"></button>`:'';
 const painting=reading?wordReadingTable({flipped:view.wordFlipped??view.flipped??false,boardBack:mode==='columns'||!!view.wordBoardBack,hasBoard,focus:mode}):source?sceneSource(view.sourcePicture?.()??'',WORD_SOURCE):wordDeskBackdrop(WORD_INPUT_CAMERA)+wordDesk(state,WORD_INPUT_CAMERA,{passive:!ready,controls:mode,contents:assembly})+tray;
 const labels=readonly?[['papers','纸上']]:[['whole','回到字匣'],['keyboard','键盘'],['papers','纸上']];
 const reply=!hasBoard&&reading?'托板好像还在窗边。':!reading&&p.attempts&&!p.opened?'还有一点紧。':'';
 return `<div class="word-lock-workbench" data-word-mode="${mode}" data-word-flipped="${!!(view.wordFlipped??view.flipped)}" data-word-board-back="${mode==='columns'||!!view.wordBoardBack}" data-word-readonly="${readonly}" data-word-state="${escape(JSON.stringify(p))}"><div class="word-viewport ${source?'word-source-viewport':''}" style="--word-aspect:${source?WORD_SOURCE.width/WORD_SOURCE.height*1672/941:camera[2]/camera[3]}">${source?painting:`<div class="word-lock-world" ${!reading&&ready&&!p.opened?'data-password-lock="letter" tabindex="0"':''} data-source-camera="${camera}">${painting}</div>`}</div><nav class="word-navigation" aria-label="画桌取景">${labels.map(([id,label])=>`${viewControl(`${label}`,`data-word-view="${id}" data-focus="word-view-${id}" aria-current="${mode===id}"`)}`).join('')}</nav><p class="word-reply" role="status">${reply}</p><span class="sr-only">字母键、退格和方向键可以编辑五格字匣。拉手也能用Enter和空格尝试。纸本、托板与薄纸可拿近，薄纸背面的字迹是反的。</span></div>`;
}
export function renderWordlock(p,context){return wordLockField(context.state,{...context.view,sourcePicture:()=>context.sourcePicture?.([], 'atelier')});}
