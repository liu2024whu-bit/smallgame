import { ITEMS } from '../data/items.js';
import { birthdayPrint, perforatedRibbon } from './puzzles/birthday-lock.js';
import { icon } from './dom.js';

export function birthdayToolPanel(id,context) {
  if(!['birthdayCard','birthdayRibbon'].includes(id))return null;
  const card=id==='birthdayCard',view=context.view;
  return {title:ITEMS[id].name,className:'inspect-dialog',html:`<div class="birthday-tool-inspect ${card?'inspect-birthday-card':'inspect-hole-ribbon'}">${card?birthdayPrint(!!view.back):perforatedRibbon(!!view.turned,'inspect-ribbon')}</div><p class="workshop-caption">${card?(view.back?'倒着写的呢。':'一弯月亮，陪一颗星。'):'小星星还留在剪口旁。'}</p><div class="item-options"><button class="text-button" data-action="${card?'mechanism-back':'paper-turn'}">${icon('undo')}${card?'翻过来':'转半圈'}</button><button class="text-button" data-action="take-tool" data-id="${id}">拿在手里</button></div>`};
}
