import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENE_CHANGES, sceneChanges, paintMask } from '../src/data/scene-changes.js';
import { SCENE_BY_ID } from '../src/data/scenes.js';
import { PUZZLE_BY_ID } from '../src/data/puzzles.js';
import { ASSETS } from '../src/data/assets.js';
import { createState } from '../src/core/state.js';
import { renderRoom } from '../src/ui/room.js';

test('painted changes refer to real scenes, puzzles and complete bounded object regions',()=>{
  for(const change of SCENE_CHANGES){
    assert.ok(SCENE_BY_ID[change.scene]);assert.ok(change.activity==='birthday:unwrap'||PUZZLE_BY_ID[change.puzzle]);assert.ok(ASSETS[change.asset]);
    const [x,y,w,h]=change.region;
    assert.ok(x>=0&&y>=0&&w>1.2&&h>1.2&&x+w<=100&&y+h<=100);
    assert.ok(change.alt.length>0);assert.match(paintMask(change.region),/linear-gradient/);
  }
});

test('one solved object never reveals another object from the same painted source',()=>{
  const base=createState();
  assert.deepEqual(sceneChanges(base),[]);
  const paper={...base,solved:['paper']};
  assert.deepEqual(sceneChanges(paper).map(c=>c.puzzle),['paper']);
  const html=renderRoom(paper);
  assert.match(html,/data-world-change="paper"/);assert.doesNotMatch(html,/data-world-change="stitch"/);
  assert.doesNotMatch(renderRoom({...paper,scene:'entry'}),/scene-change/);
  const three={...base,scene:'entry',solved:['packing','flips','drawers']};
  assert.equal(sceneChanges(three).length,3);
  assert.equal((renderRoom(three).match(/data-world-change=/g)??[]).length,3);
});
