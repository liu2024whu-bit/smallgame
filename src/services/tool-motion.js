import { motionAllowed } from './motion.js';

export async function fitHandle(target,markup) {
  if(!target||!motionAllowed())return;
  const box=target.getBoundingClientRect(),piece=document.createElement('div');
  piece.className='tool-fitting';piece.innerHTML=markup;
  piece.style.left=`${box.x+box.width/2-35}px`;
  piece.style.top=`${box.y+box.height/2-35}px`;
  (document.querySelector('dialog[open]')??document.body).append(piece);
  try{await piece.animate([{transform:'translateY(12px) rotate(-40deg)',opacity:0},{transform:'translateY(0) rotate(0deg)',opacity:1,offset:.35},{transform:'rotate(90deg)',opacity:1}],{duration:600,easing:'ease-in-out',fill:'forwards'}).finished;}finally{piece.remove();}
}
