import { LETTER_GRID, COLUMN_STRIP, ROW_STRIP } from '../data/ciphers.js';
import { escape } from './dom.js';
import {postalGrid} from './postal-papers.js';

const ROMAN = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ'];
export const EVIDENCE_TITLES = { postal: '分拣格', alphabet: '字表', columns: '托板背面', rows: '透片背面' };

function ruledGrid(values, rows, columns, label) {
  return `<table class="cipher-grid" aria-label="${label}"><thead><tr><td></td>${columns.map(column => `<th scope="col">${column}</th>`).join('')}</tr></thead><tbody>${values.map((row, index) => `<tr><th scope="row">${rows[index]}</th>${row.map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function punchedStrip(values, { reversed = false, label = '列' } = {}) {
  const order = reversed ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4];
  return `<div class="punched-strip ${reversed ? 'strip-reversed' : ''}"><span class="strip-notch" aria-hidden="true"></span><b class="strip-label">${label}</b><div class="punch-columns">${order.map(i => `<div class="punch-column"><small>${ROMAN[i]}</small>${[1, 2, 3, 4, 5].map(level => `<span class="punch-hole ${values[i] === level ? 'punched' : ''}" aria-label="${ROMAN[i]}，第${level}${label}${values[i] === level ? '有孔' : '空'}"><i></i><em>${level}</em></span>`).join('')}</div>`).join('')}</div><span class="strip-arrow" aria-hidden="true">${reversed ? '←' : '→'}</span></div>`;
}

export function evidencePanel(id, context) {
  const flipped = context.view.flipped ?? false;
  const body = {
    postal:()=>`<div class="postal-grid-evidence">${postalGrid()}</div>`,
    alphabet: () => `<div class="evidence-sheet alphabet-sheet"><span class="evidence-heading">行 ↓　列 →</span>${ruledGrid(LETTER_GRID.map(row => [...row]), [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], '五行五列字表')}<span class="sheet-foot">I / J 同格</span></div>`,
    columns: () => `<div class="strips-desk">${punchedStrip(COLUMN_STRIP)}<p class="hand-note">纸带压在托板背面。</p></div>`,
    rows: () => `<div class="strips-desk">${punchedStrip(ROW_STRIP, { reversed: !flipped, label: '行' })}<button class="strip-flip text-button" data-action="evidence-flip">${flipped ? '翻回来' : '翻正'}</button></div>`,
  };
  return { title: EVIDENCE_TITLES[id] ?? '纸页', className: `evidence-dialog evidence-${escape(id)}`, html: (body[id] ?? body.postal)() };
}
