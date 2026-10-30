import {ease,motionAllowed} from './shared.js';
import {beltDriveRatio,beltTrialDistance,beltFilmDistance} from '../../puzzles/belt.js';
const fields=root=>[...root.querySelectorAll('[data-belt-case]')];
export const beltAngle=el=>parseFloat(el?getComputedStyle(el).rotate:'')||0;
export function captureBelt(field){
 const selector=field.querySelector('[data-belt-selector-art]'),translation=name=>{const el=field.querySelector(`[data-belt-${name}]`);return el?parseFloat(getComputedStyle(el).translate)||0:0;};
 const scale=field.getBoundingClientRect().width/field.clientWidth,tools=[...field.querySelectorAll('[data-belt-tool]')].map(el=>{const parent=el.offsetParent.getBoundingClientRect(),s=getComputedStyle(el),translate=s.translate==='none'?'none':s.translate.split(' ').map(v=>parseFloat(v)*scale+'px').join(' ');return {index:Number(el.dataset.beltTool),node:el,x:parent.left+el.offsetLeft*scale,y:parent.top+el.offsetTop*scale,width:el.offsetWidth*scale,height:el.offsetHeight*scale,rotate:s.rotate,opacity:s.opacity,translate,scale:s.scale,origin:s.transformOrigin.split(' ').map((v,i)=>parseFloat(v)/[el.offsetWidth,el.offsetHeight][i]*100+'%').join(' ')};});
 return {state:JSON.parse(field.dataset.beltState),camera:field.getBoundingClientRect(),clip:field.parentElement.getBoundingClientRect(),canvas:field.querySelector('canvas'),tools,rotations:[...field.querySelectorAll('[data-belt-wheel]')].map(el=>[el.dataset.beltWheel,beltAngle(el)]),crank:beltAngle(field.querySelector('[data-belt-crank-art]')),preview:field.dataset.beltPreviewTurn===undefined?null:Number(field.dataset.beltPreviewTurn),selector:selector?getComputedStyle(selector).left:null,cross:beltAngle(field.querySelector('[data-belt-cross-art]')),film:translation('film'),gauge:translation('gauge')};
}
function returning(field,before,tool){
 if(!motionAllowed())return;
 const clip=before.clip,wrap=document.createElement('span');wrap.setAttribute('aria-hidden','true');wrap.dataset.beltReturn=tool?.index??'cotton';wrap.style.cssText=`position:fixed;left:${clip.left}px;top:${clip.top}px;width:${clip.width}px;height:${clip.height}px;overflow:hidden;pointer-events:none;z-index:30;`;
 let ghost;
 if(tool){ghost=tool.node.cloneNode(true);ghost.removeAttribute('data-belt-tool');ghost.style.cssText+=`;position:absolute;left:${tool.x-clip.left}px;top:${tool.y-clip.top}px;width:${tool.width}px;height:${tool.height}px;rotate:${tool.rotate};transform-origin:${tool.origin};`;}
 else{ghost=document.createElement('canvas');ghost.width=1536;ghost.height=1024;ghost.getContext('2d').drawImage(before.canvas,0,0);ghost.style.cssText=`position:absolute;left:${before.camera.left-clip.left}px;top:${before.camera.top-clip.top}px;width:${before.camera.width}px;height:${before.camera.height}px;`;}
 wrap.append(ghost);field.closest('dialog').append(wrap);
 const remove=()=>{clearTimeout(timer);wrap.remove();},timer=setTimeout(remove,400);
 ghost.animate([{opacity:tool?.opacity??1,translate:tool?.translate??'0 0',scale:tool?.scale??1},{opacity:0,translate:tool?'0 -12px':'0 4px',scale:tool?'1.05':'1'}],{duration:220,easing:ease,fill:'forwards'}).finished.catch(()=>{}).finally(remove);
}
function tween(el,from,to,duration=280){
 if(!el||!motionAllowed())return;
 el.getAnimations().forEach(a=>a.cancel());el.animate([from,to],{duration,easing:ease}).finished.catch(()=>{});
}
export function previewBeltCrank(field,p,degrees,initial=null){
 field.dataset.beltPreviewTurn=degrees;
 field.querySelectorAll('[data-belt-wheel]').forEach(el=>{const i=Number(el.dataset.beltWheel),base=initial?.rotations.find(([id])=>Number(id)===i)?.[1]??p.rotations[i];el.style.rotate=base+degrees*beltDriveRatio(p,i)+'deg';});
 const crank=field.querySelector('[data-belt-crank-art]');if(crank)crank.style.rotate=(initial?.crank??0)+degrees+'deg';
 for(const key of ['film','gauge']){const el=field.querySelector(`[data-belt-${key}]`);if(el)el.style.translate=(initial?.[key]??beltFilmDistance(p)*field.clientWidth/1536)+beltTrialDistance(p)*degrees/360*field.clientWidth/1536+'px 0';}
}
export function freezeBeltCamera(field){
 if(!field.getAnimations().some(a=>a.playState==='running'))return;
 const computed=getComputedStyle(field),matrix=computed.transform,origin=computed.transformOrigin;field.getAnimations().forEach(a=>a.cancel());field.style.transformOrigin=origin;field.style.transform=matrix;field.dataset.beltCameraHeld='true';
}
function camera(field,before){
 if(!before||!motionAllowed())return;const next=field.getBoundingClientRect();
 if(Math.abs(next.width-before.width)<.5&&Math.abs(next.left-before.left)+Math.abs(next.top-before.top)<1)return;
 tween(field,{transformOrigin:'0 0',transform:`translate(${before.left-next.left}px,${before.top-next.top}px) scale(${before.width/next.width})`},{transformOrigin:'0 0',transform:'none'},360);
}
export function releaseBeltCamera(field){
 if(!field.dataset.beltCameraHeld)return;const before=field.getBoundingClientRect();field.style.transform='';field.style.transformOrigin='';delete field.dataset.beltCameraHeld;camera(field,before);
}
export function settleBelt(field,before,{cancel=false}={}){
 const next=JSON.parse(field.dataset.beltState),trial=!cancel&&next.attempts>before.state.attempts;
 if(!cancel){
  for(const tool of before.tools??[])if(!next.fitted[tool.index])returning(field,before,tool);
  if(before.state.fitted[0]&&!next.fitted[0]&&before.canvas)returning(field,before,null);
  field.querySelectorAll('[data-belt-tool]').forEach(el=>{if(!before.state.fitted[Number(el.dataset.beltTool)]&&motionAllowed())el.animate([{opacity:0,translate:'0 -10px',scale:.96},{opacity:1,translate:'0 0',scale:1}],{duration:220,easing:ease}).finished.catch(()=>{});});
 }
 field.querySelectorAll('[data-belt-wheel]').forEach(el=>{
  const index=Number(el.dataset.beltWheel),from=before.rotations.find(([i])=>Number(i)===index)?.[1];if(from===undefined)return;
  const value=next.rotations[index],ratio=beltDriveRatio(before.state,index),wanted=trial?from+(360-(before.preview??0))*ratio:value;
  const to=value+Math.round((wanted-value)/360)*360;el.style.rotate=value+'deg';
  if(Math.abs(to-from)>.1)tween(el,{rotate:from+'deg'},{rotate:to+'deg'},trial?650:220);
 });
 const crank=field.querySelector('[data-belt-crank-art]');if(crank){crank.style.rotate='0deg';const wanted=trial?before.crank+360-(before.preview??0):0,to=Math.round(wanted/360)*360;tween(crank,{rotate:before.crank+'deg'},{rotate:to+'deg'},trial?650:220);}
 const selector=field.querySelector('[data-belt-selector-art]');if(selector&&Math.abs(parseFloat(before.selector)-parseFloat(getComputedStyle(selector).left))>.1)tween(selector,{left:before.selector},{left:selector.style.left},240);
 const cross=field.querySelector('[data-belt-cross-art]');if(cross&&before.cross!==beltAngle(cross))tween(cross,{rotate:before.cross+'deg'},{rotate:cross.style.rotate},280);
 for(const key of ['film','gauge']){
  const el=field.querySelector(`[data-belt-${key}]`);if(!el)continue;
  const start=before[key]??0,target=beltTrialDistance(next)*field.clientWidth/1536;
  if(trial&&!next.opened&&target&&motionAllowed()){
   // The spring returns an unsuccessful measuring stroke to its datum. A
   // successful stroke stays latched at the far mark and releases the film.
   el.getAnimations().forEach(a=>a.cancel());el.animate([{translate:start+'px 0',easing:ease},{translate:target+'px 0',offset:.45,easing:'linear'},{translate:target+'px 0',offset:.65,easing:ease},{translate:el.style.translate}],{duration:before.preview===null?1150:520,easing:'linear'}).finished.catch(()=>{});
  }else if(Math.abs(start-beltFilmDistance(next)*field.clientWidth/1536)>.1)tween(el,{translate:start+'px 0'},{translate:el.style.translate},trial?650:220);
 }
 if(!cancel)camera(field,before.camera);
 delete field.dataset.beltPreviewTurn;
}
export const beltMotion={capture:root=>fields(root).map(captureBelt),play(root,before){fields(root).forEach((field,i)=>{if(before[i])settleBelt(field,before[i]);});}};
