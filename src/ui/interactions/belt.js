import {pointerSession} from './pointer.js';
import {sweptTargets} from './sweep.js';
import {belt} from '../../puzzles/belt.js';
import {BELT_WHEELS,BELT_RATIO_POINTS,BELT_CAMERAS} from '../../data/belt.js';
import {paintBeltCord} from '../puzzles/belt-cord.js';
import {captureBelt,previewBeltCrank,settleBelt,freezeBeltCamera,releaseBeltCamera} from '../../services/motion/belt.js';
export function bindBelt(root,p,{move,feedback=()=>{}}){
 const field=root.querySelector('.belt-viewport [data-belt-case]');if(!field)return ()=>{};
 const [left,top,width,height]=BELT_CAMERAS[root.querySelector('.belt-workbench').dataset.beltMode];
 // Off-camera controls are also absent from tab order and accessibility.
 // Use source positions so an in-progress camera tween cannot hide the
 // controls that will be visible at its destination.
 for(const button of field.querySelectorAll('button')){
  const node=button.hasAttribute('data-belt-node')||button.hasAttribute('data-belt-end'),x=parseFloat(button.style.left)*15.36+(node?0:parseFloat(button.style.width)*15.36/2),y=parseFloat(button.style.top)*10.24+(node?0:parseFloat(button.style.height)*10.24/2);
  button.hidden=x<left||x>left+width||y<top||y>top+height;
 }
 paintBeltCord(field,p);
 const controller=new AbortController(),signal=controller.signal,buttons=[...field.querySelectorAll('[data-belt-node]')];
 const local=e=>{const b=field.getBoundingClientRect();return [(e.clientX-b.left)/b.width*1536,(e.clientY-b.top)/b.height*1024];};
 const inside=e=>{const b=field.parentElement.getBoundingClientRect();return e&&e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom;};
 function visit(g,index){
  if(g.state.route.at(-1)===index)return;
  const next=belt.move(g.state,{type:'node',index});
  if(next!==g.state){g.nodes.push(index);g.state=next;feedback('detent');}
 }
 const tracing=pointerSession(root,{
  pick(e){const source=e.target.closest('[data-belt-node],[data-belt-end]');if(!source||source.disabled)return null;freezeBeltCamera(field);return {source,index:source.hasAttribute('data-belt-end')?0:Number(source.dataset.beltNode),state:p,nodes:[]};},
  start(g){g.last={x:g.x,y:g.y};visit(g,g.index);},
  move(g,e){
   const pointer={x:e.clientX,y:e.clientY};for(const index of sweptTargets(g.last,pointer,buttons.map(b=>b.getBoundingClientRect()),1))visit(g,index);
   g.last=pointer;const at=local(e);paintBeltCord(field,g.state,at);
   buttons.forEach(button=>button.classList.toggle('belt-threaded',g.state.route.includes(Number(button.dataset.beltNode))));
  },
  end(g,e,cancelled){if(!cancelled&&inside(e)&&g.nodes.length)move({type:'trace',nodes:g.nodes});},
  clear(){if(field.isConnected){paintBeltCord(field,p);releaseBeltCamera(field);}buttons.forEach(b=>b.classList.remove('belt-threaded'));},
 });
 const adjusting=pointerSession(root,{
  pick(e){const source=e.target.closest('[data-belt-ratio]');if(!source||source.disabled)return null;freezeBeltCamera(field);return {source};},
  start(g){g.before=captureBelt(field);},
  move(g,e){const [x]=local(e);g.value=BELT_RATIO_POINTS.reduce((best,at,i)=>Math.abs(at-x)<Math.abs(BELT_RATIO_POINTS[best]-x)?i:best,0);const art=field.querySelector('[data-belt-selector-art]');art.style.left=(BELT_RATIO_POINTS[g.value]-35)/15.36+'%';if(g.notch!==g.value){g.notch=g.value;feedback('detent');}g.source.setAttribute('aria-valuenow',g.value+1);},
  end(g,e,cancelled){if(!cancelled&&inside(e)&&g.value!==undefined)move({type:'set-ratio',value:g.value});},
  clear(){if(!field.isConnected)return;const before=captureBelt(field),art=field.querySelector('[data-belt-selector-art]');art.style.left=(BELT_RATIO_POINTS[p.ratio]-35)/15.36+'%';settleBelt(field,before,{cancel:true});releaseBeltCamera(field);},
 });
 const cranking=pointerSession(root,{
  pick(e){const source=e.target.closest('[data-belt-crank]');if(!source||source.disabled)return null;freezeBeltCamera(field);const b=field.getBoundingClientRect(),cx=b.left+BELT_WHEELS[0].x/1536*b.width,cy=b.top+BELT_WHEELS[0].y/1024*b.height;return {source,cx,cy,last:Math.atan2(e.clientY-cy,e.clientX-cx),turn:0};},
  start(g){g.before=captureBelt(field);field.querySelectorAll('[data-belt-wheel],[data-belt-crank-art],[data-belt-film],[data-belt-gauge]').forEach(el=>el.getAnimations().forEach(a=>a.cancel()));},
  move(g,e){const a=Math.atan2(e.clientY-g.cy,e.clientX-g.cx);g.turn+=Math.atan2(Math.sin(a-g.last),Math.cos(a-g.last));g.last=a;g.degrees=Math.max(0,Math.min(360,g.turn*180/Math.PI));previewBeltCrank(field,p,g.degrees,g.before);const notch=Math.floor(g.degrees/90);if(g.notch!==notch){g.notch=notch;feedback('turn');}},
  end(g,e,cancelled){if(!cancelled&&inside(e)&&g.degrees>=300)move({type:'crank'});},
  clear(){if(!field.isConnected)return;const before=captureBelt(field);previewBeltCrank(field,p,0);settleBelt(field,before,{cancel:true});releaseBeltCamera(field);},
 });
 root.addEventListener('keydown',e=>{
  const slider=e.target.closest('[data-belt-ratio]');if(!slider)return;
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();move({type:'set-ratio',value:e.key==='Home'?0:e.key==='End'?2:Math.max(0,Math.min(2,p.ratio+(e.key==='ArrowRight'?1:-1)))});
 },{signal});
 return ()=>{tracing();adjusting();cranking();controller.abort();};
}
