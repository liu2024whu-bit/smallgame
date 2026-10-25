import {SKY_PAIRS} from '../data/sky.js';
import {skyPaperFigure} from './sky-figures.js';
import {icon} from './dom.js';

export function renderSkyPair(pair=0,{cover=false}={}){
 return `<span class="sky-diorama ${cover?'sky-cover':''}" data-sky-pair="${pair}" aria-label="窗边的两只光遇纸人">${[0,1].map(index=>skyPaperFigure(pair,index,{height:72,aspect:1.5,className:`sky-person sky-person-${index}`})).join('')}</span>`;
}

export function skyControls(pair=0){
 return `<div class="appearance-controls"><span aria-live="polite">${SKY_PAIRS[pair]?.name??SKY_PAIRS[0].name}</span><button class="text-button" data-action="sky-pair">${icon('repeat')}另一组</button></div>`;
}
