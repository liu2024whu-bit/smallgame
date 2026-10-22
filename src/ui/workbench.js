import { PUZZLE_BY_ID } from '../data/puzzles.js';
import { CLUES } from '../data/clues.js';
import { ITEMS } from '../data/items.js';
import { MEMORIES } from '../data/memories.js';
import { KEEPSAKES } from '../data/keepsakes.js';
import { access } from '../core/state.js';
import { PUZZLE_VIEWS } from './puzzles/index.js';
import { escape, icon, itemSprite, motif, character } from './dom.js';

const WAITING = {
  calibration: '灯座上，还空着两个槽。',
  books: '书脊上的字太浅了。',
  screen: '侧光没有照过来。',
  belt: '轮子和摇柄还没装上。',
  film: '胶片轮还没动。',
  flowers: '花架上，留着一个方口。',
  paperBack: '夹层里太暗了。',
  cloudGap: '花架挡住了后面的光。',
  album: '纸页还没凑齐。',
  stitch: '先把画页理好。',
};

export function puzzlePanel(id, context) {
  const { state } = context;
  const definition = PUZZLE_BY_ID[id];
  const availability = access(state, id);
  const completed = state.solved.includes(id);
  if (!availability.ready) return { title: definition.title, className: 'inspect-dialog', html: `<div class="locked-object">${motif('leaf')}<p>${escape(WAITING[id] ?? '还少点东西。')}</p>${availability.missing.length ? `<div class="missing-tools">${availability.missing.map(tool => `<span>${escape(ITEMS[tool].name)}</span>`).join('')}</div>` : ''}<button class="primary-button" data-action="close">再找找</button></div>` };
  const hintCount = state.hints[id] ?? 0;
  return { title: definition.title, className: `workbench-dialog puzzle-${id} ${completed ? 'puzzle-complete' : ''}`, html: `<div class="workbench-intro"><p>${escape(definition.instruction)}</p></div>${definition.tools.length ? `<div class="workbench-tools" aria-label="手边的物件">${definition.tools.map(tool => `<span title="${escape(ITEMS[tool].description)}">${itemSprite(ITEMS[tool].sprite)}${escape(ITEMS[tool].name)}</span>`).join('')}</div>` : ''}<div class="puzzle-field ${completed ? 'solved-field' : ''}">${PUZZLE_VIEWS[id](state.progress[id], context)}</div>${completed ? completion(id) : `<div class="workbench-footer"><div><button class="quiet-button" data-action="undo" ${state.history[id]?.length ? '' : 'disabled'}>${icon('undo')}退一步</button><button class="quiet-button" data-action="reset-puzzle">${icon('reset')}重来</button></div><button class="quiet-button hint-button" data-action="hint">${icon('hint')}${hintCount ? '再看一点' : '提示'}<small>${hintCount} / 3</small></button></div>`}${hintCount && !completed ? `<aside class="hint-notes">${definition.hints.slice(0, hintCount).map((hint, index) => `<p><span>${index + 1}</span>${escape(hint)}</p>`).join('')}</aside>` : ''}` };
}

function completion(id) {
  const definition = PUZZLE_BY_ID[id];
  const memory = MEMORIES[id];
  const gifts = KEEPSAKES.filter(gift => gift.puzzle === id);
  return `<section class="completion-note" aria-live="polite"><span class="completion-seal">${icon('check')}</span><h3>解开了</h3>${definition.rewards.length ? `<div class="reward-items">${definition.rewards.map(item => `<span>${itemSprite(ITEMS[item].sprite)}${escape(ITEMS[item].name)}</span>`).join('')}</div>` : ''}${gifts.length ? `<div class="keepsake-finds">${gifts.map(gift => `<button data-action="keepsake" data-id="${gift.id}" aria-label="${escape(gift.name)}">${character(gift.asset, gift.index, gift.columns, gift.rows, gift.name)}<span>${escape(gift.name)}</span><small>收好了</small></button>`).join('')}</div>` : ''}${CLUES[id] ? `<p>${escape(CLUES[id][1])}</p>` : ''}${memory ? `<details><summary>${escape(memory.title)}</summary><p>${escape(memory.text)}</p></details>` : ''}<button class="primary-button" data-action="close">${id === 'stitch' ? '去年轮灯' : '继续'}${icon('right')}</button></section>`;
}
