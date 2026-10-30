import {flipCamera,FLIP_BLESSINGS} from '../../data/flip-apparatus.js';
import {flipModel} from '../flip-props.js';
export function renderFlips(p,{state,view={}}){
 const done=state.solved.includes('flips'),flower=done&&Number.isInteger(view.flipFlower)&&view.flipFlower>=0&&view.flipFlower<9?view.flipFlower:-1,camera=flipCamera(flower),[x,y,w,h]=camera;
 const details=flower>=0?`<div class="flip-after"><span>${FLIP_BLESSINGS[flower][0]}</span><p>${FLIP_BLESSINGS[flower][1]}</p><button class="text-button" data-flower-back data-focus="flower-back">木盒</button></div>`:'';
 return `<div class="flips-workbench ${flower>=0?'flip-close':''}"><div class="flip-viewport" style="--flip-ratio:${w}/${h};--flip-aspect:${w/h}"><div class="flip-world" data-source-camera="${camera}">${flipModel(p,{done,flower})}</div></div>${details}<span class="sr-only">九片木片有花面和叶背。轻压一片，它和上下左右相邻的木片一起翻过来；所有小花可以一起露出来。${done?'花开齐了，也可以靠近看看。':''}</span></div>`;
}
