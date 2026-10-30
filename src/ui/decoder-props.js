import {DECODER_BODY,DECODER_LID,DECODER_GARDEN,BIRTHDAY_INPUTS} from '../data/birthday-lock.js';
import {atlas,escape} from './dom.js';
import {decoderBox,decoderPaperStack,decoderMirror} from './birthday-papers.js';
import {birthdayHardware} from './birthday-hardware.js';
import {ribbonSlits} from './ribbon-props.js';

export function decoderModel(p,{back=false,passive=false,selected=null,camera='whole'}={}){
 const armed=BIRTHDAY_INPUTS.indexOf(selected),input=armed>=0?armed:0;
 const inside=`<span class="decoder-box-base" data-decoder-base style="${decoderBox(DECODER_BODY)}">${atlas('birthdayBoxParts',0)}</span><span class="decoder-lid-inside" data-decoder-lid-inside style="${decoderBox(DECODER_LID)}">${atlas('birthdayBoxParts',1)}<span class="decoder-dedication">给二十岁的你</span></span><span class="decoder-garden" data-decoder-garden style="${decoderBox(DECODER_GARDEN)}">${atlas('birthdayBoxParts',2)}</span>`;
 const cover=`<span class="decoder-cover" data-decoder-cover style="${decoderBox(DECODER_BODY)}">${atlas('ribbonBodies',Number(back))}${!back?`<span class="decoder-slit-map">${ribbonSlits({back:false})}</span>`:''}</span>`;
 const papers=decoderPaperStack(p,{passive:!['paper','work'].includes(camera),selected:armed})+decoderMirror(p,{passive:!['paper','work'].includes(camera),selected:armed});
 const coverHit=camera==='whole'||camera==='paper'&&armed>=0?`<button class="decoder-cover-hit" ${p.opened?'data-decoder-latch':'data-decoder-view="paper"'} data-tool-target="birthday-fit:${input}" style="${decoderBox(camera==='paper'?[235,490,345,165]:[220,480,370,170])}" aria-label="${p.opened?'揭开匣盖':'近看匣盖'}" data-focus="decoder-paper"></button>`:'';
 const fitting=!p.lid&&!back?`<div class="decoder-fittings"><div><div>${passive?'':coverHit}${papers}</div></div></div>`:'';
 const hit=passive||back?'':p.lid?(camera==='open'?`<button class="decoder-garden-hit" data-decoder-view="garden" aria-label="近看匣子里的纸花" style="${decoderBox(DECODER_GARDEN)}"></button>`:''):camera==='paper'||camera==='whole'&&p.opened?'':`<button class="decoder-lock-hit" ${['lock','work'].includes(camera)?`data-decoder-latch data-focus="decoder-latch" aria-label="${p.opened?'揭开匣盖':'拨开搭扣'}"`:'data-decoder-view="lock" aria-label="近看字轮与搭扣"'} style="${decoderBox(['lock','work'].includes(camera)?[446,670,70,65]:[275,655,245,110])}"></button>`;
 const content=`${!back?inside:''}${cover}${!back?birthdayHardware(p,{interactive:!passive&&['lock','work'].includes(camera)&&!p.lid}):''}${fitting}${hit}`;
 return `<div class="decoder-model ${p.lid?'decoder-lid-open':''}" data-decoder-model ${armed>=0?'data-decoder-armed':''} data-decoder-pose='${escape(JSON.stringify(p))}' data-decoder-back="${back}" data-decoder-camera="${camera}">${!passive&&!p.lid&&!back?`<div class="decoder-drop-surface" data-tool-target="birthday-fit:0"><div data-tool-target="birthday-fit:1"><div data-tool-target="birthday-fit:2">${content}</div></div></div>`:content}</div>`;
}
