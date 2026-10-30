import {DATE_CODE} from '../src/data/calendar.js';
import {POSTAL_CODE,LETTER_CODE} from '../src/data/ciphers.js';
import {BIRTHDAY_CODE} from '../src/data/birthday-lock.js';
// Concrete walkthroughs for isolated previews and rule verification; the live game does not import this module.
import { RULES } from '../src/puzzles/index.js';
import { CHOCOLATE_PATTERN } from '../src/data/birthday.js';
import {SCREEN_CODE} from '../src/puzzles/screen.js';
import {PIANO_RESPONSE} from '../src/data/piano.js';

function arrange(seed, goal) {
  const order = [...seed], moves = [];
  for (let i = 0; i < goal.length; i++) {
    let position = order.indexOf(goal[i]);
    while (position > i) {
      moves.push({ type: 'shift', index: position, direction: -1 });
      [order[position - 1], order[position]] = [order[position], order[position - 1]];
      position--;
    }
  }
  return moves;
}
const turns = (seed, goal, count, type = 'turn') => goal.flatMap((value, index) => Array.from({ length: (value - seed[index] + count) % count }, () => ({ type, index, direction: 1 })));
const flip = indexes => indexes.map(index => ({ type: 'flip', index }));
const packing = [];
for (const [id, [row, column, turn]] of [[0, 0, 0], [0, 3, 1], [2, 0, 2], [1, 0, 1], [2, 2, 0]].entries()) {
  packing.push({ type: 'select', index: id }, ...Array.from({ length: turn }, () => ({ type: 'rotate' })), { type: 'cell', index: row * 5 + column });
}

export const WITNESSES = {
  calendar:[...DATE_CODE.map((value,index)=>({type:'set',index,value})),{type:'submit'}],
  paper: [{type:'open'},...arrange([2,0,1],[0,1,2]),{type:'print'}],
  cloud: turns([0, 0, 0], [3, 2, 2], 4),
  calibration: [...[0,1,2].map(index=>({type:'fit',index})),{type:'power'},...turns([0,0,0],[2,1,3],4),{type:'flip'},{type:'trace'}],
  postbox: [...POSTAL_CODE.map((value, index) => ({ type: 'set', index, value })), { type:'submit' }],
  books: [{type:'fit',index:0},...arrange([0,1,2,3,4],[3,0,4,1,2]),{type:'submit'}],
  screen: [...flip([0,2,3,6,8]),{type:'turn-backing'},{type:'slide',x:0,y:0},...SCREEN_CODE.map((value,index)=>({type:'set',index,value})),{type:'submit'}],
  belt: [...[0,1,2,3].map(index=>({type:'fit',index})),...[0, 2, 1, 4, 3, 5, 6].map(index => ({ type: 'node', index })), { type: 'cross' }, { type: 'set-ratio',value:2 },{type:'crank'}],
  film: [{type:'fit',index:0},...arrange([2,0,1],[1,0,2]),...[0,2].map(index=>({type:'reverse',index})),...flip([0,2]),{type:'submit'}],
  flowers: [{type:'crank',index:0},{type:'fit',index:0,port:1},{type:'crank',index:0,steps:2},{type:'crank',index:1,steps:-1},{type:'submit'}],
  paperBack: [...arrange([0,1,2,3,4],[3,0,4,1,2]),{type:'submit'}],
  cloudGap: [0,3,1].map((value,index)=>({type:'set-slide',index,value})),
  wordlock: [...LETTER_CODE].map(letter => ({ type:'key', value:letter.charCodeAt(0) - 65 })).concat({ type:'submit' }),
  album: [...arrange([0, 1, 2, 3], [1, 3, 0, 2]), ...flip([0, 2])],
  stitch: [{type:'fit',index:0},{type:'fit',index:1},...[0,4,1,5,2,6,3,7].map(index=>({type:'hole',index})),{type:'tie'},{type:'trim'}],
  chocolate:[{type:'lid'},...CHOCOLATE_PATTERN.flatMap((value,piece)=>value?[piece]:[]).map((piece,i)=>({type:'place',piece,to:25+i})),{type:'drawer'}],
  cocoa:[[0,1],[0,3],[1,2],[1,4],[2,1],[3,1],[1,2],[1,4],[2,3]].map(([from,to])=>({type:'pour',from,to})),
  sweets:[{type:'cut',index:0,value:3},{type:'cut',index:1,value:5},{type:'cut',index:2,value:3},{type:'serve'}],
  ribbons:[{type:'pull',index:5},{type:'flip'},{type:'pull',index:3},{type:'flip'},{type:'pull',index:2},{type:'flip'},{type:'pull',index:4},{type:'pull',index:1},{type:'flip'},{type:'pull',index:0}],
  birthdayLock:[...[0,1,2].map(index=>({type:'fit',index})),{type:'card-unfold'},{type:'card-flip'},{type:'ribbon-turn'},{type:'ribbon-flip'},{type:'paper-slide',offset:[0,0]},{type:'mirror-slide',position:[310,550]},...BIRTHDAY_CODE.map((value,index)=>({type:'set',index,value})),{type:'submit'},{type:'lid'}],
  maze:[...turns([3,4,0],[0,2,3],6),{type:'roll',path:[18,0,1,2,8,9,15,16,17,16,15,19],next:null,amount:0}],
  balance:[6,7,9,10,8,11].map((slot,index)=>({type:'place',index,slot})),
  drawers: [0, 1, 0, 2, 0, 1, 0, 3].map(index => ({ type: 'drawer', index })),
  flips: flip([0, 2, 4, 7]),
  packing,
  melody: turns([2, 2, 2, 2, 2, 2], [0, 2, 1, 3, 2, 0], 5, 'note'),
  piano:[...arrange([0,1,2,3],[2,0,3,1]).map(a=>({type:'reorder',from:a.index,to:a.index+a.direction})),...flip([0,2]),...PIANO_RESPONSE.map(note=>({type:'play',note})),{type:'submit'}],
};
export function solvedProgress(id) { return WITNESSES[id].reduce((state, move) => RULES[id].move(state, move), RULES[id].create()); }
