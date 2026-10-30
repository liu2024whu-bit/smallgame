// The same lock, entered with a device keyboard. No answer or deduction is
// supplied; the physical drums and their existing rules remain authoritative.
export function bindTouchEntry(root,{kind,length,submit}){
  if(!matchMedia('(any-pointer:coarse)').matches&&innerWidth>700)return ()=>{};
  const footer=root.querySelector('.workbench-footer');if(!footer)return ()=>{};
  const form=document.createElement('form');form.className='touch-code-entry';form.dataset.buttonTaps='';
  const letters=kind==='letter',label=letters?`${length}个字母`:`${length}位数字`;
  form.innerHTML=`<label><span>${label}</span><input type="text" inputmode="${letters?'text':'numeric'}" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" maxlength="${length}" aria-label="输入${label}"><button class="quiet-button" type="submit">试试</button></label><p role="status"></p>`;
  footer.before(form);
  const send=event=>{
    event.preventDefault();event.stopPropagation();
    const value=form.querySelector('input').value.replace(/\s/g,'').toUpperCase();
    if(!(letters?/^[A-Z]+$/:/^\d+$/).test(value)||value.length!==length){form.querySelector('p').textContent=`这里留着${label}的位置。`;return;}
    form.querySelector('input').blur();submit([...value]);
  };
  form.addEventListener('submit',send);
  return ()=>{form.removeEventListener('submit',send);form.remove();};
}
