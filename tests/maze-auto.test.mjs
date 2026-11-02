import test from 'node:test';
import assert from 'node:assert/strict';
import {maze,mazeAutoWalk,mazeAutoTravel,mazeStars} from '../src/puzzles/maze.js';
import {MAZE_START,MAZE_END,MAZE_MARKS,MAZE_WITNESS,MAZE_CENTER,MAZE_BOUNDARIES,MAZE_BALL_RADIUS,MAZE_SEAM,mazeConnections,mazePoint,mazeEdgePoint,mazeEdgeLength} from '../src/data/maze-apparatus.js';
import {mazeJourney,advanceMazeBall} from '../src/data/maze-travel.js';
import {createState,normalizeState,serializable} from '../src/core/state.js';

function reachable(turns){
 const edges=mazeConnections(turns),queue=[[MAZE_START,new Set()]],seen=new Set();
 for(let i=0;i<queue.length;i++){
  const[n,stars]=queue[i],key=n+':'+[...stars].sort().join();if(seen.has(key))continue;seen.add(key);
  if(n===MAZE_END)return true;
  for(const[a,b]of edges){
   const to=a===n?b:b===n?a:null;if(to===null||to===MAZE_END&&stars.size!==MAZE_MARKS.length)continue;
   queue.push([to,to===MAZE_START?new Set():new Set([...stars,...(MAZE_MARKS.includes(to)?[to]:[])])]);
  }
 }
 return false;
}
test('automatic travel accepts every connected solution and never crosses a wall or misses a star',()=>{
 for(let a=0;a<6;a++)for(let b=0;b<6;b++)for(let c=0;c<6;c++){
  const p={...maze.create(),turns:[a,b,c]},before=structuredClone(p),next=mazeAutoWalk(p);
  assert.equal(!!next,reachable(p.turns),p.turns.join());assert.deepEqual(p,before);
  if(next){assert.ok(maze.valid(next));assert.ok(maze.solved(next));assert.deepEqual(mazeStars(next.path),MAZE_MARKS);assert.deepEqual(maze.move(p,{type:'roll',...next}),next);}
 }
});
test('automatic travel can continue alternate walks and partially moved old saves',()=>{
 const p={...maze.create(),turns:[0,2,3],path:[18,0,1,0,1]},next=mazeAutoWalk(p);
 assert.ok(maze.valid(p));assert.ok(maze.solved(next));assert.deepEqual(next.path.slice(0,p.path.length),p.path);
 const partial={...p,path:MAZE_WITNESS.slice(0,3),next:2,amount:.37},rest=mazeAutoWalk(partial),points=mazeJourney(partial,rest);
 assert.deepEqual(points[0],mazeEdgePoint(1,2,.37));assert.deepEqual(points.at(-1),mazePoint(MAZE_END));assert.ok(maze.valid(rest));
 const stopped={...p,path:MAZE_WITNESS.slice(0,7),next:19,amount:.3},continued=mazeAutoWalk(stopped);
 assert.ok(maze.valid(stopped));assert.ok(maze.solved(continued));assert.deepEqual(mazeStars(continued.path),MAZE_MARKS);
 assert.equal(mazeAutoWalk(rest),null);
});
test('completion accepts different valid walks rather than comparing a prescribed answer path',()=>{
 const p={...maze.create(),turns:[0,2,3]},direct=mazeAutoWalk(p).path;
 const [junction,tip]=mazeConnections(p.turns).find(([a,b])=>b>=20&&direct.includes(a)),at=direct.indexOf(junction);
 const walks=[direct,[...direct.slice(0,3),direct[1],...direct.slice(2)],[...direct.slice(0,at+1),tip,junction,...direct.slice(at+1)]];
 for(const path of walks){const next=maze.move(p,{type:'roll',path,next:null,amount:0});assert.ok(maze.solved(next));assert.deepEqual(mazeStars(next.path),MAZE_MARKS);}
});
test('every trial follows real grooves and returns home without falsely completing the puzzle',()=>{
 for(let a=0;a<6;a++)for(let b=0;b<6;b++)for(let c=0;c<6;c++){
  const p={...maze.create(),turns:[a,b,c]},next=mazeAutoTravel(p);
  if(!next){assert.ok(!mazeConnections(p.turns).some(edge=>edge.includes(MAZE_START)));continue;}
  assert.ok(maze.valid(next));
  if(maze.solved(next)){assert.deepEqual(mazeStars(next.path),MAZE_MARKS);continue;}
  assert.equal(next.path.at(-1),MAZE_START);assert.deepEqual(maze.move(p,{type:'roll',...next}),p);
 }
});
test('the reported arrangement tries its open entrance, reaches both stars and recovers instead of staying stuck',()=>{
 const p={...maze.create(),turns:[3,1,2]},next=mazeAutoTravel(p);
 assert.equal(mazeAutoWalk(p),null);assert.ok(next.path.includes(8)&&next.path.includes(17));assert.equal(next.path.at(-1),MAZE_START);assert.ok(!next.path.includes(MAZE_END));
 assert.equal(mazeAutoTravel({...p,path:[18,0,1]}),null);
});
test('painted unpaired port ends fit the ball inside the wooden boundary at every angle',()=>{
 for(let a=0;a<6;a++)for(let b=0;b<6;b++)for(let c=0;c<6;c++)for(const edge of mazeConnections([a,b,c]))for(const node of edge.filter(n=>n>=20)){
  const ring=Math.floor((node-20)/12),point=mazePoint(node),radius=Math.hypot(point[0]-MAZE_CENTER[0],point[1]-MAZE_CENTER[1]);
  assert.ok(radius+MAZE_BALL_RADIUS<=MAZE_BOUNDARIES[ring]-MAZE_SEAM+.00001);
  assert.ok(radius-MAZE_BALL_RADIUS>=MAZE_BOUNDARIES[ring+1]+MAZE_SEAM-.00001);
 }
});
test('a ball can enter a visible short groove and an old-format save preserves that position',()=>{
 let p={...maze.create(),turns:[3,1,2],path:[18,0,1,7,8,14,15,16,17]};const end=55,steps=Math.ceil(mazeEdgeLength(17,end)/5);
 for(let i=1;i<=steps;i++)p=advanceMazeBall(p,mazeEdgePoint(17,end,i/steps),9,30);
 assert.equal(p.path.at(-1),end);assert.ok(maze.valid(p));assert.equal(maze.solved(p),false);
 const s=createState();s.begun=true;s.progress.maze=p;const restored=normalizeState(serializable(s));assert.deepEqual(restored.progress.maze,p);
});
