import test from 'node:test';
import assert from 'node:assert/strict';
import {mirrorMatrix,POSTAL_MIRROR} from '../src/data/postal.js';

const map=(m,[x,y])=>[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];
test('mirror view reverses the same paper and moves its finite field between the two stamps',()=>{
 for(const [aim,x]of [[0,POSTAL_MIRROR.left],[1,POSTAL_MIRROR.right]]){
  const matrix=mirrorMatrix(150,150,aim),center=map(matrix,[x,222]);
  assert.ok(Math.abs(center[0]-75)<1e-8);assert.ok(Math.abs(center[1]-75)<1e-8);
  assert.ok(map(matrix,[x+10,222])[0]<center[0]);
  // Printed word and coordinate rectangles must both fit the circular glass.
  for(const [dx,y]of [[-15,117],[15,117],[-15,143],[15,143],[-24,272],[24,272],[-24,305],[24,305]]){
   const p=map(matrix,[x+dx,y]);assert.ok(Math.hypot(p[0]-75,p[1]-75)<75);
  }
  const other=map(matrix,[aim?POSTAL_MIRROR.left:POSTAL_MIRROR.right,240]);
  assert.ok(other[0]<0||other[0]>150,'the other stamp cannot appear in an unobserved part of the glass');
 }
 const m=mirrorMatrix(150,150,.5);
 assert.ok(map(m,[140,240])[0]>150);assert.ok(map(m,[460,240])[0]<0);
});
