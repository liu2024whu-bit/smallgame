import test from 'node:test';
import assert from 'node:assert/strict';
import { PUZZLE } from '../src/content.js';
import { advanceFlowerSequence, deriveEnding, extractTimelineMonogram, getHint, getProgress, getStage, isBondPuzzleSolved, isTimelineSolved, isValidAge, isValidGift, isValidMonogram, isValidRootCode, moveTimelineCard, normalizeDigits, normalizeLetters } from '../src/game-core.js';

test('normalizers remove irrelevant characters and cap length', () => {
  assert.equal(normalizeDigits('10 / 29 extra'), '1029');
  assert.equal(normalizeLetters(' l-x_y! ', 3), 'LXY');
});

test('date, monogram and age validators accept the configured answers', () => {
  assert.equal(isValidRootCode('10-29'), true);
  assert.equal(isValidRootCode('1028'), false);
  assert.equal(isValidMonogram('lxy'), true);
  assert.equal(isValidAge('20岁'), true);
});

test('gift validation requires all four recovered clues', () => {
  assert.equal(isValidGift({ date: '1029', name: 'lxy', age: '20', word: 'birthday' }), true);
  assert.equal(isValidGift({ date: '1029', name: 'lxy', age: '19', word: 'birthday' }), false);
});

test('timeline cards move immutably and solved order is detected', () => {
  const original = [...PUZZLE.timelineInitialOrder];
  const moved = moveTimelineCard(original, 0, 1);
  assert.notDeepEqual(moved, original);
  assert.deepEqual(original, PUZZLE.timelineInitialOrder);
  assert.equal(isTimelineSolved(PUZZLE.timelineOrder), true);
  assert.equal(isTimelineSolved(original), false);
});

test('timeline extraction reads positions 2, 5 and 7 as LXY', () => {
  assert.equal(extractTimelineMonogram(PUZZLE.timelineOrder), 'LXY');
});

test('flower sequence advances, resets, and completes', () => {
  let progress = 0;
  for (const [index, flower] of PUZZLE.flowerSequence.entries()) {
    const result = advanceFlowerSequence(PUZZLE.flowerSequence, progress, flower);
    progress = result.progress;
    assert.equal(result.status, index === 3 ? 'complete' : 'continue');
  }
  assert.deepEqual(advanceFlowerSequence(PUZZLE.flowerSequence, 2, 'rose'), { progress: 0, status: 'wrong' });
});

test('optional bond puzzle recognizes the two abstract character motifs', () => {
  assert.equal(isBondPuzzleSolved(PUZZLE.bondAssignments), true);
  assert.equal(isBondPuzzleSolved({ ...PUZZLE.bondAssignments, spiral: 'kakashi' }), false);
});

test('progress, stage, hints and endings derive from persistent state', () => {
  const state = { rootUnlocked: true, monogramSolved: true, flowersSolved: false, ringSolved: false, giftOpened: false };
  assert.equal(getStage(state), 'flowers');
  assert.deepEqual(getProgress(state), { completed: 2, total: 5, percentage: 40 });
  assert.equal(getHint(state, 99).level, 2);
  assert.equal(deriveEnding('side-by-side', true).id, 'side-by-side');
  assert.equal(deriveEnding('side-by-side', false).id, 'future');
});
