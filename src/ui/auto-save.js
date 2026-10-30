import {escape} from './dom.js';

export function autoSaveLabel(writable,info){
 if(info?.mode!=='folder'&&!info?.slot)return writable?'已保存':'尚未保存';
 return ({ready:'准备保存',saving:'正在保存',saved:'已自动保存',error:'暂存在此窗口',conflict:'另有更新'})[info.phase]??'准备保存';
}
export function saveTime(value,full=false){
 if(!Number.isFinite(value)||value<=0||value>=8.64e15)return '';
 return new Intl.DateTimeFormat('zh-CN',{...(full?{month:'long',day:'numeric'}:{}),hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
}
const statusContents=(writable,info)=>`<span>${autoSaveLabel(writable,info)}</span>${info?.mode==='folder'&&saveTime(info.savedAt)?`<small>${info.phase==='saved'?'':'最近 '}${saveTime(info.savedAt)}</small>`:''}`;
export function autoSaveStatus(writable,info,className=''){
 if(className==='dialog-save-status'&&info?.mode!=='folder')return '';
 return `<span class="save-status ${className}" data-save-phase="${escape(info?.phase??'browser')}" title="${info?.savedAt?'上次保存 '+escape(saveTime(info.savedAt,true)):autoSaveLabel(writable,info)}">${statusContents(writable,info)}</span>`;
}
function note(writable,info){
 if(info?.mode!=='folder'&&!info?.slot)return writable?'进度会自动留在这台设备上。':'暂时没能自动保存，可以先导出备份。';
 return ({ready:'离开前会自动保存，下次可以继续。',saving:'正在保存刚才的进度。',saved:'下次打开，可以从这里继续。',error:'暂时没能写入存档，请先别关闭游戏。可以重试，或导出一份备份。',conflict:'这个进度在另一个窗口更新过。当前操作仍留在这里，可以另存一份。'})[info.phase]??'';
}
export function automaticSaveInfo({writable,autoSave}){
 const folder=autoSave?.mode==='folder';
 const disabled=autoSave?.readOnly?'disabled':'';
 return `<div class="automatic-save-info">${autoSave?.name?`<p class="automatic-save-location">当前 · ${escape(autoSave.name)}</p>`:''}<p class="settings-save-note" data-auto-save-note>${note(writable,autoSave)}</p>${folder||autoSave?.slot?`<p class="automatic-save-time" data-auto-save-time ${autoSave.savedAt?'':'hidden'}>${autoSave.savedAt?'上次保存 · '+saveTime(autoSave.savedAt,true):''}</p><div class="folder-save-actions"><button class="text-button" data-action="folder-retry" ${disabled} ${autoSave.phase==='error'?'':'hidden'}>重试保存</button><button class="text-button" data-action="folder-adopt" ${disabled} ${autoSave.phase==='conflict'?'':'hidden'}>读取更新后的进度</button><button class="text-button" data-action="folder-keep" ${disabled} ${autoSave.phase==='conflict'?'':'hidden'}>${autoSave?.slot?'另存当前进度':'保留当前进度'}</button></div><p class="folder-recovery-note" data-auto-recovery-note ${autoSave.recovery?'':'hidden'}>还有一份尚未写入的进度。</p><button class="text-button" data-action="folder-recover" ${disabled} ${autoSave.recovery?'':'hidden'}>另存找回的进度</button>`:''}</div>`;
}
// A receipt updates only these small indicators; it must not interrupt a drag,
// replace a puzzle, move focus or create a second saved-state subscription.
export function updateAutomaticSave(root,writable,info){
 for(const el of root.querySelectorAll('.save-status')){el.innerHTML=statusContents(writable,info);el.dataset.savePhase=info?.phase??'browser';el.title=info?.savedAt?'上次保存 '+saveTime(info.savedAt,true):autoSaveLabel(writable,info);}
 for(const el of root.querySelectorAll('[data-auto-save-time]')){el.hidden=!saveTime(info?.savedAt);el.textContent=info?.savedAt?'上次保存 · '+saveTime(info.savedAt,true):'';}
 for(const el of root.querySelectorAll('[data-auto-save-note]'))el.textContent=note(writable,info);
 for(const action of ['folder-retry','folder-adopt','folder-keep','folder-recover'])for(const el of root.querySelectorAll(`[data-action="${action}"]`))el.hidden=action==='folder-retry'?info?.phase!=='error':action==='folder-recover'?!info?.recovery:info?.phase!=='conflict';
 for(const el of root.querySelectorAll('[data-auto-recovery-note]'))el.hidden=!info?.recovery;
}
