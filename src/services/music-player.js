import {MUSIC,MUSIC_BY_ID,isBuiltIn,preparedSource,nextTrack} from '../data/music.js';
import {createMusicLibrary,validateAudio} from './music-library.js';
import {createMediaDeck,probeAudio} from './media-deck.js';
import {musicDecks} from './music-decks.js';

// Intent, media lifetime and game progress are separate. Only advance changes a preference.
export function createMusicPlayer({context,advance,library=createMusicLibrary(),media=createMediaDeck,probe=probeAudio,document:doc=globalThis.document,connectivity=globalThis}){
  let settings={sound:true,music:true,musicTrack:'window',musicOrder:'cycle'},engaged=false,disposed=false;
  let pending=null,ticket=0,seekRequest=0,position=0,duration=0,status='paused',error='',notice='',hold=false,interlude=null,importing=null;
  let imported=[],available=MUSIC.filter(t=>preparedSource(t.id)).map(t=>t.id);
  const decks=musicDecks(),listeners=new Set(),failed=new Set(),sourceVersions=new Map();
  const version=id=>sourceVersions.get(id)??0;
  const target=()=>interlude?.id??settings.musicTrack;
  const audible=()=>engaged&&settings.sound&&settings.music&&!doc?.hidden&&context()?.state==='running';
  const snapshot=()=>({
    id:target(),status,error,notice,importing,audible:Boolean(decks.current)&&audible(),heardTime:decks.current?.deck.time??0,heardDuration:decks.current?.deck.duration??0,available:[...available],imported:[...imported],unavailable:[...failed],
    playing:status==='playing',time:decks.current?.id===target()?decks.current.deck.time:position,duration,
    source:decks.current?.id===target()?decks.current.source:null,
  });
  const emit=()=>{if(!disposed)for(const listener of listeners)listener(snapshot());};
  function cancelPending(){ticket++;pending?.abort();pending=null;}
  function pause(){
    cancelPending();
    if(decks.current?.id===target())position=decks.current.deck.time;
    decks.pause(disposed||doc?.hidden);
    const changed=status!=='paused';status='paused';if(changed)emit();
  }
  function changeTo(id){
    if(id===settings.musicTrack)return synchronize();
    advance(id);
  }
  function restoreInterlude(){
    const saved=interlude;interlude=null;position=saved.time;duration=saved.duration;status='paused';
    return synchronize();
  }
  function finish(handle){
    if(decks.current!==handle||disposed)return;
    decks.release(handle);position=0;
    if(pending){status='loading';emit();return;}
    status='paused';
    if(interlude){restoreInterlude();return;}
    const eligible=available.filter(id=>!failed.has(id));
    const next=nextTrack(settings.musicTrack,eligible,settings.musicOrder);
    if(next)changeTo(next);else emit();
  }
  function failure(id,caught){
    if(disposed)return;
    failed.add(id);
    if(interlude){notice='生日歌这次没接上，原来的唱片还在。';restoreInterlude();return;}
    const previous=decks.recover();
    if(previous){
      notice=id===previous.id?'新选的录音这次没接上，先听原来这一版。':`《${MUSIC_BY_ID[id]?.title??'这一首'}》这次没接上，先听《${MUSIC_BY_ID[previous.id].title}》。`;
      position=previous.deck.time;duration=previous.deck.duration;status='playing';error='';
      if(previous.id!==settings.musicTrack)changeTo(previous.id);else emit();
      return;
    }
    if(caught.name==='NotAllowedError'){
      hold=true;status='blocked';error='唱针还没落下，再碰一下播放就好。';emit();return;
    }
    if(id!=='window'&&available.includes('window')&&!failed.has('window')){
      notice='这张唱片这次没接上，窗边的琴声还留着。';status='loading';position=0;duration=0;changeTo('window');return;
    }
    hold=true;status='error';error='唱片这次没接上。等一等，再听听。';emit();
  }
  function activeError(handle,message){
    if(disposed||decks.current!==handle)return;
    decks.release(handle);failed.add(handle.id);
    if(pending){decks.recover();notice='刚才的唱片停了一下，新的一首还在路上。';emit();return;}
    failure(handle.id,new Error(message));
  }
  async function synchronize(){
    if(disposed)return;
    if(!audible()){if(decks.current||pending||status==='playing')pause();return;}
    if(hold)return;
    const id=target();
    if(decks.current?.id===id&&(decks.current.version===version(id)||failed.has(id))){
      const changed=status!=='playing'||duration!==decks.current.deck.duration||error;
      duration=decks.current.deck.duration;cancelPending();status='playing';error='';if(changed)emit();return;
    }
    if(pending?.id===id&&pending.version===version(id))return;
    cancelPending();const abort=new AbortController(),generation=ticket,revision=version(id);pending=abort;pending.id=id;pending.version=revision;status='loading';error='';emit();
    let deck,handle,ended=false;
    try{
      const blob=isBuiltIn(id)?null:await library.get(id);
      if(generation!==ticket||disposed)return;
      const source=blob??preparedSource(id);
      if(!source)throw new Error('Missing recording');
      deck=await media(source,position,()=>{if(handle)finish(handle);else ended=true;},message=>activeError(handle,message),{signal:abort.signal});
      if(generation!==ticket||!audible()||disposed){abort.abort();deck.stop();return;}
      if(revision!==version(id)){abort.abort();deck.stop();pending=null;return synchronize();}
      handle=decks.create(id,deck,abort,blob?{kind:'local',name:blob.name??'本地音源'}:{kind:isBuiltIn(id)?'included':'online',name:MUSIC_BY_ID[id].by});
      handle.version=revision;decks.admit(handle);duration=deck.duration;pending=null;status='playing';error='';hold=false;failed.delete(id);emit();
      if(ended)finish(handle);
    }catch(caught){
      if(handle)decks.release(handle);else{deck?.stop();abort.abort();}
      if(generation!==ticket||disposed)return;
      pending=null;failure(id,caught);
    }
  }
  const onVisibility=()=>{if(doc?.hidden)pause();else synchronize();};
  const onOnline=()=>{if(status==='error'&&hold){hold=false;failed.delete(target());synchronize();}};
  doc?.addEventListener('visibilitychange',onVisibility);connectivity?.addEventListener?.('online',onOnline);
  const ready=library.list().then(ids=>{
    if(disposed)return;imported=ids;available=[...new Set([...available,...ids])];emit();
  });
  return {
    ready,snapshot,
    configure(next){
      const changed=next.musicTrack!==settings.musicTrack,waking=(!settings.sound||!settings.music)&&next.sound&&next.music;
      if(changed){cancelPending();position=0;duration=0;interlude=null;hold=false;error='';}
      settings=next;if(waking)hold=false;return synchronize();
    },
    refresh:synchronize,
    level(value){decks.level(Math.min(1,Math.max(0,value)));},
    engage(){engaged=true;return synchronize();},
    retry(){engaged=true;hold=false;error='';notice='';failed.delete(target());return synchronize();},
    playOnce(id){
      if(!audible()||interlude||!preparedSource(id))return;
      const saved={id,time:decks.current?.id===settings.musicTrack?decks.current.deck.time:position,duration};
      pause();interlude=saved;position=0;duration=0;hold=false;return synchronize();
    },
    seek(seconds){
      if(!Number.isFinite(seconds)||!duration)return;
      const value=Math.max(0,Math.min(seconds,duration-.05)),handle=decks.current;
      if(handle?.id===target()&&handle.deck.seek&&audible()&&!pending){
        const request=++seekRequest;notice='';const moving=handle.deck.seek(value);emit();
        return moving.then(()=>{if(decks.current===handle&&target()===handle.id&&!pending&&request===seekRequest){position=handle.deck.time;emit();}})
          .catch(caught=>{if(caught.name!=='AbortError'&&decks.current===handle)activeError(handle,caught.message);});
      }
      pause();position=value;emit();return synchronize();
    },
    next(){const next=nextTrack(target(),available.filter(id=>!failed.has(id)));if(next){notice='';changeTo(next);}},
    async add(id,file){
      validateAudio(file,id);if(importing)throw new Error('上一份还在收着呢。');importing=id;emit();
      try{await probe(file);const saved=await library.put(id,file);if(!available.includes(id))available.push(id);if(!imported.includes(id))imported.push(id);sourceVersions.set(id,version(id)+1);failed.delete(id);return saved;}
      finally{importing=null;emit();}
    },
    async remove(id){
      if(isBuiltIn(id))return;
      await library.remove(id);sourceVersions.set(id,version(id)+1);imported=imported.filter(key=>key!==id);if(!preparedSource(id))available=available.filter(key=>key!==id);
      if(settings.musicTrack===id){pause();position=0;duration=0;interlude=null;hold=false;if(!preparedSource(id))changeTo('window');else synchronize();}emit();
    },
    subscribe(listener){listeners.add(listener);return ()=>listeners.delete(listener);},
    async dispose(){
      disposed=true;cancelPending();decks.dispose();listeners.clear();doc?.removeEventListener('visibilitychange',onVisibility);
      connectivity?.removeEventListener?.('online',onOnline);await library.close();
    },
  };
}
