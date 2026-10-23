import { createStore } from './core/store.js';
import { serializable, inventory, access } from './core/state.js';
import { sceneOpen, openScenes, neighborScene, birthdayReady } from './core/exploration.js';
import { ROOM_TOOL_TARGETS, toolFor } from './data/tool-uses.js';
import { MAX_SAVE_BYTES, parseSave } from './core/storage.js';
import { SCENE_BY_ID } from './data/scenes.js';
import { SCENE_ART } from './data/assets.js';
import { sceneChanges } from './data/scene-changes.js';
import { ITEMS } from './data/items.js';
import { renderRoom, renderHud, renderHome } from './ui/room.js';
import { renderPanel } from './ui/panels.js';
import { createDialog } from './ui/dialog.js';
import { announce, itemSprite } from './ui/dom.js';
import { createAudio } from './services/audio.js';
import { fitHandle } from './services/tool-motion.js';
import { bindInteractions } from './ui/interactions/index.js';
import { viewActions } from './ui/view-actions.js';
import { blockedMove } from './ui/interactions/feedback.js';
import { bindInventoryUse } from './ui/interactions/inventory.js';

const app = document.querySelector('#app');
app.innerHTML = '<div class="game-shell"><div id="room-stage" class="room-stage"></div><div id="hud"></div><div id="home"></div></div><dialog id="explore-dialog" aria-labelledby="dialog-title"></dialog><p id="toast" role="status" class="toast" hidden></p><input id="save-file" type="file" accept=".json,application/json" hidden>';
const store = createStore({ getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) });
const audio = createAudio();
const ui = { panel: null, stack: [], home: !store.get().begun, skyPair: 0, petAwake: false };
const stage = document.querySelector('#room-stage');
const dialog = createDialog(document.querySelector('#explore-dialog'), closePanel);
let roomSignature = '', hudSignature = '', toastTimer;
let disposeInteractions = () => {};
let fittingHandle=false,greetingTimer;

function context() { return { state: store.get(), view: ui.panel?.view ?? {}, skyPair: ui.skyPair, flower: store.get().settings.flower, petAwake: ui.petAwake, writable: store.writable() }; }
function activity(id) { store.dispatch({ type: 'activity', id }); }
function performMove(move) {
  if (ui.panel?.type !== 'puzzle') return false;
  const id = ui.panel.id;
  const changed = store.dispatch({ type: 'move', id, move });
  if (changed) {
    if (id === 'melody' && ['note','set-note'].includes(move.type)) audio.previewNote(store.get().progress.melody.notes[move.index]);
    else if(id==='cocoa')audio.pour();
    else audio.material(id === 'wordlock' ? 'key' : id === 'postbox' || move.type === 'set-turn' ? 'metal' : ['paper', 'paperBack', 'album', 'screen', 'film'].includes(id) ? 'paper' : 'wood');
  }
  return changed;
}
function renderDialog(preserveFocus = true) {
  disposeInteractions();
  if (!ui.panel) return;
  dialog.show(renderPanel(ui.panel, context()), { preserveFocus });
  if (ui.panel.type === 'ambient') audio.rain(); else audio.stopRain();
  const state = store.get(), id = ui.panel.type === 'puzzle' ? ui.panel.id : null;
  disposeInteractions = bindInteractions(dialog.element, { id, progress: state.progress[id], solved: state.solved.includes(id), move: performMove, activity });
}
function render(state) {
  const signature = `${state.scene}:${state.collected.join()}:${sceneChanges(state).map(change=>change.puzzle??change.activity).join()}:${state.solved.includes('flowers')}:${state.ending}`;
  if (signature !== roomSignature) {
    const sameScene = stage.dataset.scene === state.scene;
    const previousPaint=new Set([...stage.querySelectorAll('[data-world-change]')].map(el=>el.dataset.worldChange));
    stage.innerHTML = renderRoom(state); stage.dataset.scene = state.scene; roomSignature = signature;
    if (sameScene) stage.querySelector('.scene-image').style.animation = 'none';
    if(sameScene)stage.querySelectorAll('[data-world-change]').forEach(el=>{if(previousPaint.has(el.dataset.worldChange))el.style.animation='none';});
  }
  const hudKey = JSON.stringify([inventory(state), state.selected, state.scene, state.solved.length,state.usedTools, state.settings.sound, store.writable()]);
  if (hudKey !== hudSignature) {
    const owned = new Set([...document.querySelectorAll('.inventory-slot')].map(element => element.dataset.id));
    document.querySelector('#hud').innerHTML = renderHud(state, store.writable()); hudSignature = hudKey;
    document.querySelectorAll('.inventory-slot').forEach(element => { if (!owned.has(element.dataset.id)) element.classList.add('new-item'); });
  }
  document.querySelector('#home').innerHTML = ui.home ? renderHome(state) : '';
  document.querySelector('.game-shell').classList.toggle('at-home', ui.home);
  document.documentElement.classList.toggle('show-hotspots', state.settings.hotspots);
  document.documentElement.classList.toggle('reduce-motion', !state.settings.motion);
  audio.configure(state.settings);
  renderDialog();
}
function openPanel(panel, push = true) {
  if (push && ui.panel) ui.stack.push(ui.panel);
  ui.panel = panel;
  renderDialog(false);
}
function closePanel() {
  disposeInteractions();
  audio.stopMelody();
  audio.stopRain();
  ui.panel = ui.stack.pop() ?? null;
  if (ui.panel) renderDialog(false); else dialog.hide();
}
function toast(text) {
  const element = document.querySelector('#toast');
  element.textContent = text; element.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { element.hidden = true; }, 3500);
  announce(text);
}
function look(direction) {
  store.dispatch({ type: 'scene', id: neighborScene(store.get(),direction) });
  audio.material('paper');
}
function closeAllPanels(){ui.stack=[];ui.panel=null;disposeInteractions();audio.stopMelody();audio.stopRain();dialog.hide();}
function goScene(id){if(!sceneOpen(store.get(),id)){openPanel({type:'passage',id});return;}closeAllPanels();store.dispatch({type:'scene',id});}
async function useTool(item,target){
  const state=store.get();
  if(!inventory(state).includes(item)||toolFor(target)!==item){toast('这里暂时用不上。');return false;}
  if(target==='birthday-door'){
    if(fittingHandle)return false;
    if(!state.solved.includes('stitch')){toast('画册还没有装好。');return false;}
    fittingHandle=true;
    try{await fitHandle(document.querySelector('.handle-socket')??document.querySelector('[data-tool-target="birthday-door"]'),itemSprite(3));}finally{fittingHandle=false;}
    store.dispatch({type:'use-tool',item,target});
    if(sceneOpen(store.get(),'birthday')){goScene('birthday');audio.material('metal');return true;}
    toast('画册还没有装好。');return false;
  }
  if(target==='postcard-mirror'){
    store.dispatch({type:'select',id:null});openCollection('cities');ui.panel.view={card:1,back:true,reflected:true};renderDialog(false);audio.material('glass');return true;
  }
  const id=target==='chocolate-cover'?'chocolate':'flowers';
  if(!access(state,id).ready){openPuzzle(id);return false;}
  if(ui.panel?.type!=='puzzle'||ui.panel.id!==id){closeAllPanels();openPuzzle(id);}
  const move=id==='chocolate'?{type:'cover'}:{type:'set-pin',index:Number(target.split(':')[1])};
  if(state.selected)store.dispatch({type:'select',id:null});
  return performMove(move);
}
function openPuzzle(id) { openPanel({ type: 'puzzle', id }); }
function openCollection(id) { store.dispatch({ type: 'discover', id }); activity(`memory:${id}`); openPanel({ type: 'collection', id }); }
function hotspot(id) {
  const state = store.get();
  const spot = SCENE_BY_ID[state.scene].hotspots.find(h => h.id === id);
  if (!spot) return;
  const target=ROOM_TOOL_TARGETS[`${state.scene}:${id}`];
  if(state.selected&&target){useTool(state.selected,target);return;}
  const handlers = {
    pickup: () => { if (store.dispatch({ type: 'pickup', id: spot.target })) { audio.material('pickup'); toast(`收好${ITEMS[spot.target].name}。`); } },
    puzzle: () => openPuzzle(spot.revisit && state.solved.includes(spot.revisitAfter) ? spot.revisit : spot.target),
    album: () => openPuzzle(state.solved.includes('album') ? 'stitch' : 'album'),
    collection: () => openCollection(spot.target),
    evidence: () => { activity(`evidence:${spot.target}`); openPanel({ type: 'evidence', id: spot.target }); },
    ambient: () => { audio.material('glass'); openPanel({ type: 'ambient' }); },
    pet: () => { ui.petAwake = false; openPanel({ type: 'pet', id: spot.target }); },
    ending: () => { if(state.scene!=='birthday'){goScene('birthday');return;}if(birthdayReady(state)){store.dispatch({type:'ending'});audio.success();openPanel({type:'ending'});}else openPanel({type:'birthday-wait'}); },
    'birthday-note':()=>{if(spot.target==='fries')activity('birthday:fries');openPanel({type:'birthday-note',id:spot.target});},
  };
  (handlers[spot.kind] ?? (() => openPanel({ type: spot.kind })))();
}
function currentPuzzle(action) {
  if (ui.panel?.type === 'puzzle') store.dispatch({ type: action, id: ui.panel.id });
}
function setting(key, value) { store.dispatch({ type: 'setting', key, value }); }
function exportSave() {
  const blob = new Blob([JSON.stringify(serializable(store.get()), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = 'smallgame-1029-save.json'; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('存档已保存。');
}
const actions = {
  ...viewActions({ panel: () => ui.panel, render: renderDialog, activity }),
  start: async () => { ui.home = false; await audio.resume(); audio.ambient(); store.dispatch({ type: 'start' }); },
  home: () => { ui.home = true; render(store.get()); },
  'scene-prev': () => look(-1), 'scene-next': () => look(1),
  scene: button => goScene(button.dataset.id),
  hotspot: button => hotspot(button.dataset.id),
  item: button => { store.dispatch({ type: 'select', id: button.dataset.id }); openPanel({ type: 'item', id: button.dataset.id }); },
  'take-tool':button=>{store.dispatch({type:'select',id:button.dataset.id});closeAllPanels();},
  'arm-tool':button=>store.dispatch({type:'select',id:button.dataset.id}),
  'use-direct':button=>useTool(button.dataset.id,button.dataset.toolTarget),
  'birthday-unwrap':()=>{if(store.get().ending){activity('birthday:unwrap');audio.material('paper');}},
  close: closePanel,
  journal: () => openPanel({ type: 'journal', tab: 'clues' }),
  'journal-tab': button => { ui.panel = { type: 'journal', tab: button.dataset.tab }; renderDialog(false); },
  collection: button => openCollection(button.dataset.id),
  evidence: button => { activity(`evidence:${button.dataset.id}`); openPanel({ type: 'evidence', id: button.dataset.id }); },
  campus: button => openPanel({ type:'campus', id:Number(button.dataset.index) }),
  keepsake: button => openPanel({ type: 'keepsake', id: button.dataset.id }),
  encore: () => openPanel({ type: 'encore' }),
  reading: () => openPanel({ type: 'reading' }), interests: () => openPanel({ type: 'interests' }),
  flowers: () => openPanel({ type: 'flowers' }),
  'wish-flower': button => { setting('flower', button.dataset.id); activity(`flower:${button.dataset.id}`); audio.material('glass'); },
  settings: () => openPanel({ type: 'settings' }), 'how-to': () => openPanel({ type: 'how-to' }),
  sound: async () => { setting('sound', !store.get().settings.sound); await audio.resume(); if (store.get().begun) audio.ambient(); },
  undo: () => currentPuzzle('undo'), 'reset-puzzle': () => currentPuzzle('reset'), hint: () => currentPuzzle('hint'),
  'sky-pair': () => { ui.skyPair = 1 - ui.skyPair; renderDialog(); },
  'pet-touch': () => { ui.petAwake = !ui.petAwake; if (ui.petAwake) activity(`pet:${ui.panel.id}`); renderDialog(); audio.material('pet'); },
  'hei-greet': button => { window.clearTimeout(greetingTimer);button.classList.remove('hei-greeting');void button.offsetWidth;button.classList.add('hei-greeting');greetingTimer=window.setTimeout(()=>button.classList.remove('hei-greeting'),2200);audio.material('pet'); },
  'play-melody': () => audio.melody(store.get().progress.melody.notes, index => {
    dialog.element.querySelectorAll('.music-pin-column').forEach((el, i) => el.classList.toggle('playing', index === i));
    window.setTimeout(() => dialog.element.querySelectorAll('.playing').forEach(el => el.classList.remove('playing')), 350);
  }),
  export: exportSave, import: () => document.querySelector('#save-file').click(),
  fullscreen: async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { toast('也可以使用浏览器的全屏功能。'); } },
  restart: () => openPanel({ type: 'restart' }),
  'confirm-restart': () => { ui.stack = []; ui.panel = null; dialog.hide(); ui.home = true; store.restart(); },
};

app.addEventListener('click', async event => {
  if (Date.now() < Math.max(Number(dialog.element.dataset.suppressUntil ?? 0),Number(app.dataset.suppressUntil??0))) { event.preventDefault(); return; }
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  await audio.resume();
  if(store.get().selected&&button.dataset.toolTarget&&button.dataset.action!=='use-direct'){useTool(store.get().selected,button.dataset.toolTarget);return;}
  if (button.dataset.pmove && ui.panel?.type === 'puzzle') {
    try {
      const changed = performMove(JSON.parse(button.dataset.pmove));
      if (!changed) { blockedMove(button); announce(ui.panel.id === 'drawers' ? '木销挡着。' : ui.panel.id === 'stitch' ? '这一针没有穿过去。' : ui.panel.id === 'belt' ? '线到不了这一轮。' : '这一步没有挪动。'); }
    } catch { toast('没放好，再试试。'); }
    return;
  }
  await actions[button.dataset.action]?.(button);
});
app.addEventListener('change', event => {
  if (event.target.dataset.setting) {
    const input = event.target;
    setting(input.dataset.setting, input.type === 'checkbox' ? input.checked : Number(input.value));
  }
});
document.querySelector('#save-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file) return;
  try {
    if (file.size > MAX_SAVE_BYTES) throw new Error('这份文件太大，不像是书房存档。');
    const saved = parseSave(await file.text());
    store.replace(saved); ui.home = !saved.begun; ui.stack = []; ui.panel = null; dialog.hide(); render(store.get());
    toast('存档已读入。');
  } catch { toast('这份存档打不开，原来的进度还在。'); }
});
document.addEventListener('keydown', event => {
  if (ui.panel || ui.home || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  if(event.key==='Escape'&&store.get().selected){store.dispatch({type:'select',id:null});return;}
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); look(event.key === 'ArrowLeft' ? -1 : 1); }
});
store.subscribe((state, previous) => {
  render(state);
  const revealed=openScenes(state).filter(scene=>!sceneOpen(previous,scene.id));
  if(revealed.length)toast(revealed[0].unlocked);
  if (state.solved.length > previous.solved.length) {
    audio.success(); announce('解开了。');
    dialog.element.querySelector('.completion-note')?.scrollIntoView({ behavior: state.settings.motion ? 'smooth' : 'instant', block: 'nearest' });
  }
});
render(store.get());
bindInventoryUse(app,{scene:()=>store.get().scene,owns:id=>inventory(store.get()).includes(id),use:useTool});
if (store.notice) toast(store.notice);
// Local-only artwork; preload the other views without delaying the first room.
Object.entries(SCENE_ART).filter(([id])=>sceneOpen(store.get(),id)).forEach(([,src])=>{const image=new Image();image.src=src;});
