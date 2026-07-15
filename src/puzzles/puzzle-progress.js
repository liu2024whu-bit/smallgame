export function createPuzzleProgress() {
  return {
    completed: new Set(),
    clues: [],
    unlock(id) {
      this.completed.add(id);
    },
    has(id) {
      return this.completed.has(id);
    },
  };
}
