import {wordAssemblyPlanes} from '../puzzles/word-geometry.js';
import {atlas} from './dom.js';
import {matrixStyle,polygon} from './raster-plane.js';
import {bindingPapers,assemblySnips} from './assembly-papers.js';
import {albumPapers} from './album-papers.js';
import {ALBUM_SIZE} from '../data/album.js';
import {STITCH_SIZE} from '../data/stitch.js';

export function wordAssemblyContents(state,camera,{passive=true,stage=state.solved.includes('album')?'stitch':'album',view={}}={}){
 const planes=wordAssemblyPlanes(camera);
 const board=`<div class="word-assembly-board" style="transform:${matrixStyle(planes.board,897,1160)}">${atlas('gardenBoard',0,{className:'word-face-paint'})}</div>`;
 const binding=stage==='stitch',[width,height]=binding?STITCH_SIZE:ALBUM_SIZE;
 const papers=binding?bindingPapers(state,{view,passive}):assemblySnips({passive:true,album:true})+albumPapers(state.progress.album,{passive});
 const quad=planes[stage];
 return `<div class="word-assembly-model" data-assembly-stage="${stage}" style="clip-path:${polygon(planes.clip)}" ${passive?'inert aria-hidden="true"':''}>${board}<div class="word-assembly-content ${binding?'word-binding-content':''}" data-assembly-quad='${JSON.stringify(quad)}' style="width:${width}px;height:${height}px;transform:${matrixStyle(quad,width,height)}">${papers}</div></div>`;
}

export function paintWordAssembly(root,camera,amount){
 const model=root.querySelector('.word-assembly-model');if(!model)return;
 const planes=wordAssemblyPlanes(camera,amount),paper=model.querySelector('.word-assembly-content'),binding=model.dataset.assemblyStage==='stitch';
 model.style.clipPath=polygon(planes.clip);
 model.querySelector('.word-assembly-board').style.transform=matrixStyle(planes.board,897,1160);
 paper.style.transform=matrixStyle(planes[binding?'stitch':'album'],...(binding?STITCH_SIZE:ALBUM_SIZE));
 paper.dataset.assemblyQuad=JSON.stringify(planes[binding?'stitch':'album']);
}
