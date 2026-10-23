import { motionAllowed } from './shared.js';

const running = new WeakMap();

export function routeMeasure(points) {
  const distances = points.map((point,index) => index ? Math.hypot(point[0]-points[index-1][0],point[1]-points[index-1][1]) : 0);
  let total=0;
  const lengths=distances.map(distance => (total+=distance));
  return { total, offsets:lengths.map(length=>total ? length/total : 0) };
}

// Trial and solved journeys share timing; light appears only where the ball has been.
export function playMazeRoute(root, points, onFinish = () => {}) {
  running.get(root)?.();
  const ball=root.querySelector('[data-maze-ball]'), trail=root.querySelector('.maze-trial-path');
  if (!ball || !points.length) return () => {};
  const {total,offsets}=routeMeasure(points), stars=[...root.querySelectorAll('[data-maze-star]')];
  const visits=stars.map(star=>{
    const x=Number(star.getAttribute('x')),y=Number(star.getAttribute('y'))-7;
    const at=points.findIndex(([px,py])=>Math.hypot(x-px,y-py)<2);
    return at<0 ? Infinity : offsets[at];
  });
  const line=document.createElementNS('http://www.w3.org/2000/svg','path');
  line.setAttribute('d',points.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' '));
  line.setAttribute('pathLength','1');line.classList.add('maze-tested-route');
  trail.replaceChildren(line);
  const reveal=position=>{
    line.style.strokeDasharray='1 1'; line.style.strokeDashoffset=String(1-position);
    stars.forEach((star,index)=>star.classList.toggle('star-touched',position>=visits[index]));
  };
  let animation,frame;
  const stop=()=>{cancelAnimationFrame(frame);animation?.cancel();if(running.get(root)===stop)running.delete(root);};
  running.set(root,stop);
  const last=points.at(-1);
  if (!motionAllowed() || !total) {ball.setAttribute('transform',`translate(${last})`);reveal(1);running.delete(root);onFinish();return stop;}
  reveal(0);
  const duration=Math.max(500,Math.min(2200,total*1.65));
  animation=ball.animate(points.map(([x,y],index)=>({transform:`translate(${x}px,${y}px)`,offset:offsets[index]})),{duration,easing:'linear',fill:'forwards'});
  const tick=()=>{
    if (!ball.isConnected) {stop();return;}
    reveal(Math.min(1,Number(animation.currentTime??0)/duration));
    if(animation.playState==='running')frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
  animation.finished.then(()=>{reveal(1);ball.setAttribute('transform',`translate(${last})`);animation.cancel();cancelAnimationFrame(frame);if(running.get(root)===stop)running.delete(root);onFinish();},()=>{});
  return stop;
}
