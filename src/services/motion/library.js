import {ease,motionAllowed} from './shared.js';
const matrix=(root,selector)=>{const e=root.querySelector(selector);return e?getComputedStyle(e).transform:null;};
const pose=root=>({
 mode:root.querySelector('[data-library-view]')?.dataset.libraryView,
 opened:!!root.querySelector('.library-open'),
 books:new Map([...root.querySelectorAll('[data-library-book]')].map(e=>[e.dataset.libraryBook,e.getBoundingClientRect()])),
 drawer:matrix(root,'.library-drawer'),rail:matrix(root,'.library-retaining-rail'),slip:matrix(root,'.library-slip-leaf'),
});
export const libraryMotion={
 capture:pose,
 play(root,before){
  const next=pose(root);
  root.querySelectorAll('[data-library-book]').forEach(e=>{
   const old=before.books.get(e.dataset.libraryBook),r=e.getBoundingClientRect();
   if(!old||Math.abs(old.left-r.left)<1)return;
   e.animate([{translate:`${old.left-r.left}px 0`},{translate:'0 0'}],{duration:320,easing:ease});
  });
  for(const [selector,key,time]of [['.library-drawer','drawer',next.opened?520:180],['.library-retaining-rail','rail',300],['.library-slip-leaf','slip',380]]){
   const e=root.querySelector(selector);if(e&&before[key]!==null&&before[key]!==next[key])e.animate([{transform:before[key]},{transform:next[key]}],{duration:time,easing:ease});
  }
  if(before.mode&&next.mode&&before.mode!==next.mode)root.querySelector('.library-workbench')?.animate([{opacity:.65,translate:'0 4px'},{opacity:1,translate:'0 0'}],{duration:240,easing:ease});
 }
};
export function settleLibraryDrawer(drawer){
 if(!drawer?.style.transform)return;
 const before=getComputedStyle(drawer).transform;
 drawer.style.removeProperty('transform');
 if(drawer.isConnected&&motionAllowed())drawer.animate([{transform:before},{transform:getComputedStyle(drawer).transform}],{duration:180,easing:ease});
}
