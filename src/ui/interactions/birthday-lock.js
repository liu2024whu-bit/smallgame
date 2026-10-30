import {pointerSession} from './pointer.js';
import {decoderStage,decoderPaperOffset,decoderMirrorPoint,DECODER_WORLD,DECODER_MIRROR,DECODER_PRINT} from '../../data/birthday-lock.js';
import {paintDecoderPaper,paintDecoderMirror} from '../birthday-papers.js';
import {mod} from '../../puzzles/common.js';
import {bindTouchEntry} from './touch-entry.js';

export function prepareBirthdayMove(root,move,progress,view,arrival){
 if(move.type!=='fit'||!arrival||![1,2].includes(move.index))return;
 const world=root.querySelector('.decoder-world');if(!world)return;
 const b=world.getBoundingClientRect(),scale=b.width/DECODER_WORLD[0],g=arrival.grab??[.5,.5],point=[(arrival.left+arrival.width*g[0]-b.left)/scale,(arrival.top+arrival.height*g[1]-b.top)/scale];
 if(move.index===2){const {width:w,height:h,aperture:a}=DECODER_MIRROR;move.position=decoderMirrorPoint([point[0]+(.5-g[0])*w,point[1]+(a[1]+a[3]/2-g[1])*h]);}
 if(move.index===1)move.offset=decoderPaperOffset([point[0]-DECODER_PRINT[0]-g[0]*DECODER_PRINT[2],point[1]-DECODER_PRINT[1]-g[1]*DECODER_PRINT[3]]);
}
export function bindBirthdayLock(root,p,{move,changeView,feedback=()=>{}}){
 const model=root.querySelector('[data-decoder-model]'),world=model?.closest('.decoder-world');if(!world)return ()=>{};
 const controller=new AbortController(),{signal}=controller,viewport=world.parentElement;
 const stopEntry=p.opened?()=>{}:bindTouchEntry(root,{kind:'number',length:4,submit:values=>{values.forEach((value,index)=>move({type:'set',index,value:Number(value)}));move({type:'submit'});}});
 const busy=()=>model.dataset.decoderBusy==='true';
 const armed=()=>model.hasAttribute('data-decoder-armed');
 const navigate=mode=>{changeView({decoderView:mode,decoderStage:decoderStage(p)});feedback('turn');};
 const inside=e=>{const b=viewport.getBoundingClientRect();return e&&e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom;};
 const paintWheel=(index,value)=>{const el=model.querySelector(`[data-decoder-wheel="${index}"]`);el?.querySelector('[data-decoder-number]')?.style.setProperty('--digit',mod(value,10));};
 const reset=()=>{if(!model.isConnected)return;paintDecoderPaper(model,p.offset);paintDecoderMirror(model,p.mirror);p.values.forEach((v,i)=>paintWheel(i,v));model.querySelector('[data-decoder-arm]')?.style.setProperty('transform',`rotateY(${p.opened?-112:0}deg)`);};
 const stop=pointerSession(root,{
  pick(e){
   if(busy()||armed())return null;
   const source=e.target.closest('[data-decoder-drag],button[data-decoder-wheel],[data-decoder-latch]');if(!source||!model.contains(source)||source.disabled)return null;
   if(source.hasAttribute('data-decoder-drag')&&model.dataset.decoderPaperBusy==='true')return null;
   return {source,kind:source.dataset.decoderDrag??(source.hasAttribute('data-decoder-wheel')?'wheel':'latch'),index:Number(source.dataset.decoderWheel)};
  },
  start(g){g.scale=world.getBoundingClientRect().width/DECODER_WORLD[0];g.step=g.source.getBoundingClientRect().height/3;g.last=p.values[g.index];},
  move(g,e){
   const dx=(e.clientX-g.x)/g.scale,dy=(e.clientY-g.y)/g.scale;
   if(g.kind==='paper'){g.offset=decoderPaperOffset([p.offset[0]+dx,p.offset[1]+dy]);paintDecoderPaper(model,g.offset);}
   if(g.kind==='mirror'){g.position=decoderMirrorPoint([p.mirror[0]+dx,p.mirror[1]+dy]);paintDecoderMirror(model,g.position);}
   if(g.kind==='wheel'){const value=p.values[g.index]+(g.y-e.clientY)/g.step;g.value=mod(Math.round(value),10);paintWheel(g.index,value);if(g.last!==g.value){feedback('detent');g.last=g.value;}}
   if(g.kind==='latch'){g.amount=Math.max(0,Math.min(1,p.opened?-dy/90:-dx/55));model.querySelector('[data-decoder-arm]').style.transform=`rotateY(${-Math.max(p.opened?112:0,g.amount*75)}deg)`;}
  },
  end(g,e,cancelled){
   if(cancelled||!inside(e))return;
   if(g.kind==='paper'&&g.offset)move({type:'paper-slide',offset:g.offset});
   if(g.kind==='mirror'&&g.position)move({type:'mirror-slide',position:g.position});
   if(g.kind==='wheel'&&g.value!==undefined)move({type:'set',index:g.index,value:g.value});
   if(g.kind==='latch'&&g.amount>=.5)move({type:p.opened?'lid':'submit'});
  },clear:reset,
 });
 root.addEventListener('click',e=>{
  if(busy()||Date.now()<Number(root.dataset.suppressUntil??0)||armed())return;
  const el=e.target.closest('[data-decoder-view],[data-decoder-close],[data-decoder-latch],[data-decoder-card-toggle],button[data-decoder-wheel],[data-decoder-drag]');if(!el||!root.contains(el))return;
  e.preventDefault();e.stopPropagation();
  if(el.dataset.decoderView){navigate(el.dataset.decoderView);return;}
  if(el.hasAttribute('data-decoder-card-toggle')){if(model.dataset.decoderPaperBusy!=='true')move({type:p.unfolded?'card-flip':'card-unfold'});return;}
  if(el.hasAttribute('data-decoder-close')){move({type:'lid'});return;}
  if(el.hasAttribute('data-decoder-latch')){move({type:p.opened?'lid':'submit'});return;}
  if(el.hasAttribute('data-decoder-wheel')){move({type:'turn',index:Number(el.dataset.decoderWheel),direction:1});return;}
  if(model.dataset.decoderCamera==='whole')navigate('paper');
 },{signal});
 root.addEventListener('keydown',e=>{
  if(busy()||e.ctrlKey||e.metaKey||e.altKey)return;
  const drag=e.target.closest('[data-decoder-drag]'),wheel=e.target.closest('button[data-decoder-wheel]');
  const arrow={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
  if(drag&&arrow){
   if(model.dataset.decoderPaperBusy==='true')return;
   e.preventDefault();e.stopPropagation();const mirror=drag.dataset.decoderDrag==='mirror',step=e.shiftKey?4:mirror?1:2,start=mirror?p.mirror:p.offset,next=start.map((v,i)=>v+arrow[i]*step);
   move(mirror?{type:'mirror-slide',position:decoderMirrorPoint(next)}:{type:'paper-slide',offset:decoderPaperOffset(next)});return;
  }
  if(!wheel)return;
  const index=Number(wheel.dataset.decoderWheel);let action;
  if(/^\d$/.test(e.key))action={type:'set',index,value:Number(e.key)};
  if(e.key==='ArrowUp'||e.key==='ArrowDown')action={type:'turn',index,direction:e.key==='ArrowUp'?1:-1};
  if(e.key==='Home'||e.key==='End')action={type:'set',index,value:e.key==='Home'?0:9};
  if(e.key==='Enter')action={type:'submit'};
  if(action||e.key==='ArrowLeft'||e.key==='ArrowRight'){
   e.preventDefault();e.stopPropagation();if(action)move(action);
   const next=action?.type==='set'?Math.min(3,index+1):Math.max(0,Math.min(3,index+(e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0)));
   root.querySelector(`[data-focus="number-${next}"]`)?.focus({preventScroll:true});
  }
 },{signal});
 return ()=>{stopEntry();stop();controller.abort();};
}
