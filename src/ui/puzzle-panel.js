export function createPuzzlePanel(puzzle) {
  return {
    title: puzzle.title,
    clues: puzzle.clues ?? [],
    status: 'locked',
  };
}

export function updatePuzzleStatus(panel, status) {
  return { ...panel, status };
}
