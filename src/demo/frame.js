import {mountGame} from '../app.js';
import {createMusicLibrary} from '../services/music-library.js';
import {previewState,REVIEW_CASES} from './fixtures.js';
import {visibleCopy} from './visible-copy.js';

const memory=new Map();
const game=mountGame({storage:{getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)},library:createMusicLibrary(null)});
let current=REVIEW_CASES[0],loadTicket=0;
const frame=async()=>{
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const fades=[...document.querySelectorAll('.welcome-content,.dialog-body')].flatMap(el=>el.getAnimations()).filter(a=>a.playState==='running'&&a.effect.getComputedTiming().duration<=500);
  await Promise.allSettled(fades.map(a=>a.finished));
};
function copy(){
  const dialog=document.querySelector('dialog[open]'),panel=game.panel();
  const root=dialog??(document.querySelector('#welcome').hidden?document.querySelector('.game-shell'):document.querySelector('#welcome'));
  const matches=spec=>spec.panel&&['type','id','tab'].every(key=>spec.panel[key]===panel?.[key]);
  let spec=current;
  if(dialog&&!matches(current))spec=REVIEW_CASES.find(matches)??current;
  else if(!dialog&&root.matches('.game-shell'))spec=REVIEW_CASES.find(s=>s.id==='room-'+game.store.get().scene)??current;
  return {id:spec.id,title:dialog?.querySelector('#dialog-title')?.textContent??spec.name,source:spec.source,text:visibleCopy(root)};
}
async function load(id,{instant=false,clearText=false,sound=false,reduced=false}={}){
  const spec=REVIEW_CASES.find(entry=>entry.id===id);if(!spec)return;
  const ticket=++loadTicket;current=spec;game.resetPresentation();game.closeAllPanels();game.showWelcome();
  const state=previewState(spec);state.settings.clearText=clearText;state.settings.sound=sound;if(instant||reduced)state.settings.motion=false;
  if(spec.mode==='title'){state.begun=false;game.store.replace(state);await frame();return copy();}
  if(spec.beforeEnding){state.ending=false;state.activities=state.activities.filter(id=>id!=='birthday:unwrap');}
  game.store.replace(state);
  if(spec.mode==='intro'){
    game.showWelcome('intro');
    if(spec.step>0)document.querySelector('[data-action="intro-unfold"]').click();
    await frame();
    if(spec.step===2)document.querySelector('[data-action="intro-next"]').click();
    await frame();return copy();
  }
  await game.enter();if(ticket!==loadTicket)return copy();game.resetPresentation();
  if(spec.scene)game.store.dispatch({type:'scene',id:spec.scene});
  if(spec.panel)game.openPanel(structuredClone(spec.panel),false);
  if(spec.click){await frame();if(ticket===loadTicket)document.querySelector(spec.click)?.click();}
  await frame();return copy();
}
window.reviewAPI={load,copy,playback:()=>game.audio.music.snapshot(),cases:REVIEW_CASES,snapshot:()=>game.store.get()};
let copyTimer;
function publishCopy(){window.parent.postMessage({type:'smallgame-review',...copy()},location.origin);}
new MutationObserver(()=>{publishCopy();clearTimeout(copyTimer);copyTimer=setTimeout(publishCopy,380);}).observe(document.querySelector('#app'),{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden']});
window.parent.postMessage({type:'smallgame-review-ready'},location.origin);
