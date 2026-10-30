import {LIGHT_GEOMETRY as G,lightLayout,LIGHT_PART_REGISTRATION} from '../../data/light.js';
import {ASSETS} from '../../data/assets.js';
import {ASSET_LAYOUTS} from '../../data/asset-layouts.js';
import {filmCenter,mirrorCircle,bookHeight} from '../../puzzles/light-geometry.js';
import {project,lightPaper,mirrorQuad,filmFrameQuad,filmSheetQuad,bookQuad,cordQuad,paperQuad,paperDrawing,printQuad,bookProjectionQuad,drawingMasks,lampQuad,lampSwitch,bookArmQuad,uprightQuad,washQuad} from './light-raster.js';
import {rasterPlane,paintPlane} from '../raster-plane.js';
import {escape} from '../dom.js';
const pos=([x,y],view)=>{const [left,top,width,height]=lightLayout(view).view;return `left:${(x-left)/width*100}%;top:${(y-top)/height*100}%;`;};
const flat=([x,y,w,h])=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const sprite=(asset,index,quad,name='',className='',cutout=null)=>rasterPlane(asset,index,quad,{name,className,cutout});
const pmove=move=>`data-pmove="${escape(JSON.stringify(move))}"`;
export function lightControlPoint(values,index,view=false){
 if(index===0){const c=filmCenter(values);return project([c[0],c[1],c[2]-95],view);}
 if(index===1)return project([220,G.bookMountY,bookHeight(values)],view);
 return project(mirrorCircle(values)[48],view);
}
const flipPoint=(values,view)=>{const c=filmCenter(values),p=project([c[0],c[1],c[2]+85],view);return [p[0]+75,p[1]+25];};
function controls(progress,done,tall){
 const layout=lightLayout(tall);
 const grips=[0,1,2].map(index=>{
  const actual=index===2?1:index===1?2:0,point=lightControlPoint(progress.values,index,tall),fitted=progress.fitted[actual];
  const slider=fitted?`<button class="light-grip light-grip-${index}" data-light-adjust="${index}" data-focus="light-grip-${index}" ${pmove({type:'turn',index,direction:1})} role="slider" aria-label="${['透片滑架','书签升降夹','圆镜朝向'][index]}" aria-orientation="${index===1?'vertical':'horizontal'}" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${progress.values[index]}" aria-valuetext="第${progress.values[index]+1}档，共四档" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home End" style="${pos(point,tall)}" ${done?'disabled':''}><span class="sr-only">可以拖动，也可以用方向键</span></button>`:'';
  return slider;
 }).join('');
 const power=`<button class="light-power" ${pmove({type:'power'})} data-focus="light-power" aria-label="${progress.lit?'关灯':'开灯'}" aria-pressed="${progress.lit}" style="${pos(lampSwitch(tall),tall)}" ${done?'disabled':''}></button>`;
 const flip=progress.fitted[0]?`<button class="light-flip" ${pmove({type:'flip'})} data-focus="light-flip" aria-label="翻过透片" aria-pressed="${progress.flipped}" style="${pos(flipPoint(progress.values,tall),tall)}" ${done?'disabled':''}><span>另一面</span></button>`:'';
 const [x,y,w,h]=layout.pencil;
 const pencil=done?'':`<button class="light-pencil" ${pmove({type:'trace'})} data-light-pencil data-focus="light-pencil" aria-label="拿铅笔描一笔，也可以拖到纸上" style="${pos([x+w/2,y+h/2],tall)}width:${w/layout.view[2]*100}%;height:${Math.max(8,h/layout.view[3]*100)}%;"><span class="light-pencil-label">描一笔</span></button>`;
 const sockets=[0,1,2].filter(index=>!progress.fitted[index]&&!done).map(index=>`<span class="light-socket" data-tool-overlap data-tool-target="light-fit:${index}" data-light-slot="${index}" style="${pos(slotPoint(progress.values,index,tall),tall)}" aria-hidden="true"></span>`).join('');
 return grips+power+flip+pencil+sockets;
}
const slotPoint=(values,index,view)=>index===0?project(filmCenter(values),view):index===1?project(G.mirror,view):lightControlPoint(values,1,view);
function standQuad(values,view){
 const c=filmCenter(values),frame=ASSET_LAYOUTS.lightSupports.frames[1],p=LIGHT_PART_REGISTRATION.filmPost;
 return uprightQuad(frame,{x:c[0],y:300,z:0,height:(c[2]-62)*frame[3]/(p.footY-p.clipY),width:200,anchor:[(p.x-frame[0])/frame[2],(p.footY-frame[1])/frame[3]]},view);
}
function fixture(index,x,y,z,width,height,view){return uprightQuad(ASSET_LAYOUTS.lightFixtures.frames[index],{x,y,z,width,height},view);}
function handleQuad(values,index,view){const [x,y]=lightControlPoint(values,index,view);return flat([x-20,y-10,40,26]);}
export function lightArtwork(pose,{environment=true,view=false,painted=false}={}){
 const layout=lightLayout(view),tall=view===true||view==='tall',book=lightControlPoint(pose.values,1,view),source=project(G.source,view);
 const railQuad=[[196,260,0],[526,260,0],[526,350,0],[196,350,0]].map(p=>project(p,view));
 const fixed=(...args)=>painted?'':sprite(...args);
 return `${environment?`<img class="light-desk" src="${tall?ASSETS.lightDeskTall:ASSETS.lightDesk}" alt="" draggable="false">`:''}
  ${fixed('lightLamp',0,lampQuad(view),'lamp','light-lamp-art')}
  <div class="light-bulb" style="opacity:${Number(pose.lit)*.36}">${sprite('lightWashes',0,flat([source[0]-90,source[1]-75,180,150]),'bulb')}</div>
  ${fixed('lightBracket',0,bookArmQuad(view),'book-arm')}
  ${fixed('lightSupports',3,railQuad,'rail')}
  ${sprite('lightSupports',1,standQuad(pose.values,view),'film-post')}
  ${fixed('lightFixtures',1,fixture(1,700,300,-5,75,110,view),'mirror-post')}
  <div class="light-tool" data-light-tool="2" style="opacity:${Number(pose.fitted[2])}">${sprite('lightBook',0,bookQuad(pose.values,view),'book')}${sprite('lightBook',1,cordQuad(pose.values,view),'cord')}</div>
  ${sprite('lightSupports',2,flat([book[0]-21,book[1]-8,42,28]),'book-clamp')}
  <div class="light-tool light-film-art" data-light-tool="0" style="opacity:${Number(pose.fitted[0])}">${sprite('lightFilm',0,filmSheetQuad(pose.values,pose.flipped,view),'film')}${sprite('lightPrint',0,printQuad(pose.values,pose.flipped,true,view),'physical','light-physical-print')}</div>
  ${sprite('lightParts',1,filmFrameQuad(pose.values,pose.flipped,view),'holder','light-holder',LIGHT_PART_REGISTRATION.film)}
  <div class="light-tool" data-light-tool="1" style="opacity:${Number(pose.fitted[1])}">${sprite('lightParts',0,mirrorQuad(pose.values,view),'mirror')}</div>
  ${fixed('lightSupports',0,uprightQuad(ASSET_LAYOUTS.lightSupports.frames[0],{x:700,y:702,z:-15,width:240,height:210,anchor:[.5,.98]},view),'easel')}
  <div class="light-paper-art">${sprite('lightParts',3,paperQuad(view),'paper')}</div>
  ${paperDrawing(pose,view)}
  ${[0,1,2].map(index=>`<div data-light-handle="${index}" style="opacity:${index===2?Number(pose.fitted[1]):1}">${sprite('lightFixtures',5,handleQuad(pose.values,index,view),'handle-'+index)}</div>`).join('')}
  ${view==='room'?'':sprite('lightFixtures',4,flat(layout.pencil),'pencil','light-pencil-art')}`;
}
export function lightCase(progress,{done=false,miniature=false,environment=true,tall=false}={}){
 const view=miniature?'room':tall,layout=lightLayout(view),paper=lightPaper(view);
 const clip=paper.map(([x,y])=>(x-layout.view[0])/layout.view[2]*100+'% '+(y-layout.view[1])/layout.view[3]*100+'%').join(',');
 // SVG is solely a responsive viewport. Every visible element inside it is a
 // painted bitmap; clip geometry never appears as artwork or a light beam.
 return `<div class="light-case ${tall?'light-portrait':''} ${done?'light-done':''}" data-light-case data-light-tall="${tall}" data-light-layout="${miniature?'room':tall?'tall':'wide'}" data-light-state="${escape(JSON.stringify(progress))}" ${miniature?'inert aria-hidden="true"':''}><svg class="light-art" viewBox="${layout.view.join(' ')}" aria-hidden="true"><foreignObject x="0" y="0" width="${layout.view[2]}" height="${layout.view[3]}"><div xmlns="http://www.w3.org/1999/xhtml" class="light-stage" style="width:${layout.view[2]}px;height:${layout.view[3]}px">${lightArtwork(progress,{environment,view,painted:miniature})}</div></foreignObject></svg>${miniature?'':`<div class="light-paper-blocker" data-light-paper style="clip-path:polygon(${clip})" aria-hidden="true"></div>${controls(progress,done,tall)}`}<output class="sr-only">${done?'纸上留住了雨窗。灯已关好，三件工具都拿回来了。':!progress.lit?'纸上留着淡淡的小窗。':!progress.fitted[1]?'灯亮着，纸上还没有接到光。':!progress.fitted[0]?'镜子把一片灯光送到了纸上。':'雨窗的影子，落在纸上。'}</output></div>`;
}
export function renderCalibration(progress,{state,view={}}){
 const tall=view.lightPortrait??(globalThis.matchMedia?.('(max-width:700px)').matches??false);
 return `<div class="light-workbench" data-look-point="${lightLayout(tall).look.join(',')}">${lightCase(progress,{done:state.solved.includes('calibration'),tall})}</div>`;
}
export function paintLight(field,pose){
 if(!field?.isConnected)return;
 field.lightPose=structuredClone(pose);
 const view=field.dataset.lightLayout,stage=field.querySelector('.light-stage'),masks=drawingMasks(pose.values,view);
 const tool=(name,index,quad)=>paintPlane(stage,name,quad.map(([x,y])=>[x,y-(1-Number(pose.fitted[index]))*12]));
 tool('mirror',1,mirrorQuad(pose.values,view));tool('film',0,filmSheetQuad(pose.values,pose.flipped,view));paintPlane(stage,'holder',filmFrameQuad(pose.values,pose.flipped,view));
 tool('book',2,bookQuad(pose.values,view));tool('cord',2,cordQuad(pose.values,view));tool('physical',0,printQuad(pose.values,pose.flipped,true,view));
 const projection=printQuad(pose.values,pose.flipped,false,view);paintPlane(stage,'projection',projection);paintPlane(stage,'projection-open',projection);paintPlane(stage,'shadow-book',bookProjectionQuad(pose.values,view));paintPlane(stage,'wash',washQuad(pose.values,view));
 paintPlane(stage,'film-post',standQuad(pose.values,view));const book=lightControlPoint(pose.values,1,view);paintPlane(stage,'book-clamp',flat([book[0]-21,book[1]-8,42,28]));
 stage.querySelectorAll('[data-light-tool]').forEach(el=>el.style.opacity=Number(pose.fitted[Number(el.dataset.lightTool)]));
 stage.querySelector('[data-light-mask="pupil"]').style.clipPath=masks.pupil;const clear=stage.querySelector('[data-light-mask="clear"]');clear.style.clipPath=masks.clear;clear.style.opacity=Number(pose.fitted[2]);stage.querySelector('[data-light-open]').style.opacity=1-Number(pose.fitted[2]);
 stage.querySelector('[data-light-ink]').style.opacity=Number(pose.fitted[0]);stage.querySelector('[data-light-block]').style.opacity=Number(pose.fitted[2]);
 stage.querySelector('.light-bulb').style.opacity=Number(pose.lit)*.36;stage.querySelector('.light-cast').style.opacity=Number(pose.lit)*Number(pose.fitted[1]);
 const proof=stage.querySelector('.light-proof');proof.style.opacity=pose.proof?1:0;proof.style.maskImage=pose.proofAmount<1?`linear-gradient(to bottom,#000 ${pose.proofAmount*100-3}%,transparent ${pose.proofAmount*100+3}%)`:'';
 const announced=field.hasAttribute('data-light-preview')?pose.values:JSON.parse(field.dataset.lightState).values;
 field.querySelectorAll('[data-light-adjust]').forEach(button=>{const index=Number(button.dataset.lightAdjust),value=Math.round(announced[index]);button.style.cssText=pos(lightControlPoint(pose.values,index,view),view);button.setAttribute('aria-valuenow',value);button.setAttribute('aria-valuetext',`第${value+1}档，共四档`);});
 stage.querySelector('[data-light-handle="2"]').style.opacity=Number(pose.fitted[1]);
 for(let index=0;index<3;index++)paintPlane(stage,'handle-'+index,handleQuad(pose.values,index,view));
 field.querySelectorAll('[data-light-slot]').forEach(el=>el.style.cssText=pos(slotPoint(pose.values,Number(el.dataset.lightSlot),view),view));
 const flip=field.querySelector('.light-flip');if(flip)flip.style.cssText=pos(flipPoint(pose.values,view),view);
}
export function lightMiniature(progress,done){return `<div class="world-light" aria-hidden="true" inert ${done?'data-world-change="calibration"':''}>${lightCase(progress,{miniature:true,done,environment:false}).replace('class="light-case','class="light-case world-light-case')}</div>`;}
