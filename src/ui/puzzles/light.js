import { CLOUD_TARGET, GAP_TARGET, cloudReadings } from '../../puzzles/rotors.js';
import { STAMP_MOTIFS, MOTIF_LABELS } from '../../data/assets.js';
import { character, dial, motif, moveButton } from '../dom.js';
import { skyFrame } from '../sky.js';

export function renderCloud(progress, context, negative = false) {
  const target = negative ? GAP_TARGET : CLOUD_TARGET;
  const readings = cloudReadings(progress.values, negative);
  const visible = progress.back ? [2] : [0, 1];
  return `<div class="cloud-workbench ${negative ? 'negative-space' : ''}">
    <div class="sky-diorama ${progress.back ? 'sky-back' : ''}">${skyFrame(context.skyPair, progress.back)}${visible.map(index => `<span class="sky-stamp sky-tag tag-${index}" role="img" aria-label="${progress.back ? '背签' : index ? '右签' : '左签'}：${MOTIF_LABELS[STAMP_MOTIFS[target[index]]]}">${motif(STAMP_MOTIFS[target[index]])}</span><span class="sky-stamp sky-window window-${index}" role="img" aria-label="${progress.back ? '背窗' : `前窗${index + 1}`}：${MOTIF_LABELS[STAMP_MOTIFS[readings[index]]]}">${motif(STAMP_MOTIFS[readings[index]])}</span>`).join('')}</div>
    <div class="cloud-view-controls"><button class="text-button" data-action="sky-pair">另一组</button>${moveButton(progress.back ? '看正面' : '看背面', { type: 'view' }, { className: 'turn-scene' })}</div>
    <div class="dial-row">${progress.values.map((value, index) => dial(index, value, `牵引绳 ${['Ⅰ', 'Ⅱ', 'Ⅲ'][index]}`)).join('')}</div>
    <p class="hand-note">${negative ? '透片里的空白，也要对上挂签。' : '左窗对左签，右窗对右签，背窗也有一张。'}</p>
  </div>`;
}

export function renderCalibration(progress) {
  return `<div class="calibration-workbench"><div class="calibration-clues"><div><span class="pencil-label">书签刻线</span><div class="ruler">${[0, 1, 2, 3].map(value => `<span class="${value === 2 ? 'ruler-mark' : ''}">${value}<i></i></span>`).join('')}</div><p>透片对着第三道。</p></div><div><span class="pencil-label">砖背的字</span><div class="acrylic-clue">${character('giftsMore', 2, 3, 3, '霞柱亚克力砖')}</div><div class="mirror-mark">${[3, 2, 1, 0].map(value => `<span class="${value === 1 ? 'etched' : ''}">${value}</span>`).join('')}</div><p>从右边数，第二格。</p></div><div><span class="pencil-label">光罩缺口</span><div class="shade-mark">○ ○ ○ ◉</div><p>缺口在最后一格。</p></div></div><div class="dial-row">${progress.values.map((value, index) => dial(index, value, ['距离', '方向', '光罩'][index])).join('')}</div><div class="projected-lines" style="--offset:${progress.values[0] * 12}px;--rotation:${progress.values[1] * 10}deg;--aperture:${progress.values[2] + 1}"></div></div>`;
}
