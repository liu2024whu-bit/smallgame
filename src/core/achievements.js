import { ACHIEVEMENTS } from '../data/activities.js';
import { keepsakes } from './state.js';

export function achievements(state) {
  const activities = new Set(state.activities ?? []);
  return ACHIEVEMENTS.map(entry => {
    const count = entry.puzzles||entry.keys ? (entry.puzzles??[]).filter(id=>state.solved.includes(id)).length+(entry.keys??[]).filter(key=>activities.has(key)).length : keepsakes(state).length;
    const total = entry.puzzles||entry.keys ? (entry.puzzles?.length??0)+(entry.keys?.length??0) : entry.total;
    return { ...entry, count, total, complete: count >= total };
  });
}

export const canOpenEncore = state => state.ending && achievements(state).filter(entry=>!entry.extra).every(entry => entry.complete);
