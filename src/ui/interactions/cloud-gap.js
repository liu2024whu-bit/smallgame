import {pointerSession} from './pointer.js';
import {GAP_STEP} from '../../puzzles/cloud-gap.js';
import {paintGapPose} from '../../services/gap-paper.js';
import {finishGapPose,settleGapPose} from '../../services/motion/cloud-gap.js';

const clip=n=>Math.max(0,Math.min(3,n));
export function bindCloudGap(root,p,{move,solved,feedback=()=>{}}){
 const model=root.querySelector('.gap-world [data-gap-model]');if(!model)return ()=>{};
 const controller=new AbortController();let committing=false;
 root.addEventListener('keydown',e=>{
  const tab=e.target.closest('[data-gap-tab]');if(!tab||tab.disabled||solved||e.ctrlKey||e.metaKey||e.altKey||tab.closest('[inert]'))return;
  const step={ArrowUp:-1,ArrowLeft:-1,ArrowDown:1,ArrowRight:1}[e.key];if(step===undefined&&!['Home','End'].includes(e.key))return;
  e.preventDefault();e.stopPropagation();finishGapPose(model);
  const index=Number(tab.dataset.gapTab),value=e.key==='Home'?0:e.key==='End'?3:clip(p.values[index]+step);move({type:'set-slide',index,value});
 },{signal:controller.signal});
 const stop=pointerSession(root,{
  pick(e){const source=e.target.closest('[data-gap-tab]');return source&&!source.disabled&&!source.closest('[inert]')&&!solved&&model.querySelector('[data-gap-paper]').dataset.ready==='true'?{source,index:Number(source.dataset.gapTab)}:null;},
  start(g){model.closest('.gap-world').getAnimations({subtree:true}).forEach(a=>a.finish());finishGapPose(model);g.scale=model.getBoundingClientRect().width/1536;g.notch=p.values[g.index];},
  move(g,e){g.next=[...p.values];g.next[g.index]=clip(p.values[g.index]+(e.clientY-g.y)/g.scale/GAP_STEP);paintGapPose(model,g.next);const notch=Math.round(g.next[g.index]);if(notch!==g.notch){feedback('detent');g.notch=notch;}},
  end(g,_,cancelled){if(!cancelled&&g.next){committing=true;if(!move({type:'set-slide',index:g.index,value:Math.round(g.next[g.index])}))committing=false;}},
  clear(){if(!committing&&model.isConnected)settleGapPose(model,model.dataset.gapPose.split(',').map(Number),p.values);},
 });
 return ()=>{stop();controller.abort();};
}
