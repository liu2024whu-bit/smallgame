// Inspect actual visible native text, not another hand-maintained copy of the game's words.
export function visibleCopy(root){
  const blocks=new Map();
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  function visible(element){
    for(let el=element;el&&el!==root.parentElement;el=el.parentElement){
      if(el.tagName==='DETAILS'&&!el.open&&!el.querySelector(':scope > summary')?.contains(element))return false;
      const s=getComputedStyle(el);
      if(el.hidden||el.inert||el.hasAttribute('data-copy-hidden')||el.classList.contains('sr-only')||s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;
    }
    return true;
  }
  function insideApertures(rect,parent){
    let {left,right,top,bottom}=rect;
    for(let el=parent;el&&el!==root.parentElement;el=el.parentElement){
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      if(['hidden','clip'].includes(s.overflowX)){left=Math.max(left,r.left);right=Math.min(right,r.right);}
      if(['hidden','clip'].includes(s.overflowY)){top=Math.max(top,r.top);bottom=Math.min(bottom,r.bottom);}
      if(right-left<.5||bottom-top<.5)return false;
    }
    return true;
  }
  while(walker.nextNode()){
    const text=walker.currentNode.textContent.replace(/\s+/g,' ').trim(),parent=walker.currentNode.parentElement;
    if(!text||!parent||!visible(parent))continue;
    if(parent.closest('svg,script,style'))continue;
    // Hard apertures (a drum or mirror) are different from a page the reviewer
    // can scroll. Exclude text wholly outside those apertures, not offscreen
    // paragraphs that still belong to the current page.
    const range=document.createRange();range.selectNodeContents(walker.currentNode);
    if(!insideApertures(range.getBoundingClientRect(),parent))continue;
    const block=parent.closest('[data-copy-group]')??parent.closest('h1,h2,h3,h4,p,button,summary,label,legend,small,a,output')??parent;
    if(!blocks.has(block))blocks.set(block,[]);
    blocks.get(block).push(text);
  }
  // Printed raster letters have no DOM text node. Their view supplies a label
  // only when that specific painted part is exposed; clipped/hidden layers stay out.
  for(const element of root.querySelectorAll('[data-painted-copy]'))if(visible(element)&&insideApertures(element.getBoundingClientRect(),element))blocks.set(element,['画中数字：'+element.dataset.paintedCopy]);
  return [...blocks.values()].map(words=>words.join(' ')).join('\n\n');
}
