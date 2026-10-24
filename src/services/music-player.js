import { MUSIC, isBuiltIn, preparedSource, nextTrack } from '../data/music.js';
import { createMusicLibrary, validateAudio } from './music-library.js';
import { createMediaDeck, probeAudio } from './media-deck.js';
import { deckFader } from './deck-fade.js';

// Playback and temporary birthday music are presentation state, never game progression.
export function createMusicPlayer({context,advance,library=createMusicLibrary(),media=createMediaDeck,probe=probeAudio,document:doc=globalThis.document}) {
  let settings={sound:true,music:true,musicTrack:'window',musicOrder:'cycle'},engaged=false,level=0;
  let current=null,pending=null,token=0,position=0,duration=0,status='paused',error='',disposed=false,interlude=null;
  let imported=[],available=MUSIC.filter(track=>preparedSource(track.id)).map(track=>track.id);
  const listeners=new Set(),retiring=new Map();
  const id=()=>interlude?.id??settings.musicTrack;
  const audible=()=>engaged&&settings.sound&&settings.music&&!doc?.hidden&&context()?.state==='running';
  const snapshot=()=>({id:id(),status,error,available:[...available],imported:[...imported],playing:status==='playing',time:current?.id===id()?current.deck.time:position,duration});
  const emit=()=>{if(!disposed)for(const listener of listeners)listener(snapshot());};
  const destroy=handle=>{handle.fade.dispose();handle.abort.abort();handle.deck.stop();};
  function stopRetiring(){for(const [handle,timer] of retiring){clearTimeout(timer);destroy(handle);}retiring.clear();}
  function stop(){
    token++;pending?.abort();pending=null;stopRetiring();
    if(current){
      if(current.id===id())position=current.deck.time;
      const handle=current;current=null;
      if(!disposed&&!doc?.hidden){handle.fade.to(0,180);retiring.set(handle,setTimeout(()=>{retiring.delete(handle);destroy(handle);},200));}
      else destroy(handle);
    }
    const changed=status!=='paused';status='paused';if(changed)emit();
  }
  function finish(handle){
    if(current!==handle||disposed)return;
    destroy(current);current=null;position=0;status='paused';
    if(interlude){position=interlude.time;duration=interlude.duration;interlude=null;synchronize();return;}
    const next=nextTrack(settings.musicTrack,available,settings.musicOrder);
    if(next)advance(next);else emit();
  }
  async function synchronize(){
    if(disposed)return;
    if(!audible()){if(current||pending||status==='playing')stop();return;}
    const track=id();
    if(current?.id===track){duration=current.deck.duration;pending?.abort();pending=null;token++;if(status!=='playing'){status='playing';error='';emit();}return;}
    if(pending?.id===track)return;
    pending?.abort();const abort=new AbortController(),ticket=++token;pending=abort;pending.id=track;status='loading';error='';emit();
    let deck,handle;
    try{
      const blob=isBuiltIn(track)?null:await library.get(track);
      if(ticket!==token||disposed)return;
      const source=blob??preparedSource(track);
      if(!source){stop();status='missing';error='原声留在平台里，也可以选一份本地音频。';emit();return;}
      handle={id:track,abort,deck:null,fade:null};
      const failed=message=>{if(current!==handle)return;stop();status='error';error=message;emit();};
      deck=await media(source,position,()=>finish(handle),failed,{signal:abort.signal});handle.deck=deck;handle.fade=deckFader(deck);handle.fade.level(level);
      if(ticket!==token||!audible()||disposed){destroy(handle);return;}
      const previous=current;current=handle;duration=deck.duration;pending=null;status='playing';error='';
      handle.fade.to(1,550);
      if(previous){previous.fade.to(0,450);retiring.set(previous,setTimeout(()=>{retiring.delete(previous);destroy(previous);},500));}
      emit();
    }catch(caught){
      if(handle?.fade)destroy(handle);else{deck?.stop();abort.abort();}
      if(ticket!==token||disposed)return;
      pending=null;if(current){if(current.id===track)position=current.deck.time;destroy(current);current=null;}
      stopRetiring();
      if(interlude){position=interlude.time;duration=interlude.duration;interlude=null;status='paused';synchronize();return;}
      status=caught.name==='NotAllowedError'?'blocked':'error';
      error=status==='blocked'?'点一下播放，唱片就能转起来了。':/[\u3400-\u9fff]/.test(caught.message)?caught.message:'这首暂时没接上，换首听听？';emit();
    }
  }
  const onVisibility=()=>{if(doc?.hidden)stop();else synchronize();};
  doc?.addEventListener('visibilitychange',onVisibility);
  const ready=library.list().then(ids=>{if(disposed)return;imported=ids;available=[...new Set([...available,...ids])];emit();});
  return {
    ready,snapshot,
    configure(next){
      const changed=next.musicTrack!==settings.musicTrack;
      if(changed){token++;pending?.abort();pending=null;position=0;duration=0;interlude=null;}
      settings=next;return synchronize();
    },
    level(value){level=Math.min(1,Math.max(0,value));current?.fade.level(level);for(const handle of retiring.keys())handle.fade.level(level);},
    engage(){engaged=true;return synchronize();},
    playOnce(track){
      if(!audible()||interlude||!preparedSource(track))return;
      const saved={id:track,time:current?.id===settings.musicTrack?current.deck.time:position,duration};
      stop();interlude=saved;position=0;duration=0;return synchronize();
    },
    seek(seconds){if(!Number.isFinite(seconds)||!duration)return;stop();position=Math.max(0,Math.min(seconds,duration-.05));emit();return synchronize();},
    next(){const next=nextTrack(id(),available);if(next)advance(next);},
    async add(track,file){validateAudio(file,track);await probe(file);const saved=await library.put(track,file);if(!available.includes(track))available.push(track);if(!imported.includes(track))imported.push(track);emit();return saved;},
    async remove(track){if(isBuiltIn(track))return;await library.remove(track);imported=imported.filter(key=>key!==track);if(!preparedSource(track))available=available.filter(key=>key!==track);if(settings.musicTrack===track){stop();position=0;duration=0;interlude=null;if(!preparedSource(track))advance('window');else synchronize();}emit();},
    subscribe(listener){listeners.add(listener);return ()=>listeners.delete(listener);},
    async dispose(){disposed=true;stop();listeners.clear();doc?.removeEventListener('visibilitychange',onVisibility);await library.close();},
  };
}
