import {
  BOND_TOKENS,
  FLOWERS,
  PUZZLE,
  STORY,
  TIMELINE_CARDS,
} from './content.js';
import {
  advanceFlowerSequence,
  deriveEnding,
  extractTimelineMonogram,
  getHint,
  getProgress,
  getStage,
  isBondPuzzleSolved,
  isTimelineSolved,
  isValidAge,
  isValidGift,
  isValidMonogram,
  isValidRootCode,
  moveTimelineCard,
  normalizeDigits,
  normalizeLetters,
} from './game-core.js';

Object.assign(globalThis, {
  BOND_TOKENS,
  FLOWERS,
  PUZZLE,
  STORY,
  TIMELINE_CARDS,
  advanceFlowerSequence,
  deriveEnding,
  extractTimelineMonogram,
  getHint,
  getProgress,
  getStage,
  isBondPuzzleSolved,
  isTimelineSolved,
  isValidAge,
  isValidGift,
  isValidMonogram,
  isValidRootCode,
  moveTimelineCard,
  normalizeDigits,
  normalizeLetters,
});

const runtimeParts = [
  './game-runtime-1.js',
  './game-runtime-2.js',
  './game-runtime-3.js',
  './game-runtime-4.js',
];

for (const src of runtimeParts) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL(src, import.meta.url).href;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Unable to load ${src}`));
    document.head.append(script);
  });
}
