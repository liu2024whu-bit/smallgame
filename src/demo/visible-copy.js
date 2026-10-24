// Inspect actual visible native text, not another hand-maintained copy of the game's words.
export function visibleCopy(root){
  const blocks=new Map();
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  function visible(element){
    for(let el=element;el&&el!==root.parentElement;el=el.parentElement){
      const s=getComputedStyle(el);
      if(el.hidden||el.inert||el.classList.contains('sr-only')||s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;
    }
    return true;
  }
  while(walker.nextNode()){
    const text=walker.currentNode.textContent.replace(/\s+/g,' ').trim(),parent=walker.currentNode.parentElement;
    if(!text||!parent||!visible(parent))continue;
    if(parent.closest('svg,script,style'))continue;
    const block=parent.closest('[data-copy-group]')??parent.closest('h1,h2,h3,h4,p,button,summary,label,legend,small,a,output')??parent;
    if(!blocks.has(block))blocks.set(block,[]);
    blocks.get(block).push(text);
  }
  return [...blocks.values()].map(words=>words.join(' ')).join('\n\n');
}
