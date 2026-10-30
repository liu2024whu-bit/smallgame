import {boxCanTurn} from '../data/birthday-lock.js';
import { birthdayReady } from '../core/exploration.js';
import {atlas} from '../ui/dom.js';
import {motionAllowed} from './motion/shared.js';
import {CANDLE_LIGHTS} from '../data/birthday-presentation.js';

export function lightBirthdayCandle({store,panel,render,audio},index){
 const current=panel(),state=store.get();
 if(current?.type!=='candles'||!birthdayReady(state)||state.ending||!state.collected.includes('matches')||![0,1].includes(index))return false;
 const candles=current.view?.candles??0;if(candles&(1<<index))return false;
 current.view={...current.view,candles:candles|(1<<index)};render();audio.material('paper');audio.foley('stamp',.3);
 const table=document.querySelector('.candle-table');
 if(table&&motionAllowed()){
  const point=CANDLE_LIGHTS[index],match=document.createElement('span');match.className='birthday-burning-match';match.setAttribute('aria-hidden','true');match.innerHTML=atlas('chocolateRewardParts',4);match.style.left=`calc(${point.x}% - 87px)`;match.style.top=`calc(${point.matchY}% - 21px)`;table.append(match);
  match.animate([{opacity:0,translate:'-12px 9px'},{opacity:1,translate:'0 0',offset:.2},{opacity:1,translate:'0 0',offset:.7},{opacity:0,translate:'-10px 5px'}],{duration:650,fill:'forwards'}).finished.catch(()=>{}).finally(()=>match.remove());
 }
 return true;
}

export function birthdayActions({store,panel,render,audio,openPanel,activity}){
  return {
    'birthday-box-turn':()=>{if(panel()?.type!=='puzzle'||!['birthdayLock','ribbons'].includes(panel().id)||!boxCanTurn(store.get()))return;if(store.dispatch({type:'move',id:'ribbons',move:{type:'flip'}})){audio.material('paper');audio.foley('turn');}},
    'birthday-unwrap':()=>{if(store.get().ending){activity('birthday:unwrap');audio.material('paper');}},
    'candle-light':button=>lightBirthdayCandle({store,panel,render,audio},Number(button.dataset.index)),
    'birthday-wish':()=>{
      if(panel()?.type!=='candles'||panel().view?.candles!==3||!birthdayReady(store.get()))return;
      store.dispatch({type:'ending'});audio.success();openPanel({type:'ending'},false);audio.music.playOnce('birthday');
    },
  };
}
