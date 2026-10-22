import { mazeEdges, MAZE_STARS } from '../../puzzles/maze.js';
import { panWeights, WEIGHT_LABELS } from '../../puzzles/balance.js';
import { DRAWER_CONDITIONS, drawerEnabled } from '../../puzzles/drawers.js';
import { flipNeighbors } from '../../puzzles/flips.js';
import { character, dial, escape, motif, moveButton } from '../dom.js';

function mazePoint(node) {
  const ring = Math.floor(node / 6);
  const angle = Math.PI + (node % 6) * Math.PI / 3;
  const radius = [166, 112, 58][ring];
  return [210 + Math.cos(angle) * radius, 210 + Math.sin(angle) * radius];
}

export function renderMaze(progress) {
  return `<div class="maze-workbench"><div class="maze-apparatus">${character('apparatus', 0, 3, 2, '木制迷宫盒')}<svg class="ring-maze" viewBox="0 0 420 420" aria-label="三层轨道，入口在左侧，出口在右侧内圈">${[166, 112, 58].map(radius => `<circle class="maze-guide" cx="210" cy="210" r="${radius}"/>`).join('')}${mazeEdges(progress.turns).map(([a, b]) => {
    const from = mazePoint(a), to = mazePoint(b);
    if (Math.floor(a / 6) !== Math.floor(b / 6)) return `<path class="maze-track" d="M${from} L${to}"/>`;
    const radius = [166, 112, 58][Math.floor(a / 6)];
    return `<path class="maze-track" d="M${from} A${radius} ${radius} 0 0 1 ${to}"/>`;
  }).join('')}${MAZE_STARS.map(node => { const [x, y] = mazePoint(node); return `<text class="maze-star" x="${x}" y="${y + 7}" text-anchor="middle">✦</text>`; }).join('')}<circle class="maze-start" cx="44" cy="210" r="7"/><circle class="maze-end" cx="268" cy="210" r="7"/><text x="12" y="190">入</text><text x="281" y="215">出</text></svg></div><div class="dial-row">${progress.turns.map((turn, index) => dial(index, turn, ['外圈', '中圈', '内圈'][index], 6)).join('')}</div><p class="hand-note">星星固定在木框上，路要从它们脚下连过去。</p></div>`;
}

export function renderBalance(progress) {
  const [left, right] = panWeights(progress.places);
  const lean = Math.sign(left - right) * 7;
  const motifs = ['paw', 'star', 'rose', 'moon'];
  return `<div class="balance-workbench"><div class="weight-examples"><p>${motif('paw')}＝${motif('leaf')}${motif('leaf')}</p><p>${motif('star')}＝${motif('paw')}＋${motif('leaf')}</p><p>${motif('rose')}＝${motif('star')}＋${motif('leaf')}</p><p>${motif('moon')}＝${motif('rose')}＋${motif('leaf')}</p></div><div class="scale-apparatus" style="--lean:${lean}deg">${character('apparatus', 1, 3, 2, '黄铜小天平', 'scale-fixed')}${character('apparatus', 1, 3, 2, '', 'scale-swing')}<div class="scale-pan left-pan" data-pan="1">${progress.places.map((place, i) => place === 1 ? motif(motifs[i]) : '').join('')}</div><div class="scale-pan right-pan" data-pan="2">${progress.places.map((place, i) => place === 2 ? motif(motifs[i]) : '').join('')}</div></div><div class="weight-tray" data-pan="0">${progress.places.map((place, index) => moveButton(`${motif(motifs[index])}<span>${escape(WEIGHT_LABELS[index])}</span><small>${['桌上', '左盘', '右盘'][place]}</small>`, { type: 'place', index }, { key: `weight-${index}` })).join('')}</div><p class="hand-note">拖到左盘或右盘。也可以点摆件换一边。</p></div>`;
}

export function renderDrawers(progress) {
  return `<div class="drawers-workbench"><div class="drawer-chest">${character('apparatus', 3, 3, 2, '小狗抽屉柜', 'chest-painting')}${progress.open.map((open, index) => `<div class="drawer-unit ${open ? 'drawer-open' : ''} ${drawerEnabled(progress.open, index) ? 'drawer-free' : ''}">${moveButton(`<span class="drawer-face" style="--drawer:${index}">${character('apparatus', 3, 3, 2, '')}</span><span class="drawer-letter">${String.fromCharCode(65 + index)}</span><span class="drawer-handle"></span><small>${open ? '打开' : '关闭'}</small>`, { type: 'drawer', index }, { key: `drawer-${index}` })}</div>`).join('')}</div><div class="drawer-clues">${DRAWER_CONDITIONS.map(condition => `<p>${escape(condition)}</p>`).join('')}</div><p class="hand-note">A关　B关　C开　D开</p></div>`;
}

export function renderFlips(progress) {
  return `<div class="flips-workbench"><div class="flip-box">${character('apparatus', 4, 3, 2, '翻片木盒')}<div class="flip-grid">${progress.tiles.map((tile, index) => moveButton(tile ? motif('leaf') : motif('rose'), { type: 'flip', index }, { className: `flip-tile ${tile ? 'tile-back' : 'tile-flower'}`, key: `flip-${index}` }).replace('<button ', `<button aria-label="翻动第${index + 1}格，并带动相邻格" data-neighbors="${flipNeighbors(index).join(',')}" `)).join('')}</div></div><p class="hand-note">九格都开花，盒盖就能打开。</p></div>`;
}
