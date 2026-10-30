// Source coordinates stay constant; this service only measures their viewport.
export function createSourceViews(){
 const watched=new Map(),sizes=new WeakMap();
 function measure(world,resizing=false){
  const [x,y,width]=world.dataset.sourceCamera.split(',').map(Number),scale=world.parentElement.clientWidth/width;
  if(!Number.isFinite(scale)||scale<=0)return;
  if(resizing&&sizes.has(world)&&Math.abs(sizes.get(world)-scale)>.00001)world.getAnimations().forEach(a=>a.cancel());
  world.style.transform=`translate(${-x*scale}px,${-y*scale}px) scale(${scale})`;
  world.style.setProperty('--hit',44/scale+'px');sizes.set(world,scale);
 }
 const observer=new ResizeObserver(entries=>entries.forEach(({target})=>{const world=target.querySelector(':scope > [data-source-camera]');if(world)measure(world,true);}));
 return {
  refresh(root){
   for(const [world,parent] of watched)if(!world.isConnected){observer.unobserve(parent);watched.delete(world);}
   for(const world of root.querySelectorAll('[data-source-camera]')){measure(world);if(!watched.has(world)){watched.set(world,world.parentElement);observer.observe(world.parentElement);}}
  },
  clear(){observer.disconnect();watched.clear();}
 };
}
