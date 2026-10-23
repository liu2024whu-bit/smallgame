import { PUZZLES, PUZZLE_BY_ID } from '../data/puzzles.js';
import { SCENE_BY_ID } from '../data/scenes.js';
import { RULES } from '../puzzles/index.js';
import { COLLECTIONS, COLLECTION_PUZZLES } from '../data/assets.js';
import { KEEPSAKES } from '../data/keepsakes.js';
import { ACTIVITY_IDS } from '../data/activities.js';
import { CONTENT_REVISION, migrateContent } from './migrations.js';

export const SAVE_VERSION = 2;
export const PICKUPS = ['bookmark', 'thread'];
const DEFAULT_SETTINGS = { sound: true, volume: 0.35, motion: true, hotspots: false, skyCapeLeft: 'bat', skyCapeRight: 'bat', skyMask: 'chibi', flower: 'rose' };
const OPTIONS = { skyCapeLeft: ['bat', 'kizuna'], skyCapeRight: ['bat', 'kizuna'], skyMask: ['chibi', 'innocence'], flower: ['daisy', 'tulip', 'lavender', 'rose'] };

export function createState() {
  return { version: SAVE_VERSION, revision: CONTENT_REVISION, begun: false, scene: 'desk', collected: [], discovered: [], activities: [], solved: [], progress: Object.fromEntries(PUZZLES.map(p => [p.id, RULES[p.id].create()])), hints: {}, history: {}, selected: null, ending: false, settings: { ...DEFAULT_SETTINGS } };
}

export function inventory(state) {
  return [...new Set([...state.collected, ...state.solved.flatMap(id => PUZZLE_BY_ID[id]?.rewards ?? [])])];
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
  return { ready: !waiting.length && !missing.length, waiting, missing };
}

export function normalizeState(raw) {
  if (!raw || raw.version !== SAVE_VERSION) throw new Error('不兼容的存档版本');
  const state = createState();
  state.begun = raw.begun === true;
  state.scene = SCENE_BY_ID[raw.scene] ? raw.scene : 'desk';
  state.collected = PICKUPS.filter(item => Array.isArray(raw.collected) && raw.collected.includes(item));
  state.discovered = Object.keys(COLLECTIONS).filter(id => Array.isArray(raw.discovered) && raw.discovered.includes(id));
  state.activities = ACTIVITY_IDS.filter(id => Array.isArray(raw.activities) && raw.activities.includes(id));
  for (const puzzle of PUZZLES) {
    const candidate = raw.progress?.[puzzle.id];
    if (RULES[puzzle.id].valid(candidate)) state.progress[puzzle.id] = structuredClone(candidate);
    const count = raw.hints?.[puzzle.id];
    if (Number.isInteger(count) && count > 0) state.hints[puzzle.id] = Math.min(count, 3);
  }
  migrateContent(raw, state);
  // Rebuild completion in dependency order. Claims alone never grant pages or tools.
  let changed = true;
  while (changed) {
    changed = false;
    for (const puzzle of PUZZLES) {
      if (state.solved.includes(puzzle.id) || !Array.isArray(raw.solved) || !raw.solved.includes(puzzle.id)) continue;
      if (access(state, puzzle.id).ready && RULES[puzzle.id].solved(state.progress[puzzle.id])) {
        state.solved.push(puzzle.id);
        changed = true;
      }
    }
  }
  const settings = raw.settings ?? {};
  const completed = new Set(state.solved);
  state.solved = PUZZLES.filter(puzzle => completed.has(puzzle.id)).map(puzzle => puzzle.id);
  for (const key of ['sound', 'motion', 'hotspots']) if (typeof settings[key] === 'boolean') state.settings[key] = settings[key];
  for (const [key, values] of Object.entries(OPTIONS)) if (values.includes(settings[key])) state.settings[key] = settings[key];
  if (Number.isFinite(settings.volume)) state.settings.volume = Math.min(1, Math.max(0, settings.volume));
  state.ending = raw.ending === true && state.solved.includes('stitch');
  return state;
}

export function reduce(state, action) {
  if (!action || typeof action.type !== 'string') return state;
  if (action.type === 'start') return { ...state, begun: true };
  if (action.type === 'activity') return state.begun && ACTIVITY_IDS.includes(action.id) && !state.activities.includes(action.id) ? { ...state, activities: [...state.activities, action.id] } : state;
  if (action.type === 'scene' && SCENE_BY_ID[action.id]) return { ...state, scene: action.id, selected: null };
  if (action.type === 'pickup' && state.begun && PICKUPS.includes(action.id) && !state.collected.includes(action.id)) return { ...state, collected: [...state.collected, action.id], selected: action.id };
  if (action.type === 'discover' && state.begun && Object.hasOwn(COLLECTIONS, action.id) && !state.discovered.includes(action.id)) return { ...state, discovered: [...state.discovered, action.id] };
  if (action.type === 'select') return action.id === null || inventory(state).includes(action.id) ? { ...state, selected: action.id } : state;
  if (action.type === 'setting' && Object.hasOwn(DEFAULT_SETTINGS, action.key)) {
    const value = action.key === 'volume' ? Math.min(1, Math.max(0, Number(action.value))) : action.value;
    const valid = OPTIONS[action.key] ? OPTIONS[action.key].includes(value) : action.key === 'volume' ? Number.isFinite(value) : typeof value === 'boolean';
    if (!valid) return state;
    return { ...state, settings: { ...state.settings, [action.key]: value } };
  }
  if (action.type === 'ending') return state.solved.includes('stitch') ? { ...state, ending: true, selected: null } : state;
  if (!PUZZLE_BY_ID[action.id] || !state.begun) return state;
  const id = action.id;
  if (action.type === 'hint') return { ...state, hints: { ...state.hints, [id]: Math.min(3, (state.hints[id] ?? 0) + 1) } };
  if (state.solved.includes(id) || !access(state, id).ready) return state;
  if (action.type === 'reset' || action.type === 'undo') {
    const previous = state.history[id] ?? [];
    if (action.type === 'undo' && !previous.length) return state;
    return { ...state, progress: { ...state.progress, [id]: action.type === 'reset' ? RULES[id].create() : previous.at(-1) }, history: { ...state.history, [id]: action.type === 'reset' ? [] : previous.slice(0, -1) } };
  }
  if (action.type !== 'move') return state;
  const previous = state.progress[id];
  const next = RULES[id].move(previous, action.move ?? {});
  if (!RULES[id].valid(next) || JSON.stringify(next) === JSON.stringify(previous)) return state;
  const completed = RULES[id].solved(next);
  return {
    ...state,
    progress: { ...state.progress, [id]: next },
    history: { ...state.history, [id]: [...(state.history[id] ?? []), structuredClone(previous)].slice(-48) },
    solved: completed ? [...state.solved, id] : state.solved,
    selected: completed ? null : state.selected,
  };
}

export function serializable(state) {
  const { history, selected, ...save } = state;
  return save;
}
