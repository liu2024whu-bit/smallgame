import { motif, moveButton } from '../dom.js';

export function renderMelody(progress) {
  return `<div class="melody-workbench"><div class="music-strip"><p>Ⅰ在最低格　·　Ⅵ与Ⅰ同高</p><p>Ⅱ比Ⅰ高两格　·　Ⅲ比Ⅱ低一格</p><p>Ⅳ比Ⅱ高一格　·　Ⅴ比Ⅳ低一格</p></div><div class="music-pins">${progress.notes.map((note, index) => `<div class="music-pin-column"><span>${['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ'][index]}</span>${moveButton('＋', { type: 'note', index, direction: 1 }, { key: `note-${index}-up` }).replace('<button ', `<button aria-label="第${index + 1}个音钉升一格" `)}<div class="music-pin-track"><span class="music-pin" style="--note:${note}">${motif('star')}</span><small>${note}</small></div>${moveButton('−', { type: 'note', index, direction: -1 }, { key: `note-${index}-down` }).replace('<button ', `<button aria-label="第${index + 1}个音钉降一格" `)}</div>`).join('')}</div><button class="quiet-button" data-action="play-melody">试听这一段</button><p class="hand-note">播放光点与声音同步，关掉声音也能完成。</p></div>`;
}
