import {pianoScaleNumber} from '../data/piano.js';
// Public-domain melody, performed by the same local piano voice as the keys.
export const BIRTHDAY_TUNE=Object.freeze([
 [7,.5],[7,.5],[9,1],[7,1],[12,1],[11,2],
 [7,.5],[7,.5],[9,1],[7,1],[14,1],[12,2],
 [7,.5],[7,.5],[19,1],[16,1],[12,1],[11,1],[9,1],
 [17,.5],[17,.5],[16,1],[12,1],[14,1],[12,2],
]);
export function bindPianoSong(root,play,illuminate){
 const button=root.querySelector('[data-piano-song]');if(!button)return {stop(){},dispose(){}};
 const caption=root.querySelector('[data-piano-song-caption]');let timer=null,index=0;
 const label=text=>{button.setAttribute('aria-label',text);button.title=text;const tip=button.querySelector('.view-control-label');if(tip)tip.textContent=text;else button.textContent=text;};
 const stop=()=>{clearTimeout(timer);timer=null;button.setAttribute('aria-pressed','false');label('弹一首《生日快乐》');caption.textContent='琴键也还可以弹。';};
 const next=()=>{if(!button.isConnected||document.hidden){stop();return;}const [note,beats]=BIRTHDAY_TUNE[index];play(note);illuminate(note);caption.textContent=`生日快乐 · ${pianoScaleNumber(note)}${note>=12?'（高）':''}`;index++;timer=setTimeout(index<BIRTHDAY_TUNE.length?next:stop,beats*380);};
 const click=()=>{if(timer!==null){stop();return;}index=0;button.setAttribute('aria-pressed','true');label('先停一会儿');next();};
 const visibility=()=>{if(document.hidden)stop();};
 const press=e=>{if(e.target.closest('[data-piano-note]'))stop();};
 button.addEventListener('click',click);root.addEventListener('pointerdown',press);document.addEventListener('visibilitychange',visibility);
 return {stop,dispose(){stop();button.removeEventListener('click',click);root.removeEventListener('pointerdown',press);document.removeEventListener('visibilitychange',visibility);}};
}
