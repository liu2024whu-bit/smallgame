// A gesture never changes saved state until release. Cancel and rerender are safe.
export function pointerSession(root, handlers) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let gesture;
  function finish(event, cancelled = false) {
    if (!gesture) return;
    const current = gesture;
    gesture = null;
    try {
      if (current.dragging) {
        root.dataset.suppressUntil = Date.now() + 350;
        handlers.end?.(current, event, cancelled);
      }
    } finally {
      current.ghost?.remove();
      root.classList.remove('is-dragging');
      handlers.clear?.();
    }
  }
  root.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary || gesture) return;
    const picked = handlers.pick(event);
    if (!picked) return;
    gesture = { ...picked, x: event.clientX, y: event.clientY, pointer: event.pointerId, dragging: false };
  }, options);
  window.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.pointer) return;
    if (!gesture.dragging && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) < 5) return;
    event.preventDefault();
    if (!gesture.dragging) {
      gesture.dragging = true;
      root.classList.add('is-dragging');
      handlers.start?.(gesture, event);
    }
    handlers.move?.(gesture, event);
  }, { ...options, passive: false });
  window.addEventListener('pointerup', event => { if (gesture?.pointer === event.pointerId) finish(event); }, options);
  window.addEventListener('pointercancel', event => finish(event, true), options);
  window.addEventListener('blur', event => finish(event, true), options);
  window.addEventListener('keydown', event => {
    if (!gesture?.dragging) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); finish(event, true); }
    else handlers.key?.(gesture, event);
  }, { ...options, capture: true });
  return () => { finish(null, true); controller.abort(); };
}

export function dragGhost(source, className = '') {
  const ghost = document.createElement('div');
  ghost.className = `drag-ghost ${className}`;
  ghost.innerHTML = typeof source === 'string' ? source : source.innerHTML;
  ghost.setAttribute('aria-hidden', 'true');
  (document.querySelector('dialog[open]') ?? document.body).append(ghost);
  return ghost;
}
