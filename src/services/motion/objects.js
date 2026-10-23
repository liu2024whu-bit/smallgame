import { ease } from './shared.js';

const OBJECTS = [
  ['.operation-piece', el => `operation:${el.querySelector('strong')?.textContent}`],
  ['.book-slot', el => `book:${el.querySelector('.illustrated-spine > span')?.textContent}`],
  ['.loose-stamp', el => `stamp:${el.querySelector('.motif')?.getAttribute('aria-label')}`],
  ['.loose-page', el => `page:${el.querySelector('.page-letter')?.textContent}`],
  ['.film-frame', el => `film:${el.querySelector('.frame-number')?.textContent}`],
  ['.drawer-unit button', (_, i) => `drawer:${i}`],
  ['.music-pin', (_, i) => `pin:${i}`],
  ['.flower-pot', (_, i) => `flower:${i}`],
  ['.scale-pan [data-weight], .weight-tray [data-weight]:not(.weight-away)', el => `weight:${el.dataset.weight}`],
];
const objects = root => OBJECTS.flatMap(([selector, key]) => [...root.querySelectorAll(selector)].map((el, i) => [key(el, i), el]));
export const objectMotion = {
  capture: root => new Map(objects(root).map(([key, el]) => [key, el.getBoundingClientRect()])),
  play(root, before) {
    for (const [key, el] of objects(root)) {
      const old = before.get(key), next = el.getBoundingClientRect();
      if (!old?.width || !next.width) continue;
      const dx = old.left - next.left, dy = old.top - next.top;
      if (Math.abs(dx) + Math.abs(dy) > 1) el.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], { duration: 380, easing: ease });
    }
  },
};
