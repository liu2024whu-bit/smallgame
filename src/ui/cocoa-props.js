import {COCOA_PARTS,COCOA_VESSELS,COCOA_CAPACITIES,COCOA_NAMES} from '../data/cocoa.js';
import {cocoaFluid} from '../services/cocoa-geometry.js';
import {polygon,excluding} from './raster-plane.js';
import {atlas} from './dom.js';

const n=v=>Number(v.toFixed(3));
export function cocoaLiquidStyles(index,amount,angle=0){
 const v=COCOA_VESSELS[index],f=cocoaFluid(index,amount,angle);
 if(v.opening){
  const [cx,cy,rx,ry]=v.opening,t=f.fraction,shift=Math.min(1,Math.abs(angle)/85);
  return {clip:'none',surface:[cx-shift*rx*.82,cy+(1-t)*ry*.56,rx*2*(.68+.28*t)*(1-shift*.55),ry*2*(.37+.41*t)],angle:-angle*.24,hidden:amount<=.0001};
 }
 return {clip:polygon(f.points.length?f.points:[[0,0],[0,0],[0,0]]),surface:[...f.surface,Math.max(0,f.width),Math.min(28,f.width*.13)],angle:-angle,hidden:amount<=.0001};
}
export function paintCocoaVessel(el,index,amount,pose){
 const v=COCOA_VESSELS[index],p=pose??{x:v.x,y:v.y,angle:0},f=cocoaLiquidStyles(index,amount,p.angle),body=el.querySelector('.cocoa-fluid-body'),top=el.querySelector('.cocoa-fluid-top');
 el.style.transform=`translate(${n(p.x)}px,${n(p.y)}px) rotate(${n(p.angle)}deg) scale(${v.scale})`;
 el.dataset.cocoaPose=JSON.stringify(p);
 if(body){body.style.clipPath=f.clip;body.hidden=f.hidden||index>=3;}
 if(top){const [x,y,w,h]=f.surface;Object.assign(top.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px',transform:`translate(-50%,-50%) rotate(${f.angle}deg)`});top.hidden=f.hidden;}
}
export function cocoaVessel(index,amount,{passive=false,done=false,pose}={}){
 const v=COCOA_VESSELS[index],frame=COCOA_PARTS.frames[index],f=cocoaLiquidStyles(index,amount),[x,y,w,h]=f.surface;
 const opening=v.opening?[...Array(36)].map((_,i)=>{const a=i/36*Math.PI*2;return [v.opening[0]+Math.cos(a)*v.opening[2],v.opening[1]+Math.sin(a)*v.opening[3]];}):null;
 const inside=v.opening?`clip-path:ellipse(${v.opening[2]}px ${v.opening[3]}px at ${v.opening[0]}px ${v.opening[1]}px)`:'',front=opening?`clip-path:${excluding(opening,frame[2],frame[3])};`:'';
 const body=`<span class="cocoa-fluid-body" style="clip-path:${f.clip}" ${f.hidden||index>=3?'hidden':''}>${atlas('cocoaMaterials',0)}</span><span class="cocoa-fluid-top" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:translate(-50%,-50%)" ${f.hidden?'hidden':''}>${atlas('cocoaMaterials',1)}</span>`;
 const tag=passive?'span':'button',attrs=passive?'':`data-cocoa-vessel="${index}" data-focus="cocoa-${index}" aria-label="${COCOA_NAMES[index]}，${index<3?'容量'+COCOA_CAPACITIES[index]+'份，':''}${amount===0?'空着':amount===COCOA_CAPACITIES[index]?'满着':'装有一些可可'}" aria-pressed="false" ${done?'disabled':''}`;
 return `<${tag} class="cocoa-vessel ${index>=3?'cocoa-cup':''}" ${attrs} data-cocoa-prop="${index}" data-cocoa-pose='${JSON.stringify({x:v.x,y:v.y,angle:0})}' style="width:${frame[2]}px;height:${frame[3]}px;transform:translate(${pose?.x??v.x}px,${pose?.y??v.y}px) scale(${pose?.scale??v.scale});z-index:${index+2}">${atlas('cocoaVessels',index,{className:'cocoa-shell cocoa-back'})}<span class="cocoa-contents" style="${inside}">${body}<span class="cocoa-inner-stream" hidden>${atlas('cocoaMaterials',2)}</span></span>${atlas('cocoaVessels',index,{className:'cocoa-shell cocoa-front',style:front})}${index<3?`<span class="cocoa-mark" style="left:${v.mark[0]}px;top:${v.mark[1]}px">${COCOA_CAPACITIES[index]}</span>`:''}<span class="cocoa-mouth-response" style="left:${v.mouth[0]}px;top:${v.mouth[1]}px">${atlas('cocoaMaterials',3)}</span></${tag}>`;
}
export function cocoaModel(p,{passive=false,done=false}={}){
 const shadows=COCOA_VESSELS.map((v,i)=>`<span class="cocoa-contact-shadow" data-cocoa-shadow="${i}" style="left:${v.x+v.base[0]*v.scale}px;top:${v.y+v.base[1]*v.scale-3}px;width:${(i>=3?375:300)*v.scale}px;height:${45*v.scale}px">${atlas('cocoaMaterials',4)}</span>`).join('');
 return `<div class="cocoa-model" data-cocoa-model data-cocoa-levels="${p.levels.join(',')}">${shadows}${p.levels.map((amount,i)=>cocoaVessel(i,amount,{passive,done})).join('')}<span class="cocoa-falling-stream" hidden>${atlas('cocoaMaterials',2)}</span></div>`;
}
