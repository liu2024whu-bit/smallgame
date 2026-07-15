import { CHAPTERS } from './content.js';
import { decodeBirth, isBreathSolved, isFilmSolved, isGiftSolved, isNotebookSolved, isRingSolved, isStarSolved, isWindSolved, moveItem, postmarkCode } from './puzzles.js';
import { app, chapterById, chapterUnlocked, closeDialog, dialog, errorSound, showToast, solve, store, successSound, tone } from './runtime.js';
import { openBirthLock, openHint, openNotebook, openPrologue } from './dialogs.js';
import { renderApp } from './render.js';

const WIND_CLUE_MESSAGES = Object.freeze([
  '长枪护手内侧刻着第一枚转盘的起点。',
  '面具边缘留下第二枚风窗的零位。',
  '斗笠垂带压住第三枚转盘。',
  '羽饰背面藏着最后一扇风窗。',
]);

function resetGame() {
  if (!window.confirm('清除本浏览器中的全部解谜进度？GitHub里的文件和历史版本不会受到影响。')) return;
  store.reset();
  showToast('记忆簿已回到第一页。');
}

app.addEventListener('error', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  image.hidden = true;
  image.parentElement?.classList.add('is-image-missing');
}, true);

app.addEventListener('load', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  image.hidden = false;
  image.parentElement?.classList.remove('is-image-missing');
}, true);

app.addEventListener('click', (event) => {
  const target = event.target.closest('button, [data-action]');
  if (!target) return;
  tone(310, 0.055);
  const state = store.get();

  if (target.matches('[data-open-prologue]')) return openPrologue();
  if (target.matches('[data-open-hint]')) return openHint();
  if (target.matches('[data-toggle-sound]')) return store.set({ sound: !state.sound });
  if (target.matches('[data-reset]')) return resetGame();

  if (target.dataset.chapter) {
    const chapter = chapterById(target.dataset.chapter);
    if (chapterUnlocked(chapter, state)) store.set({ active: chapter.id });
    return;
  }

  if (target.dataset.pet) {
    store.update((draft) => { draft.discoveries[target.dataset.pet] = true; return draft; });
    showToast(target.dataset.pet === 'cat' ? '猫把高处的吊牌露了出来：Ⅱ ○' : '狗把地面的吊牌推到桌脚旁：○ Ⅵ');
    return;
  }
  if (target.matches('[data-open-birth-lock]')) return openBirthLock();

  if (target.dataset.moveKey) {
    const key = target.dataset.moveKey;
    store.update((draft) => { draft[key] = moveItem(draft[key], Number(target.dataset.index), Number(target.dataset.direction)); return draft; });
    return;
  }

  if (target.matches('[data-check-stars]')) {
    if (isStarSolved(state.starOrder)) solve('stars', '初三星图复原：2020'); else { errorSound(); showToast('照片之间仍有一段先后关系没有对齐。'); }
    return;
  }

  if (target.dataset.windClue != null) {
    const index = Number(target.dataset.windClue);
    if (!Number.isInteger(index) || index < 0 || index > 3) return;
    store.update((draft) => { draft.windClues[index] = true; return draft; });
    showToast(WIND_CLUE_MESSAGES[index]);
    return;
  }

  if (target.dataset.turnWind != null) {
    const index = Number(target.dataset.turnWind);
    if (!state.windClues?.[index]) {
      errorSound();
      showToast('这枚风窗还没有在角色立绘中被找到。');
      return;
    }
    store.update((draft) => { draft.windRotations[index] = (draft.windRotations[index] + 1) % 4; return draft; });
    return;
  }
  if (target.matches('[data-check-wind]')) {
    if (!state.windClues?.every(Boolean)) { errorSound(); showToast('四个观察位置还没有全部找到。'); return; }
    if (isWindSolved(state.windRotations)) solve('wind', '四阵风停在东方：EAST'); else { errorSound(); showToast('四个转动次数仍没有对应上一页留下的年份。'); }
    return;
  }

  if (target.matches('[data-check-breath]')) {
    if (isBreathSolved(state.breathOrder)) solve('breath', '照片背面的字片完成：BIRTHDAY'); else { errorSound(); showToast('人物与紫藤之间仍有一处相邻关系不成立。'); }
    return;
  }

  if (target.dataset.filmStep === 'red') {
    store.update((draft) => { draft.filmSteps.red = true; return draft; });
    showToast('中央红色焦点的暗记显出字母L。');
    return;
  }
  if (target.dataset.filmStep === 'invert') {
    store.update((draft) => { draft.filmSteps.invert = true; return draft; });
    showToast('正反面切换成负片，交叉线显出字母X。');
    return;
  }
  if (target.dataset.catChoice) {
    if (target.dataset.catChoice === '4') {
      store.update((draft) => { draft.filmSteps.cat = true; return draft; });
      showToast('第四组猫咪动作旁留下字母Y。');
    } else {
      errorSound(); showToast('这组动作没有显影。重新确认阅读方向。');
    }
    return;
  }
  if (target.matches('[data-check-film]')) {
    if (isFilmSolved(state.filmSteps)) solve('film', '104号底片冲洗完成：LXY'); else { errorSound(); showToast('104对应的三个观察动作还没有全部完成。'); }
    return;
  }
  if (target.matches('[data-open-notebook]')) return openNotebook();

  if (target.dataset.turnPostmark) {
    const key = target.dataset.turnPostmark;
    store.update((draft) => { draft.postmarks[key] = (draft.postmarks[key] + 1) % 4; return draft; });
    return;
  }
  if (target.matches('[data-check-cities]')) {
    if (postmarkCode(state.postmarks.wuhan, state.postmarks.nanjing) === '1029') solve('cities', '双城邮戳重合：1029'); else { errorSound(); showToast('两张植物照片还没有朝向正确的方位。'); }
    return;
  }

  if (target.matches('[data-check-rings]')) {
    if (isRingSolved(state.rings)) solve('rings', '第20圈完整闭合。'); else { errorSound(); showToast('三个年份的位置或两段距离仍不正确。'); }
    return;
  }

  if (target.dataset.ending) {
    store.set({ ending: target.dataset.ending });
    successSound();
    return;
  }
  if (target.matches('[data-change-ending]')) return store.set({ ending: null });
});

app.addEventListener('change', (event) => {
  const select = event.target.closest('[data-ring]');
  if (!select) return;
  store.update((draft) => { draft.rings[select.dataset.ring] = select.value; return draft; });
});

app.addEventListener('submit', (event) => {
  if (!event.target.matches('[data-gift-form]')) return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target).entries());
  if (isGiftSolved(values)) {
    store.solve('gift');
    successSound();
    showToast('礼物盒在00:00打开。');
  } else {
    errorSound();
    showToast('三重锁仍有一处与前面的线索不一致。');
  }
});

dialog.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;
  tone(330, 0.055);
  const state = store.get();
  if (target.matches('[data-close-dialog]')) return closeDialog();
  if (target.matches('[data-next-hint]')) {
    const chapter = chapterById(state.active);
    store.update((draft) => { draft.hintLevels[chapter.id] = Math.min((draft.hintLevels[chapter.id] ?? 0) + 1, chapter.hints.length - 1); return draft; });
    closeDialog(); openHint(); return;
  }
  if (target.matches('[data-check-birth]')) {
    const input = dialog.querySelector('#birthInput');
    if (decodeBirth(state.discoveries.cat, state.discoveries.dog, input?.value)) solve('birth', '两张吊牌组成出生年份：2006');
    else { errorSound(); showToast('注意高低顺序，以及空心圆的含义。'); }
    return;
  }
  if (target.dataset.notebookSide) {
    const side = target.dataset.notebookSide;
    store.update((draft) => { draft.notebook[side] = moveItem(draft.notebook[side], Number(target.dataset.index), Number(target.dataset.direction)); return draft; });
    closeDialog(); openNotebook(); return;
  }
  if (target.matches('[data-check-notebook]')) {
    if (isNotebookSolved(state.notebook.orange, state.notebook.silver)) {
      store.set({ notebookSolved: true });
      successSound(); closeDialog(); showToast('获得隐藏物品：并肩灯。');
    } else {
      errorSound(); showToast('两页各自的叙事顺序还没有恢复。');
    }
  }
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDialog();
});

store.subscribe(renderApp);
renderApp();
setTimeout(() => {
  let seen = false;
  try { seen = localStorage.getItem('smallgame.prologue.seen') === '1'; } catch { seen = false; }
  if (!seen) {
    try { localStorage.setItem('smallgame.prologue.seen', '1'); } catch { /* storage can be blocked */ }
    openPrologue();
  }
}, 300);
