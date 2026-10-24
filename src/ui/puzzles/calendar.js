import { GAME_DATE,DATE_NOTES,CALENDAR_LAYOUT,calendarCells } from '../../data/calendar.js';
import { character,moveButton,icon,escape } from '../dom.js';

const rect=([x,y,w,h])=>`left:${x}%;top:${y}%;width:${w}%;height:${h}%;`;
function today(){
  return `<div class="calendar-month" data-copy-group><header><span>${GAME_DATE.year}</span><b>${GAME_DATE.month}月</b><small>今天</small></header><div class="calendar-week">${['日','一','二','三','四','五','六'].map(day=>`<span>${day}</span>`).join('')}</div><div class="calendar-days">${calendarCells().map(day=>`<span class="${day===GAME_DATE.day?'day-circled':''}">${day??''}</span>`).join('')}</div></div>`;
}
function note(index){
  const n=DATE_NOTES[index];
  return `<div class="calendar-memo"><span class="calendar-note-mark">${icon(n.mark)}</span><p>${n.year?n.year+' · 九月':n.id==='lunar'?'农历 · 九月':'九月'}</p><h3>${n.id==='lunar'?'初八':String(n.day).padStart(2,'0')}</h3><span class="calendar-note-name">${escape(n.title)}</span><p class="calendar-note-line">${escape(n.line)}</p></div>`;
}
export function renderCalendar(progress,context){
  const active=Number.isInteger(context.view.dateNote)?context.view.dateNote:-1;
  return `<div class="calendar-apparatus ${progress.opened?'calendar-open':''}" data-password-lock="number" data-attempts="${progress.attempts}">${character('calendar',0,1,1,'窗边木日历和黄铜小抽屉','calendar-painting')}<div class="calendar-paper" style="${rect(CALENDAR_LAYOUT.page)}">${active>=0&&active<3?note(active):today()}</div><div class="calendar-clips" aria-label="夹在日历里的三张纸签">${DATE_NOTES.map((n,index)=>`<button data-action="calendar-note" data-index="${index}" data-focus="date-note-${index}" aria-label="翻看${n.title}纸签" aria-pressed="${active===index}">${icon(n.mark)}</button>`).join('')}<button class="calendar-today" data-action="calendar-note" data-index="-1" aria-label="翻回今天的日历">29</button></div><div class="calendar-wheels" data-copy-group style="${rect(CALENDAR_LAYOUT.wheels)}">${progress.values.map((value,index)=>`<div class="date-wheel"><span class="date-pair-mark" aria-hidden="true">${index%2===0?icon(DATE_NOTES[index/2].mark):''}</span>${moveButton(`<span class="wheel-previous">${(value+9)%10}</span><b>${value}</b><span class="wheel-next">${(value+1)%10}</span>`,{type:'cursor',index},{className:'wheel-drum',key:`number-${index}`}).replace('<button ',`<button data-lock-digit="${index}" aria-label="第${index+1}轮，当前${value}，可拖动或直接输入" `)}</div>`).join('')}</div>${moveButton('<span class="sr-only">拉开日历的小抽屉</span>',{type:'submit'},{className:'calendar-latch',key:'calendar-latch'}).replace('<button ',`<button style="${rect(CALENDAR_LAYOUT.latch)}" `)}${progress.opened?`<div class="calendar-secret"><span>${icon('star')}</span><p>这一页，从九月开始。</p><small>后来，还有好多天。</small></div>`:''}</div><p class="calendar-reply" role="status">${progress.opened?'':progress.attempts?'抽屉轻轻弹回。':'三张纸签，都夹在这里。'}</p>`;
}
