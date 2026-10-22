import { character } from './dom.js';

export function skyAsset(settings, side) {
  const base = settings[side ? 'skyCapeRight' : 'skyCapeLeft'] === 'kizuna' ? 'skyKizuna' : 'skyBat';
  return side && settings.skyMask === 'innocence' ? `${base}Innocence` : base;
}

export function renderSkyPair(state, pair = 0) {
  const names = pair ? ['正太 · 高个子黑脸', '樱花 · 矮个子面具'] : ['巫师帽 · 高个子黑脸', '正太 · 矮个子面具'];
  return `<div class="sky-pair">${names.map((name, side) => character(skyAsset(state.settings, side), pair * 2 + side, 2, 2, name)).join('')}</div>`;
}

export function skyControls(state, pair) {
  const cape = side => state.settings[side ? 'skyCapeRight' : 'skyCapeLeft'] === 'kizuna' ? '绊爱' : '蝙蝠';
  return `<div class="appearance-controls"><button class="text-button" data-action="sky-pair">${pair ? '正太＋樱花' : '巫师帽＋正太'} · 换一组</button><button class="text-button" data-action="sky-cape" data-side="left">高个子：${cape(0)}斗篷</button><button class="text-button" data-action="sky-cape" data-side="right">矮个子：${cape(1)}斗篷</button><button class="text-button" data-action="sky-mask">${state.settings.skyMask === 'innocence' ? '回归童真面具' : '矮人面具'} · 切换</button></div>`;
}
