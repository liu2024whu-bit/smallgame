import { createState, normalizeState, serializable } from './state.js';

export const SAVE_KEY = 'smallgame:v2:room';
export const BACKUP_KEY = 'smallgame:v2:backup';
export const MAX_SAVE_BYTES = 200_000;

export function parseSave(text) {
  if (typeof text !== 'string' || text.length > MAX_SAVE_BYTES) throw new Error('存档文件过大或无法读取');
  return normalizeState(JSON.parse(text));
}

export function loadSave(storage) {
  try {
    const text = storage.getItem(SAVE_KEY);
    if (!text) return { state: createState(), notice: '' };
    try { return { state: parseSave(text), notice: '' }; }
    catch {
      const backup = storage.getItem(BACKUP_KEY);
      if (backup) return { state: parseSave(backup), notice: '已恢复上一份存档。' };
      return { state: createState(), notice: '存档打不开了。如果留过备份，可以在设置里读进来。' };
    }
  } catch { return { state: createState(), notice: '自动保存这次没跟上，设置里的「保存一份」还能留住进度。' }; }
}

export function writeSave(storage, state, {fresh=false}={}) {
  try {
    const previous = storage.getItem(SAVE_KEY);
    if (previous&&!fresh) { try { parseSave(previous); storage.setItem(BACKUP_KEY, previous); } catch { /* Keep the last readable backup. */ } }
    storage.setItem(SAVE_KEY, JSON.stringify(serializable(state)));
    if(fresh)storage.removeItem?.(BACKUP_KEY);
    return true;
  } catch { return false; }
}
