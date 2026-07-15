import test from 'node:test';
import assert from 'node:assert/strict';

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

test('Sky scene uses two explicit pairing panels', async () => {
  const { CHAPTERS } = await import('../src/content.js');
  const { renderStars } = await import('../src/render-stars.js');
  const html = renderStars({ solved: {}, starOrder: ['rose', 'hat', 'blossom', 'halo'] }, CHAPTERS[1]);
  assert.equal((html.match(/class="sky-pair /g) ?? []).length, 2);
  assert.match(html, /巫师帽与正太头/);
  assert.match(html, /正太头与樱花头/);
});

test('Demon Slayer scene uses four independent cards', async () => {
  const { CHAPTERS } = await import('../src/content.js');
  const { renderBreath } = await import('../src/render-breath.js');
  const html = renderBreath({ solved: {}, breathOrder: ['wisteria', 'water', 'serpent', 'wind'] }, CHAPTERS[3]);
  assert.equal((html.match(/class="breath-card /g) ?? []).length, 4);
  assert.match(html, /富冈义勇/);
  assert.match(html, /不死川实弥/);
  assert.match(html, /伊黑小芭内/);
});

test('Genshin scene keeps two separate portrait panels', async () => {
  const { CHAPTERS } = await import('../src/content.js');
  const { renderWind } = await import('../src/render-wind.js');
  const html = renderWind({ solved: {}, windClues: [false,false,false,false], windRotations: [0,0,0,0] }, CHAPTERS[2]);
  assert.equal((html.match(/class="wind-character-panel /g) ?? []).length, 2);
  assert.match(html, /魈/);
  assert.match(html, /流浪者/);
});
