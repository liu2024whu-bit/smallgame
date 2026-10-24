// Native media keeps official streams outside a CORS-sensitive Web Audio graph.
export const MEDIA_DEADLINES=Object.freeze({metadata:14000,play:12000,seek:10000,stall:9000});
function awaitMedia(element,{signal,events,accept,timeout,message,start}){
  return new Promise((resolve,reject)=>{
    let timer,settled=false;
    const cleanup=()=>{clearTimeout(timer);for(const name of events)element.removeEventListener(name,check);element.removeEventListener('error',failed);signal?.removeEventListener('abort',aborted);};
    const finish=error=>{if(settled)return;settled=true;cleanup();error?reject(error):resolve();};
    const check=()=>{if(accept())finish();};
    const failed=()=>finish(new Error('这张唱片这次没接上。'));
    const aborted=()=>finish(new DOMException('Playback cancelled','AbortError'));
    if(signal?.aborted){aborted();return;}
    for(const name of events)element.addEventListener(name,check);
    element.addEventListener('error',failed);signal?.addEventListener('abort',aborted,{once:true});
    timer=setTimeout(()=>finish(new Error(message)),timeout);
    try{start?.({fail:finish,check});check();}catch(error){finish(error);}
  });
}
function resource(input,signal,makeAudio){
  const local=typeof input!=='string',url=local?URL.createObjectURL(input):input,element=makeAudio(),abort=new AbortController();
  element.preload='auto';element.volume=0;let stopped=false;
  const cancelled=()=>abort.abort();signal?.addEventListener('abort',cancelled,{once:true});if(signal?.aborted)cancelled();
  return {element,signal:abort.signal,
    stop(){
      if(stopped)return;stopped=true;abort.abort();signal?.removeEventListener('abort',cancelled);
      element.onended=null;element.pause();element.removeAttribute('src');element.load();if(local)URL.revokeObjectURL(url);
    },
    load(deadlines,play){
      const metadata=awaitMedia(element,{signal:abort.signal,events:['loadedmetadata','durationchange'],
        accept:()=>Number.isFinite(element.duration)&&element.duration>0,timeout:deadlines.metadata,message:'唱片还没读出来，稍后再听听？',
        start:()=>{element.src=url;element.load();}});
      // Start in the gesture, while metadata is loading; volume remains zero until admission.
      const playing=play?awaitMedia(element,{signal:abort.signal,events:['playing','canplay'],
        accept:()=>!element.paused&&element.readyState>=2,timeout:deadlines.play,message:'唱针还没落下，稍后再试试。',
        start:({fail,check})=>{Promise.resolve(element.play()).then(check,fail);}}):Promise.resolve();
      return Promise.all([metadata,playing]);
    },
  };
}
function watchStall(element,onError,timeout){
  let timer,last=element.currentTime,finished=false;
  const clear=()=>{clearTimeout(timer);timer=null;};
  const wait=()=>{
    if(timer||element.paused||element.ended||finished)return;
    timer=setTimeout(()=>{timer=null;if(!element.paused&&!element.ended){finished=true;onError('唱片刚才停了一下。');}},timeout);
  };
  const progress=()=>{if(element.currentTime>last+.01){last=element.currentTime;clear();}};
  const playing=()=>{last=element.currentTime;clear();};
  for(const name of ['waiting','stalled'])element.addEventListener(name,wait);
  element.addEventListener('timeupdate',progress);element.addEventListener('playing',playing);element.addEventListener('seeked',playing);
  for(const name of ['pause','ended'])element.addEventListener(name,clear);
  return ()=>{finished=true;clear();for(const name of ['waiting','stalled'])element.removeEventListener(name,wait);element.removeEventListener('timeupdate',progress);element.removeEventListener('playing',playing);element.removeEventListener('seeked',playing);for(const name of ['pause','ended'])element.removeEventListener(name,clear);};
}
export async function probeAudio(blob,{makeAudio=()=>new Audio(),deadlines=MEDIA_DEADLINES}={}){
  const native=resource(blob,null,makeAudio);
  try{await native.load(deadlines,false);return native.element.duration;}finally{native.stop();}
}
export async function createMediaDeck(source,offset,onEnded,onError,{signal,makeAudio=()=>new Audio(),deadlines=MEDIA_DEADLINES}={}){
  const native=resource(source,signal,makeAudio),element=native.element;let unwatch=()=>{},seeking;
  async function seek(seconds){
    seeking?.abort();const operation=new AbortController();seeking=operation;const cancel=()=>operation.abort();
    native.signal.addEventListener('abort',cancel,{once:true});if(native.signal.aborted)cancel();
    const position=Math.max(0,Math.min(seconds,element.duration-.05));
    try{await awaitMedia(element,{signal:operation.signal,events:['seeked','canplay','timeupdate'],
      accept:()=>!element.seeking&&element.readyState>=2&&Math.abs(element.currentTime-position)<.3,
      timeout:deadlines.seek,message:'这一小段还没接上，稍后再试试。',start:()=>{element.currentTime=position;}});}
    finally{native.signal.removeEventListener('abort',cancel);if(seeking===operation)seeking=null;}
  }
  const failed=()=>onError('这首歌刚才停了一下。');
  try{
    await native.load(deadlines,true);
    const position=Math.max(0,Math.min(offset,element.duration-.05));
    if(position>.01)await seek(position);
    if(native.signal.aborted)throw new DOMException('Playback cancelled','AbortError');
    if(element.error)throw new Error('这张唱片这次没接上。');
    element.onended=onEnded;element.addEventListener('error',failed);unwatch=watchStall(element,onError,deadlines.stall);
    return {seek,get duration(){return element.duration;},get time(){return element.currentTime;},
      set volume(value){element.volume=Math.max(0,Math.min(1,value));},
      stop(){seeking?.abort();unwatch();element.removeEventListener('error',failed);native.stop();}};
  }catch(error){unwatch();element.removeEventListener('error',failed);native.stop();throw error;}
}
