import {viewControl} from '../view-control.js';
import {SWEETS_CAMERAS,SWEETS_ROOM,sweetsCamera} from '../../data/sweets.js';
import {sweetsModel} from '../sweets-props.js';
import {sceneSource} from '../scene-source.js';
import {renderScenePicture} from '../room.js';

export function renderSweets(p,{state,view={},sourcePicture}){
 const camera=sweetsCamera(p,view),frame=SWEETS_CAMERAS[camera],{x,y,scale}=SWEETS_ROOM;
 const picture=sourcePicture?.(['sweets'],'party')??renderScenePicture({...state,scene:'party'},{exclude:['sweets']});
 const background=sceneSource(picture,{left:x/1536*100,top:y/1024*100,width:scale*100,height:scale*100});
 return `<div class="sweets-workbench"><div class="sweets-viewport" style="--sweets-aspect:${frame[2]/frame[3]}"><div class="sweets-world" data-source-camera="${frame}">${background}${sweetsModel(p,{collected:state.collected.includes('birthdayCard')})}</div></div><nav class="sweets-navigation" aria-label="甜点取景">${viewControl(`桌边`,`data-sweet-view="whole" aria-current="${camera==='whole'}"`)}${p.served?'':`${viewControl(`近看`,`data-sweet-view="board" aria-current="${camera==='board'}"`)}`}</nav><p class="sweets-status" role="status"></p><span class="sr-only">二十件甜点，五种各四件。四份各有五种。横向细绳分上下，上下的两根纵向细绳独立移动。抓手可以拖动，方向键挪一格，Home和End移到两端，Escape放回。分好后，桌边的小匙可以将甜点分到四只碟里。碟子挪开后露出的贺卡可以单独拿起。</span></div>`;
}
