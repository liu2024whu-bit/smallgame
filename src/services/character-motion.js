import {ASSETS} from '../data/assets.js';
import {motionAllowed} from './motion.js';

let ready;
const runs=new WeakMap(),tickets=new WeakMap();
const TIMELINE=[[0,0],[100,0],[150,1],[245,1],[295,2],[390,2],[440,3],[535,3],[585,4],[930,4],[980,3],[1060,3],[1110,2],[1190,2],[1240,5],[1320,5],[1370,1],[1430,1],[1480,0],[1600,0]];
export async function greetCharacter(button){
  const ticket={};tickets.set(button,ticket);
  const previous=runs.get(button);previous?.forEach(a=>a.cancel());
  if(!motionAllowed())return;
  if(!ready){const image=new Image();image.src=ASSETS.heiGreeting;ready=image.decode().catch(()=>{});}
  await ready;if(tickets.get(button)!==ticket||!button.isConnected||!motionAllowed())return;
  const animations=[],base=button.querySelector('.mascot-base');
  const duration=TIMELINE.at(-1)[0];
  animations.push(base.animate([{opacity:1,offset:0},{opacity:0,offset:.06},{opacity:0,offset:.94},{opacity:1,offset:1}],{duration,easing:'linear'}));
  for(const [frame,element] of [...button.querySelectorAll('.greeting-frame')].entries()){
    animations.push(element.animate(TIMELINE.map(([time,pose])=>({opacity:pose===frame?1:0,offset:time/duration})),{duration,easing:'linear'}));
  }
  runs.set(button,animations);
  await Promise.allSettled(animations.map(a=>a.finished));
  if(runs.get(button)===animations){animations.forEach(a=>a.cancel());runs.delete(button);}
}
