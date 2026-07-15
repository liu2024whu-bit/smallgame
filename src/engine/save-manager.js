const SAVE_KEY = 'smallgame-v1-save';

export function createInitialSave() {
  return {
    version: 1,
    chapters: {},
    inventory: [],
    memories: [],
  };
}

export function serializeSave(state) {
  return JSON.stringify(state);
}

export function restoreSave(raw) {
  if (!raw) return createInitialSave();
  try {
    const parsed = JSON.parse(raw);
    return parsed.version === 1 ? parsed : createInitialSave();
  } catch {
    return createInitialSave();
  }
}

export { SAVE_KEY };
