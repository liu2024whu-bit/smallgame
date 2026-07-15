import test from 'node:test';
import assert from 'node:assert/strict';

function browserStubs() {
  const dummy = {
    innerHTML: '', textContent: '', className: '', open: false,
    addEventListener() {}, querySelector() { return dummy; },
    classList: { add() {}, remove() {}, toggle() {} },
    showModal() { this.open = true; }, close() { this.open = false; }, focus() {},
  };
  globalThis.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  globalThis.document = { querySelector() { return dummy; }, addEventListener() {}, title: '' };
  globalThis.window = { AudioContext: null, webkitAudioContext: null, confirm() { return false; }, setTimeout, clearTimeout };
  globalThis.requestAnimationFrame = (callback) => callback();
}

test('chapters use concrete image assets and film hotspots', async () => {
  browserStubs();
  const { CHAPTERS } = await import('../src/content.js');
  const common = await import('../src/render-chapters.js');
  const { renderStars } = await import('../src/render-stars.js');
  const { renderWind } = await import('../src/render-wind.js');
  const { renderBreath } = await import('../src/render-breath.js');
  const state = {
    solved: {}, discoveries: { cat: false, dog: false },
    starOrder: ['rose', 'hat', 'blossom', 'halo'], windRotations: [0, 0, 0, 0],
    windClues: [false, false, false, false],
    breathOrder: ['wisteria', 'water', 'serpent', 'wind'],
    filmSteps: { red: false, invert: false, cat: false }, notebookSolved: false,
    postmarks: { wuhan: 0, nanjing: 0 }, rings: { root: '', branch: '', crown: '' }, ending: null,
  };
  const chapter = (id) => CHAPTERS.find((item) => item.id === id);
  assert.match(common.renderBirth(state, chapter('birth')), /pet-photo__image/);
  assert.match(renderStars(state, chapter('stars')), /sky-pair--witch/);
  assert.match(renderWind(state, chapter('wind')), /wind-character-panel--xiao/);
  assert.match(renderBreath(state, chapter('breath')), /breath-card--water/);
  const film = common.renderFilm(state, chapter('film'));
  assert.match(film, /data-film-step="red"/);
  assert.match(film, /cat-hotspots/);
  assert.match(common.renderCities(state, chapter('cities')), /planeLeaf|梧桐/);
});
