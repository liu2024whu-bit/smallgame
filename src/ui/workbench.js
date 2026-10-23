import { PUZZLE_BY_ID } from '../data/puzzles.js';
import { ITEMS } from '../data/items.js';
import { access } from '../core/state.js';
import { FINISH_LINES } from '../data/feedback.js';
import { PUZZLE_VIEWS } from './puzzles/index.js';
import { escape, icon, itemSprite, motif } from './dom.js';

const WAITING = {
  calibration: '灯座上，还空着两个槽。',
  postbox: '字轮藏在暗处。',
  wordlock: '压纸的夹层还没有松开。',
  books: '书脊间，还缺一张借阅签。',
  screen: '侧光没有照过来。',
  belt: '轮子和摇柄还没装上。',
  film: '胶片轮还没动。',
  flowers: '花架上，留着一个方口。',
  paperBack: '夹层里太暗了。',
  cloudGap: '花架挡住了后面的光。',
  album: '纸页还没凑齐。',
  stitch: '画页还散着，针路藏在纸背。',
};

export function puzzlePanel(id, context) {
  const { state } = context;
  const definition = PUZZLE_BY_ID[id];
  const availability = access(state, id);
  const completed = state.solved.includes(id);
  if (!availability.ready) return { title: definition.title, className: 'inspect-dialog', html: `<div class="locked-object">${motif('leaf')}<p>${escape(WAITING[id] ?? '还少点东西。')}</p>${availability.missing.length ? `<div class="missing-tools">${availability.missing.map(tool => `<span>${escape(ITEMS[tool].name)}</span>`).join('')}</div>` : ''}<button class="primary-button" data-action="close">再找找</button></div>` };
  const hintCount = state.hints[id] ?? 0;
  return { title: definition.title, className: `workbench-dialog puzzle-${id} ${completed ? 'puzzle-complete' : ''}`, html: `${definition.tools.length ? `<details class="tools-fold" data-fold="tools"><summary>手边</summary><div class="workbench-tools" aria-label="手边的物件">${definition.tools.map(tool => `<button data-action="arm-tool" data-id="${tool}" data-inventory-drag="${tool}" class="${state.selected===tool?'tool-armed':''}" title="${escape(ITEMS[tool].description)}">${itemSprite(ITEMS[tool].sprite)}${escape(ITEMS[tool].name)}</button>`).join('')}</div></details>` : ''}<div class="puzzle-field ${completed ? 'solved-field' : ''}" role="group" aria-label="${escape(definition.instruction)}">${PUZZLE_VIEWS[id](state.progress[id], context)}</div>${completed ? completion(id) : `<div class="workbench-footer"><div><button class="quiet-button" data-action="undo" ${state.history[id]?.length ? '' : 'disabled'}>${icon('undo')}退一步</button><button class="quiet-button" data-action="reset-puzzle">${icon('reset')}重来</button></div><button class="quiet-button hint-button" data-action="hint" aria-controls="hint-notes" aria-expanded="${hintCount>0}" ${hintCount>=3?'disabled':''}>${icon('hint')}${hintCount>=3?'就这几句啦':hintCount?'再聊一句':'一点提醒'}</button></div>`}${hintCount && !completed ? `<aside class="hint-notes" id="hint-notes" aria-label="一点提醒">${definition.hints.slice(0, hintCount).map(hint => `<p>${escape(hint)}</p>`).join('')}</aside>` : ''}` };
}

function completion(id) {
  const definition = PUZZLE_BY_ID[id];
  return `<section class="completion-note" aria-live="polite"><span class="completion-seal">${icon('check')}</span><h3>${escape(FINISH_LINES[id])}</h3>${definition.rewards.length ? `<div class="reward-items">${definition.rewards.map(item => `<span>${itemSprite(ITEMS[item].sprite)}${escape(ITEMS[item].name)}</span>`).join('')}</div>` : ''}<button class="primary-button" data-action="close">再逛逛${icon('right')}</button></section>`;
}
