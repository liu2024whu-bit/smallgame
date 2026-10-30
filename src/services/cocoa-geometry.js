import {COCOA_VESSELS,COCOA_CAPACITIES,COCOA_PARTS,COCOA_CAMERA,COCOA_WIDE_CAMERA} from '../data/cocoa.js';

export const cocoaRotate=([x,y],angle)=>{const a=angle*Math.PI/180;return [x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];};
export const cocoaArea=points=>Math.abs(points.reduce((sum,p,i)=>{const n=points[(i+1)%points.length];return sum+p[0]*n[1]-p[1]*n[0];},0)/2);
function below(points,level){
 const out=[];
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length],aa=a[1]>=level,bb=b[1]>=level;
  if(aa)out.push(a);
  if(aa!==bb){const t=(level-a[1])/(b[1]-a[1]);out.push([a[0]+(b[0]-a[0])*t,level]);}
 }
 return out;
}
// The clipping plane stays horizontal in world space, including during tilt.
export function cocoaFluid(index,amount,angle=0){
 const shape=COCOA_VESSELS[index].cavity.map(p=>cocoaRotate(p,angle)),fraction=Math.max(0,Math.min(1,amount/COCOA_CAPACITIES[index]));
 const ys=shape.map(p=>p[1]);let low=Math.min(...ys),high=Math.max(...ys),target=cocoaArea(shape)*fraction;
 for(let i=0;i<28;i++){const mid=(low+high)/2;if(cocoaArea(below(shape,mid))>target)low=mid;else high=mid;}
 const level=(low+high)/2,filled=below(shape,level),cross=filled.filter(p=>Math.abs(p[1]-level)<.001).map(p=>p[0]);
 const left=cross.length?Math.min(...cross):0,right=cross.length?Math.max(...cross):0;
 return {points:filled.map(p=>cocoaRotate(p,-angle)),surface:cocoaRotate([(left+right)/2,level],-angle),width:right-left,level,fraction};
}
export function cocoaPourAngle(index,remaining){
 const v=COCOA_VESSELS[index],area=cocoaArea(v.cavity),fraction=remaining/COCOA_CAPACITIES[index];let low=0,high=118;
 for(let i=0;i<26;i++){const mid=(low+high)/2,shape=v.cavity.map(p=>cocoaRotate(p,-mid)),lip=cocoaRotate(v.spout,-mid)[1];if(cocoaArea(below(shape,lip))/area>fraction)low=mid;else high=mid;}
 return -(low+high)/2;
}
export function cocoaPourPose(from,to,angle){
 const source=COCOA_VESSELS[from],target=COCOA_VESSELS[to],mouth=[target.x+target.mouth[0]*target.scale,target.y+target.mouth[1]*target.scale],lip=cocoaRotate(source.spout.map(v=>v*source.scale),angle);
 return {x:mouth[0]-lip[0],y:mouth[1]-54-lip[1],angle,mouth};
}
export function cocoaPourCamera(from,to,before,after){
 const v=COCOA_VESSELS[from],[,,w,h]=COCOA_PARTS.frames[from];
 for(let i=0;i<=24;i++){
  const angle=cocoaPourAngle(from,before+(after-before)*i/24),pose=cocoaPourPose(from,to,angle);
  for(const corner of [[0,0],[w,0],[w,h],[0,h]]){const r=cocoaRotate(corner.map(n=>n*v.scale),angle),x=pose.x+r[0],y=pose.y+r[1];if(x<18||x>1518||y<18||y>1006)return COCOA_WIDE_CAMERA;}
 }
 return COCOA_CAMERA;
}
