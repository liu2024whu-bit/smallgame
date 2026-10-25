import {LIGHT_GEOMETRY as G,lightLayout,LIGHT_PART_REGISTRATION} from '../../data/light.js';
import {PUZZLE_TOOL_INPUTS} from '../../data/tool-uses.js';
import {ASSETS} from '../../data/assets.js';
import {inventory} from '../../core/state.js';
import {lightCamera,mirrorCircle} from '../../puzzles/light-geometry.js';
import {ASSET_LAYOUTS} from '../../data/asset-layouts.js';
import {lightPaper,lightSprite,flatSprite,mirrorQuad,filmFrameQuad,filmSheetQuad,bookQuad,paperQuad,paperDrawing,drawingPaths,planeMatrix} from './light-drawing.js';
import {escape,icon} from '../dom.js';
const names=['透片','小圆镜','木书签'];
const camera=(point,tall)=>lightCamera(point,lightLayout(tall).camera);
const pos=([x,y],tall)=>{const [left,top,width,height]=lightLayout(tall).view;return `left:${(x-left)/width*100}%;top:${(y-top)/height*100}%;`;};
export function lightControlPoint(values,index,tall=false){
 if(index===0)return camera([G.filmX[0]+values[0]*60,300,90],tall);
 if(index===1)return camera([220,315,G.bookZ[0]+values[1]*24],tall);
 return camera(mirrorCircle(values)[0],tall);
}
const pmove=move=>`data-pmove="${escape(JSON.stringify(move))}"`;
function controls(progress,owned,done,tall){
 const layout=lightLayout(tall);
 const grips=[0,1,2].map(index=>{
  const actual=index===2?1:index===1?2:0,point=lightControlPoint(progress.values,index,tall),fitted=progress.fitted[actual],item=PUZZLE_TOOL_INPUTS.calibration[actual];
  const slider=`<button class="light-grip light-grip-${index}" data-light-adjust="${index}" ${!fitted?`data-tool-target="light-fit:${actual}"`:""} data-focus="light-grip-${index}" ${pmove({type:'turn',index,direction:1})} role="slider" aria-label="${['透片滑架','书签升降夹','圆镜朝向'][index]}" aria-orientation="${index===1?'vertical':'horizontal'}" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${progress.values[index]}" aria-valuetext="第${progress.values[index]+1}档，共四档" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home End" style="${pos(point,tall)}" ${done||index===2&&!fitted?'disabled':''}><span class="sr-only">可以拖动，也可以用方向键</span></button>`;
  const action=fitted?pmove({type:'unfit',index:actual}):`data-action="use-direct" data-id="${item}" data-tool-target="light-fit:${actual}"`;
  const slot=`<button class="light-fitting ${fitted?'is-fitted':''}" ${action} data-focus="light-fit-${actual}" style="${pos(layout.slots[actual],tall)}" aria-label="${fitted?'取回':'放上'}${names[actual]}" ${done||!owned.includes(item)?'disabled':''}>${icon(fitted?'undo':'leaf')}<span>${fitted?'取回':names[actual]}</span></button>`;
  return slider+slot;
 }).join('');
 const power=`<button class="light-power" ${pmove({type:'power'})} data-focus="light-power" aria-label="${progress.lit?'关灯':'开灯'}" aria-pressed="${progress.lit}" style="${pos(layout.power,tall)}" ${done?'disabled':''}><span class="sr-only">${progress.lit?'关灯':'开灯'}</span></button>`;
 const flipPoint=camera([G.filmX[0]+progress.values[0]*60,300,270],tall);
 const flip=`<button class="light-flip" ${pmove({type:'flip'})} data-focus="light-flip" aria-label="翻过透片" aria-pressed="${progress.flipped}" style="${pos(flipPoint,tall)}" ${done||!progress.fitted[0]?'disabled':''}>${icon('repeat')}</button>`;
 const [x,y,w,h]=layout.pencil,buttonWidth=w/layout.view[2]*100,buttonHeight=Math.max(10,h/layout.view[3]*100);
 const pencil=`<button class="light-pencil" ${pmove({type:'trace'})} data-light-pencil data-focus="light-pencil" aria-label="拿铅笔描一笔，也可以拖到纸上" style="${pos([x+w/2,y+h/2],tall)}width:${buttonWidth}%;height:${buttonHeight}%;" ${done?'disabled':''}><span class="light-pencil-label">${done?'留住了':'描一笔'}</span></button>`;
 const sockets=[0,1,2].filter(index=>!progress.fitted[index]&&!done).map(index=>{
  const point=index===0?camera([G.filmX[0]+progress.values[0]*60,300,160],tall):index===1?camera(G.mirror,tall):lightControlPoint(progress.values,1,tall);
  return `<span class="light-socket" data-tool-target="light-fit:${index}" data-light-slot="${index}" style="${pos(point,tall)}" aria-hidden="true"></span>`;
 }).join('');
 return grips+power+flip+pencil+sockets;
}
export function lightArtwork(pose,prefix,{environment=true,tall=false}={}){
 const layout=lightLayout(tall),paths=drawingPaths(pose,tall),paper=lightPaper(tall);
 const holder=lightSprite('lightParts',1,filmFrameQuad(pose.values,pose.flipped,tall),'data-light-plane="holder"',{maskId:prefix+'-holder',cutout:LIGHT_PART_REGISTRATION.film});
 const film=lightSprite('lightFilm',0,filmSheetQuad(pose.values,pose.flipped,tall),'data-light-plane="film"');
 const mirror=lightSprite('lightParts',0,mirrorQuad(pose.values,tall),'data-light-plane="mirror"');
 const book=lightSprite('lightParts',2,bookQuad(pose.values,tall),'data-light-plane="book"',{annotation:'<text x="385" y="827" writing-mode="vertical-rl" font-size="32" font-family="KaiTi,serif" fill="#73502f" opacity=".72">武汉大学</text>'});
 const carriage=camera([G.filmX[0]+pose.values[0]*60,300,0],tall),bookPoint=camera([220,315,G.bookZ[0]+pose.values[1]*24],tall),source=camera(G.source,tall);
 return `${environment?`<image href="${tall?ASSETS.lightDeskTall:ASSETS.lightDesk}" width="${tall?870:1536}" height="${tall?1160:1024}" x="${tall?-51:0}" y="${tall?-132:0}" class="light-desk"/>`:''}
 ${flatSprite('lightFixtures',0,...layout.lamp,'class="light-lamp-art"')}
 <ellipse class="light-bulb" cx="${source[0]}" cy="${source[1]}" rx="${tall?4:6}" ry="${tall?31:55}" opacity="${Number(pose.lit)*.45}"/>
 <g class="light-beams" opacity="${Number(pose.lit)}"><path class="light-incoming" data-light-path="incoming" d="${paths.incoming}"/><path class="light-reflected" data-light-path="reflected" d="${paths.reflected}" opacity="${Number(pose.fitted[1])}"/></g>
 ${flatSprite('lightFixtures',3,...layout.bookPost)}
 ${flatSprite('lightFixtures',2,...layout.rail)}
 ${flatSprite('lightFixtures',1,...layout.mirrorPost)}
 <g class="light-tool" data-light-tool="2" opacity="${Number(pose.fitted[2])}">${book}</g>
 ${flatSprite('lightFixtures',5,bookPoint[0]-18,bookPoint[1]-7,36,23,'data-light-clamp')}
 ${flatSprite('lightFixtures',1,carriage[0]-22,carriage[1]-167,44,177,'data-light-post')}
 ${flatSprite('lightFixtures',5,carriage[0]-22,carriage[1]-13,44,26,'data-light-carriage')}
 <g class="light-tool light-film-art" data-light-tool="0" opacity="${Number(pose.fitted[0])}">${film}<path data-light-path="physical" class="light-physical-ink" fill="none" d="${paths.physical}"/></g>${holder}
 <g class="light-tool" data-light-tool="1" opacity="${Number(pose.fitted[1])}">${mirror}</g>
 <g class="light-paper-art">${lightSprite('lightParts',3,paperQuad(tall))}</g>
 <g class="light-paper-drawing">${paperDrawing(pose,prefix,tall)}</g>
 ${[paper[3],paper[2]].map(([x,y])=>flatSprite('lightFixtures',5,x-12,y-8,24,18)).join('')}
 ${[0,1,2].map(index=>{const [x,y]=lightControlPoint(pose.values,index,tall);return flatSprite('lightFixtures',5,x-19,y-9,38,23,`data-light-handle-art="${index}" opacity="${index===2?Number(pose.fitted[1]):1}"`);}).join('')}
 ${flatSprite('lightFixtures',4,...layout.pencil,'class="light-pencil-art"')}
 `;
}
export function lightCase(progress,{owned=[],done=false,miniature=false,environment=true,tall=false}={}){
 const prefix=miniature?'light-world':'light-near',layout=lightLayout(tall),paper=lightPaper(tall);
 const clip=paper.map(([x,y])=>(x-layout.view[0])/layout.view[2]*100+'% '+(y-layout.view[1])/layout.view[3]*100+'%').join(',');
 return `<div class="light-case ${tall?'light-portrait':''} ${done?'light-done':''}" data-light-case data-light-tall="${tall}" data-light-state="${escape(JSON.stringify(progress))}" data-light-prefix="${prefix}" ${miniature?'inert aria-hidden="true"':''}><svg class="light-art" viewBox="${layout.view.join(' ')}" aria-hidden="true"><g data-light-artwork>${lightArtwork(progress,prefix,{environment,tall})}</g></svg>${miniature?'':`<div class="light-paper-blocker" data-light-paper style="clip-path:polygon(${clip})" aria-hidden="true"></div>${controls(progress,owned,done,tall)}`}<output class="sr-only">${done?'纸上留住了雨窗。灯已关好，三件工具都拿回来了。':!progress.lit?'纸上留着几笔淡淡的线。':!progress.fitted[1]?'灯亮着，纸上还没有接到光。':!progress.fitted[0]?'镜子把一片灯光送到了纸上。':'雨窗的影子，落在纸上。'}</output></div>`;
}
export function renderCalibration(progress,{state,view={}}){
 const tall=view.lightPortrait??(globalThis.matchMedia?.('(max-width:700px)').matches??false);
 return `<div class="light-workbench">${lightCase(progress,{owned:inventory(state),done:state.solved.includes('calibration'),tall})}</div>`;
}
export function paintLight(field,pose){
 if(!field?.isConnected)return;
 field.lightPose=structuredClone(pose);
 const tall=field.dataset.lightTall==='true',svg=field.querySelector('.light-art'),paths=drawingPaths(pose,tall);
 svg.querySelectorAll('[data-light-path]').forEach(el=>el.setAttribute('d',paths[el.dataset.lightPath]));
 const set=(selector,attribute,value)=>svg.querySelector(selector)?.setAttribute(attribute,value);
 const plane=(name,index,quad,asset='lightParts')=>{const frame=ASSET_LAYOUTS[asset].frames[index];set(`[data-light-plane="${name}"]`,'transform','matrix('+planeMatrix(quad,frame[2],frame[3]).join(' ')+')');};
 plane('mirror',0,mirrorQuad(pose.values,tall));plane('film',0,filmSheetQuad(pose.values,pose.flipped,tall),'lightFilm');plane('holder',1,filmFrameQuad(pose.values,pose.flipped,tall));plane('book',2,bookQuad(pose.values,tall));
 const translate=(selector,x,y)=>{const el=svg.querySelector(selector);if(!el)return;const matrix=el.getAttribute('transform').match(/-?[\d.]+/g).map(Number);matrix[4]=x;matrix[5]=y;el.setAttribute('transform','matrix('+matrix.join(' ')+')');};
 const carriage=camera([G.filmX[0]+pose.values[0]*60,300,0],tall),book=camera([220,315,G.bookZ[0]+pose.values[1]*24],tall);
 translate('[data-light-carriage]',carriage[0]-22,carriage[1]-13);translate('[data-light-post]',carriage[0]-22,carriage[1]-167);translate('[data-light-clamp]',book[0]-18,book[1]-7);
 svg.querySelectorAll('[data-light-tool]').forEach(el=>el.setAttribute('opacity',Number(pose.fitted[Number(el.dataset.lightTool)])));
 set('[data-light-path="block"]','opacity',Number(pose.fitted[2]));set('[data-light-path="ink"]','opacity',Number(pose.fitted[0]));
 set('.light-bulb','opacity',Number(pose.lit)*.45);set('.light-beams','opacity',Number(pose.lit));set('[data-light-path="reflected"]','opacity',Number(pose.fitted[1]));set('.light-cast','opacity',Number(pose.lit)*Number(pose.fitted[1]));
 set('.light-proof','opacity',pose.proof?1:0);
 const amount=pose.proofAmount??1;svg.querySelectorAll('.light-proof path').forEach(el=>{el.style.strokeDasharray=amount<1?'1':'';el.style.strokeDashoffset=amount<1?1-amount:'';});
 field.querySelectorAll('[data-light-adjust]').forEach(button=>{const index=Number(button.dataset.lightAdjust);button.style.cssText=pos(lightControlPoint(pose.values,index,tall),tall);button.setAttribute('aria-valuenow',Math.round(pose.values[index]));});
 set('[data-light-handle-art="2"]','opacity',Number(pose.fitted[1]));
 for(let index=0;index<3;index++){const [x,y]=lightControlPoint(pose.values,index,tall);translate(`[data-light-handle-art="${index}"]`,x-19,y-9);}
 field.querySelectorAll('[data-light-slot]').forEach(el=>{const index=Number(el.dataset.lightSlot),point=index===0?camera([G.filmX[0]+pose.values[0]*60,300,160],tall):index===1?camera(G.mirror,tall):lightControlPoint(pose.values,1,tall);el.style.cssText=pos(point,tall);});
 const flip=field.querySelector('.light-flip');if(flip)flip.style.cssText=pos(camera([G.filmX[0]+pose.values[0]*60,300,270],tall),tall);
}
export function lightMiniature(progress,done){
 return `<div class="world-light" aria-hidden="true" inert ${done?'data-world-change="calibration"':''}>${lightCase(progress,{miniature:true,done,environment:false}).replace('class="light-case','class="light-case world-light-case')}</div>`;
}
