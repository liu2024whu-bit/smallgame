import { NOTEBOOK } from './content.js';

export const STAR_ORDER = Object.freeze(['hat', 'halo', 'blossom', 'rose']);
export const STAR_DIGITS = Object.freeze({ hat: '2', halo: '0', blossom: '2', rose: '0' });
export const BREATH_ORDER = Object.freeze(['water', 'wind', 'serpent', 'wisteria']);
export const BREATH_CHUNKS = Object.freeze({ water: 'BI', wind: 'RT', serpent: 'HD', wisteria: 'AY' });
export const WIND_TARGET = Object.freeze([2, 0, 2, 0]);
export const WIND_RINGS = Object.freeze([
  Object.freeze(['S', 'T', 'E', 'A']),
  Object.freeze(['A', 'E', 'S', 'T']),
  Object.freeze(['A', 'T', 'S', 'E']),
  Object.freeze(['T', 'E', 'A', 'S']),
]);

export function normalizeDigits(value, maxLength = 12) {
  return String(value ?? '').replace(/\D/g, '').slice(0, maxLength);
}

export function normalizeLetters(value, maxLength = 16) {
  return String(value ?? '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, maxLength);
}

export function decodeBirth(catFound, dogFound, input) {
  if (!catFound || !dogFound) return false;
  return normalizeDigits(input, 4) === '2006';
}

export function starCode(order) {
  return order.map((id) => STAR_DIGITS[id] ?? '').join('');
}

export function isStarSolved(order) {
  return JSON.stringify(order) === JSON.stringify(STAR_ORDER) && starCode(order) === '2020';
}

export function windLetters(rotations) {
  return WIND_RINGS.map((ring, index) => ring[((rotations[index] ?? 0) % ring.length + ring.length) % ring.length]).join('');
}

export function isWindSolved(rotations) {
  return JSON.stringify(rotations) === JSON.stringify(WIND_TARGET) && windLetters(rotations) === 'EAST';
}

export function breathWord(order) {
  return order.map((id) => BREATH_CHUNKS[id] ?? '').join('');
}

export function isBreathSolved(order) {
  return JSON.stringify(order) === JSON.stringify(BREATH_ORDER) && breathWord(order) === 'BIRTHDAY';
}

export function isFilmSolved(steps) {
  return Boolean(steps?.red && steps?.invert && steps?.cat);
}

export function postmarkCode(wuhanRotation, nanjingRotation) {
  return wuhanRotation === 1 && nanjingRotation === 3 ? '1029' : '';
}

export function ringAge(values) {
  const raw = [values?.root, values?.branch, values?.crown];
  if (raw.some((value) => value == null || String(value).trim() === '')) return NaN;
  const [birth, met, now] = raw.map(Number);
  if (![birth, met, now].every(Number.isFinite)) return NaN;
  return (met - birth) + (now - met);
}

export function isRingSolved(values) {
  return String(values?.root) === '2006' && String(values?.branch) === '2020' && String(values?.crown) === '2026' && ringAge(values) === 20;
}

export function finalRibbonCode() {
  return '06102920';
}

export function isGiftSolved(values) {
  return normalizeDigits(values?.ribbon, 8) === finalRibbonCode()
    && normalizeLetters(values?.name, 3) === 'LXY'
    && normalizeLetters(values?.word, 8) === 'BIRTHDAY';
}

export function isNotebookSolved(orange, silver) {
  return JSON.stringify(orange) === JSON.stringify(NOTEBOOK.orange)
    && JSON.stringify(silver) === JSON.stringify(NOTEBOOK.silver);
}

export function moveItem(list, index, direction) {
  const next = [...list];
  const target = index + direction;
  if (index < 0 || target < 0 || index >= next.length || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
