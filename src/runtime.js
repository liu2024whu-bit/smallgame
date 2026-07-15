import { CHAPTERS } from './content.js';
import { createStore } from './store.js';

export const store = createStore();
export const app = document.querySelector('#app');
export const dialog = document.querySelector('#dialog');
export const dialogBody = document.querySelector('#dialogBody');
export const toast = document.querySelector('#toast');
export const STAR_LABELS = Object.freeze({ hat: '巫师帽', halo: '光环', blossom: '樱花', rose: '玻璃罩玫瑰' });
export const STAR_GLYPHS = Object.freeze({ hat: '⌁', halo: '○', blossom: '✿', rose: '♢' });
export const BREATH_LABELS = Object.freeze({ water: '水纹', wind: '风痕', serpent: '蛇线', wisteria: '紫藤' });
export const BREATH_GLYPHS = Object.freeze({ water: '≈', wind: '〽', serpent: '∿', wisteria: '❋' });
export const DIRECTIONS = Object.freeze(['北', '东', '南', '西']);
let toastTimer = null;
let audioContext = null;

export function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

export function tone(frequency = 420, duration = 0.08, delay = 0) {
  const state = store.get();
  if (!state.sound) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioContext ||= new AudioContextClass();
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.03, audioContext.currentTime + delay + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + delay + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime + delay);
  oscillator.stop(audioContext.currentTime + delay + duration + 0.03);
}

export function successSound() {
  tone(392, 0.11);
  tone(523, 0.13, 0.08);
  tone(659, 0.16, 0.17);
}

export function errorSound() {
  tone(180, 0.13);
  tone(145, 0.16, 0.08);
}

export function chapterUnlocked(chapter, state) {
  if (chapter.order === 0) return true;
  const previous = CHAPTERS[chapter.order - 1];
  return Boolean(state.solved[previous.id]);
}

export function solvedCount(state) {
  return CHAPTERS.filter((chapter) => state.solved[chapter.id]).length;
}

export function nextChapterId(id) {
  const current = CHAPTERS.find((chapter) => chapter.id === id);
  return CHAPTERS.find((chapter) => chapter.order === current.order + 1)?.id ?? id;
}

export function chapterById(id) {
  return CHAPTERS.find((chapter) => chapter.id === id) ?? CHAPTERS[0];
}

export function openDialog(content, className = '') {
  dialogBody.innerHTML = content;
  dialog.className = `dialog ${className}`.trim();
  dialog.showModal();
  requestAnimationFrame(() => dialog.querySelector('button, input, select')?.focus({ preventScroll: true }));
}

export function closeDialog() {
  if (dialog.open) dialog.close();
}

export function solve(id, message) {
  store.solve(id);
  store.set({ active: nextChapterId(id) });
  successSound();
  showToast(message);
  closeDialog();
}
