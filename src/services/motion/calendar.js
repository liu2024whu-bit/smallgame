import {ease} from './shared.js';
import {CALENDAR_DRAWER,CALENDAR_FRONT} from '../../data/calendar-apparatus.js';
import {atlas} from '../../ui/dom.js';

export const calendarMotion={
 capture(root){
  const model=root.querySelector('[data-calendar-model]'),world=model?.closest('.calendar-world');if(!world)return null;
  return {p:JSON.parse(model.dataset.calendarPose),note:model.dataset.calendarNoteState,held:model.dataset.calendarHeld,camera:world.dataset.sourceCamera,box:world.getBoundingClientRect(),paper:model.querySelector('.calendar-paper').innerHTML,drums:[...model.querySelectorAll('[data-calendar-number]')].map(el=>el.style.getPropertyValue('--digit'))};
 },
 play(root,old){
  const model=root.querySelector('[data-calendar-model]'),world=model?.closest('.calendar-world');if(!old||!world)return;
  const p=JSON.parse(model.dataset.calendarPose),animations=[],ghosts=[];
  const animate=(el,frames,options={})=>{if(el)animations.push(el.animate(frames,{duration:350,easing:ease,...options}));};
  const closed=s=>!s.opened||s.shut;
  if(closed(old.p)!==closed(p)){
   const height=CALENDAR_DRAWER[3],from=closed(old.p)?CALENDAR_FRONT:height,to=closed(p)?CALENDAR_FRONT:height;
   animate(model.querySelector('[data-calendar-drawer-clip]'),[{height:from+'px'},{height:to+'px'}],{duration:560});
   animate(model.querySelector('[data-calendar-drawer-body]'),[{transform:`translateY(${from-height}px)`},{transform:`translateY(${to-height}px)`}],{duration:560});
  }
  if(old.note!==model.dataset.calendarNoteState){
   const paper=model.querySelector('.calendar-paper'),ghost=paper.cloneNode(false);ghost.innerHTML=old.paper;ghost.classList.add('calendar-old-page');ghost.inert=true;ghost.style.pointerEvents='none';model.append(ghost);ghosts.push(ghost);
   animate(ghost,[{transform:'perspective(1000px) rotateX(0)',opacity:1},{transform:'perspective(1000px) rotateX(-82deg)',opacity:0}],{duration:270,fill:'forwards'});
   animate(paper,[{opacity:0},{opacity:1}],{duration:240,delay:150,fill:'backwards'});
  }
  if(!old.p.stamped&&p.stamped){
   const target=model.querySelector('[data-calendar-today-cell]'),stamp=root.ownerDocument.createElement('span');
   if(target){stamp.className='calendar-stamp-press';stamp.innerHTML=atlas('calendarDetails',6);Object.assign(stamp.style,{position:'absolute',width:'62px',height:'100px',left:'45px',top:'-73px',pointerEvents:'none',zIndex:9});target.append(stamp);ghosts.push(stamp);animate(stamp,[{translate:'18px -45px',opacity:0},{translate:'0 0',opacity:1,offset:.45},{translate:'0 0',opacity:1,offset:.7},{translate:'16px -35px',opacity:0}],{duration:620,fill:'forwards'});}
   animate(model.querySelector('.calendar-ink'),[{opacity:0},{opacity:1}],{duration:100,delay:310,fill:'backwards'});
  }
  [...model.querySelectorAll('[data-calendar-number]')].forEach((el,i)=>{
   const n=p.values[i],from=Number(old.drums[i]);if(Number.isFinite(from)&&Math.abs(from-n)>.001){const start=n+((from-n+15)%10)-5;animate(el,[{transform:`translateY(${-(10+start)*30-1}px)`},{transform:`translateY(${-(10+n)*30-1}px)`}],{duration:170});}
  });
  if(p.attempts>old.p.attempts&&!p.opened)animate(model.querySelector('.calendar-pull'),[{translate:'0 0'},{translate:'0 4px'},{translate:'0 0'}],{duration:240});
  if(old.camera!==world.dataset.sourceCamera){const r=world.parentElement.getBoundingClientRect();animate(world,[{transform:`translate(${old.box.left-r.left}px,${old.box.top-r.top}px) scale(${old.box.width/1536})`},{transform:world.style.transform}],{duration:410});}
  const blocking=old.camera!==world.dataset.sourceCamera||closed(old.p)!==closed(p);
  if(!animations.length)return;
  if(blocking)model.dataset.calendarBusy='true';
  // Turning a page must not disable the independent number wheels below it.
  const selector=blocking?'.calendar-workbench button':old.note!==model.dataset.calendarNoteState?'.calendar-tabs button':'.calendar-stamp-place';
  const controls=[...root.querySelectorAll(selector)].map(el=>[el,el.disabled]);controls.forEach(([el])=>el.disabled=true);
  Promise.allSettled(animations.map(a=>a.finished)).then(()=>{ghosts.forEach(el=>el.remove());if(!model.isConnected)return;delete model.dataset.calendarBusy;controls.forEach(([el,disabled])=>el.disabled=disabled);if(old.held!=='true'&&model.dataset.calendarHeld==='true')model.querySelector('[data-calendar-stamp]')?.focus({preventScroll:true});});
 },
};
