import {pointerSession,dragGhost} from './pointer.js';
import {planeMatrix,mappedPlaneMatrix,projectedPoint,matrixStyle} from '../raster-plane.js';

function paperGhost(source,plane,world,box){
 const w=source.offsetWidth,h=source.offsetHeight,m=planeMatrix(JSON.parse(plane.dataset.assemblyQuad),plane.offsetWidth,plane.offsetHeight),r=world.getBoundingClientRect(),scale=r.width/1672;
 const quad=[[0,0],[w,0],[w,h],[0,h]].map(([x,y])=>{
  const [px,py]=projectedPoint(m,[source.offsetLeft+x,source.offsetTop+y]);return [r.left+px*scale-box.left,r.top+py*scale-box.top];
 });
 const ghost=dragGhost('','album-drag-ghost'),holder=document.createElement('div'),leaf=source.cloneNode(true);
 holder.className='album-ghost-plane';Object.assign(holder.style,{width:w+'px',height:h+'px',transform:matrixStyle(quad,w,h)});
 leaf.classList.remove('can-drag','drag-source');leaf.style.removeProperty('translate');holder.append(leaf);ghost.append(holder);ghost.inert=true;
 return ghost;
}
export function bindAlbum(root,move){
 const layout=root.querySelector('.album-layout');if(!layout||layout.closest('[inert]'))return ()=>{};
 const pages=[...layout.querySelectorAll('[data-album-page]')],plane=layout.closest('[data-assembly-quad]'),world=layout.closest('.word-lock-world'),controller=new AbortController();
 const inverse=mappedPlaneMatrix(JSON.parse(plane.dataset.assemblyQuad),[[0,0],[plane.offsetWidth,0],[plane.offsetWidth,plane.offsetHeight],[0,plane.offsetHeight]]);
 const localPoint=(x,y)=>{const r=world.getBoundingClientRect(),scale=r.width/1672;return projectedPoint(inverse,[(x-r.left)/scale,(y-r.top)/scale]);};
 layout.addEventListener('keydown',event=>{
  const page=event.target.closest('[data-album-page]');if(!page||event.ctrlKey||event.metaKey||event.altKey)return;
  const from=Number(page.dataset.albumSlot),row=Math.floor(from/2),col=from%2;
  const to=event.key==='ArrowLeft'?col?from-1:null:event.key==='ArrowRight'?col?null:from+1:event.key==='ArrowUp'?row?from-2:null:event.key==='ArrowDown'?row?null:from+2:undefined;
  if(to===undefined)return;event.preventDefault();event.stopPropagation();if(to!==null)move({type:'swap',from,to});
 },{signal:controller.signal});
 const stop=pointerSession(root,{
  pick(event){const handle=event.target.closest('[data-album-handle]');return handle&&layout.contains(handle)?{source:handle.closest('[data-album-page]'),from:Number(handle.closest('[data-album-page]').dataset.albumSlot)}:null;},
  start(g){
   for(const page of pages)for(const e of [page,page.querySelector('.album-paper-turn')])e.getAnimations().forEach(a=>a.finish());
   const box=g.source.getBoundingClientRect();g.positions=pages.map(p=>[p.offsetLeft,p.offsetTop,p.offsetWidth,p.offsetHeight]);g.grab=[g.x-box.left,g.y-box.top];g.origin=localPoint(g.x,g.y);
   g.ghost=paperGhost(g.source,plane,world,box);Object.assign(g.ghost.style,{width:box.width+'px',height:box.height+'px'});g.source.classList.add('drag-source');
  },
  move(g,event){
   Object.assign(g.ghost.style,{left:event.clientX-g.grab[0]+'px',top:event.clientY-g.grab[1]+'px'});
   const [x,y]=localPoint(event.clientX,event.clientY),hit=g.positions.findIndex(([px,py,w,h])=>x>=px-10&&x<=px+w+10&&y>=py-10&&y<=py+h+10);g.to=hit<0?null:hit;
   g.source.style.setProperty('--album-arrival-x',x-g.origin[0]);g.source.style.setProperty('--album-arrival-y',y-g.origin[1]);
   pages.forEach((page,index)=>{const target=index===hit&&hit!==g.from,destination=g.positions[target?g.from:index],origin=g.positions[index];page.classList.toggle('album-swap-preview',target);if(index!==g.from)page.style.translate=`${destination[0]-origin[0]}px ${destination[1]-origin[1]}px`;});
  },
  end(g,_,cancelled){if(!cancelled&&g.to!==null&&g.to!==g.from){g.source.querySelector('[data-album-handle]').focus({preventScroll:true});move({type:'swap',from:g.from,to:g.to});}else g.returnToSource=true;},
  clear(){pages.forEach(page=>{page.classList.remove('drag-source','album-swap-preview');for(const key of ['translate','--album-arrival-x','--album-arrival-y'])page.style.removeProperty(key);});},
 });
 return ()=>{stop();controller.abort();};
}
