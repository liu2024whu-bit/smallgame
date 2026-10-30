import {GAME_DATE} from '../data/calendar.js';
import {CALENDAR_PAGE,CALENDAR_WHEELS,CALENDAR_DRAWER,CALENDAR_FRONT,CALENDAR_STAMP,CALENDAR_TABS,calendarRect as at} from '../data/calendar-apparatus.js';
import {calendarPaper,calendarMark,calendarNoteLabel} from './calendar-papers.js';
import {atlas,escape} from './dom.js';

export function calendarDrawer(p,{interactive=false,held=false}={}){
 const [x,y,w,h]=CALENDAR_DRAWER,closed=!p.opened||p.shut;
 const stamp=!held?`<${interactive&&!closed?'button':'span'} class="calendar-stamp" style="${at(CALENDAR_STAMP.map((v,i)=>i===0?v-x:i===1?v-y:v))}" ${interactive&&!closed?'data-calendar-pick data-focus="calendar-stamp" aria-label="拿起小星星印章"':''}>${atlas('calendarDetails',4)}</${interactive&&!closed?'button':'span'}>`:'';
 return `<span class="calendar-recess" style="${at([x,y,w,65])}">${atlas('calendarDrawerParts',0)}</span><div class="calendar-drawer-clip" data-calendar-drawer-clip style="${at([x,y,w,closed?CALENDAR_FRONT:h])}"><div class="calendar-drawer-body" data-calendar-drawer-body style="height:${h}px;transform:translateY(${closed?-h+CALENDAR_FRONT:0}px)">${atlas('calendarDrawerParts',1)}${stamp}</div></div>`;
}
function wheels(p,interactive){
 return CALENDAR_WHEELS.map((r,i)=>{
  const n=p.values[i],tag=interactive&&!p.opened?'button':'span',[x,y,w,h]=r;
  const strip=Array.from({length:31},(_,k)=>`<b ${k===10+n?'':'data-copy-hidden'}>${k%10}</b>`).join('');
  return `<${tag} class="calendar-wheel" style="${at([x,y-22,w,h+44])}" data-calendar-wheel="${i}" ${tag==='button'?`data-focus="calendar-number-${i}" role="slider" aria-label="第${i+1}枚字轮" aria-valuemin="0" aria-valuemax="9" aria-valuenow="${n}" aria-orientation="vertical"`:''}>${atlas('calendarDetails',8,{style:'height:'+h+'px;top:22px;'})}<span class="calendar-number-window"><span data-calendar-number style="--digit:${n}" aria-hidden="true">${strip}</span></span></${tag}>`;
 }).join('');
}
export function calendarModel(p,{mode='whole',note=-1,held=false,passive=false}={}){
 const paper=['whole','paper'].includes(mode),lock=['whole','lock'].includes(mode),open=p.opened&&!p.shut,tabActive=paper&&!held&&!passive;
 const tabs=CALENDAR_TABS.map(({index,rect},i)=>`<${tabActive?'button':'span'} class="calendar-tab" style="${at(rect)}" ${tabActive?`data-calendar-note="${index}" data-focus="calendar-note-${index}" aria-label="翻到${calendarNoteLabel(index)}" aria-pressed="${note===index}"`:''}>${atlas('calendarDetails',i)}${index===-1?'<b>${GAME_DATE.day}</b>':''}</${tabActive?'button':'span'}>`).join('');
 const grab=!passive&&(lock||mode==='drawer')?`<button class="calendar-pull" data-calendar-pull data-focus="calendar-pull" style="${at([700,closedPullY(open),140,80])}" aria-label="${open?'合回小抽屉':'拉开小抽屉'}"></button>`:'';
 return `<div class="calendar-model" data-calendar-model data-calendar-pose='${escape(JSON.stringify(p))}' data-calendar-note-state="${note}" data-calendar-mode="${mode}" data-calendar-held="${held}">${atlas('calendar',0,{columns:1,rows:1,className:'calendar-painting'})}<div class="calendar-tabs">${tabs}</div><div class="calendar-paper" style="${at(CALENDAR_PAGE)}" data-copy-group>${calendarPaper(note,{...p,held})}</div><span class="calendar-group leaf-group">${calendarMark('leaf')}<small>天</small></span><span class="calendar-group moon-group">${calendarMark('moon')}</span>${wheels(p,!passive&&lock&&!held)}${calendarDrawer(p,{interactive:!passive&&['whole','drawer'].includes(mode),held})}${grab}${held?`<span class="calendar-held-stamp" data-calendar-held-stamp>${atlas('calendarDetails',5)}</span>`:''}</div>`;
}
const closedPullY=open=>open?CALENDAR_DRAWER[1]+CALENDAR_DRAWER[3]-72:CALENDAR_DRAWER[1]-8;
