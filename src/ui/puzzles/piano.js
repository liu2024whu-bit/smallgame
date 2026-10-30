import {viewControl} from '../view-control.js';
import {ASSETS,MOTIFS} from '../../data/assets.js';
import {PIANO_CAMERA,PIANO_FRAGMENTS,PIANO_WHITE_NOTES,PIANO_BLACK_NOTES,PIANO_WHITE_BACK,PIANO_WHITE_FRONT,PIANO_BLACK_POLYGONS,pianoNoteName,pianoScaleNumber,pianoKeyboardLabel} from '../../data/piano.js';
import {atlas} from '../dom.js';
import {PIANO_TOUCH_CAMERAS} from '../../data/piano.js';

function mark(name,side){return name?`<span class="piano-seam ${side}">${atlas('motifs',MOTIFS[name])}</span>`:`<small class="piano-seal ${side}">${side==='left'?'起':'止'}</small>`;}
function fragment(p,id,slot,passive){
 const spec=PIANO_FRAGMENTS[id],face=p.faces[id],correct=face===spec.face;
 const paper=atlas('invitation',3,{className:'piano-paper-stock'}),ink=`${mark(spec.left,'left')}${mark(spec.right,'right')}<span class="piano-note-ink ${correct?'':'ink-through'}">${spec.notes.map(n=>`<b>${pianoScaleNumber(n)}</b>`).join('')}</span>`;
 const front=face===0?ink:'',back=face===1?ink:'';
 return `<button class="piano-fragment" data-piano-fragment="${id}" data-piano-slot="${slot}" data-focus="piano-fragment-${id}" aria-label="第${slot+1}段琴谱，${correct?'字迹朝上':'纸背透着字迹'}，拖动换位，轻点翻面" style="left:${414+slot*184}px" ${passive?'disabled':''}><span class="piano-card-turner" data-piano-face="${id}" style="transform:perspective(800px) rotateY(${face*180}deg)"><span class="piano-card-front">${paper}${front}</span><span class="piano-card-back">${paper}${back}</span></span></button>`;
}
export function pianoKeyLayout(){
 const white=PIANO_WHITE_NOTES.map((note,i)=>{const l=PIANO_WHITE_FRONT[i],r=PIANO_WHITE_FRONT[i+1];return {note,black:false,polygon:[[PIANO_WHITE_BACK[i],548],[PIANO_WHITE_BACK[i+1],548],[r,666],[r,713],[l,713],[l,666]]};});
 const black=PIANO_BLACK_NOTES.map((note,i)=>({note,black:true,polygon:PIANO_BLACK_POLYGONS[i]}));
 return [...white,...black];
}
function keys(){return pianoKeyLayout().map(({note,black,polygon})=>{
 const xs=polygon.map(p=>p[0]),ys=polygon.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y,clip=polygon.map(([a,b])=>(a-x)+'px '+(b-y)+'px').join(',');
 return `<button class="piano-key ${black?'piano-black':'piano-white'}" data-piano-note="${note}" data-focus="piano-key-${note}" aria-label="${pianoNoteName(note)}" aria-keyshortcuts="${pianoKeyboardLabel(note)}" title="${pianoNoteName(note)} · ${pianoKeyboardLabel(note)}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;clip-path:polygon(${clip})"><span class="piano-key-paint"><img src="${ASSETS.pianoNear}" alt="" draggable="false" style="left:${-x}px;top:${-y}px">${black?'':`<span class="piano-key-number" style="left:${(PIANO_WHITE_FRONT[PIANO_WHITE_NOTES.indexOf(note)]+PIANO_WHITE_FRONT[PIANO_WHITE_NOTES.indexOf(note)+1])/2-x-17}px;top:${677-y}px">${pianoScaleNumber(note)}${note>=12?`<i>${'·'.repeat(Math.floor(note/12))}</i>`:''}</span>`}</span></button>`;
}).join('');}
export function renderPiano(p,{state,view={}}){
 const done=state.solved.includes('piano'),camera=PIANO_TOUCH_CAMERAS[view.pianoCamera]??PIANO_CAMERA,[x,y,w,h]=camera,back=!!view.pianoBack;
 const touchViews=`<nav class="piano-touch-views" aria-label="钢琴取景">${[['whole','琴上'],['low','低音'],['high','高音']].map(([id,name])=>`<button class="quiet-button" data-piano-camera="${id}" aria-pressed="${(view.pianoCamera??'whole')===id}">${name}</button>`).join('')}${view.pianoCamera&&view.pianoCamera!=='whole'&&!done?'<button class="quiet-button" data-piano-pedal>轻试踏板</button>':''}</nav>`;
 const pages=p.order.map((id,slot)=>fragment(p,id,slot,done)).join('');
 const phrase=`<span class="piano-phrase" aria-label="刚才弹过的音">${p.played.map(n=>`<span title="${pianoNoteName(n)}">${pianoScaleNumber(n)}${n>=12?`<i>${'·'.repeat(Math.floor(n/12))}</i>`:''}</span>`).join('')}</span>`;
 const note=done?`<button class="piano-encore-note" data-piano-letter data-focus="piano-letter" aria-label="琴腹里露出一页纸" aria-expanded="${!!view.pianoLetter}">${view.pianoLetter?'生日快乐。':'有张短笺'}</button>`:`<button class="piano-pedal" data-piano-pedal data-focus="piano-pedal" aria-label="轻试琴下的踏板"></button>`;
 const reading=back?'<p>回声从尾端往回走，<br>比原来的琴声，高了一层。</p>':done?'<p>还可以接着弹。</p>':p.played.length?phrase:p.attempts?'<p>踏板轻轻弹回了。</p>':'';
 return `<div class="piano-workbench" data-button-taps>${touchViews}<div class="piano-viewport" style="--piano-aspect:${w/h}"><div class="piano-world" data-source-camera="${camera}" data-piano-model data-piano-open="${done}" data-piano-played="${p.played.join(',')}"><img class="piano-case-paint" src="${done?ASSETS.pianoDone:ASSETS.pianoNear}" alt="${done?'琴腹的小盖板打开了，里面露出一页纸':'两八度小钢琴，琴谱夹在谱架上，黄铜踏板连在琴底'}" draggable="false">${pages}${keys()}${note}</div></div><div class="piano-reading">${viewControl(back?'琴上':'谱架背面',`data-action="piano-score-back" aria-pressed="${back}"`,'book')}${reading}${!done?viewControl('这一小段，重新弹','data-piano-clear','undo'):viewControl('弹一首《生日快乐》','data-piano-song data-focus="piano-song" aria-pressed="false"','music')}</div>${done?'<p class="piano-song-caption" data-piano-song-caption aria-live="polite">想再听一遍，或者自己弹，都可以。</p>':''}<details class="piano-keyboard" data-fold="piano-keyboard"><summary>键盘也能弹</summary><p>低音：<kbd>Z S X D C V G B H N J M</kbd><br>高音：<kbd>Q 2 W 3 E R 5 T 6 Y 7 U I</kbd></p><p>不必抢拍子，弹完后再试踏板就好。</p></details><span class="sr-only">四段纸谱可以拖动换位，轻点翻面，也可聚焦后用左右方向键换位、空格翻面。琴键用鼠标或回车弹奏，左右方向键逐音移动；不用限时，不需要听辨音高。</span></div>`;
}
