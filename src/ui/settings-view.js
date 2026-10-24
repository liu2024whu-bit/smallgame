// Native tabs and device settings share the dialog lifetime, never the save.
export function bindSettingsView(root){
 const nav=root.querySelector('.settings-pages');if(!nav)return ()=>{};
 const abort=new AbortController(),options={signal:abort.signal},media=matchMedia('(prefers-reduced-motion:reduce)');
 const sync=()=>{
  const label=root.querySelector('[data-fullscreen-label]');if(label)label.textContent=document.fullscreenElement?'回到窗口':'全屏看看';
  const note=root.querySelector('[data-reduced-note]');if(note)note.hidden=!media.matches;
 };
 nav.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const buttons=[...nav.querySelectorAll('button')],current=buttons.indexOf(event.target.closest('button'));if(current<0)return;
  event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(current+(event.key==='ArrowRight'?1:buttons.length-1))%buttons.length;
  buttons[next].focus();buttons[next].click();
 },options);
 document.addEventListener('fullscreenchange',sync,options);media.addEventListener('change',sync,options);sync();
 return ()=>abort.abort();
}
