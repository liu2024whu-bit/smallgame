import {ASSETS} from '../data/assets.js';
import {motionAllowed} from './motion.js';

const ready=new Map(),runs=new WeakMap(),tickets=new WeakMap();
const HEI_TIMELINE=[[0,0],[100,0],[150,1],[245,1],[295,2],[390,2],[440,3],[535,3],[585,4],[930,4],[980,3],[1060,3],[1110,2],[1190,2],[1240,5],[1320,5],[1370,1],[1430,1],[1480,0],[1600,0]];
const STAR_TIMELINE=[[0,-1],[120,0],[260,0],[430,1],[600,1],[780,2],[960,2],[1170,3],[1390,3],[1600,-1]];

async function playFrames(button,{asset,selector,timeline,base}){
 const ticket={};tickets.set(button,ticket);runs.get(button)?.forEach(animation=>animation.cancel());
 if(!motionAllowed())return;
 if(!ready.has(asset)){const image=new Image();image.src=ASSETS[asset];ready.set(asset,image.decode().then(()=>true,()=>{ready.delete(asset);return false;}));}
 const decoded=await ready.get(asset);if(!decoded||tickets.get(button)!==ticket||!button.isConnected||!motionAllowed())return;
 const duration=timeline.at(-1)[0],animations=[];
 if(base)animations.push(button.querySelector(base).animate([{opacity:1,offset:0},{opacity:0,offset:.06},{opacity:0,offset:.94},{opacity:1,offset:1}],{duration,easing:'linear'}));
 for(const [frame,element] of [...button.querySelectorAll(selector)].entries())animations.push(element.animate(timeline.map(([time,pose])=>({opacity:pose===frame?1:0,offset:time/duration})),{duration,easing:'linear'}));
 runs.set(button,animations);await Promise.allSettled(animations.map(animation=>animation.finished));
 if(runs.get(button)===animations){animations.forEach(animation=>animation.cancel());runs.delete(button);}
}
export const greetCharacter=button=>playFrames(button,{asset:'heiGreeting',selector:'.greeting-frame',timeline:HEI_TIMELINE,base:'.mascot-base'});
export const greetPrince=button=>playFrames(button,{asset:'princeLight',selector:'.prince-light-frame',timeline:STAR_TIMELINE});
