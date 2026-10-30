import {SAVE_KEY,BACKUP_KEY,MAX_SAVE_BYTES,parseSave,loadSave} from '../core/storage.js';

const META_KEY='smallgame:folder-pending',RECOVERY_KEY='smallgame:folder-recovery';
const readable=text=>{try{parseSave(text);return true;}catch{return false;}};
const sameProgress=(a,b)=>readable(a)&&readable(b)&&JSON.stringify(parseSave(a))===JSON.stringify(parseSave(b));
const responseJSON=async response=>{if(!response.ok){const e=Error('Local storage request failed');e.status=response.status;throw e;}return response.json();};
const validTime=value=>Number.isFinite(value)&&value>0&&value<8.64e15?value:null;

// A synchronous store facade over one sequential local-file queue. It never
// changes puzzle state from an asynchronous callback or rerenders a gesture.
export async function createFolderStorage({endpoint,mirror,fetcher=globalThis.fetch,makeID=()=>crypto.randomUUID(),delay=setTimeout,cancelDelay=clearTimeout,preserveConflicts=false}){
 const memory=new Map(),listeners=new Set(),client=makeID();
 const mirrorGet=key=>{try{return mirror?.getItem(key)??null;}catch{return null;}};
 const mirrorSet=(key,value)=>{try{if(value===null)mirror?.removeItem?.(key);else mirror?.setItem(key,value);}catch{}};
 for(const key of [SAVE_KEY,BACKUP_KEY]){const value=mirrorGet(key);if(value!==null)memory.set(key,value);}
 let metadata;try{metadata=JSON.parse(mirrorGet(META_KEY));}catch{}
 let recovery=mirrorGet(RECOVERY_KEY);if(!readable(recovery))recovery=null;
 let version=null,pending=null,inFlight=null,running=null,scheduled=false,sequence=0,acknowledged=0,attempt=0,retryTimer=null,phase='ready',notice='',savedAt=validTime(metadata?.savedAt);
 const currentPending=()=>pending??inFlight;
 const persist=()=>mirrorSet(META_KEY,JSON.stringify({version,savedAt,pending:currentPending()?.data??null,fresh:currentPending()?.fresh??false}));
 const notify=()=>{for(const listener of listeners)listener();};
 function archive(value){if(readable(value)){recovery=value;mirrorSet(RECOVERY_KEY,value);}}
 function adopt(snapshot){
  if(typeof snapshot.version!=='string')throw Error('Invalid local storage reply');
  version=snapshot.version;
  savedAt=validTime(snapshot.savedAt);
  for(const [key,value]of [[SAVE_KEY,snapshot.value],[BACKUP_KEY,snapshot.backup]]){if(typeof value==='string')memory.set(key,value);else memory.delete(key);mirrorSet(key,typeof value==='string'?value:null);}
 }
 const readFolder=()=>fetcher(endpoint,{cache:'no-store',signal:AbortSignal.timeout(4000)}).then(responseJSON);
 try{
  const snapshot=await readFolder(),cached=memory.get(SAVE_KEY),cachedBackup=memory.get(BACKUP_KEY);
  adopt(snapshot);
  if(metadata?.pending&&readable(metadata.pending)&&metadata.version===version){
   memory.set(SAVE_KEY,metadata.pending);if(cachedBackup)memory.set(BACKUP_KEY,cachedBackup);pending={data:metadata.pending,fresh:metadata.fresh===true};
  }else{
   if(metadata?.pending&&readable(metadata.pending))archive(metadata.pending);
   // A first desktop launch can carry this browser's previous local game in.
   if(snapshot.value===null&&snapshot.backup===null&&readable(cached)){memory.set(SAVE_KEY,cached);if(cachedBackup)memory.set(BACKUP_KEY,cachedBackup);pending={data:cached,fresh:false};}
  }
  if(!pending&&snapshot.recovered&&readable(snapshot.backup)){memory.set(SAVE_KEY,snapshot.backup);pending={data:snapshot.backup,fresh:false};}
  if(snapshot.recovered)notice='已从备份接回这份进度。';
  else if(snapshot.unreadable)notice='有一份进度暂时打不开，原文件仍在。';
  if(readable(snapshot.value)||readable(snapshot.backup))phase='saved';
 }catch{
  phase='error';notice='暂时没能写入存档，请先别关闭游戏。';
  // Retain the last acknowledged file version across an offline boot. A real
  // change on disk still conflicts; an unchanged file can reconnect itself.
  if(typeof metadata?.version==='string')version=metadata.version;
  if(metadata?.pending&&readable(metadata.pending))pending={data:metadata.pending,fresh:metadata.fresh===true};
  if(!pending&&readable(memory.get(SAVE_KEY)))pending={data:memory.get(SAVE_KEY),fresh:false};
 }

 function scheduleRetry(){if(retryTimer||attempt>=3||phase==='conflict')return;retryTimer=delay(()=>{retryTimer=null;void drain();},[500,1500,4000][attempt++]);}
 async function ensureVersion(){
  if(version!==null)return;
  const snapshot=await readFolder();
  const existing=readable(snapshot.value)?snapshot.value:readable(snapshot.backup)?snapshot.backup:null;
  if(existing&&!sameProgress(existing,memory.get(SAVE_KEY))){const e=Error('A file is already present');e.status=409;throw e;}
  version=snapshot.version;
 }
 function post(batch,unload=false){
  const sent=++sequence;batch.sequence=sent;
  const payload={data:batch.data,version,client,sequence:sent,fresh:batch.fresh},body=JSON.stringify(payload);
  return fetcher(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:unload||body.length<60000,...(unload?{}:{signal:AbortSignal.timeout(5000)})}).then(responseJSON).then(result=>({...result,sequence:sent})).catch(error=>{error.sequence=sent;throw error;});
 }
 function receipt(result,batch){
  if(typeof result.version!=='string')throw Error('Invalid write receipt');
  if(result.sequence>acknowledged){acknowledged=result.sequence;version=result.version;savedAt=validTime(result.savedAt);}
  if(inFlight?.sequence<=acknowledged)inFlight=null;
  if(pending===batch)pending=null;
  attempt=0;phase=currentPending()?'saving':'saved';persist();notify();
 }
 function drain(){
  if(running)return running;if(!pending||phase==='conflict')return Promise.resolve(false);
  running=(async()=>{
   try{
    await ensureVersion();
    while(pending){
     inFlight=pending;pending=null;phase='saving';persist();notify();
     const batch=inFlight;
     try{receipt(await post(batch),batch);}catch(error){if(error.sequence<=acknowledged)continue;throw error;}
    }
    return true;
   }catch(error){pending??=inFlight;inFlight=null;phase=error.status===409?'conflict':'error';persist();notify();if(phase==='error')scheduleRetry();return false;}
   finally{running=null;}
  })();return running;
 }
 function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;void drain();});}
 for(const key of [SAVE_KEY,BACKUP_KEY])mirrorSet(key,memory.get(key)??null);
 persist();if(pending)schedule();
 const storage={
  notice,
  getItem:key=>memory.get(key)??null,
  setItem(key,value){
   if(![SAVE_KEY,BACKUP_KEY].includes(key)||typeof value!=='string'||value.length>MAX_SAVE_BYTES)throw Error('Invalid storage value');
   if(key===SAVE_KEY&&memory.get(key)===value)return;
   memory.set(key,value);mirrorSet(key,value);
   if(key===SAVE_KEY){pending={data:value,fresh:false};if(!['error','conflict'].includes(phase))phase='saving';persist();notify();schedule();}
  },
  removeItem(key){memory.delete(key);mirrorSet(key,null);if(key===BACKUP_KEY&&memory.has(SAVE_KEY)){pending??={data:memory.get(SAVE_KEY),fresh:true};pending.fresh=true;persist();schedule();}},
  writable:()=>!['error','conflict'].includes(phase),
  summary:()=>({mode:'folder',phase,savedAt,recovery:!!recovery,client}),
  subscribe(listener){listeners.add(listener);return ()=>listeners.delete(listener);},
  async flush({unload=false}={}){
   if(unload){
    const latest=currentPending();if(latest&&version!==null&&(phase!=='conflict'||preserveConflicts)){
     try{receipt(await post(latest,true),latest);}catch{persist();}return;
    }
   }
   return drain();
  },
  async retry(){
   if(running)await running;
   cancelDelay(retryTimer);retryTimer=null;attempt=0;
   if(!currentPending()&&phase==='error'&&readable(memory.get(SAVE_KEY)))pending={data:memory.get(SAVE_KEY),fresh:false};
   return drain();
  },
  async reload(){
   if(running)await running;const snapshot=await readFolder();if(!readable(snapshot.value)&&!readable(snapshot.backup))throw Error('No readable folder progress');archive(currentPending()?.data??memory.get(SAVE_KEY));pending=null;inFlight=null;adopt(snapshot);phase='saved';persist();notify();return loadSave({getItem:key=>memory.get(key)??null}).state;
  },
  async keepCurrent(){
   if(running)await running;const snapshot=await readFolder();version=snapshot.version;pending??={data:memory.get(SAVE_KEY),fresh:false};phase='ready';return drain();
  },
  recovered:()=>recovery?parseSave(recovery):null,
  clearRecovery(){recovery=null;mirrorSet(RECOVERY_KEY,null);notify();},
 };
 return storage;
}

export function bindFolderLifecycle(storage,win=window){
 const save=()=>{if(win.document.visibilityState==='hidden')void storage.flush({unload:true});};
 const leave=()=>{void storage.flush({unload:true});},online=()=>{void storage.retry();};
 win.addEventListener('pagehide',leave);win.addEventListener('online',online);win.document.addEventListener('visibilitychange',save);
 return ()=>{win.removeEventListener('pagehide',leave);win.removeEventListener('online',online);win.document.removeEventListener('visibilitychange',save);};
}
