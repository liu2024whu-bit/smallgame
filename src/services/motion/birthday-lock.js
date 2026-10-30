import {ease} from './shared.js';
import {hydrateRibbonMaterial} from '../ribbon-material.js';

const position=el=>el?{left:el.style.left,top:el.style.top}:null;
function cloneLayer(model,className,html){const el=document.createElement('div');el.className=className;el.innerHTML=html;el.inert=true;model.append(el);hydrateRibbonMaterial(el);return el;}
function inspectPose(root){const el=root.querySelector('.birthday-tool-inspect');if(!el)return null;return {kind:'tool',card:!!el.querySelector('.gift-paper'),unfolded:el.dataset.toolUnfolded,back:el.querySelector('.gift-paper')?.dataset.giftBack,turned:el.querySelector('[data-ribbon-paper]')?.dataset.turned,verso:el.querySelector('[data-ribbon-paper]')?.dataset.verso};}
function inspectMotion(root,old){
 const next=inspectPose(root);if(!next||next.card!==old.card)return;
 const el=root.querySelector('.birthday-tool-inspect'),animate=(target,frames,extra={})=>target?.animate(frames,{duration:320,easing:ease,...extra}).finished.catch(()=>{});
 if(next.card){
  const face=el.querySelector('.gift-paper-face');
  if(old.unfolded!==next.unfolded){
   if(next.unfolded==='true'){for(const panel of el.querySelectorAll('.gift-paper-panel')){const i=Number(panel.style.getPropertyValue('--panel'));if(i)animate(panel,[{transform:'perspective(700px) rotateY(-175deg)'},{transform:'none'}],{duration:430,delay:(i-1)*110,fill:'backwards'});}animate(face.querySelector('.gift-ink'),[{opacity:0},{opacity:1}],{delay:200,fill:'backwards'});}
   else animate(face,[{transform:'perspective(700px) rotateY(-85deg)',opacity:.5},{transform:face.style.transform,opacity:1}],{duration:380});
  }else if(old.back!==next.back)animate(face,[{transform:'scaleX(0)',opacity:.6},{transform:face.style.transform,opacity:1}]);
 }else if(old.turned!==next.turned||old.verso!==next.verso)animate(el,[{rotate:old.turned!==next.turned?'180deg':'0deg',transform:old.verso!==next.verso?'scaleX(0)':'none'},{rotate:'0deg',transform:'none'}]);
}
export const birthdayLockMotion={
 capture(root){
  const tool=inspectPose(root);if(tool)return tool;
  const model=root.querySelector('[data-decoder-model]'),world=model?.closest('.decoder-world');if(!world)return null;
  return {p:JSON.parse(model.dataset.decoderPose),back:model.dataset.decoderBack,camera:world.dataset.sourceCamera,box:world.getBoundingClientRect(),cover:model.querySelector('[data-decoder-cover]').outerHTML,hardware:model.querySelector('.decoder-lock-hardware')?.outerHTML??'',card:model.querySelector('.decoder-fittings [data-decoder-card]')?.outerHTML,papers:[...model.querySelectorAll(':scope > .decoder-fittings .decoder-card,:scope > .decoder-fittings .decoder-strip,:scope > .decoder-fittings .decoder-mirror')].filter(el=>!el.closest('.decoder-reflection')).map(el=>el.outerHTML).join(''),paper:position(model.querySelector('.decoder-fittings [data-decoder-strip]')),mirror:position(model.querySelector('[data-decoder-mirror]')),drums:[...model.querySelectorAll('[data-decoder-number]')].map(el=>el.style.getPropertyValue('--digit'))};
 },
 play(root,old){
  if(old?.kind==='tool'){inspectMotion(root,old);return;}
  const model=root.querySelector('[data-decoder-model]'),world=model?.closest('.decoder-world');if(!old||!world)return;
  const p=JSON.parse(model.dataset.decoderPose),animations=[],ghosts=[];
  const animate=(el,frames,options={})=>{if(el)animations.push(el.animate(frames,{duration:340,easing:ease,...options}));};
  const morph=(selector,from,to)=>{if(!from||!to||JSON.stringify(from)===JSON.stringify(to))return;for(const el of model.querySelectorAll(selector))animate(el,[from,to],{duration:220});};
  if(old.back!==model.dataset.decoderBack){
   const ghost=cloneLayer(model,'decoder-old-lid',old.cover+old.hardware);ghosts.push(ghost);
   animate(ghost,[{transform:'perspective(1400px) rotateY(0)'},{transform:'perspective(1400px) rotateY(-90deg)'}],{duration:190,fill:'forwards'});
   animate(model.querySelector('[data-decoder-cover]'),[{transform:'perspective(1400px) rotateY(90deg)'},{transform:'perspective(1400px) rotateY(0)'}],{duration:220,delay:190,fill:'backwards'});
  }else if(old.p.lid!==p.lid){
   const opening=p.lid,delay=opening&&old.p.fitted.some(Boolean)?220:0;
   if(opening){
    if(old.papers){const paper=cloneLayer(model,'decoder-old-paper',old.papers);ghosts.push(paper);animate(paper,[{translate:'0 0',scale:1,opacity:1},{translate:'0 270px',scale:.45,opacity:0}],{duration:230,fill:'forwards'});}
    const lid=cloneLayer(model,'decoder-old-lid',old.cover+old.hardware);ghosts.push(lid);
    animate(lid,[{transform:'perspective(1600px) rotateX(0)',opacity:1},{transform:'perspective(1600px) rotateX(96deg)',opacity:0}],{duration:480,delay,fill:'forwards'});
    animate(model.querySelector('[data-decoder-lid-inside]'),[{transform:'perspective(1600px) rotateX(-88deg)',opacity:0},{transform:'perspective(1600px) rotateX(0deg)',opacity:1}],{duration:480,delay,fill:'backwards'});
    animate(model.querySelector('[data-decoder-garden]'),[{transform:'perspective(1000px) rotateX(85deg)',opacity:.15},{transform:'perspective(1000px) rotateX(-3deg)',opacity:1,offset:.85},{transform:'none',opacity:1}],{duration:720,delay:delay+180,fill:'backwards'});
   }else{
    const lid=cloneLayer(model,'decoder-old-lid','');ghosts.push(lid);
    for(const [selector,animation]of [['[data-decoder-garden]','perspective(1000px) rotateX(85deg)'],['[data-decoder-lid-inside]','perspective(1600px) rotateX(-88deg)']]){
     const node=model.querySelector(selector).cloneNode(true);node.style.visibility='visible';lid.append(node);animate(node,[{transform:'none',opacity:1},{transform:animation,opacity:0}],{duration:380,fill:'forwards'});
    }
    animate(model.querySelector('[data-decoder-cover]'),[{transform:'perspective(1600px) rotateX(96deg)',opacity:0},{transform:'perspective(1600px) rotateX(0)',opacity:1}],{duration:460,delay:200,fill:'backwards'});
   }
  }else{
   if(!old.p.opened&&p.opened)animate(model.querySelector('[data-decoder-arm]'),[{transform:'rotateY(0)'},{transform:'rotateY(-112deg)'}],{duration:440});
   const card=model.querySelector('.decoder-fittings [data-decoder-card] .gift-paper-face');
   if(old.p.unfolded!==p.unfolded){
    if(p.unfolded){for(const el of model.querySelectorAll('.decoder-fittings .gift-paper-panel')){const i=Number(el.style.getPropertyValue('--panel'));if(i)animate(el,[{transform:'perspective(400px) rotateY(-175deg)'},{transform:'none'}],{duration:420,delay:(i-1)*120,fill:'backwards'});}animate(card?.querySelector('.gift-ink'),[{opacity:0},{opacity:1}],{duration:240,delay:240,fill:'backwards'});}
    else if(old.card){const ghost=cloneLayer(model,'decoder-old-paper',old.card);ghosts.push(ghost);for(const el of ghost.querySelectorAll('.gift-paper-panel')){const i=Number(el.style.getPropertyValue('--panel'));if(i)animate(el,[{transform:'none',opacity:1},{transform:'perspective(400px) rotateY(-175deg)',opacity:0}],{duration:380,delay:(2-i)*90,fill:'forwards'});}animate(ghost,[{opacity:1},{opacity:0}],{duration:150,delay:350,fill:'forwards'});animate(card,[{opacity:0},{opacity:1}],{duration:200,delay:290,fill:'backwards'});}
   }
   else if(old.p.back!==p.back)animate(card,[{transform:'scaleX(0)',opacity:.6},{transform:card?.style.transform??'none',opacity:1}],{duration:280});
   if(old.p.turned!==p.turned||old.p.stripBack!==p.stripBack)for(const el of model.querySelectorAll('[data-decoder-strip]'))animate(el,[{rotate:old.p.turned!==p.turned?'180deg':'0deg',transform:old.p.stripBack!==p.stripBack?'scaleX(0)':'none'},{rotate:'0deg',transform:'none'}]);
   morph('[data-decoder-strip]',old.paper,position(model.querySelector('[data-decoder-strip]')));
   morph('[data-decoder-mirror]',old.mirror,position(model.querySelector('[data-decoder-mirror]')));
   for(let i=0;i<3;i++)if(!old.p.fitted[i]&&p.fitted[i])animate(model.querySelector(['.decoder-fittings [data-decoder-card]','.decoder-fittings [data-decoder-strip]','[data-decoder-mirror]'][i]),[{translate:'0 18px',opacity:.2},{translate:'0 0',opacity:1}],{duration:280});
   for(const el of model.querySelectorAll('[data-decoder-number]')){const index=Number(el.parentElement.dataset.decoderWheel),n=p.values[index],from=Number(old.drums[index]);if(Number.isFinite(from)&&Math.abs(from-n)>.001){const start=n+((from-n+15)%10)-5;animate(el,[{transform:`translateY(${-((10+start)*30+15)}px)`},{transform:`translateY(${-((10+n)*30+15)}px)`}],{duration:180});}}
  }
  const after=world.getBoundingClientRect();if(old.camera!==world.dataset.sourceCamera||Math.abs(old.box.width-after.width)>1){const box=world.parentElement.getBoundingClientRect();animate(world,[{transform:`translate(${old.box.left-box.left}px,${old.box.top-box.top}px) scale(${old.box.width/760})`},{transform:world.style.transform}],{duration:380});}
  const blocking=old.back!==model.dataset.decoderBack||old.p.lid!==p.lid||old.p.opened!==p.opened||old.camera!==world.dataset.sourceCamera;
  const paperMoving=old.p.unfolded!==p.unfolded||old.p.back!==p.back||old.p.turned!==p.turned||old.p.stripBack!==p.stripBack||old.p.fitted.join()!==p.fitted.join();
  if(!animations.length)return;
  if(blocking)model.dataset.decoderBusy='true';else if(paperMoving)model.dataset.decoderPaperBusy='true';
  const selector=blocking?'.decoder-workbench button':paperMoving?'.decoder-fittings button,.decoder-paper-options button':null;
  const controls=selector?[...root.querySelectorAll(selector)].map(el=>[el,el.disabled]):[];controls.forEach(([el])=>el.disabled=true);
  Promise.allSettled(animations.map(a=>a.finished)).then(()=>{ghosts.forEach(el=>el.remove());if(!model.isConnected)return;delete model.dataset.decoderBusy;delete model.dataset.decoderPaperBusy;controls.forEach(([el,disabled])=>el.disabled=disabled);});
 },
};
