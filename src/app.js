import {hydrateSceneMaterials} from './services/scene-materials.js';
import { createCompanions } from './services/companions.js';
import {playMoveFeedback} from './services/move-feedback.js';
import {birthdayActions,lightBirthdayCandle} from './services/birthday-flow.js';
import { createStore } from './core/store.js';
import { inventory } from './core/state.js';
import { sceneOpen, openScenes, neighborScene, birthdayReady } from './core/exploration.js';
import { roomToolTarget, toolFor } from './data/tool-uses.js';
import { SCENE_BY_ID,hotspotVisible } from './data/scenes.js';
import {createScenePreloader} from './services/scene-preloader.js';
import { BLOCKED_LINES } from './data/feedback.js';
import { ITEMS } from './data/items.js';
import { renderRoom, renderHud,renderScenePicture,sceneSignature } from './ui/room.js';
import { renderPanel } from './ui/panels.js';
import { createDialog } from './ui/dialog.js';
import { announce } from './ui/dom.js';
import { createAudio } from './services/audio.js';
import {createToolUseFlow,createToolLocator} from './services/tool-use-flow.js';
import { motionAllowed,watchMotionPreferences } from './services/motion.js';
import { roomPainting, transitionRoom } from './services/room-transition.js';
import { bindInteractions } from './ui/interactions/index.js';
import { viewActions,afterPuzzleAction } from './ui/view-actions.js';
import { blockedMove } from './ui/interactions/feedback.js';
import { bindInventoryUse } from './ui/interactions/inventory.js';
import {bindButtonTaps} from './ui/interactions/tap.js';
import { createWelcome } from './services/welcome-flow.js';
import { bindSaveTransfer } from './services/save-transfer.js';
import { bindMusicControls } from './ui/music-controls.js';
import {bindSessionView} from './ui/session-view.js';
import {updateMusicView} from './ui/music.js';
import {capturePickup,playPickup} from './services/collect-motion.js';
import { audioOnlyUpdate } from './core/presentation-updates.js';
import {paintBeltCord} from './ui/puzzles/belt-cord.js';
import {hydrateStitchCotton} from './ui/stitch-cotton.js';
import {prepareFilmMove} from './ui/interactions/film.js';
import {prepareGardenMove} from './ui/interactions/garden.js';
import {preparePressBackMove} from './ui/interactions/press-back.js';
import {createFolderActions,bindAutomaticSave} from './services/folder-flow.js';
import {prepareWordMove} from './ui/interactions/wordlock.js';
import {prepareBirthdayMove} from './ui/interactions/birthday-lock.js';
import {prepareStitchMove} from './ui/interactions/stitch.js';
import {applyGameDisplay} from './ui/game-display.js';
import {createSourceViews} from './services/source-views.js';
import {createMelodyPlayback} from './services/melody-playback.js';
import {createSaveShelfFlow} from './services/save-shelf-flow.js';
import {createNotices} from './services/notices.js';
import {createRoomCamera} from './services/room-camera.js';

export function mountGame({storage,library,saves}={}) {
const app = document.querySelector('#app');
app.innerHTML = '<div class="game-shell"><div class="game-frame"><div id="room-stage" class="room-stage"></div></div><div id="hud"></div></div><section id="welcome" class="welcome" aria-labelledby="welcome-heading"></section><dialog id="explore-dialog" aria-labelledby="dialog-title"></dialog><p id="toast" role="status" class="toast" hidden></p><input id="save-file" type="file" accept=".json,application/json" hidden><input id="music-file" type="file" accept="audio/*,.mp3,.m4a,.ogg,.wav,.flac,.aac,.opus" hidden>';
const store = createStore(storage??{ getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value),removeItem:key=>window.localStorage.removeItem(key) });
const audio = createAudio({advance:id=>setting('musicTrack',id),library});
const musicBox=createMelodyPlayback(audio);
const ui = { panel: null, stack: [], home: true, skyPair: 0 };
const stage = document.querySelector('#room-stage');
const roomSourceViews=createSourceViews();
const dialog = createDialog(document.querySelector('#explore-dialog'), closePanel);
let roomSignature = '', hudSignature = '';
const notices=createNotices({host:document.querySelector('#toast'),root:app,dialog:dialog.element,openPanel});
let disposeInteractions = () => {},disposeSession=()=>{};
const preloadScenes=createScenePreloader();
const settleMotion=watchMotionPreferences(app);
const welcome=createWelcome(document.querySelector('#welcome'),{onCue:()=>audio.material('paper'),getState:()=>store.get(),getSaves:()=>saves?.summary(),onReveal:()=>{document.querySelector('.game-shell').hidden=false;},onEnter:()=>{ui.home=false;if(!store.get().begun)store.dispatch({type:'start'});else render(store.get());document.querySelector('.wordmark')?.focus({preventScroll:true});}});
const engageAudio=event=>audio.resume({music:!event.target.closest('.music-dialog,.settings-dialog,[data-action="music"],[data-action="settings"],[data-action="sound"]')}).catch(()=>{});
const freshPress=event=>{if(event.type==='pointerdown'||['Enter',' '].includes(event.key)){delete app.dataset.suppressUntil;delete dialog.element.dataset.suppressUntil;}};
app.addEventListener('pointerdown',freshPress,{capture:true});app.addEventListener('keydown',freshPress,{capture:true});
bindButtonTaps(app);
app.addEventListener('pointerdown',engageAudio,{capture:true});app.addEventListener('keydown',engageAudio,{capture:true});
const saveFlow=createSaveShelfFlow({saves,store,panel:()=>ui.panel,openPanel,renderDialog,closeAllPanels,enter:()=>welcome.begin(),toast,root:app});
const transfers=bindSaveTransfer(document.querySelector('#save-file'),{store,loaded:()=>showWelcome(),imported:saveFlow.imported,filename:()=>saves?.summary().slots.find(s=>s.id===saves.summary().active)?.name,toast,refresh:()=>{if(ui.panel?.type==='settings')renderDialog();},remember:storage?null:{getItem:key=>window.sessionStorage.getItem(key),setItem:(key,value)=>window.sessionStorage.setItem(key,value)}});
const companions=createCompanions({panel:()=>ui.panel,activity,audio,toast});
const useTool=createToolUseFlow({store,panel:()=>ui.panel,toast,audio,openPuzzle,openCollection,closeAllPanels,goScene,renderDialog,performMove,lightCandle:index=>lightBirthdayCandle({store,panel:()=>ui.panel,render:renderDialog,audio},index)});
const musicActions=bindMusicControls(document.querySelector('#music-file'),{player:audio.music,store,setting,openPanel,closePanel,toast});

function context() { return { state: store.get(), view: ui.panel?.view ?? {}, sourcePicture:(exclude=[],scene=store.get().scene)=>renderScenePicture({...store.get(),scene},{exclude}),skyPair: ui.skyPair, flower: store.get().settings.flower, petAwake: Boolean(ui.panel?.view?.petAwake), writable: store.writable(),autoSave:storage?.summary?.(),saves:saves?.summary(),saveTransfer:transfers.summary(),music:audio.music.snapshot() }; }
function activity(id) { return store.dispatch({ type: 'activity', id }); }
function performMove(move,arrival=null) {
  if (ui.panel?.type !== 'puzzle') return false;
  const id = ui.panel.id;
  if(id==='melody')musicBox.stop();
  if(id==='film')prepareFilmMove(dialog.element,move);
  const before=store.get(),previous=before.progress[id];
  if(id==='birthdayLock')prepareBirthdayMove(dialog.element,move,previous,ui.panel.view,arrival);
  if(id==='flowers')prepareGardenMove(dialog.element,move,previous,ui.panel.view,arrival);
  if(id==='paperBack')preparePressBackMove(dialog.element,move,arrival);
  if(id==='wordlock')prepareWordMove(dialog.element,move);
  const clearStitchFocus=id==='stitch'?prepareStitchMove(dialog.element,move):null;
  const changed = store.dispatch({ type: 'move', id, move });
  if(!changed)clearStitchFocus?.();
  if(changed)playMoveFeedback(audio,id,move,previous,store.get().progress[id]);
  return changed;
}
function renderDialog(preserveFocus = true, restore = null) {
  disposeInteractions();disposeSession();musicBox.stop();
  if (!ui.panel) return;
  ui.panel.view??={};
  dialog.show(renderPanel(ui.panel, context()), { preserveFocus, restore,save:{writable:store.writable(),info:storage?.summary?.()} });
  notices.sync();
  if (ui.panel.type === 'ambient') audio.rain(); else audio.stopRain();
  const state = store.get(), id = ui.panel.type === 'puzzle' ? ui.panel.id : null;
  disposeInteractions = bindInteractions(dialog.element, { id, progress: state.progress[id], solved: state.solved.includes(id), view:ui.panel.view, move: performMove, activity, feedback:(kind,delay)=>audio.foley(kind,delay),playPiano:note=>audio.pianoNote(note),playMelody:()=>musicBox.play(dialog.element,store.get().progress.melody.notes),stopMelody:musicBox.stop, changeView: (patch,record) => { ui.panel.view = {...ui.panel.view,...patch}; if(!record||!activity(record))renderDialog(); } });
  const unbindPuzzle=disposeInteractions,unbindPet=companions.bind(dialog.element);disposeInteractions=()=>{unbindPuzzle();unbindPet();};
  disposeSession=bindSessionView(dialog.element,audio.music,{getContext:context,feedback:()=>audio.foley('detent')});
}
function render(state,previous=null) {
  // A newly selected motion preference applies to this paint, not the next.
  document.documentElement.classList.toggle('reduce-motion',!state.settings.motion);
  const signature=sceneSignature(state);
  if (signature !== roomSignature) {
    const sameScene = stage.dataset.scene === state.scene;
    const previousArt=roomPainting(stage);
    const previousPaint=new Set([...stage.querySelectorAll('[data-world-change]')].map(el=>el.dataset.worldChange));
    stage.innerHTML = renderRoom(state); stage.dataset.scene = state.scene; roomSignature = signature;
    stage.querySelectorAll('[data-belt-case]').forEach(field=>paintBeltCord(field,state.progress.belt));
    hydrateSceneMaterials(stage);
    hydrateStitchCotton(stage);
    if(sameScene)stage.querySelectorAll('[data-world-change]').forEach(el=>{if(previousPaint.has(el.dataset.worldChange))el.style.animation='none';});
    transitionRoom(stage,previousArt);
  }
  const hudKey = JSON.stringify([inventory(state), state.selected, state.scene, state.solved.length,state.usedTools, state.settings.sound, store.writable()]);
  if (hudKey !== hudSignature) {
    const owned = new Set([...document.querySelectorAll('.inventory-slot')].map(element => element.dataset.id));
    document.querySelector('#hud').innerHTML = renderHud(state, store.writable(),storage?.summary?.()); hudSignature = hudKey;
    hydrateSceneMaterials(document.querySelector('#hud'));
    document.querySelectorAll('.inventory-slot').forEach(element => { if (!owned.has(element.dataset.id)) element.classList.add('new-item'); });
  }
  const shell=document.querySelector('.game-shell');shell.hidden=ui.home;shell.inert=ui.home;
  applyGameDisplay(shell,state.settings,state.scene);
  roomSourceViews.refresh(stage);
  document.body.classList.toggle('at-welcome',ui.home);if(ui.home)welcome.render(state);
  document.documentElement.classList.toggle('show-hotspots', state.settings.hotspots);
  document.documentElement.classList.toggle('clear-text',state.settings.clearText);
  document.documentElement.classList.toggle('native-cursor',!state.settings.customCursor);
  settleMotion();
  audio.configure(state.settings);
  const audioOnly=audioOnlyUpdate(previous,state);
  const visibleSettingsChanged=ui.panel?.type==='settings'&&['sound','music','volume','musicVolume','effectsVolume'].some(key=>previous?.settings[key]!==state.settings[key]);
  if(audioOnly&&ui.panel?.type==='music')updateMusicView(dialog.element,context());else if(!audioOnly||visibleSettingsChanged)renderDialog();
  preloadScenes(state);
}
function openPanel(panel, push = true) {
  musicBox.stop();
  if (push && ui.panel) { ui.panel.presentation=dialog.capture(); ui.stack.push(ui.panel); }
  ui.panel = panel;
  renderDialog(false);
}
function closePanel() {
  disposeInteractions();disposeSession();
  musicBox.stop();
  audio.stopRain();
  ui.panel = ui.stack.pop() ?? null;
  if (ui.panel) renderDialog(false, ui.panel.presentation); else {dialog.hide();notices.sync();if(ui.home)welcome.render(store.get());}
}
function toast(text) {
  notices.show(text);
}
function look(direction) {
  store.dispatch({ type: 'scene', id: neighborScene(store.get(),direction) });
  audio.material('paper');
}
function closeAllPanels(){ui.stack=[];ui.panel=null;disposeInteractions();disposeSession();musicBox.stop();audio.stopRain();dialog.hide();notices.sync();}
function showWelcome(phase='title'){closeAllPanels();ui.home=true;welcome.show(phase);render(store.get());}
function goScene(id){if(!sceneOpen(store.get(),id)){openPanel({type:'passage',id});return;}closeAllPanels();store.dispatch({type:'scene',id});}
function openPuzzle(id,view={}) { openPanel({ type: 'puzzle', id,view:{...view} }); }
function collectItem(id,source){
  const from=capturePickup(source);
  if(!store.dispatch({type:'pickup',id}))return;
  audio.material('pickup');playPickup(dialog.element,from);
}
function openCollection(id,source) { store.dispatch({ type: 'discover', id }); activity(`memory:${id}`); openPanel({ type: 'collection', id,view:source?{source}:{} }); }
function hotspot(id) {
  const state = store.get();
  const spot = SCENE_BY_ID[state.scene].hotspots.find(h => h.id === id);
  if (!spot||!hotspotVisible(spot,state)) return;
  const target=roomToolTarget(state,id,state.selected);
  if(state.selected&&target&&toolFor(target)===state.selected){useTool(state.selected,target);return;}
  const handlers = {
    pickup: () => collectItem(spot.target),
    puzzle: () => {const revisiting=spot.revisit&&state.solved.includes(spot.revisitAfter);openPuzzle(revisiting?spot.revisit:spot.target,revisiting?spot.revisitView??spot.view:spot.view);},
    album: () => openPuzzle(state.solved.includes('album') ? 'stitch' : 'album'),
    collection: () => openCollection(spot.target,spot.detail),
    evidence: () => { activity(`evidence:${spot.target}`); openPanel({ type: 'evidence', id: spot.target }); },
    ambient: () => { audio.material('glass'); openPanel({ type: 'ambient' }); },
    pet: () => openPanel({ type: 'pet', id: spot.target }),
    ending: () => { if(state.scene!=='birthday'){goScene('birthday');return;}if(state.ending)openPanel({type:'ending'});else if(birthdayReady(state))openPanel({type:'candles'});else openPanel({type:'birthday-wait'}); },
    'birthday-note':()=>{if(spot.target==='fries')activity('birthday:fries');openPanel({type:'birthday-note',id:spot.target});},
  };
  (handlers[spot.kind] ?? (() => openPanel({ type: spot.kind })))();
}
function currentPuzzle(action) {
  if(ui.panel?.type==='puzzle'){
    const id=ui.panel.id;if(id==='film'&&action==='undo')prepareFilmMove(dialog.element,{},store.get().history[id]?.at(-1));
    ui.panel.view=afterPuzzleAction(ui.panel.view,action,id);store.dispatch({type:action,id});
  }
}
function setting(key, value) { store.dispatch({ type: 'setting', key, value }); }
const actions = {
  ...createFolderActions({storage,store,toast}),
  'tool-location':createToolLocator({getState:store.get,panel:()=>ui.panel,goScene,openPuzzle,toast}),
  ...saveFlow.actions,
  ...viewActions({ panel: () => ui.panel, render: renderDialog, activity,foley:audio.foley }),
  ...transfers.actions,...musicActions,
  start:()=>welcome.begin(),'welcome-enter':()=>welcome.enter(),'intro-unfold':()=>welcome.unfold(),'intro-next':()=>welcome.next(),'welcome-back':()=>welcome.show(),
  home:()=>showWelcome(),intro:()=>showWelcome('intro'),about:()=>openPanel({type:'about'}),
  'scene-prev': () => look(-1), 'scene-next': () => look(1),
  scene: button => goScene(button.dataset.id),
  hotspot: button => hotspot(button.dataset.id),
  'collect-item':button=>collectItem(button.dataset.id,button),
  item: button => { store.dispatch({ type: 'select', id: button.dataset.id }); openPanel({ type: 'item', id: button.dataset.id }); },
  'take-tool':button=>{store.dispatch({type:'select',id:button.dataset.id});closeAllPanels();},
  'arm-tool':button=>store.dispatch({type:'select',id:button.dataset.id}),
  'use-direct':button=>useTool(button.dataset.id,button.dataset.toolTarget),
  ...birthdayActions({store,panel:()=>ui.panel,render:renderDialog,audio,openPanel,activity}),
  ...companions.actions,
  close: closePanel,
  journal: () => openPanel({ type: 'journal', tab: 'clues' }),
  'journal-tab': button => { ui.panel = { type: 'journal', tab: button.dataset.tab }; renderDialog(false); },
  collection: button => openCollection(button.dataset.id),
  evidence: button => { activity(`evidence:${button.dataset.id}`); openPanel({ type: 'evidence', id: button.dataset.id }); },
  campus: button => openPanel({ type:'campus', id:Number(button.dataset.index) }),
  'flower-note':()=>openPanel({type:'flower-note'}),
  keepsake: button => openPanel({ type: 'keepsake', id: button.dataset.id }),
  encore: () => openPanel({ type: 'encore' }),
  reading: () => openPanel({ type: 'reading' }), interests: () => openPanel({ type: 'interests' }),
  flowers: () => openPanel({ type: 'flowers' }),
  'wish-flower': button => { setting('flower', button.dataset.id); activity(`flower:${button.dataset.id}`); audio.material('glass'); },
  rooms:()=>openPanel({type:'rooms'}),puzzle:button=>openPuzzle(button.dataset.id),
  settings: () => openPanel({ type: 'settings' }), 'how-to': () => openPanel({ type: 'how-to' }),
  sound: () => setting('sound', !store.get().settings.sound),
  undo: () => currentPuzzle('undo'), 'reset-puzzle': () => currentPuzzle('reset'), hint: () => {
    currentPuzzle('hint');
    const note=dialog.element.querySelector('.hint-notes p:last-child');
    note?.scrollIntoView({block:'nearest',behavior:motionAllowed()?'smooth':'instant'});
    if(note)announce(note.textContent);
  },
  'sky-pair': () => { ui.skyPair = 1 - ui.skyPair; renderDialog(); audio.foley('turn'); },
  fullscreen: async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { toast('也可以使用浏览器的全屏功能。'); } },
  restart: () => saves?saveFlow.actions['save-new']():openPanel({ type: 'restart' }),
  'confirm-restart': () => { closeAllPanels();ui.home=true;welcome.show();store.restart(); },
};

app.addEventListener('click', async event => {
  if (Date.now() < Math.max(Number(dialog.element.dataset.suppressUntil ?? 0),Number(app.dataset.suppressUntil??0))) { event.preventDefault(); return; }
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  // Unlock the sound bus inside this gesture, without holding the game input
  // behind an asynchronous browser audio-context resume.
  engageAudio(event);
  if(store.get().selected&&button.dataset.toolTarget&&toolFor(button.dataset.toolTarget)===store.get().selected&&button.dataset.action!=='use-direct'){useTool(store.get().selected,button.dataset.toolTarget);return;}
  if (button.dataset.pmove && ui.panel?.type === 'puzzle') {
    try {
      const changed = performMove(JSON.parse(button.dataset.pmove));
      if (!changed) { blockedMove(button); announce(BLOCKED_LINES[ui.panel.id]??'这一步没有挪动。'); }
    } catch { toast('刚才没接住，东西还在。'); }
    return;
  }
  await actions[button.dataset.action]?.(button);
});
app.addEventListener('change', event => {
  if (event.target.dataset.setting) {
    const input = event.target;
    setting(input.dataset.setting, input.type === 'checkbox' ? input.checked : ['range','number'].includes(input.type) ? Number(input.value) : input.value);
    if(input.checked&&['sound','music'].includes(input.dataset.setting))audio.music.engage();
  }
});
app.addEventListener('input',event=>{
  const key=event.target.dataset.setting;
  if(!['volume','musicVolume','effectsVolume'].includes(key))return;
  const value=Number(event.target.value);audio.configure({...store.get().settings,[key]:value});
  dialog.element.querySelector(`[data-level="${key}"]`).textContent=`${Math.round(value*100)}%`;
});
document.addEventListener('keydown', event => {
  if(ui.panel||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
  if(ui.home){if(event.key==='Escape'&&welcome.phase==='intro')showWelcome();return;}
  if(event.key==='Escape'){if(store.get().selected)store.dispatch({type:'select',id:null});else showWelcome();return;}
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); look(event.key === 'ArrowLeft' ? -1 : 1); }
});
store.subscribe((state, previous,action) => {
  render(state,previous);
  const revealed=openScenes(state).filter(scene=>!sceneOpen(previous,scene.id));
  if(revealed.length)toast(revealed[0].unlocked);
  if (state.solved.length > previous.solved.length) {
    audio.success();
  }
  if(['move','pickup','activity','discover'].includes(action?.type)){
    const recorded=notices.arrival(previous,state);
    if(!recorded&&action.type==='pickup')toast(`${ITEMS[action.id].name}，放在手边了。`);
  }
});
render(store.get());
bindAutomaticSave(app,storage,store);

bindInventoryUse(app,{getState:()=>store.get(),owns:id=>inventory(store.get()).includes(id),use:useTool});
createRoomCamera(app,()=>store.get());
if (store.notice) toast(store.notice);

return {resetPresentation:()=>{ui.skyPair=0;notices.clear();},store,openPanel,closeAllPanels,showWelcome,enter:()=>welcome.enter(),panel:()=>ui.panel,audio};
}
