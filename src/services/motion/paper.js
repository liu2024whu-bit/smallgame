

export const paperMotion = {
  capture: root => ({ attempts: Number(root.querySelector('[data-password-lock]')?.dataset.attempts), campus:root.querySelector('[data-campus-stop]')?.dataset.campusStop }),
  play(root, before) {
    const lock=root.querySelector('[data-password-lock]');
    if(lock&&!lock.matches('[data-postal-cabinet],[data-screen-case]')&&Number(lock.dataset.attempts)>before.attempts&&!lock.classList.contains('lock-open')){
      lock.animate([{translate:'0px'},{translate:'-3px'},{translate:'3px'},{translate:'0px'}],{duration:240});
    }
    const campus=root.querySelector('[data-campus-stop]');
    if(campus&&before.campus&&campus.dataset.campusStop!==before.campus)campus.animate([{opacity:.3},{opacity:1}],{duration:420,easing:'ease-out'});
  },
};
