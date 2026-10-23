export const motionAllowed = () => !document.documentElement.classList.contains('reduce-motion') && !matchMedia('(prefers-reduced-motion: reduce)').matches;
export function settleAnimations(root){
  for(const animation of root.getAnimations({subtree:true})){
    if(animation.playState!=='running')continue;
    try{if(animation.effect?.getComputedTiming().iterations===Infinity)animation.cancel();else animation.finish();}catch{animation.cancel();}
  }
}
export function watchMotionPreferences(root){
  const settle=()=>{if(!motionAllowed())settleAnimations(root);};
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',settle);
  return settle;
}
export const ease = 'cubic-bezier(.22,.75,.3,1)';
export const turnDelta = (old, next) => ((old - next + 180) % 360 + 360) % 360 - 180;
export function drawLine(element) {
  const length = element.getTotalLength();
  if (length) element.animate([{ strokeDasharray: `${length} ${length}`, strokeDashoffset: length }, { strokeDasharray: `${length} ${length}`, strokeDashoffset: 0 }], { duration: 420, easing: 'ease-out' });
}
