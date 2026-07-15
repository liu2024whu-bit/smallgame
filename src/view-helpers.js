import { BREATH_CHUNKS } from './puzzles.js';
import { BREATH_GLYPHS, BREATH_LABELS, escapeHTML, STAR_GLYPHS, STAR_LABELS } from './runtime.js';

export function orderControls(list, labels, glyphs, dataKey) {
  return `<div class="order-list">${list.map((id, index) => `
    <article class="order-card">
      <span class="order-card__glyph">${escapeHTML(glyphs[id])}</span>
      <span class="order-card__copy"><strong>${escapeHTML(labels[id])}</strong><small>${escapeHTML(dataKey === 'breathOrder' ? BREATH_CHUNKS[id] : '星章')}</small></span>
      <span class="order-card__actions">
        <button type="button" data-move-key="${dataKey}" data-index="${index}" data-direction="-1" aria-label="向前移动">↑</button>
        <button type="button" data-move-key="${dataKey}" data-index="${index}" data-direction="1" aria-label="向后移动">↓</button>
      </span>
    </article>`).join('')}</div>`;
}

export function flowerGlyph(name) {
  const map = { 雏菊: '✼', 樱花: '✿', 向日葵: '☼', 紫藤: '❋', 勿忘我: '❉', 桂花: '❊', 桔梗: '♧', 玫瑰: '❀' };
  return map[name] ?? '✤';
}

export function stageHeader(chapter, copy) {
  return `<header class="chapter-header"><div><p>${escapeHTML(chapter.motif)}</p><h1>${escapeHTML(chapter.title)}</h1></div><span>${escapeHTML(chapter.flower)}</span></header><p class="chapter-lead">${escapeHTML(copy ?? chapter.summary)}</p>`;
}

export function solvedBanner(chapter, extra = '') {
  return `<div class="solved-banner"><span>✓</span><div><small>RESTORED</small><strong>获得线索：${escapeHTML(chapter.reward)}</strong><p>${escapeHTML(extra || chapter.summary)}</p></div></div>`;
}

export function endingCopy(id) {
  if (id === 'future') return '种子没有立刻长高，只在枝头留下三个写着“待续”的花苞。';
  if (id === 'keepsake') return '花瓣会慢慢改变颜色，但翻回这一页时，仍能知道有人认真准备过这份祝福。';
  return '武汉与南京的灯没有连成直线，却在同一个夜晚亮着。各自向前时，仍愿意给对方留一点光，也已经足够。';
}
