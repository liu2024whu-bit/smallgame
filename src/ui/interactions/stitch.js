import {pointerSession} from './pointer.js';
import {mappedPlaneMatrix,projectedPoint} from '../raster-plane.js';
import {stitchViewKey,stitchPoint,stitchNeedlePoint} from '../../data/stitch.js';
import {paintStitchCotton,hydrateStitchCotton} from '../stitch-cotton.js';
import {settleAnimations,motionAllowed} from '../../services/motion/shared.js';

export function prepareStitchMove(root,move){
 if(!['hole','tie','trim','fit','unfit'].includes(move.type)||!root.contains(document.activeElement)||!document.activeElement.closest('.stitch-workbench'))return;
 root.dataset.stitchFocus='true';return ()=>{delete root.dataset.stitchFocus;};
}

export function bindStitch(root,p,{move,view,changeView,feedback}){
 hydrateStitchCotton(root);
 const field=root.querySelector('.word-binding-content .stitch-workbench');if(!field)return ()=>{};
 const controller=new AbortController(),back=field.dataset.stitchBack==='true',plane=field.closest('[data-assembly-quad]'),world=field.closest('.word-lock-world');
 field.classList.toggle('stitch-sample-open',!!view.stitchSample);
 const inverse=mappedPlaneMatrix(JSON.parse(plane.dataset.assemblyQuad),[[0,0],[plane.offsetWidth,0],[plane.offsetWidth,plane.offsetHeight],[0,plane.offsetHeight]]);
 const point=event=>{const r=world.getBoundingClientRect(),scale=r.width/1672;return projectedPoint(inverse,[(event.clientX-r.left)/scale,(event.clientY-r.top)/scale]);};
 const focusWorkingEnd=()=>{delete field.dataset.stitchRestoreFocus;(field.querySelector('[data-stitch-needle]')??field.querySelector('.stitch-face:not([inert]) [data-stitch-pull]:not(:disabled)')??field.querySelector('.assembly-snips:not(:disabled)')??field.querySelector('.stitch-tool-button[data-tool-target]:not(:disabled)')??root.querySelector('[data-stitch-camera="whole"]'))?.focus({preventScroll:true});};
 field.addEventListener('stitch-settled',()=>{if(field.dataset.stitchRestoreFocus)focusWorkingEnd();},{signal:controller.signal});
 root.addEventListener('keydown',event=>{
  const from=event.target.closest('[data-stitch-hole],[data-stitch-needle]');if(!from||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)||event.altKey||event.metaKey||event.ctrlKey)return;
  event.preventDefault();event.stopPropagation();const origin=from.hasAttribute('data-stitch-hole')?stitchPoint(Number(from.dataset.stitchHole),back):p.path.length?stitchPoint(p.path.at(-1),back):stitchNeedlePoint(p,back),direction={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[event.key];
  const candidates=[...field.querySelectorAll('.stitch-face:not([inert]) [data-stitch-hole]:not(:disabled)')].map(button=>{const pos=stitchPoint(Number(button.dataset.stitchHole),back),dx=pos[0]-origin[0],dy=pos[1]-origin[1],along=dx*direction[0]+dy*direction[1],across=Math.abs(dx*direction[1]-dy*direction[0]);return {button,along,score:Math.hypot(dx,dy)+across*1.5};}).filter(c=>c.button!==from&&c.along>8).sort((a,b)=>a.score-b.score);
  candidates[0]?.button.focus({preventScroll:true});
 },{signal:controller.signal});
 root.addEventListener('click',event=>{
  if(event.target.closest('[data-stitch-turn]')){changeView({stitchKey:stitchViewKey(p),stitchBack:!back});feedback('turn');}
  else if(event.target.closest('[data-stitch-sample]')){changeView({stitchSample:!view.stitchSample,stitchCamera:'whole'});feedback('turn');}
  else if(event.target.closest('[data-stitch-camera]')){changeView({stitchCamera:event.target.closest('[data-stitch-camera]').dataset.stitchCamera,stitchSample:false});feedback('turn');}
 },{signal:controller.signal});
 const stop=pointerSession(root,{
  pick(event){const source=event.target.closest('[data-stitch-needle],[data-stitch-pull]');if(!source||!field.contains(source)||source.disabled)return null;if(source.hasAttribute('data-stitch-needle')){const s=getComputedStyle(source),left=s.left,top=s.top;source.getAnimations().forEach(a=>a.cancel());source.style.left=left;source.style.top=top;}return {source,pull:source.hasAttribute('data-stitch-pull')};},
  start(g){settleAnimations(field);g.origin=point({clientX:g.x,clientY:g.y});g.source.classList.add('stitch-dragging');g.grab=g.origin.map((v,i)=>v-parseFloat(i?g.source.style.top:g.source.style.left));},
  move(g,event){
   const [x,y]=point(event);g.position=[x,y];
   if(g.pull){
    const dx=x-g.origin[0],dy=y-g.origin[1],length=Math.hypot(dx,dy);g.amount=Math.min(1,length/140);
    g.source.style.translate=`${dx*.45}px ${dy*.45}px`;g.source.style.scale=1-g.amount*.25;paintStitchCotton(field,p,{tight:g.amount});
   }else{
    const tip=[x-g.grab[0],y-g.grab[1]];g.source.style.left=tip[0]+'px';g.source.style.top=tip[1]+'px';paintStitchCotton(field,p,{tail:tip});
    const candidates=[...field.querySelectorAll('.stitch-face:not([inert]) [data-stitch-hole]:not(:disabled)')],inside=x>=0&&x<=1536&&y>=0&&y<=1024;
    g.target=inside?candidates.find(button=>{const [hx,hy]=stitchPoint(Number(button.dataset.stitchHole),back);return Math.hypot(tip[0]-hx,tip[1]-hy)<=52;})??null:null;candidates.forEach(button=>button.classList.toggle('stitch-drop-ready',button===g.target));
   }
  },
  end(g,_,cancelled){if(!cancelled&&(g.pull?g.amount>=.75:g.target))move(g.pull?{type:'tie'}:{type:'hole',index:Number(g.target.dataset.stitchHole)});else g.cancelled=true;},
  clear(){
   field.querySelectorAll('.stitch-drop-ready').forEach(button=>button.classList.remove('stitch-drop-ready'));
   const source=field.querySelector('.stitch-dragging');if(source){const from={left:source.style.left,top:source.style.top,translate:source.style.translate||'0 0',scale:source.style.scale||'1'};source.classList.remove('stitch-dragging');source.style.removeProperty('translate');source.style.removeProperty('scale');if(source.hasAttribute('data-stitch-needle')){const position=source.dataset.rest?.split(',')??[];if(position.length){source.style.left=position[0];source.style.top=position[1];}}
    if(motionAllowed()&&source.isConnected)source.animate([from,{left:source.style.left,top:source.style.top,translate:'0 0',scale:1}],{duration:190,easing:'ease-out'});
   }
   if(field.isConnected)paintStitchCotton(field,p);
  },
 });
 const needle=field.querySelector('[data-stitch-needle]');if(needle)needle.dataset.rest=needle.style.left+','+needle.style.top;
 if(root.dataset.stitchFocus){delete root.dataset.stitchFocus;if(field.dataset.stitchMoving)field.dataset.stitchRestoreFocus='true';else focusWorkingEnd();}
 return ()=>{stop();controller.abort();};
}
