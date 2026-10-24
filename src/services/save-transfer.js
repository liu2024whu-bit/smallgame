import {MAX_SAVE_BYTES,parseSave} from '../core/storage.js';
import {saveFilename,encodeSave,deliverSave} from './save-file.js';
const RECENT_KEY='smallgame:last-export';

export function bindSaveTransfer(input,{store,loaded,toast,refresh=()=>{},remember=null}){
  let busy=false,failed=false,recent=null;
  try{
    const saved=JSON.parse(remember?.getItem(RECENT_KEY)??'null');
    if(saved&&typeof saved.name==='string'&&saved.name.length<180&&['picker','download'].includes(saved.method)&&Number.isFinite(Date.parse(saved.time)))recent=saved;
  }catch{}
  input.addEventListener('change',async()=>{
    const file=input.files[0];input.value='';if(!file)return;
    try{
      if(file.size>MAX_SAVE_BYTES)throw new Error('Save too large');
      const saved=parseSave(await file.text());store.replace(saved);loaded(saved);toast('这一页接上了。');
    }catch{toast('这份文件没读出来，原来的进度还在。');}
  });
  async function save(forceDownload=false){
    if(busy)return;busy=true;failed=false;refresh();
    try{
      const result=await deliverSave({text:encodeSave(store.get()),name:saveFilename(),...(forceDownload?{picker:null}:{})});
      if(result.status==='cancelled'){toast('这次先留在这里。');return;}
      if(result.status!=='saved'){failed=true;toast('这次没写进去。原来的进度还在，也可以改用下载。');return;}
      recent={name:result.name,method:result.method,time:new Date().toISOString()};
      try{remember?.setItem(RECENT_KEY,JSON.stringify(recent));}catch{}
      toast(result.method==='picker'?'这一刻，存好了。':'已交给浏览器下载，文件名也留在这里了。');
    }catch{failed=true;toast('这次没能保存，原来的进度还在。');}
    finally{busy=false;refresh();}
  }
  return {
    summary:()=>({recent,busy,failed}),
    actions:{import:()=>input.click(),export:()=>save(),'export-download':()=>save(true)},
  };
}
