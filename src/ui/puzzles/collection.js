import { BOOKS, BOOK_CLUES } from '../../puzzles/books.js';
import { HASHIRA, screenPorts } from '../../puzzles/screen.js';
import { BOOKMARKS } from '../../data/assets.js';
import { character, escape, moveButton, shiftControls } from '../dom.js';

export function renderBooks(progress) {
  return `<div class="books-workbench"><div class="borrow-notes">${BOOK_CLUES.map(clue => `<p>${escape(clue)}</p>`).join('')}</div><div class="book-row">${progress.order.map((book, index) => {
    const bookmark = BOOKMARKS.find(mark => mark.book === book);
    return `<div class="book-slot">${bookmark ? `<span class="character-bookmark">${character('genshin', bookmark.figure, 2, 1, bookmark.name)}<small>${escape(bookmark.name)}</small></span>` : ''}<div class="illustrated-spine book-tone-${book}"><span>${escape(BOOKS[book])}</span><small>${index + 1}</small></div>${shiftControls(index, 5)}</div>`;
  }).join('')}</div></div>`;
}

export function renderScreen(progress) {
  const ports = screenPorts(progress.flips);
  return `<div class="screen-workbench"><p class="port-key">入口 1 → 出口 0</p><div class="accordion-screen">${progress.flips.map((face, index) => `<div class="screen-leaf ${face ? 'back-face' : ''}"><span class="screen-name"><small>${index + 1}</small> ${escape(HASHIRA[index])}</span>${character('hashira', index, 3, 3, HASHIRA[index])}<svg class="screen-line" viewBox="0 0 100 100" aria-label="左端第${ports[index][0]}层，右端第${ports[index][1]}层"><path d="M0 ${85 - ports[index][0] * 23} L100 ${85 - ports[index][1] * 23}"/><text x="5" y="${80 - ports[index][0] * 23}">${ports[index][0]}</text><text x="85" y="${80 - ports[index][1] * 23}">${ports[index][1]}</text></svg>${moveButton(face ? '背面' : '正面', { type: 'flip', index }, { key: `screen-${index}` })}</div>`).join('')}</div><button class="text-button" data-action="collection" data-id="hashira">看看画</button></div>`;
}
