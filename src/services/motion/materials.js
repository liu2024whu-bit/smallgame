import { ease } from './shared.js';

export const materialMotion = {
  capture: root => ({ liquid: [...root.querySelectorAll('.cocoa-liquid')].map(el => getComputedStyle(el).height), pour: [root.dataset.pourFrom, root.dataset.pourTo], chocolate: [...root.querySelectorAll('[data-chocolate-cell]')].map(el => el.className), packing: [...root.querySelectorAll('[data-pack-cell]')].map(el => el.dataset.packId) }),
  play(root, before) {
    root.querySelectorAll('[data-chocolate-cell]').forEach((el, i) => {
      if (before.chocolate[i] !== undefined && before.chocolate[i] !== el.className) el.animate([{ opacity: .2, scale: '.9' }, { opacity: 1, scale: '1' }], { duration: 220, easing: ease });
    });
    root.querySelectorAll('[data-pack-cell]').forEach((el, i) => {
      if (el.dataset.packId !== undefined && before.packing[i] !== el.dataset.packId) el.animate([{ opacity: .6, scale: '.94' }, { opacity: 1, scale: '1' }], { duration: 180, easing: ease });
    });
    let poured = false;
    root.querySelectorAll('.cocoa-liquid').forEach((el, i) => {
      const next = getComputedStyle(el).height, old = before.liquid[i];
      if (old !== undefined && old !== next) { poured = true; el.animate([{ height: old }, { height: next }], { duration: 650, easing: 'ease-in-out' }); }
    });
    if (poured && before.pour.every(value => value !== undefined)) {
      const [from, to] = before.pour.map(Number), stream = root.querySelector('.pour-stream'), x = [32,60,82], y = [27,32,37];
      if (stream) { stream.innerHTML = `<path d="M ${x[from]} ${y[from]} Q ${(x[from] + x[to]) / 2} ${Math.min(y[from], y[to]) - 12} ${x[to] - 6} ${y[to] + 8}"/>`; stream.animate([{ opacity: 0 }, { opacity: .8, offset: .2 }, { opacity: .8, offset: .8 }, { opacity: 0 }], { duration: 650, fill: 'forwards' }); }
    }
    delete root.dataset.pourFrom; delete root.dataset.pourTo;
  },
};
