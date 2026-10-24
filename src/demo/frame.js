import {mountGame} from '../app.js';
import {createMusicLibrary} from '../services/music-library.js';
import {previewState,REVIEW_CASES} from './fixtures.js';
import {visibleCopy} from './visible-copy.js';

const memory=new Map();
const game=mountGame({storage:{getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)},library:createMusicLibrary(null)});
let current=REVIEW_CASES[0],loadTicket=0;
const frame=async()=>{
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const fades=[...document.querySelectorAll('.welcome-content,.dialog-body,.invitation')].flatMap(el=>el.getAnimations({subtree:el.matches('.invitation')})).filter(a=>a.playState==='running'&&a.effect.getComputedTiming().duration<=1000);
  await Promise.allSettled(fades.map(a=>a.finished));
};
function copy(){
  const dialog=document.querySelector('dialog[open]'),panel=game.panel();
  const root=dialog??(document.querySelector('#welcome').hidden?document.querySelector('.game-shell'):document.querySelector('#welcome'));
  const matches=spec=>spec.panel&&['type','id','tab'].every(key=>spec.panel[key]===panel?.[key]);
  let spec=current;
  if(dialog&&!matches(current))spec=REVIEW_CASES.find(matches)??current;
  else if(!dialog&&root.matches('.game-shell'))spec=REVIEW_CASES.find(s=>s.id==='room-'+game.store.get().scene)??current;
  if(panel?.type==='settings')spec=REVIEW_CASES.find(entry=>entry.panel?.type==='settings'&&(entry.panel.view?.section??'sound')===(panel.view?.section??'sound'))??spec;
  if(panel?.type==='puzzle'&&panel.id==='paper'){
    const state=game.store.get(),p=state.progress.paper;
    const id=panel.view?.pressProof&&p.proof?'paper-proof-look':state.solved.includes('paper')?'paper-done':state.hints.paper?'paper-hints':p.proof?'paper-proof':p.opened?'paper-open':!state.collected.includes('bookmark')?'paper-unfound':'paper';
    spec=REVIEW_CASES.find(entry=>entry.id===id)??spec;
  }
  if(panel?.type==='puzzle'&&panel.id==='cloud'){
    const state=game.store.get(),back=panel.view?.back,front=state.progress.cloud.values.every((v,i)=>v===[1,0,0][i]);
    const id=state.solved.includes('cloud')?'cloud-done'+(back?'-back':''):state.hints.cloud?'cloud-hints':!state.collected.includes('thread')?'cloud-unfound':front?'cloud-front-paired'+(back?'-back':''):back?'cloud-back':'cloud';
    spec=REVIEW_CASES.find(entry=>entry.id===id)??spec;
  }
  if(root.matches('#welcome')){const invitation=root.querySelector('.invitation');spec=REVIEW_CASES.find(entry=>invitation?entry.mode==='intro'&&entry.step===Number(invitation.dataset.step):entry.id==='opening')??spec;}
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
let copyTimer,lastCopy='';
function publishCopy(){const data=copy(),signature=JSON.stringify(data);if(signature===lastCopy)return;lastCopy=signature;window.parent.postMessage({type:'smallgame-review',...data},location.origin);}
new MutationObserver(()=>{publishCopy();clearTimeout(copyTimer);copyTimer=setTimeout(publishCopy,380);}).observe(document.querySelector('#app'),{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden','open']});
window.parent.postMessage({type:'smallgame-review-ready'},location.origin);
