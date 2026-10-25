import {createState,reduce} from '../core/state.js';
import {PUZZLES,MAIN_IDS,PUZZLE_BY_ID} from '../data/puzzles.js';
import {ACTIVITY_IDS} from '../data/activities.js';
import {WITNESSES} from './walkthrough.js';

function initial(pickups=['bookmark','thread']){
  let state=reduce(createState(),{type:'start'});
  for(const id of pickups)state=reduce(state,{type:'pickup',id});
  state.settings.sound=false;return state;
}
function solve(state,id,collect=true){
 state=WITNESSES[id].reduce((current,move)=>reduce(current,{type:'move',id,move}),state);
 if(collect)for(const item of PUZZLE_BY_ID[id].rewards)state=reduce(state,{type:'pickup',id:item});
 return state;
}
export function previewState({puzzle,completed=false,full=false,hints=false,omitActivities=[],flower,setupMoves=[],pickups,unclaimed=[],takeRewards=[]}={}){
  let state=initial(pickups);
  if(full||puzzle&&!PUZZLE_BY_ID[puzzle].optional){
    for(const id of MAIN_IDS){
      if(id==='chocolate')state=reduce(state,{type:'use-tool',item:'crank',target:'birthday-door'});
      if(id===puzzle&&!completed)break;
      state=solve(state,id,!unclaimed.includes(id));
      if(id===puzzle)break;
    }
  }
  if(full){
    for(const p of PUZZLES.filter(p=>p.optional))state=solve(state,p.id);
    state=reduce(state,{type:'ending'});
    for(const id of ACTIVITY_IDS)state=reduce(state,{type:'activity',id});
  }
  if(puzzle&&PUZZLE_BY_ID[puzzle].optional&&completed)state=solve(state,puzzle,!unclaimed.includes(puzzle));
  if(puzzle)for(const move of setupMoves)state=reduce(state,{type:'move',id:puzzle,move});
  for(const id of takeRewards)state=reduce(state,{type:'pickup',id});
  state.activities=state.activities.filter(id=>!omitActivities.includes(id));
  if(flower)state.settings.flower=flower;
  if(hints)state.hints[puzzle]=3;
  if(puzzle)state=reduce(state,{type:'scene',id:PUZZLE_BY_ID[puzzle].scene});
  return state;
}
export {REVIEW_CASES} from './catalog.js';
