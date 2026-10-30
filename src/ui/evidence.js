import { escape } from './dom.js';
import {postalGrid} from './postal-papers.js';
import {wordLockField} from './puzzles/wordlock.js';

import {EVIDENCE_TITLES} from '../data/ciphers.js';
export {EVIDENCE_TITLES};

export function evidencePanel(id, context) {
 const reading=['alphabet','columns','rows'].includes(id);
 return {title:EVIDENCE_TITLES[id]??'纸页',className:`evidence-dialog evidence-${escape(id)} ${reading?'word-evidence-dialog':''}`,html:reading?wordLockField(context.state,{wordView:id,...context.view,sourcePicture:()=>context.sourcePicture?.([], 'atelier')},true):`<div class="postal-grid-evidence">${postalGrid()}</div>`};
}
