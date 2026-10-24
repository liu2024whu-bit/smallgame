// Confirmed dates. The lunar birthday is intentionally not converted into the story's solar date.
export const GAME_DATE=Object.freeze({year:2026,month:10,day:29,iso:'2026-10-29'});
export const DATE_NOTES=Object.freeze([
  {id:'meeting',mark:'leaf',title:'初见',year:null,month:9,day:1,date:'9月1日',line:'认识的那一天。'},
  {id:'qq',mark:'star',title:'好友',year:2020,month:9,day:12,date:'2020年9月12日',line:'加上了 QQ 好友。'},
  {id:'lunar',mark:'moon',title:'月亮',year:null,month:9,day:8,date:'农历九月初八',line:'月亮也记着你的生日。'},
]);
export const DATE_CODE=Object.freeze(DATE_NOTES.flatMap(note=>[...String(note.day).padStart(2,'0')].map(Number)));
export const CALENDAR_LAYOUT=Object.freeze({page:[26.5,21,47,40],wheels:[29.5,67.8,42,8.1],latch:[46,78,8.5,6.5]});
export function calendarCells(year=GAME_DATE.year,month=GAME_DATE.month){
  const first=new Date(Date.UTC(year,month-1,1)).getUTCDay();
  const length=new Date(Date.UTC(year,month,0)).getUTCDate();
  return [...Array(first).fill(null),...Array.from({length},(_,i)=>i+1)];
}
