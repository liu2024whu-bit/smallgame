// Native media also plays official streams without a CORS-sensitive Web Audio graph.
async function loadAudio(input,signal) {
  const local=typeof input!=='string',url=local?URL.createObjectURL(input):input;
  const element=new Audio();element.preload='metadata';element.volume=0;
  let stopped=false;
  const stop=()=>{if(stopped)return;stopped=true;element.onended=null;element.onerror=null;element.pause();element.removeAttribute('src');element.load();if(local)URL.revokeObjectURL(url);};
  try{
    await new Promise((resolve,reject)=>{
      let timer;
      const done=error=>{clearTimeout(timer);element.onloadedmetadata=null;element.onerror=null;signal?.removeEventListener('abort',aborted);error?reject(error):resolve();};
      const aborted=()=>done(new DOMException('Playback cancelled','AbortError'));
      if(signal?.aborted){aborted();return;}
      signal?.addEventListener('abort',aborted,{once:true});
      timer=setTimeout(()=>done(new Error('唱片还没读出来，稍后再听听？')),14000);
      element.onloadedmetadata=()=>done(Number.isFinite(element.duration)&&element.duration>0?null:new Error('这份音频还没有读出长度。'));
      element.onerror=()=>done(new Error('这首暂时没接上。旁边还备着小屋的琴声。'));
      element.src=url;element.load();
    });
    return {element,stop};
  }catch(error){stop();throw error;}
}
export async function probeAudio(blob) {
  const {element,stop}=await loadAudio(blob),duration=element.duration;stop();return duration;
}
export async function createMediaDeck(source,offset,onEnded,onError,{signal}={}) {
  const {element,stop}=await loadAudio(source,signal);
  const aborted=()=>stop();signal?.addEventListener('abort',aborted,{once:true});
  try{
    if(signal?.aborted)throw new DOMException('Playback cancelled','AbortError');
    element.currentTime=Math.max(0,Math.min(offset,element.duration-.05));
    element.onended=onEnded;element.onerror=()=>onError('这首歌刚才停了一下，可以再试一次。');
    await element.play();
    if(signal?.aborted)throw new DOMException('Playback cancelled','AbortError');
    return {get duration(){return element.duration;},get time(){return element.currentTime;},set volume(value){element.volume=Math.max(0,Math.min(1,value));},stop(){signal?.removeEventListener('abort',aborted);stop();}};
  }catch(error){signal?.removeEventListener('abort',aborted);stop();throw error;}
}
