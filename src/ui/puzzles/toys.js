import { mazeEdges, MAZE_STARS } from '../../puzzles/maze.js';
import { panWeights, WEIGHT_LABELS } from '../../puzzles/balance.js';
import { DRAWER_CONDITIONS, drawerEnabled } from '../../puzzles/drawers.js';
import { flipNeighbors } from '../../puzzles/flips.js';
import { dial, escape, motif, moveButton } from '../dom.js';

function mazePoint(node) {
  const ring = Math.floor(node / 6);
  const angle = Math.PI + (node % 6) * Math.PI / 3;
  const radius = [166, 112, 58][ring];
  return [210 + Math.cos(angle) * radius, 210 + Math.sin(angle) * radius];
}

export function renderMaze(progress) {
  return `<div class="maze-workbench"><svg class="ring-maze" viewBox="0 0 420 420" aria-label="三层轨道，入口在左侧，出口在右侧内圈">${[166, 112, 58].map(radius => `<circle class="maze-guide" cx="210" cy="210" r="${radius}"/>`).join('')}${mazeEdges(progress.turns).map(([a, b]) => {
    const from = mazePoint(a), to = mazePoint(b);
    if (Math.floor(a / 6) !== Math.floor(b / 6)) return `<path class="maze-track" d="M${from} L${to}"/>`;
    const radius = [166, 112, 58][Math.floor(a / 6)];
    return `<path class="maze-track" d="M${from} A${radius} ${radius} 0 0 1 ${to}"/>`;
  }).join('')}${MAZE_STARS.map(node => { const [x, y] = mazePoint(node); return `<text class="maze-star" x="${x}" y="${y + 7}" text-anchor="middle">✦</text>`; }).join('')}<circle class="maze-start" cx="44" cy="210" r="7"/><circle class="maze-end" cx="268" cy="210" r="7"/><text x="12" y="190">入</text><text x="281" y="215">出</text></svg><div class="dial-row">${progress.turns.map((turn, index) => dial(index, turn, ['外圈', '中圈', '内圈'][index], 6)).join('')}</div><p class="hand-note">星星固定在框上。沿同一条连续路线经过它们即可，允许等价铺法。</p></div>`;
}

export function renderBalance(progress) {
  const [left, right] = panWeights(progress.places);
  const lean = Math.sign(left - right) * 7;
  const motifs = ['paw', 'star', 'rose', 'moon'];
  return `<div class="balance-workbench"><div class="weight-examples"><p>${motif('paw')}＝${motif('leaf')}${motif('leaf')}</p><p>${motif('star')}＝${motif('paw')}＋${motif('leaf')}</p><p>${motif('rose')}＝${motif('star')}＋${motif('leaf')}</p><p>${motif('moon')}＝${motif('rose')}＋${motif('leaf')}</p></div><div class="scale-apparatus" style="--lean:${lean}deg"><div class="scale-beam"></div><div class="scale-post"></div><div class="scale-pan left-pan">${progress.places.map((place, i) => place === 1 ? motif(motifs[i]) : '').join('')}</div><div class="scale-pan right-pan">${progress.places.map((place, i) => place === 2 ? motif(motifs[i]) : '').join('')}</div></div><div class="weight-tray">${progress.places.map((place, index) => moveButton(`${motif(motifs[index])}<span>${escape(WEIGHT_LABELS[index])}</span><small>${['桌上', '左盘', '右盘'][place]}</small>`, { type: 'place', index }, { key: `weight-${index}` })).join('')}</div><p class="hand-note">每边两枚。点击摆件：桌上 → 左盘 → 右盘。</p></div>`;
}

export function renderDrawers(progress) {
  return `<div class="drawers-workbench"><div class="drawer-chest">${progress.open.map((open, index) => `<div class="drawer-unit ${open ? 'drawer-open' : ''} ${drawerEnabled(progress.open, index) ? 'drawer-free' : ''}">${moveButton(`<span class="drawer-letter">${String.fromCharCode(65 + index)}</span><span class="drawer-handle"></span><small>${open ? '打开' : '关闭'}</small>`, { type: 'drawer', index }, { key: `drawer-${index}` })}</div>`).join('')}</div><div class="drawer-clues">${DRAWER_CONDITIONS.map(condition => `<p>${escape(condition)}</p>`).join('')}</div><p class="hand-note">目标：A关、B关、C开、D开。打不开时，观察旁边的挡片条件。</p></div>`;
}

export function renderFlips(progress) {
  return `<div class="flips-workbench"><div class="flip-grid">${progress.tiles.map((tile, index) => moveButton(tile ? motif('leaf') : motif('rose'), { type: 'flip', index }, { className: `flip-tile ${tile ? 'tile-back' : 'tile-flower'}`, key: `flip-${index}` }).replace('<button ', `<button aria-label="翻动第${index + 1}格，并带动相邻格" data-neighbors="${flipNeighbors(index).join(',')}" `)).join('')}</div><p class="hand-note">每片带动自己与上下左右相邻片。九格都开花时，盒盖会松开。</p></div>`;
}
