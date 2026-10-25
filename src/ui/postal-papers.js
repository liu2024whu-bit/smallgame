import {POSTMARKS,POSTAL_ORDER,POSTAL_GRID} from '../data/ciphers.js';
import {atlas,character,escape,itemSprite} from './dom.js';
import {ITEMS} from '../data/items.js';
import {POSTCARD_SIZE,POSTCARD_MARKS} from '../data/postal.js';

export function postalMarks(card){
 const marks=POSTMARKS.filter(mark=>mark.card===card);
 return `<span class="postal-impressions ${card===1?'postal-reversed':''}">${marks.map(({mark,row,column},i)=>`<span class="postal-impression" style="left:${POSTCARD_MARKS[i][0]/POSTCARD_SIZE[0]*100}%;top:${POSTCARD_MARKS[i][1]/POSTCARD_SIZE[1]*100}%">${atlas('postalStamps',POSTAL_ORDER.indexOf(mark),{label:'',className:'postal-stamp-ink'})}<b>${escape(mark)}</b><span>${String.fromCharCode(65+row)}${column+1}</span></span>`).join('')}</span>`;
}
export function postalCardBack(card){
 return `<div class="postal-card-print" data-postal-print>${atlas('postalSupports',0,{label:'',className:'postal-card-paper'})}<span class="postal-card-city">${card?'南京':'武汉'}</span>${postalMarks(card)}</div>`;
}
export function postalCardFront(card){
 return `<span class="postal-front">${atlas('postalSupports',0,{label:'',className:'postal-card-paper'})}${character('campuses',card,2,1,card?'北大楼 · 鼓楼':'日字斋','postal-campus-print')}<span>${card?'南京':'武汉'}<small>${card?'鼓楼':'珞珈山'}</small></span></span>`;
}
export function postalGrid({paper=true}={}){
 return `<div class="postal-sort-paper">${paper?atlas('postalSupports',1,{label:'',className:'postal-sort-texture'})+atlas('postalProps',1,{label:'',className:'postal-sort-tack'}):''}<div class="postal-sort-print"><span>晚邮</span><table aria-label="分拣格：字母表示行，数字表示列"><thead><tr><td></td>${[1,2,3,4].map(n=>`<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>${POSTAL_GRID.map((row,i)=>`<tr><th scope="row">${'ABCD'[i]}</th>${row.map(n=>`<td>${n}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}
export function borrowingTicket(){return itemSprite(ITEMS.borrowSlip.sprite,'borrowing-ticket');}
