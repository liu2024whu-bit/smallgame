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
    'campus-look': () => change({ looked: !panel().view?.looked }),
    'campus-stamp': button => activity(`campus:${button.dataset.id}`),
    'mechanism-back': () => change({ back:!panel().view?.back }),
    'reading-book': button => activity(`reading:${Number(button.dataset.index)}`),
  };
}
