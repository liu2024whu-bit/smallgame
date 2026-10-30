import {sceneSource} from './scene-source.js';
export function deskSketchbook(context){
 return {title:'速写本',className:'inspect-dialog sketchbook-dialog',html:`<div class="desk-sketchbook-source">${sceneSource(context.sourcePicture([], 'desk'),{left:25,top:44,width:32,height:26})}</div><p class="hand-note">第一次生日，那本速写本。</p>`};
}
