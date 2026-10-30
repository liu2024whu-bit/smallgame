import {viewControl} from '../view-control.js';
import {ASSETS} from '../../data/assets.js';
import {FILM_SIZE as SIZE,FILM_CLOSED_SIZE,FILM_NAMES,FILM_WINDOWS as W,FILM_PAPER as P,FILM_CAMERAS,FILM_REWARD_CAMERA,FILM_SOURCE,FILM_PLACEMENT,filmRoomBounds} from '../../data/film.js';
import {filmEnds,filmContinuity,FRAME_PERFORATIONS} from '../../puzzles/film.js';
import {filmPose} from '../../services/film-pose.js';
import {sceneSource} from '../scene-source.js';
import {atlas,motif,itemSprite,escape,icon} from '../dom.js';

const place=([x,y,w,h])=>`left:${x/SIZE*100}%;top:${y/SIZE*100}%;width:${w/SIZE*100}%;height:${h/SIZE*100}%;`;
export const filmPaper=(index,angle=0,style='')=>`<span class="film-paper" style="${style}"><span class="film-paper-turn" style="transform:rotateY(${angle}deg)"><span class="film-paper-side">${atlas('filmPaper',index,{label:''})}</span><span class="film-paper-side film-paper-back">${atlas('filmPaper',index+4,{label:''})}</span></span></span>`;
const pose=faces=>faces.map((v,i)=>filmPaper(i,v*180,`left:${i*24+4}%`)).join('');
export function filmMiniature(){const {left,top,width,foot,roll}=FILM_PLACEMENT,[w,h]=FILM_CLOSED_SIZE;return `<span class="world-film-case" style="left:${left}%;top:${top}%;width:${width}%;transform-origin:${foot[0]/w*100}% ${foot[1]/h*100}%;rotate:${roll}deg" inert aria-hidden="true">${atlas('filmClosed',0,{label:''})}</span>`;}
export const filmHoles=id=>`<span class="film-registration" aria-label="${FRAME_PERFORATIONS[id]}个定位孔">${Array.from({length:FRAME_PERFORATIONS[id]},()=>atlas('filmParts',3,{label:''})).join('')}</span>`;
export function filmContact(id){
 const ends=filmEnds(id);
 return `<span class="film-carrier">${atlas('filmParts',0,{label:''})}</span><span class="film-end film-end-first">${pose(ends.before)}</span><span class="film-end film-end-last">${pose(ends.after)}</span>`;
}
function clip(id,p,active,selected,detail=false){
 const contact=filmContact(id);
 return `<div class="${detail?'film-selected-clip':'film-frame '+(selected?'frame-inspecting':'')}" ${detail?`data-film-sample="${id}"`:`data-film-clip="${id}" data-focus="film-clip-${id}" ${active?'tabindex="0"':''}`} aria-label="第${id+1}段胶片${detail?'的两端':'，可拖动，Alt和方向键也能调序'}"><small class="frame-number">${['Ⅰ','Ⅱ','Ⅲ'][id]}</small>${detail?`<span class="film-detail-picture">${contact}</span>`:`<button class="film-inspect" data-film-inspect="${id}" data-focus="film-inspect-${id}" aria-label="放映第${id+1}段胶片">${contact}</button>`}${filmHoles(id)}<span class="film-feed" style="left:${p.reverse[id]?80:20}%">${atlas('filmParts',1,{label:''})}${active?`<button class="film-direction" data-film-reverse="${id}" data-focus="film-reverse-${id}" aria-label="第${id+1}段换个放映方向，当前从${p.reverse[id]?'右':'左'}端起" aria-pressed="${p.reverse[id]}" title="从另一头放"></button>`:''}</span></div>`;
}
export const filmDetail=(id,p)=>clip(id,p,!p.opened,false,true);
function leaves(p){
 const [x,y,w,h]=W.leaves,H=P.height,width=H*300/440;
 return `<div class="film-leaves" style="${place(W.leaves)}">${p.faces.map((face,i)=>`<span class="film-leaf" style="left:${(P.centers[i]-width/2-x)/w*100}%;top:${(P.base-H*433/440-y)/h*100}%;width:${width/w*100}%;height:${H/h*100}%">${filmPaper(i,face*180)}<button class="film-leaf-hit" data-film-face="${i}" data-focus="film-face-${i}" aria-label="${FILM_NAMES[i]}纸叶，当前${face?'背面':'正面'}" ${p.opened?'disabled':''}></button></span>`).join('')}</div>`;
}
function pocket(p,state){
 if(!p.opened)return `<button class="film-latch" data-film-submit data-focus="film-latch" style="${place(W.latch)}" aria-label="试试片袋搭扣"></button>`;
 return `<div class="film-pocket-open" style="${place(W.pocket)}">${atlas('filmPocket',1,{label:''})}</div>${!state.collected.includes('pageC')?`<button class="film-reward" data-action="collect-item" data-id="pageC" aria-label="从片袋拿起画页C" style="${place([627,1068,274,80])}"><span class="film-reward-mask">${itemSprite(9)}</span></button>`:''}<div class="film-pocket-lip" style="${place([130,1092,995,117])}">${atlas('filmPocket',2,{label:''})}</div>`;
}
export function renderFilm(p,{state,view={}}){
 if(view.filmOpen===false){
  const painting=`<img class="film-source-backdrop" src="${ASSETS.filmNook}" alt="" draggable="false">${sceneSource(filmMiniature(),FILM_SOURCE)}`;
  const b=filmRoomBounds(),c=FILM_SOURCE,hit=`left:${(b.x-b.width/2-c.left)/c.width*100}%;top:${(b.y-b.height/2-c.top)/c.height*100}%;width:${b.width/c.width*100}%;height:${b.height/c.height*100}%`;
  return `<div class="film-closed" data-button-taps><div class="film-source-viewport">${painting}<button class="film-cover" style="${hit}" data-film-unfold aria-label="打开书架下层的片匣"></button></div><p class="film-cover-caption">${p.opened?'片袋，还在里面。':'一只合着的片匣。'}</p></div>`;
 }
 const mode=Object.hasOwn(FILM_CAMERAS,view.filmView)?view.filmView:'whole',[x,y,w,h]=p.opened&&mode==='tail'?FILM_REWARD_CAMERA:FILM_CAMERAS[mode];
 const playback=view.filmPlayback,id=playback?.id??-1,phase=playback?.phase??0,figure=filmPose(id,p.reverse[id],phase),mounted=p.fitted[0];
 const status=p.opened?'':p.attempts?mounted?filmContinuity(p.order,p.reverse).complete?'片尾的纸叶，还差一点。':'接起来，好像跳过了一刻。':'片匣里，还空着三格。':'';
 return `<div class="film-workbench" data-button-taps data-film-mode="${mode}" data-film-state="${escape(JSON.stringify(p))}"><div class="film-viewport" style="--film-aspect:${w/h};--film-left:${-x/w*100}%;--film-top:${-y/h*100}%;--film-width:${SIZE/w*100}%;--film-height:${SIZE/h*100}%"><div class="film-case">
 <img class="film-body" src="${ASSETS.filmCase}" alt="展开的片匣，底下有三格胶片、四片纸叶和一只片袋" draggable="false">
 <div class="film-movie" style="${place(W.movie)}"><img class="film-cinema" src="${ASSETS.cinema}" alt="石桥上的小黑与伙伴" draggable="false"><div class="film-stage-papers">${figure.angles.map((angle,i)=>filmPaper(i,angle,`left:${i*23+9}%`)).join('')}</div><span class="film-petal" style="top:${7+figure.time*68}%;rotate:${-30+figure.time*90}deg">${motif('petal')}</span>${mode==='whole'?'<button class="film-zoom" data-film-view="movie" aria-label="靠近片场"></button>':''}</div>
 <div class="film-clips" style="${place(W.clips)}" ${['movie','tail'].includes(mode)?'inert data-copy-hidden':''}>${mounted?p.order.map(clipId=>clip(clipId,p,!p.opened,clipId===id)).join(''):`<button class="film-empty-slot" data-action="use-direct" data-id="filmStrip" data-tool-target="film-load" aria-label="把胶片放进片匣" ${!state.collected.includes('filmStrip')?'disabled':''}>${atlas('filmParts',2,{label:''})}</button>`}</div>
 <div ${['movie','clips'].includes(mode)?'inert':''}>${leaves(p)}</div><div ${['movie','clips'].includes(mode)?'inert':''}>${pocket(p,state)}</div></div></div>
 ${p.opened&&['whole','tail'].includes(mode)?'<p class="film-found-note">雏菊在玫瑰后面。</p>':''}
 ${mode==='movie'&&mounted?`<div class="film-selected-holder">${filmDetail(id<0?p.order[0]:id,p)}</div>`:''}
 <nav class="film-navigation" aria-label="片匣取景">${viewControl(mode==='whole'?'细看画面':'回到整匣',`data-film-view="${mode==='whole'?'movie':'whole'}"`)}</nav>
 <div class="film-transport"><button class="quiet-button" data-film-play aria-pressed="false" ${!mounted?'disabled':''}>${icon('play')}放一遍</button><input class="film-seek" type="range" min="0" max="1" step=".01" value="${phase}" data-film-seek aria-label="当前胶片停格" ${!mounted||id<0?'disabled':''}><button class="text-button" data-film-start ${!mounted?'disabled':''}>从头放</button></div><output class="film-reply" role="status">${status}</output><span class="sr-only">开场时四片纸叶都朝正面。胶片上的铜夹标着起头的一端，可以换到另一端；胶片可以拖动换位。匣子下方的纸叶能翻面，片袋的搭扣可以试开。观察与放映不会替你改动纸叶。</span></div>`;
}
export function filmInspection(p,context){
 if(context.view?.filmOpen!==false)return null;
 return {title:'片匣',className:'workbench-dialog puzzle-film film-cover-dialog',html:renderFilm(p,context)};
}
