import {pointerSession,dragGhost} from './pointer.js';
import {booksFit} from '../../puzzles/books.js';
import {LIBRARY_DRAWER_STROKE} from '../../data/library.js';
import {settleLibraryDrawer} from '../../services/motion/library.js';

export function bindLibrary(root,progress,{move,changeView,feedback=()=>{}}){
 const shelf=root.querySelector('[data-library-shelf]');if(!shelf)return ()=>{};
 const books=[...shelf.querySelectorAll('[data-library-book]')],controller=new AbortController();
 const sameViewport=g=>g.viewport[0]===innerWidth&&g.viewport[1]===innerHeight;
 shelf.addEventListener('keydown',event=>{
  const book=event.target.closest('[data-library-book]');
  if(!book||progress.opened||!progress.fitted[0]||event.ctrlKey||event.metaKey||event.altKey)return;
  const from=Number(book.dataset.libraryIndex),to=event.key==='Home'?0:event.key==='End'?4:event.key==='ArrowLeft'?from-1:event.key==='ArrowRight'?from+1:null;
  if(to===null)return;event.preventDefault();event.stopPropagation();
  if(to>=0&&to<5)move({type:'reorder',from,to});
 },{signal:controller.signal});
 const stop=pointerSession(shelf,{
  pick(event){const source=event.target.closest('[data-library-book]');return source&&!progress.opened?{source,from:Number(source.dataset.libraryIndex),book:Number(source.dataset.libraryBook)}:null;},
  start(g,event){
   books.forEach(book=>book.getAnimations().forEach(a=>a.finish()));
   g.boxes=books.map(b=>b.getBoundingClientRect());g.bounds=shelf.querySelector('.library-books').getBoundingClientRect();g.viewport=[innerWidth,innerHeight];
   g.mode=Math.abs(event.clientY-g.y)>Math.abs(event.clientX-g.x)*1.2?'inspect':progress.fitted[0]?'reorder':'held';
   if(g.mode==='held'){feedback('stop');return;}
   const r=g.boxes[g.from];g.grab=[g.x-r.left,g.y-r.top];
   g.ghost=dragGhost(g.source,'library-drag-ghost');g.ghost.style.width=r.width+'px';g.ghost.style.height=r.height+'px';g.source.classList.add('drag-source');
  },
  move(g,event){
   if(g.mode==='held'||!sameViewport(g))return;
   const dx=event.clientX-g.x,dy=event.clientY-g.y;
   g.ghost.style.left=(g.mode==='inspect'?g.boxes[g.from].left:event.clientX-g.grab[0])+'px';
   g.ghost.style.top=(g.mode==='inspect'?g.boxes[g.from].top+Math.max(-8,Math.min(70,dy)):event.clientY-g.grab[1])+'px';
   if(g.mode==='inspect'){g.pull=dy;return;}
   const inside=event.clientX>=g.bounds.left-10&&event.clientX<=g.bounds.right+10&&event.clientY>=g.bounds.top-35&&event.clientY<=g.bounds.bottom+55;
   g.to=inside?g.boxes.reduce((best,r,i)=>Math.abs(event.clientX-r.left-r.width/2)<Math.abs(event.clientX-g.boxes[best].left-g.boxes[best].width/2)?i:best,0):null;
   books.forEach((book,index)=>{
    const shifted=g.to!==null&&index!==g.from&&(g.from<g.to?index>g.from&&index<=g.to:index>=g.to&&index<g.from);
    const to=shifted?g.boxes[index+(g.from<g.to?-1:1)]:g.boxes[index];
    book.style.translate=`${to.left-g.boxes[index].left}px 0`;
   });
  },
  end(g,_,cancelled){
   if(cancelled||!sameViewport(g)){g.returnToSource=true;return;}
   if(g.mode==='inspect'&&g.pull>28){changeView({library:'book',book:g.book});feedback('turn');return;}
   if(g.mode==='reorder'&&g.to!==null&&g.to!==undefined&&g.to!==g.from){
    // The renderer captures the released position, so a dropped book never
    // flies back to its old slot before animating to the new one.
    g.source.style.translate=`${g.boxes[g.to].left-g.boxes[g.from].left}px 0`;
    move({type:'reorder',from:g.from,to:g.to});return;
   }
   g.returnToSource=true;
  },
  clear(){books.forEach(book=>{book.classList.remove('drag-source');book.style.removeProperty('translate');});},
 });
 const drawer=shelf.querySelector('.library-drawer');
 const pull=pointerSession(shelf,{
  pick(event){const source=event.target.closest('[data-library-pull]');return source?{source}:null;},
  start(g){drawer.getAnimations().forEach(a=>a.finish());g.span=Math.max(44,drawer.getBoundingClientRect().height*LIBRARY_DRAWER_STROKE/100);g.free=progress.fitted[0]&&booksFit(progress.order);g.viewport=[innerWidth,innerHeight];},
  move(g,event){g.amount=Math.max(0,Math.min(1,(event.clientY-g.y)/g.span));drawer.style.transform=`translateY(${-LIBRARY_DRAWER_STROKE+g.amount*(g.free?LIBRARY_DRAWER_STROKE:8)}%)`;},
  end(g,_,cancelled){if(!cancelled&&sameViewport(g)&&g.amount>=.6)move({type:'submit'});},
  clear(){settleLibraryDrawer(drawer);},
 });
 return ()=>{stop();pull();controller.abort();};
}
