import {keepsakes,discoveredCollections} from './state.js';
import {achievements} from './achievements.js';
import {CLUES} from '../data/clues.js';
import {COLLECTIONS} from '../data/assets.js';
import {EVIDENCE_TITLES} from '../data/ciphers.js';

// Describe additions, without a UI or a saved notification history. Call only
// for player actions: loading a journey must never replay its old arrivals.
export function journalUpdates(before,after){
 const previousGifts=new Set(keepsakes(before).map(g=>g.id));
 const previousCollections=discoveredCollections(before);
 const previousRecords=new Set(achievements(before).filter(a=>a.complete).map(a=>a.id));
 return {
  gifts:keepsakes(after).filter(g=>!previousGifts.has(g.id)),
  clues:after.solved.filter(id=>!before.solved.includes(id)&&CLUES[id]).map(id=>({id,title:CLUES[id][0]})),
  evidence:Object.entries(EVIDENCE_TITLES).filter(([id])=>after.activities.includes(`evidence:${id}`)&&!before.activities.includes(`evidence:${id}`)).map(([id,title])=>({id,title})),
  collections:[...discoveredCollections(after)].filter(id=>id!=='gifts'&&!previousCollections.has(id)).map(id=>({id,title:COLLECTIONS[id].title})),
  records:achievements(after).filter(a=>a.complete&&!previousRecords.has(a.id)),
 };
}
