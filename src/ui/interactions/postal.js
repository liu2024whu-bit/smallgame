import {pointerSession} from './pointer.js';
import {mirrorMatrix} from '../../data/postal.js';

export function paintPostalMirror(root,aim){
 const mirror=root.querySelector('[data-postal-mirror]');if(!mirror)return;
 const aperture=mirror.querySelector('.postal-mirror-aperture'),print=mirror.querySelector('.postal-reflection');
 print.style.transform='matrix('+mirrorMatrix(aperture.clientWidth,aperture.clientHeight,aim).join(',')+')';
 mirror.querySelector('.postal-mirror-image').style.transform=`perspective(800px) rotateY(${(aim-.5)*14}deg)`;
 const grip=mirror.querySelector('[data-postal-mirror-grip]');grip.setAttribute('aria-valuenow',Math.round(aim*100));grip.setAttribute('aria-valuetext',Math.round(aim*100));
}
export function bindPostal(root,changeView,feedback=()=>{}){
 const desk=root.querySelector('[data-postal-desk]');if(!desk)return ()=>{};
 const initial=Number(desk.dataset.postalAim),clamp=v=>Math.max(0,Math.min(1,v));
 const render=()=>paintPostalMirror(desk,initial),observer=new ResizeObserver(render);observer.observe(desk);render();
 const controller=new AbortController();
 desk.addEventListener('keydown',event=>{
  if(!event.target.closest('[data-postal-mirror-grip]')||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();event.stopPropagation();
  const value=event.key==='Home'?0:event.key==='End'?1:clamp(initial+(event.key==='ArrowRight'?.05:-.05));changeView({postalAim:value});
 },{signal:controller.signal});
 const stop=pointerSession(desk,{
  pick(event){const source=event.target.closest('[data-postal-mirror-grip]');return source?{source}:null;},
  start(g){g.range=Math.max(100,desk.querySelector('[data-postal-mirror]').getBoundingClientRect().width);},
  move(g,event){g.value=clamp(initial+(event.clientX-g.x)/g.range);paintPostalMirror(desk,g.value);},
  end(g,_,cancelled){if(!cancelled&&g.value!==undefined){changeView({postalAim:g.value});feedback('turn');}},
  clear(){if(desk.isConnected)render();}
 });
 return ()=>{stop();observer.disconnect();controller.abort();};
}
