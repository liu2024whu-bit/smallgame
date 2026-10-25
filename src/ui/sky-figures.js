import {SKY_PAIRS} from '../data/sky.js';
import {ASSET_LAYOUTS} from '../data/asset-layouts.js';
import {atlas} from './dom.js';

// Layout supplies a physical height; a different viewport never stretches a head.
export function skyPaperFigure(pair,index,{height,aspect,className=''}){
 const figure=SKY_PAIRS[pair]?.figures[index]??SKY_PAIRS[0].figures[index];
 const {asset,label,scale}=figure,[,,width,pixels]=ASSET_LAYOUTS[asset].frames[0];
 const h=height*scale,w=h/aspect*width/pixels;
 return atlas(asset,0,{label,className,style:`height:${h}%;width:${w}%;`});
}
