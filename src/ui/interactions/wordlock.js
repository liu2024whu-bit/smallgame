import {WORD_VIEWS,WORD_INPUT_CAMERA} from '../../data/wordlock.js';
import {LETTER_CODE} from '../../data/ciphers.js';
import {wordGripPoint,drawerAmountForY} from '../../puzzles/word-geometry.js';
import {paintWordDrawer} from '../wordlock-apparatus.js';
import {finishWordDrawer,settleWordDrawer} from '../../services/motion/wordlock.js';
import {pointerSession} from './pointer.js';

export function prepareWordMove(root,action){
 const model=root.querySelector('.word-lock-workbench');if(!model)return;
 model.dataset.wordPressed=document.activeElement?.dataset.mechanicalKey??(action.type==='key'?String.fromCharCode(65+action.value):action.type==='erase'?'Backspace':action.type==='submit'?'Enter':'');
}
export function bindWordDesk(root,progress,{move,changeView,activity,feedback=()=>{},view={},solved=false}){
 const model=root.querySelector('.word-lock-workbench');if(!model)return ()=>{};
 const mode=model.dataset.wordMode,p=progress??JSON.parse(model.dataset.wordState),world=model.querySelector('.word-lock-world');
 const abort=new AbortController(),options={signal:abort.signal};let committing=false;
 const choose=next=>{if(!Object.hasOwn(WORD_VIEWS,next))return;model.dataset.wordNextView=next;changeView({wordView:next});if(['alphabet','rows','columns'].includes(next))activity(`evidence:${next}`);feedback('turn');};
 root.addEventListener('click',e=>{
  const button=e.target.closest('[data-word-view],[data-flip-board],[data-read-zoom],[data-flip-strip],[data-cursor],[data-grip]');
  if(!button||button.disabled||!model.contains(button)||Date.now()<Number(root.dataset.suppressUntil||0))return;
  e.preventDefault();e.stopPropagation();
  if(button.dataset.wordView){choose(button.dataset.wordView);return;}
  if(button.hasAttribute('data-flip-board')){const back=model.dataset.wordBoardBack!=='true';model.dataset.wordFlip='board';if(mode==='columns')model.dataset.wordNextView='papers';changeView({wordBoardBack:back,...(mode==='columns'?{wordView:'papers'}:{})});if(back)activity('evidence:columns');feedback('turn');return;}
  if(button.hasAttribute('data-read-zoom')){choose('alphabet');return;}
  if(button.dataset.flipStrip){const kind=button.dataset.flipStrip;if(kind==='rows'&&mode==='rows'){model.dataset.wordFlip='rows';changeView({wordFlipped:model.dataset.wordFlipped!=='true'});feedback('turn');}else choose(kind);return;}
  if(button.dataset.cursor!==undefined&&!solved)move({type:'cursor',index:Number(button.dataset.cursor)});
  if(button.hasAttribute('data-grip')&&!solved)move({type:'submit'});
 },options);
 const stop=pointerSession(root,{
  pick(e){const source=e.target.closest('[data-grip]');return source&&!source.disabled&&!solved&&model.contains(source)?{source}:null;},
  start(g){finishWordDrawer(world);g.scale=world.getBoundingClientRect().width/1672;g.start=wordGripPoint(0,WORD_INPUT_CAMERA)[1];feedback('return');},
  move(g,e){g.amount=drawerAmountForY(g.start+(e.clientY-g.y)/g.scale,WORD_INPUT_CAMERA);const valid=p.values.every((v,i)=>v===LETTER_CODE[i].charCodeAt(0)-65);paintWordDrawer(world,WORD_INPUT_CAMERA,g.amount*(valid?1:.04));},
  end(g,_,cancelled){if(!cancelled&&g.amount>.55){committing=true;if(!move({type:'submit'}))committing=false;}},
  clear(){if(!committing&&world?.isConnected)settleWordDrawer(world,WORD_INPUT_CAMERA,Number(world.querySelector('.word-apparatus')?.dataset.wordAmount??0),p.opened?1:0,180);}
 });
 return ()=>{stop();abort.abort();};
}
