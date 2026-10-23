import test from 'node:test';
import assert from 'node:assert/strict';
import { turnDelta } from '../src/services/motion/shared.js';
import { routeMeasure } from '../src/services/motion/maze.js';
import { mazeWalk, mazePoint } from '../src/ui/puzzles/maze.js';
import { mazePath, MAZE_STARS } from '../src/puzzles/maze.js';

test('released dials settle through the short arc after multiple turns in either direction',()=>{
  for(const turns of [-12,-5,0,4,13]) {
    assert.equal(turnDelta(352+turns*360,0),-8);
    assert.equal(turnDelta(8+turns*360,0),8);
  }
});

test('maze keyframe time follows travelled distance rather than vertex count',()=>{
  assert.deepEqual(routeMeasure([[0,0],[3,4],[3,19]]),{total:20,offsets:[0,.25,1]});
  assert.deepEqual(routeMeasure([[1,1],[1,1]]),{total:0,offsets:[0,0]});
});

test('the complete maze journey reaches both fixed stars before the exit',()=>{
  const points=mazeWalk(mazePath([0,0,2])),{offsets}=routeMeasure(points);
  const visits=MAZE_STARS.map(node=>{
    const [x,y]=mazePoint(node);
    return points.findIndex(([px,py])=>Math.hypot(x-px,y-py)<2);
  });
  assert.ok(visits.every(index=>index>0 && offsets[index]<1));
  assert.deepEqual(points[0],mazePoint(0));
  assert.deepEqual(points.at(-1),mazePoint(15));
  assert.ok(offsets.every((offset,i)=>!i || offset>=offsets[i-1]));
});
