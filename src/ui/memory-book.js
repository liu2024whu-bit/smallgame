export function createMemoryBook(chapters) {
  return chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    unlocked: false,
  }));
}

export function unlockMemory(book, chapterId) {
  return book.map((item) => item.id === chapterId ? { ...item, unlocked: true } : item);
}
