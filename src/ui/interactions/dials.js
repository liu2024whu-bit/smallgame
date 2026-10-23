import { pointerSession } from './pointer.js';
import { settleDial } from '../../services/motion/dials.js';

export function bindDials(root, progress, move) {
  if (!root.querySelector('[data-dial]')) return () => {};
  const values = progress.values ?? progress.turns;
  const keyboard = new AbortController();
  root.addEventListener('keydown', event => {
    const face = event.target.closest('[data-dial]');
    if (!face || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    const index = Number(face.dataset.dial), count = Number(face.dataset.count);
    const step = ['ArrowLeft','ArrowDown'].includes(event.key) ? -1 : 1;
    const value = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : (values[index] + step + count) % count;
    move({ type:'set-turn', index, value });
  }, { signal:keyboard.signal });
  const stop = pointerSession(root,{
    pick(event) {
      const source = event.target.closest('[data-dial]');
      if (!source) return null;
      const box = source.getBoundingClientRect(), x = box.left + box.width/2, y = box.top + box.height/2;
      return {source,index:Number(source.dataset.dial),count:Number(source.dataset.count),xCenter:x,yCenter:y,angle:Math.atan2(event.clientY-y,event.clientX-x),rotation:0};
    },
    move(gesture,event) {
      const angle = Math.atan2(event.clientY-gesture.yCenter,event.clientX-gesture.xCenter);
      gesture.rotation += Math.atan2(Math.sin(angle-gesture.angle),Math.cos(angle-gesture.angle)); gesture.angle = angle;
      const steps = Math.round(gesture.rotation/(Math.PI*2/gesture.count));
      gesture.value = (values[gesture.index]+steps%gesture.count+gesture.count)%gesture.count;
      gesture.source.style.setProperty('--turn',`${values[gesture.index]*360/gesture.count+gesture.rotation*180/Math.PI}deg`);
      gesture.source.querySelector('.item-art')?.style.setProperty('transform',`rotate(${values[gesture.index]*360/gesture.count+gesture.rotation*180/Math.PI}deg)`);
      gesture.source.querySelector('b').textContent = gesture.value;
      gesture.source.setAttribute('aria-valuenow',gesture.value);
    },
    end(gesture,_,cancelled) {
      // Commit before resetting the preview, so the dialog can capture the hand's angle.
      if (!cancelled && gesture.value !== undefined && move({type:'set-turn',index:gesture.index,value:gesture.value})) return;
      const from = parseFloat(gesture.source.style.getPropertyValue('--turn'));
      const to = values[gesture.index]*360/gesture.count;
      gesture.source.style.setProperty('--turn',`${to}deg`);
      const art=gesture.source.querySelector('.item-art'); if(art)art.style.transform='';
      gesture.source.querySelector('b').textContent=values[gesture.index];
      gesture.source.setAttribute('aria-valuenow',values[gesture.index]);
      settleDial(gesture.source,from,to);
    },
  });
  return () => { stop(); keyboard.abort(); };
}
