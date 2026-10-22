import { escape, icon } from './dom.js';
import { captureMotion, playMotion } from '../services/motion.js';

export function createDialog(element, onClose) {
  let returnFocus;
  element.addEventListener('cancel', event => { event.preventDefault(); onClose(); });
  element.addEventListener('click', event => { if (event.target === element) onClose(); });
  return {
    show(panel, { preserveFocus = false } = {}) {
      const movement = preserveFocus && element.open ? captureMotion(element) : null;
      const focusKey = preserveFocus ? document.activeElement?.dataset.focus : null;
      const settingKey = preserveFocus ? document.activeElement?.dataset.setting : null;
      const actionKey = preserveFocus ? document.activeElement?.dataset.action : null;
      const sideKey = preserveFocus ? document.activeElement?.dataset.side : null;
      const scroll = preserveFocus ? element.scrollTop : 0;
      if (!element.open) returnFocus = document.activeElement;
      element.className = panel.className;
      element.innerHTML = `<header class="dialog-header"><h2 id="dialog-title">${escape(panel.title)}</h2><div><button class="icon-button" data-action="journal" aria-label="查看手账">${icon('book')}</button><button class="icon-button close-dialog" data-action="close" aria-label="返回">${icon('close')}</button></div></header><div class="dialog-body">${panel.html}</div>`;
      element.querySelectorAll('.solved-field [data-pmove]').forEach(button => { button.disabled = true; });
      if (!element.open) element.showModal();
      if (focusKey) element.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`)?.focus({ preventScroll: true });
      else if (settingKey) element.querySelector(`[data-setting="${CSS.escape(settingKey)}"]`)?.focus({ preventScroll: true });
      else if (actionKey) element.querySelector(`[data-action="${CSS.escape(actionKey)}"]${sideKey ? `[data-side="${CSS.escape(sideKey)}"]` : ''}`)?.focus({ preventScroll: true });
      else if (!preserveFocus) element.querySelector('.close-dialog')?.focus({ preventScroll: true });
      if (!element.contains(document.activeElement)) element.querySelector('.close-dialog')?.focus({ preventScroll: true });
      element.scrollTop = scroll;
      playMotion(element, movement);
    },
    hide() { element.close(); returnFocus?.isConnected && returnFocus.focus({ preventScroll: true }); },
    element,
  };
}
