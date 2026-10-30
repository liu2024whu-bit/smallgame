import {balanceLean,balanceSlotPoint,balanceSuspension,weightRect,weightOrigin,BALANCE_PAN_ORIGIN} from '../data/balance-apparatus.js';
import {motionAllowed} from './motion/shared.js';

const models=new WeakMap();
export const balanceMaterial=model=>models.get(model);
const at=(el,rect)=>{if(el)[el.style.left,el.style.top,el.style.width,el.style.height]=rect.map(n=>n+'px');};
const panFor=slot=>slot>=9?1:slot>=6?0:-1;
const point=(pose,i)=>pose.floating?.[i]??(pose.p.places[i]<6&&pose.table?pose.table[pose.p.places[i]]:balanceSlotPoint(pose.p.places[i],pose.lean,pose.sway[panFor(pose.p.places[i])]??0));

export function hydrateBalanceMaterial(root){
 for(const model of root.querySelectorAll('[data-balance-model]')){
  if(models.has(model))continue;
  const saved=JSON.parse(model.dataset.balancePose),table=model.dataset.balanceTable?JSON.parse(model.dataset.balanceTable):null;let frame=0,pose={p:saved,table,held:-1,lean:balanceLean(saved.places),sway:[0,0],floating:null};
  function draw(){
   const beam=model.querySelector('[data-balance-beam]');if(beam)beam.style.transform=`rotate(${pose.lean}deg)`;
   for(let pan=0;pan<2;pan++){
    const p=balanceSuspension(pan,pose.lean);
    for(const el of model.querySelectorAll(`[data-balance-pan="${pan}"],[data-balance-front="${pan}"]`)){
     el.style.left=p[0]-BALANCE_PAN_ORIGIN[0]+'px';el.style.top=p[1]-BALANCE_PAN_ORIGIN[1]+'px';el.style.transform=`rotate(${pose.sway[pan]}deg)`;
    }
   }
   for(const el of model.querySelectorAll('[data-balance-weight]')){
    const i=Number(el.dataset.balanceWeight),pan=panFor(pose.p.places[i]);at(el,weightRect(i,point(pose,i)));el.style.transformOrigin=weightOrigin(i).join('px ')+'px';el.style.transform=`rotate(${pose.floating?.[i]?0:pose.sway[pan]??0}deg)`;
    el.classList.toggle('balance-held',pose.held===i);if(el.tagName==='BUTTON'&&!model.dataset.balanceBusy)el.disabled=pose.held>=0&&pose.held!==i;
   }
   if(pose.held>=0)model.dataset.balanceHeld=String(pose.held);else delete model.dataset.balanceHeld;
   for(const el of model.querySelectorAll('[data-balance-slot]')){
    const slot=Number(el.dataset.balanceSlot),pan=panFor(slot),p=balanceSlotPoint(slot,pose.lean,pose.sway[pan]??0),i=pose.p.places.indexOf(slot);
    el.style.left=p[0]+'px';el.style.top=p[1]+'px';el.tabIndex=pose.held>=0&&(i<0||i===pose.held)?0:-1;
    if(!model.dataset.balanceBusy)el.disabled=i>=0&&i!==pose.held;
   }
  }
  const controller={
   snapshot:()=>({...structuredClone(pose),points:pose.p.places.map((_,i)=>point(pose,i))}),
   slots:()=>Array.from({length:12},(_,slot)=>balanceSlotPoint(slot,pose.lean,pose.sway[panFor(slot)]??0)),
   arrival(index,p){pose.floating={...pose.floating,[index]:[...p]};},
   hold(index){controller.animate(controller.snapshot(),pose.p,{held:index,duration:220});},
   animate(from,p,{held=-1,duration=440,blocking=false,focus}={}){
    cancelAnimationFrame(frame);
    const target={p:structuredClone(p),table,held,lean:balanceLean(p.places,held),sway:[0,0],floating:null},start=performance.now();
    const moved=p.places.flatMap((slot,i)=>slot!==from.p.places[i]||from.floating?.[i]?[i]:[]),before=from.points??from.p.places.map((_,i)=>point(from,i));
    const scope=model.closest('dialog')??model,controls=blocking?[...scope.querySelectorAll('.balance-workbench button,[data-action="undo"],[data-action="reset-puzzle"]')].map(el=>[el,el.disabled]):[];
    const wanted=focus??document.activeElement?.dataset.focus;
    const finish=()=>{pose=target;delete model.dataset.balanceBusy;controls.forEach(([el,d])=>el.disabled=d);draw();
     if(blocking&&([document.body,model.closest('dialog')].includes(document.activeElement)||document.activeElement?.disabled)){
      const el=wanted&&scope.querySelector(`[data-focus="${CSS.escape(wanted)}"]`);(el?.tagName==='BUTTON'&&!el.disabled?el:scope.querySelector('.balance-navigation [aria-current="true"]'))?.focus({preventScroll:true});
     }
    };
    if(!motionAllowed()||!duration){finish();return;}
    if(blocking){model.dataset.balanceBusy='true';controls.forEach(([el])=>el.disabled=true);}
    const delta=target.lean-from.lean,impulse=Math.max(-1.8,Math.min(1.8,delta*.2));
    const tick=now=>{
     if(!model.isConnected)return;if(!motionAllowed()){finish();return;}
     const t=Math.min(1,(now-start)/duration),e=1-(1-t)**3,sway=Math.sin(t*Math.PI*3)*Math.exp(-t*4)*impulse;
     pose={...target,lean:from.lean+delta*e,sway:[sway,-sway],floating:{}};
     for(const i of moved){const pan=panFor(p.places[i]),to=balanceSlotPoint(p.places[i],pose.lean,pose.sway[pan]??0),distance=Math.hypot(to[0]-before[i][0],to[1]-before[i][1]);
      pose.floating[i]=to.map((v,k)=>before[i][k]+(v-before[i][k])*e-(k===1&&distance>48?Math.sin(t*Math.PI)*Math.min(20,distance*.08):0));
     }
     draw();if(t<1)frame=requestAnimationFrame(tick);else finish();
    };
    pose={...from,held};draw();frame=requestAnimationFrame(tick);
   },
  };
  models.set(model,controller);model.dataset.balanceReady='true';draw();
 }
}
