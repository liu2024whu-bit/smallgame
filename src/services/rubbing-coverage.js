import {RUBBING_INK} from '../data/campus-rubbing.js';

const inkTotal=RUBBING_INK.reduce((sum,cell)=>sum+cell.weight,0);
export function coverRubbing(covered,from,to){
 const [ax,ay]=from??to,[bx,by]=to,dx=bx-ax,dy=by-ay,length=dx*dx+dy*dy;
 RUBBING_INK.forEach((cell,index)=>{
  const t=length?Math.max(0,Math.min(1,((cell.x-ax)*dx+(cell.y-ay)*dy)/length)):0;
  if((cell.x-ax-dx*t)**2+(cell.y-ay-dy*t)**2<=3.5**2)covered.add(index);
 });
 return covered;
}
export const rubbingCoverage=covered=>[...covered].reduce((sum,index)=>sum+(RUBBING_INK[index]?.weight??0),0)/inkTotal;
export const rubbingFinished=covered=>rubbingCoverage(covered)>=.93;
