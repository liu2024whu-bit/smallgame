import { ENDING_COPY, PUZZLE, TIMELINE_CARDS } from './content.js';

export const PROGRESS_KEYS = Object.freeze(['rootUnlocked', 'monogramSolved', 'flowersSolved', 'ringSolved', 'giftOpened']);

export function normalizeDigits(value, maxLength = 4) {
  return String(value ?? '').replace(/\D/g, '').slice(0, maxLength);
}

export function normalizeLetters(value, maxLength = 8) {
  return String(value ?? '').normalize('NFKC').replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, maxLength);
}

export function isValidRootCode(value) { return normalizeDigits(value) === PUZZLE.rootCode; }
export function isValidMonogram(value) { return normalizeLetters(value, 3) === PUZZLE.monogram; }
export function isValidAge(value) { return normalizeDigits(value, 2) === PUZZLE.age; }

export function isValidGift({ date, name, age, word } = {}) {
  return normalizeDigits(date) === PUZZLE.gift.date && normalizeLetters(name, 3) === PUZZLE.gift.name && normalizeDigits(age, 2) === PUZZLE.gift.age && normalizeLetters(word, 8) === PUZZLE.gift.word;
}

export function isTimelineSolved(order) {
  return Array.isArray(order) && order.length === PUZZLE.timelineOrder.length && order.every((id, index) => id === PUZZLE.timelineOrder[index]);
}

export function moveTimelineCard(order, fromIndex, direction) {
  if (!Array.isArray(order) || order.length !== PUZZLE.timelineOrder.length) throw new TypeError('Timeline order has an unexpected length.');
  if (!Number.isInteger(fromIndex) || fromIndex < 0 || fromIndex >= order.length) throw new RangeError('Timeline index is out of range.');
  if (direction !== -1 && direction !== 1) throw new RangeError('Timeline direction must be -1 or 1.');
  const target = fromIndex + direction;
  if (target < 0 || target >= order.length) return [...order];
  const next = [...order];
  [next[fromIndex], next[target]] = [next[target], next[fromIndex]];
  return next;
}

export function extractTimelineMonogram(order) {
  if (!Array.isArray(order) || order.length !== PUZZLE.timelineOrder.length) return '';
  const cardsById = new Map(TIMELINE_CARDS.map((card) => [card.id, card]));
  return PUZZLE.extractPositions.map((position) => cardsById.get(order[position - 1])?.letter ?? '').join('');
}

export function advanceFlowerSequence(sequence, progress, flowerId) {
  if (!Array.isArray(sequence) || sequence.length === 0) throw new TypeError('Flower sequence must be a non-empty array.');
  if (flowerId !== sequence[progress]) return Object.freeze({ progress: 0, status: 'wrong' });
  const nextProgress = progress + 1;
  return Object.freeze({ progress: nextProgress, status: nextProgress === sequence.length ? 'complete' : 'continue' });
}

export function isBondPuzzleSolved(assignments = {}) {
  return Object.entries(PUZZLE.bondAssignments).every(([tokenId, owner]) => assignments[tokenId] === owner);
}

export function getProgress(state = {}) {
  const completed = PROGRESS_KEYS.reduce((count, key) => count + (Boolean(state[key]) ? 1 : 0), 0);
  return Object.freeze({ completed, total: PROGRESS_KEYS.length, percentage: Math.round((completed / PROGRESS_KEYS.length) * 100) });
}

export function getStage(state = {}) {
  if (!state.rootUnlocked) return 'root';
  if (!state.monogramSolved) return 'timeline';
  if (!state.flowersSolved) return 'flowers';
  if (!state.ringSolved) return 'ring';
  if (!state.giftOpened) return 'gift';
  return 'ending';
}

const HINTS = Object.freeze({
  root: Object.freeze(['树根上的锁需要四位数字。先看看枝头那张只圈出一天的纸。', '日历写着“月在前，日在后”，月份和日期都要保留两位数。', '10 月 29 日写成四位数字就是 1029。']),
  timeline: Object.freeze(['把七张成长卡从最早排到现在；猫和狗身上分别藏着“取哪几张”和“从哪边读”。', '正确顺序是初三、高一、高二、高三、大一、大二、大三。再读第 2、5、7 张的小字母。', '按时间排好后，第 2、5、7 张依次是 L、X、Y。']),
  flowers: Object.freeze(['诗里每一句都在描述一种花语，顺序就是点击顺序。', '“初见、记得、向光、守约”分别对应雏菊、勿忘我、向日葵、桔梗。', '依次点击：雏菊 → 勿忘我 → 向日葵 → 桔梗。']),
  ring: Object.freeze(['树心里有十九圈完整年轮，还有一圈只差今天闭合。', '十九圈属于已经走过的岁月，新的一圈代表即将到来的年龄。', '答案是 20。']),
  gift: Object.freeze(['礼物盒需要回收四条主线答案：日期、名字、年龄和花朵拼出的英文词。', '答案分别来自树根锁、时间线、年轮和花语机关。', '输入 1029、LXY、20、BIRTHDAY。']),
  ending: Object.freeze(['主线已经结束；不同选择只改变祝福落下的方式，不会出现失败结局。', '树根旁的忍者手账是可选彩蛋，完成后会多出第三个结局。', '把橙色旋涡与迟到的钟归给带土，把银色雷光与遮住的眼归给卡卡西。']),
});

export function getHint(state = {}, level = 0) {
  const stage = getStage(state);
  const hints = HINTS[stage];
  const safeLevel = Math.max(0, Math.min(Number(level) || 0, hints.length - 1));
  return Object.freeze({ stage, level: safeLevel, text: hints[safeLevel], hasMore: safeLevel < hints.length - 1 });
}

export function deriveEnding(choice, bondSolved = false) {
  if (choice === 'side-by-side' && bondSolved) return ENDING_COPY.sideBySide;
  if (choice === 'keepsake') return ENDING_COPY.keepsake;
  return ENDING_COPY.future;
}
