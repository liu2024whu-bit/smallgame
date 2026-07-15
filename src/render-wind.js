import { ART, imageMarkup } from './assets.js';
import { WIND_RINGS, WIND_TARGET, windLetters } from './puzzles.js';
import { escapeHTML } from './runtime.js';
import { solvedBanner, stageHeader } from './view-helpers.js';

const WHEEL_LABELS = Object.freeze(['魈的长枪', '魈的面具', '流浪者的斗笠', '流浪者的羽饰']);

function hotspot(index, className, label, found) {
  return `<button type="button" class="wind-hotspot ${className} ${found ? 'is-found' : ''}" data-wind-clue="${index}" aria-label="检查${escapeHTML(label)}"><span>${found ? '已发现' : '检查'}</span></button>`;
}

function characterPanel(asset, className, caption, hotspots) {
  return `<figure class="wind-character-panel ${className}">
    <div class="wind-character-panel__image-wrap">${imageMarkup(asset, 'wind-character-panel__image')}</div>
    ${hotspots}
    <figcaption>${escapeHTML(caption)}</figcaption>
  </figure>`;
}

function maskedLetters(state) {
  return WIND_TARGET.map((target, index) => state.windClues?.[index] && state.windRotations[index] === target
    ? WIND_RINGS[index][target]
    : '·').join('');
}

export function renderWind(state, chapter) {
  const found = state.windClues?.filter(Boolean).length ?? 0;
  const xiaoHotspots = [
    hotspot(0, 'wind-hotspot--spear', '长枪护手', state.windClues?.[0]),
    hotspot(1, 'wind-hotspot--mask', '面具边缘', state.windClues?.[1]),
  ].join('');
  const wandererHotspots = [
    hotspot(2, 'wind-hotspot--hat', '斗笠垂带', state.windClues?.[2]),
    hotspot(3, 'wind-hotspot--feather', '羽饰背面', state.windClues?.[3]),
  ].join('');

  return `${stageHeader(chapter, '风把两张立绘掀到书页两侧。魈的长枪与面具、流浪者的斗笠与羽饰，各自压住一枚尚未校准的观察窗。')}
    <div class="wind-character-grid">
      ${characterPanel(ART.genshin.xiao, 'wind-character-panel--xiao', '魈', xiaoHotspots)}
      ${characterPanel(ART.genshin.wanderer, 'wind-character-panel--wanderer', '流浪者', wandererHotspots)}
      <div class="wind-discovery-count">照片压痕 ${found}/4</div>
    </div>
    ${state.solved.wind ? solvedBanner(chapter, '四处压痕被找到以后，2020拆成四次转动，风窗最终停在EAST。') : `
      <div class="puzzle-card puzzle-card--wind">
        <p class="puzzle-riddle">每处压痕只对应一枚风窗。上一页得到的四位年份要按原顺序拆开，分别作为转动格数。</p>
        <div class="wind-wheels">${state.windRotations.map((rotation, index) => state.windClues?.[index] ? `
          <article class="is-discovered"><small>${WHEEL_LABELS[index]}</small><button type="button" data-turn-wind="${index}"><span>${WIND_RINGS[index][rotation]}</span><em>已转${rotation}格</em></button></article>` : `
          <article class="is-sealed"><small>第${index + 1}枚风窗</small><div class="wind-wheel-sealed">尚未在立绘中找到</div></article>`).join('')}</div>
        <div class="result-window"><small>已对齐的观察窗</small><strong>${maskedLetters(state)}</strong></div>
        <button class="primary-button" type="button" data-check-wind ${found === 4 ? '' : 'disabled'}>锁住风向</button>
      </div>`}`;
}

export function resolvedWindWord(state) {
  return windLetters(state.windRotations);
}
