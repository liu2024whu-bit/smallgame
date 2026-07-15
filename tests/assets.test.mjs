import test from 'node:test';
import assert from 'node:assert/strict';
import { ART, imageMarkup } from '../src/assets.js';

test('image asset manifest contains all visual chapters', () => {
  assert.ok(ART.flowers.daisy.src.startsWith('https://'));
  assert.ok(ART.pets.cat.src.startsWith('https://'));
  assert.ok(ART.genshin.xiao.src.startsWith('https://'));
  assert.ok(ART.genshin.wanderer.src.startsWith('https://'));
  assert.ok(ART.demonSlayer.giyu.src.startsWith('https://'));
  assert.ok(ART.demonSlayer.sanemi.src.startsWith('https://'));
  assert.ok(ART.demonSlayer.obanai.src.startsWith('https://'));
  assert.ok(ART.sky.witch.src.startsWith('https://'));
  assert.ok(ART.sky.shota.src.startsWith('https://'));
  assert.ok(ART.sky.sakura.src.startsWith('https://'));
  assert.ok(ART.campuses.wuhan.src.startsWith('https://'));
  assert.equal(ART.owned.duo.src, 'assets/art/duo.webp');
});

test('image markup is accessible and lazy loaded', () => {
  const html = imageMarkup(ART.flowers.rose, 'rose-photo');
  assert.match(html, /alt="自然光下的粉色玫瑰近景"/);
  assert.match(html, /loading="lazy"/);
  assert.match(html, /class="rose-photo"/);
});

test('Sky cosmetics represent the requested avatar looks rather than generic symbols', () => {
  assert.match(ART.sky.witch.alt, /巫师帽/);
  assert.match(ART.sky.shota.alt, /正太头/);
  assert.match(ART.sky.sakura.alt, /樱花头/);
});
