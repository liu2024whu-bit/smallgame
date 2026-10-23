import { MUSIC_BY_ID } from '../data/music.js';

export function bindMusicControls(input,{player,store,setting,openPanel,closePanel,toast}){
  let importing=false;
  function chooseFile(id){if(!MUSIC_BY_ID[id]||importing)return;input.dataset.track=id;input.click();}
  function play(id){setting('musicTrack',id);setting('sound',true);setting('music',true);player.engage();}
  input.addEventListener('change',async()=>{
    const file=input.files[0],id=input.dataset.track;input.value='';if(!file||importing)return;
    importing=true;
    try{const saved=await player.add(id,file);play(id);if(!saved)toast('这次先听着，关掉网页后还要再选一次。');}
    catch(error){toast(/[\u3400-\u9fff]/.test(error.message)?error.message:'这份音频没放进来，再选一次？');}
    finally{importing=false;}
  });
  return {
    music:()=>openPanel({type:'music'}),
    'music-choose':button=>{const id=button.dataset.id,s=player.snapshot();if(!s.available.includes(id))chooseFile(id);else if(id===s.id&&s.playing)setting('music',false);else play(id);},
    'music-toggle':()=>{
      const snapshot=player.snapshot();
      if(!snapshot.available.includes(snapshot.id)){chooseFile(snapshot.id);return;}
      if(snapshot.playing||snapshot.status==='loading')setting('music',false);else play(snapshot.id);
    },
    'music-next':()=>player.next(),
    'music-order':()=>setting('musicOrder',store.get().settings.musicOrder==='cycle'?'repeat':'cycle'),
    'music-remove':button=>openPanel({type:'music-remove',id:button.dataset.id}),
    'music-remove-confirm':async button=>{
      try{await player.remove(button.dataset.id);closePanel();toast('本地音源已移除。');}
      catch{toast('这次没移除成功，音源还在。');}
    },
  };
}
