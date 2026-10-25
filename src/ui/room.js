import {gardenMiniature} from './puzzles/flowers.js';
import {lightMiniature} from './puzzles/light.js';
import {pressMiniature} from './puzzles/press.js';
import {cloudMiniature} from './puzzles/cloud.js';
import { GAME_DATE } from '../data/calendar.js';
import { roomCompanions } from './companions.js';
import { SCENES, SCENE_BY_ID } from '../data/scenes.js';
import { SCENE_ART, ASSETS } from '../data/assets.js';
import { ITEMS } from '../data/items.js';
import { inventory } from '../core/state.js';
import { sceneOpen } from '../core/exploration.js';
import { roomToolTarget } from '../data/tool-uses.js';
import { sceneChanges, paintMask } from '../data/scene-changes.js';
import { cabinetMechanisms } from './miniatures.js';
import { partyRoom } from './party-room.js';
import { escape, icon, itemSprite } from './dom.js';

const LIVE_SCENE_PROGRESS={desk:['paper','calendar','calibration'],window:['flowers','cloud'],party:['sweets','ribbons','birthdayLock']};
export function sceneSignature(state){
  return JSON.stringify([state.scene,state.collected,sceneChanges(state).map(c=>c.puzzle??c.activity),state.solved,state.ending,(LIVE_SCENE_PROGRESS[state.scene]??[]).map(id=>state.progress[id])]);
}

export function renderScenePicture(state) {
  const scene=SCENE_BY_ID[state.scene];
  const art=scene.id==='birthday'&&state.ending?ASSETS.birthdayLit:scene.id==='party'&&state.solved.includes('birthdayLock')?ASSETS.partyOpen:SCENE_ART[scene.id];
  return `<img class="scene-image" src="${art}" alt="${scene.title}" draggable="false">${state.scene==='desk'?`<img class="scene-change" src="${ASSETS.lightCorner}" alt="" aria-hidden="true" style="animation:none;mask-image:${paintMask([55.2,27.8,19.8,29])}" draggable="false">`:''}${sceneChanges(state).map(change=>`<img class="scene-change" data-world-change="${change.puzzle??change.activity}" src="${ASSETS[change.asset]}" alt="${change.alt}" style="mask-image:${paintMask(change.region)}" draggable="false">`).join('')}${state.scene==='desk'?`<span class="world-calendar-date ${state.solved.includes('calendar')?'date-unlocked':''}" aria-hidden="true"><small>${GAME_DATE.year} / ${GAME_DATE.month}</small><b>${GAME_DATE.day}</b></span>`:''}${state.scene==='window'?cloudMiniature(state.progress.cloud,state.solved.includes('cloud'),inventory(state))+gardenMiniature(state.progress.flowers,state.solved.includes('flowers')):''}${state.scene==='desk'?lightMiniature(state.progress.calibration,state.solved.includes('calibration'))+pressMiniature(state.progress.paper,state.solved.includes('paper'),inventory(state)):''}${cabinetMechanisms(state)}${partyRoom(state)}`;
}

export function renderRoom(state) {
  const scene = SCENE_BY_ID[state.scene];
  const visible = scene.hotspots.filter(h => (h.kind !== 'pickup' || !state.collected.includes(h.target))&&(!h.hideAfter||!state.solved.includes(h.hideAfter)));
  return `${renderScenePicture(state)}<div class="room-light ${state.solved.includes('flowers') ? 'light-shifted' : ''}"></div><div class="hotspot-layer">${visible.map(h=>hotspotButton(h,state)).join('')}</div>${roomCompanions(scene.id)}<button class="scene-arrow previous" data-action="scene-prev" aria-label="向左看">${icon('left')}</button><button class="scene-arrow next" data-action="scene-next" aria-label="向右看">${icon('right')}</button><button class="scene-caption" data-action="rooms" aria-label="看看小屋有哪些地方"><span>${escape(scene.title)}</span>${icon('feather')}</button>`;
}

function hotspotButton(h,state){
  const target=roomToolTarget(state,h.id)??'';
  return `<button type="button" class="hotspot ${h.sprite?'pickup-hotspot':''} ${h.kind==='pet'?'pet-hotspot':''} ${h.x>80?'caption-inward-right':h.x<20?'caption-inward-left':''}" data-action="hotspot" data-id="${h.id}" ${target?`data-tool-target="${target}"`:''} aria-label="${escape(h.label)}" style="left:${h.x}%;top:${h.y}%;width:${h.width}%;height:${h.height}%">${h.sprite?itemSprite(ITEMS[h.target].sprite):''}<span class="hotspot-caption">${escape(h.label)}</span></button>`;
}

export function renderHud(state, writable) {
  const owned = inventory(state);
  return `<div class="hud-top"><button class="wordmark" data-action="home" aria-label="开始菜单">第20圈以前<span>给 LXY</span></button><div class="hud-tools"><span class="save-status">${writable ? '已保存' : '尚未保存'}</span><button class="icon-button" data-action="journal" aria-label="打开手账">${icon('book')}</button><button class="icon-button" data-action="music" aria-label="唱片架">${icon('music')}</button><button class="icon-button" data-action="sound" aria-label="${state.settings.sound ? '关闭声音' : '打开声音'}">${icon(state.settings.sound ? 'sound' : 'mute')}</button><button class="icon-button" data-action="settings" aria-label="设置">${icon('settings')}</button></div></div><div class="inventory-bar"><div class="inventory-caption">随身物件</div><div class="inventory-items" aria-label="物品栏">${owned.length ? owned.map(id => `<button type="button" class="inventory-slot ${state.selected === id ? 'selected' : ''}" data-action="item" data-id="${id}" data-inventory-drag="${id}" aria-label="${escape(ITEMS[id].name)}" aria-pressed="${state.selected === id}">${itemSprite(ITEMS[id].sprite)}<span>${escape(ITEMS[id].name)}</span></button>`).join('') : '<p class="empty-inventory">还空着</p>'}</div><button class="journal-tab" data-action="journal">${icon('book')}手账</button></div><div class="scene-dots" aria-label="视角">${SCENES.map(s=>{const open=sceneOpen(state,s.id);return `<button data-action="scene" data-id="${s.id}" class="${s.id===state.scene?'current':''} ${open?'':'scene-locked'}" aria-label="看向${s.title}${open?'':'，门还关着'}" aria-current="${s.id===state.scene}">${open?'':icon('lock')}<span class="scene-dot-label">${escape(s.title)}</span></button>`;}).join('')}</div>`;
}
