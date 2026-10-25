function selectorFor(target, root) {
  if (!target || !root.contains(target)) return null;
  if(target.hasAttribute('data-music-seek'))return '[data-music-seek]';
  for (const key of ['focus', 'setting', 'action']) {
    if (target.dataset[key] === undefined) continue;
    const keys = key === 'action' ? [key, ...['side', 'id', 'index', 'tab'].filter(name => target.dataset[name] !== undefined)] : [key];
    return keys.map(name => `[data-${name}="${CSS.escape(target.dataset[name])}"]`).join('');
  }
  const fold = target.closest('details[data-fold]');
  return target.matches('summary') && fold ? `[data-fold="${CSS.escape(fold.dataset.fold)}"] > summary` : null;
}

// Returning from a clue restores only the reading position, never game progress.
export function centerWorkbenchViewport(viewport){
 const point=viewport?.querySelector('[data-look-point]')?.dataset.lookPoint.split(',').map(Number);
 if(point?.length!==2||!point.every(v=>Number.isFinite(v)&&v>=0&&v<=1))return false;
 viewport.scrollLeft=viewport.scrollWidth*point[0]-viewport.clientWidth/2;
 viewport.scrollTop=viewport.scrollHeight*point[1]-viewport.clientHeight/2;
 return true;
}
export function captureDialogState(element) {
  const viewport=element.querySelector('.puzzle-viewport');
  return {
    scroll: element.scrollTop,
    focus: selectorFor(document.activeElement, element),
    folds: [...element.querySelectorAll('details[data-fold]')].map(fold => [fold.dataset.fold, fold.open]),
    pan:viewport ? {x:viewport.scrollLeft,y:viewport.scrollTop} : null,
  };
}

export function restoreDialogState(element, saved) {
  for (const [key, open] of saved?.folds ?? []) {
    const fold = element.querySelector(`[data-fold="${CSS.escape(key)}"]`);
    if (fold) fold.open = open;
  }
  const focus = saved?.focus && element.querySelector(saved.focus);
  if (focus && !focus.disabled) focus.focus({ preventScroll: true });
  if (!element.contains(document.activeElement)) element.querySelector('.close-dialog')?.focus({ preventScroll: true });
  element.scrollTop = saved?.scroll ?? 0;
  const viewport=element.querySelector('.puzzle-viewport');
  if(viewport&&saved?.pan){viewport.scrollLeft=saved.pan.x;viewport.scrollTop=saved.pan.y;}
  else if(viewport?.classList.contains('close-look'))centerWorkbenchViewport(viewport);
}
