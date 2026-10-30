import {COCOA_VESSELS,COCOA_CAMERA} from '../../data/cocoa.js';
import {cocoaPourAngle,cocoaPourPose,cocoaPourCamera} from '../cocoa-geometry.js';
import {paintCocoaVessel,cocoaLiquidStyles} from '../../ui/cocoa-props.js';

const interpolate=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const clamp=t=>Math.max(0,Math.min(1,t));
const home=i=>{const {x,y}=COCOA_VESSELS[i];return {x,y,angle:0};};
const between=(a,b,t)=>({x:interpolate(a.x,b.x,t),y:interpolate(a.y,b.y,t),angle:interpolate(a.angle,b.angle,t)});
function capture(root){
 const m=root.querySelector('[data-cocoa-model]');if(!m)return null;
 return {levels:m.dataset.cocoaLevels.split(',').map(Number),shown:[...m.querySelectorAll('[data-cocoa-prop]')].map(el=>Number(el.dataset.cocoaShown??m.dataset.cocoaLevels.split(',')[Number(el.dataset.cocoaProp)])),poses:[...m.querySelectorAll('[data-cocoa-prop]')].map(el=>JSON.parse(el.dataset.cocoaPose)),camera:JSON.parse(m.closest('.cocoa-world').dataset.cocoaCamera??JSON.stringify(COCOA_CAMERA)),pour:m.dataset.cocoaPour?.split(',').map(Number)};
}
export const cocoaMotion={capture,play(root,old){
 const m=root.querySelector('[data-cocoa-model]');if(!m||!old)return;
 const next=m.dataset.cocoaLevels.split(',').map(Number),els=[...m.querySelectorAll('[data-cocoa-prop]')];if(next.every((v,i)=>v===old.levels[i]))return;
 const [from,to]=old.pour??[],poured=Number.isInteger(from)&&Number.isInteger(to)&&next[from]<old.levels[from]&&next[to]>old.levels[to];
 const duration=poured?1580:380,clock=m.animate([{opacity:1},{opacity:1}],{duration}),stream=m.querySelector('.cocoa-falling-stream'),controls=els.map(el=>[el,el.disabled]),finish=root.querySelector('.completion-note');
 m.dataset.cocoaBusy='true';controls.forEach(([el])=>el.disabled=true);if(finish)finish.style.visibility='hidden';
 let frame;
 const initial=poured?cocoaPourAngle(from,old.levels[from]):0,final=poured?cocoaPourAngle(from,next[from]):0;
 const world=m.closest('.cocoa-world'),pourCamera=poured?cocoaPourCamera(from,to,old.levels[from],next[from]):COCOA_CAMERA;
 function cameraPaint(camera){const scale=world.parentElement.clientWidth/camera[2];world.style.transform=`translate(${-camera[0]*scale}px,${-camera[1]*scale}px) scale(${scale})`;world.dataset.cocoaCamera=JSON.stringify(camera);}
 function paint(time){
  const t=clamp(time/duration),fill=poured?smooth(clamp((time-380)/820)):smooth(t),levels=old.shown.map((v,i)=>interpolate(v,next[i],fill));
  const cameraStart=old.camera??COCOA_CAMERA,camera=poured?(time<1200?cameraStart.map((v,i)=>interpolate(v,pourCamera[i],smooth(clamp(time/240)))):pourCamera.map((v,i)=>interpolate(v,COCOA_CAMERA[i],smooth(clamp((time-1200)/380))))):cameraStart.map((v,i)=>interpolate(v,COCOA_CAMERA[i],smooth(t)));
  cameraPaint(camera);
  for(let i=0;i<5;i++){
   let position=between(old.poses[i],home(i),smooth(clamp(time/260)));
   if(poured&&i===from){
    const angle=cocoaPourAngle(i,levels[i]),pour=cocoaPourPose(i,to,angle),receiver=COCOA_VESSELS[to],surface=cocoaLiquidStyles(to,levels[to]).surface,inside=els[to].querySelector('.cocoa-inner-stream'),ripple=els[to].querySelector('.cocoa-mouth-response');
    if(time<380)position=between(old.poses[i],cocoaPourPose(i,to,initial),smooth(time/380));
    else if(time>1200)position=between(cocoaPourPose(i,to,final),home(i),smooth((time-1200)/380));
    else position=pour;
    els[i].style.zIndex=20;
    const flowing=time>=380&&time<=1200;
    stream.hidden=!flowing;inside.hidden=!flowing;
    if(flowing){Object.assign(stream.style,{left:pour.mouth[0]+'px',top:pour.mouth[1]-54+'px',height:'57px',width:(7+Math.sin(time/75)*.6)+'px'});Object.assign(inside.style,{left:receiver.mouth[0]+'px',top:receiver.mouth[1]+'px',height:Math.max(4,surface[1]-receiver.mouth[1])+'px',width:7/receiver.scale+'px'});Object.assign(ripple.style,{left:surface[0]+'px',top:surface[1]+'px',width:Math.min(130,surface[2]*.7)+'px',height:Math.min(25,surface[3]*.7)+'px',opacity:'.5'});}
    else ripple.style.opacity='0';
   }
   paintCocoaVessel(els[i],i,levels[i],position);els[i].dataset.cocoaShown=levels[i];
   const shadow=m.querySelector(`[data-cocoa-shadow="${i}"]`);if(shadow&&poured&&i===from)shadow.style.opacity=String(.45*(time<380?1-time/380:time>1200?(time-1200)/380:0));
  }
  m.dataset.cocoaTime=Math.round(time);
 }
 function tick(){if(!m.isConnected){clock.cancel();return;}paint(Number(clock.currentTime??0));if(!['finished','idle'].includes(clock.playState))frame=requestAnimationFrame(tick);}
 paint(0);frame=requestAnimationFrame(tick);
 clock.finished.catch(()=>{}).finally(()=>{cancelAnimationFrame(frame);if(!m.isConnected)return;cameraPaint(COCOA_CAMERA);delete world.dataset.cocoaCamera;els.forEach((el,i)=>{paintCocoaVessel(el,i,next[i],home(i));el.style.zIndex=i+2;el.dataset.cocoaShown=next[i];const ripple=el.querySelector('.cocoa-mouth-response'),v=COCOA_VESSELS[i];ripple.style.cssText=`left:${v.mouth[0]}px;top:${v.mouth[1]}px`;el.querySelector('.cocoa-inner-stream').hidden=true;});m.querySelectorAll('.cocoa-contact-shadow').forEach(s=>s.style.removeProperty('opacity'));stream.hidden=true;controls.forEach(([el,disabled])=>el.disabled=disabled);delete m.dataset.cocoaBusy;if(finish)finish.style.removeProperty('visibility');m.dispatchEvent(new Event('cocoa-settled'));});
}};
