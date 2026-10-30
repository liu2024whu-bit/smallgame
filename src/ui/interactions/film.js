import {film as rule} from '../../puzzles/film.js';
import {createFilmPlayer} from '../../services/film-player.js';
import {filmPose} from '../../services/film-pose.js';
import {motionAllowed} from '../../services/motion.js';
import {icon} from '../dom.js';
import {filmDetail} from '../puzzles/film.js';

const controllers=new WeakMap();
// Stop on the actual painted pose before the core replaces a configuration.
export const prepareFilmMove=(root,action,next)=>controllers.get(root)?.(action,next);
export function bindFilm(root,progress,{view={},move,changeView,feedback=()=>{}}){
 const abort=new AbortController(),on=(element,type,fn,options={})=>element.addEventListener(type,fn,{...options,signal:abort.signal});
 const field=root.querySelector('.film-workbench');
 if(!field){on(root,'click',event=>{if(event.target.closest('[data-film-unfold]')){changeView({filmOpen:true,filmView:'whole'});feedback('turn');}});return ()=>abort.abort();}
 const button=field.querySelector('[data-film-play]'),seek=field.querySelector('[data-film-seek]');
 let previousId=view.filmPlayback?.id??-1;
 const player=createFilmPlayer({initial:view.filmPlayback,
  frame(id,phase){
   const pose=filmPose(id,progress.reverse[id],motionAllowed()?phase:phase<.5?0:1);
   field.querySelectorAll('.film-stage-papers .film-paper-turn').forEach((el,i)=>el.style.transform=`rotateY(${pose.angles[i]}deg)`);
   const petal=field.querySelector('.film-petal');petal.style.top=`${7+pose.time*68}%`;petal.style.rotate=`${-30+pose.time*90}deg`;
   seek.value=phase;seek.disabled=!progress.fitted[0]||id<0;seek.setAttribute('aria-label',id<0?'片头停格':`第${id+1}段胶片停格`);
   field.querySelectorAll('[data-film-clip]').forEach(el=>el.classList.toggle('frame-inspecting',Number(el.dataset.filmClip)===id));
   const held=field.querySelector('[data-film-sample]');
   if(held&&id>=0&&Number(held.dataset.filmSample)!==id){const focused=held.contains(document.activeElement);held.outerHTML=filmDetail(id,progress);if(focused)field.querySelector('.film-selected-clip button')?.focus({preventScroll:true});}
   view.filmPlayback=player.snapshot();
   if(id!==previousId&&id>=0){feedback('detent');previousId=id;}
  },
  state(snapshot){view.filmPlayback=snapshot;button.innerHTML=icon(snapshot.playing?'pause':'play')+(snapshot.playing?'停一停':snapshot.frames.length&&!snapshot.finished&&snapshot.phase>0?'接着放':snapshot.frames.length===1?'放这段':'放一遍');button.setAttribute('aria-pressed',snapshot.playing);}
 });
 const stop=()=>player.pause();
 const change=patch=>{stop();changeView(patch);};
 controllers.set(root,(action,next=rule.move(progress,action))=>{
  stop();const current=player.snapshot();
  if(current.id>=0){const phase=progress.reverse[current.id]!==next.reverse[current.id]?1-current.phase:current.phase;player.select(current.id,phase);}
 });
 on(root,'click',event=>{
  if(Date.now()<Number(root.dataset.suppressUntil??0)&&event.detail!==0)return;
  const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-film-inspect')){
   stop();player.play([Number(b.dataset.filmInspect)]);feedback('turn');
  }
  if(b.hasAttribute('data-film-play')){const s=player.snapshot();if(s.playing)stop();else if(s.frames.length)player.play(s.frames,{resume:!s.finished});else player.play([-1,...progress.order]);}
  if(b.hasAttribute('data-film-start'))player.play([-1,...progress.order]);
  if(b.hasAttribute('data-film-reverse'))move({type:'reverse',index:Number(b.dataset.filmReverse)});
  if(b.hasAttribute('data-film-face'))move({type:'flip',index:Number(b.dataset.filmFace)});
  if(b.hasAttribute('data-film-submit'))move({type:'submit'});
  if(b.hasAttribute('data-film-view')){change({filmView:b.dataset.filmView});feedback('turn');}
  if(b.hasAttribute('data-film-fold')){change({filmOpen:false});feedback('turn');}
 });
 on(root,'input',event=>{if(event.target===seek)player.seek(Number(seek.value));});
 on(root,'pointerdown',event=>{if(event.target.closest('[data-film-clip]'))stop();},{capture:true});
 on(root,'keydown',event=>{
  if(!event.altKey||!['ArrowLeft','ArrowRight'].includes(event.key)||progress.opened)return;
  const clip=event.target.closest('[data-film-clip]');if(!clip||clip.closest('[inert]'))return;
  event.preventDefault();const from=progress.order.indexOf(Number(clip.dataset.filmClip)),to=from+(event.key==='ArrowLeft'?-1:1);
  if(to>=0&&to<3)move({type:'reorder',from,to});
 });
 on(window,'blur',stop);on(document,'visibilitychange',()=>{if(document.hidden)stop();});
 const media=matchMedia('(prefers-reduced-motion: reduce)');on(media,'change',()=>{const s=player.snapshot();player.seek(s.phase);});
 player.pause();
 return ()=>{player.dispose();controllers.delete(root);abort.abort();};
}
