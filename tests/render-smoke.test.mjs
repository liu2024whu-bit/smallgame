import test from 'node:test';
import assert from 'node:assert/strict';

test('all chapter render modules import and return HTML', async () => {
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

  const { CHAPTERS } = await import('../src/content.js');
  const common = await import('../src/render-chapters.js');
  const { renderStars } = await import('../src/render-stars.js');
  const { renderWind } = await import('../src/render-wind.js');
  const { renderBreath } = await import('../src/render-breath.js');
  const state = {
    solved: {}, discoveries: { cat: false, dog: false },
    starOrder: ['rose', 'hat', 'blossom', 'halo'],
    windRotations: [0, 0, 0, 0], windClues: [false, false, false, false],
    breathOrder: ['wisteria', 'water', 'serpent', 'wind'],
    filmSteps: { red: false, invert: false, cat: false }, notebookSolved: false,
    postmarks: { wuhan: 0, nanjing: 0 }, rings: { root: '', branch: '', crown: '' }, ending: null,
  };
  const renderers = {
    birth: common.renderBirth,
    stars: renderStars,
    wind: renderWind,
    breath: renderBreath,
    film: common.renderFilm,
    cities: common.renderCities,
    rings: common.renderRings,
    gift: common.renderGift,
  };

  for (const chapter of CHAPTERS) {
    const html = renderers[chapter.id](state, chapter);
    assert.equal(typeof html, 'string');
    assert.ok(html.length > 100, `${chapter.id} should render meaningful HTML`);
  }
});

test('visual chapters use explicit character or cosmetic images without symbol substitutes', async () => {
  const { CHAPTERS } = await import('../src/content.js');
  const { renderStars } = await import('../src/render-stars.js');
  const { renderBreath } = await import('../src/render-breath.js');
  const state = {
    solved: {}, starOrder: ['rose', 'hat', 'blossom', 'halo'],
    breathOrder: ['wisteria', 'water', 'serpent', 'wind'],
  };
  const stars = renderStars(state, CHAPTERS.find((chapter) => chapter.id === 'stars'));
  const breath = renderBreath(state, CHAPTERS.find((chapter) => chapter.id === 'breath'));
  assert.match(stars, /巫师帽与正太头/);
  assert.match(stars, /正太头与樱花头/);
  assert.match(stars, /<img/);
  assert.match(breath, /富冈义勇/);
  assert.match(breath, /不死川实弥/);
  assert.match(breath, /伊黑小芭内/);
  assert.doesNotMatch(breath, /≈|〽|∿|❋/);
});
