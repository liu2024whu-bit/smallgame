import {SAVE_KEY,BACKUP_KEY,parseSave} from '../core/storage.js';
import {createState,serializable} from '../core/state.js';
import {saveName,uniqueSaveName,summarizeSave,MAX_SAVE_SLOTS,SLOT_ID} from '../core/save-slots.js';

const INDEX='smallgame:bookmarks',PREFIX='smallgame:bookmark:';
const response=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
const stringify=state=>JSON.stringify(serializable(state));

// Static previews use the same bookmark UI, without probing a local-file API.
// Each record holds its own backup and version, independent of the last opened.
export function browserSaveTransport(storage,{now=Date.now,makeID=()=>crypto.randomUUID(),locks=globalThis.navigator?.locks}={}){
 const readIndex=()=>{try{const v=JSON.parse(storage.getItem(INDEX));if(v?.version===1&&Array.isArray(v.entries)&&v.entries.every(e=>SLOT_ID.test(e.id)))return v;}catch{}return {version:1,active:null,entries:[]};};
 const read=id=>{try{return JSON.parse(storage.getItem(PREFIX+id));}catch{return null;}};
 const valid=value=>{try{return value?parseSave(value):null;}catch{return null;}};
 const put=(id,value)=>storage.setItem(PREFIX+id,JSON.stringify(value));
 function add(index,name,state,{legacy=false,fork}={}){
  if(index.entries.filter(e=>!e.deletedAt).length>=MAX_SAVE_SLOTS)throw Error('Too many bookmarks');
  const entry={id:makeID(),name:uniqueSaveName(name,index.entries.filter(e=>!e.deletedAt).map(e=>e.name)),createdAt:now(),openedAt:now(),...(legacy?{legacy:true}:{}),...(fork?{fork}:{})};
  put(entry.id,{data:stringify(state),backup:null,version:makeID(),savedAt:now()});index.entries.push(entry);index.active=entry.id;return entry;
 }
 function index(){
  const v=readIndex();
  if(!v.entries.some(e=>!e.deletedAt)){
   const old=valid(storage.getItem(SAVE_KEY))??valid(storage.getItem(BACKUP_KEY));
   add(v,old?.begun?'原来的进度':'新的开始',old??createState(),{legacy:!!old});storage.setItem(INDEX,JSON.stringify(v));
  }
  return v;
 }
 function snapshot(record){const state=valid(record?.data),backup=valid(record?.backup);return {value:record?.data??null,backup:record?.backup??null,version:record?.version??'empty-version',savedAt:record?.savedAt??null,recovered:!state&&!!backup,unreadable:!!record?.data&&!state};}
 function list(v){return {active:v.active,limit:MAX_SAVE_SLOTS,slots:v.entries.map(entry=>{const r=read(entry.id),s=snapshot(r),state=valid(s.value)??valid(s.backup);return {...entry,savedAt:s.savedAt,readable:!!state,recovered:s.recovered,summary:state?summarizeSave(state):null};})};}
 function request(url,options={}){
  const v=index(),match=/\/([a-zA-Z0-9-]{8,80})\/progress$/.exec(String(url)),payload=options.body?JSON.parse(options.body):null;
  if(match){
   const entry=v.entries.find(e=>e.id===match[1]&&!e.deletedAt);if(!entry)return response({},409);
   const r=read(entry.id);
   if(options.method!=='POST')return response(snapshot(r));
   const same=r?.writer?.client===payload.client&&r.writer.version===r.version;
   if(payload.version!==r.version&&!(same&&payload.sequence>r.writer.sequence)||same&&payload.sequence<=r.writer.sequence)return response({},409);
   let data;try{data=stringify(parseSave(payload.data));}catch{return response({},400);}
   const version=makeID(),savedAt=now(),backup=payload.fresh?null:valid(r.data)?r.data:r.backup;
   put(entry.id,{data,backup,version,savedAt,writer:{client:payload.client,sequence:payload.sequence,version}});
   return response({version,savedAt});
  }
  if(options.method!=='POST')return response(list(v));
  const entry=v.entries.find(e=>e.id===payload.id);
  if(payload.action==='create'){
   const state=payload.data?parseSave(payload.data):createState(),fork=payload.fork;
   const copy=fork&&v.entries.find(e=>!e.deletedAt&&e.fork?.slot===fork.slot&&e.fork.client===fork.client&&valid(read(e.id)?.data)&&stringify(valid(read(e.id).data))===stringify(state));
   if(copy){copy.openedAt=now();v.active=copy.id;}else add(v,saveName(payload.name),state,{fork});
  }
  else if(!entry)return response({},409);
  else if(payload.action==='select'&&!entry.deletedAt){entry.openedAt=now();v.active=entry.id;}
  else if(payload.action==='rename'&&!entry.deletedAt){const name=saveName(payload.name,entry.name);if(v.entries.some(e=>!e.deletedAt&&e.id!==entry.id&&e.name.toLowerCase()===name.toLowerCase()))return response({},400);entry.name=name;}
  else if(payload.action==='delete'&&payload.keep!==entry.id&&(v.active!==entry.id||v.entries.some(e=>e.id===payload.keep&&!e.deletedAt))){entry.deletedAt=now();if(v.active===entry.id)v.active=payload.keep;}
  else if(payload.action==='restore'){if(v.entries.filter(e=>!e.deletedAt).length>=MAX_SAVE_SLOTS)return response({},400);delete entry.deletedAt;entry.name=uniqueSaveName(entry.name,v.entries.filter(e=>!e.deletedAt&&e.id!==entry.id).map(e=>e.name));}
  else return response({},400);
  storage.setItem(INDEX,JSON.stringify(v));return response(list(v));
 }
 return async(url,options)=>{
  try{return locks?await locks.request('smallgame-bookmarks',()=>request(url,options)):request(url,options);}
  catch{return response({},503);}
 };
}
