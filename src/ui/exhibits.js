import { ASSETS, COLLECTIONS } from '../data/assets.js';
import {ASSET_LAYOUTS} from '../data/asset-layouts.js';
import {character,escape,atlas,icon} from './dom.js';
import { renderSkyPair, skyControls } from './sky.js';
import {postalPaperDesk} from './puzzles/postal.js';

const art = (key, label, className = '') => `<img class="exhibit-art ${className}" src="${ASSETS[key]}" alt="${escape(label)}" draggable="false">`;
const fit=(key,room)=>`--memory-ratio:${ASSET_LAYOUTS[key].width/ASSET_LAYOUTS[key].height};--memory-room:${room}px`;
const memoryDesk=(painting,controls,context)=>`<div class="memory-desk">${painting}<aside class="memory-margin">${controls}${context.memoryReturn?`<button class="text-button memory-return" data-action="memory-page" data-open="false">${escape(context.memoryReturn)}</button>`:''}</aside></div>`;

function sketch(context) {
  const ink = context.state.activities.includes('art:color') ? 100 : 12;
  return memoryDesk(`<div class="color-sketch memory-surface ${ink===100?'sketch-colored':''}" style="--ink:${ink}%;${fit('memoryGenshin',210)}">${art('memoryGenshin','画册里的魈与流浪者','sketch-underlay')}<div class="sketch-color">${art('memoryGenshin','','')}</div></div>`,`<label class="sketch-pencil"><span>添点颜色</span><input aria-label="给画页添点颜色" data-color-drawing type="range" min="0" max="100" value="${ink}"></label>`,context);
}

function artist(context) {
  const focus=context.view.focus??0,spots=[['稿本',49,40,76,56],['明信片',40,85,36,27],['挂件',77,80,24,25]];
  const picture=`<div class="artist-table memory-surface detail-${focus}" style="${fit('memoryNaruto',225)}"><div class="artist-paint">${art('memoryNaruto','带土与卡卡西的稿本、明信片和挂件')}${spots.map(([name,x,y,w,h],index)=>`<button class="artist-object" data-action="memory-detail" data-index="${index}" data-focus="artist-object-${index}" aria-label="${name}" aria-pressed="${focus===index}" style="left:${x-w/2}%;top:${y-h/2}%;width:${w}%;height:${h}%"></button>`).join('')}</div></div>`;
  return memoryDesk(picture,`<p class="memory-caption">${['稿本上又添了几幅。','一直留着呢。','小小一只，也认得出。'][focus]}</p>${focus?'<button class="icon-button artist-whole" data-action="memory-detail" data-index="0" aria-label="看看整张桌面">'+icon('zoom-out')+'</button>':''}`,context);
}

function cinema(context) {
  const playing = context.view.playing ?? false;
  return `<div class="cinema-memory memory-surface ${playing ? 'cinema-playing' : ''}" style="${fit('cinema',305)}"><div class="cinema-wide">${art('cinema', '小黑、无限和鹿野走过石桥')}<span class="projector-dust" aria-hidden="true"></span></div><button class="cinema-ticket" data-action="memory-cinema" aria-label="${playing ? '收起电影票' : '拉开电影票，开场'}"><span class="cinema-ticket-paper" aria-hidden="true">${atlas('pressParts',3)}</span><span>罗小黑战记 Ⅱ</span><small>${playing ? '那场电影。' : '开场'}</small><i>◦ ◦ ◦</i></button></div>`;
}

function fan(context) {
  const selected = context.view.figure ?? 0;
  const names = COLLECTIONS.hashira.names;
  return `<div class="paper-fan"><div class="fan-leaves">${names.map((name, index) => `<button class="fan-leaf ${selected === index ? 'fan-chosen' : ''}" style="--fan-angle:${(index - 4) * 8}deg" data-action="memory-figure" data-index="${index}" aria-label="${escape(name)}" aria-pressed="${selected === index}">${character('hashira', index, 3, 3, name)}</button>`).join('')}</div><div class="fan-index">${names.map((name,index) => `<button class="text-button" data-action="memory-figure" data-index="${index}" aria-label="${escape(name)}" aria-pressed="${selected === index}">${['水','蝶','炎','音','霞','恋','蛇','风','岩'][index]}</button>`).join('')}</div><p>${escape(names[selected])}</p></div><p class="memory-caption">富冈义勇，还有熟悉的那些身影。</p>`;
}

function prince(context) {
  const open = context.view.open ?? false;
  return `<div class="prince-keepsake ${open ? 'prince-open' : ''}"><div class="prince-cover">${character('gifts', 2, 3, 2, '小王子笔记本')}</div><div class="prince-page">${character('princeHei', 0, 2, 2, '小王子和玫瑰')}<p>“On ne voit bien qu’avec le cœur.”</p></div></div><div class="memory-tabs"><button class="text-button" data-action="memory-open">${open ? '合上' : '翻开'}</button></div><p class="memory-caption">看见小王子，就想起你。</p>`;
}

function postcards(context){return postalPaperDesk(context,{collection:true});}

export function memoryExhibit(id, context) {
  const views = { genshin: sketch, naruto: artist, hei: cinema, hashira: fan, prince, cities: postcards,
    sky: () => `${renderSkyPair(context.skyPair)}${skyControls(context.skyPair)}<p class="memory-caption">上线啦。</p>` };
  return (views[id] ?? (() => ''))(context);
}
