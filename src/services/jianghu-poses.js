import {JIANGHU_POSES,JIANGHU_EDGE,drawerPose} from '../data/jianghu-apparatus.js';
import {motionAllowed} from './motion/shared.js';

const players=new WeakMap();
function player(world){
 if(!players.has(world))players.set(world,{images:[...world.querySelectorAll('[data-jianghu-pose]')],canvas:null,animation:0});
 return players.get(world);
}
function removeCanvas(p){p.canvas?.remove();p.canvas=null;}
function paint(world,position){
 const p=player(world),amount=Math.max(0,Math.min(1,position));world.dataset.jianghuPull=String(amount);
 for(const image of p.images)image.style.opacity='0';
 if(amount===0){removeCanvas(p);return;}
 if(!p.images.every(im=>im.complete&&im.naturalWidth)){
  removeCanvas(p);const nearest=p.images[Math.round(amount*4)];if(nearest)nearest.style.opacity='1';return;
 }
 if(!p.canvas){p.canvas=document.createElement('canvas');p.canvas.width=1536;p.canvas.height=1024;p.canvas.className='jianghu-moving-paint';p.canvas.setAttribute('aria-hidden','true');world.append(p.canvas);}
 const ctx=p.canvas.getContext('2d'),pose=drawerPose(amount),[x,y,w,h]=pose.front;
 ctx.clearRect(0,0,1536,1024);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(p.images[0],0,0);
 // The front follows the rail continuously; a single painted pose supplies
 // its texture at each instant. Held positions never show translucent knobs
 // or duplicate coins from two simultaneously exposed illustrations.
 const draw=index=>{
  const im=p.images[index],[sx,sy,sw,sh]=JIANGHU_POSES[index].front;
  if(y>JIANGHU_EDGE&&sy>JIANGHU_EDGE)ctx.drawImage(im,0,JIANGHU_EDGE,1536,sy-JIANGHU_EDGE,0,JIANGHU_EDGE,1536,y-JIANGHU_EDGE+.5);
  ctx.drawImage(im,sx,sy,sw,sh,x,y,w,h);
 };
 const nearest=Math.round(amount*4);draw(Math.max(1,nearest));
 if(nearest===0){const [sx,sy,sw,sh]=JIANGHU_POSES[0].front;ctx.drawImage(p.images[0],sx,sy,sw,sh,x,y,w,h);}
}
export function setDrawerPose(world,position){
 const p=player(world);cancelAnimationFrame(p.animation);p.animation=0;paint(world,position);
}
export function animateDrawerPose(world,{from=0,to=1,duration=640}={}){
 const p=player(world);cancelAnimationFrame(p.animation);let start;
 const finish=()=>{p.animation=0;removeCanvas(p);for(const image of p.images)image.style.opacity='0';world.dataset.jianghuPull='0';};
 const tick=time=>{
  if(!world.isConnected||document.hidden||!motionAllowed()){finish();return;}
  start??=time;const elapsed=Math.min(1,(time-start)/duration),eased=1-Math.pow(1-elapsed,3);
  paint(world,from+(to-from)*eased);
  if(elapsed<1)p.animation=requestAnimationFrame(tick);else finish();
 };
 paint(world,from);p.animation=requestAnimationFrame(tick);
 return ()=>{cancelAnimationFrame(p.animation);finish();};
}
