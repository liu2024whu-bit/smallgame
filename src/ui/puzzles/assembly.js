import {viewControl} from '../view-control.js';
import {WORD_ASSEMBLY_CAMERA as CAMERA,WORD_ASSEMBLY_VIEW as VIEW} from '../../data/wordlock.js';
import {wordDesk,wordDeskBackdrop} from '../word-desk.js';
import {wordAssemblyContents} from '../word-assembly.js';
import {stitchBack,stitchCamera,STITCH_CAMERAS} from '../../data/stitch.js';

function assembly(stage,{state,view={}}){
 const mode=stage==='stitch'?stitchCamera(state.progress.stitch,view):null,camera=mode?STITCH_CAMERAS[mode]:VIEW,contents=wordAssemblyContents(state,CAMERA,{passive:state.solved.includes(stage),stage,view});
 const turning=stage==='stitch'?`${['whole','seam'].map(id=>viewControl(id==='whole'?'整页':'针脚',`data-stitch-camera="${id}" data-focus="stitch-camera-${id}" aria-current="${mode===id}"`,id==='whole'?'zoom-out':'zoom-in')).join('')}${viewControl(`翻到纸的${stitchBack(state.progress.stitch,view)?'正':'背'}面`,'data-stitch-turn data-focus="stitch-turn"','undo')}${viewControl('旧针脚',`data-stitch-sample data-focus="stitch-sample-nav" aria-expanded="${!!view.stitchSample}"`,'book')}<span class="stitch-side-label">${stitchBack(state.progress.stitch,view)?'背面':'正面'}</span>`:'';
 return `<div class="word-assembly-workbench"><div class="word-viewport" style="--word-aspect:${camera[2]/camera[3]}"><div class="word-lock-world" data-source-camera="${camera}">${wordDeskBackdrop(CAMERA)}${wordDesk(state,CAMERA,{passive:true,notebook:false,contents})}</div></div><nav class="word-navigation">${turning}${stage==='album'&&state.solved.includes('album')?`${viewControl(`最后一针`,`data-action="puzzle" data-id="stitch"`)}`:''}</nav></div>`;
}
export const renderAlbum=(p,context)=>assembly('album',context);
export const renderStitch=(p,context)=>assembly('stitch',context);
