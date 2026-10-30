export function bindFlipFlowers(root,{solved,changeView,feedback}){
 const controller=new AbortController();
 root.addEventListener('click',event=>{if(!solved)return;const flower=event.target.closest('[data-flower-look]');if(flower){changeView({flipFlower:Number(flower.dataset.flowerLook)});feedback('turn',.3);}else if(event.target.closest('[data-flower-back]')){changeView({flipFlower:null});feedback('turn',.3);}},{signal:controller.signal});
 return ()=>controller.abort();
}
