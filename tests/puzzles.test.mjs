import test from 'node:test';
import assert from 'node:assert/strict';
import {
  breathWord,
  decodeBirth,
  finalRibbonCode,
  isBreathSolved,
  isFilmSolved,
  isGiftSolved,
  isNotebookSolved,
  isRingSolved,
  isStarSolved,
  isWindSolved,
  moveItem,
  postmarkCode,
  ringAge,
  starCode,
  windLetters,
} from '../src/puzzles.js';

test('two tags decode 2006 only after both are found', () => {
  assert.equal(decodeBirth(true, true, '2006'), true);
  assert.equal(decodeBirth(true, false, '2006'), false);
  assert.equal(decodeBirth(true, true, '2060'), false);
});

test('star chapter restores 2020', () => {
  const order = ['hat', 'halo', 'blossom', 'rose'];
  assert.equal(starCode(order), '2020');
  assert.equal(isStarSolved(order), true);
});

test('wind wheels use 2020 to reveal EAST', () => {
  assert.equal(windLetters([2, 0, 2, 0]), 'EAST');
  assert.equal(isWindSolved([2, 0, 2, 0]), true);
});

test('breathing sequence produces BIRTHDAY', () => {
  const order = ['water', 'wind', 'serpent', 'wisteria'];
  assert.equal(breathWord(order), 'BIRTHDAY');
  assert.equal(isBreathSolved(order), true);
});

test('104 film requires all three observations', () => {
  assert.equal(isFilmSolved({ red: true, invert: true, cat: true }), true);
  assert.equal(isFilmSolved({ red: true, invert: false, cat: true }), false);
});

test('postmarks align to 1029', () => {
  assert.equal(postmarkCode(1, 3), '1029');
  assert.equal(postmarkCode(3, 1), '');
});

test('ring distances total 20', () => {
  const values = { root: '2006', branch: '2020', crown: '2026' };
  assert.equal(ringAge(values), 20);
  assert.equal(isRingSolved(values), true);
});

test('final gift lock reuses all recovered clues', () => {
  assert.equal(finalRibbonCode(), '06102920');
  assert.equal(isGiftSolved({ ribbon: '06102920', name: 'lxy', word: 'birthday' }), true);
});

test('optional notebook order unlocks side-by-side ending', () => {
  assert.equal(isNotebookSolved(
    ['spiral', 'clock', 'promise', 'mask'],
    ['eye', 'lightning', 'page', 'paw'],
  ), true);
});

test('moveItem remains predictable at boundaries', () => {
  assert.deepEqual(moveItem(['a', 'b', 'c'], 1, -1), ['b', 'a', 'c']);
  assert.deepEqual(moveItem(['a', 'b', 'c'], 0, -1), ['a', 'b', 'c']);
});
