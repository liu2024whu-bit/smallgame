import {BOOKS} from '../puzzles/books.js';
import {ASSET_LAYOUTS} from '../data/asset-layouts.js';
import {LIBRARY_BOOKMARKS} from '../data/library.js';
import {ITEMS} from '../data/items.js';
import {atlas,character,escape,itemSprite} from './dom.js';

export function libraryBookmark(book){
 const mark=LIBRARY_BOOKMARKS[book];if(!mark)return '';
 return `<span class="library-tab">${atlas('postalSupports',4,{className:'library-tab-paper',label:''})}<span class="library-tab-print">${character('genshin',mark.figure,2,1,mark.name)}</span><small>${mark.name}</small></span>`;
}
export function libraryBook(book,{mark=true,title=true}={}){
 const frame=ASSET_LAYOUTS.librarySpines.frames[book<0?5:book];
 const tallest=Math.max(...ASSET_LAYOUTS.librarySpines.frames.slice(0,5).map(frame=>frame[3]));
 const words=book<0?'':escape(BOOKS[book]);
 return `<span class="library-book-paint" data-book="${book}" style="aspect-ratio:${frame[2]}/${frame[3]};--book-height:${93*frame[3]/tallest}%">${mark?libraryBookmark(book):''}${atlas('librarySpines',book<0?5:book,{className:'library-book-cloth',label:''})}${title?`<span class="library-spine-title">${words}</span>`:''}</span>`;
}
export function librarySlip(back=false){
 return `<span class="library-slip-leaf ${back?'library-slip-turned':''}"><span class="library-slip-face" ${back?'data-copy-hidden':''}>${itemSprite(ITEMS.borrowSlip.sprite)}</span><span class="library-slip-rear" ${back?'':'data-copy-hidden'}>${atlas('postalSupports',4,{className:'library-slip-paper',label:''})}<span class="library-slip-print"><span>书签之间</span><span class="library-gap-diagram">${[0,-1,-1,2].map(book=>`<span>${libraryBook(book,{title:false})}</span>`).join('')}</span><span>隔着两本书。</span></span></span></span>`;
}
export function libraryPage(book){
 const notes=book===4?`<div class="library-prince-notes"><p>不在两端。</p><div class="library-adjacent">${libraryBook(4,{mark:false,title:false})}${libraryBook(1,{mark:false,title:false})}</div><p>知更鸟挨在我后面。</p></div>`:book===3?`<div class="library-pride-note"><p>这本在左，</p>${libraryBookmark(0)}<p>魈的书签在右。</p></div>`:libraryBookmark(book);
 return `<div class="library-page-spread">${atlas('libraryPages',0,{className:'library-open-pages',label:''})}<span class="library-page-title">${escape(BOOKS[book])}</span><div class="library-page-notes note-book-${book}">${notes}</div></div>`;
}
export function librarySlipPanel(context){
 return {title:'借阅签',className:'inspect-dialog library-slip-dialog',html:`<div class="library-slip-inspect"><button data-action="library-slip-flip" aria-label="${context.view?.slipBack?'看看借阅签正面':'翻看借阅签背面'}">${librarySlip(!!context.view?.slipBack)}</button></div><div class="item-options"><button class="text-button" data-action="take-tool" data-id="borrowSlip">拿在手里</button></div>`};
}
