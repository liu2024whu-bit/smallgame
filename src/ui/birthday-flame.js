import {ASSET_LAYOUTS} from '../data/asset-layouts.js';
import {CANDLE_LIGHTS} from '../data/birthday-presentation.js';
import {atlas} from './dom.js';

export function candleFlame(index){
 const point=CANDLE_LIGHTS[index],anchors=ASSET_LAYOUTS.candleFire.anchors;
 return `<span class="candle-light" aria-hidden="true" style="left:${point.x}%;top:${point.rootY}%">${anchors.map(([x,y],i)=>atlas('candleFire',i,{className:'candle-flame-pose',style:`--root-x:${x*100}%;--root-y:${y*100}%;--pose-delay:${i*140-index*350}ms;`})).join('')}</span>`;
}
