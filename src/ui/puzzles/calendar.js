import {viewControl} from '../view-control.js';
import {CALENDAR_CAMERAS,calendarCamera} from '../../data/calendar-apparatus.js';
import {calendarModel} from '../calendar-props.js';
export function renderCalendar(p,{view={}}){
 const mode=calendarCamera(view),held=!!view.calendarStamp&&!p.shut&&!p.stamped,note=held?-1:Number.isInteger(view.dateNote)?view.dateNote:-1;
 const camera=CALENDAR_CAMERAS[mode];
 const modes=[['whole','桌边'],['paper','纸页'],['lock','字轮'],...(p.opened&&!p.shut?[['drawer','屉里']]:[])];
 return `<div class="calendar-workbench"><div class="calendar-viewport" style="--calendar-aspect:${camera[2]/camera[3]}"><div class="calendar-world" data-source-camera="${camera}">${calendarModel(p,{mode,note,held})}</div></div><nav class="calendar-navigation" aria-label="日历取景">${modes.map(([id,title])=>`${viewControl(`${title}`,`data-calendar-view="${id}" data-focus="calendar-view-${id}" aria-current="${mode===id}"`)}`).join('')}${held?viewControl(`放回去`,`data-calendar-return`):''}</nav><p class="calendar-status" role="status">${held?'今天旁边，还空着一点地方。':p.stamped?'这一天，有颗小星星。':p.opened?(p.shut?'':mode==='drawer'?'':'抽屉里，有枚小印章。'):p.attempts?'还扣着呢。':''}</p><span class="sr-only">纸签可以翻页。字轮支持拖动、上下方向键与数字输入，左右方向键换轮。抽屉把手可以拉动或按下。小印章可以拿起，在今天的纸页留下星星，Esc 会放回。</span></div>`;
}
