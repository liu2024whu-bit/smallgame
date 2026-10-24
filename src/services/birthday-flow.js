import { birthdayReady } from '../core/exploration.js';

export function birthdayActions({store,panel,render,audio,openPanel,activity}){
  return {
    'birthday-unwrap':()=>{if(store.get().ending){activity('birthday:unwrap');audio.material('paper');}},
    'candle-light':button=>{
      const current=panel();
      if(current?.type!=='candles'||!birthdayReady(store.get())||store.get().ending)return;
      const index=Number(button.dataset.index);if(![0,1].includes(index))return;
      const candles=current.view?.candles??0;if(candles&(1<<index))return;
      current.view={...current.view,candles:candles|(1<<index)};render();audio.material('glass');
    },
    'birthday-wish':()=>{
      if(panel()?.type!=='candles'||panel().view?.candles!==3||!birthdayReady(store.get()))return;
      store.dispatch({type:'ending'});audio.success();openPanel({type:'ending'},false);audio.music.playOnce('birthday');
    },
  };
}
