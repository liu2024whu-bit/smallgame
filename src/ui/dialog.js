import { escape, icon } from './dom.js';
import { captureMotion, playMotion, motionAllowed } from '../services/motion.js';
import { captureDialogState, restoreDialogState } from './dialog-state.js';

export function createDialog(element, onClose) {
  let returnFocus, backdropPress = false;
  element.addEventListener('cancel', event => { event.preventDefault(); onClose(); });
  element.addEventListener('pointerdown', event => {
    const box=element.getBoundingClientRect();
    backdropPress=event.target===element&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom);
  });
  element.addEventListener('click', event => {
    if (event.target === element && backdropPress && Date.now()>=Number(element.dataset.suppressUntil??0)) onClose();
    backdropPress=false;
  });
  return {
    capture: () => captureDialogState(element),
    show(panel, { preserveFocus = false, restore = null } = {}) {
      const movement = preserveFocus && element.open ? captureMotion(element) : null;
      const reading = preserveFocus ? captureDialogState(element) : restore;
      if (!element.open) returnFocus = document.activeElement;
      element.className = panel.className;
      element.innerHTML = `<header class="dialog-header"><h2 id="dialog-title" tabindex="-1" data-focus="dialog-heading">${escape(panel.title)}</h2><div><button class="icon-button" data-action="journal" aria-label="查看手账">${icon('book')}</button><button class="icon-button close-dialog" data-action="close" aria-label="返回">${icon('close')}</button></div></header><div class="dialog-body">${panel.html}</div>`;
      element.querySelectorAll('.solved-field [data-pmove],.solved-field [data-sugar-cut],.solved-field [data-music-track],.solved-field [data-vessel]').forEach(button => { button.disabled = true; });
      if (!element.open) element.showModal();
      if (!reading?.focus) element.querySelector('#dialog-title')?.focus({ preventScroll: true });
      restoreDialogState(element, reading);
      playMotion(element, movement);
      if (!preserveFocus && motionAllowed()) element.querySelector('.dialog-body').animate([{ opacity: .45, translate: '0 3px' }, { opacity: 1, translate: '0 0' }], { duration: 180, easing: 'ease-out' });
    },
    hide() { element.close(); returnFocus?.isConnected && returnFocus.focus({ preventScroll: true }); },
    element,
  };
}
