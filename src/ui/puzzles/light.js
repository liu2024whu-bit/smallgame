import { CLOUD_TARGET, GAP_TARGET, cloudReadings } from '../../puzzles/rotors.js';
import { STAMP_MOTIFS } from '../../data/assets.js';
import { character, dial, motif, moveButton, escape } from '../dom.js';
import { renderSkyPair, skyControls } from '../sky.js';

export function renderCloud(progress, context, negative = false) {
  const target = negative ? GAP_TARGET : CLOUD_TARGET;
  const readings = cloudReadings(progress.values, negative);
  const visible = progress.back ? [2] : [0, 1];
  return `<div class="cloud-workbench ${negative ? 'negative-space' : ''}">
    ${skyControls(context.state, context.skyPair)}
    <div class="cloud-theater" style="--rope-a:${progress.values[0]};--rope-b:${progress.values[1]};--rope-c:${progress.values[2]}"><div class="cloud-layer cloud-layer-back">${motif('cloud')}${motif('cloud')}</div>${renderSkyPair(context.state, context.skyPair)}<div class="cloud-layer cloud-layer-front">${motif('cloud')}${motif('cloud')}</div></div>
    <div class="window-readings">${visible.map(index => `<div class="reading-window"><span>${progress.back ? '背窗' : `前窗${index + 1}`}</span><div>${motif(STAMP_MOTIFS[readings[index]])}<span class="reading-equals">／</span>${motif(STAMP_MOTIFS[target[index]])}</div><small>现在 ／ 窗框印记</small></div>`).join('')}${moveButton(progress.back ? '翻到正面' : '翻到背面', { type: 'view' }, { className: 'turn-scene' })}</div>
    <div class="dial-row">${progress.values.map((value, index) => dial(index, value, `牵引绳 ${['Ⅰ', 'Ⅱ', 'Ⅲ'][index]}`)).join('')}</div>
    <p class="hand-note">${negative ? '前面的云不变，变的是你在看什么。' : '两面共用同一组云片。转动一格，再看看另一面。'}</p>
  </div>`;
}

export function renderCalibration(progress) {
  return `<div class="calibration-workbench"><div class="calibration-clues"><div><span class="pencil-label">书签纸套刻尺</span><div class="ruler">${[0, 1, 2, 3].map(value => `<span class="${value === 2 ? 'ruler-mark' : ''}">${value}<i></i></span>`).join('')}</div><p>透片与第三条刻线重合。</p></div><div><span class="pencil-label">镜中的背标</span><div class="mirror-mark">${[3, 2, 1, 0].map(value => `<span class="${value === 1 ? 'etched' : ''}">${value}</span>`).join('')}</div><p>镜中，从右起第二格。</p></div><div><span class="pencil-label">光罩上的缺口</span><div class="shade-mark">○ ○ ○ ◉</div><p>缺口在四格的最后一格。</p></div></div><div class="dial-row">${progress.values.map((value, index) => dial(index, value, ['距离', '方向', '光罩'][index])).join('')}</div><div class="projected-lines" style="--offset:${progress.values[0] * 12}px;--rotation:${progress.values[1] * 10}deg;--aperture:${progress.values[2] + 1}"></div><p class="hand-note">三个轮盘都从0开始。</p></div>`;
}
