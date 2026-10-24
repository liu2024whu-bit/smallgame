import {escape,icon} from './ui/dom.js';
import {REVIEW_CASES} from './demo/fixtures.js';

export function mountReview({onLock=()=>{}}={}){
  const host=document.querySelector('#review-app'),abort=new AbortController();
  const groups=[...new Set(REVIEW_CASES.map(entry=>entry.group))];
  host.innerHTML=`<header class="review-header"><div><p>第20圈以前 · 维护后台</p><h1>小屋工作间</h1></div><nav><a href="index.html">正式游戏 ${icon('right')}</a><button id="review-lock" class="text-button">重新锁上</button></nav></header><div class="review-controls"><label class="review-search">查询<input id="review-search" type="search" placeholder="关卡、角色、纸面文字…" autocomplete="off"></label><label>翻到<select id="review-scene"></select></label><button id="review-previous" class="quiet-button" aria-label="上一处">${icon('left')}</button><button id="review-next" class="quiet-button" aria-label="下一处">${icon('right')}</button><button id="review-restart" class="text-button">重看这一处</button><label class="review-screen-label">画面<select id="review-screen"><option value="wide">电脑</option><option value="phone">手机 390</option><option value="small">小屏 320</option></select></label></div><div class="review-options"><div id="review-phases"></div><span id="review-count"></span><label><input type="checkbox" id="review-readable">清晰字体</label><label><input type="checkbox" id="review-reduced">减少动画</label></div><div class="review-layout"><section class="review-play"><iframe id="review-frame" src="review-frame.html" title="真实游戏演示" allow="autoplay; fullscreen"></iframe><p>可以实际拖动、转动和解谜。这些演示进度只留在本页。</p></section><aside class="review-copy"><header><h2 id="copy-title">当前画面的文字</h2><span id="copy-id">opening</span></header><p id="copy-source"></p><textarea id="copy-text" aria-label="当前画面的文字" readonly></textarea><div><button id="copy-current" class="quiet-button">复制这页</button><button id="copy-all" class="text-button">下载全部文字</button></div><p id="review-status" role="status">正式存档不受影响。编号可以用来指出要改的地方。</p></aside></div>`;
  const iframe=host.querySelector('iframe'),selector=host.querySelector('#review-scene'),status=host.querySelector('#review-status');
  const api=()=>iframe.contentWindow?.reviewAPI;
  let loading=false,exporting=false,closed=false,ticket=0,filtered=[...REVIEW_CASES];
  function filter(){
    const words=host.querySelector('#review-search').value.trim().toLowerCase().split(/\s+/).filter(Boolean),selected=selector.value;
    filtered=REVIEW_CASES.filter(spec=>words.every(word=>[spec.id,spec.name,spec.group,spec.source,spec.keywords??''].join(' ').toLowerCase().includes(word)));
    selector.innerHTML=groups.map(group=>{const entries=filtered.filter(entry=>entry.group===group);return entries.length?`<optgroup label="${group}">${entries.map(entry=>`<option value="${entry.id}">${escape(entry.name)}</option>`).join('')}</optgroup>`:'';}).join('');
    if(filtered.some(s=>s.id===selected))selector.value=selected;
    selector.disabled=!filtered.length;
    host.querySelector('#review-count').textContent=filtered.length===REVIEW_CASES.length?`全部 ${REVIEW_CASES.length} 处`:`找到 ${filtered.length} 处`;
    if(!filtered.length)status.textContent='换个名字或关键词看看。';
  }
  function phases(id){
    const spec=REVIEW_CASES.find(s=>s.id===id),puzzle=spec?.puzzle;
    host.querySelector('#review-phases').innerHTML=puzzle?[[puzzle,'初样'],[puzzle+'-done','已解开'],[puzzle+'-hints','提醒']].map(([key,label])=>`<button class="text-button" data-review-phase="${key}" aria-pressed="${key===id}">${label}</button>`).join(''):'';
  }
  function update(data){
    if(closed||!data)return;
    host.querySelector('#copy-title').textContent=data.title;host.querySelector('#copy-id').textContent=data.id;
    host.querySelector('#copy-source').textContent=data.source;host.querySelector('#copy-text').value=data.text;phases(data.id);
  }
  async function load(id){
    if(!api()||exporting||!id||closed)return;
    if(!filtered.some(spec=>spec.id===id)){host.querySelector('#review-search').value='';filter();}
    const mine=++ticket;loading=true;
    try{
      const data=await api().load(id,{clearText:host.querySelector('#review-readable').checked,reduced:host.querySelector('#review-reduced').checked});
      if(mine!==ticket||closed)return;
      selector.value=id;update(data);status.textContent='这一处可以直接玩，文字会跟着画面变。';
    }catch(error){if(mine===ticket)status.textContent='这一页没能展开，重看一次试试。';console.error(error);}
    finally{if(mine===ticket)loading=false;}
  }
  window.addEventListener('message',event=>{
    if(closed||event.source!==iframe.contentWindow||event.origin!==location.origin)return;
    if(event.data.type==='smallgame-review-ready')load(selector.value);
    if(event.data.type==='smallgame-review'&&!loading&&!exporting)update(event.data);
  },{signal:abort.signal});
  selector.onchange=()=>load(selector.value);
  host.querySelector('#review-search').oninput=()=>{filter();if(filtered.length&&selector.value!==host.querySelector('#copy-id').textContent)load(selector.value);};
  for(const [id,delta] of [['review-previous',-1],['review-next',1]])host.querySelector('#'+id).onclick=()=>{
    if(!filtered.length)return;const index=Math.max(0,filtered.findIndex(s=>s.id===selector.value));load(filtered[(index+delta+filtered.length)%filtered.length].id);
  };
  host.querySelector('#review-restart').onclick=()=>load(selector.value);
  host.querySelector('#review-screen').onchange=event=>{const play=host.querySelector('.review-play');play.classList.toggle('review-phone',event.target.value==='phone');play.classList.toggle('review-small',event.target.value==='small');};
  for(const id of ['review-readable','review-reduced'])host.querySelector('#'+id).onchange=()=>load(selector.value);
  host.querySelector('#review-phases').onclick=event=>{const button=event.target.closest('[data-review-phase]');if(button)load(button.dataset.reviewPhase);};
  host.querySelector('#copy-current').onclick=async()=>{
    const field=host.querySelector('#copy-text');
    try{await navigator.clipboard.writeText(field.value);status.textContent='复制好了。';}catch{field.focus();field.select();status.textContent='文字已选中，可以直接复制。';}
  };
  async function exportCopy(){
    if(!api()||exporting||closed)return;
    exporting=true;const restore=selector.value,rows=[],controls=[...host.querySelectorAll('.review-controls input,.review-controls select,.review-controls button,.review-options input,#review-lock,#copy-all')];
    const disabled=controls.map(el=>el.disabled);controls.forEach(el=>el.disabled=true);
    try{
      for(const [index,spec] of REVIEW_CASES.entries()){
        if(closed)return;status.textContent=`正在翻页：${index+1} / ${REVIEW_CASES.length}`;
        rows.push(await api().load(spec.id,{instant:true}));
      }
      const markdown='# 第20圈以前 · 文字检阅\n\n从真实页面提取。编号可用于反馈修改；提醒只在主动打开时出现。含机关初样、完成后与提醒、收藏、物件、校园、小记及系统回应。\n\n'+rows.map(row=>`## ${row.id} · ${row.title}\n\n来源：${row.source}\n\n${row.text}\n`).join('\n');
      const blob=new Blob([markdown],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='第20圈以前-文字检阅.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      status.textContent='全部文字已整理好。';return rows.length;
    }finally{exporting=false;controls.forEach((el,i)=>el.disabled=disabled[i]);if(!closed)await load(restore);}
  }
  host.querySelector('#copy-all').onclick=exportCopy;host.querySelector('#review-lock').onclick=onLock;
  window.reviewExport=exportCopy;filter();const initial=new URL(location.href).searchParams.get('page');if(REVIEW_CASES.some(spec=>spec.id===initial))selector.value=initial;
  return ()=>{closed=true;ticket++;abort.abort();iframe.src='about:blank';delete window.reviewExport;host.replaceChildren();};
}
