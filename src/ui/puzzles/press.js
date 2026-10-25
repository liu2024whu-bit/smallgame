import {PAPER_SEED,PAPER_TARGET,STAMPS,operate,applyOperations} from '../../puzzles/paper.js';
import {PRESS_MARKS,PRESS_NAMES,PRESS_WORLD,PRESS_BOOKMARK} from '../../data/press.js';
import {inventory} from '../../core/state.js';
import {atlas,moveButton,itemSprite} from '../dom.js';
import {rasterPlane} from '../raster-plane.js';

export const pressInk=value=>atlas('pressParts',value+4,{className:'press-ink',label:STAMPS[value]});
export function inkRow(values,className=''){
 return `<span class="press-ink-row ${className}" aria-label="${values.map(v=>STAMPS[v]).join('、')}">${values.map(value=>`<span class="press-ink-slot">${pressInk(value)}</span>`).join('')}</span>`;
}
function plateDiagram(operation){
 const result=operate(PAPER_SEED,operation);
 return `<svg class="plate-paths" viewBox="0 0 100 112" aria-hidden="true">${PAPER_SEED.map((v,i)=>{
  const x=10+i*20,to=10+result.indexOf(v)*20;
  return `<path d="M${x} 7C${x} 42 ${to} 65 ${to} 100"/><circle cx="${x}" cy="7" r="2"/><path class="plate-path-end" d="m${to-3} 96 3 5 3-5"/>`;
 }).join('')}</svg>`;
}
function plate(operation,index,disabled,miniature){
 const attrs=miniature?'':`role="slider" tabindex="${disabled?-1:0}" aria-disabled="${disabled}" aria-label="${PRESS_NAMES[operation]}版，所在位置" aria-valuemin="1" aria-valuemax="3" aria-valuenow="${index+1}" aria-valuetext="第${index+1}格，共三格" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home End" data-focus="press-plate-${operation}"`;
 return `<div class="${miniature?'':'operation-piece '}press-plate" data-plate="${operation}" ${attrs}>${atlas('pressParts',0,{className:'press-cassette'})}<span class="plate-mark" aria-hidden="true">${PRESS_MARKS[operation]}</span>${plateDiagram(operation)}</div>`;
}
function printSlip(operation){
 return `<div class="press-test" aria-label="${PRESS_NAMES[operation]}版的试印">${atlas('pressParts',3,{className:'press-slip-art'})}<span class="test-mark" aria-hidden="true">${PRESS_MARKS[operation]}</span><span class="test-input">${inkRow(PAPER_SEED)}</span><span class="test-arrow" aria-hidden="true">↓</span><span class="test-output">${inkRow(operate(PAPER_SEED,operation))}</span></div>`;
}
function bookmarkCue(){
 const {view:[width,height],wood,cord}=PRESS_BOOKMARK;
 return `<svg class="press-book-cue" viewBox="0 0 ${width} ${height}" aria-hidden="true"><foreignObject x="0" y="0" width="${width}" height="${height}"><div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:${width}px;height:${height}px">${rasterPlane('lightBook',0,wood)}${rasterPlane('lightBook',1,cord)}</div></foreignObject></svg>`;
}
export function pressCase(progress,{done=false,miniature=false,ownsBook=true,rewardTaken=false}={}){
 const opened=progress.opened;
 const lever=atlas('pressParts',1,{className:'press-arm',label:''});
 const latch=atlas('pressParts',9,{className:'press-latch-art',label:''});
 const control=miniature?`<span class="press-lever">${lever}</span>`:moveButton(lever,{type:'print'},{className:'press-lever',disabled:!opened||done,key:'press-handle'}).replace('<button ',`<button data-press-handle aria-label="压下木柄，印一张" `);
 const catchAttrs=ownsBook?'data-action="use-direct" data-id="bookmark" data-tool-target="paper-latch"':`data-pmove='{"type":"open"}'`;
 const catchControl=miniature?`<span class="press-latch">${latch}</span>`:`<button class="press-latch" ${catchAttrs} data-focus="press-latch" aria-label="${ownsBook?'用木书签挑开夹扣':'夹扣，边上有道窄缝'}" ${opened?'disabled':''}>${latch}</button>`;
 const rewardTag=miniature?'span':'button';
 const reward=done&&!rewardTaken?`<${rewardTag} class="press-reward" ${miniature?'':'data-action="collect-item" data-id="transparency" data-focus="take-transparency" aria-label="拿起透片"'}>${itemSprite(4)}</${rewardTag}>`:'';
 const proof=progress.proof?applyOperations(PAPER_SEED,progress.proof):null;
 const proofTag=miniature?'span':'button';
 const proofAttrs=miniature?'':`data-action="press-proof" data-open="true" data-focus="press-proof" aria-label="拿近看刚印的纸" ${proof?'':'disabled'}`;
 return `<div class="press-case ${opened?'press-open':''} ${done?'press-done':''}" data-press-open="${opened}" data-press-count="${progress.presses}">${atlas('pressMain',0,{className:'press-body',label:'有滑盖、三格版槽和木柄的试印盒'})}<div class="press-wells" ${opened&&!done?'':'inert'}>${progress.order.map((op,i)=>plate(op,i,!opened||done,miniature)).join('')}</div><div class="press-lid">${atlas('pressMain',1,{className:'press-lid-art'})}<span class="press-target-label">印样</span>${inkRow(PAPER_TARGET,'press-target')}</div>${control}${catchControl}${bookmarkCue()}<div class="press-drawer">${atlas('pressMain',2,{className:'press-drawer-art'})}${reward}</div><${proofTag} ${proofAttrs} class="press-proof ${proof?'has-proof':''}" data-proof="${progress.proof?.join('')??''}">${atlas('pressParts',3,{className:'press-slip-art'})}${proof?inkRow(proof):''}</${proofTag}></div>`;
}
export function renderPaper(progress,{state,view={}}){
 if(view.pressProof&&progress.proof)return `<div class="press-reading"><div><p>印样</p><div class="press-reading-slip">${atlas('pressParts',3,{className:'press-slip-art'})}${inkRow(PAPER_TARGET)}</div></div><div><p>刚才那张</p><div class="press-reading-slip">${atlas('pressParts',3,{className:'press-slip-art'})}${inkRow(applyOperations(PAPER_SEED,progress.proof))}</div></div><button class="text-button" data-action="press-proof" data-open="false">放回去</button></div>`;
 const done=state.solved.includes('paper');
 return `<div class="press-workbench"><div class="press-machine">${pressCase(progress,{done,ownsBook:inventory(state).includes('bookmark'),rewardTaken:inventory(state).includes('transparency')})}</div><aside class="press-samples" aria-label="留在旁边的试纸"><span class="press-samples-title">试纸</span>${[0,1,2].map(printSlip).join('')}</aside><output class="sr-only" data-press-status>${progress.opened?'滑盖已打开。':'夹扣下留着一条窄缝。'}${progress.proof?`最近的一张：${applyOperations(PAPER_SEED,progress.proof).map(v=>STAMPS[v]).join('、')}。`:'还没有印过。'}</output></div>`;
}
export function pressMiniature(progress,done,owned=[]){
 return `<div class="world-press" style="left:${PRESS_WORLD.left}%;top:${PRESS_WORLD.top}%;width:${PRESS_WORLD.width}%" aria-hidden="true" inert ${done?'data-world-change="paper"':''}>${pressCase(progress,{done,miniature:true,rewardTaken:owned.includes('transparency')})}</div>`;
}
