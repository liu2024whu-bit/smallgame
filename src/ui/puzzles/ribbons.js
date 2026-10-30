import {viewControl} from '../view-control.js';
import {RIBBON_CAMERAS,RIBBON_ROOM,RIBBON_WORLD} from '../../data/ribbons.js';
import {decoderModel} from '../decoder-props.js';
import {boxCanTurn} from '../../data/birthday-lock.js';
import {ribbonModel} from '../ribbon-props.js';
import {sceneSource} from '../scene-source.js';
import {renderScenePicture} from '../room.js';

export function renderRibbons(progress,{state,view={},sourcePicture}){
 const p=progress,mode=state.progress.birthdayLock.lid||progress.removed.length===6&&!view.ribbonDoneInspect?'whole':view.ribbonView==='weave'?'weave':'whole';
 const done=p.removed.length===6,opened=done&&state.progress.birthdayLock.lid,original=RIBBON_CAMERAS[mode],camera=opened?[60,0,700,1024]:[original[0],original[1]+170,original[2],original[3]];
 const solid=done?`<div class="ribbon-decoder-assembly">${decoderModel(state.progress.birthdayLock,{back:p.back,passive:true})}</div>`:null;
 const picture=sourcePicture?.(['ribbons'],'party')??renderScenePicture({...state,scene:'party'},{exclude:['ribbons']});
 const background=sceneSource(picture,{left:RIBBON_ROOM[0]/1536*100,top:0,width:RIBBON_WORLD[0]/1536*100,height:100});
 return `<div class="ribbons-workbench"><div class="ribbons-viewport" style="--ribbons-aspect:${camera[2]/camera[3]}"><div class="ribbons-world" style="height:1024px" data-source-camera="${camera}">${background}<div class="ribbons-elevated">${ribbonModel(p,{collected:state.collected.includes('birthdayRibbon'),paperVisible:mode==='whole',solid})}</div></div></div><nav class="ribbons-navigation" aria-label="缎带取景">${viewControl(`盒边`,`data-ribbon-view="whole" aria-current="${mode==='whole'}"`)}${opened?'':`${viewControl(`近看`,`data-ribbon-view="weave" aria-current="${mode==='weave'}"`)}${viewControl(p.back?'翻回正面':'看看背面',`data-ribbon-flip ${boxCanTurn(state)?'':'disabled'}`,'undo')}`}${done?viewControl(`匣子`,`data-action="puzzle" data-id="birthdayLock"`):''}</nav><p class="ribbons-status" role="status"></p><span class="sr-only">六条纸带通过匣子的六处口，正反面交错。鱼尾是松开的末端，卷边在另一面。尾端可以沿纸带向外拖动，也可以轻点或按回车；被压住时会拉紧再放回。抽完后，孔带留在盒底纸套里，可以单独拿起。</span></div>`;
}
