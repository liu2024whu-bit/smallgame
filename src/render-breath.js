import { ART, imageMarkup } from './assets.js';
import { BREATH_CHUNKS, breathWord } from './puzzles.js';
import { BREATH_LABELS, orderControls, solvedBanner, stageHeader } from './view-helpers.js';

const PORTRAITS = Object.freeze([
  Object.freeze({ id: 'water', asset: ART.demonSlayer.giyu, title: '富冈义勇', role: '水柱' }),
  Object.freeze({ id: 'wind', asset: ART.demonSlayer.sanemi, title: '不死川实弥', role: '风柱' }),
  Object.freeze({ id: 'serpent', asset: ART.demonSlayer.obanai, title: '伊黑小芭内', role: '蛇柱' }),
  Object.freeze({ id: 'wisteria', asset: ART.flowers.wisteria, title: '紫藤', role: '花页' }),
]);

function previewWord(order) {
  return order.map((id) => {
    const chunk = BREATH_CHUNKS[id] ?? '';
    return chunk ? `${chunk[0]}·` : '··';
  }).join('');
}

export function renderBreath(state, chapter) {
  return `${stageHeader(chapter, '三张角色立绘与一张紫藤照片各自占据独立页槽。水柱、风柱、蛇柱和花页之间的先后关系，决定照片背面字片的读取顺序。')}
    <div class="breath-gallery">
      ${PORTRAITS.map((portrait) => `<figure class="breath-card breath-card--${portrait.id}">
        <div class="breath-card__image-wrap">${imageMarkup(portrait.asset, 'breath-card__image')}</div>
        <figcaption><small>${portrait.role}</small><strong>${portrait.title}</strong></figcaption>
      </figure>`).join('')}
    </div>
    ${state.solved.breath ? solvedBanner(chapter, '水柱、风柱、蛇柱与紫藤按关系排好后，四段字片组成BIRTHDAY。') : `
      <div class="puzzle-card puzzle-card--photo-order">
        <p class="puzzle-riddle">水柱在风柱之前；蛇柱必须紧贴紫藤左侧；风柱不能站在最后。上一页得到的东方向仍然决定最终读取顺序。</p>
        ${orderControls(state.breathOrder, BREATH_LABELS, null, 'breathOrder')}
        <div class="result-window"><small>尚未完全显影的字片</small><strong>${previewWord(state.breathOrder)}</strong></div>
        <button class="primary-button" type="button" data-check-breath>装订这一页</button>
      </div>`}`;
}

export function resolvedBreathWord(state) {
  return breathWord(state.breathOrder);
}
