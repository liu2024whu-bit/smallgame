import {createFolderStorage} from './folder-storage.js';
import {browserSaveTransport} from './browser-save-library.js';
import {serializable,createState} from '../core/state.js';
import {parseSave} from '../core/storage.js';
import {saveWindowIdentity} from './save-window.js';

const PIN='smallgame:open-bookmark',RESUME='smallgame:resume-bookmark';
const scopedMirror=(storage,id,windowID)=>{const prefix=`smallgame:window:${windowID}:slot:${id}:`;return {getItem:key=>storage.getItem(prefix+key),setItem:(key,value)=>storage.setItem(prefix+key,value),removeItem:key=>storage.removeItem(prefix+key)};};

export async function createSaveShelf({endpoint=null,mirror,session,fetcher=globalThis.fetch,makeID}={}){
 const desktop=!!endpoint,url=endpoint??'https://local.invalid/__desktop/saves';
 const windowIdentity=await saveWindowIdentity({session,...(makeID?{makeID}:{})});
 if(!desktop)fetcher=browserSaveTransport(mirror,{...(makeID?{makeID}:{})});
 let snapshot,active,storage;
 const remember=(key,value)=>{try{session?.setItem(key,value);}catch{}};
 const remembered=key=>{try{return session?.getItem(key);}catch{return null;}};
 async function request(body){
  const response=await fetcher(url,{...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{cache:'no-store'}),signal:AbortSignal.timeout(5000)});
  if(!response.ok){const error=Error('Bookmark request failed');error.status=response.status;throw error;}
  const next=await response.json();if(!Array.isArray(next.slots))throw Error('Invalid bookmarks');snapshot=next;return next;
 }
 await request();
 // A 3.2 browser may still hold a write that never reached its old single
 // file. Keep that as a named safety copy before retiring the shared cache.
 const legacy=snapshot.slots.find(e=>e.legacy),canonical=value=>JSON.stringify(serializable(parseSave(value)));
 let legacyRecovery;
 try{
  const pending=JSON.parse(mirror?.getItem('smallgame:folder-pending'))?.pending;
  if(legacy&&pending){
   const data=canonical(pending),marker='smallgame:migrated-pending:'+legacy.id;
   if(mirror.getItem(marker)!==data){
    const original=snapshot.active,response=await fetcher(url+'/'+legacy.id+'/progress',{cache:'no-store',signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error('Legacy snapshot unavailable');const saved=await response.json();
    if(!saved.value||canonical(saved.value)!==data){await request({action:'create',name:'上次未写入的进度',data,fork:{slot:legacy.id,client:'legacy-pending'}});if(snapshot.slots.some(e=>e.id===original&&e.readable))await request({action:'select',id:original});}
    mirror.setItem(marker,data);
   }
  }
 }catch{try{legacyRecovery=JSON.parse(mirror?.getItem('smallgame:folder-pending'))?.pending;if(legacyRecovery)canonical(legacyRecovery);}catch{legacyRecovery=null;}}
 const living=()=>snapshot.slots.filter(e=>!e.deletedAt);
 active=living().find(e=>e.id===remembered(PIN)&&e.readable)?.id??living().find(e=>e.id===snapshot.active&&e.readable)?.id??living().find(e=>e.readable)?.id;
 let recoveredNotice='';
 if(!active){await request({action:'create',name:'新的开始',data:JSON.stringify(serializable(createState()))});active=snapshot.active;recoveredNotice='原来的进度暂时读不出来，文件仍然保留着。可以先从这份新的开始。';}
 remember(PIN,active);
 const cache=scopedMirror(mirror,active,windowIdentity.id);
 if(legacy&&legacyRecovery)try{cache.setItem('smallgame:folder-recovery',legacyRecovery);}catch{}
 storage=await createFolderStorage({endpoint:url+'/'+active+'/progress',mirror:cache,fetcher,preserveConflicts:desktop,...(makeID?{makeID}:{})});
 if(recoveredNotice)storage.notice=recoveredNotice;
 const folderSummary=storage.summary;
 storage.summary=()=>({...folderSummary(),mode:desktop?'folder':'browser',slot:active,name:snapshot.slots.find(e=>e.id===active)?.name});
 async function flush(){await storage.flush();if(storage.summary().phase!=='saved')throw Error('Current bookmark is not safely saved');}
 async function choose(id){await request({action:'select',id});remember(PIN,id);remember(RESUME,id);return id;}
 return {
  storage,
  dispose:()=>windowIdentity.release(),
  summary:()=>({...snapshot,active,mode:desktop?'folder':'browser'}),
  async refresh(){await request();return this.summary();},
  async select(id){await flush();return choose(id);},
  async create(name,state,{separate=false}={}){if(!separate)await flush();await request({action:'create',name,data:JSON.stringify(serializable(state)),...(separate?{fork:{slot:active,client:storage.summary().client}}:{})});return choose(snapshot.active);},
  async rename(id,name){await request({action:'rename',id,name});},
  async remove(id){if(id===active)throw Error('This bookmark is open');await request({action:'delete',id,keep:active});},
  async restore(id){await request({action:'restore',id});},
  async flush(){return flush();},
  consumeResume(){if(remembered(RESUME)!==active)return false;try{session?.removeItem(RESUME);}catch{}return true;},
 };
}
