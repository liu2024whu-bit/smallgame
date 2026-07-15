import { ART, imageMarkup } from './assets.js';
import { BREATH_CHUNKS } from './puzzles.js';
import { escapeHTML } from './runtime.js';

export const STAR_LABELS = Object.freeze({ hat: '巫师帽', halo: '短发光环', blossom: '樱花', rose: '玻璃罩玫瑰' });
export const BREATH_LABELS = Object.freeze({ water: '水柱', wind: '风柱', serpent: '蛇柱', wisteria: '紫藤' });

const STAR_ASSETS = Object.freeze({
  hat: ART.sky.wizard,
  halo: ART.sky.child,
  blossom: ART.flowers.cherry,
  rose: ART.flowers.rose,
});

const BREATH_ASSETS = Object.freeze({
  water: ART.demonSlayer.giyu,
  wind: ART.demonSlayer.sanemi,
  serpent: ART.demonSlayer.obanai,
  wisteria: ART.flowers.wisteria,
});

const FLOWER_ASSETS = Object.freeze({
  雏菊: ART.flowers.daisy,
  樱花: ART.flowers.cherry,
  向日葵: ART.flowers.sunflower,
  紫藤: ART.flowers.wisteria,
  勿忘我: ART.flowers.forgetMeNot,
  桂花: ART.flowers.sunflower,
  桔梗: ART.flowers.forgetMeNot,
  玫瑰: ART.flowers.rose,
});

function orderAsset(dataKey, id) {
  return dataKey === 'breathOrder' ? BREATH_ASSETS[id] : STAR_ASSETS[id];
}

export function orderControls(list, labels, _unusedGlyphs, dataKey) {
  return `<div class="order-list order-list--images">${list.map((id, index) => {
    const asset = orderAsset(dataKey, id);
    const detail = dataKey === 'breathOrder' ? BREATH_CHUNKS[id] : '翻到背面后可见一枚星点';
    return `<article class="order-card order-card--image">
      <figure class="order-card__visual">${imageMarkup(asset, 'order-card__image')}</figure>
      <span class="order-card__copy"><strong>${escapeHTML(labels[id])}</strong><small>${escapeHTML(detail)}</small></span>
      <span class="order-card__actions">
        <button type="button" data-move-key="${dataKey}" data-index="${index}" data-direction="-1" aria-label="向前移动">↑</button>
        <button type="button" data-move-key="${dataKey}" data-index="${index}" data-direction="1" aria-label="向后移动">↓</button>
      </span>
    </article>`;
  }).join('')}</div>`;
}

export function flowerGlyph(name) {
  const asset = FLOWER_ASSETS[name] ?? ART.flowers.rose;
  return imageMarkup(asset, 'flower-photo', `title="${escapeHTML(name)}"`);
}

export function stageHeader(chapter, copy) {
  const flower = FLOWER_ASSETS[chapter.flower] ?? ART.flowers.rose;
  return `<header class="chapter-header">
    <div><p>${escapeHTML(chapter.motif)}</p><h1>${escapeHTML(chapter.title)}</h1></div>
    <figure class="chapter-flower-photo">${imageMarkup(flower, 'chapter-flower-image')}</figure>
  </header><p class="chapter-lead">${escapeHTML(copy ?? chapter.summary)}</p>`;
}

export function solvedBanner(chapter, extra = '') {
  return `<div class="solved-banner"><span>✓</span><div><small>RESTORED</small><strong>获得线索：${escapeHTML(chapter.reward)}</strong><p>${escapeHTML(extra || chapter.summary)}</p></div></div>`;
}

export function endingCopy(id) {
  if (id === 'future') return '种子没有立刻长高，只在枝头留下三个写着“待续”的花苞。';
  if (id === 'keepsake') return '花瓣会慢慢改变颜色，但翻回这一页时，仍能知道有人认真准备过这份祝福。';
  return '武汉与南京的灯没有连成直线，却在同一个夜晚亮着。各自向前时，仍愿意给对方留一点光，也已经足够。';
}
