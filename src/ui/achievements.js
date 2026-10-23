import { achievements, canOpenEncore } from '../core/achievements.js';
import { motif, escape, character } from './dom.js';

export function achievementsPage(state) {
  const entries = achievements(state);
  return `<div class="little-records">${entries.map(entry => `<article class="little-record ${entry.complete ? 'record-complete' : ''}">${motif(entry.motif)}<div><h3>${escape(entry.title)}</h3><p>${escape(entry.intro)}</p><p class="record-detail">${escape(entry.complete?entry.text:entry.hint)}</p></div><small>${entry.hideCount?(entry.complete?'收好了':'慢慢找'):`${entry.count} / ${entry.total}`}</small></article>`).join('')}</div>${canOpenEncore(state) ? '<button class="encore-envelope" data-action="encore">还有一页，打开看看。</button>' : `<p class="record-footnote">${entries.every(entry => entry.complete) ? '等生日那页翻过，再回来看看。' : '还有些小东西没翻到。'}</p>`}`;
}

export function encorePanel(state) {
  if (!canOpenEncore(state)) return { title: '这一页', className: 'inspect-dialog', html: '<p class="empty-note">还没翻到这里。</p>' };
  return { title: '下次见', className: 'encore-dialog', html: `<div class="encore-scene"><div class="encore-window">${character('skyClouds', 1, 1, 3, '正太与樱花坐在云景里')}</div><div class="encore-pets">${character('pets', 1, 2, 2, '小猫')}${character('pets', 3, 2, 2, '小狗')}</div><div class="encore-bell">${character('gifts', 3, 3, 2, '风铃')}</div></div><div class="encore-note"><p>都找到了呀。</p><p>下次一起看电影，或者随便逛逛。<br>有新画也记得发给我看。</p><p>生日快乐，LXY。</p><button class="quiet-button" data-action="close">好</button></div>` };
}
