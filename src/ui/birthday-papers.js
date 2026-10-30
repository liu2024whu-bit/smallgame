import {BIRTHDAY_GRID,birthdayCell,birthdayHolePoint,DECODER_CARD,DECODER_FOLDED,DECODER_PRINT,DECODER_MIRROR,decoderReflection} from '../data/birthday-lock.js';
import {atlas,itemSprite} from './dom.js';

export const decoderBox=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
export function giftPaper({unfolded=false,back=false}={},exposed=()=>true){
 const ink=BIRTHDAY_GRID.flatMap((row,r)=>row.map((n,c)=>{const [x,y]=birthdayCell(r,c);return `<span ${exposed(x,y)?'':'data-copy-hidden'} style="left:${x/4}%;top:${y/1.6}%">${n}</span>`;})).join('');
 const face=atlas('giftCard',unfolded?(back?3:2):(back?1:0));
 const leaves=unfolded?Array.from({length:3},(_,i)=>`<span class="gift-paper-panel" style="left:${i/3*100}%;--panel:${i}"><span>${face}</span></span>`).join(''):face;
 return `<span class="gift-paper" data-gift-unfolded="${unfolded}" data-gift-back="${back}"><span class="gift-paper-face" style="transform:${unfolded&&back?'scaleX(-1)':'none'}">${leaves}${unfolded&&back?`<span class="gift-ink">${ink}</span>`:''}</span></span>`;
}
export const perforatedRibbon=(turned=false,back=false)=>itemSprite({asset:'ribbonStencil',index:0,turned,back});
export function decoderPaperStack(p,{passive=false,selected=-1,reflected=false}={}){
 const cardRect=p.unfolded?DECODER_CARD:DECODER_FOLDED;
 const exposed=(x,y)=>{
  const sx=p.back?400-x:x,[cx,cy]=p.mirror,{width:w,height:h,aperture:a}=DECODER_MIRROR;
  const inMirror=((DECODER_PRINT[0]+sx/400*130-cx)/(w*a[2]/2))**2+((DECODER_PRINT[1]+y/160*52-cy)/(h*a[3]/2))**2<1;
  if(p.fitted[2]&&(reflected?!inMirror:inMirror))return false;
  return !p.fitted[1]||[0,1,2,3].some(i=>{const [hx,hy]=birthdayHolePoint(i,p);return Math.abs(sx-hx-p.offset[0]*400/130)<24&&Math.abs(y-hy-p.offset[1]*160/52)<11;});
 };
 const card=p.fitted[0]?`<${passive?'span':'button'} class="decoder-card" data-decoder-card style="${decoderBox(cardRect)}" ${passive?'':`data-decoder-card-toggle data-tool-target="birthday-fit:${selected>=0?selected:0}" data-focus="decoder-card" aria-label="${p.unfolded?'翻过贺卡':'展开贺卡'}"`}>${giftPaper(p,exposed)}</${passive?'span':'button'}>`:'';
 const [x,y,w,h]=DECODER_PRINT,strip=p.fitted[1]?`<${passive?'span':'button'} class="decoder-strip" data-decoder-strip style="${decoderBox([x+p.offset[0],y+p.offset[1],w,h])}" ${passive?'':`data-decoder-drag="paper" data-tool-target="birthday-fit:${selected>=0?selected:1}" data-focus="decoder-strip" aria-label="移动孔带" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown"`}>${perforatedRibbon(p.turned,p.stripBack)}</${passive?'span':'button'}>`:'';
 return card+strip;
}
export function decoderMirror(p,{passive=false,selected=-1}={}){
 if(!p.fitted[2])return '';
 const {width:w,height:h,aperture:a}=DECODER_MIRROR,[cx,cy]=p.mirror,gw=w*a[2],gh=h*a[3];
 const matrix=decoderReflection(p.mirror,gw,gh).join(',');
 const reflection=`<span class="decoder-reflection" data-decoder-reflection style="transform:matrix(${matrix})">${atlas('ribbonBodies',0,{style:decoderBox([90,205,570,650]),className:'decoder-reflected-lid'})}${decoderPaperStack(p,{passive:true,reflected:true})}</span>`;
 return `<${passive?'span':'button'} class="decoder-mirror" data-decoder-mirror data-mirror-position="${p.mirror}" style="${decoderBox([cx-w/2,cy-h*(a[1]+a[3]/2),w,h])}" ${passive?'':`data-decoder-drag="mirror" data-tool-target="birthday-fit:${selected>=0?selected:2}" data-focus="decoder-mirror" aria-label="移动小圆镜" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown"`}><span class="decoder-glass" style="left:${a[0]*100}%;top:${a[1]*100}%;width:${a[2]*100}%;height:${a[3]*100}%">${reflection}</span>${itemSprite(2)}</${passive?'span':'button'}>`;
}
export function paintDecoderPaper(model,offset){
 for(const el of model.querySelectorAll('[data-decoder-strip]')){el.style.left=DECODER_PRINT[0]+offset[0]+'px';el.style.top=DECODER_PRINT[1]+offset[1]+'px';}
}
export function paintDecoderMirror(model,position){
 const mirror=model.querySelector('[data-decoder-mirror]');if(!mirror)return;
 const {width:w,height:h,aperture:a}=DECODER_MIRROR;
 mirror.style.left=position[0]-w/2+'px';mirror.style.top=position[1]-h*(a[1]+a[3]/2)+'px';
 mirror.querySelector('[data-decoder-reflection]').style.transform=`matrix(${decoderReflection(position,w*a[2],h*a[3]).join(',')})`;
}
