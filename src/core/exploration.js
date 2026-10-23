import { SCENES, SCENE_BY_ID } from '../data/scenes.js';

export const sceneOpen = (state, id) => !!SCENE_BY_ID[id] && (SCENE_BY_ID[id].requires ?? []).every(key => state.solved.includes(key)) && (!SCENE_BY_ID[id].tool || state.usedTools?.includes(SCENE_BY_ID[id].tool));
export const openScenes = state => SCENES.filter(scene => sceneOpen(state, scene.id));
export const birthdayReady = state => ['cocoa','sweets','birthdayLock'].every(id=>state.solved.includes(id)) || state.ending;
export function neighborScene(state, direction) {
  const available = openScenes(state);
  const index = available.findIndex(scene => scene.id === state.scene);
  return available[(index + direction + available.length) % available.length].id;
}
