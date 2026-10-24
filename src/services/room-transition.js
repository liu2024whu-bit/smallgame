import { motionAllowed } from './motion.js';

// Keep the previous painting visible until the next one is decoded.
// Room geometry and input remain at their final positions throughout.
const runs=new WeakMap();
export function roomPainting(root) {
  const source=root.querySelector('.scene-image')?.getAttribute('src');
  const layers=[...root.children].filter(el=>el.matches('.scene-image,.scene-change,.room-light,[aria-hidden="true"]')&&!el.classList.contains('scene-transition')).map(el=>el.cloneNode(true));
  return source?{source,layers,ratio:root.clientWidth/root.clientHeight}:null;
}
export function transitionRoom(root,previous) {
  const current=root.querySelector('.scene-image'),run={};runs.set(root,run);
  root.querySelectorAll('.scene-transition').forEach(el=>el.remove());
  if(!previous||!current||previous.source===current.getAttribute('src')||!motionAllowed())return;
  if(Math.abs(previous.ratio-root.clientWidth/root.clientHeight)>.05){
    current.animate([{opacity:.5},{opacity:1}],{duration:180,easing:'ease-out'});return;
  }
  const old=document.createElement('div');old.className='scene-transition';old.setAttribute('aria-hidden','true');old.inert=true;
  old.append(...previous.layers);root.querySelector('.hotspot-layer').before(old);
  const reveal=()=>{
    if(runs.get(root)!==run||!old.isConnected||!motionAllowed()){old.remove();return;}
    const remove=()=>{window.clearTimeout(timer);old.remove();},timer=window.setTimeout(remove,320);
    old.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-out',fill:'forwards'}).finished.catch(()=>{}).finally(remove);
  };
  if(current.complete&&current.naturalWidth)reveal();else current.decode().catch(()=>{}).then(reveal);
}
