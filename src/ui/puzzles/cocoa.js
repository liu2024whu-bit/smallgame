import {viewControl} from '../view-control.js';
import {ASSETS} from '../../data/assets.js';
import {cocoaModel} from '../cocoa-props.js';
import {atlas} from '../dom.js';

export function renderCocoa(p,{state}){
 const done=state.solved.includes('cocoa');
 return `<div class="cocoa-workbench"><div class="cocoa-viewport"><div class="cocoa-world" data-source-camera="0,0,1536,1024"><img class="cocoa-table-wide" src="${ASSETS.cocoaTableWide}" alt="" draggable="false"><img class="cocoa-table" src="${ASSETS.cocoaTable}" alt="同一张生日桌上，三只玻璃壶和两只宽口花杯" draggable="false"><img class="cocoa-tray" src="${ASSETS.cocoaTray}" alt="" draggable="false"><div class="cocoa-recipe" aria-label="八份可可，两只杯子，一人一半"><small>一人一半。</small><span>${atlas('cocoaVessels',3)}${atlas('cocoaVessels',4)}</span></div>${cocoaModel(p,{done})}</div></div><nav class="cocoa-navigation" aria-label="桌边">${viewControl(`旁边的巧克力`,`data-action="puzzle" data-id="chocolate"`)}</nav><p class="cocoa-status" role="status"></p><span class="sr-only">三只玻璃壶的满量分别为八份、五份、三份。两只花杯没有刻度，容量都不少于八份。可可一共八份，一人一半。可以拿起一只容器，再点另一只；也可以拖到另一只容器上。倾倒到接收容器满了，或拿起的容器空了，就会停下。杯子也能倒回壶里。方向键在五只容器间移动，空格或回车选择，Escape放回。</span></div>`;
}
