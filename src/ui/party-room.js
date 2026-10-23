import { PARTY_FRAME, CAKE_GRID, BOX_LID } from '../data/birthday-workshop.js';
import { sugarPieces, sugarShares } from './puzzles/sweets.js';
import { ribbonLines } from './puzzles/ribbons.js';
import { character } from './dom.js';
import { openBoxNumbers } from './workshop-props.js';

const region=([x,y,w,h])=>`left:${x/PARTY_FRAME.width*100}%;top:${y/PARTY_FRAME.height*100}%;width:${w/PARTY_FRAME.width*100}%;height:${h/PARTY_FRAME.height*100}%`;
export function partyRoom(state) {
  if(state.scene!=='party')return '';
  const cuts=state.progress.sweets.cuts;
  return `<div class="party-details" aria-hidden="true"><div class="sugar-grid" style="${region(CAKE_GRID)}">${sugarPieces()}<svg class="sugar-guides" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 ${cuts[0]/8*100}H100"/><path d="M${cuts[1]/8*100} 0V100"/></svg></div>${sugarShares(cuts,[0,0,PARTY_FRAME.width,PARTY_FRAME.height])}${state.solved.includes('sweets')?`<span class="party-card-found">${character('birthdayProps',6,3,3,'')}</span>`:''}<div class="ribbon-field" style="${region(BOX_LID)}">${ribbonLines(state.progress.ribbons)}</div>${state.solved.includes('birthdayLock')?openBoxNumbers(state.progress.birthdayLock.values,[0,0,PARTY_FRAME.width,PARTY_FRAME.height]):''}</div>`;
}
