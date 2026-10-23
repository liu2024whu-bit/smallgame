import { drawLine } from './shared.js';

const FACES = [
  ['.screen-leaf',el=>el.classList.contains('back-face')],
  ['.page-face',el=>el.querySelector('small')?.textContent],
  ['.face-selectors button',el=>el.querySelector('span')?.textContent],
  ['.flip-tile',el=>el.classList.contains('tile-back')],
  ['.postcard',el=>el.classList.contains('postcard-back')],
];
const faces = root => new Map(FACES.flatMap(([selector,value])=>[...root.querySelectorAll(selector)].map((el,i)=>[`${selector}:${el.dataset.focus??i}`,value(el)])));
const digits = root => [...root.querySelectorAll('.wheel-drum b, .letter-windows button')].map(el => el.textContent);
export const paperMotion = {
  capture: root => ({ faces: faces(root), thread: root.querySelector('.active-thread')?.getAttribute('points'), stitches: root.querySelectorAll('.stitch-lines line').length, digits: digits(root), attempts: Number(root.querySelector('[data-password-lock]')?.dataset.attempts), prints: root.querySelector('.comparison')?.innerHTML, opened: !!root.querySelector('.lock-open'), campus:root.querySelector('[data-campus-stop]')?.dataset.campusStop, wind:parseFloat(root.querySelector('.encore-handle')?.style.getPropertyValue('--wind')) }),
  play(root, before) {
    for (const [selector,value] of FACES) root.querySelectorAll(selector).forEach((el, i) => {
      const old=before.faces.get(`${selector}:${el.dataset.focus??i}`);
      if (old !== undefined && old !== value(el)) el.animate([{ transform: 'rotateY(-75deg)', opacity: .3 }, { transform: 'rotateY(0)', opacity: 1 }], { duration: 330, easing: 'ease-out' });
    });
    root.querySelectorAll('.wheel-drum b, .letter-windows button').forEach((el, i) => {
      if (before.digits[i] !== undefined && before.digits[i] !== el.textContent) el.animate([{ translate: '0 -25%', opacity: .3 }, { translate: '0 0', opacity: 1 }], { duration: 150, easing: 'ease-out' });
    });
    const lock=root.querySelector('[data-password-lock]');
    if(lock&&Number(lock.dataset.attempts)>before.attempts&&!lock.classList.contains('lock-open')){
      lock.animate([{translate:'0px'},{translate:'-3px'},{translate:'3px'},{translate:'0px'}],{duration:240});
      root.querySelector('.postal-latch, .type-special')?.animate([{ translate: '0 0' }, { translate: '0 4px', offset: .4 }, { translate: '0 0' }], { duration: 240 });
    }
    if (!before.opened && root.querySelector('.lock-open')) root.querySelector('.lock-painting')?.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.13)', offset: .5 }, { filter: 'brightness(1)' }], { duration: 600 });
    const thread = root.querySelector('.active-thread');
    if (thread && thread.getAttribute('points') !== before.thread) drawLine(thread);
    const stitches = root.querySelectorAll('.stitch-lines line');
    if (stitches.length > before.stitches) drawLine(stitches[stitches.length - 1]);
    const print = root.querySelector('.comparison');
    if (print && before.prints !== undefined && before.prints !== print.innerHTML) print.animate([{ opacity: .45 }, { opacity: 1 }], { duration: 300 });
    const campus=root.querySelector('[data-campus-stop]');
    if(campus&&before.campus&&campus.dataset.campusStop!==before.campus)campus.animate([{opacity:.3},{opacity:1}],{duration:420,easing:'ease-out'});
    const handle=root.querySelector('.encore-handle');
    const wind=parseFloat(handle?.style.getPropertyValue('--wind'));
    if(handle&&Number.isFinite(before.wind)&&wind!==before.wind)handle.querySelector('.item-art').animate([{rotate:`${before.wind}deg`},{rotate:`${wind}deg`}],{duration:380,easing:'ease-out'});
  },
};
