// Three original miniatures. These are not arrangements of the named playlist songs.
const SCORES=[
  {beat:.82,root:0,chords:[[48,55,59,64],[45,52,57,60],[41,48,55,60],[43,50,57,62]],line:[0,2,4,2,1,3,4,6,4,2,1,0,2,4,3,1]},
  {beat:.9,root:2,chords:[[46,53,58,62],[43,50,57,62],[39,46,53,58],[41,48,55,60]],line:[0,3,2,1,4,3,1,2,0,1,3,5,4,2,1,0]},
  {beat:1.02,root:5,chords:[[48,55,60,64],[45,52,59,64],[41,48,55,60],[43,50,57,62]],line:[4,2,1,3,2,0,1,4,3,2,4,5,3,1,2,0]},
];
const SCALE=[0,2,4,7,9,12,14];
const frequency=midi=>440*2**((midi-69)/12);

export function createScore(context,destination,index,offset,onEnded) {
  const score=SCORES[index]??SCORES[0],duration=score.beat*64;
  const start=context.currentTime-(offset%duration),voices=new Set();
  let step=Math.ceil((offset%duration)/score.beat),stopped=false;
  const bus=context.createGain(),filter=context.createBiquadFilter();
  filter.type='lowpass';filter.frequency.value=2300;bus.gain.value=.3;
  bus.connect(filter).connect(destination);
  function note(midi,at,length,volume) {
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type='triangle';oscillator.frequency.value=frequency(midi);
    gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.025);
    gain.gain.exponentialRampToValueAtTime(.0001,at+length);
    oscillator.connect(gain).connect(bus);voices.add(oscillator);
    oscillator.onended=()=>{voices.delete(oscillator);oscillator.disconnect();gain.disconnect();};
    oscillator.start(at);oscillator.stop(at+length+.02);
  }
  function schedule() {
    if(stopped)return;
    while(step<64&&start+step*score.beat<context.currentTime+.45){
      const beat=step++,at=Math.max(context.currentTime+.005,start+beat*score.beat);
      const chord=score.chords[Math.floor(beat/8)%4];
      if(beat%2===0)note(chord[(beat/2)%4],at,2.5,.075);
      if(beat%4===0)note(chord[0]-12,at,3.2,.065);
      if(beat%4!==3)note(60+score.root+SCALE[score.line[Math.floor(beat/2)%16]],at+.045,1.9,beat%2===0?.055:.035);
    }
    if(context.currentTime-start>=duration){stop();onEnded();}
  }
  const timer=globalThis.setInterval(schedule,120);schedule();
  function stop(){if(stopped)return;stopped=true;globalThis.clearInterval(timer);for(const voice of voices){try{voice.stop();}catch{/* Already ended. */}}voices.clear();bus.disconnect();filter.disconnect();}
  return {duration,get time(){return Math.min(duration,Math.max(0,context.currentTime-start));},stop};
}
