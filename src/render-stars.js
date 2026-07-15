import { ART, imageMarkup } from './assets.js';
import { starCode } from './puzzles.js';
import { orderControls, solvedBanner, stageHeader, STAR_LABELS } from './view-helpers.js';

function portrait(asset, className, label) {
  return `<figure class="${className}">${imageMarkup(asset, `${className}__image`)}<figcaption>${label}</figcaption></figure>`;
}

export function renderStars(state, chapter) {
  const code = starCode(state.starOrder);
  const preview = code === '2020' ? code : code.replaceAll('0', '○').replaceAll('2', '••');

  return `${stageHeader(chapter, '最早的两段记忆来自云端。巫师帽与正太头出现在同一页；后来，正太头又与樱花头站在花瓣落下的海边。')}
    <div class="sky-memory-scene">
      <article class="sky-pair sky-pair--witch">
        <div class="sky-pair__figures">
          ${portrait(ART.sky.witch, 'sky-avatar sky-avatar--witch', '巫师帽')}
          ${portrait(ART.sky.shota, 'sky-avatar sky-avatar--shota-a', '正太头')}
        </div>
        <div class="sky-pair__copy"><small>FIRST PAIR</small><strong>巫师帽与正太头</strong><p>黑色帽檐靠近夜色，短发留在右侧的微光里。</p></div>
      </article>
      <article class="sky-pair sky-pair--sakura">
        <div class="sky-pair__figures">
          ${portrait(ART.sky.shota, 'sky-avatar sky-avatar--shota-b', '正太头')}
          ${portrait(ART.sky.sakura, 'sky-avatar sky-avatar--sakura', '樱花头')}
        </div>
        <div class="sky-pair__copy"><small>SECOND PAIR</small><strong>正太头与樱花头</strong><p>同一束短发再次出现，另一侧换成低双马尾与樱花发夹。</p></div>
      </article>
      <figure class="sky-rose-photo">${imageMarkup(ART.flowers.rose, 'sky-rose-photo__image')}<figcaption>被玻璃罩保护的玫瑰</figcaption></figure>
    </div>
    ${state.solved.stars ? solvedBanner(chapter, '四张照片按时间顺序装订后，背面的穿孔读作2020。') : `
      <div class="puzzle-card puzzle-card--photo-order">
        <p class="puzzle-riddle">帽檐最先出现；正太头紧随其后。樱花头晚于正太头，玫瑰被留在最后。把四张照片排成一条完整的星轨。</p>
        ${orderControls(state.starOrder, STAR_LABELS, null, 'starOrder')}
        <div class="result-window"><small>照片背面的穿孔</small><strong>${preview}</strong></div>
        <button class="primary-button" type="button" data-check-stars>压下四枚图钉</button>
      </div>`}`;
}
