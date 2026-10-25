import {LIGHT_GEOMETRY as G,LIGHT_TARGET,LIGHT_FILM_SIZE as SIZE} from '../data/light.js';
const dot=(a,b)=>a.reduce((sum,value,i)=>sum+value*b[i],0);
const subtract=(a,b)=>a.map((v,i)=>v-b[i]);
const addScaled=(a,b,t)=>a.map((v,i)=>v+b[i]*t);
export const lightCamera=([x,y,z],camera=G.camera)=>[camera.xx*x+camera.xy*y+camera.x0,camera.yx*x+camera.yy*y+camera.yz*z+camera.y0];
export function lightNormal(turn){const angle=G.normals[0]+turn*(G.normals[1]-G.normals[0]);return [Math.cos(angle*Math.PI/180),Math.sin(angle*Math.PI/180),0];}
export function reflectRay(ray,normal){return addScaled(ray,normal,-2*dot(ray,normal));}
export function traceLight(point,values){
 const normal=lightNormal(values[2]),ray=subtract(point,G.source),denominator=dot(ray,normal);
 if(Math.abs(denominator)<1e-9)return null;
 const t=dot(subtract(G.mirror,G.source),normal)/denominator;if(t<=0)return null;
 const hit=addScaled(G.source,ray,t),reflected=reflectRay(ray,normal),k=(G.screenY-hit[1])/reflected[1];
 if(!Number.isFinite(k)||k<=0)return null;
 const end=addScaled(hit,reflected,k),offset=subtract(hit,G.mirror),tangent=[-normal[1],normal[0],0];
 return {hit,end,screen:[end[0],end[2]],normal,ray,reflected,inside:Math.hypot(dot(offset,tangent),offset[2])<=G.mirrorRadius+1e-7};
}
export function filmPoint([x,y],values,flipped=false){
 const span=G.filmHalf*2,phase=typeof flipped==='boolean'?(flipped?1:0):flipped,angle=phase*Math.PI,offset=(x/SIZE-.5)*span;
 return [G.filmX[0]+values[0]*(G.filmX[1]-G.filmX[0])-Math.sin(angle)*offset,G.filmY+Math.cos(angle)*offset,G.filmZ+(.5-y/SIZE)*span];
}
export const filmProjection=(point,values,flipped=false)=>traceLight(filmPoint(point,values,flipped),values);
export const screenToCamera=([x,z])=>lightCamera([x,G.screenY,z]);
export function bookPoints(values){
 const h=G.bookZ[0]+values[1]*(G.bookZ[1]-G.bookZ[0]);
 return G.bookX.flatMap(x=>G.bookY.flatMap(y=>[-1,1].map(sign=>[x,y,h+sign*G.bookHalfThickness])));
}
export function convexHull(points){
 const unique=[...new Map(points.map(p=>[p.join(','),p])).values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 if(unique.length<3)return unique;
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const half=sequence=>{const hull=[];for(const p of sequence){while(hull.length>1&&cross(hull.at(-2),hull.at(-1),p)<=0)hull.pop();hull.push(p);}return hull.slice(0,-1);};
 return [...half(unique),...half([...unique].reverse())];
}
export function reflectedPoint(point,values){
 const normal=lightNormal(values[2]);return addScaled(point,normal,-2*dot(subtract(point,G.mirror),normal));
}
// Unfolding the mirror keeps off-screen occluder corners. Discarding a corner
// whose individual ray misses the mirror would incorrectly erase a long shadow.
export function virtualProjection(point,values){
 const source=reflectedPoint(G.source,values),image=reflectedPoint(point,values),w=image[1]-source[1];
 if(w<=1e-8)return null;
 const t=(G.screenY-source[1])/w;return [source[0]+t*(image[0]-source[0]),source[2]+t*(image[2]-source[2])];
}
export function clipLightScreen(points){
 let polygon=points;
 for(const [axis,bound,sign]of [[0,G.screen.left,1],[0,G.screen.right,-1],[1,G.screen.bottom,1],[1,G.screen.top,-1]]){
  const next=[];
  for(let i=0;i<polygon.length;i++){
   const a=polygon[i],b=polygon[(i+1)%polygon.length],insideA=(a[axis]-bound)*sign>=0,insideB=(b[axis]-bound)*sign>=0;
   if(insideA)next.push(a);
   if(insideA!==insideB){const t=(bound-a[axis])/(b[axis]-a[axis]);next.push(a.map((v,j)=>v+(b[j]-v)*t));}
  }
  polygon=next;
 }
 return polygon;
}
export const bookShadow=values=>clipLightScreen(convexHull(bookPoints(values).map(p=>virtualProjection(p,values)).filter(Boolean)));
export function mirrorCircle(values,count=64){
 const normal=lightNormal(values[2]),u=[-normal[1],normal[0],0];
 return Array.from({length:count},(_,i)=>{
  const angle=i/count*Math.PI*2;
  return addScaled(addScaled(G.mirror,u,Math.cos(angle)*G.mirrorRadius),[0,0,1],Math.sin(angle)*G.mirrorRadius);
 });
}
export const mirrorFootprint=values=>mirrorCircle(values).map(point=>traceLight(point,values)?.screen).filter(Boolean);
export function visibleLightError(values,flipped,landmarks){
 const goal=LIGHT_TARGET,distances=landmarks.map(point=>{
  const actual=filmProjection(point,values,flipped),a=actual?.inside?actual.screen:null,b=filmProjection(point,goal.values,goal.flipped).screen;
  return a?Math.hypot(a[0]-b[0],a[1]-b[1]):Infinity;
 });
 const height=G.bookZ[0]+values[1]*(G.bookZ[1]-G.bookZ[0]);
 const targetHeight=G.bookZ[goal.values[1]];
 // Only the upper far edge is illuminated by this finite mirror. The lower
 // near edge lies outside the light patch, so it cannot be a hidden condition.
 for(const y of [298,302]){
  const actual=traceLight([G.bookX[1],y,height+G.bookHalfThickness],values),a=actual?.inside?actual.screen:null;
  const b=traceLight([G.bookX[1],y,targetHeight+G.bookHalfThickness],goal.values).screen;
  distances.push(a?Math.hypot(a[0]-b[0],a[1]-b[1]):Infinity);
 }
 return Math.max(...distances);
}
