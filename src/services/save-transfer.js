import { serializable } from '../core/state.js';
import { MAX_SAVE_BYTES,parseSave } from '../core/storage.js';

export function bindSaveTransfer(input,{store,loaded,toast}){
  input.addEventListener('change',async()=>{
    const file=input.files[0];input.value='';if(!file)return;
    try{
      if(file.size>MAX_SAVE_BYTES)throw new Error('Save too large');
      const saved=parseSave(await file.text());store.replace(saved);loaded(saved);toast('存档已读入。');
    }catch{toast('这份存档打不开，原来的进度还在。');}
  });
  return {
    import:()=>input.click(),
    export:()=>{
      const blob=new Blob([JSON.stringify(serializable(store.get()),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');anchor.href=url;anchor.download='第20圈以前-10-29.json';anchor.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);toast('存档已保存。');
    },
  };
}
