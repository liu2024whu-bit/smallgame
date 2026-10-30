import {indexIn} from './common.js';

export function validStitch(path){
 if(!Array.isArray(path)||path.length!==8||path[0]!==0||path.at(-1)!==7)return false;
 return path.slice(1).every((node,i)=>i%2===0?path[i]<4&&node===path[i]+4:path[i]>=4&&node===path[i]-3);
}
export const stitch={
 create:()=>({path:[],fitted:[false,false],tied:false,finished:false,pulls:0}),
 valid(p){
  if(!Array.isArray(p?.path)||p.path.length>8||!p.path.every(v=>indexIn(v,8))||p.path.length&&p.path[0]!==0||new Set(p.path).size!==p.path.length)return false;
  if(!Array.isArray(p.fitted)||p.fitted.length!==2||!p.fitted.every(v=>typeof v==='boolean'))return false;
  if(typeof p.tied!=='boolean'||typeof p.finished!=='boolean'||!Number.isInteger(p.pulls)||p.pulls<0||p.pulls>999)return false;
  if(p.tied&&(!validStitch(p.path)||!p.pulls||!p.finished&&!p.fitted.every(Boolean)))return false;
  return !p.finished||p.tied&&!p.fitted.some(Boolean);
 },
 move(p,a){
  if(p.finished)return p;
  if(a.type==='fit'&&indexIn(a.index,2)&&!p.fitted[a.index])return {...p,fitted:p.fitted.map((v,i)=>i===a.index||v)};
  if(a.type==='unfit'&&indexIn(a.index,2)&&p.fitted[a.index]&&!p.path.length)return {...p,fitted:p.fitted.map((v,i)=>i===a.index?false:v)};
  if(a.type==='undo'&&p.path.length)return {...p,path:p.path.slice(0,-1),tied:false};
  if(!p.fitted.every(Boolean))return p;
  if(a.type==='hole'&&!p.tied&&indexIn(a.index,8)&&!p.path.includes(a.index)&&(!p.path.length?a.index===0:true))return {...p,path:[...p.path,a.index]};
  if(a.type==='tie'&&!p.tied&&p.path.length===8)return {...p,tied:validStitch(p.path),pulls:Math.min(999,p.pulls+1)};
  if(a.type==='trim'&&p.tied)return {...p,finished:true,fitted:[false,false]};
  return p;
 },
 solved:p=>p.finished&&p.tied&&validStitch(p.path),
};
