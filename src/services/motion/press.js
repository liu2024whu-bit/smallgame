import {ease} from './shared.js';
import {animatePressHandle,readPressStroke} from '../press-handle.js';
const box=root=>root.querySelector('.press-case');
export const pressMotion={
 capture(root){
  const field=box(root);if(!field)return root.querySelector('.press-reading')?{inspection:true}:null;
  const source=root.querySelector('.press-plate.drag-source'),ghost=root.querySelector('.reorder-ghost.press-plate');
  return {inspection:false,opened:field.dataset.pressOpen,count:field.dataset.pressCount,done:field.classList.contains('press-done'),
   lid:getComputedStyle(field.querySelector('.press-lid')).translate,
   plates:new Map([...field.querySelectorAll('[data-plate]')].map(el=>[el.dataset.plate,ghost&&el===source?ghost.getBoundingClientRect():el.getBoundingClientRect()])),
   stroke:readPressStroke(field.querySelector('.press-arm')),
   proof:field.querySelector('.press-proof')?.dataset.proof,
   proofOpacity:getComputedStyle(field.querySelector('.press-proof')).opacity,
   proofTranslate:getComputedStyle(field.querySelector('.press-proof')).translate,
   drawer:getComputedStyle(field.querySelector('.press-drawer')).top,
   drawerClip:getComputedStyle(field.querySelector('.press-drawer')).clipPath};
 },
 play(root,before){
  if(!before)return;
  const reading=root.querySelector('.press-reading');
  if(!!reading!==before.inspection){
   (reading??root.querySelector('.press-workbench'))?.animate([{opacity:.55,translate:'0 7px'},{opacity:1,translate:'0 0'}],{duration:240,easing:ease});
  }
  const field=box(root);if(!field||before.inspection)return;
  const opened=field.dataset.pressOpen,done=field.classList.contains('press-done');
  const lid=field.querySelector('.press-lid'),arm=field.querySelector('.press-arm'),drawer=field.querySelector('.press-drawer');
  const lidDestination=getComputedStyle(lid).translate;
  if(before.lid!==lidDestination)lid.animate([{translate:before.lid},{translate:lidDestination}],{duration:opened===before.opened?360:650,delay:opened!==before.opened&&opened==='true'?150:0,easing:ease,fill:'backwards'});
  if(opened!==before.opened){
   const entering=opened==='true';
   field.querySelector('.press-latch-art').animate([{rotate:entering?'0deg':'-26deg'},{rotate:entering?'-26deg':'0deg'}],{duration:240,easing:'ease-out'});
   const book=field.querySelector('.press-book-cue');book.style.display='block';
   book.animate([{opacity:0,translate:'-12px 4px'},{opacity:1,translate:'0 0',offset:.2},{opacity:1,translate:'0 -2px',offset:.5},{opacity:0,translate:'-14px 4px'}],{duration:600,easing:'ease-in-out'});
  }
  for(const el of field.querySelectorAll('[data-plate]')){
   const from=before.plates.get(el.dataset.plate),to=el.getBoundingClientRect();if(!from?.width)continue;
   const dx=from.left-to.left,dy=from.top-to.top;
   if(Math.abs(dx)+Math.abs(dy)>1)el.animate([{translate:dx+'px '+dy+'px'},{translate:'0 0'}],{duration:300,easing:ease});
  }
  const proof=field.querySelector('.press-proof');
  if((Number(before.count)+1)%65536===Number(field.dataset.pressCount)){
   animatePressHandle(arm,[[0,before.stroke],[.2,1],[.48,1],[1,0]],500);
   if(proof){
    const body=field.getBoundingClientRect(),paper=proof.getBoundingClientRect();
    const dx=body.left+body.width*.43-paper.left-paper.width/2,dy=body.top+body.height*.84-paper.top-paper.height/2;
    proof.animate([{opacity:0,translate:`${dx}px ${dy}px`,scale:.9},{opacity:1,translate:`${dx*.45}px ${dy*.5-10}px`,scale:.97,offset:.48},{opacity:1,translate:'0 0',scale:1}],{duration:480,delay:160,fill:'backwards',easing:ease});
   }
  }else{
   if(before.stroke)animatePressHandle(arm,[[0,before.stroke],[1,0]],220);
   if(proof?.dataset.proof===before.proof&&Number(before.proofOpacity)<1&&before.proof)proof.animate([{opacity:before.proofOpacity,translate:before.proofTranslate},{opacity:1,translate:'0 0'}],{duration:220,easing:ease});
  }
  const destination=getComputedStyle(drawer);
  if(before.drawer!==destination.top||before.drawerClip!==destination.clipPath)drawer.animate([{top:before.drawer,clipPath:before.drawerClip},{top:destination.top,clipPath:destination.clipPath}],{duration:done===before.done?300:600,delay:done!==before.done?180:0,fill:'backwards',easing:ease});
 }
};
