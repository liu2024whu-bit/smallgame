import test from 'node:test';
import assert from 'node:assert/strict';
import { ART, imageMarkup } from '../src/assets.js';

test('image asset manifest contains all visual chapters', () => {
  assert.ok(ART.flowers.daisy.src.startsWith('https://'));
  assert.ok(ART.pets.cat.src.startsWith('https://'));
  assert.ok(ART.genshin.xiao.src.startsWith('https://'));
  assert.ok(ART.genshin.wanderer.src.startsWith('https://'));
  assert.ok(ART.demonSlayer.giyu.src.startsWith('https://'));
  assert.ok(ART.campuses.wuhan.src.startsWith('https://'));
  assert.equal(ART.owned.duo.src, 'assets/art/duo.webp');
});

test('image markup is accessible and lazy loaded', () => {
  const html = imageMarkup(ART.flowers.rose, 'rose-photo');
  assert.match(html, /alt="自然光下的真实玫瑰花"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /class="rose-photo"/);
});
