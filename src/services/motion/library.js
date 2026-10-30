import {ease,motionAllowed} from './shared.js';
import {paintLibraryDrawer} from '../../ui/library-drawer.js';
const matrix=(root,selector)=>{const e=root.querySelector(selector);return e?getComputedStyle(e).transform:null;};
const drawerPose=root=>new Map([...root.querySelectorAll('.library-drawer [data-light-plane]')].map(e=>[e.dataset.lightPlane,getComputedStyle(e).transform]));
function animateDrawer(root,before,duration){
 root.querySelectorAll('.library-drawer [data-light-plane]').forEach(e=>{
  const old=before.get(e.dataset.lightPlane),next=getComputedStyle(e).transform;
  if(old&&old!==next)e.animate([{transform:old},{transform:next}],{duration,easing:ease});
 });
}
const pose=root=>({
 mode:root.querySelector('[data-library-view]')?.dataset.libraryView,
 opened:!!root.querySelector('.library-open'),
 books:new Map([...root.querySelectorAll('[data-library-book]')].map(e=>[e.dataset.libraryBook,e.getBoundingClientRect()])),
 drawer:drawerPose(root),rail:matrix(root,'.library-retaining-rail'),slip:matrix(root,'.library-slip-leaf'),
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
  animateDrawer(root,before.drawer,next.opened?520:180);
  for(const [selector,key,time]of [['.library-retaining-rail','rail',300],['.library-slip-leaf','slip',380]]){
   const e=root.querySelector(selector);if(e&&before[key]!==null&&before[key]!==next[key])e.animate([{transform:before[key]},{transform:next[key]}],{duration:time,easing:ease});
  }
  if(before.mode&&next.mode&&before.mode!==next.mode)root.querySelector('.library-workbench')?.animate([{opacity:.65,translate:'0 4px'},{opacity:1,translate:'0 0'}],{duration:240,easing:ease});
 }
};
export function settleLibraryDrawer(drawer){
 if(!drawer)return;
 const root=drawer.closest('[data-library-shelf]'),before=drawerPose(root);
 paintLibraryDrawer(drawer,Number(drawer.dataset.drawerAmount));
 if(drawer.isConnected&&motionAllowed())animateDrawer(root,before,180);
}
