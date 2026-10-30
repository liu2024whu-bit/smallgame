import {viewControl} from '../view-control.js';
import {CHOCOLATE_ROWS,CHOCOLATE_COLUMNS} from '../../data/birthday.js';
import {CHOCOLATE_SPOTS,CHOCOLATE_CUPS,CHOCOLATE_NAMES,CHOCOLATE_KINDS,CHOCOLATE_DRAWER,CHOCOLATE_DRAWER_TRAVEL,CHOCOLATE_MATCHBOX,CHOCOLATE_CAMERAS,CHOCOLATE_LID,chocolateCamera,chocolatePresentation} from '../../data/chocolate.js';
import {ASSETS} from '../../data/assets.js';
import {atlas,escape} from '../dom.js';

export const bonbon=(piece,className='')=>atlas('chocolateParts',CHOCOLATE_KINDS[piece],{className:'bonbon-paint '+className});
const at=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
export function chocolateLidSample(){
 return `<span class="choc-sample" aria-label="两格连续空位记作二，隔着一颗巧克力，再一格空位记作一"><span class="choc-sample-trays">${[0,1,2,3].map(i=>`<i>${atlas('chocolateParts',4)}${i===2?bonbon(0):''}</i>`).join('')}<b class="choc-sample-two">2</b><b class="choc-sample-one">1</b></span><small>连着空了几格？</small></span>`;
}
function lid(opened,passive){
 return `<${passive?'span':'button'} class="choc-lid" data-choc-lid-pose="${opened}" ${passive?'':`data-choc-lid data-focus="choc-lid" aria-label="${opened?'合上':'打开'}巧克力盒盖" aria-expanded="${opened}"`} style="${at(CHOCOLATE_LID)};transform:rotateX(${opened?120:0}deg)"><span class="choc-lid-face">${atlas('chocolateLids',0)}</span><span class="choc-lid-face choc-lid-inner">${atlas('chocolateLids',1)}${chocolateLidSample()}</span></${passive?'span':'button'}>`;
}
export function chocolateDrawer(p,{passive=false,collected=false}={}){
 const [x,y,w,h]=CHOCOLATE_DRAWER,[mx,my,mw,mh]=CHOCOLATE_MATCHBOX,open=p.drawer;
 const reward=collected?'':`<${passive?'span':'button'} class="choc-matchbox" style="${at([mx-x,my-y,mw,mh])}" ${passive?'':`data-action="collect-item" data-id="matches" data-focus="choc-matches" aria-label="拿起抽屉里的火柴盒" ${open?'':'disabled'}`}>${atlas('chocolateRewardParts',1,{className:'item-art'})}</${passive?'span':'button'}>`;
 return `<div class="choc-drawer-mouth" style="${at(CHOCOLATE_DRAWER)}"><div class="choc-drawer-body" style="transform:translateY(${open?0:-CHOCOLATE_DRAWER_TRAVEL}px)" ${open?'':'inert'}>${atlas('chocolateRewardParts',0,{className:'choc-drawer-paint'})}${reward}</div></div>${passive?'':`<button class="choc-drawer-grip" data-choc-drawer data-focus="choc-drawer" aria-label="盒底的小拉片" aria-expanded="${open}" ${open?'disabled':''} style="left:${x+w/2}px;top:${y+23+(open?CHOCOLATE_DRAWER_TRAVEL:0)}px"></button>`}`;
}
export function chocolateModel(p,{view={},done=false,passive=false,collected=false}={}){
 const {opened,drawer}=chocolatePresentation(p,view,done),reading=chocolateCamera(view)==='paper';
 const slots=CHOCOLATE_SPOTS.map(([x,y],slot)=>{const piece=p.places.indexOf(slot),label=(slot<25?`第${Math.floor(slot/5)+1}排，第${slot%5+1}格`:`碟子上的位置${slot-24}`)+'，'+(piece<0?'空着':CHOCOLATE_NAMES[CHOCOLATE_KINDS[piece]]);return `<${passive?'span':'button'} class="choc-location ${piece>=0?'choc-has-piece':''} ${slot>=25?'choc-plate-location':''}" data-choc-slot="${slot}" data-choc-piece="${piece}" ${passive?'':`data-focus="choc-slot-${slot}" tabindex="${slot===0?0:-1}" aria-label="${label}" ${done?'disabled':''}`} style="left:${x}px;top:${y}px">${piece<0?'':bonbon(piece)}</${passive?'span':'button'}>`;}).join('');
 return `<div class="choc-model ${opened?'choc-open':'choc-closed'}" data-choc-model data-choc-pose='${escape(JSON.stringify({opened,drawer,places:p.places}))}'>${lid(opened,passive)}<div class="choc-printed-clues" ${opened?'':'aria-hidden="true"'}><div class="choc-row-clues">${CHOCOLATE_ROWS.map((v,i)=>`<span style="left:845px;top:${CHOCOLATE_CUPS[i*5][1]}px" aria-label="第${i+1}排空位，${v.join('、')}">${v.join(' · ')}</span>`).join('')}</div><div class="choc-col-clues">${CHOCOLATE_COLUMNS.map((v,i)=>`<span style="left:${CHOCOLATE_CUPS[i][0]}px;top:351px" aria-label="第${i+1}列空位，${v.join('、')}">${v.join(' · ')}</span>`).join('')}</div></div><div class="choc-locations" ${!opened||reading?'inert':''}>${slots}</div>${chocolateDrawer(p,{passive,collected})}</div>`;
}
export function renderChocolate(p,{state,view={}}){
 const done=state.solved.includes('chocolate'),camera=chocolateCamera(view),frame=CHOCOLATE_CAMERAS[camera];
 return `<div class="chocolate-workbench"><div class="choc-viewport" style="--choc-aspect:${frame[2]/frame[3]}"><div class="choc-world" data-source-camera="${frame}"><img class="choc-table" src="${ASSETS.chocolateTable}" alt="生日桌上的棕色巧克力盒和花边小碟" draggable="false">${chocolateModel(p,{view,done,collected:state.collected.includes('matches')})}</div></div><nav class="choc-navigation" aria-label="巧克力盒取景">${viewControl(`桌边`,`data-choc-view="whole" aria-current="${camera==='whole'}"`)}${viewControl(`盒边`,`data-choc-view="paper" aria-current="${camera==='paper'}"`)}${viewControl(`旁边的可可`,`data-action="puzzle" data-id="cocoa"`)}</nav><p class="choc-quiet-status" role="status"></p><span class="sr-only">数字数的是连续空位，两段空位之间隔着巧克力。可以把巧克力从纸托拿到小碟，也可以放回来。点一下拿起，再点空位放下；也可以直接拖动。方向键在位置之间移动，空格或回车拿放，Escape放回。盒底有一枚拉片，可以点一下，也可以向自己这边拉。抽屉里出现的物件可以单独拿起。</span></div>`;
}
