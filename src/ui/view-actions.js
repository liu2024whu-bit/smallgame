import { motionAllowed,settleWorkbenchZoom } from '../services/motion.js';
import {centerWorkbenchViewport} from './dialog-state.js';
export const afterPuzzleAction=(view={},action,id)=>['undo','reset'].includes(action)?{...view,pressProof:false,...(id==='film'&&action==='reset'?{filmPlayback:null,filmView:'whole'}:{}),...(id==='stitch'&&action==='reset'?{stitchCamera:'whole',stitchSample:false,stitchKey:null}:{})}:view;
// Transient presentation choices stay out of the save and puzzle rule modules.
export function viewActions({ panel, render, activity,foley=()=>{} }) {
  const change = patch => { const current = panel(); current.view = { ...current.view, ...patch }; render(); };
  return {
    'piano-score-back':()=>{change({pianoBack:!panel().view?.pianoBack});foley('turn');},
    'cloud-face':button=>{const back=button.dataset.back==='true';if(back!==!!panel().view?.back){change({back});foley('turn');}},
    'press-proof':button=>change({pressProof:button.dataset.open==='true'}),
    'back-view':button=>{if(['whole','tray','mirror','samples'].includes(button.dataset.id)){change({backView:button.dataset.id});foley('turn');}},
    'gap-view':button=>{if(['front','back','papers','window'].includes(button.dataset.id)){change({gapView:button.dataset.id});foley('turn');}},
    'settings-page':button=>{if(['sound','picture','save'].includes(button.dataset.id))change({section:button.dataset.id});},
    'ending-page':button=>{
      const current=panel(),lastPage=!current.view?.lastPage;current.view={...current.view,lastPage};
      button.classList.toggle('page-turned',lastPage);button.setAttribute('aria-expanded',lastPage);
      button.querySelector('.ending-page-front').setAttribute('aria-hidden',lastPage);
      button.querySelector('.ending-page-back').setAttribute('aria-hidden',!lastPage);
    },
    'workbench-look':()=>{
      const before=document.querySelector('.puzzle-field')?.getBoundingClientRect();
      const closeLook=!panel().view?.closeLook;change({closeLook});
      const viewport=document.querySelector('.puzzle-viewport');
      const measured=!!viewport?.querySelector('[data-look-point]');
      if(closeLook&&viewport){
        if(!centerWorkbenchViewport(viewport)){
          const focus=panel().id==='cloud'&&!panel().view?.back ? .34:.5;
          viewport.scrollLeft=viewport.scrollWidth*focus-viewport.clientWidth/2;
        }
      }
      if(measured)settleWorkbenchZoom(viewport.querySelector('.puzzle-field'),before);
    },
    'postal-view':button=>{if(['cabinet','detail','papers'].includes(button.dataset.id)){change({postal:button.dataset.id});foley('turn');}},
    'library-view':button=>{if(['shelf','book','slip'].includes(button.dataset.id)){change({library:button.dataset.id,...(button.dataset.book!==undefined?{book:Number(button.dataset.book)}:{}),slipBack:false});foley('turn');}},
    'library-slip-flip':()=>{change({slipBack:!panel().view?.slipBack});foley('turn');},
    'library-ask':()=>change({askedSlip:true}),
    'screen-view':button=>{if(['whole','paper','lock','pocket'].includes(button.dataset.id)){const group=Number(button.dataset.index??panel().view?.screenGroup??0);change({screenView:button.dataset.id,screenGroup:[0,1,2].includes(group)?group:0});foley('turn');}},
    'belt-view':button=>{if(['whole','left','right'].includes(button.dataset.id)){change({beltView:button.dataset.id});foley('turn');}},
    'garden-view':button=>{if(['whole','left','middle','right'].includes(button.dataset.id)){change({gardenView:button.dataset.id});foley('turn');}},
    'memory-detail': button => { const focus = Number(button.dataset.index); change({ focus }); activity(`art:detail:${focus}`); },
    'memory-page':button=>{change({pageOpen:button.dataset.open==='true'});foley('turn');},
    'memory-cinema': () => { change({ playing: !panel().view?.playing }); activity('cinema:play'); },
    'memory-figure': button => change({ figure: Number(button.dataset.index) }),
    'memory-open': () => change({ open: !panel().view?.open }),
    'memory-postcard':()=>{activity('memory:cities');change({back:!panel().view?.back});foley('turn');},
    'memory-card':button=>{activity('memory:cities');change({card:Number(button.dataset.index),back:false});foley('turn');},
    'memory-mirror':()=>{change({reflected:!panel().view?.reflected});foley('return');},
    'evidence-flip': () => change({ flipped: !panel().view?.flipped }),
    'campus-look': button => { change({ looked: !panel().view?.looked }); if(button.dataset.activity)activity(button.dataset.activity); },
    'campus-stop': button => change({ corner:Number(button.dataset.index),looked:false }),
    'record-detail': button => {change({record:button.dataset.id});foley('turn');},
    'record-page': button => {change({recordSide:button.dataset.id,record:null});foley('turn');},
    'record-extra':()=>{change({recordExtra:!panel().view?.recordExtra,record:null});foley('turn');},
    'encore-wind': () => {change({wind:Math.min(720,(panel().view?.wind??0)+120)});foley('turn');},
    'encore-letter': () => {
      if((panel().view?.wind??0)<360)return;
      change({letter:!panel().view?.letter,unsealed:true});foley('turn');
    },
    'campus-stamp': button => {activity(`campus:${button.dataset.id}`);foley('stamp');},
    'mechanism-back': () => change({ back:!panel().view?.back }),
    'gift-card-unfold':()=>{change({cardUnfolded:!panel().view?.cardUnfolded});foley('turn');},
    'gift-strip-flip':()=>{change({stripBack:!panel().view?.stripBack});foley('turn');},
    'paper-turn':()=>change({turned:!panel().view?.turned}),
    'reading-book': button => activity(`reading:${Number(button.dataset.index)}`),
  };
}
