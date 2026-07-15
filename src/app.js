import { CHAPTERS } from './content.js';
import { decodeBirth, isBreathSolved, isFilmSolved, isGiftSolved, isNotebookSolved, isRingSolved, isStarSolved, isWindSolved, moveItem, postmarkCode } from './puzzles.js';
import { app, chapterById, chapterUnlocked, closeDialog, dialog, errorSound, showToast, solve, store, successSound, tone } from './runtime.js';
import { openBirthLock, openHint, openNotebook, openPrologue } from './dialogs.js';
import { renderApp } from './render.js';

function resetGame() {
  if (!window.confirm('清除本浏览器中的全部解谜进度？GitHub里的文件和历史版本不会受到影响。')) return;
  store.reset();
  showToast('记忆簿已回到第一页。');
}

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
    if (isStarSolved(state.starOrder)) solve('stars', '初三星图复原：2020'); else { errorSound(); showToast('星章的位置仍不满足三条关系。'); }
    return;
  }

  if (target.dataset.turnWind != null) {
    const index = Number(target.dataset.turnWind);
    store.update((draft) => { draft.windRotations[index] = (draft.windRotations[index] + 1) % 4; return draft; });
    return;
  }
  if (target.matches('[data-check-wind]')) {
    if (isWindSolved(state.windRotations)) solve('wind', '四阵风停在东方：EAST'); else { errorSound(); showToast('四个风轮的步数还没有对应2020。'); }
    return;
  }

  if (target.matches('[data-check-breath]')) {
    if (isBreathSolved(state.breathOrder)) solve('breath', '呼吸谱完成：BIRTHDAY'); else { errorSound(); showToast('线条关系仍有一处冲突。'); }
    return;
  }

  if (target.dataset.filmStep === 'red') {
    store.update((draft) => { draft.filmSteps.red = true; return draft; });
    showToast('中央红色纹样显出字母L。');
    return;
  }
  if (target.dataset.filmStep === 'invert') {
    store.update((draft) => { draft.filmSteps.invert = true; return draft; });
    showToast('负片交叉处显出字母X。');
    return;
  }
  if (target.dataset.catChoice) {
    if (target.dataset.catChoice === '4') {
      store.update((draft) => { draft.filmSteps.cat = true; return draft; });
      showToast('第四只猫的尾巴旁留下字母Y。');
    } else {
      errorSound(); showToast('阅读顺序不对，再从左上往右下看。');
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
    if (postmarkCode(state.postmarks.wuhan, state.postmarks.nanjing) === '1029') solve('cities', '双城邮戳重合：1029'); else { errorSound(); showToast('樱花与梧桐还没有朝向彼此约定的方向。'); }
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
    showToast('缎带、名字或花窗词条仍有一处不对。数字应由06、1029和20组成。');
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
