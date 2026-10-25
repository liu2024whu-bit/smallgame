import {ASSETS} from '../../data/assets.js';
import {ITEMS} from '../../data/items.js';
import {BOOKS} from '../../puzzles/books.js';
import {LIBRARY_DRAWER_STROKE} from '../../data/library.js';
import {inventory} from '../../core/state.js';
import {atlas,itemSprite,escape} from '../dom.js';
import {libraryBook,librarySlip,libraryPage} from '../library-papers.js';

const viewAction=(id,book)=>`data-action="library-view" data-id="${id}" ${book===undefined?'':`data-book="${book}"`}`;
function drawer(progress,owned,miniature){
 const tag=progress.opened&&!miniature?'button':'span';
 const pickup=(id,cls)=>!owned.includes(id)?`<${tag} class="library-reward ${cls}" ${tag==='button'?`data-action="collect-item" data-id="${id}" aria-label="拿起${ITEMS[id].name}"`:'aria-hidden="true"'}>${itemSprite(ITEMS[id].sprite)}</${tag}>`:'';
 return `<div class="library-drawer-pocket"><div class="library-drawer">${atlas('libraryMain',1,{className:'library-drawer-paint',label:''})}${pickup('pageA','library-page-reward')}${pickup('needle','library-needle-reward')}</div></div>`;
}
export function libraryShelf(progress,{owned=[],miniature=false,askedSlip=false}={}){
 const fitted=progress.fitted[0],done=progress.opened;
 const tag=miniature?'span':'button';
 return `<div class="library-shelf ${fitted?'library-fitted':''} ${done?'library-open':''}" data-library-shelf data-attempts="${progress.attempts}" style="--library-drawer-shut:-${LIBRARY_DRAWER_STROKE}%">
  ${atlas('libraryMain',0,{className:'library-case-paint',label:''})}
  ${drawer(progress,owned,miniature)}
  <div class="library-books" aria-label="五本书">${progress.order.map((book,index)=>`<${tag} class="library-spine-button" ${miniature?'':`${viewAction('book',book)} data-library-book="${book}" data-library-index="${index}" data-focus="library-book-${book}" aria-label="看看《${escape(BOOKS[book])}》" aria-keyshortcuts="ArrowLeft ArrowRight Home End Enter"`}>${libraryBook(book)}${book===4?atlas('libraryPages',1,{className:'library-page-corner',label:''}):''}</${tag}>`).join('')}</div>
  ${atlas('libraryMain',3,{className:'library-retaining-rail',label:''})}
  ${miniature||done?'':`<button class="library-drawer-pull" data-library-pull data-pmove='{"type":"submit"}' data-focus="library-drawer" aria-label="拉开下层抽屉"></button>`}
  ${ticketRest(progress,owned,askedSlip,miniature)}
 </div>`;
}
function ticketRest(progress,owned,asked=false,miniature=false){
 const fitted=progress.fitted[0],available=owned.includes('borrowSlip');
 const use=available?'data-action="use-direct" data-id="borrowSlip" data-tool-target="library-slip"':'data-action="library-ask"';
 const tag=miniature?'span':'button';
 return `<div class="library-ticket-rest">${atlas('libraryMain',2,{className:'library-reader-paint',label:''})}${fitted||progress.opened?`<${tag} class="library-rest-slip" ${miniature?'':`${viewAction('slip')} data-focus="library-note" aria-label="看看夹座上的借阅签"`}>${librarySlip()}</${tag}>${fitted&&!miniature?`<button class="library-slip-remove text-button" data-pmove='{"type":"unfit","index":0}' aria-label="取回借阅签">取回</button>`:''}`:miniature?'':`<button class="library-slip-fit" ${use} data-focus="library-fit" aria-label="${available?'把借阅签放进夹座':'空夹座'}">${available?'借阅签':'夹座'}</button>`}${!available&&asked&&!miniature?'<p class="library-missing-slip">那张签，还在邮匣里。</p>':''}</div>`;
}
export function renderBooks(progress,{state,view={}}){
 const owned=inventory(state),mode=view.library??'shelf',book=Number.isInteger(view.book)&&view.book>=0&&view.book<5?view.book:4;
 const content=mode==='book'?libraryPage(book):mode==='slip'?`<button class="library-reading-slip" data-action="library-slip-flip" aria-label="${view.slipBack?'看看借阅签正面':'翻看借阅签背面'}">${librarySlip(!!view.slipBack)}</button>`:libraryShelf(progress,{owned,askedSlip:view.askedSlip});
 return `<div class="library-workbench library-view-${mode}" data-library-view="${mode}"><img class="library-environment" src="${ASSETS.libraryNook}" alt="" draggable="false">${content}${mode==='shelf'?'':`<button class="library-return text-button" ${viewAction('shelf')} data-focus="${mode==='book'?'library-book-'+book:'library-note'}" aria-label="回书架">${mode==='book'?'合上':'收好'}</button>`}</div>`;
}
export function libraryMiniature(state){
 return `<div class="world-library" aria-hidden="true" inert>${libraryShelf(state.progress.books,{owned:inventory(state),miniature:true})}</div>`;
}
