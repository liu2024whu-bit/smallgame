// Original, short material sounds. No recorded music or external audio dependency.
export const FOLEY_KINDS=Object.freeze(['detent','turn','wedge-in','wedge-out','stop','return','stamp']);
function noise(ctx,bus,frequency,duration,volume,at){
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
  let smooth=0;
  for(let i=0;i<data.length;i++){smooth=(smooth+(Math.random()*2-1))*.48;data[i]=smooth*Math.min(1,i/(ctx.sampleRate*.003))*(1-i/data.length)**1.6;}
  const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
  source.buffer=buffer;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.7;gain.gain.value=volume;
  source.connect(filter).connect(gain).connect(bus);source.start(at);
  source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
}
function knock(ctx,bus,frequency,duration,volume,at){
  const voice=ctx.createOscillator(),gain=ctx.createGain();voice.type='triangle';voice.frequency.value=frequency;
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.002);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  voice.connect(gain).connect(bus);voice.start(at);voice.stop(at+duration+.01);voice.onended=()=>{voice.disconnect();gain.disconnect();};
}
export function playFoley(ctx,bus,kind,at=ctx.currentTime){
  if(!FOLEY_KINDS.includes(kind))return;
  const rub=(hz,seconds,level,delay=0)=>noise(ctx,bus,hz,seconds,level,at+delay);
  const tap=(hz,seconds,level,delay=0)=>knock(ctx,bus,hz,seconds,level,at+delay);
  if(kind==='detent'){rub(2600,.024,.08);tap(830,.038,.045);}
  if(kind==='turn'){rub(630,.13,.09);tap(240,.065,.075,.025);}
  if(kind==='wedge-in'){rub(920,.15,.075);tap(185,.085,.13,.105);tap(420,.04,.045,.13);}
  if(kind==='wedge-out'){tap(320,.05,.05);rub(1200,.13,.075,.025);}
  if(kind==='stop'){tap(98,.095,.16);rub(240,.04,.12);}
  if(kind==='return')rub(510,.15,.065);
  if(kind==='stamp'){rub(880,.05,.17);tap(125,.065,.11,.008);}
}
export function createFoley({context,output,enabled}){
  const last=new Map();
  return (kind,delay=0)=>{
    const ctx=context();if(!ctx||!enabled()||!FOLEY_KINDS.includes(kind))return;
    if(ctx.currentTime-(last.get(kind)??-Infinity)<.055)return;
    last.set(kind,ctx.currentTime);playFoley(ctx,output(),kind,ctx.currentTime+Math.max(0,delay));
  };
}
