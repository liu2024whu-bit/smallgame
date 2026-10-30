import {createState} from '../core/state.js';
import {saveName} from '../core/save-slots.js';

export function createSaveShelfFlow({saves,store,panel,openPanel,renderDialog,closeAllPanels,enter,toast,reload=()=>location.reload(),root}){
 if(!saves)return {actions:{},imported:null};
 let busy=false;
 const showError=message=>{if(panel()?.type==='saves'){panel().view={...panel().view,saveBusy:false,saveError:message};renderDialog();}else toast(message);};
 async function guarded(task){
  if(busy)return;busy=true;
  if(panel()?.type==='saves'){panel().view.saveBusy=true;renderDialog();}
  try{await task();}
  catch(error){showError(error.status===409?'这份进度在另一扇窗口里有变化，刷新后再看看吧。':error.status===400?'这个名字可能已经用过了，换一个试试？':'这次没能保存或切换，眼下的进度仍然留着。');}
  finally{busy=false;if(panel()?.type==='saves'){panel().view.saveBusy=false;renderDialog();}}
 }
 const list=()=>{panel().view={};renderDialog();};
 const actions={
  saves:()=>guarded(async()=>{await saves.flush();await saves.refresh();openPanel({type:'saves',view:{}});}),
  'save-new':()=>guarded(async()=>{await saves.flush();await saves.refresh();openPanel({type:'saves',view:{saveEdit:'new'}});root.querySelector('#bookmark-name')?.focus({preventScroll:true});}),
  'folder-keep':()=>guarded(async()=>{const name=saves.summary().slots.find(e=>e.id===saves.summary().active)?.name??'我的进度';await saves.create(Array.from(name).slice(0,24).join('')+' · 另一份',store.get(),{separate:true});reload();}),
  'folder-recover':()=>guarded(async()=>{const recovered=saves.storage.recovered();if(!recovered)return;await saves.create('找回的进度',recovered,{separate:true});reload();}),
  'save-list':()=>{if(!busy)list();},
  'save-edit':button=>{if(busy)return;panel().view={saveEdit:button.dataset.edit,saveId:button.dataset.id};renderDialog(false);root.querySelector('#bookmark-name')?.focus({preventScroll:true});},
  'save-select':button=>guarded(async()=>{const current=button.dataset.id===saves.summary().active;await saves.select(button.dataset.id);if(current){saves.consumeResume();closeAllPanels();await enter();}else reload();}),
  'save-restore':button=>guarded(async()=>{await saves.restore(button.dataset.id);list();toast('这份进度找回来了。');}),
  'save-confirm':()=>{
   const view=panel()?.view;if(!view)return;
   const value=root.querySelector('#bookmark-name')?.value;
   if(value!==undefined)view.saveName=value;
   return guarded(async()=>{
    if(view.saveEdit==='rename'){await saves.rename(view.saveId,saveName(value));list();}
    else if(view.saveEdit==='delete'){await saves.remove(view.saveId);list();}
    else{
     const state=view.saveEdit==='copy'?store.get():{...createState(),settings:{...store.get().settings}};
     await saves.create(saveName(value,view.saveEdit==='copy'?'另一次冒险':'新的开始'),state);reload();
    }
   });
  },
 };
 root.addEventListener('submit',event=>{if(event.target.matches('[data-save-editor]')){event.preventDefault();void actions['save-confirm']();}});
 return {actions,imported:async state=>{await saves.create('导入的进度',state);reload();}};
}
