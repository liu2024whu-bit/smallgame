import { character } from './dom.js';

export function skyFrame(pair = 0, back = false) {
  return character('skyClouds', back ? 2 : pair, 1, 3, back ? '纸景背面，绳子连着云片' : pair ? '云中纸景，正太与樱花' : '云中纸景，巫师帽与正太');
}

export function renderSkyPair(_state, pair = 0) {
  return `<div class="sky-diorama">${skyFrame(pair)}</div>`;
}

export function skyControls(_state, pair) {
  return `<div class="appearance-controls"><span>${pair ? '正太与樱花' : '巫师帽与正太'}</span><button class="text-button" data-action="sky-pair">另一组</button></div>`;
}
