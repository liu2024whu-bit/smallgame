import {icon,escape} from './dom.js';
import {storyPosition} from '../core/story.js';
import {automaticSaveInfo,saveTime} from './auto-save.js';
import {DISPLAY_ASPECTS,displaySizeChoices} from '../data/display.js';

function displayOptions(settings,scene){
 const field=(key,label,options)=>`<label>${label}<select data-setting="${key}">${options.map(option=>`<option value="${option.id}" ${settings[key]===option.id?'selected':''}>${option.label}</option>`).join('')}</select></label>`;
 return `<div class="display-options">${field('displayAspect','画面比例',DISPLAY_ASPECTS)}${field('displaySize','画面大小',displaySizeChoices(settings,scene))}</div><p class="display-fit-note">窗口小些，画面也会跟着缩小。</p>`;
}

const toggle=(key,label,mark,value)=>`<label class="setting-toggle"><span>${icon(mark)}${label}</span>${key==='customCursor'?'<img class="cursor-sample" src="assets/cursors/point.svg" alt="" draggable="false">':''}<input type="checkbox" role="switch" data-setting="${key}" ${value?'checked':''}></label>`;
const volume=(key,label,value)=>`<label class="setting-volume"><span>${label}<output data-level="${key}">${Math.round(value*100)}%</output></span><input type="range" min="0" max="1" step=".01" value="${value}" data-setting="${key}"></label>`;
function savedFile(info={},automatic=false){
 const {recent,busy,failed}=info;
 if(busy)return '<p class="export-note" role="status">正在导出备份…</p>';
 if(failed)return '<div class="export-receipt" role="status"><p>备份没有导出成功。</p><button class="text-button" data-action="export-download">改用浏览器下载</button></div>';
 if(automatic&&!recent)return '<p class="folder-recovery-note">需要搬到另一台电脑时，可以导出备份。</p>';
 const message=automatic?(recent?.method==='download'?'备份在浏览器的下载记录里。':'备份已保存到刚才选的位置。'):(recent?.method==='download'?'位置可在浏览器的下载记录里查看。下次回这里，读取这份文件就能接上。':recent?'在刚才选的位置。下次读取这份文件，就能接上。':'给这段进度留一份，下次回来读取。');
 return `<div class="export-receipt">${recent?`<small>${recent.method==='picker'?'刚才存下的':'刚才导出的'} · ${saveTime(Date.parse(recent.time),true)}</small><span class="saved-filename">${escape(recent.name)}</span>`:''}<p>${message}</p></div>`;
}
function saveControls(context,autoSave){
 const managed=!!context.saves,automatic=autoSave?.mode==='folder',busy=context.saveTransfer?.busy;
 const files=`<div class="save-actions"><button class="quiet-button" data-action="export" ${busy?'disabled':''}>${icon('download')}导出备份</button><button class="quiet-button" data-action="import">${icon('upload')}${managed?'导入为新进度':'读取存档'}</button></div>${savedFile(context.saveTransfer,automatic)}`;
 return `${automaticSaveInfo({...context,autoSave})}${managed?`<div class="settings-save-main"><button class="primary-button" data-action="saves">${icon('book')}选择进度</button><button class="quiet-button" data-action="restart">${icon('feather')}新的开始</button></div><details class="save-file-options" data-fold="save-files"><summary>备份文件</summary>${files}</details>`:files+'<button class="text-button restart-link" data-action="restart">重新开始</button>'}`;
}
export function settingsPanel(context){
 const autoSave=context.view?.autoSavePresentation??context.autoSave,automatic=autoSave?.mode==='folder';
 const s=context.state.settings,{chapter,place}=storyPosition(context.state),section=context.view?.section??'sound';
 const pages=[['sound','声音','music'],['picture','画面','feather'],['save','进度','book']];
 const part=(id,title,body)=>`<fieldset class="settings-section" id="settings-${id}" role="tabpanel" aria-labelledby="settings-tab-${id}" ${section===id?'':'hidden'}><legend>${title}</legend>${body}</fieldset>`;
 return {title:'设置',className:'settings-dialog',html:`<div class="settings-controls"><nav class="settings-pages" role="tablist" aria-label="设置页">${pages.map(([id,label,mark])=>`<button id="settings-tab-${id}" role="tab" data-action="settings-page" data-id="${id}" aria-controls="settings-${id}" aria-selected="${section===id}" tabindex="${section===id?0:-1}">${icon(mark)}<span>${label}</span></button>`).join('')}</nav><div class="settings-leaf">${part('sound','听见小屋',`${toggle('sound','声音','sound',s.sound)}${volume('volume','总音量',s.volume)}${toggle('music','背景音乐','music',s.music)}<div class="sound-levels">${volume('musicVolume','背景音乐',s.musicVolume)}${volume('effectsVolume','物件的声音',s.effectsVolume)}</div><button class="setting-music-link quiet-button" data-action="music">${icon('music')}去唱片架挑一首${icon('right')}</button>`)}${part('picture','舒服一点',`${displayOptions(s,context.state.scene)}${toggle('motion','动画','feather',s.motion)}${toggle('clearText','字看得清楚一点','book',s.clearText)}${toggle('hotspots','让可点的物件亮一点','star',s.hotspots)}${toggle('customCursor','小小的光标','leaf',s.customCursor)}<div class="picture-options"><button class="text-button" data-action="how-to">操作小记</button><button class="text-button" data-action="fullscreen">${icon('full')}<span data-fullscreen-label>全屏看看</span></button></div><p class="setting-device-note" data-reduced-note hidden>已跟随系统设置，减弱动画。</p>`)}${part('save','下次接着',`<p class="save-place">${icon('book')}<span>${context.state.begun?escape(chapter):'还在门口'}<small>${context.state.begun?escape(place):'随时可以开始'}</small></span></p>${saveControls(context,autoSave)}`)}</div><footer class="settings-footer"><button class="text-button" data-action="about">这间小屋</button><button class="text-button" data-action="home">${icon('left')}回到门口</button></footer></div>`};
}
