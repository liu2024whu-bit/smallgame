import {MAZE_START,MAZE_END,MAZE_MARKS,mazeSeenStars,mazeExitLimit,mazeConnections} from '../data/maze-apparatus.js';
import {bounded,indexIn,mod} from './common.js';

export const mazeStars=mazeSeenStars;
export const mazeHome=p=>p.path.length===1&&p.next===null;
export function validMazeWalk(turns,path){
 if(!Array.isArray(path)||!path.length||path.length>256||path[0]!==MAZE_START||!path.every(n=>indexIn(n,20)))return false;
 const edges=mazeConnections(turns);
 for(let i=1;i<path.length;i++){
  if(path[i-1]===MAZE_END||!edges.some(([a,b])=>a===path[i-1]&&b===path[i]||b===path[i-1]&&a===path[i]))return false;
  if(path[i]===MAZE_END&&mazeStars(path.slice(0,i)).length!==2)return false;
 }
 return true;
}
const adjacent=(turns,from,to)=>mazeConnections(turns).some(([a,b])=>a===from&&b===to||b===from&&a===to);
// Follow the current grooves, including a return along a spur for a star.
// Search node + visited stars, rather than matching one prescribed route.
export function mazeAutoWalk(p){
 if(!maze.valid(p)||maze.solved(p))return null;
 const edges=mazeConnections(p.turns),markBit=n=>MAZE_MARKS.includes(n)?1<<MAZE_MARKS.indexOf(n):0;
 const bits=mazeStars(p.path).reduce((mask,n)=>mask|markBit(n),0);
 const queue=[{node:p.path.at(-1),bits,tail:[]}],seen=new Set();
 for(let i=0;i<queue.length;i++){
  const current=queue[i],key=current.node+':'+current.bits;if(seen.has(key))continue;seen.add(key);
  if(current.node===MAZE_END){
   const next={...p,path:[...p.path,...current.tail],next:null,amount:0};
   return maze.valid(next)?next:null;
  }
  for(const[a,b]of edges){
   const to=a===current.node?b:b===current.node?a:null;
   if(to===null||to===MAZE_END&&current.bits!==3)continue;
   const visited=to===MAZE_START?0:current.bits|markBit(to);
   queue.push({node:to,bits:visited,tail:[...current.tail,to]});
  }
 }
 return null;
}
export const maze={
 create:()=>({turns:[3,4,0],path:[MAZE_START],next:null,amount:0}),
 valid(p){
  if(!bounded(p?.turns,3,6)||!validMazeWalk(p.turns,p.path))return false;
  if(p.next===null)return p.amount===0;
  return indexIn(p.next,20)&&Number.isFinite(p.amount)&&p.amount>0&&p.amount<1&&p.path.at(-1)!==MAZE_END&&adjacent(p.turns,p.path.at(-1),p.next)&&(p.next!==MAZE_END||p.amount<=mazeExitLimit(p.path));
 },
 move(p,a){
  if(p.path.at(-1)===MAZE_END)return p;
  if(a.type==='return')return mazeHome(p)?p:{...p,path:[MAZE_START],next:null,amount:0};
  if(mazeHome(p)){
   if(a.type==='set-turn'&&indexIn(a.index,3)&&indexIn(a.value,6))return {...p,turns:p.turns.map((v,i)=>i===a.index?a.value:v)};
   if(a.type==='turn'&&indexIn(a.index,3)&&[-1,1].includes(a.direction))return {...p,turns:p.turns.map((v,i)=>i===a.index?mod(v+a.direction,6):v)};
  }
  if(a.type!=='roll'||!Array.isArray(a.path)||a.path.length<p.path.length||!p.path.every((v,i)=>a.path[i]===v))return p;
  const next={...p,path:[...a.path],next:a.next,amount:a.amount};
  if(!maze.valid(next))return p;
  return next.path.length>1&&next.path.at(-1)===MAZE_START&&next.next===null?{...next,path:[MAZE_START]}:next;
 },
 solved:p=>p.path.at(-1)===MAZE_END,
};
