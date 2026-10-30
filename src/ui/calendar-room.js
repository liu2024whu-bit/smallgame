import {GAME_DATE} from '../data/calendar.js';
import {calendarDrawer} from './calendar-props.js';
import {atlas} from './dom.js';

export function calendarRoom(state){
 const p=state.progress.calendar;
 return `<span class="world-calendar-date" aria-hidden="true"><small>${GAME_DATE.year} / ${GAME_DATE.month}</small><b>${GAME_DATE.day}</b>${p.stamped?atlas('calendarDetails',7,{className:'world-calendar-ink'}):''}</span><div class="calendar-room" aria-hidden="true"><div class="calendar-room-world">${calendarDrawer(p)}</div></div>`;
}
