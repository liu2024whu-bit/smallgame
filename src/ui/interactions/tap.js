// Some touch UAs omit the compatibility click immediately after a custom drag.
// Prefer the native click; only a missing one gets a fallback after touchend.
export function bindButtonTaps(root){
 const controller=new AbortController(),signal=controller.signal;
 let down,pending;
 const cancel=()=>{down=null;if(pending)clearTimeout(pending.timer);pending=null;};
 root.addEventListener('pointerdown',event=>{
  cancel();if(event.pointerType!=='touch'||!event.isPrimary)return;
  const button=event.target.closest('button[data-action],button[data-pmove]');
  if(button&&!button.disabled)down={button,pointer:event.pointerId,x:event.clientX,y:event.clientY};
 },{capture:true,signal});
 window.addEventListener('pointermove',event=>{
  if(down?.pointer===event.pointerId&&Math.hypot(event.clientX-down.x,event.clientY-down.y)>=5)down=null;
 },{capture:true,passive:true,signal});
 window.addEventListener('pointerup',event=>{
  if(down?.pointer!==event.pointerId)return;
  const tap=down;down=null;
  pending={...tap,fired:false};
  const current=pending;
  current.timer=setTimeout(()=>{
   if(pending!==current||!current.button.isConnected||current.button.disabled)return;
   current.fired=true;current.button.click();
  },0);
 },{capture:true,signal});
 root.addEventListener('click',event=>{
  if(!event.isTrusted||!pending||event.target.closest('button')!==pending.button)return;
  if(pending.fired){event.preventDefault();event.stopImmediatePropagation();}
  else cancel();
 },{capture:true,signal});
 window.addEventListener('pointercancel',cancel,{signal});
 window.addEventListener('blur',cancel,{signal});
 window.addEventListener('keydown',cancel,{capture:true,signal});
 return ()=>{cancel();controller.abort();};
}
