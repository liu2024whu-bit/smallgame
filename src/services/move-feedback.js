// A successful rule move chooses a material sound; the UI never owns progress.
export function playMoveFeedback(audio,id,move,previous,next){
 if(id==='piano'){if(move.type==='play')audio.pianoNote(move.note);else audio.foley(move.type==='submit'?(next.opened?'return':'stop'):'turn');return;}
 // The maze sounds follow live detents and actual ball travel, before commit.
 if(id==='maze')return;
 if(id==='balance'){audio.material('metal',.38);return;}
 if(id==='birthdayLock'){if(move.type==='submit'){audio.foley(next.opened?'return':'stop');audio.material('metal');}else if(move.type==='lid'){audio.material('paper');audio.foley('turn',.4);}else if(['set','turn'].includes(move.type))audio.foley('detent');else audio.material(move.type==='mirror-slide'||move.type==='fit'&&move.index===2?'glass':'paper');return;}
 if(id==='ribbons'){audio.material('paper');audio.foley(move.type==='flip'?'turn':'wedge-out',.3);return;}
 if(id==='sweets'){audio.material(move.type==='serve'?'glass':'wood');audio.foley(move.type==='serve'?'return':'detent',.3);return;}
 if(id==='chocolate'){audio.material('paper');if(move.type!=='place')audio.foley('turn',.3);return;}
 if(id==='stitch'){audio.material(move.type==='trim'?'metal':'paper');audio.foley(move.type==='hole'?'wedge-in':move.type==='tie'?(next.tied?'return':'stop'):'turn',.45);return;}
 if(id==='wordlock'){if(move.type==='submit'){audio.foley(next.opened?'return':'stop');if(next.opened)audio.material('wood');}else if(['key','erase'].includes(move.type))audio.material('key');else audio.foley('detent');return;}
 if(id==='cloudGap'){audio.material('paper');audio.foley('detent',.5);return;}
 if(id==='paperBack'){audio.foley(move.type==='fit'?'wedge-in':move.type==='unfit'?'wedge-out':move.type==='submit'?(next.opened?'return':'stop'):'detent');audio.material(move.type==='fit'||move.type==='unfit'?'glass':'wood');return;}
 if(id==='film'){audio.foley(move.type==='fit'?'wedge-in':move.type==='unfit'?'wedge-out':move.type==='reverse'?'detent':move.type==='submit'?(next.opened?'return':'stop'):'turn');if(['flip','reorder','shift'].includes(move.type))audio.material('paper');return;}
 if(id==='belt'){audio.foley(move.type==='fit'?'wedge-in':['unfit','unfit-all'].includes(move.type)?'wedge-out':move.type==='crank'?'turn':move.type==='trace'||move.type==='node'?'return':'detent');if(move.type==='crank'&&!next.opened)audio.foley('stop',.55);return;}
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
  audio.foley(move.type==='crank'?'turn':move.type==='fit'?'wedge-in':move.type==='unfit'?'wedge-out':next.opened?'return':'stop');
  if(move.type==='submit')audio.material('wood');
  return;
 }
 if(id==='paper'){
  if(move.type==='open'){audio.foley('wedge-in');audio.foley('turn',.12);return;}
  if(move.type==='print')return audio.foley('press');
  return audio.foley('turn');
 }
 return audio.material(id==='wordlock'?'key':id==='postbox'||move.type==='set-turn'?'metal':['paperBack','album','screen','film'].includes(id)?'paper':'wood');
}
