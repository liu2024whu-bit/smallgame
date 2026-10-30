import {ITEMS} from '../data/items.js';
import {giftPaper,perforatedRibbon} from './birthday-papers.js';
import {icon} from './dom.js';

export function birthdayToolPanel(id,{view={}}){
 if(!['birthdayCard','birthdayRibbon'].includes(id))return null;
 const card=id==='birthdayCard',unfolded=!!view.cardUnfolded;
 const art=card?giftPaper({unfolded,back:!!view.back}):perforatedRibbon(!!view.turned,!!view.stripBack);
 const caption=card?(unfolded&&view.back?'字是反着的。':'月亮印在折痕之间。'):'剪口旁边，印着一颗小星星。';
 return {title:ITEMS[id].name,className:'inspect-dialog',html:`<div class="birthday-tool-inspect ${card?'inspect-birthday-card':'inspect-hole-ribbon'}" data-tool-unfolded="${unfolded}">${art}</div><p class="workshop-caption">${caption}</p><div class="item-options">${card?`<button class="text-button" data-action="gift-card-unfold">${unfolded?'合起':'展开'}</button><button class="text-button" data-action="mechanism-back">${icon('undo')}另一面</button>`:'<button class="text-button" data-action="gift-strip-flip">翻面</button><button class="text-button" data-action="paper-turn">转半圈</button>'}<button class="text-button" data-action="take-tool" data-id="${id}">拿在手里</button></div>`};
}
