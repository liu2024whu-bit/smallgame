// Original, decaying hammer/string timbre; no remote samples or recorded song.
export function playPianoVoice(context,output,note){
 if(!context||!Number.isInteger(note)||note<0||note>=25)return;
 const at=context.currentTime,frequency=261.625565*2**(note/12);
 for(const [partial,level,decay]of [[1,.16,1.45],[2,.07,.82],[3,.035,.46],[4,.014,.23]]){
  const voice=context.createOscillator(),gain=context.createGain();
  voice.type='sine';voice.frequency.value=frequency*partial*(1+(partial-1)*.00035);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(level,at+.004);gain.gain.exponentialRampToValueAtTime(.0001,at+decay);
  voice.connect(gain).connect(output);voice.start(at);voice.stop(at+decay+.025);
  voice.onended=()=>{voice.disconnect();gain.disconnect();};
 }
}
