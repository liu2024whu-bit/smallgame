import { CHAPTERS, FUTURE_SLOTS, STORY } from './content.js';
import { app, chapterById, chapterUnlocked, escapeHTML, solvedCount, store } from './runtime.js';
import { flowerGlyph } from './view-helpers.js';
import { renderBirth, renderBreath, renderCities, renderEnding, renderFilm, renderGift, renderRings, renderStars } from './render-chapters.js';
import { renderWind } from './render-wind.js';

export function renderApp() {
  const state = store.get();
  const active = chapterById(state.active);
  const count = solvedCount(state);
  const progress = Math.round((count / CHAPTERS.length) * 100);
  document.title = `${active.title}｜${STORY.title}`;
  app.innerHTML = `<div class="ambient ambient--one" aria-hidden="true"></div><div class="ambient ambient--two" aria-hidden="true"></div>
    <header class="site-header"><button class="brand" type="button" data-open-prologue aria-label="打开序章"><span class="brand__seal">20</span><span><strong>${escapeHTML(STORY.title)}</strong><small>${escapeHTML(STORY.subtitle)}</small></span></button><nav class="header-actions" aria-label="游戏控制"><button type="button" data-open-prologue>序章</button><button type="button" data-open-hint>提示</button><button type="button" data-toggle-sound>${state.sound ? '声音开' : '声音关'}</button><button type="button" data-reset>重置</button></nav></header>
    <main class="layout"><aside class="timeline-panel"><div class="timeline-heading"><div><small>MEMORY INDEX</small><h2>时间装订线</h2></div><span>${count}/${CHAPTERS.length}</span></div><div class="progress-track"><i style="width:${progress}%"></i></div><ol class="timeline-list">${CHAPTERS.map((chapter) => { const unlocked = chapterUnlocked(chapter,state); const solved = Boolean(state.solved[chapter.id]); const current = chapter.id === active.id; return `<li><button type="button" data-chapter="${chapter.id}" class="timeline-item ${solved ? 'is-solved' : ''} ${current ? 'is-current' : ''}" ${unlocked ? '' : 'disabled'}><span class="timeline-item__dot">${solved ? '✓' : chapter.order + 1}</span><span><small>${escapeHTML(chapter.period)}</small><strong>${escapeHTML(chapter.title)}</strong></span><em>${unlocked ? (solved ? chapter.reward : '开启') : '封存'}</em></button></li>`; }).join('')}</ol><div class="future-note"><strong>以后仍可继续生长</strong><p>真实故事、照片和语音均预留独立插槽。</p></div></aside>
      <section class="chapter-stage"><div class="stage-topline"><span>${escapeHTML(active.period)} · ${String(active.order + 1).padStart(2,'0')}</span><span>${state.solved[active.id] ? '这一页已经复原' : '这一页仍有缺口'}</span></div>${renderChapter(active,state)}</section>
      <aside class="clue-panel"><div class="clue-heading"><small>FOUND OBJECTS</small><h2>线索夹</h2></div><div class="clue-grid">${CHAPTERS.filter((chapter) => state.solved[chapter.id]).map((chapter) => `<button type="button" class="clue-token" data-chapter="${chapter.id}"><span>${escapeHTML(chapter.reward === '祝福信' ? '信' : chapter.reward.slice(0,2))}</span><strong>${escapeHTML(chapter.reward)}</strong><small>${escapeHTML(chapter.flower)}</small></button>`).join('') || '<p class="empty-clues">线索会在解开章节后留在这里。</p>'}</div><div class="bouquet" aria-label="已收集的花束">${CHAPTERS.map((chapter) => `<span class="${state.solved[chapter.id] ? 'is-grown' : ''}" title="${escapeHTML(chapter.flower)}">${flowerGlyph(chapter.flower)}</span>`).join('')}</div>${state.solved.gift ? renderFutureSlots() : '<p class="clue-quote">“值得记住的东西，不必总放在最显眼的位置。”</p>'}</aside></main>`;
}

export function renderFutureSlots() { return `<section class="future-slots"><h3>尚未装订的页</h3>${FUTURE_SLOTS.map((slot) => `<article><strong>${escapeHTML(slot.title)}</strong><p>${escapeHTML(slot.note)}</p></article>`).join('')}</section>`; }
export function renderChapter(chapter,state) { if(chapter.id==='birth') return renderBirth(state,chapter); if(chapter.id==='stars') return renderStars(state,chapter); if(chapter.id==='wind') return renderWind(state,chapter); if(chapter.id==='breath') return renderBreath(state,chapter); if(chapter.id==='film') return renderFilm(state,chapter); if(chapter.id==='cities') return renderCities(state,chapter); if(chapter.id==='rings') return renderRings(state,chapter); return renderGift(state,chapter); }
