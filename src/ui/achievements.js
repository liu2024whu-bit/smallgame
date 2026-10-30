import { achievements, canOpenEncore } from '../core/achievements.js';
import {campusInk} from './campus-marks.js';
import { RECORD_DISPLAY } from '../data/record-display.js';
import { ASSETS } from '../data/assets.js';
import { motif, escape, character, itemSprite,icon } from './dom.js';
import {sceneOpen} from '../core/exploration.js';

function memento(kind,state) {
  const art={
    postcards:()=>`<span class="record-postcards">${['whu','nju'].map((key,i)=>`<span class="record-card">${character('campuses',i,2,1,i?'南京折页':'武汉折页')}${state.activities.includes(`campus:${key}`)?campusInk(key):''}</span>`).join('')}</span>`,
    xianlin:()=>`<span class="record-campus"><img src="${ASSETS.campusXianlin}" alt="杜厦图书馆" draggable="false"></span>`,
    flowers:()=>`<span class="record-flowers">${['daisy','tulip','lavender'].map(id=>motif(id)).join('')}</span>`,
    charm:()=>character('giftsMore',7,3,3,'小黑猫挂件'),
    ticket:()=>'<span class="record-ticket"><small>再放一遍</small><b>Ⅱ</b><i>入场</i></span>',
    bookmark:()=>itemSprite(0),
    birthdayCard:()=>itemSprite({asset:'giftCard',index:0}),
    sketch:()=>`<span class="record-sketch">${motif('leaf')}<i></i></span>`,
  };
  return art[kind]?.()??motif(kind);
}
function destination(entry,state) {
  const display=RECORD_DISPLAY[entry.id];
  const attrs=Object.entries(display).filter(([key])=>['id','index','tab'].includes(key)).map(([key,value])=>`data-${key}="${value}"`).join(' ');
  const open=display.action!=='scene'||sceneOpen(state,display.id);
  return `<button class="text-button" data-action="${display.action}" ${attrs} ${open?'':'disabled'}>${open?'再去看看':'那扇门还没开'}</button>`;
}
function extraLeaves(entries,selected){
 return `<div class="records-extra-leaves"><img src="${ASSETS.recordsExtras}" alt="手账的夹页，左边画着清河的两位故人，右边是小屋里的琴" draggable="false">${entries.map((entry,i)=>`<button class="record-extra-token ${selected?.id===entry.id?'record-selected':''}" data-action="record-detail" data-id="${entry.id}" data-focus="record-${entry.id}" aria-pressed="${selected?.id===entry.id}" aria-label="${entry.title}，${entry.complete?'已完成':entry.count+' / '+entry.total}" style="--extra-x:${i?72:30}%"><span class="record-extra-caption"><span>${escape(entry.title)}</span><small>${entry.complete?`${icon('check')}已记下`:entry.count+' / '+entry.total}</small></span></button>`).join('')}</div>`;
}
export function achievementsPage(state, view={}) {
  const all=achievements(state),entries=all.filter(e=>!e.extra),extras=all.filter(e=>e.extra),extraReady=sceneOpen(state,'rain')||sceneOpen(state,'birthday'),extra=extraReady&&!!view.recordExtra;
  const selected=all.find(entry=>entry.id===view.record),shown=extra?extras:entries;
  const detail=selected?`<h3>${escape(selected.title)}</h3><p>${escape(selected.complete?selected.text:selected.intro)}</p>${selected.complete?'':`<p class="record-pencilled">${escape(selected.hint)}</p>`}<div class="record-detail-actions"><small>${selected.hideCount?(selected.complete?'一直留着':'还在找'):`${selected.count} / ${selected.total}`}</small>${destination(selected,state)}</div>`:`<h3>${extra?'夹页里的':'随手记下的'}</h3><p>${extra?'随手添的两幅画。':'有些小事，值得留一笔。'}</p><small>${shown.filter(entry=>entry.complete).length} / ${shown.length}</small>`;
  const ordinary=`<div class="records-folio ${view.recordSide==='right'?'records-right':''}"><img src="${ASSETS.recordsFolio}" alt="夹着小物的手账" draggable="false">${entries.map(entry=>{const d=RECORD_DISPLAY[entry.id];return `<button class="record-token ${entry.complete?'record-complete':''} ${selected?.id===entry.id?'record-selected':''}" data-action="record-detail" data-id="${entry.id}" data-focus="record-${entry.id}" aria-pressed="${selected?.id===entry.id}" aria-label="${entry.title}，${entry.complete?'已记下':'还有没翻到的'}" data-record-page="${d.x>50?'right':'left'}" style="--x:${d.x};--y:${d.y}%;--tilt:${d.angle}deg"><span class="record-object">${memento(d.kind,state)}</span><span class="record-label">${escape(entry.title)}</span>${entry.complete?'<i class="record-stitch" aria-hidden="true"></i>':''}</button>`;}).join('')}</div>`;
  return `<div class="records-desk" data-record-extra="${extra}"><div class="records-pages">${extra?extraLeaves(extras,selected):ordinary}${!extra?`<nav class="record-pagination" aria-label="小记翻页">${['left','right'].map((side,i)=>`<button data-action="record-page" data-id="${side}" data-focus="record-page-${side}" aria-pressed="${(view.recordSide??'left')===side}">${i?'后页':'前页'}</button>`).join('')}</nav>`:''}${extraReady?`<nav class="record-leaf-nav" aria-label="小记夹页"><button class="quiet-button" data-action="record-extra" aria-pressed="${extra}">${icon(extra?'left':'right')}${extra?'前面的小记':'还有两张小画'}</button></nav>`:''}</div><aside class="record-margin"><div class="record-inscription" data-record-detail="${selected?.id??''}" aria-live="polite">${detail}</div>${canOpenEncore(state)?`<button class="encore-envelope" data-action="encore">${motif('envelope')}<span>还有封信</span></button>`:entries.every(entry=>entry.complete)?'<p class="record-footnote">过完生日，再回来看看吧。</p>':''}</aside></div>`;
}
