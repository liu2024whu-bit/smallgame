// Fictional prop dates; no real person's anniversary is used.
export const GAME_DATE=Object.freeze({year:2032,month:6,day:15,iso:'2032-06-15'});
export const DATE_NOTES=Object.freeze([
 {id:'meeting',mark:'leaf',title:'旧页',year:2028,month:2,day:4,date:'2028年2月4日',line:'小屋第一次启封。'},
 {id:'qq',mark:'star',title:'来信',year:2028,month:2,day:19,date:'2028年2月19日',line:'一封信，留在这一页。'},
 {id:'lunar',mark:'moon',title:'月签',year:null,month:6,day:15,date:'月签 · 第十五页',line:'月亮把日数留在页边。'},
]);
export function elapsedCalendarDays(start,end=GAME_DATE){
 const midnight=({year,month,day})=>{const n=Date.UTC(year,month-1,day),d=new Date(n);if(![year,month,day].every(Number.isInteger)||year<1000||year>9999||d.getUTCFullYear()!==year||d.getUTCMonth()!==month-1||d.getUTCDate()!==day)throw new RangeError('Invalid calendar date');return n;};
 return (midnight(end)-midnight(start))/86400000;
}
export const ANNIVERSARY_DAYS=Object.freeze(Object.fromEntries(DATE_NOTES.filter(n=>n.year!==null).map(n=>[n.id,elapsedCalendarDays(n)+1])));
export const DATE_CODE=Object.freeze([...String(ANNIVERSARY_DAYS.meeting).padStart(4,'0'),...String(DATE_NOTES[2].day).padStart(2,'0')].map(Number));
export const LEGACY_DATE_CODE=Object.freeze([0,4,1,9,1,5]);
export function calendarCells(year=GAME_DATE.year,month=GAME_DATE.month){return [...Array(new Date(Date.UTC(year,month-1,1)).getUTCDay()).fill(null),...Array.from({length:new Date(Date.UTC(year,month,0)).getUTCDate()},(_,i)=>i+1)];}
