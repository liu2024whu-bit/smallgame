import { FRAME_PETALS, FRAME_SIGNS } from '../puzzles/film.js';

// Inspecting and playback never alter the answer or the earned clues.
export function bindFilm(root,progress) {
  const button=root.querySelector('[data-film-play]');
  if(!button)return ()=>{};
  const abort=new AbortController();let timer,step=0,playing=false;
  const stop=()=>{clearTimeout(timer);playing=false;button.textContent='放映';};
  function show() {
    if(step>=progress.order.length){stop();return;}
    const frame=progress.order[step++];
    root.querySelector('.film-view-petal').style.top=`${FRAME_PETALS[frame]}%`;
    root.querySelector('.film-view-number').textContent=['Ⅰ','Ⅱ','Ⅲ'][frame];
    root.querySelector('.film-event').textContent=FRAME_SIGNS[frame];
    root.querySelectorAll('.film-frame').forEach(element=>element.classList.toggle('frame-inspecting',element.querySelector('.frame-number').textContent===['Ⅰ','Ⅱ','Ⅲ'][frame]));
    timer=setTimeout(show,1300);
  }
  button.addEventListener('click',()=>{if(playing){stop();return;}playing=true;step=0;button.textContent='停下';show();},{signal:abort.signal});
  return ()=>{stop();abort.abort();};
}
