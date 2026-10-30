import {inventory,access} from '../core/state.js';
import {sceneOpen} from '../core/exploration.js';
import {toolFor,puzzleToolUse,toolElsewhere,TOOL_RETURN_NAMES,PUZZLE_TOOL_INPUTS} from '../data/tool-uses.js';
import {PUZZLE_BY_ID} from '../data/puzzles.js';
import {ITEMS} from '../data/items.js';
import {fitHandle} from './tool-motion.js';
import {itemSprite} from '../ui/dom.js';

export function createToolLocator({getState,panel,goScene,openPuzzle,toast}){
 return button=>{
  const current=panel()?.type==='puzzle'?panel().id:null,item=button.dataset.tool,source=button.dataset.id;
  if(!current||toolElsewhere(getState(),current,(PUZZLE_TOOL_INPUTS[current]??[]).indexOf(item))!==source)return;
  goScene(PUZZLE_BY_ID[source].scene);openPuzzle(source);toast(`${ITEMS[item].name}还在${TOOL_RETURN_NAMES[source]}上。`);
 };
}

// Coordinates a physical use with its existing panel. Rules and inventory
// still belong to the store; arrival rectangles are transient presentation.
export function createToolUseFlow({store,panel,toast,audio,openPuzzle,openCollection,closeAllPanels,goScene,renderDialog,performMove,lightCandle}){
 let fittingHandle=false;
 return async function useTool(item,target,arrival=null){
  const state=store.get();
  if(!inventory(state).includes(item)||toolFor(target)!==item){toast('这里暂时用不上。');return false;}
  if(/^birthday-wick:[0-1]$/.test(target)){
   if(state.selected)store.dispatch({type:'select',id:null});
   return lightCandle?.(Number(target.split(':')[1]))??false;
  }
  if(target==='birthday-door'){
   if(fittingHandle)return false;
   if(!state.solved.includes('stitch')){toast('画册还没有装好。');return false;}
   fittingHandle=true;
   try{await fitHandle(document.querySelector('.handle-socket')??document.querySelector('[data-tool-target="birthday-door"]'),itemSprite(3));}finally{fittingHandle=false;}
   store.dispatch({type:'use-tool',item,target});
   if(sceneOpen(store.get(),'birthday')){goScene('birthday');audio.material('metal');return true;}
   toast('画册还没有装好。');return false;
  }
  if(target==='postcard-mirror'){
   store.dispatch({type:'select',id:null});
   const current=panel();
   if(current?.type==='puzzle'&&current.id==='postbox')current.view={...current.view,postal:'papers',reflected:true};
   else if(current?.type==='collection'&&current.id==='cities')current.view={...current.view,reflected:true};
   else{openCollection('cities');panel().view={card:1,back:true,reflected:true};}
   renderDialog(false);audio.material('glass');return true;
  }
  const effect=puzzleToolUse(target);if(!effect)return false;
  const {id,move}=effect;
  const elsewhere=move.type==='fit'&&toolElsewhere(state,id,move.index);
  if(elsewhere){toast(`它还在${TOOL_RETURN_NAMES[elsewhere]}上。`);return false;}
  if(id==='birthdayLock'&&state.progress.ribbons.back){openPuzzle(id);toast('搭扣在另一面。');return false;}
  if(!access(state,id).ready){openPuzzle(id);return false;}
  if(panel()?.type!=='puzzle'||panel().id!==id){closeAllPanels();openPuzzle(id);}
  if(id==='film'&&move.type==='fit')panel().view={...panel().view,filmOpen:true,filmView:'whole'};
  if(state.selected)store.dispatch({type:'select',id:null});
  return performMove(move,arrival);
 };
}
