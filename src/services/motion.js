// Measure before a view update, then animate the same physical object to its new place.
const OBJECTS = [
  ['.operation-piece', element => `operation:${element.querySelector('strong')?.textContent}`],
  ['.book-slot', element => `book:${element.querySelector('.illustrated-spine > span')?.textContent}`],
  ['.loose-stamp', element => `stamp:${element.querySelector('.motif')?.getAttribute('aria-label')}`],
  ['.loose-page', element => `page:${element.querySelector('.page-letter')?.textContent}`],
  ['.film-frame', element => `film:${element.querySelector('.frame-number')?.textContent}`],
  ['.drawer-unit button', (_, index) => `drawer:${index}`],
  ['.music-pin', (_, index) => `pin:${index}`],
  ['.flower-pot', (_, index) => `flower:${index}`],
  ['.cloud-layer .motif', (_, index) => `cloud:${index}`],
];
export const motionAllowed = () => !document.documentElement.classList.contains('reduce-motion') && !matchMedia('(prefers-reduced-motion: reduce)').matches;

function objects(root) {
  return OBJECTS.flatMap(([selector, identify]) => [...root.querySelectorAll(selector)].map((element, index) => [identify(element, index), element]));
}
export function captureMotion(root) {
  if (!motionAllowed()) return null;
  return {
    boxes: new Map(objects(root).map(([key, element]) => [key, element.getBoundingClientRect()])),
    dials: [...root.querySelectorAll('.dial-face')].map(element => parseFloat(element.style.getPropertyValue('--turn')) || 0),
    screen: [...root.querySelectorAll('.screen-leaf')].map(element => element.classList.contains('back-face')),
    thread: root.querySelector('.active-thread')?.getAttribute('points'),
    stitches: root.querySelectorAll('.stitch-lines line').length,
  };
}
export function playMotion(root, before) {
  if (!before || !motionAllowed()) return;
  for (const [key, element] of objects(root)) {
    const old = before.boxes.get(key), next = element.getBoundingClientRect();
    if (!old || !old.width || !next.width) continue;
    const dx = old.left - next.left, dy = old.top - next.top;
    if (Math.abs(dx) + Math.abs(dy) > 1) element.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }], { duration: 380, easing: 'cubic-bezier(.22,.75,.3,1)' });
  }
  root.querySelectorAll('.dial-face').forEach((element, index) => {
    const next = parseFloat(element.style.getPropertyValue('--turn')) || 0;
    const old = before.dials[index];
    if (old === undefined || old === next) return;
    const delta = ((old - next + 540) % 360) - 180;
    element.querySelector('.item-art')?.animate([{ transform: `rotate(${next + delta}deg)` }, { transform: `rotate(${next}deg)` }], { duration: 340, easing: 'cubic-bezier(.2,.7,.3,1)' });
  });
  root.querySelectorAll('.screen-leaf').forEach((element, index) => {
    if (before.screen[index] !== undefined && before.screen[index] !== element.classList.contains('back-face')) element.animate([{ transform: 'rotateY(20deg)', opacity: .45 }, { transform: 'rotateY(0deg)', opacity: 1 }], { duration: 290, easing: 'ease-out' });
  });
  const thread = root.querySelector('.active-thread');
  if (thread && thread.getAttribute('points') !== before.thread) drawLine(thread);
  const stitches = root.querySelectorAll('.stitch-lines line');
  if (stitches.length > before.stitches) drawLine(stitches[stitches.length - 1]);
}
function drawLine(element) {
  const length = element.getTotalLength();
  if (!length) return;
  element.animate([{ strokeDasharray: `${length} ${length}`, strokeDashoffset: length }, { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0 }], { duration: 450, easing: 'ease-out' });
}
