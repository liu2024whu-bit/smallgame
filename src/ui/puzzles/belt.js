import {viewControl} from '../view-control.js';
import {BELT_WHEELS,BELT_RETURNS,BELT_FIT_ITEMS,BELT_CAMERAS,BELT_RATIO_POINTS,BELT_ROOM} from '../../data/belt.js';
import {rasterStage} from '../raster-stage.js';
import {enclosingPlane,matrixStyle,polygon} from '../raster-plane.js';
import {beltRouteReady,beltFilmDistance} from '../../puzzles/belt.js';
import {ASSETS} from '../../data/assets.js';
import {inventory} from '../../core/state.js';
import {ITEMS} from '../../data/items.js';
import {atlas,itemSprite,escape} from '../dom.js';
const place=([x,y,w,h])=>`left:${x/15.36}%;top:${y/10.24}%;width:${w/15.36}%;height:${h/10.24}%;`;
const act=a=>`data-pmove="${escape(JSON.stringify(a))}"`;
function fitting(p,index,owned,miniature,rect){
 const item=BELT_FIT_ITEMS[index],fitted=p.fitted[index],label=['棉线','槽轮','摇柄','装订针'][index];
 if(miniature||fitted&&!p.opened||p.opened&&!fitted)return '';
 const attrs=fitted?`${act({type:'unfit',index})} data-return-fitting`:`data-action="use-direct" data-id="${item}" data-tool-target="belt-fit:${index}"`;
 return `<button class="belt-fitting ${fitted?'belt-fitted':''}" style="${place(rect)}" ${attrs} data-belt-fit="${index}" data-focus="belt-fit-${index}" aria-label="${fitted?'取回':'放上'}${label}" ${!fitted&&!owned.includes(item)?'disabled':''}><span>${fitted?'取回':label}</span></button>`;
}
export function beltCase(p,{owned=[],miniature=false,backdrop=false,painted=false}={}){
 const distance=beltFilmDistance(p),active=!miniature&&!p.opened;
 const wheel=(w,i)=>w.part===null?(p.fitted[1]?`<span class="belt-pulley-shell" data-belt-tool="1" style="${place([w.x-60,w.y-109,120,160])}">${itemSprite(6)}</span>`:''):`<span class="belt-wheel" style="${place([w.x-w.r,w.y-w.r,w.r*2,w.r*2])};rotate:${p.rotations[i]}deg" data-belt-wheel="${i}">${atlas('beltParts',w.part,{label:''})}</span>`;
 const ratioX=BELT_RATIO_POINTS[p.ratio];
 return `<div class="belt-case ${p.opened?'belt-open':''}" data-belt-case data-belt-state="${escape(JSON.stringify(p))}" data-belt-attempts="${p.attempts}" ${miniature?'inert aria-hidden="true"':!p.fitted[0]?'data-tool-target="belt-fit:0"':''}>
  ${backdrop?`<img class="belt-environment" src="${ASSETS.beltNook}" alt="" draggable="false">`:''}${painted?'':`<img class="belt-chassis" src="${ASSETS.beltBody}" alt="" draggable="false">`}
  ${BELT_WHEELS.map(wheel).join('')}
  <canvas class="belt-cord" width="1536" height="1024" aria-hidden="true"></canvas>
  ${active?BELT_WHEELS.map((w,i)=>`<button class="belt-node" data-belt-node="${i}" data-focus="belt-node-${i}" ${act({type:'node',index:i})} style="left:${w.x/15.36}%;top:${w.y/10.24}%;width:${w.r*2/15.36}%;" aria-label="绕过${w.name}" aria-pressed="${p.route.includes(i)}" ${!p.fitted[0]||i===1&&!p.fitted[1]?'disabled':''}></button>`).join(''):''}
  ${active&&p.fitted[0]&&!p.route.length?`<button class="belt-node belt-loose-end" data-belt-end ${act({type:'node',index:0})} data-focus="belt-end" style="left:${423/15.36}%;top:${650/10.24}%;width:3%;" aria-label="拿起垂下的线头"></button>`:''}
  ${fitting(p,0,owned,miniature,p.opened?[BELT_RETURNS[1].x-60,BELT_RETURNS[1].y-44,120,88]:[680,145,160,76])}${fitting(p,1,owned,miniature,[423,128,120,100])}${fitting(p,2,owned,miniature,[280,427,100,100])}${fitting(p,3,owned,miniature,[1300,648,120,100])}
  ${p.fitted[2]?`<span class="belt-crank-arm" data-belt-crank-art data-belt-tool="2" style="${place([309.5,435.5,230,64])};rotate:0deg">${atlas('beltCrank',0,{label:''})}</span>`:''}
  ${active?`<button class="belt-crank-grip" style="${place([452,423,105,105])}" data-belt-crank ${act({type:'crank'})} data-focus="belt-crank" aria-label="摇一圈放映机" ${!p.fitted.every(Boolean)?'disabled':''}></button>`:''}
  <span class="belt-selector" data-belt-selector-art style="${place([ratioX-35,755,95,43])}">${atlas('beltParts',5,{label:''})}</span>
  ${active?`<button class="belt-selector-grip" data-belt-ratio data-focus="belt-ratio" role="slider" aria-label="进片拨杆" aria-valuemin="1" aria-valuemax="3" aria-valuenow="${p.ratio+1}" aria-orientation="horizontal" aria-keyshortcuts="ArrowLeft ArrowRight Home End" ${act({type:'ratio'})} style="${place([675,744,210,76])}"></button><button class="belt-crossover" data-belt-cross ${act({type:'cross'})} data-focus="belt-cross" aria-label="翻动双槽线夹" aria-pressed="${p.crossed}" style="${place([1200,604,120,100])}"></button>`:''}
  <span class="belt-cross-leaf" data-belt-cross-art style="${place([1220,624,80,40])};rotate:${p.crossed?-42:0}deg">${atlas('beltParts',5,{label:''})}</span>
  <span class="belt-spring" style="${place([1332,656,104,95])}">${atlas('beltBody',3,{label:''})}</span>
  <div class="belt-gate-window" style="${place([1144,718,87,48])}">${!owned.includes('filmStrip')?`<span class="belt-film" data-belt-film style="translate:${distance/15.36}cqw 0">${atlas('beltCotton',2,{label:''})}${atlas('beltCotton',2,{label:''})}</span>`:''}</div>
  <span class="belt-gauge-target" style="${place([1251,719,14,14])}">${atlas('beltParts',6,{label:''})}</span>
  ${p.fitted[3]?`<span class="belt-gauge-pointer" data-belt-gauge style="translate:${distance/15.36}cqw 0"><span class="belt-gauge-needle" data-belt-tool="3" style="${place([1346,682,55,60])};rotate:-38deg">${itemSprite(5)}</span><span class="belt-gauge-clamp" style="${place([1362,700,24,20])}">${atlas('beltParts',6,{label:''})}</span></span>`:''}
  ${p.opened&&!owned.includes('filmStrip')?`<${miniature?'span':'button'} class="belt-film-take" ${miniature?'':`data-action="collect-item" data-id="filmStrip" data-focus="belt-film" aria-label="拿起松开的三格胶片"`} style="${place([1125,718,180,80])}">${itemSprite(ITEMS.filmStrip.sprite)}</${miniature?'span':'button'}>`:''}
 </div>`;
}
export function renderBelt(p,{state,view={}}){
 const mode=Object.hasOwn(BELT_CAMERAS,view.beltView)?view.beltView:'whole',[x,y,w,h]=BELT_CAMERAS[mode];
 const status=p.opened?(inventory(state).includes('filmStrip')?'片窗空了。':'胶片松开了。'):p.tested?beltRouteReady(p.route)?'片孔还没对上。':'有一处没带起来。':'';
 return `<div class="belt-workbench" data-belt-mode="${mode}" style="--belt-ratio:${w}/${h};--belt-view-aspect:${w/h};--belt-left:${-x/w*100}%;--belt-top:${-y/h*100}%;--belt-width:${1536/w*100}%;--belt-height:${1024/h*100}%">
 <div class="belt-viewport">${beltCase(p,{owned:inventory(state),backdrop:true})}</div>
 <nav class="belt-navigation" aria-label="放映机取景">${viewControl(mode==='whole'?'线夹细节':'回到整机',`data-action="belt-view" data-id="${mode==='whole'?'right':'whole'}"`)}${!p.opened&&p.route.length?viewControl('退一轮',`${act({type:'undo'})} aria-label="把线退回一轮"`):''}${p.opened&&p.fitted.some(Boolean)?`<button class="quiet-button" data-return-fitting ${act({type:'unfit-all'})}>收起工具</button>`:''}</nav>
 <output class="belt-reply" role="status">${status}</output><span class="sr-only">${p.route.length?`线已经过${p.route.map(i=>BELT_WHEELS[i].name).join('、')}。`:''}${p.opened?'放映机里的胶片可以取下来看，借来的零件也可以拿回。':'轮缘有磨痕，片窗旁留着四孔纸签。棉线可以连续拖过轮子，拨杆可以左右移动，装订针在纸签上量出走过的距离。'}</span></div>`;
}
export function beltMiniature(state){
 const {left,top,width,roll,foot,size:[w,h],front,face}=BELT_ROOM;
 const quad=enclosingPlane(front,face,w,h),[x,y,fw,fh]=front,clip=polygon([[x,y],[x+fw,y],[x+fw,y+fh],[x,y+fh]]);
 const body=`<div class="belt-room-front" style="position:absolute;left:0;top:0;width:${w}px;height:${h}px;transform-origin:0 0;transform:${matrixStyle(quad,w,h)};clip-path:${clip}">${beltCase(state.progress.belt,{miniature:true,painted:true,owned:inventory(state)})}</div>`;
 return `<div class="world-belt" style="left:${left}%;top:${top}%;width:${width}%;aspect-ratio:${w}/${h};rotate:${roll}deg;transform-origin:${foot[0]/w*100}% ${foot[1]/h*100}%" inert aria-hidden="true">${rasterStage(body,w,h)}</div>`;
}
