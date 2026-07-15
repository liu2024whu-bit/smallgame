// Chapter loader for v1 architecture.
// Keeps story chapters independent from UI and state.

import { CHAPTERS } from '../puzzles/chapter-config.js';

export function getChapter(id) {
  return CHAPTERS.find((chapter) => chapter.id === id) ?? null;
}

export function getAllChapters() {
  return [...CHAPTERS];
}

export function getNextChapter(completed = []) {
  return CHAPTERS.find((chapter) => !completed.includes(chapter.id)) ?? null;
}
