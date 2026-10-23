import { motionAllowed } from '../services/motion.js';
// Transient presentation choices stay out of the save and puzzle rule modules.
export function viewActions({ panel, render, activity }) {
  const change = patch => { const current = panel(); current.view = { ...current.view, ...patch }; render(); };
  return {
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
    'campus-stamp': button => activity(`campus:${button.dataset.id}`),
    'mechanism-back': () => change({ back:!panel().view?.back }),
    'reading-book': button => activity(`reading:${Number(button.dataset.index)}`),
  };
}
