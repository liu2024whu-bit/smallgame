import {CHAPTER_NOTES} from '../data/story-notes.js';
import { PUZZLE_BY_ID } from '../data/puzzles.js';
import { ITEMS } from '../data/items.js';
import {sceneOpen} from '../core/exploration.js';
import { access, inventory } from '../core/state.js';
import { FINISH_REACTIONS } from '../data/feedback.js';
import { PUZZLE_TOOL_INPUTS } from '../data/tool-uses.js';
import {pendingRewards} from '../data/rewards.js';
import { PUZZLE_VIEWS } from './puzzles/index.js';
import { escape, icon, itemSprite, motif } from './dom.js';

const WAITING = {
  calibration: '桌上还少点东西。',
  postbox: '字轮藏在暗处。',
  wordlock: '压纸的夹层还没有松开。',
  books: '书脊间，还缺一张借阅签。',
  screen: '纸屏的边角，还暗着。',
  belt: '轮子和摇柄还没装上。',
  film: '胶片轮还没动。',
  flowers: '花架上，留着一个方口。',
  paperBack: '夹层里太暗了。',
  cloudGap: '花架挡住了后面的光。',
  album: '纸页还没凑齐。',
  stitch: '画页还散着，针路藏在纸背。',
  birthdayLock:'纸带还压着匣盖呢。',
};

const CLOSE_LOOK = new Set(['paper','cloud','calibration','postbox','wordlock','belt','flowers','chocolate','stitch','maze','melody','sweets','ribbons','birthdayLock','calendar']);

export function puzzlePanel(id, context) {
  const { state, view = {} } = context;
  const definition = PUZZLE_BY_ID[id];
  const availability = access(state, id);
  const completed = state.solved.includes(id);
  if (!availability.ready && !(definition.inspectWithoutTools&&!availability.waiting.length&&sceneOpen(state,definition.scene))) return { title: definition.title, className: 'inspect-dialog', html: `<div class="locked-object">${motif('leaf')}<p>${escape(WAITING[id] ?? '还少点东西。')}</p>${availability.missing.length ? `<div class="missing-tools">${availability.missing.map(tool => `<span>${escape(ITEMS[tool].name)}</span>`).join('')}</div>` : ''}<button class="primary-button" data-action="close">再找找</button></div>` };
  const hintCount = state.hints[id] ?? 0;
  const owned=inventory(state);
  const availableTools=[...new Set([...definition.tools,...(PUZZLE_TOOL_INPUTS[id]??[])])].filter(tool=>owned.includes(tool));
  const tools=availableTools.length ? `<details class="tools-fold" data-fold="tools"><summary>手边</summary><div class="workbench-tools" aria-label="手边的物件">${availableTools.map(tool => `<button data-action="arm-tool" data-id="${tool}" data-inventory-drag="${tool}" class="${state.selected===tool?'tool-armed':''}" title="${escape(ITEMS[tool].description)}">${itemSprite(ITEMS[tool].sprite)}${escape(ITEMS[tool].name)}</button>`).join('')}</div></details>` : '';
  const look=CLOSE_LOOK.has(id) ? `<button class="text-button workbench-look" data-action="workbench-look" aria-pressed="${!!view.closeLook}" aria-controls="puzzle-viewport">${icon(view.closeLook?'zoom-out':'zoom-in')}<span>${view.closeLook?'放远些':'凑近看'}</span></button>` : '';
  const field=`<div class="puzzle-viewport ${CLOSE_LOOK.has(id)&&view.closeLook?'close-look':''}" id="puzzle-viewport"><div class="puzzle-field ${completed?'solved-field':''}" role="group" aria-label="${escape(definition.instruction)}">${PUZZLE_VIEWS[id](state.progress[id], context)}</div></div>`;
  const hints=hintCount&&!completed ? `<aside class="hint-notes" id="hint-notes" aria-label="一点提醒">${definition.hints.slice(0,hintCount).map(hint=>`<p>${escape(hint)}</p>`).join('')}</aside>` : '';
  return { title:definition.title, className:`workbench-dialog puzzle-${id} ${completed?'puzzle-complete':''}`, html:`<div class="workbench-top">${tools}${look}</div>${field}${completed?completion(id,state):footer(state,id,hintCount)}${hints}` };
}

function footer(state,id,hintCount) {
  return `<div class="workbench-footer"><div><button class="quiet-button" data-action="undo" ${state.history[id]?.length?'':'disabled'}>${icon('undo')}退一步</button><button class="quiet-button" data-action="reset-puzzle">${icon('reset')}重来</button></div><button class="quiet-button hint-button" data-action="hint" aria-controls="hint-notes" aria-expanded="${hintCount>0}" ${hintCount>=3?'disabled':''}>${icon('hint')}${hintCount>=3?'就这几句啦':hintCount?'再聊一句':'一点提醒'}</button></div>`;
}

function completion(id,state) {
  const definition = PUZZLE_BY_ID[id];
  const pending=definition.rewardsInScene?[]:pendingRewards(state,id);
  const [line, mark] = FINISH_REACTIONS[id];
  return `<section class="completion-note finish-${definition.scene}" aria-live="polite"><div class="finish-caption">${motif(mark)}<h3>${escape(line)}</h3></div>${CHAPTER_NOTES[id]?`<p class="completion-afterword">${escape(CHAPTER_NOTES[id])}</p>`:''}${pending.length ? `<div class="reward-items">${pending.map(item => `<button data-action="collect-item" data-id="${item}" aria-label="拿起${escape(ITEMS[item].name)}">${itemSprite(ITEMS[item].sprite)}<span>${escape(ITEMS[item].name)}</span></button>`).join('')}</div>` : ''}<button class="text-button finish-return" data-action="close">再逛逛${icon('right')}</button></section>`;
}
