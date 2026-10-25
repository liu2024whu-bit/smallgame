import {paintLight} from '../../ui/puzzles/light.js';
import {motionAllowed} from './shared.js';
const running=new WeakMap();
const fieldOf=root=>root.matches?.('[data-light-case]')?root:root.querySelector('[data-light-case]:not(.world-light-case)');
export const lightPose=field=>structuredClone(field.lightPose??JSON.parse(field.dataset.lightState));
export function stopLight(field){const frame=running.get(field);if(frame)cancelAnimationFrame(frame);running.delete(field);return lightPose(field);}
export function settleLight(field,from,to,{duration=380}={}){
 stopLight(field);
 if(!motionAllowed()||JSON.stringify(from)===JSON.stringify(to)){paintLight(field,to);return;}
 const start=performance.now(),trace=!from.proof&&!!to.proof;
 function tick(now){
  if(!field.isConnected){running.delete(field);return;}
  const t=motionAllowed()?Math.min(1,(now-start)/duration):1,e=1-(1-t)**3;
  const mix=(a,b)=>Number(a)+(Number(b)-Number(a))*e;
  const pose={...to,values:to.values.map((value,i)=>mix(from.values[i],value)),fitted:to.fitted.map((value,i)=>mix(from.fitted[i],value)),flipped:mix(from.flipped,to.flipped),lit:mix(from.lit,to.lit),proofAmount:trace?e:1};
  paintLight(field,pose);
  if(t<1)running.set(field,requestAnimationFrame(tick));else {paintLight(field,to);running.delete(field);}
 }
 paintLight(field,{...from,proof:to.proof,proofAmount:trace?0:1});
 running.set(field,requestAnimationFrame(tick));
}
export const lightMotion={
 capture(root){const field=fieldOf(root);return field?stopLight(field):null;},
 play(root,before){const field=fieldOf(root);if(field&&before){const to=JSON.parse(field.dataset.lightState);settleLight(field,before,to,{duration:!before.proof&&to.proof?960:420});}}
};
