import {pointerSession} from './pointer.js';

export function bindRecord(root,player,{angle,paint,hold,preview}){
  const grip=root.querySelector('[data-record-grip]');if(!grip)return ()=>{};
  const abort=new AbortController();
  grip.addEventListener('pointerdown',event=>{if(event.button===0){event.preventDefault();grip.focus({preventScroll:true});}},{signal:abort.signal});
  grip.addEventListener('dragstart',event=>event.preventDefault(),{signal:abort.signal});
  const stop=pointerSession(root,{
    pick(event){
      if(!event.target.closest('[data-record-grip]'))return;
      const s=player.snapshot();if(!s.duration||s.status==='loading')return;
      const b=grip.getBoundingClientRect(),cx=b.x+b.width/2,cy=b.y+b.height/2;
      return {cx,cy,previous:Math.atan2(event.clientY-cy,event.clientX-cx),total:0,from:angle(),time:s.time,duration:s.duration};
    },
    start(){hold(true);},
    move(gesture,event){
      const a=Math.atan2(event.clientY-gesture.cy,event.clientX-gesture.cx),delta=Math.atan2(Math.sin(a-gesture.previous),Math.cos(a-gesture.previous));
      gesture.total+=delta;gesture.previous=a;gesture.target=Math.max(0,Math.min(gesture.duration-.05,gesture.time+gesture.total/Math.PI/2*12));
      paint(gesture.from+gesture.total*180/Math.PI);preview(gesture.target);
    },
    end(gesture,event,cancelled){if(!cancelled&&Number.isFinite(gesture.target))player.seek(gesture.target);},
    clear(){hold(false);preview(null);},
  });
  grip.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();const s=player.snapshot();if(s.duration&&s.status!=='loading')player.seek(s.time+(event.key==='ArrowRight'?5:-5));
  },{signal:abort.signal});
  return ()=>{stop();abort.abort();};
}
