import {WITNESSES,solvedProgress} from '../src/demo/walkthrough.js';
import {reduce} from '../src/core/state.js';
import {PUZZLE_BY_ID} from '../src/data/puzzles.js';
export {WITNESSES,solvedProgress};
// Journey helpers perform the same separate pickup action as the player.
export function finish(state,id){
 if(id==='chocolate')state=reduce(state,{type:'use-tool',item:'crank',target:'birthday-door'});
 state=WITNESSES[id].reduce((current,move)=>reduce(current,{type:'move',id,move}),state);
 for(const item of PUZZLE_BY_ID[id].rewards)state=reduce(state,{type:'pickup',id:item});
 return state;
}
