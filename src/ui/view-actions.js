import { motionAllowed,settleWorkbenchZoom } from '../services/motion.js';
import {centerWorkbenchViewport} from './dialog-state.js';
export const afterPuzzleAction=(view={},action)=>['undo','reset'].includes(action)?{...view,pressProof:false}:view;
// Transient presentation choices stay out of the save and puzzle rule modules.
export function viewActions({ panel, render, activity,foley=()=>{} }) {
  const change = patch => { const current = panel(); current.view = { ...current.view, ...patch }; render(); };
  return {
    'cloud-face':button=>{const back=button.dataset.back==='true';if(back!==!!panel().view?.back){change({back});foley('turn');}},
    'press-proof':button=>change({pressProof:button.dataset.open==='true'}),
    'settings-page':button=>{if(['sound','picture','save'].includes(button.dataset.id))change({section:button.dataset.id});},
    'calendar-note':button=>change({dateNote:Number(button.dataset.index)}),
    'ending-page':button=>{
      const current=panel(),lastPage=!current.view?.lastPage;current.view={...current.view,lastPage};
      button.classList.toggle('page-turned',lastPage);button.setAttribute('aria-expanded',lastPage);
      button.querySelector('.ending-page-front').setAttribute('aria-hidden',lastPage);
      button.querySelector('.ending-page-back').setAttribute('aria-hidden',!lastPage);
    },
    'workbench-look':()=>{
      const before=document.querySelector('.puzzle-field')?.getBoundingClientRect();
      const closeLook=!panel().view?.closeLook;change({closeLook});
      const viewport=document.querySelector('.puzzle-viewport');
      const measured=!!viewport?.querySelector('[data-look-point]');
      if(closeLook&&viewport){
        if(!centerWorkbenchViewport(viewport)){
          const focus=panel().id==='cloud'&&!panel().view?.back ? .34:.5;
          viewport.scrollLeft=viewport.scrollWidth*focus-viewport.clientWidth/2;
        }
      }
      if(measured)settleWorkbenchZoom(viewport.querySelector('.puzzle-field'),before);
    },
    'memory-detail': button => { const focus = Number(button.dataset.index); change({ focus }); activity(`art:detail:${focus}`); },
    'memory-cinema': () => { change({ playing: !panel().view?.playing }); activity('cinema:play'); },
    'memory-figure': button => change({ figure: Number(button.dataset.index) }),
    'memory-open': () => change({ open: !panel().view?.open }),
    'memory-postcard': () => change({ back: !panel().view?.back }),
    'memory-card': button => change({ card: Number(button.dataset.index), back: false }),
    'memory-mirror': () => change({ reflected: !panel().view?.reflected }),
    'evidence-flip': () => change({ flipped: !panel().view?.flipped }),
    'campus-look': button => { change({ looked: !panel().view?.looked }); if(button.dataset.activity)activity(button.dataset.activity); },
    'campus-stop': button => change({ corner:Number(button.dataset.index),looked:false }),
    'record-detail': button => change({record:button.dataset.id}),
    'record-page': button => change({recordSide:button.dataset.id,record:null}),
    'encore-wind': () => change({wind:Math.min(720,(panel().view?.wind??0)+120)}),
    'encore-letter': () => {
      if((panel().view?.wind??0)<360)return;
      const letter=!panel().view?.letter;change({letter});
      if(letter)document.querySelector('.encore-letter')?.scrollIntoView({block:'nearest',behavior:motionAllowed()?'smooth':'instant'});
    },
    'campus-stamp': button => {activity(`campus:${button.dataset.id}`);foley('stamp');},
    'mechanism-back': () => change({ back:!panel().view?.back }),
    'paper-turn':()=>change({turned:!panel().view?.turned}),
    'reading-book': button => activity(`reading:${Number(button.dataset.index)}`),
  };
}
