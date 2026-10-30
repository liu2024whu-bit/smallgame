import {ASSETS} from '../data/assets.js';
import {WORD_CASE_PARTS,WORD_PUNCHES} from '../data/wordlock.js';
import {COLUMN_STRIP,ROW_STRIP} from '../data/ciphers.js';

const {centers,levels,size}=WORD_PUNCHES;
const image=async asset=>{const im=new Image();im.src=new URL(ASSETS[asset],new URL('../../',import.meta.url));await im.decode();return im;};
let pending;
export function wordPapersReady(){
 return pending??=(image('wordlockCaseParts').then(parts=>{
  const sample=document.createElement('canvas');sample.width=sample.height=64;
  const sc=sample.getContext('2d',{willReadFrequently:true});sc.drawImage(parts,...WORD_CASE_PARTS.frames[5],0,0,64,64);
  const ink=sc.getImageData(0,0,64,64),cut=sc.createImageData(64,64);
  // Use the painted aperture's inner edge, rather than a hard perfect circle.
  for(let y=0;y<64;y++)for(let x=0;x<64;x++)if(Math.hypot(x-32,y-32)<20){const at=(y*64+x)*4;cut.data[at+3]=255-ink.data[at+3];}
  const hole=document.createElement('canvas');hole.width=hole.height=64;hole.getContext('2d').putImageData(cut,0,0);
  const sheets={};
  for(const [kind,values,frame]of [['columns',COLUMN_STRIP,3],['rows',ROW_STRIP,4]]){
   const canvas=document.createElement('canvas');[canvas.width,canvas.height]=size;const ctx=canvas.getContext('2d');
   ctx.drawImage(parts,...WORD_CASE_PARTS.frames[frame],0,0,...size);
   values.forEach((value,i)=>{const x=centers[i],y=levels[value-1];ctx.globalCompositeOperation='destination-out';ctx.drawImage(hole,x-13,y-13,26,26);ctx.globalCompositeOperation='source-over';ctx.drawImage(sample,x-13,y-13,26,26);});
   sheets[kind]=canvas;
  }
  return sheets;
 }).catch(error=>{pending=null;throw error;}));
}
export function hydrateWordPapers(root){
 const targets=[...root.querySelectorAll('[data-word-strip]')];if(!targets.length)return;
 wordPapersReady().then(sheets=>{for(const target of targets)if(target.isConnected){target.querySelector('canvas').getContext('2d').drawImage(sheets[target.dataset.wordStrip],0,0);target.dataset.ready='true';}}).catch(()=>{for(const target of targets)if(target.isConnected){target.dataset.failed='true';target.setAttribute('aria-label','纸还没展开，再看一眼？');}});
}
