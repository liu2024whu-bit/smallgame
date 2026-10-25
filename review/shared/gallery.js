const control=document.querySelector('#view'),nav=document.querySelector('[role=tablist]'),pic=document.querySelector('#picture'),zoom=document.querySelector('#zoom');
try{
 const response=await fetch(document.querySelector('main').dataset.gallery);if(!response.ok)throw Error('Gallery not loaded');
 const {versions,views}=await response.json();let selected=versions.length-1;
 control.innerHTML='<option value="compare">改版对照</option>'+Object.entries(views).map(([id,entry])=>`<option value="${id}">${entry.title}</option>`).join('');
 nav.innerHTML=versions.map((entry,index)=>`<button role="tab" data-version="${index}">${entry.label??'第'+(index+1)+'版'}</button>`).join('');
 function render(){
  nav.hidden=control.value!=='compare';nav.querySelectorAll('[data-version]').forEach(b=>{const on=Number(b.dataset.version)===selected;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;});
  const entry=control.value==='compare'?versions[selected]:views[control.value];pic.src=entry.src;pic.alt=entry.title;for(const key of ['title','change','reason'])document.querySelector('#'+key).textContent=entry[key];
 }
 control.onchange=render;nav.onclick=event=>{const button=event.target.closest('[data-version]');if(button){selected=Number(button.dataset.version);render();}};
 nav.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();selected=event.key==='Home'?0:event.key==='End'?versions.length-1:(selected+(event.key==='ArrowRight'?1:-1)+versions.length)%versions.length;render();nav.querySelector('[data-version="'+selected+'"]').focus();};
 document.querySelector('.picture').onclick=()=>{zoom.querySelector('img').src=pic.src;zoom.showModal();};zoom.querySelector('button').onclick=()=>zoom.close();zoom.onclick=event=>{if(event.target===zoom)zoom.close();};render();
}catch(error){document.querySelector('#title').textContent='画面暂时没能展开，刷新后再看看。';console.error(error);}
