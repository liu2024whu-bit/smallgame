import {MUSIC_BY_ID} from '../data/music.js';

export function bindMusicControls(input,{player,store,setting,openPanel,closePanel,toast}){
  let intent=0;
  function chooseFile(id){
    if(!MUSIC_BY_ID[id]||player.snapshot().importing)return;
    input.dataset.track=id;input.dataset.intent=++intent;input.click();
  }
  function play(id){intent++;setting('musicTrack',id);setting('sound',true);setting('music',true);player.retry();}
  input.closest('#app').addEventListener('click',event=>{if(event.target.closest('.track-source')){intent++;setting('music',false);}});
  input.addEventListener('change',async()=>{
    const file=input.files[0],id=input.dataset.track,request=Number(input.dataset.intent),before=store.get().settings;
    input.value='';if(!file||player.snapshot().importing)return;
    try{
      const saved=await player.add(id,file),now=store.get().settings;
      if(request===intent&&now.sound===before.sound&&now.music===before.music)play(id);
      else toast('这份录音，收好了。');
      if(!saved)toast('这次先听着，关掉网页后还要再选一次。');
    }catch(error){toast(/[\u3400-\u9fff]/.test(error.message)?error.message:'这份音频没放进来，再选一次？');}
  });
  return {
    music:()=>openPanel({type:'music'}),
    'music-import':button=>chooseFile(button.dataset.id),
    'music-choose':button=>{
      const id=button.dataset.id,s=player.snapshot();if(!MUSIC_BY_ID[id])return;
      if(!s.available.includes(id))chooseFile(id);else if(id===s.id&&s.playing){intent++;setting('music',false);}else play(id);
    },
    'music-toggle':()=>{
      const s=player.snapshot();if(!s.available.includes(s.id)){chooseFile(s.id);return;}
      if(s.playing||s.status==='loading'){intent++;setting('music',false);}else play(s.id);
    },
    'music-next':()=>{intent++;player.next();},
    'music-order':()=>setting('musicOrder',store.get().settings.musicOrder==='cycle'?'repeat':'cycle'),
    'music-remove':button=>openPanel({type:'music-remove',id:button.dataset.id}),
    'music-remove-confirm':async button=>{
      try{await player.remove(button.dataset.id);closePanel();toast('这份音频已移除。');}
      catch{toast('这次没移除成功，音频还在。');}
    },
  };
}
