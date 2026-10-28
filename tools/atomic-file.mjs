import {open,rename,unlink} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';

export async function atomicFile(path,text){
 const temporary=path+'.tmp-'+randomUUID();let handle;
 try{
  handle=await open(temporary,'wx',0o600);await handle.writeFile(text,'utf8');await handle.sync();await handle.close();handle=null;
  await rename(temporary,path);
 }finally{
  await handle?.close().catch(()=>{});
  await unlink(temporary).catch(error=>{if(error.code!=='ENOENT')throw error;});
 }
}
