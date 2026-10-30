import { RULES } from '../puzzles/index.js';
import { PUZZLES } from '../data/puzzles.js';
import { POSTAL_CODE, LETTER_CODE } from '../data/ciphers.js';
import {permutation,same,bounded,indexIn} from '../puzzles/common.js';
import {applyOperations,PAPER_SEED,PAPER_TARGET} from '../puzzles/paper.js';
import {screenAligned,SCREEN_CODE} from '../puzzles/screen.js';
import {beltConfigured,BELT_ROUTE} from '../puzzles/belt.js';
import {FILM_ORDER,PAGE_FACES} from '../puzzles/film.js';
import {FLOWER_TARGET} from '../puzzles/flowers.js';
import {paperBackFits} from '../puzzles/paper-back.js';
import {GAP_GOAL,GAP_SEED,gapAligned} from '../puzzles/cloud-gap.js';
import {validStitch} from '../puzzles/stitch.js';
import {chocolateFits} from '../puzzles/chocolate.js';
import {BIRTHDAY_CODE,DECODER_PRINT} from '../data/birthday-lock.js';
import {DATE_CODE,LEGACY_DATE_CODE} from '../data/calendar.js';
import {MAZE_WITNESS} from '../data/maze-apparatus.js';

export const CONTENT_REVISION = 30;
const NEW_GATES = new Set(['postbox', 'wordlock']);
const OLD_REQUIREMENTS = { books: ['calibration'], album: ['paperBack', 'cloudGap', 'film'] };
// Earlier page assembly checked the board but did not require picking up each
// sheet. Inherit those actually used inputs only after the old route and exact
// assembly are proven; a new unfinished run still collects every sheet itself.
export function migrateAssemblyInputs(raw,state){
 if((raw.revision??0)>=20||!Array.isArray(raw.solved)||!raw.solved.includes('album')||!state.solved.includes('wordlock')||!state.solved.includes('film')||!state.collected.includes('board')||!RULES.album.solved(state.progress.album))return;
 for(const [source,item]of [['books','pageA'],['screen','pageB'],['film','pageC'],['paperBack','pageD']])if(state.solved.includes(source)&&!state.collected.includes(item))state.collected.push(item);
}

// Each replaced mechanism must prove its old result before inheriting completion.
export function migrateProgress(id,candidate,raw){
  if(id==='balance'&&(raw.revision??0)<29&&bounded(candidate?.places,4,3)){
    const proved=Array.isArray(raw.solved)&&raw.solved.includes(id)&&(same(candidate.places,[1,2,2,1])||same(candidate.places,[2,1,1,2]));
    if(proved)return {places:[6,7,9,10,8,11]};
    const next=[0,1,2,3,4,5],pan=[6,9];
    candidate.places.forEach((v,i)=>{if(v&&pan[v-1]<[9,12][v-1])next[i]=pan[v-1]++;});
    return {places:next};
  }
  if(id==='maze'&&(raw.revision??0)<28&&bounded(candidate?.turns,3,6)&&!Object.hasOwn(candidate,'path')){
    const proved=Array.isArray(raw.solved)&&raw.solved.includes(id)&&same(candidate.turns.slice(0,2),[0,0])&&[2,3].includes(candidate.turns[2]);
    return {...RULES.maze.create(),turns:proved?[0,2,3]:[...candidate.turns],...(proved?{path:[...MAZE_WITNESS]}:{})};
  }
  if(id==='calendar'&&(raw.revision??0)<27&&bounded(candidate?.values,6,10)&&!['shut','stamped'].some(key=>Object.hasOwn(candidate,key))){
    const proved=candidate.opened===true&&same(candidate.values,LEGACY_DATE_CODE)&&Array.isArray(raw.solved)&&raw.solved.includes(id);
    return {...RULES.calendar.create(),values:proved?[...DATE_CODE]:[...candidate.values],cursor:indexIn(candidate.cursor,6)?candidate.cursor:0,attempts:Number.isInteger(candidate.attempts)&&candidate.attempts>=0&&candidate.attempts<100?candidate.attempts:0,opened:proved,shut:!proved};
  }
  if(id==='birthdayLock'&&(raw.revision??0)<26&&bounded(candidate?.values,4,10)&&Array.isArray(candidate.fitted)&&candidate.fitted.length===3&&candidate.fitted.every(v=>typeof v==='boolean')&&typeof candidate.back==='boolean'&&typeof candidate.turned==='boolean'&&!Object.hasOwn(candidate,'revealed')){
    const proved=candidate.opened===true&&same(candidate.values,BIRTHDAY_CODE)&&Array.isArray(raw.solved)&&raw.solved.includes(id);
    return {...RULES.birthdayLock.create(),...candidate,unfolded:candidate.fitted[0],stripBack:candidate.fitted[1]&&candidate.back,offset:candidate.fitted[1]?[0,0]:[18,8],mirror:candidate.fitted[2]?[DECODER_PRINT[0]+DECODER_PRINT[2]/2,DECODER_PRINT[1]+DECODER_PRINT[3]/2]:[500,550],lid:proved,revealed:proved,...(proved?{fitted:[false,false,false],unfolded:false,back:false}:{})};
  }
  if(id==='sweets'&&(raw.revision??0)<25&&bounded(candidate?.cuts,2,8)&&candidate.cuts.every(v=>v>0)&&!Object.hasOwn(candidate,'served')){
    const served=Array.isArray(raw.solved)&&raw.solved.includes('sweets')&&same(candidate.cuts,[3,5]);
    return {cuts:served?[3,5,3]:[candidate.cuts[0],candidate.cuts[1],candidate.cuts[1]],served};
  }
  if(id==='cocoa'&&(raw.revision??0)<23&&Array.isArray(candidate?.levels)&&candidate.levels.length===3&&candidate.levels.every((v,i)=>Number.isInteger(v)&&v>=0&&v<=[8,5,3][i])&&candidate.levels.reduce((a,b)=>a+b,0)===8){
    const proven=Array.isArray(raw.solved)&&raw.solved.includes('cocoa')&&same(candidate.levels,[4,4,0]);
    return {levels:proven?[0,0,0,4,4]:[...candidate.levels,0,0]};
  }
  if(id==='chocolate'&&(raw.revision??0)<22&&bounded(candidate?.cells,25,2)&&[0,1].includes(candidate.tool)&&typeof candidate.covered==='boolean'&&!['places','opened'].some(key=>Object.hasOwn(candidate,key))){
    let plate=25;
    const places=candidate.cells.map((v,i)=>v?i:plate++);
    const drawer=Array.isArray(raw.solved)&&raw.solved.includes('chocolate')&&candidate.covered&&chocolateFits(places);
    return {places,opened:candidate.covered||candidate.cells.some(v=>!v),drawer:!!drawer};
  }
  if(id==='chocolate'&&(raw.revision??0)<24&&bounded(candidate?.places,25,50)&&new Set(candidate.places).size===25&&typeof candidate.opened==='boolean'&&typeof candidate.covered==='boolean'&&!Object.hasOwn(candidate,'drawer'))return {places:[...candidate.places],opened:candidate.opened,drawer:!!(Array.isArray(raw.solved)&&raw.solved.includes('chocolate')&&candidate.opened&&candidate.covered&&chocolateFits(candidate.places))};
  if(id==='stitch'&&(raw.revision??0)<21&&Array.isArray(candidate?.path)&&candidate.path.length<=8&&candidate.path.every(v=>indexIn(v,8))&&new Set(candidate.path).size===candidate.path.length&&(!candidate.path.length||candidate.path[0]===0)&&!['fitted','tied','finished','pulls'].some(key=>Object.hasOwn(candidate,key))){
    const finished=Array.isArray(raw.solved)&&raw.solved.includes(id)&&validStitch(candidate.path);
    // Old partial needle routes are retained, but preparation is never inferred
    // from ownership. A previously proven complete route inherits its finish.
    return {...RULES.stitch.create(),path:[...candidate.path],tied:finished,finished,pulls:finished?1:0};
  }
  if(id==='cloudGap'&&(raw.revision??0)<19&&bounded(candidate?.values,3,4)&&typeof candidate.back==='boolean'){
    const verified=Array.isArray(raw.solved)&&raw.solved.includes(id)&&same(candidate.values,[1,3,2]);
    // The old algebraic system did not have paper positions. Retain bounded
    // travel where possible, but a coincident new alignment is no old proof.
    return {values:verified?[...GAP_GOAL]:gapAligned(candidate.values)?[...GAP_SEED]:[...candidate.values]};
  }
  if(id==='paperBack'&&(raw.revision??0)<18&&permutation(candidate?.order,5)&&!['fitted','opened','attempts'].some(key=>Object.hasOwn(candidate,key))){
    const opened=Array.isArray(raw.solved)&&raw.solved.includes(id)&&paperBackFits(candidate.order);
    return {...RULES.paperBack.create(),order:[...candidate.order],opened,attempts:opened?1:0};
  }
  if(id==='flowers'&&(raw.revision??0)<17&&bounded(candidate?.heights,3,4)&&Number.isInteger(candidate.pin)&&candidate.pin>=-1&&candidate.pin<3&&(candidate.turns===undefined||bounded(candidate.turns,3,4))&&!['opened','attempts'].some(key=>Object.hasOwn(candidate,key))){
    const opened=Array.isArray(raw.solved)&&raw.solved.includes('flowers')&&same(candidate.heights,FLOWER_TARGET);
    return {...RULES.flowers.create(),heights:[...candidate.heights],pin:candidate.pin,turns:[...(candidate.turns??[0,0,0])],opened,attempts:opened?1:0};
  }
  if(id==='film'&&(raw.revision??0)<16&&permutation(candidate?.order,3)&&bounded(candidate.faces,4,2)&&indexIn(candidate.frame,3)&&!['reverse','fitted','opened','attempts'].some(key=>Object.hasOwn(candidate,key))){
    const completed=Array.isArray(raw.solved)&&raw.solved.includes('film')&&same(candidate.order,FILM_ORDER)&&same(candidate.faces,PAGE_FACES);
    return {...RULES.film.create(),order:[...candidate.order],faces:[...candidate.faces],...(completed?{reverse:[false,false,false],fitted:[true],opened:true,attempts:1}:{})};
  }
  if(id==='belt'&&Array.isArray(candidate?.fitted)&&candidate.fitted.length===3){const next={...candidate,fitted:[...candidate.fitted,false]};return RULES.belt.valid(next)?next:candidate;}
  if(id==='belt'&&(raw.revision??0)<15&&candidate&&Array.isArray(candidate.route)&&!['fitted','rotations','opened','tested','attempts'].some(key=>Object.hasOwn(candidate,key))){
    const base={...RULES.belt.create(),route:[...candidate.route],crossed:candidate.crossed,ratio:candidate.ratio};
    if(!RULES.belt.valid(base))return candidate;
    const owned=Array.isArray(raw.collected)?raw.collected:[],fitted=['thread','pulley','crank','needle'].map(item=>owned.includes(item));
    const opened=Array.isArray(raw.solved)&&raw.solved.includes('belt')&&same(base.route,BELT_ROUTE)&&beltConfigured(base)&&fitted.every(Boolean);
    return {...base,fitted,opened,tested:opened,attempts:opened?1:0};
  }
  if(id==='screen'&&(raw.revision??0)<14&&bounded(candidate?.flips,9,2)&&!Object.hasOwn(candidate,'backing')){
    const paperOnly=!['values','opened','attempts'].some(key=>Object.hasOwn(candidate,key));
    const oldLock=bounded(candidate.values,3,10)&&typeof candidate.opened==='boolean'&&Number.isInteger(candidate.attempts)&&candidate.attempts>=0&&candidate.attempts<=999&&(!candidate.opened||candidate.attempts>0&&same(candidate.values,[9,0,8]));
    if(!paperOnly&&!oldLock)return candidate;
    const opened=Array.isArray(raw.solved)&&raw.solved.includes('screen')&&(paperOnly?screenAligned(candidate.flips):candidate.opened);
    return {...RULES.screen.create(),flips:[...candidate.flips],...(opened?{backing:{x:0,y:0,turned:false}}:{}),values:opened?[...SCREEN_CODE]:oldLock?[...candidate.values]:[0,0,0],opened,attempts:opened?Math.max(1,candidate.attempts??1):candidate.attempts??0};
  }
  if(id==='books'&&(raw.revision??0)<12&&permutation(candidate?.order,5)&&!['fitted','opened','attempts'].some(key=>Object.hasOwn(candidate,key))){
    const opened=Array.isArray(raw.solved)&&raw.solved.includes('books')&&RULES.books.solved({...RULES.books.create(),order:candidate.order,opened:true,attempts:1});
    return {...RULES.books.create(),order:[...candidate.order],opened,attempts:opened?1:0};
  }
  if(id==='calibration'&&(raw.revision??0)<9&&bounded(candidate?.values,3,4)&&(candidate.back===undefined||typeof candidate.back==='boolean')&&!['fitted','lit','flipped','proof'].some(key=>Object.hasOwn(candidate,key))){
    const completed=Array.isArray(raw.solved)&&raw.solved.includes(id)&&same(candidate.values,[2,1,3]);
    return {values:[...candidate.values],fitted:[false,false,false],flipped:completed,lit:false,proof:completed?{values:[...candidate.values],flipped:true}:null};
  }
  if(id==='cloud'&&Array.isArray(candidate?.values))return {values:[...candidate.values]};
  if(id!=='paper'||(raw.revision??0)>=7||!permutation(candidate?.order,3))return candidate;
  if(['opened','proof','presses'].some(key=>Object.hasOwn(candidate,key)))return candidate;
  const opened=Array.isArray(raw.collected)&&raw.collected.includes('bookmark');
  const completed=opened&&Array.isArray(raw.solved)&&raw.solved.includes('paper')&&same(applyOperations(PAPER_SEED,candidate.order),PAPER_TARGET);
  return {order:[...candidate.order],opened,proof:completed?[...candidate.order]:null,presses:completed?1:0};
}

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
      const tools=puzzle.id==='books'?puzzle.tools.filter(id=>id!=='borrowSlip'):puzzle.tools;
      if (required.every(id => verified.has(id)) && tools.every(id => owned.has(id)) && RULES[puzzle.id].solved(state.progress[puzzle.id])) {
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
    // These very old saves had already reached the library before its postal
    // gate existed. Preserve the ticket only after that old route is verified.
    if(gate==='postbox'&&!state.collected.includes('borrowSlip'))state.collected.push('borrowSlip');
  }
}
