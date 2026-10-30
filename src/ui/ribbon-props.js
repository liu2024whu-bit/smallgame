import {RIBBON_BODY,RIBBON_LAYERS,RIBBON_NAMES,RIBBON_TAIL_SIDES,RIBBON_ROLLS,RIBBON_SLEEVE,RIBBON_REWARD,ribbonGeometry} from '../data/ribbons.js';
import {birthdayHardware} from './birthday-hardware.js';
import {atlas,itemSprite} from './dom.js';

const box=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
export function ribbonTape(index,length,tail=true){
 return `<span class="ribbon-material" data-ribbon-texture="${index}" style="width:${Math.max(0,length-12)}px">${atlas('ribbonParts',index)}</span><span class="ribbon-end-paint ${tail?'':'ribbon-folded-end'}" style="left:${length-(tail?22:15)}px">${atlas('ribbonParts',(tail?16:10)+index)}</span>`;
}
export function ribbonStraps(p,{passive=false}={}){
 return RIBBON_LAYERS.filter(i=>!p.removed.includes(i)).map(i=>{
  const c=ribbonGeometry(p.back,i),tail=RIBBON_TAIL_SIDES[i]===Number(p.back),tag=tail&&!passive?'button':'span';
  return `<div class="ribbon-layer" data-ribbon-layer="${i}"><span class="ribbon-strap" data-ribbon-strap="${i}" style="left:${c.a[0]}px;top:${c.a[1]-14}px;width:${c.length}px;rotate:${c.angle}deg">${ribbonTape(i,c.length,tail)}</span><${tag} class="ribbon-grip ${tail?'ribbon-loose-tail':''}" data-ribbon-tail="${i}" data-ribbon-direction="${c.direction}" style="left:${c.b[0]}px;top:${c.b[1]}px" ${tag==='button'?`data-focus="ribbon-tail-${i}" aria-label="轻抽${RIBBON_NAMES[i]}纸带"`:''}></${tag}></div>`;
 }).join('');
}
export function ribbonSlits(p){return Array.from({length:6},(_,i)=>{const c=ribbonGeometry(p.back,i);return `<span class="ribbon-through" style="left:${c.a[0]}px;top:${c.a[1]}px;rotate:${c.angle+90}deg">${atlas('ribbonParts',6)}</span>`;}).join('');}
export function ribbonRolls(p){
 return p.removed.map(i=>{const [x,y]=RIBBON_ROLLS[i];return `<span class="ribbon-saved" data-ribbon-saved="${i}" style="left:${x}px;top:${y}px;rotate:${[-12,14,-4,8,-16,6][i]}deg">${atlas('ribbonParts',10+i)}<span>${atlas('ribbonParts',16+i)}</span></span>`;}).join('');
}
export function ribbonModel(p,{passive=false,collected=false,body=true,paperVisible=true,solid=null}={}){
 const [rx,ry,rw,rh]=RIBBON_REWARD,done=p.removed.length===6,paper=done&&!collected?`<${passive?'span':'button'} class="ribbon-reward" style="${box([rx+rw/2,ry+rh/2,rw,rh])}" ${passive?'':`data-action="collect-item" data-id="birthdayRibbon" data-focus="ribbon-reward" aria-label="拿起纸套里的孔带" ${paperVisible?'':'disabled inert'}`}>${itemSprite({asset:'ribbonStencil',index:0})}</${passive?'span':'button'}>`:'';
 const sleeve=done?`<span class="ribbon-sleeve" style="${box(RIBBON_SLEEVE)}">${atlas('ribbonParts',9)}</span>${paper}`:'';
 return `<div class="ribbon-model" data-ribbon-model data-ribbon-side="${Number(p.back)}" data-ribbon-removed="${p.removed.join(',')}">${body?`<div class="ribbon-solid" data-ribbon-solid>${solid??atlas('ribbonBodies',Number(p.back),{style:box(RIBBON_BODY),className:'ribbon-body'})}${!solid&&!p.back?birthdayHardware({values:[0,0,0,0],opened:false},{origin:[760,170]}):''}${solid?'':ribbonSlits(p)+ribbonStraps(p,{passive})}</div>`:''}${ribbonRolls(p)}${sleeve}</div>`;
}
export function paintRibbonPull(model,p,index,distance){
 const c=ribbonGeometry(p.back,index,distance),strap=model.querySelector(`[data-ribbon-strap="${index}"]`),grip=model.querySelector(`[data-ribbon-tail="${index}"]`);
 if(!strap||!grip)return;
 strap.style.width=c.length+'px';strap.querySelector('.ribbon-material').style.width=Math.max(0,c.length-12)+'px';strap.querySelector('.ribbon-end-paint').style.left=c.length-22+'px';
 grip.style.left=c.b[0]+'px';grip.style.top=c.b[1]+'px';
}
