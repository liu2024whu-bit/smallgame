import { SCENES, SCENE_BY_ID } from '../data/scenes.js';
import { SCENE_ART } from '../data/assets.js';
import { ITEMS } from '../data/items.js';
import { MAIN_IDS } from '../data/puzzles.js';
import { inventory } from '../core/state.js';
import { escape, icon, itemSprite } from './dom.js';

export function renderRoom(state) {
  const scene = SCENE_BY_ID[state.scene];
  const visible = scene.hotspots.filter(h => h.kind !== 'pickup' || !state.collected.includes(h.target));
  return `<img class="scene-image" src="${SCENE_ART[scene.id]}" alt="${scene.title}，有可以仔细观察的物件" draggable="false"><div class="room-light ${state.solved.includes('flowers') ? 'light-shifted' : ''}"></div><div class="hotspot-layer">${visible.map(h => `<button type="button" class="hotspot ${h.sprite ? 'pickup-hotspot' : ''} ${h.kind === 'pet' ? 'pet-hotspot' : ''}" data-action="hotspot" data-id="${h.id}" aria-label="${escape(h.label)}" style="left:${h.x}%;top:${h.y}%;width:${h.width}%;height:${h.height}%">${h.sprite ? itemSprite(ITEMS[h.target].sprite) : ''}<span class="hotspot-caption">${escape(h.label)}</span></button>`).join('')}</div><button class="scene-arrow previous" data-action="scene-prev" aria-label="向左看">${icon('left')}</button><button class="scene-arrow next" data-action="scene-next" aria-label="向右看">${icon('right')}</button><div class="scene-caption"><span>${escape(scene.title)}</span><small>${escape(scene.subtitle)}</small></div>`;
}

export function renderHud(state, writable) {
  const owned = inventory(state);
  const count = state.solved.filter(id => MAIN_IDS.includes(id)).length;
  return `<div class="hud-top"><button class="wordmark" data-action="home" aria-label="打开开始菜单">第20圈以前<span>A LITTLE ROOM FOR LXY</span></button><div class="hud-tools"><span class="save-status">${writable ? '进度已收好' : '进度暂未保存'}</span><button class="icon-button" data-action="journal" aria-label="打开手账">${icon('book')}</button><button class="icon-button" data-action="sound" aria-label="${state.settings.sound ? '关闭声音' : '打开声音'}">${icon(state.settings.sound ? 'sound' : 'mute')}</button><button class="icon-button" data-action="settings" aria-label="设置">${icon('settings')}</button></div></div><div class="inventory-bar"><div class="inventory-caption">随身物件<span>${count} / ${MAIN_IDS.length}</span></div><div class="inventory-items" aria-label="物品栏">${owned.length ? owned.map(id => `<button type="button" class="inventory-slot ${state.selected === id ? 'selected' : ''}" data-action="item" data-id="${id}" aria-label="${escape(ITEMS[id].name)}" aria-pressed="${state.selected === id}">${itemSprite(ITEMS[id].sprite)}<span>${escape(ITEMS[id].name)}</span></button>`).join('') : '<p class="empty-inventory">先看看桌上的小物件。</p>'}</div><button class="journal-tab" data-action="journal">${icon('book')}手账</button></div><div class="scene-dots" aria-label="视角">${SCENES.map(s => `<button data-action="scene" data-id="${s.id}" class="${s.id === state.scene ? 'current' : ''}" aria-label="看向${s.title}" aria-current="${s.id === state.scene ? 'true' : 'false'}"></button>`).join('')}</div>`;
}

export function renderHome(state) {
  return `<section class="home-panel"><p class="eyebrow">A MEMORY PUZZLE · 1029</p><h1>第20圈以前</h1><p class="home-copy">有一间小小的书房，<br>等你把这一页慢慢翻开。</p><button class="primary-button" data-action="start">${state.begun ? '继续探索' : '打开书房'}${icon('right')}</button><p class="home-footnote">鼠标点击观察 · 自动保存 · 提示随时可看</p><div class="home-links"><button class="text-button" data-action="settings">声音与设置</button><button class="text-button" data-action="how-to">怎样探索</button></div></section>`;
}
