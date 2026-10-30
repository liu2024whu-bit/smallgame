import test from 'node:test';
import assert from 'node:assert/strict';
import {maze,mazeAutoWalk,mazeStars} from '../src/puzzles/maze.js';
import {MAZE_START,MAZE_END,MAZE_MARKS,MAZE_WITNESS,mazeConnections,mazePoint,mazeEdgePoint} from '../src/data/maze-apparatus.js';
import {mazeJourney} from '../src/data/maze-travel.js';

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
