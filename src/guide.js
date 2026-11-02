import {GUIDE_CHAPTERS,GUIDE_ENTRIES,GUIDE_ACTIVITY_NOTES} from './data/guide.js';
import {PUZZLE_BY_ID} from './data/puzzles.js';
import {KEEPSAKES} from './data/keepsakes.js';
import {ACHIEVEMENTS} from './data/activities.js';
import {SCENE_ART} from './data/assets.js';
import {escape} from './ui/dom.js';

const pictures={pages:['desk','window','collection'],bind:['atelier'],birthday:['birthday','party'],extra:['entry']};
const entryMarkup=(entry,index)=>`<article class="guide-entry" id="${entry.id}" data-guide-entry><header><span class="entry-number">${String(index+1).padStart(2,'0')}</span><div><p class="place">${escape(entry.where)}</p><h3>${escape(PUZZLE_BY_ID[entry.id].title)}</h3></div><a class="permalink" href="#${entry.id}" aria-label="定位到${escape(PUZZLE_BY_ID[entry.id].title)}">§</a></header><p class="idea">${escape(entry.idea)}</p><details class="solution"><summary>展开完整解法<span aria-hidden="true">＋</span></summary><div class="solution-content"><figure><a href="assets/guide/${entry.id}.jpg" target="_blank" rel="noopener" aria-label="放大${escape(PUZZLE_BY_ID[entry.id].title)}的机关画面"><img src="assets/guide/${entry.id}.jpg" width="1366" height="850" loading="lazy" decoding="async" alt="${escape(PUZZLE_BY_ID[entry.id].title)}的机关近景，点击可查看原图"></a><figcaption>机关近景 · 点图放大</figcaption></figure><ol>${entry.steps.map(step=>`<li>${escape(step)}</li>`).join('')}</ol>${entry.diagram?`<div class="pattern-note"><div class="chocolate-pattern" role="img" aria-label="空位从上到下是00100、11111、01110、01010、10001，1为空纸托">${entry.diagram.cells.map(v=>`<span class="${v?'empty':'filled'}">${v?'○':'●'}</span>`).join('')}</div><p>○ 空纸托<br>● 留在盒里的巧克力</p></div>`:''}<p class="after"><strong>接下来</strong>${escape(entry.after)}</p><p class="watch"><strong>容易漏的地方</strong>${escape(entry.watch)}</p></div></details></article>`;
document.querySelector('#guide-chapters').innerHTML=GUIDE_CHAPTERS.map(chapter=>`<section class="guide-chapter" id="chapter-${chapter.id}" data-guide-chapter><div class="chapter-heading"><span>${chapter.number}</span><div><h2>${escape(chapter.title)}</h2><p>${escape(chapter.intro)}</p></div></div><div class="scene-strip">${pictures[chapter.id].map(id=>`<a href="${SCENE_ART[id]}" target="_blank" rel="noopener"><img src="${SCENE_ART[id]}" width="1672" height="941" loading="lazy" alt="${{desk:'书桌',window:'窗边',collection:'收藏柜',atelier:'画桌',birthday:'生日桌',party:'准备台',entry:'门边'}[id]}的场景全貌"></a>`).join('')}</div>${GUIDE_ENTRIES.filter(entry=>entry.chapter===chapter.id).map(entry=>entryMarkup(entry,GUIDE_ENTRIES.indexOf(entry))).join('')}</section>`).join('');

document.querySelector('#keepsakes').innerHTML=`<h2 id="keepsakes-title">生日以后，还有几页</h2><p>巧克力盒、可可、四份甜和生日匣完成，火柴也拿到后，回生日桌点蛋糕。拿起火柴，分别点亮「2」和「0」的烛芯，再点「许好了」。生日结尾后还能回屋里继续解谜，不会因为结尾而漏掉支线。</p><p>礼物袋在生日结尾后可以拆开；薯条袋、琴腹短笺和雨廊的画页也都还在。</p><details class="collection-fold"><summary>收藏都留在哪里？</summary><div class="table-scroll"><table><thead><tr><th>收藏</th><th>去处</th></tr></thead><tbody>${KEEPSAKES.map(k=>`<tr><td>${escape(k.name)}</td><td>${k.pickup?'书桌上拿起木书签':`完成「${escape(PUZZLE_BY_ID[k.puzzle].title)}」后记入手账`}</td></tr>`).join('')}</tbody></table></div></details><details class="collection-fold"><summary>小记、燕云画页与最后的彩蛋</summary><div class="table-scroll"><table><thead><tr><th>小记</th><th>怎么留下</th></tr></thead><tbody>${ACHIEVEMENTS.map(a=>`<tr><td>${escape(a.title)}${a.extra?' <small>夹页</small>':''}</td><td>${escape(GUIDE_ACTIVITY_NOTES[a.id]??'')}</td></tr>`).join('')}</tbody></table></div><p>前十二张小记齐了，并看过生日结尾，手账里会出现额外入口。燕云与钢琴的两张夹页单独保留，不会额外卡住彩蛋。</p><p>进小剧场后给手柄上弦，再点信封。手柄可以拖转，也可以获得焦点后按六次右方向键。</p></details>`;

const entries=[...document.querySelectorAll('[data-guide-entry]')];
const searchable=GUIDE_ENTRIES.map(entry=>[PUZZLE_BY_ID[entry.id].title,entry.where,entry.idea,...entry.steps,entry.after,entry.watch].join(' ').toLocaleLowerCase());
document.querySelector('#guide-search').addEventListener('input',event=>{
 const query=event.target.value.trim().toLocaleLowerCase();let count=0;
 entries.forEach((el,i)=>{el.hidden=!!query&&!searchable[i].includes(query);if(!el.hidden)count++;});
 document.querySelectorAll('[data-guide-chapter]').forEach(el=>{el.hidden=![...el.querySelectorAll('[data-guide-entry]')].some(entry=>!entry.hidden);});
 document.querySelector('#search-status').textContent=query?(count?`找到 ${count} 处。完整答案仍收在折页里。`:'这一页没有找到，可以试试机关或道具的另一个名字。'):'';
});
document.querySelector('.chapter-links').addEventListener('click',event=>{if(!event.target.closest('a'))return;const search=document.querySelector('#guide-search');if(search.value){search.value='';search.dispatchEvent(new Event('input'));}});
if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());

let printState;
addEventListener('beforeprint',()=>{printState=[...document.querySelectorAll('details')].map(el=>[el,el.open]);printState.forEach(([el])=>el.open=true);});
addEventListener('afterprint',()=>{printState?.forEach(([el,open])=>el.open=open);printState=null;});
document.querySelector('#print-guide').addEventListener('click',async event=>{
 const button=event.currentTarget,label=button.textContent;button.disabled=true;button.textContent='带上画面…';
 try{
  await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>null);}));
  if([...document.images].some(img=>!img.naturalWidth)){
   document.querySelector('#search-status').textContent='有几幅画面还没带上，稍后再试试。';return;
  }
  window.print();
 }finally{button.disabled=false;button.textContent=label;}
});
fetch('./release.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(release=>{if(release)document.querySelector('#guide-version').textContent=`当前版本 ${release.version} · 完整解法默认折叠`;}).catch(()=>{});
