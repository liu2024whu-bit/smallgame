import {escape,icon} from './dom.js';
import {SCENE_ART} from '../data/assets.js';

export function bookmarkTime(value){
 if(!Number.isFinite(value)||value<=0)return '还没开始';
 return new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
}
function saveCard(slot,active,{deleted=false,busy=false}={}){
 const s=slot.summary,current=slot.id===active,disabled=busy||!slot.readable;
 const label=s?(s.begun?s.ending?'生日过后，仍可回来':s.chapter:'还没进屋'):'这份进度暂时打不开';
 return `<article class="bookmark-card ${current?'bookmark-current':''} ${deleted?'bookmark-deleted':''}"><button class="bookmark-select" data-action="${deleted?'save-restore':'save-select'}" data-id="${escape(slot.id)}" ${disabled?'disabled':''} aria-label="${deleted?'恢复':'继续'}${escape(slot.name)}"><span class="bookmark-picture"><img src="${SCENE_ART[s?.scene]??SCENE_ART.desk}" alt="" draggable="false">${current?`<span class="bookmark-ribbon">${icon('feather')}正在玩</span>`:''}</span><span class="bookmark-caption"><strong>${escape(slot.name)}</strong><span>${escape(label)}</span><small>${s?.begun?escape(s.place)+' · '+s.solved+' / '+s.total+' 处机关':s?'从头开始':'原文件仍保留'}${slot.recovered?' · 已找回备份':''}</small><time>${bookmarkTime(slot.savedAt)}</time></span><span class="bookmark-continue">${deleted?'恢复这份':current?'接着玩':'选择这份'}${icon('right')}</span></button>${deleted?'':`<div class="bookmark-tools"><button data-action="save-edit" data-edit="rename" data-id="${escape(slot.id)}" ${busy?'disabled':''}>改名</button>${current?`<button data-action="save-edit" data-edit="copy" ${busy?'disabled':''}>另存一份</button>`:`<button data-action="save-edit" data-edit="delete" data-id="${escape(slot.id)}" ${busy?'disabled':''}>删除</button>`}</div>`}</article>`;
}
export function saveShelfPanel({saves,view={}}){
 const {slots=[],active,mode,limit=32}=saves??{},living=slots.filter(s=>!s.deletedAt).sort((a,b)=>Number(b.id===active)-Number(a.id===active)||(b.savedAt??b.createdAt)-(a.savedAt??a.createdAt)),archived=slots.filter(s=>s.deletedAt).sort((a,b)=>b.deletedAt-a.deletedAt),busy=!!view.saveBusy;
 const editing=view.saveEdit,slot=slots.find(e=>e.id===view.saveId),current=slots.find(e=>e.id===active);
 let content;
 if(editing){
  const label=({new:'新的开始',copy:'另存一份',rename:'换个名字',delete:'删除这份进度'})[editing];
  const value=view.saveName??(editing==='copy'?Array.from(current?.name??'我的进度').slice(0,24).join('')+' · 另一份':editing==='rename'?slot?.name:'');
  content=`<div class="bookmark-editor"><span class="bookmark-editor-mark">${icon(editing==='delete'?'book':'feather')}</span><h3>${label}</h3>${editing==='delete'?`<p>“${escape(slot?.name)}”会移到已删除的进度里，之后仍可恢复。</p>`:`<form data-save-editor><label for="bookmark-name">进度名称</label><input id="bookmark-name" name="bookmark-name" data-focus="bookmark-name" maxlength="32" autocomplete="off" placeholder="起个容易认的名字" value="${escape(value)}" ${busy?'disabled':''}><p>${editing==='new'?'从门口开始，原来的进度会留着。':editing==='copy'?'把当前这一刻另留一份，之后可以各自接着玩。':'只改名称，游戏进度不变。'}</p><button type="submit" class="sr-only" tabindex="-1">确定</button></form>`}<div class="bookmark-editor-actions"><button class="quiet-button" data-action="save-list" ${busy?'disabled':''}>取消</button><button class="primary-button" data-action="save-confirm" ${busy?'disabled':''}>${busy?'请稍等…':editing==='delete'?'移到已删除':editing==='new'?'开始':editing==='copy'?'另存':'确定'}</button></div></div>`;
 }else content=`<div class="bookmark-intro"><p>想接着哪一次？</p><button class="quiet-button" data-action="save-edit" data-edit="new" ${busy||living.length>=limit?'disabled':''}>${icon('feather')}新的开始</button></div><div class="bookmark-grid">${living.map(s=>saveCard(s,active,{busy})).join('')}</div>${archived.length?`<details class="bookmark-archive" data-fold="save-archive"><summary>已删除的进度 <small>${archived.length}</small></summary><div class="bookmark-grid">${archived.map(s=>saveCard(s,active,{deleted:true,busy})).join('')}</div></details>`:''}<p class="bookmark-location">${mode==='folder'?'进度会自动保存在游戏旁的“存档”文件夹。':'进度会自动留在这个浏览器里。'}</p>`;
 return {title:'选择进度',className:'save-shelf-dialog'+(!editing&&living.length===1&&!archived.length?' save-shelf-single':''),html:`<div class="save-shelf" aria-busy="${busy}">${content}<p class="bookmark-error" role="status" ${view.saveError?'':'hidden'}>${escape(view.saveError)}</p></div>`};
}
