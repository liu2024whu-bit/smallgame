import {pointerSession} from './pointer.js';
import {YANYUN_PAGES} from '../../data/yanyun.js';
import {setDrawerPose,animateDrawerPose} from '../../services/jianghu-poses.js';
import {motionAllowed} from '../../services/motion/shared.js';

export function bindJianghu(root,{activity,changeView,view,feedback}){
 const desk=root.querySelector('[data-jianghu-state]');if(!desk)return ()=>{};
 const abort=new AbortController(),options={signal:abort.signal};
 const current=()=>Math.max(0,YANYUN_PAGES.findIndex(p=>p.id===view.jianghuPage));
 const turn=step=>{const page=YANYUN_PAGES[(current()+step+YANYUN_PAGES.length)%YANYUN_PAGES.length];changeView({jianghuPage:page.id},`yanyun:person:${page.id}`);feedback('turn');};
 const open=()=>{feedback('wood');activity('yanyun:open');};
 const stop=pointerSession(root,{
  pick(e){const handle=e.target.closest('[data-jianghu-handle]'),paper=e.target.closest('[data-jianghu-paper]'),source=handle??paper;return source?{source,kind:handle?'drawer':'paper',world:source.closest('.jianghu-world')}:null;},
  start(g){g.scale=g.world.getBoundingClientRect().width/1536;},
  move(g,e){if(g.kind==='paper'){g.amount=(e.clientX-g.x)/g.scale;g.world.querySelector('.jianghu-paper-paint').style.translate=`${Math.max(-100,Math.min(100,g.amount))}px 0`;return;}g.amount=Math.max(0,Math.min(1,(e.clientY-g.y)/(430*g.scale)));setDrawerPose(g.world,g.amount);},
  end(g,e,cancelled){if(cancelled)return;if(g.kind==='drawer'&&g.amount>.6)open();else if(g.kind==='paper'&&Math.abs(g.amount)>90)turn(g.amount<0?1:-1);},
  clear(g){const world=g?.world;if(world?.isConnected&&world===root.querySelector('.jianghu-world')){if(g.kind==='drawer'&&g.amount>0&&world.closest('[data-jianghu-state]').dataset.jianghuState==='closed'&&motionAllowed()&&!document.hidden)animateDrawerPose(world,{from:g.amount,to:0,duration:Math.max(150,450*g.amount)});else setDrawerPose(world,0);world.querySelector('.jianghu-paper-paint')?.style.removeProperty('translate');}},
 });
 root.addEventListener('click',e=>{if(Date.now()<Number(root.dataset.suppressUntil||0))return;if(e.target.closest('[data-jianghu-handle]')){open();return;}const step=e.target.closest('[data-jianghu-step]');if(step)turn(Number(step.dataset.jianghuStep));},options);
 root.addEventListener('keydown',e=>{if(desk.dataset.jianghuState!=='open'||!e.target.closest('.jianghu-desk'))return;if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();turn(e.key==='Home'?-current():e.key==='End'?YANYUN_PAGES.length-1-current():e.key==='ArrowRight'?1:-1);}},options);
 return ()=>{stop();abort.abort();};
}
