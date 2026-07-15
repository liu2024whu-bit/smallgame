import test from 'node:test';
import assert from 'node:assert/strict';

const dummy = { innerHTML:'',textContent:'',className:'',open:false,addEventListener(){},querySelector(){return dummy;},classList:{add(){},remove(){},toggle(){}},showModal(){this.open=true;},close(){this.open=false;},focus(){} };
globalThis.localStorage = { getItem(){return null;},setItem(){},removeItem(){} };
globalThis.document = { querySelector(){return dummy;},addEventListener(){},title:'' };
globalThis.window = { AudioContext:null,webkitAudioContext:null,confirm(){return false;},setTimeout,clearTimeout };
globalThis.requestAnimationFrame = (callback)=>callback();

test('wind chapter requires four image discoveries before revealing all wheels', async () => {
  const { CHAPTERS } = await import('../src/content.js');
  const { renderWind } = await import('../src/render-wind.js');
  const chapter = CHAPTERS.find((item)=>item.id==='wind');
  const sealed = renderWind({ solved:{},windClues:[false,false,false,false],windRotations:[0,0,0,0] },chapter);
  assert.match(sealed,/data-wind-clue="0"/);
  assert.match(sealed,/照片压痕 0\/4/);
  assert.match(sealed,/尚未在立绘中找到/);
  const aligned = renderWind({ solved:{},windClues:[true,true,true,true],windRotations:[2,0,2,0] },chapter);
  assert.match(aligned,/照片压痕 4\/4/);
  assert.match(aligned,/>EAST</);
});

test('store supplies visual clue state to old saves', async () => {
  const { createStore } = await import('../src/store.js');
  const state = createStore().get();
  assert.deepEqual(state.windClues,[false,false,false,false]);
});
