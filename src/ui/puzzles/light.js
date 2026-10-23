import { CLOUD_TARGET, cloudReadings } from '../../puzzles/rotors.js';
import { STAMP_MOTIFS, MOTIF_LABELS } from '../../data/assets.js';
import { character, dial, motif, moveButton } from '../dom.js';
import { skyFrame } from '../sky.js';

export function renderCloud(progress, context) {
  const target = CLOUD_TARGET;
  const readings = cloudReadings(progress.values);
  const visible = progress.back ? [2] : [0, 1];
  return `<div class="cloud-workbench ">
    <div class="sky-diorama ${progress.back ? 'sky-back' : ''}">${skyFrame(context.skyPair, progress.back)}${visible.map(index => `<span class="sky-stamp sky-tag tag-${index}" role="img" aria-label="${progress.back ? '背签' : index ? '右签' : '左签'}：${MOTIF_LABELS[STAMP_MOTIFS[target[index]]]}">${motif(STAMP_MOTIFS[target[index]])}</span><span class="sky-stamp sky-window window-${index}" role="img" aria-label="${progress.back ? '背窗' : `前窗${index + 1}`}：${MOTIF_LABELS[STAMP_MOTIFS[readings[index]]]}">${motif(STAMP_MOTIFS[readings[index]])}</span>`).join('')}</div>
    <div class="cloud-view-controls"><button class="text-button" data-action="sky-pair">另一组</button>${moveButton(progress.back ? '看正面' : '看背面', { type: 'view' }, { className: 'turn-scene' })}</div>
    <div class="dial-row">${progress.values.map((value, index) => dial(index, value, `牵引绳 ${['Ⅰ', 'Ⅱ', 'Ⅲ'][index]}`)).join('')}</div>
    <p class="hand-note">左窗对左签，右窗对右签，背窗也有一张。</p>
  </div>`;
}

export function renderCalibration(progress) {
  const error = progress.values.reduce((sum,value,i) => sum + Math.abs(value - [2,1,3][i]),0);
  return `<div class="calibration-workbench"><div class="light-console">${character('lightbench',0,1,1,'台灯、透片和小圆镜')}<div class="optical-projection" style="--blur:${error*1.3}px;--light:${1-error*.07}"><span>雨廊</span><small>晚邮</small></div><div class="dial-row">${progress.values.map((value,index)=>dial(index,value,['尺','镜','罩'][index])).join('')}</div></div><div class="optical-evidence"><div><span>尺</span><div class="ruler">${[0,1,2,3].map(value=>`<span class="${value===2?'ruler-mark':''}">${value}<i></i></span>`).join('')}</div></div><div><span>镜</span><div class="mirror-mark">${[3,2,1,0].map(value=>`<span class="${value===1?'etched':''}">${value}</span>`).join('')}</div></div><div><span>罩</span><div class="shade-mark">○ ○ ○ ◉</div></div></div></div>`;
}
