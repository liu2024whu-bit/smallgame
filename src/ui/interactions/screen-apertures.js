import {ASSETS} from '../../data/assets.js';
import {screenMaskPoint} from '../../data/screen.js';
import {luminanceMask} from './raster-mask.js';
export function screenApertures(root,progress){
 let sample;luminanceMask(ASSETS.screenMask).then(value=>sample=value).catch(()=>{});
 return event=>{
  const leaf=event.target.closest('[data-screen-leaf]');
  if(!sample||!leaf||!root.querySelector('.screen-viewport')?.contains(leaf))return null;
  const rect=leaf.getBoundingClientRect(),index=Number(leaf.dataset.screenLeaf),matrix=new DOMMatrixReadOnly(getComputedStyle(leaf.firstElementChild).transform),face=matrix.m11<0?1:0;
  const [u,v]=screenMaskPoint(index,Number.isFinite(matrix.m11)?face:progress.flips[index],(event.clientX-rect.left)/rect.width,(event.clientY-rect.top)/rect.height);
  return sample(u,v)?leaf:null;
 };
}
