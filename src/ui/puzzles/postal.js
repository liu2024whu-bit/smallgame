import {ASSETS} from '../../data/assets.js';
import {POSTAL_ORDER} from '../../data/ciphers.js';
import {POSTAL_BODY,POSTAL_DOOR,POSTAL_DIGITS,POSTAL_CAMERAS} from '../../data/postal.js';
import {inventory} from '../../core/state.js';
import {atlas,escape} from '../dom.js';
import {postalCardBack,postalCardFront,postalGrid,borrowingTicket} from '../postal-papers.js';
const place=([x,y,w,h])=>`left:${x/12}%;top:${y/10}%;width:${w/12}%;height:${h/10}%;`;
const action=(name,value)=>`data-action="${name}" data-id="${value}"`;
const pmove=move=>`data-pmove="${escape(JSON.stringify(move))}"`;
function wheels(progress,interactive){
 if(!interactive)return `<div class="postal-wheel-bank" aria-hidden="true">${progress.values.map((value,index)=>`<span class="postal-wheel-slot" style="left:${POSTAL_DIGITS[index]*100}%"><span class="postal-wheel-sign">${POSTAL_ORDER[index]}</span><span class="postal-static-digit">${value}</span></span>`).join('')}</div>`;
 return `<div class="postal-wheel-bank">${progress.values.map((value,index)=>`<div class="postal-wheel-slot" style="left:${POSTAL_DIGITS[index]*100}%"><span class="postal-wheel-sign">${POSTAL_ORDER[index]}</span><button class="postal-drum" ${interactive?'':'disabled tabindex="-1"'} role="slider" data-lock-digit="${index}" data-focus="number-${index}" ${pmove({type:'turn',index,direction:1})} aria-label="第${index+1}轮" aria-valuemin="0" aria-valuemax="9" aria-valuenow="${value}" aria-valuetext="${value}" aria-orientation="vertical"><span class="postal-drum-strip" data-number-strip aria-hidden="true" style="--digit:${value}">${Array.from({length:31},(_,i)=>`<b ${i===10+value?'':'data-copy-hidden'}>${(i+10)%10}</b>`).join('')}</span></button></div>`).join('')}</div>`;
}
export function postalCabinet(progress,{owned=[],detail=false,miniature=false}={}){
 const opened=progress.opened,taken=owned.includes('borrowSlip'),[x,y,w,h]=POSTAL_CAMERAS[detail&&!opened?'detail':'cabinet'];
 const camera=`transform:translate(${-x/w*100}%,${-y/w*120}%) scale(${1200/w});`;
 const letters=miniature||detail&&!opened?'':`<button class="postal-note-stack" ${action('postal-view','papers')} aria-label="看看两张邮片">${postalCardFront(0)}</button><button class="postal-grid-button" data-action="evidence" data-id="postal" aria-label="看看分拣格">${postalGrid()}</button>`;
 const slip=opened&&!taken?`<button class="postal-ticket-pickup" data-action="collect-item" data-id="borrowSlip" aria-label="拿起借阅签" style="${place([485,425,240,260])}">${borrowingTicket()}</button>`:'';
 return `<div class="postal-cabinet ${opened?'postal-open':''} ${detail&&!opened?'postal-detail':''} ${miniature?'postal-miniature':''}" style="aspect-ratio:${w}/${h}" data-postal-cabinet data-postal-open="${opened}" data-password-lock="number" data-attempts="${progress.attempts}" ${miniature?'inert aria-hidden="true"':''}>
  <img class="postal-environment" src="${ASSETS.postalNook}" alt="" draggable="false">
  <div class="postal-camera" style="${camera}">${letters}${atlas('postalParts',0,{className:'postal-body',style:place(POSTAL_BODY),label:''})}${atlas('postalProps',0,{className:'postal-plant',style:place([383,-178,450,358]),label:''})}${slip}${atlas('postalProps',1,{className:'postal-ticket-pin',style:place([554,465,26,26]),label:''})}
   <div class="postal-door" style="${place(POSTAL_DOOR)}"><div class="postal-door-front" ${opened?'data-copy-hidden':''}>${atlas('postalParts',1,{className:'postal-door-paint',label:''})}${wheels(progress,detail&&!opened&&!miniature)}${detail&&!opened?`<button class="postal-handle" data-postal-latch data-focus="postal-latch" ${pmove({type:'submit'})} aria-label="拉锁扣">${atlas('postalParts',3,{className:'postal-handle-paint',label:''})}</button>`:`<span class="postal-handle">${atlas('postalParts',3,{className:'postal-handle-paint',label:''})}</span>`}${!detail&&!opened&&!miniature?`<button class="postal-lock-closer" ${action('postal-view','detail')} aria-label="凑近看看字轮"></button>`:''}</div><div class="postal-door-back">${atlas('postalParts',2,{className:'postal-door-paint',label:''})}</div></div>
  </div>${detail&&!opened?`<button class="postal-back text-button" ${action('postal-view','cabinet')}>放远些</button>`:''}<output class="sr-only" role="status">${opened?taken?'借阅签已经拿走了。':'匣门开了，里面有一张借阅签。':progress.attempts?'锁扣轻轻弹回。':''}</output>
 </div>`;
}
export function postalPaperDesk({state,view={}},{collection=false}={}){
 const card=view.card===1?1:0,back=!!view.back,mirror=!!view.reflected&&inventory(state).includes('mirror'),aim=Number.isFinite(view.postalAim)?view.postalAim:.5;
 return `<div class="postal-paper-desk ${mirror?'postal-mirror-out':''}" data-postal-desk data-postal-aim="${aim}">
  <img class="postal-environment" src="${ASSETS.postalNook}" alt="" draggable="false">
  <button class="postal-desk-grid" data-action="evidence" data-id="postal" aria-label="凑近看看分拣格">${postalGrid()}</button>
  <button class="postal-other-card" data-action="memory-card" data-index="${1-card}" aria-label="看看${card?'武汉':'南京'}那张">${postalCardFront(1-card)}</button>
  <div class="postal-paper-stand">${atlas('postalSupports',2,{label:'',className:'postal-stand-art'})}</div>
  <button class="postal-current-card ${back?'postal-card-turned':''}" data-action="memory-postcard" data-focus="postal-card" aria-label="${back?'看看正面':'翻看邮片背面'}"><span class="postal-card-leaf"><span class="postal-card-face" ${back?'data-copy-hidden':''}>${postalCardFront(card)}</span><span class="postal-card-rear" ${back?'':'data-copy-hidden'}>${postalCardBack(card)}</span></span></button>
  <div class="postal-mirror-rest">${atlas('postalSupports',3,{label:'',className:'postal-mirror-cradle'})}</div>
  ${mirror?`<div class="postal-hand-mirror" data-postal-mirror><div class="postal-mirror-image">${atlas('lightParts',0,{label:'',className:'postal-mirror-frame'})}<div class="postal-mirror-aperture"><div class="postal-reflection" aria-hidden="true">${back?postalCardBack(card):postalCardFront(card)}</div></div></div><button class="postal-mirror-grip" role="slider" data-postal-mirror-grip data-focus="postal-mirror" aria-label="小圆镜朝向" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(aim*100)}" aria-valuetext="${Math.round(aim*100)}" style="touch-action:none"></button><button class="text-button postal-mirror-return" data-action="memory-mirror" aria-label="收好镜子">先收着</button></div>`:`<button class="postal-mirror-fit" data-action="use-direct" data-id="mirror" data-tool-target="postcard-mirror" aria-label="把小圆镜放在镜托上" ${!inventory(state).includes('mirror')?'disabled':''}>镜托</button>`}
  <button class="postal-paper-return text-button" ${collection?`data-action="campus" data-index="${card}"`:action('postal-view','cabinet')}>${collection?'展开折页':'回到邮匣'}</button>
 </div>`;
}
export function renderPostbox(progress,context){
 const mode=context.view?.postal??'cabinet';
 return mode==='papers'?postalPaperDesk(context):postalCabinet(progress,{owned:inventory(context.state),detail:mode==='detail'});
}
export function postalMiniature(state){return `<div class="world-postal" aria-hidden="true" inert>${postalCabinet(state.progress.postbox,{owned:inventory(state),miniature:true})}</div><div class="world-postal-grid" aria-hidden="true" inert>${postalGrid({paper:false})}</div>${[0,1].map(card=>`<span class="world-postal-card world-postal-card-${card}" aria-hidden="true" inert>${postalCardFront(card)}</span>`).join('')}`;}
