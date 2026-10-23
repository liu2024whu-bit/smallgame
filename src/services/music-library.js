import { MUSIC_BY_ID, isBuiltIn } from '../data/music.js';

export const MUSIC_DATABASE='smallgame-audio';
export const MAX_AUDIO_BYTES=64*1024*1024;
export function validateAudio(file,id) {
  if(!MUSIC_BY_ID[id]||isBuiltIn(id))throw new Error('这张唱片的位置不太对。');
  if(!file||!Number.isFinite(file.size)||file.size<=0||file.size>MAX_AUDIO_BYTES)throw new Error('音频最好小于 64 MB，换一份试试？');
  if(!/^audio\//i.test(file.type??'')&&!/\.(mp3|m4a|ogg|wav|flac|aac|opus)$/i.test(file.name??''))throw new Error('这份好像不是音频，再选一次吧。');
}

// Local audio lives outside the game save. It is never uploaded or exported.
export function createMusicLibrary(indexedDB=globalThis.indexedDB) {
  let connection;
  const temporary=new Map();
  function database() {
    if(!indexedDB)return Promise.reject(new Error('Local audio storage is unavailable'));
    if(!connection)connection=new Promise((resolve,reject)=>{
      const request=indexedDB.open(MUSIC_DATABASE,1);
      request.onupgradeneeded=()=>request.result.createObjectStore('tracks',{keyPath:'id'});
      request.onerror=()=>reject(request.error);
      request.onblocked=()=>reject(new Error('Local audio storage is busy'));
      request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();connection=null;};resolve(db);};
    }).catch(error=>{connection=null;throw error;});
    return connection;
  }
  async function run(mode,operation) {
    const db=await database();
    return new Promise((resolve,reject)=>{
      const transaction=db.transaction('tracks',mode),request=operation(transaction.objectStore('tracks'));
      transaction.oncomplete=()=>resolve(request.result);
      transaction.onerror=transaction.onabort=()=>reject(transaction.error??new Error('Local audio storage failed'));
    });
  }
  return {
    async list(){
      const ids=await run('readonly',store=>store.getAllKeys()).catch(()=>[]);
      return [...new Set([...ids,...temporary.keys()])].filter(id=>MUSIC_BY_ID[id]&&!isBuiltIn(id));
    },
    async get(id){return temporary.get(id)??(await run('readonly',store=>store.get(id)).catch(()=>null))?.blob??null;},
    async put(id,file){
      validateAudio(file,id);
      try{await run('readwrite',store=>store.put({id,blob:file}));temporary.delete(id);return true;}
      catch{temporary.set(id,file);return false;}
    },
    async remove(id){
      // Report failure honestly: a failed deletion must not resurrect on reload.
      if(!indexedDB){temporary.delete(id);return;}
      await run('readwrite',store=>store.delete(id));temporary.delete(id);
    },
    async close(){if(connection)(await connection.catch(()=>null))?.close();connection=null;temporary.clear();},
  };
}
