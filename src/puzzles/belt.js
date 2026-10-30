import {indexIn} from './common.js';
import {BELT_WHEELS,BELT_PITCH} from '../data/belt.js';

export const BELT_EDGES = [[0, 1], [0, 2], [1, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5], [4, 6], [5, 6]];
export const isBeltEdge = (a, b) => BELT_EDGES.some(([x, y]) => x === a && y === b || x === b && y === a);
// The old wear marks suggest this route, but it is not a hidden unique answer.
export const BELT_ROUTE=Object.freeze([0,2,1,4,3,5,6]);
export const beltRouteReady=route=>validRoute(route)&&route.length===7&&route.at(-1)===6;
export const beltConfigured=state=>beltRouteReady(state.route)&&state.crossed&&state.ratio===2;
export const beltTrialDistance=state=>beltRouteReady(state.route)?(state.crossed?-1:1)*(state.ratio+1)*BELT_PITCH:0;
export const beltFilmDistance=state=>state.opened?beltTrialDistance(state):0;
export const beltDriveRatio=(state,index)=>{
 if(index!==0&&!beltRouteReady(state.route))return 0;
 return BELT_WHEELS[0].r/BELT_WHEELS[index].r*BELT_WHEELS[index].side/BELT_WHEELS[0].side*(index===6&&state.crossed?-1:1);
};
function validRoute(route){return Array.isArray(route)&&route.length<=7&&new Set(route).size===route.length&&route.every(v=>indexIn(v,7))&&(!route.length||route[0]===0&&route.slice(1).every((v,i)=>isBeltEdge(route[i],v)));}
const change=(state,patch)=>({...state,...patch,tested:false});

export const belt = {
  create: () => ({route:[],crossed:false,ratio:0,fitted:[false,false,false,false],rotations:Array(7).fill(0),opened:false,tested:false,attempts:0}),
  valid: state => validRoute(state?.route)&&typeof state.crossed==='boolean'&&indexIn(state.ratio,3)&&Array.isArray(state.fitted)&&state.fitted.length===4&&state.fitted.every(v=>typeof v==='boolean')&&Array.isArray(state.rotations)&&state.rotations.length===7&&state.rotations.every(v=>Number.isFinite(v)&&v>=0&&v<360)&&typeof state.tested==='boolean'&&typeof state.opened==='boolean'&&Number.isInteger(state.attempts)&&state.attempts>=0&&state.attempts<=999&&(!state.opened||state.tested&&state.attempts>0&&beltConfigured(state)),
  move(state, action) {
    if(action.type==='unfit-all')return state.opened&&state.fitted.some(Boolean)?{...state,fitted:state.fitted.map(()=>false)}:state;
    if(action.type==='unfit'&&indexIn(action.index,4)&&state.fitted[action.index]){
      if(state.opened&&action.index===1&&state.fitted[0])return state;
      const fitted=state.fitted.map((v,i)=>i===action.index?false:v);
      if(state.opened)return {...state,fitted};
      const route=action.index===0?[]:action.index===1&&state.route.includes(1)?state.route.slice(0,state.route.indexOf(1)):state.route;
      return change(state,{fitted,route});
    }
    if(state.opened)return state;
    if(action.type==='fit'&&indexIn(action.index,4)&&!state.fitted[action.index])return change(state,{fitted:state.fitted.map((v,i)=>i===action.index?true:v)});
    if(action.type==='crank'){
      if(!state.fitted.every(Boolean))return state;
      const rotations=state.rotations.map((angle,i)=>(angle+360*beltDriveRatio(state,i)+360*4)%360);
      return {...state,rotations,tested:true,attempts:Math.min(999,state.attempts+1),opened:beltConfigured(state)};
    }
    if (action.type === 'trace') {
      // A seven-wheel route can contain many more visits while the same hand
      // goes back and tries again. Bound the input log, not the final path.
      if (!Array.isArray(action.nodes) || !action.nodes.length || action.nodes.length > 1024) return state;
      let next = state;
      for (const index of action.nodes) { const step = belt.move(next,{type:'node',index}); if (step === next) return state; next = step; }
      return next;
    }
    if (action.type === 'undo') return state.route.length?change(state,{route:state.route.slice(0,-1)}):state;
    if (action.type === 'cross') return change(state,{crossed:!state.crossed});
    if (action.type === 'ratio'||action.type==='set-ratio') {const ratio=action.type==='ratio'?(state.ratio+1)%3:action.value;return indexIn(ratio,3)&&ratio!==state.ratio?change(state,{ratio}):state;}
    if (action.type !== 'node' || !indexIn(action.index, 7)||!state.fitted[0]||action.index===1&&!state.fitted[1]) return state;
    if(state.route.at(-2)===action.index)return change(state,{route:state.route.slice(0,-1)});
    if(state.route.includes(action.index))return state;
    if (!state.route.length && action.index !== 0) return state;
    if (state.route.length && !isBeltEdge(state.route.at(-1), action.index)) return state;
    return change(state,{route:[...state.route,action.index]});
  },
  solved:state=>state.opened&&beltConfigured(state),
};
