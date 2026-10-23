import { puzzlePanel } from './workbench.js';
import { journalPanel, collectionPanel, keepsakePanel, readingPanel, interestsPanel, flowersPanel, itemPanel, endingPanel } from './notebook.js';
import { character, icon } from './dom.js';
import { encorePanel } from './achievements.js';
import { evidencePanel } from './evidence.js';
import { campusPanel } from './campus.js';
import { passagePanel, birthdayNotePanel } from './birthday.js';
import { flowerNotePanel } from './puzzles/flowers.js';

export function renderPanel(panel, context) {
  const simple = {
    puzzle: () => puzzlePanel(panel.id, context),
    evidence: () => evidencePanel(panel.id, context),
    campus: () => campusPanel(Number(panel.id), context),
    'flower-note':()=>flowerNotePanel(context.state),
    passage:()=>passagePanel(panel.id,context),
    'birthday-note':()=>birthdayNotePanel(panel.id,context),
    'birthday-wait':()=>({title:'蛋糕',className:'inspect-dialog',html:'<div class="short-note"><p>可可还没有分好。</p><button class="text-button" data-action="close">再看看</button></div>'}),
    ambient: () => ({ title: '雨声', className: 'inspect-dialog', html: '<div class="rain-listening"><p>等一小会儿。</p><p>雨落在窗沿上。</p></div>' }),
    journal: () => journalPanel(context.state, panel.tab, context.view),
    collection: () => collectionPanel(panel.id, context),
    keepsake: () => keepsakePanel(panel.id, context.state),
    reading: () => readingPanel(context.state),
    encore: () => encorePanel(context),
    interests: interestsPanel,
    flowers: () => flowersPanel(context.flower),
    item: () => itemPanel(panel.id),
    ending: () => endingPanel(context.flower),
    settings: () => settingsPanel(context),
    pet: () => petPanel(panel.id, context.petAwake),
    'how-to': howToPanel,
    birthday: () => ({ title: '10月29日', className: 'inspect-dialog', html: '<div class="short-note"><h3>给你</h3><p>先留着，晚一点再拆。</p><button class="text-button" data-action="close">放回去</button></div>' }),
    restart: () => ({ title: '重新开始', className: 'inspect-dialog', html: '<div class="short-note"><p>重新开始会清掉现在的进度。想留着的话，可以先回设置里保存一份存档，以后再接着玩。</p><button class="primary-button" data-action="confirm-restart">重新开始</button><button class="quiet-button" data-action="close">先不重来</button></div>' }),
  };
  return (simple[panel.type] ?? howToPanel)();
}

function howToPanel() {
  return { title: '怎么玩', className: 'inspect-dialog', html: `<div class="short-note"><p>点一点房间里的东西，就能凑近看。左右箭头可以转身，收下的物件会放在下方，需要时会带到手边，用完也会留着。键盘也可以操作：Tab 选物件，Enter 打开，左右方向键转身。</p><p>看到的线索会记在手账里，忘了就翻回来。没想通的时候，可以点提示，一次看一点；走错一步可以退，也可以重来。声音、动画和存档都在设置里，需要找东西时，也能在那里把可点的物件标出来。</p><button class="primary-button" data-action="close">知道了${icon('right')}</button></div>` };
}

function petPanel(id, awake) {
  const cat = id === 'cat';
  return { title: cat ? '小猫' : '小狗', className: 'pet-dialog', html: `<div class="pet-portrait ${awake ? 'pet-awake' : ''}">${character('pets', (cat ? 0 : 2) + (awake ? 1 : 0), 2, 2, cat ? '小猫' : '小狗')}</div><p class="hand-note">${awake ? cat ? '伸个懒腰。' : '朝这边看过来。' : cat?'睡得正香。':'陪它坐一会儿。'}</p><button class="primary-button" data-action="pet-touch">${awake ? '再摸一下' : '摸摸'}</button><button class="quiet-button" data-action="flowers">看看花</button>` };
}

function settingsPanel(context) {
  const settings = context.state.settings;
  return { title: '设置', className: 'settings-dialog', html: `<div class="settings-controls">${[['sound', '声音'], ['motion', '动画'], ['hotspots', '标出可点物件']].map(([key, label]) => `<label class="setting-toggle"><span>${label}</span><input type="checkbox" data-setting="${key}" ${settings[key] ? 'checked' : ''}></label>`).join('')}<label class="setting-volume"><span>音量</span><input type="range" min="0" max="1" step="0.05" value="${settings.volume}" data-setting="volume"></label><p class="hand-note">${context.writable ? '进度会自动保存。' : '这次没能自动保存。离开前，先保存一份存档吧。'}</p><div class="save-actions"><button class="quiet-button" data-action="export">保存一份</button><button class="quiet-button" data-action="import">读取存档</button><button class="quiet-button" data-action="fullscreen">${icon('full')}全屏</button></div><button class="text-button restart-link" data-action="restart">重新开始</button><p class="credits-note">同人创作，角色版权归各作品的权利人所有。</p></div>` };
}
