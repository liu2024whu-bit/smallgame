// A successful rule move chooses a material sound; the UI never owns progress.
export function playMoveFeedback(audio,id,move,previous,next){
 if(id==='melody'&&['note','set-note'].includes(move.type))return audio.previewNote(next.notes[move.index]);
 if(id==='cocoa')return audio.pour();
 if(id==='cloud'){audio.foley('detent');audio.material('paper');return;}
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
