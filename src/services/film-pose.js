import {FILM_START,FILM_RECORDINGS} from '../puzzles/film.js';
const ease=t=>t*t*(3-2*t);
export function filmPose(id=-1,reverse=false,phase=0){
 if(id===-1)return {angles:FILM_START.map(()=>0),time:0};
 const clip=FILM_RECORDINGS[id],t=reverse?1-phase:phase;
 const angles=clip.before.map((face,index)=>{
  const turn=clip.turns.find(([i])=>i===index);
  if(!turn)return face*180;
  const [,start,end]=turn,u=ease(Math.max(0,Math.min(1,(t-start)/(end-start))));
  return (face+(clip.after[index]-face)*u)*180;
 });
 return {angles,time:clip.time[0]+(clip.time[1]-clip.time[0])*t};
}
