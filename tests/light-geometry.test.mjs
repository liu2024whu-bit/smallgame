import test from 'node:test';
import assert from 'node:assert/strict';
import {LIGHT_GEOMETRY as G,LIGHT_LANDMARKS,lightLayout} from '../src/data/light.js';
import {reflectRay,traceLight,virtualProjection,filmPoint,filmProjection,bookShadow,visibleLightError,lightNormal,lightCamera,mirrorBasis,mirrorCircle} from '../src/puzzles/light-geometry.js';
import {printQuad,drawingMasks} from '../src/ui/puzzles/light-raster.js';
import {planeMatrix} from '../src/ui/raster-plane.js';
import {ASSET_LAYOUTS} from '../src/data/asset-layouts.js';
import {calibration,canTraceLight} from '../src/puzzles/calibration.js';
const close=(a,b,tolerance=1e-6)=>{assert.equal(a.length,b.length);a.forEach((v,i)=>assert.ok(Math.abs(v-b[i])<tolerance,JSON.stringify({a,b,i})));};
const states=Array.from({length:64},(_,n)=>[n%4,Math.floor(n/4)%4,Math.floor(n/16)]);
test('a 45-degree plane reflects a horizontal ray through a right angle and preserves vertical components',()=>{
 const n=[Math.SQRT1_2,-Math.SQRT1_2,0];
 close(reflectRay([100,0,7],n),[0,100,7]);close(reflectRay(reflectRay([73,-18,12],n),n),[73,-18,12]);
 const ray=traceLight(filmPoint([100,100],[2,1,3]),[2,1,3]);close(ray.hit,G.mirror);close(ray.end,[700,700,165]);
});
test('unfolded projection agrees with the real two-segment path, including a turning transparency',()=>{
 for(const values of states)for(const flip of [0,.25,.5,.75,1])for(const point of [[0,0],[200,0],[200,200],[0,200],[81,147]]){
  const world=filmPoint(point,values,flip),ray=traceLight(world,values);
  assert.ok(ray);close(virtualProjection(world,values),ray.screen);
 }
});
test('raster pigment anchors and projected quads remain finite throughout a flip in all cameras',()=>{
 for(const values of states)for(const phase of [0,.25,.5,.75,1]){
  for(const point of LIGHT_LANDMARKS)assert.ok(filmProjection(point,values,phase).screen.every(Number.isFinite));
  for(const view of [false,true,'room']){
   assert.ok(printQuad(values,phase,false,view).flat().every(Number.isFinite));
   for(const path of Object.values(drawingMasks(values,view)))assert.ok(!/NaN|Infinity|undefined/.test(path));
  }
 }
});
test('the raster homography agrees with independently traced interior pigment, not only its four corners',()=>{
 const [x,y,w,h]=ASSET_LAYOUTS.lightPrint.frames[1];
 for(const values of states)for(const phase of [0,.25,.49,.51,.75,1])for(const view of [false,true,'room']){
  const matrix=planeMatrix(printQuad(values,phase,false,view),w,h);
  for(const point of LIGHT_LANDMARKS){
   const px=(point[0]+100)/400*1254-x,py=(point[1]+100)/400*1254-y,weight=matrix[3]*px+matrix[7]*py+matrix[15];
   const actual=[(matrix[0]*px+matrix[4]*py+matrix[12])/weight,(matrix[1]*px+matrix[5]*py+matrix[13])/weight];
   const ray=filmProjection(point,values,phase),expected=lightCamera([ray.end[0],G.screenY,ray.end[2]],lightLayout(view).camera);
   close(actual,expected,1e-5);
  }
 }
});
test('the inclined mirror basis is orthonormal and every pupil sample is on its real plane',()=>{
 for(const values of states){
  const n=lightNormal(values[2]),{u,v}=mirrorBasis(values),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  for(const axis of [n,u,v])assert.ok(Math.abs(Math.hypot(...axis)-1)<1e-8);
  for(const [a,b]of [[n,u],[n,v],[u,v]])assert.ok(Math.abs(dot(a,b))<1e-8);
  for(const p of mirrorCircle(values)){
   const d=p.map((x,i)=>x-G.mirror[i]);assert.ok(Math.abs(dot(d,n))<1e-8);assert.ok(Math.abs(Math.hypot(...d)-G.mirrorRadius)<1e-7);
  }
 }
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
 const polygon=bookShadow([2,1,3]);assert.ok(polygon.length>=3);
 const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),n=lightNormal(3),offset=G.source.map((v,i)=>v-G.mirror[i]);
 const virtual=G.source.map((v,i)=>v-2*dot(offset,n)*n[i]);
 for(const x of [610,650,700,750,790])for(const z of [55,80,100,130,160,210,280]){
  const ray=[x-virtual[0],G.screenY-virtual[1],z-virtual[2]],t=dot(G.mirror.map((v,i)=>v-virtual[i]),n)/dot(ray,n),hit=virtual.map((v,i)=>v+t*ray[i]);
  const blocked=segmentHitsBox(G.source,hit,[206,260,484],[234,380,488]);
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
 assert.deepEqual(found,[{values:[2,1,3],flipped:true}]);assert.ok(nearest>10);
 const shadow=bookShadow([2,1,3]);
 for(const point of LIGHT_LANDMARKS){const ray=filmProjection(point,[2,1,3],true);assert.ok(ray.inside);assert.ok(!inPolygon(ray.screen,shadow));}
});
test('alignment is not a finished drawing; tracing needs the three fitted tools and light',()=>{
 assert.ok(traceLight([234,300,488],[2,1,3]).inside);
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
