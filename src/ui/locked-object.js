import {puzzleSource} from '../data/scene-details.js';
import {ITEMS} from '../data/items.js';
import {sceneSource} from './scene-source.js';
import {escape,motif} from './dom.js';

// A waiting mechanism remains the object the player just approached. This
// changes presentation only; access, inventory and progress stay in the core.
export function lockedObject(definition,context,availability,line){
 const source=context.sourcePicture&&puzzleSource(context.state,definition.id);
 const painting=source?`<div class="locked-scene" style="--source-aspect:${source.aspect}">${sceneSource(context.sourcePicture(),source.crop)}</div><span class="sr-only">${escape(source.scene)}，${escape(source.label)}。</span>`:motif('leaf');
 const missing=availability.missing.length?`<div class="missing-tools">${availability.missing.map(id=>`<span>${escape(ITEMS[id].name)}</span>`).join('')}</div>`:'';
 return {title:definition.title,className:'inspect-dialog',html:`<div class="locked-object ${source?'has-source':''}" ${source?`data-locked-source="${escape(context.state.scene)}" data-locked-target="${escape(definition.id)}"`:''}>${painting}<p>${escape(line)}</p>${missing}<button class="text-button" data-action="close">待会儿再来</button></div>`};
}
