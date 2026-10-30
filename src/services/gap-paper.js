import {GAP_GOAL,GAP_STEP} from '../puzzles/cloud-gap.js';

// All visible cut edges come from the painted cat bitmap. Each paper is a
// fixed mask, translated by exactly the same distance as its own pull tab.
const SIZE=512,canvas=()=>Object.assign(document.createElement('canvas'),{width:SIZE,height:SIZE});
const load=async url=>{const image=new Image();image.src=url;await image.decode();return image;};
export async function createGapPaper(){
 const parts=await load(new URL('../../assets/illustrations/gap-paper-parts.webp',import.meta.url));
 const target=canvas(),tc=target.getContext('2d',{willReadFrequently:true});
 tc.drawImage(parts,1035,226,469,340,121,158,270,196);
 const ink=tc.getImageData(0,0,SIZE,SIZE),targetBits=new Uint8Array(SIZE*SIZE);
 for(let i=0;i<targetBits.length;i++){
  const at=i*4,inside=ink.data[at+3]>155&&ink.data[at]+ink.data[at+1]+ink.data[at+2]<400;
  const grain=(ink.data[at]+ink.data[at+1]+ink.data[at+2])/3;
  targetBits[i]=Number(inside);ink.data[at]=107+grain*.28;ink.data[at+1]=96+grain*.25;ink.data[at+2]=73+grain*.2;ink.data[at+3]=inside?Math.max(170,255-grain*.9):0;
 }
 tc.putImageData(ink,0,0);
 const holes=[],sheets=[];
 for(let layer=0;layer<3;layer++){
  const sheet=canvas(),ctx=sheet.getContext('2d');ctx.fillStyle=['#f8f0dc','#e9f1f5','#eaf0db'][layer];ctx.fillRect(0,0,SIZE,SIZE);ctx.globalAlpha=.62;
  ctx.drawImage(parts,[48,369,687][layer],210,285,285,0,0,SIZE,SIZE);ctx.globalAlpha=1;
  const mask=canvas(),mc=mask.getContext('2d'),data=mc.createImageData(SIZE,SIZE),bits=new Uint8Array(SIZE*SIZE);
  for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
   const i=y*SIZE+x,edge=8*Math.sin(y*.037)+3*Math.sin(y*.11),extra=layer===0?x<233+edge:layer===1?x>279+edge:y<226+5*Math.sin(x*.04)||y>286+5*Math.sin(x*.035);
   bits[i]=Number(targetBits[i]||extra);data.data[i*4+3]=bits[i]*255;
  }
  mc.putImageData(data,0,0);ctx.globalCompositeOperation='destination-out';ctx.drawImage(mask,0,0);ctx.globalCompositeOperation='source-over';holes.push(bits);sheets.push(sheet);
 }
 return {
  guide:target.toDataURL(),
  paint(element,values){const ctx=element.getContext('2d');ctx.clearRect(0,0,SIZE,SIZE);sheets.forEach((sheet,n)=>ctx.drawImage(sheet,0,(values[n]-GAP_GOAL[n])*GAP_STEP));},
  match(values){
   let missing=0,extra=0,area=0;
   for(let y=90;y<422;y++)for(let x=90;x<422;x++){
    if((x-256)**2+(y-256)**2>166**2)continue;
    const i=y*SIZE+x,clear=holes.every((bits,n)=>{const sy=y-(values[n]-GAP_GOAL[n])*GAP_STEP;return sy>=0&&sy<SIZE&&bits[sy*SIZE+x];});
    if(targetBits[i]){area++;if(!clear)missing++;}else if(clear)extra++;
   }
   return {matches:missing===0&&extra===0,missing,extra,area};
  },
 };
}

let painter,pending;
export function gapPaperReady(){
 if(painter)return Promise.resolve(painter);
 return pending??=(createGapPaper().then(value=>(painter=value)).catch(error=>{pending=null;throw error;}));
}
export function paintGapPose(world,values){
 world.dataset.gapPose=values.join(',');
 const surface=world.querySelector('[data-gap-paper]');
 if(painter&&surface){painter.paint(surface,values);surface.dataset.ready='true';world.dataset.gapReady='true';}
 world.querySelectorAll('[data-gap-tab]').forEach((el,i)=>{el.style.top=770+values[i]*GAP_STEP+'px';el.setAttribute('aria-valuenow',Math.round(values[i]));el.setAttribute('aria-valuetext',`第${Math.round(values[i])+1}道折痕`);});
 world.querySelectorAll('.gap-strip').forEach((el,i)=>el.style.height=42+values[i]*GAP_STEP+'px');
}
export function hydrateGapPaper(root){
 const surfaces=[...root.querySelectorAll('[data-gap-paper]')];if(!surfaces.length)return;
 gapPaperReady().then(p=>{
  for(const surface of surfaces){
   if(!surface.isConnected)continue;
   const world=surface.closest('[data-gap-model]'),values=world.dataset.gapPose.split(',').map(Number);
   paintGapPose(world,values);const mark=world.querySelector('.gap-cat-mark');if(mark)mark.src=p.guide;
   const loading=world.querySelector('.gap-loading');if(loading)loading.hidden=true;
  }
 }).catch(()=>{for(const surface of surfaces){const loading=surface.closest('[data-gap-model]')?.querySelector('.gap-loading');if(loading?.isConnected){loading.hidden=false;loading.textContent='纸片还没展开，再看一眼？';loading.classList.add('gap-load-failed');}}});
}
