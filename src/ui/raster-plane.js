import {ASSETS} from '../data/assets.js';
import {ASSET_LAYOUTS} from '../data/asset-layouts.js';

// Four-corner homography. It maps the original bitmap, including perspective,
// without dividing it into triangles or redrawing its artwork as vectors.
export function planeMatrix(quad,width,height){
 const [a,b,c,d]=quad,dx1=b[0]-c[0],dx2=d[0]-c[0],dy1=b[1]-c[1],dy2=d[1]-c[1];
 const dx3=a[0]-b[0]+c[0]-d[0],dy3=a[1]-b[1]+c[1]-d[1],det=dx1*dy2-dx2*dy1;
 const g=Math.abs(det)<1e-9?0:(dx3*dy2-dx2*dy3)/det,h=Math.abs(det)<1e-9?0:(dx1*dy3-dx3*dy1)/det;
 return [(b[0]-a[0]+g*b[0])/width,(b[1]-a[1]+g*b[1])/width,0,g/width,
  (d[0]-a[0]+h*d[0])/height,(d[1]-a[1]+h*d[1])/height,0,h/height,0,0,1,0,a[0],a[1],0,1];
}
export const matrixStyle=(quad,w,h)=>'matrix3d('+planeMatrix(quad,w,h).map(n=>Number(n.toFixed(9))).join(',')+')';
const flatMatrix=q=>{const m=planeMatrix(q,1,1);return [m[0],m[4],m[12],m[1],m[5],m[13],m[3],m[7],1];};
function inverse3([a,b,c,d,e,f,g,h,i]){
 const n=[e*i-f*h,c*h-b*i,b*f-c*e,f*g-d*i,a*i-c*g,c*d-a*f,d*h-e*g,b*g-a*h,a*e-b*d];
 const det=a*n[0]+b*n[3]+c*n[6];
 if(Math.abs(det)<1e-12)throw new RangeError('Cannot project a collapsed raster face');
 return n.map(v=>v/det);
}
// Unproject a measured face in an illustration before placing it in another
// camera. The same paint and all its interior anchors share one homography.
export function mappedPlaneMatrix(source,target){
 const a=flatMatrix(target),b=inverse3(flatMatrix(source));
 const m=Array.from({length:9},(_,i)=>[0,1,2].reduce((s,k)=>s+a[Math.floor(i/3)*3+k]*b[k*3+i%3],0));
 const [aa,bb,cc,dd,ee,ff,gg,hh,ii]=m.map(v=>v/m[8]);
 return [aa,dd,0,gg,bb,ee,0,hh,0,0,1,0,cc,ff,0,ii];
}
export const mappedPlaneStyle=(source,target)=>'matrix3d('+mappedPlaneMatrix(source,target).map(n=>Number(n.toFixed(9))).join(',')+')';
export function projectedPoint(matrix,[x,y]){
 const w=matrix[3]*x+matrix[7]*y+matrix[15];
 return [(matrix[0]*x+matrix[4]*y+matrix[12])/w,(matrix[1]*x+matrix[5]*y+matrix[13])/w];
}
export const polygon=points=>'polygon('+points.map(p=>p.map(n=>n.toFixed(3)+'px').join(' ')).join(',')+')';
// Extend a measured front face to the enclosing source canvas. The painted
// side/top stay outside this plane, rather than skewing an entire solid prop.
export function enclosingPlane([x,y,width,height],quad,canvasWidth,canvasHeight){
 const matrix=planeMatrix(quad,width,height);
 return [[0,0],[canvasWidth,0],[canvasWidth,canvasHeight],[0,canvasHeight]].map(([px,py])=>{
  const u=px-x,v=py-y,denominator=matrix[3]*u+matrix[7]*v+1;
  return [(matrix[0]*u+matrix[4]*v+matrix[12])/denominator,(matrix[1]*u+matrix[5]*v+matrix[13])/denominator];
 });
}
export function excluding(points,width,height){
 if(!points.length)return '';
 const outer=[[0,0],[width,0],[width,height],[0,height],[0,0]],hole=[...points,points[0]];
 return 'polygon(evenodd,'+[...outer,...hole].map(p=>p.map(n=>n.toFixed(3)+'px').join(' ')).join(',')+')';
}
export function rasterPlane(asset,index,quad,{name='',className='',cutout=null}={}){
 const layout=ASSET_LAYOUTS[asset],frame=layout?.frames?.[index]??[0,0,layout.width,layout.height], [x,y,w,h]=frame;
 const hole=cutout?(Array.isArray(cutout)?cutout:[[cutout.x,cutout.y],[cutout.x+cutout.width,cutout.y],[cutout.x+cutout.width,cutout.y+cutout.height],[cutout.x,cutout.y+cutout.height]]).map(([px,py])=>[px-x,py-y]):[];
 const mask=cutout?`clip-path:${excluding(hole,w,h)};`:'';
 return `<span class="light-plane ${className}" ${name?`data-light-plane="${name}"`:''} data-plane-size="${w},${h}" style="width:${w}px;height:${h}px;transform:${matrixStyle(quad,w,h)}"><span class="light-plane-crop" style="${mask}"><img src="${ASSETS[asset]}" alt="" draggable="false" style="width:${layout.width}px;height:${layout.height}px;left:${-x}px;top:${-y}px"></span></span>`;
}
export function paintPlane(root,name,quad){
 const el=root.querySelector(`[data-light-plane="${name}"]`);if(!el)return;
 const [w,h]=el.dataset.planeSize.split(',').map(Number);el.style.transform=matrixStyle(quad,w,h);
}
