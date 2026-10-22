import { BOOKS, BOOK_CLUES } from '../../puzzles/books.js';
import { HASHIRA, screenPorts } from '../../puzzles/screen.js';
import { character, escape, moveButton, shiftControls } from '../dom.js';

export function renderBooks(progress) {
  return `<div class="books-workbench"><div class="borrow-notes">${BOOK_CLUES.map(clue => `<p>${escape(clue)}</p>`).join('')}</div><div class="book-row">${progress.order.map((book, index) => `<div class="book-slot"><div class="illustrated-spine book-tone-${book}"><span>${escape(BOOKS[book])}</span><small>${index + 1}</small></div>${shiftControls(index, 5)}</div>`).join('')}</div><div class="bookmark-figures">${character('genshin', 0, 2, 1, '魈')}${character('genshin', 1, 2, 1, '流浪者')}</div><p class="hand-note">借阅签只是这间书房的机关，不是作品内容问答。</p></div>`;
}

export function renderScreen(progress) {
  const ports = screenPorts(progress.flips);
  return `<div class="screen-workbench"><p class="port-key">入口：第1层　·　出口：第0层　·　接缝两端必须同高</p><div class="accordion-screen">${progress.flips.map((face, index) => `<div class="screen-leaf ${face ? 'back-face' : ''}"><span class="screen-name">${escape(HASHIRA[index])}</span>${character('hashira', index, 3, 3, HASHIRA[index])}<svg class="screen-line" viewBox="0 0 100 100" aria-label="左端第${ports[index][0]}层，右端第${ports[index][1]}层"><path d="M0 ${85 - ports[index][0] * 23} L100 ${85 - ports[index][1] * 23}"/><text x="5" y="${80 - ports[index][0] * 23}">${ports[index][0]}</text><text x="85" y="${80 - ports[index][1] * 23}">${ports[index][1]}</text></svg>${moveButton(face ? '背面' : '正面', { type: 'flip', index }, { key: `screen-${index}` })}</div>`).join('')}</div><button class="text-button" data-action="collection" data-id="hashira">展开看九位柱的画</button></div>`;
}
