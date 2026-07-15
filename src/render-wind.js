import { ART, imageMarkup } from './assets.js';
import { WIND_RINGS, WIND_TARGET, windLetters } from './puzzles.js';
import { escapeHTML } from './runtime.js';
import { solvedBanner, stageHeader } from './view-helpers.js';

const CLUES = Object.freeze([
  Object.freeze({ label: '长枪护手', className: 'wind-hotspot--spear' }),
  Object.freeze({ label: '面具边缘', className: 'wind-hotspot--mask' }),
  Object.freeze({ label: '斗笠垂带', className: 'wind-hotspot--hat' }),
  Object.freeze({ label: '羽饰背面', className: 'wind-hotspot--feather' }),
]);
const WHEEL_LABELS = Object.freeze(['魈的长枪', '魈的面具', '流浪者的斗笠', '流浪者的羽饰']);

function character(asset, className, caption) {
  return `<figure class="${className}">${imageMarkup(asset, `${className}__image`)}<figcaption>${escapeHTML(caption)}</figcaption></figure>`;
}

function maskedLetters(state) {
  return WIND_TARGET.map((target, index) => state.windClues?.[index] && state.windRotations[index] === target
    ? WIND_RINGS[index][target]
    : '·').join('');
}

export function renderWind(state, chapter) {
  const found = state.windClues?.filter(Boolean).length ?? 0;
  return `${stageHeader(chapter, '两张立绘之间没有现成的转盘说明。先在长枪、面具、斗笠和羽饰附近找出四处压痕，再用上一页留下的年份校准风窗。')}
    <div class="character-scene character-scene--wind character-scene--searchable">
      ${character(ART.genshin.xiao, 'character-cutout character-cutout--xiao', '魈')}
      ${character(ART.genshin.wanderer, 'character-cutout character-cutout--wanderer', '流浪者')}
      <div class="wind-paper-trail" aria-hidden="true"><i></i><i></i><i></i></div>
      ${CLUES.map((clue, index) => `<button type="button" class="wind-hotspot ${clue.className} ${state.windClues?.[index] ? 'is-found' : ''}" data-wind-clue="${index}" aria-label="检查${escapeHTML(clue.label)}"><span>${state.windClues?.[index] ? '已发现' : '检查'}</span></button>`).join('')}
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
