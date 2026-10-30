import { PUZZLES, PUZZLE_BY_ID } from '../data/puzzles.js';
import { SCENE_BY_ID } from '../data/scenes.js';
import { RULES } from '../puzzles/index.js';
import { COLLECTIONS, COLLECTION_PUZZLES } from '../data/assets.js';
import { KEEPSAKES } from '../data/keepsakes.js';
import { ACTIVITY_IDS } from '../data/activities.js';
import { CONTENT_REVISION, migrateContent,migrateProgress,migrateAssemblyInputs } from './migrations.js';
import { sceneOpen, birthdayReady } from './exploration.js';
import { PERSISTENT_TOOL_USES, PUZZLE_TOOL_INPUTS,toolMounts,toolElsewhere,MIRROR_SITES } from '../data/tool-uses.js';
import { MUSIC_BY_ID } from '../data/music.js';
import {PICKUPS,REWARD_SOURCES,COLLECTIBLE_IDS} from '../data/rewards.js';
import {DISPLAY_ASPECTS,DISPLAY_SIZES} from '../data/display.js';
import {boxCanTurn} from '../data/birthday-lock.js';

export const SAVE_VERSION = 2;
export {PICKUPS};
// The three sky appearance keys only preserve older saves; current paper figures
// share the verified artwork in data/sky.js and expose no inactive dress controls.
const DEFAULT_SETTINGS = { sound: true, volume: 0.35, music:true, musicVolume:.65, effectsVolume:1, musicTrack:'window',musicOrder:'cycle',motion: true, clearText:false, customCursor:true, hotspots: false,displayAspect:'auto',displaySize:'fit',skyCapeLeft: 'bat', skyCapeRight: 'bat', skyMask: 'chibi', flower: 'rose' };
const LEVELS=['volume','musicVolume','effectsVolume'];
const OPTIONS = { musicTrack:Object.keys(MUSIC_BY_ID),musicOrder:['cycle','repeat'],displayAspect:DISPLAY_ASPECTS.map(x=>x.id),displaySize:DISPLAY_SIZES,skyCapeLeft: ['bat', 'kizuna'], skyCapeRight: ['bat', 'kizuna'], skyMask: ['chibi', 'innocence'], flower: ['daisy', 'tulip', 'lavender', 'rose'] };

export function createState() {
  return { version: SAVE_VERSION, revision: CONTENT_REVISION, begun: false, scene: 'desk', collected: [], discovered: [], activities: [], usedTools:[], solved: [], progress: Object.fromEntries(PUZZLES.map(p => [p.id, RULES[p.id].create()])), hints: {}, history: {}, selected: null, ending: false, settings: { ...DEFAULT_SETTINGS } };
}

export function inventory(state) {
  return [...state.collected];
}

function inputsOwned(state,id,progress) {
  const inputs=PUZZLE_TOOL_INPUTS[id];
  return !inputs||inputs.every((item,index)=>!toolMounts(id,progress)[index]||inventory(state).includes(item));
}

export function keepsakes(state) {
  return KEEPSAKES.filter(gift => gift.pickup ? state.collected.includes(gift.pickup) : state.solved.includes(gift.puzzle));
}

export function discoveredCollections(state) {
  return new Set([...(state.discovered ?? []), ...Object.entries(COLLECTION_PUZZLES).filter(([, puzzle]) => state.solved.includes(puzzle)).map(([id]) => id), ...(keepsakes(state).length ? ['gifts'] : [])]);
}

export function access(state, id) {
  const puzzle = PUZZLE_BY_ID[id];
  if (!puzzle) return { ready: false, waiting: [], missing: [] };
  const waiting = puzzle.requires.filter(required => !state.solved.includes(required));
  const owned = inventory(state);
  const missing = puzzle.tools.filter(tool => !owned.includes(tool));
  return { ready: !waiting.length && !missing.length && sceneOpen(state,puzzle.scene), waiting, missing };
}

export function normalizeState(raw) {
  if (!raw || raw.version !== SAVE_VERSION) throw new Error('不兼容的存档版本');
  const state = createState();
  const requested=new Set(Array.isArray(raw.collected)?raw.collected:[]);
  state.begun = raw.begun === true;
  state.scene = SCENE_BY_ID[raw.scene] ? raw.scene : 'desk';
  state.collected = PICKUPS.filter(item => requested.has(item));
  state.discovered = Object.keys(COLLECTIONS).filter(id => Array.isArray(raw.discovered) && raw.discovered.includes(id));
  state.activities = ACTIVITY_IDS.filter(id => Array.isArray(raw.activities) && raw.activities.includes(id));
  for (const puzzle of PUZZLES) {
    const candidate = migrateProgress(puzzle.id,raw.progress?.[puzzle.id],raw);
    if (RULES[puzzle.id].valid(candidate)) state.progress[puzzle.id] = structuredClone(candidate);
    const count = raw.hints?.[puzzle.id];
    if (Number.isInteger(count) && count > 0) state.hints[puzzle.id] = Math.min(count, 3);
  }
  migrateContent(raw, state);
  const oldBirthday=raw.ending===true&&(raw.revision===undefined||(Number.isInteger(raw.revision)&&raw.revision>=0&&raw.revision<4));
  // Only a completed old birthday or an owned tool can preserve a placed handle.
  const restoreUses=()=>{state.usedTools=Object.entries(PERSISTENT_TOOL_USES).filter(([id,use])=>use.requires.every(key=>state.solved.includes(key))&&inventory(state).includes(use.item)&&((Array.isArray(raw.usedTools)&&raw.usedTools.includes(id))||oldBirthday)).map(([id])=>id);};
  // Rebuild completion in dependency order. Claims alone never grant pages or tools.
  let changed = true;
  while (changed) {
    changed = false;
    migrateAssemblyInputs(raw,state);
    for (const puzzle of PUZZLES) {
      if (state.solved.includes(puzzle.id) || !Array.isArray(raw.solved) || !raw.solved.includes(puzzle.id)) continue;
      if (access(state, puzzle.id).ready && inputsOwned(state,puzzle.id,state.progress[puzzle.id]) && RULES[puzzle.id].solved(state.progress[puzzle.id])) {
        state.solved.push(puzzle.id);
        // Old runs already received these objects. New runs preserve only real pickups.
        const legacyFilm=puzzle.id==='belt'&&(raw.revision??0)<16&&state.progress.film.opened;
        const earned=puzzle.rewards.filter(item=>requested.has(item)||(item!=='matches'&&(item==='filmStrip'?legacyFilm:(raw.revision??0)<(item==='borrowSlip'?11:10))));
        state.collected.push(...earned.filter(item=>!state.collected.includes(item)));
        restoreUses();
        changed = true;
      }
    }
  }
  const settings = raw.settings ?? {};
  const completed = new Set(state.solved);
  state.solved = PUZZLES.filter(puzzle => completed.has(puzzle.id)).map(puzzle => puzzle.id);
  for(const [id,inputs] of Object.entries(PUZZLE_TOOL_INPUTS)) {
    if(inputsOwned(state,id,state.progress[id]))continue;
    state.progress[id]={...state.progress[id],...(Object.hasOwn(state.progress[id],'opened')?{opened:false}:{}),...(id==='birthdayLock'?{lid:false,revealed:false}:{}),...(id==='flowers'?{pin:-1}:{fitted:state.progress[id].fitted.map((value,index)=>value&&inventory(state).includes(inputs[index]))})};
  }
  // Imported preparation cannot leave the same needle or cotton at two sites.
  // A verified, partly sewn folio keeps its working tools; otherwise the
  // projector retains them until the player actually takes them back.
  for(const [folioIndex,projectorIndex]of [[0,0],[1,3]])if(state.progress.stitch.fitted[folioIndex]&&state.progress.belt.fitted[projectorIndex]){
    if(state.solved.includes('album')&&state.progress.stitch.path.length)state.progress.belt=RULES.belt.move(state.progress.belt,{type:'unfit',index:projectorIndex});
    else state.progress.stitch={...state.progress.stitch,fitted:state.progress.stitch.fitted.map((v,i)=>i===folioIndex?false:v)};
  }
  // Old preparation could draw the same mirror in several rooms. Retain the
  // furthest accessible placement; returning the others preserves their proof.
  let mirrorKept=false;
  for(const [id,index]of MIRROR_SITES)if(state.progress[id].fitted[index]){
    if(!mirrorKept&&access(state,id).ready){mirrorKept=true;continue;}
    state.progress[id]=RULES[id].move(state.progress[id],{type:'unfit',index});
  }
  if(!boxCanTurn(state))state.progress.ribbons={...state.progress.ribbons,back:false};
  if(!sceneOpen(state,state.scene))state.scene='desk';
  for (const key of ['sound', 'music','motion','clearText','customCursor', 'hotspots']) if (typeof settings[key] === 'boolean') state.settings[key] = settings[key];
  for (const [key, values] of Object.entries(OPTIONS)) if (values.includes(settings[key])) state.settings[key] = settings[key];
  for(const key of LEVELS)if(Number.isFinite(settings[key]))state.settings[key]=Math.min(1,Math.max(0,settings[key]));
  state.ending = raw.ending === true && state.solved.includes('stitch') && state.usedTools.includes('birthday-door');
  if(!state.ending)state.activities=state.activities.filter(id=>id!=='birthday:unwrap');
  return state;
}

export function reduce(state, action) {
  if (!action || typeof action.type !== 'string') return state;
  if (action.type === 'start') return { ...state, begun: true };
  if (action.type === 'activity') return state.begun && (action.id!=='birthday:unwrap'||state.ending) && ACTIVITY_IDS.includes(action.id) && !state.activities.includes(action.id) ? { ...state, activities: [...state.activities, action.id] } : state;
  if (action.type === 'scene' && sceneOpen(state,action.id)) return { ...state, scene: action.id, selected: null };
  if (action.type === 'pickup' && state.begun && COLLECTIBLE_IDS.includes(action.id) && !state.collected.includes(action.id) && (PICKUPS.includes(action.id)||state.solved.includes(REWARD_SOURCES[action.id]))) return { ...state, collected: [...state.collected, action.id], selected: action.id };
  if (action.type === 'discover' && state.begun && Object.hasOwn(COLLECTIONS, action.id) && !state.discovered.includes(action.id)) return { ...state, discovered: [...state.discovered, action.id] };
  if(action.type==='use-tool'&&state.begun){
    const use=PERSISTENT_TOOL_USES[action.target];
    return use&&use.item===action.item&&inventory(state).includes(action.item)&&use.requires.every(key=>state.solved.includes(key))&&!state.usedTools.includes(action.target)?{...state,usedTools:[...state.usedTools,action.target],selected:null}:state;
  }
  if (action.type === 'select') return action.id === null || inventory(state).includes(action.id) ? { ...state, selected: action.id } : state;
  if (action.type === 'setting' && Object.hasOwn(DEFAULT_SETTINGS, action.key)) {
    const value = LEVELS.includes(action.key) ? Math.min(1, Math.max(0, Number(action.value))) : action.value;
    const valid = OPTIONS[action.key] ? OPTIONS[action.key].includes(value) : LEVELS.includes(action.key) ? Number.isFinite(value) : typeof value === 'boolean';
    if (!valid) return state;
    return { ...state, settings: { ...state.settings, [action.key]: value } };
  }
  if (action.type === 'ending') return birthdayReady(state) ? { ...state, ending: true, selected: null } : state;
  if (!PUZZLE_BY_ID[action.id] || !state.begun) return state;
  const id = action.id;
  if (action.type === 'hint') return { ...state, hints: { ...state.hints, [id]: Math.min(3, (state.hints[id] ?? 0) + 1) } };
  const completedBefore=state.solved.includes(id);
  // A proven mechanism may release a fitting or turn the physical ribbon box.
  // Its pure rule must still preserve completion, without adding undo steps.
  const completedMove=action.type==='move'&&(['fit','unfit'].includes(action.move?.type)||id==='belt'&&action.move?.type==='unfit-all'||id==='calendar'&&['drawer','stamp'].includes(action.move?.type)||id==='ribbons'&&action.move?.type==='flip'||id==='birthdayLock'&&['lid','card-unfold','card-flip','ribbon-turn','ribbon-flip','paper-slide','mirror-slide'].includes(action.move?.type));
  if (completedBefore&&!completedMove || !access(state, id).ready) return state;
  if(id==='ribbons'&&action.type==='move'&&action.move?.type==='flip'&&!boxCanTurn(state))return state;
  if (action.type === 'reset' || action.type === 'undo') {
    const previous = state.history[id] ?? [];
    if (action.type === 'undo' && !previous.length) return state;
    return { ...state, progress: { ...state.progress, [id]: action.type === 'reset' ? RULES[id].create() : previous.at(-1) }, history: { ...state.history, [id]: action.type === 'reset' ? [] : previous.slice(0, -1) } };
  }
  if (action.type !== 'move') return state;
  if(id==='birthdayLock'&&['fit','lid'].includes(action.move?.type)&&state.progress.ribbons.back)return state;
  const previous = state.progress[id];
  if(action.move?.type==='fit'&&toolElsewhere(state,id,action.move.index))return state;
  const next = RULES[id].move(previous, action.move ?? {});
  if (!RULES[id].valid(next) || !inputsOwned(state,id,next) || JSON.stringify(next) === JSON.stringify(previous)) return state;
  const completed = RULES[id].solved(next);
  if(completedBefore&&!completed)return state;
  return {
    ...state,
    progress: { ...state.progress, [id]: next },
    history: completedBefore?state.history:{ ...state.history, [id]: [...(state.history[id] ?? []), structuredClone(previous)].slice(-48) },
    solved: completed&&!completedBefore ? [...state.solved, id] : state.solved,
    selected: completed ? null : state.selected,
  };
}

export function serializable(state) {
  const { history, selected, ...save } = state;
  return save;
}
