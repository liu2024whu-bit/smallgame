import {updateAutomaticSave} from '../ui/auto-save.js';

export function createFolderActions({storage,store,toast}){
 const failed=()=>toast('这次没能接上，原来的进度还在。');
 return {
  'folder-retry':async()=>{if(!await storage?.retry?.())failed();},
  'folder-adopt':async()=>{try{const state=await storage.reload();store.replace(state);toast('已接上更新后的进度。');}catch{failed();}},
  'folder-keep':async()=>{try{if(await storage.keepCurrent())toast('这份进度保存好了。');else failed();}catch{failed();}},
  'folder-recover':()=>{const saved=storage?.recovered?.();if(!saved)return;store.replace(saved);storage.clearRecovery();toast('找回刚才的进度了。');},
 };
}
export function bindAutomaticSave(root,storage,store){
 return storage?.summary?storage.subscribe(()=>updateAutomaticSave(root,store.writable(),storage.summary())):()=>{};
}
