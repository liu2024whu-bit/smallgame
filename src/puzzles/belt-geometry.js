import {BELT_WHEELS,BELT_RETURNS} from '../data/belt.js';
const tau=2*Math.PI;
const point=(c,a)=>[c.x+Math.cos(a)*c.r,c.y+Math.sin(a)*c.r];
// Circle tangencies carry the cord along the rims. Reversing the last sheave
// chooses the internal tangent, so an actual crossover reverses the drive.
export function beltTangent(a,b,sa=1,sb=1){
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),q=(sa*a.r-sb*b.r)/d;
 if(d===0||Math.abs(q)>=1)return null;
 const nx=dx/d*q-dy/d*Math.sqrt(1-q*q),ny=dy/d*q+dx/d*Math.sqrt(1-q*q);
 return {from:[a.x+sa*a.r*nx,a.y+sa*a.r*ny],to:[b.x+sb*b.r*nx,b.y+sb*b.r*ny]};
}
const addLine=(out,a,b)=>{
 const length=Math.hypot(b[0]-a[0],b[1]-a[1]),count=Math.max(1,Math.ceil(length/3));
 for(let i=1;i<=count;i++)out.push([a[0]+(b[0]-a[0])*i/count,a[1]+(b[1]-a[1])*i/count]);
};
const addArc=(out,c,a,b,side)=>{
 const start=Math.atan2(a[1]-c.y,a[0]-c.x),end=Math.atan2(b[1]-c.y,b[0]-c.x),direction=-side;
 let delta=(end-start)%tau;if(delta*direction<0)delta+=direction*tau;
 const count=Math.max(1,Math.ceil(Math.abs(delta)*c.r/3));
 for(let i=1;i<=count;i++)out.push(point(c,start+delta*i/count));
};
export function beltCordPoints(route,crossed=false,tail=null){
 if(!route.length)return [];
 const complete=route.length===7&&route.at(-1)===6,circles=route.map(index=>({...BELT_WHEELS[index],side:BELT_WHEELS[index].side*(crossed&&index===6?-1:1)}));
 if(complete)circles.push(...BELT_RETURNS);
 const edges=circles.slice(0,-1).map((a,i)=>beltTangent(a,circles[i+1],a.side,circles[i+1].side));
 if(complete)edges.push(beltTangent(circles.at(-1),circles[0],circles.at(-1).side,circles[0].side));
 if(edges.some(edge=>!edge))return [];
 const first=circles[0],start=complete?edges.at(-1).to:point(first,Math.PI),out=[start];
 if(!edges.length){addArc(out,first,start,point(first,0),first.side);}
 for(let i=0;i<edges.length;i++){
  const incoming=i?edges[i-1].to:start;
  addArc(out,circles[i],incoming,edges[i].from,circles[i].side);
  addLine(out,edges[i].from,edges[i].to);
 }
 if(!complete&&edges.length){const last=circles.at(-1),end=point(last,0);addArc(out,last,edges.at(-1).to,end,last.side);}
 if(tail){const end=out.at(-1),sag=Math.min(38,Math.hypot(tail[0]-end[0],tail[1]-end[1])*.12);for(let i=1;i<=25;i++){const t=i/25;out.push([end[0]+(tail[0]-end[0])*t,end[1]+(tail[1]-end[1])*t+Math.sin(t*Math.PI)*sag]);}}
 return out;
}
