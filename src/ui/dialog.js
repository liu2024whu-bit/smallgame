import {hydrateSceneMaterials} from '../services/scene-materials.js';
import { escape, icon } from './dom.js';
import { captureMotion, playMotion, motionAllowed } from '../services/motion.js';
import { captureDialogState, restoreDialogState } from './dialog-state.js';
import {createSourceViews} from '../services/source-views.js';
import {autoSaveStatus} from './auto-save.js';

export function createDialog(element, onClose) {
  const sourceViews=createSourceViews();
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
    show(panel, { preserveFocus = false, restore = null,save=null } = {}) {
      const movement = preserveFocus && element.open ? captureMotion(element) : null;
      const reading = preserveFocus ? captureDialogState(element) : restore;
      if (!element.open) returnFocus = document.activeElement;
      element.className = panel.className;
      element.innerHTML = `<header class="dialog-header"><h2 id="dialog-title" tabindex="-1" data-focus="dialog-heading">${escape(panel.title)}</h2><div>${save?autoSaveStatus(save.writable,save.info,'dialog-save-status'):''}<button class="icon-button" data-action="journal" aria-label="查看手账">${icon('book')}</button><button class="icon-button close-dialog" data-action="close" aria-label="返回">${icon('close')}</button></div></header><div class="dialog-body">${panel.html}</div>`;
      element.querySelectorAll('.solved-field [data-pmove]:not([data-return-fitting]),.solved-field [data-music-track]').forEach(button => { button.disabled = true; });
      if (!element.open) element.showModal();
      if (!reading?.focus) element.querySelector('#dialog-title')?.focus({ preventScroll: true });
      restoreDialogState(element, reading);
      sourceViews.refresh(element);
      hydrateSceneMaterials(element);
      playMotion(element, movement);
      if (!preserveFocus && motionAllowed()) element.querySelector('.dialog-body').animate([{ opacity: .45, translate: '0 3px' }, { opacity: 1, translate: '0 0' }], { duration: 180, easing: 'ease-out' });
    },
    hide() { sourceViews.clear();element.close(); returnFocus?.isConnected && returnFocus.focus({ preventScroll: true }); },
    element,
  };
}
