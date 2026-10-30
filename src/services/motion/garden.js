import {ease,turnDelta,motionAllowed} from './shared.js';
import {GARDEN_SIZE as SIZE,GARDEN_BOOK_DEPTH as DEPTH,GARDEN_SLOTS as SLOTS} from '../../data/garden.js';
import {plantBox,bookAnchor,paintDrawer} from '../../ui/puzzles/garden-art.js';

const cordPose='rotateX(60deg) rotateZ(75deg)';
const active=root=>root.querySelector('.garden-world');
const json=value=>{try{return JSON.parse(value);}catch{return null;}};
function capture(root){
 const world=active(root);if(!world)return null;
 const box=world.getBoundingClientRect(),s=box.width/SIZE[0],pose=world.querySelector('[data-book-pose]'),point=pose?.getBoundingClientRect();
 const arrival=json(world.dataset.gardenArrival);delete world.dataset.gardenArrival;
 return {camera:{left:box.left,top:box.top,width:box.width},pin:Number(world.dataset.flowerPin),arrival,
  book:point?[(point.left-box.left)/s,(point.top-box.top)/s]:null,
  bookHTML:[...world.querySelectorAll('.garden-book-mask,.garden-book-pose:not(.garden-book-mask *)')].map(e=>e.outerHTML).join(''),
  cord:world.querySelector('.garden-cord')?getComputedStyle(world.querySelector('.garden-cord')).transform:null,
  plants:[...world.querySelectorAll('[data-plant]')].map(e=>getComputedStyle(e).top),
  turns:[...world.querySelectorAll('[data-crank-art]')].map(e=>parseFloat(getComputedStyle(e).rotate)||0),
  board:world.querySelector('.garden-board-hit')?Object.fromEntries(['left','top','width','height'].map(key=>[key,getComputedStyle(world.querySelector('.garden-board-hit'))[key]])):null,
  planes:Object.fromEntries([...world.querySelectorAll('[data-plane]')].map(e=>[e.dataset.plane,getComputedStyle(e).transform]))};
}
function play(root,before){
 const world=active(root);if(!world||!before||!motionAllowed())return;
 const viewport=world.parentElement.getBoundingClientRect(),now=world.getBoundingClientRect();
 if(Math.abs(now.width-before.camera.width)>1||Math.abs(now.left-before.camera.left)>1||Math.abs(now.top-before.camera.top)>1)world.animate([{transform:`translate(${before.camera.left-viewport.left}px,${before.camera.top-viewport.top}px) scale(${before.camera.width/SIZE[0]})`},{transform:world.style.transform}],{duration:340,easing:ease});
 world.querySelectorAll('[data-plant]').forEach((el,i)=>{if(before.plants[i]&&before.plants[i]!==el.style.top)el.animate([{top:before.plants[i]},{top:el.style.top}],{duration:340,easing:ease});});
 world.querySelectorAll('[data-crank-art]').forEach((el,i)=>{const next=parseFloat(el.style.rotate),old=before.turns[i];if(old!==undefined&&Math.abs(turnDelta(old,next))>.01)el.animate([{rotate:(next+turnDelta(old,next))+'deg'},{rotate:next+'deg'}],{duration:340,easing:ease});});
 world.querySelectorAll('[data-plane]').forEach(el=>{const from=before.planes[el.dataset.plane],to=el.style.transform;if(from&&from!==to)el.animate([{transform:from},{transform:to}],{duration:480,easing:ease});});
 const board=world.querySelector('.garden-board-hit');if(board&&before.board){const to=Object.fromEntries(['left','top','width','height'].map(key=>[key,board.style[key]]));if(Object.keys(to).some(key=>to[key]!==before.board[key]))board.animate([before.board,to],{duration:480,easing:ease});}
 const pin=Number(world.dataset.flowerPin),arrival=before.arrival;
 if(pin>=0&&(pin!==before.pin||arrival)){
  const next=bookAnchor(pin),old=arrival?.anchor??before.book??[next[0],next[1]-DEPTH],lift=before.pin>=0&&!arrival?.freed?DEPTH:0;
  const dx=old[0]-next[0],dy=old[1]-next[1],offset=.24;
  for(const el of world.querySelectorAll('[data-book-pose]'))el.animate([{translate:`${dx}px ${dy}px`},{translate:`${dx}px ${dy-lift}px`,offset},{translate:`0 ${-DEPTH}px`,offset:.7},{translate:'0 0'}],{duration:580,easing:ease});
  const start=before.pin>=0&&!arrival?.freed?`inset(0 0 ${SIZE[1]-SLOTS[before.pin][1]-9}px)`:'none';
  for(const mask of world.querySelectorAll('.garden-book-mask'))mask.animate([{clipPath:start},{clipPath:start,offset},{clipPath:'none',offset:offset+.001},{clipPath:'none',offset:.7},{clipPath:mask.style.clipPath,offset:.701},{clipPath:mask.style.clipPath}],{duration:580});
  const cord=world.querySelector('.garden-cord');cord?.animate([{transform:before.cord??'none'},{transform:'none',offset},{transform:'none',offset:.7},{transform:cord.style.transform}],{duration:580,easing:ease});
 }else if(pin<0&&before.pin>=0&&before.bookHTML){
  const departure=document.createElement('div');departure.className='garden-departure';departure.inert=true;departure.innerHTML=before.bookHTML;world.append(departure);
  const lift=arrival?.freed?0:DEPTH,jobs=[...departure.querySelectorAll('[data-book-pose]')].map(el=>el.animate([{translate:'0 0',opacity:1},{translate:`0 ${-lift}px`,opacity:1,offset:.62},{translate:`-60px ${-lift-40}px`,opacity:0}],{duration:420,easing:ease}));
  for(const mask of departure.querySelectorAll('.garden-book-mask'))mask.animate([{clipPath:mask.style.clipPath},{clipPath:mask.style.clipPath,offset:.62},{clipPath:'none',offset:.621},{clipPath:'none'}],{duration:420});
  departure.querySelector('.garden-cord')?.animate([{transform:before.cord??'none'},{transform:'none'}],{duration:260,easing:ease});
  Promise.allSettled(jobs.map(a=>a.finished)).then(()=>departure.remove());
 }
}
export const gardenMotion={capture,play};
export function settleGardenPreview(root,p,{bookMoved=false,freed=false}={}){
 const world=active(root);if(!world)return;
 const before=capture(root);if(bookMoved&&before.book)before.arrival={anchor:before.book,freed};
 world.getAnimations({subtree:true}).forEach(a=>a.cancel());
 world.querySelectorAll('[data-plant]').forEach((el,i)=>el.style.top=plantBox(i,p.heights[i])[1]+'px');
 world.querySelectorAll('[data-crank-art]').forEach((el,i)=>el.style.rotate=p.turns[i]*90+'deg');
 if(p.pin>=0){const [x,y]=bookAnchor(p.pin);world.querySelectorAll('[data-book-pose]').forEach(el=>{el.style.left=x+'px';el.style.top=y+'px';});world.querySelectorAll('.garden-book-mask').forEach(el=>el.style.clipPath=`inset(0 0 ${SIZE[1]-SLOTS[p.pin][1]-9}px)`);const cord=world.querySelector('.garden-cord');if(cord)cord.style.transform=cordPose;}
 paintDrawer(world,Number(p.opened));play(root,before);
}
