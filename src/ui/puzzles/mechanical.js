import { BELT_EDGES, PULLEYS } from '../../puzzles/belt.js';
import { FLOWER_TARGET } from '../../puzzles/flowers.js';
import { itemSprite, motif, moveButton, escape } from '../dom.js';

export const BELT_POINTS = [[8, 50], [27, 20], [27, 80], [65, 20], [48, 60], [77, 80], [92, 48]];
const polyline = (route, points) => route.map(index => points[index].join(',')).join(' ');

export function renderBelt(progress) {
  return `<div class="belt-workbench"><div class="belt-diagram"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${BELT_EDGES.map(([a, b]) => `<line x1="${BELT_POINTS[a][0]}" y1="${BELT_POINTS[a][1]}" x2="${BELT_POINTS[b][0]}" y2="${BELT_POINTS[b][1]}"/>`).join('')}<polyline class="active-thread" points="${polyline(progress.route, BELT_POINTS)}"/></svg>${BELT_POINTS.map(([x, y], index) => `<div class="pulley-node ${progress.route.includes(index) ? 'threaded' : ''}" style="left:${x}%;top:${y}%">${moveButton(`${itemSprite(6)}<small>${escape(PULLEYS[index])}</small>`, { type: 'node', index }, { key: `pulley-${index}` })}</div>`).join('')}</div><div class="mechanical-notes"><p>离开摇柄后，先过左导轮，再过张力轮。</p><p>下导轮早于挡光轮，挡光轮早于上导轮。</p><p>胶片需要向左，每转一次前进三格。</p></div><div class="mechanical-controls">${moveButton(progress.crossed ? '交叉绕线 ←' : '平行绕线 →', { type: 'cross' })}${moveButton(`步进：每次 ${progress.ratio + 1} 格`, { type: 'ratio' })}${moveButton('退回一轮', { type: 'undo' })}</div><p class="hand-note">每轮经过一次，最终回到胶片轮。</p></div>`;
}

export function renderFlowers(progress) {
  const flowers = ['daisy', 'tulip', 'lavender'];
  return `<div class="flowers-workbench"><div class="flower-stands">${progress.heights.map((height, index) => `<div class="flower-column"><div class="height-scale">${[3, 2, 1, 0].map(level => `<span>${level}</span>`).join('')}</div><div class="flower-pot" style="--height:${height}">${motif(flowers[index])}<b>${height}</b></div><div class="flower-column-foot">${moveButton(progress.pin === index ? `${itemSprite(0)}取回书签` : '放入书签', { type: 'pin', index }, { className: progress.pin === index ? 'pinned' : '', key: `pin-${index}` })}</div></div>`).join('')}</div><div class="mechanical-controls">${['左＋中', '中＋右', '左＋右'].map((label, index) => moveButton(`${itemSprite(3)}轴${index + 1} · ${label}`, { type: 'crank', index }, { key: `flower-crank-${index}` })).join('')}</div><p class="target-heights">窗上刻着的高度：${FLOWER_TARGET.join(' · ')}</p><p class="hand-note">到最高处后，下一格回到0。书签会固定住一盆；完成后挡片自动松开。</p></div>`;
}
