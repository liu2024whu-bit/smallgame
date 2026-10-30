import {ease} from './shared.js';
export const melodyMotion={
 capture(root){const field=root.querySelector('.music-apparatus');return field?{pins:[...field.querySelectorAll('[data-music-pin]')].map(el=>[parseFloat(el.style.left),parseFloat(el.style.top)])}:null;},
 play(root,before){if(!before)return;root.querySelectorAll('.music-apparatus [data-music-pin]').forEach((el,index)=>{const old=before.pins[index];if(!old)return;const dx=old[0]-parseFloat(el.style.left),dy=old[1]-parseFloat(el.style.top);if(Math.abs(dx)+Math.abs(dy)>.1)el.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{duration:230,easing:ease});});},
};
