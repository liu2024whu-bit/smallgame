import {viewControl} from '../view-control.js';
import {DECODER_ROOM,DECODER_WORLD,DECODER_CAMERAS,decoderCamera,decoderStage,boxCanTurn} from '../../data/birthday-lock.js';
import {decoderModel} from '../decoder-props.js';
import {sceneSource} from '../scene-source.js';
import {renderScenePicture} from '../room.js';
import {moveButton} from '../dom.js';

export function renderBirthdayLock(p,{state,view={},sourcePicture}){
 const mode=decoderCamera(p,view),camera=DECODER_CAMERAS[mode],back=state.progress.ribbons.back;
 const picture=sourcePicture?.(['birthdayLock'],'party')??renderScenePicture({...state,scene:'party'},{exclude:['birthdayLock']});
 const background=sceneSource(picture,{left:DECODER_ROOM[0]/1536*100,top:0,width:DECODER_WORLD[0]/1536*100,height:100});
 const views=p.lid?[[mode==='garden'?'open':'garden',mode==='garden'?'回到匣里':'看看纸花']]:[[mode==='work'?'whole':'work',mode==='work'?'看看整匣':'回到纸上']];
 const nav=views.map(([id,label])=>viewControl(label,`data-decoder-view="${id}" data-focus="decoder-view-${id}" aria-current="${mode===id}"`)).join('');
 const manipulators=!back&&['paper','work'].includes(mode)&&!p.lid?`<div class="decoder-paper-options">${p.fitted[0]?moveButton(p.unfolded?'合起贺卡':'展开贺卡',{type:'card-unfold'},{key:'decoder-unfold'})+moveButton('贺卡翻面',{type:'card-flip'},{key:'decoder-card-flip'}):''}${p.fitted[1]?moveButton('孔带翻面',{type:'ribbon-flip'},{key:'decoder-strip-flip'})+moveButton('孔带转半圈',{type:'ribbon-turn'},{key:'decoder-strip-turn'}):''}</div>`:'';
 const turn=p.lid?viewControl('合上','data-decoder-close','zoom-out'):boxCanTurn(state)?viewControl(back?'翻回匣子正面':'看看匣子背面','data-action="birthday-box-turn"','undo'):'';
 return `<div class="decoder-workbench" data-decoder-stage="${decoderStage(p)}"><div class="decoder-viewport" style="--decoder-aspect:${camera[2]/camera[3]}"><div class="decoder-world" data-source-camera="${camera}">${background}${decoderModel(p,{back,selected:state.selected,camera:mode})}</div></div><nav class="decoder-navigation" aria-label="生日匣取景">${back?'':nav}${turn}</nav>${manipulators}<p class="decoder-status" role="status">${back?'':p.opened&&!p.lid?'搭扣松开了。':p.attempts&&!p.opened?'还扣着呢。':''}</p><span class="sr-only">三折纸卡可以展开、翻面。孔带可以移动、翻面或转半圈。圆镜可拖动，方向键也能微调；镜中反映的是纸上的实际内容。四枚字轮支持拖动、方向键和数字输入。搭扣松开后，匣盖还可以揭起。</span></div>`;
}
