import {DECODER_WINDOWS,DECODER_LATCH} from '../data/birthday-lock.js';
import {atlas} from './dom.js';
import {decoderBox} from './birthday-papers.js';

export function birthdayHardware(p,{origin=[760,0],interactive=false}={}){
 const at=([x,y,w,h])=>[x-origin[0],y-origin[1],w,h];
 const drums=DECODER_WINDOWS.map((rect,index)=>{
  const n=p.values[index],tag=interactive&&!p.opened?'button':'span';
  const strip=Array.from({length:31},(_,i)=>`<b ${i===10+n?'':'data-copy-hidden'}>${i%10}</b>`).join('');
  return `<${tag} class="decoder-wheel" data-decoder-wheel="${index}" style="${decoderBox(at(rect))}" ${tag==='button'?`data-focus="number-${index}" role="slider" aria-label="第${index+1}枚字轮" aria-valuemin="0" aria-valuemax="9" aria-valuenow="${n}" aria-orientation="vertical"`:''}>${atlas('birthdayHardware',2)}<span class="decoder-wheel-strip" data-decoder-number style="--digit:${n}" aria-hidden="true">${strip}</span></${tag}>`;
 }).join('');
 return `<span class="decoder-lock-hardware">${drums}<span class="decoder-clasp" style="${decoderBox(at(DECODER_LATCH))}">${atlas('birthdayHardware',0)}<span class="decoder-clasp-arm" data-decoder-arm style="transform:rotateY(${p.opened?-112:0}deg)">${atlas('birthdayHardware',1)}</span></span></span>`;
}
