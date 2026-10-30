import {navigationPanel} from './navigation.js';
import { endingPanel } from './ending.js';
import { puzzlePanel } from './workbench.js';
import { journalPanel, collectionPanel, keepsakePanel, readingPanel, interestsPanel, flowersPanel, itemPanel } from './notebook.js';
import { petPanel } from './pets.js';
import { encorePanel } from './encore.js';
import { evidencePanel } from './evidence.js';
import { campusPanel } from './campus.js';
import {passagePanel,birthdayNotePanel,birthdayWaitPanel,candlePanel} from './birthday.js';
import { flowerNotePanel } from './puzzles/flowers.js';
import { birthdayToolPanel } from './birthday-tools.js';
import { settingsPanel } from './settings.js';
import { aboutPanel } from './welcome.js';
import { musicPanel } from './music.js';
import { MUSIC_BY_ID } from '../data/music.js';
import {librarySlipPanel} from './library-papers.js';
import {deskSketchbook} from './desk-sketchbook.js';
import { escape,icon } from './dom.js';
import {saveShelfPanel} from './saves.js';

export function renderPanel(panel, context) {
  const simple = {
    puzzle: () => puzzlePanel(panel.id, context),
    evidence: () => evidencePanel(panel.id, context),
    sketchbook:()=>deskSketchbook(context),
    campus: () => campusPanel(Number(panel.id), context),
    'flower-note':()=>flowerNotePanel(context.state),
    passage:()=>passagePanel(panel.id,context),
    'birthday-note':()=>birthdayNotePanel(panel.id,context),
    candles:()=>candlePanel(context),
    'birthday-wait':()=>birthdayWaitPanel(context),
    ambient: () => ({ title: '雨声', className: 'inspect-dialog', html: '<div class="rain-listening"><p>雨落在窗沿上。</p></div>' }),
    journal: () => journalPanel(context.state, panel.tab, context.view),
    collection: () => collectionPanel(panel.id, context),
    keepsake: () => keepsakePanel(panel.id, context.state),
    reading: () => readingPanel(context.state),
    encore: () => encorePanel(context),
    interests: interestsPanel,
    flowers: () => flowersPanel(context.flower),
    item: () => panel.id==='borrowSlip'?librarySlipPanel(context):birthdayToolPanel(panel.id,context)??itemPanel(panel.id),
    ending: () => endingPanel(context),
    rooms:()=>navigationPanel(context),
    settings: () => settingsPanel(context),
    saves:()=>saveShelfPanel(context),
    music:()=>musicPanel(context),
    about:aboutPanel,
    'music-remove':()=>({title:'这张唱片',className:'inspect-dialog',html:`<div class="short-note"><p>移除《${escape(MUSIC_BY_ID[panel.id]?.title)}》的本地音源？<br>歌单里的位置会留着，以后还可以再选。</p><button class="quiet-button" data-action="close">先留着</button><button class="primary-button" data-action="music-remove-confirm" data-id="${escape(panel.id)}">移除音源</button></div>`}),
    pet: () => petPanel(panel.id, context.petAwake),
    'how-to': howToPanel,
    birthday: () => ({ title: '10月29日', className: 'inspect-dialog', html: '<div class="short-note"><h3>给你</h3><p>还没到拆开的那一刻呢。</p><button class="text-button" data-action="close">放回去</button></div>' }),
    restart: () => ({ title: '重新来过', className: 'inspect-dialog', html: '<div class="short-note"><p>从门口重新开始，这次的游戏进度会清掉。声音、画面设置和本地唱片会留着。<br>想留住这次的话，可以先回设置导出一份备份。</p><button class="quiet-button" data-action="close">先留着</button><button class="primary-button" data-action="confirm-restart">重新开始</button></div>' }),
  };
  return (simple[panel.type] ?? howToPanel)();
}

function howToPanel() {
  return { title: '怎么玩', className: 'inspect-dialog', html: `<div class="short-note"><p>屋里的小东西都能凑近看，左右箭头通往另一边。收下的物件会在手边，用完也还在，说不定不只派一次用场。</p><p>线索留在手账里，忘了还有它记着。卡住时，「一点提醒」会多聊一句；想反悔，也有「退一步」。声音、动画和存档都在设置里。</p><details class="keyboard-note" data-fold="keyboard"><summary>键盘也有一份</summary><p>Tab 选物件，Enter 打开；房间里的左右方向键可以转身。能拖动的物件，也留了按钮或方向键的走法。</p></details><button class="primary-button" data-action="close">大概懂了${icon('right')}</button></div>` };
}
