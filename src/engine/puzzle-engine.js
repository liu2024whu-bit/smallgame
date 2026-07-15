export class PuzzleEngine {
  constructor(chapters = {}) {
    this.chapters = chapters;
  }

  check(chapterId, input, state) {
    const chapter = this.chapters[chapterId];
    if (!chapter) return { ok: false, reason: 'chapter-missing' };
    const result = chapter.verify(input, state);
    return result;
  }

  unlock(state, chapterId, reward) {
    return {
      ...state,
      solved: { ...state.solved, [chapterId]: true },
      inventory: [...(state.inventory ?? []), ...(reward ?? [])],
    };
  }
}
