import {SUGARS,SUGAR_NAMES,SWEETS_FOODS,SWEETS_BOARD,SWEETS_CARD,SWEETS_GRID,SWEETS_RAILS,SWEETS_PLATE_SIZE,sweetsPlate,sweetsPosition,sweetsCord} from '../data/sweets.js';
import {atlas,escape} from './dom.js';

const box=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
export function sweetArt(type,size=62,className=''){
 const [,,w,h]=SWEETS_FOODS.frames[type],width=size*Math.min(1,w/h),height=size*Math.min(1,h/w);
 return atlas('sweetsFoods',type,{className:'sweet-art '+className,style:`width:${width}px;height:${height}px`});
}
function eyelet([x,y],size=24,attrs=''){
 return `<span class="sweet-eyelet" ${attrs} style="${box([x-size/2,y-size/2,size,size])}">${atlas('sweetsParts',4)}</span>`;
}
export function sweetsCords(cuts,{passive=false,served=false}={}){
 const names=['横向的细绳','上半边的细绳','下半边的细绳'];
 const cords=cuts.map((_,index)=>{
  const c=sweetsCord(index,cuts),[x,y]=c.grip,angle=[0,90,-90][index];
  const tag=passive||served?'span':'button';
  const attrs=tag==='span'?'':`data-sweet-cut="${index}" data-focus="sweet-cut-${index}" role="slider" aria-label="${names[index]}" aria-orientation="${index?'horizontal':'vertical'}" aria-valuemin="1" aria-valuemax="7" aria-valuenow="${cuts[index]}"`;
  return `<span class="sweet-cord" data-sweet-cord="${index}" style="left:${c.start[0]}px;top:${c.start[1]-5}px;width:${c.length}px;rotate:${c.angle}deg">${atlas('sweetsParts',2)}</span>${eyelet(c.end,24,`data-sweet-end="${index}"`)}<${tag} class="sweet-grip" ${attrs} data-sweet-grip="${index}" style="left:${x}px;top:${y}px"><span class="sweet-grip-paint" style="rotate:${angle}deg">${atlas('sweetsParts',3)}</span></${tag}>`;
 }).join('');
 const [gx,gy,gw,gh]=SWEETS_GRID,{left,top,bottom}=SWEETS_RAILS,stops=Array.from({length:7},(_,i)=>[eyelet([left,gy+(i+1)*gh/8],14),eyelet([gx+(i+1)*gw/8,top],14),eyelet([gx+(i+1)*gw/8,bottom],14)].join('')).join('');
 return `<div class="sweet-detents">${stops}</div><div class="sweet-cords" data-sweet-cords>${cords}</div>`;
}
export function sweetsModel(p,{passive=false,collected=false}={}){
 const card=collected?'':`<${passive?'span':'button'} class="sweet-card" style="${box([SWEETS_CARD[0]+SWEETS_CARD[2]/2,SWEETS_CARD[1]+SWEETS_CARD[3]/2,SWEETS_CARD[2],SWEETS_CARD[3]])}" ${passive?'':`data-action="collect-item" data-id="birthdayCard" data-focus="sweet-card" aria-label="拿起碟子下面的贺卡" ${p.served?'':'disabled inert'}`}>${atlas('giftCard',0,{className:'item-art'})}</${passive?'span':'button'}>`;
 const plates=Array.from({length:4},(_,i)=>{
  const [x,y]=sweetsPlate(i,p.served),size=SWEETS_PLATE_SIZE;
  return `<span class="sweet-plate" data-sweet-plate="${i}" style="${box([x-size/2,y-size/2,size,size])}">${atlas('sweetsParts',1)}</span>`;
 }).join('');
 const pieces=SUGARS.map((s,i)=>{
  const [x,y]=sweetsPosition(i,p);
  return `<span class="sweet-piece" data-sweet-piece="${i}" data-sweet-position="${x},${y}" style="left:${x}px;top:${y}px" aria-label="${SUGAR_NAMES[s.type]}">${sweetArt(s.type,62)}</span>`;
 }).join('');
 const goal=`<span class="sweet-goal">${atlas('sweetsParts',6)}<span class="sweet-goal-ink"><small>每样都有。</small><span>${SUGAR_NAMES.map((_,i)=>sweetArt(i,34)).join('')}</span></span></span>`;
 const serve=`<${passive||p.served?'span':'button'} class="sweet-serve" ${passive||p.served?'':`data-sweet-serve data-focus="sweet-serve" aria-label="分好这四份甜点"`}>${atlas('sweetsParts',5)}${passive||p.served?'':'<small>分好了</small>'}</${passive||p.served?'span':'button'}>`;
 return `<div class="sweets-model" data-sweets-model data-sweets-pose='${escape(JSON.stringify(p))}' data-sweets-collected="${collected}"><span class="sweet-board" style="${box(SWEETS_BOARD)}">${atlas('sweetsParts',0)}</span>${goal}${card}${plates}${pieces}${sweetsCords(p.cuts,{passive,served:p.served})}${serve}</div>`;
}
export function paintSweetsCords(model,cuts){
 for(let i=0;i<3;i++){
  const c=sweetsCord(i,cuts),[cord,end,grip]=sweetsCordNodes(model,i);
  Object.assign(cord.style,{left:c.start[0]+'px',top:c.start[1]-5+'px',width:c.length+'px'});
  Object.assign(grip.style,{left:c.grip[0]+'px',top:c.grip[1]+'px'});
  Object.assign(end.style,{left:c.end[0]-12+'px',top:c.end[1]-12+'px'});
 }
 model.dataset.sweetsShown=JSON.stringify(cuts);
}
export const sweetsCordNodes=(model,index)=>['cord','end','grip'].map(part=>model.querySelector(`[data-sweet-${part}="${index}"]`));
export const sweetsPositionStyle=el=>Object.fromEntries(['left','top','width'].filter(key=>el.style[key]).map(key=>[key,el.style[key]]));
export const captureSweetsCords=model=>[0,1,2].map(i=>sweetsCordNodes(model,i).map(sweetsPositionStyle));
