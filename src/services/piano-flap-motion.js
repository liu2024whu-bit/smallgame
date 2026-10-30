import {ASSETS} from '../data/assets.js';
import {PIANO_FLAP,pianoFlapPose} from '../data/piano.js';
import {mappedPlaneStyle,polygon} from '../ui/raster-plane.js';
import {motionAllowed} from './motion/shared.js';

function image(layer,source,clip){
 const im=document.createElement('img');im.src=source;im.alt='';im.draggable=false;
 Object.assign(im.style,{position:'absolute',inset:'0',width:'1536px',height:'1024px',maxWidth:'none',transformOrigin:'0 0',clipPath:polygon(clip)});layer.append(im);return im;
}
export function pianoFlapMotion(world){
 const layer=document.createElement('div');layer.className='piano-flap-motion';layer.setAttribute('aria-hidden','true');
 Object.assign(layer.style,{position:'absolute',inset:'0',pointerEvents:'none',zIndex:'3'});world.append(layer);
 const cover=image(layer,ASSETS.pianoNear,[[480,719],[1060,719],[1060,844],[480,844]]);
 const cavity=image(layer,ASSETS.pianoDone,[[521,724],[1009,724],[1009,800],[521,800]]);
 const front=image(layer,ASSETS.pianoNear,PIANO_FLAP.front),inside=image(layer,ASSETS.pianoDone,PIANO_FLAP.inside),lip=image(layer,ASSETS.pianoDone,PIANO_FLAP.lip);
 const note=world.querySelector('[data-piano-letter]');if(note){note.style.opacity='0';note.style.pointerEvents='none';}
 let raf=0,animation;
 const paint=progress=>{
  const pose=pianoFlapPose(progress);
  front.style.opacity=pose.insideVisible||pose.edgeOn?'0':'1';inside.style.opacity=lip.style.opacity=pose.insideVisible&&!pose.edgeOn?'1':'0';
  if(!pose.edgeOn){front.style.transform=mappedPlaneStyle(PIANO_FLAP.front,pose.front);inside.style.transform=mappedPlaneStyle(PIANO_FLAP.inside,pose.inside);if(pose.insideVisible)lip.style.transform=mappedPlaneStyle(PIANO_FLAP.lip,pose.lip);}
  if(note)note.style.opacity=String(Math.max(0,(progress-.88)/.12));
 };
 const clear=()=>{cancelAnimationFrame(raf);layer.remove();note?.style.removeProperty('opacity');note?.style.removeProperty('pointer-events');};
 paint(0);
 Promise.all([cover,cavity,front,inside,lip].map(im=>im.decode())).then(()=>{
  if(!world.isConnected||!motionAllowed()){clear();return;}
  // A real Web Animation is the clock, so Escape, reduced motion and the
  // existing animation-settling logic all reach the same final state.
  animation=layer.animate([{opacity:1},{opacity:1}],{duration:740});
  const tick=()=>{
   if(!world.isConnected||document.hidden||!motionAllowed()){animation.finish();return;}
   const t=Math.min(1,Number(animation.currentTime??0)/740);paint(1-Math.pow(1-t,3));
   if(animation.playState==='running')raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);animation.finished.catch(()=>{}).finally(clear);
 }).catch(clear);
 return ()=>{animation?.cancel();clear();};
}
