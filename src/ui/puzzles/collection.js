import { HASHIRA, screenPorts } from '../../puzzles/screen.js';
import {character,escape,moveButton} from '../dom.js';

export function renderScreen(progress) {
  const ports = screenPorts(progress.flips);
  return `<div class="screen-workbench"><p class="port-key">入口 1 → 出口 0</p><div class="accordion-screen">${progress.flips.map((face, index) => {
    const left = index ? ports[index-1][1] === ports[index][0] : ports[index][0] === 1;
    const right = index < 8 ? ports[index][1] === ports[index+1][0] : ports[index][1] === 0;
    return moveButton(`<span class="screen-name"><small>${index+1}</small> ${escape(HASHIRA[index])}</span>${character('hashira',index,3,3,HASHIRA[index])}<svg class="screen-line" viewBox="0 0 100 100" aria-label="左端第${ports[index][0]}层，右端第${ports[index][1]}层"><path d="M0 ${85-ports[index][0]*23} L100 ${85-ports[index][1]*23}"/><text x="5" y="${80-ports[index][0]*23}">${ports[index][0]}</text><text x="85" y="${80-ports[index][1]*23}">${ports[index][1]}</text></svg><span class="screen-face-label">${face?'背':'正'}</span>`,{type:'flip',index},{key:`screen-${index}`,className:`screen-leaf ${face?'back-face':''} ${left?'connected-left':''} ${right?'connected-right':''}`}).replace('<button ',`<button aria-label="翻动第${index+1}扇纸屏，${HASHIRA[index]}，当前${face?'背面':'正面'}" `);
  }).join('')}</div><button class="text-button" data-action="collection" data-id="hashira">看看画</button></div>`;
}
