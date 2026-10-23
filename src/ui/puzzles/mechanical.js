import { BELT_EDGES, PULLEYS } from '../../puzzles/belt.js';
import { character, moveButton, escape } from '../dom.js';

export const BELT_POINTS = [[21.5,47.4],[31.3,23.8],[31,70.7],[63.2,25.6],[49.3,54.6],[71.8,70.2],[83.3,47.2]];
const polyline = (route,points) => route.map(index=>points[index].join(',')).join(' ');

export function renderBelt(progress) {
  return `<div class="belt-workbench"><div class="belt-diagram">${character('projector',0,1,1,'放映机打开的侧板','projector-painting')}<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${BELT_EDGES.map(([a,b])=>`<line x1="${BELT_POINTS[a][0]}" y1="${BELT_POINTS[a][1]}" x2="${BELT_POINTS[b][0]}" y2="${BELT_POINTS[b][1]}"/>`).join('')}<polyline class="active-thread" points="${polyline(progress.route,BELT_POINTS)}"/></svg>${BELT_POINTS.map(([x,y],index)=>`<div class="pulley-node ${progress.route.includes(index)?'threaded':''}" style="left:${x}%;top:${y}%">${moveButton(`<i class="thread-grip"></i><small>${escape(PULLEYS[index])}</small>${progress.route.includes(index)?`<b>${progress.route.indexOf(index)+1}</b>`:''}`,{type:'node',index},{key:`pulley-${index}`})}</div>`).join('')}<div class="belt-gear">${moveButton(`${progress.ratio+1}<small>格</small>`,{type:'ratio'},{key:'belt-ratio'})}</div><div class="belt-cross">${moveButton(progress.crossed?'╳':'∥',{type:'cross'},{key:'belt-cross'})}<small>绕法</small></div></div><div class="mechanical-notes"><p>摇柄 → 左导轮 → 张力轮</p><p>下导轮 → 挡光轮 → 上导轮</p><p>胶片向左，每次三格。</p></div><div class="mechanical-controls">${moveButton('退一轮',{type:'undo'})}</div><span class="sr-only">沿着轮心拖线，也可以逐个点。</span></div>`;
}
