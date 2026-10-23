import { MUSIC, MUSIC_BY_ID, isBuiltIn, nextTrack } from '../data/music.js';
import { createMusicLibrary, validateAudio } from './music-library.js';
import { createScore } from './music-score.js';
import { createMediaDeck, probeAudio } from './media-deck.js';

// The player owns ephemeral playback only; the core owns the selected song and switches.
export function createMusicPlayer({context,destination,advance,library=createMusicLibrary(),score=createScore,media=createMediaDeck,probe=probeAudio,document:doc=globalThis.document}) {
  let settings={sound:true,music:true,musicTrack:'window',musicOrder:'cycle'},engaged=false;
  let current=null,pending=null,token=0,position=0,duration=0,status='paused',error='',disposed=false;
  let available=MUSIC.filter(track=>isBuiltIn(track.id)).map(track=>track.id);
  const listeners=new Set(),retiring=new Map();
  const audible=()=>engaged&&settings.sound&&settings.music&&!doc?.hidden&&context()?.state==='running';
  const snapshot=()=>({id:settings.musicTrack,status,error,available:[...available],playing:status==='playing',time:current?.id===settings.musicTrack?current.deck.time:position,duration});
  const emit=()=>{if(!disposed)for(const listener of listeners)listener(snapshot());};
  const destroy=handle=>{handle.deck.stop();handle.gain.disconnect();};
  function stopRetiring(){for(const [handle,timer] of retiring){clearTimeout(timer);destroy(handle);}retiring.clear();}
  function stop(){
    token++;pending=null;stopRetiring();
    if(current){
      if(current.id===settings.musicTrack)position=current.deck.time;
      const handle=current;current=null;
      if(!disposed&&!doc?.hidden){handle.gain.gain.cancelScheduledValues(context().currentTime);handle.gain.gain.setTargetAtTime(0,context().currentTime,.045);retiring.set(handle,setTimeout(()=>{retiring.delete(handle);destroy(handle);},300));}
      else destroy(handle);
    }
    const changed=status!=='paused';status='paused';if(changed)emit();
  }
  function finish(handle){
    if(current!==handle||disposed)return;
    destroy(current);current=null;position=0;status='paused';
    const next=nextTrack(settings.musicTrack,available,settings.musicOrder);
    if(next)advance(next);else emit();
  }
  async function synchronize(){
    if(disposed)return;
    if(!audible()){if(current||pending||status==='playing')stop();return;}
    const id=settings.musicTrack;
    if(current?.id===id){if(status!=='playing'){status='playing';error='';emit();}return;}
    if(pending===id)return;
    const ticket=++token;pending=id;status='loading';error='';emit();
    let gain,deck;
    try{
      const blob=isBuiltIn(id)?null:await library.get(id);
      if(ticket!==token||disposed)return;
      if(!isBuiltIn(id)&&!blob){stop();status='missing';error='这张唱片还等一份音源。';emit();return;}
      gain=context().createGain();gain.gain.value=0;gain.connect(destination());
      const handle={id,gain,deck:null};
      const failed=message=>{if(current!==handle)return;stop();status='error';error=message;emit();};
      deck=isBuiltIn(id)?score(context(),gain,MUSIC_BY_ID[id].score,position,()=>finish(handle)):await media(context(),gain,blob,position,()=>finish(handle),failed);
      handle.deck=deck;
      if(ticket!==token||!audible()||disposed){destroy(handle);return;}
      const previous=current;current=handle;duration=deck.duration;pending=null;status='playing';error='';
      gain.gain.setTargetAtTime(1,context().currentTime,.16);
      if(previous){
        previous.gain.gain.cancelScheduledValues(context().currentTime);
        previous.gain.gain.setTargetAtTime(0,context().currentTime,.13);
        retiring.set(previous,setTimeout(()=>{retiring.delete(previous);destroy(previous);},800));
      }
      emit();
    }catch(caught){
      deck?.stop();gain?.disconnect();
      if(ticket!==token||disposed)return;
      pending=null;
      if(current){if(current.id===settings.musicTrack)position=current.deck.time;destroy(current);current=null;}
      stopRetiring();status=caught.name==='NotAllowedError'?'blocked':'error';
      error=status==='blocked'?'点一下播放，唱片就能转起来了。':/[\u3400-\u9fff]/.test(caught.message)?caught.message:'这首暂时放不出来，再选一份音源试试？';emit();
    }
  }
  const onVisibility=()=>{if(doc?.hidden)stop();else synchronize();};
  doc?.addEventListener('visibilitychange',onVisibility);
  const ready=library.list().then(ids=>{if(disposed)return;available=[...new Set([...available,...ids])];emit();});
  return {
    ready,snapshot,
    configure(next){const changed=next.musicTrack!==settings.musicTrack;if(changed){token++;pending=null;position=0;duration=0;}settings=next;synchronize();},
    engage(){engaged=true;return synchronize();},
    seek(seconds){if(!Number.isFinite(seconds)||!duration)return;stop();position=Math.max(0,Math.min(seconds,duration-.05));emit();return synchronize();},
    next(){const next=nextTrack(settings.musicTrack,available);if(next)advance(next);},
    async add(id,file){validateAudio(file,id);await probe(file);const saved=await library.put(id,file);if(!available.includes(id))available.push(id);emit();return saved;},
    async remove(id){if(isBuiltIn(id))return;await library.remove(id);available=available.filter(key=>key!==id);if(settings.musicTrack===id){stop();position=0;advance('window');}emit();},
    subscribe(listener){listeners.add(listener);return ()=>listeners.delete(listener);},
    async dispose(){disposed=true;stop();listeners.clear();doc?.removeEventListener('visibilitychange',onVisibility);await library.close();},
  };
}
