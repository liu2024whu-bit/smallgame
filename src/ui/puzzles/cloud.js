import {cloudAngles,CLOUD_LINKS} from '../../puzzles/rotors.js';
import {CLOUD_GEOMETRY as G,CLOUD_GLYPHS,CLOUD_MARKS} from '../../data/cloud.js';
import {inventory} from '../../core/state.js';
import {atlas,itemSprite,icon} from '../dom.js';
const degrees=(values,index,half,side)=>cloudAngles(values)[index][half]*90*side;
const rotations=(values,index,side)=>[degrees(values,index,0,side),degrees(values,index,1,side)];
const coordinates=point=>`left:${point.x/1536*100}%;top:${point.y/1024*100}%;width:${point.r*2/1536*100}%;`;
const paired=(values,index)=>{const [a,b]=cloudAngles(values)[index];return Math.abs(((a-b+2)%4+4)%4-2)<.03;};
export function cloudMark(index,className=''){
 return `<svg class="cloud-mark ${className}" viewBox="-12 -12 24 24" aria-hidden="true"><path d="${CLOUD_MARKS[index].path}"/></svg>`;
}
function fragment(index,half){
 const stem=half?'M100 53Q104 44 100 38':'M100 14Q96 25 100 32';
 return `<svg class="cloud-fragment" viewBox="0 0 200 200" aria-hidden="true"><path class="cloud-paper-stem" d="${stem}"/><g class="cloud-fragment-tip" transform="translate(100 35) scale(${half?-1.2:1.2} 1.2)"><path d="${CLOUD_GLYPHS[index].path}"/></g></svg>`;
}
function paperHandles(values,index,side,{active,ownsThread,done}){
 const link=CLOUD_LINKS[index];
 return `<div class="cloud-handles">${[0,1].map(half=>{
  const input=half?link.inner:link.outer,rate=side*(half?-link.ratio:1),direction=Math.sign(rate);
  const action=done?'':ownsThread?`data-action="use-direct" data-id="thread" data-tool-target="cloud-wind:${input}:${direction}"`:`data-pmove='${JSON.stringify({type:'turn',index:input,direction})}'`;
  return `<button class="cloud-paper-handle" ${action} data-cloud-handle="${input}" data-cloud-rate="${rate}" data-cloud-ring="${half}" data-focus="cloud-paper-${index}-${half}${active?'':'-off'}" role="slider" tabindex="${active&&!done?0:-1}" aria-label="${CLOUD_GLYPHS[index].name}${half?'内':'外'}纸环" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${values[input]}" style="clip-path:${ringClips[half]}" ${done?'disabled':''}></button>`;
 }).join('')}</div>`;
}
const ringClips=[[96,71],[70,46]].map(([outer,inner])=>{
 const points=(radius,sign)=>Array.from({length:49},(_,i)=>{const a=i/48*Math.PI*2*sign;return `${(50+radius/2*Math.cos(a)).toFixed(2)}% ${(50+radius/2*Math.sin(a)).toFixed(2)}%`;});
 return `polygon(evenodd,${[...points(outer,1),...points(inner,-1)].join(',')})`;
});
export function cloudPair(values,point,side=1,options={miniature:true}){
 const i=point.index,link=CLOUD_LINKS[i],angles=rotations(values,i,side);
 return `<div class="cloud-pair" data-cloud-pair="${i}" data-paired="${paired(values,i)}" role="group" aria-label="${CLOUD_GLYPHS[i].name}的两片纸，${paired(values,i)?'合在一起了':'还分着'}" style="${coordinates(point)}">${[0,1].map(half=>`<div class="cloud-orbit ${half?'cloud-orbit-inner':'cloud-orbit-outer'}" data-cloud-rotor="half-${i}-${half}" data-cloud-input="${half?link.inner:link.outer}" data-cloud-step="${side*(half?-link.ratio:1)}" style="rotate:${angles[half]}deg">${atlas('cloudParts',half,{className:'cloud-paper-ring'})}${fragment(i,half)}</div>`).join('')}<span class="cloud-center-pin"></span>${options.miniature?'':paperHandles(values,i,side,options)}</div>`;
}
function winder(values,index,back,active,ownsThread,done,miniature){
 const side=back?-1:1,x=G.spindles[back?2-index:index],mark=cloudMark(index);
 const art=`${atlas('cloudParts',2,{className:'cloud-winder-art'})}<svg class="cloud-loop" viewBox="0 0 100 100" aria-hidden="true"><path d="M9 90Q5 63 16 44C26 6 87 11 86 52S25 93 15 59Q9 34 21 16"/></svg>${mark}<span class="cloud-detents" aria-hidden="true">${[0,1,2,3].map(turn=>`<i style="rotate:${turn*90}deg"></i>`).join('')}</span>`;
 const tag=miniature?'span':'button';
 const action=ownsThread?`data-action="use-direct" data-id="thread" data-tool-target="cloud-wind:${index}:${side}"`:`data-pmove='${JSON.stringify({type:'turn',index,direction:side})}'`;
 const attrs=miniature?'':`${action} data-cloud-winder="${index}" data-cloud-handle="${index}" data-cloud-rate="${side}" data-focus="${active?'cloud-winder':'cloud-winder-off'}-${index}" role="slider" aria-label="${CLOUD_MARKS[index].name}纹线轴" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${values[index]}" aria-valuetext="刻痕在${['上','右','下','左'][(side*values[index]+4)%4]}侧" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home End" ${done?'disabled':''}`;
 return `<${tag} class="cloud-winder" ${attrs} style="left:${x/1536*100}%;top:${G.spindleY/1024*100}%;"><span class="cloud-winder-rotor" data-cloud-rotor="winder-${back?1:0}-${index}" data-cloud-input="${index}" data-cloud-step="${side}" style="rotate:${side*values[index]*90}deg">${art}</span></${tag}>`;
}
function gearPath({x,y,r,teeth},phase=0){
 return Array.from({length:teeth*4},(_,i)=>{
  const angle=i*Math.PI/(teeth*2)+phase,radius=i%4<2?r:r*.85;
  return (i?'L':'M')+(x+Math.cos(angle)*radius).toFixed(3)+' '+(y+Math.sin(angle)*radius).toFixed(3);
 }).join('')+'Z';
}
// Equal-radius sheaves keep the gear ratio; their cord follows both tangent runs.
function beltPath(from,to,r){
 const dx=to.x-from.x,dy=to.y-from.y,length=Math.hypot(dx,dy),nx=-dy/length*r,ny=dx/length*r;
 const point=(center,sign)=>`${(center.x+nx*sign).toFixed(2)} ${(center.y+ny*sign).toFixed(2)}`;
 return `M${point(from,-1)}L${point(to,-1)}A${r} ${r} 0 0 1 ${point(to,1)}L${point(from,1)}A${r} ${r} 0 0 1 ${point(from,-1)}Z`;
}
function backDrive(values){
 const {large,small,shaft}=G.drive,a={x:G.spindles[2],y:G.spindleY};
 const gear=(name,shape,step,phase=0)=>`<g data-cloud-rotor="gear-${name}" data-cloud-input="2" data-cloud-step="${step}" style="rotate:${values[2]*step*90}deg;transform-origin:${shape.x}px ${shape.y}px"><path class="cloud-gear" d="${gearPath(shape,phase)}"/></g>`;
 const sheave=(radius,input,step)=>`<g data-cloud-rotor="shaft-${input}" data-cloud-input="${input}" data-cloud-step="${step}" style="rotate:${values[input]*step*90}deg;transform-origin:${shaft.x}px ${shaft.y}px"><circle cx="${shaft.x}" cy="${shaft.y}" r="${radius}"/><path class="cloud-sheave-spoke" d="M${shaft.x-radius+5} ${shaft.y}H${shaft.x+radius-5}M${shaft.x} ${shaft.y-radius+5}V${shaft.y+radius-5}"/></g>`;
 return `<svg class="cloud-drive" viewBox="0 0 1536 1024" aria-hidden="true">
  <path class="cloud-belt" d="${beltPath(a,shaft,shaft.outer)}${beltPath(small,shaft,shaft.inner)}"/>
  ${gear('large',large,-1)}${gear('small',small,2,Math.PI/8)}
  ${sheave(shaft.outer,0,-1)}${sheave(shaft.inner,2,2)}
  <circle cx="${small.x}" cy="${small.y}" r="9"/>
 </svg>`;
}
function doors(done){
 return G.doors.map((door,index)=>`<div class="cloud-pocket pocket-${index}" style="left:${door.x/1536*100}%;top:${door.y/1024*100}%;width:${door.w/1536*100}%;height:${door.h/1024*100}%"><span class="cloud-found">${itemSprite(index?3:2)}</span><span class="cloud-wing" data-cloud-wing="${index}" style="rotate:y ${done?door.angle:0}deg;transform-origin:${door.pivot}% 50%;">${atlas('cloudDoors',index,{className:'cloud-wing-art'})}${atlas('cloudFigures',index,{className:'cloud-figure',label:index?'矮人面具、正太短发、武士裤与蝙蝠斗篷的小纸人':'黑脸、经典巫师帽、武士裤与蝙蝠斗篷的高纸人'})}</span></div>`).join('');
}
function face(progress,{back,active,ownsThread,done,miniature}){
 const side=back?-1:1;
 const flip=miniature?'':`<button class="cloud-flip" data-action="cloud-face" data-back="${!back}" data-cloud-flip data-focus="${active?'cloud-turn':'cloud-turn-off'}" aria-label="${back?'看看纸景正面':'看看纸景背面'}">${icon('repeat')}<span>另一面</span></button>`;
 return `<div class="cloud-face ${back?'cloud-face-back':'cloud-face-front'}" ${active?'':'inert aria-hidden="true"'}>${atlas(back?'cloudBack':'cloudFront',0,{className:'cloud-chassis',label:back?'同一纸景的木背板':'窗边的云中纸景'})}${back?backDrive(progress.values):doors(done)}${(back?G.back:G.front).map(point=>cloudPair(progress.values,point,side,{active,ownsThread,done,miniature})).join('')}${[0,1,2].map(i=>winder(progress.values,i,back,active,ownsThread,done,miniature)).join('')}${flip}</div>`;
}
export function cloudCase(progress,{back=false,ownsThread=true,done=false,miniature=false}={}){
 return `<div class="cloud-case ${done?'cloud-open':''}" data-cloud-values="${progress.values.join(',')}" data-cloud-side="${back?-1:1}" data-cloud-thread="${ownsThread}"><div class="cloud-turntable" style="--cloud-face:${back?180:0}deg">${[false,true].map(faceBack=>face(progress,{back:faceBack,active:faceBack===back,ownsThread,done,miniature})).join('')}</div></div>`;
}
export function renderCloud(progress,{state,view={}}){
 return `<div class="cloud-stage">${cloudCase(progress,{back:!!view.back,ownsThread:inventory(state).includes('thread'),done:state.solved.includes('cloud')})}</div>`;
}
export function cloudMiniature(progress,done){
 const g=G.world;return `<div class="world-cloud" style="left:${g.left}%;top:${g.top}%;width:${g.width}%;" aria-hidden="true" inert ${done?'data-world-change="cloud"':''}>${cloudCase(progress,{done,miniature:true})}</div>`;
}
export function updateCloudPreview(field,values,input=null){
 const pairs=cloudAngles(values);
 field.querySelectorAll('[data-cloud-rotor]').forEach(el=>{
  const owner=Number(el.dataset.cloudInput),step=Number(el.dataset.cloudStep),key=el.dataset.cloudRotor;
  if(input!==null&&input!==owner)return;
  if(key.startsWith('half-')){
   const [,index,half]=key.split('-').map((value,i)=>i?Number(value):value),side=step/(half?-CLOUD_LINKS[index].ratio:1);
   el.style.rotate=pairs[index][half]*90*side+'deg';
  }else el.style.rotate=values[owner]*90*step+'deg';
 });
 field.querySelectorAll('[data-cloud-pair]').forEach(el=>{const i=Number(el.dataset.cloudPair);el.dataset.paired=paired(values,i);el.setAttribute('aria-label',CLOUD_GLYPHS[i].name+'的两片纸，'+(paired(values,i)?'合在一起了':'还分着'));});
}
