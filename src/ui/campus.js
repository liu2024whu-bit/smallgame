import { ASSETS } from '../data/assets.js';
import { postalMarks } from './evidence.js';

// Named features follow public WHU/NJU photographs. Puzzle postmarks live on
// the paper margin, never on real buildings, plaques or campus maps.
const CAMPUSES = [
  { key:'whu', name:'武汉大学', asset:'campusWhu', feature:'老斋舍', detail:'红窗与石阶', x:30, y:43 },
  { key:'nju', name:'南京大学', asset:'campusNju', feature:'北大楼', detail:'藤蔓与屋脊', x:50, y:40 },
];
export function campusPanel(index, context) {
  const campus = CAMPUSES[index] ?? CAMPUSES[0];
  const stamped = context.state.activities.includes(`campus:${campus.key}`);
  const looked = context.view.looked ?? false;
  return { title:campus.name, className:`campus-dialog campus-${campus.key}`, html:`<div class="campus-foldout ${looked ? 'campus-looked' : ''}"><div class="campus-painting"><img src="${ASSETS[campus.asset]}" alt="${campus.name}${campus.feature}实景参考绘制的折页" draggable="false"><span class="paper-fold fold-one"></span><span class="paper-fold fold-two"></span><button class="campus-landmark" data-action="campus-look" style="left:${campus.x}%;top:${campus.y}%" aria-label="细看${campus.feature}"><span>${looked ? campus.feature : '细看'}</span></button>${campus.key === 'whu' ? '<span class="whu-plaque">日字斋</span>' : ''}</div><div class="campus-margin"><span>${looked ? campus.detail : campus.feature}</span><button class="campus-stamp ${stamped ? 'stamp-pressed' : ''}" data-action="campus-stamp" data-id="${campus.key}" aria-label="收下${campus.name}折页的邮戳">${stamped ? postalMarks(index,true) : '<span>盖个邮戳</span>'}</button></div></div>` };
}
