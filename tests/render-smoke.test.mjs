import test from 'node:test';
import assert from 'node:assert/strict';

test('all chapter render modules import and return HTML', async () => {
  const dummy = {
    innerHTML: '',
    textContent: '',
    className: '',
    open: false,
    addEventListener() {},
    querySelector() { return dummy; },
    classList: { add() {}, remove() {}, toggle() {} },
    showModal() { this.open = true; },
    close() { this.open = false; },
    focus() {},
  };

  globalThis.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  globalThis.document = { querySelector() { return dummy; }, addEventListener() {}, title: '' };
  globalThis.window = { AudioContext: null, webkitAudioContext: null, confirm() { return false; }, setTimeout, clearTimeout };
  globalThis.requestAnimationFrame = (callback) => callback();

  const { CHAPTERS } = await import('../src/content.js');
  const renderers = await import('../src/render-chapters.js');
  const state = {
    solved: {},
    discoveries: { cat: false, dog: false },
    starOrder: ['rose', 'hat', 'blossom', 'halo'],
    windRotations: [0, 0, 0, 0],
    breathOrder: ['wisteria', 'water', 'serpent', 'wind'],
    filmSteps: { red: false, invert: false, cat: false },
    notebookSolved: false,
    postmarks: { wuhan: 0, nanjing: 0 },
    rings: { root: '', branch: '', crown: '' },
    ending: null,
  };
  const names = {
    birth: 'renderBirth',
    stars: 'renderStars',
    wind: 'renderWind',
    breath: 'renderBreath',
    film: 'renderFilm',
    cities: 'renderCities',
    rings: 'renderRings',
    gift: 'renderGift',
  };

  for (const chapter of CHAPTERS) {
    const html = renderers[names[chapter.id]](state, chapter);
    assert.equal(typeof html, 'string');
    assert.ok(html.length > 100, `${chapter.id} should render meaningful HTML`);
  }
});
