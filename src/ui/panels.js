import { puzzlePanel } from './workbench.js';
import { journalPanel, collectionPanel, readingPanel, interestsPanel, flowersPanel, itemPanel, endingPanel } from './notebook.js';
import { character, icon } from './dom.js';

export function renderPanel(panel, context) {
  const simple = {
    puzzle: () => puzzlePanel(panel.id, context),
    journal: () => journalPanel(context.state, panel.tab),
    collection: () => collectionPanel(panel.id, context),
    reading: readingPanel,
    interests: interestsPanel,
    flowers: () => flowersPanel(context.flower),
    item: () => itemPanel(panel.id),
    ending: () => endingPanel(context.flower),
    settings: () => settingsPanel(context),
    pet: () => petPanel(panel.id, context.petAwake),
    'how-to': howToPanel,
    birthday: () => ({ title: '10月29日', className: 'inspect-dialog', html: '<div class="short-note"><p class="eyebrow">1029 · birthday · LXY</p><h3>今天的任务，是慢慢玩。</h3><p>书房里有四张散落的画页。把它们找到、排好，再装订成一本小画册。</p><p>旁边的小机关也可以随时玩，不影响画册。</p><button class="primary-button" data-action="close">好，继续看看</button><button class="quiet-button" data-action="collection" data-id="gifts">打开礼物抽屉</button></div>' }),
    'ring-wait': () => ({ title: '还差一本画册', className: 'inspect-dialog', html: '<div class="short-note"><p>年轮灯下面留着一本书的位置。<br>先把桌上的画册装订好，再装上摇柄，慢慢转一圈。</p><button class="primary-button" data-action="close">去书桌看看</button></div>' }),
    restart: () => ({ title: '重新打开书房', className: 'inspect-dialog', html: '<div class="short-note"><p>这会清空当前这份游戏进度。可以先在设置里导出一份存档。</p><button class="primary-button" data-action="confirm-restart">重新开始</button><button class="quiet-button" data-action="close">继续这份进度</button></div>' }),
  };
  return (simple[panel.type] ?? howToPanel)();
}

function howToPanel() {
  return { title: '怎样探索这间书房', className: 'inspect-dialog', html: `<div class="short-note"><p>点击物件仔细看，左右箭头换个方向。键盘的 Tab 可以选中物件，Enter 打开。</p><p>收下的物品会留在下方，点击可以再看。合适的工具会放到机关旁，可以多次使用。</p><p>解开之后不必急着走，画页上的记录会收进手账。每个机关有三层提示，也可以退一步或复位。</p><p>右上角可以关闭声音。设置里可以导出进度，也可以显示可观察的物件。</p><button class="primary-button" data-action="close">慢慢来${icon('right')}</button></div>` };
}

function petPanel(id, awake) {
  const cat = id === 'cat';
  return { title: cat ? '小猫，借过一下' : '小狗也在等你', className: 'pet-dialog', html: `<div class="pet-portrait ${awake ? 'pet-awake' : ''}">${character('pets', (cat ? 0 : 2) + (awake ? 1 : 0), 2, 2, cat ? '小猫' : '小狗')}</div><p class="hand-note">${awake ? cat ? '伸个懒腰，再陪你待一会儿。' : '尾巴已经先回答了。' : cat ? '它给你留了旁边的一小块阳光。' : '有些快乐，会摇着尾巴跑过来。'}</p><button class="primary-button" data-action="pet-touch">${awake ? '再摸一下' : '轻轻摸一下'}</button><button class="quiet-button" data-action="flowers">窗边还有几朵花</button>` };
}

function settingsPanel(context) {
  const settings = context.state.settings;
  return { title: '把书房调舒服一点', className: 'settings-dialog', html: `<div class="settings-controls">${[['sound', '声音'], ['motion', '轻柔动画'], ['hotspots', '显示可观察的物件']].map(([key, label]) => `<label class="setting-toggle"><span>${label}</span><input type="checkbox" data-setting="${key}" ${settings[key] ? 'checked' : ''}></label>`).join('')}<label class="setting-volume"><span>音量</span><input type="range" min="0" max="1" step="0.05" value="${settings.volume}" data-setting="volume"></label><p class="hand-note">${context.writable ? '每一步都会自动保存。' : '此浏览器暂时不能自动保存，请导出进度。'}</p><div class="save-actions"><button class="quiet-button" data-action="export">导出存档</button><button class="quiet-button" data-action="import">导入存档</button><button class="quiet-button" data-action="fullscreen">${icon('full')}全屏</button></div><button class="text-button restart-link" data-action="restart">重新开始</button><p class="credits-note">一间原创生日解谜书房。角色插画为同人演绎，作品与角色版权归原权利人。<br>场景、美术来源与游戏制作说明见项目文档。</p></div>` };
}
