import {SCREEN_CODE} from '../../puzzles/screen.js';
import {SCREEN_PEOPLE,SCREEN_PATTERNS,SCREEN_INK_ASSETS,SCREEN_PRINT_FACES,SCREEN_FRONT_DIGITS,SCREEN_CARRIER_GRIPS,SCREEN_PAPER,SCREEN_CAMERAS,SCREEN_PLACEMENT,SCREEN_NAMES,SCREEN_NUMBERS,SCREEN_REWARDS,SCREEN_POCKET,screenPaperCamera,screenGripClip} from '../../data/screen.js';
import {ASSETS} from '../../data/assets.js';
import {ITEMS} from '../../data/items.js';
import {inventory} from '../../core/state.js';
import {atlas,itemSprite,escape} from '../dom.js';
import {viewControl} from '../view-control.js';
const place=([x,y,w,h])=>`left:${x/15.36}%;top:${y/10.24}%;width:${w/15.36}%;height:${h/10.24}%;`;
const pmove=action=>`data-pmove="${escape(JSON.stringify(action))}"`;
const view=(mode,group)=>`data-action="screen-view" data-id="${mode}"${group===undefined?'':` data-index="${group}"`}`;
const readable=(p,group)=>!p.backing.turned&&Math.abs(p.backing.x)<12&&Math.abs(p.backing.y)<12&&p.flips.slice(group*3,group*3+3).every((v,i)=>v===SCREEN_PRINT_FACES[group*3+i]);
function leaf(index,face){
 const group=Math.floor(index/3),part=index%3,piece=face===SCREEN_PRINT_FACES[index]?part:(part+1)%3;
 return `<span class="screen-paper-face ${face?'screen-paper-back':''}" data-screen-face="${face}" style="mask-image:url('${ASSETS.screenMask}');mask-position:${(group*3+piece)*12.5}% 50%;"><span class="screen-stencil-source" style="left:${-piece*100}%;">${atlas('screenBacking',1,{className:'screen-stencil-base',label:''})}${atlas(SCREEN_INK_ASSETS[group],0,{className:'screen-stencil-paint',label:''})}</span></span>`;
}
function drums(progress,interactive){
 return `<div class="screen-number-bank">${SCREEN_NUMBERS.map(([x,y,w,h],index)=>`<${interactive?'button':'span'} class="screen-drum" style="${place([x+w/2,y,w,h])}" ${interactive?`role="slider" data-lock-digit="${index}" data-focus="number-${index}" ${pmove({type:'turn',index,direction:1})} aria-label="第${index+1}轮" aria-valuemin="0" aria-valuemax="9" aria-valuenow="${progress.values[index]}" aria-valuetext="${progress.values[index]}" aria-orientation="vertical"`:''}>${atlas('screenParts',5,{className:'screen-wheel-paper',label:''})}<span class="screen-drum-strip" data-number-strip aria-hidden="true" style="--digit:${progress.values[index]}">${Array.from({length:31},(_,i)=>`<b ${i===10+progress.values[index]?'':'data-copy-hidden'}>${(i+10)%10}</b>`).join('')}</span></${interactive?'button':'span'}>`).join('')}</div>`;
}
export function screenCase(progress,{owned=[],miniature=false,mode='whole',group=0,painted=false}={}){
 const pocket=mode==='pocket',interactive=!miniature&&mode!=='lock'&&!pocket&&!progress.opened;
 const rewards=Object.entries(SCREEN_REWARDS).filter(([id])=>!owned.includes(id)).map(([id,rect])=>{
  const take=progress.opened&&!miniature&&pocket;
  return `<${take?'button':'span'} class="screen-reward screen-${id}" style="${place(rect)}" ${take?`data-action="collect-item" data-id="${id}" aria-label="拿起${ITEMS[id].name}"`:'aria-hidden="true"'}>${itemSprite(ITEMS[id].sprite)}</${take?'button':'span'}>`;
 }).join('');
 return `<div class="screen-case ${progress.opened?'screen-open':''}" data-screen-case data-screen-open="${progress.opened}" data-attempts="${progress.attempts}" ${mode==='lock'&&!miniature&&!progress.opened?'data-password-lock="number"':''}>
  ${painted?'':`<img class="screen-frame-paint" src="${ASSETS.screenMain}" alt="" draggable="false">`}
  <div class="screen-backing-window" style="${place(SCREEN_PAPER)}"><div class="screen-backing" style="--back-x:${progress.backing.x};--back-y:${progress.backing.y};--back-turn:${progress.backing.turned?180:0}deg"><img src="${ASSETS.screenBacking}" alt="" draggable="false"></div></div>
  <div class="screen-papers" style="${place(SCREEN_PAPER)}">${progress.flips.map((face,index)=>`<${interactive?'button':'span'} class="screen-leaf" data-screen-group="${Math.floor(index/3)}" ${index%3===1&&readable(progress,Math.floor(index/3))?`data-painted-copy="${SCREEN_CODE[Math.floor(index/3)]}"`:''} ${interactive?`data-screen-leaf="${index}" data-focus="screen-leaf-${index}" ${pmove({type:'flip',index})} aria-label="翻动第${index+1}扇纸屏，当前${face?'背面':'正面'}" aria-keyshortcuts="ArrowLeft ArrowRight Space Enter"`:''}><span class="screen-paper-turn" style="transform:rotateY(${face*180}deg)">${leaf(index,0)}${leaf(index,1)}</span></${interactive?'button':'span'}>`).join('')}</div>
  ${SCREEN_CARRIER_GRIPS.map(([x,y,w,h],index)=>`<${interactive?'button':'span'} class="screen-carrier-grip" data-screen-group="${index}" style="${place([x+progress.backing.x,y+progress.backing.y,w,h])}clip-path:inset(${screenGripClip(y+progress.backing.y,h)}% 0 0);" ${interactive?`data-screen-carrier data-focus="screen-carrier-${index}" ${pmove({type:'turn-backing'})} aria-label="挪动或转一转纸后的小画，${SCREEN_PEOPLE[index]}一侧" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home Space Enter"`:'aria-hidden="true"'}>${atlas('libraryPages',1,{className:'screen-carrier-tab',label:''})}</${interactive?'button':'span'}>`).join('')}
  ${SCREEN_NAMES.map((rect,index)=>!miniature&&(mode==='lock'||mode==='pocket'||mode==='paper'&&index!==group)?'':`<span class="screen-name" data-screen-group="${index}" style="${place(rect)}">${SCREEN_PEOPLE[index]}</span>`).join('')}
  ${!miniature&&mode==='whole'?SCREEN_PEOPLE.map((name,index)=>`<button class="screen-portrait-look" style="${place([120+440*index,45,400,235])}" ${view('paper',index)} aria-label="靠近${name}一侧"></button>`).join(''):''}
  ${!miniature&&mode==='whole'?`<button class="screen-look-base" style="${place(progress.opened?SCREEN_POCKET:[208,745,640,240])}" ${view(progress.opened?'pocket':'lock',group)} aria-label="${progress.opened?'靠近打开的小匣':'凑近看看字轮'}"></button>`:''}
  ${miniature||mode==='whole'||mode==='lock'?drums(progress,!miniature&&mode==='lock'&&!progress.opened):''}
  ${painted?'':!miniature&&mode==='lock'&&!progress.opened?`<button class="screen-latch" style="${place([712,812,104,52])}" data-postal-latch data-focus="screen-latch" ${pmove({type:'submit'})} aria-label="拉开字匣锁扣">${atlas('screenParts',3,{className:'screen-latch-paint',label:''})}</button>`:atlas('screenParts',3,{className:'screen-latch-static',style:place([712,812,104,52]),label:''})}
  ${painted?'':`<div class="screen-pocket-mask" style="${place(SCREEN_POCKET)}"><span class="screen-shutter">${atlas('screenParts',2,{className:'screen-shutter-paint',label:''})}</span></div>`}${rewards}
 </div>`;
}
const cameraStyle=([x,y,w,h],prefix)=>`--${prefix}-ratio:${w}/${h};--${prefix}-left:${-x/w*100}%;--${prefix}-top:${-y/h*100}%;--${prefix}-width:${1536/w*100}%;--${prefix}-height:${1024/h*100}%;`;
export function renderScreen(progress,{state,view:choice={}}){
 const group=[0,1,2].includes(choice.screenGroup)?choice.screenGroup:0;
 let mode=['whole','paper','lock','pocket'].includes(choice.screenView)?choice.screenView:progress.opened?'pocket':'whole';
 if(progress.opened&&mode==='lock')mode='pocket';if(!progress.opened&&mode==='pocket')mode='lock';
 const camera=mode==='paper'?screenPaperCamera(group):SCREEN_CAMERAS[mode],near=mode==='whole'?screenPaperCamera(group):camera,owned=inventory(state);
 const inkWords=SCREEN_PEOPLE.map((name,index)=>progress.flips.slice(index*3,index*3+3).every((face,i)=>face===SCREEN_PRINT_FACES[index*3+i])?`${name}一侧，纸画围成${SCREEN_FRONT_DIGITS[index]}，空处露出另一层纸。`:`${name}一侧，笔画还分着。`).join('');
 const through=SCREEN_CODE.map((digit,group)=>readable(progress,group)?`${SCREEN_PEOPLE[group]}一侧的空处，墨迹是${digit}。`:'').join('');
 return `<div class="screen-workbench screen-mode-${mode}" data-screen-view="${mode}" data-screen-focus="${group}" style="${cameraStyle(camera,'wide')}${cameraStyle(near,'near')}">
  ${mode==='whole'?`<nav class="screen-overview" aria-label="整幅纸屏"><div class="screen-overview-paint" aria-hidden="true" inert>${screenCase(progress,{owned,miniature:true})}</div>${SCREEN_NAMES.map((_,index)=>`<button class="screen-overview-look" style="left:${index*100/3}%;" ${view('paper',index)} aria-label="靠近${SCREEN_PEOPLE[index]}一侧"></button>`).join('')}</nav>`:''}
  <div class="screen-viewport"><div class="screen-world"><img class="screen-environment" src="${ASSETS.screenNook}" alt="" draggable="false">${screenCase(progress,{owned,mode,group})}</div>${mode!=='whole'?`<span class="screen-return-view">${viewControl('纸屏',view('whole',group),'zoom-out')}</span>`:''}${mode==='paper'?`<span class="screen-adjacent-view prev">${viewControl('靠近'+SCREEN_PEOPLE[(group+2)%3]+'一侧',view('paper',(group+2)%3),'left')}</span><span class="screen-adjacent-view next">${viewControl('靠近'+SCREEN_PEOPLE[(group+1)%3]+'一侧',view('paper',(group+1)%3),'right')}</span>`:''}</div>
  <output class="sr-only" role="status">${inkWords}${through}${progress.opened?'匣里露出画页和槽轮。':progress.attempts?'锁扣轻轻弹回。':''}</output>
 </div>`;
}
export function screenMiniature(state){const {left,top,width}=SCREEN_PLACEMENT;return `<div class="world-screen" style="left:${left}%;top:${top}%;width:${width}%" aria-hidden="true" inert>${screenCase(state.progress.screen,{owned:inventory(state),miniature:true,painted:true})}</div>`;}

