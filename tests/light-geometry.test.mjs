import test from 'node:test';
import assert from 'node:assert/strict';
import {LIGHT_GEOMETRY as G,LIGHT_LANDMARKS} from '../src/data/light.js';
import {reflectRay,traceLight,virtualProjection,filmPoint,filmProjection,bookShadow,visibleLightError} from '../src/puzzles/light-geometry.js';
import {LIGHT_LINES} from '../src/puzzles/light-ink.js';
import {drawingPaths} from '../src/ui/puzzles/light-drawing.js';
import {calibration,canTraceLight} from '../src/puzzles/calibration.js';
const close=(a,b,tolerance=1e-6)=>{assert.equal(a.length,b.length);a.forEach((v,i)=>assert.ok(Math.abs(v-b[i])<tolerance,JSON.stringify({a,b,i})));};
const states=Array.from({length:64},(_,n)=>[n%4,Math.floor(n/4)%4,Math.floor(n/16)]);
test('a 45-degree plane reflects a horizontal ray through a right angle and preserves vertical components',()=>{
 const n=[Math.SQRT1_2,-Math.SQRT1_2,0];
 close(reflectRay([100,0,7],n),[0,100,7]);close(reflectRay(reflectRay([73,-18,12],n),n),[73,-18,12]);
 const ray=traceLight([400,300,200],[2,1,3]);close(ray.hit,[700,300,180]);close(ray.end,[700,700,153.3333333333333]);
});
test('unfolded projection agrees with the real two-segment path, including a turning transparency',()=>{
 for(const values of states)for(const flip of [0,.25,.5,.75,1])for(const point of [[0,0],[200,0],[200,200],[0,200],[81,147]]){
  const world=filmPoint(point,values,flip),ray=traceLight(world,values);
  assert.ok(ray);close(virtualProjection(world,values),ray.screen);
 }
});
test('every authored ink sample stays finite during a physical flip and both cameras preserve the same drawing',()=>{
 for(const values of states)for(const phase of [0,.25,.5,.75,1]){
  for(const run of LIGHT_LINES)for(const point of run)assert.ok(filmProjection(point,values,phase).screen.every(Number.isFinite));
  for(const tall of [false,true]){
   const data=drawingPaths({...calibration.create(),values,flipped:phase},tall);
   for(const path of Object.values(data))assert.ok(!/NaN|Infinity|undefined/.test(path));
  }
 }
 assert.ok(LIGHT_LINES.length>=9);
});
const inPolygon=(p,polygon)=>{let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;};
function segmentHitsBox(from,to,minimum,maximum){
 let low=0,high=1;
 for(let i=0;i<3;i++){
  const d=to[i]-from[i];if(Math.abs(d)<1e-12){if(from[i]<minimum[i]||from[i]>maximum[i])return false;continue;}
  const a=(minimum[i]-from[i])/d,b=(maximum[i]-from[i])/d;low=Math.max(low,Math.min(a,b));high=Math.min(high,Math.max(a,b));
 }
 return low<=high;
}
test('the long bookmark shadow matches an independent ray/solid intersection, without discarding off-screen ends',()=>{
 const polygon=bookShadow([2,1,3]);assert.ok(polygon.length>=4);
 for(const x of [580,640,700,760,820])for(const z of [0,20,40,60,80,100,160]){
  // For this known 45-degree geometry the reflected light source is (700,-300,220).
  const t=600/(1700-x),hit=[700+t*(x-700),-300+1000*t,220+t*(z-220)];
  const blocked=segmentHitsBox([100,300,220],hit,[206,260,198],[234,420,202]);
  assert.equal(inPolygon([x,z],polygon),blocked,JSON.stringify({x,z}));
 }
 for(const values of states)for(const [x,z]of bookShadow(values)){assert.ok(Number.isFinite(x)&&Number.isFinite(z));assert.ok(x>=G.screen.left-1e-5&&x<=G.screen.right+1e-5&&z>=G.screen.bottom-1e-5&&z<=G.screen.top+1e-5);}
});
test('visible configurations have one joint solution; wrong snapped positions remain visually separated',()=>{
 const found=[];let nearest=Infinity;
 for(const values of states)for(const flipped of [false,true]){
  const error=visibleLightError(values,flipped,LIGHT_LANDMARKS);
  if(error<.75)found.push({values,flipped});else nearest=Math.min(nearest,error);
 }
 assert.deepEqual(found,[{values:[2,1,3],flipped:true}]);assert.ok(nearest>20);
 for(const point of LIGHT_LANDMARKS){const ray=filmProjection(point,[2,1,3],true);assert.ok(ray.inside);assert.ok(ray.screen[1]>85.6716417911);}
});
test('alignment is not a finished drawing; tracing needs the three fitted tools and light',()=>{
 assert.ok(traceLight([234,300,202],[2,1,3]).inside);assert.ok(!traceLight([206,300,198],[2,1,3]).inside);
 const initial=calibration.create();assert.equal(calibration.move(initial,{type:'trace'}),initial);
 assert.equal(calibration.move(initial,{type:'flip'}),initial);
 for(const order of [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]){
  let s=initial;for(const index of order)s=calibration.move(s,{type:'fit',index});
  s=calibration.move(s,{type:'flip'});for(const [index,value]of [2,1,3].entries())s=calibration.move(s,{type:'set-turn',index,value});
  assert.ok(!calibration.solved(s));assert.ok(!canTraceLight(s));
  s=calibration.move(s,{type:'power'});assert.ok(canTraceLight(s));
  for(let index=0;index<3;index++){const incomplete=calibration.move(s,{type:'unfit',index});assert.equal(calibration.move(incomplete,{type:'trace'}),incomplete);}
  const done=calibration.move(s,{type:'trace'});assert.ok(calibration.valid(done));assert.ok(calibration.solved(done));
  assert.deepEqual(done.proof,{values:[2,1,3],flipped:true});assert.deepEqual(done.fitted,[false,false,false]);assert.equal(done.lit,false);
  assert.ok(!calibration.valid({...done,lit:true}));assert.ok(!calibration.valid({...done,fitted:[true,false,false]}));
  assert.ok(calibration.valid({...done,values:[0,0,0]}));assert.ok(calibration.solved({...done,values:[0,0,0]}));
  assert.equal(calibration.move(done,{type:'power'}),done);assert.equal(calibration.move(done,{type:'set-turn',index:0,value:0}),done);
 }
});
test('rails have physical endpoints and invalid gestures do not mutate progress',()=>{
 const s=calibration.create();assert.equal(calibration.move(s,{type:'turn',index:0,direction:-1}),s);
 for(const action of [{type:'set-turn',index:3,value:1},{type:'set-turn',index:1,value:4},{type:'set-turn',index:0,value:1.5},{type:'fit',index:-1},{type:'turn',index:1,direction:2}])assert.equal(calibration.move(s,action),s);
 assert.ok(!calibration.valid({...s,proof:{values:[2,1,3],flipped:false}}));assert.ok(!calibration.valid({...s,fitted:[true,true]}));
});
