import {serializable} from '../core/state.js';
import {parseSave} from '../core/storage.js';

export function saveFilename(date=new Date()){
  const pair=n=>String(n).padStart(2,'0');
  return '第20圈以前-存档-'+date.getFullYear()+pair(date.getMonth()+1)+pair(date.getDate())+'-'+pair(date.getHours())+pair(date.getMinutes())+pair(date.getSeconds())+'-'+String(date.getMilliseconds()).padStart(3,'0')+'.json';
}
export function encodeSave(state){
  const text=JSON.stringify(serializable(state),null,2)+'\n';parseSave(text);return text;
}
export async function deliverSave({text,name,picker=globalThis.showSaveFilePicker,document:doc=globalThis.document,urls=globalThis.URL,delay=globalThis.setTimeout}){
  const blob=new Blob([text],{type:'application/json;charset=utf-8'});
  if(typeof picker==='function'){
    let handle;
    try{handle=await picker.call(globalThis,{id:'smallgame-progress',suggestedName:name,startIn:'downloads',types:[{description:'小屋存档',accept:{'application/json':['.json']}}]});}
    catch(error){if(error.name==='AbortError')return {status:'cancelled'};}
    if(handle){
      let stream;
      try{stream=await handle.createWritable();await stream.write(blob);await stream.close();return {status:'saved',method:'picker',name:handle.name||name};}
      catch{try{await stream?.abort();}catch{}return {status:'failed'};}
    }
  }
  let url;
  try{
    url=urls.createObjectURL(blob);const anchor=doc.createElement('a');anchor.href=url;anchor.download=name;
    doc.body.append(anchor);anchor.click();anchor.remove();
    delay(()=>urls.revokeObjectURL(url),15000);
    return {status:'saved',method:'download',name};
  }catch{if(url)urls.revokeObjectURL(url);return {status:'failed'};}
}
