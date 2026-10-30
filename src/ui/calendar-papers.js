import {GAME_DATE,DATE_NOTES,ANNIVERSARY_DAYS,calendarCells} from '../data/calendar.js';
import {atlas} from './dom.js';

export const calendarMark=(kind,className='')=>atlas('calendarInkMarks',{leaf:0,star:1,moon:2}[kind],{className:'calendar-mark '+className});
function month(year,month,p,held=false){
 const past=year!==GAME_DATE.year;
 return `<div class="calendar-month"><header><span>${year}</span><b>${month}月</b><small>${past?'':'今天'}</small></header><div class="calendar-week">${['日','一','二','三','四','五','六'].map(d=>`<span>${d}</span>`).join('')}</div><div class="calendar-days">${calendarCells(year,month).map(d=>`<span class="${!past&&d===GAME_DATE.day?'day-circled':''}" ${!past&&d===GAME_DATE.day?'data-calendar-today-cell':''}>${d??''}${past&&DATE_NOTES.slice(0,2).some(n=>n.day===d)?calendarMark(d===DATE_NOTES[0].day?'leaf':'star'):''}${!past&&d===GAME_DATE.day&&p.stamped?atlas('calendarDetails',7,{className:'calendar-ink'}):''}${!past&&d===GAME_DATE.day&&held?'<button class="calendar-stamp-place" data-calendar-stamp data-focus="calendar-stamp-place" aria-label="在今天留下小星星"></button>':''}</span>`).join('')}</div>${past?`<footer class="calendar-key"><span>${calendarMark('leaf')}旧页</span><span>${calendarMark('star')}来信</span></footer>`:''}</div>`;
}
export function calendarPaper(note,p){
 if(note===0)return month(DATE_NOTES[0].year,DATE_NOTES[0].month,p);
 if(note===1)return `<div class="calendar-counter">${calendarMark('star')}<span>来信纪念</span><strong>${ANNIVERSARY_DAYS.qq}<small>天</small></strong><p>${GAME_DATE.iso.replaceAll('-','.')}</p><footer>从 2028.02.19 起</footer></div>`;
 if(note===2)return `<div class="calendar-lunar">${calendarMark('moon')}<span>月签 · 六月</span><strong>十五</strong><footer>纸边的日数</footer></div>`;
 return month(GAME_DATE.year,GAME_DATE.month,p,p.held);
}
export const calendarNoteLabel=index=>index<0?'今天':DATE_NOTES[index].title;
