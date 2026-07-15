import test from 'node:test';
import assert from 'node:assert/strict';

function classList() {
  return { add() {}, remove() {}, toggle() {} };
}

test('full application module boots and renders the first chapter', async () => {
  const app = { innerHTML: '', addEventListener() {}, classList: classList() };
  const dialogBody = { innerHTML: '' };
  const dialog = {
    open: false,
    className: 'dialog',
    addEventListener() {},
    querySelector() { return null; },
    showModal() { this.open = true; },
    close() { this.open = false; },
  };
  const toast = { textContent: '', classList: classList() };
  const nodes = new Map([
    ['#app', app],
    ['#dialog', dialog],
    ['#dialogBody', dialogBody],
    ['#toast', toast],
  ]);

  globalThis.localStorage = {
    getItem() { return null; },
    setItem() {},
    removeItem() {},
  };
  globalThis.document = {
    title: '',
    querySelector(selector) { return nodes.get(selector) ?? null; },
    addEventListener() {},
  };
  globalThis.window = {
    confirm() { return false; },
    AudioContext: null,
    webkitAudioContext: null,
  };
  globalThis.requestAnimationFrame = (callback) => callback();

  const originalSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = () => 0;
  try {
    await import(`../src/app.js?boot-test=${Date.now()}`);
  } finally {
    globalThis.setTimeout = originalSetTimeout;
  }

  assert.match(app.innerHTML, /写给第20圈的无地址信/);
  assert.match(app.innerHTML, /时间装订线/);
  assert.match(app.innerHTML, /高处与地面的两张吊牌/);
});
