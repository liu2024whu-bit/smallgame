import { PUZZLE_BY_ID } from '../data/puzzles.js';
import { CLUES } from '../data/clues.js';
import { ITEMS } from '../data/items.js';
import { MEMORIES } from '../data/memories.js';
import { access } from '../core/state.js';
import { PUZZLE_VIEWS } from './puzzles/index.js';
import { escape, icon, itemSprite, motif } from './dom.js';

const WAITING = {
  calibration: '灯下有透片的定位槽，还有反射光线的支架。稿盒与窗边的纸景也许有合适的小工具。',
  books: '书脊之间像有细小的字，换个光照方向才能看清。',
  screen: '折屏背面的线路太浅。先给它一点侧光。',
  belt: '导槽里缺一枚轮子。棉线需要一根针带路，轴上还缺摇柄。看看书架和折屏的夹层。',
  film: '先让放映机转起来。',
  flowers: '花架的轮轴有一个方形接口。投影中的画页似乎记着它的高低。',
  paperBack: '稿盒底下的夹层需要另一束光，先看看窗边。',
  cloudGap: '纸景的另一层还没有透出光。花架也许挡住了它。',
  album: '四张画页、托板、页序和正反面的记录，都要收齐。它们散在这间书房里。',
  stitch: '先把四张画页排好，再开始装订。',
};

export function puzzlePanel(id, context) {
  const { state } = context;
  const definition = PUZZLE_BY_ID[id];
  const availability = access(state, id);
  const completed = state.solved.includes(id);
  if (!availability.ready) return { title: definition.title, className: 'inspect-dialog', html: `<div class="locked-object">${motif('leaf')}<p>${escape(WAITING[id] ?? '还缺一个可以放在这里的小工具。')}</p>${availability.missing.length ? `<div class="missing-tools">${availability.missing.map(tool => `<span>${escape(ITEMS[tool].name)}</span>`).join('')}</div>` : ''}<button class="primary-button" data-action="close">再去看看</button></div>` };
  const hintCount = state.hints[id] ?? 0;
  return { title: definition.title, className: `workbench-dialog puzzle-${id} ${completed ? 'puzzle-complete' : ''}`, html: `<div class="workbench-intro"><p class="eyebrow">${definition.optional ? '书房小机关 · 可随时玩' : '一页，慢慢来'}</p><p>${escape(definition.instruction)}</p></div>${definition.tools.length ? `<div class="workbench-tools" aria-label="已放好的工具">${definition.tools.map(tool => `<span title="${escape(ITEMS[tool].description)}">${itemSprite(ITEMS[tool].sprite)}${escape(ITEMS[tool].name)}</span>`).join('')}<small>工具已放好，可以重复使用</small></div>` : ''}<div class="puzzle-field ${completed ? 'solved-field' : ''}">${PUZZLE_VIEWS[id](state.progress[id], context)}</div>${completed ? completion(id) : `<div class="workbench-footer"><div><button class="quiet-button" data-action="undo" ${state.history[id]?.length ? '' : 'disabled'}>${icon('undo')}退一步</button><button class="quiet-button" data-action="reset-puzzle">${icon('reset')}复位</button></div><button class="quiet-button hint-button" data-action="hint">${icon('hint')}${hintCount ? '再一点提示' : '一点提示'}<small>${hintCount} / 3</small></button></div>`}${hintCount && !completed ? `<aside class="hint-notes">${definition.hints.slice(0, hintCount).map((hint, index) => `<p><span>${index + 1}</span>${escape(hint)}</p>`).join('')}</aside>` : ''}` };
}

function completion(id) {
  const definition = PUZZLE_BY_ID[id];
  const memory = MEMORIES[id];
  return `<section class="completion-note" aria-live="polite"><span class="completion-seal">${icon('check')}</span><h3>${definition.optional ? '这一处也亮了' : '这一页，收好了'}</h3>${definition.rewards.length ? `<div class="reward-items">${definition.rewards.map(item => `<span>${itemSprite(ITEMS[item].sprite)}${escape(ITEMS[item].name)}</span>`).join('')}</div>` : ''}${CLUES[id] ? `<p>${escape(CLUES[id][1])}</p>` : ''}${memory ? `<details><summary>${escape(memory.title)}</summary><p>${escape(memory.text)}</p></details>` : ''}<button class="primary-button" data-action="close">${id === 'stitch' ? '去看看年轮灯' : '收好，继续看看'}${icon('right')}</button></section>`;
}
