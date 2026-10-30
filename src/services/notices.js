import {character,icon,escape,announce} from '../ui/dom.js';
import {journalUpdates} from '../core/journal-updates.js';
import {RECORD_DISPLAY} from '../data/record-display.js';

// The host follows the active dialog into the browser's modal top layer.
// A notice never steals focus or changes the player's current puzzle.
export function createNotices({host,root,dialog,openPanel}){
 let timer;
 const delay=()=>{clearTimeout(timer);if(!host.hidden)timer=setTimeout(clear,host.classList.contains('journal-notice')?8000:3500);};
 const sync=()=>{
  const header=dialog.open&&host.classList.contains('journal-notice')?dialog.querySelector('.dialog-header'):null,parent=header??(dialog.open?dialog:root);
  if(host.parentElement!==parent){if(header)header.insertBefore(host,header.lastElementChild);else parent.append(host);}
 };
 const clear=()=>{clearTimeout(timer);host.hidden=true;host.replaceChildren();};
 function show(text,{gift=null,panel=null,label='翻开看看'}={}){
  clear();host.classList.toggle('journal-notice',!!panel);sync();
  host.innerHTML=`${gift?`<span class="notice-object" aria-hidden="true">${character(gift.asset,gift.index,gift.columns,gift.rows,'')}</span>`:''}<span class="notice-message">${escape(text)}</span>${panel?`<button type="button" class="notice-open">${escape(label)}${icon('book')}</button><button type="button" class="notice-dismiss" aria-label="收起提示">${icon('close')}</button>`:''}`;
  host.hidden=false;
  host.querySelector('.notice-open')?.addEventListener('click',()=>{clear();openPanel(panel);});
  host.querySelector('.notice-dismiss')?.addEventListener('click',clear);
  delay();announce(text);
 }
 function arrival(before,after){
  const {gifts,clues,evidence,collections,records}=journalUpdates(before,after);
  const gift=gifts[0],record=records[0],notes=[...clues,...evidence,...collections].map(n=>n.title),names=[...gifts.map(g=>g.name),...notes];
  if(!names.length&&!record)return false;
  const text=names.length===1?`${names[0]}，记在手账里了。`:names.length?`手账添了${names.map(n=>`「${n}」`).join('、')}。`:'';
  if(record){
   const right=RECORD_DISPLAY[record.id]?.x>50;
   show(`${text}${records.map(r=>`小记「${r.title}」完成了。`).join('')}`,{gift,panel:{type:'journal',tab:'activities',view:{record:record.id,recordSide:right?'right':'left',recordExtra:!!record.extra}},label:'看看小记'});
  }else if(clues.length||evidence.length)show(text,{gift,panel:{type:'journal',tab:'clues'},label:'看看线索'});
  else if(collections.length)show(text,{gift,panel:{type:'journal',tab:'collections'}});
  else show(text,{gift,panel:{type:'keepsake',id:gift.id}});
  return true;
 }
 host.addEventListener('pointerenter',()=>clearTimeout(timer));
 host.addEventListener('pointerleave',()=>{if(!host.contains(host.ownerDocument.activeElement))delay();});
 host.addEventListener('focusin',()=>clearTimeout(timer));
 host.addEventListener('focusout',()=>queueMicrotask(()=>{if(!host.contains(host.ownerDocument.activeElement)&&!host.matches(':hover'))delay();}));
 return {show,sync,clear,arrival};
}
