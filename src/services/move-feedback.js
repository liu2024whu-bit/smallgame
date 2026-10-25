// A successful rule move chooses a material sound; the UI never owns progress.
export function playMoveFeedback(audio,id,move,previous,next){
 if(id==='screen'){const paper=['flip','turn-backing','slide'].includes(move.type);audio.foley(paper?'turn':move.type==='submit'?(next.opened?'return':'stop'):'detent');audio.material(paper?'paper':'wood');return;}
 if(id==='melody'&&['note','set-note'].includes(move.type))return audio.previewNote(next.notes[move.index]);
 if(id==='cocoa')return audio.pour();
 if(id==='cloud'){audio.foley('detent');audio.material('paper');return;}
 if(id==='calibration'){audio.foley(move.type==='trace'?'stamp':move.type==='power'?'detent':move.type==='flip'?'turn':move.type==='fit'?'wedge-in':move.type==='unfit'?'wedge-out':'detent');return;}
 if(id==='books'){
  if(move.type==='fit'||move.type==='unfit'){audio.foley(move.type==='fit'?'wedge-in':'wedge-out');audio.material('paper');return;}
  audio.material('wood');if(move.type!=='submit')audio.material('paper');else if(!next.opened)audio.foley('stop');return;
 }
 if(id==='flowers'){
  audio.foley(move.type==='crank'?'turn':next.pin>=0?'wedge-in':'wedge-out');
  if(move.type==='crank'&&previous.pin>=0&&next.pin<0)audio.foley('wedge-out',.16);
  return;
 }
 if(id==='paper'){
  if(move.type==='open'){audio.foley('wedge-in');audio.foley('turn',.12);return;}
  if(move.type==='print')return audio.foley('press');
  return audio.foley('turn');
 }
 return audio.material(id==='wordlock'?'key':id==='postbox'||move.type==='set-turn'?'metal':['paperBack','album','screen','film'].includes(id)?'paper':'wood');
}
