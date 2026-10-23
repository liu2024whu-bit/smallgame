import { RULES } from '../puzzles/index.js';
import { PUZZLES } from '../data/puzzles.js';
import { POSTAL_CODE, LETTER_CODE } from '../data/ciphers.js';

export const CONTENT_REVISION = 4;
const NEW_GATES = new Set(['postbox', 'wordlock']);
const OLD_REQUIREMENTS = { books: ['calibration'], album: ['paperBack', 'cloudGap', 'film'] };

// Honor puzzles genuinely completed before these gates existed. Claims alone
// cannot earn a lock or bypass an unfinished old puzzle.
export function migrateContent(raw, state) {
  if ((raw.revision ?? 0) >= 3) return;
  const verified = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const puzzle of PUZZLES) {
      if (NEW_GATES.has(puzzle.id) || verified.has(puzzle.id) || !Array.isArray(raw.solved) || !raw.solved.includes(puzzle.id)) continue;
      const required = OLD_REQUIREMENTS[puzzle.id] ?? puzzle.requires;
      const owned = new Set([...state.collected, ...[...verified].flatMap(id => PUZZLES.find(p => p.id === id).rewards)]);
      if (required.every(id => verified.has(id)) && puzzle.tools.every(id => owned.has(id)) && RULES[puzzle.id].solved(state.progress[puzzle.id])) {
        verified.add(puzzle.id); changed = true;
      }
    }
  }
  for (const [gate, anchor] of [['postbox', 'books'], ['wordlock', 'album']]) {
    if (!verified.has(anchor)) continue;
    const rule = RULES[gate];
    const values = gate === 'postbox' ? POSTAL_CODE : LETTER_CODE.map(letter => letter.charCodeAt(0) - 65);
    let progress = rule.create();
    values.forEach((value, index) => { progress = rule.move(progress, { type: 'set', index, value }); });
    state.progress[gate] = rule.move(progress, { type: 'submit' });
    state.solved.push(gate);
  }
}
