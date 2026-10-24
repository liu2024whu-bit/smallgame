import {atlas} from './dom.js';

// Drawn ink impressions after the schools' own cultural merchandise.
const MARKS=Object.freeze({
  nju:{index:0,label:'南京大学小蓝鲸',name:'小蓝鲸'},
  whu:{index:1,label:'武汉大学小狐狸珞珞、珈珈',name:'珞珞 · 珈珈'},
});
export function campusInk(key,className=''){
  const mark=MARKS[key];
  return mark?atlas('campusMarks',mark.index,{label:mark.label,className:`campus-ink ink-${key} ${className}`}):'';
}
export function campusStamp(key,stamped){
  const mark=MARKS[key];
  return `<button class="campus-stamp ${stamped?'stamp-pressed':''}" data-action="campus-stamp" data-id="${key}" data-focus="campus-stamp" aria-label="${stamped?'再印一枚':'盖上'}${mark.label}图章">${stamped?campusInk(key):'<span class="stamp-place" aria-hidden="true">✧</span>'}<small>${stamped?mark.name:'留个戳'}</small></button>`;
}
