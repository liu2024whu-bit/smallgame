import {pointerSession} from './pointer.js';
import {updateCloudPreview} from '../puzzles/cloud.js';
import {captureCloud,settleCloudRotors,settleCloudFace,cloudDegrees} from '../../services/motion/cloud.js';
import {announce} from '../dom.js';
const mod=n=>(n%4+4)%4;
export function bindCloud(root,progress,{move,changeView,solved,feedback=()=>{}}){
 const field=root.querySelector('.cloud-case');if(!field)return ()=>{};
 const back=Number(field.dataset.cloudSide)<0,owns=field.dataset.cloudThread==='true';
 const controller=new AbortController(),signal=controller.signal;
 root.addEventListener('keydown',event=>{
  const knob=event.target.closest('[data-cloud-handle]');if(!knob||knob.disabled||solved||knob.closest('[inert]'))return;
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
  event.preventDefault();event.stopPropagation();const index=Number(knob.dataset.cloudHandle),rate=Math.sign(Number(knob.dataset.cloudRate));
  const step=['ArrowRight','ArrowUp'].includes(event.key)?rate:-rate;
  const value=event.key==='Home'?0:event.key==='End'?3:mod(progress.values[index]+step);
  if(!move({type:'set-turn',index,value})&&!owns)announce('线还没有牵上线轴。');
 },{signal});
 let handle;
 const winding=pointerSession(root,{
  pick(event){
   const source=event.target.closest('[data-cloud-handle]');
   if(!source||source.disabled||source.closest('[inert]')||!owns||solved)return null;
   const b=source.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;
   return {source,index:Number(source.dataset.cloudHandle),rate:Number(source.dataset.cloudRate),cx,cy,last:Math.atan2(event.clientY-cy,event.clientX-cx),turn:0,notch:0};
  },
  start(g){
   handle=g.source;field.dataset.cloudPreview=g.index;g.source.classList.add('cloud-being-wound');
   const pair=g.source.closest('[data-cloud-pair]'),key=pair?`half-${pair.dataset.cloudPair}-${g.source.dataset.cloudRing}`:`winder-${back?1:0}-${g.index}`;
   const source=field.querySelector(`[data-cloud-rotor="${key}"]`);
   g.base=progress.values[g.index]+(cloudDegrees(source)-(parseFloat(source.style.rotate)||0))/(g.rate*90);
   field.querySelectorAll(`[data-cloud-rotor][data-cloud-input="${g.index}"]`).forEach(el=>{
    const angle=cloudDegrees(el);el.getAnimations().forEach(a=>a.cancel());el.style.rotate=angle+'deg';
   });
  },
  move(g,event){
   const angle=Math.atan2(event.clientY-g.cy,event.clientX-g.cx);
   g.turn+=Math.atan2(Math.sin(angle-g.last),Math.cos(angle-g.last));g.last=angle;
   const delta=g.turn/(Math.PI/2)/g.rate,values=[...progress.values];values[g.index]=g.base+delta;
   updateCloudPreview(field,values,g.index);g.value=mod(Math.round(values[g.index]));
   const notch=Math.round(delta);if(notch!==g.notch){g.notch=notch;feedback('detent');}
   g.source.setAttribute('aria-valuenow',g.value);
  },
  end(g,_,cancelled){if(!cancelled&&g.value!==undefined)move({type:'set-turn',index:g.index,value:g.value});},
  clear(){
   if(!field.isConnected||!field.hasAttribute('data-cloud-preview'))return;
   const before=captureCloud(field),input=Number(field.dataset.cloudPreview);
   updateCloudPreview(field,progress.values,input);settleCloudRotors(field,before,{preview:true,input,duration:230});
   handle?.classList.remove('cloud-being-wound');delete field.dataset.cloudPreview;
   if(handle)handle.setAttribute('aria-valuenow',progress.values[Number(handle.dataset.cloudHandle)]);
  }
 });
 const table=field.querySelector('.cloud-turntable');
 const flipping=pointerSession(root,{
  pick(event){const source=event.target.closest('[data-cloud-flip]');return source&&!source.closest('[inert]')?{source}:null;},
  start(g){
   g.angle=cloudDegrees(table);g.start=performance.now();g.width=field.getBoundingClientRect().width;
   table.getAnimations().forEach(animation=>animation.cancel());table.style.setProperty('--cloud-face',g.angle+'deg');
  },
  move(g,event){g.distance=event.clientX-g.x;table.style.setProperty('--cloud-face',g.angle+g.distance/g.width*220+'deg');},
  end(g,_,cancelled){
   const distance=Math.abs(g.distance??0),quick=performance.now()-g.start<300;
   if(!cancelled&&(distance/g.width*220>=45||quick&&distance>=40)){changeView({back:!back});feedback('turn');g.changed=true;}
  },
  clear(){if(!field.isConnected)return;const from=cloudDegrees(table);table.style.setProperty('--cloud-face',(back?180:0)+'deg');settleCloudFace(table,from,back?180:0,260);}
 });
 return ()=>{winding();flipping();controller.abort();};
}
