import {SLOT_ID} from '../core/save-slots.js';

const KEY='smallgame:window-cache';
export async function saveWindowIdentity({session,makeID=()=>crypto.randomUUID(),locks=globalThis.navigator?.locks,win=globalThis.window}={}){
 let id;try{id=session?.getItem(KEY);}catch{}
 if(!SLOT_ID.test(id??''))id=makeID();
 let release=()=>{};
 async function reserve(value){
  if(!locks)return true;
  return new Promise(resolve=>{
   try{locks.request('smallgame-window-'+value,{ifAvailable:true},lock=>{
    if(!lock){resolve(false);return;}
    resolve(true);return new Promise(done=>{release=done;});
   }).catch(()=>resolve(true));}catch{resolve(true);}
  });
 }
 if(!await reserve(id)){id=makeID();await reserve(id);}
 try{session?.setItem(KEY,id);}catch{}
 win?.addEventListener('pagehide',()=>release(),{once:true});
 return {id,release:()=>release()};
}
