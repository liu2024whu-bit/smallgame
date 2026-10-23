import { ease, turnDelta } from './shared.js';

const turns = root => [...root.querySelectorAll('.dial-face')].map(el => parseFloat(el.style.getPropertyValue('--turn')) || 0);
const rings = root => [...root.querySelectorAll('[data-maze-rotor]')].map(el => Number(el.getAttribute('transform')?.match(/rotate\((\d+)/)?.[1] ?? 0));
export const mechanismMotion = {
  capture: root => ({ dials: turns(root), rings: rings(root), lean: root.querySelector('.scale-apparatus')?.style.getPropertyValue('--lean'), heights: [...root.querySelectorAll('.flower-pot')].map(el => el.style.top), arrived: !!root.querySelector('.maze-arrived') }),
  play(root, before) {
    const nextTurns = turns(root), nextRings = rings(root);
    root.querySelectorAll('.dial-face').forEach((el, i) => {
      const next = nextTurns[i], old = before.dials[i];
      if (old === undefined || next === old) return;
      const frames = [{ transform: `rotate(${next + turnDelta(old, next)}deg)` }, { transform: `rotate(${next}deg)` }];
      el.querySelector('.item-art')?.animate(frames, { duration: 320, easing: ease });
      if (el.closest('.light-console')) el.animate(frames, { duration: 320, easing: ease, pseudoElement: '::before' });
    });
    root.querySelectorAll('[data-maze-rotor]').forEach((el, i) => {
      const next = nextRings[i], old = before.rings[i];
      if (old !== undefined && old !== next) {
        el.style.transformOrigin = '210px 210px';
        el.animate([{ transform: `rotate(${next + turnDelta(old, next)}deg)` }, { transform: `rotate(${next}deg)` }], { duration: 300, easing: ease });
      }
    });
    const scale = root.querySelector('.scale-moving'), lean = root.querySelector('.scale-apparatus')?.style.getPropertyValue('--lean');
    if (scale && before.lean !== undefined && before.lean !== lean) scale.animate([{ transform: `rotate(${before.lean})` }, { transform: `rotate(${lean})` }], { duration: 620, easing: 'cubic-bezier(.3,1.45,.5,1)' });
    const heights = [...root.querySelectorAll('.flower-pot')].map(el => el.style.top);
    if (before.heights.length && heights.some((h, i) => h !== before.heights[i])) root.querySelectorAll('.garden-crank:focus .item-art').forEach(el => el.animate([{ rotate: '0deg' }, { rotate: '360deg' }], { duration: 400, easing: ease }));
    const ball = root.querySelector('.maze-arrived');
    if (ball && !before.arrived) {
      const walk = JSON.parse(ball.dataset.walk);
      ball.animate(walk.map(([x, y]) => ({ transform: `translate(${x}px,${y}px)` })), { duration: walk.length * 40, easing: 'linear' });
    }
  },
};
