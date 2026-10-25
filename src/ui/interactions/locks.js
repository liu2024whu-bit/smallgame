import { pointerSession } from './pointer.js';
import {mod} from '../../puzzles/common.js';

export function bindLocks(root, progress, move, feedback=()=>{}) {
  const apparatus = root.querySelector('[data-password-lock]');
  if (!apparatus) return () => {};
  const kind = apparatus.dataset.passwordLock;
  const drums = [...root.querySelectorAll('[data-lock-digit]')];
  if(kind==='number'&&!drums.length)return ()=>{};
  const paint=(button,value)=>{
    const strip=button.querySelector('[data-number-strip]');
    const current=mod(Math.round(value),10);
    if(strip){
      strip.getAnimations().forEach(a=>a.cancel());strip.style.setProperty('--digit',mod(value,10));
      button.setAttribute('aria-valuenow',current);button.setAttribute('aria-valuetext',current);
    }else{
      // Calendar and birthday drums retain their own artwork and 22px detents.
      button.querySelector('b').textContent=current;
      button.querySelector('.wheel-previous').textContent=mod(current-1,10);
      button.querySelector('.wheel-next').textContent=mod(current+1,10);
    }
  };
  const abort = new AbortController();
  root.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if(kind==='number'&&!event.target.closest('[data-lock-digit]')&&event.target!==apparatus)return;
    const slot = Number(event.target.closest('[data-lock-digit]')?.dataset.lockDigit ?? progress.cursor);
    let action;
    if (kind === 'number' && /^\d$/.test(event.key)) action = { type:'set', index:slot, value:Number(event.key) };
    if (kind === 'letter' && /^[a-z]$/i.test(event.key)) action = { type:'key', index:slot, value:event.key.toUpperCase().charCodeAt(0) - 65 };
    if (kind === 'letter' && event.key === 'Backspace') action = { type:'erase',index:slot };
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') action = { type:'cursor', index:Math.max(0, Math.min(progress.values.length - 1, slot + (event.key === 'ArrowLeft' ? -1 : 1))) };
    if(kind==='number'&&['Home','End'].includes(event.key))action={type:'set',index:slot,value:event.key==='Home'?0:9};
    if (kind === 'number' && ['ArrowUp','ArrowDown'].includes(event.key)) action = { type:'turn', index:slot, direction:event.key === 'ArrowUp' ? 1 : -1 };
    // Only Enter from the apparatus submits; native Enter still activates toolbar buttons.
    if (event.key === 'Enter' && (event.target.closest('[data-lock-digit]')||event.target===apparatus)) action = { type:'submit' };
    if (!action) return;
    event.preventDefault(); event.stopPropagation(); move(action);
    if (action.type === 'cursor') root.querySelector(`[data-focus="${kind}-${action.index}"]`)?.focus({preventScroll:true});
    if (kind === 'number' && action.type === 'set') root.querySelector(`[data-focus="number-${Math.min(progress.values.length-1,slot + 1)}"]`)?.focus({preventScroll:true});
    if (kind === 'letter' && action.type === 'key') root.querySelector(`[data-focus="letter-${Math.min(progress.values.length-1,slot+1)}"]`)?.focus({preventScroll:true});
    if (kind === 'letter' && action.type === 'erase') root.querySelector(`[data-focus="letter-${progress.values[slot]===26&&slot>0?slot-1:slot}"]`)?.focus({preventScroll:true});
  }, { signal:abort.signal });
  const stop = kind === 'number' ? pointerSession(root, {
    pick(event) { const source = event.target.closest('[data-lock-digit]'); return source&&!source.disabled ? { source, index:Number(source.dataset.lockDigit) } : null; },
    start(g){g.step=g.source.querySelector('[data-number-strip]')?Math.max(18,Math.min(32,g.source.getBoundingClientRect().height/2)):22;g.last=progress.values[g.index];},
    move(g,event){const value=progress.values[g.index]+(g.y-event.clientY)/g.step;g.value=(Math.round(value)%10+10)%10;paint(g.source,value);if(g.value!==g.last){g.last=g.value;feedback('detent');}},
    end(gesture,_,cancelled) { if (!cancelled && gesture.value !== undefined) move({type:'set',index:gesture.index,value:gesture.value}); },
    clear() { drums.forEach(button => paint(button,progress.values[Number(button.dataset.lockDigit)])); },
  }) : () => {};
  const pull=kind==='number'?pointerSession(root,{
    pick(event){const source=event.target.closest('[data-postal-latch]');return source&&!source.disabled?{source}:null;},
    start(g){g.span=Math.max(44,g.source.getBoundingClientRect().width);},
    move(g,event){g.amount=Math.max(0,Math.min(1,(event.clientX-g.x)/g.span));g.source.style.rotate=`${-g.amount*70}deg`;},
    end(g,_,cancelled){if(!cancelled&&g.amount>=.6)move({type:'submit'});},
    clear(){root.querySelector('[data-postal-latch]')?.style.removeProperty('rotate');}
  }):()=>{};
  return () => { stop();pull();abort.abort(); };
}
