import { CALIBRATION_TARGET } from '../../puzzles/rotors.js';
import { character, dial } from '../dom.js';

export function renderCalibration(progress) {
  const error = progress.values.reduce((sum,value,i) => sum + Math.abs(value - CALIBRATION_TARGET[i]),0);
  return `<div class="calibration-workbench"><div class="light-console">${character('lightbench',0,1,1,'台灯、透片和小圆镜')}<div class="optical-projection" style="--blur:${error*1.3}px;--light:${1-error*.07}"><span>雨廊</span><small>晚邮</small></div><div class="dial-row">${progress.values.map((value,index)=>dial(index,value,['尺','镜','罩'][index])).join('')}</div></div><div class="optical-evidence"><div><span>尺</span><div class="ruler">${[0,1,2,3].map(value=>`<span class="${value===2?'ruler-mark':''}">${value}<i></i></span>`).join('')}</div></div><div><span>镜</span><div class="mirror-mark">${[3,2,1,0].map(value=>`<span class="${value===1?'etched':''}">${value}</span>`).join('')}</div></div><div><span>罩</span><div class="shade-mark">○ ○ ○ ◉</div></div></div></div>`;
}
