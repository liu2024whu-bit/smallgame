import {pointerSession} from './pointer.js';
import {turnFlowers,FLOWER_LINKS,flowersReady} from '../../puzzles/flowers.js';
import {GARDEN_SIZE as SIZE,GARDEN_CRANKS as CRANKS,GARDEN_SLOTS as SLOTS,GARDEN_BOOK_DEPTH as DEPTH,GARDEN_BOOK_HEIGHT as BOOK_HEIGHT,GARDEN_DRAWER as DRAWER} from '../../data/garden.js';
import {plantBox,bookAnchor,paintDrawer} from '../puzzles/garden-art.js';
import {settleGardenPreview} from '../../services/motion/garden.js';

export function prepareGardenMove(root,move,p,view,arrival){
 const world=root.querySelector('.garden-world');if(!world)return;
 if(move.type==='submit'&&flowersReady(p))view.gardenView='whole';
 if(move.type==='fit'&&arrival){const b=world.getBoundingClientRect(),s=b.width/SIZE[0];world.dataset.gardenArrival=JSON.stringify({anchor:[(arrival.left+arrival.width*.25-b.left)/s,(arrival.top+arrival.height*.08-b.top)/s],freed:true});}
}
export function bindGarden(root,p,{move,feedback=()=>{}}){
 const world=root.querySelector('.garden-world');if(!world)return ()=>{};
 const viewport=world.parentElement,abort=new AbortController(),on=(el,type,fn)=>el.addEventListener(type,fn,{signal:abort.signal});
 const scale=()=>world.getBoundingClientRect().width/SIZE[0];
 const point=e=>{const b=world.getBoundingClientRect(),s=b.width/SIZE[0];return [(e.clientX-b.left)/s,(e.clientY-b.top)/s];};
 const inside=e=>{if(!e)return false;const b=viewport.getBoundingClientRect();return e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom;};
 const plants=[...world.querySelectorAll('[data-plant]')],slots=[...world.querySelectorAll('[data-slot]')];
 let committing=false,preview=false;
 const highlight=index=>plants.forEach((el,i)=>el.classList.toggle('will-move',(FLOWER_LINKS[index]??[]).includes(i)&&i!==p.pin));
 const restore=options=>{if(preview&&world.isConnected)settleGardenPreview(root,p,options);preview=false;};
 const crank=pointerSession(root,{
  pick(e){const source=e.target.closest('[data-garden-crank]');if(!source||source.disabled)return null;const index=Number(source.dataset.gardenCrank),[x,y]=point(e),[cx,cy]=CRANKS[index];return {source,index,cx,cy,angle:Math.atan2(y-cy,x-cx),rotation:0,vertical:Math.hypot(x-cx,y-cy)<28,unit:Math.max(24,70*scale())};},
  start(g){preview=true;committing=false;highlight(g.index);g.from=plants.map(el=>parseFloat(getComputedStyle(el).top));world.getAnimations({subtree:true}).forEach(a=>a.cancel());},
  move(g,e){
   const [x,y]=point(e);
   if(g.vertical)g.rotation=(g.y-e.clientY)/g.unit*Math.PI/2;
   else{const angle=Math.atan2(y-g.cy,x-g.cx);g.rotation+=Math.atan2(Math.sin(angle-g.angle),Math.cos(angle-g.angle));g.angle=angle;}
   const fraction=Math.max(-3,Math.min(3,g.rotation/(Math.PI/2))),whole=Math.trunc(fraction),part=Math.abs(fraction-whole),low=turnFlowers(p,g.index,whole),high=turnFlowers(p,g.index,whole+Math.sign(fraction-whole));
   const heights=low.heights.map((v,i)=>v+(high.heights[i]-v)*part),blend=Math.min(1,Math.abs(fraction)/.4);
   plants.forEach((el,i)=>el.style.top=(g.from[i]*(1-blend)+plantBox(i,heights[i])[1]*blend)+'px');
   const linked=FLOWER_LINKS[g.index].filter(i=>i!==p.pin),actual=linked.reduce((sum,i)=>sum+heights[i]-p.heights[i],0)/linked.length,resistance=Math.max(-6,Math.min(6,(fraction-actual)*5));
   world.querySelector('[data-crank-art="'+g.index+'"]').style.rotate=(p.turns[g.index]*90+actual*90+resistance)+'deg';
   const detent=Math.round(actual);if(g.detent!==detent){if(g.detent!==undefined||detent)feedback('detent');g.detent=detent;}g.steps=Math.round(fraction);
  },
  end(g,e,cancelled){if(cancelled||!inside(e)){restore();return;}committing=!!g.steps;if(committing&&move({type:'crank',index:g.index,steps:g.steps})){preview=false;return;}committing=false;restore();if(g.steps)feedback('stop');},
  clear(){highlight(-1);}
 });
 const book=pointerSession(root,{
  pick(e){const source=e.target.closest('[data-book-grab]');if(!source||p.pin<0)return null;const [x,y]=point(e),origin=bookAnchor(p.pin);return {source,origin,grab:[x-origin[0],y-origin[1]],freed:false,index:-1};},
  start(){committing=false;preview=true;world.getAnimations({subtree:true}).forEach(a=>a.cancel());},
  move(g,e){
   const [x,y]=point(e),rise=g.origin[1]-(y-g.grab[1]);if(!g.freed&&rise>=DEPTH)g.freed=true;
   const anchor=g.freed?[x-g.grab[0],y-g.grab[1]]:[g.origin[0],Math.min(g.origin[1],y-g.grab[1])];g.anchor=anchor;
   world.querySelectorAll('[data-book-pose]').forEach(el=>{el.style.left=anchor[0]+'px';el.style.top=anchor[1]+'px';});
   world.querySelectorAll('.garden-book-mask').forEach(el=>el.style.clipPath=g.freed?'none':`inset(0 0 ${SIZE[1]-SLOTS[p.pin][1]-9}px)`);
   const u=Math.max(0,Math.min(1,rise/DEPTH));world.querySelector('.garden-cord').style.transform=`rotateX(${60*(1-u)}deg) rotateZ(${75*(1-u)}deg)`;
   const tip=[anchor[0],anchor[1]+BOOK_HEIGHT-8],range=Math.max(50,25/scale());
   g.index=g.freed?SLOTS.findIndex(([sx,sy])=>[tip,[x,y]].some(pt=>Math.abs(pt[0]-sx)<range&&Math.abs(pt[1]-sy)<range)):-1;
   slots.forEach((el,i)=>el.classList.toggle('drop-target',g.index===i));
  },
  end(g,e,cancelled){
   if(cancelled||!inside(e)||!g.freed){restore({bookMoved:true,freed:g.freed});return;}
   world.dataset.gardenArrival=JSON.stringify({anchor:g.anchor,freed:true});committing=true;
   const changed=move(g.index>=0?{type:'fit',index:0,port:g.index}:{type:'unfit',index:0});
   if(changed){preview=false;return;}delete world.dataset.gardenArrival;committing=false;restore({bookMoved:true,freed:true});
  },
  clear(){slots.forEach(el=>el.classList.remove('drop-target'));}
 });
 const drawer=pointerSession(root,{
  pick(e){const source=e.target.closest('[data-drawer-grab]');return source&&!source.disabled?{source,amount:0}:null;},
  start(){preview=true;committing=false;world.getAnimations({subtree:true}).forEach(a=>a.cancel());},
  move(g,e){g.amount=Math.max(0,Math.min(1,(e.clientY-g.y)/scale()/DRAWER.travel));paintDrawer(world,flowersReady(p)?g.amount:Math.min(.045,g.amount*.08));},
  end(g,e,cancelled){if(cancelled||!inside(e)||g.amount<.35){restore();return;}committing=true;if(move({type:'submit'})){preview=false;return;}committing=false;restore();}
 });
 on(root,'keydown',e=>{const button=e.target.closest('[data-garden-crank]');if(!button||button.disabled||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();committing=true;const changed=move({type:'crank',index:Number(button.dataset.gardenCrank),steps:['ArrowLeft','ArrowDown'].includes(e.key)?-1:1});if(!changed){committing=false;feedback('stop');}});
 on(root,'pointerdown',e=>{const b=e.target.closest('[data-garden-crank],[data-book-grab],[data-drawer-grab]');if(b&&!b.disabled&&e.button===0){e.preventDefault();b.focus({preventScroll:true});}});
 for(const type of ['pointerover','focusin'])on(root,type,e=>{const b=e.target.closest('[data-garden-crank]');if(b&&!b.disabled)highlight(Number(b.dataset.gardenCrank));});
 for(const type of ['pointerout','focusout'])on(root,type,()=>highlight(-1));
 return ()=>{crank();book();drawer();if(!committing)restore();abort.abort();highlight(-1);};
}
