import {mountGame} from './app.js';
import {createFolderStorage,bindFolderLifecycle} from './services/folder-storage.js';
import {createSaveShelf} from './services/save-shelf.js';

let storage,saves;
const config=document.querySelector('#desktop-config');
const mirror={getItem:key=>localStorage.getItem('smallgame:public:'+key),setItem:(key,value)=>localStorage.setItem('smallgame:public:'+key,value),removeItem:key=>localStorage.removeItem('smallgame:public:'+key)};
function retryOpening(message){
 const root=document.querySelector('#app');root.innerHTML=`<div class="boot-message"><p>${message}</p><button class="quiet-button" type="button" id="retry-opening">再试一次</button><p>也可以先关闭游戏，再双击“开始游戏”。</p></div>`;
 root.querySelector('#retry-opening').addEventListener('click',()=>location.reload());
}
try{if(config){
 const options=JSON.parse(config.textContent),endpoint=new URL(options.endpoint,location.href);
 if(endpoint.origin!==location.origin||!['127.0.0.1','localhost'].includes(endpoint.hostname))throw Error('A local game service is required');
 if(options.saves){
  const catalog=new URL(options.saves,location.href);if(catalog.origin!==endpoint.origin)throw Error('A local game service is required');
  saves=await createSaveShelf({endpoint:catalog.href,mirror,session:sessionStorage});storage=saves.storage;
 }else storage=await createFolderStorage({endpoint:endpoint.href,mirror});
}else{saves=await createSaveShelf({mirror,session:sessionStorage});storage=saves.storage;}
}catch{
 retryOpening('存档暂时没能打开，原文件还在。');
}
if(storage){
 bindFolderLifecycle(storage);
 try{
  const game=mountGame({storage,saves});
  if(saves?.consumeResume()){if(game.store.get().begun)await game.enter();else game.showWelcome('intro');}
 }catch(error){console.error('Game presentation could not be opened',error);retryOpening('小屋这次没能展开，已经保存的进度还在。');}
}
