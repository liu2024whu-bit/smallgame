import {ASSETS} from '../../data/assets.js';
import {BOOKS} from '../../puzzles/books.js';
import {LIBRARY_MODEL,LIBRARY_PLACEMENT,LIBRARY_CAMERA,LIBRARY_SPINE_FRACTION,LIBRARY_ROOM_REWARDS} from '../../data/library.js';
import {ASSET_LAYOUTS} from '../../data/asset-layouts.js';
import {ITEMS} from '../../data/items.js';
import {inventory} from '../../core/state.js';
import {atlas,escape,itemSprite} from '../dom.js';
import {rasterPlane,matrixStyle} from '../raster-plane.js';
import {rasterStage} from '../raster-stage.js';
import {libraryDrawer,libraryPlace} from '../library-drawer.js';
import {libraryBook,libraryBookHeight,librarySlip,libraryPage} from '../library-papers.js';

const viewAction=(id,book)=>`data-action="library-view" data-id="${id}" ${book===undefined?'':`data-book="${book}"`}`;
export function libraryShelf(progress,{owned=[],miniature=false,painted=false}={}){
 const fitted=progress.fitted[0],done=progress.opened;
 const tag=miniature?'span':'button';
 const housing=painted?'':rasterPlane('libraryHousing',0,LIBRARY_MODEL.housing,{cutout:LIBRARY_MODEL.housingCutout}),[bx,by,bw,bh]=LIBRARY_MODEL.bookArea;
 const books=progress.order.map((book,index)=>{
  const h=LIBRARY_MODEL.bookHeight*libraryBookHeight(book)/93,rect=ASSET_LAYOUTS.librarySpines.frames[book],w=h*rect[2]/rect[3],front=w*LIBRARY_SPINE_FRACTION;
  const position=`left:${(LIBRARY_MODEL.centers[index]-front/2-bx)/bw*100}%;top:${(LIBRARY_MODEL.bookFoot-h-by)/bh*100}%;width:${front/bw*100}%;height:${h/bh*100}%;z-index:${8-index};--book-paint-width:${w/front*100}%`;
  return `<${tag} class="library-spine-button" style="${position}" ${miniature?'':`${viewAction('book',book)} data-library-book="${book}" data-library-index="${index}" data-focus="library-book-${book}" aria-label="看看《${escape(BOOKS[book])}》" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home End Enter"`}>${libraryBook(book)}</${tag}>`;
 }).join('');
 return `<div class="library-shelf ${fitted?'library-fitted':''} ${done?'library-open':''}" data-library-shelf data-attempts="${progress.attempts}">
  ${painted?'':`<div class="library-housing">${rasterStage(housing,LIBRARY_MODEL.width,LIBRARY_MODEL.height)}</div>${libraryDrawer(progress,owned,miniature)}`}
  <div class="library-books" style="${libraryPlace(LIBRARY_MODEL.bookArea)}" aria-label="五本书">${books}</div>
  ${painted?'':atlas('libraryHousing',2,{className:'library-retaining-rail',label:'',style:libraryPlace(LIBRARY_MODEL.rail)})}
  ${miniature||done?'':`<button class="library-drawer-pull" style="${libraryPlace(LIBRARY_MODEL.pull)}" data-library-pull data-pmove='{"type":"submit"}' data-focus="library-drawer" aria-label="拉开下层抽屉"></button>`}
  ${ticketRest(progress,owned,miniature,painted)}
 </div>`;
}
function ticketRest(progress,owned,miniature=false,painted=false){
 const fitted=progress.fitted[0],available=owned.includes('borrowSlip');
 const use=available?'data-action="use-direct" data-id="borrowSlip" data-tool-target="library-slip"':'data-action="library-ask"';
 const tag=miniature?'span':'button';
 let content='';
 if(fitted)content=`<${tag} class="library-rest-slip" ${miniature?'':`${viewAction('slip')} data-focus="library-note" aria-label="看看夹座上的借阅签"`}>${librarySlip()}</${tag}>`;
 else if(!miniature&&!progress.opened)content=`<button class="library-slip-fit" ${use} data-focus="library-fit" aria-label="${available?'把借阅签放进夹座':'空夹座'}"><span>${available?'借阅签':'夹座'}</span></button>`;
 return `<div class="library-ticket-rest" style="${libraryPlace(LIBRARY_MODEL.holder)}">${painted?'':atlas('librarySupports',2,{className:'library-reader-paint',label:''})}${content}</div>`;
}
export function renderBooks(progress,{state,view={}}){
 const owned=inventory(state),mode=['book','slip'].includes(view.library)?view.library:'shelf',book=Number.isInteger(view.book)&&view.book>=0&&view.book<5?view.book:4;
 const content=mode==='book'?libraryPage(book):mode==='slip'?`<button class="library-reading-slip" data-action="library-slip-flip" aria-label="${view.slipBack?'看看借阅签正面':'翻看借阅签背面'}">${librarySlip(!!view.slipBack)}</button>`:libraryShelf(progress,{owned});
 const c=LIBRARY_CAMERA,p=LIBRARY_PLACEMENT,aspect=c.width*1672/(c.height*941);
 const position=`--library-left:${(p.left-c.left)/c.width*100}%;--library-top:${(p.top-c.top)/c.height*100}%;--library-width:${p.width/c.width*100}%;--library-aspect:${aspect}`;
 const reading=mode==='shelf'?'':`<div class="library-reading-actions"><button class="library-return text-button" ${viewAction('shelf')} data-focus="${mode==='book'?'library-book-'+book:'library-note'}" aria-label="回书架">${mode==='book'?'合上':'收好'}</button>${mode==='slip'&&progress.fitted[0]?`<button class="text-button" data-pmove='{"type":"unfit","index":0}' data-return-fitting data-focus="library-unfit" aria-label="从夹座取回借阅签">取下</button>`:''}</div>`;
 return `<div class="library-workbench library-view-${mode}" data-library-view="${mode}" style="${position}"><img class="library-environment" src="${ASSETS.libraryNook}" alt="" draggable="false">${content}</div>${reading}${mode==='shelf'&&view.askedSlip&&!owned.includes('borrowSlip')?'<p class="library-reply" role="status">那张签，还在邮匣里。</p>':''}`;
}
export function libraryInspection(progress,context){
 const {view={}}=context;if(!['book','slip'].includes(view.library))return null;
 const book=Number.isInteger(view.book)&&view.book>=0&&view.book<5?view.book:4;
 return {title:view.library==='slip'?'借阅签':BOOKS[book],className:'workbench-dialog puzzle-books library-reading-dialog',html:renderBooks(progress,context)};
}
export function libraryMiniature(state){
 const {left,top,width}=LIBRARY_PLACEMENT;
 const owned=inventory(state),progress=state.progress.books;
 const rewards=progress.opened?Object.entries(LIBRARY_ROOM_REWARDS).filter(([id])=>!owned.includes(id)).map(([id,quad])=>`<span class="light-plane library-drawer-item" data-room-reward="${id}" style="width:200px;height:200px;transform:${matrixStyle(quad,200,200)}">${itemSprite(ITEMS[id].sprite)}</span>`).join(''):'';
 return `<div class="world-library" style="left:${left}%;top:${top}%;width:${width}%" aria-hidden="true" inert>${libraryShelf(progress,{owned,miniature:true,painted:true})}</div>${rewards?`<div class="library-room-rewards" inert aria-hidden="true">${rasterStage(rewards,1672,941)}</div>`:''}`;
}
