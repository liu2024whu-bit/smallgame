import { CLUES, FLOWERS } from '../data/clues.js';
import { MEMORIES, READING, INTERESTS } from '../data/memories.js';
import { COLLECTIONS, ASSETS } from '../data/assets.js';
import { PUZZLES } from '../data/puzzles.js';
import { ITEMS } from '../data/items.js';
import { discoveredCollections, keepsakes } from '../core/state.js';
import { escape, character, itemSprite, motif, icon } from './dom.js';
import { memoryExhibit } from './exhibits.js';
import { achievementsPage } from './achievements.js';
import { EVIDENCE_TITLES } from './evidence.js';
import { ITEM_EVIDENCE } from '../data/ciphers.js';
import {renderSkyPair} from './sky.js';

export function journalPanel(state, tab = 'clues', view = {}) {
  const tabs = [['clues', '线索','feather'], ['memories', '以前','moon'], ['collections', '收藏','star'], ['activities', '小记','book']];
  const entries = state.solved.filter(id => CLUES[id]);
  const body = {
    clues: `<div class="found-evidence">${Object.entries(EVIDENCE_TITLES).filter(([id]) => state.activities.includes(`evidence:${id}`)).map(([id,title]) => `<button class="text-button" data-action="evidence" data-id="${id}">${title}</button>`).join('')}</div>${entries.length ? entries.map(id => `<article class="journal-entry"><h3>${escape(CLUES[id][0])}</h3><p>${escape(CLUES[id][1])}</p></article>`).join('') : '<p class="empty-note">还没记下什么。</p>'}<div class="progress-garden">${PUZZLES.filter(p => p.optional).map(p => `<span class="${state.solved.includes(p.id) ? 'bloomed' : ''}" title="${escape(p.title)}">${motif(state.solved.includes(p.id) ? 'daisy' : 'leaf')}</span>`).join('')}<small>柜里的小玩意</small></div>`,
    memories: entries.filter(id => MEMORIES[id]).map(id => `<article class="journal-entry"><h3>${escape(MEMORIES[id].title)}</h3><p>${escape(MEMORIES[id].text)}</p></article>`).join('') || '<p class="empty-note">还没写到这里。</p>',
    collections: collectionIndex(state),
    activities: achievementsPage(state, view),
  };
  return { title: '手账', className: 'notebook-dialog', html: `<nav class="notebook-tabs" aria-label="手账内容">${tabs.map(([id, text, mark]) => `<button data-action="journal-tab" data-tab="${id}" class="${tab === id ? 'active' : ''}" aria-current="${tab === id}">${icon(mark)}${text}</button>`).join('')}</nav><div class="notebook-paper">${body[tab] ?? body.clues}</div>` };
}

function collectionIndex(state) {
  const found = discoveredCollections(state);
  const covers={naruto:'memoryNaruto',genshin:'memoryGenshin',hei:'cinema',cities:'campusWhu'};
  return `<div class="collection-index">${Object.entries(COLLECTIONS).map(([id, c]) => `<button class="collection-link ${found.has(id) ? '' : 'collection-hidden'}" aria-label="${escape(c.title)}" data-action="collection" data-id="${id}" ${found.has(id) ? '' : 'disabled'}>${found.has(id) ? id==='sky'?renderSkyPair(0,{cover:true}):covers[id]?`<img src="${ASSETS[covers[id]]}" alt="${escape(c.title)}" draggable="false">`:character(c.asset, 0, c.columns, c.rows, c.names[0]) : `<span class="unfound-art">${motif('envelope')}</span>`}<span>${escape(c.title)}</span>${found.has(id) ? '' : '<small>还没找到</small>'}</button>`).join('')}</div><div class="journal-links"><button class="quiet-button" data-action="reading">书与电影</button><button class="quiet-button" data-action="interests">平时</button><button class="quiet-button" data-action="flowers">花</button></div>`;
}

function giftGallery(state) {
  const found=keepsakes(state);
  return `<div class="collection-gallery gallery-gifts" style="--gallery-columns:3">${found.map(gift=>`<button class="keepsake-card" data-action="keepsake" data-id="${gift.id}" aria-label="${escape(gift.name)}">${character(gift.asset,gift.index,gift.columns,gift.rows,gift.name)}<span>${escape(gift.name)}</span></button>`).join('')}</div>`;
}

export function keepsakePanel(id, state) {
  const gift = keepsakes(state).find(item => item.id === id);
  if (!gift) return { title: '礼物', className: 'inspect-dialog', html: '<p class="empty-note">还没找到。</p>' };
  return { title: gift.name, className: 'inspect-dialog', html: `<div class="keepsake-inspect">${character(gift.asset, gift.index, gift.columns, gift.rows, gift.name)}</div>` };
}

export function collectionPanel(id, context) {
  const collection = COLLECTIONS[id];
  if (!collection) return readingPanel();
  return { title: collection.title, className: `collection-dialog exhibit-${id}`, html: id === 'gifts' ? giftGallery(context.state) : memoryExhibit(id, context) };
}

export function readingPanel(state) {
  return { title: '你推荐的', className: 'notebook-dialog', html: `<div class="reading-shelf">${READING.map((title, i) => `<button data-action="reading-book" data-index="${i}" aria-pressed="${state?.activities.includes(`reading:${i}`) ?? false}" class="reading-book ${state?.activities.includes(`reading:${i}`) ? 'book-opened' : ''}">${motif('book')}<span>${escape(title)}</span></button>`).join('')}</div>` };
}

export function interestsPanel() {
  return { title: '平时', className: 'notebook-dialog', html: `<div class="interest-notes">${INTERESTS.map(([name, text]) => `<article>${motif('star')}<h3>${escape(name)}</h3><p>${escape(text)}</p></article>`).join('')}</div>` };
}

export function flowersPanel(selected = 'rose') {
  return { title: '挑朵花', className: 'flower-dialog', html: `<div class="wish-flowers">${FLOWERS.map(flower => `<button class="wish-flower ${selected === flower.id ? 'chosen-flower' : ''}" data-action="wish-flower" data-id="${flower.id}" aria-pressed="${selected === flower.id}">${motif(flower.id)}<span>${flower.name}</span></button>`).join('')}</div><p class="flower-wish">${escape(FLOWERS.find(f => f.id === selected)?.wish)}</p>` };
}

export function itemPanel(id) {
  const item = ITEMS[id];
  const back = ITEM_EVIDENCE[id];
  return { title: item.name, className: 'inspect-dialog', html: `<div class="item-inspect">${itemSprite(item.sprite)}<p>${escape(item.description)}</p><div class="item-options">${back ? `<button class="text-button" data-action="evidence" data-id="${back}">翻过来</button>` : ''}<button class="text-button" data-action="take-tool" data-id="${id}">拿在手里</button></div></div>` };
}
