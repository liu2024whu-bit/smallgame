import { NOTEBOOK, STORY } from './content.js';
import { chapterById, closeDialog, escapeHTML, openDialog, store } from './runtime.js';

export function openPrologue() {
  openDialog(`<div class="prologue-dialog"><small>PROLOGUE / 23:46</small><h2>${escapeHTML(STORY.title)}</h2>${STORY.opening.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join('')}<blockquote>“这不是一封要求回答的信，只是一条把时间重新穿起来的红线。”</blockquote><button class="primary-button" type="button" data-close-dialog>进入房间</button></div>`, 'dialog--prologue');
}

export function openHint() {
  const state = store.get();
  const chapter = chapterById(state.active);
  const level = Math.min(state.hintLevels[chapter.id] ?? 0, chapter.hints.length - 1);
  openDialog(`<div class="hint-dialog"><small>HINT ${level + 1}/${chapter.hints.length}</small><h2>${escapeHTML(chapter.title)}</h2><p>${escapeHTML(chapter.hints[level])}</p><div><button class="secondary-button" type="button" data-close-dialog>先自己试试</button>${level < chapter.hints.length - 1 ? '<button class="primary-button" type="button" data-next-hint>再具体一点</button>' : ''}</div></div>`);
}

export function openBirthLock() {
  const state = store.get();
  openDialog(`<div class="lock-dialog"><small>PUZZLE 01</small><h2>四位旧锁</h2><div class="tag-pair"><span>高处：${state.discoveries.cat ? 'Ⅱ ○' : '? ?'}</span><span>地面：${state.discoveries.dog ? '○ Ⅵ' : '? ?'}</span></div><p>两张吊牌属于同一行。站得更高的先读。圆环不是字母，是空位留下的数字。</p><label>四位年份<input id="birthInput" inputmode="numeric" maxlength="4" autocomplete="off"/></label><button class="primary-button" type="button" data-check-birth>转动锁芯</button></div>`);
}

export function openNotebook() {
  const state = store.get();
  if (state.notebookSolved) {
    openDialog('<div class="notebook-result"><small>HIDDEN ITEM</small><h2>并肩灯</h2><p>橙色与银色的两页被重新装订。它们没有被画成同一条路，只在书页边缘互相照亮。</p><button class="primary-button" type="button" data-close-dialog>收好手账</button></div>');
    return;
  }
  openDialog(`<div class="notebook-dialog"><small>OPTIONAL PUZZLE / 104</small><h2>橙色页与银色页</h2><p>把两页各自的四个符号放回它们的叙事顺序。这一页不影响主线通关。</p><div class="notebook-pages">${notebookPage('orange', state.notebook.orange)}${notebookPage('silver', state.notebook.silver)}</div><button class="primary-button" type="button" data-check-notebook>合上双页手账</button></div>`, 'dialog--wide');
}

export function notebookPage(side, list) {
  return `<section class="notebook-page notebook-page--${side}"><h3>${side === 'orange' ? '橙色页' : '银色页'}</h3>${list.map((id, index) => `<article><span>${escapeHTML(NOTEBOOK.tokens[id])}</span><div><button type="button" data-notebook-side="${side}" data-index="${index}" data-direction="-1">↑</button><button type="button" data-notebook-side="${side}" data-index="${index}" data-direction="1">↓</button></div></article>`).join('')}</section>`;
}
