// Transient presentation choices stay out of the save and puzzle rule modules.
export function memoryActions({ panel, render, activity }) {
  const change = patch => { const current = panel(); current.view = { ...current.view, ...patch }; render(); };
  return {
    'memory-detail': button => { const focus = Number(button.dataset.index); change({ focus }); activity(`art:detail:${focus}`); },
    'memory-cinema': () => { const view = panel().view ?? {}; change({ playing: true, frame: view.playing ? ((view.frame ?? 0) + 1) % 3 : 0 }); activity('cinema:play'); },
    'memory-figure': button => change({ figure: Number(button.dataset.index) }),
    'memory-open': () => change({ open: !panel().view?.open }),
    'memory-postcard': () => change({ back: !panel().view?.back }),
    'memory-card': button => change({ card: Number(button.dataset.index), back: false }),
    'reading-book': button => activity(`reading:${Number(button.dataset.index)}`),
  };
}
