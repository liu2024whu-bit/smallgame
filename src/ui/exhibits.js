import { ASSETS, COLLECTIONS } from '../data/assets.js';
import { character, escape, motif } from './dom.js';
import { renderSkyPair, skyControls } from './sky.js';
import { postalMarks } from './evidence.js';
import { inventory } from '../core/state.js';

const art = (key, label, className = '') => `<img class="exhibit-art ${className}" src="${ASSETS[key]}" alt="${escape(label)}" draggable="false">`;

function sketch(context) {
  const ink = context.state.activities.includes('art:color') ? 100 : 12;
  return `<div class="color-sketch" style="--ink:${ink}%">${art('memoryGenshin', '画册里的魈与流浪者', 'sketch-underlay')}<div class="sketch-color">${art('memoryGenshin', '', '')}</div><span class="sketch-edge"></span></div><label class="sketch-pencil"><span>添点颜色</span><input aria-label="给画页添点颜色" data-color-drawing type="range" min="0" max="100" value="${ink}"></label>`;
}

function artist(context) {
  const focus = context.view.focus ?? 0;
  return `<div class="artist-table detail-${focus}">${art('memoryNaruto', '带土与卡卡西的稿本、明信片和挂件')}</div><div class="memory-tabs">${['稿本', '明信片', '挂件'].map((label, index) => `<button class="text-button ${focus === index ? 'memory-active' : ''}" data-action="memory-detail" data-index="${index}" aria-pressed="${focus === index}">${label}</button>`).join('')}</div><p class="memory-caption">${['又画了好多。', '一直留着呢。', '小小一只，也认得出。'][focus]}</p>`;
}

function cinema(context) {
  const playing = context.view.playing ?? false;
  return `<div class="cinema-memory ${playing ? 'cinema-playing' : ''}"><div class="cinema-wide">${art('cinema', '小黑、无限和鹿野走过石桥')}<span class="projector-dust" aria-hidden="true"></span><div class="cinema-shutter shutter-left"></div><div class="cinema-shutter shutter-right"></div></div><button class="cinema-ticket" data-action="memory-cinema" aria-label="${playing ? '收起电影票' : '拉开电影票，开场'}"><span>罗小黑战记 Ⅱ</span><small>${playing ? '那场电影。' : '开场'}</small><i>◦ ◦ ◦</i></button></div>`;
}

function fan(context) {
  const selected = context.view.figure ?? 0;
  const names = COLLECTIONS.hashira.names;
  return `<div class="paper-fan"><div class="fan-leaves">${names.map((name, index) => `<button class="fan-leaf ${selected === index ? 'fan-chosen' : ''}" style="--fan-angle:${(index - 4) * 8}deg" data-action="memory-figure" data-index="${index}" aria-label="${escape(name)}" aria-pressed="${selected === index}">${character('hashira', index, 3, 3, name)}</button>`).join('')}</div><div class="fan-index">${names.map((name,index) => `<button class="text-button" data-action="memory-figure" data-index="${index}" aria-label="${escape(name)}" aria-pressed="${selected === index}">${['水','蝶','炎','音','霞','恋','蛇','风','岩'][index]}</button>`).join('')}</div><p>${escape(names[selected])}</p></div><p class="memory-caption">那阵子，你很喜欢他们的故事。</p>`;
}

function prince(context) {
  const open = context.view.open ?? false;
  return `<div class="prince-keepsake ${open ? 'prince-open' : ''}"><div class="prince-cover">${character('gifts', 2, 3, 2, '小王子笔记本')}</div><div class="prince-page">${character('princeHei', 0, 2, 2, '小王子和玫瑰')}<p>“On ne voit bien qu’avec le cœur.”</p></div></div><div class="memory-tabs"><button class="text-button" data-action="memory-open">${open ? '合上' : '翻开'}</button></div><p class="memory-caption">看见小王子，就想起你。</p>`;
}

function postcards(context) {
  const back = context.view.back ?? false;
  const index = context.view.card ?? 0;
  return `<div class="postcard-desk"><button class="postcard ${back ? 'postcard-back' : ''}" data-action="memory-postcard" aria-label="翻看明信片">${back ? `<div class="postcard-writing"><span>${index ? '南京' : '武汉'}</span>${postalMarks(index, context.view.reflected)}<p>${index ? '南京，真不错。' : '武汉，留在这一页。'}</p><small>L.</small></div>` : character('campuses', index, 2, 1, index ? '南京大学' : '武汉大学')}</button><span class="postcard-thread">${motif('leaf')}</span></div><div class="memory-tabs">${['武汉', '南京'].map((name, card) => `<button class="text-button" data-action="memory-card" data-index="${card}" aria-pressed="${index === card}">${name}</button>`).join('')}<button class="text-button" data-action="campus" data-index="${index}">展开折页</button>${back && index === 1 && inventory(context.state).includes('mirror') ? `<button class="text-button" data-action="memory-mirror" aria-pressed="${!!context.view.reflected}">${context.view.reflected ? '移开镜子' : '照一照'}</button>` : ''}</div>`;
}

export function memoryExhibit(id, context) {
  const views = { genshin: sketch, naruto: artist, hei: cinema, hashira: fan, prince, cities: postcards,
    sky: () => `${renderSkyPair(context.state, context.skyPair)}${skyControls(context.state, context.skyPair)}<p class="memory-caption">上线啦。</p>` };
  return (views[id] ?? (() => ''))(context);
}
