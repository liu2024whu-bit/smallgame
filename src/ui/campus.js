import { ASSETS } from '../data/assets.js';
import { campusStop } from '../data/campuses.js';
import { postalMarks } from './evidence.js';
import { studyDesk } from './campus-study.js';

export function campusPanel(index, context) {
  const {campus,stop}=campusStop(index,context.view.corner);
  const stamped=context.state.activities.includes(`campus:${campus.key}`),looked=context.view.looked??false;
  const picture=stop.kind==='study'?studyDesk(context):`<div class="campus-painting" style="--look-x:${stop.x}%;--look-y:${stop.y}%"><img src="${ASSETS[stop.asset]}" alt="${campus.name}${stop.campus??''}${stop.name}实景参考绘制的折页" draggable="false"><span class="paper-fold fold-one"></span><span class="paper-fold fold-two"></span><button class="campus-landmark" data-action="campus-look" data-focus="campus-landmark" ${stop.activity?`data-activity="${stop.activity}"`:''} style="left:${stop.x}%;top:${stop.y}%" aria-label="细看${stop.name}"><span>${looked?stop.detail:'细看'}</span></button>${campus.key==='whu'?'<span class="whu-plaque">日字斋</span>':''}</div>`;
  const margin=stop.kind==='study'?'':`<div class="campus-margin"><span>${looked?stop.detail:stop.name}</span><button class="campus-stamp ${stamped?'stamp-pressed':''}" data-action="campus-stamp" data-id="${campus.key}" data-focus="campus-stamp" aria-label="收下${campus.name}折页的邮戳">${stamped?postalMarks(index,true):'<span>盖个邮戳</span>'}</button></div>`;
  return {title:campus.name,className:`campus-dialog campus-${campus.key}`,html:`<nav class="campus-ribbon" aria-label="校园折页">${campus.stops.map((entry,i)=>`<button data-action="campus-stop" data-index="${i}" data-focus="campus-stop-${i}" aria-pressed="${entry===stop}">${entry.campus?`<small>${entry.campus}</small>`:''}${entry.name}</button>`).join('')}</nav><div class="campus-foldout ${looked?'campus-looked':''}" data-campus-stop="${stop.id}">${picture}${margin}</div>`};
}
