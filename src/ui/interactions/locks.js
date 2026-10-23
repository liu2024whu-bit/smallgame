import { pointerSession } from './pointer.js';

export function bindLocks(root, progress, move) {
  const apparatus = root.querySelector('[data-password-lock]');
  if (!apparatus) return () => {};
  const kind = apparatus.dataset.passwordLock;
  const drums = [...root.querySelectorAll('[data-lock-digit]')];
  const paint=(button,value)=>{
    button.querySelector('b').textContent=value;
    button.querySelector('.wheel-previous').textContent=(value+9)%10;
    button.querySelector('.wheel-next').textContent=(value+1)%10;
  };
  const abort = new AbortController();
  root.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    const slot = Number(event.target.closest('[data-lock-digit]')?.dataset.lockDigit ?? progress.cursor);
    let action;
    if (kind === 'number' && /^\d$/.test(event.key)) action = { type:'set', index:slot, value:Number(event.key) };
    if (kind === 'letter' && /^[a-z]$/i.test(event.key)) action = { type:'key', value:event.key.toUpperCase().charCodeAt(0) - 65 };
    if (kind === 'letter' && event.key === 'Backspace') action = { type:'erase' };
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') action = { type:'cursor', index:Math.max(0, Math.min(progress.values.length - 1, progress.cursor + (event.key === 'ArrowLeft' ? -1 : 1))) };
    if (kind === 'number' && ['ArrowUp','ArrowDown'].includes(event.key)) action = { type:'turn', index:slot, direction:event.key === 'ArrowUp' ? 1 : -1 };
    // Only Enter from the apparatus submits; native Enter still activates toolbar buttons.
    if (event.key === 'Enter' && apparatus.contains(event.target)) action = { type:'submit' };
    if (!action) return;
    event.preventDefault(); event.stopPropagation(); move(action);
    if (kind === 'number' && action.type === 'set') root.querySelector(`[data-focus="number-${Math.min(3,slot + 1)}"]`)?.focus({preventScroll:true});
  }, { signal:abort.signal });
  const stop = kind === 'number' ? pointerSession(root, {
    pick(event) { const source = event.target.closest('[data-lock-digit]'); return source ? { source, index:Number(source.dataset.lockDigit) } : null; },
    move(gesture,event) { const step = Math.round((gesture.y - event.clientY) / 22); gesture.value = (progress.values[gesture.index] + step % 10 + 10) % 10; paint(gesture.source,gesture.value); },
    end(gesture,_,cancelled) { if (!cancelled && gesture.value !== undefined) move({type:'set',index:gesture.index,value:gesture.value}); },
    clear() { drums.forEach(button => paint(button,progress.values[Number(button.dataset.lockDigit)])); },
  }) : () => {};
  return () => { stop(); abort.abort(); };
}
