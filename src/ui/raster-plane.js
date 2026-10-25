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
export const polygon=points=>'polygon('+points.map(p=>p.map(n=>n.toFixed(3)+'px').join(' ')).join(',')+')';
export function excluding(points,width,height){
 if(!points.length)return '';
 const outer=[[0,0],[width,0],[width,height],[0,height],[0,0]],hole=[...points,points[0]];
 return 'polygon(evenodd,'+[...outer,...hole].map(p=>p.map(n=>n.toFixed(3)+'px').join(' ')).join(',')+')';
}
export function rasterPlane(asset,index,quad,{name='',className='',cutout=null}={}){
 const layout=ASSET_LAYOUTS[asset],frame=layout?.frames?.[index]??[0,0,layout.width,layout.height], [x,y,w,h]=frame;
 const mask=cutout?`clip-path:${excluding([[cutout.x-x,cutout.y-y],[cutout.x+cutout.width-x,cutout.y-y],[cutout.x+cutout.width-x,cutout.y+cutout.height-y],[cutout.x-x,cutout.y+cutout.height-y]],w,h)};`:'';
 return `<span class="light-plane ${className}" ${name?`data-light-plane="${name}"`:''} data-plane-size="${w},${h}" style="width:${w}px;height:${h}px;transform:${matrixStyle(quad,w,h)}"><span class="light-plane-crop" style="${mask}"><img src="${ASSETS[asset]}" alt="" draggable="false" style="width:${layout.width}px;height:${layout.height}px;left:${-x}px;top:${-y}px"></span></span>`;
}
export function paintPlane(root,name,quad){
 const el=root.querySelector(`[data-light-plane="${name}"]`);if(!el)return;
 const [w,h]=el.dataset.planeSize.split(',').map(Number);el.style.transform=matrixStyle(quad,w,h);
}
