import { achievements, canOpenEncore } from '../core/achievements.js';
import { RECORD_DISPLAY } from '../data/record-display.js';
import { ASSETS } from '../data/assets.js';
import { ENCORE_HANDLE } from '../data/mechanism-layouts.js';
import { motif, escape, character, itemSprite } from './dom.js';

function memento(kind) {
  const art={
    postcards:()=>`<span class="record-postcards">${character('campuses',0,2,1,'武汉折页')}${character('campuses',1,2,1,'南京折页')}</span>`,
    xianlin:()=>`<span class="record-campus"><img src="${ASSETS.campusXianlin}" alt="杜厦图书馆" draggable="false"></span>`,
    flowers:()=>`<span class="record-flowers">${['daisy','tulip','lavender'].map(id=>motif(id)).join('')}</span>`,
    charm:()=>character('giftsMore',7,3,3,'小黑猫挂件'),
    ticket:()=>'<span class="record-ticket"><small>再放一遍</small><b>Ⅱ</b><i>入场</i></span>',
    bookmark:()=>itemSprite(0),
    sketch:()=>`<span class="record-sketch">${motif('leaf')}<i></i></span>`,
  };
  return art[kind]?.()??motif(kind);
}
function destination(entry) {
  const display=RECORD_DISPLAY[entry.id];
  const attrs=Object.entries(display).filter(([key])=>['id','index','tab'].includes(key)).map(([key,value])=>`data-${key}="${value}"`).join(' ');
  return `<button class="text-button" data-action="${display.action}" ${attrs}>再去看看</button>`;
}
export function achievementsPage(state, view={}) {
  const entries=achievements(state),selected=entries.find(entry=>entry.id===view.record);
  const detail=selected?`<div class="record-inscription" aria-live="polite"><h3>${escape(selected.title)}</h3><p>${escape(selected.complete?selected.text:selected.intro+' '+selected.hint)}</p><div><small>${selected.hideCount?(selected.complete?'收好了':'慢慢找'):`${selected.count} / ${selected.total}`}</small>${destination(selected)}</div></div>`:'<p class="record-caption">随手夹着，慢慢翻。</p>';
  return `<div class="records-folio ${view.recordSide==='right'?'records-right':''}"><img src="${ASSETS.recordsFolio}" alt="夹着小物的手账" draggable="false">${entries.map(entry=>{const d=RECORD_DISPLAY[entry.id];return `<button class="record-token ${entry.complete?'record-complete':''} ${selected?.id===entry.id?'record-selected':''}" data-action="record-detail" data-id="${entry.id}" data-focus="record-${entry.id}" aria-pressed="${selected?.id===entry.id}" aria-label="${entry.title}，${entry.complete?'已收好':'还有没翻到的'}" data-record-page="${d.x>50?'right':'left'}" style="--x:${d.x};--y:${d.y}%;--tilt:${d.angle}deg"><span class="record-object">${memento(d.kind)}</span><span class="record-label">${escape(entry.title)}</span>${entry.complete?'<i class="record-stitch" aria-hidden="true"></i>':''}</button>`;}).join('')}</div><nav class="record-pagination" aria-label="小记翻页">${['left','right'].map((side,i)=>`<button data-action="record-page" data-id="${side}" data-focus="record-page-${side}" aria-pressed="${(view.recordSide??'left')===side}">${i?'后页':'前页'}</button>`).join('')}</nav>${detail}${canOpenEncore(state)?`<button class="encore-envelope" data-action="encore">${motif('envelope')}<span>还有一页</span></button>`:entries.every(entry=>entry.complete)?'<p class="record-footnote">等生日那页翻过，再回来看看。</p>':''}`;
}
export function encorePanel(context) {
  if(!canOpenEncore(context.state))return {title:'这一页',className:'inspect-dialog',html:'<p class="empty-note">还没翻到这里。</p>'};
  const wind=Math.max(0,Math.min(720,context.view.wind??0)),ready=wind>=360;
  return {title:'下次见',className:'encore-dialog',html:`<div class="paper-theatre ${context.view.letter&&ready?'theatre-letter-shown':''} ${ready?'theatre-awake':''}" data-encore-wind="${wind}" style="--warm:${Math.min(1,wind/360)}"><img src="${ASSETS.encoreTheatre}" alt="窗边展开的纸艺花园" draggable="false"><div class="theatre-light" aria-hidden="true"></div><button class="encore-handle" data-encore-handle data-action="encore-wind" data-focus="encore-handle" aria-label="转动纸景的摇柄，也可以拖动，或用左右方向键" style="left:${ENCORE_HANDLE.x}%;top:${ENCORE_HANDLE.y}%;width:${ENCORE_HANDLE.width}%;--pivot-x:${ENCORE_HANDLE.pivotX*100}%;--pivot-y:${ENCORE_HANDLE.pivotY*100}%;--wind:${wind}deg">${itemSprite(3)}</button><button class="theatre-envelope" data-action="encore-letter" data-focus="encore-letter" aria-label="${ready?'拆开信封':'信封还封着'}" ${ready?'':'disabled'}></button>${ready?`<button class="theatre-cat" aria-label="花丛里的小黑">${character('heiCat',0,2,2,'小黑')}${character('heiCat',1,2,2,'眨眼的小黑','cat-blink')}</button>`:''}</div>${context.view.letter&&ready?'<div class="encore-letter"><p>都找到了呀。</p><p>下次一起看电影，或者随便逛逛。<br>有新画也记得发给我看。</p><p>生日快乐，LXY。</p><button class="text-button" data-action="close">好</button></div>':''}`};
}
