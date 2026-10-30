import {atlas,moveButton,itemSprite} from './dom.js';
import {STITCH_STRIPS,STITCH_HOLES,STITCH_PAPERS,STITCH_LEAF,stitchPoint,stitchBack,stitchNeedlePoint,needleBack} from '../data/stitch.js';
import {ALBUM_NAMES} from '../data/album.js';
import {toolElsewhere} from '../data/tool-uses.js';

const at=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
function sewingSample(back,passive){return `<button class="stitch-swatch" data-stitch-sample data-focus="stitch-swatch" aria-label="看看旧纸边上的针脚" ${passive?'disabled':''}><span class="stitch-swatch-turn" style="transform:rotateY(${back?180:0}deg)"><span class="stitch-swatch-face" ${back?'aria-hidden="true" data-copy-hidden':''}>${atlas('stitchParts',3)}</span><span class="stitch-swatch-face stitch-swatch-back" ${back?'':'aria-hidden="true" data-copy-hidden'}>${atlas('stitchParts',2)}</span></span></button>`;}
export function assemblySnips({passive=false,album=false,tied=false,finished=false}={}){
 const style=at(album?[1460,810,115,164]:[1400,754,110,157]);
 return passive?`<span class="assembly-snips" style="${style}">${atlas('stitchParts',5)}</span>`:moveButton(atlas('stitchParts',5),{type:'trim'},{className:'assembly-snips',key:'stitch-snips',disabled:!tied||finished}).replace('<button ',`<button style="${style}" aria-label="剪短结旁的线尾" `);
}
function folioFace(state,back,active,passive){
 const p=state.progress.stitch,able=active&&!passive&&p.fitted.every(Boolean)&&!p.tied&&back===needleBack(p);
 const papers=state.progress.album.order.map((page,i)=>{const [x,y]=STITCH_PAPERS[i],left=back?1536-x-STITCH_LEAF[0]:x,face=state.progress.album.faces[page]^Number(back),cuts=STITCH_HOLES.map((_,h)=>stitchPoint(h,back)).filter(([hx,hy])=>hx>left&&hx<left+STITCH_LEAF[0]&&hy>y&&hy<y+STITCH_LEAF[1]).map(([hx,hy])=>`radial-gradient(circle at ${hx-left}px ${hy-y}px,transparent 28px,#000 32px)`);return `<span class="stitch-leaf" data-stitch-leaf="${page}" data-stitch-paper-face="${face}" style="${at([left,y,...STITCH_LEAF])};${cuts.length?'mask-image:'+cuts.join(',')+';mask-composite:intersect;':''}">${atlas('albumPages',page+face*4,{label:ALBUM_NAMES[page]+'画页'+(face?'背面':'正面')})}</span>`;}).join('');
 const strips=STITCH_STRIPS.map((place,i)=>`<span class="stitch-strip ${back?'stitch-strip-rear':''}" style="${at(place)}">${atlas('stitchParts',i)}</span>`).join('');
 const holes=STITCH_HOLES.map((_,i)=>{const [x,y]=stitchPoint(i,back);return moveButton('',{type:'hole',index:i},{className:'stitch-hole',key:`stitch-hole-${back?'back':'front'}-${i}`,disabled:!able||p.path.includes(i)||!p.path.length&&i!==0}).replace('<button ',`<button data-stitch-hole="${i}" style="left:${x}px;top:${y}px" aria-label="${i<4?'上':'下'}排，从左数第${back?4-i%4:i%4+1}个孔${p.path.includes(i)?'，已有针脚':''}" `);}).join('');
 let ending='';
 if(p.path.length===8){const [x,y]=stitchPoint(p.path.at(-1),back);if(!back)ending=p.tied?`<span class="stitch-knot" style="${at([x-43,y-18,86,39])}">${atlas('stitchParts',7)}</span>`:moveButton(atlas('stitchParts',6),{type:'tie'},{className:'stitch-loop',key:'stitch-loop',disabled:passive||!p.fitted.every(Boolean)}).replace('<button ',`<button data-stitch-pull style="${at([x-76,y-23,152,62])}" aria-label="收紧线尾" `);}
 if(!back){const [x,y]=stitchPoint(0,false);ending+=`<span class="stitch-start-knot" style="${at([x-34,y-18,50,24])}" aria-label="起针的旧线头">${atlas('stitchParts',7)}</span>`;}
 return `<div class="stitch-face ${back?'stitch-face-back':''}" data-stitch-face="${back}" ${active?'':'inert aria-hidden="true" data-copy-hidden'}>${papers}${strips}<canvas class="stitch-cotton" width="1536" height="1024" data-stitch-cotton="${back}" aria-hidden="true"></canvas>${holes}${ending}</div>`;
}
export function bindingPapers(state,{view={},passive=false}={}){
 const p=state.progress.stitch,back=stitchBack(p,view),ready=p.fitted.every(Boolean),point=stitchNeedlePoint(p,back),hasNeedle=ready&&!p.finished&&back===needleBack(p),canSew=hasNeedle&&!passive&&!p.tied&&p.path.length<8;
 const ports=['棉线','装订针'].map((name,i)=>{
  const elsewhere=toolElsewhere(state,'stitch',i),content=i?atlas('stitchParts',4):itemSprite(1),fitted=p.fitted[i];
  if(p.finished||elsewhere||passive&&!fitted)return '';
  return `<div class="stitch-tool-port stitch-tool-${i} ${fitted?'stitch-tool-fitted':''}">${moveButton(content+`<small>${name}</small>`,{type:fitted?'unfit':'fit',index:i},{className:'stitch-tool-button',key:'stitch-fit-'+i,toolTarget:fitted?'':'stitch-fit:'+i,disabled:passive||fitted&&p.path.length>0}).replace('<button ',`<button aria-label="${fitted?'取回':'放入'}${name}" `)}</div>`;
 }).join('');
 const tag=canSew?'button':'span',needle=hasNeedle?`<${tag} class="stitch-needle" ${canSew?'data-stitch-needle data-focus="stitch-needle" aria-label="拿起装订针" aria-describedby="stitch-keys"':'aria-hidden="true"'} style="left:${point[0]}px;top:${point[1]}px">${atlas('stitchParts',4)}</${tag}>`:'';
 return `<div class="stitch-workbench" data-stitch-state='${JSON.stringify(p)}' data-stitch-back="${back}" data-stitch-prepared="${ready}"><div class="stitch-turntable" style="transform:rotateY(${back?180:0}deg)">${folioFace(state,false,!back,passive)}${folioFace(state,true,back,passive)}</div>${sewingSample(back,passive)}${ports}${needle}${assemblySnips({passive,tied:p.tied,finished:p.finished})}${passive?'':'<span id="stitch-keys" class="sr-only">装订针可以拖到孔里，孔也能用回车穿过。每一针会穿到另一面。旧纸边上留着两面的针脚。线尾收紧后，小剪还在托板边。</span>'}</div>`;
}
