import {matrixStyle} from '../raster-plane.js';
import {filmContact,filmHoles} from './film.js';
import {FILM_ORDER} from '../../puzzles/film.js';
import {GARDEN_SIZE as SIZE,GARDEN_CENTERS as CENTERS,GARDEN_LEVELS as LEVELS,GARDEN_SLOTS as SLOTS,GARDEN_PARTS as PARTS,GARDEN_BOOK as BOOK,GARDEN_BOOK_HEIGHT as BOOK_HEIGHT,GARDEN_BOOK_DEPTH as BOOK_DEPTH,GARDEN_DRAWER as DRAWER} from '../../data/garden.js';
import {atlas} from '../dom.js';

const specs={parts:[1536,1024,PARTS],bookmark:[1536,1024,BOOK],board:[1024,1536,[[63,190,897,1160]]]};
const assets={parts:'gardenParts',bookmark:'gardenBookParts',board:'gardenBoard','paper-holder':'gardenNote'};
export const sprite=(asset,index=0)=>atlas(assets[asset],index,{className:'garden-raster'});
const box=(x,y,w,h)=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
export const levelY=h=>LEVELS[0]+h*(LEVELS[1]-LEVELS[0]);
export const plantBox=(i,h)=>{const frame=PARTS[i],s=194/frame[2],anchor=[282,768,1278][i];return [CENTERS[i]-(anchor-frame[0])*s,levelY(h)-499*s,194,535*s];};
export function plant(i,h){return `<span class="garden-plant" data-plant="${i}" style="${box(...plantBox(i,h))}">${sprite('parts',i)}</span>`;}
export const bookAnchor=pin=>[SLOTS[pin][0],SLOTS[pin][1]-(BOOK_HEIGHT-8)+BOOK_DEPTH];
export function bookFigure(pin,{hit=true}={}){
 const [x,y]=bookAnchor(pin),s=BOOK_HEIGHT/967;
 return `<div class="garden-book-mask" style="clip-path:inset(0 0 ${SIZE[1]-SLOTS[pin][1]-9}px)"><span class="garden-book-pose" data-book-pose style="left:${x}px;top:${y}px"><span class="garden-blade" style="${box(-113*s,-48*s,228*s,BOOK_HEIGHT)}">${sprite('bookmark',0)}</span></span></div><div class="garden-book-mask garden-cord-mask" style="clip-path:inset(0 0 ${SIZE[1]-SLOTS[pin][1]-9}px)"><span class="garden-book-pose" data-book-pose style="left:${x}px;top:${y}px"><span class="garden-cord" style="${box(-36*s,-126*s,441*s,995*s)}transform-origin:${36*s}px ${126*s}px;transform:rotateX(60deg) rotateZ(75deg)">${sprite('bookmark',1)}</span></span></div>${hit?`<span class="garden-book-pose" data-book-pose style="left:${x}px;top:${y}px"><button class="garden-book-grip" data-book-grab data-pmove='{"type":"unfit","index":0}' data-return-fitting data-focus="garden-bookmark" aria-label="取回木书签，也可以向上拔出"></button></span>`:''}`;
}
export function plane(asset,index,quad,name){const frame=specs[asset][2][index];return `<span class="garden-plane" data-plane="${name}" data-size="${frame[2]},${frame[3]}" style="width:${frame[2]}px;height:${frame[3]}px;transform:${matrixStyle(quad,frame[2],frame[3])}">${sprite(asset,index)}</span>`;}
export function drawerQuads(amount){
 const {x,width,back,travel,front}=DRAWER,u=Math.max(.0001,amount),spread=16*u,y=back+travel*u;
 return {bed:[[x+8,back],[x+width-8,back],[x+width+spread,y],[x-spread,y]],front:[[x-spread,front+travel*amount],[x+width+spread,front+travel*amount],[x+width+spread,front+110+travel*amount],[x-spread,front+110+travel*amount]],board:[[625,back+18*u],[846,back+18*u],[858,back+130*u],[613,back+130*u]]};
}
function boardPlacement(quad){
 const xs=quad.map(p=>p[0]),ys=quad.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);
 return {bounds:[x,y,Math.max(...xs)-x,Math.max(...ys)-y],quad:quad.map(p=>[p[0]-x,p[1]-y])};
}
export function drawer(amount,taken,camera,opened){
 const q=drawerQuads(amount),left=Math.max(DRAWER.x,camera[0]),right=Math.min(DRAWER.x+DRAWER.width,camera[0]+camera[2]);
 const boardVisible=q.board.every(([x,y])=>x>=camera[0]&&x<=camera[0]+camera[2]&&y>=camera[1]&&y<=camera[1]+camera[3]);
 const drawerVisible=DRAWER.front+DRAWER.travel*amount>=camera[1]&&DRAWER.front+DRAWER.travel*amount+110<=camera[1]+camera[3];
 const placement=boardPlacement(q.board);
 const board=!taken?`<button class="garden-board-hit" style="${box(...placement.bounds)}" data-action="collect-item" data-id="board" data-focus="garden-board" ${!opened||!boardVisible?'disabled':''} aria-label="拿起屉里的装订托板">${plane('board',0,placement.quad,'board').replace('garden-raster','garden-raster item-art')}</button>`:'';
 return `<div class="garden-drawer" data-drawer-amount="${amount}">${plane('parts',5,q.bed,'bed')}${board}${plane('parts',4,q.front,'front')}<button data-drawer-grab class="garden-drawer-hit" data-pmove='{"type":"submit"}' data-focus="garden-drawer" aria-label="拉开底座的小屉" style="${box(left,DRAWER.front+DRAWER.travel*amount,right-left,110)}" ${opened||!drawerVisible?'disabled':''}></button></div>`;
}
export function paintDrawer(root,amount){
 const q=drawerQuads(amount),placement=boardPlacement(q.board),board=root.querySelector('.garden-board-hit');
 if(board)board.style.cssText=box(...placement.bounds);
 for(const name of ['bed','front','board']){const el=root.querySelector(`[data-plane='${name}']`);if(el){const [w,h]=el.dataset.size.split(',').map(Number);el.style.transform=matrixStyle(name==='board'?placement.quad:q[name],w,h);}}
 const handle=root.querySelector('[data-drawer-grab]');if(handle)handle.style.top=DRAWER.front+DRAWER.travel*amount+'px';
}
export function gardenNote(order=FILM_ORDER,passive=false){return `<span class="garden-note">${sprite('paper-holder')}<span class="garden-note-print">${order.map((id,i)=>`<span class="garden-note-row"><span class="garden-note-frame">${filmContact(id)}${filmHoles(id)}</span><span class="garden-note-pot">${sprite('parts',i)}</span></span>`).join('')}</span>${passive?'':'<button class="garden-note-hit" data-action="flower-note" aria-label="拿近看看窗边小样"></button>'}</span>`;}
