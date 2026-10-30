const clamp=value=>Number.isFinite(value)?Math.max(0,Math.min(1,value)):0;
const same=(a,b)=>a.length===b.length&&a.every((id,index)=>id===b[index]);

// Playback owns time only. It never reorders clips, changes paper faces, opens
// a mechanism or writes a save. Callers provide painted poses and material cues.
export function createFilmPlayer({now=()=>performance.now(),request=fn=>requestAnimationFrame(fn),cancel=id=>cancelAnimationFrame(id),duration=id=>id<0?700:1700,frame=()=>{},state=()=>{},initial}={}){
 let frames=[],index=0,phase=0,playing=false,finished=false,disposed=false,handle=0,began=0;
 if(Array.isArray(initial?.frames)&&initial.frames.length>0&&initial.frames.length<=8&&initial.frames.every(Number.isInteger)&&Number.isInteger(initial.index)&&initial.index>=0&&initial.index<initial.frames.length){frames=[...initial.frames];index=initial.index;phase=clamp(initial.phase);finished=initial.finished===true&&phase===1&&index===frames.length-1;}
 const period=()=>{const value=duration(frames[index]);return Number.isFinite(value)?Math.max(1,value):1;};
 const snapshot=()=>({frames:[...frames],index,id:frames[index]??-1,phase,playing,finished});
 const report=()=>state(snapshot());
 const paint=()=>{if(frames.length)frame(frames[index],phase);};
 function pause(){
  if(disposed)return snapshot();
  if(playing){phase=clamp((now()-began)/period());playing=false;if(handle)cancel(handle);handle=0;paint();}
  report();return snapshot();
 }
 function tick(time){
  if(disposed||!playing)return;
  phase=clamp((time-began)/period());paint();
  if(phase===1){
   if(index===frames.length-1){playing=false;finished=true;handle=0;report();return;}
   index++;phase=0;began=time;paint();
  }
  handle=request(tick);
 }
 function play(next=frames,{resume=false}={}){
  if(disposed||!Array.isArray(next)||!next.length)return false;
  pause();
  if(!resume||!same(next,frames)||finished){frames=[...next];index=0;phase=0;finished=false;}
  playing=true;began=now()-phase*period();paint();report();handle=request(tick);return true;
 }
 function select(id,position=0){
  if(disposed)return false;
  pause();frames=[id];index=0;phase=clamp(position);finished=false;paint();report();return true;
 }
 function seek(position){
  if(disposed||!frames.length)return false;
  pause();phase=clamp(position);finished=phase===1&&index===frames.length-1;paint();report();return true;
 }
 function dispose(){if(disposed)return;pause();disposed=true;if(handle)cancel(handle);handle=0;}
 return {play,pause,select,seek,dispose,snapshot};
}
