import { PAPER_SEED, PAPER_TARGET, BACK_TARGET, BACK_OPERATIONS, OPERATIONS, STAMPS, applyOperations, operate } from '../../puzzles/paper.js';
import { STAMP_MOTIFS } from '../../data/assets.js';
import { motif, shiftControls, escape } from '../dom.js';

export function stampRow(values, className = '') {
  return `<div class="stamp-row ${escape(className)}">${values.map(value => `<span class="stamp" title="${STAMPS[value]}">${motif(STAMP_MOTIFS[value])}</span>`).join('')}</div>`;
}

export function renderPaper(progress) {
  return `<div class="paper-workbench">
    <div class="sample-prints"><p class="pencil-label">三张试印</p>${OPERATIONS.map((label, index) => `<div class="print-example"><span>${escape(label)}</span>${stampRow(PAPER_SEED)}<span class="thin-arrow">→</span>${stampRow(operate(PAPER_SEED, index))}</div>`).join('')}</div>
    <div class="operation-strip">${progress.order.map((operation, index) => `<div class="operation-piece"><small>${index + 1}</small><strong>${escape(OPERATIONS[operation])}</strong>${shiftControls(index, 3)}</div>`).join('')}</div>
    <div class="comparison"><div><p class="pencil-label">这次印的</p>${stampRow(applyOperations(PAPER_SEED, progress.order))}</div><div><p class="pencil-label">照这行印</p>${stampRow(PAPER_TARGET)}</div></div>
  </div>`;
}

export function renderPaperBack(progress) {
  return `<div class="paper-workbench backlit-paper"><p class="pencil-label">夹层里的印稿</p>${stampRow(BACK_TARGET)}
    <p class="operation-note">${BACK_OPERATIONS.map(operation => escape(OPERATIONS[operation])).join(' → ')}</p>
    <p class="pencil-label">原来那行</p><div class="stamp-arrangement">${progress.order.map((stamp, index) => `<div class="loose-stamp">${motif(STAMP_MOTIFS[stamp])}${shiftControls(index, 5)}</div>`).join('')}</div>
    <div class="comparison"><div><p class="pencil-label">印出来是这样</p>${stampRow(applyOperations(progress.order, BACK_OPERATIONS))}</div></div>
    <p class="hand-note">纸背记着针路：正面往下，背面往右上。</p>
  </div>`;
}
