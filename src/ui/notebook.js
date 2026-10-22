import { CLUES, FLOWERS } from '../data/clues.js';
import { MEMORIES, READING, INTERESTS, ENDING } from '../data/memories.js';
import { COLLECTIONS } from '../data/assets.js';
import { PUZZLES } from '../data/puzzles.js';
import { ITEMS } from '../data/items.js';
import { escape, character, itemSprite, motif, icon } from './dom.js';
import { renderSkyPair, skyControls } from './sky.js';

export function journalPanel(state, tab = 'clues') {
  const tabs = [['clues', '线索'], ['memories', '小小回忆'], ['collections', '喜欢的东西']];
  const entries = state.solved.filter(id => CLUES[id]);
  const body = {
    clues: `<p class="journal-intro">看到的线索会留在这里。需要时，再翻回来。</p>${entries.length ? entries.map(id => `<article class="journal-entry"><span class="entry-leaf">${motif('leaf')}</span><h3>${escape(CLUES[id][0])}</h3><p>${escape(CLUES[id][1])}</p></article>`).join('') : '<p class="empty-note">这一页还空着。先看看桌上的书签和棉线吧。</p>'}<div class="progress-garden">${PUZZLES.filter(p => p.optional).map(p => `<span class="${state.solved.includes(p.id) ? 'bloomed' : ''}" title="${escape(p.title)}">${motif(state.solved.includes(p.id) ? 'daisy' : 'leaf')}</span>`).join('')}<small>六处可以自由探索的小机关</small></div>`,
    memories: `<p class="journal-intro">几件真实的小事，夹在画页之间。</p>${entries.filter(id => MEMORIES[id]).map(id => `<article class="journal-entry"><h3>${escape(MEMORIES[id].title)}</h3><p>${escape(MEMORIES[id].text)}</p></article>`).join('') || '<p class="empty-note">翻开一页，再慢慢看。</p>'}`,
    collections: `<div class="collection-index">${Object.entries(COLLECTIONS).map(([id, c]) => `<button class="collection-link" aria-label="${escape(c.title)}" data-action="collection" data-id="${id}">${character(c.asset, 0, c.columns, c.rows, c.names[0])}<span>${escape(c.title)}</span></button>`).join('')}</div><div class="journal-links"><button class="quiet-button" data-action="reading">书与电影</button><button class="quiet-button" data-action="interests">游戏与日常</button><button class="quiet-button" data-action="flowers">几朵祝福</button></div>`,
  };
  return { title: '随身手账', className: 'notebook-dialog', html: `<nav class="notebook-tabs" aria-label="手账内容">${tabs.map(([id, text]) => `<button data-action="journal-tab" data-tab="${id}" class="${tab === id ? 'active' : ''}" aria-current="${tab === id}">${text}</button>`).join('')}</nav><div class="notebook-paper">${body[tab] ?? body.clues}</div>` };
}

export function collectionPanel(id, context) {
  const collection = COLLECTIONS[id];
  if (!collection) return readingPanel();
  const figures = id === 'sky' ? `${skyControls(context.state, context.skyPair)}${renderSkyPair(context.state, context.skyPair)}` : `<div class="collection-gallery gallery-${id}" style="--gallery-columns:${collection.columns}">${collection.names.map((name, index) => `<figure>${character(collection.asset, index, collection.columns, collection.rows, name)}<figcaption>${escape(name)}</figcaption></figure>`).join('')}</div>`;
  return { title: collection.title, className: 'collection-dialog', html: `${figures}<p class="collection-caption">${escape(collection.text)}</p>${id === 'prince' ? `<p class="little-quote">“On ne voit bien qu’avec le cœur.”<small>Antoine de Saint-Exupéry · Le Petit Prince</small></p><p class="quote-note">用心看待那些花过时间的事物。<br>书、画、笔记本和语句，都曾来回经过。</p>` : ''}` };
}

export function readingPanel() {
  return { title: '你推荐过的书与电影', className: 'notebook-dialog', html: `<div class="reading-shelf">${READING.map((title, i) => `<div>${motif(i % 2 ? 'book' : 'envelope')}<span>${escape(title)}</span></div>`).join('')}</div><p class="hand-note">留在这里，想读、想看的时候，就再打开。</p>` };
}

export function interestsPanel() {
  return { title: '一些喜欢，一些日常', className: 'notebook-dialog', html: `<div class="interest-notes">${INTERESTS.map(([name, text]) => `<article>${motif('star')}<h3>${escape(name)}</h3><p>${escape(text)}</p></article>`).join('')}</div><p class="hand-note">也为下一款一起玩的游戏，留一个空位。</p>` };
}

export function flowersPanel(selected = 'rose') {
  return { title: '送你几朵小小的祝福', className: 'flower-dialog', html: `<div class="wish-flowers">${FLOWERS.map(flower => `<button class="wish-flower ${selected === flower.id ? 'chosen-flower' : ''}" data-action="wish-flower" data-id="${flower.id}" aria-pressed="${selected === flower.id}">${motif(flower.id)}<span>${flower.name}</span></button>`).join('')}</div><p class="flower-wish">${escape(FLOWERS.find(f => f.id === selected)?.wish)}</p><p class="hand-note">这些花，替今天收下几句祝福。</p>` };
}

export function itemPanel(id) {
  const item = ITEMS[id];
  return { title: item.name, className: 'inspect-dialog', html: `<div class="item-inspect">${itemSprite(item.sprite)}<p>${escape(item.description)}</p><p class="hand-note">物件会留在随身物品里，需要时会放到机关旁。</p></div>` };
}

export function endingPanel(selected = 'rose') {
  const wish = FLOWERS.find(f => f.id === selected) ?? FLOWERS[3];
  return { title: '第20圈，生日快乐', className: 'ending-dialog', html: `<div class="ending-page"><p class="eyebrow">2006 — 2026 · 10 / 29</p><div class="ending-flower">${motif(wish.id)}</div><h2>Happy birthday,<br><span>LXY.</span></h2>${ENDING.map(line => `<p>${escape(line)}</p>`).join('')}<p class="ending-wish">${escape(wish.wish)}</p><span class="unfinished-page">第21圈，和以后。<br>________________</span><button class="quiet-button" data-action="flowers">换一朵祝福</button><button class="primary-button" data-action="close">在书房再坐一会儿${icon('right')}</button></div>` };
}
