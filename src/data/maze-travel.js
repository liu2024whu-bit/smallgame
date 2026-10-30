import {MAZE_END,mazePoint,mazeEdgePoint,mazeEdgeLength,mazeConnections,MAZE_CENTER,mazeAngle,mazeExitLimit} from './maze-apparatus.js';
const clamp=n=>Math.max(0,Math.min(1,n));
export function mazeProject(from,to,point){
 const a=mazePoint(from),b=mazePoint(to);let values;
 if(from<18&&to<18&&Math.floor(from/6)===Math.floor(to/6)){
  const direction=((to-from+6)%6)===1?1:-1,start=mazeAngle(from%6),angle=Math.atan2(point[1]-MAZE_CENTER[1],point[0]-MAZE_CENTER[0]);
  values=[-2*Math.PI,0,2*Math.PI].map(shift=>clamp((angle-start+shift)/(direction*Math.PI/3)));
 }else{const d=b.map((v,i)=>v-a[i]),length=d[0]**2+d[1]**2;values=[clamp(((point[0]-a[0])*d[0]+(point[1]-a[1])*d[1])/length)];}
 return values.map(amount=>{const p=mazeEdgePoint(from,to,amount);return {amount,point:p,distance:Math.hypot(p[0]-point[0],p[1]-point[1]),length:mazeEdgeLength(from,to)};}).sort((x,y)=>x.distance-y.distance)[0];
}
export function mazeNeighbours(p){
 const n=p.path.at(-1);
 return mazeConnections(p.turns).flatMap(([a,b])=>a===n?[b]:b===n?[a]:[]);
}
export function advanceMazeBall(p,desired,budget=9,tolerance=30){
 let result={...p,path:[...p.path]},remaining=budget;
 for(let step=0;step<3&&remaining>.001;step++){
  const from=result.path.at(-1);if(from===MAZE_END)break;
  const candidates=(result.next===null?mazeNeighbours(result):[result.next]).map(to=>({to,...mazeProject(from,to,desired)})).filter(x=>x.distance<=tolerance&&(result.next!==null||x.amount>.00001));
  candidates.sort((a,b)=>a.distance-b.distance);const best=candidates[0];if(!best)break;
  const amount=result.next===null?0:result.amount,max=remaining/best.length;
  const limit=best.to===MAZE_END?mazeExitLimit(result.path):1;
  const next=Math.max(0,Math.min(limit,Math.max(amount-max,Math.min(amount+max,best.amount))));
  const at=mazeEdgePoint(from,best.to,next);if(Math.hypot(at[0]-desired[0],at[1]-desired[1])>tolerance)break;
  remaining-=Math.abs(next-amount)*best.length;
  if(next>=.99999){result.path.push(best.to);result.next=null;result.amount=0;}
  else if(next<=.00001){result.next=null;result.amount=0;break;}
  else {result.next=best.to;result.amount=next;break;}
 }
 return result;
}
export function mazeKeyBall(p,direction){
 const from=p.path.at(-1),start=p.next===null?mazePoint(from):mazeEdgePoint(from,p.next,p.amount);
 const targets=p.next===null?mazeNeighbours(p):[p.next,from];
 const candidates=targets.map(to=>{
  const amount=p.next===null?.02:to===from?Math.max(0,p.amount-.02):Math.min(1,p.amount+.02);
  const sample=mazeEdgePoint(from,p.next??to,amount),d=sample.map((v,i)=>v-start[i]),length=Math.hypot(...d);
  return {to,score:length?(d[0]*direction[0]+d[1]*direction[1])/length:-1};
 }).sort((a,b)=>b.score-a.score);
 const best=candidates[0];if(!best||best.score<.45)return p;
 if(best.to===from)return {...p,next:null,amount:0};
 if(best.to===MAZE_END&&mazeExitLimit(p.path)<1)return p.next===MAZE_END&&p.amount===mazeExitLimit(p.path)?p:{...p,next:MAZE_END,amount:mazeExitLimit(p.path)};
 return {...p,path:[...p.path,best.to],next:null,amount:0};
}
export function mazeJourney(before,after,first){
 const points=[first??(before.next===null?mazePoint(before.path.at(-1)):mazeEdgePoint(before.path.at(-1),before.next,before.amount))];
 const segment=(a,b,start=0,end=1)=>{const count=Math.max(1,Math.ceil(mazeEdgeLength(a,b)*Math.abs(end-start)/8));for(let i=1;i<=count;i++)points.push(mazeEdgePoint(a,b,start+(end-start)*i/count));};
 if(before.path.join()===after.path.join()&&before.next===after.next){if(before.next!==null)segment(before.path.at(-1),before.next,before.amount,after.amount);else points.push(mazePoint(after.path.at(-1)));return points;}
 let common=0;while(common<Math.min(before.path.length,after.path.length)&&before.path[common]===after.path[common])common++;
 const advance=common===before.path.length;
 if(before.next!==null&&(!advance||after.path.length===common||after.path[common]!==before.next))segment(before.path.at(-1),before.next,before.amount,0);
 for(let i=before.path.length-1;i>=common;i--)segment(before.path[i],before.path[i-1]);
 for(let i=common;i<after.path.length;i++)segment(after.path[i-1],after.path[i],advance&&i===common&&before.next===after.path[i]?before.amount:0);
 if(after.next!==null)segment(after.path.at(-1),after.next,0,after.amount);
 return points;
}
