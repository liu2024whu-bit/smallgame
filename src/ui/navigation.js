import {SCENES} from '../data/scenes.js';
import {SCENE_NOTES} from '../data/story-notes.js';
import {sceneOpen} from '../core/exploration.js';
import {storyPosition} from '../core/story.js';
import {PUZZLES} from '../data/puzzles.js';
import {renderScenePicture} from './room.js';
import {access} from '../core/state.js';
import {icon,escape} from './dom.js';

export function navigationPanel(context){
  const state=context.state,ready=PUZZLES.filter(p=>p.scene===state.scene&&!state.solved.includes(p.id)&&access(state,p.id).ready);
  const {chapter}=storyPosition(state);
  return {title:'小屋里',className:'navigation-dialog',html:`<div class="room-folio"><p class="navigation-chapter">${escape(chapter)}</p><div class="room-route" aria-label="小屋的八处地方">${SCENES.map(scene=>{
    const open=sceneOpen(state,scene.id),current=state.scene===scene.id;
    return `<button class="room-route-stop ${current?'route-current':''} ${!open?'route-closed':''}" data-action="scene" data-id="${scene.id}" aria-label="${escape(scene.title)}${current?'，在这里':!open?'，门还关着':''}" aria-current="${current}"><span class="route-peek" aria-hidden="true">${open?`<span class="route-scene" style="left:${scene.id==='party'?7.79:0}%;width:${scene.id==='party'?84.42:100}%;"><span class="route-surface" style="height:${1600/(scene.id==='party'?1.5:1672/941)}px;">${renderScenePicture({...state,scene:scene.id})}</span></span>`:`<span class="route-fold">${icon('lock')}</span>`}</span><span class="route-place"><b>${escape(scene.title)}</b>${current?icon('leaf'):icon(open?'right':'lock')}</span><small>${current?'在这里':open?'':'门后'}</small></button>`;
  }).join('')}</div><p class="navigation-whisper">${escape(SCENE_NOTES[state.scene])}</p>${ready.length?`<div class="navigation-objects"><span>这边还有</span>${ready.slice(0,3).map(p=>`<button class="text-button" data-action="puzzle" data-id="${p.id}">${escape(p.title)}${icon('right')}</button>`).join('')}</div>`:`<p class="navigation-objects">这一边，先好好放着。</p>`}</div>`};
}
