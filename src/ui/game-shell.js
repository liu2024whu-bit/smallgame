export function createGameShell(root, modules) {
  const { roomView, memoryBook, puzzlePanel } = modules;

  return {
    mount() {
      root.replaceChildren();
      root.append(roomView.element(), memoryBook.element(), puzzlePanel.element());
    },
  };
}
