import {LETTER_GRID,COLUMN_STRIP,ROW_STRIP} from '../data/ciphers.js';
import {WORD_PUNCHES} from '../data/wordlock.js';
import {atlas} from './dom.js';
import {matrixStyle} from './raster-plane.js';

export function wordStrip(kind,{back=false}={}){
 const {centers,levels}=WORD_PUNCHES,values=kind==='rows'?ROW_STRIP:COLUMN_STRIP;
 const description=(back?'薄纸背面，字迹是反的。':'')+values.map((v,i)=>`第${i+1}栏的孔在第${v}${kind==='rows'?'行':'列'}`).join('，');
 return `<button class="word-strip ${back?'strip-back':''}" data-word-strip="${kind}" data-flip-strip="${kind}" data-focus="paper-${kind}" aria-label="${kind==='rows'?'翻看匣旁薄纸':'查看托板上的孔带'}" aria-description="${description}"><canvas width="690" height="136" aria-hidden="true"></canvas><span class="word-strip-label">${kind==='rows'?'行':'列'}</span><span class="word-strip-ink" aria-hidden="true">${['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ'].map((v,i)=>`<i style="left:${centers[i]}px;top:8px">${v}</i>`).join('')}${levels.map((y,i)=>`<i style="left:106px;top:${y-10}px">${i+1}</i>`).join('')}</span></button>`;
}
export function wordNotebook({flipped=false,quad=null,passive=false,focus='papers',inkOnly=false}={}){
 const grid=`<table class="word-letter-chart" aria-label="五行五列字表"><thead><tr><td></td>${[1,2,3,4,5].map(n=>`<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>${LETTER_GRID.map((row,i)=>`<tr><th scope="row">${i+1}</th>${[...row].map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 return `<div class="word-notebook" ${quad?`style="left:0;top:0;rotate:0deg;scale:1;transform:${matrixStyle(quad,934,643)}"`:''} ${passive?'inert aria-hidden="true"':''}>${inkOnly?'':atlas('wordlockPaperParts',0,{className:'word-notebook-art'})}<span class="word-chart-title">行 ↓　列 →</span>${grid}<small class="word-chart-note">I / J</small>${focus==='papers'?'<button class="word-chart-hit" data-read-zoom="alphabet" data-focus="letter-chart" aria-label="近看字表"></button>':''}<span class="word-paper-corner" ${['papers','rows'].includes(focus)?'':'inert'}>${wordStrip('rows',{back:!flipped})}</span></div>`;
}
export function wordReadingTable({flipped=false,boardBack=false,hasBoard=true,focus='papers'}={}){
 const wood=new URL('../../assets/illustrations/wordlock-near.webp',import.meta.url).href;
 const boardArt=atlas(boardBack?'gardenBoardBack':'gardenBoard',0,{className:'word-reading-board-art'});
 const boardFace=focus==='papers'?`<button class="word-board-turn" data-flip-board data-focus="board-turn" aria-label="翻看装订托板">${boardArt}</button>`:boardArt;
 return `<div class="word-reading-table"><img class="word-reading-wood" src="${wood}" alt="" draggable="false">${hasBoard?`<div class="word-reading-board" ${['papers','columns'].includes(focus)?'':'inert'}>${boardFace}${boardBack?`<div class="word-board-strip">${wordStrip('columns')}</div>`:''}</div>`:''}${wordNotebook({flipped,focus})}</div>`;
}
