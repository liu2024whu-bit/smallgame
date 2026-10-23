// Measure before a view update, then animate the same physical object to its new place.
const OBJECTS = [
  ['.operation-piece', element => `operation:${element.querySelector('strong')?.textContent}`],
  ['.book-slot', element => `book:${element.querySelector('.illustrated-spine > span')?.textContent}`],
  ['.loose-stamp', element => `stamp:${element.querySelector('.motif')?.getAttribute('aria-label')}`],
  ['.loose-page', element => `page:${element.querySelector('.page-letter')?.textContent}`],
  ['.film-frame', element => `film:${element.querySelector('.frame-number')?.textContent}`],
  ['.drawer-unit button', (_, index) => `drawer:${index}`],
  ['.music-pin', (_, index) => `pin:${index}`],
  ['.flower-pot', (_, index) => `flower:${index}`],
  ['.cloud-layer .motif', (_, index) => `cloud:${index}`],
];
export const motionAllowed = () => !document.documentElement.classList.contains('reduce-motion') && !matchMedia('(prefers-reduced-motion: reduce)').matches;

function objects(root) {
  return OBJECTS.flatMap(([selector, identify]) => [...root.querySelectorAll(selector)].map((element, index) => [identify(element, index), element]));
}
export function captureMotion(root) {
  if (!motionAllowed()) return null;
  return {
    boxes: new Map(objects(root).map(([key, element]) => [key, element.getBoundingClientRect()])),
    dials: [...root.querySelectorAll('.dial-face')].map(element => parseFloat(element.style.getPropertyValue('--turn')) || 0),
    screen: [...root.querySelectorAll('.screen-leaf')].map(element => element.classList.contains('back-face')),
    thread: root.querySelector('.active-thread')?.getAttribute('points'),
    stitches: root.querySelectorAll('.stitch-lines line').length,
    liquid: [...root.querySelectorAll('.cocoa-liquid')].map(el=>getComputedStyle(el).height),
    pour: [root.dataset.pourFrom,root.dataset.pourTo],
    bookmark:root.querySelector('.garden-lift')?{pin:Number(root.querySelector('.garden-lift').dataset.flowerPin),box:root.querySelector('[data-bookmark-grab]')?.getBoundingClientRect()}:null,
    mazeArrived:!!root.querySelector('.maze-arrived'),
  };
}
export function playMotion(root, before) {
  if (!before || !motionAllowed()) return;
  for (const [key, element] of objects(root)) {
    const old = before.boxes.get(key), next = element.getBoundingClientRect();
    if (!old || !old.width || !next.width) continue;
    const dx = old.left - next.left, dy = old.top - next.top;
    if (Math.abs(dx) + Math.abs(dy) > 1) element.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }], { duration: 380, easing: 'cubic-bezier(.22,.75,.3,1)' });
  }
  root.querySelectorAll('.dial-face').forEach((element, index) => {
    const next = parseFloat(element.style.getPropertyValue('--turn')) || 0;
    const old = before.dials[index];
    if (old === undefined || old === next) return;
    const delta = ((old - next + 540) % 360) - 180;
    element.querySelector('.item-art')?.animate([{ transform: `rotate(${next + delta}deg)` }, { transform: `rotate(${next}deg)` }], { duration: 340, easing: 'cubic-bezier(.2,.7,.3,1)' });
    if(element.closest('.light-console'))element.animate([{transform:`rotate(${next+delta}deg)`},{transform:`rotate(${next}deg)`}],{duration:340,easing:'ease-out',pseudoElement:'::before'});
  });
  root.querySelectorAll('.screen-leaf').forEach((element, index) => {
    if (before.screen[index] !== undefined && before.screen[index] !== element.classList.contains('back-face')) element.animate([{ transform: 'rotateY(20deg)', opacity: .45 }, { transform: 'rotateY(0deg)', opacity: 1 }], { duration: 290, easing: 'ease-out' });
  });
  const thread = root.querySelector('.active-thread');
  if (thread && thread.getAttribute('points') !== before.thread) drawLine(thread);
  const stitches = root.querySelectorAll('.stitch-lines line');
  if (stitches.length > before.stitches) drawLine(stitches[stitches.length - 1]);
  const liquids=[...root.querySelectorAll('.cocoa-liquid')];
  const garden=root.querySelector('.garden-lift'),pin=Number(garden?.dataset.flowerPin);
  if(garden&&before.bookmark&&before.bookmark.pin!==pin){
    const tab=garden.querySelector('.bookmark-tab .item-art');
    if(tab)tab.animate([{translate:'50px 6px',opacity:.3},{translate:'0 0',opacity:1}],{duration:380,easing:'cubic-bezier(.2,.7,.3,1)'});
    const free=garden.querySelector('.bookmark-supply'),old=before.bookmark.box;
    if(free&&old){const next=free.getBoundingClientRect();free.animate([{translate:`${old.x-next.x}px ${old.y-next.y}px`,rotate:'75deg',scale:'.65'},{translate:'0 0',rotate:'0deg',scale:'1'}],{duration:420,easing:'cubic-bezier(.2,.7,.3,1)'});}
  }
  const ball=root.querySelector('.maze-arrived');
  if(ball&&!before.mazeArrived){const points=JSON.parse(ball.dataset.walk);ball.animate(points.map(([x,y])=>({transform:`translate(${x}px,${y}px)`})),{duration:points.length*40,easing:'linear'});}
  let poured=false;
  liquids.forEach((liquid,index)=>{
    const next=getComputedStyle(liquid).height,old=before.liquid[index];
    if(old!==undefined&&old!==next){poured=true;liquid.animate([{height:old},{height:next}],{duration:650,easing:'ease-in-out'});}
  });
  if(poured&&before.pour.every(value=>value!==undefined)){
    const [from,to]=before.pour.map(Number),stream=root.querySelector('.pour-stream');
    if(stream){
      const x=[32,60,82], y=[27,32,37];
      stream.innerHTML=`<path d="M ${x[from]} ${y[from]} Q ${(x[from]+x[to])/2} ${Math.min(y[from],y[to])-12} ${x[to]-6} ${y[to]+8}"/>`;
      stream.animate([{opacity:0},{opacity:.8,offset:.2},{opacity:.8,offset:.8},{opacity:0}],{duration:650,fill:'forwards'});
    }
  }
  delete root.dataset.pourFrom;delete root.dataset.pourTo;
}
function drawLine(element) {
  const length = element.getTotalLength();
  if (!length) return;
  element.animate([{ strokeDasharray: `${length} ${length}`, strokeDashoffset: length }, { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0 }], { duration: 450, easing: 'ease-out' });
}
